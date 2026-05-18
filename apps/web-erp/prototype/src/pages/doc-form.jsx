// Split: DOC_CFG config in doc-form-cfg.jsx. Component here.
const GUDANGS = ['GDG-01', 'GDG-02', 'GDG-03', 'GDG-04'];

const DocLineRow = ({ idx, l, cols, editing, setEditing, update, removeLine }) => {
  const isEd = (col) => editing && editing.rowId === l.id && editing.col === col;
  return (
    <tr>
      <td><div className="cell muted" style={{ fontFamily: 'Geist Mono, monospace' }}>{idx}</div></td>
      {cols.map(c => (
        <td key={c.k} className={isEd(c.k) ? 'editing' : ''}
          onClick={(e) => { e.stopPropagation(); setEditing({ rowId: l.id, col: c.k }); }}>
          <div className={`cell ${c.num ? 'num' : ''}`}>
            {isEd(c.k) ? (
              <input autoFocus defaultValue={l[c.k]}
                onBlur={(e) => {
                  update(l.id, c.k, c.num ? Number(e.target.value.replace(/[^0-9.-]/g, '')) : e.target.value);
                  setEditing(null);
                }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') e.target.blur(); }}/>
            ) : (
              c.num
                ? (Number(l[c.k]) !== 0 ? fmtIDR(l[c.k]) : <span className="muted">0</span>)
                : (l[c.k] || <span style={{ color: 'var(--fg-faint)' }}>—</span>)
            )}
          </div>
        </td>
      ))}
      <td onClick={(e) => e.stopPropagation()}>
        <button className="iconbtn" style={{ width: 26, height: 24, color: 'var(--fg-faint)' }}
          onClick={() => removeLine(l.id)}>
          <Icon name="x" size={11}/>
        </button>
      </td>
    </tr>
  );
};

const DocFormHeader = ({ cfg, form, setForm }) => {
  const firstCol = cfg.lineCols[0];
  const itemLabel = firstCol ? firstCol.h : 'Item';
  return (
    <div className="form-section">
      <div>
        <Field label="No. Dokumen">
          <input type="text" value={`${cfg.code}-2605-0001`} disabled/>
        </Field>
        <Field label="Tanggal" required>
          <input type="text" value={form.tanggal}
            onChange={e => setForm(f => ({ ...f, tanggal: e.target.value }))}/>
          <button className="lookup" tabIndex={-1}><Icon name="calendar" size={11}/></button>
        </Field>
        {cfg.party && (
          <Field label={cfg.party} required err={!form.party.trim()}>
            <input type="text" value={form.party} placeholder={`Nama ${cfg.party}...`}
              onChange={e => setForm(f => ({ ...f, party: e.target.value }))}/>
          </Field>
        )}
        <Field label="No. Referensi">
          <input type="text" value={form.refNo} placeholder="Ref. PO / SO / GR..."
            onChange={e => setForm(f => ({ ...f, refNo: e.target.value }))}/>
        </Field>
      </div>
      <div>
        {cfg.warehouse && (
          <Field label="Gudang" required>
            <select value={form.gudang} onChange={e => setForm(f => ({ ...f, gudang: e.target.value }))}>
              {GUDANGS.map(g => <option key={g}>{g}</option>)}
            </select>
          </Field>
        )}
        {cfg.dari && (
          <Field label="Dari Gudang" required>
            <select value={form.dari} onChange={e => setForm(f => ({ ...f, dari: e.target.value }))}>
              {GUDANGS.map(g => <option key={g}>{g}</option>)}
            </select>
          </Field>
        )}
        {cfg.ke && (
          <Field label="Ke Gudang" required>
            <select value={form.ke} onChange={e => setForm(f => ({ ...f, ke: e.target.value }))}>
              {GUDANGS.filter(g => g !== form.dari).map(g => <option key={g}>{g}</option>)}
            </select>
          </Field>
        )}
        <Field label="Catatan">
          <textarea rows={2} value={form.catatan} placeholder="Catatan tambahan..."
            onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))}
            style={{ resize: 'vertical', minHeight: 48 }}/>
        </Field>
      </div>
      <div>
        <Field label="Status" required>
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            {window.STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <div style={{ marginTop: 8, padding: 10, background: 'var(--panel-2)', borderRadius: 6, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
            {cfg.group} · {cfg.label}
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
            Kode: <span style={{ fontFamily: 'Geist Mono, monospace', color: 'var(--fg)' }}>{cfg.code}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const DocFormLines = ({ cfg, lines, editing, setEditing, update, removeLine, addLine }) => {
  const numCols = cfg.lineCols.filter(c => c.num);
  const totals = numCols.reduce((acc, c) => {
    acc[c.k] = lines.reduce((s, l) => s + Number(l[c.k] || 0), 0);
    return acc;
  }, {});
  const hasTotals = numCols.length > 0;

  return (
    <div className="lines scrollbar">
      <table>
        <thead>
          <tr>
            <th style={{ width: 30 }}>#</th>
            {cfg.lineCols.map(c => (
              <th key={c.k} className={c.num ? 'num' : ''} style={{ width: c.w }}>{c.h}</th>
            ))}
            <th style={{ width: 32 }}/>
          </tr>
        </thead>
        <tbody>
          {lines.map((l, i) => (
            <DocLineRow key={l.id} idx={i + 1} l={l} cols={cfg.lineCols}
              editing={editing} setEditing={setEditing} update={update} removeLine={removeLine}/>
          ))}
          <tr className="adder" onClick={(e) => { e.stopPropagation(); addLine(); }}>
            <td><div className="cell">{lines.length + 1}</div></td>
            <td colSpan={cfg.lineCols.length + 1}>
              <div className="cell" style={{ cursor: 'pointer' }}>
                <Icon name="plus" size={11}/>&nbsp; Klik di sini atau tekan <Kbd>+</Kbd> untuk menambah baris...
              </div>
            </td>
          </tr>
        </tbody>
        {hasTotals && (
          <tfoot>
            <tr>
              <td colSpan={cfg.lineCols.filter(c => !c.num).length + 1}
                style={{ textAlign: 'right', paddingRight: 12 }}>Total</td>
              {cfg.lineCols.map(c => c.num
                ? <td key={c.k} className="num">{fmtIDR(totals[c.k])}</td>
                : null
              )}
              <td/>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

const DocForm = ({ moduleId, t, onNavigate, lang }) => {
  const cfg = window.DOC_CFG[moduleId] || window.DOC_CFG['inv-opname'];
  const docNo = `${cfg.code}-2605-0001`;

  const [form, setForm] = React.useState({
    tanggal: window.todayStr || '18/05/2026',
    party: '',
    refNo: '',
    catatan: '',
    gudang: GUDANGS[0],
    dari: GUDANGS[0],
    ke: GUDANGS[1],
    status: window.STATUSES ? window.STATUSES[0] : 'Draft',
  });
  const [lines, setLines] = React.useState(() => cfg.seedLines.map(s => ({ ...s })));
  const [editing, setEditing] = React.useState(null);
  const [tab, setTab] = React.useState('detail');

  const addLine = () => {
    const id = (lines[lines.length - 1]?.id || 0) + 1;
    const blank = cfg.lineCols.reduce((o, c) => { o[c.k] = c.num ? 0 : ''; return o; }, { id });
    setLines(prev => [...prev, blank]);
    setTimeout(() => setEditing({ rowId: id, col: cfg.lineCols[0].k }), 10);
  };
  const removeLine = (id) => setLines(prev => prev.filter(l => l.id !== id));
  const update = (id, col, v) => setLines(prev => prev.map(l => l.id === id ? { ...l, [col]: v } : l));

  const resetForm = () => {
    setLines(cfg.seedLines.map(s => ({ ...s })));
    setForm(f => ({ ...f, party: '', refNo: '', catatan: '' }));
    window.toast('Form direset', { type: 'info' });
  };

  const save = (andNew) => {
    if (cfg.party && !form.party.trim()) {
      window.toast(`${cfg.party} wajib diisi.`, { type: 'danger' });
      return;
    }
    window.toast(`${cfg.label} baru tersimpan`, { type: 'success', sub: docNo });
    if (andNew) {
      setLines(cfg.seedLines.map(s => ({ ...s })));
      setForm(f => ({ ...f, party: '', refNo: '', catatan: '' }));
    } else {
      onNavigate(moduleId);
    }
  };

  useKey((e) => {
    if (window.__overlay) return;
    if (e.key === 'Escape' && !editing && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName))
      onNavigate(moduleId);
    if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); save(e.shiftKey); }
    if (e.key === '+' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
      e.preventDefault(); addLine();
    }
  });

  return (
    <div className="page" onClick={() => setEditing(null)}>
      <div className="page-header">
        <button className="iconbtn" onClick={() => onNavigate(moduleId)}>
          <Icon name="arrowleft" size={14}/>
        </button>
        <h1 className="page-title">
          {cfg.label}
          <span className="code-tag">{cfg.code} · Baru</span>
        </h1>
        <span className="pill warn" style={{ marginLeft: 8 }}>
          <span className="dot"/>Draft
        </span>
        <div className="page-actions">
          <button className="btn ghost" onClick={() => onNavigate(moduleId)}>Batal <Kbd>ESC</Kbd></button>
          <button className="btn" onClick={resetForm}><Icon name="refresh" size={12}/> Reset</button>
          <button className="btn primary" onClick={() => save(false)}>
            <Icon name="save" size={12}/> Simpan <Kbd>⌘S</Kbd>
          </button>
          <div className="btn-split">
            <button className="btn" onClick={() => save(true)}>
              <Icon name="plus" size={12}/> Simpan & Baru
            </button>
            <button className="btn"><Icon name="chevdown" size={12}/></button>
          </div>
        </div>
      </div>

      <DocFormHeader cfg={cfg} form={form} setForm={setForm}/>

      <div className="tabs">
        <button className={`tab ${tab === 'detail' ? 'active' : ''}`} onClick={() => setTab('detail')}>
          Baris <span className="muted">{lines.length}</span>
        </button>
        <button className={`tab ${tab === 'info' ? 'active' : ''}`} onClick={() => setTab('info')}>Info</button>
        <button className={`tab ${tab === 'audit' ? 'active' : ''}`} onClick={() => setTab('audit')}>Audit Trail</button>
        <div style={{ flex: 1 }}/>
        <div style={{ alignSelf: 'center', padding: '0 6px' }}>
          <button className="btn primary sm" onClick={(e) => { e.stopPropagation(); addLine(); }}>
            <Icon name="plus" size={11}/> Tambah Baris <Kbd>+</Kbd>
          </button>
        </div>
      </div>

      {tab === 'detail' && (
        <DocFormLines cfg={cfg} lines={lines} editing={editing} setEditing={setEditing}
          update={update} removeLine={removeLine} addLine={addLine}/>
      )}
      {tab === 'info' && (
        <div style={{ padding: 16, fontSize: 12.5, color: 'var(--fg-muted)', background: 'var(--panel)', flex: 1 }}>
          Informasi tambahan, lampiran dokumen, dan referensi untuk {cfg.label}.
        </div>
      )}
      {tab === 'audit' && (
        <div style={{ padding: 16, background: 'var(--panel)', flex: 1, fontSize: 12.5 }}>
          {window.ACTIVITY.slice(0, 5).map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
              <span className="muted" style={{ fontFamily: 'Geist Mono, monospace', minWidth: 80 }}>
                {window.todayStr} {a.ts}
              </span>
              <span><strong>{a.who}</strong> {a.what} <span style={{ fontFamily: 'Geist Mono, monospace' }}>{a.target}</span></span>
            </div>
          ))}
        </div>
      )}

      <div className="pager">
        <span className="muted">{cfg.group} · {cfg.label}</span>
        <div style={{ flex: 1 }}/>
        <span><Kbd>⌘S</Kbd> simpan</span>
        <span><Kbd>⌘⇧S</Kbd> simpan & baru</span>
        <span><Kbd>+</Kbd> tambah baris</span>
        <span><Kbd>ESC</Kbd> batal</span>
        <div style={{ flex: 1 }}/>
        <span className="muted">Terakhir disimpan: belum disimpan</span>
      </div>
    </div>
  );
};

window.DocForm = DocForm;
window.DOC_CFG = window.DOC_CFG || {};
