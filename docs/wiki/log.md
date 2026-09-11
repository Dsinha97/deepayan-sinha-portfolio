# Wiki log

One line per action, newest at the bottom.

- 2026-09-10 — Initial build. Created the wiki from `docs/sources/` (two research documents plus
  the paper and certificate link files) and a dated snapshot of the MBA Brain vault in
  `private/sources/mba-brain/`. Fifteen pages: the guardrails and operating contract, four
  profile pages, three case studies, five build references, and the research synthesis.
  Recorded that the two research documents are factually fabricated about Deepayan and are
  structure-only sources — see `research-synthesis.md`.
- 2026-09-10 — Linear project filled: description, dates, five external links, seven milestones
  (M0 foundation through M6 beyond launch), and 37 issues each carrying its gate and its doc
  link. Wrote `docs/linear.md` as the join. Tightened the Fort Monroe guidance so the
  mis-migrated benchmark figure is never printed on the site — the catch is the story, and
  printing the number beside the client's name is how it propagates again.
- 2026-09-10 — M0 closed. Pushed to the public repo (37 files, no `private/` path in any commit)
  and set a scheduled `/linear-sync` drift check for Monday mornings. DSI-78, DSI-79 and DSI-80
  moved to the Shipped table.
- 2026-09-11 — M2 opened with DSI-115, added to the backlog by the owner after M1 closed: a
  kintsugi theme. Scoped with him to an accent layer rather than a repalette — purple and teal
  keep every role, the grounds become ceramic (warm paper light, indigo dark) and gold appears
  only as a seam. `src/styles/global.css` regained its whole contrast table, since moving light
  mode off pure white cost every light pair about 0.3 of a ratio point and pushed `--fg-muted`
  and light `--teal` below AA on `--surface-2`; both were darkened off-scale. Added
  `src/components/Seam.astro`, the one component that carries the metaphor. The gold rule is
  asymmetric on purpose and `design-system.md` says so: the seam is 2.26:1 on paper and 8.78:1
  on indigo, so gold text is forbidden in light mode and fine in dark.
- 2026-09-11 — DSI-89, the mark. No vector original survives, so `images/logo.jpg` was traced
  rather than redrawn: colour masks, marching-squares contours, RDP, refitted as Catmull-Rom
  splines, all in `scripts/trace-logo.py`, which is a developer tool and not part of the build.
  The owner asked for gold in the mark too, so the kintsugi seam is clipped to the letterforms
  and shows only where the break crosses a stroke. Three findings worth keeping: colour must
  come from CSS rather than a fill attribute or dark mode reinvents the white-box problem; the
  favicon has to be a *different drawing* from the mark, with its dilation stroke capped at 0.6
  because browser UI sometimes renders it at 128px where a heavier stroke closes the counters;
  and two purples ship, the brand one where we own the ground and a mid purple where we do not.
- 2026-09-11 — DSI-88, typography. Inter and JetBrains Mono, latin weight-axis subsets, copied
  out of `@fontsource-variable/*` into `public/fonts/` and committed with their OFL licences;
  the packages stay as devDependencies for provenance only and nothing imports their stylesheets,
  which would register every subset and defeat the preload. The metric-adjusted Arial fallback
  was **measured** rather than copied — canvas `fontBoundingBox*` and mean advance width at
  100px, against the file that actually ships — giving size-adjust 104.55%, ascent 92.78%,
  descent 22.96%. Published Inter numbers assume the full font. The fluid steps became Tailwind
  theme entries carrying their own line-height and tracking, so a component cannot use the
  display size and forget its tracking. Built output: zero external origins, CSS 6.0KB gzipped.
- 2026-09-11 — DSI-86, the shell. BaseLayout with skip link, Head, sticky Header, Footer, plus
  `404.astro` so the error route is navigable. The header's underside is a seam rather than a
  rule, which is the one place the kintsugi idea is structural. Notes worth keeping: nav entries
  are two kinds (a hash is a position, a path is a route) and only the second can be compared at
  build time; the classes `header.js` toggles exist in the stylesheet only because they appear
  as whole literals in a scanned file, so they were verified in the *built* CSS; `<main>` needs
  `tabindex="-1"` or the skip link scrolls without moving focus. The header shrink animates
  padding, which the motion rule forbids — recorded in `design-system.md` as a single argued
  exception rather than left silent.

  Also caught in passing: `LogoMark.astro` had been written with the Windows ANSI codepage
  instead of UTF-8, so its em dashes were mojibake. Re-encoded, every text file in the repo
  audited, and the component is now generated from `scripts/logo-mark.astro.tpl` by the trace
  script so the inline mark and the standalone file cannot drift.
