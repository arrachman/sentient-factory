/**
 * Phone number normalization utilities (Indonesia-centric).
 *
 * Normalize berbagai format input (08xxx / 62xxx / +62xxx / spaces / dashes)
 * ke format konsisten untuk:
 *   - Storage di clinic_client.phone_wa
 *   - Send ke Fonnte (`62xxx`, tanpa `+`, tanpa leading 0)
 *   - Match webhook callback (`sender` di webhook = `62xxx`)
 *
 * Format target: `62xxxxxxxxxx` (numeric only, no `+`, no leading 0).
 * Fonnte API menerima format dengan/tanpa `+`, tapi webhook callback selalu
 * pakai `62xxx` (no `+`), jadi kita standardize ke format itu.
 */

/**
 * Normalize phone Indonesia ke format `62xxxxxxxxxx`.
 *
 * Examples:
 *   normalizePhoneId('085607550989')  → '6285607550989'
 *   normalizePhoneId('+6285607550989') → '6285607550989'
 *   normalizePhoneId('62 8560 7550 989') → '6285607550989'
 *   normalizePhoneId('856-0755-0989')   → '62856-... ' (invalid: starts with 8 not 08 or 62)
 *
 * Returns null kalau input tidak valid (kosong, terlalu pendek, bukan IDN).
 */
export function normalizePhoneId(input: string | null | undefined): string | null {
  if (!input) return null;

  // Strip semua non-digit kecuali leading +
  const cleaned = String(input).replace(/[^\d+]/g, '');

  // Strip leading +
  const noPlus = cleaned.startsWith('+') ? cleaned.slice(1) : cleaned;

  // Empty atau terlalu pendek
  if (noPlus.length < 8) return null;

  let normalized: string;
  if (noPlus.startsWith('62')) {
    normalized = noPlus;
  } else if (noPlus.startsWith('0')) {
    // 08xxx → 62xxx
    normalized = '62' + noPlus.slice(1);
  } else if (noPlus.startsWith('8')) {
    // 8xxx → 62xxx (user lupa prefix)
    normalized = '62' + noPlus;
  } else {
    // Bukan format IDN — return as-is (tanpa +) supaya foreign number juga lewat
    normalized = noPlus;
  }

  // Min length: 62 + 8-15 digits (Indonesian mobile: 62 8xx xxxx xxxx → 11-13 digits)
  if (normalized.length < 10 || normalized.length > 15) return null;

  return normalized;
}

/**
 * Format display untuk admin UI (e.g., "+62 856-0755-0989").
 * Internal storage tetap pakai normalizePhoneId format.
 */
export function formatPhoneDisplay(normalized: string | null | undefined): string {
  if (!normalized) return '—';
  const digits = normalized.replace(/\D/g, '');
  if (digits.startsWith('62') && digits.length >= 11) {
    const rest = digits.slice(2);
    // 856 0755 0989 → group 3-4-4
    if (rest.length === 11) {
      return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7)}`;
    }
    if (rest.length === 10) {
      return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 6)}-${rest.slice(6)}`;
    }
    return `+62 ${rest}`;
  }
  return normalized;
}
