# Hosted missing-page verification — 23 October 2026

The immutable [Vercel preview for candidate `6f0c365`](https://jtabalon-portfolio-vercel-a4ow05e1u-jtabalons-projects.vercel.app/) passes the hosted portion of [issue #12](https://github.com/jtabalon/jtabalon-portfolio/issues/12) covered below. This is specific to that preview revision; production is unchanged, and a subsequent homepage-focus correction is outside this pass.

The check used Playwright 1.58.2, Chromium 145.0.7632.6, and the existing authenticated browser session for this verified preview origin. HTTP requests used the browser context's cookie jar. No authentication header was applied globally; no cookie, token, or browser state was copied into source or published evidence. The [sanitized result](evidence/2026-10-23-hosted-missing-page-verification.json) records response status, public resource metadata, and browser outcomes.

## Observed hosted behavior

- The homepage returns HTTP 200 with its existing Search identity in initial HTML.
- An arbitrary missing path, a nested missing path plus query, `/admin`, `/blog`, `/sign-in`, and `/_sitemap` each return a useful HTML response with genuine HTTP 404. Every response contains the missing-page title, explicit noindex metadata, and a real homepage anchor. These are Vercel responses, rather than the local static-server shim.
- `/+not-found` and `/404` return HTTP 200 with noindex. Their `.html` aliases first receive HTTP 308 to their clean URLs and then return the same non-indexable error experience. The implementation does not rely on omission from the sitemap to prevent indexing.
- Robots, sitemap, the unchanged Public identity portrait, and the Social preview return HTTP 200 with appropriate content types.
- All three responsive portraits return HTTP 200 as `image/webp`, with valid RIFF/WebP signatures. The 320-, 640-, and 960-pixel resources contain 20,508, 54,844, and 106,850 bytes respectively.
- All five web fonts return HTTP 200 as `font/woff2`, with WOFF2 signatures and their expected resource sizes.
- Four browser scenarios pass at 390 and 1440 CSS pixels with JavaScript enabled and disabled. Each starts at an actual missing URL, observes HTTP 404, exposes the main landmark and level-one heading, reaches “Return to homepage” with ordinary Tab, activates it with Enter, and arrives at the real homepage with usable Email me links. No application exception is captured. The mobile missing-page screenshot was visually inspected, including its visible focus ring. No email client or professional-profile destination was activated.

A separate unauthenticated HTTP context checked the public apex host. A nested missing path with three query parameters, including a percent-encoded space, receives HTTP 308 to the identical path and query at the www Canonical site. That check establishes redirect preservation; it does not claim the new error page has been published to production.

This read-only verification changed no deployment, hosting setting, application content, issue, or PR. Browser contexts were closed afterward. Issue closure still requires the relevant final candidate and production release verification; homepage navigation/focus behavior is verified separately.
