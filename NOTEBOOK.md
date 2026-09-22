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

## E15 — is it multi-species, or one genome in many bodies? (advisor challenge) · MULTI-SPECIES, one family
Default physics, 256², 8000 epochs, 3 seeds (`lab/sweep.mjs`): species above 2% of copies, late-run mean = **8.3 / 8.4 / 8.9**; the top species changed **45 / 51 / 61 times** in 80 samples. In-page at epoch 12,100: three co-dominant loops (22/21/19%) + three at 4%. Inspector on a living cell (T .99, P 1.00) shows `,`-tissue with head-turns — same family the census reports.
Honest caveat: they are variants of ONE family — multi-copy `,` loops differing in head-turns (`B1`, `L0`, `R0`) and length — not unrelated lineages. Diversity of a clade, not of kingdoms.
Also seen in the multiverse (reach 12, no cosmic rays, 96²): diagonal X-shaped structures. Not yet investigated.

---

## E16 — meta-reflection, recorded as a HYPOTHESIS (2026-09-22, prompted by beworlding)
**Claim under test:** "second-order selves not found" is a fact about my epistemic system, not about the world.

Evidence for the claim, from my own record:
1. **The search was a checkbox.** E12 was one metric, ten minutes, at the end, null at 0.47 (no power). No positive control at second order, though I demanded one at first order (E0). I had also recommended putting second-order "outside the bar" — which guaranteed it got leftover effort.
2. **The ontology skips a level.** The lens yields a *field*; nothing individuates an entity, tracks it, or gives it identity. I asked "are there collectives of individuals?" without ever having individuals as objects. And I assumed level-2 = same thing at coarser spatial scale. Levels of individuality are about *relations* (dependence, shared fate, division of labour), not size.
3. **I may have engineered the collective away.** E3's `[ L0 , ]` replicated only as a *population* of sparks — I wrote "replication as a collective act" and then added blockCopy specifically so that single-spark copiers would win, because the collective regime looked like mud *to my lens*. A woven body — rows each kept by its own re-firing spark, repairing neighbours, sharing fate — is arguably already a society. The first/second-order ladder is mine, not the system's. The X-shapes in the multiverse tile: deferred, then shipped.
4. **Root cause: a verifying method, not a discovering one.** plan → gate → metric → pass protects me from fooling myself about claims I already have; it cannot surface a category I haven't formed. Every surprise here came from filmstrips, none from a metric. I stipulated "self = T·P" in hour one and then tuned the world until it produced what that lens sees well — instrument and world co-adapted in a closed loop with me as the unexamined component. The WIN-line habit converts open questions into ✓/✗, and "✗ not found" is what a checklist says when pointed at the unknown.

**Falsifiable prediction:** an *interventional* instrument that individuates by response (a self = the basin that heals when wounded; a collective = parts whose fates are counterfactually coupled) applied to the SAME default world will find structure the T·P lens cannot — specifically a second plateau in heal-probability vs wound-radius, or coupling between bodies at distance. If it finds nothing either, the claim is weakened and "the world lacks the conditions" gains weight (then: what conditions? → research/higher-level-individuality.md).

**Stance going forward:** anomalies are primary data · individuate before aggregating · define self by intervention, from the system's side (what gets repaired; whose fate changes when a part is removed) · hold rival lenses and look where they disagree · positive controls at every level.

**Method for the instrument — coupled forks:** two worlds, identical RNG stream, one with a wound; the XOR over time is the exact causal footprint of the wound. Heals / scars / spreads. Cheap (2× sim). This is Derrida–Stauffer damage-spreading turned into an individuation tool.

## E17 — coupled-fork wound assay: the Ship of Theseus, by intervention
Instrument: `World.fork()` + per-event hashed randomness (`rnd(k,salt)`; replaces the shared stream, physics unchanged) so twins diverge ONLY where bytes differ. Sensor: unwounded twins stay identical (0 cells differ after 50 epochs). `lab/wound.mjs`, `lab/decor.mjs`, `lab/insulation.mjs`, `lab/compartments.mjs`, `lab/band.mjs`.

**Result 1 — at the byte level the world is chaotic.** A 3-byte wound in living or front tissue changes ~35–60% of the world's bytes within 240 epochs (footprint 7,500× the wound). Wounds in inert matter scar until they touch living tissue, then explode (R=4: 1→1→2→4→220→430). Byte decorrelation τ ≈ 50 epochs.

