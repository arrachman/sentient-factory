const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const DB = 'myerpplus';
const MYSQL_ARGS = ['exec', 'mysql', 'mysql', '-h127.0.0.1', '-P3306', '-uroot', '-pPasswordSuperRahasia123!', '-D', DB, '-N', '-B', '-e'];
const OUTPUT_PATH = path.resolve(__dirname, '../db/semantic-schema.json');

function query(sql) {
  return execFileSync('docker', [...MYSQL_ARGS, sql], { encoding: 'utf8' });
}

function parseTsv(tsv) {
  return tsv
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split('\t'));
}

function titleFromSnake(value) {
  return value
    .replace(/^m[0-9]+_/, '')
    .split('_')
    .filter(Boolean)
    .map((part) => part.toLowerCase())
    .join(' ');
}

function defaultAlias(tableName) {
  const normalized = tableName
    .replace(/^m0_/, 'admin_')
    .replace(/^m1_/, 'master_')
    .replace(/^m2_/, 'finance_')
    .replace(/^m3_/, 'inventory_')
    .replace(/^m4_/, 'purchase_')
    .replace(/^m5_/, 'sales_');
  return normalized.toLowerCase();
}

function inferDescription(tableName) {
  if (tableName.endsWith('_detail')) {
    return `Tabel detail untuk item/baris transaksi ${titleFromSnake(tableName)}.`;
  }
  if (tableName.endsWith('_history')) {
    return `Riwayat perubahan data untuk ${titleFromSnake(tableName)}.`;
  }
  if (tableName.endsWith('_pay')) {
    return `Data pembayaran terkait ${titleFromSnake(tableName)}.`;
  }
  if (tableName.startsWith('m1_')) {
    return `Master data ${titleFromSnake(tableName)} yang dipakai lintas transaksi ERP.`;
  }
  if (tableName.startsWith('m2_')) {
    return `Transaksi atau referensi finance untuk ${titleFromSnake(tableName)}.`;
  }
  if (tableName.startsWith('m3_')) {
    return `Transaksi inventory atau gudang untuk ${titleFromSnake(tableName)}.`;
  }
  if (tableName.startsWith('m4_')) {
    return `Transaksi purchasing atau hutang untuk ${titleFromSnake(tableName)}.`;
  }
  if (tableName.startsWith('m5_')) {
    return `Transaksi sales atau piutang untuk ${titleFromSnake(tableName)}.`;
  }
  return `Tabel sistem untuk ${titleFromSnake(tableName)}.`;
}

function inferSynonyms(tableName) {
  const base = [];
  if (tableName.includes('_so')) return ['so', 'sales order', 'order jual'];
  if (tableName.includes('_sq')) return ['quotation', 'penawaran', 'quote'];
  if (tableName.includes('_do')) return ['do', 'surat jalan', 'pengiriman'];
  if (tableName.includes('_si')) return ['invoice', 'faktur', 'tagihan'];
  if (tableName.includes('_po')) return ['po', 'purchase order', 'order beli'];
  if (tableName.includes('_pr')) return ['pr', 'permintaan beli', 'purchase request'];
  if (tableName.includes('_grn')) return ['grn', 'penerimaan barang', 'barang masuk'];
  if (tableName.includes('_ri')) return ['invoice beli', 'faktur beli', 'tagihan supplier'];
  if (tableName.includes('_vp')) return ['bayar hutang', 'pelunasan hutang', 'payment ap'];
  if (tableName.includes('_pv')) return ['bayar piutang', 'pelunasan piutang', 'payment ar'];
  if (tableName.includes('_cb')) return ['saldo awal coa', 'opening balance', 'saldo akun'];
  if (tableName.includes('_ib')) return ['saldo awal barang', 'opening stock', 'stok awal'];
  if (tableName === 'm1_contact') return ['kontak', 'customer', 'supplier'];
  if (tableName === 'm1_item') return ['barang', 'produk', 'item'];
  if (tableName === 'm1_coa') return ['akun', 'rekening', 'coa'];
  if (tableName === 'm1_warehouse') return ['gudang', 'warehouse', 'lokasi stok'];
  return base;
}

