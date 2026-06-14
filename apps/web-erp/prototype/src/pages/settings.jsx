// Setting → Preferensi : application preferences form
const Toggle = ({ on, onChange }) => (
  <button type="button" onClick={() => onChange(!on)}
    style={{
      width: 34, height: 20, borderRadius: 10, border: '1px solid var(--border)',
      background: on ? 'var(--primary)' : 'var(--panel-2)', position: 'relative',
      cursor: 'pointer', padding: 0, transition: 'background 120ms', flexShrink: 0,
    }}>
    <span style={{
      position: 'absolute', top: 1, left: on ? 15 : 1, width: 16, height: 16,
      borderRadius: '50%', background: '#fff', transition: 'left 120ms',
      boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
    }}/>
  </button>
);

const SetRow = ({ label, hint, children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16, alignItems: 'center', padding: '10px 0', borderTop: '1px solid var(--border)' }}>
    <div>
      <div style={{ fontSize: 12.5 }}>{label}</div>
      {hint && <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{hint}</div>}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{children}</div>
  </div>
);

const SetCard = ({ icon, title, sub, children }) => (
  <div className="card" style={{ gridColumn: 'span 6' }}>
    <div className="card-h">
      <span style={{ display: 'inline-flex', width: 24, height: 24, alignItems: 'center', justifyContent: 'center', background: 'var(--primary-soft)', color: 'var(--primary-soft-fg)', borderRadius: 5 }}>
        <Icon name={icon} size={13}/>
      </span>
      <div>
        <div className="title">{title}</div>
        {sub && <div className="sub" style={{ marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
    <div className="card-b" style={{ paddingTop: 2 }}>{children}</div>
  </div>
);

const inputStyle = {
  height: 28, padding: '0 8px', background: 'var(--panel)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius)', color: 'var(--fg)', font: 'inherit', fontSize: 12.5, outline: 'none', minWidth: 200,
};

const SettingsPage = ({ t }) => {
  const [s, setS] = React.useState({
    company: 'PT Sentient Manufaktur Indonesia', branch: 'PCI', lang: 'Indonesia', tz: '(GMT+7) Jakarta',
    dateFmt: 'DD/MM/YYYY', fyStart: 'Januari', invMethod: 'FIFO', baseCur: 'IDR', rounding: '0 desimal',
    prefCR: 'CR', prefCD: 'CD', prefPO: 'PO', prefSI: 'SI',
    notifApprove: true, notifPost: true, notifLowStock: true, notifEmail: false, autoBackup: true,
  });
  const set = (k) => (e) => setS({ ...s, [k]: e.target ? e.target.value : e });
  const Sel = ({ k, opts }) => <select style={inputStyle} value={s[k]} onChange={set(k)}>{opts.map(o => <option key={o}>{o}</option>)}</select>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{t('Preferensi')}<span className="code-tag">PR</span></h1>
        <div className="page-actions">
          <button className="btn ghost"><Icon name="refresh" size={12}/> {t('Reset')}</button>
          <button className="btn primary"><Icon name="save" size={12}/> {t('Simpan')} <Kbd>⌘S</Kbd></button>
        </div>
      </div>

      <div className="dash-grid scrollbar" style={{ overflow: 'auto', flex: 1, alignContent: 'start' }}>
        <SetCard icon="info" title="Umum" sub="Identitas & lokal">
          <SetRow label="Nama Perusahaan">
            <input style={{ ...inputStyle, minWidth: 320 }} value={s.company} onChange={set('company')}/>
          </SetRow>
          <SetRow label="Cabang Default"><Sel k="branch" opts={window.CABANGS}/></SetRow>
          <SetRow label="Bahasa"><Sel k="lang" opts={['Indonesia', 'English']}/></SetRow>
          <SetRow label="Zona Waktu"><Sel k="tz" opts={['(GMT+7) Jakarta', '(GMT+8) Makassar', '(GMT+9) Jayapura']}/></SetRow>
          <SetRow label="Format Tanggal"><Sel k="dateFmt" opts={['DD/MM/YYYY', 'YYYY-MM-DD', 'DD MMM YYYY']}/></SetRow>
        </SetCard>

        <SetCard icon="coins" title="Akuntansi" sub="Kebijakan pembukuan">
          <SetRow label="Awal Tahun Buku"><Sel k="fyStart" opts={['Januari', 'April', 'Juli', 'Oktober']}/></SetRow>
          <SetRow label="Metode Persediaan" hint="Berlaku untuk valuasi HPP"><Sel k="invMethod" opts={['FIFO', 'Average', 'LIFO']}/></SetRow>
          <SetRow label="Mata Uang Dasar"><Sel k="baseCur" opts={['IDR', 'USD', 'SGD']}/></SetRow>
          <SetRow label="Pembulatan Nilai"><Sel k="rounding" opts={['0 desimal', '2 desimal', 'Bulat ribuan']}/></SetRow>
        </SetCard>

        <SetCard icon="receipt" title="Penomoran Dokumen" sub="Prefix nomor transaksi">
          <SetRow label="Kas Masuk"><input style={inputStyle} value={s.prefCR} onChange={set('prefCR')}/><span className="muted" style={{ fontSize: 11.5, fontFamily: 'Geist Mono, monospace' }}>→ {s.prefCR}-2605-2400</span></SetRow>
          <SetRow label="Kas Keluar"><input style={inputStyle} value={s.prefCD} onChange={set('prefCD')}/><span className="muted" style={{ fontSize: 11.5, fontFamily: 'Geist Mono, monospace' }}>→ {s.prefCD}-2605-1640</span></SetRow>
          <SetRow label="PO Pembelian"><input style={inputStyle} value={s.prefPO} onChange={set('prefPO')}/><span className="muted" style={{ fontSize: 11.5, fontFamily: 'Geist Mono, monospace' }}>→ {s.prefPO}-2605-0312</span></SetRow>
          <SetRow label="Faktur Penjualan"><input style={inputStyle} value={s.prefSI} onChange={set('prefSI')}/><span className="muted" style={{ fontSize: 11.5, fontFamily: 'Geist Mono, monospace' }}>→ {s.prefSI}-2605-0918</span></SetRow>
        </SetCard>

        <SetCard icon="bell" title="Notifikasi & Sistem" sub="Pemberitahuan otomatis">
          <SetRow label="Butuh Approval" hint="Notif saat dokumen perlu disetujui"><Toggle on={s.notifApprove} onChange={set('notifApprove')}/></SetRow>
          <SetRow label="Dokumen Diposting"><Toggle on={s.notifPost} onChange={set('notifPost')}/></SetRow>
          <SetRow label="Stok Menipis" hint="Alert saat stok di bawah minimum"><Toggle on={s.notifLowStock} onChange={set('notifLowStock')}/></SetRow>
          <SetRow label="Kirim ke Email"><Toggle on={s.notifEmail} onChange={set('notifEmail')}/></SetRow>
          <SetRow label="Auto Backup Harian" hint="Backup DB tiap 02:00 WIB"><Toggle on={s.autoBackup} onChange={set('autoBackup')}/></SetRow>
        </SetCard>
      </div>

      <div className="pager">
        <span className="muted">Setting · {t('Preferensi')}</span>
        <div className="spacer"/>
        <span className="muted">Perubahan berlaku untuk semua user di cabang {s.branch}</span>
      </div>
    </div>
  );
};

window.SettingsPage = SettingsPage;
