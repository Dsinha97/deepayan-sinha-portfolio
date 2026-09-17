# 001 — Add press feedback to every interactive control

- **Status**: TODO
- **Commit**: cb8a528
- **Severity**: HIGH
- **Category**: Physicality & origin
- **Estimated scope**: 9 files, small CSS-class-only edits

## Problem

No element on the site has `:active` press feedback. Every clickable control —
buttons, nav links, resume links, social icons, the theme toggle, the copy-email
button, work-grid cards — only defines `hover:` and `focus-visible:` states. On
a click or tap the control gives zero physical feedback that the press
registered; on touch devices (no `hover`) a tap currently gives **no visual
response of any kind** until the navigation/action completes.

This is the single highest-frequency motion gap on the site: every interactive
element the visitor ever clicks is affected, on every click.

Confirmed by `grep -rn "active:" src` returning zero matches (see recon).

Current code (representative sample — the same shape repeats site-wide):

```astro
<!-- src/components/Header.astro:68-74 (Resume link, desktop nav) -->
<a
  href={site.resumePath}
  aria-current={isCurrentRoute(site.resumePath) ? 'page' : undefined}
  class="ml-2 inline-flex min-h-11 items-center rounded-control border border-border-strong px-4 text-fg transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
>
  Resume
</a>
```

```astro
<!-- src/components/Contact.astro:25-32 (primary email button) -->
<a
  href={`mailto:${site.email}`}
  class="inline-flex min-h-11 items-center gap-2 rounded-control bg-accent-fill px-6 text-on-accent transition-colors hover:bg-accent-fill-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
  data-contact-email={site.email}
>
```

```astro
<!-- src/components/ThemeToggle.astro:23-30 -->
<button
  type="button"
  data-theme-toggle
  aria-label="Switch to dark theme"
  class:list={[
    'inline-flex size-11 items-center justify-center rounded-control text-fg-2 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    className,
  ]}
>
```

```astro
<!-- src/components/SocialLink.astro:30-38 -->
<a
  href={href}
  rel="me noopener"
  aria-label={label}
  class="peer inline-flex min-h-11 min-w-11 items-center justify-center rounded-control text-fg-2 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
>
```

```javascript
// src/scripts/contact.js:12-13 (button built at runtime)
const BUTTON_CLASS =
  'inline-flex min-h-11 items-center gap-2 rounded-control border border-border bg-surface px-4 text-fg-2 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';
```

```astro
<!-- src/pages/index.astro:62-65 (work-grid card) -->
<a
  href={`/work/${entry.id}/`}
  class="group flex w-full flex-col overflow-hidden rounded-card border border-border bg-surface transition-colors hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
>
```

## Target

Add `active:scale-[0.97] transition-transform duration-100` (Tailwind
utilities, so the class strings stay complete literals Tailwind can scan) to
every pressable control listed in Steps below, keeping each element's existing
`transition-colors` (or `transition-opacity`) for its hover state alongside
the new transform transition — Tailwind supports multiple `transition-*`
utilities on one element; each targets its own property list.

Per the audit's physicality rule: "Press feedback: `transform: scale(0.97)`
on `:active` with `transition: transform 160ms ease-out`. Keep it subtle
(0.95–0.98)." The plan uses `scale-[0.97]` (within the 0.95–0.98 band) and
`duration-100` (100ms, inside the audit's 100–160ms button-press-feedback
budget — 100ms is chosen over 160ms because these are small text/icon
controls, not large buttons, and the snappier end of the range reads better
at this size).

Example target for the Header resume link:

```astro
<a
  href={site.resumePath}
  aria-current={isCurrentRoute(site.resumePath) ? 'page' : undefined}
  class="ml-2 inline-flex min-h-11 items-center rounded-control border border-border-strong px-4 text-fg transition-colors hover:border-accent hover:text-accent active:scale-[0.97] transition-transform duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
>
  Resume
</a>
```

Note: Tailwind lets a single element carry two separate `transition-*`
utilities (`transition-colors` and `transition-transform`) — both compile to
one `transition-property` list under the hood, so this is safe and is already
implied by Tailwind's utility model; no custom CSS is needed.

## Repo conventions to follow

- All interactive elements on this site style hover/focus as Tailwind
  utility strings directly in the `class`/`class:list` attribute — there is
  no separate component-level CSS file for buttons or links (`src/styles/`
  holds only global tokens, fonts and the one hand-written `.t-panel`
  primitive in `motion.css`). Follow that pattern: add utility classes, do
  not introduce a new stylesheet rule.
- Tailwind 4 requires complete class-name literals to scan (see the note in
  `src/scripts/header.js:19-25` and `src/scripts/contact.js:8-11`) — never
  build a class by string concatenation. `active:scale-[0.97]` is a complete
  arbitrary-value literal and is safe to paste as-is into every file.
- Exemplar to imitate: none of the current interactive elements has this yet
  — this plan establishes the pattern others should follow afterward.

## Steps

