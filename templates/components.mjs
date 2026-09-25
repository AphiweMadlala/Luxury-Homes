// Reusable page components.
import { u, esc, t, tidy, rand, area, num, monthYear, fullDate, icon, picture, plural, PROPOSAL_MODE, SITE_URL, mailto, tel, wa } from './lib.mjs';

export const NAV = [
  ['residences', 'Residences', '/residences/'],
  ['houses', 'Houses', '/houses/'],
  ['films', 'Films', '/films/'],
  ['architects', 'Architects', '/architects/'],
  ['places', 'Places', '/places/'],
  ['feature', 'Feature a home', '/feature-a-home/'],
];

// Interim rendering of the brand's two-slab mark: graphite and grey slabs, champagne serif L and H.
const mark = () => `<svg class="mark" viewBox="0 0 32 40" aria-hidden="true" focusable="false">
  <rect x="0" y="0" width="15" height="40" class="mark-a"/><rect x="17" y="0" width="15" height="40" class="mark-b"/>
  <text x="7.5" y="34" class="mark-t">L</text><text x="24.5" y="34" class="mark-t">H</text></svg>`;
const wordmark = () => `${mark()}<span class="brand__word"><span class="brand__lh">Luxury Homes</span><span class="brand__sa">South Africa</span></span>`;

export function layout(S, { title, description, path, section = '', body, image, preload, preloadSizes = '100vw', jsonld }) {
  const b = S.business;
  const fullTitle = title ? `${tidy(title)} | Luxury Homes South Africa` : 'Luxury Homes South Africa | Houses, residences and the people who design them';
  const canonical = SITE_URL.replace(/\/$/, '') + path;
  return `<!doctype html>
<html lang="en-ZA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(tidy(description || b.channelDescription.split('\n')[0]))}">
${PROPOSAL_MODE ? '<meta name="robots" content="noindex, nofollow">\n' : ''}<link rel="canonical" href="${esc(canonical)}">
<meta name="color-scheme" content="light">
<meta name="theme-color" content="#EEECE7">
<meta property="og:site_name" content="Luxury Homes South Africa">
<meta property="og:title" content="${esc(tidy(title || 'Luxury Homes South Africa'))}">
<meta property="og:type" content="website">
${image ? `<meta property="og:image" content="${esc(SITE_URL.replace(/\/$/, '') + u(image.variants.find(v => v.width >= 1080)?.path || image.variants.at(-1).path))}">\n` : ''}<link rel="icon" href="${u('favicon.svg')}" type="image/svg+xml">
<link rel="preload" href="${u('fonts/libre-caslon-display.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${u('fonts/schibsted-grotesk.woff2')}" as="font" type="font/woff2" crossorigin>
${preload ? `<link rel="preload" as="image" imagesrcset="${preload.variants.map(v => `${u(v.path)} ${v.width}w`).join(', ')}" imagesizes="${preloadSizes}" fetchpriority="high">\n` : ''}<link rel="stylesheet" href="${u('assets/site.css')}?v=${S.version}">
<script src="${u('assets/site.js')}?v=${S.version}" defer></script>
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>\n` : ''}</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${header(section)}
<main id="main" tabindex="-1">
${body}
</main>
${footer(S)}
<template id="icon-x">${icon('x')}</template><template id="icon-arrow-left">${icon('arrow-left')}</template><template id="icon-arrow-right">${icon('arrow-right')}</template>
</body>
</html>`;
}

function header(section) {
  const links = NAV.map(([k, label, href]) => `<li><a href="${u(href)}"${k === section ? ' aria-current="page"' : ''}>${label}</a></li>`).join('');
  return `<header class="site-header" data-header>
  <div class="site-header__inner">
    <a class="brand" href="${u('/')}" aria-label="Luxury Homes South Africa, home">${wordmark()}</a>
    <nav class="nav" aria-label="Primary"><ul>${links}<li><a class="nav__contact" href="${u('/contact/')}"${section === 'contact' ? ' aria-current="page"' : ''}>Contact</a></li></ul></nav>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" data-menu-open>${icon('list')}<span>Menu</span></button>
  </div>
  <div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu" hidden data-menu>
    <div class="menu__top"><a class="brand" href="${u('/')}" aria-label="Luxury Homes South Africa, home">${wordmark()}</a>
      <button class="icon-btn" type="button" data-menu-close aria-label="Close menu">${icon('x')}</button></div>
    <ul class="menu__list">${links}<li><a href="${u('/contact/')}">Contact</a></li><li><a href="${u('/about/')}">About</a></li></ul>
  </div>
