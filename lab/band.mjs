import { World } from '../sim/core.js';
const P = { blockCopy: 1, follow: 1, refire: 1, followOn: 1, followMin: 8, stepCap: 12 };
const A = new World(P); for (let e = 0; e < 3000; e++) A.epochStep();
const w = 256, B = A.fork(); for (let i = 0; i < 13; i++) B.cells[(128 + (i / 5 | 0)) * w + 128 + i % 5] = (i * 37) & 255;
for (let e = 0; e < 600; e++) { A.epochStep(); B.epochStep(); }
const same = (x0, x1, y0, y1) => { let s = 0, n = 0, code = 0; for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const i = y * w + x; n++; if (A.cells[i] === B.cells[i]) s++; if (A.table[A.cells[i]]) code++; } return `bytes identical ${(100 * s / n).toFixed(1)}%  code ${(100 * code / n).toFixed(0)}%`; };
console.log('band   cols 76-104 rows 0-48   :', same(76, 104, 0, 48));
console.log('band   cols 76-104 rows 200-256:', same(76, 104, 200, 256));
console.log('beside cols 110-140 rows 0-48  :', same(110, 140, 0, 48));
console.log('world                          :', same(0, 256, 0, 256));
// what runs there? sparks in the band this epoch: direction histogram and copies
A.trace = []; A.epochStep(); const dh = [0, 0, 0, 0]; let cp = 0, k = 0;
for (let i = 0; i < A.trace.length; i += 4) { const x = A.trace[i] % w, y = (A.trace[i] / w) | 0; if (x >= 76 && x < 104 && A.trace[i + 3] > 0) { dh[A.trace[i + 1]]++; cp += A.trace[i + 3]; k++; } }
console.log('productive sparks in band this epoch:', k, ' dirs E/S/W/N =', dh.join('/'), ' copies', cp);
