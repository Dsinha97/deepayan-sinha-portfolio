---
/*
 * The DS monogram (DSI-89). Redrawn as vector from `images/logo.jpg`, which is
 * a JPEG on a white canvas and would show as a white box in dark mode — that
 * file is the archive copy, not a shippable asset, and nothing references it.
 *
 * The trace is a real trace, not a redraw: the purple and teal masks were
 * contoured off the source at full resolution, simplified, and refitted as
 * cubic curves, so the script letterforms are the original ones rather than
 * an approximation of them.
 *
 * Colour comes from `.logo-mark__*` rules in global.css, never from a fill
 * attribute here, because the mark has to switch with the theme: #3E2A68 is
 * unreadable on the indigo dark ground. The seam is the kintsugi break
 * (DSI-115), clipped to the letterforms so gold appears only where the break
 * crosses a stroke — lacquer in a join, not a line drawn over the top.
 *
 * The clip needs an id, and an id in an inlined SVG collides with every other
 * copy on the page. `uid` makes it unique per instance; pass one explicitly if
 * a test needs it stable.
 */
interface Props {
  /** Accessible name. Empty (the default) marks the mark decorative. */
  label?: string;
  /** Extra classes on the <svg>. */
  class?: string;
  /** Suffix for the clip-path id. Random per instance unless given. */
  uid?: string;
  /** Anything else lands on the <svg> — data attributes, width, and so on. */
  [key: string]: unknown;
}

const {
  label = '',
  class: className = '',
  uid = Math.random().toString(36).slice(2, 8),
  ...rest
} = Astro.props;

const clipId = `ds-seam-${uid}`;
---

<svg
  {...rest}
  class:list={['logo-mark', className]}
  viewBox="0 0 100 __VH__"
  role={label ? 'img' : 'presentation'}
  aria-label={label || undefined}
  aria-hidden={label ? undefined : 'true'}
  focusable="false"
>
  {label && <title>{label}</title>}
  <clipPath id={clipId}><path d="__L__" /></clipPath>
  <path class="logo-mark__letters" fill-rule="evenodd" d="__L__" />
  <path class="logo-mark__arrow" fill-rule="evenodd" d="__A__" />
  <g clip-path={`url(#${clipId})`} class="logo-mark__seam">
    <path d="__SM__" stroke-width="1.5" />
    <path d="__SB__" stroke-width="0.9" stroke-opacity="0.6" />
  </g>
</svg>
