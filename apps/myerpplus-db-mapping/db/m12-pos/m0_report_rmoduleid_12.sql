-- m0_report full queries for rmoduleid = 12
-- total rows: 129

-- RID=1069 | MENU=3 | ITEM=1 | RQUERY=1 | NAME=Info Barang | FILE=infobarang
SELECT pc.pcnama AS namakategoribarang, blg.blggudang , b.burutan, b.bnama AS 'namabarang', b.bkode AS 'kodebarang', g.wnama AS 'gudang', b.btipe, blg.blgnamalokasi, (b.bhargajual1) AS 'hrgajual1', b.bstok as stok,b.bsatuan, CASE bjenis WHEN 'P' THEN 'persediaan' WHEN 'A' THEN 'Assembly' WHEN 'J' THEN 'Jasa' WHEN 'D' THEN 'Pretelan' WHEN 'K' THEN 'Konsinyasi' ELSE 'null' END AS jenis FROM m_12_pos_item pi JOIN m1_item b ON pi.piidbarang = b.bid LEFT JOIN m_12_pos_category pc ON pi.pikategori = pc.pckode LEFT JOIN m1_item_location_warehouse blg ON (b.bid = blg.blgidbarang) LEFT JOIN m1_warehouse g ON (blg.blggudang = g.wkode) ORDER BY pi.pikategori , pi.piidbarang;

-- RID=1087 | MENU=3 | ITEM=2 | RQUERY=1 | NAME=Harga Barang | FILE=infobarangharga
SELECT pi.pikategori , pc.pcnama AS namakategoribarang, b.bkode, b.bnama , pi.pihargajual1 , pi.pihargajual2, pi.pihargajual3, pi.pihargajual4, pi.pihargajual5, pi.pidiskonjual1, pi.pidiskonjual2, pi.pidiskonjual3, pi.pidiskonjual4 , pi.pidiskonjual5 FROM m_12_pos_item pi JOIN m1_item b ON pi.piidbarang = b.bid LEFT JOIN m_12_pos_category pc ON pi.pikategori = pc.pckode ORDER BY pi.pikategori , pi.piidbarang;

-- RID=1088 | MENU=3 | ITEM=3 | RQUERY=1 | NAME=Stok Barang  | FILE=infobarangstok
SELECT pc.pcnama AS namakategoribarang, b.burutan, b.bnama AS 'namabarang', b.bkode AS 'kodebarang', b.btipe, pi.pistokmaksimal , pi.pistokminimal , pi.pistokreorder , b.bsatuan FROM m_12_pos_item pi JOIN m1_item b ON pi.piidbarang = b.bid LEFT JOIN m_12_pos_category pc ON pi.pikategori = pc.pckode ORDER BY pi.pikategori , pi.piidbarang;

-- RID=1065 | MENU=4 | ITEM=1 | RQUERY=1 | NAME=Kategori POS | FILE=kategoripos
SELECT pc.pckode, pc.pcnama , pc.pccatatan FROM m_12_pos_category pc ORDER BY pc.pckode;

-- RID=1070 | MENU=5 | ITEM=1 | RQUERY=1 | NAME=Info Kontak | FILE=infocontact
SELECT k1.kkode, k1.knama AS namacontact, k1.k1notelp1 , k1.k1alamat1, k1.k1alamat2, k1.k1kota, k1.k1kontaknohp, cc.ccnama FROM m1_contact k1 JOIN m1_contact_category cc ON k1.kkategori = cc.cckode ORDER BY k1.kkode, k1.knama;

-- RID=1066 | MENU=6 | ITEM=1 | RQUERY=1 | NAME=Voucher POS | FILE=voucherpos
SELECT pc.pcnama , vi.vikode , vi.vimatauang, vi.vijml, vi.vijmlbayar , vi.vitglbuat , vi.vitglexpired , CASE vi.viisclose WHEN 0 THEN "Belum Close" WHEN 1 THEN "Sudah Close" END AS viisclose FROM m_12_pos_voucher_in vi JOIN m_12_pos_category pc ON vi.vikategori = pc.pckode ORDER BY pc.pckode , vi.vikode;

-- RID=1083 | MENU=6 | ITEM=2 | RQUERY=1 | NAME=Voucher POS | FILE=voucherposDetail
SELECT pc.pcnama , vi.vikode , vi.vimatauang, vi.vijml, vi.vijmlbayar , vi.vitglbuat , vi.vitglexpired , CASE vi.viisclose WHEN 0 THEN "Belum Close" WHEN 1 THEN "Sudah Close" END AS viisclose , si.sitgl, si.sinotransaksi , vo.vomatauang , vo.vojmlbayar FROM m_12_pos_voucher_in vi JOIN m_12_pos_category pc ON vi.vikategori = pc.pckode LEFT JOIN m_12_pos_voucher_out vo ON vi.viid = vo.voidvi LEFT JOIN m5_si si ON vo.voidtransaksi = si.siid ORDER BY pc.pckode , vi.vikode , vo.void, vo.voidtransaksi;

-- RID=50000570 | MENU=6 | ITEM=5 | RQUERY=1 | NAME=Voucher POS | FILE=laporanPOS
SELECT pi.vicustomtext1 , pi.vicustomtext2 , pi.vijml , pi.vikode , pi.vitglbuat , k.knama, k.kkode FROM m_12_pos_voucher_in pi JOIN m1_contact k ON pi.vicustomdbl1 = k.kid ORDER BY pi.vicustomtext1 DESC;

-- RID=1084 | MENU=8 | ITEM=1 | RQUERY=1 | NAME=Daftar Penjualan  | FILE=listsalesinvoicepos_carabayar_12
SELECT area.anama AS sicustomarea , si.siid , si.sitgl , si.sinotransaksi , kc.knama AS sicustomer , ks.knama AS sibagianpenjualan , st.nama AS sistatus , si.siuraian , si.simatauang , si.sikurs , si.sidiskonpersen , si.sijmldiskon, si.sibiayalain , si.sitotalpajak1detail, b.bkode , sid.namabarang , sid.catatan , sid.jml , sid.satuan , sid.diskon , CASE b.bkp WHEN 0 THEN 0 WHEN 1 THEN (((sid.jml * sid.harga) - sid.jmldiskon) / 11) END as pajak , CASE b.bkp WHEN 0 THEN ((sid.jml * sid.harga) - sid.jmldiskon) WHEN 1 THEN ((((sid.jml * sid.harga) - sid.jmldiskon) / 11) * 10) END as harga FROM m5_si si JOIN m1_contact kc ON si.sicustomer = kc.kid JOIN m1_contact ks ON si.sibagianpenjualan = ks.kid JOIN m0_status st on si.sistatus = st.kode JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_item b on sid.idbarang = b.bid JOIN m0_user u ON si.siinputuser = u.userid LEFT JOIN m_12_area area ON si.sicustomarea = area.akode WHERE ((si.sistatus = 2) OR (si.sistatus = 3) OR (si.sistatus = 4) OR (si.sistatus = 7) ) ORDER BY si.sitgl ,si.sinotransaksi , sid.urutan;

-- RID=1449 | MENU=8 | ITEM=2 | RQUERY=1 | NAME=Daftar Penjualan Kena Pajak | FILE=penjualankenapajak_pos
SELECT area.anama AS sicustomarea , si.siid , si.sitgl , si.sinotransaksi , kc.knama AS sicustomer , ks.knama AS sibagianpenjualan , st.nama AS sistatus , si.siuraian , si.simatauang , si.sikurs , si.sidiskonpersen , si.sijmldiskon, si.sibiayalain , si.sitotalpajak1detail, b.bkode , sid.namabarang , sid.catatan , sid.jml , sid.satuan , sid.diskon , CASE b.bkp WHEN 0 THEN 0 WHEN 1 THEN (((sid.jml * sid.harga) - sid.jmldiskon) / 11) END as pajak , CASE b.bkp WHEN 0 THEN ((sid.jml * sid.harga) - sid.jmldiskon) WHEN 1 THEN ((((sid.jml * sid.harga) - sid.jmldiskon) / 11) * 10) END as harga FROM m5_si si JOIN m1_contact kc ON si.sicustomer = kc.kid JOIN m1_contact ks ON si.sibagianpenjualan = ks.kid JOIN m0_status st on si.sistatus = st.kode JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_item b on sid.idbarang = b.bid LEFT JOIN m_12_area area ON si.sicustomarea = area.akode WHERE (b.bkp = 1) AND (si.sistatus = 2 OR si.sistatus = 3 OR si.sistatus = 4 OR si.sistatus = 7 ) ORDER BY si.sitgl ,si.sinotransaksi , sid.urutan;

-- RID=1450 | MENU=8 | ITEM=3 | RQUERY=1 | NAME=Daftar Penjualan Tidak Kena Pajak | FILE=penjualantidakkenapajak_pos
SELECT area.anama AS sicustomarea , si.siid , si.sitgl , si.sinotransaksi , kc.knama AS sicustomer , ks.knama AS sibagianpenjualan , st.nama AS sistatus , si.siuraian , si.simatauang , si.sikurs , si.sidiskonpersen , si.sijmldiskon, si.sibiayalain , si.sitotalpajak1detail, b.bkode , sid.namabarang , sid.catatan , sid.jml , sid.satuan , sid.diskon , CASE b.bkp WHEN 0 THEN 0 WHEN 1 THEN (((sid.jml * sid.harga) - sid.jmldiskon) / 11) END as pajak , CASE b.bkp WHEN 0 THEN ((sid.jml * sid.harga) - sid.jmldiskon) WHEN 1 THEN ((((sid.jml * sid.harga) - sid.jmldiskon) / 11) * 10) END as harga FROM m5_si si JOIN m1_contact kc ON si.sicustomer = kc.kid JOIN m1_contact ks ON si.sibagianpenjualan = ks.kid JOIN m0_status st on si.sistatus = st.kode JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_item b on sid.idbarang = b.bid LEFT JOIN m_12_area area ON si.sicustomarea = area.akode WHERE (b.bkp = 0) ORDER BY si.sitgl ,si.sinotransaksi , sid.urutan;

-- RID=1459 | MENU=8 | ITEM=4 | RQUERY=1 | NAME=Daftar Invoice Penjualan (SI) Rekap | FILE=listsalesinvoice1_pos4
SELECT b.bkp , si.siid , si.sitgl , si.sinotransaksi , kc.knama AS sicustomer , ks.knama AS sibagianpenjualan , st.nama AS sistatus , si.siuraian , si.simatauang , si.sikurs , si.sidiskonpersen , si.sijmldiskon, si.sibiayalain , si.sitotalpajak1detail, b.bkode , sid.namabarang , sid.catatan , sid.jml , sid.satuan , sid.diskon , CASE b.bkp WHEN 0 THEN 0 WHEN 1 THEN (((sid.jml * sid.harga) - sid.jmldiskon) / 11) END as pajak , CASE b.bkp WHEN 0 THEN ((sid.jml * sid.harga) - sid.jmldiskon) WHEN 1 THEN ((((sid.jml * sid.harga) - sid.jmldiskon) / 11) * 10) END as harga FROM m5_si si JOIN m1_contact kc ON si.sicustomer = kc.kid JOIN m1_contact ks ON si.sibagianpenjualan = ks.kid JOIN m0_status st on si.sistatus = st.kode JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_item b on sid.idbarang = b.bid ORDER BY si.siid , si.sitgl ,si.sinotransaksi;

-- RID=1460 | MENU=8 | ITEM=5 | RQUERY=1 | NAME=Daftar Invoice Penjualan (SI) Rekap Kena Pajak | FILE=listsalesinvoice1_pos4_kenapajak
SELECT b.bkp , si.siid , si.sitgl , si.sinotransaksi , kc.knama AS sicustomer , ks.knama AS sibagianpenjualan , st.nama AS sistatus , si.siuraian , si.simatauang , si.sikurs , si.sidiskonpersen , si.sijmldiskon, si.sibiayalain , si.sitotalpajak1detail, b.bkode , sid.namabarang , sid.catatan , sid.jml , sid.satuan , sid.harga , sid.diskon , ((sid.jml * sid.harga) - sid.jmldiskon) AS total FROM m5_si si JOIN m1_contact kc ON si.sicustomer = kc.kid JOIN m1_contact ks ON si.sibagianpenjualan = ks.kid JOIN m0_status st on si.sistatus = st.kode JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_item b on sid.idbarang = b.bid WHERE (b.bkp = 1) ORDER BY si.sitgl ,si.sinotransaksi;

-- RID=1461 | MENU=8 | ITEM=6 | RQUERY=1 | NAME=Daftar Invoice Penjualan (SI) Rekap Tidak Kena Pajak  | FILE=listsalesinvoice1_pos4_tidakkenapajak
SELECT b.bkp , si.siid , si.sitgl , si.sinotransaksi , kc.knama AS sicustomer , ks.knama AS sibagianpenjualan , st.nama AS sistatus , si.siuraian , si.simatauang , si.sikurs , si.sidiskonpersen , si.sijmldiskon, si.sibiayalain , si.sitotalpajak1detail, b.bkode , sid.namabarang , sid.catatan , sid.jml , sid.satuan , sid.harga , sid.diskon , ((sid.jml * sid.harga) - sid.jmldiskon) AS total FROM m5_si si JOIN m1_contact kc ON si.sicustomer = kc.kid JOIN m1_contact ks ON si.sibagianpenjualan = ks.kid JOIN m0_status st on si.sistatus = st.kode JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_item b on sid.idbarang = b.bid WHERE (b.bkp = 0) ORDER BY si.sitgl ,si.sinotransaksi;

-- RID=1453 | MENU=8 | ITEM=7 | RQUERY=1 | NAME=Laporan Total Struk 1 | FILE=rekapSI2
SELECT sitgl , siid , sinotransaksi , total , /* IF(total BETWEEN 0 and 30000,"0-30rb", IF(total BETWEEN 30001 and 50000,"31rb-50rb", IF(total BETWEEN 50001 and 100000,"51rb-100rb", IF(total BETWEEN 100001 AND 150000,"110rb-150rb", IF(total > 150000,">150000",""))))) AS grup */ IF(total BETWEEN 0 and 30000,"0 s/d 30.000", IF(total BETWEEN 30001 and 50000,"30.001 s/d 50.000", IF(total BETWEEN 50001 and 100000,"50.001 s/d 100.000", IF(total BETWEEN 100001 AND 150000,"100.001 s/d 150.000", IF(total > 150000,"> 150.000",""))))) AS grup FROM (SELECT si.sitgl , si.siid , si.sinotransaksi AS sinotransaksi , ((Sum((sid.jml * sid.harga) - sid.jmldiskon)) - si.sijmldiskon + si.sibiayalain + si.sitotalpajak1detail) AS total FROM m5_si si JOIN m5_si_detail sid ON si.siid = sid.idsi GROUP BY si.siid ORDER BY si.siid ) AS a ORDER BY total ASC;

