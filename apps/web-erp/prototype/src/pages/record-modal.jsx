// Generic create/edit drawer for any REGISTRY module (master data / documents).
// Field controls are derived from the module column schema.
const RecordModal = ({ open, moduleId, t, onClose, onSaved }) => {
  const mod = moduleId && window.REGISTRY ? window.REGISTRY[moduleId] : null;
  const cols = mod ? mod.cols.filter(c => c.k !== 'id') : [];

  const initial = React.useMemo(() => {
    const o = {};
    cols.forEach(c => {
      if (c.t === 'status') o[c.k] = 'Draft';
      else if (c.t === 'code') o[c.k] = `${mod.code}-2605-${'2401'}`;
      else if (['num', 'qty', 'qtyS', 'money', 'moneyS', 'pct'].includes(c.t)) o[c.k] = '';
      else o[c.k] = '';
    });
    return o;
  }, [moduleId]);

  const [form, setForm] = React.useState(initial);
  React.useEffect(() => { setForm(initial); }, [initial]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    window.__overlay = true;
    return () => { window.removeEventListener('keydown', onKey); window.__overlay = false; };
  }, [open]);

  if (!open || !mod) return null;

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const nameCol = cols.find(c => /nama|name/i.test(c.k)) || cols.find(c => c.t === 'text');

  const save = () => {
    if (nameCol && !String(form[nameCol.k] || '').trim()) {
      window.toast(`${nameCol.h} wajib diisi.`, { type: 'danger' });
      return;
    }
    onClose();
    window.toast(`${t(mod.label)} baru tersimpan`, { type: 'success', sub: form[(cols.find(c => c.t === 'code') || {}).k] || mod.code });
    if (onSaved) onSaved(form);
  };

  const ctrl = (c) => {
    if (c.t === 'status') {
      return <select value={form[c.k]} onChange={set(c.k)}>{['Draft', ...window.STATUSES.filter(s => s !== 'Draft')].map(s => <option key={s}>{s}</option>)}</select>;
    }
    if (c.t === 'code') {
      return <input value={form[c.k]} disabled style={{ fontFamily: 'Geist Mono, monospace', opacity: 0.7 }}/>;
    }
    if (c.t === 'date') {
      return <input value={form[c.k]} onChange={set(c.k)} placeholder="dd/mm/yyyy"/>;
    }
    if (['num', 'qty', 'qtyS', 'money', 'moneyS', 'pct'].includes(c.t)) {
      return <input type="number" value={form[c.k]} onChange={set(c.k)} placeholder="0"
        style={{ fontFamily: 'Geist Mono, monospace', textAlign: 'right' }}/>;
    }
    return <input value={form[c.k]} onChange={set(c.k)} placeholder={`Masukkan ${c.h.toLowerCase()}…`}/>;
  };

  return (
    <div className="drawer-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-hd">
          <span style={{ display: 'inline-flex', width: 26, height: 26, alignItems: 'center', justifyContent: 'center', background: 'var(--primary-soft)', color: 'var(--primary-soft-fg)', borderRadius: 6 }}>
            <Icon name="plus" size={13}/>
          </span>
          <div style={{ flex: 1 }}>
            <div className="ti">Tambah {t(mod.label)}</div>
            <div className="muted" style={{ fontSize: 11 }}>{mod.group} · {mod.code}</div>
          </div>
          <button className="iconbtn" onClick={onClose}><Icon name="x" size={13}/></button>
        </div>

        <div className="drawer-bd scrollbar">
          <div className="drawer-grid">
            {cols.map((c, i) => {
              const wide = c.w > 180 || /nama|name|uraian|alamat/i.test(c.k);
              return (
                <div key={c.k} className="drawer-field" style={wide ? { gridColumn: '1 / -1' } : null}>
                  <label>
                    {(c === nameCol || c.t === 'status') && <span className="req">*</span>}
                    {c.h}
                  </label>
                  {ctrl(c)}
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--fg-subtle)', display: 'flex', gap: 6, alignItems: 'center' }}>
            <Icon name="info" size={12}/> Nomor dokumen di-generate otomatis saat disimpan.
          </div>
        </div>

        <div className="drawer-ft">
          <button className="btn ghost" onClick={onClose}>Batal <Kbd>ESC</Kbd></button>
          <button className="btn" onClick={() => { save(); }}><Icon name="save" size={12}/> Simpan & Tutup</button>
          <button className="btn primary" onClick={save}><Icon name="check" size={12}/> Simpan</button>
        </div>
      </div>
    </div>
  );
};

window.RecordModal = RecordModal;