</header>`;
}

function footer(S) {
  const c = S.business.contact;
  return `<footer class="site-footer night">
  <div class="wrap">
    <p class="footer-word" aria-hidden="true"><span>Luxury Homes</span><span>South Africa</span></p>
    <div class="footer-grid">
      <div>
        <p>${t('A collection of the most exquisite homes, represented by the who’s who in real estate, architecture and design.')}</p>
      </div>
      <nav class="footer-nav" aria-label="Footer">
        <ul>${NAV.map(([, l, h]) => `<li><a href="${u(h)}">${l}</a></li>`).join('')}<li><a href="${u('/about/')}">About</a></li><li><a href="${u('/contact/')}">Contact</a></li></ul>
      </nav>
      <div class="footer-contact">
        <p><a href="${mailto(c.email, 'Luxury Homes South Africa')}">${c.email}</a></p>
        <p><a href="${wa(c.phoneHref)}" rel="noopener">WhatsApp ${c.phone}</a></p>
        <p class="footer-social"><a href="${S.business.instagram.url}" rel="noopener">${icon('instagram-logo')}Instagram</a><a href="${S.business.youtube.url}" rel="noopener">${icon('youtube-logo')}YouTube</a></p>
      </div>
    </div>
    <div class="footer-legal">
      <p>Luxury Homes South Africa is not an estate agency. Homes listed for sale are marketed by the agencies named on each listing. Particulars are as published by the listing agency and may change; confirm all details with the agent.</p>
      <p>Contact addresses operated by Cacoon Group.</p>
    </div>
  </div>
</footer>`;
}

// ------------------------------------------------------------ residences
export const placeLine = p => [p.estate || p.suburb || p.development || p.area, p.city, p.province].filter((x, i, a) => x && a.indexOf(x) === i).slice(0, 2).join(', ');

export function statusText(p, { long = false } = {}) {
  if (p.status === 'for-sale') return 'Available';
  if (p.status === 'under-offer') return 'Under offer';
  if (p.status === 'sold') return 'Sold';
  return long ? `Availability not confirmed. Presented ${monthYear(p.firstPresentedAt)}.` : `Not confirmed, presented ${new Date(p.firstPresentedAt).getFullYear()}`;
}

export function priceLine(p) {
  if (p.status === 'for-sale') return p.priceZAR ? rand(p.priceZAR) : p.priceOnApplication ? 'Price on application' : 'Price on request';
  if (p.status === 'sold') return p.priceZAR ? `Sold, presented at ${rand(p.priceZAR)}` : 'Sold';
  return p.priceZAR ? `Presented at ${rand(p.priceZAR)}` : p.priceOnApplication ? 'Presented POA' : '';
}

export function specLine(p) {
  return [p.bedrooms && `${num(p.bedrooms)} bed`, p.bathrooms && `${num(p.bathrooms)} bath`, p.floorSizeM2 && area(p.floorSizeM2), !p.floorSizeM2 && p.erfSizeM2 && `${area(p.erfSizeM2)} erf`]
    .filter(Boolean).map(esc).join('<span class="sep" aria-hidden="true"> / </span>');
}

export function residenceCard(S, p, { sizes = '(min-width: 1080px) 33vw, (min-width: 768px) 50vw, 100vw', lead = false, imageIndex = 0 } = {}) {
  const img = p.images[imageIndex] || p.images[0];
  const search = [p.title, p.reference, p.city, p.suburb, p.estate, p.area, p.province, p.agency, p.agentText,
    ...p.agentIds.map(id => S.agentById[id]?.name), S.creativeById[p.architect]?.name, p.architectText].filter(Boolean).join(' ').toLowerCase();
  return `<article class="rcard${lead ? ' rcard--lead' : ''}" data-residence data-status="${p.status}" data-price="${p.priceZAR ?? ''}" data-beds="${p.bedrooms ?? ''}" data-baths="${p.bathrooms ?? ''}" data-province="${esc(p.province || '')}" data-date="${p.firstPresentedAt}" data-search="${esc(tidy(search))}">
  <a class="rcard__link" href="${u(`/residences/${p.slug}/`)}">
    <div class="rcard__media">${picture(img, { sizes, alt: `${p.title}, ${placeLine(p)}` })}</div>
    <p class="meta">${esc(placeLine(p))}</p>
    <h3 class="rcard__title">${t(p.title)}</h3>
    <p class="rcard__status status status--${p.status}">${p.status === 'for-sale' ? `<span class="avail">Available</span><span class="rcard__price">${priceLine(p)}</span>` : `<span>${esc(statusText(p))}</span>${priceLine(p) ? `<span class="muted"> / ${priceLine(p).replace(/^Sold, /, '')}</span>` : ''}`}</p>
    <p class="rcard__specs">${specLine(p)}</p>
  </a>
