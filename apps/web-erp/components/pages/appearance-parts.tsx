'use client';

// Presentational helpers + constants for the Setting → Tampilan page.
// Split out of `appearance.tsx` to keep each file ≤400 lines.
import * as React from 'react';
import { Icon, type IconName } from '@/components/ui/icons';
import { Sparkline } from '@/components/ui/sparkline';
import { KPI_SERIES, type Translator } from '@/lib/mock';

export type Lang = 'id' | 'en' | 'ja';
export type FontScale = 'sm' | 'base' | 'lg' | 'xl';
export type Density = 'compact' | 'comfortable';
export type SidebarMode = 'icon' | 'label';

export const STORAGE_KEY = 'erp-appearance';

export interface Tweaks {
  primary: string;
  density: Density;
  fontScale: FontScale;
  sidebar: SidebarMode;
  lang: Lang;
}

export const DEFAULTS: Tweaks = {
  primary: 'blue',
  density: 'compact',
  fontScale: 'base',
  sidebar: 'icon',
  lang: 'id',
};

export interface SegOption {
  v: string;
  label: string;
  icon?: IconName;
}

export function Seg({
  value,
  options,
  onChange,
}: {
  value: string | undefined;
  options: SegOption[];
  onChange: (v: string) => void;
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        border: '1px solid var(--border)',
        borderRadius: 7,
        overflow: 'hidden',
      }}
    >
      {options.map((o, i) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            border: 0,
            borderLeft: i ? '1px solid var(--border)' : 0,
            background: value === o.v ? 'var(--primary)' : 'var(--panel)',
            color: value === o.v ? 'var(--primary-fg)' : 'var(--fg-muted)',
            font: 'inherit',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          {o.icon && <Icon name={o.icon} size={12} />}
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SetRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '200px 1fr',
        gap: 16,
        alignItems: 'center',
        padding: '10px 0',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div>
        <div style={{ fontSize: 12.5 }}>{label}</div>
        {hint && (
          <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
            {hint}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {children}
      </div>
    </div>
  );
}

export function SetCard({
  icon,
  title,
  sub,
  children,
}: {
  icon: IconName;
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card" style={{ gridColumn: 'span 6' }}>
      <div className="card-h">
        <span
          style={{
            display: 'inline-flex',
            width: 24,
            height: 24,
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--primary-soft)',
            color: 'var(--primary-soft-fg)',
            borderRadius: 5,
          }}
        >
          <Icon name={icon} size={13} />
        </span>
        <div>
          <div className="title">{title}</div>
          {sub && (
            <div className="sub" style={{ marginTop: 1 }}>
              {sub}
            </div>
          )}
        </div>
      </div>
      <div className="card-b" style={{ paddingTop: 2 }}>
        {children}
      </div>
    </div>
  );
}

export const SWATCHES = [
  { v: 'blue', c: '#2563eb', label: 'Biru' },
  { v: 'indigo', c: '#4f46e5', label: 'Indigo' },
  { v: 'violet', c: '#7c3aed', label: 'Violet' },
  { v: 'fuchsia', c: '#c026d3', label: 'Fuchsia' },
  { v: 'rose', c: '#e11d48', label: 'Rose' },
  { v: 'amber', c: '#d97706', label: 'Amber' },
  { v: 'emerald', c: '#059669', label: 'Emerald' },
  { v: 'teal', c: '#0d9488', label: 'Teal' },
  { v: 'cyan', c: '#0891b2', label: 'Cyan' },
];

export const PALETTE_PACKS = [
  { v: 'blue', label: 'Korporat', sub: 'Biru profesional', colors: ['#2563eb', '#0891b2', '#0d9488'] },
  { v: 'violet', label: 'Kreatif', sub: 'Violet & fuchsia', colors: ['#7c3aed', '#c026d3', '#e11d48'] },
  { v: 'emerald', label: 'Natural', sub: 'Hijau segar', colors: ['#059669', '#0d9488', '#65a30d'] },
  { v: 'amber', label: 'Hangat', sub: 'Amber & rose', colors: ['#d97706', '#e11d48', '#c026d3'] },
];

export const FONT_PX: Record<FontScale, number> = {
  sm: 11,
  base: 13,
  lg: 15,
  xl: 17,
};

/** Static "Pratinjau Langsung" card — reflects live tweaks via CSS vars. */
export function LivePreviewCard({ t }: { t: Translator }) {
  return (
    <div className="card" style={{ gridColumn: 'span 12' }}>
      <div className="card-h">
        <span
          style={{
            display: 'inline-flex',
            width: 24,
            height: 24,
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--primary-soft)',
            color: 'var(--primary-soft-fg)',
            borderRadius: 5,
          }}
        >
          <Icon name="eye" size={13} />
        </span>
        <div>
          <div className="title">{t('Pratinjau Langsung')}</div>
          <div className="sub" style={{ marginTop: 1 }}>
            {t('Perubahan diterapkan seketika')}
          </div>
        </div>
      </div>
      <div
        className="card-b"
        style={{
          display: 'flex',
          gap: 14,
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            flex: '1 1 220px',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: 14,
          }}
        >
          <div className="kpi" style={{ padding: 0 }}>
            <div className="label">{t('Pendapatan bulan ini')}</div>
            <div className="value">Rp 487,5jt</div>
            <div className="delta up">
              <Icon name="arrow-tr" size={11} /> +12,4%
            </div>
            <div className="spark">
              <Sparkline
                data={[...KPI_SERIES.kasMasuk]}
                color="var(--primary)"
              />
            </div>
          </div>
        </div>
        <div
          style={{
            flex: '1 1 240px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn primary">
              <Icon name="plus" size={12} /> {t('Tambah')}
            </button>
            <button className="btn">
              <Icon name="download" size={12} /> {t('Export')}
            </button>
            <button className="btn ghost">{t('Batal')}</button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="pill success">
              <span className="dot" />
              Approved
            </span>
            <span className="pill warn">
              <span className="dot" />
              Need Approve
            </span>
            <span className="pill primary">
              <span className="dot" />
              Posted
            </span>
          </div>
          <table
            className="tbl"
            style={{ border: '1px solid var(--border)', borderRadius: 8 }}
          >
            <thead>
              <tr>
                <th>{t('No')}</th>
                <th>{t('Nama')}</th>
                <th className="col-num">{t('Total')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">CR-2605-2400</td>
                <td>PT Sumber Rejeki</td>
                <td className="num">4.250.000,00</td>
              </tr>
              <tr className="selected">
                <td className="mono">CR-2605-2399</td>
                <td>CV Cahaya Abadi</td>
                <td className="num">1.875.000,00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
