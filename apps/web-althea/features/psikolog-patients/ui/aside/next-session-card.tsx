/**
 * Card sesi mendatang. Saat next === '—' tampilkan empty state, else action.
 */
export function NextSessionCard({
  next,
  room,
  sessionN,
  sessionTotal,
}: {
  next: string;
  room: string | null;
  sessionN: number;
  sessionTotal: number;
}) {
  return (
    <div
      className="card-althea-flat"
      style={{ padding: 12, marginBottom: 12 }}
    >
      <span className="eyebrow" style={{ display: 'block' }}>
        Sesi berikutnya
      </span>
      {next === '—' ? (
        <div className="flex flex-col" style={{ marginTop: 8 }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--fg-muted)',
            }}
          >
            Belum dijadwalkan
          </span>
          <span className="caption" style={{ marginTop: 2 }}>
            Hubungi admin untuk menjadwalkan sesi lanjutan
          </span>
        </div>
      ) : (
        <div
          className="flex items-center justify-between"
          style={{ marginTop: 8, gap: 8 }}
        >
          <div className="flex flex-col" style={{ minWidth: 0 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--teal-800)',
              }}
            >
              {next}
            </span>
            {room ? (
              <span className="caption" style={{ marginTop: 2 }}>
                📍 Ruangan {room}
                {sessionTotal > 1
                  ? ` · sesi ${sessionN}/${sessionTotal}`
                  : ''}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ height: 28, flexShrink: 0 }}
          >
            Request reschedule
          </button>
        </div>
      )}
    </div>
  );
}
