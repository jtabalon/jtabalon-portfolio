# Combined asset delivery and preview verification — 23 October 2026

This repeat for [#11](https://github.com/jtabalon/jtabalon-portfolio/issues/11) measures the combined application at `6f0c3658d7ca7fe9a30d94f46e3916d76fc033ec`, including responsive assets, the platform-specific portrait, dependency maintenance, landmarks/navigation, error recovery and the WebKit stylesheet-startup correction. The baseline is `dcf0a72b1955903613ab8e2f91cf86537be0ba5a` (Contact PR #17). [Versioned evidence](evidence/2026-10-23-combined-asset-verification.json) records the exact samples and public-asset checks. Earlier asset and portrait notes remain records of their earlier slices.

## Coordinated local comparison

The baseline export was saved before source/dependency changes and retains bundle `entry-e39deea479043a9f756d0523260415e9.js`. The candidate's tracked tree exactly matched `6f0c365` before export; its bundle is `entry-606695d801b1a13a67addfa00501b1cb.js`. Both used their pinned lockfiles, Bun **1.3.10**, Node **25.4.0**, Lighthouse **13.4.1** and system Chrome **156.0.8078.48**.

Both ran sequentially at the same localhost origin using the same HTTP/1.1 server, gzip for HTML/CSS/JavaScript/TTF, valid content types and `Cache-Control: no-store`; WebP/WOFF2 retained their compressed representation. Every Lighthouse sample used a fresh Chrome process and default storage reset. Mobile used simulated 412×823/1.75×, 150 ms RTT, 1,638.4 Kbps and 4× CPU; desktop used 1350×940/1×, 40 ms RTT, 10,240 Kbps and 1× CPU. Cold refers to browser cache/storage, not an idle or freshly booted machine.

Selected baseline samples began **15:57:20–15:57:51 UTC** and candidate samples **15:59:26–15:59:57 UTC**, after other project agents paused browsers, builds and inference. Preliminary `final-baseline-*` timing samples overlapped independent browser testing and are excluded from the tables. The shared Mac still had active swap and other applications; these are local lab observations, not field Core Web Vitals, a controlled hardware benchmark or a production performance promise.

| Mobile measurement | Before 1 | Before 2 | After 1 | After 2 |
| --- | ---: | ---: | ---: | ---: |
| First contentful paint | 0.816 s | 0.804 s | 0.755 s | 0.762 s |
| Largest contentful paint | 4.641 s | 4.629 s | 1.730 s | 1.737 s |
| Total blocking time | 44.5 ms | 41 ms | 41 ms | 40 ms |
| Cumulative layout shift | 0 | 0 | 0 | 0 |
| Initial transfer | 2,502,098 B | 2,502,098 B | 497,739 B | 497,739 B |

| Desktop measurement | Before 1 | Before 2 | After 1 | After 2 |
| --- | ---: | ---: | ---: | ---: |
| First contentful paint | 0.267 s | 0.250 s | 0.204 s | 0.208 s |
| Largest contentful paint | 0.907 s | 0.890 s | 0.384 s | 0.388 s |
| Total blocking time | 0 ms | 0 ms | 0 ms | 0 ms |
| Cumulative layout shift | 0 | 0 | 0 | 0 |
| Initial transfer | 2,502,098 B | 2,502,098 B | 497,739 B | 497,739 B |

| Initial transfer including response headers | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| Displayed portrait | 1,555,861 B | 20,685 B | 98.7% |
| Five fonts | 604,145 B | 141,309 B | 76.6% |
| JavaScript | 314,503 B | 308,058 B | 2.0% |
| Whole page | 2,502,098 B | 497,739 B | 80.1% |

Both mobile and 1× desktop Lighthouse samples select the 320-pixel portrait. The mobile LCP element remains Published Work; desktop identifies the publication title. The measurements assess the combined change, rather than assigning all improvement to the portrait. Blocking-time differences are small; no material change is inferred from them. Every selected sample retains zero layout shift.

## Final-source browser checks

Fresh Playwright **1.58.2** / system Chrome contexts at 320×844/1×, 390×844/3×, 768×1000/2×, 1440×1000/1× and 1440×1000/3× retain exactly matching portrait, name-heading, Published Work-heading and Hero email bounds against the saved baseline. Normal image/font requests succeed, with no console warnings, application errors or horizontal overflow. Mobile/desktop high-density screenshots were visually inspected.

Separate 390×844/3× JavaScript-disabled, font-aborted and font-404 contexts pass. They retain the decoded portrait, positioning, name heading and both email links. Both failure cases abort/fail all five fonts and wait 12.5 seconds beyond settled requests, covering Expo's 12-second observer. Type, lint, export, all focused asset checks, the 14 Contact cases and missing-page checks pass.

The broader shared command at `6f0c365` caught an intermittent About next-Tab failure in the 1440-pixel navigation group. This note does **not** mark that revision's complete release gate green. The duplicate-focus follow-up and its final integration checks belong to #10 and the [release verification record](2026-10-23-release-verification.md). The pinned asset/performance observations above remain evidence for their stated revision.

## Hosted asset verification

The protected Vercel preview identified by the release owner as `6f0c365` was checked through its existing authenticated session. No protection setting changed. Credentials, authenticated URLs, browser state and authentication screenshots are excluded from this note and its evidence.

- All **12** checked public resources—three WebPs, five WOFF2 fonts, original Public identity PNG, Social preview PNG, robots and sitemap—return HTTP 200, valid MIME types and exact SHA-256 equality with their committed files. Browser decoding verifies the WebPs' actual 320×320, 640×640 and 960×960 dimensions.
- Five fresh contexts pass: 390×844/3×, 1440×1000/3×, JavaScript disabled, all fonts aborted and all fonts returning 404. Both email links remain trial-clickable. The 640-pixel portrait is selected on mobile and the 960-pixel resource on desktop; their rendered sizes remain 148×148 and 280×330. Font-failure cases wait 12.5 seconds and actually fail all five faces. No application exception or page overflow is observed.
- The deployed CSS hash matches `web-5dce62c597dc6c0aa9503084c19ab5d4.css`. Its deployment-built JavaScript is `entry-cc93e4a9b8a7fe3e7b1a1d396b3d74f3.js`, distinct from the local export. HTML, CSS and JavaScript use CDN **Brotli**, so the local gzip timings and byte values are not transferred to this deployment build.

Separate fresh normal contexts captured document-inclusive Navigation/Resource Timing totals:

| Hosted observation | Browser-reported transfer | Encoded response bodies | Selected portrait |
| --- | ---: | ---: | --- |
| 390×844 / 3× | 529,568 B | 526,568 B | 640 pixels |
| 1440×1000 / 3× | 581,574 B | 578,574 B | 960 pixels |

These hosted observations include the navigation document and same-origin resources. They use a different network, deployment build, compression and pixel density from Lighthouse; they are delivery checks, not a matched before/after performance result or field measurement. The earlier resource-only subtotals excluded the document and are not used as whole-page totals here.

Raw reports/traces, functional facts and public-page screenshots remain local under `output/playwright/hour-assets/`. Only the credential-free curated evidence is versioned. The checked deployment is a preview; production verification remains required before issue closure.
