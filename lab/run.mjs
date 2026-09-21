// Headless soup runner. usage: node lab/run.mjs key=value ...   (epochs=, every=, plus any World option)
import { World } from '../sim/core.js';
import { deflateSync } from 'node:zlib';
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.split('='); return [k, v === 'false' ? false : v === 'true' ? true : +v]; }));
const { epochs = 2000, every = 100, ...opts } = args;
const W = new World(opts);
const t0 = Date.now(); const census = new Map();
console.log('opts', JSON.stringify(W.o));
console.log('epoch  compress  copies/spark  steps/spark  species(top3 by sparks)');
for (let e = 1; e <= epochs; e++) {
  W.epochStep();
  if (e % every) continue;
  const s = W.takeStats(), sp = [...W.takeSpecies().entries()].sort((a, b) => b[1].count - a[1].count);
  const z = deflateSync(W.cells, { level: 6 }).length / W.n;
  console.log(String(e).padStart(5), z.toFixed(3).padStart(9), (s.copies / s.sparks).toFixed(3).padStart(13), (s.steps / s.sparks).toFixed(1).padStart(12),
    ' f=' + ((s.followed||0)/s.sparks).toFixed(2), '  n=' + sp.length, sp.slice(0, 3).map(([h, v]) => `${v.count}×{${v.code}}`).join('  '));
}
console.error(`${((Date.now() - t0) / 1000).toFixed(1)}s`);
