# Final QA

Date: 2026-09-25. Build: 227 pages, `PROPOSAL_MODE` on, served from `dist/` at `http://localhost:4173`.
This report describes the **current** version: warm paper and graphite with brass as notation, Libre Caslon
Display with Schibsted Grotesk (Newsreader for prose), deliberate Night sections, the homepage cover and
chapters, the monograph Houses index, orientation-led house openings, the composed Residences register,
and the People directory. Every result below comes from a fresh run against this build; nothing is carried
over from the pre-Caslon QA (kept under "Previous issues" at the end).

The suite is in the repo: `npm run serve` in one shell, `npm run qa` in another (`scripts/qa.mjs`).

## Result

| Check | Result |
|---|---|
| Data validation (`npm run validate`) | 63 properties, 83 features, **0 errors**, 6 warnings: 5 houses with no published architect or designer credit (shown uncredited, not guessed) and 1 archive home, Horizon Villa, with no published price |
| Build (`npm run build`) | 227 pages |
| Internal links (`node scripts/check-links.mjs`) | 14,327 internal references, **0 broken**; 474 external links logged in `reports/external-links.json` |
| Route × viewport sweep, Chromium 154 | 34 routes × 12 widths = 408 page loads, 12 checks each: **4,896 / 4,896 pass** |
| Cross-browser, Firefox 156 and WebKit 26.6 | 8 routes × 3 widths × 2 engines = 48 page loads: **576 / 576 pass** |
| Accessibility, axe-core 4.13 (WCAG 2.2 AA + best practice) | 34 routes at 390 and 1440 (68 page loads, with the sweep checks): **0 violations**, 884 / 884 checks pass |
| Interaction suite | 47 checks × 2 widths × 3 engines: **282 / 282 pass** |
| Total | **6,638 checks, 0 failures** (run of 2026-09-25, 1,128 s) |

After that run, the Refine grid was rebalanced for tablet widths (CSS only); the five Residences routes and
the full interaction suite were rerun on the final build in all three engines: **1,204 checks, 0 failures**.

**Aborted image requests.** Chromium sometimes starts the larger `srcset` candidate of an image it already holds
in memory cache (the Kloof Road cover, from the homepage) and cancels it once the chosen size arrives. The trace
showed `01-1080` loaded and displayed, `01-1440` started and aborted, on `/residences/` itself. Nothing is
missing for the viewer, so the suite ignores `ERR_ABORTED` on image requests only; rendering is still checked by
the broken-image check on every page.

**Sweep checks per page and width:** HTTP status (404 for the 404 route), exactly one `h1`, no heading-level jumps,
no duplicate ids, every `aria-labelledby` target present, no broken images, no horizontal overflow, header nav
never within 24px of the wordmark, filtered-out results not rendered, no faux bold or italic on Caslon, no
console errors, no failed requests. The 404 route's own "404" console message is expected and excluded.

**Widths:** 375, 390, 430, 768, 820, 900, 1024, 1080, 1180, 1280, 1440, 1920 (Chromium, all 34 routes);
390, 1024, 1440 (Firefox and WebKit: home, residences, houses, filtered houses, film-led house, available
residence, films, feature a home). Headless, reduced motion.

**Routes (34):** home; residences available, sold, archive, archive filtered (`loc=p:Gauteng&beds=5`), empty
result; houses default, type, province, practice, few-result (tours, 2), one-result (Footprint Architects);
house openings landscape (Houghton Residence), portrait (Kloof 119A), film-led (Rivers Edge), rich (Stacked
House), no credit (Clifton Hillside House), odd gallery (La Lucia); residences available (Kloof Road),
sold (Nettleton Road), archive (Can Balearia), POA (Five Elements), limited gallery (Zimbali Driveway, 2
photographs), video (Blue Hills); films; people; practice (SAOTA) and one-house practice (Footprint);
places; province (Gauteng); about; feature a home; contact; 404.

## Interaction suite

Run in all three engines at 390 and 1440.

