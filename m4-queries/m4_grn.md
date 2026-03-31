# M4_GRN Queries

## Query 1

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
DELETE FROM M2_Transaction_Journal WHERE tsumber = '{sumber}' AND tidtransaksi = '{idtransaksi}' AND tnotransaksi = '{notransaksi}'
```

## Query 2

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
DELETE FROM M4_Grn WHERE grnid = '{idtransaksi}'
```

## Query 3

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
DELETE FROM M4_Grn_Detail WHERE idgrn = '{idtransaksi}'
```

## Query 4

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
DELETE FROM M4_grn_Cost WHERE idgrn ='{idtransaksi}'
```

## Query 5

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
DELETE FROM m1_cogs_fifo_in WHERE {ftHppF}
```

## Query 6

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
DELETE FROM m1_cogs_special_in WHERE {ftHppI}
```

## Query 7

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
DELETE FROM m1_item_transaction WHERE sumber = '{sumber}' AND idutama = '{idtransaksi}'
```

## Query 8

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
DELETE FROM m1_no_batch_in WHERE nbisumber = '{sumber}' AND nbiidtransaksi = '{idtransaksi}'
```

## Query 9

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
DELETE FROM m1_no_serial_in WHERE nsisumber = '{sumber}' AND nsiidtransaksi = '{idtransaksi}'
```

## Query 10

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
DELETE a FROM m7_asset_transaction atr JOIN m4_grn grn ON atr.atsumber = grn.grnsumber AND atr.atidutama = grn.grnid AND grn.grnid = '{idtransaksi}' JOIN m7_asset a ON atr.atkode = a.akode
```

## Query 11

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
Delete from M1_No_Batch_Transaction where nbtidtransaksi = '{idtransaksi}' AND nbtsumber = '{sumber}'
```

## Query 12

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
Delete from M1_No_Batch_Transaction where nbtidtransaksi = '{result_4}' AND nbtsumber = 'GRN'
```

## Query 13

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
Delete from M1_No_Serial_Transaction where nstidtransaksi = '{idtransaksi}' AND nstsumber = '{sumber}'
```

## Query 14

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
Delete from M1_No_Serial_Transaction where nstidtransaksi = '{result_4}' AND nstsumber = 'GRN'
```

## Query 15

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
Delete from M4_Grn_Detail where idgrn = '{result_4}'
```

## Query 16

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
Delete from M4_grn_Cost where idgrn = {result_4}
```

## Query 17

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
Delete from M7_Asset_Transaction where atidutama = '{idtransaksi}' AND atsumber = '{sumber}'
```

## Query 18

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
Delete from M7_Asset_Transaction where atidutama = '{result_4}' AND atsumber = 'GRN'
```

## Query 19

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
INSERT INTO m1_item_booking_po (idbarang, gudang, jmlbooking) VALUES {updStokInBooking} ON DUPLICATE KEY UPDATE jmlbooking = jmlbooking + VALUES(jmlbooking)
```

## Query 20

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
INSERT INTO m1_item_booking_po (idbarang, gudang, jmlbooking) VALUES {updStokOutBooking} ON DUPLICATE KEY UPDATE jmlbooking = jmlbooking + VALUES(jmlbooking)
```

## Query 21

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
INSERT INTO m1_item_stock_warehouse (idbarang, kgudang, stok) VALUES ('{idbarang}','{gudang}','{jmlbarang}') ON DUPLICATE KEY UPDATE stok = stok + VALUES(stok)
```

## Query 22

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
INSERT INTO m1_item_stock_warehouse (idbarang, kgudang, stok) VALUES {updStokOut} ON DUPLICATE KEY UPDATE stok = stok + VALUES(stok)
```

## Query 23

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn_history.vb`

```sql
INSERT INTO m1_no_batch_transaction_history(SELECT 0, '{result_4}', nb.* FROM m1_no_batch_transaction nb WHERE nb.nbtidtransaksi = '{idtransaksi}' and nb.nbtsumber = 'GRN')
```

## Query 24

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn_history.vb`

```sql
INSERT INTO m1_no_serial_transaction_history(SELECT 0, '{result_4}', ns.* FROM m1_no_serial_transaction ns WHERE ns.nstidtransaksi = '{idtransaksi}' and ns.nstsumber = 'GRN')
```

## Query 25

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn_history.vb`

```sql
INSERT INTO m4_grn_cost_history (SELECT 0, '{result_4}', grn.* FROM m4_grn_cost grn WHERE grn.idgrn = '{idtransaksi}' )
```

## Query 26

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn_history.vb`

```sql
INSERT INTO m4_grn_detail_history (SELECT 0, '{result_4}', grn.* FROM m4_grn_detail grn WHERE grn.idgrn = '{idtransaksi}' )
```

## Query 27

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn_history.vb`

```sql
INSERT INTO m4_grn_history(SELECT 0, grn.* FROM m4_grn grn WHERE grn.grnid = '{idtransaksi}')
```

## Query 28

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn_history.vb`

```sql
INSERT INTO m7_asset_transaction_history(SELECT 0, '{result_4}', atr.* FROM m7_asset_transaction atr WHERE atr.atidutama = '{idtransaksi}' and atr.atsumber = 'GRN')
```

## Query 29

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
Insert into M0_Msmq_Cogs(mcid, mcsumber, mcidtransaksi, mcprogress, mcpesan, mctglantrian, mctglselesai, mcuserid) values ('{mjid}', '{sumber}', '{result_4}', '{0}', '', NOW(), '1971-01-01 00:00:00', '{userid}')
```

## Query 30

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
Insert into M0_Userlog (uluserid, ulidmodule, ulidmenu, uljenisaktivitas, ulaktivitas, ultgl, ulkodepa) values({userid}, {mdlid}, {mnid}, {jnsaktivitas}, '{notransaksi}', NOW(), {0})
```

## Query 31

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
Insert into M1_Item_Transaction (id, cabang, lokasi, gudang, kodepa, jenismutasi, sumber, idutama, iddetail, notransaksi, tgl, kontak, idbarang, namabarang, tipebarang, tipehpp, jml, satuan, jmlbarang, satuanbarang, matauang, kurs, harga, diskon, jmldiskon, idhppikm, idhppikk, hpp, uraian, catatan, catatandetail, costcenter, divisi, subdivisi, proyek, saldojml, saldohpp, saldonilai, inputtgl, inputuser, postingtgl, updatehpp, postinghpp, hppfix, postingjurnal, jurnalfix, tutupperiode, isclose, customtext1, customtext2, customtext3, customtext4, customtext5, customtext6, customtext7, customtext8, customtext9, customtext10, customint1, customint2, customint3, customint4, customint5, customint6, customint7, customint8, customint9, customint10, customdbl1, customdbl2, customdbl3, customdbl4, customdbl5, customdbl6, customdbl7, customdbl8, customdbl9, customdbl10, customdate1, customdate2, customdate3, customdate4, customdate5, customdate6, customdate7, customdate8, customdate9, customdate10) values{strTransaksiBarang.ToString}
```

## Query 32

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
Insert into M1_No_Batch_In(nbiidbatchin, nbigudang, nbiidbarang, nbikode, nbisumber, nbiidtransaksi, nbisatuan, nbijmlmasuk, nbijmlkeluar, nbijmlsisa, nbiisclose, nbicustomtext1, nbicustomtext2, nbicustomtext3, nbicustomdbl1, nbicustomdbl2, nbicustomdbl3, nbicustomdate1, nbicustomdate2, nbicustomdate3) values{strValue2.ToString}
```

## Query 33

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
Insert into M1_No_Batch_Transaction(nbtid, nbtjenismutasi, nbtidbatchin, nbtgudang, nbtidbarang, nbtkode, nbtsumber, nbtidtransaksi, nbtsatuan, nbtjml, nbtcustomtext1, nbtcustomtext2, nbtcustomtext3, nbtcustomdbl1, nbtcustomdbl2, nbtcustomdbl3, nbtcustomdate1, nbtcustomdate2, nbtcustomdate3) values{strValue2.ToString}
```

## Query 34

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
Insert into M1_No_Serial_In(nsiidserialin, nsigudang, nsiidbarang, nsikode, nsisumber, nsiidtransaksi, nsisatuan, nsijmlmasuk, nsijmlkeluar, nsijmlsisa, nsiisclose, nsicustomtext1, nsicustomtext2, nsicustomtext3, nsicustomdbl1, nsicustomdbl2, nsicustomdbl3, nsicustomdate1, nsicustomdate2, nsicustomdate3) values{strValue2.ToString}
```

## Query 35

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
Insert into M1_No_Serial_Transaction(nstid, nstjenismutasi, nstidserialin, nstgudang, nstidbarang, nstkode, nstsumber, nstidtransaksi, nstsatuan, nstjml, nstcustomtext1, nstcustomtext2, nstcustomtext3, nstcustomdbl1, nstcustomdbl2, nstcustomdbl3, nstcustomdate1, nstcustomdate2, nstcustomdate3) values{strValue2.ToString}
```

## Query 36

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
Insert into M4_Grn (grncabang, grnlokasi, grngudang, grnasalbarang, grnasalbarangkategori, grnjenispembelian, grnjenispembeliankategori, grncarabayar, grnsumber, grnautonotransaksi, grnnotransaksi, grntgl, grnkodepa, grnsupplier, grnsupplierkontak, grn1alamat1, grn1alamat2, grn1alamat3, grn2alamat1, grn2alamat2, grn2alamat3, grnbagianpembelian, grntermin, grntgljatuhtempo, grnuraian, grncatatan, grnnoref, grntglnoref, grntglpenutupan, grnmatauang, grnkurs, grnhargatermasukpajak, grntotal, grndiskonpersen, grnjmldiskon, grntotalpajak1detail, grntotalpajak2detail, grnbiayalainpersen, grnbiayalain, grntotaltransaksi, grnjmlbayar, grnrekdiskon, grnrekpajak1, grnrekpajak2, grnrekbiayalain, grnrekbayar, grnidpr, grnidcs, grnidrq, grnidbs, grnidpo, grnidipc, grnstatusri, grnstatusdnr, grnstatusprt, grnstatus, grnstatussebelumnya, grnjmlrevisi, grncetakanke, grninputuser, grninputtgl, grnmodifikasiuser, grnmodifikasitgl, grnposting, grntutupperiode, grnisclose, grncustomtext1, grncustomtext2, grncustomtext3, grncustomtext4, grncustomtext5, grncustomint1, grncustomint2, grncustomint3, grncustomdbl1, grncustomdbl2, grncustomdbl3, grncustomdate1, grncustomdate2, grncustomdate3) values('{grncabang}', '{grnlokasi}', '{grngudang}', '{grnasalbarang}', {grnasalbarangkategori}, '{grnjenispembelian}', {grnjenispembeliankategori}, {grncarabayar}, '{grnsumber}', {grnautonotransaksi}, '{notransaksi}', '{grntgl}', {grnkodepa}, {grnsupplier}, '{grnsupplierkontak}', '{grn1alamat1}', '{grn1alamat2}', '{grn1alamat3}', '{grn2alamat1}', '{grn2alamat2}', '{grn2alamat3}', {grnbagianpembelian}, '{grntermin}', '{grntgljatuhtempo}', '{grnuraian}', '{grncatatan}', '{grnnoref}', '{grntglnoref}', '{grntglpenutupan}', '{grnmatauang}', '{grnkurs}', {grnhargatermasukpajak}, '{grntotal}', '{grndiskonpersen}', '{grnjmldiskon}', '{grntotalpajak1detail}', '{grntotalpajak2detail}', '{grnbiayalainpersen}', '{grnbiayalain}', '{grntotaltransaksi}', '{grnjmlbayar}', '{grnrekdiskon}', '{grnrekpajak1}', '{grnrekpajak2}', '{grnrekbiayalain}', '{grnrekbayar}', {grnidpr}, {grnidcs}, {grnidrq}, {grnidbs}, {grnidpo}, {grnidipc}, {grnstatusri}, {grnstatusdnr}, {grnstatusprt}, {grnstatus}, {grnstatussebelumnya}, {grnjmlrevisi}, {grncetakanke}, {grninputuser}, NOW(), {grnmodifikasiuser}, '1971-01-01 00:00:00', 0, {grntutupperiode}, {grnisclose}, '{grncustomtext1}', '{grncustomtext2}', '{grncustomtext3}', '{grncustomtext4}', '{grncustomtext5}', {grncustomint1}, {grncustomint2}, {grncustomint3}, '{grncustomdbl1}', '{grncustomdbl2}', '{grncustomdbl3}', '{grncustomdate1}', '{grncustomdate2}', '{grncustomdate3}')
```

## Query 37

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
Insert into M4_Grn_Cost(idgrncost, idgrn, kodecost, matauang, kurs, jumlah, rekdebit, rekkredit, kontak, termasukhpp, catatan, costcenter, divisi, subdivisi, proyek, urutan, idprcost, idcscost, idrqcost, idbscost, idpocost, idipccost, jumlahri, statusri, jumlahbayar, statusbayar, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2.ToString}
```

## Query 38

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
Insert into M4_Grn_Detail(idgrndetail, idgrn, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, hargafix, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudang, rekpersediaan, rekdiskonpembelian, rekhutangsementara, costcenter, divisi, subdivisi, proyek, catatan, urutan, idprdetail, idcsdetail, idrqdetail, idbsdetail, idpodetail, idipcdetail, jmlri, statusri, jmldnr, statusdnr, jmlprt, statusprt, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2.ToString}
```

## Query 39

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
Insert into M7_Asset(aid, akode, anama, akategori, acabang, alokasi, agudang, adivisi, asubdivisi, acostcenter, aproyek, acatatan, anomor, atglbeli, atglpakai, ajml, asatuan, amatauang, akurs, aharga, adiskon, ajmldiskon, apajak1, ajmlpajak1, apajak2, ajmlpajak2, ahargabeli, anilairesidu, aumurekonomis, abebanperbln, aakumulasibeban, anilaibuku, ametode, atabelpenyusutan, aintangible, afiskal, aatastengahbulan, arekasset, arekakumdepresiasi, arekdepresiasi, arekpenghapusan, aprodusen, atglpensiun, apenyusutanke, anilaimenurun, adispose, apembelian, apenjualan, alocked, astatus, astatussebelumnya, aisclose, ainputuser, ainputtgl, amodifikasiuser, amodifikasitgl, acustomtext1, acustomtext2, acustomtext3, acustomtext4, acustomtext5, acustomint1, acustomint2, acustomint3, acustomint4, acustomint5, acustomdbl1, acustomdbl2, acustomdbl3, acustomdbl4, acustomdbl5, acustomdate1, acustomdate2, acustomdate3, acustomdate4, acustomdate5, aidbarang) values{strValue2.ToString}
```

## Query 40

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
Insert into M7_Asset_Transaction(atid, atasetid, atjenismutasi, atsumber, atidutama, atidbarang, atkode, atnama, atkategori, atcabang, atlokasi, atgudang, atdivisi, atsubdivisi, atcostcenter, atproyek, atcatatan, atnomor, attglbeli, attglpakai, atjml, atsatuan, atmatauang, atkurs, atharga, atdiskon, atjmldiskon, atpajak1, atjmlpajak1, atpajak2, atjmlpajak2, athargabeli, atnilairesidu, atumurekonomis, atbebanperbln, atakumulasibeban, atnilaibuku, atmetode, attabelpenyusutan, atintangible, atfiskal, atatastengahbulan, atrekasset, atrekakumdepresiasi, atrekdepresiasi, atrekpenghapusan, atprodusen, attglpensiun, atpenyusutanke, atnilaimenurun, atdispose, atpembelian, atpenjualan, atlocked, atstatus, atstatussebelumnya, atisclose, atinputuser, atinputtgl, atmodifikasiuser, atmodifikasitgl, atcustomtext1, atcustomtext2, atcustomtext3, atcustomtext4, atcustomtext5, atcustomint1, atcustomint2, atcustomint3, atcustomint4, atcustomint5, atcustomdbl1, atcustomdbl2, atcustomdbl3, atcustomdbl4, atcustomdbl5, atcustomdate1, atcustomdate2, atcustomdate3, atcustomdate4, atcustomdate5, atnotransaksi, attgl) values{strValue2.ToString}
```

