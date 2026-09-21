// Render world → PNG, 2x. Left: bytes by opcode class. Right: write activity over the last `win` epochs.
import { World } from '../sim/core.js';
import { writePNG } from './png.mjs';
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.split('='); return [k, isNaN(+v) ? v : +v]; }));
const { epochs = 4000, win = 50, out = 'snap.png', ...opts } = args;
const W = new World(opts);
for (let e = 0; e < epochs - win; e++) W.epochStep();
W.clearActivity(); for (let e = 0; e < win; e++) W.epochStep();
const pal = [[28, 26, 30], [70, 150, 140], [70, 150, 140], [70, 150, 140], [70, 150, 140], [200, 120, 60], [200, 120, 60], [200, 120, 60], [200, 120, 60], [120, 90, 160], [120, 90, 160], [240, 230, 200], [240, 230, 200], [210, 60, 70], [210, 60, 70]];
const S = 2, w = W.w, h = W.h, rgb = new Uint8Array(w * S * 2 * h * S * 3);
for (let y = 0; y < h * S; y++) for (let x = 0; x < w * S; x++) {
  const i = ((y / S) | 0) * w + ((x / S) | 0), b = W.cells[i], op = W.table[b];
  const c = op ? pal[op] : [b >> 3, b >> 3, (b >> 3) + 6];
  const a = Math.min(255, W.activity[i] * 12);
  const o1 = (y * w * S * 2 + x) * 3, o2 = (y * w * S * 2 + x + w * S) * 3;
  rgb.set(c, o1); rgb.set([a, a * 0.8, a * 0.5], o2);
}
writePNG(out, w * S * 2, h * S, rgb);
const sp = [...W.species.entries()].sort((a, b) => b[1].copies - a[1].copies).slice(0, 8);
console.log(sp.map(([, v]) => `${v.count} sparks / ${v.copies} copies  {${v.code}}`).join('\n'));
