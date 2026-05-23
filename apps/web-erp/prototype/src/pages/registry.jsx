// Central module registry — drives the generic DataList, breadcrumbs & tab titles.
// Each entry: { label, code, group, prefix, cols:[{k,h,t,w,p}] }
//   t (cell type): code | date | text | num | qty | qtyS | money | moneyS | pct | status | email | ver

const POOLS = {
  cust: ['PT Sumber Rejeki', 'CV Cahaya Abadi', 'PT Mitra Sentosa', 'Toko Berkah Jaya', 'PT Karya Mandiri', 'CV Tirta Makmur', 'PT Indo Lestari', 'PT Global Niaga', 'CV Anugerah Jaya', 'PT Bintang Selatan', 'PT Surya Cemerlang', 'PT Nusantara Trading'],
  supp: ['PT Sinar Logam', 'CV Mitra Plastik', 'PT Indo Kemasan', 'PT Tirta Kimia', 'CV Berkah Tekstil', 'PT Adidaya Mesin', 'PT Cahaya Listrik', 'CV Karya Baja', 'PT Sumber Energi'],
  item: ['Plat Baja 2mm', 'Pipa PVC 4"', 'Bearing 6204', 'Resin Epoxy 1kg', 'Kabel NYM 3x2.5', 'Cat Primer 5L', 'Mur Baut M8', 'Selang Hidrolik', 'Filter Oli', 'Motor 3 Phase 5HP', 'Roda Gigi 24T', 'Sensor Proximity'],
  acct: ['Kas Besar', 'Bank BCA Operasional', 'Piutang Usaha', 'Persediaan Barang Jadi', 'Mesin & Peralatan', 'Hutang Usaha', 'Modal Disetor', 'Penjualan Barang Jadi', 'HPP', 'Beban Gaji', 'Beban Listrik', 'Pendapatan Lain-lain'],
  loc: ['Gudang Pusat', 'Gudang Bahan Baku', 'Gudang WIP', 'Gudang Barang Jadi', 'Gudang Transit', 'Showroom PCI'],
  cc: ['Produksi Line A', 'Produksi Line B', 'Penjualan Retail', 'Logistik & Gudang', 'Administrasi Umum', 'R&D Engineering'],
  wh: ['T - RM', 'T - WIP', 'T - FG', 'PCI - Gudang', 'JKT - Gudang'],
  asset: ['Mesin CNC Bubut', 'Forklift Toyota 3T', 'Truk Box Mitsubishi', 'Genset 250 kVA', 'AC Sentral Pabrik', 'Server Rack Dell', 'Mesin Press Hidrolik', 'Kompresor Angin 10HP'],
  role: ['Administrator', 'Akuntansi', 'Kasir', 'Gudang', 'Pembelian', 'Penjualan', 'Manajer Cabang', 'Auditor'],
  itemCat: ['Bahan Baku', 'Barang Jadi', 'Sparepart', 'Consumable', 'Aset'],
  satuan: ['PCS', 'KG', 'M', 'LTR', 'BOX', 'UNIT', 'ROLL'],
  acctType: ['Aktiva', 'Kewajiban', 'Modal', 'Pendapatan', 'Beban'],
  locType: ['Gudang', 'Cabang', 'Showroom', 'Virtual'],
  dept: ['Produksi', 'Penjualan', 'Logistik', 'Keuangan', 'HRD', 'IT'],
  reason: ['Barang rusak', 'Selisih opname', 'Sample produksi', 'Koreksi sistem', 'Susut alami'],
  depMethod: ['Garis Lurus', 'Saldo Menurun', 'Unit Produksi'],
  bomVer: ['v1.0', 'v1.1', 'v2.0', 'v2.3', 'v3.0'],
  city: ['Jakarta', 'Bandung', 'Surabaya', 'Tangerang', 'Bekasi', 'Bogor', 'Semarang', 'Cikarang'],
  cabang: ['PCI', 'JKT', 'BDG', 'SBY'],
  karyawan: ['Adi Saputra', 'Fitri Handayani', 'Rendra Wibowo', 'Maya Pratiwi', 'Budi Tirta', 'Sari Indah', 'Joko Susilo', 'Dewi Lestari', 'Andi Prasetyo'],
};

