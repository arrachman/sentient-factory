'use client';

// Setting → Tampilan : live theme/appearance template (color, font size, theme, layout).
// Self-contained: theme via next-themes; other knobs mirror the app-shell's
// document.documentElement data-* attributes + persist to localStorage.
import * as React from 'react';
import { useTheme } from 'next-themes';
import { Icon } from '@/components/ui/icons';
import { makeTranslator, type Translator } from '@/lib/mock';
import { notify } from '@/lib/feedback';
import {
  getMyPreferences,
  updateMyPreferences,
  ErpApiError,
} from '@/lib/api';
import {
  DEFAULTS,
  FONT_PX,
  LivePreviewCard,
  PALETTE_PACKS,
  Seg,
  SetCard,
  SetRow,
  STORAGE_KEY,
  SWATCHES,
  type Density,
  type FontScale,
  type Lang,
  type SidebarMode,
  type Tweaks,
} from './appearance-parts';

interface AppearancePageProps {
  // Accepted for shell-route-renderer parity; this page derives its own
  // translator from tw.lang so language switch updates UI instantly.
  t?: Translator;
}

/** Setting → Tampilan — ported from prototype `pages/appearance.jsx`. */
export function AppearancePage(_props: AppearancePageProps) {
  const { theme, setTheme } = useTheme();
  const [tw, setTw] = React.useState<Tweaks>(DEFAULTS);
  const t = React.useMemo(() => makeTranslator(tw.lang), [tw.lang]);
  const hydratedRef = React.useRef(false);
  const saveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Apply tweaks to DOM data-attributes (without touching state).
  const applyToDom = React.useCallback((next: Tweaks) => {
    const el = document.documentElement;
    el.setAttribute('data-primary', next.primary);
    el.setAttribute('data-density', next.density);
    el.setAttribute('data-fontscale', next.fontScale);
    el.setAttribute('data-sidebar', next.sidebar);
  }, []);

  // Sync local state from the DOM / localStorage / API after mount.
  // Order: API (server SSOT) > localStorage > DOM attr > DEFAULTS.
  React.useEffect(() => {
    const el = document.documentElement;
    let stored: Partial<Tweaks> = {};
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) stored = JSON.parse(raw) as Partial<Tweaks>;
    } catch {
      stored = {};
    }
    const baseline: Tweaks = {
      primary:
        stored.primary ?? el.getAttribute('data-primary') ?? DEFAULTS.primary,
      density:
        (stored.density as Density) ??
        (el.getAttribute('data-density') as Density) ??
        DEFAULTS.density,
      fontScale:
        (stored.fontScale as FontScale) ??
        (el.getAttribute('data-fontscale') as FontScale) ??
        DEFAULTS.fontScale,
      sidebar:
        (stored.sidebar as SidebarMode) ??
        (el.getAttribute('data-sidebar') as SidebarMode) ??
        DEFAULTS.sidebar,
      lang: (stored.lang as Lang) ?? DEFAULTS.lang,
    };
    setTw(baseline);

    // Server SSOT — overrides local if available.
    let cancelled = false;
    getMyPreferences()
      .then((prefs) => {
        if (cancelled || !prefs) {
          hydratedRef.current = true;
          return;
        }
        const meta = (prefs.metadata ?? {}) as Partial<Tweaks>;
        const merged: Tweaks = {
          primary: meta.primary ?? baseline.primary,
          density: (meta.density as Density) ?? baseline.density,
          fontScale: (meta.fontScale as FontScale) ?? baseline.fontScale,
          sidebar: (meta.sidebar as SidebarMode) ?? baseline.sidebar,
          lang: (prefs.language as Lang) ?? baseline.lang,
        };
        setTw(merged);
        applyToDom(merged);
        if (prefs.theme) setTheme(prefs.theme);
        hydratedRef.current = true;
      })
      .catch(() => {
        hydratedRef.current = true;
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyTweak = React.useCallback(
    <K extends keyof Tweaks>(key: K, val: Tweaks[K]) => {
      setTw((prev) => {
        const next = { ...prev, [key]: val };
        const el = document.documentElement;
        el.setAttribute('data-primary', next.primary);
        el.setAttribute('data-density', next.density);
        el.setAttribute('data-fontscale', next.fontScale);
        el.setAttribute('data-sidebar', next.sidebar);
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* localStorage unavailable — ignore */
        }
        return next;
      });
    },
    [],
  );

  // Auto-save (debounced) — kirim PUT ke server setiap kali tw/theme berubah
  // setelah hidrasi awal selesai. localStorage + DOM sudah di-update sinkron
  // di applyTweak/setTheme; server SSOT menyusul lewat debounce.
  React.useEffect(() => {
    if (!hydratedRef.current) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      updateMyPreferences({
        theme: theme ?? 'light',
        language: tw.lang,
        metadata: {
          primary: tw.primary,
          density: tw.density,
          fontScale: tw.fontScale,
          sidebar: tw.sidebar,
        },
      }).catch((err) => {
        const msg =
          err instanceof ErpApiError
            ? err.message
            : t('Gagal menyimpan preferensi tampilan');
        notify(msg, 'danger');
      });
    }, 500);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [theme, tw]);

  const resetAll = React.useCallback(() => {
    setTheme('light');
    setTw(DEFAULTS);
    const el = document.documentElement;
    el.setAttribute('data-primary', DEFAULTS.primary);
    el.setAttribute('data-density', DEFAULTS.density);
    el.setAttribute('data-fontscale', DEFAULTS.fontScale);
    el.setAttribute('data-sidebar', DEFAULTS.sidebar);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULTS));
    } catch {
      /* localStorage unavailable — ignore */
    }
    notify(t('Tampilan dikembalikan ke bawaan'), 'info');
  }, [setTheme, t]);

  const fontScale = tw.fontScale || 'base';

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">
          {t('Tampilan')}<span className="code-tag">UI</span>
        </h1>
        <div className="page-actions">
          <button className="btn ghost" onClick={resetAll}>
            <Icon name="refresh" size={12} /> {t('Reset')}
          </button>
        </div>
      </div>

      <div
        className="dash-grid scrollbar"
        style={{ overflow: 'auto', flex: 1, alignContent: 'start' }}
      >
        <SetCard icon="moon" title={t('Tema')} sub={t('Mode terang atau gelap')}>
          <SetRow label={t('Mode Tema')} hint={t('Berlaku untuk seluruh aplikasi')}>
            <Seg
              value={theme}
              onChange={(v) => setTheme(v)}
              options={[
                { v: 'light', label: t('Terang'), icon: 'sun' },
                { v: 'dark', label: t('Gelap'), icon: 'moon' },
              ]}
            />
          </SetRow>
          <SetRow label={t('Bahasa')} hint={t('Antarmuka')}>
            <Seg
              value={tw.lang}
              onChange={(v) => applyTweak('lang', v as Lang)}
              options={[
                { v: 'id', label: t('Indonesia') },
                { v: 'en', label: t('English') },
                { v: 'ja', label: t('Japanese') },
              ]}
            />
          </SetRow>
        </SetCard>

        <SetCard icon="layers" title={t('Warna Aksen')} sub={t('Paket & warna primer')}>
          <SetRow label={t('Paket Warna')} hint={t('Set warna siap pakai')}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {PALETTE_PACKS.map((p) => (
                <button
                  key={p.v}
                  onClick={() => applyTweak('primary', p.v)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '7px 10px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    font: 'inherit',
                    textAlign: 'left',
                    background:
                      tw.primary === p.v
                        ? 'var(--primary-soft)'
                        : 'var(--panel)',
                    border:
                      tw.primary === p.v
                        ? '1px solid var(--primary)'
                        : '1px solid var(--border)',
                  }}
                >
                  <span style={{ display: 'flex' }}>
                    {p.colors.map((c, i) => (
                      <span
                        key={i}
                        style={{
                          width: 13,
                          height: 13,
                          borderRadius: '50%',
                          background: c,
                          marginLeft: i ? -5 : 0,
                          boxShadow: '0 0 0 1.5px var(--panel)',
                        }}
                      />
                    ))}
                  </span>
                  <span style={{ lineHeight: 1.2 }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        display: 'block',
                        color:
                          tw.primary === p.v
                            ? 'var(--primary-soft-fg)'
                            : 'var(--fg)',
                      }}
                    >
                      {t(p.label)}
                    </span>
                    <span className="muted" style={{ fontSize: 10.5 }}>
                      {t(p.sub)}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </SetRow>
          <SetRow label={t('Warna Spesifik')}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {SWATCHES.map((s) => (
                <button
                  key={s.v}
                  title={s.label}
                  onClick={() => applyTweak('primary', s.v)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: s.c,
                    cursor: 'pointer',
                    border:
                      tw.primary === s.v
                        ? '2px solid var(--fg)'
                        : '2px solid transparent',
                    boxShadow: '0 0 0 1px var(--border)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  {tw.primary === s.v && <Icon name="check" size={13} />}
                </button>
              ))}
            </div>
          </SetRow>
          <SetRow label={t('Aksen Aktif')}>
            <span className="pill primary">
              <span className="dot" />
              {t(SWATCHES.find((s) => s.v === tw.primary)?.label || tw.primary)}
            </span>
          </SetRow>
        </SetCard>

        <SetCard icon="info" title={t('Ukuran Font')} sub={t('Skala teks antarmuka')}>
          <SetRow label={t('Ukuran')} hint={t('Kecil · Normal · Besar · Ekstra Besar')}>
            <Seg
              value={fontScale}
              onChange={(v) => applyTweak('fontScale', v as FontScale)}
              options={[
                { v: 'sm', label: t('Kecil') },
                { v: 'base', label: t('Normal') },
                { v: 'lg', label: t('Besar') },
                { v: 'xl', label: t('Ekstra Besar') },
              ]}
            />
          </SetRow>
          <SetRow label={t('Pratinjau')}>
            <span style={{ fontSize: FONT_PX[fontScale] || 13 }}>
              {t('Contoh teks tabel & form')} — {fontScale}
            </span>
          </SetRow>
        </SetCard>

        <SetCard
          icon="boxes"
          title={t('Layout')}
          sub={t('Kepadatan tampilan tabel & list')}
        >
          <SetRow
            label={t('Kepadatan')}
            hint={t('Compact memuat lebih banyak baris')}
          >
            <Seg
              value={tw.density}
              onChange={(v) => applyTweak('density', v as Density)}
              options={[
                { v: 'compact', label: t('Compact') },
                { v: 'comfortable', label: t('Comfortable') },
              ]}
            />
          </SetRow>
        </SetCard>

        <SetCard
          icon="database"
          title={t('Menu Sidebar')}
          sub={t('Template navigasi samping')}
        >
          <SetRow label={t('Template')} hint={t('Ikon saja atau dengan label teks')}>
            <Seg
              value={tw.sidebar || 'icon'}
              onChange={(v) => applyTweak('sidebar', v as SidebarMode)}
              options={[
                { v: 'icon', label: t('Ikon'), icon: 'boxes' },
                { v: 'label', label: t('Ikon + Label'), icon: 'database' },
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
                minWidth: tw.sidebar === 'label' ? 170 : 'auto',
              }}
            >
              {(
                [
                  ['home', 'Dashboard'],
                  ['coins', 'Keuangan'],
                  ['cart', 'Pembelian'],
                ] as const
              ).map(([ic, lb], i) => (
                <span
                  key={ic}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '5px 8px',
                    borderRadius: 6,
                    fontSize: 12,
                    background:
                      i === 0 ? 'var(--primary-soft)' : 'transparent',
                    color:
                      i === 0
                        ? 'var(--primary-soft-fg)'
                        : 'var(--fg-muted)',
                  }}
                >
                  <Icon name={ic} size={14} />
                  {tw.sidebar === 'label' && <span>{lb}</span>}
                </span>
              ))}
            </div>
          </SetRow>
        </SetCard>

        <LivePreviewCard t={t} />
      </div>

      <div className="pager">
        <span className="muted">{t('Setting · Tampilan')}</span>
        <div className="spacer" />
        <span className="muted">
          {t('Tema')} {theme} ·{' '}
          {t(SWATCHES.find((s) => s.v === tw.primary)?.label || tw.primary)} ·{' '}
          {t('Ukuran')} {fontScale} · {t(tw.density === 'compact' ? 'Compact' : 'Comfortable')} ·{' '}
          {t('Menu Sidebar')} {t((tw.sidebar || 'icon') === 'icon' ? 'Ikon' : 'Ikon + Label')}
        </span>
      </div>
    </div>
  );
}
