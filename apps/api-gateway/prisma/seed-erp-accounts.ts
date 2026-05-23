/**
 * Seed Chart of Accounts (md_accounts) — Senti ERP.
 * CoA standar perusahaan manufaktur Indonesia, 3–4 level hierarki.
 * Run: npx ts-node prisma/seed-erp-accounts.ts
 * Idempotent: upsert by code.
 */
import { PrismaClient, ErpAccountType, ErpAccountKind, ErpNormalBalance, ErpCashFlowCategory } from '@prisma/client';

const prisma = new PrismaClient();

type AccountSeed = {
  code: string;
  name: string;
  alias?: string;
  type: ErpAccountType;
  kind: ErpAccountKind;
  normalBalance: ErpNormalBalance;
  level: number;
  parentCode?: string;
  cashFlowCategory?: ErpCashFlowCategory;
  isControlAccount?: boolean;
  bankName?: string;
  bankAccountNo?: string;
  notes?: string;
  legacyCode?: string;
};

const A = ErpAccountType.ASSET;
const L = ErpAccountType.LIABILITY;
const E = ErpAccountType.EQUITY;
const R = ErpAccountType.REVENUE;
const X = ErpAccountType.EXPENSE;
const H = ErpAccountKind.HEADER;
const P = ErpAccountKind.POSTABLE;
const D = ErpNormalBalance.DEBIT;
const C = ErpNormalBalance.CREDIT;
const OP = ErpCashFlowCategory.OPERATING;
const IV = ErpCashFlowCategory.INVESTING;
const FN = ErpCashFlowCategory.FINANCING;

