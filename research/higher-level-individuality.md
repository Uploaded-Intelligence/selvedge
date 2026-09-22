# Conditions for higher-level individuality — and dials for Selvedge

**Restated goal:** cited answer to what empirically produces second-order selves (collectives-as-selves) in evolving/simulated populations, ending in a condition→evidence→dial→signature table. No fuzziness to flag.

## Conclusion

Five conditions recur across theory, digital ALife, and 2024–2026 LLM-agent work, jointly necessary. Every digital system reaching a group-*reproducing* individual had at least one hand-built in. The ceiling case, Tierra, shows interdependence (obligate cooperators, then cheaters) emerging from pure per-organism CPU competition with **no group-scoped resource** — it never crossed into group-level *reproduction* [Ray, primary](https://tomray.me/pubs/news/LocalCopy/OutOfControl15.html). Transferable negative: scale/interaction volume alone is **not** sufficient (below). Selvedge's symptom — 8 neutral species, no group selection — is what theory predicts when reproduction stays lower-level and budget isn't group-scoped.

1. **Fitness decoupling / export of fitness** — lower-level reproduction becomes contingent on collective persistence, not competitive with it. [Szathmáry, PNAS 1421398112](https://www.pnas.org/doi/10.1073/pnas.1421398112). **Contested:** Bourrat et al. argue this is a measurement artifact — fitnesses equal on a shared timescale — proposing "tradeoff-breaking" instead [eLife 73715](https://elifesciences.org/articles/73715).
2. **Bottleneck + germ/soma specialization + integration** (Godfrey-Smith's B/G/I axes) — reproduction funnels through a narrow propagule. [Godfrey-Smith, primary PDF](https://petergodfreysmith.com/PGS_Darwinian_Individuals.pdf)
3. **Limited mixing / spatial structure** — lets group-level variance dominate within-group variance (the Price condition for MLS2). Diffusion-limited hypercycles spontaneously form parasite-resistant spiral waves, selecting at the spiral's level [Boerlijst & Hogeweg, Physica D 48:17, PDF](https://tbb.bio.uu.nl/pdf/Boerlijst.pd91-48.pdf); the stochastic corrector model gets the same result via literal compartments [Szathmáry & Demeter, J Theor Biol 128:463](https://pubmed.ncbi.nlm.nih.gov/2451771/).
4. **Conflict suppression** — without policing, within-group selection erodes group advantage [West, Fisher, Gardner & Kiers, PNAS 1421402112](https://www.pnas.org/doi/abs/10.1073/pnas.1421402112). No digital case of policing *evolving* de novo found; Tierra shows the opposite.
5. **Group-scoped budget** — DISHTINY rewards coordination with resource-harvest rate [Moreno & Ofria, Artif Life 25(2):117](https://direct.mit.edu/artl/article/25/2/117/2929/Toward-Open-Ended-Fraternal-Transitions-in); Avida's task-switching cost made division of labor profitable [Goldsby, Dornhaus, Kerr & Ofria, PNAS 1202233109](https://www.pnas.org/doi/abs/10.1073/pnas.1202233109), later shown to entrench multicellularity [bioRxiv 2023.03.15.532780](https://www.biorxiv.org/content/10.1101/2023.03.15.532780v1.full); VitaNova (2024) added predation + spatial limits + collective reproduction [arXiv 2409.13254](https://arxiv.org/abs/2409.13254).

**Negative controls:** (a) 2024 BFF soup found self-replicators from pure random pairing — but its 2026 follow-up shows a plain random-walk mutation process finds them *faster*, and capping ancestry-tree depth/width does **not** stop replicators emerging, only stops them *taking over*: budget caps block dominance, not emergence [arXiv 2607.01483](https://arxiv.org/abs/2607.01483) / [orig. 2406.19108](https://arxiv.org/abs/2406.19108). (b) Moltbook (2026) measures semantic stabilization, lexical turnover, individual inertia, influence persistence, collective consensus in thousands of LLM agents: semantics stabilize but **no persistent influence supernodes, no consensus** — inertia blocks it absent shared memory. *Influence persistence* transfers directly to body persistence-time under knockout. [arXiv 2602.14299](https://arxiv.org/pdf/2602.14299)

**Wet-lab benchmark:** snowflake yeast got a group-level life cycle (birth via fracture) from ONE dial — 60 daily settling-selection transfers [Ratcliff et al., PNAS 1115323109](https://www.pnas.org/doi/10.1073/pnas.1115323109) / [Nature news](https://www.nature.com/articles/nature.2012.9810).

**Signature:** Price-equation partition of between/within-group covariance is *one* formal MLS2-vs-MLS1 test; Okasha argues contextual analysis is superior for MLS1 [Phil Trans R Soc B 375:20190364](https://royalsocietypublishing.org/rstb/article/375/1797/20190364).

**Not covered:** Biomaker CA's multicellular growth is a built-in developmental program, not emergent [arXiv 2307.09320](https://arxiv.org/abs/2307.09320). Flow-Lenia's mass-conservation law (fixed total "stuff") is the closest physics analog to a group-scoped budget [arXiv 2506.08569](https://arxiv.org/abs/2506.08569).

## Table

| Condition | Evidence | Dial for Selvedge | Signature |
|---|---|---|---|
| Fitness decoupling (contested) | Szathmáry 1421398112; Bourrat et al. eLife 73715 | Child-spark spawn requires the body to survive N ticks | Spark repro rate flat while body persistence-time rises |
| Bottleneck + integration | Godfrey-Smith; anchor = Ratcliff PNAS 1115323109 | Collapse body's rows to ONE re-seeding "propagule" spark | Row-count variance: single-ancestry vs independent births |
| Spatial/diffusion limit | Boerlijst & Hogeweg, Physica D 48:17 | Shrink `reach` locally around dense bodies | Spiral/domain formation; boundary curvature over time |
| Conflict suppression | West et al. 1421402112 (theory only; no evolved-policing digital case found) | Penalize a spark overwriting its own body's row | Within-body row death rate, before/after |
| Group-scoped budget | DISHTINY 25(2):117; Goldsby 1202233109; VitaNova 2409.13254 | Allocate epoch spark-budget per **body**, not per spark | Between/within-body spark-count variance (Price partition) |
| Shared fate / counterfactual dependence | Shelton & Michod, via Szathmáry 1421398112; `lab/gateA.mjs` exists | No new dial — extend existing knockout test to bodies | Removing one spark: does the whole body die? |
