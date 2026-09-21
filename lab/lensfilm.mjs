// Two-row filmstrip: top = bytes by opcode class, bottom = Theseus lens (green=living, red/orange=front, dark=inert).
import { World } from '../sim/core.js';
import { Lens } from '../sim/lens.js';
import { writePNG } from './png.mjs';
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.split('='); return [k, isNaN(+v) ? v : +v]; }));
const { at = '200,600,1500,3000', out = 'lensfilm.png', every = 25, ...opts } = args;
const times = String(at).split(',').map(Number);
const W = new World({ blockCopy: 1, follow: 1, refire: 1, followOn: 1, followMin: 8, ...opts }), { w, h } = W, G = 4, cols = times.length;
const L = new Lens(w, h, { radius: 1, patch: 2, lags: [1], decay: 0.7 });
const pal = [[0, 0, 0], ...Array(4).fill([70, 150, 140]), ...Array(4).fill([200, 120, 60]), [120, 90, 160], [120, 90, 160], [240, 230, 200], [240, 230, 200], [210, 60, 70], [210, 60, 70]];
const RW = (w + G) * cols, rgb = new Uint8Array(RW * (2 * h + G) * 3).fill(50);
times.forEach((t, k) => {
  while (W.epoch < t) { W.epochStep(); if (W.epoch % every === 0) { L.push(W.cells, W.activity); W.clearActivity(); } }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x, b = W.cells[i], op = W.table[b];
    rgb.set(op ? pal[op] : [20 + (b >> 2), 18 + (b >> 2), 26 + (b >> 2)], (y * RW + k * (w + G) + x) * 3);
    const lv = Math.min(1, L.living[i] * 1.6), fr = Math.min(1, L.front[i] * 1.6);
    rgb.set([14 + 235 * fr, 14 + 200 * lv + 70 * fr, 22 + 120 * lv], ((y + h + G) * RW + k * (w + G) + x) * 3);
  }
});
writePNG(out, RW, 2 * h + G, rgb);
