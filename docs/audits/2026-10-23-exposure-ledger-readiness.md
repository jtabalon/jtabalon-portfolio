# Exposure Ledger evidence readiness — 23 October 2026

Investigation for [portfolio #15](https://github.com/jtabalon/jtabalon-portfolio/issues/15), informing [Case study #7](https://github.com/jtabalon/jtabalon-portfolio/issues/7). This independently refreshes the 12 October assessment from portfolio commit `f43e691a44ef6e74561b1b0a2e46749549cb6cdf`; the source revision and release gaps are unchanged.

**Verdict: not ready to publish a Case study today. Keep Exposure Ledger as the first candidate for a qualified prototype Case study, conditional on verified claim scope, Joseph's contribution confirmation and the bounded runtime evidence below. It is not ready for a release Case study.** This investigation can be completed with these explicit blockers; its completion does not make #7 ready or select the project for Joseph.

## Immutable source and current status

Repository: [jtabalon/exposure-ledger](https://github.com/jtabalon/exposure-ledger). Inspected revision: [`a6d20b9914cb8ea3ffb9a09748c619efd894f585`](https://github.com/jtabalon/exposure-ledger/commit/a6d20b9914cb8ea3ffb9a09748c619efd894f585), committed 8 September 2026. A fresh shallow clone was inspected in isolated local storage. GitHub's default branch still resolves to that revision on 23 October; no releases or tags were returned. Candidate issues and comments were read; #17–#20 and #35 remain open, without new results in their comments.

The matching [CI run](https://github.com/jtabalon/exposure-ledger/actions/runs/34258179512) remains successful. Its archived logs were reread: **306 Python tests passed, one skipped and one warning; 71 web tests passed in seven files**. These are existing deterministic-suite results for the pinned revision and its GitHub Actions environment, not tests rerun today or a real-model quality score. The [workflow](https://github.com/jtabalon/exposure-ledger/blob/a6d20b9914cb8ea3ffb9a09748c619efd894f585/.github/workflows/ci.yml) uses PostgreSQL/pgvector for Python integration coverage and separately checks web tests, lint, types and build. The opt-in real-model check is skipped by ordinary CI.

## Inspectable evidence and limits

| Artifact at the pinned revision | Observed evidence | Limit |
| --- | --- | --- |
| [README/setup](https://github.com/jtabalon/exposure-ledger/blob/a6d20b9914cb8ea3ffb9a09748c619efd894f585/README.md), [architecture](https://github.com/jtabalon/exposure-ledger/blob/a6d20b9914cb8ea3ffb9a09748c619efd894f585/docs/architecture/ARCHITECTURE.md), [ADRs](https://github.com/jtabalon/exposure-ledger/tree/a6d20b9914cb8ea3ffb9a09748c619efd894f585/docs/adr) | Explicit AppSec problem, public Python input boundaries, deterministic/model separation, immutable evidence and PostgreSQL recovery tradeoffs | README labels the project an architecture baseline/executable scaffold; design intent alone does not establish completed behavior |
| [Asset capture](https://github.com/jtabalon/exposure-ledger/blob/a6d20b9914cb8ea3ffb9a09748c619efd894f585/packages/domain/src/exposure_ledger/asset_snapshots.py), [tests](https://github.com/jtabalon/exposure-ledger/blob/a6d20b9914cb8ea3ffb9a09748c619efd894f585/packages/domain/tests/test_asset_snapshots.py) | Static parsing, explicit project/environment selection, bounded archive rejection, unknown relationship provenance where appropriate | No analyzed-repository execution; no dynamic exploitability claim |
| [Retrieval implementation](https://github.com/jtabalon/exposure-ledger/blob/a6d20b9914cb8ea3ffb9a09748c619efd894f585/packages/storage/src/exposure_ledger_storage/retrieval.py), [embedding tests](https://github.com/jtabalon/exposure-ledger/blob/a6d20b9914cb8ea3ffb9a09748c619efd894f585/apps/api/tests/test_local_embeddings.py), [lexical fixture](https://github.com/jtabalon/exposure-ledger/blob/a6d20b9914cb8ea3ffb9a09748c619efd894f585/apps/api/tests/fixtures/lexical-retrieval-v1.json) | Filtered lexical/vector ranking, reciprocal-rank fusion, Embedding Space isolation, known-answer recall calculation | Controlled fixtures do not establish real retrieval quality or superiority to lexical retrieval |
| [Claim validator](https://github.com/jtabalon/exposure-ledger/blob/a6d20b9914cb8ea3ffb9a09748c619efd894f585/packages/domain/src/exposure_ledger/investigations.py#L149), [runner](https://github.com/jtabalon/exposure-ledger/blob/a6d20b9914cb8ea3ffb9a09748c619efd894f585/apps/worker/src/exposure_ledger_worker/investigations.py) | Citation identity/scope validation, required inference limitations, bounded follow-up and incomplete outcomes | Valid citation identity and a `supported` flag do not prove that a passage semantically entails a Claim |
| [Persistence/recovery tests](https://github.com/jtabalon/exposure-ledger/blob/a6d20b9914cb8ea3ffb9a09748c619efd894f585/apps/api/tests/test_investigation_persistence.py), [migrations](https://github.com/jtabalon/exposure-ledger/blob/a6d20b9914cb8ea3ffb9a09748c619efd894f585/packages/storage/src/exposure_ledger_storage/migrations.py) | Controlled durable replay, immutable history, bounded recovery and invalid-citation outcomes | Tested scenarios are not production incident or uptime evidence |
| [Synthetic workbench](https://github.com/jtabalon/exposure-ledger/blob/a6d20b9914cb8ea3ffb9a09748c619efd894f585/apps/web/src/lib/demo-investigation.ts), [presentation tests](https://github.com/jtabalon/exposure-ledger/blob/a6d20b9914cb8ea3ffb9a09748c619efd894f585/apps/web/src/components/investigation-workbench.test.tsx) | Inspectable Claim-to-Evidence presentation, uncertainty and synthetic labeling | Handwritten fictional inputs and quantitative signals; no evaluated real Investigation export or public release walkthrough found |
| [Opt-in generation test](https://github.com/jtabalon/exposure-ledger/blob/a6d20b9914cb8ea3ffb9a09748c619efd894f585/apps/worker/tests/test_real_generation_model.py), [September runtime record](https://github.com/jtabalon/exposure-ledger/blob/a6d20b9914cb8ea3ffb9a09748c619efd894f585/docs/validation/issue-34-local-runtime.md) | Existing real local generation contract/timing observations on one controlled passage | Bypasses real repository capture, embeddings/retrieval and persisted end-to-end processing; no semantic quality benchmark |

The pinned tree still contains one runtime-validation document, the controlled lexical fixture and synthetic workbench. No versioned thirty-case semantic corpus, reviewed quality report, evaluated demonstration bundle or walkthrough video was found. This is an inventory of linked public evidence, not a claim that no unpublished work exists.

## Claim-to-evidence matrix

| Proposed claim | Evidence classification | Permitted scope / missing evidence |
| --- | --- | --- |
| The project supports evidence-led review of public Python dependency exposures | Observed product framing and implementation; usefulness is an inference | Call it a local-first prototype for AppSec review. No adoption or business-result claim |
| Parsing, matching and authorization are deterministic; models interpret retrieved evidence | Observed source and ADRs | Explain this implemented boundary, including its limits. Joseph's personal design responsibility remains unconfirmed |
| It improves retrieval recall with hybrid search | Hybrid implementation and controlled tests observed; improvement unsupported | Explain exposed lexical/vector/fused ranks and space isolation. A matched real corpus, labels, denominators and baseline are missing |
| It prevents unsupported conclusions | Structural validation observed; semantic correctness unsupported | Say it rejects unknown citation identities and can preserve incomplete Revisions. Do not claim semantic truth or general hallucination prevention |
| It recovers interrupted Investigations without repeating committed effects | Existing controlled tests and matching CI | Describe those scenarios and the PostgreSQL consistency tradeoff. No production reliability or uptime generalization |
| Local generation takes 7.258/3.909 seconds | Existing first-party September observation, not reproduced today | If quoted, identify the single fabricated passage, two calls, old runtime, model digest, budget and settings. No end-to-end Assessment latency or speedup claim |
| It is evaluated, released, secure or production-ready | Unsupported; relevant gates remain open | Explicit prototype maturity. Describe narrow tested safety boundaries instead of certification or deployment claims |
| Joseph personally framed, designed, implemented and evaluated the system | Merge attribution is observed; repository ownership is insufficient | The pinned merge identifies Joseph as its author. Joseph must confirm responsibilities, collaborators and AI assistance before a first-person Contribution statement |

No Joseph confirmation, restricted-employment material or new team-result evidence was supplied in this investigation. Role fit and the readiness verdict are this assessment's inferences. Test counts are suite outcomes, not a sample of real Recommendations. No new numerical model-quality or performance result was produced.

The roadmap's [release gates](https://github.com/jtabalon/exposure-ledger/blob/a6d20b9914cb8ea3ffb9a09748c619efd894f585/docs/roadmap/ROADMAP.md#L42)—including recall@10 ≥90%, human Recommendation agreement ≥80% and correct abstention ≥90%—remain targets, not achieved measurements. The September generation times describe the adapter's wall time including digest checks, with one unloaded and one loaded observation, Ollama 0.33.2, independent 120-second limits, `think: low`, temperature 0 and seed 0. The current runtime differs, so those numbers are not transferred to it.

## Current runtime and the two bounded experiments

Read-only prerequisite probes were performed on macOS **27.0.1 / arm64**. Available tooling: uv **0.9.26**, an existing Python **3.12.12** installation, default Node **25.4.0** and pnpm **11.25.0**. The documented web setup requires Node 24 and pnpm 11.19.0; that mismatch is separate from the backend blockers. The fresh clone has no `.env` or installed `.venv`. Only presence of documented environment keys was checked; their values were not printed or searched elsewhere. All documented keys were unset in this shell; defaults remain available from the documented setup.

| Prerequisite probe | Current observation |
| --- | --- |
| `docker version --format '{{json .Server}}'` under the existing default context | Exit 1; server `null`; Docker daemon unavailable |
| `127.0.0.1:5432` and `127.0.0.1:8000` using two-second TCP timeouts | Connection refused |
| `GET http://127.0.0.1:8000/health` with a four-second HTTP timeout | Connection refused; no running Assessment API |
| Ollama `/api/version`, `/api/tags`, `/api/ps` with four-second HTTP timeouts | HTTP 200; version **0.40.6**; both configured artifacts installed; no models loaded |

Inventory digests match the prior record:

- `gpt-oss:20b`: `sha256:17052f91a42e97930aa6e28a6c6c06a983e6a58dbb00434885a0cf5313e376f7`.
- `qwen3-embedding:0.6b`: `sha256:ac6da0dfba84a81fdbfbaf330198c33cd77c4cdfc53e8bc50eb581914a15621d`.

Inventory does not establish inference readiness or machine headroom. No model was loaded, unloaded, invoked or downloaded. No service was started, database migrated, dependency environment installed or paid provider configured. The README's supported pipeline requires PostgreSQL, a migrated isolated database, API and worker; those were unavailable, so submitting run requests would not produce the required evidence.

| Required bounded experiment | Outcome today | Exact next input and smallest experiment |
| --- | --- | --- |
| Normal real-model repository Investigation | Blocked before submission by unavailable database/API/runtime. No Assessment, model output, Revision or timing result exists | After the documented isolated backend is available, submit the pinned self-repository input below, retain actual capture/retrieval/model/persisted outcomes, and preserve any rejection or zero-Exposure result. A zero-Exposure run cannot substitute for generation evidence |
| Insufficient-evidence or failure run | Blocked by the same prerequisites. No success, abstention or typed failure was fabricated | Submit `{"mode":"synthetic","scenario":"worker_failure"}` through the existing Assessment endpoint for bounded delivery-failure evidence. This does not establish real-model abstention; use #35's reviewed insufficient-evidence case for that separate claim |

Proposed normal input, **not submitted**:

```json
{"mode":"repository","repository":"https://github.com/jtabalon/exposure-ledger","commit":"a6d20b9914cb8ea3ffb9a09748c619efd894f585","projectRoot":"apps/api","lockfilePath":"uv.lock","environmentProfile":{"pythonVersion":"3.12.12","operatingSystem":"macos","architecture":"arm64","selectedExtras":[]}}
```

Use the README's documented `POST /api/v1/assessment-runs` path, then inspect its Assessment, events, Exposures and immutable Revisions. Capture the actual input/evidence/configuration identities and lexical/vector/fused ranks. If the self-repository input has no relevant Exposure, select a reviewed public case with known relevant evidence under #35 rather than inventing a successful Investigation. Two examples would demonstrate only those examples; neither a synthetic failure nor deterministic CI establishes model quality or safety.

Raw prerequisite observations remain local at `output/playwright/hour-assets/exposure-ledger-runtime-probes.json` in the asset worktree. No candidate source or external issue was changed.

## Existing work, maturity and next effort

| Ticket, current status | Existing scope and consequence |
| --- | --- |
| [#17](https://github.com/jtabalon/exposure-ledger/issues/17), open | At least thirty semantic/adversarial cases, lexical/vector/fused retrieval, human-reviewed Recommendation/abstention/safety, three-run worst outcomes, Evaluation API/report and release thresholds. General-quality evidence remains missing |
| [#35](https://github.com/jtabalon/exposure-ledger/issues/35), open | Six-case diagnostic pilot through real embeddings, retrieval, generation and persistence, with human review and three runs. Existing estimate: 2–4 focused days. Explicitly does not pass or reduce #17's gates |
| [#18](https://github.com/jtabalon/exposure-ledger/issues/18), open | Evaluated immutable Revision exported as a validated, sanitized, permanently read-only demonstration; blocked by #17 |
| [#19](https://github.com/jtabalon/exposure-ledger/issues/19), open | Complete accessible/responsive review journey and browser coverage, including final demo/evaluation surfaces; stable-component hardening can proceed earlier |
| [#20](https://github.com/jtabalon/exposure-ledger/issues/20), open | Reproducible live setup, quality report, public precomputed experience, documentation/walkthrough and versioned release; not established by CI |
| [#33](https://github.com/jtabalon/exposure-ledger/issues/33), open | Coherent Assessment → Exposure → Revision selection with explicit live/error/demo states; limits the present independent review journey |

The smallest prototype path is contribution/maturity confirmation, the two bounded backend attempts once prerequisites are available, then a narrowly scoped evidence-linked narrative. Allow roughly **1–3 focused hours** for environment preparation and those attempts if the documented services work, plus **1–2 hours** for contribution review and a short draft. These are planning estimates; unavailable services, capture failure or a new evaluation requirement increase the work. A release Case study additionally needs the applicable #17–#20 evidence. This investigation does not duplicate their implementation.

Exposure Ledger chiefly demonstrates **applied-AI systems engineering**: source boundaries, provenance, retrieval, bounded model use, recoverable execution and uncertainty. This supports part of the site's production-ML positioning but currently supplies weaker evidence for statistical modeling, experiment design and validated predictive quality. If those are central to the target role, assess another existing original public project before commissioning greenfield work. Do not inflate the engineering prototype into evidence of model effectiveness.

For #7, Joseph still needs to select the project/maturity and confirm the Contribution statement and allowed claims. Prefer the smallest homepage Work presentation once those facts are recorded; adding an Indexable page requires an explicit site-direction/discovery decision. No Case study copy was published by this investigation.
