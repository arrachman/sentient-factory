/**
 * seed-bank-out-1000.mjs
 *
 * Generate 1000 transaksi "Bank Keluar" mulai 1 Jan 2025, terdistribusi
 * merata per bulan. Mencakup semua 11 jenis transaksi dari menu Bank Keluar:
 *
 *   1. General Journal        (journal-entries  : GENERAL)
 *   2. Adjustment Journal     (journal-entries  : ADJUSTMENT)
 *   3. Receipt Giro           (giro-entries     : REGISTER + INCOMING)
 *   4. Send Giro              (giro-entries     : REGISTER + OUTGOING)
 *   5. Receipt Giro Clearing  (giro-entries     : CLEAR + INCOMING)
 *   6. Send Giro Clearing     (giro-entries     : CLEAR + OUTGOING)
 *   7. Memorial Journal       (journal-entries  : MEMORIAL)
 *   8. FX Revaluation         (journal-entries  : REVALUATION)
 *   9. Receipt Memo           (cash-bank-txn    : RECEIPT + BANK + OTHER)
 *  10. Send Memo              (cash-bank-txn    : DISBURSEMENT + BANK + OTHER)
 *  11. Cash/Bank Transfer     (cash-bank-txn    : DISBURSEMENT-style inter-bank)
 *
 * Semua entry di-SUBMIT → APPROVE → POST setelah dibuat.
 * Giro clearing (5,6) bergantung pada outstanding giro dari (3,4) —
 * dijalankan di fase terpisah setelah REGISTER selesai.
 *
 * Usage:
 *   node scripts/seed-bank-out-1000.mjs
 *   node scripts/seed-bank-out-1000.mjs --dry-run
 *   node scripts/seed-bank-out-1000.mjs --concurrency 5
 *   node scripts/seed-bank-out-1000.mjs --skip-clear  (skip clearing phase)
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Config ──────────────────────────────────────────────────────────────────

const API_BASE = 'http://localhost:3203/api';
const LOGIN_FIELD = 'admin';
const PASSWORD = (() => {
  try {
    const env = readFileSync(join(__dirname, '../apps/api-gateway/.env'), 'utf8');
    const match = env.match(/^ERP_ADMIN_PASSWORD=(.+)$/m);
    if (match) return match[1].trim();
  } catch {}
  return process.env.ERP_SEED_PASSWORD ?? 'Admin123!';
})();

const SOURCE = 'DUMMY_SEED_BANK_OUT';

const BRANCH_ID = '1';
const CURRENCY_ID = '1';
const EXCHANGE_RATE = '1.000000';

const DRY_RUN = process.argv.includes('--dry-run');
const SKIP_CLEAR = process.argv.includes('--skip-clear');
const CONCURRENCY = (() => {
  const idx = process.argv.indexOf('--concurrency');
  return idx >= 0 ? parseInt(process.argv[idx + 1]) || 3 : 3;
})();

// ─── Accounts ────────────────────────────────────────────────────────────────

const ACCOUNTS = [
  { id: '183', code: '1101.01.001', name: 'Kas Besar',                        type: 'ASSET',     nb: 'DEBIT'  },
  { id: '184', code: '1102.01.001', name: 'Kas Kecil',                        type: 'ASSET',     nb: 'DEBIT'  },
  { id: '185', code: '1110.01.001', name: 'Bank BCA - Giro IDR',              type: 'ASSET',     nb: 'DEBIT'  },
  { id: '186', code: '1111.01.001', name: 'Bank Mandiri - Giro IDR',          type: 'ASSET',     nb: 'DEBIT'  },
  { id: '187', code: '1112.01.001', name: 'Bank BNI - Giro IDR',              type: 'ASSET',     nb: 'DEBIT'  },
  { id: '188', code: '1113.01.001', name: 'Bank BRI - Giro IDR',              type: 'ASSET',     nb: 'DEBIT'  },
  { id: '189', code: '1114.01.001', name: 'Bank CIMB Niaga - Giro IDR',       type: 'ASSET',     nb: 'DEBIT'  },
  { id: '190', code: '1115.01.001', name: 'Bank Mandiri - Giro USD',          type: 'ASSET',     nb: 'DEBIT'  },
  { id: '191', code: '1120.01.001', name: 'Piutang Dagang',                   type: 'ASSET',     nb: 'DEBIT'  },
  { id: '192', code: '1121.01.001', name: 'Cadangan Kerugian Piutang',        type: 'ASSET',     nb: 'CREDIT' },
  { id: '193', code: '1122.01.001', name: 'Piutang Karyawan',                 type: 'ASSET',     nb: 'DEBIT'  },
  { id: '194', code: '1123.01.001', name: 'Uang Muka Pembelian',              type: 'ASSET',     nb: 'DEBIT'  },
  { id: '195', code: '1124.01.001', name: 'Piutang Lainnya',                  type: 'ASSET',     nb: 'DEBIT'  },
  { id: '196', code: '1125.01.001', name: 'Giro Masuk Dalam Proses Kliring',  type: 'ASSET',     nb: 'DEBIT'  },
  { id: '197', code: '1130.01.001', name: 'Persediaan Bahan Baku',            type: 'ASSET',     nb: 'DEBIT'  },
  { id: '198', code: '1131.01.001', name: 'Persediaan Bahan Pembantu',        type: 'ASSET',     nb: 'DEBIT'  },
  { id: '199', code: '1132.01.001', name: 'Persediaan Barang Dalam Proses',   type: 'ASSET',     nb: 'DEBIT'  },
  { id: '200', code: '1133.01.001', name: 'Persediaan Barang Jadi',           type: 'ASSET',     nb: 'DEBIT'  },
  { id: '201', code: '1134.01.001', name: 'Persediaan Perlengkapan',          type: 'ASSET',     nb: 'DEBIT'  },
  { id: '202', code: '1140.01.001', name: 'PPN Masukan',                      type: 'ASSET',     nb: 'DEBIT'  },
  { id: '203', code: '1141.01.001', name: 'PPh Pasal 22 Dibayar Dimuka',      type: 'ASSET',     nb: 'DEBIT'  },
  { id: '204', code: '1142.01.001', name: 'PPh Pasal 23 Dibayar Dimuka',      type: 'ASSET',     nb: 'DEBIT'  },
  { id: '205', code: '1143.01.001', name: 'PPh Pasal 25 Dibayar Dimuka',      type: 'ASSET',     nb: 'DEBIT'  },
  { id: '206', code: '1144.01.001', name: 'Fiskal Tahun Berjalan',            type: 'ASSET',     nb: 'DEBIT'  },
  { id: '207', code: '1150.01.001', name: 'Biaya Sewa Dibayar Dimuka',        type: 'ASSET',     nb: 'DEBIT'  },
  { id: '208', code: '1151.01.001', name: 'Biaya Asuransi Dibayar Dimuka',    type: 'ASSET',     nb: 'DEBIT'  },
  { id: '209', code: '1152.01.001', name: 'Biaya Lainnya Dibayar Dimuka',     type: 'ASSET',     nb: 'DEBIT'  },
  { id: '210', code: '1201.01.001', name: 'Tanah',                            type: 'ASSET',     nb: 'DEBIT'  },
  { id: '211', code: '1202.01.001', name: 'Bangunan dan Prasarana',           type: 'ASSET',     nb: 'DEBIT'  },
  { id: '212', code: '1203.01.001', name: 'Akumulasi Penyusutan Bangunan',    type: 'ASSET',     nb: 'CREDIT' },
  { id: '213', code: '1210.01.001', name: 'Mesin Produksi',                   type: 'ASSET',     nb: 'DEBIT'  },
  { id: '214', code: '1211.01.001', name: 'Akumulasi Penyusutan Mesin',       type: 'ASSET',     nb: 'CREDIT' },
  { id: '215', code: '1212.01.001', name: 'Peralatan Pabrik',                 type: 'ASSET',     nb: 'DEBIT'  },
  { id: '216', code: '1213.01.001', name: 'Akum. Penyusutan Peralatan Pabrik',type: 'ASSET',     nb: 'CREDIT' },
  { id: '217', code: '1220.01.001', name: 'Kendaraan',                        type: 'ASSET',     nb: 'DEBIT'  },
  { id: '218', code: '1221.01.001', name: 'Akumulasi Penyusutan Kendaraan',   type: 'ASSET',     nb: 'CREDIT' },
  { id: '219', code: '1230.01.001', name: 'Peralatan Kantor',                 type: 'ASSET',     nb: 'DEBIT'  },
  { id: '220', code: '1231.01.001', name: 'Akum. Penyusutan Peralatan Kantor',type: 'ASSET',     nb: 'CREDIT' },
  { id: '221', code: '1240.01.001', name: 'Inventaris Kantor',                type: 'ASSET',     nb: 'DEBIT'  },
  { id: '222', code: '1241.01.001', name: 'Akumulasi Penyusutan Inventaris',  type: 'ASSET',     nb: 'CREDIT' },
  { id: '223', code: '1301.01.001', name: 'Lisensi Software',                 type: 'ASSET',     nb: 'DEBIT'  },
  { id: '224', code: '1302.01.001', name: 'Akumulasi Amortisasi Lisensi',     type: 'ASSET',     nb: 'CREDIT' },
  { id: '225', code: '1310.01.001', name: 'Hak Merek dan Paten',              type: 'ASSET',     nb: 'DEBIT'  },
  { id: '226', code: '1311.01.001', name: 'Akumulasi Amortisasi Hak Merek',   type: 'ASSET',     nb: 'CREDIT' },
  { id: '227', code: '1320.01.001', name: 'Biaya Pendirian / Organisasi',     type: 'ASSET',     nb: 'DEBIT'  },
  { id: '228', code: '1321.01.001', name: 'Akum. Amortisasi Biaya Pendirian', type: 'ASSET',     nb: 'CREDIT' },
  { id: '229', code: '1401.01.001', name: 'Investasi Saham di Entitas Anak',  type: 'ASSET',     nb: 'DEBIT'  },
  { id: '230', code: '1402.01.001', name: 'Investasi Saham di Entitas Asosiasi',type:'ASSET',    nb: 'DEBIT'  },
  { id: '231', code: '1403.01.001', name: 'Investasi Obligasi',               type: 'ASSET',     nb: 'DEBIT'  },
  { id: '232', code: '2101.01.001', name: 'Hutang Dagang',                    type: 'LIABILITY', nb: 'CREDIT' },
  { id: '233', code: '2102.01.001', name: 'Hutang Bank Jangka Pendek',        type: 'LIABILITY', nb: 'CREDIT' },
  { id: '234', code: '2103.01.001', name: 'Hutang Gaji Karyawan',             type: 'LIABILITY', nb: 'CREDIT' },
  { id: '235', code: '2104.01.001', name: 'Biaya Yang Masih Harus Dibayar',   type: 'LIABILITY', nb: 'CREDIT' },
  { id: '236', code: '2105.01.001', name: 'Uang Muka Penjualan',              type: 'LIABILITY', nb: 'CREDIT' },
  { id: '237', code: '2106.01.001', name: 'Giro Keluar Dalam Proses',         type: 'LIABILITY', nb: 'CREDIT' },
  { id: '238', code: '2110.01.001', name: 'PPN Keluaran',                     type: 'LIABILITY', nb: 'CREDIT' },
  { id: '239', code: '2111.01.001', name: 'PPh Pasal 21 Terutang',            type: 'LIABILITY', nb: 'CREDIT' },
  { id: '240', code: '2112.01.001', name: 'PPh Pasal 23 Terutang',            type: 'LIABILITY', nb: 'CREDIT' },
  { id: '241', code: '2113.01.001', name: 'PPh Pasal 25 Terutang',            type: 'LIABILITY', nb: 'CREDIT' },
  { id: '242', code: '2114.01.001', name: 'PPh Badan Terutang',               type: 'LIABILITY', nb: 'CREDIT' },
  { id: '243', code: '2115.01.001', name: 'BPJS Ketenagakerjaan Terutang',    type: 'LIABILITY', nb: 'CREDIT' },
  { id: '244', code: '2116.01.001', name: 'BPJS Kesehatan Terutang',          type: 'LIABILITY', nb: 'CREDIT' },
  { id: '245', code: '2120.01.001', name: 'Dividen Yang Harus Dibayar',       type: 'LIABILITY', nb: 'CREDIT' },
  { id: '246', code: '2121.01.001', name: 'Hutang Jangka Panjang - Jatuh Tempo',type:'LIABILITY',nb: 'CREDIT' },
  { id: '247', code: '2201.01.001', name: 'Hutang Bank Jangka Panjang',       type: 'LIABILITY', nb: 'CREDIT' },
  { id: '248', code: '2202.01.001', name: 'Hutang Obligasi',                  type: 'LIABILITY', nb: 'CREDIT' },
  { id: '249', code: '2203.01.001', name: 'Hutang Sewa Pembiayaan (Leasing)', type: 'LIABILITY', nb: 'CREDIT' },
  { id: '250', code: '2210.01.001', name: 'Liabilitas Pajak Tangguhan',       type: 'LIABILITY', nb: 'CREDIT' },
  { id: '251', code: '2220.01.001', name: 'Cadangan Imbalan Pasca-Kerja',     type: 'LIABILITY', nb: 'CREDIT' },
  { id: '252', code: '3101.01.001', name: 'Modal Saham Disetor',              type: 'EQUITY',    nb: 'CREDIT' },
  { id: '253', code: '3102.01.001', name: 'Tambahan Modal Disetor (Agio)',    type: 'EQUITY',    nb: 'CREDIT' },
  { id: '254', code: '3103.01.001', name: 'Saldo Laba Ditahan',               type: 'EQUITY',    nb: 'CREDIT' },
  { id: '255', code: '3104.01.001', name: 'Laba (Rugi) Tahun Berjalan',       type: 'EQUITY',    nb: 'CREDIT' },
  { id: '256', code: '3110.01.001', name: 'Cadangan Umum',                    type: 'EQUITY',    nb: 'CREDIT' },
  { id: '257', code: '3111.01.001', name: 'Cadangan Khusus',                  type: 'EQUITY',    nb: 'CREDIT' },
  { id: '258', code: '3120.01.001', name: 'Selisih Kurs Penjabaran',          type: 'EQUITY',    nb: 'CREDIT' },
  { id: '259', code: '4101.01.001', name: 'Penjualan Produk Jadi',            type: 'REVENUE',   nb: 'CREDIT' },
  { id: '260', code: '4102.01.001', name: 'Penjualan Jasa Pengolahan',        type: 'REVENUE',   nb: 'CREDIT' },
  { id: '261', code: '4103.01.001', name: 'Penjualan Bahan Baku / Sisa',      type: 'REVENUE',   nb: 'CREDIT' },
  { id: '262', code: '4110.01.001', name: 'Retur Penjualan',                  type: 'REVENUE',   nb: 'DEBIT'  },
  { id: '263', code: '4111.01.001', name: 'Diskon Penjualan',                 type: 'REVENUE',   nb: 'DEBIT'  },
  { id: '264', code: '4201.01.001', name: 'Pendapatan Bunga Bank',            type: 'REVENUE',   nb: 'CREDIT' },
  { id: '265', code: '4202.01.001', name: 'Keuntungan Selisih Kurs',          type: 'REVENUE',   nb: 'CREDIT' },
  { id: '266', code: '4203.01.001', name: 'Keuntungan Penjualan Aset Tetap',  type: 'REVENUE',   nb: 'CREDIT' },
  { id: '267', code: '4204.01.001', name: 'Dividen Diterima',                 type: 'REVENUE',   nb: 'CREDIT' },
  { id: '268', code: '4205.01.001', name: 'Pendapatan Sewa',                  type: 'REVENUE',   nb: 'CREDIT' },
  { id: '269', code: '4206.01.001', name: 'Pendapatan Lainnya',               type: 'REVENUE',   nb: 'CREDIT' },
  { id: '270', code: '5101.01.001', name: 'Pemakaian Bahan Baku',             type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '271', code: '5102.01.001', name: 'Pemakaian Bahan Pembantu',         type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '272', code: '5103.01.001', name: 'Tenaga Kerja Langsung',            type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '273', code: '5110.01.001', name: 'Overhead Pabrik — Tetap',          type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '274', code: '5111.01.001', name: 'Overhead Pabrik — Variabel',       type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '275', code: '5120.01.001', name: 'Penyusutan Mesin Produksi',        type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '276', code: '5121.01.001', name: 'Biaya Pemeliharaan Mesin',         type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '277', code: '5122.01.001', name: 'Biaya Listrik Pabrik',             type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '278', code: '5123.01.001', name: 'Biaya Air dan Gas Pabrik',         type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '279', code: '5201.01.001', name: 'Beban Pengiriman Pembelian',       type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '280', code: '5202.01.001', name: 'Beban Pengiriman Penjualan',       type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '281', code: '6101.01.001', name: 'Beban Gaji Bagian Penjualan',      type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '282', code: '6102.01.001', name: 'Beban Komisi Agen / Salesman',     type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '283', code: '6103.01.001', name: 'Beban Promosi dan Iklan',          type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '284', code: '6104.01.001', name: 'Beban Transportasi Penjualan',     type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '285', code: '6105.01.001', name: 'Beban Kemasan',                    type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '286', code: '6106.01.001', name: 'Beban Pameran dan Expo',           type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '287', code: '6107.01.001', name: 'Beban Garansi dan Retur Pelanggan',type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '288', code: '6201.01.001', name: 'Beban Gaji Direksi',               type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '289', code: '6202.01.001', name: 'Beban Gaji Staff Administrasi',    type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '290', code: '6203.01.001', name: 'Beban Tunjangan Karyawan',         type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '291', code: '6204.01.001', name: 'Beban BPJS Ketenagakerjaan',       type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '292', code: '6205.01.001', name: 'Beban BPJS Kesehatan',             type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '293', code: '6210.01.001', name: 'Beban Alat Tulis Kantor',          type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '294', code: '6211.01.001', name: 'Beban Sewa Kantor dan Gedung',     type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '295', code: '6212.01.001', name: 'Beban Listrik, Air, dan Gas',      type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '296', code: '6213.01.001', name: 'Beban Telepon dan Internet',       type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '297', code: '6214.01.001', name: 'Beban Perjalanan Dinas',           type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '298', code: '6215.01.001', name: 'Beban Pemeliharaan Gedung',        type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '299', code: '6216.01.001', name: 'Beban Asuransi',                   type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '300', code: '6217.01.001', name: 'Beban Penyusutan Aset Tetap',      type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '301', code: '6218.01.001', name: 'Beban Amortisasi Aset Tak Berwujud',type:'EXPENSE',   nb: 'DEBIT'  },
  { id: '302', code: '6219.01.001', name: 'Beban Pajak dan Retribusi Daerah', type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '303', code: '6220.01.001', name: 'Beban Representasi dan Entertainment',type:'EXPENSE', nb: 'DEBIT'  },
  { id: '304', code: '6221.01.001', name: 'Beban Jasa Profesional',           type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '305', code: '6222.01.001', name: 'Beban Piutang Tak Tertagih',       type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '306', code: '6223.01.001', name: 'Beban Keamanan dan K3',            type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '307', code: '6224.01.001', name: 'Beban Lain-lain Administrasi',     type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '308', code: '6301.01.001', name: 'Beban Bunga Pinjaman Bank',        type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '309', code: '6302.01.001', name: 'Beban Administrasi Bank',          type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '310', code: '6303.01.001', name: 'Beban Selisih Kurs',               type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '311', code: '6304.01.001', name: 'Beban Provisi dan Biaya Kredit',   type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '312', code: '6305.01.001', name: 'Beban Denda Pajak',                type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '313', code: '7101.01.001', name: 'Kerugian Bencana Alam / Kerusakan',type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '314', code: '7102.01.001', name: 'Kerugian Penjualan Aset Tetap',    type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '315', code: '7103.01.001', name: 'Beban Restrukturisasi',            type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '316', code: '7201.01.001', name: 'Beban Pajak Penghasilan Badan',    type: 'EXPENSE',   nb: 'DEBIT'  },
  { id: '317', code: '7202.01.001', name: 'Pajak Tangguhan',                  type: 'EXPENSE',   nb: 'DEBIT'  },
];

// Account subsets
const BANK_ACCOUNTS = ACCOUNTS.filter(a => a.name.startsWith('Bank ')).filter(a => !a.name.includes('USD'));
const EXPENSE_ACCOUNTS = ACCOUNTS.filter(a => a.type === 'EXPENSE');
const REVENUE_ACCOUNTS = ACCOUNTS.filter(a => a.type === 'REVENUE' && a.nb === 'CREDIT');
const LIABILITY_ACCOUNTS = ACCOUNTS.filter(a => a.type === 'LIABILITY' && a.nb === 'CREDIT');
const ASSET_ACCOUNTS = ACCOUNTS.filter(a => a.type === 'ASSET' && a.nb === 'DEBIT');
const ALL_EXCEPT_BANKS = ACCOUNTS.filter(a => !BANK_ACCOUNTS.some(b => b.id === a.id));

// ─── Helpers (string-based date ops, no TZ surprises) ────────────────────────

/** Parse YYYY-MM-DD to {y,m,d} */
function parseDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return { y, m, d };
}

