// Page templates.
import { u, esc, t, tidy, rand, area, num, monthYear, fullDate, icon, picture, plural, slugify, mailto, tel, wa, group } from './lib.mjs';
import { layout, residenceCard, houseCard, platesIndex, credits, gallery, lightboxData, film, agentCard, ctaBand, placeLine, statusText, priceLine, specLine, creditNames } from './components.mjs';

const featureRoles = f => [['Architecture', f.architect], ['Interiors', f.designer], ['Development', f.developer], ['Construction', f.builder], ['Photography', f.photographer]];

// Film length in minutes from an HH:MM:SS duration (YouTube films only).
const filmMinutes = d => {
  if (typeof d !== 'string') return null;
  const [h, m] = d.split(":").map(Number);
  return Number.isFinite(h + m) ? h * 60 + m : null;
};

// ============================================================ HOME
const pad2 = n => String(n).padStart(2, '0');
const chapter = (no, word, title, id, link) => `<div class="chapter"><p class="chapter__no" aria-hidden="true">${no}<span>${word}</span></p><h2 id="${id}">${t(title)}</h2>${link || ''}</div>`;
const arrowLink = (href, label, cls = 'link-ed') => `<a class="${cls}" href="${u(href)}">${label} ${icon('arrow-right')}</a>`;

// The widest landscape among a record's first photographs: the plate that can carry a large slot.
const bestLandscape = (imgs, n = 4) => imgs.slice(0, n).filter(i => i.orientation === 'landscape').sort((a, b) => b.width - a.width)[0] || imgs[0];

function spreadItem(p, img, sizes) {
  return `<a class="spread__item" href="${u(`/residences/${p.slug}/`)}">
    <div class="spread__media">${picture(img, { sizes, alt: `${p.title}, ${placeLine(p)}` })}</div>
    <div class="spread__text"><p class="meta">${esc(placeLine(p))}</p>
      <h3>${t(p.title)}</h3>
      <div class="status-line"><span class="avail">Available</span><span class="price">${priceLine(p)}</span><span class="specs">${specLine(p)}</span></div></div>
  </a>`;
}

export function home(S) {
  const avail = S.properties.filter(p => p.status === 'for-sale');
  const lead = avail.find(p => p.slug === 'kloof-road-bantry-bay');
  const heroImg = lead.images[0];
  const beach = avail.find(p => p.slug === 'signature-estate-beach-house');
  const hills = avail.find(p => p.slug === 'blue-hills-equestrian-residence');
  const sig = hills;
  const houses = ['kloof-119a', 'oban-house', 'house-vg5', 'victoria-residence', 'cheviots-road-residence']
    .map(s => S.featureBySlug[s]).filter(Boolean);
  const provinces = S.places.slice(0, 3);
  const architectCount = S.creatives.filter(c => c.role === 'architect' && S.creativeUse[c.id]).length;
  const v = S.videos.find(x => x.id === sig.video?.id);
  const mins = filmMinutes(sig.video?.duration);

  const body = `
<section class="cover wrap" aria-labelledby="cover-h">
  <div class="cover__grid">
    <figure class="cover__plate">${picture(heroImg, { eager: true, sizes: '(min-width: 1480px) 1400px, 100vw', alt: `${lead.title}, ${placeLine(lead)}` })}</figure>
    <div class="cover__title">
      <h1 class="cover__h" id="cover-h">${t('South African houses, and the people who make them.')}</h1>
      <p class="cover__sub">${t('Residences for sale, architecture and film, presented with the agents, architects and designers behind each home.')}</p>
      <p class="actions">${arrowLink('/residences/', 'Explore residences')}${arrowLink('/houses/', 'Architecture &amp; design')}</p>
    </div>
    <p class="cover__cap"><span class="rule-mark" aria-hidden="true"></span><a href="${u(`/residences/${lead.slug}/`)}">${t(lead.title)}</a><span>${esc(placeLine(lead))}</span><span>Available, <span class="price">${priceLine(lead)}</span></span></p>
  </div>
  <ul class="masthead" aria-label="The collection">
    <li><a href="${u('/residences/')}"><b>${pad2(avail.length)}</b> Residences available</a></li>
    <li><a href="${u('/architects/')}"><b>${pad2(architectCount)}</b> Architects credited</a></li>
    <li><a href="${u('/houses/')}"><b>${pad2(S.features.length)}</b> Houses</a></li>
    <li><a href="${u('/films/')}"><b>${pad2(S.videos.length)}</b> Films</a></li>
  </ul>
</section>

<section class="section wrap" aria-labelledby="avail-h">
  ${chapter('01', 'Residences', 'Available now', 'avail-h', arrowLink('/residences/', 'All residences'))}
  <div class="spread">
    ${spreadItem(beach, bestLandscape(beach.images), '(min-width: 900px) 56vw, 100vw')}
    ${spreadItem(hills, hills.images[0], '(min-width: 900px) 32vw, 100vw')}
    ${spreadItem(lead, lead.images[1] || lead.images[0], '(min-width: 900px) 58vw, 100vw')}
  </div>
</section>

<section class="section wrap" aria-labelledby="houses-h">
  ${chapter('02', 'Houses', 'Houses and their architects', 'houses-h', arrowLink('/houses/', 'All houses'))}
  <div class="plates-index">${platesIndex(S, houses)}</div>
</section>

<section class="interlude night" aria-labelledby="sig-h">
  <div class="wrap">
    ${chapter('03', 'Films', 'The film', 'films-h', arrowLink('/films/', 'All films'))}
    <div class="interlude__grid">
      <div class="interlude__film">${film(sig.video, sig.images[0], sig.title)}</div>
      <div class="interlude__text">
        <p class="credit-line">${t(`A film by Boitumelo Mokonyane Studio${mins ? `, ${mins} min` : ''}${v?.publishedAt ? `, ${monthYear(v.publishedAt)}` : ''}`)}</p>
        <h2 id="sig-h">${t(sig.title)}</h2>
        <p class="meta">${esc(placeLine(sig))}</p>
        <p class="lede">${t(sig.lede)}</p>
        <p class="actions">${arrowLink(`/residences/${sig.slug}/`, 'View the residence')}</p>
      </div>
    </div>
  </div>
</section>

<section class="statement wrap" aria-label="About the collection">
  <p>${t('A collection of the most exquisite homes, represented by the who’s who in real estate, architecture and design.')}</p>
</section>

<section class="section wrap" aria-labelledby="places-h">
  ${chapter('04', 'Places', 'By place', 'places-h', arrowLink('/places/', 'All places'))}
  <div class="place-tiles">
    ${provinces.map(pl => `<a class="place-tile" href="${u(`/places/${pl.slug}/`)}">
      <div class="place-tile__media">${picture(pl.image, { sizes: '(min-width: 768px) 40vw, 100vw', alt: `${pl.name}` })}</div>
      <h3>${esc(pl.name)}</h3>
      <p class="meta">${pl.cities.slice(0, 4).map(c => esc(c.name)).join(', ')}</p>
    </a>`).join('')}
  </div>
</section>

<section class="section wrap" aria-labelledby="feature-h">
  <div class="invite-band">
    <h2 id="feature-h">Feature a home</h2>
    <div>
      <p>${t('Agents, architects, designers and developers: share your listing, project or design with the Luxury Homes South Africa audience. Every feature credits the people behind the home.')}</p>
      <p>${t('Buying? Each available residence names its listing agent, who arranges viewings directly.')}</p>
      <p class="actions">${arrowLink('/feature-a-home/', 'How to submit')}</p>
    </div>
  </div>
</section>`;
  return layout(S, { path: '/', section: '', body, image: heroImg, preload: heroImg, preloadSizes: '(min-width: 1480px) 1400px, 100vw',
    description: 'Residences for sale, architecture and film from Luxury Homes South Africa, credited to the agents, architects and designers behind each home.',
    jsonld: { '@context': 'https://schema.org', '@type': 'Organization', name: 'Luxury Homes South Africa', url: 'https://www.instagram.com/luxuryhomes_southafrica/', sameAs: [S.business.instagram.url, S.business.youtube.url], email: S.business.contact.email } });
}

