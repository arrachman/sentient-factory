# M0 Report Reference for `rmoduleid = 5`

Dokumen ini merangkum metadata report `m0_report` untuk `rmoduleid = 5` dan ditujukan sebagai sumber bantu saat merapikan semantic schema di [`semantic-schema-m5.json`](/home/rania/apps/sentient-factory/apps/myerpplus-db-mapping/db/m5%20-%20sales/semantic-schema-m5.json).

Fokus dokumen:
- menjelaskan fungsi bisnis tabel `m5_*` dari sudut pandang report legacy
- menunjukkan pola header-detail dan relasi lintas dokumen
- menyorot kolom yang benar-benar muncul di query report
- memberi petunjuk mana tabel yang layak diprioritaskan di semantic schema

Catatan:
- sumber ini berasal dari query report, jadi ia kuat untuk kebutuhan baca/reporting
- sumber ini tidak selalu lengkap untuk kebutuhan transaksi CRUD
- beberapa tabel helper muncul di report tetapi belum tentu sudah masuk semantic schema

## Cara Pakai untuk Semantic Schema

Gunakan dokumen ini untuk:
- menulis `description` tabel agar sesuai konteks bisnis report
- memilih `synonyms` tabel berdasarkan nama report
- menambah kolom yang sering dipakai report ke `columns`
- memvalidasi relationship antar dokumen `SQ -> SO -> PL/DO -> DR/PI -> SI -> RNR/SR`

Jangan gunakan dokumen ini sendirian untuk:
- menyimpulkan seluruh struktur tabel
- menentukan kolom write-only
- menentukan constraint database

## Ringkasan Domain M5 dari Report

Pola besar yang terlihat di report:
- `m5_sq` dan `m5_sq_detail` adalah tahap penawaran penjualan.
- `m5_so` dan `m5_so_detail` adalah sales order.
- `m5_pl` dan `m5_pl_detail` adalah packing list.
- `m5_do` dan `m5_do_detail` adalah delivery order atau pengiriman.
- `m5_dr` dan `m5_dr_detail` adalah hasil pengiriman.
- `m5_pi` dan `m5_pi_detail` adalah proforma invoice.
- `m5_si` dan `m5_si_detail` adalah invoice penjualan final.
- `m5_rnr` dan `m5_rnr_detail` adalah penerimaan barang retur.
- `m5_sr` dan `m5_sr_detail` adalah retur penjualan.
- `m5_as`, `m5_ip`, `m5_ic`, `m5_pv`, `m5_rp` dan tabel pay/detail terkait adalah area uang muka, penerimaan pembayaran, penagihan, pembayaran piutang, dan piutang ongkos kirim.
- `m5_spa` dan `m5_spa_detail` adalah penyesuaian poin penjualan.
- `m5_sie` dan `m5_sie_detail` adalah tukar faktur penjualan.

## Prioritas Tabel Inti

### `m5_sq`
- Fungsi: header penawaran penjualan.
- Synonym yang cocok: `sales quotation`, `penawaran penjualan`, `SQ`.
- Report contoh: `Daftar Penawaran Penjualan`, `SQ Outstanding`, `SQ Terkait SO dan DO`.
- Kolom penting dari report:
  - identitas: `sqid`, `sqnotransaksi`
  - tanggal/status: `sqtgl`, `sqstatus`
  - customer/sales: `sqcustomer`, `sqbagianpenjualan`, `sqcustomerkontak`
  - nilai: `sqmatauang`, `sqkurs`, `sqdiskonpersen`, `sqjmldiskon`, `sqbiayalain`, `sqtotalpajak1detail`
  - narasi: `squraian`, `sqcatatan`, `sqnoref`
  - custom: `sqcustomtext1`, `sqcustomtext2`, `sqcustomtext3`, `sqcustomtext4`

### `m5_sq_detail`
- Fungsi: detail barang pada penawaran penjualan.
- Synonym: `quotation detail`, `detail SQ`.
- Kolom penting:
  - identitas relasi: `idsq`, `idsqdetail`, `idbarang`
  - barang: `namabarang`, `tipebarang`, `satuan`
  - kuantitas/nilai: `jml`, `harga`, `diskon`, `jmldiskon`, `kurs`
  - lokasi proses: `gudang`
  - realisasi: `jmlso`, `jmlpl`, `jmldo`, `jmldr`, `jmlpi`, `jmlsi`, `jmlrnr`, `jmlsr`, `jmlrealisasi`
  - urutan/catatan: `urutan`, `catatan`

