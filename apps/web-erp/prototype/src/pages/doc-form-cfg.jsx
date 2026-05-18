// Split: DOC_CFG lives here. Component in doc-form.jsx.
const DOC_CFG = {
  'inv-opname': {
    label: 'Stock Opname', code: 'SO', group: 'Persediaan',
    warehouse: true,
    lineCols: [
      { k: 'item', h: 'Item' },
      { k: 'qtyBuku', h: 'Qty Buku', num: true, w: 100 },
      { k: 'qtyFisik', h: 'Qty Fisik', num: true, w: 100 },
      { k: 'selisih', h: 'Selisih', num: true, w: 90 },
      { k: 'ket', h: 'Keterangan', w: 180 },
    ],
    seedLines: [
      { id: 1, item: 'FG-001 · Produk A', qtyBuku: 120, qtyFisik: 118, selisih: -2, ket: 'Selisih fisik' },
      { id: 2, item: 'RM-042 · Bahan Baku X', qtyBuku: 500, qtyFisik: 500, selisih: 0, ket: '' },
      { id: 3, item: 'WIP-011 · Semi Jadi B', qtyBuku: 30, qtyFisik: 28, selisih: -2, ket: 'Hilang gudang' },
    ],
  },
  'inv-mutasi': {
    label: 'Mutasi Stok', code: 'MS', group: 'Persediaan',
    dari: true, ke: true,
    lineCols: [
      { k: 'item', h: 'Item' },
      { k: 'qty', h: 'Qty', num: true, w: 90 },
      { k: 'ket', h: 'Keterangan', w: 220 },
    ],
    seedLines: [
      { id: 1, item: 'FG-001 · Produk A', qty: 50, ket: 'Transfer antar gudang' },
      { id: 2, item: 'FG-003 · Produk C', qty: 20, ket: 'Permintaan cabang' },
      { id: 3, item: 'RM-010 · Bahan Baku Y', qty: 100, ket: '' },
    ],
  },
  'inv-adjust': {
    label: 'Penyesuaian', code: 'AJ', group: 'Persediaan',
    warehouse: true,
    lineCols: [
      { k: 'item', h: 'Item' },
      { k: 'qty', h: 'Qty (±)', num: true, w: 90 },
      { k: 'alasan', h: 'Alasan', w: 180 },
      { k: 'nilai', h: 'Nilai', num: true, w: 120 },
    ],
    seedLines: [
      { id: 1, item: 'FG-001 · Produk A', qty: -5, alasan: 'Expired / rusak', nilai: 250000 },
      { id: 2, item: 'RM-042 · Bahan Baku X', qty: 10, alasan: 'Koreksi penerimaan', nilai: 80000 },
      { id: 3, item: 'PKG-007 · Kemasan', qty: -2, alasan: 'Hilang', nilai: 15000 },
    ],
  },
  'inv-transfer': {
    label: 'Transfer Gudang', code: 'TG', group: 'Persediaan',
    dari: true, ke: true,
    lineCols: [
      { k: 'item', h: 'Item' },
      { k: 'qty', h: 'Qty', num: true, w: 90 },
      { k: 'ket', h: 'Keterangan', w: 220 },
    ],
    seedLines: [
      { id: 1, item: 'FG-001 · Produk A', qty: 30, ket: 'Distribusi ke cabang' },
      { id: 2, item: 'FG-002 · Produk B', qty: 15, ket: '' },
      { id: 3, item: 'PKG-007 · Kemasan', qty: 100, ket: 'Stok tambahan' },
    ],
  },
  'pur-po': {
    label: 'PO Pembelian', code: 'PO', group: 'Pembelian',
    party: 'Supplier',
    lineCols: [
      { k: 'item', h: 'Item' },
      { k: 'qty', h: 'Qty', num: true, w: 80 },
      { k: 'satuan', h: 'Satuan', w: 70 },
      { k: 'harga', h: 'Harga', num: true, w: 120 },
      { k: 'diskon', h: 'Diskon%', num: true, w: 80 },
      { k: 'subtotal', h: 'Subtotal', num: true, w: 130 },
    ],
    seedLines: [
      { id: 1, item: 'RM-042 · Bahan Baku X', qty: 200, satuan: 'Kg', harga: 15000, diskon: 0, subtotal: 3000000 },
      { id: 2, item: 'PKG-007 · Kemasan', qty: 500, satuan: 'Pcs', harga: 1200, diskon: 5, subtotal: 570000 },
      { id: 3, item: 'RM-010 · Bahan Baku Y', qty: 100, satuan: 'Ltr', harga: 22000, diskon: 0, subtotal: 2200000 },
    ],
  },
  'pur-receipt': {
    label: 'Penerimaan Barang', code: 'PR', group: 'Pembelian',
    party: 'Supplier', warehouse: true,
    lineCols: [
      { k: 'item', h: 'Item' },
      { k: 'qtyPo', h: 'Qty PO', num: true, w: 90 },
      { k: 'qtyTerima', h: 'Qty Terima', num: true, w: 100 },
      { k: 'satuan', h: 'Satuan', w: 70 },
      { k: 'ket', h: 'Keterangan', w: 180 },
    ],
    seedLines: [
      { id: 1, item: 'RM-042 · Bahan Baku X', qtyPo: 200, qtyTerima: 198, satuan: 'Kg', ket: '2 Kg rusak' },
      { id: 2, item: 'PKG-007 · Kemasan', qtyPo: 500, qtyTerima: 500, satuan: 'Pcs', ket: '' },
      { id: 3, item: 'RM-010 · Bahan Baku Y', qtyPo: 100, qtyTerima: 100, satuan: 'Ltr', ket: '' },
    ],
  },
  'pur-invoice': {
    label: 'Faktur Pembelian', code: 'PI', group: 'Pembelian',
    party: 'Supplier',
    lineCols: [
      { k: 'item', h: 'Item' },
      { k: 'qty', h: 'Qty', num: true, w: 80 },
      { k: 'satuan', h: 'Satuan', w: 70 },
      { k: 'harga', h: 'Harga', num: true, w: 120 },
      { k: 'pajak', h: 'Pajak%', num: true, w: 80 },
      { k: 'subtotal', h: 'Subtotal', num: true, w: 130 },
    ],
    seedLines: [
      { id: 1, item: 'RM-042 · Bahan Baku X', qty: 198, satuan: 'Kg', harga: 15000, pajak: 11, subtotal: 3300300 },
      { id: 2, item: 'PKG-007 · Kemasan', qty: 500, satuan: 'Pcs', harga: 1200, pajak: 11, subtotal: 666600 },
      { id: 3, item: 'RM-010 · Bahan Baku Y', qty: 100, satuan: 'Ltr', harga: 22000, pajak: 11, subtotal: 2442000 },
    ],
  },
  'pur-return': {
    label: 'Retur Pembelian', code: 'PRT', group: 'Pembelian',
    party: 'Supplier', warehouse: true,
    lineCols: [
      { k: 'item', h: 'Item' },
      { k: 'qty', h: 'Qty', num: true, w: 80 },
      { k: 'alasan', h: 'Alasan', w: 180 },
      { k: 'nilai', h: 'Nilai', num: true, w: 130 },
    ],
    seedLines: [
      { id: 1, item: 'RM-042 · Bahan Baku X', qty: 2, alasan: 'Rusak saat pengiriman', nilai: 30000 },
      { id: 2, item: 'PKG-007 · Kemasan', qty: 10, alasan: 'Tidak sesuai spec', nilai: 12000 },
      { id: 3, item: 'RM-010 · Bahan Baku Y', qty: 5, alasan: 'Expired', nilai: 110000 },
    ],
  },
  'sales-order': {
    label: 'SO Penjualan', code: 'SO', group: 'Sales',
    party: 'Customer',
    lineCols: [
      { k: 'item', h: 'Item' },
      { k: 'qty', h: 'Qty', num: true, w: 80 },
      { k: 'satuan', h: 'Satuan', w: 70 },
      { k: 'harga', h: 'Harga', num: true, w: 120 },
      { k: 'diskon', h: 'Diskon%', num: true, w: 80 },
      { k: 'subtotal', h: 'Subtotal', num: true, w: 130 },
    ],
    seedLines: [
      { id: 1, item: 'FG-001 · Produk A', qty: 10, satuan: 'Pcs', harga: 85000, diskon: 0, subtotal: 850000 },
      { id: 2, item: 'FG-002 · Produk B', qty: 5, satuan: 'Pcs', harga: 120000, diskon: 10, subtotal: 540000 },
      { id: 3, item: 'FG-003 · Produk C', qty: 20, satuan: 'Pcs', harga: 45000, diskon: 5, subtotal: 855000 },
    ],
  },
  'sal-do': {
    label: 'Pengiriman', code: 'DO', group: 'Sales',
    party: 'Customer', warehouse: true,
    lineCols: [
      { k: 'item', h: 'Item' },
      { k: 'qtySo', h: 'Qty SO', num: true, w: 90 },
      { k: 'qtyKirim', h: 'Qty Kirim', num: true, w: 100 },
      { k: 'satuan', h: 'Satuan', w: 70 },
      { k: 'ket', h: 'Keterangan', w: 180 },
    ],
    seedLines: [
      { id: 1, item: 'FG-001 · Produk A', qtySo: 10, qtyKirim: 10, satuan: 'Pcs', ket: '' },
      { id: 2, item: 'FG-002 · Produk B', qtySo: 5, qtyKirim: 5, satuan: 'Pcs', ket: '' },
      { id: 3, item: 'FG-003 · Produk C', qtySo: 20, qtyKirim: 18, satuan: 'Pcs', ket: '2 belum siap' },
    ],
  },
  'sal-invoice': {
    label: 'Faktur Penjualan', code: 'SI', group: 'Sales',
    party: 'Customer',
    lineCols: [
      { k: 'item', h: 'Item' },
      { k: 'qty', h: 'Qty', num: true, w: 80 },
      { k: 'satuan', h: 'Satuan', w: 70 },
      { k: 'harga', h: 'Harga', num: true, w: 120 },
      { k: 'pajak', h: 'Pajak%', num: true, w: 80 },
      { k: 'subtotal', h: 'Subtotal', num: true, w: 130 },
    ],
    seedLines: [
      { id: 1, item: 'FG-001 · Produk A', qty: 10, satuan: 'Pcs', harga: 85000, pajak: 11, subtotal: 943500 },
      { id: 2, item: 'FG-002 · Produk B', qty: 5, satuan: 'Pcs', harga: 120000, pajak: 11, subtotal: 666000 },
      { id: 3, item: 'FG-003 · Produk C', qty: 18, satuan: 'Pcs', harga: 45000, pajak: 11, subtotal: 899100 },
    ],
  },
  'sal-return': {
    label: 'Retur Penjualan', code: 'SRT', group: 'Sales',
    party: 'Customer', warehouse: true,
    lineCols: [
      { k: 'item', h: 'Item' },
      { k: 'qty', h: 'Qty', num: true, w: 80 },
      { k: 'alasan', h: 'Alasan', w: 180 },
      { k: 'nilai', h: 'Nilai', num: true, w: 130 },
    ],
    seedLines: [
      { id: 1, item: 'FG-001 · Produk A', qty: 1, alasan: 'Produk cacat', nilai: 85000 },
      { id: 2, item: 'FG-003 · Produk C', qty: 2, alasan: 'Tidak sesuai pesanan', nilai: 90000 },
      { id: 3, item: 'FG-002 · Produk B', qty: 1, alasan: 'Salah kirim', nilai: 120000 },
    ],
  },
  'prd-wo': {
    label: 'Work Order', code: 'WO', group: 'Produksi',
    warehouse: true,
    lineCols: [
      { k: 'komponen', h: 'Komponen' },
      { k: 'qtyRencana', h: 'Qty Rencana', num: true, w: 110 },
      { k: 'qtyAktual', h: 'Qty Aktual', num: true, w: 100 },
      { k: 'satuan', h: 'Satuan', w: 70 },
      { k: 'ket', h: 'Keterangan', w: 180 },
    ],
    seedLines: [
      { id: 1, komponen: 'RM-042 · Bahan Baku X', qtyRencana: 50, qtyAktual: 50, satuan: 'Kg', ket: '' },
      { id: 2, komponen: 'RM-010 · Bahan Baku Y', qtyRencana: 20, qtyAktual: 19, satuan: 'Ltr', ket: 'Kurang 1L' },
      { id: 3, komponen: 'PKG-007 · Kemasan', qtyRencana: 100, qtyAktual: 100, satuan: 'Pcs', ket: '' },
    ],
  },
  'prd-bom': {
    label: 'BOM', code: 'BOM', group: 'Produksi',
    lineCols: [
      { k: 'komponen', h: 'Komponen' },
      { k: 'qty', h: 'Qty', num: true, w: 80 },
      { k: 'satuan', h: 'Satuan', w: 70 },
      { k: 'tipe', h: 'Tipe', w: 130 },
      { k: 'ket', h: 'Keterangan', w: 180 },
    ],
    seedLines: [
      { id: 1, komponen: 'RM-042 · Bahan Baku X', qty: 2.5, satuan: 'Kg', tipe: 'Bahan Baku', ket: 'Per unit FG' },
      { id: 2, komponen: 'RM-010 · Bahan Baku Y', qty: 1, satuan: 'Ltr', tipe: 'Bahan Baku', ket: '' },
      { id: 3, komponen: 'WIP-011 · Semi Jadi B', qty: 1, satuan: 'Pcs', tipe: 'Setengah Jadi', ket: 'Dari WO terpisah' },
    ],
  },
  'prd-output': {
    label: 'Output Produksi', code: 'OP', group: 'Produksi',
    warehouse: true,
    lineCols: [
      { k: 'produk', h: 'Produk' },
      { k: 'qtyRencana', h: 'Qty Rencana', num: true, w: 110 },
      { k: 'qtyJadi', h: 'Qty Jadi', num: true, w: 95 },
      { k: 'reject', h: 'Reject', num: true, w: 75 },
      { k: 'satuan', h: 'Satuan', w: 70 },
    ],
    seedLines: [
      { id: 1, produk: 'FG-001 · Produk A', qtyRencana: 100, qtyJadi: 97, reject: 3, satuan: 'Pcs' },
      { id: 2, produk: 'FG-002 · Produk B', qtyRencana: 50, qtyJadi: 50, reject: 0, satuan: 'Pcs' },
      { id: 3, produk: 'FG-003 · Produk C', qtyRencana: 200, qtyJadi: 195, reject: 5, satuan: 'Pcs' },
    ],
  },
  'fa-disposal': {
    label: 'Disposal', code: 'DSP', group: 'Fixed Asset',
    lineCols: [
      { k: 'aset', h: 'Aset' },
      { k: 'nilaiBuku', h: 'Nilai Buku', num: true, w: 130 },
      { k: 'metode', h: 'Metode Jual', w: 120 },
      { k: 'nilaiJual', h: 'Nilai Jual', num: true, w: 130 },
      { k: 'labaRugi', h: 'Laba/Rugi', num: true, w: 120 },
    ],
    seedLines: [
      { id: 1, aset: 'FA-001 · Mesin Press A', nilaiBuku: 45000000, metode: 'Lelang', nilaiJual: 50000000, labaRugi: 5000000 },
      { id: 2, aset: 'FA-008 · Kendaraan Operasional', nilaiBuku: 120000000, metode: 'Jual Langsung', nilaiJual: 95000000, labaRugi: -25000000 },
      { id: 3, aset: 'FA-015 · Komputer Lama', nilaiBuku: 0, metode: 'Scrap', nilaiJual: 500000, labaRugi: 500000 },
    ],
  },
};

window.DOC_CFG = DOC_CFG;
