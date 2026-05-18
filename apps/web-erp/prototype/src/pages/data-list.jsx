// Generic data list — renders any REGISTRY[route] (master data, documents, settings lists).
const DLCell = ({ col, value }) => {
  const t = col.t;
  if (t === 'code') return <span className="mono" style={{ color: 'var(--primary-soft-fg)', cursor: 'pointer' }}>{value}</span>;
  if (t === 'date') return <span className="mono muted">{value}</span>;
  if (t === 'status') return <StatusPill status={value}/>;
  if (t === 'email') return <span className="muted">{value}</span>;
  if (t === 'ver') return <span className="code" style={{ marginLeft: 0 }}>{value}</span>;
  if (t === 'num' || t === 'qty') return <span className="num" style={{ display: 'block', textAlign: 'right' }}>{Number(value).toLocaleString('id-ID')}</span>;
  if (t === 'qtyS') return <span className="num" style={{ display: 'block', textAlign: 'right', color: value < 0 ? 'var(--danger)' : value > 0 ? 'var(--success)' : 'var(--fg-muted)' }}>{value > 0 ? '+' : ''}{Number(value).toLocaleString('id-ID')}</span>;
  if (t === 'money') return <span className="num" style={{ display: 'block', textAlign: 'right' }}>{fmtIDR(value)}</span>;
  if (t === 'moneyS') return <span className="num" style={{ display: 'block', textAlign: 'right', color: value < 0 ? 'var(--danger)' : 'inherit' }}>{fmtIDR(value)}</span>;
  if (t === 'pct') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 110 }}>
      <div style={{ flex: 1, height: 5, background: 'var(--panel-2)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: value >= 100 ? 'var(--success)' : 'var(--primary)' }}/>
      </div>
      <span className="mono muted" style={{ fontSize: 11, minWidth: 30, textAlign: 'right' }}>{value}%</span>
    </div>
  );
  return <span style={col.w > 180 ? { display: 'block', maxWidth: col.w, overflow: 'hidden', textOverflow: 'ellipsis' } : null}>{value}</span>;
};

