# Public asset delivery — 12 October 2026

Issue [#11](https://github.com/jtabalon/jtabalon-portfolio/issues/11) reduces the homepage's initial delivery while preserving its public presentation. The displayed portrait now offers 320, 640, and 960-pixel WebP copies of the original photograph. The browser selects a copy using the existing 148-pixel mobile and 280-pixel desktop display widths and device pixel density. The 1024-pixel PNG remains unchanged for Public identity; the Social preview remains unchanged.

The web uses WOFF2 subsets of the same Inter 400/500/600 and JetBrains Mono 400/500 fonts. Their family aliases, outlines, and hierarchy remain the same. Native loading retains the original Expo font sources and readiness gate. Web font registration still produces font faces and preloads in initial HTML, with `font-display: swap`; web reading and contact links do not wait for font completion. Sans-serif and monospace fallbacks keep unsupported future characters and failed font requests readable.

## Matched cold-load measurements

The baseline export corresponds to `61328627153d1b8e1bf602dbb425e4d823365046`. Its JavaScript bundle is `entry-38221ace23934e703040de2ce5727653.js`; the candidate bundle is `entry-ada8dd8d07f44dfc050254245ecc1612.js`. Baseline measurements were collected before source edits. Both exports were served on localhost using the same temporary HTTP/1.1 server, gzip for HTML/CSS/JavaScript/TTF, valid image/font MIME types, and `Cache-Control: no-store`. Every Lighthouse run used a new Chrome instance and the default storage reset.

Lighthouse **13.4.1**, Headless Chrome **155.0.0.0**, simulated throttling, and performance-only collection were used sequentially. Mobile used 412×823, device scale factor 1.75, 150 ms RTT, 1,638.4 Kbps throughput, and 4× CPU slowdown. Desktop used the default desktop preset: 1350×940, scale factor 1, 40 ms RTT, 10,240 Kbps throughput, and 1× CPU. The machine was concurrently used for other work; capacity checks reported normal memory pressure and no new swapouts before each run. These are local laboratory results, not field Core Web Vitals or deployed measurements. They are not directly comparable to the September audit's live-site timing.

| Measurement | Mobile before 1 | Mobile before 2 | Mobile after 1 | Mobile after 2 |
| --- | ---: | ---: | ---: | ---: |
| FCP | 0.786 s | 0.785 s | 0.754 s | 0.755 s |
| LCP | 7.107 s | 7.007 s | 3.672 s | 1.730 s |
| Total blocking time | 41.5 ms | 39.5 ms | 39 ms | 40 ms |
| Layout shift | 0 | 0 | 0 | 0 |
| Initial transfer | 2,502,329 B | 2,502,329 B | 501,224 B | 501,224 B |

| Transfer including response headers | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| Displayed mobile portrait | 1,555,861 B | 20,685 B | 98.7% |
| Five fonts combined | 604,145 B | 141,309 B | 76.6% |
| Total initial page | 2,502,329 B | 501,224 B | 80.0% |

Both mobile runs selected the 320-pixel portrait. LCP remained the Published Work heading; the improvement is measured for the combined delivery change and is not attributed entirely to the portrait. After-run LCP varies materially, so both observations are recorded. The traces report different heading render delays; a single fast result should not be treated as a promised visitor experience.

Desktop FCP changed from **0.572 s to 0.203 s**, LCP from **1.279 s to 0.383 s**, and initial transfer from **2,502,329 B to 501,224 B**. Blocking time and layout shift remained zero. No rendering regression was observed in these runs. JavaScript remains the largest part of the reduced initial delivery; this issue retains the existing framework.

Raw Lighthouse JSON/HTML, browser check logs, and screenshots are local review artifacts under `output/playwright/assets-*` in the implementation worktree. They are not committed to the repository.

## Verification

- TypeScript, Expo lint, static export, and the updated export verifier pass. Initial HTML contains the portrait's `src`, `srcset`, `sizes`, alternative text, and explicit dimensions. It contains five WOFF2 font-face/preload pairs and no TTF references. Existing canonical, public identity, Social preview, discovery, and redirect assertions still pass.
- Every current non-ASCII character in the public source—middle dot, em dash, and curly apostrophe—is covered by every generated font. The subset also retains Latin, combining marks, general punctuation, currency, and available arrows. The original SIL Open Font License and copyright notices are copied alongside each font family.
- At 390×844 and 3× pixel density, fresh contexts with JavaScript disabled, all five font requests aborted, and all five font requests returning HTTP 404 retained the positioning, both email links, and the portrait. Failure checks waited for font requests to settle plus 12.5 seconds before inspecting the hydrated page. Failed faces reported `error`; content remained visible with system fallback text. The 640-pixel portrait was selected at this density.
- Visual comparisons and resource checks cover 320/390/768/1440-pixel widths and 1×/2×/3× density. Image and font resources return valid content types and HTTP 200 under normal conditions. Normal-font heading, email-action, and portrait boundaries exactly match the baseline in all five matched viewport/density pairs; normal loads produce no console warnings or errors. Portrait composition and typography are visually inspected on mobile and at desktop high density.

Deployed asset/performance verification remains required before closing #11. This local change has not been pushed or deployed. Native font loading is preserved by source inspection; a native application build was not part of this web delivery check. Cross-browser review is separate from these Chrome measurements.

## Regenerating assets

Generated resources are committed, so normal Bun/export builds do not need image encoders or Python packages. For deliberate regeneration, install `cwebp` and Python's [`fonttools[woff]`](https://fonttools.readthedocs.io/en/stable/subset/), then run:

```sh
python3 -m venv /tmp/portfolio-web-assets
/tmp/portfolio-web-assets/bin/python -m pip install 'fonttools[woff]==4.65.0' 'Brotli==1.2.0'
/tmp/portfolio-web-assets/bin/python scripts/prepare-web-assets.py
bun run build:web
```

This generation used Python **3.10.4**, cwebp **1.6.0** (libsharpyuv **0.4.2**), fontTools **4.65.0**, Brotli **1.2.0**, WebP quality **88**, and compression method **6**. The script derives portraits from `public/joseph-tabalon.png` and font subsets from the installed, lockfile-selected Expo font packages (`@expo-google-fonts/inter` **0.4.2**, `@expo-google-fonts/jetbrains-mono` **0.4.1**).

Subset coverage is `U+0000–00FF`, `U+0300–036F`, `U+2000–206F`, `U+20A0–20CF`, and `U+2190–21FF`, plus `U+0131`, `U+0152–0153`, `U+02BB–02BC`, `U+02C6`, `U+02DA`, `U+02DC`, `U+2122`, `U+2212`, `U+2215`, `U+FEFF`, `U+FFFD`, and every character in current `.ts`/`.tsx` source. Only glyphs available in each original font can be retained. Regenerate and recheck if portrait sources, font packages, or required character coverage change. Characters unavailable in the source fonts continue to use system fallback.
