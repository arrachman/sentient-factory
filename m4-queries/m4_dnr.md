# M4_DNR Queries

## Query 1

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
DELETE FROM M4_Dnr WHERE dnrid='{idtransaksi}'
```

## Query 2

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
DELETE FROM M4_Dnr_Detail WHERE iddnr='{idtransaksi}'
```

## Query 3

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
DELETE FROM m1_item_transaction WHERE sumber = '{sumber}' AND idutama = '{idtransaksi}'
```

## Query 4

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
DELETE FROM m1_no_batch_in WHERE nbisumber = '{sumber}' AND nbiidtransaksi = '{idtransaksi}'
```

## Query 5

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
DELETE FROM m1_no_batch_out WHERE nbosumber = '{sumber}' AND nboidtransaksi = '{idtransaksi}'
```

## Query 6

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
DELETE FROM m1_no_serial_in WHERE nsisumber = '{sumber}' AND nsiidtransaksi = '{idtransaksi}'
```

## Query 7

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
DELETE FROM m1_no_serial_out WHERE nsosumber = '{sumber}' AND nsoidtransaksi = '{idtransaksi}'
```

## Query 8

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
Delete from M1_No_Batch_Transaction where nbtidtransaksi = '{idtransaksi}' AND nbtsumber = '{sumber}'
```

## Query 9

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
Delete from M1_No_Batch_Transaction where nbtidtransaksi = '{result_4}' AND nbtsumber = 'DNR'
```

## Query 10

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
Delete from M1_No_Serial_Transaction where nstidtransaksi = '{idtransaksi}' AND nstsumber = '{sumber}'
```

## Query 11

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
Delete from M1_No_Serial_Transaction where nstidtransaksi = '{result_4}' AND nstsumber = 'DNR'
```

## Query 12

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
Delete from M4_Dnr_Detail where iddnr = '{result_4}'
```

## Query 13

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
Delete from M7_Asset_Transaction where atidutama = '{idtransaksi}' AND atsumber = '{sumber}'
```

## Query 14

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
Delete from M7_Asset_Transaction where atidutama = '{result_4}' AND atsumber = 'DNR'
```

## Query 15

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
INSERT INTO m1_item_stock_warehouse (idbarang, kgudang, stok) VALUES {updStokIn} ON DUPLICATE KEY UPDATE stok = stok + VALUES(stok)
```

## Query 16

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
INSERT INTO m1_item_stock_warehouse (idbarang, kgudang, stok) VALUES {updStokOut} ON DUPLICATE KEY UPDATE stok = stok + VALUES(stok)
```

## Query 17

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr_history.vb`

```sql
INSERT INTO m1_no_batch_transaction_history(SELECT 0, '{result_4}', nb.* FROM m1_no_batch_transaction nb WHERE nb.nbtidtransaksi = '{idtransaksi}' and nb.nbtsumber = 'DNR')
```

## Query 18

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr_history.vb`

```sql
INSERT INTO m1_no_serial_transaction_history(SELECT 0, '{result_4}', ns.* FROM m1_no_serial_transaction ns WHERE ns.nstidtransaksi = '{idtransaksi}' and ns.nstsumber = 'DNR')
```

## Query 19

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr_history.vb`

```sql
INSERT INTO m4_dnr_detail_history (SELECT 0, '{result_4}', dnr.* FROM m4_dnr_detail dnr WHERE dnr.iddnr = '{idtransaksi}' )
```

## Query 20

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr_history.vb`

```sql
INSERT INTO m4_dnr_history(SELECT 0, dnr.* FROM m4_dnr dnr WHERE dnr.dnrid = '{idtransaksi}')
```

## Query 21

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr_history.vb`

```sql
INSERT INTO m7_asset_transaction_history(SELECT 0, '{result_4}', atr.* FROM m7_asset_transaction atr WHERE atr.atidutama = '{idtransaksi}' and atr.atsumber = 'DNR')
```

## Query 22

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
Insert into M0_Userlog (uluserid, ulidmodule, ulidmenu, uljenisaktivitas, ulaktivitas, ultgl, ulkodepa) values({userid}, {mdlid}, {mnid}, {jnsaktivitas}, '{notransaksi}', NOW(), {0})
```

## Query 23

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
Insert into M1_Item_Transaction (id, cabang, lokasi, gudang, kodepa, jenismutasi, sumber, idutama, iddetail, notransaksi, tgl, kontak, idbarang, namabarang, tipebarang, tipehpp, jml, satuan, jmlbarang, satuanbarang, matauang, kurs, harga, diskon, jmldiskon, idhppikm, idhppikk, hpp, uraian, catatan, catatandetail, costcenter, divisi, subdivisi, proyek, saldojml, saldohpp, saldonilai, inputtgl, inputuser, postingtgl, updatehpp, postinghpp, hppfix, postingjurnal, jurnalfix, tutupperiode, isclose, customtext1, customtext2, customtext3, customtext4, customtext5, customtext6, customtext7, customtext8, customtext9, customtext10, customint1, customint2, customint3, customint4, customint5, customint6, customint7, customint8, customint9, customint10, customdbl1, customdbl2, customdbl3, customdbl4, customdbl5, customdbl6, customdbl7, customdbl8, customdbl9, customdbl10, customdate1, customdate2, customdate3, customdate4, customdate5, customdate6, customdate7, customdate8, customdate9, customdate10) values{strTransaksiBarang.ToString}
```

## Query 24

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
Insert into M1_No_Batch_In(nbiidbatchin, nbigudang, nbiidbarang, nbikode, nbisumber, nbiidtransaksi, nbisatuan, nbijmlmasuk, nbijmlkeluar, nbijmlsisa, nbiisclose, nbicustomtext1, nbicustomtext2, nbicustomtext3, nbicustomdbl1, nbicustomdbl2, nbicustomdbl3, nbicustomdate1, nbicustomdate2, nbicustomdate3) values{strValue3.ToString}
```

## Query 25

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
Insert into M1_No_Batch_Out(nboid, nboidbatchin, nbogudang, nboidbarang, nbokode, nbosumber, nboidtransaksi, nbosatuan, nbojmlkeluar, nboisclose) values{strValue2.ToString}
```

## Query 26

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
Insert into M1_No_Batch_Transaction(nbtid, nbtjenismutasi, nbtidbatchin, nbtgudang, nbtidbarang, nbtkode, nbtsumber, nbtidtransaksi, nbtsatuan, nbtjml, nbtcustomtext1, nbtcustomtext2, nbtcustomtext3, nbtcustomdbl1, nbtcustomdbl2, nbtcustomdbl3, nbtcustomdate1, nbtcustomdate2, nbtcustomdate3) values{strValue2.ToString}
```

## Query 27

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
Insert into M1_No_Serial_In(nsiidserialin, nsigudang, nsiidbarang, nsikode, nsisumber, nsiidtransaksi, nsisatuan, nsijmlmasuk, nsijmlkeluar, nsijmlsisa, nsiisclose, nsicustomtext1, nsicustomtext2, nsicustomtext3, nsicustomdbl1, nsicustomdbl2, nsicustomdbl3, nsicustomdate1, nsicustomdate2, nsicustomdate3) values{strValue3.ToString}
```

## Query 28

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
Insert into M1_No_Serial_Out(nsoid, nsoidserialin, nsogudang, nsoidbarang, nsokode, nsosumber, nsoidtransaksi, nsosatuan, nsojmlkeluar, nsoisclose) values{strValue2.ToString}
```

## Query 29

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
Insert into M1_No_Serial_Transaction(nstid, nstjenismutasi, nstidserialin, nstgudang, nstidbarang, nstkode, nstsumber, nstidtransaksi, nstsatuan, nstjml, nstcustomtext1, nstcustomtext2, nstcustomtext3, nstcustomdbl1, nstcustomdbl2, nstcustomdbl3, nstcustomdate1, nstcustomdate2, nstcustomdate3) values{strValue2.ToString}
```

## Query 30

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
Insert into M4_Dnr (dnrcabang, dnrlokasi, dnrgudang, dnrasalbarang, dnrasalbarangkategori, dnrjenispembelian, dnrjenispembeliankategori, dnrcarabayar, dnrsumber, dnrautonotransaksi, dnrnotransaksi, dnrtgl, dnrkodepa, dnrsupplier, dnrsupplierkontak, dnr1alamat1, dnr1alamat2, dnr1alamat3, dnr2alamat1, dnr2alamat2, dnr2alamat3, dnrbagianpembelian, dnrtermin, dnrtgljatuhtempo, dnruraian, dnrcatatan, dnrnoref, dnrtglnoref, dnrtglpenutupan, dnrmatauang, dnrkurs, dnrhargatermasukpajak, dnrtotal, dnrdiskonpersen, dnrjmldiskon, dnrtotalpajak1detail, dnrtotalpajak2detail, dnrbiayalainpersen, dnrbiayalain, dnrtotaltransaksi, dnrjmlbayar, dnrstatuslunas, dnrtgllunas, dnrnofakturpajak, dnrsdhbayarpajak, dnrtglbayarpajak, dnrrekdiskon, dnrrekpajak1, dnrrekpajak2, dnrrekbiayalain, dnrrekbayar, dnridpr, dnridcs, dnridrq, dnridbs, dnridpo, dnridipc, dnridgrn, dnridri, dnrstatusprt, dnrstatus, dnrstatussebelumnya, dnrjmlrevisi, dnrcetakanke, dnrinputuser, dnrinputtgl, dnrmodifikasiuser, dnrmodifikasitgl, dnrposting, dnrtutupperiode, dnrisclose, dnrcustomtext1, dnrcustomtext2, dnrcustomtext3, dnrcustomtext4, dnrcustomtext5, dnrcustomint1, dnrcustomint2, dnrcustomint3, dnrcustomdbl1, dnrcustomdbl2, dnrcustomdbl3, dnrcustomdate1, dnrcustomdate2, dnrcustomdate3) values('{dnrcabang}', '{dnrlokasi}', '{dnrgudang}', '{dnrasalbarang}', {dnrasalbarangkategori}, '{dnrjenispembelian}', {dnrjenispembeliankategori}, {dnrcarabayar}, '{dnrsumber}', {dnrautonotransaksi}, '{notransaksi}', '{dnrtgl}', {dnrkodepa}, {dnrsupplier}, '{dnrsupplierkontak}', '{dnr1alamat1}', '{dnr1alamat2}', '{dnr1alamat3}', '{dnr2alamat1}', '{dnr2alamat2}', '{dnr2alamat3}', {dnrbagianpembelian}, '{dnrtermin}', '{dnrtgljatuhtempo}', '{dnruraian}', '{dnrcatatan}', '{dnrnoref}', '{dnrtglnoref}', '{dnrtglpenutupan}', '{dnrmatauang}', '{dnrkurs}', {dnrhargatermasukpajak}, '{dnrtotal}', '{dnrdiskonpersen}', '{dnrjmldiskon}', '{dnrtotalpajak1detail}', '{dnrtotalpajak2detail}', '{dnrbiayalainpersen}', '{dnrbiayalain}', '{dnrtotaltransaksi}', '{dnrjmlbayar}', {dnrstatuslunas}, '{dnrtgllunas}', '{dnrnofakturpajak}', {dnrsdhbayarpajak}, '{dnrtglbayarpajak}', '{dnrrekdiskon}', '{dnrrekpajak1}', '{dnrrekpajak2}', '{dnrrekbiayalain}', '{dnrrekbayar}', {dnridpr}, {dnridcs}, {dnridrq}, {dnridbs}, {dnridpo}, {dnridipc}, {dnridgrn}, {dnridri}, {dnrstatusprt}, {dnrstatus}, {dnrstatussebelumnya}, {dnrjmlrevisi}, {dnrcetakanke}, {dnrinputuser}, NOW(), {dnrmodifikasiuser}, '1971-01-01 00:00:00', 0, {dnrtutupperiode}, {dnrisclose}, '{dnrcustomtext1}', '{dnrcustomtext2}', '{dnrcustomtext3}', '{dnrcustomtext4}', '{dnrcustomtext5}', {dnrcustomint1}, {dnrcustomint2}, {dnrcustomint3}, '{dnrcustomdbl1}', '{dnrcustomdbl2}', '{dnrcustomdbl3}', '{dnrcustomdate1}', '{dnrcustomdate2}', '{dnrcustomdate3}')
```

## Query 31

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
Insert into M4_Dnr_Detail(iddnrdetail, iddnr, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, hargafix, idhppkhususmasuk, idhppfifomasuk, hpp, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudangasal, gudangtransit, gudangtujuan, rekpersediaan, rekdiskonpembelian, rekhargapokok, rekreturpembelian, costcenter, divisi, subdivisi, proyek, catatan, urutan, idprdetail, idcsdetail, idrqdetail, idbsdetail, idpodetail, idipcdetail, idgrndetail, idridetail, jmlprt, statusprt, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2.ToString}
```

## Query 32

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
Insert into M7_Asset_Transaction(atid, atasetid, atjenismutasi, atsumber, atidutama, atidbarang, atkode, atnama, atkategori, atcabang, atlokasi, atgudang, atdivisi, atsubdivisi, atcostcenter, atproyek, atcatatan, atnomor, attglbeli, attglpakai, atjml, atsatuan, atmatauang, atkurs, atharga, atdiskon, atjmldiskon, atpajak1, atjmlpajak1, atpajak2, atjmlpajak2, athargabeli, atnilairesidu, atumurekonomis, atbebanperbln, atakumulasibeban, atnilaibuku, atmetode, attabelpenyusutan, atintangible, atfiskal, atatastengahbulan, atrekasset, atrekakumdepresiasi, atrekdepresiasi, atrekpenghapusan, atprodusen, attglpensiun, atpenyusutanke, atnilaimenurun, atdispose, atpembelian, atpenjualan, atlocked, atstatus, atstatussebelumnya, atisclose, atinputuser, atinputtgl, atmodifikasiuser, atmodifikasitgl, atcustomtext1, atcustomtext2, atcustomtext3, atcustomtext4, atcustomtext5, atcustomint1, atcustomint2, atcustomint3, atcustomint4, atcustomint5, atcustomdbl1, atcustomdbl2, atcustomdbl3, atcustomdbl4, atcustomdbl5, atcustomdate1, atcustomdate2, atcustomdate3, atcustomdate4, atcustomdate5, atnotransaksi, attgl) values{strValue2.ToString}
```

## Query 33

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
SELECT ccakun FROM m1_cost_center WHERE cckode = '{dataRowDetail_32}'
```

## Query 34

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
SELECT csi.idhppikm, csi.idbarang, csi.sisa, i.bkode FROM m1_cogs_special_in csi JOIN m1_item i ON csi.idbarang = i.bid WHERE {ftHppI}
```