/** Format {y,m,d} to YYYY-MM-DD */
function fmtDate({ y, m, d }) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function dateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Add n days to YYYY-MM-DD or Date, returns Date (noon WIB-safe) */
function addDays(d, n) {
  // Use noon to avoid DST/TZ midnight issues
  const base = typeof d === 'string'
    ? new Date(d + 'T12:00:00+07:00')
    : new Date(dateStr(d) + 'T12:00:00+07:00');
  return new Date(base.getTime() + n * 86400000);
}

/** Add n months to YYYY-MM-DD or Date, clamps day to last-day-of-month, returns Date */
function addMonths(d, n) {
  const parts = typeof d === 'string' ? parseDate(d) : parseDate(dateStr(d));
  let y = parts.y, m = parts.m + n, day = parts.d;
  while (m > 12) { y++; m -= 12; }
  while (m < 1)  { y--; m += 12; }
  const lastDay = new Date(y, m, 0).getDate();
  const d2 = Math.min(day, lastDay);
  return new Date(y, m - 1, d2, 12, 0, 0);
}

/** Days between two YYYY-MM-DD strings */
function daysBetween(from, to) {
  const a = new Date(from + 'T00:00:00+07:00');
  const b = new Date(to + 'T00:00:00+07:00');
  return Math.round((b - a) / 86400000);
}

