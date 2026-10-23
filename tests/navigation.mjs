import assert from 'node:assert/strict';
import { chromium, firefox, webkit } from 'playwright';
import { serveExport } from './helpers/serve-export.mjs';

assert(await Bun.file('dist/index.html').exists(), 'Run bun run build:web first');
const server = serveExport();
const engine = process.env.NAVIGATION_BROWSER ?? 'chromium';
const browserType = { chromium, firefox, webkit }[engine];
assert(browserType, 'NAVIGATION_BROWSER must be chromium, firefox, or webkit');
let browser;

async function load(page, hash = '') {
  // A direct fragment load starts a new document, rather than mutating the hash
  // of the previous scenario's already-hydrated route.
  await page.goto('about:blank');
  await page.goto(`${server.url.href}${hash}`, { waitUntil: 'networkidle' });
  assert.equal(await page.evaluate(() => document.fonts.status), 'loaded', 'Font requests have settled before navigation checks');
}

async function enterFirefoxScroller(page) {
  if (engine !== 'firefox') return;
  // Firefox exposes overflow scrollers to the keyboard without an explicit
  // tabindex. Preserve that native affordance before asserting link order.
  await page.keyboard.press('Tab');
  assert(await page.evaluate(() => {
    const element = document.activeElement;
    return element.tagName === 'DIV'
      && !element.hasAttribute('tabindex')
      && element.scrollHeight > element.clientHeight
      && getComputedStyle(element).overflowY === 'auto';
  }), 'Firefox retains its native keyboard-focusable scroll container');
}

async function checkDestination(page, id, nextLink, { keyboard = true } = {}) {
  const section = page.locator(`#${id}`);
  const heading = section.getByRole('heading').first();
  await page.waitForFunction(expected => location.hash === `#${expected}`, id);
  assert(await heading.evaluate(el => el === document.activeElement), `${id}: destination heading receives focus`);
  assert.equal(await heading.getAttribute('tabindex'), '-1', `${id}: heading stays outside sequential Tab order`);
  const bounds = await heading.boundingBox();
  assert(bounds && bounds.y >= 0 && bounds.y < page.viewportSize().height, `${id}: focused heading is visible`);
  if (keyboard) {
    assert(await heading.evaluate(el => {
      const css = getComputedStyle(el);
      return css.outlineStyle !== 'none' && parseFloat(css.outlineWidth) >= 2;
    }), `${id}: keyboard destination has a visible focus indicator`);
  }
  await page.keyboard.press('Tab');
  assert(await nextLink.evaluate(el => el === document.activeElement), `${id}: next Tab continues in document order`);
  assert.equal(await heading.getAttribute('tabindex'), null, `${id}: temporary focusability is removed on blur`);
}

