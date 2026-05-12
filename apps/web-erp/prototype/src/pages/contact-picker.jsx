// Contact picker modal — Cari Kontak
const CONTACT_DATA = (() => {
  const cats = ['Customer', 'Supplier', 'Karyawan', 'Umum'];
  const cust = ['PT Sumber Rejeki', 'CV Cahaya Abadi', 'PT Mitra Sentosa', 'Toko Berkah Jaya', 'PT Karya Mandiri', 'CV Tirta Makmur', 'PT Indo Lestari', 'PT Global Niaga', 'CV Anugerah Jaya', 'PT Bintang Selatan', 'PT Cipta Mandiri', 'PT Sentosa Abadi', 'CV Permata Hijau', 'PT Surya Cemerlang', 'PT Nusantara Trading'];
  const supp = ['PT Sinar Logam', 'CV Mitra Plastik', 'PT Indo Kemasan', 'PT Tirta Kimia', 'CV Berkah Tekstil', 'PT Adidaya Mesin', 'PT Cahaya Listrik', 'CV Karya Baja', 'PT Sumber Energi'];
  const karyawan = ['Adi Saputra', 'Fitri Handayani', 'Rendra Wibowo', 'Maya Pratiwi', 'Budi Tirta', 'Sari Indah', 'Joko Susilo', 'Dewi Lestari', 'Andi Prasetyo'];
  const umum = ['Pelanggan Tunai', 'Petty Cash PCI', 'Petty Cash JKT', 'Refund Bank', 'Setoran Modal Owner'];
  const cities = ['Jakarta', 'Bandung', 'Surabaya', 'Tangerang', 'Bekasi', 'Bogor', 'Semarang', 'Cikarang'];
  let _s = 99; const r = () => { _s = (_s * 1664525 + 1013904223) >>> 0; return _s / 4294967296; };
  let id = 0;
  const out = [];
  const push = (name, cat) => {
    id++;
    const code = (cat === 'Customer' ? 'C' : cat === 'Supplier' ? 'S' : cat === 'Karyawan' ? 'E' : 'U') + String(id).padStart(4, '0');
    out.push({
      id, code, name, cat,
      city: cities[Math.floor(r() * cities.length)],
      npwp: cat === 'Karyawan' || cat === 'Umum' ? '—' : `01.${Math.floor(r()*900+100)}.${Math.floor(r()*900+100)}.${Math.floor(r()*9)}-${Math.floor(r()*900+100)}.000`,
      phone: `0812-${Math.floor(r()*9000+1000)}-${Math.floor(r()*9000+1000)}`,
      balance: Math.round((r() - 0.3) * 80000000 / 1000) * 1000,
      lastTrx: `${String(Math.floor(r()*12)+1).padStart(2,'0')}/05/2026`,
      trxCount: Math.floor(r() * 80) + 1,
    });
  };
  cust.forEach(n => push(n, 'Customer'));
  supp.forEach(n => push(n, 'Supplier'));
  karyawan.forEach(n => push(n, 'Karyawan'));
  umum.forEach(n => push(n, 'Umum'));
  return out;
})();

const catColor = {
  'Customer': 'primary', 'Supplier': 'success', 'Karyawan': 'warn', 'Umum': 'info'
};
const avatarFor = (c) => {
  const seed = c.id;
  const hues = [220, 160, 30, 200, 280, 340];
  return hues[seed % hues.length];
};
const initials = (name) => name.split(' ').filter(w => /^[A-Z]/.test(w[0]) || w.length > 2).slice(0, 2).map(w => w[0]).join('').toUpperCase() || name.slice(0,2).toUpperCase();

