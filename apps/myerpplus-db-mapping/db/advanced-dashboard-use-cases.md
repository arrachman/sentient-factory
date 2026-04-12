# Advanced Dashboard Use Cases

Catatan:
- Gunakan OBT/dim sebagai source utama untuk dashboard AI dan query analitik.
- Hindari tabel source mentah `m*` kecuali ada kebutuhan yang belum tercakup di OBT aktif.
- OBT aktif utama untuk use case di bawah ini: `obt_sales_receivable`, `obt_sales_line_flow`, `obt_sales_order_line_flow`, `obt_finance_document`, `obt_finance_document_line`, `dim_contact`, `dim_item`.

## 1. Dashboard Piutang Customer
- Question: Tampilkan dashboard piutang customer berisi daftar invoice belum lunas, total outstanding per customer, aging bucket, dan customer dengan risiko keterlambatan tertinggi.
- Expected widgets: table invoice, bar outstanding per customer, aging chart, risk ranking.
- Expected query count: 3
- Preferred OBT sources: `obt_sales_receivable`, `dim_contact`

## 2. Funnel Dokumen Penjualan
- Question: Tampilkan funnel konversi penjualan dari sales quotation ke sales order, delivery order, delivery report, lalu sales invoice per bulan.
- Expected widgets: stage summary, conversion chart, trend bulanan.
- Expected query count: 3
- Preferred OBT sources: `obt_sales_order_line_flow`, `obt_sales_line_flow`

## 3. Customer 360 Sales
- Question: Untuk customer tertentu, tampilkan ringkasan invoice, invoice belum lunas, riwayat collection, payment voucher, dan retur penjualan.
- Expected widgets: customer summary, invoice table, payment/collection table, return chart.
- Expected query count: 3
- Preferred OBT sources: `dim_contact`, `obt_sales_receivable`, `obt_sales_line_flow`

## 4. Monitoring Fulfillment
- Question: Tampilkan item sales order yang belum menjadi delivery order, delivery order yang belum menjadi delivery report, dan delivery report yang belum menjadi invoice.
- Expected widgets: backlog table per stage, bottleneck chart, summary cards.
- Expected query count: 3
- Preferred OBT sources: `obt_sales_order_line_flow`, `obt_sales_line_flow`

## 5. Analisis Outstanding dan Collection
- Question: Bandingkan outstanding sales invoice dengan invoice collection dan payment voucher untuk melihat invoice yang belum tertagih, sudah tertagih, atau sudah dibayar sebagian.
- Expected widgets: status matrix, outstanding table, collection/payment chart.
- Expected query count: 3
- Preferred OBT sources: `obt_sales_receivable`

## 6. Aging dan Cash Collection
- Question: Tampilkan aging invoice per customer, tren pembayaran mingguan, dan rasio collection terhadap invoice jatuh tempo dalam 90 hari terakhir.
- Expected widgets: aging bucket chart, payment trend line, collection ratio table.
- Expected query count: 3
- Preferred OBT sources: `obt_sales_receivable`, `dim_contact`

## 7. Profitability per Customer
- Question: Tampilkan customer dengan margin bersih tertinggi dan terendah berdasarkan invoice penjualan, biaya invoice, retur, dan diskon.
- Expected widgets: ranking table, margin bar chart, negative-margin alerts.
- Expected query count: 3
- Preferred OBT sources: `obt_sales_line_flow`, `dim_contact`
- Coverage note: biaya invoice detail seperti `m5_si_cost` belum punya OBT khusus, jadi profitability bersih penuh masih butuh perluasan OBT atau fallback source terbatas.

## 8. Retur dan Tukar Faktur
- Question: Tampilkan hubungan sales invoice, sales return, dan tukar faktur untuk melihat pola retur dan penggantian dokumen per customer.
- Expected widgets: linked document table, return trend chart, customer impact summary.
- Expected query count: 3
- Preferred OBT sources: `obt_sales_line_flow`, `dim_contact`
- Coverage note: `tukar faktur` belum punya OBT khusus, jadi linkage penuh untuk `m5_sie` masih perlu perluasan OBT.