## Query 41

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
SELECT bstok FROM m1_item WHERE bid = '{idbarang}'
```

## Query 42

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_caridata.vb` `CdM4_Grn`

```sql
SELECT grn.grnid, grn.grncabang, grn.grnlokasi, grn.grngudang, grn.grnnotransaksi, grn.grntgl, grn.grnsupplier, grn.grnsupplierkontak, grn.grnbagianpembelian, grn.grntermin, t.trnama AS grnterminnama, grn.grnuraian, grn.grncatatan, grn.grnmatauang, grn.grnkurs, grn.grntotal, grn.grndiskonpersen, grn.grnjmldiskon, grn.grntotalpajak1detail, grn.grntotalpajak2detail, grn.grnbiayalainpersen, grn.grnbiayalain, grn.grntotaltransaksi, grn.grnjmlbayar, c1.kkode as grnsupplierkode, c1.knama as grnsuppliernama, c2.kkode as grnbagianpembeliankode, c2.knama as grnbagianpembeliannama, po.ponotransaksi FROM m4_grn grn JOIN m1_contact c1 ON grn.grnsupplier = c1.kid JOIN m4_grn_detail grnd ON grn.grnid = grnd.idgrn LEFT JOIN m1_contact c2 ON grn.grnbagianpembelian = c2.kid LEFT JOIN m4_po_detail pod ON grnd.idpodetail = pod.idpodetail LEFT JOIN m4_po po ON pod.idpo = po.poid LEFT JOIN m1_terms t ON t.trkode = grntermin
```

## Query 43

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
SELECT grnc.idgrncost, grnc.idgrn, grnc.kodecost, grnc.matauang, grnc.kurs, grnc.jumlah, grnc.rekdebit, grnc.rekkredit, grnc.kontak, grnc.termasukhpp, grnc.catatan, grnc.costcenter, grnc.divisi, grnc.subdivisi, grnc.proyek, grnc.urutan, grnc.idprcost, grnc.idcscost, grnc.idrqcost, grnc.idbscost, grnc.idpocost, grnc.idipccost, grnc.jumlahri, grnc.statusri, grnc.jumlahbayar, grnc.statusbayar, grnc.isclose, grnc.customtext1, grnc.customtext2, grnc.customtext3, grnc.customdbl1, grnc.customdbl2, grnc.customdbl3, grnc.customdate1, grnc.customdate2, grnc.customdate3, oc.ocnama AS kodecostnama, coa1.cnama AS rekdebitnama, coa2.cnama AS rekkreditnama, c.kkode AS kontakkode, c.knama AS kontaknama, cc.ccnama AS costcenternama, d.dnama AS divisinama, sd.sddivisi AS subdivisinama FROM m4_grn_cost grnc JOIN m4_grn grn ON grnc.idgrn = grn.grnid LEFT JOIN m1_other_cost oc ON grnc.kodecost = oc.ockode LEFT JOIN m1_coa coa1 ON grnc.rekdebit = coa1.cnomor LEFT JOIN m1_coa coa2 ON grnc.rekkredit = coa2.cnomor LEFT JOIN m1_contact c ON grnc.kontak = c.kid LEFT JOIN m1_cost_center cc ON grnc.costcenter = cc.cckode LEFT JOIN m1_division d ON grnc.divisi = d.dkode LEFT JOIN m1_subdivision sd ON grnc.subdivisi = sd.sdkode
```

## Query 44

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn_history.vb`

```sql
SELECT grnc.idhistorycost, grnc.idhistory, grnc.idgrncost, grnc.idgrn, grnc.kodecost, grnc.matauang, grnc.kurs, grnc.jumlah, grnc.rekdebit, grnc.rekkredit, grnc.kontak, grnc.termasukhpp, grnc.catatan, grnc.costcenter, grnc.divisi, grnc.subdivisi, grnc.proyek, grnc.urutan, grnc.idprcost, grnc.idcscost, grnc.idrqcost, grnc.idbscost, grnc.idpocost, grnc.idipccost, grnc.jumlahri, grnc.statusri, grnc.jumlahbayar, grnc.statusbayar, grnc.isclose, grnc.customtext1, grnc.customtext2, grnc.customtext3, grnc.customdbl1, grnc.customdbl2, grnc.customdbl3, grnc.customdate1, grnc.customdate2, grnc.customdate3, oc.ocnama AS kodecostnama, coa1.cnama AS rekdebitnama, coa2.cnama AS rekkreditnama, c.kkode AS kontakkode, c.knama AS kontaknama, cc.ccnama AS costcenternama, d.dnama AS divisinama, sd.sddivisi AS subdivisinama FROM m4_grn_cost_history grnc JOIN m4_grn_history grn ON grnc.idhistory = grn.grnidhistory LEFT JOIN m1_other_cost oc ON grnc.kodecost = oc.ockode LEFT JOIN m1_coa coa1 ON grnc.rekdebit = coa1.cnomor LEFT JOIN m1_coa coa2 ON grnc.rekkredit = coa2.cnomor LEFT JOIN m1_contact c ON grnc.kontak = c.kid LEFT JOIN m1_cost_center cc ON grnc.costcenter = cc.cckode LEFT JOIN m1_division d ON grnc.divisi = d.dkode LEFT JOIN m1_subdivision sd ON grnc.subdivisi = sd.sdkode
```

## Query 45

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
SELECT grncabang, grnlokasi, grnsumber, grnautonotransaksi, grnnotransaksi, grntgl FROM M4_grn WHERE grnid = '{idtransaksi}'
```

## Query 46

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn_history.vb`

```sql
SELECT grnidhistory FROM m4_grn_history WHERE grnid = '{idtransaksi}' ORDER BY grnmodifikasitgl DESC LIMIT 1
```

