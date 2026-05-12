// Generic list — reused for other Keuangan transaksi (CD, RM, SM, GJ, RG, SG, RGC, SGC, CB, GL)
const MODULES = {
  'kas-keluar': { label: 'Kas Keluar', code: 'CD', col: 'Bayar Ke', prefix: 'CD' },
  'bank-masuk': { label: 'Bank Masuk', code: 'RM', col: 'Terima Dari', prefix: 'RM' },
  'bank-keluar': { label: 'Bank Keluar', code: 'SM', col: 'Bayar Ke', prefix: 'SM' },
  'jurnal-umum': { label: 'Jurnal Umum', code: 'GJ', col: 'Uraian', prefix: 'GJ' },
  'giro-masuk': { label: 'Giro Masuk', code: 'RG', col: 'Terima Dari', prefix: 'RG' },
  'giro-keluar': { label: 'Giro Keluar', code: 'SG', col: 'Bayar Ke', prefix: 'SG' },
  'giro-masuk-batal': { label: 'Giro Masuk Batal', code: 'RGC', col: 'Terima Dari', prefix: 'RGC' },
  'giro-keluar-batal': { label: 'Giro Keluar Batal', code: 'SGC', col: 'Bayar Ke', prefix: 'SGC' },
  'saldo-awal': { label: 'Saldo Awal Coa', code: 'CB', col: 'Nama Akun', prefix: 'CB' },
  'buku-besar': { label: 'Buku Besar', code: 'GL', col: 'Akun', prefix: 'GL', isLedger: true },
};