## 9. Poin Loyalty dan Penyesuaian Penjualan
- Question: Tampilkan saldo poin customer, mutasi poin masuk-keluar, dan penyesuaian poin manual per bulan.
- Expected widgets: point ledger table, point trend chart, top adjusted customers.
- Expected query count: 3
- Preferred OBT sources: `dim_contact`
- Coverage note: OBT loyalty/poin belum ada; use case ini masih blocked sampai canonical OBT `m5` untuk poin dibuat.

## 10. Executive Risk Dashboard
- Question: Tampilkan customer berisiko berdasarkan kombinasi outstanding tinggi, aging panjang, retur tinggi, collection lambat, dan fulfillment yang macet.
- Expected widgets: risk ranking, heatmap/status chart, issue drilldown table.
- Expected query count: 3
- Preferred OBT sources: `obt_sales_receivable`, `obt_sales_order_line_flow`, `obt_sales_line_flow`, `dim_contact`

## 11. Dashboard Kas Masuk
- Question: Tampilkan dashboard kas masuk berisi tren penerimaan kas, daftar transaksi kas masuk terbaru, distribusi penerimaan per kontak, dan rekening penerimaan yang paling aktif.
- Expected widgets: daily trend line, latest transactions table, top contacts bar chart, account distribution donut.
- Expected query count: 3
- Preferred OBT sources: `obt_cash_receipt_line_flow`, `obt_finance_document`, `obt_finance_document_line`, `dim_contact`

## 12. Dashboard Kas Keluar
- Question: Tampilkan dashboard kas keluar berisi tren pengeluaran kas, daftar pembayaran terbaru, distribusi pengeluaran per kontak, dan rekening beban atau kas yang paling sering dipakai.
- Expected widgets: daily trend line, payment table, top payees bar chart, account usage chart.
- Expected query count: 3
- Preferred OBT sources: `obt_cash_disbursement_line_flow`, `obt_finance_document`, `obt_finance_document_line`, `dim_contact`

## 13. Cash Position dan Arus Kas Harian
- Question: Tampilkan posisi kas harian dari total kas masuk, kas keluar, dan net cashflow per hari atau per minggu.
- Expected widgets: inflow vs outflow line chart, net cashflow bar chart, summary cards.
- Expected query count: 3
- Preferred OBT sources: `obt_cash_receipt_line_flow`, `obt_cash_disbursement_line_flow`

## 14. Monitoring Receipt Money
- Question: Tampilkan dashboard receipt money untuk melihat penerimaan pembayaran, kontak pembayar terbesar, rekening tujuan, dan tren penerimaan per periode.
- Expected widgets: receipt trend line, top payers table, destination account chart, summary cards.
- Expected query count: 3
- Preferred OBT sources: `obt_receipt_money_line_flow`, `obt_finance_document`, `obt_finance_document_line`, `dim_contact`

## 15. Monitoring Dokumen Finance
- Question: Tampilkan jumlah dan nilai dokumen finance per tipe dokumen seperti CR, CD, RM, SM, CB, dan GJ per bulan.
- Expected widgets: document count by type, value by type stacked bar, monthly trend chart.
- Expected query count: 3
- Preferred OBT sources: `obt_finance_document`, `obt_finance_document_line`

## 16. Analisis Rekening dan COA Finance
- Question: Tampilkan rekening atau COA yang paling aktif berdasarkan jumlah line transaksi, total nominal debit atau kredit, dan sebaran per tipe dokumen.
- Expected widgets: top account ranking, COA mix chart, detail ledger table.
- Expected query count: 3
- Preferred OBT sources: `obt_finance_document_line`

## 17. Jurnal Umum dan Adjustment Monitoring
- Question: Tampilkan tren jurnal umum, line adjustment terbesar, dan rekening yang paling sering terkena jurnal penyesuaian.
- Expected widgets: trend line, largest adjustment table, top adjusted account chart.
- Expected query count: 3
- Preferred OBT sources: `obt_finance_document`, `obt_finance_document_line`
- Coverage note: saat ini coverage kuat untuk `GJ`; family adjustment lain tetap mengikuti ketersediaan source.

