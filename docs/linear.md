# Linear ↔ docs

The join between this repo and the Linear project.
**[Deepayan-Portfolio](https://linear.app/dsinha-org/project/deepayan-portfolio-4de86f94d1f2)**,
team `Dsinha Org` (`DSI`). Any issue's URL is `https://linear.app/dsinha-org/issue/<id>`.

**Linear owns what is planned and what its status is** — priority, milestone, backlog order, open
or done. **`docs/` owns what happened and why** — the wiki, the decisions, the measured results,
the things tried and rejected. Neither restates the other: an issue links the doc that states its
gate rather than copying it into a second place where it can rot.

## Milestones

| Milestone | Target | Covers |
|---|---|---|
| M0 · Foundation | 2026-09-12 | Repo, private boundary, wiki, Linear setup |
| M1 · Scaffold and deploy | 2026-09-17 | Astro and Tailwind skeleton, tokens, Workers deploy, apex domain, email |
| M2 · Shell and design system | 2026-09-22 | Layout, theme toggle and CSP pipeline, fonts, logo, responsive pass |
| M3 · Content | 2026-09-29 | Hero, about, experience, education, skills, contact, resume |
| M4 · Case studies | 2026-10-03 | Collections and schema, three case studies, work index |
| M5 · Launch | 2026-10-08 | SEO, OG, headers audit, Lighthouse, QA, go-live |
| M6 · Beyond launch | — | Profile README, contact form, analytics, palette, fourth case study, writing |
| Design Improvements (closed 2026-09-18) | — | Findings from the `/better-interface`, `/landing-page-design`, `/find-animation-opportunities` and `/improve-animations` audits |

## Shipped

| Item | Issue | Milestone | Doc |
|---|---|---|---|
| Repo, private boundary, first push | DSI-78 | M0 | [CLAUDE.md](../CLAUDE.md) |
| Build docs/wiki from the sources | DSI-79 | M0 | [wiki/index.md](wiki/index.md) |
| Linear mapping doc, skills, weekly drift check | DSI-80 | M0 | this file, and `.claude/skills/` |
| Scaffold Astro 5 and Tailwind 4 | DSI-81 | M1 | [site-architecture.md](wiki/site-architecture.md) |
| Design tokens: purple and teal, light and dark | DSI-82 | M1 | [design-system.md](wiki/design-system.md) |
| Apex domain, www redirect, HTTPS and HSTS | DSI-84 | M1 | [deployment-domain.md](wiki/deployment-domain.md) |
| Email routing for contact@deepayansinha.com | DSI-85 | M1 | [deployment-domain.md](wiki/deployment-domain.md) |
| Cloudflare Workers static-assets deploy via Git integration | DSI-83 | M1 | [deployment-domain.md](wiki/deployment-domain.md) |
| Kintsugi theme: ceramic grounds and gold seam | DSI-115 | M2 | [design-system.md](wiki/design-system.md) |
| Logo: traced vector mark, favicons, OG base | DSI-89 | M2 | [design-system.md](wiki/design-system.md) |
| Self-hosted typography and the spacing scale | DSI-88 | M2 | [design-system.md](wiki/design-system.md) |
| BaseLayout, header, footer, navigation, 404 | DSI-86 | M2 | [site-architecture.md](wiki/site-architecture.md) |
| Theme toggle, no-flash init, CSP hash pipeline | DSI-87 | M2 | [security-headers.md](wiki/security-headers.md) |
| Design references reviewed and folded into the plan | DSI-131 | M2 | [design-references.md](wiki/design-references.md) |
| Responsive pass across breakpoints and both themes | DSI-90 | M2 | `.claude/skills/responsive-check/` |
| Hero: headline, sub-line and headshot | DSI-91 | M3 | [profile.md](wiki/profile.md) |
| Proof strip and About | DSI-92 | M3 | [profile.md](wiki/profile.md) |
| Experience timeline | DSI-93 | M3 | [experience.md](wiki/experience.md) |
| Education, credentials and recognition | DSI-94 | M3 | [education-and-credentials.md](wiki/education-and-credentials.md) |
| Skills matrix | DSI-95 | M3 | [skills.md](wiki/skills.md) |
| Contact section with copy-to-clipboard | DSI-96 | M3 | [content-guardrails.md](wiki/content-guardrails.md) |
| Markdown resume and the /resume/ route | DSI-97 | M3 | [site-architecture.md](wiki/site-architecture.md) |
| Case-study content collection, schema and page template | DSI-98 | M4 | [site-architecture.md](wiki/site-architecture.md) |
| Case study: Fort Monroe consultancy | DSI-101 | M4 | [case-study-fort-monroe.md](wiki/case-study-fort-monroe.md) |
| Work index: bento grid | DSI-102 | M4 | [site-architecture.md](wiki/site-architecture.md) |
| Edge-injected analytics beacon removed at source | DSI-132 | M2 | [security-headers.md](wiki/security-headers.md) |
| Case-study `<h1>` fixed to use a real type token | DSI-157 | Design Improvements | [design-system.md](wiki/design-system.md) |
| Work-card thumbnails switched off the third-party-logo plate token | DSI-165 | Design Improvements | [design-system.md](wiki/design-system.md) |
| Press/active feedback added to every interactive element | DSI-158 | Design Improvements | `docs/sources/animation-plans/001-press-feedback.md` |
| Update FPL Decision cover image | DSI-177 | Design Improvements | [case-study-fpl-decision.md](wiki/case-study-fpl-decision.md) |
| Header shrink-on-scroll no longer animates `padding` | DSI-159 | Design Improvements | [design-system.md](wiki/design-system.md), `docs/sources/animation-plans/002-header-shrink-no-layout-transition.md` |
| In-page anchors no longer land under the sticky header | DSI-174 | Design Improvements | `src/styles/global.css` |
| Portrait case-study covers use the same 16:9 frame as landscape ones | DSI-172 | Design Improvements | `src/pages/work/[slug].astro` |
| Theme-toggle and hamburger icon swaps cross-fade instead of teleporting | DSI-160 | Design Improvements | [design-system.md](wiki/design-system.md), `docs/sources/animation-plans/004-icon-swap-crossfade.md` |
| Recognition bento tile reads as a jump-to-section anchor, not a project card | DSI-171 | Design Improvements | `src/pages/index.astro` |
| Light/dark theme switch transitions colors instead of snapping | DSI-162 | Design Improvements | `src/styles/global.css` |
| Email icon redrawn as a 24×24 stroke outline matching GitHub/LinkedIn | DSI-169 | Design Improvements | `src/components/IconEmail.astro` |
| Bento work-card hover scale shortened to 200ms with deliberate easing | DSI-164 | Design Improvements | `src/pages/index.astro` |
| Uppercase labels unified on the shared `text-label` token | DSI-170 | Design Improvements | `src/components/Education.astro`, `src/pages/work/[slug].astro` |
| Spacing values snapped to the 8-point scale; chip padding documented | DSI-167 | Design Improvements | [design-system.md](wiki/design-system.md) |
| Copy-to-clipboard button label crossfades instead of cutting | DSI-163 | Design Improvements | `src/scripts/contact.js` |
| Case-study metric qualifier no longer uses synthesized italics | DSI-166 | Design Improvements | `src/pages/work/[slug].astro` |
| Headings and body copy get `text-wrap: balance`/`pretty` | DSI-168 | Design Improvements | `src/styles/global.css` |
| Social-link tooltip settles into place instead of blinking on | DSI-161 | Design Improvements | [design-system.md](wiki/design-system.md), `docs/sources/animation-plans/003-tooltip-physical-entrance.md` |
| Resume bullet's "deliver-/deliverables" repetition rephrased | DSI-173 | Design Improvements | `src/pages/resume.md` |
| Active nav-link no longer swaps font-weight on scroll | DSI-175 | Design Improvements | `src/components/Header.astro` |

**M1 closed 2026-09-11.** Astro/Tailwind scaffold, tokens, Workers deploy with push-to-deploy on
`main`, apex domain with `www` redirect and HSTS, and `contact@` email routing are all live.

**M2 closed 2026-09-11.** The shell, the ceramic/kintsugi token system, the traced mark, the
typography and the CSP pipeline are all built, committed and live.
**DSI-90 closed on device**: clean in emulation at all six breakpoints in both themes, and
confirmed by the owner on an Android handset — both themes, the mobile menu, the 404 route and
landscape. **DSI-132 closed at source**: automatic beacon injection was disabled in the Cloudflare
dashboard, so the script is no longer sent rather than sent-and-blocked. Verified on production —
zero `cloudflareinsights` references in the served HTML, console clean on `/`, `/404/` and an
unmatched path, and the CSP byte-identical to `headers.template` with no directive widened. That
unblocks DSI-105 and keeps DSI-106's no-third-party-request budget intact.

**M3 closed 2026-09-11.** The homepage carries real content: hero, proof strip, experience
timeline, skills, education and contact, plus a markdown resume at `/resume/`. The copy was
drafted from the MBA Brain vault and corrected by the owner — the headline was softened away
from "leader" toward individual contributor at his direction, and every section was cut for
length and de-duplicated against the others.

Two guardrail changes came out of it, both in [content-guardrails](wiki/content-guardrails.md):
the phone rule is now explicitly per-repository rather than per-page, and the PDF scan in
`check-dist.mjs` was rewritten after being measured as broken in both directions. Visa status and
work authorization are now explicitly never published.

**DSI-98 shipped 2026-09-12.** Six Zod-validated content collections (`work` in markdown;
`experience`, `education`, `certifications`, `skills`, `recognition` in YAML) and the
`/work/<slug>/` page template. `experience`, `education`, `certifications` and `skills` moved out
of `src/data/profile.ts` into collections with the same content; `proof`, `about` and the trailing
`tools` row stay in `profile.ts` since they aren't one of the six. The gate was verified by hand:
a required field removed from a YAML entry failed `astro check` with a precise schema error, then
was restored. `work` has zero entries — DSI-99/100/101 add them — so the template generates no
routes yet and the homepage's case-study links stay unshown, same as before this issue.

**DSI-101 shipped 2026-09-12.** The Fort Monroe case study, written from
[case-study-fort-monroe.md](wiki/case-study-fort-monroe.md) under `claimScope: engagement-outcomes`.
The cover is Fort Monroe's own public logo (`images/FM square outlook.png`, copied to
`public/work/`), plated the same way the template treats it now — `object-contain` on a bordered
surface, not the stretch-to-fill `object-cover` DSI-98 shipped untested. The Experience timeline's
"See the case study" link now resolves live. Verified by hand: a grep of the built page for the
mis-migrated parking figure and the benchmark site's name returns nothing, and the STAR action
field was rewritten shorter after the first pass produced a lopsided four-column grid — the detail
moved into the body under "The four deliverables" instead.

