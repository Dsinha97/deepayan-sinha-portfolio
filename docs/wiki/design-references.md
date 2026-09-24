---
title: "Design References"
type: reference
tags: [design, references, components, motion]
sources:
  - "Referernces/ (local only, gitignored)"
related:
  - design-system.md
  - site-architecture.md
updated: 2026-09-24
status: built
---

# Design References

> A folder of third-party style teardowns and component specs that never enters the repo. This
> page is the only durable record of what it holds, what was taken from it, and what was
> deliberately left.

## The folder

`Referernces/` — the spelling on disk carries a typo — sits in the working directory and is
**gitignored under both spellings** (DSI-131), so renaming it cannot silently start tracking it.
Nothing in it has ever been committed. It holds 9 style teardowns of real products, 20 component
specs, and 3 full-page screenshots of personal-profile products.

**It is a technique source, not a palette source.** Every teardown documents a real company's
live brand. Lifting one wholesale would make this site read as that company's, which is the
opposite of what a portfolio is for. The kintsugi direction in
[design-system.md](design-system.md) remains the spine; these inform *how* things are built, not
what they look like.

## What was taken

| Taken | From | Where it landed |
|---|---|---|
| Sticky identity rail beside a scrolling content column | bento.me, portrait.so | `components/IdentityRail.astro`, homepage |
| Asymmetric bento tiles with size as hierarchy | bento.me, portrait.so | homepage work grid, DSI-102 |
| Display serif paired with a sans body | Anthropic, OFF+BRAND | Instrument Serif, DSI-131 |
| Panel reveal transition | Transitions.dev | `styles/motion.css`, mobile menu |
| The 2px cross-blur on that transition | Transitions.dev | kept — see below |
| Tonal elevation instead of shadow | Anthropic, Augen | already how surfaces worked — the reference confirmed it |
| One accent reserved for the single consequential action | Anthropic, Augen | already the gold and teal rules |
| Full-bleed covers in large-radius tiles, a two-row "tall" tile | portrait.so, bento.me | `WorkGrid.astro`, redesign 2026-09-24 |
| Numbered label-pair section headings (small tracked eyebrow over a serif title) | Augen, dope.security | `SectionHeading.astro` |
| Stat row divided by hairlines, unit at half size | Auros | `ProofStrip.astro`, case-study metrics |
| Hairline-divided rows for grouped lists | contra.com, OFF+BRAND | the skills and toolkit list |
| A closing "Let's work together" band before the footer | contra.com, Anthropic | `Contact.astro`, homepage and every case study |

Two of those are worth saying plainly: the surface and accent conventions were **already** the
system before the folder arrived. The references did not change them; they corroborated them,
which is a real result and the reason nothing was rewritten.

The blur has a history worth recording, because it is the kind of mistake that gets re-made.
It was dropped on the first port, on the grounds that it fell outside the composite-only rule in
[design-system.md](design-system.md). That was wrong: `filter` is compositor-animated in every
engine this site targets, on the same fast path as transform and opacity. It was never an
exception, and the rule had simply failed to name it. The blur is what makes the panel read as
arriving from depth rather than sliding, so it is back — and the rule now names `filter`
explicitly, with the real constraint, which is blurred **area** rather than the property itself.

## What was deliberately not taken

- **Any palette.** Not the ivory-and-clay, not the abyssal teal, not the violet beacons.
- **Serif body copy.** Anthropic sets body in serif at 20px and it is the loudest single signal
  in that reference. Taking it would make this read as a research publication rather than a
  product-and-analytics portfolio, and it is the closest thing to copying that brand's voice.
  The serif here is display-only, and the face ships with one weight so it cannot spread.
- **Glows, gradient washes and atmospheric backgrounds** from the five dark references. The
  ceramic grounds are flat solid fills.

## The React components

Nine of the twenty component specs are React — `"use client"` Next.js components needing shadcn,
framer-motion, radix-slot, class-variance-authority and lucide-react, plus an external `liveline`
package and private primitives (`GlideMenu`, `atoms/Button`) that are not in the folder.

