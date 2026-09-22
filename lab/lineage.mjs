// Lineage census + cut-test. E17 found twins keeping identical body-maps for 120 epochs while their bytes diverged;
// what they shared was the follow-spark queue. So: tag every spark with a lineage (a random landing mints one, children
// inherit it), census the lineages alive in a warmed world, ask whether the biggest share territory, then CUT one
// lineage's queued sparks in a fork and see whether the OTHER lineages feel it — against an uncut twin as the null.
import { World } from '../sim/core.js';
import { liveMap as sharedLiveMap, jaccard } from './livemap.mjs';

const P = { blockCopy: 1, follow: 1, refire: 1, followOn: 1, followMin: 8, stepCap: 12, lineage: 1 };
const WARM = 3000, T = 100, TOP = 5;
const A = new World(P); for (let e = 0; e < WARM; e++) A.epochStep();
const { w, n } = A, E = A.epoch - 1; // linStats describes epoch E (epoch counter already advanced)

// ── (a) census of the last warm epoch ────────────────────────────────────────────────────────────────────────
const hist = (xs, edges) => edges.map((lo, i) => { const hi = edges[i + 1] ?? Infinity; const c = xs.filter(x => x >= lo && x < hi).length; return `${lo}${hi === Infinity ? '+' : hi - 1 > lo ? '–' + (hi - 1) : ''}:${c}`; }).join('  ');
const S = A.linStats, rows = [...S].map(([lin, e]) => ({ lin, sparks: e.sparks, copies: e.copies, age: E - A.linBorn(lin), blocks: e.blocks })).sort((a, b) => b.sparks - a.sparks);
const fresh = rows.filter(r => r.age === 0).length, followed = rows.reduce((s, r) => s + r.sparks, 0) - fresh;
console.log(`LINEAGE CENSUS  epoch ${E}  world ${w}×${A.h}  sparks/epoch ${A.o.sparksPerEpoch} (≤${Math.floor(A.o.sparksPerEpoch * (1 - A.o.randomFrac))} followed)`);
console.log(`lineages alive this epoch : ${rows.length}   (fresh random landings ${fresh} · inherited lineages ${rows.length - fresh}, carrying ${followed} followed sparks)`);
console.log(`size  (sparks/epoch)      : ${hist(rows.map(r => r.sparks), [1, 2, 4, 8, 16, 32, 64, 128, 256])}`);
console.log(`age   (epochs, inherited) : ${hist(rows.filter(r => r.age > 0).map(r => r.age), [1, 10, 100, 1000, 3000])}`);
console.log(`footprint (8×8 blocks)    : ${hist(rows.map(r => r.blocks.size), [1, 2, 3, 5, 9, 17, 33, 65])}`);
console.log(`\ntop ${TOP} lineages`);
const blocks = B => [...B].map(b => `(${b % (w >> 3)},${(b / (w >> 3)) | 0})`).join(""); // (bx,by) of 8×8 blocks — bboxes mislead on a torus
for (const r of rows.slice(0, TOP)) console.log(`  lin ${String(r.lin).padStart(9)}  born ${String(A.linBorn(r.lin)).padStart(4)}  age ${String(r.age).padStart(4)}  sparks ${String(r.sparks).padStart(4)}  copies ${String(r.copies).padStart(5)}  blocks ${String(r.blocks.size).padStart(3)}  ${blocks(r.blocks)}`);

// ── (b) do the 3 biggest write into the same territory? ─────────────────────────────────────────────────────
console.log(`\nterritory overlap of the 3 biggest (8×8 landing + first-write blocks — a proxy for the write-set; a ray is ≤ stepCap cells)`);
for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) {
  const a = rows[i].blocks, b = rows[j].blocks; let inter = 0; for (const x of a) if (b.has(x)) inter++; const uni = a.size + b.size - inter;
  console.log(`  lin ${rows[i].lin} ∩ lin ${rows[j].lin}: ${inter} shared / ${uni} union  Jaccard ${(inter / uni).toFixed(3)}  → ${inter ? 'OVERLAP' : 'disjoint'}`);
}

