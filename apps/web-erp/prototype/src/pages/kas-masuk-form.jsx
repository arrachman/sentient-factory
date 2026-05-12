// Kas Masuk — form (input transaksi)
const KasMasukForm = ({ t, onNavigate, lang }) => {
  const [head, setHead] = React.useState({
    terimaDari: '', akunKas: '110101.101 - Cash (IDR)', uraian: '',
    lokasi: 'T - FG', tanggal: '12/05/2026', noTransaksi: 'Auto',
    auto: true, uang: 'IDR', kurs: '1,00', status: 'Need Approve',
  });
  const [tab, setTab] = React.useState('detail');
  const [lines, setLines] = React.useState([
    { id: 1, no: '410101.101', nama: 'Penjualan Barang Jadi', total: 4250000, catatan: 'INV-2026-1024', cc: 'PCI-SALES', proyek: '—' },
    { id: 2, no: '210105.001', nama: 'PPN Keluaran', total: 467500, catatan: '', cc: 'PCI-SALES', proyek: '—' },
  ]);
  const [editing, setEditing] = React.useState(null); // {rowId, col}
  const [coaQuery, setCoaQuery] = React.useState('');
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [contact, setContact] = React.useState(null);

  const total = lines.reduce((s, l) => s + (Number(l.total) || 0), 0);

  const required = head.terimaDari.trim();
  const headerErr = !required;

  const addLine = () => {
    const id = (lines[lines.length - 1]?.id || 0) + 1;
    setLines([...lines, { id, no: '', nama: '', total: 0, catatan: '', cc: '', proyek: '' }]);
    setTimeout(() => setEditing({ rowId: id, col: 'no' }), 10);
  };
  const removeLine = (id) => setLines(lines.filter(l => l.id !== id));
  const update = (id, col, v) => setLines(lines.map(l => l.id === id ? { ...l, [col]: v } : l));

  // Keyboard shortcuts: Ctrl+S save, Esc back, Ctrl+Enter save & new
  useKey((e) => {
    if (e.key === 'Escape' && !editing && !['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) {
      onNavigate('kas-masuk');
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); onNavigate('kas-masuk'); }
  });

  const crumbs = [
    { label: t('Keuangan') },
    { label: t('Kas Masuk'), onClick: () => onNavigate('kas-masuk') },
    { label: 'Baru' },
  ];

  React.useEffect(() => { window.__setCrumbs && window.__setCrumbs(crumbs); }, [lang]);

  return (
    <div className="page" onClick={() => setEditing(null)}>
      <div className="page-header">
        <button className="iconbtn" onClick={() => onNavigate('kas-masuk')}><Icon name="arrowleft" size={14}/></button>
        <h1 className="page-title">{t('Kas Masuk')}<span className="code-tag">CR · Baru</span></h1>
        <span className="pill warn" style={{marginLeft: 8}}><span className="dot"></span>Draft baru</span>
        <div className="page-actions">
          <button className="btn ghost" onClick={() => onNavigate('kas-masuk')}>Batal <Kbd>ESC</Kbd></button>
          <button className="btn"><Icon name="file" size={12}/> {t('Dokumen')}</button>
          <button className="btn"><Icon name="refresh" size={12}/> {t('Reset')}</button>
          <button className="btn primary" onClick={() => onNavigate('kas-masuk')}><Icon name="save" size={12}/> {t('Simpan')} <Kbd>⌘S</Kbd></button>
          <div className="btn-split">
            <button className="btn"><Icon name="plus" size={12}/> {t('Simpan & Baru')}</button>
            <button className="btn"><Icon name="chevdown" size={12}/></button>
          </div>
        </div>
      </div>

      {/* Header form */}
      <div className="form-section">
        <div>
          <Field label={t('Terima Dari')} required err={headerErr} help={headerErr ? 'Wajib diisi · klik untuk cari kontak' : (contact ? `${contact.code} · ${contact.cat}` : null)}>
            <input type="text" value={head.terimaDari} placeholder="Klik untuk cari kontak..." readOnly
              onFocus={(e) => { e.stopPropagation(); setPickerOpen(true); }}
              onClick={(e) => { e.stopPropagation(); setPickerOpen(true); }}/>
            <button className="lookup" tabIndex={-1} onClick={(e) => { e.stopPropagation(); setPickerOpen(true); }}><Icon name="search" size={11}/></button>
          </Field>
          <Field label={t('Akun Kas')} required help="D · Kode 110101.101">
            <input type="text" value={head.akunKas} onChange={e => setHead({...head, akunKas: e.target.value})}/>
            <button className="lookup" tabIndex={-1}><Icon name="search" size={11}/></button>
          </Field>
          <Field label={t('Uraian')}>
            <input type="text" value={head.uraian} placeholder="cth: Pelunasan INV-2026-1024"
              onChange={e => setHead({...head, uraian: e.target.value})}/>
          </Field>
          <Field label={t('Lokasi')}>
            <input type="text" value={head.lokasi} onChange={e => setHead({...head, lokasi: e.target.value})}/>
            <button className="lookup" tabIndex={-1}><Icon name="search" size={11}/></button>
          </Field>
        </div>
        <div>
          <Field label={t('Tanggal')} required>
            <input type="text" value={head.tanggal} onChange={e => setHead({...head, tanggal: e.target.value})}/>
            <button className="lookup" tabIndex={-1}><Icon name="calendar" size={11}/></button>
          </Field>
          <Field label={t('No Transaksi')} required>
            <input type="text" value={head.auto ? 'Auto · CR-2605-2399' : head.noTransaksi}
              disabled={head.auto}
              onChange={e => setHead({...head, noTransaksi: e.target.value})}/>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, position: 'absolute', right: 8, fontSize: 11.5, color: 'var(--fg-muted)' }}>
              <input type="checkbox" className="checkbox" checked={head.auto} onChange={e => setHead({...head, auto: e.target.checked})}/>
              Auto
            </label>
          </Field>
          <Field label={t('Uang')} required>
            <select value={head.uang} onChange={e => setHead({...head, uang: e.target.value})}>
              <option>IDR</option><option>USD</option><option>SGD</option><option>EUR</option>
            </select>
          </Field>
          <Field label={t('Kurs')} required>
            <input type="text" value={head.kurs} onChange={e => setHead({...head, kurs: e.target.value})} style={{ textAlign: 'right', fontFamily: 'Geist Mono, monospace' }}/>
          </Field>
        </div>
        <div>
          <Field label={t('Status')} required>
            <select value={head.status} onChange={e => setHead({...head, status: e.target.value})}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <div style={{ marginTop: 8, padding: 10, background: 'var(--panel-2)', borderRadius: 6, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Ringkasan</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '2px 0' }}>
              <span className="muted">Sub-total</span>
              <span className="mono" style={{ fontFamily: 'Geist Mono, monospace', fontVariantNumeric: 'tabular-nums' }}>{fmtIDR(total)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '2px 0' }}>
              <span className="muted">Pajak (otomatis)</span>
              <span className="mono muted" style={{ fontFamily: 'Geist Mono, monospace' }}>0,00</span>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', marginTop: 4, paddingTop: 4, display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600 }}>
              <span>Total {head.uang}</span>
              <span className="mono" style={{ fontFamily: 'Geist Mono, monospace', fontVariantNumeric: 'tabular-nums', color: 'var(--primary-soft-fg)' }}>{fmtIDR(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${tab === 'detail' ? 'active' : ''}`} onClick={() => setTab('detail')}>
          {t('Detail')} <span className="muted">{lines.length}</span>
        </button>
        <button className={`tab ${tab === 'info' ? 'active' : ''}`} onClick={() => setTab('info')}>
          {t('Info')}
        </button>
        <button className={`tab ${tab === 'audit' ? 'active' : ''}`} onClick={() => setTab('audit')}>
          Audit Trail
        </button>
        <div style={{ flex: 1 }}/>
        <div style={{ alignSelf: 'center', display: 'flex', alignItems: 'center', gap: 8, padding: '0 6px' }}>
          <span className="muted" style={{ fontSize: 11.5 }}>{t('Pencarian CoA')}</span>
          <div className="search-input" style={{ width: 240, height: 24 }}>
            <Icon name="search" size={11}/>
            <input value={coaQuery} onChange={e => setCoaQuery(e.target.value)} placeholder="Kode atau nama akun"/>
          </div>
          <button className="btn primary sm" onClick={(e) => { e.stopPropagation(); addLine(); }}>
            <Icon name="plus" size={11}/> Tambah Baris <Kbd>+</Kbd>
          </button>
        </div>
      </div>

      {tab === 'detail' && (
        <div className="lines scrollbar">
          <table>
            <thead>
              <tr>
                <th style={{ width: 30 }}>#</th>
                <th style={{ width: 140 }}>{t('No Akun')}</th>
                <th>{t('Nama Akun')}</th>
                <th className="num" style={{ width: 140 }}>{t('Total')}</th>
                <th className="num" style={{ width: 110 }}>{t('Total Valas')}</th>
                <th style={{ width: 200 }}>{t('Catatan')}</th>
                <th style={{ width: 120 }}>{t('Cost Center')}</th>
                <th style={{ width: 100 }}>{t('Proyek')}</th>
                <th style={{ width: 32 }}/>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <LineRow key={l.id} idx={i+1} l={l} editing={editing} setEditing={setEditing}
                  update={update} removeLine={removeLine}/>
              ))}
              <tr className="adder" onClick={(e) => { e.stopPropagation(); addLine(); }}>
                <td><div className="cell">{lines.length + 1}</div></td>
                <td colSpan={8}>
                  <div className="cell" style={{ cursor: 'pointer' }}>
                    <Icon name="plus" size={11}/>&nbsp; Klik di sini atau tekan <Kbd>+</Kbd> untuk menambah baris...
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{ textAlign: 'right', paddingRight: 12 }}>{t('Total')} {head.uang}</td>
                <td className="num">{fmtIDR(total)}</td>
                <td className="num muted">{fmtIDR(total)}</td>
                <td colSpan={4}/>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
      {tab === 'info' && (
        <div style={{ padding: 16, fontSize: 12.5, color: 'var(--fg-muted)', background: 'var(--panel)', flex: 1 }}>
          Informasi tambahan, lampiran dokumen, dan referensi transaksi terkait.
        </div>
      )}
      {tab === 'audit' && (
        <div style={{ padding: 16, background: 'var(--panel)', flex: 1, fontSize: 12.5 }}>
          {ACTIVITY.slice(0, 5).map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
              <span className="mono muted" style={{ fontFamily: 'Geist Mono, monospace', minWidth: 80 }}>{todayStr} {a.ts}</span>
              <span><strong>{a.who}</strong> {a.what} <span className="mono" style={{ fontFamily: 'Geist Mono, monospace' }}>{a.target}</span></span>
            </div>
          ))}
        </div>
      )}

      <ContactPicker open={pickerOpen} onClose={() => setPickerOpen(false)}
        onSelect={(c) => { setContact(c); setHead(h => ({ ...h, terimaDari: c.name })); }}
        t={t}/>

      <div className="pager">
        <span className="muted">Pintasan:</span>
        <span><Kbd>⌘S</Kbd> simpan</span>
        <span><Kbd>⌘↵</Kbd> simpan & baru</span>
        <span><Kbd>+</Kbd> tambah baris</span>
        <span><Kbd>Tab</Kbd> kolom berikutnya</span>
        <span><Kbd>ESC</Kbd> batal</span>
        <div style={{ flex: 1 }}/>
        <span className="muted">Terakhir disimpan: belum disimpan</span>
      </div>
    </div>
  );
};

const Field = ({ label, required, err, help, children }) => (
  <div className={`field ${err ? 'err' : ''}`}>
    <label>{required && <span className="req">*</span>}{label}</label>
    <div className="ctrl">{children}</div>
    {help && <div className="help">{help}</div>}
  </div>
);

const LineRow = ({ idx, l, editing, setEditing, update, removeLine }) => {
  const isEd = (col) => editing && editing.rowId === l.id && editing.col === col;
  const Cell = ({ col, value, isNum, width }) => (
    <td className={isEd(col) ? 'editing' : ''} onClick={(e) => { e.stopPropagation(); setEditing({ rowId: l.id, col }); }}>
      <div className={`cell ${isNum ? 'num' : ''}`} style={width ? { width } : null}>
        {isEd(col) ? (
          <input
            autoFocus
            defaultValue={value}
            onBlur={(e) => { update(l.id, col, isNum ? Number(e.target.value.replace(/[^0-9.-]/g,'')) : e.target.value); setEditing(null); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') { e.target.blur(); } }}
          />
        ) : (
          isNum ? (Number(value) ? fmtIDR(value) : <span className="muted">0,00</span>) : (value || <span style={{ color: 'var(--fg-faint)' }}>—</span>)
        )}
      </div>
    </td>
  );
  return (
    <tr>
      <td><div className="cell muted" style={{ fontFamily: 'Geist Mono, monospace' }}>{idx}</div></td>
      <Cell col="no" value={l.no}/>
      <Cell col="nama" value={l.nama}/>
      <Cell col="total" value={l.total} isNum/>
      <td><div className="cell num muted" style={{ fontFamily: 'Geist Mono, monospace', fontVariantNumeric: 'tabular-nums' }}>{fmtIDR(l.total)}</div></td>
      <Cell col="catatan" value={l.catatan}/>
      <Cell col="cc" value={l.cc}/>
      <Cell col="proyek" value={l.proyek}/>
      <td onClick={(e) => e.stopPropagation()}>
        <button className="iconbtn" style={{ width: 26, height: 24, color: 'var(--fg-faint)' }} onClick={() => removeLine(l.id)}>
          <Icon name="x" size={11}/>
        </button>
      </td>
    </tr>
  );
};

window.KasMasukForm = KasMasukForm;