### `m5_so`
- Fungsi: header order penjualan.
- Synonym: `sales order`, `SO`, `order penjualan`.
- Report contoh: `Daftar Order Penjualan`, `SO Outstanding`, `SO Terkait DO dan PI`.
- Kolom penting:
  - identitas: `soid`, `sonotransaksi`
  - tanggal: `sotgl`, `sotglkirim`, `soinputtgl`, `somodifikasitgl`
  - customer/sales: `socustomer`, `sobagianpenjualan`, `socustomerkontak`
  - nilai: `somatauang`, `sokurs`, `sodiskonpersen`, `sojmldiskon`, `sobiayalain`, `sototal`, `sototalpajak1detail`
  - logistik: `sogudang`, `solokasi`, `soekspedisi`
  - custom: `socustomtext1` sampai `socustomtext5`, `socustomdbl1` sampai `socustomdbl3`, `socustomdate1`

### `m5_so_detail`
- Fungsi: detail barang pada sales order.
- Kolom penting:
  - identitas relasi: `idso`, `idsodetail`, `idsqdetail`, `idbarang`
  - barang: `namabarang`, `tipebarang`, `satuan`
  - kuantitas/nilai: `jml`, `jmlbarang`, `harga`, `diskon`, `jmldiskon`, `matauang`, `kurs`
  - proses lanjut: `jmlrealisasi`, `jmlrnr`
  - lokasi: `lokasi`, `gudang`
  - custom: `customtext4`, `customtext5`, `customdbl3`, `customdbl4`, `customdbl5`, `customdate3`

### `m5_pl`
- Fungsi: header packing list.
- Synonym: `packing list`, `PL`.
- Kolom penting:
  - `plid`, `plnotransaksi`, `pltgl`
  - `plcustomer`, `plbagianpenjualan`
  - `plmatauang`, `plkurs`
  - `pluraian`, `plcatatan`
  - `plstatus`

### `m5_pl_detail`
- Fungsi: detail packing list.
- Kolom penting:
  - `idpl`, `idpldetail`, `idsodetail`, `idpidetail`
  - `idbarang`, `namabarang`, `tipebarang`, `satuan`
  - `jml`, `jmlrealisasi`, `jmldo`, `jmldr`, `jmlsi`, `jmlrnr`, `jmlsr`
  - `nopack`, `catatan`, `urutan`

### `m5_pl_pack`
- Fungsi: data pack/koli pada packing list.
- Kolom penting:
  - `idpl`, `nopack`
  - `berat`, `bentuk`, `catatan`

### `m5_do`
- Fungsi: header delivery order.
- Synonym: `delivery order`, `DO`, `pengiriman`.
- Kolom penting:
  - `doid`, `donotransaksi`, `dotgl`, `dotglkirim`
  - `docustomer`, `dobagianpenjualan`, `dogudang`
  - `domatauang`, `dokurs`
  - `donoref`, `douraian`, `docatatan`
  - `dostatus`

### `m5_do_detail`
- Fungsi: detail delivery order.
- Kolom penting:
  - `iddo`, `iddodetail`, `idsodetail`, `idpldetail`, `idpidetail`
  - `idbarang`, `namabarang`, `tipebarang`, `satuan`
  - `jml`, `jmlbarang`, `harga`, `diskon`, `jmldiskon`
  - `jmlrealisasi`, `jmldr`, `jmlsi`, `jmlrnr`, `jmlsr`
  - `gudangasal`, `matauang`, `kurs`
  - custom: `customtext2`, `customdbl1`, `customdbl2`, `customdbl3`

### `m5_dr`
- Fungsi: header hasil pengiriman.
- Synonym: `delivery report`, `DR`, `hasil pengiriman`.
- Kolom penting:
  - `drid`, `drnotransaksi`, `drtgl`, `drtglkirim`
  - `drcustomer`, `drbagianpenjualan`, `drbagianpengiriman`, `drgudang`
  - `drmatauang`, `drkurs`, `drtermin`
  - `druraian`, `drstatus`

### `m5_dr_detail`
- Fungsi: detail hasil pengiriman.
- Kolom penting:
  - `iddr`, `iddrdetail`, `iddodetail`, `idpidetail`
  - `idbarang`, `namabarang`, `tipebarang`, `satuan`
  - `jml`, `jmlkembali`, `jmlrealisasi`, `jmlrnr`, `jmlsi`, `jmlsr`
  - `harga`, `diskon`, `jmldiskon`, `catatan`, `urutan`

