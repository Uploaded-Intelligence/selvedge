// Does one wound's causal footprint SATURATE below the world (a compartment) or keep growing (a chaotic front)?
// Byte-level footprint vs time, single 13-byte wound in living tissue, allocator = local (clean instrument).
import { World } from '../sim/core.js';
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.split('='); return [k, isNaN(+v) ? v : +v]; }));
const { horizon = 1200, sites = 6, alloc = 'local', ...opts } = args;
const A = new World({ blockCopy: 1, follow: 1, refire: 1, followOn: 1, followMin: 8, stepCap: 12, ...opts, alloc: 'cap' });
for (let e = 0; e < 3000; e++) A.epochStep(); if (alloc === 'local') { A.o.alloc = 'local'; A.o.localBoost = 3; } for (let e = 0; e < 300; e++) A.epochStep();
// wound sites: the most active cell in each of `sites` horizontal bands (spread across the world, all in busy tissue)
A.clearActivity(); for (let e = 0; e < 10; e++) A.epochStep();
const cs = []; for (let b = 0; b < sites; b++) { let c = (b * 256 / sites | 0) * 256; for (let i = c; i < c + 256 * (256 / sites | 0); i++) if (A.activity[i] > A.activity[c]) c = i; cs.push(c); }
const marks = [50, 100, 200, 400, 800, 1200], rows = [];
for (const c of cs) {
  const a = A.fork(), B = A.fork(); for (let i = 0; i < 13; i++) B.cells[(c + (i / 5 | 0) * 256 + i % 5) % A.n] = (i * 37) & 255;
  const out = []; for (let e = 1; e <= horizon; e++) { a.epochStep(); B.epochStep(); if (marks.includes(e)) { let d = 0; for (let i = 0; i < A.n; i++) if (a.cells[i] !== B.cells[i]) d++; out.push((100 * d / A.n).toFixed(1).padStart(5) + '%'); } }
  rows.push(out.join(' '));
}
console.log(`alloc=${alloc} reach ${opts.stepCap ?? 12}  differing bytes (% of world) at epochs ${marks.join('/')} — one row per wound site:`); rows.forEach(r => console.log('   ' + r));