/** Build list of {y,m} months from y1-m1 through y2-m2 inclusive */
function monthRange(y1, m1, y2, m2) {
  const months = [];
  let y = y1, m = m1;
  while (y < y2 || (y === y2 && m <= m2)) {
    months.push({ y, m });
    m++;
    if (m > 12) { m = 1; y++; }
  }
  return months;
}

/** Deterministic pseudo-random based on seed index (mulberry32 hash) */
function seeded(idx, max) {
  if (max <= 0) return 0;
  let t = Number(idx) + 0x6D2B79F5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const r = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return Math.floor(r * max);
}

function pick(arr, idx) {
  return arr[Number(seeded(idx, arr.length))];
}

function amountRange(idx, minK, maxK) {
  const base = Number(seeded(idx + 99, (maxK - minK) * 1000));
  return (minK * 1000 + base * 1000).toFixed(4);
}

function amount(idx) {
  return amountRange(idx, 500, 25000); // Rp500k – Rp25jt
}

/** Generate unique giro number */
function giroNumber(idx, prefix) {
  const seq = String(idx + 1).padStart(5, '0');
  return `${prefix}-${seq}`;
}

const GIRO_BANK_NAMES = ['Bank BCA', 'Bank Mandiri', 'Bank BNI', 'Bank BRI', 'Bank CIMB Niaga', 'Bank Danamon', 'Bank Permata'];
const GIRO_BANK_PREFIXES = ['BG', 'CG', 'CEK'];

