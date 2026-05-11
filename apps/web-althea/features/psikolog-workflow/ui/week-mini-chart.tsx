/**
 * Mini bar chart sesi minggu ini. Data Sen→Min dari backend
 * (TZ Asia/Jakarta, count booking status != cancelled).
 */
const WEEK_LABELS = ['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mg'];

export function WeekMiniChart({ weekData }: { weekData: number[] }) {
  const weekTotal = weekData.reduce((a, b) => a + b, 0);
  const max = Math.max(...weekData, 4);

  // Hari ini = posisi index hari sekarang dalam minggu (Sen=0..Min=6).
  // Compute di TZ klinik lokal browser supaya highlight sinkron dengan
  // backend yang juga Asia/Jakarta.
  const now = new Date();
  // getDay: 0=Min..6=Sab → konversi ke 0=Sen..6=Min
  const dow = now.getDay();
  const todayIdx = dow === 0 ? 6 : dow - 1;

  return (
    <div className="card-althea" style={{ padding: 20 }}>
      <h2
        style={{
          margin: '0 0 14px',
          fontFamily: 'var(--font-serif)',
          fontSize: 17,
          fontWeight: 500,
          color: 'var(--teal-800)',
        }}
      >
        Sesi minggu ini
      </h2>
      <div className="flex items-end" style={{ gap: 8, height: 100 }}>
        {weekData.map((v, i) => {
          const isToday = i === todayIdx;
          return (
            <div
              key={i}
              className="flex flex-col items-center"
              style={{ flex: 1, gap: 4 }}
            >
              <div
                title={`${WEEK_LABELS[i]}: ${v} sesi`}
                style={{
                  width: '100%',
                  height: max > 0 ? Math.max((v / max) * 80, v > 0 ? 6 : 0) : 0,
                  background: isToday
                    ? 'var(--sage-500)'
                    : 'var(--sage-200)',
                  borderRadius: 4,
                  transition: 'height 200ms ease',
                }}
              />
              <span
                className="caption"
                style={{
                  fontSize: 10,
                  fontWeight: isToday ? 700 : 400,
                  color: isToday ? 'var(--sage-700)' : undefined,
                }}
              >
                {WEEK_LABELS[i]}
              </span>
            </div>
          );
        })}
      </div>
      <div
        className="flex items-center justify-between"
        style={{ marginTop: 12 }}
      >
        <span className="caption">Total · {weekTotal} sesi</span>
        {weekTotal === 0 ? (
          <span className="caption" style={{ fontStyle: 'italic' }}>
            tidak ada sesi
          </span>
        ) : null}
      </div>
    </div>
  );
}