## Query 35

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
SELECT dnrcabang, dnrlokasi, dnrsumber, dnrautonotransaksi, dnrnotransaksi, dnrtgl FROM M4_dnr WHERE dnrid = '{idtransaksi}'
```

## Query 36

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
SELECT dnrd.iddnrdetail, dnrd.idbarang, dnrd.namabarang, dnrd.tipebarang, dnrd.jml, dnrd.satuan, dnrd.jmlbarang, dnrd.satuanbarang, dnrd.matauang, dnrd.kurs, dnrd.harga, dnrd.diskon, dnrd.jmldiskon, dnrd.hpp, dnrd.idhppkhususmasuk, dnrd.gudangasal, dnrd.gudangtransit, dnrd.gudangtujuan, dnrd.catatan, dnrd.costcenter, dnrd.divisi, dnrd.subdivisi, dnrd.proyek, dnr.dnrinputtgl, i.bhpp FROM m4_dnr_detail dnrd JOIN m4_dnr dnr ON dnrd.iddnr = dnr.dnrid JOIN m1_item i ON dnrd.idbarang = i.bid WHERE dnrd.iddnr = '{result_4}'
```

## Query 37

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
SELECT dnrd.iddnrdetail, dnrd.idbarang, dnrd.namabarang, dnrd.tipebarang, dnrd.jml, dnrd.satuan, dnrd.jmlbarang, dnrd.satuanbarang, dnrd.matauang, dnrd.kurs, dnrd.harga, dnrd.diskon, dnrd.jmldiskon, dnrd.hpp, dnrd.idhppkhususmasuk, dnrd.gudangasal, dnrd.gudangtransit, dnrd.gudangtujuan, dnrd.catatan, dnrd.costcenter, dnrd.divisi, dnrd.subdivisi, dnrd.proyek, dnr.dnrinputtgl, i.bhpp, (CASE LENGTH(IFNULL(cc.ccakun,'')) WHEN 0 THEN 1 ELSE 0 END) as transbarang FROM m4_dnr_detail dnrd JOIN m4_dnr dnr ON dnrd.iddnr = dnr.dnrid JOIN m1_item i ON dnrd.idbarang = i.bid LEFT JOIN m1_cost_center cc ON dnrd.costcenter = cc.cckode WHERE dnrd.iddnr = '{result_4}'
```

## Query 38

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr_history.vb`

```sql
SELECT dnridhistory FROM m4_dnr_history WHERE dnrid = '{idtransaksi}' ORDER BY dnrmodifikasitgl DESC LIMIT 1
```

