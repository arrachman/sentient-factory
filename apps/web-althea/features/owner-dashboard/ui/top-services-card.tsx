import { Sparkles } from 'lucide-react';
import type { TopService } from '../model/aggregate';
import { SVC_DOT } from '../model/constants';

/**
 * Card "Layanan terlaris bulan ini" — top 6 service by booking count.
 * Total katalog di footer untuk konteks.
 */
export function TopServicesCard({
  topServices,
  totalCatalogCount,
  periodLabel,
}: {
  topServices: TopService[];
  totalCatalogCount: number;
  periodLabel: string;
}) {
  return (
    <div className="card-althea" style={{ padding: 20 }}>
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: 14 }}
      >
        <div className="flex flex-col">
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-serif)',
              fontSize: 17,
              fontWeight: 500,
              color: 'var(--teal-800)',
            }}
          >
            Layanan terlaris · {periodLabel}
          </h2>
          <span className="caption" style={{ marginTop: 2 }}>
            Top {Math.min(topServices.length, 6)} dari {totalCatalogCount}{' '}
            layanan aktif
          </span>
        </div>
        <span
          aria-hidden
          style={{
            width: 28,
            height: 28,
            borderRadius: 999,
            background: 'var(--rose-100)',
            color: '#8b3d2a',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Sparkles size={14} strokeWidth={2.2} />
        </span>
      </div>
      <div className="flex flex-col">
        {topServices.length === 0 ? (
          <span className="caption text-fg-muted">
            Belum ada sesi di periode ini — data akan muncul setelah ada booking.
          </span>
        ) : (
          topServices.map((s, idx) => (
            <ServiceRow
              key={s.name}
              rank={idx + 1}
              name={s.name}
              count={s.count}
              category={s.category}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ServiceRow({
  rank,
  name,
  count,
  category,
}: {
  rank: number;
  name: string;
  count: number;
  category: string;
}) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: '8px 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            color: 'var(--fg-muted)',
            fontVariantNumeric: 'tabular-nums',
            width: 16,
            textAlign: 'right',
            flexShrink: 0,
          }}
        >
          {rank}.
        </span>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 2,
            background: SVC_DOT[category] ?? SVC_DOT.konseling,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 12.5,
            color: 'var(--fg)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={name}
        >
          {name}
        </span>
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--teal-800)',
          fontVariantNumeric: 'tabular-nums',
          flexShrink: 0,
          marginLeft: 12,
        }}
      >
        {count}
      </span>
    </div>
  );
}
