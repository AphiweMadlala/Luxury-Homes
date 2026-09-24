// Compose canonical datasets from curation + raw Instagram/YouTube extraction.
import { readFileSync, writeFileSync } from 'node:fs';
import { parsePrice, parseSpecs } from './lib/parse-caption.mjs';
import { POST_CATEGORY, PROPERTIES, FEATURES, AGENTS, CREATIVES, EXCLUDED, VERIFIED_AT, IMAGE_EXCLUDE, STILLS } from './curation.mjs';

const root = new URL('../data/', import.meta.url);
const read = f => JSON.parse(readFileSync(new URL(f, root)));
const write = (f, d) => writeFileSync(new URL(f, root), JSON.stringify(d, null, 2) + '\n');

const posts = read('instagram-posts.json');
const bySc = Object.fromEntries(posts.map(p => [p.shortcode, p]));
const yt = Object.fromEntries(read('raw/youtube-videos.json').map(v => [v.id, v]));
const creativeIds = new Set(CREATIVES.map(c => c.id));

const clean = caption => caption
  .replace(/(Stay [Ii]nspired and [Ff]ollow|Follow 📲?@Luxury|Follow @Luxury|to stay up to date)[\s\S]*$/, '')
  .replace(/◼️?For information[\s\S]*$/i, '')
  .replace(/🔗\s*Link in Bio[\s\S]*$/i, '')
  .replace(/#[\p{L}\d_]+/gu, '')
  .replace(/_{4,}|—{4,}/g, '')
  .trim();

// Credited practices' Instagram handles read as their names in running text.
const handleName = Object.fromEntries(CREATIVES.filter(c => c.instagram).map(c => [c.instagram.toLowerCase(), c.name]));
const unhandle = s => s.replace(/@([\w.]*\w)/g, (m, h) => handleName[h.toLowerCase()] || m);

// Narrative paragraphs only: drop spec/price/credit lines, video chapter lists and profile links.
const story = text => clean(text).split(/\n\s*\n|\n/)
  .map(s => s.trim())
  .filter(s => !/^\d{1,2}:\d{2}\b|@https?:|instagram\.com\/|follow on instagram|thank you for (your|the) support|meet the team/i.test(s))
  .filter(s => !/feature your (property|listing)|collaborate with|please contact|get in touch|subscribe|welcome to (another|this) episode|follow us|thank you to our sponsor|link in bio|youtube channel|full tour|watch the full/i.test(s))
  .filter(s => s.length > 60 && !/^(💰|🛏|🛁|🚗|📏|📐|📍|🇿🇦|For Sale|Asking|Price|Listed|Listing|Agency|Agent|Architect|Designed by|Interior|Developer|Construction|Photographer|📷|📸|🎥|Full)/i.test(s))
  .map(s => unhandle(s.replace(/\s*[🇿🇦🇺🇸🇬🇧].*$/u, '').replace(/\s+/g, ' ')));

const mediaFor = (shortcodes, { kind }) => {
  const out = [];
  for (const sc of shortcodes) {
    const p = bySc[sc];
    if (!p) throw new Error(`unknown post ${sc}`);
    for (const m of p.media) {
      if (IMAGE_EXCLUDE.has(`${sc}/${m.index}`)) continue;
      out.push({
        sourcePost: sc,
        sourceIndex: m.index,
        src: `data/raw/media/${sc}/${String(m.index).padStart(2, '0')}.jpg`,
        role: p.mediaType === 'reel' || p.mediaType === 'video' ? 'video-cover' : 'photograph',
        kind,
      });
    }
    for (const s of STILLS[sc] || []) {
      out.push({ sourcePost: sc, sourceIndex: null, still: s, src: `data/raw/media/${sc}/stills/${s}.jpg`, role: 'video-still', kind });
    }
  }
  // Lead with photographs; reel covers and stills follow unless they are all we have.
  const rank = { photograph: 0, 'video-cover': 1, 'video-still': 2 };
  return out.sort((a, b) => rank[a.role] - rank[b.role]);
};

const videoFor = (id, shortcodes) => {
  if (id && yt[id]) {
    const v = yt[id];
    return { provider: 'youtube', id, url: v.url, title: v.title, duration: v.duration, publishedAt: v.date,
      poster: v.thumbnailUrl, views: v.viewCount };
  }
  const reel = shortcodes.map(s => bySc[s]).find(p => p.video);
  return reel ? { provider: 'instagram', id: reel.shortcode, url: reel.url, title: null, duration: reel.video.durationSec, publishedAt: reel.date, poster: null } : null;
};

const firstDate = scs => scs.map(s => bySc[s].date).sort()[0];
const lastDate = scs => scs.map(s => bySc[s].date).sort().at(-1);

// ------------------------------------------------------------ properties
const properties = PROPERTIES.map((c, i) => {
  const primary = bySc[c.posts[0]];
  const ytText = c.youtube && yt[c.youtube] ? yt[c.youtube].text || '' : '';
  const caption = c.posts.map(s => bySc[s].caption).join('\n');
  const price = parsePrice(caption);
  const specs = parseSpecs(caption);
  const o = c.override || {};
  const val = k => (k in o ? o[k] : k in price ? price[k] : specs[k] ?? null);
  const sourceUrls = [
    ...(c.sourceListingUrl ? [c.sourceListingUrl] : []),
    ...(c.sourceUrls || []),
    ...c.posts.map(s => bySc[s].url),
    ...(c.youtube ? [`https://www.youtube.com/watch?v=${c.youtube}`] : []),
  ];
  const credit = id => (id ? (creativeIds.has(id) ? id : (() => { throw new Error(`creative ${id}`); })()) : null);
  return {
    id: `prop-${String(i + 1).padStart(3, '0')}`,
    slug: c.slug,
    reference: c.reference || null,
    status: c.status,
    title: c.title,
    propertyType: c.propertyType || null,
    priceZAR: val('priceZAR'),
    priceOnApplication: 'priceZAR' in o ? false : price.priceOnApplication,
    province: c.province || null,
    city: c.city || null,
    area: c.area || null,
    suburb: c.suburb || null,
    estate: c.estate || null,
    development: c.development || null,
    bedrooms: val('bedrooms'),
    bathrooms: val('bathrooms'),
    garages: val('garages'),
    parking: o.parking ?? null,
    erfSizeM2: val('erfSizeM2'),
    floorSizeM2: val('floorSizeM2'),
    ratesZAR: o.ratesZAR ?? null,
    leviesZAR: o.leviesZAR ?? null,
    lede: c.lede || null,
    description: story(caption).concat(ytText ? story(ytText).slice(0, 3) : []).filter((s, k, a) => a.indexOf(s) === k),
    highlights: [],
    features: c.features || [],
    architect: credit(c.architect),
    architectText: c.architectText || null,
    interiorDesigner: credit(c.interiorDesigner),
    developer: credit(c.developer),
    images: mediaFor(c.posts, { kind: 'property' }),
    video: videoFor(c.youtube, c.posts),
    agentIds: c.agentIds || [],
    agentText: c.agentText || null,
    agency: c.agency || null,
    sourceListingUrl: c.sourceListingUrl || null,
    instagramPosts: c.posts,
    sourceUrls,
    firstPresentedAt: firstDate(c.posts),
    lastPresentedAt: lastDate(c.posts),
    lastVerifiedAt: c.status === 'for-sale' || c.status === 'sold' ? VERIFIED_AT : null,
    confidence: c.confidence,
    conflicts: c.conflicts || [],
    location: primary.location?.name || null,
  };
});

// ------------------------------------------------------------ features
const features = FEATURES.map((c, i) => {
  const caption = c.posts.map(s => bySc[s].caption).join('\n');
  const ytText = c.youtube && yt[c.youtube] ? yt[c.youtube].text || '' : '';
  for (const ids of Object.values(c.credits)) for (const id of ids) if (!creativeIds.has(id)) throw new Error(`creative ${id} (${c.slug})`);
  const body = story(caption).concat(story(ytText).slice(0, 4)).filter((s, k, a) => a.indexOf(s) === k);
  return {
    id: `feat-${String(i + 1).padStart(3, '0')}`,
    slug: c.slug,
    type: c.type,
    title: c.title,
    location: c.location,
    province: c.place[0] || null,
    city: c.place[1] || null,
    architect: c.credits.architect || [],
    designer: c.credits.interiorDesigner || [],
    developer: c.credits.developer || [],
    builder: c.credits.builder || [],
    photographer: c.credits.photographer || [],
    summary: c.summary || body[0] || null,
    story: c.summary ? body : body.slice(1),
    images: mediaFor(c.posts, { kind: 'feature' }),
    video: videoFor(c.youtube, c.posts),
    instagramPosts: c.posts,
    sourceUrls: [...c.posts.map(s => bySc[s].url), ...(c.youtube ? [`https://www.youtube.com/watch?v=${c.youtube}`] : [])],
    publishedAt: firstDate(c.posts),
    relatedPropertyId: c.relatedProperty ? properties.find(p => p.slug === c.relatedProperty)?.id ?? null : null,
  };
});

// ------------------------------------------------------------ creatives / agents
const creatives = CREATIVES.map(c => ({
  ...c,
  company: c.name,
  sourceUrls: [...new Set([
    ...features.filter(f => [f.architect, f.designer, f.developer, f.builder, f.photographer].flat().includes(c.id)).flatMap(f => f.sourceUrls),
    ...properties.filter(p => [p.architect, p.interiorDesigner, p.developer].includes(c.id)).flatMap(p => p.sourceUrls.filter(u => u.includes('instagram') || u.includes('youtube'))),
    ...(c.id === 'boitumelo-mokonyane-studio' ? ['https://www.youtube.com/watch?v=vd5nyqJz9Fc'] : []),
  ])],
}));

// ------------------------------------------------------------ business
const profile = read('raw/profile.json')[0];
const business = {
  name: 'Luxury Homes South Africa',
  instagramDisplayName: profile.fullName,
  instagram: { handle: 'luxuryhomes_southafrica', url: 'https://www.instagram.com/luxuryhomes_southafrica/', followers: profile.followersCount, posts: profile.postsCount, verified: profile.verified },
  youtube: { handle: 'LuxuryHomesSouthAfrica', url: 'https://www.youtube.com/@LuxuryHomesSouthAfrica', subscribers: yt[Object.keys(yt)[0]].numberOfSubscribers, joined: '2020-09-28' },
  bio: profile.biography,
  channelDescription: yt[Object.keys(yt)[0]].channelDescription,
  operator: { name: 'Cacoon Group', evidence: 'All caption contact emails use the @cacoongroup.com domain; YouTube channel links the Cacoon Group Facebook page.' },
  people: [
    { name: 'Mbuyelo Rathidili', role: 'Founder', instagram: 'mbuyelo_rathidili', source: 'https://www.youtube.com/watch?v=vd5nyqJz9Fc' },
    { name: 'Boitumelo Mokonyane Studio', role: 'Producer', instagram: 'boitumelo_mokonyane_studio', source: 'https://www.youtube.com/watch?v=vd5nyqJz9Fc' },
  ],
  contact: {
    email: 'media@cacoongroup.com',
    generalEmail: 'info@cacoongroup.com',
    phone: '+27 61 451 7308',
    phoneHref: '+27614517308',
    whatsapp: true,
    sources: ['YouTube channel description (Sep 2026)', 'Instagram captions 2025–2026 (info@cacoongroup.com)'],
  },
  featureInvitation: 'If you’d like to feature your listing, project, or design with us, get in touch.',
  verifiedAt: VERIFIED_AT,
};

// ------------------------------------------------------------ video manifest
const videos = Object.values(yt).map(v => ({
  id: v.id, provider: 'youtube', url: v.url, title: v.title, publishedAt: v.date, duration: v.duration, views: v.viewCount,
  poster: v.thumbnailUrl,
  property: properties.find(p => p.video?.id === v.id)?.slug || null,
  feature: features.find(f => f.video?.id === v.id)?.slug || null,
}));

// ------------------------------------------------------------ classification
const classification = posts.map(p => ({ shortcode: p.shortcode, date: p.date, mediaType: p.mediaType, category: POST_CATEGORY[p.shortcode] || 'unclassified',
  property: properties.find(x => x.instagramPosts.includes(p.shortcode))?.slug || null,
  feature: features.find(x => x.instagramPosts.includes(p.shortcode))?.slug || null }));

// Media: record the raw plan for build-media, and attach processed images when available.
const plan = Object.fromEntries([...properties, ...features].map(r => [r.slug, { collection: r.id.startsWith('prop') ? 'properties' : 'features', status: r.status || 'feature', images: r.images }]));
writeFileSync(new URL('raw/media-plan.json', root), JSON.stringify(plan, null, 2));
let manifest = null;
try { manifest = read('media-manifest.json'); } catch {}
if (manifest) {
  const by = {};
  manifest.images.forEach(m => { (by[m.record] ||= []).push(m); });
  for (const r of [...properties, ...features]) {
    const done = (by[r.slug] || []).sort((a, b) => a.order - b.order);
    const planned = new Set(r.images.map(i => `${i.sourcePost}/${i.sourceIndex ?? i.still}`));
    const stale = !done.length || done.some(m => !planned.has(`${m.provenance.sourcePost}/${m.provenance.sourceIndex ?? m.provenance.still}`));
    if (stale) console.warn(`media stale for ${r.slug}: run npm run media`);
    r.images = done.map(({ record, collection, ...e }) => e);
  }
}

write('properties.json', properties);
write('features.json', features);
write('agents.json', AGENTS);
write('creatives.json', creatives);
write('business.json', business);
write('video-manifest.json', videos);
write('post-classification.json', { excludedReasons: EXCLUDED, posts: classification });

const count = (arr, k) => arr.reduce((a, x) => ((a[x[k]] = (a[x[k]] || 0) + 1), a), {});
console.log('properties', properties.length, count(properties, 'status'));
console.log('features', features.length, count(features, 'type'));
console.log('categories', count(classification, 'category'));
