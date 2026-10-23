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
| Missing-page response | 390×844, 1440×844 | 0 | 0 | 27 |

The scans used all default rules, with normal fonts loaded and reduced motion requested. The previous landmark-region finding is absent. The local missing-page shim returned HTTP 404 for the scanned error document; this verifies its content and structure, not the production host's routing configuration.

Raw axe JSON, screenshots, throwaway diagnostic scripts, and CLI snapshots are local artifacts under `output/playwright/` and `.playwright-cli/`; they are excluded from the implementation commit. The evidence is browser automation and visual/keyboard inspection, not a full screen-reader session or a WCAG conformance claim. Playwright WebKit is not physical Safari/iOS. Native app builds, physical devices, and deployed behavior were not verified in this lane. Deployed navigation verification remains required before closing #10.