**DSI-100 written, awaiting owner review 2026-09-12.** The Abhijit Sinha website case study,
written from [case-study-abhijit-sinha-website.md](wiki/case-study-abhijit-sinha-website.md)
under `claimScope: own-outcomes`. Cover is the site's own public hero banner, resized to 1200px
and re-encoded as WebP with `sharp` (1.0MB PNG → 63KB) rather than shipped at source size. Unlike
DSI-101's mechanical guardrail-grep gate, this issue's gate is owner review — set to **In Review**
in Linear rather than Done, and left off the Shipped table below until that review happens.

**DSI-99 written, awaiting owner review 2026-09-12.** The FPL Decision case study, written from
[case-study-fpl-decision.md](wiki/case-study-fpl-decision.md) under `claimScope: own-outcomes`.
Cover is a real screenshot of the app's own public landing page
(`FPL App/Screens/Landing-NotSigned.png`, 1920×1080 PNG resized to 1400px wide and re-encoded as
WebP at 22KB) rather than a borrowed brand asset — the first of the three case studies where a
genuine product screenshot exists. Same gate as DSI-100: owner review, so it's **In Review** in
Linear, not Done.

**DSI-102 shipped 2026-09-12.** The homepage's placeholder bento tiles now render the three real
`work` entries plus a Recognition tile linking to `#education`, all as real `<a>` elements with
`:focus-visible` outlines — verified via keyboard tab, not just class names. Reflow measured with
the responsive-check skill's overflow probe (`scrollWidth <= innerWidth`, not eyeballed) at 375,
768 and 1280 in both themes: clean at every width. Two things needed fixing along the way, both
caught by measuring rather than assuming: the large tile's `xl:row-span-2` left an empty mid-grid
cell at 1280 because 8+4 mediums+small (20 columns of content) doesn't divide evenly into 12, so
it's full-width instead and the three smaller tiles fill the next row exactly; and Fort Monroe's
portrait-shaped cover was cropping its own name under `object-cover`, fixed by switching the
bento thumbnails to the same `object-contain`-on-a-plate treatment DSI-101 already used on the
case-study page itself.

