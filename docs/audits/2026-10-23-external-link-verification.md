# External-link and interaction verification — 23 October 2026

This four-agent follow-up began at 17:22:43 UTC from `8cd023b`. It found one application defect and two demonstrated browser-test false passes.

## External evidence tabs

The homepage declares `target="_blank"` for its three Published Work links and LinkedIn, but both exported and hydrated anchors lacked `target` and `rel`. A trusted Enter on the GitHub profile link navigated the portfolio tab and created no popup. Expo Router's `asChild` forwarding supplies a DOM-style target, while the installed React Native Web Pressable forwards these attributes through `hrefAttrs`.

The two existing Pressable sites now receive web-only `hrefAttrs` containing `_blank` and `noopener noreferrer`. Styling, link names, destinations and native props are preserved. Export verification checks the four anchors before hydration. A new discovered browser suite exercises all four links with and without JavaScript, using trusted Enter/click actions and intercepted destination fixtures. It requires the intended URL in a new page, a null opener, and unchanged source URL, history, focus and scroll after closing the new tab. This protects browser behavior without making the release gate depend on external-service availability.

The old export fails the new attribute assertion; the rebuilt export and eight JS/no-JS destination scenarios pass. Raw red/green logs and initial-HTML observations are retained under `output/external-links-sprint/`. Public destination checks distinguish successful GitHub/Crossref responses from DOI publisher and LinkedIn access restrictions; those restrictions are not treated as broken URLs or repaired by changing content.

## Assertions tied to actual behavior

The modifier suite previously checked only that the portfolio did not move. An isolated handler that canceled a Meta-click satisfied every assertion while suppressing the new page. The suite now awaits actual page creation and the exact local fragment destination for native new-tab/window gestures; macOS Control/context-menu behavior remains separate. The canceled-action fixture changes from pass to fail, while the valid focused modifier scenarios pass in Chromium, Firefox and WebKit.

The Contact surface check previously assumed the first two anchors were Email and LinkedIn. A fixture that inserted an unrelated filled link and made the real Email link transparent still passed the complete old phone scenario. Surface checks now use the existing named Email/LinkedIn locators. The bad fixture fails and all fourteen valid Contact scenarios pass; bounds, hit-target and keyboard assertions remain.

Raw counterexamples, browser/native distinctions and checksums are retained under `output/harness-sprint/`. The ordinary release runner automatically discovers the new external-link suite, bringing the browser gate to five suites. The complete integrated Node 24/Vercel results are recorded on [draft PR #18](https://github.com/jtabalon/jtabalon-portfolio/pull/18). Production publication and the previously disclosed performance, advisory and physical-device limits remain unchanged.