-- RID=1454 | MENU=8 | ITEM=8 | RQUERY=1 | NAME=Laporan Total Struk 2 | FILE=listsalesinvoice1_pos4
SELECT si.siid , si.sitgl , si.sinotransaksi , kc.knama AS sicustomer , ks.knama AS sibagianpenjualan , st.nama AS sistatus , si.siuraian , si.simatauang , si.sikurs , si.sidiskonpersen , si.sijmldiskon, si.sibiayalain , si.sitotalpajak1detail , SUM((sid.jml * sid.harga) - sid.jmldiskon) AS total FROM m5_si si JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_contact kc ON si.sicustomer = kc.kid JOIN m1_contact ks ON si.sibagianpenjualan = ks.kid JOIN m0_status st on si.sistatus = st.kode GROUP BY si.siid ORDER BY si.sitgl , si.siid, si.sinotransaksi;

-- RID=1085 | MENU=8 | ITEM=9 | RQUERY=1 | NAME=Penjualan | FILE=salesinvoicedetail1POS
SELECT si.siid , si.sitgl , si.sinotransaksi , kc.knama AS sicustomer , ks.knama AS sibagianpenjualan , si.si1alamat1 , st.nama AS sistatus , si.siuraian , si.simatauang , si.sikurs , si.sidiskonpersen , si.sijmldiskon, si.sibiayalain , si.sitotalpajak1detail, si.sijmluangmuka , si.sitermin , si.sicustomdbl2, b.bkode , sid.namabarang , sid.catatan , sid.jml , sid.satuan , sid.harga , sid.diskon , ((sid.jml * sid.harga) - sid.jmldiskon) AS total, `do`.donotransaksi , si.sicatatan FROM m5_si si JOIN m1_contact kc ON si.sicustomer = kc.kid JOIN m1_contact ks ON si.sibagianpenjualan = ks.kid JOIN m0_status st on si.sistatus = st.kode JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_item b on sid.idbarang = b.bid LEFT JOIN m5_do_detail dod ON sid.iddodetail = dod.iddodetail LEFT JOIN m5_do `do` ON dod.iddo = `do`.doid ORDER BY si.sitgl , si.siid, si.sinotransaksi , sid.urutan;

-- RID=1086 | MENU=8 | ITEM=10 | RQUERY=1 | NAME=Penjualan | FILE=salesinvoicedetail1POS2
SELECT si.siid , si.sitgl , si.sinotransaksi , kc.knama AS sicustomer , ks.knama AS sibagianpenjualan , si.si1alamat1 , st.nama AS sistatus , si.siuraian , si.simatauang , si.sikurs , si.sidiskonpersen , si.sijmldiskon, si.sibiayalain , si.sitotalpajak1detail, si.sijmluangmuka , si.sitermin , si.sicustomdbl2, b.bkode , sid.namabarang , sid.catatan , sid.jml , sid.satuan , sid.harga , sid.diskon , ((sid.jml * sid.harga) - sid.jmldiskon) AS total, `do`.donotransaksi , si.sicatatan FROM m5_si si JOIN m1_contact kc ON si.sicustomer = kc.kid JOIN m1_contact ks ON si.sibagianpenjualan = ks.kid JOIN m0_status st on si.sistatus = st.kode JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_item b on sid.idbarang = b.bid LEFT JOIN m5_do_detail dod ON sid.iddodetail = dod.iddodetail LEFT JOIN m5_do `do` ON dod.iddo = `do`.doid ORDER BY si.sitgl , si.siid, si.sinotransaksi , sid.urutan;

-- RID=1378 | MENU=8 | ITEM=11 | RQUERY=1 | NAME=REKAP PENJUALAN  | FILE=POS_penjualanGlobal
SELECT si.sitotaltransaksi , si.sitgl , si.sicarabayar , pm.nama , si.sinotransaksi , SUM((sid.jml * sid.harga) - sid.jmldiskon) AS total , si.sijmldiskon , CASE si.sihargatermasukpajak WHEN 0 THEN si.sitotalpajak1detail WHEN 1 THEN 0 END AS sitotalpajak1detail , CASE si.sihargatermasukpajak WHEN 0 THEN si.sitotalpajak2detail WHEN 1 THEN 0 END AS sitotalpajak2detail , si.sibiayalain , si.sicharge FROM m5_si si JOIN m0_payment_method pm on si.sicarabayar = pm.kode JOIN m5_si_detail sid on si.siid = sid.idsi GROUP BY si.sitgl , si.sinotransaksi , si.sicarabayar ORDER BY si.sitgl , si.sinotransaksi , si.sicarabayar;

-- RID=1379 | MENU=8 | ITEM=12 | RQUERY=1 | NAME=REKAP PENJUALAN | FILE=POS_penjualanGlobal_DETAIL
SELECT si.sitotaltransaksi , si.sitgl , si.sinotransaksi , si.sicarabayar , pm.nama , SUM((sid.jml * sid.harga) - sid.jmldiskon) AS total , si.sijmldiskon , CASE si.sihargatermasukpajak WHEN 0 THEN si.sitotalpajak1detail WHEN 1 THEN 0 END AS sitotalpajak1detail , CASE si.sihargatermasukpajak WHEN 0 THEN si.sitotalpajak2detail WHEN 1 THEN 0 END AS sitotalpajak2detail , si.sibiayalain , si.sicharge FROM m5_si si JOIN m0_payment_method pm on si.sicarabayar = pm.kode JOIN m5_si_detail sid on si.siid = sid.idsi GROUP BY si.sitgl , si.sinotransaksi , si.sicarabayar ORDER BY si.sitgl , si.sinotransaksi , si.sicarabayar;

-- RID=1046 | MENU=8 | ITEM=13 | RQUERY=1 | NAME=Struk 1 | FILE=Struk1
- FROM -;

-- RID=1047 | MENU=8 | ITEM=14 | RQUERY=1 | NAME=Struk 2 | FILE=Struk2
- FROM -;

-- RID=1048 | MENU=8 | ITEM=15 | RQUERY=1 | NAME=Struk 3 | FILE=Struk3
- FROM -;

-- RID=1049 | MENU=8 | ITEM=16 | RQUERY=1 | NAME=Struk 4 | FILE=Struk4
- FROM -;

-- RID=1050 | MENU=8 | ITEM=17 | RQUERY=1 | NAME=Struk 5 | FILE=Struk5
- FROM -;

-- RID=1561 | MENU=8 | ITEM=18 | RQUERY=1 | NAME=Daftar Penjualan Belum Upload | FILE=DataPenjualanBelumUpload
SELECT si.siid , si.sitgl , si.sinotransaksi , kc.knama AS sicustomer , ks.knama AS sibagianpenjualan , st.nama AS sistatus , si.siuraian , si.simatauang , si.sikurs , si.sidiskonpersen , si.sijmldiskon, si.sibiayalain , si.sitotalpajak1detail, b.bkode , sid.namabarang , sid.catatan , sid.jml , sid.satuan , sid.harga , sid.diskon , ((sid.jml * sid.harga) - sid.jmldiskon) AS total FROM m5_si si JOIN m1_contact kc ON si.sicustomer = kc.kid JOIN m1_contact ks ON si.sibagianpenjualan = ks.kid JOIN m0_status st on si.sistatus = st.kode JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_item b on sid.idbarang = b.bid WHERE si.siuploaded = 0 ORDER BY si.sitgl ,si.sinotransaksi;

-- RID=1562 | MENU=8 | ITEM=19 | RQUERY=1 | NAME=Laporan Upload (Barang Stok Tidak Mencukupi) | FILE=LaporanUpload_BarangStokTidakMencukupi
SELECT sgu.gudang, w.wnama , b.bkode , b.bnama , MIN(sgu.stoktersedia) as stoktersedia, SUM(sgu.stokjual) AS stokjual, (MIN(sgu.stoktersedia) - Sum(sgu.stokjual)) as selisih , b.bsatuan FROM m2r_stok_gagal_upload sgu JOIN m1_warehouse w ON sgu.gudang = w.wkode JOIN m1_item b ON sgu.idbarang = b.bid GROUP BY sgu.gudang, b.bkode ORDER BY sgu.gudang, b.bkode;

-- RID=1588 | MENU=8 | ITEM=20 | RQUERY=1 | NAME=Laporan Penjualan Per Hari | FILE=penjualanperhari
SELECT b.bnama AS sicabang , l.lnama AS silokasi , si.siid , sid.idsi , si.sinotransaksi , si.sitgl, (((Sum((sid.jml * sid.harga) - sid.jmldiskon) - si.sijmldiskon) + si.sitotalpajak1detail) + si.sibiayalain) as totaltransaksi FROM m5_si si JOIN m5_si_detail sid ON si.siid = sid.idsi LEFT JOIN m1_branch b ON si.sicabang = b.bkode LEFT JOIN m1_location l ON si.silokasi = l.lkode AND si.sicabang = l.lcabang WHERE ((si.sistatus = 2) OR (si.sistatus = 3) OR (si.sistatus = 4) OR (si.sistatus = 7) ) GROUP BY si.sicabang, si.silokasi, si.sitgl , si.siid ORDER BY si.sicabang, si.silokasi, si.sitgl , si.siid;

-- RID=1589 | MENU=8 | ITEM=21 | RQUERY=1 | NAME=Laporan Penjualan Per Lokasi | FILE=penjualanperlokasi
SELECT b.bnama AS sicabang , si.siid , sid.idsi , si.sinotransaksi , si.sitgl, si.silokasi , l.lnama , ((((Sum(sid.jml * sid.harga) - sid.jmldiskon) - si.sijmldiskon) + si.sitotalpajak1detail) + si.sibiayalain) as totaltransaksi , l.lluas FROM m5_si si JOIN m5_si_detail sid ON si.siid = sid.idsi LEFT JOIN m1_branch b ON si.sicabang = b.bkode LEFT JOIN m1_location l ON si.silokasi = l.lkode AND si.sicabang = l.lcabang WHERE ((si.sistatus = 2) OR (si.sistatus = 3) OR (si.sistatus = 4) OR (si.sistatus = 7) ) GROUP BY si.sicabang , si.silokasi , si.siid ORDER BY si.sicabang , si.silokasi , si.siid;

-- RID=1590 | MENU=8 | ITEM=22 | RQUERY=2 | NAME=Laporan Laba Rugi Per Hari | FILE=labarugiperhari
SELECT lr.lrcustomtext1 , lr.lrcustomtext2 , b.bnama AS sicabang, l.lnama AS silokasi , lr.lrtgl AS sitgl , SUM(lr.lrnilaipenjualan) AS totaltransaksi , SUM(lr.lrhargapokok) AS hargapokok FROM m2r_lr_invoice_global lr JOIN m1_branch b ON lr.lrcustomtext1 = b.bkode JOIN m1_location l ON lr.lrcustomtext2 = l.lkode AND lr.lrcustomtext1 = l.lcabang GROUP BY lr.lrcustomtext1 ASC , lr.lrcustomtext2 ASC , lrtgl ASC ORDER BY lr.lrcustomtext1 ASC , lr.lrcustomtext2 ASC , lrtgl ASC;

-- RID=1591 | MENU=8 | ITEM=23 | RQUERY=2 | NAME=Laporan Laba Rugi Per Lokasi | FILE=labarugiperlokasi
SELECT lr.lrcustomtext1 , lr.lrcustomtext2 , b.bnama AS sicabang, l.lnama AS silokasi , lr.lrtgl AS sitgl , SUM(l.lluas) AS lluas, SUM(lr.lrnilaipenjualan) AS totaltransaksi , SUM(lr.lrhargapokok) AS hargapokok FROM m2r_lr_invoice_global lr JOIN m1_branch b ON lr.lrcustomtext1 = b.bkode JOIN m1_location l ON lr.lrcustomtext2 = l.lkode AND lr.lrcustomtext1 = l.lcabang GROUP BY lr.lrcustomtext1 ASC , lr.lrcustomtext2 ASC ORDER BY lr.lrcustomtext1 ASC , lr.lrcustomtext2 ASC;

-- RID=1650 | MENU=8 | ITEM=24 | RQUERY=1 | NAME=Laporan Upload (Barang Stok Tidak Mencukupi) Detail | FILE=LaporanUpload_BarangStokTidakMencukupi_Detail
SELECT sif.siid , sidf.idbarang , sgu.gudang, w.wnama , b.bkode , b.bnama , MIN(sgu.stoktersedia) as stoktersedia, SUM(sgu.stokjual) AS stokjual, (MIN(sgu.stoktersedia) - Sum(sgu.stokjual)) as selisih , b.bsatuan , sif.sinoref , sif.sinotransaksi , sif.sitgl , k.knama AS sicustomer FROM m2r_stok_gagal_upload sgu JOIN m1_warehouse w ON sgu.gudang = w.wkode JOIN m1_item b ON sgu.idbarang = b.bid JOIN m5_si_detail_failed sidf ON sgu.idbarang = sidf.idbarang JOIN m5_si_failed sif ON sidf.idsi = sif.siid JOIN m1_contact k ON sif.sicustomer = k.kid GROUP BY sgu.gudang, sgu.idbarang, b.bkode, sif.sitgl , sif.siid ORDER BY sgu.gudang, sgu.idbarang, b.bkode, sif.sitgl , sif.siid;

-- RID=2060 | MENU=8 | ITEM=25 | RQUERY=1 | NAME=Laporan Penjualan Per Hari | FILE=penjualanperhari_carabayar
SELECT b.bnama AS sicabang , l.lnama AS silokasi , si.siid , sid.idsi , si.sinotransaksi , si.sitgl, (((Sum((sid.jml * sid.harga) - sid.jmldiskon) - si.sijmldiskon) + si.sitotalpajak1detail) + si.sibiayalain) as totaltransaksi FROM m5_si si JOIN m5_si_detail sid ON si.siid = sid.idsi LEFT JOIN m1_branch b ON si.sicabang = b.bkode LEFT JOIN m1_location l ON si.silokasi = l.lkode AND si.sicabang = l.lcabang WHERE ((si.sistatus = 2) OR (si.sistatus = 3) OR (si.sistatus = 4) OR (si.sistatus = 7) ) GROUP BY si.sicabang, si.silokasi, si.sitgl , si.siid ORDER BY si.sicabang, si.silokasi, si.sitgl , si.siid;

