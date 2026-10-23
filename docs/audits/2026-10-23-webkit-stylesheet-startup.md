# WebKit stylesheet startup — 23 October 2026

The WebKit missing-page regression exposed a product exception after successful Tab/Enter recovery: `Cannot manually set color scheme, as dark mode is type 'media'`. The page's `pageerror` listener captured the exception, so successful navigation alone did not pass verification.

Inspection of the installed `react-native-css-interop@0.2.7` web `color-scheme.ts` identifies the path. If its stylesheet flag is unavailable during module initialization, a head MutationObserver waits for the flag. It then calls `colorScheme.set(...)`; the same module rejects that call when the discovered flag is `media`. The report therefore depends on stylesheet availability/order and can be missed in a normal Chromium load. This pass did not reproduce the earlier pre-maintenance dependency graph, so it does not attribute introduction of the underlying package behavior to this update. [Exact package metadata](https://registry.npmjs.org/react-native-css-interop/0.2.7), [NativeWind appearance concepts](https://www.nativewind.dev/docs/core-concepts/dark-mode)

The Tailwind configuration now explicitly selects NativeWind's supported `class` mode, which permits that initialization call. The site already defines a fixed warm palette, contains no dark variants, and offers no theme control. This setting introduces no toggle, additional theme, or public design change; it resolves the incompatible internal initialization mode without patching dependency source.

After the change, the same WebKit missing-page run passes all six HTTP missing-path checks, four error aliases, and eight recovery scenarios at 320, 390, 768, and 1440 pixels, including JavaScript-disabled contexts. Chromium's same eight recovery scenarios also pass. Both runs use reduced motion. WebKit's 14 Contact viewport/text scenarios passed before this configuration correction. Final integrated normal/reduced-motion navigation and performance verification is recorded separately by the other sprint lanes.

`tests/errors.mjs` retains Chromium as its default and now accepts an explicit `ERROR_BROWSER=chromium|firefox|webkit`. This makes the WebKit recovery/startup regression reproducible without implying that the default release gate or other suites run every engine:

```bash
bunx playwright install webkit
ERROR_BROWSER=webkit bun tests/errors.mjs
```

There is no browser-specific exception suppression. Every captured application exception still fails recovery verification. Cross-browser runs and their logs remain local review evidence; hosted and production verification are separate release checks.
