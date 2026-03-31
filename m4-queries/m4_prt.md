# M4_PRT Queries

## Query 1

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
DELETE FROM M2_Transaction_Journal WHERE tsumber = 'PRT' AND tidtransaksi = '{idtransaksi}' AND tnotransaksi = '{notransaksi}'
```

## Query 2

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
DELETE FROM M4_Prt WHERE prtid='{idtransaksi}'
```

## Query 3

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
DELETE FROM M4_Prt_Detail WHERE idprt='{idtransaksi}'
```

## Query 4

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
DELETE FROM m1_cogs_fifo_out WHERE {delFilterHppF}
```

## Query 5

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
DELETE FROM m1_cogs_special_out WHERE {delFilterHppI}
```

## Query 6

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
DELETE FROM m1_item_transaction WHERE sumber = '{sumber}' AND idutama = '{idtransaksi}'
```

## Query 7

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
DELETE FROM m1_no_batch_out WHERE nbosumber = '{sumber}' AND nboidtransaksi = '{idtransaksi}'
```

## Query 8

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
DELETE FROM m1_no_serial_out WHERE nsosumber = '{sumber}' AND nsoidtransaksi = '{idtransaksi}'
```

## Query 9

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
DELETE a FROM m7_asset a WHERE a.aid IN({strValue2.ToString})
```

## Query 10

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
Delete from M1_No_Batch_Transaction where nbtidtransaksi = '{idtransaksi}' AND nbtsumber = '{sumber}'
```

## Query 11

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
Delete from M1_No_Batch_Transaction where nbtidtransaksi = '{result_4}' AND nbtsumber = 'PRT'
```

## Query 12

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
Delete from M1_No_Serial_Transaction where nstidtransaksi = '{idtransaksi}' AND nstsumber = '{sumber}'
```

## Query 13

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
Delete from M1_No_Serial_Transaction where nstidtransaksi = '{result_4}' AND nstsumber = 'PRT'
```

## Query 14

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
Delete from M4_Prt_Detail where idprt = '{result_4}'
```

## Query 15

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
Delete from M7_Asset_Transaction where atidutama = '{idtransaksi}' AND atsumber = '{sumber}'
```

## Query 16

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
Delete from M7_Asset_Transaction where atidutama = '{result_4}' AND atsumber = 'PRT'
```

## Query 17

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
INSERT INTO m1_item_stock_warehouse (idbarang, kgudang, stok) VALUES ('{idbarang}','{gudang}','-{jmlbarang}') ON DUPLICATE KEY UPDATE stok = stok + VALUES(stok)
```

## Query 18

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
INSERT INTO m1_item_stock_warehouse (idbarang, kgudang, stok) VALUES {updStokIn} ON DUPLICATE KEY UPDATE stok = stok + VALUES(stok)
```

## Query 19

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt_history.vb`

```sql
INSERT INTO m1_no_batch_transaction_history(SELECT 0, '{result_4}', nb.* FROM m1_no_batch_transaction nb WHERE nb.nbtidtransaksi = '{idtransaksi}' and nb.nbtsumber = 'PRT')
```

## Query 20

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt_history.vb`

```sql
INSERT INTO m1_no_serial_transaction_history(SELECT 0, '{result_4}', ns.* FROM m1_no_serial_transaction ns WHERE ns.nstidtransaksi = '{idtransaksi}' and ns.nstsumber = 'PRT')
```

## Query 21

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt_history.vb`

```sql
INSERT INTO m4_prt_detail_history (SELECT 0, '{result_4}', prt.* FROM m4_prt_detail prt WHERE prt.idprt = '{idtransaksi}' )
```

## Query 22

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt_history.vb`

```sql
INSERT INTO m4_prt_history(SELECT 0, prt.* FROM m4_prt prt WHERE prt.prtid = '{idtransaksi}')
```

## Query 23

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt_history.vb`

```sql
INSERT INTO m7_asset_transaction_history(SELECT 0, '{result_4}', atr.* FROM m7_asset_transaction atr WHERE atr.atidutama = '{idtransaksi}' and atr.atsumber = 'PRT')
```

## Query 24

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
Insert into M0_Msmq_Cogs(mcid, mcsumber, mcidtransaksi, mcprogress, mcpesan, mctglantrian, mctglselesai, mcuserid) values ('{mjid}', '{sumber}', '{result_4}', '{0}', '', NOW(), '1971-01-01 00:00:00', '{userid}')
```

## Query 25

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
Insert into M0_Msmq_Journal(mjid, mjsumber, mjidtransaksi, mjprogress, mjpesan, mjtglantrian, mjtglselesai, mjuserid) values ('{mjid}', '{sumber}', '{result_4}', '{0}', '', NOW(), '1971-01-01 00:00:00', '{userid}')
```

## Query 26

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
Insert into M0_Userlog (uluserid, ulidmodule, ulidmenu, uljenisaktivitas, ulaktivitas, ultgl, ulkodepa) values({userid}, {mdlid}, {mnid}, {jnsaktivitas}, '{notransaksi}', NOW(), {0})
```

## Query 27

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
Insert into M1_Item_Transaction (id, cabang, lokasi, gudang, kodepa, jenismutasi, sumber, idutama, iddetail, notransaksi, tgl, kontak, idbarang, namabarang, tipebarang, tipehpp, jml, satuan, jmlbarang, satuanbarang, matauang, kurs, harga, diskon, jmldiskon, idhppikm, idhppikk, hpp, uraian, catatan, catatandetail, costcenter, divisi, subdivisi, proyek, saldojml, saldohpp, saldonilai, inputtgl, inputuser, postingtgl, updatehpp, postinghpp, hppfix, postingjurnal, jurnalfix, tutupperiode, isclose, customtext1, customtext2, customtext3, customtext4, customtext5, customtext6, customtext7, customtext8, customtext9, customtext10, customint1, customint2, customint3, customint4, customint5, customint6, customint7, customint8, customint9, customint10, customdbl1, customdbl2, customdbl3, customdbl4, customdbl5, customdbl6, customdbl7, customdbl8, customdbl9, customdbl10, customdate1, customdate2, customdate3, customdate4, customdate5, customdate6, customdate7, customdate8, customdate9, customdate10) values{strTransaksiBarang.ToString}
```

## Query 28

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
Insert into M1_No_Batch_Out(nboid, nboidbatchin, nbogudang, nboidbarang, nbokode, nbosumber, nboidtransaksi, nbosatuan, nbojmlkeluar, nboisclose) values{strValue2.ToString}
```

## Query 29

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
Insert into M1_No_Batch_Transaction(nbtid, nbtjenismutasi, nbtidbatchin, nbtgudang, nbtidbarang, nbtkode, nbtsumber, nbtidtransaksi, nbtsatuan, nbtjml, nbtcustomtext1, nbtcustomtext2, nbtcustomtext3, nbtcustomdbl1, nbtcustomdbl2, nbtcustomdbl3, nbtcustomdate1, nbtcustomdate2, nbtcustomdate3) values{strValue2.ToString}
```

## Query 30

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
Insert into M1_No_Serial_Out(nsoid, nsoidserialin, nsogudang, nsoidbarang, nsokode, nsosumber, nsoidtransaksi, nsosatuan, nsojmlkeluar, nsoisclose) values{strValue2.ToString}
```

## Query 31

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
Insert into M1_No_Serial_Transaction(nstid, nstjenismutasi, nstidserialin, nstgudang, nstidbarang, nstkode, nstsumber, nstidtransaksi, nstsatuan, nstjml, nstcustomtext1, nstcustomtext2, nstcustomtext3, nstcustomdbl1, nstcustomdbl2, nstcustomdbl3, nstcustomdate1, nstcustomdate2, nstcustomdate3) values{strValue2.ToString}
```

## Query 32

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
Insert into M4_Prt (prtcabang, prtlokasi, prtgudang, prtasalbarang, prtasalbarangkategori, prtjenispembelian, prtjenispembeliankategori, prtcarabayar, prtsumber, prtautonotransaksi, prtnotransaksi, prttgl, prtkodepa, prtsupplier, prtsupplierkontak, prt1alamat1, prt1alamat2, prt1alamat3, prt2alamat1, prt2alamat2, prt2alamat3, prtbagianpembelian, prttermin, prttgljatuhtempo, prturaian, prtcatatan, prtnoref, prttglnoref, prttglpenutupan, prtmatauang, prtkurs, prthargatermasukpajak, prttotal, prtdiskonpersen, prtjmldiskon, prttotalpajak1detail, prttotalpajak2detail, prtbiayalainpersen, prtbiayalain, prttotaltransaksi, prtsisatransaksi, prtjmlbayar, prtstatuslunas, prttgllunas, prtnofakturpajak, prtsdhbayarpajak, prttglbayarpajak, prtrekdiskon, prtrekpajak1, prtrekpajak2, prtrekbiayalain, prtrekbayar, prtreksisa, prtidpr, prtidcs, prtidrq, prtidbs, prtidpo, prtidipc, prtidgrn, prtidri, prtiddnr, prtstatus, prtstatussebelumnya, prtjmlrevisi, prtcetakanke, prtinputuser, prtinputtgl, prtmodifikasiuser, prtmodifikasitgl, prtposting, prttutupperiode, prtisclose, prtcustomtext1, prtcustomtext2, prtcustomtext3, prtcustomtext4, prtcustomtext5, prtcustomint1, prtcustomint2, prtcustomint3, prtcustomdbl1, prtcustomdbl2, prtcustomdbl3, prtcustomdate1, prtcustomdate2, prtcustomdate3, prtjenis) values('{prtcabang}', '{prtlokasi}', '{prtgudang}', '{prtasalbarang}', {prtasalbarangkategori}, '{prtjenispembelian}', {prtjenispembeliankategori}, {prtcarabayar}, '{prtsumber}', {prtautonotransaksi}, '{notransaksi}', '{prttgl}', {prtkodepa}, {prtsupplier}, '{prtsupplierkontak}', '{prt1alamat1}', '{prt1alamat2}', '{prt1alamat3}', '{prt2alamat1}', '{prt2alamat2}', '{prt2alamat3}', {prtbagianpembelian}, '{prttermin}', '{prttgljatuhtempo}', '{prturaian}', '{prtcatatan}', '{prtnoref}', '{prttglnoref}', '{prttglpenutupan}', '{prtmatauang}', '{prtkurs}', {prthargatermasukpajak}, '{prttotal}', '{prtdiskonpersen}', '{prtjmldiskon}', '{prttotalpajak1detail}', '{prttotalpajak2detail}', '{prtbiayalainpersen}', '{prtbiayalain}', '{prttotaltransaksi}', '{prtsisatransaksi}', '{prtjmlbayar}', {prtstatuslunas}, '{prttgllunas}', '{prtnofakturpajak}', {prtsdhbayarpajak}, '{prttglbayarpajak}', '{prtrekdiskon}', '{prtrekpajak1}', '{prtrekpajak2}', '{prtrekbiayalain}', '{prtrekbayar}', '{prtreksisa}', {prtidpr}, {prtidcs}, {prtidrq}, {prtidbs}, {prtidpo}, {prtidipc}, {prtidgrn}, {prtidri}, {prtiddnr}, {prtstatus}, {prtstatussebelumnya}, {prtjmlrevisi}, {prtcetakanke}, {prtinputuser}, NOW(), {prtmodifikasiuser}, '1971-01-01 00:00:00', 0, {prttutupperiode}, {prtisclose}, '{prtcustomtext1}', '{prtcustomtext2}', '{prtcustomtext3}', '{prtcustomtext4}', '{prtcustomtext5}', {prtcustomint1}, {prtcustomint2}, {prtcustomint3}, '{prtcustomdbl1}', '{prtcustomdbl2}', '{prtcustomdbl3}', '{prtcustomdate1}', '{prtcustomdate2}', '{prtcustomdate3}', '{prtjenis}')
```

## Query 33

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
Insert into M4_Prt (prtcabang, prtlokasi, prtgudang, prtasalbarang, prtasalbarangkategori, prtjenispembelian, prtjenispembeliankategori, prtcarabayar, prtsumber, prtautonotransaksi, prtnotransaksi, prttgl, prtkodepa, prtsupplier, prtsupplierkontak, prt1alamat1, prt1alamat2, prt1alamat3, prt2alamat1, prt2alamat2, prt2alamat3, prtbagianpembelian, prttermin, prttgljatuhtempo, prturaian, prtcatatan, prtnoref, prttglnoref, prttglpenutupan, prtmatauang, prtkurs, prthargatermasukpajak, prttotal, prtdiskonpersen, prtjmldiskon, prttotalpajak1detail, prttotalpajak2detail, prtbiayalainpersen, prtbiayalain, prttotaltransaksi, prtsisatransaksi, prtjmlbayar, prtstatuslunas, prttgllunas, prtnofakturpajak, prtsdhbayarpajak, prttglbayarpajak, prtrekdiskon, prtrekpajak1, prtrekpajak2, prtrekbiayalain, prtrekbayar, prtreksisa, prtidpr, prtidcs, prtidrq, prtidbs, prtidpo, prtidipc, prtidgrn, prtidri, prtiddnr, prtstatus, prtstatussebelumnya, prtjmlrevisi, prtcetakanke, prtinputuser, prtinputtgl, prtmodifikasiuser, prtmodifikasitgl, prtposting, prttutupperiode, prtisclose, prtcustomtext1, prtcustomtext2, prtcustomtext3, prtcustomtext4, prtcustomtext5, prtcustomint1, prtcustomint2, prtcustomint3, prtcustomdbl1, prtcustomdbl2, prtcustomdbl3, prtcustomdate1, prtcustomdate2, prtcustomdate3, prtsaldoawal) values('{prtcabang}', '{prtlokasi}', '{prtgudang}', '{prtasalbarang}', {prtasalbarangkategori}, '{prtjenispembelian}', {prtjenispembeliankategori}, {prtcarabayar}, '{prtsumber}', {prtautonotransaksi}, '{notransaksi}', '{prttgl}', {prtkodepa}, {prtsupplier}, '{prtsupplierkontak}', '{prt1alamat1}', '{prt1alamat2}', '{prt1alamat3}', '{prt2alamat1}', '{prt2alamat2}', '{prt2alamat3}', {prtbagianpembelian}, '{prttermin}', '{prttgljatuhtempo}', '{prturaian}', '{prtcatatan}', '{prtnoref}', '{prttglnoref}', '{prttglpenutupan}', '{prtmatauang}', '{prtkurs}', {prthargatermasukpajak}, '{prttotal}', '{prtdiskonpersen}', '{prtjmldiskon}', '{prttotalpajak1detail}', '{prttotalpajak2detail}', '{prtbiayalainpersen}', '{prtbiayalain}', '{prttotaltransaksi}', '{prtsisatransaksi}', '{prtjmlbayar}', {prtstatuslunas}, '{prttgllunas}', '{prtnofakturpajak}', {prtsdhbayarpajak}, '{prttglbayarpajak}', '{prtrekdiskon}', '{prtrekpajak1}', '{prtrekpajak2}', '{prtrekbiayalain}', '{prtrekbayar}', '{prtreksisa}', {prtidpr}, {prtidcs}, {prtidrq}, {prtidbs}, {prtidpo}, {prtidipc}, {prtidgrn}, {prtidri}, {prtiddnr}, {prtstatus}, {prtstatussebelumnya}, {prtjmlrevisi}, {prtcetakanke}, {prtinputuser}, NOW(), {prtmodifikasiuser}, '1971-01-01 00:00:00', 0, {prttutupperiode}, {prtisclose}, '{prtcustomtext1}', '{prtcustomtext2}', '{prtcustomtext3}', '{prtcustomtext4}', '{prtcustomtext5}', {prtcustomint1}, {prtcustomint2}, {prtcustomint3}, '{prtcustomdbl1}', '{prtcustomdbl2}', '{prtcustomdbl3}', '{prtcustomdate1}', '{prtcustomdate2}', '{prtcustomdate3}', 1)
```

## Query 34

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
Insert into M4_Prt_Detail(idprtdetail, idprt, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, hargafix, idhppkhususmasuk, idhppfifomasuk, hpp, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudangasal, gudangtransit, gudangtujuan, rekpersediaan, rekdiskonpembelian, rekhargapokok, rekreturpembelian, costcenter, divisi, subdivisi, proyek, catatan, urutan, idprdetail, idcsdetail, idrqdetail, idbsdetail, idpodetail, idipcdetail, idgrndetail, idridetail, iddnrdetail, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2.ToString}
```

## Query 35

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
Insert into M7_Asset(aid, akode, anama, akategori, acabang, alokasi, agudang, adivisi, asubdivisi, acostcenter, aproyek, acatatan, anomor, atglbeli, atglpakai, ajml, asatuan, amatauang, akurs, aharga, adiskon, ajmldiskon, apajak1, ajmlpajak1, apajak2, ajmlpajak2, ahargabeli, anilairesidu, aumurekonomis, abebanperbln, aakumulasibeban, anilaibuku, ametode, atabelpenyusutan, aintangible, afiskal, aatastengahbulan, arekasset, arekakumdepresiasi, arekdepresiasi, arekpenghapusan, aprodusen, atglpensiun, apenyusutanke, anilaimenurun, adispose, apembelian, apenjualan, alocked, astatus, astatussebelumnya, aisclose, ainputuser, ainputtgl, amodifikasiuser, amodifikasitgl, acustomtext1, acustomtext2, acustomtext3, acustomtext4, acustomtext5, acustomint1, acustomint2, acustomint3, acustomint4, acustomint5, acustomdbl1, acustomdbl2, acustomdbl3, acustomdbl4, acustomdbl5, acustomdate1, acustomdate2, acustomdate3, acustomdate4, acustomdate5, aidbarang) values{strValue2.ToString}
```

## Query 36

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
Insert into M7_Asset_Transaction(atid, atasetid, atjenismutasi, atsumber, atidutama, atidbarang, atkode, atnama, atkategori, atcabang, atlokasi, atgudang, atdivisi, atsubdivisi, atcostcenter, atproyek, atcatatan, atnomor, attglbeli, attglpakai, atjml, atsatuan, atmatauang, atkurs, atharga, atdiskon, atjmldiskon, atpajak1, atjmlpajak1, atpajak2, atjmlpajak2, athargabeli, atnilairesidu, atumurekonomis, atbebanperbln, atakumulasibeban, atnilaibuku, atmetode, attabelpenyusutan, atintangible, atfiskal, atatastengahbulan, atrekasset, atrekakumdepresiasi, atrekdepresiasi, atrekpenghapusan, atprodusen, attglpensiun, atpenyusutanke, atnilaimenurun, atdispose, atpembelian, atpenjualan, atlocked, atstatus, atstatussebelumnya, atisclose, atinputuser, atinputtgl, atmodifikasiuser, atmodifikasitgl, atcustomtext1, atcustomtext2, atcustomtext3, atcustomtext4, atcustomtext5, atcustomint1, atcustomint2, atcustomint3, atcustomint4, atcustomint5, atcustomdbl1, atcustomdbl2, atcustomdbl3, atcustomdbl4, atcustomdbl5, atcustomdate1, atcustomdate2, atcustomdate3, atcustomdate4, atcustomdate5, atnotransaksi, attgl) values{strValue2.ToString}
```

