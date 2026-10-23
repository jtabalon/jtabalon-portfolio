# Exposure Ledger evidence readiness — 23 October 2026

Investigation for [portfolio #15](https://github.com/jtabalon/jtabalon-portfolio/issues/15), informing [Case study #7](https://github.com/jtabalon/jtabalon-portfolio/issues/7). This independently refreshes the 12 October assessment from portfolio commit `f43e691a44ef6e74561b1b0a2e46749549cb6cdf`; the source revision and release gaps are unchanged.

**Verdict: not ready to publish a Case study today. Keep Exposure Ledger as the first candidate for an architecture-focused prototype Case study, conditional on Joseph's contribution/maturity confirmation and a narrow verified claim scope. It is not ready for a release Case study.** The follow-up below reproduces typed failure boundaries and the real local generation contract, but the normal repository request fails before creating an Asset Snapshot or Investigation. Useful end-to-end repository results and semantic quality remain unverified. This completes the bounded investigation with explicit evidence gaps; it does not make #7 ready or select the project for Joseph.

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
| [Opt-in generation test](https://github.com/jtabalon/exposure-ledger/blob/a6d20b9914cb8ea3ffb9a09748c619efd894f585/apps/worker/tests/test_real_generation_model.py), [new runtime evidence](evidence/2026-10-23-exposure-ledger-runtime.json), [September record](https://github.com/jtabalon/exposure-ledger/blob/a6d20b9914cb8ea3ffb9a09748c619efd894f585/docs/validation/issue-34-local-runtime.md) | The documented contract check passed again with two real local generation calls on one controlled passage | Bypasses real repository capture, embeddings/retrieval and persisted end-to-end processing; no semantic quality benchmark |

The pinned tree still contains one runtime-validation document, the controlled lexical fixture and synthetic workbench. No versioned thirty-case semantic corpus, reviewed quality report, evaluated demonstration bundle or walkthrough video was found. This is an inventory of linked public evidence, not a claim that no unpublished work exists.

## Claim-to-evidence matrix

| Proposed claim | Evidence classification | Permitted scope / missing evidence |
| --- | --- | --- |
| The project supports evidence-led review of public Python dependency exposures | Observed product framing and implementation; usefulness is an inference | Call it a local-first prototype for AppSec review. No adoption or business-result claim |
| Parsing, matching and authorization are deterministic; models interpret retrieved evidence | Observed source and ADRs | Explain this implemented boundary, including its limits. Joseph's personal design responsibility remains unconfirmed |
| It improves retrieval recall with hybrid search | Hybrid implementation and controlled tests observed; improvement unsupported | Explain exposed lexical/vector/fused ranks and space isolation. A matched real corpus, labels, denominators and baseline are missing |
| It prevents unsupported conclusions | Structural validation observed; semantic correctness unsupported | Say it rejects unknown citation identities and can preserve incomplete Revisions. Do not claim semantic truth or general hallucination prevention |
| It recovers interrupted Investigations without repeating committed effects | Existing controlled tests and matching CI | Describe those scenarios and the PostgreSQL consistency tradeoff. No production reliability or uptime generalization |
| It rejects dependency conditions its Environment Profile cannot pin | Observed real repository request and persisted typed failure | Describe the `implementation_name` marker rejection before Snapshot creation. This demonstrates a supported rejection boundary, not successful repository investigation |
| Local generation satisfies the structured Claim/citation contract | Two observed real local calls on the existing fabricated passage | Report 14.434/5.061-second call observations with residency/settings/digest and a two-call sample. No end-to-end Assessment latency, semantic quality or statistically established speedup claim |
| It is evaluated, released, secure or production-ready | Unsupported; relevant gates remain open | Explicit prototype maturity. Describe narrow tested safety boundaries instead of certification or deployment claims |
| Joseph personally framed, designed, implemented and evaluated the system | Merge attribution is observed; repository ownership is insufficient | The pinned merge identifies Joseph as its author. Joseph must confirm responsibilities, collaborators and AI assistance before a first-person Contribution statement |

No Joseph confirmation, restricted-employment material or new team-result evidence was supplied in this investigation. Role fit and the readiness verdict are this assessment's inferences. Test counts are suite outcomes, not a sample of real Recommendations. New timings below are bounded runtime/contract observations; no numerical model-quality or user/team outcome was demonstrated.

The roadmap's [release gates](https://github.com/jtabalon/exposure-ledger/blob/a6d20b9914cb8ea3ffb9a09748c619efd894f585/docs/roadmap/ROADMAP.md#L42)—including recall@10 ≥90%, human Recommendation agreement ≥80% and correct abstention ≥90%—remain targets, not achieved measurements. The September generation times describe the adapter's wall time including digest checks, with one unloaded and one loaded observation, Ollama 0.33.2, independent 120-second limits, `think: low`, temperature 0 and seed 0. The current runtime differs, so those numbers are not transferred to it.

## Runtime follow-up and the two bounded experiments

Initial read-only prerequisite probes on macOS **27.0.1 / arm64** found the Docker daemon unavailable and the default database/API ports refused. The fresh clone had no installed environment; only presence of documented environment keys was checked, without printing or searching for secret values. Ollama **0.40.6** already had both configured artifacts installed and no loaded models.

| Authorized isolated follow-up | Observed result |
| --- | --- |
| Existing Docker Desktop/runtime | Started successfully; Docker server **20.10.12**, Compose **5.5.0** |
| Documented frozen backend setup | uv **0.9.26**, Python **3.12.12**, frozen workspace dependencies, own PostgreSQL 17/pgvector Compose project, successful migrations, loopback API and worker |
| API health | `ok`; local generation and embedding artifact readiness reported `ready` |
| Web build | Not required for these backend probes; default shell Node 25.4.0/pnpm 11.25.0 differs from the documented Node 24/pnpm 11.19.0 web setup |

Inventory digests match the prior record:

- `gpt-oss:20b`: `sha256:17052f91a42e97930aa6e28a6c6c06a983e6a58dbb00434885a0cf5313e376f7`.
- `qwen3-embedding:0.6b`: `sha256:ac6da0dfba84a81fdbfbaf330198c33cd77c4cdfc53e8bc50eb581914a15621d`.

The [versioned sanitized packet](evidence/2026-10-23-exposure-ledger-runtime.json) retains exact requests, persisted events, outcomes, artifact/configuration identities, environment versions, timings and cleanup facts. The two Assessment requests used the documented `POST /api/v1/assessment-runs` path; HTTP 201 means the request was accepted/queued, not that processing succeeded. Both were policy-allowed C1/A1 under `assessment-request-v1` / standard `0.1`.

| Required bounded experiment | Observed outcome | Timing and scope |
| --- | --- | --- |
| Normal real-model repository Investigation attempt, `a5c9d9b6-6182-458e-9af3-22458836a705` | Queued → running → failed: `unsupported_environment_marker`. The selected `uv.lock` depends on `implementation_name`, which this Environment Profile does not pin. No Asset Snapshot, Exposure, Revision or model call was produced | Persisted worker interval **0.423805 s**; observer wall time **2.225 s** including polling/fetch. This is a typed capture rejection, not successful real-model processing |
| Failure request, `ab28d03b-aba0-4925-8874-d098704cbb0e` | `{"mode":"synthetic","scenario":"worker_failure"}` queued → running → failed with the expected `synthetic_worker_failure`; no Snapshot, Exposure, Revision or model call | Persisted worker interval **0.013325 s**; observer wall time **2.194 s** including polling/fetch. This demonstrates delivery-failure persistence, not semantic abstention |

Exact normal input submitted once:

```json
{"mode":"repository","repository":"https://github.com/jtabalon/exposure-ledger","commit":"a6d20b9914cb8ea3ffb9a09748c619efd894f585","projectRoot":"apps/api","lockfilePath":"uv.lock","environmentProfile":{"pythonVersion":"3.12.12","operatingSystem":"macos","architecture":"arm64","selectedExtras":[]}}
```

Worker intervals are calculated from persisted `assessment.started` and `assessment.failed` timestamps. Observer measurements include roughly two seconds of polling plus endpoint fetches; neither is model latency. The two samples do not establish throughput or reliability in general.

After stopping the isolated worker, the documented **`make check-real-model` passed: one test in 19.94 s**. It supplies one fabricated affected-range passage directly to the generator and uses a controlled Embedding Space, bypassing real repository capture, embeddings, retrieval and persisted Investigation processing. Readiness took **0.019 s**. Its two generation observations were:

| Contract call | Observed prior residency | Adapter wall time including artifact checks | Result |
| --- | --- | ---: | --- |
| Cold candidate | unloaded | **14.434 s** | Structured Claim/citation contract passed |
| Warm candidate | loaded | **5.061 s** | Structured Claim/citation contract passed |

Both use the installed GPT-OSS digest above, Ollama 0.40.6, prompt `claims-recommendation-follow-up-v4-gptoss-low`, application JSON Schema, `stream: false`, `think: low`, temperature 0, seed 0 and independent **120-second** absolute limits. These two calls verify only that controlled contract; they supply no semantic Recommendation-quality result, real-retrieval denominator or general latency comparison. The shared machine was also performing functional website checks, so these observations must not be compared as a matched benchmark with the September timings.

The smallest next normal experiment is a reviewed, pinned public Python case whose supported lockfile markers fit the existing Environment Profile and whose public evidence yields a real Exposure. Record any rejection or zero-Exposure outcome, then retain actual retrieval ranks, configuration identities and complete/incomplete persisted Revision. Use #35's reviewed insufficient-evidence case for a semantic abstention claim. No parser feature or alternate normal request was added to work around this rejection.

The helper cleaned up its own API/worker, database container/network/volume and loaded generation model; the candidate checkout remained clean. Starting Docker Desktop automatically resumed pre-existing containers, which were left untouched with the daemon running. No candidate source, model download, paid service, new account or external issue was changed. Raw probes and detailed private run logs remain local; the committed packet excludes credentials, private paths/ports and generated model prose/reasoning.

## Existing work, maturity and next effort

| Ticket, current status | Existing scope and consequence |
| --- | --- |
| [#17](https://github.com/jtabalon/exposure-ledger/issues/17), open | At least thirty semantic/adversarial cases, lexical/vector/fused retrieval, human-reviewed Recommendation/abstention/safety, three-run worst outcomes, Evaluation API/report and release thresholds. General-quality evidence remains missing |
| [#35](https://github.com/jtabalon/exposure-ledger/issues/35), open | Six-case diagnostic pilot through real embeddings, retrieval, generation and persistence, with human review and three runs. Existing estimate: 2–4 focused days. Explicitly does not pass or reduce #17's gates |
| [#18](https://github.com/jtabalon/exposure-ledger/issues/18), open | Evaluated immutable Revision exported as a validated, sanitized, permanently read-only demonstration; blocked by #17 |
| [#19](https://github.com/jtabalon/exposure-ledger/issues/19), open | Complete accessible/responsive review journey and browser coverage, including final demo/evaluation surfaces; stable-component hardening can proceed earlier |
| [#20](https://github.com/jtabalon/exposure-ledger/issues/20), open | Reproducible live setup, quality report, public precomputed experience, documentation/walkthrough and versioned release; not established by CI |
| [#33](https://github.com/jtabalon/exposure-ledger/issues/33), open | Coherent Assessment → Exposure → Revision selection with explicit live/error/demo states; limits the present independent review journey |

The bounded setup/attempts and controlled model contract are now recorded. The smallest architecture-focused prototype path is contribution/maturity confirmation and a narrowly scoped evidence-linked draft; allow roughly **1–2 focused hours** for that review/draft. To include a useful normal-repository outcome, budget a further **1–3 focused hours** to select and run a compatible reviewed case, subject to runtime/input failures. These are planning estimates. Semantic usefulness or abstention claims need #35 and human review; a release Case study additionally needs the applicable #17–#20 evidence. This investigation does not duplicate their implementation.

Exposure Ledger chiefly demonstrates **applied-AI systems engineering**: source boundaries, provenance, retrieval, bounded model use, recoverable execution and uncertainty. This supports part of the site's production-ML positioning but currently supplies weaker evidence for statistical modeling, experiment design and validated predictive quality. If those are central to the target role, assess another existing original public project before commissioning greenfield work. Do not inflate the engineering prototype into evidence of model effectiveness.

For #7, Joseph still needs to select the project/maturity and confirm the Contribution statement and allowed claims. Prefer the smallest homepage Work presentation once those facts are recorded; adding an Indexable page requires an explicit site-direction/discovery decision. No Case study copy was published by this investigation.
