// Dashboard
const Dashboard = ({ t, onNavigate }) => {
  const kpis = [
    { key: 'Pendapatan bulan ini', value: 487520000, delta: 12.4, series: KPI_SERIES.kasMasuk, color: 'var(--primary)' },
    { key: 'Pengeluaran bulan ini', value: 261840000, delta: -3.1, deltaInverse: true, series: KPI_SERIES.kasKeluar, color: 'var(--warn)' },
    { key: 'Saldo Bank', value: 1284910000, delta: 8.7, series: KPI_SERIES.bankMasuk, color: 'var(--success)' },
    { key: 'Giro Outstanding', value: 92450000, delta: 2.2, series: KPI_SERIES.giro, color: 'var(--info)' },
  ];

  // 14-day cash flow signed
  const flow = KPI_SERIES.kasMasuk.map((v, i) => (v - KPI_SERIES.kasKeluar[i]) * 100000);

  const topTrx = [
    { no: 'CR-2605-2398', desc: 'PT Sumber Rejeki', total: 4250000, kind: 'in' },
    { no: 'RM-2605-0871', desc: 'PT Karya Mandiri', total: 12500000, kind: 'in' },
    { no: 'SM-2605-1182', desc: 'PT Cahaya Listrik', total: -1850000, kind: 'out' },
    { no: 'CD-2605-1640', desc: 'Operasional cabang', total: -3200000, kind: 'out' },
    { no: 'CR-2605-2397', desc: 'Toko Berkah Jaya', total: 8750000, kind: 'in' },
    { no: 'GJ-2605-0412', desc: 'Penyesuaian akhir bulan', total: 0, kind: 'jnl' },
  ];

  const dist = [
    { v: 42, color: 'var(--primary)', label: t('Sales') },
    { v: 22, color: 'var(--success)', label: t('Pembelian') },
    { v: 18, color: 'var(--warn)', label: t('Persediaan') },
    { v: 10, color: 'var(--info)', label: t('Produksi') },
    { v: 8,  color: 'var(--fg-faint)', label: 'Lainnya' },
  ];

  return (
    <div className="page scrollbar" style={{overflow:'auto'}}>
      <div className="page-header">
        <h1 className="page-title">{t('Dashboard')}<span className="code-tag">12 Mei 2026 · PCI</span></h1>
        <div className="page-actions">
          <button className="btn"><Icon name="calendar" size={12}/> Bulan ini</button>
          <button className="btn"><Icon name="refresh" size={12}/> Refresh</button>
          <button className="btn primary"><Icon name="plus" size={12}/> {t('Tambah')} <Kbd>N</Kbd></button>
        </div>
      </div>

      <div className="dash-grid">
        {kpis.map((k, i) => (
          <div key={i} className="card" style={{ gridColumn: 'span 3' }}>
            <div className="kpi">
              <div className="label">{t(k.key)}</div>
              <div className="value">Rp {fmtCompact(k.value)}</div>
              <div className={`delta ${(k.deltaInverse ? -k.delta : k.delta) >= 0 ? 'up' : 'down'}`}>
                <Icon name={(k.deltaInverse ? -k.delta : k.delta) >= 0 ? 'arrow-tr' : 'arrow-br'} size={11}/>
                {k.delta > 0 ? '+' : ''}{k.delta.toFixed(1)}% <span className="muted" style={{marginLeft: 2}}>{t('vs bulan lalu')}</span>
              </div>
              <div className="spark"><Spark data={k.series} color={k.color}/></div>
            </div>
          </div>
        ))}

        {/* Cash flow */}
        <div className="card" style={{ gridColumn: 'span 8' }}>
          <div className="card-h">
            <div>
              <div className="title">{t('Cash Flow 14 Hari')}</div>
              <div className="sub" style={{ marginTop: 1 }}>Net = Masuk − Keluar (juta IDR)</div>
            </div>
            <div className="more" style={{ display: 'flex', gap: 6 }}>
              <div className="chip">14D</div>
              <div className="chip active"><span className="val">30D</span></div>
              <div className="chip">90D</div>
            </div>
          </div>
          <div className="card-b" style={{ color: 'var(--primary)' }}>
            <Bars data={flow.map(v => v/1e6)} color="var(--primary)" negColor="var(--danger)" height={140}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--fg-subtle)', marginTop: 4, fontFamily: 'Geist Mono, monospace' }}>
              {['29/04','01','03','05','07','09','12'].map(d => <span key={d}>{d}</span>)}
            </div>
          </div>
        </div>

        {/* Distribution */}
        <div className="card" style={{ gridColumn: 'span 4' }}>
          <div className="card-h">
            <div className="title">Komposisi Transaksi</div>
            <div className="sub" style={{marginLeft: 6}}>MTD</div>
          </div>
          <div className="card-b" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Donut slices={dist} size={108} stroke={16}/>
            <div style={{ flex: 1 }}>
              {dist.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, padding: '3px 0' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }}/>
                  <span style={{ flex: 1 }}>{s.label}</span>
                  <span className="mono muted" style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11.5 }}>{s.v}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="card" style={{ gridColumn: 'span 4' }}>
          <div className="card-h">
            <div className="title">{t('Aksi Cepat')}</div>
            <div className="sub" style={{ marginLeft: 'auto' }}>{t('Pintasan')}</div>
          </div>
          <div className="card-b" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <QuickAction icon="wallet" label={t('Buat Kas Masuk')} hint="N C" onClick={() => onNavigate('kas-masuk-new')}/>
            <QuickAction icon="wallet" label={t('Buat Kas Keluar')} hint="N D" onClick={() => onNavigate('kas-keluar')}/>
            <QuickAction icon="book" label={t('Posting Jurnal')} hint="N J" onClick={() => onNavigate('jurnal-umum')}/>
            <QuickAction icon="book" label={t('Lihat Buku Besar')} hint="G L" onClick={() => onNavigate('buku-besar')}/>
            <QuickAction icon="bank" label={t('Bank Masuk')} hint="N B" onClick={() => onNavigate('bank-masuk')}/>
            <QuickAction icon="receipt" label={t('Giro Masuk')} hint="N G" onClick={() => onNavigate('giro-masuk')}/>
          </div>
        </div>

        {/* Top transactions */}
        <div className="card" style={{ gridColumn: 'span 4' }}>
          <div className="card-h">
            <div className="title">{t('Top Transaksi Hari Ini')}</div>
            <button className="btn ghost sm" style={{ marginLeft: 'auto' }}>{t('Lihat semua')}</button>
          </div>
          <div>
            {topTrx.map((t2, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 10, padding: '8px 12px', borderTop: i === 0 ? 0 : '1px solid var(--border)', alignItems: 'center', fontSize: 12 }}>
                <span className={`pill ${t2.kind === 'in' ? 'success' : t2.kind === 'out' ? 'danger' : 'info'}`} style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10 }}>{t2.no.split('-')[0]}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t2.desc}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-subtle)', fontFamily: 'Geist Mono, monospace' }}>{t2.no}</div>
                </div>
                <div className={`mono ${t2.total === 0 ? 'muted' : (t2.total > 0 ? '' : '')}`} style={{ fontFamily: 'Geist Mono, monospace', fontVariantNumeric: 'tabular-nums', fontWeight: 500, color: t2.total > 0 ? 'var(--success)' : (t2.total < 0 ? 'var(--danger)' : 'var(--fg-muted)') }}>
                  {t2.total === 0 ? '—' : (t2.total > 0 ? '+' : '') + fmtIDR(t2.total)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="card" style={{ gridColumn: 'span 4' }}>
          <div className="card-h">
            <div className="title">{t('Aktivitas Terbaru')}</div>
            <button className="btn ghost sm" style={{ marginLeft: 'auto' }}><Icon name="filter" size={11}/> Filter</button>
          </div>
          <div className="activity-list">
            {ACTIVITY.slice(0, 7).map((a, i) => (
              <div key={i} className={`activity-row ${a.type}`}>
                <span className="dot"/>
                <div>
                  <span className="who">{a.who}</span> <span className="meta">{a.what}</span> <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11 }}>{a.target}</span>
                  {a.amount != null && (
                    <span className="mono" style={{ marginLeft: 6, fontFamily: 'Geist Mono, monospace', fontVariantNumeric: 'tabular-nums', color: a.amount > 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {a.amount > 0 ? '+' : ''}{fmtIDR(a.amount)}
                    </span>
                  )}
                </div>
                <span className="ts">{a.ts}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickAction = ({ icon, label, hint, onClick }) => (
  <button onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '9px 10px', background: 'var(--panel)',
    border: '1px solid var(--border)', borderRadius: 6,
    color: 'var(--fg)', cursor: 'pointer', textAlign: 'left',
    font: 'inherit', fontSize: 12,
  }}
  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--panel-hover)'}
  onMouseLeave={(e) => e.currentTarget.style.background = 'var(--panel)'}>
    <span style={{ display: 'inline-flex', width: 22, height: 22, alignItems: 'center', justifyContent: 'center', background: 'var(--primary-soft)', color: 'var(--primary-soft-fg)', borderRadius: 4 }}>
      <Icon name={icon} size={12}/>
    </span>
    <span style={{ flex: 1, fontSize: 11.5 }}>{label}</span>
    <span style={{ fontFamily: 'Geist Mono, monospace', color: 'var(--fg-subtle)', fontSize: 10.5 }}>{hint}</span>
  </button>
);

window.Dashboard = Dashboard;
