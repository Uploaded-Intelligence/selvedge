// Filmstrip: bytes-by-opcode-class at a list of epochs. usage: node lab/film.mjs at=500,1000,... out=film.png [world opts]
import { World } from '../sim/core.js';
import { writePNG } from './png.mjs';
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.split('='); return [k, isNaN(+v) ? v : +v]; }));
const { at = '500,1000,1500,2000', out = 'film.png', ...opts } = args;
const times = String(at).split(',').map(Number);
const W = new World(opts), w = W.w, h = W.h, G = 4, cols = times.length;
const pal = [[0, 0, 0], ...Array(4).fill([70, 150, 140]), ...Array(4).fill([200, 120, 60]), [120, 90, 160], [120, 90, 160], [240, 230, 200], [240, 230, 200], [210, 60, 70], [210, 60, 70]];
const rgb = new Uint8Array((w + G) * cols * h * 3).fill(60);
times.forEach((t, k) => {
  while (W.epoch < t) W.epochStep();
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const b = W.cells[y * w + x], op = W.table[b];
    rgb.set(op ? pal[op] : [20 + (b >> 2), 18 + (b >> 2), 26 + (b >> 2)], (y * (w + G) * cols + k * (w + G) + x) * 3);
  }
});
writePNG(out, (w + G) * cols, h, rgb);
