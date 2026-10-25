# Dependency advisory follow-up — 24 October 2026

This supplements the [23 October dependency record](2026-10-23-dependency-refresh.md) for [issue #14](https://github.com/jtabalon/jtabalon-portfolio/issues/14). The issue and comments were read. The dependency graph at `df58408b81fa2d78c5a4d029ad7cfbb60ed6c3e8` is unchanged; no package, lockfile, override or framework edit is justified by this follow-up.

## Fresh audit result

The coordinator ran `bun audit --json` on 24 October PDT with Bun 1.3.10. It exited 1 and returned **four raw entries, four distinct advisory URLs and four affected package names: two high and two moderate, with no critical entry**. The additional report is Zod. This is the current captured count; the earlier 61 → 3 comparison remains evidence for its 23 October feed snapshot. A changed scanner report is not a count of newly exploitable production weaknesses.

The [focused evidence](evidence/2026-10-24-advisory-followup.json) contains the sanitized audit rows, installed owners, current registry maxima and capture hashes. Raw client logs and local paths are excluded.

## Patch availability within the current owners

| Reported package | Installed / newest stable allowed by current owner | Published fixed line | Disposition |
| --- | --- | --- | --- |
| `node-forge` | `1.4.0` / `1.4.0` under `^1.3.3` | None listed | Retain the existing high-report disposition. |
| `decode-uri-component` | `0.2.2` / `0.2.2` under `^0.2.2` | `0.5.0` | A supported owner change is required; latest `0.5.1` is outside the range. |
| `postcss-selector-parser` | `6.1.5` / `6.1.5` under `^6.1.2` and `^6.1.1` | `7.1.6` | A supported owner change is required; latest `7.1.7` is outside both ranges. |
| `zod` | `3.25.76` / `3.25.76` under `^3.25.76` | `4.6.6` | A supported Expo CLI owner change is required; latest `4.6.7` is outside the range. |

Primary advisory records: [node-forge](https://github.com/advisories/GHSA-86w9-cpqp-85rv), [decoder](https://github.com/advisories/GHSA-vcc3-ghjq-m6fr), [selector parser](https://github.com/advisories/GHSA-rj75-hqrm-r3gf), [Zod](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5). The npm registry maxima were re-read for both the reported packages and their allowed owners. Expo `~55.0.32`, Router `~55.0.18`, query-string `^7.1.3`, Tailwind `^3.4.17` and postcss-nested `^6.2.0` still resolve no newer stable owner than the installed versions recorded in the evidence. No compatible backport was found.

## Additional high report: Zod

The active locked path is `expo@55.0.32 → @expo/cli@55.0.37 → zod@3.25.76`; the CLI declares `^3.25.76`. The advisory describes memory exhaustion while validating oversized collections and identifies `4.6.6` as patched. [Current Zod registry metadata](https://registry.npmjs.org/zod), [Expo CLI owner metadata](https://registry.npmjs.org/@expo%2Fcli/55.0.37)

Installed CLI development-server code imports Zod in `DevToolsPlugin.schema.js` and `createMCPDevToolsExtensionSchema.js`. Its plugin/output schemas include arrays, and `DevToolsPluginCliExtensionResults.js` calls `DevToolsPluginOutputSchema.safeParse` on parsed extension output. This establishes a concrete development-tooling context to retain, not a validated exploit path. No direct Zod import or public validation API was found in the portfolio source; the published site remains a static export. This bounded inspection does not exclude every tooling or bundled use.

The React Compiler's published package also contains bundled Zod v4 source. Its apparent Zod range is a development dependency, not an active lockfile owner, and upgrading the root package alone would not prove that bundled code fixed. Do not force Zod 4 below the CLI's 3.x range or claim a comprehensive remediation from scanner counts.

The original execution-context limits for the other three reports remain in the 23 October record. Keep their residual dispositions and the new Zod report explicit, and reassess when compatible upstream owners or backports become available. Production-dependent verification and issue closure remain pending.
