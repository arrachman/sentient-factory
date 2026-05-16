// Generic transaction form — drives "Tambah" for every Keuangan transaksi.
// Adapts party label, account, sign, journal/giro behaviour per module.
const TRX_CFG = {
  'kas-masuk':         { label: 'Kas Masuk', code: 'CR', party: 'Terima Dari', acct: 'Akun Kas', acctVal: '110101.101 - Cash (IDR)', contact: true },
  'kas-keluar':        { label: 'Kas Keluar', code: 'CD', party: 'Bayar Ke', acct: 'Akun Kas', acctVal: '110101.101 - Cash (IDR)', contact: true },
  'bank-masuk':        { label: 'Bank Masuk', code: 'RM', party: 'Terima Dari', acct: 'Akun Bank', acctVal: '110102.001 - Bank BCA Operasional', contact: true },
  'bank-keluar':       { label: 'Bank Keluar', code: 'SM', party: 'Bayar Ke', acct: 'Akun Bank', acctVal: '110102.001 - Bank BCA Operasional', contact: true },
  'jurnal-umum':       { label: 'Jurnal Umum', code: 'GJ', party: null, acct: null, journal: true },
  'giro-masuk':        { label: 'Giro Masuk', code: 'RG', party: 'Terima Dari', acct: 'Akun Giro', acctVal: '110103.001 - Giro/Cek Diterima', contact: true, giro: true },
  'giro-keluar':       { label: 'Giro Keluar', code: 'SG', party: 'Bayar Ke', acct: 'Akun Giro', acctVal: '210103.001 - Giro/Cek Dikeluarkan', contact: true, giro: true },
  'giro-masuk-batal':  { label: 'Giro Masuk Batal', code: 'RGC', party: 'Terima Dari', acct: 'Akun Giro', acctVal: '110103.001 - Giro/Cek Diterima', contact: true, giro: true, cancel: true },
  'giro-keluar-batal': { label: 'Giro Keluar Batal', code: 'SGC', party: 'Bayar Ke', acct: 'Akun Giro', acctVal: '210103.001 - Giro/Cek Dikeluarkan', contact: true, giro: true, cancel: true },
  'saldo-awal':        { label: 'Saldo Awal Coa', code: 'CB', party: null, acct: 'Periode', acctVal: 'Mei 2026', opening: true },
};

const Field = ({ label, required, err, help, children }) => (
  <div className={`field ${err ? 'err' : ''}`}>
    <label>{required && <span className="req">*</span>}{label}</label>
    <div className="ctrl">{children}</div>
    {help && <div className="help">{help}</div>}
  </div>
);

const TrxLineRow = ({ idx, l, cols, editing, setEditing, update, removeLine }) => {
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
                onBlur={(e) => { update(l.id, c.k, c.num ? Number(e.target.value.replace(/[^0-9.-]/g, '')) : e.target.value); setEditing(null); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') e.target.blur(); }}/>
            ) : (
              c.num ? (Number(l[c.k]) ? fmtIDR(l[c.k]) : <span className="muted">0,00</span>)
                    : (l[c.k] || <span style={{ color: 'var(--fg-faint)' }}>—</span>)
            )}
          </div>
        </td>
      ))}
      <td onClick={(e) => e.stopPropagation()}>
        <button className="iconbtn" style={{ width: 26, height: 24, color: 'var(--fg-faint)' }} onClick={() => removeLine(l.id)}>
          <Icon name="x" size={11}/>
        </button>
      </td>
    </tr>
  );
};

