---
name: responsive-check
description: Drive the preview browser through this project's breakpoint x theme matrix and assert no horizontal scroll, naming the offending element when there is. Use when asked to "check responsive layout", "test mobile", "resize check", or before shipping a layout change.
---

# Responsive Check

Ported from the FPL App project (DSI-90) with one change: that version was screenshot-only and
left every call a visual judgement. **This one measures first and looks second.** The bug this
exists to catch does not always look wrong in a screenshot — a page can scroll sideways by 12px
without anything appearing clipped — and in this environment the browser pane often reports
`document.hidden`, which throttles animation and makes screenshots unreliable anyway.

## The matrix

`breakpoints.json` holds it as data so nobody re-derives it by hand:

| Label | Size | Why |
|---|---|---|
| mobile | 375x812 | `mobile` preset — also emulates touch and an Android UA |
| tablet | 768x1024 | the `md` boundary |
| tablet-landscape | 1024x768 | |
| zen-width | 1208x900 | **broke a real layout once. Keep testing it** |
| desktop | 1280x800 | |
| wide-desktop | 1440x900 | |

Each at `light` and `dark`, on every route listed in `breakpoints.json`.

## Procedure

1. `preview_start` the dev server — never Bash.
2. For each breakpoint x scheme x route: `resize_window`, `navigate`, then run the probe below.
3. Screenshot only where the probe reports something, or where a spot check is genuinely
   wanted. Screenshots are for diagnosing a failure, not for finding one.

## The probe

```js
const vw = document.documentElement.clientWidth;
const over = [...document.querySelectorAll('body *')]
  .map((el) => ({ el, r: el.getBoundingClientRect() }))
  .filter(({ r }) => r.width > 0 && (r.right > vw + 1 || r.left < -1))
  // outermost only: a wide parent reports every child as well
  .filter(({ el }, _, all) => !all.some((o) => o.el !== el && o.el.contains(el)));

JSON.stringify({
  ok: document.documentElement.scrollWidth <= window.innerWidth,
  scrollW: document.documentElement.scrollWidth,
  innerW: window.innerWidth,
  offenders: over.slice(0, 5).map(({ el, r }) => ({
    tag: el.tagName.toLowerCase(),
    cls: (el.getAttribute('class') || '').slice(0, 60),
    left: Math.round(r.left),
    right: Math.round(r.right),
  })),
});
```

## What the probe is checking, and why

`document.documentElement.scrollWidth === window.innerWidth` at every width. The Abhijit site
lost five deploys to a horizontal-scroll bug that does not reproduce in desktop emulation: a
fixed-position element resolved its offset against a window measuring 876px while the layout
viewport was 411px.

Three rules came out of that, and they are the first things to check when the probe fails:

- Float things with `left-0` and `w-screen`. **Never** `right-*` or `inset-x-*`.
- `overflow-x: clip` on the root does **not** clip fixed-position boxes.
- Nothing scrolls sideways. There is no acceptable amount.

## Reporting

Name the breakpoint, the theme, the route, and the element — not "looks fine" or "looks broken".
A pass means the probe returned `ok: true` everywhere **and** the visual spot checks were
reviewed; say which of the two you actually did.

**Landscape and display cutouts.** The viewport meta deliberately omits `viewport-fit=cover`, so
the browser insets the page away from a notch or camera cutout and nothing needs
`env(safe-area-inset-*)`. Verified on device in landscape (DSI-90). If anyone adds
`viewport-fit=cover` to go edge-to-edge, safe-area padding becomes required in the same change
and this check has to be redone.

**A recording is not a check.** A screen recording shows what happened, not what was attempted:
a failed attempt to swipe the page sideways looks exactly like never having tried. Video
corroborates layout; it cannot evidence the absence of horizontal scroll. Ask for the
observation, not just the capture.

**Emulation is not a phone.** The gate on DSI-90 requires a real device, because that is exactly
where the bug above failed to reproduce in emulation. If it has not been checked on hardware,
say so rather than implying it has.
