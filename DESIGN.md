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

### How it differs from the sibling projects

The sites share a serif/sans pairing and a warm accent, so the distinction rests on
purpose, ground, voice and structure, not on the absence of a serif or a metal.

| | Exclusive Cape Town | Durban Luxe | Luxury Homes South Africa |
|---|---|---|---|
| Purpose | Villa rentals: a stay | Coastal stays with concierge service | A publication of houses, plus a small register of homes for sale |
| Ground | Dark navy throughout | Warm white hospitality | Warm paper by default; Night only for film and the footer |
| Accent | Gold used as atmosphere | Bronze, diamond motif | Brass as notation only: rules, markers, the active tab, chapter numbers |
| Type | Fraunces / Jost | Cormorant-led, soft | Libre Caslon Display for names and headings; Schibsted Grotesk for every word of UI; Newsreader for prose |
| Structure | Manifesto and destination mood | Concierge flow | Architectural monograph: plates with credits, then a residence register |
| Voice | Escape | Service | Credits-first: every house names the practice behind it |

## Colors

One appearance, light only: paper sections with deliberate **night** sections
(footer, film bands). Components read semantic tokens (`--bg`, `--fg`, `--line`,
`--mark`); the `.night` class re-points them. Tokens live at the top of
`assets/site.css`. Photography supplies all other colour.

### Brand & Accent
- **Brass** `#A68A52`: marks, rules, the `rule-mark` before captions, the "Available" rule, range thumb. Never small text on paper (2.8:1).
- **Brass ink** `#6E5B37`: brass as text on paper (5.2:1), e.g. chapter numbers.
- **Brass light** `#C4A870`: brass on night (7.4:1); also the focus ring on night.
- **Champagne** `#CDB786`: the L and H lettering in the mark only.

### Surface & Background
- **Paper** `#EEECE7`: page ground; header background; `theme-color`.
- **Paper raised** `#E4E1DA`: image placeholders, raised bands.
- **Night** `#111315` / **Night raised** `#1A1D1F`: night sections.

### Text & Rules
- **Graphite** `#111315`: primary text; primary buttons; focus ring on paper.
- **Graphite soft** `#44484A`: secondary text. **Graphite muted** `#5F6364`: tertiary/meta.
- **Rule** `#CCC8BF`: hairlines. Strong rules (chapter heads) use Graphite.
- Night: text `#ECE9E2`, secondary `#BDB9B0`, tertiary `#A29E95`, rule `#2E3234`.

### Semantic
- **Available**: uppercase "Available" in Graphite with a Brass rule. **Sold**: the word "Sold". **Archive / unconfirmed**: the words "Availability not confirmed". Status is always written in words, never colour alone.

## Typography

### Font Family
- **Libre Caslon Display** (400): h1–h3, the wordmark, the mark lettering, statements, menu and index names. Display sizes only; never below ~1.25rem.
- **Schibsted Grotesk** (variable 400–900): UI, meta, captions, buttons, numerals (`tabular-nums` for prices and specs).
- **Newsreader** (variable, optical size 6–72, 300–700): lede and long-form story paragraphs only. No italics loaded.
- Self-hosted woff2, Latin subset, `font-display: swap`; Caslon and Schibsted are preloaded.

### Hierarchy
| Role | Font | Size (clamp) | Weight | Leading |
|---|---|---|---|---|
| H1 | Caslon Display | 2.6rem → 5rem | 400 | 1 |
| House-page H1 | Caslon Display | 2.8rem → 6rem | 400 | 0.96 |
| H2 | Caslon Display | 2rem → 3.75rem | 400 | 1.04 |
| H3 / plate title | Caslon Display | 1.4rem → 1.75rem | 400 | 1.12 |
| Lede | Newsreader | 1.2rem → 1.5rem | 400 | 1.4 |
| UI / meta / captions | Schibsted | 0.8125rem → 0.9375rem | 400–500 | 1.4 |
| Chapter number | Schibsted, caps, 0.14em tracking | 0.75rem | 600 | — |

### Principles
- Heading rank follows the document outline; appearance comes from classes. The
  homepage film section is labelled by its chapter heading (h2), and the featured
  residence inside it is an h3 set at display size.
- No eyebrows or kickers above headings. Section titles carry the meaning.
- No em or en dashes in visible text (the renderer converts caption dashes).
- Prices always as `R 31 000 000`: thin-space grouping; the build wraps each group space in a `.gs` span with a 0.14em gap because Schibsted's space glyphs are too narrow at tabular widths. Amounts never wrap. Form inputs use plain spaces.

## Layout

### Spacing System
4px base; section rhythm `clamp(4.5rem, 9vw, 9rem)`; gutter `clamp(1rem, 4vw, 3rem)`.

### Grid & Container
12-column grid, max width 1480px. Editorial compositions use asymmetric spans
(7/5, 8/4, 5/7). Home sections open with a `chapter` head: number and word
(brass ink), title, and an optional link, over a strong rule. Chapter numbers are
used on the homepage only; other pages open with a plain page head. Mobile collapses
compositions to one column, except the house index (see `house-plates`).