| Area | Verified |
|---|---|
| Residences, Available | Composed register shown; list hidden; Refine hidden (3 homes); Clear filters hidden while nothing is set; count "3 available residences" |
| Residences, Archive | List shown; Refine offered (54 homes); Location lists only provinces and cities that hold archive homes, each with a count; choosing a city narrows the list and writes `?loc=`; switching status rebuilds the options and drops a location that no longer applies |
| URL state | Back restores the location, Back again restores the unfiltered archive (54), Forward restores the city filter; `?province=Gauteng` links from before this pass map to `loc=p:Gauteng`; a refinement on Available (`?loc=p:Gauteng`) shows the list |
| Sort, price, empty | Price ascending is ordered; R20m–R40m range filters; `q=zzzz` shows the empty state, and its Clear filters returns to the register |
| Houses | 83 → Interiors 9 writes `?type=`; the filtered composition assigns a slot to every visible plate; hidden plates are `display: none`; the count is `aria-live="polite"`; one-result filter becomes a solo plate and opens the practice panel; province then type, Back restores province, Back again restores the full monograph |
| Menu (390) | Opens, focuses Close, traps Tab, lists People, Escape closes and returns focus to Menu |
| Desktop nav (1440) | Sections group with People; utility group with Contact |
| Lightbox | Opens on the clicked photograph ("2 of"), locks scroll, ArrowRight advances, traps Tab, Escape closes and restores focus to the opener |
| Agent-first actions | "Arrange a viewing" mails the listing agent (same address as the agent card); Call and Email the agent sit under it; "Marketed by" names agent and agency; Listing information is collapsed and opens |
| Film | Play loads `youtube-nocookie.com/embed/…` only on click |
| Feature a home | Empty submit shows the designed error, sets `aria-invalid`, and focuses the field; nothing is sent from the site |
| Footer | Email and Instagram links present |

## What changed in this pass

1. **Residences.** With 3 available homes the page no longer opens on a six-control filter form. Available homes
   are a composed register built at build time: Kloof Road leads (8 columns, text beside it), Beach House at 7,
   Blue Hills as a dropped 4-column portrait, each with location, title, Available and asking price, specs and
   "Marketed by". Refine appears only for a status with 6 or more homes, or when a refinement is active
   (`REFINE_AT`), so Sold (6) and Archive (54) keep full search. Province became a structured Location control
   (province, then city) generated from the selected status, with counts and no empty options; free text now
   reads "Property, agent, reference or architect". Clear filters shows only when something is set.
2. **Houses, filtered.** No longer a 4-column catalogue: pairs of 7/5 then 5/7 in document order, a portrait
   turned into the narrow slot, a single result as a 9/3 plate. Slots come from the visible index in JS; nothing
   is shuffled, measured or reordered.
3. **Navigation.** Residences, Houses, Films, People, Places; then Feature a home and Contact as a quieter utility
   group after a fine rule (no filled button). "Architects" became **People** because the directory also lists
   interior designers, developers, builders, photographers and the film studio; `/architects/` is unchanged.
   Measured header clearance at 1080px is 273px (brand 157px, nav 564px), so the desktop breakpoint stays at 1080.
4. **People.** Page and breadcrumbs renamed; the opening keeps the three most represented practices, each shown
   through one of their houses, and adds a jump list of roles with counts. Practice pages now use the plate
   composition at any size: one house is a single large plate, two a 7/5 pair, three a pair plus a closing plate.
5. **Homepage masthead.** The metrics strip ("03 Residences available") became a publication index: Residences,
   Houses, Films, People, Places in Caslon, with quiet counts under each ("3 available, 63 presented").
6. **Supporting pages.** Feature a home leads with the proposition beside a 7-column plate ("Who we feature",
   "What to send"), with the email composer as a secondary row. About is the publication's masthead: name,
   proposition, a 21:9 plate, "What it covers" (Instagram, Film, Architecture, Real estate), "Not an estate
   agency", credits. Contact opens beside a plate. Places no longer prints "0 residences".
7. **House captions.** Show the source location ("Fresnaye, Cape Town", "Helderfontein Estate, Fourways")
   instead of only the city; the first part is used when longer than 30 characters.
8. **Residence pages.** Above the fold: place, title, price or status, specs, "Arrange a viewing" to the agent,
   then Call and Email the agent, then "Marketed by *agent*, *agency*". Reference, check date, source listing,
   conflicts and Instagram provenance stay in the collapsed Listing information.

### Bugs found and fixed

| Bug | Fix |
|---|---|
| Homepage film section labelled by the residence title (`aria-labelledby="sig-h"`) while its chapter heading was `films-h`; two h2s competing | Section labelled by `films-h`; the residence title is an h3 styled by `.interlude__title` |
| Register and homepage spread picked Beach House's interior staircase via "widest landscape" | Cover photographs are used as published |
| Places: the counts row overflowed by 57px at 900 and 15px at 1024 | Counts wrap |
| House credits with several names used `<br>`; axe flagged 24px target spacing (Kloof 119A) | Names stack in a grid with a gap |
| Residences list loaded images that JS then hid behind the register | List ships `hidden` when the register is shown |
| Masthead counts: Schibsted's tabular figures widened the comma ("3 available , 63") | Tabular figures removed from that label |
| Cover headline set in four lines at 1024 ("houses, and") | Between 900 and 1199px the title spans 10 columns (three lines); its caption moves below |
| Mobile two-up house captions cramped for long names | Two-up only when both titles, places and practices are short; otherwise the plate is full width |
| Wordmark "SOUTH AFRICA" at 10px | 11px |
| Mobile footer ran about 1,100px tall at 375 | Footer nav in two columns under 480px; touch targets unchanged |

