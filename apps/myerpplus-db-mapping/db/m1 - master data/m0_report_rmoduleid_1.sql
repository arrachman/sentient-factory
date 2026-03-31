-- m0_report full queries for rmoduleid = 1
-- total rows: 56

-- RID=1 | MENU=3 | ITEM=1 | RQUERY=1 | NAME=Kategori Kontak | FILE=contactcategory
SELECT cckode, ccnama, cccatatan FROM m1_contact_category ORDER BY cckode;

-- RID=2 | MENU=4 | ITEM=1 | RQUERY=1 | NAME=Kategori Pelanggan | FILE=customercategory
SELECT cckode, ccnama, cccatatan FROM m1_customer_category ORDER BY cckode;

-- RID=3 | MENU=5 | ITEM=1 | RQUERY=1 | NAME=Kategori Salesman | FILE=salesmancategory
SELECT sckode, scnama, scarea, sccatatan FROM m1_salesman_category ORDER BY sckode;

-- RID=4 | MENU=6 | ITEM=1 | RQUERY=1 | NAME=Kontak | FILE=contact
SELECT k1.kid , kk.ccnama , k1.kkode , k1.knama as namacontact , k1.kaktiftgl , k1.k1kontaknohp, k1.k1kontakemail, k1.k1notelp1, k1.k1nofax, k1.k1email, k1.k1website, k1.kbatashutang, k1.kterminbeli , k1.krekhutang , k1.kbagpembelian , k1.kviabeli , k1.kterminjual , k1.krekpiutang , k1.kbagpenjualan , k1.kbataspiutang , k1.kcatatan , k1.ktgllahir , k1.knorekening , k1.kbank , k1.k1alamat1 , k1.k1alamat2, k1.k1alamat3, k1.k2alamat1, k1.k2alamat2, k1.k2alamat3, k1.knpwp, kf.namafile AS FOTO , ka.kanama , ka.kajabatan , ka.kanotelp , ka.kanofax , ka.kanohp , ka.kaemail, ks.kkode as salesmankode, ks.knama as salesmannama , k1.k1kota FROM m1_contact k1 LEFT JOIN m1_contact_category kk ON k1.kkategori = kk.cckode LEFT JOIN m1_contact_files kf ON k1.kid = kf.idkontak LEFT JOIN m1_contact_attention ka ON k1.kid = ka.kaid LEFT JOIN m1_contact ks ON k1.ksalesman = ks.kid ORDER BY k1.kkode, k1.knama;

-- RID=5 | MENU=6 | ITEM=2 | RQUERY=1 | NAME=Kontak | FILE=contactdetail
SELECT k.kid , kk.ccnama , k.kkode , k.knama , k.kaktiftgl , k.k1kontaknohp, k.k1kontakemail, k.k1notelp1, k.k1nofax, k.k1email, k.k1website, k.kbatashutang, k.kterminbeli , k.krekhutang , k.kbagpembelian , k.kviabeli , k.kterminjual , k.krekpiutang , k.kbagpenjualan , k.kbataspiutang , k.kcatatan , k.ktgllahir , k.knorekening , k.kbank , k.k1alamat1 , kf.namafile AS FOTO , ka.kanama , ka.kajabatan , ka.kanotelp , ka.kanofax , ka.kanohp , ka.kaemail , k.k1kota FROM m1_contact k LEFT JOIN m1_contact_category kk ON k.kkategori = kk.cckode LEFT JOIN m1_contact_files kf ON k.kid = kf.idkontak LEFT JOIN m1_contact_attention ka ON k.kid = ka.kaid ORDER BY k.kid;