function inferColumnDescription(tableName, columnName) {
  const c = columnName.toLowerCase();
  if (/(^|_)(id|kid|bid|cid|cbid|ibid|siid|soid|poid|grnid|riid|doid)(_|$)/.test(c)) return 'Primary key baris data.';
  if (c.includes('notransaksi') || c.startsWith('no_') || c.endsWith('nomor') || c === 'cnomor') return 'Nomor dokumen/transaksi unik.';
  if (c.endsWith('tgl') || c.startsWith('tgl') || c.includes('tgll')) return 'Tanggal transaksi atau tanggal referensi.';
  if (c.includes('customer')) return 'Referensi customer.';
  if (c.includes('supplier')) return 'Referensi supplier.';
  if (c.includes('kontak')) return 'Referensi kontak atau contact person.';
  if (c.includes('barang') || c === 'idbarang' || c === 'bkode' || c === 'bnama') return 'Referensi barang atau nama barang transaksi.';
  if (c.includes('gudang')) return 'Referensi gudang asal/tujuan transaksi.';
  if (c.includes('matauang') || c.includes('kurs')) return 'Informasi mata uang dan kurs transaksi.';
  if (c.includes('qty') || c === 'jml' || c.includes('jmlbarang')) return 'Kuantitas barang/transaksi.';
  if (c.includes('harga') || c.includes('hpp')) return 'Nilai harga satuan atau biaya pokok.';
  if (c.includes('diskon')) return 'Diskon transaksi atau diskon item.';
  if (c.includes('pajak')) return 'Nilai atau kode pajak transaksi.';
  if (c.includes('total') || c.includes('jumlah') || c.includes('debit') || c.includes('kredit') || c.includes('bayar')) return 'Nilai nominal transaksi.';
  if (c.includes('status')) return 'Status proses atau status dokumen.';
  if (c.includes('catatan') || c.includes('uraian')) return 'Keterangan bisnis transaksi.';
  return `Kolom bisnis ${columnName}.`;
}

function shouldKeepColumn(columnName) {
  const c = columnName.toLowerCase();
  const auditPatterns = ['inputuser', 'inputtgl', 'modifikasiuser', 'modifikasitgl', 'created_at', 'updated_at', 'updated_by', 'user_id_input'];
  if (auditPatterns.some((p) => c.includes(p))) return false;
  if (c.startsWith('custom') || c.includes('customtext') || c.includes('customint') || c.includes('customdbl') || c.includes('customdate')) return false;
  return true;
}

function shouldKeepTable(tableName) {
  const explicitKeep = new Set([
    'm0_menu',
    'm0_module',
    'm0_nomor',
    'm0_payment_method',
    'm0_setting',
    'm0_status',
    'm0_user',
    'm0_user_branch',
    'm0_user_location',
    'm0_user_warehouse',
    'm1_bank',
    'm1_branch',
    'm1_city',
    'm1_class_product',
    'm1_coa',
    'm1_contact',
    'm1_contact_category',
    'm1_contact_price',
    'm1_contact_terms',
    'm1_cost_center',
    'm1_country',
    'm1_currency',
    'm1_customer_category',
    'm1_department',
    'm1_division',
    'm1_expedition',
    'm1_index_price',
    'm1_item',
    'm1_item_category',
    'm1_item_location',
    'm1_item_location_warehouse',
    'm1_item_permission',
    'm1_item_price',
    'm1_item_stock_warehouse',
    'm1_item_supplier',
    'm1_item_transaction',
    'm1_item_type',
    'm1_location',
    'm1_material',
    'm1_merk',
    'm1_model',
    'm1_other_cost',
    'm1_price_category',
    'm1_price_category_detail',
    'm1_project',
    'm1_province',
    'm1_salesman_category',
    'm1_section',
    'm1_size',
    'm1_subdepartment',
    'm1_subdivision',
    'm1_supplier_category',
    'm1_tax',
    'm1_terms',
    'm1_transaction_note',
    'm1_transaction_note_detail',
    'm1_type_sa',
    'm1_unit',
    'm1_warehouse',
    'm2_accounting_period',
    'm2_aj',
    'm2_aj_detail',
    'm2_bd',
    'm2_bd_detail',
    'm2_cb',
    'm2_cb_detail',
    'm2_cb_pay',
    'm2_cr',
    'm2_cr_detail',
    'm2_giro_list',
    'm2_gj',
    'm2_gj_detail',
    'm2_jm',
    'm2_jm_detail',
    'm2_realization',
    'm2_realization_branch',
    'm2_realization_cost_center',
    'm2_realization_division',
    'm2_realization_location',
    'm2_realization_project',
    'm2_realization_subdivision',
    'm2_rg',
    'm2_rg_detail',
    'm2_rgc',
    'm2_rgc_detail',
    'm2_rm',
    'm2_rm_detail',
    'm2_rm_pay',
    'm2_sg',
    'm2_sg_detail',
    'm2_sgc',
    'm2_sgc_detail',
    'm2_sm',
    'm2_sm_detail',
    'm2_sm_pay',
    'm2_transaction_journal',
    'm2_transaction_journal_voucher',
    'm3_dc',
    'm3_dc_check',
    'm3_dc_detail',
    'm3_ib',
    'm3_ib_detail',
    'm3_mr',
    'm3_mr_detail',
    'm3_pa',
    'm3_pa_detail',
    'm3_rf',
    'm3_rf_detail',
    'm3_rs',
    'm3_rs_detail',
    'm3_rw',
    'm3_sa',
    'm3_sa_detail',
    'm3_sp',
    'm3_sp_detail',
    'm3_ts',
    'm3_ts_detail',
    'm4_ap',
    'm4_ap_pay',
    'm4_bs',
    'm4_bs_detail',
    'm4_cs',
    'm4_cs_detail',
    'm4_dnr',
    'm4_dnr_detail',
    'm4_grn',
    'm4_grn_detail',
    'm4_ipc',
    'm4_ipc_detail',
    'm4_pie',
    'm4_pie_detail',
    'm4_po',
    'm4_po_detail',
    'm4_pp',
    'm4_pp_pay',
    'm4_pr',
    'm4_pr_detail',
    'm4_prt',
    'm4_prt_detail',
    'm4_rfq',
    'm4_rfq_detail',
    'm4_ri',
    'm4_ri_detail',
    'm4_ri_pay',
    'm4_rq',
    'm4_rq_detail',
    'm4_vp',
    'm4_vp_detail',
    'm4_vp_pay',
    'm4_vpp',
    'm4_vpp_detail',
    'm4_vpp_pay',
    'm5_as',
    'm5_as_pay',
    'm5_cl',
    'm5_do',
    'm5_do_detail',
    'm5_dr',
    'm5_dr_detail',
    'm5_ic',
    'm5_ic_detail',
    'm5_ip',
    'm5_ip_pay',
    'm5_pi',
    'm5_pi_detail',
    'm5_pl',
    'm5_pl_detail',
    'm5_pv',
    'm5_pv_detail',
    'm5_rnr',
    'm5_rnr_detail',
    'm5_rp',
    'm5_rp_pay',
    'm5_si',
    'm5_si_detail',
    'm5_si_installment',
    'm5_si_pay',
    'm5_sie',
    'm5_sie_detail',
    'm5_so',
    'm5_so_detail',
    'm5_spa',
    'm5_spa_detail',
    'm5_sq',
    'm5_sq_detail',
    'm5_sr',
    'm5_sr_detail',
  ]);

  return explicitKeep.has(tableName);
}

