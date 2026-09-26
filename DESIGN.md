# DESIGN.md: Luxury Homes South Africa

> A register of South African houses. The site presents homes the way an
> architecture monograph presents buildings, and it lists only what is verifiably
> on the market as a residence for sale.

## Overview

**Design read:** editorial publication and residence register for buyers, agents,
architects and developers; architectural, precise and quiet; native CSS on a static
build.

**Dials:** DESIGN_VARIANCE 7 · MOTION_INTENSITY 4 · VISUAL_DENSITY 3.

### Concept selection

Three internal concepts were weighed against the actual feed (see `reports/brand-audit.md`):

| Concept | Fit with the feed | Verdict |
|---|---|---|
| A. Architectural Monograph | 79 of 200 posts are credited architecture/interiors features naming 46 architects. Houses are named like buildings ("House VG5", "House Gouws", "Victoria Residence"). | **Primary** |
| B. Design Culture Journal | Captions are short credits, not essays; there is no author voice or recurring columns to sustain a magazine. | Rejected: would need invented content. |
| C. Private Residence Index | Only 3 homes are verifiably for sale today; 54 are unconfirmed archive. An index works only if it is honest about status. | **Secondary**, used for Residences only. |

The result is **A + C**: houses are presented as plates in a monograph with credits,
and the Residences section is a precise register whose first question is always
"is this available?".

### Why this is a fourth identity

| Previous project | Their system | This site |
|---|---|---|
| Exclusive Cape Town | dark navy, gold, Fraunces/Jost, villa rentals | cool mineral ground, pool-water teal, grotesk-led; no rentals |
| Durban Luxe | white/ink/bronze, Cormorant Garamond, diamond motif, concierge softness | no metallic accent, no display serif, no ornament; credits-first tone |
| Luxury Homes of SA | plaster/charcoal/face-brick, Archivo + IBM Plex Mono, "Particulars" | cool (not warm) neutrals, no mono face, particulars shown as a register table titled by status, not a "Particulars" system |

## Colors

Derived from the feed's recurring materials: board-formed concrete and grey
limestone, charcoal powder-coated aluminium frames, and the aqua of rim-flow pools
that appears in roughly half of all cover images. Photography supplies all other colour.

### Brand & Accent
- **Water** `#0F6B6E` (light) / `#6FC2BF` (dark): the single accent. Links, primary buttons, focus rings, active filter state, the "Available" status. Never decorative.

### Surface & Background
- **Concrete** `#EEF0EF`: page ground (light).
- **Limestone** `#E3E6E4`: raised bands, filter bar, image placeholders.
- **Slate** `#111416`: page ground (dark).
- **Slate-2** `#1A1F21`: raised bands (dark).

### Text & Rules
- **Aluminium** `#15191B`: primary text (15.5:1 on Concrete).
- **Aluminium-2** `#4A5256`: secondary text (7.0:1).
- **Aluminium-3** `#5E676B`: tertiary/meta (5.1:1).
- **Rule** `#C9CECC`: hairlines.
- Dark: text `#E6EAE8`, secondary `#A7B0B3`, tertiary `#9AA3A6`, rule `#2B3235`.

### Semantic
- **Available**: Water. **Sold**: Aluminium-2 with the word "Sold". **Archive / unconfirmed**: Aluminium-3 with the words "Availability not confirmed". Status is always written in words, never colour alone.