**They are not being adopted, by decision: port the idea, not the code.** The arithmetic is the
argument. The site ships **769 bytes** of JavaScript. framer-motion alone is roughly 35KB
gzipped — more than double the entire 15KB budget — before React itself. Taking them would mean
rewriting the budget in DSI-106, adding a framework to a build chosen specifically to avoid one,
and widening a deliberately strict CSP.

Ideas worth rebuilding in vanilla when their section arrives:

| Idea | From | Candidate home |
|---|---|---|
| Animated path field behind a hero | `hero.md` | DSI-91, as a seam field rather than generic curves |
| Process/architecture diagram | `flowchart.md` | DSI-99, DSI-101 — case study internals |
| Metric cards with an inline trend | `insights-cards.md` | DSI-92 proof strip, DSI-102 tiles |

Five of them — diff table, filter table, fine-tune filter, search, thinking states — are AI
product chrome with no home on a portfolio at all.

## Vanilla primitives, and when to port them

Eleven specs are Transitions.dev vanilla CSS with `data-` attribute state. They fit this stack
exactly: no dependencies, no framework, custom properties, and `prefers-reduced-motion` already
handled at source.

**A primitive is only ported when its consumer exists.** `motion.css` holding CSS that nothing
renders is dead weight against a 25KB budget, so the rest wait here:

| Primitive | Waiting for |
|---|---|
| `panel-reveal` | **ported** — mobile menu, DSI-86 |
| `tooltip-hover` | **pattern used** — the Certifications and courses ⓘ tooltip reuses `SocialLink`'s CSS-only version rather than porting the spec |
| `text-state-swap` | DSI-96 — the copy-to-clipboard confirmation state |
| `number-pop`, `spinning-counter` | DSI-92 — proof strip figures. Still waiting: the redesign kept the figures static |
| `accordion` | not needed — the certificates stopped being grouped; the Recognition tile's expand is a plain disclosure (`.t-disclosure`) |
| `tab-sliding` | DSI-102 — only if the work index needs filtering |
| `shimmer-text`, `streaming-text`, `thinking-states`, `checkbox-check` | nothing. AI chrome |

Every port follows the three rules at the top of
[`motion.css`](../../src/styles/motion.css): tokens rather than hardcoded values, a blur kept
only where the blurred area is small, and a closed state that is genuinely unfocusable rather
than merely invisible.

## A live peer site, reviewed for structure only (M3)

[sunnysoni.netlify.app](https://sunnysoni.netlify.app/) was supplied by the owner during the M3
content pass. It belongs to a William & Mary MBA classmate, which makes it the same category as
everything in `Referernces/`: **a technique source, never a content or palette source.** It is a
real person's live personal brand and the claims on it are theirs.

**Taken — structure only:**

- **Stat tiles instead of prose claims.** A large figure with a short label under it, in a row.
  The proof strip (DSI-92) uses this shape.
- **One sentence of summary per role, then terse bullets.** The first draft of the timeline was
  paragraphs; the reference makes the case that a line each scans better and repeats less.
- **Tool names as chips rather than sentences.** Used on the W&M and Wipro entries.
- **A single "outcome" line per engagement**, visually separated from the bullets above it.

**Not taken:** any copy, any claim, any number, the colour palette, the typography, the
navigation pattern, the slash-separated keyword hero, or the work-authorization block. Nothing
about how that site describes its owner has any bearing on how this one describes its own.

One thing it does that this site deliberately does not: it states visa status and sponsorship
need on the page. That is a legitimate choice and a common one, but it is the owner's call to
make explicitly rather than a default to copy — it is not on this site unless he asks for it.

## Sources

- `Referernces/DESIGN-*.md` — teardowns of Air, Amaterasu, Anthropic, Augen, Auros,
  dope.security, Duolingo, GSAP, OFF+BRAND
- `Referernces/Components/*.md` — 11 Transitions.dev specs, 9 React components
- `Referernces/refero.design *.jpg` — bento.me, contra.com, portrait.so
- [DSI-131](https://linear.app/dsinha-org/issue/DSI-131/review-references-and-components)
- `sunnysoni.netlify.app` — reviewed live 2026-09-11 during M3; structure only, recorded above
