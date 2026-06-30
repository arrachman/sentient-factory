'use client';

// Presentational helpers + constants for Setting → Tampilan (MDP).
// Ported from web-erp's appearance-parts; icons use lucide-react directly
// (MDP convention) and persistence keys are MDP-scoped.
import * as React from 'react';
import {
  Boxes,
  ChevronDown,
  Database,
  Home,
  Factory,
  Wrench,
  Layers,
  type LucideIcon,
} from 'lucide-react';
import type { Lang, Translator } from '@/lib/i18n';

export type { Lang, Translator };
export type FontScale = 'sm' | 'base' | 'lg' | 'xl';
export type Density = 'compact' | 'comfortable';
export type SidebarMode = 'icon' | 'label';
export type SidebarMenuMode = 'flyout' | 'accordion';

export const STORAGE_KEY = 'mdp-appearance';

export interface Tweaks {
  primary: string;
  density: Density;
  fontScale: FontScale;
  sidebar: SidebarMode;
  sidebarMenu: SidebarMenuMode;
  lang: Lang;
  urlRouting: boolean;
}

export const DEFAULTS: Tweaks = {
  primary: 'blue',
  density: 'compact',
  fontScale: 'base',
  sidebar: 'icon',
  sidebarMenu: 'flyout',
  lang: 'id',
  urlRouting: false,
};

export interface SegOption {
  v: string;
  label: string;
  icon?: LucideIcon;
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
          type="button"
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
            fontSize: 'calc(12px * var(--font-scale, 1))',
            cursor: 'pointer',
          }}
        >
          {o.icon && <o.icon size={12} />}
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
        <div style={{ fontSize: 'calc(12.5px * var(--font-scale, 1))' }}>{label}</div>
        {hint && (
          <div className="muted" style={{ fontSize: 'calc(11px * var(--font-scale, 1))', marginTop: 2 }}>
            {hint}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{children}</div>
    </div>
  );
}

export function SetCard({
  icon: Icon,
  title,
  sub,
  children,
}: {
  icon: LucideIcon;
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
          <Icon size={13} />
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

export const FONT_PX: Record<FontScale, number> = { sm: 11, base: 13, lg: 15, xl: 17 };

const PREVIEW_ITEMS = [
  { Icon: Home, lb: 'Beranda' },
  { Icon: Factory, lb: 'Produksi' },
  { Icon: Wrench, lb: 'Pemeliharaan' },
] as const;

/** Sidebar mode card — icon/label template + flyout/accordion submenu mode. */
export function SidebarModeCard({
  sidebar,
  sidebarMenu,
  onChange,
  onMenuMode,
  t,
}: {
  sidebar: SidebarMode;
  sidebarMenu: SidebarMenuMode;
  onChange: (v: SidebarMode) => void;
  onMenuMode: (v: SidebarMenuMode) => void;
  t: Translator;
}) {
  return (
    <SetCard icon={Database} title={t('Menu Sidebar')} sub={t('Template navigasi samping')}>
      <SetRow label={t('Template')} hint={t('Ikon saja atau dengan label teks')}>
        <Seg
          value={sidebar || 'icon'}
          onChange={(v) => onChange(v as SidebarMode)}
          options={[
            { v: 'icon', label: t('Ikon'), icon: Boxes },
            { v: 'label', label: t('Ikon + Label'), icon: Database },
          ]}
        />
      </SetRow>
      <SetRow
        label={t('Mode Menu')}
        hint={t('Flyout: submenu muncul di kanan saat hover · Accordion: submenu expand di bawah modul')}
      >
        <Seg
          value={sidebarMenu || 'flyout'}
          onChange={(v) => onMenuMode(v as SidebarMenuMode)}
          options={[
            { v: 'flyout', label: t('Flyout'), icon: Layers },
            { v: 'accordion', label: t('Accordion'), icon: ChevronDown },
          ]}
        />
      </SetRow>
      <SetRow label={t('Pratinjau')}>
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            gap: 3,
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: 8,
            background: 'var(--panel-2)',
            minWidth: sidebar === 'label' ? 170 : 'auto',
          }}
        >
          {PREVIEW_ITEMS.map(({ Icon, lb }, i) => (
            <React.Fragment key={lb}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 8px',
                  borderRadius: 6,
                  fontSize: 'calc(12px * var(--font-scale, 1))',
                  background: i === 0 ? 'var(--primary-soft)' : 'transparent',
                  color: i === 0 ? 'var(--primary-soft-fg)' : 'var(--fg-muted)',
                }}
              >
                <Icon size={14} />
                {sidebar === 'label' && <span style={{ flex: 1 }}>{t(lb)}</span>}
                {sidebar === 'label' && i === 0 && sidebarMenu === 'accordion' && <ChevronDown size={10} />}
              </span>
              {i === 0 && sidebarMenu === 'accordion' && (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '3px 8px 3px 28px',
                    fontSize: 'calc(11px * var(--font-scale, 1))',
                    color: 'var(--primary)',
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
                  {sidebar === 'label' && <span>{t('Sub Menu')}</span>}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </SetRow>
    </SetCard>
  );
}

/** URL routing toggle card — sync browser URL to active page route. */
export function UrlRoutingCard({
  urlRouting,
  onChange,
  t,
}: {
  urlRouting: boolean;
  onChange: (v: boolean) => void;
  t: Translator;
}) {
  return (
    <SetCard icon={Layers} title={t('URL Routing')} sub={t('Sinkronisasi URL browser dengan halaman aktif')}>
      <SetRow
        label={t('Mode')}
        hint={t('Per-halaman URL: URL browser ikut route aktif; Internal: navigasi tidak mengubah URL')}
      >
        <Seg
          value={urlRouting ? 'routing' : 'internal'}
          onChange={(v) => onChange(v === 'routing')}
          options={[
            { v: 'internal', label: t('Internal'), icon: Boxes },
            { v: 'routing', label: t('Per-halaman URL'), icon: Layers },
          ]}
        />
      </SetRow>
    </SetCard>
  );
}