const TrxForm = ({ moduleId, t, onNavigate, lang }) => {
  const cfg = TRX_CFG[moduleId] || TRX_CFG['kas-masuk'];
  const backTo = moduleId;

  const lineCols = cfg.journal
    ? [{ k: 'no', h: t('No Akun'), w: 130 }, { k: 'nama', h: t('Nama Akun') }, { k: 'debit', h: 'Debit', w: 130, num: true }, { k: 'kredit', h: 'Kredit', w: 130, num: true }, { k: 'catatan', h: t('Catatan'), w: 170 }, { k: 'cc', h: t('Cost Center'), w: 110 }]
    : [{ k: 'no', h: t('No Akun'), w: 130 }, { k: 'nama', h: t('Nama Akun') }, { k: 'total', h: t('Total'), w: 140, num: true }, { k: 'catatan', h: t('Catatan'), w: 180 }, { k: 'cc', h: t('Cost Center'), w: 120 }, { k: 'proyek', h: t('Proyek'), w: 100 }];

  const seed = cfg.journal
    ? [{ id: 1, no: '110101.101', nama: 'Kas Besar', debit: 5000000, kredit: 0, catatan: 'Koreksi saldo', cc: 'ADM' },
       { id: 2, no: '410101.101', nama: 'Pendapatan Lain-lain', debit: 0, kredit: 5000000, catatan: '', cc: 'ADM' }]
    : [{ id: 1, no: '410101.101', nama: 'Penjualan Barang Jadi', total: 4250000, catatan: 'INV-2026-1024', cc: 'PCI-SALES', proyek: '—' },
       { id: 2, no: '210105.001', nama: 'PPN Keluaran', total: 467500, catatan: '', cc: 'PCI-SALES', proyek: '—' }];

  const [head, setHead] = React.useState({
    party: '', akun: cfg.acctVal || '', uraian: '', lokasi: 'T - FG',
    tanggal: window.todayStr, auto: true, uang: 'IDR', kurs: '1,00',
    status: 'Need Approve', noGiro: '', jatuhTempo: '20/06/2026',
  });
  const [tab, setTab] = React.useState('detail');
  const [lines, setLines] = React.useState(seed);
  const [editing, setEditing] = React.useState(null);
  const [coaQuery, setCoaQuery] = React.useState('');
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [contact, setContact] = React.useState(null);

  const total = lines.reduce((s, l) => s + (cfg.journal ? Number(l.debit || 0) : Number(l.total || 0)), 0);
  const totalKredit = cfg.journal ? lines.reduce((s, l) => s + Number(l.kredit || 0), 0) : 0;
  const balanced = !cfg.journal || total === totalKredit;
  const headerErr = cfg.party ? !head.party.trim() : false;

  const addLine = () => {
    const id = (lines[lines.length - 1]?.id || 0) + 1;
    const blank = cfg.journal
      ? { id, no: '', nama: '', debit: 0, kredit: 0, catatan: '', cc: '' }
      : { id, no: '', nama: '', total: 0, catatan: '', cc: '', proyek: '' };
    setLines([...lines, blank]);
    setTimeout(() => setEditing({ rowId: id, col: 'no' }), 10);
  };
  const removeLine = (id) => setLines(lines.filter(l => l.id !== id));
  const update = (id, col, v) => setLines(lines.map(l => l.id === id ? { ...l, [col]: v } : l));

  const save = (andNew) => {
    if (headerErr) { window.toast(`${cfg.party} wajib diisi.`, { type: 'danger' }); return; }
    if (!balanced) { window.toast('Jurnal belum balance — Debit ≠ Kredit.', { type: 'danger' }); return; }
    window.toast(`${t(cfg.label)} tersimpan`, { type: 'success', sub: `${cfg.code}-2605-${2400} · ${head.status}` });
    if (andNew) {
      setHead(h => ({ ...h, party: '', uraian: '' }));
      setLines(seed.map(s => ({ ...s })));
      setContact(null);
    } else {
      onNavigate(backTo);
    }
  };

  useKey((e) => {
    if (window.__overlay || pickerOpen) return;
    if (e.key === 'Escape' && !editing && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) onNavigate(backTo);
    if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); save(e.shiftKey); }
    if (e.key === '+' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) { e.preventDefault(); addLine(); }
  });

  return (
    <div className="page" onClick={() => setEditing(null)}>
      <div className="page-header">
        <button className="iconbtn" onClick={() => onNavigate(backTo)}><Icon name="arrowleft" size={14}/></button>
        <h1 className="page-title">{t(cfg.label)}<span className="code-tag">{cfg.code} · Baru</span></h1>
        <span className="pill warn" style={{ marginLeft: 8 }}><span className="dot"></span>Draft baru</span>
        <div className="page-actions">
          <button className="btn ghost" onClick={() => onNavigate(backTo)}>Batal <Kbd>ESC</Kbd></button>
          <button className="btn"><Icon name="file" size={12}/> {t('Dokumen')}</button>
          <button className="btn" onClick={() => { setLines(seed.map(s => ({ ...s }))); setHead(h => ({ ...h, party: '', uraian: '' })); setContact(null); window.toast('Form direset', { type: 'info' }); }}>
            <Icon name="refresh" size={12}/> {t('Reset')}
          </button>
          <button className="btn primary" onClick={() => save(false)}><Icon name="save" size={12}/> {t('Simpan')} <Kbd>⌘S</Kbd></button>
          <div className="btn-split">
            <button className="btn" onClick={() => save(true)}><Icon name="plus" size={12}/> {t('Simpan & Baru')}</button>
            <button className="btn"><Icon name="chevdown" size={12}/></button>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div>
          {cfg.party ? (
            <Field label={t(cfg.party)} required err={headerErr}
              help={headerErr ? 'Wajib diisi · klik untuk cari kontak' : (contact ? `${contact.code} · ${contact.cat}` : null)}>
              <input type="text" value={head.party} placeholder="Klik untuk cari kontak..." readOnly
                onClick={(e) => { e.stopPropagation(); setPickerOpen(true); }}
                onFocus={(e) => { e.stopPropagation(); setPickerOpen(true); }}/>
              <button className="lookup" tabIndex={-1} onClick={(e) => { e.stopPropagation(); setPickerOpen(true); }}><Icon name="search" size={11}/></button>
            </Field>
          ) : (
            <Field label={t('Uraian')} required err={false} help="Keterangan jurnal">
              <input type="text" value={head.uraian} placeholder="cth: Penyesuaian akhir bulan"
                onChange={e => setHead({ ...head, uraian: e.target.value })}/>
            </Field>
          )}
          {cfg.acct && (
            <Field label={t(cfg.acct)} required>
              <input type="text" value={head.akun} onChange={e => setHead({ ...head, akun: e.target.value })}/>
              {!cfg.opening && <button className="lookup" tabIndex={-1}><Icon name="search" size={11}/></button>}
            </Field>
          )}
          {cfg.party && (
            <Field label={t('Uraian')}>
              <input type="text" value={head.uraian} placeholder="cth: Pelunasan INV-2026-1024"
                onChange={e => setHead({ ...head, uraian: e.target.value })}/>
            </Field>
          )}
          <Field label={t('Lokasi')}>
            <input type="text" value={head.lokasi} onChange={e => setHead({ ...head, lokasi: e.target.value })}/>
            <button className="lookup" tabIndex={-1}><Icon name="search" size={11}/></button>
          </Field>
        </div>
        <div>
          <Field label={t('Tanggal')} required>
            <input type="text" value={head.tanggal} onChange={e => setHead({ ...head, tanggal: e.target.value })}/>
            <button className="lookup" tabIndex={-1}><Icon name="calendar" size={11}/></button>
          </Field>
          <Field label={t('No Transaksi')} required>
            <input type="text" value={head.auto ? `Auto · ${cfg.code}-2605-2399` : head.noTransaksi || ''}
              disabled={head.auto} onChange={e => setHead({ ...head, noTransaksi: e.target.value })}/>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, position: 'absolute', right: 8, fontSize: 11.5, color: 'var(--fg-muted)' }}>
              <input type="checkbox" className="checkbox" checked={head.auto} onChange={e => setHead({ ...head, auto: e.target.checked })}/>
              Auto
            </label>
          </Field>
          {cfg.giro && (
            <Field label="No Giro / Cek" required>
              <input type="text" value={head.noGiro} placeholder="cth: BCA-0048213"
                onChange={e => setHead({ ...head, noGiro: e.target.value })}/>
            </Field>
          )}
          {cfg.giro ? (
            <Field label="Jatuh Tempo" required>
              <input type="text" value={head.jatuhTempo} onChange={e => setHead({ ...head, jatuhTempo: e.target.value })}/>
              <button className="lookup" tabIndex={-1}><Icon name="calendar" size={11}/></button>
            </Field>
          ) : (
            <Field label={t('Uang')} required>
              <select value={head.uang} onChange={e => setHead({ ...head, uang: e.target.value })}>
                <option>IDR</option><option>USD</option><option>SGD</option><option>EUR</option>
              </select>
            </Field>
          )}
          <Field label={t('Kurs')} required>
            <input type="text" value={head.kurs} onChange={e => setHead({ ...head, kurs: e.target.value })}
              style={{ textAlign: 'right', fontFamily: 'Geist Mono, monospace' }}/>
          </Field>
        </div>
        <div>
          <Field label={t('Status')} required>
            <select value={head.status} onChange={e => setHead({ ...head, status: e.target.value })}>
              {window.STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <div style={{ marginTop: 8, padding: 10, background: 'var(--panel-2)', borderRadius: 6, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Ringkasan</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '2px 0' }}>
              <span className="muted">{cfg.journal ? 'Total Debit' : 'Sub-total'}</span>
              <span style={{ fontFamily: 'Geist Mono, monospace', fontVariantNumeric: 'tabular-nums' }}>{fmtIDR(total)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '2px 0' }}>
              <span className="muted">{cfg.journal ? 'Total Kredit' : 'Pajak (otomatis)'}</span>
              <span className="muted" style={{ fontFamily: 'Geist Mono, monospace' }}>{cfg.journal ? fmtIDR(totalKredit) : '0,00'}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', marginTop: 4, paddingTop: 4, display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600 }}>
              <span>{cfg.journal ? 'Selisih' : `Total ${head.uang}`}</span>
              <span style={{ fontFamily: 'Geist Mono, monospace', fontVariantNumeric: 'tabular-nums', color: balanced ? 'var(--primary-soft-fg)' : 'var(--danger)' }}>
                {cfg.journal ? fmtIDR(total - totalKredit) : fmtIDR(total)}
              </span>
            </div>
            {cfg.journal && (
              <div style={{ marginTop: 6 }}>
                <span className={`pill ${balanced ? 'success' : 'danger'}`}><span className="dot"></span>{balanced ? 'Balance' : 'Tidak balance'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'detail' ? 'active' : ''}`} onClick={() => setTab('detail')}>{t('Detail')} <span className="muted">{lines.length}</span></button>
        <button className={`tab ${tab === 'info' ? 'active' : ''}`} onClick={() => setTab('info')}>{t('Info')}</button>
        <button className={`tab ${tab === 'audit' ? 'active' : ''}`} onClick={() => setTab('audit')}>Audit Trail</button>
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
                {lineCols.map(c => <th key={c.k} className={c.num ? 'num' : ''} style={{ width: c.w }}>{c.h}</th>)}
                <th style={{ width: 32 }}/>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <TrxLineRow key={l.id} idx={i + 1} l={l} cols={lineCols} editing={editing}
                  setEditing={setEditing} update={update} removeLine={removeLine}/>
              ))}
              <tr className="adder" onClick={(e) => { e.stopPropagation(); addLine(); }}>
                <td><div className="cell">{lines.length + 1}</div></td>
                <td colSpan={lineCols.length + 1}>
                  <div className="cell" style={{ cursor: 'pointer' }}>
                    <Icon name="plus" size={11}/>&nbsp; Klik di sini atau tekan <Kbd>+</Kbd> untuk menambah baris...
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{ textAlign: 'right', paddingRight: 12 }}>{t('Total')} {head.uang}</td>
                {cfg.journal ? (
                  <><td className="num">{fmtIDR(total)}</td><td className="num">{fmtIDR(totalKredit)}</td><td colSpan={3}/></>
                ) : (
                  <><td className="num">{fmtIDR(total)}</td><td colSpan={4}/></>
                )}
              </tr>
            </tfoot>
          </table>
        </div>
      )}
      {tab === 'info' && (
        <div style={{ padding: 16, fontSize: 12.5, color: 'var(--fg-muted)', background: 'var(--panel)', flex: 1 }}>
          Informasi tambahan, lampiran dokumen, dan referensi transaksi terkait untuk {t(cfg.label)}.
        </div>
      )}
      {tab === 'audit' && (
        <div style={{ padding: 16, background: 'var(--panel)', flex: 1, fontSize: 12.5 }}>
          {window.ACTIVITY.slice(0, 5).map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
              <span className="muted" style={{ fontFamily: 'Geist Mono, monospace', minWidth: 80 }}>{window.todayStr} {a.ts}</span>
              <span><strong>{a.who}</strong> {a.what} <span style={{ fontFamily: 'Geist Mono, monospace' }}>{a.target}</span></span>
            </div>
          ))}
        </div>
      )}

      <ContactPicker open={pickerOpen} onClose={() => setPickerOpen(false)}
        onSelect={(c) => { setContact(c); setHead(h => ({ ...h, party: c.name })); }} t={t}/>

      <div className="pager">
        <span className="muted">Pintasan:</span>
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

window.TrxForm = TrxForm;
window.TRX_CFG = TRX_CFG;