// ─── Type Definitions ────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  GENERAL_JOURNAL:      { key: 'GENERAL_JOURNAL',      label: 'General Journal',       kind: 'journal',   journalType: 'GENERAL',       count: 90 },
  ADJUSTMENT_JOURNAL:   { key: 'ADJUSTMENT_JOURNAL',   label: 'Adjustment Journal',    kind: 'journal',   journalType: 'ADJUSTMENT',    count: 90 },
  MEMORIAL_JOURNAL:     { key: 'MEMORIAL_JOURNAL',     label: 'Memorial Journal',      kind: 'journal',   journalType: 'MEMORIAL',      count: 90 },
  FX_REVALUATION:       { key: 'FX_REVALUATION',       label: 'FX Revaluation',        kind: 'journal',   journalType: 'REVALUATION',    count: 90 },
  RECEIPT_GIRO:         { key: 'RECEIPT_GIRO',         label: 'Receipt Giro',          kind: 'giro-reg',   giroType: 'INCOMING',        count: 100 },
  SEND_GIRO:            { key: 'SEND_GIRO',            label: 'Send Giro',             kind: 'giro-reg',   giroType: 'OUTGOING',        count: 100 },
  RECEIPT_GIRO_CLEARING:{ key: 'RECEIPT_GIRO_CLEARING',label: 'Receipt Giro Clearing', kind: 'giro-clear', giroType: 'INCOMING',        count: 45 },
  SEND_GIRO_CLEARING:   { key: 'SEND_GIRO_CLEARING',   label: 'Send Giro Clearing',    kind: 'giro-clear', giroType: 'OUTGOING',        count: 45 },
  RECEIPT_MEMO:         { key: 'RECEIPT_MEMO',         label: 'Receipt Memo',          kind: 'cashbank',   direction: 'RECEIPT',       count: 100 },
  SEND_MEMO:            { key: 'SEND_MEMO',            label: 'Send Memo',             kind: 'cashbank',   direction: 'DISBURSEMENT',  count: 100 },
  CASH_BANK_TRANSFER:   { key: 'CASH_BANK_TRANSFER',   label: 'Cash/Bank Transfer',    kind: 'transfer',                                   count: 100 },
};