## Query 37

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
SELECT a.akode, a.anama, da.danotransaksi FROM m7_da_detail dad JOIN m7_da da ON dad.idda = da.daid AND da.dastatus IN(2,3,4,7) JOIN m7_asset a ON dad.idaset = a.aid AND dad.idaset IN({strValue2.ToString}) GROUP BY da.daid, dad.idaset ORDER BY da.datgl, da.daid, dad.idaset LIMIT 1
```

## Query 38

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
SELECT bkode, cfiidbarang, SUM(cfisisa) as cfitotalsisa FROM m1_cogs_fifo_in JOIN m1_item ON cfiidbarang = bid WHERE {ftHppF} GROUP BY cfiidbarang HAVING {havingHppF}
```

## Query 39

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
SELECT bstok FROM m1_item WHERE bid = '{idbarang}'
```

## Query 40

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
SELECT ccakun FROM m1_cost_center WHERE cckode = '{dataRowDetail_32}'
```

## Query 41

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
SELECT csi.idhppikm, csi.idbarang, csi.sisa, i.bkode FROM m1_cogs_special_in csi JOIN m1_item i ON csi.idbarang = i.bid WHERE {ftHppI}
```

## Query 42

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
SELECT dnr.dnrnotransaksi as notransaksi, (CASE dnr.dnrhargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m4_dnr_detail dnrd JOIN m4_dnr dnr ON dnrd.iddnr = dnr.dnrid WHERE {ftDNR} GROUP BY dnr.dnrhargatermasukpajak
```

