// copies/spark over time as a sparkline — is a world alive, and does it stay alive?
import { World } from '../sim/core.js';
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.split('='); return [k, +v]; }));
const { epochs = 6000, every = 200, ...opts } = args;
const W = new World({ blockCopy: 1, follow: 1, refire: 1, followOn: 1, followMin: 8, ...opts }); let line = '', peak = 0;
for (let e = 1; e <= epochs; e++) { W.epochStep(); if (e % every === 0) { const s = W.takeStats(), c = s.copies / s.sparks; peak = Math.max(peak, c); line += '▁▂▃▄▅▆▇█'[Math.min(7, Math.floor(c / 1.5))]; } }
console.log(`reach ${opts.stepCap} seed ${opts.seed ?? 1}  copies/spark (▁<1.5 … █≥10.5) peak ${peak.toFixed(1)}`.padEnd(60), line);