## Query 47

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
SELECT i.bkode, pod.idpodetail, po.ponotransaksi as notransaksi, (CASE po.pohargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m4_po_detail pod JOIN m4_po po ON pod.idpo = po.poid JOIN m1_item i ON pod.idbarang = i.bid WHERE ({ftPO}) AND po.pohargatermasukpajak <> {termasukPajak} ORDER BY pod.urutan
```

## Query 48

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
SELECT isw.idbarang, isw.kgudang, isw.stok, i.bkode FROM m1_item_stock_warehouse isw JOIN m1_item i ON isw.idbarang = i.bid AND i.bjenis <> 'J' WHERE {ftStok}
```

## Query 49

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
SELECT jml, harga, diskon, pajak1, jmlpajak1, pajak2, jmlpajak2 FROM m4_po_detail WHERE idpodetail = '{idpodetail}'
```

## Query 50

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
SELECT jml, harga, diskon, pajak1, jmlpajak1, pajak2, jmlpajak2, IFNULL(t1.tnilai,0) as nilaipajak1, IFNULL(t2.tnilai,0) as nilaipajak2 FROM m4_po_detail pod LEFT JOIN m1_tax t1 ON pod.pajak1 = t1.tkode LEFT JOIN m1_tax t2 ON pod.pajak2 = t2.tkode WHERE idpodetail = '{idpodetail}'
```

## Query 51

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
SELECT po.ponotransaksi as notransaksi, po.pohargatermasukpajak as termasukpajak, (CASE po.pohargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajaknama FROM m4_po_detail pod JOIN m4_po po ON pod.idpo = po.poid WHERE {ftPO} GROUP BY po.pohargatermasukpajak
```

## Query 52

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
SELECT pod.idpodetail, ROUND(pod.jmlbarang - pod.jmlrealisasi, 5) as sisarealisasi, i.bid, i.bkode FROM m4_po_detail AS pod INNER JOIN m1_item AS i ON pod.idbarang = i.bid JOIN m0_setting s ON s.smodule = 4 AND s.sgrup = 'options' AND s.skode = 'GRNLebihDariPO' WHERE {ftOutstandingPO}
```

## Query 53

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
UPDATE M4_Grn SET Grnstatus = {nilaiStatus}, Grnmodifikasiuser='{userid}', Grnmodifikasitgl = NOW(), Grnposting = 0, Grnpostingtgl = '1971-01-01 00:00:00', Grnjmlrevisi = Grnjmlrevisi + 1 WHERE Grnid = '{idtransaksi}'
```

## Query 54

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
UPDATE m1_item LEFT JOIN m0_setting ON smodule = 0 AND sgrup = 'options' AND skode = 'PembelianUpdateHargaBeli' SET bstok = '{saldojml}', bhargabeli = (CASE IFNULL(snilai,0) WHEN 1 THEN '{(Double.Parse(dr1("harga")) * Double.Parse(dr1("kurs"))) - ((Double.Parse(dr1("jmldiskon")) / Double.Parse(dr1("jml"))) * Double.Parse(dr1("kurs"))) + ((Double.Parse(dr1("jmlpajak1")) / Double.Parse(dr1("jml"))) * Double.Parse(dr1("kurs"))) + ((Double.Parse(dr1("jmlpajak2")) / Double.Parse(dr1("jml"))) * Double.Parse(dr1("kurs")))}' ELSE bhargabeli END), baktiftgl = '{grntgl}' WHERE bid = '{idbarang}'
```

## Query 55

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
UPDATE m1_item LEFT JOIN m0_setting ON smodule = 0 AND sgrup = 'options' AND skode = 'PembelianUpdateHargaBeli' SET bstok = '{saldojml}', bhargabeli = (CASE IFNULL(snilai,0) WHEN 1 THEN '{(Double.Parse(dr1("harga")) * Double.Parse(dr1("kurs"))) - ((Double.Parse(dr1("jmldiskon")) / Double.Parse(dr1("jml"))) * Double.Parse(dr1("kurs")))}' ELSE bhargabeli END), baktiftgl = '{grntgl}' WHERE bid = '{idbarang}'
```

## Query 56

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
UPDATE m1_item SET bstok = '{saldojml}', bhargabeli = '{(Double.Parse(dr1("harga")) * Double.Parse(dr1("kurs"))) - ((Double.Parse(dr1("jmldiskon")) / Double.Parse(dr1("jml"))) * Double.Parse(dr1("kurs"))) + ((Double.Parse(dr1("jmlpajak1")) / Double.Parse(dr1("jml"))) * Double.Parse(dr1("kurs"))) + ((Double.Parse(dr1("jmlpajak2")) / Double.Parse(dr1("jml"))) * Double.Parse(dr1("kurs")))}' WHERE bid = '{idbarang}'
```

## Query 57

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
UPDATE m1_item SET bstok = '{saldojml}', bhargabeli = '{(Double.Parse(dr1("harga")) * Double.Parse(dr1("kurs"))) - ((Double.Parse(dr1("jmldiskon")) / Double.Parse(dr1("jml"))) * Double.Parse(dr1("kurs")))}' WHERE bid = '{idbarang}'
```

## Query 58

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
UPDATE m1_item SET bstok = (CASE bid {updStokBarang} ELSE bstok END) WHERE {ftStokBarang}
```

## Query 59

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
UPDATE m1_item i JOIN ( SELECT grnd.idbarang, ROUND((CASE {vTotalFungsional} WHEN 0 THEN (SUM((CASE grn.grnhargatermasukpajak WHEN 0 THEN ((grnd.jml * grnd.harga) - grnd.jmldiskon) * grnd.kurs ELSE ((grnd.jml * grnd.harga) - grnd.jmldiskon - grnd.jmlpajak1 - grnd.jmlpajak2) * grnd.kurs END))) ELSE (SUM((CASE grn.grnhargatermasukpajak WHEN 0 THEN ((grnd.jml * grnd.harga) - grnd.jmldiskon) * grnd.kurs ELSE ((grnd.jml * grnd.harga) - grnd.jmldiskon - grnd.jmlpajak1 - grnd.jmlpajak2) * grnd.kurs END))) + (((SUM((CASE grn.grnhargatermasukpajak WHEN 0 THEN ((grnd.jml * grnd.harga) - grnd.jmldiskon) * grnd.kurs ELSE ((grnd.jml * grnd.harga) - grnd.jmldiskon - grnd.jmlpajak1 - grnd.jmlpajak2) * grnd.kurs END))) / {vTotalFungsional}) * {vBiayaFungsional}) END), 2) as nilai, SUM(grnd.jmlbarang) as jumlah FROM m4_grn_detail grnd JOIN m4_grn grn ON grnd.idgrn = grn.grnid WHERE grnd.idgrn = '{idtransaksi}' GROUP BY grnd.idbarang ) as h ON i.bid = h.idbarang SET i.bhppaverage = (CASE i.bjenis WHEN 'P' THEN (CASE i.bstok WHEN 0 THEN 0 ELSE ROUND((((i.bstok + h.jumlah) * i.bhppaverage) - (h.nilai)) / (i.bstok),2) END) ELSE IFNULL(ROUND((((i.bstok + h.jumlah) * i.bhppaverage) - (h.nilai)) / (i.bstok),2),0) END)
```

## Query 60

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
UPDATE m4_po SET postatusrealisasi = (CASE poid {updNilaiPO} ELSE postatusrealisasi END) WHERE {updFilterPO}
```

## Query 61

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
UPDATE m4_po_detail SET jmlrealisasi = (CASE idpodetail {updNilaiPO} ELSE jmlrealisasi END) WHERE {updFilterPO}
```

## Query 62

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
Update M4_Grn set grncabang = '{grncabang}', grnlokasi = '{grnlokasi}', grngudang = '{grngudang}', grnasalbarang = '{grnasalbarang}', grnasalbarangkategori = {grnasalbarangkategori}, grnjenispembelian = '{grnjenispembelian}', grnjenispembeliankategori = {grnjenispembeliankategori}, grncarabayar = {grncarabayar}, grnsumber = '{grnsumber}', grnautonotransaksi = {grnautonotransaksi}, grnnotransaksi = '{notransaksi}', grntgl = '{grntgl}', grnkodepa = {grnkodepa}, grnsupplier = {grnsupplier}, grnsupplierkontak = '{grnsupplierkontak}', grn1alamat1 = '{grn1alamat1}', grn1alamat2 = '{grn1alamat2}', grn1alamat3 = '{grn1alamat3}', grn2alamat1 = '{grn2alamat1}', grn2alamat2 = '{grn2alamat2}', grn2alamat3 = '{grn2alamat3}', grnbagianpembelian = {grnbagianpembelian}, grntermin = '{grntermin}', grntgljatuhtempo = '{grntgljatuhtempo}', grnuraian = '{grnuraian}', grncatatan = '{grncatatan}', grnnoref = '{grnnoref}', grntglnoref = '{grntglnoref}', grntglpenutupan = '{grntglpenutupan}', grnmatauang = '{grnmatauang}', grnkurs = '{grnkurs}', grnhargatermasukpajak = {grnhargatermasukpajak}, grntotal = '{grntotal}', grndiskonpersen = '{grndiskonpersen}', grnjmldiskon = '{grnjmldiskon}', grntotalpajak1detail = '{grntotalpajak1detail}', grntotalpajak2detail = '{grntotalpajak2detail}', grnbiayalainpersen = '{grnbiayalainpersen}', grnbiayalain = '{grnbiayalain}', grntotaltransaksi = '{grntotaltransaksi}', grnjmlbayar = '{grnjmlbayar}', grnrekdiskon = '{grnrekdiskon}', grnrekpajak1 = '{grnrekpajak1}', grnrekpajak2 = '{grnrekpajak2}', grnrekbiayalain = '{grnrekbiayalain}', grnrekbayar = '{grnrekbayar}', grnidpr = {grnidpr}, grnidcs = {grnidcs}, grnidrq = {grnidrq}, grnidbs = {grnidbs}, grnidpo = {grnidpo}, grnidipc = {grnidipc}, grnstatusri = {grnstatusri}, grnstatusdnr = {grnstatusdnr}, grnstatusprt = {grnstatusprt}, grnstatus = {grnstatus}, grnstatussebelumnya = {grnstatussebelumnya}, grnjmlrevisi = grnjmlrevisi+1, grncetakanke = {grncetakanke}, grnmodifikasiuser = {grnmodifikasiuser}, grnmodifikasitgl = NOW(), grnposting = 0, grntutupperiode = {grntutupperiode}, grncustomtext1 = '{grncustomtext1}', grncustomtext2 = '{grncustomtext2}', grncustomtext3 = '{grncustomtext3}', grncustomtext4 = '{grncustomtext4}', grncustomtext5 = '{grncustomtext5}', grncustomint1 = {grncustomint1}, grncustomint2 = {grncustomint2}, grncustomint3 = {grncustomint3}, grncustomdbl1 = '{grncustomdbl1}', grncustomdbl2 = '{grncustomdbl2}', grncustomdbl3 = '{grncustomdbl3}', grncustomdate1 = '{grncustomdate1}', grncustomdate2 = '{grncustomdate2}', grncustomdate3 = '{grncustomdate3}' where grnid = '{grnid}'
```

## Query 63

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_grn_v`

```sql
select `grn`.`grnid` AS `grnid`,`grn`.`grncabang` AS `grncabang`,`grn`.`grnlokasi` AS `grnlokasi`,`grn`.`grngudang` AS `grngudang`,`grn`.`grnasalbarang` AS `grnasalbarang`,`grn`.`grnasalbarangkategori` AS `grnasalbarangkategori`,`grn`.`grnjenispembelian` AS `grnjenispembelian`,`grn`.`grnjenispembeliankategori` AS `grnjenispembeliankategori`,`grn`.`grncarabayar` AS `grncarabayar`,`grn`.`grnsumber` AS `grnsumber`,`grn`.`grnautonotransaksi` AS `grnautonotransaksi`,`grn`.`grnnotransaksi` AS `grnnotransaksi`,`grn`.`grntgl` AS `grntgl`,`grn`.`grnkodepa` AS `grnkodepa`,`grn`.`grnsupplier` AS `grnsupplier`,`grn`.`grnsupplierkontak` AS `grnsupplierkontak`,`grn`.`grn1alamat1` AS `grn1alamat1`,`grn`.`grn1alamat2` AS `grn1alamat2`,`grn`.`grn1alamat3` AS `grn1alamat3`,`grn`.`grn2alamat1` AS `grn2alamat1`,`grn`.`grn2alamat2` AS `grn2alamat2`,`grn`.`grn2alamat3` AS `grn2alamat3`,`grn`.`grnbagianpembelian` AS `grnbagianpembelian`,`grn`.`grntermin` AS `grntermin`,`grn`.`grntgljatuhtempo` AS `grntgljatuhtempo`,`grn`.`grnuraian` AS `grnuraian`,`grn`.`grncatatan` AS `grncatatan`,`grn`.`grnnoref` AS `grnnoref`,`grn`.`grntglnoref` AS `grntglnoref`,`grn`.`grntglpenutupan` AS `grntglpenutupan`,`grn`.`grnmatauang` AS `grnmatauang`,`grn`.`grnkurs` AS `grnkurs`,`grn`.`grnhargatermasukpajak` AS `grnhargatermasukpajak`,`grn`.`grntotal` AS `grntotal`,`grn`.`grndiskonpersen` AS `grndiskonpersen`,`grn`.`grnjmldiskon` AS `grnjmldiskon`,`grn`.`grntotalpajak1detail` AS `grntotalpajak1detail`,`grn`.`grntotalpajak2detail` AS `grntotalpajak2detail`,`grn`.`grnbiayalainpersen` AS `grnbiayalainpersen`,`grn`.`grnbiayalain` AS `grnbiayalain`,`grn`.`grntotaltransaksi` AS `grntotaltransaksi`,`grn`.`grnjmlbayar` AS `grnjmlbayar`,`grn`.`grnrekdiskon` AS `grnrekdiskon`,`grn`.`grnrekpajak1` AS `grnrekpajak1`,`grn`.`grnrekpajak2` AS `grnrekpajak2`,`grn`.`grnrekbiayalain` AS `grnrekbiayalain`,`grn`.`grnrekbayar` AS `grnrekbayar`,`grn`.`grnidpr` AS `grnidpr`,`grn`.`grnidcs` AS `grnidcs`,`grn`.`grnidrq` AS `grnidrq`,`grn`.`grnidbs` AS `grnidbs`,`grn`.`grnidpo` AS `grnidpo`,`grn`.`grnidipc` AS `grnidipc`,`grn`.`grnstatusri` AS `grnstatusri`,`grn`.`grnstatusdnr` AS `grnstatusdnr`,`grn`.`grnstatusprt` AS `grnstatusprt`,`grn`.`grnstatusrealisasi` AS `grnstatusrealisasi`,`grn`.`grnstatus` AS `grnstatus`,`grn`.`grnstatussebelumnya` AS `grnstatussebelumnya`,`grn`.`grnjmlrevisi` AS `grnjmlrevisi`,`grn`.`grncetakanke` AS `grncetakanke`,`grn`.`grninputuser` AS `grninputuser`,`grn`.`grninputtgl` AS `grninputtgl`,`grn`.`grnmodifikasiuser` AS `grnmodifikasiuser`,`grn`.`grnmodifikasitgl` AS `grnmodifikasitgl`,`grn`.`grnposting` AS `grnposting`,`grn`.`grnpostingtgl` AS `grnpostingtgl`,`grn`.`grntutupperiode` AS `grntutupperiode`,`grn`.`grnisclose` AS `grnisclose`,`br`.`bnama` AS `grncabangnama`,`lc`.`lnama` AS `grnlokasinama`,`wh`.`wnama` AS `grngudangnama`,`c1`.`kkode` AS `grnsupplierkode`,`c1`.`knama` AS `grnsuppliernama`,`c2`.`kkode` AS `grnbagianpembeliankode`,`c2`.`knama` AS `grnbagianpembeliannama`,`pr`.`prnotransaksi` AS `prnotransaksi`,`cs`.`csnotransaksi` AS `csnotransaksi`,`rq`.`rqnotransaksi` AS `rqnotransaksi`,`bs`.`bsnotransaksi` AS `bsnotransaksi`,`po`.`ponotransaksi` AS `ponotransaksi`,`ipc`.`ipcnotransaksi` AS `ipcnotransaksi`,`st1`.`nama` AS `grnstatusnama`,`st2`.`nama` AS `grnstatussebelumnyanama`,`u1`.`unama` AS `grninputusernama`,`u2`.`unama` AS `grnmodifikasiusernama` from (((((((((((((((`m4_grn` `grn` left join `m1_branch` `br` on((`br`.`bkode` = `grn`.`grncabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `grn`.`grnlokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `grn`.`grngudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `grn`.`grnsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `grn`.`grnbagianpembelian`))) left join `m4_pr` `pr` on((`grn`.`grnidpr` = `pr`.`prid`))) left join `m4_cs` `cs` on((`grn`.`grnidcs` = `cs`.`csid`))) left join `m4_rq` `rq` on((`grn`.`grnidrq` = `rq`.`rqid`))) left join `m4_bs` `bs` on((`grn`.`grnidbs` = `bs`.`bsid`))) left join `m4_po` `po` on((`grn`.`grnidpo` = `po`.`poid`))) left join `m4_ipc` `ipc` on((`grn`.`grnidipc` = `ipc`.`ipcid`))) left join `m0_status` `st1` on((`st1`.`kode` = `grn`.`grnstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `grn`.`grnstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `grn`.`grninputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `grn`.`grnmodifikasiuser`)))
```

## Query 64

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
select `grn`.`grnid` AS `grnid`,`grn`.`grncabang` AS `grncabang`,`grn`.`grnlokasi` AS `grnlokasi`,`grn`.`grngudang` AS `grngudang`,`grn`.`grnasalbarang` AS `grnasalbarang`,`grn`.`grnasalbarangkategori` AS `grnasalbarangkategori`,`grn`.`grnjenispembelian` AS `grnjenispembelian`,`grn`.`grnjenispembeliankategori` AS `grnjenispembeliankategori`,`grn`.`grncarabayar` AS `grncarabayar`,`grn`.`grnsumber` AS `grnsumber`,`grn`.`grnautonotransaksi` AS `grnautonotransaksi`,`grn`.`grnnotransaksi` AS `grnnotransaksi`,`grn`.`grntgl` AS `grntgl`,`grn`.`grnkodepa` AS `grnkodepa`,`grn`.`grnsupplier` AS `grnsupplier`,`grn`.`grnsupplierkontak` AS `grnsupplierkontak`,`grn`.`grn1alamat1` AS `grn1alamat1`,`grn`.`grn1alamat2` AS `grn1alamat2`,`grn`.`grn1alamat3` AS `grn1alamat3`,`grn`.`grn2alamat1` AS `grn2alamat1`,`grn`.`grn2alamat2` AS `grn2alamat2`,`grn`.`grn2alamat3` AS `grn2alamat3`,`grn`.`grnbagianpembelian` AS `grnbagianpembelian`,`grn`.`grntermin` AS `grntermin`,`grn`.`grntgljatuhtempo` AS `grntgljatuhtempo`,`grn`.`grnuraian` AS `grnuraian`,`grn`.`grncatatan` AS `grncatatan`,`grn`.`grnnoref` AS `grnnoref`,`grn`.`grntglnoref` AS `grntglnoref`,`grn`.`grntglpenutupan` AS `grntglpenutupan`,`grn`.`grnmatauang` AS `grnmatauang`,`grn`.`grnkurs` AS `grnkurs`,`grn`.`grnhargatermasukpajak` AS `grnhargatermasukpajak`,`grn`.`grntotal` AS `grntotal`,`grn`.`grndiskonpersen` AS `grndiskonpersen`,`grn`.`grnjmldiskon` AS `grnjmldiskon`,`grn`.`grntotalpajak1detail` AS `grntotalpajak1detail`,`grn`.`grntotalpajak2detail` AS `grntotalpajak2detail`,`grn`.`grnbiayalainpersen` AS `grnbiayalainpersen`,`grn`.`grnbiayalain` AS `grnbiayalain`,`grn`.`grntotaltransaksi` AS `grntotaltransaksi`,`grn`.`grnjmlbayar` AS `grnjmlbayar`,`grn`.`grnrekdiskon` AS `grnrekdiskon`,`grn`.`grnrekpajak1` AS `grnrekpajak1`,`grn`.`grnrekpajak2` AS `grnrekpajak2`,`grn`.`grnrekbiayalain` AS `grnrekbiayalain`,`grn`.`grnrekbayar` AS `grnrekbayar`,`grn`.`grnidpr` AS `grnidpr`,`grn`.`grnidcs` AS `grnidcs`,`grn`.`grnidrq` AS `grnidrq`,`grn`.`grnidbs` AS `grnidbs`,`grn`.`grnidpo` AS `grnidpo`,`grn`.`grnidipc` AS `grnidipc`,`grn`.`grnstatusri` AS `grnstatusri`,`grn`.`grnstatusdnr` AS `grnstatusdnr`,`grn`.`grnstatusprt` AS `grnstatusprt`,`grn`.`grnstatusrealisasi` AS `grnstatusrealisasi`,`grn`.`grnstatus` AS `grnstatus`,`grn`.`grnstatussebelumnya` AS `grnstatussebelumnya`,`grn`.`grnjmlrevisi` AS `grnjmlrevisi`,`grn`.`grncetakanke` AS `grncetakanke`,`grn`.`grninputuser` AS `grninputuser`,`grn`.`grninputtgl` AS `grninputtgl`,`grn`.`grnmodifikasiuser` AS `grnmodifikasiuser`,`grn`.`grnmodifikasitgl` AS `grnmodifikasitgl`,`grn`.`grnposting` AS `grnposting`,`grn`.`grnpostingtgl` AS `grnpostingtgl`,`grn`.`grntutupperiode` AS `grntutupperiode`,`grn`.`grnisclose` AS `grnisclose`,`grn`.`grncustomtext1` AS `grncustomtext1`,`grn`.`grncustomtext2` AS `grncustomtext2`,`grn`.`grncustomtext3` AS `grncustomtext3`,`grn`.`grncustomtext4` AS `grncustomtext4`,`grn`.`grncustomtext5` AS `grncustomtext5`,`grn`.`grncustomint1` AS `grncustomint1`,`grn`.`grncustomint2` AS `grncustomint2`,`grn`.`grncustomint3` AS `grncustomint3`,`grn`.`grncustomdbl1` AS `grncustomdbl1`,`grn`.`grncustomdbl2` AS `grncustomdbl2`,`grn`.`grncustomdbl3` AS `grncustomdbl3`,`grn`.`grncustomdate1` AS `grncustomdate1`,`grn`.`grncustomdate2` AS `grncustomdate2`,`grn`.`grncustomdate3` AS `grncustomdate3`,`br`.`bnama` AS `grncabangnama`,`lc`.`lnama` AS `grnlokasinama`,`wh`.`wnama` AS `grngudangnama`,`c1`.`kkode` AS `grnsupplierkode`,`c1`.`knama` AS `grnsuppliernama`,`c2`.`kkode` AS `grnbagianpembeliankode`,`c2`.`knama` AS `grnbagianpembeliannama`,`tr`.`trnama` AS `grnterminnama`,`tr`.`trharijatuhtempo` AS `grnterminharijatuhtempo`,`coa1`.`cnama` AS `grnrekdiskonnama`,`coa2`.`cnama` AS `grnrekpajak1nama`,`coa3`.`cnama` AS `grnrekpajak2nama`,`coa4`.`cnama` AS `grnrekbiayalainnama`,`coa5`.`cnama` AS `grnrekbayarnama`,`pr`.`prnotransaksi` AS `grnnotransaksipr`,`cs`.`csnotransaksi` AS `grnnotransaksics`,`rq`.`rqnotransaksi` AS `grnnotransaksirq`,`bs`.`bsnotransaksi` AS `grnnotransaksibs`,`po`.`ponotransaksi` AS `grnnotransaksipo`,`ipc`.`ipcnotransaksi` AS `grnnotransaksiipc`,`st1`.`nama` AS `grnstatusnama`,`st2`.`nama` AS `grnstatussebelumnyanama`,`u1`.`unama` AS `grninputusernama`,`u2`.`unama` AS `grnmodifikasiusernama`,`grnd`.`idgrndetail` AS `idgrndetail`,`grnd`.`idgrn` AS `idgrn`,`grnd`.`idbarang` AS `idbarang`,`grnd`.`namabarang` AS `namabarang`,`grnd`.`tipebarang` AS `tipebarang`,`grnd`.`jml` AS `jml`,`grnd`.`satuan` AS `satuan`,`grnd`.`nilaisatuan` AS `nilaisatuan`,`grnd`.`jmlbarang` AS `jmlbarang`,`grnd`.`satuanbarang` AS `satuanbarang`,`grnd`.`matauang` AS `matauang`,`grnd`.`kurs` AS `kurs`,`grnd`.`hargafix` AS `hargafix`,`grnd`.`harga` AS `harga`,`grnd`.`diskon` AS `diskon`,`grnd`.`jmldiskon` AS `jmldiskon`,`grnd`.`pajak1` AS `pajak1`,`grnd`.`jmlpajak1` AS `jmlpajak1`,`grnd`.`pajak2` AS `pajak2`,`grnd`.`jmlpajak2` AS `jmlpajak2`,`grnd`.`cabang` AS `cabang`,`grnd`.`lokasi` AS `lokasi`,`grnd`.`gudang` AS `gudang`,`i`.`brekpersediaan` AS `rekpersediaan`,`grnd`.`rekdiskonpembelian` AS `rekdiskonpembelian`,`s`.`snilai` AS `rekhutangsementara`,`grnd`.`costcenter` AS `costcenter`,`grnd`.`divisi` AS `divisi`,`grnd`.`subdivisi` AS `subdivisi`,`grnd`.`proyek` AS `proyek`,`grnd`.`catatan` AS `catatan`,`grnd`.`urutan` AS `urutan`,`grnd`.`idprdetail` AS `idprdetail`,`grnd`.`idcsdetail` AS `idcsdetail`,`grnd`.`idrqdetail` AS `idrqdetail`,`grnd`.`idbsdetail` AS `idbsdetail`,`grnd`.`idpodetail` AS `idpodetail`,`grnd`.`idipcdetail` AS `idipcdetail`,`grnd`.`jmlri` AS `jmlri`,`grnd`.`statusri` AS `statusri`,`grnd`.`jmldnr` AS `jmldnr`,`grnd`.`statusdnr` AS `statusdnr`,`grnd`.`jmlprt` AS `jmlprt`,`grnd`.`statusprt` AS `statusprt`,`grnd`.`jmlrealisasi` AS `jmlrealisasi`,`grnd`.`statusrealisasi` AS `statusrealisasi`,`grnd`.`isclose` AS `isclose`,`grnd`.`customtext1` AS `customtext1`,`grnd`.`customtext2` AS `customtext2`,`grnd`.`customtext3` AS `customtext3`,`grnd`.`customdbl1` AS `customdbl1`,`grnd`.`customdbl2` AS `customdbl2`,`grnd`.`customdbl3` AS `customdbl3`,`grnd`.`customdate1` AS `customdate1`,`grnd`.`customdate2` AS `customdate2`,`grnd`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bhpp` AS `bhpp`,`i`.`bjenis` AS `bjenis`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,`i`.`basset` AS `basset`,`t1`.`tnama` AS `pajak1nama`,`t1`.`tnilai` AS `pajak1nilai`,`t2`.`tnama` AS `pajak2nama`,`t2`.`tnilai` AS `pajak2nilai`,`brd`.`bnama` AS `cabangnama`,`lcd`.`lnama` AS `lokasinama`,`whd`.`wnama` AS `gudangnama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama`,`po2`.`ponotransaksi` AS `ponotransaksi`,`ipc2`.`ipcnotransaksi` AS `ipcnotransaksi`, c1.kpkp, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan from (((((((((((((((((((((((((((((((((((((`m4_grn` `grn` join `m4_grn_detail` `grnd` on((`grn`.`grnid` = `grnd`.`idgrn`))) left join `m1_branch` `br` on((`br`.`bkode` = `grn`.`grncabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `grn`.`grnlokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `grn`.`grngudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `grn`.`grnsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `grn`.`grnbagianpembelian`))) left join `m1_terms` `tr` on((`grn`.`grntermin` = `tr`.`trkode`))) left join `m1_coa` `coa1` on((`grn`.`grnrekdiskon` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`grn`.`grnrekpajak1` = `coa2`.`cnomor`))) left join `m1_coa` `coa3` on((`grn`.`grnrekpajak2` = `coa3`.`cnomor`))) left join `m1_coa` `coa4` on((`grn`.`grnrekbiayalain` = `coa4`.`cnomor`))) left join `m1_coa` `coa5` on((`grn`.`grnrekbayar` = `coa5`.`cnomor`))) left join `m4_pr` `pr` on((`grn`.`grnidpr` = `pr`.`prid`))) left join `m4_cs` `cs` on((`grn`.`grnidcs` = `cs`.`csid`))) left join `m4_rq` `rq` on((`grn`.`grnidrq` = `rq`.`rqid`))) left join `m4_bs` `bs` on((`grn`.`grnidbs` = `bs`.`bsid`))) left join `m4_po` `po` on((`grn`.`grnidpo` = `po`.`poid`))) left join `m4_ipc` `ipc` on((`grn`.`grnidipc` = `ipc`.`ipcid`))) left join `m0_status` `st1` on((`st1`.`kode` = `grn`.`grnstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `grn`.`grnstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `grn`.`grninputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `grn`.`grnmodifikasiuser`))) left join `m1_item` `i` on((`i`.`bid` = `grnd`.`idbarang`))) left join `m1_tax` `t1` on((`grnd`.`pajak1` = `t1`.`tkode`))) left join `m1_tax` `t2` on((`grnd`.`pajak2` = `t2`.`tkode`))) left join `m1_branch` `brd` on((`grnd`.`cabang` = `brd`.`bkode`))) left join `m1_location` `lcd` on((`grnd`.`lokasi` = `lcd`.`lkode`))) left join `m1_warehouse` `whd` on((`grnd`.`gudang` = `whd`.`wkode`))) left join `m1_cost_center` `cc` on((`grnd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`grnd`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`grnd`.`subdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`grnd`.`proyek` = `p`.`pkode`))) left join `m4_po_detail` `pod` on((`grnd`.`idpodetail` = `pod`.`idpodetail`))) left join `m4_po` `po2` on((`pod`.`idpo` = `po2`.`poid`))) left join `m4_ipc_detail` `ipcd` on((`grnd`.`idipcdetail` = `ipcd`.`idipcdetail`))) left join `m4_ipc` `ipc2` on((`ipcd`.`idipc` = `ipc2`.`ipcid`))) left join `m0_setting` `s` on(((`s`.`smodule` = 0) and (`s`.`sgrup` = 'akun') and (`s`.`skode` = 'HutangSementara'))))
```

## Query 65

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_grn_getdata`

