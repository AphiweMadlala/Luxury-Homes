// Regression suite for the built site: route x viewport sweeps, interactions, axe, cross-browser.
// Usage: node scripts/serve.mjs 4173 & node scripts/qa.mjs [--browsers=chromium,firefox,webkit] [--shots=dir]
// Needs playwright-core (resolved from the repo, else from a global @playwright/cli install).
import { readFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

const require = createRequire(import.meta.url);
const pw = (() => {
  try { return require('playwright-core'); } catch {}
  const root = execSync('npm root -g').toString().trim();
  return require(`${root}/@playwright/cli/node_modules/playwright-core`);
})();
const arg = k => process.argv.find(a => a.startsWith(`--${k}=`))?.split('=')[1];
const BROWSERS = (arg('browsers') || 'chromium,firefox,webkit').split(',');
const SHOTS = arg('shots');
if (SHOTS) mkdirSync(SHOTS, { recursive: true });
const BASE = arg('base') || 'http://localhost:4173';
const AXE = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');

const ROUTES = {
  home: '/', residences: '/residences/', residencesSold: '/residences/?status=sold', residencesArchive: '/residences/?status=unknown',
  residencesArchiveFiltered: '/residences/?status=unknown&loc=p%3AGauteng&beds=5', residencesEmpty: '/residences/?status=unknown&q=zzzz',
  houses: '/houses/', housesType: '/houses/?type=interiors', housesProvince: '/houses/?province=KwaZulu-Natal',
  housesPractice: '/houses/?creative=saota', housesOne: '/houses/?creative=footprint', housesFew: '/houses/?type=property-tour',
  houseLandscape: '/houses/houghton-residence-saota/', housePortrait: '/houses/kloof-119a/', houseFilm: '/houses/rivers-edge/',
  houseRich: '/houses/sandton-stacked-boxes/', houseNoCredit: '/houses/clifton-hillside-house/', houseOdd: '/houses/la-lucia-seaside-house/',
  resAvailable: '/residences/kloof-road-bantry-bay/', resSold: '/residences/nettleton-road-clifton/', resArchive: '/residences/can-balearia/',
  resPOA: '/residences/five-elements-house/', resLimited: '/residences/zimbali-driveway-house/', resVideo: '/residences/blue-hills-equestrian-residence/',
  films: '/films/', people: '/architects/', practice: '/architects/saota/', practiceOne: '/architects/footprint/',
  places: '/places/', province: '/places/gauteng/', about: '/about/', feature: '/feature-a-home/', contact: '/contact/', notFound: '/no-such-page/',
};
const WIDTHS = [375, 390, 430, 768, 820, 900, 1024, 1080, 1180, 1280, 1440, 1920];
const ONLY = arg('routes')?.split(','); // e.g. --routes=residences,residencesSold for a targeted rerun
const XB_PAGES = ['home', 'residences', 'houses', 'housesType', 'houseFilm', 'resAvailable', 'films', 'feature'];
const XB_WIDTHS = [390, 1024, 1440];

const results = { pass: 0, fail: [] };
const ok = (cond, label) => { if (cond) results.pass++; else results.fail.push(label); return cond; };

// Page-level structural checks run in the page.
const inspect = () => {
  const out = {};
  out.overflow = document.documentElement.scrollWidth - innerWidth;
  const ids = [...document.querySelectorAll('[id]')].map(e => e.id);
  out.dupIds = ids.filter((x, i) => ids.indexOf(x) !== i);
  out.badLabelledby = [...document.querySelectorAll('[aria-labelledby]')].flatMap(e => e.getAttribute('aria-labelledby').split(/\s+/)).filter(id => !document.getElementById(id));
  const hs = [...document.querySelectorAll('main h1, main h2, main h3, main h4')].filter(h => !h.closest('[hidden]'));
  out.h1 = document.querySelectorAll('h1').length;
  out.headingJumps = hs.map(h => +h.tagName[1]).map((l, i, a) => (i && l - a[i - 1] > 1 ? `${hs[i - 1].tagName}>${hs[i].tagName} "${hs[i].textContent.trim().slice(0, 30)}"` : null)).filter(Boolean);
  out.brokenImgs = [...document.images].filter(i => i.complete && i.currentSrc && i.naturalWidth === 0).map(i => i.currentSrc);
  const br = document.querySelector('.site-header .brand')?.getBoundingClientRect();
  const nav = document.querySelector('.nav');
  out.headerCollision = nav && getComputedStyle(nav).display !== 'none' && br ? nav.getBoundingClientRect().left - br.right < 24 : false;
  // hidden filter results must not be focusable or rendered
  out.hiddenFocusable = [...document.querySelectorAll('[data-house][hidden] a, [data-residence][hidden] a')].filter(a => a.offsetParent !== null).length;
  // faux styles: display face is 400 only, and nothing asks for italic
  out.faux = [...document.querySelectorAll('h1, h2, h3, .brand__lh, .footer-word, .masthead b, .index-list__name')].filter(e => getComputedStyle(e).fontFamily.includes('Caslon') && (+getComputedStyle(e).fontWeight > 400 || getComputedStyle(e).fontStyle !== 'normal')).map(e => e.tagName + '.' + e.className);
  return out;
};

async function scroll(p) {
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 800) { scrollTo(0, y); await new Promise(r => setTimeout(r, 25)); } scrollTo(0, 0); });
}