// ============================================================ RESIDENCES INDEX
export function residencesIndex(S) {
  const ps = S.properties;
  const prices = ps.map(p => p.priceZAR).filter(Boolean);
  const pmin = Math.floor(Math.min(...prices) / 1e6) * 1e6, pmax = Math.ceil(Math.max(...prices) / 1e6) * 1e6;
  const provinces = [...new Set(ps.map(p => p.province).filter(Boolean))].sort();
  const counts = { 'for-sale': 0, sold: 0, unknown: 0 };
  ps.forEach(p => counts[p.status]++);
  const order = ['for-sale', 'sold', 'unknown'];
  const sorted = [...ps].sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status) || (b.firstPresentedAt > a.firstPresentedAt ? 1 : -1));
  const body = `
<section class="page-head wrap">
  <h1>Residences</h1>
  <p class="lede">${t('Homes presented for sale on Luxury Homes South Africa. Available residences have been checked against the listing agency; sold and archive homes are kept for reference.')}</p>
</section>
<section class="wrap" aria-label="Residences">
  <form class="filters" data-filters role="search" aria-label="Filter residences" data-pmin="${pmin}" data-pmax="${pmax}">
    <div class="tabs" role="radiogroup" aria-label="Availability">
      ${[['for-sale', 'Available'], ['sold', 'Sold'], ['unknown', 'Archive']].map(([v, l], i) => `<label class="tab"><input type="radio" name="status" value="${v}"${i === 0 ? ' checked' : ''}><span>${l} <span class="count">${counts[v]}</span></span></label>`).join('')}
    </div>
    <p class="filters__note" data-status-note></p>
    <details class="refine" open data-refine>
    <summary>Refine</summary>
    <div class="filters__grid">
      <div class="field field--search"><label for="f-q">Search</label><input id="f-q" name="q" type="search" placeholder="Suburb, estate, agent or architect" autocomplete="off"></div>
      <div class="field"><label for="f-prov">Province</label><select id="f-prov" name="province"><option value="">All provinces</option>${provinces.map(p => `<option>${esc(p)}</option>`).join('')}</select></div>
      <div class="field"><label for="f-beds">Bedrooms</label><select id="f-beds" name="beds"><option value="">Any</option>${[3, 4, 5, 6].map(n => `<option value="${n}">${n}+</option>`).join('')}</select></div>
      <div class="field"><label for="f-baths">Bathrooms</label><select id="f-baths" name="baths"><option value="">Any</option>${[3, 4, 5, 6].map(n => `<option value="${n}">${n}+</option>`).join('')}</select></div>
      <div class="field"><label for="f-sort">Sort</label><select id="f-sort" name="sort"><option value="recent">Most recent</option><option value="price-desc">Price, high to low</option><option value="price-asc">Price, low to high</option></select></div>
    </div>
    <fieldset class="price-filter">
      <legend>Price</legend>
      <div class="price__inputs">
        <div class="field"><label for="f-min">Minimum</label><input id="f-min" name="min" inputmode="numeric" placeholder="${rand(pmin).replace(/\u2009/g, ' ')}" autocomplete="off"></div>
        <div class="field"><label for="f-max">Maximum</label><input id="f-max" name="max" inputmode="numeric" placeholder="${rand(pmax).replace(/\u2009/g, ' ')}" autocomplete="off"></div>
      </div>
      <div class="range" data-range>
        <input type="range" min="0" max="100" step="1" value="0" aria-label="Minimum price" data-range-min>
        <input type="range" min="0" max="100" step="1" value="100" aria-label="Maximum price" data-range-max>
        <div class="range__track" aria-hidden="true"><div class="range__fill" data-range-fill></div></div>
      </div>
    </fieldset>
    </details>
    <div class="filters__foot"><p class="result-count" aria-live="polite" data-count></p><button type="reset" class="btn btn--text" data-reset>Clear filters</button></div>
  </form>
  <h2 class="visually-hidden">Results</h2>
  <div class="rgrid" data-results>
    ${sorted.map(p => residenceCard(S, p)).join('')}
  </div>
  <div class="empty" data-empty hidden>
    <h2>No residences match</h2>
    <p>${t('Try a wider price range or fewer filters, or look in the archive.')}</p>
    <button type="button" class="btn btn--secondary" data-reset>Clear filters</button>
  </div>
</section>`;
  return layout(S, { title: 'Residences', path: '/residences/', section: 'residences', body,
    description: `${counts['for-sale']} residences currently available, with sold and archive homes presented by Luxury Homes South Africa.` });
}

