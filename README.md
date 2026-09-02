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
