/**
 * Arrow-key field navigation for forms.
 *
 * ArrowDown / ArrowUp move focus to the next / previous focusable field within
 * a container, mirroring Tab / Shift+Tab. Attach `arrowFieldNavKeyDown` to a
 * form section's `onKeyDown`; it only fires from single-line text-like inputs
 * where arrows are otherwise inert. Controls that own their arrow keys — number
 * steppers, radios, selects, textareas, and anything with an open popup
 * (`aria-expanded="true"`) — keep native behavior and are skipped as sources.
 */

const FOCUSABLE_SELECTOR = [
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/** Focusable descendants of `container`, in DOM (= tab) order. */
function focusableWithin(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    .filter((el) => el.tabIndex !== -1 && el.offsetParent !== null);
}

/** True when arrows are inert on `el`, so they may be repurposed for navigation. */
function isArrowNavSource(el: EventTarget | null): el is HTMLElement {
  if (!(el instanceof HTMLElement)) return false;
  if (el.getAttribute('aria-expanded') === 'true') return false; // open combobox/menu owns arrows
  const tag = el.tagName;
  if (tag === 'TEXTAREA' || tag === 'SELECT') return false;
  if (tag !== 'INPUT') return false;
  const type = (el as HTMLInputElement).type;
  // number/range step, radio moves within the group — leave those alone.
  return type !== 'number' && type !== 'range' && type !== 'radio';
}

/**
 * `onKeyDown` handler: ArrowDown/ArrowUp move focus to the next/previous field
 * within `e.currentTarget`. No wrap (matches Tab/Shift+Tab). Scope the handler
 * to a section that does NOT contain a control with its own arrow navigation
 * (e.g. a data grid) — attach it to the header container only.
 */
export function arrowFieldNavKeyDown(e: React.KeyboardEvent<HTMLElement>): void {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
  if (!isArrowNavSource(e.target)) return;

  const fields = focusableWithin(e.currentTarget);
  const idx = fields.indexOf(e.target);
  if (idx === -1) return;

  const next = fields[e.key === 'ArrowDown' ? idx + 1 : idx - 1];
  if (!next) return;

  e.preventDefault();
  next.focus();
  if (next instanceof HTMLInputElement && next.type !== 'checkbox') next.select?.();
}
