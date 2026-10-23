import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { serveExport } from './helpers/serve-export.mjs';

const server = serveExport();
let browser;

async function assertReadingAndContact(page, name) {
  await page.getByRole('heading', { name: 'Joseph Tabalon', exact: true }).waitFor();
  const emails = page.getByRole('link', { name: 'Email me', exact: true });
  assert.equal(await emails.count(), 2, `${name}: both contact actions remain available`);
  for (const email of await emails.all()) {
    assert.equal(await email.getAttribute('href'), 'mailto:joseph@tabalon.io');
    await email.click({ trial: true });
  }
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    `${name}: the content fits the viewport`);
}

try {
  browser = await chromium.launch();
  for (const scenario of [
    { name: 'mobile-high-density', width: 390, deviceScaleFactor: 3 },
    { name: 'desktop-high-density', width: 1440, deviceScaleFactor: 3 },
    { name: 'without-javascript', width: 390, deviceScaleFactor: 3, javaScriptEnabled: false },
    { name: 'unavailable-fonts', width: 390, deviceScaleFactor: 3, fontMode: 'failure' },
    { name: 'pending-fonts', width: 390, deviceScaleFactor: 3, fontMode: 'pending' },
    { name: 'missing-portrait-without-javascript', width: 390, deviceScaleFactor: 3,
      javaScriptEnabled: false, missingPortrait: true },
  ]) {
    const { name, width, deviceScaleFactor, javaScriptEnabled = true,
      fontMode, missingPortrait = false } = scenario;
    const page = await browser.newPage({
      viewport: { width, height: 1000 }, deviceScaleFactor, javaScriptEnabled,
      reducedMotion: 'reduce',
    });
    page.setDefaultTimeout(5000);
    page.setDefaultNavigationTimeout(10000);
    const applicationErrors = [];
    const fontFailures = { abort: 0, http404: 0, malformed: 0 };
    let interceptedFonts = 0;
    let interceptedPortraits = 0;
    let pendingFontObservation;
    let releaseFonts;
    const fontGate = new Promise(resolve => { releaseFonts = resolve; });
    page.on('pageerror', (error) => applicationErrors.push(error.message));
    if (fontMode || missingPortrait) {
      await page.route('**/*', async (route) => {
        if (fontMode && route.request().resourceType() === 'font') {
          interceptedFonts++;
          if (fontMode === 'pending') {
            await fontGate;
            return route.continue();
          }
          // One failure case covers network errors, missing files and invalid
          // successful responses without adding three equivalent wait cases.
          const failure = ['abort', 'http404', 'malformed'][(interceptedFonts - 1) % 3];
          fontFailures[failure]++;
          if (failure === 'abort') return route.abort();
          if (failure === 'http404') return route.fulfill({ status: 404, body: 'Missing font' });
          return route.fulfill({ status: 200, contentType: 'font/woff2', body: 'Invalid font bytes' });
        }
        if (missingPortrait && new URL(route.request().url()).pathname.startsWith('/portraits/')) {
          interceptedPortraits++;
          return route.fulfill({ status: 404, body: 'Missing portrait' });
        }
        return route.continue();
      });
    }
    try {
      await page.goto(server.url.href, {
        waitUntil: fontMode === 'pending' ? 'domcontentloaded' : 'networkidle',
      });
      if (fontMode === 'pending') {
        await page.waitForFunction(() => document.fonts.status === 'loading');
        await assertReadingAndContact(page, `${name} during loading`);
      } else {
        assert.equal(await page.evaluate(() => document.fonts.status), 'loaded',
          `${name}: font requests have settled after idle loading`);
      }
      if (fontMode) {
        // Expo's font observer rejects after 12 seconds. Assert usability again
        // after that boundary, including while network requests are still held.
        await page.waitForTimeout(12_500);
        assert.equal(interceptedFonts, 5, `${name}: all five font requests are exercised`);
        await assertReadingAndContact(page, `${name} after font observer timeout`);
        if (fontMode === 'pending') {
          assert.equal(await page.evaluate(() => document.fonts.status), 'loading',
            'The startup assertion must run before delayed fonts finish');
          pendingFontObservation = { requests: interceptedFonts, status: 'loading', released: false };
          releaseFonts();
          await page.waitForFunction(() => document.fonts.status === 'loaded');
        } else {
          assert(Object.values(fontFailures).every(count => count > 0),
            'Font failures must include network, HTTP404 and malformed-body paths');
        }
      }
      const portrait = page.getByRole('img', { name: 'Portrait of Joseph Tabalon', exact: true });
      await portrait.waitFor();
      await page.waitForFunction(() =>
        document.querySelector('img[alt="Portrait of Joseph Tabalon"]')?.complete);
      const image = await portrait.evaluate((element) => ({
        complete: element.complete, width: element.naturalWidth,
        source: new URL(element.currentSrc).pathname,
        renderedWidth: element.getBoundingClientRect().width,
        renderedHeight: element.getBoundingClientRect().height,
      }));
      assert(image.complete, `${name}: the portrait request settles`);
      if (missingPortrait) {
        assert(interceptedPortraits > 0, 'The portrait failure must actually intercept an image');
        assert.equal(image.width, 0, 'A missing portrait uses its native alternative-text fallback');
        assert.equal(await portrait.getAttribute('alt'), 'Portrait of Joseph Tabalon',
          'A missing portrait retains actual alternative text without JavaScript');
        assert.equal(image.renderedWidth, 148, 'The portrait reserves its width after failure');
        assert.equal(image.renderedHeight, 148, 'The portrait reserves its height after failure');
      } else {
        assert(image.width > 0, `${name}: the portrait decodes`);
      }
      assert.match(image.source, /^\/portraits\/joseph-tabalon-(320|640|960)\.webp$/,
        `${name}: the browser selects a compressed portrait`);
      assert(image.renderedWidth > 0 && image.renderedHeight > 0,
        `${name}: the portrait has a visible layout`);
      await assertReadingAndContact(page, name);
      assert.deepEqual(applicationErrors, [], `${name}: the page has no application exceptions`);
      console.log(`PASS assets-${name} (${image.source})`
        + (fontMode ? ` ${JSON.stringify({ fontFailures, pendingFontObservation })}` : ''));
    } finally {
      releaseFonts();
      await page.close();
    }
  }
} finally {
  await browser?.close();
  server.stop(true);
}