-- RID=50000555 | MENU=6 | ITEM=3 | RQUERY=1 | NAME=Harga Jual Per Kontak | FILE=hargajualperkontak
SELECT c.kkategoricustomer as customerkategori, cc.ccnama as customerkategorinama, c.kid as customerid, c.kkode as customerkode, c.knama as customernama, c.k1alamat1 as customeralamat1, c.k1alamat2 as customeralamat2, i.bid as barangid, i.bkode as barangkode, i.bnama as barangnama, i.bsatuan as barangsatuan, cp.khhargajual as hargajual, c.k1kota FROM m1_contact c JOIN m1_contact_price cp ON c.kid = cp.khidkontak JOIN m1_item i ON cp.khidbarang = i.bid LEFT JOIN m1_customer_category cc ON c.kkategoricustomer = cc.cckode ORDER BY c.kkategoricustomer, c.kkode, i.bkode;

-- RID=6 | MENU=7 | ITEM=1 | RQUERY=1 | NAME=Lokasi Barang | FILE=itemlocation
SELECT ilkode, ilnama, il.ilkode, il.ilnama, w.wnama FROM m1_item_location il JOIN m1_warehouse w ON il.ilgudang = w.wkode ORDER BY il.ilkode;

-- RID=7 | MENU=8 | ITEM=1 | RQUERY=1 | NAME=Kategori Barang | FILE=itemcategory
SELECT ickode, icnama, iccatatan FROM m1_item_category ORDER BY ickode;

-- RID=8 | MENU=9 | ITEM=1 | RQUERY=1 | NAME=Tipe Barang | FILE=itemtype
SELECT itkode, itnama, itcatatan FROM m1_item_type ORDER BY itkode;

-- RID=113 | MENU=10 | ITEM=1 | RQUERY=1 | NAME=Satuan | FILE=unit
SELECT ukode, unama, unilai, uketerangan, uindexbarcode FROM m1_unit ORDER BY ukode;

-- RID=114 | MENU=11 | ITEM=1 | RQUERY=1 | NAME=Barang | FILE=item
SELECT b.burutan, b.bnama AS namabarang, b.bsatuan AS satuanbarang, b.bkode AS kodebarang, b.btipe, bk.icnama AS kategoribarang, g.wnama AS gudang, blg.blgnamalokasi, b.bstok, k.knama AS namasuplier, b.bgambar, (b.bhargajual1) AS hargajual1, (b.bhargabeli) AS hargabeli, (b.bhargajual2) AS hargajual2, (b.bhargajual3) AS hargajual3, (b.bhargajual4) AS hargajual4, (b.bhargajual5) AS hargajual5, (b.bdiskonjual1) AS diskonjual, (b.bstokminimal) AS stokminimal, (b.bstokmaksimal) AS stokmaksimal, (b.breorder) AS jumlahorder, (b.bhppaverage) AS hppaverage, (b.bjmlorderbeli) AS jmlorderbeli, (b.bjmlorderjual) AS orderpenjualan, (b.brekpersediaan) AS persediaan, brekhargapokok, (b.brekpenjualan) AS penjualan, (b.brekreturpenjualan) AS returpenjualan, (b.brekreturpembelian) AS returpembelian, (b.brekdiskonpembelian) AS diskonpembelian, brekdiskonpenjualan, brekkonsinyasi, (b.bstok) AS stokgudang, CASE bjenis WHEN 'P' THEN 'Persediaan' WHEN 'A' THEN 'Assembly' WHEN 'J' THEN 'Jasa' WHEN 'D' THEN 'Pretelan' WHEN 'K' THEN 'Konsinyasi' ELSE 'Jenis Barang Tidak Ada' END AS jenis , CASE bhpp WHEN 'R' THEN 'Average' WHEN 'F' THEN 'Fifo' WHEN 'L' THEN 'Lilo' WHEN 'I' THEN 'Identifikasi Khusus' END AS hpp , CASE bstatusmoving WHEN 'F' THEN 'Fast' WHEN 'M' THEN 'Medium' WHEN 'S' THEN 'Slow' WHEN 'D' THEN 'Dead' ELSE '-' END AS status, u.unama AS satuan, bdivisi, bsatuandefault, bkelasproduk, binputtgl, user.unama as binputusernama, b.bsection, bdepartemen, cp.cpnama as bkelasproduknama, bsubdepartemen, bsubdivisi, bgudang, bproyek FROM m1_item b left join m0_user user on b.binputuser=user.userid LEFT JOIN m1_item_category bk ON (b.bkategori = bk.ickode) LEFT JOIN m1_item_location_warehouse blg ON (b.bid = blg.blgidbarang) LEFT JOIN m1_warehouse g ON (blg.blggudang = g.wkode) LEFT JOIN m1_contact k ON (b.bsuplier = k.kid) LEFT JOIN m1_unit u ON b.bsatuan = u.ukode LEFT JOIN m1_class_product cp ON b.bkelasproduk = cp.cpkode ORDER BY b.bkode, b.burutan;

