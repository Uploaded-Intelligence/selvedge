// One run → one line of richness metrics. Sustained ecology is the target, not first ignition.
import { World } from '../sim/core.js';
import { deflateSync } from 'node:zlib';
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.split('='); return [k, v === 'false' ? false : +v]; }));
const { epochs = 4000, ...opts } = args;
const W = new World({ w: 128, h: 128, ...opts });
const zs = []; let tops = [], nsp = [], ignite = -1;
for (let e = 1; e <= epochs; e++) {
  W.epochStep();
  if (e % 100) continue;
  const z = deflateSync(W.cells).length / W.n; zs.push(z);
  if (ignite < 0 && z < 0.85) ignite = e;
  const sp = [...W.takeSpecies().values()].sort((a, b) => b.copies - a.copies), tot = sp.reduce((a, v) => a + v.copies, 0) || 1;
  tops.push(sp[0]?.code ?? '-'); nsp.push(sp.filter(v => v.copies / tot > 0.02).length);
}
const late = zs.slice(zs.length >> 1), mean = a => a.reduce((x, y) => x + y, 0) / a.length;
const changes = tops.slice(1).filter((t, i) => t !== tops[i]).length;
console.log([`follow=${opts.follow ?? 0} fmin=${opts.followMin ?? 4} mut=${(opts.mutation ?? 1 / 4096).toFixed(5)} dens=${opts.density ?? 1} seed=${opts.seed ?? 1}`.padEnd(52),
  'ignite@' + String(ignite).padStart(5), 'zLate=' + mean(late).toFixed(2), 'zMin=' + Math.min(...zs).toFixed(2), 'zEnd=' + zs.at(-1).toFixed(2),
  'spp=' + mean(nsp.slice(nsp.length >> 1)).toFixed(1), 'topChanges=' + changes, 'last={' + tops.at(-1) + '}'].join('  '));
