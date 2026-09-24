# Final QA

Date: 2026-09-24. Build: 227 pages, `PROPOSAL_MODE` on, served from `dist/` at `http://localhost:4173`.
Sequence run: `/impeccable critique` → fix batch → `/impeccable audit` → fixes → `/impeccable polish` → re-verification.

## Result

| Check | Result |
|---|---|
| Data validation | 63 properties, 83 features, **0 errors**, 6 warnings (5 features with no published architect or designer credit, shown uncredited rather than guessed; 1 archive home, Horizon Villa, with no published price) |
| Internal links, assets, anchors | 227 pages, 14,208 internal references, **0 broken**; 474 external links logged in `reports/external-links.json` |
| Full-site sweep | **All 227 pages × 7 widths** (375, 390, 430, 768, 1024, 1440, 1920): HTTP 200, exactly one `<h1>`, 0 broken images, 0 horizontal overflow, 0 console errors, 0 failed requests (after the fixes below) |
| Viewport matrix | 18 routes × 7 widths (375, 390, 430, 768, 1024, 1440, 1920) = 126 runs: **0 horizontal overflow, 0 broken images, 0 failed requests, 0 console errors** (the 404 route logs its own expected 404) |
| Layout shift | CLS 0.000 on every run |
| Accessibility (axe-core 4.13, WCAG 2.2 AA + best practice) | 18 routes at 390 and 1440, light theme: **0 violations**. 4 routes at 390, dark theme: **0 violations** |
| Touch targets | 0 interactive elements under 24 × 24 px at 390 (inline text links in prose exempt per WCAG 2.5.8); form controls and tabs are 44–48 px |
| Interaction suite | **34 / 34 pass** (below) |
| Impeccable audit score | 15/20 before fixes → **18/20** after |

Routes in the matrix: home, residences, houses, films, places, province, architects index, about, contact,
feature a home, for-sale residence (Signature Estate), video residence (Blue Hills), POA residence (Five Elements),
sold residence (Nettleton Road), limited-data archive residence (Zimbali Driveway, 2 photographs),
editorial house (Rivers Edge), architect page (121 Arch), 404.

## Critique (`/impeccable critique`)

Run as two isolated assessments (A: design review, B: detector + browser overlay). Snapshot: `.impeccable/critique/2026-09-24T11-14-20Z__dist-index-html.md`.

| # | Heuristic | Score |
|---|---|---|
| 1 | Visibility of system status | 3 |
| 2 | Match with real world | 3 |
| 3 | User control and freedom | 3 |
| 4 | Consistency and standards | 2 |
| 5 | Error prevention | 3 |
| 6 | Recognition over recall | 3 |
| 7 | Flexibility | n/a (browse surface) |
| 8 | Aesthetic and minimalist | 2 |
| 9 | Error recovery | n/a (no submitting forms) |
| 10 | Help and documentation | 3 |
| | **Total** | **22/32 (69 %)** |

Priority issues and resolution:

| Severity | Issue | Resolution |
|---|---|---|
| P0 | Mobile menu clipped to 64 px: the header's `backdrop-filter` made it the containing block of the fixed menu | Blur moved to a `::before` layer; menu measured at full viewport height |
| P0 | "12 photographs" button stretched over the third photo of the Blue Hills triptych (a for-sale home) | Button moved below the lead images; 48 px control |
| P1 | Prices unreadable at card size (narrow no-break spaces vanished in Schibsted) | Thin-space grouping wrapped in a spaced `.gs` span at build time: "R 31 000 000"; amounts never wrap |
| P1 | For-sale signal diluted: "146 houses" stat, archive homes in "Other residences" on available pages, "Archive, 2025" card label, mixed film labels | Figures now 3 available / 46 architects / 9 films; related homes on available pages are available or sold only; cards read "Not confirmed, presented 2025"; available cards and films carry a Water "Available" marker |
| P2 | Films page dead space; gallery orphans; flush section headings; filters push mobile results below the fold | Films as a 4:5 card grid; last lone image folds into the previous row, landscape pairs crop to 3:2; heading spacing; Refine panel collapsed below 768 px (first result at 630 px on a 390 × 844 screen) |
| detector | Skip link hover contrast 1:1 (227 pages), h1 → h3 on index pages | Fixed; detector 246 → 17 findings (remaining verified false positives or published listing copy) |

Also from the critique: tabs now use Water when active (per DESIGN.md), highlights are a quiet list instead of chips, description paragraphs that restate the lede are dropped, the price slider moves on a log scale, the home rail has Previous/Next buttons, and the nav Contact button no longer stacks a border and underline when active.

## Interaction suite

| Area | Verified |
|---|---|
| Mobile menu (375) | Opens full height (740/740), locks scroll, makes page content inert, focuses Close, traps Tab, Escape closes, focus returns to Menu, links navigate |
| Residences filters | Default tab is Available (3). Archive tab → 54 and `?status=unknown`. Province, search, sort, and the price slider (keyboard, log scale, snapped to R500 000) all filter and write the URL. Typed "20m" parses to `max=20000000`. Back and Forward restore state. Deep link `?status=sold` → 6. Empty state shows and resets |
| Houses filters | Type/practice filters narrow and write the URL; Back restores |
| Lightbox | Opens on the right photo, focuses Close, locks scroll, ArrowRight advances, image loads, traps Tab, Escape closes and restores focus |
| Films | No YouTube iframe until Play is pressed; plays through `youtube-nocookie.com` |
| Enquiry routes | For-sale pages mail and call the listing agent (Sam Harwood, The Storey; Everitt agents for Blue Hills); features go to media@cacoongroup.com; WhatsApp +27 61 451 7308 |
| Feature-a-home form | Empty name → inline error, `aria-invalid`, focus moved to the field; valid input composes a `mailto:` to media@cacoongroup.com. Nothing is sent from the site |
| 404 | HTTP 404 with a designed page |
| Keyboard | Skip link is the first Tab stop, visible on focus, and moves focus to `<main>` |