### `m5_pi`
- Fungsi: header proforma invoice.
- Synonym: `proforma invoice`, `PI`, `invoice sementara`.
- Kolom penting:
  - `piid`, `pinotransaksi`, `pitgl`
  - `picustomer`, `pibagianpenjualan`, `pigudang`
  - `pimatauang`, `pikurs`, `pitermin`
  - `pidiskonpersen`, `pijmldiskon`, `pibiayalain`, `pitotalpajak1detail`
  - `piuraian`, `pistatus`
  - `piinputuser`, `picustomdbl2`

### `m5_pi_detail`
- Fungsi: detail proforma invoice.
- Kolom penting:
  - `idpi`, `idpidetail`, `idsodetail`, `idpldetail`, `idsqdetail`
  - `idbarang`, `namabarang`, `tipebarang`, `satuan`
  - `jml`, `jmlrealisasi`, `jmlrnr`, `jmlsi`, `jmlsr`
  - `harga`, `diskon`, `jmldiskon`, `catatan`, `urutan`

### `m5_si`
- Fungsi: header invoice penjualan final.
- Synonym: `sales invoice`, `invoice penjualan`, `SI`.
- Report coverage: paling dominan di `rmoduleid = 5`.
- Kolom penting:
  - identitas: `siid`, `sinotransaksi`, `sisumber`
  - tanggal: `sitgl`, `sitgljatuhtempo`, `sitgllunas`
  - customer/sales: `sicustomer`, `sibagianpenjualan`, `sicustomerkontak`
  - lokasi/logistik: `sicabang`, `silokasi`, `sigudang`, `siekspedisi`
  - nilai: `simatauang`, `sikurs`, `sidiskonpersen`, `sijmldiskon`, `sibiayalain`, `sitotaltransaksi`, `sitotalpajak1detail`
  - status: `sistatus`
  - input: `siinputuser`
  - custom: `sicustomtext1` sampai `sicustomtext9`, `sicustomdbl1` sampai `sicustomdbl3`, `sicustomdate1`

### `m5_si_detail`
- Fungsi: detail invoice penjualan.
- Kolom penting:
  - identitas relasi: `idsi`, `idsidetail`, `idsodetail`, `idpidetail`, `iddrdetail`
  - barang: `idbarang`, `namabarang`, `tipebarang`, `satuan`
  - kuantitas/nilai: `jml`, `harga`, `diskon`, `jmldiskon`, `jmlpajak1`, `jmlpajak2`, `hpp`
  - organisasi: `costcenter`, `divisi`, `subdivisi`, `proyek`
  - custom: `customtext2`, `customtext4`, `customtext5`, `customdbl1`, `customdbl4`, `customdbl5`
  - proses lanjut: `jmlrnr`, `jmlsr`

### `m5_rnr`
- Fungsi: header penerimaan barang retur.
- Synonym: `receipt note return`, `RNR`, `penerimaan retur`.
- Kolom penting:
  - `rnrid`, `rnrnotransaksi`, `rnrtgl`
  - `rnrcustomer`, `rnrgudang`
  - `rnrmatauang`, `rnrkurs`, `rnrtermin`
  - `rnrjenispenjualan`, `rnruraian`

### `m5_rnr_detail`
- Fungsi: detail penerimaan barang retur.
- Kolom penting:
  - `idrnr`, `idrnrdetail`, `idsidetail`
  - `idbarang`, `namabarang`, `tipebarang`, `satuan`
  - `jml`, `jmlsr`
  - `harga`, `diskon`, `jmldiskon`
  - `catatan`, `urutan`

### `m5_sr`
- Fungsi: header retur penjualan.
- Synonym: `sales return`, `SR`, `retur penjualan`.
- Kolom penting:
  - `srid`, `srnotransaksi`, `srsumber`, `srtgl`
  - `srcustomer`, `srbagianpenjualan`, `srgudang`
  - `srmatauang`, `srkurs`, `srtermin`
  - `srdiskonpersen`, `srjmldiskon`, `srbiayalain`
  - `srtotalpajak1detail`, `srtotalpajak2detail`, `srtotaltransaksi`
  - `sruraian`, `srcatatan`, `srstatus`

### `m5_sr_detail`
- Fungsi: detail retur penjualan.
- Kolom penting:
  - `idsr`, `idsrdetail`, `idsidetail`, `idrnrdetail`
  - `idbarang`, `namabarang`, `tipebarang`, `satuan`
  - `jml`, `harga`, `diskon`, `jmldiskon`, `jmlpajak1`, `hpp`
  - `catatan`, `urutan`

## Area Piutang dan Pembayaran

