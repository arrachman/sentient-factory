/**
 * seed-adjustment-journals.mjs
 *
 * Generate 2000 Adjustment Journal entries mulai 1 Des 2025,
 * terdistribusi merata per hari, mencakup semua postable accounts.
 * Setiap entry di-POST (confirm) setelah dibuat.
 *
 * Usage:
 *   node scripts/seed-adjustment-journals.mjs
 *   node scripts/seed-adjustment-journals.mjs --dry-run
 *   node scripts/seed-adjustment-journals.mjs --concurrency 5
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Config ──────────────────────────────────────────────────────────────────

const API_BASE = 'https://api.fr-labs.my.id';
const LOGIN_FIELD = 'admin';         // code dari adm_users
const PASSWORD = (() => {
  // Baca dari .env api-gateway agar tidak hardcode
  try {
    const env = readFileSync(join(__dirname, '../apps/api-gateway/.env'), 'utf8');
    const match = env.match(/^ERP_ADMIN_PASSWORD=(.+)$/m);
    if (match) return match[1].trim();
  } catch {}
  // Fallback — tanya user bila tidak ada di .env
  return process.env.ERP_SEED_PASSWORD ?? 'Admin123!';
})();

const TOTAL_ENTRIES = 2000;
const START_DATE = new Date('2025-12-01T00:00:00+07:00');
const BRANCH_ID = '1';        // Kantor Pusat (HQ)
const CURRENCY_ID = '1';      // IDR
const EXCHANGE_RATE = '1.000000';

const DRY_RUN = process.argv.includes('--dry-run');
const CONCURRENCY = (() => {
  const idx = process.argv.indexOf('--concurrency');
  return idx >= 0 ? parseInt(process.argv[idx + 1]) || 3 : 3;
})();

// ─── All 135 postable accounts from md_accounts ──────────────────────────────
// Format: { id, code, name, type, normalBalance }
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

// ─── Descriptions per account type ───────────────────────────────────────────
const DESCS = {
  ASSET:     ['Penyesuaian nilai aset', 'Koreksi saldo aset', 'Reklasifikasi aset', 'Penyesuaian penilaian aset'],
  LIABILITY: ['Penyesuaian kewajiban', 'Koreksi saldo hutang', 'Reklasifikasi liabilitas', 'Penyesuaian akrual'],
  EQUITY:    ['Penyesuaian modal', 'Koreksi saldo ekuitas', 'Reklasifikasi modal'],
  REVENUE:   ['Penyesuaian pendapatan', 'Koreksi pencatatan pendapatan', 'Reklasifikasi pendapatan'],
  EXPENSE:   ['Penyesuaian beban', 'Koreksi alokasi biaya', 'Reklasifikasi beban operasional', 'Koreksi beban periode'],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function dateStr(d) {
  // YYYY-MM-DD in WIB timezone
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

/** Deterministic pseudo-random based on index */
function seeded(idx, max) {
  return Math.floor(((idx * 6364136223846793005n + 1442695040888963407n) % BigInt(2 ** 31)) / BigInt(2 ** 31) * BigInt(max));
}
function pick(arr, idx) {
  return arr[Number(seeded(BigInt(idx), arr.length))];
}
function amount(idx) {
  const base = Number(seeded(BigInt(idx + 99), 9900)) + 100;
  return (base * 1000).toFixed(4); // 100k – 10M IDR
}

/**
 * Generate a balanced 2-line journal entry for entry index i.
 * - Picks debit account and credit account such that debit ≠ credit
 * - Balances: debitLine.debit = creditLine.credit = amount
 */
function generateEntry(i, date) {
  // Pick two different accounts
  const debitAccIdx  = Number(seeded(BigInt(i * 3 + 1), ACCOUNTS.length));
  let   creditAccIdx = Number(seeded(BigInt(i * 3 + 2), ACCOUNTS.length));
  if (creditAccIdx === debitAccIdx) creditAccIdx = (creditAccIdx + 1) % ACCOUNTS.length;

  const debitAcc  = ACCOUNTS[debitAccIdx];
  const creditAcc = ACCOUNTS[creditAccIdx];
  const amt = amount(i);
  const descType = pick(['ASSET','LIABILITY','EQUITY','REVENUE','EXPENSE'], i * 7 + 3);
  const descArr = DESCS[debitAcc.type] ?? DESCS.EXPENSE;
  const desc = pick(descArr, i * 5 + 7);

  return {
    journalType: 'ADJUSTMENT',
    branchId:    BRANCH_ID,
    entryDate:   dateStr(date),
    description: `${desc} - ${debitAcc.code} / ${creditAcc.code}`,
    currencyId:  CURRENCY_ID,
    exchangeRate: EXCHANGE_RATE,
    auto:        true,
    lines: [
      { accountId: debitAcc.id,  debit: amt,   credit: '0.0000', lineNo: 1,
        notes: `Dr ${debitAcc.name}` },
      { accountId: creditAcc.id, debit: '0.0000', credit: amt,   lineNo: 2,
        notes: `Cr ${creditAcc.name}` },
    ],
  };
}

