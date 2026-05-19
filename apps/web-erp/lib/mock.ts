/**
 * Mock data + formatting helpers — ported from prototype `data.jsx`.
 * Typed TS exports; no `window.*` globals (the prototype attached these
 * to `window`, here they are real module exports).
 */

export function fmtIDR(n: number): string {
  const neg = n < 0;
  const v = Math.abs(n).toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (neg ? '-' : '') + v;
}

export function fmtCompact(n: number): string {
  if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(2)}M`;
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(1)}jt`;
  if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(0)}rb`;
  return String(n);
}

export const todayStr = '12/05/2026';

export const CABANGS = ['PCI', 'JKT', 'BDG', 'SBY'] as const;
export const LOKASIS = [
  'T - FG',
  'T - RM',
  'T - WIP',
  'PCI - Gudang',
  'JKT - Gudang',
] as const;
export const USERS = ['rania', 'fitri.h', 'rendra', 'maya.p', 'budi.t'] as const;
export const STATUSES = [
  'Approved',
  'Need Approve',
  'Posted',
  'Draft',
  'Rejected',
] as const;

const TERIMA_DARI = [
  'PT Sumber Rejeki',
  'CV Cahaya Abadi',
  'PT Mitra Sentosa',
  'Toko Berkah Jaya',
  'PT Karya Mandiri',
  'CV Tirta Makmur',
  'PT Indo Lestari',
  'Kasir Cabang PCI',
  'Kasir Cabang JKT',
  'PT Global Niaga',
  'CV Anugerah',
  'Pelanggan Tunai',
];

const URAIAN_KAS = [
  'Pembayaran invoice INV-2026',
  'Setoran kas harian',
  'Penerimaan DP order',
  'Pelunasan piutang',
  'Penjualan tunai',
  'Refund supplier',
  'Transfer antar kas',
  'Setoran modal',
];

const rng = (seed: number): (() => number) => {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

export interface KasMasukRow {
  id: number;
  no: string;
  tanggal: string;
  terimaDari: string;
  total: number;
  status: string;
  uraian: string;
  lokasi: string;
  cabang: string;
  user: string;
  uang: string;
}

export function genKasMasuk(n = 64): KasMasukRow[] {
  const r = rng(42);
  return Array.from({ length: n }, (_, i): KasMasukRow => {
    const day = Math.floor(r() * 12) + 1;
    const month = 5;
    const year = 2026;
    const total = Math.round((r() * 24500000 + 250000) / 1000) * 1000;
    return {
      id: i + 1,
      no: `CR-26${String(month).padStart(2, '0')}-${String(2400 - i).padStart(4, '0')}`,
      tanggal: `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`,
      terimaDari: TERIMA_DARI[Math.floor(r() * TERIMA_DARI.length)],
      total,
      status: STATUSES[Math.floor(r() * STATUSES.length)],
      uraian: URAIAN_KAS[Math.floor(r() * URAIAN_KAS.length)],
      lokasi: LOKASIS[Math.floor(r() * LOKASIS.length)],
      cabang: CABANGS[Math.floor(r() * CABANGS.length)],
      user: USERS[Math.floor(r() * USERS.length)],
      uang: 'IDR',
    };
  });
}

export type ActivityType = 'success' | 'info' | 'danger' | 'warn';

export interface ActivityRow {
  who: string;
  what: string;
  target: string;
  amount: number | null;
  type: ActivityType;
  ts: string;
}

export const ACTIVITY: ActivityRow[] = [
  { who: 'fitri.h', what: 'memposting', target: 'CR-2605-2398', amount: 4250000, type: 'success', ts: '10:42' },
  { who: 'rendra', what: 'membuat draft', target: 'SM-2605-1182', amount: -1850000, type: 'info', ts: '10:31' },
  { who: 'rania', what: 'menyetujui', target: 'RM-2605-0871', amount: 12500000, type: 'success', ts: '10:14' },
  { who: 'maya.p', what: 'menolak', target: 'CD-2605-1640', amount: -3200000, type: 'danger', ts: '09:58' },
  { who: 'budi.t', what: 'meng-edit', target: 'GJ-2605-0412', amount: null, type: 'warn', ts: '09:47' },
  { who: 'fitri.h', what: 'memposting', target: 'CR-2605-2397', amount: 8750000, type: 'success', ts: '09:31' },
  { who: 'rendra', what: 'membatalkan', target: 'RG-2605-0231', amount: null, type: 'danger', ts: '09:12' },
  { who: 'rania', what: 'menyimpan', target: 'CB-2605-0019', amount: null, type: 'info', ts: '08:58' },
];

export const KPI_SERIES = {
  kasMasuk: [42, 48, 51, 39, 58, 62, 71, 65, 78, 82, 76, 91, 88, 95],
  kasKeluar: [33, 41, 38, 44, 49, 47, 52, 55, 51, 58, 61, 57, 63, 60],
  bankMasuk: [120, 134, 128, 142, 159, 161, 175, 168, 182, 196, 188, 211, 224, 219],
  giro: [12, 14, 11, 16, 18, 15, 19, 21, 18, 22, 25, 23, 27, 24],
} as const;

type Lang = 'id' | 'en';

const I18N: Record<Lang, Record<string, string>> = {
  id: {
    Dashboard: 'Dashboard',
    Statistik: 'Statistik',
    'Data Master': 'Data Master',
    Keuangan: 'Keuangan',
    Transaksi: 'Transaksi',
    Laporan: 'Laporan',
    Persediaan: 'Persediaan',
    Pembelian: 'Pembelian',
    Sales: 'Sales',
    Produksi: 'Produksi',
    'Fixed Asset': 'Fixed Asset',
    Setting: 'Setting',
    'Kas Masuk': 'Kas Masuk',
    'Kas Keluar': 'Kas Keluar',
    'Bank Masuk': 'Bank Masuk',
    'Bank Keluar': 'Bank Keluar',
    'Jurnal Umum': 'Jurnal Umum',
    'Giro Masuk': 'Giro Masuk',
    'Giro Keluar': 'Giro Keluar',
    'Buku Besar': 'Buku Besar',
    Tambah: 'Tambah',
    'Cari semua...': 'Cari semua...',
    'Pendapatan bulan ini': 'Pendapatan bulan ini',
    'Pengeluaran bulan ini': 'Pengeluaran bulan ini',
    'Saldo Bank': 'Saldo Bank',
    'Giro Outstanding': 'Giro Outstanding',
    'vs bulan lalu': 'vs bulan lalu',
    'Aktivitas Terbaru': 'Aktivitas Terbaru',
    'Lihat semua': 'Lihat semua',
    'Aksi Cepat': 'Aksi Cepat',
    Pintasan: 'Pintasan',
    'Buat Kas Masuk': 'Buat Kas Masuk',
    'Buat Kas Keluar': 'Buat Kas Keluar',
    'Posting Jurnal': 'Posting Jurnal',
    'Lihat Buku Besar': 'Lihat Buku Besar',
    'Cash Flow 14 Hari': 'Cash Flow 14 Hari',
    'Top Transaksi Hari Ini': 'Top Transaksi Hari Ini',
    Customer: 'Customer',
    Supplier: 'Supplier',
    Item: 'Item',
    'Chart of Account': 'Chart of Account',
    'Cabang & Lokasi': 'Cabang & Lokasi',
    'Cost Center': 'Cost Center',
    'Stock Opname': 'Stock Opname',
    'Mutasi Stok': 'Mutasi Stok',
    Penyesuaian: 'Penyesuaian',
    'Transfer Gudang': 'Transfer Gudang',
    'PO Pembelian': 'PO Pembelian',
    'Penerimaan Barang': 'Penerimaan Barang',
    'Faktur Pembelian': 'Faktur Pembelian',
    'Retur Pembelian': 'Retur Pembelian',
    'SO Penjualan': 'SO Penjualan',
    Pengiriman: 'Pengiriman',
    'Faktur Penjualan': 'Faktur Penjualan',
    'Retur Penjualan': 'Retur Penjualan',
    'Work Order': 'Work Order',
    BOM: 'BOM',
    'Output Produksi': 'Output Produksi',
    'Daftar Aset': 'Daftar Aset',
    Penyusutan: 'Penyusutan',
    Disposal: 'Disposal',
    Users: 'Users',
    Roles: 'Roles',
    Preferensi: 'Preferensi',
    Neraca: 'Neraca',
    'Laba Rugi': 'Laba Rugi',
    'Arus Kas': 'Arus Kas',
    'Perubahan Modal': 'Perubahan Modal',
    Tampilan: 'Tampilan',
    Notifikasi: 'Notifikasi',
    Aktivitas: 'Aktivitas',
    'Tutup tab': 'Tutup tab',
    'Tab baru': 'Tab baru',
    'Duplikat tab': 'Duplikat tab',
    'Muat ulang': 'Muat ulang',
    Tutup: 'Tutup',
    'Tutup tab lain': 'Tutup tab lain',
    'Tutup tab di kanan': 'Tutup tab di kanan',
  },
  en: {
    Dashboard: 'Dashboard',
    Statistik: 'Statistics',
    'Data Master': 'Master Data',
    Keuangan: 'Finance',
    Transaksi: 'Transactions',
    Laporan: 'Reports',
    Persediaan: 'Inventory',
    Pembelian: 'Purchasing',
    Sales: 'Sales',
    Produksi: 'Production',
    'Fixed Asset': 'Fixed Asset',
    Setting: 'Settings',
    'Kas Masuk': 'Cash Receipt',
    'Kas Keluar': 'Cash Disbursement',
    'Bank Masuk': 'Bank Receipt',
    'Bank Keluar': 'Bank Disbursement',
    'Jurnal Umum': 'General Journal',
    'Giro Masuk': 'Receivable Note',
    'Giro Keluar': 'Payable Note',
    'Buku Besar': 'General Ledger',
    Tambah: 'New',
    'Cari semua...': 'Search everything...',
    'Pendapatan bulan ini': 'Revenue MTD',
    'Pengeluaran bulan ini': 'Expense MTD',
    'Saldo Bank': 'Bank Balance',
    'Giro Outstanding': 'Notes Outstanding',
    'vs bulan lalu': 'vs last month',
    'Aktivitas Terbaru': 'Recent Activity',
    'Lihat semua': 'View all',
    'Aksi Cepat': 'Quick Actions',
    Pintasan: 'Shortcuts',
    'Buat Kas Masuk': 'New Cash Receipt',
    'Buat Kas Keluar': 'New Cash Disbursement',
    'Posting Jurnal': 'Post Journal',
    'Lihat Buku Besar': 'View Ledger',
    'Cash Flow 14 Hari': '14-Day Cash Flow',
    'Top Transaksi Hari Ini': 'Top Transactions Today',
    Customer: 'Customer',
    Supplier: 'Supplier',
    Item: 'Item',
    'Chart of Account': 'Chart of Account',
    'Cabang & Lokasi': 'Branch & Location',
    'Cost Center': 'Cost Center',
    'Stock Opname': 'Stock Take',
    'Mutasi Stok': 'Stock Movement',
    Penyesuaian: 'Adjustment',
    'Transfer Gudang': 'Warehouse Transfer',
    'PO Pembelian': 'Purchase Order',
    'Penerimaan Barang': 'Goods Receipt',
    'Faktur Pembelian': 'Purchase Invoice',
    'Retur Pembelian': 'Purchase Return',
    'SO Penjualan': 'Sales Order',
    Pengiriman: 'Delivery',
    'Faktur Penjualan': 'Sales Invoice',
    'Retur Penjualan': 'Sales Return',
    'Work Order': 'Work Order',
    BOM: 'BOM',
    'Output Produksi': 'Production Output',
    'Daftar Aset': 'Asset Register',
    Penyusutan: 'Depreciation',
    Disposal: 'Disposal',
    Users: 'Users',
    Roles: 'Roles',
    Preferensi: 'Preferences',
    Neraca: 'Balance Sheet',
    'Laba Rugi': 'Income Statement',
    'Arus Kas': 'Cash Flow',
    'Perubahan Modal': 'Equity Changes',
    Tampilan: 'Appearance',
    Notifikasi: 'Notifications',
    Aktivitas: 'Activity',
    'Tutup tab': 'Close tab',
    'Tab baru': 'New tab',
    'Duplikat tab': 'Duplicate tab',
    'Muat ulang': 'Reload',
    Tutup: 'Close',
    'Tutup tab lain': 'Close Other Tabs',
    'Tutup tab di kanan': 'Close Tabs to the Right',
  },
};

export type Translator = (key: string) => string;

export function makeTranslator(lang: Lang): Translator {
  return (key: string) => I18N[lang]?.[key] ?? key;
}
