# M4_RI Queries

## Query 1

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
DELETE FROM M2_Transaction_Journal WHERE tsumber = 'RI' AND tidtransaksi = '{idtransaksi}' AND tnotransaksi = '{notransaksi}'
```

## Query 2

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
DELETE FROM M4_Ri WHERE riid ='{idtransaksi}'
```

## Query 3

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
DELETE FROM M4_Ri_Cost WHERE idri ='{idtransaksi}'
```

## Query 4

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
DELETE FROM M4_Ri_Detail WHERE idri ='{idtransaksi}'
```

## Query 5

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
DELETE FROM M4_ri_Pay WHERE idri ='{idtransaksi}'
```

## Query 6

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
DELETE FROM m1_cogs_fifo_in WHERE {ftHppF}
```

## Query 7

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
DELETE FROM m1_cogs_special_in WHERE {ftHppI}
```

## Query 8

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
DELETE FROM m1_item_transaction WHERE sumber = '{sumber}' AND idutama = '{idtransaksi}'
```

## Query 9

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
DELETE FROM m1_no_batch_in WHERE nbisumber = '{sumber}' AND nbiidtransaksi = '{idtransaksi}'
```

## Query 10

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
DELETE FROM m1_no_serial_in WHERE nsisumber = '{sumber}' AND nsiidtransaksi = '{idtransaksi}'
```

## Query 11

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
DELETE a FROM m7_asset_transaction atr JOIN m4_ri ri ON atr.atsumber = ri.risumber AND atr.atidutama = ri.riid AND ri.riid = '{idtransaksi}' JOIN m7_asset a ON atr.atkode = a.akode
```

## Query 12

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Delete from M1_No_Batch_Transaction where nbtidtransaksi = '{idtransaksi}' AND nbtsumber = '{sumber}'
```

## Query 13

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Delete from M1_No_Batch_Transaction where nbtidtransaksi = '{result_4}' AND nbtsumber = 'RI'
```

## Query 14

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Delete from M1_No_Serial_Transaction where nstidtransaksi = '{idtransaksi}' AND nstsumber = '{sumber}'
```

## Query 15

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Delete from M1_No_Serial_Transaction where nstidtransaksi = '{result_4}' AND nstsumber = 'RI'
```

## Query 16

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Delete from M4_Ri_Cost where idri = {result_4}
```

## Query 17

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Delete from M4_Ri_Detail where idri = '{result_4}'
```

## Query 18

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Delete from M4_ri_Pay where idri = '{result_4}'
```

## Query 19

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Delete from M7_Asset_Transaction where atidutama = '{idtransaksi}' AND atsumber = '{sumber}'
```

## Query 20

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Delete from M7_Asset_Transaction where atidutama = '{result_4}' AND atsumber = 'RI'
```

## Query 21

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
INSERT INTO m1_item_booking_po (idbarang, gudang, jmlbooking) VALUES {updStokInBooking} ON DUPLICATE KEY UPDATE jmlbooking = jmlbooking + VALUES(jmlbooking)
```

## Query 22

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
INSERT INTO m1_item_booking_po (idbarang, gudang, jmlbooking) VALUES {updStokOutBooking} ON DUPLICATE KEY UPDATE jmlbooking = jmlbooking + VALUES(jmlbooking)
```

## Query 23

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
INSERT INTO m1_item_stock_warehouse (idbarang, kgudang, stok) VALUES ('{idbarang}','{gudang}','{jmlbarang}') ON DUPLICATE KEY UPDATE stok = stok + VALUES(stok)
```

## Query 24

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
INSERT INTO m1_item_stock_warehouse (idbarang, kgudang, stok) VALUES {updStokOut} ON DUPLICATE KEY UPDATE stok = stok + VALUES(stok)
```

## Query 25

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri_history.vb`

```sql
INSERT INTO m1_no_batch_transaction_history(SELECT 0, '{result_4}', nb.* FROM m1_no_batch_transaction nb WHERE nb.nbtidtransaksi = '{idtransaksi}' and nb.nbtsumber = 'RI')
```

## Query 26

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri_history.vb`

```sql
INSERT INTO m1_no_serial_transaction_history(SELECT 0, '{result_4}', ns.* FROM m1_no_serial_transaction ns WHERE ns.nstidtransaksi = '{idtransaksi}' and ns.nstsumber = 'RI')
```

## Query 27

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri_history.vb`

```sql
INSERT INTO m4_ri_cost_history (SELECT 0, '{result_4}', ri.* FROM m4_ri_cost ri WHERE ri.idri = '{idtransaksi}' )
```

## Query 28

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri_history.vb`

```sql
INSERT INTO m4_ri_detail_history (SELECT 0, '{result_4}', ri.* FROM m4_ri_detail ri WHERE ri.idri = '{idtransaksi}' )
```

## Query 29

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri_history.vb`

```sql
INSERT INTO m4_ri_history(SELECT 0, ri.* FROM m4_ri ri WHERE ri.riid = '{idtransaksi}')
```

## Query 30

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri_history.vb`

```sql
INSERT INTO m4_ri_pay_history (SELECT 0, '{result_4}', ri.* FROM m4_ri_pay ri WHERE ri.idri = '{idtransaksi}' )
```

## Query 31

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri_history.vb`

```sql
INSERT INTO m7_asset_transaction_history(SELECT 0, '{result_4}', atr.* FROM m7_asset_transaction atr WHERE atr.atidutama = '{idtransaksi}' and atr.atsumber = 'RI')
```

## Query 32

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Insert into M0_Msmq_Cogs(mcid, mcsumber, mcidtransaksi, mcprogress, mcpesan, mctglantrian, mctglselesai, mcuserid) values ('{mjid}', '{sumber}', '{result_4}', '{0}', '', NOW(), '1971-01-01 00:00:00', '{userid}')
```

## Query 33

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Insert into M0_Msmq_Journal(mjid, mjsumber, mjidtransaksi, mjprogress, mjpesan, mjtglantrian, mjtglselesai, mjuserid) values ('{mjid}', '{sumber}', '{result_4}', '{0}', '', NOW(), '1971-01-01 00:00:00', '{userid}')
```

## Query 34

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Insert into M0_Userlog (uluserid, ulidmodule, ulidmenu, uljenisaktivitas, ulaktivitas, ultgl, ulkodepa) values({userid}, {mdlid}, {mnid}, {jnsaktivitas}, '{notransaksi}', NOW(), {0})
```

## Query 35

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Insert into M1_Item_Transaction (id, cabang, lokasi, gudang, kodepa, jenismutasi, sumber, idutama, iddetail, notransaksi, tgl, kontak, idbarang, namabarang, tipebarang, tipehpp, jml, satuan, jmlbarang, satuanbarang, matauang, kurs, harga, diskon, jmldiskon, idhppikm, idhppikk, hpp, uraian, catatan, catatandetail, costcenter, divisi, subdivisi, proyek, saldojml, saldohpp, saldonilai, inputtgl, inputuser, postingtgl, updatehpp, postinghpp, hppfix, postingjurnal, jurnalfix, tutupperiode, isclose, customtext1, customtext2, customtext3, customtext4, customtext5, customtext6, customtext7, customtext8, customtext9, customtext10, customint1, customint2, customint3, customint4, customint5, customint6, customint7, customint8, customint9, customint10, customdbl1, customdbl2, customdbl3, customdbl4, customdbl5, customdbl6, customdbl7, customdbl8, customdbl9, customdbl10, customdate1, customdate2, customdate3, customdate4, customdate5, customdate6, customdate7, customdate8, customdate9, customdate10) values{strTransaksiBarang.ToString}
```

## Query 36

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Insert into M1_No_Batch_In(nbiidbatchin, nbigudang, nbiidbarang, nbikode, nbisumber, nbiidtransaksi, nbisatuan, nbijmlmasuk, nbijmlkeluar, nbijmlsisa, nbiisclose, nbicustomtext1, nbicustomtext2, nbicustomtext3, nbicustomdbl1, nbicustomdbl2, nbicustomdbl3, nbicustomdate1, nbicustomdate2, nbicustomdate3) values{strValue2.ToString}
```

## Query 37

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Insert into M1_No_Batch_Transaction(nbtid, nbtjenismutasi, nbtidbatchin, nbtgudang, nbtidbarang, nbtkode, nbtsumber, nbtidtransaksi, nbtsatuan, nbtjml, nbtcustomtext1, nbtcustomtext2, nbtcustomtext3, nbtcustomdbl1, nbtcustomdbl2, nbtcustomdbl3, nbtcustomdate1, nbtcustomdate2, nbtcustomdate3) values{strValue2.ToString}
```

## Query 38

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Insert into M1_No_Serial_In(nsiidserialin, nsigudang, nsiidbarang, nsikode, nsisumber, nsiidtransaksi, nsisatuan, nsijmlmasuk, nsijmlkeluar, nsijmlsisa, nsiisclose, nsicustomtext1, nsicustomtext2, nsicustomtext3, nsicustomdbl1, nsicustomdbl2, nsicustomdbl3, nsicustomdate1, nsicustomdate2, nsicustomdate3) values{strValue2.ToString}
```

## Query 39

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Insert into M1_No_Serial_Transaction(nstid, nstjenismutasi, nstidserialin, nstgudang, nstidbarang, nstkode, nstsumber, nstidtransaksi, nstsatuan, nstjml, nstcustomtext1, nstcustomtext2, nstcustomtext3, nstcustomdbl1, nstcustomdbl2, nstcustomdbl3, nstcustomdate1, nstcustomdate2, nstcustomdate3) values{strValue2.ToString}
```

## Query 40

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Insert into M4_Ri (ricabang, rilokasi, rigudang, riasalbarang, riasalbarangkategori, rijenispembelian, rijenispembeliankategori, ricarabayar, risumber, riautonotransaksi, rinotransaksi, ritgl, rikodepa, risupplier, risupplierkontak, ri1alamat1, ri1alamat2, ri1alamat3, ri2alamat1, ri2alamat2, ri2alamat3, ribagianpembelian, ritermin, ritgljatuhtempo, riuraian, ricatatan, rinoref, ritglnoref, ritglpenutupan, rimatauang, rikurs, rihargatermasukpajak, ritotal, ridiskonpersen, rijmldiskon, ritotalpajak1detail, ritotalpajak2detail, ribiayalainpersen, ribiayalain, ritotaltransaksi, rijmlbayar, ristatuslunas, ritgllunas, rinofakturpajak, risdhbayarpajak, ritglbayarpajak, rirekdiskon, rirekpajak1, rirekpajak2, rirekbiayalain, rirekbayar, riidpr, riidcs, riidrq, riidbs, riidpo, riidipc, riidgrn, ristatusdnr, ristatusprt, ristatus, ristatussebelumnya, rijmlrevisi, ricetakanke, riinputuser, riinputtgl, rimodifikasiuser, rimodifikasitgl, riposting, ritutupperiode, riisclose, ricustomtext1, ricustomtext2, ricustomtext3, ricustomtext4, ricustomtext5, ricustomint1, ricustomint2, ricustomint3, ricustomdbl1, ricustomdbl2, ricustomdbl3, ricustomdate1, ricustomdate2, ricustomdate3) values('{ricabang}', '{rilokasi}', '{rigudang}', '{riasalbarang}', {riasalbarangkategori}, '{rijenispembelian}', {rijenispembeliankategori}, {ricarabayar}, '{risumber}', {riautonotransaksi}, '{notransaksi}', '{ritgl}', {rikodepa}, {risupplier}, '{risupplierkontak}', '{ri1alamat1}', '{ri1alamat2}', '{ri1alamat3}', '{ri2alamat1}', '{ri2alamat2}', '{ri2alamat3}', {ribagianpembelian}, '{ritermin}', '{ritgljatuhtempo}', '{riuraian}', '{ricatatan}', '{rinoref}', '{ritglnoref}', '{ritglpenutupan}', '{rimatauang}', '{rikurs}', {rihargatermasukpajak}, '{ritotal}', '{ridiskonpersen}', '{rijmldiskon}', '{ritotalpajak1detail}', '{ritotalpajak2detail}', '{ribiayalainpersen}', '{ribiayalain}', '{ritotaltransaksi}', '{rijmlbayar}', {ristatuslunas}, '{ritgllunas}', '{rinofakturpajak}', {risdhbayarpajak}, '{ritglbayarpajak}', '{rirekdiskon}', '{rirekpajak1}', '{rirekpajak2}', '{rirekbiayalain}', '{rirekbayar}', {riidpr}, {riidcs}, {riidrq}, {riidbs}, {riidpo}, {riidipc}, {riidgrn}, {ristatusdnr}, {ristatusprt}, {ristatus}, {ristatussebelumnya}, {rijmlrevisi}, {ricetakanke}, {riinputuser}, NOW(), {rimodifikasiuser}, '1971-01-01 00:00:00', 0, {ritutupperiode}, {riisclose}, '{ricustomtext1}', '{ricustomtext2}', '{ricustomtext3}', '{ricustomtext4}', '{ricustomtext5}', {ricustomint1}, {ricustomint2}, {ricustomint3}, '{ricustomdbl1}', '{ricustomdbl2}', '{ricustomdbl3}', '{ricustomdate1}', '{ricustomdate2}', '{ricustomdate3}')
```

## Query 41

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Insert into M4_Ri (ricabang, rilokasi, rigudang, riasalbarang, riasalbarangkategori, rijenispembelian, rijenispembeliankategori, ricarabayar, risumber, riautonotransaksi, rinotransaksi, ritgl, rikodepa, risupplier, risupplierkontak, ri1alamat1, ri1alamat2, ri1alamat3, ri2alamat1, ri2alamat2, ri2alamat3, ribagianpembelian, ritermin, ritgljatuhtempo, riuraian, ricatatan, rinoref, ritglnoref, ritglpenutupan, rimatauang, rikurs, rihargatermasukpajak, ritotal, ridiskonpersen, rijmldiskon, ritotalpajak1detail, ritotalpajak2detail, ribiayalainpersen, ribiayalain, ritotaltransaksi, rijmlbayar, ristatuslunas, ritgllunas, rinofakturpajak, risdhbayarpajak, ritglbayarpajak, rirekdiskon, rirekpajak1, rirekpajak2, rirekbiayalain, rirekbayar, riidpr, riidcs, riidrq, riidbs, riidpo, riidipc, riidgrn, ristatusdnr, ristatusprt, ristatus, ristatussebelumnya, rijmlrevisi, ricetakanke, riinputuser, riinputtgl, rimodifikasiuser, rimodifikasitgl, riposting, ritutupperiode, riisclose, ricustomtext1, ricustomtext2, ricustomtext3, ricustomtext4, ricustomtext5, ricustomint1, ricustomint2, ricustomint3, ricustomdbl1, ricustomdbl2, ricustomdbl3, ricustomdate1, ricustomdate2, ricustomdate3, rijmluangmuka, rirekuangmuka, riidap) values('{ricabang}', '{rilokasi}', '{rigudang}', '{riasalbarang}', {riasalbarangkategori}, '{rijenispembelian}', {rijenispembeliankategori}, {ricarabayar}, '{risumber}', {riautonotransaksi}, '{notransaksi}', '{ritgl}', {rikodepa}, {risupplier}, '{risupplierkontak}', '{ri1alamat1}', '{ri1alamat2}', '{ri1alamat3}', '{ri2alamat1}', '{ri2alamat2}', '{ri2alamat3}', {ribagianpembelian}, '{ritermin}', '{ritgljatuhtempo}', '{riuraian}', '{ricatatan}', '{rinoref}', '{ritglnoref}', '{ritglpenutupan}', '{rimatauang}', '{rikurs}', {rihargatermasukpajak}, '{ritotal}', '{ridiskonpersen}', '{rijmldiskon}', '{ritotalpajak1detail}', '{ritotalpajak2detail}', '{ribiayalainpersen}', '{ribiayalain}', '{ritotaltransaksi}', '{rijmlbayar}', {ristatuslunas}, '{ritgllunas}', '{rinofakturpajak}', {risdhbayarpajak}, '{ritglbayarpajak}', '{rirekdiskon}', '{rirekpajak1}', '{rirekpajak2}', '{rirekbiayalain}', '{rirekbayar}', {riidpr}, {riidcs}, {riidrq}, {riidbs}, {riidpo}, {riidipc}, {riidgrn}, {ristatusdnr}, {ristatusprt}, {ristatus}, {ristatussebelumnya}, {rijmlrevisi}, {ricetakanke}, {riinputuser}, NOW(), {rimodifikasiuser}, '1971-01-01 00:00:00', 0, {ritutupperiode}, {riisclose}, '{ricustomtext1}', '{ricustomtext2}', '{ricustomtext3}', '{ricustomtext4}', '{ricustomtext5}', {ricustomint1}, {ricustomint2}, {ricustomint3}, '{ricustomdbl1}', '{ricustomdbl2}', '{ricustomdbl3}', '{ricustomdate1}', '{ricustomdate2}', '{ricustomdate3}', '{rijmluangmuka}', '{rirekuangmuka}', '{riidap}')
```

## Query 42

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Insert into M4_Ri (ricabang, rilokasi, rigudang, riasalbarang, riasalbarangkategori, rijenispembelian, rijenispembeliankategori, ricarabayar, risumber, riautonotransaksi, rinotransaksi, ritgl, rikodepa, risupplier, risupplierkontak, ri1alamat1, ri1alamat2, ri1alamat3, ri2alamat1, ri2alamat2, ri2alamat3, ribagianpembelian, ritermin, ritgljatuhtempo, riuraian, ricatatan, rinoref, ritglnoref, ritglpenutupan, rimatauang, rikurs, rihargatermasukpajak, ritotal, ridiskonpersen, rijmldiskon, ritotalpajak1detail, ritotalpajak2detail, ribiayalainpersen, ribiayalain, ritotaltransaksi, rijmlbayar, ristatuslunas, ritgllunas, rinofakturpajak, risdhbayarpajak, ritglbayarpajak, rirekdiskon, rirekpajak1, rirekpajak2, rirekbiayalain, rirekbayar, riidpr, riidcs, riidrq, riidbs, riidpo, riidipc, riidgrn, ristatusdnr, ristatusprt, ristatus, ristatussebelumnya, rijmlrevisi, ricetakanke, riinputuser, riinputtgl, rimodifikasiuser, rimodifikasitgl, riposting, ritutupperiode, riisclose, ricustomtext1, ricustomtext2, ricustomtext3, ricustomtext4, ricustomtext5, ricustomint1, ricustomint2, ricustomint3, ricustomdbl1, ricustomdbl2, ricustomdbl3, ricustomdate1, ricustomdate2, ricustomdate3, risaldoawal) values('{ricabang}', '{rilokasi}', '{rigudang}', '{riasalbarang}', {riasalbarangkategori}, '{rijenispembelian}', {rijenispembeliankategori}, {ricarabayar}, '{risumber}', {riautonotransaksi}, '{notransaksi}', '{ritgl}', {rikodepa}, {risupplier}, '{risupplierkontak}', '{ri1alamat1}', '{ri1alamat2}', '{ri1alamat3}', '{ri2alamat1}', '{ri2alamat2}', '{ri2alamat3}', {ribagianpembelian}, '{ritermin}', '{ritgljatuhtempo}', '{riuraian}', '{ricatatan}', '{rinoref}', '{ritglnoref}', '{ritglpenutupan}', '{rimatauang}', '{rikurs}', {rihargatermasukpajak}, '{ritotal}', '{ridiskonpersen}', '{rijmldiskon}', '{ritotalpajak1detail}', '{ritotalpajak2detail}', '{ribiayalainpersen}', '{ribiayalain}', '{ritotaltransaksi}', '{rijmlbayar}', {ristatuslunas}, '{ritgllunas}', '{rinofakturpajak}', {risdhbayarpajak}, '{ritglbayarpajak}', '{rirekdiskon}', '{rirekpajak1}', '{rirekpajak2}', '{rirekbiayalain}', '{rirekbayar}', {riidpr}, {riidcs}, {riidrq}, {riidbs}, {riidpo}, {riidipc}, {riidgrn}, {ristatusdnr}, {ristatusprt}, {ristatus}, {ristatussebelumnya}, {rijmlrevisi}, {ricetakanke}, {riinputuser}, NOW(), {rimodifikasiuser}, '1971-01-01 00:00:00', 0, {ritutupperiode}, {riisclose}, '{ricustomtext1}', '{ricustomtext2}', '{ricustomtext3}', '{ricustomtext4}', '{ricustomtext5}', {ricustomint1}, {ricustomint2}, {ricustomint3}, '{ricustomdbl1}', '{ricustomdbl2}', '{ricustomdbl3}', '{ricustomdate1}', '{ricustomdate2}', '{ricustomdate3}', 1)
```

## Query 43

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Insert into M4_Ri_Cost(idricost, idri, kodecost, matauang, kurs, jumlah, catatan, costcenter, divisi, subdivisi, proyek, urutan, idprcost, idcscost, idrqcost, idbscost, idpocost, idipccost, idgrncost, jumlahbayar, statusbayar, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, rekdebit, rekkredit, kontak, termasukhpp) values{strValue2.ToString}
```

## Query 44

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Insert into M4_Ri_Detail(idridetail, idri, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, hargafix, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudang, rekpersediaan, rekdiskonpembelian, rekhutangsementara, costcenter, divisi, subdivisi, proyek, catatan, urutan, idprdetail, idcsdetail, idrqdetail, idbsdetail, idpodetail, idipcdetail, idgrndetail, jmldnr, statusdnr, jmlprt, statusprt, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2.ToString}
```

## Query 45

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Insert into M4_ri_Pay(idricarabayar, idri, carabayar, matauang, kurs, jumlah, jumlahvalas, nogiro, tgljt, bank, noacbank, rekbank, rekgiro, catatan, urutan, isclose) values{strValue2.ToString}
```

## Query 46

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Insert into M4_ri_Pay(idricarabayar, idri, carabayar, matauang, kurs, jumlah, jumlahvalas, nogiro, tgljt, bank, noacbank, rekbank, rekgiro, catatan, urutan, isclose, sumber, idtransaksi, totaltransaksi, terbayar) values{strValue2.ToString}
```

