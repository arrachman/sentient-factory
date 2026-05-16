// Full-page create form for any REGISTRY module (master data / documents).
// Opened in its own tab (route "<id>-new"), never as a popup.
const RecordForm = ({ moduleId, t, onNavigate }) => {
  const mod = window.REGISTRY ? window.REGISTRY[moduleId] : null;
  if (!mod) return <div style={{ padding: 24 }}>Modul tidak ditemukan: {moduleId}</div>;
  const cols = mod.cols.filter(c => c.k !== 'id');
  const codeCol = cols.find(c => c.t === 'code');
  const nameCol = cols.find(c => /nama|name/i.test(c.k)) || cols.find(c => c.t === 'text');

  const init = () => {
    const o = {};
    cols.forEach(c => {
      if (c.t === 'status') o[c.k] = 'Draft';
      else if (c.t === 'code') o[c.k] = `${mod.code}-2605-2401`;
      else o[c.k] = '';
    });
    return o;
  };
  const [form, setForm] = React.useState(init);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const save = (andNew) => {
    if (nameCol && !String(form[nameCol.k] || '').trim()) { window.toast(`${nameCol.h} wajib diisi.`, { type: 'danger' }); return; }
    window.toast(`${t(mod.label)} baru tersimpan`, { type: 'success', sub: codeCol ? form[codeCol.k] : mod.code });
    if (andNew) setForm(init());
    else onNavigate(moduleId);
  };

  useKey((e) => {
    if (window.__overlay) return;
    if (e.key === 'Escape' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) onNavigate(moduleId);
    if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); save(e.shiftKey); }
  });

  const ctrl = (c) => {
    if (c.t === 'status') return <select value={form[c.k]} onChange={set(c.k)}>{['Draft', ...window.STATUSES.filter(s => s !== 'Draft')].map(s => <option key={s}>{s}</option>)}</select>;
    if (c.t === 'code') return <input value={form[c.k]} disabled style={{ fontFamily: 'Geist Mono, monospace' }}/>;
    if (c.t === 'date') return <input value={form[c.k]} onChange={set(c.k)} placeholder="dd/mm/yyyy"/>;
    if (['num', 'qty', 'qtyS', 'money', 'moneyS', 'pct'].includes(c.t)) return <input type="number" value={form[c.k]} onChange={set(c.k)} placeholder="0" style={{ textAlign: 'right', fontFamily: 'Geist Mono, monospace' }}/>;
    return <input value={form[c.k]} onChange={set(c.k)} placeholder={`Masukkan ${c.h.toLowerCase()}…`}/>;
  };

  const third = Math.ceil(cols.length / 3);
  const groups = [cols.slice(0, third), cols.slice(third, third * 2), cols.slice(third * 2)];

  return (
    <div className="page">
      <div className="page-header">
        <button className="iconbtn" onClick={() => onNavigate(moduleId)}><Icon name="arrowleft" size={14}/></button>
        <h1 className="page-title">{t(mod.label)}<span className="code-tag">{mod.code} · Baru</span></h1>
        <span className="pill warn" style={{ marginLeft: 8 }}><span className="dot"></span>Draft baru</span>
        <div className="page-actions">
          <button className="btn ghost" onClick={() => onNavigate(moduleId)}>Batal <Kbd>ESC</Kbd></button>
          <button className="btn" onClick={() => { setForm(init()); window.toast('Form direset', { type: 'info' }); }}><Icon name="refresh" size={12}/> {t('Reset')}</button>
          <button className="btn primary" onClick={() => save(false)}><Icon name="save" size={12}/> {t('Simpan')} <Kbd>⌘S</Kbd></button>
          <div className="btn-split">
            <button className="btn" onClick={() => save(true)}><Icon name="plus" size={12}/> {t('Simpan & Baru')}</button>
            <button className="btn"><Icon name="chevdown" size={12}/></button>
          </div>
        </div>
      </div>

      <div className="form-section" style={{ alignItems: 'start' }}>
        {groups.map((g, gi) => (
          <div key={gi}>
            {g.map(c => (
              <Field key={c.k} label={c.h}
                required={c === nameCol || c.t === 'status'}
                help={c.t === 'code' ? 'Otomatis saat disimpan' : null}>
                {ctrl(c)}
              </Field>
            ))}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, background: 'var(--panel)', padding: 16, fontSize: 12.5, color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="info" size={13}/> Lengkapi data <strong style={{ color: 'var(--fg)' }}>{t(mod.label)}</strong> lalu simpan. Form ini terbuka sebagai tab tersendiri — gunakan <Kbd>⌘S</Kbd> untuk simpan, <Kbd>ESC</Kbd> untuk batal.
      </div>

      <div className="pager">
        <span className="muted">{mod.group} · {t(mod.label)}</span>
        <div style={{ flex: 1 }}/>
        <span className="muted">Belum disimpan</span>
      </div>
    </div>
  );
};

window.RecordForm = RecordForm;
