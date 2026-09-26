// Page templates.
import { u, esc, t, tidy, rand, area, num, monthYear, fullDate, icon, picture, plural, slugify, mailto, tel, wa, group } from './lib.mjs';
import { layout, residenceCard, houseCard, credits, gallery, lightboxData, film, agentCard, ctaBand, placeLine, statusText, priceLine, specLine, creditNames } from './components.mjs';

const featureRoles = f => [['Architecture', f.architect], ['Interiors', f.designer], ['Development', f.developer], ['Construction', f.builder], ['Photography', f.photographer]];

// ============================================================ HOME
export function home(S) {
  const avail = S.properties.filter(p => p.status === 'for-sale');
  const lead = avail.find(p => p.slug === 'kloof-road-bantry-bay');
  const heroImg = lead.images[0];
  const cardLead = avail.find(p => p.slug === 'signature-estate-beach-house');
  const others = avail.filter(p => p !== cardLead);
  const sig = S.bySlug['blue-hills-equestrian-residence'];
  const houses = ['kloof-119a', 'house-vg5', 'oban-house', 'victoria-residence', 'cheviots-road-residence', 'umhlanga-forest-house', 'house-thibault', 'steyn-city-house-b']
    .map(s => S.featureBySlug[s]).filter(Boolean);
  const provinces = S.places.slice(0, 3);
  const architectCount = S.creatives.filter(c => c.role === 'architect' && S.creativeUse[c.id]).length;

  const body = `
<section class="hero">
  <div class="hero__text">
    <h1 class="display">${t('South African houses, and the people who make them.')}</h1>
    <p class="hero__sub">${t('Residences for sale, architecture and film, presented with the agents, architects and designers behind each home.')}</p>
    <p class="actions"><a class="btn btn--primary" href="${u('/residences/')}">Explore residences</a><a class="btn btn--secondary" href="${u('/houses/')}">Browse houses</a></p>
  </div>
  <figure class="hero__media">${picture(heroImg, { eager: true, sizes: '(min-width: 1080px) 60vw, 100vw', alt: `${lead.title}, ${placeLine(lead)}` })}
    <figcaption><a href="${u(`/residences/${lead.slug}/`)}">${t(lead.title)}</a>, available</figcaption></figure>
</section>

<section class="section" aria-labelledby="avail-h">
  <div class="wrap">
    <div class="section-head"><h2 id="avail-h">Available now</h2><a class="link-arrow" href="${u('/residences/')}">All residences ${icon('arrow-right')}</a></div>
    <div class="avail-grid">
      ${residenceCard(S, cardLead, { lead: true, sizes: '(min-width: 1080px) 60vw, 100vw' })}
      ${others.map(p => residenceCard(S, p, { sizes: '(min-width: 1080px) 30vw, (min-width: 768px) 50vw, 100vw', imageIndex: p === lead ? 1 : 0 })).join('')}
    </div>
  </div>
</section>

<section class="section statement">
  <div class="wrap statement__inner">
    <p class="statement__text">${t('The most exquisite homes in South Africa, and the who’s who of real estate, architecture and design behind them. From homes on the market to the projects shaping how the country lives.')}</p>
    <dl class="figures">
      <div><dt>Residences available now</dt><dd><a href="${u('/residences/')}">${avail.length}</a></dd></div>
      <div><dt>Architects credited</dt><dd><a href="${u('/architects/')}">${architectCount}</a></dd></div>
      <div><dt>Films</dt><dd><a href="${u('/films/')}">${S.videos.length}</a></dd></div>
    </dl>
  </div>
</section>

<section class="section signature" aria-labelledby="sig-h">
  <div class="wrap">
    <div class="signature__grid">
      <div class="signature__film">${film(sig.video, sig.images[0], sig.title)}</div>
      <div class="signature__text">
        <h2 id="sig-h">${t(sig.title)}</h2>
        <p class="meta">${esc(placeLine(sig))}</p>
        <p class="lede">${t(sig.lede)}</p>
        <p class="signature__price">${priceLine(sig)}</p>
        <p class="rcard__specs">${specLine(sig)}</p>
        <p class="actions"><a class="btn btn--secondary" href="${u(`/residences/${sig.slug}/`)}">View residence</a></p>
      </div>
    </div>
  </div>
</section>

<section class="section rail-section" aria-labelledby="houses-h">
  <div class="wrap section-head"><h2 id="houses-h">Houses and their architects</h2>
    <div class="rail-controls"><button type="button" class="icon-btn" data-rail-prev aria-label="Previous houses" aria-controls="rail">${icon('arrow-left')}</button><button type="button" class="icon-btn" data-rail-next aria-label="Next houses" aria-controls="rail">${icon('arrow-right')}</button><a class="link-arrow" href="${u('/houses/')}">All houses ${icon('arrow-right')}</a></div></div>
  <div class="rail" id="rail" tabindex="0" role="region" aria-label="Selected houses. Use arrow keys to scroll">
    ${houses.map(f => houseCard(S, f, { sizes: '(min-width: 1080px) 28vw, 80vw' })).join('')}
  </div>
</section>

<section class="section places-home" aria-labelledby="places-h">
  <div class="wrap">
    <h2 id="places-h">By place</h2>
    <div class="place-tiles">
      ${provinces.map(pl => `<a class="place-tile" href="${u(`/places/${pl.slug}/`)}">
        <div class="place-tile__media">${picture(pl.image, { sizes: '(min-width: 768px) 33vw, 100vw', alt: `${pl.name}` })}</div>
        <h3>${esc(pl.name)}</h3>
        <p class="meta">${pl.cities.slice(0, 4).map(c => esc(c.name)).join(', ')}</p>
      </a>`).join('')}
    </div>
    <p><a class="link-arrow" href="${u('/places/')}">All places ${icon('arrow-right')}</a></p>
  </div>
</section>

${ctaBand(S, { title: 'Feature a home', text: 'Agents, architects, designers and developers: share your listing, project or design with the Luxury Homes South Africa audience.',
    primary: `<a class="btn btn--primary" href="${u('/feature-a-home/')}">How to submit</a>` })}

<section class="section closing" aria-labelledby="close-h">
  <div class="wrap closing__grid">
    <h2 id="close-h">Contact</h2>
    <div><h3>Buying</h3><p>${t('Each available residence names its listing agent. Contact them directly from the residence page to arrange a viewing.')}</p></div>
    <div><h3>Features and collaboration</h3><p><a href="${mailto(S.business.contact.email, 'Feature enquiry')}">${S.business.contact.email}</a><br><a href="${wa(S.business.contact.phoneHref)}" rel="noopener">WhatsApp ${S.business.contact.phone}</a></p></div>
  </div>
</section>`;
  return layout(S, { path: '/', section: '', body, image: heroImg, preload: heroImg,
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
    <fieldset class="price">
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
  const mins = video.duration ? Number(video.duration.split(':')[0]) * 60 + Number(video.duration.split(':')[1]) : null;
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
        <a class="btn btn--secondary" href="#agent">Contact the agent</a></p>`
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
      ${avail ? `<p class="verify">${icon('arrow-up-right')}<span>${t(`Listed with ${p.agency}${p.reference ? `, reference ${p.reference}` : ''}. Checked against the agency listing on ${fullDate(p.lastVerifiedAt)}.`)} <a href="${esc(p.sourceListingUrl)}" rel="noopener">View agency listing</a></span></p>` : ''}
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
      ${avail && p.conflicts.length ? `<p class="muted small">${t('Where Instagram and the agency listing differ, the agency listing is shown.')}</p>` : ''}
    </section>

    ${hasCredits ? `<section class="res-credits" aria-labelledby="cred-h"><h2 id="cred-h">Design credits</h2>${credits(S, creditRows)}${creditTextRows.map(([k, v]) => `<dl class="credits"><div><dt>${k}</dt><dd>${t(v)}</dd></div></dl>`).join('')}</section>` : ''}
  </div>

  ${filmSection(S, p.video, p.images.find(i => i.orientation === 'landscape' && i.width >= 1000) || p.images[1] || lead, title)}

  <section class="section wrap" aria-label="Photographs">
    ${gallery(p.images, { title, startAt: 3 })}
  </section>

  ${avail && agents.length ? `<section class="section wrap res-agents" id="agent" aria-labelledby="agent-h">
    <h2 id="agent-h">Listing agent${agents.length > 1 ? 's' : ''}</h2>
    <div class="agents">${agents.map(a => agentCard(S, a)).join('')}</div>
    <p class="muted small">${t(`General questions about this home can also go to Luxury Homes South Africa at`)} <a href="${mailto(S.business.contact.generalEmail, infoSubject)}">${S.business.contact.generalEmail}</a>.</p>
  </section>` : ''}
  ${!avail && (p.agency || p.agentText) ? `<section class="section wrap small muted"><p>${t(`As presented, this home was marketed by ${[p.agency, p.agentText].filter(Boolean).join(', ')}. That arrangement may no longer apply.`)}</p></section>` : ''}

  ${features.length ? `<section class="section wrap"><h2>In the journal</h2><div class="hgrid">${features.map(f => houseCard(S, f)).join('')}</div></section>` : ''}

  <section class="section wrap" aria-labelledby="rel-h">
    <h2 id="rel-h">${avail ? 'Other residences' : 'Available now'}</h2>
    <div class="rgrid">${related(S, p).map(x => residenceCard(S, x)).join('')}</div>
  </section>

  <section class="wrap sources small muted"><p>Sources: ${p.sourceUrls.map((s, i) => `<a href="${esc(s)}" rel="noopener">${s.includes('instagram') ? `Instagram post${p.instagramPosts.length > 1 ? ` ${p.instagramPosts.indexOf(s.split('/p/')[1].replace('/', '')) + 1}` : ''}` : s.includes('youtube') ? 'YouTube film' : new URL(s).hostname.replace('www.', '')}</a>`).join(', ')}</p></section>
  ${lightboxData(p.images, title)}
</article>

${avail ? ctaBand(S, { title: 'Arrange a viewing', text: `${agents.map(a => a.name).join(' and ')} of ${p.agency} ${agents.length > 1 ? 'are' : 'is'} the listing ${agents.length > 1 ? 'agents' : 'agent'} for this home.`,
    primary: primaryAgent ? `<a class="btn btn--primary" href="${tel(primaryAgent.phone)}">Call ${esc(primaryAgent.name.split(' ')[0])}</a>` : '',
    secondary: primaryAgent ? `<a class="btn btn--secondary" href="${mailto(primaryAgent.email, `Viewing request: ${infoSubject}`)}">Email ${esc(primaryAgent.name.split(' ')[0])}</a>` : '' }) : ''}`;
  return layout(S, { title: `${title}${p.city ? `, ${p.city}` : ''}`, path: `/residences/${p.slug}/`, section: 'residences', body, image: lead, preload: lead,
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
    <div class="filters__grid filters__grid--2">
      <div class="field"><label for="h-prov">Province</label><select id="h-prov" name="province"><option value="">All provinces</option>${provinces.map(p => `<option>${esc(p)}</option>`).join('')}</select></div>
      <div class="field"><label for="h-arch">Practice</label><select id="h-arch" name="creative"><option value="">All practices</option>${S.creatives.filter(c => S.creativeUse[c.id]?.features).sort((a, b) => a.name.localeCompare(b.name)).map(c => `<option value="${c.id}">${t(c.name)}</option>`).join('')}</select></div>
    </div>
    <div class="filters__foot"><p class="result-count" aria-live="polite" data-count></p><button type="reset" class="btn btn--text" data-reset>Clear filters</button></div>
  </form>
  <h2 class="visually-hidden">Results</h2>
  <div class="hgrid" data-results>${fs.map((f, i) => houseCard(S, f, { eager: i < 2 })).join('')}</div>
  <div class="empty" data-empty hidden><h2>No houses match</h2><button type="button" class="btn btn--secondary" data-reset>Clear filters</button></div>
</section>`;
  return layout(S, { title: 'Houses', path: '/houses/', section: 'houses', body,
    description: `${fs.length} South African houses featured for their architecture and interiors, with full design credits.` });
}

export function house(S, f) {
  const lead = f.images[0];
  const property = f.relatedPropertyId ? S.properties.find(p => p.id === f.relatedPropertyId) : null;
  const sameHands = S.features.filter(x => x.slug !== f.slug && [...x.architect, ...x.designer].some(id => [...f.architect, ...f.designer].includes(id))).slice(0, 3);
  const nearby = S.features.filter(x => x.slug !== f.slug && !sameHands.includes(x) && x.province === f.province).slice(0, 3 - Math.min(3, sameHands.length) + 0);
  const more = [...sameHands, ...nearby].slice(0, 3);
  const typeLabel = { architecture: 'Architecture', interiors: 'Interiors', 'property-tour': 'Tour', development: 'In development' }[f.type];
  const body = `
<article class="house">
  <header class="wrap house-head${lead.orientation === 'portrait' ? ' house-head--portrait' : ''}">
    <button type="button" class="house-head__media" data-lightbox="0" aria-label="Open photograph 1 of ${f.images.length}">${picture(lead, { eager: true, sizes: '(min-width: 1080px) 58vw, 100vw', alt: `${f.title}, ${f.location}` })}</button>
    <div class="house-head__text">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="${u('/houses/')}">Houses</a> <span aria-hidden="true">/</span> <span>${typeLabel}</span></nav>
      <h1>${t(f.title)}</h1>
      <p class="meta">${t(f.location)}</p>
      ${credits(S, featureRoles(f))}
    </div>
  </header>
  <div class="wrap house-body">
    ${f.summary ? `<p class="lede">${t(f.summary)}</p>` : ''}
    ${f.story.length ? `<div class="prose">${f.story.map(s => `<p>${t(s)}</p>`).join('')}</div>` : ''}
    ${property ? `<p class="note">${t(property.status === 'sold' ? `This house was later sold.` : `This house was also presented for sale.`)} <a href="${u(`/residences/${property.slug}/`)}">See the residence record</a>.</p>` : ''}
  </div>
  ${filmSection(S, f.video, f.images.find(i => i.orientation === 'landscape' && i.width >= 1000) || f.images[1] || lead, f.title)}
  <section class="section wrap" aria-label="Photographs">${gallery(f.images, { title: f.title, startAt: 1 })}</section>
  <section class="wrap sources small muted"><p>First featured ${monthYear(f.publishedAt)}. Source: ${f.sourceUrls.map((s, i) => `<a href="${esc(s)}" rel="noopener">${s.includes('youtube') ? 'YouTube film' : `Instagram post${f.instagramPosts.length > 1 ? ` ${i + 1}` : ''}`}</a>`).join(', ')}.</p></section>
  ${more.length ? `<section class="section wrap"><h2>${sameHands.length ? 'By the same hands' : 'Nearby'}</h2><div class="hgrid">${more.map(x => houseCard(S, x)).join('')}</div></section>` : ''}
  ${lightboxData(f.images, f.title)}
</article>`;
  return layout(S, { title: `${f.title}, ${f.location}`, path: `/houses/${f.slug}/`, section: 'houses', body, image: lead, preload: lead,
    description: `${tidy(f.title)}, ${tidy(f.location)}. ${creditNames(S, f.architect).length ? `Architecture by ${creditNames(S, f.architect).join(' and ')}.` : ''}` });
}

// ============================================================ FILMS
export function films(S) {
  const vids = [...S.videos].sort((a, b) => (b.publishedAt > a.publishedAt ? 1 : -1));
  const rows = vids.map(v => {
    const rec = v.property ? S.bySlug[v.property] : S.featureBySlug[v.feature];
    const href = v.property ? `/residences/${v.property}/` : `/houses/${v.feature}/`;
    const title = tidy(v.title.replace(/\s*\|\s*Luxury House Tour\s*$/i, ''));
    const poster = rec.images.find(i => i.orientation === 'landscape') || rec.images[0];
    const status = v.property ? (rec.status === 'for-sale' ? 'Available' : rec.status === 'sold' ? 'Sold' : 'Availability not confirmed') : 'Featured house';
    return `<article class="film-card">
      ${film({ provider: 'youtube', id: v.id, url: v.url, duration: v.duration }, poster, title)}
      <p class="meta">${monthYear(v.publishedAt)}</p>
      <h2><a href="${u(href)}">${t(rec.title)}</a></h2>
      <p class="film-card__status status--${v.property ? rec.status : 'feature'}">${v.property && rec.status === 'for-sale' ? '<span class="avail">Available</span>' : esc(status)}</p>
    </article>`;
  }).join('');
  const body = `
<section class="page-head wrap">
  <h1>Films</h1>
  <p class="lede">${t(`Full-length house tours from the Luxury Homes South Africa channel, produced by Boitumelo Mokonyane Studio.`)}</p>
</section>
<section class="wrap films" aria-label="Films">${rows}</section>`;
  return layout(S, { title: 'Films', path: '/films/', section: 'films', body, description: 'Full-length South African house tours from the Luxury Homes South Africa YouTube channel.' });
}

// ============================================================ ARCHITECTS
const ROLE_LABEL = { architect: 'Architects', 'interior-designer': 'Interior designers', developer: 'Developers', builder: 'Builders', photographer: 'Photographers', 'film-producer': 'Film' };

export function architectsIndex(S) {
  const used = S.creatives.filter(c => S.creativeUse[c.id]);
  const groups = Object.keys(ROLE_LABEL).map(r => [r, used.filter(c => c.role === r).sort((a, b) => S.creativeUse[b.id].total - S.creativeUse[a.id].total || a.name.localeCompare(b.name))]).filter(([, cs]) => cs.length);
  const body = `
<section class="page-head wrap">
  <h1>Architects and designers</h1>
  <p class="lede">${t('Every practice credited on a house or residence in the collection. Credits come from the captions and films in which each home was presented.')}</p>
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
  <p class="meta">${roleWord}</p>
  <p class="links">${c.instagram ? `<a href="https://www.instagram.com/${esc(c.instagram)}/" rel="noopener">${icon('instagram-logo')}@${esc(c.instagram)}</a>` : ''}${c.website ? `<a href="${esc(c.website)}" rel="noopener">${icon('arrow-up-right')}${esc(c.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''))}</a>` : ''}</p>
</section>
<section class="wrap">
  ${fs.length ? `<h2 class="visually-hidden">Houses</h2><div class="hgrid">${fs.map((f, i) => houseCard(S, f, { eager: i < 2 })).join('')}</div>` : ''}
  ${ps.length ? `<h2 class="subhead">Residences</h2><div class="rgrid">${ps.map(p => residenceCard(S, p)).join('')}</div>` : ''}
  ${c.id === 'boitumelo-mokonyane-studio' ? `<p class="lede">${t('Producer of the Luxury Homes South Africa house tour films.')} <a href="${u('/films/')}">See the films</a>.</p>` : ''}
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
  ${S.places.map((pl, i) => `<section class="place${i % 2 ? ' place--alt' : ''}" aria-labelledby="pl-${pl.slug}">
    <a class="place__media" href="${u(`/places/${pl.slug}/`)}" tabindex="-1" aria-hidden="true">${picture(pl.image, { sizes: '(min-width: 1080px) 50vw, 100vw', alt: '' })}</a>
    <div class="place__text">
      <h2 id="pl-${pl.slug}"><a href="${u(`/places/${pl.slug}/`)}">${esc(pl.name)}</a></h2>
      <p class="meta">${plural(pl.houses.length, 'house')}, ${plural(pl.residences.length, 'residence')}${pl.available ? `, ${pl.available} available` : ''}</p>
      <ul class="city-list">${pl.cities.map(c => `<li><a href="${u(`/places/${pl.slug}/#${c.slug}`)}">${esc(c.name)} <span class="count">${c.houses.length + c.residences.length}</span></a></li>`).join('')}</ul>
    </div>
  </section>`).join('')}
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
    ${c.houses.length ? `<h3 class="subhead">Houses</h3><div class="hgrid">${c.houses.map(f => houseCard(S, f)).join('')}</div>` : ''}
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
<section class="page-head wrap">
  <h1>Feature a home</h1>
  <p class="lede">${t('Luxury Homes South Africa features listings, projects and designs from agents, architects, interior designers and developers across South Africa.')}</p>
</section>
<section class="wrap feature-grid">
  <div class="feature-grid__text">
    <h2>What to send</h2>
    <ul class="checklist">
      <li>The property or project name, and where it is</li>
      <li>Who designed it: architect, interior designer, developer</li>
      <li>For listings: the listing agent, agency and asking price, with a link to the listing</li>
      <li>Photography, and video if you have it, with the photographer’s name</li>
    </ul>
    <p>${t('Features appear on Instagram, and selected homes are filmed as full-length tours for YouTube. Every feature credits the people behind the home.')}</p>
    <h2>Get in touch</h2>
    <p class="actions"><a class="btn btn--primary" href="${mailto(c.email, 'Feature request')}">${icon('envelope-simple')}Email ${c.email}</a><a class="btn btn--secondary" href="${wa(c.phoneHref, 'Hello Luxury Homes South Africa, I would like to feature a home.')}" rel="noopener">${icon('whatsapp-logo')}WhatsApp</a></p>
    <p class="muted small">Call or WhatsApp ${c.phone}.</p>
  </div>
  <form class="compose" data-compose novalidate data-to="${c.email}" aria-labelledby="compose-h">
    <h2 id="compose-h">Prepare an email</h2>
    <p class="muted small">This fills in an email in your own mail app. Nothing is sent from this page.</p>
    <div class="field"><label for="c-role">You are</label><select id="c-role" name="role"><option>An estate agent</option><option>An architect</option><option>An interior designer</option><option>A developer</option><option>A homeowner</option></select></div>
    <div class="field"><label for="c-name">Property or project</label><input id="c-name" name="property" required autocomplete="off" aria-describedby="c-name-err"><p class="field__error" id="c-name-err" hidden>Add the property or project name.</p></div>
    <div class="field"><label for="c-loc">Location</label><input id="c-loc" name="location" autocomplete="off"></div>
    <div class="field"><label for="c-credits">Architect, designer or agent</label><input id="c-credits" name="credits" autocomplete="off"></div>
    <div class="field"><label for="c-price">Asking price, if for sale</label><input id="c-price" name="price" inputmode="numeric" autocomplete="off"></div>
    <div class="field"><label for="c-link">Listing or project link</label><input id="c-link" name="link" type="url" placeholder="https://" autocomplete="off"></div>
    <button class="btn btn--primary" type="submit">Open in email</button>
  </form>
</section>
${f ? `<section class="section wrap"><figure class="wide-plate" style="max-width:${f.images[0].width}px">${picture(f.images[0], { sizes: '100vw', alt: `${f.title}, ${f.location}` })}<figcaption><a href="${u(`/houses/${f.slug}/`)}">${t(f.title)}</a>${creditNames(S, f.architect).length ? `, ${t(creditNames(S, f.architect).join(' with '))}` : ''}</figcaption></figure></section>` : ''}`;
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
    <p class="actions"><a class="btn btn--secondary" href="${b.instagram.url}" rel="noopener">${icon('instagram-logo')}Instagram</a><a class="btn btn--secondary" href="${b.youtube.url}" rel="noopener">${icon('youtube-logo')}YouTube</a></p>
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
  const body = `<section class="wrap notfound"><h1>This page is not here</h1><p class="lede">${t('It may have moved, or the home may no longer be in the collection.')}</p><p class="actions"><a class="btn btn--primary" href="${u('/residences/')}">Explore residences</a><a class="btn btn--secondary" href="${u('/houses/')}">Browse houses</a></p></section>`;
  return layout(S, { title: 'Page not found', path: '/404.html', body });
}
