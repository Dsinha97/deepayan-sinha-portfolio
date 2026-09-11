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

**Status: built, partially.** The Astro 5 + Tailwind 4 scaffold, config and `src/data/site.ts`
are up (DSI-81). The content collections, full route set and homepage sections below are still
M3/M4 work.

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
| `/resume/` | HTML resume from the collections, with a prominent PDF link |
| `/404` | emitted as `dist/404.html`, served by the Worker |
| `/sitemap-index.xml` | from `@astrojs/sitemap` |
| `/robots.txt` | static, `Allow: /` |

There is no `/cv`; `/resume/` is the single canonical path. `www` never serves anything — see
[deployment-domain](deployment-domain.md).

## Homepage section order

1. **Header** — sticky, shrinks on scroll, logo mark, anchor nav, resume link, theme toggle.
2. **Hero** — name, headline, value line, two calls to action, social icons, headshot with
   explicit dimensions and eager loading so the layout never shifts.
3. **Proof strip** — the four facts from [profile](profile.md), as mono-labelled tiles.
4. **Selected work** — bento grid. FPL Decision large, the Abhijit site and Fort Monroe medium,
   with a small recognition tile alongside.
5. **Capabilities** — the four skill groups as chips, no proficiency bars.
6. **Experience** — the timeline, reverse chronological.
7. **Education and credentials** — degrees, certificates grouped by category, recognition.
8. **About** — three short first-person paragraphs.
9. **Contact** — email with a copy button, LinkedIn, GitHub, resume.
10. **Footer** — name, year, colophon, small theme toggle.

The ordering puts proof before narrative deliberately. A reader who stops after the first two
screens should already have the four facts and the three pieces of work.

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