## Audit (`/impeccable audit`)

| # | Dimension | Before | After | Key finding |
|---|---|---|---|---|
| 1 | Accessibility | 3 | 4 | Selected-tab count at 70 % opacity was 4.2:1 on Water; compose form's native validation bypassed the designed, announced error |
| 2 | Performance | 4 | 4 | Only the LCP image is eager (`fetchpriority="high"`); all others lazy with `srcset`/`sizes` and explicit dimensions; 286 lines of JS, no runtime dependencies; local LCP 64–356 ms |
| 3 | Responsive | 2 | 4 | **P0:** below 480 px the filter grid and its Refine toggle were `display: none`, so phones could not search or filter residences or houses |
| 4 | Theming | 3 | 3 | Tokens throughout and dark mode passes axe; a few literal values remain (error red `#B3261E`, film backdrop `#0D1112`) |
| 5 | Implementation integrity | 3 | 3 | Raw YouTube description text in stories (chapter timestamps, "Thank you for your support, 10K!", Instagram handles in place of credited names) |
| | **Total** | **15/20 Good** | **18/20 Excellent** | |

Detector (`impeccable detect`): 246 findings at critique → 17 now, all verified as false positives or source text:
inner-wrap padding read as "cramped" (11), the runtime lightbox `<img>` (1), display-heading leading (1),
and phrases quoted from agency listing copy such as "seamlessly integrated", "cutting-edge", "home theater" (4).
Agency descriptions are shown as published, as the page states.

## Fixes made in this pass

Critique fix batch: see the table above.

Regression found and fixed during QA: a regex cleanup of obsolete `.film-row` CSS cut one media-query line mid-rule. It (a) merged the sub-480 px filter rule into `display: none` (item 1 below) and (b) left a dangling `@media (max-width: 899px) {` that wrapped the architects index, feature, about, contact and footer styles so they applied only under 900 px. Both repaired; `assets/site.css` braces verified balanced; the four affected pages re-checked at 1440.

Also: `.res-body` uses `minmax(0, 1fr)` on narrow screens and particulars values may wrap (a long value had pushed Can Balearia 34 px past a 375 px viewport); the local QA server no longer crashes when a request lands mid-rebuild.

1. `assets/site.css`: restored the sub-480 px filter rule (single-column grid) that had hidden every filter control on phones.
2. `assets/site.css`: selected-tab count opacity 0.7 → 0.85 (≥ 5:1); film card titles get a 24 px+ target.
3. `templates/pages.mjs`: compose form `novalidate` so the designed error runs, with `aria-describedby` linking the message.
4. `scripts/build-data.mjs`: story text drops video chapter lists, profile-link lines and sign-off lines, and replaces a credited practice's Instagram handle with its name (e.g. `@footprint_architects_` → Footprint Architects). Handles of uncredited parties (appliance brands, builders) are left as published rather than guessed.
5. `package.json`: `axe-core` was declared but missing from the lockfile; reinstalled.

## Final design review

1. **Specific to Luxury Homes South Africa?** Yes in content, voice and system: the feed's own houses, practices, films and contacts, with the concrete-and-water palette drawn from its photography. See the note on composition below.
2. **Architecture, design and real estate combined?** Residences (for sale) and Houses (architecture, interiors, development) are separate sections that cross-link through Architects and Places.
3. **Is it clear what is for sale?** Yes. Only 3 homes are "Available", each checked against a live agency listing with a date. Sold and archive homes are labelled in words, carry no viewing CTA, and archive prices read "as presented".
4. **Avoids a generic property portal?** Mostly. The status register, credits and films set it apart; the Houses index is still a uniform card grid (below).
5. **Photography dominant?** Yes. Full-bleed hero, lead triptych on every residence, and the full gallery with a lightbox.
6. **Contributors credited?** 46 architects, 11 interior designers, 2 developers, 2 builders, 3 photographers and 1 film producer, each with a page listing their houses. The 5 features without a published credit are shown uncredited.
7. **Mobile editorial rather than merely responsive?** Photography first, then location, price, specs and the viewing CTA, matching the brief's mobile order; the filters collapse behind Refine so results stay in the first screen.
8. **Distinct from Exclusive Cape Town, Durban Luxe and Luxury Homes of SA?** Yes: no navy/gold, bronze or warm plaster; a grotesk-led cool mineral palette with one water accent; no display serif or ornament (see `DESIGN.md`).
9. **Enquiry routes accurate?** Yes. For-sale enquiries go to the named listing agent from the agency listing; feature requests go to the brand's published media address and WhatsApp.
10. **Invented positioning?** None found. The About page states the site is not an estate agency; the founder is named only from the channel's own credits and is flagged for the client's permission.

## Known limits

- **Composition (recommended next: `/impeccable layout`).** The critique's design-specificity point stands: `/houses/` shows 83 equal cards and house pages use hero-plus-even-grid. The monograph concept in `DESIGN.md` lives in copy and credits more than in page composition. Moving to plate-scale layouts is a layout change, not polish, so it was not slipped into this pass.
- Rivers Edge's story joins the Instagram caption and the YouTube description, so it opens three times in slightly different words. Trimming it is an editorial call for the client.
- Tested in Chromium only (headless, reduced motion). Safari/iOS and Firefox are not covered in this environment.
- LCP figures come from a local server and are useful only for comparison; measure on the deployed host.
- Client items still open are listed in `PROJECT_CONTEXT.md` (logo, founder permission, photography rights, archive status, domain).
