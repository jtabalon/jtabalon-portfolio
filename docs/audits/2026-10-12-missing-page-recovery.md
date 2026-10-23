# Missing-page recovery

Date: 12 October 2026, Pacific. Candidate implementation for [issue #12](https://github.com/jtabalon/jtabalon-portfolio/issues/12). The issue and its empty comments were read before implementation, together with portfolio context, site direction and the canonical-host ADR.

## Implementation and hosting boundary

`src/app/+not-found.tsx` provides a restrained missing-page explanation, a main landmark, a level-one heading and a real “Return to homepage” link. It supplies `Page not found | Joseph Tabalon` and `noindex, follow` in the initial document. The recovery link remains a secondary text link; the homepage's narrative, contact prominence and metadata are unchanged.

[Expo's current error-handling guidance](https://docs.expo.dev/router/error-handling/) documents the custom `+not-found.tsx` route and recommends a homepage link. Source inspection of the installed Expo 55 exporter (`@expo/cli`'s `exportStaticAsync.js`) confirms its unmatched route is emitted as `+not-found.html` for a static export. Expo's runtime routing guidance alone does not configure an independent static host's HTTP status.

[Vercel's static-site guidance](https://vercel.com/kb/guide/custom-404-page) documents `404.html` in the output directory as the fallback for unmatched requests. The build now copies Expo's generated error document to that public hosting contract before verification. This small adapter is the only code that depends on the framework's generated filename. It neither redirects missing requests to the homepage nor adds a catch-all success rewrite.

`vercel.json` is unchanged, preserving `cleanUrls` and the permanent apex-to-www redirect. The page is still a static Expo export. There is no function, backend, CMS, authentication or new Indexable page.

The exported error document and its direct generated alias carry `noindex` even if a host serves those explicit files with HTTP 200. Unknown URLs must return genuine HTTP 404 through Vercel's fallback behavior. Diagnostic sitemap generation remains disabled. Blog, Admin and sign-in routes are not introduced. Robots, sitemap, Search identity, Social preview and Public identity retain the homepage-only Discovery policy.

## Verification

The existing public-export verifier now checks the hosting-facing `404.html` for its title, main landmark and actual homepage anchor, then requires `noindex` on every exported HTML document other than the homepage. Existing homepage/discovery/image/canonical-redirect assertions remain in place. These assertions inspect visitor-facing output; they do not assert the error component's nesting or Expo's internal fallback filename.

Local checks passed:

- `bun run typecheck` and `bun run lint`.
- `EXPO_NO_DOTENV=1 bun run build:web`, including the adapter and existing/extended export verification. The initial HTML contains a main landmark, level-one heading, title, noindex directive and plain homepage anchor. Both exported error documents remain noindex.
- Playwright CLI 0.1.22 with Headless Chrome 155.0.0.0 at 390×844. With JavaScript enabled, Tab focused the recovery link, its visible focus ring was inspected, and Enter reached `/` with the homepage content/title and `index, follow`. With JavaScript disabled in a fresh context, the error structure and link remained available, and Tab/Enter reached the initial-HTML homepage. The error screenshot was visually inspected and no horizontal overflow was observed. Browser/server processes were closed after the checks.
- A temporary local static-server shim returned the exported `404.html` with HTTP 404 for an arbitrary missing path, a nested missing path plus query, `/blog`, `/admin`, `/sign-in` and `/_sitemap`. The homepage returned 200; explicit `/404.html` and `/+not-found.html` returned 200 with noindex. This confirms the artifact content and recovery under the shim, not Vercel's routing behavior. Each error navigation produced Chrome's expected failed-resource console entry for the HTTP 404 document, with no additional application error or warning observed.

The first worktree export discovered no routes under the shared dependency/Metro cache and failed at the adapter's missing-input copy. One cold retry using `EXPO_NO_DOTENV=1 bunx expo export --platform web --clear` emitted both expected routes; the normal build command then passed. No source or Metro configuration workaround was needed, and stale/incomplete export output did not silently pass verification.

Screenshots and CLI snapshots are local review artifacts under `output/playwright/` and `.playwright-cli/`, excluded from the candidate commit. These checks cover Chrome and the exported document; they are not an assistive-technology conformance claim or deployed HTTP proof.

## Required deployed verification

Issue #12 must remain open until the deployed responses are verified. After publication, check the following on the Canonical site:

- `/` returns HTTP 200 with the existing search/share/identity metadata and homepage-only sitemap.
- An arbitrary unknown path, a nested missing path, `/blog`, `/admin`, `/sign-in` and `/_sitemap` return HTTP 404 with a useful noindex explanation and working homepage recovery.
- Explicit generated error URLs remain outside indexing even when directly served successfully.
- Keyboard activation of “Return to homepage” reaches the real homepage. Repeat with JavaScript disabled to inspect the initial-HTML recovery path.
- The apex host permanently redirects an unknown path plus query to the same www path plus query before the missing-page response. Existing discovery and public image resources remain available.

A local static server can demonstrate the exported page and its recovery interaction; it cannot establish Vercel's deployed status or redirect behavior. No deployment, hosting-setting mutation, push or issue closure is part of this candidate.
