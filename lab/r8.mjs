import { World } from '../sim/core.js';
for (const c of [8, 10, 12]) {
  const W = new World({ blockCopy: 1, follow: 1, refire: 1, followOn: 1, followMin: 8, stepCap: c }); for (let e = 0; e < 3000; e++) W.epochStep();
  const before = Uint8Array.from(W.cells); W.clearActivity(); W.takeStats(); for (let e = 0; e < 25; e++) W.epochStep();
  let changed = 0, written = 0; for (let i = 0; i < W.n; i++) { if (W.activity[i]) written++; if (W.cells[i] !== before[i]) changed++; }
  const s = W.takeStats();
  console.log(`reach ${c}: in 25 epochs ${(100 * written / W.n).toFixed(0)}% of cells written, ${(100 * changed / W.n).toFixed(0)}% actually changed; writes/epoch ${(s.writes / 25 | 0)}, copies/spark ${(s.copies / s.sparks).toFixed(1)}, followed ${(100 * (s.followed || 0) / s.sparks).toFixed(0)}%`);
}