-- RID=115 | MENU=11 | ITEM=2 | RQUERY=1 | NAME=Rpt Barang | FILE=itemdetail
SELECT b.bkategori , blg.blggudang , b.burutan, b.bnama AS 'namabarang', b.bkode AS 'kodebarang', g.wnama AS 'gudang', b.btipe, blg.blgnamalokasi, bk.ickode AS 'kategoribarang', bk.icnama AS namakategoribarang, (b.bhargajual1) AS 'hrgajual1', sum(b.bstok) AS stok , b.bsatuan , CASE bjenis WHEN 'P' THEN 'persediaan' WHEN 'A' THEN 'Assembly' WHEN 'J' THEN 'Jasa' WHEN 'D' THEN 'Pretelan' WHEN 'K' THEN 'Konsinyasi' ELSE 'null' END AS jenis, bdepartemen, bkelasproduk, cp.cpnama as bkelasproduknama, bdivisi, bsubdepartemen, bsubdivisi, bgudang, bproyek FROM m1_item b LEFT JOIN m1_item_category bk ON (b.bkategori = bk.ickode) LEFT JOIN m1_item_location_warehouse blg ON (b.bid = blg.blgidbarang) LEFT JOIN m1_warehouse g ON (blg.blggudang = g.wkode) LEFT JOIN m1_class_product cp ON b.bkelasproduk = cp.cpkode GROUP BY b.bkategori , b.bjenis , blg.blggudang , b.bkode, b.bhargajual1 , blg.blgnamalokasi ORDER BY blg.blggudang , b.bkode, b.burutan;

-- RID=1173 | MENU=11 | ITEM=3 | RQUERY=1 | NAME=Label Harga | FILE=LABEL
SELECT b.bnama , b.bkode , b.bhargajual1, bdepartemen, bkelasproduk, cp.cpnama as bkelasproduknama, bdivisi, bsubdepartemen, bsubdivisi, bgudang, bproyek FROM m1_item b LEFT JOIN m1_class_product cp ON b.bkelasproduk = cp.cpkode ORDER BY b.bkode , b.bnama;

-- RID=694 | MENU=11 | ITEM=4 | RQUERY=1 | NAME=Barang Khusus | FILE=barangkhusus
SELECT it.notransaksi, it.tgl, it.namabarang, i.bkode, (CASE WHEN it.jenismutasi = 1 THEN it.jmlbarang ELSE 0 END) AS jmlmasuk, (CASE WHEN it.jenismutasi = 0 THEN it.jmlbarang ELSE 0 END) AS jmlkeluar, k.kkode, k.knama, it.harga, it.hpp, it.hppfix, it.catatan, it.catatandetail, bdepartemen, bdivisi, bsubdepartemen, bsubdivisi, bgudang, bproyek FROM m1_item_transaction it JOIN m1_item i ON it.idbarang = i.bid JOIN m1_contact k ON it.kontak = k.kid ORDER BY notransaksi, tgl;

-- RID=1361 | MENU=11 | ITEM=5 | RQUERY=2 | NAME=Harga Jual Dibawah Margin | FILE=hargajualdibawahmargin
SELECT * FROM m2r_barang_dibawah_margin ORDER BY kodebarang;

