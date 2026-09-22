import { World, OPS } from '../sim/core.js';
import { Lens } from '../sim/lens.js';
const P = { blockCopy: 1, follow: 1, refire: 1, followOn: 1, followMin: 8, stepCap: 12 };
const A = new World(P), L = new Lens(256, 256, { radius: 1, patch: 2, lags: [1], decay: 0.7 });
for (let e = 1; e <= 3300; e++) { A.epochStep(); if (e % 25 === 0) { L.push(A.cells, A.activity); A.clearActivity(); } }
const G = ['·', 'F0', 'B0', 'L0', 'R0', 'F1', 'B1', 'L1', 'R1', '+', '-', '.', ',', '[', ']'];
const cls = i => L.living[i] > .25 ? 'L' : L.front[i] > .25 ? 'F' : L.T[i] < .02 ? ' ' : '.';
console.log('lens map, cols 60..119, rows 0..47 (L living · F front · space inert · . faint):');
for (let y = 0; y < 48; y += 2) { let s = ''; for (let x = 60; x < 120; x++) s += cls(y * 256 + x); console.log(String(y).padStart(3), s); }
console.log('\nbytes as ops, rows 8..13, cols 78..100:');
for (let y = 8; y < 14; y++) { let s = ''; for (let x = 78; x < 100; x++) { const op = A.table[A.cells[y * 256 + x]]; s += (op ? G[op] : '·').padEnd(3); } console.log(String(y).padStart(3), s); }
// how much does column x get WRITTEN, summed over rows 0..47, last 300 epochs
A.clearActivity(); for (let e = 0; e < 300; e++) A.epochStep();
let s = 'writes/col: '; for (let x = 60; x < 120; x += 2) { let a = 0; for (let y = 0; y < 48; y++) a += A.activity[y * 256 + x]; s += (a > 400 ? '#' : a > 100 ? '+' : a > 10 ? '-' : ' '); } console.log('\n' + s);
