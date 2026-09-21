# PROGRESS — Selvedge

## Current state (2026-09-22)
- v1 published, private: https://claude.ai/artifact/BeaD7i2JDvp3HWMzBVD6pi — rebuild with `node page/build.mjs` (inlines `sim/*.js` into `page/template.html` → `index.html`), then republish `index.html`.
- Working physics: `blockCopy=1 follow=1 refire=1 followOn=1 followMin=8`, default reach (`stepCap`) 12, mutation 1/4096, 256².
- Lens validated on Game of Life; soup control dead; 3-seed long runs consistent. Full record in NOTEBOOK.md (E0–E14).
- WIN status: parts 1–3 met. Second-order selves: NOT found (E12).

## Key decisions + why
- **Lens judges persistence only on turned-over cells, chance-corrected.** Two earlier versions called noise alive; caught by controls (E9b).
- **blockCopy (LDIR-like copy).** Without it the shortest productive loop is an information-destroying smear, and shortest wins (E5→E6).
- **follow + refire (sparks inherited by productive code).** Without it a copy is never executed; R₀<1 (E2→E3, E5). This is the stipulated part — say so.
- **Reach is THE dial.** Eight scheduling dials gave mud/monoculture; turning stepCap DOWN gave territories (E9). Default 12 chosen from 8k-epoch balance, not the prettiest moment (E13).
- **Keep arithmetic.** It's the mutation operator; off → 7-symbol collapse (E8).

## Next steps (in order of interest)
1. Sharper second-order test: per-block *species identity* (needs spark→species location plumbing) instead of lens state; null at ~0.47 is too loose.
2. Living-semantics mode: opcode table stored in the world.
3. Sonification: copy-loop period → pitch; does the soup audibly "start to sing" at ignition?
4. Inspector stepper: single-step one spark and watch its heads.
5. Why does the world heat with age at reach ≥ 16? (code fraction creeps to ~.65; hypothesis: code-saturation raises garbage-execution writes.)
