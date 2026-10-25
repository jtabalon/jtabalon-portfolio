# Ten-minute verification extension — 23 October 2026

The authorized extension began at 16:49:46 UTC. It verifies deployed PR-head `074260c4f7ba400b3c19db3961b183ca8ac67a75`, not merely an earlier local export. Vercel deployment `dpl_BaArX8j4djBh3suP987nBtgtzeWH` is READY. The application code remains the implementation at `03ba71a`; later changes contain harness portability and review evidence.

## Additional verified coverage

| Check | Observed result |
| --- | --- |
| Supported local runtime | With Node 24.22.1 on PATH, Bun 1.3.10 and `EXPO_NO_DOTENV=1`, the complete `verify:release` command passes type checking, lint, export/output verification and all four browser suites. No local environment file is loaded in that run. |
| Deployed navigation | Chromium 145.0.7632.6, Firefox 146.0.1 and WebKit 26.0 each pass all eight navigation groups against the immutable hosted revision. Existing heading focus, next Tab, native fragments/history, repeated links, pointer, ordinary order, no-JavaScript and uncaught-error assertions are retained. |
| Deployed race stress | Thirty Chromium About-to-next-Tab attempts pass, with exactly one About focus call per activation and focus stable across two frames. |
| Reflow and user preferences | Seven Chromium cases cover 720×500, 360×250 and 320×256 CSS-pixel layouts, reduced motion, emulated forced colors, forced colors with all five font requests aborted, and forced colors without JavaScript. All eleven links remain reachable and within the viewport; all 45 rendered text nodes have zero horizontal clipping. Reduced-motion cases remove the Hero transform. |
| Forced-colors focus | Focus indicators remain visible as solid two-pixel outlines when shadows are suppressed. Screenshots and computed styles agree; no CSS change is warranted. |
| Production boundary | A fresh Vercel lookup of the canonical host still resolves to production `dpl_5ZhQ7thof1ponM2JE3wkF7cBBbGg`, commit `61328627153d1b8e1bf602dbb425e4d823365046`. No production publication occurred. |

Hosted navigation uses scratch adapters of the committed suite, with origin-scoped protected-preview state and the original behavioral assertions. Firefox can return 304 for cached-document revalidation; the adapter accepts 200/304 only while also checking the expected homepage title and origin. Modifier checks run on macOS and cover nine Meta/Control/Shift cases; the actual Vercel Linux gate covers six Control/Shift cases. Neither adapter output nor screenshots contain preview credentials or cookie state.

The 720×500 and 360×250 cases are layout equivalents for 200% and 400% reflow from a 1440×1000 reference viewport. They are not genuine browser zoom. Forced colors is browser emulation, not a physical Windows High Contrast or screen-reader certification. The font-failure case waits 12.5 seconds past settled requests, covering Expo's font observer timeout. These observations add coverage without changing the earlier laboratory performance measurements or their revision boundary.

## Recovery-test correction

A serial WebKit no-JavaScript probe found a test blind spot: `recovery.click({ trial: true })` moved the browser from the missing page to the homepage before the test sent Enter. Without that pointer action, the page remains on the error document through the screenshot and reaches the homepage only after Enter. No application exception occurs in either probe; this is a harness observation, not a product recovery failure.

`tests/errors.mjs` removes the trial pointer action from its keyboard scenario and asserts the exact missing URL, error title and focused recovery link immediately before Enter. This prevents an earlier navigation from satisfying the keyboard-recovery assertion. The application, public content and assets are unchanged.

The hardened suite passes locally in default Chromium and WebKit and against the deployed preview in WebKit. Each run checks six genuine missing-path responses, four error aliases and eight JavaScript-enabled/disabled keyboard recoveries. The red serial probe and all three successful hardened logs are preserved separately.

Selected raw logs, safe facts, adapter provenance, red/green recovery evidence and reviewed screenshots are retained under `output/ten-minute-extension/`. Existing production-dependent acceptance steps in the [reviewer handoff](2026-10-23-sprint-handoff.md) remain open. Three dependency advisories and the disclosed physical-device, native-app and screen-reader limits remain unchanged.