-- RID=516 | MENU=11 | ITEM=6 | RQUERY=1 | NAME=Daftar Barang | FILE=DaftarBarang
SELECT b.bkategori , ic.icnama , b.bkode AS kodebarang, b.bnama AS namabarang, IFNULL(isw.stok,0) as bstok, b.bsatuan, b.bsatuan AS satuan, IFNULL(blg.blgnamalokasi,'') as blgnamalokasi, IFNULL(blg.blgkodelokasi,'') as blokasi, IFNULL(g.wnama,'') as wnama, IFNULL(isw.kgudang,'') as bgudang, bdivisi, bsatuandefault, bkelasproduk, bdepartemen, b.baukuran, b.bamodel as banozzle, cp.cpnama as bkelasproduknama, bsubdepartemen, bsubdivisi, bsubdivisi, bproyek FROM m1_item b LEFT JOIN m1_item_stock_warehouse isw ON b.bid = isw.idbarang LEFT JOIN m1_item_location_warehouse blg ON b.bid = blg.blgidbarang AND isw.kgudang = blg.blggudang LEFT JOIN m1_warehouse g ON isw.kgudang = g.wkode JOIN m1_item_category ic ON b.bkategori = ic.ickode LEFT JOIN m1_class_product cp ON b.bkelasproduk = cp.cpkode ORDER BY b.bkategori , b.bkode , b.bnama , isw.kgudang, blg.blgkodelokasi;

-- RID=3000 | MENU=11 | ITEM=7 | RQUERY=1 | NAME=Harga Barang | FILE=barang_detail
SELECT b.bkategori , b.bkode , b.bnama , b.bhargajual1 , b.bhargajual2 , b.bhargajual3, b.bhargajual4 , b.bhargajual5, bdepartemen , bkelasproduk, cp.cpnama as bkelasproduknama, bdivisi, bsubdepartemen, bsubdivisi, bgudang, bproyek FROM m1_item b LEFT JOIN m1_item_category bk ON (b.bkategori = bk.ickode) LEFT JOIN m1_class_product cp ON b.bkelasproduk = cp.cpkode ORDER BY b.bkategori , b.bjenis , b.bkode;

-- RID=3012 | MENU=11 | ITEM=8 | RQUERY=1 | NAME=Barang Detail | FILE=itemdetail_divisi
SELECT d.dnama AS bdivisi , depart.dpnama AS bdepartemen , subdep.sdpnama AS bsubdepartemen , b.bkategori , blg.blggudang , b.burutan, b.bnama AS 'namabarang', b.bkode AS 'kodebarang', g.wnama AS 'gudang', b.btipe, blg.blgnamalokasi, bk.ickode AS 'kategoribarang', bk.icnama AS namakategoribarang, (b.bhargajual1) AS 'hrgajual1', b.bstok AS stok , b.bsatuan , CASE bjenis WHEN 'P' THEN 'persediaan' WHEN 'A' THEN 'Assembly' WHEN 'J' THEN 'Jasa' WHEN 'D' THEN 'Pretelan' WHEN 'K' THEN 'Konsinyasi' ELSE 'null' END AS jenis, bdepartemen , bkelasproduk, cp.cpnama as bkelasproduknama, bsubdivisi, bgudang, bproyek FROM m1_item b LEFT JOIN m1_item_category bk ON (b.bkategori = bk.ickode) LEFT JOIN m1_item_location_warehouse blg ON (b.bid = blg.blgidbarang) LEFT JOIN m1_warehouse g ON (blg.blggudang = g.wkode) LEFT JOIN m1_division d ON b.bdivisi = d.dkode LEFT JOIN m1_department depart on b.bdepartemen = depart.dpkode LEFT JOIN m1_subdepartment subdep ON b.bsubdepartemen = subdep.sdpkode LEFT JOIN m1_class_product cp ON b.bkelasproduk = cp.cpkode ORDER BY b.bdivisi , b.bdepartemen , b.bsubdepartemen , b.bkategori , b.bjenis , blg.blggudang;

