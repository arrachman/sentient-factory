/**
 * Reusable KPI card — label di atas, value Lora 28px, sub-text di bawah.
 */
export function KpiCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="card-althea" style={{ padding: 18 }}>
      <span className="caption">{label}</span>
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 28,
          fontWeight: 500,
          color: 'var(--teal-800)',
          marginTop: 4,
        }}
      >
        {value}
      </div>
      {sub ? (
        <span
          className="caption"
          style={{
            marginTop: 4,
            color: 'var(--sage-700)',
            fontSize: 11,
            display: 'block',
          }}
        >
          {sub}
        </span>
      ) : null}
    </div>
  );
}