// ============================================================ RESIDENCE DETAIL
function particulars(p) {
  const groups = [
    ['Accommodation', [['Bedrooms', num(p.bedrooms)], ['Bathrooms', num(p.bathrooms)], ['Garages', p.garages], ['Parking bays', p.parking], ['Property type', p.propertyType]]],
    ['Land and costs', [['Floor size', area(p.floorSizeM2)], ['Erf size', area(p.erfSizeM2)], ['Rates', p.ratesZAR && `${rand(p.ratesZAR)} per month`], ['Levies', p.leviesZAR && `${rand(p.leviesZAR)} per month`]]],
    ['Location', [['Estate', p.estate], ['Development', p.development], ['Suburb', p.suburb], ['Area', p.area], ['City', p.city], ['Province', p.province]]],
  ].map(([h, rows]) => [h, rows.filter(([, v]) => v != null && v !== '')]).filter(([, rows]) => rows.length);
  return `<div class="register">${groups.map(([h, rows]) => `<section><h3>${h}</h3><dl>${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></section>`).join('')}</div>`;
}

function related(S, p) {
  const pool = S.properties.filter(x => x.slug !== p.slug && (p.status === 'for-sale' ? x.status === 'for-sale' || x.status === 'sold' : x.status === 'for-sale'));
  const score = x => (x.status === 'for-sale' ? 3 : 0) + (x.province === p.province ? 2 : 0) + (x.city === p.city ? 1 : 0);
  return pool.sort((a, b) => score(b) - score(a)).slice(0, 3);
}

function filmSection(S, video, poster, title) {
  if (video?.provider !== 'youtube') return '';
  const v = S.videos.find(x => x.id === video.id);
  const mins = filmMinutes(video.duration);
  return `<section class="section wrap film-section" aria-labelledby="film-h">
    <div class="film-section__media">${film(video, poster, title)}</div>
    <div class="film-section__text"><h2 id="film-h">The film</h2>
      <p class="lede">${t(`A ${mins ? `${mins}-minute ` : ''}walk through the house, published on the Luxury Homes South Africa channel in ${monthYear(video.publishedAt || v?.publishedAt)}.`)}</p>
      <dl class="credits"><div><dt>Produced by</dt><dd><a href="${u('/architects/boitumelo-mokonyane-studio/')}">Boitumelo Mokonyane Studio</a></dd></div></dl></div>
  </section>`;
}

function resLead(p, title) {
  const n = p.images.length;
  const btn = (img, i, sizes, cls = '') => `<button type="button" class="${cls}" data-lightbox="${i}" aria-label="Open photograph ${i + 1} of ${n}">${picture(img, { eager: i === 0, sizes, alt: i === 0 ? `${title}, ${placeLine(p)}` : `${title}, photograph ${i + 1}` })}</button>`;
  const all = n > 1 ? `<button type="button" class="btn btn--secondary res-lead__all" data-lightbox="0">${icon('arrows-out')}${plural(n, 'photograph')}</button>` : '';
  if (p.images[0].orientation === 'portrait') {
    return `<div class="wrap"><div class="res-lead res-lead--triptych">${p.images.slice(0, 3).map((img, i) => btn(img, i, '(min-width: 768px) 33vw, 100vw')).join('')}</div>${all ? `<p class="res-lead__bar">${all}</p>` : ''}</div>`;
  }
  const compact = p.images[0].width < 1100 ? ' res-lead--compact' : '';
  return `<div class="wrap"><div class="res-lead${compact}">${btn(p.images[0], 0, '(min-width: 1080px) 62vw, 100vw', 'res-lead__img')}
    ${n > 1 ? `<div class="res-lead__side">${p.images.slice(1, 3).map((img, i) => btn(img, i + 1, '(min-width: 1080px) 30vw, 50vw')).join('')}</div>` : ''}</div>${all ? `<p class="res-lead__bar">${all}</p>` : ''}</div>`;
}

export function residence(S, p) {
  const title = p.title;
  const agents = p.agentIds.map(id => S.agentById[id]);
  const avail = p.status === 'for-sale';
  const lead = p.images[0];
  const infoSubject = `${tidy(title)}${p.reference ? ` (${p.reference})` : ''}`;
  const archiveAsk = mailto(S.business.contact.generalEmail, `Availability: ${infoSubject}`, `Hello Luxury Homes South Africa,\n\nIs this home still available?\n${tidy(title)}, ${placeLine(p)}\n\n`);
  const primaryAgent = agents[0];
  const creditRows = [['Architecture', p.architect ? [p.architect] : null], ['Interiors', p.interiorDesigner ? [p.interiorDesigner] : null], ['Development', p.developer ? [p.developer] : null]];
  const creditTextRows = [p.architectText && ['Architecture', p.architectText]].filter(Boolean);
  const hasCredits = creditRows.some(([, v]) => v) || creditTextRows.length;
  const features = S.features.filter(f => f.relatedPropertyId === p.id);
  // Drop description paragraphs that restate the lede.
  const words = x => new Set(tidy(x).toLowerCase().match(/[a-z]{4,}/g) || []);
  const overlap = (a, b) => { const A = words(a), B = words(b); let n = 0; A.forEach(w => B.has(w) && n++); return n / Math.max(1, Math.min(A.size, B.size)); };
  const story = p.description.filter(d => !p.lede || overlap(d, p.lede) < 0.55);

  const statusBlock = avail
    ? `<p class="price-lg">${priceLine(p)}</p>`
    : p.status === 'sold'
      ? `<p class="status-lg">Sold</p><p class="muted">${t(`Presented on Luxury Homes South Africa in ${monthYear(p.firstPresentedAt)}${p.priceZAR ? ` at ${rand(p.priceZAR)}` : ''}. This home is no longer on the market.`)}</p>`
      : `<p class="status-lg">Availability not confirmed</p><p class="muted">${t(`Presented on Luxury Homes South Africa in ${monthYear(p.firstPresentedAt)}${p.priceZAR ? ` at ${rand(p.priceZAR)}` : ''}. We could not confirm a current listing, so this home is shown for reference only.`)}</p>`;

  const actions = avail
    ? `<p class="actions">${primaryAgent ? `<a class="btn btn--primary" href="${mailto(primaryAgent.email, `Viewing request: ${infoSubject}`, `Hello ${primaryAgent.name.split(' ')[0]},\n\nI would like to arrange a viewing of ${tidy(title)} (${p.reference}), seen on Luxury Homes South Africa.\n\n`)}">Arrange a viewing</a>` : ''}
        <a class="link-ed" href="#agent">Contact the agent ${icon('arrow-down')}</a></p>`
    : p.status === 'unknown' ? `<p class="actions"><a class="btn btn--secondary" href="${archiveAsk}">Ask about availability</a></p>` : '';

  const body = `
<article class="residence${avail ? '' : ' residence--archive'}">
  ${resLead(p, title)}

  <div class="wrap res-body">
    <header class="res-head">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="${u('/residences/')}">Residences</a>${avail ? '' : ` <span aria-hidden="true">/</span> <span>${p.status === 'sold' ? 'Sold' : 'Archive'}</span>`}</nav>
      <p class="meta">${esc(placeLine(p))}</p>
      <h1>${t(title)}</h1>
      ${statusBlock}
      <p class="specs-lg">${specLine(p)}</p>
      ${actions}
      ${avail && agents.length ? `<p class="attribution">Listing agent: <b>${t(agents.map(a => a.name).join(' and '))}</b>, ${t(p.agency)}</p>` : ''}
    </header>

    <div class="res-story">
      ${p.lede ? `<p class="lede">${t(p.lede)}</p>` : ''}
      ${p.features.length ? `<ul class="highlights" aria-label="Highlights">${p.features.map(f => `<li>${t(f)}</li>`).join('')}</ul>` : ''}
      ${story.length ? `<div class="prose">${story.map(s => `<p>${t(s)}</p>`).join('')}</div>` : ''}
      ${!avail && p.description.length ? `<p class="muted small">${t(`Description as published in ${monthYear(p.firstPresentedAt)}.`)}</p>` : ''}
    </div>

    <section class="res-particulars" aria-labelledby="part-h">
      <h2 id="part-h">${avail ? 'Particulars' : 'Particulars as presented'}</h2>
      ${particulars(p)}
    </section>

    ${hasCredits ? `<section class="res-credits" aria-labelledby="cred-h"><h2 id="cred-h">Design credits</h2>${credits(S, creditRows)}${creditTextRows.map(([k, v]) => `<dl class="credits"><div><dt>${k}</dt><dd>${t(v)}</dd></div></dl>`).join('')}</section>` : ''}

    <details class="disclosure res-listing">
      <summary>Listing information</summary>
      <div class="disclosure__body">
        <dl>
          ${avail ? `<div><dt>Marketed by</dt><dd>${t(p.agency)}</dd></div>
          ${p.reference ? `<div><dt>Agency reference</dt><dd>${esc(p.reference)}</dd></div>` : ''}
          <div><dt>Checked</dt><dd>${t(`Against the agency listing on ${fullDate(p.lastVerifiedAt)}`)}</dd></div>
          <div><dt>Agency listing</dt><dd><a href="${esc(p.sourceListingUrl)}" rel="noopener">${esc(new URL(p.sourceListingUrl).hostname.replace('www.', ''))}</a></dd></div>` : ''}
          ${!avail && (p.agency || p.agentText) ? `<div><dt>As presented</dt><dd>${t(`Marketed by ${[p.agency, p.agentText].filter(Boolean).join(', ')}. That arrangement may no longer apply.`)}</dd></div>` : ''}
          <div><dt>First presented</dt><dd>${monthYear(p.firstPresentedAt)}</dd></div>
          <div><dt>Sources</dt><dd>${p.sourceUrls.map(s => `<a href="${esc(s)}" rel="noopener">${s.includes('instagram') ? `Instagram post${p.instagramPosts.length > 1 ? ` ${p.instagramPosts.indexOf(s.split('/p/')[1].replace('/', '')) + 1}` : ''}` : s.includes('youtube') ? 'YouTube film' : new URL(s).hostname.replace('www.', '')}</a>`).join(', ')}</dd></div>
        </dl>
        ${avail && p.conflicts.length ? `<p>${t('Where Instagram and the agency listing differ, the agency listing is shown.')}</p>` : ''}
      </div>
    </details>
  </div>

  ${filmSection(S, p.video, p.images.find(i => i.orientation === 'landscape' && i.width >= 1000) || p.images[1] || lead, title)}

  <section class="section wrap" aria-label="Photographs">
    ${gallery(p.images, { title, startAt: 3 })}
  </section>

  ${avail && agents.length ? `<section class="section wrap res-agents" id="agent" aria-labelledby="agent-h">
    <h2 id="agent-h" class="subhead">Listing agent${agents.length > 1 ? 's' : ''}</h2>
    <div class="agents">${agents.map(a => agentCard(S, a)).join('')}</div>
    <p class="muted small">${t(`General questions about this home can also go to Luxury Homes South Africa at`)} <a href="${mailto(S.business.contact.generalEmail, infoSubject)}">${S.business.contact.generalEmail}</a>.</p>
  </section>` : ''}

  ${features.length ? `<section class="section wrap"><h2 class="subhead">In the journal</h2><div class="hgrid">${features.map(f => houseCard(S, f)).join('')}</div></section>` : ''}

  <section class="section wrap" aria-labelledby="rel-h">
    <h2 id="rel-h" class="subhead">${avail ? 'Other residences' : 'Available now'}</h2>
    <div class="rgrid">${related(S, p).map(x => residenceCard(S, x)).join('')}</div>
  </section>

  ${lightboxData(p.images, title)}
</article>

${avail ? ctaBand(S, { title: 'Arrange a viewing', text: `${agents.map(a => a.name).join(' and ')} of ${p.agency} ${agents.length > 1 ? 'are' : 'is'} the listing ${agents.length > 1 ? 'agents' : 'agent'} for this home.`,
    primary: primaryAgent ? `<a class="btn btn--primary" href="${tel(primaryAgent.phone)}">Call ${esc(primaryAgent.name.split(' ')[0])}</a>` : '',
    secondary: primaryAgent ? `<a class="btn btn--secondary" href="${mailto(primaryAgent.email, `Viewing request: ${infoSubject}`)}">Email ${esc(primaryAgent.name.split(' ')[0])}</a>` : '' }) : ''}`;
  return layout(S, { title: `${title}${p.city ? `, ${p.city}` : ''}`, path: `/residences/${p.slug}/`, section: 'residences', body, image: lead, preload: lead, preloadSizes: lead.orientation === 'portrait' ? '(min-width: 768px) 33vw, 100vw' : '(min-width: 1080px) 62vw, 100vw',
    description: avail ? `${tidy(p.lede || title)} ${priceLine(p)}.` : `${tidy(title)}, ${placeLine(p)}. ${statusText(p, { long: true })}`,
    jsonld: avail ? { '@context': 'https://schema.org', '@type': 'RealEstateListing', name: tidy(title), url: p.sourceListingUrl,
      offers: { '@type': 'Offer', price: p.priceZAR, priceCurrency: 'ZAR', availability: 'https://schema.org/InStock' } } : null });
}

// ============================================================ HOUSES
export function housesIndex(S) {
  // Lead with strong, high-resolution architecture; recency breaks ties.
  const strength = f => (f.images[0].orientation === 'landscape' ? 1 : 0) + (f.images[0].width >= 800 ? 1 : 0) + (f.architect.length ? 1 : 0);
  const fs = [...S.features].sort((a, b) => strength(b) - strength(a) || (b.publishedAt > a.publishedAt ? 1 : -1));
  const types = [['architecture', 'Architecture'], ['interiors', 'Interiors'], ['property-tour', 'Tours'], ['development', 'In development']].filter(([k]) => fs.some(f => f.type === k));
  const provinces = [...new Set(fs.map(f => f.province).filter(Boolean))].sort();
  const body = `
<section class="page-head wrap">
  <h1>Houses</h1>
  <p class="lede">${t('Architecture, interiors and projects featured by Luxury Homes South Africa, credited to the practices that designed them. These homes are shown for their design and are not offered for sale here.')}</p>
</section>
<section class="wrap">
  <form class="filters filters--compact" data-house-filters aria-label="Filter houses">
    <div class="tabs" role="radiogroup" aria-label="Type">
      <label class="tab"><input type="radio" name="type" value="" checked><span>All <span class="count">${fs.length}</span></span></label>
      ${types.map(([k, l]) => `<label class="tab"><input type="radio" name="type" value="${k}"><span>${l} <span class="count">${fs.filter(f => f.type === k).length}</span></span></label>`).join('')}
    </div>
    <details class="refine--house" data-house-refine>
      <summary>Province and practice</summary>
      <div class="filters__grid filters__grid--2">
        <div class="field"><label for="h-prov">Province</label><select id="h-prov" name="province"><option value="">All provinces</option>${provinces.map(p => `<option>${esc(p)}</option>`).join('')}</select></div>
        <div class="field"><label for="h-arch">Practice</label><select id="h-arch" name="creative"><option value="">All practices</option>${S.creatives.filter(c => S.creativeUse[c.id]?.features).sort((a, b) => a.name.localeCompare(b.name)).map(c => `<option value="${c.id}">${t(c.name)}</option>`).join('')}</select></div>
      </div>
    </details>
    <div class="filters__foot"><p class="result-count" aria-live="polite" data-count></p><button type="reset" class="btn btn--text" data-reset>Clear filters</button></div>
  </form>
  <h2 class="visually-hidden">Results</h2>
  <div class="plates-index" data-results>${platesIndex(S, fs, { index: true, eagerFirst: true })}</div>
  <div class="empty" data-empty hidden><h2>No houses match</h2><button type="button" class="btn btn--secondary" data-reset>Clear filters</button></div>
</section>`;
  return layout(S, { title: 'Houses', path: '/houses/', section: 'houses', body,
    description: `${fs.length} South African houses featured for their architecture and interiors, with full design credits.` });
}

// Opening composition, chosen from the material rather than alternated for variety:
// film-led when the house has a film; image-rich when the lead is a large landscape (>= 1300px, or
// >= 1000px with eight or more photographs);
// landscape monograph for other landscapes; portrait residence for portrait and square leads.
export const houseVariant = f => {
  const lead = f.images[0];
  if (f.video?.provider === 'youtube') return 'film';
  if (lead.orientation === 'landscape' && (lead.width >= 1300 || (lead.width >= 1000 && f.images.length >= 8))) return 'rich';
  if (lead.orientation === 'landscape') return 'landscape';
  return 'portrait';
};

export function house(S, f) {
  const lead = f.images[0];
  const property = f.relatedPropertyId ? S.properties.find(p => p.id === f.relatedPropertyId) : null;
  const sameHands = S.features.filter(x => x.slug !== f.slug && [...x.architect, ...x.designer].some(id => [...f.architect, ...f.designer].includes(id))).slice(0, 3);
  const nearby = S.features.filter(x => x.slug !== f.slug && !sameHands.includes(x) && x.province === f.province).slice(0, 3 - Math.min(3, sameHands.length));
  const more = [...sameHands, ...nearby].slice(0, 3);
  const typeLabel = { architecture: 'Architecture', interiors: 'Interiors', 'property-tour': 'Tour', development: 'In development' }[f.type];
  const variant = houseVariant(f);
  const n = f.images.length;
  const crumbs = `<nav class="crumbs" aria-label="Breadcrumb"><a href="${u('/houses/')}">Houses</a> <span aria-hidden="true">/</span> <span>${typeLabel}</span></nav>`;
  const title = `<h1>${t(f.title)}</h1><p class="house-open__place">${t(f.location)}</p>`;
  const summary = f.summary ? `<p class="lede">${t(f.summary)}</p>` : '';
  const creditBlock = credits(S, featureRoles(f));
  const leadBtn = (sizes, eager = true, cap = false) => `<button type="button" class="house-open__media"${cap ? ` style="max-width:${Math.round(lead.width * 1.3)}px"` : ''} data-lightbox="0" aria-label="Open photograph 1 of ${n}">${picture(lead, { eager, sizes, alt: `${f.title}, ${f.location}` })}</button>`;
  const v = f.video && S.videos.find(x => x.id === f.video.id);
  const mins = filmMinutes(f.video?.duration);
  const poster = f.images.find(i => i.orientation === 'landscape' && i.width >= 1000) || lead;

  let open, galleryStart = 1;
  if (variant === 'film') {
    const portrait = poster.orientation !== 'landscape';
    open = `<header class="night"><div class="wrap house-open house-open--film${portrait ? ' is-portrait' : ''}">
      <div class="house-open__film">${film(f.video, poster, f.title)}</div>
      <div class="house-open__title">${crumbs}<p class="credit-line">${t(`A film by Boitumelo Mokonyane Studio${mins ? `, ${mins} min` : ''}${v?.publishedAt || f.video.publishedAt ? `, ${monthYear(f.video.publishedAt || v.publishedAt)}` : ''}`)}</p>${title}${summary}${creditBlock}</div>
    </div></header>`;
    galleryStart = 0;
  } else if (variant === 'rich') {
    open = `<header class="wrap house-open house-open--rich">
      ${leadBtn('(min-width: 1480px) 1400px, 100vw', true, true)}
      <div class="house-open__title">${crumbs}${title}${summary}</div>
      <dl class="house-index">
        ${featureRoles(f).filter(([, ids]) => ids.length).slice(0, 3).map(([label, ids]) => `<div><dt>${label}</dt><dd>${ids.map(id => { const c = S.creativeById[id]; return c ? `<a href="${u(`/architects/${c.id}/`)}">${t(c.name)}</a>` : t(id); }).join(', ')}</dd></div>`).join('')}
        <div><dt>Photographs</dt><dd>${n}</dd></div>
        <div><dt>First featured</dt><dd>${monthYear(f.publishedAt)}</dd></div>
      </dl>
    </header>`;
  } else if (variant === 'landscape') {
    open = `<header class="wrap house-open house-open--landscape">
      ${leadBtn('(min-width: 900px) 64vw, 100vw')}
      <div class="house-open__aside">${crumbs}${creditBlock}</div>
      <div class="house-open__title">${title}${summary}</div>
    </header>`;
  } else {
    open = `<header class="wrap house-open house-open--portrait">
      ${leadBtn('(min-width: 900px) 40vw, 100vw')}
      <div class="house-open__title">${crumbs}${title}${summary}${creditBlock}</div>
    </header>`;
  }
  // Photography follows the opening; long source text sits after the first plates, never before them.
  const firstRun = 4;
  const body = `
<article class="house house--${variant}">
  ${open}
  <section class="section wrap" aria-label="Photographs">${gallery(f.images, { title: f.title, startAt: galleryStart, limit: firstRun })}</section>
  ${f.story.length || property ? `<div class="wrap house-story">
    ${f.story.length ? `<div class="prose">${f.story.map(p => `<p>${t(p)}</p>`).join('')}</div>` : ''}
    ${property ? `<p class="note">${t(property.status === 'sold' ? 'This house was later sold.' : 'This house was also presented for sale.')} <a href="${u(`/residences/${property.slug}/`)}">See the residence record</a>.</p>` : ''}
  </div>` : ''}
  ${n > galleryStart + firstRun ? `<section class="wrap" aria-label="More photographs">${gallery(f.images, { title: f.title, startAt: galleryStart + firstRun })}</section>` : ''}
  <div class="wrap">
    <details class="disclosure">
      <summary>Source and credits</summary>
      <div class="disclosure__body">
        <dl>
          ${featureRoles(f).filter(([, ids]) => ids.length).map(([label, ids]) => `<div><dt>${label}</dt><dd>${ids.map(id => { const c = S.creativeById[id]; return c ? `<a href="${u(`/architects/${c.id}/`)}">${t(c.name)}</a>` : t(id); }).join(', ')}</dd></div>`).join('')}
          ${f.video ? `<div><dt>Film</dt><dd><a href="${u('/architects/boitumelo-mokonyane-studio/')}">Boitumelo Mokonyane Studio</a></dd></div>` : ''}
          <div><dt>First featured</dt><dd>${monthYear(f.publishedAt)}</dd></div>
          <div><dt>Sources</dt><dd>${f.sourceUrls.map((s, i) => `<a href="${esc(s)}" rel="noopener">${s.includes('youtube') ? 'YouTube film' : `Instagram post${f.instagramPosts.length > 1 ? ` ${i + 1}` : ''}`}</a>`).join(', ')}</dd></div>
        </dl>
      </div>
    </details>
  </div>
  ${more.length ? `<section class="section wrap"><h2 class="subhead">${sameHands.length === more.length ? 'By the same hands' : sameHands.length ? 'By the same hands, and nearby' : 'Nearby'}</h2><div class="hgrid">${more.map(x => houseCard(S, x)).join('')}</div></section>` : ''}
  ${lightboxData(f.images, f.title)}
</article>`;
  const preload = variant === 'film' ? null : lead;
  return layout(S, { title: `${f.title}, ${f.location}`, path: `/houses/${f.slug}/`, section: 'houses', body, image: lead, preload,
    preloadSizes: { rich: '(min-width: 1480px) 1400px, 100vw', landscape: '(min-width: 900px) 64vw, 100vw', portrait: '(min-width: 900px) 40vw, 100vw' }[variant],
    description: `${tidy(f.title)}, ${tidy(f.location)}. ${creditNames(S, f.architect).length ? `Architecture by ${creditNames(S, f.architect).join(' and ')}.` : ''}` });
}

// ============================================================ FILMS
export function films(S) {
  const vids = [...S.videos].sort((a, b) => (b.publishedAt > a.publishedAt ? 1 : -1));
  const info = v => {
    const rec = v.property ? S.bySlug[v.property] : S.featureBySlug[v.feature];
    const href = v.property ? `/residences/${v.property}/` : `/houses/${v.feature}/`;
    const title = tidy(v.title.replace(/\s*\|\s*Luxury House Tour\s*$/i, ''));
    const status = v.property ? (rec.status === 'for-sale' ? 'Available' : rec.status === 'sold' ? 'Sold' : 'Availability not confirmed') : 'Featured house';
    const mins = filmMinutes(v.duration);
    const meta = `${monthYear(v.publishedAt)}${mins ? `, ${mins} min` : ''}`;
    const statusHtml = v.property && rec.status === 'for-sale' ? '<span class="avail">Available</span>' : esc(status);
    return { rec, href, title, meta, statusHtml, place: v.property ? placeLine(rec) : rec.location };
  };
  const [first, ...rest] = vids;
  const a = info(first);
  const leadPoster = a.rec.images.find(i => i.orientation === 'landscape' && i.width >= 1000) || a.rec.images.find(i => i.orientation === 'landscape') || a.rec.images[0];
  const cards = rest.map(v => {
    const x = info(v);
    const poster = x.rec.images.find(i => i.orientation === 'landscape') || x.rec.images[0];
    return `<article class="film-card">
      ${film({ provider: 'youtube', id: v.id, url: v.url, duration: v.duration }, poster, x.title)}
      <p class="credit-line">${esc(x.meta)}</p>
      <h3><a href="${u(x.href)}">${t(x.rec.title)}</a></h3>
      <p class="film-card__status">${x.statusHtml}</p>
    </article>`;
  }).join('');
  const body = `
<section class="page-head wrap">
  <h1>Films</h1>
  <p class="lede">${t('Full-length house tours from the Luxury Homes South Africa channel, produced by Boitumelo Mokonyane Studio.')}</p>
</section>
<div class="night films-night">
  <section class="wrap film-lead" aria-labelledby="film-lead-h">
    ${film({ provider: 'youtube', id: first.id, url: first.url, duration: first.duration }, leadPoster, a.title)}
    <div class="film-lead__text">
      <p class="credit-line">${esc(a.meta)}</p>
      <h2 id="film-lead-h"><a href="${u(a.href)}">${t(a.rec.title)}</a></h2>
      <p class="meta">${esc(a.place)}</p>
      <p class="film-card__status">${a.statusHtml}</p>
    </div>
  </section>
</div>
<section class="wrap films" aria-label="More films">${cards}</section>`;
  return layout(S, { title: 'Films', path: '/films/', section: 'films', body, description: 'Full-length South African house tours from the Luxury Homes South Africa YouTube channel.' });
}

// ============================================================ ARCHITECTS
const ROLE_LABEL = { architect: 'Architects', 'interior-designer': 'Interior designers', developer: 'Developers', builder: 'Builders', photographer: 'Photographers', 'film-producer': 'Film' };

export function architectsIndex(S) {
  const used = S.creatives.filter(c => S.creativeUse[c.id]);
  const groups = Object.keys(ROLE_LABEL).map(r => [r, used.filter(c => c.role === r).sort((a, b) => S.creativeUse[b.id].total - S.creativeUse[a.id].total || a.name.localeCompare(b.name))]).filter(([, cs]) => cs.length);
  // Introduction: the three most represented architecture practices, each shown through one of their houses.
  const top = used.filter(c => c.role === 'architect').sort((a, b) => S.creativeUse[b.id].total - S.creativeUse[a.id].total || a.name.localeCompare(b.name)).slice(0, 3)
    .map(c => ({ c, f: S.features.filter(f => f.architect.includes(c.id)).sort((a, b) => b.images[0].width - a.images[0].width)[0] })).filter(x => x.f);
  const body = `
<section class="page-head wrap">
  <h1>Architects and designers</h1>
  <p class="lede">${t('Every practice credited on a house or residence in the collection. Credits come from the captions and films in which each home was presented.')}</p>
</section>
<section class="wrap" aria-label="Most represented practices">
  <div class="practice-row">
    ${top.map(({ c, f }) => `<a class="practice" href="${u(`/architects/${c.id}/`)}">
      <div class="practice__media">${picture(f.images[0], { sizes: '(min-width: 768px) 40vw, 100vw', alt: `${f.title}, by ${c.name}` })}</div>
      <h2>${t(c.name)}</h2>
      <p class="meta">${plural(S.creativeUse[c.id].total, 'home')} in the collection, including ${t(f.title)}</p>
    </a>`).join('')}
  </div>
</section>
<section class="wrap">
  ${groups.map(([r, cs]) => `<section class="index-group" aria-labelledby="g-${r}"><h2 id="g-${r}">${ROLE_LABEL[r]} <span class="count">${cs.length}</span></h2>
    <ul class="index-list">${cs.map(c => `<li><a href="${u(`/architects/${c.id}/`)}"><span class="index-list__name">${t(c.name)}</span><span class="index-list__n">${plural(S.creativeUse[c.id].total, 'home')}</span></a></li>`).join('')}</ul></section>`).join('')}
</section>`;
  return layout(S, { title: 'Architects and designers', path: '/architects/', section: 'architects', body, description: 'South African architects, interior designers and developers credited in the Luxury Homes South Africa collection.' });
}

export function architect(S, c) {
  const fs = S.features.filter(f => [f.architect, f.designer, f.developer, f.builder, f.photographer].flat().includes(c.id));
  const ps = S.properties.filter(p => [p.architect, p.interiorDesigner, p.developer].includes(c.id));
  const roleWord = { architect: 'Architecture practice', 'interior-designer': 'Interior design', developer: 'Developer', builder: 'Construction', photographer: 'Photography', 'film-producer': 'Film production' }[c.role];
  const body = `
<section class="page-head wrap">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="${u('/architects/')}">Architects and designers</a></nav>
  <h1>${t(c.name)}</h1>
  <p class="meta">${roleWord}, ${plural(fs.length + ps.length, 'home')} in the collection</p>
  <p class="links">${c.instagram ? `<a href="https://www.instagram.com/${esc(c.instagram)}/" rel="noopener">${icon('instagram-logo')}@${esc(c.instagram)}</a>` : ''}${c.website ? `<a href="${esc(c.website)}" rel="noopener">${icon('arrow-up-right')}${esc(c.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''))}</a>` : ''}</p>
</section>
<section class="wrap">
  ${fs.length ? `<h2 class="visually-hidden">Houses</h2>${fs.length >= 4 ? `<div class="plates-index">${platesIndex(S, fs, { eagerFirst: true })}</div>` : `<div class="hgrid">${fs.map((f, i) => houseCard(S, f, { eager: i === 0 })).join('')}</div>`}` : ''}
  ${ps.length ? `<h2 class="subhead">Residences</h2><div class="rgrid">${ps.map(p => residenceCard(S, p)).join('')}</div>` : ''}
  ${c.id === 'boitumelo-mokonyane-studio' ? `<p class="lede lede--spaced">${t('Producer of the Luxury Homes South Africa house tour films.')} <a href="${u('/films/')}">See the films</a>.</p>` : ''}
</section>`;
  return layout(S, { title: c.name, path: `/architects/${c.id}/`, section: 'architects', body, image: fs[0]?.images[0] || ps[0]?.images[0],
    description: `${tidy(c.name)}: homes credited in the Luxury Homes South Africa collection.` });
}

