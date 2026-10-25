# Production verification checklist

Use this checklist after publishing the reviewed revision to the Canonical site. It collects the existing production acceptance for [#8–#14](https://github.com/jtabalon/jtabalon-portfolio/issues/8); it does not authorize publication or replace the local release gate. The [reviewer handoff](audits/2026-10-23-sprint-handoff.md) maps each issue to its implementation evidence and remaining acceptance.

## Identify the published revision

- Record the reviewed commit SHA, immutable deployment ID/URL, and the revision actually serving `https://www.josephtabalonjr.com/`. Confirm the canonical domain points to the intended deployment. A READY preview and its successful build do not establish which revision is in production.
- Use a checkout and static export of that same revision for comparisons. Run `bun install --frozen-lockfile` and `bun --no-env-file run verify:release` on the documented Node/Bun runtime before publication; keep its result with the deployment evidence. The release entry and nested Bun processes disable automatic `.env` loading; Expo's loader is disabled separately. Explicit shell/hosting environment remains available. The shared command runs the browser suites against its local export.
- Record the dates, browser/OS, viewport, JavaScript setting and any text-size or preference emulation used below. Preserve the distinction between local, hosted-preview and production results. Keep private preview credentials and browser state outside committed evidence and the public export.

## Verify the public responses and recovery

The shared browser runner always tests its own local `dist` and ignores hosted-target overrides. With `dist` built from the published revision, run the recovery suite directly to inspect the public Canonical site:

```bash
SITE_BASE_URL=https://www.josephtabalonjr.com/ \
SITE_APEX_URL=https://josephtabalonjr.com/ \
bun --no-env-file tests/errors.mjs
```

This command uses the local export to discover error-document aliases and opens the deployed site in Chromium. It checks homepage success; genuine HTTP 404 for arbitrary/nested missing paths with a query, `/admin`, `/blog`, `/sign-in` and `/_sitemap`; error-document titles, noindex directives and homepage links; direct error aliases; apex-to-www path/query preservation; and eight JavaScript-enabled/disabled keyboard recoveries. It requires public access to the supplied origins. Protected-preview checks use their separately recorded authenticated access; a protection response is not an application recovery result. The [hosted recovery record](audits/2026-10-23-hosted-missing-page-verification.md) explains the hosting boundary.

- Confirm the homepage returns HTTP 200 and its initial HTML contains the Search identity, canonical URL, Social preview metadata and Public identity for `https://www.josephtabalonjr.com/`. It must remain indexable independently of any preview-wide response headers.
- Confirm `https://josephtabalonjr.com/` permanently redirects to the Canonical site with status `308`. Check a missing nested path with a query as well as the homepage; the requested path and query must survive the redirect.
- Confirm error documents remain outside indexing even when their direct aliases return HTTP 200. Confirm the homepage has no error noindex directive after keyboard recovery. Sitemap omission alone does not establish this behavior.

## Verify reading, navigation and contact

- Inspect Contact at 320, 390, 768, 820, 912, 1024 and 1440 CSS pixels, including the tablet layout transition. Both its text and controls must fit the card and viewport. Email me remains the prominent filled action, LinkedIn remains a Secondary link, and their destinations stay correct. Retain the Hero email action.
- Check larger-text reflow and state the method used. The local Contact and whole-page text-doubling checks are simulations; do not report them as genuine browser zoom or whole-site accessibility conformance. At narrow widths, Work, About and Contact must remain directly reachable and their text must not be clipped inside the scroll container.
- From the keyboard, activate Work, About, Contact, the Career Snapshot publication link and Back to top. Confirm the visible destination and focus agree, and the next Tab continues from that destination. Check direct fragments, repeated section activation and browser Back/Forward. Preserve visible focus and reduced-motion behavior.
- Open each Published Work link and LinkedIn. Confirm the intended destination opens in its declared isolated tab and returning preserves the portfolio's URL, reading position and focus. Record third-party access restrictions separately from incorrect destinations; a publisher challenge is not evidence that the paper URL is broken.
- With JavaScript disabled, confirm the initial professional content, portrait, section links and both Email me actions remain useful. Confirm readable fallback text and contact access when fonts fail. Record physical-device, screen-reader and browser coverage limits without implying unperformed validation.

## Verify discovery and asset delivery

- Confirm `/robots.txt`, `/sitemap.xml`, `/social-preview.png`, `/joseph-tabalon.png`, all three `/portraits/joseph-tabalon-{320,640,960}.webp` resources and the five `/fonts/*.woff2` resources referenced by the export are publicly available with the expected content types. Compare their hashes with the export from the published revision, following the [asset verification record](audits/2026-10-23-final-asset-verification.md).
- Confirm robots permits discovery and names the canonical sitemap. The sitemap contains only the canonical homepage; Blog, Admin, sign-in, error documents and the diagnostic sitemap must not become additional Indexable pages.
- Inspect portrait selection and decoding at ordinary and high pixel densities, preserved composition/alternative text, readable typography and stable layout. Record deployed resource/performance observations for the published revision. Keep earlier [matched laboratory timings](audits/2026-10-23-combined-asset-verification.md) tied to their measured revision and conditions; they are not new production measurements or field Core Web Vitals.
- Review the [dependency refresh and residual dispositions](audits/2026-10-23-dependency-refresh.md) alongside the published lockfile. If further dependency changes are made, refresh their compatibility, advisory and release evidence rather than carrying old counts forward as current results.

Record the relevant results on the implementation PR/issues. Keep production-dependent acceptance open until the published behavior is verified. This checklist does not complete Joseph's Case study decisions in #7 or the separate remote-device pilot in #16.

## Discovery follow-up

These external-service/account tasks are separate from the #8 maintenance release gate; Search Console administration is outside that issue's scope:

- Validate the homepage with [Google Rich Results Test](https://search.google.com/test/rich-results).
- In Google Search Console, verify ownership, submit `https://www.josephtabalonjr.com/sitemap.xml`, inspect the homepage, and request indexing.
- Refresh the cached Social preview with [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).
