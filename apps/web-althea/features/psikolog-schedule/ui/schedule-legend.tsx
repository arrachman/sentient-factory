/**
 * Legend untuk grid Jadwal Saya — 5 state visual cell.
 */
const ITEMS: Array<{
  color: string;
  border: string;
  borderStyle?: 'dashed';
  pattern?: boolean;
  label: string;
}> = [
  { color: 'var(--sage-500)', border: 'var(--sage-700)', label: 'Berlangsung' },
  {
    color: 'var(--sage-100)',
    border: 'var(--sage-300)',
    label: 'Booked (akan datang)',
  },
  {
    color: 'var(--cream-200)',
    border: 'var(--border-strong, #d4cfc1)',
    label: 'Selesai',
  },
  {
    color: 'transparent',
    border: '#9ebca3',
    borderStyle: 'dashed',
    label: 'Tersedia · siap di-booking',
  },
  {
    color: 'transparent',
    border: 'var(--border)',
    pattern: true,
    label: 'Libur / di luar jadwal',
  },
];

export function ScheduleLegend() {
  return (
    <div
      className="flex flex-wrap items-center"
      style={{
        gap: 16,
        padding: '0 4px 12px',
        fontSize: 11.5,
        color: 'var(--fg-muted)',
      }}
    >
      {ITEMS.map((it) => (
        <div key={it.label} className="flex items-center gap-1">
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              background: it.pattern
                ? 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 6px)'
                : it.color,
              border: `${it.borderStyle === 'dashed' ? '1.5px dashed' : '1px solid'} ${it.border}`,
            }}
          />
          <span>{it.label}</span>
        </div>
      ))}
    </div>
  );
}
