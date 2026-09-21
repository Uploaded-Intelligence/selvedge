// Point the Theseus lens at the soup. Reports late-run means:
//  living / front = share of cells above θ · clustered = share of living cells with ≥3 living neighbours (territory, not speckle)
import { World } from '../sim/core.js';
import { Lens } from '../sim/lens.js';
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.split('='); return [k, +v]; }));
const { epochs = 3000, every = 25, theta = 0.25, ...opts } = args;
const W = new World({ blockCopy: 1, follow: 1, refire: 1, followOn: 1, followMin: 8, ...opts });
const { w, h, n } = W, L = new Lens(w, h, { radius: 1, patch: 2, lags: [1], decay: 0.7 });
const acc = { living: 0, front: 0, clustered: 0, bytes: 0, code: 0, k: 0 };
for (let e = 1; e <= epochs; e++) {
  W.epochStep();
  if (e % every) continue;
  L.push(W.cells, W.activity); W.clearActivity();
  if (e < epochs * 0.6) continue;
  let liv = 0, fro = 0, clu = 0, code = 0; const seen = new Uint8Array(256);
  for (let i = 0; i < n; i++) {
    seen[W.cells[i]] = 1; if (W.table[W.cells[i]]) code++;
    if (L.front[i] > theta) fro++;
    if (L.living[i] <= theta) continue;
    liv++; const x = i % w, y = (i / w) | 0; let nb = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && L.living[((y + dy + h) % h) * w + (x + dx + w) % w] > theta) nb++;
    if (nb >= 3) clu++;
  }
  acc.living += liv / n; acc.front += fro / n; acc.clustered += liv ? clu / liv : 0; acc.bytes += seen.reduce((a, b) => a + b, 0); acc.code += code / n; acc.k++;
}
const m = k => acc[k] / acc.k, tag = Object.entries(opts).map(([k, v]) => k + '=' + v).join(' ');
console.log(tag.padEnd(40), `living=${m('living').toFixed(3)} front=${m('front').toFixed(3)} clustered=${m('clustered').toFixed(2)} bytes=${m('bytes').toFixed(0)} code=${m('code').toFixed(2)}`);
