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
| M5 · Launch (closed 2026-09-24) | 2026-10-08 | SEO, OG, headers audit, Lighthouse, QA, go-live |
| M6 · Beyond launch | — | Profile README, contact form, analytics, palette, fourth case study, writing |
| Design Improvements (closed 2026-09-18) | — | Findings from the `/better-interface`, `/landing-page-design`, `/find-animation-opportunities` and `/improve-animations` audits |
| Redesign (closed 2026-09-24) | 2026-09-24 | The reference-folder redesign (rail layout) and six owner-requested fixes: covers, FPL case study and synced updates, Fort Monroe cover, certificate images, tool logos, crisp university marks |

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
| Case study: FPL Decision (owner review closed 2026-09-24; revised in DSI-190) | DSI-99 | M4 | [case-study-fpl-decision.md](wiki/case-study-fpl-decision.md) |
| Case study: Abhijit Sinha website (owner review closed 2026-09-24) | DSI-100 | M4 | [case-study-abhijit-sinha-website.md](wiki/case-study-abhijit-sinha-website.md) |
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
| Redesign: homepage and case-study layout from the reference folder | DSI-188 | Redesign | [design-system.md](wiki/design-system.md), [site-architecture.md](wiki/site-architecture.md) |
| Covers fill their frames edge to edge | DSI-189 | Redesign | [design-system.md](wiki/design-system.md) |
| FPL Decision corrected, with a synced Recent Updates panel | DSI-190 | Redesign | [case-study-fpl-decision.md](wiki/case-study-fpl-decision.md) |
| Fort Monroe: new cover image | DSI-191 | Redesign | [log.md](wiki/log.md) |
| Certificates as images with a viewer; courses as preview cards | DSI-192 | Redesign | [content-guardrails.md](wiki/content-guardrails.md), [education-and-credentials.md](wiki/education-and-credentials.md) |
| Tool logos: toolkit and case-study stack chips | DSI-193 | Redesign | [skills.md](wiki/skills.md) |
| University logos crisp on high-density screens | DSI-194 | Redesign | [education-and-credentials.md](wiki/education-and-credentials.md) |
| Experience as cards with employer logos and detail dialogs | DSI-195 | Redesign | [site-architecture.md](wiki/site-architecture.md) |
| Recognition tile expands to the BGS certificate and the paper | DSI-196 | Redesign | [education-and-credentials.md](wiki/education-and-credentials.md) |
| SEO: metadata, canonical, sitemap, robots, structured data | DSI-103 | M5 | [seo-and-metadata.md](wiki/seo-and-metadata.md) |
| Security headers audit on production | DSI-105 | M5 | [security-headers.md](wiki/security-headers.md#production-audit-2026-09-24-dsi-105) |
| Lighthouse and accessibility audit | DSI-106 | M5 | [design-system.md](wiki/design-system.md) |
| Open Graph images | DSI-104 | M5 | [seo-and-metadata.md](wiki/seo-and-metadata.md) |
| Cross-device QA and link check | DSI-107 | M5 | this file |
| Go-live: final checklist, docs refresh, profile links | DSI-108 | M5 | [log.md](wiki/log.md) |
| Repo made public with fpl-app's safety rules | DSI-197 | M6 | [deployment-domain.md](wiki/deployment-domain.md#repository-safety) |
| Recognition tile: the whole card toggles the disclosure | DSI-198 | M6 | `src/components/WorkGrid.astro` |
| Contact band: LinkedIn and GitHub logos in the pills | DSI-199 | M6 | `src/components/Contact.astro` |
| Contact band: copy icon inside the email pill | DSI-200 | M6 | `src/components/Contact.astro`, `src/scripts/contact.js` |
| Cloudflare Web Analytics, CSP widened in the same change | DSI-111 | M6 | [security-headers.md](wiki/security-headers.md#cloudflare-web-analytics-2026-09-25-dsi-111) |
| Command palette | DSI-112 | M6 | [site-architecture.md](wiki/site-architecture.md#command-palette-dsi-112) |
| GitHub profile README, repos curated | DSI-109 | M6 | [github.com/Dsinha97](https://github.com/Dsinha97) |

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

**DSI-103 shipped 2026-09-24.** Open Graph and Twitter tags on every page, a `Person` node in a
`ProfilePage` on the homepage and an `Article` per case study referencing it by `@id`, and a
`robots.txt` pointing at the sitemap. Gate met on production: validator.schema.org reports 0
errors and 0 warnings on all four pages that carry JSON-LD. Both build guards gained a narrow,
parse-checked exemption for `application/ld+json` — see
[security-headers.md](wiki/security-headers.md#what-building-it-changed). The resume page's title
became "Resume — Deepayan Sinha" in the same commit.

**DSI-105 closed 2026-09-24.** Production audit after DSI-103/104 deployed: A+ from
securityheaders.com, zero CSP violations across every route with every popover opened and every
image forced to load, and all seven security headers on all sixteen URLs checked, assets
included. No change to the policy or the headers was needed.

**DSI-106 closed 2026-09-24.** Lighthouse mobile on production, both themes: every page at
95+/100/100/100 after `c587af1`. The homepage started at 93/94; its LCP was gated on total bytes,
fixed by making theme-paired covers lazy (both FPL variants had been downloading), a
width-based headshot srcset, and a static weight-400 JetBrains Mono (40KB to 21KB — see
[design-system.md](wiki/design-system.md)). Hover transforms are now `motion-safe:` so reduced
motion turns them off rather than making them instant. Two things recorded on the issue rather
than fixed: LCP is 2.2–2.7s under simulated slow 4G against a 1.5s target that is not part of
the gate, and the keyboard pass was checked by tab order and stylesheet rather than visually,
because the browser pane was not painting.

**DSI-104 closed 2026-09-24.** Build-time social cards (`/og/default.png` and one per case study),
rendered by satori in the site's fonts and rasterised by sharp, colours read from `global.css`.
The owner's LinkedIn Post Inspector pass found three blurry previews — LinkedIn's own 160px
thumbnail, from the same file it rendered sharp elsewhere — and no author or date anywhere. Fixed
with a content-hashed `?v=` on every `og:image`, `<meta name="author">`, and case-study
`published`/`updated` dates from git. Re-inspected clean on all five URLs. The SEO wiki page is
now `status: built`.

**DSI-107 closed 2026-09-24.** Zero broken internal references (463, fragments included) after
dropping the 404 page's canonical, which named a path with no file behind it. Every external link
loads; the three LinkedIn Learning certificates name the owner and match their listed course. The
MBA Math verification page renders no recipient name — kept at the owner's decision. Theme
persists across pages, Escape closes the mobile menu, slash-less URLs redirect and load, and the
owner checked Firefox, Safari and a real phone.

**DSI-108 closed and M5 closed 2026-09-24 — the site is launched.** Every earlier milestone gate
re-run against production in one sitting: 51 automated checks across M1–M5 (redirects, HSTS, 404
status, MX, all seven headers and the CSP on every page, 73 immutable assets, no third-party
origin, the content guardrails over every page *and* the resume PDF, the case studies, JSON-LD,
cards, sitemap), all passing. Lighthouse on the homepage in dark mode read 94, 93, 96, 95 across
four runs against a 95 target; the owner accepted it as noise at the threshold rather than a
regression — nothing byte-affecting had changed since DSI-106's 95–96. `private/` confirmed
absent from all history. README and CLAUDE.md now describe a launched site; the resume leads with
the site URL; the owner added it to LinkedIn and confirmed a test message to `contact@` arrives.
Still to do, deliberately not on launch day: the HSTS preload submission, after a week of clean
HTTPS (on or after 2026-10-01).

**DSI-197 closed 2026-09-24 — the repo is public.** Ruleset on `main` (no deletion, no
force-push, PR plus the `build` check required, no bypass) applied while still private, then the
flip, then fork-PR approval and secret scanning with push protection. A CI workflow runs
`npm run build`, so every build guard now also guards merges. Pre-flight swept all 47 commits,
not just the tree. Verified by a direct push to `main` being rejected and this change landing
through a PR. From here on, `main` changes only through a pull request.

**DSI-198/199/200 shipped 2026-09-25 (owner requests).** The Recognition tile's disclosure button
already stretched its `::after` over the whole card, but a click away from the button never
fired: `active:scale` made the button the overlay's containing block mid-press, the overlay shrank
to the button, and mouseup landed outside it. Press feedback moved to the `<li>` via `has-[…]`,
with a hover border so the card reads as one target. The Contact band's LinkedIn and GitHub pills
gained their logos. The "Copy" pill became an icon button from the owner's `copy.svg`, placed
*inside* the email pill: as a separate pill it wrapped below the address on a 375px phone
(address 231px at 16px), so below `sm` the envelope drops and the text is `text-sm` — measured on
one row at 360px with 22px spare. The button now ships `hidden` in markup and `contact.js` reveals
it only when the Clipboard API exists. Verified by computed style and DOM measurement in the dev
preview (the pane was not painting, so no screenshot); `npm run build` clean.

**DSI-111 closed 2026-09-25.** Cloudflare Web Analytics via the manual snippet (edge injection
stays off), with `script-src` and `connect-src` widened in the same PR. Gate met on production
about 80s after merge: the served CSP carries both origins, the beacon loads and POSTs to
`cloudflareinsights.com/cdn-cgi/rum` on `/` and a case study with a clean console, and the
endpoint's CORS preflight answers 200 with `Access-Control-Allow-Origin: https://deepayansinha.com`.
Locally the same POST is CORS-refused, which is what a correct setup looks like off the
registered host. The launch audits' "zero third-party requests" result no longer holds.

**DSI-112 shipped 2026-09-25.** A Ctrl/⌘+K (or `/`) command palette. Gate met: 1.2KB gzipped
for the palette, 3.4KB for all first-party JavaScript, about 13.5KB for the whole site including
DSI-111's 10.1KB beacon — inside the ~15KB budget, with the beacon now the largest single cost.
Verified in the dev preview by script: opens from both shortcuts and the header trigger, filters
(multi-word), shows an empty state, wraps with the arrow keys, runs navigation, copy and theme,
resolves section links to `/#…` off the homepage, and leaves the header without overflow at
1024px. `npm run build` clean.

**DSI-109 closed 2026-09-25.** A profile README at `Dsinha97/Dsinha97`, laid out after a peer's
profile at the owner's request: static label badges only (no stats widgets), featured work for
FPL Decision, the Abhijit Sinha site, this portfolio and Fort Monroe, each linking its case study.
Every claim is taken from the case studies or the resume; the three self-reported Wipro figures,
the client name and platform names are left out. The three live projects' repos gained
descriptions, homepages and topics; the five 2019–20 tutorial forks and `LPC-Team-3` were
archived at the owner's direction.

## Open

| Issue | Item | Milestone | Gate / blocker |
|---|---|---|---|
| DSI-110 | Contact form | M6 | **Blocked** — owner decides the form is worth a backend, a database and a CSP widening |
| DSI-113 | Fourth case study: Wipro | M6 | **Blocked** — owner decides whether enough survives genericization to carry a page |
| DSI-114 | Writing or notes section | M6 | **Blocked** — owner has at least three pieces drafted |
| DSI-201 | HSTS preload submission | M6 | On or after 2026-10-01, hstspreload.org reports eligible — see [deployment-domain.md](wiki/deployment-domain.md) |

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
