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
- 2026-09-11 — M2 pushed and live. First production load surfaced something no local run could:
  Cloudflare injects its Web Analytics beacon at the edge, the strict `script-src` refuses it,
  and every page view logs a violation (DSI-132, owner action, blocks DSI-105). Recorded in
  `security-headers.md` as the general lesson — a clean `wrangler dev` CSP run tests the policy
  against our own output only, never against what the platform adds on top.
- 2026-09-11 — DSI-90 closed on a real device. The owner walked the live site on an Android
  handset: both themes, the mobile menu, the 404 route and landscape, and reported no horizontal
  scroll. A screen recording corroborated the layout — tiles single-column, menu overlaying
  rather than pushing, mark correct in both themes — though a recording cannot evidence the
  *absence* of sideways scroll, since a failed swipe looks identical to no swipe. That
  distinction is now in the responsive-check skill.

  Landscape resolved a question raised before the check: content is inset away from the camera
  cutout with no `env(safe-area-inset-*)` handling, because the viewport meta omits
  `viewport-fit=cover`. Recorded in `CLAUDE.md` as a rule — going edge-to-edge later means
  taking on safe-area padding in the same change.

- **2026-09-11** — DSI-132 closed, and M2 with it. Cloudflare's automatic Web Analytics beacon
  injection was disabled in the dashboard (account home → Analytics & Logs → Web Analytics →
  Manage site → Disable), so `static.cloudflareinsights.com/beacon.min.js` is no longer sent
  rather than sent-and-blocked. The CSP was not widened: production still serves
  `script-src 'self' 'sha256-…'` and `connect-src 'self'` byte-identical to `headers.template`.
  Verified against the live site — zero `cloudflareinsights` references in the served HTML,
  console clean on `/`, `/404/` and an unmatched path, `www` 301 and `immutable` font caching
  intact.

  Two notes recorded in [security-headers.md](security-headers.md): a browser's own cached copy
  will keep showing the violation and a cache-busting query does not defeat it, so a negative
  result needs a fresh fetch before it is believed; and there is a header-only alternative
  (`Cache-Control: public, no-transform` blocks the edge transform) that was deliberately not
  taken, because it uses a caching header as a feature switch.

  This unblocks DSI-105 and preserves DSI-106's no-third-party-request budget.

- **2026-09-11** — M3 shipped: the homepage carries real content. Hero with the owner's own
  headline (DSI-91), proof strip and About (DSI-92), experience timeline (DSI-93), education and
  credentials (DSI-94), skills (DSI-95), contact with copy-to-clipboard (DSI-96), and a markdown
  resume at `/resume/` (DSI-97). Copy drafted from the MBA Brain vault and corrected by the
  owner.

  **The headline changed on his instruction.** "Product and analytics leader who builds" was
  rejected as overclaiming — his Wipro title was Project Engineer, and "leader" is a word he
  would have had to defend in an interview for a gain the site does not need. It is now
  "Building products with an analytical approach" / "Not afraid to get my hands dirty", his
  wording, split across the hero's two slots. Recorded in [profile.md](profile.md).

  **Repetition was the main editing problem.** The MBA appeared in the headline area, the proof
  strip, About and education; the survey figure appeared three times. The proof strip now has no
  MBA tile and About carries no numbers at all — every figure in it would have been its third
  appearance on one page.

  **The phone-number guard was measured and found broken in both directions** — see
  [content-guardrails.md](content-guardrails.md). It scanned a PDF's raw bytes, so it could not
  see text inside FlateDecode streams (the real resume carries four phone-shaped strings only
  visible after inflating) while matching binary font data 131 times in the same file, which
  would have made any PDF fail with unreadable noise. It now inflates streams and scans decoded
  text. Verified by copying the unredacted resume into `dist/`, confirming exit 1 with precise
  hits, then deleting it. Images are still not scanned and that is now written down.

  **The resume is markdown, not a PDF** (DSI-97). `src/pages/resume.md` is the resume; printing
  the page produces the document, which keeps a headless browser out of the build. The new
  resume also drops the personal Gmail address in favour of `contact@`, and marks the three
  self-reported Wipro figures, neither of which the original PDF did.

  **Visa status and work authorization are never published** — a new guardrail. A peer site
  reviewed for structure states all three; that is a legitimate choice and explicitly not this
  site's.

  A live peer site was reviewed for structure only and recorded in
  [design-references.md](design-references.md): stat tiles, one-line role summaries, tool chips.
  No copy, claims, palette or typography taken.
