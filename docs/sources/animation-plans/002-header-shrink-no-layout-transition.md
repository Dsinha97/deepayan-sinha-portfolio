# 002 — Stop animating `padding` on the sticky header shrink

- **Status**: TODO
- **Commit**: cb8a528
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 2 files (1 Astro template, 1 script), CSS-class change only

## Problem

The sticky header shrinks on scroll by toggling Tailwind's `py-4`/`py-2`
classes on the header bar, and that class swap is animated with
`transition-[padding]`. `padding` is a layout property — animating it forces
layout + paint + composite on every transition, unlike `transform`/`opacity`
which run on the compositor only. This is exactly the case the audit calls
out: "Animate `transform` and `opacity` only... `padding` ... trigger[s]
layout + paint + composite."

The trigger is scroll — a high-frequency interaction — though a dead-zone
(`ENTER = 48`, `LEAVE = 16`) means the transition only fires once per
direction change rather than continuously, which is why this is MEDIUM and
not HIGH: it is a single bounded reflow per crossing, not a per-frame cost.
It is still a correctness violation of the transform/opacity rule on the
site's one truly high-frequency animated element, and the fix is cheap.

Current code:

```astro
<!-- src/components/Header.astro:42-45 -->
<div
	class="mx-auto flex max-w-[75rem] items-center justify-between gap-4 px-4 py-4 transition-[padding] duration-150 md:px-6"
	data-header-bar
>
```

```astro
<!-- src/components/Header.astro:51 -->
<LogoMark class="w-20 transition-transform duration-150 md:w-24" data-header-mark />
```

```javascript
// src/scripts/header.js:38-46
const onScroll = () => {
  const y = window.scrollY;
  if (!shrunk && y > ENTER) shrunk = true;
  else if (shrunk && y < LEAVE) shrunk = false;
  else return;
  bar?.classList.toggle('py-2', shrunk);
  bar?.classList.toggle('py-4', !shrunk);
  mark?.classList.toggle('scale-90', shrunk);
};
```

The logo mark (`LogoMark`) already does this correctly — it shrinks via
`transition-transform` + a `scale-90` class toggle, which is compositor-only.
The header bar's padding shrink is the one piece still on the layout path.

## Target

Stop transitioning `padding` at all — make the padding swap instant — and
let the *visual* shrink read entirely through the logo's existing transform
animation, which already communicates "the header just got smaller." This
removes the layout-property animation without trying to fake a smooth
height/padding transition through transform tricks (which would require
`transform-origin` compensation and risks distorting nav content — out of
scope for a MEDIUM-severity fix on a small site).

```astro
<!-- target: src/components/Header.astro:42-45 -->
<div
	class="mx-auto flex max-w-[75rem] items-center justify-between gap-4 px-4 py-4 md:px-6"
	data-header-bar
>
```

(`transition-[padding] duration-150` is deleted; `py-2`/`py-4` are still
toggled by `header.js`, but the swap is now instant — no `transition-property`
lists `padding`, so nothing animates it.)

The logo's own transform transition is untouched and remains the sole
animated cue for the shrink:

```astro
<!-- unchanged: src/components/Header.astro:51 -->
<LogoMark class="w-20 transition-transform duration-150 md:w-24" data-header-mark />
```

## Repo conventions to follow

- Motion primitives that need care live in `src/styles/motion.css` with
  explanatory comments (see the file header there); a one-line class removal
  like this doesn't need a new primitive, it needs the opposite — deleting
  an ad hoc animated-layout-property utility that was never promoted to a
  primitive.
- The logo mark's `transition-transform duration-150` (`Header.astro:51`) is
  the exemplar for how this component already does compositor-only motion
  correctly — no change needed there, just point to it as the pattern this
  plan brings the padding swap in line with (by removing the padding
  animation rather than converting it, since padding cannot be animated on
  the compositor).

## Steps

1. `src/components/Header.astro:43` — remove `transition-[padding]
   duration-150` from the `class` string on the `data-header-bar` div,
   leaving `px-4 py-4 md:px-6` (and the rest of the class string) unchanged.
2. `src/scripts/header.js` — no code change needed. `classList.toggle`
   calls on lines 43-45 keep working exactly as before; only the CSS
   transition that used to animate the padding change is gone, so the
   change becomes instant instead of interpolated.

## Boundaries

- Do NOT touch `mark?.classList.toggle('scale-90', shrunk)` or the
  `LogoMark`'s `transition-transform duration-150` class — that animation is
  correct and stays as-is.
- Do NOT attempt to re-introduce a smooth shrink via `transform: scaleY()`
  or similar on the header bar itself — that would distort child content
  (nav links, logo) and is out of scope for this fix.
- Do NOT change the `ENTER`/`LEAVE` scroll thresholds or the dead-zone logic
  in `header.js`.
- If `Header.astro:43` no longer contains `transition-[padding]
  duration-150` when this plan is executed (drift since commit `cb8a528`),
  STOP and report instead of guessing which class list to edit.

## Verification

- **Mechanical**: `npm run check` and `npm run build` both pass (pure class
  removal, no logic change).
- **Feel check**: run `npm run dev`, scroll the homepage past 48px and back
  above 16px several times:
  - Confirm the header's vertical padding now snaps instantly between the
    two sizes (no interpolation) while the logo mark still visibly and
    smoothly shrinks/grows via its transform transition.
  - In DevTools Performance panel, record a scroll session crossing the
    threshold a few times and confirm there is no recurring "Layout" /
    "Recalculate Style" entry attributable to the header bar's padding
    change (a small one-time layout from the instant class swap is
    expected and fine; a *transitioning* layout across multiple frames is
    what this plan removes).
  - Confirm no visual regression: the header still visually shrinks (via
    the logo) and the nav/resume link/theme toggle stay aligned at both
    sizes.
- **Done when**: `Header.astro`'s header-bar div has no `transition-*`
  utility targeting `padding`, the logo shrink still animates smoothly, and
  both mechanical checks pass.
