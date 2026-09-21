// Territory metrics, late-run mean. coh = share of cells equal to their N (or W) neighbour, whichever axis is higher,
// measured only on non-uniform 3-cell context so flat fills don't count; code = opcode share; followed = share of sparks that were inherited.
import { World } from '../sim/core.js';
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.split('='); return [k, +v]; }));
const { epochs = 3000, label = '', ...opts } = args;
const W = new World({ w: 128, h: 128, blockCopy: 1, follow: 1, refire: 1, followOn: 1, followMin: 8, ...opts });
const { w, h, n } = W; const acc = { cohV: 0, cohH: 0, code: 0, distinct: 0, f: 0, k: 0 };
for (let e = 1; e <= epochs; e++) {
  W.epochStep();
  if (e < epochs / 2 || e % 100) continue;
  let v = 0, hh = 0, code = 0; const seen = new Uint8Array(256);
  for (let i = 0; i < n; i++) {
    const c = W.cells[i], up = W.cells[(i - w + n) % n], lf = W.cells[i % w ? i - 1 : i + w - 1];
    if (c === up && c !== lf) v++; if (c === lf && c !== up) hh++;
    if (W.table[c]) code++; seen[c] = 1;
  }
  const s = W.takeStats();
  acc.cohV += v / n; acc.cohH += hh / n; acc.code += code / n; acc.distinct += seen.reduce((a, b) => a + b, 0); acc.f += (s.followed || 0) / s.sparks; acc.k++;
}
const m = k => (acc[k] / acc.k);
const tag = Object.entries(opts).map(([k, v]) => k + '=' + v).join(' ') || 'baseline';
console.log(tag.padEnd(58), `wovenV=${m('cohV').toFixed(3)} wovenH=${m('cohH').toFixed(3)} code=${m('code').toFixed(2)} bytes=${m('distinct').toFixed(0)} inherited=${m('f').toFixed(2)}`);
