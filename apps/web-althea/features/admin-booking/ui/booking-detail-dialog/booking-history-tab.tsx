/**
 * Tab "Riwayat" — list reschedule events untuk booking ini.
 */
export type RescheduleEvent = {
  from: { start: string; end: string; psikologUserId: number; roomId: number };
  to: { start: string; end: string; psikologUserId: number; roomId: number };
  reason?: string;
  at: string;
};

export function BookingHistoryTab({
  history,
}: {
  history: RescheduleEvent[];
}) {
  if (history.length === 0) {
    return (
      <div className="caption text-center py-8 text-fg-muted">
        Belum ada riwayat reschedule.
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {history.map((h, i) => (
        <div
          key={i}
          className="card-althea p-3 bg-cream-50 text-sm"
        >
          <div className="caption text-fg-muted mb-1">
            {new Date(h.at).toLocaleString('id-ID')}
          </div>
          <div>
            <span className="text-fg-muted">Dari:</span>{' '}
            {new Date(h.from.start).toLocaleString('id-ID', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
            {' → '}
            <span className="text-fg-muted">Ke:</span>{' '}
            {new Date(h.to.start).toLocaleString('id-ID', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
          {h.reason ? (
            <div className="caption mt-1">Alasan: {h.reason}</div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