const ACCOUNTS: AccountSeed[] = [
  // ── LEVEL 1: Kelompok Utama ────────────────────────────────────────────────
  { code: '1000', name: 'Aset',                              type: A, kind: H, normalBalance: D, level: 1 },
  { code: '2000', name: 'Kewajiban',                         type: L, kind: H, normalBalance: C, level: 1 },
  { code: '3000', name: 'Ekuitas',                           type: E, kind: H, normalBalance: C, level: 1 },
  { code: '4000', name: 'Pendapatan',                        type: R, kind: H, normalBalance: C, level: 1 },
  { code: '5000', name: 'Harga Pokok Penjualan',             type: X, kind: H, normalBalance: D, level: 1 },
  { code: '6000', name: 'Beban Operasional',                 type: X, kind: H, normalBalance: D, level: 1 },
  { code: '7000', name: 'Pos Luar Biasa & Pajak',            type: X, kind: H, normalBalance: D, level: 1 },

  // ── LEVEL 2: Grup Aset ─────────────────────────────────────────────────────
  { code: '1100', name: 'Aset Lancar',          type: A, kind: H, normalBalance: D, level: 2, parentCode: '1000' },
  { code: '1200', name: 'Aset Tetap',           type: A, kind: H, normalBalance: D, level: 2, parentCode: '1000' },
  { code: '1300', name: 'Aset Tidak Berwujud',  type: A, kind: H, normalBalance: D, level: 2, parentCode: '1000' },
  { code: '1400', name: 'Investasi Jangka Panjang', type: A, kind: H, normalBalance: D, level: 2, parentCode: '1000' },

  // ── LEVEL 2: Grup Kewajiban ────────────────────────────────────────────────
  { code: '2100', name: 'Kewajiban Jangka Pendek', type: L, kind: H, normalBalance: C, level: 2, parentCode: '2000' },
  { code: '2200', name: 'Kewajiban Jangka Panjang', type: L, kind: H, normalBalance: C, level: 2, parentCode: '2000' },

  // ── LEVEL 2: Grup Ekuitas ──────────────────────────────────────────────────
  { code: '3100', name: 'Modal dan Cadangan', type: E, kind: H, normalBalance: C, level: 2, parentCode: '3000' },

  // ── LEVEL 2: Grup Pendapatan ───────────────────────────────────────────────
  { code: '4100', name: 'Pendapatan Usaha',    type: R, kind: H, normalBalance: C, level: 2, parentCode: '4000' },
  { code: '4200', name: 'Pendapatan Lain-lain', type: R, kind: H, normalBalance: C, level: 2, parentCode: '4000' },

  // ── LEVEL 2: Grup HPP ─────────────────────────────────────────────────────
  { code: '5100', name: 'Harga Pokok Produksi', type: X, kind: H, normalBalance: D, level: 2, parentCode: '5000' },
  { code: '5200', name: 'Beban Distribusi',     type: X, kind: H, normalBalance: D, level: 2, parentCode: '5000' },

  // ── LEVEL 2: Grup Beban Operasional ───────────────────────────────────────
  { code: '6100', name: 'Beban Penjualan',              type: X, kind: H, normalBalance: D, level: 2, parentCode: '6000' },
  { code: '6200', name: 'Beban Umum dan Administrasi',  type: X, kind: H, normalBalance: D, level: 2, parentCode: '6000' },
  { code: '6300', name: 'Beban Keuangan',               type: X, kind: H, normalBalance: D, level: 2, parentCode: '6000' },

  // ── LEVEL 2: Pos Luar Biasa & Pajak ───────────────────────────────────────
  { code: '7100', name: 'Pos Luar Biasa',    type: X, kind: H, normalBalance: D, level: 2, parentCode: '7000' },
  { code: '7200', name: 'Pajak Penghasilan', type: X, kind: H, normalBalance: D, level: 2, parentCode: '7000' },

  // ── LEVEL 3: Aset Lancar → Kas ────────────────────────────────────────────
  { code: '1101', name: 'Kas Besar',                 alias: 'Kas Utama',          type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP, legacyCode: '1-1101' },
  { code: '1102', name: 'Kas Kecil',                 alias: 'Petty Cash',         type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP, legacyCode: '1-1102' },
  { code: '1110', name: 'Bank BCA - Giro IDR',       alias: 'BCA IDR',            type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP, bankName: 'Bank BCA',    bankAccountNo: '123-456-7890', legacyCode: '1-1110' },
  { code: '1111', name: 'Bank Mandiri - Giro IDR',   alias: 'Mandiri IDR',        type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP, bankName: 'Bank Mandiri', bankAccountNo: '156-000-8888888', legacyCode: '1-1111' },
  { code: '1112', name: 'Bank BNI - Giro IDR',       alias: 'BNI IDR',            type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP, bankName: 'Bank BNI',    bankAccountNo: '0987654321', legacyCode: '1-1112' },
  { code: '1113', name: 'Bank BRI - Giro IDR',       alias: 'BRI IDR',            type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP, bankName: 'Bank BRI',    bankAccountNo: '0321-01-001234-56-7', legacyCode: '1-1113' },
  { code: '1114', name: 'Bank CIMB Niaga - Giro IDR', alias: 'CIMB IDR',          type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP, bankName: 'Bank CIMB Niaga', bankAccountNo: '800123456700' },
  { code: '1115', name: 'Bank Mandiri - Giro USD',   alias: 'Mandiri USD',        type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP, bankName: 'Bank Mandiri', bankAccountNo: '156-000-9999999' },

  // Piutang Usaha
  { code: '1120', name: 'Piutang Dagang',                   alias: 'AR Trade',   type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP, isControlAccount: true,  legacyCode: '1-1120' },
  { code: '1121', name: 'Cadangan Kerugian Piutang',        alias: 'Allowance',  type: A, kind: P, normalBalance: C, level: 3, parentCode: '1100', cashFlowCategory: OP, notes: 'Contra asset — kontra piutang dagang', legacyCode: '1-1121' },
  { code: '1122', name: 'Piutang Karyawan',                                      type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP, legacyCode: '1-1122' },
  { code: '1123', name: 'Uang Muka Pembelian',              alias: 'DP Beli',    type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP, legacyCode: '1-1123' },
  { code: '1124', name: 'Piutang Lainnya',                                       type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP },
  { code: '1125', name: 'Giro Masuk Dalam Proses Kliring',  alias: 'Giro Masuk', type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP },

  // Persediaan
  { code: '1130', name: 'Persediaan Bahan Baku',            alias: 'Raw Mat',       type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP, legacyCode: '1-1130' },
  { code: '1131', name: 'Persediaan Bahan Pembantu',        alias: 'Aux Mat',       type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP, legacyCode: '1-1131' },
  { code: '1132', name: 'Persediaan Barang Dalam Proses',   alias: 'WIP',           type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP, legacyCode: '1-1132' },
  { code: '1133', name: 'Persediaan Barang Jadi',           alias: 'Finished Goods', type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP, legacyCode: '1-1133' },
  { code: '1134', name: 'Persediaan Perlengkapan / Suku Cadang', alias: 'Spare Parts', type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP, legacyCode: '1-1134' },

  // Pajak Dibayar Dimuka
  { code: '1140', name: 'PPN Masukan',                   alias: 'VAT In',     type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP, legacyCode: '1-1140' },
  { code: '1141', name: 'PPh Pasal 22 Dibayar Dimuka',  alias: 'PPh 22',     type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP },
  { code: '1142', name: 'PPh Pasal 23 Dibayar Dimuka',  alias: 'PPh 23',     type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP },
  { code: '1143', name: 'PPh Pasal 25 Dibayar Dimuka',  alias: 'PPh 25',     type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP },
  { code: '1144', name: 'Fiskal Tahun Berjalan',                              type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP },

  // Biaya Dibayar Dimuka
  { code: '1150', name: 'Biaya Sewa Dibayar Dimuka',    alias: 'Prepaid Rent',   type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP },
  { code: '1151', name: 'Biaya Asuransi Dibayar Dimuka', alias: 'Prepaid Ins',   type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP },
  { code: '1152', name: 'Biaya Lainnya Dibayar Dimuka', alias: 'Other Prepaid',  type: A, kind: P, normalBalance: D, level: 3, parentCode: '1100', cashFlowCategory: OP },

  // ── LEVEL 3: Aset Tetap ───────────────────────────────────────────────────
  { code: '1201', name: 'Tanah',                                type: A, kind: P, normalBalance: D, level: 3, parentCode: '1200', cashFlowCategory: IV, notes: 'Tidak disusutkan', legacyCode: '1-1201' },
  { code: '1202', name: 'Bangunan dan Prasarana',               type: A, kind: P, normalBalance: D, level: 3, parentCode: '1200', cashFlowCategory: IV, legacyCode: '1-1202' },
  { code: '1203', name: 'Akumulasi Penyusutan Bangunan',        type: A, kind: P, normalBalance: C, level: 3, parentCode: '1200', cashFlowCategory: IV, legacyCode: '1-1203' },
  { code: '1210', name: 'Mesin Produksi',                       type: A, kind: P, normalBalance: D, level: 3, parentCode: '1200', cashFlowCategory: IV, legacyCode: '1-1210' },
  { code: '1211', name: 'Akumulasi Penyusutan Mesin',           type: A, kind: P, normalBalance: C, level: 3, parentCode: '1200', cashFlowCategory: IV, legacyCode: '1-1211' },
  { code: '1212', name: 'Peralatan Pabrik',                     type: A, kind: P, normalBalance: D, level: 3, parentCode: '1200', cashFlowCategory: IV },
  { code: '1213', name: 'Akumulasi Penyusutan Peralatan Pabrik', type: A, kind: P, normalBalance: C, level: 3, parentCode: '1200', cashFlowCategory: IV },
  { code: '1220', name: 'Kendaraan',                            type: A, kind: P, normalBalance: D, level: 3, parentCode: '1200', cashFlowCategory: IV, legacyCode: '1-1220' },
  { code: '1221', name: 'Akumulasi Penyusutan Kendaraan',       type: A, kind: P, normalBalance: C, level: 3, parentCode: '1200', cashFlowCategory: IV, legacyCode: '1-1221' },
  { code: '1230', name: 'Peralatan Kantor',                     type: A, kind: P, normalBalance: D, level: 3, parentCode: '1200', cashFlowCategory: IV, legacyCode: '1-1230' },
  { code: '1231', name: 'Akumulasi Penyusutan Peralatan Kantor', type: A, kind: P, normalBalance: C, level: 3, parentCode: '1200', cashFlowCategory: IV, legacyCode: '1-1231' },
  { code: '1240', name: 'Inventaris Kantor',                    type: A, kind: P, normalBalance: D, level: 3, parentCode: '1200', cashFlowCategory: IV },
  { code: '1241', name: 'Akumulasi Penyusutan Inventaris',      type: A, kind: P, normalBalance: C, level: 3, parentCode: '1200', cashFlowCategory: IV },

  // ── LEVEL 3: Aset Tidak Berwujud ──────────────────────────────────────────
  { code: '1301', name: 'Lisensi Software',                    type: A, kind: P, normalBalance: D, level: 3, parentCode: '1300', cashFlowCategory: IV },
  { code: '1302', name: 'Akumulasi Amortisasi Lisensi',        type: A, kind: P, normalBalance: C, level: 3, parentCode: '1300', cashFlowCategory: IV },
  { code: '1310', name: 'Hak Merek dan Paten',                 type: A, kind: P, normalBalance: D, level: 3, parentCode: '1300', cashFlowCategory: IV },
  { code: '1311', name: 'Akumulasi Amortisasi Hak Merek',      type: A, kind: P, normalBalance: C, level: 3, parentCode: '1300', cashFlowCategory: IV },
  { code: '1320', name: 'Biaya Pendirian / Organisasi',        type: A, kind: P, normalBalance: D, level: 3, parentCode: '1300', cashFlowCategory: IV },
  { code: '1321', name: 'Akumulasi Amortisasi Biaya Pendirian', type: A, kind: P, normalBalance: C, level: 3, parentCode: '1300', cashFlowCategory: IV },

  // ── LEVEL 3: Investasi ────────────────────────────────────────────────────
  { code: '1401', name: 'Investasi Saham di Entitas Anak',     type: A, kind: P, normalBalance: D, level: 3, parentCode: '1400', cashFlowCategory: IV },
  { code: '1402', name: 'Investasi Saham di Entitas Asosiasi', type: A, kind: P, normalBalance: D, level: 3, parentCode: '1400', cashFlowCategory: IV },
  { code: '1403', name: 'Investasi Obligasi',                  type: A, kind: P, normalBalance: D, level: 3, parentCode: '1400', cashFlowCategory: IV },

  // ── LEVEL 3: Kewajiban Jangka Pendek ──────────────────────────────────────
  { code: '2101', name: 'Hutang Dagang',                alias: 'AP Trade',   type: L, kind: P, normalBalance: C, level: 3, parentCode: '2100', cashFlowCategory: OP, isControlAccount: true, legacyCode: '2-2101' },
  { code: '2102', name: 'Hutang Bank Jangka Pendek',    alias: 'ST Bank Debt', type: L, kind: P, normalBalance: C, level: 3, parentCode: '2100', cashFlowCategory: FN, legacyCode: '2-2102' },
  { code: '2103', name: 'Hutang Gaji Karyawan',                               type: L, kind: P, normalBalance: C, level: 3, parentCode: '2100', cashFlowCategory: OP },
  { code: '2104', name: 'Biaya Yang Masih Harus Dibayar', alias: 'Accrued Exp', type: L, kind: P, normalBalance: C, level: 3, parentCode: '2100', cashFlowCategory: OP, legacyCode: '2-2104' },
  { code: '2105', name: 'Uang Muka Penjualan',          alias: 'DP Jual',    type: L, kind: P, normalBalance: C, level: 3, parentCode: '2100', cashFlowCategory: OP },
  { code: '2106', name: 'Giro Keluar Dalam Proses',     alias: 'Giro Keluar', type: L, kind: P, normalBalance: C, level: 3, parentCode: '2100', cashFlowCategory: OP },
  { code: '2110', name: 'PPN Keluaran',                 alias: 'VAT Out',    type: L, kind: P, normalBalance: C, level: 3, parentCode: '2100', cashFlowCategory: OP, legacyCode: '2-2110' },
  { code: '2111', name: 'PPh Pasal 21 Terutang',        alias: 'PPh 21',     type: L, kind: P, normalBalance: C, level: 3, parentCode: '2100', cashFlowCategory: OP, legacyCode: '2-2111' },
  { code: '2112', name: 'PPh Pasal 23 Terutang',        alias: 'PPh 23',     type: L, kind: P, normalBalance: C, level: 3, parentCode: '2100', cashFlowCategory: OP },
  { code: '2113', name: 'PPh Pasal 25 Terutang',        alias: 'PPh 25',     type: L, kind: P, normalBalance: C, level: 3, parentCode: '2100', cashFlowCategory: OP },
  { code: '2114', name: 'PPh Badan Terutang',                                 type: L, kind: P, normalBalance: C, level: 3, parentCode: '2100', cashFlowCategory: OP, legacyCode: '2-2114' },
  { code: '2115', name: 'BPJS Ketenagakerjaan Terutang',                      type: L, kind: P, normalBalance: C, level: 3, parentCode: '2100', cashFlowCategory: OP },
  { code: '2116', name: 'BPJS Kesehatan Terutang',                            type: L, kind: P, normalBalance: C, level: 3, parentCode: '2100', cashFlowCategory: OP },
  { code: '2120', name: 'Dividen Yang Harus Dibayar',                         type: L, kind: P, normalBalance: C, level: 3, parentCode: '2100', cashFlowCategory: FN },
  { code: '2121', name: 'Hutang Jangka Panjang - Jatuh Tempo', alias: 'Current LTD', type: L, kind: P, normalBalance: C, level: 3, parentCode: '2100', cashFlowCategory: FN },

  // ── LEVEL 3: Kewajiban Jangka Panjang ─────────────────────────────────────
  { code: '2201', name: 'Hutang Bank Jangka Panjang',   alias: 'LT Bank Debt', type: L, kind: P, normalBalance: C, level: 3, parentCode: '2200', cashFlowCategory: FN, legacyCode: '2-2201' },
  { code: '2202', name: 'Hutang Obligasi',                                      type: L, kind: P, normalBalance: C, level: 3, parentCode: '2200', cashFlowCategory: FN },
  { code: '2203', name: 'Hutang Sewa Pembiayaan (Leasing)',                     type: L, kind: P, normalBalance: C, level: 3, parentCode: '2200', cashFlowCategory: FN, legacyCode: '2-2203' },
  { code: '2210', name: 'Liabilitas Pajak Tangguhan',                           type: L, kind: P, normalBalance: C, level: 3, parentCode: '2200', cashFlowCategory: OP },
  { code: '2220', name: 'Cadangan Imbalan Pasca-Kerja',  alias: 'DPLK/Pesangon', type: L, kind: P, normalBalance: C, level: 3, parentCode: '2200', cashFlowCategory: OP },

  // ── LEVEL 3: Ekuitas ──────────────────────────────────────────────────────
  { code: '3101', name: 'Modal Saham Disetor',           alias: 'Share Capital',  type: E, kind: P, normalBalance: C, level: 3, parentCode: '3100' },
  { code: '3102', name: 'Tambahan Modal Disetor (Agio)', alias: 'Agio Saham',     type: E, kind: P, normalBalance: C, level: 3, parentCode: '3100' },
  { code: '3103', name: 'Saldo Laba Ditahan',            alias: 'Retained Earnings', type: E, kind: P, normalBalance: C, level: 3, parentCode: '3100' },
  { code: '3104', name: 'Laba (Rugi) Tahun Berjalan',   alias: 'Current Profit', type: E, kind: P, normalBalance: C, level: 3, parentCode: '3100' },
  { code: '3110', name: 'Cadangan Umum',                                          type: E, kind: P, normalBalance: C, level: 3, parentCode: '3100' },
  { code: '3111', name: 'Cadangan Khusus',                                        type: E, kind: P, normalBalance: C, level: 3, parentCode: '3100' },
  { code: '3120', name: 'Selisih Kurs Penjabaran',       alias: 'CTA',            type: E, kind: P, normalBalance: C, level: 3, parentCode: '3100' },

  // ── LEVEL 3: Pendapatan Usaha ─────────────────────────────────────────────
  { code: '4101', name: 'Penjualan Produk Jadi',         alias: 'Sales FG',    type: R, kind: P, normalBalance: C, level: 3, parentCode: '4100', cashFlowCategory: OP, legacyCode: '4-4101' },
  { code: '4102', name: 'Penjualan Jasa Pengolahan',     alias: 'Toll Mfg',    type: R, kind: P, normalBalance: C, level: 3, parentCode: '4100', cashFlowCategory: OP },
  { code: '4103', name: 'Penjualan Bahan Baku / Sisa',   alias: 'Scrap Sales', type: R, kind: P, normalBalance: C, level: 3, parentCode: '4100', cashFlowCategory: OP },
  { code: '4110', name: 'Retur Penjualan',               alias: 'Sales Return', type: R, kind: P, normalBalance: D, level: 3, parentCode: '4100', cashFlowCategory: OP, notes: 'Contra revenue', legacyCode: '4-4110' },
  { code: '4111', name: 'Diskon Penjualan',              alias: 'Sales Disc',  type: R, kind: P, normalBalance: D, level: 3, parentCode: '4100', cashFlowCategory: OP, notes: 'Contra revenue', legacyCode: '4-4111' },

  // ── LEVEL 3: Pendapatan Lain-lain ─────────────────────────────────────────
  { code: '4201', name: 'Pendapatan Bunga Bank',         alias: 'Interest Inc', type: R, kind: P, normalBalance: C, level: 3, parentCode: '4200', cashFlowCategory: IV },
  { code: '4202', name: 'Keuntungan Selisih Kurs',                              type: R, kind: P, normalBalance: C, level: 3, parentCode: '4200', cashFlowCategory: OP },
  { code: '4203', name: 'Keuntungan Penjualan Aset Tetap',                      type: R, kind: P, normalBalance: C, level: 3, parentCode: '4200', cashFlowCategory: IV },
  { code: '4204', name: 'Dividen Diterima',                                     type: R, kind: P, normalBalance: C, level: 3, parentCode: '4200', cashFlowCategory: IV },
  { code: '4205', name: 'Pendapatan Sewa',                                      type: R, kind: P, normalBalance: C, level: 3, parentCode: '4200', cashFlowCategory: OP },
  { code: '4206', name: 'Pendapatan Lainnya',                                   type: R, kind: P, normalBalance: C, level: 3, parentCode: '4200', cashFlowCategory: OP },

  // ── LEVEL 3: Harga Pokok Produksi ─────────────────────────────────────────
  { code: '5101', name: 'Pemakaian Bahan Baku',          alias: 'Raw Mat Used',  type: X, kind: P, normalBalance: D, level: 3, parentCode: '5100', cashFlowCategory: OP, legacyCode: '5-5101' },
  { code: '5102', name: 'Pemakaian Bahan Pembantu',      alias: 'Aux Mat Used',  type: X, kind: P, normalBalance: D, level: 3, parentCode: '5100', cashFlowCategory: OP, legacyCode: '5-5102' },
  { code: '5103', name: 'Tenaga Kerja Langsung',         alias: 'Direct Labor',  type: X, kind: P, normalBalance: D, level: 3, parentCode: '5100', cashFlowCategory: OP, legacyCode: '5-5103' },
  { code: '5110', name: 'Overhead Pabrik — Tetap',       alias: 'Fixed FOH',     type: X, kind: P, normalBalance: D, level: 3, parentCode: '5100', cashFlowCategory: OP, legacyCode: '5-5110' },
  { code: '5111', name: 'Overhead Pabrik — Variabel',    alias: 'Variable FOH',  type: X, kind: P, normalBalance: D, level: 3, parentCode: '5100', cashFlowCategory: OP, legacyCode: '5-5111' },
  { code: '5120', name: 'Penyusutan Mesin Produksi',                             type: X, kind: P, normalBalance: D, level: 3, parentCode: '5100', cashFlowCategory: OP },
  { code: '5121', name: 'Biaya Pemeliharaan Mesin',                              type: X, kind: P, normalBalance: D, level: 3, parentCode: '5100', cashFlowCategory: OP },
  { code: '5122', name: 'Biaya Listrik Pabrik',                                  type: X, kind: P, normalBalance: D, level: 3, parentCode: '5100', cashFlowCategory: OP },
  { code: '5123', name: 'Biaya Air dan Gas Pabrik',                              type: X, kind: P, normalBalance: D, level: 3, parentCode: '5100', cashFlowCategory: OP },

  // Beban Distribusi
  { code: '5201', name: 'Beban Pengiriman Pembelian',    alias: 'Freight In',    type: X, kind: P, normalBalance: D, level: 3, parentCode: '5200', cashFlowCategory: OP },
  { code: '5202', name: 'Beban Pengiriman Penjualan',    alias: 'Freight Out',   type: X, kind: P, normalBalance: D, level: 3, parentCode: '5200', cashFlowCategory: OP },

  // ── LEVEL 3: Beban Penjualan ──────────────────────────────────────────────
  { code: '6101', name: 'Beban Gaji Bagian Penjualan',                           type: X, kind: P, normalBalance: D, level: 3, parentCode: '6100', cashFlowCategory: OP, legacyCode: '6-6101' },
  { code: '6102', name: 'Beban Komisi Agen / Salesman',                          type: X, kind: P, normalBalance: D, level: 3, parentCode: '6100', cashFlowCategory: OP, legacyCode: '6-6102' },
  { code: '6103', name: 'Beban Promosi dan Iklan',                               type: X, kind: P, normalBalance: D, level: 3, parentCode: '6100', cashFlowCategory: OP, legacyCode: '6-6103' },
  { code: '6104', name: 'Beban Transportasi Penjualan',                          type: X, kind: P, normalBalance: D, level: 3, parentCode: '6100', cashFlowCategory: OP },
  { code: '6105', name: 'Beban Kemasan',                                         type: X, kind: P, normalBalance: D, level: 3, parentCode: '6100', cashFlowCategory: OP },
  { code: '6106', name: 'Beban Pameran dan Expo',                                type: X, kind: P, normalBalance: D, level: 3, parentCode: '6100', cashFlowCategory: OP },
  { code: '6107', name: 'Beban Garansi dan Retur Pelanggan',                     type: X, kind: P, normalBalance: D, level: 3, parentCode: '6100', cashFlowCategory: OP },

  // ── LEVEL 3: Beban Umum & Administrasi ───────────────────────────────────
  { code: '6201', name: 'Beban Gaji Direksi',                                    type: X, kind: P, normalBalance: D, level: 3, parentCode: '6200', cashFlowCategory: OP, legacyCode: '6-6201' },
  { code: '6202', name: 'Beban Gaji Staff Administrasi',                         type: X, kind: P, normalBalance: D, level: 3, parentCode: '6200', cashFlowCategory: OP, legacyCode: '6-6202' },
  { code: '6203', name: 'Beban Tunjangan Karyawan',                              type: X, kind: P, normalBalance: D, level: 3, parentCode: '6200', cashFlowCategory: OP },
  { code: '6204', name: 'Beban BPJS Ketenagakerjaan',                            type: X, kind: P, normalBalance: D, level: 3, parentCode: '6200', cashFlowCategory: OP },
  { code: '6205', name: 'Beban BPJS Kesehatan',                                  type: X, kind: P, normalBalance: D, level: 3, parentCode: '6200', cashFlowCategory: OP },
  { code: '6210', name: 'Beban Alat Tulis Kantor',                               type: X, kind: P, normalBalance: D, level: 3, parentCode: '6200', cashFlowCategory: OP, legacyCode: '6-6210' },
  { code: '6211', name: 'Beban Sewa Kantor dan Gedung',                          type: X, kind: P, normalBalance: D, level: 3, parentCode: '6200', cashFlowCategory: OP },
  { code: '6212', name: 'Beban Listrik, Air, dan Gas',                           type: X, kind: P, normalBalance: D, level: 3, parentCode: '6200', cashFlowCategory: OP, legacyCode: '6-6212' },
  { code: '6213', name: 'Beban Telepon dan Internet',                            type: X, kind: P, normalBalance: D, level: 3, parentCode: '6200', cashFlowCategory: OP },
  { code: '6214', name: 'Beban Perjalanan Dinas',                                type: X, kind: P, normalBalance: D, level: 3, parentCode: '6200', cashFlowCategory: OP, legacyCode: '6-6214' },
  { code: '6215', name: 'Beban Pemeliharaan Gedung',                             type: X, kind: P, normalBalance: D, level: 3, parentCode: '6200', cashFlowCategory: OP },
  { code: '6216', name: 'Beban Asuransi',                                        type: X, kind: P, normalBalance: D, level: 3, parentCode: '6200', cashFlowCategory: OP },
  { code: '6217', name: 'Beban Penyusutan Aset Tetap',                           type: X, kind: P, normalBalance: D, level: 3, parentCode: '6200', cashFlowCategory: OP },
  { code: '6218', name: 'Beban Amortisasi Aset Tak Berwujud',                    type: X, kind: P, normalBalance: D, level: 3, parentCode: '6200', cashFlowCategory: OP },
  { code: '6219', name: 'Beban Pajak dan Retribusi Daerah',                      type: X, kind: P, normalBalance: D, level: 3, parentCode: '6200', cashFlowCategory: OP },
  { code: '6220', name: 'Beban Representasi dan Entertainment',                  type: X, kind: P, normalBalance: D, level: 3, parentCode: '6200', cashFlowCategory: OP, legacyCode: '6-6220' },
  { code: '6221', name: 'Beban Jasa Profesional (Konsultan/Auditor)',            type: X, kind: P, normalBalance: D, level: 3, parentCode: '6200', cashFlowCategory: OP, legacyCode: '6-6221' },
  { code: '6222', name: 'Beban Piutang Tak Tertagih',                            type: X, kind: P, normalBalance: D, level: 3, parentCode: '6200', cashFlowCategory: OP },
  { code: '6223', name: 'Beban Keamanan dan K3',                                 type: X, kind: P, normalBalance: D, level: 3, parentCode: '6200', cashFlowCategory: OP },
  { code: '6224', name: 'Beban Lain-lain Administrasi',                          type: X, kind: P, normalBalance: D, level: 3, parentCode: '6200', cashFlowCategory: OP },

  // ── LEVEL 3: Beban Keuangan ───────────────────────────────────────────────
  { code: '6301', name: 'Beban Bunga Pinjaman Bank',     alias: 'Interest Exp',  type: X, kind: P, normalBalance: D, level: 3, parentCode: '6300', cashFlowCategory: FN, legacyCode: '6-6301' },
  { code: '6302', name: 'Beban Administrasi Bank',                               type: X, kind: P, normalBalance: D, level: 3, parentCode: '6300', cashFlowCategory: OP },
  { code: '6303', name: 'Beban Selisih Kurs',            alias: 'FX Loss',       type: X, kind: P, normalBalance: D, level: 3, parentCode: '6300', cashFlowCategory: OP },
  { code: '6304', name: 'Beban Provisi dan Biaya Kredit',                        type: X, kind: P, normalBalance: D, level: 3, parentCode: '6300', cashFlowCategory: FN },
  { code: '6305', name: 'Beban Denda Pajak',                                     type: X, kind: P, normalBalance: D, level: 3, parentCode: '6300', cashFlowCategory: OP },

  // ── LEVEL 3: Pos Luar Biasa & Pajak ──────────────────────────────────────
  { code: '7101', name: 'Kerugian Bencana Alam / Kerusakan',                    type: X, kind: P, normalBalance: D, level: 3, parentCode: '7100', cashFlowCategory: OP },
  { code: '7102', name: 'Kerugian Penjualan Aset Tetap',                        type: X, kind: P, normalBalance: D, level: 3, parentCode: '7100', cashFlowCategory: IV },
  { code: '7103', name: 'Beban Restrukturisasi',                                type: X, kind: P, normalBalance: D, level: 3, parentCode: '7100', cashFlowCategory: OP },
  { code: '7201', name: 'Beban Pajak Penghasilan Badan',  alias: 'Income Tax',   type: X, kind: P, normalBalance: D, level: 3, parentCode: '7200', cashFlowCategory: OP },
  { code: '7202', name: 'Pajak Tangguhan',                alias: 'Deferred Tax', type: X, kind: P, normalBalance: D, level: 3, parentCode: '7200', cashFlowCategory: OP },
];

