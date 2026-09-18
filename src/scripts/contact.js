/*
 * Copy-to-clipboard for the contact email (DSI-96).
 *
 * The button is created here rather than shipped in the markup: without
 * JavaScript there is no button at all, instead of a button that silently does
 * nothing. The mailto link beside it is the no-JS path and is always present.
 *
 * Classes are written as complete strings. Tailwind 4 scans source text for
 * whole class names, so a concatenated or interpolated class emits no CSS and
 * fails silently — the same rule that governs the span lookup on the homepage.
 */
const BUTTON_CLASS =
  'inline-flex min-h-11 items-center gap-2 rounded-control border border-border bg-surface px-4 text-fg-2 transition-[color,transform] duration-100 hover:text-accent active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';

const RESET_MS = 2000;

const wrap = document.querySelector('[data-contact]');
const link = wrap?.querySelector('[data-contact-email]');
const email = link?.dataset.contactEmail;

if (wrap && email && navigator.clipboard) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = BUTTON_CLASS;
  button.textContent = 'Copy';

  /*
   * The visible label changes on copy, which sighted users read. Screen
   * readers need to be told too, hence the live region — but it is polite and
   * separate from the button's own label, so the button does not re-announce
   * itself entirely on every press.
   */
  const status = document.createElement('span');
  status.className = 'sr-only';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  let timer;

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      button.textContent = 'Copied';
      status.textContent = `${email} copied to clipboard`;
    } catch {
      // Permission denied, or a non-secure context. Say so rather than
      // claiming success — the address is still selectable in the link.
      button.textContent = 'Copy failed';
      status.textContent = 'Copy failed. The address is in the link beside this button.';
    }

    clearTimeout(timer);
    timer = setTimeout(() => {
      button.textContent = 'Copy';
      status.textContent = '';
    }, RESET_MS);
  });

  wrap.append(button, status);
}