const overrides = {
  m1_contact: {
    alias: 'master_kontak',
    description: 'Master kontak bisnis yang menampung customer, supplier, salesman, dan rekanan lain. Tabel ini menjadi referensi utama transaksi pembelian dan penjualan.',
    synonyms: ['kontak', 'customer', 'supplier'],
    always_apply_filters: 'kaktif = 1',
  },
  m1_item: {
    alias: 'master_barang',
    description: 'Master barang/jasa yang dipakai pada transaksi inventory, purchasing, dan sales. Menyimpan identitas item, satuan, stok, harga, dan akun persediaan.',
    synonyms: ['barang', 'produk', 'item'],
    always_apply_filters: 'baktif = 1',
  },
  m1_coa: {
    alias: 'master_akun',
    description: 'Chart of accounts untuk pencatatan seluruh transaksi keuangan. Tabel ini mendefinisikan nomor akun, nama akun, kategori, dan saldo berjalan.',
    synonyms: ['akun', 'rekening', 'coa'],
    always_apply_filters: 'caktif = 1',
  },
  m1_warehouse: {
    alias: 'master_gudang',
    description: 'Master gudang/lokasi penyimpanan stok. Dipakai sebagai referensi semua transaksi barang masuk, keluar, mutasi, dan saldo awal barang.',
    synonyms: ['gudang', 'warehouse', 'lokasi stok'],
  },
  m2_cb: {
    alias: 'saldo_awal_coa',
    description: 'Header transaksi saldo awal akun/COA pada awal periode. Dipakai untuk membentuk opening balance sebelum transaksi jurnal berjalan.',
    synonyms: ['saldo awal akun', 'opening balance', 'saldo awal coa'],
    always_apply_filters: 'cbisclose = 0',
  },
  m2_cb_detail: {
    alias: 'saldo_awal_coa_detail',
    description: 'Detail akun debit dan kredit untuk transaksi saldo awal COA. Setiap baris mewakili akun yang dibuka pada awal periode.',
    synonyms: ['detail saldo awal akun', 'opening balance detail', 'saldo akun'],
    always_apply_filters: 'isclose = 0',
  },
  m3_ib: {
    alias: 'saldo_awal_barang',
    description: 'Header transaksi saldo awal barang per gudang pada awal periode. Dipakai untuk membentuk posisi stok awal sebelum transaksi gudang berjalan.',
    synonyms: ['stok awal', 'opening stock', 'saldo awal barang'],
    always_apply_filters: 'ibisclose = 0',
  },
  m3_ib_detail: {
    alias: 'saldo_awal_barang_detail',
    description: 'Detail item untuk transaksi saldo awal barang. Setiap baris menyimpan qty awal, satuan, HPP, dan akun persediaan item.',
    synonyms: ['detail stok awal', 'opening stock detail', 'saldo awal item'],
    always_apply_filters: 'isclose = 0',
  },
  m4_po: {
    alias: 'order_pembelian',
    description: 'Header order pembelian ke supplier. Menjadi dasar proses penerimaan barang, invoice pembelian, dan kontrol outstanding pembelian.',
    synonyms: ['po', 'purchase order', 'order beli'],
    always_apply_filters: 'poisclose = 0',
  },
  m4_po_detail: {
    alias: 'order_pembelian_detail',
    description: 'Detail item untuk order pembelian. Menyimpan barang, qty, harga, diskon, pajak, dan referensi proses lanjut pembelian.',
    synonyms: ['detail po', 'item po', 'baris pembelian'],
    always_apply_filters: 'isclose = 0',
  },
  m4_grn: {
    alias: 'penerimaan_barang',
    description: 'Header penerimaan barang dari supplier atau dari order pembelian. Menjadi dasar update stok dan verifikasi barang datang.',
    synonyms: ['grn', 'barang masuk', 'penerimaan barang'],
    always_apply_filters: 'grnisclose = 0',
  },
  m4_ri: {
    alias: 'invoice_pembelian',
    description: 'Header invoice pembelian dari supplier. Dipakai untuk pencatatan hutang usaha dan dasar pembayaran hutang.',
    synonyms: ['invoice beli', 'faktur beli', 'tagihan supplier'],
    always_apply_filters: 'riisclose = 0',
  },
  m5_sq: {
    alias: 'penawaran_penjualan',
    description: 'Header penawaran penjualan ke customer. Menjadi dokumen awal negosiasi harga sebelum sales order dibuat.',
    synonyms: ['quotation', 'penawaran', 'quote'],
    always_apply_filters: 'sqisclose = 0',
  },
  m5_so: {
    alias: 'order_penjualan',
    description: 'Header sales order dari customer. Menjadi dasar pengiriman, penagihan, dan kontrol outstanding penjualan.',
    synonyms: ['so', 'sales order', 'order jual'],
    always_apply_filters: 'soisclose = 0',
  },
  m5_so_detail: {
    alias: 'order_penjualan_detail',
    description: 'Detail item sales order. Menyimpan barang, qty, harga, diskon, pajak, dan progres realisasi order.',
    synonyms: ['detail so', 'item so', 'baris penjualan'],
    always_apply_filters: 'isclose = 0',
  },
  m5_do: {
    alias: 'pengiriman_order',
    description: 'Header dokumen pengiriman barang ke customer. Mencatat realisasi delivery atas sales order.',
    synonyms: ['do', 'surat jalan', 'pengiriman'],
    always_apply_filters: 'doisclose = 0',
  },
  m5_si: {
    alias: 'invoice_penjualan',
    description: 'Header invoice penjualan ke customer. Menjadi dasar pencatatan piutang, penagihan, dan pelunasan penjualan.',
    synonyms: ['invoice', 'faktur', 'tagihan'],
    always_apply_filters: 'siisclose = 0',
  },
  m5_si_detail: {
    alias: 'invoice_penjualan_detail',
    description: 'Detail item pada invoice penjualan. Menyimpan kuantitas, harga, diskon, pajak, dan referensi dokumen asal.',
    synonyms: ['detail invoice', 'baris faktur', 'item invoice'],
    always_apply_filters: 'isclose = 0',
  },
};