Supporting pages open with a plate, not a form or a text column: Feature a home (a
7-column architecture plate beside the proposition, the email composer below it),
About (the publication's masthead: name, proposition, a 21:9 plate, then "What it
covers" in four ruled columns), Contact (heading beside a 3:2 plate).

### Whitespace Philosophy
Photography gets the space. Text blocks cap at 62ch. Nothing is centred except the
404.

## Elevation & Depth

Flat. No drop shadows on content. The sticky header is solid Paper with a bottom
rule. Dialogs (lightbox, mobile menu) sit over a Night scrim.

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
Interim rendering of the brand's two-slab mark (Graphite and grey slabs, Champagne
serif L and H) + a two-line wordmark ("Luxury Homes" in Caslon, "SOUTH AFRICA" in
tracked caps). Solid Paper, 72px, hairline bottom rule. Navigation has two groups:
the sections (Residences, Houses, Films, People, Places), then after a fine vertical
rule the utility links (Feature a home, Contact) in smaller, quieter type. No filled
button. Desktop nav from 1080px, where the measured gap between wordmark and nav is
273px; a full-screen menu dialog below that, with the utility links as a second row.
"People" is the label for `/architects/` (the URL stays): the directory lists
designers, developers, builders, photographers and the film studio as well.

### `masthead-index`
The line under the homepage cover is a table of contents, not a statistic: section
names in Caslon, a quiet count under each ("3 available, 63 presented", "83
featured"). Five columns; on mobile the first spans both columns and the rest run 2×2.

### `site-footer`
A Night section: oversized Caslon wordmark, then statement, nav and contact in
three columns, then the legal note ("not an estate agency…").

### `button-primary`
Graphite fill, Paper text, 48px min height, sharp. On night the colours invert.

### `button-secondary`
1px Graphite border, transparent fill; the border turns Brass on hover.

### `residence-card`
Image (3:2), then location line (meta), title (H3), status, price, and one spec line
(beds / baths / floor). Available cards carry the `avail` marker: a short Brass rule
plus the word "Available". No borders, no shadows.

### `residence-register`
While a status has few homes (at most 5 available), `/residences/` shows them as a
composed register instead of a filtered list: the home with the widest cover
photograph leads (8 columns, text beside it), the other landscapes follow at 7
columns, a portrait closes at 4 columns, dropped. Each item shows location, title,
"Available" with the asking price, specs, and "Marketed by" the agency. Cover
photographs are used as published; the widest-image heuristic is not, because it
can surface an interior.

### `status-line`
Words first: "Available" (Brass rule, uppercase), "Sold", "Not confirmed, presented 2022"
on cards and "Availability not confirmed" on detail pages.

### `register-table`
Particulars as a definition list in two groups (Accommodation, Land & costs), one
rule above each group only.

### `house-plates`
The `/houses/` index is a deterministic plate composition set at build time
(`composePlates` in `templates/components.mjs`). Rows cycle 7/5, 4/4/4, 5/7, 4/4/4,
then a single 9-column plate with its caption beside it. Each slot takes the first
house within an 8-record look-ahead whose lead image suits it: 7-column slots need a
landscape of at least 800px, the 9-column slot one of at least 1300px, 5-column slots
a portrait. A lone record at the end takes a slot that can hold the row (9, 7 or 5
columns), which also composes practice pages with one, two or three houses.
Filtered results (`.is-filtered`) stay in pairs: JS assigns 7/5, then 5/7, from the
visible index; a pair whose first plate is portrait turns so the portrait sits in the
narrow slot; one result is a solo 9/3 plate. Nothing is reordered or measured at
runtime. Mobile runs full, then a half pair only when both captions are short
(title ≤ 24 characters, practice ≤ 26, place ≤ 24); otherwise the next plate is full.
Caption: Brass `rule-mark`, place (the source location, such as "Fresnaye, Cape
Town", or its first part when longer than 30 characters), then "Architecture by
**Practice**". The middle
dot hangs outside the credit and is clipped when the credit wraps.

### `house-open`
House pages open with the lead photograph composed by orientation: landscape
(8 columns + credits aside), portrait (5 columns + title block), film, or "rich"
(full-width 21:9 for a landscape lead of at least 1300px, or 1000px with 8+ plates).
The page closes with up to three houses: "By the same hands" when all share a
practice, "By the same hands, and nearby" when topped up from the same province,
otherwise "Nearby".

### `credit-block`
Role label (meta) over name (H3 weight) linking to the architect page. Appears above
the fold on house pages.

### `plate-gallery`
House pages only. Singles only for landscapes of 1100px or more; other landscapes pair
(cropped to 3:2 so pairs align); portraits run in threes (4:5). A lone final image folds
into the row before it. Opens a lightbox dialog (focus trap, Escape, arrow keys, swipe,
focus restoration, scroll lock).

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
Portrait posters use a 4:5 variant. The Films page leads with the newest film at 8
columns on Night, then 4:5 film cards in three staggered columns.

### `filter-bar`
Status tabs (Available / Sold / Archive; active tab underlined in Brass), then a
"Refine" panel that appears only for a status with 6 or more homes, or when a
refinement is already active (`REFINE_AT` in `templates/pages.mjs`). Refine offers:
Location (province, then city, built from the homes in the selected status, with
counts; nothing that would return zero), Search (property, agent, reference or
architect), bedrooms, bathrooms, sort, and price min/max with a two-handle range on a
log scale (R6m to R220m, snapped to R500 000). URL-synchronised with Back/Forward
(`?status=`, `?loc=p:Province` or `c:Province|City`; older `?province=` links still
work). Clear filters shows only when something is set. Refine starts collapsed below
768px.

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
480 · 768 · 900 · 1080 · 1200. Tested at 375, 390, 430, 768, 820, 900, 1024, 1080,
1180, 1280, 1440 and 1920 in Chromium; 390, 1024 and 1440 in Firefox and WebKit.
Between 900 and 1199px the cover title takes 10 columns so the headline sets in three
lines, and its caption moves to a row of its own.

### Touch Targets
Minimum 44×44px for every interactive element; filter controls 48px tall.

### Mobile priorities
Photography → identity (title, place) → price (if available) → specs → contact → story → credits.