/**
 * Distribute 2000 entries over days starting from START_DATE.
 * ~3-7 entries per day, cycling through months.
 */
function buildSchedule() {
  const schedule = []; // [{ date, entries[] }]
  let remaining = TOTAL_ENTRIES;
  let dayOffset = 0;
  let globalIdx = 0;

  while (remaining > 0) {
    const date = addDays(START_DATE, dayOffset);
    // 2-7 entries per day, vary by day index
    const count = Math.min(2 + Number(seeded(BigInt(dayOffset * 13 + 7), 6)), remaining);
    const dayEntries = [];
    for (let j = 0; j < count; j++) {
      dayEntries.push(generateEntry(globalIdx++, date));
    }
    schedule.push({ date, entries: dayEntries });
    remaining -= count;
    dayOffset++;
  }
  return schedule;
}

// ─── API Calls ───────────────────────────────────────────────────────────────

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
  if (!token) throw new Error(`Token tidak ditemukan di response: ${JSON.stringify(json)}`);
  console.log(`✅ Login berhasil (token length=${token.length})`);
  return token;
}

async function createJournal(token, payload) {
  const res = await fetch(`${API_BASE}/erp/fin/journal-entries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create failed ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = await res.json();
  return json?.data?.id ?? json?.id;
}

async function postJournal(token, id) {
  const res = await fetch(`${API_BASE}/erp/fin/journal-entries/${id}/transition`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ action: 'POST' }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST transition failed ${res.status}: ${text.slice(0, 200)}`);
  }
  return true;
}

// ─── Concurrency pool ────────────────────────────────────────────────────────

async function runWithConcurrency(tasks, concurrency) {
  const results = [];
  let idx = 0;
  const workers = Array(concurrency).fill(null).map(async () => {
    while (idx < tasks.length) {
      const i = idx++;
      results[i] = await tasks[i]();
    }
  });
  await Promise.all(workers);
  return results;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🚀 ERP Adjustment Journal Seeder`);
  console.log(`   Target   : ${TOTAL_ENTRIES} entries`);
  console.log(`   Start    : ${dateStr(START_DATE)}`);
  console.log(`   API      : ${API_BASE}`);
  console.log(`   DryRun   : ${DRY_RUN}`);
  console.log(`   Concur   : ${CONCURRENCY}`);
  console.log(`   Accounts : ${ACCOUNTS.length} postable accounts\n`);

  const schedule = buildSchedule();
  console.log(`📅 Days covered : ${schedule.length} hari`);
  console.log(`   First day    : ${dateStr(schedule[0].date)} (${schedule[0].entries.length} entries)`);
  console.log(`   Last day     : ${dateStr(schedule[schedule.length-1].date)} (${schedule[schedule.length-1].entries.length} entries)\n`);

  // Show month summary
  const monthMap = {};
  for (const day of schedule) {
    const key = `${day.date.getFullYear()}-${String(day.date.getMonth()+1).padStart(2,'0')}`;
    monthMap[key] = (monthMap[key] ?? 0) + day.entries.length;
  }
  console.log('📊 Distribusi per bulan:');
  for (const [m, c] of Object.entries(monthMap)) console.log(`   ${m}: ${c} entries`);
  console.log();

  if (DRY_RUN) {
    console.log('🟡 DRY RUN — tidak ada yang dikirim ke API.');
    return;
  }

  // Login
  const token = await login();

  // Flatten all entries dengan urutan tanggal
  const allEntries = [];
  for (const day of schedule) {
    for (const entry of day.entries) allEntries.push(entry);
  }

  let created = 0;
  let posted  = 0;
  let failed  = 0;
  const errors = [];

  const startTime = Date.now();

  // Build task list
  const tasks = allEntries.map((entry, i) => async () => {
    try {
      const id = await createJournal(token, entry);
      created++;
      try {
        await postJournal(token, id);
        posted++;
      } catch (e) {
        errors.push(`[${i+1}] POST transition error: ${e.message}`);
      }
    } catch (e) {
      failed++;
      errors.push(`[${i+1}] Create error (${entry.entryDate}): ${e.message}`);
    }

    // Progress every 50
    if ((created + failed) % 50 === 0 || (created + failed) === TOTAL_ENTRIES) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const rate = ((created + failed) / parseFloat(elapsed)).toFixed(1);
      process.stdout.write(`\r   Progress: ${created+failed}/${TOTAL_ENTRIES} | ✅${created} ❌${failed} | ${elapsed}s | ${rate}/s   `);
    }
  });

  await runWithConcurrency(tasks, CONCURRENCY);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n\n✅ Selesai dalam ${elapsed}s`);
  console.log(`   Created : ${created}`);
  console.log(`   Posted  : ${posted}`);
  console.log(`   Failed  : ${failed}`);

  if (errors.length > 0) {
    console.log(`\n⚠️  Errors (${errors.length}):`);
    errors.slice(0, 20).forEach(e => console.log('  ', e));
    if (errors.length > 20) console.log(`  ... dan ${errors.length - 20} error lainnya`);
  }
}

main().catch(e => {
  console.error('\n❌ Fatal:', e.message);
  process.exit(1);
});