const metricsMap = {
  m2_cb_detail: {
    total_debit: 'SUM(debit)',
    total_kredit: 'SUM(kredit)',
    saldo_bersih: 'SUM(debit - kredit)',
  },
  m3_ib_detail: {
    total_qty_awal: 'SUM(jmlbarang)',
    total_nilai_stok_awal: 'SUM(jmlbarang * hpp)',
  },
  m4_po_detail: {
    total_qty_pesan: 'SUM(jmlbarang)',
    total_nilai_po: 'SUM((jmlbarang * harga) - jmldiskon + jmlpajak1 + jmlpajak2)',
  },
  m5_so_detail: {
    total_qty_order: 'SUM(jmlbarang)',
    total_nilai_so: 'SUM((jmlbarang * harga) - jmldiskon + jmlpajak1 + jmlpajak2)',
  },
  m5_si_detail: {
    total_qty_invoice: 'SUM(jmlbarang)',
    total_penjualan_kotor: 'SUM(jmlbarang * harga)',
    total_diskon: 'SUM(jmldiskon)',
    total_pajak: 'SUM(jmlpajak1 + jmlpajak2)',
    total_penjualan_bersih: 'SUM((jmlbarang * harga) - jmldiskon + jmlpajak1 + jmlpajak2)',
  },
};

