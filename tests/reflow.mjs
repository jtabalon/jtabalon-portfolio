import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { serveExport } from './helpers/serve-export.mjs';

const server = serveExport();
let browser;

try {
  browser = await chromium.launch();
  for (const width of [320, 390]) {
    for (const scale of [1, 2]) {
      const name = `reflow-${width}-${scale * 100}pct`;
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      page.setDefaultTimeout(5000);
      page.setDefaultNavigationTimeout(10000);
      const applicationErrors = [];
      page.on('pageerror', error => applicationErrors.push(error.message));
      try {
        await page.goto(server.url.href, { waitUntil: 'networkidle' });
        assert.equal(await page.evaluate(() => document.fonts.status), 'loaded');
        if (scale === 2) {
          // Enlarge all rendered text while retaining viewport and spacing. This
          // simulates text reflow; it is not genuine browser zoom or a WCAG audit.
          await page.evaluate(() => {
            const nodes = [...document.body.querySelectorAll('*')].filter(element =>
              !['SCRIPT', 'STYLE'].includes(element.tagName) && [...element.childNodes].some(node =>
                node.nodeType === Node.TEXT_NODE && node.textContent.trim()));
            const sizes = nodes.map(element => ({ element,
              size: parseFloat(getComputedStyle(element).fontSize),
              line: parseFloat(getComputedStyle(element).lineHeight) }));
            for (const { element, size, line } of sizes) {
              element.style.fontSize = `${size * 2}px`;
              if (Number.isFinite(line)) element.style.lineHeight = `${line * 2}px`;
            }
          });
        }

        // The document's scrollWidth alone misses text clipped inside the native
        // scroll container. Measure actual text fragments and visible link boxes.
        const issues = await page.evaluate(() => {
          const errors = [];
          const check = (bounds, element, label) => {
            if (bounds.width <= 0 || bounds.height <= 0 || !element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) {
              errors.push(`${label} has no visible layout`);
            }
            if (bounds.left < -1 || bounds.right > innerWidth + 1) {
              errors.push(`${label} outside viewport: ${bounds.left}..${bounds.right}`);
            }
            for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
              if (!['hidden', 'clip', 'auto', 'scroll'].includes(getComputedStyle(ancestor).overflowX)) continue;
              const container = ancestor.getBoundingClientRect();
              if (bounds.left < container.left - 1 || bounds.right > container.right + 1) {
                errors.push(`${label} clipped by scroll container: ${bounds.left}..${bounds.right}`);
                break;
              }
            }
          };
          for (const element of document.body.querySelectorAll('*')) {
            if (['SCRIPT', 'STYLE'].includes(element.tagName)) continue;
            for (const node of element.childNodes) {
              if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) continue;
              const range = document.createRange();
              range.selectNodeContents(node);
              for (const bounds of range.getClientRects()) check(bounds, element, node.textContent.trim());
            }
          }
          for (const link of document.querySelectorAll('a')) check(link.getBoundingClientRect(), link, link.textContent.trim());
          return errors;
        });
        assert.deepEqual(issues, [], `${name}: text and links fit without horizontal clipping`);

        const navigation = page.getByRole('navigation');
        for (const [label, id] of [['Work', 'work'], ['About', 'about'], ['Contact', 'contact']]) {
          const link = navigation.getByRole('link', { name: label, exact: true });
          assert.equal(await link.getAttribute('href'), `/#${id}`);
          await page.keyboard.press('Tab');
          assert(await link.evaluate(element => element === document.activeElement), `${name}: keyboard order reaches ${label}`);
          await link.click({ trial: true });
        }
        const emails = page.getByRole('link', { name: 'Email me', exact: true });
        assert.equal(await emails.count(), 2, `${name}: both email actions remain available`);
        await page.keyboard.press('Tab');
        assert(await emails.first().evaluate(element => element === document.activeElement), `${name}: header navigation continues to Hero email`);
        for (const email of await emails.all()) {
          assert.equal(await email.getAttribute('href'), 'mailto:joseph@tabalon.io');
          assert.notEqual(await email.evaluate(element => getComputedStyle(element).backgroundColor), 'rgba(0, 0, 0, 0)', `${name}: Email me retains its filled surface`);
          await email.click({ trial: true });
        }
        const linkedIn = page.getByRole('link', { name: 'LinkedIn', exact: true });
        assert.equal(await linkedIn.getAttribute('href'), 'https://www.linkedin.com/in/josephtabalonjr');
        assert.equal(await linkedIn.evaluate(element => getComputedStyle(element).backgroundColor), 'rgba(0, 0, 0, 0)', `${name}: LinkedIn remains subordinate to Email me`);
        await linkedIn.click({ trial: true });
        assert.deepEqual(applicationErrors, [], `${name}: reflow must not throw application errors`);
        console.log(`PASS ${name}`);
      } finally {
        await page.close();
      }
    }
  }
} finally {
  await browser?.close();
  server.stop(true);
}
