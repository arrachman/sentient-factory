// Shared confirmation dialog + toast system.
// Imperative API so any page can trigger without prop-drilling:
//   window.confirmAction({ title, message, items, confirmLabel, confirmIcon, variant, icon, onConfirm })
//   window.toast(message, { type:'success'|'danger'|'warn'|'info', sub })
let _toastSeq = 1;

const showToast = (msg, opts = {}) => {
  window.dispatchEvent(new CustomEvent('app-toast', {
    detail: { id: _toastSeq++, msg, type: opts.type || 'info', sub: opts.sub || null, ttl: opts.ttl || 3200 },
  }));
};

const confirmAction = (opts) => {
  window.dispatchEvent(new CustomEvent('app-confirm', { detail: opts || {} }));
};

const ToastHost = () => {
  const [items, setItems] = React.useState([]);
  React.useEffect(() => {
    const onToast = (e) => {
      const tt = e.detail;
      setItems(list => [...list, tt]);
      setTimeout(() => setItems(list => list.map(x => x.id === tt.id ? { ...x, leaving: true } : x)), tt.ttl);
      setTimeout(() => setItems(list => list.filter(x => x.id !== tt.id)), tt.ttl + 220);
    };
    window.addEventListener('app-toast', onToast);
    return () => window.removeEventListener('app-toast', onToast);
  }, []);
  const remove = (id) => setItems(list => list.filter(x => x.id !== id));
  if (items.length === 0) return null;
  const ICO = { success: 'check', danger: 'x', warn: 'info', info: 'info' };
  return (
    <div className="toast-host">
      {items.map(tt => (
        <div key={tt.id} className={`toast ${tt.type} ${tt.leaving ? 'leaving' : ''}`}>
          <span className="toast-ic"><Icon name={ICO[tt.type] || 'info'} size={15}/></span>
          <div className="toast-msg">
            {tt.msg}
            {tt.sub && <div className="toast-sub">{tt.sub}</div>}
          </div>
          <span className="toast-x" onClick={() => remove(tt.id)}><Icon name="x" size={11}/></span>
        </div>
      ))}
    </div>
  );
};

const ConfirmHost = () => {
  const [cfg, setCfg] = React.useState(null);

  React.useEffect(() => {
    const onC = (e) => setCfg(e.detail);
    window.addEventListener('app-confirm', onC);
    return () => window.removeEventListener('app-confirm', onC);
  }, []);

  // Block list keyboard handlers while a confirm is open.
  React.useEffect(() => {
    window.__overlay = !!cfg;
    return () => { window.__overlay = false; };
  }, [cfg]);

  const close = () => setCfg(null);
  const doConfirm = () => {
    const fn = cfg && cfg.onConfirm;
    setCfg(null);
    if (fn) fn();
  };

  React.useEffect(() => {
    if (!cfg) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'Enter') { e.preventDefault(); doConfirm(); }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [cfg]);

  if (!cfg) return null;
  const variant = cfg.variant || 'primary';
  const icon = cfg.icon || (variant === 'danger' ? 'trash' : variant === 'warn' ? 'info' : 'check');

  return (
    <div className="cp-backdrop" style={{ zIndex: 750 }} onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="confirm-card fade-in" role="alertdialog">
        <div className="confirm-hd">
          <span className={`confirm-ic ${variant}`}><Icon name={icon} size={16}/></span>
          <div style={{ flex: 1 }}>
            <div className="confirm-title">{cfg.title || 'Konfirmasi'}</div>
            {cfg.message && <div className="confirm-msg">{cfg.message}</div>}
          </div>
        </div>
        {cfg.items && cfg.items.length > 0 && (
          <div className="confirm-body">
            <div className="confirm-list scrollbar">
              {cfg.items.map((it, i) => (
                <div key={i} className="row">
                  <span>{it.label}</span>
                  {it.val != null && <span style={{ fontFamily: 'Geist Mono, monospace' }}>{it.val}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="confirm-ft">
          <button className="btn ghost" onClick={close}>{cfg.cancelLabel || 'Batal'} <Kbd>ESC</Kbd></button>
          <button className={`btn ${variant === 'danger' ? 'danger' : 'primary'}`} autoFocus onClick={doConfirm}>
            {cfg.confirmIcon && <Icon name={cfg.confirmIcon} size={12}/>} {cfg.confirmLabel || 'Konfirmasi'} <Kbd>↵</Kbd>
          </button>
        </div>
      </div>
    </div>
  );
};

// Shared bulk-action confirm → toast flow, reused by every list page.
const BULK = {
  approve: { title: 'Setujui dokumen terpilih?', icon: 'check', variant: 'primary', confirmLabel: 'Setujui', confirmIcon: 'check', verb: 'disetujui', type: 'success' },
  reject:  { title: 'Tolak dokumen terpilih?', icon: 'x', variant: 'danger', confirmLabel: 'Tolak', confirmIcon: 'x', verb: 'ditolak', type: 'danger' },
  post:    { title: 'Posting dokumen terpilih?', icon: 'play', variant: 'primary', confirmLabel: 'Posting', confirmIcon: 'play', verb: 'diposting', type: 'success' },
  delete:  { title: 'Hapus dokumen terpilih?', icon: 'trash', variant: 'danger', confirmLabel: 'Hapus', confirmIcon: 'trash', verb: 'dihapus', type: 'danger' },
  export:  { title: 'Export data terpilih?', icon: 'download', variant: 'primary', confirmLabel: 'Export', confirmIcon: 'download', verb: 'diekspor', type: 'success' },
};

const bulkAction = (kind, count, onDone, items) => {
  const b = BULK[kind] || BULK.export;
  confirmAction({
    title: b.title,
    message: `${count} dokumen akan ${b.verb}. ${kind === 'delete' ? 'Tindakan ini tidak dapat dibatalkan.' : 'Aksi tercatat di audit trail.'}`,
    items: items && items.slice(0, 8),
    variant: b.variant, icon: b.icon, confirmLabel: b.confirmLabel, confirmIcon: b.confirmIcon,
    onConfirm: () => { if (onDone) onDone(); showToast(`${count} dokumen ${b.verb}`, { type: b.type }); },
  });
};

Object.assign(window, { toast: showToast, confirmAction, bulkAction, ToastHost, ConfirmHost });