const DataList = ({ moduleId, t, onNavigate, onOpenTab }) => {
  const openForm = () => (onOpenTab || onNavigate)(`${moduleId}-new`);
  const mod = window.REGISTRY[moduleId];
  if (!mod) return <div style={{ padding: 24 }}>Modul tidak ditemukan: {moduleId}</div>;

  const [rows] = React.useState(() => mod.gen());
  const [q, setQ] = React.useState('');
  const hasStatus = mod.cols.some(c => c.k === 'status');
  const hasDate = mod.cols.some(c => c.t === 'date');
  const [status, setStatus] = React.useState('Semua');
  const [dateOn, setDateOn] = React.useState(hasDate);
  const [range, setRange] = React.useState({ from: '01/05/2026', to: '12/05/2026' });
  const [selected, setSelected] = React.useState(new Set());
  const [focused, setFocused] = React.useState(0);
  const [sort, setSort] = React.useState({ col: null, dir: 'asc' });
  const [page, setPage] = React.useState(1);
  const pageSize = 24;

  const filtered = React.useMemo(() => {
    let arr = rows;
    if (hasStatus && status !== 'Semua') arr = arr.filter(r => r.status === status);
    if (q) {
      const ql = q.toLowerCase();
      arr = arr.filter(r => mod.cols.some(c => String(r[c.k]).toLowerCase().includes(ql)));
    }
    if (sort.col) {
      const cdef = mod.cols.find(c => c.k === sort.col);
      arr = [...arr].sort((a, b) => {
        let av = a[sort.col], bv = b[sort.col];
        if (['num', 'qty', 'qtyS', 'money', 'moneyS', 'pct'].includes(cdef.t)) { av = Number(av); bv = Number(bv); }
        if (av < bv) return sort.dir === 'asc' ? -1 : 1;
        if (av > bv) return sort.dir === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return arr;
  }, [rows, q, status, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const view = filtered.slice(start, start + pageSize);

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
    else if (e.key === 'Enter') { e.preventDefault(); if (view[focused]) { window.__viewRow = view[focused]; onNavigate(`${moduleId}-view`); } }
    else if (e.key.toLowerCase() === 'n') { e.preventDefault(); openForm(); }
  });

  const setSortCol = (col) => setSort(s => ({ col, dir: s.col === col && s.dir === 'asc' ? 'desc' : 'asc' }));
  const sortInd = (col) => sort.col !== col ? null : <span className="sort-ind"><Icon name={sort.dir === 'asc' ? 'chevup' : 'chevdown'} size={10}/></span>;
  const totalCol = mod.cols.find(c => ['money'].includes(c.t) && /total|saldo|harga|anggaran|nilai/i.test(c.k));
  const sumTotal = totalCol ? filtered.reduce((s, r) => s + Number(r[totalCol.k] || 0), 0) : null;
  const codeCol = mod.cols.find(c => c.t === 'code') || mod.cols[0];
  const selItems = () => filtered.filter(r => selected.has(r.id)).map(r => ({ label: String(r[codeCol.k]), val: null }));
  const bulk = (kind) => window.bulkAction(kind, selected.size, clearSel, selItems());

  const availFilters = [hasStatus && { id: 'status' }, !dateOn && hasDate && { id: 'tanggal', label: t('Tanggal') }]
    .filter(Boolean).filter(f => f.id !== 'status');

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
          <button className="btn primary" onClick={openForm}><Icon name="plus" size={12}/> {t('Tambah')} <Kbd>N</Kbd></button>
        </div>
      </div>

      <div className="toolbar">
        <Icon name="filter" size={13} className="muted"/>
        {hasStatus && <FilterChip label={t('Status')} val={status} options={['Semua', ...window.STATUSES]} onChange={v => { setStatus(v); setPage(1); }} onRemove={() => { setStatus('Semua'); setPage(1); }}/>}
        {dateOn && <DateRangeChip from={range.from} to={range.to} onChange={(f, to) => setRange({ from: f, to })} onRemove={() => setDateOn(false)}/>}
        <AddFilterChip available={availFilters.map(f => ({ id: f.id, label: f.label }))} onAdd={() => setDateOn(true)} t={t}/>
        <div style={{ flex: 1 }}/>
        {sumTotal != null && <span className="muted" style={{ fontSize: 11.5 }}>Σ {fmtIDR(sumTotal)}</span>}
        <span className="muted" style={{ fontSize: 11.5 }}>· {filtered.length} {t('baris')}</span>
        <button className="btn ghost sm" onClick={() => { setStatus('Semua'); setQ(''); setSort({ col: null, dir: 'asc' }); setPage(1); }}>{t('Reset')}</button>
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
              {mod.cols.map(c => (
                <th key={c.k} className={`sortable ${['num', 'qty', 'qtyS', 'money', 'moneyS'].includes(c.t) ? 'col-num' : ''}`}
                  onClick={() => setSortCol(c.k)} style={c.w ? { minWidth: c.w } : null}>
                  {c.h}{sortInd(c.k)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {view.map((r, i) => (
              <tr key={r.id} className={`${selected.has(r.id) ? 'selected' : ''} ${i === focused ? 'focused' : ''}`} onClick={() => setFocused(i)}>
                <td className="col-check"><input type="checkbox" className="checkbox" checked={selected.has(r.id)} onChange={() => toggle(r.id)}/></td>
                {mod.cols.map(c => (
                  <td key={c.k} className={['num', 'qty', 'qtyS', 'money', 'moneyS'].includes(c.t) ? 'col-num' : ''}
                    onClick={c.t === 'code' ? () => { window.__viewRow = r; onNavigate(`${moduleId}-view`); } : undefined}>
                    <DLCell col={c} value={r[c.k]}/>
                  </td>
                ))}
              </tr>
            ))}
            {view.length === 0 && <tr><td colSpan={mod.cols.length + 1} className="tbl-empty">Tidak ada data yang cocok dengan filter</td></tr>}
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

window.DataList = DataList;
