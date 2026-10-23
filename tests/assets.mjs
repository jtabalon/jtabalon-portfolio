import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { serveExport } from './helpers/serve-export.mjs';

const server = serveExport();
let browser;

try {
  browser = await chromium.launch();
  for (const scenario of [
    { name: 'mobile-high-density', width: 390, deviceScaleFactor: 3 },
    { name: 'desktop-high-density', width: 1440, deviceScaleFactor: 3 },
    { name: 'without-javascript', width: 390, deviceScaleFactor: 3, javaScriptEnabled: false },
    { name: 'unavailable-fonts', width: 390, deviceScaleFactor: 3, blockFonts: true },
  ]) {
    const { name, width, deviceScaleFactor, javaScriptEnabled = true, blockFonts = false } = scenario;
    const page = await browser.newPage({
      viewport: { width, height: 1000 }, deviceScaleFactor, javaScriptEnabled,
      reducedMotion: 'reduce',
    });
    page.setDefaultTimeout(5000);
    page.setDefaultNavigationTimeout(10000);
    const applicationErrors = [];
    let blockedFonts = 0;
    page.on('pageerror', (error) => applicationErrors.push(error.message));
    if (blockFonts) {
      await page.route('**/*', (route) => {
        if (route.request().resourceType() === 'font') {
          blockedFonts++;
          return route.abort();
        }
        return route.continue();
      });
    }
    try {
      await page.goto(server.url.href, { waitUntil: 'networkidle' });
      assert.equal(await page.evaluate(() => document.fonts.status), 'loaded',
        `${name}: font requests have settled after idle loading`);
      if (blockFonts) {
        // Expo's font observer rejects after 12 seconds. Reading must remain
        // usable both during loading and after that failure has settled.
        await page.getByRole('heading', { name: 'Joseph Tabalon', exact: true }).waitFor();
        await page.waitForTimeout(12_500);
        assert(blockedFonts > 0, 'The font-failure scenario must actually block font requests');
      }
      const portrait = page.getByRole('img', { name: 'Portrait of Joseph Tabalon', exact: true });
      await portrait.waitFor();
      const image = await portrait.evaluate((element) => ({
        complete: element.complete, width: element.naturalWidth,
        source: new URL(element.currentSrc).pathname,
        renderedWidth: element.getBoundingClientRect().width,
        renderedHeight: element.getBoundingClientRect().height,
      }));
      assert(image.complete && image.width > 0, `${name}: the portrait decodes`);
      assert.match(image.source, /^\/portraits\/joseph-tabalon-(320|640|960)\.webp$/,
        `${name}: the browser selects a compressed portrait`);
      assert(image.renderedWidth > 0 && image.renderedHeight > 0,
        `${name}: the portrait has a visible layout`);
      await page.getByRole('heading', { name: 'Joseph Tabalon', exact: true }).waitFor();
      const email = page.locator('#top').getByRole('link', { name: 'Email me', exact: true });
      assert.equal(await email.getAttribute('href'), 'mailto:joseph@tabalon.io');
      await email.click({ trial: true });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${name}: the content fits the viewport`);
      assert.deepEqual(applicationErrors, [], `${name}: the page has no application exceptions`);
      console.log(`PASS assets-${name} (${image.source})`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser?.close();
  server.stop(true);
}