**Result 2 — at the body level the world is robust, for a while.** Living-block Jaccard between twins stays 0.999 for 120 epochs while bytes have already diverged by thousands; meanwhile the world's own body map vs its past drops to 0.48 in 60 epochs. So both twins MOVE their bodies identically with different bytes: two ships with different planks steering the same course. Twin agreement then decays (0.67 at 240, 0.32 at 480) toward the stranger-seed baseline (0.21). Body-trajectory decorrelation τ ≈ 300.
→ "Healed" is relative to a level of description, and the levels have different timescales. Form has counterfactual robustness that matter lacks — the Theseus thesis, now quantitative and interventional, not just observational.

**Result 3 — causal compartments.** Six wounds: two landed in inert matter and reached nothing; the other four each reached ~all living tissue → ONE causal compartment. No intermediate scale of compartments among bodies from this sample. Exception: ~3.7% of living tissue was reached by no wound in 600 epochs — a vertical band at x≈76–104 where 95% of productive sparks face East (a standing waterfall of copies). Inside it bytes are only 48% identical across twins (world 23%): the FORM is a fixed point of the dynamics, the matter is not. **Caveat:** the block classifier counts class-coherent data as living, so "never reached" is over-stated; the band is form-sealed, not byte-sealed.

**Verdict on E16's prediction:** partly confirmed. The interventional instrument found structure the T·P lens cannot see (two timescales; form-fixed-point bodies; one causal compartment). It did NOT find a second plateau / intermediate compartments. Causal reading of the living world: one weakly-coupled whole with a few sealed islands. I will not dress that as "one second-order self" — it is equally read as "none".

**Research briefs landed** (`research/`): (a) plateau-vs-radius appears novel, but individuate by *co-healing signature*, not radius (done: compartments.mjs). (b) Higher-level individuality needs conditions I lack: group-scoped budget, bottleneck, conflict suppression, fitness decoupling. (c) Deacon: Selvedge is *morphodynamic* — copying breeds execution, positive feedback capped by budget. Teleodynamics needs **mutual termination**: a repaired body goes dormant and reactivates only on damage. → next dial.

## E18 — the Deacon dial (`quiescent=1`: a copy that changes nothing is not productive) · quieter, not teleodynamic
- T·P lens reads the quiescent world as LESS alive (living .06–.08 vs .18–.26). Correct failure: a dormant body has no turnover, so a turnover lens cannot see a self at rest. Only intervention can.
- Wound assay, quiescent: living-tissue byte footprint 2,300× (vs 7,750×) — 3× less chaotic; tissue-heal at R=1 rises 6%→31%. Inert wounds scar (footprint 1.0). **Dormant** tissue (lens-quiet AND code-rich, new `where=dormant`): wounds spread slowly (45× at R=1), byte-heal 0%.
- Zero-wounds (inert bytes, stop loops) give the same picture as noise-wounds → not a confound of injected code.
- **Byte-level healing is ≈0% in every regime, wound type and tissue class.** Nothing in this substrate restores what was there. Form-level robustness (E17) is re-weaving from neighbours, not repair of the damaged part; the damaged bytes are copied onward before they are overwritten.
- Deacon's condition #3 (damage *recruits* the process that restores) is absent: execution is recruited by productive copying anywhere, not by damage specifically; a wound does not summon sparks. Quiescence removed reinforcement but added no reactivation-on-damage.
**Verdict:** morphodynamic, still. The substrate is at the chaotic side of Derrida's transition at every reach tested; a teleodynamic self would need a mechanism that makes damage *locally* attract execution and makes repair *terminate* it — neither exists in this instruction set.

## E19 — the heal metric was structurally blind; fixed. Then a Derrida sweep over reach.
Advisor #4 caught that `heal%` = whole-world footprint < 0.5×area can never register *local* repair in a chaotic world, so E18's "byte-heal ≈0 everywhere" and E16's "no second plateau" were not validly tested. **Amendments:** E18 → "local repair not yet measured"; E16 → "plateau test not validly run". Also fixed: tissue classifier no longer counts data-class coherence as tissue; fork sensor re-run on the rewritten `fork()` (0 cells differ after 300 epochs, census live).
New measure: byte identity with twin inside the ORIGINAL wound disc at t=1…64, against a never-wounded ambient ring (R+2..R+5). Repair = disc rises to meet ring.