-- RID=3004 | MENU=8 | ITEM=26 | RQUERY=1 | NAME=Daftar Penjualan | FILE=listsalesinvoicepos_carabayar
SELECT area.anama AS sicustomarea , si.siid , si.sitgl , si.sinotransaksi , kc.knama AS sicustomer , ks.knama AS sibagianpenjualan , st.nama AS sistatus , si.siuraian , si.simatauang , si.sikurs , si.sidiskonpersen , si.sijmldiskon, si.sibiayalain , si.sitotalpajak1detail, b.bkode , sid.namabarang , sid.catatan , sid.jml , sid.satuan , sid.diskon , CASE b.bkp WHEN 0 THEN 0 WHEN 1 THEN (((sid.jml * sid.harga) - sid.jmldiskon) / 11) END as pajak , CASE b.bkp WHEN 0 THEN ((sid.jml * sid.harga) - sid.jmldiskon) WHEN 1 THEN ((((sid.jml * sid.harga) - sid.jmldiskon) / 11) * 10) END as harga FROM m5_si si JOIN m1_contact kc ON si.sicustomer = kc.kid JOIN m1_contact ks ON si.sibagianpenjualan = ks.kid JOIN m0_status st on si.sistatus = st.kode JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_item b on sid.idbarang = b.bid JOIN m0_user u ON si.siinputuser = u.userid LEFT JOIN m_12_area area ON si.sicustomarea = area.akode WHERE ((si.sistatus = 2) OR (si.sistatus = 3) OR (si.sistatus = 4) OR (si.sistatus = 7) ) ORDER BY si.sitgl ,si.sinotransaksi , sid.urutan;

-- RID=2222 | MENU=8 | ITEM=27 | RQUERY=1 | NAME=Laporan Penjualan Per Hari | FILE=penjualanperhari_carabayar2
SELECT b.bnama AS sicabang , l.lnama AS silokasi , si.siid , sid.idsi , si.sinotransaksi , si.sitgl, (((Sum((sid.jml * sid.harga) - sid.jmldiskon) - si.sijmldiskon) + si.sitotalpajak1detail) + si.sibiayalain) as totaltransaksi FROM m5_si si JOIN m5_si_detail sid ON si.siid = sid.idsi LEFT JOIN m1_branch b ON si.sicabang = b.bkode LEFT JOIN m1_location l ON si.silokasi = l.lkode AND si.sicabang = l.lcabang WHERE ((si.sistatus = 2) OR (si.sistatus = 3) OR (si.sistatus = 4) OR (si.sistatus = 7) ) GROUP BY si.sicabang, si.silokasi, si.sitgl , si.siid ORDER BY si.sicabang, si.silokasi, si.sitgl , si.siid;

-- RID=3333 | MENU=8 | ITEM=28 | RQUERY=1 | NAME=Laporan Penjualan Per Cara Bayar | FILE=testtt
SELECT IFNULL(sp.urutan,1) AS urutan , si.sicabang AS cabang, si.silokasi AS lokasi, b.bnama AS sicabang , l.lnama AS silokasi , si.siid , si.sinotransaksi , si.sitotaltransaksi AS totaltransaksi , si.sitgl , sp.carabayar as kode , pm.nama AS carabayar , sp.matauang , sp.jumlah , sp.jumlahvalas , si.sistatus as status FROM m5_si si JOIN m1_branch b ON si.sicabang = b.bkode JOIN m1_location l ON si.silokasi = l.lkode AND si.sicabang = l.lcabang LEFT JOIN m5_si_pay sp ON si.siid = sp.idsi LEFT JOIN m0_payment_method pm ON sp.carabayar = pm.kode WHERE ((si.sistatus = 2) OR (si.sistatus = 3) OR (si.sistatus = 4) OR (si.sistatus = 7) ) AND (si.sicarabayar = 0 ) GROUP BY si.sicabang, si.silokasi, si.sitgl , si.siid , sp.carabayar ORDER BY si.sicabang, si.silokasi, si.sitgl , si.siid , sp.carabayar;

-- RID=4444 | MENU=8 | ITEM=29 | RQUERY=1 | NAME=Laporan Penjualan Per Cara Bayar | FILE=ok
SELECT IFNULL(sp.urutan,1) AS urutan , si.sicabang AS cabang , si.silokasi AS lokasi, b.bnama AS sicabang , l.lnama AS silokasi , si.sijmlbayar, si.sijmlkembali , si.siid , si.sitgl , si.sitotaltransaksi AS totaltransaksi , sp.carabayar as kode , pm.nama AS carabayar , sp.matauang , sp.jumlah , sp.jumlahvalas , k.kid , k.knama , k.kcustomdbl1, CASE sp.carabayar WHEN 8 THEN CASE k.kcustomtext1 WHEN '07' THEN 7 ELSE 1 END ELSE 0 END AS caption FROM m5_si si JOIN m1_branch b ON si.sicabang = b.bkode JOIN m1_location l ON si.silokasi = l.lkode AND si.sicabang = l.lcabang JOIN m1_contact k ON si.sicustomer = k.kid LEFT JOIN m5_si_pay sp ON si.siid = sp.idsi LEFT JOIN m0_payment_method pm ON sp.carabayar = pm.kode WHERE ((si.sistatus = 2) OR (si.sistatus = 3) OR (si.sistatus = 4) OR (si.sistatus = 7) ) AND (si.sicarabayar = 0 ) GROUP BY si.sicabang, si.silokasi, si.sitgl , si.siid , sp.carabayar ORDER BY si.sicabang, si.silokasi, si.sitgl , si.siid , sp.carabayar;

-- RID=45455 | MENU=8 | ITEM=30 | RQUERY=1 | NAME=Laporan Penjualan Per User | FILE=listsalesinvoicepos_carabayar_detail
SELECT IFNULL(sp.urutan,1) AS urutan , si.sicabang AS cabang, si.silokasi AS lokasi, b.bnama AS sicabang , l.lnama AS silokasi , si.siid , si.sinotransaksi , si.sitotaltransaksi AS totaltransaksi , si.sitgl , sp.carabayar as kode , pm.nama AS carabayar , sp.matauang , sp.jumlah , sp.jumlahvalas , si.sistatus as status , si.siinputuser , userr.unama FROM m5_si si LEFT JOIN m1_branch b ON si.sicabang = b.bkode LEFT JOIN m1_location l ON si.silokasi = l.lkode AND si.sicabang = l.lcabang LEFT JOIN m5_si_pay sp ON si.siid = sp.idsi LEFT JOIN m0_payment_method pm ON sp.carabayar = pm.kode LEFT JOIN m0_user userr ON si.siinputuser = userr.userid WHERE ((si.sistatus = 2) OR (si.sistatus = 3) OR (si.sistatus = 4) OR (si.sistatus = 7) ) GROUP BY si.siinputuser , si.sitgl , si.siid , sp.carabayar ORDER BY si.siinputuser , si.sitgl , si.siid , sp.carabayar;

-- RID=454561 | MENU=8 | ITEM=32 | RQUERY=1 | NAME=LAPORAN PENJUALAN BULANAN 1 | FILE=LAPORAN_PENJUALAN_BULANAN
SELECT l.lnama AS silokasi , si.sitgl , si.sitotaltransaksi , si.sicarabayar FROM m5_si si LEFT JOIN m1_location l ON si.silokasi = l.lkode AND si.sicabang = l.lcabang ORDER BY l.lnama ASC , si.sitgl ASC , si.sicarabayar ASC;

-- RID=454571 | MENU=8 | ITEM=33 | RQUERY=1 | NAME=LAPORAN OMZET DAN PPN KELUARAN | FILE=LAPORAN_OMZET_DAN_PPN_KELUARAN
SELECT l.lnama AS silokasi , b.bkp , si.sitgl, sid.jml , sid.harga , sid.jmldiskon , CASE b.bkp WHEN 0 THEN 0 WHEN 1 THEN (((sid.jml * sid.harga) - sid.jmldiskon) / 11) END as pajaak , CASE b.bkp WHEN 0 THEN ((sid.jml * sid.harga) - sid.jmldiskon) WHEN 1 THEN ((((sid.jml * sid.harga) - sid.jmldiskon) / 11) * 10) END as hargaa , ((CASE b.bkp WHEN 0 THEN 0 WHEN 1 THEN (((sid.jml * sid.harga) - sid.jmldiskon) / 11) END) + (CASE b.bkp WHEN 0 THEN ((sid.jml * sid.harga) - sid.jmldiskon) WHEN 1 THEN ((((sid.jml * sid.harga) - sid.jmldiskon) / 11) * 10) END)) AS hasil FROM m5_si si JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_item b on sid.idbarang = b.bid LEFT JOIN m1_location l ON si.silokasi = l.lkode AND si.sicabang = l.lcabang ORDER BY l.lnama ASC , si.sitgl ASC , b.bkp ASC;

-- RID=454581 | MENU=8 | ITEM=34 | RQUERY=1 | NAME=PENJUALAN UNIT PERTOKOAN | FILE=PENJUALAN_UNIT_PERTOKOAN
SELECT cc.cckode , cc.ccnama , si.sitgl , SUM(si.sitotaltransaksi) AS sitotaltransaksi , si.sicarabayar , l.lnama AS silokasi FROM m5_si si JOIN m1_contact k ON si.sicustomer = k.kid JOIN m1_customer_category cc ON k.kkategoricustomer = cc.cckode LEFT JOIN m1_location l ON si.silokasi = l.lkode AND si.sicabang = l.lcabang GROUP BY l.lnama ASC , k.kkategoricustomer ASC , si.sicarabayar ASC ORDER BY l.lnama ASC , k.kkategoricustomer ASC , si.sicarabayar ASC;

-- RID=454591 | MENU=8 | ITEM=35 | RQUERY=1 | NAME=LAPORAN PENJUALAN KREDIT | FILE=LAPORAN_PENJUALAN_KREDIT
SELECT cc.cckode , cc.ccnama , k.kkode , k.knama , si.sitgl , si.sinotransaksi , SUM(si.sitotaltransaksi) AS sitotaltransaksi , si.sicarabayar , l.lnama AS silokasi FROM m5_si si JOIN m1_contact k ON si.sicustomer = k.kid JOIN m1_customer_category cc ON k.kkategoricustomer = cc.cckode LEFT JOIN m1_location l ON si.silokasi = l.lkode AND si.sicabang = l.lcabang GROUP BY l.lnama ASC , k.kkategoricustomer ASC , si.sicarabayar ASC ORDER BY l.lnama ASC , k.kkategoricustomer ASC , si.sicarabayar ASC;

-- RID=454551 | MENU=8 | ITEM=36 | RQUERY=1 | NAME=Laporan Penjualan Bulanan Per Tanggal | FILE=ok_ok
SELECT si.sicarabayar , CASE si.sicarabayar WHEN 1 THEN 0 WHEN 0 THEN IFNULL(sp.urutan,1) END as urutan , IFNULL(sp.urutan,1) AS urutaan , si.sicabang AS cabang , si.silokasi AS lokasi, b.bnama AS sicabang , l.lnama AS silokasi , si.sijmlbayar, si.sijmlkembali , si.siid , si.sitgl , si.sitotaltransaksi AS totaltransaksi , sp.carabayar as kode , pm.nama AS carabayar , sp.matauang , sp.jumlah , sp.jumlahvalas , cc.cckode , cc.ccnama , k.kid , k.knama , k.kcustomdbl1, CASE sp.carabayar WHEN 8 THEN CASE k.kcustomtext1 WHEN '07' THEN 7 ELSE 1 END ELSE 0 END AS caption FROM m5_si si JOIN m1_contact k ON si.sicustomer = k.kid JOIN m1_customer_category cc ON k.kkategoricustomer = cc.cckode JOIN m1_branch b ON si.sicabang = b.bkode JOIN m1_location l ON si.silokasi = l.lkode AND si.sicabang = l.lcabang LEFT JOIN m5_si_pay sp ON si.siid = sp.idsi LEFT JOIN m0_payment_method pm ON sp.carabayar = pm.kode WHERE ((si.sistatus = 2) OR (si.sistatus = 3) OR (si.sistatus = 4) OR (si.sistatus = 7) ) GROUP BY si.sicabang ASC , si.silokasi ASC, cc.cckode ASC, si.sitgl ASC , si.siid ASC ,si.sicarabayar ASC , sp.carabayar ASC ORDER BY si.sicabang ASC , si.silokasi ASC, cc.cckode ASC, si.sitgl ASC , si.siid ASC ,si.sicarabayar ASC , sp.carabayar ASC;

-- RID=4548545 | MENU=8 | ITEM=37 | RQUERY=1 | NAME=Laporan Penjualan Bulanan Per Customer | FILE=ok_percustomer
SELECT si.sicarabayar , CASE si.sicarabayar WHEN 1 THEN 0 WHEN 0 THEN IFNULL(sp.urutan,1) END as urutan , IFNULL(sp.urutan,1) AS urutaan , si.sicabang AS cabang , si.silokasi AS lokasi, b.bnama AS sicabang , l.lnama AS silokasi , si.sijmlbayar, si.sijmlkembali , si.siid , si.sitgl , si.sitotaltransaksi AS totaltransaksi , sp.carabayar as kode , pm.nama AS carabayar , sp.matauang , sp.jumlah , sp.jumlahvalas , cc.cckode , cc.ccnama , k.kcustomtext1, k.kcustomtext2 , k.kid , k.knama , k.kcustomdbl1, CASE sp.carabayar WHEN 8 THEN CASE k.kcustomtext1 WHEN '07' THEN 7 ELSE 1 END ELSE 0 END AS caption FROM m5_si si JOIN m1_contact k ON si.sicustomer = k.kid JOIN m1_customer_category cc ON k.kkategoricustomer = cc.cckode JOIN m1_branch b ON si.sicabang = b.bkode JOIN m1_location l ON si.silokasi = l.lkode AND si.sicabang = l.lcabang LEFT JOIN m5_si_pay sp ON si.siid = sp.idsi LEFT JOIN m0_payment_method pm ON sp.carabayar = pm.kode WHERE ((si.sistatus = 2) OR (si.sistatus = 3) OR (si.sistatus = 4) OR (si.sistatus = 7) ) GROUP BY si.sicabang ASC , si.silokasi ASC, cc.cckode ASC, k.kcustomtext1 ASC, k.kcustomtext2 ASC, si.sicustomer ASC , si.sitgl ASC , si.siid ASC ,si.sicarabayar ASC , sp.carabayar ASC ORDER BY si.sicabang ASC , si.silokasi ASC, cc.cckode ASC, k.kcustomtext1 ASC, k.kcustomtext2 ASC, si.sicustomer ASC , si.sitgl ASC , si.siid ASC ,si.sicarabayar ASC , sp.carabayar ASC;

