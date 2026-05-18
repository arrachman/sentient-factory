// Approval Queue — Antrean Persetujuan lintas modul
const PENDING_DOCS = [
  { id: 1,  module: 'kas-masuk',   moduleLabel: 'Kas Masuk',    noDoc: 'CR-2605-0012', pembuat: 'Rina Dewi',    nilai: 4500000,  tgl: '2026-05-10', aging: 8  },
  { id: 2,  module: 'bank-keluar', moduleLabel: 'Bank Keluar',  noDoc: 'SM-2605-0031', pembuat: 'Budi Santoso', nilai: 12750000, tgl: '2026-05-09', aging: 9  },
  { id: 3,  module: 'jurnal-umum', moduleLabel: 'Jurnal Umum',  noDoc: 'GJ-2605-0007', pembuat: 'Siti Rahayu', nilai: null,      tgl: '2026-05-08', aging: 10 },
  { id: 4,  module: 'pur-po',      moduleLabel: 'Purchase Order',noDoc: 'PO-2605-0055', pembuat: 'Ahmad Fauzi', nilai: 87000000, tgl: '2026-05-08', aging: 10 },
  { id: 5,  module: 'prd-wo',      moduleLabel: 'Work Order',   noDoc: 'WO-2605-0019', pembuat: 'Dewi Lestari', nilai: null,     tgl: '2026-05-09', aging: 9  },
  { id: 6,  module: 'fa-disposal', moduleLabel: 'FA Disposal',  noDoc: 'FAD-2605-002', pembuat: 'Rina Dewi',    nilai: 35000000, tgl: '2026-05-08', aging: 10 },
  { id: 7,  module: 'kas-masuk',   moduleLabel: 'Kas Masuk',    noDoc: 'CR-2605-0041', pembuat: 'Budi Santoso', nilai: 6200000,  tgl: '2026-05-12', aging: 6  },
  { id: 8,  module: 'pur-invoice', moduleLabel: 'Invoice Pembelian',noDoc:'PI-2605-0028',pembuat:'Ahmad Fauzi', nilai: 54000000, tgl: '2026-05-12', aging: 6  },
  { id: 9,  module: 'inv-opname',  moduleLabel: 'Stock Opname', noDoc: 'SO-2605-0003', pembuat: 'Siti Rahayu', nilai: null,      tgl: '2026-05-13', aging: 5  },
  { id: 10, module: 'sales-order', moduleLabel: 'Sales Order',  noDoc: 'ORD-2605-0112',pembuat: 'Dewi Lestari',nilai: 28500000, tgl: '2026-05-12', aging: 6  },
  { id: 11, module: 'sal-invoice', moduleLabel: 'Invoice Sales', noDoc: 'SIV-2605-0067',pembuat:'Rina Dewi',   nilai: 18750000, tgl: '2026-05-13', aging: 5  },
  { id: 12, module: 'jurnal-umum', moduleLabel: 'Jurnal Umum',  noDoc: 'GJ-2605-0014', pembuat: 'Budi Santoso',nilai: null,     tgl: '2026-05-13', aging: 5  },
  { id: 13, module: 'kas-masuk',   moduleLabel: 'Kas Masuk',    noDoc: 'CR-2605-0058', pembuat: 'Ahmad Fauzi', nilai: 3100000,  tgl: '2026-05-15', aging: 3  },
  { id: 14, module: 'bank-keluar', moduleLabel: 'Bank Keluar',  noDoc: 'SM-2605-0049', pembuat: 'Siti Rahayu', nilai: 9800000,  tgl: '2026-05-14', aging: 4  },
  { id: 15, module: 'pur-po',      moduleLabel: 'Purchase Order',noDoc: 'PO-2605-0071', pembuat: 'Dewi Lestari',nilai: 41500000,tgl: '2026-05-15', aging: 3  },
  { id: 16, module: 'sales-order', moduleLabel: 'Sales Order',  noDoc: 'ORD-2605-0134',pembuat: 'Rina Dewi',   nilai: 16200000, tgl: '2026-05-16', aging: 2  },
  { id: 17, module: 'sal-invoice', moduleLabel: 'Invoice Sales', noDoc: 'SIV-2605-0081',pembuat:'Budi Santoso',nilai: 7300000,  tgl: '2026-05-17', aging: 1  },
  { id: 18, module: 'prd-wo',      moduleLabel: 'Work Order',   noDoc: 'WO-2605-0031', pembuat: 'Ahmad Fauzi', nilai: null,     tgl: '2026-05-17', aging: 1  },
];
PENDING_DOCS.forEach(d => {
  d.urgency = d.aging > 7 ? 'critical' : d.aging >= 5 ? 'urgent' : 'normal';
});

const ALL_MODULES = [...new Set(PENDING_DOCS.map(d => d.module))].map(m => {
  const doc = PENDING_DOCS.find(d => d.module === m);
  return { value: m, label: doc.moduleLabel };
});
const ALL_USERS = [...new Set(PENDING_DOCS.map(d => d.pembuat))];

