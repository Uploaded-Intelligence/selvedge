# PROGRESS — Selvedge

## Current state (2026-09-22, 02:00)
- **E21 (GPT-6-advised):** positive control (sealed-wall quadrants) exposed three leaks — two in the substrate's wall handling (fixed), one fundamental: **any global allocator is a world-wide causal channel** in a chaotic medium. New `alloc` modes; `local` (per-window carrying capacity, boost 3) passes the wall control byte-for-byte. With the clean instrument: reach 12 chaotic front; reach 10 → 7/12 wounds contained <1% for 1,200 epochs (4 erased to zero); reach 11 → latent-then-breakout. E18's "no byte healing" retracted. Group-scoped budget: removes the artefact, slows fronts, creates no permanent compartments.
- Default physics unchanged (`alloc: 'cap'`), so the published page is unaffected.

## Earlier (2026-09-22, late)
- **Turn 2 (E16–E19):** meta-reflection recorded as hypothesis; interventional instrument built (coupled forks with per-event randomness, `World.fork()`, `lab/wound.mjs` + `decor/insulation/compartments/pulse`); Derrida sweep over reach. Three research briefs in `research/`. Repo now PUBLIC.
- **Key findings:** bytes chaotic (τ≈50), body-trajectories robust (τ≈300); one causal compartment + form-fixed-point islands; life and chaos switch on together at reach 9; local repair peaks at reach 10–11 (disc 0.69 vs ambient 0.72). Second-order selves: not found, and the first test was invalid (E19 amendments).
- **Physics change:** `quiescent` dial exists (E18: quieter, not teleodynamic). Default physics unchanged.

## Earlier state
- Repo (private): https://github.com/Uploaded-Intelligence/selvedge
- v1 published, private: https://claude.ai/artifact/BeaD7i2JDvp3HWMzBVD6pi — rebuild with `node page/build.mjs` (inlines `sim/*.js` into `page/template.html` → `index.html`), then republish `index.html`.
- Working physics: `blockCopy=1 follow=1 refire=1 followOn=1 followMin=8`, default reach (`stepCap`) 12, mutation 1/4096, 256².
- Lens validated on Game of Life; soup control dead; 3-seed long runs consistent. Full record in NOTEBOOK.md (E0–E14).
- WIN status: (1) lens ✓ (2) unaided ignition ✓, dead control ✓, multi-species ✓ (8+ spp, one family — E15), disassembly matches census ✓ (3) multiverse ✓. North star (second-order selves): NOT found (E12).

## Key decisions + why
- **Lens judges persistence only on turned-over cells, chance-corrected.** Two earlier versions called noise alive; caught by controls (E9b).
- **blockCopy (LDIR-like copy).** Without it the shortest productive loop is an information-destroying smear, and shortest wins (E5→E6).
- **follow + refire (sparks inherited by productive code).** Without it a copy is never executed; R₀<1 (E2→E3, E5). This is the stipulated part — say so.
- **Reach is THE dial.** Eight scheduling dials gave mud/monoculture; turning stepCap DOWN gave territories (E9). Default 12 chosen from 8k-epoch balance, not the prettiest moment (E13).
- **Keep arithmetic.** It's the mutation operator; off → 7-symbol collapse (E8).

## Next steps (in order of interest) — revised after E19
0. ~~Lineage tracker~~ DONE (E20). Finding: lineages ≤400 epochs old, bodies = piles of lineages in one place, coupling is GLOBAL budget coupling — which is why E17 saw one causal compartment.
0a. ~~Group-scoped spark budget~~ DONE as `alloc=local` (E21): needed for the instrument, not sufficient for compartments.
0a'. **Basins of basins.** At reach 10/local, contained wounds define bounded basins (~100–450 cells). Map them (many wounds → co-containment clustering), then test whether two basins' fates couple (wound A inside basin 1, measure basin 2) — the first askable second-order question. Also: why do some wounds heal to zero and others front? (site property? lineage age?)
0a''. Consider `alloc=local` + reach 10 as a new default physics for the page, with the multiverse showing cap vs local.
0a-old. Group-scoped spark budget (per region / per lineage-cluster) → rerun `lab/compartments.mjs`; do causal compartments appear? This is the first dial motivated by Selvedge's own data.
0-old. Lineage tracker (the object the twins actually shared is the spark lineage, not bytes or form): tag sparks with lineage ids inherited via `next.push`; census lineages (count/size/lifetime/write-sets); cut one lineage and see who dies. Individuate before aggregating. Then, and only then, group-scoped dials (budget per lineage, bottleneck).
0b. Fix page dial text (life begins at reach 9) and rebuild/republish.

## Older next steps
1. Sharper second-order test: per-block *species identity* (needs spark→species location plumbing) instead of lens state; null at ~0.47 is too loose.
2. Living-semantics mode: opcode table stored in the world.
3. Sonification: copy-loop period → pitch; does the soup audibly "start to sing" at ignition?
4. Inspector stepper: single-step one spark and watch its heads.
5. Why does the world heat with age at reach ≥ 16? (code fraction creeps to ~.65; hypothesis: code-saturation raises garbage-execution writes.)
