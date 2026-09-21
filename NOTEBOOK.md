# SELVEDGE — field notebook

Record of what was tried, what happened, and what it changed. Failures included.
Plan: `~/.claude/plans/system-reminder-the-user-started-synthetic-squid.md`. All runs 2026-09-21.

## Method (so this stays systematic)
Each entry = **hypothesis → one change → measurement → verdict → what it changes.**
One dial per experiment. Every ignition claim needs a negative control. Look at pictures, not only scalars.

---

## E0 — Theseus lens on Game-of-Life ground truth · PASS
`node lab/lens-gol.mjs`
- Hypothesis (advisor's): glider = high T·P. **Mine: false for a same-place (Eulerian) lens** — a glider's cells don't persist in place.
- Result: Eulerian lens → glider living-share 0.40, blinker 0.20 (wrong). Frame-tolerant lens (max over shifts ≤1, lags 1/2/4) → glider 0.98, blinker 1.00, still-life T=0, chaotic soup 0.43.
- **Finding:** there are two kinds of self — *territorial* (form persists in place while matter turns over) and *nomadic* (form persists while place turns over). One lens covers both only if persistence is measured in the best-matching frame. The Eulerian variant is kept in the test as a sensor that must fail.

## E1 — Gate A: hand-written 6-byte row-copier `L1 [ . F0 F1 ]` · FAIL (informative)
- Spreads at first (1→11 copies in 40 epochs), knockout control stays at 1. Then goes **extinct** by epoch ~300.
- Why: (a) growth is linear — only the top edge advances; (b) a spark landing on `F1` makes it overwrite its own `]`.
- Changes: my own design intuition about "the minimal replicator" is not trustworthy; let the soup say what lives.

## E2 — Random soup, base physics (follow=0) · transition, but no organisms
- copies/spark 0.8→5.2, zlib ratio 1.00→0.90 by epoch 4000; **control with copy disabled stays flat at 1.000.**
- Picture (`snap1.png`): opcodes enriched from 5.5% to ~40% of the world. No territories.
- **Finding:** an *autocatalytic chemistry* transition — copy-ops breed copy-ops — not life. Census was also lying: top "species" `[ . ]` copied a cell onto itself. Fixed: only copies with h0≠h1 count.
- Quantitative reason replicators can't hold: row-copier reproduces ~0.3/epoch (needs a random spark in a 19-cell window, facing right) but its 6 bytes are hit by junk writes ~1.5/epoch. R₀<1. BFF avoids this because every tape is executed every epoch — *a copy only counts if it gets run.*

## E3 — `follow`: a spark that copied begets a child spark where it first wrote · BOOM-BUST
- `follow=1`: at 256², seed 1 — species **`[ L0 , ]`** (never designed by me) takes over: 1.1M sparks, zlib → 0.14. Then the world collapses to a teal monoculture of head-move opcodes and decays to hot noise (`film1.png`).
- **Finding:** `[ L0 , ]` is a *distributed replicator*: each spark smears ONE byte sideways; no execution copies an organism, but the population of sparks copies whole rows. Replication as a collective act.
- Long traces (20k epochs, 3 seeds): ignites in 1/3 seeds, **one-shot**; hot noise is absorbing. Not an ecology.

## E4 — count only copies that move to a new target (`followOn=1`) · kills ignition
- Closing the stamp loophole removed ignition entirely (0/6 runs). So E3's boom was bootstrapped by degenerate stamps concentrating execution near code. Kept as a dial.

## E5 — `refire`: productive sparks also fire again in place (metabolism / self-repair) · sustained but mud
- zlib hovers 0.75–0.9 for 10k epochs in all 3 seeds — no bust. But `film2.png` shows code-rich noise scribbled with short smear lines (incl. diagonals). No territories. Aesthetic risk #4 realised.
- **Root cause (structural):** in this instruction set the *shortest* productive loop is a smear (3 ops, one head moves) — information-destroying and harmless to its own row. Shortest-wins ⇒ smears always beat faithful copiers.

## E6 — `blockCopy`: copy also advances both heads (LDIR-like) · *in progress*
- Hypothesis: makes `[ . ]` a faithful copier (4-byte weaver `L1 [ . ]`), and makes same-row smears overwrite their own code (self-limiting). Predicts: territories of row-coherent texture, fronts where warp meets weft.
- **Verdict E6:** Gate A PASS — 4-byte weaver `L1 [ . ]` fills all 128 rows and holds (knockout stays 1). Random soup ignites in 4/4 seeds within ~200 epochs, control flat. But the film (`film3.png`) still ends in dense code-noise with long copy-op smears. Sustained, mud.

## E7 — three "cooling" dials, measured with a neighbour-coherence metric · all FAIL
`lab/territory.mjs`. sparksPerEpoch↓, randomFrac↓, stepCap↑ — woven coherence stays ~0.06; two runs collapse to a 7–15 byte alphabet. "inherited" spark share always saturates at its cap ⇒ any junk qualifies; spark-holding is selectively neutral.

## E8 — arithmetic off (`arith=0`) · hypothesis REFUTED
Predicted territories; got collapse to 7 symbols, 100% code. `+`/`-` is the soup's *mutation operator*, not just its heat. Keep it.

## Advisor consult #3 — diagnosis
Every dial since E3 was execution *scheduling*; two attractors only (mud / monoculture). Missing quantity is **reach**: a spark's heads walk `stepCap` cells = a world-spanning row, so the replication unit is the row and one pattern takes the torus. I only ever turned stepCap UP. Also: the validated lens was idle while I tuned against an ad hoc metric — measure with the instrument.

## E9 — point the Theseus lens at the soup; sweep `stepCap` DOWN · PHASE STRUCTURE FOUND
`lab/lensrun.mjs` — 256², 3 seeds, consistent across seeds:
| stepCap | living | front | reading |
|---|---|---|---|
| 128 | 0.000 | 1.00 | pure war — every cell turning over, nothing persisting |
| 32 | ~0.03 | ~0.98 | war |
| 16–24 | 0.07–0.19 | 0.2–0.85 | **territories**: clustered 0.8–0.9, all 256 byte values retained |
| 12 | 0.05–0.19 | 0.1–0.35 | sparse life |
Reach was the missing quantity. When one spark can rewrite a world-spanning line, the replication unit is the row and nothing local can exist.

## E9b — the instrument was wrong twice; both caught by controls
1. Copy-disabled control read living=0.28. Cause: a single `+` in a static patch scored as "form persisted". **Fix: judge persistence only on the cells whose matter was actually replaced** — an untouched neighbourhood proves nothing. This is the correct Theseus semantics and I had it wrong.
2. That fix made GoL chaos read 0.79 living: max over 27 shift×lag candidates finds lucky matches in a binary alphabet. **Fix: chance-correct** P against the expected best-by-luck match (alphabet collision prob p0, √(2 ln m) over m tries).
After both: GoL glider 1.00, blinker 1.00, still-life T=0, chaos 0.14; soup control living=0.004, clustered=0.03. Without the controls I'd have shipped a lens that calls noise alive.

## E10 — look at it (`lensfilm24.png`, stepCap=24 seed=1) · FIRST TERRITORIES
Epoch 200–600: sparse orange crosshatch (random sparks). 1500: a solid green living band spanning the world, an orange front advancing under it. 3000: several bodies — green cores, flame-like fronts, cream blocks of copy-op tissue in the byte view. This is the picture the plan pinned (risk #4) and it arrived from the physics, not from styling.

**Working physics (v1 default):** blockCopy=1 follow=1 refire=1 followOn=1 followMin=8 stepCap=24 mutation=1/4096 density=1.
**Stipulated, honestly:** the executor — ray shape, 24-step reach, inheritance of sparks by productive code. Organism boundaries are not stipulated.

## E11 — long run (12k epochs, 3 seeds, stepCap=24) · robust, war-dominant
living 0.052–0.063, front 0.85–0.88, clustered 0.82, all 256 bytes kept — identical across seeds. The world heats with age: islands of living tissue in a sea of front. Not calm territories; honest.

## E12 — hunt for second-order selves · NOT FOUND
`lab/second-order.mjs`: same lens, pointed at the 8×8-block map of aliveness (inert/living/front), lags 1/2/4, vs a time-shuffled null.
real / null = 0.505/0.492 · 0.570/0.464 · 0.538/0.458. A small consistent margin — what slowly-changing first-order bodies alone would produce. No evidence of collectives with their own persistence. North star not reached.
Caveat: null sits at ~0.47, so chance-correction is loose for a 3-symbol alphabet at 32×32; a sharper test would use species identity per block instead of lens state.

## E13 — choosing the page's default from the long run, not the pretty moment
First preview: the browser runs ~375 epochs/s, so a viewer lands in the 12k-epoch attractor within seconds — a 96% wall of front at reach 24. 8000-epoch sweep (2 seeds): reach 10 → living .13–.16 / front .33–.36; reach 12 → .14–.16 / .51–.57; reach 16 → .09–.11 / .67–.73; reach 20 → .07–.08 / .72. **Default reach = 12**, default clock = slow.

## E14 — finite-size effect
Same physics, seed 5, 6000 epochs: 64² at reach 12 → living 0.012, clustered 0.05 (never really ignites); 96² → 0.157; 128² → 0.143. Origin of life needs enough *trials*: habitability is a property of physics × world size. Multiverse tiles sized to 96².
