# Animation improvement plans — deepayansinha.com

Written by `improve-animations` against commit `cb8a528`. Read-only audit — no
source code was modified. Each plan is self-contained; see AUDIT.md in the
skill (`C:\Users\deepa\.claude\skills\improve-animations\AUDIT.md`) for the
rule catalog these were derived from.

## Plans

| # | Title | Severity | Category | Status |
| --- | --- | --- | --- | --- |
| 001 | Add press feedback to every interactive control | HIGH | Physicality & origin | TODO |
| 002 | Stop animating `padding` on the sticky header shrink | MEDIUM | Performance | TODO |
| 003 | Give the social-link tooltip a physical entrance | MEDIUM | Physicality & origin | TODO |
| 004 | Cross-fade the theme-toggle and hamburger icon swaps | MEDIUM | Missed opportunities / Interruptibility | TODO |

## Recommended execution order

1. **001** first — highest leverage (every clickable element site-wide),
   fully independent of the others, and touches the most files, so doing it
   first avoids rebasing merge conflicts against the smaller plans.
2. **002** and **003** — independent of each other and of 001/004, can be
   done in either order or in parallel.
3. **004** last — touches `Header.astro`'s mobile-menu button, which plan
   001 also edits (the same button gets `active:scale-[0.97]` from 001 and
   the icon cross-fade from 004). Doing 001 first means 004's diff starts
   from the already-updated file and only needs to touch the `<path>`
   elements, not the button's own class list.

No plan depends on another's edits being *correct* to apply cleanly — the
ordering above is about avoiding avoidable diff conflicts, not a hard
dependency chain.

## Findings not turned into plans

See the audit table delivered alongside this README for the full list,
including LOW-severity items (the blanket `prefers-reduced-motion` rule in
`global.css:389-400`, which is defensible as-is) and missed-opportunity ideas
(work-grid entrance stagger, copy-button success feedback, proof-strip
reveal) that were flagged as additive ideas rather than corrective fixes and
were not selected for a full plan in this pass.