try {
  browser = await browserType.launch();
  for (const width of [390, 820, 1440]) {
    for (const reducedMotion of ['reduce', 'no-preference']) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion });
      page.setDefaultTimeout(5000);
      page.setDefaultNavigationTimeout(10000);
      const applicationErrors = [];
      page.on('pageerror', error => applicationErrors.push(error.message));
      try {
        for (const [index, id] of ['work', 'about', 'contact'].entries()) {
          await load(page);
          const nav = page.getByRole('navigation');
          const link = nav.getByRole('link').nth(index);
          assert.equal(await link.getAttribute('href'), `/#${id}`);
          await enterFirefoxScroller(page);
          for (let tab = 0; tab <= index; tab++) await page.keyboard.press('Tab');
          assert(await link.evaluate(el => el === document.activeElement), `${id}: reachable from initial Tab order`);
          await page.keyboard.press('Enter');
          const nextLink = id === 'work'
            ? page.locator('#work').getByRole('link').first()
            : page.locator('#contact').getByRole('link', { name: 'Email me', exact: true });
          await checkDestination(page, id, nextLink);
        }

        await load(page);
        const careerLink = page.locator('#career').getByRole('link', { name: 'View the published work', exact: true });
        assert.equal(await careerLink.getAttribute('href'), '/#work');
        await careerLink.focus();
        await page.keyboard.press('Enter');
        await checkDestination(page, 'work', page.locator('#work').getByRole('link').first());

        const backToTop = page.getByRole('link', { name: 'Back to top', exact: true });
        assert.equal(await backToTop.getAttribute('href'), '/#top');
        await backToTop.focus();
        await page.keyboard.press('Enter');
        await checkDestination(page, 'top', page.locator('#top').getByRole('link', { name: 'Email me', exact: true }));

        for (const role of ['banner', 'navigation', 'main', 'contentinfo']) {
          assert.equal(await page.getByRole(role).count(), 1, `Exactly one ${role} landmark`);
        }
        assert.equal(await page.getByRole('main').getByRole('contentinfo').count(), 0, 'Footer is outside main');
        assert.equal(await page.getByRole('banner').getByRole('navigation').count(), 1, 'Navigation is inside header');
        assert.deepEqual(await page.getByRole('heading').evaluateAll(headings => headings.map(el => Number(el.getAttribute('aria-level') || el.tagName.slice(1)))), [1, 2, 2, 2, 2]);
        assert.equal(await page.locator('[tabindex="-1"]').count(), 0, 'No persistent programmatic section Tab stops');
        if (reducedMotion === 'reduce') {
          assert.equal(await page.locator('#top').evaluate(el => getComputedStyle(el).transform), 'none', 'Reduced motion removes the Hero transform');
        }

        if (width === 390 && reducedMotion === 'reduce') {
          await load(page, '#work');
          // Native fragment changes (such as editing the address bar) and browser
          // history must survive the router's update of the current document.
          await page.evaluate(() => { location.hash = '#about'; });
          await page.waitForFunction(() => {
            const heading = document.querySelector('#about h2');
            const bounds = heading.getBoundingClientRect();
            return bounds.top >= 0 && bounds.top < innerHeight;
          });
          await checkDestination(page, 'about', page.locator('#contact').getByRole('link', { name: 'Email me', exact: true }));

          await page.evaluate(() => { location.hash = '#contact'; });
          await page.waitForFunction(() => document.querySelector('#contact h2') === document.activeElement);
          await checkDestination(page, 'contact', page.locator('#contact').getByRole('link', { name: 'Email me', exact: true }));
          await page.evaluate(() => { history.back(); });
          await page.waitForFunction(() => location.hash === '#about' && document.querySelector('#about h2') === document.activeElement);
          await checkDestination(page, 'about', page.locator('#contact').getByRole('link', { name: 'Email me', exact: true }));
          await page.evaluate(() => { history.forward(); });
          await page.waitForFunction(() => location.hash === '#contact' && document.querySelector('#contact h2') === document.activeElement);
          await checkDestination(page, 'contact', page.locator('#contact').getByRole('link', { name: 'Email me', exact: true }));
          await page.getByRole('navigation').getByRole('link', { name: 'Contact', exact: true }).click();
          await checkDestination(page, 'contact', page.locator('#contact').getByRole('link', { name: 'Email me', exact: true }), { keyboard: false });

          for (const [label, id] of [
            ['Work', 'work'], ['About', 'about'], ['Contact', 'contact'],
            ['View the published work', 'work'], ['Back to top', 'top'],
          ]) {
            await load(page);
            await page.getByRole('link', { name: label, exact: true }).click();
            const nextLink = id === 'work'
              ? page.locator('#work').getByRole('link').first()
              : page.locator(id === 'top' ? '#top' : '#contact').getByRole('link', { name: 'Email me', exact: true });
            await checkDestination(page, id, nextLink, { keyboard: false });
          }

          await load(page);
          const controls = [
            ...await page.getByRole('navigation').getByRole('link').all(),
            page.locator('#top').getByRole('link', { name: 'Email me', exact: true }),
            ...await page.locator('#work').getByRole('link').all(),
            careerLink,
            page.locator('#contact').getByRole('link', { name: 'Email me', exact: true }),
            page.locator('#contact').getByRole('link', { name: 'LinkedIn', exact: true }),
            backToTop,
          ];
          await enterFirefoxScroller(page);
          for (const control of controls) {
            await page.keyboard.press('Tab');
            assert(await control.evaluate(el => el === document.activeElement), `Normal Tab order reaches ${await control.innerText()}`);
          }
          await page.keyboard.press('Shift+Tab');
          assert(await page.locator('#contact').getByRole('link', { name: 'LinkedIn', exact: true }).evaluate(el => el === document.activeElement), 'Reverse Tab order remains usable');
        }

        for (const id of ['work', 'about', 'contact', 'top']) {
          await load(page, `#${id}`);
          const heading = page.locator(`#${id}`).getByRole('heading').first();
          await heading.waitFor({ state: 'visible' });
          const bounds = await heading.boundingBox();
          assert(bounds && bounds.y >= 0 && bounds.y < page.viewportSize().height, `${id}: direct fragment load reaches destination`);
        }
        assert.deepEqual(applicationErrors, [], 'Section navigation must not throw application errors');
        console.log(`PASS navigation-${width}-${reducedMotion}`);
      } finally {
        await page.close();
      }
    }
  }

  const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 1000 } });
  noJS.setDefaultTimeout(5000);
  noJS.setDefaultNavigationTimeout(10000);
  const applicationErrors = [];
  noJS.on('pageerror', error => applicationErrors.push(error.message));
  try {
    await load(noJS);
    assert(await noJS.getByRole('heading', { name: 'Joseph Tabalon', exact: true }).isVisible(), 'Initial professional content remains without JavaScript');
    assert(await noJS.getByRole('img', { name: 'Portrait of Joseph Tabalon', exact: true }).isVisible(), 'Portrait remains without JavaScript');
    assert.equal(await noJS.locator('#top').getByRole('link', { name: 'Email me', exact: true }).getAttribute('href'), 'mailto:joseph@tabalon.io');
    for (const label of ['Work', 'About', 'Contact']) {
      const id = label.toLowerCase();
      await noJS.getByRole('navigation').getByRole('link', { name: label, exact: true }).click();
      assert.equal(new URL(noJS.url()).hash, `#${id}`, 'Native links preserve their fragments without JavaScript');
      const bounds = await noJS.locator(`#${id}`).getByRole('heading').first().boundingBox();
      assert(bounds && bounds.y >= 0 && bounds.y < noJS.viewportSize().height, `${id}: no-JavaScript fragment remains usable`);
    }
    await noJS.locator('#career').getByRole('link', { name: 'View the published work', exact: true }).click();
    assert.equal(new URL(noJS.url()).hash, '#work', 'Career publication link works without JavaScript');
    await noJS.getByRole('link', { name: 'Back to top', exact: true }).click();
    assert.equal(new URL(noJS.url()).hash, '#top', 'Back to top works without JavaScript');
    for (const id of ['work', 'about', 'contact', 'top']) {
      await load(noJS, `#${id}`);
      const bounds = await noJS.locator(`#${id}`).getByRole('heading').boundingBox();
      assert(bounds && bounds.y >= 0 && bounds.y < noJS.viewportSize().height, `${id}: direct fragment load remains usable without JavaScript`);
    }
    await load(noJS);
    await enterFirefoxScroller(noJS);
    for (let tab = 0; tab < 3; tab++) await noJS.keyboard.press('Tab');
    await noJS.keyboard.press('Enter');
    await noJS.keyboard.press('Tab');
    assert(await noJS.locator('#contact').getByRole('link', { name: 'Email me', exact: true }).evaluate(el => el === document.activeElement), 'Native no-JavaScript fragment navigation also continues Tab at Contact');
    assert.deepEqual(applicationErrors, [], 'Navigation without JavaScript must not throw application errors');
    console.log('PASS navigation-no-javascript');
  } finally {
    await noJS.close();
  }
} finally {
  await browser?.close();
  server.stop(true);
}
