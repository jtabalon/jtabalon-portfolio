# Zoom, navigation and artifact-path verification — 24 October 2026

This continues [draft PR #18](https://github.com/jtabalon/jtabalon-portfolio/pull/18) from `df58408b81fa2d78c5a4d029ad7cfbb60ed6c3e8`, within the existing #10/#13 navigation and release-verification requirements. The expanded team retained one coordinator and three delegated workers. The coordinator dispatched checks serially in the single personal_site verification slot.

## Genuine desktop Chrome zoom

The coordinator used Chrome's native page-zoom controls on a dedicated local QA hostname, with the browser window held fixed. The user authorized temporary 200%/400% changes. The observed viewport and device-pixel-ratio changes were:

| Native page zoom | CSS viewport | Device pixel ratio |
| --- | --- | --- |
| 100% baseline | 1488 × 981 | 2 |
| 200% | 744 × 490 | 4 |
| 400% | 372 × 245 | 8 |

These are native browser-zoom observations, separate from text-doubling and headless viewport simulations. Actual text-fragment measurements found no horizontal clipping across 67 fragments at 200% and 111 at 400%; checked link bounds also fit, and both Email me actions remained available. Contact activation followed by Tab reached its visible Email me action at both zoom levels.

The browser was desktop Chrome on macOS. Its exact version was not captured because the browser-control policy blocked the internal version page; no workaround was used. The native zoom setting was restored to 100%, with the original 1488 × 981 viewport and ratio 2 confirmed in `native-zoom/restored.json`.

## Short-viewport focus defect and correction

At 400%, Back to top focused the Hero's H1, but scrolling the section to its beginning left that heading at y=210–258 in a 245-pixel viewport. Its six-pixel focus-outline inset extended below the visible area. The portrait above the heading made section alignment insufficient even though the page had no horizontal overflow.

Section navigation now retains its existing section-start context when the destination and focus outline fit. Otherwise it reveals the focused destination, centering it when its height and outline can fit and using the start for an oversized destination. Temporary focusability and next-Tab behavior remain in the same utility.

In the native 400% retest, the H1 moved to y=98.625–146.625 with its full outline visible. Work, About, Contact, the Career Snapshot publication link and Back to top each produced a fully visible focused heading and the expected next control: the paper link for Published Work, Contact's Email me after About/Contact, and the Hero's Email me after Back to top. At 200%, the original H1 position y=210–258 already fit and remained unchanged.

The permanent navigation suite also adds 372 × 245 and 320 × 256 viewport regressions and requires the entire heading and keyboard focus outline to fit. Those automated cases reproduce the short reading area; the native zoom results above establish the genuine zoom observation.

Page-only captures illustrate the focused heading at the same 400% viewport:

![Before: the focused heading extends below the viewport](evidence/2026-10-24-zoom-before.png)

![After: the heading and focus outline fit](evidence/2026-10-24-zoom-after.png)

## Screenshot artifact containment

The old Contact guard rejected a direct `public/screens` path but accepted symlink aliases pointing into fake `public` and `dist` roots. A harmless sentinel was then written through each alias inside that isolated fixture. The actual repository's public images and exported files were not used as mutation targets.

Contact and recovery screenshot setup now share `prepareArtifactDirectory`. It retains lexical containment checks and resolves physical paths through the nearest existing ancestor before creating new directories, covering aliases with not-yet-created descendants. Nine contract cases passed: direct published roots, aliases into either root, a path lexically under public that points outward, valid private paths/aliases, a distinct `public-output` directory and an unset artifact directory. Two additional case-variant paths on the current case-insensitive filesystem resolved to the published roots and were rejected. The verified contract is path containment at preparation time.

The first complete local gate containing the zoom-focus and artifact changes passed on Node 24.22.1/Bun 1.3.10, including all six discovered suites. It wrote 22 screenshots to the private artifact directory: fourteen Contact and eight recovery captures. That pass predates the section-history integration below and must not be presented as its final gate.

## Separate section-history reproduction

The initial zoom pass did not establish browser-history behavior. A separate headless probe compared actual pointer/keyboard link activation with native hash changes. Under the old link behavior, Work → About → Contact retained history length 2 and Back returned to `about:blank`, rather than About. The native-hash control grew history length 2 → 3 → 4 → 5 and Back returned to About. Both ordinary input modes demonstrated the same lost-entry behavior.

Ordinary section activation now follows its declared native root-fragment URL while preventing Expo's same-route history replacement. The committed route remains the single focus owner; repeated fragments retain guarded focus scheduling. Modified mouse and keyboard gestures retain their native handling. The matched probe now grows history and returns to About in both input modes, matching its native control. Permanent regressions exercise actual Back/Forward, cleared landing queries, destination focus and next Tab.

The final native Chrome 400% retest also passed Back to About, Forward to Contact and next Tab to Contact's visible Email me. Activating Contact from a query-bearing Contact fragment cleared the query as its declared root href requires. Both 200% and 400% focus checks passed on the combined candidate; Chrome was again restored to the original 100% viewport/ratio and the task tab was closed.

## One-time arrival and integrated verification

Native history restoration can remount the homepage. A frame probe caught the Hero entrance replaying on Back to top after that integration. Arrival eligibility is now captured once per mount from a document-lifetime flag written after a committed web mount. Static rendering and first hydration retain the initial arrival; later remounts stay settled. The final frame probe still observes the initial fade, followed by opacity 1 throughout Contact, Back to top and repeated top activation. The permanent regression also requires zero translation during restoration.

The complete `bun --no-env-file run verify:release` passes on Node 24.22.1/Bun 1.3.10: all six suites, including fifteen navigation groups. The updated navigation suite separately passes all fifteen groups in Playwright Firefox and WebKit. These checks include full heading/outline visibility, real click/Enter history, landing-query semantics, one-time motion, no JavaScript and modifier-created destination pages. The gate's fourteen Contact and eight recovery screenshots were written to a private directory through the shared guard.

The [focused evidence](evidence/2026-10-24-zoom-navigation-artifacts.json) records source/log hashes, native zoom metrics, restoration, red/green history and motion probes, filesystem controls and page-only screenshot hashes. Independent team review reported no unresolved Standards or Spec findings in the bounded changes. The latest same-revision hosted preview outcome is recorded on PR #18; these local/native results alone do not establish production publication.

Raw records, fixtures, controls and screenshots remain under `output/continued-review-2026-10-24/`, outside the public export. The [fresh advisory follow-up](2026-10-24-advisory-followup.md) separately records four current dependency reports and their owner-range limits. Production publication and production-dependent issue closure remain pending. These checks do not cover physical-device or screen-reader sessions; #7's owner decisions and #16's remote-device pilot remain open.
