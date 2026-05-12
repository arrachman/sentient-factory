/**
 * Stat card kecil di header halaman User & Role.
 */
export function UserStatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub: string;
}) {
  return (
    <div className="card-althea-flat" style={{ padding: 14 }}>
      <div className="caption" style={{ marginBottom: 6 }}>
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 26,
            fontWeight: 500,
            color: 'var(--teal-800)',
          }}
        >
          {value}
        </span>
        <span className="caption">{sub}</span>
      </div>
    </div>
  );
}
