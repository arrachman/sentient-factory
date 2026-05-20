/**
 * Number & currency formatting helpers.
 * Single source of truth — import here, never use Intl.NumberFormat inline.
 */

const rupiahFmt = new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format a number as Rupiah (no Rp symbol — use in table cells).
 * e.g. 46666000 → "46.666.000,00"
 */
export function formatRupiah(value: number | null | undefined): string {
  if (value == null) return '—';
  return rupiahFmt.format(value);
}

/**
 * Format a number with thousands separator, no decimals.
 * e.g. 1500 → "1.500"
 */
export function formatQty(value: number | null | undefined): string {
  if (value == null) return '—';
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(value);
}