const GenericList = ({ moduleId, t, onNavigate }) => {
  const mod = MODULES[moduleId];
  if (!mod) return <div style={{ padding: 24 }}>Modul tidak ditemukan: {moduleId}</div>;

  const [rows] = React.useState(() => {
    const base = genKasMasuk(48);
    return base.map((r, i) => ({
      ...r,
      no: `${mod.prefix}-26${r.no.slice(5)}`,
      total: mod.prefix.startsWith('CD') || mod.prefix.startsWith('SM') || mod.prefix.endsWith('C') ? -Math.abs(r.total) : r.total,
    }));
  });

  const [selected, setSelected] = React.useState(new Set());
  const [focused, setFocused] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const pageSize = 24;
  const start = (page - 1) * pageSize;
  const view = rows.slice(start, start + pageSize);
  const totalPages = Math.ceil(rows.length / pageSize);

  const toggle = (id) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const allSelected = view.length > 0 && view.every(r => selected.has(r.id));

  useKey((e) => {
    if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
    if (e.key === 'ArrowDown' || e.key === 'j') { e.preventDefault(); setFocused(f => Math.min(view.length - 1, f + 1)); }
    else if (e.key === 'ArrowUp' || e.key === 'k') { e.preventDefault(); setFocused(f => Math.max(0, f - 1)); }
    else if (e.key === 'x' || e.key === ' ') { e.preventDefault(); if (view[focused]) toggle(view[focused].id); }
  });

  if (mod.isLedger) {
    return <BukuBesar t={t}/>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{t(mod.label)}<span className="code-tag">{mod.code}</span></h1>
        <div className="page-actions">
          <div className="search-input">
            <Icon name="search" size={12}/>
            <input placeholder={t('Cari semua...')}/>
            <Kbd>/</Kbd>
          </div>
          <button className="btn"><Icon name="download" size={12}/> {t('Export')}</button>
          <button className="btn"><Icon name="refresh" size={12}/></button>
          <button className="btn primary"><Icon name="plus" size={12}/> {t('Tambah')} <Kbd>N</Kbd></button>
        </div>
      </div>

      <div className="toolbar">
        <Icon name="filter" size={13} className="muted"/>
        <div className="chip active"><span className="label">{t('Status')}</span><span className="val">Semua</span><Icon name="chevdown" size={10}/></div>
        <div className="chip active"><Icon name="calendar" size={11}/><span className="label">{t('Tanggal')}</span><span className="val">01/05 – 12/05/2026</span></div>
        <div className="chip active"><span className="label">{t('Cabang')}</span><span className="val">PCI</span></div>
        <div className="chip add"><Icon name="plus" size={10}/><span>{t('Tambah Filter')}</span></div>
        <div style={{ flex: 1 }}/>
        <span className="muted" style={{ fontSize: 11.5 }}>{rows.length} {t('baris')}</span>
      </div>

      <div className="tbl-wrap scrollbar">
        <table className="tbl">
          <thead>
            <tr>
              <th className="col-check">
                <input type="checkbox" className="checkbox" checked={allSelected} onChange={() => setSelected(allSelected ? new Set() : new Set(view.map(r => r.id)))}/>
              </th>
              <th>{t('No Transaksi')}</th>
              <th>{t('Tanggal')}</th>
              <th>{mod.col}</th>
              <th>{t('Uraian')}</th>
              <th>{t('Status')}</th>
              <th>{t('Cabang')}</th>
              <th>{t('User')}</th>
              <th className="col-num">{t('Total')} (IDR)</th>
            </tr>
          </thead>
          <tbody>
            {view.map((r, i) => (
              <tr key={r.id} className={`${selected.has(r.id) ? 'selected' : ''} ${i === focused ? 'focused' : ''}`}
                  onClick={() => setFocused(i)}>
                <td className="col-check"><input type="checkbox" className="checkbox" checked={selected.has(r.id)} onChange={() => toggle(r.id)}/></td>
                <td className="mono"><span style={{ color: 'var(--primary-soft-fg)' }}>{r.no}</span></td>
                <td className="mono muted">{r.tanggal}</td>
                <td>{r.terimaDari}</td>
                <td className="muted" style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.uraian}</td>
                <td><StatusPill status={r.status}/></td>
                <td className="muted">{r.cabang}</td>
                <td className="muted">{r.user}</td>
                <td className="num" style={{ color: r.total < 0 ? 'var(--danger)' : 'inherit' }}>{fmtIDR(r.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pager">
        <span>{t('Halaman')} <strong style={{ color: 'var(--fg)' }}>{page}</strong> {t('dari')} {totalPages}</span>
        <span>· {view.length} dari {rows.length} {t('baris')}</span>
        <div className="spacer"/>
        <span className="muted">Pintasan: <Kbd>J</Kbd>/<Kbd>K</Kbd> · <Kbd>X</Kbd> pilih · <Kbd>N</Kbd> baru</span>
        <div className="seg">
          <button disabled={page === 1} onClick={() => setPage(1)}><Icon name="chevdoubleleft" size={11}/></button>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}><Icon name="chevleft" size={11}/></button>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><Icon name="chevright" size={11}/></button>
          <button disabled={page === totalPages} onClick={() => setPage(totalPages)}><Icon name="chevdoubleright" size={11}/></button>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="bulk-bar fade-in">
          <span className="count">{selected.size}</span><span>dipilih</span>
          <span className="divider"/>
          <button className="ba-btn"><Icon name="check" size={12}/> {t('Approve')}</button>
          <button className="ba-btn"><Icon name="play" size={12}/> {t('Posting')}</button>
          <button className="ba-btn"><Icon name="download" size={12}/> {t('Export')}</button>
          <span className="divider"/>
          <button className="ba-btn danger"><Icon name="trash" size={12}/> {t('Hapus')}</button>
          <span className="divider"/>
          <button className="ba-btn" onClick={() => setSelected(new Set())}><Icon name="x" size={12}/></button>
        </div>
      )}
    </div>
  );
};

// Buku Besar — different layout: running balance ledger
const BukuBesar = ({ t }) => {
  const accounts = [
    { code: '110101.101', name: 'Cash (IDR)' },
    { code: '110102.001', name: 'Bank BCA 4520-xxx' },
    { code: '110102.002', name: 'Bank Mandiri 1390-xxx' },
    { code: '410101.101', name: 'Penjualan Barang Jadi' },
    { code: '510101.101', name: 'HPP' },
  ];
  const [active, setActive] = React.useState(accounts[0].code);
  const r = rng(7);
  let bal = 250000000;
  const entries = Array.from({ length: 36 }, (_, i) => {
    const debit = r() > 0.5 ? Math.round(r() * 5000000 / 1000) * 1000 : 0;
    const credit = !debit ? Math.round(r() * 4500000 / 1000) * 1000 : 0;
    bal = bal + debit - credit;
    const day = (i % 12) + 1;
    return { id: i, ref: `${['CR','RM','GJ','SM','CD'][i % 5]}-2605-${String(2400 - i).padStart(4,'0')}`, tgl: `${String(day).padStart(2,'0')}/05/2026`, uraian: URAIAN_KAS[i % URAIAN_KAS.length], debit, credit, bal };
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{t('Buku Besar')}<span className="code-tag">GL</span></h1>
        <div className="page-actions">
          <button className="btn"><Icon name="calendar" size={12}/> Mei 2026</button>
          <button className="btn"><Icon name="download" size={12}/> {t('Export')}</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', height: '100%', minHeight: 0, flex: 1 }}>
        <aside style={{ background: 'var(--panel)', borderRight: '1px solid var(--border)', overflow: 'auto' }} className="scrollbar">
          <div style={{ padding: 10, borderBottom: '1px solid var(--border)' }}>
            <div className="search-input" style={{ width: '100%' }}>
              <Icon name="search" size={12}/>
              <input placeholder="Cari akun..."/>
            </div>
          </div>
          {accounts.map(a => (
            <div key={a.code} className={`flyout-item ${a.code === active ? 'active' : ''}`} style={{ margin: 4, padding: '8px 10px' }} onClick={() => setActive(a.code)}>
              <span className="code" style={{ marginLeft: 0, marginRight: 8 }}>{a.code}</span>
              <span>{a.name}</span>
            </div>
          ))}
        </aside>
        <div className="tbl-wrap scrollbar">
          <div style={{ display: 'flex', gap: 16, padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'var(--panel-2)', fontSize: 12.5 }}>
            <div><span className="muted">Akun:</span> <strong className="mono" style={{ fontFamily: 'Geist Mono, monospace' }}>{active}</strong></div>
            <div><span className="muted">Saldo Awal:</span> <span className="mono" style={{ fontFamily: 'Geist Mono, monospace' }}>250.000.000,00</span></div>
            <div><span className="muted">Debit:</span> <span className="mono" style={{ fontFamily: 'Geist Mono, monospace', color: 'var(--success)' }}>{fmtIDR(entries.reduce((s,e) => s + e.debit, 0))}</span></div>
            <div><span className="muted">Kredit:</span> <span className="mono" style={{ fontFamily: 'Geist Mono, monospace', color: 'var(--danger)' }}>{fmtIDR(entries.reduce((s,e) => s + e.credit, 0))}</span></div>
            <div style={{ marginLeft: 'auto' }}><span className="muted">Saldo Akhir:</span> <strong className="mono" style={{ fontFamily: 'Geist Mono, monospace' }}>{fmtIDR(bal)}</strong></div>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Referensi</th>
                <th>Uraian</th>
                <th className="col-num">Debit</th>
                <th className="col-num">Kredit</th>
                <th className="col-num">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(e => (
                <tr key={e.id}>
                  <td className="mono muted">{e.tgl}</td>
                  <td className="mono"><span style={{ color: 'var(--primary-soft-fg)' }}>{e.ref}</span></td>
                  <td className="muted">{e.uraian}</td>
                  <td className="num" style={{ color: e.debit ? 'var(--success)' : 'var(--fg-faint)' }}>{e.debit ? fmtIDR(e.debit) : '—'}</td>
                  <td className="num" style={{ color: e.credit ? 'var(--danger)' : 'var(--fg-faint)' }}>{e.credit ? fmtIDR(e.credit) : '—'}</td>
                  <td className="num"><strong>{fmtIDR(e.bal)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

window.GenericList = GenericList;