## 18. Cash Flow per Kontak
- Question: Tampilkan arus kas masuk dan keluar per kontak untuk melihat customer atau vendor dengan pengaruh kas terbesar dalam periode tertentu.
- Expected widgets: net flow ranking, inflow-outflow comparison chart, contact drilldown table.
- Expected query count: 3
- Preferred OBT sources: `obt_cash_receipt_line_flow`, `obt_cash_disbursement_line_flow`, `obt_receipt_money_line_flow`, `dim_contact`

## 19. Dashboard Finance Executive
- Question: Tampilkan ringkasan finance executive berisi total kas masuk, total kas keluar, net flow, distribusi dokumen finance, dan top account movement bulan berjalan.
- Expected widgets: executive summary cards, finance mix chart, trend line, top account table.
- Expected query count: 4
- Preferred OBT sources: `obt_finance_document`, `obt_finance_document_line`, `obt_cash_receipt_line_flow`, `obt_cash_disbursement_line_flow`, `obt_receipt_money_line_flow`

## 20. Monitoring Alokasi Pembayaran
- Question: Tampilkan dashboard alokasi pembayaran untuk melihat distribusi payment ke dokumen target, outstanding allocation, dan dokumen yang belum teralokasi penuh.
- Expected widgets: allocation summary, unmatched document table, allocation coverage chart.
- Expected query count: 3
- Preferred OBT sources: `obt_finance_allocation`, `obt_finance_document`, `obt_finance_document_line`
- Coverage note: canonical `obt_finance_allocation` masih source-empty karena tabel `_pay` belum berisi data.

## 21. Sales to Cash Conversion
- Question: Tampilkan konversi end-to-end dari sales order menjadi invoice lalu collection atau cash receipt untuk melihat lead time dan leakage per customer.
- Expected widgets: conversion funnel, lead time distribution, leakage table, customer drilldown.
- Expected query count: 4
- Preferred OBT sources: `obt_sales_order_line_flow`, `obt_sales_line_flow`, `obt_sales_receivable`, `obt_cash_receipt_line_flow`, `dim_contact`
- Advanced relation note: use case ini menghubungkan flow order, invoice, receivable, dan cash realization lintas OBT.

## 22. Purchase to Payment Cycle
- Question: Tampilkan siklus pembelian dari purchase order sampai receipt atau invoice lalu pembayaran vendor untuk melihat lead time proses dan outstanding payment per vendor.
- Expected widgets: cycle time chart, vendor outstanding table, stage bottleneck chart, payment coverage summary.
- Expected query count: 4
- Preferred OBT sources: `obt_purchase_line_flow`, `obt_purchase_document_line_event`, `obt_purchase_payment`, `dim_contact`, `dim_item`
- Advanced relation note: use case ini menggabungkan flow dokumen purchasing dengan payment realization.

## 23. Inventory Movement versus Sales Demand
- Question: Bandingkan pergerakan inventory dengan demand penjualan untuk melihat item yang cepat habis, item overstock, dan item dengan penjualan tinggi tapi movement masuk rendah.
- Expected widgets: item velocity table, demand vs movement scatter plot, stock risk alerts.
- Expected query count: 4
- Preferred OBT sources: `obt_inventory_movement_line`, `obt_sales_order_line_flow`, `obt_sales_line_flow`, `dim_item`
- Advanced relation note: analisis membutuhkan relasi item lintas inventory dan sales flow dalam grain line item.

## 24. Customer Exposure and Collection Risk
- Question: Tampilkan eksposur customer berdasarkan nilai sales invoice, outstanding receivable, cash collection aktual, dan retur agar terlihat customer yang penjualannya tinggi tetapi realisasi kasnya lemah.
- Expected widgets: exposure ranking, receivable vs cash matrix, return-adjusted risk chart.
- Expected query count: 4
- Preferred OBT sources: `obt_sales_receivable`, `obt_sales_line_flow`, `obt_cash_receipt_line_flow`, `dim_contact`
- Advanced relation note: use case ini mengombinasikan revenue-side flow dengan cash realization per customer.