const _rng = (seed) => { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
const _pick = (r, arr) => arr[Math.floor(r() * arr.length)];

const synthCell = (col, r, i, prefix) => {
  const t = col.t;
  if (t === 'code') return `${col.prefix || prefix}-2605-${String(2400 - i).padStart(4, '0')}`;
  if (t === 'date') return `${String(Math.floor(r() * 12) + 1).padStart(2, '0')}/05/2026`;
  if (t === 'status') return _pick(r, window.STATUSES);
  if (t === 'qty') return Math.floor(r() * 480) + 1;
  if (t === 'qtyS') return Math.round((r() - 0.45) * 120);
  if (t === 'pct') return Math.floor(r() * 101);
  if (t === 'money') return Math.round((r() * 48000000 + 150000) / 1000) * 1000;
  if (t === 'moneyS') return Math.round((r() - 0.4) * 24000000 / 1000) * 1000;
  if (t === 'ver') return _pick(r, POOLS.bomVer);
  if (t === 'email') {
    const n = (col._name || 'user').toLowerCase().replace(/[^a-z]/g, '.').replace(/\.+/g, '.').slice(0, 14);
    return `${n}@sentient.id`;
  }
  if (t === 'text') {
    if (col.p === 'cabang') return _pick(r, window.CABANGS);
    if (col.p === 'user') return _pick(r, window.USERS);
    if (col.p === 'acctno') return `${[1, 2, 3, 4, 5][i % 5]}${String(Math.floor(r() * 9) + 1)}0${String(Math.floor(r() * 9) + 1)}0${String(Math.floor(r() * 9) + 1)}.${String(Math.floor(r() * 900) + 100)}`;
    if (col.p === 'npwp') return `01.${Math.floor(r() * 900) + 100}.${Math.floor(r() * 900) + 100}.${Math.floor(r() * 9)}-${Math.floor(r() * 900) + 100}.000`;
    if (col.p === 'phone') return `0812-${Math.floor(r() * 9000) + 1000}-${Math.floor(r() * 9000) + 1000}`;
    if (col.p === 'dk') return r() > 0.5 ? 'Debit' : 'Kredit';
    if (col.p) return _pick(r, POOLS[col.p] || ['—']);
    return '—';
  }
  return '—';
};

const makeGen = (key, prefix, cols, n = 56) => () => {
  const r = _rng(key.split('').reduce((a, c) => a + c.charCodeAt(0), 7));
  return Array.from({ length: n }, (_, i) => {
    const row = { id: i + 1 };
    let nameCache = null;
    cols.forEach((c) => {
      if (c.t === 'email') { c._name = nameCache || 'user'; }
      const v = synthCell(c, r, i, prefix);
      if (c.p === 'cust' || c.p === 'supp' || c.p === 'karyawan') nameCache = v;
      row[c.k] = v;
    });
    return row;
  });
};

const C = (k, h, t, w, p, prefix) => ({ k, h, t, w, p, prefix });

const MASTER = [
  ['m-customer', 'Customer', 'CUS', 'Data Master', [
    C('code', 'Kode', 'code'), C('nama', 'Nama', 'text', 220, 'cust'), C('kota', 'Kota', 'text', 0, 'city'),
    C('npwp', 'NPWP', 'text', 0, 'npwp'), C('telp', 'Telepon', 'text', 0, 'phone'),
    C('saldo', 'Piutang', 'money'), C('status', 'Status', 'status')],
    [{ k: 'kota', label: 'Kota', opts: POOLS.city }]],
  ['m-supplier', 'Supplier', 'SUP', 'Data Master', [
    C('code', 'Kode', 'code'), C('nama', 'Nama', 'text', 220, 'supp'), C('kota', 'Kota', 'text', 0, 'city'),
    C('npwp', 'NPWP', 'text', 0, 'npwp'), C('telp', 'Telepon', 'text', 0, 'phone'),
    C('saldo', 'Hutang', 'money'), C('status', 'Status', 'status')],
    [{ k: 'kota', label: 'Kota', opts: POOLS.city }]],
  ['m-item', 'Item', 'ITM', 'Data Master', [
    C('code', 'Kode', 'code'), C('nama', 'Nama Barang', 'text', 220, 'item'), C('kategori', 'Kategori', 'text', 0, 'itemCat'),
    C('satuan', 'Satuan', 'text', 0, 'satuan'), C('stok', 'Stok', 'qty'), C('hpp', 'HPP', 'money'),
    C('harga', 'Harga Jual', 'money'), C('status', 'Status', 'status')],
    [{ k: 'kategori', label: 'Kategori', opts: POOLS.itemCat }, { k: 'satuan', label: 'Satuan', opts: POOLS.satuan }]],
  ['m-coa', 'Chart of Account', 'CoA', 'Data Master', [
    C('code', 'No Akun', 'text', 130, 'acctno'), C('nama', 'Nama Akun', 'text', 240, 'acct'),
    C('tipe', 'Tipe', 'text', 0, 'acctType'), C('normal', 'Saldo Normal', 'text', 0, 'dk'),
    C('saldo', 'Saldo', 'money'), C('status', 'Status', 'status')],
    [{ k: 'tipe', label: 'Tipe', opts: POOLS.acctType }, { k: 'normal', label: 'Saldo Normal', opts: ['Debit', 'Kredit'] }]],
  ['m-lokasi', 'Cabang & Lokasi', 'LOC', 'Data Master', [
    C('code', 'Kode', 'code'), C('nama', 'Nama', 'text', 200, 'loc'), C('cabang', 'Cabang', 'text', 0, 'cabang'),
    C('tipe', 'Tipe', 'text', 0, 'locType'), C('kota', 'Kota', 'text', 0, 'city'), C('status', 'Status', 'status')],
    [{ k: 'cabang', label: 'Cabang', opts: POOLS.cabang }, { k: 'tipe', label: 'Tipe', opts: POOLS.locType }, { k: 'kota', label: 'Kota', opts: POOLS.city }]],
  ['m-costcenter', 'Cost Center', 'CC', 'Data Master', [
    C('code', 'Kode', 'code'), C('nama', 'Nama', 'text', 200, 'cc'), C('dept', 'Departemen', 'text', 0, 'dept'),
    C('pic', 'PIC', 'text', 0, 'user'), C('anggaran', 'Anggaran', 'money'), C('status', 'Status', 'status')],
    [{ k: 'dept', label: 'Departemen', opts: POOLS.dept }, { k: 'pic', label: 'PIC', opts: () => window.USERS || [] }]],
];

const DOCS = [
  ['inv-opname', 'Stock Opname', 'SO', 'Persediaan', [
    C('code', 'No', 'code'), C('tgl', 'Tanggal', 'date'), C('gudang', 'Gudang', 'text', 0, 'wh'),
    C('item', 'Jml Item', 'qty'), C('selisihQ', 'Selisih Qty', 'qtyS'), C('selisihN', 'Selisih Nilai', 'moneyS'),
    C('status', 'Status', 'status')]],
  ['inv-mutasi', 'Mutasi Stok', 'MS', 'Persediaan', [
    C('code', 'No', 'code'), C('tgl', 'Tanggal', 'date'), C('item', 'Item', 'text', 200, 'item'),
    C('dari', 'Dari', 'text', 0, 'wh'), C('ke', 'Ke', 'text', 0, 'wh'), C('qty', 'Qty', 'qty'), C('status', 'Status', 'status')]],
  ['inv-adjust', 'Penyesuaian', 'AJ', 'Persediaan', [
    C('code', 'No', 'code'), C('tgl', 'Tanggal', 'date'), C('gudang', 'Gudang', 'text', 0, 'wh'),
    C('alasan', 'Alasan', 'text', 180, 'reason'), C('qty', 'Qty', 'qtyS'), C('nilai', 'Nilai', 'moneyS'), C('status', 'Status', 'status')]],
  ['inv-transfer', 'Transfer Gudang', 'TG', 'Persediaan', [
    C('code', 'No', 'code'), C('tgl', 'Tanggal', 'date'), C('dari', 'Dari Gudang', 'text', 0, 'wh'),
    C('ke', 'Ke Gudang', 'text', 0, 'wh'), C('item', 'Jml Item', 'qty'), C('status', 'Status', 'status')]],
  ['pur-po', 'PO Pembelian', 'PO', 'Pembelian', [
    C('code', 'No PO', 'code'), C('tgl', 'Tanggal', 'date'), C('supplier', 'Supplier', 'text', 220, 'supp'),
    C('item', 'Jml Item', 'qty'), C('total', 'Total', 'money'), C('status', 'Status', 'status')]],
  ['pur-receipt', 'Penerimaan Barang', 'PR', 'Pembelian', [
    C('code', 'No', 'code'), C('tgl', 'Tanggal', 'date'), C('supplier', 'Supplier', 'text', 220, 'supp'),
    C('ref', 'No PO', 'code', 0, null, 'PO'), C('item', 'Jml Item', 'qty'), C('status', 'Status', 'status')]],
  ['pur-invoice', 'Faktur Pembelian', 'PI', 'Pembelian', [
    C('code', 'No', 'code'), C('tgl', 'Tanggal', 'date'), C('supplier', 'Supplier', 'text', 220, 'supp'),
    C('total', 'Total', 'money'), C('due', 'Jatuh Tempo', 'date'), C('status', 'Status', 'status')]],
  ['pur-return', 'Retur Pembelian', 'PRT', 'Pembelian', [
    C('code', 'No', 'code'), C('tgl', 'Tanggal', 'date'), C('supplier', 'Supplier', 'text', 220, 'supp'),
    C('total', 'Total', 'moneyS'), C('status', 'Status', 'status')]],
  ['sales-order', 'SO Penjualan', 'SO', 'Sales', [
    C('code', 'No SO', 'code'), C('tgl', 'Tanggal', 'date'), C('customer', 'Customer', 'text', 220, 'cust'),
    C('item', 'Jml Item', 'qty'), C('total', 'Total', 'money'), C('status', 'Status', 'status')]],
  ['sal-do', 'Pengiriman', 'DO', 'Sales', [
    C('code', 'No DO', 'code'), C('tgl', 'Tanggal', 'date'), C('customer', 'Customer', 'text', 220, 'cust'),
    C('ref', 'No SO', 'code', 0, null, 'SO'), C('item', 'Jml Item', 'qty'), C('status', 'Status', 'status')]],
  ['sal-invoice', 'Faktur Penjualan', 'SI', 'Sales', [
    C('code', 'No', 'code'), C('tgl', 'Tanggal', 'date'), C('customer', 'Customer', 'text', 220, 'cust'),
    C('total', 'Total', 'money'), C('due', 'Jatuh Tempo', 'date'), C('status', 'Status', 'status')]],
  ['sal-return', 'Retur Penjualan', 'SRT', 'Sales', [
    C('code', 'No', 'code'), C('tgl', 'Tanggal', 'date'), C('customer', 'Customer', 'text', 220, 'cust'),
    C('total', 'Total', 'moneyS'), C('status', 'Status', 'status')]],
  ['prd-wo', 'Work Order', 'WO', 'Produksi', [
    C('code', 'No WO', 'code'), C('tgl', 'Tanggal', 'date'), C('produk', 'Produk', 'text', 200, 'item'),
    C('qtyR', 'Qty Rencana', 'qty'), C('qtyJ', 'Qty Jadi', 'qty'), C('progress', 'Progress', 'pct'), C('status', 'Status', 'status')]],
  ['prd-bom', 'BOM', 'BOM', 'Produksi', [
    C('code', 'Kode', 'code'), C('produk', 'Produk', 'text', 220, 'item'), C('versi', 'Versi', 'ver'),
    C('komponen', 'Komponen', 'qty'), C('updated', 'Update', 'date'), C('status', 'Status', 'status')]],
  ['prd-output', 'Output Produksi', 'OP', 'Produksi', [
    C('code', 'No', 'code'), C('tgl', 'Tanggal', 'date'), C('ref', 'No WO', 'code', 0, null, 'WO'),
    C('produk', 'Produk', 'text', 200, 'item'), C('qty', 'Qty', 'qty'), C('status', 'Status', 'status')]],
  ['fa-list', 'Daftar Aset', 'FA', 'Fixed Asset', [
    C('code', 'Kode', 'code'), C('nama', 'Nama Aset', 'text', 200, 'asset'), C('kategori', 'Kategori', 'text', 0, 'itemCat'),
    C('tgl', 'Tgl Perolehan', 'date'), C('harga', 'Harga Perolehan', 'money'), C('buku', 'Nilai Buku', 'money'), C('status', 'Status', 'status')]],
  ['fa-deprec', 'Penyusutan', 'DEP', 'Fixed Asset', [
    C('code', 'Aset', 'code'), C('nama', 'Nama Aset', 'text', 200, 'asset'), C('metode', 'Metode', 'text', 0, 'depMethod'),
    C('beban', 'Penyusutan/bln', 'money'), C('akum', 'Akumulasi', 'money'), C('buku', 'Nilai Buku', 'money')]],
  ['fa-disposal', 'Disposal', 'DSP', 'Fixed Asset', [
    C('code', 'No', 'code'), C('tgl', 'Tanggal', 'date'), C('nama', 'Aset', 'text', 200, 'asset'),
    C('metode', 'Metode', 'text', 0, 'depMethod'), C('jual', 'Nilai Jual', 'money'), C('labarugi', 'Laba/Rugi', 'moneyS'), C('status', 'Status', 'status')]],
  ['set-users', 'Users', 'USR', 'Setting', [
    C('code', 'User', 'text', 0, 'user'), C('nama', 'Nama', 'text', 180, 'karyawan'), C('email', 'Email', 'email', 200),
    C('role', 'Role', 'text', 0, 'role'), C('cabang', 'Cabang', 'text', 0, 'cabang'), C('status', 'Status', 'status'),
    C('last', 'Last Login', 'date')]],
  ['set-roles', 'Roles', 'ROL', 'Setting', [
    C('code', 'Kode', 'code'), C('nama', 'Nama Role', 'text', 180, 'role'), C('dept', 'Departemen', 'text', 0, 'dept'),
    C('users', 'Users', 'qty'), C('modul', 'Modul', 'qty'), C('status', 'Status', 'status')]],
];

const REGISTRY = {};
[...MASTER, ...DOCS].forEach(([id, label, code, group, cols, filters = []]) => {
  REGISTRY[id] = { label, code, group, prefix: code, cols, filters, gen: makeGen(id, code, cols, 56) };
});

const REPORTS = {
  'rep-neraca': { label: 'Neraca', code: 'BS', type: 'bs' },
  'rep-labarugi': { label: 'Laba Rugi', code: 'PL', type: 'pl' },
  'rep-aruskas': { label: 'Arus Kas', code: 'CF', type: 'cf' },
  'rep-modal': { label: 'Perubahan Modal', code: 'EQ', type: 'eq' },
};

const GROUP_ICON = {
  'Dashboard': 'home', 'Statistik': 'stats', 'Data Master': 'database', 'Keuangan': 'coins',
  'Persediaan': 'boxes', 'Pembelian': 'cart', 'Sales': 'tag', 'Produksi': 'factory',
  'Fixed Asset': 'layers', 'Setting': 'gear', 'Laporan': 'file',
};

// Single source of truth for title / code / breadcrumbs / icon for ANY route.
const pageMeta = (route, t) => {
  const tx = t || ((x) => x);
  const M = window.MODULES || {};
  if (route === 'home') return { title: tx('Dashboard'), code: null, icon: 'home', crumbs: [{ label: tx('Dashboard') }] };
  if (route === 'statistik') return { title: tx('Statistik'), code: null, icon: 'stats', crumbs: [{ label: tx('Statistik') }] };
  if (route === 'set-prefs') return { title: tx('Preferensi'), code: 'PR', icon: 'gear', crumbs: [{ label: tx('Setting') }, { label: tx('Preferensi') }] };
  if (route === 'set-appearance') return { title: tx('Tampilan'), code: 'UI', icon: 'moon', crumbs: [{ label: tx('Setting') }, { label: tx('Tampilan') }] };
  if (route.endsWith('-new')) {
    const meta = pageMeta(route.slice(0, -4), t);
    return { ...meta, code: meta.code ? `${meta.code} · Baru` : 'Baru', crumbs: [...meta.crumbs, { label: 'Baru' }] };
  }
  if (route === 'kas-masuk') {
    return { title: tx('Kas Masuk'), code: 'CR', icon: 'coins',
      crumbs: [{ label: tx('Keuangan') }, { label: tx('Transaksi') }, { label: tx('Kas Masuk') }] };
  }
  if (M[route]) {
    const m = M[route];
    return { title: tx(m.label), code: m.code, icon: 'coins',
      crumbs: [{ label: tx('Keuangan') }, { label: m.isLedger ? tx('Laporan') : tx('Transaksi') }, { label: tx(m.label) }] };
  }
  if (REPORTS[route]) {
    const m = REPORTS[route];
    return { title: tx(m.label), code: m.code, icon: 'file',
      crumbs: [{ label: tx('Keuangan') }, { label: tx('Laporan') }, { label: tx(m.label) }] };
  }
  if (REGISTRY[route]) {
    const m = REGISTRY[route];
    return { title: tx(m.label), code: m.code, icon: GROUP_ICON[m.group] || 'file',
      crumbs: [{ label: tx(m.group) }, { label: tx(m.label) }] };
  }
  return { title: route, code: null, icon: 'file', crumbs: [{ label: route }] };
};

Object.assign(window, { REGISTRY, REPORTS, pageMeta, GROUP_ICON });