**DSI-157/165/158 shipped 2026-09-17.** Three findings from the `/better-interface`,
`/landing-page-design`, `/find-animation-opportunities` and `/improve-animations` audits. DSI-157:
the case-study `<h1>` used `text-h1`, an undefined Tailwind token, and silently fell through to
Preflight's body-size reset — swapped for the existing `text-display` token; verified live at
68px instead of 16px. DSI-165: the homepage work-card thumbnails sat on `bg-mark-plate`, a
deliberately theme-invariant tile reserved for third-party institution marks in
`Education.astro` — switched to `bg-surface-2` so they follow theme like every other surface.
DSI-158: added `active:scale-[0.97]`/`[0.98]` press feedback to all twelve files enumerated in
`docs/sources/animation-plans/001-press-feedback.md`. That plan's own example was wrong in one
respect, caught while verifying with `getComputedStyle`: `transition-colors` and
`transition-transform` as separate Tailwind utilities don't compose — each sets the whole
`transition-property` value, so the later one silently drops the earlier one's properties. Fixed
by merging into single arbitrary-value utilities per element (e.g. `transition-[color,transform]`)
instead of stacking two `transition-*` utilities.

**DSI-177 shipped 2026-09-18.** The FPL Decision case-study cover was replaced with an updated
landing-page screenshot attached to the issue, processed the same way as the original DSI-99
cover — resized to 1400px wide and re-encoded as WebP with `sharp` (1893×946 PNG → 35KB WebP).
Verified live on the case-study page in the dev preview.

