---
title: "Site Architecture"
type: reference
tags: [astro, routes, content-model]
sources:
  - docs/sources/portfolio-website-plan.md
  - "C:/Abhijit-Sinha-Website/CLAUDE.md"
related:
  - design-system.md
  - deployment-domain.md
  - content-guardrails.md
updated: 2026-09-10
status: built
---

# Site Architecture

> Astro 5 with Tailwind 4, static output, six typed content collections, one page plus three
> case studies and a resume.

**Status: built, mostly.** The Astro 5 + Tailwind 4 scaffold, config, `src/data/site.ts`, the six
content collections, the `/work/<slug>/` template, all three case studies and the homepage bento
work index are up (DSI-81, DSI-98 to DSI-102). DSI-99 and DSI-100 are written and built but filed
in review pending the owner's sign-off on their content, not on anything left to build.

## Framework decisions

**Astro 5, pinned.** `npm view astro version` now returns 7.x, so an unpinned
`npm create astro@latest` would scaffold a major version this design was not written against.
Pin `astro@^5.18`. The sibling site at abhijitsinha.in runs the same line, which means its
patterns transfer without translation.

**Tailwind 4 via `@tailwindcss/vite`.** The `@astrojs/tailwind` integration is deprecated. This
is the main place the Abhijit site cannot be copied verbatim — it runs Tailwind 3 with a
JavaScript config. The differences worth knowing before porting a component:

| Abhijit (Tailwind 3) | Here (Tailwind 4) |
|---|---|
| `@astrojs/tailwind` plus `tailwind.config.mjs` | `@tailwindcss/vite`, no config file |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| colours in `theme.extend` | `@theme` and `@theme inline` in CSS |
| `darkMode: 'class'` | `@custom-variant dark (...)` |
| `min-h-[44px]` | `min-h-11` |
| default border colour grey | default is `currentColor`, so always set one |
| `shadow-sm`, `rounded`, `outline-none` | renamed `shadow-xs`, `rounded-sm`, `outline-hidden` |
| explicit `content:` scan list | automatic, but concatenated class names generate nothing |

**Config.** `site` hardcoded to the apex; `trailingSlash: 'always'`; `build.format: 'directory'`;
`build.inlineStylesheets: 'never'` and `vite.build.assetsInlineLimit: 0`. The last two exist so
the Content Security Policy can stay on `'self'` — without them the framework inlines small
scripts and styles and violates the policy on every page. That was learned the hard way on the
Abhijit site; see [security-headers](security-headers.md).

## Single source of truth

`src/data/site.ts` holds the name, headline, email, links, nav and resume path. Components read
from it; nothing is hardcoded inline. This is lifted directly from the Abhijit site, where the
same module holds the regulatory identifiers, and it exists for the same reason: a value that
appears in two places will eventually disagree with itself.

`src/data/jsonld.ts` builds the structured data from that module — a `Person` node with a stable
`@id`, a `ProfilePage` for the homepage, and an `Article` per case study that references the
person by id rather than repeating it.

## The shell

Built in DSI-86. One layout, [`src/layouts/BaseLayout.astro`](../../src/layouts/BaseLayout.astro),
mounting `Head`, `Header`, the slot and `Footer`. Every page uses it, including `404.astro`,
which is the whole point of a static 404: a reader who lands on one can navigate out.

| File | Role |
|---|---|
| `layouts/BaseLayout.astro` | skip link, header, `<main>`, footer |
| `components/Head.astro` | title, description, canonical, icons, font preload |
| `components/Header.astro` | sticky bar, mark, nav, resume link, theme-toggle slot |
| `components/Footer.astro` | name, year, the three published channels, colophon |
| `scripts/header.js` | shrink on scroll, mobile menu, which section is current |
| `components/ThemeToggle.astro` | the toggle button, both icons, CSS picks one |
| `scripts/theme-init.js` | **inline**, pre-paint, the only hashed script |
| `scripts/theme.js` | click handling, persistence, label sync |

Five things that needed deciding rather than typing:

- **Nav entries are two different kinds and cannot be tested the same way.** `#work` is a
  position, not a route: its current state is whichever section the reader is looking at, set at
  runtime by an `IntersectionObserver`. `/resume/` is a route, and comparing it to the current
  path needs a trailing slash stripped from both sides first, because `trailingSlash: 'always'`
  gives nested pages one that `/` does not have — a raw comparison silently never matches. Off
  the homepage the hash entries are also rewritten to `/#work`, or they resolve against the
  current page and go nowhere.
- **The scroll-spy uses `rootMargin: '-20% 0px -70% 0px'`.** "Current" should mean "at the top of
  what you are reading", not "anywhere on screen"; without the margin every section from the
  header to the fold counts and two entries light up at once.
- **`header.js` is a bundled module, not an inline script.** Astro emits it under `/_astro/`, so
  `script-src 'self'` covers it with no hash. Only the theme-init script (DSI-87) has to be
  inline, because it must run before first paint. Nothing in `header.js` is load-bearing: with
  JavaScript off the header simply stays full height, the mobile menu is a plain anchor list,
  and no entry is marked current.
- **The classes that script toggles are the Tailwind static-string trap.** `py-2`, `py-4` and
  `scale-90` exist in the stylesheet *only* because they appear as whole literals in a scanned
  source file. Assemble one by concatenation and Tailwind emits no rule, the header stops
  shrinking, and nothing errors. Verified in the built CSS, not just in dev.
- **The mobile menu is absolutely positioned, not in flow.** It animates on opacity and
  visibility rather than `display`, and `visibility: hidden` still occupies its box — so the
  closed panel left a 237px dead zone under the header on every mobile page load, making the
  header 314px tall. Out of flow it overlays the page the way a dropdown should. Measured by the
  responsive pass (DSI-90); it was invisible to every check that only looked for horizontal
  scroll, because a dead zone does not overflow anything.
- **`<main>` carries `tabindex="-1"`.** Without it, following the skip link scrolls but does not
  move focus, so the next Tab carries on from the skip link and the reader is back in the
  header — which is the exact failure the skip link exists to prevent.

The mark is mounted in the header only. It is around 17KB of inline SVG per instance, and the
footer does not need a second copy.

## Content collections

Six collections, Astro 5 content layer, Zod-validated. Markdown for the case studies, YAML for
everything that is a list of records.

| Collection | Loader | Holds |
|---|---|---|
| `work` | glob, markdown | the three case studies |
| `experience` | YAML file | four roles |
| `education` | YAML file | two degrees |
| `certifications` | YAML file | nine certificates with verification URLs |
| `skills` | YAML file | four groups |
| `recognition` | YAML file | Beta Gamma Sigma, the ICPAT-19 paper |

Two schema fields carry rules rather than data:

**`work.claimScope`** is a required enum, `own-outcomes` or `engagement-outcomes`, with no
default. A new case study cannot be added without choosing one. `engagement-outcomes` makes the
layout render a visible footnote saying the results describe deliverables and the client
response, not the client's later business outcomes. Fort Monroe is the only entry using it. The
rule itself lives in [content-guardrails](content-guardrails.md) and is not restated in the
schema — the schema enforces it, the guardrails page explains it.

**`experience.genericised`** is a boolean, true for Wipro. It marks an entry whose client and
vendor names must never appear, so the constraint travels with the data instead of living only
in someone's memory.

Case-study frontmatter also carries a STAR block (situation, task, action, result), up to four
metrics with optional qualifiers, a stack list, typed links (live, repo, document), a cover
image, and a bento size.

## Routes

| Route | Notes |
|---|---|
| `/` | the single page, anchor-linked sections |
| `/work/<slug>/` | `fpl-decision`, `abhijit-sinha-website`, `fort-monroe-consultancy` |
| `/resume/` | HTML resume rendered from `src/pages/resume.md`. **No PDF viewer** — print the page |
| `/404` | emitted as `dist/404.html`, served by the Worker |
| `/sitemap-index.xml` | from `@astrojs/sitemap` |
| `/robots.txt` | static, `Allow: /` |

