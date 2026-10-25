import assert from 'node:assert/strict';
import { chromium, firefox, webkit } from 'playwright';
import { serveExport } from './helpers/serve-export.mjs';

assert(await Bun.file('dist/index.html').exists(), 'Run bun run build:web first');
const server = serveExport();
const engine = process.env.NAVIGATION_BROWSER ?? 'chromium';
const browserType = { chromium, firefox, webkit }[engine];
assert(browserType, 'NAVIGATION_BROWSER must be chromium, firefox, or webkit');
let browser;

async function load(page, suffix = '') {
  // A direct fragment load starts a new document, rather than mutating the hash
  // of the previous scenario's already-hydrated route.
  await page.goto('about:blank');
  await page.goto(`${server.url.href}${suffix}`, { waitUntil: 'networkidle' });
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
  await page.waitForFunction(expected => {
    const heading = document.getElementById(expected)?.querySelector('h1, h2');
    return location.hash === `#${expected}` && heading === document.activeElement;
  }, id);
  assert(await heading.evaluate(el => el === document.activeElement), `${id}: destination heading receives focus`);
  assert.equal(await heading.getAttribute('tabindex'), '-1', `${id}: heading stays outside sequential Tab order`);
  const bounds = await heading.boundingBox();
  assert(bounds && bounds.y >= 0 && bounds.y + bounds.height <= page.viewportSize().height, `${id}: focused heading is fully visible`);
  if (keyboard) {
    const focus = await heading.evaluate(el => {
      const css = getComputedStyle(el);
      const bounds = el.getBoundingClientRect();
      const inset = Math.max(0, parseFloat(css.outlineWidth) + parseFloat(css.outlineOffset));
      return {
        visible: css.outlineStyle !== 'none' && parseFloat(css.outlineWidth) >= 2,
        top: bounds.top - inset,
        bottom: bounds.bottom + inset,
      };
    });
    assert(focus.visible, `${id}: keyboard destination has a visible focus indicator`);
    assert(focus.top >= 0 && focus.bottom <= page.viewportSize().height,
      `${id}: keyboard focus indicator fits the viewport`);
  }
  await page.keyboard.press('Tab');
  // Crossing a paint catches delayed navigation work that would otherwise steal
  // focus back after an apparently successful next Tab.
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
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

  // Short CSS viewports reproduce the reading space available at high browser
  // zoom. These remain viewport regressions, not genuine browser-zoom evidence.
  for (const viewport of [{ width: 372, height: 245 }, { width: 320, height: 256 }]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
    page.setDefaultTimeout(5000);
    page.setDefaultNavigationTimeout(10000);
    const applicationErrors = [];
    page.on('pageerror', error => applicationErrors.push(error.message));
    try {
      for (const [label, id] of [['Work', 'work'], ['About', 'about'], ['Contact', 'contact'], ['Back to top', 'top']]) {
        await load(page);
        const source = page.getByRole('link', { name: label, exact: true });
        await source.focus();
        await page.keyboard.press('Enter');
        const nextLink = id === 'work'
          ? page.locator('#work').getByRole('link').first()
          : page.locator(id === 'top' ? '#top' : '#contact').getByRole('link', { name: 'Email me', exact: true });
        await checkDestination(page, id, nextLink);
      }
      assert.deepEqual(applicationErrors, [], 'Short-viewport navigation must not throw application errors');
      console.log(`PASS navigation-short-${viewport.width}-${viewport.height}`);
    } finally {
      await page.close();
    }
  }

  // Real link activation must leave section entries for browser Back/Forward,
  // as native hash changes do. Each input mode gets a fresh browser context.
  for (const activation of ['pointer', 'keyboard']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 1000 }, reducedMotion: 'reduce' });
    page.setDefaultTimeout(5000);
    page.setDefaultNavigationTimeout(10000);
    const applicationErrors = [];
    page.on('pageerror', error => applicationErrors.push(error.message));
    const nextLink = id => id === 'work'
      ? page.locator('#work').getByRole('link').first()
      : page.locator('#contact').getByRole('link', { name: 'Email me', exact: true });
    try {
      await load(page);
      for (const [label, id] of [['Work', 'work'], ['About', 'about'], ['Contact', 'contact']]) {
        const source = page.getByRole('navigation').getByRole('link', { name: label, exact: true });
        if (activation === 'pointer') await source.click();
        else {
          await source.focus();
          await page.keyboard.press('Enter');
        }
        await checkDestination(page, id, nextLink(id), { keyboard: activation === 'keyboard' });
        assert.equal(page.url(), `${server.url.href}#${id}`);
      }
      for (const [direction, id] of [['back', 'about'], ['back', 'work'], ['forward', 'about'], ['forward', 'contact']]) {
        if (direction === 'back') await page.goBack();
        else await page.goForward();
        await checkDestination(page, id, nextLink(id), { keyboard: activation === 'keyboard' });
        assert.equal(page.url(), `${server.url.href}#${id}`, `${activation}: browser ${direction} returns to ${id}`);
      }
      assert.deepEqual(applicationErrors, [], 'Section link history must not throw application errors');
      console.log(`PASS navigation-link-history-${activation}`);
    } finally {
      await page.close();
    }
  }

  for (const scenario of [
    { suffix: '?source=section-link', label: 'Work', id: 'work', keyboard: false },
    { suffix: '?source=section-link#contact', label: 'Contact', id: 'contact', keyboard: true },
  ]) {
    const page = await browser.newPage({ viewport: { width: 390, height: 1000 }, reducedMotion: 'reduce' });
    page.setDefaultTimeout(5000);
    page.setDefaultNavigationTimeout(10000);
    const applicationErrors = [];
    page.on('pageerror', error => applicationErrors.push(error.message));
    try {
      await load(page, scenario.suffix);
      const source = page.getByRole('navigation').getByRole('link', { name: scenario.label, exact: true });
      assert.equal(await source.getAttribute('href'), `/#${scenario.id}`);
      if (scenario.keyboard) {
        await source.focus();
        await page.keyboard.press('Enter');
      } else await source.click();
      const nextLink = scenario.id === 'work'
        ? page.locator('#work').getByRole('link').first()
        : page.locator('#contact').getByRole('link', { name: 'Email me', exact: true });
      await checkDestination(page, scenario.id, nextLink, { keyboard: scenario.keyboard });
      assert.equal(page.url(), `${server.url.href}#${scenario.id}`,
        'Section activation follows its root href, including clearing a landing query');
      assert.deepEqual(applicationErrors, [], 'Query landing navigation must not throw application errors');
      console.log(`PASS navigation-query-${scenario.id}`);
    } finally {
      await page.close();
    }
  }

  const arrivalPage = await browser.newPage({ viewport: { width: 390, height: 1000 }, reducedMotion: 'no-preference' });
  arrivalPage.setDefaultTimeout(5000);
  arrivalPage.setDefaultNavigationTimeout(10000);
  const arrivalErrors = [];
  arrivalPage.on('pageerror', error => arrivalErrors.push(error.message));
  try {
    await load(arrivalPage);
    await arrivalPage.getByRole('navigation').getByRole('link', { name: 'Contact', exact: true }).click();
    await checkDestination(arrivalPage, 'contact', arrivalPage.locator('#contact').getByRole('link', { name: 'Email me', exact: true }), { keyboard: false });
    // Observe rendered opacity/translation across the route restoration. The
    // first arrival has settled; Back to top must reveal settled reading content.
    const sampling = arrivalPage.evaluate(() => new Promise((resolve, reject) => {
      const samples = [];
      const start = performance.now();
      let focusedAt;
      const sample = () => {
        const hero = document.getElementById('top');
        if (hero && location.hash === '#top') {
          const css = getComputedStyle(hero);
          samples.push({ opacity: Number(css.opacity),
            translationY: css.transform === 'none' ? 0 : new DOMMatrixReadOnly(css.transform).m42 });
          if (focusedAt === undefined && hero.querySelector('h1') === document.activeElement) focusedAt = performance.now();
        }
        if (focusedAt !== undefined && performance.now() - focusedAt >= 400) resolve(samples);
        else if (performance.now() - start >= 5000) reject(new Error('Back to top must focus its heading during arrival sampling'));
        else requestAnimationFrame(sample);
      };
      sample();
    }));
    let samples;
    try {
      await arrivalPage.getByRole('link', { name: 'Back to top', exact: true }).click();
      await arrivalPage.waitForFunction(() => document.querySelector('#top h1') === document.activeElement);
      await arrivalPage.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await checkDestination(arrivalPage, 'top', arrivalPage.locator('#top').getByRole('link', { name: 'Email me', exact: true }), { keyboard: false });
    } finally {
      samples = await sampling;
    }
    assert(samples.length > 1, 'Back to top samples rendered content across multiple frames');
    assert(samples.every(sample => sample.opacity === 1 && Math.abs(sample.translationY) < 0.01),
      'Back to top must not replay the initial Hero fade or movement');
    assert.deepEqual(arrivalErrors, [], 'Restoring the Hero must not throw application errors');
    console.log('PASS navigation-one-time-arrival');
  } finally {
    await arrivalPage.close();
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
  // Alternate-window interactions get their own contexts: WebKit can retain
  // native window/menu input state after modified clicks, contaminating later
  // ordinary mouse delivery even when the original page is brought forward.
  // macOS uses Meta for new tabs and Control for native context menus. Other
  // host platforms use Control; Meta can perform ordinary navigation there.
  const modifiers = process.platform === 'darwin' ? ['Meta', 'Control', 'Shift'] : ['Control', 'Shift'];
  for (const modifier of modifiers) {
    for (const label of ['Contact', 'View the published work', 'Back to top']) {
      const context = await browser.newContext({ viewport: { width: 390, height: 1000 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.setDefaultTimeout(5000);
      page.setDefaultNavigationTimeout(10000);
      const applicationErrors = [];
      page.on('pageerror', error => applicationErrors.push(error.message));
      try {
        await load(page);
        const source = page.getByRole('link', { name: label, exact: true });
        await source.focus();
        const originalUrl = page.url();
        const originalBounds = await page.getByRole('main').boundingBox();
        // macOS Control opens a native context menu. Other modifiers here must
        // create another local page; unchanged original state alone would also
        // pass if a handler silently canceled the browser's default action.
        const opensPage = process.platform !== 'darwin' || modifier !== 'Control';
        const expectedUrl = new URL(await source.getAttribute('href'), originalUrl).href;
        const [popup] = await Promise.all([
          opensPage ? context.waitForEvent('page', { timeout: 5000 }) : Promise.resolve(null),
          source.click({ modifiers: [modifier] }),
        ]);
        if (popup) {
          await popup.waitForURL(expectedUrl, { waitUntil: 'domcontentloaded', timeout: 5000 });
          assert.equal(popup.url(), expectedUrl, `${modifier}-${label}: new page reaches the linked fragment`);
          await popup.close();
          await page.bringToFront();
          await page.waitForFunction(() => new Promise(resolve =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve(true)))),
          undefined, { timeout: 5000 });
        }
        assert.equal(page.url(), originalUrl, `${modifier}-${label}: current URL stays unchanged`);
        assert(await source.evaluate(el => el === document.activeElement), `${modifier}-${label}: current focus stays on the source link`);
        const bounds = await page.getByRole('main').boundingBox();
        assert(Math.abs(bounds.y - originalBounds.y) < 1, `${modifier}-${label}: current reading position stays unchanged`);
        assert.deepEqual(applicationErrors, [], 'Modified section links must not throw application errors');
      } finally {
        await page.keyboard.press('Escape');
        await context.close();
      }
    }
  }
  console.log('PASS navigation-modified-clicks');
} finally {
  await browser?.close();
  server.stop(true);
}
