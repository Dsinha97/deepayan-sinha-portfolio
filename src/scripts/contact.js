/*
 * Copy-to-clipboard for the contact email (DSI-96, reworked as an icon beside
 * the email in DSI-200).
 *
 * The button ships in the markup `hidden` and is revealed here only when the
 * Clipboard API exists: without JavaScript there is no button at all, instead
 * of a button that silently does nothing. The mailto link beside it is the
 * no-JS path and is always present.
 *
 * The three icons (copy, check, cross) share one grid cell and crossfade on
 * opacity, so the state change has a bridge rather than a hard cut.
 */
const RESET_MS = 2000;
const IDLE_LABEL = 'Copy email address';

const wrap = document.querySelector('[data-contact]');
const email = wrap?.querySelector('[data-contact-email]')?.dataset.contactEmail;
const button = wrap?.querySelector('[data-contact-copy]');
const status = wrap?.querySelector('[data-contact-status]');

if (email && button && status && navigator.clipboard) {
  const icons = button.querySelectorAll('[data-copy-icon]');
  let timer;

  // The tooltip follows the state for sighted users; the accessible name stays
  // fixed and the polite live region announces the outcome, so a screen reader
  // hears the result once rather than the button re-announcing itself.
  const show = (state, label) => {
    for (const icon of icons) icon.classList.toggle('opacity-0', icon.dataset.copyIcon !== state);
    button.title = label;
  };

  button.hidden = false;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      show('done', 'Copied');
      status.textContent = `${email} copied to clipboard`;
    } catch {
      // Permission denied, or a non-secure context. Say so rather than
      // claiming success — the address is still selectable in the link.
      show('failed', 'Copy failed');
      status.textContent = 'Copy failed. The address is in the link beside this button.';
    }

    clearTimeout(timer);
    timer = setTimeout(() => {
      show('idle', IDLE_LABEL);
      status.textContent = '';
    }, RESET_MS);
  });
}