const AgingBadge = ({ aging }) => {
  const color = aging > 7 ? 'var(--danger)' : aging >= 5 ? 'var(--warn)' : 'var(--info)';
  return (
    <span style={{ background: color, color: '#fff', borderRadius: 4, padding: '1px 7px', fontSize: 11, fontWeight: 600 }}>
      {aging}h
    </span>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="card" style={{ padding: '14px 18px', minWidth: 120, flex: 1 }}>
    <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 26, fontWeight: 700, color }}>{value}</div>
  </div>
);

const ApprovalQueue = ({ t, onNavigate, onOpenTab }) => {
  const [docs, setDocs]         = React.useState(PENDING_DOCS);
  const [selected, setSelected] = React.useState(new Set());
  const [focused, setFocused]   = React.useState(0);
  const [tab, setTab]           = React.useState('all');
  const [filterMod, setFilterMod]   = React.useState('all');
  const [filterUser, setFilterUser] = React.useState('all');

  const visible = React.useMemo(() => {
    return docs.filter(d => {
      if (tab === 'urgent'   && d.aging <= 4)  return false;
      if (tab === 'critical' && d.aging <= 7)  return false;
      if (filterMod  !== 'all' && d.module   !== filterMod)  return false;
      if (filterUser !== 'all' && d.pembuat  !== filterUser) return false;
      return true;
    });
  }, [docs, tab, filterMod, filterUser]);

  const removeDoc = (id) => {
    setDocs(prev => prev.filter(d => d.id !== id));
    setSelected(prev => { const s = new Set(prev); s.delete(id); return s; });
  };
  const removeDocs = (ids) => {
    setDocs(prev => prev.filter(d => !ids.has(d.id)));
    setSelected(new Set());
  };

  const handleApprove = (doc) => {
    confirmAction({
      title: 'Setujui Dokumen',
      message: `Setujui ${doc.noDoc}?`,
      variant: 'primary',
      onConfirm: () => { removeDoc(doc.id); toast(`Dokumen ${doc.noDoc} disetujui`, { type: 'success' }); },
    });
  };
  const handleReject = (doc) => {
    confirmAction({
      title: 'Tolak Dokumen',
      message: `Tolak ${doc.noDoc}?`,
      variant: 'danger',
      onConfirm: () => { removeDoc(doc.id); toast(`Dokumen ${doc.noDoc} ditolak`, { type: 'warn' }); },
    });
  };
  const handleOpen = (doc) => (onOpenTab || onNavigate)(doc.module);

  const handleBulkApprove = () => {
    const ids = new Set(selected);
    confirmAction({
      title: 'Setujui Semua',
      message: `Setujui ${ids.size} dokumen terpilih?`,
      variant: 'primary',
      onConfirm: () => { removeDocs(ids); toast(`${ids.size} dokumen disetujui`, { type: 'success' }); },
    });
  };
  const handleBulkReject = () => {
    const ids = new Set(selected);
    confirmAction({
      title: 'Tolak Semua',
      message: `Tolak ${ids.size} dokumen terpilih?`,
      variant: 'danger',
      onConfirm: () => { removeDocs(ids); toast(`${ids.size} dokumen ditolak`, { type: 'warn' }); },
    });
  };

  const toggleOne = (id) => {
    setSelected(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };
  const toggleAll = () => {
    const visIds = visible.map(d => d.id);
    const allChecked = visIds.every(id => selected.has(id));
    if (allChecked) setSelected(prev => { const s = new Set(prev); visIds.forEach(id => s.delete(id)); return s; });
    else setSelected(prev => { const s = new Set(prev); visIds.forEach(id => s.add(id)); return s; });
  };
  const allChecked = visible.length > 0 && visible.every(d => selected.has(d.id));

  useKey((e) => {
    if (window.__overlay) return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
    if (e.key === 'j' || e.key === 'ArrowDown') { e.preventDefault(); setFocused(f => Math.min(visible.length - 1, f + 1)); }
    else if (e.key === 'k' || e.key === 'ArrowUp') { e.preventDefault(); setFocused(f => Math.max(0, f - 1)); }
    else if (e.key === 'x' || e.key === ' ') { e.preventDefault(); if (visible[focused]) toggleOne(visible[focused].id); }
    else if (e.key === 'Enter') { e.preventDefault(); if (visible[focused]) handleOpen(visible[focused]); }
    else if (e.key.toLowerCase() === 'a') { e.preventDefault(); if (visible[focused]) handleApprove(visible[focused]); }
    else if (e.key.toLowerCase() === 'r') { e.preventDefault(); if (visible[focused]) handleReject(visible[focused]); }
  });

  const totalPending   = docs.length;
  const totalUrgent    = docs.filter(d => d.aging >= 5 && d.aging <= 7).length;
  const totalCritical  = docs.filter(d => d.aging > 7).length;

  return (
    <div className="page scrollbar" style={{ overflow: 'auto' }}>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          {t('Antrean Persetujuan')}
          <span className="badge" style={{ marginLeft: 8, background: 'var(--primary)', color: '#fff' }}>
            {totalPending}
          </span>
        </h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <StatCard label="Total Pending"    value={totalPending}  color="var(--primary)" />
        <StatCard label="Urgent (>5 hr)"   value={totalUrgent}   color="var(--warn)"    />
        <StatCard label="Kritis (>7 hr)"   value={totalCritical} color="var(--danger)"  />
        <StatCard label="Disetujui Hari Ini" value={4}           color="var(--success)" />
      </div>

      {/* Tabs + Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        <div className="tabs" style={{ flex: '0 0 auto' }}>
          {[
            { key: 'all',      label: 'Semua' },
            { key: 'urgent',   label: `Urgent (>5 hr) ${totalUrgent}` },
            { key: 'critical', label: `Kritis (>7 hr) ${totalCritical}` },
          ].map(tb => (
            <button
              key={tb.key}
              className={`tab${tab === tb.key ? ' active' : ''}`}
              onClick={() => setTab(tb.key)}
            >{tb.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
          <select className="ti" value={filterMod} onChange={e => setFilterMod(e.target.value)} style={{ fontSize: 12, padding: '4px 8px' }}>
            <option value="all">Semua Modul</option>
            {ALL_MODULES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <select className="ti" value={filterUser} onChange={e => setFilterUser(e.target.value)} style={{ fontSize: 12, padding: '4px 8px' }}>
            <option value="all">Semua Pembuat</option>
            {ALL_USERS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 14px', marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--fg)' }}><strong>{selected.size}</strong> dokumen dipilih</span>
          <button className="btn sm" style={{ color: 'var(--success)', borderColor: 'var(--success)' }} onClick={handleBulkApprove}>
            <Icon name="check" size={11}/> Setujui Semua
          </button>
          <button className="btn sm danger" onClick={handleBulkReject}>
            <Icon name="x" size={11}/> Tolak Semua
          </button>
          <button className="btn sm ghost" onClick={() => setSelected(new Set())} style={{ marginLeft: 'auto' }}>Batal</button>
        </div>
      )}

      {/* Table */}
      {visible.length === 0 ? (
        <div className="cm-empty">
          <Icon name="check-circle" size={40}/>
          <div style={{ marginTop: 12, color: 'var(--fg-muted)' }}>Semua dokumen sudah diproses</div>
        </div>
      ) : (
        <table className="table" style={{ width: '100%', fontSize: 12 }}>
          <thead className="thead">
            <tr className="tr">
              <th className="th" style={{ width: 32 }}>
                <input type="checkbox" checked={allChecked} onChange={toggleAll}/>
              </th>
              <th className="th">No Dokumen</th>
              <th className="th">Modul</th>
              <th className="th">Pembuat</th>
              <th className="th">Tgl</th>
              <th className="th">Aging</th>
              <th className="th" style={{ textAlign: 'right' }}>Nilai</th>
              <th className="th" style={{ width: 120 }}>Aksi</th>
            </tr>
          </thead>
          <tbody className="tbody">
            {visible.map((doc, idx) => (
              <tr key={doc.id}
                className={`tr${selected.has(doc.id) ? ' selected' : ''}${idx === focused ? ' focused' : ''}`}
                onClick={() => setFocused(idx)}>
                <td className="td">
                  <input type="checkbox" checked={selected.has(doc.id)} onChange={() => toggleOne(doc.id)}/>
                </td>
                <td className="td" style={{ fontWeight: 600, color: 'var(--primary)', fontFamily: 'monospace' }}>
                  {doc.noDoc}
                </td>
                <td className="td">
                  <span className="badge">{doc.moduleLabel}</span>
                </td>
                <td className="td" style={{ color: 'var(--fg-muted)' }}>{doc.pembuat}</td>
                <td className="td muted">{doc.tgl}</td>
                <td className="td"><AgingBadge aging={doc.aging}/></td>
                <td className="td" style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {doc.nilai != null ? fmtIDR(doc.nilai) : <span className="muted">—</span>}
                </td>
                <td className="td">
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn sm" title="Setujui" style={{ color: 'var(--success)', padding: '2px 7px' }} onClick={() => handleApprove(doc)}>
                      <Icon name="check" size={11}/>
                    </button>
                    <button className="btn sm danger" title="Tolak" style={{ padding: '2px 7px' }} onClick={() => handleReject(doc)}>
                      <Icon name="x" size={11}/>
                    </button>
                    <button className="iconbtn" title="Buka" onClick={() => handleOpen(doc)}>
                      <Icon name="arrow-tr" size={11}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pager" style={{ marginTop: 8 }}>
        <span className="muted">Pintasan:</span>
        <span><Kbd>J</Kbd>/<Kbd>K</Kbd> navigasi</span>
        <span><Kbd>X</Kbd> pilih</span>
        <span><Kbd>↵</Kbd> buka</span>
        <span><Kbd>A</Kbd> setujui</span>
        <span><Kbd>R</Kbd> tolak</span>
      </div>
    </div>
  );
};

Object.assign(window, { ApprovalQueue });
