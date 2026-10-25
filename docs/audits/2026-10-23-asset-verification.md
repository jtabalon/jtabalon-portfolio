# Public asset verification — 23 October 2026

This is an independent repeat for [issue #11](https://github.com/jtabalon/jtabalon-portfolio/issues/11), using the existing optimization from `e2120c6` rather than generating a second implementation. The baseline is `dcf0a72b1955903613ab8e2f91cf86537be0ba5a` (the Contact fix from PR #17); the asset candidate is `e0126d07a4bede4acc27c46e8ee840e3549e6000`. The [12 October record](2026-10-12-asset-delivery.md) describes the implementation and regeneration process; its measurements are historical and are not substituted for this repeat.

The candidate retains the existing framework, copy, portrait composition, typography, original Public identity PNG, and Social preview. Responsive WebP resources are 20,508 B at 320×320, 54,844 B at 640×640, and 106,850 B at 960×960. The five WOFF2 subsets total 140,424 B before response headers. Normal exports use these committed resources without requiring Python or image encoders.

## Matched cold-load conditions

Both exports used the same lockfile and installed dependencies, Bun **1.3.10**, Node **25.4.0**, Lighthouse **13.4.1**, and system Google Chrome **156.0.8078.48**. The baseline was exported and copied before applying the optimization. Its JavaScript bundle is `entry-e39deea479043a9f756d0523260415e9.js`; the candidate bundle is `entry-9b7bead7b5359f95f33cb5e5f48e87c9.js`.

Both were served sequentially at `http://127.0.0.1:4172/` by the same temporary HTTP/1.1 server. HTML, CSS, JavaScript and TTF responses used gzip; WebP and WOFF2 retained their compressed representation. Responses used valid MIME types and `Cache-Control: no-store`. Lighthouse ran sequentially with a fresh Chrome process and default storage reset for each run. Other project agents were active on the shared development machine, so these are laboratory observations with visible timing variability, not field Core Web Vitals or a production performance claim.

Mobile used Lighthouse's default simulated configuration: 412×823 CSS pixels, 1.75× pixel density, 150 ms RTT, 1,638.4 Kbps throughput, and 4× CPU slowdown. Desktop used its desktop preset: 1350×940, 1× density, 40 ms RTT, 10,240 Kbps throughput, and 1× CPU. Performance-only collection used the same options for each baseline/candidate pair.

| Mobile measurement | Before 1 | Before 2 | After 1 | After 2 |
| --- | ---: | ---: | ---: | ---: |
| First contentful paint | 0.799 s | 0.812 s | 0.757 s | 0.754 s |
| Largest contentful paint | 7.150 s | 4.637 s | 3.719 s | 1.729 s |
| Total blocking time | 51 ms | 46.5 ms | 56.5 ms | 39.5 ms |
| Cumulative layout shift | 0 | 0 | 0 | 0 |
| Initial transfer | 2,502,098 B | 2,502,098 B | 501,207 B | 501,207 B |

| Desktop measurement | Before 1 | Before 2 | After 1 | After 2 |
| --- | ---: | ---: | ---: | ---: |
| First contentful paint | 0.247 s | 0.242 s | 0.219 s | 0.204 s |
| Largest contentful paint | 0.887 s | 1.289 s | 0.399 s | 0.384 s |
| Total blocking time | 0 ms | 0 ms | 0 ms | 0 ms |
| Cumulative layout shift | 0 | 0 | 0 | 0 |
| Initial transfer | 2,502,098 B | 2,502,098 B | 501,207 B | 501,207 B |

| Initial transfer including response headers | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| Displayed portrait | 1,555,861 B | 20,685 B | 98.7% |
| Five font resources | 604,145 B | 141,309 B | 76.6% |
| Whole page | 2,502,098 B | 501,207 B | 80.0% |

Both mobile and the 1× desktop Lighthouse loads selected the 320-pixel portrait. The mobile LCP element remained the Published Work heading. These observations measure the combined asset change; they do not establish that the portrait alone caused the rendering improvement. Blocking-time variation is small and changes direction between runs; neither a stable improvement nor a regression is established by it. Layout shift remained zero in every run.

## Browser and source verification

- `bun run check`, `bun run build:web`, the updated export verifier, and all 14 existing Contact browser scenarios pass. The Contact scenarios include 320, 390, 768, 820, 912, 1024 and 1440-pixel widths at normal and doubled text sizes.
- Playwright **1.58.2** with the same system Chrome verified fresh contexts at 320×844/1×, 390×844/3×, 768×1000/2×, 1440×1000/1× and 1440×1000/3×. Portrait, name heading, Published Work heading and Hero email-action bounds match the baseline exactly in every pair. Normal loads report no console warnings or errors and no horizontal page overflow.
- The selected resources change with density: 320 pixels on the 1× mobile/desktop samples, 640 pixels at 390/3× and 768/2×, and 960 pixels at 1440/3×. Image/font responses return HTTP 200 with valid content types; export verification checks actual image dimensions, WOFF2 signatures, font preloads and the initial-HTML `src`, `srcset`, `sizes`, alternative text and explicit image dimensions. Mobile and desktop high-density screenshots were visually inspected; the portrait remains clear and retains its crop.
- At 390×844/3×, separate JavaScript-disabled, font-aborted, and font-404 contexts retained the portrait, positioning, visible name heading and two email links. Font-failure checks waited for settled requests plus 12.5 seconds, beyond Expo's 12-second font-observer timeout. All five font faces reported `error` in each failure case while readable fallback text and the Hero email action remained usable.
- With fontTools **4.65.0** and Brotli **1.2.0**, every character in `public-site-content.ts` that exists in each original TTF remains in its WOFF2 subset: 73 glyphs per face, including middle dot, em dash and curly apostrophe. Required glyph outlines, advance widths, units per em and line metrics match the originals exactly. Both font families retain their original license/copyright notices. Native font-loading sources and its readiness gate remain unchanged by source inspection; native builds were not run.
- The React changes preserve hook order, static rendering and platform-specific loading. Web content deliberately does not wait for network-font readiness; normal initial HTML contains the font faces and resource hints.

## Remaining measured costs and limits

The candidate still transfers 311,691 B of JavaScript including response headers, the largest remaining resource category. Lighthouse estimates about 139 KB of that bundle is unused during its initial-load observation, which does not prove it can all be removed safely. Candidate trace collection reports approximately 0.21–0.29 s of JavaScript boot-up work and a small render-blocking stylesheet (3,566 transferred bytes; estimated 140 ms opportunity). Its LCP traces report different heading render delays, consistent with the observed run-to-run variation. Font-display checks pass, and no additional remote origin is on the critical request chain.

The asset change improves both repeated mobile LCP observations and desktop rendering while preserving the measured stable layout. Further runtime or scheduling work should be measured separately; no framework migration is authorized by #11. These timings should not be compared directly with the September live-site audit.

Raw reports, saved Lighthouse traces/devtools logs (except the first baseline mobile run), browser facts, scripts and screenshots are local artifacts under `output/playwright/hour-assets/` in the asset worktree. They are intentionally excluded from the application export and commit. The implementation has not been deployed by this lane. Deployed asset/performance verification and integrated browser checks remain required before closing #11; physical-device, Safari/Firefox and field measurements are outside this local repeat.