-- RID=50003823 | MENU=11 | ITEM=9 | RQUERY=1 | NAME=Item Data | FILE=Item Data
SELECT i.bid, i.bkode, i.bnama, i.btipe, i.bjenis, i.bsatuan, i.bkategori, ic.icnama as bkategorinama, i.bstokminimal, i.bstokmaksimal, i.breorder, i.bminorder, i.bapanjang, i.balebar, i.batinggi, i.bavolume, i.baberat, i.bawarna, i.baoem, i.bamerk, i.baukuran, i.bamodel as banozzle, i.bdesigner, i.bmaterial, i.bsection, i.bvendor, i.bjmllapangan as bkonversikgpcs, i.bsatuanlapangan, i.bretur, i.bserial, i.bbatch, i.brekpersediaan, c1.cnama as brekpersediaannama, i.brekpenjualan, c2.cnama as brekpenjualannama, i.brekreturpenjualan, c3.cnama as brekreturpenjualannama, i.brekdiskonpenjualan, c4.cnama as brekdiskonpenjualannama, i.brekhargapokok, c5.cnama as brekhargapokoknama, i.brekreturpembelian, c6.cnama as brekreturpembeliannama, i.brekdiskonpembelian, c7.cnama as brekdiskonpembeliannama, i.brekkonsinyasi, c8.cnama as brekkonsinyasinama, i.binputtgl, i.bmodifikasitgl, i.bnamaalias5 as notesrc, i.bcustom1 as min1, i.bcustom2 as max1, i.bcustom3 as min2, i.bcustom4 as max2, i.bkelasproduk, cp.cpnama as bkelasproduknama, i.bdivisi, i.bsubdepartemen, i.bsubdivisi, i.bgudang, i.bproyek, i21.bid as bmouldfinish, i21.bkode as bmouldfinishkode, i21.bnama as bmouldfinishnama, i22.bid as bmouldsemi1, i22.bkode as bmouldsemi1kode, i22.bnama as bmouldsemi1nama, i23.bid as bmouldsemi2, i23.bkode as bmouldsemi2kode, i23.bnama as bmouldsemi2nama FROM m1_item i LEFT JOIN m1_item_category ic ON i.bkategori = ic.ickode LEFT JOIN m1_coa c1 ON c1.cnomor = i.brekpersediaan LEFT JOIN m1_coa c2 ON c2.cnomor = i.brekpenjualan LEFT JOIN m1_coa c3 ON c3.cnomor = i.brekreturpenjualan LEFT JOIN m1_coa c4 ON c4.cnomor = i.brekdiskonpenjualan LEFT JOIN m1_coa c5 ON c5.cnomor = i.brekhargapokok LEFT JOIN m1_coa c6 ON c6.cnomor = i.brekreturpembelian LEFT JOIN m1_coa c7 ON c7.cnomor = i.brekdiskonpembelian LEFT JOIN m1_coa c8 ON c8.cnomor = i.brekkonsinyasi LEFT JOIN m1_class_product cp ON i.bkelasproduk = cp.cpkode LEFT JOIN m1_item i21 ON i.bcustom21 = i21.bid LEFT JOIN m1_item i22 ON i.bcustom22 = i22.bid LEFT JOIN m1_item i23 ON i.bcustom23 = i23.bid ORDER BY i.bkategori, i.bkode;

-- RID=50003833 | MENU=11 | ITEM=10 | RQUERY=1 | NAME=Label QRCode | FILE=labelpci2
SELECT DATE(NOW()) as ritgl, 'Master' as rinotransaksi, i.bkode, i.bnama, 1 as jml, n.angka FROM m1_item i JOIN m0_number n ORDER BY i.bkode, n.angka;

