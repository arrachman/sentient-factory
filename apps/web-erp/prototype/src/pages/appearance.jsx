// Setting → Tampilan : live theme/appearance template (color, font size, theme, layout).
// Writes through the App tweak bridge so changes apply instantly app-wide.
const setTweak = (key, val) => {
  window.dispatchEvent(new CustomEvent('app-set-tweak', { detail: { key, val } }));
};

const Seg = ({ value, options, onChange }) => (
  <div style={{ display: 'inline-flex', border: '1px solid var(--border)', borderRadius: 7, overflow: 'hidden' }}>
    {options.map((o, i) => (
      <button key={o.v} onClick={() => onChange(o.v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
          border: 0, borderLeft: i ? '1px solid var(--border)' : 0,
          background: value === o.v ? 'var(--primary)' : 'var(--panel)',
          color: value === o.v ? 'var(--primary-fg)' : 'var(--fg-muted)',
          font: 'inherit', fontSize: 12, cursor: 'pointer',
        }}>
        {o.icon && <Icon name={o.icon} size={12}/>}{o.label}
      </button>
    ))}
  </div>
);

const SWATCHES = [
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

const PALETTE_PACKS = [
  { v: 'blue', label: 'Korporat', sub: 'Biru profesional', colors: ['#2563eb', '#0891b2', '#0d9488'] },
  { v: 'violet', label: 'Kreatif', sub: 'Violet & fuchsia', colors: ['#7c3aed', '#c026d3', '#e11d48'] },
  { v: 'emerald', label: 'Natural', sub: 'Hijau segar', colors: ['#059669', '#0d9488', '#65a30d'] },
  { v: 'amber', label: 'Hangat', sub: 'Amber & rose', colors: ['#d97706', '#e11d48', '#c026d3'] },
];

const AppearancePage = ({ t, tw }) => {
  const cur = tw || {};
  const fontScale = cur.fontScale || 'base';

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Tampilan<span className="code-tag">UI</span></h1>
        <div className="page-actions">
          <button className="btn ghost" onClick={() => {
            setTweak('theme', 'light'); setTweak('primary', 'blue');
            setTweak('density', 'compact'); setTweak('fontScale', 'base'); setTweak('sidebar', 'icon');
            window.toast('Tampilan dikembalikan ke bawaan', { type: 'info' });
          }}><Icon name="refresh" size={12}/> {t('Reset')}</button>
          <button className="btn primary" onClick={() => window.toast('Preferensi tampilan disimpan', { type: 'success' })}>
            <Icon name="save" size={12}/> {t('Simpan')}
          </button>
        </div>
      </div>

      <div className="dash-grid scrollbar" style={{ overflow: 'auto', flex: 1, alignContent: 'start' }}>
        <SetCard icon="moon" title="Tema" sub="Mode terang atau gelap">
          <SetRow label="Mode Tema" hint="Berlaku untuk seluruh aplikasi">
            <Seg value={cur.theme} onChange={v => setTweak('theme', v)}
              options={[{ v: 'light', label: 'Terang', icon: 'sun' }, { v: 'dark', label: 'Gelap', icon: 'moon' }]}/>
          </SetRow>
          <SetRow label="Bahasa" hint="Antarmuka">
            <Seg value={cur.lang} onChange={v => setTweak('lang', v)}
              options={[{ v: 'id', label: 'Indonesia' }, { v: 'en', label: 'English' }]}/>
          </SetRow>
        </SetCard>

        <SetCard icon="layers" title="Warna Aksen" sub="Paket & warna primer">
          <SetRow label="Paket Warna" hint="Set warna siap pakai">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {PALETTE_PACKS.map(p => (
                <button key={p.v} onClick={() => setTweak('primary', p.v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px',
                    borderRadius: 8, cursor: 'pointer', font: 'inherit', textAlign: 'left',
                    background: cur.primary === p.v ? 'var(--primary-soft)' : 'var(--panel)',
                    border: cur.primary === p.v ? '1px solid var(--primary)' : '1px solid var(--border)',
                  }}>
                  <span style={{ display: 'flex' }}>
                    {p.colors.map((c, i) => (
                      <span key={i} style={{ width: 13, height: 13, borderRadius: '50%', background: c, marginLeft: i ? -5 : 0, boxShadow: '0 0 0 1.5px var(--panel)' }}/>
                    ))}
                  </span>
                  <span style={{ lineHeight: 1.2 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, display: 'block', color: cur.primary === p.v ? 'var(--primary-soft-fg)' : 'var(--fg)' }}>{p.label}</span>
                    <span className="muted" style={{ fontSize: 10.5 }}>{p.sub}</span>
                  </span>
                </button>
              ))}
            </div>
          </SetRow>
          <SetRow label="Warna Spesifik">
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {SWATCHES.map(s => (
                <button key={s.v} title={s.label} onClick={() => setTweak('primary', s.v)}
                  style={{
                    width: 30, height: 30, borderRadius: '50%', background: s.c, cursor: 'pointer',
                    border: cur.primary === s.v ? '2px solid var(--fg)' : '2px solid transparent',
                    boxShadow: '0 0 0 1px var(--border)', display: 'inline-flex',
                    alignItems: 'center', justifyContent: 'center', color: '#fff',
                  }}>
                  {cur.primary === s.v && <Icon name="check" size={13}/>}
                </button>
              ))}
            </div>
          </SetRow>
          <SetRow label="Aksen Aktif">
            <span className="pill primary"><span className="dot"></span>{SWATCHES.find(s => s.v === cur.primary)?.label || cur.primary}</span>
          </SetRow>
        </SetCard>

        <SetCard icon="info" title="Ukuran Font" sub="Skala teks antarmuka">
          <SetRow label="Ukuran" hint="Kecil · Normal · Besar · Ekstra Besar">
            <Seg value={fontScale} onChange={v => setTweak('fontScale', v)}
              options={[{ v: 'sm', label: 'Kecil' }, { v: 'base', label: 'Normal' }, { v: 'lg', label: 'Besar' }, { v: 'xl', label: 'Ekstra Besar' }]}/>
          </SetRow>
          <SetRow label="Pratinjau">
            <span style={{ fontSize: { sm: 11, base: 13, lg: 15, xl: 17 }[fontScale] || 13 }}>
              Contoh teks tabel & form — {fontScale}
            </span>
          </SetRow>
        </SetCard>

        <SetCard icon="boxes" title="Layout" sub="Kepadatan tampilan tabel & list">
          <SetRow label="Kepadatan" hint="Compact memuat lebih banyak baris">
            <Seg value={cur.density} onChange={v => setTweak('density', v)}
              options={[{ v: 'compact', label: 'Compact' }, { v: 'comfortable', label: 'Comfortable' }]}/>
          </SetRow>
        </SetCard>

        <SetCard icon="database" title="Menu Sidebar" sub="Template navigasi samping">
          <SetRow label="Template" hint="Ikon saja atau dengan label teks">
            <Seg value={cur.sidebar || 'icon'} onChange={v => setTweak('sidebar', v)}
              options={[{ v: 'icon', label: 'Ikon', icon: 'boxes' }, { v: 'label', label: 'Ikon + Label', icon: 'database' }]}/>
          </SetRow>
          <SetRow label="Pratinjau">
            <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 3, border: '1px solid var(--border)', borderRadius: 8, padding: 8, background: 'var(--panel-2)', minWidth: (cur.sidebar === 'label') ? 170 : 'auto' }}>
              {[['home', 'Dashboard'], ['coins', 'Keuangan'], ['cart', 'Pembelian']].map(([ic, lb], i) => (
                <span key={ic} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 6, fontSize: 12, background: i === 0 ? 'var(--primary-soft)' : 'transparent', color: i === 0 ? 'var(--primary-soft-fg)' : 'var(--fg-muted)' }}>
                  <Icon name={ic} size={14}/>{(cur.sidebar === 'label') && <span>{lb}</span>}
                </span>
              ))}
            </div>
          </SetRow>
        </SetCard>

        <div className="card" style={{ gridColumn: 'span 12' }}>
          <div className="card-h">
            <span style={{ display: 'inline-flex', width: 24, height: 24, alignItems: 'center', justifyContent: 'center', background: 'var(--primary-soft)', color: 'var(--primary-soft-fg)', borderRadius: 5 }}>
              <Icon name="eye" size={13}/>
            </span>
            <div><div className="title">Pratinjau Langsung</div><div className="sub" style={{ marginTop: 1 }}>Perubahan diterapkan seketika</div></div>
          </div>
          <div className="card-b" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 220px', border: '1px solid var(--border)', borderRadius: 8, padding: 14 }}>
              <div className="kpi" style={{ padding: 0 }}>
                <div className="label">Pendapatan bulan ini</div>
                <div className="value">Rp 487,5jt</div>
                <div className="delta up"><Icon name="arrow-tr" size={11}/> +12,4%</div>
                <div className="spark"><Spark data={window.KPI_SERIES.kasMasuk} color="var(--primary)"/></div>
              </div>
            </div>
            <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn primary"><Icon name="plus" size={12}/> Tambah</button>
                <button className="btn"><Icon name="download" size={12}/> Export</button>
                <button className="btn ghost">Batal</button>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span className="pill success"><span className="dot"></span>Approved</span>
                <span className="pill warn"><span className="dot"></span>Need Approve</span>
                <span className="pill primary"><span className="dot"></span>Posted</span>
              </div>
              <table className="tbl" style={{ border: '1px solid var(--border)', borderRadius: 8 }}>
                <thead><tr><th>No</th><th>Nama</th><th className="col-num">Total</th></tr></thead>
                <tbody>
                  <tr><td className="mono">CR-2605-2400</td><td>PT Sumber Rejeki</td><td className="num">4.250.000,00</td></tr>
                  <tr className="selected"><td className="mono">CR-2605-2399</td><td>CV Cahaya Abadi</td><td className="num">1.875.000,00</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="pager">
        <span className="muted">Setting · Tampilan</span>
        <div className="spacer"/>
        <span className="muted">Tema {cur.theme} · {SWATCHES.find(s => s.v === cur.primary)?.label || cur.primary} · font {fontScale} · {cur.density} · sidebar {cur.sidebar || 'icon'}</span>
      </div>
    </div>
  );
};

window.AppearancePage = AppearancePage;
