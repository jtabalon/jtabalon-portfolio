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

Integration is ongoing during the authorized hour. The final source revision, complete local/hosted results, cross-browser findings, and remaining limits will be appended before delivery. Production-dependent tickets remain open until their release acceptance criteria are satisfied. No production merge or domain assignment is part of this draft.