-- RID=50003834 | MENU=11 | ITEM=11 | RQUERY=1 | NAME=Label QRCode | FILE=labelpci2
SELECT DATE(NOW()) as ritgl, isw.kgudang as rinotransaksi, i.bkode, i.bnama, isw.stok as jml, n.angka FROM m1_item i JOIN m1_item_stock_warehouse isw ON i.bid = isw.idbarang AND isw.stok <> 0 JOIN m0_number n ON n.angka <= isw.stok ORDER BY i.bkode, isw.kgudang, n.angka;

-- RID=116 | MENU=12 | ITEM=1 | RQUERY=1 | NAME=Akun | FILE=coa
SELECT m1_coa.cnama, m1_coa.cnomor, m1_coa.cnamaalias1, m1_coa.cmatauang FROM m1_coa ORDER BY cnomor;

-- RID=1125 | MENU=12 | ITEM=2 | RQUERY=1 | NAME=Akun  | FILE=coa2
SELECT c.cnomor , c.cnama , c.cnamaalias1, c.cmatauang , c.clevel FROM m1_coa c ORDER BY cnomor;

-- RID=117 | MENU=13 | ITEM=1 | RQUERY=1 | NAME=Cabang | FILE=branch
SELECT bkode, bnama FROM m1_branch ORDER BY bkode;

-- RID=118 | MENU=14 | ITEM=1 | RQUERY=1 | NAME=Lokasi | FILE=location
SELECT lkode, lnama, lcabang, lcatatan, bnama AS cabang FROM m1_location JOIN m1_branch ON m1_location.lcabang = m1_branch.bkode;

-- RID=119 | MENU=15 | ITEM=1 | RQUERY=1 | NAME=Gudang | FILE=warehouse
SELECT m1_warehouse.wkode, m1_warehouse.wnama, m1_warehouse.walamat1, m1_warehouse.walamat2, m1_warehouse.wketerangan FROM m1_warehouse;

-- RID=120 | MENU=16 | ITEM=1 | RQUERY=1 | NAME=Divisi | FILE=division
SELECT dkode, dnama, dcatatan FROM m1_division;

-- RID=121 | MENU=17 | ITEM=1 | RQUERY=1 | NAME=Sub Divisi | FILE=subdivision
SELECT sdkode, d.dnama AS divisi, sdnama, sdcatatan FROM m1_subdivision sd JOIN m1_division d ON sd.sddivisi = d.dkode;

-- RID=122 | MENU=18 | ITEM=1 | RQUERY=1 | NAME=Proyek | FILE=project
SELECT pkode, pnama, pketerangan FROM m1_project;

-- RID=123 | MENU=19 | ITEM=1 | RQUERY=1 | NAME=Cost Center | FILE=costcenter
SELECT cc.cckode, cc.ccnama, d.dnama AS divisi, cc.ccakun, cc.cccatatan FROM m1_cost_center cc JOIN m1_division d ON (cc.ccdivisi = d.dkode);

-- RID=124 | MENU=20 | ITEM=1 | RQUERY=1 | NAME=Termin | FILE=terms
SELECT * FROM m1_terms;

-- RID=125 | MENU=21 | ITEM=1 | RQUERY=1 | NAME=Pajak | FILE=tax
SELECT tkode, tnama, tnilai, tcatatan FROM m1_tax;

-- RID=126 | MENU=22 | ITEM=1 | RQUERY=1 | NAME=Mata Uang | FILE=currency
SELECT ckode, cnama, csimbol, ckurs, ccatatan FROM m1_currency;

-- RID=127 | MENU=23 | ITEM=1 | RQUERY=1 | NAME=Bank | FILE=bank
SELECT bnk.bkode, bnk.bnama FROM m1_bank bnk ORDER BY bnk.bkode;

-- RID=128 | MENU=24 | ITEM=1 | RQUERY=1 | NAME=Catatan Transaksi | FILE=transactionnote
SELECT tnsumber, tnkode, tncatatan FROM m1_transaction_note ORDER BY tnkode;