-- RID=4548546 | MENU=8 | ITEM=38 | RQUERY=1 | NAME=Laporan Penjualan Kredit Per Instansi | FILE=penjualan_kredit_per_instansi
SELECT si.sicabang AS cabang , si.silokasi AS lokasi , b.bnama AS sicabang , l.lnama AS silokasi , k.kkategoricustomer AS kkategoricustomer , cc.ccnama AS kategorinama , si.sicarabayar , SUM(si.sitotaltransaksi) AS sitotaltransaksi , k.kcustomtext1, k.kcustomtext2 FROM m5_si si JOIN m1_contact k ON si.sicustomer = k.kid JOIN m1_customer_category cc ON k.kkategoricustomer = cc.cckode JOIN m1_branch b ON si.sicabang = b.bkode JOIN m1_location l ON si.silokasi = l.lkode AND si.sicabang = l.lcabang WHERE ((si.sistatus = 2) OR (si.sistatus = 3) OR (si.sistatus = 4) OR (si.sistatus = 7) ) AND (si.sicarabayar = 1) GROUP BY si.sicabang ASC, l.lkode ASC , k.kkategoricustomer ASC , k.kcustomtext1 ASC , k.kcustomtext2 ASC ORDER BY si.sicabang ASC, l.lkode ASC , k.kkategoricustomer ASC , k.kcustomtext1 ASC , k.kcustomtext2 ASC;

-- RID=4548547 | MENU=8 | ITEM=39 | RQUERY=1 | NAME=Laporan Penjualan Kredit Per Instansi Per Anggota | FILE=laporan_penjualan_kredit_per_instansi_per_anggota
SELECT si.sicabang AS cabang , si.silokasi AS lokasi , b.bnama AS sicabang , l.lnama AS silokasi , k.kkategoricustomer AS kkategoricustomer , cc.ccnama AS kategorinama , k.knama AS sicustomer , k.kkode AS kodecustomer , si.sicarabayar , SUM(si.sitotaltransaksi) AS sitotaltransaksi , k.kcustomtext1, k.kcustomtext2 FROM m5_si si JOIN m1_contact k ON si.sicustomer = k.kid JOIN m1_customer_category cc ON k.kkategoricustomer = cc.cckode JOIN m1_branch b ON si.sicabang = b.bkode JOIN m1_location l ON si.silokasi = l.lkode AND si.sicabang = l.lcabang WHERE ((si.sistatus = 2) OR (si.sistatus = 3) OR (si.sistatus = 4) OR (si.sistatus = 7) ) AND (si.sicarabayar = 1) GROUP BY si.sicabang ASC, l.lkode ASC , k.kkategoricustomer ASC , k.kcustomtext1 ASC , , k.kcustomtext2 ASC, si.sicustomer ASC ORDER BY si.sicabang ASC, l.lkode ASC , k.kkategoricustomer ASC , k.kcustomtext1 ASC , , k.kcustomtext2 ASC, si.sicustomer ASC;

-- RID=4548548 | MENU=8 | ITEM=40 | RQUERY=1 | NAME=Laporan Penjualan Barang Promo  | FILE=si_klaim_1
SELECT bb.bnama AS sicabang , l.lnama AS silokasi , sid.idbarang , b.bkode , b.bnama , si.sitgl , si.sinotransaksi , sid.jml , sid.satuan , sid.harga , (sid.jml * sid.harga) AS total , sid.jmldiskon , (sid.jmldiskon / sid.jml) AS diskperpcs FROM m5_si si JOIN m1_branch bb ON si.sicabang = bb.bkode JOIN m1_location l ON si.silokasi = l.lkode AND si.sicabang = l.lcabang JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_item b ON sid.idbarang = b.bid WHERE sid.jmldiskon <> 0 ORDER BY bb.bnama , l.lnama , sid.idbarang , si.sitgl , si.siid;

-- RID=4548549 | MENU=8 | ITEM=41 | RQUERY=1 | NAME=Laporan Rekapitulasi  | FILE=si_klaim_2
SELECT bb.bnama AS sicabang , l.lkode , CASE l.lkode WHEN "DC" THEN 1 WHEN "GKB" THEN 2 WHEN "GL" THEN 3 WHEN "PJN" THEN 4 WHEN "PST" THEN 5 WHEN "SGT" THEN 6 WHEN "TBN" THEN 7 END AS lokasi , l.lnama AS silokasi , sid.idbarang , b.bkode , b.bnama , si.sitgl , si.sinotransaksi , sid.jml , sid.satuan , sid.harga , (sid.jml * sid.harga) AS total , sid.jmldiskon , (sid.jmldiskon / sid.jml) AS diskperpcs FROM m5_si si JOIN m1_branch bb ON si.sicabang = bb.bkode JOIN m1_location l ON si.silokasi = l.lkode AND si.sicabang = l.lcabang JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_item b ON sid.idbarang = b.bid WHERE sid.jmldiskon <> 0 ORDER BY bb.bnama , sid.idbarang , l.lnama;

-- RID=4548550 | MENU=8 | ITEM=42 | RQUERY=1 | NAME=Laporan Penjualan Pulsa  | FILE=penjualan_pulsa_detail
SELECT bb.bnama AS sicabang , l.lnama AS silokasi , si.sitgl , si.sinotransaksi , sid.idbarang , b.bkode , b.bnama , b.bhargabeli , pi.pihargajual1 , Sum(sid.jml) As jml, sid.satuan , sid.harga , Sum(sid.jml * b.bhargabeli) AS totalbeli , Sum(sid.jml * pi.pihargajual1) AS totaljual , sid.jmldiskon , sid.diskon FROM m5_si si JOIN m1_branch bb ON si.sicabang = bb.bkode JOIN m1_location l ON si.silokasi = l.lkode AND si.sicabang = l.lcabang JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_item b ON sid.idbarang = b.bid LEFT JOIN m_12_pos_item pi ON sid.idbarang = pi.piidbarang AND pi.pikategori = si.silokasi WHERE b.bjenis = "V" GROUP BY bb.bnama , l.lnama , sid.idsidetail ORDER BY bb.bnama , l.lnama ,b.bkode , si.sitgl;

-- RID=4548551 | MENU=8 | ITEM=43 | RQUERY=1 | NAME=Laporan Penjualan Pulsa | FILE=penjualan_pulsa_global
SELECT bb.bnama AS sicabang , l.lnama AS silokasi , si.sitgl , si.sinotransaksi , sid.idbarang , b.bkode , b.bnama , b.bhargabeli , pi.pihargajual1 , Sum(sid.jml) As jml, sid.satuan , sid.harga , Sum(sid.jml * b.bhargabeli) AS totalbeli , Sum(sid.jml * pi.pihargajual1) AS totaljual , sid.jmldiskon , sid.diskon FROM m5_si si JOIN m1_branch bb ON si.sicabang = bb.bkode JOIN m1_location l ON si.silokasi = l.lkode AND si.sicabang = l.lcabang JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_item b ON sid.idbarang = b.bid LEFT JOIN m_12_pos_item pi ON sid.idbarang = pi.piidbarang AND pi.pikategori = si.silokasi WHERE b.bjenis = "V" GROUP BY bb.bnama , l.lnama , sid.idbarang ORDER BY bb.bnama , l.lnama , b.bkode;

-- RID=12452125 | MENU=8 | ITEM=45 | RQUERY=2 | NAME=Laporan Penjualan Bulanan Per Tanggal | FILE=ok_ok2
SELECT * FROM m2r_penjualan_barang_pertgl ORDER BY cabang ASC , lokasi ASC , cckode ASC , sitgl ASC , sumber ASC;

-- RID=12452126 | MENU=8 | ITEM=46 | RQUERY=2 | NAME=Laporan Penjualan Bulanan Per Customer | FILE=ok_percustomer_3
SELECT * FROM ((SELECT si.sicarabayar , CASE si.sicarabayar WHEN 1 THEN 0 WHEN 0 THEN IFNULL(sp.urutan,1) END as urutan , IFNULL(sp.urutan,1) AS urutaan , si.sicabang AS cabang , si.silokasi AS lokasi, b.bnama AS sicabang , l.lnama AS silokasi , si.sijmlbayar, si.sijmlkembali , si.siid , si.sitgl , si.sitotaltransaksi AS totaltransaksi , sp.carabayar as kode , pm.nama AS carabayar , sp.matauang , Sum(sp.jumlah) as jumlah , sp.jumlahvalas , cc.cckode , cc.ccnama , k.kcustomtext1, k.kcustomtext2 , k.kid , k.knama , k.kkode , k.kcustomtext3 , k.kcustomdbl1, CASE sp.carabayar WHEN 8 THEN CASE k.kcustomtext1 WHEN '07' THEN 7 ELSE 1 END ELSE 0 END AS caption , si.sisumber AS sumber FROM m5_si si JOIN m1_contact k ON si.sicustomer = k.kid JOIN m1_customer_category cc ON k.kkategoricustomer = cc.cckode JOIN m1_branch b ON si.sicabang = b.bkode JOIN m1_location l ON si.silokasi = l.lkode AND si.sicabang = l.lcabang LEFT JOIN m5_si_pay sp ON si.siid = sp.idsi LEFT JOIN m0_payment_method pm ON sp.carabayar = pm.kode WHERE ((si.sistatus = 2) OR (si.sistatus = 3) OR (si.sistatus = 4) OR (si.sistatus = 7) ) GROUP BY si.sicabang ASC , si.silokasi ASC, cc.cckode ASC, k.kcustomtext1 ASC, k.kcustomtext2 ASC, si.sicustomer ASC , si.sitgl ASC , si.siid ASC ,si.sicarabayar ASC , sp.carabayar ASC ORDER BY si.sicabang ASC , si.silokasi ASC, cc.cckode ASC, k.kcustomtext1 ASC, k.kcustomtext2 ASC, si.sicustomer ASC , si.sitgl ASC , si.siid ASC ,si.sicarabayar ASC , sp.carabayar ASC ) UNION ALL (SELECT 0 AS sicarabayar , 0 AS urutan , 0 AS urutaan , sr.srcabang AS cabang , sr.srlokasi AS lokasi, b.bnama AS sicabang , l.lnama AS silokasi , 0 AS sijmlbayar, 0 AS sijmlkembali , sr.srid AS siid , sr.srtgl AS sitgl , sr.srtotaltransaksi AS totaltransaksi , 0 kode , 0 AS carabayar , 0 AS matauang , 0 as jumlah , 0 AS jumlahvalas , cc.cckode , cc.ccnama , k.kcustomtext1, k.kcustomtext2 , k.kid , k.knama , k.kkode , k.kcustomtext3 , k.kcustomdbl1, 0 AS caption , sr.srsumber AS sumber FROM m5_sr sr JOIN m1_contact k ON sr.srcustomer = k.kid JOIN m1_customer_category cc ON k.kkategoricustomer = cc.cckode JOIN m1_branch b ON sr.srcabang = b.bkode JOIN m1_location l ON sr.srlokasi = l.lkode AND sr.srcabang = l.lcabang WHERE ((sr.srstatus = 2) OR (sr.srstatus = 3) OR (sr.srstatus = 4) OR (sr.srstatus = 7) ) GROUP BY sr.srcabang ASC , sr.srlokasi ASC, cc.cckode ASC, k.kcustomtext1 ASC, k.kcustomtext2 ASC, sr.srcustomer ASC , sr.srtgl ASC , sr.srid ASC ORDER BY sr.srcabang ASC , sr.srlokasi ASC, cc.cckode ASC, k.kcustomtext1 ASC, k.kcustomtext2 ASC, sr.srcustomer ASC , sr.srtgl ASC , sr.srid ASC ) ) AS penjualan ORDER BY cabang ASC , lokasi ASC, cckode ASC, kcustomtext1 ASC, kcustomtext2 ASC, kkode ASC , sitgl ASC;

-- RID=1071 | MENU=12 | ITEM=1 | RQUERY=1 | NAME=Daftar Setting Aplikasi POS | FILE=aplikasi
SELECT pc.pckode , pc.pcnama , pc.pccatatan , s.skode , s.snama , s.suraian , s.snilai FROM m_12_pos_category pc JOIN m_12_pos_category_setting pcs ON pc.pckode = pcs.pcskategori JOIN m_12_pos_setting s ON pcs.pcsmodule = s.smodule AND pcs.pcsgrup = s.sgrup AND pcs.pcskode = s.skode ORDER BY pc.pckode , pcs.pcsmodule , s.surutan;

-- RID=1610 | MENU=13 | ITEM=1 | RQUERY=1 | NAME=Laporan Setting Barang POS | FILE=SettingBarangPOS
SELECT pi.pikategori , pc.pcnama , pi.piidbarang, b.bkode , b.bnama , b.bsatuan , b.bhargabeli , b.bhppaverage , pi.pihargajual1 , pi.pihargajual2, pi.pidiskonjual1 , pi.pidiskonjual2 , pi.pistokminimal , pi.pistokmaksimal , pi.pistokminorder , pi.pistokreorder FROM m_12_pos_item pi JOIN m1_item b ON pi.piidbarang = b.bid JOIN m_12_pos_category pc ON pi.pikategori = pc.pckode ORDER BY pi.pikategori , pi.piidbarang;

-- RID=1072 | MENU=14 | ITEM=1 | RQUERY=1 | NAME=Barang Bonus | FILE=BarangBonus
SELECT pc.pcnama , b.bkode , b.bnama , CASE bi.bioperator WHEN 0 THEN "Antara" WHEN 1 THEN ">=" WHEN 2 THEN "Kelipatan" END AS bioperator , bi.bijml1 , bi.bijml2, b.bsatuan FROM m_12_pos_bonus_item bi JOIN m_12_pos_category pc ON bi.bikategori = pc.pckode JOIN m1_item b ON bi.biidbarang = b.bid ORDER BY bi.bikategori;