### `m5_as` dan `m5_as_pay`
- Fungsi: uang muka penjualan dan detail pembayarannya.
- Report contoh: `Daftar UM Penjualan`, `AS Outstanding Pembayaran`.
- Kolom inti `m5_as`:
  - `asid`, `asnotransaksi`, `astgl`
  - `askontak`, `asidso`, `asidip`
  - `asmatauang`, `askurs`
  - `asjumlah`, `asjumlahvalas`, `asjumlahbayar`, `asjumlahbayarvalas`
  - `asstatusbayar`, `astgllunas`, `astgljatuhtempo`
  - `asnorek`, `asuraian`, `ascatatan`, `assumber`, `astermin`
- Kolom inti `m5_as_pay`:
  - `idas`, `carabayar`, `bank`, `noacbank`, `nogiro`
  - `kurs`, `jumlah`, `jumlahvalas`, `tgljt`
  - `rekbank`, `rekgiro`, `catatan`, `urutan`

### `m5_ip` dan `m5_ip_pay`
- Fungsi: terima pembayaran dan detail alat bayar.
- Kolom inti `m5_ip`:
  - `ipid`, `ipnotransaksi`, `iptgl`, `ipsumber`
  - `ipkontak`, `ipmatauang`, `ipkurs`
  - `ipjumlah`, `ipjumlahvalas`, `ipjumlahbayar`, `ipjumlahbayarvalas`
  - `ipstatusbayar`, `iptgllunas`, `iptgljatuhtempo`
  - `ipnorek`, `ipuraian`, `ipcatatan`
- Kolom inti `m5_ip_pay`:
  - `idip`, `matauang`, `jumlah`, `jumlahvalas`, `nogiro`, `bank`, `noacbank`, `rekbank`, `tgljt`

### `m5_ic` dan `m5_ic_detail`
- Fungsi: penagihan piutang dan item invoice yang ditagih.
- Kolom inti `m5_ic`:
  - `icid`, `icnotransaksi`, `ictgl`
  - `iccustomer`, `icbagianpenagihan`
  - `icmatauang`, `ickurs`, `icstatus`
  - `icuraian`, `iccatatan`
- Kolom inti `m5_ic_detail`:
  - `idic`, `idicdetail`, `idtransaksi`, `sumber`
  - `rencana`, `terbayar`, `totaltransaksi`
  - `jmlbayar`, `jmlbayarvalas`
  - `matauang`, `kurs`, `rekhutangpiutang`, `catatan`, `urutan`

### `m5_pv` dan `m5_pv_detail`
- Fungsi: pembayaran piutang.
- Kolom inti `m5_pv`:
  - `pvid`, `pvnotransaksi`, `pvtgl`, `pvtglbayar`
  - `pvcustomer`, `pvbagianpenjualan`, `pvcarabayar`
  - `pvmatauang`, `pvkurs`
  - `pvtotalap`, `pvtotalar`, `pvuraian`, `pvcatatan`, `pvstatus`
- Kolom inti `m5_pv_detail`:
  - `idpv`, `idpvdetail`, `idtransaksi`, `idicdetail`, `sumber`
  - `rencana`, `terbayar`, `totaltransaksi`
  - `jmlbayar`, `jmlbayarvalas`
  - `matauang`, `kurs`, `rekhutangpiutang`, `catatan`, `urutan`

### `m5_rp` dan `m5_rp_pay`
- Fungsi: piutang ongkos kirim dan detail alat bayarnya.
- Kolom inti `m5_rp`:
  - `rpid`, `rpnotransaksi`, `rptgl`, `rpsumber`
  - `rpkontak`, `rpidsi`
  - `rpmatauang`, `rpkurs`
  - `rpjumlah`, `rpjumlahvalas`, `rpjumlahbayar`, `rpjumlahbayarvalas`
  - `rpstatusbayar`, `rptgllunas`, `rptgljatuhtempo`
  - `rpnorek`, `rpuraian`, `rpcatatan`
- Kolom inti `m5_rp_pay`:
  - `idrp`, `matauang`, `jumlah`, `jumlahvalas`, `nogiro`, `bank`, `noacbank`, `rekbank`, `rekgiro`, `tgljt`, `urutan`

## Tabel Khusus

### `m5_spa` dan `m5_spa_detail`
- Fungsi: penyesuaian poin penjualan.
- Kolom inti `m5_spa`:
  - `spaid`, `spanotransaksi`, `spatgl`, `spauraian`, `spastatus`
- Kolom inti `m5_spa_detail`:
  - `idspa`, `kontak`
  - `poinlama`, `poinmasuk`, `poinkeluar`, `poinbaru`
  - `catatan`, `urutan`

### `m5_sie` dan `m5_sie_detail`
- Fungsi: tukar faktur penjualan.
- Kolom inti `m5_sie`:
  - `sieid`, `sienotransaksi`, `sietgl`, `sieuraian`, `siecatatan`, `siestatus`
