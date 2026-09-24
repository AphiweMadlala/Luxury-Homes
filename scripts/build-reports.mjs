// Generate data-derived reports from the canonical datasets.
import { readFileSync, writeFileSync } from 'node:fs';
import { PROPERTIES, IMAGE_EXCLUDE, STILLS, EXCLUDED } from './curation.mjs';

const ROOT = new URL('../', import.meta.url).pathname;
const read = f => JSON.parse(readFileSync(ROOT + 'data/' + f));
const posts = read('instagram-posts.json');
const cls = read('post-classification.json');
const properties = read('properties.json');
const features = read('features.json');
const agents = read('agents.json');
const manifest = read('media-manifest.json');
const bySc = Object.fromEntries(posts.map(p => [p.shortcode, p]));
const R = n => (n == null ? '' : `R${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`);
const d = iso => iso.slice(0, 10);
const w = (f, s) => writeFileSync(ROOT + 'reports/' + f, s.trim() + '\n');
const count = (arr, k) => arr.reduce((a, x) => ((a[x[k]] = (a[x[k]] || 0) + 1), a), {});

// ---------------------------------------------------------------- content classification
{
  const c = count(cls.posts, 'category');
  const byYear = {};
  cls.posts.forEach(p => { const y = p.date.slice(0, 4); (byYear[y] ||= {})[p.category] = (byYear[y][p.category] || 0) + 1; });
  const cats = Object.keys(c).sort((a, b) => c[b] - c[a]);
  w('content-classification.md', `
# Content Classification

Scope: the 200 most recent posts on @luxuryhomes_southafrica (${d(posts.at(-1).date)} to ${d(posts[0].date)}), extracted with Apify on 2026-09-24. Every post was read and classified by hand (see \`scripts/curation.mjs\`, \`POST_CATEGORY\`). Machine-readable result: \`data/post-classification.json\`.

## Totals

| Category | Posts | Site treatment |
|---|---|---|
${cats.map(k => `| ${k} | ${c[k]} | ${{
    'property-for-sale': 'Residences (verified current)', 'property-sold': 'Residences, Sold', 'property-listing': 'Residences, Archive (status unconfirmed) unless verified', 'property-tour': 'Films + residence or house record',
    architecture: 'Houses', 'interior-design': 'Houses (Interiors)', development: 'Houses (In development)', 'featured-home': 'Not used: no credits, no particulars',
    lifestyle: 'Excluded', 'commercial-partnership': 'Excluded', inspiration: 'Excluded', rental: 'Excluded' }[k] || ''} |`).join('\n')}

## By year

| Year | ${cats.join(' | ')} |
|---|${cats.map(() => '---').join('|')}|
${Object.keys(byYear).sort().map(y => `| ${y} | ${cats.map(k => byYear[y][k] || '').join(' | ')} |`).join('\n')}

Posting fell from roughly 12 posts a month in 2021 to a handful of long-form tours and premium listings a year from 2023. The recent account is a tour-and-listing channel; the older account is an architecture feed. The site uses both, keeping them in separate models (Residences vs Houses).

## Exclusions

${Object.entries(EXCLUDED).map(([k, v]) => `- **${k}**: ${v}`).join('\n')}
- **featured-home** (3 posts): homes shown without architect, agent or particulars; nothing verifiable to present.

## Post-level table

| Date | Post | Type | Category | Record |
|---|---|---|---|---|
${cls.posts.map(p => `| ${d(p.date)} | [${p.shortcode}](https://www.instagram.com/p/${p.shortcode}/) | ${p.mediaType} | ${p.category} | ${p.property ? `residence: ${p.property}` : p.feature ? `house: ${p.feature}` : ''} |`).join('\n')}
`);
}

// ---------------------------------------------------------------- listing reconciliation
{
  const merged = PROPERTIES.filter(p => p.posts.length > 1 || p.youtube);
  w('listing-reconciliation.md', `
# Listing Reconciliation

${properties.length} residence records were built from 53 sale-listing posts, 6 sold posts, 2 current listing posts and the property tours. Each home has exactly one record.

## Status summary

| Status | Records | Shown as |
|---|---|---|
| for-sale | ${properties.filter(p => p.status === 'for-sale').length} | Available (verified against the live agency listing on 2026-09-24) |
| sold | ${properties.filter(p => p.status === 'sold').length} | Sold |
| unknown | ${properties.filter(p => p.status === 'unknown').length} | Archive, "Availability not confirmed" |

No record is marked under offer or withdrawn: no source said so.

## Merged sources (deduplication)

| Record | Instagram posts | YouTube | Match basis |
|---|---|---|---|
${merged.map(p => `| ${p.slug} | ${p.posts.join(', ')} | ${p.youtube || ''} | ${p.youtube ? 'Same price, specs, location and architect in caption and film description' : 'Identical caption text and specs, reposted'} |`).join('\n')}

Editorial features that relate to a residence link to it (\`relatedPropertyId\`) instead of duplicating it: ${features.filter(f => f.relatedPropertyId).map(f => f.slug).join(', ')}. The House Pagasvlei feature was folded into its sold residence record because both came from one post.

## Conflicts resolved

${properties.filter(p => p.conflicts.length).map(p => `### ${p.title} (${p.status})\n${p.conflicts.map(c => `- ${c}`).join('\n')}`).join('\n\n')}

## Verification method

1. For every listing posted 2023 to 2026, searched the agency, portal and developer sites for a live listing matching price, suburb/estate, bedrooms and land size.
2. Accepted "for-sale" only where a live agency page was fetched and showed no sold or under-offer marker.
3. Accepted "sold" only on an explicit sold statement (caption or press report).
4. Everything else, including all 2021 to 2022 listings, is "unknown". Instagram age alone was not treated as evidence either way.

Notable checks: Pinnacle Point (R36m, Sep 2025) matched no live Pam Golding listing (nearest differs in erf size); Can Balearia (R28m, Dec 2025) and The Boundary House (R20m, Apr 2025) had no locatable live listing; a RE/MAX URL for the Bantry Bay home now redirects to area results, while the Greeff Christie's listing (RL21514) is live.
`);
}

// ---------------------------------------------------------------- listing provenance
{
  const row = p => `| [${p.title}](../dist/residences/${p.slug}/) | ${p.status} | ${p.priceZAR ? R(p.priceZAR) : p.priceOnApplication ? 'POA' : ''} | ${[p.suburb || p.estate, p.city].filter(Boolean).join(', ')} | ${p.agency || ''} | ${p.instagramPosts.map(s => `[${s}](https://www.instagram.com/p/${s}/)`).join(' ')} | ${d(p.firstPresentedAt)} | ${p.sourceListingUrl ? `[listing](${p.sourceListingUrl})` : (p.sourceUrls.find(u => !u.includes('instagram') && !u.includes('youtube')) ? `[source](${p.sourceUrls.find(u => !u.includes('instagram') && !u.includes('youtube'))})` : '')} | ${p.confidence} |`;
  const avail = properties.filter(p => p.status === 'for-sale');
  w('listing-provenance.md', `
# Listing Provenance

Every residence on the site, with the source that supports its status. Particulars shown on the site for available homes come from the agency listing; for sold and archive homes, from the original caption.

## Available (verified ${avail[0].lastVerifiedAt})

${avail.map(p => `### ${p.title}
- Agency: ${p.agency}, reference ${p.reference}
- Listing: ${p.sourceListingUrl}
- Agents: ${p.agentIds.map(id => { const a = agents.find(x => x.id === id); return `${a.name} (${a.phone}, ${a.email})`; }).join('; ')}
- Instagram: ${p.instagramPosts.map(s => `https://www.instagram.com/p/${s}/`).join(', ')}${p.video ? `\n- Film: ${p.video.url}` : ''}
- Price ${R(p.priceZAR)} · ${p.bedrooms} bed · ${p.bathrooms} bath · erf ${p.erfSizeM2 ?? 'n/a'} m² · floor ${p.floorSizeM2 ?? 'n/a'} m²
- Confidence: ${p.confidence}${p.conflicts.length ? `\n- Notes: ${p.conflicts.join(' ')}` : ''}`).join('\n\n')}

## All records

| Record | Status | Price as presented | Location | Agency (as presented) | Posts | First presented | Status source | Confidence |
|---|---|---|---|---|---|---|---|---|
${properties.map(row).join('\n')}
`);
}

// ---------------------------------------------------------------- media reconciliation
{
  const imgs = manifest.images;
  const roles = count(imgs, 'role');
  const low = imgs.filter(i => i.width < 600);
  const recLow = [...new Set(imgs.filter(i => i.order === 1 && i.width < 800).map(i => i.record))];
  w('media-reconciliation.md', `
# Media Reconciliation

Generated from \`data/media-manifest.json\` (${d(manifest.generatedAt)}).

## Pipeline

1. Apify returned ${posts.reduce((a, p) => a + p.media.length, 0)} media items (carousel images in order, reel covers) plus ${posts.filter(p => p.video).length} reel videos; all were downloaded to \`data/raw/media/\` (git-ignored). 37 transient CDN 5xx responses were retried until complete; final count of zero-byte or corrupt downloads: 0.
2. Scene-change stills were extracted from 10 tour reels with ffmpeg and reviewed by eye; only clean frames were kept (\`STILLS\` in \`scripts/curation.mjs\`).
3. Every image used by a record was hashed (sha256), checked for corruption, deduplicated and converted to WebP at 640/1080/1600 px, never wider than the source.

## Result

| Measure | Count |
|---|---|
| Images published | ${imgs.length} |
| Photographs (carousel) | ${roles.photograph || 0} |
| Reel covers | ${roles['video-cover'] || 0} |
| Film stills | ${roles['video-still'] || 0} |
| Missing / zero-byte / corrupt | 0 |
| Cross-record duplicates | ${manifest.problems.filter(p => p.type === 'cross-record-duplicate').length} |
| Duplicates within a record | ${manifest.problems.filter(p => p.type === 'duplicate-within-record').length} |
| Sources narrower than 600 px | ${low.length} |

The first pipeline run found 10 cross-record duplicates: House Pagasvlei was both a sold residence and a house feature built from the same post. The feature was removed; the residence carries the story. The build validator now fails on any cross-record hash reuse and on any record image that comes from another record's posts.

## Frames excluded by hand

${[...IMAGE_EXCLUDE].map(x => `- \`${x}\``).join('\n')}

Reasons: cars or promotional product in a property carousel (BMW, supercars, Lamborghini), reel covers that are split-screen collages, and a reel cover showing a portrait artwork of a person. Automotive, lifestyle, motivational, product and rental posts are excluded wholesale (see content-classification.md).

## Not used

- YouTube posters: every poster carries baked-in title or price graphics and agency logos. They are promotional graphics, so none are used as imagery. Clean landscape frames from the films could not be extracted (YouTube requires sign-in for automated download).
- Instagram UI screenshots, stock imagery, agency-site photography: none used.
- Agent portraits: none exist in the feed; none used.

## Resolution

Most 2021 to 2022 Instagram images are 720 to 857 px wide. The layout therefore never stretches them: plates pair images below 1100 px, single plates cap at their native width, portrait-led records use a three-up lead, and the lightbox caps at natural size. Records whose lead image is under 800 px: ${recLow.length} (all archive or older features).

## Provenance

Each manifest entry records the source post URL, post date, author, carousel index or still id, and SHA-256 prefix. Photographers are credited on house pages only where the caption names them (Grant Pitcher, Adam Letch, Karl Beath). Image rights for older posts should be confirmed with the client (see PROJECT_CONTEXT.md).
`);
}
console.log('reports written');
