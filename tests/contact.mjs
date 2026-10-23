import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { chromium } from 'playwright';
import { serveExport } from './helpers/serve-export.mjs';

const root = resolve('dist');
assert(await Bun.file(resolve(root, 'index.html')).exists(), 'Run bun run build:web first');
const artifacts = process.env.BROWSER_ARTIFACT_DIR;
if (artifacts) {
  for (const directory of ['dist', 'public']) {
    const forbidden = resolve(directory);
    assert(resolve(artifacts) !== forbidden && !resolve(artifacts).startsWith(forbidden + sep),
      'Screenshots must stay outside dist/public');
  }
  await mkdir(artifacts, { recursive: true });
}
const server = serveExport();
let browser;
let failures = 0;
try {
  browser = await chromium.launch();
  for (const scale of [1, 2]) {
    for (const width of [320, 390, 768, 820, 912, 1024, 1440]) {
      const name = `contact-${width}-${scale * 100}pct`;
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      const applicationErrors = [];
      page.on('pageerror', (error) => applicationErrors.push(error.message));
      try {
        await page.goto(server.url.href);
        await page.evaluate(() => document.fonts.ready);
        const contact = page.locator('#contact');
        const email = contact.getByRole('link', { name: 'Email me', exact: true });
        const linkedIn = contact.getByRole('link', { name: 'LinkedIn', exact: true });
        assert.equal(await email.getAttribute('href'), 'mailto:joseph@tabalon.io');
        assert.equal(await linkedIn.getAttribute('href'), 'https://www.linkedin.com/in/josephtabalonjr');
        assert.equal(await page.locator('#top').getByRole('link', { name: 'Email me', exact: true }).getAttribute('href'), 'mailto:joseph@tabalon.io');
        if (scale === 2) {
          // Text-only enlargement: retain the viewport and spacing, double rendered
          // font sizes and line heights, including text styled in absolute pixels.
          await contact.evaluate(section => {
            const nodes = [...section.querySelectorAll('*')].filter(el =>
              [...el.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()));
            const sizes = nodes.map(el => ({ el, size: parseFloat(getComputedStyle(el).fontSize), line: parseFloat(getComputedStyle(el).lineHeight) }));
            for (const { el, size, line } of sizes) {
              el.style.fontSize = `${size * 2}px`;
              if (Number.isFinite(line)) el.style.lineHeight = `${line * 2}px`;
            }
          });
        }
        await contact.scrollIntoViewIfNeeded();
        if (artifacts) await page.screenshot({ path: resolve(artifacts, `${name}.png`) });
        const issues = await contact.evaluate(section => {
          const card = section.lastElementChild;
          const bounds = card.getBoundingClientRect();
          const errors = [];
          const inside = (rect, label) => {
            if (rect.width <= 0 || rect.height <= 0 || rect.left < Math.max(0, bounds.left) - 1 || rect.right > Math.min(innerWidth, bounds.right) + 1 || rect.top < bounds.top - 1 || rect.bottom > bounds.bottom + 1) errors.push(`${label} outside card/viewport: left=${rect.left}, right=${rect.right}`);
          };
          for (const el of card.querySelectorAll('*')) {
            for (const node of el.childNodes) {
              if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) continue;
              const range = document.createRange();
              range.selectNodeContents(node);
              for (const rect of range.getClientRects()) inside(rect, node.textContent);
              if (!el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) errors.push(`Hidden text: ${node.textContent}`);
            }
          }
          const links = [...card.querySelectorAll('a')];
          for (const link of links) inside(link.getBoundingClientRect(), link.textContent);
          const [primary, secondary] = links;
          if (getComputedStyle(primary).backgroundColor === 'rgba(0, 0, 0, 0)') errors.push('Primary contact action lost its filled surface');
          if (getComputedStyle(secondary).backgroundColor !== 'rgba(0, 0, 0, 0)') errors.push('Secondary link gained a filled surface');
          return errors;
        });
        assert.deepEqual(issues, []);
        // Trial clicks check hit targets without opening an email client or profile.
        await email.click({ trial: true, timeout: 3000 });
        await linkedIn.click({ trial: true, timeout: 3000 });
        await email.focus();
        await page.keyboard.press('Tab');
        assert(await linkedIn.evaluate(el => el === document.activeElement), 'LinkedIn follows Email me in keyboard order');
        await page.keyboard.press('Shift+Tab');
        assert(await email.evaluate(el => el === document.activeElement), 'Email me is keyboard reachable');
        assert.deepEqual(applicationErrors, [], 'Contact interaction must not throw application errors');
        console.log(`PASS ${name}`);
      } catch (error) {
        failures++;
        console.error(`FAIL ${name}: ${error.message}`);
      } finally {
        await page.close();
      }
    }
  }
} finally {
  await browser?.close();
  server.stop(true);
}
assert.equal(failures, 0, `${failures} Contact scenarios failed`);
