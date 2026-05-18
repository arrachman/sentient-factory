// Right slide-over panels: Notifikasi (bell) + Aktivitas (activity icon).
const NOTIFS_SEED = [
  { id: 1, type: 'warn', icon: 'info', title: 'Menunggu persetujuan', body: 'CR-2605-2398 (Rp 4.250.000) perlu Anda setujui.', ts: '2 mnt lalu', route: 'kas-masuk', read: false },
  { id: 2, type: 'success', icon: 'check', title: 'Dokumen diposting', body: 'RM-2605-0871 berhasil diposting oleh fitri.h.', ts: '14 mnt lalu', route: 'bank-masuk', read: false },
  { id: 3, type: 'danger', icon: 'x', title: 'Transaksi ditolak', body: 'CD-2605-1640 ditolak oleh maya.p — cek catatan.', ts: '38 mnt lalu', route: 'kas-keluar', read: false },
  { id: 4, type: 'info', icon: 'boxes', title: 'Stok menipis', body: 'Bearing 6204 di bawah minimum (sisa 12 PCS).', ts: '1 jam lalu', route: 'm-item', read: true },
  { id: 5, type: 'info', icon: 'receipt', title: 'Giro jatuh tempo', body: 'RG-2605-0231 jatuh tempo besok (20/06/2026).', ts: '3 jam lalu', route: 'giro-masuk', read: true },
  { id: 6, type: 'success', icon: 'check', title: 'Backup harian selesai', body: 'Backup database 02:00 WIB sukses.', ts: 'Kemarin', route: null, read: true },
];

const usePanel = (eventName) => {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const tog = () => setOpen(o => !o);
    window.addEventListener(eventName, tog);
    return () => window.removeEventListener(eventName, tog);
  }, []);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    window.__overlay = true;
    return () => { window.removeEventListener('keydown', onKey); window.__overlay = false; };
  }, [open]);
  return [open, setOpen];
};

const Panel = ({ open, onClose, title, icon, sub, head, children }) => {
  if (!open) return null;
  return (
    <div className="drawer-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="drawer panel-drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-hd">
          <span style={{ display: 'inline-flex', width: 26, height: 26, alignItems: 'center', justifyContent: 'center', background: 'var(--primary-soft)', color: 'var(--primary-soft-fg)', borderRadius: 6 }}>
            <Icon name={icon} size={13}/>
          </span>
          <div style={{ flex: 1 }}>
            <div className="ti">{title}</div>
            <div className="muted" style={{ fontSize: 11 }}>{sub}</div>
          </div>
          {head}
          <button className="iconbtn" onClick={onClose}><Icon name="x" size={13}/></button>
        </div>
        {children}
      </div>
    </div>
  );
};

const NotificationPanel = ({ t, onNavigate }) => {
  const [open, setOpen] = usePanel('toggle-notif');
  const [items, setItems] = React.useState(NOTIFS_SEED);
  const [tab, setTab] = React.useState('all');

  const unread = items.filter(n => !n.read).length;
  React.useEffect(() => {
    window.dispatchEvent(new CustomEvent('notif-count', { detail: unread }));
  }, [unread]);

  const shown = tab === 'unread' ? items.filter(n => !n.read) : items;
  const markAll = () => { setItems(items.map(n => ({ ...n, read: true }))); window.toast('Semua notifikasi ditandai dibaca', { type: 'info' }); };
  const openItem = (n) => {
    setItems(items.map(x => x.id === n.id ? { ...x, read: true } : x));
    if (n.route) { onNavigate(n.route); setOpen(false); }
  };

  return (
    <Panel open={open} onClose={() => setOpen(false)} title="Notifikasi" icon="bell"
      sub={`${unread} belum dibaca`}
      head={<button className="btn ghost sm" onClick={markAll} disabled={unread === 0}><Icon name="check" size={11}/> Tandai semua</button>}>
      <div className="tabs" style={{ padding: '0 8px' }}>
        <button className={`tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>Semua <span className="muted">{items.length}</span></button>
        <button className={`tab ${tab === 'unread' ? 'active' : ''}`} onClick={() => setTab('unread')}>Belum dibaca <span className="muted">{unread}</span></button>
      </div>
      <div className="drawer-bd scrollbar" style={{ padding: 0, gap: 0 }}>
        {shown.length === 0 && <div className="cm-empty" style={{ padding: 48 }}><Icon name="bell" size={26}/><div className="muted" style={{ marginTop: 8 }}>Tidak ada notifikasi</div></div>}
        {shown.map(n => (
          <div key={n.id} className="notif-row" onClick={() => openItem(n)}>
            <span className={`confirm-ic ${n.type}`} style={{ width: 30, height: 30 }}><Icon name={n.icon} size={14}/></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: n.read ? 400 : 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                {n.title}{!n.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }}/>}
              </div>
              <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>{n.body}</div>
              <div style={{ fontSize: 10.5, color: 'var(--fg-faint)', marginTop: 3, fontFamily: 'Geist Mono, monospace' }}>{n.ts}</div>
            </div>
            {n.route && <Icon name="chevright" size={11} className="muted"/>}
          </div>
        ))}
      </div>
      <div className="drawer-ft">
        <button className="btn ghost" onClick={() => setOpen(false)}>Tutup <Kbd>ESC</Kbd></button>
        <button className="btn" onClick={() => { onNavigate('home'); setOpen(false); }}>Buka Dashboard</button>
      </div>
    </Panel>
  );
};

const ActivityPanel = ({ t }) => {
  const [open, setOpen] = usePanel('toggle-activity');
  const [filter, setFilter] = React.useState('all');
  const all = window.ACTIVITY || [];
  const shown = filter === 'all' ? all : all.filter(a => a.type === filter);

  return (
    <Panel open={open} onClose={() => setOpen(false)} title="Aktivitas" icon="activity"
      sub={`${all.length} kejadian hari ini`}
      head={
        <select value={filter} onChange={e => setFilter(e.target.value)}
          style={{ height: 26, padding: '0 6px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--fg)', font: 'inherit', fontSize: 11.5 }}>
          <option value="all">Semua</option>
          <option value="success">Sukses</option>
          <option value="danger">Ditolak/Batal</option>
          <option value="info">Info</option>
          <option value="warn">Edit</option>
        </select>
      }>
      <div className="drawer-bd scrollbar">
        <div className="activity-list">
          {shown.map((a, i) => (
            <div key={i} className={`activity-row ${a.type}`}>
              <span className="dot"/>
              <div>
                <span className="who">{a.who}</span> <span className="meta">{a.what}</span>{' '}
                <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11 }}>{a.target}</span>
                {a.amount != null && (
                  <span style={{ marginLeft: 6, fontFamily: 'Geist Mono, monospace', fontVariantNumeric: 'tabular-nums', color: a.amount > 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {a.amount > 0 ? '+' : ''}{fmtIDR(a.amount)}
                  </span>
                )}
              </div>
              <span className="ts">{a.ts}</span>
            </div>
          ))}
          {shown.length === 0 && <div className="cm-empty" style={{ padding: 48 }}><Icon name="activity" size={26}/><div className="muted" style={{ marginTop: 8 }}>Tidak ada aktivitas</div></div>}
        </div>
      </div>
      <div className="drawer-ft">
        <button className="btn ghost" onClick={() => setOpen(false)}>Tutup <Kbd>ESC</Kbd></button>
      </div>
    </Panel>
  );
};

Object.assign(window, { NotificationPanel, ActivityPanel });
