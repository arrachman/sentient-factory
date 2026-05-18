// Sidebar with icon-only nav + flyout submenu
const NAV = [
  { id: 'home', icon: 'home', label: 'Dashboard' },
  { id: 'statistik', icon: 'stats', label: 'Statistik' },
  { id: 'approval-queue', icon: 'check', label: 'Persetujuan' },
  { id: 'audit-trail', icon: 'clock', label: 'Audit Trail' },
  { id: 'master', icon: 'database', label: 'Data Master', children: [
    { id: 'm-customer', label: 'Customer', code: 'CUS' }, { id: 'm-supplier', label: 'Supplier', code: 'SUP' },
    { id: 'm-item', label: 'Item', code: 'ITM' }, { id: 'm-coa', label: 'Chart of Account', code: 'CoA' },
    { id: 'm-lokasi', label: 'Cabang & Lokasi', code: 'LOC' }, { id: 'm-costcenter', label: 'Cost Center', code: 'CC' },
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
      { id: 'rep-neraca', label: 'Neraca', code: 'BS' }, { id: 'rep-labarugi', label: 'Laba Rugi', code: 'PL' },
      { id: 'rep-aruskas', label: 'Arus Kas', code: 'CF' }, { id: 'rep-modal', label: 'Perubahan Modal', code: 'EQ' },
    ]},
  ]},
  { id: 'persediaan', icon: 'boxes', label: 'Persediaan', children: [
    { group: 'Transaksi', items: [
      { id: 'inv-opname', label: 'Stock Opname', code: 'SO' }, { id: 'inv-mutasi', label: 'Mutasi Stok', code: 'MS' },
      { id: 'inv-adjust', label: 'Penyesuaian', code: 'AJ' }, { id: 'inv-transfer', label: 'Transfer Gudang', code: 'TG' },
    ]},
    { group: 'Laporan', items: [
      { id: 'inv-rep-stok', label: 'Stok Akhir', code: 'STA' }, { id: 'inv-rep-kartu', label: 'Kartu Stok', code: 'KST' },
      { id: 'inv-rep-adj', label: 'Rekap Penyesuaian', code: 'RPA' },
    ]},
  ]},
  { id: 'pembelian', icon: 'cart', label: 'Pembelian', children: [
    { group: 'Transaksi', items: [
      { id: 'pur-po', label: 'PO Pembelian', code: 'PO' }, { id: 'pur-receipt', label: 'Penerimaan Barang', code: 'PR' },
      { id: 'pur-invoice', label: 'Faktur Pembelian', code: 'PI' }, { id: 'pur-return', label: 'Retur Pembelian', code: 'PRT' },
    ]},
    { group: 'Laporan', items: [
      { id: 'pur-rep-aging', label: 'Aging Hutang', code: 'AGH' }, { id: 'pur-rep-rekap', label: 'Rekap Pembelian', code: 'RPB' },
      { id: 'pur-rep-supp', label: 'Rekap per Supplier', code: 'RPS' },
    ]},
  ]},
  { id: 'sales', icon: 'tag', label: 'Sales', children: [
    { group: 'Transaksi', items: [
      { id: 'sales-order', label: 'SO Penjualan', code: 'SO' }, { id: 'sal-do', label: 'Pengiriman', code: 'DO' },
      { id: 'sal-invoice', label: 'Faktur Penjualan', code: 'SI' }, { id: 'sal-return', label: 'Retur Penjualan', code: 'SRT' },
    ]},
    { group: 'Laporan', items: [
      { id: 'sls-rep-aging', label: 'Aging Piutang', code: 'AGP' }, { id: 'sls-rep-rekap', label: 'Rekap Penjualan', code: 'RPS' },
      { id: 'sls-rep-cust', label: 'Rekap per Customer', code: 'RPC' },
    ]},
  ]},
  { id: 'produksi', icon: 'factory', label: 'Produksi', children: [
    { group: 'Transaksi', items: [
      { id: 'prd-wo', label: 'Work Order', code: 'WO' }, { id: 'prd-bom', label: 'BOM', code: 'BOM' },
      { id: 'prd-output', label: 'Output Produksi', code: 'OP' },
    ]},
    { group: 'Laporan', items: [
      { id: 'mfg-rep-wo', label: 'Rekap Work Order', code: 'RWO' },
      { id: 'prd-rep-bom', label: 'Rekap BOM', code: 'RBOM' },
    ]},
  ]},
  { id: 'fixed-asset', icon: 'layers', label: 'Fixed Asset', children: [
    { group: 'Transaksi', items: [
      { id: 'fa-list', label: 'Daftar Aset', code: 'FA' }, { id: 'fa-deprec', label: 'Penyusutan', code: 'DEP' },
      { id: 'fa-disposal', label: 'Disposal', code: 'DSP' },
    ]},
    { group: 'Laporan', items: [
      { id: 'fa-rep-rekap', label: 'Rekap Aset', code: 'RFA' }, { id: 'fa-rep-dep', label: 'Lap. Penyusutan', code: 'LPD' },
    ]},
  ]},
  { divider: true },
  { id: 'setting', icon: 'gear', label: 'Setting', children: [
    { id: 'set-users', label: 'Users', code: 'U' }, { id: 'set-roles', label: 'Roles', code: 'R' },
    { id: 'set-prefs', label: 'Preferensi', code: 'PR' }, { id: 'set-appearance', label: 'Tampilan', code: 'UI' },
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
              <span className="nav-label">{t(item.label)}</span>
            </div>
          );
        })}
        <div style={{flex:1}}/>
        <div className="nav-item" data-tip="Keyboard shortcuts" onClick={() => window.dispatchEvent(new CustomEvent('open-shortcuts'))}>
          <Icon name="keyboard" size={16}/>
          <span className="nav-label">Pintasan</span>
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
                <span>{t(sub.label)}</span>
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