**DSI-159/174/172 shipped 2026-09-18.** Three Medium-priority findings from the same audit.
DSI-159 reverses a previously-argued design exception: the header's `padding` shrink transition
is deleted from `Header.astro` per the existing implementation plan, leaving the logo's
`transform`-based shrink as the sole animated cue — `design-system.md`'s Motion section rewritten
to reflect the reversal rather than left "planned." DSI-174 adds `scroll-margin-top: 6rem` on
`main section[id]` and `html { scroll-behavior: smooth; }` in `global.css`, verified by scripted
`getBoundingClientRect()` comparison against the sticky header's bottom edge rather than
eyeballing. DSI-172 gives the case-study cover container the same `aspect-[16/9] w-full`
treatment the homepage bento cards already use, so the Fort Monroe portrait cover no longer
renders narrow with empty padding. All three verified in the dev preview; `npm run check` clean.

**DSI-160/171/162/169 shipped 2026-09-18.** Four more Medium-priority findings from the same
audit. DSI-160 replaces both the theme-toggle sun/moon and the header hamburger/X `display`
toggles with opacity+scale cross-fades, per the existing implementation plan — confirmed
CSS-only (no `display` swap left in the diff) and the no-flash-on-first-paint guarantee still
holds with no `data-theme` attribute set. DSI-171 gives the Recognition bento tile a dashed
border and a "JUMP TO →" eyebrow label (the `text-label` token) so it reads as a distinct
affordance from the solid-card project tiles beside it. DSI-162 adds a narrowly-scoped
`background-color`/`color`/`border-color`/`fill`/`stroke` transition to `html`, `body` and the
logo mark's three parts — not `transition: all`, which would fight per-component transitions —
collapsed to instant by the existing reduced-motion rule. DSI-169 redraws `IconEmail.astro` from
a 40×40 filled path to a 24×24 stroke outline envelope matching `IconGitHub`/`IconLinkedIn`'s
optical weight. All four verified in the dev preview (including a mobile-viewport check of the
hamburger crossfade); `npm run build` clean, including the header-hash and dist guards.

**Design Improvements milestone closed 2026-09-18.** The remaining nine Low-priority findings
from the same 2026-09-17 audit shipped in one pass: DSI-164 (hover-scale timing), DSI-170 (label
token unification), DSI-167 (8-point spacing snap, plus documenting the `px-2.5 py-1` chip
padding as a deliberate named exception rather than silently diverging from the scale), DSI-163
(copy-button crossfade, verified end-to-end including the failure path — clipboard writes fail
in the headless preview, which incidentally proved the "Copy failed" state works), DSI-166
(dropped synthesized italics), DSI-168 (`text-wrap: balance`/`pretty`), DSI-161 (tooltip physical
entrance per its implementation plan, confirmed via `getComputedStyle`'s `translate` property),
DSI-173 (resume wording, no factual change) and DSI-175 (dropped the nav font-weight swap that
could nudge sibling links). All 20 issues opened under this milestone are now Done; `npm run
check` and `npm run build` both clean, including the header-hash and dist guards (the resume
wording touches the PDF pipeline too).

**FPL Decision cover made theme-aware, 2026-09-18 (ad hoc, not a Linear issue).** The app's own UI
is purple-on-white in light mode, so the single dark-mode screenshot DSI-177 shipped didn't read
correctly against the site's light theme. Added `work.coverLight` (optional, schema in
`content.config.ts`) and a `.theme-cover__light`/`.theme-cover__dark` CSS pair in `global.css`
mirroring the theme-toggle's existing light/dark precedence — plain `display` swap, not a
cross-fade, since a static cover has no interaction to animate from. `fpl-decision.md` now carries
both images; the other two case studies are unaffected since `coverLight` is optional. Verified by
setting `data-theme` directly and checking computed `display` on both `<img>` elements, on both the
homepage bento tile and the case-study page; `npm run build` clean.