// Ensure total = 1000 (90+90+90+90+100+100+45+45+100+100+100 = 950, need +50)
// Adjust some counts
TYPE_CONFIG.GENERAL_JOURNAL.count = 95;
TYPE_CONFIG.ADJUSTMENT_JOURNAL.count = 95;
TYPE_CONFIG.MEMORIAL_JOURNAL.count = 95;
TYPE_CONFIG.FX_REVALUATION.count = 95;
TYPE_CONFIG.CASH_BANK_TRANSFER.count = 95;
// Total: 95+95+95+95+100+100+45+45+100+100+95 = 965 ... need 35 more
TYPE_CONFIG.RECEIPT_MEMO.count = 110;
TYPE_CONFIG.SEND_MEMO.count = 110;
TYPE_CONFIG.GENERAL_JOURNAL.count = 100;
TYPE_CONFIG.ADJUSTMENT_JOURNAL.count = 100;
// Total: 100+100+95+95+100+100+45+45+110+110+95 = 995 ... need 5 more
TYPE_CONFIG.RECEIPT_GIRO_CLEARING.count = 48;
TYPE_CONFIG.SEND_GIRO_CLEARING.count = 47;
// Total: 100+100+95+95+100+100+48+47+110+110+95 = 1000 ✓

// ─── Journal Entry Generator ─────────────────────────────────────────────────

const JOURNAL_DESCS = {
  GENERAL:     ['Pencatatan jurnal umum bank', 'Koreksi saldo rekening', 'Biaya administrasi bulanan', 'Penyesuaian saldo bank'],
  ADJUSTMENT:  ['Penyesuaian nilai aset per bank', 'Koreksi saldo rekening bank', 'Reklasifikasi akun bank', 'Penyesuaian penilaian'],
  MEMORIAL:    ['Jurnal memorial bank', 'Alokasi biaya administrasi bank', 'Koreksi pembukuan rekening', 'Penyesuaian akhir periode'],
  REVALUATION: ['Revaluasi kurs valas', 'Penyesuaian selisih kurs', 'Revaluasi akun mata uang asing', 'Mark-to-market valuta asing'],
};

function generateJournalEntry(i, date, journalType) {
  // For bank-related journal: one leg is a bank account, the other is a non-bank
  const useBankAsDebit = seeded(i * 13 + 5, 2) === 0;
  const bankAcc = pick(BANK_ACCOUNTS, i * 3 + 1);
  const otherAcc = pick(ALL_EXCEPT_BANKS, i * 7 + 3);
  const amt = amount(i);
  const descs = JOURNAL_DESCS[journalType] ?? JOURNAL_DESCS.GENERAL;
  const desc = pick(descs, i * 5 + 7);

  let debitAcc, creditAcc;
  if (useBankAsDebit) {
    debitAcc = bankAcc;
    creditAcc = otherAcc;
  } else {
    debitAcc = otherAcc;
    creditAcc = bankAcc;
  }

  return {
    journalType,
    branchId: BRANCH_ID,
    entryDate: dateStr(date),
    description: `${desc} - ${bankAcc.code} (${bankAcc.name})`,
    currencyId: CURRENCY_ID,
    exchangeRate: EXCHANGE_RATE,
    auto: true,
    source: SOURCE,
    lines: [
      { accountId: debitAcc.id,  debit: amt,   credit: '0.0000', lineNo: 1, notes: `Dr ${debitAcc.name}` },
      { accountId: creditAcc.id, debit: '0.0000', credit: amt,   lineNo: 2, notes: `Cr ${creditAcc.name}` },
    ],
  };
}

// ─── Cash/Bank Transaction Generator ─────────────────────────────────────────

function generateCashBankReceiptMemo(i, date) {
  // Receipt Memo: Bank debits (money IN), contra account credits (revenue/liability)
  const bankAcc = pick(BANK_ACCOUNTS, i * 5 + 1);
  const contraAcc = pick([...REVENUE_ACCOUNTS, ...LIABILITY_ACCOUNTS], i * 3 + 2);
  const amt = amount(i);
  const descs = ['Penerimaan bank', 'Setoran masuk', 'Transfer masuk', 'Penerimaan pembayaran', 'Setoran tunai'];
  const desc = pick(descs, i * 7 + 1);

  return {
    direction: 'RECEIPT',
    kind: 'BANK',
    paymentMethod: 'OTHER',
    branchId: BRANCH_ID,
    transactionDate: dateStr(date),
    bankAccountId: bankAcc.id,
    description: `[Bank Receipt Memo] ${desc} - ${bankAcc.name}`,
    currencyId: CURRENCY_ID,
    exchangeRate: EXCHANGE_RATE,
    auto: true,
    source: SOURCE,
    lines: [
      { accountId: contraAcc.id, amount: amt, lineNo: 1, notes: `Cr ${contraAcc.name}` },
    ],
  };
}

function generateCashBankSendMemo(i, date) {
  // Send Memo: Contra account debits (expense), Bank credits (money OUT)
  const bankAcc = pick(BANK_ACCOUNTS, i * 7 + 2);
  const contraAcc = pick(EXPENSE_ACCOUNTS, i * 3 + 5);
  const amt = amount(i);
  const descs = ['Pengeluaran bank', 'Transfer keluar', 'Pembayaran via bank', 'Biaya operasional', 'Pembayaran supplier'];
  const desc = pick(descs, i * 9 + 3);

  return {
    direction: 'DISBURSEMENT',
    kind: 'BANK',
    paymentMethod: 'OTHER',
    branchId: BRANCH_ID,
    transactionDate: dateStr(date),
    bankAccountId: bankAcc.id,
    description: `[Bank Send Memo] ${desc} - ${bankAcc.name}`,
    currencyId: CURRENCY_ID,
    exchangeRate: EXCHANGE_RATE,
    auto: true,
    source: SOURCE,
    lines: [
      { accountId: contraAcc.id, amount: amt, lineNo: 1, notes: `Dr ${contraAcc.name}` },
    ],
  };
}

function generateCashBankTransfer(i, date) {
  // Transfer: debit one bank, credit another (via cash-bank DISBURSEMENT)
  const fromBank = pick(BANK_ACCOUNTS, i * 11 + 1);
  let toBank = pick(BANK_ACCOUNTS, i * 7 + 3);
  let retry = 0;
  while (toBank.id === fromBank.id) {
    toBank = pick(BANK_ACCOUNTS, i * 13 + 5 + retry);
    retry++;
    if (retry > 100) break; // safety valve
  }
  const amt = amount(i);
  const desc = `Transfer antar bank: ${fromBank.name} → ${toBank.name}`;

  return {
    direction: 'DISBURSEMENT',
    kind: 'BANK',
    paymentMethod: 'TRANSFER',
    branchId: BRANCH_ID,
    transactionDate: dateStr(date),
    bankAccountId: fromBank.id,
    description: `[Cash/Bank Transfer] ${desc}`,
    currencyId: CURRENCY_ID,
    exchangeRate: EXCHANGE_RATE,
    auto: true,
    source: SOURCE,
    lines: [
      { accountId: toBank.id, amount: amt, lineNo: 1, notes: `Transfer ke ${toBank.name}` },
    ],
  };
}

