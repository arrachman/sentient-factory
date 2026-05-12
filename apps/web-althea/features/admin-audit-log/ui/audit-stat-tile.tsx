/**
 * Stat tile dengan tonal background — base/warn/danger.
 * Dipakai 4 kali di header halaman audit log.
 */
const TONES = {
  base: { bg: 'var(--bg-elev)', fg: 'var(--teal-800)' },
  warn: { bg: '#fff8ee', fg: '#8a4a00' },
  danger: { bg: 'var(--danger-soft)', fg: 'var(--danger)' },
} as const;

export type StatTone = keyof typeof TONES;

export function AuditStatTile({
  lbl,
  val,
  sub,
  tone = 'base',
}: {
  lbl: string;
  val: string;
  sub?: string;
  tone?: StatTone;
}) {
  const t = TONES[tone];
  return (
    <div className="card-althea-flat" style={{ padding: 14, background: t.bg }}>
      <div className="caption" style={{ marginBottom: 6 }}>
        {lbl}
      </div>
      <div className="row gap-2" style={{ alignItems: 'baseline' }}>
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 26,
            fontWeight: 500,
            color: t.fg,
          }}
        >
          {val}
        </span>
        {sub ? <span className="caption">{sub}</span> : null}
      </div>
    </div>
  );
}
