// Right slide-over panels: Notifikasi (bell) + Aktivitas (activity icon).
const NOTIFS_SEED = [
  // --- unread (5) ---
  { id: 1, type: 'warn', icon: 'info', title: 'Menunggu persetujuan', body: 'PO-2605-0087 (Rp 24.500.000) menunggu persetujuan Anda.', ts: '2 mnt lalu', route: 'pur-po', read: false },
  { id: 2, type: 'warn', icon: 'receipt', title: 'Faktur penjualan perlu disetujui', body: 'SINV-2605-0991 (Rp 31.200.000) dari SO-2605-1234 menunggu approval.', ts: '8 mnt lalu', route: 'approval-queue', read: false },
  { id: 3, type: 'danger', icon: 'x', title: 'Transaksi ditolak', body: 'CD-2605-1640 ditolak oleh maya.p — cek catatan revisi.', ts: '38 mnt lalu', route: 'kas-keluar', read: false },
  { id: 4, type: 'warn', icon: 'factory', title: 'Work Order butuh approval', body: 'WO-2605-0045 (Produk: Rangka Mesin A) menunggu persetujuan manajer produksi.', ts: '52 mnt lalu', route: 'prd-wo', read: false },
  { id: 5, type: 'danger', icon: 'boxes', title: 'Stok di bawah minimum', body: 'Bearing 6204 hanya tersisa 12 PCS — batas minimum 50 PCS.', ts: '1 jam lalu', route: 'm-item', read: false },
  // --- read (11) ---
  { id: 6, type: 'success', icon: 'check', title: 'Dokumen diposting', body: 'RM-2605-0871 (Rp 12.500.000) berhasil diposting oleh fitri.h.', ts: '1 jam lalu', route: 'bank-masuk', read: true },
  { id: 7, type: 'success', icon: 'check', title: 'PO disetujui', body: 'PO-2605-0086 disetujui oleh adi.s dan siap dikirim ke supplier.', ts: '2 jam lalu', route: 'pur-po', read: true },
  { id: 8, type: 'warn', icon: 'clock', title: 'Giro jatuh tempo besok', body: 'RG-2605-0231 (Rp 8.750.000) jatuh tempo 13/05/2026 — segera proses.', ts: '3 jam lalu', route: 'giro-masuk', read: true },
  { id: 9, type: 'danger', icon: 'tag', title: 'Peringatan kedaluwarsa stok', body: 'Bahan baku Cat Epoxy 1L (lot #B240412) kedaluwarsa dalam 7 hari.', ts: '3 jam lalu', route: 'm-item', read: true },
  { id: 10, type: 'warn', icon: 'receipt', title: 'Faktur pembelian jatuh tempo', body: 'PINV-2605-0045 (Rp 18.900.000) jatuh tempo dalam 3 hari — 15/05/2026.', ts: '4 jam lalu', route: 'pur-invoice', read: true },
  { id: 11, type: 'success', icon: 'check', title: 'SO diposting', body: 'SO-2605-1234 diposting dan pengiriman DEL-2605-0512 dibuat otomatis.', ts: '5 jam lalu', route: 'sales-order', read: true },
  { id: 12, type: 'info', icon: 'coins', title: 'Periode fiskal hampir tutup', body: 'Periode Mei 2026 akan ditutup dalam 13 hari — selesaikan entri jurnal.', ts: '6 jam lalu', route: null, read: true },
  { id: 13, type: 'danger', icon: 'x', title: 'Faktur pembelian ditolak', body: 'PINV-2605-0044 ditolak oleh budi.t — nomor seri item tidak cocok PO.', ts: '7 jam lalu', route: 'pur-invoice', read: true },
  { id: 14, type: 'info', icon: 'user', title: 'Login baru terdeteksi', body: 'rendra login dari IP 192.168.1.45 pada 12/05/2026 07:02 WIB.', ts: 'Kemarin', route: null, read: true },
  { id: 15, type: 'warn', icon: 'gear', title: 'Role pengguna diubah', body: 'Role budi.t diubah dari Operator menjadi Kasir oleh maya.p.', ts: 'Kemarin', route: null, read: true },
  { id: 16, type: 'success', icon: 'check', title: 'Backup harian selesai', body: 'Backup database 02:00 WIB sukses — ukuran 2.3 GB.', ts: 'Kemarin', route: null, read: true },
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
