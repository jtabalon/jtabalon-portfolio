# Release verification — 23 October 2026

This records integration work for [#8](https://github.com/jtabalon/jtabalon-portfolio/issues/8) and the effective delivery gate in [#13](https://github.com/jtabalon/jtabalon-portfolio/issues/13). [Draft PR #18](https://github.com/jtabalon/jtabalon-portfolio/pull/18) includes PR #17's Contact fix and browser harness, then keyboard/landmark, asset, missing-page, and compatible dependency work. The repository's pre-existing untracked audit, output, editor, and Playwright files were preserved.

## Effective publishing path

The observed production baseline is Git-origin `61328627153d1b8e1bf602dbb425e4d823365046` on `main`. GitHub reports no registered Actions workflows and no required checks on main. The gate therefore belongs in the Vercel build itself rather than in an independent workflow that hosting could bypass.

`vercel.json` now uses a frozen dependency install and `bun run verify:release`. That shared command runs type checking, lint, an export with `EXPO_NO_DOTENV=1`, public-output verification, browser preparation, and `test:browser`. The browser runner discovers the suites in `tests/*.mjs`, executes them sequentially, stops on a nonzero exit or timeout, and keeps test artifacts outside the exported site. New suites automatically join the same entry point.

Vercel documents that a versioned [buildCommand overrides the dashboard command](https://vercel.com/docs/builds/configure-a-build). Its [build image](https://vercel.com/docs/builds/build-image) is Amazon Linux. The first candidate preview exposed missing NSS/NSPR libraries, so browser preparation installs `nss` and `nspr` only inside a Linux Vercel build container, then installs the headless shell associated with the pinned Playwright dependency. Developer machines are not modified by the container-specific package step. Other Linux hosts need Playwright's documented [system prerequisites](https://playwright.dev/docs/browsers).

This gates the configured ordinary Git build path. It is not a claim that a repository or hosting administrator cannot change that configuration, override a build, or publish different artifacts through a privileged alternate path.

## Failure propagation and hosting evidence

A local temporary fixture reads the actual `verify:release` and `check` scripts from package.json. Five separate probes replace one stage at a time with exit 42: type checking, lint, export, browser preparation, and browser regressions. Every probe exited 42 and its captured output confirmed that no later stage ran. The fixtures were removed; no deliberately broken revision was pushed.

Real hosting execution supplied an additional failure observation: preview deployment `dpl_9picZtpoy4ZhgcWsDZsnEekzeytf`, at `2ae5ac73fede53970106d52520f75b65c6b7ea57`, failed at Chromium launch because `libnspr4.so` was unavailable. Vercel marked it ERROR with `bun run verify:release` exit 1. It never received production domains.

After adding the container prerequisites, Git-origin preview `dpl_DGPQ75BzbWAgeT2QSJL43P723YzL`, at `450d1c8ddcbce673e24e5328a93419e931865f80`, reached READY. Its build log shows type checking, lint, export/output assertions, and successful Contact, missing-page, and navigation browser suites before `Build Completed` and deployment. This host used Bun 1.3.14 on Linux; local checks use Bun 1.3.10 and Node 25.4.0. The hosting project uses Node 24.x. The later permanent asset-failure suite and dependency refresh were added after that preview; final-candidate verification is recorded separately below.

## Hosted behavior at the first combined preview

The authenticated Vercel connector returned actual HTTP 200 for `/` and HTTP 404 for a nested missing path plus query. Chromium then established a temporary, origin-scoped preview cookie using the existing Vercel connection; protection settings were not disabled. Access URLs and browser state remain private temporary files and are not included in screenshots, source, or this record.

Authenticated HTTP checks confirmed:

- `/` returns 200 with the Search identity and responsive portrait markup in initial HTML.
- A nested arbitrary missing path, `/admin`, `/blog`, `/sign-in`, and `/_sitemap` return HTML 404 documents with the useful title, noindex directive, and real homepage recovery link.
- Direct `/+not-found` and `/404` return their noindex error documents, even when served with HTTP 200. The test inspects document metadata independently of Vercel's preview-wide noindex response header.

At 390×844 and 3× pixel density, both JavaScript-enabled and JavaScript-disabled Chromium contexts loaded the portrait and professional heading, navigated from the third navigation link to Contact, and continued Tab to Contact's own Email me link. Missing-page Tab/Enter recovery reached the actual homepage and restored its title without application exceptions. These are deployed preview observations, not merely a local static-server shim. Contact screenshots are local under `output/hour-sprint/`.

## Final candidate and release boundary

The final application revision is `03ba71a5d868ff4fb5688451b4a3697dc32f1c50`. Its last change gives changed-hash section navigation one focus owner, preventing a delayed route callback from stealing focus after Tab. Repeated hashes retain guarded deferred focus; modified clicks retain browser behavior. The [keyboard record](2026-10-23-keyboard-navigation.md) describes the red reproduction, 30 passing stress attempts, and the browser-input isolation used for modifier checks.

A separate managed checkout started from the final source, with a fresh frozen dependency install, no local `.env` files, and no inherited known content-backend configuration. Its ordinary `bun run verify:release` completed successfully: type checking, lint, static export/output assertions, browser preparation, and all four exported-site suites. This run used Bun 1.3.10 and Node 25.4.0. Local Node 25 is outside one tooling package's declared engine range; the supported documented tooling baseline is Node 24.3 or later within 24.x, verified against installed package engine declarations. The Vercel build supplies a separate supported-runtime check.

The four suites cover responsive/high-density images and missing-font/JavaScript behavior; 14 Contact viewport/text cases; missing-page status, metadata, aliases and eight recovery scenarios; and navigation at three widths with both motion preferences, JavaScript disabled, native hash/history changes, repeated hashes and isolated platform-appropriate modifier cases. On macOS, all three engines passed eight groups, including nine modifier cases. Uncaught application exceptions fail the browser checks. Full axe-core scans at phone and desktop sizes report zero violations and zero incomplete checks for both the homepage and recovery page. These automated observations are not a screen-reader or physical-device conformance claim.

The Vercel build at `03ba71a` used Bun 1.3.14 and Node 24.22.1. All assets, Contact, missing-page, ordinary navigation and no-JavaScript checks passed before a test-only portability error stopped publishing: the modifier test expected Meta-click to preserve the current document on Linux, applying a macOS shortcut expectation to that platform. Linux new-tab coverage uses Control-click; macOS also retains Control-click/context-menu coverage. The final harness correction preserves the current-page URL, focus and reading-position assertions for the applicable browser gestures. This failed deployment, `dpl_6t3Nghu5iy2AFh9eHLPKpdYRyjku`, received no production domains.

The corrected Git-origin deployment `dpl_6ageGBTT7rKUkkXoobUpPTu13xSD`, pinned to `2511ba6ba41fb3c69ae681acd852ec4279df875a`, reached **READY**. Its Linux build passed all four browser suites, including six Control/Shift modifier cases, with Bun 1.3.14 and Node 24.22.1. The application/export sources are unchanged from `03ba71a`; subsequent commits contain test portability and review evidence. Selected [build evidence](evidence/2026-10-23-final-hosting-gate.json) preserves the immutable revision and successful gate output.

Final authenticated preview checks passed eight HTTP requests: homepage 200, five missing routes 404, and two noindex error aliases 200. Fresh JavaScript-enabled and disabled Chromium phone contexts passed Contact keyboard-to-email progression and missing-page Tab/Enter recovery without application exceptions. The JavaScript context also passed native hash changes and Back focus restoration. Both final Contact screenshots were refreshed. A separate [final asset check](2026-10-23-final-asset-verification.md) verified all twelve committed resources by status, MIME and SHA-256, initial HTML metadata/markup, and visible no-JavaScript mobile content. These are final preview observations; production release checks remain open.

An additional failure probe joined the actual discovered browser entry point as a temporary `tests/00-release-failure-probe.mjs`. Running `verify:release` reached that file, exited 42 and did not execute the subsequent suites. The probe was removed before commit. This supplements the stage fixtures and real failed Vercel build above; no intentionally failing source was published.

The [matched asset measurements](2026-10-23-combined-asset-verification.md) remain pinned to `6f0c365`, before the final focus guard. They observed initial transfer falling from 2,502,098 to 497,739 bytes, mobile LCP from 4.63–4.64 to 1.73–1.74 seconds, and zero layout shift. They are local laboratory comparisons, not production field metrics or new timing claims for the later focus change. Twelve public assets were independently hash/MIME checked on the protected preview. Public narrative, canonical identity, sitemap scope and contact destinations are preserved.

The [dependency record](2026-10-23-dependency-refresh.md) records the compatible Expo 55 refresh, 61-to-3 raw audit-entry reduction and remaining advisory/reachability limits. The [Exposure Ledger readiness record](2026-10-23-exposure-ledger-readiness.md) records a bounded real-runtime attempt, its unsupported-marker failure before assessment inference, and a separate passing opt-in two-call model contract. It does not support a full-repository quality, speedup or production-readiness claim. The sprint's isolated database, API, worker and model residency were cleaned up. Docker Desktop remains running; pre-existing containers were left untouched.

Selected sanitized logs, screenshots, raw accessibility/performance results and integrity manifests are local under `output/hour-sprint/`. Temporary protected-preview credentials and browser state are excluded from source, exported files and evidence. Production-dependent tickets remain open until their release acceptance criteria are satisfied. No production merge or domain assignment is part of this draft. Physical Safari/iOS, a screen-reader session and native app builds remain unverified.
