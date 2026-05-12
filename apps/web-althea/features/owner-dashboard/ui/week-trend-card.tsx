import type { WeekDay } from '../model/aggregate';
import { formatDateLong } from '../model/format';

/**
 * Card "Sesi 7 hari terakhir" — bar chart sederhana.
 * Hari ini di-highlight dengan sage-500, hari lain sage-200.
 */
export function WeekTrendCard({
  weekTrend,
  weekTotal,
  weekMax,
}: {
  weekTrend: WeekDay[];
  weekTotal: number;
  weekMax: number;
}) {
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
        Sesi 7 hari terakhir
      </h2>
      <div
        className="flex"
        style={{ alignItems: 'flex-end', gap: 8, height: 120 }}
      >
        {weekTrend.map((d, i) => {
          const h = (d.count / weekMax) * 100;
          return (
            <div
              key={i}
              className="flex flex-col items-center"
              style={{ flex: 1, gap: 4 }}
            >
              <div
                style={{
                  width: '100%',
                  height: `${Math.max(h, 4)}%`,
                  background: d.isToday
                    ? 'var(--sage-500)'
                    : 'var(--sage-200)',
                  borderRadius: 4,
                }}
                title={`${d.label}: ${d.count} sesi`}
              />
              <span className="caption" style={{ fontSize: 10 }}>
                {d.label}
              </span>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: 'var(--teal-800)',
                }}
              >
                {d.count}
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
        <span
          className="caption"
          style={{ color: 'var(--sage-700)', fontWeight: 600 }}
        >
          {formatDateLong(new Date()).split(',')[0]}
        </span>
      </div>
    </div>
  );
}