-- RID=1073 | MENU=14 | ITEM=2 | RQUERY=1 | NAME=Barang Bonus | FILE=BarangBonusDetail3
SELECT bi.biid , pc.pcnama , b.bkode , b.bnama , CASE bi.bioperator WHEN 0 THEN "Antara" WHEN 1 THEN ">=" WHEN 2 THEN "Kelipatan" END AS bioperator , bi.bijml1 , bi.bijml2, b.bsatuan FROM m_12_pos_bonus_item bi JOIN m_12_pos_category pc ON bi.bikategori = pc.pckode JOIN m1_item b ON bi.biidbarang = b.bid ORDER BY bi.bikategori, bi.biid, bi.biidbarang;

-- RID=1074 | MENU=15 | ITEM=1 | RQUERY=1 | NAME=Barang Pengganti | FILE=BarangPengganti
SELECT pc.pcnama , b.bkode , b.bnama , CASE si.sioperator WHEN 0 THEN "Antara" WHEN 1 THEN ">=" WHEN 2 THEN "Kelipatan" END AS sioperator , si.sijml1, si.sijml2 , b.bsatuan FROM m_12_pos_substitution_item si JOIN m_12_pos_category pc ON si.sikategori = pc.pckode JOIN m1_item b ON si.siidbarang = b.bid ORDER BY si.sikategori , si.siidbarang;

-- RID=1075 | MENU=15 | ITEM=2 | RQUERY=1 | NAME=Barang Pengganti Detail | FILE=BarangPenggantiDetail3
SELECT si.siid , pc.pcnama , b.bkode , b.bnama , CASE si.sioperator WHEN 0 THEN "Antara" WHEN 1 THEN ">=" WHEN 2 THEN "Kelipatan" END AS sioperator , si.sijml1 , si.sijml2, b.bsatuan FROM m_12_pos_substitution_item si JOIN m_12_pos_category pc ON si.sikategori = pc.pckode JOIN m1_item b ON si.siidbarang = b.bid ORDER BY si.sikategori , si.siid , si.siidbarang;

-- RID=1076 | MENU=16 | ITEM=1 | RQUERY=1 | NAME=Barang Tambahan | FILE=BarangTambahan
SELECT pc.pcnama , b.bkode , b.bnama , CASE ai.aioperator WHEN 0 THEN "Antara" WHEN 1 THEN ">=" WHEN 2 THEN "Kelipatan" END AS sioperator , ai.aijml1 AS sijml1, ai.aijml2 AS sijml2 , b.bsatuan FROM m_12_pos_additional_item ai JOIN m_12_pos_category pc ON ai.aikategori = pc.pckode JOIN m1_item b ON ai.aiidbarang = b.bid ORDER BY ai.aikategori , ai.aiidbarang;

-- RID=1077 | MENU=16 | ITEM=2 | RQUERY=1 | NAME=Barang Tambahan  | FILE=BarangTambahanDetail3
SELECT ai.aiid , pc.pcnama , b.bkode, b.bnama , CASE ai.aioperator WHEN 0 THEN "Antara" WHEN 1 THEN ">=" WHEN 2 THEN "Kelipatan" END AS aioperator , ai.aijml1 , ai.aijml2 , b.bsatuan FROM m_12_pos_additional_item ai JOIN m_12_pos_category pc ON ai.aikategori = pc.pckode JOIN m1_item b ON ai.aiidbarang = b.bid ORDER BY ai.aikategori , ai.aiid , ai.aiidbarang;

-- RID=1078 | MENU=17 | ITEM=1 | RQUERY=1 | NAME=Diskon Barang | FILE=DiskonBarang
SELECT pc.pckode , pc.pcnama , b.bkode , b.bnama , CASE di.dikriteria WHEN 0 THEN "Harga" WHEN 1 THEN "Diskon Persen" WHEN 2 THEN "Diskon Harga" END AS dikriteria, CASE di.dioperator WHEN 0 THEN "Antara" WHEN 1 THEN ">=" WHEN 2 THEN "Kelipatan" END AS dioperator , di.dijml1, di.dijml2, di.dinilai , di.ditgl1 AS tglawal, di.ditgl2 AS tglakhir, di.dijam1 AS jamawal, di.dijam2 AS jamakhir FROM m_12_pos_discount_item di JOIN m_12_pos_category pc ON di.dikategori = pc.pckode JOIN m1_item b ON di.diidbarang = b.bid ORDER BY di.dikategori, di.diidbarang;

-- RID=1079 | MENU=18 | ITEM=1 | RQUERY=1 | NAME=Diskon Kategori Barang | FILE=DiskonKategoriBarang
SELECT dci.dcikategori , pc.pcnama , ic.icnama , CASE dci.dcikriteria WHEN 0 THEN "Harga" WHEN 1 THEN "Diskon Persen" WHEN 2 THEN "Diskon Harga" END AS dikriteria, CASE dci.dcioperator WHEN 0 THEN "Antara" WHEN 1 THEN ">=" WHEN 2 THEN "Kelipatan" END AS dioperator , dci.dcijml1 , dci.dcijml2 , dci.dcinilai, dci.dcitgl1 , dci.dcitgl2, dci.dcijam1 , dci.dcijam2 FROM m_12_pos_discount_category_item dci JOIN m_12_pos_category pc ON dci.dcikategori = pc.pckode JOIN m1_item_category ic ON dci.dcikategoribarang = ic.ickode ORDER BY dci.dcikategori, dci.dcikategoribarang;

-- RID=1080 | MENU=19 | ITEM=1 | RQUERY=1 | NAME=Point | FILE=point
SELECT pi.pikategori, pc.pcnama , b.bkode, b.bnama , CASE pi.pioperator WHEN 0 THEN "Antara" WHEN 1 THEN ">=" WHEN 2 THEN "Kelipatan" END AS pioperator , pi.pijml1 , pi.pijml2, pi.pijmlpoint FROM m_12_pos_point_item pi JOIN m_12_pos_category pc ON pi.pikategori = pc.pckode JOIN m1_item b ON pi.piidbarang = b.bid ORDER BY pi.pikategori;

-- RID=1081 | MENU=20 | ITEM=1 | RQUERY=1 | NAME=Point Kategori Barang | FILE=PointKategoriBarang
SELECT pci.pcikategori , pc.pcnama , pci.pcikategoribarang , ic.icnama , CASE pci.pcioperator WHEN 0 THEN "Antara" WHEN 1 THEN ">=" WHEN 2 THEN "Kelipatan" END AS pcioperator , pci.pcijml1 , pci.pcijml2, pci.pcijmlpoint FROM m_12_pos_point_category_item pci JOIN m_12_pos_category pc ON pci.pcikategori = pc.pckode JOIN m1_item_category ic ON pci.pcikategoribarang = ic.ickode ORDER BY pci.pcikategori , pci.pcikategoribarang;

-- RID=1082 | MENU=21 | ITEM=1 | RQUERY=1 | NAME=Lokasi Kategori POS | FILE=LokasiKategoriPOS
SELECT l.lkode , l.lnama , pc.pckode, pc.pcnama FROM m1_location l JOIN m_12_pos_category pc ON l.lkategoripos = pc.pckode WHERE l.lkategoripos <> " " ORDER BY l.lkode , l.lkategoripos;

-- RID=1062 | MENU=25 | ITEM=1 | RQUERY=1 | NAME=Daftar Penyesuaian Poin Pelanggan (CPA) | FILE=CPA
SELECT cpa.cpaid, cpa.cpatgl, cpa.cpanotransaksi , st.nama, cpa.cpauraian, c.kkode, c.knama , cpad.poinlama, cpad.poinmasuk , cpad.poinkeluar, cpad.poinbaru , cpad.catatan FROM m_12_cpa cpa JOIN m_12_cpa_detail cpad ON cpa.cpaid = cpad.idcpa JOIN m0_status st ON cpa.cpastatus = st.kode JOIN m1_contact c ON cpad.kontak = c.kid ORDER BY cpa.cpaid , cpad.urutan;

-- RID=1063 | MENU=25 | ITEM=2 | RQUERY=1 | NAME=Penyesuaian Poin Pelanggan (CPA) | FILE=CPADETAIL1
SELECT cpa.cpaid, cpa.cpatgl, cpa.cpanotransaksi , st.nama, cpa.cpauraian, c.kkode, c.knama , cpad.poinlama, cpad.poinmasuk , cpad.poinkeluar, cpad.poinbaru , cpad.catatan FROM m_12_cpa cpa JOIN m_12_cpa_detail cpad ON cpa.cpaid = cpad.idcpa JOIN m0_status st ON cpa.cpastatus = st.kode JOIN m1_contact c ON cpad.kontak = c.kid ORDER BY cpa.cpaid , cpad.urutan;

-- RID=1064 | MENU=25 | ITEM=3 | RQUERY=1 | NAME=Penyesuaian Poin Pelanggan (CPA) | FILE=CPADETAIL2
SELECT cpa.cpaid, cpa.cpatgl, cpa.cpanotransaksi , st.nama, cpa.cpauraian, c.kkode, c.knama , cpad.poinlama, cpad.poinmasuk , cpad.poinkeluar, cpad.poinbaru , cpad.catatan FROM m_12_cpa cpa JOIN m_12_cpa_detail cpad ON cpa.cpaid = cpad.idcpa JOIN m0_status st ON cpa.cpastatus = st.kode JOIN m1_contact c ON cpad.kontak = c.kid ORDER BY cpa.cpaid , cpad.urutan;

-- RID=1051 | MENU=28 | ITEM=1 | RQUERY=2 | NAME=Poin Pelanggan (Global) | FILE=poinpelanggan
SELECT cp.cpkontak , cp.cpkontakkode , cp.cpkontaknama, cp.cptgl , cp.cpnotransaksi , cp.cpuraian , cp.cpsaldoawal , cp.cpmasuk , cp.cpkeluar , cp.cpsaldo , cc.cckode , cc.ccnama FROM m2r_customer_point cp JOIN m1_contact c ON cp.cpkontak = c.kid JOIN m1_customer_category cc ON c.kkategoricustomer = cc.cckode ORDER BY cp.cpkontakkode, cp.cpnourut;

-- RID=1052 | MENU=28 | ITEM=2 | RQUERY=2 | NAME=Poin Pelanggan (Detail) | FILE=poinpelanggandetail
SELECT cp.cpidtransaksi , cp.cpkontak , cp.cpkontakkode , cp.cpkontaknama, cp.cptgl , cp.cpnotransaksi , cp.cpuraian , cp.cpmasuk , cp.cpkeluar , cp.cpsaldo , cc.cckode FROM m2r_customer_point cp JOIN m1_contact c ON cp.cpkontak = c.kid JOIN m1_customer_category cc ON c.kkategoricustomer = cc.cckode ORDER BY cp.cpkontakkode, cp.cpnourut;

-- RID=1068 | MENU=29 | ITEM=1 | RQUERY=1 | NAME=Kategori Custom Area | FILE=kategoricustomarea
SELECT ac.ackode , ac.acnama , ac.accatatan FROM m_12_area_category ac ORDER BY ac.ackode;

-- RID=1067 | MENU=30 | ITEM=1 | RQUERY=1 | NAME=Custom Area | FILE=customarea
SELECT a.akode , a.anama , ac.acnama AS akategori , a.acatatan FROM m_12_area a JOIN m_12_area_category ac ON a.akategori = ac.ackode ORDER BY a.akode;

-- RID=1136 | MENU=54 | ITEM=5 | RQUERY=1 | NAME=Daftar Barang Bonus (BI) | FILE=penyusunGlobal
SELECT bi.biid , bid.idbidetail , bi.binotransaksi , bi.bitgl, st.nama AS bistatus , bi.biuraian , b.bkode , b.bnama , CASE bid.operator WHEN 0 THEN "Antara" WHEN 1 THEN ">=" WHEN 2 THEN "Kelipatan" END AS a , bid.jml1 , bid.jml2 , bid.tgl1 , bid.tgl2 FROM m_12_bi bi JOIN m_12_bi_detail bid ON bi.biid = bid.idbi JOIN m0_status st ON bi.bistatus = st.kode JOIN m1_item b ON bid.idbarang = b.bid ORDER BY bi.biid , bi.binotransaksi , bid.urutan;

-- RID=1137 | MENU=54 | ITEM=6 | RQUERY=1 | NAME=Barang Bonus (BI) | FILE=penyusunDetail1
SELECT bi.biid , bid.idbidetail , bi.binotransaksi , bi.bitgl, st.nama AS bistatus , bi.biuraian , b.bkode , b.bnama , CASE bid.operator WHEN 0 THEN "Antara" WHEN 1 THEN ">=" WHEN 2 THEN "Kelipatan" END AS a , bid.jml1 , bid.jml2 , bid.tgl1 , bid.tgl2 FROM m_12_bi bi JOIN m_12_bi_detail bid ON bi.biid = bid.idbi JOIN m0_status st ON bi.bistatus = st.kode JOIN m1_item b ON bid.idbarang = b.bid ORDER BY bi.biid , bi.binotransaksi , bid.urutan;

-- RID=1338 | MENU=54 | ITEM=7 | RQUERY=1 | NAME=Barang Bonus (BI) | FILE=penyusunDetail2
SELECT bi.biid , bid.idbidetail , bi.binotransaksi , bi.bitgl, st.nama AS bistatus , bi.biuraian , b.bkode , b.bnama , CASE bid.operator WHEN 0 THEN "Antara" WHEN 1 THEN ">=" WHEN 2 THEN "Kelipatan" END AS a , bid.jml1 , bid.jml2 , bid.tgl1 , bid.tgl2 FROM m_12_bi bi JOIN m_12_bi_detail bid ON bi.biid = bid.idbi JOIN m0_status st ON bi.bistatus = st.kode JOIN m1_item b ON bid.idbarang = b.bid ORDER BY bi.biid , bi.binotransaksi , bid.urutan;

-- RID=1385 | MENU=55 | ITEM=1 | RQUERY=1 | NAME=Daftar Barang Tambahan (AI) | FILE=AI_Global
SELECT ai.aiid , aid.idaidetail, ai.ainotransaksi , ai.aitgl , st.nama AS aistatus , ai.aiuraian , b.bkode , b.bnama , CASE aid.operator WHEN 0 THEN "Antara" WHEN 1 THEN ">=" WHEN 2 THEN "Kelipatan" END AS a , aid.jml1 , aid.jml2 , aid.tgl1 , aid.tgl2 FROM m_12_ai ai JOIN m_12_ai_detail aid ON ai.aiid = aid.idai JOIN m0_status st ON ai.aistatus = st.kode JOIN m1_item b ON aid.idbarang = b.bid ORDER BY ai.aiid , ai.ainotransaksi , aid.urutan;

