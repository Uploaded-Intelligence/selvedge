// Theseus lens — substrate-agnostic. Feed it snapshots of any 2D world of small
// integers (+ optionally a per-cell count of writes since the last snapshot).
//   T  turnover    : how much a cell's matter is being replaced
//   P  persistence : of the cells nearby whose matter was JUST replaced, what share still
//                    carry the old form — in the best frame (max over small shifts and lags).
//                    Judged only on turned-over cells: an untouched neighbourhood proves nothing.
//                    Chance-corrected: searching shifts×lags finds lucky matches, badly so in
//                    small alphabets (binary CA), so P is scored above the expected best-by-luck.
//   living = T·P   (matter turns over, form persists)
//   front  = T·(1−P)  (turnover without persistence: noise, war, invasion)
//   inert  = low T
export class Lens {
  constructor(w, h, opts = {}) {
    this.w = w; this.h = h; this.n = w * h;
    this.radius = opts.radius ?? 1;        // shift tolerance; 0 = Eulerian (same-place) lens
    this.patch = opts.patch ?? 2;          // patch half-size
    this.lags = opts.lags ?? [1];
    this.decay = opts.decay ?? 0.8;
    this.eps = opts.eps ?? 0.02;
    this.maxLag = Math.max(...this.lags);
    this.frames = [];
    this.T = new Float32Array(this.n);
    this.P = new Float32Array(this.n);
    this.living = new Float32Array(this.n);
    this.front = new Float32Array(this.n);
  }

  // frame: Uint8Array (copied). activity: optional per-cell write counts for the interval.
  push(frame, activity) { this.begin(frame, activity); this.work(Infinity); }

  // Time-sliced form for UI threads: begin() snapshots, work(ms) returns true when the pass is complete.
  begin(frame, activity) {
    const { n, T, decay } = this;
    const cur = Uint8Array.from(frame);
    const last = this.frames[this.frames.length - 1];
    const act = this.act = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      const a = activity ? Math.min(activity[i], 1) : (last && last[i] !== cur[i] ? 1 : 0);
      act[i] = a; T[i] = T[i] * decay + a * (1 - decay);
    }
    const hist = new Float64Array(256); for (let i = 0; i < n; i++) hist[cur[i]]++;
    this.p0 = hist.reduce((a, c) => a + (c / n) ** 2, 0);   // chance two cells agree
    this.frames.push(cur);
    if (this.frames.length > this.maxLag + 1) this.frames.shift();
    this.cur = cur; this.row = 0;
  }

  get busy() { return this.row < this.h; }

  work(ms) {
    const t0 = ms === Infinity ? 0 : performance.now();
    while (this.row < this.h) {
      this.#persistence(this.cur, this.row, Math.min(this.h, this.row + 8)); this.row += 8;
      if (ms !== Infinity && performance.now() - t0 > ms) break;
    }
    return this.row >= this.h;
  }

  #persistence(cur, y0, y1) {
    const { w, h, n, T, P, living, front, radius: R, patch: K, eps, act, p0 } = this;
    const z = Math.sqrt(2 * Math.log(Math.max(2, this.lags.length * (2 * R + 1) ** 2)));
    for (let i = y0 * w; i < y1 * w; i++) {
      if (T[i] < eps) { P[i] = 0; living[i] = 0; front[i] = 0; continue; }
      const x = i % w, y = (i / w) | 0;
      let best = -1, bestK = 1;
      for (const lag of this.lags) {
        const prev = this.frames[this.frames.length - 1 - lag];
        if (!prev) continue;
        for (let sy = -R; sy <= R; sy++) for (let sx = -R; sx <= R; sx++) {
          let match = 0, union = 0;
          for (let dy = -K; dy <= K; dy++) {
            const yc = ((y + dy + h) % h) * w, yp = ((y + dy + sy + h + h) % h) * w;
            for (let dx = -K; dx <= K; dx++) {
              const j = yc + (x + dx + w) % w;
              if (!act[j]) continue;
              union++; if (cur[j] === prev[yp + (x + dx + sx + w + w) % w]) match++;
            }
          }
          const s = union ? match / union : -1;
          if (s > best) { best = s; bestK = union; }
        }
      }
      if (best < 0) best = P[i]; // nothing turned over nearby this interval: hold last judgement
      else { const base = Math.min(0.95, p0 + z * Math.sqrt(p0 * (1 - p0) / bestK)); best = Math.max(0, (best - base) / (1 - base)); }
      P[i] = best; living[i] = T[i] * best; front[i] = T[i] * (1 - best);
    }
  }
}
