import { World } from '../sim/core.js';
const P = { blockCopy: 1, follow: 1, refire: 1, followOn: 1, followMin: 8, stepCap: 12 };
const mk = seed => { const W = new World({ ...P, seed }); for (let e = 0; e < 3000; e++) W.epochStep(); return W; };
const A = mk(1), C = mk(2), B = A.fork(); const n = A.n, w = A.w;
for (let i = 0; i < 13; i++) B.cells[(128 + (i / 5 | 0)) * w + 128 + i % 5] = (i * 37) & 255; // 13-byte wound
const liveMap = X => { X.clearActivity(); for (let e = 0; e < 25; e++) X.epochStep(); const m = new Uint8Array(n >> 4); const CLS=[0,1,1,1,1,1,1,1,1,2,2,3,3,4,4];
  for (let by = 0; by < 64; by++) for (let bx = 0; bx < 64; bx++) { let wr = 0; const h = [0,0,0,0,0]; for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { const i = (by*4+y)*w+bx*4+x; wr += X.activity[i]; h[CLS[X.table[X.cells[i]]]]++; } m[by*64+bx] = wr >= 4 && Math.max(...h) >= 10 ? 1 : 0; } return m; };
const jac = (a, b) => { let i = 0, u = 0; for (let k = 0; k < a.length; k++) { if (a[k] && b[k]) i++; if (a[k] || b[k]) u++; } return (i / u).toFixed(3); };
const A0 = liveMap(A.fork());
for (const T of [0, 60, 120, 240, 480]) {
  const a = A.fork(), b = B.fork(), c = C.fork(); for (let e = 0; e < T; e++) { a.epochStep(); b.epochStep(); c.epochStep(); }
  const ma = liveMap(a), mb = liveMap(b), mc = liveMap(c);
  console.log(`+${String(T).padStart(3)} epochs   living-block Jaccard   twin(A,B)=${jac(ma, mb)}   stranger(A,C)=${jac(ma, mc)}   self-past(A,A0)=${jac(ma, A0)}`);
}