// ── (c) cut-test: kill the biggest lineage's queued sparks in fork B; C is the uncut twin (null) ────────────
const big = rows[0].lin, cut = X => { for (const key of ['queue', 'next']) { const q = X[key], out = []; for (let i = 0; i < q.length; i += 3) if (q[i + 2] !== big) out.push(q[i], q[i + 1], q[i + 2]); X[key] = out; } };
const B = A.fork(), C = A.fork(); const before = (B.queue.length + B.next.length) / 3; cut(B); const removed = before - (B.queue.length + B.next.length) / 3;
console.log(`\nCUT-TEST  removed ${removed} of ${before} queued sparks (lineage ${big}) from fork B · fork C uncut · run ${T} epochs`);
const sum = new Map(); const tally = (X, tag) => { for (const [lin, e] of X.linStats) { const r = sum.get(lin) || (sum.set(lin, { A: 0, B: 0, C: 0 }), sum.get(lin)); r[tag] += e.sparks; } };
const spk = { A: 0, B: 0, C: 0 }; A.stats.followed = 0; // A carries warm-up counts; forks start fresh
for (let e = 0; e < T; e++) { A.epochStep(); B.epochStep(); C.epochStep(); tally(A, 'A'); tally(B, 'B'); tally(C, 'C'); spk.A += A.stats.followed; spk.B += B.stats.followed; spk.C += C.stats.followed; A.stats.followed = B.stats.followed = C.stats.followed = 0; }
console.log(`per-lineage sparks summed over ${T} epochs (the ${TOP} biggest at cut time):`);
console.log(`  ${'lin'.padStart(9)}  ${'A (uncut)'.padStart(10)}  ${'B (cut)'.padStart(10)}  ${'C (twin)'.padStart(10)}  B/A`);
for (const r of rows.slice(0, TOP)) { const s = sum.get(r.lin) || { A: 0, B: 0, C: 0 }; console.log(`  ${String(r.lin).padStart(9)}  ${String(s.A).padStart(10)}  ${String(s.B).padStart(10)}  ${String(s.C).padStart(10)}  ${s.A ? (s.B / s.A).toFixed(2) : '—'}${r.lin === big ? '   ← cut' : ''}`); }
let changed = 0, same = 0, twinDiff = 0; for (const [lin, s] of sum) { if (lin === big) continue; if (s.A !== s.B) changed++; else same++; if (s.A !== s.C) twinDiff++; }
console.log(`  other lineages with A≠B spark totals: ${changed} of ${changed + same}   (uncut twin A≠C: ${twinDiff} — should be 0)`);
console.log(`  followed sparks over ${T} epochs: A ${spk.A}  B ${spk.B}  C ${spk.C}   lineages alive at end: A ${A.linStats.size}  B ${B.linStats.size}  C ${C.linStats.size}`);
let bytes = 0, bytesC = 0; for (let i = 0; i < n; i++) { if (A.cells[i] !== B.cells[i]) bytes++; if (A.cells[i] !== C.cells[i]) bytesC++; }
console.log(`  bytes differing after ${T} epochs: A vs B ${bytes} (${(100 * bytes / n).toFixed(1)}%)   A vs C ${bytesC}`);

// living-block Jaccard (lens from lab/decor.mjs: 4×4 blocks, ≥4 writes in 25 epochs and ≥10/16 cells in one opcode class)
const liveMap = X => { X.clearActivity(); for (let e = 0; e < 25; e++) X.epochStep(); return sharedLiveMap(X); };
const jac = (a, b) => jaccard(a, b).toFixed(3);
const ma = liveMap(A), mb = liveMap(B), mc = liveMap(C);
console.log(`  living-block Jaccard at +${T}: cut(A,B) = ${jac(ma, mb)}   uncut twin(A,C) = ${jac(ma, mc)}`);