const ContactPicker = ({ open, onClose, onSelect, t }) => {
  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState('Semua');
  const [focused, setFocused] = React.useState(0);
  const [recent, setRecent] = React.useState([0, 2, 16]); // some seeded recent ids
  const inputRef = React.useRef(null);
  const rowsRef = React.useRef(null);

  React.useEffect(() => { if (open) { setQ(''); setFocused(0); setCat('Semua'); setTimeout(() => inputRef.current?.focus(), 30); } }, [open]);

  const filtered = React.useMemo(() => {
    return CONTACT_DATA.filter(c => {
      if (cat !== 'Semua' && c.cat !== cat) return false;
      if (q && !(c.name.toLowerCase().includes(q.toLowerCase()) || c.code.toLowerCase().includes(q.toLowerCase()) || c.city.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [q, cat]);

  React.useEffect(() => { setFocused(0); }, [q, cat]);

  const active = filtered[focused];

  const counts = React.useMemo(() => {
    const m = { Semua: CONTACT_DATA.length };
    CONTACT_DATA.forEach(c => { m[c.cat] = (m[c.cat] || 0) + 1; });
    return m;
  }, []);

  const recentItems = React.useMemo(() => recent.map(id => CONTACT_DATA.find(c => c.id === id + 1)).filter(Boolean), [recent]);

  const onKey = (e) => {
    if (e.key === 'Escape') { onClose(); }
    else if (e.key === 'ArrowDown' || (e.ctrlKey && e.key === 'n')) { e.preventDefault(); setFocused(f => Math.min(filtered.length - 1, f + 1)); }
    else if (e.key === 'ArrowUp' || (e.ctrlKey && e.key === 'p')) { e.preventDefault(); setFocused(f => Math.max(0, f - 1)); }
    else if (e.key === 'PageDown') { e.preventDefault(); setFocused(f => Math.min(filtered.length - 1, f + 8)); }
    else if (e.key === 'PageUp') { e.preventDefault(); setFocused(f => Math.max(0, f - 8)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (active) { onSelect(active); onClose(); } }
    else if (e.key === 'Tab' && !e.shiftKey) {
      const order = ['Semua', 'Customer', 'Supplier', 'Karyawan', 'Umum'];
      const i = order.indexOf(cat);
      if (i !== -1) { e.preventDefault(); setCat(order[(i + 1) % order.length]); }
    }
  };

  // scroll focused into view
  React.useEffect(() => {
    if (!rowsRef.current) return;
    const row = rowsRef.current.querySelector(`[data-row="${focused}"]`);
    if (row) {
      const r = row.getBoundingClientRect();
      const c = rowsRef.current.getBoundingClientRect();
      if (r.top < c.top + 30) rowsRef.current.scrollTop -= (c.top + 30 - r.top);
      if (r.bottom > c.bottom - 6) rowsRef.current.scrollTop += (r.bottom - c.bottom + 6);
    }
  }, [focused]);

  if (!open) return null;

  return (
    <div className="cp-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="contact-modal fade-in" onKeyDown={onKey}>
        {/* Header */}
        <div className="cm-head">
          <div className="cm-title">
            <Icon name="user" size={14}/>
            <span>Cari Kontak</span>
            <span className="muted" style={{ fontWeight: 400, fontSize: 11.5, marginLeft: 4 }}>· {filtered.length} dari {CONTACT_DATA.length}</span>
          </div>
          <div className="cm-search">
            <Icon name="search" size={13}/>
            <input ref={inputRef} placeholder="Cari nama, kode, kota..." value={q} onChange={e => setQ(e.target.value)}/>
            {q && <button className="iconbtn" style={{ width: 22, height: 22 }} onClick={() => setQ('')}><Icon name="x" size={10}/></button>}
          </div>
          <button className="btn ghost sm" onClick={onClose}>
            Tutup <Kbd>ESC</Kbd>
          </button>
        </div>

        {/* Body: cat rail + table + preview */}
        <div className="cm-body">
          {/* Left rail */}
          <aside className="cm-rail">
            <div className="cm-rail-grp">
              <div className="cm-rail-label">Kategori</div>
              {['Semua', 'Customer', 'Supplier', 'Karyawan', 'Umum'].map(c => (
                <button key={c} className={`cm-rail-item ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
                  <span className={`cm-dot cm-dot-${c}`}/>
                  <span>{c}</span>
                  <span className="cm-count">{counts[c] || 0}</span>
                </button>
              ))}
            </div>
            {recentItems.length > 0 && (
              <div className="cm-rail-grp">
                <div className="cm-rail-label"><Icon name="history" size={10}/> Terakhir digunakan</div>
                {recentItems.map(rc => (
                  <button key={rc.id} className="cm-rail-item" onClick={() => { onSelect(rc); onClose(); }}>
                    <span className="cm-mini-av" style={{ background: `hsl(${avatarFor(rc)} 60% 92%)`, color: `hsl(${avatarFor(rc)} 70% 35%)` }}>{initials(rc.name)}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rc.name}</span>
                  </button>
                ))}
              </div>
            )}
            <div className="cm-rail-grp" style={{ marginTop: 'auto' }}>
              <button className="cm-rail-item primary-action">
                <Icon name="plus" size={11}/>
                <span>Buat kontak baru</span>
                <span className="cm-count"><Kbd>+</Kbd></span>
              </button>
            </div>
          </aside>

          {/* Table */}
          <div className="cm-list scrollbar" ref={rowsRef}>
            {filtered.length === 0 ? (
              <div className="cm-empty">
                <div className="cm-empty-art">
                  <Icon name="search" size={28}/>
                </div>
                <div style={{ fontWeight: 500, marginTop: 8 }}>Tidak ditemukan</div>
                <div className="muted" style={{ marginTop: 2, fontSize: 12 }}>Coba ubah kata kunci atau ganti kategori.</div>
              </div>
            ) : filtered.map((c, i) => (
              <div key={c.id} data-row={i}
                className={`cm-row ${i === focused ? 'active' : ''}`}
                onMouseEnter={() => setFocused(i)}
                onClick={() => { onSelect(c); onClose(); }}>
                <div className="cm-av" style={{ background: `hsl(${avatarFor(c)} 70% 92%)`, color: `hsl(${avatarFor(c)} 70% 32%)` }}>
                  {initials(c.name)}
                </div>
                <div className="cm-main">
                  <div className="cm-name">
                    <Highlight text={c.name} q={q}/>
                    {recent.includes(c.id - 1) && <span className="cm-tag-recent">recent</span>}
                  </div>
                  <div className="cm-sub">
                    <span className="cm-code"><Highlight text={c.code} q={q}/></span>
                    <span className="cm-sep">·</span>
                    <span><Icon name="dot" size={6}/> {c.city}</span>
                    <span className="cm-sep">·</span>
                    <span>{c.trxCount} transaksi</span>
                  </div>
                </div>
                <span className={`pill ${catColor[c.cat]}`} style={{ alignSelf: 'center' }}>{c.cat}</span>
                <div className="cm-bal" style={{ alignSelf: 'center' }}>
                  <div className="muted" style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Saldo</div>
                  <div className="num" style={{ fontFamily: 'Geist Mono, monospace', fontVariantNumeric: 'tabular-nums', fontWeight: 500, color: c.balance < 0 ? 'var(--danger)' : 'var(--fg)' }}>
                    {fmtCompact(c.balance)}
                  </div>
                </div>
                <Icon name="chevright" size={11} className="cm-go"/>
              </div>
            ))}
          </div>

          {/* Preview pane */}
          <aside className="cm-preview">
            {active ? (
              <>
                <div className="cm-preview-hero">
                  <div className="cm-av cm-av-lg" style={{ background: `hsl(${avatarFor(active)} 70% 92%)`, color: `hsl(${avatarFor(active)} 70% 32%)` }}>
                    {initials(active.name)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="cm-preview-name">{active.name}</div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
                      <span className="mono" style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: 'var(--fg-muted)' }}>{active.code}</span>
                      <span className={`pill ${catColor[active.cat]}`}>{active.cat}</span>
                    </div>
                  </div>
                </div>

                <div className="cm-stats">
                  <Stat label="Saldo" value={`Rp ${fmtCompact(active.balance)}`} accent={active.balance < 0 ? 'danger' : null}/>
                  <Stat label="Transaksi" value={`${active.trxCount}`}/>
                  <Stat label="Trx terakhir" value={active.lastTrx} mono/>
                </div>

                <div className="cm-fields">
                  <div className="cm-field"><span className="muted">Kota</span><span>{active.city}</span></div>
                  <div className="cm-field"><span className="muted">Telepon</span><span className="mono" style={{ fontFamily: 'Geist Mono, monospace' }}>{active.phone}</span></div>
                  <div className="cm-field"><span className="muted">NPWP</span><span className="mono" style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11.5 }}>{active.npwp}</span></div>
                </div>

                <div className="cm-preview-foot">
                  <button className="btn" style={{ flex: 1 }} onClick={onClose}>Batal</button>
                  <button className="btn primary" style={{ flex: 1 }} onClick={() => { onSelect(active); onClose(); }}>
                    Pilih <Kbd>↵</Kbd>
                  </button>
                </div>
              </>
            ) : (
              <div className="cm-empty" style={{ height: '100%' }}>
                <Icon name="user" size={28}/>
                <div className="muted" style={{ marginTop: 8 }}>Pilih kontak untuk melihat detail</div>
              </div>
            )}
          </aside>
        </div>

        {/* Footer hints */}
        <div className="cm-foot">
          <span><Kbd>↑</Kbd><Kbd>↓</Kbd> navigasi</span>
          <span><Kbd>Tab</Kbd> ganti kategori</span>
          <span><Kbd>↵</Kbd> pilih</span>
          <span><Kbd>ESC</Kbd> tutup</span>
          <span style={{ marginLeft: 'auto' }} className="muted">Sentient ERP · Kontak</span>
        </div>
      </div>
    </div>
  );
};

const Highlight = ({ text, q }) => {
  if (!q) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
};

const Stat = ({ label, value, accent, mono }) => (
  <div className="cm-stat">
    <div className="cm-stat-label">{label}</div>
    <div className={`cm-stat-val ${accent === 'danger' ? 'danger' : ''}`} style={mono ? { fontFamily: 'Geist Mono, monospace', fontSize: 12 } : null}>{value}</div>
  </div>
);

window.ContactPicker = ContactPicker;
