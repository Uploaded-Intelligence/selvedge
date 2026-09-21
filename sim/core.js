// SELVEDGE substrate: one torus of bytes, no tapes, no organisms given.
// A "spark" lands somewhere, faces one of 4 ways, and reads the bytes along a
// straight ray as code. Two heads (h0,h1) start under it and move RELATIVE to
// the ray, so a byte-string means the same thing in every orientation.
// Pure module: no DOM, seeded PRNG — runs identically in Node and a Worker.

export const OPS = ['·', 'F0', 'B0', 'L0', 'R0', 'F1', 'B1', 'L1', 'R1', '+', '-', '.', ',', '[', ']'];
const F0 = 1, B0 = 2, L0 = 3, R0 = 4, F1 = 5, B1 = 6, L1 = 7, R1 = 8, INC = 9, DEC = 10, CP01 = 11, CP10 = 12, OPEN = 13, CLOSE = 14;
export const OP = { F0, B0, L0, R0, F1, B1, L1, R1, INC, DEC, CP01, CP10, OPEN, CLOSE };

export const DEFAULTS = {
  w: 256, h: 256, seed: 1,
  density: 1,          // byte values per opcode: 1 → 14/256 are code (BFF-like), 8 → 112/256
  stepCap: 128,        // max instructions per spark
  sparksPerEpoch: 0,   // 0 → w*h/16
  mutation: 1 / 4096,  // cosmic rays per cell per epoch
  copyEnabled: true,   // false = negative control physics
  speciesMinCopies: 8,
  follow: 0,           // P(a spark that copied ≥followMin bytes begets a child spark where it first wrote)
  followMin: 4,
  arith: 1,            // 0 = + and - are inert (tests whether in-place arithmetic is the soup's heat source)
  blockCopy: 0,        // 1 = copy ops also advance both heads one cell along the ray (LDIR-like)
  refire: 0,           // P(a productive spark also fires again in place next epoch) — metabolism: bodies get re-woven
  followOn: 0,         // 0 = any effective copies count (stamps included) · 1 = only copies that move to a new target
  randomFrac: 0.25,    // share of each epoch's spark budget reserved for random landings
};

export class World {
  constructor(opts = {}) {
    const o = this.o = { ...DEFAULTS, ...opts };
    if (!o.sparksPerEpoch) o.sparksPerEpoch = (o.w * o.h) >> 4;
    this.w = o.w; this.h = o.h; this.n = o.w * o.h;
    this.s = (o.seed * 2654435761) >>> 0 || 1;
    this.cells = new Uint8Array(this.n);
    this.activity = new Uint16Array(this.n);   // writes since last clearActivity()
    this.table = new Uint8Array(256);          // byte → opcode (0 = inert data). byte 0 is never code.
    for (let op = 1; op <= 14; op++) for (let k = 0; k < o.density; k++) this.table[1 + (op - 1) * o.density + k] = op;
    this.walls = null;                         // optional Uint8Array mask: sparks & heads can't cross
    this.epoch = 0;
    this.stats = { sparks: 0, steps: 0, copies: 0, writes: 0 };
    this.species = new Map();                  // hash → {count, code}
    this.queue = []; this.next = [];           // follow-sparks: [pos, dir, ...]
    this.trace = null;                         // set to [] to record sparks for rendering
    for (let i = 0; i < this.n; i++) this.cells[i] = this.rand() * 256;
  }

  rand() { let s = this.s; s ^= s << 13; s ^= s >>> 17; s ^= s << 5; this.s = s >>>= 0; return s / 4294967296; }

  byteFor(op, k = 0) { return 1 + (op - 1) * this.o.density + k; }

  move(i, dir) { // torus step; dir 0=E 1=S 2=W 3=N
    const w = this.w, h = this.h, x = i % w, y = (i / w) | 0;
    switch (dir & 3) {
      case 0: return y * w + (x + 1) % w;
      case 1: return ((y + 1) % h) * w + x;
      case 2: return y * w + (x + w - 1) % w;
      default: return ((y + h - 1) % h) * w + x;
    }
  }

  write(i, v) { this.cells[i] = v; if (this.activity[i] < 65535) this.activity[i]++; this.stats.writes++; }