- 2026-09-11 — DSI-131, the reference folder. 9 style teardowns, 20 component specs and 3
  profile-product screenshots, reviewed and gitignored under both spellings before anything else.
  Four decisions with the owner: port ideas rather than React code; restructure the homepage to a
  sticky identity rail beside a bento column; keep kintsugi as the spine and take no palette from
  any reference; add a display serif with body staying Inter.

  The arithmetic that settled the React question is worth keeping: the site ships 769 bytes of
  JavaScript, and framer-motion alone is ~35KB gzipped — more than double the whole budget,
  before React. Instrument Serif was chosen over Fraunces and Newsreader at 21KB versus 37 and
  58; Fraunces' character lives in SOFT/WONK axes that only exist in a 121KB file. Its fallback
  needed a 76.47% size-adjust, which is large and is documented as such rather than smoothed
  over. `motion.css` holds only primitives with a live consumer; the rest are listed in
  `design-references.md` against the issue that will need them, so it never fills with CSS
  nothing renders.
- 2026-09-11 — DSI-87, the theme toggle and the CSP pipeline, which are one problem: the init
  script must run before first paint, so it is inline, so the policy has to allow it by hash.
  `headers.template` plus `generate-headers.mjs` and `check-dist.mjs` now run as build steps and
  both exit non-zero.

  Two departures from the written plan, both improvements and both recorded in
  `security-headers.md`. The hash is taken from the **built HTML** rather than the source file,
  because that is what the browser hashes, and it is cross-checked against the source so a
  transformed script stops the build instead of shipping a policy that blocks itself. And a
  `Cache-Control` in the `/*` block turned out to *append* to the immutable rules rather than be
  overridden by them — `max-age=0, must-revalidate, public, max-age=31536000, immutable`, of
  which a browser honours the first — silently dropping every font and hashed asset to no-cache.
  Found by curling the asset URLs under `wrangler dev`, not by reading the file.

  The guards were verified by deliberately breaking the output: an injected `style=""`, an
  injected inline script and a fake phone number were all caught, exit 1. Editing the theme
  script changed the emitted hash, which is the whole point of generating it.
- 2026-09-11 — DSI-90, the responsive pass. Ported `responsive-check` from the FPL App project
  with one change: that version was screenshot-only, and this one measures first and looks
  second. The probe reports `scrollWidth` against `innerWidth` and **names the outermost
  offending element**, because a page can scroll sideways by 12px without anything looking
  wrong, and this pane's screenshots are unreliable anyway (`document.hidden` is true, which
  throttles animation).

  Twelve homepage combinations plus the 404 came back clean on horizontal scroll — including
  with the mobile menu open. The two real findings both came from looking at what the probe
  could not see:

  * The mobile menu left a **237px dead zone** under the header, making it 314px tall on every
    mobile load. Swapping `hidden` for the panel primitive traded `display: none` for
    `visibility: hidden`, which still occupies its box. Fixed by taking the panel out of flow.
    No overflow check would ever have caught it.
  * The bento reflowed to four columns from `sm`, giving 136px tiles at 1024 with a title
    wrapping to three lines — because the grid sits beside a 304px rail and has far less width
    than the viewport suggests. Now one column, two at `sm`, four at `xl`, which is what
    DSI-102 specified in the first place.
- 2026-09-11 — M2 committed (`e8603a5`) and ingested. Placeholder copy reduced to "Coming soon."
  after the first pass shipped section stubs naming their Linear issues in reader-visible text;
  that is now a rule in `CLAUDE.md` rather than a one-off fix. Ingest found no source drift —
  every file in `.manifest.json` still matches its hash, so nothing new arrived in
  `docs/sources/` or the vault snapshot. Tidy pass linked `content-guardrails.md` to the build
  guard that now actually enforces the phone-number rule, and recorded in `seo-and-metadata.md`
  that the OG base asset exists while the typographic cards wait for a generator.
