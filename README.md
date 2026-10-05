# Joseph Tabalon Jr. Personal Site

A web-first personal site built with Expo, React Native, Expo Router, NativeWind, TypeScript, and Bun.

The public experience is a single page at `/`. Its content is versioned with the application and does not require environment configuration or a content backend.

## Local workflow

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

## Exported-site browser regression

After building, install Chromium once and run the browser checks:

```bash
bunx playwright install chromium
bun run test:browser
```

The command serves `dist` on an ephemeral localhost port and closes the server and
browser afterward. The first regression checks Contact text and links against the
card and viewport at 320, 390, 768, 820, 912, 1024, and 1440 CSS pixels, at normal
and 200% Contact text sizes. It also checks link destinations, filled Email me
prominence, Secondary link presentation, hit targets, and keyboard order. Text
sizes and line heights are doubled without widening the viewport; this is a
Contact text-reflow simulation, not browser zoom or a whole-site accessibility audit.

Optionally set `BROWSER_ARTIFACT_DIR` to a private directory outside `dist` and
`public` to capture each scenario. Screenshots are not part of the static export.
