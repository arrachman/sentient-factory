/**
 * Stat card di dashboard psikolog. tone="warn" untuk reminder catatan tertunda.
 */
export function StatCard({
  label,
  value,
  hint,
  tone = 'normal',
}: {
  label: string;
  value: string | number;
  hint: string;
  tone?: 'normal' | 'warn';
}) {
  const isWarn = tone === 'warn';
  return (
    <div
      className="card-althea"
      style={{
        padding: 18,
        background: isWarn
          ? 'var(--warn-soft, #fbf3dc)'
          : 'var(--bg-elev, #fff)',
        borderColor: isWarn ? '#e5d5a8' : 'var(--border)',
      }}
    >
      <span className="caption">{label}</span>
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 32,
          fontWeight: 500,
          color: 'var(--teal-800)',
          lineHeight: 1.1,
          marginTop: 4,
        }}
      >
        {value}
      </div>
      <span
        className="caption"
        style={{
          marginTop: 4,
          color: isWarn ? '#7a5a1f' : 'var(--fg-muted)',
        }}
      >
        {hint}
      </span>
    </div>
  );
}
