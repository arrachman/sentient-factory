// Generic list for Keuangan transaksi (CD, RM, SM, GJ, RG, SG, RGC, SGC, CB, GL).
const MODULES = {
  'kas-keluar':        { label: 'Kas Keluar', code: 'CD', col: 'Bayar Ke', prefix: 'CD' },
  'bank-masuk':        { label: 'Bank Masuk', code: 'RM', col: 'Terima Dari', prefix: 'RM' },
  'bank-keluar':       { label: 'Bank Keluar', code: 'SM', col: 'Bayar Ke', prefix: 'SM' },
  'jurnal-umum':       { label: 'Jurnal Umum', code: 'GJ', col: 'Uraian', prefix: 'GJ' },
  'giro-masuk':        { label: 'Giro Masuk', code: 'RG', col: 'Terima Dari', prefix: 'RG' },
  'giro-keluar':       { label: 'Giro Keluar', code: 'SG', col: 'Bayar Ke', prefix: 'SG' },
  'giro-masuk-batal':  { label: 'Giro Masuk Batal', code: 'RGC', col: 'Terima Dari', prefix: 'RGC' },
  'giro-keluar-batal': { label: 'Giro Keluar Batal', code: 'SGC', col: 'Bayar Ke', prefix: 'SGC' },
  'saldo-awal':        { label: 'Saldo Awal Coa', code: 'CB', col: 'Nama Akun', prefix: 'CB' },
  'buku-besar':        { label: 'Buku Besar', code: 'GL', col: 'Akun', prefix: 'GL', isLedger: true },
};