- Kolom inti `m5_sie_detail`:
  - `idsie`, `sumber`, `idtransaksi`, `urutan`

## Tabel Tambahan yang Muncul di Report tetapi Perlu Diputuskan

Tabel ini muncul di report `rmoduleid = 5`, tetapi statusnya perlu diputuskan apakah masuk semantic schema M5 utama atau dipisah:

### `m5_sf` dan `m5_sf_detail`
- konteks: `sales contract`, `sales booking`, `backorder`
- jika domain M5 ingin lengkap, tabel ini layak ditambahkan

### `m5_si_cost`
- konteks: biaya salesman dan komisi
- bersifat analitik/detail biaya invoice

### `m5_si_detail_komisi_v`
- terlihat seperti view untuk komisi
- jangan masukkan sebagai tabel transaksi kecuali semantic layer memang ingin mendukung view analitik

## Relationship yang Jelas dari Report

Relasi yang paling sering muncul:
- `m5_sq.sqid = m5_sq_detail.idsq`
- `m5_sq_detail.idsqdetail = m5_so_detail.idsqdetail`
- `m5_so.soid = m5_so_detail.idso`
- `m5_so_detail.idsodetail = m5_pl_detail.idsodetail`
- `m5_so_detail.idsodetail = m5_do_detail.idsodetail`
- `m5_pl.plid = m5_pl_detail.idpl`
- `m5_do.doid = m5_do_detail.iddo`
- `m5_do_detail.iddodetail = m5_dr_detail.iddodetail`
- `m5_pi.piid = m5_pi_detail.idpi`
- `m5_si.siid = m5_si_detail.idsi`
- `m5_rnr.rnrid = m5_rnr_detail.idrnr`
- `m5_sr.srid = m5_sr_detail.idsr`
- `m5_as.asid = m5_as_pay.idas`
- `m5_ip.ipid = m5_ip_pay.idip`
- `m5_ic.icid = m5_ic_detail.idic`
- `m5_pv.pvid = m5_pv_detail.idpv`
- `m5_rp.rpid = m5_rp_pay.idrp`
- `m5_sie.sieid = m5_sie_detail.idsie`
- `m5_spa.spaid = m5_spa_detail.idspa`

## Join ke Master Data yang Paling Sering

Master yang paling konsisten muncul di report:
- `m1_contact` untuk customer, salesman, contact person
- `m1_item` untuk barang
- `m0_status` untuk nama status
- `m1_terms` untuk termin
- `m1_warehouse` untuk gudang
- `m1_cost_center`, `m1_division`, `m1_subdivision`, `m1_project` untuk dimensi organisasi
- `m0_user` untuk input/modifikasi user

Implikasi ke semantic schema:
- relationship ke `m1_contact` dan `m1_item` sebaiknya diprioritaskan
- kolom status sebaiknya diberi deskripsi sebagai status dokumen/proses
- kolom organisasi pada detail `SI/SR/DO` sebaiknya dijelaskan sebagai dimensi analitik

## Saran Update Semantic Schema

Prioritas tinggi:
- pastikan header/detail pasangan utama `SQ`, `SO`, `PL`, `DO`, `DR`, `PI`, `SI`, `RNR`, `SR` punya deskripsi yang jelas
- tambahkan kolom custom yang benar-benar muncul di report, terutama pada `m5_so`, `m5_si`, dan detailnya
- tambahkan sinonim bisnis Indonesia dan Inggris untuk tabel utama

Prioritas menengah:
- tambahkan tabel `m5_sf`, `m5_sf_detail`, dan `m5_si_cost` bila semantic layer juga akan melayani pertanyaan report kontrak, booking, komisi, dan biaya
- cek apakah view seperti `m5_si_detail_komisi_v` perlu dipetakan sebagai view semantic terpisah

Prioritas rendah:
- metadata report ini tidak cukup untuk memetakan tabel helper seperti lampiran, notes, atau history; tetap perlu referensi dari source VB transaksi

## Kesimpulan

Sebagai sumber untuk `semantic-schema-m5.json`, metadata `m0_report` dengan `rmoduleid = 5` paling kuat untuk:
- memahami fungsi bisnis tabel penjualan M5
- mengidentifikasi kolom baca/report yang paling penting
- memvalidasi relasi antardokumen
- memilih sinonim tabel yang lebih natural untuk pencarian semantic

Sumber ini paling lemah untuk:
- field teknis internal yang tidak pernah dipakai report
- tabel history dan helper non-report
- constraint write/update
