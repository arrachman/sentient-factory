/**
 * Legend untuk grid Jadwal Saya — 4 status visual booking blocks.
 */
const ITEMS: Array<{
  color: string;
  border: string;
  borderStyle?: 'dashed';
  label: string;
}> = [
  { color: 'var(--sage-500)', border: 'var(--sage-500)', label: 'Berlangsung' },
  {
    color: 'var(--sage-100)',
    border: 'var(--sage-300)',
    label: 'Booked (akan datang)',
  },
  {
    color: 'var(--cream-200)',
    border: 'var(--border-strong)',
    label: 'Selesai',
  },
  {
    color: 'var(--bg-elev, #fff)',
    border: 'var(--sage-400)',
    borderStyle: 'dashed',
    label: 'Tersedia · belum ada klien',
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
              background: it.color,
              border: `${it.borderStyle === 'dashed' ? '1.5px dashed' : '1px solid'} ${it.border}`,
            }}
          />
          <span>{it.label}</span>
        </div>
      ))}
    </div>
  );
}
