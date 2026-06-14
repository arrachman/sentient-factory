// Shared toolbar filter chips — used by every list page.
const useOutsideClose = (ref, onClose) => {
  React.useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);
};

// Single-select dropdown chip. "Semua" = no filter (chip stays neutral).
const FilterChip = ({ label, val, options, onChange, onRemove, icon }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  useOutsideClose(ref, () => setOpen(false));
  const set = val && val !== 'Semua';
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div className={`chip ${set ? 'active' : ''}`} onClick={() => setOpen(o => !o)}>
        {icon && <Icon name={icon} size={11}/>}
        <span className="label">{label}</span>
        <span className="val">{val}</span>
        <Icon name="chevdown" size={10}/>
        {set && onRemove && (
          <span className="x" onClick={(e) => { e.stopPropagation(); onRemove(); }}><Icon name="x" size={10}/></span>
        )}
      </div>
      {open && (
        <div className="flyout fade-in scrollbar" style={{ position: 'absolute', left: 0, top: '100%', marginTop: 4, minWidth: 180, maxHeight: 280, overflow: 'auto' }}>
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

// Date-range chip with quick presets + free text from/to.
const DATE_PRESETS = [
  { id: 'today', label: 'Hari ini', from: '12/05/2026', to: '12/05/2026' },
  { id: '7d', label: '7 hari terakhir', from: '06/05/2026', to: '12/05/2026' },
  { id: 'mtd', label: 'Bulan ini', from: '01/05/2026', to: '12/05/2026' },
  { id: 'last', label: 'Bulan lalu', from: '01/04/2026', to: '30/04/2026' },
  { id: 'ytd', label: 'Tahun berjalan', from: '01/01/2026', to: '12/05/2026' },
];

const DateRangeChip = ({ from, to, onChange, onRemove }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  useOutsideClose(ref, () => setOpen(false));
  const [f, setF] = React.useState(from);
  const [tt, setTt] = React.useState(to);
  React.useEffect(() => { setF(from); setTt(to); }, [from, to]);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div className="chip active" onClick={() => setOpen(o => !o)}>
        <Icon name="calendar" size={11}/>
        <span className="label">Tanggal</span>
        <span className="val">{from} – {to}</span>
        <Icon name="chevdown" size={10}/>
        {onRemove && <span className="x" onClick={(e) => { e.stopPropagation(); onRemove(); }}><Icon name="x" size={10}/></span>}
      </div>
      {open && (
        <div className="flyout fade-in" style={{ position: 'absolute', left: 0, top: '100%', marginTop: 4, minWidth: 230, padding: 8 }}>
          {DATE_PRESETS.map(p => (
            <div key={p.id} className="flyout-item" onClick={() => { onChange(p.from, p.to); setOpen(false); }}>
              <Icon name="dot" size={8}/><span>{p.label}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--border)', margin: '6px 0' }}/>
          <div style={{ display: 'flex', gap: 6, padding: '2px 6px' }}>
            <input className="df-in" value={f} onChange={e => setF(e.target.value)} placeholder="dd/mm/yyyy"
              style={{ width: '50%', height: 26, padding: '0 6px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--fg)', font: 'inherit', fontSize: 11.5 }}/>
            <input className="df-in" value={tt} onChange={e => setTt(e.target.value)} placeholder="dd/mm/yyyy"
              style={{ width: '50%', height: 26, padding: '0 6px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--fg)', font: 'inherit', fontSize: 11.5 }}/>
          </div>
          <button className="btn primary sm" style={{ width: '100%', marginTop: 6, justifyContent: 'center' }}
            onClick={() => { onChange(f, tt); setOpen(false); }}>Terapkan</button>
        </div>
      )}
    </div>
  );
};

// "Tambah Filter" — available: [{id,label}], onAdd(id).
const AddFilterChip = ({ available, onAdd, t }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  useOutsideClose(ref, () => setOpen(false));
  if (!available || available.length === 0) return null;
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div className="chip add" onClick={() => setOpen(o => !o)}>
        <Icon name="plus" size={10}/>
        <span>{t ? t('Tambah Filter') : 'Tambah Filter'}</span>
      </div>
      {open && (
        <div className="flyout fade-in" style={{ position: 'absolute', left: 0, top: '100%', marginTop: 4, minWidth: 170 }}>
          {available.map(f => (
            <div key={f.id} className="flyout-item" onClick={() => { onAdd(f.id); setOpen(false); }}>
              <Icon name="plus" size={10}/><span>{f.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Object.assign(window, { FilterChip, AddFilterChip, DateRangeChip });
