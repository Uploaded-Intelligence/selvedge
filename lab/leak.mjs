// Sealed-wall leak test. Quadrant walls; wound in quadrant 2 only; report per epoch the number of differing BYTES per quadrant.
// A sound instrument + impermeable walls must show 0 forever in quadrants 0,1,3. Any nonzero = a non-biological channel.
import { World } from '../sim/core.js';
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.split('='); return [k, isNaN(+v) ? v : +v]; }));
const { postwarm = '', horizon = 300, ...opts } = args;
const A = new World({ blockCopy: 1, follow: 1, refire: 1, followOn: 1, followMin: 8, stepCap: 12, ...opts });
A.walls = new Uint8Array(A.n); for (let i = 0; i < A.n; i++) { const x = i % 256, y = (i / 256) | 0; if (x % 128 < 2 || y % 128 < 2) A.walls[i] = 1; }
for (let e = 0; e < 3000; e++) A.epochStep();
if (postwarm) { A.o.alloc = postwarm; for (let e = 0; e < 200; e++) A.epochStep(); }
const B = A.fork(); for (let i = 0; i < 13; i++) B.cells[(180 + (i / 5 | 0)) * 256 + 60 + i % 5] = (i * 37) & 255; // quadrant 2 (x<128, y>=128)
const quad = i => ((i % 256) >= 128 ? 1 : 0) + (((i / 256) | 0) >= 128 ? 2 : 0);
let first = [-1, -1, -1, -1]; const line = [];
for (let e = 1; e <= horizon; e++) {
  A.epochStep(); B.epochStep(); const d = [0, 0, 0, 0];
  for (let i = 0; i < A.n; i++) if (A.cells[i] !== B.cells[i]) d[quad(i)]++;
  d.forEach((v, q) => { if (v && first[q] < 0) first[q] = e; });
  if ([1, 2, 5, 10, 20, 50, 100, 200, 300].includes(e)) line.push(`t=${e}: q0=${d[0]} q1=${d[1]} q2=${d[2]} q3=${d[3]}`);
}
console.log(`alloc=${postwarm || 'cap'}  first differing byte per quadrant (epoch): q0=${first[0]} q1=${first[1]} q2=${first[2]} q3=${first[3]}`);
console.log('  ' + line.join(' | '));
