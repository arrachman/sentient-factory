# Advanced Dashboard Use Cases

## 1. Dashboard Piutang Customer
- Question: Tampilkan dashboard piutang customer berisi daftar invoice belum lunas, total outstanding per customer, aging bucket, dan customer dengan risiko keterlambatan tertinggi.
- Expected widgets: table invoice, bar outstanding per customer, aging chart, risk ranking.
- Expected query count: 3
- Tables involved: `m5_si`, `m1_contact`

## 2. Funnel Dokumen Penjualan
- Question: Tampilkan funnel konversi penjualan dari sales quotation ke sales order, delivery order, delivery report, lalu sales invoice per bulan.
- Expected widgets: stage summary, conversion chart, trend bulanan.
- Expected query count: 3
- Tables involved: `m5_sq`, `m5_sq_detail`, `m5_so`, `m5_so_detail`, `m5_do`, `m5_do_detail`, `m5_dr`, `m5_dr_detail`, `m5_si`, `m5_si_detail`

## 3. Customer 360 Sales
- Question: Untuk customer tertentu, tampilkan ringkasan invoice, invoice belum lunas, riwayat collection, payment voucher, dan retur penjualan.
- Expected widgets: customer summary, invoice table, payment/collection table, return chart.
- Expected query count: 3
- Tables involved: `m1_contact`, `m5_si`, `m5_ic`, `m5_ic_detail`, `m5_pv`, `m5_pv_detail`, `m5_sr`

## 4. Monitoring Fulfillment
- Question: Tampilkan item sales order yang belum menjadi delivery order, delivery order yang belum menjadi delivery report, dan delivery report yang belum menjadi invoice.
- Expected widgets: backlog table per stage, bottleneck chart, summary cards.
- Expected query count: 3
- Tables involved: `m5_so_detail`, `m5_do_detail`, `m5_dr_detail`, `m5_si_detail`

## 5. Analisis Outstanding dan Collection
- Question: Bandingkan outstanding sales invoice dengan invoice collection dan payment voucher untuk melihat invoice yang belum tertagih, sudah tertagih, atau sudah dibayar sebagian.
- Expected widgets: status matrix, outstanding table, collection/payment chart.
- Expected query count: 3
- Tables involved: `m5_si`, `m5_ic`, `m5_ic_detail`, `m5_pv`, `m5_pv_detail`

## 6. Aging dan Cash Collection
- Question: Tampilkan aging invoice per customer, tren pembayaran mingguan, dan rasio collection terhadap invoice jatuh tempo dalam 90 hari terakhir.
- Expected widgets: aging bucket chart, payment trend line, collection ratio table.
- Expected query count: 3
- Tables involved: `m5_si`, `m5_ic`, `m5_ic_detail`, `m1_contact`

## 7. Profitability per Customer
- Question: Tampilkan customer dengan margin bersih tertinggi dan terendah berdasarkan invoice penjualan, biaya invoice, retur, dan diskon.
- Expected widgets: ranking table, margin bar chart, negative-margin alerts.
- Expected query count: 3
- Tables involved: `m5_si`, `m5_si_detail`, `m5_si_cost`, `m5_sr`

## 8. Retur dan Tukar Faktur
- Question: Tampilkan hubungan sales invoice, sales return, dan tukar faktur untuk melihat pola retur dan penggantian dokumen per customer.
- Expected widgets: linked document table, return trend chart, customer impact summary.
- Expected query count: 3
- Tables involved: `m5_si`, `m5_sr`, `m5_sie`, `m5_sie_detail`

## 9. Poin Loyalty dan Penyesuaian Penjualan
- Question: Tampilkan saldo poin customer, mutasi poin masuk-keluar, dan penyesuaian poin manual per bulan.
- Expected widgets: point ledger table, point trend chart, top adjusted customers.
- Expected query count: 3
- Tables involved: `m5_spa`, `m5_spa_detail`, `m1_contact`

## 10. Executive Risk Dashboard
- Question: Tampilkan customer berisiko berdasarkan kombinasi outstanding tinggi, aging panjang, retur tinggi, collection lambat, dan fulfillment yang macet.
- Expected widgets: risk ranking, heatmap/status chart, issue drilldown table.
- Expected query count: 3
- Tables involved: `m5_si`, `m5_sr`, `m5_ic`, `m5_ic_detail`, `m5_so`, `m5_do`, `m5_dr`, `m1_contact`