-- RID=129 | MENU=25 | ITEM=1 | RQUERY=1 | NAME=Negara | FILE=country
SELECT ckode, cnama, ccatatan FROM m1_country;

-- RID=130 | MENU=26 | ITEM=1 | RQUERY=1 | NAME=Propinsi | FILE=province
SELECT pkode, pnama, pcatatan FROM m1_province;

-- RID=131 | MENU=27 | ITEM=1 | RQUERY=1 | NAME=Kota | FILE=city
SELECT ckode, cnama FROM m1_city ORDER BY ckode;

-- RID=132 | MENU=28 | ITEM=1 | RQUERY=1 | NAME=Wilayah | FILE=area
SELECT a.akode , a.anama FROM m1_area a;

-- RID=133 | MENU=29 | ITEM=1 | RQUERY=1 | NAME=Ekspedisi | FILE=expedition
SELECT e.ekode, e.ealamat, e.etelp, e.enama, e.ekota FROM m1_expedition e;

-- RID=134 | MENU=30 | ITEM=1 | RQUERY=1 | NAME=Tipe Penyesuaian Stok | FILE=stocksadjustmenttype
SELECT tsakode, tsanama, c.cnama, tsacatatan FROM m1_type_sa ts JOIN m1_coa c ON ts.tsarek = c.cnomor;

-- RID=135 | MENU=31 | ITEM=1 | RQUERY=1 | NAME=Biaya Lain | FILE=othercost
SELECT ockode, ocnama, ocrekjual, ocrekbeli FROM m1_other_cost;

-- RID=136 | MENU=32 | ITEM=1 | RQUERY=1 | NAME=Lain-Lain | FILE=other
SELECT okode, onama, CASE ojenis WHEN 0 THEN 'Aplication' WHEN 1 THEN 'Grup' WHEN 2 THEN 'Class' WHEN 3 THEN 'Lokasi' WHEN 4 THEN 'Merk' WHEN 5 THEN 'Status' WHEN 6 THEN 'Tipe' WHEN 7 THEN 'Kendaraan' WHEN 8 THEN 'Metode Pengiriman' WHEN 9 THEN 'Model' WHEN 10 THEN 'Transportasi' WHEN 11 THEN 'Size' ELSE 'Colour' END AS jenis, ocatatan FROM m1_other ORDER BY okode;

-- RID=198 | MENU=33 | ITEM=1 | RQUERY=1 | NAME=Catatan Transaksi Detail | FILE=transactionnotedetail
SELECT tndsumber, tndkode, tndcatatan FROM m1_transaction_note_detail;

-- RID=474 | MENU=34 | ITEM=1 | RQUERY=1 | NAME=Estimasi Kerja | FILE=estimasikerja
SELECT * FROM m1_working_estimate;

-- RID=475 | MENU=35 | ITEM=1 | RQUERY=1 | NAME=Kategori Produksi | FILE=kategoriproduksi
SELECT * FROM m1_production_category;

-- RID=473 | MENU=70 | ITEM=1 | RQUERY=1 | NAME=Kategori Pemasok | FILE=kategoripemasok
SELECT * FROM m1_supplier_category;

-- RID=693 | MENU=73 | ITEM=1 | RQUERY=1 | NAME=Informasi Barang | FILE=informasi barang
sql FROM rfrom;

-- RID=804 | MENU=74 | ITEM=1 | RQUERY=1 | NAME=Laporan Barang Haulingaa | FILE=baranghauling
SELECT m1_item_hauling.bkode, m1_item_hauling.bnama, m1_item_hauling.bsatuan, m1_item_hauling.bsatuandefault, m1_item_hauling.btipe, m1_item_hauling.bahourmeter FROM m1_item_hauling ORDER BY bkode;