async function sweep(browser, name, widths, pages, { axe = false } = {}) {
  for (const w of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    const errs = [], failed = [];
    p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    p.on('pageerror', e => errs.push(String(e)));
    // Chromium may start a cached larger srcset candidate and cancel it when the chosen one arrives
    // (ERR_ABORTED on an image). Rendering is checked separately by brokenImgs, so only those are skipped.
    p.on('requestfailed', r => { if (!(r.resourceType() === 'image' && /ERR_ABORTED|NS_BINDING_ABORTED/.test(r.failure()?.errorText || ''))) failed.push(`${r.url()} ${r.failure()?.errorText}`); });
    for (const key of pages) {
      const path = ROUTES[key];
      errs.length = 0; failed.length = 0;
      const res = await p.goto(BASE + path, { waitUntil: 'networkidle' });
      await scroll(p);
      // Let every image the scroll started finish before leaving; navigating away aborts them.
      await p.waitForFunction(() => [...document.images].every(i => i.complete || i.loading === 'lazy' && !i.currentSrc), null, { timeout: 15000 }).catch(() => {});
      await p.waitForLoadState('networkidle');
      const tag = `${name} ${w} ${key}`;
      ok(key === 'notFound' ? res.status() === 404 : res.status() === 200, `${tag}: status ${res.status()}`);
      const r = await p.evaluate(inspect);
      ok(r.overflow <= 0, `${tag}: horizontal overflow ${r.overflow}px`);
      ok(!r.dupIds.length, `${tag}: duplicate ids ${r.dupIds.join(',')}`);
      ok(!r.badLabelledby.length, `${tag}: aria-labelledby missing ${r.badLabelledby.join(',')}`);
      ok(r.h1 === 1, `${tag}: ${r.h1} h1 elements`);
      ok(!r.headingJumps.length, `${tag}: heading jumps ${r.headingJumps.join('; ')}`);
      ok(!r.brokenImgs.length, `${tag}: broken images ${r.brokenImgs.slice(0, 3).join(', ')}`);
      ok(!r.headerCollision, `${tag}: header nav collides with wordmark`);
      ok(!r.hiddenFocusable, `${tag}: ${r.hiddenFocusable} hidden results still rendered`);
      ok(!r.faux.length, `${tag}: faux bold/italic on ${r.faux.join(',')}`);
      // The 404 page reports its own 404 status in the console; that one message is expected.
      const own404 = key === 'notFound' ? errs.filter(e => !/status of 404/.test(e)) : errs;
      ok(!own404.length, `${tag}: console ${own404.slice(0, 2).join(' | ')}`);
      ok(!failed.length, `${tag}: failed requests ${failed.slice(0, 2).join(' | ')}`);
      if (axe) {
        await p.addScriptTag({ content: AXE });
        const v = await p.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] })).violations.map(x => `${x.id}(${x.nodes.length}) ${x.nodes[0].target}`));
        ok(!v.length, `${tag}: axe ${v.join('; ')}`);
      }
      if (SHOTS && XB_PAGES.includes(key) && XB_WIDTHS.includes(w)) await p.screenshot({ path: `${SHOTS}/${name}-${w}-${key}.png`, fullPage: false });
    }
    await ctx.close();
  }
}

