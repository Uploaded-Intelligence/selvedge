# Teleodynamics and Selvedge — research brief

## Conclusion
Teleodynamics needs **two self-undermining processes coupled so one's product HALTS the other by containment** — not mutual amplification — yielding a dormant constraint that reactivates only on damage. Selvedge's coupling (copy → child spark → more copying) is **positive feedback capped by an external budget**, the reverse of Deacon's mechanism: nothing makes one process *stop* the other. Detail in §5.

## 1. Deacon's hierarchy and AUTOGEN
Homeodynamic (equilibrium-seeking) → morphodynamic (self-organizing, amplifies order, e.g. Bénard cells) → teleodynamic ("end-directed... employs homeo- and morphodynamic processes in service of a self") [MDPI précis, secondary](https://www.mdpi.com/2078-2489/3/3/290). Primary, read directly pp.1-8: Leijnen, Heskes & Deacon, "Exploring Constraint: Simulating Self-Organization and Autogenesis," [ALIFE 2016](https://direct.mit.edu/isal/proceedings/alif2016/28/68/99450) / [PDF](https://www.informationphilosopher.com/solutions/scientists/deacon/Deacon_Exploring_Constraint.pdf). Autogen = reciprocal catalysis (A+B→C→...→G) + self-assembly (G crystallizes into shell Gⁿ). Quoted, p.8: **"The negative structural coupling ensures that self-assembly stops before the catalysts are depleted, even though they are contained... This reaction potential is employed when a crystal opens up after detachment: contained catalysts are released, initiating a new chain of catalytic reactions that provides new G particles used to repair the container, after which it may close again, completing the work cycle."** Closure *arrests* catalysis via containment; system goes dormant, self-repairs only on damage. "Absential" = dynamics organized around a specific missing state (the un-repaired shell) [MDPI, secondary](https://www.mdpi.com/2078-2489/3/4/676).

## 2. Simulations
The paper above **is** the dedicated ALife simulation (ALIFE 2016): compares coupled vs. uncoupled autocatalysis+self-assembly, reports the coupling "produces a second-order constraint that can both resist dissipation and become replicated in new substrates over time" (abstract). Companion: [Deacon et al. 2014, constraint-to-regulation](https://anthropology.berkeley.edu/sites/default/files/deacon_et_al_2014_constraint_to_regulation.pdf) — adds conditional regulation (shell opens only if substrate present).

## 3. Nearest formal neighbours (criterion / testability)
- **Montévil & Mossio 2015**: closed network, every constraint generated internally [J. Theor. Biol.](https://www.sciencedirect.com/science/article/abs/pii/S0022519315001009) (403 to curl, resolves in browser) — test: trace each constraint's causal origin.
- **Kauffman, work–constraint cycle**: "work begets constraints begets work" (via [Frontiers 2026](https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2026.1806435/full); UNVERIFIED against primary Kauffman text) — test: does output regenerate its own rate-limiting constraint?
- **Hordijk & Steel, RAF sets**: reflexive+food-generated network, graph-computable [arXiv](https://arxiv.org/pdf/2303.01809) — test: run RAF-detection on Selvedge's copy-reaction graph.
- **McMullin, computational autopoiesis**: bounded unity regenerating its own boundary [Artificial Life 10(3)](https://dl.acm.org/doi/10.1162/1064546041255548) (403 to curl) — test: region regenerates membrane-analog after ablation.
- **Rosen, (M,R)-systems**: "closed to efficient causation," fixed-point equation [Letelier et al.](https://www.academia.edu/9693151/Organizational_invariance_and_metabolic_closure_Analysis_in_terms_of_M_R_systems) (403 to curl) — test in principle, computationally costly.
- **Egbert & Barandiaran 2011, precariousness**: agency = active regulation against dissolution [author PDF, live](https://xabier.barandiaran.net/wp-content/uploads/2009/07/egbert_barandiaran_-_2011_-_quantifying_normative_behaviour_-_ecal2011.pdf) — test: perturb, check for *targeted* compensation vs. relaxation.

## 4. Strongest critique
McGinn (NYRB 2012): question-begging, "incomplete nature" confused [NYRB](https://www.nybooks.com/articles/2012/06/07/can-anything-emerge-nothing/). Separately: Juarrero alleged Deacon's argument overlapped her 1999 *Dynamics in Action* uncredited; Berkeley investigated, exonerated him of plagiarism, but critics maintain the autogen was anticipated by Varela's autopoiesis [Berkeley statement, primary](https://terrydeacon.berkeley.edu/plagiarism-investigation-exonerates-terrence-w-deacon), [Inside Higher Ed](https://www.insidehighered.com/news/2012/10/22/berkeley-launches-plagiarism-investigation-light-public-nature-complaints). Sceptic demands: computable criterion ruling out morphodynamic false positives, plus proof autogen adds to autopoiesis.

## Checklist

| # | Necessary condition | Falsifiable test |
|---|---|---|
| 1 | 2+ processes, each self-undermining alone | Disable each in isolation; must decay toward equilibrium |
| 2 | Reciprocal constraint-generation (closure) | Sever spark-inherits-from-write link; copying persisting unaffected = no closure |
| 3 | **Mutual termination**: one process's product *halts* the other via containment | Inert state (near-zero activity, body intact) that reactivates only on damage? Steady-state re-copying = fail |
| 4 | Absential/precarious organization | Damage vs. no-damage; must show *targeted extra* compensation, not relaxation |
| 5 | Invariant self-repair | Repeated ablation; same weave-topology recurs, not arbitrary patterns |

## 5. Selvedge — most likely missing condition
CONTEXT: "a spark that copied begets a child spark... and re-fires in place" — copying *generates* more execution; bands "continuously re-copy each other." That's **mutual reinforcement**, capped only by an external budget. Deacon's mechanism is the reverse: self-assembly *encloses and arrests* catalysis — the system goes **dormant** (near-zero activity, form preserved), reactivating only when damaged. Selvedge's bands are throughput-sustained — morphodynamic by Deacon's own criterion — not inert self-preservation. Missing condition: **#3, mutual termination**. No process currently makes copying stop itself by containing its own enabling resource; check whether a fully-repaired band could actively suppress further copying until damaged again.
