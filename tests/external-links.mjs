import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { serveExport } from './helpers/serve-export.mjs';

const links = [
  ['Read the peer-reviewed paper', 'https://doi.org/10.1148/ryai.2021210211'],
  ['Inspect the public GitHub repository', 'https://github.com/jtabalon/LungQuant'],
  ['View GitHub profile', 'https://github.com/jtabalon'],
  ['LinkedIn', 'https://www.linkedin.com/in/josephtabalonjr'],
];
const destinations = new Set(links.map(([, href]) => href));
const server = serveExport();
let browser;

async function sourceState(page) {
  return page.evaluate(() => ({
    url: location.href,
    historyLength: history.length,
    focus: document.activeElement?.textContent,
    scroll: [...document.querySelectorAll('*')]
      .filter(element => element.scrollHeight > element.clientHeight)
      .map(element => element.scrollTop),
  }));
}

try {
  browser = await chromium.launch();
  // The disabled-JavaScript pass checks attributes from initial HTML as well as
  // native navigation. Stubs keep the regression independent of third parties.
  for (const javaScriptEnabled of [false, true]) {
    const context = await browser.newContext({
      javaScriptEnabled, viewport: { width: 390, height: 1000 }, reducedMotion: 'reduce',
    });
    await context.route('**/*', route => destinations.has(route.request().url())
      ? route.fulfill({ status: 200, contentType: 'text/html',
        body: '<!doctype html><title>External evidence fixture</title><p>External evidence fixture</p>' })
      : route.continue());
    const page = await context.newPage();
    page.setDefaultTimeout(5000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    try {
      await page.goto(server.url.href, { waitUntil: 'networkidle' });
      for (const [index, [label, href]] of links.entries()) {
        const link = page.getByRole('link', { name: label, exact: true });
        assert.equal(await link.getAttribute('href'), href, `${label}: exact evidence destination`);
        assert.equal(await link.getAttribute('target'), '_blank',
          `${label}: new-tab intent survives initial HTML and hydration`);
        const rel = (await link.getAttribute('rel') ?? '').split(/\s+/);
        assert(rel.includes('noopener') && rel.includes('noreferrer'), `${label}: explicit external-tab isolation`);
        await link.focus();
        const before = await sourceState(page);
        const popupPromise = page.waitForEvent('popup');
        if (index % 2 === 0) await link.press('Enter');
        else await link.click();
        const popup = await popupPromise;
        try {
          await popup.waitForLoadState('domcontentloaded');
          assert.equal(popup.url(), href, `${label}: browser opens the expected URL`);
          assert.equal(await popup.title(), 'External evidence fixture');
          assert(await popup.evaluate(() => window.opener === null), `${label}: external page has no opener`);
        } finally {
          await popup.close();
        }
        await page.bringToFront();
        assert.deepEqual(await sourceState(page), before,
          `${label}: returning preserves portfolio URL, history, focus and scroll`);
      }
      assert.deepEqual(errors, [], 'External links must not throw application errors');
      console.log(`PASS external-links-${javaScriptEnabled ? 'javascript' : 'initial-html-no-javascript'} (${links.length} destinations)`);
    } finally {
      await context.close();
    }
  }
} finally {
  await browser?.close();
  server.stop(true);
}