</article>`;
}

// ------------------------------------------------------------ houses
export const creditNames = (S, ids) => ids.map(id => S.creativeById[id]?.name).filter(Boolean);

// A house is a plate with a caption: image, name, place, and the practice that made it.
export function houseCaption(S, f) {
  const who = creditNames(S, f.architect.length ? f.architect : f.designer);
  const role = f.architect.length ? 'Architecture by' : f.designer.length ? 'Interiors by' : '';
  const place = f.city || f.location;
  return `<p class="hplate__cap"><span class="rule-mark" aria-hidden="true"></span><span>${t(place)}</span>${who.length ? `<span class="hplate__credit"><span class="sep" aria-hidden="true">·</span>${role} <b>${t(who.join(' with '))}</b></span>` : ''}</p>`;
}

export function houseCard(S, f, { sizes = '(min-width: 1080px) 33vw, (min-width: 768px) 50vw, 100vw', eager = false, cls = '', index = false, img } = {}) {
  const lead = img || f.images[0];
  const attrs = index ? ` data-house data-type="${f.type}" data-province="${esc(f.province || '')}" data-creatives="${[...f.architect, ...f.designer, ...f.developer, ...f.builder, ...f.photographer].join(' ')}"` : '';
  return `<article class="hplate${cls ? ` ${cls}` : ''}"${attrs}>
  <a href="${u(`/houses/${f.slug}/`)}">
    <div class="hplate__media">${picture(lead, { sizes, alt: `${f.title}, ${f.location}`, eager })}</div>
    <div class="hplate__text"><h3 class="hplate__title">${t(f.title)}</h3>
    ${houseCaption(S, f)}</div>
  </a>
