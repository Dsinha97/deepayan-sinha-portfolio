/*
 * Disclosure toggle (redesign): a button with `data-disclosure` and
 * `aria-controls` opens and closes the panel it names. Used by the homepage
 * Recognition tile.
 *
 * Progressive enhancement. Without JavaScript the panel is open and the button
 * is hidden (it would do nothing); motion.css only collapses a `.t-disclosure`
 * once the inline theme script has put `js` on <html>, so a scripted page
 * starts closed without a layout shift.
 */

for (const button of document.querySelectorAll('[data-disclosure]')) {
  const panel = document.getElementById(button.getAttribute('aria-controls') ?? '');
  if (!panel) continue;

  const label = button.querySelector('[data-disclosure-label]');
  const openText = button.dataset.openText;
  const closedText = button.dataset.closedText;

  const setOpen = (open) => {
    button.setAttribute('aria-expanded', String(open));
    panel.dataset.open = String(open);
    if (label && openText && closedText) label.textContent = open ? openText : closedText;
  };

  button.hidden = false;
  setOpen(false);
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    setOpen(open);
    if (open) panel.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
}
