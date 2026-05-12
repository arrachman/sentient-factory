/**
 * Format helpers untuk booking detail dialog.
 */
export function rp(value: string | number): string {
  const n = typeof value === 'string' ? Number(value) : value;
  return 'Rp ' + n.toLocaleString('id-ID');
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: 'Menunggu DP',
  dp_paid: 'DP Lunas',
  lunas: 'Lunas',
  refunded: 'Refund',
};