async function main() {
  console.log('Seeding Chart of Accounts...');
  const codeToId = new Map<string, bigint>();

  for (let level = 1; level <= 3; level++) {
    const batch = ACCOUNTS.filter(a => a.level === level);
    for (const acc of batch) {
      const parentId = acc.parentCode ? codeToId.get(acc.parentCode) ?? null : null;
      const result = await prisma.erpAccount.upsert({
        where: { code: acc.code },
        update: {
          name: acc.name,
          alias: acc.alias ?? null,
          type: acc.type,
          kind: acc.kind,
          normalBalance: acc.normalBalance,
          level: acc.level,
          parentId,
          cashFlowCategory: acc.cashFlowCategory ?? null,
          isControlAccount: acc.isControlAccount ?? false,
          bankName: acc.bankName ?? null,
          bankAccountNo: acc.bankAccountNo ?? null,
          notes: acc.notes ?? null,
          legacyCode: acc.legacyCode ?? null,
          deletedAt: null,
          isActive: true,
        },
        create: {
          code: acc.code,
          name: acc.name,
          alias: acc.alias,
          type: acc.type,
          kind: acc.kind,
          normalBalance: acc.normalBalance,
          level: acc.level,
          parentId,
          cashFlowCategory: acc.cashFlowCategory,
          isControlAccount: acc.isControlAccount ?? false,
          bankName: acc.bankName,
          bankAccountNo: acc.bankAccountNo,
          notes: acc.notes,
          legacyCode: acc.legacyCode,
        },
      });
      codeToId.set(acc.code, result.id);
    }
    console.log(`  Level ${level}: ${batch.length} akun`);
  }

  const total = await prisma.erpAccount.count({ where: { deletedAt: null } });
  console.log(`Done. Total akun aktif: ${total}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
