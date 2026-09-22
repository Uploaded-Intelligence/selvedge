import { World } from '../sim/core.js';
import { liveMap as sharedLiveMap, jaccard as jac0 } from './livemap.mjs';
const liveMap = X => { X.clearActivity(); for (let e = 0; e < 25; e++) X.epochStep(); return sharedLiveMap(X); };
const jaccard = (a, b) => jac0(a, b).toFixed(3);
const P = { blockCopy: 1, follow: 1, refire: 1, followOn: 1, followMin: 8, stepCap: 12 };
const mk = seed => { const W = new World({ ...P, seed }); for (let e = 0; e < 3000; e++) W.epochStep(); return W; };
const A = mk(1), C = mk(2), B = A.fork(); const n = A.n, w = A.w;
for (let i = 0; i < 13; i++) B.cells[(128 + (i / 5 | 0)) * w + 128 + i % 5] = (i * 37) & 255; // 13-byte wound
const A0 = liveMap(A.fork());
for (const T of [0, 60, 120, 240, 480]) {
  const a = A.fork(), b = B.fork(), c = C.fork(); for (let e = 0; e < T; e++) { a.epochStep(); b.epochStep(); c.epochStep(); }
  const ma = liveMap(a), mb = liveMap(b), mc = liveMap(c);
  console.log(`+${String(T).padStart(3)} epochs   living-block Jaccard   twin(A,B)=${jaccard(ma, mb)}   stranger(A,C)=${jaccard(ma, mc)}   self-past(A,A0)=${jaccard(ma, A0)}`);
}