-- RID=1386 | MENU=55 | ITEM=2 | RQUERY=1 | NAME=Barang Tambahan (AI) | FILE=AI_Detail1
SELECT ai.aiid , aid.idaidetail, ai.ainotransaksi , ai.aitgl , st.nama AS aistatus , ai.aiuraian , b.bkode , b.bnama , CASE aid.operator WHEN 0 THEN "Antara" WHEN 1 THEN ">=" WHEN 2 THEN "Kelipatan" END AS a , aid.jml1 , aid.jml2 , aid.tgl1 , aid.tgl2 FROM m_12_ai ai JOIN m_12_ai_detail aid ON ai.aiid = aid.idai JOIN m0_status st ON ai.aistatus = st.kode JOIN m1_item b ON aid.idbarang = b.bid ORDER BY ai.aiid , ai.ainotransaksi , aid.urutan;

-- RID=1387 | MENU=55 | ITEM=3 | RQUERY=1 | NAME=Barang Tambahan (AI) | FILE=AI_Detail2
SELECT ai.aiid , aid.idaidetail, ai.ainotransaksi , ai.aitgl , st.nama AS aistatus , ai.aiuraian , b.bkode , b.bnama , CASE aid.operator WHEN 0 THEN "Antara" WHEN 1 THEN ">=" WHEN 2 THEN "Kelipatan" END AS a , aid.jml1 , aid.jml2 , aid.tgl1 , aid.tgl2 FROM m_12_ai ai JOIN m_12_ai_detail aid ON ai.aiid = aid.idai JOIN m0_status st ON ai.aistatus = st.kode JOIN m1_item b ON aid.idbarang = b.bid ORDER BY ai.aiid , ai.ainotransaksi , aid.urutan;

-- RID=1388 | MENU=56 | ITEM=1 | RQUERY=1 | NAME=Daftar Barang Pengganti (SBI) | FILE=SBI_Global
SELECT sbi.sbiid , sbid.idsbidetail , sbi.sbinotransaksi , sbi.sbitgl , st.nama AS sbistatus , sbi.sbiuraian , b.bkode , b.bnama , CASE sbid.operator WHEN 0 THEN "Antara" WHEN 1 THEN ">=" WHEN 2 THEN "Kelipatan" END AS a , sbid.jml1 , sbid.jml2 , sbid.tgl1 , sbid.tgl2 FROM m_12_sbi sbi JOIN m_12_sbi_detail sbid ON sbi.sbiid = sbid.idsbi JOIN m0_status st ON sbi.sbistatus = st.kode JOIN m1_item b ON sbid.idbarang = b.bid ORDER BY sbi.sbiid , sbi.sbinotransaksi , sbid.urutan;

-- RID=1389 | MENU=56 | ITEM=2 | RQUERY=1 | NAME=Barang Pengganti (SBI) | FILE=SBI_Detail1
SELECT sbi.sbiid , sbid.idsbidetail , sbi.sbinotransaksi , sbi.sbitgl , st.nama AS sbistatus , sbi.sbiuraian , b.bkode , b.bnama , CASE sbid.operator WHEN 0 THEN "Antara" WHEN 1 THEN ">=" WHEN 2 THEN "Kelipatan" END AS a , sbid.jml1 , sbid.jml2 , sbid.tgl1 , sbid.tgl2 FROM m_12_sbi sbi JOIN m_12_sbi_detail sbid ON sbi.sbiid = sbid.idsbi JOIN m0_status st ON sbi.sbistatus = st.kode JOIN m1_item b ON sbid.idbarang = b.bid ORDER BY sbi.sbiid , sbi.sbinotransaksi , sbid.urutan;

-- RID=1390 | MENU=56 | ITEM=3 | RQUERY=1 | NAME=Barang Pengganti (SBI) | FILE=SBI_Detail2
SELECT sbi.sbiid , sbid.idsbidetail , sbi.sbinotransaksi , sbi.sbitgl , st.nama AS sbistatus , sbi.sbiuraian , b.bkode , b.bnama , CASE sbid.operator WHEN 0 THEN "Antara" WHEN 1 THEN ">=" WHEN 2 THEN "Kelipatan" END AS a , sbid.jml1 , sbid.jml2 , sbid.tgl1 , sbid.tgl2 FROM m_12_sbi sbi JOIN m_12_sbi_detail sbid ON sbi.sbiid = sbid.idsbi JOIN m0_status st ON sbi.sbistatus = st.kode JOIN m1_item b ON sbid.idbarang = b.bid ORDER BY sbi.sbiid , sbi.sbinotransaksi , sbid.urutan;

-- RID=1339 | MENU=57 | ITEM=1 | RQUERY=1 | NAME=Daftar Diskon Barang (DI) | FILE=diskonbarangGlobal
SELECT di.diid , di.dinotransaksi , di.ditgl , st.nama AS distatus , di.diuraian , b.bkode , b.bnama , CASE did.operator WHEN 0 THEN "Antara" WHEN 1 THEN ">=" WHEN 2 THEN "Kelipatan" END AS a , did.jml1 , did.jml2, did.nilai , CASE did.kriteria WHEN 1 THEN "%" ELSE "" END AS kriteria , did.tgl1, did.tgl2 FROM m_12_di di JOIN m_12_di_detail did ON di.diid = did.iddi JOIN m0_status st ON di.distatus = st.kode JOIN m1_item b ON did.idbarang = b.bid ORDER BY di.diid , di.dinotransaksi , did.urutan;

-- RID=1340 | MENU=57 | ITEM=2 | RQUERY=1 | NAME=Diskon Barang (DI) | FILE=diskonbarangDetail1
SELECT di.diid , di.dinotransaksi , di.ditgl , st.nama AS distatus , di.diuraian , b.bkode , b.bnama , CASE did.operator WHEN 0 THEN "Antara" WHEN 1 THEN ">=" WHEN 2 THEN "Kelipatan" END AS a , did.jml1 , did.jml2, did.nilai , CASE did.kriteria WHEN 1 THEN "%" ELSE "" END AS kriteria , did.tgl1, did.tgl2 FROM m_12_di di JOIN m_12_di_detail did ON di.diid = did.iddi JOIN m0_status st ON di.distatus = st.kode JOIN m1_item b ON did.idbarang = b.bid ORDER BY di.diid , di.dinotransaksi , did.urutan;

-- RID=1341 | MENU=57 | ITEM=3 | RQUERY=1 | NAME=Diskon Barang (DI) | FILE=diskonbarangDetail2
SELECT di.diid , di.dinotransaksi , di.ditgl , st.nama AS distatus , di.diuraian , b.bkode , b.bnama , CASE did.operator WHEN 0 THEN "Antara" WHEN 1 THEN ">=" WHEN 2 THEN "Kelipatan" END AS a , did.jml1 , did.jml2, did.nilai , CASE did.kriteria WHEN 1 THEN "%" ELSE "" END AS kriteria , did.tgl1, did.tgl2 FROM m_12_di di JOIN m_12_di_detail did ON di.diid = did.iddi JOIN m0_status st ON di.distatus = st.kode JOIN m1_item b ON did.idbarang = b.bid ORDER BY di.diid , di.dinotransaksi , did.urutan;

-- RID=1354 | MENU=66 | ITEM=1 | RQUERY=1 | NAME=Daftar Set Harga Jual POS (PPA) | FILE=PPAGlobal
SELECT ppa.ppaid , ppa.ppanotransaksi , ppa.ppatgl , ppa.ppatglberlakusampai , ppa.ppamatauang , ppa.ppakurs , ppa.ppauraian , st.nama AS ppastatus , b.bkode , b.bnama , ppad.satuan , ppad.stokminimal , ppad.stokmaksimal , ppad.stokminorder , ppad.stokreorder , ppad.hargajual1 , ppad.hargajual2 , ppad.hargajual3 , ppad.diskonjual1 , ppad.diskonjual2, ppad.diskonjual3 FROM m_12_ppa ppa JOIN m_12_ppa_detail ppad ON ppa.ppaid = ppad.idppa JOIN m0_status st ON ppa.ppastatus = st.kode JOIN m1_item b ON ppad.idbarang = b.bid ORDER BY ppa.ppatgl , ppa.ppaid , ppa.ppanotransaksi , ppad.urutan;

-- RID=1355 | MENU=66 | ITEM=2 | RQUERY=1 | NAME=Set Harga Jual POS Harga Jual (PPA) | FILE=PPADetail
SELECT ppa.ppaid , ppa.ppanotransaksi , ppa.ppatgl , ppa.ppatglberlakusampai , ppa.ppamatauang , ppa.ppakurs , ppa.ppauraian , st.nama AS ppastatus , b.bkode , b.bnama , ppad.satuan , ppad.stokminimal , ppad.stokmaksimal , ppad.stokminorder , ppad.stokreorder , ppad.hargajual1 , ppad.hargajual2 , ppad.hargajual3 , ppad.diskonjual1 , ppad.diskonjual2, ppad.diskonjual3 FROM m_12_ppa ppa JOIN m_12_ppa_detail ppad ON ppa.ppaid = ppad.idppa JOIN m0_status st ON ppa.ppastatus = st.kode JOIN m1_item b ON ppad.idbarang = b.bid ORDER BY ppa.ppatgl , ppa.ppaid , ppa.ppanotransaksi , ppad.urutan;

-- RID=1356 | MENU=66 | ITEM=3 | RQUERY=1 | NAME=Set Harga Jual POS Harga Jual (PPA) | FILE=PPADetail2
SELECT ppa.ppaid , ppa.ppanotransaksi , ppa.ppatgl , ppa.ppatglberlakusampai , ppa.ppamatauang , ppa.ppakurs , ppa.ppauraian , st.nama AS ppastatus , b.bkode , b.bnama , ppad.satuan , ppad.stokminimal , ppad.stokmaksimal , ppad.stokminorder , ppad.stokreorder , ppad.hargajual1 , ppad.hargajual2 , ppad.hargajual3 , ppad.diskonjual1 , ppad.diskonjual2, ppad.diskonjual3 FROM m_12_ppa ppa JOIN m_12_ppa_detail ppad ON ppa.ppaid = ppad.idppa JOIN m0_status st ON ppa.ppastatus = st.kode JOIN m1_item b ON ppad.idbarang = b.bid ORDER BY ppa.ppatgl , ppa.ppaid , ppa.ppanotransaksi , ppad.urutan;

-- RID=1357 | MENU=66 | ITEM=4 | RQUERY=1 | NAME=Set Harga Jual POS Diskon Jual (PPA) | FILE=PPADetail3
SELECT ppa.ppaid , ppa.ppanotransaksi , ppa.ppatgl , ppa.ppatglberlakusampai , ppa.ppamatauang , ppa.ppakurs , ppa.ppauraian , st.nama AS ppastatus , b.bkode , b.bnama , ppad.satuan , ppad.stokminimal , ppad.stokmaksimal , ppad.stokminorder , ppad.stokreorder , ppad.hargajual1 , ppad.hargajual2 , ppad.hargajual3 , ppad.diskonjual1 , ppad.diskonjual2, ppad.diskonjual3 FROM m_12_ppa ppa JOIN m_12_ppa_detail ppad ON ppa.ppaid = ppad.idppa JOIN m0_status st ON ppa.ppastatus = st.kode JOIN m1_item b ON ppad.idbarang = b.bid ORDER BY ppa.ppatgl , ppa.ppaid , ppa.ppanotransaksi , ppad.urutan;

-- RID=1358 | MENU=66 | ITEM=5 | RQUERY=1 | NAME=Set Harga Jual POS Diskon Jual (PPA) | FILE=PPADetail4
SELECT ppa.ppaid , ppa.ppanotransaksi , ppa.ppatgl , ppa.ppatglberlakusampai , ppa.ppamatauang , ppa.ppakurs , ppa.ppauraian , st.nama AS ppastatus , b.bkode , b.bnama , ppad.satuan , ppad.stokminimal , ppad.stokmaksimal , ppad.stokminorder , ppad.stokreorder , ppad.hargajual1 , ppad.hargajual2 , ppad.hargajual3 , ppad.diskonjual1 , ppad.diskonjual2, ppad.diskonjual3 FROM m_12_ppa ppa JOIN m_12_ppa_detail ppad ON ppa.ppaid = ppad.idppa JOIN m0_status st ON ppa.ppastatus = st.kode JOIN m1_item b ON ppad.idbarang = b.bid ORDER BY ppa.ppatgl , ppa.ppaid , ppa.ppanotransaksi , ppad.urutan;

-- RID=1159 | MENU=66 | ITEM=6 | RQUERY=1 | NAME=Set Harga Jual POS Stok (PPA) | FILE=PPADetail5
SELECT ppa.ppaid , ppa.ppanotransaksi , ppa.ppatgl , ppa.ppatglberlakusampai , ppa.ppamatauang , ppa.ppakurs , ppa.ppauraian , st.nama AS ppastatus , b.bkode , b.bnama , ppad.satuan , ppad.stokminimal , ppad.stokmaksimal , ppad.stokminorder , ppad.stokreorder , ppad.hargajual1 , ppad.hargajual2 , ppad.hargajual3 , ppad.diskonjual1 , ppad.diskonjual2, ppad.diskonjual3 FROM m_12_ppa ppa JOIN m_12_ppa_detail ppad ON ppa.ppaid = ppad.idppa JOIN m0_status st ON ppa.ppastatus = st.kode JOIN m1_item b ON ppad.idbarang = b.bid ORDER BY ppa.ppatgl , ppa.ppaid , ppa.ppanotransaksi , ppad.urutan;

