import { TrendingUp } from 'lucide-react';
import type { WeekDay } from '../model/aggregate';

/**
 * Card "Sesi 7 hari terakhir" — list vertikal per hari.
 * Tiap baris: hari + tanggal, jumlah sesi, bar relatif, badge konteks
 * (Hari ini / Tersibuk / Kosong / di atas/bawah rata-rata).
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
  const avg = weekTotal / Math.max(weekTrend.length, 1);
  const avgRounded = Math.round(avg * 10) / 10;
  const busiest = weekTrend.reduce(
    (acc, d) => (d.count > acc.count ? d : acc),
    weekTrend[0],
  );
  const zeroDays = weekTrend.filter((d) => d.count === 0).length;

  return (
    <div className="card-althea" style={{ padding: 20 }}>
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: 14 }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-serif)',
            fontSize: 17,
            fontWeight: 500,
            color: 'var(--teal-800)',
          }}
        >
          Sesi 7 hari terakhir
        </h2>
        <span
          aria-hidden
          style={{
            width: 28,
            height: 28,
            borderRadius: 999,
            background: 'var(--sage-100)',
            color: 'var(--sage-700)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <TrendingUp size={14} strokeWidth={2.2} />
        </span>
      </div>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {weekTrend.map((d) => (
          <WeekRow
            key={`${d.label}-${d.dateLabel}`}
            day={d}
            max={weekMax}
            avg={avg}
            isBusiest={d.count === busiest.count && d.count > 0}
          />
        ))}
      </ul>

      <div
        className="flex items-center justify-between"
        style={{ marginTop: 14, gap: 8, flexWrap: 'wrap' }}
      >
        <span className="caption">
          Total <strong style={{ color: 'var(--teal-800)' }}>{weekTotal}</strong>{' '}
          sesi · rata-rata <strong style={{ color: 'var(--teal-800)' }}>{avgRounded}</strong>{' '}
          sesi/hari
        </span>
        {zeroDays > 0 && (
          <span
            className="caption"
            style={{ color: 'var(--rose-600, #b05a40)', fontWeight: 600 }}
          >
            {zeroDays} hari tanpa sesi
          </span>
        )}
      </div>
    </div>
  );
}

function WeekRow({
  day,
  max,
  avg,
  isBusiest,
}: {
  day: WeekDay;
  max: number;
  avg: number;
  isBusiest: boolean;
}) {
  const pct = (day.count / Math.max(max, 1)) * 100;
  const above = day.count > avg && day.count > 0;
  const below = day.count < avg && day.count > 0;

  const badge = day.isToday
    ? { text: 'Hari ini', bg: 'var(--sage-500)', fg: '#fff' }
    : isBusiest
      ? { text: 'Tersibuk', bg: 'var(--sage-100)', fg: 'var(--sage-700)' }
      : day.count === 0
        ? { text: 'Kosong', bg: 'var(--cream-100)', fg: 'var(--fg-muted)' }
        : null;

  return (
    <li
      style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr 56px 88px',
        alignItems: 'center',
        gap: 12,
        padding: '10px 0',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="flex flex-col" style={{ gap: 2 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: day.isToday ? 700 : 600,
            color: day.isToday ? 'var(--sage-700)' : 'var(--teal-800)',
          }}
        >
          {day.label}
        </span>
        <span className="caption" style={{ fontSize: 11 }}>
          {day.dateLabel}
        </span>
      </div>

      <div
        style={{
          height: 8,
          background: 'var(--cream-100)',
          borderRadius: 999,
          overflow: 'hidden',
        }}
        aria-hidden
      >
        <div
          style={{
            width: `${Math.max(pct, day.count > 0 ? 4 : 0)}%`,
            height: '100%',
            background: day.isToday
              ? 'var(--sage-500)'
              : 'var(--sage-300, #a8c4ad)',
            transition: 'width 200ms ease',
          }}
        />
      </div>

      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: day.isToday ? 'var(--sage-700)' : 'var(--teal-800)',
          fontVariantNumeric: 'tabular-nums',
          textAlign: 'right',
        }}
      >
        {day.count}
        <span
          className="caption"
          style={{ fontSize: 10, fontWeight: 400, marginLeft: 4 }}
        >
          sesi
        </span>
      </span>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {badge ? (
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 999,
              background: badge.bg,
              color: badge.fg,
              whiteSpace: 'nowrap',
            }}
          >
            {badge.text}
          </span>
        ) : (
          <span
            className="caption"
            style={{
              fontSize: 10.5,
              color: above ? 'var(--sage-700)' : 'var(--fg-muted)',
              fontWeight: above ? 600 : 400,
              whiteSpace: 'nowrap',
            }}
          >
            {above ? '↑ di atas rata-rata' : below ? '↓ di bawah' : '—'}
          </span>
        )}
      </div>
    </li>
  );
}
