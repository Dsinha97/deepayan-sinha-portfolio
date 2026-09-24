---
title: "Design System"
type: reference
tags: [design, tokens, color, typography, kintsugi]
sources:
  - docs/sources/design-suggestions.md
  - docs/sources/portfolio-website-plan.md
  - docs/sources/animation-plans/README.md
  - images/logo.jpg
related:
  - site-architecture.md
  - research-synthesis.md
updated: 2026-09-24
status: built
---

# Design System

> A purple and teal palette derived from the logo, laid on a ceramic ground and joined with a
> gold kintsugi seam, dual-mode, with every text pair measured against WCAG before it was
> written down.

**Status: built.** The token file is [src/styles/global.css](../../src/styles/global.css), wired
through Tailwind 4 exactly as described below. The logo mark itself is still the placeholder
favicon — DSI-89 replaces it.

Two rounds built this page. DSI-82 derived purple and teal from the logo. DSI-115 added the
kintsugi layer: the grounds became ceramic — warm paper in light mode, indigo in dark — and gold
arrived as a seam. Purple and teal were **not** touched by the second round; gold is an accent
layer on top of them, not a replacement for them.

## Where the colours come from

The logo is a script DS monogram in deep purple with a teal arrow rising out of the S, over a
white canvas. Sampling the artwork gives a dominant purple around `#402868`–`#382058` and an
arrow teal around `#3890A0`–`#4098A0`. The system is built on **`#3E2A68` purple** and
**`#3A93A3` teal**, with neutrals tinted toward purple so that dark mode reads as branded rather
than grey.