| reach | alive? | wound footprint @240 | disc→ring identity @t=64 | reading |
|---|---|---|---|---|
| 8 | **no** — copies/spark ≤0.7 for 6000 epochs, 3 seeds | 1.0 (never spreads) | 0.14 vs 1.00 | frozen and dead; the lens's "living .14–.28 at reach 8" (E9) was a false positive |
| 9 | yes, ignites late (1.4k–3.2k) | 1,357× — sits still 40 epochs then takes off | 0.52 vs 0.78 | chaotic, slow onset, substantial local repair |
| 10 | yes | 1,088× | 0.56 vs 0.66 | chaotic; disc nearly at ambient |
| 11 | yes | 2,361× | **0.69 vs 0.72** | locally healed, globally chaotic |
| 12 | yes | 7,755× | 0.44 vs 0.66 | chaotic |
| 16 | yes | 12,022× | 0.19 vs 0.31 | very chaotic |

**Findings.** (1) Life and chaos switch on together at reach 9: there is no ordered-alive regime in this instruction set; the habitable band lies entirely on the chaotic side of the Derrida transition. (2) Local repair is real and peaks near the edge (reach 10–11): a wounded body re-weaves itself to ambient identity within ~64 epochs while the wound's *consequences* still reshape the whole world — healed locally, chaotic globally. That is the precise interventional content of the Theseus lens's "form persists while matter turns over". (3) Repair falls off with reach — more reach, less repair, more chaos.
Corrections to earlier claims: "byte-level healing ≈0" (E18) is false at reach 9–11; the page's dial text ("near 10–14 living islands…") should say life begins at 9.

## E20 — individuate before aggregating: spark LINEAGES (built by an implementer subagent; sensors re-run by me)
`sim/core.js lineage=1` tags random-landing sparks with an id that inherited children carry. Tracking on/off leaves the trajectory byte-identical (fingerprint 636877759 both ways); gateA and lens-gol still pass; forked twins with tracking stay identical. `lab/lineage.mjs`, `lab/lineage.test.mjs`.

Census, default physics, epoch 2999: 1,202 lineages fired this epoch — 1,024 fresh landings and **178 inherited lineages carrying all 3,072 inherited sparks**; heavy tail (top 4 hold ~2,100). Footprints tiny (1,003 of 1,202 in a single 8×8 block). **Oldest lineage: 404 epochs; none older than 1,000.**
- The three biggest lineages all live in block-row 22 — the standing band of E17 again — with territory Jaccard 0.4–0.6: **one body, several lineages**. A body is a place where lineages pile up, not one lineage.
- Body lifetime (E17: body-trajectory decorrelation τ≈300) ≈ lineage lifetime (≤400). The body is the lineage's life, seen from outside.
- **Cut-test:** remove the biggest lineage's 1,910 queued sparks in fork B. Survivors grow 2–6× within 100 epochs; followed-spark total stays pinned at 3,072/epoch in both worlds. Coupling is real but it is *budget* coupling: lineages compete for a fixed world-wide pool of inherited execution.

**This explains E17's single causal compartment.** The global spark budget — part of the stipulated executor — couples every lineage to every other regardless of distance. It is a world-scoped resource, so the only "group" it can scope fitness to is the whole world. A second-order self needs a resource scoped *between* the individual and the world (research/higher-level-individuality.md, condition 5). That dial is now motivated by my own data, not imported: **spark budget per region or per lineage-cluster**, and see whether causal compartments appear in `compartments.mjs`.