## 25. Finance and Operational Reconciliation
- Question: Tampilkan rekonsiliasi antara dokumen operasional penjualan atau pembelian dengan posting finance untuk melihat dokumen yang nilai operasionalnya tidak sinkron dengan nilai finance line.
- Expected widgets: reconciliation exceptions table, variance summary, document-type comparison chart.
- Expected query count: 4
- Preferred OBT sources: `obt_sales_line_flow`, `obt_purchase_line_flow`, `obt_finance_document`, `obt_finance_document_line`, `dim_contact`
- Coverage note: rekonsiliasi dilakukan dengan key dokumen, kontak, tanggal, dan nominal terdekat; coverage akan lebih kuat jika mapping jurnal per dokumen ditambahkan eksplisit.

## 26. Working Capital Radar
- Question: Tampilkan radar modal kerja yang menggabungkan receivable aging, purchase payment pressure, cash inflow-outflow, dan pergerakan inventory agar terlihat area tekanan likuiditas utama.
- Expected widgets: working capital scorecards, liquidity radar, aging buckets, pressure hotspot table.
- Expected query count: 5
- Preferred OBT sources: `obt_sales_receivable`, `obt_purchase_payment`, `obt_cash_receipt_line_flow`, `obt_cash_disbursement_line_flow`, `obt_inventory_movement_line`, `dim_contact`, `dim_item`
- Advanced relation note: ini adalah use case lintas domain finance, purchasing, sales, dan inventory.

## 27. Inventory Valuation versus Finance Posting
- Question: Tampilkan perbandingan antara nilai pergerakan inventory dengan nilai posting finance untuk melihat item atau dokumen yang valuation inventory-nya tidak sinkron dengan jurnal finance.
- Expected widgets: valuation variance table, item-level variance chart, document reconciliation summary.
- Expected query count: 4
- Preferred OBT sources: `obt_inventory_movement_line`, `obt_finance_document`, `obt_finance_document_line`, `dim_item`
- Coverage note: rekonsiliasi dilakukan melalui dokumen referensi, item, tanggal, dan nominal terdekat; hasil akan lebih kuat jika nanti ada canonical OBT khusus inventory accounting bridge.

## 28. Stock Adjustment Financial Impact
- Question: Tampilkan dampak finansial dari stock adjustment untuk melihat adjustment inventory terbesar, akun finance yang terpengaruh, dan tren nilai adjustment per periode.
- Expected widgets: adjustment impact table, monthly impact trend, affected account chart.
- Expected query count: 4
- Preferred OBT sources: `obt_inventory_movement_line`, `obt_finance_document_line`, `dim_item`
- Advanced relation note: use case ini menghubungkan event `SA_LINE` di inventory dengan line finance yang merepresentasikan dampak nominalnya.

## 29. Inventory Shrinkage and Expense Correlation
- Question: Tampilkan korelasi antara inventory shrinkage atau adjustment negatif dengan beban atau akun expense di finance untuk mengidentifikasi area kehilangan stok yang paling mahal.
- Expected widgets: shrinkage heatmap, expense correlation table, item-loss ranking.
- Expected query count: 4
- Preferred OBT sources: `obt_inventory_movement_line`, `obt_finance_document_line`, `dim_item`
- Coverage note: perlu aturan klasifikasi movement keluar atau adjustment negatif pada inventory dan pemetaan akun expense di finance line.

## 30. Warehouse Cash and Stock Pressure
- Question: Tampilkan tekanan operasional per gudang berdasarkan movement inventory, pengeluaran kas terkait pembelian, dan penjualan item keluar agar terlihat gudang dengan tekanan modal terbesar.
- Expected widgets: warehouse pressure ranking, cash vs movement matrix, outbound trend chart.
- Expected query count: 5
- Preferred OBT sources: `obt_inventory_movement_line`, `obt_purchase_payment`, `obt_cash_disbursement_line_flow`, `obt_sales_line_flow`, `dim_item`
- Coverage note: analisis per gudang bergantung pada konsistensi atribut gudang dan lokasi di OBT inventory serta linkage dokumen pembelian dan penjualan.