## Query 43

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
SELECT dnrd.iddnrdetail, (dnrd.jmlbarang - dnrd.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m4_dnr_detail AS dnrd INNER JOIN m1_item AS i ON dnrd.idbarang = i.bid WHERE {ftOutstandingDNR}
```

## Query 44

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
SELECT i.bkode, dnrd.iddnrdetail, dnr.dnrnotransaksi as notransaksi, (CASE dnr.dnrhargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m4_dnr_detail dnrd JOIN m4_dnr dnr ON dnrd.iddnr = dnr.dnrid JOIN m1_item i ON dnrd.idbarang = i.bid WHERE ({ftDNR}) AND dnr.dnrhargatermasukpajak <> {termasukPajak} ORDER BY dnrd.urutan
```

## Query 45

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
SELECT i.bkode, rid.idridetail, ri.rinotransaksi as notransaksi, (CASE ri.rihargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m4_ri_detail rid JOIN m4_ri ri ON rid.idri = ri.riid JOIN m1_item i ON rid.idbarang = i.bid WHERE ({ftRI}) AND ri.rihargatermasukpajak <> {termasukPajak} ORDER BY rid.urutan
```

## Query 46

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
SELECT isw.idbarang, isw.kgudang, isw.stok - IFNULL(isb.jmlbooking,0) as stok, i.bkode FROM m1_item_stock_warehouse isw JOIN m1_item i ON isw.idbarang = i.bid AND i.bjenis <> 'J' LEFT JOIN m1_warehouse w ON isw.kgudang = w.wkode LEFT JOIN m1_item_booking isb ON isw.idbarang = isb.idbarang AND w.wbookingstok = 1 WHERE {ftStok}
```

## Query 47

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
SELECT nbi.nbiidbarang, nbi.nbikode, nbi.nbigudang, nbi.nbijmlsisa, i.bkode FROM m1_no_batch_in nbi JOIN m1_item i ON nbi.nbiidbarang = i.bid WHERE {ftBatch}
```

## Query 48

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
SELECT nsi.nsiidbarang, nsi.nsikode, nsi.nsigudang, nsi.nsijmlsisa, i.bkode FROM m1_no_serial_in nsi JOIN m1_item i ON nsi.nsiidbarang = i.bid WHERE {ftSerial}
```

## Query 49

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
SELECT prtcabang, prtlokasi, prtsumber, prtautonotransaksi, prtnotransaksi, prttgl FROM M4_prt WHERE prtid = '{idtransaksi}'
```

## Query 50

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt_history.vb`

```sql
SELECT prtidhistory FROM m4_prt_history WHERE prtid = '{idtransaksi}' ORDER BY prtmodifikasitgl DESC LIMIT 1
```

## Query 51

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
SELECT ri.riid, ri.rinotransaksi, ri.ritotaltransaksi, ri.rijmlbayar FROM M4_Prt_detail Prtd JOIN M4_ri_detail rid ON Prtd.idridetail = rid.idridetail JOIN M4_ri ri ON rid.idri = ri.riid WHERE Prtd.idPrt = '{result_4}' GROUP BY ri.riid
```

## Query 52

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
SELECT ri.rinotransaksi as notransaksi, (CASE ri.rihargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m4_ri_detail rid JOIN m4_ri ri ON rid.idri = ri.riid WHERE {ftRI} GROUP BY ri.rihargatermasukpajak
```

## Query 53

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
SELECT rid.idri FROM m4_prt_detail prtd JOIN m4_ri_detail rid ON prtd.idridetail = rid.idridetail WHERE prtd.idprt = '{idtransaksi}' GROUP BY rid.idri
```

## Query 54

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
SELECT rid.idridetail, (rid.jmlbarang - rid.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m4_ri_detail AS rid INNER JOIN m1_item AS i ON rid.idbarang = i.bid WHERE {ftOutstandingRI}
```

## Query 55

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
UPDATE M4_Prt SET Prtstatus = {nilaiStatus}, Prtmodifikasiuser='{userid}', Prtmodifikasitgl = NOW(), Prtposting = 0, Prtpostingtgl = '1971-01-01 00:00:00', Prtjmlrevisi = Prtjmlrevisi + 1 WHERE Prtid = '{idtransaksi}'
```

## Query 56

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
UPDATE m1_cogs_fifo_in SET cfijmlkeluar = (CASE cfiid {updNilaiHppF} ELSE cfijmlkeluar END) WHERE {updFilterHppF}
```

## Query 57

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
UPDATE m1_cogs_special_in SET jmlkeluar = (CASE idhppikm {updNilaiHppI} ELSE jmlkeluar END) WHERE {updFilterHppI}
```

## Query 58

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
UPDATE m1_item SET bstok = '{saldojml}' WHERE bid = '{idbarang}'
```

## Query 59

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
UPDATE m1_item SET bstok = (CASE bid {updStokBarang} ELSE bstok END) WHERE {ftStokBarang}
```

## Query 60

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
UPDATE m1_item i JOIN ( SELECT prtd.idbarang, ROUND(SUM(prtd.jmlbarang * prtd.hpp),2) as nilai, SUM(prtd.jmlbarang) as jumlah FROM m4_prt_detail prtd WHERE prtd.jmlbarang <> 0 AND prtd.idprt = '{idtransaksi}' GROUP BY prtd.idbarang ) as h ON i.bid = h.idbarang SET i.bhppaverage = (CASE i.bjenis WHEN 'P' THEN (CASE i.bstok WHEN 0 THEN 0 ELSE ROUND((((i.bstok - h.jumlah) * i.bhppaverage) + (h.nilai)) / (i.bstok),2) END) ELSE IFNULL(ROUND((((i.bstok - h.jumlah) * i.bhppaverage) + (h.nilai)) / (i.bstok),2),0) END)
```

## Query 61

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
UPDATE m1_no_batch_in SET nbijmlkeluar = (CASE {updNilaiBatch} ELSE nbijmlkeluar END) WHERE {updFilterBatch}
```

## Query 62

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
UPDATE m1_no_serial_in SET nsijmlkeluar = (CASE {updNilaiSerial} ELSE nsijmlkeluar END) WHERE {updFilterSerial}
```

## Query 63

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
UPDATE m4_dnr SET dnrstatusrealisasi = (CASE dnrid {updNilaiDNR} ELSE dnrstatusrealisasi END) WHERE {updFilterDNR}
```

## Query 64

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
UPDATE m4_dnr_detail SET jmlrealisasi = (CASE iddnrdetail {updNilaiDNR} ELSE jmlrealisasi END) WHERE {updFilterDNR}
```

## Query 65

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
UPDATE m4_ri SET ristatusrealisasi = (CASE riid {updNilaiRI} ELSE ristatusrealisasi END) WHERE {updFilterRI}
```

## Query 66

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
UPDATE m4_ri ri LEFT JOIN m2_transaction_journal t ON ri.risumber = t.tsumber AND ri.riid = t.tidtransaksi AND ri.rinotransaksi = t.tnotransaksi SET ri.rijmlbayar = ri.rijmlbayar + {Double.Parse(drutama("prttotaltransaksi"))}, ri.ritgllunas = (CASE WHEN ri.rijmlbayar + {Double.Parse(drutama("prttotaltransaksi"))} >= ri.ritotaltransaksi THEN '{prttgl}' ELSE ri.ritgllunas END) WHERE ri.riid = '{IdRI}'
```

## Query 67

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
UPDATE m4_ri ri LEFT JOIN m2_transaction_journal t ON ri.risumber = t.tsumber AND ri.riid = t.tidtransaksi AND ri.rinotransaksi = t.tnotransaksi SET ri.rijmlbayar = ri.rijmlbayar - {prttotaltransaksi}, ri.ritgllunas = '{"1900-01-01"}' WHERE ri.riid = '{IdRI}'
```

## Query 68

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
UPDATE m4_ri ri LEFT JOIN m2_transaction_journal t ON ri.risumber = t.tsumber AND ri.riid = t.tidtransaksi AND ri.rinotransaksi = t.tnotransaksi SET t.tstatuslunas = ri.ristatuslunas, t.ttgllunas = ri.ritgllunas WHERE ri.riid = '{IdRI}'
```

## Query 69

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
UPDATE m4_ri_detail SET jmlrealisasi = (CASE idridetail {updNilaiRI} ELSE jmlrealisasi END) WHERE {updFilterRI}
```

## Query 70

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
Update M4_Prt set prtcabang = '{prtcabang}', prtlokasi = '{prtlokasi}', prtgudang = '{prtgudang}', prtasalbarang = '{prtasalbarang}', prtasalbarangkategori = {prtasalbarangkategori}, prtjenispembelian = '{prtjenispembelian}', prtjenispembeliankategori = {prtjenispembeliankategori}, prtcarabayar = {prtcarabayar}, prtsumber = '{prtsumber}', prtautonotransaksi = {prtautonotransaksi}, prtnotransaksi = '{notransaksi}', prttgl = '{prttgl}', prtkodepa = {prtkodepa}, prtsupplier = {prtsupplier}, prtsupplierkontak = '{prtsupplierkontak}', prt1alamat1 = '{prt1alamat1}', prt1alamat2 = '{prt1alamat2}', prt1alamat3 = '{prt1alamat3}', prt2alamat1 = '{prt2alamat1}', prt2alamat2 = '{prt2alamat2}', prt2alamat3 = '{prt2alamat3}', prtbagianpembelian = {prtbagianpembelian}, prttermin = '{prttermin}', prttgljatuhtempo = '{prttgljatuhtempo}', prturaian = '{prturaian}', prtcatatan = '{prtcatatan}', prtnoref = '{prtnoref}', prttglnoref = '{prttglnoref}', prttglpenutupan = '{prttglpenutupan}', prtmatauang = '{prtmatauang}', prtkurs = '{prtkurs}', prthargatermasukpajak = {prthargatermasukpajak}, prttotal = '{prttotal}', prtdiskonpersen = '{prtdiskonpersen}', prtjmldiskon = '{prtjmldiskon}', prttotalpajak1detail = '{prttotalpajak1detail}', prttotalpajak2detail = '{prttotalpajak2detail}', prtbiayalainpersen = '{prtbiayalainpersen}', prtbiayalain = '{prtbiayalain}', prttotaltransaksi = '{prttotaltransaksi}', prtsisatransaksi = '{prtsisatransaksi}', prtjmlbayar = '{prtjmlbayar}', prtstatuslunas = {prtstatuslunas}, prttgllunas = '{prttgllunas}', prtnofakturpajak = '{prtnofakturpajak}', prtsdhbayarpajak = {prtsdhbayarpajak}, prttglbayarpajak = '{prttglbayarpajak}', prtrekdiskon = '{prtrekdiskon}', prtrekpajak1 = '{prtrekpajak1}', prtrekpajak2 = '{prtrekpajak2}', prtrekbiayalain = '{prtrekbiayalain}', prtrekbayar = '{prtrekbayar}', prtreksisa = '{prtreksisa}', prtidpr = {prtidpr}, prtidcs = {prtidcs}, prtidrq = {prtidrq}, prtidbs = {prtidbs}, prtidpo = {prtidpo}, prtidipc = {prtidipc}, prtidgrn = {prtidgrn}, prtidri = {prtidri}, prtiddnr = {prtiddnr}, prtstatus = {prtstatus}, prtstatussebelumnya = {prtstatussebelumnya}, prtjmlrevisi = prtjmlrevisi+1, prtcetakanke = {prtcetakanke}, prtmodifikasiuser = {prtmodifikasiuser}, prtmodifikasitgl = NOW(), prtposting = 0, prttutupperiode = {prttutupperiode}, prtcustomtext1 = '{prtcustomtext1}', prtcustomtext2 = '{prtcustomtext2}', prtcustomtext3 = '{prtcustomtext3}', prtcustomtext4 = '{prtcustomtext4}', prtcustomtext5 = '{prtcustomtext5}', prtcustomint1 = {prtcustomint1}, prtcustomint2 = {prtcustomint2}, prtcustomint3 = {prtcustomint3}, prtcustomdbl1 = '{prtcustomdbl1}', prtcustomdbl2 = '{prtcustomdbl2}', prtcustomdbl3 = '{prtcustomdbl3}', prtcustomdate1 = '{prtcustomdate1}', prtcustomdate2 = '{prtcustomdate2}', prtcustomdate3 = '{prtcustomdate3}', prtjenis = '{prtjenis}' where prtid = '{prtid}'
```

## Query 71

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
Update M4_Prt set prtcabang = '{prtcabang}', prtlokasi = '{prtlokasi}', prtgudang = '{prtgudang}', prtasalbarang = '{prtasalbarang}', prtasalbarangkategori = {prtasalbarangkategori}, prtjenispembelian = '{prtjenispembelian}', prtjenispembeliankategori = {prtjenispembeliankategori}, prtcarabayar = {prtcarabayar}, prtsumber = '{prtsumber}', prtautonotransaksi = {prtautonotransaksi}, prtnotransaksi = '{notransaksi}', prttgl = '{prttgl}', prtkodepa = {prtkodepa}, prtsupplier = {prtsupplier}, prtsupplierkontak = '{prtsupplierkontak}', prt1alamat1 = '{prt1alamat1}', prt1alamat2 = '{prt1alamat2}', prt1alamat3 = '{prt1alamat3}', prt2alamat1 = '{prt2alamat1}', prt2alamat2 = '{prt2alamat2}', prt2alamat3 = '{prt2alamat3}', prtbagianpembelian = {prtbagianpembelian}, prttermin = '{prttermin}', prttgljatuhtempo = '{prttgljatuhtempo}', prturaian = '{prturaian}', prtcatatan = '{prtcatatan}', prtnoref = '{prtnoref}', prttglnoref = '{prttglnoref}', prttglpenutupan = '{prttglpenutupan}', prtmatauang = '{prtmatauang}', prtkurs = '{prtkurs}', prthargatermasukpajak = {prthargatermasukpajak}, prttotal = '{prttotal}', prtdiskonpersen = '{prtdiskonpersen}', prtjmldiskon = '{prtjmldiskon}', prttotalpajak1detail = '{prttotalpajak1detail}', prttotalpajak2detail = '{prttotalpajak2detail}', prtbiayalainpersen = '{prtbiayalainpersen}', prtbiayalain = '{prtbiayalain}', prttotaltransaksi = '{prttotaltransaksi}', prtsisatransaksi = '{prtsisatransaksi}', prtjmlbayar = '{prtjmlbayar}', prtstatuslunas = {prtstatuslunas}, prttgllunas = '{prttgllunas}', prtnofakturpajak = '{prtnofakturpajak}', prtsdhbayarpajak = {prtsdhbayarpajak}, prttglbayarpajak = '{prttglbayarpajak}', prtrekdiskon = '{prtrekdiskon}', prtrekpajak1 = '{prtrekpajak1}', prtrekpajak2 = '{prtrekpajak2}', prtrekbiayalain = '{prtrekbiayalain}', prtrekbayar = '{prtrekbayar}', prtreksisa = '{prtreksisa}', prtidpr = {prtidpr}, prtidcs = {prtidcs}, prtidrq = {prtidrq}, prtidbs = {prtidbs}, prtidpo = {prtidpo}, prtidipc = {prtidipc}, prtidgrn = {prtidgrn}, prtidri = {prtidri}, prtiddnr = {prtiddnr}, prtstatus = {prtstatus}, prtstatussebelumnya = {prtstatussebelumnya}, prtjmlrevisi = prtjmlrevisi+1, prtcetakanke = {prtcetakanke}, prtmodifikasiuser = {prtmodifikasiuser}, prtmodifikasitgl = NOW(), prtposting = 0, prttutupperiode = {prttutupperiode}, prtcustomtext1 = '{prtcustomtext1}', prtcustomtext2 = '{prtcustomtext2}', prtcustomtext3 = '{prtcustomtext3}', prtcustomtext4 = '{prtcustomtext4}', prtcustomtext5 = '{prtcustomtext5}', prtcustomint1 = {prtcustomint1}, prtcustomint2 = {prtcustomint2}, prtcustomint3 = {prtcustomint3}, prtcustomdbl1 = '{prtcustomdbl1}', prtcustomdbl2 = '{prtcustomdbl2}', prtcustomdbl3 = '{prtcustomdbl3}', prtcustomdate1 = '{prtcustomdate1}', prtcustomdate2 = '{prtcustomdate2}', prtcustomdate3 = '{prtcustomdate3}', prtsaldoawal = 1 where prtid = {prtid}
```

## Query 72

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`, `client-backend/api-myerpplus/app_code/ws/m4/m4_prt_history.vb`

```sql
select `nbt`.`nbtid` AS `nbtid`,`nbt`.`nbtjenismutasi` AS `nbtjenismutasi`,`nbt`.`nbtidbatchin` AS `nbtidbatchin`,`nbt`.`nbtgudang` AS `nbtgudang`,`nbt`.`nbtidbarang` AS `nbtidbarang`,`nbt`.`nbtkode` AS `nbtkode`,`nbt`.`nbtsumber` AS `nbtsumber`,`nbt`.`nbtidtransaksi` AS `nbtidtransaksi`,`nbt`.`nbtsatuan` AS `nbtsatuan`,`nbt`.`nbtjml` AS `nbtjml`,`nbt`.`nbtcustomtext1` AS `nbtcustomtext1`,`nbt`.`nbtcustomtext2` AS `nbtcustomtext2`,`nbt`.`nbtcustomtext3` AS `nbtcustomtext3`,`nbt`.`nbtcustomdbl1` AS `nbtcustomdbl1`,`nbt`.`nbtcustomdbl2` AS `nbtcustomdbl2`,`nbt`.`nbtcustomdbl3` AS `nbtcustomdbl3`,`nbt`.`nbtcustomdate1` AS `nbtcustomdate1`,`nbt`.`nbtcustomdate2` AS `nbtcustomdate2`,`nbt`.`nbtcustomdate3` AS `nbtcustomdate3`,`i`.`bkode` AS `kodebarang`, nbi.nbinotransaksi from ((`m1_no_batch_transaction` `nbt` join `m1_item` `i` on((`nbt`.`nbtidbarang` = `i`.`bid`))) left join `m1_no_batch_in` `nbi` on((`nbt`.`nbtidbatchin` = `nbi`.`nbiidbatchin`)))
```

## Query 73

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt_history.vb`

```sql
select `nbt`.`nbtidhistory` AS `nbtidhistory`, `nbt`.`nbtidtransaksihistory` AS `nbtidtransaksihistory`,`nbt`.`nbtid` AS `nbtid`,`nbt`.`nbtjenismutasi` AS `nbtjenismutasi`,`nbt`.`nbtidbatchin` AS `nbtidbatchin`,`nbt`.`nbtgudang` AS `nbtgudang`,`nbt`.`nbtidbarang` AS `nbtidbarang`,`nbt`.`nbtkode` AS `nbtkode`,`nbt`.`nbtsumber` AS `nbtsumber`,`nbt`.`nbtidtransaksi` AS `nbtidtransaksi`,`nbt`.`nbtsatuan` AS `nbtsatuan`,`nbt`.`nbtjml` AS `nbtjml`,`nbt`.`nbtcustomtext1` AS `nbtcustomtext1`,`nbt`.`nbtcustomtext2` AS `nbtcustomtext2`,`nbt`.`nbtcustomtext3` AS `nbtcustomtext3`,`nbt`.`nbtcustomdbl1` AS `nbtcustomdbl1`,`nbt`.`nbtcustomdbl2` AS `nbtcustomdbl2`,`nbt`.`nbtcustomdbl3` AS `nbtcustomdbl3`,`nbt`.`nbtcustomdate1` AS `nbtcustomdate1`,`nbt`.`nbtcustomdate2` AS `nbtcustomdate2`,`nbt`.`nbtcustomdate3` AS `nbtcustomdate3`,`i`.`bkode` AS `kodebarang` from ((`m1_no_batch_transaction_history` `nbt` join `m1_item` `i` on((`nbt`.`nbtidbarang` = `i`.`bid`))) left join `m1_no_batch_in` `nbi` on((`nbt`.`nbtidbatchin` = `nbi`.`nbiidbatchin`)))
```

## Query 74

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`, `client-backend/api-myerpplus/app_code/ws/m4/m4_prt_history.vb`

```sql
select `nst`.`nstid` AS `nstid`,`nst`.`nstjenismutasi` AS `nstjenismutasi`,`nst`.`nstidserialin` AS `nstidserialin`,`nst`.`nstgudang` AS `nstgudang`,`nst`.`nstidbarang` AS `nstidbarang`,`nst`.`nstkode` AS `nstkode`,`nst`.`nstsumber` AS `nstsumber`,`nst`.`nstidtransaksi` AS `nstidtransaksi`,`nst`.`nstsatuan` AS `nstsatuan`,`nst`.`nstjml` AS `nstjml`,`nst`.`nstcustomtext1` AS `nstcustomtext1`,`nst`.`nstcustomtext2` AS `nstcustomtext2`,`nst`.`nstcustomtext3` AS `nstcustomtext3`,`nst`.`nstcustomdbl1` AS `nstcustomdbl1`,`nst`.`nstcustomdbl2` AS `nstcustomdbl2`,`nst`.`nstcustomdbl3` AS `nstcustomdbl3`,`nst`.`nstcustomdate1` AS `nstcustomdate1`,`nst`.`nstcustomdate2` AS `nstcustomdate2`,`nst`.`nstcustomdate3` AS `nstcustomdate3`,`i`.`bkode` AS `kodebarang`, nsi.nsinotransaksi from ((`m1_no_serial_transaction` `nst` join `m1_item` `i` on((`nst`.`nstidbarang` = `i`.`bid`))) left join `m1_no_serial_in` `nsi` on((`nst`.`nstidserialin` = `nsi`.`nsiidserialin`)))
```

## Query 75

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt_history.vb`

```sql
select `nst`.`nstidhistory` AS `nstidhistory`,`nst`.`nstidtransaksihistory` AS `nstidtransaksihistory`,`nst`.`nstid` AS `nstid`,`nst`.`nstjenismutasi` AS `nstjenismutasi`,`nst`.`nstidserialin` AS `nstidserialin`,`nst`.`nstgudang` AS `nstgudang`,`nst`.`nstidbarang` AS `nstidbarang`,`nst`.`nstkode` AS `nstkode`,`nst`.`nstsumber` AS `nstsumber`,`nst`.`nstidtransaksi` AS `nstidtransaksi`,`nst`.`nstsatuan` AS `nstsatuan`,`nst`.`nstjml` AS `nstjml`,`nst`.`nstcustomtext1` AS `nstcustomtext1`,`nst`.`nstcustomtext2` AS `nstcustomtext2`,`nst`.`nstcustomtext3` AS `nstcustomtext3`,`nst`.`nstcustomdbl1` AS `nstcustomdbl1`,`nst`.`nstcustomdbl2` AS `nstcustomdbl2`,`nst`.`nstcustomdbl3` AS `nstcustomdbl3`,`nst`.`nstcustomdate1` AS `nstcustomdate1`,`nst`.`nstcustomdate2` AS `nstcustomdate2`,`nst`.`nstcustomdate3` AS `nstcustomdate3`,`i`.`bkode` AS `kodebarang` from ((`m1_no_serial_transaction_history` `nst` join `m1_item` `i` on((`nst`.`nstidbarang` = `i`.`bid`))) left join `m1_no_serial_in` `nsi` on((`nst`.`nstidserialin` = `nsi`.`nsiidserialin`)))
```

## Query 76

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
select `prt`.`prtid` AS `prtid`,`prt`.`prtcabang` AS `prtcabang`,`prt`.`prtlokasi` AS `prtlokasi`,`prt`.`prtgudang` AS `prtgudang`,`prt`.`prtasalbarang` AS `prtasalbarang`,`prt`.`prtasalbarangkategori` AS `prtasalbarangkategori`,`prt`.`prtjenispembelian` AS `prtjenispembelian`,`prt`.`prtjenispembeliankategori` AS `prtjenispembeliankategori`,`prt`.`prtcarabayar` AS `prtcarabayar`,`prt`.`prtsumber` AS `prtsumber`,`prt`.`prtautonotransaksi` AS `prtautonotransaksi`,`prt`.`prtnotransaksi` AS `prtnotransaksi`,`prt`.`prttgl` AS `prttgl`,`prt`.`prtkodepa` AS `prtkodepa`,`prt`.`prtsupplier` AS `prtsupplier`,`prt`.`prtsupplierkontak` AS `prtsupplierkontak`,`prt`.`prt1alamat1` AS `prt1alamat1`,`prt`.`prt1alamat2` AS `prt1alamat2`,`prt`.`prt1alamat3` AS `prt1alamat3`,`prt`.`prt2alamat1` AS `prt2alamat1`,`prt`.`prt2alamat2` AS `prt2alamat2`,`prt`.`prt2alamat3` AS `prt2alamat3`,`prt`.`prtbagianpembelian` AS `prtbagianpembelian`,`prt`.`prttermin` AS `prttermin`,`prt`.`prttgljatuhtempo` AS `prttgljatuhtempo`,`prt`.`prturaian` AS `prturaian`,`prt`.`prtcatatan` AS `prtcatatan`,`prt`.`prtnoref` AS `prtnoref`,`prt`.`prttglnoref` AS `prttglnoref`,`prt`.`prttglpenutupan` AS `prttglpenutupan`,`prt`.`prtmatauang` AS `prtmatauang`,`prt`.`prtkurs` AS `prtkurs`,`prt`.`prthargatermasukpajak` AS `prthargatermasukpajak`,`prt`.`prttotal` AS `prttotal`,`prt`.`prtdiskonpersen` AS `prtdiskonpersen`,`prt`.`prtjmldiskon` AS `prtjmldiskon`,`prt`.`prttotalpajak1detail` AS `prttotalpajak1detail`,`prt`.`prttotalpajak2detail` AS `prttotalpajak2detail`,`prt`.`prtbiayalainpersen` AS `prtbiayalainpersen`,`prt`.`prtbiayalain` AS `prtbiayalain`,`prt`.`prttotaltransaksi` AS `prttotaltransaksi`,`prt`.`prtsisatransaksi` AS `prtsisatransaksi`,`prt`.`prtjmlbayar` AS `prtjmlbayar`,`prt`.`prtstatuslunas` AS `prtstatuslunas`,`prt`.`prttgllunas` AS `prttgllunas`,`prt`.`prtnofakturpajak` AS `prtnofakturpajak`,`prt`.`prtsdhbayarpajak` AS `prtsdhbayarpajak`,`prt`.`prttglbayarpajak` AS `prttglbayarpajak`,`prt`.`prtrekdiskon` AS `prtrekdiskon`,`prt`.`prtrekpajak1` AS `prtrekpajak1`,`prt`.`prtrekpajak2` AS `prtrekpajak2`,`prt`.`prtrekbiayalain` AS `prtrekbiayalain`,`prt`.`prtrekbayar` AS `prtrekbayar`,`prt`.`prtreksisa` AS `prtreksisa`,`prt`.`prtidpr` AS `prtidpr`,`prt`.`prtidcs` AS `prtidcs`,`prt`.`prtidrq` AS `prtidrq`,`prt`.`prtidbs` AS `prtidbs`,`prt`.`prtidpo` AS `prtidpo`,`prt`.`prtidipc` AS `prtidipc`,`prt`.`prtidgrn` AS `prtidgrn`,`prt`.`prtidri` AS `prtidri`,`prt`.`prtiddnr` AS `prtiddnr`,`prt`.`prtstatus` AS `prtstatus`,`prt`.`prtstatussebelumnya` AS `prtstatussebelumnya`,`prt`.`prtjmlrevisi` AS `prtjmlrevisi`,`prt`.`prtcetakanke` AS `prtcetakanke`,`prt`.`prtinputuser` AS `prtinputuser`,`prt`.`prtinputtgl` AS `prtinputtgl`,`prt`.`prtmodifikasiuser` AS `prtmodifikasiuser`,`prt`.`prtmodifikasitgl` AS `prtmodifikasitgl`,`prt`.`prtposting` AS `prtposting`,`prt`.`prtpostingtgl` AS `prtpostingtgl`,`prt`.`prttutupperiode` AS `prttutupperiode`,`prt`.`prtisclose` AS `prtisclose`,`br`.`bnama` AS `prtcabangnama`,`lc`.`lnama` AS `prtlokasinama`,`wh`.`wnama` AS `prtgudangnama`,`c1`.`kkode` AS `prtsupplierkode`,`c1`.`knama` AS `prtsuppliernama`,`c2`.`kkode` AS `prtbagianpembeliankode`,`c2`.`knama` AS `prtbagianpembeliannama`,`ri`.`rinotransaksi` AS `rinotransaksi`,`dnr`.`dnrnotransaksi` AS `dnrnotransaksi`,`st1`.`nama` AS `prtstatusnama`,`st2`.`nama` AS `prtstatussebelumnyanama`,`u1`.`unama` AS `prtinputusernama`,`u2`.`unama` AS `prtmodifikasiusernama`, `prt`.`prtcustomtext1` AS `prtcustomtext1`, `prt`.`prtcustomtext2` AS `prtcustomtext2`, `prt`.`prtcustomtext3` AS `prtcustomtext3`, `prt`.`prtcustomtext4` AS `prtcustomtext4`, `prt`.`prtcustomtext5` AS `prtcustomtext5`, `prt`.`prtcustomint1` AS `prtcustomint1`, `prt`.`prtcustomint2` AS `prtcustomint2`, `prt`.`prtcustomint3` AS `prtcustomint3`, `prt`.`prtcustomdbl1` AS `prtcustomdbl1`, `prt`.`prtcustomdbl2` AS `prtcustomdbl2`, `prt`.`prtcustomdbl3` AS `prtcustomdbl3`, `prt`.`prtcustomdate1` AS `prtcustomdate1`, `prt`.`prtcustomdate2` AS `prtcustomdate2`, `prt`.`prtcustomdate3` AS `prtcustomdate3`, cdis.cnama AS prtrekdiskonnama, cpa.cnama AS prtrekpajak1nama, cpa2.cnama AS prtrekpajak2nama, cba.cnama AS prtrekbiayalainnama from (((((((((((`m4_prt` `prt` left join `m1_branch` `br` on((`br`.`bkode` = `prt`.`prtcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `prt`.`prtlokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `prt`.`prtgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `prt`.`prtsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `prt`.`prtbagianpembelian`))) left join `m4_ri` `ri` on((`prt`.`prtidri` = `ri`.`riid`))) left join `m4_dnr` `dnr` on((`prt`.`prtid` = `dnr`.`dnrid`))) left join `m0_status` `st1` on((`st1`.`kode` = `prt`.`prtstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `prt`.`prtstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `prt`.`prtinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `prt`.`prtmodifikasiuser`))) LEFT JOIN m1_coa cdis ON cdis.cnomor = prt.prtrekdiskon LEFT JOIN m1_coa cpa ON cpa.cnomor = prt.prtrekpajak1 LEFT JOIN m1_coa cpa2 ON cpa2.cnomor = prt.prtrekpajak2 LEFT JOIN m1_coa cba ON cba.cnomor = prt.prtrekbiayalain
```

## Query 77

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_prt_v`