const relationMap = {
  m2_cb_detail: [
    { target_table: 'm2_cb', condition: 'm2_cb_detail.idcb = m2_cb.cbid' },
    { target_table: 'm1_coa', condition: 'm2_cb_detail.norek = m1_coa.cnomor' },
  ],
  m3_ib_detail: [
    { target_table: 'm3_ib', condition: 'm3_ib_detail.idib = m3_ib.ibid' },
    { target_table: 'm1_item', condition: 'm3_ib_detail.idbarang = m1_item.bid' },
  ],
  m4_po: [{ target_table: 'm1_contact', condition: 'm4_po.posupplier = m1_contact.kid' }],
  m4_po_detail: [
    { target_table: 'm4_po', condition: 'm4_po_detail.idpo = m4_po.poid' },
    { target_table: 'm1_item', condition: 'm4_po_detail.idbarang = m1_item.bid' },
  ],
  m4_grn: [{ target_table: 'm1_contact', condition: 'm4_grn.grnsupplier = m1_contact.kid' }],
  m4_ri: [{ target_table: 'm1_contact', condition: 'm4_ri.risupplier = m1_contact.kid' }],
  m5_sq: [{ target_table: 'm1_contact', condition: 'm5_sq.sqcustomer = m1_contact.kid' }],
  m5_so: [{ target_table: 'm1_contact', condition: 'm5_so.socustomer = m1_contact.kid' }],
  m5_so_detail: [
    { target_table: 'm5_so', condition: 'm5_so_detail.idso = m5_so.soid' },
    { target_table: 'm1_item', condition: 'm5_so_detail.idbarang = m1_item.bid' },
  ],
  m5_do: [{ target_table: 'm1_contact', condition: 'm5_do.docustomer = m1_contact.kid' }],
  m5_si: [{ target_table: 'm1_contact', condition: 'm5_si.sicustomer = m1_contact.kid' }],
  m5_si_detail: [
    { target_table: 'm5_si', condition: 'm5_si_detail.idsi = m5_si.siid' },
    { target_table: 'm1_item', condition: 'm5_si_detail.idbarang = m1_item.bid' },
  ],
};

const tableRows = parseTsv(query(`
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = '${DB}'
  AND table_name REGEXP '^(m0|m1|m2|m3|m4|m5)_'
ORDER BY table_name;
`));

const columnRows = parseTsv(query(`
SELECT table_name, column_name
FROM information_schema.columns
WHERE table_schema = '${DB}'
  AND table_name REGEXP '^(m0|m1|m2|m3|m4|m5)_'
ORDER BY table_name, ordinal_position;
`));

const columnsByTable = new Map();
for (const [tableName, columnName] of columnRows) {
  if (!columnsByTable.has(tableName)) columnsByTable.set(tableName, []);
  columnsByTable.get(tableName).push(columnName);
}

const tables = tableRows
  .map(([tableName]) => tableName)
  .filter((tableName) => shouldKeepTable(tableName))
  .map((tableName) => {
  const override = overrides[tableName] || {};
  const columns = {};
  for (const columnName of columnsByTable.get(tableName) || []) {
    if (!shouldKeepColumn(columnName)) continue;
    columns[columnName] = inferColumnDescription(tableName, columnName);
  }

  const table = {
    table_name: tableName,
    alias: override.alias || defaultAlias(tableName),
    description: override.description || inferDescription(tableName),
    synonyms: override.synonyms || inferSynonyms(tableName),
    columns,
  };

  if (override.always_apply_filters) table.always_apply_filters = override.always_apply_filters;
  if (metricsMap[tableName]) table.metrics = metricsMap[tableName];
  if (relationMap[tableName]) table.relationships = relationMap[tableName];

    return table;
  });

fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify({ tables }, null, 2)}\n`);
console.log(`Wrote ${tables.length} tables to ${OUTPUT_PATH}`);
