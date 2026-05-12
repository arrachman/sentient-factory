import type { TopService } from '../model/aggregate';
import { SVC_DOT } from '../model/constants';

/**
 * Card "Layanan terlaris bulan ini" — top 6 service by booking count.
 * Total katalog di footer untuk konteks.
 */
export function TopServicesCard({
  topServices,
  totalCatalogCount,
}: {
  topServices: TopService[];
  totalCatalogCount: number;
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
        Layanan terlaris bulan ini
      </h2>
      <div className="flex flex-col">
        {topServices.length === 0 ? (
          <span className="caption text-fg-muted">
            Belum ada sesi bulan ini — data akan muncul setelah ada booking.
          </span>
        ) : (
          topServices.map((s) => (
            <ServiceRow
              key={s.name}
              name={s.name}
              count={s.count}
              category={s.category}
            />
          ))
        )}
        <span
          className="caption"
          style={{ marginTop: 8, fontSize: 10.5 }}
        >
          Total katalog: {totalCatalogCount} layanan aktif
        </span>
      </div>
    </div>
  );
}

function ServiceRow({
  name,
  count,
  category,
}: {
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
      <div className="flex items-center gap-2">
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 2,
            background: SVC_DOT[category] ?? SVC_DOT.konseling,
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: 12.5, color: 'var(--fg)' }}>{name}</span>
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--teal-800)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {count}
      </span>
    </div>
  );
}
