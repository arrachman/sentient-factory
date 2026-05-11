/**
 * Legend untuk grid Jadwal Saya — 5 state visual cell.
 */
const ITEMS: Array<{
  color: string;
  border: string;
  borderStyle?: 'dashed';
  label: string;
}> = [
  { color: '#5b8a66', border: '#385a43', label: '● Berlangsung' },
  {
    color: '#cfdfd1',
    border: '#7aa382',
    label: '◷ Booked (akan datang)',
  },
  {
    color: '#ece6d3',
    border: '#c9bfa1',
    label: '✓ Selesai',
  },
  {
    color: '#e8f0e8',
    border: '#5b8a66',
    borderStyle: 'dashed',
    label: '+ Tersedia · siap di-booking',
  },
  {
    color: '#eeece6',
    border: '#d8d4c8',
    label: '— Libur / di luar jadwal',
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
        <div key={it.label} className="flex items-center gap-1.5">
          <span
            style={{
              width: 18,
              height: 14,
              borderRadius: 3,
              background: it.color,
              border: `${it.borderStyle === 'dashed' ? '1.5px dashed' : '1px solid'} ${it.border}`,
              flexShrink: 0,
            }}
          />
          <span>{it.label}</span>
        </div>
      ))}
    </div>
  );
}