// ─── Giro Entry Generator ────────────────────────────────────────────────────

function generateGiroRegister(i, date, type) {
  // Create 1-3 giro instruments per entry
  const rowCount = 1 + Number(seeded(i * 17 + 3, 3));
  const rows = [];
  const prefix = type === 'INCOMING' ? 'BGM' : 'BGK';

  for (let r = 0; r < rowCount; r++) {
    const gNum = giroNumber(i * 10 + r, prefix);
    const bank = pick(GIRO_BANK_NAMES, i * 19 + r * 7);
    const dueOffset = 14 + Number(seeded(i * 23 + r * 11, 60)); // 14-74 days from entry
    const dueDate = addDays(date, dueOffset);
    rows.push({
      giroNumber: gNum,
      bankName: bank,
      dueDate: dateStr(dueDate),
      amount: amount(i * 100 + r),
      notes: `${type === 'INCOMING' ? 'Giro Masuk' : 'Giro Keluar'} - ${bank} #${gNum}`,
    });
  }

  const totalAmt = rows.reduce((sum, r) => sum + parseFloat(r.amount), 0).toFixed(4);
  const desc = type === 'INCOMING'
    ? `Registrasi Giro Masuk - ${rows.length} instrumen, total Rp${Number(totalAmt).toLocaleString('id-ID')}`
    : `Registrasi Giro Keluar - ${rows.length} instrumen, total Rp${Number(totalAmt).toLocaleString('id-ID')}`;

  // For giro register: use giro control account
  const giroControlAcc = type === 'INCOMING'
    ? ACCOUNTS.find(a => a.id === '196')  // Giro Masuk Dalam Proses Kliring
    : ACCOUNTS.find(a => a.id === '237'); // Giro Keluar Dalam Proses
  const bankAcc = pick(BANK_ACCOUNTS, i * 13 + 1);

  return {
    kind: 'REGISTER',
    type,
    branchId: BRANCH_ID,
    entryDate: dateStr(date),
    bankAccountId: bankAcc.id,
    giroAccountId: giroControlAcc ? giroControlAcc.id : bankAcc.id,
    currencyId: CURRENCY_ID,
    exchangeRate: EXCHANGE_RATE,
    description: desc,
    notes: `Source: ${SOURCE}`,
    auto: true,
    rows,
  };
}

// ─── API Functions ───────────────────────────────────────────────────────────

async function login() {
  const res = await fetch(`${API_BASE}/erp/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login: LOGIN_FIELD, password: PASSWORD }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Login failed ${res.status}: ${text}`);
  }
  const json = await res.json();
  const token = json?.data?.token ?? json?.data?.accessToken ?? json?.token;
  if (!token) throw new Error(`Token tidak ditemukan: ${JSON.stringify(json)}`);
  console.log(`✅ Login berhasil (token length=${token.length})`);
  return token;
}

async function createJournalEntry(token, payload) {
  const res = await fetch(`${API_BASE}/erp/fin/journal-entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Journal create ${res.status}: ${text.slice(0, 200)}`);
  }
  return await res.json();
}

async function createCashBankTransaction(token, payload) {
  const res = await fetch(`${API_BASE}/erp/fin/cash-bank-transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`CashBank create ${res.status}: ${text.slice(0, 200)}`);
  }
  return await res.json();
}

async function createGiroEntry(token, payload) {
  const res = await fetch(`${API_BASE}/erp/fin/giro-entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GiroEntry create ${res.status}: ${text.slice(0, 200)}`);
  }
  return await res.json();
}

async function postJournal(token, id) {
  return await submitApprovePost(token, id, 'journal-entries');
}

async function postCashBank(token, id) {
  return await submitApprovePost(token, id, 'cash-bank-transactions');
}

async function postGiroEntry(token, id) {
  return await submitApprovePost(token, id, 'giro-entries');
}

async function submitApprovePost(token, id, endpoint) {
  const base = `${API_BASE}/erp/fin/${endpoint}`;
  // SUBMIT
  let res = await fetch(`${base}/${id}/transition`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ action: 'SUBMIT' }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`SUBMIT ${id} ${res.status}: ${t.slice(0, 100)}`);
  }
  // APPROVE
  res = await fetch(`${base}/${id}/transition`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ action: 'APPROVE' }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`APPROVE ${id} ${res.status}: ${t.slice(0, 100)}`);
  }
  // POST
  res = await fetch(`${base}/${id}/transition`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ action: 'POST' }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`POST ${id} ${res.status}: ${t.slice(0, 100)}`);
  }
  return true;
}

async function fetchOutstandingGiros(token, type) {
  const res = await fetch(`${API_BASE}/erp/fin/giros/outstanding?type=${type}&limit=500`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Outstanding giros ${res.status}: ${t.slice(0, 100)}`);
  }
  const json = await res.json();
  return json?.data ?? json ?? [];
}

// ─── Schedule Builder ────────────────────────────────────────────────────────

/**
 * Build a list of { type, date, entry } items covering all months
 * from Jan 2025 through Jun 2026, distributed across the 11 types.
 */
function buildSchedule() {
  const MONTHS = monthRange(2025, 1, 2026, 6); // 18 months

  // Non-clearing types processed in Phase 2; clearing in Phase 3
  const allTypes = Object.values(TYPE_CONFIG);
  const typeList = allTypes.filter(tc => tc.kind !== 'giro-clear');
  const clearingTypes = allTypes.filter(tc => tc.kind === 'giro-clear');

  const entriesByType = {};

  for (const tc of typeList) {
    entriesByType[tc.key] = [];
    // Distribute evenly: floor(count/months) per month, then spread remainder
    const basePerMonth = Math.floor(tc.count / MONTHS.length); // at least 1 if count >= months
    let remainder = tc.count - basePerMonth * MONTHS.length;
    let assigned = 0;

    for (let mi = 0; mi < MONTHS.length; mi++) {
      const { y, m } = MONTHS[mi];
      // Add 1 extra to first `remainder` months
      const thisMonth = basePerMonth + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;
      if (thisMonth === 0) continue; // skip months with 0 entries for this type

      const maxDay = Math.min(new Date(y, m, 0).getDate(), 28);

      for (let j = 0; j < thisMonth; j++) {
        const day = 1 + seeded(tc.key.length * 1000 + mi * 31 + j * 7, maxDay);
        const date = new Date(y, m - 1, day, 12, 0, 0);

        const entry = generateEntry(tc, assigned + j, date);
        if (entry) {
          entriesByType[tc.key].push({ type: tc, date, entry, idx: assigned + j });
        }
        assigned++;
      }
    }
  }

  return { entriesByType, clearingTypes, MONTHS };
}

