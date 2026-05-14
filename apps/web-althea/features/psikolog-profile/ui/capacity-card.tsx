'use client';

type CapacityItem = {
  label: string;
  value: string;
  note?: string;
};

export function CapacityCard({
  defaultSlots,
}: {
  defaultSlots: number;
}) {
  const items: CapacityItem[] = [
    { label: 'Maks sesi/hari', value: String(defaultSlots), note: 'BR-01' },
    { label: 'Booking dibuka', value: 'H-14' },
  ];

  return (
    <div
      style={{
        marginTop: 18,
        paddingTop: 18,
        borderTop: '1px solid var(--border)',
      }}
    >
      <span
        className="eyebrow"
        style={{ display: 'block', marginBottom: 8 }}
      >
        Pengaturan kapasitas
      </span>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12,
          marginTop: 10,
        }}
      >
        {items.map((it) => (
          <div
            key={it.label}
            className="card-althea-flat"
            style={{ padding: 12 }}
          >
            <span className="caption" style={{ fontSize: 11 }}>
              {it.label}
            </span>
            <div
              className="flex items-baseline"
              style={{ gap: 6, marginTop: 2 }}
            >
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: 'var(--teal-800)',
                  fontFamily: 'var(--font-serif)',
                }}
              >
                {it.value}
              </span>
              {it.note && (
                <span
                  className="badge"
                  style={{
                    background: 'var(--cream-200)',
                    color: 'var(--fg-muted)',
                    height: 14,
                    fontSize: 9,
                    padding: '0 5px',
                  }}
                >
                  {it.note}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <span
        className="caption"
        style={{ fontSize: 11, marginTop: 8, display: 'block' }}
      >
        Maks {defaultSlots} klien/hari sesuai BR-01 — admin yang atur via{' '}
        <span style={{ color: 'var(--sage-700)' }}>/admin/psikolog</span>. Anda
        pilih {defaultSlots} dari 10 slot tersedia di grid di atas.
      </span>
    </div>
  );
}