```sql
select `prt`.`prtid` AS `prtid`,`prt`.`prtcabang` AS `prtcabang`,`prt`.`prtlokasi` AS `prtlokasi`,`prt`.`prtgudang` AS `prtgudang`,`prt`.`prtasalbarang` AS `prtasalbarang`,`prt`.`prtasalbarangkategori` AS `prtasalbarangkategori`,`prt`.`prtjenispembelian` AS `prtjenispembelian`,`prt`.`prtjenispembeliankategori` AS `prtjenispembeliankategori`,`prt`.`prtcarabayar` AS `prtcarabayar`,`prt`.`prtsumber` AS `prtsumber`,`prt`.`prtautonotransaksi` AS `prtautonotransaksi`,`prt`.`prtnotransaksi` AS `prtnotransaksi`,`prt`.`prttgl` AS `prttgl`,`prt`.`prtkodepa` AS `prtkodepa`,`prt`.`prtsupplier` AS `prtsupplier`,`prt`.`prtsupplierkontak` AS `prtsupplierkontak`,`prt`.`prt1alamat1` AS `prt1alamat1`,`prt`.`prt1alamat2` AS `prt1alamat2`,`prt`.`prt1alamat3` AS `prt1alamat3`,`prt`.`prt2alamat1` AS `prt2alamat1`,`prt`.`prt2alamat2` AS `prt2alamat2`,`prt`.`prt2alamat3` AS `prt2alamat3`,`prt`.`prtbagianpembelian` AS `prtbagianpembelian`,`prt`.`prttermin` AS `prttermin`,`prt`.`prttgljatuhtempo` AS `prttgljatuhtempo`,`prt`.`prturaian` AS `prturaian`,`prt`.`prtcatatan` AS `prtcatatan`,`prt`.`prtnoref` AS `prtnoref`,`prt`.`prttglnoref` AS `prttglnoref`,`prt`.`prttglpenutupan` AS `prttglpenutupan`,`prt`.`prtmatauang` AS `prtmatauang`,`prt`.`prtkurs` AS `prtkurs`,`prt`.`prthargatermasukpajak` AS `prthargatermasukpajak`,`prt`.`prttotal` AS `prttotal`,`prt`.`prtdiskonpersen` AS `prtdiskonpersen`,`prt`.`prtjmldiskon` AS `prtjmldiskon`,`prt`.`prttotalpajak1detail` AS `prttotalpajak1detail`,`prt`.`prttotalpajak2detail` AS `prttotalpajak2detail`,`prt`.`prtbiayalainpersen` AS `prtbiayalainpersen`,`prt`.`prtbiayalain` AS `prtbiayalain`,`prt`.`prttotaltransaksi` AS `prttotaltransaksi`,`prt`.`prtsisatransaksi` AS `prtsisatransaksi`,`prt`.`prtjmlbayar` AS `prtjmlbayar`,`prt`.`prtstatuslunas` AS `prtstatuslunas`,`prt`.`prttgllunas` AS `prttgllunas`,`prt`.`prtnofakturpajak` AS `prtnofakturpajak`,`prt`.`prtsdhbayarpajak` AS `prtsdhbayarpajak`,`prt`.`prttglbayarpajak` AS `prttglbayarpajak`,`prt`.`prtrekdiskon` AS `prtrekdiskon`,`prt`.`prtrekpajak1` AS `prtrekpajak1`,`prt`.`prtrekpajak2` AS `prtrekpajak2`,`prt`.`prtrekbiayalain` AS `prtrekbiayalain`,`prt`.`prtrekbayar` AS `prtrekbayar`,`prt`.`prtreksisa` AS `prtreksisa`,`prt`.`prtidpr` AS `prtidpr`,`prt`.`prtidcs` AS `prtidcs`,`prt`.`prtidrq` AS `prtidrq`,`prt`.`prtidbs` AS `prtidbs`,`prt`.`prtidpo` AS `prtidpo`,`prt`.`prtidipc` AS `prtidipc`,`prt`.`prtidgrn` AS `prtidgrn`,`prt`.`prtidri` AS `prtidri`,`prt`.`prtiddnr` AS `prtiddnr`,`prt`.`prtstatus` AS `prtstatus`,`prt`.`prtstatussebelumnya` AS `prtstatussebelumnya`,`prt`.`prtjmlrevisi` AS `prtjmlrevisi`,`prt`.`prtcetakanke` AS `prtcetakanke`,`prt`.`prtinputuser` AS `prtinputuser`,`prt`.`prtinputtgl` AS `prtinputtgl`,`prt`.`prtmodifikasiuser` AS `prtmodifikasiuser`,`prt`.`prtmodifikasitgl` AS `prtmodifikasitgl`,`prt`.`prtposting` AS `prtposting`,`prt`.`prtpostingtgl` AS `prtpostingtgl`,`prt`.`prttutupperiode` AS `prttutupperiode`,`prt`.`prtisclose` AS `prtisclose`,`br`.`bnama` AS `prtcabangnama`,`lc`.`lnama` AS `prtlokasinama`,`wh`.`wnama` AS `prtgudangnama`,`c1`.`kkode` AS `prtsupplierkode`,`c1`.`knama` AS `prtsuppliernama`,`c2`.`kkode` AS `prtbagianpembeliankode`,`c2`.`knama` AS `prtbagianpembeliannama`,`ri`.`rinotransaksi` AS `rinotransaksi`,`dnr`.`dnrnotransaksi` AS `dnrnotransaksi`,`st1`.`nama` AS `prtstatusnama`,`st2`.`nama` AS `prtstatussebelumnyanama`,`u1`.`unama` AS `prtinputusernama`,`u2`.`unama` AS `prtmodifikasiusernama`, prt.prtjenis, (CASE prt.prtjenis WHEN 0 THEN 'Undirect' ELSE 'Direct' END) as prtjenisnama from (((((((((((`m4_prt` `prt` left join `m1_branch` `br` on((`br`.`bkode` = `prt`.`prtcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `prt`.`prtlokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `prt`.`prtgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `prt`.`prtsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `prt`.`prtbagianpembelian`))) left join `m4_ri` `ri` on((`prt`.`prtidri` = `ri`.`riid`))) left join `m4_dnr` `dnr` on((`prt`.`prtid` = `dnr`.`dnrid`))) left join `m0_status` `st1` on((`st1`.`kode` = `prt`.`prtstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `prt`.`prtstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `prt`.`prtinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `prt`.`prtmodifikasiuser`)))
```

## Query 78

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt_history.vb`