// --------------------------------------------------------------- interactions
async function interactions(browser, name) {
  const T = (c, l) => ok(c, `${name} interaction: ${l}`);
  for (const w of [390, 1440]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 860 }, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    const tag = s => `${s} @${w}`;
    const vis = sel => p.locator(sel).first().isVisible();
    const count = () => p.locator('[data-count]').first().textContent();

    // Residences: register on Available, list + refine on larger statuses, URL state, Back/Forward.
    await p.goto(BASE + '/residences/', { waitUntil: 'networkidle' });
    T(await vis('[data-spread]'), tag('available register shown'));
    T(!(await vis('[data-results]')), tag('available list hidden behind register'));
    T(!(await vis('[data-refine]')), tag('refine hidden for 3 available homes'));
    T(!(await vis('[data-filters] [data-reset]')), tag('clear filters hidden when nothing is set'));
    T((await count()).startsWith('3 available'), tag('available count'));
    await p.locator('label.tab', { hasText: 'Archive' }).click();
    await p.waitForURL(/status=unknown/);
    T(await vis('[data-results]') && !(await vis('[data-spread]')), tag('archive shows list'));
    T(await vis('[data-refine]') || w < 768, tag('refine offered for archive'));
    if (w < 768 && !(await p.locator('[data-refine]').evaluate(d => d.open))) await p.locator('[data-refine] > summary').click();
    const locs = await p.locator('#f-loc option').allTextContents();
    T(locs.length > 3 && locs.every(o => o === 'All locations' || /\(\d+\)$/.test(o)), tag('location options carry counts'));
    const archiveCities = await p.$$eval('[data-residence][data-status="unknown"]', cs => [...new Set(cs.map(c => `${c.dataset.province}|${c.dataset.city}`))]);
    const cityVals = (await p.$$eval('#f-loc option', os => os.map(o => o.value))).filter(v => v.startsWith('c:'));
    T(cityVals.every(v => archiveCities.includes(v.slice(2))), tag('no zero-result locations offered'));
    await p.selectOption('#f-loc', cityVals[0]);
    await p.waitForURL(/loc=/);
    const n1 = parseInt(await count());
    T(n1 >= 1 && n1 < 54, tag(`location filter narrows (${n1})`));
    await p.locator('label.tab', { hasText: 'Sold' }).click();
    await p.waitForURL(/status=sold/);
    T(!(await p.locator('#f-loc').inputValue()) || (await p.$$eval('#f-loc option', os => os.map(o => o.value))).includes(await p.locator('#f-loc').inputValue()), tag('location reset when not in new status'));
    await p.goBack(); await p.waitForURL(/status=unknown/);
    T((await p.locator('#f-loc').inputValue()) === cityVals[0], tag('Back restores location'));
    await p.goBack(); await p.waitForURL(u => !u.search.includes('loc='));
    T(parseInt(await count()) === 54, tag('Back restores archive count'));
    await p.goForward(); await p.waitForURL(/loc=/);
    T(parseInt(await count()) === n1, tag('Forward restores location filter'));
    // sort + price
    await p.goto(BASE + '/residences/?status=unknown&sort=price-asc', { waitUntil: 'networkidle' });
    const prices = await p.$$eval('[data-residence]:not([hidden])', cs => cs.map(c => Number(c.dataset.price) || Infinity));
    T(prices.every((x, i) => !i || x >= prices[i - 1]), tag('price ascending sort'));
    await p.goto(BASE + '/residences/?status=unknown&min=20000000&max=40000000', { waitUntil: 'networkidle' });
    const inRange = await p.$$eval('[data-residence]:not([hidden])', cs => cs.every(c => +c.dataset.price >= 2e7 && +c.dataset.price <= 4e7));
    T(inRange && parseInt(await count()) > 0, tag('price range filter'));
    await p.goto(BASE + '/residences/?status=unknown&q=zzzz', { waitUntil: 'networkidle' });
    T(await vis('[data-empty]'), tag('empty state'));
    await p.locator('[data-empty] [data-reset]').click();
    T((await count()).startsWith('3 available') && await vis('[data-spread]'), tag('empty-state reset returns to register'));
    await p.goto(BASE + '/residences/?province=Gauteng&status=unknown', { waitUntil: 'networkidle' });
    T((await p.locator('#f-loc').inputValue()) === 'p:Gauteng', tag('legacy ?province= link maps to location'));
    await p.goto(BASE + '/residences/?loc=p%3AGauteng', { waitUntil: 'networkidle' });
    T(await vis('[data-results]') && !(await vis('[data-spread]')) && parseInt(await count()) === 1, tag('refined Available shows list'));

    // Houses: filtered pairs, hidden results, aria-live count, URL state.
    await p.goto(BASE + '/houses/', { waitUntil: 'networkidle' });
    T((await count()) === '83 houses', tag('houses count'));
    T(await p.locator('[data-count]').getAttribute('aria-live') === 'polite', tag('houses count is live'));
    await p.locator('label.tab', { hasText: 'Interiors' }).click();
    await p.waitForURL(/type=interiors/);
    T((await count()) === '9 houses', tag('type filter'));
    T(await p.locator('[data-results]').evaluate(g => g.classList.contains('is-filtered')), tag('filtered composition active'));
    const slots = await p.$$eval('[data-house]:not([hidden])', cs => cs.map(c => c.dataset.fslot));
    T(slots.every(Boolean) && slots.filter(s => s === 'w').length >= 3, tag(`filtered slots assigned ${slots.join('')}`));
    const hiddenTab = await p.$$eval('[data-house][hidden]', cs => cs.every(c => getComputedStyle(c).display === 'none'));
    T(hiddenTab, tag('hidden houses are display:none'));
    await p.goto(BASE + '/houses/?creative=footprint', { waitUntil: 'networkidle' });
    T((await count()) === '1 house' && (await p.$eval('[data-house]:not([hidden])', c => c.dataset.fslot)) === 'solo', tag('one-result filter is a solo plate'));
    T(await p.locator('[data-house-refine]').evaluate(d => d.open), tag('practice filter opens refine'));
    await p.goto(BASE + '/houses/', { waitUntil: 'networkidle' });
    if (!(await p.locator('[data-house-refine]').evaluate(d => d.open))) await p.locator('[data-house-refine] > summary').click();
    await p.selectOption('#h-prov', 'KwaZulu-Natal'); await p.waitForURL(/province=/);
    const kzn = await count();
    await p.locator('label.tab', { hasText: 'Architecture' }).click(); await p.waitForURL(/type=architecture/);
    await p.goBack(); await p.waitForURL(u => !u.search.includes('type='));
    T((await count()) === kzn && (await p.locator('#h-prov').inputValue()) === 'KwaZulu-Natal', tag('houses Back restores province'));
    await p.goBack(); await p.waitForURL(u => !u.search);
    T((await count()) === '83 houses' && !(await p.locator('[data-results]').evaluate(g => g.classList.contains('is-filtered'))), tag('houses Back restores monograph'));

    // Menu (mobile) or desktop nav.
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    if (w < 1080) {
      await p.locator('[data-menu-open]').click();
      T(await vis('[data-menu]'), tag('menu opens'));
      T(await p.evaluate(() => document.activeElement.matches('[data-menu-close]')), tag('menu focuses close'));
      for (let i = 0; i < 20; i++) await p.keyboard.press('Tab');
      T(await p.evaluate(() => !!document.activeElement.closest('[data-menu]')), tag('menu traps focus'));
      T(await p.locator('.menu__list a', { hasText: 'People' }).count() === 1, tag('menu has People'));
      await p.keyboard.press('Escape');
      T(!(await vis('[data-menu]')) && await p.evaluate(() => document.activeElement.matches('[data-menu-open]')), tag('Escape closes menu, focus restored'));
    } else {
      T(await p.locator('.nav__main a', { hasText: 'People' }).isVisible() && await p.locator('.nav__util a', { hasText: 'Contact' }).isVisible(), tag('desktop nav groups'));
    }

    // Lightbox and film on a residence.
    await p.goto(BASE + '/residences/kloof-road-bantry-bay/', { waitUntil: 'networkidle' });
    const opener = p.locator('[data-lightbox="1"]').first();
    await opener.click();
    T(await vis('.lightbox') && (await p.locator('.lightbox__count').textContent()).startsWith('2 of'), tag('lightbox opens at the clicked photo'));
    T(await p.evaluate(() => document.documentElement.classList.contains('is-locked')), tag('body scroll locked'));
    await p.keyboard.press('ArrowRight');
    T((await p.locator('.lightbox__count').textContent()).startsWith('3 of'), tag('arrow key advances'));
    for (let i = 0; i < 6; i++) await p.keyboard.press('Tab');
    T(await p.evaluate(() => !!document.activeElement.closest('.lightbox')), tag('lightbox traps focus'));
    await p.keyboard.press('Escape');
    T(!(await vis('.lightbox')) && await p.evaluate(() => document.activeElement.matches('[data-lightbox="1"]')), tag('Escape closes lightbox, focus restored'));
    // The opening gallery is the only gallery; its control opens the complete set.
    const total = await p.evaluate(() => JSON.parse(document.querySelector('[data-lightbox-data]').textContent).length);
    T(await p.locator('.residence .plates, .mosaic').count() === 0, tag('residence has a single gallery'));
    await p.locator('.res-lead__all').click();
    T((await p.locator('.res-lead__all').textContent()).trim() === `${total} photographs` && (await p.locator('.lightbox__count').textContent()) === `1 of ${total}`, tag('photographs control opens the complete set'));
    await p.keyboard.press('Escape');
    T(!(await vis('.lightbox')) && await p.evaluate(() => document.activeElement.matches('.res-lead__all')), tag('Escape restores focus to the control'));
    // Agent-first actions.
    const primary = await p.locator('.res-head .btn--primary').getAttribute('href');
    const agentMail = await p.locator('.agent [data-agent-email]').first().getAttribute('href');
    T(primary.startsWith('mailto:') && primary.split('?')[0] === agentMail.split('?')[0], tag('Arrange a viewing goes to the listing agent'));
    T(await p.locator('.agent-quick a[href^="tel:"]').count() === 1 && await p.locator('.agent-quick a[href^="mailto:"]').count() === 1, tag('Call and Email agent above the fold'));
    T((await p.locator('.res-head .attribution').textContent()).startsWith('Marketed by'), tag('Marketed by attribution'));
    T(!(await p.locator('.res-listing').evaluate(d => d.open)), tag('listing information collapsed'));
    await p.locator('.res-listing > summary').click();
    T(await p.locator('.res-listing').evaluate(d => d.open), tag('listing information opens'));

    await p.goto(BASE + '/houses/rivers-edge/', { waitUntil: 'networkidle' });
    await p.locator('.film__play').first().click();
    const src = await p.locator('.film iframe').first().getAttribute('src');
    T(src.startsWith('https://www.youtube-nocookie.com/embed/') && !(await p.locator('.film__play').first().isVisible()), tag('film loads youtube-nocookie on click'));

    // Feature a home: composer validation.
    await p.goto(BASE + '/feature-a-home/', { waitUntil: 'networkidle' });
    await p.locator('.compose button[type="submit"]').click();
    T(await p.locator('#c-name').getAttribute('aria-invalid') === 'true' && await vis('#c-name-err'), tag('composer requires a property name'));
    T(await p.evaluate(() => document.activeElement.id === 'c-name'), tag('composer focuses the missing field'));

    // Footer contact channels.
    T(await p.locator('.site-footer a[href^="mailto:"]').count() >= 1 && await p.locator('.site-footer a[href*="instagram.com"]').count() === 1, tag('footer email and Instagram'));
    await ctx.close();
  }
}

// --------------------------------------------------------------- run
const t0 = Date.now();
for (const name of BROWSERS) {
  let browser;
  try { browser = await pw[name].launch(); } catch (e) { results.fail.push(`${name}: could not launch (${String(e).split('\n')[0]})`); continue; }
  console.log(`${name} ${browser.version()}`);
  if (name === 'chromium') {
    const keys = ONLY || Object.keys(ROUTES);
    await sweep(browser, name, WIDTHS, keys);
    await sweep(browser, `${name}-axe`, [390, 1440], keys, { axe: true });
  } else {
    await sweep(browser, name, XB_WIDTHS, ONLY ? XB_PAGES.filter(k => ONLY.includes(k)) : XB_PAGES);
  }
  if (SHOTS && name === 'chromium') await sweep(browser, name, XB_WIDTHS, XB_PAGES); // shots at the cross-browser widths
  await interactions(browser, name);
  await browser.close();
}
console.log(`\n${results.pass} checks passed, ${results.fail.length} failed (${Math.round((Date.now() - t0) / 1000)}s)`);
results.fail.forEach(f => console.log('FAIL ' + f));
process.exitCode = results.fail.length ? 1 : 0;
