# 004 — Cross-fade the theme-toggle and hamburger icon swaps

- **Status**: TODO
- **Commit**: cb8a528
- **Severity**: MEDIUM
- **Category**: Missed opportunities / Interruptibility
- **Estimated scope**: 2 files (CSS-driven icon visibility swaps)

## Problem

Two icon-swap interactions on the site currently teleport between states
with zero transition, even though both are driven purely by CSS
`display`/class toggles that already exist and could interpolate:

1. **Theme toggle** — `ThemeToggle.astro` keeps both the sun and moon SVGs
   permanently in the DOM and uses `display: none`/`display: block` (via the
   `.theme-toggle__sun`/`.theme-toggle__moon` rules in `global.css`) to show
   only one, keyed off `data-theme`. `display` cannot be transitioned, so the
   swap is an instant cut every time the toggle is clicked.
2. **Header hamburger** — `Header.astro`'s mobile menu button swaps between
   an open-menu icon (three lines) and a close icon (X) by toggling Tailwind's
   `hidden` class (`display: none`) on two `<path>` elements inside one SVG,
   driven by `header.js`. Same instant-cut problem, right next to a mobile
   panel (`.t-panel` in `motion.css`) that already animates its open/close
   very deliberately — the icon that triggers it doesn't match that care.

Both are occasional, user-initiated actions (a handful of times per session
at most) — squarely in the audit's "occasional: standard animation" tier,
not "no animation" territory — and both currently render as a state change
that teleports, which the audit's Missed Opportunities category calls out
directly: "State changes that teleport... where a brief transition would
prevent a jarring change."

Current code:

```css
/* src/styles/global.css:346-365 */
.theme-toggle__sun {
  display: none;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) .theme-toggle__sun {
    display: block;
  }
  :root:not([data-theme='light']) .theme-toggle__moon {
    display: none;
  }
}

[data-theme='dark'] .theme-toggle__sun {
  display: block;
}

[data-theme='dark'] .theme-toggle__moon {
  display: none;
}
```

```astro
<!-- src/components/ThemeToggle.astro:32-58 -->
<svg
	class="theme-toggle__moon size-5"
	...
>
	<path d="M20 13.5A8.2 8.2 0 0 1 10.5 4a8.2 8.2 0 1 0 9.5 9.5Z"></path>
</svg>
<svg
	class="theme-toggle__sun size-5"
	...
>
	<circle cx="12" cy="12" r="4.2"></circle>
	<path d="M12 2.6v2.2M12 19.2v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.6 12h2.2M19.2 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"
	></path>
</svg>
```

```astro
<!-- src/components/Header.astro:88-99 -->
<svg
	viewBox="0 0 24 24"
	class="size-6"
	fill="none"
	stroke="currentColor"
	stroke-width="1.75"
	stroke-linecap="round"
	aria-hidden="true"
>
	<path d="M4 7h16M4 12h16M4 17h16" data-menu-icon-open />
	<path d="M6 6l12 12M18 6L6 18" data-menu-icon-close class="hidden" />
</svg>
```

```javascript
// src/scripts/header.js:58-63 (relevant excerpt)
const setOpen = (open) => {
  button.setAttribute('aria-expanded', String(open));
  menu.dataset.open = String(open);
  iconOpen?.classList.toggle('hidden', open);
  iconClose?.classList.toggle('hidden', !open);
};
```

## Target

Replace `display` toggling with an opacity + scale cross-fade for both icon
pairs, using absolute positioning so both icons occupy the same box and
cross-fade in place rather than causing layout shift. Both icons stay
mounted at all times (no `display: none`) — visibility to assistive tech is
already handled by `aria-hidden="true"` on both SVGs (theme toggle) and the
parent `aria-label`/`aria-expanded` on the button (hamburger), so hiding via
opacity instead of `display` does not add anything to the tab order or the
accessibility tree beyond what already exists.

Values, from the audit's exact tables: duration **150ms** (small icon
swap, in the audit's 125–200ms "tooltips, small popovers" band — the same
tier a small in-place icon swap belongs to), easing **`ease-out`** (audit
rule: "Hover / color change → `ease`" for the fade but this is more than a
color change — it's an entrance-of-sorts for the incoming icon, so
`ease-out` per "Entering or exiting → `ease-out`"), and a **`scale(0.9)`**
starting point per the audit's "Never `scale(0)` — target: `scale(0.9-0.97)`
+ `opacity: 0`" physicality rule.

### 1. Theme toggle