## Design review

Answers to the brief's questions, from the rendered pages at 390 and 1440.

1. **Any major page still AI-generated?** No page opens on a generic pattern now. The weakest remaining surface is
   the sold/archive list (`rgrid`), which is still a uniform card list; it is a working register of 60 homes where
   scanning matters more than composition, so it was left plain on purpose.
2. **Residences an oversized filter UI for three homes?** Not any more: tabs, one line of status, then the register.
3. **Does filtering Houses destroy the monograph?** No; filtered results keep 7/5 and 5/7 pairs and the same captions.
4. **Navigation too dense?** Five sections plus a separated two-link utility group.
5. **"Architects" inaccurate?** Yes; now People.
6. **Homepage over-emphasises "03"?** The count is now secondary text under "Residences", beside "63 presented".
7. **Supporting pages the same publication?** Feature, About and Contact now open with plates, Caslon heads and
   ruled registers; chapter numbers stay on the homepage only.
8. **Mobile two-up cramped?** Only short captions go two-up.
9. **Caslon and brass overused?** Caslon is on names and headings only; UI, counts and captions are Schibsted.
   Brass stays on rules, markers, the active tab, chapter numbers and small counts.
10. **Verification language visually dominant?** No. Provenance sits in collapsed disclosures; the only visible
    status copy is one sentence under the tabs.

`impeccable detect` on the templates and on eight built pages: the remaining findings were checked and left:
the runtime lightbox `<img>` (src set on open); "low contrast" on night links, where the detector reads the 1px
brass underline gradient as a background (axe passes); cramped padding on ruled index rows and the utility nav,
which sit flush by design; uppercase on the film credit line and 1.12 leading on the Caslon statement (display
settings); the cream page ground (the brief's paper); and "world-class" in an agency's published listing copy.

## Browser features checked

`:has()` (film section with a portrait film), `details`/`summary` markers (hidden with `list-style: none` and
`::-webkit-details-marker`), `text-wrap: balance` (headings wrap acceptably without it), `font-synthesis: none`
with the Caslon display face at 400 only (no faux bold or italic found in any engine), sticky residence
column, `object-fit` crops, the fixed menu and lightbox, and `vh` heights. All render in Chromium, Firefox and
WebKit at 390, 1024 and 1440 with no overflow or console errors. Font metrics differ slightly between engines
(Firefox sets "the people who" on the cover's second line); no clipping of ascenders or descenders was seen.
Fonts: Caslon and Schibsted preloaded, `font-display: swap`; Newsreader is not preloaded (it is used for lede
and prose, which sit below the first heading).

## Known limits

- The sold and archive list is a plain card list (see design review, point 1).
- Rivers Edge and some features still carry long source text; the dedupe drops restated openings but nothing
  is rewritten. The client should review story text.
- Headless browsers only; real iOS Safari and Android Chrome were not available here. WebKit 26.6 is the
  closest proxy for Safari.
- Performance figures would come from a local server; measure LCP on the deployed host.
- Client items still open are in `PROJECT_CONTEXT.md`: logo, **permission to name the founder** (About shows
  only the name, linked to the channel's own credit; no biography), photography rights, archive status, domain,
  and editorial titles for homes without official names.

## Previous issues / regression history

From the first QA (2026-09-24, pre-Caslon system with a Water accent and automatic dark mode; that system has
since been replaced, so its scores no longer apply):

- Mobile menu clipped to 64px because the header's `backdrop-filter` became the containing block of the fixed
  menu. The header is now solid Paper with no backdrop filter.
- The "N photographs" button covered the third photo of the Blue Hills triptych; it sits below the lead.
- Prices lost their grouping in Schibsted; thin-space groups are wrapped in `.gs` spans ("R 31 000 000").
- A regex cleanup cut a media query and hid every filter control under 480px; restored and braces verified.
- `.res-body` overflowed at 375 with a long particulars value; values may wrap.
- Compose form used native validation; it now runs the designed, announced error.
- Story text lost video chapter lists, profile-link lines and sign-offs, and credited practices' handles became
  names.

From the layout pass (2026-09-25, commit cbdcca1): house-page place line inherited the Places grid through a
shared class; the caption separator was left dangling when a credit wrapped; related houses mixed "same hands"
and "nearby" under one heading. All fixed then and re-verified by this run.