</article>`;
}

// Deterministic plate composition. Rows follow a fixed cycle (7/5, 4/4/4, 5/7, 4/4/4, one 9-column
// plate); each slot takes the first house within a short look-ahead whose lead image suits it, so
// large slots only ever receive sources wide enough to fill them. Mobile alternates full, half, half.
const ROWS = [['w7', 'p5'], ['s4', 's4', 's4'], ['p5', 'w7'], ['s4', 's4', 's4'], ['x9']];
const fits = {
  w7: i => i.orientation === 'landscape' && i.width >= 800,
  x9: i => i.orientation === 'landscape' && i.width >= 1300,
  p5: i => i.orientation !== 'landscape',
  s4: () => true,
};
const SIZES = {
  w7: '(min-width: 900px) 56vw, 100vw', p5: '(min-width: 900px) 40vw, 100vw',
  s4: '(min-width: 900px) 32vw, 50vw', x9: '(min-width: 900px) 72vw, 100vw',
};
export function composePlates(list) {
  const queue = [...list];
  const out = [];
  let r = 0;
  while (queue.length) {
    let row = ROWS[r % ROWS.length]; r++;
    if (row[0] === 'x9' && !queue.slice(0, 8).some(f => fits.x9(f.images[0]))) continue;
    if (queue.length < row.length) row = queue.length === 1 ? ['s4'] : ['w7', 'p5'].slice(0, queue.length);
    row.forEach((slot, k) => {
      if (!queue.length) return;
      let at = queue.slice(0, 8).findIndex(f => fits[slot](f.images[0]));
      if (at < 0) at = 0;
      const [f] = queue.splice(at, 1);
      out.push({ f, slot, lead: k === 0 });
    });
  }
  // mobile rhythm: full, half, half; never leave a single half at the end
  return out.map((x, i) => ({ ...x, half: i % 3 !== 0 && !(i % 3 === 1 && i === out.length - 1) }));
}

export function platesIndex(S, list, { index = false, eagerFirst = false } = {}) {
  return composePlates(list).map(({ f, slot, lead, half }, i) => houseCard(S, f, {
    sizes: SIZES[slot], eager: eagerFirst && i === 0, index,
    cls: [`p-${slot}`, lead && 'p-lead', f.images[0].orientation === 'portrait' && 'p-portrait', half && 'm-half'].filter(Boolean).join(' '),
  })).join('');
}

export function credits(S, rows) {
  const items = rows.filter(([, ids]) => ids && ids.length);
  if (!items.length) return '';
  return `<dl class="credits">${items.map(([label, ids]) => `<div><dt>${label}</dt><dd>${ids.map(id => {
    const c = S.creativeById[id];
    return c ? `<a href="${u(`/architects/${c.id}/`)}">${t(c.name)}</a>` : t(id);
  }).join('<br>')}</dd></div>`).join('')}</dl>`;
}

// ------------------------------------------------------------ media
export function gallery(images, { title, startAt = 0, sizesLead = '100vw', limit } = {}) {
  const imgs = images.slice(startAt, limit ? startAt + limit : undefined);
  if (!imgs.length) return '';
  const big = x => x.orientation === 'landscape' && x.width >= 1100;
  const blocks = [];
  for (let i = 0; i < imgs.length;) {
    const a = imgs[i];
    if (a.orientation === 'portrait') {
      const run = [a]; while (run.length < 3 && imgs[i + run.length]?.orientation === 'portrait') run.push(imgs[i + run.length]);
      blocks.push(run); i += run.length;
    } else if (big(a) && (blocks.length % 3 === 0 || !imgs[i + 1])) { blocks.push([a]); i += 1; }
    else if (imgs[i + 1] && imgs[i + 1].orientation !== 'portrait') { blocks.push([a, imgs[i + 1]]); i += 2; }
    else { blocks.push([a]); i += 1; }
  }
  // Never end on a lone small image: fold it into the previous row.
  const last = blocks.at(-1), prev = blocks.at(-2);
  if (last && prev && last.length === 1 && !big(last[0]) && prev.length === 2 && prev.every(x => x.orientation === last[0].orientation)) { prev.push(last[0]); blocks.pop(); }
  let n = startAt, pairs = 0, singles = 0;
  const stills = imgs.some(i => i.role !== 'photograph');
  const rowClass = b => {
    if (b.length === 1) return `plates__row--1${b[0].orientation === 'landscape' && singles++ % 2 ? ' plates__row--offset' : ''}`;
    if (b.length === 2 && b.every(x => x.orientation === 'landscape')) return pairs++ % 2 ? 'plates__row--57' : 'plates__row--75';
    return `plates__row--${b.length}${b.length > 1 && b.every(x => x.orientation === 'landscape') ? ' plates__row--even' : ''}`;
  };
  const sizes = k => (k === 1 ? sizesLead : k === 2 ? '(min-width: 768px) 58vw, 100vw' : '(min-width: 768px) 33vw, 50vw');
  return `${stills ? '<p class="plates__note">Includes stills from the Luxury Homes South Africa film.</p>' : ''}<div class="plates" data-gallery>${blocks.map(b => `<div class="plates__row ${rowClass(b)}">${b.map(img => {
    const idx = n++;
    return `<figure class="plate plate--${img.orientation}"${b.length === 1 ? ` style="max-width:${img.width}px"` : ''}><button type="button" class="plate__btn" data-lightbox="${idx}" aria-label="Open photograph ${idx + 1} of ${images.length}">${picture(img, { sizes: sizes(b.length), alt: `${title}, photograph ${idx + 1}` })}</button></figure>`;
  }).join('')}</div>`).join('')}</div>`;
}

export function lightboxData(images, title) {
  return `<script type="application/json" data-lightbox-data>${JSON.stringify(images.map((img, i) => ({
    srcset: img.variants.map(v => `${u(v.path)} ${v.width}w`).join(', '),
    src: u((img.variants.find(v => v.width >= 1080) || img.variants.at(-1)).path),
    w: img.width, h: img.height, alt: tidy(`${title}, photograph ${i + 1}`),
  }))).replace(/</g, '\\u003c')}</script>`;
}

export function film(video, poster, title) {
  if (!video || video.provider !== 'youtube') return '';
  const mins = video.duration ? video.duration.replace(/^00:/, '').replace(/^0/, '').split(':') : null;
  const len = mins ? `${mins[0]} min` : '';
  return `<div class="film${poster?.orientation === 'portrait' ? ' film--portrait' : ''}" data-film data-id="${esc(video.id)}" data-title="${esc(tidy(title))}">
  <div class="film__poster">${picture(poster, { sizes: '(min-width: 1080px) 70vw, 100vw', alt: '' })}</div>
  <button class="film__play" type="button" aria-label="Play the film: ${esc(tidy(title))}">${icon('play')}<span>Play the film${len ? ` <span class="muted">${len}</span>` : ''}</span></button>
  <p class="film__alt"><a href="${esc(video.url)}" rel="noopener">Watch on YouTube</a></p>
</div>`;
}

export function agentCard(S, a) {
  return `<div class="agent">
  <p class="meta">${t(a.agency)}</p>
  <h3>${t(a.name)}</h3>
  <p class="muted">${t(a.role)}</p>
  <ul class="agent__links">
    <li><a href="${tel(a.phone)}">${icon('phone')}${esc(a.phone)}</a></li>
    <li><a href="${mailto(a.email, 'Enquiry')}" data-agent-email>${icon('envelope-simple')}${esc(a.email)}</a></li>
  </ul>
</div>`;
}

export const ctaBand = (S, { title, text, primary, secondary }) => `<section class="band">
  <div class="wrap band__inner">
    <h2>${t(title)}</h2>
    ${text ? `<p class="lede">${t(text)}</p>` : ''}
    <p class="actions">${primary}${secondary || ''}</p>
  </div>
</section>`;

export { mailto, tel, wa, plural, fullDate, monthYear };
