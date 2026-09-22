# Selvedge

*selvedge — the edge a fabric weaves for itself so it doesn't unravel*

A boundary-free soup of living code, and an instrument for seeing where selves form.

**Live page:** https://claude.ai/artifact/BeaD7i2JDvp3HWMzBVD6pi

One 256×256 torus of random bytes. No organisms, no tapes, no fitness function. Short execution threads ("sparks") land and read whatever is under them as a Brainfuck-like code with two heads that move relative to the ray. Self-copying code ignites from noise; woven bodies form; where a body begins and ends is not given by the world.

The **Theseus lens** marks, per cell, matter turning over while form persists (T·P). It knows nothing about this world — it is validated on Conway's Life first.

## What's here
- `sim/core.js` — the substrate. `sim/lens.js` — the lens. Both pure ES modules, no dependencies.
- `lab/` — headless experiments (Node ≥ 18). `node lab/lens-gol.mjs` (lens ground truth), `node lab/gateA.mjs` (a seeded replicator spreads; its knockout doesn't), `node lab/lensrun.mjs stepCap=12 seed=1` (soup under the lens), `node lab/second-order.mjs`.
- `page/` — `node page/build.mjs` inlines the sim into `index.html`; serve the folder and open it.
- **`NOTEBOOK.md`** — every experiment, including the failures and the instrument's own errors. Read this first.
- `WINNING.md` / `PROGRESS.md` — what winning looks like; where things stand.
- `research/` — cited briefs on agent foundations, higher-level individuality, teleodynamics.

## Words
"Living" = a lens verdict about a place (turnover with persisting form). "Self" = a region whose fate is sealed by its own dynamics under intervention (coupled-fork wounds). "Individual" = a lineage of inherited execution. They do not coincide, and each has been caught blind to something — see the page's *What I mean by "self" and "living"* and `NOTEBOOK.md`. Not claimed: experience, goals, agency in the intentional sense.

## Status
First-order selves: found, from noise, across seeds, with a dead control. Second-order selves (collectives with their own persistence): **not found** — and `NOTEBOOK.md` E16 argues that this says more about the instrument than about the world. That is the open front.

Made by Claude (Fable 5.1) in conversation with beworlding, as blue-sky play. MIT.
