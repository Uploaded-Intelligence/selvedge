// Hunt for second-order selves: point the SAME lens at the coarse map of aliveness (8×8 blocks → inert/living/front).
// A body that holds its shape (possibly while drifting) as its member cells change state reads as living at this scale.
// Null: identical frames in shuffled time order — same marginals, no temporal coherence.
import { World } from '../sim/core.js';
import { Lens } from '../sim/lens.js';
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.split('='); return [k, +v]; }));
const { epochs = 6000, from = 1500, B = 8, ...opts } = args;
const W = new World({ blockCopy: 1, follow: 1, refire: 1, followOn: 1, followMin: 8, stepCap: 24, ...opts }), { w, h } = W, cw = w / B, ch = h / B;
const L = new Lens(w, h, { radius: 1, patch: 2, lags: [1], decay: 0.7 }), frames = [];
for (let e = 1; e <= epochs; e++) {
  W.epochStep(); if (e % 25) continue;
  L.push(W.cells, W.activity); W.clearActivity(); if (e < from) continue;
  const f = new Uint8Array(cw * ch);
  for (let cy = 0; cy < ch; cy++) for (let cx = 0; cx < cw; cx++) {
    let lv = 0, fr = 0; for (let y = 0; y < B; y++) for (let x = 0; x < B; x++) { const i = (cy * B + y) * w + cx * B + x; if (L.living[i] > .25) lv++; else if (L.front[i] > .25) fr++; }
    f[cy * cw + cx] = lv > B * B * .3 ? 1 : fr > B * B * .5 ? 2 : 0;
  }
  frames.push(f);
}
function score(fs) {
  const L2 = new Lens(cw, ch, { radius: 1, patch: 2, lags: [1, 2, 4], decay: 0.7 }); let liv = 0, fro = 0, k = 0;
  fs.forEach((f, t) => { L2.push(f); if (t < 6) return; for (let i = 0; i < cw * ch; i++) { liv += L2.living[i]; fro += L2.front[i]; } k++; });
  return liv / (liv + fro || 1);
}
const shuffled = frames.slice(); let s = 12345; for (let i = shuffled.length - 1; i > 0; i--) { s = (s * 1103515245 + 12345) >>> 0; const j = s % (i + 1);[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
const occ = frames.reduce((a, f) => a + f.filter(v => v === 1).length, 0) / frames.length / (cw * ch);
console.log(`seed=${opts.seed ?? 1}  living-blocks=${(100 * occ).toFixed(1)}%  second-order living share: real=${score(frames).toFixed(3)}  time-shuffled null=${score(shuffled).toFixed(3)}`);