### Banned here
Gold, brass, bronze, navy, cream/beige paper, face-brick red, black + gold (the
existing profile mark's colours are not carried into the UI).

## Typography

### Font Family
- **Schibsted Grotesk** (variable 400–900): display, headings, UI, numerals (`tabular-nums` for prices and specs). A newspaper grotesk with firm, slightly condensed forms that sits well with architectural photography.
- **Newsreader** (variable, optical size 6–72, 300–700): long-form story paragraphs and lede only. Justified by the publication role; never used for headings or UI. No italics loaded.
- Self-hosted woff2, Latin subset, `font-display: swap`.

### Hierarchy
| Role | Font | Size (clamp) | Weight | Tracking | Leading |
|---|---|---|---|---|---|
| Display (hero) | Schibsted | 2.6rem → 5.2rem | 600 | -0.035em | 0.98 |
| H1 page | Schibsted | 2.2rem → 3.9rem | 600 | -0.03em | 1.02 |
| H2 section | Schibsted | 1.6rem → 2.6rem | 600 | -0.025em | 1.08 |
| H3 | Schibsted | 1.15rem → 1.35rem | 600 | -0.01em | 1.2 |
| Lede | Newsreader | 1.25rem → 1.6rem | 400 | 0 | 1.35 |
| Body (story) | Newsreader | 1.075rem → 1.18rem | 400 | 0 | 1.6 |
| UI / meta | Schibsted | 0.8125rem → 0.9375rem | 500 | 0.005em | 1.4 |
| Price | Schibsted | 1.5rem → 2.1rem | 600 | -0.02em | 1 |

### Principles
- No eyebrows or kickers above headings. Section titles carry the meaning.
- No em or en dashes in visible text (the renderer converts caption dashes).
- Prices always as `R 31 000 000`: thin-space grouping; the build wraps each group space in a `.gs` span with a 0.14em gap because Schibsted's space glyphs are too narrow at tabular widths. Amounts never wrap. Form inputs use plain spaces.

## Layout

### Spacing System
4px base; section rhythm `clamp(4.5rem, 9vw, 9rem)`; gutter `clamp(1rem, 4vw, 3rem)`.

### Grid & Container
12-column grid, max width 1480px. Editorial compositions use asymmetric spans
(7/5, 8/4, 5/7). Mobile collapses every composition to one column.

### Whitespace Philosophy
Photography gets the space. Text blocks cap at 62ch. Nothing is centred except the
404.

## Elevation & Depth

Flat. No drop shadows on content. The only layered surfaces are the sticky header
(background blur over photography) and dialogs (lightbox, mobile menu) which use a
Slate scrim at 92%.

## Shapes

### Radius Scale
**All sharp (radius 0)** for images, cards, inputs, buttons. The one exception is
the range-slider thumb (circular), which is a control affordance.

### Image Treatment
- Full-bleed or column-bleed, never framed, never rounded, no overlays or pills on images.
- Aspect ratios chosen per composition (3:2 landscape plates, 4:5 portrait plates for reel stills).
- Captions sit below images in UI type.
- Reel stills are displayed no wider than their 720px source.

## Components

### `site-header`
Monochrome LH mark (interim rendering of the existing two-panel mark) + wordmark;
single-line nav at ≥1080px; full-screen menu dialog below. Concrete at 88% with a
backdrop blur that lives on a `::before` layer (never on the header itself, which
would trap the fixed menu). Height 64px. The home hero is a split, not an overlay.

### `button-primary`
Water fill, white text (6.3:1), 48px min height, sharp. Hover darkens 8%; active translateY(1px).

### `button-secondary`
1px Aluminium border, transparent fill.

### `residence-card`
Image (3:2), then location line (meta), title (H3), status, price, and one spec line
(beds / baths / floor). Available cards carry the `avail` marker: a short Water rule
plus the word "Available". No borders, no shadows.

### `status-line`
Words first: "Available" (Water, with rule), "Sold", "Not confirmed, presented 2022"
on cards and "Availability not confirmed" on detail pages.

### `register-table`
Particulars as a definition list in two groups (Accommodation, Land & costs), one
rule above each group only.

### `credit-block`
Role label (meta) over name (H3 weight) linking to the architect page. Appears above
the fold on house pages.

### `plate-gallery`
House pages only. Singles only for landscapes of 1100px or more; other landscapes pair
(cropped to 3:2 so pairs align); portraits run in threes (4:5). A lone final image folds
into the row before it. Opens a lightbox dialog (focus trap, Escape, arrow keys, swipe,
focus restoration, scroll lock); the photograph always fits the dialog and is never
enlarged beyond its source.

### `residence-lead`
A residence page has one gallery, its lead: 2/3 + stacked side pair for landscapes, a
4:5 triptych for portrait-only records. The "N photographs" control sits below the lead,
never on the image, and opens every photograph of the home in the lightbox; no plates
repeat them further down. With two photographs the second takes both side slots (a 4:5
pair for portraits); a lone landscape spans the lead, enlarged at most 1.3×; a lone
portrait stays a 4:5 plate. When the set includes film stills, "Includes stills from the
Luxury Homes South Africa film." sits beside the control.

### `film-facade`
Still image + play button; loads a youtube-nocookie iframe only on click. No autoplay.
Portrait posters use a 4:5 variant. The Films page is a grid of 4:5 film cards.

### `filter-bar`
Status tabs (Available / Sold / Archive; active tab in Water), then a "Refine" panel:
search, province, bedrooms, bathrooms, sort, price min/max inputs + two-handle
range on a log scale (R6m to R220m, snapped to R500 000). URL-synchronised with
Back/Forward. The Refine panel starts collapsed below 768px so results stay in the
first screen.

### `highlights`
Published features as a quiet two-column list under a hairline, not chips.

## Do's and Don'ts

### Do
- Credit every verified architect, designer, developer and photographer by name.
- State availability in words on every residence surface.
- Route enquiries on available homes to the listing agent first.

### Don't
- Show a price, "for sale" or "arrange a viewing" on editorial house pages.
- Use YouTube posters with baked-in price text as imagery.
- Use cars, lifestyle or promotional graphics as house imagery.

## Responsive Behavior

### Breakpoints
480 · 768 · 1080 · 1440. Tested at 375, 390, 430, 768, 1024, 1440, 1920.

### Touch Targets
Minimum 44×44px for every interactive element; filter controls 48px tall.

### Mobile priorities
Photography → identity (title, place) → price (if available) → specs → contact → story → credits.
