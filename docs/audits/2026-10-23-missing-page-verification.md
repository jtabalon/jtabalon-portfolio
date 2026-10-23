# Missing-page verification — 23 October 2026

This pass reuses the implementation recorded in the [12 October note](2026-10-12-missing-page-recovery.md) for [issue #12](https://github.com/jtabalon/jtabalon-portfolio/issues/12), on top of Contact PR #17 (`dcf0a72`). It independently checks the resulting export and adds `tests/errors.mjs` to the existing Bun/Playwright browser entry point. It introduces no additional test dependency or production routing configuration.

The current [Vercel custom-404 guide](https://vercel.com/kb/guide/custom-404-page) confirms that an SSG output directory's `404.html` is served when no static route matches. The build adapter supplies that file from Expo's custom unmatched route. The existing canonical redirect remains intact; no successful homepage catch-all is introduced.

## Checks performed

- `bun install --frozen-lockfile`, `bun run check`, and `EXPO_NO_DOTENV=1 bun run build:web` passed using Bun 1.3.10, Node 25.4.0, and Playwright 1.58.2.
- The existing 14 Contact scenarios passed against this export.
- The new regression checks six arbitrary, nested, or unavailable paths, including Blog, Admin, sign-in, and the diagnostic sitemap. Each returns a useful HTML 404 with the correct title, noindex directive, and real homepage anchor under the local exported-site shim.
- It discovers all non-homepage exported HTML aliases and verifies that direct or extensionless access retains the error document and noindex, even when the alias returns 200.
- Eight Chromium keyboard scenarios passed at 320, 390, 768, and 1440 CSS pixels, with JavaScript enabled and disabled. Each verifies one main landmark, a level-one heading, viewport fit, keyboard reachability and activation of the recovery link, arrival at the real homepage, usable email links, and removal of the error's noindex directive. No application exception was observed.
- The 320-pixel and desktop screenshots were visually inspected, including the visible recovery-link focus ring. Screenshots remain local under `output/playwright/missing-page/` and are excluded from the export and commit.
- A controlled local failure temporarily removed `dist/404.html`. The regression correctly failed with exit 1 because the missing path no longer returned the useful HTML document. The fallback was restored, and export verification passed again.

The browser check waits for document fonts and idle loading before beginning keyboard navigation. Its trial pointer check occurs after initial Tab focus, because scrolling an element into view can change the browser's sequential-focus starting point. The test does not add synthetic focus to the recovery link.

## Hosted verification

`bun tests/errors.mjs` runs against a local artifact server. To exercise actual deployment status and recovery behavior, run the same regression after building locally:

```bash
SITE_BASE_URL=https://the-deployment-origin.example/ bun tests/errors.mjs
```

The optional `SITE_APEX_URL=https://josephtabalonjr.com` also verifies that a missing path and query receive a permanent redirect to the identical path and query on the www Canonical site. The hosted check must be able to access the deployment rather than an authentication interstitial.

Local shim results establish the exported document and browser behavior; they do not prove Vercel's status handling. A preview can establish hosted behavior for the candidate, but production verification remains required before issue closure. No push, deployment, hosting mutation, external comment, or issue closure was performed in this slice.
