---
title: "Design System"
type: reference
tags: [design, tokens, color, typography]
sources:
  - docs/sources/design-suggestions.md
  - docs/sources/portfolio-website-plan.md
  - images/logo.jpg
related:
  - site-architecture.md
  - research-synthesis.md
updated: 2026-09-10
status: planned
---

# Design System

> A purple and teal palette derived from the logo, dual-mode, with every text pair measured
> against WCAG before it was written down.

**Status: planned.** Nothing here is built yet. Flip `status` to `built` in the same change that
ships the token file, not before.

## Where the colours come from

The logo is a script DS monogram in deep purple with a teal arrow rising out of the S, over a
white canvas. Sampling the artwork gives a dominant purple around `#402868`–`#382058` and an
arrow teal around `#3890A0`–`#4098A0`. The system is built on **`#3E2A68` purple** and
**`#3A93A3` teal**, with neutrals tinted toward purple so that dark mode reads as branded rather
than grey.

The logo file itself is a JPEG on a white background. Until a transparent vector mark exists,
dark mode would show a white rectangle — that asset is a blocking dependency for the shell, not
a nice-to-have.

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

Neutrals, hue-shifted toward purple at low chroma:

| Step | Hex | Step | Hex |
|---|---|---|---|
| 0 | `#FFFFFF` | 500 | `#786F8C` |
| 50 | `#F9F8FB` | 600 | `#5A526C` |
| 100 | `#F2F0F6` | 700 | `#433C54` |
| 200 | `#E5E1EC` | 800 | `#2C2739` |
| 300 | `#CFC9DA` | 900 | `#1D1927` |
| 400 | `#A49CB4` | 950 | `#141019` |

## Semantic tokens

These are what components use. They switch on `data-theme`; the scales above never do.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg` | `#FFFFFF` | `#141019` | page canvas |
| `--surface` | `#F9F8FB` | `#1D1927` | cards, bento tiles |
| `--surface-2` | `#F2F0F6` | `#241F30` | nested sections, proof strip |
| `--elevated` | `#FFFFFF` | `#2C2739` | sticky header, popovers |
| `--border` | `#E5E1EC` | `#2C2739` | card and divider rules |
| `--border-strong` | `#CFC9DA` | `#433C54` | hover borders, control outlines |
| `--fg` | `#1D1927` | `#F2F0F6` | headings, primary text |
| `--fg-2` | `#5A526C` | `#B8B0C6` | body text |
| `--fg-muted` | `#6F6683` | `#9A91AB` | dates, captions, mono meta |
| `--accent` | `#533A80` | `#B5A3D2` | links, icons, active nav |
| `--accent-hover` | `#3E2A68` | `#D3C8E6` | link hover |
| `--accent-fill` | `#3E2A68` | `#6B4F9A` | primary button background |
| `--accent-fill-hover` | `#2E1F4E` | `#7A5FA8` | primary button hover |
| `--on-accent` | `#FFFFFF` | `#FFFFFF` | text on the primary button |
| `--accent-soft` | `#EBE5F4` | `#2E1F4E` | purple chip background |
| `--on-accent-soft` | `#3E2A68` | `#D3C8E6` | purple chip text |
| `--teal` | `#2E7683` | `#5FB0BE` | secondary accent text, metric values |
| `--teal-strong` | `#245C66` | `#8FCBD4` | teal hover and emphasis |
| `--teal-soft` | `#E3F1F3` | `#12333A` | teal chip background |
| `--on-teal-soft` | `#245C66` | `#8FCBD4` | teal chip text |
| `--ring` | `#6B4F9A` | `#B5A3D2` | 2px focus ring, 2px offset |
| `--selection-bg` / `--selection-fg` | `#3E2A68` / `#FFFFFF` | `#B5A3D2` / `#141019` | text selection |

## Measured contrast

WCAG 2.1: AA body text 4.5:1, AA large text and non-text UI 3:1, AAA 7:1.

Light mode:

| Pair | Ratio |
|---|---|
| `--fg` on bg / surface | 17.2 / 16.3 |
| `--fg-2` on bg / surface / surface-2 | 7.35 / 6.94 / 6.50 |
| `--fg-muted` on bg / surface / surface-2 | 5.38 / 5.08 / 4.76 |
| `--accent` link on bg / surface | 9.19 / 8.69 |
| white on `--accent-fill` / hover | 12.1 / above 12 |
| purple chip text on `--accent-soft` | 9.82 |
| `--teal` text on bg / surface | 5.20 / 4.92 |
| teal chip text on `--teal-soft` | 6.48 |
| `--ring` against bg | 6.54 |

Dark mode:

| Pair | Ratio |
|---|---|
| `--fg` on bg / surface / elevated | 16.6 / 15.2 / 12.8 |
| `--fg-2` on bg / surface / elevated | 9.00 / 8.24 / 6.91 |
| `--fg-muted` on bg / surface / elevated | 6.27 / 5.74 / 4.81 |
| `--accent` link on bg / surface / elevated | 8.17 / 7.48 / 6.27 |
| white on `--accent-fill` / hover | 6.54 / 5.21 |
| purple chip text on `--accent-soft` | 9.26 |
| `--teal` text on bg / surface / elevated | 7.55 / 6.91 / 5.80 |
| teal chip text on `--teal-soft` | 7.47 |
| `--ring` against bg | 8.17 |

Two decisions came out of measuring rather than guessing:

- **The logo teal is not a text colour.** `#3A93A3` on white is 3.57:1, which fails body text.
  Teal 500 is reserved for non-text use — the arrow, status dots, numerals at 24px and above —
  and teal *text* uses 600 in light mode. Using the logo colour for links would have been the
  obvious move and would have failed the audit.
- **Two first-pass muted values were rejected.** `#786F8C` measured 4.46:1 on the light surface
  and `#8E859F` measured 4.12:1 on the dark elevated surface. Both were adjusted until every
  surface they sit on passes.

Borders are decorative card edges rather than the sole boundary of a control, so the 3:1
non-text rule does not apply to them; every interactive element is identified by text or an icon
at `--fg-2` or stronger. The surface step against the canvas is deliberately subtle and always
paired with a border.

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

:root             { color-scheme: light; --bg: #FFFFFF; /* light column */ }
[data-theme=dark] { color-scheme: dark;  --bg: #141019; /* dark column  */ }

@theme inline { --color-bg: var(--bg); --color-surface: var(--surface); }
@theme        { --color-purple-700: #3E2A68; }
```

**Never use a `dark:` variant for colour.** The tokens already switch; a `dark:` colour utility
means the token was wrong. Reserve the variant for genuine structural differences, such as
swapping which logo file renders.

Tailwind 4 scans for complete class strings, so any class assembled from content data — bento
spans, category colours — must come from a static lookup object. A concatenated class name
generates no CSS at all, silently.

## Typography

Three tiers, two self-hosted variable faces:

- **Inter Variable** for display and body. Weight axis 400 to 800, latin subset, one woff2.
- **JetBrains Mono Variable** for metadata, chips, dates and metric numerals.

Self-hosting is a CSP decision, not an aesthetic one: Google Fonts would need two external
origins in the policy, add a third-party connection before first paint, and send every visitor
IP to Google. Files live in `public/fonts/` with a hand-written `fonts.css`, so the URLs are
stable enough to preload. Do not `@import` the fontsource stylesheet — it registers every subset
and defeats the preload.

Inter gets `font-display: swap` with a metric-adjusted system fallback; the mono gets
`font-display: optional`, since it is never the largest contentful paint.

Scale: display `clamp(2.5rem, 1.6rem + 3.5vw, 4.25rem)` at 1.05 line-height and -0.03em
tracking; h2 `clamp(1.75rem, 1.3rem + 1.6vw, 2.5rem)` at 1.15 and -0.02em; h3 1.375rem at 1.25;
body 1rem, 1.0625rem at large widths, at 1.6; small 0.875rem; mono meta 0.8125rem at +0.02em,
uppercase labels 0.75rem at +0.08em. Body measure 65ch, grid 1200px.

## Spacing, radii, targets

The 8-point grid is a convention rather than a config change: Tailwind 4 keeps its 0.25rem base,
and layout uses even steps only (2, 4, 6, 8, 12, 16, 20, 24, giving 8px to 96px), with step 1
reserved for spacing inside chips. Section rhythm `py-16 md:py-24`, grid gap `gap-4 md:gap-6`,
card padding `p-6 md:p-8`.

Radii: chips fully round, buttons 10px, cards 14px, hero image 20px. Every interactive control
is at least 44 by 44 pixels, carried over from the Abhijit site where it is a documented rule.

## Motion

Composite-only properties, transform and opacity. Everything respects
`prefers-reduced-motion: reduce`, which also disables smooth scrolling. No animation that moves
content the reader is trying to read.

## Sources

- [design-suggestions.md](../sources/design-suggestions.md) — the spatial system, type tiers
  and bento structure this keeps. Its palette and content are discarded; see
  [research-synthesis](research-synthesis.md)
- [portfolio-website-plan.md](../sources/portfolio-website-plan.md) — same
- `images/logo.jpg` — the source of both brand colours, sampled directly
