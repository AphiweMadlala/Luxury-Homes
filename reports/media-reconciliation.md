# Media Reconciliation

Generated from `data/media-manifest.json` (2026-09-24).

## Pipeline

1. Apify returned 1250 media items (carousel images in order, reel covers) plus 17 reel videos; all were downloaded to `data/raw/media/` (git-ignored). 37 transient CDN 5xx responses were retried until complete; final count of zero-byte or corrupt downloads: 0.
2. Scene-change stills were extracted from 10 tour reels with ffmpeg and reviewed by eye; only clean frames were kept (`STILLS` in `scripts/curation.mjs`).
3. Every image used by a record was hashed (sha256), checked for corruption, deduplicated and converted to WebP at 640/1080/1600 px, never wider than the source.

## Result

| Measure | Count |
|---|---|
| Images published | 1026 |
| Photographs (carousel) | 959 |
| Reel covers | 8 |
| Film stills | 59 |
| Missing / zero-byte / corrupt | 0 |
| Cross-record duplicates | 0 |
| Duplicates within a record | 0 |
| Sources narrower than 600 px | 54 |

The first pipeline run found 10 cross-record duplicates: House Pagasvlei was both a sold residence and a house feature built from the same post. The feature was removed; the residence carries the story. The build validator now fails on any cross-record hash reuse and on any record image that comes from another record's posts.

## Frames excluded by hand

- `Cp7ZwDvDpYV/0`
- `Cp7ZwDvDpYV/9`
- `CfwpIryD5ty/0`
- `CPKgl50Dvor/0`
- `C8UhvcGNdBO/0`
- `DIGyQLGN9LV/0`
- `CxXOFuWt2Sm/0`
- `C9Z_3eAN5NT/0`

Reasons: cars or promotional product in a property carousel (BMW, supercars, Lamborghini), reel covers that are split-screen collages, and a reel cover showing a portrait artwork of a person. Automotive, lifestyle, motivational, product and rental posts are excluded wholesale (see content-classification.md).

## Not used

- YouTube posters: every poster carries baked-in title or price graphics and agency logos. They are promotional graphics, so none are used as imagery. Clean landscape frames from the films could not be extracted (YouTube requires sign-in for automated download).
- Instagram UI screenshots, stock imagery, agency-site photography: none used.
- Agent portraits: none exist in the feed; none used.

## Resolution

Most 2021 to 2022 Instagram images are 720 to 857 px wide. The layout therefore never stretches them: plates pair images below 1100 px, single plates cap at their native width, portrait-led records use a three-up lead, and the lightbox caps at natural size. Records whose lead image is under 800 px: 75 (all archive or older features).

## Provenance

Each manifest entry records the source post URL, post date, author, carousel index or still id, and SHA-256 prefix. Photographers are credited on house pages only where the caption names them (Grant Pitcher, Adam Letch, Karl Beath). Image rights for older posts should be confirmed with the client (see PROJECT_CONTEXT.md).
