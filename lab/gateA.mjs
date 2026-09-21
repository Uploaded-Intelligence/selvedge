// Gate A: does a hand-written replicator actually replicate in this physics?
// Sterile field of inert bytes, one seed organism, zero mutation.
// Negative control: same organism with its copy op knocked out must NOT spread.
import { World, OP } from '../sim/core.js';

function run(knockout) {
  const W = new World({ w: 128, h: 128, mutation: 0, seed: 3, blockCopy: 1, follow: 1, refire: 1, followOn: 1, followMin: 8 });
  W.cells.fill(200);
  const org = [OP.L1, OP.OPEN, OP.CP01, OP.CLOSE].map(op => W.byteFor(op));
  if (knockout) org[2] = 200;
  org.forEach((b, i) => W.cells[64 * 128 + 60 + i] = b);
  const count = () => { let c = 0; for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) { let ok = true; for (let i = 0; i < org.length && ok; i++) ok = W.cells[y * 128 + (x + i) % 128] === org[i]; c += ok; } return c; };
  const series = [count()];
  for (let e = 0; e < 400; e++) { W.epochStep(); if (e % 100 === 99) series.push(count()); }
  return series;
}
const live = run(false), dead = run(true);
console.log('replicator copies over time :', live.join(' → '));
console.log('knockout control            :', dead.join(' → '));
const pass = live.at(-1) > 40 && live.at(-1) > live[1] && dead.at(-1) === 1;
console.log(pass ? 'PASS Gate A: 4-byte weaver spreads; knockout does not' : 'FAIL Gate A');
process.exit(pass ? 0 : 1);
