// Red-first sensors for lineage tracking in sim/core.js.
import { World } from '../sim/core.js';
const P = { blockCopy: 1, follow: 1, refire: 1, followOn: 1, followMin: 8, stepCap: 12 };
const fp = (W, n) => { for (let i = 0; i < n; i++) W.epochStep(); let h = 0; for (const b of W.cells) h = (h * 31 + b) >>> 0; return h; };
const PRE = 636877759; // captured before any edit, 800 epochs default physics
let fails = 0; const t = (name, ok, info = '') => { console.log((ok ? 'PASS ' : 'FAIL ') + name + (info ? '  ' + info : '')); if (!ok) fails++; };

// 1 physics unchanged, tracking off (regression sensor)
t('fingerprint lineage:0 == pre-edit', fp(new World(P), 800) === PRE);
// 2 physics unchanged, tracking ON (stronger: tagging must not perturb the trajectory either)
t('fingerprint lineage:1 == pre-edit', fp(new World({ ...P, lineage: 1 }), 800) === PRE);
// 3 census exists and queue is stride 3 with integer lineage ids
const W = new World({ ...P, lineage: 1 }); for (let i = 0; i < 600; i++) W.epochStep(); const Q = [...W.queue, ...W.next];
t('linStats is a non-empty Map', W.linStats instanceof Map && W.linStats.size > 0, `size=${W.linStats?.size}`);
t('queue stride 3', Q.length > 0 && Q.length % 3 === 0, `len=${Q.length}`);
let okLin = Q.length > 0; for (let i = 2; i < Q.length; i += 3) if (!Number.isInteger(Q[i]) || Q[i] < 0) okLin = false;
t('every queued spark carries an integer lin >= 0', okLin);
// 4 inheritance: every queued child's lineage was tallied this epoch (parent ran under that id)
let inherited = Q.length > 0 && W.linStats instanceof Map; for (let i = 2; inherited && i < Q.length; i += 3) if (!W.linStats.has(Q[i])) inherited = false;
t('queued children inherit a lineage that sparked this epoch', inherited);
// 5 born is recoverable and never in the future; some lineage is older than this epoch
let maxAge = 0, futureBorn = false; for (const lin of (W.linStats instanceof Map ? W.linStats.keys() : [])) { const b = W.linBorn?.(lin) ?? Infinity; if (b > W.epoch) futureBorn = true; maxAge = Math.max(maxAge, W.epoch - 1 - b); }
t('linBorn(lin) <= epoch and some lineage has age > 0', !futureBorn && maxAge > 0, `maxAge=${maxAge}`);
// 6 fork under tracking: twins stay byte-identical (no drift from the stride-3 queue)
const A = W.fork(), B = W.fork(); for (let i = 0; i < 50; i++) { A.epochStep(); B.epochStep(); }
let diff = 0; for (let i = 0; i < A.n; i++) if (A.cells[i] !== B.cells[i]) diff++;
t('forked twins with lineage:1 stay identical for 50 epochs', diff === 0, `diff=${diff}`);
// 7 tracking-off queue is still stride 2 (no phantom third field)
const Z = new World(P); for (let i = 0; i < 20; i++) Z.epochStep();
t('lineage:0 queue is stride 2 and linStats is null', Z.queue.length % 2 === 0 && Z.linStats === null, `len=${Z.queue.length} linStats=${Z.linStats}`);
console.log(fails ? `${fails} FAIL` : 'ALL PASS'); process.exit(fails ? 1 : 0);