function generateEntry(tc, i, date) {
  try {
    switch (tc.kind) {
      case 'journal':
        return generateJournalEntry(i, date, tc.journalType);
      case 'cashbank':
        if (tc.direction === 'RECEIPT') return generateCashBankReceiptMemo(i, date);
        return generateCashBankSendMemo(i, date);
      case 'giro-reg':
        return generateGiroRegister(i, date, tc.giroType);
      case 'transfer':
        return generateCashBankTransfer(i, date);
      default:
        return null;
    }
  } catch(e) {
    console.error('generateEntry error for', tc.key, 'i=', i, ':', e.message);
    return null;
  }
}

// ─── Concurrency Pool ────────────────────────────────────────────────────────

async function runWithConcurrency(tasks, concurrency) {
  const results = new Array(tasks.length);
  let idx = 0;
  const workers = Array(concurrency).fill(null).map(async () => {
    while (idx < tasks.length) {
      const i = idx++;
      try {
        results[i] = await tasks[i]();
      } catch (e) {
        results[i] = { __error: e.message };
      }
    }
  });
  await Promise.all(workers);
  return results;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🚀 ERP Bank Out 1000 Seeder`);
  console.log(`   API      : ${API_BASE}`);
  console.log(`   DryRun   : ${DRY_RUN}`);
  console.log(`   Concur   : ${CONCURRENCY}`);
  console.log(`   SkipClear: ${SKIP_CLEAR}`);
  console.log(`   Source   : ${SOURCE}\n`);

  const { entriesByType, clearingTypes } = buildSchedule();

  // Show distribution
  console.log('📊 Distribusi per type:');
  let grandTotal = 0;
  for (const tc of Object.values(TYPE_CONFIG)) {
    const entries = entriesByType[tc.key];
    const count = entries ? entries.length : (tc.kind === 'giro-clear' ? tc.count : 0);
    console.log(`   ${tc.label.padEnd(24)} : ${count}`);
    grandTotal += count;
  }
  console.log(`   ${'─'.repeat(24)}`);
  console.log(`   TOTAL                    : ${grandTotal}\n`);

  if (DRY_RUN) {
    // Show month summary
    const monthMap = {};
    for (const [key, entries] of Object.entries(entriesByType)) {
      for (const e of entries) {
        const mk = `${e.date.getFullYear()}-${String(e.date.getMonth()+1).padStart(2,'0')}`;
        if (!monthMap[mk]) monthMap[mk] = 0;
        monthMap[mk]++;
      }
    }
    console.log('📅 Distribusi per bulan:');
    for (const [m, c] of Object.entries(monthMap).sort()) console.log(`   ${m}: ${c} entries`);
    console.log('\n🟡 DRY RUN — tidak ada yang dikirim ke API.');
    return;
  }

  // ── Phase 1: Login ─────────────────────────────────────────────────────────
  const token = await login();

  // ── Phase 2: Create all non-clearing entries ───────────────────────────────
  console.log('\n── Phase 2: Creating non-clearing entries ──\n');

  const allTasks = [];
  let taskIdx = 0;

  for (const [typeKey, entries] of Object.entries(entriesByType)) {
    const tc = Object.values(TYPE_CONFIG).find(t => t.key === typeKey);
    for (const { type: tConfig, date, entry, idx } of entries) {
      const label = `${tConfig.label} #${idx + 1} (${dateStr(date)})`;
      allTasks.push({
        label,
        typeConfig: tConfig,
        entry,
        idx: taskIdx++,
      });
    }
  }

  // Shuffle tasks for more interesting date distribution
  // (tasks are created in order by type, shuffle to interleave)
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Number(seeded(i * 7919 + 104729, 2 ** 31)) / (2 ** 31) * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  // Don't fully shuffle - just interleave types slightly
  // We'll process by order they're in

  let created = 0;
  let posted = 0;
  let failed = 0;
  const errors = [];
  const startTime = Date.now();

  // Track giro register entry IDs and their created giro instruments for clearing
  const createdIncomingGiros = []; // { giroId, clearedDate }
  const createdOutgoingGiros = [];

  const taskFns = allTasks.map((task) => async () => {
    try {
      let result;
      const tc = task.typeConfig;

      // Create based on type
      if (tc.kind === 'journal') {
        result = await createJournalEntry(token, task.entry);
      } else if (tc.kind === 'cashbank' || tc.kind === 'transfer') {
        result = await createCashBankTransaction(token, task.entry);
      } else if (tc.kind === 'giro-reg') {
        result = await createGiroEntry(token, task.entry);
      }

      const id = result?.data?.id ?? result?.id;
      if (!id) throw new Error(`No ID in response: ${JSON.stringify(result).slice(0, 100)}`);
      created++;

      // Post (SUBMIT → APPROVE → POST)
      try {
        if (tc.kind === 'journal') {
          await postJournal(token, id);
        } else if (tc.kind === 'cashbank' || tc.kind === 'transfer') {
          await postCashBank(token, id);
        } else if (tc.kind === 'giro-reg') {
          await postGiroEntry(token, id);
          // Collect created giro instruments for clearing phase
          // The giro entry response should contain rows with giro IDs
          const rows = result?.data?.rows ?? result?.rows ?? [];
          for (const row of rows) {
            if (row.giroId) {
              const target = tc.giroType === 'INCOMING' ? createdIncomingGiros : createdOutgoingGiros;
              target.push({ giroId: String(row.giroId), clearedDate: dateStr(addDays(new Date(task.entry.entryDate), 30 + Number(seeded(task.idx * 41, 30)))) });
            }
          }
        }
        posted++;
      } catch (e) {
        errors.push(`[${task.label}] POST error: ${e.message}`);
      }
    } catch (e) {
      failed++;
      errors.push(`[${task.label}] Create error: ${e.message}`);
    }

    const total = created + failed;
    if (total % 50 === 0 || total === allTasks.length) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const rate = (total / parseFloat(elapsed)).toFixed(1);
      process.stdout.write(`\r   Phase 2: ${total}/${allTasks.length} | ✅${created} ❌${failed} | ${elapsed}s | ${rate}/s   `);
    }
  });

  await runWithConcurrency(taskFns, CONCURRENCY);

  let elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n\n✅ Phase 2 selesai dalam ${elapsed}s`);
  console.log(`   Created : ${created}`);
  console.log(`   Posted  : ${posted}`);
  console.log(`   Failed  : ${failed}`);

  // Also fetch outstanding giros if our creation didn't capture them
  if (createdIncomingGiros.length === 0 && !SKIP_CLEAR) {
    console.log('\n⚠️  No giro IDs captured from create responses. Fetching outstanding giros...');
    try {
      createdIncomingGiros.push(...(await fetchOutstandingGiros(token, 'INCOMING')).map(g => ({
        giroId: String(g.id), clearedDate: dateStr(addDays(new Date(), 30)),
      })));
      console.log(`   Fetched ${createdIncomingGiros.length} incoming giros`);
    } catch (e) {
      console.log(`   Fetch incoming giros error: ${e.message}`);
    }
    try {
      createdOutgoingGiros.push(...(await fetchOutstandingGiros(token, 'OUTGOING')).map(g => ({
        giroId: String(g.id), clearedDate: dateStr(addDays(new Date(), 30)),
      })));
      console.log(`   Fetched ${createdOutgoingGiros.length} outgoing giros`);
    } catch (e) {
      console.log(`   Fetch outgoing giros error: ${e.message}`);
    }
  }

  console.log(`   Incoming giros available for clearing: ${createdIncomingGiros.length}`);
  console.log(`   Outgoing giros available for clearing: ${createdOutgoingGiros.length}`);

  // ── Phase 3: Giro Clearing ─────────────────────────────────────────────────
  if (SKIP_CLEAR) {
    console.log('\n⏭️  Phase 3 (Giro Clearing) skipped (--skip-clear).');
  } else if (createdIncomingGiros.length === 0 && createdOutgoingGiros.length === 0) {
    console.log('\n⏭️  Phase 3 (Giro Clearing) skipped — no outstanding giros available.');
  } else {
    console.log('\n── Phase 3: Creating giro clearing entries ──\n');

    const clearTasks = [];

    // Receipt Giro Clearing (INCOMING)
    const incomingClears = Math.min(TYPE_CONFIG.RECEIPT_GIRO_CLEARING.count, createdIncomingGiros.length);
    for (let i = 0; i < incomingClears; i++) {
      const g = createdIncomingGiros[i];
      const clearingDate = g.clearedDate || dateStr(addDays(new Date(), 30));
      const entryDate = addDays(new Date(clearingDate), -3); // entry 3 days before clearing

      const bankAcc = pick(BANK_ACCOUNTS, i * 17 + 2);
      const desc = `Kliring Giro Masuk #${g.giroId}`;

      clearTasks.push({
        label: `Receipt Giro Clearing #${i + 1}`,
        payload: {
          kind: 'CLEAR',
          type: 'INCOMING',
          branchId: BRANCH_ID,
          entryDate: dateStr(entryDate),
          bankAccountId: bankAcc.id,
          currencyId: CURRENCY_ID,
          exchangeRate: EXCHANGE_RATE,
          description: desc,
          notes: `Clear giro #${g.giroId} | Source: ${SOURCE}`,
          auto: true,
          rows: [{
            giroId: String(g.giroId),
            clearedDate: clearingDate,
            notes: `Kliring giro ${g.giroId}`,
          }],
        },
      });
    }

    // Send Giro Clearing (OUTGOING)
    const outgoingClears = Math.min(TYPE_CONFIG.SEND_GIRO_CLEARING.count, createdOutgoingGiros.length);
    for (let i = 0; i < outgoingClears; i++) {
      const g = createdOutgoingGiros[i];
      const clearingDate = g.clearedDate || dateStr(addDays(new Date(), 30));
      const entryDate = addDays(new Date(clearingDate), -3);

      const bankAcc = pick(BANK_ACCOUNTS, i * 19 + 3);
      const desc = `Kliring Giro Keluar #${g.giroId}`;

      clearTasks.push({
        label: `Send Giro Clearing #${i + 1}`,
        payload: {
          kind: 'CLEAR',
          type: 'OUTGOING',
          branchId: BRANCH_ID,
          entryDate: dateStr(entryDate),
          bankAccountId: bankAcc.id,
          currencyId: CURRENCY_ID,
          exchangeRate: EXCHANGE_RATE,
          description: desc,
          notes: `Clear giro #${g.giroId} | Source: ${SOURCE}`,
          auto: true,
          rows: [{
            giroId: String(g.giroId),
            clearedDate: clearingDate,
            notes: `Kliring giro ${g.giroId}`,
          }],
        },
      });
    }

    console.log(`   Receipt Giro Clearing entries : ${incomingClears}`);
    console.log(`   Send Giro Clearing entries    : ${outgoingClears}`);
    console.log(`   Total clearing entries        : ${clearTasks.length}\n`);

    let cCreated = 0, cPosted = 0, cFailed = 0;
    const cStartTime = Date.now();

    const clearFns = clearTasks.map((task) => async () => {
      try {
        const result = await createGiroEntry(token, task.payload);
        const id = result?.data?.id ?? result?.id;
        if (!id) throw new Error(`No ID: ${JSON.stringify(result).slice(0, 100)}`);
        cCreated++;
        try {
          await postGiroEntry(token, id);
          cPosted++;
        } catch (e) {
          errors.push(`[${task.label}] POST error: ${e.message}`);
        }
      } catch (e) {
        cFailed++;
        errors.push(`[${task.label}] Create error: ${e.message}`);
      }

      const total = cCreated + cFailed;
      if (total % 25 === 0 || total === clearTasks.length) {
        const celapsed = ((Date.now() - cStartTime) / 1000).toFixed(1);
        process.stdout.write(`\r   Phase 3: ${total}/${clearTasks.length} | ✅${cCreated} ❌${cFailed} | ${celapsed}s   `);
      }
    });

    await runWithConcurrency(clearFns, CONCURRENCY);

    const cElapsed = ((Date.now() - cStartTime) / 1000).toFixed(1);
    console.log(`\n\n✅ Phase 3 selesai dalam ${cElapsed}s`);
    console.log(`   Created : ${cCreated}`);
    console.log(`   Posted  : ${cPosted}`);
    console.log(`   Failed  : ${cFailed}`);

    // Update totals
    created += cCreated;
    posted += cPosted;
    failed += cFailed;
  }

  // ── Summary ─────────────────────────────────────────────────────────────────
  elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`✅ FINAL — Bank Out 1000 Seeder selesai dalam ${elapsed}s`);
  console.log(`   Total Created : ${created}`);
  console.log(`   Total Posted  : ${posted}`);
  console.log(`   Total Failed  : ${failed}`);
  console.log(`   Source marker : ${SOURCE}`);
  console.log(`${'═'.repeat(60)}\n`);

  if (errors.length > 0) {
    console.log(`⚠️  Errors (${errors.length}):`);
    errors.slice(0, 30).forEach(e => console.log('  ', e));
    if (errors.length > 30) console.log(`  ... dan ${errors.length - 30} error lainnya`);
  }
}

main().catch(e => {
  console.error('\n❌ Fatal:', e.message);
  process.exit(1);
});
