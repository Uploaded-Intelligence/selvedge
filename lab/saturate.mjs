// Does one wound's causal footprint SATURATE below the world (a compartment) or keep growing (a chaotic front)?
// Byte-level footprint vs time, single 13-byte wound in living tissue, allocator = local (clean instrument).
import { World } from '../sim/core.js';
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.split('='); return [k, isNaN(+v) ? v : +v]; }));
const { horizon = 1200, sites = 6, alloc = 'local', ...opts } = args;
const A = new World({ blockCopy: 1, follow: 1, refire: 1, followOn: 1, followMin: 8, stepCap: 12, ...opts, alloc: 'cap' });
for (let e = 0; e < 3000; e++) A.epochStep(); if (alloc === 'local') { A.o.alloc = 'local'; A.o.localBoost = 3; } for (let e = 0; e < 300; e++) A.epochStep();
// wound sites: the most active cell in each of `sites` horizontal bands (spread across the world, all in busy tissue)
A.clearActivity(); for (let e = 0; e < 10; e++) A.epochStep();
const cs = []; const far = i => cs.every(c => Math.abs((c % 256) - (i % 256)) > 24 || Math.abs(((c / 256) | 0) - ((i / 256) | 0)) > 24);
for (let b = 0; b < sites; b++) { const y0 = (b * 256 / sites | 0), y1 = ((b + 1) * 256 / sites | 0); let c = -1; for (let i = y0 * 256; i < y1 * 256; i++) if (far(i) && (c < 0 || A.activity[i] > A.activity[c])) c = i; if (c >= 0) cs.push(c); }
const marks = [50, 100, 200, 400, 800, 1200], rows = [];
for (const c of cs) {
  const a = A.fork(), B = A.fork(); for (let i = 0; i < 13; i++) B.cells[(c + (i / 5 | 0) * 256 + i % 5) % A.n] = (i * 37) & 255;
  const out = []; for (let e = 1; e <= horizon; e++) { a.epochStep(); B.epochStep(); if (marks.includes(e)) { let d = 0; for (let i = 0; i < A.n; i++) if (a.cells[i] !== B.cells[i]) d++; out.push((100 * d / A.n).toFixed(1).padStart(5) + '%'); } }
  rows.push(out.join(' '));
}
const healed = rows.filter(r => r.trim().split(/\s+/).every(v => parseFloat(v) === 0)).length, latent = rows.filter(r => { const v = r.trim().split(/\s+/).map(parseFloat); return v[2] < 1 && v[5] > 20; }).length;
console.log(`alloc=${alloc} reach ${opts.stepCap ?? 12}  ${rows.length} sites: fully healed ${healed}, latent-then-breakout ${latent}   (% world differing at ${marks.join('/')})`); rows.forEach(r => console.log('   ' + r));