```sql
select `grn`.`grnid` AS `grnid`,`grn`.`grncabang` AS `grncabang`,`grn`.`grnlokasi` AS `grnlokasi`,`grn`.`grngudang` AS `grngudang`,`grn`.`grnasalbarang` AS `grnasalbarang`,`grn`.`grnasalbarangkategori` AS `grnasalbarangkategori`,`grn`.`grnjenispembelian` AS `grnjenispembelian`,`grn`.`grnjenispembeliankategori` AS `grnjenispembeliankategori`,`grn`.`grncarabayar` AS `grncarabayar`,`grn`.`grnsumber` AS `grnsumber`,`grn`.`grnautonotransaksi` AS `grnautonotransaksi`,`grn`.`grnnotransaksi` AS `grnnotransaksi`,`grn`.`grntgl` AS `grntgl`,`grn`.`grnkodepa` AS `grnkodepa`,`grn`.`grnsupplier` AS `grnsupplier`,`grn`.`grnsupplierkontak` AS `grnsupplierkontak`,`grn`.`grn1alamat1` AS `grn1alamat1`,`grn`.`grn1alamat2` AS `grn1alamat2`,`grn`.`grn1alamat3` AS `grn1alamat3`,`grn`.`grn2alamat1` AS `grn2alamat1`,`grn`.`grn2alamat2` AS `grn2alamat2`,`grn`.`grn2alamat3` AS `grn2alamat3`,`grn`.`grnbagianpembelian` AS `grnbagianpembelian`,`grn`.`grntermin` AS `grntermin`,`grn`.`grntgljatuhtempo` AS `grntgljatuhtempo`,`grn`.`grnuraian` AS `grnuraian`,`grn`.`grncatatan` AS `grncatatan`,`grn`.`grnnoref` AS `grnnoref`,`grn`.`grntglnoref` AS `grntglnoref`,`grn`.`grntglpenutupan` AS `grntglpenutupan`,`grn`.`grnmatauang` AS `grnmatauang`,`grn`.`grnkurs` AS `grnkurs`,`grn`.`grnhargatermasukpajak` AS `grnhargatermasukpajak`,`grn`.`grntotal` AS `grntotal`,`grn`.`grndiskonpersen` AS `grndiskonpersen`,`grn`.`grnjmldiskon` AS `grnjmldiskon`,`grn`.`grntotalpajak1detail` AS `grntotalpajak1detail`,`grn`.`grntotalpajak2detail` AS `grntotalpajak2detail`,`grn`.`grnbiayalainpersen` AS `grnbiayalainpersen`,`grn`.`grnbiayalain` AS `grnbiayalain`,`grn`.`grntotaltransaksi` AS `grntotaltransaksi`,`grn`.`grnjmlbayar` AS `grnjmlbayar`,`grn`.`grnrekdiskon` AS `grnrekdiskon`,`grn`.`grnrekpajak1` AS `grnrekpajak1`,`grn`.`grnrekpajak2` AS `grnrekpajak2`,`grn`.`grnrekbiayalain` AS `grnrekbiayalain`,`grn`.`grnrekbayar` AS `grnrekbayar`,`grn`.`grnidpr` AS `grnidpr`,`grn`.`grnidcs` AS `grnidcs`,`grn`.`grnidrq` AS `grnidrq`,`grn`.`grnidbs` AS `grnidbs`,`grn`.`grnidpo` AS `grnidpo`,`grn`.`grnidipc` AS `grnidipc`,`grn`.`grnstatusri` AS `grnstatusri`,`grn`.`grnstatusdnr` AS `grnstatusdnr`,`grn`.`grnstatusprt` AS `grnstatusprt`,`grn`.`grnstatusrealisasi` AS `grnstatusrealisasi`,`grn`.`grnstatus` AS `grnstatus`,`grn`.`grnstatussebelumnya` AS `grnstatussebelumnya`,`grn`.`grnjmlrevisi` AS `grnjmlrevisi`,`grn`.`grncetakanke` AS `grncetakanke`,`grn`.`grninputuser` AS `grninputuser`,`grn`.`grninputtgl` AS `grninputtgl`,`grn`.`grnmodifikasiuser` AS `grnmodifikasiuser`,`grn`.`grnmodifikasitgl` AS `grnmodifikasitgl`,`grn`.`grnposting` AS `grnposting`,`grn`.`grnpostingtgl` AS `grnpostingtgl`,`grn`.`grntutupperiode` AS `grntutupperiode`,`grn`.`grnisclose` AS `grnisclose`,`grn`.`grncustomtext1` AS `grncustomtext1`,`grn`.`grncustomtext2` AS `grncustomtext2`,`grn`.`grncustomtext3` AS `grncustomtext3`,`grn`.`grncustomtext4` AS `grncustomtext4`,`grn`.`grncustomtext5` AS `grncustomtext5`,`grn`.`grncustomint1` AS `grncustomint1`,`grn`.`grncustomint2` AS `grncustomint2`,`grn`.`grncustomint3` AS `grncustomint3`,`grn`.`grncustomdbl1` AS `grncustomdbl1`,`grn`.`grncustomdbl2` AS `grncustomdbl2`,`grn`.`grncustomdbl3` AS `grncustomdbl3`,`grn`.`grncustomdate1` AS `grncustomdate1`,`grn`.`grncustomdate2` AS `grncustomdate2`,`grn`.`grncustomdate3` AS `grncustomdate3`,`br`.`bnama` AS `grncabangnama`,`lc`.`lnama` AS `grnlokasinama`,`wh`.`wnama` AS `grngudangnama`,`c1`.`kkode` AS `grnsupplierkode`,`c1`.`knama` AS `grnsuppliernama`,`c2`.`kkode` AS `grnbagianpembeliankode`,`c2`.`knama` AS `grnbagianpembeliannama`,`tr`.`trnama` AS `grnterminnama`,`tr`.`trharijatuhtempo` AS `grnterminharijatuhtempo`,`coa1`.`cnama` AS `grnrekdiskonnama`,`coa2`.`cnama` AS `grnrekpajak1nama`,`coa3`.`cnama` AS `grnrekpajak2nama`,`coa4`.`cnama` AS `grnrekbiayalainnama`,`coa5`.`cnama` AS `grnrekbayarnama`,`pr`.`prnotransaksi` AS `grnnotransaksipr`,`cs`.`csnotransaksi` AS `grnnotransaksics`,`rq`.`rqnotransaksi` AS `grnnotransaksirq`,`bs`.`bsnotransaksi` AS `grnnotransaksibs`,`po`.`ponotransaksi` AS `grnnotransaksipo`,`ipc`.`ipcnotransaksi` AS `grnnotransaksiipc`,`st1`.`nama` AS `grnstatusnama`,`st2`.`nama` AS `grnstatussebelumnyanama`,`u1`.`unama` AS `grninputusernama`,`u2`.`unama` AS `grnmodifikasiusernama`,`grnd`.`idgrndetail` AS `idgrndetail`,`grnd`.`idgrn` AS `idgrn`,`grnd`.`idbarang` AS `idbarang`,`grnd`.`namabarang` AS `namabarang`,`grnd`.`tipebarang` AS `tipebarang`,`grnd`.`jml` AS `jml`,`grnd`.`satuan` AS `satuan`,`grnd`.`nilaisatuan` AS `nilaisatuan`,`grnd`.`jmlbarang` AS `jmlbarang`,`grnd`.`satuanbarang` AS `satuanbarang`,`grnd`.`matauang` AS `matauang`,`grnd`.`kurs` AS `kurs`,`grnd`.`hargafix` AS `hargafix`,`grnd`.`harga` AS `harga`,`grnd`.`diskon` AS `diskon`,`grnd`.`jmldiskon` AS `jmldiskon`,`grnd`.`pajak1` AS `pajak1`,`grnd`.`jmlpajak1` AS `jmlpajak1`,`grnd`.`pajak2` AS `pajak2`,`grnd`.`jmlpajak2` AS `jmlpajak2`,`grnd`.`cabang` AS `cabang`,`grnd`.`lokasi` AS `lokasi`,`grnd`.`gudang` AS `gudang`,`i`.`brekpersediaan` AS `rekpersediaan`,`grnd`.`rekdiskonpembelian` AS `rekdiskonpembelian`,`s`.`snilai` AS `rekhutangsementara`,`grnd`.`costcenter` AS `costcenter`,`grnd`.`divisi` AS `divisi`,`grnd`.`subdivisi` AS `subdivisi`,`grnd`.`proyek` AS `proyek`,`grnd`.`catatan` AS `catatan`,`grnd`.`urutan` AS `urutan`,`grnd`.`idprdetail` AS `idprdetail`,`grnd`.`idcsdetail` AS `idcsdetail`,`grnd`.`idrqdetail` AS `idrqdetail`,`grnd`.`idbsdetail` AS `idbsdetail`,`grnd`.`idpodetail` AS `idpodetail`,`grnd`.`idipcdetail` AS `idipcdetail`,`grnd`.`jmlri` AS `jmlri`,`grnd`.`statusri` AS `statusri`,`grnd`.`jmldnr` AS `jmldnr`,`grnd`.`statusdnr` AS `statusdnr`,`grnd`.`jmlprt` AS `jmlprt`,`grnd`.`statusprt` AS `statusprt`,`grnd`.`jmlrealisasi` AS `jmlrealisasi`,`grnd`.`statusrealisasi` AS `statusrealisasi`,`grnd`.`isclose` AS `isclose`,`grnd`.`customtext1` AS `customtext1`,`grnd`.`customtext2` AS `customtext2`,`grnd`.`customtext3` AS `customtext3`,`grnd`.`customdbl1` AS `customdbl1`,`grnd`.`customdbl2` AS `customdbl2`,`grnd`.`customdbl3` AS `customdbl3`,`grnd`.`customdate1` AS `customdate1`,`grnd`.`customdate2` AS `customdate2`,`grnd`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bhpp` AS `bhpp`,`i`.`bjenis` AS `bjenis`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,`t1`.`tnama` AS `pajak1nama`,`t1`.`tnilai` AS `pajak1nilai`,`t2`.`tnama` AS `pajak2nama`,`t2`.`tnilai` AS `pajak2nilai`,`brd`.`bnama` AS `cabangnama`,`lcd`.`lnama` AS `lokasinama`,`whd`.`wnama` AS `gudangnama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama`,`po2`.`ponotransaksi` AS `ponotransaksi`,`ipc2`.`ipcnotransaksi` AS `ipcnotransaksi`, c1.kpkp, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan from (((((((((((((((((((((((((((((((((((((`m4_grn` `grn` join `m4_grn_detail` `grnd` on((`grn`.`grnid` = `grnd`.`idgrn`))) left join `m1_branch` `br` on((`br`.`bkode` = `grn`.`grncabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `grn`.`grnlokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `grn`.`grngudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `grn`.`grnsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `grn`.`grnbagianpembelian`))) left join `m1_terms` `tr` on((`grn`.`grntermin` = `tr`.`trkode`))) left join `m1_coa` `coa1` on((`grn`.`grnrekdiskon` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`grn`.`grnrekpajak1` = `coa2`.`cnomor`))) left join `m1_coa` `coa3` on((`grn`.`grnrekpajak2` = `coa3`.`cnomor`))) left join `m1_coa` `coa4` on((`grn`.`grnrekbiayalain` = `coa4`.`cnomor`))) left join `m1_coa` `coa5` on((`grn`.`grnrekbayar` = `coa5`.`cnomor`))) left join `m4_pr` `pr` on((`grn`.`grnidpr` = `pr`.`prid`))) left join `m4_cs` `cs` on((`grn`.`grnidcs` = `cs`.`csid`))) left join `m4_rq` `rq` on((`grn`.`grnidrq` = `rq`.`rqid`))) left join `m4_bs` `bs` on((`grn`.`grnidbs` = `bs`.`bsid`))) left join `m4_po` `po` on((`grn`.`grnidpo` = `po`.`poid`))) left join `m4_ipc` `ipc` on((`grn`.`grnidipc` = `ipc`.`ipcid`))) left join `m0_status` `st1` on((`st1`.`kode` = `grn`.`grnstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `grn`.`grnstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `grn`.`grninputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `grn`.`grnmodifikasiuser`))) left join `m1_item` `i` on((`i`.`bid` = `grnd`.`idbarang`))) left join `m1_tax` `t1` on((`grnd`.`pajak1` = `t1`.`tkode`))) left join `m1_tax` `t2` on((`grnd`.`pajak2` = `t2`.`tkode`))) left join `m1_branch` `brd` on((`grnd`.`cabang` = `brd`.`bkode`))) left join `m1_location` `lcd` on((`grnd`.`lokasi` = `lcd`.`lkode`))) left join `m1_warehouse` `whd` on((`grnd`.`gudang` = `whd`.`wkode`))) left join `m1_cost_center` `cc` on((`grnd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`grnd`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`grnd`.`subdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`grnd`.`proyek` = `p`.`pkode`))) left join `m4_po_detail` `pod` on((`grnd`.`idpodetail` = `pod`.`idpodetail`))) left join `m4_po` `po2` on((`pod`.`idpo` = `po2`.`poid`))) left join `m4_ipc_detail` `ipcd` on((`grnd`.`idipcdetail` = `ipcd`.`idipcdetail`))) left join `m4_ipc` `ipc2` on((`ipcd`.`idipc` = `ipc2`.`ipcid`))) left join `m0_setting` `s` on(((`s`.`smodule` = 0) and (`s`.`sgrup` = 'akun') and (`s`.`skode` = 'HutangSementara'))))
```

## Query 66

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_grn_v_history`

```sql
select `grn`.`grnidhistory` AS `grnidhistory`,`grn`.`grnid` AS `grnid`,`grn`.`grncabang` AS `grncabang`,`grn`.`grnlokasi` AS `grnlokasi`,`grn`.`grngudang` AS `grngudang`,`grn`.`grnasalbarang` AS `grnasalbarang`,`grn`.`grnasalbarangkategori` AS `grnasalbarangkategori`,`grn`.`grnjenispembelian` AS `grnjenispembelian`,`grn`.`grnjenispembeliankategori` AS `grnjenispembeliankategori`,`grn`.`grncarabayar` AS `grncarabayar`,`grn`.`grnsumber` AS `grnsumber`,`grn`.`grnautonotransaksi` AS `grnautonotransaksi`,`grn`.`grnnotransaksi` AS `grnnotransaksi`,`grn`.`grntgl` AS `grntgl`,`grn`.`grnkodepa` AS `grnkodepa`,`grn`.`grnsupplier` AS `grnsupplier`,`grn`.`grnsupplierkontak` AS `grnsupplierkontak`,`grn`.`grn1alamat1` AS `grn1alamat1`,`grn`.`grn1alamat2` AS `grn1alamat2`,`grn`.`grn1alamat3` AS `grn1alamat3`,`grn`.`grn2alamat1` AS `grn2alamat1`,`grn`.`grn2alamat2` AS `grn2alamat2`,`grn`.`grn2alamat3` AS `grn2alamat3`,`grn`.`grnbagianpembelian` AS `grnbagianpembelian`,`grn`.`grntermin` AS `grntermin`,`grn`.`grntgljatuhtempo` AS `grntgljatuhtempo`,`grn`.`grnuraian` AS `grnuraian`,`grn`.`grncatatan` AS `grncatatan`,`grn`.`grnnoref` AS `grnnoref`,`grn`.`grntglnoref` AS `grntglnoref`,`grn`.`grntglpenutupan` AS `grntglpenutupan`,`grn`.`grnmatauang` AS `grnmatauang`,`grn`.`grnkurs` AS `grnkurs`,`grn`.`grnhargatermasukpajak` AS `grnhargatermasukpajak`,`grn`.`grntotal` AS `grntotal`,`grn`.`grndiskonpersen` AS `grndiskonpersen`,`grn`.`grnjmldiskon` AS `grnjmldiskon`,`grn`.`grntotalpajak1detail` AS `grntotalpajak1detail`,`grn`.`grntotalpajak2detail` AS `grntotalpajak2detail`,`grn`.`grnbiayalainpersen` AS `grnbiayalainpersen`,`grn`.`grnbiayalain` AS `grnbiayalain`,`grn`.`grntotaltransaksi` AS `grntotaltransaksi`,`grn`.`grnjmlbayar` AS `grnjmlbayar`,`grn`.`grnrekdiskon` AS `grnrekdiskon`,`grn`.`grnrekpajak1` AS `grnrekpajak1`,`grn`.`grnrekpajak2` AS `grnrekpajak2`,`grn`.`grnrekbiayalain` AS `grnrekbiayalain`,`grn`.`grnrekbayar` AS `grnrekbayar`,`grn`.`grnidpr` AS `grnidpr`,`grn`.`grnidcs` AS `grnidcs`,`grn`.`grnidrq` AS `grnidrq`,`grn`.`grnidbs` AS `grnidbs`,`grn`.`grnidpo` AS `grnidpo`,`grn`.`grnidipc` AS `grnidipc`,`grn`.`grnstatusri` AS `grnstatusri`,`grn`.`grnstatusdnr` AS `grnstatusdnr`,`grn`.`grnstatusprt` AS `grnstatusprt`,`grn`.`grnstatusrealisasi` AS `grnstatusrealisasi`,`grn`.`grnstatus` AS `grnstatus`,`grn`.`grnstatussebelumnya` AS `grnstatussebelumnya`,`grn`.`grnjmlrevisi` AS `grnjmlrevisi`,`grn`.`grncetakanke` AS `grncetakanke`,`grn`.`grninputuser` AS `grninputuser`,`grn`.`grninputtgl` AS `grninputtgl`,`grn`.`grnmodifikasiuser` AS `grnmodifikasiuser`,`grn`.`grnmodifikasitgl` AS `grnmodifikasitgl`,`grn`.`grnposting` AS `grnposting`,`grn`.`grnpostingtgl` AS `grnpostingtgl`,`grn`.`grntutupperiode` AS `grntutupperiode`,`grn`.`grnisclose` AS `grnisclose`,`br`.`bnama` AS `grncabangnama`,`lc`.`lnama` AS `grnlokasinama`,`wh`.`wnama` AS `grngudangnama`,`c1`.`kkode` AS `grnsupplierkode`,`c1`.`knama` AS `grnsuppliernama`,`c2`.`kkode` AS `grnbagianpembeliankode`,`c2`.`knama` AS `grnbagianpembeliannama`,`pr`.`prnotransaksi` AS `prnotransaksi`,`cs`.`csnotransaksi` AS `csnotransaksi`,`rq`.`rqnotransaksi` AS `rqnotransaksi`,`bs`.`bsnotransaksi` AS `bsnotransaksi`,`po`.`ponotransaksi` AS `ponotransaksi`,`ipc`.`ipcnotransaksi` AS `ipcnotransaksi`,`st1`.`nama` AS `grnstatusnama`,`st2`.`nama` AS `grnstatussebelumnyanama`,`u1`.`unama` AS `grninputusernama`,`u2`.`unama` AS `grnmodifikasiusernama` from (((((((((((((((`m4_grn_history` `grn` left join `m1_branch` `br` on((`br`.`bkode` = `grn`.`grncabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `grn`.`grnlokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `grn`.`grngudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `grn`.`grnsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `grn`.`grnbagianpembelian`))) left join `m4_pr` `pr` on((`grn`.`grnidpr` = `pr`.`prid`))) left join `m4_cs` `cs` on((`grn`.`grnidcs` = `cs`.`csid`))) left join `m4_rq` `rq` on((`grn`.`grnidrq` = `rq`.`rqid`))) left join `m4_bs` `bs` on((`grn`.`grnidbs` = `bs`.`bsid`))) left join `m4_po` `po` on((`grn`.`grnidpo` = `po`.`poid`))) left join `m4_ipc` `ipc` on((`grn`.`grnidipc` = `ipc`.`ipcid`))) left join `m0_status` `st1` on((`st1`.`kode` = `grn`.`grnstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `grn`.`grnstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `grn`.`grninputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `grn`.`grnmodifikasiuser`)))
```

## Query 67

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_grn_getdata_history`

```sql
select `grn`.`grnidhistory` AS `grnidhistory`,`grn`.`grnid` AS `grnid`,`grn`.`grncabang` AS `grncabang`,`grn`.`grnlokasi` AS `grnlokasi`,`grn`.`grngudang` AS `grngudang`,`grn`.`grnasalbarang` AS `grnasalbarang`,`grn`.`grnasalbarangkategori` AS `grnasalbarangkategori`,`grn`.`grnjenispembelian` AS `grnjenispembelian`,`grn`.`grnjenispembeliankategori` AS `grnjenispembeliankategori`,`grn`.`grncarabayar` AS `grncarabayar`,`grn`.`grnsumber` AS `grnsumber`,`grn`.`grnautonotransaksi` AS `grnautonotransaksi`,`grn`.`grnnotransaksi` AS `grnnotransaksi`,`grn`.`grntgl` AS `grntgl`,`grn`.`grnkodepa` AS `grnkodepa`,`grn`.`grnsupplier` AS `grnsupplier`,`grn`.`grnsupplierkontak` AS `grnsupplierkontak`,`grn`.`grn1alamat1` AS `grn1alamat1`,`grn`.`grn1alamat2` AS `grn1alamat2`,`grn`.`grn1alamat3` AS `grn1alamat3`,`grn`.`grn2alamat1` AS `grn2alamat1`,`grn`.`grn2alamat2` AS `grn2alamat2`,`grn`.`grn2alamat3` AS `grn2alamat3`,`grn`.`grnbagianpembelian` AS `grnbagianpembelian`,`grn`.`grntermin` AS `grntermin`,`grn`.`grntgljatuhtempo` AS `grntgljatuhtempo`,`grn`.`grnuraian` AS `grnuraian`,`grn`.`grncatatan` AS `grncatatan`,`grn`.`grnnoref` AS `grnnoref`,`grn`.`grntglnoref` AS `grntglnoref`,`grn`.`grntglpenutupan` AS `grntglpenutupan`,`grn`.`grnmatauang` AS `grnmatauang`,`grn`.`grnkurs` AS `grnkurs`,`grn`.`grnhargatermasukpajak` AS `grnhargatermasukpajak`,`grn`.`grntotal` AS `grntotal`,`grn`.`grndiskonpersen` AS `grndiskonpersen`,`grn`.`grnjmldiskon` AS `grnjmldiskon`,`grn`.`grntotalpajak1detail` AS `grntotalpajak1detail`,`grn`.`grntotalpajak2detail` AS `grntotalpajak2detail`,`grn`.`grnbiayalainpersen` AS `grnbiayalainpersen`,`grn`.`grnbiayalain` AS `grnbiayalain`,`grn`.`grntotaltransaksi` AS `grntotaltransaksi`,`grn`.`grnjmlbayar` AS `grnjmlbayar`,`grn`.`grnrekdiskon` AS `grnrekdiskon`,`grn`.`grnrekpajak1` AS `grnrekpajak1`,`grn`.`grnrekpajak2` AS `grnrekpajak2`,`grn`.`grnrekbiayalain` AS `grnrekbiayalain`,`grn`.`grnrekbayar` AS `grnrekbayar`,`grn`.`grnidpr` AS `grnidpr`,`grn`.`grnidcs` AS `grnidcs`,`grn`.`grnidrq` AS `grnidrq`,`grn`.`grnidbs` AS `grnidbs`,`grn`.`grnidpo` AS `grnidpo`,`grn`.`grnidipc` AS `grnidipc`,`grn`.`grnstatusri` AS `grnstatusri`,`grn`.`grnstatusdnr` AS `grnstatusdnr`,`grn`.`grnstatusprt` AS `grnstatusprt`,`grn`.`grnstatusrealisasi` AS `grnstatusrealisasi`,`grn`.`grnstatus` AS `grnstatus`,`grn`.`grnstatussebelumnya` AS `grnstatussebelumnya`,`grn`.`grnjmlrevisi` AS `grnjmlrevisi`,`grn`.`grncetakanke` AS `grncetakanke`,`grn`.`grninputuser` AS `grninputuser`,`grn`.`grninputtgl` AS `grninputtgl`,`grn`.`grnmodifikasiuser` AS `grnmodifikasiuser`,`grn`.`grnmodifikasitgl` AS `grnmodifikasitgl`,`grn`.`grnposting` AS `grnposting`,`grn`.`grnpostingtgl` AS `grnpostingtgl`,`grn`.`grntutupperiode` AS `grntutupperiode`,`grn`.`grnisclose` AS `grnisclose`,`grn`.`grncustomtext1` AS `grncustomtext1`,`grn`.`grncustomtext2` AS `grncustomtext2`,`grn`.`grncustomtext3` AS `grncustomtext3`,`grn`.`grncustomtext4` AS `grncustomtext4`,`grn`.`grncustomtext5` AS `grncustomtext5`,`grn`.`grncustomint1` AS `grncustomint1`,`grn`.`grncustomint2` AS `grncustomint2`,`grn`.`grncustomint3` AS `grncustomint3`,`grn`.`grncustomdbl1` AS `grncustomdbl1`,`grn`.`grncustomdbl2` AS `grncustomdbl2`,`grn`.`grncustomdbl3` AS `grncustomdbl3`,`grn`.`grncustomdate1` AS `grncustomdate1`,`grn`.`grncustomdate2` AS `grncustomdate2`,`grn`.`grncustomdate3` AS `grncustomdate3`,`br`.`bnama` AS `grncabangnama`,`lc`.`lnama` AS `grnlokasinama`,`wh`.`wnama` AS `grngudangnama`,`c1`.`kkode` AS `grnsupplierkode`,`c1`.`knama` AS `grnsuppliernama`,`c2`.`kkode` AS `grnbagianpembeliankode`,`c2`.`knama` AS `grnbagianpembeliannama`,`tr`.`trnama` AS `grnterminnama`,`tr`.`trharijatuhtempo` AS `grnterminharijatuhtempo`,`coa1`.`cnama` AS `grnrekdiskonnama`,`coa2`.`cnama` AS `grnrekpajak1nama`,`coa3`.`cnama` AS `grnrekpajak2nama`,`coa4`.`cnama` AS `grnrekbiayalainnama`,`coa5`.`cnama` AS `grnrekbayarnama`,`pr`.`prnotransaksi` AS `grnnotransaksipr`,`cs`.`csnotransaksi` AS `grnnotransaksics`,`rq`.`rqnotransaksi` AS `grnnotransaksirq`,`bs`.`bsnotransaksi` AS `grnnotransaksibs`,`po`.`ponotransaksi` AS `grnnotransaksipo`,`ipc`.`ipcnotransaksi` AS `grnnotransaksiipc`,`st1`.`nama` AS `grnstatusnama`,`st2`.`nama` AS `grnstatussebelumnyanama`,`u1`.`unama` AS `grninputusernama`,`u2`.`unama` AS `grnmodifikasiusernama`,`grnd`.`idhistorydetail` AS `idhistorydetail`,`grnd`.`idhistory` AS `idhistory`,`grnd`.`idgrndetail` AS `idgrndetail`,`grnd`.`idgrn` AS `idgrn`,`grnd`.`idbarang` AS `idbarang`,`grnd`.`namabarang` AS `namabarang`,`grnd`.`tipebarang` AS `tipebarang`,`grnd`.`jml` AS `jml`,`grnd`.`satuan` AS `satuan`,`grnd`.`nilaisatuan` AS `nilaisatuan`,`grnd`.`jmlbarang` AS `jmlbarang`,`grnd`.`satuanbarang` AS `satuanbarang`,`grnd`.`matauang` AS `matauang`,`grnd`.`kurs` AS `kurs`,`grnd`.`hargafix` AS `hargafix`,`grnd`.`harga` AS `harga`,`grnd`.`diskon` AS `diskon`,`grnd`.`jmldiskon` AS `jmldiskon`,`grnd`.`pajak1` AS `pajak1`,`grnd`.`jmlpajak1` AS `jmlpajak1`,`grnd`.`pajak2` AS `pajak2`,`grnd`.`jmlpajak2` AS `jmlpajak2`,`grnd`.`cabang` AS `cabang`,`grnd`.`lokasi` AS `lokasi`,`grnd`.`gudang` AS `gudang`,`i`.`brekpersediaan` AS `rekpersediaan`,`grnd`.`rekdiskonpembelian` AS `rekdiskonpembelian`,`s`.`snilai` AS `rekhutangsementara`,`grnd`.`costcenter` AS `costcenter`,`grnd`.`divisi` AS `divisi`,`grnd`.`subdivisi` AS `subdivisi`,`grnd`.`proyek` AS `proyek`,`grnd`.`catatan` AS `catatan`,`grnd`.`urutan` AS `urutan`,`grnd`.`idprdetail` AS `idprdetail`,`grnd`.`idcsdetail` AS `idcsdetail`,`grnd`.`idrqdetail` AS `idrqdetail`,`grnd`.`idbsdetail` AS `idbsdetail`,`grnd`.`idpodetail` AS `idpodetail`,`grnd`.`idipcdetail` AS `idipcdetail`,`grnd`.`jmlri` AS `jmlri`,`grnd`.`statusri` AS `statusri`,`grnd`.`jmldnr` AS `jmldnr`,`grnd`.`statusdnr` AS `statusdnr`,`grnd`.`jmlprt` AS `jmlprt`,`grnd`.`statusprt` AS `statusprt`,`grnd`.`jmlrealisasi` AS `jmlrealisasi`,`grnd`.`statusrealisasi` AS `statusrealisasi`,`grnd`.`isclose` AS `isclose`,`grnd`.`customtext1` AS `customtext1`,`grnd`.`customtext2` AS `customtext2`,`grnd`.`customtext3` AS `customtext3`,`grnd`.`customdbl1` AS `customdbl1`,`grnd`.`customdbl2` AS `customdbl2`,`grnd`.`customdbl3` AS `customdbl3`,`grnd`.`customdate1` AS `customdate1`,`grnd`.`customdate2` AS `customdate2`,`grnd`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bhpp` AS `bhpp`,`i`.`bjenis` AS `bjenis`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,`t1`.`tnama` AS `pajak1nama`,`t1`.`tnilai` AS `pajak1nilai`,`t2`.`tnama` AS `pajak2nama`,`t2`.`tnilai` AS `pajak2nilai`,`brd`.`bnama` AS `cabangnama`,`lcd`.`lnama` AS `lokasinama`,`whd`.`wnama` AS `gudangnama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama`,`po2`.`ponotransaksi` AS `ponotransaksi`,`ipc2`.`ipcnotransaksi` AS `ipcnotransaksi`, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan from (((((((((((((((((((((((((((((((((((((`m4_grn_history` `grn` join `m4_grn_detail_history` `grnd` on((`grn`.`grnidhistory` = `grnd`.`idhistory`))) left join `m1_branch` `br` on((`br`.`bkode` = `grn`.`grncabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `grn`.`grnlokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `grn`.`grngudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `grn`.`grnsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `grn`.`grnbagianpembelian`))) left join `m1_terms` `tr` on((`grn`.`grntermin` = `tr`.`trkode`))) left join `m1_coa` `coa1` on((`grn`.`grnrekdiskon` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`grn`.`grnrekpajak1` = `coa2`.`cnomor`))) left join `m1_coa` `coa3` on((`grn`.`grnrekpajak2` = `coa3`.`cnomor`))) left join `m1_coa` `coa4` on((`grn`.`grnrekbiayalain` = `coa4`.`cnomor`))) left join `m1_coa` `coa5` on((`grn`.`grnrekbayar` = `coa5`.`cnomor`))) left join `m4_pr` `pr` on((`grn`.`grnidpr` = `pr`.`prid`))) left join `m4_cs` `cs` on((`grn`.`grnidcs` = `cs`.`csid`))) left join `m4_rq` `rq` on((`grn`.`grnidrq` = `rq`.`rqid`))) left join `m4_bs` `bs` on((`grn`.`grnidbs` = `bs`.`bsid`))) left join `m4_po` `po` on((`grn`.`grnidpo` = `po`.`poid`))) left join `m4_ipc` `ipc` on((`grn`.`grnidipc` = `ipc`.`ipcid`))) left join `m0_status` `st1` on((`st1`.`kode` = `grn`.`grnstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `grn`.`grnstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `grn`.`grninputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `grn`.`grnmodifikasiuser`))) left join `m1_item` `i` on((`i`.`bid` = `grnd`.`idbarang`))) left join `m1_tax` `t1` on((`grnd`.`pajak1` = `t1`.`tkode`))) left join `m1_tax` `t2` on((`grnd`.`pajak2` = `t2`.`tkode`))) left join `m1_branch` `brd` on((`grnd`.`cabang` = `brd`.`bkode`))) left join `m1_location` `lcd` on((`grnd`.`lokasi` = `lcd`.`lkode`))) left join `m1_warehouse` `whd` on((`grnd`.`gudang` = `whd`.`wkode`))) left join `m1_cost_center` `cc` on((`grnd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`grnd`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`grnd`.`subdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`grnd`.`proyek` = `p`.`pkode`))) left join `m4_po_detail` `pod` on((`grnd`.`idpodetail` = `pod`.`idpodetail`))) left join `m4_po` `po2` on((`pod`.`idpo` = `po2`.`poid`))) left join `m4_ipc_detail` `ipcd` on((`grnd`.`idipcdetail` = `ipcd`.`idipcdetail`))) left join `m4_ipc` `ipc2` on((`ipcd`.`idipc` = `ipc2`.`ipcid`))) left join `m0_setting` `s` on(((`s`.`smodule` = 0) and (`s`.`sgrup` = 'akun') and (`s`.`skode` = 'HutangSementara'))))
```

## Query 68

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_grn_detail_v`

```sql
select `grnd`.`idgrndetail` AS `idgrndetail`,`grnd`.`idgrn` AS `idgrn`,`grnd`.`idbarang` AS `idbarang`,`grnd`.`namabarang` AS `namabarang`,`grnd`.`tipebarang` AS `tipebarang`,`grnd`.`jml` AS `jml`,`grnd`.`satuan` AS `satuan`,`grnd`.`nilaisatuan` AS `nilaisatuan`,`grnd`.`jmlbarang` AS `jmlbarang`,`grnd`.`satuanbarang` AS `satuanbarang`,`grnd`.`matauang` AS `matauang`,`grnd`.`kurs` AS `kurs`,`grnd`.`hargafix` AS `hargafix`,`grnd`.`harga` AS `harga`,`grnd`.`diskon` AS `diskon`,`grnd`.`jmldiskon` AS `jmldiskon`,`grnd`.`pajak1` AS `pajak1`,`grnd`.`jmlpajak1` AS `jmlpajak1`,`grnd`.`pajak2` AS `pajak2`,`grnd`.`jmlpajak2` AS `jmlpajak2`,`grnd`.`cabang` AS `cabang`,`grnd`.`lokasi` AS `lokasi`,`grnd`.`gudang` AS `gudang`,`i`.`brekpersediaan` AS `rekpersediaan`,`grnd`.`rekdiskonpembelian` AS `rekdiskonpembelian`,`s`.`snilai` AS `rekhutangsementara`,`grnd`.`costcenter` AS `costcenter`,`grnd`.`divisi` AS `divisi`,`grnd`.`subdivisi` AS `subdivisi`,`grnd`.`proyek` AS `proyek`,`grnd`.`catatan` AS `catatan`,`grnd`.`urutan` AS `urutan`,`grnd`.`idprdetail` AS `idprdetail`,`grnd`.`idcsdetail` AS `idcsdetail`,`grnd`.`idrqdetail` AS `idrqdetail`,`grnd`.`idbsdetail` AS `idbsdetail`,`grnd`.`idpodetail` AS `idpodetail`,`grnd`.`idipcdetail` AS `idipcdetail`,`grnd`.`jmlri` AS `jmlri`,`grnd`.`statusri` AS `statusri`,`grnd`.`jmldnr` AS `jmldnr`,`grnd`.`statusdnr` AS `statusdnr`,`grnd`.`jmlprt` AS `jmlprt`,`grnd`.`statusprt` AS `statusprt`,`grnd`.`jmlrealisasi` AS `jmlrealisasi`,`grnd`.`statusrealisasi` AS `statusrealisasi`,`grnd`.`isclose` AS `isclose`,`grnd`.`customtext1` AS `customtext1`,`grnd`.`customtext2` AS `customtext2`,`grnd`.`customtext3` AS `customtext3`,`grnd`.`customdbl1` AS `customdbl1`,`grnd`.`customdbl2` AS `customdbl2`,`grnd`.`customdbl3` AS `customdbl3`,`grnd`.`customdate1` AS `customdate1`,`grnd`.`customdate2` AS `customdate2`,`grnd`.`customdate3` AS `customdate3`,`grn`.`grnnotransaksi` AS `grnnotransaksi`,`grn`.`grnuraian` AS `grnuraian`,`grn`.`grncatatan` AS `grncatatan`,`grn`.`grnnoref` AS `grnnoref`,`grn`.`grntglnoref` AS `grntglnoref`,`grn`.`grnsupplierkontak` AS `grnsupplierkontak`,`grn`.`grn1alamat1` AS `grn1alamat1`,`grn`.`grn1alamat2` AS `grn1alamat2`,`grn`.`grn1alamat3` AS `grn1alamat3`,`grn`.`grn2alamat1` AS `grn2alamat1`,`grn`.`grn2alamat2` AS `grn2alamat2`,`grn`.`grn2alamat3` AS `grn2alamat3`,`grn`.`grntermin` AS `grntermin`,`tr`.`trnama` AS `grnterminnama`,`tr`.`trharijatuhtempo` AS `grnterminharijatuhtempo`,`grn`.`grnbagianpembelian` AS `grnbagianpembelian`,`c1`.`kkode` AS `grnbagianpembeliankode`,`c1`.`knama` AS `grnbagianpembeliannama`,`i`.`bkode` AS `kodebarang`,`i`.`bhpp` AS `bhpp`,`i`.`bjenis` AS `bjenis`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,`t1`.`tnama` AS `pajak1nama`,`t1`.`tnilai` AS `pajak1nilai`,`t2`.`tnama` AS `pajak2nama`,`t2`.`tnilai` AS `pajak2nilai`,((`grnd`.`jmlbarang` - `grnd`.`jmlri`) / `grnd`.`nilaisatuan`) AS `jmlsisari`,((`grnd`.`jmlbarang` - `grnd`.`jmlrealisasi`) / `grnd`.`nilaisatuan`) AS `jmlsisarealisasi`, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan from (((((((`m4_grn_detail` `grnd` left join `m4_grn` `grn` on((`grnd`.`idgrn` = `grn`.`grnid`))) left join `m1_terms` `tr` on((`grn`.`grntermin` = `tr`.`trkode`))) left join `m1_contact` `c1` on((`grn`.`grnbagianpembelian` = `c1`.`kid`))) left join `m1_item` `i` on((`grnd`.`idbarang` = `i`.`bid`))) left join `m1_tax` `t1` on((`grnd`.`pajak1` = `t1`.`tkode`))) left join `m1_tax` `t2` on((`grnd`.`pajak2` = `t2`.`tkode`))) left join `m0_setting` `s` on(((`s`.`smodule` = 0) and (`s`.`sgrup` = 'akun') and (`s`.`skode` = 'HutangSementara'))))
```

## Query 69

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_grn_detail_cd`

```sql
select `grnd`.`idgrndetail` AS `idgrndetail`,`grnd`.`idgrn` AS `idgrn`,`grnd`.`idbarang` AS `idbarang`,`grnd`.`namabarang` AS `namabarang`,`grnd`.`tipebarang` AS `tipebarang`,`grnd`.`jml` AS `jml`,`grnd`.`satuan` AS `satuan`,`grnd`.`nilaisatuan` AS `nilaisatuan`,`grnd`.`jmlbarang` AS `jmlbarang`,`grnd`.`satuanbarang` AS `satuanbarang`,`grnd`.`matauang` AS `matauang`,`grnd`.`kurs` AS `kurs`,`grnd`.`hargafix` AS `hargafix`,`grnd`.`harga` AS `harga`,`grnd`.`diskon` AS `diskon`,`grnd`.`jmldiskon` AS `jmldiskon`,`grnd`.`pajak1` AS `pajak1`,`grnd`.`pajak2` AS `pajak2`,`grnd`.`catatan` AS `catatan`,`grn`.`grnnotransaksi` AS `grnnotransaksi`,`i`.`bkode` AS `kodebarang`,((`grnd`.`jmlbarang` - `grnd`.`jmlri`) / `grnd`.`nilaisatuan`) AS `jmlsisari`,((`grnd`.`jmlbarang` - `grnd`.`jmlrealisasi`) / `grnd`.`nilaisatuan`) AS `jmlsisarealisasi` from ((`m4_grn_detail` `grnd` left join `m4_grn` `grn` on((`grnd`.`idgrn` = `grn`.`grnid`))) left join `m1_item` `i` on((`grnd`.`idbarang` = `i`.`bid`)))
```

## Query 70

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
select `nbt`.`nbtid` AS `nbtid`,`nbt`.`nbtjenismutasi` AS `nbtjenismutasi`,`nbt`.`nbtidbatchin` AS `nbtidbatchin`,`nbt`.`nbtgudang` AS `nbtgudang`,`nbt`.`nbtidbarang` AS `nbtidbarang`,`nbt`.`nbtkode` AS `nbtkode`,`nbt`.`nbtsumber` AS `nbtsumber`,`nbt`.`nbtidtransaksi` AS `nbtidtransaksi`,`nbt`.`nbtsatuan` AS `nbtsatuan`,`nbt`.`nbtjml` AS `nbtjml`,`nbt`.`nbtcustomtext1` AS `nbtcustomtext1`,`nbt`.`nbtcustomtext2` AS `nbtcustomtext2`,`nbt`.`nbtcustomtext3` AS `nbtcustomtext3`,`nbt`.`nbtcustomdbl1` AS `nbtcustomdbl1`,`nbt`.`nbtcustomdbl2` AS `nbtcustomdbl2`,`nbt`.`nbtcustomdbl3` AS `nbtcustomdbl3`,`nbt`.`nbtcustomdate1` AS `nbtcustomdate1`,`nbt`.`nbtcustomdate2` AS `nbtcustomdate2`,`nbt`.`nbtcustomdate3` AS `nbtcustomdate3`,`i`.`bkode` AS `kodebarang` from ((`m1_no_batch_transaction` `nbt` join `m1_item` `i` on((`nbt`.`nbtidbarang` = `i`.`bid`))) left join `m1_no_batch_in` `nbi` on((`nbt`.`nbtidbatchin` = `nbi`.`nbiidbatchin`)))
```

## Query 71

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn_history.vb`

```sql
select `nbt`.`nbtidhistory` AS `nbtidhistory`, `nbt`.`nbtidtransaksihistory` AS `nbtidtransaksihistory`,`nbt`.`nbtid` AS `nbtid`,`nbt`.`nbtjenismutasi` AS `nbtjenismutasi`,`nbt`.`nbtidbatchin` AS `nbtidbatchin`,`nbt`.`nbtgudang` AS `nbtgudang`,`nbt`.`nbtidbarang` AS `nbtidbarang`,`nbt`.`nbtkode` AS `nbtkode`,`nbt`.`nbtsumber` AS `nbtsumber`,`nbt`.`nbtidtransaksi` AS `nbtidtransaksi`,`nbt`.`nbtsatuan` AS `nbtsatuan`,`nbt`.`nbtjml` AS `nbtjml`,`nbt`.`nbtcustomtext1` AS `nbtcustomtext1`,`nbt`.`nbtcustomtext2` AS `nbtcustomtext2`,`nbt`.`nbtcustomtext3` AS `nbtcustomtext3`,`nbt`.`nbtcustomdbl1` AS `nbtcustomdbl1`,`nbt`.`nbtcustomdbl2` AS `nbtcustomdbl2`,`nbt`.`nbtcustomdbl3` AS `nbtcustomdbl3`,`nbt`.`nbtcustomdate1` AS `nbtcustomdate1`,`nbt`.`nbtcustomdate2` AS `nbtcustomdate2`,`nbt`.`nbtcustomdate3` AS `nbtcustomdate3`,`i`.`bkode` AS `kodebarang` from ((`m1_no_batch_transaction_history` `nbt` join `m1_item` `i` on((`nbt`.`nbtidbarang` = `i`.`bid`))) left join `m1_no_batch_in` `nbi` on((`nbt`.`nbtidbatchin` = `nbi`.`nbiidbatchin`)))
```

## Query 72

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
select `nst`.`nstid` AS `nstid`,`nst`.`nstjenismutasi` AS `nstjenismutasi`,`nst`.`nstidserialin` AS `nstidserialin`,`nst`.`nstgudang` AS `nstgudang`,`nst`.`nstidbarang` AS `nstidbarang`,`nst`.`nstkode` AS `nstkode`,`nst`.`nstsumber` AS `nstsumber`,`nst`.`nstidtransaksi` AS `nstidtransaksi`,`nst`.`nstsatuan` AS `nstsatuan`,`nst`.`nstjml` AS `nstjml`,`nst`.`nstcustomtext1` AS `nstcustomtext1`,`nst`.`nstcustomtext2` AS `nstcustomtext2`,`nst`.`nstcustomtext3` AS `nstcustomtext3`,`nst`.`nstcustomdbl1` AS `nstcustomdbl1`,`nst`.`nstcustomdbl2` AS `nstcustomdbl2`,`nst`.`nstcustomdbl3` AS `nstcustomdbl3`,`nst`.`nstcustomdate1` AS `nstcustomdate1`,`nst`.`nstcustomdate2` AS `nstcustomdate2`,`nst`.`nstcustomdate3` AS `nstcustomdate3`,`i`.`bkode` AS `kodebarang` from ((`m1_no_serial_transaction` `nst` join `m1_item` `i` on((`nst`.`nstidbarang` = `i`.`bid`))) left join `m1_no_serial_in` `nsi` on((`nst`.`nstidserialin` = `nsi`.`nsiidserialin`)))
```

## Query 73

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn_history.vb`

```sql
select `nst`.`nstidhistory` AS `nstidhistory`,`nst`.`nstidtransaksihistory` AS `nstidtransaksihistory`,`nst`.`nstid` AS `nstid`,`nst`.`nstjenismutasi` AS `nstjenismutasi`,`nst`.`nstidserialin` AS `nstidserialin`,`nst`.`nstgudang` AS `nstgudang`,`nst`.`nstidbarang` AS `nstidbarang`,`nst`.`nstkode` AS `nstkode`,`nst`.`nstsumber` AS `nstsumber`,`nst`.`nstidtransaksi` AS `nstidtransaksi`,`nst`.`nstsatuan` AS `nstsatuan`,`nst`.`nstjml` AS `nstjml`,`nst`.`nstcustomtext1` AS `nstcustomtext1`,`nst`.`nstcustomtext2` AS `nstcustomtext2`,`nst`.`nstcustomtext3` AS `nstcustomtext3`,`nst`.`nstcustomdbl1` AS `nstcustomdbl1`,`nst`.`nstcustomdbl2` AS `nstcustomdbl2`,`nst`.`nstcustomdbl3` AS `nstcustomdbl3`,`nst`.`nstcustomdate1` AS `nstcustomdate1`,`nst`.`nstcustomdate2` AS `nstcustomdate2`,`nst`.`nstcustomdate3` AS `nstcustomdate3`,`i`.`bkode` AS `kodebarang` from ((`m1_no_serial_transaction_history` `nst` join `m1_item` `i` on((`nst`.`nstidbarang` = `i`.`bid`))) left join `m1_no_serial_in` `nsi` on((`nst`.`nstidserialin` = `nsi`.`nsiidserialin`)))
```

## Query 74

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
select atr.atid AS atid, atr.atasetid AS atasetid, atr.atjenismutasi AS atjenismutasi, atr.atsumber AS atsumber, atr.atidutama AS atidutama,atr.atidbarang AS atidbarang,atr.atkode AS atkode, atr.atnama AS atnama, atr.atkategori AS atkategori, atr.atcabang AS atcabang, atr.atlokasi AS atlokasi, atr.atgudang AS atgudang,atr.atdivisi AS atdivisi, atr.atsubdivisi AS atsubdivisi, atr.atcostcenter AS atcostcenter, atr.atproyek AS atproyek, atr.atcatatan AS atcatatan, atr.atnomor AS atnomor, atr.attglbeli AS attglbeli, atr.attglpakai AS attglpakai, atr.atjml AS atjml, atr.atsatuan AS atsatuan, atr.atmatauang AS atmatauang, atr.atkurs AS atkurs, atr.atharga AS atharga, atr.atdiskon AS atdiskon, atr.atjmldiskon AS atjmldiskon, atr.atpajak1 AS atpajak1, atr.atjmlpajak1 AS atjmlpajak1, atr.atpajak2 AS atpajak2, atr.atjmlpajak2 AS atjmlpajak2, atr.athargabeli AS athargabeli, atr.atnilairesidu AS atnilairesidu, atr.atumurekonomis AS atumurekonomis, atr.atbebanperbln AS atbebanperbln, atr.atakumulasibeban AS atakumulasibeban, atr.atnilaibuku AS atnilaibuku, (CASE WHEN atr.atnilaibuku < atr.atbebanperbln THEN atr.atnilaibuku ELSE atr.atbebanperbln END) as atnilaipenyusutan, atr.atmetode AS atmetode, atr.attabelpenyusutan AS attabelpenyusutan, atr.atintangible AS atintangible, atr.atfiskal AS atfiskal, atr.atatastengahbulan AS atatastengahbulan, atr.atrekasset AS atrekasset, atr.atrekakumdepresiasi AS atrekakumdepresiasi, atr.atrekdepresiasi AS atrekdepresiasi, atr.atrekpenghapusan AS atrekpenghapusan, atr.atprodusen AS atprodusen, atr.attglpensiun AS attglpensiun, atr.atpenyusutanke AS atpenyusutanke, atr.atnilaimenurun AS atnilaimenurun, atr.atdispose AS atdispose, atr.atpembelian AS atpembelian, atr.atpenjualan AS atpenjualan, atr.atlocked AS atlocked, atr.atstatus AS atstatus, atr.atstatussebelumnya AS atstatussebelumnya, atr.atisclose AS atisclose, atr.atinputuser AS atinputuser, atr.atinputtgl AS atinputtgl, atr.atmodifikasiuser AS atmodifikasiuser, atr.atmodifikasitgl AS atmodifikasitgl, atr.atcustomtext1,atr.atcustomtext2,atr.atcustomtext3,atr.atcustomtext4,atr.atcustomtext5,atr.atcustomint1,atr.atcustomint2,atr.atcustomint3,atr.atcustomint4,atr.atcustomint5,atr.atcustomdbl1,atr.atcustomdbl2,atr.atcustomdbl3,atr.atcustomdbl4,atr.atcustomdbl5,atr.atcustomdate1,atr.atcustomdate2,atr.atcustomdate3,atr.atcustomdate4,atr.atcustomdate5,ac.acnama AS atkategorinama, br.bnama AS atcabangnama, l.lnama AS atlokasinama, w.wnama AS atgudangnama,d.dnama AS atdivisinama, sd.sdnama AS atsubdivisinama, cc.ccnama AS atcostcenternama, p.pnama AS atproyeknama, dc.nama AS atmetodenama, t1.tnama AS atpajak1nama, ifnull(t1.tnilai, 0) AS atpajak1nilai, t2.tnama AS atpajak2nama, ifnull(t2.tnilai, 0) AS atpajak2nilai,coa1.cnama AS atrekassetnama, coa2.cnama AS atrekakumdepresiasinama, coa3.cnama AS atrekdepresiasinama, coa4.cnama AS atrekpenghapusannama, c1.kkode AS atprodusenkode, c1.knama AS atprodusennama, sp1.nama AS atstatusnama, sp2.nama AS atstatussebelumnyanama, u1.unama AS atinputusernama, u2.unama AS atmodifikasiusernama, i.bkode AS kodebarang from m7_asset_transaction atr left join m7_asset_category ac on atr.atkategori = ac.ackode left join m1_branch br on atr.atcabang = br.bkode left join m1_location l on atr.atlokasi = l.lkode left join m1_warehouse w on atr.atgudang = w.wkode left join m1_division d on atr.atdivisi = d.dkode left join m1_subdivision sd on atr.atsubdivisi = sd.sdkode left join m7_depreciation_category dc on atr.atmetode = dc.kode left join m1_coa coa1 on atr.atrekasset = coa1.cnomor left join m1_coa coa2 on atr.atrekakumdepresiasi = coa2.cnomor left join m1_coa coa3 on atr.atrekdepresiasi = coa3.cnomor left join m1_coa coa4 on atr.atrekpenghapusan = coa4.cnomor left join m1_contact c1 on atr.atprodusen = c1.kid left join m0_status_progress sp1 on atr.atstatus = sp1.kode left join m0_status_progress sp2 on atr.atstatussebelumnya = sp2.kode left join m0_user u1 on atr.atinputuser = u1.userid left join m0_user u2 on atr.atmodifikasiuser = u2.userid left join m1_cost_center cc on atr.atcostcenter = cc.cckode left join m1_project p on atr.atproyek = p.pkode left join m1_tax t1 on atr.atpajak1 = t1.tkode left join m1_tax t2 on atr.atpajak2 = t2.tkode JOIN m1_item i ON atr.atidbarang = i.bid
```

## Query 75

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_grn_terkait`

```sql
select grn.grnid AS grnid, grn.grnnotransaksi AS grnnotransaksi, pr.prsumber AS sumber, pr.prid AS idterkait, pr.prnotransaksi AS noterkait, pr.prtgl AS tglterkait, pr.prinputtgl AS inputtglterkait, pr.prmodifikasitgl AS modifikasitglterkait, 0 AS jenisterkait from (((m4_pr_detail prd join m4_pr pr on((prd.idpr = pr.prid))) join m4_grn_detail grnd on((prd.idprdetail = grnd.idprdetail))) join m4_grn grn on((grnd.idgrn = grn.grnid))) where (grn.grnid = 'validtransaksi') group by pr.prid, grn.grnid union select grn.grnid AS grnid, grn.grnnotransaksi AS grnnotransaksi, po.posumber AS sumber, po.poid AS idterkait, po.ponotransaksi AS noterkait, po.potgl AS tglterkait, po.poinputtgl AS inputtglterkait, po.pomodifikasitgl AS modifikasitglterkait, 0 AS jenisterkait from (((m4_po_detail pod join m4_po po on((pod.idpo = po.poid))) join m4_grn_detail grnd on((pod.idpodetail = grnd.idpodetail))) join m4_grn grn on((grnd.idgrn = grn.grnid))) where (grn.grnid = 'validtransaksi') group by po.poid, grn.grnid union select grn.grnid AS grnid, grn.grnnotransaksi AS grnnotransaksi, ri.risumber AS sumber, ri.riid AS idterkait, ri.rinotransaksi AS noterkait, ri.ritgl AS tglterkait, ri.riinputtgl AS inputtglterkait, ri.rimodifikasitgl AS modifikasitglterkait, 1 AS jenisterkait from (((m4_ri_detail rid join m4_ri ri on((rid.idri = ri.riid))) join m4_grn_detail grnd on((grnd.idgrndetail = rid.idgrndetail))) join m4_grn grn on((grn.grnid = grnd.idgrn))) where (((ri.ristatus = 2) or (ri.ristatus = 3) or (ri.ristatus = 4) or (ri.ristatus = 7)) and (grn.grnid = 'validtransaksi')) group by ri.riid, grn.grnid union select grn.grnid AS grnid, grn.grnnotransaksi AS grnnotransaksi, ts.tssumber AS sumber, ts.tsid AS idterkait, ts.tsnotransaksi AS noterkait, ts.tstgl AS tglterkait, ts.tsinputtgl AS inputtglterkait, ts.tsmodifikasitgl AS modifikasitglterkait, 1 AS jenisterkait from (((m3_ts_detail tsd join m3_ts ts on((tsd.idts = ts.tsid))) join m4_grn_detail grnd on((grnd.idgrndetail = tsd.idgrndetail))) join m4_grn grn on((grn.grnid = grnd.idgrn))) where (((ts.tsstatus = 2) or (ts.tsstatus = 3) or (ts.tsstatus = 4) or (ts.tsstatus = 7)) and (grn.grnid = 'validtransaksi')) group by ts.tsid, grn.grnid
```

## Query 76

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
select grnd.idgrndetail AS idgrndetail, grnd.idgrn AS idgrn, grnd.idbarang AS idbarang, grnd.namabarang AS namabarang, grnd.tipebarang AS tipebarang, grnd.jml AS jml, grnd.satuan AS satuan, grnd.nilaisatuan AS nilaisatuan, grnd.jmlbarang AS jmlbarang, grnd.satuanbarang AS satuanbarang, grnd.matauang AS matauang, grnd.kurs AS kurs, grnd.hargafix AS hargafix, grnd.harga AS harga, grnd.diskon AS diskon, grnd.jmldiskon AS jmldiskon, grnd.pajak1 AS pajak1, grnd.jmlpajak1 AS jmlpajak1, grnd.pajak2 AS pajak2, grnd.jmlpajak2 AS jmlpajak2, grnd.cabang AS cabang, grnd.lokasi AS lokasi, grnd.gudang AS gudang, i.brekpersediaan AS rekpersediaan, grnd.rekdiskonpembelian AS rekdiskonpembelian, s.snilai AS rekhutangsementara, grnd.costcenter AS costcenter, grnd.divisi AS divisi, grnd.subdivisi AS subdivisi, grnd.proyek AS proyek, grnd.catatan AS catatan, grnd.urutan AS urutan, grnd.idprdetail AS idprdetail, grnd.idcsdetail AS idcsdetail, grnd.idrqdetail AS idrqdetail, grnd.idbsdetail AS idbsdetail, grnd.idpodetail AS idpodetail, grnd.idipcdetail AS idipcdetail, grnd.jmlri AS jmlri, grnd.statusri AS statusri, grnd.jmldnr AS jmldnr, grnd.statusdnr AS statusdnr, grnd.jmlprt AS jmlprt, grnd.statusprt AS statusprt, grnd.jmlrealisasi AS jmlrealisasi, grnd.statusrealisasi AS statusrealisasi, grnd.isclose AS isclose, grnd.customtext1 AS customtext1, grnd.customtext2 AS customtext2, grnd.customtext3 AS customtext3, grnd.customdbl1 AS customdbl1, grnd.customdbl2 AS customdbl2, grnd.customdbl3 AS customdbl3, grnd.customdate1 AS customdate1, grnd.customdate2 AS customdate2, grnd.customdate3 AS customdate3, grn.grnnotransaksi AS grnnotransaksi, grn.grnuraian AS grnuraian, grn.grncatatan AS grncatatan, grn.grnnoref AS grnnoref, grn.grntglnoref AS grntglnoref, grn.grnsupplierkontak AS grnsupplierkontak, grn.grn1alamat1 AS grn1alamat1, grn.grn1alamat2 AS grn1alamat2, grn.grn1alamat3 AS grn1alamat3, grn.grn2alamat1 AS grn2alamat1, grn.grn2alamat2 AS grn2alamat2, grn.grn2alamat3 AS grn2alamat3, grn.grntermin AS grntermin, tr.trnama AS grnterminnama, tr.trharijatuhtempo AS grnterminharijatuhtempo, grn.grnbagianpembelian AS grnbagianpembelian, c1.kkode AS grnbagianpembeliankode, c1.knama AS grnbagianpembeliannama, i.bkode AS kodebarang, i.bhpp AS bhpp, i.bjenis AS bjenis, i.bserial AS bserial, i.bbatch AS bbatch, t1.tnama AS pajak1nama, t1.tnilai AS pajak1nilai, t2.tnama AS pajak2nama, t2.tnilai AS pajak2nilai, ((grnd.jmlbarang - grnd.jmlri) / grnd.nilaisatuan) AS jmlsisari, ((grnd.jmlbarang - grnd.jmlrealisasi) / grnd.nilaisatuan) AS jmlsisarealisasi, ((grnd.jmlbarang - grnd.jmlts) / grnd.nilaisatuan) AS jmlsisats, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan, i.basset, po.ponotransaksi, po.pocustomtext1, po.pocustomtext2, grn.grnsupplier as grnsupplier, k.kkode AS grnsupplierkode, k.knama AS grnsuppliernama, grn.grntgljatuhtempo, t1.takunbeli as pajak1akunbeli, t1c1.cnama as pajak1akunbelinama, t1.takunjual as pajak1akunjual, t1c2.cnama as pajak1akunjualnama, t2.takunbeli as pajak2akunbeli, t2c1.cnama as pajak2akunbelinama, t2.takunjual as pajak2akunjual, t2c2.cnama as pajak2akunjualnama from m4_grn_detail grnd join m4_grn grn on grnd.idgrn = grn.grnid join m1_item i on grnd.idbarang = i.bid join m1_contact k on grn.grnsupplier = k.kid left join m1_terms tr on grn.grntermin = tr.trkode left join m1_contact c1 on grn.grnbagianpembelian = c1.kid left join m1_tax t1 on grnd.pajak1 = t1.tkode left join m1_tax t2 on grnd.pajak2 = t2.tkode left join m0_setting s on s.smodule = 0 and s.sgrup = 'akun' and s.skode = 'HutangSementara' left join m4_po_detail pod on grnd.idpodetail = pod.idpodetail left join m4_po po on pod.idpo = po.poid left join m1_coa t1c1 on t1.takunbeli = t1c1.cnomor left join m1_coa t1c2 on t1.takunjual = t1c2.cnomor left join m1_coa t2c1 on t2.takunbeli = t2c1.cnomor left join m1_coa t2c2 on t2.takunjual = t2c2.cnomor
```

## Query 77

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_grn.vb`

```sql
select grnd.idgrndetail AS idgrndetail, grnd.idgrn AS idgrn, grnd.idbarang AS idbarang, grnd.namabarang AS namabarang, grnd.tipebarang AS tipebarang, grnd.jml AS jml, grnd.satuan AS satuan, grnd.nilaisatuan AS nilaisatuan, grnd.jmlbarang AS jmlbarang, grnd.satuanbarang AS satuanbarang, grnd.matauang AS matauang, grnd.kurs AS kurs, grnd.hargafix AS hargafix, grnd.harga AS harga, grnd.diskon AS diskon, grnd.jmldiskon AS jmldiskon, grnd.pajak1 AS pajak1, grnd.jmlpajak1 AS jmlpajak1, grnd.pajak2 AS pajak2, grnd.jmlpajak2 AS jmlpajak2, grnd.cabang AS cabang, grnd.lokasi AS lokasi, grnd.gudang AS gudang, i.brekpersediaan AS rekpersediaan, grnd.rekdiskonpembelian AS rekdiskonpembelian, s.snilai AS rekhutangsementara, grnd.costcenter AS costcenter, grnd.divisi AS divisi, grnd.subdivisi AS subdivisi, grnd.proyek AS proyek, grnd.catatan AS catatan, grnd.urutan AS urutan, grnd.idprdetail AS idprdetail, grnd.idcsdetail AS idcsdetail, grnd.idrqdetail AS idrqdetail, grnd.idbsdetail AS idbsdetail, grnd.idpodetail AS idpodetail, grnd.idipcdetail AS idipcdetail, grnd.jmlri AS jmlri, grnd.statusri AS statusri, grnd.jmldnr AS jmldnr, grnd.statusdnr AS statusdnr, grnd.jmlprt AS jmlprt, grnd.statusprt AS statusprt, grnd.jmlrealisasi AS jmlrealisasi, grnd.statusrealisasi AS statusrealisasi, grnd.isclose AS isclose, grnd.customtext1 AS customtext1, grnd.customtext2 AS customtext2, grnd.customtext3 AS customtext3, grnd.customdbl1 AS customdbl1, grnd.customdbl2 AS customdbl2, grnd.customdbl3 AS customdbl3, grnd.customdate1 AS customdate1, grnd.customdate2 AS customdate2, grnd.customdate3 AS customdate3, grn.grnnotransaksi AS grnnotransaksi, grn.grnuraian AS grnuraian, grn.grncatatan AS grncatatan, grn.grnnoref AS grnnoref, grn.grntglnoref AS grntglnoref, grn.grnsupplierkontak AS grnsupplierkontak, grn.grn1alamat1 AS grn1alamat1, grn.grn1alamat2 AS grn1alamat2, grn.grn1alamat3 AS grn1alamat3, grn.grn2alamat1 AS grn2alamat1, grn.grn2alamat2 AS grn2alamat2, grn.grn2alamat3 AS grn2alamat3, grn.grntermin AS grntermin, tr.trnama AS grnterminnama, tr.trharijatuhtempo AS grnterminharijatuhtempo, grn.grnbagianpembelian AS grnbagianpembelian, c1.kkode AS grnbagianpembeliankode, c1.knama AS grnbagianpembeliannama, i.bkode AS kodebarang, i.bhpp AS bhpp, i.bjenis AS bjenis, i.bserial AS bserial, i.bbatch AS bbatch, t1.tnama AS pajak1nama, t1.tnilai AS pajak1nilai, t2.tnama AS pajak2nama, t2.tnilai AS pajak2nilai, ((grnd.jmlbarang - grnd.jmlri) / grnd.nilaisatuan) AS jmlsisari, ((grnd.jmlbarang - grnd.jmlrealisasi) / grnd.nilaisatuan) AS jmlsisarealisasi, ((grnd.jmlbarang - grnd.jmlts) / grnd.nilaisatuan) AS jmlsisats, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan, i.basset, po.ponotransaksi, po.pocustomtext1, po.pocustomtext2, grn.grnsupplier as grnsupplier, k.kkode AS grnsupplierkode, k.knama AS grnsuppliernama, grn.grntgljatuhtempo, t1.takunbeli as pajak1akunbeli, t1c1.cnama as pajak1akunbelinama, t1.takunjual as pajak1akunjual, t1c2.cnama as pajak1akunjualnama, t2.takunbeli as pajak2akunbeli, t2c1.cnama as pajak2akunbelinama, t2.takunjual as pajak2akunjual, t2c2.cnama as pajak2akunjualnama, d.dnama AS divisinama, sd.sdnama AS subdivisinama, cc.ccnama AS costcenternama, p.pnama AS proyeknama from m4_grn_detail grnd join m4_grn grn on grnd.idgrn = grn.grnid join m1_item i on grnd.idbarang = i.bid join m1_contact k on grn.grnsupplier = k.kid left join m1_terms tr on grn.grntermin = tr.trkode left join m1_contact c1 on grn.grnbagianpembelian = c1.kid left join m1_tax t1 on grnd.pajak1 = t1.tkode left join m1_tax t2 on grnd.pajak2 = t2.tkode left join m0_setting s on s.smodule = 0 and s.sgrup = 'akun' and s.skode = 'HutangSementara' left join m4_po_detail pod on grnd.idpodetail = pod.idpodetail left join m4_po po on pod.idpo = po.poid left join m1_coa t1c1 on t1.takunbeli = t1c1.cnomor left join m1_coa t1c2 on t1.takunjual = t1c2.cnomor left join m1_coa t2c1 on t2.takunbeli = t2c1.cnomor left join m1_coa t2c2 on t2.takunjual = t2c2.cnomor LEFT JOIN m1_division d ON d.dkode = grnd.divisi LEFT JOIN m1_subdivision sd ON sd.sdkode = grnd.subdivisi LEFT JOIN m1_cost_center cc ON cc.cckode = grnd.costcenter LEFT JOIN m1_project p ON p.pkode = grnd.proyek
```

## Query 78

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_caridata.vb` `CdM4_Grn_Detail`

```sql
select grnd.idgrndetail AS idgrndetail, grnd.idgrn AS idgrn, grnd.idbarang AS idbarang, grnd.namabarang AS namabarang, grnd.tipebarang AS tipebarang, grnd.jml AS jml, grnd.satuan AS satuan, grnd.nilaisatuan AS nilaisatuan, grnd.jmlbarang AS jmlbarang, grnd.satuanbarang AS satuanbarang, grnd.matauang AS matauang, grnd.kurs AS kurs, grnd.hargafix AS hargafix, grnd.harga AS harga, grnd.diskon AS diskon, grnd.jmldiskon AS jmldiskon, grnd.pajak1 AS pajak1, grnd.pajak2 AS pajak2, grnd.catatan AS catatan, grn.grnnotransaksi AS grnnotransaksi, i.bkode AS kodebarang, ((grnd.jmlbarang - grnd.jmlri) / grnd.nilaisatuan) AS jmlsisari, ((grnd.jmlbarang - grnd.jmlrealisasi) / grnd.nilaisatuan) AS jmlsisarealisasi, ((grnd.jmlbarang - grnd.jmlts) / grnd.nilaisatuan) AS jmlsisats, po.ponotransaksi from m4_grn_detail grnd join m1_item i on grnd.idbarang = i.bid left join m4_grn grn on grnd.idgrn = grn.grnid left join m4_po_detail pod on grnd.idpodetail = pod.idpodetail left join m4_po po on pod.idpo = po.poid
```