-- RID=805 | MENU=75 | ITEM=1 | RQUERY=1 | NAME=Laporan Kategori Pengecekan | FILE=kategoripengecekan
SELECT m1_checking_category.ccurutan, m1_checking_category.ccnama, m1_checking_category.cccatatan FROM m1_checking_category ORDER BY m1_checking_category.ccurutan ASC;

-- RID=867 | MENU=78 | ITEM=1 | RQUERY=1 | NAME=Laporan Poin Penjualan | FILE=sellingpoint
SELECT m1_selling_point.spkode, m1_selling_point.spnama, m1_selling_point.spjmlbarang, m1_selling_point.sppoint, m1_selling_point.spcatatan FROM m1_selling_point ORDER BY spkode;

-- RID=1094 | MENU=84 | ITEM=1 | RQUERY=1 | NAME=Departemen | FILE=Departemen
SELECT dp.dpkode , dp.dpnama , d.dnama , sd.sdnama , dp.dpcatatan FROM m1_department dp JOIN m1_division d ON dp.dpdivisi = d.dkode JOIN m1_subdivision sd ON dp.dpsubdivisi = sd.sdkode ORDER BY dp.dpkode;

-- RID=1095 | MENU=85 | ITEM=1 | RQUERY=1 | NAME=Sub Departemen | FILE=SubDepartemen
SELECT sdp.sdpkode , sdp.sdpnama , dp.dpnama , sdp.sdpcatatan FROM m1_subdepartment sdp JOIN m1_department dp ON sdp.sdpdepartemen = dp.dpkode ORDER BY sdp.sdpkode;

-- RID=1100 | MENU=88 | ITEM=1 | RQUERY=1 | NAME=Komisi | FILE=komisi
SELECT km.kmkode , km.kmnama , km.kmketerangan, CASE kmd.kmdoperator WHEN 0 THEN "Antara" WHEN 1 THEN "Lebih Dari Samadengan" WHEN 2 THEN "Kelipatan" END AS kmdoperator , kmd.kmdjml1 , kmd.kmdjml2, CASE kmd.kmdkriterianilai WHEN 0 THEN "Nominal" WHEN 1 THEN "Persen" END AS kmdkriterianilai, kmd.kmdnilai FROM m1_commission km JOIN m1_commission_detail kmd ON km.kmkode = kmd.kmdkodekomisi ORDER BY km.kmkode, kmd.kmdoperator, kmd.kmdjml1;

-- RID=1101 | MENU=90 | ITEM=1 | RQUERY=1 | NAME=Laporan Kategori Harga | FILE=pricekategori
SELECT pc.pckode , pc.pcnama , pc.pccatatan , b.bkode , b.bnama , pcd.pcdhargajual1 , pcd.pcdhargajual2, pcd.pcdhargajual3, pcd.pcdhargajual4, pcd.pcdhargajual5 , pcd.pcddiskonjual1 , pcd.pcddiskonjual2 , pcd.pcddiskonjual3 , pcd.pcddiskonjual4, pcd.pcddiskonjual5 FROM m1_price_category pc JOIN m1_price_category_detail pcd ON pc.pckode = pcd.pcdkategori JOIN m1_item b ON pcd.pcdidbarang = b.bid ORDER BY pc.pckode;

-- RID=1111 | MENU=90 | ITEM=2 | RQUERY=1 | NAME=Daftar Harga | FILE=Daftar_Harga_alamindo
SELECT dp.dpnama AS bdepartemen , sdp.sdpnama AS bsubdepartemen , b.bkode , b.bnama , b.bcustom4 * 1 AS krt, b.bcustom5 * 1 AS lsn, b.bhargajual1 AS pcs FROM m1_item b JOIN m1_department dp ON b.bdepartemen = dp.dpkode JOIN m1_subdepartment sdp ON b.bsubdepartemen = sdp.sdpkode ORDER BY b.bdepartemen ASC , b.bsubdepartemen ASC , b.bkode ASC;

