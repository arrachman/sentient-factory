/**
 * Card progres paket sesi (X dari Y) + bar + last session relative.
 */
export function ProgressCard({
  service,
  sessionN,
  sessionTotal,
  pct,
  lastSession,
  lastGap,
}: {
  service: string;
  sessionN: number;
  sessionTotal: number;
  pct: number;
  lastSession: string | null;
  lastGap: number | null;
}) {
  return (
    <div
      className="card-althea-flat"
      style={{ padding: 14, marginBottom: 12 }}
    >
      <div className="flex items-baseline justify-between">
        <span className="eyebrow">Progres paket</span>
        <span className="caption" style={{ fontSize: 10.5 }}>
          {service}
        </span>
      </div>
      <div
        className="flex items-baseline"
        style={{ marginTop: 8, gap: 6 }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: 'var(--teal-800)',
            fontFamily: 'var(--font-serif)',
          }}
        >
          {sessionN} dari {sessionTotal}
        </span>
        <span className="caption">sesi</span>
      </div>
      <div
        style={{
          height: 6,
          background: 'var(--cream-200)',
          borderRadius: 999,
          marginTop: 8,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: pct === 100 ? 'var(--cream-300)' : 'var(--sage-500)',
          }}
        />
      </div>
      {lastSession ? (
        <div
          className="flex items-center justify-between"
          style={{ marginTop: 8 }}
        >
          <span className="caption">Sesi terakhir</span>
          <span
            style={{
              fontSize: 11.5,
              color: 'var(--teal-800)',
              fontWeight: 500,
            }}
          >
            {lastSession}
            {lastGap && lastGap > 0 ? ` · ${lastGap} hari lalu` : ''}
          </span>
        </div>
      ) : null}
    </div>
  );
}
