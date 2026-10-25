# Delivery-contract verification — 23 October 2026

This four-agent follow-up began at 17:08:06 UTC from `38d27ff`. It strengthens the existing #11–#13 verification entry points without changing the public application, content, assets, contact destinations or canonical policy.

## Export failures that previously passed

Isolated copies of the actual export demonstrated these false passes; the shared `dist` was never corrupted. Each bad case exited 0 before the verifier change and exits 1 afterward:

- Homepage robots directives containing `noindex` or `none`, including a duplicate uppercase/single-quoted tag.
- An error directive containing only `noindex-invalid`, which previously matched a word-boundary regex.
- An extra stale HTML route, even when copied from a noindex error document.
- A recovery alias that drifted from the normalized hosting fallback.

The verifier now reads quoted attributes case-insensitively with real attribute boundaries, examines every homepage robots tag, parses directive tokens, requires the current three-page HTML/HTM inventory, and checks fallback/alias equality. The HTTP recovery suite also requires an actual `noindex` token. Valid exported HTML still passes; an unrelated lookalike token remains accepted, and valid uppercase/single-quoted error directives pass. The unchanged preparation step recreates a missing fallback byte-for-byte and fails if its source is absent.

The negative fixtures and before/after subprocess results are local under `output/export-robustness/`. They are not published files or a competing release entry point. This is a bounded discovery-contract check, not a general artifact security assessment or a new source-map policy. An intentional future public route must update the route contract and related discovery checks together.

## Asset loading and failure coverage

Five independent probes cover all-font 404, malformed successful font responses, delayed fonts, portrait abort and portrait 404. Reading and both email links remain usable without application exceptions. Broken images retain their alternative text and reserved dimensions; this is expected native fallback, not successful image decoding.

The permanent asset suite grows from four to six scenarios. One failure scenario exercises two aborted fonts, two HTTP 404 fonts and one malformed response. The new pending-font scenario proves usability while all five responses are held, repeats it after 12.5 seconds, confirms `requests:5`, `status:loading`, `released:false`, and only then releases the responses. The new missing-portrait/no-JavaScript case checks actual interception, exact alternative text, zero natural width, reserved 148×148 layout and both email actions. Existing successful-image cases still require decoding. All six focused cases pass. The extra scenarios add one observer-timeout wait to the existing suite rather than three equivalent failure waits.

Raw probes, fault counters and the final focused log are under `output/third-sprint-assets/`. They use an ephemeral local server and contain no protected-preview credentials.

## Interaction review and release boundary

Trusted modified-key and middle-click probes were compared with ordinary native anchors in Chromium and Firefox. Platform-specific Control/Enter behavior matched the native baseline. Twelve rapid competing-fragment attempts per engine, with live motion-preference changes, retained final Contact focus, next-Tab behavior, temporary-tabindex cleanup and no application exceptions. No product defect was established, so navigation code and tests are unchanged. Raw observations, awaited popup evidence and checksums are under `output/interaction-sprint/navigation/`.

Independent review found no blocking issue in the verifier, recovery and asset changes. Focused valid-export, recovery and asset checks pass; the existing full release gate verifies the integrated revision locally and on Vercel. Final gate status is recorded on [draft PR #18](https://github.com/jtabalon/jtabalon-portfolio/pull/18). Production-dependent acceptance and the prior performance, advisory and physical-device limits remain unchanged.
