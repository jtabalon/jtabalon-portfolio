# Joseph Tabalon Jr. Personal Site

A web-first personal site built with Expo, React Native, Expo Router, NativeWind, TypeScript, and Bun.

The public experience is a single page at `/`. Its content is versioned with the application and does not require environment configuration or a content backend.

## Local workflow

Use Node 24.3 or newer within the 24.x line and Bun 1.3.10 or newer. Node 24.14 satisfies the current dependency
engine ranges; the release build logs its exact Node and Bun versions.

Install dependencies:

```bash
bun install
```

Start the Expo app:

```bash
bun run web
```

Run checks:

```bash
bun run check
```

Create a static web export:

```bash
bun run build:web
```

The export command also verifies the initial HTML, search and sharing metadata, structured public identity, discovery files, public images, and canonical redirect configuration.

After a production deployment, complete the [SEO release checklist](./docs/seo-release-checklist.md).

## Release verification

Run the same command that gates the Vercel build:

```bash
bun run verify:release
```

It runs type checking, lint, a static export with local environment-file loading
disabled, export verification, and the exported-site browser regressions. It
installs the Chromium headless shell required by the pinned Playwright version.
On Vercel it also installs the NSS/NSPR libraries missing from the build image.
Other Linux hosts need Playwright's system prerequisites installed once with
`bunx playwright install --with-deps chromium`.
Every step must succeed before Vercel can publish the build; a separate GitHub
workflow is not required for this gate. Performance reports remain review evidence
and do not impose a laboratory-score threshold.

## Exported-site browser regression

After building, install Chromium once and run the browser checks:

```bash
bunx playwright install chromium
bun run test:browser
```

The command discovers the browser suites in `tests/*.mjs`, serves `dist` on an
ephemeral localhost port, and closes the server and browser afterward. The Contact
regression checks text and links against the
card and viewport at 320, 390, 768, 820, 912, 1024, and 1440 CSS pixels, at normal
and 200% Contact text sizes. It also checks link destinations, filled Email me
prominence, Secondary link presentation, hit targets, and keyboard order. Text
sizes and line heights are doubled without widening the viewport; this is a
Contact text-reflow simulation, not browser zoom or a whole-site accessibility audit.

The other suites cover responsive portrait selection, readable content when fonts
fail or JavaScript is disabled, useful HTTP 404 recovery, page landmarks, and
section focus through ordinary links, fragments, and browser history. Each suite
fails on its captured application exceptions.

Chromium is the release gate. Additional navigation and recovery checks can be run
with the other Playwright engines:

```bash
bunx playwright install firefox webkit
NAVIGATION_BROWSER=firefox bun tests/navigation.mjs
NAVIGATION_BROWSER=webkit bun tests/navigation.mjs
ERROR_BROWSER=webkit bun tests/errors.mjs
```

Optionally set `BROWSER_ARTIFACT_DIR` to a private directory outside `dist` and
`public` to capture each scenario. Screenshots are not part of the static export.