const GenericList = ({ moduleId, t, onNavigate }) => {
  const mod = MODULES[moduleId];
  if (mod && mod.isLedger) return <BukuBesar t={t}/>;
  if (!mod) return <div style={{ padding: 24 }}>Modul tidak ditemukan: {moduleId}</div>;

  const neg = /^(CD|SM|SGC)/.test(mod.prefix);
  const [rows] = React.useState(() => genKasMasuk(48).map((r) => ({
    ...r,
    no: `${mod.prefix}-26${r.no.slice(5)}`,
    total: neg ? -Math.abs(r.total) : r.total,
  })));

  const [q, setQ] = React.useState('');
  const [filters, setFilters] = React.useState({ status: 'Semua', cabang: 'Semua', lokasi: 'Semua', user: 'Semua', from: '01/05/2026', to: '12/05/2026' });
  const [activeFilters, setActiveFilters] = React.useState(['status', 'tanggal', 'cabang']);
  const [selected, setSelected] = React.useState(new Set());
  const [focused, setFocused] = React.useState(0);
  const [sort, setSort] = React.useState({ col: 'tanggal', dir: 'desc' });
  const [page, setPage] = React.useState(1);
  const pageSize = 24;

  const filtered = React.useMemo(() => {
    let arr = rows.filter(r => {
      if (filters.status !== 'Semua' && r.status !== filters.status) return false;
      if (filters.cabang !== 'Semua' && r.cabang !== filters.cabang) return false;
      if (filters.lokasi !== 'Semua' && r.lokasi !== filters.lokasi) return false;
      if (filters.user !== 'Semua' && r.user !== filters.user) return false;
      if (q) {
        const ql = q.toLowerCase();
        if (![r.no, r.terimaDari, r.uraian, r.status, r.cabang, r.user].some(v => String(v).toLowerCase().includes(ql))) return false;
      }
      return true;
    });
    arr = [...arr].sort((a, b) => {
      let av = a[sort.col], bv = b[sort.col];
      if (sort.col === 'total') { av = Number(av); bv = Number(bv); }
      if (av < bv) return sort.dir === 'asc' ? -1 : 1;
      if (av > bv) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [rows, q, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const view = filtered.slice(start, start + pageSize);
  const sumTotal = filtered.reduce((s, r) => s + Number(r.total || 0), 0);

  const toggle = (id) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const allSelected = view.length > 0 && view.every(r => selected.has(r.id));
  const someSelected = view.some(r => selected.has(r.id)) && !allSelected;
  const clearSel = () => setSelected(new Set());

  useKey((e) => {
    if (window.__overlay) return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
    if (e.key === 'ArrowDown' || e.key === 'j') { e.preventDefault(); setFocused(f => Math.min(view.length - 1, f + 1)); }
    else if (e.key === 'ArrowUp' || e.key === 'k') { e.preventDefault(); setFocused(f => Math.max(0, f - 1)); }
    else if (e.key === 'x' || e.key === ' ') { e.preventDefault(); if (view[focused]) toggle(view[focused].id); }
    else if (e.key.toLowerCase() === 'n') { e.preventDefault(); onNavigate(`${moduleId}-new`); }
    else if (e.key === 'Enter' && view[focused]) { e.preventDefault(); onNavigate(`${moduleId}-new`); }
  });

  const setSortCol = (col) => setSort(s => ({ col, dir: s.col === col && s.dir === 'asc' ? 'desc' : 'asc' }));
  const sortInd = (col) => sort.col !== col ? null : <span className="sort-ind"><Icon name={sort.dir === 'asc' ? 'chevup' : 'chevdown'} size={10}/></span>;
  const setF = (k, v) => { setFilters(f => ({ ...f, [k]: v })); setPage(1); };
  const removeF = (id) => setActiveFilters(a => a.filter(x => x !== id));
  const selItems = () => filtered.filter(r => selected.has(r.id)).map(r => ({ label: r.no, val: fmtIDR(r.total) }));
  const bulk = (kind) => window.bulkAction(kind, selected.size, clearSel, selItems());

  const availFilters = [
    { id: 'status', label: t('Status') }, { id: 'tanggal', label: t('Tanggal') },
    { id: 'cabang', label: t('Cabang') }, { id: 'lokasi', label: t('Lokasi') }, { id: 'user', label: t('User') },
  ].filter(f => !activeFilters.includes(f.id));

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{t(mod.label)}<span className="code-tag">{mod.code}</span></h1>
        <div className="page-actions">
          <div className="search-input">
            <Icon name="search" size={12}/>
            <input placeholder={t('Cari semua...')} value={q} onChange={e => { setQ(e.target.value); setPage(1); }}/>
            <Kbd>/</Kbd>
          </div>
          <button className="btn" onClick={() => window.toast(`${filtered.length} baris diekspor (.xlsx)`, { type: 'success' })}><Icon name="download" size={12}/> {t('Export')}</button>
          <button className="btn" onClick={() => window.toast('Data dimuat ulang', { type: 'info' })}><Icon name="refresh" size={12}/></button>
          <div className="btn-split">
            <button className="btn primary" onClick={() => onNavigate(`${moduleId}-new`)}><Icon name="plus" size={12}/> {t('Tambah')} <Kbd>N</Kbd></button>
            <button className="btn primary"><Icon name="chevdown" size={12}/></button>
          </div>
        </div>
      </div>

      <div className="toolbar">
        <Icon name="filter" size={13} className="muted"/>
        {activeFilters.includes('status') && <FilterChip label={t('Status')} val={filters.status} options={['Semua', ...window.STATUSES]} onChange={v => setF('status', v)} onRemove={() => removeF('status')}/>}
        {activeFilters.includes('tanggal') && <DateRangeChip from={filters.from} to={filters.to} onChange={(f, to) => { setFilters(s => ({ ...s, from: f, to })); setPage(1); }} onRemove={() => removeF('tanggal')}/>}
        {activeFilters.includes('cabang') && <FilterChip label={t('Cabang')} val={filters.cabang} options={['Semua', ...window.CABANGS]} onChange={v => setF('cabang', v)} onRemove={() => removeF('cabang')}/>}
        {activeFilters.includes('lokasi') && <FilterChip label={t('Lokasi')} val={filters.lokasi} options={['Semua', ...window.LOKASIS]} onChange={v => setF('lokasi', v)} onRemove={() => removeF('lokasi')}/>}
        {activeFilters.includes('user') && <FilterChip label={t('User')} val={filters.user} options={['Semua', ...window.USERS]} onChange={v => setF('user', v)} onRemove={() => removeF('user')}/>}
        <AddFilterChip available={availFilters} onAdd={id => setActiveFilters(a => [...a, id])} t={t}/>
        <div style={{ flex: 1 }}/>
        <span className="muted" style={{ fontSize: 11.5 }}>Σ {fmtIDR(sumTotal)}</span>
        <span className="muted" style={{ fontSize: 11.5 }}>· {filtered.length} {t('baris')}</span>
        <button className="btn ghost sm" onClick={() => { setFilters({ status: 'Semua', cabang: 'Semua', lokasi: 'Semua', user: 'Semua', from: '01/05/2026', to: '12/05/2026' }); setQ(''); setPage(1); }}>{t('Reset')}</button>
      </div>

      <div className="tbl-wrap scrollbar">
        <table className="tbl">
          <thead>
            <tr>
              <th className="col-check">
                <input type="checkbox" className="checkbox" checked={allSelected}
                  ref={el => { if (el) el.indeterminate = someSelected; }}
                  onChange={() => setSelected(allSelected ? new Set() : new Set(view.map(r => r.id)))}/>
              </th>
              <th className="sortable" onClick={() => setSortCol('no')}>{t('No Transaksi')}{sortInd('no')}</th>
              <th className="sortable" onClick={() => setSortCol('tanggal')}>{t('Tanggal')}{sortInd('tanggal')}</th>
              <th className="sortable" onClick={() => setSortCol('terimaDari')}>{mod.col}{sortInd('terimaDari')}</th>
              <th>{t('Uraian')}</th>
              <th>{t('Status')}</th>
              <th>{t('Cabang')}</th>
              <th>{t('User')}</th>
              <th className="col-num sortable" onClick={() => setSortCol('total')}>{t('Total')} (IDR){sortInd('total')}</th>
            </tr>
          </thead>
          <tbody>
            {view.map((r, i) => (
              <tr key={r.id} className={`${selected.has(r.id) ? 'selected' : ''} ${i === focused ? 'focused' : ''}`} onClick={() => setFocused(i)}>
                <td className="col-check"><input type="checkbox" className="checkbox" checked={selected.has(r.id)} onChange={() => toggle(r.id)}/></td>
                <td className="mono"><a style={{ color: 'var(--primary-soft-fg)', textDecoration: 'none', cursor: 'pointer' }} onClick={() => onNavigate(`${moduleId}-new`)}>{r.no}</a></td>
                <td className="mono muted">{r.tanggal}</td>
                <td>{r.terimaDari}</td>
                <td className="muted" style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.uraian}</td>
                <td><StatusPill status={r.status}/></td>
                <td className="mono muted">{r.cabang}</td>
                <td className="muted">{r.user}</td>
                <td className="num" style={{ color: r.total < 0 ? 'var(--danger)' : 'inherit' }}>{fmtIDR(r.total)}</td>
              </tr>
            ))}
            {view.length === 0 && <tr><td colSpan="9" className="tbl-empty">Tidak ada transaksi yang cocok dengan filter</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="pager">
        <span>{t('Halaman')} <strong style={{ color: 'var(--fg)' }}>{safePage}</strong> {t('dari')} {totalPages}</span>
        <span>· {view.length} {t('dari')} {filtered.length} {t('baris')}</span>
        <div className="spacer"/>
        <span className="muted">Pintasan: <Kbd>J</Kbd>/<Kbd>K</Kbd> · <Kbd>X</Kbd> pilih · <Kbd>N</Kbd> baru</span>
        <div className="seg">
          <button disabled={safePage === 1} onClick={() => setPage(1)}><Icon name="chevdoubleleft" size={11}/></button>
          <button disabled={safePage === 1} onClick={() => setPage(p => Math.max(1, p - 1))}><Icon name="chevleft" size={11}/></button>
          <button disabled={safePage === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}><Icon name="chevright" size={11}/></button>
          <button disabled={safePage === totalPages} onClick={() => setPage(totalPages)}><Icon name="chevdoubleright" size={11}/></button>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="bulk-bar fade-in">
          <span className="count">{selected.size}</span><span>dipilih</span>
          <span className="divider"/>
          <button className="ba-btn" onClick={() => bulk('approve')}><Icon name="check" size={12}/> {t('Approve')}</button>
          <button className="ba-btn" onClick={() => bulk('reject')}><Icon name="x" size={12}/> {t('Reject')}</button>
          <button className="ba-btn" onClick={() => bulk('post')}><Icon name="play" size={12}/> {t('Posting')}</button>
          <button className="ba-btn" onClick={() => bulk('export')}><Icon name="download" size={12}/> {t('Export')}</button>
          <span className="divider"/>
          <button className="ba-btn danger" onClick={() => bulk('delete')}><Icon name="trash" size={12}/> {t('Hapus')}</button>
          <span className="divider"/>
          <button className="ba-btn" onClick={clearSel}><Icon name="x" size={12}/></button>
        </div>
      )}
    </div>
  );
};

window.GenericList = GenericList;
window.MODULES = MODULES;
