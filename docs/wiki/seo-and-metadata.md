---
title: "SEO and Metadata"
type: reference
tags: [seo, jsonld, opengraph]
sources:
  - "C:/Abhijit-Sinha-Website/docs/wiki/seo-and-metadata.md"
  - docs/sources/portfolio-website-plan.md
related:
  - site-architecture.md
  - profile.md
updated: 2026-09-24
status: planned
---

# SEO and Metadata

> One head component, a `Person` entity that every page references, and social cards that
> actually render.

**Status: planned.** DSI-103 and DSI-104 are built (2026-09-24) and awaiting their gates,
both of which are checked against the deployed site — see
[What DSI-103 built](#what-dsi-103-built) and [What DSI-104 built](#what-dsi-104-built).

## The head component

A single `SEO.astro` mounted in the shared layout, taking title, description, image, page type
and an optional structured-data node. It emits the title, meta description, a canonical URL
built from the current path and the configured site, Open Graph tags, Twitter card tags, and one
JSON-LD block.

Defaults come from `src/data/site.ts`. A page that passes nothing still gets correct metadata,
which is the point — the failure mode being designed against is a page shipping with the
homepage description because someone forgot the prop.

## Structured data

One `Person` node with a stable `@id` at the site root, carrying name, job title, the LinkedIn
and GitHub profiles as `sameAs`, both institutions as `alumniOf`, and the headshot. The homepage
wraps it in a `ProfilePage`; each case study emits an `Article` that references the person **by
id** rather than repeating the node. That is what ties the pages together as one entity instead
of three unrelated documents about someone with the same name.

`sameAs` is the field doing the real work: it is how a search engine connects the site to the
LinkedIn and GitHub profiles. Both URLs must match exactly what those profiles use.

No `aggregateRating`, no `review`, no invented credentials. Rating markup with nothing behind it
is a structured-data penalty as well as a misrepresentation.

A `Person` or `ProfilePage` produces no rich result in search, so "valid, no eligible items" from
the Rich Results Test is the expected outcome, not a failure.

## Open Graph images

The base asset already ships: `public/og-default.png`, the mark on the paper ground, generated
by `scripts/trace-logo.py` (DSI-89). It carries no type — the typographic cards wait for the
fonts to be wired into a generator rather than being set in a system face that does not match
the site. A default 1200 by 630 card for the homepage and the resume, plus a generated card per case study
so a shared link shows the case study title rather than the site name. Generation happens at
build time from the same design tokens, so the cards cannot drift from the site palette.

Verification is by actually pasting URLs into a preview tool and the LinkedIn post inspector.
Open Graph is the one area where the tags can be perfectly valid and the render still wrong.

## Sitemap and robots

`@astrojs/sitemap` with the site URL, producing a sitemap index. `robots.txt` allows everything
and points at the sitemap; its sitemap line is the single hardcoded absolute URL in the repo and
has to be edited by hand if the domain ever changes.

Expected sitemap contents: the homepage, the resume, and the three case studies, all with
trailing slashes to match the route configuration. Anything else in there is a bug.

## What is not done

No keyword optimisation, no blog, no backlink work. This is a personal site whose traffic comes
from people who already have the URL — from a resume, a LinkedIn profile, or an application. The
metadata exists so those links render properly and so a search for the name finds the right
page, not to compete for generic terms.

## What DSI-103 built

- **`Head.astro`** takes `type`, `image` and `jsonLd` props beside the existing `title`,
  `description` and `noindex`, and emits Open Graph and Twitter tags on every page. `og:image`
  defaults to the generated `/og/default.png` (DSI-104) and is always absolute, since crawlers do not resolve relative
  URLs. `BaseLayout` forwards the props; no page carries a tag of its own.
- **`src/data/schema.ts`** builds the JSON-LD. The `Person` node (`@id`
  `https://deepayansinha.com/#person`) appears in full on the homepage only, inside a
  `ProfilePage`. Each case study's `Article` carries `author` as the `@id` plus name and url —
  the reference ties the pages together; the name is there because Google's Article checks don't
  follow references and would otherwise see no author.
- **No `jobTitle`.** He is looking for a role; any title in the markup would be a claim the page
  does not make. `alumniOf` reads the `education` collection, so it cannot disagree with the
  Credentials section.
- **Images in the JSON-LD are real built files**, run through `getImage()` to JPEG — the headshot
  at 512px, each cover at 1200px — not the hashed source import, which has no stable URL.
- **`public/robots.txt`** allows everything and names `sitemap-index.xml`. The sitemap was
  measured, not assumed: exactly the five expected URLs, trailing slashes, no `/404/`, so no
  `filter` was needed.
- **JSON-LD is an inline `<script>`**, which both build guards rejected. The exemption and why it
  is not a hole: [security-headers](security-headers.md#what-building-it-changed).

## What DSI-104 built

- **Cards are prerendered by an Astro endpoint**, `src/pages/og/[...card].png.ts`: `/og/default.png`
  for the homepage and the resume, and `/og/work/<slug>.png` per case study, carrying its kicker,
  title and tagline. They are ordinary static files in `dist/og/` — no runtime, nothing for the CSP
  to allow — and the sitemap was re-measured to confirm endpoints don't enter it.
- **`src/lib/og-card.ts` renders them with satori, then sharp.** satori lays out the card in the
  site's own faces (Instrument Serif title, Inter body) and emits text as glyph outlines, so sharp
  rasterises it without consulting any system font. The card is the same on Windows and on the
  Linux build host, which is the whole reason for not drawing text through sharp's SVG renderer
  directly.
- **satori cannot read WOFF2.** The site's Inter is the variable WOFF2, so `@fontsource/inter`
  (static WOFF, 400 and 600) is a devDependency used only here. Instrument Serif's package already
  ships WOFF.
- **Colours are read from `global.css` at build time** — the first declaration of each token,
  which is the light theme — so a palette change reaches the cards on the next build. A missing
  token fails the build rather than falling back to a guessed hex.
- **The mark is rasterised before layout**, with its `prefers-color-scheme` block stripped and the
  light colours pinned. A nested SVG with clip paths and a `<style>` is the input two renderers are
  most likely to disagree about.
- **satori only honours `lineClamp` on `display: block`.** The first render let the Abhijit
  tagline run to three lines past a two-line clamp; titles now clamp at two and taglines at three.
- `sharp` was already installed as Astro's optional dependency; it is now a direct devDependency so
  the card generator isn't relying on a transitive install. satori brings `fflate` 0.7.3, which has
  a moderate advisory; it only ever inflates our own font files at build time.
- `public/og-default.png` (DSI-89) is no longer referenced by any page. It stays, since
  `scripts/trace-logo.py` regenerates it with the rest of the logo set.

The DSI-104 gate is a real link preview (a preview tool and the LinkedIn post inspector) on each
of the five URLs after deploy — valid tags can still render wrong.

The gate — zero errors from the schema validator — is checked against the deployed site, per the
lesson below.

## Sources

- Abhijit site `docs/wiki/seo-and-metadata.md` — the head component shape and the
  no-fake-ratings rule
- [portfolio-website-plan.md](../sources/portfolio-website-plan.md) — the JSON-LD and OG
  recommendations, which are the sound part of it

## Two defects found on production, 2026-09-11 (post-M3)

Both were invisible locally and only showed up against the deployed site.

**The meta description outlived the headline it described.** `site.headline` changed in M3 when
the owner rejected the "leader" framing, and the `<title>` followed it because it is derived —
but `Head.astro` carried the description as a **hardcoded literal**, so every page on production
advertised the rejected positioning line in the one piece of text search engines actually
display. The description now lives in `site.ts` beside the headline, so there is one home for
the sentence. A derived value and a literal saying the same thing is a trap: the derived one
moves and the literal does not, silently.

**`/404` returned HTTP 200 — a soft 404.** The 404 body is a real static asset, so the host
serves it with a 200 at its own path while correctly returning 404 for unmatched routes. That
made "Page not found" an indexable page. Neither dev server reproduces it: `astro dev` and
`wrangler dev` both return 404 for that path, which is why it survived to production.

*Since then (seen 2026-09-24 in DSI-105):* the host now 307s `/404/` to `/404`, which still
answers 200 with the `noindex` meta. Same soft 404, one hop later; the fix below still holds.

The status cannot be fixed from the repo — it is how static-asset hosting works. The indexing
can, and `<meta name="robots" content="noindex, nofollow">` now ships on that page only, via a
`noindex` prop threaded from the page through `BaseLayout` to `Head`. The sitemap already
excluded it, so it was never advertised, only reachable.

**The general lesson, and it is the same one DSI-132 taught:** a clean local run says nothing
about what the host does with the artifact. Check metadata against the deployed site.
