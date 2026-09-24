# PROJECT_CONTEXT.md

Website proposal for **Luxury Homes South Africa** (@luxuryhomes_southafrica, youtube.com/@LuxuryHomesSouthAfrica).

## What the client is

A luxury property media platform and property-tour channel founded by Mbuyelo Rathidili and operated through Cacoon Group contact addresses. It features homes on behalf of agencies, architects, designers and developers. **It is not an estate agency.** See `reports/business-model-audit.md`.

## What the site does

- **Residences**: homes presented for sale. Only homes checked against a live agency listing are "Available", and enquiries go to the listing agent. Sold and archive (unconfirmed) homes are kept, clearly labelled, with no viewing CTA.
- **Houses**: editorial architecture, interiors and development features, with credits. Never priced.
- **Films**: the 9 YouTube tours.
- **Architects**: every credited practice, with their houses.
- **Places**: province → city discovery.
- **Feature a home**: the brand's verified invitation (media@cacoongroup.com, WhatsApp +27 61 451 7308); a form that composes an email in the visitor's own mail app, with no backend.

## Build

```bash
npm install
npm run media      # only when image selection changes (≈3 min): data → media → data
npm run build      # data → validate → dist/
npm run serve      # http://localhost:4173
BASE=/Luxury-Homes/ npm run build   # GitHub Pages project path
node scripts/check-links.mjs        # internal link/asset/anchor check
node scripts/build-reports.mjs      # regenerate data-derived reports
```

`PROPOSAL_MODE` defaults to on: every page has `noindex, nofollow`, `robots.txt` disallows all, and no sitemap is written. Set `PROPOSAL_MODE=false` for launch.

## Layout

```
data/                      canonical datasets (properties, features, agents, creatives, business, media/video manifests)
data/raw/                  Apify + YouTube extraction (media/ is git-ignored)
scripts/curation.mjs       hand-verified classification, records, credits, image exclusions, reel stills
scripts/build-data.mjs     curation + raw → data/*.json
scripts/build-media.mjs    hash, dedupe, WebP derivatives → public/images, media-manifest.json
scripts/validate.mjs       build-blocking data checks
scripts/build-site.mjs     templates → dist/
templates/                 lib, components, pages (plain template literals)
assets/                    site.css, site.js (no framework, no dependencies at runtime)
public/                    fonts, favicon, processed images
reports/                   research and QA reports
```

## Updating a listing

Edit its entry in `PROPERTIES` in `scripts/curation.mjs` (status, `override` values from the agency listing, `agentIds`, `sourceListingUrl`), update `VERIFIED_AT`, then `npm run build`. The validator refuses a `for-sale` record without an agency source, a verified agent and a verification date.

## Open items for the client

1. Vector logo (the header uses an interim monochrome rendering of the LH two-slab mark).
2. Permission to name the founder on the About page (source: the channel's own YouTube credits).
3. Whether Cacoon Group should be named (currently footer only).
4. Terms for featuring a home (none are published, so none are shown).
5. Photography rights and credits for reposted agency/architect imagery, especially the 2021–2022 archive.
6. Current status of the 54 archive listings; any that are still live can be promoted to Available with their agency link.
7. Confirmation of editorial titles for homes without official names.
8. A custom domain; the canonical URL currently assumes GitHub Pages.
