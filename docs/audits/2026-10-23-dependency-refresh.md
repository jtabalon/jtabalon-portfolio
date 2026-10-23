# Compatible dependency refresh — 23 October 2026

This implements the compatible maintenance portion of [issue #14](https://github.com/jtabalon/jtabalon-portfolio/issues/14) on the combined contact, navigation, asset, error-page, and delivery-gate candidate at `a4ed468`. The issue and its empty comments were read before work. No framework migration, dependency override, public narrative change, or deployment is part of this slice.

The [captured evidence](evidence/2026-10-23-dependency-refresh.json) records the full baseline revision, Bun/Node/Playwright versions, both lockfile hashes, raw advisory responses, residual registry metadata, and all changed package versions. It contains public package data, without credentials, hosting account identifiers, or private machine paths.

## Update and compatibility

Expo's SDK 55 compatibility check recommended the patch set selected here: Expo `55.0.32`, Router `55.0.18`, React Native `0.83.10`, Worklets `0.7.4`, and corresponding Expo module patches. React and React DOM remain `19.2.0`; Reanimated remains `4.2.1`; Playwright remains `1.58.2`. [Expo version validation](https://docs.expo.dev/more/expo-cli/#version-validation), [Expo 55.0.32 metadata](https://registry.npmjs.org/expo/55.0.32)

`bunx expo install --fix --bun` applied that compatible set. `bun update` refreshed direct dependencies within existing ranges. Their original manifest ranges were retained except for the explicit Expo-recommended patch alignment. Expo's immutable `bunx expo install --check` passes with the final installation.

Bun 1.3.10 retained many older transitive versions during the ordinary update. The lockfile was therefore regenerated from the aligned manifest, with the previous file retained locally for comparison, and installed using `bun install --force`. This lets the package manager resolve each transitive dependency within its owning package's declared range. No incompatible override, resolution rule, forced major, or new direct dependency was added. A temporary probe confirmed that this Bun version's targeted update command would add an undeclared transitive package to the manifest; that probe was removed before the final resolution. Current Bun documentation describes newer behavior, so the recorded tool version matters. [Bun update reference](https://bun.com/docs/pm/cli/update)

The resulting lockfile changes the installed version sets for 331 package names and has 1,008 slots versus 1,006 at baseline. Most changes are in the shared Expo, Metro, Babel, navigation, lint, and CSS toolchain. The full version inventory is in the evidence file. No apparent template dependency was removed from the manifest.

Notable results:

| Package | Baseline | Updated |
| --- | --- | --- |
| `@expo/metro` / Metro | `55.0.0` / `0.83.5` | `55.1.2` / `0.83.8` |
| `postcss` | `8.4.49` | `8.5.31` |
| `shell-quote` | `1.8.3` | `1.12.0` |
| `nanoid` | `3.3.11` | `3.3.20` |
| `@xmldom/xmldom` | `0.8.12` | `0.8.15`, `0.9.12` on their respective parent paths |
| `js-yaml` | `3.14.2`, `4.1.1` | `3.15.2`, `4.3.2` |
| `ws` | `7.5.10`, `8.20.0` | `7.5.13`, `8.22.0` |
| `@babel/core` | `7.29.0` | `7.29.7` |
| `image-size`, `uuid` | `1.2.1`, `7.0.3` | Their dependency paths are absent from the new lockfile |

The SDK 55 owner update moves `@expo/metro-config` to `55.0.27`, whose PostCSS range permits the fixed 8.5 branch, and Metro to `0.83.8`, which no longer owns the affected `image-size` path. These are owner-compatible resolutions rather than replacements forced underneath the older owners. [Metro-config metadata](https://registry.npmjs.org/@expo%2Fmetro-config/55.0.27), [Metro metadata](https://registry.npmjs.org/metro/0.83.8)

## Advisory comparison

Both audits used Bun 1.3.10 on 23 October 2026. The baseline was evaluated from the committed combined candidate's lockfile in a separate directory; the result was captured before comparing the refreshed lock. `bun audit --json` exits 1 when reports remain.

| Measure | Before | After |
| --- | ---: | ---: |
| Raw registry advisory entries | 61 | 3 |
| Distinct advisory URLs | 50 | 3 |
| Affected package names | 18 | 3 |
| Critical entries | 1 | 0 |
| High entries | 43 | 1 |
| Moderate entries | 15 | 2 |
| Low entries | 2 | 0 |

Raw entries may repeat an advisory for separate affected version branches. These are not counts of independently exploitable production vulnerabilities. The September and 12 October audit totals used earlier advisory-feed snapshots and are not the before measurement for this change. [Bun audit documentation](https://bun.com/docs/pm/cli/audit)

## Remaining reports and disposition

### High: node-forge 1.4.0

[GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv) concerns malformed RSA PKCS#1 v1.5 signature verification with low-exponent keys. The advisory lists no patched release; the current npm latest and newest version satisfying the owners' `^1.3.3` ranges are both `1.4.0`.

The installed paths are `expo@55.0.32 → @expo/cli@55.0.37 → node-forge@1.4.0` and the CLI's `@expo/code-signing-certificates@0.0.6 → node-forge`. Installed CLI `run/ios/codeSigning/Security.js` imports it and reads PEM certificates. The signing helper's `build/main.js` calls certificate and public-key verification when validating signing material (`certificate.verify` around line 176 and `certificate.publicKey.verify` around line 203).

This is a concrete development/native-signing tooling context. The static public application has no certificate-upload or signature-verification API, and no public-visitor path to this sink was established in this bounded inspection. That does not prove every tooling use is unreachable: processing untrusted signing material remains relevant. Retain the report with this scope, keep signing inputs trusted, and reassess when an upstream fix or compatible owner change exists. Do not claim the earlier node-forge fixes remediate this separate report. [Current package metadata](https://registry.npmjs.org/node-forge/1.4.0)

### Moderate: decode-uri-component 0.2.2

[GHSA-vcc3-ghjq-m6fr](https://github.com/advisories/GHSA-vcc3-ghjq-m6fr) requires malformed input reaching the decoder. The installed path is `expo-router@55.0.18 → query-string@7.1.3 → decode-uri-component@0.2.2`. The published fix is `0.5.0`, while the current owner's `^0.2.2` allows only the 0.2 branch; `0.2.2` is its newest matching version.

This package can be browser relevant. The inspected Expo Router inbound `fork/getStateFromPath-forks.js` uses URL `searchParams`; its outbound `getPathFromState.js` and `getPathFromState-forks.js` call `queryString.stringify`. That inspection did not establish the advisory's malformed-decoding path for this homepage. It is not a complete proof excluding all navigation consumers. Retain the residual pending an owner-compatible query-string change rather than forcing a 0.x interface change underneath the router.

### Moderate: postcss-selector-parser 6.1.5

[GHSA-rj75-hqrm-r3gf](https://github.com/advisories/GHSA-rj75-hqrm-r3gf) concerns quadratic parsing of attacker-controlled flat selectors. The affected 6.x copy is owned by `tailwindcss@3.4.19` (`^6.1.2`) and `postcss-nested@6.2.0` (`^6.1.1`). Version `6.1.5` is the newest matching release; the fix begins at `7.1.6`.

Installed Tailwind selector helpers and `postcss-nested/index.js` use this parser while building repository-owned CSS. No public request-time CSS parsing or visitor-supplied selector surface exists in the inspected application. Untrusted source contributions can still affect build inputs; this report is not dismissed solely because it is tooling. Retain the residual and evaluate a supported owner upgrade separately rather than force parser 7.x or broaden this ticket into a Tailwind/NativeWind migration.

The registry maxima and installed parent ranges for all three residuals are recorded in the evidence file. No critical report remains; the remaining high report has no published patch. This maintenance pass is not an exhaustive security assessment.

## Verification and release boundary

- `bun install --frozen-lockfile` passes and `bunx expo install --check` reports dependencies up to date.
- A filesystem check of 963 installed package manifests present in the final lock found no dependency-version range mismatch. Eight stale, unused package manifests left from the earlier installation were excluded. Every active package's declared Node engine accepts Node 24.3.0 and 24.14.0; the only mismatch at 24.2.0 is the Expo ESLint plugin described below. One tooling boundary remains explicit: `eslint-plugin-expo@1.2.1` requires Node `^22.13.0 || ^24.3.0 || ^26.0.0 || >=27.0.0`, so use a supported LTS release such as Node 24.3+ for verification. The local Node 25.4.0 checks passed, but that odd-numbered version lies outside this plugin's declared engine; those observed passes do not establish its support. The captured evidence includes the exact engine checks.
- `EXPO_NO_DOTENV=1 bun run verify:release` passes: type checking, lint, export, initial-HTML/discovery/asset verification, Chromium preparation, and all three browser suites.
- The browser suites cover Contact's 14 viewport/text scenarios; six missing-path HTTP cases, four direct error aliases, and eight JavaScript/no-JavaScript keyboard recoveries; and seven navigation configurations covering destination focus, landmarks, fragments, reduced motion, and no-JavaScript access.
- Fresh 390- and 1440-pixel homepage contexts showed the portrait, professional heading, and both Email me links with no console errors, warnings, or application exceptions. Their screenshots were visually inspected at 2× pixel density. A separate context with all WOFF2 requests blocked retained readable content and Contact access without an application exception; the expected failed-font network messages are not counted as application failures.
- The first warm export after package replacement produced empty Suspense output and was correctly rejected by the existing initial-HTML verifier. One cold `expo export --platform web --clear` succeeded, and the ordinary full release command then succeeded without a source workaround or relaxed assertion. This suggests stale transform state, but the exact cache cause was not established. Preserve the verifier and use a cold export when replacing the dependency graph.

The installed packages, rendered homepage, and link behavior were checked locally. Hosting-specific and production behavior remain release verification work; this document does not claim deployment or authorize issue closure. No push, deployment, hosting mutation, or external comment was performed in this slice.
