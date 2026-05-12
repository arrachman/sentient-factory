// Kas Masuk — list view
const KasMasukList = ({ t, onNavigate, lang }) => {
  const [rows] = React.useState(() => genKasMasuk(64));
  const [filters, setFilters] = React.useState({
    no: '', status: 'Semua', from: '01/05/2026', to: '12/05/2026',
    terimaDari: '', lokasi: '', cabang: 'PCI', user: ''
  });
  const [activeFilters, setActiveFilters] = React.useState(['status', 'tanggal', 'cabang']);
  const [selected, setSelected] = React.useState(new Set());
  const [sort, setSort] = React.useState({ col: 'tanggal', dir: 'desc' });
  const [page, setPage] = React.useState(1);
  const [focused, setFocused] = React.useState(0);
  const pageSize = 24;
  const tblRef = React.useRef(null);

  const sorted = React.useMemo(() => {
    const arr = [...rows];
    arr.sort((a, b) => {
      let av = a[sort.col], bv = b[sort.col];
      if (sort.col === 'total') { av = Number(av); bv = Number(bv); }
      if (av < bv) return sort.dir === 'asc' ? -1 : 1;
      if (av > bv) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [rows, sort]);

  const start = (page - 1) * pageSize;
  const view = sorted.slice(start, start + pageSize);
  const totalPages = Math.ceil(sorted.length / pageSize);

  const toggle = (id) => {
    setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleAll = () => {
    setSelected(s => view.every(r => s.has(r.id)) ? new Set([...s].filter(id => !view.find(r => r.id === id))) : new Set([...s, ...view.map(r => r.id)]));
  };
  const allSelected = view.length > 0 && view.every(r => selected.has(r.id));
  const someSelected = view.some(r => selected.has(r.id)) && !allSelected;

  // Keyboard nav
  useKey((e) => {
    if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
    if (e.key === 'j' || e.key === 'ArrowDown') { e.preventDefault(); setFocused(f => Math.min(view.length - 1, f + 1)); }
    else if (e.key === 'k' || e.key === 'ArrowUp') { e.preventDefault(); setFocused(f => Math.max(0, f - 1)); }
    else if (e.key === 'x' || e.key === ' ') { e.preventDefault(); if (view[focused]) toggle(view[focused].id); }
    else if (e.key === 'Enter') { e.preventDefault(); onNavigate('kas-masuk-new'); }
  });

  const setSortCol = (col) => setSort(s => ({ col, dir: s.col === col && s.dir === 'asc' ? 'desc' : 'asc' }));
  const sortInd = (col) => sort.col !== col ? null : <span className="sort-ind"><Icon name={sort.dir === 'asc' ? 'chevup' : 'chevdown'} size={10}/></span>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{t('Kas Masuk')}<span className="code-tag">CR</span></h1>
        <div className="page-actions">
          <div className="search-input">
            <Icon name="search" size={12}/>
            <input placeholder={t('Cari semua...')}/>
            <Kbd>/</Kbd>
          </div>
          <button className="btn"><Icon name="download" size={12}/> {t('Export')}</button>
          <button className="btn"><Icon name="refresh" size={12}/></button>
          <div className="btn-split">
            <button className="btn primary" onClick={() => onNavigate('kas-masuk-new')}><Icon name="plus" size={12}/> {t('Tambah')} <Kbd>N</Kbd></button>
            <button className="btn primary"><Icon name="chevdown" size={12}/></button>
          </div>
        </div>
      </div>

      {/* Filter chip bar */}
      <div className="toolbar">
        <Icon name="filter" size={13} className="muted"/>
        {activeFilters.includes('status') && (
          <FilterChip label={t('Status')} val={filters.status} options={['Semua', ...STATUSES]}
            onChange={v => setFilters({...filters, status: v})}
            onRemove={() => setActiveFilters(activeFilters.filter(f => f !== 'status'))}/>
        )}
        {activeFilters.includes('tanggal') && (
          <div className="chip active">
            <Icon name="calendar" size={11}/>
            <span className="label">{t('Tanggal')}</span>
            <span className="val">{filters.from} – {filters.to}</span>
            <span className="x" onClick={() => setActiveFilters(activeFilters.filter(f => f !== 'tanggal'))}><Icon name="x" size={10}/></span>
          </div>
        )}
        {activeFilters.includes('cabang') && (
          <FilterChip label={t('Cabang')} val={filters.cabang} options={['Semua', ...CABANGS]}
            onChange={v => setFilters({...filters, cabang: v})}
            onRemove={() => setActiveFilters(activeFilters.filter(f => f !== 'cabang'))}/>
        )}
        {activeFilters.includes('lokasi') && (
          <FilterChip label={t('Lokasi')} val={filters.lokasi || 'Semua'} options={['Semua', ...LOKASIS]}
            onChange={v => setFilters({...filters, lokasi: v})}
            onRemove={() => setActiveFilters(activeFilters.filter(f => f !== 'lokasi'))}/>
        )}
        {activeFilters.includes('user') && (
          <FilterChip label={t('User')} val={filters.user || 'Semua'} options={['Semua', ...USERS]}
            onChange={v => setFilters({...filters, user: v})}
            onRemove={() => setActiveFilters(activeFilters.filter(f => f !== 'user'))}/>
        )}
        <AddFilterChip activeFilters={activeFilters} setActiveFilters={setActiveFilters} t={t}/>
        <div style={{ flex: 1 }}/>
        <span className="muted" style={{ fontSize: 11.5 }}>{sorted.length} {t('baris')}</span>
        <span className="muted" style={{ fontSize: 11.5 }}>·</span>
        <button className="btn ghost sm" onClick={() => { setFilters({ no: '', status: 'Semua', from: '01/05/2026', to: '12/05/2026', terimaDari: '', lokasi: '', cabang: 'PCI', user: '' }); }}>{t('Reset')}</button>
      </div>

      {/* Table */}
      <div className="tbl-wrap scrollbar" ref={tblRef}>
        <table className="tbl">
          <thead>
            <tr>
              <th className="col-check">
                <input type="checkbox" className="checkbox" checked={allSelected}
                  ref={el => { if (el) el.indeterminate = someSelected; }}
                  onChange={toggleAll}/>
              </th>
              <th className="sortable" onClick={() => setSortCol('no')}>{t('No Transaksi')}{sortInd('no')}</th>
              <th className="sortable" onClick={() => setSortCol('tanggal')}>{t('Tanggal')}{sortInd('tanggal')}</th>
              <th className="sortable" onClick={() => setSortCol('terimaDari')}>{t('Terima Dari')}{sortInd('terimaDari')}</th>
              <th>{t('Uraian')}</th>
              <th>{t('Status')}</th>
              <th>{t('Cabang')}</th>
              <th>{t('Lokasi')}</th>
              <th>{t('User')}</th>
              <th className="col-num sortable" onClick={() => setSortCol('total')}>{t('Total')} (IDR){sortInd('total')}</th>
            </tr>
          </thead>
          <tbody>
            {view.map((r, i) => (
              <tr key={r.id} className={`${selected.has(r.id) ? 'selected' : ''} ${i === focused ? 'focused' : ''}`}
                  onClick={() => setFocused(i)}>
                <td className="col-check">
                  <input type="checkbox" className="checkbox" checked={selected.has(r.id)} onChange={() => toggle(r.id)}/>
                </td>
                <td className="mono"><a style={{ color: 'var(--primary-soft-fg)', textDecoration: 'none', cursor: 'pointer' }} onClick={() => onNavigate('kas-masuk-new')}>{r.no}</a></td>
                <td className="mono muted">{r.tanggal}</td>
                <td style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.terimaDari}</td>
                <td className="muted" style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.uraian}</td>
                <td><StatusPill status={r.status}/></td>
                <td className="mono muted">{r.cabang}</td>
                <td className="muted">{r.lokasi}</td>
                <td className="muted">{r.user}</td>
                <td className="num">{fmtIDR(r.total)}</td>
              </tr>
            ))}
            {view.length === 0 && (
              <tr><td colSpan="10" className="tbl-empty">Tidak ada transaksi yang cocok dengan filter</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pager">
        <span>{t('Halaman')} <strong style={{ color: 'var(--fg)' }}>{page}</strong> {t('dari')} {totalPages}</span>
        <span>· {view.length} dari {sorted.length} {t('baris')}</span>
        <div className="spacer"/>
        <span className="muted">Pintasan: <Kbd>J</Kbd>/<Kbd>K</Kbd> navigasi · <Kbd>X</Kbd> pilih · <Kbd>↵</Kbd> buka</span>
        <div className="seg">
          <button disabled={page === 1} onClick={() => setPage(1)}><Icon name="chevdoubleleft" size={11}/></button>
          <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}><Icon name="chevleft" size={11}/></button>
          <button disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}><Icon name="chevright" size={11}/></button>
          <button disabled={page === totalPages} onClick={() => setPage(totalPages)}><Icon name="chevdoubleright" size={11}/></button>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="bulk-bar fade-in">
          <span className="count">{selected.size}</span>
          <span>dipilih</span>
          <span className="divider"/>
          <button className="ba-btn"><Icon name="check" size={12}/> {t('Approve')}</button>
          <button className="ba-btn"><Icon name="x" size={12}/> {t('Reject')}</button>
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

const FilterChip = ({ label, val, options, onChange, onRemove }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div className={`chip ${val && val !== 'Semua' ? 'active' : ''}`} onClick={() => setOpen(o => !o)}>
        <span className="label">{label}</span>
        <span className="val">{val}</span>
        <Icon name="chevdown" size={10}/>
        {val && val !== 'Semua' && (
          <span className="x" onClick={(e) => { e.stopPropagation(); onRemove(); }}><Icon name="x" size={10}/></span>
        )}
      </div>
      {open && (
        <div className="flyout fade-in" style={{ position: 'absolute', left: 0, top: '100%', marginTop: 4, minWidth: 180 }}>
          {options.map(o => (
            <div key={o} className={`flyout-item ${o === val ? 'active' : ''}`} onClick={() => { onChange(o); setOpen(false); }}>
              <Icon name={o === val ? 'check' : 'dot'} size={o === val ? 12 : 8}/>
              <span>{o}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AddFilterChip = ({ activeFilters, setActiveFilters, t }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);
  const available = [
    { id: 'status', label: t('Status') }, { id: 'tanggal', label: t('Tanggal') },
    { id: 'cabang', label: t('Cabang') }, { id: 'lokasi', label: t('Lokasi') },
    { id: 'user', label: t('User') },
  ].filter(f => !activeFilters.includes(f.id));
  if (available.length === 0) return null;
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div className="chip add" onClick={() => setOpen(o => !o)}>
        <Icon name="plus" size={10}/>
        <span>{t('Tambah Filter')}</span>
      </div>
      {open && (
        <div className="flyout fade-in" style={{ position: 'absolute', left: 0, top: '100%', marginTop: 4, minWidth: 160 }}>
          {available.map(f => (
            <div key={f.id} className="flyout-item" onClick={() => { setActiveFilters([...activeFilters, f.id]); setOpen(false); }}>
              <Icon name="plus" size={10}/><span>{f.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

window.KasMasukList = KasMasukList;