// ============================================================ PLACES
export function placesIndex(S) {
  const body = `
<section class="page-head wrap">
  <h1>Places</h1>
  <p class="lede">${t('Houses and residences in the collection, by province and city.')}</p>
</section>
<section class="wrap places">
  ${S.places.map((pl, i) => {
    const size = pl.houses.length + pl.residences.length;
    const cls = size < 8 ? ' place--minor' : i % 2 ? ' place--alt' : '';
    return `<section class="place${cls}" aria-labelledby="pl-${pl.slug}">
    <a class="place__media" href="${u(`/places/${pl.slug}/`)}" tabindex="-1" aria-hidden="true">${picture(pl.image, { sizes: '(min-width: 900px) 58vw, 100vw', alt: '' })}</a>
    <div class="place__text">
      <h2 id="pl-${pl.slug}"><a href="${u(`/places/${pl.slug}/`)}">${esc(pl.name)}</a></h2>
      <p class="place__counts"><span><b>${pl.houses.length}</b>${pl.houses.length === 1 ? 'House' : 'Houses'}</span><span><b>${pl.residences.length}</b>${pl.residences.length === 1 ? 'Residence' : 'Residences'}</span>${pl.available ? `<span><b>${pl.available}</b>Available</span>` : ''}</p>
      <ul class="city-list">${pl.cities.map(c => `<li><a href="${u(`/places/${pl.slug}/#${c.slug}`)}">${esc(c.name)} <span class="count">${c.houses.length + c.residences.length}</span></a></li>`).join('')}</ul>
    </div>
  </section>`;
  }).join('')}
</section>`;
  return layout(S, { title: 'Places', path: '/places/', section: 'places', body, description: 'South African houses and residences by province and city.' });
}

export function place(S, pl) {
  const body = `
<section class="page-head wrap">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="${u('/places/')}">Places</a></nav>
  <h1>${esc(pl.name)}</h1>
  <nav class="jump" aria-label="Cities"><ul>${pl.cities.map(c => `<li><a href="#${c.slug}">${esc(c.name)}</a></li>`).join('')}</ul></nav>
</section>
<section class="wrap">
  ${pl.cities.map(c => `<section class="city" id="${c.slug}" aria-labelledby="c-${c.slug}">
    <h2 id="c-${c.slug}">${esc(c.name)}</h2>
    ${c.residences.filter(p => p.status === 'for-sale').length ? `<h3 class="subhead">Available residences</h3><div class="rgrid">${c.residences.filter(p => p.status === 'for-sale').map(p => residenceCard(S, p)).join('')}</div>` : ''}
    ${c.houses.length ? `<h3 class="subhead">Houses</h3>${c.houses.length >= 4 ? `<div class="plates-index">${platesIndex(S, c.houses)}</div>` : `<div class="hgrid">${c.houses.map(f => houseCard(S, f)).join('')}</div>`}` : ''}
    ${c.residences.filter(p => p.status !== 'for-sale').length ? `<details class="archive"><summary>Sold and archive residences <span class="count">${c.residences.filter(p => p.status !== 'for-sale').length}</span></summary><div class="rgrid">${c.residences.filter(p => p.status !== 'for-sale').map(p => residenceCard(S, p)).join('')}</div></details>` : ''}
  </section>`).join('')}
</section>`;
  return layout(S, { title: pl.name, path: `/places/${pl.slug}/`, section: 'places', body, image: pl.image, description: `Houses and residences in ${pl.name}.` });
}

// ============================================================ FEATURE A HOME
export function featureHome(S) {
  const c = S.business.contact;
  const f = [...S.features].filter(x => x.slug !== 'kloof-119a' && x.images[0].orientation === 'landscape').sort((a, b) => b.images[0].width - a.images[0].width)[0];
  const body = `
<section class="wrap invite">
  ${f ? `<figure class="invite__media">${picture(f.images[0], { sizes: '(min-width: 900px) 40vw, 100vw', alt: `${f.title}, ${f.location}` })}<figcaption><a href="${u(`/houses/${f.slug}/`)}">${t(f.title)}</a>${creditNames(S, f.architect).length ? `, architecture by ${t(creditNames(S, f.architect).join(' with '))}` : ''}</figcaption></figure>` : ''}
  <div class="invite__text">
    <h1>Feature a home</h1>
    <p class="lede">${t('Luxury Homes South Africa features listings, projects and designs from agents, architects, interior designers and developers across South Africa.')}</p>
    <p>${t('Features appear on Instagram, and selected homes are filmed as full-length tours for YouTube. Every feature credits the people behind the home.')}</p>

    <h2>What to send</h2>
    <ul class="requirements">
      <li><b>The home</b><span>The property or project name, and where it is</span></li>
      <li><b>The credits</b><span>Who designed it: architect, interior designer, developer</span></li>
      <li><b>For listings</b><span>The listing agent, agency and asking price, with a link to the listing</span></li>
      <li><b>The imagery</b><span>Photography, and video if you have it, with the photographer’s name</span></li>
    </ul>

    <h2>Get in touch</h2>
    <p class="actions actions--flush"><a class="btn btn--primary" href="${mailto(c.email, 'Feature request')}">Email ${c.email}</a><a class="link-ed" href="${wa(c.phoneHref, 'Hello Luxury Homes South Africa, I would like to feature a home.')}" rel="noopener">WhatsApp ${c.phone} ${icon('arrow-right')}</a></p>

    <h2 id="compose-h">Or prepare the email here</h2>
    <form class="compose" data-compose novalidate data-to="${c.email}" aria-labelledby="compose-h">
      <p class="muted small">This fills in an email in your own mail app. Nothing is sent from this page.</p>
      <div class="field"><label for="c-role">You are</label><select id="c-role" name="role"><option>An estate agent</option><option>An architect</option><option>An interior designer</option><option>A developer</option><option>A homeowner</option></select></div>
      <div class="field"><label for="c-name">Property or project</label><input id="c-name" name="property" required autocomplete="off" aria-describedby="c-name-err"><p class="field__error" id="c-name-err" hidden>Add the property or project name.</p></div>
      <div class="field"><label for="c-loc">Location</label><input id="c-loc" name="location" autocomplete="off"></div>
      <div class="field"><label for="c-credits">Architect, designer or agent</label><input id="c-credits" name="credits" autocomplete="off"></div>
      <div class="field"><label for="c-price">Asking price, if for sale</label><input id="c-price" name="price" inputmode="numeric" autocomplete="off"></div>
      <div class="field"><label for="c-link">Listing or project link</label><input id="c-link" name="link" type="url" placeholder="https://" autocomplete="off"></div>
      <button class="btn btn--secondary" type="submit">Open in email</button>
    </form>
  </div>
</section>`;
  return layout(S, { title: 'Feature a home', path: '/feature-a-home/', section: 'feature', body, description: 'How agents, architects, designers and developers can feature a home with Luxury Homes South Africa.' });
}

// ============================================================ ABOUT
export function about(S) {
  const b = S.business;
  const img = S.featureBySlug['kloof-119a']?.images[0];
  const body = `
<section class="page-head wrap">
  <h1>About</h1>
</section>
<section class="wrap about">
  <div class="about__text">
    <p class="lede">${t('Luxury Homes South Africa presents the country’s most exquisite homes, and credits the agents, architects and designers behind them.')}</p>
    <div class="prose">
      <p>${t(`It began on Instagram, where the collection has grown to more than ${Math.floor(b.instagram.followers / 1000)} 000 followers, and continues on YouTube, where full-length house tours have been published since ${new Date(b.youtube.joined).getFullYear()}.`)}</p>
      <p>${t('The collection covers homes on the market, recently completed houses, interiors and projects still in development, from the Atlantic Seaboard and the Winelands to Sandton, Pretoria and the KwaZulu-Natal north coast.')}</p>
      <p>${t('Luxury Homes South Africa is not an estate agency. Homes that are for sale are marketed by the agencies named on each listing, and enquiries about them go to those agents.')}</p>
    </div>
    <dl class="credits credits--about">
      <div><dt>Founder</dt><dd><a href="https://www.instagram.com/mbuyelo_rathidili/" rel="noopener">Mbuyelo Rathidili</a></dd></div>
      <div><dt>Films produced by</dt><dd><a href="${u('/architects/boitumelo-mokonyane-studio/')}">Boitumelo Mokonyane Studio</a></dd></div>
    </dl>
    <p class="actions"><a class="link-ed" href="${b.instagram.url}" rel="noopener">Instagram ${icon('arrow-up-right')}</a><a class="link-ed" href="${b.youtube.url}" rel="noopener">YouTube ${icon('arrow-up-right')}</a></p>
  </div>
  ${img ? `<figure class="about__media">${picture(img, { sizes: '(min-width: 1080px) 45vw, 100vw', alt: 'Kloof 119A, Cape Town, by SAOTA' })}<figcaption><a href="${u('/houses/kloof-119a/')}">Kloof 119A</a>, SAOTA with ARRCC and OKHA</figcaption></figure>` : ''}
</section>`;
  return layout(S, { title: 'About', path: '/about/', section: '', body, description: 'About Luxury Homes South Africa.' });
}

// ============================================================ CONTACT
export function contact(S) {
  const c = S.business.contact;
  const avail = S.properties.filter(p => p.status === 'for-sale');
  const body = `
<section class="page-head wrap">
  <h1>Contact</h1>
</section>
<section class="wrap contact-grid">
  <section aria-labelledby="ct-buy"><h2 id="ct-buy">Buying a residence</h2>
    <p>${t('Contact the listing agent named on each residence. They handle viewings, offers and particulars.')}</p>
    <ul class="agent-index">${avail.map(p => `<li><a href="${u(`/residences/${p.slug}/`)}">${t(p.title)}</a><span class="muted">${p.agentIds.map(id => S.agentById[id].name).join(', ')}, ${t(p.agency)}</span></li>`).join('')}</ul>
  </section>
  <section aria-labelledby="ct-info"><h2 id="ct-info">Property information</h2>
    <p><a class="big-link" href="${mailto(c.generalEmail, 'Property information')}">${c.generalEmail}</a></p>
  </section>
  <section aria-labelledby="ct-feat"><h2 id="ct-feat">Features and collaboration</h2>
    <p><a class="big-link" href="${mailto(c.email, 'Feature enquiry')}">${c.email}</a></p>
    <p><a href="${wa(c.phoneHref)}" rel="noopener">${icon('whatsapp-logo')}WhatsApp ${c.phone}</a><br><a href="${tel(c.phoneHref)}">${icon('phone')}Call ${c.phone}</a></p>
    <p><a href="${u('/feature-a-home/')}">What to send</a></p>
  </section>
</section>`;
  return layout(S, { title: 'Contact', path: '/contact/', section: 'contact', body, description: 'Contact Luxury Homes South Africa.' });
}

export function notFound(S) {
  const body = `<section class="wrap notfound"><h1>This page is not here</h1><p class="lede">${t('It may have moved, or the home may no longer be in the collection.')}</p><p class="actions"><a class="link-ed" href="${u('/residences/')}">Explore residences ${icon('arrow-right')}</a><a class="link-ed" href="${u('/houses/')}">Browse houses ${icon('arrow-right')}</a></p></section>`;
  return layout(S, { title: 'Page not found', path: '/404.html', body });
}
