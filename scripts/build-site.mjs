// Static site build: data/*.json + templates/ -> dist/
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { slugify, BASE, PROPOSAL_MODE, SITE_URL } from '../templates/lib.mjs';
import * as P from '../templates/pages.mjs';

const ROOT = new URL('../', import.meta.url).pathname;
const DIST = ROOT + 'dist/';
const read = f => JSON.parse(readFileSync(ROOT + 'data/' + f));

const properties = read('properties.json');
const features = read('features.json');
const creatives = read('creatives.json');
const agents = read('agents.json');
const business = read('business.json');
const videos = read('video-manifest.json');

// usage counts for creatives
const creativeUse = {};
const bump = (id, k) => { if (!id) return; creativeUse[id] ??= { features: 0, properties: 0, total: 0 }; creativeUse[id][k]++; creativeUse[id].total++; };
features.forEach(f => new Set([f.architect, f.designer, f.developer, f.builder, f.photographer].flat()).forEach(id => bump(id, 'features')));
properties.forEach(p => new Set([p.architect, p.interiorDesigner, p.developer]).forEach(id => bump(id, 'properties')));
bump('boitumelo-mokonyane-studio', 'features');

// places: province -> city. Hand-picked exteriors for the three main provinces.
const PLACE_IMAGE = { Gauteng: 'sandton-stacked-boxes', 'Western Cape': 'city-villa-arrcc', 'KwaZulu-Natal': 'villa-de-la-reserve' };
const provMap = new Map();
const add = (prov, city, kind, rec) => {
  if (!prov) return;
  if (!provMap.has(prov)) provMap.set(prov, { name: prov, slug: slugify(prov), cities: new Map(), houses: [], residences: [] });
  const pl = provMap.get(prov);
  pl[kind].push(rec);
  const cname = city || `Elsewhere in ${prov}`;
  if (!pl.cities.has(cname)) pl.cities.set(cname, { name: cname, slug: slugify(cname), houses: [], residences: [] });
  pl.cities.get(cname)[kind].push(rec);
};
features.forEach(f => add(f.province, f.city, 'houses', f));
properties.forEach(p => add(p.province, p.city, 'residences', p));
const places = [...provMap.values()].map(pl => {
  const cities = [...pl.cities.values()].sort((a, b) => (b.houses.length + b.residences.length) - (a.houses.length + a.residences.length));
  const avail = pl.residences.filter(p => p.status === 'for-sale');
  const pool = [...pl.houses, ...pl.residences].flatMap(r => r.images.slice(0, 3)).filter(i => i.orientation === 'landscape' && i.role === 'photograph');
  const pick = PLACE_IMAGE[pl.name] && features.find(f => f.slug === PLACE_IMAGE[pl.name]);
  const image = pick?.images[0] || pool.sort((a, b) => b.width - a.width)[0] || (pl.houses[0] || pl.residences[0]).images[0];
  return { ...pl, cities, image, available: avail.length };
}).sort((a, b) => (b.houses.length + b.residences.length) - (a.houses.length + a.residences.length));

const css = readFileSync(ROOT + 'assets/site.css', 'utf8');
const js = readFileSync(ROOT + 'assets/site.js', 'utf8');
const version = createHash('sha256').update(css + js).digest('hex').slice(0, 8);

const S = {
  business, properties, features, creatives, agents, videos, places, creativeUse, version,
  bySlug: Object.fromEntries(properties.map(p => [p.slug, p])),
  featureBySlug: Object.fromEntries(features.map(f => [f.slug, f])),
  creativeById: Object.fromEntries(creatives.map(c => [c.id, c])),
  agentById: Object.fromEntries(agents.map(a => [a.id, a])),
};

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
const pages = [];
// Rand amounts: give each thin-space digit group a visible gap (text nodes only, never attributes).
const groupDigits = html => html.replace(/>([^<]*)</g, (m, text) => (text.includes('\u2009')
  ? `>${text.replace(/(\d|R)\u2009(?=\d{3})/g, '$1<span class="gs">\u2009</span>')}<` : m));
const out = (path, rawHtml) => {
  const html = groupDigits(rawHtml);
  const file = path.endsWith('.html') ? DIST + path.replace(/^\//, '') : DIST + path.replace(/^\//, '') + 'index.html';
  mkdirSync(file.replace(/[^/]+$/, ''), { recursive: true });
  writeFileSync(file, html);
  pages.push(path);
};

out('/', P.home(S));
out('/residences/', P.residencesIndex(S));
properties.forEach(p => out(`/residences/${p.slug}/`, P.residence(S, p)));
out('/houses/', P.housesIndex(S));
features.forEach(f => out(`/houses/${f.slug}/`, P.house(S, f)));
out('/films/', P.films(S));
out('/architects/', P.architectsIndex(S));
creatives.filter(c => creativeUse[c.id]).forEach(c => out(`/architects/${c.id}/`, P.architect(S, c)));
out('/places/', P.placesIndex(S));
places.forEach(pl => out(`/places/${pl.slug}/`, P.place(S, pl)));
out('/feature-a-home/', P.featureHome(S));
out('/about/', P.about(S));
out('/contact/', P.contact(S));
out('/404.html', P.notFound(S));

// assets
mkdirSync(DIST + 'assets', { recursive: true });
writeFileSync(DIST + 'assets/site.css', css);
writeFileSync(DIST + 'assets/site.js', js);
cpSync(ROOT + 'public', DIST, { recursive: true });
writeFileSync(DIST + '.nojekyll', '');
writeFileSync(DIST + 'robots.txt', PROPOSAL_MODE ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}sitemap.xml\n`);
if (!PROPOSAL_MODE) writeFileSync(DIST + 'sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.filter(p => !p.endsWith('.html')).map(p => `<url><loc>${SITE_URL.replace(/\/$/, '')}${p}</loc></url>`).join('')}</urlset>\n`);

console.log(`built ${pages.length} pages (base ${BASE}, proposal mode ${PROPOSAL_MODE})`);