```css
/* target: src/styles/global.css — replace lines 346-365 */
.theme-toggle__sun,
.theme-toggle__moon {
  position: absolute;
  inset: 0;
  margin: auto;
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 150ms ease-out, transform 150ms ease-out;
}

[data-theme='dark'] .theme-toggle__sun {
  opacity: 1;
  transform: scale(1);
}

:root:not([data-theme='light']) .theme-toggle__moon {
  opacity: 1;
  transform: scale(1);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) .theme-toggle__sun {
    opacity: 1;
    transform: scale(1);
  }
  :root:not([data-theme='light']) .theme-toggle__moon {
    opacity: 0;
    transform: scale(0.9);
  }
}

[data-theme='dark'] .theme-toggle__moon {
  opacity: 0;
  transform: scale(0.9);
}
```

Wait — this needs the light-mode moon visible by default. Re-derive
carefully in Steps below rather than trusting this snippet blindly; the
logic must preserve the exact three-state precedence already documented in
`ThemeToggle.astro`'s file comment (system preference, then explicit
`data-theme`, in both directions) — see Steps 1-2 for the exact rule set.

```astro
<!-- target: src/components/ThemeToggle.astro:23-31 (button needs relative positioning for the absolute icons) -->
<button
	type="button"
	data-theme-toggle
	aria-label="Switch to dark theme"
	class:list={[
		'relative inline-flex size-11 items-center justify-center rounded-control text-fg-2 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
		className,
	]}
>
```

### 2. Header hamburger

```astro
<!-- target: src/components/Header.astro:88-99 -->
<svg
	viewBox="0 0 24 24"
	class="relative size-6"
	fill="none"
	stroke="currentColor"
	stroke-width="1.75"
	stroke-linecap="round"
	aria-hidden="true"
>
	<path
		d="M4 7h16M4 12h16M4 17h16"
		data-menu-icon-open
		class="origin-center transition-[opacity,transform] duration-150 ease-out"
	/>
	<path
		d="M6 6l12 12M18 6L6 18"
		data-menu-icon-close
		class="origin-center opacity-0 scale-90 transition-[opacity,transform] duration-150 ease-out"
	/>
</svg>
```

```javascript
// target: src/scripts/header.js:58-63
const setOpen = (open) => {
  button.setAttribute('aria-expanded', String(open));
  menu.dataset.open = String(open);
  iconOpen?.classList.toggle('opacity-0', open);
  iconOpen?.classList.toggle('scale-90', open);
  iconClose?.classList.toggle('opacity-0', !open);
  iconClose?.classList.toggle('scale-90', !open);
};
```

Both `<path>`s are stacked in the same `viewBox` space by default (SVG
paths don't need `position: absolute` to overlap — they already share the
same coordinate system), so no extra positioning is needed here, unlike the
theme toggle's two separate `<svg>` elements.

## Repo conventions to follow

- Easing/duration values are written as plain Tailwind utilities or literal
  CSS `ms` values inline, matching how `motion.css` writes `--panel-ease` as
  a token but every other transition on the site (see `Header.astro`,
  `SocialLink.astro`, etc.) uses Tailwind's built-in `ease-out`/duration
  utilities directly with no per-component token. Follow the latter for
  these two small icon swaps — they don't need a new custom-curve token,
  per AUDIT.md's decision table (only "moving/morphing" or deliberate large
  UI motion earns the stronger custom curves).
- `motion.css`'s `.t-panel` block (lines 39-84) is the site's one existing
  example of swapping visual state via opacity + transform + explicit
  before/after class blocks with careful reduced-motion handling — use it as
  the structural exemplar for the theme-toggle CSS rewrite (state-keyed
  selectors, each with its own transition block), but note `.t-panel` needs
  a `visibility` delay that these icon swaps do not, because neither icon
  is ever in the tab order (both are `aria-hidden` or inside a single
  button) — do not copy the `visibility` transition.

## Steps

1. `src/styles/global.css` — replace lines 346-365 (the six `.theme-toggle__*`
   rules) with:
   ```css
   .theme-toggle__sun,
   .theme-toggle__moon {
     position: absolute;
     inset: 0;
     margin: auto;
     opacity: 0;
     transform: scale(0.9);
     transition: opacity 150ms ease-out, transform 150ms ease-out;
   }

   /* Default (light, no explicit choice, no dark system preference): show the moon. */
   .theme-toggle__moon {
     opacity: 1;
     transform: scale(1);
   }

   @media (prefers-color-scheme: dark) {
     :root:not([data-theme='light']) .theme-toggle__sun {
       opacity: 1;
       transform: scale(1);
     }
     :root:not([data-theme='light']) .theme-toggle__moon {
       opacity: 0;
       transform: scale(0.9);
     }
   }

   [data-theme='dark'] .theme-toggle__sun {
     opacity: 1;
     transform: scale(1);
   }

   [data-theme='dark'] .theme-toggle__moon {
     opacity: 0;
     transform: scale(0.9);
   }
   ```
   This preserves the exact same precedence the original `display` rules
   encoded (system preference shows the sun when dark and no explicit
   `data-theme='light'` override; an explicit `data-theme='dark'` always
   shows the sun regardless of system preference; everything else defaults
   to the moon), just expressed as opacity/transform instead of display.