1. `src/components/Header.astro`
   - Line 46-52 (logo home link `<a href="/">`): add
     `active:scale-[0.97] transition-transform duration-100` to the `class`
     attribute (after the existing `focus-visible:` utilities is fine;
     ordering doesn't matter to Tailwind).
   - Line 56-66 (nav item `<a>` inside `nav.map`): add the same two
     utilities to its `class` string.
   - Line 68-74 (Resume link, desktop nav): add the same two utilities.
   - Line 80-100 (mobile menu-button `<button>`): add the same two
     utilities.
   - Line 131-137 (mobile nav link `<a>` inside the second `nav.map`): add
     the same two utilities.
   - Line 142-148 (mobile Resume link): add the same two utilities.
2. `src/components/ThemeToggle.astro` — line 23-30, inside the `class:list`
   array's first string entry, append `active:scale-[0.97]
   transition-transform duration-100`.
3. `src/components/SocialLink.astro` — line 30-38, the anchor's `class`
   string: append `active:scale-[0.97] transition-transform duration-100`.
   (Do not touch the tooltip `<span>` at line 39-45 — that is covered by
   plan 003.)
4. `src/components/Contact.astro` — line 25-32, the mailto button `<a>`:
   append `active:scale-[0.97] transition-transform duration-100`.
5. `src/scripts/contact.js` — line 12-13, `BUTTON_CLASS` string: append
   `active:scale-[0.97] transition-transform duration-100`. This file emits
   a literal string read by Tailwind's scanner at build time same as the
   `.astro` files, per the comment at lines 8-11.
6. `src/components/IdentityRail.astro` — line 71-76, the Resume `<a>`:
   append `active:scale-[0.97] transition-transform duration-100`.
7. `src/pages/404.astro` — line 26-31, the "Back to the homepage" `<a>`:
   append `active:scale-[0.97] transition-transform duration-100`.
8. `src/layouts/ResumeLayout.astro` — line 41-47, the "Download PDF" `<a>`:
   append `active:scale-[0.97] transition-transform duration-100`.
9. `src/pages/index.astro`
   - Line 62-65 (each work-grid card `<a>`): append `active:scale-[0.97]
     transition-transform duration-100`.
   - Line 82-90 (the "Recognition" tile `<a>`): append the same two
     utilities.
10. `src/components/Timeline.astro` — line 77-83, the "See the case study"
    `<a>`: append `active:scale-[0.97] transition-transform duration-100`.
11. `src/components/Education.astro`
    - Line 117-122 (publication link): append the two utilities.
    - Line 142-147 (certificate link, inside the ternary): append the two
      utilities.
12. `src/pages/work/[slug].astro`
    - Line 80-86 (external project link inside `data.links.map`): append the
      two utilities.
    - Line 148-153 (prev-case-study link) and line 156-161
      (next-case-study link): append the two utilities to both.

## Boundaries

- Do NOT touch hover-only or non-interactive elements (e.g. the seam dot in
  `Timeline.astro:37-40`, the tooltip `<span>` in `SocialLink.astro`, any
  `<dt>`/`<dd>` text).
- Do NOT change `min-h-11`/`min-w-11` hit-area sizing, focus-ring utilities,
  or any non-motion class.
- Do NOT add new dependencies or a `:active` rule to `global.css` — every
  edit is a Tailwind utility added inline, matching the existing pattern.
- Do NOT touch `src/components/SocialLink.astro`'s tooltip `<span>` (lines
  39-45) — its fade is covered by plan 003, not this one.
- If a cited file:line no longer matches what this plan describes (drift
  since commit `cb8a528`), STOP on that file and report instead of
  improvising — apply the same `active:scale-[0.97] transition-transform
  duration-100` pattern to whatever pressable element replaced it only if
  its shape is unambiguous; otherwise skip and flag.

## Verification

- **Mechanical**: `npm run check` (must pass — this is a class-only change,
  Astro's type checker should be unaffected). `npm run build` must also
  succeed (the dist guards check inline scripts/styles/phone numbers, none
  of which this touches).
- **Feel check**: run `npm run dev` (or the preview tools), and for at least
  one control from each file above:
  - Click and hold (or use DevTools' "Emulate a focused page" + mouse-down)
    and confirm the element visibly shrinks to 97% before releasing.
  - Confirm the shrink recovers smoothly on release — no snap-back jump.
  - In DevTools' Animations panel, set playback to 10% and confirm the
    scale transition is smooth over ~100ms, not instant.
  - Tap a work-grid card on a touch-emulated viewport (DevTools device
    toolbar) and confirm the press feedback appears even though there is no
    `hover:` state to rely on.
  - Toggle `prefers-reduced-motion: reduce` in DevTools' Rendering panel
    and confirm the press scale is suppressed to near-instant (this is
    already handled globally by `global.css:389-400`, which collapses all
    `transition-duration` to `0.01ms` — no per-component reduced-motion
    code is needed for this plan).
- **Done when**: every element listed in Steps 1-12 has both
  `active:scale-[0.97]` and `transition-transform duration-100` in its
  class list, `npm run check` and `npm run build` both pass, and the feel
  check above holds for a sample of at least 5 of the 12 files.
