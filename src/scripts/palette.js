/*
 * Command palette behaviour (DSI-112). The markup, the item list and the ARIA
 * contract are described in CommandPalette.astro; this file filters, moves the
 * highlight and runs the chosen item.
 *
 * Focus never leaves the input. Arrow keys move `aria-activedescendant`, which
 * is how a screen reader follows the highlight in a combobox.
 */
const palette = document.querySelector('[data-palette]');
const input = palette?.querySelector('[data-palette-input]');

if (palette && input && 'showPopover' in palette) {
  const options = [...palette.querySelectorAll('[role="option"]')];
  const groups = [...palette.querySelectorAll('[data-palette-group]')];
  const empty = palette.querySelector('[data-palette-empty]');
  const { email } = palette.dataset;
  const isOpen = () => palette.matches(':popover-open');

  let visible = options;
  let active = 0;

  const highlight = (index) => {
    active = (index + visible.length) % Math.max(visible.length, 1);
    for (const option of options) option.setAttribute('aria-selected', 'false');
    const current = visible[active];
    if (current) {
      current.setAttribute('aria-selected', 'true');
      input.setAttribute('aria-activedescendant', current.id);
      current.scrollIntoView({ block: 'nearest' });
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  };

  const filter = () => {
    const words = input.value.toLowerCase().split(/\s+/).filter(Boolean);
    visible = options.filter((option) => {
      const match = words.every((word) => option.dataset.search.includes(word));
      option.hidden = !match;
      return match;
    });
    for (const group of groups) group.hidden = !group.querySelector('[role="option"]:not([hidden])');
    empty.hidden = visible.length > 0;
    highlight(0);
  };

  const run = async (option) => {
    if (!option) return;
    const { href, action } = option.dataset;

    if (action === 'theme') {
      // Reuse theme.js through its own button rather than re-implementing the
      // stored-preference rules here. click() works on the hidden mobile copy too.
      document.querySelector('[data-theme-toggle]')?.click();
      return;
    }

    if (action === 'copy') {
      const label = option.querySelector('[data-palette-label]');
      try {
        await navigator.clipboard.writeText(email);
        label.textContent = 'Email copied';
      } catch {
        label.textContent = 'Copy failed — use the Email item';
      }
      setTimeout(() => {
        palette.hidePopover();
        label.textContent = 'Copy email address';
      }, 700);
      return;
    }

    palette.hidePopover();
    location.href = href;
  };

  const open = () => {
    if (!isOpen()) palette.showPopover();
  };

  palette.addEventListener('toggle', (event) => {
    if (event.newState !== 'open') return;
    input.value = '';
    filter();
    input.focus();
  });

  input.addEventListener('input', filter);

  input.addEventListener('keydown', (event) => {
    const moves = { ArrowDown: active + 1, ArrowUp: active - 1, Home: 0, End: visible.length - 1 };
    if (event.key in moves) {
      event.preventDefault();
      highlight(moves[event.key]);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      run(visible[active]);
    }
  });

  const list = palette.querySelector('[role="listbox"]');
  list.addEventListener('click', (event) => run(event.target.closest('[role="option"]')));
  list.addEventListener('mousemove', (event) => {
    const index = visible.indexOf(event.target.closest('[role="option"]'));
    if (index !== -1 && index !== active) highlight(index);
  });

  const typing = (el) => el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (isOpen()) palette.hidePopover();
      else open();
    } else if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !typing(event.target)) {
      event.preventDefault();
      open();
    }
  });

  // The header trigger ships hidden; reveal it now the palette can work, and
  // show the shortcut the reader's platform actually uses.
  const mac = /Mac|iPhone|iPad/.test(navigator.platform);
  for (const trigger of document.querySelectorAll('[data-palette-trigger]')) {
    const key = trigger.querySelector('[data-palette-key]');
    if (key && mac) key.textContent = '⌘K';
    trigger.hidden = false;
  }
}