-- RID=1160 | MENU=66 | ITEM=7 | RQUERY=1 | NAME=Set Harga Jual POS Stok (PPA) | FILE=PPADetail6
SELECT ppa.ppaid , ppa.ppanotransaksi , ppa.ppatgl , ppa.ppatglberlakusampai , ppa.ppamatauang , ppa.ppakurs , ppa.ppauraian , st.nama AS ppastatus , b.bkode , b.bnama , ppad.satuan , ppad.stokminimal , ppad.stokmaksimal , ppad.stokminorder , ppad.stokreorder , ppad.hargajual1 , ppad.hargajual2 , ppad.hargajual3 , ppad.diskonjual1 , ppad.diskonjual2, ppad.diskonjual3 FROM m_12_ppa ppa JOIN m_12_ppa_detail ppad ON ppa.ppaid = ppad.idppa JOIN m0_status st ON ppa.ppastatus = st.kode JOIN m1_item b ON ppad.idbarang = b.bid ORDER BY ppa.ppatgl , ppa.ppaid , ppa.ppanotransaksi , ppad.urutan;

-- RID=1360 | MENU=72 | ITEM=1 | RQUERY=2 | NAME=Harga Jual Dibawah Margin | FILE=hargajualdibawahmarginpos
SELECT * FROM m2r_barang_dibawah_margin ORDER BY kategoripos ASC, kategoribarang ASC, kodebarang ASC;

-- RID=1371 | MENU=73 | ITEM=1 | RQUERY=1 | NAME=Label Harga Jual 1 | FILE=label_harga_jual_1_new
SELECT b.bnama , b.bkode , lpd.hargajual1 AS bhargajual1 , lpd.satuanbarang FROM m1_item b JOIN m_12_lp_detail lpd ON b.bid = lpd.idbarang JOIN m_12_lp lp ON lpd.idlp = lp.lpid ORDER BY b.bkode , b.bnama;

-- RID=1372 | MENU=73 | ITEM=2 | RQUERY=1 | NAME=Label Harga Jual 2 | FILE=label_harga_jual_2
SELECT b.bnama , b.bkode , lpd.hargajual2 AS bhargajual1 , lpd.satuanbarang FROM m1_item b JOIN m_12_lp_detail lpd ON b.bid = lpd.idbarang JOIN m_12_lp lp ON lpd.idlp = lp.lpid ORDER BY b.bkode , b.bnama;

-- RID=1373 | MENU=73 | ITEM=3 | RQUERY=1 | NAME=Label Harga Jual 3 | FILE=label_harga_jual_3
SELECT b.bnama , b.bkode , lpd.hargajual3 AS bhargajual1 , lpd.satuanbarang FROM m1_item b JOIN m_12_lp_detail lpd ON b.bid = lpd.idbarang JOIN m_12_lp lp ON lpd.idlp = lp.lpid ORDER BY b.bkode , b.bnama;

-- RID=1374 | MENU=73 | ITEM=4 | RQUERY=1 | NAME=Label Harga Jual 4 | FILE=label_harga_jual_4
SELECT b.bnama , b.bkode , lpd.hargajual4 AS bhargajual1 , lpd.satuanbarang FROM m1_item b JOIN m_12_lp_detail lpd ON b.bid = lpd.idbarang JOIN m_12_lp lp ON lpd.idlp = lp.lpid ORDER BY b.bkode , b.bnama;

-- RID=1375 | MENU=73 | ITEM=5 | RQUERY=1 | NAME=Label Harga Jual 5 | FILE=label_harga_jual_5
SELECT b.bnama , b.bkode , lpd.hargajual5 AS bhargajual1 , lpd.satuanbarang FROM m1_item b JOIN m_12_lp_detail lpd ON b.bid = lpd.idbarang JOIN m_12_lp lp ON lpd.idlp = lp.lpid ORDER BY b.bkode , b.bnama;

-- RID=1376 | MENU=73 | ITEM=6 | RQUERY=1 | NAME=Barang Harga Jual Berubah | FILE=Barang_Harga_Jual_Berubah
SELECT b.bkode , b.bnama , lpd.satuan , lpd.hargajual1lama , lpd.hargajual1, lpd.diskonjual1lama, lpd.diskonjual1 FROM m1_item b JOIN m_12_lp_detail lpd ON b.bid = lpd.idbarang JOIN m_12_lp lp ON lpd.idlp = lp.lpid WHERE (lpd.hargajual1 <> hargajual1lama) ORDER BY b.bkode , b.bnama;

-- RID=1380 | MENU=73 | ITEM=7 | RQUERY=1 | NAME=Label Harga Jual 1 (langsung) | FILE=label_harga_jual_langsung_1
SELECT b.bnama , b.bkode , pi.pihargajual1 as harga , b.bsatuan, lw.blgnamalokasi FROM m_12_pos_item pi JOIN m1_item b ON pi.piidbarang = b.bid left join m1_item_location_warehouse lw ON b.bid = lw.blgidbarang AND b.bgudang = lw.blggudang GROUP BY pi.piidbarang , b.bid , lw.blgnamalokasi, pi.pihargajual1 , b.bsatuan ORDER BY pi.piidbarang , b.bid , lw.blgnamalokasi;

-- RID=1381 | MENU=73 | ITEM=8 | RQUERY=1 | NAME=Label Harga Jual 2 (langsung) | FILE=label_harga_jual_langsung_2
SELECT b.bnama , b.bkode , pi.pihargajual1 as harga , b.bsatuan, lw.blgnamalokasi FROM m_12_pos_item pi JOIN m1_item b ON pi.piidbarang = b.bid left join m1_item_location_warehouse lw ON b.bid = lw.blgidbarang AND b.bgudang = lw.blggudang GROUP BY pi.piidbarang , b.bid , lw.blgnamalokasi, pi.pihargajual1 , b.bsatuan ORDER BY pi.piidbarang , b.bid , lw.blgnamalokasi;

-- RID=1382 | MENU=73 | ITEM=9 | RQUERY=1 | NAME=Label Harga Jual 3 (langsung) | FILE=label_harga_jual_langsung_3
SELECT b.bnama , b.bkode , pi.pihargajual1 as harga , b.bsatuan, lw.blgnamalokasi FROM m_12_pos_item pi JOIN m1_item b ON pi.piidbarang = b.bid left join m1_item_location_warehouse lw ON b.bid = lw.blgidbarang AND b.bgudang = lw.blggudang GROUP BY pi.piidbarang , b.bid , lw.blgnamalokasi, pi.pihargajual1 , b.bsatuan ORDER BY pi.piidbarang , b.bid , lw.blgnamalokasi;

-- RID=1383 | MENU=73 | ITEM=10 | RQUERY=1 | NAME=Label Harga Jual 4 (langsung) | FILE=label_harga_jual_langsung_4
SELECT b.bnama , b.bkode , pi.pihargajual1 as harga , b.bsatuan, lw.blgnamalokasi FROM m_12_pos_item pi JOIN m1_item b ON pi.piidbarang = b.bid left join m1_item_location_warehouse lw ON b.bid = lw.blgidbarang AND b.bgudang = lw.blggudang GROUP BY pi.piidbarang , b.bid , lw.blgnamalokasi, pi.pihargajual1 , b.bsatuan ORDER BY pi.piidbarang , b.bid , lw.blgnamalokasi;

-- RID=1384 | MENU=73 | ITEM=11 | RQUERY=1 | NAME=Label Harga Jual 5 (langsung) | FILE=label_harga_jual_langsung_5
SELECT b.bnama , b.bkode , pi.pihargajual1 as harga , b.bsatuan, lw.blgnamalokasi FROM m_12_pos_item pi JOIN m1_item b ON pi.piidbarang = b.bid left join m1_item_location_warehouse lw ON b.bid = lw.blgidbarang AND b.bgudang = lw.blggudang GROUP BY pi.piidbarang , b.bid , lw.blgnamalokasi, pi.pihargajual1 , b.bsatuan ORDER BY pi.piidbarang , b.bid , lw.blgnamalokasi;

-- RID=1391 | MENU=73 | ITEM=12 | RQUERY=1 | NAME=Price Tag | FILE=PRICE_TAG
SELECT b.bnama , b.bkode , lpd.hargajual1 AS bhargajual1 , lpd.satuanbarang , blg.blgnamalokasi FROM m1_item b JOIN m_12_lp_detail lpd ON b.bid = lpd.idbarang JOIN m_12_lp lp ON lpd.idlp = lp.lpid left join m1_item_location_warehouse blg ON b.bid = blg.blgidbarang AND lp.lpgudang = blg.blggudang GROUP BY b.bkode , b.bnama , blg.blgnamalokasi , lpd.hargajual1, lpd.satuanbarang ORDER BY b.bkode , b.bnama , blg.blgnamalokasi;

-- RID=1392 | MENU=73 | ITEM=13 | RQUERY=1 | NAME=Price Tag | FILE=PRICE_TAG2
SELECT b.bnama , b.bkode , lpd.hargajual2 AS bhargajual1 , lpd.satuanbarang , blg.blgnamalokasi FROM m1_item b JOIN m_12_lp_detail lpd ON b.bid = lpd.idbarang JOIN m_12_lp lp ON lpd.idlp = lp.lpid left join m1_item_location_warehouse blg ON b.bid = blg.blgidbarang AND lp.lpgudang = blg.blggudang GROUP BY b.bkode , b.bnama , blg.blgnamalokasi , lpd.hargajual1, lpd.satuanbarang ORDER BY b.bkode , b.bnama , blg.blgnamalokasi;

-- RID=1393 | MENU=73 | ITEM=14 | RQUERY=1 | NAME=Price Tag | FILE=PRICE_TAG3
SELECT b.bnama , b.bkode , lpd.hargajual3 AS bhargajual1 , lpd.satuanbarang , blg.blgnamalokasi FROM m1_item b JOIN m_12_lp_detail lpd ON b.bid = lpd.idbarang JOIN m_12_lp lp ON lpd.idlp = lp.lpid left join m1_item_location_warehouse blg ON b.bid = blg.blgidbarang AND lp.lpgudang = blg.blggudang GROUP BY b.bkode , b.bnama , blg.blgnamalokasi , lpd.hargajual1, lpd.satuanbarang ORDER BY b.bkode , b.bnama , blg.blgnamalokasi;

-- RID=1394 | MENU=73 | ITEM=15 | RQUERY=1 | NAME=Price Tag | FILE=PRICE_TAG4
SELECT b.bnama , b.bkode , lpd.hargajual4 AS bhargajual1 , lpd.satuanbarang , blg.blgnamalokasi FROM m1_item b JOIN m_12_lp_detail lpd ON b.bid = lpd.idbarang JOIN m_12_lp lp ON lpd.idlp = lp.lpid left join m1_item_location_warehouse blg ON b.bid = blg.blgidbarang AND lp.lpgudang = blg.blggudang GROUP BY b.bkode , b.bnama , blg.blgnamalokasi , lpd.hargajual1, lpd.satuanbarang ORDER BY b.bkode , b.bnama , blg.blgnamalokasi;

-- RID=1395 | MENU=73 | ITEM=16 | RQUERY=1 | NAME=Price Tag | FILE=PRICE_TAG5
SELECT b.bnama , b.bkode , lpd.hargajual5 AS bhargajual1 , lpd.satuanbarang , blg.blgnamalokasi FROM m1_item b JOIN m_12_lp_detail lpd ON b.bid = lpd.idbarang JOIN m_12_lp lp ON lpd.idlp = lp.lpid left join m1_item_location_warehouse blg ON b.bid = blg.blgidbarang AND lp.lpgudang = blg.blggudang GROUP BY b.bkode , b.bnama , blg.blgnamalokasi , lpd.hargajual1, lpd.satuanbarang ORDER BY b.bkode , b.bnama , blg.blgnamalokasi;

-- RID=50000590 | MENU=73 | ITEM=17 | RQUERY=2 | NAME=Barcode | FILE=label_barcode
SELECT * FROM m2r_barcode ORDER BY idbarang;

-- RID=50000595 | MENU=73 | ITEM=18 | RQUERY=1 | NAME=Barcode 2 | FILE=label_barcode
SELECT lpd.idbarang , lp.lptgl , MONTH(lp.lptgl) bulan , CASE MONTH(lp.lptgl) WHEN 1 THEN "A" WHEN 2 THEN "B" WHEN 3 THEN "C" WHEN 4 THEN "D" WHEN 5 THEN "E" WHEN 6 THEN "F" WHEN 7 THEN "G" WHEN 8 THEN "H" WHEN 9 THEN "I" WHEN 10 THEN "J" WHEN 11 THEN "K" WHEN 12 THEN "L" END AS bulann , RIGHT(YEAR(lp.lptgl),2) , merk.mnama as merk , b.bkode , c.cnama AS warna , b.bnama AS namabarang , lpd.hargabeli FROM m_12_lp lp JOIN m_12_lp_detail lpd ON lp.lpid = lpd.idlp JOIN m1_item b ON lpd.idbarang = b.bid LEFT JOIN m1_merk merk ON b.bamerk = merk.mkode LEFT JOIN m1_color c ON b.bawarna = c.ckode ORDER BY lpd.idlp;

-- RID=50000713 | MENU=73 | ITEM=20 | RQUERY=1 | NAME=Label Barcode | FILE=label_barcode_ptaufiq
SELECT lpd.idbarang , lp.lptgl , MONTH(lp.lptgl) bulan , CASE MONTH(lp.lptgl) WHEN 1 THEN "A" WHEN 2 THEN "B" WHEN 3 THEN "C" WHEN 4 THEN "D" WHEN 5 THEN "E" WHEN 6 THEN "F" WHEN 7 THEN "G" WHEN 8 THEN "H" WHEN 9 THEN "I" WHEN 10 THEN "J" WHEN 11 THEN "K" WHEN 12 THEN "L" END AS bulann , RIGHT(YEAR(lp.lptgl),2) , merk.mnama as merk , b.bkode , c.cnama AS warna , b.bnama AS namabarang , lpd.hargajual1, lpd.customtext1 FROM m_12_lp lp /*JOIN m_12_lp_cetak lpd ON lp.lpid = lpd.idlp*/ JOIN m_12_lp_detail lpd ON lp.lpid = lpd.idlp JOIN m1_item b ON lpd.idbarang = b.bid LEFT JOIN m1_merk merk ON b.bamerk = merk.mkode LEFT JOIN m1_color c ON b.bawarna = c.ckode ORDER BY lpd.idlpdetail;