## Query 47

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Insert into M7_Asset(aid, akode, anama, akategori, acabang, alokasi, agudang, adivisi, asubdivisi, acostcenter, aproyek, acatatan, anomor, atglbeli, atglpakai, ajml, asatuan, amatauang, akurs, aharga, adiskon, ajmldiskon, apajak1, ajmlpajak1, apajak2, ajmlpajak2, ahargabeli, anilairesidu, aumurekonomis, abebanperbln, aakumulasibeban, anilaibuku, ametode, atabelpenyusutan, aintangible, afiskal, aatastengahbulan, arekasset, arekakumdepresiasi, arekdepresiasi, arekpenghapusan, aprodusen, atglpensiun, apenyusutanke, anilaimenurun, adispose, apembelian, apenjualan, alocked, astatus, astatussebelumnya, aisclose, ainputuser, ainputtgl, amodifikasiuser, amodifikasitgl, acustomtext1, acustomtext2, acustomtext3, acustomtext4, acustomtext5, acustomint1, acustomint2, acustomint3, acustomint4, acustomint5, acustomdbl1, acustomdbl2, acustomdbl3, acustomdbl4, acustomdbl5, acustomdate1, acustomdate2, acustomdate3, acustomdate4, acustomdate5, aidbarang) values{strValue2.ToString}
```

## Query 48

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Insert into M7_Asset_Transaction(atid, atasetid, atjenismutasi, atsumber, atidutama, atidbarang, atkode, atnama, atkategori, atcabang, atlokasi, atgudang, atdivisi, atsubdivisi, atcostcenter, atproyek, atcatatan, atnomor, attglbeli, attglpakai, atjml, atsatuan, atmatauang, atkurs, atharga, atdiskon, atjmldiskon, atpajak1, atjmlpajak1, atpajak2, atjmlpajak2, athargabeli, atnilairesidu, atumurekonomis, atbebanperbln, atakumulasibeban, atnilaibuku, atmetode, attabelpenyusutan, atintangible, atfiskal, atatastengahbulan, atrekasset, atrekakumdepresiasi, atrekdepresiasi, atrekpenghapusan, atprodusen, attglpensiun, atpenyusutanke, atnilaimenurun, atdispose, atpembelian, atpenjualan, atlocked, atstatus, atstatussebelumnya, atisclose, atinputuser, atinputtgl, atmodifikasiuser, atmodifikasitgl, atcustomtext1, atcustomtext2, atcustomtext3, atcustomtext4, atcustomtext5, atcustomint1, atcustomint2, atcustomint3, atcustomint4, atcustomint5, atcustomdbl1, atcustomdbl2, atcustomdbl3, atcustomdbl4, atcustomdbl5, atcustomdate1, atcustomdate2, atcustomdate3, atcustomdate4, atcustomdate5, atnotransaksi, attgl) values{strValue2.ToString}
```

## Query 49

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
SELECT `Ap`.Apid, `Ap`.Apsumber, `Ap`.Apnotransaksi, `Ap`.Apmatauang, (CASE `Ap`.Apmatauang WHEN s.snilai THEN `Ap`.Apjumlah - `Ap`.Apjumlahbayar ELSE `Ap`.Apjumlahvalas - `Ap`.Apjumlahbayarvalas END) Apsisatransaksi FROM m4_Ap `Ap` LEFT JOIN m0_setting s ON s.smodule =0 AND s.sgrup='accounting' AND s.skode = 'MataUangFungsional' WHERE {ftOutstandingAP}
```

## Query 50

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
SELECT bstok FROM m1_item WHERE bid = '{idbarang}'
```

