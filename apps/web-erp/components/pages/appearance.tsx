'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Icon } from '@/components/ui/icons';
import { makeTranslator, type Translator } from '@/lib/mock';
import { confirmAction, notify } from '@/lib/feedback';
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
  UrlRoutingCard,
  SidebarModeCard,
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
      urlRouting: stored.urlRouting ?? DEFAULTS.urlRouting,
    };
    setTw(baseline);

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
          urlRouting: meta.urlRouting ?? baseline.urlRouting,
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

  const twRef = React.useRef(tw);
  React.useEffect(() => {
    twRef.current = tw;
  }, [tw]);

  const applyTweak = React.useCallback(
    <K extends keyof Tweaks>(key: K, val: Tweaks[K]) => {
      const next = { ...twRef.current, [key]: val };
      twRef.current = next;
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
      if (key === 'lang')
        window.dispatchEvent(new CustomEvent('erp-set-lang', { detail: { lang: next.lang } }));
      if (key === 'urlRouting')
        window.dispatchEvent(new CustomEvent('erp-set-url-routing', { detail: { enabled: next.urlRouting } }));
      setTw(next);
    },
    [],
  );

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
          urlRouting: tw.urlRouting,
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
      // ignore
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
                        fontSize: 'calc(12px * var(--font-scale, 1))',
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
                    <span className="muted" style={{ fontSize: 'calc(10.5px * var(--font-scale, 1))' }}>
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

        <SidebarModeCard
          sidebar={tw.sidebar}
          onChange={(v) => applyTweak('sidebar', v)}
          t={t}
        />

        <UrlRoutingCard
          urlRouting={tw.urlRouting ?? false}
          onChange={(v) => {
            confirmAction({
              title: v
                ? t('Aktifkan Mode Per-halaman URL?')
                : t('Kembali ke Mode Internal?'),
              message: v
                ? t('Tab navigator akan dihapus — Anda hanya dapat membuka satu halaman dalam satu waktu. Semua tab yang terbuka sekarang akan ditutup dan navigasi direset ke halaman awal.')
                : t('Tab navigator akan ditampilkan kembali sehingga Anda bisa membuka banyak halaman. Semua tab yang terbuka sekarang akan ditutup dan navigasi direset ke halaman awal.'),
              variant: 'warn',
              icon: 'layers',
              confirmLabel: v ? t('Aktifkan Per-halaman URL') : t('Kembali ke Internal'),
              confirmIcon: 'layers',
              cancelLabel: t('Batal'),
              onConfirm: () => applyTweak('urlRouting', v),
            });
          }}
          t={t}
        />

        <LivePreviewCard t={t} />
      </div>

      <div className="pager">
        <span className="muted">{t('Setting · Tampilan')}</span>
        <div className="spacer" />
        <span className="muted">
          {t('Tema')} {theme} ·{' '}
          {t(SWATCHES.find((s) => s.v === tw.primary)?.label || tw.primary)} ·{' '}
          {t('Ukuran')} {fontScale} · {t(tw.density === 'compact' ? 'Compact' : 'Comfortable')} ·{' '}
          {t('Menu Sidebar')} {t((tw.sidebar || 'icon') === 'icon' ? 'Ikon' : 'Ikon + Label')} ·{' '}
          {t('URL')} {tw.urlRouting ? t('Per-halaman URL') : t('Internal')}
        </span>
      </div>
    </div>
  );
}
