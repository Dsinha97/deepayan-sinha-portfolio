/*
 * Header behaviour (DSI-86): shrink on scroll, mobile menu, and which nav
 * entry is current.
 *
 * Bundled by Astro into /_astro/, so this is an external file and the strict
 * `script-src 'self'` covers it without a hash. Nothing here is required for
 * the page to work — with JavaScript off the header is simply always at full
 * height, the mobile menu is a plain anchor list, and no nav entry is marked
 * current. Progressive enhancement is the contract, not a nice-to-have.
 */

const header = document.querySelector('[data-header]');
const mark = document.querySelector('[data-header-mark]');
const button = document.querySelector('[data-menu-button]');
const menu = document.querySelector('[data-menu]');
const iconOpen = document.querySelector('[data-menu-icon-open]');
const iconClose = document.querySelector('[data-menu-icon-close]');

/*
 * A note on the class names below. Tailwind 4 scans source files for complete
 * class strings, this file included, so 'py-2', 'py-4' and 'scale-90' exist in
 * the stylesheet only because they appear here as whole literals. Build one by
 * concatenation — `'py-' + n` — and Tailwind emits no rule at all and the
 * header silently stops shrinking. Same rule as the bento spans in DSI-102.
 */

/* --- shrink on scroll ---------------------------------------------------- */

if (header) {
  // A threshold with a dead zone, not a continuous scroll handler: the header
  // crosses one boundary and stays put, so a reader scrubbing around 32px
  // cannot make it flicker.
  const ENTER = 48;
  const LEAVE = 16;
  const bar = header.querySelector('[data-header-bar]');
  let shrunk = false;

  const onScroll = () => {
    const y = window.scrollY;
    if (!shrunk && y > ENTER) shrunk = true;
    else if (shrunk && y < LEAVE) shrunk = false;
    else return;
    bar?.classList.toggle('py-2', shrunk);
    bar?.classList.toggle('py-4', !shrunk);
    mark?.classList.toggle('scale-90', shrunk);
  };

  onScroll();
  addEventListener('scroll', onScroll, { passive: true });
}

/* --- mobile menu --------------------------------------------------------- */

if (button && menu) {
  // `data-open` rather than a `hidden` class: the panel animates on it, and
  // motion.css transitions `visibility` at the end of the close so the links
  // inside leave the tab order once the panel has finished animating out.
  const setOpen = (open) => {
    button.setAttribute('aria-expanded', String(open));
    menu.dataset.open = String(open);
    iconOpen?.classList.toggle('opacity-0', open);
    iconOpen?.classList.toggle('scale-90', open);
    iconClose?.classList.toggle('opacity-0', !open);
    iconClose?.classList.toggle('scale-90', !open);
  };

  button.addEventListener('click', () => {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });

  // Escape closes it and puts focus back on the button, or the reader is left
  // tabbing through a panel they can no longer see.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      button.focus();
    }
  });

  menu.querySelectorAll('[data-menu-link]').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  // A resize past the breakpoint (lg, where the full nav appears) leaves the
  // panel hidden by CSS but still marked open, so the button would lie to a
  // screen reader. Five nav entries plus Resume and the toggle need 1024px.
  matchMedia('(min-width: 64rem)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

/* --- which section is current -------------------------------------------- */

const anchorLinks = [...document.querySelectorAll('[data-nav-link][data-target]')];

if (anchorLinks.length > 0 && 'IntersectionObserver' in window) {
  const sections = anchorLinks
    .map((link) => document.getElementById(link.dataset.target))
    .filter(Boolean);

  if (sections.length > 0) {
    const visible = new Set();

    const markCurrent = () => {
      // The topmost visible section wins, so two sections on screen at once
      // cannot leave both entries lit.
      const current = sections.find((section) => visible.has(section.id));
      anchorLinks.forEach((link) => {
        if (current && link.dataset.target === current.id) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        markCurrent();
      },
      // Discount the sticky header at the top and most of the viewport at the
      // bottom, so "current" means "at the top of what you are reading"
      // rather than "anywhere on screen".
      { rootMargin: '-20% 0px -70% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }
}
