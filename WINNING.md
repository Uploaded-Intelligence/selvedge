# SELVEDGE — what winning tangibly looks like
<!-- Stable by design. Change it only deliberately, say so, and commit it alone: `git log WINNING.md` is the record of every target shift. -->

## What exists when this has won?
1. `sim/lens.js` — a substrate-agnostic "Theseus lens" (turnover × persistence-of-form) that reads Conway's Life correctly.
2. `sim/core.js` — a world that is ONE torus of bytes, no tapes or organisms given, where self-copying code ignites from random bytes and a multi-body ecology follows (not mud, not monoculture).
3. `index.html` (published artifact) — that world running live under the lens, with a census of the loops sparks actually ran, click-to-disassemble, tools to poke it, and a multiverse lab of small worlds across physics.
4. `NOTEBOOK.md` — every experiment incl. the failures.

## What does it do — for whom?
For someone asking "what even is an agent?": shows selves *forming* where none were stipulated, and gives them the instrument and the dial (reach) to find where that is and isn't possible.

## What would I see / poke / read that proves it?
- `node lab/lens-gol.mjs` → 5 PASS incl. a sensor that must fail.
- `node lab/gateA.mjs` → hand-seeded weaver spreads, knockout doesn't.
- `node lab/lensrun.mjs stepCap=12 seed=N` → living ≈ .13–.16, clustered > .8, bytes=256; `copyEnabled=0` → living ≈ 0.
- Open the page: noise → green bodies with orange fronts within ~15 s; click a body and read its code; drag reach to 64 and watch it all become front.

## WIN =
`WIN = ⟨lens validated on Life · code-life ignites unaided in a boundary-free byte torus and holds a multi-body ecology across seeds, with a dead control · a published page where I can watch it, read the living code, and turn the dial that kills it · verified by the lab scripts + opening the page⟩`

## What is deliberately NOT part of winning?
- Second-order selves (collectives with their own persistence) — north star, hunted, reported honestly either way.
- Living semantics (opcode table inside the world), sonification, WebGPU, LLM agents.

## Assumptions this picture rests on (unverified — kill or confirm)
- "Boundary-free" is half-true: the executor (ray, reach, spark inheritance) IS stipulated. Stated on the page.
- Novelty of the lens/substrate rests on two web sweeps on 2026-09-21, not an exhaustive review.