-- RID=50000716 | MENU=73 | ITEM=21 | RQUERY=1 | NAME=Label Barcode 3 Kolom | FILE=label_barcode_ptaufiq_3kolom
SELECT lpd.idbarang , lp.lptgl , MONTH(lp.lptgl) bulan , CASE MONTH(lp.lptgl) WHEN 1 THEN "A" WHEN 2 THEN "B" WHEN 3 THEN "C" WHEN 4 THEN "D" WHEN 5 THEN "E" WHEN 6 THEN "F" WHEN 7 THEN "G" WHEN 8 THEN "H" WHEN 9 THEN "I" WHEN 10 THEN "J" WHEN 11 THEN "K" WHEN 12 THEN "L" END AS bulann , RIGHT(YEAR(lp.lptgl),2) , merk.mnama as merk , b.bkode , c.cnama AS warna , b.bnama AS namabarang , lpd.hargajual1, lpd.customtext1 FROM m_12_lp lp /*JOIN m_12_lp_cetak lpd ON lp.lpid = lpd.idlp*/ JOIN m_12_lp_detail lpd ON lp.lpid = lpd.idlp JOIN m1_item b ON lpd.idbarang = b.bid LEFT JOIN m1_merk merk ON b.bamerk = merk.mkode LEFT JOIN m1_color c ON b.bawarna = c.ckode ORDER BY lpd.idlpdetail;

-- RID=1451 | MENU=76 | ITEM=1 | RQUERY=1 | NAME=Laporan Stok Minus | FILE=stokminus
SELECT w.wnama AS kgudang , b.bkode , b.bnama , isw.stok , b.bsatuan FROM m1_item_stock_warehouse isw JOIN m1_item b ON isw.idbarang = b.bid JOIN m1_warehouse w ON isw.kgudang = w.wkode WHERE isw.stok < 0 ORDER BY isw.kgudang , isw.idbarang;

-- RID=1452 | MENU=76 | ITEM=2 | RQUERY=1 | NAME=Laporan Stok Minus | FILE=stokminus2
SELECT bid, bkode, bnama, total, bstok, bhppaverage FROM (SELECT bid, bkode, bnama, sum(sid.jml) as total, bstok, bhppaverage FROM m5_si_detail sid JOIN m5_si si ON si.siid = sid.idsi JOIN m1_item it ON it.bid = sid.idbarang WHERE si.sistatus = 0 GROUP BY sid.idbarang ) AS test WHERE bstok < total;

-- RID=3001 | MENU=77 | ITEM=1 | RQUERY=2 | NAME=Stock Out | FILE=Stock_Out
SELECT pkategori as kategoripos, pkategorinama as kategoriposnama, pgudang as gudang, pgudangnama as gudangnama, psaldoawal as jmlstokout, pmasuk as jmlitem, pkeluar as jmlhari, pcustomdate1 as tanggal FROM M2r_Persediaan ORDER BY pkategori, pgudang, pcustomdate1;

-- RID=50000557 | MENU=78 | ITEM=1 | RQUERY=1 | NAME=Daftar Pembayaran Piutang POS (PPV) | FILE=PPVGLOBAL
SELECT ppv.ppvtotalap , ppv.ppvbayar , k.knama AS ppvcustomer , ppv.ppvuraian , ppv.ppvtgl , ppv.ppvnotransaksi , st.nama AS ppvstatus , ppvd.sumber , CASE ppvd.sumber WHEN "SI" THEN si.sinotransaksi WHEN "IP" THEN ip.ipnotransaksi END AS notransaksi , CASE ppvd.sumber WHEN "SI" THEN si.sitgl WHEN "IP" THEN ip.iptgl END AS tgl , ppvd.totaltransaksi , ppvd.terbayar , ppvd.jmlbayar , ppvd.catatan FROM m_12_ppv ppv JOIN m1_contact k ON ppv.ppvcustomer = k.kid JOIN m0_status st ON ppv.ppvstatus = st.kode JOIN m_12_ppv_detail ppvd ON ppv.ppvid = ppvd.idppv LEFT JOIN m5_si si ON (ppvd.idtransaksi = si.siid AND ppvd.sumber = si.sisumber ) LEFT JOIN m5_ip ip ON (ppvd.idtransaksi = ip.ipid AND ppvd.sumber = ip.ipsumber ) ORDER BY ppv.ppvtgl ASC , ppv.ppvid ASC , ppvd.urutan ASC;

-- RID=50000558 | MENU=78 | ITEM=2 | RQUERY=1 | NAME=Pembayaran Piutang POS (PPV) | FILE=PPVDETAIL1
SELECT ppv.ppvtotalap , ppv.ppvbayar , k.knama AS ppvcustomer , ppv.ppvuraian , ppv.ppvtgl , ppv.ppvnotransaksi , st.nama AS ppvstatus , ppvd.sumber , CASE ppvd.sumber WHEN "SI" THEN si.sinotransaksi WHEN "IP" THEN ip.ipnotransaksi END AS notransaksi , CASE ppvd.sumber WHEN "SI" THEN si.sitgl WHEN "IP" THEN ip.iptgl END AS tgl , ppvd.totaltransaksi , ppvd.terbayar , ppvd.jmlbayar , ppvd.catatan FROM m_12_ppv ppv JOIN m1_contact k ON ppv.ppvcustomer = k.kid JOIN m0_status st ON ppv.ppvstatus = st.kode JOIN m_12_ppv_detail ppvd ON ppv.ppvid = ppvd.idppv LEFT JOIN m5_si si ON (ppvd.idtransaksi = si.siid AND ppvd.sumber = si.sisumber ) LEFT JOIN m5_ip ip ON (ppvd.idtransaksi = ip.ipid AND ppvd.sumber = ip.ipsumber ) ORDER BY ppv.ppvtgl ASC , ppv.ppvid ASC , ppvd.urutan ASC;

-- RID=50000559 | MENU=78 | ITEM=3 | RQUERY=1 | NAME=Pembayaran Piutang POS (PPV) | FILE=PPVDETAIL2
SELECT ppv.ppvtotalap , ppv.ppvbayar , k.knama AS ppvcustomer , ppv.ppvuraian , ppv.ppvtgl , ppv.ppvnotransaksi , st.nama AS ppvstatus , ppvd.sumber , CASE ppvd.sumber WHEN "SI" THEN si.sinotransaksi WHEN "IP" THEN ip.ipnotransaksi END AS notransaksi , CASE ppvd.sumber WHEN "SI" THEN si.sitgl WHEN "IP" THEN ip.iptgl END AS tgl , ppvd.totaltransaksi , ppvd.terbayar , ppvd.jmlbayar , ppvd.catatan FROM m_12_ppv ppv JOIN m1_contact k ON ppv.ppvcustomer = k.kid JOIN m0_status st ON ppv.ppvstatus = st.kode JOIN m_12_ppv_detail ppvd ON ppv.ppvid = ppvd.idppv LEFT JOIN m5_si si ON (ppvd.idtransaksi = si.siid AND ppvd.sumber = si.sisumber ) LEFT JOIN m5_ip ip ON (ppvd.idtransaksi = ip.ipid AND ppvd.sumber = ip.ipsumber ) ORDER BY ppv.ppvtgl ASC , ppv.ppvid ASC , ppvd.urutan ASC;

-- RID=50000561 | MENU=81 | ITEM=1 | RQUERY=1 | NAME=Laporan Tagihan Per Kategori Customer | FILE=cicilan
SELECT si.sitgl , si.sitgljatuhtempo , kk.cckode , kk.ccnama , k.kkode , k.knama , k2.kkode, k2.knama, SUM(CASE sii.angsuranke WHEN 1 THEN jumlah END)AS angsuranke1 , SUM(CASE sii.angsuranke WHEN 2 THEN jumlah END) AS angsuranke2 , SUM(CASE sii.angsuranke WHEN 3 THEN jumlah END) AS angsuranke3 , SUM(sii.jumlah) AS total FROM m5_si si JOIN m1_contact k ON si.sicustomer = k.kid JOIN m1_customer_category kk ON k.kkategoricustomer = kk.cckode JOIN m5_si_installment sii ON si.siid = sii.idsi JOIN m1_contact k2 ON si.sibagianpenjualan = k2.kid GROUP BY k.kkategoricustomer ASC , k.kid ASC ORDER BY k.kkategoricustomer ASC , k.kid ASC;

-- RID=50000578 | MENU=83 | ITEM=1 | RQUERY=1 | NAME=Sales By Brand Per Store | FILE=sales_by_brand_per_store
SELECT b.bamerk , si.silokasi , l.lnama , sid.idbarang , b.bkode , b.bnama , SUM(sid.jml) AS jml , sid.harga , SUM(sid.jml * sid.harga) AS total , b.bsatuan AS satuan FROM m5_si si JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_item b ON sid.idbarang = b.bid JOIN m1_location l ON si.silokasi = l.lkode WHERE si.sistatus IN(2,3,4,7) GROUP BY b.bamerk ASC , si.silokasi ASC , sid.idbarang ASC ORDER BY b.bamerk ASC , si.silokasi ASC , SUM(sid.jml) ASC , sid.idbarang ASC;

-- RID=50000579 | MENU=83 | ITEM=2 | RQUERY=1 | NAME=Sales By Advisor Per Store | FILE=sales_by_advisor_per_store
SELECT k.kkode AS kodesalesman , k.knama AS namasalesman , si.sitgl , b.bamerk , si.silokasi , l.lnama , sid.idbarang , b.bkode , b.bnama , SUM(sid.jml) AS jml , sid.harga , SUM(sid.jml * sid.harga) AS total , b.bsatuan AS satuan FROM m5_si si JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_item b ON sid.idbarang = b.bid JOIN m1_location l ON si.silokasi = l.lkode JOIN m1_contact k ON si.sibagianpenjualan = k.kid WHERE si.sistatus IN(2,3,4,7) GROUP BY si.sibagianpenjualan ASC , si.silokasi ASC , sid.idbarang ASC ORDER BY si.sibagianpenjualan ASC , si.silokasi ASC , SUM(sid.jml) ASC , sid.idbarang ASC;

-- RID=50000580 | MENU=83 | ITEM=3 | RQUERY=1 | NAME=Top 10 Sales By Advisor Terbaik All Store | FILE=top_10 _by_advisor_terbaik_all_store
SELECT k.kkode AS kodesalesman , k.knama AS namasalesman , si.sitgl , SUM(sid.jml) AS jml , sid.harga , SUM(sid.jml * sid.harga) AS total FROM m5_si si JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_contact k ON si.sibagianpenjualan = k.kid WHERE si.sistatus IN(2,3,4,7) GROUP BY si.sibagianpenjualan ASC ORDER BY SUM(sid.jml * sid.harga) DESC, si.sibagianpenjualan ASC LIMIT 10;

-- RID=50000581 | MENU=83 | ITEM=4 | RQUERY=1 | NAME=Top 10 Store Dengan Sales Terbaik | FILE=top_10_store_dengan_sales_terbaik
SELECT si.silokasi , l.lnama , SUM(sid.jml) AS jml , sid.harga , SUM(sid.jml * sid.harga) AS total FROM m5_si si JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_location l ON si.silokasi = l.lkode WHERE si.sistatus IN(2,3,4,7) GROUP BY si.silokasi ASC ORDER BY SUM(sid.jml * sid.harga) DESC , si.silokasi ASC LIMIT 10;

-- RID=50000582 | MENU=83 | ITEM=5 | RQUERY=1 | NAME=Top 10 Best Seller All Store Selama 1 Bulan | FILE=top_10_best_seller_all_store_selama_1_bulan
SELECT b.bamerk , si.silokasi , l.lnama , sid.idbarang , b.bkode , b.bnama , SUM(sid.jml) AS jml , sid.harga , SUM(sid.jml * sid.harga) AS total , b.bsatuan AS satuan FROM m5_si si JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_item b ON sid.idbarang = b.bid JOIN m1_location l ON si.silokasi = l.lkode WHERE si.sistatus IN(2,3,4,7) GROUP BY sid.idbarang ASC ORDER BY SUM(sid.jml) DESC , sid.idbarang ASC;

-- RID=50000583 | MENU=83 | ITEM=6 | RQUERY=1 | NAME=Customer Terloyal Semua Lokasi | FILE=customer_terloyal
SELECT si.silokasi , l.lnama , k.kkode , k.knama , SUM(sid.jml) AS jml, COUNT(si.siid) AS nota , SUM(sid.jml * sid.harga) AS total FROM m5_si si JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_contact k ON si.sicustomer = k.kid JOIN m1_location l ON si.silokasi = l.lkode WHERE si.sistatus IN(2,3,4,7) GROUP BY si.sicustomer ASC;

-- RID=50000584 | MENU=83 | ITEM=7 | RQUERY=1 | NAME=Customer Terloyal Per Lokasi | FILE=customer_terloyal_perlokasi
SELECT si.silokasi , l.lnama , k.kkode , k.knama , SUM(sid.jml) AS jml, COUNT(si.siid) AS nota , SUM(sid.jml * sid.harga) AS total FROM m5_si si JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_contact k ON si.sicustomer = k.kid JOIN m1_location l ON si.silokasi = l.lkode WHERE si.sistatus IN(2,3,4,7) GROUP BY si.silokasi ASC, si.sicustomer;

-- RID=50000585 | MENU=83 | ITEM=8 | RQUERY=2 | NAME=Top 10 best seller per store | FILE=top_10_best_seller_per_store
SELECT * FROM m2r_top_10_best_seller_per_store;

-- RID=50000718 | MENU=83 | ITEM=9 | RQUERY=1 | NAME=Laporan Rekap Penjualan By Brand  | FILE=penjualan_per_brand
SELECT si.silokasi , l.lnama , b.bamerk , m.mkode , m.mnama , b.bkode , b.bnama , SUM(sid.jml) AS jml, sid.satuan , sid.harga , SUM(sid.jml * sid.harga) AS total FROM m5_si si JOIN m1_location l ON si.silokasi = l.lkode JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_item b ON sid.idbarang = b.bid JOIN m1_merk m ON b.bamerk = m.mkode GROUP BY si.silokasi , b.bamerk , sid.idbarang , sid.harga ORDER BY si.silokasi ASC , b.bamerk ASC, sid.idbarang ASC;

-- RID=50000719 | MENU=83 | ITEM=10 | RQUERY=1 | NAME=Laporan Penjualan Per Bank  | FILE=laporan penj per bank
SELECT si.silokasi , l.lnama , sip.bank , b.bnama , sip.carabayar , si.sitotaltransaksi FROM m5_si si JOIN m1_location l ON si.silokasi = l.lkode JOIN m5_si_pay sip ON si.siid = sip.idsi LEFT JOIN m1_bank b ON sip.bank = b.bkode ORDER BY si.silokasi ASC , sip.bank , sip.carabayar;