## Query 39

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
SELECT i.bkode, rid.idridetail, ri.rinotransaksi as notransaksi, (CASE ri.rihargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m4_ri_detail rid JOIN m4_ri ri ON rid.idri = ri.riid JOIN m1_item i ON rid.idbarang = i.bid WHERE ({ftRI}) AND ri.rihargatermasukpajak <> {termasukPajak} ORDER BY rid.urutan
```

## Query 40

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
SELECT isw.idbarang, isw.kgudang, isw.stok - IFNULL(isb.jmlbooking,0) as stok, i.bkode FROM m1_item_stock_warehouse isw JOIN m1_item i ON isw.idbarang = i.bid AND i.bjenis <> 'J' LEFT JOIN m1_warehouse w ON isw.kgudang = w.wkode LEFT JOIN m1_item_booking isb ON isw.idbarang = isb.idbarang AND w.wbookingstok = 1 WHERE {ftStok}
```

## Query 41

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
SELECT jml, harga, diskon, pajak1, jmlpajak1, pajak2, jmlpajak2 FROM m4_ri_detail WHERE idridetail = '{idridetail}'
```

## Query 42

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
SELECT nbi.nbiidbarang, nbi.nbikode, nbi.nbigudang, nbi.nbijmlsisa, i.bkode FROM m1_no_batch_in nbi JOIN m1_item i ON nbi.nbiidbarang = i.bid WHERE {ftBatch}
```

## Query 43

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
SELECT nsi.nsiidbarang, nsi.nsikode, nsi.nsigudang, nsi.nsijmlsisa, i.bkode FROM m1_no_serial_in nsi JOIN m1_item i ON nsi.nsiidbarang = i.bid WHERE {ftSerial}
```

## Query 44

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
SELECT ri.rinotransaksi as notransaksi, ri.rihargatermasukpajak as termasukpajak, (CASE ri.rihargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajaknama FROM m4_ri_detail rid JOIN m4_ri ri ON rid.idri = ri.riid WHERE {ftRI} GROUP BY ri.rihargatermasukpajak
```

## Query 45

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
SELECT rid.idridetail, (rid.jmlbarang - rid.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m4_ri_detail AS rid INNER JOIN m1_item AS i ON rid.idbarang = i.bid WHERE {ftOutstandingRI}
```

## Query 46

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
SELECT snilai FROM m0_setting WHERE smodule = 3 AND sgrup = 'defaultgudang' AND skode = 'GudangTransit'
```

## Query 47

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
UPDATE M4_Dnr SET Dnrstatus = {nilaiStatus}, Dnrmodifikasiuser='{userid}', Dnrmodifikasitgl = NOW(), Dnrposting = 0, Dnrpostingtgl = '1971-01-01 00:00:00', Dnrjmlrevisi = Dnrjmlrevisi + 1 WHERE Dnrid = '{idtransaksi}'
```

## Query 48

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
UPDATE m1_no_batch_in SET nbijmlkeluar = (CASE {updNilaiBatch} ELSE nbijmlkeluar END) WHERE {updFilterBatch}
```

## Query 49

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
UPDATE m1_no_serial_in SET nsijmlkeluar = (CASE {updNilaiSerial} ELSE nsijmlkeluar END) WHERE {updFilterSerial}
```

## Query 50

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
UPDATE m4_ri SET ristatusrealisasi = (CASE riid {updNilaiRI} ELSE ristatusrealisasi END) WHERE {updFilterRI}
```

## Query 51

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
UPDATE m4_ri_detail SET jmlrealisasi = (CASE idridetail {updNilaiRI} ELSE jmlrealisasi END) WHERE {updFilterRI}
```

## Query 52

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
UPDATE m7_asset a SET a.agudang = '{SetGudang}' WHERE a.aid IN({strValue2.ToString})
```

## Query 53

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
UPDATE m7_asset a SET a.agudang = '{gudangIn}' WHERE a.aid IN({strValue2.ToString})
```

## Query 54

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
Update M4_Dnr set dnrcabang = '{dnrcabang}', dnrlokasi = '{dnrlokasi}', dnrgudang = '{dnrgudang}', dnrasalbarang = '{dnrasalbarang}', dnrasalbarangkategori = {dnrasalbarangkategori}, dnrjenispembelian = '{dnrjenispembelian}', dnrjenispembeliankategori = {dnrjenispembeliankategori}, dnrcarabayar = {dnrcarabayar}, dnrsumber = '{dnrsumber}', dnrautonotransaksi = {dnrautonotransaksi}, dnrnotransaksi = '{notransaksi}', dnrtgl = '{dnrtgl}', dnrkodepa = {dnrkodepa}, dnrsupplier = {dnrsupplier}, dnrsupplierkontak = '{dnrsupplierkontak}', dnr1alamat1 = '{dnr1alamat1}', dnr1alamat2 = '{dnr1alamat2}', dnr1alamat3 = '{dnr1alamat3}', dnr2alamat1 = '{dnr2alamat1}', dnr2alamat2 = '{dnr2alamat2}', dnr2alamat3 = '{dnr2alamat3}', dnrbagianpembelian = {dnrbagianpembelian}, dnrtermin = '{dnrtermin}', dnrtgljatuhtempo = '{dnrtgljatuhtempo}', dnruraian = '{dnruraian}', dnrcatatan = '{dnrcatatan}', dnrnoref = '{dnrnoref}', dnrtglnoref = '{dnrtglnoref}', dnrtglpenutupan = '{dnrtglpenutupan}', dnrmatauang = '{dnrmatauang}', dnrkurs = '{dnrkurs}', dnrhargatermasukpajak = {dnrhargatermasukpajak}, dnrtotal = '{dnrtotal}', dnrdiskonpersen = '{dnrdiskonpersen}', dnrjmldiskon = '{dnrjmldiskon}', dnrtotalpajak1detail = '{dnrtotalpajak1detail}', dnrtotalpajak2detail = '{dnrtotalpajak2detail}', dnrbiayalainpersen = '{dnrbiayalainpersen}', dnrbiayalain = '{dnrbiayalain}', dnrtotaltransaksi = '{dnrtotaltransaksi}', dnrjmlbayar = '{dnrjmlbayar}', dnrstatuslunas = {dnrstatuslunas}, dnrtgllunas = '{dnrtgllunas}', dnrnofakturpajak = '{dnrnofakturpajak}', dnrsdhbayarpajak = {dnrsdhbayarpajak}, dnrtglbayarpajak = '{dnrtglbayarpajak}', dnrrekdiskon = '{dnrrekdiskon}', dnrrekpajak1 = '{dnrrekpajak1}', dnrrekpajak2 = '{dnrrekpajak2}', dnrrekbiayalain = '{dnrrekbiayalain}', dnrrekbayar = '{dnrrekbayar}', dnridpr = {dnridpr}, dnridcs = {dnridcs}, dnridrq = {dnridrq}, dnridbs = {dnridbs}, dnridpo = {dnridpo}, dnridipc = {dnridipc}, dnridgrn = {dnridgrn}, dnridri = {dnridri}, dnrstatusprt = {dnrstatusprt}, dnrstatus = {dnrstatus}, dnrstatussebelumnya = {dnrstatussebelumnya}, dnrjmlrevisi = dnrjmlrevisi+1, dnrcetakanke = {dnrcetakanke}, dnrmodifikasiuser = {dnrmodifikasiuser}, dnrmodifikasitgl = NOW(), dnrposting = 0, dnrtutupperiode = {dnrtutupperiode}, dnrcustomtext1 = '{dnrcustomtext1}', dnrcustomtext2 = '{dnrcustomtext2}', dnrcustomtext3 = '{dnrcustomtext3}', dnrcustomtext4 = '{dnrcustomtext4}', dnrcustomtext5 = '{dnrcustomtext5}', dnrcustomint1 = {dnrcustomint1}, dnrcustomint2 = {dnrcustomint2}, dnrcustomint3 = {dnrcustomint3}, dnrcustomdbl1 = '{dnrcustomdbl1}', dnrcustomdbl2 = '{dnrcustomdbl2}', dnrcustomdbl3 = '{dnrcustomdbl3}', dnrcustomdate1 = '{dnrcustomdate1}', dnrcustomdate2 = '{dnrcustomdate2}', dnrcustomdate3 = '{dnrcustomdate3}' where dnrid = '{dnrid}'
```

## Query 55

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_dnr_v`

```sql
select `dnr`.`dnrid` AS `dnrid`,`dnr`.`dnrcabang` AS `dnrcabang`,`dnr`.`dnrlokasi` AS `dnrlokasi`,`dnr`.`dnrgudang` AS `dnrgudang`,`dnr`.`dnrasalbarang` AS `dnrasalbarang`,`dnr`.`dnrasalbarangkategori` AS `dnrasalbarangkategori`,`dnr`.`dnrjenispembelian` AS `dnrjenispembelian`,`dnr`.`dnrjenispembeliankategori` AS `dnrjenispembeliankategori`,`dnr`.`dnrcarabayar` AS `dnrcarabayar`,`dnr`.`dnrsumber` AS `dnrsumber`,`dnr`.`dnrautonotransaksi` AS `dnrautonotransaksi`,`dnr`.`dnrnotransaksi` AS `dnrnotransaksi`,`dnr`.`dnrtgl` AS `dnrtgl`,`dnr`.`dnrkodepa` AS `dnrkodepa`,`dnr`.`dnrsupplier` AS `dnrsupplier`,`dnr`.`dnrsupplierkontak` AS `dnrsupplierkontak`,`dnr`.`dnr1alamat1` AS `dnr1alamat1`,`dnr`.`dnr1alamat2` AS `dnr1alamat2`,`dnr`.`dnr1alamat3` AS `dnr1alamat3`,`dnr`.`dnr2alamat1` AS `dnr2alamat1`,`dnr`.`dnr2alamat2` AS `dnr2alamat2`,`dnr`.`dnr2alamat3` AS `dnr2alamat3`,`dnr`.`dnrbagianpembelian` AS `dnrbagianpembelian`,`dnr`.`dnrtermin` AS `dnrtermin`,`dnr`.`dnrtgljatuhtempo` AS `dnrtgljatuhtempo`,`dnr`.`dnruraian` AS `dnruraian`,`dnr`.`dnrcatatan` AS `dnrcatatan`,`dnr`.`dnrnoref` AS `dnrnoref`,`dnr`.`dnrtglnoref` AS `dnrtglnoref`,`dnr`.`dnrtglpenutupan` AS `dnrtglpenutupan`,`dnr`.`dnrmatauang` AS `dnrmatauang`,`dnr`.`dnrkurs` AS `dnrkurs`,`dnr`.`dnrhargatermasukpajak` AS `dnrhargatermasukpajak`,`dnr`.`dnrtotal` AS `dnrtotal`,`dnr`.`dnrdiskonpersen` AS `dnrdiskonpersen`,`dnr`.`dnrjmldiskon` AS `dnrjmldiskon`,`dnr`.`dnrtotalpajak1detail` AS `dnrtotalpajak1detail`,`dnr`.`dnrtotalpajak2detail` AS `dnrtotalpajak2detail`,`dnr`.`dnrbiayalainpersen` AS `dnrbiayalainpersen`,`dnr`.`dnrbiayalain` AS `dnrbiayalain`,`dnr`.`dnrtotaltransaksi` AS `dnrtotaltransaksi`,`dnr`.`dnrjmlbayar` AS `dnrjmlbayar`,`dnr`.`dnrstatuslunas` AS `dnrstatuslunas`,`dnr`.`dnrtgllunas` AS `dnrtgllunas`,`dnr`.`dnrnofakturpajak` AS `dnrnofakturpajak`,`dnr`.`dnrsdhbayarpajak` AS `dnrsdhbayarpajak`,`dnr`.`dnrtglbayarpajak` AS `dnrtglbayarpajak`,`dnr`.`dnrrekdiskon` AS `dnrrekdiskon`,`dnr`.`dnrrekpajak1` AS `dnrrekpajak1`,`dnr`.`dnrrekpajak2` AS `dnrrekpajak2`,`dnr`.`dnrrekbiayalain` AS `dnrrekbiayalain`,`dnr`.`dnrrekbayar` AS `dnrrekbayar`,`dnr`.`dnridpr` AS `dnridpr`,`dnr`.`dnridcs` AS `dnridcs`,`dnr`.`dnridrq` AS `dnridrq`,`dnr`.`dnridbs` AS `dnridbs`,`dnr`.`dnridpo` AS `dnridpo`,`dnr`.`dnridipc` AS `dnridipc`,`dnr`.`dnridgrn` AS `dnridgrn`,`dnr`.`dnridri` AS `dnridri`,`dnr`.`dnrstatusprt` AS `dnrstatusprt`,`dnr`.`dnrstatusrealisasi` AS `dnrstatusrealisasi`,`dnr`.`dnrstatus` AS `dnrstatus`,`dnr`.`dnrstatussebelumnya` AS `dnrstatussebelumnya`,`dnr`.`dnrjmlrevisi` AS `dnrjmlrevisi`,`dnr`.`dnrcetakanke` AS `dnrcetakanke`,`dnr`.`dnrinputuser` AS `dnrinputuser`,`dnr`.`dnrinputtgl` AS `dnrinputtgl`,`dnr`.`dnrmodifikasiuser` AS `dnrmodifikasiuser`,`dnr`.`dnrmodifikasitgl` AS `dnrmodifikasitgl`,`dnr`.`dnrposting` AS `dnrposting`,`dnr`.`dnrpostingtgl` AS `dnrpostingtgl`,`dnr`.`dnrtutupperiode` AS `dnrtutupperiode`,`dnr`.`dnrisclose` AS `dnrisclose`,`br`.`bnama` AS `dnrcabangnama`,`lc`.`lnama` AS `dnrlokasinama`,`wh`.`wnama` AS `dnrgudangnama`,`c1`.`kkode` AS `dnrsupplierkode`,`c1`.`knama` AS `dnrsuppliernama`,`c2`.`kkode` AS `dnrbagianpembeliankode`,`c2`.`knama` AS `dnrbagianpembeliannama`,`grn`.`grnnotransaksi` AS `grnnotransaksi`,`ri`.`rinotransaksi` AS `rinotransaksi`,`st1`.`nama` AS `dnrstatusnama`,`st2`.`nama` AS `dnrstatussebelumnyanama`,`u1`.`unama` AS `dnrinputusernama`,`u2`.`unama` AS `dnrmodifikasiusernama` from (((((((((((`m4_dnr` `dnr` left join `m1_branch` `br` on((`br`.`bkode` = `dnr`.`dnrcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `dnr`.`dnrlokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `dnr`.`dnrgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `dnr`.`dnrsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `dnr`.`dnrbagianpembelian`))) left join `m4_grn` `grn` on((`dnr`.`dnridgrn` = `grn`.`grnid`))) left join `m4_ri` `ri` on((`dnr`.`dnridri` = `ri`.`riid`))) left join `m0_status` `st1` on((`st1`.`kode` = `dnr`.`dnrstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `dnr`.`dnrstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `dnr`.`dnrinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `dnr`.`dnrmodifikasiuser`)))
```

## Query 56

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
select `dnr`.`dnrid` AS `dnrid`,`dnr`.`dnrcabang` AS `dnrcabang`,`dnr`.`dnrlokasi` AS `dnrlokasi`,`dnr`.`dnrgudang` AS `dnrgudang`,`dnr`.`dnrasalbarang` AS `dnrasalbarang`,`dnr`.`dnrasalbarangkategori` AS `dnrasalbarangkategori`,`dnr`.`dnrjenispembelian` AS `dnrjenispembelian`,`dnr`.`dnrjenispembeliankategori` AS `dnrjenispembeliankategori`,`dnr`.`dnrcarabayar` AS `dnrcarabayar`,`dnr`.`dnrsumber` AS `dnrsumber`,`dnr`.`dnrautonotransaksi` AS `dnrautonotransaksi`,`dnr`.`dnrnotransaksi` AS `dnrnotransaksi`,`dnr`.`dnrtgl` AS `dnrtgl`,`dnr`.`dnrkodepa` AS `dnrkodepa`,`dnr`.`dnrsupplier` AS `dnrsupplier`,`dnr`.`dnrsupplierkontak` AS `dnrsupplierkontak`,`dnr`.`dnr1alamat1` AS `dnr1alamat1`,`dnr`.`dnr1alamat2` AS `dnr1alamat2`,`dnr`.`dnr1alamat3` AS `dnr1alamat3`,`dnr`.`dnr2alamat1` AS `dnr2alamat1`,`dnr`.`dnr2alamat2` AS `dnr2alamat2`,`dnr`.`dnr2alamat3` AS `dnr2alamat3`,`dnr`.`dnrbagianpembelian` AS `dnrbagianpembelian`,`dnr`.`dnrtermin` AS `dnrtermin`,`dnr`.`dnrtgljatuhtempo` AS `dnrtgljatuhtempo`,`dnr`.`dnruraian` AS `dnruraian`,`dnr`.`dnrcatatan` AS `dnrcatatan`,`dnr`.`dnrnoref` AS `dnrnoref`,`dnr`.`dnrtglnoref` AS `dnrtglnoref`,`dnr`.`dnrtglpenutupan` AS `dnrtglpenutupan`,`dnr`.`dnrmatauang` AS `dnrmatauang`,`dnr`.`dnrkurs` AS `dnrkurs`,`dnr`.`dnrhargatermasukpajak` AS `dnrhargatermasukpajak`,`dnr`.`dnrtotal` AS `dnrtotal`,`dnr`.`dnrdiskonpersen` AS `dnrdiskonpersen`,`dnr`.`dnrjmldiskon` AS `dnrjmldiskon`,`dnr`.`dnrtotalpajak1detail` AS `dnrtotalpajak1detail`,`dnr`.`dnrtotalpajak2detail` AS `dnrtotalpajak2detail`,`dnr`.`dnrbiayalainpersen` AS `dnrbiayalainpersen`,`dnr`.`dnrbiayalain` AS `dnrbiayalain`,`dnr`.`dnrtotaltransaksi` AS `dnrtotaltransaksi`,`dnr`.`dnrjmlbayar` AS `dnrjmlbayar`,`dnr`.`dnrstatuslunas` AS `dnrstatuslunas`,`dnr`.`dnrtgllunas` AS `dnrtgllunas`,`dnr`.`dnrnofakturpajak` AS `dnrnofakturpajak`,`dnr`.`dnrsdhbayarpajak` AS `dnrsdhbayarpajak`,`dnr`.`dnrtglbayarpajak` AS `dnrtglbayarpajak`,`dnr`.`dnrrekdiskon` AS `dnrrekdiskon`,`dnr`.`dnrrekpajak1` AS `dnrrekpajak1`,`dnr`.`dnrrekpajak2` AS `dnrrekpajak2`,`dnr`.`dnrrekbiayalain` AS `dnrrekbiayalain`,`dnr`.`dnrrekbayar` AS `dnrrekbayar`,`dnr`.`dnridpr` AS `dnridpr`,`dnr`.`dnridcs` AS `dnridcs`,`dnr`.`dnridrq` AS `dnridrq`,`dnr`.`dnridbs` AS `dnridbs`,`dnr`.`dnridpo` AS `dnridpo`,`dnr`.`dnridipc` AS `dnridipc`,`dnr`.`dnridgrn` AS `dnridgrn`,`dnr`.`dnridri` AS `dnridri`,`dnr`.`dnrstatusprt` AS `dnrstatusprt`,`dnr`.`dnrstatusrealisasi` AS `dnrstatusrealisasi`,`dnr`.`dnrstatus` AS `dnrstatus`,`dnr`.`dnrstatussebelumnya` AS `dnrstatussebelumnya`,`dnr`.`dnrjmlrevisi` AS `dnrjmlrevisi`,`dnr`.`dnrcetakanke` AS `dnrcetakanke`,`dnr`.`dnrinputuser` AS `dnrinputuser`,`dnr`.`dnrinputtgl` AS `dnrinputtgl`,`dnr`.`dnrmodifikasiuser` AS `dnrmodifikasiuser`,`dnr`.`dnrmodifikasitgl` AS `dnrmodifikasitgl`,`dnr`.`dnrposting` AS `dnrposting`,`dnr`.`dnrpostingtgl` AS `dnrpostingtgl`,`dnr`.`dnrtutupperiode` AS `dnrtutupperiode`,`dnr`.`dnrisclose` AS `dnrisclose`,`dnr`.`dnrcustomtext1` AS `dnrcustomtext1`,`dnr`.`dnrcustomtext2` AS `dnrcustomtext2`,`dnr`.`dnrcustomtext3` AS `dnrcustomtext3`,`dnr`.`dnrcustomtext4` AS `dnrcustomtext4`,`dnr`.`dnrcustomtext5` AS `dnrcustomtext5`,`dnr`.`dnrcustomint1` AS `dnrcustomint1`,`dnr`.`dnrcustomint2` AS `dnrcustomint2`,`dnr`.`dnrcustomint3` AS `dnrcustomint3`,`dnr`.`dnrcustomdbl1` AS `dnrcustomdbl1`,`dnr`.`dnrcustomdbl2` AS `dnrcustomdbl2`,`dnr`.`dnrcustomdbl3` AS `dnrcustomdbl3`,`dnr`.`dnrcustomdate1` AS `dnrcustomdate1`,`dnr`.`dnrcustomdate2` AS `dnrcustomdate2`,`dnr`.`dnrcustomdate3` AS `dnrcustomdate3`,`br`.`bnama` AS `dnrcabangnama`,`lc`.`lnama` AS `dnrlokasinama`,`wh`.`wnama` AS `dnrgudangnama`,`c1`.`kkode` AS `dnrsupplierkode`,`c1`.`knama` AS `dnrsuppliernama`,`c2`.`kkode` AS `dnrbagianpembeliankode`,`c2`.`knama` AS `dnrbagianpembeliannama`,`tr`.`trnama` AS `dnrterminnama`,`tr`.`trharijatuhtempo` AS `dnrterminharijatuhtempo`,`coa1`.`cnama` AS `dnrrekdiskonnama`,`coa2`.`cnama` AS `dnrrekpajak1nama`,`coa3`.`cnama` AS `dnrrekpajak2nama`,`coa4`.`cnama` AS `dnrrekbiayalainnama`,`coa5`.`cnama` AS `dnrrekbayarnama`,`grn`.`grnnotransaksi` AS `dnrnotransaksigrn`,`ri`.`rinotransaksi` AS `dnrnotransaksiri`,`st1`.`nama` AS `dnrstatusnama`,`st2`.`nama` AS `dnrstatussebelumnyanama`,`u1`.`unama` AS `dnrinputusernama`,`u2`.`unama` AS `dnrmodifikasiusernama`,`dnrd`.`iddnrdetail` AS `iddnrdetail`,`dnrd`.`iddnr` AS `iddnr`,`dnrd`.`idbarang` AS `idbarang`,`dnrd`.`namabarang` AS `namabarang`,`dnrd`.`tipebarang` AS `tipebarang`,`dnrd`.`jml` AS `jml`,`dnrd`.`satuan` AS `satuan`,`dnrd`.`nilaisatuan` AS `nilaisatuan`,`dnrd`.`jmlbarang` AS `jmlbarang`,`dnrd`.`satuanbarang` AS `satuanbarang`,`dnrd`.`matauang` AS `matauang`,`dnrd`.`kurs` AS `kurs`,`dnrd`.`hargafix` AS `hargafix`,`dnrd`.`idhppkhususmasuk` AS `idhppkhususmasuk`,`dnrd`.`idhppfifomasuk` AS `idhppfifomasuk`,`dnrd`.`hpp` AS `hpp`,`dnrd`.`harga` AS `harga`,`dnrd`.`diskon` AS `diskon`,`dnrd`.`jmldiskon` AS `jmldiskon`,`dnrd`.`pajak1` AS `pajak1`,`dnrd`.`jmlpajak1` AS `jmlpajak1`,`dnrd`.`pajak2` AS `pajak2`,`dnrd`.`jmlpajak2` AS `jmlpajak2`,`dnrd`.`cabang` AS `cabang`,`dnrd`.`lokasi` AS `lokasi`,`dnrd`.`gudangasal` AS `gudangasal`,`dnrd`.`gudangtransit` AS `gudangtransit`,`dnrd`.`gudangtujuan` AS `gudangtujuan`,`i`.`brekpersediaan` AS `rekpersediaan`,`dnrd`.`rekdiskonpembelian` AS `rekdiskonpembelian`,`dnrd`.`rekhargapokok` AS `rekhargapokok`,`dnrd`.`rekreturpembelian` AS `rekreturpembelian`,`dnrd`.`costcenter` AS `costcenter`,`dnrd`.`divisi` AS `divisi`,`dnrd`.`subdivisi` AS `subdivisi`,`dnrd`.`proyek` AS `proyek`,`dnrd`.`catatan` AS `catatan`,`dnrd`.`urutan` AS `urutan`,`dnrd`.`idprdetail` AS `idprdetail`,`dnrd`.`idcsdetail` AS `idcsdetail`,`dnrd`.`idrqdetail` AS `idrqdetail`,`dnrd`.`idbsdetail` AS `idbsdetail`,`dnrd`.`idpodetail` AS `idpodetail`,`dnrd`.`idipcdetail` AS `idipcdetail`,`dnrd`.`idgrndetail` AS `idgrndetail`,`dnrd`.`idridetail` AS `idridetail`,`dnrd`.`jmlprt` AS `jmlprt`,`dnrd`.`statusprt` AS `statusprt`,`dnrd`.`jmlrealisasi` AS `jmlrealisasi`,`dnrd`.`statusrealisasi` AS `statusrealisasi`,`dnrd`.`isclose` AS `isclose`,`dnrd`.`customtext1` AS `customtext1`,`dnrd`.`customtext2` AS `customtext2`,`dnrd`.`customtext3` AS `customtext3`,`dnrd`.`customdbl1` AS `customdbl1`,`dnrd`.`customdbl2` AS `customdbl2`,`dnrd`.`customdbl3` AS `customdbl3`,`dnrd`.`customdate1` AS `customdate1`,`dnrd`.`customdate2` AS `customdate2`,`dnrd`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bhpp` AS `bhpp`,`i`.`bjenis` AS `bjenis`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,`i`.`basset` AS `basset`,`t1`.`tnama` AS `pajak1nama`,`t1`.`tnilai` AS `pajak1nilai`,`t2`.`tnama` AS `pajak2nama`,`t2`.`tnilai` AS `pajak2nilai`,`brd`.`bnama` AS `cabangnama`,`lcd`.`lnama` AS `lokasinama`,`whd1`.`wnama` AS `gudangasalnama`,`whd2`.`wnama` AS `gudangtransitnama`,`whd3`.`wnama` AS `gudangtujuannama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama`,`grnd`.`idgrn` AS `idgrn`,`grn2`.`grnnotransaksi` AS `grnnotransaksi`,`ri2`.`rinotransaksi` AS `rinotransaksi`, c1.kpkp, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan from ((((((((((((((((((((((((((((((((((`m4_dnr` `dnr` join `m4_dnr_detail` `dnrd` on((`dnr`.`dnrid` = `dnrd`.`iddnr`))) left join `m1_branch` `br` on((`br`.`bkode` = `dnr`.`dnrcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `dnr`.`dnrlokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `dnr`.`dnrgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `dnr`.`dnrsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `dnr`.`dnrbagianpembelian`))) left join `m1_terms` `tr` on((`dnr`.`dnrtermin` = `tr`.`trkode`))) left join `m1_coa` `coa1` on((`dnr`.`dnrrekdiskon` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`dnr`.`dnrrekpajak1` = `coa2`.`cnomor`))) left join `m1_coa` `coa3` on((`dnr`.`dnrrekpajak2` = `coa3`.`cnomor`))) left join `m1_coa` `coa4` on((`dnr`.`dnrrekbiayalain` = `coa4`.`cnomor`))) left join `m1_coa` `coa5` on((`dnr`.`dnrrekbayar` = `coa5`.`cnomor`))) left join `m4_grn` `grn` on((`dnr`.`dnridgrn` = `grn`.`grnid`))) left join `m4_ri` `ri` on((`dnr`.`dnridri` = `ri`.`riid`))) left join `m0_status` `st1` on((`st1`.`kode` = `dnr`.`dnrstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `dnr`.`dnrstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `dnr`.`dnrinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `dnr`.`dnrmodifikasiuser`))) left join `m1_item` `i` on((`i`.`bid` = `dnrd`.`idbarang`))) left join `m1_tax` `t1` on((`dnrd`.`pajak1` = `t1`.`tkode`))) left join `m1_tax` `t2` on((`dnrd`.`pajak2` = `t2`.`tkode`))) left join `m1_subdivision` `sd` on((`dnrd`.`subdivisi` = `sd`.`sdkode`))) left join `m4_ri_detail` `rid` on((`dnrd`.`idridetail` = `rid`.`idridetail`))) left join `m4_ri` `ri2` on((`rid`.`idri` = `ri2`.`riid`))) left join `m1_branch` `brd` on((`dnrd`.`cabang` = `brd`.`bkode`))) left join `m1_location` `lcd` on((`dnrd`.`lokasi` = `lcd`.`lkode`))) left join `m1_warehouse` `whd1` on((`dnrd`.`gudangasal` = `whd1`.`wkode`))) left join `m1_warehouse` `whd2` on((`dnrd`.`gudangtransit` = `whd2`.`wkode`))) left join `m1_warehouse` `whd3` on((`dnrd`.`gudangtujuan` = `whd3`.`wkode`))) left join `m1_cost_center` `cc` on((`dnrd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`dnrd`.`divisi` = `d`.`dkode`))) left join `m1_project` `p` on((`dnrd`.`proyek` = `p`.`pkode`))) left join `m4_grn_detail` `grnd` on((`dnrd`.`idgrndetail` = `grnd`.`idgrndetail`))) left join `m4_grn` `grn2` on((`grnd`.`idgrn` = `grn2`.`grnid`)))
```

## Query 57

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_dnr_getdata`

```sql
select `dnr`.`dnrid` AS `dnrid`,`dnr`.`dnrcabang` AS `dnrcabang`,`dnr`.`dnrlokasi` AS `dnrlokasi`,`dnr`.`dnrgudang` AS `dnrgudang`,`dnr`.`dnrasalbarang` AS `dnrasalbarang`,`dnr`.`dnrasalbarangkategori` AS `dnrasalbarangkategori`,`dnr`.`dnrjenispembelian` AS `dnrjenispembelian`,`dnr`.`dnrjenispembeliankategori` AS `dnrjenispembeliankategori`,`dnr`.`dnrcarabayar` AS `dnrcarabayar`,`dnr`.`dnrsumber` AS `dnrsumber`,`dnr`.`dnrautonotransaksi` AS `dnrautonotransaksi`,`dnr`.`dnrnotransaksi` AS `dnrnotransaksi`,`dnr`.`dnrtgl` AS `dnrtgl`,`dnr`.`dnrkodepa` AS `dnrkodepa`,`dnr`.`dnrsupplier` AS `dnrsupplier`,`dnr`.`dnrsupplierkontak` AS `dnrsupplierkontak`,`dnr`.`dnr1alamat1` AS `dnr1alamat1`,`dnr`.`dnr1alamat2` AS `dnr1alamat2`,`dnr`.`dnr1alamat3` AS `dnr1alamat3`,`dnr`.`dnr2alamat1` AS `dnr2alamat1`,`dnr`.`dnr2alamat2` AS `dnr2alamat2`,`dnr`.`dnr2alamat3` AS `dnr2alamat3`,`dnr`.`dnrbagianpembelian` AS `dnrbagianpembelian`,`dnr`.`dnrtermin` AS `dnrtermin`,`dnr`.`dnrtgljatuhtempo` AS `dnrtgljatuhtempo`,`dnr`.`dnruraian` AS `dnruraian`,`dnr`.`dnrcatatan` AS `dnrcatatan`,`dnr`.`dnrnoref` AS `dnrnoref`,`dnr`.`dnrtglnoref` AS `dnrtglnoref`,`dnr`.`dnrtglpenutupan` AS `dnrtglpenutupan`,`dnr`.`dnrmatauang` AS `dnrmatauang`,`dnr`.`dnrkurs` AS `dnrkurs`,`dnr`.`dnrhargatermasukpajak` AS `dnrhargatermasukpajak`,`dnr`.`dnrtotal` AS `dnrtotal`,`dnr`.`dnrdiskonpersen` AS `dnrdiskonpersen`,`dnr`.`dnrjmldiskon` AS `dnrjmldiskon`,`dnr`.`dnrtotalpajak1detail` AS `dnrtotalpajak1detail`,`dnr`.`dnrtotalpajak2detail` AS `dnrtotalpajak2detail`,`dnr`.`dnrbiayalainpersen` AS `dnrbiayalainpersen`,`dnr`.`dnrbiayalain` AS `dnrbiayalain`,`dnr`.`dnrtotaltransaksi` AS `dnrtotaltransaksi`,`dnr`.`dnrjmlbayar` AS `dnrjmlbayar`,`dnr`.`dnrstatuslunas` AS `dnrstatuslunas`,`dnr`.`dnrtgllunas` AS `dnrtgllunas`,`dnr`.`dnrnofakturpajak` AS `dnrnofakturpajak`,`dnr`.`dnrsdhbayarpajak` AS `dnrsdhbayarpajak`,`dnr`.`dnrtglbayarpajak` AS `dnrtglbayarpajak`,`dnr`.`dnrrekdiskon` AS `dnrrekdiskon`,`dnr`.`dnrrekpajak1` AS `dnrrekpajak1`,`dnr`.`dnrrekpajak2` AS `dnrrekpajak2`,`dnr`.`dnrrekbiayalain` AS `dnrrekbiayalain`,`dnr`.`dnrrekbayar` AS `dnrrekbayar`,`dnr`.`dnridpr` AS `dnridpr`,`dnr`.`dnridcs` AS `dnridcs`,`dnr`.`dnridrq` AS `dnridrq`,`dnr`.`dnridbs` AS `dnridbs`,`dnr`.`dnridpo` AS `dnridpo`,`dnr`.`dnridipc` AS `dnridipc`,`dnr`.`dnridgrn` AS `dnridgrn`,`dnr`.`dnridri` AS `dnridri`,`dnr`.`dnrstatusprt` AS `dnrstatusprt`,`dnr`.`dnrstatusrealisasi` AS `dnrstatusrealisasi`,`dnr`.`dnrstatus` AS `dnrstatus`,`dnr`.`dnrstatussebelumnya` AS `dnrstatussebelumnya`,`dnr`.`dnrjmlrevisi` AS `dnrjmlrevisi`,`dnr`.`dnrcetakanke` AS `dnrcetakanke`,`dnr`.`dnrinputuser` AS `dnrinputuser`,`dnr`.`dnrinputtgl` AS `dnrinputtgl`,`dnr`.`dnrmodifikasiuser` AS `dnrmodifikasiuser`,`dnr`.`dnrmodifikasitgl` AS `dnrmodifikasitgl`,`dnr`.`dnrposting` AS `dnrposting`,`dnr`.`dnrpostingtgl` AS `dnrpostingtgl`,`dnr`.`dnrtutupperiode` AS `dnrtutupperiode`,`dnr`.`dnrisclose` AS `dnrisclose`,`dnr`.`dnrcustomtext1` AS `dnrcustomtext1`,`dnr`.`dnrcustomtext2` AS `dnrcustomtext2`,`dnr`.`dnrcustomtext3` AS `dnrcustomtext3`,`dnr`.`dnrcustomtext4` AS `dnrcustomtext4`,`dnr`.`dnrcustomtext5` AS `dnrcustomtext5`,`dnr`.`dnrcustomint1` AS `dnrcustomint1`,`dnr`.`dnrcustomint2` AS `dnrcustomint2`,`dnr`.`dnrcustomint3` AS `dnrcustomint3`,`dnr`.`dnrcustomdbl1` AS `dnrcustomdbl1`,`dnr`.`dnrcustomdbl2` AS `dnrcustomdbl2`,`dnr`.`dnrcustomdbl3` AS `dnrcustomdbl3`,`dnr`.`dnrcustomdate1` AS `dnrcustomdate1`,`dnr`.`dnrcustomdate2` AS `dnrcustomdate2`,`dnr`.`dnrcustomdate3` AS `dnrcustomdate3`,`br`.`bnama` AS `dnrcabangnama`,`lc`.`lnama` AS `dnrlokasinama`,`wh`.`wnama` AS `dnrgudangnama`,`c1`.`kkode` AS `dnrsupplierkode`,`c1`.`knama` AS `dnrsuppliernama`,`c2`.`kkode` AS `dnrbagianpembeliankode`,`c2`.`knama` AS `dnrbagianpembeliannama`,`tr`.`trnama` AS `dnrterminnama`,`tr`.`trharijatuhtempo` AS `dnrterminharijatuhtempo`,`coa1`.`cnama` AS `dnrrekdiskonnama`,`coa2`.`cnama` AS `dnrrekpajak1nama`,`coa3`.`cnama` AS `dnrrekpajak2nama`,`coa4`.`cnama` AS `dnrrekbiayalainnama`,`coa5`.`cnama` AS `dnrrekbayarnama`,`grn`.`grnnotransaksi` AS `dnrnotransaksigrn`,`ri`.`rinotransaksi` AS `dnrnotransaksiri`,`st1`.`nama` AS `dnrstatusnama`,`st2`.`nama` AS `dnrstatussebelumnyanama`,`u1`.`unama` AS `dnrinputusernama`,`u2`.`unama` AS `dnrmodifikasiusernama`,`dnrd`.`iddnrdetail` AS `iddnrdetail`,`dnrd`.`iddnr` AS `iddnr`,`dnrd`.`idbarang` AS `idbarang`,`dnrd`.`namabarang` AS `namabarang`,`dnrd`.`tipebarang` AS `tipebarang`,`dnrd`.`jml` AS `jml`,`dnrd`.`satuan` AS `satuan`,`dnrd`.`nilaisatuan` AS `nilaisatuan`,`dnrd`.`jmlbarang` AS `jmlbarang`,`dnrd`.`satuanbarang` AS `satuanbarang`,`dnrd`.`matauang` AS `matauang`,`dnrd`.`kurs` AS `kurs`,`dnrd`.`hargafix` AS `hargafix`,`dnrd`.`idhppkhususmasuk` AS `idhppkhususmasuk`,`dnrd`.`idhppfifomasuk` AS `idhppfifomasuk`,`dnrd`.`hpp` AS `hpp`,`dnrd`.`harga` AS `harga`,`dnrd`.`diskon` AS `diskon`,`dnrd`.`jmldiskon` AS `jmldiskon`,`dnrd`.`pajak1` AS `pajak1`,`dnrd`.`jmlpajak1` AS `jmlpajak1`,`dnrd`.`pajak2` AS `pajak2`,`dnrd`.`jmlpajak2` AS `jmlpajak2`,`dnrd`.`cabang` AS `cabang`,`dnrd`.`lokasi` AS `lokasi`,`dnrd`.`gudangasal` AS `gudangasal`,`dnrd`.`gudangtransit` AS `gudangtransit`,`dnrd`.`gudangtujuan` AS `gudangtujuan`,`i`.`brekpersediaan` AS `rekpersediaan`,`dnrd`.`rekdiskonpembelian` AS `rekdiskonpembelian`,`dnrd`.`rekhargapokok` AS `rekhargapokok`,`dnrd`.`rekreturpembelian` AS `rekreturpembelian`,`dnrd`.`costcenter` AS `costcenter`,`dnrd`.`divisi` AS `divisi`,`dnrd`.`subdivisi` AS `subdivisi`,`dnrd`.`proyek` AS `proyek`,`dnrd`.`catatan` AS `catatan`,`dnrd`.`urutan` AS `urutan`,`dnrd`.`idprdetail` AS `idprdetail`,`dnrd`.`idcsdetail` AS `idcsdetail`,`dnrd`.`idrqdetail` AS `idrqdetail`,`dnrd`.`idbsdetail` AS `idbsdetail`,`dnrd`.`idpodetail` AS `idpodetail`,`dnrd`.`idipcdetail` AS `idipcdetail`,`dnrd`.`idgrndetail` AS `idgrndetail`,`dnrd`.`idridetail` AS `idridetail`,`dnrd`.`jmlprt` AS `jmlprt`,`dnrd`.`statusprt` AS `statusprt`,`dnrd`.`jmlrealisasi` AS `jmlrealisasi`,`dnrd`.`statusrealisasi` AS `statusrealisasi`,`dnrd`.`isclose` AS `isclose`,`dnrd`.`customtext1` AS `customtext1`,`dnrd`.`customtext2` AS `customtext2`,`dnrd`.`customtext3` AS `customtext3`,`dnrd`.`customdbl1` AS `customdbl1`,`dnrd`.`customdbl2` AS `customdbl2`,`dnrd`.`customdbl3` AS `customdbl3`,`dnrd`.`customdate1` AS `customdate1`,`dnrd`.`customdate2` AS `customdate2`,`dnrd`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bhpp` AS `bhpp`,`i`.`bjenis` AS `bjenis`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,`t1`.`tnama` AS `pajak1nama`,`t1`.`tnilai` AS `pajak1nilai`,`t2`.`tnama` AS `pajak2nama`,`t2`.`tnilai` AS `pajak2nilai`,`brd`.`bnama` AS `cabangnama`,`lcd`.`lnama` AS `lokasinama`,`whd1`.`wnama` AS `gudangasalnama`,`whd2`.`wnama` AS `gudangtransitnama`,`whd3`.`wnama` AS `gudangtujuannama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama`,`grnd`.`idgrn` AS `idgrn`,`grn2`.`grnnotransaksi` AS `grnnotransaksi`,`ri2`.`rinotransaksi` AS `rinotransaksi`, c1.kpkp, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan from ((((((((((((((((((((((((((((((((((`m4_dnr` `dnr` join `m4_dnr_detail` `dnrd` on((`dnr`.`dnrid` = `dnrd`.`iddnr`))) left join `m1_branch` `br` on((`br`.`bkode` = `dnr`.`dnrcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `dnr`.`dnrlokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `dnr`.`dnrgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `dnr`.`dnrsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `dnr`.`dnrbagianpembelian`))) left join `m1_terms` `tr` on((`dnr`.`dnrtermin` = `tr`.`trkode`))) left join `m1_coa` `coa1` on((`dnr`.`dnrrekdiskon` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`dnr`.`dnrrekpajak1` = `coa2`.`cnomor`))) left join `m1_coa` `coa3` on((`dnr`.`dnrrekpajak2` = `coa3`.`cnomor`))) left join `m1_coa` `coa4` on((`dnr`.`dnrrekbiayalain` = `coa4`.`cnomor`))) left join `m1_coa` `coa5` on((`dnr`.`dnrrekbayar` = `coa5`.`cnomor`))) left join `m4_grn` `grn` on((`dnr`.`dnridgrn` = `grn`.`grnid`))) left join `m4_ri` `ri` on((`dnr`.`dnridri` = `ri`.`riid`))) left join `m0_status` `st1` on((`st1`.`kode` = `dnr`.`dnrstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `dnr`.`dnrstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `dnr`.`dnrinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `dnr`.`dnrmodifikasiuser`))) left join `m1_item` `i` on((`i`.`bid` = `dnrd`.`idbarang`))) left join `m1_tax` `t1` on((`dnrd`.`pajak1` = `t1`.`tkode`))) left join `m1_tax` `t2` on((`dnrd`.`pajak2` = `t2`.`tkode`))) left join `m1_subdivision` `sd` on((`dnrd`.`subdivisi` = `sd`.`sdkode`))) left join `m4_ri_detail` `rid` on((`dnrd`.`idridetail` = `rid`.`idridetail`))) left join `m4_ri` `ri2` on((`rid`.`idri` = `ri2`.`riid`))) left join `m1_branch` `brd` on((`dnrd`.`cabang` = `brd`.`bkode`))) left join `m1_location` `lcd` on((`dnrd`.`lokasi` = `lcd`.`lkode`))) left join `m1_warehouse` `whd1` on((`dnrd`.`gudangasal` = `whd1`.`wkode`))) left join `m1_warehouse` `whd2` on((`dnrd`.`gudangtransit` = `whd2`.`wkode`))) left join `m1_warehouse` `whd3` on((`dnrd`.`gudangtujuan` = `whd3`.`wkode`))) left join `m1_cost_center` `cc` on((`dnrd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`dnrd`.`divisi` = `d`.`dkode`))) left join `m1_project` `p` on((`dnrd`.`proyek` = `p`.`pkode`))) left join `m4_grn_detail` `grnd` on((`dnrd`.`idgrndetail` = `grnd`.`idgrndetail`))) left join `m4_grn` `grn2` on((`grnd`.`idgrn` = `grn2`.`grnid`)))
```

## Query 58

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_dnr_terkait`

```sql
select `dnr`.`dnrid` AS `dnrid`,`dnr`.`dnrnotransaksi` AS `dnrnotransaksi`,`pr`.`prsumber` AS `sumber`,`pr`.`prid` AS `idterkait`,`pr`.`prnotransaksi` AS `noterkait`,`pr`.`prtgl` AS `tglterkait`,`pr`.`prinputtgl` AS `inputtglterkait`,`pr`.`prmodifikasitgl` AS `modifikasitglterkait`,0 AS `jenisterkait` from (((`m4_pr_detail` `prd` join `m4_pr` `pr` on((`prd`.`idpr` = `pr`.`prid`))) join `m4_dnr_detail` `dnrd` on((`prd`.`idprdetail` = `dnrd`.`idprdetail`))) join `m4_dnr` `dnr` on((`dnrd`.`iddnr` = `dnr`.`dnrid`))) where (`dnr`.`dnrid` = 'validtransaksi') group by `pr`.`prid`,`dnr`.`dnrid` union all select `dnr`.`dnrid` AS `dnrid`,`dnr`.`dnrnotransaksi` AS `dnrnotransaksi`,`rq`.`rqsumber` AS `sumber`,`rq`.`rqid` AS `idterkait`,`rq`.`rqnotransaksi` AS `noterkait`,`rq`.`rqtgl` AS `tglterkait`,`rq`.`rqinputtgl` AS `inputtglterkait`,`rq`.`rqmodifikasitgl` AS `modifikasitglterkait`,0 AS `jenisterkait` from (((`m4_rq_detail` `rqd` join `m4_rq` `rq` on((`rqd`.`idrq` = `rq`.`rqid`))) join `m4_dnr_detail` `dnrd` on((`rqd`.`idrqdetail` = `dnrd`.`idrqdetail`))) join `m4_dnr` `dnr` on((`dnrd`.`iddnr` = `dnr`.`dnrid`))) where (`dnr`.`dnrid` = 'validtransaksi') group by `rq`.`rqid`,`dnr`.`dnrid` union all select `dnr`.`dnrid` AS `dnrid`,`dnr`.`dnrnotransaksi` AS `dnrnotransaksi`,`po`.`posumber` AS `sumber`,`po`.`poid` AS `idterkait`,`po`.`ponotransaksi` AS `noterkait`,`po`.`potgl` AS `tglterkait`,`po`.`poinputtgl` AS `inputtglterkait`,`po`.`pomodifikasitgl` AS `modifikasitglterkait`,0 AS `jenisterkait` from (((`m4_po_detail` `pod` join `m4_po` `po` on((`pod`.`idpo` = `po`.`poid`))) join `m4_dnr_detail` `dnrd` on((`pod`.`idpodetail` = `dnrd`.`idpodetail`))) join `m4_dnr` `dnr` on((`dnrd`.`iddnr` = `dnr`.`dnrid`))) where (`dnr`.`dnrid` = 'validtransaksi') group by `po`.`poid`,`dnr`.`dnrid` union all select `dnr`.`dnrid` AS `dnrid`,`dnr`.`dnrnotransaksi` AS `dnrnotransaksi`,`grn`.`grnsumber` AS `sumber`,`grn`.`grnid` AS `idterkait`,`grn`.`grnnotransaksi` AS `noterkait`,`grn`.`grntgl` AS `tglterkait`,`grn`.`grninputtgl` AS `inputtglterkait`,`grn`.`grnmodifikasitgl` AS `modifikasitglterkait`,0 AS `jenisterkait` from (((`m4_grn_detail` `grnd` join `m4_grn` `grn` on((`grnd`.`idgrn` = `grn`.`grnid`))) join `m4_dnr_detail` `dnrd` on((`grnd`.`idgrndetail` = `dnrd`.`idgrndetail`))) join `m4_dnr` `dnr` on((`dnrd`.`iddnr` = `dnr`.`dnrid`))) where (`dnr`.`dnrid` = 'validtransaksi') group by `grn`.`grnid`,`dnr`.`dnrid` union all select `dnr`.`dnrid` AS `dnrid`,`dnr`.`dnrnotransaksi` AS `dnrnotransaksi`,`ri`.`risumber` AS `sumber`,`ri`.`riid` AS `idterkait`,`ri`.`rinotransaksi` AS `noterkait`,`ri`.`ritgl` AS `tglterkait`,`ri`.`riinputtgl` AS `inputtglterkait`,`ri`.`rimodifikasitgl` AS `modifikasitglterkait`,0 AS `jenisterkait` from (((`m4_ri_detail` `rid` join `m4_ri` `ri` on((`rid`.`idri` = `ri`.`riid`))) join `m4_dnr_detail` `dnrd` on((`rid`.`idridetail` = `dnrd`.`idridetail`))) join `m4_dnr` `dnr` on((`dnrd`.`iddnr` = `dnr`.`dnrid`))) where (`dnr`.`dnrid` = 'validtransaksi') group by `ri`.`riid`,`dnr`.`dnrid` union all select `dnr`.`dnrid` AS `dnrid`,`dnr`.`dnrnotransaksi` AS `dnrnotransaksi`,`prt`.`prtsumber` AS `sumber`,`prt`.`prtid` AS `idterkait`,`prt`.`prtnotransaksi` AS `noterkait`,`prt`.`prttgl` AS `tglterkait`,`prt`.`prtinputtgl` AS `inputtglterkait`,`prt`.`prtmodifikasitgl` AS `modifikasitglterkait`,1 AS `jenisterkait` from (((`m4_prt_detail` `prtd` join `m4_prt` `prt` on((`prtd`.`idprt` = `prt`.`prtid`))) join `m4_dnr_detail` `dnrd` on((`dnrd`.`iddnrdetail` = `prtd`.`iddnrdetail`))) join `m4_dnr` `dnr` on((`dnr`.`dnrid` = `dnrd`.`iddnr`))) where (((`prt`.`prtstatus` = 2) or (`prt`.`prtstatus` = 3) or (`prt`.`prtstatus` = 4) or (`prt`.`prtstatus` = 7)) and (`dnr`.`dnrid` = 'validtransaksi')) group by `prt`.`prtid`,`dnr`.`dnrid`
```

## Query 59

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_dnr_v_history`

```sql
select `dnr`.`dnridhistory` AS `dnridhistory`,`dnr`.`dnrid` AS `dnrid`,`dnr`.`dnrcabang` AS `dnrcabang`,`dnr`.`dnrlokasi` AS `dnrlokasi`,`dnr`.`dnrgudang` AS `dnrgudang`,`dnr`.`dnrasalbarang` AS `dnrasalbarang`,`dnr`.`dnrasalbarangkategori` AS `dnrasalbarangkategori`,`dnr`.`dnrjenispembelian` AS `dnrjenispembelian`,`dnr`.`dnrjenispembeliankategori` AS `dnrjenispembeliankategori`,`dnr`.`dnrcarabayar` AS `dnrcarabayar`,`dnr`.`dnrsumber` AS `dnrsumber`,`dnr`.`dnrautonotransaksi` AS `dnrautonotransaksi`,`dnr`.`dnrnotransaksi` AS `dnrnotransaksi`,`dnr`.`dnrtgl` AS `dnrtgl`,`dnr`.`dnrkodepa` AS `dnrkodepa`,`dnr`.`dnrsupplier` AS `dnrsupplier`,`dnr`.`dnrsupplierkontak` AS `dnrsupplierkontak`,`dnr`.`dnr1alamat1` AS `dnr1alamat1`,`dnr`.`dnr1alamat2` AS `dnr1alamat2`,`dnr`.`dnr1alamat3` AS `dnr1alamat3`,`dnr`.`dnr2alamat1` AS `dnr2alamat1`,`dnr`.`dnr2alamat2` AS `dnr2alamat2`,`dnr`.`dnr2alamat3` AS `dnr2alamat3`,`dnr`.`dnrbagianpembelian` AS `dnrbagianpembelian`,`dnr`.`dnrtermin` AS `dnrtermin`,`dnr`.`dnrtgljatuhtempo` AS `dnrtgljatuhtempo`,`dnr`.`dnruraian` AS `dnruraian`,`dnr`.`dnrcatatan` AS `dnrcatatan`,`dnr`.`dnrnoref` AS `dnrnoref`,`dnr`.`dnrtglnoref` AS `dnrtglnoref`,`dnr`.`dnrtglpenutupan` AS `dnrtglpenutupan`,`dnr`.`dnrmatauang` AS `dnrmatauang`,`dnr`.`dnrkurs` AS `dnrkurs`,`dnr`.`dnrhargatermasukpajak` AS `dnrhargatermasukpajak`,`dnr`.`dnrtotal` AS `dnrtotal`,`dnr`.`dnrdiskonpersen` AS `dnrdiskonpersen`,`dnr`.`dnrjmldiskon` AS `dnrjmldiskon`,`dnr`.`dnrtotalpajak1detail` AS `dnrtotalpajak1detail`,`dnr`.`dnrtotalpajak2detail` AS `dnrtotalpajak2detail`,`dnr`.`dnrbiayalainpersen` AS `dnrbiayalainpersen`,`dnr`.`dnrbiayalain` AS `dnrbiayalain`,`dnr`.`dnrtotaltransaksi` AS `dnrtotaltransaksi`,`dnr`.`dnrjmlbayar` AS `dnrjmlbayar`,`dnr`.`dnrstatuslunas` AS `dnrstatuslunas`,`dnr`.`dnrtgllunas` AS `dnrtgllunas`,`dnr`.`dnrnofakturpajak` AS `dnrnofakturpajak`,`dnr`.`dnrsdhbayarpajak` AS `dnrsdhbayarpajak`,`dnr`.`dnrtglbayarpajak` AS `dnrtglbayarpajak`,`dnr`.`dnrrekdiskon` AS `dnrrekdiskon`,`dnr`.`dnrrekpajak1` AS `dnrrekpajak1`,`dnr`.`dnrrekpajak2` AS `dnrrekpajak2`,`dnr`.`dnrrekbiayalain` AS `dnrrekbiayalain`,`dnr`.`dnrrekbayar` AS `dnrrekbayar`,`dnr`.`dnridpr` AS `dnridpr`,`dnr`.`dnridcs` AS `dnridcs`,`dnr`.`dnridrq` AS `dnridrq`,`dnr`.`dnridbs` AS `dnridbs`,`dnr`.`dnridpo` AS `dnridpo`,`dnr`.`dnridipc` AS `dnridipc`,`dnr`.`dnridgrn` AS `dnridgrn`,`dnr`.`dnridri` AS `dnridri`,`dnr`.`dnrstatusprt` AS `dnrstatusprt`,`dnr`.`dnrstatusrealisasi` AS `dnrstatusrealisasi`,`dnr`.`dnrstatus` AS `dnrstatus`,`dnr`.`dnrstatussebelumnya` AS `dnrstatussebelumnya`,`dnr`.`dnrjmlrevisi` AS `dnrjmlrevisi`,`dnr`.`dnrcetakanke` AS `dnrcetakanke`,`dnr`.`dnrinputuser` AS `dnrinputuser`,`dnr`.`dnrinputtgl` AS `dnrinputtgl`,`dnr`.`dnrmodifikasiuser` AS `dnrmodifikasiuser`,`dnr`.`dnrmodifikasitgl` AS `dnrmodifikasitgl`,`dnr`.`dnrposting` AS `dnrposting`,`dnr`.`dnrpostingtgl` AS `dnrpostingtgl`,`dnr`.`dnrtutupperiode` AS `dnrtutupperiode`,`dnr`.`dnrisclose` AS `dnrisclose`,`br`.`bnama` AS `dnrcabangnama`,`lc`.`lnama` AS `dnrlokasinama`,`wh`.`wnama` AS `dnrgudangnama`,`c1`.`kkode` AS `dnrsupplierkode`,`c1`.`knama` AS `dnrsuppliernama`,`c2`.`kkode` AS `dnrbagianpembeliankode`,`c2`.`knama` AS `dnrbagianpembeliannama`,`grn`.`grnnotransaksi` AS `grnnotransaksi`,`ri`.`rinotransaksi` AS `rinotransaksi`,`st1`.`nama` AS `dnrstatusnama`,`st2`.`nama` AS `dnrstatussebelumnyanama`,`u1`.`unama` AS `dnrinputusernama`,`u2`.`unama` AS `dnrmodifikasiusernama` from (((((((((((`m4_dnr_history` `dnr` left join `m1_branch` `br` on((`br`.`bkode` = `dnr`.`dnrcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `dnr`.`dnrlokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `dnr`.`dnrgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `dnr`.`dnrsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `dnr`.`dnrbagianpembelian`))) left join `m4_grn` `grn` on((`dnr`.`dnridgrn` = `grn`.`grnid`))) left join `m4_ri` `ri` on((`dnr`.`dnridri` = `ri`.`riid`))) left join `m0_status` `st1` on((`st1`.`kode` = `dnr`.`dnrstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `dnr`.`dnrstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `dnr`.`dnrinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `dnr`.`dnrmodifikasiuser`)))
```

## Query 60

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_dnr_getdata_history`