## E21 — GPT-6 consult, then: the allocator was the coupler; positive controls; a clean instrument; healing found
**Consult** (`~/.claude/bin/advise`, Codex/gpt-6-astra, read the raw notebook/briefs/core): *don't build group quotas yet* — E20 showed global competition but not that it explains E17's single compartment; the scheduler itself can carry causation (queue-length shuffle at `epochStep`, immigrants keyed from `used`). Falsifier for any regional dial: compartments must not track the grid. Trap: `compartments.mjs` measures ever-diverged, not co-healing; long horizons make any chaotic system look like one compartment. Also: my E19 classifier fix had not reached the other assays (true — fixed via shared `lab/livemap.mjs`), and the briefs overstate necessity (Godfrey-Smith's B/G/I are graded). Taken.

**Positive control (walls).** 2-cell walls split the torus into 4 quadrants. A sound instrument must confine a quadrant-2 wound to quadrant 2. It did not — three times, for three different reasons, each a real leak:
1. sparks landing ON a wall executed there, heads stepping off into either side → walls impermeable to landings;
2. bracket-matching scans tunnelled through walls and set `ip` beyond them → scan hitting a wall = unmatched;
3. with sealed walls, `cap` still leaked into the *diagonal* quadrants (q1 at epoch 108, q3 at 118): **the allocator is a world-wide channel.** `ratio` (single scalar = cap/queue) leaks too — in a chaotic medium one scalar is enough.
Without the wall control I would have published "compartments" that were scheduler artefacts. E17's "one causal compartment" is amended: partly allocator-mediated.

**Allocators** (`alloc`): `cap` (original) · `thin` (fixed p) · `ratio` · `local` (carrying capacity per overlapping 48×48 window, `localBoost`×even share). Findings on the way: `thin` has no stationary point (dies at p≤.5, bursts and burns out at .6) — **the global cap is load-bearing for viability, not just a coupler**; neither `ratio` nor `local` ignites from noise at 1,024 immigrants/epoch (E14: ignition needs trials); `local` boost 1 starves bodies (evenly spread capacity), boost 2–3 sustains with a dip-and-recovery oscillation. Diagnostic protocol: warm under `cap`, switch allocator, settle 200.
**Leak test with `local` boost 3 + sealed walls: q0, q1, q3 never differ by a single byte in 300 epochs.** The instrument is clean.

**With a clean instrument, no-wall world (`lab/compartments.mjs`, `lab/saturate.mjs`):**
- 600-epoch signature map: still one dominant compartment (1,809 of 3,039 living blocks reached by the same 4 wounds), more marginal structure than under cap. Grid-offset falsifier: signature agreement 0.338 aligned vs 0.323 shifted by the grid → not drawn by the grid (but the two runs agree little at all — the grid offset is itself a perturbation in a chaotic world).
- Single-wound footprints vs time, 6 sites, reach 10/11/12 (`saturate.mjs`; ~4–5 distinct sites per condition, two pairs coincided):
  - **reach 12**: every wound reaches ~90% of the world by 1,200 under both allocators. Chaotic front.
  - **reach 10, local**: 3 of 6 wounds erased to **0.0% differing bytes, forever**; the rest spread slowly to ~20% (cap: ~46%) and are still creeping at 1,200.
  - **reach 11, local**: 3 erased; 3 **latent then breakout** — ≤0.2% for 200–400 epochs, then 75%. A metastable compartment: containment for a finite time, then escape.
**Corrections:** E18's "byte-level healing ≈0% everywhere" is false — at reach 10–11 about half of wounds in busy tissue are healed to byte identity with no consequence anywhere. The strictest "healed" there is. E20's mechanism claim stands in substance (the budget couples everything) but for the scheduler reason, not biological competition.
**On the dial itself:** a group-scoped (local) budget removes the non-biological channel and slows the front; it does **not** create saturating compartments at any reach tested. Second-order compartments: not found, now with an instrument that could have found them (wall control passes).
- **12-site distributions (`saturate.mjs sites=12`, local boost 3):** reach 10 → 4 wounds erased to 0.0%, 3 held as bounded scars (0.1–0.7% of the world = ~65–460 cells, static for 1,200 epochs), 5 slow fronts to 20–28%. **7/12 contained below 1% for 1,200 epochs.** Reach 11 → 3 erased, 2 latent-then-breakout (one held at 0.7% until epoch 800, then 58.6%), 7 spread.
**What this gives:** an *object*. A contained wound's footprint is a bounded basin — a region whose fate is sealed from the rest of the world by the biology itself (not by the allocator, which is now clean). That is a first-order self by intervention, at the scale of a few hundred cells. Whether basins cluster or nest (a basin of basins) is the second-order question, and it is now askable: wound inside a basin, wound outside it, see whether two basins' fates couple. Untested tonight.