## Open

| Issue | Item | Milestone | Gate / blocker |
|---|---|---|---|
| DSI-99 | Case study: FPL Decision | M4 | In review — [case study](wiki/case-study-fpl-decision.md) |
| DSI-100 | Case study: Abhijit Sinha website | M4 | In review — [case study](wiki/case-study-abhijit-sinha-website.md) |
| DSI-103 | SEO: metadata, sitemap, structured data | M5 | Schema validator reports zero errors — [seo-and-metadata.md](wiki/seo-and-metadata.md) |
| DSI-104 | Open Graph images | M5 | Each URL renders its card in a real link preview |
| DSI-105 | Security headers audit on production | M5 | Zero CSP violations across every route; A grade externally |
| DSI-106 | Lighthouse and accessibility audit | M5 | 95+/100/100/100 on the deployed site, both themes, no third-party requests |
| DSI-107 | Cross-device QA and link check | M5 | Zero broken links |
| DSI-108 | Go-live | M5 | Full checklist green on production in one sitting; wiki `status` flipped to `built` |
| DSI-109 | GitHub profile README | M6 | None. Owner decision on scope |
| DSI-110 | Contact form | M6 | **Blocked** — owner decides the form is worth a backend, a database and a CSP widening |
| DSI-111 | Privacy-preserving analytics | M6 | CSP widened in the same change; beacon confirmed reaching its endpoint |
| DSI-112 | Command palette | M6 | Only if the site stays inside its JavaScript budget with it included |
| DSI-113 | Fourth case study: Wipro | M6 | **Blocked** — owner decides whether enough survives genericization to carry a page |
| DSI-114 | Writing or notes section | M6 | **Blocked** — owner has at least three pieces drafted |
| DSI-164 | Bento work-card image hover scale has no deliberate easing | Design Improvements | Verified in dev preview |
| DSI-170 | Uppercase labels use two hand-rolled sizes instead of `text-label` | Design Improvements | Verified in dev preview |
| DSI-167 | Several spacing values fall outside the 8-point step scale | Design Improvements | Verified in dev preview |
| DSI-163 | Copy-to-clipboard button label swaps with a hard text cut | Design Improvements | Verified in dev preview |
| DSI-166 | Case-study metric qualifier uses `italic` with no italic face loaded | Design Improvements | Verified in dev preview |
| DSI-168 | No `text-wrap: balance`/`pretty` — headings can orphan words | Design Improvements | Verified in dev preview |
| DSI-161 | Social-link tooltip fades in with no physical entrance | Design Improvements | Verified in dev preview |
| DSI-173 | Resume bullet repeats "deliver-" twice in one clause | Design Improvements | Verified in dev preview |
| DSI-175 | Active nav-link font-weight swap on scroll can nudge sibling links | Design Improvements | Verified in dev preview |

## How to keep it true

- **New work starts as a Linear issue**, not as a line in a doc. The dashboard is where priority
  and order are set.
- **A shipped item closes its issue** and moves from the Open table to the Shipped table above.
- **An issue with no row here, and a doc item with no issue, are both drift.** `/linear-sync`
  reports both directions; it does not silently fix either.
- **Don't copy a gate into Linear.** Link the doc that states it — a gate has exactly one home,
  and it isn't here.
- **The drift check runs itself.** A scheduled task fires `/linear-sync` every Monday morning and
  stays silent when the two sides agree. A report from it is a signal, not noise.
- **The wiki's `status` field is checked too.** A page marked `planned` whose issue is closed, or
  `built` whose issue is open, is drift. It is the only place a doc claims something is built, so
  it is the only place that claim can silently go stale.
