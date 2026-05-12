// Sidebar with icon-only nav + flyout submenu
const NAV = [
  { id: 'home', icon: 'home', label: 'Dashboard' },
  { id: 'statistik', icon: 'stats', label: 'Statistik' },
  { id: 'master', icon: 'database', label: 'Data Master', children: [
    { label: 'Customer', code: 'CUS' }, { label: 'Supplier', code: 'SUP' },
    { label: 'Item', code: 'ITM' }, { label: 'Chart of Account', code: 'CoA' },
    { label: 'Cabang & Lokasi', code: 'LOC' }, { label: 'Cost Center', code: 'CC' },
  ]},
  { id: 'keuangan', icon: 'coins', label: 'Keuangan', children: [
    { group: 'Transaksi', items: [
      { id: 'kas-masuk', label: 'Kas Masuk', code: 'CR' },
      { id: 'kas-keluar', label: 'Kas Keluar', code: 'CD' },
      { id: 'bank-masuk', label: 'Bank Masuk', code: 'RM' },
      { id: 'bank-keluar', label: 'Bank Keluar', code: 'SM' },
      { id: 'jurnal-umum', label: 'Jurnal Umum', code: 'GJ' },
      { id: 'giro-masuk', label: 'Giro Masuk', code: 'RG' },
      { id: 'giro-keluar', label: 'Giro Keluar', code: 'SG' },
      { id: 'giro-masuk-batal', label: 'Giro Masuk Batal', code: 'RGC' },
      { id: 'giro-keluar-batal', label: 'Giro Keluar Batal', code: 'SGC' },
      { id: 'saldo-awal', label: 'Saldo Awal Coa', code: 'CB' },
      { id: 'buku-besar', label: 'Buku Besar', code: 'GL' },
    ]},
    { group: 'Laporan', items: [
      { label: 'Neraca', code: 'BS' }, { label: 'Laba Rugi', code: 'PL' },
      { label: 'Arus Kas', code: 'CF' }, { label: 'Perubahan Modal', code: 'EQ' },
    ]},
  ]},
  { id: 'persediaan', icon: 'boxes', label: 'Persediaan', children: [
    { label: 'Stock Opname', code: 'SO' }, { label: 'Mutasi Stok', code: 'MS' },
    { label: 'Penyesuaian', code: 'AJ' }, { label: 'Transfer Gudang', code: 'TG' },
  ]},
  { id: 'pembelian', icon: 'cart', label: 'Pembelian', children: [
    { label: 'PO Pembelian', code: 'PO' }, { label: 'Penerimaan Barang', code: 'PR' },
    { label: 'Faktur Pembelian', code: 'PI' }, { label: 'Retur Pembelian', code: 'PRT' },
  ]},
  { id: 'sales', icon: 'tag', label: 'Sales', children: [
    { id: 'sales-order', label: 'SO Penjualan', code: 'SO' }, { label: 'Pengiriman', code: 'DO' },
    { label: 'Faktur Penjualan', code: 'SI' }, { label: 'Retur Penjualan', code: 'SRT' },
  ]},
  { id: 'produksi', icon: 'factory', label: 'Produksi', children: [
    { label: 'Work Order', code: 'WO' }, { label: 'BOM', code: 'BOM' },
    { label: 'Output Produksi', code: 'OP' },
  ]},
  { id: 'fixed-asset', icon: 'layers', label: 'Fixed Asset', children: [
    { label: 'Daftar Aset', code: 'FA' }, { label: 'Penyusutan', code: 'DEP' },
    { label: 'Disposal', code: 'DSP' },
  ]},
  { divider: true },
  { id: 'setting', icon: 'gear', label: 'Setting', children: [
    { label: 'Users', code: 'U' }, { label: 'Roles', code: 'R' }, { label: 'Preferensi', code: 'PR' },
  ]},
];

const Sidebar = ({ current, onNavigate, t }) => {
  const [open, setOpen] = React.useState(null);
  const [openTop, setOpenTop] = React.useState(0);
  const timer = React.useRef(null);

  const handleEnter = (e, item) => {
    if (!item.children) { setOpen(null); return; }
    clearTimeout(timer.current);
    const rect = e.currentTarget.getBoundingClientRect();
    setOpenTop(rect.top);
    setOpen(item.id);
  };
  const handleLeaveAll = () => {
    timer.current = setTimeout(() => setOpen(null), 120);
  };
  const keepOpen = () => clearTimeout(timer.current);

  const currentTop = NAV.find(i => !i.divider && (i.id === current || (i.children && i.children.some(c => c.id === current || (c.items && c.items.some(s => s.id === current))))));

  const openItem = NAV.find(i => i.id === open);

  return (
    <>
      <nav className="sidebar" onMouseLeave={handleLeaveAll}>
        {NAV.map((item, i) => {
          if (item.divider) return <div key={i} className="nav-divider"/>;
          const isActive = currentTop && currentTop.id === item.id;
          return (
            <div key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              data-tip={t(item.label)}
              onMouseEnter={(e) => handleEnter(e, item)}
              onClick={() => {
                if (!item.children) onNavigate(item.id);
              }}
            >
              <Icon name={item.icon} size={16} stroke={1.6}/>
            </div>
          );
        })}
        <div style={{flex:1}}/>
        <div className="nav-item" data-tip="Keyboard shortcuts" onClick={() => window.dispatchEvent(new CustomEvent('open-shortcuts'))}>
          <Icon name="keyboard" size={16}/>
        </div>
      </nav>
      {openItem && openItem.children && (
        <div className="flyout fade-in" style={{ top: Math.max(8, openTop) }}
             onMouseEnter={keepOpen} onMouseLeave={handleLeaveAll}>
          <div className="group-label">
            <span>{t(openItem.label)}</span>
            <Icon name={openItem.icon} size={12}/>
          </div>
          {Array.isArray(openItem.children) && openItem.children[0] && openItem.children[0].group ? (
            openItem.children.map((grp) => (
              <div key={grp.group}>
                <div className="group-label">
                  <span>{t(grp.group)}</span>
                  <span className="badge">{grp.items.length}</span>
                </div>
                {grp.items.map((sub) => (
                  <div key={sub.label}
                    className={`flyout-item ${sub.id === current ? 'active' : ''}`}
                    onClick={() => { if (sub.id) { onNavigate(sub.id); setOpen(null); } }}>
                    <Icon name="dot" size={8}/>
                    <span>{t(sub.label)}</span>
                    {sub.code && <span className="code">{sub.code}</span>}
                  </div>
                ))}
              </div>
            ))
          ) : (
            openItem.children.map((sub) => (
              <div key={sub.label}
                className={`flyout-item ${sub.id === current ? 'active' : ''}`}
                onClick={() => { if (sub.id) { onNavigate(sub.id); setOpen(null); } }}>
                <Icon name="dot" size={8}/>
                <span>{sub.label}</span>
                {sub.code && <span className="code">{sub.code}</span>}
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
};

window.Sidebar = Sidebar;
window.NAV = NAV;
