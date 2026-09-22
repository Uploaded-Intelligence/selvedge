// Where does the wound's consequence reach the BODY map, and when? Per 4×4 block: first epoch at which twin worlds
// disagree on living-ness (persistently, ≥2 consecutive checks). Reports arrival-time vs distance from the wound,
// and renders a PNG: arrival time (dark=early, bright=late/never) over the living map.
import { World } from '../sim/core.js';
import { liveMap, jaccard } from './livemap.mjs';
import { writePNG } from './png.mjs';
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.split('='); return [k, isNaN(+v) ? v : +v]; }));
const { horizon = 600, every = 20, out = 'insulation.png', ...opts } = args;
const P = { blockCopy: 1, follow: 1, refire: 1, followOn: 1, followMin: 8, stepCap: 12, ...opts };
const A = new World(P); for (let e = 0; e < 3000; e++) A.epochStep();
const w = A.w, n = A.n, bw = w >> 2, B = A.fork(), cx = 128, cy = 128;
for (let i = 0; i < 13; i++) B.cells[(cy + (i / 5 | 0)) * w + cx + i % 5] = (i * 37) & 255;
const arrival = new Int16Array(bw * bw).fill(-1), streak = new Uint8Array(bw * bw); let lastA = null;
for (let e = 1; e <= horizon; e++) {
  A.epochStep(); B.epochStep(); if (e % every) continue;
  const ma = liveMap(A), mb = liveMap(B); lastA = ma;
  for (let i = 0; i < ma.length; i++) { if (ma[i] !== mb[i]) { if (++streak[i] >= 2 && arrival[i] < 0) arrival[i] = e; } else streak[i] = 0; }
}
// arrival time vs distance (torus) from wound, in blocks
const bins = Array.from({ length: 6 }, () => []);
for (let by = 0; by < bw; by++) for (let bx = 0; bx < bw; bx++) { const dx = Math.min(Math.abs(bx - cx / 4), bw - Math.abs(bx - cx / 4)), dy = Math.min(Math.abs(by - cy / 4), bw - Math.abs(by - cy / 4)); const d = Math.hypot(dx, dy); const t = arrival[by * bw + bx]; bins[Math.min(5, (d / 6) | 0)].push(t < 0 ? horizon * 2 : t); }
console.log('distance(blocks)  n     median arrival   never-reached%');
bins.forEach((b, k) => { const s = b.slice().sort((x, y) => x - y); console.log(`${String(k * 6).padStart(3)}–${String(k * 6 + 5).padEnd(3)}        ${String(b.length).padEnd(5)} ${String(s[s.length >> 1] > horizon ? '>' + horizon : s[s.length >> 1]).padStart(8)}         ${(100 * b.filter(t => t > horizon).length / b.length).toFixed(0)}%`); });
const S = 3, rgb = new Uint8Array(bw * S * bw * S * 3);
for (let y = 0; y < bw * S; y++) for (let x = 0; x < bw * S; x++) { const i = ((y / S) | 0) * bw + ((x / S) | 0), t = arrival[i], o = (y * bw * S + x) * 3; const live = lastA[i]; if (t < 0) rgb.set(live ? [134, 230, 196] : [30, 32, 46], o); else { const k = t / horizon; rgb.set([255 * (1 - k * .6), 125 * (1 - k) + 60 * k, 69 * (1 - k) + 120 * k], o); } }
writePNG(out, bw * S, bw * S, rgb); console.log('wrote', out, '(green = body never touched by the wound; orange→violet = early→late arrival; dark = inert untouched)');