2. `src/components/ThemeToggle.astro:27` — add `relative` to the first
   string in the `class:list` array (so the two absolutely-positioned SVGs
   lay out relative to the button), producing:
   ```
   'relative inline-flex size-11 items-center justify-center rounded-control text-fg-2 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
   ```
3. `src/components/Header.astro:97-98` — replace the two `<path>` elements
   with:
   ```astro
   <path
   	d="M4 7h16M4 12h16M4 17h16"
   	data-menu-icon-open
   	class="origin-center transition-[opacity,transform] duration-150 ease-out"
   />
   <path
   	d="M6 6l12 12M18 6L6 18"
   	data-menu-icon-close
   	class="origin-center opacity-0 scale-90 transition-[opacity,transform] duration-150 ease-out"
   />
   ```
   (removes the `hidden` class from `data-menu-icon-close`; both paths are
   now always rendered and cross-fade via opacity/scale instead).
4. `src/scripts/header.js:58-63` — replace the `setOpen` body's icon lines:
   ```javascript
   const setOpen = (open) => {
     button.setAttribute('aria-expanded', String(open));
     menu.dataset.open = String(open);
     iconOpen?.classList.toggle('opacity-0', open);
     iconOpen?.classList.toggle('scale-90', open);
     iconClose?.classList.toggle('opacity-0', !open);
     iconClose?.classList.toggle('scale-90', !open);
   };
   ```
   Leave the rest of `setOpen` (the `aria-expanded`/`data-open` lines)
   unchanged.

## Boundaries

- Do NOT change `theme.js`'s click handler logic or `localStorage` behavior
  — only the CSS that decides which icon is visible.
- Do NOT remove `aria-hidden="true"` from either theme-toggle SVG, and do
  NOT add `aria-hidden` anywhere it doesn't already exist — the accessible
  name is carried entirely by the button's `aria-label`, per the component's
  existing comment (lines 10-15), and this plan does not touch that.
- Do NOT change `iconOpen`/`iconClose`'s `hidden` class handling anywhere
  outside `header.js`'s `setOpen` function.
- Do NOT touch the `.t-panel` rules in `motion.css` — the panel's own
  animation is out of scope and already correct.
- If any of the four cited locations (`global.css:346-365`,
  `ThemeToggle.astro:27`, `Header.astro:97-98`, `header.js:58-63`) has
  drifted from what's shown above (changes since commit `cb8a528`), STOP on
  that file and report rather than improvising a merge.

## Verification

- **Mechanical**: `npm run check` and `npm run build` both pass. Run
  `npm run build` specifically to confirm the `check-dist.mjs` guard still
  passes — this plan adds no `style=""` attributes and no inline `<style>`
  blocks, only class-list and external-CSS changes, so it should be a
  no-op for that guard, but confirm it explicitly since the guard is
  build-breaking.
- **Feel check**: run `npm run dev`:
  - Click the theme toggle repeatedly and confirm the sun/moon now
    cross-fade with a slight scale-up rather than snapping instantly.
    Confirm there is never a moment where *both* icons are fully visible
    at once (they should cross at opacity ~0.5 each, not overlap solid).
  - Load the page with the OS set to dark mode and no stored preference,
    and confirm the sun renders (opacity 1) on first paint with no flash of
    the moon before JS runs — the CSS-only default-state rules must be
    correct with zero JavaScript involved, matching the original
    `display`-based version's no-flash guarantee.
  - Resize below the `md` breakpoint (mobile menu becomes visible), click
    the hamburger button, and confirm the three-line icon cross-fades and
    scales down to the X rather than cutting instantly. Click again and
    confirm the reverse.
  - Rapidly double-click the hamburger button and confirm the icons don't
    get stuck mid-cross-fade or end up both hidden/both visible — CSS
    transitions retarget correctly from mid-flight, so this should hold
    without extra code, but verify it in the browser.
  - In DevTools Animations panel, set playback to 10% and confirm both
    icon transitions run over ~150ms with the incoming icon starting at
    `scale(0.9)`, never `scale(0)`.
  - Toggle `prefers-reduced-motion: reduce` and confirm both swaps still
    happen but instantly (collapsed by `global.css:389-400`'s existing
    blanket rule — no new reduced-motion code needed here).
- **Done when**: both icon pairs cross-fade smoothly with no `display`
  toggling anywhere in the diff, the no-flash dark-mode-by-default guarantee
  still holds on first paint, and both mechanical checks pass.