## Query 51

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
SELECT grn.grnnotransaksi as notransaksi, (CASE grn.grnhargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m4_grn_detail grnd JOIN m4_grn grn ON grnd.idgrn = grn.grnid WHERE {ftGRN} GROUP BY grn.grnhargatermasukpajak
```

## Query 52

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
SELECT grnd.idgrndetail, (grnd.jmlbarang - grnd.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m4_grn_detail AS grnd INNER JOIN m1_item AS i ON grnd.idbarang = i.bid WHERE {ftOutstandingGRN}
```

## Query 53

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
SELECT i.bkode, grnd.idgrndetail, grn.grnnotransaksi as notransaksi, (CASE grn.grnhargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m4_grn_detail grnd JOIN m4_grn grn ON grnd.idgrn = grn.grnid JOIN m1_item i ON grnd.idbarang = i.bid WHERE ({ftGRN}) AND grn.grnhargatermasukpajak <> {termasukPajak} ORDER BY grnd.urutan
```

## Query 54

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
SELECT i.bkode, pod.idpodetail, po.ponotransaksi as notransaksi, (CASE po.pohargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m4_po_detail pod JOIN m4_po po ON pod.idpo = po.poid JOIN m1_item i ON pod.idbarang = i.bid WHERE ({ftPO}) AND po.pohargatermasukpajak <> {termasukPajak} ORDER BY pod.urutan
```

## Query 55

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
SELECT isw.idbarang, isw.kgudang, isw.stok, i.bkode FROM m1_item_stock_warehouse isw JOIN m1_item i ON isw.idbarang = i.bid AND i.bjenis <> 'J' WHERE {ftStok}
```

## Query 56

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
SELECT po.ponotransaksi as notransaksi, (CASE po.pohargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m4_po_detail pod JOIN m4_po po ON pod.idpo = po.poid WHERE {ftPO} GROUP BY po.pohargatermasukpajak
```

## Query 57

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
SELECT pod.idpodetail, (pod.jmlbarang - pod.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m4_po_detail AS pod INNER JOIN m1_item AS i ON pod.idbarang = i.bid WHERE {ftOutstandingPO}
```

## Query 58

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri_history.vb`

```sql
SELECT rc.idhistorycost, rc.idhistory, rc.idricost, rc.idri, rc.kodecost, rc.matauang, rc.kurs, rc.jumlah, rc.rekdebit, rc.rekkredit, rc.catatan, rc.costcenter, rc.divisi, rc.subdivisi, rc.proyek, rc.urutan, rc.idprcost, rc.idcscost, rc.idrqcost, rc.idbscost, rc.idpocost, rc.idipccost, rc.idgrncost, rc.jumlahbayar, rc.statusbayar, rc.isclose, rc.customtext1, rc.customtext2, rc.customtext3, rc.customdbl1, rc.customdbl2, rc.customdbl3, rc.customdate1, rc.customdate2, rc.customdate3, oc.ocnama as kodecostnama, coa1.cnama as rekdebitnama, coa2.cnama as rekkreditnama, cc.ccnama as costcenternama, d.dnama as divisinama, sd.sdnama as subdivisinama, p.pnama as proyeknama, rc.kontak, c.kkode as kontakkode, c.knama as kontaknama, rc.termasukhpp FROM m4_ri_cost_history rc JOIN m4_ri_history ri ON rc.idhistory = ri.riidhistory LEFT JOIN m1_other_cost oc ON rc.kodecost = oc.ockode LEFT JOIN m1_coa coa1 ON rc.rekdebit = coa1.cnomor LEFT JOIN m1_coa coa2 ON rc.rekkredit = coa2.cnomor LEFT JOIN m1_cost_center cc ON rc.costcenter = cc.cckode LEFT JOIN m1_division d ON rc.divisi = d.dkode LEFT JOIN m1_subdivision sd ON rc.subdivisi = sd.sdkode LEFT JOIN m1_project p ON rc.proyek = p.pkode LEFT JOIN m1_contact c ON rc.kontak = c.kid
```

## Query 59

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
SELECT rc.idricost, rc.idri, rc.kodecost, rc.matauang, rc.kurs, rc.jumlah, rc.rekdebit, rc.rekkredit, rc.catatan, rc.costcenter, rc.divisi, rc.subdivisi, rc.proyek, rc.urutan, rc.idprcost, rc.idcscost, rc.idrqcost, rc.idbscost, rc.idpocost, rc.idipccost, rc.idgrncost, rc.jumlahbayar, rc.statusbayar, rc.isclose, rc.customtext1, rc.customtext2, rc.customtext3, rc.customdbl1, rc.customdbl2, rc.customdbl3, rc.customdate1, rc.customdate2, rc.customdate3, oc.ocnama as kodecostnama, coa1.cnama as rekdebitnama, coa2.cnama as rekkreditnama, cc.ccnama as costcenternama, d.dnama as divisinama, sd.sdnama as subdivisinama, p.pnama as proyeknama, rc.kontak, c.kkode as kontakkode, c.knama as kontaknama, rc.termasukhpp FROM m4_ri_cost rc JOIN m4_ri ri ON rc.idri = ri.riid LEFT JOIN m1_other_cost oc ON rc.kodecost = oc.ockode LEFT JOIN m1_coa coa1 ON rc.rekdebit = coa1.cnomor LEFT JOIN m1_coa coa2 ON rc.rekkredit = coa2.cnomor LEFT JOIN m1_cost_center cc ON rc.costcenter = cc.cckode LEFT JOIN m1_division d ON rc.divisi = d.dkode LEFT JOIN m1_subdivision sd ON rc.subdivisi = sd.sdkode LEFT JOIN m1_project p ON rc.proyek = p.pkode LEFT JOIN m1_contact c ON rc.kontak = c.kid
```

## Query 60

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri_history.vb`

```sql
SELECT rc.idricost, rc.idri, rc.kodecost, rc.matauang, rc.kurs, rc.jumlah, rc.rekdebit, rc.rekkredit, rc.catatan, rc.costcenter, rc.divisi, rc.subdivisi, rc.proyek, rc.urutan, rc.idprcost, rc.idcscost, rc.idrqcost, rc.idbscost, rc.idpocost, rc.idipccost, rc.idgrncost, rc.jumlahbayar, rc.statusbayar, rc.isclose, rc.customtext1, rc.customtext2, rc.customtext3, rc.customdbl1, rc.customdbl2, rc.customdbl3, rc.customdate1, rc.customdate2, rc.customdate3, oc.ocnama as kodecostnama, coa1.cnama as rekdebitnama, coa2.cnama as rekkreditnama, cc.ccnama as costcenternama, d.dnama as divisinama, sd.sdnama as subdivisinama, p.pnama as proyeknama, rc.kontak, c.kkode as kontakkode, c.knama as kontaknama, rc.termasukhpp FROM m4_ri_cost rc JOIN m4_ri_history ri ON rc.idri = ri.riid LEFT JOIN m1_other_cost oc ON rc.kodecost = oc.ockode LEFT JOIN m1_coa coa1 ON rc.rekdebit = coa1.cnomor LEFT JOIN m1_coa coa2 ON rc.rekkredit = coa2.cnomor LEFT JOIN m1_cost_center cc ON rc.costcenter = cc.cckode LEFT JOIN m1_division d ON rc.divisi = d.dkode LEFT JOIN m1_subdivision sd ON rc.subdivisi = sd.sdkode LEFT JOIN m1_project p ON rc.proyek = p.pkode LEFT JOIN m1_contact c ON rc.kontak = c.kid
```

## Query 61

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
SELECT ricabang, rilokasi, risumber, riautonotransaksi, rinotransaksi, ritgl FROM M4_ri WHERE riid = '{idtransaksi}'
```

## Query 62

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri_history.vb`

```sql
SELECT riidhistory FROM m4_ri_history WHERE riid = '{idtransaksi}' ORDER BY rimodifikasitgl DESC LIMIT 1
```

## Query 63

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri_history.vb`

```sql
SELECT rip.idhistorycarabayar, rip.idhistory, rip.idricarabayar AS idricarabayar, rip.idri AS idri, rip.carabayar AS carabayar, rip.matauang AS matauang, rip.kurs AS kurs, rip.jumlah AS jumlah, rip.jumlahvalas AS jumlahvalas, rip.nogiro AS nogiro, rip.tgljt AS tgljt, rip.bank AS bank, rip.noacbank AS noacbank, rip.rekbank AS rekbank, rip.rekgiro AS rekgiro, rip.catatan AS catatan, rip.urutan AS urutan, rip.isclose AS isclose, pm.nama AS carabayarnama, b.bnama AS banknama, coa1.cnama AS rekbanknama, coa2.cnama AS rekgironama FROM m4_ri_pay_history AS rip LEFT JOIN m0_payment_method AS pm ON rip.carabayar = pm.kode LEFT JOIN m1_bank AS b ON rip.bank = b.bkode LEFT JOIN m1_coa AS coa1 ON rip.rekbank = coa1.cnomor LEFT JOIN m1_coa AS coa2 ON rip.rekgiro = coa2.cnomor
```

## Query 64

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`, `client-backend/api-myerpplus/app_code/ws/m4/m4_ri_history.vb`

```sql
SELECT rip.idricarabayar AS idricarabayar, rip.idri AS idri, rip.carabayar AS carabayar, rip.matauang AS matauang, rip.kurs AS kurs, rip.jumlah AS jumlah, rip.jumlahvalas AS jumlahvalas, rip.nogiro AS nogiro, rip.tgljt AS tgljt, rip.bank AS bank, rip.noacbank AS noacbank, rip.rekbank AS rekbank, rip.rekgiro AS rekgiro, rip.catatan AS catatan, rip.urutan AS urutan, rip.isclose AS isclose, pm.nama AS carabayarnama, b.bnama AS banknama, coa1.cnama AS rekbanknama, coa2.cnama AS rekgironama, rip.sumber, rip.idtransaksi, rip.totaltransaksi, rip.terbayar, ap.apnotransaksi as notransaksi, IFNULL(ap.aptgl,rip.tgljt) as tgl FROM M4_ri_pay AS rip LEFT JOIN m0_payment_method AS pm ON rip.carabayar = pm.kode LEFT JOIN m1_bank AS b ON rip.bank = b.bkode LEFT JOIN m1_coa AS coa1 ON rip.rekbank = coa1.cnomor LEFT JOIN m1_coa AS coa2 ON rip.rekgiro = coa2.cnomor LEFT JOIN m4_ap ap ON rip.sumber = ap.apsumber AND rip.idtransaksi = ap.apid
```

## Query 65

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
UPDATE M4_Ri SET Ristatus = {nilaiStatus}, Rimodifikasiuser='{userid}', Rimodifikasitgl = NOW(), Riposting = 0, Ripostingtgl = '1971-01-01 00:00:00', Rijmlrevisi = Rijmlrevisi + 1 WHERE Riid = '{idtransaksi}'
```

## Query 66

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
UPDATE m1_item LEFT JOIN m0_setting ON smodule = 0 AND sgrup = 'options' AND skode = 'PembelianUpdateHargaBeli' SET bstok = '{saldojml}', bhargabeli = (CASE IFNULL(snilai,0) WHEN 1 THEN '{(Double.Parse(dr1("harga")) * Double.Parse(dr1("kurs"))) - ((Double.Parse(dr1("jmldiskon")) / Double.Parse(dr1("jml"))) * Double.Parse(dr1("kurs"))) + ((Double.Parse(dr1("jmlpajak1")) / Double.Parse(dr1("jml"))) * Double.Parse(dr1("kurs"))) + ((Double.Parse(dr1("jmlpajak2")) / Double.Parse(dr1("jml"))) * Double.Parse(dr1("kurs")))}' ELSE bhargabeli END) WHERE bid = '{idbarang}'
```

## Query 67

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
UPDATE m1_item LEFT JOIN m0_setting ON smodule = 0 AND sgrup = 'options' AND skode = 'PembelianUpdateHargaBeli' SET bstok = '{saldojml}', bhargabeli = (CASE IFNULL(snilai,0) WHEN 1 THEN '{(Double.Parse(dr1("harga")) * Double.Parse(dr1("kurs"))) - ((Double.Parse(dr1("jmldiskon")) / Double.Parse(dr1("jml"))) * Double.Parse(dr1("kurs")))}' ELSE bhargabeli END) WHERE bid = '{idbarang}'
```

## Query 68

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
UPDATE m1_item SET bstok = '{saldojml}', bhargabeli = '{(Double.Parse(dr1("harga")) * Double.Parse(dr1("kurs"))) - ((Double.Parse(dr1("jmldiskon")) / Double.Parse(dr1("jml"))) * Double.Parse(dr1("kurs"))) + ((Double.Parse(dr1("jmlpajak1")) / Double.Parse(dr1("jml"))) * Double.Parse(dr1("kurs"))) + ((Double.Parse(dr1("jmlpajak2")) / Double.Parse(dr1("jml"))) * Double.Parse(dr1("kurs")))}' WHERE bid = '{idbarang}'
```

## Query 69

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
UPDATE m1_item SET bstok = '{saldojml}', bhargabeli = '{(Double.Parse(dr1("harga")) * Double.Parse(dr1("kurs"))) - ((Double.Parse(dr1("jmldiskon")) / Double.Parse(dr1("jml"))) * Double.Parse(dr1("kurs")))}' WHERE bid = '{idbarang}'
```

## Query 70

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
UPDATE m1_item SET bstok = (CASE bid {updStokBarang} ELSE bstok END) WHERE {ftStokBarang}
```

## Query 71

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
UPDATE m1_item i JOIN ( SELECT rid.idbarang, ROUND((CASE {vTotalFungsional} WHEN 0 THEN (SUM((CASE ri.rihargatermasukpajak WHEN 0 THEN ((rid.jml * rid.harga) - rid.jmldiskon) * rid.kurs ELSE ((rid.jml * rid.harga) - rid.jmldiskon - rid.jmlpajak1 - rid.jmlpajak2) * rid.kurs END))) ELSE (SUM((CASE ri.rihargatermasukpajak WHEN 0 THEN ((rid.jml * rid.harga) - rid.jmldiskon) * rid.kurs ELSE ((rid.jml * rid.harga) - rid.jmldiskon - rid.jmlpajak1 - rid.jmlpajak2) * rid.kurs END))) + (((SUM((CASE ri.rihargatermasukpajak WHEN 0 THEN ((rid.jml * rid.harga) - rid.jmldiskon) * rid.kurs ELSE ((rid.jml * rid.harga) - rid.jmldiskon - rid.jmlpajak1 - rid.jmlpajak2) * rid.kurs END))) / {vTotalFungsional}) * {vBiayaFungsional}) END), 2) as nilai, SUM(rid.jmlbarang) as jumlah FROM m4_ri_detail rid JOIN m4_ri ri ON rid.idri = ri.riid WHERE rid.idri = '{idtransaksi}' GROUP BY rid.idbarang ) as h ON i.bid = h.idbarang SET i.bhppaverage = (CASE i.bjenis WHEN 'P' THEN (CASE i.bstok WHEN 0 THEN 0 ELSE ROUND((((i.bstok + h.jumlah) * i.bhppaverage) - (h.nilai)) / (i.bstok),2) END) ELSE IFNULL(ROUND((((i.bstok + h.jumlah) * i.bhppaverage) - (h.nilai)) / (i.bstok),2),0) END)
```

## Query 72

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
UPDATE m4_Ap `Ap` JOIN m0_setting s ON s.smodule =0 AND s.sgrup='accounting' AND s.skode = 'MataUangFungsional' SET `Ap`.Apjumlahbayar = (CASE `Ap`.Apid {updNilaiAP} ELSE `Ap`.Apjumlahbayar END), `Ap`.Apjumlahbayarvalas = (CASE `Ap`.Apid {updNilaiValasAP} ELSE `Ap`.Apjumlahbayarvalas END), `Ap`.Aptgllunas = (CASE `Ap`.Apid {updTglLunasAP} ELSE `Ap`.Aptgllunas END) WHERE {updFilterAP}
```

## Query 73

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
UPDATE m4_Ap `Ap` JOIN m2_transaction_journal t ON `Ap`.Apsumber = t.tsumber AND `Ap`.Apid = t.tidtransaksi AND `Ap`.Apnotransaksi = t.tnotransaksi SET t.tstatuslunas = `Ap`.Apstatusbayar, t.ttgllunas = `Ap`.Aptgllunas WHERE {updFilterAP}
```

## Query 74

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
UPDATE m4_Ap `Ap` LEFT JOIN m2_transaction_journal t ON `Ap`.Apsumber = t.tsumber AND `Ap`.Apid = t.tidtransaksi AND `Ap`.Apnotransaksi = t.tnotransaksi SET t.tstatuslunas = `Ap`.Apstatusbayar, t.ttgllunas = `Ap`.Aptgllunas WHERE {updFilterAp}
```

## Query 75

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
UPDATE m4_Ap `Ap` SET `Ap`.Apjumlahbayar = (CASE `Ap`.Apid {updNilaiAp} ELSE `Ap`.Apjumlahbayar END), `Ap`.Apjumlahbayarvalas = (CASE `Ap`.Apid {updNilaiValasAp} ELSE `Ap`.Apjumlahbayarvalas END), `Ap`.Aptgllunas = '{tglLunas}' WHERE {updFilterAp}
```

## Query 76

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
UPDATE m4_grn SET grnstatusrealisasi = (CASE grnid {updNilaiGRN} ELSE grnstatusrealisasi END) WHERE {updFilterGRN}
```

## Query 77

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
UPDATE m4_grn_detail SET jmlrealisasi = (CASE idgrndetail {updNilaiGRN} ELSE jmlrealisasi END) WHERE {updFilterGRN}
```

## Query 78

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
UPDATE m4_po SET postatusrealisasi = (CASE poid {updNilaiPO} ELSE postatusrealisasi END) WHERE {updFilterPO}
```

## Query 79

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
UPDATE m4_po_detail SET jmlrealisasi = (CASE idpodetail {updNilaiPO} ELSE jmlrealisasi END) WHERE {updFilterPO}
```

## Query 80

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Update M4_Ri set ricabang = '{ricabang}', rilokasi = '{rilokasi}', rigudang = '{rigudang}', riasalbarang = '{riasalbarang}', riasalbarangkategori = {riasalbarangkategori}, rijenispembelian = '{rijenispembelian}', rijenispembeliankategori = {rijenispembeliankategori}, ricarabayar = {ricarabayar}, risumber = '{risumber}', riautonotransaksi = {riautonotransaksi}, rinotransaksi = '{notransaksi}', ritgl = '{ritgl}', rikodepa = {rikodepa}, risupplier = {risupplier}, risupplierkontak = '{risupplierkontak}', ri1alamat1 = '{ri1alamat1}', ri1alamat2 = '{ri1alamat2}', ri1alamat3 = '{ri1alamat3}', ri2alamat1 = '{ri2alamat1}', ri2alamat2 = '{ri2alamat2}', ri2alamat3 = '{ri2alamat3}', ribagianpembelian = {ribagianpembelian}, ritermin = '{ritermin}', ritgljatuhtempo = '{ritgljatuhtempo}', riuraian = '{riuraian}', ricatatan = '{ricatatan}', rinoref = '{rinoref}', ritglnoref = '{ritglnoref}', ritglpenutupan = '{ritglpenutupan}', rimatauang = '{rimatauang}', rikurs = '{rikurs}', rihargatermasukpajak = {rihargatermasukpajak}, ritotal = '{ritotal}', ridiskonpersen = '{ridiskonpersen}', rijmldiskon = '{rijmldiskon}', ritotalpajak1detail = '{ritotalpajak1detail}', ritotalpajak2detail = '{ritotalpajak2detail}', ribiayalainpersen = '{ribiayalainpersen}', ribiayalain = '{ribiayalain}', ritotaltransaksi = '{ritotaltransaksi}', rijmlbayar = '{rijmlbayar}', ristatuslunas = {ristatuslunas}, ritgllunas = '{ritgllunas}', rinofakturpajak = '{rinofakturpajak}', risdhbayarpajak = {risdhbayarpajak}, ritglbayarpajak = '{ritglbayarpajak}', rirekdiskon = '{rirekdiskon}', rirekpajak1 = '{rirekpajak1}', rirekpajak2 = '{rirekpajak2}', rirekbiayalain = '{rirekbiayalain}', rirekbayar = '{rirekbayar}', riidpr = {riidpr}, riidcs = {riidcs}, riidrq = {riidrq}, riidbs = {riidbs}, riidpo = {riidpo}, riidipc = {riidipc}, riidgrn = {riidgrn}, ristatusdnr = {ristatusdnr}, ristatusprt = {ristatusprt}, ristatus = {ristatus}, ristatussebelumnya = {ristatussebelumnya}, rijmlrevisi = rijmlrevisi+1, ricetakanke = {ricetakanke}, rimodifikasiuser = {rimodifikasiuser}, rimodifikasitgl = NOW(), riposting = 0, ritutupperiode = {ritutupperiode}, ricustomtext1 = '{ricustomtext1}', ricustomtext2 = '{ricustomtext2}', ricustomtext3 = '{ricustomtext3}', ricustomtext4 = '{ricustomtext4}', ricustomtext5 = '{ricustomtext5}', ricustomint1 = {ricustomint1}, ricustomint2 = {ricustomint2}, ricustomint3 = {ricustomint3}, ricustomdbl1 = '{ricustomdbl1}', ricustomdbl2 = '{ricustomdbl2}', ricustomdbl3 = '{ricustomdbl3}', ricustomdate1 = '{ricustomdate1}', ricustomdate2 = '{ricustomdate2}', ricustomdate3 = '{ricustomdate3}' where riid = '{riid}'
```

## Query 81

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Update M4_Ri set ricabang = '{ricabang}', rilokasi = '{rilokasi}', rigudang = '{rigudang}', riasalbarang = '{riasalbarang}', riasalbarangkategori = {riasalbarangkategori}, rijenispembelian = '{rijenispembelian}', rijenispembeliankategori = {rijenispembeliankategori}, ricarabayar = {ricarabayar}, risumber = '{risumber}', riautonotransaksi = {riautonotransaksi}, rinotransaksi = '{notransaksi}', ritgl = '{ritgl}', rikodepa = {rikodepa}, risupplier = {risupplier}, risupplierkontak = '{risupplierkontak}', ri1alamat1 = '{ri1alamat1}', ri1alamat2 = '{ri1alamat2}', ri1alamat3 = '{ri1alamat3}', ri2alamat1 = '{ri2alamat1}', ri2alamat2 = '{ri2alamat2}', ri2alamat3 = '{ri2alamat3}', ribagianpembelian = {ribagianpembelian}, ritermin = '{ritermin}', ritgljatuhtempo = '{ritgljatuhtempo}', riuraian = '{riuraian}', ricatatan = '{ricatatan}', rinoref = '{rinoref}', ritglnoref = '{ritglnoref}', ritglpenutupan = '{ritglpenutupan}', rimatauang = '{rimatauang}', rikurs = '{rikurs}', rihargatermasukpajak = {rihargatermasukpajak}, ritotal = '{ritotal}', ridiskonpersen = '{ridiskonpersen}', rijmldiskon = '{rijmldiskon}', ritotalpajak1detail = '{ritotalpajak1detail}', ritotalpajak2detail = '{ritotalpajak2detail}', ribiayalainpersen = '{ribiayalainpersen}', ribiayalain = '{ribiayalain}', ritotaltransaksi = '{ritotaltransaksi}', rijmlbayar = '{rijmlbayar}', ristatuslunas = {ristatuslunas}, ritgllunas = '{ritgllunas}', rinofakturpajak = '{rinofakturpajak}', risdhbayarpajak = {risdhbayarpajak}, ritglbayarpajak = '{ritglbayarpajak}', rirekdiskon = '{rirekdiskon}', rirekpajak1 = '{rirekpajak1}', rirekpajak2 = '{rirekpajak2}', rirekbiayalain = '{rirekbiayalain}', rirekbayar = '{rirekbayar}', riidpr = {riidpr}, riidcs = {riidcs}, riidrq = {riidrq}, riidbs = {riidbs}, riidpo = {riidpo}, riidipc = {riidipc}, riidgrn = {riidgrn}, ristatusdnr = {ristatusdnr}, ristatusprt = {ristatusprt}, ristatus = {ristatus}, ristatussebelumnya = {ristatussebelumnya}, rijmlrevisi = rijmlrevisi+1, ricetakanke = {ricetakanke}, rimodifikasiuser = {rimodifikasiuser}, rimodifikasitgl = NOW(), riposting = 0, ritutupperiode = {ritutupperiode}, ricustomtext1 = '{ricustomtext1}', ricustomtext2 = '{ricustomtext2}', ricustomtext3 = '{ricustomtext3}', ricustomtext4 = '{ricustomtext4}', ricustomtext5 = '{ricustomtext5}', ricustomint1 = {ricustomint1}, ricustomint2 = {ricustomint2}, ricustomint3 = {ricustomint3}, ricustomdbl1 = '{ricustomdbl1}', ricustomdbl2 = '{ricustomdbl2}', ricustomdbl3 = '{ricustomdbl3}', ricustomdate1 = '{ricustomdate1}', ricustomdate2 = '{ricustomdate2}', ricustomdate3 = '{ricustomdate3}', rijmluangmuka = '{rijmluangmuka}', rirekuangmuka = '{rirekuangmuka}', riidap = '{riidap}' where riid = '{riid}'
```

## Query 82

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Update M4_Ri set ricabang = '{ricabang}', rilokasi = '{rilokasi}', rigudang = '{rigudang}', riasalbarang = '{riasalbarang}', riasalbarangkategori = {riasalbarangkategori}, rijenispembelian = '{rijenispembelian}', rijenispembeliankategori = {rijenispembeliankategori}, ricarabayar = {ricarabayar}, risumber = '{risumber}', riautonotransaksi = {riautonotransaksi}, rinotransaksi = '{notransaksi}', ritgl = '{ritgl}', rikodepa = {rikodepa}, risupplier = {risupplier}, risupplierkontak = '{risupplierkontak}', ri1alamat1 = '{ri1alamat1}', ri1alamat2 = '{ri1alamat2}', ri1alamat3 = '{ri1alamat3}', ri2alamat1 = '{ri2alamat1}', ri2alamat2 = '{ri2alamat2}', ri2alamat3 = '{ri2alamat3}', ribagianpembelian = {ribagianpembelian}, ritermin = '{ritermin}', ritgljatuhtempo = '{ritgljatuhtempo}', riuraian = '{riuraian}', ricatatan = '{ricatatan}', rinoref = '{rinoref}', ritglnoref = '{ritglnoref}', ritglpenutupan = '{ritglpenutupan}', rimatauang = '{rimatauang}', rikurs = '{rikurs}', rihargatermasukpajak = {rihargatermasukpajak}, ritotal = '{ritotal}', ridiskonpersen = '{ridiskonpersen}', rijmldiskon = '{rijmldiskon}', ritotalpajak1detail = '{ritotalpajak1detail}', ritotalpajak2detail = '{ritotalpajak2detail}', ribiayalainpersen = '{ribiayalainpersen}', ribiayalain = '{ribiayalain}', ritotaltransaksi = '{ritotaltransaksi}', rijmlbayar = '{rijmlbayar}', ristatuslunas = {ristatuslunas}, ritgllunas = '{ritgllunas}', rinofakturpajak = '{rinofakturpajak}', risdhbayarpajak = {risdhbayarpajak}, ritglbayarpajak = '{ritglbayarpajak}', rirekdiskon = '{rirekdiskon}', rirekpajak1 = '{rirekpajak1}', rirekpajak2 = '{rirekpajak2}', rirekbiayalain = '{rirekbiayalain}', rirekbayar = '{rirekbayar}', riidpr = {riidpr}, riidcs = {riidcs}, riidrq = {riidrq}, riidbs = {riidbs}, riidpo = {riidpo}, riidipc = {riidipc}, riidgrn = {riidgrn}, ristatusdnr = {ristatusdnr}, ristatusprt = {ristatusprt}, ristatus = {ristatus}, ristatussebelumnya = {ristatussebelumnya}, rijmlrevisi = rijmlrevisi+1, ricetakanke = {ricetakanke}, rimodifikasiuser = {rimodifikasiuser}, rimodifikasitgl = NOW(), riposting = 0, ritutupperiode = {ritutupperiode}, ricustomtext1 = '{ricustomtext1}', ricustomtext2 = '{ricustomtext2}', ricustomtext3 = '{ricustomtext3}', ricustomtext4 = '{ricustomtext4}', ricustomtext5 = '{ricustomtext5}', ricustomint1 = {ricustomint1}, ricustomint2 = {ricustomint2}, ricustomint3 = {ricustomint3}, ricustomdbl1 = '{ricustomdbl1}', ricustomdbl2 = '{ricustomdbl2}', ricustomdbl3 = '{ricustomdbl3}', ricustomdate1 = '{ricustomdate1}', ricustomdate2 = '{ricustomdate2}', ricustomdate3 = '{ricustomdate3}', risaldoawal = 1 where riid = '{riid}'
```

## Query 83

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
Update M4_Ri set riuraian = '{riuraian}', rinofakturpajak = '{rinofakturpajak}', rinoref = '{rinoref}', ricustomtext1 = '{ricustomtext1}' where riid = '{riid}'
```

## Query 84

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`, `client-backend/api-myerpplus/app_code/ws/m4/m4_ri_history.vb`

```sql
select `nbt`.`nbtid` AS `nbtid`,`nbt`.`nbtjenismutasi` AS `nbtjenismutasi`,`nbt`.`nbtidbatchin` AS `nbtidbatchin`,`nbt`.`nbtgudang` AS `nbtgudang`,`nbt`.`nbtidbarang` AS `nbtidbarang`,`nbt`.`nbtkode` AS `nbtkode`,`nbt`.`nbtsumber` AS `nbtsumber`,`nbt`.`nbtidtransaksi` AS `nbtidtransaksi`,`nbt`.`nbtsatuan` AS `nbtsatuan`,`nbt`.`nbtjml` AS `nbtjml`,`nbt`.`nbtcustomtext1` AS `nbtcustomtext1`,`nbt`.`nbtcustomtext2` AS `nbtcustomtext2`,`nbt`.`nbtcustomtext3` AS `nbtcustomtext3`,`nbt`.`nbtcustomdbl1` AS `nbtcustomdbl1`,`nbt`.`nbtcustomdbl2` AS `nbtcustomdbl2`,`nbt`.`nbtcustomdbl3` AS `nbtcustomdbl3`,`nbt`.`nbtcustomdate1` AS `nbtcustomdate1`,`nbt`.`nbtcustomdate2` AS `nbtcustomdate2`,`nbt`.`nbtcustomdate3` AS `nbtcustomdate3`,`i`.`bkode` AS `kodebarang` from ((`m1_no_batch_transaction` `nbt` join `m1_item` `i` on((`nbt`.`nbtidbarang` = `i`.`bid`))) left join `m1_no_batch_in` `nbi` on((`nbt`.`nbtidbatchin` = `nbi`.`nbiidbatchin`)))
```

## Query 85

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri_history.vb`

```sql
select `nbt`.`nbtidhistory` AS `nbtidhistory`, `nbt`.`nbtidtransaksihistory` AS `nbtidtransaksihistory`,`nbt`.`nbtid` AS `nbtid`,`nbt`.`nbtjenismutasi` AS `nbtjenismutasi`,`nbt`.`nbtidbatchin` AS `nbtidbatchin`,`nbt`.`nbtgudang` AS `nbtgudang`,`nbt`.`nbtidbarang` AS `nbtidbarang`,`nbt`.`nbtkode` AS `nbtkode`,`nbt`.`nbtsumber` AS `nbtsumber`,`nbt`.`nbtidtransaksi` AS `nbtidtransaksi`,`nbt`.`nbtsatuan` AS `nbtsatuan`,`nbt`.`nbtjml` AS `nbtjml`,`nbt`.`nbtcustomtext1` AS `nbtcustomtext1`,`nbt`.`nbtcustomtext2` AS `nbtcustomtext2`,`nbt`.`nbtcustomtext3` AS `nbtcustomtext3`,`nbt`.`nbtcustomdbl1` AS `nbtcustomdbl1`,`nbt`.`nbtcustomdbl2` AS `nbtcustomdbl2`,`nbt`.`nbtcustomdbl3` AS `nbtcustomdbl3`,`nbt`.`nbtcustomdate1` AS `nbtcustomdate1`,`nbt`.`nbtcustomdate2` AS `nbtcustomdate2`,`nbt`.`nbtcustomdate3` AS `nbtcustomdate3`,`i`.`bkode` AS `kodebarang` from ((`m1_no_batch_transaction_history` `nbt` join `m1_item` `i` on((`nbt`.`nbtidbarang` = `i`.`bid`))) left join `m1_no_batch_in` `nbi` on((`nbt`.`nbtidbatchin` = `nbi`.`nbiidbatchin`)))
```

## Query 86

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`, `client-backend/api-myerpplus/app_code/ws/m4/m4_ri_history.vb`

```sql
select `nst`.`nstid` AS `nstid`,`nst`.`nstjenismutasi` AS `nstjenismutasi`,`nst`.`nstidserialin` AS `nstidserialin`,`nst`.`nstgudang` AS `nstgudang`,`nst`.`nstidbarang` AS `nstidbarang`,`nst`.`nstkode` AS `nstkode`,`nst`.`nstsumber` AS `nstsumber`,`nst`.`nstidtransaksi` AS `nstidtransaksi`,`nst`.`nstsatuan` AS `nstsatuan`,`nst`.`nstjml` AS `nstjml`,`nst`.`nstcustomtext1` AS `nstcustomtext1`,`nst`.`nstcustomtext2` AS `nstcustomtext2`,`nst`.`nstcustomtext3` AS `nstcustomtext3`,`nst`.`nstcustomdbl1` AS `nstcustomdbl1`,`nst`.`nstcustomdbl2` AS `nstcustomdbl2`,`nst`.`nstcustomdbl3` AS `nstcustomdbl3`,`nst`.`nstcustomdate1` AS `nstcustomdate1`,`nst`.`nstcustomdate2` AS `nstcustomdate2`,`nst`.`nstcustomdate3` AS `nstcustomdate3`,`i`.`bkode` AS `kodebarang` from ((`m1_no_serial_transaction` `nst` join `m1_item` `i` on((`nst`.`nstidbarang` = `i`.`bid`))) left join `m1_no_serial_in` `nsi` on((`nst`.`nstidserialin` = `nsi`.`nsiidserialin`)))
```

## Query 87

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri_history.vb`

```sql
select `nst`.`nstidhistory` AS `nstidhistory`,`nst`.`nstidtransaksihistory` AS `nstidtransaksihistory`,`nst`.`nstid` AS `nstid`,`nst`.`nstjenismutasi` AS `nstjenismutasi`,`nst`.`nstidserialin` AS `nstidserialin`,`nst`.`nstgudang` AS `nstgudang`,`nst`.`nstidbarang` AS `nstidbarang`,`nst`.`nstkode` AS `nstkode`,`nst`.`nstsumber` AS `nstsumber`,`nst`.`nstidtransaksi` AS `nstidtransaksi`,`nst`.`nstsatuan` AS `nstsatuan`,`nst`.`nstjml` AS `nstjml`,`nst`.`nstcustomtext1` AS `nstcustomtext1`,`nst`.`nstcustomtext2` AS `nstcustomtext2`,`nst`.`nstcustomtext3` AS `nstcustomtext3`,`nst`.`nstcustomdbl1` AS `nstcustomdbl1`,`nst`.`nstcustomdbl2` AS `nstcustomdbl2`,`nst`.`nstcustomdbl3` AS `nstcustomdbl3`,`nst`.`nstcustomdate1` AS `nstcustomdate1`,`nst`.`nstcustomdate2` AS `nstcustomdate2`,`nst`.`nstcustomdate3` AS `nstcustomdate3`,`i`.`bkode` AS `kodebarang` from ((`m1_no_serial_transaction_history` `nst` join `m1_item` `i` on((`nst`.`nstidbarang` = `i`.`bid`))) left join `m1_no_serial_in` `nsi` on((`nst`.`nstidserialin` = `nsi`.`nsiidserialin`)))
```

## Query 88

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_ri_v`

```sql
select `ri`.`riid` AS `riid`,`ri`.`ricabang` AS `ricabang`,`ri`.`rilokasi` AS `rilokasi`,`ri`.`rigudang` AS `rigudang`,`ri`.`riasalbarang` AS `riasalbarang`,`ri`.`riasalbarangkategori` AS `riasalbarangkategori`,`ri`.`rijenispembelian` AS `rijenispembelian`,`ri`.`rijenispembeliankategori` AS `rijenispembeliankategori`,`ri`.`ricarabayar` AS `ricarabayar`,`ri`.`risumber` AS `risumber`,`ri`.`riautonotransaksi` AS `riautonotransaksi`,`ri`.`rinotransaksi` AS `rinotransaksi`,`ri`.`ritgl` AS `ritgl`,`ri`.`rikodepa` AS `rikodepa`,`ri`.`risupplier` AS `risupplier`,`ri`.`risupplierkontak` AS `risupplierkontak`,`ri`.`ri1alamat1` AS `ri1alamat1`,`ri`.`ri1alamat2` AS `ri1alamat2`,`ri`.`ri1alamat3` AS `ri1alamat3`,`ri`.`ri2alamat1` AS `ri2alamat1`,`ri`.`ri2alamat2` AS `ri2alamat2`,`ri`.`ri2alamat3` AS `ri2alamat3`,`ri`.`ribagianpembelian` AS `ribagianpembelian`,`ri`.`ritermin` AS `ritermin`,`ri`.`ritgljatuhtempo` AS `ritgljatuhtempo`,`ri`.`riuraian` AS `riuraian`,`ri`.`ricatatan` AS `ricatatan`,`ri`.`rinoref` AS `rinoref`,`ri`.`ritglnoref` AS `ritglnoref`,`ri`.`ritglpenutupan` AS `ritglpenutupan`,`ri`.`rimatauang` AS `rimatauang`,`ri`.`rikurs` AS `rikurs`,`ri`.`rihargatermasukpajak` AS `rihargatermasukpajak`,`ri`.`ritotal` AS `ritotal`,`ri`.`ridiskonpersen` AS `ridiskonpersen`,`ri`.`rijmldiskon` AS `rijmldiskon`,`ri`.`ritotalpajak1detail` AS `ritotalpajak1detail`,`ri`.`ritotalpajak2detail` AS `ritotalpajak2detail`,`ri`.`ribiayalainpersen` AS `ribiayalainpersen`,`ri`.`ribiayalain` AS `ribiayalain`,`ri`.`ritotaltransaksi` AS `ritotaltransaksi`,`ri`.`rijmlbayar` AS `rijmlbayar`,`ri`.`ristatuslunas` AS `ristatuslunas`,`ri`.`ritgllunas` AS `ritgllunas`,`ri`.`rinofakturpajak` AS `rinofakturpajak`,`ri`.`risdhbayarpajak` AS `risdhbayarpajak`,`ri`.`ritglbayarpajak` AS `ritglbayarpajak`,`ri`.`rirekdiskon` AS `rirekdiskon`,`ri`.`rirekpajak1` AS `rirekpajak1`,`ri`.`rirekpajak2` AS `rirekpajak2`,`ri`.`rirekbiayalain` AS `rirekbiayalain`,`ri`.`rirekbayar` AS `rirekbayar`,`ri`.`riidpr` AS `riidpr`,`ri`.`riidcs` AS `riidcs`,`ri`.`riidrq` AS `riidrq`,`ri`.`riidbs` AS `riidbs`,`ri`.`riidpo` AS `riidpo`,`ri`.`riidipc` AS `riidipc`,`ri`.`riidgrn` AS `riidgrn`,`ri`.`ristatusdnr` AS `ristatusdnr`,`ri`.`ristatusprt` AS `ristatusprt`,`ri`.`ristatusrealisasi` AS `ristatusrealisasi`,`ri`.`ristatus` AS `ristatus`,`ri`.`ristatussebelumnya` AS `ristatussebelumnya`,`ri`.`rijmlrevisi` AS `rijmlrevisi`,`ri`.`ricetakanke` AS `ricetakanke`,`ri`.`riinputuser` AS `riinputuser`,`ri`.`riinputtgl` AS `riinputtgl`,`ri`.`rimodifikasiuser` AS `rimodifikasiuser`,`ri`.`rimodifikasitgl` AS `rimodifikasitgl`,`ri`.`riposting` AS `riposting`,`ri`.`ripostingtgl` AS `ripostingtgl`,`ri`.`ritutupperiode` AS `ritutupperiode`,`ri`.`riisclose` AS `riisclose`,`br`.`bnama` AS `ricabangnama`,`lc`.`lnama` AS `rilokasinama`,`wh`.`wnama` AS `rigudangnama`,`c1`.`kkode` AS `risupplierkode`,`c1`.`knama` AS `risuppliernama`,`c2`.`kkode` AS `ribagianpembeliankode`,`c2`.`knama` AS `ribagianpembeliannama`,`po`.`ponotransaksi` AS `ponotransaksi`,`ipc`.`ipcnotransaksi` AS `ipcnotransaksi`,`grn`.`grnnotransaksi` AS `grnnotransaksi`,`st1`.`nama` AS `ristatusnama`,`st2`.`nama` AS `ristatussebelumnyanama`,`u1`.`unama` AS `riinputusernama`,`u2`.`unama` AS `rimodifikasiusernama`, (CASE ri.ricarabayar WHEN 0 THEN 'Cash' ELSE 'Credit' END) as ricarabayarnama from ((((((((((((`m4_ri` `ri` left join `m1_branch` `br` on((`br`.`bkode` = `ri`.`ricabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `ri`.`rilokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `ri`.`rigudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `ri`.`risupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `ri`.`ribagianpembelian`))) left join `m4_po` `po` on((`ri`.`riidpo` = `po`.`poid`))) left join `m4_ipc` `ipc` on((`ri`.`riidipc` = `ipc`.`ipcid`))) left join `m4_grn` `grn` on((`ri`.`riidgrn` = `grn`.`grnid`))) left join `m0_status` `st1` on((`st1`.`kode` = `ri`.`ristatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `ri`.`ristatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `ri`.`riinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `ri`.`rimodifikasiuser`)))
```

## Query 89

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
select `ri`.`riid` AS `riid`,`ri`.`ricabang` AS `ricabang`,`ri`.`rilokasi` AS `rilokasi`,`ri`.`rigudang` AS `rigudang`,`ri`.`riasalbarang` AS `riasalbarang`,`ri`.`riasalbarangkategori` AS `riasalbarangkategori`,`ri`.`rijenispembelian` AS `rijenispembelian`,`ri`.`rijenispembeliankategori` AS `rijenispembeliankategori`,`ri`.`ricarabayar` AS `ricarabayar`,`ri`.`risumber` AS `risumber`,`ri`.`riautonotransaksi` AS `riautonotransaksi`,`ri`.`rinotransaksi` AS `rinotransaksi`,`ri`.`ritgl` AS `ritgl`,`ri`.`rikodepa` AS `rikodepa`,`ri`.`risupplier` AS `risupplier`,`ri`.`risupplierkontak` AS `risupplierkontak`,`ri`.`ri1alamat1` AS `ri1alamat1`,`ri`.`ri1alamat2` AS `ri1alamat2`,`ri`.`ri1alamat3` AS `ri1alamat3`,`ri`.`ri2alamat1` AS `ri2alamat1`,`ri`.`ri2alamat2` AS `ri2alamat2`,`ri`.`ri2alamat3` AS `ri2alamat3`,`ri`.`ribagianpembelian` AS `ribagianpembelian`,`ri`.`ritermin` AS `ritermin`,`ri`.`ritgljatuhtempo` AS `ritgljatuhtempo`,`ri`.`riuraian` AS `riuraian`,`ri`.`ricatatan` AS `ricatatan`,`ri`.`rinoref` AS `rinoref`,`ri`.`ritglnoref` AS `ritglnoref`,`ri`.`ritglpenutupan` AS `ritglpenutupan`,`ri`.`rimatauang` AS `rimatauang`,`ri`.`rikurs` AS `rikurs`,`ri`.`rihargatermasukpajak` AS `rihargatermasukpajak`,`ri`.`ritotal` AS `ritotal`,`ri`.`ridiskonpersen` AS `ridiskonpersen`,`ri`.`rijmldiskon` AS `rijmldiskon`,`ri`.`ritotalpajak1detail` AS `ritotalpajak1detail`,`ri`.`ritotalpajak2detail` AS `ritotalpajak2detail`,`ri`.`ribiayalainpersen` AS `ribiayalainpersen`,`ri`.`ribiayalain` AS `ribiayalain`,`ri`.`ritotaltransaksi` AS `ritotaltransaksi`,`ri`.`rijmlbayar` AS `rijmlbayar`,`ri`.`ristatuslunas` AS `ristatuslunas`,`ri`.`ritgllunas` AS `ritgllunas`,`ri`.`rinofakturpajak` AS `rinofakturpajak`,`ri`.`risdhbayarpajak` AS `risdhbayarpajak`,`ri`.`ritglbayarpajak` AS `ritglbayarpajak`,`ri`.`rirekdiskon` AS `rirekdiskon`,`ri`.`rirekpajak1` AS `rirekpajak1`,`ri`.`rirekpajak2` AS `rirekpajak2`,`ri`.`rirekbiayalain` AS `rirekbiayalain`,`ri`.`rirekbayar` AS `rirekbayar`,`ri`.`riidpr` AS `riidpr`,`ri`.`riidcs` AS `riidcs`,`ri`.`riidrq` AS `riidrq`,`ri`.`riidbs` AS `riidbs`,`ri`.`riidpo` AS `riidpo`,`ri`.`riidipc` AS `riidipc`,`ri`.`riidgrn` AS `riidgrn`,`ri`.`ristatusdnr` AS `ristatusdnr`,`ri`.`ristatusprt` AS `ristatusprt`,`ri`.`ristatusrealisasi` AS `ristatusrealisasi`,`ri`.`ristatus` AS `ristatus`,`ri`.`ristatussebelumnya` AS `ristatussebelumnya`,`ri`.`rijmlrevisi` AS `rijmlrevisi`,`ri`.`ricetakanke` AS `ricetakanke`,`ri`.`riinputuser` AS `riinputuser`,`ri`.`riinputtgl` AS `riinputtgl`,`ri`.`rimodifikasiuser` AS `rimodifikasiuser`,`ri`.`rimodifikasitgl` AS `rimodifikasitgl`,`ri`.`riposting` AS `riposting`,`ri`.`ripostingtgl` AS `ripostingtgl`,`ri`.`ritutupperiode` AS `ritutupperiode`,`ri`.`riisclose` AS `riisclose`,`br`.`bnama` AS `ricabangnama`,`lc`.`lnama` AS `rilokasinama`,`wh`.`wnama` AS `rigudangnama`,`c1`.`kkode` AS `risupplierkode`,`c1`.`knama` AS `risuppliernama`,`c2`.`kkode` AS `ribagianpembeliankode`,`c2`.`knama` AS `ribagianpembeliannama`,`po`.`ponotransaksi` AS `ponotransaksi`,`ipc`.`ipcnotransaksi` AS `ipcnotransaksi`,`grn`.`grnnotransaksi` AS `grnnotransaksi`,`st1`.`nama` AS `ristatusnama`,`st2`.`nama` AS `ristatussebelumnyanama`,`u1`.`unama` AS `riinputusernama`,`u2`.`unama` AS `rimodifikasiusernama`, `ri`.`ricustomtext1` AS `ricustomtext1`, `ri`.`ricustomtext2` AS `ricustomtext2`, `ri`.`ricustomtext3` AS `ricustomtext3`, `ri`.`ricustomtext4` AS `ricustomtext4`, `ri`.`ricustomtext5` AS `ricustomtext5`, `ri`.`ricustomint1` AS `ricustomint1`, `ri`.`ricustomint2` AS `ricustomint2`, `ri`.`ricustomint3` AS `ricustomint3`, `ri`.`ricustomdbl1` AS `ricustomdbl1`, `ri`.`ricustomdbl2` AS `ricustomdbl2`, `ri`.`ricustomdbl3` AS `ricustomdbl3`, `ri`.`ricustomdate1` AS `ricustomdate1`, `ri`.`ricustomdate1` AS `ricustomdate1`, `ri`.`ricustomdate2` AS `ricustomdate2`, `ri`.`ricustomdate3` AS `ricustomdate3`, cdis.cnama AS rirekdiskonnama, cpa.cnama AS rirekpajak1nama, cpa2.cnama AS rirekpajak2nama, cba.cnama AS rirekbiayalainnama from ((((((((((((`m4_ri` `ri` left join `m1_branch` `br` on((`br`.`bkode` = `ri`.`ricabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `ri`.`rilokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `ri`.`rigudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `ri`.`risupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `ri`.`ribagianpembelian`))) left join `m4_po` `po` on((`ri`.`riidpo` = `po`.`poid`))) left join `m4_ipc` `ipc` on((`ri`.`riidipc` = `ipc`.`ipcid`))) left join `m4_grn` `grn` on((`ri`.`riidgrn` = `grn`.`grnid`))) left join `m0_status` `st1` on((`st1`.`kode` = `ri`.`ristatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `ri`.`ristatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `ri`.`riinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `ri`.`rimodifikasiuser`))) LEFT JOIN m1_coa cdis ON cdis.cnomor = ri.rirekdiskon LEFT JOIN m1_coa cpa ON cpa.cnomor = ri.rirekpajak1 LEFT JOIN m1_coa cpa2 ON cpa2.cnomor = ri.rirekpajak2 LEFT JOIN m1_coa cba ON cba.cnomor = ri.rirekbiayalain
```

## Query 90

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_ri_getdata`

