// Coupled-fork wound assay. Fork the world, damage a disc of radius R in the fork, run both with identical
// per-event randomness, and track the XOR footprint: cells where the two worlds differ.
//   heal   : footprint shrinks to ~0     → the wounded region is inside a self-repairing basin
//   scar   : footprint stays ≈ the wound → inert matter (nothing rewrites it)
//   spread : footprint grows past the wound → the wound's consequences propagate (chaos / a body that depended on it)
// Reports, per R: heal rate, median footprint at horizon, and how the footprint size depends on the wound.
// A second plateau in heal-vs-R would be the signature the T·P lens cannot see.
import { World } from '../sim/core.js';
import { Lens } from '../sim/lens.js';
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.split('='); return [k, isNaN(+v) ? v : +v]; }));
const { warm = 3000, horizon = 300, trials = 24, radii = '1,2,4,8,16', where = 'living', kind = 'noise', ...opts } = args;
const W = new World({ blockCopy: 1, follow: 1, refire: 1, followOn: 1, followMin: 8, stepCap: 12, ...opts }), { w, h, n } = W;
const L = new Lens(w, h, { radius: 1, patch: 2, lags: [1], decay: 0.7 });
for (let e = 1; e <= warm; e++) { W.epochStep(); if (e % 25 === 0) { L.push(W.cells, W.activity); W.clearActivity(); } }

// candidate wound centres by lens class
const codeFrac = i => { const x = i % w, y = (i / w) | 0; let c = 0; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (W.table[W.cells[((y + dy + h) % h) * w + (x + dx + w) % w]]) c++; return c / 25; };
// dormant = quiet by the lens (T<eps) but code-rich: a body at rest, invisible to a turnover lens
const cls = i => L.living[i] > .25 ? 'living' : L.front[i] > .25 ? 'front' : (L.T[i] < 0.02 && codeFrac(i) > 0.6) ? 'dormant' : 'inert';
const centres = []; for (let i = 0; i < n; i++) if (cls(i) === where) centres.push(i);
if (centres.length < trials) { console.log(`only ${centres.length} ${where} cells`); process.exit(1); }
let s = 99; const pick = () => { s = (s * 1103515245 + 12345) >>> 0; return centres[s % centres.length]; };

function wound(F, c, R) {
  const cx = c % w, cy = (c / w) | 0; let k = 0;
  for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
    if (dx * dx + dy * dy > R * R) continue;
    const i = ((cy + dy + h) % h) * w + (cx + dx + w) % w;
    F.cells[i] = kind === 'zero' ? 0 : ((F.rnd(i, 99) * 256) | 0); k++;
  }
  return k;
}
// Ladder of equivalences: at which level of description does the wound heal?
//   byte  : identical bytes            class : same opcode class (data / head-move / arith / copy / bracket)
//   tissue: same lens verdict (inert/living/front) by 4×4 block, using write activity since the wound
const CLS = [0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 4, 4];
const diffByte = (A, B) => { let d = 0; for (let i = 0; i < n; i++) if (A.cells[i] !== B.cells[i]) d++; return d; };
const diffClass = (A, B) => { let d = 0; for (let i = 0; i < n; i++) if (CLS[A.table[A.cells[i]]] !== CLS[B.table[B.cells[i]]]) d++; return d; };
const tissue = (X) => { // per 4×4 block: 0 inert (few writes) · 1 living (writes, class-coherent) · 2 front (writes, incoherent)
  const bw = w >> 2, out = new Uint8Array(bw * (h >> 2));
  for (let by = 0; by < h >> 2; by++) for (let bx = 0; bx < bw; bx++) {
    let writes = 0; const hist = [0, 0, 0, 0, 0];
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { const i = (by * 4 + y) * w + bx * 4 + x; writes += X.activity[i]; hist[CLS[X.table[X.cells[i]]]]++; }
    const dom = Math.max(...hist) / 16;
    out[by * bw + bx] = writes < 4 ? 0 : dom >= 0.6 ? 1 : 2;
  }
  return out;
};
const diffTissue = (A, B) => { const a = tissue(A), b = tissue(B); let d = 0; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++; return d * 16; };

console.log(`where=${where} kind=${kind} warm=${warm} horizon=${horizon} trials=${trials}   (footprint as multiple of wound area)`);
console.log('R   area  tissue: heal/scar/spread  class-heal  byte-heal |  median footprint:  byte   class  tissue | byte trajectory');
for (const R of String(radii).split(',').map(Number)) {
  const finals = [], finalsC = [], finalsT = [], traj = Array.from({ length: 7 }, () => []);
  for (let t = 0; t < trials; t++) {
    const A = W.fork(), B = W.fork(), c = pick(), area = wound(B, c, R);
    for (let e = 1; e <= horizon; e++) {
      A.epochStep(); B.epochStep();
      if (e % (horizon / 6) === 0) traj[e / (horizon / 6)].push(diffByte(A, B) / area);
    }
    finals.push(diffByte(A, B) / area); finalsC.push(diffClass(A, B) / area); finalsT.push(diffTissue(A, B) / area);
  }
  const med = a => { const b = a.slice().sort((x, y) => x - y); return b[b.length >> 1]; };
  const q = (a, p) => { const b = a.slice().sort((x, y) => x - y); return b[Math.min(b.length - 1, Math.floor(p * b.length))]; };
  const heal = finalsT.filter(f => f < 0.5).length / trials, spread = finalsT.filter(f => f > 2).length / trials, scar = 1 - heal - spread; // graded at TISSUE level
  const area = Math.round(Math.PI * R * R) || 1;
  const healC = finalsC.filter(f => f < 0.5).length / trials, healB = finals.filter(f => f < 0.5).length / trials;
  console.log(String(R).padEnd(3), String(area).padEnd(6), (100 * heal).toFixed(0).padStart(6) + '%' + (100 * scar).toFixed(0).padStart(4) + '%' + (100 * spread).toFixed(0).padStart(4) + '%', (100 * healC).toFixed(0).padStart(9) + '%', (100 * healB).toFixed(0).padStart(9) + '%',
    '  ', med(finals).toFixed(1).padStart(8), med(finalsC).toFixed(1).padStart(8), med(finalsT).toFixed(1).padStart(8), '  ', traj.slice(1).map(a => med(a).toFixed(0)).join('→'));
}
