---
target: whole site (dist)
total_score: 22
max_score: 32
na_heuristics: 7,9
p0_count: 2
p1_count: 2
target_identity: "file:/workspaces/Luxury-Homes/dist/index.html"
target_fingerprint: "sha256:d9bf3cf763cc3b8cd1eca756be52e4853fb687b2329e165d0bc99336d478abe3"
target_path: /workspaces/Luxury-Homes/dist/index.html
timestamp: 2026-09-24T11-14-20Z
slug: dist-index-html
closed: true
---
Method: dual-agent (A: design review · B: detector + browser)

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Mobile menu opens to a 64px panel |
| 2 | Match System / Real World | 3 | Price grouping invisible at card size; "Archive" jargon |
| 3 | User Control and Freedom | 3 | URL-synced filters, Back/Forward, Escape |
| 4 | Consistency and Standards | 2 | Black active tabs vs Water spec; pill on image; 146/83/63 stats |
| 5 | Error Prevention | 3 | Linear price slider R6m-R220m |
| 6 | Recognition Rather Than Recall | 3 | Status always in words |
| 7 | Flexibility and Efficiency | n/a | Browse/persuade surface |
| 8 | Aesthetic and Minimalist Design | 2 | 11 filter controls for 3 homes; films dead space |
| 9 | Error Recovery | n/a | No submitting forms |
| 10 | Help and Documentation | 3 | What to send; not-an-agency line |
| Total | | 22/32 | Acceptable/Good boundary |

Design specificity: honesty system, credits and palette are authored; compositions (/houses/ grid, house pages) are generic. Detector: 246 findings, dominated by skip-link hover contrast (shared shell, 227); h1->h3 skip on index pages real; cramped-padding, broken-image, footer line-length false positives.

Priority issues:
- [P0] Mobile menu clipped to 64px (backdrop-filter containing block). Fix: move blur to pseudo-element. /impeccable adapt
- [P0] Triptych "N photographs" button stretched over third photo on Blue Hills. /impeccable polish
- [P1] Prices unreadable at card size (narrow nbsp invisible). /impeccable typeset
- [P1] For-sale signal diluted: 146 stat, mixed "Other residences", "Archive, 2025" card label, films labels. /impeccable clarify
- [P2] Films dead space, gallery orphans, flush section headings, mobile filters push results down. /impeccable layout
