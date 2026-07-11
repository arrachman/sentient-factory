/**
 * Pure DOM focus helper — move focus to the next focusable element after
 * `trigger`. Decoupled from React refs so it can be unit-tested in isolation.
 *
 * Extracted from use-search-select.ts (original L244-253) as part of the
 * inline/modal handler split. Behavior preserved 1:1.
 */
export function focusNextFrom(trigger: HTMLElement | null): void {
  if (!trigger) return;
  const focusable = Array.from(
    document.querySelectorAll<HTMLElement>(
      'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
  const idx = focusable.indexOf(trigger);
  if (idx !== -1) focusable[idx + 1]?.focus();
}