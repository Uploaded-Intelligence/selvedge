// Causal compartments. Wound the same warmed world at K different sites (one fork each, all coupled to the same
// unwounded twin). For each 4×4 block record which wounds ever reach its living-ness. Blocks reached by NO wound are
// insulated; blocks with identical reach-signatures form a compartment. Renders: hue = signature, green = insulated.
import { World } from '../sim/core.js';
import { writePNG } from './png.mjs';
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.split('='); return [k, isNaN(+v) ? v : +v]; }));
const { horizon = 600, every = 20, K = 6, out = 'compartments.png', ...opts } = args;
const P = { blockCopy: 1, follow: 1, refire: 1, followOn: 1, followMin: 8, stepCap: 12, ...opts };
const A = new World(P); for (let e = 0; e < 3000; e++) A.epochStep();
const w = A.w, bw = w >> 2, CLS = [0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 4, 4];
const sites = Array.from({ length: K }, (_, k) => [((k * 97 + 31) % 256), ((k * 151 + 77) % 256)]);
const forks = sites.map(([cx, cy]) => { const B = A.fork(); for (let i = 0; i < 13; i++) B.cells[((cy + (i / 5 | 0)) % 256) * w + (cx + i % 5) % 256] = (i * 37) & 255; return B; });
const liveMap = X => { const m = new Uint8Array(bw * bw); for (let by = 0; by < bw; by++) for (let bx = 0; bx < bw; bx++) { let wr = 0; const h = [0, 0, 0, 0, 0]; for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { const i = (by * 4 + y) * w + bx * 4 + x; wr += X.activity[i]; h[CLS[X.table[X.cells[i]]]]++; } m[by * bw + bx] = wr >= 4 && Math.max(...h) >= 10 ? 1 : 0; } X.clearActivity(); return m; };
const sig = new Uint8Array(bw * bw), streak = forks.map(() => new Uint8Array(bw * bw)); let lastA, everLive = new Uint8Array(bw * bw);
for (let e = 1; e <= horizon; e++) {
  A.epochStep(); forks.forEach(B => B.epochStep()); if (e % every) continue;
  lastA = liveMap(A); for (let i = 0; i < everLive.length; i++) everLive[i] |= lastA[i];
  forks.forEach((B, k) => { const mb = liveMap(B); for (let i = 0; i < mb.length; i++) { if (lastA[i] !== mb[i]) { if (++streak[k][i] >= 2) sig[i] |= 1 << k; } else streak[k][i] = 0; } });
}
let ins = 0, insLive = 0, live = 0; const hist = new Map();
for (let i = 0; i < sig.length; i++) { if (everLive[i]) live++; if (sig[i] === 0) { ins++; if (everLive[i]) insLive++; } hist.set(sig[i], (hist.get(sig[i]) || 0) + 1); }
console.log(`blocks ever-living ${live}/${bw * bw} · insulated from all ${K} wounds: ${ins} (${insLive} of them ever-living = ${(100 * insLive / live).toFixed(1)}% of living tissue)`);
console.log('top signatures (which wounds reach the block):', [...hist.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([s, c]) => `${s.toString(2).padStart(K, '0')}×${c}`).join('  '));
const S = 3, rgb = new Uint8Array(bw * S * bw * S * 3);
for (let y = 0; y < bw * S; y++) for (let x = 0; x < bw * S; x++) { const i = ((y / S) | 0) * bw + ((x / S) | 0), o = (y * bw * S + x) * 3, s = sig[i]; if (s === 0) rgb.set(everLive[i] ? [134, 230, 196] : [22, 24, 34], o); else { const hue = (s * 47) % 360, v = everLive[i] ? 200 : 90; const f = (h, l) => { const k = (h / 60) % 6, c = l; return [[c, c * (k % 1), 0], [c * (1 - k % 1), c, 0], [0, c, c * (k % 1)], [0, c * (1 - k % 1), c], [c * (k % 1), 0, c], [c, 0, c * (1 - k % 1)]][k | 0]; }; rgb.set(f(hue, v).map(v => 40 + v), o); } }
sites.forEach(([cx, cy]) => { for (let d = -2; d <= 2; d++) { const o1 = (((cy / 4 | 0) * S + 1) * bw * S + ((cx / 4 | 0) * S + 1 + d)) * 3, o2 = (((cy / 4 | 0) * S + 1 + d) * bw * S + ((cx / 4 | 0) * S + 1)) * 3; rgb.set([255, 255, 255], o1); rgb.set([255, 255, 255], o2); } });
writePNG(out, bw * S, bw * S, rgb); console.log('wrote', out);
