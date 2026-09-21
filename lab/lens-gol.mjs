// Ground-truth check of the Theseus lens on Game of Life.
// Expectation: still-life = inert · glider & blinker = living · chaotic soup = front.
// Sensor check: the Eulerian lens (radius 0, lag 1) must FAIL on the glider — if it
// passes, this test isn't measuring frame-tolerance at all.
import { Lens } from '../sim/lens.js';

const W = 48, H = 48;
const step = (g) => {
  const o = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let c = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++)
      if (dx || dy) c += g[((y + dy + H) % H) * W + (x + dx + W) % W];
    o[y * W + x] = c === 3 || (c === 2 && g[y * W + x]) ? 1 : 0;
  }
  return o;
};
const place = (g, x, y, rows) => rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === '#') g[(y + j) * W + x + i] = 1; }));

function measure(init, steps, lensOpts, from = 8) {
  let g = init; const lens = new Lens(W, H, { background: 0, ...lensOpts });
  let liv = 0, fro = 0, act = 0;
  for (let t = 0; t < steps; t++) {
    lens.push(g); g = step(g);
    if (t < from) continue;
    for (let i = 0; i < W * H; i++) { liv += lens.living[i]; fro += lens.front[i]; act += lens.T[i]; }
  }
  return { T: act / (steps - from), livingShare: liv / (liv + fro || 1) };
}

const world = (f) => { const g = new Uint8Array(W * H); f(g); return g; };
const rnd = (() => { let s = 7; return () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) + 0x9e3779b9 | 0) >>> 0) / 2 ** 32; })();
const cases = {
  block:   world(g => place(g, 10, 10, ['##', '##'])),
  blinker: world(g => place(g, 10, 10, ['###'])),
  glider:  world(g => place(g, 5, 5, ['.#.', '..#', '###'])),
  soup:    world(g => { for (let i = 0; i < g.length; i++) g[i] = rnd() < 0.4 ? 1 : 0; }),
};
const full = { radius: 1, patch: 3, lags: [1, 2, 4] };
const euler = { radius: 0, patch: 3, lags: [1] };

const rows = {};
for (const [k, g] of Object.entries(cases)) {
  const steps = k === 'soup' ? 30 : 60;
  rows[k] = { full: measure(g, steps, full), euler: measure(g, steps, euler) };
  console.log(k.padEnd(8), 'full: T=' + rows[k].full.T.toFixed(2), 'living=' + rows[k].full.livingShare.toFixed(2),
    '| eulerian: living=' + rows[k].euler.livingShare.toFixed(2));
}
const ok = (c, m) => console.log(c ? 'PASS' : 'FAIL', m) || c;
let all = true;
all &= ok(rows.block.full.T < 0.01, 'still-life is inert (T≈0)');
all &= ok(rows.glider.full.livingShare > 0.9, 'glider reads as living');
all &= ok(rows.blinker.full.livingShare > 0.9, 'blinker reads as living');
all &= ok(rows.soup.full.livingShare < rows.glider.full.livingShare - 0.3, 'chaotic soup reads far less living than glider');
all &= ok(rows.glider.euler.livingShare < 0.6, 'SENSOR: Eulerian lens fails the glider (so frame-tolerance is what is being tested)');
process.exit(all ? 0 : 1);