```sql
select `dnr`.`dnridhistory` AS `dnridhistory`,`dnr`.`dnrid` AS `dnrid`,`dnr`.`dnrcabang` AS `dnrcabang`,`dnr`.`dnrlokasi` AS `dnrlokasi`,`dnr`.`dnrgudang` AS `dnrgudang`,`dnr`.`dnrasalbarang` AS `dnrasalbarang`,`dnr`.`dnrasalbarangkategori` AS `dnrasalbarangkategori`,`dnr`.`dnrjenispembelian` AS `dnrjenispembelian`,`dnr`.`dnrjenispembeliankategori` AS `dnrjenispembeliankategori`,`dnr`.`dnrcarabayar` AS `dnrcarabayar`,`dnr`.`dnrsumber` AS `dnrsumber`,`dnr`.`dnrautonotransaksi` AS `dnrautonotransaksi`,`dnr`.`dnrnotransaksi` AS `dnrnotransaksi`,`dnr`.`dnrtgl` AS `dnrtgl`,`dnr`.`dnrkodepa` AS `dnrkodepa`,`dnr`.`dnrsupplier` AS `dnrsupplier`,`dnr`.`dnrsupplierkontak` AS `dnrsupplierkontak`,`dnr`.`dnr1alamat1` AS `dnr1alamat1`,`dnr`.`dnr1alamat2` AS `dnr1alamat2`,`dnr`.`dnr1alamat3` AS `dnr1alamat3`,`dnr`.`dnr2alamat1` AS `dnr2alamat1`,`dnr`.`dnr2alamat2` AS `dnr2alamat2`,`dnr`.`dnr2alamat3` AS `dnr2alamat3`,`dnr`.`dnrbagianpembelian` AS `dnrbagianpembelian`,`dnr`.`dnrtermin` AS `dnrtermin`,`dnr`.`dnrtgljatuhtempo` AS `dnrtgljatuhtempo`,`dnr`.`dnruraian` AS `dnruraian`,`dnr`.`dnrcatatan` AS `dnrcatatan`,`dnr`.`dnrnoref` AS `dnrnoref`,`dnr`.`dnrtglnoref` AS `dnrtglnoref`,`dnr`.`dnrtglpenutupan` AS `dnrtglpenutupan`,`dnr`.`dnrmatauang` AS `dnrmatauang`,`dnr`.`dnrkurs` AS `dnrkurs`,`dnr`.`dnrhargatermasukpajak` AS `dnrhargatermasukpajak`,`dnr`.`dnrtotal` AS `dnrtotal`,`dnr`.`dnrdiskonpersen` AS `dnrdiskonpersen`,`dnr`.`dnrjmldiskon` AS `dnrjmldiskon`,`dnr`.`dnrtotalpajak1detail` AS `dnrtotalpajak1detail`,`dnr`.`dnrtotalpajak2detail` AS `dnrtotalpajak2detail`,`dnr`.`dnrbiayalainpersen` AS `dnrbiayalainpersen`,`dnr`.`dnrbiayalain` AS `dnrbiayalain`,`dnr`.`dnrtotaltransaksi` AS `dnrtotaltransaksi`,`dnr`.`dnrjmlbayar` AS `dnrjmlbayar`,`dnr`.`dnrstatuslunas` AS `dnrstatuslunas`,`dnr`.`dnrtgllunas` AS `dnrtgllunas`,`dnr`.`dnrnofakturpajak` AS `dnrnofakturpajak`,`dnr`.`dnrsdhbayarpajak` AS `dnrsdhbayarpajak`,`dnr`.`dnrtglbayarpajak` AS `dnrtglbayarpajak`,`dnr`.`dnrrekdiskon` AS `dnrrekdiskon`,`dnr`.`dnrrekpajak1` AS `dnrrekpajak1`,`dnr`.`dnrrekpajak2` AS `dnrrekpajak2`,`dnr`.`dnrrekbiayalain` AS `dnrrekbiayalain`,`dnr`.`dnrrekbayar` AS `dnrrekbayar`,`dnr`.`dnridpr` AS `dnridpr`,`dnr`.`dnridcs` AS `dnridcs`,`dnr`.`dnridrq` AS `dnridrq`,`dnr`.`dnridbs` AS `dnridbs`,`dnr`.`dnridpo` AS `dnridpo`,`dnr`.`dnridipc` AS `dnridipc`,`dnr`.`dnridgrn` AS `dnridgrn`,`dnr`.`dnridri` AS `dnridri`,`dnr`.`dnrstatusprt` AS `dnrstatusprt`,`dnr`.`dnrstatusrealisasi` AS `dnrstatusrealisasi`,`dnr`.`dnrstatus` AS `dnrstatus`,`dnr`.`dnrstatussebelumnya` AS `dnrstatussebelumnya`,`dnr`.`dnrjmlrevisi` AS `dnrjmlrevisi`,`dnr`.`dnrcetakanke` AS `dnrcetakanke`,`dnr`.`dnrinputuser` AS `dnrinputuser`,`dnr`.`dnrinputtgl` AS `dnrinputtgl`,`dnr`.`dnrmodifikasiuser` AS `dnrmodifikasiuser`,`dnr`.`dnrmodifikasitgl` AS `dnrmodifikasitgl`,`dnr`.`dnrposting` AS `dnrposting`,`dnr`.`dnrpostingtgl` AS `dnrpostingtgl`,`dnr`.`dnrtutupperiode` AS `dnrtutupperiode`,`dnr`.`dnrisclose` AS `dnrisclose`,`dnr`.`dnrcustomtext1` AS `dnrcustomtext1`,`dnr`.`dnrcustomtext2` AS `dnrcustomtext2`,`dnr`.`dnrcustomtext3` AS `dnrcustomtext3`,`dnr`.`dnrcustomtext4` AS `dnrcustomtext4`,`dnr`.`dnrcustomtext5` AS `dnrcustomtext5`,`dnr`.`dnrcustomint1` AS `dnrcustomint1`,`dnr`.`dnrcustomint2` AS `dnrcustomint2`,`dnr`.`dnrcustomint3` AS `dnrcustomint3`,`dnr`.`dnrcustomdbl1` AS `dnrcustomdbl1`,`dnr`.`dnrcustomdbl2` AS `dnrcustomdbl2`,`dnr`.`dnrcustomdbl3` AS `dnrcustomdbl3`,`dnr`.`dnrcustomdate1` AS `dnrcustomdate1`,`dnr`.`dnrcustomdate2` AS `dnrcustomdate2`,`dnr`.`dnrcustomdate3` AS `dnrcustomdate3`,`br`.`bnama` AS `dnrcabangnama`,`lc`.`lnama` AS `dnrlokasinama`,`wh`.`wnama` AS `dnrgudangnama`,`c1`.`kkode` AS `dnrsupplierkode`,`c1`.`knama` AS `dnrsuppliernama`,`c2`.`kkode` AS `dnrbagianpembeliankode`,`c2`.`knama` AS `dnrbagianpembeliannama`,`tr`.`trnama` AS `dnrterminnama`,`tr`.`trharijatuhtempo` AS `dnrterminharijatuhtempo`,`coa1`.`cnama` AS `dnrrekdiskonnama`,`coa2`.`cnama` AS `dnrrekpajak1nama`,`coa3`.`cnama` AS `dnrrekpajak2nama`,`coa4`.`cnama` AS `dnrrekbiayalainnama`,`coa5`.`cnama` AS `dnrrekbayarnama`,`grn`.`grnnotransaksi` AS `dnrnotransaksigrn`,`ri`.`rinotransaksi` AS `dnrnotransaksiri`,`st1`.`nama` AS `dnrstatusnama`,`st2`.`nama` AS `dnrstatussebelumnyanama`,`u1`.`unama` AS `dnrinputusernama`,`u2`.`unama` AS `dnrmodifikasiusernama`,`dnrd`.`idhistorydetail` AS `idhistorydetail`,`dnrd`.`idhistory` AS `idhistory`,`dnrd`.`iddnrdetail` AS `iddnrdetail`,`dnrd`.`iddnr` AS `iddnr`,`dnrd`.`idbarang` AS `idbarang`,`dnrd`.`namabarang` AS `namabarang`,`dnrd`.`tipebarang` AS `tipebarang`,`dnrd`.`jml` AS `jml`,`dnrd`.`satuan` AS `satuan`,`dnrd`.`nilaisatuan` AS `nilaisatuan`,`dnrd`.`jmlbarang` AS `jmlbarang`,`dnrd`.`satuanbarang` AS `satuanbarang`,`dnrd`.`matauang` AS `matauang`,`dnrd`.`kurs` AS `kurs`,`dnrd`.`hargafix` AS `hargafix`,`dnrd`.`idhppkhususmasuk` AS `idhppkhususmasuk`,`dnrd`.`idhppfifomasuk` AS `idhppfifomasuk`,`dnrd`.`hpp` AS `hpp`,`dnrd`.`harga` AS `harga`,`dnrd`.`diskon` AS `diskon`,`dnrd`.`jmldiskon` AS `jmldiskon`,`dnrd`.`pajak1` AS `pajak1`,`dnrd`.`jmlpajak1` AS `jmlpajak1`,`dnrd`.`pajak2` AS `pajak2`,`dnrd`.`jmlpajak2` AS `jmlpajak2`,`dnrd`.`cabang` AS `cabang`,`dnrd`.`lokasi` AS `lokasi`,`dnrd`.`gudangasal` AS `gudangasal`,`dnrd`.`gudangtransit` AS `gudangtransit`,`dnrd`.`gudangtujuan` AS `gudangtujuan`,`i`.`brekpersediaan` AS `rekpersediaan`,`dnrd`.`rekdiskonpembelian` AS `rekdiskonpembelian`,`dnrd`.`rekhargapokok` AS `rekhargapokok`,`dnrd`.`rekreturpembelian` AS `rekreturpembelian`,`dnrd`.`costcenter` AS `costcenter`,`dnrd`.`divisi` AS `divisi`,`dnrd`.`subdivisi` AS `subdivisi`,`dnrd`.`proyek` AS `proyek`,`dnrd`.`catatan` AS `catatan`,`dnrd`.`urutan` AS `urutan`,`dnrd`.`idprdetail` AS `idprdetail`,`dnrd`.`idcsdetail` AS `idcsdetail`,`dnrd`.`idrqdetail` AS `idrqdetail`,`dnrd`.`idbsdetail` AS `idbsdetail`,`dnrd`.`idpodetail` AS `idpodetail`,`dnrd`.`idipcdetail` AS `idipcdetail`,`dnrd`.`idgrndetail` AS `idgrndetail`,`dnrd`.`idridetail` AS `idridetail`,`dnrd`.`jmlprt` AS `jmlprt`,`dnrd`.`statusprt` AS `statusprt`,`dnrd`.`jmlrealisasi` AS `jmlrealisasi`,`dnrd`.`statusrealisasi` AS `statusrealisasi`,`dnrd`.`isclose` AS `isclose`,`dnrd`.`customtext1` AS `customtext1`,`dnrd`.`customtext2` AS `customtext2`,`dnrd`.`customtext3` AS `customtext3`,`dnrd`.`customdbl1` AS `customdbl1`,`dnrd`.`customdbl2` AS `customdbl2`,`dnrd`.`customdbl3` AS `customdbl3`,`dnrd`.`customdate1` AS `customdate1`,`dnrd`.`customdate2` AS `customdate2`,`dnrd`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bhpp` AS `bhpp`,`i`.`bjenis` AS `bjenis`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,`t1`.`tnama` AS `pajak1nama`,`t1`.`tnilai` AS `pajak1nilai`,`t2`.`tnama` AS `pajak2nama`,`t2`.`tnilai` AS `pajak2nilai`,`brd`.`bnama` AS `cabangnama`,`lcd`.`lnama` AS `lokasinama`,`whd1`.`wnama` AS `gudangasalnama`,`whd2`.`wnama` AS `gudangtransitnama`,`whd3`.`wnama` AS `gudangtujuannama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama`,`grnd`.`idgrn` AS `idgrn`,`grn2`.`grnnotransaksi` AS `grnnotransaksi`,`ri2`.`rinotransaksi` AS `rinotransaksi`, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan from ((((((((((((((((((((((((((((((((((`m4_dnr_history` `dnr` join `m4_dnr_detail_history` `dnrd` on((`dnr`.`dnridhistory` = `dnrd`.`idhistory`))) left join `m1_branch` `br` on((`br`.`bkode` = `dnr`.`dnrcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `dnr`.`dnrlokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `dnr`.`dnrgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `dnr`.`dnrsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `dnr`.`dnrbagianpembelian`))) left join `m1_terms` `tr` on((`dnr`.`dnrtermin` = `tr`.`trkode`))) left join `m1_coa` `coa1` on((`dnr`.`dnrrekdiskon` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`dnr`.`dnrrekpajak1` = `coa2`.`cnomor`))) left join `m1_coa` `coa3` on((`dnr`.`dnrrekpajak2` = `coa3`.`cnomor`))) left join `m1_coa` `coa4` on((`dnr`.`dnrrekbiayalain` = `coa4`.`cnomor`))) left join `m1_coa` `coa5` on((`dnr`.`dnrrekbayar` = `coa5`.`cnomor`))) left join `m4_grn` `grn` on((`dnr`.`dnridgrn` = `grn`.`grnid`))) left join `m4_ri` `ri` on((`dnr`.`dnridri` = `ri`.`riid`))) left join `m0_status` `st1` on((`st1`.`kode` = `dnr`.`dnrstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `dnr`.`dnrstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `dnr`.`dnrinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `dnr`.`dnrmodifikasiuser`))) left join `m1_item` `i` on((`i`.`bid` = `dnrd`.`idbarang`))) left join `m1_tax` `t1` on((`dnrd`.`pajak1` = `t1`.`tkode`))) left join `m1_tax` `t2` on((`dnrd`.`pajak2` = `t2`.`tkode`))) left join `m1_subdivision` `sd` on((`dnrd`.`subdivisi` = `sd`.`sdkode`))) left join `m4_ri_detail` `rid` on((`dnrd`.`idridetail` = `rid`.`idridetail`))) left join `m4_ri` `ri2` on((`rid`.`idri` = `ri2`.`riid`))) left join `m1_branch` `brd` on((`dnrd`.`cabang` = `brd`.`bkode`))) left join `m1_location` `lcd` on((`dnrd`.`lokasi` = `lcd`.`lkode`))) left join `m1_warehouse` `whd1` on((`dnrd`.`gudangasal` = `whd1`.`wkode`))) left join `m1_warehouse` `whd2` on((`dnrd`.`gudangtransit` = `whd2`.`wkode`))) left join `m1_warehouse` `whd3` on((`dnrd`.`gudangtujuan` = `whd3`.`wkode`))) left join `m1_cost_center` `cc` on((`dnrd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`dnrd`.`divisi` = `d`.`dkode`))) left join `m1_project` `p` on((`dnrd`.`proyek` = `p`.`pkode`))) left join `m4_grn_detail` `grnd` on((`dnrd`.`idgrndetail` = `grnd`.`idgrndetail`))) left join `m4_grn` `grn2` on((`grnd`.`idgrn` = `grn2`.`grnid`)))
```

## Query 61

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_dnr_detail_cd`

```sql
select `dnrd`.`iddnrdetail` AS `iddnrdetail`,`dnrd`.`iddnr` AS `iddnr`,`dnrd`.`idbarang` AS `idbarang`,`dnrd`.`namabarang` AS `namabarang`,`dnrd`.`tipebarang` AS `tipebarang`,`dnrd`.`jml` AS `jml`,`dnrd`.`satuan` AS `satuan`,`dnrd`.`nilaisatuan` AS `nilaisatuan`,`dnrd`.`jmlbarang` AS `jmlbarang`,`dnrd`.`satuanbarang` AS `satuanbarang`,`dnrd`.`matauang` AS `matauang`,`dnrd`.`kurs` AS `kurs`,`dnrd`.`hargafix` AS `hargafix`,`dnrd`.`harga` AS `harga`,`dnrd`.`diskon` AS `diskon`,`dnrd`.`jmldiskon` AS `jmldiskon`,`dnrd`.`pajak1` AS `pajak1`,`dnrd`.`pajak2` AS `pajak2`,`dnrd`.`catatan` AS `catatan`,`dnr`.`dnrnotransaksi` AS `dnrnotransaksi`,`i`.`bkode` AS `kodebarang`,((`dnrd`.`jmlbarang` - `dnrd`.`jmlprt`) / `dnrd`.`nilaisatuan`) AS `jmlsisaprt`,((`dnrd`.`jmlbarang` - `dnrd`.`jmlrealisasi`) / `dnrd`.`nilaisatuan`) AS `jmlsisarealisasi` from ((`m4_dnr_detail` `dnrd` left join `m4_dnr` `dnr` on((`dnrd`.`iddnr` = `dnr`.`dnrid`))) left join `m1_item` `i` on((`dnrd`.`idbarang` = `i`.`bid`)))
```

## Query 62

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_dnr_detail_v`

```sql
select `dnrd`.`iddnrdetail` AS `iddnrdetail`,`dnrd`.`iddnr` AS `iddnr`,`dnrd`.`idbarang` AS `idbarang`,`dnrd`.`namabarang` AS `namabarang`,`dnrd`.`tipebarang` AS `tipebarang`,`dnrd`.`jml` AS `jml`,`dnrd`.`satuan` AS `satuan`,`dnrd`.`nilaisatuan` AS `nilaisatuan`,`dnrd`.`jmlbarang` AS `jmlbarang`,`dnrd`.`satuanbarang` AS `satuanbarang`,`dnrd`.`matauang` AS `matauang`,`dnrd`.`kurs` AS `kurs`,`dnrd`.`hargafix` AS `hargafix`,`dnrd`.`idhppkhususmasuk` AS `idhppkhususmasuk`,`dnrd`.`idhppfifomasuk` AS `idhppfifomasuk`,`dnrd`.`hpp` AS `hpp`,`dnrd`.`harga` AS `harga`,`dnrd`.`diskon` AS `diskon`,`dnrd`.`jmldiskon` AS `jmldiskon`,`dnrd`.`pajak1` AS `pajak1`,`dnrd`.`jmlpajak1` AS `jmlpajak1`,`dnrd`.`pajak2` AS `pajak2`,`dnrd`.`jmlpajak2` AS `jmlpajak2`,`dnrd`.`cabang` AS `cabang`,`dnrd`.`lokasi` AS `lokasi`,`dnrd`.`gudangasal` AS `gudangasal`,`dnrd`.`gudangtransit` AS `gudangtransit`,`dnrd`.`gudangtujuan` AS `gudangtujuan`,`i`.`brekpersediaan` AS `rekpersediaan`,`dnrd`.`rekdiskonpembelian` AS `rekdiskonpembelian`,`dnrd`.`rekhargapokok` AS `rekhargapokok`,`dnrd`.`rekreturpembelian` AS `rekreturpembelian`,`dnrd`.`costcenter` AS `costcenter`,`dnrd`.`divisi` AS `divisi`,`dnrd`.`subdivisi` AS `subdivisi`,`dnrd`.`proyek` AS `proyek`,`dnrd`.`catatan` AS `catatan`,`dnrd`.`urutan` AS `urutan`,`dnrd`.`idprdetail` AS `idprdetail`,`dnrd`.`idcsdetail` AS `idcsdetail`,`dnrd`.`idrqdetail` AS `idrqdetail`,`dnrd`.`idbsdetail` AS `idbsdetail`,`dnrd`.`idpodetail` AS `idpodetail`,`dnrd`.`idipcdetail` AS `idipcdetail`,`dnrd`.`idgrndetail` AS `idgrndetail`,`dnrd`.`idridetail` AS `idridetail`,`dnrd`.`jmlprt` AS `jmlprt`,`dnrd`.`statusprt` AS `statusprt`,`dnrd`.`jmlrealisasi` AS `jmlrealisasi`,`dnrd`.`statusrealisasi` AS `statusrealisasi`,`dnrd`.`isclose` AS `isclose`,`dnrd`.`customtext1` AS `customtext1`,`dnrd`.`customtext2` AS `customtext2`,`dnrd`.`customtext3` AS `customtext3`,`dnrd`.`customdbl1` AS `customdbl1`,`dnrd`.`customdbl2` AS `customdbl2`,`dnrd`.`customdbl3` AS `customdbl3`,`dnrd`.`customdate1` AS `customdate1`,`dnrd`.`customdate2` AS `customdate2`,`dnrd`.`customdate3` AS `customdate3`,`dnr`.`dnrnotransaksi` AS `dnrnotransaksi`,`dnr`.`dnruraian` AS `dnruraian`,`dnr`.`dnrcatatan` AS `dnrcatatan`,`dnr`.`dnrnoref` AS `dnrnoref`,`dnr`.`dnrtglnoref` AS `dnrtglnoref`,`dnr`.`dnrnofakturpajak` AS `dnrnofakturpajak`,`dnr`.`dnrsupplierkontak` AS `dnrsupplierkontak`,`dnr`.`dnr1alamat1` AS `dnr1alamat1`,`dnr`.`dnr1alamat2` AS `dnr1alamat2`,`dnr`.`dnr1alamat3` AS `dnr1alamat3`,`dnr`.`dnr2alamat1` AS `dnr2alamat1`,`dnr`.`dnr2alamat2` AS `dnr2alamat2`,`dnr`.`dnr2alamat3` AS `dnr2alamat3`,`dnr`.`dnrtermin` AS `dnrtermin`,`tr`.`trnama` AS `dnrterminnama`,`tr`.`trharijatuhtempo` AS `dnrterminharijatuhtempo`,`dnr`.`dnrbagianpembelian` AS `dnrbagianpembelian`,`c1`.`kkode` AS `dnrbagianpembeliankode`,`c1`.`knama` AS `dnrbagianpembeliannama`,`i`.`bkode` AS `kodebarang`,`i`.`bhpp` AS `bhpp`,`i`.`bjenis` AS `bjenis`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,`t1`.`tnama` AS `pajak1nama`,`t1`.`tnilai` AS `pajak1nilai`,`t2`.`tnama` AS `pajak2nama`,`t2`.`tnilai` AS `pajak2nilai`,((`dnrd`.`jmlbarang` - `dnrd`.`jmlprt`) / `dnrd`.`nilaisatuan`) AS `jmlsisaprt`,((`dnrd`.`jmlbarang` - `dnrd`.`jmlrealisasi`) / `dnrd`.`nilaisatuan`) AS `jmlsisarealisasi`, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan from ((((((`m4_dnr_detail` `dnrd` left join `m4_dnr` `dnr` on((`dnrd`.`iddnr` = `dnr`.`dnrid`))) left join `m1_terms` `tr` on((`dnr`.`dnrtermin` = `tr`.`trkode`))) left join `m1_contact` `c1` on((`dnr`.`dnrbagianpembelian` = `c1`.`kid`))) left join `m1_item` `i` on((`dnrd`.`idbarang` = `i`.`bid`))) left join `m1_tax` `t1` on((`dnrd`.`pajak1` = `t1`.`tkode`))) left join `m1_tax` `t2` on((`dnrd`.`pajak2` = `t2`.`tkode`)))
```

## Query 63

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
select `nbt`.`nbtid` AS `nbtid`,`nbt`.`nbtjenismutasi` AS `nbtjenismutasi`,`nbt`.`nbtidbatchin` AS `nbtidbatchin`,`nbt`.`nbtgudang` AS `nbtgudang`,`nbt`.`nbtidbarang` AS `nbtidbarang`,`nbt`.`nbtkode` AS `nbtkode`,`nbt`.`nbtsumber` AS `nbtsumber`,`nbt`.`nbtidtransaksi` AS `nbtidtransaksi`,`nbt`.`nbtsatuan` AS `nbtsatuan`,`nbt`.`nbtjml` AS `nbtjml`,`nbt`.`nbtcustomtext1` AS `nbtcustomtext1`,`nbt`.`nbtcustomtext2` AS `nbtcustomtext2`,`nbt`.`nbtcustomtext3` AS `nbtcustomtext3`,`nbt`.`nbtcustomdbl1` AS `nbtcustomdbl1`,`nbt`.`nbtcustomdbl2` AS `nbtcustomdbl2`,`nbt`.`nbtcustomdbl3` AS `nbtcustomdbl3`,`nbt`.`nbtcustomdate1` AS `nbtcustomdate1`,`nbt`.`nbtcustomdate2` AS `nbtcustomdate2`,`nbt`.`nbtcustomdate3` AS `nbtcustomdate3`,`i`.`bkode` AS `kodebarang` from ((`m1_no_batch_transaction` `nbt` join `m1_item` `i` on((`nbt`.`nbtidbarang` = `i`.`bid`))) left join `m1_no_batch_in` `nbi` on((`nbt`.`nbtidbatchin` = `nbi`.`nbiidbatchin`)))
```

## Query 64

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr_history.vb`

```sql
select `nbt`.`nbtidhistory` AS `nbtidhistory`, `nbt`.`nbtidtransaksihistory` AS `nbtidtransaksihistory`,`nbt`.`nbtid` AS `nbtid`,`nbt`.`nbtjenismutasi` AS `nbtjenismutasi`,`nbt`.`nbtidbatchin` AS `nbtidbatchin`,`nbt`.`nbtgudang` AS `nbtgudang`,`nbt`.`nbtidbarang` AS `nbtidbarang`,`nbt`.`nbtkode` AS `nbtkode`,`nbt`.`nbtsumber` AS `nbtsumber`,`nbt`.`nbtidtransaksi` AS `nbtidtransaksi`,`nbt`.`nbtsatuan` AS `nbtsatuan`,`nbt`.`nbtjml` AS `nbtjml`,`nbt`.`nbtcustomtext1` AS `nbtcustomtext1`,`nbt`.`nbtcustomtext2` AS `nbtcustomtext2`,`nbt`.`nbtcustomtext3` AS `nbtcustomtext3`,`nbt`.`nbtcustomdbl1` AS `nbtcustomdbl1`,`nbt`.`nbtcustomdbl2` AS `nbtcustomdbl2`,`nbt`.`nbtcustomdbl3` AS `nbtcustomdbl3`,`nbt`.`nbtcustomdate1` AS `nbtcustomdate1`,`nbt`.`nbtcustomdate2` AS `nbtcustomdate2`,`nbt`.`nbtcustomdate3` AS `nbtcustomdate3`,`i`.`bkode` AS `kodebarang` from ((`m1_no_batch_transaction_history` `nbt` join `m1_item` `i` on((`nbt`.`nbtidbarang` = `i`.`bid`))) left join `m1_no_batch_in` `nbi` on((`nbt`.`nbtidbatchin` = `nbi`.`nbiidbatchin`)))
```

## Query 65

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
select `nst`.`nstid` AS `nstid`,`nst`.`nstjenismutasi` AS `nstjenismutasi`,`nst`.`nstidserialin` AS `nstidserialin`,`nst`.`nstgudang` AS `nstgudang`,`nst`.`nstidbarang` AS `nstidbarang`,`nst`.`nstkode` AS `nstkode`,`nst`.`nstsumber` AS `nstsumber`,`nst`.`nstidtransaksi` AS `nstidtransaksi`,`nst`.`nstsatuan` AS `nstsatuan`,`nst`.`nstjml` AS `nstjml`,`nst`.`nstcustomtext1` AS `nstcustomtext1`,`nst`.`nstcustomtext2` AS `nstcustomtext2`,`nst`.`nstcustomtext3` AS `nstcustomtext3`,`nst`.`nstcustomdbl1` AS `nstcustomdbl1`,`nst`.`nstcustomdbl2` AS `nstcustomdbl2`,`nst`.`nstcustomdbl3` AS `nstcustomdbl3`,`nst`.`nstcustomdate1` AS `nstcustomdate1`,`nst`.`nstcustomdate2` AS `nstcustomdate2`,`nst`.`nstcustomdate3` AS `nstcustomdate3`,`i`.`bkode` AS `kodebarang` from ((`m1_no_serial_transaction` `nst` join `m1_item` `i` on((`nst`.`nstidbarang` = `i`.`bid`))) left join `m1_no_serial_in` `nsi` on((`nst`.`nstidserialin` = `nsi`.`nsiidserialin`)))
```

## Query 66

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr_history.vb`

```sql
select `nst`.`nstidhistory` AS `nstidhistory`,`nst`.`nstidtransaksihistory` AS `nstidtransaksihistory`,`nst`.`nstid` AS `nstid`,`nst`.`nstjenismutasi` AS `nstjenismutasi`,`nst`.`nstidserialin` AS `nstidserialin`,`nst`.`nstgudang` AS `nstgudang`,`nst`.`nstidbarang` AS `nstidbarang`,`nst`.`nstkode` AS `nstkode`,`nst`.`nstsumber` AS `nstsumber`,`nst`.`nstidtransaksi` AS `nstidtransaksi`,`nst`.`nstsatuan` AS `nstsatuan`,`nst`.`nstjml` AS `nstjml`,`nst`.`nstcustomtext1` AS `nstcustomtext1`,`nst`.`nstcustomtext2` AS `nstcustomtext2`,`nst`.`nstcustomtext3` AS `nstcustomtext3`,`nst`.`nstcustomdbl1` AS `nstcustomdbl1`,`nst`.`nstcustomdbl2` AS `nstcustomdbl2`,`nst`.`nstcustomdbl3` AS `nstcustomdbl3`,`nst`.`nstcustomdate1` AS `nstcustomdate1`,`nst`.`nstcustomdate2` AS `nstcustomdate2`,`nst`.`nstcustomdate3` AS `nstcustomdate3`,`i`.`bkode` AS `kodebarang` from ((`m1_no_serial_transaction_history` `nst` join `m1_item` `i` on((`nst`.`nstidbarang` = `i`.`bid`))) left join `m1_no_serial_in` `nsi` on((`nst`.`nstidserialin` = `nsi`.`nsiidserialin`)))
```

## Query 67

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
select atr.atid AS atid, atr.atasetid AS atasetid, atr.atjenismutasi AS atjenismutasi, atr.atsumber AS atsumber, atr.atidutama AS atidutama,atr.atidbarang AS atidbarang,atr.atkode AS atkode, atr.atnama AS atnama, atr.atkategori AS atkategori, atr.atcabang AS atcabang, atr.atlokasi AS atlokasi, atr.atgudang AS atgudang,atr.atdivisi AS atdivisi, atr.atsubdivisi AS atsubdivisi, atr.atcostcenter AS atcostcenter, atr.atproyek AS atproyek, atr.atcatatan AS atcatatan, atr.atnomor AS atnomor, atr.attglbeli AS attglbeli, atr.attglpakai AS attglpakai, atr.atjml AS atjml, atr.atsatuan AS atsatuan, atr.atmatauang AS atmatauang, atr.atkurs AS atkurs, atr.atharga AS atharga, atr.atdiskon AS atdiskon, atr.atjmldiskon AS atjmldiskon, atr.atpajak1 AS atpajak1, atr.atjmlpajak1 AS atjmlpajak1, atr.atpajak2 AS atpajak2, atr.atjmlpajak2 AS atjmlpajak2, atr.athargabeli AS athargabeli, atr.atnilairesidu AS atnilairesidu, atr.atumurekonomis AS atumurekonomis, atr.atbebanperbln AS atbebanperbln, atr.atakumulasibeban AS atakumulasibeban, atr.atnilaibuku AS atnilaibuku, (CASE WHEN atr.atnilaibuku < atr.atbebanperbln THEN atr.atnilaibuku ELSE atr.atbebanperbln END) as atnilaipenyusutan, atr.atmetode AS atmetode, atr.attabelpenyusutan AS attabelpenyusutan, atr.atintangible AS atintangible, atr.atfiskal AS atfiskal, atr.atatastengahbulan AS atatastengahbulan, atr.atrekasset AS atrekasset, atr.atrekakumdepresiasi AS atrekakumdepresiasi, atr.atrekdepresiasi AS atrekdepresiasi, atr.atrekpenghapusan AS atrekpenghapusan, atr.atprodusen AS atprodusen, atr.attglpensiun AS attglpensiun, atr.atpenyusutanke AS atpenyusutanke, atr.atnilaimenurun AS atnilaimenurun, atr.atdispose AS atdispose, atr.atpembelian AS atpembelian, atr.atpenjualan AS atpenjualan, atr.atlocked AS atlocked, atr.atstatus AS atstatus, atr.atstatussebelumnya AS atstatussebelumnya, atr.atisclose AS atisclose, atr.atinputuser AS atinputuser, atr.atinputtgl AS atinputtgl, atr.atmodifikasiuser AS atmodifikasiuser, atr.atmodifikasitgl AS atmodifikasitgl, atr.atcustomtext1,atr.atcustomtext2,atr.atcustomtext3,atr.atcustomtext4,atr.atcustomtext5,atr.atcustomint1,atr.atcustomint2,atr.atcustomint3,atr.atcustomint4,atr.atcustomint5,atr.atcustomdbl1,atr.atcustomdbl2,atr.atcustomdbl3,atr.atcustomdbl4,atr.atcustomdbl5,atr.atcustomdate1,atr.atcustomdate2,atr.atcustomdate3,atr.atcustomdate4,atr.atcustomdate5,ac.acnama AS atkategorinama, br.bnama AS atcabangnama, l.lnama AS atlokasinama, w.wnama AS atgudangnama,d.dnama AS atdivisinama, sd.sdnama AS atsubdivisinama, cc.ccnama AS atcostcenternama, p.pnama AS atproyeknama, dc.nama AS atmetodenama, t1.tnama AS atpajak1nama, ifnull(t1.tnilai, 0) AS atpajak1nilai, t2.tnama AS atpajak2nama, ifnull(t2.tnilai, 0) AS atpajak2nilai,coa1.cnama AS atrekassetnama, coa2.cnama AS atrekakumdepresiasinama, coa3.cnama AS atrekdepresiasinama, coa4.cnama AS atrekpenghapusannama, c1.kkode AS atprodusenkode, c1.knama AS atprodusennama, sp1.nama AS atstatusnama, sp2.nama AS atstatussebelumnyanama, u1.unama AS atinputusernama, u2.unama AS atmodifikasiusernama from m7_asset_transaction atr left join m7_asset_category ac on atr.atkategori = ac.ackode left join m1_branch br on atr.atcabang = br.bkode left join m1_location l on atr.atlokasi = l.lkode left join m1_warehouse w on atr.atgudang = w.wkode left join m1_division d on atr.atdivisi = d.dkode left join m1_subdivision sd on atr.atsubdivisi = sd.sdkode left join m7_depreciation_category dc on atr.atmetode = dc.kode left join m1_coa coa1 on atr.atrekasset = coa1.cnomor left join m1_coa coa2 on atr.atrekakumdepresiasi = coa2.cnomor left join m1_coa coa3 on atr.atrekdepresiasi = coa3.cnomor left join m1_coa coa4 on atr.atrekpenghapusan = coa4.cnomor left join m1_contact c1 on atr.atprodusen = c1.kid left join m0_status_progress sp1 on atr.atstatus = sp1.kode left join m0_status_progress sp2 on atr.atstatussebelumnya = sp2.kode left join m0_user u1 on atr.atinputuser = u1.userid left join m0_user u2 on atr.atmodifikasiuser = u2.userid left join m1_cost_center cc on atr.atcostcenter = cc.cckode left join m1_project p on atr.atproyek = p.pkode left join m1_tax t1 on atr.atpajak1 = t1.tkode left join m1_tax t2 on atr.atpajak2 = t2.tkode
```

## Query 68

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_dnr.vb`

```sql
select dnrd.iddnrdetail AS iddnrdetail, dnrd.iddnr AS iddnr, dnrd.idbarang AS idbarang, dnrd.namabarang AS namabarang, dnrd.tipebarang AS tipebarang, dnrd.jml AS jml, dnrd.satuan AS satuan, dnrd.nilaisatuan AS nilaisatuan, dnrd.jmlbarang AS jmlbarang, dnrd.satuanbarang AS satuanbarang, dnrd.matauang AS matauang, dnrd.kurs AS kurs, dnrd.hargafix AS hargafix, dnrd.idhppkhususmasuk AS idhppkhususmasuk, dnrd.idhppfifomasuk AS idhppfifomasuk, dnrd.hpp AS hpp, dnrd.harga AS harga, dnrd.diskon AS diskon, dnrd.jmldiskon AS jmldiskon, dnrd.pajak1 AS pajak1, dnrd.jmlpajak1 AS jmlpajak1, dnrd.pajak2 AS pajak2, dnrd.jmlpajak2 AS jmlpajak2, dnrd.cabang AS cabang, dnrd.lokasi AS lokasi, dnrd.gudangasal AS gudangasal, dnrd.gudangtransit AS gudangtransit, dnrd.gudangtujuan AS gudangtujuan, i.brekpersediaan AS rekpersediaan, dnrd.rekdiskonpembelian AS rekdiskonpembelian, dnrd.rekhargapokok AS rekhargapokok, dnrd.rekreturpembelian AS rekreturpembelian, dnrd.costcenter AS costcenter, dnrd.divisi AS divisi, dnrd.subdivisi AS subdivisi, dnrd.proyek AS proyek, dnrd.catatan AS catatan, dnrd.urutan AS urutan, dnrd.idprdetail AS idprdetail, dnrd.idcsdetail AS idcsdetail, dnrd.idrqdetail AS idrqdetail, dnrd.idbsdetail AS idbsdetail, dnrd.idpodetail AS idpodetail, dnrd.idipcdetail AS idipcdetail, dnrd.idgrndetail AS idgrndetail, dnrd.idridetail AS idridetail, dnrd.jmlprt AS jmlprt, dnrd.statusprt AS statusprt, dnrd.jmlrealisasi AS jmlrealisasi, dnrd.statusrealisasi AS statusrealisasi, dnrd.isclose AS isclose, dnrd.customtext1 AS customtext1, dnrd.customtext2 AS customtext2, dnrd.customtext3 AS customtext3, dnrd.customdbl1 AS customdbl1, dnrd.customdbl2 AS customdbl2, dnrd.customdbl3 AS customdbl3, dnrd.customdate1 AS customdate1, dnrd.customdate2 AS customdate2, dnrd.customdate3 AS customdate3, dnr.dnrnotransaksi AS dnrnotransaksi, dnr.dnruraian AS dnruraian, dnr.dnrcatatan AS dnrcatatan, dnr.dnrnoref AS dnrnoref, dnr.dnrtglnoref AS dnrtglnoref, dnr.dnrnofakturpajak AS dnrnofakturpajak, dnr.dnrsupplierkontak AS dnrsupplierkontak, dnr.dnr1alamat1 AS dnr1alamat1, dnr.dnr1alamat2 AS dnr1alamat2, dnr.dnr1alamat3 AS dnr1alamat3, dnr.dnr2alamat1 AS dnr2alamat1, dnr.dnr2alamat2 AS dnr2alamat2, dnr.dnr2alamat3 AS dnr2alamat3, dnr.dnrtermin AS dnrtermin, tr.trnama AS dnrterminnama, tr.trharijatuhtempo AS dnrterminharijatuhtempo, dnr.dnrbagianpembelian AS dnrbagianpembelian, c1.kkode AS dnrbagianpembeliankode, c1.knama AS dnrbagianpembeliannama, i.bkode AS kodebarang, i.bhpp AS bhpp, i.bjenis AS bjenis, i.bserial AS bserial, i.bbatch AS bbatch, t1.tnama AS pajak1nama, t1.tnilai AS pajak1nilai, t2.tnama AS pajak2nama, t2.tnilai AS pajak2nilai, ((dnrd.jmlbarang - dnrd.jmlprt) / dnrd.nilaisatuan) AS jmlsisaprt, ((dnrd.jmlbarang - dnrd.jmlrealisasi) / dnrd.nilaisatuan) AS jmlsisarealisasi, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan, ri.rinotransaksi, i.basset, ri.ricustomtext1, ri.ricustomtext2, t1.takunbeli as pajak1akunbeli, t1c1.cnama as pajak1akunbelinama, t1.takunjual as pajak1akunjual, t1c2.cnama as pajak1akunjualnama, t2.takunbeli as pajak2akunbeli, t2c1.cnama as pajak2akunbelinama, t2.takunjual as pajak2akunjual, t2c2.cnama as pajak2akunjualnama from m4_dnr_detail dnrd join m4_dnr dnr on dnrd.iddnr = dnr.dnrid join m1_item i on dnrd.idbarang = i.bid left join m1_terms tr on dnr.dnrtermin = tr.trkode left join m1_contact c1 on dnr.dnrbagianpembelian = c1.kid left join m1_tax t1 on dnrd.pajak1 = t1.tkode left join m1_tax t2 on dnrd.pajak2 = t2.tkode left join m4_ri_detail rid on dnrd.idridetail = rid.idridetail left join m4_ri ri on rid.idri = ri.riid left join m1_coa t1c1 on t1.takunbeli = t1c1.cnomor left join m1_coa t1c2 on t1.takunjual = t1c2.cnomor left join m1_coa t2c1 on t2.takunbeli = t2c1.cnomor left join m1_coa t2c2 on t2.takunjual = t2c2.cnomor
```