**The resume is markdown, not a PDF (DSI-97, shipped 2026-09-11).** `src/pages/resume.md`
renders through `layouts/ResumeLayout.astro` and *is* the resume — there is no second copy to
drift out of sync. The plan above said "a prominent PDF link"; the owner asked for the content
displayed as a page rather than a PDF screen, and that is the better default anyway: a PDF in an
iframe is unreadable on a phone, invisible to text search, and hostile to a screen reader.

**The PDF is a real download at `/resume.pdf`** (added 2026-09-12 at the owner's request —
asking a reader to email for a copy is friction on the one artifact a recruiter actually wants).
`scripts/build-resume-pdf.mjs` generates it during the build **from the same markdown**, so the
two cannot disagree: neither is a copy of the other.

It is written with no dependency at all — a ~350-line generator emitting base-14 Helvetica text
objects. That is deliberate. A headless browser would have added ~200MB of Chromium to a build
that installs in 90 seconds, and the base-14 faces need no embedding, which keeps the file at
~4KB and the text real: selectable, searchable, and readable by the applicant tracking systems
that open it first. Matching the site's display typography is not worth either cost.

Printing the page still works too — the print rules in `global.css` strip the header, footer and
page chrome and force a light palette regardless of theme.

`/resume.pdf` is written into `dist/`, so it 404s under `astro dev`. Same arrangement as
`dist/_headers`, same reason: it is generated rather than authored, and a copy in `public/`
would be a second artifact free to go stale.

`.resume` carries the only element selectors in `global.css`, because a markdown route produces
bare tags with no utility classes to hang styles on.

There is no `/cv`; `/resume/` is the single canonical path. `www` never serves anything — see
[deployment-domain](deployment-domain.md).

## Homepage section order

Restructured in DSI-131 from the bento.me and portrait.so references: a **sticky identity rail**
beside a scrolling content column, rather than a hero the reader scrolls past and loses.

**Left rail** (`components/IdentityRail.astro`) — sticky from `lg` up, stacked and static below
it. Mark, name, positioning line, the three published channels, resume. Identity stays on screen
while the work scrolls past it.

**Right column**, in order:

1. **Selected work** — asymmetric bento tiles, size carrying hierarchy. FPL Decision large, the
   Abhijit site and Fort Monroe medium, a recognition tile alongside.
2. **Proof strip** — the four facts from [profile](profile.md), as mono-labelled tiles.
3. **Capabilities** — the four skill groups as chips, no proficiency bars.
4. **Experience** — the timeline, reverse chronological.
5. **Education and credentials** — degrees, certificates grouped by category, recognition.
6. **About** — three short first-person paragraphs.
7. **Contact** — email with a copy button, LinkedIn, GitHub, resume.

Work now comes first in the column because the rail already answers "who is this" before the
reader scrolls at all — which is what the hero used to do with a whole screen.

**The rail does not replace the header.** The header carries the theme toggle, the resume link
and the nav, and it has to exist on the case-study pages and the 404 where there is no rail. The
rail sticks *below* the header rather than competing with it. On a phone it is neither sticky
nor a column: a sticky rail on a 375px screen eats half the viewport.

## Case study page



Breadcrumb, then title, tagline, role, period and stack chips, then the links row, cover image,
the STAR block as four columns collapsing to a stack, the metric row, the long-form body, the
claim-scope footnote where applicable, then previous and next, then a contact call to action.
No dead ends: every case study offers somewhere to go next.

## What is deliberately not built

No contact form, no database, no analytics in the first version. Each would add a backend, a
secret to manage and a CSP widening, for a personal site whose entire contact need is an email
address. They are recorded as later work rather than dropped.

## Sources

- [portfolio-website-plan.md](../sources/portfolio-website-plan.md) — the bento grid, progressive
  disclosure and STAR case-study structure, which is the part of it worth keeping
- Abhijit site `CLAUDE.md` — the single-source-of-truth module and the shared layout pattern