```sql
select `ri`.`riid` AS `riid`,`ri`.`ricabang` AS `ricabang`,`ri`.`rilokasi` AS `rilokasi`,`ri`.`rigudang` AS `rigudang`,`ri`.`riasalbarang` AS `riasalbarang`,`ri`.`riasalbarangkategori` AS `riasalbarangkategori`,`ri`.`rijenispembelian` AS `rijenispembelian`,`ri`.`rijenispembeliankategori` AS `rijenispembeliankategori`,`ri`.`ricarabayar` AS `ricarabayar`,`ri`.`risumber` AS `risumber`,`ri`.`riautonotransaksi` AS `riautonotransaksi`,`ri`.`rinotransaksi` AS `rinotransaksi`,`ri`.`ritgl` AS `ritgl`,`ri`.`rikodepa` AS `rikodepa`,`ri`.`risupplier` AS `risupplier`,`ri`.`risupplierkontak` AS `risupplierkontak`,`ri`.`ri1alamat1` AS `ri1alamat1`,`ri`.`ri1alamat2` AS `ri1alamat2`,`ri`.`ri1alamat3` AS `ri1alamat3`,`ri`.`ri2alamat1` AS `ri2alamat1`,`ri`.`ri2alamat2` AS `ri2alamat2`,`ri`.`ri2alamat3` AS `ri2alamat3`,`ri`.`ribagianpembelian` AS `ribagianpembelian`,`ri`.`ritermin` AS `ritermin`,`ri`.`ritgljatuhtempo` AS `ritgljatuhtempo`,`ri`.`riuraian` AS `riuraian`,`ri`.`ricatatan` AS `ricatatan`,`ri`.`rinoref` AS `rinoref`,`ri`.`ritglnoref` AS `ritglnoref`,`ri`.`ritglpenutupan` AS `ritglpenutupan`,`ri`.`rimatauang` AS `rimatauang`,`ri`.`rikurs` AS `rikurs`,`ri`.`rihargatermasukpajak` AS `rihargatermasukpajak`,`ri`.`ritotal` AS `ritotal`,`ri`.`ridiskonpersen` AS `ridiskonpersen`,`ri`.`rijmldiskon` AS `rijmldiskon`,`ri`.`ritotalpajak1detail` AS `ritotalpajak1detail`,`ri`.`ritotalpajak2detail` AS `ritotalpajak2detail`,`ri`.`ribiayalainpersen` AS `ribiayalainpersen`,`ri`.`ribiayalain` AS `ribiayalain`,`ri`.`ritotaltransaksi` AS `ritotaltransaksi`,`ri`.`rijmlbayar` AS `rijmlbayar`,`ri`.`ristatuslunas` AS `ristatuslunas`,`ri`.`ritgllunas` AS `ritgllunas`,`ri`.`rinofakturpajak` AS `rinofakturpajak`,`ri`.`risdhbayarpajak` AS `risdhbayarpajak`,`ri`.`ritglbayarpajak` AS `ritglbayarpajak`,`ri`.`rirekdiskon` AS `rirekdiskon`,`ri`.`rirekpajak1` AS `rirekpajak1`,`ri`.`rirekpajak2` AS `rirekpajak2`,`ri`.`rirekbiayalain` AS `rirekbiayalain`,`ri`.`rirekbayar` AS `rirekbayar`,`ri`.`riidpr` AS `riidpr`,`ri`.`riidcs` AS `riidcs`,`ri`.`riidrq` AS `riidrq`,`ri`.`riidbs` AS `riidbs`,`ri`.`riidpo` AS `riidpo`,`ri`.`riidipc` AS `riidipc`,`ri`.`riidgrn` AS `riidgrn`,`ri`.`ristatusdnr` AS `ristatusdnr`,`ri`.`ristatusprt` AS `ristatusprt`,`ri`.`ristatusrealisasi` AS `ristatusrealisasi`,`ri`.`ristatus` AS `ristatus`,`ri`.`ristatussebelumnya` AS `ristatussebelumnya`,`ri`.`rijmlrevisi` AS `rijmlrevisi`,`ri`.`ricetakanke` AS `ricetakanke`,`ri`.`riinputuser` AS `riinputuser`,`ri`.`riinputtgl` AS `riinputtgl`,`ri`.`rimodifikasiuser` AS `rimodifikasiuser`,`ri`.`rimodifikasitgl` AS `rimodifikasitgl`,`ri`.`riposting` AS `riposting`,`ri`.`ripostingtgl` AS `ripostingtgl`,`ri`.`ritutupperiode` AS `ritutupperiode`,`ri`.`riisclose` AS `riisclose`,`ri`.`ricustomtext1` AS `ricustomtext1`,`ri`.`ricustomtext2` AS `ricustomtext2`,`ri`.`ricustomtext3` AS `ricustomtext3`,`ri`.`ricustomtext4` AS `ricustomtext4`,`ri`.`ricustomtext5` AS `ricustomtext5`,`ri`.`ricustomint1` AS `ricustomint1`,`ri`.`ricustomint2` AS `ricustomint2`,`ri`.`ricustomint3` AS `ricustomint3`,`ri`.`ricustomdbl1` AS `ricustomdbl1`,`ri`.`ricustomdbl2` AS `ricustomdbl2`,`ri`.`ricustomdbl3` AS `ricustomdbl3`,`ri`.`ricustomdate1` AS `ricustomdate1`,`ri`.`ricustomdate2` AS `ricustomdate2`,`ri`.`ricustomdate3` AS `ricustomdate3`,`br`.`bnama` AS `ricabangnama`,`lc`.`lnama` AS `rilokasinama`,`wh`.`wnama` AS `rigudangnama`,`c1`.`kkode` AS `risupplierkode`,`c1`.`knama` AS `risuppliernama`,`c2`.`kkode` AS `ribagianpembeliankode`,`c2`.`knama` AS `ribagianpembeliannama`,`tr`.`trnama` AS `riterminnama`,`tr`.`trharijatuhtempo` AS `riterminharijatuhtempo`,`coa1`.`cnama` AS `rirekdiskonnama`,`coa2`.`cnama` AS `rirekpajak1nama`,`coa3`.`cnama` AS `rirekpajak2nama`,`coa4`.`cnama` AS `rirekbiayalainnama`,`coa5`.`cnama` AS `rirekbayarnama`,`po`.`ponotransaksi` AS `rinotransaksipo`,`ipc`.`ipcnotransaksi` AS `rinotransaksiipc`,`grn`.`grnnotransaksi` AS `rinotransaksigrn`,`st1`.`nama` AS `ristatusnama`,`st2`.`nama` AS `ristatussebelumnyanama`,`u1`.`unama` AS `riinputusernama`,`u2`.`unama` AS `rimodifikasiusernama`,`rid`.`idridetail` AS `idridetail`,`rid`.`idri` AS `idri`,`rid`.`idbarang` AS `idbarang`,`rid`.`namabarang` AS `namabarang`,`rid`.`tipebarang` AS `tipebarang`,`rid`.`jml` AS `jml`,`rid`.`satuan` AS `satuan`,`rid`.`nilaisatuan` AS `nilaisatuan`,`rid`.`jmlbarang` AS `jmlbarang`,`rid`.`satuanbarang` AS `satuanbarang`,`rid`.`matauang` AS `matauang`,`rid`.`kurs` AS `kurs`,`rid`.`hargafix` AS `hargafix`,`rid`.`harga` AS `harga`,`rid`.`diskon` AS `diskon`,`rid`.`jmldiskon` AS `jmldiskon`,`rid`.`pajak1` AS `pajak1`,`rid`.`jmlpajak1` AS `jmlpajak1`,`rid`.`pajak2` AS `pajak2`,`rid`.`jmlpajak2` AS `jmlpajak2`,`rid`.`cabang` AS `cabang`,`rid`.`lokasi` AS `lokasi`,`rid`.`gudang` AS `gudang`,`i`.`brekpersediaan` AS `rekpersediaan`,`i`.`brekdiskonpembelian` AS `rekdiskonpembelian`,`rid`.`rekhutangsementara` AS `rekhutangsementara`,`rid`.`costcenter` AS `costcenter`,`rid`.`divisi` AS `divisi`,`rid`.`subdivisi` AS `subdivisi`,`rid`.`proyek` AS `proyek`,`rid`.`catatan` AS `catatan`,`rid`.`urutan` AS `urutan`,`rid`.`idprdetail` AS `idprdetail`,`rid`.`idcsdetail` AS `idcsdetail`,`rid`.`idrqdetail` AS `idrqdetail`,`rid`.`idbsdetail` AS `idbsdetail`,`rid`.`idpodetail` AS `idpodetail`,`rid`.`idipcdetail` AS `idipcdetail`,`rid`.`idgrndetail` AS `idgrndetail`,`rid`.`jmldnr` AS `jmldnr`,`rid`.`statusdnr` AS `statusdnr`,`rid`.`jmlprt` AS `jmlprt`,`rid`.`statusprt` AS `statusprt`,`rid`.`jmlrealisasi` AS `jmlrealisasi`,`rid`.`statusrealisasi` AS `statusrealisasi`,`rid`.`isclose` AS `isclose`,`rid`.`customtext1` AS `customtext1`,`rid`.`customtext2` AS `customtext2`,`rid`.`customtext3` AS `customtext3`,`rid`.`customdbl1` AS `customdbl1`,`rid`.`customdbl2` AS `customdbl2`,`rid`.`customdbl3` AS `customdbl3`,`rid`.`customdate1` AS `customdate1`,`rid`.`customdate2` AS `customdate2`,`rid`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bhpp` AS `bhpp`,`i`.`bjenis` AS `bjenis`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,`t1`.`tnama` AS `pajak1nama`,`t1`.`tnilai` AS `pajak1nilai`,`t2`.`tnama` AS `pajak2nama`,`t2`.`tnilai` AS `pajak2nilai`,`brd`.`bnama` AS `cabangnama`,`lcd`.`lnama` AS `lokasinama`,`whd`.`wnama` AS `gudangnama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama`,`po2`.`ponotransaksi` AS `ponotransaksi`,`ipc2`.`ipcnotransaksi` AS `ipcnotransaksi`,`grn2`.`grnnotransaksi` AS `grnnotransaksi`, c1.kpkp, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan from (((((((((((((((((((((((((((((((((((`m4_ri` `ri` join `m4_ri_detail` `rid` on((`ri`.`riid` = `rid`.`idri`))) left join `m1_branch` `br` on((`br`.`bkode` = `ri`.`ricabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `ri`.`rilokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `ri`.`rigudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `ri`.`risupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `ri`.`ribagianpembelian`))) left join `m1_terms` `tr` on((`ri`.`ritermin` = `tr`.`trkode`))) left join `m1_coa` `coa1` on((`ri`.`rirekdiskon` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`ri`.`rirekpajak1` = `coa2`.`cnomor`))) left join `m1_coa` `coa3` on((`ri`.`rirekpajak2` = `coa3`.`cnomor`))) left join `m1_coa` `coa4` on((`ri`.`rirekbiayalain` = `coa4`.`cnomor`))) left join `m1_coa` `coa5` on((`ri`.`rirekbayar` = `coa5`.`cnomor`))) left join `m4_po` `po` on((`ri`.`riidpo` = `po`.`poid`))) left join `m4_ipc` `ipc` on((`ri`.`riidipc` = `ipc`.`ipcid`))) left join `m4_grn` `grn` on((`ri`.`riidgrn` = `grn`.`grnid`))) left join `m0_status` `st1` on((`st1`.`kode` = `ri`.`ristatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `ri`.`ristatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `ri`.`riinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `ri`.`rimodifikasiuser`))) left join `m1_item` `i` on((`i`.`bid` = `rid`.`idbarang`))) left join `m1_tax` `t1` on((`rid`.`pajak1` = `t1`.`tkode`))) left join `m1_tax` `t2` on((`rid`.`pajak2` = `t2`.`tkode`))) left join `m1_branch` `brd` on((`rid`.`cabang` = `brd`.`bkode`))) left join `m1_location` `lcd` on((`rid`.`lokasi` = `lcd`.`lkode`))) left join `m1_warehouse` `whd` on((`rid`.`gudang` = `whd`.`wkode`))) left join `m1_project` `p` on((`rid`.`proyek` = `p`.`pkode`))) left join `m4_po_detail` `pod` on((`rid`.`idpodetail` = `pod`.`idpodetail`))) left join `m4_po` `po2` on((`pod`.`idpo` = `po2`.`poid`))) left join `m4_ipc_detail` `ipcd` on((`rid`.`idipcdetail` = `ipcd`.`idipcdetail`))) left join `m4_ipc` `ipc2` on((`ipcd`.`idipc` = `ipc2`.`ipcid`))) left join `m4_grn_detail` `grnd` on((`rid`.`idgrndetail` = `grnd`.`idgrndetail`))) left join `m4_grn` `grn2` on((`grnd`.`idgrn` = `grn2`.`grnid`))) left join `m1_cost_center` `cc` on((`rid`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`rid`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`rid`.`subdivisi` = `sd`.`sdkode`)))
```

## Query 91

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_ri_cd`

```sql
select `ri`.`riid` AS `riid`,`ri`.`ricabang` AS `ricabang`,`ri`.`rilokasi` AS `rilokasi`,`ri`.`rigudang` AS `rigudang`,`ri`.`rinotransaksi` AS `rinotransaksi`,`ri`.`ritgl` AS `ritgl`,`ri`.`risupplier` AS `risupplier`,`ri`.`risupplierkontak` AS `risupplierkontak`,`ri`.`ribagianpembelian` AS `ribagianpembelian`,`ri`.`ritermin` AS `ritermin`,`ri`.`riuraian` AS `riuraian`,`ri`.`ricatatan` AS `ricatatan`,`ri`.`rimatauang` AS `rimatauang`,`ri`.`rikurs` AS `rikurs`,`ri`.`ritotal` AS `ritotal`,`ri`.`ridiskonpersen` AS `ridiskonpersen`,`ri`.`rijmldiskon` AS `rijmldiskon`,`ri`.`ritotalpajak1detail` AS `ritotalpajak1detail`,`ri`.`ritotalpajak2detail` AS `ritotalpajak2detail`,`ri`.`ribiayalainpersen` AS `ribiayalainpersen`,`ri`.`ribiayalain` AS `ribiayalain`,`ri`.`ritotaltransaksi` AS `ritotaltransaksi`,`ri`.`rijmlbayar` AS `rijmlbayar`,`c1`.`kkode` AS `risupplierkode`,`c1`.`knama` AS `risuppliernama`,`c2`.`kkode` AS `ribagianpembeliankode`,`c2`.`knama` AS `ribagianpembeliannama` from ((`m4_ri` `ri` left join `m1_contact` `c1` on((`ri`.`risupplier` = `c1`.`kid`))) left join `m1_contact` `c2` on((`ri`.`ribagianpembelian` = `c2`.`kid`)))
```

## Query 92

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_ri_terkait`

```sql
select `ri`.`riid` AS `riid`,`ri`.`rinotransaksi` AS `rinotransaksi`,`pr`.`prsumber` AS `sumber`,`pr`.`prid` AS `idterkait`,`pr`.`prnotransaksi` AS `noterkait`,`pr`.`prtgl` AS `tglterkait`,`pr`.`prinputtgl` AS `inputtglterkait`,`pr`.`prmodifikasitgl` AS `modifikasitglterkait`,0 AS `jenisterkait` from (((`m4_pr_detail` `prd` join `m4_pr` `pr` on((`prd`.`idpr` = `pr`.`prid`))) join `m4_ri_detail` `rid` on((`prd`.`idprdetail` = `rid`.`idprdetail`))) join `m4_ri` `ri` on((`rid`.`idri` = `ri`.`riid`))) where (`ri`.`riid` = 'validtransaksi') group by `pr`.`prid`,`ri`.`riid` union all select `ri`.`riid` AS `riid`,`ri`.`rinotransaksi` AS `rinotransaksi`,`rq`.`rqsumber` AS `sumber`,`rq`.`rqid` AS `idterkait`,`rq`.`rqnotransaksi` AS `noterkait`,`rq`.`rqtgl` AS `tglterkait`,`rq`.`rqinputtgl` AS `inputtglterkait`,`rq`.`rqmodifikasitgl` AS `modifikasitglterkait`,0 AS `jenisterkait` from (((`m4_rq_detail` `rqd` join `m4_rq` `rq` on((`rqd`.`idrq` = `rq`.`rqid`))) join `m4_ri_detail` `rid` on((`rqd`.`idrqdetail` = `rid`.`idrqdetail`))) join `m4_ri` `ri` on((`rid`.`idri` = `ri`.`riid`))) where (`ri`.`riid` = 'validtransaksi') group by `rq`.`rqid`,`ri`.`riid` union all select `ri`.`riid` AS `riid`,`ri`.`rinotransaksi` AS `rinotransaksi`,`po`.`posumber` AS `sumber`,`po`.`poid` AS `idterkait`,`po`.`ponotransaksi` AS `noterkait`,`po`.`potgl` AS `tglterkait`,`po`.`poinputtgl` AS `inputtglterkait`,`po`.`pomodifikasitgl` AS `modifikasitglterkait`,0 AS `jenisterkait` from (((`m4_po_detail` `pod` join `m4_po` `po` on((`pod`.`idpo` = `po`.`poid`))) join `m4_ri_detail` `rid` on((`pod`.`idpodetail` = `rid`.`idpodetail`))) join `m4_ri` `ri` on((`rid`.`idri` = `ri`.`riid`))) where (`ri`.`riid` = 'validtransaksi') group by `po`.`poid`,`ri`.`riid` union all select `ri`.`riid` AS `riid`,`ri`.`rinotransaksi` AS `rinotransaksi`,`grn`.`grnsumber` AS `sumber`,`grn`.`grnid` AS `idterkait`,`grn`.`grnnotransaksi` AS `noterkait`,`grn`.`grntgl` AS `tglterkait`,`grn`.`grninputtgl` AS `inputtglterkait`,`grn`.`grnmodifikasitgl` AS `modifikasitglterkait`,0 AS `jenisterkait` from (((`m4_grn_detail` `grnd` join `m4_grn` `grn` on((`grnd`.`idgrn` = `grn`.`grnid`))) join `m4_ri_detail` `rid` on((`grnd`.`idgrndetail` = `rid`.`idgrndetail`))) join `m4_ri` `ri` on((`rid`.`idri` = `ri`.`riid`))) where (`ri`.`riid` = 'validtransaksi') group by `grn`.`grnid`,`ri`.`riid` union all select `ri`.`riid` AS `riid`,`ri`.`rinotransaksi` AS `rinotransaksi`,`dnr`.`dnrsumber` AS `sumber`,`dnr`.`dnrid` AS `idterkait`,`dnr`.`dnrnotransaksi` AS `noterkait`,`dnr`.`dnrtgl` AS `tglterkait`,`dnr`.`dnrinputtgl` AS `inputtglterkait`,`dnr`.`dnrmodifikasitgl` AS `modifikasitglterkait`,1 AS `jenisterkait` from (((`m4_dnr_detail` `dnrd` join `m4_dnr` `dnr` on((`dnrd`.`iddnr` = `dnr`.`dnrid`))) join `m4_ri_detail` `rid` on((`rid`.`idridetail` = `dnrd`.`idridetail`))) join `m4_ri` `ri` on((`ri`.`riid` = `rid`.`idri`))) where (((`dnr`.`dnrstatus` = 2) or (`dnr`.`dnrstatus` = 3) or (`dnr`.`dnrstatus` = 4) or (`dnr`.`dnrstatus` = 7)) and (`ri`.`riid` = 'validtransaksi')) group by `dnr`.`dnrid`,`ri`.`riid` union all select `ri`.`riid` AS `riid`,`ri`.`rinotransaksi` AS `rinotransaksi`,`prt`.`prtsumber` AS `sumber`,`prt`.`prtid` AS `idterkait`,`prt`.`prtnotransaksi` AS `noterkait`,`prt`.`prttgl` AS `tglterkait`,`prt`.`prtinputtgl` AS `inputtglterkait`,`prt`.`prtmodifikasitgl` AS `modifikasitglterkait`,1 AS `jenisterkait` from (((`m4_prt_detail` `prtd` join `m4_prt` `prt` on((`prtd`.`idprt` = `prt`.`prtid`))) join `m4_ri_detail` `rid` on((`rid`.`idridetail` = `prtd`.`idridetail`))) join `m4_ri` `ri` on((`ri`.`riid` = `rid`.`idri`))) where (((`prt`.`prtstatus` = 2) or (`prt`.`prtstatus` = 3) or (`prt`.`prtstatus` = 4) or (`prt`.`prtstatus` = 7)) and (`ri`.`riid` = 'validtransaksi')) group by `prt`.`prtid`,`ri`.`riid` union all select `ri`.`riid` AS `riid`,`ri`.`rinotransaksi` AS `rinotransaksi`,`vpp`.`vppsumber` AS `sumber`,`vpp`.`vppid` AS `idterkait`,`vpp`.`vppnotransaksi` AS `noterkait`,`vpp`.`vpptgl` AS `tglterkait`,`vpp`.`vppinputtgl` AS `inputtglterkait`,`vpp`.`vppmodifikasitgl` AS `modifikasitglterkait`,1 AS `jenisterkait` from ((`m4_vpp_detail` `vppd` join `m4_vpp` `vpp` on((`vppd`.`idvpp` = `vpp`.`vppid`))) join `m4_ri` `ri` on((`vppd`.`idtransaksi` = `ri`.`riid`))) where ((`vppd`.`sumber` = 'RI') and ((`vpp`.`vppstatus` = 2) or (`vpp`.`vppstatus` = 3) or (`vpp`.`vppstatus` = 4) or (`vpp`.`vppstatus` = 7)) and (`ri`.`riid` = 'validtransaksi')) group by `vpp`.`vppid`,`ri`.`riid` union all select `ri`.`riid` AS `riid`,`ri`.`rinotransaksi` AS `rinotransaksi`,`vp`.`vpsumber` AS `sumber`,`vp`.`vpid` AS `idterkait`,`vp`.`vpnotransaksi` AS `noterkait`,`vp`.`vptgl` AS `tglterkait`,`vp`.`vpinputtgl` AS `inputtglterkait`,`vp`.`vpmodifikasitgl` AS `modifikasitglterkait`,1 AS `jenisterkait` from ((`m4_vp_detail` `vpd` join `m4_vp` `vp` on((`vpd`.`idvp` = `vp`.`vpid`))) join `m4_ri` `ri` on((`vpd`.`idtransaksi` = `ri`.`riid`))) where ((`vpd`.`sumber` = 'RI') and ((`vp`.`vpstatus` = 2) or (`vp`.`vpstatus` = 3) or (`vp`.`vpstatus` = 4) or (`vp`.`vpstatus` = 7)) and (`ri`.`riid` = 'validtransaksi')) group by `vp`.`vpid`,`ri`.`riid` union all select `ri`.`riid` AS `riid`,`ri`.`rinotransaksi` AS `rinotransaksi`,`cfo`.`cfosumber` AS `sumber`,`it`.`idutama` AS `idterkait`,`it`.`notransaksi` AS `noterkait`,`it`.`tgl` AS `tglterkait`,`it`.`inputtgl` AS `inputtglterkait`,`it`.`inputtgl` AS `modifikasitglterkait`,1 AS `jenisterkait` from ((((`m1_cogs_fifo_in` `cfi` join `m1_cogs_fifo_out` `cfo` on((`cfi`.`cfiid` = `cfo`.`cfoidcfi`))) join `m4_ri_detail` `rid` on(((`cfi`.`cfisumber` = 'RI') and (`cfi`.`cfiidbarang` = `rid`.`idbarang`) and (`cfi`.`cfiidtransaksi` = `rid`.`idridetail`)))) join `m4_ri` `ri` on((`rid`.`idri` = `ri`.`riid`))) join `m1_item_transaction` `it` on(((`cfo`.`cfosumber` = `it`.`sumber`) and (`cfo`.`cfoidbarang` = `it`.`idbarang`) and (`cfo`.`cfoidtransaksi` = `it`.`iddetail`)))) where (`ri`.`riid` = 'validtransaksi') group by `it`.`sumber`,`it`.`idutama`,`ri`.`riid` union all select `ri`.`riid` AS `riid`,`ri`.`rinotransaksi` AS `rinotransaksi`,`cso`.`sumber` AS `sumber`,`it`.`idutama` AS `idterkait`,`it`.`notransaksi` AS `noterkait`,`it`.`tgl` AS `tglterkait`,`it`.`inputtgl` AS `inputtglterkait`,`it`.`inputtgl` AS `modifikasitglterkait`,1 AS `jenisterkait` from ((((`m1_cogs_special_in` `csi` join `m1_cogs_special_out` `cso` on((`csi`.`idhppikm` = `cso`.`idhppikm`))) join `m4_ri_detail` `rid` on(((`csi`.`sumber` = 'RI') and (`csi`.`idbarang` = `rid`.`idbarang`) and (`csi`.`idtransaksi` = `rid`.`idridetail`)))) join `m4_ri` `ri` on((`rid`.`idri` = `ri`.`riid`))) join `m1_item_transaction` `it` on(((`cso`.`sumber` = `it`.`sumber`) and (`cso`.`idbarang` = `it`.`idbarang`) and (`cso`.`idtransaksi` = `it`.`iddetail`)))) where (`ri`.`riid` = 'validtransaksi') group by `it`.`sumber`,`it`.`idutama`,`ri`.`riid` union SELECT ri.riid as riid, ri.rinotransaksi as rinotransaksi, da.dasumber as sumber, da.daid as idterkait, da.danotransaksi as noterkait, da.datgl as tglterkait, da.dainputtgl as inputtglterkait, da.damodifikasitgl as modifikasitglterkait, 1 as jenisterkait FROM m7_asset_transaction atr JOIN m4_ri ri ON atr.atsumber = ri.risumber AND atr.atidutama = ri.riid AND ri.riid = 'validtransaksi' JOIN m7_asset a ON atr.atkode = a.akode JOIN m7_da_detail dad ON a.aid = dad.idaset JOIN m7_da da ON dad.idda = da.daid AND da.dastatus IN(2,3,4,7) GROUP BY da.daid, ri.riid union SELECT atr.atidutama AS riid, atr.atnotransaksi AS rinotransaksi, atr2.atsumber AS sumber, atr2.atidutama AS idterkait, atr2.atnotransaksi AS noterkait, atr2.attgl AS tglterkait, CONCAT(atr2.attgl,'00:00:00') AS inputtglterkait, CONCAT(atr2.attgl,'00:00:00') AS modifikasitglterkait, 1 AS jenisterkait FROM m7_asset_transaction atr JOIN m7_asset_transaction atr2 ON atr.atkode = atr2.atkode AND atr2.atstatus IN(2,3,4,7) AND atr.atsumber = 'RI' AND atr.atidutama = 'validtransaksi' AND NOT (atr.atsumber = atr2.atsumber AND atr.atidutama = atr2.atidutama) GROUP BY atr2.atsumber, atr2.atidutama
```

## Query 93

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_ri_v_history`

```sql
select `ri`.`riidhistory` AS `riidhistory`, `ri`.`riid` AS `riid`,`ri`.`ricabang` AS `ricabang`,`ri`.`rilokasi` AS `rilokasi`,`ri`.`rigudang` AS `rigudang`,`ri`.`riasalbarang` AS `riasalbarang`,`ri`.`riasalbarangkategori` AS `riasalbarangkategori`,`ri`.`rijenispembelian` AS `rijenispembelian`,`ri`.`rijenispembeliankategori` AS `rijenispembeliankategori`,`ri`.`ricarabayar` AS `ricarabayar`,`ri`.`risumber` AS `risumber`,`ri`.`riautonotransaksi` AS `riautonotransaksi`,`ri`.`rinotransaksi` AS `rinotransaksi`,`ri`.`ritgl` AS `ritgl`,`ri`.`rikodepa` AS `rikodepa`,`ri`.`risupplier` AS `risupplier`,`ri`.`risupplierkontak` AS `risupplierkontak`,`ri`.`ri1alamat1` AS `ri1alamat1`,`ri`.`ri1alamat2` AS `ri1alamat2`,`ri`.`ri1alamat3` AS `ri1alamat3`,`ri`.`ri2alamat1` AS `ri2alamat1`,`ri`.`ri2alamat2` AS `ri2alamat2`,`ri`.`ri2alamat3` AS `ri2alamat3`,`ri`.`ribagianpembelian` AS `ribagianpembelian`,`ri`.`ritermin` AS `ritermin`,`ri`.`ritgljatuhtempo` AS `ritgljatuhtempo`,`ri`.`riuraian` AS `riuraian`,`ri`.`ricatatan` AS `ricatatan`,`ri`.`rinoref` AS `rinoref`,`ri`.`ritglnoref` AS `ritglnoref`,`ri`.`ritglpenutupan` AS `ritglpenutupan`,`ri`.`rimatauang` AS `rimatauang`,`ri`.`rikurs` AS `rikurs`,`ri`.`rihargatermasukpajak` AS `rihargatermasukpajak`,`ri`.`ritotal` AS `ritotal`,`ri`.`ridiskonpersen` AS `ridiskonpersen`,`ri`.`rijmldiskon` AS `rijmldiskon`,`ri`.`ritotalpajak1detail` AS `ritotalpajak1detail`,`ri`.`ritotalpajak2detail` AS `ritotalpajak2detail`,`ri`.`ribiayalainpersen` AS `ribiayalainpersen`,`ri`.`ribiayalain` AS `ribiayalain`,`ri`.`ritotaltransaksi` AS `ritotaltransaksi`,`ri`.`rijmlbayar` AS `rijmlbayar`,`ri`.`ristatuslunas` AS `ristatuslunas`,`ri`.`ritgllunas` AS `ritgllunas`,`ri`.`rinofakturpajak` AS `rinofakturpajak`,`ri`.`risdhbayarpajak` AS `risdhbayarpajak`,`ri`.`ritglbayarpajak` AS `ritglbayarpajak`,`ri`.`rirekdiskon` AS `rirekdiskon`,`ri`.`rirekpajak1` AS `rirekpajak1`,`ri`.`rirekpajak2` AS `rirekpajak2`,`ri`.`rirekbiayalain` AS `rirekbiayalain`,`ri`.`rirekbayar` AS `rirekbayar`,`ri`.`riidpr` AS `riidpr`,`ri`.`riidcs` AS `riidcs`,`ri`.`riidrq` AS `riidrq`,`ri`.`riidbs` AS `riidbs`,`ri`.`riidpo` AS `riidpo`,`ri`.`riidipc` AS `riidipc`,`ri`.`riidgrn` AS `riidgrn`,`ri`.`ristatusdnr` AS `ristatusdnr`,`ri`.`ristatusprt` AS `ristatusprt`,`ri`.`ristatusrealisasi` AS `ristatusrealisasi`,`ri`.`ristatus` AS `ristatus`,`ri`.`ristatussebelumnya` AS `ristatussebelumnya`,`ri`.`rijmlrevisi` AS `rijmlrevisi`,`ri`.`ricetakanke` AS `ricetakanke`,`ri`.`riinputuser` AS `riinputuser`,`ri`.`riinputtgl` AS `riinputtgl`,`ri`.`rimodifikasiuser` AS `rimodifikasiuser`,`ri`.`rimodifikasitgl` AS `rimodifikasitgl`,`ri`.`riposting` AS `riposting`,`ri`.`ripostingtgl` AS `ripostingtgl`,`ri`.`ritutupperiode` AS `ritutupperiode`,`ri`.`riisclose` AS `riisclose`,`br`.`bnama` AS `ricabangnama`,`lc`.`lnama` AS `rilokasinama`,`wh`.`wnama` AS `rigudangnama`,`c1`.`kkode` AS `risupplierkode`,`c1`.`knama` AS `risuppliernama`,`c2`.`kkode` AS `ribagianpembeliankode`,`c2`.`knama` AS `ribagianpembeliannama`,`po`.`ponotransaksi` AS `ponotransaksi`,`ipc`.`ipcnotransaksi` AS `ipcnotransaksi`,`grn`.`grnnotransaksi` AS `grnnotransaksi`,`st1`.`nama` AS `ristatusnama`,`st2`.`nama` AS `ristatussebelumnyanama`,`u1`.`unama` AS `riinputusernama`,`u2`.`unama` AS `rimodifikasiusernama`, `ri`.`ricustomtext1` AS `ricustomtext1`, `ri`.`ricustomtext2` AS `ricustomtext2`, `ri`.`ricustomtext3` AS `ricustomtext3`, `ri`.`ricustomtext4` AS `ricustomtext4`, `ri`.`ricustomtext5` AS `ricustomtext5`, `ri`.`ricustomint1` AS `ricustomint1`, `ri`.`ricustomint2` AS `ricustomint2`, `ri`.`ricustomint3` AS `ricustomint3`, `ri`.`ricustomdbl1` AS `ricustomdbl1`, `ri`.`ricustomdbl2` AS `ricustomdbl2`, `ri`.`ricustomdbl3` AS `ricustomdbl3`, `ri`.`ricustomdate1` AS `ricustomdate1`, `ri`.`ricustomdate2` AS `ricustomdate2`, `ri`.`ricustomdate3` AS `ricustomdate3`, (CASE ri.ricarabayar WHEN 0 THEN 'Cash' ELSE 'Credit' END) as ricarabayarnama from ((((((((((((`m4_ri_history` `ri` left join `m1_branch` `br` on((`br`.`bkode` = `ri`.`ricabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `ri`.`rilokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `ri`.`rigudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `ri`.`risupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `ri`.`ribagianpembelian`))) left join `m4_po` `po` on((`ri`.`riidpo` = `po`.`poid`))) left join `m4_ipc` `ipc` on((`ri`.`riidipc` = `ipc`.`ipcid`))) left join `m4_grn` `grn` on((`ri`.`riidgrn` = `grn`.`grnid`))) left join `m0_status` `st1` on((`st1`.`kode` = `ri`.`ristatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `ri`.`ristatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `ri`.`riinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `ri`.`rimodifikasiuser`)))
```

## Query 94

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_ri_getdata_history`

```sql
select `ri`.`riidhistory` AS `riidhistory`,`ri`.`riid` AS `riid`,`ri`.`ricabang` AS `ricabang`,`ri`.`rilokasi` AS `rilokasi`,`ri`.`rigudang` AS `rigudang`,`ri`.`riasalbarang` AS `riasalbarang`,`ri`.`riasalbarangkategori` AS `riasalbarangkategori`,`ri`.`rijenispembelian` AS `rijenispembelian`,`ri`.`rijenispembeliankategori` AS `rijenispembeliankategori`,`ri`.`ricarabayar` AS `ricarabayar`,`ri`.`risumber` AS `risumber`,`ri`.`riautonotransaksi` AS `riautonotransaksi`,`ri`.`rinotransaksi` AS `rinotransaksi`,`ri`.`ritgl` AS `ritgl`,`ri`.`rikodepa` AS `rikodepa`,`ri`.`risupplier` AS `risupplier`,`ri`.`risupplierkontak` AS `risupplierkontak`,`ri`.`ri1alamat1` AS `ri1alamat1`,`ri`.`ri1alamat2` AS `ri1alamat2`,`ri`.`ri1alamat3` AS `ri1alamat3`,`ri`.`ri2alamat1` AS `ri2alamat1`,`ri`.`ri2alamat2` AS `ri2alamat2`,`ri`.`ri2alamat3` AS `ri2alamat3`,`ri`.`ribagianpembelian` AS `ribagianpembelian`,`ri`.`ritermin` AS `ritermin`,`ri`.`ritgljatuhtempo` AS `ritgljatuhtempo`,`ri`.`riuraian` AS `riuraian`,`ri`.`ricatatan` AS `ricatatan`,`ri`.`rinoref` AS `rinoref`,`ri`.`ritglnoref` AS `ritglnoref`,`ri`.`ritglpenutupan` AS `ritglpenutupan`,`ri`.`rimatauang` AS `rimatauang`,`ri`.`rikurs` AS `rikurs`,`ri`.`rihargatermasukpajak` AS `rihargatermasukpajak`,`ri`.`ritotal` AS `ritotal`,`ri`.`ridiskonpersen` AS `ridiskonpersen`,`ri`.`rijmldiskon` AS `rijmldiskon`,`ri`.`ritotalpajak1detail` AS `ritotalpajak1detail`,`ri`.`ritotalpajak2detail` AS `ritotalpajak2detail`,`ri`.`ribiayalainpersen` AS `ribiayalainpersen`,`ri`.`ribiayalain` AS `ribiayalain`,`ri`.`ritotaltransaksi` AS `ritotaltransaksi`,`ri`.`rijmlbayar` AS `rijmlbayar`,`ri`.`ristatuslunas` AS `ristatuslunas`,`ri`.`ritgllunas` AS `ritgllunas`,`ri`.`rinofakturpajak` AS `rinofakturpajak`,`ri`.`risdhbayarpajak` AS `risdhbayarpajak`,`ri`.`ritglbayarpajak` AS `ritglbayarpajak`,`ri`.`rirekdiskon` AS `rirekdiskon`,`ri`.`rirekpajak1` AS `rirekpajak1`,`ri`.`rirekpajak2` AS `rirekpajak2`,`ri`.`rirekbiayalain` AS `rirekbiayalain`,`ri`.`rirekbayar` AS `rirekbayar`,`ri`.`riidpr` AS `riidpr`,`ri`.`riidcs` AS `riidcs`,`ri`.`riidrq` AS `riidrq`,`ri`.`riidbs` AS `riidbs`,`ri`.`riidpo` AS `riidpo`,`ri`.`riidipc` AS `riidipc`,`ri`.`riidgrn` AS `riidgrn`,`ri`.`ristatusdnr` AS `ristatusdnr`,`ri`.`ristatusprt` AS `ristatusprt`,`ri`.`ristatusrealisasi` AS `ristatusrealisasi`,`ri`.`ristatus` AS `ristatus`,`ri`.`ristatussebelumnya` AS `ristatussebelumnya`,`ri`.`rijmlrevisi` AS `rijmlrevisi`,`ri`.`ricetakanke` AS `ricetakanke`,`ri`.`riinputuser` AS `riinputuser`,`ri`.`riinputtgl` AS `riinputtgl`,`ri`.`rimodifikasiuser` AS `rimodifikasiuser`,`ri`.`rimodifikasitgl` AS `rimodifikasitgl`,`ri`.`riposting` AS `riposting`,`ri`.`ripostingtgl` AS `ripostingtgl`,`ri`.`ritutupperiode` AS `ritutupperiode`,`ri`.`riisclose` AS `riisclose`,`ri`.`ricustomtext1` AS `ricustomtext1`,`ri`.`ricustomtext2` AS `ricustomtext2`,`ri`.`ricustomtext3` AS `ricustomtext3`,`ri`.`ricustomtext4` AS `ricustomtext4`,`ri`.`ricustomtext5` AS `ricustomtext5`,`ri`.`ricustomint1` AS `ricustomint1`,`ri`.`ricustomint2` AS `ricustomint2`,`ri`.`ricustomint3` AS `ricustomint3`,`ri`.`ricustomdbl1` AS `ricustomdbl1`,`ri`.`ricustomdbl2` AS `ricustomdbl2`,`ri`.`ricustomdbl3` AS `ricustomdbl3`,`ri`.`ricustomdate1` AS `ricustomdate1`,`ri`.`ricustomdate2` AS `ricustomdate2`,`ri`.`ricustomdate3` AS `ricustomdate3`,`br`.`bnama` AS `ricabangnama`,`lc`.`lnama` AS `rilokasinama`,`wh`.`wnama` AS `rigudangnama`,`c1`.`kkode` AS `risupplierkode`,`c1`.`knama` AS `risuppliernama`,`c2`.`kkode` AS `ribagianpembeliankode`,`c2`.`knama` AS `ribagianpembeliannama`,`tr`.`trnama` AS `riterminnama`,`tr`.`trharijatuhtempo` AS `riterminharijatuhtempo`,`coa1`.`cnama` AS `rirekdiskonnama`,`coa2`.`cnama` AS `rirekpajak1nama`,`coa3`.`cnama` AS `rirekpajak2nama`,`coa4`.`cnama` AS `rirekbiayalainnama`,`coa5`.`cnama` AS `rirekbayarnama`,`po`.`ponotransaksi` AS `rinotransaksipo`,`ipc`.`ipcnotransaksi` AS `rinotransaksiipc`,`grn`.`grnnotransaksi` AS `rinotransaksigrn`,`st1`.`nama` AS `ristatusnama`,`st2`.`nama` AS `ristatussebelumnyanama`,`u1`.`unama` AS `riinputusernama`,`u2`.`unama` AS `rimodifikasiusernama`,`rid`.`idhistorydetail` AS `idhistorydetail`,`rid`.`idhistory` AS `idhistory`,`idridetail` AS `idridetail`,`rid`.`idri` AS `idri`,`rid`.`idbarang` AS `idbarang`,`rid`.`namabarang` AS `namabarang`,`rid`.`tipebarang` AS `tipebarang`,`rid`.`jml` AS `jml`,`rid`.`satuan` AS `satuan`,`rid`.`nilaisatuan` AS `nilaisatuan`,`rid`.`jmlbarang` AS `jmlbarang`,`rid`.`satuanbarang` AS `satuanbarang`,`rid`.`matauang` AS `matauang`,`rid`.`kurs` AS `kurs`,`rid`.`hargafix` AS `hargafix`,`rid`.`harga` AS `harga`,`rid`.`diskon` AS `diskon`,`rid`.`jmldiskon` AS `jmldiskon`,`rid`.`pajak1` AS `pajak1`,`rid`.`jmlpajak1` AS `jmlpajak1`,`rid`.`pajak2` AS `pajak2`,`rid`.`jmlpajak2` AS `jmlpajak2`,`rid`.`cabang` AS `cabang`,`rid`.`lokasi` AS `lokasi`,`rid`.`gudang` AS `gudang`,`i`.`brekpersediaan` AS `rekpersediaan`,`i`.`brekdiskonpembelian` AS `rekdiskonpembelian`,`rid`.`rekhutangsementara` AS `rekhutangsementara`,`rid`.`costcenter` AS `costcenter`,`rid`.`divisi` AS `divisi`,`rid`.`subdivisi` AS `subdivisi`,`rid`.`proyek` AS `proyek`,`rid`.`catatan` AS `catatan`,`rid`.`urutan` AS `urutan`,`rid`.`idprdetail` AS `idprdetail`,`rid`.`idcsdetail` AS `idcsdetail`,`rid`.`idrqdetail` AS `idrqdetail`,`rid`.`idbsdetail` AS `idbsdetail`,`rid`.`idpodetail` AS `idpodetail`,`rid`.`idipcdetail` AS `idipcdetail`,`rid`.`idgrndetail` AS `idgrndetail`,`rid`.`jmldnr` AS `jmldnr`,`rid`.`statusdnr` AS `statusdnr`,`rid`.`jmlprt` AS `jmlprt`,`rid`.`statusprt` AS `statusprt`,`rid`.`jmlrealisasi` AS `jmlrealisasi`,`rid`.`statusrealisasi` AS `statusrealisasi`,`rid`.`isclose` AS `isclose`,`rid`.`customtext1` AS `customtext1`,`rid`.`customtext2` AS `customtext2`,`rid`.`customtext3` AS `customtext3`,`rid`.`customdbl1` AS `customdbl1`,`rid`.`customdbl2` AS `customdbl2`,`rid`.`customdbl3` AS `customdbl3`,`rid`.`customdate1` AS `customdate1`,`rid`.`customdate2` AS `customdate2`,`rid`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bhpp` AS `bhpp`,`i`.`bjenis` AS `bjenis`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,`t1`.`tnama` AS `pajak1nama`,`t1`.`tnilai` AS `pajak1nilai`,`t2`.`tnama` AS `pajak2nama`,`t2`.`tnilai` AS `pajak2nilai`,`brd`.`bnama` AS `cabangnama`,`lcd`.`lnama` AS `lokasinama`,`whd`.`wnama` AS `gudangnama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama`,`po2`.`ponotransaksi` AS `ponotransaksi`,`ipc2`.`ipcnotransaksi` AS `ipcnotransaksi`,`grn2`.`grnnotransaksi` AS `grnnotransaksi`, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan from (((((((((((((((((((((((((((((((((((`m4_ri_history` `ri` join `m4_ri_detail_history` `rid` on((`ri`.`riidhistory` = `rid`.`idhistory`))) left join `m1_branch` `br` on((`br`.`bkode` = `ri`.`ricabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `ri`.`rilokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `ri`.`rigudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `ri`.`risupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `ri`.`ribagianpembelian`))) left join `m1_terms` `tr` on((`ri`.`ritermin` = `tr`.`trkode`))) left join `m1_coa` `coa1` on((`ri`.`rirekdiskon` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`ri`.`rirekpajak1` = `coa2`.`cnomor`))) left join `m1_coa` `coa3` on((`ri`.`rirekpajak2` = `coa3`.`cnomor`))) left join `m1_coa` `coa4` on((`ri`.`rirekbiayalain` = `coa4`.`cnomor`))) left join `m1_coa` `coa5` on((`ri`.`rirekbayar` = `coa5`.`cnomor`))) left join `m4_po` `po` on((`ri`.`riidpo` = `po`.`poid`))) left join `m4_ipc` `ipc` on((`ri`.`riidipc` = `ipc`.`ipcid`))) left join `m4_grn` `grn` on((`ri`.`riidgrn` = `grn`.`grnid`))) left join `m0_status` `st1` on((`st1`.`kode` = `ri`.`ristatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `ri`.`ristatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `ri`.`riinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `ri`.`rimodifikasiuser`))) left join `m1_item` `i` on((`i`.`bid` = `rid`.`idbarang`))) left join `m1_tax` `t1` on((`rid`.`pajak1` = `t1`.`tkode`))) left join `m1_tax` `t2` on((`rid`.`pajak2` = `t2`.`tkode`))) left join `m1_branch` `brd` on((`rid`.`cabang` = `brd`.`bkode`))) left join `m1_location` `lcd` on((`rid`.`lokasi` = `lcd`.`lkode`))) left join `m1_warehouse` `whd` on((`rid`.`gudang` = `whd`.`wkode`))) left join `m1_project` `p` on((`rid`.`proyek` = `p`.`pkode`))) left join `m4_po_detail` `pod` on((`rid`.`idpodetail` = `pod`.`idpodetail`))) left join `m4_po` `po2` on((`pod`.`idpo` = `po2`.`poid`))) left join `m4_ipc_detail` `ipcd` on((`rid`.`idipcdetail` = `ipcd`.`idipcdetail`))) left join `m4_ipc` `ipc2` on((`ipcd`.`idipc` = `ipc2`.`ipcid`))) left join `m4_grn_detail` `grnd` on((`rid`.`idgrndetail` = `grnd`.`idgrndetail`))) left join `m4_grn` `grn2` on((`grnd`.`idgrn` = `grn2`.`grnid`))) left join `m1_cost_center` `cc` on((`rid`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`rid`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`rid`.`subdivisi` = `sd`.`sdkode`)))
```

## Query 95

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_ri_detail_v`

```sql
select `rid`.`idridetail` AS `idridetail`,`rid`.`idri` AS `idri`,`rid`.`idbarang` AS `idbarang`,`rid`.`namabarang` AS `namabarang`,`rid`.`tipebarang` AS `tipebarang`,`rid`.`jml` AS `jml`,`rid`.`satuan` AS `satuan`,`rid`.`nilaisatuan` AS `nilaisatuan`,`rid`.`jmlbarang` AS `jmlbarang`,`rid`.`satuanbarang` AS `satuanbarang`,`rid`.`matauang` AS `matauang`,`rid`.`kurs` AS `kurs`,`rid`.`hargafix` AS `hargafix`,`rid`.`harga` AS `harga`,`rid`.`diskon` AS `diskon`,`rid`.`jmldiskon` AS `jmldiskon`,`rid`.`pajak1` AS `pajak1`,`rid`.`jmlpajak1` AS `jmlpajak1`,`rid`.`pajak2` AS `pajak2`,`rid`.`jmlpajak2` AS `jmlpajak2`,`rid`.`cabang` AS `cabang`,`rid`.`lokasi` AS `lokasi`,`rid`.`gudang` AS `gudang`,`i`.`brekpersediaan` AS `rekpersediaan`,`i`.`brekdiskonpembelian` AS `rekdiskonpembelian`,`rid`.`rekhutangsementara` AS `rekhutangsementara`,`rid`.`costcenter` AS `costcenter`,`rid`.`divisi` AS `divisi`,`rid`.`subdivisi` AS `subdivisi`,`rid`.`proyek` AS `proyek`,`rid`.`catatan` AS `catatan`,`rid`.`urutan` AS `urutan`,`rid`.`idprdetail` AS `idprdetail`,`rid`.`idcsdetail` AS `idcsdetail`,`rid`.`idrqdetail` AS `idrqdetail`,`rid`.`idbsdetail` AS `idbsdetail`,`rid`.`idpodetail` AS `idpodetail`,`rid`.`idipcdetail` AS `idipcdetail`,`rid`.`idgrndetail` AS `idgrndetail`,`rid`.`jmldnr` AS `jmldnr`,`rid`.`statusdnr` AS `statusdnr`,`rid`.`jmlprt` AS `jmlprt`,`rid`.`statusprt` AS `statusprt`,`rid`.`jmlrealisasi` AS `jmlrealisasi`,`rid`.`statusrealisasi` AS `statusrealisasi`,`rid`.`isclose` AS `isclose`,`rid`.`customtext1` AS `customtext1`,`rid`.`customtext2` AS `customtext2`,`rid`.`customtext3` AS `customtext3`,`rid`.`customdbl1` AS `customdbl1`,`rid`.`customdbl2` AS `customdbl2`,`rid`.`customdbl3` AS `customdbl3`,`rid`.`customdate1` AS `customdate1`,`rid`.`customdate2` AS `customdate2`,`rid`.`customdate3` AS `customdate3`,`ri`.`rinotransaksi` AS `rinotransaksi`,`ri`.`riuraian` AS `riuraian`,`ri`.`ricatatan` AS `ricatatan`,`ri`.`rinoref` AS `rinoref`,`ri`.`ritgl` AS `ritgl`,`ri`.`ritglnoref` AS `ritglnoref`,`ri`.`rinofakturpajak` AS `rinofakturpajak`,`ri`.`risupplierkontak` AS `risupplierkontak`,`ri`.`ri1alamat1` AS `ri1alamat1`,`ri`.`ri1alamat2` AS `ri1alamat2`,`ri`.`ri1alamat3` AS `ri1alamat3`,`ri`.`ri2alamat1` AS `ri2alamat1`,`ri`.`ri2alamat2` AS `ri2alamat2`,`ri`.`ri2alamat3` AS `ri2alamat3`,`ri`.`ritermin` AS `ritermin`,`tr`.`trnama` AS `riterminnama`,`tr`.`trharijatuhtempo` AS `riterminharijatuhtempo`,`ri`.`ribagianpembelian` AS `ribagianpembelian`,`c1`.`kkode` AS `ribagianpembeliankode`,`c1`.`knama` AS `ribagianpembeliannama`,`i`.`bkode` AS `kodebarang`,`i`.`bhpp` AS `bhpp`,`i`.`bhppaverage` AS `bhppaverage`,`i`.`bjenis` AS `bjenis`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,`i`.`brekhargapokok` AS `rekhargapokok`,`i`.`brekreturpembelian` AS `rekreturpembelian`,`t1`.`tnama` AS `pajak1nama`,`t1`.`tnilai` AS `pajak1nilai`,`t2`.`tnama` AS `pajak2nama`,`t2`.`tnilai` AS `pajak2nilai`,`grnd`.`idgrn` AS `idgrn`,`cf`.`cfiid` AS `idhppfifomasuk`,`cf`.`cfiharga` AS `hppfifo`,`cs`.`idhppikm` AS `idhppkhususmasuk`,`cs`.`harga` AS `hppkhusus`,((`rid`.`jmlbarang` - `rid`.`jmldnr`) / `rid`.`nilaisatuan`) AS `jmlsisadnr`,((`rid`.`jmlbarang` - `rid`.`jmlprt`) / `rid`.`nilaisatuan`) AS `jmlsisaprt`,((`rid`.`jmlbarang` - `rid`.`jmlrealisasi`) / `rid`.`nilaisatuan`) AS `jmlsisarealisasi`,`ri`.`risupplier` AS `risupplier`,`c`.`kkode` AS `risupplierkode`,`c`.`knama` AS `risuppliernama`, ri.ridiskonpersen, ri.ribiayalainpersen, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan from ((((((((((`m4_ri_detail` `rid` left join `m4_ri` `ri` on((`rid`.`idri` = `ri`.`riid`))) left join `m1_terms` `tr` on((`ri`.`ritermin` = `tr`.`trkode`))) left join `m1_contact` `c1` on((`ri`.`ribagianpembelian` = `c1`.`kid`))) left join `m1_item` `i` on((`rid`.`idbarang` = `i`.`bid`))) left join `m1_tax` `t1` on((`rid`.`pajak1` = `t1`.`tkode`))) left join `m1_tax` `t2` on((`rid`.`pajak2` = `t2`.`tkode`))) left join `m1_cogs_fifo_in` `cf` on(((`rid`.`idgrndetail` = `cf`.`cfiidtransaksi`) and (`cf`.`cfisumber` = 'GRN')))) left join `m1_cogs_special_in` `cs` on(((`rid`.`idgrndetail` = `cs`.`idtransaksi`) and (`cs`.`sumber` = 'GRN')))) left join `m4_grn_detail` `grnd` on((`rid`.`idgrndetail` = `grnd`.`idgrndetail`))) left join `m1_contact` `c` on((`ri`.`risupplier` = `c`.`kid`)))
```

## Query 96

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
select `rid`.`idridetail` AS `idridetail`,`rid`.`idri` AS `idri`,`rid`.`idbarang` AS `idbarang`,`rid`.`namabarang` AS `namabarang`,`rid`.`tipebarang` AS `tipebarang`,`rid`.`jml` AS `jml`,`rid`.`satuan` AS `satuan`,`rid`.`nilaisatuan` AS `nilaisatuan`,`rid`.`jmlbarang` AS `jmlbarang`,`rid`.`satuanbarang` AS `satuanbarang`,`rid`.`matauang` AS `matauang`,`rid`.`kurs` AS `kurs`,`rid`.`hargafix` AS `hargafix`,`rid`.`harga` AS `harga`,`rid`.`diskon` AS `diskon`,`rid`.`jmldiskon` AS `jmldiskon`,`rid`.`pajak1` AS `pajak1`,`rid`.`jmlpajak1` AS `jmlpajak1`,`rid`.`pajak2` AS `pajak2`,`rid`.`jmlpajak2` AS `jmlpajak2`,`rid`.`cabang` AS `cabang`,`rid`.`lokasi` AS `lokasi`,`rid`.`gudang` AS `gudang`,`i`.`brekpersediaan` AS `rekpersediaan`,`i`.`brekdiskonpembelian` AS `rekdiskonpembelian`,`rid`.`rekhutangsementara` AS `rekhutangsementara`,`rid`.`costcenter` AS `costcenter`,`rid`.`divisi` AS `divisi`,`rid`.`subdivisi` AS `subdivisi`,`rid`.`proyek` AS `proyek`,`rid`.`catatan` AS `catatan`,`rid`.`urutan` AS `urutan`,`rid`.`idprdetail` AS `idprdetail`,`rid`.`idcsdetail` AS `idcsdetail`,`rid`.`idrqdetail` AS `idrqdetail`,`rid`.`idbsdetail` AS `idbsdetail`,`rid`.`idpodetail` AS `idpodetail`,`rid`.`idipcdetail` AS `idipcdetail`,`rid`.`idgrndetail` AS `idgrndetail`,`rid`.`jmldnr` AS `jmldnr`,`rid`.`statusdnr` AS `statusdnr`,`rid`.`jmlprt` AS `jmlprt`,`rid`.`statusprt` AS `statusprt`,`rid`.`jmlrealisasi` AS `jmlrealisasi`,`rid`.`statusrealisasi` AS `statusrealisasi`,`rid`.`isclose` AS `isclose`,`rid`.`customtext1` AS `customtext1`,`rid`.`customtext2` AS `customtext2`,`rid`.`customtext3` AS `customtext3`,`rid`.`customdbl1` AS `customdbl1`,`rid`.`customdbl2` AS `customdbl2`,`rid`.`customdbl3` AS `customdbl3`,`rid`.`customdate1` AS `customdate1`,`rid`.`customdate2` AS `customdate2`,`rid`.`customdate3` AS `customdate3`,`ri`.`rinotransaksi` AS `rinotransaksi`,`ri`.`riuraian` AS `riuraian`,`ri`.`ricatatan` AS `ricatatan`,`ri`.`rinoref` AS `rinoref`,`ri`.`ritgl` AS `ritgl`,`ri`.`ritglnoref` AS `ritglnoref`,`ri`.`rinofakturpajak` AS `rinofakturpajak`,`ri`.`risupplierkontak` AS `risupplierkontak`,`ri`.`ri1alamat1` AS `ri1alamat1`,`ri`.`ri1alamat2` AS `ri1alamat2`,`ri`.`ri1alamat3` AS `ri1alamat3`,`ri`.`ri2alamat1` AS `ri2alamat1`,`ri`.`ri2alamat2` AS `ri2alamat2`,`ri`.`ri2alamat3` AS `ri2alamat3`,`ri`.`ritermin` AS `ritermin`,`tr`.`trnama` AS `riterminnama`,`tr`.`trharijatuhtempo` AS `riterminharijatuhtempo`,`ri`.`ribagianpembelian` AS `ribagianpembelian`,`c1`.`kkode` AS `ribagianpembeliankode`,`c1`.`knama` AS `ribagianpembeliannama`,`i`.`bkode` AS `kodebarang`,`i`.`bhpp` AS `bhpp`,`i`.`bhppaverage` AS `bhppaverage`,`i`.`bjenis` AS `bjenis`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,`i`.`brekhargapokok` AS `rekhargapokok`,`i`.`brekreturpembelian` AS `rekreturpembelian`,`t1`.`tnama` AS `pajak1nama`,`t1`.`tnilai` AS `pajak1nilai`,`t2`.`tnama` AS `pajak2nama`,`t2`.`tnilai` AS `pajak2nilai`,`grnd`.`idgrn` AS `idgrn`,`cf`.`cfiid` AS `idhppfifomasuk`,`cf`.`cfiharga` AS `hppfifo`,`cs`.`idhppikm` AS `idhppkhususmasuk`,`cs`.`harga` AS `hppkhusus`,((`rid`.`jmlbarang` - `rid`.`jmldnr`) / `rid`.`nilaisatuan`) AS `jmlsisadnr`,((`rid`.`jmlbarang` - `rid`.`jmlprt`) / `rid`.`nilaisatuan`) AS `jmlsisaprt`,((`rid`.`jmlbarang` - `rid`.`jmlrealisasi`) / `rid`.`nilaisatuan`) AS `jmlsisarealisasi`,`ri`.`risupplier` AS `risupplier`,`c`.`kkode` AS `risupplierkode`,`c`.`knama` AS `risuppliernama`, ri.ridiskonpersen, ri.ribiayalainpersen, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan, i.basset, ri.ricustomtext1, ri.ricustomtext2, t1.takunbeli as pajak1akunbeli, t1c1.cnama as pajak1akunbelinama, t1.takunjual as pajak1akunjual, t1c2.cnama as pajak1akunjualnama, t2.takunbeli as pajak2akunbeli, t2c1.cnama as pajak2akunbelinama, t2.takunjual as pajak2akunjual, t2c2.cnama as pajak2akunjualnama, d.dnama AS divisinama, sd.sdnama AS subdivisinama, cc.ccnama AS costcenternama, p.pnama AS proyeknama from `m4_ri_detail` `rid` join `m4_ri` `ri` on `rid`.`idri` = `ri`.`riid` left join `m1_terms` `tr` on `ri`.`ritermin` = `tr`.`trkode` left join `m1_contact` `c1` on `ri`.`ribagianpembelian` = `c1`.`kid` left join `m1_item` `i` on `rid`.`idbarang` = `i`.`bid` left join `m1_tax` `t1` on `rid`.`pajak1` = `t1`.`tkode` left join `m1_tax` `t2` on `rid`.`pajak2` = `t2`.`tkode` left join `m1_cogs_fifo_in` `cf` on (`rid`.`idgrndetail` = `cf`.`cfiidtransaksi`) and (`cf`.`cfisumber` = 'RI') left join `m1_cogs_special_in` `cs` on (`rid`.`idgrndetail` = `cs`.`idtransaksi`) and (`cs`.`sumber` = 'RI') left join `m4_grn_detail` `grnd` on `rid`.`idgrndetail` = `grnd`.`idgrndetail` left join `m1_contact` `c` on `ri`.`risupplier` = `c`.`kid` left join m1_coa t1c1 on t1.takunbeli = t1c1.cnomor left join m1_coa t1c2 on t1.takunjual = t1c2.cnomor left join m1_coa t2c1 on t2.takunbeli = t2c1.cnomor left join m1_coa t2c2 on t2.takunjual = t2c2.cnomor LEFT JOIN m1_division d ON d.dkode = rid.divisi LEFT JOIN m1_subdivision sd ON sd.sdkode = rid.subdivisi LEFT JOIN m1_cost_center cc ON cc.cckode = rid.costcenter LEFT JOIN m1_project p ON p.pkode = rid.proyek
```

## Query 97

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_ri_detail_cd`

```sql
select `rid`.`idridetail` AS `idridetail`,`rid`.`idri` AS `idri`,`rid`.`idbarang` AS `idbarang`,`rid`.`namabarang` AS `namabarang`,`rid`.`tipebarang` AS `tipebarang`,`rid`.`jml` AS `jml`,`rid`.`satuan` AS `satuan`,`rid`.`nilaisatuan` AS `nilaisatuan`,`rid`.`jmlbarang` AS `jmlbarang`,`rid`.`satuanbarang` AS `satuanbarang`,`rid`.`matauang` AS `matauang`,`rid`.`kurs` AS `kurs`,`rid`.`hargafix` AS `hargafix`,`rid`.`harga` AS `harga`,`rid`.`diskon` AS `diskon`,`rid`.`jmldiskon` AS `jmldiskon`,`rid`.`pajak1` AS `pajak1`,`rid`.`pajak2` AS `pajak2`,`rid`.`catatan` AS `catatan`,`ri`.`rinotransaksi` AS `rinotransaksi`,`i`.`bkode` AS `kodebarang`,((`rid`.`jmlbarang` - `rid`.`jmldnr`) / `rid`.`nilaisatuan`) AS `jmlsisadnr`,((`rid`.`jmlbarang` - `rid`.`jmlprt`) / `rid`.`nilaisatuan`) AS `jmlsisaprt`,((`rid`.`jmlbarang` - `rid`.`jmlrealisasi`) / `rid`.`nilaisatuan`) AS `jmlsisarealisasi`, `i`.`btag` AS `btag`, tag.ipjual AS btagjual, tag.ipmutasipusat AS btagmutasipusat, tag.ippermintaanmutasi AS btagpermintaanmutasi ,tag.ipmutasicabang AS btagmutasicabang, tag.ipretursupplier AS btagretursupplier, tag.ippermintaanpembelian AS btagpermintaanpembelian from ((`m4_ri_detail` `rid` left join `m4_ri` `ri` on((`rid`.`idri` = `ri`.`riid`))) left join `m1_item` `i` on((`rid`.`idbarang` = `i`.`bid`)) JOIN m1_item_permission `tag` ON `tag`.`ipkode` = `i`.`btag`)
```

## Query 98

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`, `client-backend/api-myerpplus/app_code/ws/m4/m4_ri_history.vb`

```sql
select atr.atid AS atid, atr.atasetid AS atasetid, atr.atjenismutasi AS atjenismutasi, atr.atsumber AS atsumber, atr.atidutama AS atidutama,atr.atidbarang AS atidbarang,atr.atkode AS atkode, atr.atnama AS atnama, atr.atkategori AS atkategori, atr.atcabang AS atcabang, atr.atlokasi AS atlokasi, atr.atgudang AS atgudang,atr.atdivisi AS atdivisi, atr.atsubdivisi AS atsubdivisi, atr.atcostcenter AS atcostcenter, atr.atproyek AS atproyek, atr.atcatatan AS atcatatan, atr.atnomor AS atnomor, atr.attglbeli AS attglbeli, atr.attglpakai AS attglpakai, atr.atjml AS atjml, atr.atsatuan AS atsatuan, atr.atmatauang AS atmatauang, atr.atkurs AS atkurs, atr.atharga AS atharga, atr.atdiskon AS atdiskon, atr.atjmldiskon AS atjmldiskon, atr.atpajak1 AS atpajak1, atr.atjmlpajak1 AS atjmlpajak1, atr.atpajak2 AS atpajak2, atr.atjmlpajak2 AS atjmlpajak2, atr.athargabeli AS athargabeli, atr.atnilairesidu AS atnilairesidu, atr.atumurekonomis AS atumurekonomis, atr.atbebanperbln AS atbebanperbln, atr.atakumulasibeban AS atakumulasibeban, atr.atnilaibuku AS atnilaibuku, (CASE WHEN atr.atnilaibuku < atr.atbebanperbln THEN atr.atnilaibuku ELSE atr.atbebanperbln END) as atnilaipenyusutan, atr.atmetode AS atmetode, atr.attabelpenyusutan AS attabelpenyusutan, atr.atintangible AS atintangible, atr.atfiskal AS atfiskal, atr.atatastengahbulan AS atatastengahbulan, atr.atrekasset AS atrekasset, atr.atrekakumdepresiasi AS atrekakumdepresiasi, atr.atrekdepresiasi AS atrekdepresiasi, atr.atrekpenghapusan AS atrekpenghapusan, atr.atprodusen AS atprodusen, atr.attglpensiun AS attglpensiun, atr.atpenyusutanke AS atpenyusutanke, atr.atnilaimenurun AS atnilaimenurun, atr.atdispose AS atdispose, atr.atpembelian AS atpembelian, atr.atpenjualan AS atpenjualan, atr.atlocked AS atlocked, atr.atstatus AS atstatus, atr.atstatussebelumnya AS atstatussebelumnya, atr.atisclose AS atisclose, atr.atinputuser AS atinputuser, atr.atinputtgl AS atinputtgl, atr.atmodifikasiuser AS atmodifikasiuser, atr.atmodifikasitgl AS atmodifikasitgl, atr.atcustomtext1,atr.atcustomtext2,atr.atcustomtext3,atr.atcustomtext4,atr.atcustomtext5,atr.atcustomint1,atr.atcustomint2,atr.atcustomint3,atr.atcustomint4,atr.atcustomint5,atr.atcustomdbl1,atr.atcustomdbl2,atr.atcustomdbl3,atr.atcustomdbl4,atr.atcustomdbl5,atr.atcustomdate1,atr.atcustomdate2,atr.atcustomdate3,atr.atcustomdate4,atr.atcustomdate5,ac.acnama AS atkategorinama, br.bnama AS atcabangnama, l.lnama AS atlokasinama, w.wnama AS atgudangnama,d.dnama AS atdivisinama, sd.sdnama AS atsubdivisinama, cc.ccnama AS atcostcenternama, p.pnama AS atproyeknama, dc.nama AS atmetodenama, t1.tnama AS atpajak1nama, ifnull(t1.tnilai, 0) AS atpajak1nilai, t2.tnama AS atpajak2nama, ifnull(t2.tnilai, 0) AS atpajak2nilai,coa1.cnama AS atrekassetnama, coa2.cnama AS atrekakumdepresiasinama, coa3.cnama AS atrekdepresiasinama, coa4.cnama AS atrekpenghapusannama, c1.kkode AS atprodusenkode, c1.knama AS atprodusennama, sp1.nama AS atstatusnama, sp2.nama AS atstatussebelumnyanama, u1.unama AS atinputusernama, u2.unama AS atmodifikasiusernama, i.bkode as kodebarang from m7_asset_transaction atr left join m7_asset_category ac on atr.atkategori = ac.ackode left join m1_branch br on atr.atcabang = br.bkode left join m1_location l on atr.atlokasi = l.lkode left join m1_warehouse w on atr.atgudang = w.wkode left join m1_division d on atr.atdivisi = d.dkode left join m1_subdivision sd on atr.atsubdivisi = sd.sdkode left join m7_depreciation_category dc on atr.atmetode = dc.kode left join m1_coa coa1 on atr.atrekasset = coa1.cnomor left join m1_coa coa2 on atr.atrekakumdepresiasi = coa2.cnomor left join m1_coa coa3 on atr.atrekdepresiasi = coa3.cnomor left join m1_coa coa4 on atr.atrekpenghapusan = coa4.cnomor left join m1_contact c1 on atr.atprodusen = c1.kid left join m0_status_progress sp1 on atr.atstatus = sp1.kode left join m0_status_progress sp2 on atr.atstatussebelumnya = sp2.kode left join m0_user u1 on atr.atinputuser = u1.userid left join m0_user u2 on atr.atmodifikasiuser = u2.userid left join m1_cost_center cc on atr.atcostcenter = cc.cckode left join m1_project p on atr.atproyek = p.pkode left join m1_tax t1 on atr.atpajak1 = t1.tkode left join m1_tax t2 on atr.atpajak2 = t2.tkode JOIN m1_item i ON i.bid = atr.atidbarang
```

## Query 99

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri.vb`

```sql
select ri.riid AS riid,ri.ricabang AS ricabang,ri.rilokasi AS rilokasi,ri.rigudang AS rigudang,ri.riasalbarang AS riasalbarang,ri.riasalbarangkategori AS riasalbarangkategori,ri.rijenispembelian AS rijenispembelian,ri.rijenispembeliankategori AS rijenispembeliankategori,ri.ricarabayar AS ricarabayar,ri.risumber AS risumber,ri.riautonotransaksi AS riautonotransaksi,ri.rinotransaksi AS rinotransaksi,ri.ritgl AS ritgl,ri.rikodepa AS rikodepa,ri.risupplier AS risupplier,ri.risupplierkontak AS risupplierkontak,ri.ri1alamat1 AS ri1alamat1,ri.ri1alamat2 AS ri1alamat2,ri.ri1alamat3 AS ri1alamat3,ri.ri2alamat1 AS ri2alamat1,ri.ri2alamat2 AS ri2alamat2,ri.ri2alamat3 AS ri2alamat3,ri.ribagianpembelian AS ribagianpembelian,ri.ritermin AS ritermin,ri.ritgljatuhtempo AS ritgljatuhtempo,ri.riuraian AS riuraian,ri.ricatatan AS ricatatan,ri.rinoref AS rinoref,ri.ritglnoref AS ritglnoref,ri.ritglpenutupan AS ritglpenutupan,ri.rimatauang AS rimatauang,ri.rikurs AS rikurs,ri.rihargatermasukpajak AS rihargatermasukpajak,ri.ritotal AS ritotal,ri.ridiskonpersen AS ridiskonpersen,ri.rijmldiskon AS rijmldiskon,ri.ritotalpajak1detail AS ritotalpajak1detail,ri.ritotalpajak2detail AS ritotalpajak2detail,ri.ribiayalainpersen AS ribiayalainpersen,ri.ribiayalain AS ribiayalain,ri.ritotaltransaksi AS ritotaltransaksi,ri.rijmlbayar AS rijmlbayar,ri.ristatuslunas AS ristatuslunas,ri.ritgllunas AS ritgllunas,ri.rinofakturpajak AS rinofakturpajak,ri.risdhbayarpajak AS risdhbayarpajak,ri.ritglbayarpajak AS ritglbayarpajak,ri.rirekdiskon AS rirekdiskon,ri.rirekpajak1 AS rirekpajak1,ri.rirekpajak2 AS rirekpajak2,ri.rirekbiayalain AS rirekbiayalain,ri.rirekbayar AS rirekbayar,ri.riidpr AS riidpr,ri.riidcs AS riidcs,ri.riidrq AS riidrq,ri.riidbs AS riidbs,ri.riidpo AS riidpo,ri.riidipc AS riidipc,ri.riidgrn AS riidgrn,ri.ristatusdnr AS ristatusdnr,ri.ristatusprt AS ristatusprt,ri.ristatusrealisasi AS ristatusrealisasi,ri.ristatus AS ristatus,ri.ristatussebelumnya AS ristatussebelumnya,ri.rijmlrevisi AS rijmlrevisi,ri.ricetakanke AS ricetakanke,ri.riinputuser AS riinputuser,ri.riinputtgl AS riinputtgl,ri.rimodifikasiuser AS rimodifikasiuser,ri.rimodifikasitgl AS rimodifikasitgl,ri.riposting AS riposting,ri.ripostingtgl AS ripostingtgl,ri.ritutupperiode AS ritutupperiode,ri.riisclose AS riisclose,ri.ricustomtext1 AS ricustomtext1,ri.ricustomtext2 AS ricustomtext2,ri.ricustomtext3 AS ricustomtext3,ri.ricustomtext4 AS ricustomtext4,ri.ricustomtext5 AS ricustomtext5,ri.ricustomint1 AS ricustomint1,ri.ricustomint2 AS ricustomint2,ri.ricustomint3 AS ricustomint3,ri.ricustomdbl1 AS ricustomdbl1,ri.ricustomdbl2 AS ricustomdbl2,ri.ricustomdbl3 AS ricustomdbl3,ri.ricustomdate1 AS ricustomdate1,ri.ricustomdate2 AS ricustomdate2,ri.ricustomdate3 AS ricustomdate3,br.bnama AS ricabangnama,lc.lnama AS rilokasinama,wh.wnama AS rigudangnama,c1.kkode AS risupplierkode,c1.knama AS risuppliernama,c2.kkode AS ribagianpembeliankode,c2.knama AS ribagianpembeliannama,tr.trnama AS riterminnama,tr.trharijatuhtempo AS riterminharijatuhtempo,coa1.cnama AS rirekdiskonnama,coa2.cnama AS rirekpajak1nama,coa3.cnama AS rirekpajak2nama,coa4.cnama AS rirekbiayalainnama,coa5.cnama AS rirekbayarnama,po.ponotransaksi AS rinotransaksipo,ipc.ipcnotransaksi AS rinotransaksiipc,grn.grnnotransaksi AS rinotransaksigrn,st1.nama AS ristatusnama,st2.nama AS ristatussebelumnyanama,u1.unama AS riinputusernama,u2.unama AS rimodifikasiusernama,rid.idridetail AS idridetail,rid.idri AS idri,rid.idbarang AS idbarang,rid.namabarang AS namabarang,rid.tipebarang AS tipebarang,rid.jml AS jml,rid.satuan AS satuan,rid.nilaisatuan AS nilaisatuan,rid.jmlbarang AS jmlbarang,rid.satuanbarang AS satuanbarang,rid.matauang AS matauang,rid.kurs AS kurs,rid.hargafix AS hargafix,rid.harga AS harga,rid.diskon AS diskon,rid.jmldiskon AS jmldiskon,rid.pajak1 AS pajak1,rid.jmlpajak1 AS jmlpajak1,rid.pajak2 AS pajak2,rid.jmlpajak2 AS jmlpajak2,rid.cabang AS cabang,rid.lokasi AS lokasi,rid.gudang AS gudang,i.brekpersediaan AS rekpersediaan,i.brekdiskonpembelian AS rekdiskonpembelian,rid.rekhutangsementara AS rekhutangsementara,rid.costcenter AS costcenter,rid.divisi AS divisi,rid.subdivisi AS subdivisi,rid.proyek AS proyek,rid.catatan AS catatan,rid.urutan AS urutan,rid.idprdetail AS idprdetail,rid.idcsdetail AS idcsdetail,rid.idrqdetail AS idrqdetail,rid.idbsdetail AS idbsdetail,rid.idpodetail AS idpodetail,rid.idipcdetail AS idipcdetail,rid.idgrndetail AS idgrndetail,rid.jmldnr AS jmldnr,rid.statusdnr AS statusdnr,rid.jmlprt AS jmlprt,rid.statusprt AS statusprt,rid.jmlrealisasi AS jmlrealisasi,rid.statusrealisasi AS statusrealisasi,rid.isclose AS isclose,rid.customtext1 AS customtext1,rid.customtext2 AS customtext2,rid.customtext3 AS customtext3,rid.customdbl1 AS customdbl1,rid.customdbl2 AS customdbl2,rid.customdbl3 AS customdbl3,rid.customdate1 AS customdate1,rid.customdate2 AS customdate2,rid.customdate3 AS customdate3,i.bkode AS kodebarang,i.bhpp AS bhpp,i.bjenis AS bjenis,i.bserial AS bserial,i.bbatch AS bbatch,i.basset AS basset,t1.tnama AS pajak1nama,t1.tnilai AS pajak1nilai,t2.tnama AS pajak2nama,t2.tnilai AS pajak2nilai,brd.bnama AS cabangnama,lcd.lnama AS lokasinama,whd.wnama AS gudangnama,cc.ccnama AS costcenternama,d.dnama AS divisinama,sd.sdnama AS subdivisinama,p.pnama AS proyeknama,po2.ponotransaksi AS ponotransaksi,ipc2.ipcnotransaksi AS ipcnotransaksi,grn2.grnnotransaksi AS grnnotransaksi, c1.kpkp, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan, ri.rijmluangmuka, ri.rirekuangmuka, ri.riidap, coa6.cnama as rirekuangmukanama, ap.apnotransaksi as apnotransaksi from m4_ri ri join m4_ri_detail rid on ri.riid = rid.idri left join m1_branch br on br.bkode = ri.ricabang left join m1_location lc on lc.lkode = ri.rilokasi left join m1_warehouse wh on wh.wkode = ri.rigudang left join m1_contact c1 on c1.kid = ri.risupplier left join m1_contact c2 on c2.kid = ri.ribagianpembelian left join m1_terms tr on ri.ritermin = tr.trkode left join m1_coa coa1 on ri.rirekdiskon = coa1.cnomor left join m1_coa coa2 on ri.rirekpajak1 = coa2.cnomor left join m1_coa coa3 on ri.rirekpajak2 = coa3.cnomor left join m1_coa coa4 on ri.rirekbiayalain = coa4.cnomor left join m1_coa coa5 on ri.rirekbayar = coa5.cnomor left join m4_po po on ri.riidpo = po.poid left join m4_ipc ipc on ri.riidipc = ipc.ipcid left join m4_grn grn on ri.riidgrn = grn.grnid left join m0_status st1 on st1.kode = ri.ristatus left join m0_status st2 on st2.kode = ri.ristatussebelumnya left join m0_user u1 on u1.userid = ri.riinputuser left join m0_user u2 on u2.userid = ri.rimodifikasiuser left join m1_item i on i.bid = rid.idbarang left join m1_tax t1 on rid.pajak1 = t1.tkode left join m1_tax t2 on rid.pajak2 = t2.tkode left join m1_branch brd on rid.cabang = brd.bkode left join m1_location lcd on rid.lokasi = lcd.lkode left join m1_warehouse whd on rid.gudang = whd.wkode left join m1_project p on rid.proyek = p.pkode left join m4_po_detail pod on rid.idpodetail = pod.idpodetail left join m4_po po2 on pod.idpo = po2.poid left join m4_ipc_detail ipcd on rid.idipcdetail = ipcd.idipcdetail left join m4_ipc ipc2 on ipcd.idipc = ipc2.ipcid left join m4_grn_detail grnd on rid.idgrndetail = grnd.idgrndetail left join m4_grn grn2 on grnd.idgrn = grn2.grnid left join m1_cost_center cc on rid.costcenter = cc.cckode left join m1_division d on rid.divisi = d.dkode left join m1_subdivision sd on rid.subdivisi = sd.sdkode left join m1_coa coa6 on ri.rirekuangmuka = coa6.cnomor left join m4_ap ap on ri.riidap = ap.apid
```

## Query 100

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri_history.vb`

```sql
select ri.riid AS riid,ri.ricabang AS ricabang,ri.rilokasi AS rilokasi,ri.rigudang AS rigudang,ri.riasalbarang AS riasalbarang,ri.riasalbarangkategori AS riasalbarangkategori,ri.rijenispembelian AS rijenispembelian,ri.rijenispembeliankategori AS rijenispembeliankategori,ri.ricarabayar AS ricarabayar,ri.risumber AS risumber,ri.riautonotransaksi AS riautonotransaksi,ri.rinotransaksi AS rinotransaksi,ri.ritgl AS ritgl,ri.rikodepa AS rikodepa,ri.risupplier AS risupplier,ri.risupplierkontak AS risupplierkontak,ri.ri1alamat1 AS ri1alamat1,ri.ri1alamat2 AS ri1alamat2,ri.ri1alamat3 AS ri1alamat3,ri.ri2alamat1 AS ri2alamat1,ri.ri2alamat2 AS ri2alamat2,ri.ri2alamat3 AS ri2alamat3,ri.ribagianpembelian AS ribagianpembelian,ri.ritermin AS ritermin,ri.ritgljatuhtempo AS ritgljatuhtempo,ri.riuraian AS riuraian,ri.ricatatan AS ricatatan,ri.rinoref AS rinoref,ri.ritglnoref AS ritglnoref,ri.ritglpenutupan AS ritglpenutupan,ri.rimatauang AS rimatauang,ri.rikurs AS rikurs,ri.rihargatermasukpajak AS rihargatermasukpajak,ri.ritotal AS ritotal,ri.ridiskonpersen AS ridiskonpersen,ri.rijmldiskon AS rijmldiskon,ri.ritotalpajak1detail AS ritotalpajak1detail,ri.ritotalpajak2detail AS ritotalpajak2detail,ri.ribiayalainpersen AS ribiayalainpersen,ri.ribiayalain AS ribiayalain,ri.ritotaltransaksi AS ritotaltransaksi,ri.rijmlbayar AS rijmlbayar,ri.ristatuslunas AS ristatuslunas,ri.ritgllunas AS ritgllunas,ri.rinofakturpajak AS rinofakturpajak,ri.risdhbayarpajak AS risdhbayarpajak,ri.ritglbayarpajak AS ritglbayarpajak,ri.rirekdiskon AS rirekdiskon,ri.rirekpajak1 AS rirekpajak1,ri.rirekpajak2 AS rirekpajak2,ri.rirekbiayalain AS rirekbiayalain,ri.rirekbayar AS rirekbayar,ri.riidpr AS riidpr,ri.riidcs AS riidcs,ri.riidrq AS riidrq,ri.riidbs AS riidbs,ri.riidpo AS riidpo,ri.riidipc AS riidipc,ri.riidgrn AS riidgrn,ri.ristatusdnr AS ristatusdnr,ri.ristatusprt AS ristatusprt,ri.ristatusrealisasi AS ristatusrealisasi,ri.ristatus AS ristatus,ri.ristatussebelumnya AS ristatussebelumnya,ri.rijmlrevisi AS rijmlrevisi,ri.ricetakanke AS ricetakanke,ri.riinputuser AS riinputuser,ri.riinputtgl AS riinputtgl,ri.rimodifikasiuser AS rimodifikasiuser,ri.rimodifikasitgl AS rimodifikasitgl,ri.riposting AS riposting,ri.ripostingtgl AS ripostingtgl,ri.ritutupperiode AS ritutupperiode,ri.riisclose AS riisclose,ri.ricustomtext1 AS ricustomtext1,ri.ricustomtext2 AS ricustomtext2,ri.ricustomtext3 AS ricustomtext3,ri.ricustomtext4 AS ricustomtext4,ri.ricustomtext5 AS ricustomtext5,ri.ricustomint1 AS ricustomint1,ri.ricustomint2 AS ricustomint2,ri.ricustomint3 AS ricustomint3,ri.ricustomdbl1 AS ricustomdbl1,ri.ricustomdbl2 AS ricustomdbl2,ri.ricustomdbl3 AS ricustomdbl3,ri.ricustomdate1 AS ricustomdate1,ri.ricustomdate2 AS ricustomdate2,ri.ricustomdate3 AS ricustomdate3,br.bnama AS ricabangnama,lc.lnama AS rilokasinama,wh.wnama AS rigudangnama,c1.kkode AS risupplierkode,c1.knama AS risuppliernama,c2.kkode AS ribagianpembeliankode,c2.knama AS ribagianpembeliannama,tr.trnama AS riterminnama,tr.trharijatuhtempo AS riterminharijatuhtempo,coa1.cnama AS rirekdiskonnama,coa2.cnama AS rirekpajak1nama,coa3.cnama AS rirekpajak2nama,coa4.cnama AS rirekbiayalainnama,coa5.cnama AS rirekbayarnama,po.ponotransaksi AS rinotransaksipo,ipc.ipcnotransaksi AS rinotransaksiipc,grn.grnnotransaksi AS rinotransaksigrn,st1.nama AS ristatusnama,st2.nama AS ristatussebelumnyanama,u1.unama AS riinputusernama,u2.unama AS rimodifikasiusernama,rid.idridetail AS idridetail,rid.idri AS idri,rid.idbarang AS idbarang,rid.namabarang AS namabarang,rid.tipebarang AS tipebarang,rid.jml AS jml,rid.satuan AS satuan,rid.nilaisatuan AS nilaisatuan,rid.jmlbarang AS jmlbarang,rid.satuanbarang AS satuanbarang,rid.matauang AS matauang,rid.kurs AS kurs,rid.hargafix AS hargafix,rid.harga AS harga,rid.diskon AS diskon,rid.jmldiskon AS jmldiskon,rid.pajak1 AS pajak1,rid.jmlpajak1 AS jmlpajak1,rid.pajak2 AS pajak2,rid.jmlpajak2 AS jmlpajak2,rid.cabang AS cabang,rid.lokasi AS lokasi,rid.gudang AS gudang,i.brekpersediaan AS rekpersediaan,i.brekdiskonpembelian AS rekdiskonpembelian,rid.rekhutangsementara AS rekhutangsementara,rid.costcenter AS costcenter,rid.divisi AS divisi,rid.subdivisi AS subdivisi,rid.proyek AS proyek,rid.catatan AS catatan,rid.urutan AS urutan,rid.idprdetail AS idprdetail,rid.idcsdetail AS idcsdetail,rid.idrqdetail AS idrqdetail,rid.idbsdetail AS idbsdetail,rid.idpodetail AS idpodetail,rid.idipcdetail AS idipcdetail,rid.idgrndetail AS idgrndetail,rid.jmldnr AS jmldnr,rid.statusdnr AS statusdnr,rid.jmlprt AS jmlprt,rid.statusprt AS statusprt,rid.jmlrealisasi AS jmlrealisasi,rid.statusrealisasi AS statusrealisasi,rid.isclose AS isclose,rid.customtext1 AS customtext1,rid.customtext2 AS customtext2,rid.customtext3 AS customtext3,rid.customdbl1 AS customdbl1,rid.customdbl2 AS customdbl2,rid.customdbl3 AS customdbl3,rid.customdate1 AS customdate1,rid.customdate2 AS customdate2,rid.customdate3 AS customdate3,i.bkode AS kodebarang,i.bhpp AS bhpp,i.bjenis AS bjenis,i.bserial AS bserial,i.bbatch AS bbatch,i.basset AS basset,t1.tnama AS pajak1nama,t1.tnilai AS pajak1nilai,t2.tnama AS pajak2nama,t2.tnilai AS pajak2nilai,brd.bnama AS cabangnama,lcd.lnama AS lokasinama,whd.wnama AS gudangnama,cc.ccnama AS costcenternama,d.dnama AS divisinama,sd.sdnama AS subdivisinama,p.pnama AS proyeknama,po2.ponotransaksi AS ponotransaksi,ipc2.ipcnotransaksi AS ipcnotransaksi,grn2.grnnotransaksi AS grnnotransaksi, c1.kpkp, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan, ri.rijmluangmuka, ri.rirekuangmuka, ri.riidap, coa6.cnama as rirekuangmukanama, ap.apnotransaksi as apnotransaksi from m4_ri_history ri left join m4_ri_detail_history rid on ri.riid = rid.idri left join m1_branch br on br.bkode = ri.ricabang left join m1_location lc on lc.lkode = ri.rilokasi left join m1_warehouse wh on wh.wkode = ri.rigudang left join m1_contact c1 on c1.kid = ri.risupplier left join m1_contact c2 on c2.kid = ri.ribagianpembelian left join m1_terms tr on ri.ritermin = tr.trkode left join m1_coa coa1 on ri.rirekdiskon = coa1.cnomor left join m1_coa coa2 on ri.rirekpajak1 = coa2.cnomor left join m1_coa coa3 on ri.rirekpajak2 = coa3.cnomor left join m1_coa coa4 on ri.rirekbiayalain = coa4.cnomor left join m1_coa coa5 on ri.rirekbayar = coa5.cnomor left join m4_po po on ri.riidpo = po.poid left join m4_ipc ipc on ri.riidipc = ipc.ipcid left join m4_grn grn on ri.riidgrn = grn.grnid left join m0_status st1 on st1.kode = ri.ristatus left join m0_status st2 on st2.kode = ri.ristatussebelumnya left join m0_user u1 on u1.userid = ri.riinputuser left join m0_user u2 on u2.userid = ri.rimodifikasiuser left join m1_item i on i.bid = rid.idbarang left join m1_tax t1 on rid.pajak1 = t1.tkode left join m1_tax t2 on rid.pajak2 = t2.tkode left join m1_branch brd on rid.cabang = brd.bkode left join m1_location lcd on rid.lokasi = lcd.lkode left join m1_warehouse whd on rid.gudang = whd.wkode left join m1_project p on rid.proyek = p.pkode left join m4_po_detail pod on rid.idpodetail = pod.idpodetail left join m4_po po2 on pod.idpo = po2.poid left join m4_ipc_detail ipcd on rid.idipcdetail = ipcd.idipcdetail left join m4_ipc ipc2 on ipcd.idipc = ipc2.ipcid left join m4_grn_detail grnd on rid.idgrndetail = grnd.idgrndetail left join m4_grn grn2 on grnd.idgrn = grn2.grnid left join m1_cost_center cc on rid.costcenter = cc.cckode left join m1_division d on rid.divisi = d.dkode left join m1_subdivision sd on rid.subdivisi = sd.sdkode left join m1_coa coa6 on ri.rirekuangmuka = coa6.cnomor left join m4_ap ap on ri.riidap = ap.apid
```

## Query 101

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri_history.vb`

```sql
select ri.riidhistory, `ri`.`riid` AS `riid`,`ri`.`ricabang` AS `ricabang`,`ri`.`rilokasi` AS `rilokasi`,`ri`.`rigudang` AS `rigudang`,`ri`.`riasalbarang` AS `riasalbarang`,`ri`.`riasalbarangkategori` AS `riasalbarangkategori`,`ri`.`rijenispembelian` AS `rijenispembelian`,`ri`.`rijenispembeliankategori` AS `rijenispembeliankategori`,`ri`.`ricarabayar` AS `ricarabayar`,`ri`.`risumber` AS `risumber`,`ri`.`riautonotransaksi` AS `riautonotransaksi`,`ri`.`rinotransaksi` AS `rinotransaksi`,`ri`.`ritgl` AS `ritgl`,`ri`.`rikodepa` AS `rikodepa`,`ri`.`risupplier` AS `risupplier`,`ri`.`risupplierkontak` AS `risupplierkontak`,`ri`.`ri1alamat1` AS `ri1alamat1`,`ri`.`ri1alamat2` AS `ri1alamat2`,`ri`.`ri1alamat3` AS `ri1alamat3`,`ri`.`ri2alamat1` AS `ri2alamat1`,`ri`.`ri2alamat2` AS `ri2alamat2`,`ri`.`ri2alamat3` AS `ri2alamat3`,`ri`.`ribagianpembelian` AS `ribagianpembelian`,`ri`.`ritermin` AS `ritermin`,`ri`.`ritgljatuhtempo` AS `ritgljatuhtempo`,`ri`.`riuraian` AS `riuraian`,`ri`.`ricatatan` AS `ricatatan`,`ri`.`rinoref` AS `rinoref`,`ri`.`ritglnoref` AS `ritglnoref`,`ri`.`ritglpenutupan` AS `ritglpenutupan`,`ri`.`rimatauang` AS `rimatauang`,`ri`.`rikurs` AS `rikurs`,`ri`.`rihargatermasukpajak` AS `rihargatermasukpajak`,`ri`.`ritotal` AS `ritotal`,`ri`.`ridiskonpersen` AS `ridiskonpersen`,`ri`.`rijmldiskon` AS `rijmldiskon`,`ri`.`ritotalpajak1detail` AS `ritotalpajak1detail`,`ri`.`ritotalpajak2detail` AS `ritotalpajak2detail`,`ri`.`ribiayalainpersen` AS `ribiayalainpersen`,`ri`.`ribiayalain` AS `ribiayalain`,`ri`.`ritotaltransaksi` AS `ritotaltransaksi`,`ri`.`rijmlbayar` AS `rijmlbayar`,`ri`.`ristatuslunas` AS `ristatuslunas`,`ri`.`ritgllunas` AS `ritgllunas`,`ri`.`rinofakturpajak` AS `rinofakturpajak`,`ri`.`risdhbayarpajak` AS `risdhbayarpajak`,`ri`.`ritglbayarpajak` AS `ritglbayarpajak`,`ri`.`rirekdiskon` AS `rirekdiskon`,`ri`.`rirekpajak1` AS `rirekpajak1`,`ri`.`rirekpajak2` AS `rirekpajak2`,`ri`.`rirekbiayalain` AS `rirekbiayalain`,`ri`.`rirekbayar` AS `rirekbayar`,`ri`.`riidpr` AS `riidpr`,`ri`.`riidcs` AS `riidcs`,`ri`.`riidrq` AS `riidrq`,`ri`.`riidbs` AS `riidbs`,`ri`.`riidpo` AS `riidpo`,`ri`.`riidipc` AS `riidipc`,`ri`.`riidgrn` AS `riidgrn`,`ri`.`ristatusdnr` AS `ristatusdnr`,`ri`.`ristatusprt` AS `ristatusprt`,`ri`.`ristatusrealisasi` AS `ristatusrealisasi`,`ri`.`ristatus` AS `ristatus`,`ri`.`ristatussebelumnya` AS `ristatussebelumnya`,`ri`.`rijmlrevisi` AS `rijmlrevisi`,`ri`.`ricetakanke` AS `ricetakanke`,`ri`.`riinputuser` AS `riinputuser`,`ri`.`riinputtgl` AS `riinputtgl`,`ri`.`rimodifikasiuser` AS `rimodifikasiuser`,`ri`.`rimodifikasitgl` AS `rimodifikasitgl`,`ri`.`riposting` AS `riposting`,`ri`.`ripostingtgl` AS `ripostingtgl`,`ri`.`ritutupperiode` AS `ritutupperiode`,`ri`.`riisclose` AS `riisclose`,`br`.`bnama` AS `ricabangnama`,`lc`.`lnama` AS `rilokasinama`,`wh`.`wnama` AS `rigudangnama`,`c1`.`kkode` AS `risupplierkode`,`c1`.`knama` AS `risuppliernama`,`c2`.`kkode` AS `ribagianpembeliankode`,`c2`.`knama` AS `ribagianpembeliannama`,`po`.`ponotransaksi` AS `ponotransaksi`,`ipc`.`ipcnotransaksi` AS `ipcnotransaksi`,`grn`.`grnnotransaksi` AS `grnnotransaksi`,`st1`.`nama` AS `ristatusnama`,`st2`.`nama` AS `ristatussebelumnyanama`,`u1`.`unama` AS `riinputusernama`,`u2`.`unama` AS `rimodifikasiusernama`, `ri`.`ricustomtext1` AS `ricustomtext1`, `ri`.`ricustomtext2` AS `ricustomtext2`, `ri`.`ricustomtext3` AS `ricustomtext3`, `ri`.`ricustomtext4` AS `ricustomtext4`, `ri`.`ricustomtext5` AS `ricustomtext5`, `ri`.`ricustomint1` AS `ricustomint1`, `ri`.`ricustomint2` AS `ricustomint2`, `ri`.`ricustomint3` AS `ricustomint3`, `ri`.`ricustomdbl1` AS `ricustomdbl1`, `ri`.`ricustomdbl2` AS `ricustomdbl2`, `ri`.`ricustomdbl3` AS `ricustomdbl3`, `ri`.`ricustomdate1` AS `ricustomdate1`, `ri`.`ricustomdate1` AS `ricustomdate1`, `ri`.`ricustomdate2` AS `ricustomdate2`, `ri`.`ricustomdate3` AS `ricustomdate3`, cdis.cnama AS rirekdiskonnama, cpa.cnama AS rirekpajak1nama, cpa2.cnama AS rirekpajak2nama, cba.cnama AS rirekbiayalainnama from ((((((((((((`m4_ri_history` `ri` left join `m1_branch` `br` on((`br`.`bkode` = `ri`.`ricabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `ri`.`rilokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `ri`.`rigudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `ri`.`risupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `ri`.`ribagianpembelian`))) left join `m4_po` `po` on((`ri`.`riidpo` = `po`.`poid`))) left join `m4_ipc` `ipc` on((`ri`.`riidipc` = `ipc`.`ipcid`))) left join `m4_grn` `grn` on((`ri`.`riidgrn` = `grn`.`grnid`))) left join `m0_status` `st1` on((`st1`.`kode` = `ri`.`ristatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `ri`.`ristatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `ri`.`riinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `ri`.`rimodifikasiuser`))) LEFT JOIN m1_coa cdis ON cdis.cnomor = ri.rirekdiskon LEFT JOIN m1_coa cpa ON cpa.cnomor = ri.rirekpajak1 LEFT JOIN m1_coa cpa2 ON cpa2.cnomor = ri.rirekpajak2 LEFT JOIN m1_coa cba ON cba.cnomor = ri.rirekbiayalain
```

## Query 102

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_ri_history.vb`

```sql
select ri.riidhistory, rid.idhistorydetail, rid.idhistory, ri.riid AS riid,ri.ricabang AS ricabang,ri.rilokasi AS rilokasi,ri.rigudang AS rigudang,ri.riasalbarang AS riasalbarang,ri.riasalbarangkategori AS riasalbarangkategori,ri.rijenispembelian AS rijenispembelian,ri.rijenispembeliankategori AS rijenispembeliankategori,ri.ricarabayar AS ricarabayar,ri.risumber AS risumber,ri.riautonotransaksi AS riautonotransaksi,ri.rinotransaksi AS rinotransaksi,ri.ritgl AS ritgl,ri.rikodepa AS rikodepa,ri.risupplier AS risupplier,ri.risupplierkontak AS risupplierkontak,ri.ri1alamat1 AS ri1alamat1,ri.ri1alamat2 AS ri1alamat2,ri.ri1alamat3 AS ri1alamat3,ri.ri2alamat1 AS ri2alamat1,ri.ri2alamat2 AS ri2alamat2,ri.ri2alamat3 AS ri2alamat3,ri.ribagianpembelian AS ribagianpembelian,ri.ritermin AS ritermin,ri.ritgljatuhtempo AS ritgljatuhtempo,ri.riuraian AS riuraian,ri.ricatatan AS ricatatan,ri.rinoref AS rinoref,ri.ritglnoref AS ritglnoref,ri.ritglpenutupan AS ritglpenutupan,ri.rimatauang AS rimatauang,ri.rikurs AS rikurs,ri.rihargatermasukpajak AS rihargatermasukpajak,ri.ritotal AS ritotal,ri.ridiskonpersen AS ridiskonpersen,ri.rijmldiskon AS rijmldiskon,ri.ritotalpajak1detail AS ritotalpajak1detail,ri.ritotalpajak2detail AS ritotalpajak2detail,ri.ribiayalainpersen AS ribiayalainpersen,ri.ribiayalain AS ribiayalain,ri.ritotaltransaksi AS ritotaltransaksi,ri.rijmlbayar AS rijmlbayar,ri.ristatuslunas AS ristatuslunas,ri.ritgllunas AS ritgllunas,ri.rinofakturpajak AS rinofakturpajak,ri.risdhbayarpajak AS risdhbayarpajak,ri.ritglbayarpajak AS ritglbayarpajak,ri.rirekdiskon AS rirekdiskon,ri.rirekpajak1 AS rirekpajak1,ri.rirekpajak2 AS rirekpajak2,ri.rirekbiayalain AS rirekbiayalain,ri.rirekbayar AS rirekbayar,ri.riidpr AS riidpr,ri.riidcs AS riidcs,ri.riidrq AS riidrq,ri.riidbs AS riidbs,ri.riidpo AS riidpo,ri.riidipc AS riidipc,ri.riidgrn AS riidgrn,ri.ristatusdnr AS ristatusdnr,ri.ristatusprt AS ristatusprt,ri.ristatusrealisasi AS ristatusrealisasi,ri.ristatus AS ristatus,ri.ristatussebelumnya AS ristatussebelumnya,ri.rijmlrevisi AS rijmlrevisi,ri.ricetakanke AS ricetakanke,ri.riinputuser AS riinputuser,ri.riinputtgl AS riinputtgl,ri.rimodifikasiuser AS rimodifikasiuser,ri.rimodifikasitgl AS rimodifikasitgl,ri.riposting AS riposting,ri.ripostingtgl AS ripostingtgl,ri.ritutupperiode AS ritutupperiode,ri.riisclose AS riisclose,ri.ricustomtext1 AS ricustomtext1,ri.ricustomtext2 AS ricustomtext2,ri.ricustomtext3 AS ricustomtext3,ri.ricustomtext4 AS ricustomtext4,ri.ricustomtext5 AS ricustomtext5,ri.ricustomint1 AS ricustomint1,ri.ricustomint2 AS ricustomint2,ri.ricustomint3 AS ricustomint3,ri.ricustomdbl1 AS ricustomdbl1,ri.ricustomdbl2 AS ricustomdbl2,ri.ricustomdbl3 AS ricustomdbl3,ri.ricustomdate1 AS ricustomdate1,ri.ricustomdate2 AS ricustomdate2,ri.ricustomdate3 AS ricustomdate3,br.bnama AS ricabangnama,lc.lnama AS rilokasinama,wh.wnama AS rigudangnama,c1.kkode AS risupplierkode,c1.knama AS risuppliernama,c2.kkode AS ribagianpembeliankode,c2.knama AS ribagianpembeliannama,tr.trnama AS riterminnama,tr.trharijatuhtempo AS riterminharijatuhtempo,coa1.cnama AS rirekdiskonnama,coa2.cnama AS rirekpajak1nama,coa3.cnama AS rirekpajak2nama,coa4.cnama AS rirekbiayalainnama,coa5.cnama AS rirekbayarnama,po.ponotransaksi AS rinotransaksipo,ipc.ipcnotransaksi AS rinotransaksiipc,grn.grnnotransaksi AS rinotransaksigrn,st1.nama AS ristatusnama,st2.nama AS ristatussebelumnyanama,u1.unama AS riinputusernama,u2.unama AS rimodifikasiusernama,rid.idridetail AS idridetail,rid.idri AS idri,rid.idbarang AS idbarang,rid.namabarang AS namabarang,rid.tipebarang AS tipebarang,rid.jml AS jml,rid.satuan AS satuan,rid.nilaisatuan AS nilaisatuan,rid.jmlbarang AS jmlbarang,rid.satuanbarang AS satuanbarang,rid.matauang AS matauang,rid.kurs AS kurs,rid.hargafix AS hargafix,rid.harga AS harga,rid.diskon AS diskon,rid.jmldiskon AS jmldiskon,rid.pajak1 AS pajak1,rid.jmlpajak1 AS jmlpajak1,rid.pajak2 AS pajak2,rid.jmlpajak2 AS jmlpajak2,rid.cabang AS cabang,rid.lokasi AS lokasi,rid.gudang AS gudang,i.brekpersediaan AS rekpersediaan,i.brekdiskonpembelian AS rekdiskonpembelian,rid.rekhutangsementara AS rekhutangsementara,rid.costcenter AS costcenter,rid.divisi AS divisi,rid.subdivisi AS subdivisi,rid.proyek AS proyek,rid.catatan AS catatan,rid.urutan AS urutan,rid.idprdetail AS idprdetail,rid.idcsdetail AS idcsdetail,rid.idrqdetail AS idrqdetail,rid.idbsdetail AS idbsdetail,rid.idpodetail AS idpodetail,rid.idipcdetail AS idipcdetail,rid.idgrndetail AS idgrndetail,rid.jmldnr AS jmldnr,rid.statusdnr AS statusdnr,rid.jmlprt AS jmlprt,rid.statusprt AS statusprt,rid.jmlrealisasi AS jmlrealisasi,rid.statusrealisasi AS statusrealisasi,rid.isclose AS isclose,rid.customtext1 AS customtext1,rid.customtext2 AS customtext2,rid.customtext3 AS customtext3,rid.customdbl1 AS customdbl1,rid.customdbl2 AS customdbl2,rid.customdbl3 AS customdbl3,rid.customdate1 AS customdate1,rid.customdate2 AS customdate2,rid.customdate3 AS customdate3,i.bkode AS kodebarang,i.bhpp AS bhpp,i.bjenis AS bjenis,i.bserial AS bserial,i.bbatch AS bbatch,i.basset AS basset,t1.tnama AS pajak1nama,t1.tnilai AS pajak1nilai,t2.tnama AS pajak2nama,t2.tnilai AS pajak2nilai,brd.bnama AS cabangnama,lcd.lnama AS lokasinama,whd.wnama AS gudangnama,cc.ccnama AS costcenternama,d.dnama AS divisinama,sd.sdnama AS subdivisinama,p.pnama AS proyeknama,po2.ponotransaksi AS ponotransaksi,ipc2.ipcnotransaksi AS ipcnotransaksi,grn2.grnnotransaksi AS grnnotransaksi, c1.kpkp, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan, ri.rijmluangmuka, ri.rirekuangmuka, ri.riidap, coa6.cnama as rirekuangmukanama, ap.apnotransaksi as apnotransaksi from m4_ri_history ri join m4_ri_detail_history rid on ri.riid = rid.idri left join m1_branch br on br.bkode = ri.ricabang left join m1_location lc on lc.lkode = ri.rilokasi left join m1_warehouse wh on wh.wkode = ri.rigudang left join m1_contact c1 on c1.kid = ri.risupplier left join m1_contact c2 on c2.kid = ri.ribagianpembelian left join m1_terms tr on ri.ritermin = tr.trkode left join m1_coa coa1 on ri.rirekdiskon = coa1.cnomor left join m1_coa coa2 on ri.rirekpajak1 = coa2.cnomor left join m1_coa coa3 on ri.rirekpajak2 = coa3.cnomor left join m1_coa coa4 on ri.rirekbiayalain = coa4.cnomor left join m1_coa coa5 on ri.rirekbayar = coa5.cnomor left join m4_po po on ri.riidpo = po.poid left join m4_ipc ipc on ri.riidipc = ipc.ipcid left join m4_grn grn on ri.riidgrn = grn.grnid left join m0_status st1 on st1.kode = ri.ristatus left join m0_status st2 on st2.kode = ri.ristatussebelumnya left join m0_user u1 on u1.userid = ri.riinputuser left join m0_user u2 on u2.userid = ri.rimodifikasiuser left join m1_item i on i.bid = rid.idbarang left join m1_tax t1 on rid.pajak1 = t1.tkode left join m1_tax t2 on rid.pajak2 = t2.tkode left join m1_branch brd on rid.cabang = brd.bkode left join m1_location lcd on rid.lokasi = lcd.lkode left join m1_warehouse whd on rid.gudang = whd.wkode left join m1_project p on rid.proyek = p.pkode left join m4_po_detail pod on rid.idpodetail = pod.idpodetail left join m4_po po2 on pod.idpo = po2.poid left join m4_ipc_detail ipcd on rid.idipcdetail = ipcd.idipcdetail left join m4_ipc ipc2 on ipcd.idipc = ipc2.ipcid left join m4_grn_detail grnd on rid.idgrndetail = grnd.idgrndetail left join m4_grn grn2 on grnd.idgrn = grn2.grnid left join m1_cost_center cc on rid.costcenter = cc.cckode left join m1_division d on rid.divisi = d.dkode left join m1_subdivision sd on rid.subdivisi = sd.sdkode left join m1_coa coa6 on ri.rirekuangmuka = coa6.cnomor left join m4_ap ap on ri.riidap = ap.apid
```

