// Data validation. Exits non-zero on errors; prints warnings for missing optional data.
import { readFileSync, existsSync, statSync } from 'node:fs';

const ROOT = new URL('../', import.meta.url).pathname;
const read = f => JSON.parse(readFileSync(ROOT + 'data/' + f));
const properties = read('properties.json');
const features = read('features.json');
const agents = read('agents.json');
const creatives = read('creatives.json');
const business = read('business.json');
const manifest = read('media-manifest.json');

const errors = [], warnings = [];
const err = (rec, msg) => errors.push(`${rec}: ${msg}`);
const warn = (rec, msg) => warnings.push(`${rec}: ${msg}`);
const dupes = (arr, key, label) => {
  const seen = new Set();
  arr.forEach(x => { if (seen.has(x[key])) err(label, `duplicate ${key} "${x[key]}"`); seen.add(x[key]); });
};

dupes(properties, 'id', 'properties'); dupes(properties, 'slug', 'properties');
dupes(features, 'id', 'features'); dupes(features, 'slug', 'features');
dupes(agents, 'id', 'agents'); dupes(creatives, 'id', 'creatives');
const slugClash = properties.map(p => p.slug).filter(s => features.some(f => f.slug === s));
slugClash.forEach(s => warn('slugs', `"${s}" used by both a residence and a house (different URL prefixes)`));

const agentIds = new Set(agents.map(a => a.id));
const creativeIds = new Set(creatives.map(c => c.id));
const STATUS = ['for-sale', 'under-offer', 'sold', 'withdrawn', 'unknown'];
const email = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const phone = /^\+27[\d ]{9,13}$/;

const checkImages = (rec, imgs) => {
  if (!imgs.length) err(rec, 'no images');
  imgs.forEach((img, i) => {
    if (!img.provenance?.sourcePost || !img.provenance?.postUrl) err(rec, `image ${i + 1} has no provenance`);
    img.variants.forEach(v => {
      const f = ROOT + 'public/' + v.path;
      if (!existsSync(f)) err(rec, `missing media ${v.path}`);
      else if (statSync(f).size === 0) err(rec, `zero-byte media ${v.path}`);
    });
  });
};

for (const p of properties) {
  const r = `property ${p.slug}`;
  if (!STATUS.includes(p.status)) err(r, `invalid status ${p.status}`);
  if (!p.instagramPosts.length && !p.sourceListingUrl) err(r, 'missing source provenance');
  if (!p.sourceUrls.length) err(r, 'missing sourceUrls');
  if (p.priceZAR != null && (!Number.isInteger(p.priceZAR) || p.priceZAR < 500000 || p.priceZAR > 1e9)) err(r, `invalid price ${p.priceZAR}`);
  if (p.priceZAR != null && p.priceOnApplication) err(r, 'price and POA both set');
  for (const k of ['bedrooms', 'bathrooms', 'garages', 'parking']) if (p[k] != null && (typeof p[k] !== 'number' || p[k] < 0 || p[k] > 40)) err(r, `invalid ${k} ${p[k]}`);
  if (p.bathrooms != null && (p.bathrooms * 2) % 1 !== 0) err(r, `invalid bathrooms ${p.bathrooms}`);
  for (const k of ['erfSizeM2', 'floorSizeM2']) if (p[k] != null && (p[k] < 30 || p[k] > 500000)) err(r, `invalid ${k} ${p[k]}`);
  if (p.floorSizeM2 && p.erfSizeM2 && p.floorSizeM2 > p.erfSizeM2 * 4) warn(r, `floor ${p.floorSizeM2} much larger than erf ${p.erfSizeM2}`);
  p.agentIds.forEach(id => { if (!agentIds.has(id)) err(r, `invalid agent reference ${id}`); });
  [p.architect, p.interiorDesigner, p.developer].filter(Boolean).forEach(id => { if (!creativeIds.has(id)) err(r, `invalid creative ${id}`); });
  if (p.status === 'for-sale') {
    if (!p.sourceListingUrl) err(r, 'for-sale listing with no supporting agency source');
    if (!p.lastVerifiedAt) err(r, 'for-sale listing without lastVerifiedAt');
    if (!p.agentIds.length) err(r, 'for-sale listing without a verified agent');
    if (!p.agency) err(r, 'for-sale listing without agency');
    if (p.priceZAR == null && !p.priceOnApplication) warn(r, 'for-sale without price or POA');
  }
  if (p.status === 'unknown' && p.lastVerifiedAt) err(r, 'unknown status must not carry lastVerifiedAt');
  if (p.bedrooms == null) warn(r, 'bedrooms missing');
  if (p.priceZAR == null && !p.priceOnApplication) warn(r, 'price missing');
  checkImages(r, p.images);
}

for (const f of features) {
  const r = `feature ${f.slug}`;
  if (!f.instagramPosts.length || !f.sourceUrls.length) err(r, 'missing source provenance');
  [f.architect, f.designer, f.developer, f.builder, f.photographer].flat().forEach(id => { if (!creativeIds.has(id)) err(r, `invalid creative ${id}`); });
  if ('priceZAR' in f || 'status' in f) err(r, 'editorial feature carries sale fields');
  if (f.relatedPropertyId && !properties.some(p => p.id === f.relatedPropertyId)) err(r, `invalid relatedPropertyId ${f.relatedPropertyId}`);
  if (!f.architect.length && !f.designer.length) warn(r, 'no architect or designer credit');
  checkImages(r, f.images);
}

// hero mismatch: first image must come from the record's own posts
for (const rec of [...properties, ...features]) {
  const own = new Set(rec.instagramPosts);
  const lead = rec.images[0];
  if (lead && !own.has(lead.provenance.sourcePost)) err(`${rec.slug}`, `hero image from foreign post ${lead.provenance.sourcePost}`);
  rec.images.forEach(img => { if (!own.has(img.provenance.sourcePost)) err(rec.slug, `image from foreign post ${img.provenance.sourcePost}`); });
}
// cross-record duplicates
const hashOwner = new Map();
manifest.images.forEach(m => {
  const prev = hashOwner.get(m.hash);
  if (prev && prev !== m.record) err('media', `image ${m.hash} used by both ${prev} and ${m.record}`);
  hashOwner.set(m.hash, m.record);
});

for (const a of agents) {
  if (!email.test(a.email)) err(`agent ${a.id}`, `invalid email ${a.email}`);
  if (!phone.test(a.phone)) err(`agent ${a.id}`, `invalid phone ${a.phone}`);
  if (!a.sourceUrls?.length) err(`agent ${a.id}`, 'no source');
}
const c = business.contact;
if (!email.test(c.email) || !email.test(c.generalEmail)) err('business', 'invalid contact email');
if (!phone.test(c.phone)) err('business', 'invalid contact phone');

warnings.forEach(w => console.warn('warn ', w));
errors.forEach(e => console.error('ERROR', e));
console.log(`validate: ${properties.length} properties, ${features.length} features, ${errors.length} errors, ${warnings.length} warnings`);
if (errors.length) process.exit(1);
