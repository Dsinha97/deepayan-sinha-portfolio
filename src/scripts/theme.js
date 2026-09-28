/*
 * Theme toggle behaviour (DSI-87). Bundled by Astro into /_astro/, so this is
 * an external file that `script-src 'self'` covers without a hash. The only
 * script that has to be inline is theme-init.js, which must run before first
 * paint.
 *
 * Three states, not two. A reader is either following the system — the default,
 * with nothing stored — or has made an explicit choice. That distinction is the
 * whole reason `localStorage` is only written on click: it means a visitor who
 * has never touched the button keeps tracking their OS when it changes at
 * sunset, and a visitor who has chosen is never overridden by it.
 */

const STORE = 'theme';
const root = document.documentElement;
const systemDark = matchMedia('(prefers-color-scheme: dark)');

/* localStorage throws in some privacy modes; a theme toggle is not worth an
 * exception that kills every later line in the file. */
const stored = () => {
  try {
    const value = localStorage.getItem(STORE);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
};

const remember = (theme) => {
  try {
    localStorage.setItem(STORE, theme);
  } catch {
    /* Session-only. The toggle still works, it just will not persist. */
  }
};

/** What the reader is actually looking at right now. */
const active = () => stored() ?? (systemDark.matches ? 'dark' : 'light');

const buttons = () => document.querySelectorAll('[data-theme-toggle]');

const syncLabels = () => {
  const next = active() === 'dark' ? 'light' : 'dark';
  for (const button of buttons()) {
    button.setAttribute('aria-label', `Switch to ${next} theme`);
  }
};

for (const button of buttons()) {
  button.addEventListener('click', () => {
    const next = active() === 'dark' ? 'light' : 'dark';
    remember(next);
    // Setting the attribute is what actually repaints: every colour token is
    // defined against [data-theme] as well as the media query, so the explicit
    // choice wins in both directions.
    //
    // Transitions are switched off for the one frame of the flip. Otherwise every
    // element with its own colour or border transition (100–200ms) animates on
    // its own clock and the switch smears instead of snapping. A class rather
    // than an injected <style>: the CSP allows no inline styles.
    root.classList.add('theme-switching');
    root.dataset.theme = next;
    void root.offsetHeight;
    requestAnimationFrame(() => root.classList.remove('theme-switching'));
    syncLabels();
  });
}

// Only follow the system while the reader has expressed no preference.
systemDark.addEventListener('change', () => {
  if (!stored()) syncLabels();
});

syncLabels();
