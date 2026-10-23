import assert from 'node:assert/strict';
import { mkdir, readdir } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { chromium, firefox, webkit } from 'playwright';

import { serveExport } from './helpers/serve-export.mjs';

const exportRoot = resolve('dist');
const browserName = process.env.ERROR_BROWSER ?? 'chromium';
const browserType = { chromium, firefox, webkit }[browserName];
assert(browserType, 'ERROR_BROWSER must be chromium, firefox, or webkit');
const artifactDirectory = process.env.BROWSER_ARTIFACT_DIR;
if (artifactDirectory) {
  for (const directory of ['dist', 'public']) {
    const forbidden = resolve(directory);
    assert(resolve(artifactDirectory) !== forbidden && !resolve(artifactDirectory).startsWith(forbidden + sep),
      'Screenshots must stay outside dist/public');
  }
  await mkdir(artifactDirectory, { recursive: true });
}

// The local server exercises exported documents and links. Only a hosted run
// establishes that the deployment returns these documents with the right status.
const server = process.env.SITE_BASE_URL ? undefined : serveExport({ notFound: '404.html', cleanUrls: true });
const baseUrl = new URL(process.env.SITE_BASE_URL ?? server.url.href);
assert.equal(baseUrl.pathname, '/', 'SITE_BASE_URL must identify the site origin');

function assertMissingPage(response, html, pathname) {
  assert.match(response.headers.get('content-type') ?? '', /text\/html\b/i,
    `${pathname} must return an HTML error document`);
  assert.match(html, /<title[^>]*>Page not found \| Joseph Tabalon<\/title>/,
    `${pathname} must have a useful missing-page title before hydration`);
  assert.match(html, /<meta\b[^>]*name="robots"[^>]*content="[^"]*\bnoindex\b/,
    `${pathname} must remain outside indexing`);
  assert.match(html, /<a\b[^>]*href="\/"[^>]*>[\s\S]*?Return to homepage[\s\S]*?<\/a>/,
    `${pathname} must have a real homepage recovery link`);
}

let browser;
try {
  const homepage = await fetch(new URL('/', baseUrl));
  assert.equal(homepage.status, 200, 'The homepage must remain available');
  assert.match(await homepage.text(), /<title[^>]*>Joseph Tabalon \| Senior Data Scientist<\/title>/);

  for (const pathname of [
    '/__missing-page-regression__',
    '/__missing-page-regression__/nested?source=404-check&value=two',
    '/blog', '/admin', '/sign-in', '/_sitemap',
  ]) {
    const response = await fetch(new URL(pathname, baseUrl));
    assert.equal(response.status, 404, `${pathname} must return a genuine HTTP 404`);
    assertMissingPage(response, await response.text(), pathname);
    console.log(`PASS error HTTP ${pathname}`);
  }

  if (process.env.SITE_APEX_URL) {
    const pathname = '/__missing-page-regression__/nested?source=redirect&value=two';
    const response = await fetch(new URL(pathname, process.env.SITE_APEX_URL), { redirect: 'manual' });
    assert([301, 308].includes(response.status), 'The apex host must redirect permanently');
    assert.equal(response.headers.get('location'), `https://www.josephtabalonjr.com${pathname}`,
      'The canonical redirect must preserve the missing path and query');
    console.log('PASS canonical missing-path redirect');
  }

  // Discover exported aliases rather than maintaining a second list of Expo's
  // internal filenames. A direct error document may return 200, but must noindex.
  const pages = (await readdir(exportRoot, { recursive: true }))
    .filter(filename => filename.endsWith('.html') && filename !== 'index.html');
  assert(pages.length > 0, 'The export must include a missing-page document');
  for (const filename of pages) {
    for (const pathname of new Set([`/${filename}`, `/${filename.slice(0, -5)}`])) {
      const response = await fetch(new URL(pathname, baseUrl));
      assert([200, 404].includes(response.status), `${pathname} must resolve to its non-indexable error document`);
      assertMissingPage(response, await response.text(), pathname);
      console.log(`PASS error alias ${pathname}`);
    }
  }

  browser = await browserType.launch();
  for (const javaScriptEnabled of [true, false]) {
    for (const width of [320, 390, 768, 1440]) {
      const page = await browser.newPage({
        viewport: { width, height: 844 }, javaScriptEnabled, reducedMotion: 'reduce',
      });
      const applicationErrors = [];
      page.on('pageerror', error => applicationErrors.push(error.message));
      const name = `error-${width}-${javaScriptEnabled ? 'js' : 'no-js'}`;
      try {
        const missingUrl = new URL('/__missing-page-regression__/nested?source=browser', baseUrl).href;
        const response = await page.goto(missingUrl);
        assert.equal(response.status(), 404);
        await page.waitForLoadState('networkidle');
        assert.equal(await page.evaluate(() => document.fonts.status), 'loaded',
          'Fonts settle before keyboard verification');
        await page.getByRole('heading', { name: 'Page not found', level: 1, exact: true }).waitFor();
        assert.equal(await page.getByRole('main').count(), 1, 'The error explanation has one main landmark');
        const recovery = page.getByRole('link', { name: 'Return to homepage', exact: true });
        assert.equal(await recovery.getAttribute('href'), '/');
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          'The missing-page content fits its viewport');
        await page.keyboard.press('Tab');
        assert(await recovery.evaluate(element => element === document.activeElement),
          'The homepage recovery link is keyboard reachable');
        if (artifactDirectory) await page.screenshot({ path: resolve(artifactDirectory, `${name}.png`) });
        assert.equal(page.url(), missingUrl, 'Keyboard recovery must start on the missing page');
        assert.equal(await page.title(), 'Page not found | Joseph Tabalon',
          'The missing-page title remains until keyboard activation');
        assert(await recovery.evaluate(element => element === document.activeElement),
          'The recovery link retains focus immediately before Enter');
        await page.keyboard.press('Enter');
        await page.waitForURL(new URL('/', baseUrl).href);
        await page.waitForFunction(() => document.title === 'Joseph Tabalon | Senior Data Scientist');
        await page.getByRole('link', { name: 'Email me', exact: true }).first().waitFor();
        const robots = await page.locator('meta[name="robots"]').getAttribute('content');
        assert.doesNotMatch(robots ?? '', /\bnoindex\b/, 'Recovering to the homepage clears the error indexing directive');
        assert.deepEqual(applicationErrors, [], 'Missing-page recovery must not throw application errors');
        console.log(`PASS ${name}`);
      } finally {
        await page.close();
      }
    }
  }
  console.log(`Verified missing-page recovery against ${server ? 'the local exported-site shim (hosted verification still required)' : baseUrl.origin}.`);
} finally {
  await browser?.close();
  server?.stop(true);
}
