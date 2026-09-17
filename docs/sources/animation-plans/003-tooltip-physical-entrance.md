# 003 — Give the social-link tooltip a physical entrance

- **Status**: TODO
- **Commit**: cb8a528
- **Severity**: MEDIUM
- **Category**: Physicality & origin
- **Estimated scope**: 1 file (shared component, used in 3 places: Footer, IdentityRail, Contact)

## Problem

`SocialLink.astro`'s hover/focus tooltip is a pure opacity fade with no
initial transform — it has no sense of arriving *from* the icon it labels.
Per the audit: "Hunt for: ... pure-fade entrances with no initial
transform." This tooltip is shown on every social icon across the Footer,
the homepage IdentityRail, and the Contact section — a component used in
(currently) 6 render sites total (2 icons × 3 usages), so the fix compounds
across the whole site for one small edit.

Current code:

```astro
<!-- src/components/SocialLink.astro:39-46 -->
<span
	role="tooltip"
	aria-hidden="true"
	class="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 whitespace-nowrap rounded-control border border-border bg-elevated px-2 py-1 text-meta text-fg opacity-0 transition-opacity group-hover:opacity-100 peer-focus-visible:opacity-100"
>
	{label}
</span>
```

The tooltip already opens upward (`bottom-full`, per the component's own
comment at lines 19-20: "It opens upward... In the footer there is nothing
below to open into"), so the physically correct entrance is a small
downward-to-upward settle: start slightly lower (closer to the trigger) and
translate up into its resting position as it fades in — reinforcing that it
came from the icon below it.

## Target

Add a small vertical travel to the existing translate, driven by the same
opacity trigger classes (`group-hover`, `peer-focus-visible`), using the
audit's non-zero-scale-equivalent principle for entrances: never appear from
nothing, arrive from a nearby resting state.

```astro
<!-- target: src/components/SocialLink.astro:39-46 -->
<span
	role="tooltip"
	aria-hidden="true"
	class="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-control border border-border bg-elevated px-2 py-1 text-meta text-fg opacity-0 transition-[opacity,transform] duration-150 ease-out group-hover:translate-y-0 group-hover:opacity-100 peer-focus-visible:translate-y-0 peer-focus-visible:opacity-100"
>
	{label}
</span>
```

Values, all from the audit's exact tables:

- Travel distance: `translate-y-1` (Tailwind's `0.25rem` / 4px) resting-closed
  offset — small enough to read as "settling into place," not a slide.
  Combined with the existing `-translate-x-1/2` via Tailwind's composable
  `translate-x-*`/`translate-y-*` utilities (both apply simultaneously; no
  conflict).
- Duration: `duration-150` — within the audit's "Tooltips, small popovers:
  125–200ms" budget.
- Easing: `ease-out` — matches the audit's decision rule "Entering or
  exiting → `ease-out`." (This uses Tailwind's built-in `ease-out` utility,
  not the stronger custom curve reserved in AUDIT.md for deliberate/large
  UI motion — a 4px, 150ms tooltip nudge is squarely in the "hover / small
  popover" tier the audit treats as fine with the built-in curve.)
- Property list: `transition-[opacity,transform]` replaces the current
  `transition-opacity` so the new translate is actually animated (the old
  class only ever transitioned `opacity`).

## Repo conventions to follow

- `SocialLink.astro`'s own file comment (lines 11-21) already documents the
  reduced-motion reasoning for this exact element: "Opacity-only transition:
  the global reduced-motion block in global.css collapses it to 0.01ms on
  its own, so there is no media query to write here." That reasoning still
  holds after this change — `global.css:389-400`'s blanket
  `transition-duration: 0.01ms !important` under
  `prefers-reduced-motion: reduce` will collapse the new transform
  transition too, with no extra media query needed. Update this comment (see
  Steps) so it accurately describes the transition after the change, rather
  than leaving a comment that says "opacity-only" next to a transform
  transition.
- This is the one component-level tooltip pattern on the site; there is no
  other tooltip to cross-check against, so the fix should stay self-similar
  to the existing subtlety of the rest of the site's motion (small, quiet,
  never bouncy) rather than introduce a new visual language.

## Steps

1. `src/components/SocialLink.astro:39-46` — update the tooltip `<span>`'s
   `class` string:
   - Add `translate-y-1` immediately after `-translate-x-1/2`.
   - Replace `transition-opacity` with `transition-[opacity,transform]
     duration-150 ease-out`.
   - Add `group-hover:translate-y-0` immediately before
     `group-hover:opacity-100`.
   - Add `peer-focus-visible:translate-y-0` immediately before
     `peer-focus-visible:opacity-100`.
2. `src/components/SocialLink.astro:16-17` — update the comment that
   currently reads:
   ```
   * Opacity-only transition: the global reduced-motion block in global.css
   * collapses it to 0.01ms on its own, so there is no media query to write here.
   ```
   to:
   ```
   * Opacity + a small settle-in translate: the global reduced-motion block in
   * global.css collapses both to 0.01ms on its own, so there is no media
   * query to write here.
   ```

## Boundaries

- Do NOT change the anchor (`<a>`) element in this file — its own
  `active:scale`/press-feedback treatment is covered by plan 001, not this
  plan.
- Do NOT change `bottom-full`, `mb-1`, or the horizontal centering
  (`left-1/2 -translate-x-1/2`) — only add the vertical entrance translate
  alongside them.
- Do NOT introduce a custom cubic-bezier token for this — the built-in
  `ease-out` utility is correct at this scale per AUDIT.md's decision table.
- If `SocialLink.astro:39-46` no longer matches the class string shown above
  (drift since commit `cb8a528`), STOP and report rather than guessing where
  to insert the new utilities.

## Verification

- **Mechanical**: `npm run check` and `npm run build` both pass.
- **Feel check**: run `npm run dev`, visit the homepage (IdentityRail
  icons), the Footer, and the Contact section (all three render
  `SocialLink`):
  - Hover a social icon and confirm the tooltip now visibly rises ~4px into
    place while fading in, rather than just appearing in place.
  - Tab to a social icon with the keyboard and confirm the same entrance
    plays on `:focus-visible`.
  - In DevTools Animations panel, set playback to 10% and confirm the
    translate and opacity animate together over the same 150ms window (not
    staggered oddly).
  - Toggle `prefers-reduced-motion: reduce` in DevTools' Rendering panel
    and confirm the tooltip still appears (just without the perceptible
    travel/fade — collapsed to near-instant by the existing global rule).
- **Done when**: hovering or focusing any of the 6 social-icon instances
  site-wide shows the tooltip rising into place rather than fading in
  static, and both mechanical checks pass.
