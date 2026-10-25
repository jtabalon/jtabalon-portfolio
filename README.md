# Joseph Tabalon Jr. Personal Site

A web-first personal site built with Expo, React Native, Expo Router, NativeWind, TypeScript, and Bun.

The public experience is a single page at `/`. Its content is versioned with the application and does not require environment configuration or a content backend.

## Local workflow

Use Node 24.3 or newer within the 24.x line and Bun 1.3.10 or newer. Node 24.14 satisfies the current dependency
engine ranges; the release build logs its exact Node and Bun versions.
`check` and the release gate reject other Node versions before type checking or
lint. The package engine range also keeps Vercel on the supported 24.x line.

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

The export command also verifies the initial HTML, search and sharing metadata, structured public identity, discovery files, public images, and canonical redirect configuration. It rejects a non-indexable homepage, malformed error indexing directives, unintended HTML routes, and recovery aliases that differ from the normalized fallback.

After a production deployment, complete the [production verification checklist](./docs/seo-release-checklist.md). It ties the deployed revision to the Contact, navigation, recovery, asset and discovery checks required before closing production-dependent work.

## Release verification

Run the same command that gates the Vercel build:

```bash
bun --no-env-file run verify:release
```

It runs type checking, lint, a static export, export verification, and the
exported-site browser regressions. The entry command and nested Bun processes
disable automatic `.env` loading, while `EXPO_NO_DOTENV=1` disables Expo's loader
for checks and export. Explicit shell and hosting environment variables remain
available. The command installs the Chromium headless shell required by the
pinned Playwright version.
The shared browser runner always tests this checkout's `dist`; it ignores
`SITE_BASE_URL` and `SITE_APEX_URL` overrides. Use the direct recovery-suite command
in the [production checklist](./docs/seo-release-checklist.md) for hosted checks.
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
bun --no-env-file run test:browser
```

The command discovers the browser suites in `tests/*.mjs`, serves `dist` on an
ephemeral localhost port, and closes the server and browser afterward. The Contact
regression checks text and links against the
card and viewport at 320, 390, 768, 820, 912, 1024, and 1440 CSS pixels, at normal
and 200% Contact text sizes. It also checks link destinations, filled Email me
prominence, Secondary link presentation, hit targets, and keyboard order. Text
sizes and line heights are doubled without widening the viewport; this is a
Contact text-reflow simulation, not browser zoom or a whole-site accessibility audit.

The other suites cover responsive portrait selection, reading and contact while
fonts are pending or fail, reserved portrait layout when its image is missing,
JavaScript-disabled access, useful HTTP 404 recovery, page landmarks, and
section focus through ordinary links, fragments, and browser history. A
standard-density mobile case selects and decodes the 320-pixel portrait.
Narrow-screen reflow checks double all rendered text and inspect text/link bounds,
including clipping inside the page's scroll container; this remains a text-reflow
simulation, not browser zoom. External evidence links must open their declared
isolated tabs without changing the portfolio;
the browser regression intercepts those destinations rather than depending on
third-party service availability. Each suite
fails on its captured application exceptions.

Chromium is the release gate. Additional navigation and recovery checks can be run
with the other Playwright engines:

```bash
bunx playwright install firefox webkit
NAVIGATION_BROWSER=firefox bun --no-env-file tests/navigation.mjs
NAVIGATION_BROWSER=webkit bun --no-env-file tests/navigation.mjs
ERROR_BROWSER=webkit bun --no-env-file tests/errors.mjs
```

Optionally set `BROWSER_ARTIFACT_DIR` to a private directory outside `dist` and
`public` to capture each scenario. Screenshots are not part of the static export.
