/**
 * Reusable KPI card — label di kiri-atas + icon di kanan-atas (opsional),
 * value Lora 28px, sub-text di bawah.
 */
import type { LucideIcon } from 'lucide-react';

export type KpiTone = 'sage' | 'info' | 'rose' | 'amber';

const TONE_BG: Record<KpiTone, string> = {
  sage: 'var(--sage-100)',
  info: 'var(--info-soft)',
  rose: 'var(--rose-100)',
  amber: 'var(--amber-100)',
};

const TONE_FG: Record<KpiTone, string> = {
  sage: 'var(--sage-700)',
  info: 'var(--info)',
  rose: '#8b3d2a',
  amber: '#8a4a00',
};

export function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  tone = 'sage',
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: LucideIcon;
  tone?: KpiTone;
}) {
  return (
    <div className="card-althea" style={{ padding: 18 }}>
      <div className="flex items-start justify-between gap-2">
        <span className="caption" style={{ fontWeight: 500 }}>
          {label}
        </span>
        {Icon ? (
          <span
            aria-hidden
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              background: TONE_BG[tone],
              color: TONE_FG[tone],
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={16} strokeWidth={2.2} />
          </span>
        ) : null}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 28,
          fontWeight: 500,
          color: 'var(--teal-800)',
          marginTop: 6,
          lineHeight: 1.1,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
      {sub ? (
        <span
          className="caption"
          style={{
            marginTop: 6,
            color: 'var(--sage-700)',
            fontSize: 11,
            display: 'block',
            lineHeight: 1.4,
          }}
        >
          {sub}
        </span>
      ) : null}
    </div>
  );
}
