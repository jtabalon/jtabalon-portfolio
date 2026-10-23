# Keyboard navigation and landmarks — 23 October 2026

Candidate verification for [issue #10](https://github.com/jtabalon/jtabalon-portfolio/issues/10), performed on the static export. The implementation began from the Contact fix and browser harness at `dcf0a72` and was also checked with the integrated asset, missing-page, and delivery-gate changes at `a4ed468`.

Section activation focuses the destination heading, scrolls it into view, and gives keyboard users a visible outline. The temporary negative `tabindex` allows programmatic focus and is removed on blur. It adds no heading to ordinary sequential Tab order. The next Tab proceeds from the destination, including About, which has no controls of its own. Work, About, Contact, the Career Snapshot publication link, and Back to top retain their real fragment URLs.

The existing frame now exposes one banner, navigation, main, and contentinfo landmark. The footer is a sibling of main. The name and four section headings retain levels 1, 2, 2, 2, 2; link names, content order, and presentation are preserved. The existing 80-pixel section-to-footer spacing is preserved outside main.

## Native fragment regression

The broader browser pass reproduced an additional defect: load `/#work`, then set `location.hash = '#about'` in the same document. The URL changes, but the About heading ends up below the viewport. At 390×1000, its measured top was approximately 2,413 pixels in Chromium/WebKit and 2,420 in Firefox. The same native changes work with JavaScript disabled. Fresh-document fragment loads also work.

A retained reference to the original Work element becomes disconnected after the native hash change. This distinguishes a route replacement from a failure to identify the anchor: the browser scrolls the old document, then the router replaces its content. A browser regression asserting the visible About destination was added before the fix and failed with its five-second timeout.

The homepage now observes Expo Router's documented `#` search parameter and restores the destination through the same focus/scroll helper after the route commits. A second regression caught Chromium clearing immediately restored focus on Back: instrumentation recorded a heading focus call followed by focusout about one millisecond later. Restoration now runs on the next animation frame, after that browser history step; the pending callback is cancelled when the fragment changes or the route unmounts. The existing link handler still handles repeated links to the current hash. History and URLs remain managed by the browser/router, and navigation remains immediate. [Expo's URL parameter documentation](https://docs.expo.dev/router/reference/url-parameters/) describes the hash parameter; the installed Expo Router source was also inspected. [MDN's history event sequence](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event#when_popstate_is_sent) places persisted-state restoration after `popstate`.

## Browser and manual checks

The exported-site suite passes in Playwright 1.58.2 Chromium, Firefox 146.0.1, and WebKit 26.0. Each engine covers 390, 820, and 1440-pixel viewports with both reduced and ordinary motion preferences, plus a JavaScript-disabled phone context.

- Keyboard activation of all five paths focuses the expected heading, preserves its URL, keeps that heading visible, and sends the next Tab to the expected control. About proceeds to Contact's email action; Contact does not jump back to the Hero.
- The phone/reduced-motion scenario additionally checks all five paths with pointer activation, normal forward and reverse Tab order, native same-document hash changes, browser Back/Forward, and a repeated Contact link while the hash is unchanged.
- Work, About, Contact, and top are loaded as new documents with fragments. JavaScript-disabled checks cover the initial professional heading, portrait, email link, all five ordinary fragment links, direct fragments, and the native Contact-to-email Tab sequence.
- Firefox's initial native overflow-scroller focus is asserted separately before its navigation links. The test preserves that browser affordance; Chromium still checks the original three-Tab Contact reproduction.
- The reduced-motion checks retain the existing Hero transform suppression. Navigation uses immediate scrolling in both motion modes.

A separate manual Playwright CLI pass at 390×844 used three Tabs and Enter from the initial Chromium page. The Contact heading received the visible focus outline; the next Tab visibly focused Contact's Email me link. The accessibility snapshot exposed the four intended landmarks and unchanged descriptive link names. Both focus screenshots were visually inspected.

Type checking, Expo lint, static export verification, the existing 14 Contact scenarios, missing-page recovery, and the navigation suite pass on the combined implementation. Cross-browser navigation can be repeated after installing the additional engines:

```sh
bun run build:web
bun tests/navigation.mjs
bunx playwright install firefox webkit
NAVIGATION_BROWSER=firefox bun tests/navigation.mjs
NAVIGATION_BROWSER=webkit bun tests/navigation.mjs
```

The normal release command continues to use Chromium. Its runner discovers `tests/navigation.mjs` automatically. Each browser context also checks for uncaught application errors so asynchronous dependency failures cannot hide behind successful focus assertions. Navigation checks assert settled font status after network idle rather than waiting on an unbounded font promise with JavaScript disabled.

## Accessibility scan and limits

Full axe-core 4.13.0 scans of the combined exported site report:

| Document | Viewports | Violations | Incomplete checks | Passed rules per scan |
| --- | --- | --- | --- | --- |
| Homepage | 390×844, 1440×844 | 0 | 0 | 36 |
| Missing-page response | 390×844, 1440×844 | 0 | 0 | 28 |

The scans used all default rules, with normal fonts loaded and reduced motion requested. The previous landmark-region finding is absent. The local missing-page shim returned HTTP 404 for the scanned error document; this verifies its content and structure, not the production host's routing configuration.

Raw axe JSON, screenshots, throwaway diagnostic scripts, and CLI snapshots are local artifacts under `output/playwright/` and `.playwright-cli/`; they are excluded from the implementation commit. The evidence is browser automation and visual/keyboard inspection, not a full screen-reader session or a WCAG conformance claim. Playwright WebKit is not physical Safari/iOS. Native app builds, physical devices, and deployed behavior were not verified in this lane. Deployed navigation verification remains required before closing #10.

## Final integration and focus ownership

The final source group at `6f0c365` includes refreshed Expo dependencies, platform-specific portrait components, the WebKit stylesheet-startup correction, and the keyboard-accessible missing-page link. A fresh frozen installation, type/lint checks, export, all three navigation engines, and the four full axe scans passed against that exact source tree. The error-page scan now passes 28 rules after its recovery-link change; the initial recovery implementation passed 27.

Small exploratory checks in all three engines exercised unknown fragments, invalid percent encoding, an encoded NUL, percent-encoded About, and several valid/invalid fragments changed in one task. The homepage and contact links remained usable, no application errors occurred, encoded About focused its heading, and rapid changes finished at Contact with the next Tab reaching its email action. These probes are local diagnostic artifacts rather than a new permanent test suite.

A later combined-suite run exposed an intermittent duplicate-focus race at 1440 pixels. A focused Chromium reproduction failed on the second of two attempts: the immediate handler focused About at 526.7 ms, Tab occurred at 533.0 ms, then the route callback focused About again at 536.6 ms. The reader therefore lost the following contact link. The permanent regression now verifies that focus remains on the next control across two animation frames.

Changed-hash activations now leave focus to the committed route. Repeated-hash activations own their focus request because no parameter change occurs; they run after browser click processing and discard obsolete destinations. The same event guard leaves Meta, Control, Shift, and alternate-button handling to the browser. A Meta-Contact regression failed before this guard because the original page's focus moved to Contact. Separate phone/reduced-motion contexts check the current page's URL, reading position, and focused source for all three modifier keys across navigation, Career Snapshot, and Back to top. Only another local homepage can open during these checks. Every case closes its context after inspection. A differential WebKit trace showed that reusing a page after the modifier loop could suppress later mouse events entirely; removing only that loop restored ordinary clicks, so the permanent checks isolate native menu/window input state.

The focused 1440-pixel Chromium check completed 30 attempts without a failure after changed-hash focus had a single owner. Instrumentation recorded exactly one About focus call per activation. This focus-ownership/modified-click adjustment follows the matched performance measurement of `6f0c365`; those laboratory timings describe the measured revision rather than a new timing claim for the small later guard.

## Final source verification

The final keyboard implementation is `6dfb007d86e6dfac964ffb8576b1c429ffba3055`, integrated into the sprint branch as `03ba71a`. Type checking, Expo lint, static export, and exported-artifact verification passed. Independent Chromium, Firefox, and WebKit runs each passed all eight navigation groups: six viewport/motion combinations, JavaScript disabled, and modified clicks in isolated contexts. Each run includes the native hash/history and repeated-hash paths, with the next-Tab assertion spanning two animation frames.

Against this final export, the focused 1440-pixel Chromium reproduction again passed 30 attempts with exactly one About focus call per activation. Unknown, malformed, encoded, and rapidly changing fragment probes passed in all three engines without application errors. Full axe-core 4.13.0 scans at 390×844 and 1440×844 again reported zero violations and zero incomplete checks: 36 passed rules on the homepage and 28 on the missing-page document. The repeated-hash animation frame establishes consistent post-click scheduling; it is not presented as the cause of the separate WebKit driver-input contamination.

Raw final axe JSON, the original failing focus trace, the final Chromium and stress summaries, and diagnostic sources were preserved under `output/hour-sprint/navigation` in the coordinating checkout. Independent engine logs are also retained under `output/hour-sprint/assets/final-firefox-navigation.txt` and `output/hour-sprint/errors-readiness/final-navigation-webkit-03ba71a.log`. These are local exported-site results. The performance comparison remains tied to measured revision `6f0c365`, and production, screen-reader, physical-device, and native-app limits stated above still apply.
