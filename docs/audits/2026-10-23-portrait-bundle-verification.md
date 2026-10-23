# Portrait bundle verification — 23 October 2026

Follow-up within [issue #11](https://github.com/jtabalon/jtabalon-portfolio/issues/11), after the responsive-image/font change. The integrated baseline is portfolio `033083b`; the component split is `8f0e2df69571a8879d247b3faa2941e76933176f`. This is a separate artifact-size comparison and does not replace or extend the earlier Lighthouse timing measurements in [the asset verification record](2026-10-23-asset-verification.md).

The homepage previously imported `expo-image` for its native fallback even though the web branch renders a plain `img`. Metro included that import's web implementation. `PortraitImage` now has separate `.web.tsx` and default `.tsx` modules, so the web graph can omit it. The native module preserves the existing Expo image, source path, alternative label, fit and dimensions. No dependency, framework, public asset, content or hosting setting was changed.

## Measured artifact sizes

Normal production exports used the same installed dependencies, Bun 1.3.10 and Node 25.4.0. Before: `entry-0d42016787390f5da1ba1a8e9051562c.js`. After: `entry-60f3e1e953eb871df42cbd1907108a17.js`.

The exact exported JavaScript files were compressed locally using Node's zlib **1.2.12** and Brotli **1.2.0**, with gzip level 6 and Brotli quality 11/text mode plus the input-size hint, respectively. These sizes exclude HTTP headers and describe those encoding settings, rather than asserting a particular CDN compression policy.

| JavaScript representation | Before | After | Saved |
| --- | ---: | ---: | ---: |
| Uncompressed | 1,144,704 B | 1,109,583 B | 35,121 B (3.07%) |
| gzip, level 6 | 312,196 B | 300,840 B | 11,356 B (3.64%) |
| Brotli, quality 11 | 247,148 B | 238,729 B | 8,419 B (3.41%) |

Separate diagnostic source-map exports were collected from the pinned baseline and candidate with `expo export --platform web --source-maps external --max-workers 2`, each in a private output directory. The baseline map includes **27 `expo-image` source files**. The candidate includes **zero**, with only `src/components/portrait-image.web.tsx` for the portrait. The candidate diagnostic bundle has its own map-bearing hash (`7643304c072f8a2962f54a55756cc168`); compression numbers above come from the normal production exports, not the diagnostic output. Source maps are not copied into `dist` or committed.

## Behavior checks

- The portrait's complete exported `img` element is byte-for-byte identical before and after, including `src`, `srcset`, `sizes`, alternative text, explicit 1024×1024 dimensions and classes. The CSS bundle hash remains `web-4b813578de910f73376fe3fc7ba4245b.css`.
- Fresh system Chrome 156.0.8078.48 contexts at 320×844/1×, 390×844/3×, 768×1000/2×, 1440×1000/1× and 1440×1000/3× retain exactly matching portrait, name-heading, Published Work-heading and Hero email bounds. The responsive selection, normal font loading, decoded image and absence of page overflow/console warnings remain intact.
- TypeScript, Expo lint, normal export and export verification pass. Browser preparation and all four shared browser suites pass: assets (high-density mobile/desktop, JavaScript disabled and failed fonts after the observer timeout), Contact (14 viewport/text-size cases), errors (HTTP/aliases and keyboard recovery), and section navigation (keyboard, landmarks, fragments, reduced motion and no JavaScript).
- Review of the platform files confirms the native fallback's source and properties are unchanged. A native application build or device run was not performed.

The saving is small compared with the initial portrait/font improvement, but removes an unused web dependency path through a bounded component extraction. No new FCP/LCP/TBT/CLS result, field performance claim or framework-migration recommendation follows from this byte comparison. Integrated/deployed checks remain the release owner's responsibility.

Local comparison facts, screenshots, source graphs, compression output and diagnostic exports are under `output/playwright/hour-assets/portrait-*` in the asset worktree, outside the application export and commit.
