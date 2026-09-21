// Long-run compressibility trace as a sparkline (low = structured). One char per `every` epochs.
import { World } from '../sim/core.js';
import { deflateSync } from 'node:zlib';
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.split('='); return [k, +v]; }));
const { epochs = 20000, every = 250, ...opts } = args;
const W = new World(opts); let line = '';
for (let e = 1; e <= epochs; e++) { W.epochStep(); if (e % every === 0) { const z = deflateSync(W.cells, { level: 1 }).length / W.n; line += '▁▂▃▄▅▆▇█'[Math.min(7, Math.max(0, Math.floor(z * 8)))]; } }
console.log(Object.entries(opts).map(([k, v]) => k + '=' + v).join(' ').padEnd(64), line);