The logo file itself is a JPEG on a white background, and no vector original survives. It was
traced rather than redrawn — see [The mark](#the-mark) — and `images/logo.jpg` is now an archive
copy that nothing references.

### Why there is gold in it

The site's organising metaphor is **kintsugi**, the Japanese practice of repairing broken
pottery with lacquer mixed with gold: the break is not concealed, it is made the most valuable
line on the object. The owner's reading of it, and the reason it is here rather than being
decoration, is that a flaw worked on openly becomes part of what the thing is worth — which is
also the argument the case studies make about mis-migrated benchmarks, genericised client work
and a survey that had to be redone.

Two reference images set the two modes. A slate-indigo plate with gold veins became dark mode; a
cream bowl with a single gold branch became light mode. The grounds are ceramic; the seams are
gold; the identity stays purple and teal.

The gold is an **accent layer**, decided explicitly:

- Purple and teal keep every role they had. Links, buttons, chips, focus rings and the logo are
  untouched by the kintsugi round, so the mark still matches the site it sits on.
- Gold appears only as a seam, a rule, a hover underline, a large numeral. It names no state and
  labels no control.
- Pure white is gone from light mode. The canvas is `#FAF7F2` paper and the only remaining pure
  white is `--on-accent`, the text on a filled purple button.

## Base scales

Purple, with 700 as the logo colour:

| Step | Hex | Step | Hex |
|---|---|---|---|
| 50 | `#F5F2FA` | 500 | `#6B4F9A` |
| 100 | `#EBE5F4` | 600 | `#533A80` |
| 200 | `#D3C8E6` | **700** | **`#3E2A68`** |
| 300 | `#B5A3D2` | 800 | `#2E1F4E` |
| 400 | `#8F76B6` | 900 | `#201538` |
| | | 950 | `#140C24` |

Teal, with 500 as the arrow colour:

| Step | Hex | Step | Hex |
|---|---|---|---|
| 100 | `#E3F1F3` | 500 | **`#3A93A3`** |
| 200 | `#BFE0E5` | 600 | `#2E7683` |
| 300 | `#8FCBD4` | 700 | `#245C66` |
| 400 | `#5FB0BE` | 900 | `#12333A` |

Gold, the kintsugi lacquer, with 400 as the seam itself:

| Step | Hex | Step | Hex |
|---|---|---|---|
| 100 | `#F6EDD7` | 500 | `#B08717` |
| 200 | `#E8DCAF` | 600 | `#8F6B10` |
| 300 | `#E0C066` | 700 | `#6E520C` |
| **400** | **`#C9A227`** | 900 | `#33270A` |

Paper — the warm light ground, the cream bowl in the second reference image:

| Step | Hex | Step | Hex |
|---|---|---|---|
| 0 | `#FFFDFA` | 200 | `#EDE8DF` |
| 50 | `#FAF7F2` | 300 | `#E3DCD0` |
| 100 | `#F4F0E9` | 400 | `#CBC1B1` |

Ink — the indigo ceramic dark ground and the text that sits on it, the slate plate in the first
reference image:

| Step | Hex | Step | Hex |
|---|---|---|---|
| 50 | `#EEF1F7` | 500 | `#6E7789` |
| 100 | `#D8DDE8` | 600 | `#3D4557` |
| 200 | `#B6BDCD` | 700 | `#2A3142` |
| 300 | `#98A1B5` | 800 | `#1C2230` |
| 400 | `#7A8397` | 900 | `#151A24` |
| | | 950 | `#0F131B` |

Light-mode text is still the purple-tinted neutral scale, which the ceramic grounds did not
replace:

| Step | Hex | Step | Hex |
|---|---|---|---|
| 500 | `#786F8C` | 800 | `#2C2739` |
| 600 | `#5A526C` | 900 | `#1D1927` |
| 700 | `#433C54` | 950 | `#141019` |

## Semantic tokens

These are what components use. They switch on `data-theme`; the scales above never do.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg` | `#FAF7F2` | `#151A24` | page canvas |
| `--surface` | `#F4F0E9` | `#1C2230` | cards, bento tiles |
| `--surface-2` | `#EDE8DF` | `#232A3A` | nested sections, proof strip |
| `--elevated` | `#FFFDFA` | `#2A3142` | sticky header, popovers |
| `--border` | `#E3DCD0` | `#2A3142` | card and divider rules |
| `--border-strong` | `#CBC1B1` | `#3D4557` | hover borders, control outlines |
| `--fg` | `#1D1927` | `#EEF1F7` | headings, primary text |
| `--fg-2` | `#5A526C` | `#B6BDCD` | body text |
| `--fg-muted` | `#695F7D` | `#98A1B5` | dates, captions, mono meta |
| `--accent` | `#533A80` | `#B5A3D2` | links, icons, active nav |
| `--accent-hover` | `#3E2A68` | `#D3C8E6` | link hover |
| `--accent-fill` | `#3E2A68` | `#6B4F9A` | primary button background |
| `--accent-fill-hover` | `#2E1F4E` | `#7A5FA8` | primary button hover |
| `--on-accent` | `#FFFFFF` | `#FFFFFF` | text on the primary button |
| `--accent-soft` | `#ECE6F3` | `#2E1F4E` | purple chip background |
| `--on-accent-soft` | `#3E2A68` | `#D3C8E6` | purple chip text |
| `--teal` | `#2B6E7A` | `#5FB0BE` | secondary accent text, metric values |
| `--teal-strong` | `#245C66` | `#8FCBD4` | teal hover and emphasis |
| `--teal-soft` | `#E2F0F1` | `#12333A` | teal chip background |
| `--on-teal-soft` | `#245C66` | `#8FCBD4` | teal chip text |
| `--seam` | `#C9A227` | `#D9B44A` | the kintsugi seam — **never text in light mode** |
| `--seam-soft` | `#E8DCAF` | `#4A3A12` | a seam receding into the ground |
| `--gold` | `#6E520C` | `#E0C066` | gold *text*, where a seam needs a label |
| `--gold-soft` | `#F6EDD7` | `#33270A` | gold chip background |
| `--on-gold-soft` | `#6E520C` | `#E8CD7E` | gold chip text |
| `--ring` | `#6B4F9A` | `#B5A3D2` | 2px focus ring, 2px offset |
| `--selection-bg` / `--selection-fg` | `#3E2A68` / `#FFFFFF` | `#B5A3D2` / `#151A24` | text selection |

The focus ring stays purple in both modes. Gold is the decorative layer and must never be the
thing that tells a keyboard user where they are.

## Measured contrast

WCAG 2.1: AA body text 4.5:1, AA large text and non-text UI 3:1, AAA 7:1. Every number below was
measured against the ceramic grounds, not the white and near-black the first round used.

Light mode, on paper:

| Pair | Ratio |
|---|---|
| `--fg` on bg / surface / surface-2 | 16.1 / 15.2 / 14.1 |
| `--fg-2` on bg / surface / surface-2 | 6.88 / 6.47 / 6.02 |
| `--fg-muted` on bg / surface / surface-2 | 5.56 / 5.23 / 4.87 |
| `--accent` link on bg / surface / surface-2 | 8.60 / 8.09 / 7.53 |
| white on `--accent-fill` / hover | 12.1 / 14.8 |
| purple chip text on `--accent-soft` | 9.90 |
| `--teal` text on bg / surface / surface-2 | 5.44 / 5.12 / 4.76 |
| teal chip text on `--teal-soft` | 6.42 |
| `--gold` text on bg / surface / surface-2 | 6.83 / 6.43 / 5.99 |
| gold chip text on `--gold-soft` | 6.27 |
| `--seam` against bg | **2.26 — decorative only** |
| `--ring` against bg | 6.12 |

Dark mode, on indigo:

| Pair | Ratio |
|---|---|
| `--fg` on bg / surface / elevated | 15.4 / 14.1 / 11.5 |
| `--fg-2` on bg / surface / elevated | 9.25 / 8.44 / 6.90 |
| `--fg-muted` on bg / surface / elevated | 6.72 / 6.13 / 5.01 |
| `--accent` link on bg / surface / elevated | 7.58 / 6.92 / 5.65 |
| white on `--accent-fill` / hover | 6.54 / 5.21 |
| purple chip text on `--accent-soft` | 9.26 |
| `--teal` text on bg / surface / elevated | 7.00 / 6.39 / 5.22 |
| teal chip text on `--teal-soft` | 7.47 |
| `--gold` text on bg / surface / elevated | 9.88 / 9.01 / 7.36 |
| gold chip text on `--gold-soft` | 9.38 |
| `--seam` against bg | 8.78 |
| `--ring` against bg | 7.58 |

Four decisions came out of measuring rather than guessing:

- **The logo teal is not a text colour.** `#3A93A3` on white is 3.57:1, which fails body text.
  Teal 500 is reserved for non-text use — the arrow, status dots, numerals at 24px and above —
  and teal *text* uses a 600-to-700 value. Using the logo colour for links would have been the
  obvious move and would have failed the audit.
- **The seam gold is not a text colour either, and only in light mode.** `#C9A227` on paper is
  2.26:1 — a hairline the eye reads perfectly well as a line and cannot read at all as a word.
  Gold text uses `--gold`, which is dark enough to be olive in light mode, and that is the
  price. In dark mode the same seam measures 8.78:1 against the indigo ground, so the rule is
  asymmetric: gold text is safe in dark mode and forbidden in light. Do not "simplify" this into
  one rule for both modes.
- **The warm ground cost two tokens a step of darkness.** Paper is darker than white, so
  everything sitting on it lost roughly 0.3 of a ratio point. `--fg-muted` `#6F6683` fell to
  4.41:1 on `--surface-2` and `--teal` `#2E7683` to 4.26:1 on the same surface; both failed body
  text on the third surface only. They were darkened to `#695F7D` and `#2B6E7A`, which is why
  neither sits exactly on a scale rung. The rule being protected is that a text token passes on
  **every** surface it can legally sit on, not on the canvas alone.
- **Two first-pass muted values were rejected in the first round.** `#786F8C` measured 4.46:1 on
  the light surface and `#8E859F` measured 4.12:1 on the dark elevated surface.

Borders are decorative card edges rather than the sole boundary of a control, so the 3:1
non-text rule does not apply to them; every interactive element is identified by text or an icon
at `--fg-2` or stronger. The surface step against the canvas is deliberately subtle and always
paired with a border.

## The seam

The kintsugi idea is carried by one component, [`src/components/Seam.astro`](../../src/components/Seam.astro):
a hairline gold join used wherever the layout would otherwise draw a straight grey rule —
section dividers, the underside of the sticky header, the top edge of the footer.

It is a stroked inline SVG, not an image and not a border:

- **Inline markup costs a round trip of nothing.** No `img-src` entry in the policy, no request,
  no decode. It is a few hundred bytes in the HTML.
- **No `style=""` attribute anywhere.** The dist guard fails the build on one, so colour comes
  from a class (`text-seam`) through `stroke="currentColor"`, and everything else is a plain SVG
  attribute. See [security-headers.md](security-headers.md).
- **`preserveAspectRatio="none"` plus `vector-effect="non-scaling-stroke"`.** The first lets one
  path stretch to any container width; the second keeps the line a true hairline while it does.
  Without the second, the same seam across a 1200px container renders as a fat smear.
- **Three sub-paths at three stroke widths** — 1.2, 2.2, 1.4 — meeting end to end with round
  caps. Real lacquer swells and thins along a break, and a single uniform stroke reads as a
  ruled line with a wobble. The short branch strokes at 50% opacity are what make it read as a
  crack rather than a chart line.
- **Irregular segment lengths, deliberately.** Evenly spaced vertices compress into a visible
  sawtooth at 375px. Checked at 375 and at full width, in both modes.

It is `aria-hidden` and carries no meaning: a seam separates two sections that are already real
`<section>` elements, and a screen reader gets nothing from it.

## The mark

`images/logo.jpg` is a 2390 by 1792 JPEG of the DS monogram on a **white canvas**, and the
original vector is gone. A JPEG cannot be recoloured, so in dark mode it renders as a white
rectangle — which is why this was a blocking dependency for the shell rather than a polish item.

It was **traced, not redrawn**, by [`scripts/trace-logo.py`](../../scripts/trace-logo.py): the
purple and teal masks are cut from the source by channel comparison, blurred, contoured at the
half-level with marching squares, simplified, and refitted as closed Catmull-Rom splines emitted
as cubic Beziers. `fill-rule="evenodd"` handles the counters of the D and S, so holes never have
to be identified separately. The script is a **developer tool, not part of the build** — nothing
in `npm run build` calls it and its outputs are committed — but it exists so a change to the
seam or a new size does not mean redoing the trace by hand.

What it produces:

| File | Use |
|---|---|
| `src/components/LogoMark.astro` | the inline mark, colour from CSS, theme-aware |
| `public/logo-mark.svg` | standalone copy, theme-aware on its own via an internal media query |
| `public/favicon.svg` | square, dilated strokes, thickened seam |
| `public/favicon-32.png`, `favicon.ico` | raster fallback |
| `public/icon-192.png`, `icon-512.png` | manifest icons |
| `public/apple-touch-icon.png` | 180px on a paper tile |
| `public/og-default.png` | 1200 by 630 base card |

Four things this settled, each of which cost a round of looking at it:

- **Colour never goes on a `fill` attribute.** The mark has to switch with the theme —
  `#3E2A68` on the indigo ground is unreadable — so the component's paths carry
  `.logo-mark__*` classes and the colour lives in `global.css` as `--mark-letters` and
  `--mark-arrow`. A hardcoded fill would have reintroduced exactly the problem the JPEG had.
- **The favicon is deliberately a different drawing.** At 16 to 32px the script strokes wash out
  and a 1.5-wide seam disappears, so the letterforms get a stroke of their own colour to fatten
  them and the seam is thickened to 2.6 with the branches dropped. The stroke is capped at
  **0.6**: at 1.1 the mark still reads at 32px, but browser UI sometimes renders `favicon.svg` at
  128px or more, and there the stroke closes the counters and the letters collapse into a blob.
- **Two purples ship.** Where the ground is ours — the apple touch icon, the OG card — the mark
  is `#3E2A68`. Where it is not — a favicon on an unknown tab bar, a transparent manifest icon —
  it is `#533A80`, which survives both light and dark chrome. The SVG favicon does switch
  properly, via its own `prefers-color-scheme` block; the PNGs cannot.
- **An inlined SVG needs a unique id.** The seam is applied with a `clipPath`, and two copies of
  the mark on one page would collide on the id and one would clip against the other. `LogoMark`
  generates a per-instance suffix.
- **`logo-mark.svg` follows the operating system, not the toggle.** An `<img>` gets no CSS from
  the page that embeds it, so the standalone file can only switch on `prefers-color-scheme`. A
  reader who sets the site to dark on a light OS would get the light mark. Use the component
  anywhere on the page and keep the file for contexts with no page at all. The component costs
  about 17KB of markup per instance — it compresses to very little, but that is a reason to
  mount it once in the header rather than in the footer as well.

`site.webmanifest` ships alongside the icons. The policy in
[security-headers.md](security-headers.md) already covers it, because `manifest-src` falls back
to `default-src 'self'` — but only for as long as `default-src` is there. Tighten the policy into
explicit per-directive rules and the manifest is blocked silently, in the usual CSP way, and the
icons simply stop applying.

## Tailwind 4 wiring

Semantic variables live on `:root` and `[data-theme="dark"]` **outside** `@theme`, because
Tailwind hoists `@theme` values to `:root` once and cannot redeclare them per theme. `@theme
inline` then maps utility names onto them, so `bg-surface` emits `var(--surface)` and switches
for free. The static scales go in a plain `@theme` block and are available as `bg-purple-700`
and so on.

```css
@import "tailwindcss";
@import "./fonts.css";
@plugin "@tailwindcss/typography";
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));

:root             { color-scheme: light; --bg: #FAF7F2; /* light column */ }
[data-theme=dark] { color-scheme: dark;  --bg: #151A24; /* dark column  */ }

@theme inline { --color-bg: var(--bg); --color-seam: var(--seam); }
@theme        { --color-purple-700: #3E2A68; --color-gold-400: #C9A227; }
```

**Never use a `dark:` variant for colour.** The tokens already switch; a `dark:` colour utility
means the token was wrong. Reserve the variant for genuine structural differences, such as
swapping which logo file renders.

Tailwind 4 scans for complete class strings, so any class assembled from content data — bento
spans, category colours — must come from a static lookup object. A concatenated class name
generates no CSS at all, silently.

## Typography

Three tiers, three self-hosted faces:

- **Instrument Serif** for display — the hero name, section headings, case-study titles. One
  weight, latin subset, 21KB. Added in DSI-131 from the editorial references; see
  [design-references.md](design-references.md).
- **Inter Variable** for body and UI. Weight axis 400 to 800, latin subset, one woff2.
- **JetBrains Mono Variable** for metadata, chips, dates and metric numerals.

**The serif is display-only and the face has one weight, deliberately.** A serif body would make
the site read as a research publication rather than a portfolio, and having no second weight
available is the cheapest guard against it drifting into body copy later.

That makes three font files, not two. The budget in DSI-106 was written for two, and this is the
change to it: **three files, two preloaded.** Inter and the serif are both on the critical path —
the serif sets the largest contentful paint on every page — and the mono is `font-display:
optional` and never preloaded. Total 109KB of font, all first-party.

Self-hosting is a CSP decision, not an aesthetic one: Google Fonts would need two external
origins in the policy, add a third-party connection before first paint, and send every visitor
IP to Google. Files live in `public/fonts/` with a hand-written `fonts.css`, so the URLs are
stable enough to preload. Do not `@import` the fontsource stylesheet — it registers every subset
and defeats the preload.

Inter gets `font-display: swap` with a metric-adjusted system fallback; the mono gets
`font-display: optional`, since it is never the largest contentful paint and a 100ms window
means it can never cost a layout shift on text the reader is not primarily there for.

Scale: display `clamp(2.5rem, 1.6rem + 3.5vw, 4.25rem)` at 1.05 line-height and -0.03em
tracking; h2 `clamp(1.75rem, 1.3rem + 1.6vw, 2.5rem)` at 1.15 and -0.02em; h3 1.375rem at 1.25;
body 1rem, 1.0625rem at large widths, at 1.6; small 0.875rem; mono meta 0.8125rem at +0.02em,
uppercase labels 0.75rem at +0.08em. Body measure 65ch, grid 1200px.

The fluid steps are Tailwind theme entries — `text-display`, `text-h2`, `text-h3`, `text-meta`,
`text-label` — each carrying its own line-height and tracking, so no component has to remember
that the display step also needs `tracking-[-0.03em]`.

### The measured fallback

`swap` means the first paint is Arial. If Arial's metrics differ from Inter's, the swap reflows
the text and the page books a layout shift for it. `Inter Fallback` in
[`fonts.css`](../../src/styles/fonts.css) is a `local('Arial')` face with overrides that make it
occupy Inter's space:

| Override | Value |
|---|---|
| `size-adjust` | 104.55% |
| `ascent-override` | 92.78% |
| `descent-override` | 22.96% |
| `line-gap-override` | 0% |

These were **measured from the shipped woff2**, not copied from a blog post — published Inter
numbers assume the full font, and what ships here is the latin weight-axis subset. Method:
load the face, then in a canvas at 100px read `fontBoundingBoxAscent` / `Descent` and the mean
advance width of `a-zA-Z0-9` plus space, for both Inter and Arial. Then
`size-adjust = avgWidth(Inter) / avgWidth(Arial)`, and each vertical metric is divided by that
same factor. Inter measured 0.97 / 0.24 ascent and descent against Arial's 0.91 / 0.21, and
0.6004 against 0.5743 average advance.

Chrome reports `fontBoundingBox*` in whole pixels, so measuring at 100px gives two decimal
places — enough for this, and the reason the numbers are not quoted more precisely.
**Re-measure if the font file is ever replaced**, including a Fontsource version bump that
resubsets it.

`'Inter Fallback'` must sit directly after `'Inter'` in the stack. Anywhere else and the browser
reaches a real fallback first and the adjustment does nothing.

The serif got the same treatment and the numbers are worth reading rather than trusting.
Instrument Serif is **narrow**: 0.419em mean advance against Times New Roman's 0.548em. So
`size-adjust` is 76.47%, with `ascent-override` 129.46% and `descent-override` 40.54%. That is a
large correction, and the honest consequence is that the pre-swap paint looks visibly small
rather than merely different. It is still the right trade — the face sets a handful of large
words, and the alternative is the heading reflowing under the reader. Times New Roman rather than
Georgia because Georgia needs 72.51% and distorts further.

## Spacing, radii, targets

The 8-point grid is a convention rather than a config change: Tailwind 4 keeps its 0.25rem base,
and layout uses even steps only (2, 4, 6, 8, 12, 16, 20, 24, giving 8px to 96px), with step 1
reserved for spacing inside chips. Section rhythm `py-16 md:py-24`, grid gap `gap-4 md:gap-6`,
card padding `p-6 md:p-8`.

**Chip padding is `px-2.5 py-1`** (10px/4px) — a half-step outside the list above, but a
deliberate one: it was identical across the old `Timeline.astro`, `work/[slug].astro`'s stack tags,
`Skills.astro` and `SocialLink.astro`'s tooltip (DSI-167), so it's documented here as a named
exception rather than left to silently diverge from a rule it was never actually breaking by
accident.

Radii: chips fully round, buttons 10px, cards 14px, hero image 20px. Every interactive control
is at least 44 by 44 pixels, carried over from the Abhijit site where it is a documented rule.

## The 2026-09 redesign

The owner asked for a redesign that pushes the reference folder further while keeping the brand
(see [design-references.md](design-references.md)); it was mocked on a Design canvas, iterated
through comments, and built with the rail layout. What it added to this system:

**Tokens.** `--band` / `--on-band` / `--on-band-2` / `--band-label` / `--band-line` for the
closing contact band — the one place the brand purple is a surface, `#2e1f4e` light and
`#201538` dark, measured at 13.8:1, 9.3:1 and 6.1:1 for its three text colours. `--scrim` behind
an open dialog. Radii `--radius-tile` 24px (work, experience and credential cards) and
`--radius-band` 32px. Type steps `text-hero` (the rail name, to 4.75rem at 0.95 leading) and
`text-stat` (proof and metric numerals); `text-h2` grew to `clamp(2rem, …, 3.25rem)` at 1.05
leading, and the resume pins its own h2 at 1.75rem so the document scale did not grow with it.

**Covers fill their frame.** Work covers are `astro:assets` imports (`cover: image()`), rendered
by `WorkCover.astro` with a srcset and `object-cover`. A cover whose subject is off-centre names
the edge to keep in `coverFocus` (Fort Monroe: `left`). On the case-study page the frame takes
the cover's own ratio (2:1, 3:2 or 4:3), so nothing is cropped there at all.

**Dialogs are popovers.** `Dialog.astro` is a `popover` element opened by `popovertarget` — no
script: the browser handles Esc, click-outside and returning focus, and `autofocus` on the close
button moves focus in. It is `role="dialog"` but deliberately not `aria-modal`, because a popover
is not a focus trap. Used for the experience details and `CertDialog.astro`. Motion is
`.t-dialog` in `motion.css`: panel-reveal's curve and travel without the blur, because a dialog
up to 60rem wide is the large blurred area the Motion rule forbids.

**Disclosure without a layout shift.** The inline theme script now also adds `js` to `<html>`
before first paint. `.t-disclosure` panels are open by default and only collapse under
`:root.js`, so the no-JS page shows the content and the scripted page starts closed without
reflowing. `disclosure.js` toggles `data-open`. Used by the Recognition tile.

**The header's full nav starts at `lg`, not `md`.** Five nav entries plus Resume and the toggle
overflowed at 768px by 11px; below 1024 the hamburger menu carries them.

## Motion

Composite-only properties: **transform, opacity and filter**. Everything respects
`prefers-reduced-motion: reduce`, which also disables smooth scrolling. No animation that moves
content the reader is trying to read.

`filter` is on that list for a reason worth stating, because it was briefly left off and the
omission cost a real effect. Filter animations are **compositor-animated in every engine this
site targets** — the same fast path as transform and opacity, off the main thread, with no
layout and no repaint of the element's content. What a blur does cost is GPU fill-rate, and that
cost scales with the **area** being blurred, not with the fact that it is a filter. So the
constraint is size, not property: a 2px cross-blur on a nav panel or a card is free enough to be
worth it, and the same blur on a full-width section or the page ground is not. Do not reach for
`backdrop-filter` on a large surface at all — that one samples everything behind it every frame.

**The header shrinking on scroll (DSI-86) no longer has an exception.** It used to animate
`padding-block`, a layout property off the composite-only path, on the argument that the header
is chrome rather than content and the transition was short, bounded and reduced-motion-safe. That
argument was reconsidered and reversed by [DSI-159](https://linear.app/dsinha-org/issue/DSI-159)
(shipped 2026-09-18, `docs/sources/animation-plans/002-header-shrink-no-layout-transition.md`):
the logo's own `transform`-based shrink (`LogoMark`, `scale-90` toggle) already carries the full
"header got smaller" cue on its own, making the padding animation redundant rather than
load-bearing whatever its performance cost. The padding class swap is now instant — no
`transition-*` targets it — and the logo transform is the sole animated cue for the shrink. The
composite-only rule above now has zero exceptions.

Motion gaps from the same 2026-09-17 audit (`/find-animation-opportunities`, `/improve-animations`,
`/better-interface`, `/emil-design-eng`, `/landing-page-design`, tracked under the Linear milestone
"Design Improvements") have implementation plans in
[docs/sources/animation-plans/](../sources/animation-plans/README.md). Shipped so far: site-wide
press/active feedback (DSI-158), the header padding reversal above (DSI-159), and a crossfade for
the theme-toggle sun/moon and the mobile hamburger/X icon swaps, which used to teleport via
`display`/`.hidden` toggling (`004-icon-swap-crossfade.md`, DSI-160) — both now cross-fade via
opacity+scale instead, staying mounted at all times with visibility handled by `aria-hidden`
rather than `display`. Still open: a physical entrance for the `SocialLink` tooltip
(`003-tooltip-physical-entrance.md`, DSI-161).

## Sources

- [design-suggestions.md](../sources/design-suggestions.md) — the spatial system, type tiers
  and bento structure this keeps. Its palette and content are discarded; see
  [research-synthesis](research-synthesis.md)
- [portfolio-website-plan.md](../sources/portfolio-website-plan.md) — same
- `images/logo.jpg` — the source of both brand colours, sampled directly
- [DSI-115](https://linear.app/dsinha-org/issue/DSI-115/update-website-theme-using-elements-of-kintsugi-design)
  — the kintsugi brief in the owner's own words, and the two reference images the ceramic
  grounds were read off
- [docs/sources/animation-plans/](../sources/animation-plans/README.md) — the 2026-09-17 design
  audit's four implementation plans (`improve-animations`), for the Motion section's planned
  deltas above

## `--mark-plate`: a ground for other people's logos

Third-party institution marks (William & Mary, VIT, Wipro) are **dark ink on transparency**.
Dropped straight onto the dark ceramic ground they are effectively invisible — which is how they
first shipped, and what the owner caught on the deployed site rather than anything catching it
here.

`--mark-plate: #fbfaf7` is a near-white tile they sit on, and it is **deliberately the same
value in both themes**. Two things follow from that, and they are the reasoning, not the
styling:

- **It does not switch with the theme.** These are someone else's brand assets. Inverting,
  recolouring or dark-mode-adapting them is not ours to do, so the ground adapts instead of the
  mark.
- **It is not pure `#fff`.** A hard white chip glares against the warm paper ground in light
  mode. `#fbfaf7` sits quietly in both.

Marks inside the plate are balanced by **area, not height**. The ratios in use run from a
near-square seal (0.95) to a wide wordmark (1.74); give them a shared `max-h` and the wordmark
reads as roughly twice the institution. `markBox()` in `components/Education.astro` solves
`h = sqrt(AREA / ratio)` so every mark occupies the same visual weight while keeping its own
aspect ratio — which also means `<Image>` emits truthful intrinsic dimensions and nothing shifts
on decode.