  // Run one spark. Returns number of copy ops performed.
  spark(p, d, rec) {
    const { cells, table, o } = this, cap = o.stepCap;
    let ip = p, h0 = p, h1 = p, copies = 0, off = 0, loopA = 0, loopB = 0, looped = false, steps = 0, first = -1, moved = 0, lastT = -1, lastU = -1;
    const walls = this.walls;
    for (; steps < cap; steps++) {
      const op = table[cells[ip]];
      let t;
      switch (op) {
        case F0: t = this.move(h0, d); if (!walls || !walls[t]) h0 = t; break;
        case B0: t = this.move(h0, d + 2); if (!walls || !walls[t]) h0 = t; break;
        case L0: t = this.move(h0, d + 3); if (!walls || !walls[t]) h0 = t; break;
        case R0: t = this.move(h0, d + 1); if (!walls || !walls[t]) h0 = t; break;
        case F1: t = this.move(h1, d); if (!walls || !walls[t]) h1 = t; break;
        case B1: t = this.move(h1, d + 2); if (!walls || !walls[t]) h1 = t; break;
        case L1: t = this.move(h1, d + 3); if (!walls || !walls[t]) h1 = t; break;
        case R1: t = this.move(h1, d + 1); if (!walls || !walls[t]) h1 = t; break;
        case INC: if (o.arith) this.write(h0, (cells[h0] + 1) & 255); break;
        case DEC: if (o.arith) this.write(h0, (cells[h0] + 255) & 255); break;
        case CP01: if (o.copyEnabled && h0 !== h1) { if (first < 0) first = h1; if (h1 !== lastT) { moved++; lastT = h1; } this.write(h1, cells[h0]); copies++; if (o.blockCopy) { t = this.move(h0, d); if (!walls || !walls[t]) h0 = t; t = this.move(h1, d); if (!walls || !walls[t]) h1 = t; } } break;
        case CP10: if (o.copyEnabled && h0 !== h1) { if (first < 0) first = h0; if (h0 !== lastU) { moved++; lastU = h0; } this.write(h0, cells[h1]); copies++; if (o.blockCopy) { t = this.move(h0, d); if (!walls || !walls[t]) h0 = t; t = this.move(h1, d); if (!walls || !walls[t]) h1 = t; } } break;
        case OPEN:
          if (cells[h0] === 0) { // skip forward to matching ]
            let depth = 1, q = ip, k = 0;
            while (depth && k++ < cap) { q = this.move(q, d); const c = table[cells[q]]; if (c === OPEN) depth++; else if (c === CLOSE) depth--; }
            if (depth) { steps = cap; continue; }
            off += k; ip = q;
          }
          break;
        case CLOSE:
          if (cells[h0] !== 0) { // jump back to matching [
            let depth = 1, q = ip, k = 0;
            while (depth && k++ < cap) { q = this.move(q, d + 2); const c = table[cells[q]]; if (c === CLOSE) depth++; else if (c === OPEN) depth--; }
            if (depth) { steps = cap; continue; }
            loopA = off - k; loopB = off; looped = true; off -= k; ip = q;
          }
          break;
      }
      ip = this.move(ip, d); off++;
      if (walls && walls[ip]) break;
    }
    this.stats.steps += steps; this.stats.copies += copies;
    this.stats.moved = (this.stats.moved || 0) + moved;
    if (moved >= o.speciesMinCopies && looped) this.#census(p, d, loopA, loopB, copies);
    if (o.follow && (o.followOn ? moved : copies) >= o.followMin) {
      if (this.rand() < o.follow) this.next.push(first, d);
      if (o.refire && this.rand() < o.refire) this.next.push(p, d);
    }
    if (rec) rec.push(p, d, Math.min(off, cap), copies);
    return copies;
  }

  // Identity = the code a spark actually looped through while copying — nothing else.
  #census(p, d, a, b, copies) {
    let q = p, from = a;
    if (from < 0) for (let i = 0; i > from; i--) q = this.move(q, d + 2); else for (let i = 0; i < from; i++) q = this.move(q, d);
    let hash = 2166136261, code = '';
    for (let i = from; i <= b; i++, q = this.move(q, d)) {
      const op = this.table[this.cells[q]];
      if (!op) continue;
      hash = Math.imul(hash ^ op, 16777619) >>> 0; code += OPS[op] + ' ';
    }
    const e = this.species.get(hash);
    if (e) { e.count++; e.copies += copies; } else this.species.set(hash, { count: 1, copies, code: code.trim() });
  }

  epochStep() {
    const { o, n } = this;
    const q = this.queue, maxF = Math.floor(o.sparksPerEpoch * (1 - o.randomFrac)) * 2;
    let used = 0;
    if (q.length > maxF) { // over budget: keep a random subset
      for (let i = 0; i < maxF; i += 2) { const j = i + (((this.rand() * ((q.length - i) >> 1)) | 0) << 1); const a = q[j], b = q[j + 1]; q[j] = q[i]; q[j + 1] = q[i + 1]; q[i] = a; q[i + 1] = b; }
      q.length = maxF;
    }
    for (let i = 0; i < q.length; i += 2, used++) this.spark(q[i], q[i + 1], this.trace);
    this.stats.followed = (this.stats.followed || 0) + used;
    this.queue = this.next; this.next = [];
    for (let k = used; k < o.sparksPerEpoch; k++) this.spark((this.rand() * n) | 0, (this.rand() * 4) | 0, this.trace);
    const rays = o.mutation * n; let m = Math.floor(rays) + (this.rand() < rays % 1 ? 1 : 0);
    while (m--) this.write((this.rand() * n) | 0, (this.rand() * 256) | 0);
    this.stats.sparks += o.sparksPerEpoch; this.epoch++;
  }

  clearActivity() { this.activity.fill(0); }
  takeSpecies() { const s = this.species; this.species = new Map(); return s; }
  takeStats() { const s = this.stats; this.stats = { sparks: 0, steps: 0, copies: 0, writes: 0 }; return s; }
}