```sql
select `prt`.`prtid` AS `prtid`,`prt`.`prtcabang` AS `prtcabang`,`prt`.`prtlokasi` AS `prtlokasi`,`prt`.`prtgudang` AS `prtgudang`,`prt`.`prtasalbarang` AS `prtasalbarang`,`prt`.`prtasalbarangkategori` AS `prtasalbarangkategori`,`prt`.`prtjenispembelian` AS `prtjenispembelian`,`prt`.`prtjenispembeliankategori` AS `prtjenispembeliankategori`,`prt`.`prtcarabayar` AS `prtcarabayar`,`prt`.`prtsumber` AS `prtsumber`,`prt`.`prtautonotransaksi` AS `prtautonotransaksi`,`prt`.`prtnotransaksi` AS `prtnotransaksi`,`prt`.`prttgl` AS `prttgl`,`prt`.`prtkodepa` AS `prtkodepa`,`prt`.`prtsupplier` AS `prtsupplier`,`prt`.`prtsupplierkontak` AS `prtsupplierkontak`,`prt`.`prt1alamat1` AS `prt1alamat1`,`prt`.`prt1alamat2` AS `prt1alamat2`,`prt`.`prt1alamat3` AS `prt1alamat3`,`prt`.`prt2alamat1` AS `prt2alamat1`,`prt`.`prt2alamat2` AS `prt2alamat2`,`prt`.`prt2alamat3` AS `prt2alamat3`,`prt`.`prtbagianpembelian` AS `prtbagianpembelian`,`prt`.`prttermin` AS `prttermin`,`prt`.`prttgljatuhtempo` AS `prttgljatuhtempo`,`prt`.`prturaian` AS `prturaian`,`prt`.`prtcatatan` AS `prtcatatan`,`prt`.`prtnoref` AS `prtnoref`,`prt`.`prttglnoref` AS `prttglnoref`,`prt`.`prttglpenutupan` AS `prttglpenutupan`,`prt`.`prtmatauang` AS `prtmatauang`,`prt`.`prtkurs` AS `prtkurs`,`prt`.`prthargatermasukpajak` AS `prthargatermasukpajak`,`prt`.`prttotal` AS `prttotal`,`prt`.`prtdiskonpersen` AS `prtdiskonpersen`,`prt`.`prtjmldiskon` AS `prtjmldiskon`,`prt`.`prttotalpajak1detail` AS `prttotalpajak1detail`,`prt`.`prttotalpajak2detail` AS `prttotalpajak2detail`,`prt`.`prtbiayalainpersen` AS `prtbiayalainpersen`,`prt`.`prtbiayalain` AS `prtbiayalain`,`prt`.`prttotaltransaksi` AS `prttotaltransaksi`,`prt`.`prtsisatransaksi` AS `prtsisatransaksi`,`prt`.`prtjmlbayar` AS `prtjmlbayar`,`prt`.`prtstatuslunas` AS `prtstatuslunas`,`prt`.`prttgllunas` AS `prttgllunas`,`prt`.`prtnofakturpajak` AS `prtnofakturpajak`,`prt`.`prtsdhbayarpajak` AS `prtsdhbayarpajak`,`prt`.`prttglbayarpajak` AS `prttglbayarpajak`,`prt`.`prtrekdiskon` AS `prtrekdiskon`,`prt`.`prtrekpajak1` AS `prtrekpajak1`,`prt`.`prtrekpajak2` AS `prtrekpajak2`,`prt`.`prtrekbiayalain` AS `prtrekbiayalain`,`prt`.`prtrekbayar` AS `prtrekbayar`,`prt`.`prtreksisa` AS `prtreksisa`,`prt`.`prtidpr` AS `prtidpr`,`prt`.`prtidcs` AS `prtidcs`,`prt`.`prtidrq` AS `prtidrq`,`prt`.`prtidbs` AS `prtidbs`,`prt`.`prtidpo` AS `prtidpo`,`prt`.`prtidipc` AS `prtidipc`,`prt`.`prtidgrn` AS `prtidgrn`,`prt`.`prtidri` AS `prtidri`,`prt`.`prtiddnr` AS `prtiddnr`,`prt`.`prtstatus` AS `prtstatus`,`prt`.`prtstatussebelumnya` AS `prtstatussebelumnya`,`prt`.`prtjmlrevisi` AS `prtjmlrevisi`,`prt`.`prtcetakanke` AS `prtcetakanke`,`prt`.`prtinputuser` AS `prtinputuser`,`prt`.`prtinputtgl` AS `prtinputtgl`,`prt`.`prtmodifikasiuser` AS `prtmodifikasiuser`,`prt`.`prtmodifikasitgl` AS `prtmodifikasitgl`,`prt`.`prtposting` AS `prtposting`,`prt`.`prtpostingtgl` AS `prtpostingtgl`,`prt`.`prttutupperiode` AS `prttutupperiode`,`prt`.`prtisclose` AS `prtisclose`,`prt`.`prtcustomtext1` AS `prtcustomtext1`,`prt`.`prtcustomtext2` AS `prtcustomtext2`,`prt`.`prtcustomtext3` AS `prtcustomtext3`,`prt`.`prtcustomtext4` AS `prtcustomtext4`,`prt`.`prtcustomtext5` AS `prtcustomtext5`,`prt`.`prtcustomint1` AS `prtcustomint1`,`prt`.`prtcustomint2` AS `prtcustomint2`,`prt`.`prtcustomint3` AS `prtcustomint3`,`prt`.`prtcustomdbl1` AS `prtcustomdbl1`,`prt`.`prtcustomdbl2` AS `prtcustomdbl2`,`prt`.`prtcustomdbl3` AS `prtcustomdbl3`,`prt`.`prtcustomdate1` AS `prtcustomdate1`,`prt`.`prtcustomdate2` AS `prtcustomdate2`,`prt`.`prtcustomdate3` AS `prtcustomdate3`,`br`.`bnama` AS `prtcabangnama`,`lc`.`lnama` AS `prtlokasinama`,`wh`.`wnama` AS `prtgudangnama`,`c1`.`kkode` AS `prtsupplierkode`,`c1`.`knama` AS `prtsuppliernama`,`c2`.`kkode` AS `prtbagianpembeliankode`,`c2`.`knama` AS `prtbagianpembeliannama`,`tr`.`trnama` AS `prtterminnama`,`tr`.`trharijatuhtempo` AS `prtterminharijatuhtempo`,`coa1`.`cnama` AS `prtrekdiskonnama`,`coa2`.`cnama` AS `prtrekpajak1nama`,`coa3`.`cnama` AS `prtrekpajak2nama`,`coa4`.`cnama` AS `prtrekbiayalainnama`,`coa5`.`cnama` AS `prtrekbayarnama`,`coa6`.`cnama` AS `prtreksisanama`,`ri`.`rinotransaksi` AS `prtnotransaksiri`,`dnr`.`dnrnotransaksi` AS `prtnotransaksidnr`,`st1`.`nama` AS `prtstatusnama`,`st2`.`nama` AS `prtstatussebelumnyanama`,`u1`.`unama` AS `prtinputusernama`,`u2`.`unama` AS `prtmodifikasiusernama`, prt.prtjenis, `prtd`.`idprtdetail` AS `idprtdetail`,`prtd`.`idprt` AS `idprt`,`prtd`.`idbarang` AS `idbarang`,`prtd`.`namabarang` AS `namabarang`,`prtd`.`tipebarang` AS `tipebarang`,`prtd`.`jml` AS `jml`,`prtd`.`satuan` AS `satuan`,`prtd`.`nilaisatuan` AS `nilaisatuan`,`prtd`.`jmlbarang` AS `jmlbarang`,`prtd`.`satuanbarang` AS `satuanbarang`,`prtd`.`matauang` AS `matauang`,`prtd`.`kurs` AS `kurs`,`prtd`.`hargafix` AS `hargafix`,`prtd`.`idhppkhususmasuk` AS `idhppkhususmasuk`,`prtd`.`idhppfifomasuk` AS `idhppfifomasuk`,`prtd`.`hpp` AS `hpp`,`prtd`.`harga` AS `harga`,`prtd`.`diskon` AS `diskon`,`prtd`.`jmldiskon` AS `jmldiskon`,`prtd`.`pajak1` AS `pajak1`,`prtd`.`jmlpajak1` AS `jmlpajak1`,`prtd`.`pajak2` AS `pajak2`,`prtd`.`jmlpajak2` AS `jmlpajak2`,`prtd`.`cabang` AS `cabang`,`prtd`.`lokasi` AS `lokasi`,`prtd`.`gudangasal` AS `gudangasal`,`prtd`.`gudangtransit` AS `gudangtransit`,`prtd`.`gudangtujuan` AS `gudangtujuan`,`i`.`brekpersediaan` AS `rekpersediaan`,`i`.`brekdiskonpembelian` AS `rekdiskonpembelian`,`i`.`brekhargapokok` AS `rekhargapokok`,`i`.`brekreturpembelian` AS `rekreturpembelian`,`prtd`.`costcenter` AS `costcenter`,`prtd`.`divisi` AS `divisi`,`prtd`.`subdivisi` AS `subdivisi`,`prtd`.`proyek` AS `proyek`,`prtd`.`catatan` AS `catatan`,`prtd`.`urutan` AS `urutan`,`prtd`.`idprdetail` AS `idprdetail`,`prtd`.`idcsdetail` AS `idcsdetail`,`prtd`.`idrqdetail` AS `idrqdetail`,`prtd`.`idbsdetail` AS `idbsdetail`,`prtd`.`idpodetail` AS `idpodetail`,`prtd`.`idipcdetail` AS `idipcdetail`,`prtd`.`idgrndetail` AS `idgrndetail`,`prtd`.`idridetail` AS `idridetail`,`prtd`.`iddnrdetail` AS `iddnrdetail`,`prtd`.`isclose` AS `isclose`,`prtd`.`customtext1` AS `customtext1`,`prtd`.`customtext2` AS `customtext2`,`prtd`.`customtext3` AS `customtext3`,`prtd`.`customdbl1` AS `customdbl1`,`prtd`.`customdbl2` AS `customdbl2`,`prtd`.`customdbl3` AS `customdbl3`,`prtd`.`customdate1` AS `customdate1`,`prtd`.`customdate2` AS `customdate2`,`prtd`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bhpp` AS `bhpp`,`i`.`bjenis` AS `bjenis`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,`i`.`basset` AS `basset`,`t1`.`tnama` AS `pajak1nama`,`t1`.`tnilai` AS `pajak1nilai`,`t2`.`tnama` AS `pajak2nama`,`t2`.`tnilai` AS `pajak2nilai`,`brd`.`bnama` AS `cabangnama`,`lcd`.`lnama` AS `lokasinama`,`whd1`.`wnama` AS `gudangasalnama`,`whd2`.`wnama` AS `gudangtransitnama`,`whd3`.`wnama` AS `gudangtujuannama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama`,`ri2`.`rinotransaksi` AS `rinotransaksi`,`dnr2`.`dnrnotransaksi` AS `dnrnotransaksi`, c1.kpkp, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan from (((((((((((((((((((((((((((((((((((`m4_prt_history` `prt` left join `m4_prt_detail_history` `prtd` on((`prt`.`prtid` = `prtd`.`idprt`))) left join `m1_branch` `br` on((`br`.`bkode` = `prt`.`prtcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `prt`.`prtlokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `prt`.`prtgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `prt`.`prtsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `prt`.`prtbagianpembelian`))) left join `m1_terms` `tr` on((`prt`.`prttermin` = `tr`.`trkode`))) left join `m1_coa` `coa1` on((`prt`.`prtrekdiskon` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`prt`.`prtrekpajak1` = `coa2`.`cnomor`))) left join `m1_coa` `coa3` on((`prt`.`prtrekpajak2` = `coa3`.`cnomor`))) left join `m1_coa` `coa4` on((`prt`.`prtrekbiayalain` = `coa4`.`cnomor`))) left join `m1_coa` `coa5` on((`prt`.`prtrekbayar` = `coa5`.`cnomor`))) left join `m1_coa` `coa6` on((`prt`.`prtreksisa` = `coa6`.`cnomor`))) left join `m4_ri` `ri` on((`prt`.`prtidri` = `ri`.`riid`))) left join `m4_dnr` `dnr` on((`prt`.`prtiddnr` = `dnr`.`dnrid`))) left join `m0_status` `st1` on((`st1`.`kode` = `prt`.`prtstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `prt`.`prtstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `prt`.`prtinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `prt`.`prtmodifikasiuser`))) left join `m1_item` `i` on((`i`.`bid` = `prtd`.`idbarang`))) left join `m1_tax` `t1` on((`prtd`.`pajak1` = `t1`.`tkode`))) left join `m1_tax` `t2` on((`prtd`.`pajak2` = `t2`.`tkode`))) left join `m4_dnr_detail` `dnrd` on((`prtd`.`iddnrdetail` = `dnrd`.`iddnrdetail`))) left join `m4_dnr` `dnr2` on((`dnrd`.`iddnr` = `dnr2`.`dnrid`))) left join `m1_branch` `brd` on((`prtd`.`cabang` = `brd`.`bkode`))) left join `m1_location` `lcd` on((`prtd`.`lokasi` = `lcd`.`lkode`))) left join `m1_warehouse` `whd1` on((`prtd`.`gudangasal` = `whd1`.`wkode`))) left join `m1_warehouse` `whd2` on((`prtd`.`gudangtransit` = `whd2`.`wkode`))) left join `m1_warehouse` `whd3` on((`prtd`.`gudangtujuan` = `whd3`.`wkode`))) left join `m1_cost_center` `cc` on((`prtd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`prtd`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`prtd`.`subdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`prtd`.`proyek` = `p`.`pkode`))) left join `m4_ri_detail` `rid` on((`prtd`.`idridetail` = `rid`.`idridetail`))) left join `m4_ri` `ri2` on((`rid`.`idri` = `ri2`.`riid`)))
```

## Query 79

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`

```sql
select `prt`.`prtid` AS `prtid`,`prt`.`prtcabang` AS `prtcabang`,`prt`.`prtlokasi` AS `prtlokasi`,`prt`.`prtgudang` AS `prtgudang`,`prt`.`prtasalbarang` AS `prtasalbarang`,`prt`.`prtasalbarangkategori` AS `prtasalbarangkategori`,`prt`.`prtjenispembelian` AS `prtjenispembelian`,`prt`.`prtjenispembeliankategori` AS `prtjenispembeliankategori`,`prt`.`prtcarabayar` AS `prtcarabayar`,`prt`.`prtsumber` AS `prtsumber`,`prt`.`prtautonotransaksi` AS `prtautonotransaksi`,`prt`.`prtnotransaksi` AS `prtnotransaksi`,`prt`.`prttgl` AS `prttgl`,`prt`.`prtkodepa` AS `prtkodepa`,`prt`.`prtsupplier` AS `prtsupplier`,`prt`.`prtsupplierkontak` AS `prtsupplierkontak`,`prt`.`prt1alamat1` AS `prt1alamat1`,`prt`.`prt1alamat2` AS `prt1alamat2`,`prt`.`prt1alamat3` AS `prt1alamat3`,`prt`.`prt2alamat1` AS `prt2alamat1`,`prt`.`prt2alamat2` AS `prt2alamat2`,`prt`.`prt2alamat3` AS `prt2alamat3`,`prt`.`prtbagianpembelian` AS `prtbagianpembelian`,`prt`.`prttermin` AS `prttermin`,`prt`.`prttgljatuhtempo` AS `prttgljatuhtempo`,`prt`.`prturaian` AS `prturaian`,`prt`.`prtcatatan` AS `prtcatatan`,`prt`.`prtnoref` AS `prtnoref`,`prt`.`prttglnoref` AS `prttglnoref`,`prt`.`prttglpenutupan` AS `prttglpenutupan`,`prt`.`prtmatauang` AS `prtmatauang`,`prt`.`prtkurs` AS `prtkurs`,`prt`.`prthargatermasukpajak` AS `prthargatermasukpajak`,`prt`.`prttotal` AS `prttotal`,`prt`.`prtdiskonpersen` AS `prtdiskonpersen`,`prt`.`prtjmldiskon` AS `prtjmldiskon`,`prt`.`prttotalpajak1detail` AS `prttotalpajak1detail`,`prt`.`prttotalpajak2detail` AS `prttotalpajak2detail`,`prt`.`prtbiayalainpersen` AS `prtbiayalainpersen`,`prt`.`prtbiayalain` AS `prtbiayalain`,`prt`.`prttotaltransaksi` AS `prttotaltransaksi`,`prt`.`prtsisatransaksi` AS `prtsisatransaksi`,`prt`.`prtjmlbayar` AS `prtjmlbayar`,`prt`.`prtstatuslunas` AS `prtstatuslunas`,`prt`.`prttgllunas` AS `prttgllunas`,`prt`.`prtnofakturpajak` AS `prtnofakturpajak`,`prt`.`prtsdhbayarpajak` AS `prtsdhbayarpajak`,`prt`.`prttglbayarpajak` AS `prttglbayarpajak`,`prt`.`prtrekdiskon` AS `prtrekdiskon`,`prt`.`prtrekpajak1` AS `prtrekpajak1`,`prt`.`prtrekpajak2` AS `prtrekpajak2`,`prt`.`prtrekbiayalain` AS `prtrekbiayalain`,`prt`.`prtrekbayar` AS `prtrekbayar`,`prt`.`prtreksisa` AS `prtreksisa`,`prt`.`prtidpr` AS `prtidpr`,`prt`.`prtidcs` AS `prtidcs`,`prt`.`prtidrq` AS `prtidrq`,`prt`.`prtidbs` AS `prtidbs`,`prt`.`prtidpo` AS `prtidpo`,`prt`.`prtidipc` AS `prtidipc`,`prt`.`prtidgrn` AS `prtidgrn`,`prt`.`prtidri` AS `prtidri`,`prt`.`prtiddnr` AS `prtiddnr`,`prt`.`prtstatus` AS `prtstatus`,`prt`.`prtstatussebelumnya` AS `prtstatussebelumnya`,`prt`.`prtjmlrevisi` AS `prtjmlrevisi`,`prt`.`prtcetakanke` AS `prtcetakanke`,`prt`.`prtinputuser` AS `prtinputuser`,`prt`.`prtinputtgl` AS `prtinputtgl`,`prt`.`prtmodifikasiuser` AS `prtmodifikasiuser`,`prt`.`prtmodifikasitgl` AS `prtmodifikasitgl`,`prt`.`prtposting` AS `prtposting`,`prt`.`prtpostingtgl` AS `prtpostingtgl`,`prt`.`prttutupperiode` AS `prttutupperiode`,`prt`.`prtisclose` AS `prtisclose`,`prt`.`prtcustomtext1` AS `prtcustomtext1`,`prt`.`prtcustomtext2` AS `prtcustomtext2`,`prt`.`prtcustomtext3` AS `prtcustomtext3`,`prt`.`prtcustomtext4` AS `prtcustomtext4`,`prt`.`prtcustomtext5` AS `prtcustomtext5`,`prt`.`prtcustomint1` AS `prtcustomint1`,`prt`.`prtcustomint2` AS `prtcustomint2`,`prt`.`prtcustomint3` AS `prtcustomint3`,`prt`.`prtcustomdbl1` AS `prtcustomdbl1`,`prt`.`prtcustomdbl2` AS `prtcustomdbl2`,`prt`.`prtcustomdbl3` AS `prtcustomdbl3`,`prt`.`prtcustomdate1` AS `prtcustomdate1`,`prt`.`prtcustomdate2` AS `prtcustomdate2`,`prt`.`prtcustomdate3` AS `prtcustomdate3`,`br`.`bnama` AS `prtcabangnama`,`lc`.`lnama` AS `prtlokasinama`,`wh`.`wnama` AS `prtgudangnama`,`c1`.`kkode` AS `prtsupplierkode`,`c1`.`knama` AS `prtsuppliernama`,`c2`.`kkode` AS `prtbagianpembeliankode`,`c2`.`knama` AS `prtbagianpembeliannama`,`tr`.`trnama` AS `prtterminnama`,`tr`.`trharijatuhtempo` AS `prtterminharijatuhtempo`,`coa1`.`cnama` AS `prtrekdiskonnama`,`coa2`.`cnama` AS `prtrekpajak1nama`,`coa3`.`cnama` AS `prtrekpajak2nama`,`coa4`.`cnama` AS `prtrekbiayalainnama`,`coa5`.`cnama` AS `prtrekbayarnama`,`coa6`.`cnama` AS `prtreksisanama`,`ri`.`rinotransaksi` AS `prtnotransaksiri`,`dnr`.`dnrnotransaksi` AS `prtnotransaksidnr`,`st1`.`nama` AS `prtstatusnama`,`st2`.`nama` AS `prtstatussebelumnyanama`,`u1`.`unama` AS `prtinputusernama`,`u2`.`unama` AS `prtmodifikasiusernama`, prt.prtjenis, `prtd`.`idprtdetail` AS `idprtdetail`,`prtd`.`idprt` AS `idprt`,`prtd`.`idbarang` AS `idbarang`,`prtd`.`namabarang` AS `namabarang`,`prtd`.`tipebarang` AS `tipebarang`,`prtd`.`jml` AS `jml`,`prtd`.`satuan` AS `satuan`,`prtd`.`nilaisatuan` AS `nilaisatuan`,`prtd`.`jmlbarang` AS `jmlbarang`,`prtd`.`satuanbarang` AS `satuanbarang`,`prtd`.`matauang` AS `matauang`,`prtd`.`kurs` AS `kurs`,`prtd`.`hargafix` AS `hargafix`,`prtd`.`idhppkhususmasuk` AS `idhppkhususmasuk`,`prtd`.`idhppfifomasuk` AS `idhppfifomasuk`,`prtd`.`hpp` AS `hpp`,`prtd`.`harga` AS `harga`,`prtd`.`diskon` AS `diskon`,`prtd`.`jmldiskon` AS `jmldiskon`,`prtd`.`pajak1` AS `pajak1`,`prtd`.`jmlpajak1` AS `jmlpajak1`,`prtd`.`pajak2` AS `pajak2`,`prtd`.`jmlpajak2` AS `jmlpajak2`,`prtd`.`cabang` AS `cabang`,`prtd`.`lokasi` AS `lokasi`,`prtd`.`gudangasal` AS `gudangasal`,`prtd`.`gudangtransit` AS `gudangtransit`,`prtd`.`gudangtujuan` AS `gudangtujuan`,`i`.`brekpersediaan` AS `rekpersediaan`,`i`.`brekdiskonpembelian` AS `rekdiskonpembelian`,`i`.`brekhargapokok` AS `rekhargapokok`,`i`.`brekreturpembelian` AS `rekreturpembelian`,`prtd`.`costcenter` AS `costcenter`,`prtd`.`divisi` AS `divisi`,`prtd`.`subdivisi` AS `subdivisi`,`prtd`.`proyek` AS `proyek`,`prtd`.`catatan` AS `catatan`,`prtd`.`urutan` AS `urutan`,`prtd`.`idprdetail` AS `idprdetail`,`prtd`.`idcsdetail` AS `idcsdetail`,`prtd`.`idrqdetail` AS `idrqdetail`,`prtd`.`idbsdetail` AS `idbsdetail`,`prtd`.`idpodetail` AS `idpodetail`,`prtd`.`idipcdetail` AS `idipcdetail`,`prtd`.`idgrndetail` AS `idgrndetail`,`prtd`.`idridetail` AS `idridetail`,`prtd`.`iddnrdetail` AS `iddnrdetail`,`prtd`.`isclose` AS `isclose`,`prtd`.`customtext1` AS `customtext1`,`prtd`.`customtext2` AS `customtext2`,`prtd`.`customtext3` AS `customtext3`,`prtd`.`customdbl1` AS `customdbl1`,`prtd`.`customdbl2` AS `customdbl2`,`prtd`.`customdbl3` AS `customdbl3`,`prtd`.`customdate1` AS `customdate1`,`prtd`.`customdate2` AS `customdate2`,`prtd`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bhpp` AS `bhpp`,`i`.`bjenis` AS `bjenis`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,`i`.`basset` AS `basset`,`t1`.`tnama` AS `pajak1nama`,`t1`.`tnilai` AS `pajak1nilai`,`t2`.`tnama` AS `pajak2nama`,`t2`.`tnilai` AS `pajak2nilai`,`brd`.`bnama` AS `cabangnama`,`lcd`.`lnama` AS `lokasinama`,`whd1`.`wnama` AS `gudangasalnama`,`whd2`.`wnama` AS `gudangtransitnama`,`whd3`.`wnama` AS `gudangtujuannama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama`,`ri2`.`rinotransaksi` AS `rinotransaksi`,`dnr2`.`dnrnotransaksi` AS `dnrnotransaksi`, c1.kpkp, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan from (((((((((((((((((((((((((((((((((((`m4_prt` `prt` join `m4_prt_detail` `prtd` on((`prt`.`prtid` = `prtd`.`idprt`))) left join `m1_branch` `br` on((`br`.`bkode` = `prt`.`prtcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `prt`.`prtlokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `prt`.`prtgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `prt`.`prtsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `prt`.`prtbagianpembelian`))) left join `m1_terms` `tr` on((`prt`.`prttermin` = `tr`.`trkode`))) left join `m1_coa` `coa1` on((`prt`.`prtrekdiskon` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`prt`.`prtrekpajak1` = `coa2`.`cnomor`))) left join `m1_coa` `coa3` on((`prt`.`prtrekpajak2` = `coa3`.`cnomor`))) left join `m1_coa` `coa4` on((`prt`.`prtrekbiayalain` = `coa4`.`cnomor`))) left join `m1_coa` `coa5` on((`prt`.`prtrekbayar` = `coa5`.`cnomor`))) left join `m1_coa` `coa6` on((`prt`.`prtreksisa` = `coa6`.`cnomor`))) left join `m4_ri` `ri` on((`prt`.`prtidri` = `ri`.`riid`))) left join `m4_dnr` `dnr` on((`prt`.`prtiddnr` = `dnr`.`dnrid`))) left join `m0_status` `st1` on((`st1`.`kode` = `prt`.`prtstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `prt`.`prtstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `prt`.`prtinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `prt`.`prtmodifikasiuser`))) left join `m1_item` `i` on((`i`.`bid` = `prtd`.`idbarang`))) left join `m1_tax` `t1` on((`prtd`.`pajak1` = `t1`.`tkode`))) left join `m1_tax` `t2` on((`prtd`.`pajak2` = `t2`.`tkode`))) left join `m4_dnr_detail` `dnrd` on((`prtd`.`iddnrdetail` = `dnrd`.`iddnrdetail`))) left join `m4_dnr` `dnr2` on((`dnrd`.`iddnr` = `dnr2`.`dnrid`))) left join `m1_branch` `brd` on((`prtd`.`cabang` = `brd`.`bkode`))) left join `m1_location` `lcd` on((`prtd`.`lokasi` = `lcd`.`lkode`))) left join `m1_warehouse` `whd1` on((`prtd`.`gudangasal` = `whd1`.`wkode`))) left join `m1_warehouse` `whd2` on((`prtd`.`gudangtransit` = `whd2`.`wkode`))) left join `m1_warehouse` `whd3` on((`prtd`.`gudangtujuan` = `whd3`.`wkode`))) left join `m1_cost_center` `cc` on((`prtd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`prtd`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`prtd`.`subdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`prtd`.`proyek` = `p`.`pkode`))) left join `m4_ri_detail` `rid` on((`prtd`.`idridetail` = `rid`.`idridetail`))) left join `m4_ri` `ri2` on((`rid`.`idri` = `ri2`.`riid`)))
```

## Query 80

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_prt_getdata`

```sql
select `prt`.`prtid` AS `prtid`,`prt`.`prtcabang` AS `prtcabang`,`prt`.`prtlokasi` AS `prtlokasi`,`prt`.`prtgudang` AS `prtgudang`,`prt`.`prtasalbarang` AS `prtasalbarang`,`prt`.`prtasalbarangkategori` AS `prtasalbarangkategori`,`prt`.`prtjenispembelian` AS `prtjenispembelian`,`prt`.`prtjenispembeliankategori` AS `prtjenispembeliankategori`,`prt`.`prtcarabayar` AS `prtcarabayar`,`prt`.`prtsumber` AS `prtsumber`,`prt`.`prtautonotransaksi` AS `prtautonotransaksi`,`prt`.`prtnotransaksi` AS `prtnotransaksi`,`prt`.`prttgl` AS `prttgl`,`prt`.`prtkodepa` AS `prtkodepa`,`prt`.`prtsupplier` AS `prtsupplier`,`prt`.`prtsupplierkontak` AS `prtsupplierkontak`,`prt`.`prt1alamat1` AS `prt1alamat1`,`prt`.`prt1alamat2` AS `prt1alamat2`,`prt`.`prt1alamat3` AS `prt1alamat3`,`prt`.`prt2alamat1` AS `prt2alamat1`,`prt`.`prt2alamat2` AS `prt2alamat2`,`prt`.`prt2alamat3` AS `prt2alamat3`,`prt`.`prtbagianpembelian` AS `prtbagianpembelian`,`prt`.`prttermin` AS `prttermin`,`prt`.`prttgljatuhtempo` AS `prttgljatuhtempo`,`prt`.`prturaian` AS `prturaian`,`prt`.`prtcatatan` AS `prtcatatan`,`prt`.`prtnoref` AS `prtnoref`,`prt`.`prttglnoref` AS `prttglnoref`,`prt`.`prttglpenutupan` AS `prttglpenutupan`,`prt`.`prtmatauang` AS `prtmatauang`,`prt`.`prtkurs` AS `prtkurs`,`prt`.`prthargatermasukpajak` AS `prthargatermasukpajak`,`prt`.`prttotal` AS `prttotal`,`prt`.`prtdiskonpersen` AS `prtdiskonpersen`,`prt`.`prtjmldiskon` AS `prtjmldiskon`,`prt`.`prttotalpajak1detail` AS `prttotalpajak1detail`,`prt`.`prttotalpajak2detail` AS `prttotalpajak2detail`,`prt`.`prtbiayalainpersen` AS `prtbiayalainpersen`,`prt`.`prtbiayalain` AS `prtbiayalain`,`prt`.`prttotaltransaksi` AS `prttotaltransaksi`,`prt`.`prtsisatransaksi` AS `prtsisatransaksi`,`prt`.`prtjmlbayar` AS `prtjmlbayar`,`prt`.`prtstatuslunas` AS `prtstatuslunas`,`prt`.`prttgllunas` AS `prttgllunas`,`prt`.`prtnofakturpajak` AS `prtnofakturpajak`,`prt`.`prtsdhbayarpajak` AS `prtsdhbayarpajak`,`prt`.`prttglbayarpajak` AS `prttglbayarpajak`,`prt`.`prtrekdiskon` AS `prtrekdiskon`,`prt`.`prtrekpajak1` AS `prtrekpajak1`,`prt`.`prtrekpajak2` AS `prtrekpajak2`,`prt`.`prtrekbiayalain` AS `prtrekbiayalain`,`prt`.`prtrekbayar` AS `prtrekbayar`,`prt`.`prtreksisa` AS `prtreksisa`,`prt`.`prtidpr` AS `prtidpr`,`prt`.`prtidcs` AS `prtidcs`,`prt`.`prtidrq` AS `prtidrq`,`prt`.`prtidbs` AS `prtidbs`,`prt`.`prtidpo` AS `prtidpo`,`prt`.`prtidipc` AS `prtidipc`,`prt`.`prtidgrn` AS `prtidgrn`,`prt`.`prtidri` AS `prtidri`,`prt`.`prtiddnr` AS `prtiddnr`,`prt`.`prtstatus` AS `prtstatus`,`prt`.`prtstatussebelumnya` AS `prtstatussebelumnya`,`prt`.`prtjmlrevisi` AS `prtjmlrevisi`,`prt`.`prtcetakanke` AS `prtcetakanke`,`prt`.`prtinputuser` AS `prtinputuser`,`prt`.`prtinputtgl` AS `prtinputtgl`,`prt`.`prtmodifikasiuser` AS `prtmodifikasiuser`,`prt`.`prtmodifikasitgl` AS `prtmodifikasitgl`,`prt`.`prtposting` AS `prtposting`,`prt`.`prtpostingtgl` AS `prtpostingtgl`,`prt`.`prttutupperiode` AS `prttutupperiode`,`prt`.`prtisclose` AS `prtisclose`,`prt`.`prtcustomtext1` AS `prtcustomtext1`,`prt`.`prtcustomtext2` AS `prtcustomtext2`,`prt`.`prtcustomtext3` AS `prtcustomtext3`,`prt`.`prtcustomtext4` AS `prtcustomtext4`,`prt`.`prtcustomtext5` AS `prtcustomtext5`,`prt`.`prtcustomint1` AS `prtcustomint1`,`prt`.`prtcustomint2` AS `prtcustomint2`,`prt`.`prtcustomint3` AS `prtcustomint3`,`prt`.`prtcustomdbl1` AS `prtcustomdbl1`,`prt`.`prtcustomdbl2` AS `prtcustomdbl2`,`prt`.`prtcustomdbl3` AS `prtcustomdbl3`,`prt`.`prtcustomdate1` AS `prtcustomdate1`,`prt`.`prtcustomdate2` AS `prtcustomdate2`,`prt`.`prtcustomdate3` AS `prtcustomdate3`,`br`.`bnama` AS `prtcabangnama`,`lc`.`lnama` AS `prtlokasinama`,`wh`.`wnama` AS `prtgudangnama`,`c1`.`kkode` AS `prtsupplierkode`,`c1`.`knama` AS `prtsuppliernama`,`c2`.`kkode` AS `prtbagianpembeliankode`,`c2`.`knama` AS `prtbagianpembeliannama`,`tr`.`trnama` AS `prtterminnama`,`tr`.`trharijatuhtempo` AS `prtterminharijatuhtempo`,`coa1`.`cnama` AS `prtrekdiskonnama`,`coa2`.`cnama` AS `prtrekpajak1nama`,`coa3`.`cnama` AS `prtrekpajak2nama`,`coa4`.`cnama` AS `prtrekbiayalainnama`,`coa5`.`cnama` AS `prtrekbayarnama`,`coa6`.`cnama` AS `prtreksisanama`,`ri`.`rinotransaksi` AS `prtnotransaksiri`,`dnr`.`dnrnotransaksi` AS `prtnotransaksidnr`,`st1`.`nama` AS `prtstatusnama`,`st2`.`nama` AS `prtstatussebelumnyanama`,`u1`.`unama` AS `prtinputusernama`,`u2`.`unama` AS `prtmodifikasiusernama`, prt.prtjenis, `prtd`.`idprtdetail` AS `idprtdetail`,`prtd`.`idprt` AS `idprt`,`prtd`.`idbarang` AS `idbarang`,`prtd`.`namabarang` AS `namabarang`,`prtd`.`tipebarang` AS `tipebarang`,`prtd`.`jml` AS `jml`,`prtd`.`satuan` AS `satuan`,`prtd`.`nilaisatuan` AS `nilaisatuan`,`prtd`.`jmlbarang` AS `jmlbarang`,`prtd`.`satuanbarang` AS `satuanbarang`,`prtd`.`matauang` AS `matauang`,`prtd`.`kurs` AS `kurs`,`prtd`.`hargafix` AS `hargafix`,`prtd`.`idhppkhususmasuk` AS `idhppkhususmasuk`,`prtd`.`idhppfifomasuk` AS `idhppfifomasuk`,`prtd`.`hpp` AS `hpp`,`prtd`.`harga` AS `harga`,`prtd`.`diskon` AS `diskon`,`prtd`.`jmldiskon` AS `jmldiskon`,`prtd`.`pajak1` AS `pajak1`,`prtd`.`jmlpajak1` AS `jmlpajak1`,`prtd`.`pajak2` AS `pajak2`,`prtd`.`jmlpajak2` AS `jmlpajak2`,`prtd`.`cabang` AS `cabang`,`prtd`.`lokasi` AS `lokasi`,`prtd`.`gudangasal` AS `gudangasal`,`prtd`.`gudangtransit` AS `gudangtransit`,`prtd`.`gudangtujuan` AS `gudangtujuan`,`i`.`brekpersediaan` AS `rekpersediaan`,`i`.`brekdiskonpembelian` AS `rekdiskonpembelian`,`i`.`brekhargapokok` AS `rekhargapokok`,`i`.`brekreturpembelian` AS `rekreturpembelian`,`prtd`.`costcenter` AS `costcenter`,`prtd`.`divisi` AS `divisi`,`prtd`.`subdivisi` AS `subdivisi`,`prtd`.`proyek` AS `proyek`,`prtd`.`catatan` AS `catatan`,`prtd`.`urutan` AS `urutan`,`prtd`.`idprdetail` AS `idprdetail`,`prtd`.`idcsdetail` AS `idcsdetail`,`prtd`.`idrqdetail` AS `idrqdetail`,`prtd`.`idbsdetail` AS `idbsdetail`,`prtd`.`idpodetail` AS `idpodetail`,`prtd`.`idipcdetail` AS `idipcdetail`,`prtd`.`idgrndetail` AS `idgrndetail`,`prtd`.`idridetail` AS `idridetail`,`prtd`.`iddnrdetail` AS `iddnrdetail`,`prtd`.`isclose` AS `isclose`,`prtd`.`customtext1` AS `customtext1`,`prtd`.`customtext2` AS `customtext2`,`prtd`.`customtext3` AS `customtext3`,`prtd`.`customdbl1` AS `customdbl1`,`prtd`.`customdbl2` AS `customdbl2`,`prtd`.`customdbl3` AS `customdbl3`,`prtd`.`customdate1` AS `customdate1`,`prtd`.`customdate2` AS `customdate2`,`prtd`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bhpp` AS `bhpp`,`i`.`bjenis` AS `bjenis`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,`t1`.`tnama` AS `pajak1nama`,`t1`.`tnilai` AS `pajak1nilai`,`t2`.`tnama` AS `pajak2nama`,`t2`.`tnilai` AS `pajak2nilai`,`brd`.`bnama` AS `cabangnama`,`lcd`.`lnama` AS `lokasinama`,`whd1`.`wnama` AS `gudangasalnama`,`whd2`.`wnama` AS `gudangtransitnama`,`whd3`.`wnama` AS `gudangtujuannama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama`,`ri2`.`rinotransaksi` AS `rinotransaksi`,`dnr2`.`dnrnotransaksi` AS `dnrnotransaksi`, c1.kpkp, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan from (((((((((((((((((((((((((((((((((((`m4_prt` `prt` join `m4_prt_detail` `prtd` on((`prt`.`prtid` = `prtd`.`idprt`))) left join `m1_branch` `br` on((`br`.`bkode` = `prt`.`prtcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `prt`.`prtlokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `prt`.`prtgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `prt`.`prtsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `prt`.`prtbagianpembelian`))) left join `m1_terms` `tr` on((`prt`.`prttermin` = `tr`.`trkode`))) left join `m1_coa` `coa1` on((`prt`.`prtrekdiskon` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`prt`.`prtrekpajak1` = `coa2`.`cnomor`))) left join `m1_coa` `coa3` on((`prt`.`prtrekpajak2` = `coa3`.`cnomor`))) left join `m1_coa` `coa4` on((`prt`.`prtrekbiayalain` = `coa4`.`cnomor`))) left join `m1_coa` `coa5` on((`prt`.`prtrekbayar` = `coa5`.`cnomor`))) left join `m1_coa` `coa6` on((`prt`.`prtreksisa` = `coa6`.`cnomor`))) left join `m4_ri` `ri` on((`prt`.`prtidri` = `ri`.`riid`))) left join `m4_dnr` `dnr` on((`prt`.`prtiddnr` = `dnr`.`dnrid`))) left join `m0_status` `st1` on((`st1`.`kode` = `prt`.`prtstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `prt`.`prtstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `prt`.`prtinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `prt`.`prtmodifikasiuser`))) left join `m1_item` `i` on((`i`.`bid` = `prtd`.`idbarang`))) left join `m1_tax` `t1` on((`prtd`.`pajak1` = `t1`.`tkode`))) left join `m1_tax` `t2` on((`prtd`.`pajak2` = `t2`.`tkode`))) left join `m4_dnr_detail` `dnrd` on((`prtd`.`iddnrdetail` = `dnrd`.`iddnrdetail`))) left join `m4_dnr` `dnr2` on((`dnrd`.`iddnr` = `dnr2`.`dnrid`))) left join `m1_branch` `brd` on((`prtd`.`cabang` = `brd`.`bkode`))) left join `m1_location` `lcd` on((`prtd`.`lokasi` = `lcd`.`lkode`))) left join `m1_warehouse` `whd1` on((`prtd`.`gudangasal` = `whd1`.`wkode`))) left join `m1_warehouse` `whd2` on((`prtd`.`gudangtransit` = `whd2`.`wkode`))) left join `m1_warehouse` `whd3` on((`prtd`.`gudangtujuan` = `whd3`.`wkode`))) left join `m1_cost_center` `cc` on((`prtd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`prtd`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`prtd`.`subdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`prtd`.`proyek` = `p`.`pkode`))) left join `m4_ri_detail` `rid` on((`prtd`.`idridetail` = `rid`.`idridetail`))) left join `m4_ri` `ri2` on((`rid`.`idri` = `ri2`.`riid`)))
```

## Query 81

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_prt_terkait`

```sql
select `prt`.`prtid` AS `prtid`,`prt`.`prtnotransaksi` AS `prtnotransaksi`,`pr`.`prsumber` AS `sumber`,`pr`.`prid` AS `idterkait`,`pr`.`prnotransaksi` AS `noterkait`,`pr`.`prtgl` AS `tglterkait`,`pr`.`prinputtgl` AS `inputtglterkait`,`pr`.`prmodifikasitgl` AS `modifikasitglterkait`,0 AS `jenisterkait` from (((`m4_pr_detail` `prd` join `m4_pr` `pr` on((`prd`.`idpr` = `pr`.`prid`))) join `m4_prt_detail` `prtd` on((`prd`.`idprdetail` = `prtd`.`idprdetail`))) join `m4_prt` `prt` on((`prtd`.`idprt` = `prt`.`prtid`))) where (`prt`.`prtid` = 'validtransaksi') group by `pr`.`prid`,`prt`.`prtid` union all select `prt`.`prtid` AS `prtid`,`prt`.`prtnotransaksi` AS `prtnotransaksi`,`rq`.`rqsumber` AS `sumber`,`rq`.`rqid` AS `idterkait`,`rq`.`rqnotransaksi` AS `noterkait`,`rq`.`rqtgl` AS `tglterkait`,`rq`.`rqinputtgl` AS `inputtglterkait`,`rq`.`rqmodifikasitgl` AS `modifikasitglterkait`,0 AS `jenisterkait` from (((`m4_rq_detail` `rqd` join `m4_rq` `rq` on((`rqd`.`idrq` = `rq`.`rqid`))) join `m4_prt_detail` `prtd` on((`rqd`.`idrqdetail` = `prtd`.`idrqdetail`))) join `m4_prt` `prt` on((`prtd`.`idprt` = `prt`.`prtid`))) where (`prt`.`prtid` = 'validtransaksi') group by `rq`.`rqid`,`prt`.`prtid` union all select `prt`.`prtid` AS `prtid`,`prt`.`prtnotransaksi` AS `prtnotransaksi`,`po`.`posumber` AS `sumber`,`po`.`poid` AS `idterkait`,`po`.`ponotransaksi` AS `noterkait`,`po`.`potgl` AS `tglterkait`,`po`.`poinputtgl` AS `inputtglterkait`,`po`.`pomodifikasitgl` AS `modifikasitglterkait`,0 AS `jenisterkait` from (((`m4_po_detail` `pod` join `m4_po` `po` on((`pod`.`idpo` = `po`.`poid`))) join `m4_prt_detail` `prtd` on((`pod`.`idpodetail` = `prtd`.`idpodetail`))) join `m4_prt` `prt` on((`prtd`.`idprt` = `prt`.`prtid`))) where (`prt`.`prtid` = 'validtransaksi') group by `po`.`poid`,`prt`.`prtid` union all select `prt`.`prtid` AS `prtid`,`prt`.`prtnotransaksi` AS `prtnotransaksi`,`grn`.`grnsumber` AS `sumber`,`grn`.`grnid` AS `idterkait`,`grn`.`grnnotransaksi` AS `noterkait`,`grn`.`grntgl` AS `tglterkait`,`grn`.`grninputtgl` AS `inputtglterkait`,`grn`.`grnmodifikasitgl` AS `modifikasitglterkait`,0 AS `jenisterkait` from (((`m4_grn_detail` `grnd` join `m4_grn` `grn` on((`grnd`.`idgrn` = `grn`.`grnid`))) join `m4_prt_detail` `prtd` on((`grnd`.`idgrndetail` = `prtd`.`idgrndetail`))) join `m4_prt` `prt` on((`prtd`.`idprt` = `prt`.`prtid`))) where (`prt`.`prtid` = 'validtransaksi') group by `grn`.`grnid`,`prt`.`prtid` union all select `prt`.`prtid` AS `prtid`,`prt`.`prtnotransaksi` AS `prtnotransaksi`,`ri`.`risumber` AS `sumber`,`ri`.`riid` AS `idterkait`,`ri`.`rinotransaksi` AS `noterkait`,`ri`.`ritgl` AS `tglterkait`,`ri`.`riinputtgl` AS `inputtglterkait`,`ri`.`rimodifikasitgl` AS `modifikasitglterkait`,0 AS `jenisterkait` from (((`m4_ri_detail` `rid` join `m4_ri` `ri` on((`rid`.`idri` = `ri`.`riid`))) join `m4_prt_detail` `prtd` on((`rid`.`idridetail` = `prtd`.`idridetail`))) join `m4_prt` `prt` on((`prtd`.`idprt` = `prt`.`prtid`))) where (`prt`.`prtid` = 'validtransaksi') group by `ri`.`riid`,`prt`.`prtid` union all select `prt`.`prtid` AS `prtid`,`prt`.`prtnotransaksi` AS `prtnotransaksi`,`dnr`.`dnrsumber` AS `sumber`,`dnr`.`dnrid` AS `idterkait`,`dnr`.`dnrnotransaksi` AS `noterkait`,`dnr`.`dnrtgl` AS `tglterkait`,`dnr`.`dnrinputtgl` AS `inputtglterkait`,`dnr`.`dnrmodifikasitgl` AS `modifikasitglterkait`,0 AS `jenisterkait` from (((`m4_dnr_detail` `dnrd` join `m4_dnr` `dnr` on((`dnrd`.`iddnr` = `dnr`.`dnrid`))) join `m4_prt_detail` `prtd` on((`dnrd`.`iddnrdetail` = `prtd`.`iddnrdetail`))) join `m4_prt` `prt` on((`prtd`.`idprt` = `prt`.`prtid`))) where (`prt`.`prtid` = 'validtransaksi') group by `dnr`.`dnrid`,`prt`.`prtid` union all select `prt`.`prtid` AS `prtid`,`prt`.`prtnotransaksi` AS `prtnotransaksi`,`vpp`.`vppsumber` AS `sumber`,`vpp`.`vppid` AS `idterkait`,`vpp`.`vppnotransaksi` AS `noterkait`,`vpp`.`vpptgl` AS `tglterkait`,`vpp`.`vppinputtgl` AS `inputtglterkait`,`vpp`.`vppmodifikasitgl` AS `modifikasitglterkait`,1 AS `jenisterkait` from ((`m4_vpp_detail` `vppd` join `m4_vpp` `vpp` on((`vppd`.`idvpp` = `vpp`.`vppid`))) join `m4_prt` `prt` on((`vppd`.`idtransaksi` = `prt`.`prtid`))) where ((`vppd`.`sumber` = 'PRT') and ((`vpp`.`vppstatus` = 2) or (`vpp`.`vppstatus` = 3) or (`vpp`.`vppstatus` = 4) or (`vpp`.`vppstatus` = 7)) and (`prt`.`prtid` = 'validtransaksi')) group by `vpp`.`vppid`,`prt`.`prtid` union all select `prt`.`prtid` AS `prtid`,`prt`.`prtnotransaksi` AS `prtnotransaksi`,`vp`.`vpsumber` AS `sumber`,`vp`.`vpid` AS `idterkait`,`vp`.`vpnotransaksi` AS `noterkait`,`vp`.`vptgl` AS `tglterkait`,`vp`.`vpinputtgl` AS `inputtglterkait`,`vp`.`vpmodifikasitgl` AS `modifikasitglterkait`,1 AS `jenisterkait` from ((`m4_vp_detail` `vpd` join `m4_vp` `vp` on((`vpd`.`idvp` = `vp`.`vpid`))) join `m4_prt` `prt` on((`vpd`.`idtransaksi` = `prt`.`prtid`))) where ((`vpd`.`sumber` = 'PRT') and ((`vp`.`vpstatus` = 2) or (`vp`.`vpstatus` = 3) or (`vp`.`vpstatus` = 4) or (`vp`.`vpstatus` = 7)) and (`prt`.`prtid` = 'validtransaksi')) group by `vp`.`vpid`,`prt`.`prtid`
```

## Query 82

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_prt_v_history`

```sql
select `prt`.`prtidhistory` AS `prtidhistory`,`prt`.`prtid` AS `prtid`,`prt`.`prtcabang` AS `prtcabang`,`prt`.`prtlokasi` AS `prtlokasi`,`prt`.`prtgudang` AS `prtgudang`,`prt`.`prtasalbarang` AS `prtasalbarang`,`prt`.`prtasalbarangkategori` AS `prtasalbarangkategori`,`prt`.`prtjenispembelian` AS `prtjenispembelian`,`prt`.`prtjenispembeliankategori` AS `prtjenispembeliankategori`,`prt`.`prtcarabayar` AS `prtcarabayar`,`prt`.`prtsumber` AS `prtsumber`,`prt`.`prtautonotransaksi` AS `prtautonotransaksi`,`prt`.`prtnotransaksi` AS `prtnotransaksi`,`prt`.`prttgl` AS `prttgl`,`prt`.`prtkodepa` AS `prtkodepa`,`prt`.`prtsupplier` AS `prtsupplier`,`prt`.`prtsupplierkontak` AS `prtsupplierkontak`,`prt`.`prt1alamat1` AS `prt1alamat1`,`prt`.`prt1alamat2` AS `prt1alamat2`,`prt`.`prt1alamat3` AS `prt1alamat3`,`prt`.`prt2alamat1` AS `prt2alamat1`,`prt`.`prt2alamat2` AS `prt2alamat2`,`prt`.`prt2alamat3` AS `prt2alamat3`,`prt`.`prtbagianpembelian` AS `prtbagianpembelian`,`prt`.`prttermin` AS `prttermin`,`prt`.`prttgljatuhtempo` AS `prttgljatuhtempo`,`prt`.`prturaian` AS `prturaian`,`prt`.`prtcatatan` AS `prtcatatan`,`prt`.`prtnoref` AS `prtnoref`,`prt`.`prttglnoref` AS `prttglnoref`,`prt`.`prttglpenutupan` AS `prttglpenutupan`,`prt`.`prtmatauang` AS `prtmatauang`,`prt`.`prtkurs` AS `prtkurs`,`prt`.`prthargatermasukpajak` AS `prthargatermasukpajak`,`prt`.`prttotal` AS `prttotal`,`prt`.`prtdiskonpersen` AS `prtdiskonpersen`,`prt`.`prtjmldiskon` AS `prtjmldiskon`,`prt`.`prttotalpajak1detail` AS `prttotalpajak1detail`,`prt`.`prttotalpajak2detail` AS `prttotalpajak2detail`,`prt`.`prtbiayalainpersen` AS `prtbiayalainpersen`,`prt`.`prtbiayalain` AS `prtbiayalain`,`prt`.`prttotaltransaksi` AS `prttotaltransaksi`,`prt`.`prtsisatransaksi` AS `prtsisatransaksi`,`prt`.`prtjmlbayar` AS `prtjmlbayar`,`prt`.`prtstatuslunas` AS `prtstatuslunas`,`prt`.`prttgllunas` AS `prttgllunas`,`prt`.`prtnofakturpajak` AS `prtnofakturpajak`,`prt`.`prtsdhbayarpajak` AS `prtsdhbayarpajak`,`prt`.`prttglbayarpajak` AS `prttglbayarpajak`,`prt`.`prtrekdiskon` AS `prtrekdiskon`,`prt`.`prtrekpajak1` AS `prtrekpajak1`,`prt`.`prtrekpajak2` AS `prtrekpajak2`,`prt`.`prtrekbiayalain` AS `prtrekbiayalain`,`prt`.`prtrekbayar` AS `prtrekbayar`,`prt`.`prtreksisa` AS `prtreksisa`,`prt`.`prtidpr` AS `prtidpr`,`prt`.`prtidcs` AS `prtidcs`,`prt`.`prtidrq` AS `prtidrq`,`prt`.`prtidbs` AS `prtidbs`,`prt`.`prtidpo` AS `prtidpo`,`prt`.`prtidipc` AS `prtidipc`,`prt`.`prtidgrn` AS `prtidgrn`,`prt`.`prtidri` AS `prtidri`,`prt`.`prtiddnr` AS `prtiddnr`,`prt`.`prtstatus` AS `prtstatus`,`prt`.`prtstatussebelumnya` AS `prtstatussebelumnya`,`prt`.`prtjmlrevisi` AS `prtjmlrevisi`,`prt`.`prtcetakanke` AS `prtcetakanke`,`prt`.`prtinputuser` AS `prtinputuser`,`prt`.`prtinputtgl` AS `prtinputtgl`,`prt`.`prtmodifikasiuser` AS `prtmodifikasiuser`,`prt`.`prtmodifikasitgl` AS `prtmodifikasitgl`,`prt`.`prtposting` AS `prtposting`,`prt`.`prtpostingtgl` AS `prtpostingtgl`,`prt`.`prttutupperiode` AS `prttutupperiode`,`prt`.`prtisclose` AS `prtisclose`,`br`.`bnama` AS `prtcabangnama`,`lc`.`lnama` AS `prtlokasinama`,`wh`.`wnama` AS `prtgudangnama`,`c1`.`kkode` AS `prtsupplierkode`,`c1`.`knama` AS `prtsuppliernama`,`c2`.`kkode` AS `prtbagianpembeliankode`,`c2`.`knama` AS `prtbagianpembeliannama`,`ri`.`rinotransaksi` AS `rinotransaksi`,`dnr`.`dnrnotransaksi` AS `dnrnotransaksi`,`st1`.`nama` AS `prtstatusnama`,`st2`.`nama` AS `prtstatussebelumnyanama`,`u1`.`unama` AS `prtinputusernama`,`u2`.`unama` AS `prtmodifikasiusernama`, `prt`.`prtcustomtext1` AS `prtcustomtext1`, `prt`.`prtcustomtext2` AS `prtcustomtext2`, `prt`.`prtcustomtext3` AS `prtcustomtext3`, `prt`.`prtcustomtext4` AS `prtcustomtext4`, `prt`.`prtcustomtext5` AS `prtcustomtext5`, `prt`.`prtcustomint1` AS `prtcustomint1`, `prt`.`prtcustomint2` AS `prtcustomint2`, `prt`.`prtcustomint3` AS `prtcustomint3`, `prt`.`prtcustomdbl1` AS `prtcustomdbl1`, `prt`.`prtcustomdbl2` AS `prtcustomdbl2`, `prt`.`prtcustomdbl3` AS `prtcustomdbl3`, `prt`.`prtcustomdate1` AS `prtcustomdate1`, `prt`.`prtcustomdate2` AS `prtcustomdate2`, `prt`.`prtcustomdate3` AS `prtcustomdate3`, prt.prtjenis, (CASE prt.prtjenis WHEN 0 THEN 'Undirect' ELSE 'Direct' END) as prtjenisnama from (((((((((((`m4_prt_history` `prt` left join `m1_branch` `br` on((`br`.`bkode` = `prt`.`prtcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `prt`.`prtlokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `prt`.`prtgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `prt`.`prtsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `prt`.`prtbagianpembelian`))) left join `m4_ri` `ri` on((`prt`.`prtidri` = `ri`.`riid`))) left join `m4_dnr` `dnr` on((`prt`.`prtid` = `dnr`.`dnrid`))) left join `m0_status` `st1` on((`st1`.`kode` = `prt`.`prtstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `prt`.`prtstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `prt`.`prtinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `prt`.`prtmodifikasiuser`)))
```

## Query 83

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_prt_getdata_history`

```sql
select `prt`.`prtidhistory` AS `prtidhistory`,`prt`.`prtid` AS `prtid`,`prt`.`prtcabang` AS `prtcabang`,`prt`.`prtlokasi` AS `prtlokasi`,`prt`.`prtgudang` AS `prtgudang`,`prt`.`prtasalbarang` AS `prtasalbarang`,`prt`.`prtasalbarangkategori` AS `prtasalbarangkategori`,`prt`.`prtjenispembelian` AS `prtjenispembelian`,`prt`.`prtjenispembeliankategori` AS `prtjenispembeliankategori`,`prt`.`prtcarabayar` AS `prtcarabayar`,`prt`.`prtsumber` AS `prtsumber`,`prt`.`prtautonotransaksi` AS `prtautonotransaksi`,`prt`.`prtnotransaksi` AS `prtnotransaksi`,`prt`.`prttgl` AS `prttgl`,`prt`.`prtkodepa` AS `prtkodepa`,`prt`.`prtsupplier` AS `prtsupplier`,`prt`.`prtsupplierkontak` AS `prtsupplierkontak`,`prt`.`prt1alamat1` AS `prt1alamat1`,`prt`.`prt1alamat2` AS `prt1alamat2`,`prt`.`prt1alamat3` AS `prt1alamat3`,`prt`.`prt2alamat1` AS `prt2alamat1`,`prt`.`prt2alamat2` AS `prt2alamat2`,`prt`.`prt2alamat3` AS `prt2alamat3`,`prt`.`prtbagianpembelian` AS `prtbagianpembelian`,`prt`.`prttermin` AS `prttermin`,`prt`.`prttgljatuhtempo` AS `prttgljatuhtempo`,`prt`.`prturaian` AS `prturaian`,`prt`.`prtcatatan` AS `prtcatatan`,`prt`.`prtnoref` AS `prtnoref`,`prt`.`prttglnoref` AS `prttglnoref`,`prt`.`prttglpenutupan` AS `prttglpenutupan`,`prt`.`prtmatauang` AS `prtmatauang`,`prt`.`prtkurs` AS `prtkurs`,`prt`.`prthargatermasukpajak` AS `prthargatermasukpajak`,`prt`.`prttotal` AS `prttotal`,`prt`.`prtdiskonpersen` AS `prtdiskonpersen`,`prt`.`prtjmldiskon` AS `prtjmldiskon`,`prt`.`prttotalpajak1detail` AS `prttotalpajak1detail`,`prt`.`prttotalpajak2detail` AS `prttotalpajak2detail`,`prt`.`prtbiayalainpersen` AS `prtbiayalainpersen`,`prt`.`prtbiayalain` AS `prtbiayalain`,`prt`.`prttotaltransaksi` AS `prttotaltransaksi`,`prt`.`prtsisatransaksi` AS `prtsisatransaksi`,`prt`.`prtjmlbayar` AS `prtjmlbayar`,`prt`.`prtstatuslunas` AS `prtstatuslunas`,`prt`.`prttgllunas` AS `prttgllunas`,`prt`.`prtnofakturpajak` AS `prtnofakturpajak`,`prt`.`prtsdhbayarpajak` AS `prtsdhbayarpajak`,`prt`.`prttglbayarpajak` AS `prttglbayarpajak`,`prt`.`prtrekdiskon` AS `prtrekdiskon`,`prt`.`prtrekpajak1` AS `prtrekpajak1`,`prt`.`prtrekpajak2` AS `prtrekpajak2`,`prt`.`prtrekbiayalain` AS `prtrekbiayalain`,`prt`.`prtrekbayar` AS `prtrekbayar`,`prt`.`prtreksisa` AS `prtreksisa`,`prt`.`prtidpr` AS `prtidpr`,`prt`.`prtidcs` AS `prtidcs`,`prt`.`prtidrq` AS `prtidrq`,`prt`.`prtidbs` AS `prtidbs`,`prt`.`prtidpo` AS `prtidpo`,`prt`.`prtidipc` AS `prtidipc`,`prt`.`prtidgrn` AS `prtidgrn`,`prt`.`prtidri` AS `prtidri`,`prt`.`prtiddnr` AS `prtiddnr`,`prt`.`prtstatus` AS `prtstatus`,`prt`.`prtstatussebelumnya` AS `prtstatussebelumnya`,`prt`.`prtjmlrevisi` AS `prtjmlrevisi`,`prt`.`prtcetakanke` AS `prtcetakanke`,`prt`.`prtinputuser` AS `prtinputuser`,`prt`.`prtinputtgl` AS `prtinputtgl`,`prt`.`prtmodifikasiuser` AS `prtmodifikasiuser`,`prt`.`prtmodifikasitgl` AS `prtmodifikasitgl`,`prt`.`prtposting` AS `prtposting`,`prt`.`prtpostingtgl` AS `prtpostingtgl`,`prt`.`prttutupperiode` AS `prttutupperiode`,`prt`.`prtisclose` AS `prtisclose`,`prt`.`prtcustomtext1` AS `prtcustomtext1`,`prt`.`prtcustomtext2` AS `prtcustomtext2`,`prt`.`prtcustomtext3` AS `prtcustomtext3`,`prt`.`prtcustomtext4` AS `prtcustomtext4`,`prt`.`prtcustomtext5` AS `prtcustomtext5`,`prt`.`prtcustomint1` AS `prtcustomint1`,`prt`.`prtcustomint2` AS `prtcustomint2`,`prt`.`prtcustomint3` AS `prtcustomint3`,`prt`.`prtcustomdbl1` AS `prtcustomdbl1`,`prt`.`prtcustomdbl2` AS `prtcustomdbl2`,`prt`.`prtcustomdbl3` AS `prtcustomdbl3`,`prt`.`prtcustomdate1` AS `prtcustomdate1`,`prt`.`prtcustomdate2` AS `prtcustomdate2`,`prt`.`prtcustomdate3` AS `prtcustomdate3`,`br`.`bnama` AS `prtcabangnama`,`lc`.`lnama` AS `prtlokasinama`,`wh`.`wnama` AS `prtgudangnama`,`c1`.`kkode` AS `prtsupplierkode`,`c1`.`knama` AS `prtsuppliernama`,`c2`.`kkode` AS `prtbagianpembeliankode`,`c2`.`knama` AS `prtbagianpembeliannama`,`tr`.`trnama` AS `prtterminnama`,`tr`.`trharijatuhtempo` AS `prtterminharijatuhtempo`,`coa1`.`cnama` AS `prtrekdiskonnama`,`coa2`.`cnama` AS `prtrekpajak1nama`,`coa3`.`cnama` AS `prtrekpajak2nama`,`coa4`.`cnama` AS `prtrekbiayalainnama`,`coa5`.`cnama` AS `prtrekbayarnama`,`coa6`.`cnama` AS `prtreksisanama`,`ri`.`rinotransaksi` AS `prtnotransaksiri`,`dnr`.`dnrnotransaksi` AS `prtnotransaksidnr`,`st1`.`nama` AS `prtstatusnama`,`st2`.`nama` AS `prtstatussebelumnyanama`,`u1`.`unama` AS `prtinputusernama`,`u2`.`unama` AS `prtmodifikasiusernama`,`prtd`.`idhistorydetail` AS `idhistorydetail`,`prtd`.`idhistory` AS `idhistory`,`prtd`.`idprtdetail` AS `idprtdetail`,`prtd`.`idprt` AS `idprt`,`prtd`.`idbarang` AS `idbarang`,`prtd`.`namabarang` AS `namabarang`,`prtd`.`tipebarang` AS `tipebarang`,`prtd`.`jml` AS `jml`,`prtd`.`satuan` AS `satuan`,`prtd`.`nilaisatuan` AS `nilaisatuan`,`prtd`.`jmlbarang` AS `jmlbarang`,`prtd`.`satuanbarang` AS `satuanbarang`,`prtd`.`matauang` AS `matauang`,`prtd`.`kurs` AS `kurs`,`prtd`.`hargafix` AS `hargafix`,`prtd`.`idhppkhususmasuk` AS `idhppkhususmasuk`,`prtd`.`idhppfifomasuk` AS `idhppfifomasuk`,`prtd`.`hpp` AS `hpp`,`prtd`.`harga` AS `harga`,`prtd`.`diskon` AS `diskon`,`prtd`.`jmldiskon` AS `jmldiskon`,`prtd`.`pajak1` AS `pajak1`,`prtd`.`jmlpajak1` AS `jmlpajak1`,`prtd`.`pajak2` AS `pajak2`,`prtd`.`jmlpajak2` AS `jmlpajak2`,`prtd`.`cabang` AS `cabang`,`prtd`.`lokasi` AS `lokasi`,`prtd`.`gudangasal` AS `gudangasal`,`prtd`.`gudangtransit` AS `gudangtransit`,`prtd`.`gudangtujuan` AS `gudangtujuan`,`i`.`brekpersediaan` AS `rekpersediaan`,`i`.`brekdiskonpembelian` AS `rekdiskonpembelian`,`i`.`brekhargapokok` AS `rekhargapokok`,`i`.`brekreturpembelian` AS `rekreturpembelian`,`prtd`.`costcenter` AS `costcenter`,`prtd`.`divisi` AS `divisi`,`prtd`.`subdivisi` AS `subdivisi`,`prtd`.`proyek` AS `proyek`,`prtd`.`catatan` AS `catatan`,`prtd`.`urutan` AS `urutan`,`prtd`.`idprdetail` AS `idprdetail`,`prtd`.`idcsdetail` AS `idcsdetail`,`prtd`.`idrqdetail` AS `idrqdetail`,`prtd`.`idbsdetail` AS `idbsdetail`,`prtd`.`idpodetail` AS `idpodetail`,`prtd`.`idipcdetail` AS `idipcdetail`,`prtd`.`idgrndetail` AS `idgrndetail`,`prtd`.`idridetail` AS `idridetail`,`prtd`.`iddnrdetail` AS `iddnrdetail`,`prtd`.`isclose` AS `isclose`,`prtd`.`customtext1` AS `customtext1`,`prtd`.`customtext2` AS `customtext2`,`prtd`.`customtext3` AS `customtext3`,`prtd`.`customdbl1` AS `customdbl1`,`prtd`.`customdbl2` AS `customdbl2`,`prtd`.`customdbl3` AS `customdbl3`,`prtd`.`customdate1` AS `customdate1`,`prtd`.`customdate2` AS `customdate2`,`prtd`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bhpp` AS `bhpp`,`i`.`bjenis` AS `bjenis`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,`t1`.`tnama` AS `pajak1nama`,`t1`.`tnilai` AS `pajak1nilai`,`t2`.`tnama` AS `pajak2nama`,`t2`.`tnilai` AS `pajak2nilai`,`brd`.`bnama` AS `cabangnama`,`lcd`.`lnama` AS `lokasinama`,`whd1`.`wnama` AS `gudangasalnama`,`whd2`.`wnama` AS `gudangtransitnama`,`whd3`.`wnama` AS `gudangtujuannama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama`,`ri2`.`rinotransaksi` AS `rinotransaksi`,`dnr2`.`dnrnotransaksi` AS `dnrnotransaksi`, prt.prtjenis, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan from (((((((((((((((((((((((((((((((((((`m4_prt_history` `prt` join `m4_prt_detail_history` `prtd` on((`prt`.`prtidhistory` = `prtd`.`idhistory`))) left join `m1_branch` `br` on((`br`.`bkode` = `prt`.`prtcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `prt`.`prtlokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `prt`.`prtgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `prt`.`prtsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `prt`.`prtbagianpembelian`))) left join `m1_terms` `tr` on((`prt`.`prttermin` = `tr`.`trkode`))) left join `m1_coa` `coa1` on((`prt`.`prtrekdiskon` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`prt`.`prtrekpajak1` = `coa2`.`cnomor`))) left join `m1_coa` `coa3` on((`prt`.`prtrekpajak2` = `coa3`.`cnomor`))) left join `m1_coa` `coa4` on((`prt`.`prtrekbiayalain` = `coa4`.`cnomor`))) left join `m1_coa` `coa5` on((`prt`.`prtrekbayar` = `coa5`.`cnomor`))) left join `m1_coa` `coa6` on((`prt`.`prtreksisa` = `coa6`.`cnomor`))) left join `m4_ri` `ri` on((`prt`.`prtidri` = `ri`.`riid`))) left join `m4_dnr` `dnr` on((`prt`.`prtiddnr` = `dnr`.`dnrid`))) left join `m0_status` `st1` on((`st1`.`kode` = `prt`.`prtstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `prt`.`prtstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `prt`.`prtinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `prt`.`prtmodifikasiuser`))) left join `m1_item` `i` on((`i`.`bid` = `prtd`.`idbarang`))) left join `m1_tax` `t1` on((`prtd`.`pajak1` = `t1`.`tkode`))) left join `m1_tax` `t2` on((`prtd`.`pajak2` = `t2`.`tkode`))) left join `m4_dnr_detail` `dnrd` on((`prtd`.`iddnrdetail` = `dnrd`.`iddnrdetail`))) left join `m4_dnr` `dnr2` on((`dnrd`.`iddnr` = `dnr2`.`dnrid`))) left join `m1_branch` `brd` on((`prtd`.`cabang` = `brd`.`bkode`))) left join `m1_location` `lcd` on((`prtd`.`lokasi` = `lcd`.`lkode`))) left join `m1_warehouse` `whd1` on((`prtd`.`gudangasal` = `whd1`.`wkode`))) left join `m1_warehouse` `whd2` on((`prtd`.`gudangtransit` = `whd2`.`wkode`))) left join `m1_warehouse` `whd3` on((`prtd`.`gudangtujuan` = `whd3`.`wkode`))) left join `m1_cost_center` `cc` on((`prtd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`prtd`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`prtd`.`subdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`prtd`.`proyek` = `p`.`pkode`))) left join `m4_ri_detail` `rid` on((`prtd`.`idridetail` = `rid`.`idridetail`))) left join `m4_ri` `ri2` on((`rid`.`idri` = `ri2`.`riid`)))
```

## Query 84

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt.vb`, `client-backend/api-myerpplus/app_code/ws/m4/m4_prt_history.vb`

```sql
select atr.atid AS atid, atr.atasetid AS atasetid, atr.atjenismutasi AS atjenismutasi, atr.atsumber AS atsumber, atr.atidutama AS atidutama,atr.atidbarang AS atidbarang,atr.atkode AS atkode, atr.atnama AS atnama, atr.atkategori AS atkategori, atr.atcabang AS atcabang, atr.atlokasi AS atlokasi, atr.atgudang AS atgudang,atr.atdivisi AS atdivisi, atr.atsubdivisi AS atsubdivisi, atr.atcostcenter AS atcostcenter, atr.atproyek AS atproyek, atr.atcatatan AS atcatatan, atr.atnomor AS atnomor, atr.attglbeli AS attglbeli, atr.attglpakai AS attglpakai, atr.atjml AS atjml, atr.atsatuan AS atsatuan, atr.atmatauang AS atmatauang, atr.atkurs AS atkurs, atr.atharga AS atharga, atr.atdiskon AS atdiskon, atr.atjmldiskon AS atjmldiskon, atr.atpajak1 AS atpajak1, atr.atjmlpajak1 AS atjmlpajak1, atr.atpajak2 AS atpajak2, atr.atjmlpajak2 AS atjmlpajak2, atr.athargabeli AS athargabeli, atr.atnilairesidu AS atnilairesidu, atr.atumurekonomis AS atumurekonomis, atr.atbebanperbln AS atbebanperbln, atr.atakumulasibeban AS atakumulasibeban, atr.atnilaibuku AS atnilaibuku, (CASE WHEN atr.atnilaibuku < atr.atbebanperbln THEN atr.atnilaibuku ELSE atr.atbebanperbln END) as atnilaipenyusutan, atr.atmetode AS atmetode, atr.attabelpenyusutan AS attabelpenyusutan, atr.atintangible AS atintangible, atr.atfiskal AS atfiskal, atr.atatastengahbulan AS atatastengahbulan, atr.atrekasset AS atrekasset, atr.atrekakumdepresiasi AS atrekakumdepresiasi, atr.atrekdepresiasi AS atrekdepresiasi, atr.atrekpenghapusan AS atrekpenghapusan, atr.atprodusen AS atprodusen, atr.attglpensiun AS attglpensiun, atr.atpenyusutanke AS atpenyusutanke, atr.atnilaimenurun AS atnilaimenurun, atr.atdispose AS atdispose, atr.atpembelian AS atpembelian, atr.atpenjualan AS atpenjualan, atr.atlocked AS atlocked, atr.atstatus AS atstatus, atr.atstatussebelumnya AS atstatussebelumnya, atr.atisclose AS atisclose, atr.atinputuser AS atinputuser, atr.atinputtgl AS atinputtgl, atr.atmodifikasiuser AS atmodifikasiuser, atr.atmodifikasitgl AS atmodifikasitgl, atr.atcustomtext1,atr.atcustomtext2,atr.atcustomtext3,atr.atcustomtext4,atr.atcustomtext5,atr.atcustomint1,atr.atcustomint2,atr.atcustomint3,atr.atcustomint4,atr.atcustomint5,atr.atcustomdbl1,atr.atcustomdbl2,atr.atcustomdbl3,atr.atcustomdbl4,atr.atcustomdbl5,atr.atcustomdate1,atr.atcustomdate2,atr.atcustomdate3,atr.atcustomdate4,atr.atcustomdate5,ac.acnama AS atkategorinama, br.bnama AS atcabangnama, l.lnama AS atlokasinama, w.wnama AS atgudangnama,d.dnama AS atdivisinama, sd.sdnama AS atsubdivisinama, cc.ccnama AS atcostcenternama, p.pnama AS atproyeknama, dc.nama AS atmetodenama, t1.tnama AS atpajak1nama, ifnull(t1.tnilai, 0) AS atpajak1nilai, t2.tnama AS atpajak2nama, ifnull(t2.tnilai, 0) AS atpajak2nilai,coa1.cnama AS atrekassetnama, coa2.cnama AS atrekakumdepresiasinama, coa3.cnama AS atrekdepresiasinama, coa4.cnama AS atrekpenghapusannama, c1.kkode AS atprodusenkode, c1.knama AS atprodusennama, sp1.nama AS atstatusnama, sp2.nama AS atstatussebelumnyanama, u1.unama AS atinputusernama, u2.unama AS atmodifikasiusernama from m7_asset_transaction atr left join m7_asset_category ac on atr.atkategori = ac.ackode left join m1_branch br on atr.atcabang = br.bkode left join m1_location l on atr.atlokasi = l.lkode left join m1_warehouse w on atr.atgudang = w.wkode left join m1_division d on atr.atdivisi = d.dkode left join m1_subdivision sd on atr.atsubdivisi = sd.sdkode left join m7_depreciation_category dc on atr.atmetode = dc.kode left join m1_coa coa1 on atr.atrekasset = coa1.cnomor left join m1_coa coa2 on atr.atrekakumdepresiasi = coa2.cnomor left join m1_coa coa3 on atr.atrekdepresiasi = coa3.cnomor left join m1_coa coa4 on atr.atrekpenghapusan = coa4.cnomor left join m1_contact c1 on atr.atprodusen = c1.kid left join m0_status_progress sp1 on atr.atstatus = sp1.kode left join m0_status_progress sp2 on atr.atstatussebelumnya = sp2.kode left join m0_user u1 on atr.atinputuser = u1.userid left join m0_user u2 on atr.atmodifikasiuser = u2.userid left join m1_cost_center cc on atr.atcostcenter = cc.cckode left join m1_project p on atr.atproyek = p.pkode left join m1_tax t1 on atr.atpajak1 = t1.tkode left join m1_tax t2 on atr.atpajak2 = t2.tkode
```

## Query 85

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_prt_history.vb`

```sql
select prt.prtidhistory, `prt`.`prtid` AS `prtid`,`prt`.`prtcabang` AS `prtcabang`,`prt`.`prtlokasi` AS `prtlokasi`,`prt`.`prtgudang` AS `prtgudang`,`prt`.`prtasalbarang` AS `prtasalbarang`,`prt`.`prtasalbarangkategori` AS `prtasalbarangkategori`,`prt`.`prtjenispembelian` AS `prtjenispembelian`,`prt`.`prtjenispembeliankategori` AS `prtjenispembeliankategori`,`prt`.`prtcarabayar` AS `prtcarabayar`,`prt`.`prtsumber` AS `prtsumber`,`prt`.`prtautonotransaksi` AS `prtautonotransaksi`,`prt`.`prtnotransaksi` AS `prtnotransaksi`,`prt`.`prttgl` AS `prttgl`,`prt`.`prtkodepa` AS `prtkodepa`,`prt`.`prtsupplier` AS `prtsupplier`,`prt`.`prtsupplierkontak` AS `prtsupplierkontak`,`prt`.`prt1alamat1` AS `prt1alamat1`,`prt`.`prt1alamat2` AS `prt1alamat2`,`prt`.`prt1alamat3` AS `prt1alamat3`,`prt`.`prt2alamat1` AS `prt2alamat1`,`prt`.`prt2alamat2` AS `prt2alamat2`,`prt`.`prt2alamat3` AS `prt2alamat3`,`prt`.`prtbagianpembelian` AS `prtbagianpembelian`,`prt`.`prttermin` AS `prttermin`,`prt`.`prttgljatuhtempo` AS `prttgljatuhtempo`,`prt`.`prturaian` AS `prturaian`,`prt`.`prtcatatan` AS `prtcatatan`,`prt`.`prtnoref` AS `prtnoref`,`prt`.`prttglnoref` AS `prttglnoref`,`prt`.`prttglpenutupan` AS `prttglpenutupan`,`prt`.`prtmatauang` AS `prtmatauang`,`prt`.`prtkurs` AS `prtkurs`,`prt`.`prthargatermasukpajak` AS `prthargatermasukpajak`,`prt`.`prttotal` AS `prttotal`,`prt`.`prtdiskonpersen` AS `prtdiskonpersen`,`prt`.`prtjmldiskon` AS `prtjmldiskon`,`prt`.`prttotalpajak1detail` AS `prttotalpajak1detail`,`prt`.`prttotalpajak2detail` AS `prttotalpajak2detail`,`prt`.`prtbiayalainpersen` AS `prtbiayalainpersen`,`prt`.`prtbiayalain` AS `prtbiayalain`,`prt`.`prttotaltransaksi` AS `prttotaltransaksi`,`prt`.`prtsisatransaksi` AS `prtsisatransaksi`,`prt`.`prtjmlbayar` AS `prtjmlbayar`,`prt`.`prtstatuslunas` AS `prtstatuslunas`,`prt`.`prttgllunas` AS `prttgllunas`,`prt`.`prtnofakturpajak` AS `prtnofakturpajak`,`prt`.`prtsdhbayarpajak` AS `prtsdhbayarpajak`,`prt`.`prttglbayarpajak` AS `prttglbayarpajak`,`prt`.`prtrekdiskon` AS `prtrekdiskon`,`prt`.`prtrekpajak1` AS `prtrekpajak1`,`prt`.`prtrekpajak2` AS `prtrekpajak2`,`prt`.`prtrekbiayalain` AS `prtrekbiayalain`,`prt`.`prtrekbayar` AS `prtrekbayar`,`prt`.`prtreksisa` AS `prtreksisa`,`prt`.`prtidpr` AS `prtidpr`,`prt`.`prtidcs` AS `prtidcs`,`prt`.`prtidrq` AS `prtidrq`,`prt`.`prtidbs` AS `prtidbs`,`prt`.`prtidpo` AS `prtidpo`,`prt`.`prtidipc` AS `prtidipc`,`prt`.`prtidgrn` AS `prtidgrn`,`prt`.`prtidri` AS `prtidri`,`prt`.`prtiddnr` AS `prtiddnr`,`prt`.`prtstatus` AS `prtstatus`,`prt`.`prtstatussebelumnya` AS `prtstatussebelumnya`,`prt`.`prtjmlrevisi` AS `prtjmlrevisi`,`prt`.`prtcetakanke` AS `prtcetakanke`,`prt`.`prtinputuser` AS `prtinputuser`,`prt`.`prtinputtgl` AS `prtinputtgl`,`prt`.`prtmodifikasiuser` AS `prtmodifikasiuser`,`prt`.`prtmodifikasitgl` AS `prtmodifikasitgl`,`prt`.`prtposting` AS `prtposting`,`prt`.`prtpostingtgl` AS `prtpostingtgl`,`prt`.`prttutupperiode` AS `prttutupperiode`,`prt`.`prtisclose` AS `prtisclose`,`br`.`bnama` AS `prtcabangnama`,`lc`.`lnama` AS `prtlokasinama`,`wh`.`wnama` AS `prtgudangnama`,`c1`.`kkode` AS `prtsupplierkode`,`c1`.`knama` AS `prtsuppliernama`,`c2`.`kkode` AS `prtbagianpembeliankode`,`c2`.`knama` AS `prtbagianpembeliannama`,`ri`.`rinotransaksi` AS `rinotransaksi`,`dnr`.`dnrnotransaksi` AS `dnrnotransaksi`,`st1`.`nama` AS `prtstatusnama`,`st2`.`nama` AS `prtstatussebelumnyanama`,`u1`.`unama` AS `prtinputusernama`,`u2`.`unama` AS `prtmodifikasiusernama`, `prt`.`prtcustomtext1` AS `prtcustomtext1`, `prt`.`prtcustomtext2` AS `prtcustomtext2`, `prt`.`prtcustomtext3` AS `prtcustomtext3`, `prt`.`prtcustomtext4` AS `prtcustomtext4`, `prt`.`prtcustomtext5` AS `prtcustomtext5`, `prt`.`prtcustomint1` AS `prtcustomint1`, `prt`.`prtcustomint2` AS `prtcustomint2`, `prt`.`prtcustomint3` AS `prtcustomint3`, `prt`.`prtcustomdbl1` AS `prtcustomdbl1`, `prt`.`prtcustomdbl2` AS `prtcustomdbl2`, `prt`.`prtcustomdbl3` AS `prtcustomdbl3`, `prt`.`prtcustomdate1` AS `prtcustomdate1`, `prt`.`prtcustomdate2` AS `prtcustomdate2`, `prt`.`prtcustomdate3` AS `prtcustomdate3`, cdis.cnama AS prtrekdiskonnama, cpa.cnama AS prtrekpajak1nama, cpa2.cnama AS prtrekpajak2nama, cba.cnama AS prtrekbiayalainnama from (((((((((((`m4_prt_history` `prt` left join `m1_branch` `br` on((`br`.`bkode` = `prt`.`prtcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `prt`.`prtlokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `prt`.`prtgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `prt`.`prtsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `prt`.`prtbagianpembelian`))) left join `m4_ri` `ri` on((`prt`.`prtidri` = `ri`.`riid`))) left join `m4_dnr` `dnr` on((`prt`.`prtid` = `dnr`.`dnrid`))) left join `m0_status` `st1` on((`st1`.`kode` = `prt`.`prtstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `prt`.`prtstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `prt`.`prtinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `prt`.`prtmodifikasiuser`))) LEFT JOIN m1_coa cdis ON cdis.cnomor = prt.prtrekdiskon LEFT JOIN m1_coa cpa ON cpa.cnomor = prt.prtrekpajak1 LEFT JOIN m1_coa cpa2 ON cpa2.cnomor = prt.prtrekpajak2 LEFT JOIN m1_coa cba ON cba.cnomor = prt.prtrekbiayalain
```

