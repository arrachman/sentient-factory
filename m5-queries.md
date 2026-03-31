# M5 Queries

## `client-backend/api-myerpplus/app_code/ws/m5/m5_as.vb`

```sql
SELECT snilai FROM m0_setting WHERE (smodule='0') AND (sgrup='accounting') AND (skode='MataUangFungsional')
```

```sql
SELECT COUNT(asid), asnotransaksi FROM M5_as WHERE asid='{result_4}' AND asstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(asid) FROM m5_as WHERE asnotransaksi='{notransaksi}'
```

```sql
UPDATE m5_ip ip LEFT JOIN m2_transaction_journal t ON ip.ipsumber = t.tsumber AND ip.ipid = t.tidtransaksi AND ip.ipnotransaksi = t.tnotransaksi SET ip.ipjumlahbayar = (CASE ip.ipid {updNilaiIP} ELSE ip.ipjumlahbayar END), ip.ipjumlahbayarvalas = (CASE ip.ipid {updNilaiValasIP} ELSE ip.ipjumlahbayarvalas END), ip.iptgllunas = (CASE ip.ipid {updTglLunasIP} ELSE ip.iptgllunas END) WHERE {updFilterIP}
```

```sql
UPDATE m5_ip ip LEFT JOIN m2_transaction_journal t ON ip.ipsumber = t.tsumber AND ip.ipid = t.tidtransaksi AND ip.ipnotransaksi = t.tnotransaksi SET t.tstatuslunas = ip.ipstatusbayar, t.ttgllunas = ip.iptgllunas WHERE {updFilterIP}
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}'
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Astgl, Asnotransaksi, Asstatus FROM M5_As WHERE Asid='{idtransaksi}'
```

```sql
SELECT matauang, jumlah, jumlahvalas, idip FROM m5_as_pay WHERE idas = '{idtransaksi}'
```

```sql
UPDATE m5_ip ip LEFT JOIN m2_transaction_journal t ON ip.ipsumber = t.tsumber AND ip.ipid = t.tidtransaksi AND ip.ipnotransaksi = t.tnotransaksi SET ip.ipjumlahbayar = (CASE ip.ipid {updNilaiIP} ELSE ip.ipjumlahbayar END), ip.ipjumlahbayarvalas = (CASE ip.ipid {updNilaiValasIP} ELSE ip.ipjumlahbayarvalas END), ip.iptgllunas = '{tglLunas}' WHERE {updFilterIP}
```

```sql
DELETE FROM M2_Transaction_Journal WHERE tsumber = 'AS' AND tidtransaksi = '{idtransaksi}' AND tnotransaksi = '{notransaksi}'
```

```sql
DELETE FROM m2_giro_list WHERE glsumber = 'AS' AND glidtransaksi = '{idtransaksi}' AND glnotransaksi = '{notransaksi}'
```

```sql
UPDATE M5_As SET Asstatus = {nilaiStatus}, Asmodifikasiuser='{userid}', Asmodifikasitgl = NOW(), Asposting = 0, Aspostingtgl = '1971-01-01 00:00:00', Asjmlrevisi = Asjmlrevisi + 1 WHERE Asid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Asid, Asnotransaksi FROM M5_As WHERE Asid='{idtransaksi}'
```

```sql
SELECT ascabang, aslokasi, assumber, asautonotransaksi, asnotransaksi, astgl
```

```sql
DELETE FROM M5_As_Pay WHERE idas='{idtransaksi}'
```

```sql
DELETE FROM M5_As WHERE asid ='{idtransaksi}'
```

```sql
SELECT ip.ipid, ip.ipsumber, ip.ipnotransaksi, ip.ipmatauang, (CASE ip.ipmatauang WHEN s.snilai THEN ip.ipjumlah - ip.ipjumlahbayar ELSE ip.ipjumlahvalas - ip.ipjumlahbayarvalas END) ipsisatransaksi FROM m5_ip ip LEFT JOIN m0_setting s ON s.smodule =0 AND s.sgrup='accounting' AND s.skode = 'MataUangFungsional' WHERE {ftOutstandingIP}
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_as_history.vb`

```sql
INSERT INTO m5_as_history(SELECT 0, ash.* FROM m5_as ash WHERE ash.asid = '{idtransaksi}')
```

```sql
SELECT asidhistory FROM m5_as_history WHERE asid = '{idtransaksi}' ORDER BY asmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m5_as_pay_history (SELECT 0, '{result_4}', ash.* FROM m5_as_pay ash WHERE ash.idas = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_cl.vb`

```sql
SELECT COUNT(clid), clnotransaksi FROM M5_Cl WHERE clid='{result_4}' AND clstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(clid) FROM M5_Cl WHERE clnotransaksi='{notransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}'
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Cltgl, Clnotransaksi, Clstatus FROM M5_Cl WHERE Clid='{idtransaksi}'
```

```sql
UPDATE M5_Cl SET Clstatus = {nilaiStatus}, Clmodifikasiuser='{userid}', Clmodifikasitgl = NOW(), Clposting = 0, Clpostingtgl = '1971-01-01 00:00:00', Cljmlrevisi = Cljmlrevisi + 1 WHERE Clid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Clid, Clnotransaksi FROM M5_Cl WHERE Clid='{idtransaksi}'
```

```sql
SELECT Clcabang, Cllokasi, Clsumber, Clautonotransaksi, Clnotransaksi, Cltgl
```

```sql
DELETE FROM M5_Cl WHERE Clid = '{idtransaksi}'
```

```sql
SELECT cl.clid, cl.clcabang, br.bnama as clcabangnama, cl.cllokasi, lc.lnama as cllokasinama, cl.clgudang, wh.wnama as clgudangnama, cl.clasalbarang, cl.clasalbarangkategori, cl.cljenispenjualan, cl.cljenispenjualankategori, cl.clcarabayar, cl.clsumber, cl.clautonotransaksi, cl.clnotransaksi, cl.cltgl, cl.clkodepa, cl.clcustomer, cl.clcustomtext4 as clcustomerkode, cl.clcustomtext4 as clcustomernama, cl.clcustomerkontak, cl.cl1alamat1, cl.cl1alamat2, cl.cl1alamat3, cl.cl2alamat1, cl.cl2alamat2, cl.cl2alamat3, cl.clbagianpenjualan, cl.clcustomtext5 as clbagianpenjualankode, cl.clcustomtext5 as clbagianpenjualannama, cl.clekspedisi, ex.enama as clekspedisinama, cl.cltglkirim, cl.cltermin, tr.trnama as clterminnama, tr.trharijatuhtempo as clterminharijatuhtempo, cl.cltgljatuhtempo, cl.cluraian, cl.clcatatan, cl.clnoref, cl.cltglnoref, cl.cltglpenutupan, cl.clmatauang, cl.clkurs, cl.clhargatermasukpajak, cl.cltotal, cl.cldiskonpersen, cl.cljmldiskon, cl.cltotalpajak1detail, cl.cltotalpajak2detail, cl.clbiayalainpersen, cl.clbiayalain, cl.cltotaltransaksi, cl.cljmlbayar, cl.clrekdiskon, cl.clrekpajak1, cl.clrekpajak2, cl.clrekbiayalain, cl.clrekbayar, cl.clidso, cl.clcustomtext3 as sonotransaksi, cl.clstatuspi, cl.clstatuspl, cl.clstatusdo, cl.clstatusdr, cl.clstatussi, cl.clstatusrnr, cl.clstatussr, cl.clstatusrealisasi, cl.clstatus, st.nama as clstatusnama, cl.clstatussebelumnya, cl.cljmlrevisi, cl.clcetakanke, cl.clinputuser, u.ukode as clinputuserkode, u.unama as clinputusernama, cl.clinputtgl, cl.clmodifikasiuser, u2.ukode as clmodifikasiuserkode, u2.ukode as clmodifikasiusernama, cl.clmodifikasitgl, cl.clposting, cl.clpostingtgl, cl.clisclose, cl.clcustomtext1, cl.clcustomtext2, cl.clcustomtext3, cl.clcustomtext4, cl.clcustomtext5, cl.clcustomint1, cl.clcustomint2, cl.clcustomint3, cl.clcustomdbl1, cl.clcustomdbl2, cl.clcustomdbl3, cl.clcustomdate1, cl.clcustomdate2, cl.clcustomdate3, cl.cluploaded, cl.clidsodetail, cl.clidbarang, i.bkode as clkodebarang, cl.clnamabarang, cl.cltipebarang, cl.cljml, cl.clsatuan, cl.clnilaisatuan, cl.cljmlbarang, cl.clsatuanbarang FROM m5_cl cl JOIN m1_branch br ON cl.clcabang = br.bkode JOIN m1_location lc ON cl.cllokasi = lc.lkode JOIN m1_warehouse wh ON cl.clgudang = wh.wkode LEFT JOIN m1_contact c ON cl.clcustomer = c.kid LEFT JOIN m1_contact cs ON cl.clbagianpenjualan = cs.kid LEFT JOIN m1_item i ON cl.clidbarang = i.bid JOIN m0_user u ON cl.clinputuser = u.userid JOIN m0_status st ON cl.clstatus = st.kode LEFT JOIN m5_so so ON cl.clidso = so.soid LEFT JOIN m1_expedition ex ON cl.clekspedisi = ex.ekode LEFT JOIN m1_terms tr ON cl.cltermin = tr.trkode LEFT JOIN m0_user u2 ON cl.clmodifikasiuser = u2.userid
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_cl_history.vb`

```sql
INSERT INTO M5_Cl_history(SELECT 0, Cl.* FROM M5_Cl Cl WHERE Cl.Clid = '{idtransaksi}')
```

```sql
SELECT cl.clidhistory, cl.clid, cl.clcabang, br.bnama as clcabangnama, cl.cllokasi, lc.lnama as cllokasinama, cl.clgudang, wh.wnama as clgudangnama, cl.clasalbarang, cl.clasalbarangkategori, cl.cljenispenjualan, cl.cljenispenjualankategori, cl.clcarabayar, cl.clsumber, cl.clautonotransaksi, cl.clnotransaksi, cl.cltgl, cl.clkodepa, cl.clcustomer, c.kkode as clcustomerkode, c.knama as clcustomernama, cl.clcustomerkontak, cl.cl1alamat1, cl.cl1alamat2, cl.cl1alamat3, cl.cl2alamat1, cl.cl2alamat2, cl.cl2alamat3, cl.clbagianpenjualan, cs.kkode as clbagianpenjualankode, cs.knama as clbagianpenjualannama, cl.clekspedisi, ex.enama as clekspedisinama, cl.cltglkirim, cl.cltermin, tr.trnama as clterminnama, tr.trharijatuhtempo as clterminharijatuhtempo, cl.cltgljatuhtempo, cl.cluraian, cl.clcatatan, cl.clnoref, cl.cltglnoref, cl.cltglpenutupan, cl.clmatauang, cl.clkurs, cl.clhargatermasukpajak, cl.cltotal, cl.cldiskonpersen, cl.cljmldiskon, cl.cltotalpajak1detail, cl.cltotalpajak2detail, cl.clbiayalainpersen, cl.clbiayalain, cl.cltotaltransaksi, cl.cljmlbayar, cl.clrekdiskon, cl.clrekpajak1, cl.clrekpajak2, cl.clrekbiayalain, cl.clrekbayar, cl.clidso, so.sonotransaksi, cl.clstatuspi, cl.clstatuspl, cl.clstatusdo, cl.clstatusdr, cl.clstatussi, cl.clstatusrnr, cl.clstatussr, cl.clstatusrealisasi, cl.clstatus, st.nama as clstatusnama, cl.clstatussebelumnya, cl.cljmlrevisi, cl.clcetakanke, cl.clinputuser, u.ukode as clinputuserkode, u.unama as clinputusernama, cl.clinputtgl, cl.clmodifikasiuser, u2.ukode as clmodifikasiuserkode, u2.ukode as clmodifikasiusernama, cl.clmodifikasitgl, cl.clposting, cl.clpostingtgl, cl.clisclose, cl.clcustomtext1, cl.clcustomtext2, cl.clcustomtext3, cl.clcustomtext4, cl.clcustomtext5, cl.clcustomint1, cl.clcustomint2, cl.clcustomint3, cl.clcustomdbl1, cl.clcustomdbl2, cl.clcustomdbl3, cl.clcustomdate1, cl.clcustomdate2, cl.clcustomdate3, cl.cluploaded, cl.clidsodetail, cl.clidbarang, i.bkode as clkodebarang, cl.clnamabarang, cl.cltipebarang, cl.cljml, cl.clsatuan, cl.clnilaisatuan, cl.cljmlbarang, cl.clsatuanbarang FROM m5_cl_history cl JOIN m1_branch br ON cl.clcabang = br.bkode JOIN m1_location lc ON cl.cllokasi = lc.lkode JOIN m1_warehouse wh ON cl.clgudang = wh.wkode JOIN m1_contact c ON cl.clcustomer = c.kid JOIN m1_contact cs ON cl.clbagianpenjualan = cs.kid JOIN m5_so so ON cl.clidso = so.soid JOIN m1_item i ON cl.clidbarang = i.bid JOIN m0_user u ON cl.clinputuser = u.userid JOIN m0_status st ON cl.clstatus = st.kode LEFT JOIN m1_expedition ex ON cl.clekspedisi = ex.ekode LEFT JOIN m1_terms tr ON cl.cltermin = tr.trkode LEFT JOIN m0_user u2 ON cl.clmodifikasiuser = u2.userid
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_do.vb`

```sql
SELECT ccakun FROM m1_cost_center WHERE cckode = '{dataRowDetail_30}'
```

```sql
SELECT COUNT(doid), donotransaksi FROM M5_do WHERE doid='{result_4}' AND dostatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(doid) FROM m5_do WHERE donotransaksi='{notransaksi}'
```

```sql
SELECT jml, harga, diskon, pajak1, jmlpajak1, pajak2, jmlpajak2 FROM m5_pl_detail WHERE idpldetail = '{dr1_idpldetail}'
```

```sql
SELECT jml, harga, diskon, pajak1, jmlpajak1, pajak2, jmlpajak2 FROM m5_pi_detail WHERE idpidetail = '{dr1_idpidetail}'
```

```sql
SELECT jml, harga, diskon, pajak1, jmlpajak1, pajak2, jmlpajak2 FROM m5_so_detail WHERE idsodetail = '{dr1_idsodetail}'
```

```sql
UPDATE m5_so_detail SET jmlrealisasi = (CASE idsodetail {updNilaiSO} ELSE jmlrealisasi END) WHERE {updFilterSO}
```

```sql
SELECT idso FROM m5_so_detail WHERE {updFilterSO} GROUP BY idso
```

```sql
SELECT idso, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m5_so_detail WHERE {ftDetail} GROUP BY idso
```

```sql
UPDATE m5_so SET sostatusrealisasi = (CASE soid {updNilaiSO} ELSE sostatusrealisasi END) WHERE {updFilterSO}
```

```sql
UPDATE m5_pi_detail SET jmlrealisasi = (CASE idpidetail {updNilaiPI} ELSE jmlrealisasi END) WHERE {updFilterPI}
```

```sql
SELECT idpi FROM m5_pi_detail WHERE {updFilterPI} GROUP BY idpi
```

```sql
SELECT idpi, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m5_pi_detail WHERE {ftDetail} GROUP BY idpi
```

```sql
UPDATE m5_pi SET pistatusrealisasi = (CASE piid {updNilaiPI} ELSE pistatusrealisasi END) WHERE {updFilterPI}
```

```sql
UPDATE m5_pl_detail SET jmlrealisasi = (CASE idpldetail {updNilaiPL} ELSE jmlrealisasi END) WHERE {updFilterPL}
```

```sql
SELECT idpl FROM m5_pl_detail WHERE {updFilterPL} GROUP BY idpl
```

```sql
SELECT idpl, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m5_pl_detail WHERE {ftDetail} GROUP BY idpl
```

```sql
UPDATE m5_pl SET plstatusrealisasi = (CASE plid {updNilaiPL} ELSE plstatusrealisasi END) WHERE {updFilterPL}
```

```sql
SELECT snilai FROM m0_setting WHERE smodule = 3 AND sgrup = 'defaultgudang' AND skode = 'GudangTransit'
```

```sql
UPDATE m1_no_batch_in SET nbijmlkeluar = (CASE {updNilaiBatch} ELSE nbijmlkeluar END) WHERE {updFilterBatch}
```

```sql
UPDATE m1_no_serial_in SET nsijmlkeluar = (CASE {updNilaiSerial} ELSE nsijmlkeluar END) WHERE {updFilterSerial}
```

```sql
UPDATE m7_asset a SET a.agudang = '{SetGudang}' WHERE a.aid IN({strValue2.ToString})
```

```sql
INSERT INTO m1_item_booking (SELECT idbarang, gudangasal, jmlbarang * -1 FROM m5_do_detail JOIN m1_item ON idbarang = bid AND bjenis <> 'J' AND bhpp <> 'I' AND idsodetail <> 0 AND iddo = '{result_4}') ON DUPLICATE KEY UPDATE jmlbooking = jmlbooking + VALUES(jmlbooking)
```

```sql
INSERT INTO m1_item_stock_warehouse (idbarang, kgudang, stok) VALUES {updStokOut} ON DUPLICATE KEY UPDATE stok = stok + VALUES(stok)
```

```sql
INSERT INTO m1_item_stock_warehouse (idbarang, kgudang, stok) VALUES {updStokIn} ON DUPLICATE KEY UPDATE stok = stok + VALUES(stok)
```

```sql
UPDATE m5_do_detail dod JOIN m1_cost_center cc ON dod.costcenter = cc.cckode JOIN m0_setting s2 ON s2.smodule = 0 AND s2.sgrup = 'options' AND s2.skode = 'DONonaktifCostcenter' AND s2.snilai = 1 SET cc.ccaktif = 0 WHERE dod.iddo = '{result_4}';
```

```sql
SELECT dod.iddodetail, dod.idbarang, dod.namabarang, dod.tipebarang, dod.jml, dod.satuan, dod.jmlbarang, dod.satuanbarang, dod.matauang, dod.kurs, dod.harga, dod.diskon, dod.jmldiskon, dod.hpp, dod.idhppkhususmasuk, dod.gudangasal, dod.gudangtransit, dod.gudangtujuan, dod.catatan, dod.costcenter, dod.divisi, dod.subdivisi, dod.proyek, `do`.doinputtgl, i.bhpp, (CASE LENGTH(IFNULL(cc.ccakun,'')) WHEN 0 THEN 1 ELSE 0 END) as transbarang FROM m5_do_detail dod JOIN m5_do `do` ON dod.iddo = `do`.doid JOIN m1_item i ON dod.idbarang = i.bid LEFT JOIN m1_cost_center cc ON dod.costcenter = cc.cckode WHERE dod.iddo = '{result_4}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}'
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Dotgl, Donotransaksi, Dostatus FROM M5_Do WHERE Doid='{idtransaksi}'
```

```sql
SELECT bkode, nbikode FROM m1_no_batch_in JOIN m1_item ON nbiidbarang = bid WHERE nbisumber = '{sumber}' AND nbiidtransaksi = '{idtransaksi}' AND nbijmlkeluar > 0
```

```sql
SELECT bkode, nsikode FROM m1_no_serial_in JOIN m1_item ON nsiidbarang = bid WHERE nsisumber = '{sumber}' AND nsiidtransaksi = '{idtransaksi}' AND nsijmlkeluar > 0
```

```sql
SELECT so.sonotransaksi FROM m5_so so JOIN m5_so_detail sod ON so.soid = sod.idso JOIN m5_do_detail dod ON sod.idsodetail = dod.idsodetail AND dod.iddo = '{idtransaksi}' AND so.sostatus NOT IN(2,3,4)
```

```sql
SELECT iddodetail, idbarang, tipebarang, namabarang, satuan, nilaisatuan, jmlbarang, idsodetail, idpidetail, idpldetail, gudangasal, gudangtransit, idhppkhususmasuk, idhppfifomasuk, urutan, (CASE LENGTH(IFNULL(cc.ccakun,'')) WHEN 0 THEN 1 ELSE 0 END) as transbarang FROM m5_do_detail dod LEFT JOIN m1_cost_center cc ON dod.costcenter = cc.cckode WHERE iddo = '{idtransaksi}'
```

```sql
SELECT atasetid, atidbarang, atkode FROM M7_Asset_Transaction WHERE atsumber = '{sumber}' AND atidutama = '{idtransaksi}'
```

```sql
SELECT nboidbatchin, nbogudang, nboidbarang, nbokode, nbojmlkeluar FROM m1_no_batch_out WHERE nbosumber = '{sumber}' AND nboidtransaksi = '{idtransaksi}'
```

```sql
DELETE FROM m1_no_batch_in WHERE nbisumber = '{sumber}' AND nbiidtransaksi = '{idtransaksi}'
```

```sql
DELETE FROM m1_no_batch_out WHERE nbosumber = '{sumber}' AND nboidtransaksi = '{idtransaksi}'
```

```sql
SELECT nsoidserialin, nsogudang, nsoidbarang, nsokode, nsojmlkeluar FROM m1_no_serial_out WHERE nsosumber = '{sumber}' AND nsoidtransaksi = '{idtransaksi}'
```

```sql
DELETE FROM m1_no_serial_in WHERE nsisumber = '{sumber}' AND nsiidtransaksi = '{idtransaksi}'
```

```sql
DELETE FROM m1_no_serial_out WHERE nsosumber = '{sumber}' AND nsoidtransaksi = '{idtransaksi}'
```

```sql
UPDATE m7_asset a SET a.agudang = '{gudangIn}' WHERE a.aid IN({strValue2.ToString})
```

```sql
INSERT INTO m1_item_booking (SELECT idbarang, gudangasal, jmlbarang FROM m5_do_detail JOIN m1_item ON idbarang = bid AND bjenis <> 'J' AND bhpp <> 'I' AND idsodetail <> 0 AND iddo = '{idtransaksi}') ON DUPLICATE KEY UPDATE jmlbooking = jmlbooking + VALUES(jmlbooking)
```

```sql
UPDATE m5_do_detail dod JOIN m1_cost_center cc ON dod.costcenter = cc.cckode JOIN m0_setting s2 ON s2.smodule = 0 AND s2.sgrup = 'options' AND s2.skode = 'DONonaktifCostcenter' AND s2.snilai = 1 SET cc.ccaktif = 1 WHERE dod.iddo = '{idtransaksi}';
```

```sql
DELETE FROM m1_item_transaction WHERE sumber = '{sumber}' AND idutama = '{idtransaksi}'
```

```sql
DELETE FROM M2_Transaction_Journal WHERE tsumber = '{sumber}' AND tidtransaksi = '{idtransaksi}' AND tnotransaksi = '{notransaksi}'
```

```sql
UPDATE M5_Do SET Dostatus = {nilaiStatus}, Domodifikasiuser='{userid}', Domodifikasitgl = NOW(), Doposting = 0, Dopostingtgl = '1971-01-01 00:00:00', Dojmlrevisi = Dojmlrevisi + 1 WHERE Doid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Doid, Donotransaksi FROM M5_Do WHERE Doid='{idtransaksi}'
```

```sql
SELECT docabang, dolokasi, dosumber, doautonotransaksi, donotransaksi, dotgl
```

```sql
DELETE FROM M5_Do_Detail WHERE iddo = '{idtransaksi}'
```

```sql
DELETE FROM M5_Do WHERE doid = '{idtransaksi}'
```

```sql
SELECT bid, bkode FROM m1_item WHERE (bjenis <> 'J') AND (bhpp = 'I') AND ({ftBarang})
```

```sql
SELECT csi.idhppikm, csi.idbarang, csi.sisa, i.bkode FROM m1_cogs_special_in csi JOIN m1_item i ON csi.idbarang = i.bid WHERE {ftHppI}
```

```sql
SELECT so.sonotransaksi as notransaksi, so.sohargatermasukpajak as termasukpajak, (CASE so.sohargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajaknama FROM m5_so_detail sod JOIN m5_so so ON sod.idso = so.soid WHERE {ftSO} GROUP BY so.sohargatermasukpajak
```

```sql
SELECT i.bkode, sod.idsodetail, so.sonotransaksi as notransaksi, (CASE so.sohargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_so_detail sod JOIN m5_so so ON sod.idso = so.soid JOIN m1_item i ON sod.idbarang = i.bid WHERE ({ftSO}) AND so.sohargatermasukpajak <> {termasukPajak} ORDER BY sod.urutan
```

```sql
SELECT sod.idsodetail, (sod.jmlbarang - sod.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m5_so_detail AS sod INNER JOIN m1_item AS i ON sod.idbarang = i.bid WHERE {ftOutstandingSO}
```

```sql
SELECT pi.pinotransaksi as notransaksi, pi.pihargatermasukpajak as termasukpajak, (CASE pi.pihargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajaknama FROM m5_pi_detail pid JOIN m5_pi pi ON pid.idpi = pi.piid WHERE {ftPI} GROUP BY pi.pihargatermasukpajak
```

```sql
SELECT i.bkode, pid.idpidetail, pi.pinotransaksi as notransaksi, (CASE pi.pihargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_pi_detail pid JOIN m5_pi pi ON pid.idpi = pi.piid JOIN m1_item i ON pid.idbarang = i.bid WHERE ({ftPI}) AND pi.pihargatermasukpajak <> {termasukPajak} ORDER BY pid.urutan
```

```sql
SELECT pid.idpidetail, (pid.jmlbarang - pid.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m5_pi_detail AS pid INNER JOIN m1_item AS i ON pid.idbarang = i.bid WHERE {ftOutstandingPI}
```

```sql
SELECT pl.plnotransaksi as notransaksi, pl.plhargatermasukpajak as termasukpajak, (CASE pl.plhargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajaknama FROM m5_pl_detail pld JOIN m5_pl pl ON pld.idpl = pl.plid WHERE {ftPL} GROUP BY pl.plhargatermasukpajak
```

```sql
SELECT i.bkode, pld.idpldetail, pl.plnotransaksi as notransaksi, (CASE pl.plhargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_pl_detail pld JOIN m5_pl pl ON pld.idpl = pl.plid JOIN m1_item i ON pld.idbarang = i.bid WHERE ({ftPL}) AND pl.plhargatermasukpajak <> {termasukPajak} ORDER BY pld.urutan
```

```sql
SELECT pld.idpldetail, (pld.jmlbarang - pld.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m5_pl_detail AS pld INNER JOIN m1_item AS i ON pld.idbarang = i.bid WHERE {ftOutstandingPL}
```

```sql
SELECT isw.idbarang, isw.kgudang, isw.stok, i.bkode FROM m1_item_stock_warehouse isw JOIN m1_item i ON isw.idbarang = i.bid AND i.bjenis <> 'J' WHERE {ftStok}
```

```sql
SELECT isw.idbarang, isw.kgudang, isw.stok - IFNULL(isb.jmlbooking,0) as stok, i.bkode FROM m1_item_stock_warehouse isw JOIN m1_item i ON isw.idbarang = i.bid AND i.bjenis <> 'J' LEFT JOIN m1_warehouse w ON isw.kgudang = w.wkode LEFT JOIN m1_item_booking isb ON isw.idbarang = isb.idbarang AND w.wbookingstok = 1 WHERE {ftStokAvailable}
```

```sql
SELECT nbi.nbiidbarang, nbi.nbikode, nbi.nbigudang, nbi.nbijmlsisa, i.bkode FROM m1_no_batch_in nbi JOIN m1_item i ON nbi.nbiidbarang = i.bid WHERE {ftBatch}
```

```sql
SELECT nsi.nsiidbarang, nsi.nsikode, nsi.nsigudang, nsi.nsijmlsisa, i.bkode FROM m1_no_serial_in nsi JOIN m1_item i ON nsi.nsiidbarang = i.bid WHERE {ftSerial}
```

```sql
SELECT dod.iddodetail, dod.idbarang, dod.namabarang, dod.tipebarang, dod.jml, dod.satuan, dod.jmlbarang, dod.satuanbarang, dod.matauang, dod.kurs, dod.harga, dod.diskon, dod.jmldiskon, dod.hpp, dod.idhppkhususmasuk, dod.gudangasal, dod.gudangtransit, dod.gudangtujuan, dod.catatan, dod.costcenter, dod.divisi, dod.subdivisi, dod.proyek, `do`.doinputtgl, i.bhpp FROM m5_do_detail dod JOIN m5_do `do` ON dod.iddo = `do`.doid JOIN m1_item i ON dod.idbarang = i.bid WHERE dod.iddo = '{result_4}'
```

```sql
SELECT iddodetail, idbarang, tipebarang, namabarang, satuan, nilaisatuan, jmlbarang, idsodetail, idpidetail, idpldetail, gudangasal, gudangtransit, idhppkhususmasuk, idhppfifomasuk, urutan FROM m5_do_detail WHERE iddo = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_do_history.vb`

```sql
INSERT INTO m5_do_history(SELECT 0, do.* FROM m5_do do WHERE do.doid = '{idtransaksi}')
```

```sql
SELECT doidhistory FROM m5_do_history WHERE doid = '{idtransaksi}' ORDER BY domodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m5_do_detail_history (SELECT 0, '{result_4}', do.* FROM m5_do_detail do WHERE do.iddo = '{idtransaksi}' )
```

```sql
INSERT INTO m1_no_batch_transaction_history(SELECT 0, '{result_4}', nb.* FROM m1_no_batch_transaction nb WHERE nb.nbtidtransaksi = '{idtransaksi}' and nb.nbtsumber = 'DO')
```

```sql
INSERT INTO m1_no_serial_transaction_history(SELECT 0, '{result_4}', ns.* FROM m1_no_serial_transaction ns WHERE ns.nstidtransaksi = '{idtransaksi}' and ns.nstsumber = 'DO')
```

```sql
INSERT INTO m7_asset_transaction_history(SELECT 0, '{result_4}', atr.* FROM m7_asset_transaction atr WHERE atr.atidutama = '{idtransaksi}' and atr.atsumber = 'DO')
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_dr.vb`

```sql
SELECT COUNT(drid), drnotransaksi FROM M5_dr WHERE drid='{result_4}' AND drstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(drid) FROM m5_dr WHERE drnotransaksi='{notransaksi}'
```

```sql
SELECT jml, harga, diskon, pajak1, jmlpajak1, pajak2, jmlpajak2 FROM m5_do_detail WHERE iddodetail = '{dr1_iddodetail}'
```

```sql
UPDATE m5_do_detail SET jmlrealisasi = (CASE iddodetail {updNilaiDO} ELSE jmlrealisasi END) WHERE {updFilterDO}
```

```sql
SELECT iddo FROM m5_do_detail WHERE {updFilterDO} GROUP BY iddo
```

```sql
SELECT iddo, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m5_do_detail WHERE {ftDetail} GROUP BY iddo
```

```sql
UPDATE m5_do SET dostatusrealisasi = (CASE doid {updNilaiDO} ELSE dostatusrealisasi END) WHERE {updFilterDO}
```

```sql
UPDATE m1_no_batch_in SET nbijmlkeluar = (CASE {updNilaiBatch} ELSE nbijmlkeluar END) WHERE {updFilterBatch}
```

```sql
UPDATE m1_no_serial_in SET nsijmlkeluar = (CASE {updNilaiSerial} ELSE nsijmlkeluar END) WHERE {updFilterSerial}
```

```sql
UPDATE m7_asset a SET a.agudang = '{gudangInKembali}' WHERE a.aid IN({strValue2.ToString})
```

```sql
UPDATE m7_asset a SET a.agudang = '{gudangIn}' WHERE a.aid IN({strValue2.ToString})
```

```sql
INSERT INTO m1_item_stock_warehouse (idbarang, kgudang, stok) VALUES {updStokOut} ON DUPLICATE KEY UPDATE stok = stok + VALUES(stok)
```

```sql
INSERT INTO m1_item_stock_warehouse (idbarang, kgudang, stok) VALUES {updStokIn} ON DUPLICATE KEY UPDATE stok = stok + VALUES(stok)
```

```sql
INSERT INTO m1_item_stock_warehouse (idbarang, kgudang, stok) VALUES {updStokInKembali} ON DUPLICATE KEY UPDATE stok = stok + VALUES(stok)
```

```sql
SELECT drd.iddrdetail, drd.idbarang, drd.namabarang, drd.tipebarang, drd.jml, drd.jmlbarang, drd.jmlkembali, drd.jmlbarangkembali, drd.satuan, drd.satuanbarang, drd.matauang, drd.kurs, drd.harga, drd.diskon, drd.jmldiskon, drd.hpp, drd.idhppkhususmasuk, drd.gudangasal, drd.gudangtransit, drd.gudangtujuan, drd.gudangkembali, drd.catatan, drd.costcenter, drd.divisi, drd.subdivisi, drd.proyek, dr.drinputtgl, i.bhpp FROM m5_dr_detail drd JOIN m5_dr dr ON drd.iddr = dr.drid JOIN m1_item i ON drd.idbarang = i.bid WHERE drd.iddr = '{result_4}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}'
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Drtgl, Drnotransaksi, Drstatus FROM M5_Dr WHERE Drid='{idtransaksi}'
```

```sql
SELECT bkode, nbikode FROM m1_no_batch_in JOIN m1_item ON nbiidbarang = bid WHERE nbisumber = '{sumber}' AND nbiidtransaksi = '{idtransaksi}' AND nbijmlkeluar > 0
```

```sql
SELECT bkode, nsikode FROM m1_no_serial_in JOIN m1_item ON nsiidbarang = bid WHERE nsisumber = '{sumber}' AND nsiidtransaksi = '{idtransaksi}' AND nsijmlkeluar > 0
```

```sql
SELECT iddrdetail, idbarang, tipebarang, namabarang, satuan, nilaisatuan, jmlbarang, jmlbarangkembali, iddodetail, gudangtransit, gudangtujuan, gudangkembali, idhppkhususmasuk, idhppfifomasuk, urutan FROM m5_dr_detail WHERE iddr = '{idtransaksi}'
```

```sql
SELECT atasetid, atidbarang, atkode FROM M7_Asset_Transaction WHERE atsumber = '{sumber}' AND atidutama = '{idtransaksi}'
```

```sql
SELECT nboidbatchin, nbogudang, nboidbarang, nbokode, nbojmlkeluar FROM m1_no_batch_out WHERE nbosumber = '{sumber}' AND nboidtransaksi = '{idtransaksi}'
```

```sql
DELETE FROM m1_no_batch_in WHERE nbisumber = '{sumber}' AND nbiidtransaksi = '{idtransaksi}'
```

```sql
DELETE FROM m1_no_batch_out WHERE nbosumber = '{sumber}' AND nboidtransaksi = '{idtransaksi}'
```

```sql
SELECT nsoidserialin, nsogudang, nsoidbarang, nsokode, nsojmlkeluar FROM m1_no_serial_out WHERE nsosumber = '{sumber}' AND nsoidtransaksi = '{idtransaksi}'
```

```sql
DELETE FROM m1_no_serial_in WHERE nsisumber = '{sumber}' AND nsiidtransaksi = '{idtransaksi}'
```

```sql
DELETE FROM m1_no_serial_out WHERE nsosumber = '{sumber}' AND nsoidtransaksi = '{idtransaksi}'
```

```sql
INSERT INTO m1_item_stock_warehouse (idbarang, kgudang, stok) VALUES {updStokOutKembali} ON DUPLICATE KEY UPDATE stok = stok + VALUES(stok)
```

```sql
DELETE FROM m1_item_transaction WHERE sumber = '{sumber}' AND idutama = '{idtransaksi}'
```

```sql
UPDATE M5_Dr SET Drstatus = {nilaiStatus}, Drmodifikasiuser='{userid}', Drmodifikasitgl = NOW(), Drposting = 0, Drpostingtgl = '1971-01-01 00:00:00', Drjmlrevisi = Drjmlrevisi + 1 WHERE Drid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Drid, Drnotransaksi FROM M5_Dr WHERE Drid='{idtransaksi}'
```

```sql
SELECT drcabang, drlokasi, drsumber, drautonotransaksi, drnotransaksi, drtgl
```

```sql
DELETE FROM M5_Dr_Detail WHERE iddr='{idtransaksi}'
```

```sql
DELETE FROM M5_Dr WHERE drid='{idtransaksi}'
```

```sql
SELECT bid, bkode FROM m1_item WHERE (bjenis <> 'J') AND (bhpp = 'I') AND ({ftBarang})
```

```sql
SELECT csi.idhppikm, csi.idbarang, csi.sisa, i.bkode FROM m1_cogs_special_in csi JOIN m1_item i ON csi.idbarang = i.bid WHERE {ftHppI}
```

```sql
SELECT `do`.donotransaksi as notransaksi, `do`.dohargatermasukpajak as termasukpajak, (CASE `do`.dohargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajaknama FROM m5_do_detail dod JOIN m5_do `do` ON dod.iddo = `do`.doid WHERE {ftDO} GROUP BY `do`.dohargatermasukpajak
```

```sql
SELECT i.bkode, dod.iddodetail, `do`.donotransaksi as notransaksi, (CASE `do`.dohargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_do_detail dod JOIN m5_do `do` ON dod.iddo = `do`.doid JOIN m1_item i ON dod.idbarang = i.bid WHERE ({ftDO}) AND `do`.dohargatermasukpajak <> {termasukPajak} ORDER BY dod.urutan
```

```sql
SELECT dod.iddodetail, (dod.jmlbarang - dod.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m5_do_detail AS dod INNER JOIN m1_item AS i ON dod.idbarang = i.bid WHERE {ftOutstandingDO}
```

```sql
SELECT isw.idbarang, isw.kgudang, isw.stok - IFNULL(isb.jmlbooking,0) as stok, i.bkode FROM m1_item_stock_warehouse isw JOIN m1_item i ON isw.idbarang = i.bid AND i.bjenis <> 'J' LEFT JOIN m1_warehouse w ON isw.kgudang = w.wkode LEFT JOIN m1_item_booking isb ON isw.idbarang = isb.idbarang AND w.wbookingstok = 1 WHERE {ftStok}
```

```sql
SELECT nbi.nbiidbarang, nbi.nbikode, nbi.nbigudang, nbi.nbijmlsisa, i.bkode FROM m1_no_batch_in nbi JOIN m1_item i ON nbi.nbiidbarang = i.bid WHERE {ftBatch}
```

```sql
SELECT nsi.nsiidbarang, nsi.nsikode, nsi.nsigudang, nsi.nsijmlsisa, i.bkode FROM m1_no_serial_in nsi JOIN m1_item i ON nsi.nsiidbarang = i.bid WHERE {ftSerial}
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_dr_history.vb`

```sql
INSERT INTO m5_dr_history(SELECT 0, dr.* FROM m5_dr dr WHERE dr.drid = '{idtransaksi}')
```

```sql
SELECT dridhistory FROM m5_dr_history WHERE drid = '{idtransaksi}' ORDER BY drmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m5_dr_detail_history (SELECT 0, '{result_4}', dr.* FROM m5_dr_detail dr WHERE dr.iddr = '{idtransaksi}' )
```

```sql
INSERT INTO m1_no_batch_transaction_history(SELECT 0, '{result_4}', nb.* FROM m1_no_batch_transaction nb WHERE nb.nbtidtransaksi = '{idtransaksi}' and nb.nbtsumber = 'DR')
```

```sql
INSERT INTO m1_no_serial_transaction_history(SELECT 0, '{result_4}', ns.* FROM m1_no_serial_transaction ns WHERE ns.nstidtransaksi = '{idtransaksi}' and ns.nstsumber = 'DR')
```

```sql
INSERT INTO m7_asset_transaction_history(SELECT 0, '{result_4}', atr.* FROM m7_asset_transaction atr WHERE atr.atidutama = '{idtransaksi}' and atr.atsumber = 'DR')
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_files.vb`

```sql
UPDATE m5_files SET fcatatan = CASE fnamafile {strValue1.ToString} ELSE fcatatan END, fukuranfile = CASE fnamafile {strValue2.ToString} ELSE fukuranfile END, ftanggal = CASE fnamafile {strValue3.ToString} ELSE ftanggal END WHERE fsumber='{sumber}' AND fidtransaksi='{idtrans}'
```

```sql
DELETE FROM M5_Files WHERE fsumber = '{sumber}' AND fidtransaksi ='{idtransaksi}' AND fnamafile='{namafile}'
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_ic.vb`

```sql
SELECT rc.rcmoduleid, rc.rcidpc, rc.rcrole, rc.rcakses FROM m0_permissions_custom pc JOIN m0_role_custom rc ON pc.pcmodule = rc.rcmoduleid AND pc.pcid = rc.rcidpc AND pc.pcmodule = 5 AND pc.pcid = 7 JOIN m0_user_role ur ON rc.rcrole = ur.role AND ur.userid = '{userid}' ORDER BY rc.rcakses DESC LIMIT 1
```

```sql
SELECT COUNT(icid), icnotransaksi FROM M5_IC WHERE icid='{result_4}' AND icstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(icid) FROM M5_IC WHERE icnotransaksi='{notransaksi}'
```

```sql
SELECT COUNT(icid) FROM m5_ic WHERE icnotransaksi='{notransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}'
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Ictgl, Icnotransaksi, Icstatus FROM M5_Ic WHERE Icid='{idtransaksi}'
```

```sql
UPDATE M5_Ic SET Icstatus = {nilaiStatus}, Icmodifikasiuser='{userid}', Icmodifikasitgl = NOW(), Icposting = 0, Icpostingtgl = '1971-01-01 00:00:00', Icjmlrevisi = Icjmlrevisi + 1 WHERE Icid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Icid, Icnotransaksi FROM M5_Ic WHERE Icid='{idtransaksi}'
```

```sql
SELECT iccabang, iclokasi, icsumber, icautonotransaksi, icnotransaksi, ictgl
```

```sql
DELETE FROM M5_Ic_Detail WHERE idic='{idtransaksi}'
```

```sql
DELETE FROM M5_Ic WHERE icid='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_ic_history.vb`

```sql
INSERT INTO m5_ic_history(SELECT 0, ic.* FROM m5_ic ic WHERE ic.icid = '{idtransaksi}')
```

```sql
SELECT icidhistory FROM m5_ic_history WHERE icid = '{idtransaksi}' ORDER BY icmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m5_ic_detail_history (SELECT 0, '{result_4}', ic.* FROM m5_ic_detail ic WHERE ic.idic = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_ip.vb`

```sql
SELECT COUNT(ipid), ipnotransaksi FROM M5_ip WHERE ipid='{result_4}' AND ipstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(ipid) FROM M5_ip WHERE ipnotransaksi='{notransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}'
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Iptgl, Ipnotransaksi, Ipstatus FROM M5_Ip WHERE Ipid='{idtransaksi}'
```

```sql
DELETE FROM M2_Transaction_Journal WHERE tsumber = 'IP' AND tidtransaksi = '{idtransaksi}' AND tnotransaksi = '{notransaksi}'
```

```sql
DELETE FROM m2_giro_list WHERE glsumber = 'IP' AND glidtransaksi = '{idtransaksi}' AND glnotransaksi = '{notransaksi}'
```

```sql
UPDATE M5_Ip SET Ipstatus = {nilaiStatus}, Ipmodifikasiuser='{userid}', Ipmodifikasitgl = NOW(), Ipposting = 0, Ippostingtgl = '1971-01-01 00:00:00', Ipjmlrevisi = Ipjmlrevisi + 1 WHERE Ipid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Ipid, Ipnotransaksi FROM M5_Ip WHERE Ipid='{idtransaksi}'
```

```sql
SELECT ipcabang, iplokasi, ipsumber, ipautonotransaksi, ipnotransaksi, iptgl
```

```sql
DELETE FROM M5_Ip_Pay WHERE idip = '{idtransaksi}'
```

```sql
DELETE FROM M5_Ip WHERE ipid = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_ip_history.vb`

```sql
INSERT INTO m5_ip_history(SELECT 0, ip.* FROM m5_ip ip WHERE ip.ipid = '{idtransaksi}')
```

```sql
SELECT ipidhistory FROM m5_ip_history WHERE ipid = '{idtransaksi}' ORDER BY ipmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m5_ip_pay_history (SELECT 0, '{result_4}', ip.* FROM m5_ip_pay ip WHERE ip.idip = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_notes.vb`

```sql
SELECT COUNT(nid) FROM M5_Notes WHERE nid='{result_4}'
```

```sql
DELETE FROM M5_Notes WHERE nid = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_pi.vb`

```sql
SELECT COUNT(piid), pinotransaksi FROM M5_pi WHERE piid='{result_4}' AND pistatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(piid) FROM m5_pi WHERE pinotransaksi='{notransaksi}'
```

```sql
UPDATE m5_so_detail SET jmlrealisasi = (CASE idsodetail {updNilai} ELSE jmlrealisasi END) WHERE {updFilter}
```

```sql
SELECT idso FROM m5_so_detail WHERE {updFilter} GROUP BY idso
```

```sql
SELECT idso, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m5_so_detail WHERE {ftDetail} GROUP BY idso
```

```sql
UPDATE m5_so SET sostatusrealisasi = (CASE soid {updNilai} ELSE sostatusrealisasi END) WHERE {updFilter}
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}'
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Pitgl, Pinotransaksi, Pistatus FROM M5_Pi WHERE Piid='{idtransaksi}'
```

```sql
SELECT idbarang, tipebarang, namabarang, satuan, nilaisatuan, jmlbarang, idsodetail, urutan FROM m5_pi_detail WHERE idpi = '{idtransaksi}'
```

```sql
UPDATE M5_Pi SET Pistatus = {nilaiStatus}, Pimodifikasiuser='{userid}', Pimodifikasitgl = NOW(), Piposting = 0, Pipostingtgl = '1971-01-01 00:00:00', Pijmlrevisi = Pijmlrevisi + 1 WHERE Piid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Piid, Pinotransaksi FROM M5_Pi WHERE Piid='{idtransaksi}'
```

```sql
SELECT picabang, pilokasi, pisumber, piautonotransaksi, pinotransaksi, pitgl
```

```sql
DELETE FROM M5_Pi_Detail WHERE idpi = {idtransaksi}
```

```sql
DELETE FROM M5_Pi WHERE piid = {idtransaksi}
```

```sql
SELECT so.sonotransaksi as notransaksi, (CASE so.sohargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_so_detail sod JOIN m5_so so ON sod.idso = so.soid WHERE {ftSO} GROUP BY so.sohargatermasukpajak
```

```sql
SELECT i.bkode, sod.idsodetail, so.sonotransaksi as notransaksi, (CASE so.sohargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_so_detail sod JOIN m5_so so ON sod.idso = so.soid JOIN m1_item i ON sod.idbarang = i.bid WHERE ({ftSO}) AND so.sohargatermasukpajak <> {termasukPajak} ORDER BY sod.urutan
```

```sql
SELECT sod.idsodetail, (sod.jmlbarang - sod.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m5_so_detail AS sod INNER JOIN m1_item AS i ON sod.idbarang = i.bid WHERE {ftOutstanding}
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_pi_history.vb`

```sql
INSERT INTO m5_pi_history(SELECT 0, pi.* FROM m5_pi pi WHERE pi.piid = '{idtransaksi}')
```

```sql
SELECT piidhistory FROM m5_pi_history WHERE piid = '{idtransaksi}' ORDER BY pimodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m5_pi_detail_history (SELECT 0, '{result_4}', pi.* FROM m5_pi_detail pi WHERE pi.idpi = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_pl.vb`

```sql
SELECT COUNT(plid), plnotransaksi FROM M5_pl WHERE plid='{result_4}' AND plstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(plid) FROM m5_pl WHERE plnotransaksi='{notransaksi}'
```

```sql
SELECT jml, harga, diskon, pajak1, jmlpajak1, pajak2, jmlpajak2 FROM m5_pi_detail WHERE idpidetail = '{dr1_idpidetail}'
```

```sql
SELECT jml, harga, diskon, pajak1, jmlpajak1, pajak2, jmlpajak2 FROM m5_so_detail WHERE idsodetail = '{dr1_idsodetail}'
```

```sql
UPDATE m5_so_detail SET jmlrealisasi = (CASE idsodetail {updNilaiSO} ELSE jmlrealisasi END) WHERE {updFilterSO}
```

```sql
SELECT idso FROM m5_so_detail WHERE {updFilterSO} GROUP BY idso
```

```sql
SELECT idso, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m5_so_detail WHERE {ftDetail} GROUP BY idso
```

```sql
UPDATE m5_so SET sostatusrealisasi = (CASE soid {updNilaiSO} ELSE sostatusrealisasi END) WHERE {updFilterSO}
```

```sql
UPDATE m5_pi_detail SET jmlrealisasi = (CASE idpidetail {updNilaiPI} ELSE jmlrealisasi END) WHERE {updFilterPI}
```

```sql
SELECT idpi FROM m5_pi_detail WHERE {updFilterPI} GROUP BY idpi
```

```sql
SELECT idpi, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m5_pi_detail WHERE {ftDetail} GROUP BY idpi
```

```sql
UPDATE m5_pi SET pistatusrealisasi = (CASE piid {updNilaiPI} ELSE pistatusrealisasi END) WHERE {updFilterPI}
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}'
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Pltgl, Plnotransaksi, Plstatus FROM M5_Pl WHERE Plid='{idtransaksi}'
```

```sql
SELECT idbarang, tipebarang, namabarang, satuan, nilaisatuan, jmlbarang, idsodetail, idpidetail, urutan FROM m5_pl_detail WHERE idpl = '{idtransaksi}'
```

```sql
UPDATE M5_Pl SET Plstatus = {nilaiStatus}, Plmodifikasiuser='{userid}', Plmodifikasitgl = NOW(), Plposting = 0, Plpostingtgl = '1971-01-01 00:00:00', Pljmlrevisi = Pljmlrevisi + 1 WHERE Plid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Plid, Plnotransaksi FROM M5_Pl WHERE Plid='{idtransaksi}'
```

```sql
SELECT plcabang, pllokasi, plsumber, plautonotransaksi, plnotransaksi, pltgl
```

```sql
DELETE FROM M5_Pl_Pack WHERE idpl ='{idtransaksi}'
```

```sql
DELETE FROM M5_Pl_Detail WHERE idpl ='{idtransaksi}'
```

```sql
DELETE FROM M5_Pl WHERE plid ='{idtransaksi}'
```

```sql
SELECT so.sonotransaksi as notransaksi, so.sohargatermasukpajak as termasukpajak, (CASE so.sohargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajaknama FROM m5_so_detail sod JOIN m5_so so ON sod.idso = so.soid WHERE {ftSO} GROUP BY so.sohargatermasukpajak
```

```sql
SELECT i.bkode, sod.idsodetail, so.sonotransaksi as notransaksi, (CASE so.sohargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_so_detail sod JOIN m5_so so ON sod.idso = so.soid JOIN m1_item i ON sod.idbarang = i.bid WHERE ({ftSO}) AND so.sohargatermasukpajak <> {termasukPajak} ORDER BY sod.urutan
```

```sql
SELECT sod.idsodetail, (sod.jmlbarang - sod.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m5_so_detail AS sod INNER JOIN m1_item AS i ON sod.idbarang = i.bid WHERE {ftOutstandingSO}
```

```sql
SELECT pi.pinotransaksi as notransaksi, pi.pihargatermasukpajak as termasukpajak, (CASE pi.pihargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajaknama FROM m5_pi_detail pid JOIN m5_pi pi ON pid.idpi = pi.piid WHERE {ftPI} GROUP BY pi.pihargatermasukpajak
```

```sql
SELECT i.bkode, pid.idpidetail, pi.pinotransaksi as notransaksi, (CASE pi.pihargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_pi_detail pid JOIN m5_pi pi ON pid.idpi = pi.piid JOIN m1_item i ON pid.idbarang = i.bid WHERE ({ftPI}) AND pi.pihargatermasukpajak <> {termasukPajak} ORDER BY pid.urutan
```

```sql
SELECT pid.idpidetail, (pid.jmlbarang - pid.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m5_pi_detail AS pid INNER JOIN m1_item AS i ON pid.idbarang = i.bid WHERE {ftOutstandingPI}
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_pl_history.vb`

```sql
INSERT INTO m5_pl_history(SELECT 0, pl.* FROM m5_pl pl WHERE pl.plid = '{idtransaksi}')
```

```sql
SELECT plidhistory FROM m5_pl_history WHERE plid = '{idtransaksi}' ORDER BY plmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m5_pl_detail_history (SELECT 0, '{result_4}', pl.* FROM m5_pl_detail pl WHERE pl.idpl = '{idtransaksi}' )
```

```sql
INSERT INTO m5_pl_pack_history (SELECT 0, '{result_4}', pl.* FROM m5_pl_pack pl WHERE pl.idpl = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_print.vb`

```sql
UPDATE M5_SQ SET SQcetakanke=SQcetakanke+1 WHERE SQid='{idtransaksi}'
```

```sql
UPDATE M5_SO SET SOcetakanke=SOcetakanke+1 WHERE SOid='{idtransaksi}'
```

```sql
UPDATE M5_AS SET AScetakanke=AScetakanke+1 WHERE ASid='{idtransaksi}'
```

```sql
UPDATE M5_PL SET PLcetakanke=PLcetakanke+1 WHERE PLid='{idtransaksi}'
```

```sql
UPDATE M5_DO SET DOcetakanke=DOcetakanke+1 WHERE DOid='{idtransaksi}'
```

```sql
UPDATE M5_DR SET DRcetakanke=DRcetakanke+1 WHERE DRid='{idtransaksi}'
```

```sql
UPDATE M5_PI SET PIcetakanke=PIcetakanke+1 WHERE PIid='{idtransaksi}'
```

```sql
UPDATE M5_SI SET SIcetakanke=SIcetakanke+1 WHERE SIid='{idtransaksi}'
```

```sql
UPDATE M5_RNR SET RNRcetakanke=RNRcetakanke+1 WHERE RNRid='{idtransaksi}'
```

```sql
UPDATE M5_SR SET SRcetakanke=SRcetakanke+1 WHERE SRid='{idtransaksi}'
```

```sql
UPDATE M5_IC SET ICcetakanke=ICcetakanke+1 WHERE ICid='{idtransaksi}'
```

```sql
UPDATE M5_PV SET PVcetakanke=PVcetakanke+1 WHERE PVid='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_pv.vb`

```sql
SELECT snilai FROM m0_setting WHERE (smodule='0') AND (sgrup='accounting') AND (skode='MataUangFungsional')
```

```sql
SELECT COUNT(pvid), pvnotransaksi FROM M5_Pv WHERE pvid='{result_4}' AND pvstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(pvid) FROM M5_Pv WHERE pvnotransaksi='{notransaksi}'
```

```sql
SELECT COUNT(pvid) FROM m5_pv WHERE pvnotransaksi='{notransaksi}'
```

```sql
SELECT pv.pvcustomer, pvd.sumber, SUM(pvd.jmlbayar) as jmlbayar FROM m5_pv_detail pvd JOIN m5_pv pv ON pvd.idpv = pv.pvid AND pv.pvid = '{result_4}' AND pvd.sumber IN('SI','SR') GROUP BY pvd.sumber
```

```sql
UPDATE m1_contact c SET c.ktotalpiutang = c.ktotalpiutang - {Double_Parse_dr1_jmlbayar} WHERE c.kid = '{dr1_pvcustomer}'
```

```sql
UPDATE m1_contact c SET c.ktotalpiutang = c.ktotalpiutang + {Double_Parse_dr1_jmlbayar} WHERE c.kid = '{dr1_pvcustomer}'
```

```sql
UPDATE m5_ic_detail SET jmlpv = (CASE idicdetail {updNilai} ELSE jmlpv END), jmlpvvalas = (CASE idicdetail {updNilaiValas} ELSE jmlpvvalas END) WHERE {updFilter}
```

```sql
SELECT idic FROM m5_ic_detail WHERE {updFilter} GROUP BY idic
```

```sql
SELECT idic, GROUP_CONCAT(DISTINCT statuspv) as statuspv FROM m5_ic_detail WHERE {ftDetail} GROUP BY idic
```

```sql
UPDATE m5_ic SET icstatuspv = (CASE icid {updNilai} ELSE icstatuspv END) WHERE {updFilter}
```

```sql
UPDATE m5_si si SET si.sijmlbayar = (CASE si.siid {updNilaiSI} ELSE si.sijmlbayar END), si.sitgllunas = (CASE si.siid {updTglLunasSI} ELSE si.sitgllunas END) WHERE {updFilterSI}
```

```sql
UPDATE m5_si si JOIN m2_transaction_journal t ON si.sisumber = t.tsumber AND si.siid = t.tidtransaksi AND si.sinotransaksi = t.tnotransaksi SET t.tstatuslunas = si.sistatuslunas, t.ttgllunas = si.sitgllunas WHERE {updFilterSI}
```

```sql
UPDATE m5_as m5as SET m5as.asjumlahbayar = (CASE m5as.asid {updNilaiAS} ELSE m5as.asjumlahbayar END), m5as.asjumlahbayarvalas = (CASE m5as.asid {updNilaiValasAS} ELSE m5as.asjumlahbayarvalas END), m5as.astgllunas = (CASE m5as.asid {updTglLunasAS} ELSE m5as.astgllunas END) WHERE {updFilterAS}
```

```sql
UPDATE m5_as m5as JOIN m2_transaction_journal t ON m5as.assumber = t.tsumber AND m5as.asid = t.tidtransaksi AND m5as.asnotransaksi = t.tnotransaksi SET t.tstatuslunas = m5as.asstatusbayar, t.ttgllunas = m5as.astgllunas WHERE {updFilterAS}
```

```sql
UPDATE m5_sr sr SET sr.srjmlbayar = (CASE sr.srid {updNilaiSR} ELSE sr.srjmlbayar END), sr.srtgllunas = (CASE sr.srid {updTglLunasSR} ELSE sr.srtgllunas END) WHERE {updFilterSR}
```

```sql
UPDATE m5_sr sr JOIN m2_transaction_journal t ON sr.srsumber = t.tsumber AND sr.srid = t.tidtransaksi AND sr.srnotransaksi = t.tnotransaksi SET t.tstatuslunas = sr.srstatuslunas, t.ttgllunas = sr.srtgllunas WHERE {updFilterSR}
```

```sql
UPDATE m5_rp rp SET rp.rpjumlahbayar = (CASE rp.rpid {updNilaiRP} ELSE rp.rpjumlahbayar END), rp.rpjumlahbayarvalas = (CASE rp.rpid {updNilaiValasRP} ELSE rp.rpjumlahbayarvalas END), rp.rptgllunas = (CASE rp.rpid {updTglLunasRP} ELSE rp.rptgllunas END) WHERE {updFilterRP}
```

```sql
UPDATE m5_rp rp JOIN m2_transaction_journal t ON rp.rpsumber = t.tsumber AND rp.rpid = t.tidtransaksi AND rp.rpnotransaksi = t.tnotransaksi SET t.tstatuslunas = rp.rpstatusbayar, t.ttgllunas = rp.rptgllunas WHERE {updFilterRP}
```

```sql
UPDATE m5_ip ip SET ip.ipjumlahbayar = (CASE ip.ipid {updNilaiIP} ELSE ip.ipjumlahbayar END), ip.ipjumlahbayarvalas = (CASE ip.ipid {updNilaiValasIP} ELSE ip.ipjumlahbayarvalas END), ip.iptgllunas = (CASE ip.ipid {updTglLunasIP} ELSE ip.iptgllunas END) WHERE {updFilterIP}
```

```sql
UPDATE m5_ip ip JOIN m2_transaction_journal t ON ip.ipsumber = t.tsumber AND ip.ipid = t.tidtransaksi AND ip.ipnotransaksi = t.tnotransaksi SET t.tstatuslunas = ip.ipstatusbayar, t.ttgllunas = ip.iptgllunas WHERE {updFilterIP}
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}'
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Pvtgl, Pvnotransaksi, Pvstatus FROM M5_Pv WHERE Pvid='{idtransaksi}'
```

```sql
SELECT sumber, idtransaksi, matauang, jmlbayar, jmlbayarvalas, rekhutangpiutang, idicdetail, urutan FROM m5_pv_detail WHERE idpv = '{idtransaksi}'
```

```sql
SELECT pv.pvcustomer, pvd.sumber, SUM(pvd.jmlbayar) as jmlbayar FROM m5_pv_detail pvd JOIN m5_pv pv ON pvd.idpv = pv.pvid AND pv.pvid = '{idtransaksi}' AND pvd.sumber IN('SI','SR') GROUP BY pvd.sumber
```

```sql
UPDATE m5_si si SET si.sijmlbayar = (CASE si.siid {updNilaiSI} ELSE si.sijmlbayar END), si.sitgllunas = '{tglLunas}' WHERE {updFilterSI}
```

```sql
UPDATE m5_as m5as SET m5as.asjumlahbayar = (CASE m5as.asid {updNilaiAS} ELSE m5as.asjumlahbayar END), m5as.asjumlahbayarvalas = (CASE m5as.asid {updNilaiValasAS} ELSE m5as.asjumlahbayarvalas END), m5as.astgllunas = '{tglLunas}' WHERE {updFilterAS}
```

```sql
UPDATE m5_sr sr SET sr.srjmlbayar = (CASE sr.srid {updNilaiSR} ELSE sr.srjmlbayar END), sr.srtgllunas = '{tglLunas}' WHERE {updFilterSR}
```

```sql
UPDATE m5_rp rp SET rp.rpjumlahbayar = (CASE rp.rpid {updNilaiRP} ELSE rp.rpjumlahbayar END), rp.rpjumlahbayarvalas = (CASE rp.rpid {updNilaiValasRP} ELSE rp.rpjumlahbayarvalas END), rp.rptgllunas = '{tglLunas}' WHERE {updFilterRP}
```

```sql
UPDATE m5_ip ip SET ip.ipjumlahbayar = (CASE ip.ipid {updNilaiIP} ELSE ip.ipjumlahbayar END), ip.ipjumlahbayarvalas = (CASE ip.ipid {updNilaiValasIP} ELSE ip.ipjumlahbayarvalas END), ip.iptgllunas = '{tglLunas}' WHERE {updFilterIP}
```

```sql
DELETE FROM M2_Transaction_Journal WHERE tsumber = 'PV' AND tidtransaksi = '{idtransaksi}' AND tnotransaksi = '{notransaksi}'
```

```sql
UPDATE M5_Pv SET Pvstatus = {nilaiStatus}, Pvmodifikasiuser='{userid}', Pvmodifikasitgl = NOW(), Pvposting = 0, Pvpostingtgl = '1971-01-01 00:00:00', Pvjmlrevisi = Pvjmlrevisi + 1 WHERE Pvid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Pvid, Pvnotransaksi FROM M5_Pv WHERE Pvid='{idtransaksi}'
```

```sql
SELECT pvcabang, pvlokasi, pvsumber, pvautonotransaksi, pvnotransaksi, pvtgl
```

```sql
DELETE FROM M5_Pv_Detail WHERE idpv='{idtransaksi}'
```

```sql
DELETE FROM M5_Pv WHERE pvid='{idtransaksi}'
```

```sql
SELECT icd.idicdetail, (icd.jmlbayar - icd.jmlpv) as sisapv, (icd.jmlbayarvalas - icd.jmlpvvalas) as sisapvvalas, icd.matauang, icd.sumber, (CASE icd.sumber WHEN 'AS' THEN `as`.asnotransaksi WHEN 'SI' THEN si.sinotransaksi WHEN 'SR' THEN sr.srnotransaksi ELSE icd.rekhutangpiutang END) as notransaksi FROM m5_ic_detail AS icd LEFT JOIN m5_as `as` ON icd.sumber = 'AS' AND icd.idtransaksi = `as`.asid LEFT JOIN m5_si si ON icd.sumber = 'SI' AND icd.idtransaksi = si.siid LEFT JOIN m5_sr sr ON icd.sumber = 'SR' AND icd.idtransaksi = sr.srid WHERE {ftOutstanding}
```

```sql
SELECT si.siid, si.sisumber, si.sitgl, si.sinotransaksi FROM m5_si si WHERE si.sitgl > '{tglPembayaran}' AND ({updFilterSI})
```

```sql
SELECT si.siid, si.sisumber, si.sinotransaksi, si.simatauang, si.sitotaltransaksi - si.sijmlbayar as sisisatransaksi FROM m5_si si LEFT JOIN m0_setting s ON s.smodule =0 AND s.sgrup='accounting' AND s.skode = 'MataUangFungsional' WHERE {ftOutstandingSI}
```

```sql
SELECT m5as.asid, m5as.assumber, m5as.astgl, m5as.asnotransaksi FROM m5_as m5as WHERE m5as.astgl > '{tglPembayaran}' AND ({updFilterAS})
```

```sql
SELECT m5as.asid, m5as.assumber, m5as.asnotransaksi, m5as.asmatauang, (CASE m5as.asmatauang WHEN s.snilai THEN m5as.asjumlah - m5as.asjumlahbayar ELSE m5as.asjumlahvalas - m5as.asjumlahbayarvalas END) assisatransaksi FROM m5_as as LEFT JOIN m0_setting s ON s.smodule =0 AND s.sgrup='accounting' AND s.skode = 'MataUangFungsional' WHERE {ftOutstandingAS}
```

```sql
SELECT sr.srid, sr.srsumber, sr.srtgl, sr.srnotransaksi FROM m5_sr sr WHERE sr.srtgl > '{tglPembayaran}' AND ({updFilterSR})
```

```sql
SELECT sr.srid, sr.srsumber, sr.srnotransaksi, sr.srmatauang, sr.srtotaltransaksi - sr.srjmlbayar as srsisatransaksi FROM m5_sr sr LEFT JOIN m0_setting s ON s.smodule =0 AND s.sgrup='accounting' AND s.skode = 'MataUangFungsional' WHERE {ftOutstandingSR}
```

```sql
SELECT rp.rpid, rp.rpsumber, rp.rptgl, rp.rpnotransaksi FROM m5_rp rp WHERE rp.rptgl > '{tglPembayaran}' AND ({updFilterRP})
```

```sql
SELECT rp.rpid, rp.rpsumber, rp.rpnotransaksi, rp.rpmatauang, (CASE rp.rpmatauang WHEN s.snilai THEN rp.rpjumlah - rp.rpjumlahbayar ELSE rp.rpjumlahvalas - rp.rpjumlahbayarvalas END) rpsisatransaksi FROM m5_rp rp LEFT JOIN m0_setting s ON s.smodule =0 AND s.sgrup='accounting' AND s.skode = 'MataUangFungsional' WHERE {ftOutstandingRP}
```

```sql
SELECT ip.ipid, ip.ipsumber, ip.iptgl, ip.ipnotransaksi FROM m5_ip ip WHERE ip.iptgl > '{tglPembayaran}' AND ({updFilterIP})
```

```sql
SELECT ip.ipid, ip.ipsumber, ip.ipnotransaksi, ip.ipmatauang, (CASE ip.ipmatauang WHEN s.snilai THEN ip.ipjumlah - ip.ipjumlahbayar ELSE ip.ipjumlahvalas - ip.ipjumlahbayarvalas END) ipsisatransaksi FROM m5_ip ip LEFT JOIN m0_setting s ON s.smodule =0 AND s.sgrup='accounting' AND s.skode = 'MataUangFungsional' WHERE {ftOutstandingIP}
```

```sql
SELECT idic, SUM(jmlbayar) as jmlbayar, SUM(jmlpv) as jmlpv FROM m5_ic_detail WHERE {ftDetail} GROUP BY idic
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_pv_history.vb`

```sql
INSERT INTO m5_pv_history(SELECT 0, pv.* FROM m5_pv pv WHERE pv.pvid = '{idtransaksi}')
```

```sql
SELECT pvidhistory FROM m5_pv_history WHERE pvid = '{idtransaksi}' ORDER BY pvmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m5_pv_detail_history (SELECT 0, '{result_4}', pv.* FROM m5_pv_detail pv WHERE pv.idpv = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_rnr.vb`

```sql
SELECT COUNT(rnrid), rnrnotransaksi FROM M5_rnr WHERE rnrid='{result_4}' AND rnrstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(rnrid) FROM M5_rnr WHERE rnrnotransaksi='{notransaksi}'
```

```sql
SELECT COUNT(rnrid) FROM m5_rnr WHERE rnrnotransaksi='{notransaksi}'
```

```sql
SELECT jml, harga, diskon, pajak1, jmlpajak1, pajak2, jmlpajak2, IFNULL(t1.tnilai,0) as nilaipajak1, IFNULL(t2.tnilai,0) as nilaipajak2 FROM m5_si_detail LEFT JOIN m1_tax t1 ON pajak1 = t1.tkode LEFT JOIN m1_tax t2 ON pajak2 = t2.tkode WHERE idsidetail = '{dr1_idsidetail}'
```

```sql
UPDATE m5_si_detail SET jmlrealisasi = (CASE idsidetail {updNilaiSI} ELSE jmlrealisasi END) WHERE {updFilterSI}
```

```sql
SELECT idsi FROM m5_si_detail WHERE {updFilterSI} GROUP BY idsi
```

```sql
SELECT idsi, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m5_si_detail WHERE {ftDetail} GROUP BY idsi
```

```sql
UPDATE m5_si SET sistatusrealisasi = (CASE siid {updNilaiSI} ELSE sistatusrealisasi END) WHERE {updFilterSI}
```

```sql
SELECT rnrd.idrnrdetail, rnrd.idbarang, rnrd.namabarang, rnrd.tipebarang, rnrd.jml, rnrd.satuan, rnrd.jmlbarang, rnrd.satuanbarang, rnrd.matauang, rnrd.kurs, rnrd.harga, rnrd.diskon, rnrd.hpp, rnrd.jmldiskon, rnr.rnrgudang as gudang, rnrd.catatan, rnrd.costcenter, rnrd.divisi, rnrd.subdivisi, rnrd.proyek, rnr.rnrinputtgl, i.bhpp, rnrd.jmlpajak1, rnrd.jmlpajak2, (CASE LENGTH(IFNULL(cc.ccakun,'')) WHEN 0 THEN 1 ELSE 0 END) as transbarang FROM m5_rnr_detail rnrd JOIN m5_rnr rnr ON rnrd.idrnr = rnr.rnrid JOIN m1_item i ON rnrd.idbarang = i.bid LEFT JOIN m1_cost_center cc ON rnrd.costcenter = cc.cckode WHERE rnrd.idrnr = '{result_4}' ORDER BY rnrd.urutan
```

```sql
SELECT bstok FROM m1_item WHERE bid = '{idbarang}'
```

```sql
INSERT INTO m1_item_stock_warehouse (idbarang, kgudang, stok) VALUES ('{idbarang}','{gudang}','{jmlbarang}') ON DUPLICATE KEY UPDATE stok = stok + VALUES(stok)
```

```sql
UPDATE m1_item SET bstok = '{saldojml}' WHERE bid = '{idbarang}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}'
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Rnrtgl, Rnrnotransaksi, Rnrstatus FROM M5_Rnr WHERE Rnrid='{idtransaksi}'
```

```sql
SELECT bkode, nbikode FROM m1_no_batch_in JOIN m1_item ON nbiidbarang = bid WHERE nbisumber = '{sumber}' AND nbiidtransaksi = '{idtransaksi}' AND nbijmlkeluar > 0
```

```sql
SELECT bkode, nsikode FROM m1_no_serial_in JOIN m1_item ON nsiidbarang = bid WHERE nsisumber = '{sumber}' AND nsiidtransaksi = '{idtransaksi}' AND nsijmlkeluar > 0
```

```sql
SELECT idrnrdetail, idbarang, tipebarang, namabarang, satuan, nilaisatuan, jmlbarang, idsidetail, gudangtransit, gudangtujuan, urutan, (CASE LENGTH(IFNULL(cc.ccakun,'')) WHEN 0 THEN 1 ELSE 0 END) as transbarang FROM m5_rnr_detail rnrd LEFT JOIN m1_cost_center cc ON rnrd.costcenter = cc.cckode WHERE idrnr = '{idtransaksi}'
```

```sql
DELETE FROM m1_cogs_special_in WHERE {ftHppI}
```

```sql
DELETE FROM m1_cogs_fifo_in WHERE {ftHppF}
```

```sql
DELETE FROM m1_no_batch_in WHERE nbisumber = '{sumber}' AND nbiidtransaksi = '{idtransaksi}'
```

```sql
DELETE FROM m1_no_serial_in WHERE nsisumber = '{sumber}' AND nsiidtransaksi = '{idtransaksi}'
```

```sql
INSERT INTO m1_item_stock_warehouse (idbarang, kgudang, stok) VALUES {updStokOut} ON DUPLICATE KEY UPDATE stok = stok + VALUES(stok)
```

```sql
UPDATE m1_item SET bstok = (CASE bid {updStokBarang} ELSE bstok END) WHERE {ftStokBarang}
```

```sql
DELETE FROM m1_item_transaction WHERE sumber = '{sumber}' AND idutama = '{idtransaksi}'
```

```sql
UPDATE m1_item i
```

```sql
DELETE FROM M2_Transaction_Journal WHERE tsumber = '{sumber}' AND tidtransaksi = '{idtransaksi}' AND tnotransaksi = '{notransaksi}'
```

```sql
UPDATE M5_Rnr SET Rnrstatus = {nilaiStatus}, Rnrmodifikasiuser='{userid}', Rnrmodifikasitgl = NOW(), Rnrposting = 0, Rnrpostingtgl = '1971-01-01 00:00:00', Rnrjmlrevisi = Rnrjmlrevisi + 1 WHERE Rnrid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Rnrid, Rnrnotransaksi FROM M5_Rnr WHERE Rnrid='{idtransaksi}'
```

```sql
SELECT rnrcabang, rnrlokasi, rnrsumber, rnrautonotransaksi, rnrnotransaksi, rnrtgl
```

```sql
DELETE FROM M5_Rnr_Detail WHERE idrnr='{idtransaksi}'
```

```sql
DELETE FROM M5_Rnr WHERE rnrid='{idtransaksi}'
```

```sql
SELECT si.sinotransaksi as notransaksi, si.sihargatermasukpajak as termasukpajak, (CASE si.sihargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajaknama FROM m5_si_detail sid JOIN m5_si si ON sid.idsi = si.siid WHERE {ftSI} GROUP BY si.sihargatermasukpajak
```

```sql
SELECT i.bkode, sid.idsidetail, si.sinotransaksi as notransaksi, (CASE si.sihargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_si_detail sid JOIN m5_si si ON sid.idsi = si.siid JOIN m1_item i ON sid.idbarang = i.bid WHERE ({ftSI}) AND si.sihargatermasukpajak <> {termasukPajak} ORDER BY sid.urutan
```

```sql
SELECT sid.idsidetail, (sid.jmlbarang - sid.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m5_si_detail AS sid INNER JOIN m1_item AS i ON sid.idbarang = i.bid WHERE {ftOutstandingSI}
```

```sql
SELECT idbarang, bkode FROM m1_cogs_special_in JOIN m1_item ON idbarang = bid AND bjenis <> 'J' WHERE ({ftHppI}) AND jmlkeluar > 0
```

```sql
SELECT cfiidbarang, bkode FROM m1_cogs_fifo_in JOIN m1_item ON cfiidbarang = bid AND bjenis <> 'J' WHERE ({ftHppI}) AND cfijmlkeluar > 0
```

```sql
SELECT isw.idbarang, isw.kgudang, isw.stok, i.bkode FROM m1_item_stock_warehouse isw JOIN m1_item i ON isw.idbarang = i.bid AND i.bjenis <> 'J' WHERE {ftStok}
```

```sql
SELECT jml, harga, diskon, pajak1, jmlpajak1, pajak2, jmlpajak2 FROM m5_si_detail WHERE idsidetail = '{dr1_idsidetail}'
```

```sql
SELECT idrnrdetail, idbarang, tipebarang, namabarang, satuan, nilaisatuan, jmlbarang, idsidetail, gudangtransit, gudangtujuan, urutan FROM m5_rnr_detail WHERE idrnr = '{idtransaksi}'
```

```sql
SELECT rnr.rnrid AS rnrid, rnr.rnrnotransaksi AS rnrnotransaksi, sq.sqsumber AS sumber, sq.sqid AS idterkait, sq.sqnotransaksi AS noterkait, sq.sqtgl AS tglterkait, sq.sqinputtgl AS inputtglterkait, sq.sqmodifikasitgl AS modifikasitglterkait, 0 as jenisterkait FROM m5_sq_detail sqd JOIN m5_sq sq ON sqd.idsq = sqid JOIN m5_rnr_detail rnrd ON sqd.idsqdetail = rnrd.idsqdetail JOIN m5_rnr rnr ON rnrd.idrnr = rnr.rnrid {filter2} GROUP BY sq.sqid, rnr.rnrid
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_rnr_history.vb`

```sql
INSERT INTO m5_rnr_history(SELECT 0, rnr.* FROM m5_rnr rnr WHERE rnr.rnrid = '{idtransaksi}')
```

```sql
SELECT rnridhistory FROM m5_rnr_history WHERE rnrid = '{idtransaksi}' ORDER BY rnrmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m5_rnr_detail_history (SELECT 0, '{result_4}', rnr.* FROM m5_rnr_detail rnr WHERE rnr.idrnr = '{idtransaksi}' )
```

```sql
INSERT INTO m1_no_batch_transaction_history(SELECT 0, '{result_4}', nb.* FROM m1_no_batch_transaction nb WHERE nb.nbtidtransaksi = '{idtransaksi}' and nb.nbtsumber = 'RNR')
```

```sql
INSERT INTO m1_no_serial_transaction_history(SELECT 0, '{result_4}', ns.* FROM m1_no_serial_transaction ns WHERE ns.nstidtransaksi = '{idtransaksi}' and ns.nstsumber = 'RNR')
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_rp.vb`

```sql
SELECT COUNT(rpid), rpnotransaksi FROM M5_rp WHERE rpid='{result_4}' AND rpstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(rpid) FROM M5_rp WHERE rpnotransaksi='{notransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}'
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Rptgl, Rpnotransaksi, Rpstatus FROM M5_Rp WHERE Rpid='{idtransaksi}'
```

```sql
DELETE FROM M2_Transaction_Journal WHERE tsumber = 'RP' AND tidtransaksi = '{idtransaksi}' AND tnotransaksi = '{notransaksi}'
```

```sql
DELETE FROM m2_giro_list WHERE glsumber = 'RP' AND glidtransaksi = '{idtransaksi}' AND glnotransaksi = '{notransaksi}'
```

```sql
UPDATE M5_Rp SET Rpstatus = {nilaiStatus}, Rpmodifikasiuser='{userid}', Rpmodifikasitgl = NOW(), Rpposting = 0, Rppostingtgl = '1971-01-01 00:00:00', Rpjmlrevisi = Rpjmlrevisi + 1 WHERE Rpid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Rpid, Rpnotransaksi FROM M5_Rp WHERE Rpid='{idtransaksi}'
```

```sql
SELECT rpcabang, rplokasi, rpsumber, rpautonotransaksi, rpnotransaksi, rptgl
```

```sql
DELETE FROM M5_Rp_Pay WHERE idrp = '{idtransaksi}'
```

```sql
DELETE FROM M5_Rp WHERE rpid = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_rp_history.vb`

```sql
INSERT INTO m5_rp_history(SELECT 0, rp.* FROM m5_rp rp WHERE rp.rpid = '{idtransaksi}')
```

```sql
SELECT rpidhistory FROM m5_rp_history WHERE rpid = '{idtransaksi}' ORDER BY rpmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m5_rp_pay_history (SELECT 0, '{result_4}', rp.* FROM m5_rp_pay rp WHERE rp.idrp = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_si.vb`

```sql
SELECT siid, sinotransaksi FROM m5_si WHERE sinoref = '{Filter}'
```

```sql
SELECT skode, snilai FROM `m0_setting` WHERE smodule = 12 AND sgrup = 'custom' AND (skode = 'CustomNama' OR skode = 'CustomWajib')
```

```sql
SELECT snilai FROM m0_setting WHERE (smodule='0') AND (sgrup='accounting') AND (skode='MataUangFungsional')
```

```sql
SELECT rc.rcmoduleid, rc.rcidpc, rc.rcrole, rc.rcakses FROM m0_permissions_custom pc JOIN m0_role_custom rc ON pc.pcmodule = rc.rcmoduleid AND pc.pcid = rc.rcidpc AND pc.pcmodule = 5 AND pc.pcid = 5 JOIN m0_user_role ur ON rc.rcrole = ur.role AND ur.userid = '{userid}' ORDER BY rc.rcakses DESC LIMIT 1
```

```sql
SELECT c.kbataspiutang, c.ktotalpiutang FROM m0_setting s JOIN m1_contact c ON c.kid = '{drutama_sicustomer}' AND s.smodule = 0 AND s.sgrup = 'options' AND s.skode = 'ValidasiPlafonPiutangSI' AND s.snilai = 1
```

```sql
SELECT cppoin FROM m1_contact_point WHERE cpidkontak = '{drutama_sicustomer}'
```

```sql
SELECT COUNT(siid), sinotransaksi FROM M5_si WHERE siid='{result_4}' AND sistatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(siid) FROM M5_si WHERE sinotransaksi='{notransaksi}'
```

```sql
SELECT COUNT(siid) FROM m5_si WHERE sinotransaksi='{notransaksi}'
```

```sql
SELECT sid.idsidetail as idsidetail, sid.idsi as idsi, sid.idbarang, GROUP_CONCAT(i.bkode SEPARATOR ', ') as kodebarang, ia.iaidbarangpenyusun as idbarangpenyusun, ias.bkode as kodebarangpenyusun, ias.bnama as namabarangpenyusun, ias.btipe as tipebarangpenyusun, SUM(sid.jmlbarang * ia.iajml) as jml, ia.iasatuan as satuan, u1.unilai as nilaisatuan, SUM(sid.jmlbarang * ia.iajml * u1.unilai) as jmlbarang, IFNULL(isw.stok,0) as stokbarang, ias.bsatuan as satuanbarang, sid.gudangtujuan as gudangtujuan, ia.iaurutan as urutan FROM m5_si si JOIN m1_contact c1 ON si.sicustomer = c1.kid JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_item i ON sid.idbarang = i.bid AND i.bassembly = 1 JOIN m1_item_assembly ia ON i.bid = ia.iaidbarang JOIN m1_item ias ON ia.iaidbarangpenyusun = ias.bid AND ias.bjenis <> 'J' AND ias.bjenis <> 'V' JOIN m1_unit u1 ON ia.iasatuan = u1.ukode LEFT JOIN m1_item_stock_warehouse isw ON ia.iaidbarangpenyusun = isw.idbarang AND sid.gudangtujuan = isw.kgudang WHERE sid.idsi = '{result_4}' GROUP BY ia.iaidbarangpenyusun HAVING jmlbarang > stokbarang ORDER BY sid.urutan, ia.iaurutan
```

```sql
INSERT INTO m5_si_material(SELECT 0 as idsimaterial, sid.idsidetail as idsidetail, sid.idsi as idsi, ia.iaidbarangpenyusun as idbarang, ias.bnama as namabarang, ias.btipe as tipebarang, sid.jmlbarang * ia.iajml as jml, ia.iasatuan as satuan, u1.unilai as nilaisatuan, sid.jmlbarang * ia.iajml * u1.unilai as jmlbarang, ias.bsatuan as satuanbarang, sid.matauang as matauang, sid.kurs as kurs, 0 as idhppkhususmasuk, 0 as idhppfifomasuk, (CASE IFNULL(c1.ktingkatjual,1) WHEN 1 THEN ias.bhargajual1 WHEN 2 THEN ias.bhargajual2 WHEN 3 THEN ias.bhargajual3 WHEN 4 THEN ias.bhargajual4 WHEN 5 THEN ias.bhargajual5 ELSE ias.bhargajual1 END) as harga, ias.bhargajual1 as hargapricelist, ias.bhppaverage as hpp, 0 as diskon, 0 as jmldiskon, '' as pajak1, 0 as jmlpajak1, '' as pajak2, 0 as jmlpajak2, sid.cabang as cabang, sid.lokasi as lokasi, sid.gudangasal as gudangasal, sid.gudangtransit as gudangtransit, sid.gudangtujuan as gudangtujuan, ias.brekpersediaan as rekpersediaan, ias.brekhargapokok as rekhargapokok, ias.brekdiskonpembelian as rekdiskonpenjualan, ias.brekpenjualan as rekpenjualan, sid.costcenter as costcenter, sid.divisi as divisi, sid.subdivisi as subdivisi, sid.proyek as proyek, '' as catatan, ia.iaurutan as urutan, 0 as idsqdetail, 0 as idsodetail, 0 as idpidetail, 0 as idpldetail, 0 as iddodetail, 0 as iddrdetail, 0 as jmlrnr, 0 as statusrnr, 0 as jmlsr, 0 as statussr, 0 as jmlrealisasi, 0 as statusrealisasi, 0 as isbonus, 0 as isbonusfrom, 0 as isclose, '' as customtext1, '' as customtext2, '' as customtext3, 0 as customdbl1, 0 as customdbl2, 0 as customdbl3, '1900-01-01' as customdate1, '1900-01-01' as customdate2, '1900-01-01' as customdate3 FROM m5_si si JOIN m1_contact c1 ON si.sicustomer = c1.kid JOIN m5_si_detail sid ON si.siid = sid.idsi JOIN m1_item i ON sid.idbarang = i.bid AND i.bassembly = 1 JOIN m1_item_assembly ia ON i.bid = ia.iaidbarang JOIN m1_item ias ON ia.iaidbarangpenyusun = ias.bid JOIN m1_unit u1 ON ia.iasatuan = u1.ukode WHERE sid.idsi = '{result_4}' ORDER BY sid.urutan, ia.iaurutan)
```

```sql
SELECT vi.vikode, vi.vimatauang, (CASE vi.vimatauang WHEN s.snilai THEN vi.vijml - vi.vijmlbayar ELSE vi.vijmlvalas - vi.vijmlbayarvalas END) as sisa FROM m_12_pos_voucher_in vi JOIN m0_setting s ON s.smodule = 0 AND s.sgrup = 'accounting' AND s.skode = 'MataUangFungsional' WHERE vi.viid = '{dr1_nogiro}' AND (CASE vi.vimatauang WHEN s.snilai THEN vi.vijml - vi.vijmlbayar < '{jmlV}' ELSE vi.vijmlvalas - vi.vijmlbayarvalas < '{jmlVValas}' END)
```

```sql
UPDATE m_12_pos_voucher_in SET vijmlbayar = vijmlbayar + {dr1_jumlah}, vijmlbayarvalas = vijmlbayarvalas + {dr1_jumlahvalas} WHERE viid = '{dr1_nogiro}'
```

```sql
SELECT vi.vikode, vi.vitglexpired FROM m_12_pos_voucher_in vi WHERE vi.vitglexpired < '{AsFormatTanggal_drutama_sitgl}' AND ({ftVoucher.ToString})
```

```sql
UPDATE m_12_pos_voucher_in SET vijmlbayar = vijmlbayar + {dr1_jumlah}, vijmlbayarvalas = vijmlbayarvalas + {dr1_jumlahvalas} WHERE viid = '{dr1_customint1}'
```

```sql
UPDATE m5_so_detail SET jmlrealisasi = (CASE idsodetail {updNilaiSO} ELSE jmlrealisasi END) WHERE {updFilterSO}
```

```sql
SELECT idso FROM m5_so_detail WHERE {updFilterSO} GROUP BY idso
```

```sql
SELECT idso, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m5_so_detail WHERE {ftDetail} GROUP BY idso
```

```sql
UPDATE m5_so SET sostatusrealisasi = (CASE soid {updNilaiSO} ELSE sostatusrealisasi END) WHERE {updFilterSO}
```

```sql
UPDATE m5_pi_detail SET jmlrealisasi = (CASE idpidetail {updNilaiPI} ELSE jmlrealisasi END) WHERE {updFilterPI}
```

```sql
SELECT idpi FROM m5_pi_detail WHERE {updFilterPI} GROUP BY idpi
```

```sql
SELECT idpi, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m5_pi_detail WHERE {ftDetail} GROUP BY idpi
```

```sql
UPDATE m5_pi SET pistatusrealisasi = (CASE piid {updNilaiPI} ELSE pistatusrealisasi END) WHERE {updFilterPI}
```

```sql
UPDATE m5_pl_detail SET jmlrealisasi = (CASE idpldetail {updNilaiPL} ELSE jmlrealisasi END) WHERE {updFilterPL}
```

```sql
SELECT idpl FROM m5_pl_detail WHERE {updFilterPL} GROUP BY idpl
```

```sql
SELECT idpl, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m5_pl_detail WHERE {ftDetail} GROUP BY idpl
```

```sql
UPDATE m5_pl SET plstatusrealisasi = (CASE plid {updNilaiPL} ELSE plstatusrealisasi END) WHERE {updFilterPL}
```

```sql
UPDATE m5_as `as` LEFT JOIN m2_transaction_journal t ON `as`.assumber = t.tsumber AND `as`.asid = t.tidtransaksi AND `as`.asnotransaksi = t.tnotransaksi SET `as`.asjumlahbayar = (CASE `as`.asid {updNilaiAS} ELSE `as`.asjumlahbayar END), `as`.asjumlahbayarvalas = (CASE `as`.asid {updNilaiValasAS} ELSE `as`.asjumlahbayarvalas END), `as`.astgllunas = (CASE `as`.asid {updTglLunasAS} ELSE `as`.astgllunas END) WHERE {updFilterAS}
```

```sql
UPDATE m5_as `as` LEFT JOIN m2_transaction_journal t ON `as`.assumber = t.tsumber AND `as`.asid = t.tidtransaksi AND `as`.asnotransaksi = t.tnotransaksi SET t.tstatuslunas = `as`.asstatusbayar, t.ttgllunas = `as`.astgllunas WHERE {updFilterAS}
```

```sql
UPDATE m5_do_detail SET jmlrealisasi = (CASE iddodetail {updNilaiDO} ELSE jmlrealisasi END) WHERE {updFilterDO}
```

```sql
SELECT iddo FROM m5_do_detail WHERE {updFilterDO} GROUP BY iddo
```

```sql
SELECT iddo, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m5_do_detail WHERE {ftDetail} GROUP BY iddo
```

```sql
UPDATE m5_do SET dostatusrealisasi = (CASE doid {updNilaiDO} ELSE dostatusrealisasi END) WHERE {updFilterDO}
```

```sql
UPDATE m5_dr_detail SET jmlrealisasi = (CASE iddrdetail {updNilaiDR} ELSE jmlrealisasi END) WHERE {updFilterDR}
```

```sql
SELECT iddr FROM m5_dr_detail WHERE {updFilterDR} GROUP BY iddr
```

```sql
SELECT iddr, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m5_dr_detail WHERE {ftDetail} GROUP BY iddr
```

```sql
UPDATE m5_dr SET drstatusrealisasi = (CASE drid {updNilaiDR} ELSE drstatusrealisasi END) WHERE {updFilterDR}
```

```sql
UPDATE m1_no_batch_in SET nbijmlkeluar = (CASE {updNilaiBatch} ELSE nbijmlkeluar END) WHERE {updFilterBatch}
```

```sql
UPDATE m1_no_serial_in SET nsijmlkeluar = (CASE {updNilaiSerial} ELSE nsijmlkeluar END) WHERE {updFilterSerial}
```

```sql
UPDATE m7_asset a SET a.aakumulasibeban = 0, a.anilaibuku = 0, a.aisclose = 1, a.atglclose = '{vTgl}' WHERE a.aid IN({strValue2.ToString})
```

```sql
INSERT INTO m1_item_booking (SELECT idbarang, gudangtujuan, jmlbarang * -1 FROM m5_si_detail JOIN m1_item ON idbarang = bid AND bjenis <> 'J' AND bjenis <> 'V' AND bhpp <> 'I' AND (idsodetail <> 0 AND (iddodetail = 0 AND iddrdetail = 0)) AND idsi = '{result_4}') ON DUPLICATE KEY UPDATE jmlbooking = jmlbooking + VALUES(jmlbooking)
```

```sql
INSERT INTO m1_contact_point(cpidkontak, cppoin) VALUES({drutama_sicustomer}, {Double_Parse_FixDouble_drutama_sipoindidapat_Double_Parse_FixDouble_drutama_sibayarpoin}) ON DUPLICATE KEY UPDATE cppoin = cppoin + VALUES(cppoin)
```

```sql
UPDATE m5_si si JOIN m1_contact c ON si.siid = '{result_4}' AND c.kid = si.sicustomer SET c.ktotalpiutang = c.ktotalpiutang + (si.sitotaltransaksi * si.sikurs)
```

```sql
SELECT sim.idsimaterial, sim.idbarang, sim.namabarang, sim.tipebarang, sim.jml, sim.satuan, sim.jmlbarang, sim.satuanbarang, sim.matauang, sim.kurs, sim.harga, sim.diskon, sim.jmldiskon, sim.idhppkhususmasuk, sim.hpp, sim.gudangasal, sim.gudangtransit, sim.gudangtujuan, sim.catatan, sim.costcenter, sim.divisi, sim.subdivisi, sim.proyek, si.siinputtgl, i.bhpp FROM m5_si_material sim JOIN m5_si si ON sim.idsi = si.siid JOIN m1_item i ON sim.idbarang = i.bid WHERE sim.idsi = '{result_4}'
```

```sql
SELECT bstok FROM m1_item WHERE bid = '{idbarang}'
```

```sql
INSERT INTO m1_item_stock_warehouse (idbarang, kgudang, stok) VALUES ('{idbarang}','{gudang}','-{jmlbarang}') ON DUPLICATE KEY UPDATE stok = stok + VALUES(stok)
```

```sql
UPDATE m1_item SET bstok = '{saldojml}' WHERE bid = '{idbarang}'
```

```sql
SELECT sid.idsidetail, sid.idbarang, sid.namabarang, sid.tipebarang, sid.jml, sid.satuan, sid.jmlbarang, sid.satuanbarang, sid.matauang, sid.kurs, sid.harga, sid.diskon, sid.jmldiskon, sid.idhppkhususmasuk, sid.hpp, sid.gudangasal, sid.gudangtransit, sid.gudangtujuan, sid.catatan, sid.costcenter, sid.divisi, sid.subdivisi, sid.proyek, si.siinputtgl, i.bhpp FROM m5_si_detail sid JOIN m5_si si ON sid.idsi = si.siid JOIN m1_item i ON sid.idbarang = i.bid AND i.bassembly = 1 WHERE sid.idsi = '{result_4}'
```

```sql
INSERT INTO m1_item_stock_warehouse (idbarang, kgudang, stok) VALUES ('{idbarang}','{gudang}','{jmlbarang}') ON DUPLICATE KEY UPDATE stok = stok + VALUES(stok)
```

```sql
SELECT sid.idsidetail, sid.idbarang, sid.namabarang, sid.tipebarang, sid.jml, sid.satuan, sid.jmlbarang, sid.satuanbarang, sid.matauang, sid.kurs, sid.harga, sid.diskon, sid.jmldiskon, sid.idhppkhususmasuk, sid.hpp, sid.gudangasal, sid.gudangtransit, sid.gudangtujuan, sid.catatan, sid.costcenter, sid.divisi, sid.subdivisi, sid.proyek, si.siinputtgl, i.bhpp FROM m5_si_detail sid JOIN m5_si si ON sid.idsi = si.siid JOIN m1_item i ON sid.idbarang = i.bid WHERE sid.idsi = '{result_4}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}'
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Sitgl, Sinotransaksi, Sistatus FROM M5_Si WHERE Siid='{idtransaksi}'
```

```sql
SELECT simatauang, sikurs, sijmluangmuka, siidas, sicustomer, sipoindidapat, sibayarpoin, siuploaded, sicarabayar FROM m5_si WHERE siid = '{idtransaksi}'
```

```sql
INSERT INTO m1_contact_point(cpidkontak, cppoin) VALUES({dr1_sicustomer}, {Double_Parse_FixDouble_dr1_sipoindidapat_Double_Parse_FixDouble_dr1_sibayarpoin}) ON DUPLICATE KEY UPDATE cppoin = cppoin - VALUES(cppoin)
```

```sql
UPDATE m5_si si JOIN m1_contact c ON si.siid = '{idtransaksi}' AND c.kid = si.sicustomer SET c.ktotalpiutang = c.ktotalpiutang - (si.sitotaltransaksi * si.sikurs)
```

```sql
SELECT so.sonotransaksi FROM m5_so so JOIN m5_so_detail sod ON so.soid = sod.idso JOIN m5_si_detail sid ON sod.idsodetail = sid.idsodetail AND (sid.iddodetail = 0 OR sid.iddrdetail = 0) AND sid.idsi = '{idtransaksi}' AND so.sostatus NOT IN(2,3,4)
```

```sql
DELETE FROM m_12_pos_voucher_out WHERE vosumber = '{sumber}' AND voidtransaksi = '{idtransaksi}'
```

```sql
SELECT * FROM m5_si_pay WHERE idsi = '{idtransaksi}' AND carabayar = 6
```

```sql
UPDATE m_12_pos_voucher_in SET vijmlbayar = vijmlbayar - {dr1_jumlah}, vijmlbayarvalas = vijmlbayarvalas - {dr1_jumlahvalas} WHERE viid = '{dr1_nogiro}'
```

```sql
SELECT * FROM m5_si_installment WHERE idsi = '{idtransaksi}' limit 1
```

```sql
UPDATE m_12_pos_voucher_in SET vijmlbayar = vijmlbayar - {dr1_customdbl1}, vijmlbayarvalas = vijmlbayarvalas - {dr1_customdbl1} WHERE viid = '{dr1_customint1}'
```

```sql
SELECT idsidetail, idbarang, tipebarang, namabarang, satuan, nilaisatuan, jmlbarang, idhppkhususmasuk, gudangtujuan, idsodetail, idpidetail, idpldetail, iddodetail, iddrdetail, urutan FROM m5_si_detail WHERE idsi = '{idtransaksi}'
```

```sql
SELECT idsimaterial, idbarang, tipebarang, namabarang, satuan, nilaisatuan, jmlbarang, idhppkhususmasuk, gudangtujuan, idsodetail, idpidetail, idpldetail, iddodetail, iddrdetail, urutan FROM m5_si_material WHERE idsi = '{idtransaksi}'
```

```sql
SELECT * FROM m1_cogs_fifo_out WHERE {filterHppF}
```

```sql
UPDATE m5_as `as` LEFT JOIN m2_transaction_journal t ON `as`.assumber = t.tsumber AND `as`.asid = t.tidtransaksi AND `as`.asnotransaksi = t.tnotransaksi SET `as`.asjumlahbayar = (CASE `as`.asid {updNilaiAS} ELSE `as`.asjumlahbayar END), `as`.asjumlahbayarvalas = (CASE `as`.asid {updNilaiValasAS} ELSE `as`.asjumlahbayarvalas END), `as`.astgllunas = '{tglLunas}' WHERE {updFilterAS}
```

```sql
SELECT nboidbatchin, nbogudang, nboidbarang, nbokode, nbojmlkeluar FROM m1_no_batch_out WHERE nbosumber = '{sumber}' AND nboidtransaksi = '{idtransaksi}'
```

```sql
DELETE FROM m1_no_batch_out WHERE nbosumber = '{sumber}' AND nboidtransaksi = '{idtransaksi}'
```

```sql
SELECT nsoidserialin, nsogudang, nsoidbarang, nsokode, nsojmlkeluar FROM m1_no_serial_out WHERE nsosumber = '{sumber}' AND nsoidtransaksi = '{idtransaksi}'
```

```sql
DELETE FROM m1_no_serial_out WHERE nsosumber = '{sumber}' AND nsoidtransaksi = '{idtransaksi}'
```

```sql
SELECT atasetid FROM m7_asset_transaction WHERE atsumber = '{sumber}' AND atidutama = '{idtransaksi}'
```

```sql
UPDATE m7_asset a SET a.aakumulasibeban = a.aakumulasibebansebelumnya, a.anilaibuku = a.anilaibukusebelumnya, a.aisclose = 0, a.atglclose = '1900-01-01' WHERE a.aid IN({strValue2.ToString})
```

```sql
DELETE FROM m1_cogs_special_out WHERE {delFilterHppI}
```

```sql
UPDATE m1_cogs_special_in SET jmlkeluar = (CASE idhppikm {updNilaiHppI} ELSE jmlkeluar END) WHERE {updFilterHppI}
```

```sql
DELETE csi FROM m1_cogs_special_in csi JOIN m5_si_detail sid ON csi.sumber = 'SI' AND csi.idtransaksi = sid.idsidetail AND csi.idbarang = sid.idbarang WHERE sid.idsi = '{idtransaksi}'
```

```sql
DELETE FROM m1_cogs_fifo_out WHERE {delFilterHppF}
```

```sql
UPDATE m1_cogs_fifo_in SET cfijmlkeluar = (CASE cfiid {updNilaiHppF} ELSE cfijmlkeluar END) WHERE {updFilterHppF}
```

```sql
DELETE cfi FROM m1_cogs_fifo_in cfi JOIN m5_si_detail sid ON cfi.cfisumber = 'SI' AND cfi.cfiidtransaksi = sid.idsidetail AND cfi.cfiidbarang = sid.idbarang WHERE sid.idsi = '{idtransaksi}'
```

```sql
INSERT INTO m1_item_booking (SELECT idbarang, gudangtujuan, jmlbarang FROM m5_si_detail JOIN m1_item ON idbarang = bid AND bjenis <> 'J' AND bjenis <> 'V' AND bhpp <> 'I' AND (idsodetail <> 0 AND (iddodetail = 0 AND iddrdetail = 0)) AND idsi = '{idtransaksi}') ON DUPLICATE KEY UPDATE jmlbooking = jmlbooking + VALUES(jmlbooking)
```

```sql
INSERT INTO m1_item_stock_warehouse ( SELECT * FROM( SELECT sid.idbarang, sid.gudangtujuan, sid.jmlbarang FROM m5_si_detail sid JOIN m1_item i ON sid.idbarang = i.bid AND i.bassembly <> 1 WHERE sid.idsi = '{idtransaksi}' UNION ALL SELECT sim.idbarang, sim.gudangtujuan, sim.jmlbarang FROM m5_si_material sim WHERE sim.idsi = '{idtransaksi}' ) as stok ) ON DUPLICATE KEY UPDATE stok = stok + VALUES(stok)
```

```sql
SELECT stok.idbarang FROM ( SELECT sid.idbarang FROM m5_si_detail sid JOIN m1_item i ON i.bid = sid.idbarang AND i.bassembly <> 1 WHERE sid.idsi = '{idtransaksi}' UNION ALL SELECT sim.idbarang FROM m5_si_material sim WHERE sim.idsi = '{idtransaksi}' ) as stok GROUP BY idbarang
```

```sql
UPDATE m1_item SET bstok = IFNULL((SELECT SUM(isw.stok) FROM m1_item_stock_warehouse isw WHERE isw.idbarang = '{dr_idbarang}' GROUP BY isw.idbarang),0) WHERE bid = '{dr_idbarang}'
```

```sql
DELETE FROM m1_item_transaction WHERE sumber = '{sumber}' AND idutama = '{idtransaksi}'
```

```sql
UPDATE m1_item i
```

```sql
DELETE FROM M2_Transaction_Journal WHERE tsumber = '{sumber}' AND tidtransaksi = '{idtransaksi}' AND tnotransaksi = '{notransaksi}'
```

```sql
UPDATE M5_Si SET Sistatus = {nilaiStatus}, Simodifikasiuser='{userid}', Simodifikasitgl = NOW(), Siposting = 0, Sipostingtgl = '1971-01-01 00:00:00', Sijmlrevisi = Sijmlrevisi + 1 WHERE Siid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Siid, Sinotransaksi FROM M5_Si WHERE Siid='{idtransaksi}'
```

```sql
SELECT sicabang, silokasi, sisumber, siautonotransaksi, sinotransaksi, sitgl, simatauang
```

```sql
DELETE FROM M5_Si_Pay WHERE idsi ='{idtransaksi}'
```

```sql
DELETE FROM M5_Si_Detail WHERE idsi ='{idtransaksi}'
```

```sql
DELETE FROM M5_Si WHERE siid ='{idtransaksi}'
```

```sql
SELECT sip.idsicarabayar AS idsicarabayar, sip.idsi AS idsi, sip.carabayar AS carabayar, sip.matauang AS matauang, sip.kurs AS kurs, sip.jumlah AS jumlah, sip.jumlahvalas AS jumlahvalas, sip.nogiro AS nogiro, sip.tgljt AS tgljt, sip.bank AS bank, sip.noacbank AS noacbank, sip.rekbank AS rekbank, sip.rekgiro AS rekgiro, sip.catatan AS catatan, sip.urutan AS urutan, sip.isclose AS isclose, pm.nama AS carabayarnama, b.bnama AS banknama, coa1.cnama AS rekbanknama, coa2.cnama AS rekgironama FROM m5_si_pay AS sip LEFT JOIN m0_payment_method AS pm ON sip.carabayar = pm.kode LEFT JOIN m1_bank AS b ON sip.bank = b.bkode LEFT JOIN m1_coa AS coa1 ON sip.rekbank = coa1.cnomor LEFT JOIN m1_coa AS coa2 ON sip.rekgiro = coa2.cnomor
```

```sql
SELECT sip.idsiinstallment AS idsiinstallment, sip.idsi AS idsi, sip.matauang AS matauang, sip.kurs AS kurs, sip.jumlah AS jumlah, sip.jumlahvalas AS jumlahvalas, sip.tgljt AS tgljt, sip.rekpiutang AS rekpiutang, sip.catatan AS catatan, sip.urutan AS urutan, sip.isclose AS isclose, sip.angsuranke AS angsuranke, coa1.cnama AS rekpiutangnama, sip.customtext1, sip.customtext2, sip.customtext3, sip.customtext4, sip.customtext5, sip.customint1, sip.customint2, sip.customint3, sip.customint4, sip.customint5, sip.customdbl1, sip.customdbl2, sip.customdbl3, sip.customdbl4, sip.customdbl5, sip.customdate1, sip.customdate2, sip.customdate3, sip.customdate4, sip.customdate5 FROM m5_si_installment AS sip LEFT JOIN m1_coa AS coa1 ON sip.rekpiutang = coa1.cnomor
```

```sql
SELECT si.* FROM m5_si si JOIN m5_si_detail sid ON si.siid = sid.idsi AND si.siuploaded = 0 AND si.sistatus = 2
```

```sql
SELECT sid.* FROM m5_si si JOIN m5_si_detail sid ON si.siid = sid.idsi AND si.siuploaded = 0 AND si.sistatus = 2
```

```sql
SELECT nbt.* FROM m5_si si JOIN m1_no_batch_transaction nbt ON si.sisumber = nbt.nbtsumber AND si.siid = nbt.nbtidtransaksi AND si.siuploaded = 0 AND si.sistatus = 2
```

```sql
SELECT nst.* FROM m5_si si JOIN m1_no_serial_transaction nst ON si.sisumber = nst.nstsumber AND si.siid = nst.nstidtransaksi AND si.siuploaded = 0 AND si.sistatus = 2
```

```sql
SELECT sip.* FROM m5_si si JOIN m5_si_pay sip ON si.siid = sip.idsi AND si.siuploaded = 0 AND si.sistatus = 2
```

```sql
SELECT siid FROM m5_si
```

```sql
UPDATE m5_si SET siuploaded = 1 WHERE {strValue2.ToString}
```

```sql
SELECT bid, bkode FROM m1_item WHERE (bjenis <> 'J') AND (bjenis <> 'V') AND (bhpp = 'I') AND ({ftBarang})
```

```sql
SELECT csi.idhppikm, csi.idbarang, csi.sisa, i.bkode FROM m1_cogs_special_in csi JOIN m1_item i ON csi.idbarang = i.bid WHERE {ftHppI}
```

```sql
SELECT bid, bkode FROM m1_item WHERE (bjenis <> 'J') AND (bjenis <> 'V') AND (bhpp = 'F') AND ({ftBarang})
```

```sql
SELECT bkode, cfiidbarang, SUM(cfisisa) as cfitotalsisa FROM m1_cogs_fifo_in JOIN m1_item ON cfiidbarang = bid WHERE {ftHppF} GROUP BY cfiidbarang HAVING {havingHppF}
```

```sql
SELECT so.sonotransaksi as notransaksi, (CASE so.sohargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_so_detail sod JOIN m5_so so ON sod.idso = so.soid WHERE {ftSO} GROUP BY so.sohargatermasukpajak
```

```sql
SELECT i.bkode, sod.idsodetail, so.sonotransaksi as notransaksi, (CASE so.sohargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_so_detail sod JOIN m5_so so ON sod.idso = so.soid JOIN m1_item i ON sod.idbarang = i.bid WHERE ({ftSO}) AND so.sohargatermasukpajak <> {termasukPajak} ORDER BY sod.urutan
```

```sql
SELECT sod.idsodetail, (sod.jmlbarang - sod.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m5_so_detail AS sod INNER JOIN m1_item AS i ON sod.idbarang = i.bid WHERE {ftOutstandingSO}
```

```sql
SELECT pi.pinotransaksi as notransaksi, (CASE pi.pihargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_pi_detail pid JOIN m5_pi pi ON pid.idpi = pi.piid WHERE {ftPI} GROUP BY pi.pihargatermasukpajak
```

```sql
SELECT i.bkode, pid.idpidetail, pi.pinotransaksi as notransaksi, (CASE pi.pihargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_pi_detail pid JOIN m5_pi pi ON pid.idpi = pi.piid JOIN m1_item i ON pid.idbarang = i.bid WHERE ({ftPI}) AND pi.pihargatermasukpajak <> {termasukPajak} ORDER BY pid.urutan
```

```sql
SELECT pid.idpidetail, (pid.jmlbarang - pid.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m5_pi_detail AS pid INNER JOIN m1_item AS i ON pid.idbarang = i.bid WHERE {ftOutstandingPI}
```

```sql
SELECT pl.plnotransaksi as notransaksi, (CASE pl.plhargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_pl_detail pld JOIN m5_pl pl ON pld.idpl = pl.plid WHERE {ftPL} GROUP BY pl.plhargatermasukpajak
```

```sql
SELECT i.bkode, pld.idpldetail, pl.plnotransaksi as notransaksi, (CASE pl.plhargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_pl_detail pld JOIN m5_pl pl ON pld.idpl = pl.plid JOIN m1_item i ON pld.idbarang = i.bid WHERE ({ftPL}) AND pl.plhargatermasukpajak <> {termasukPajak} ORDER BY pld.urutan
```

```sql
SELECT pld.idpldetail, (pld.jmlbarang - pld.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m5_pl_detail AS pld INNER JOIN m1_item AS i ON pld.idbarang = i.bid WHERE {ftOutstandingPL}
```

```sql
SELECT `as`.asid, `as`.assumber, `as`.asnotransaksi, `as`.asmatauang, (CASE `as`.asmatauang WHEN s.snilai THEN `as`.asjumlah - `as`.asjumlahbayar ELSE `as`.asjumlahvalas - `as`.asjumlahbayarvalas END) assisatransaksi FROM m5_as `as` LEFT JOIN m0_setting s ON s.smodule =0 AND s.sgrup='accounting' AND s.skode = 'MataUangFungsional' WHERE {ftOutstandingAS}
```

```sql
SELECT `do`.donotransaksi as notransaksi, (CASE `do`.dohargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_do_detail dod JOIN m5_do `do` ON dod.iddo = `do`.doid WHERE {ftDO} GROUP BY `do`.dohargatermasukpajak
```

```sql
SELECT i.bkode, dod.iddodetail, `do`.donotransaksi as notransaksi, (CASE `do`.dohargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_do_detail dod JOIN m5_do `do` ON dod.iddo = `do`.doid JOIN m1_item i ON dod.idbarang = i.bid WHERE ({ftDO}) AND `do`.dohargatermasukpajak <> {termasukPajak} ORDER BY dod.urutan
```

```sql
SELECT dod.iddodetail, (dod.jmlbarang - dod.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m5_do_detail AS dod INNER JOIN m1_item AS i ON dod.idbarang = i.bid WHERE {ftOutstandingDO}
```

```sql
SELECT dr.drnotransaksi as notransaksi, (CASE dr.drhargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_dr_detail drd JOIN m5_dr dr ON drd.iddr = dr.drid WHERE {ftDR} GROUP BY dr.drhargatermasukpajak
```

```sql
SELECT i.bkode, drd.iddrdetail, dr.drnotransaksi as notransaksi, (CASE dr.drhargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_dr_detail drd JOIN m5_dr dr ON drd.iddr = dr.drid JOIN m1_item i ON drd.idbarang = i.bid WHERE ({ftDR}) AND dr.drhargatermasukpajak <> {termasukPajak} ORDER BY drd.urutan
```

```sql
SELECT drd.iddrdetail, (drd.jmlbarang - drd.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m5_dr_detail AS drd INNER JOIN m1_item AS i ON drd.idbarang = i.bid WHERE {ftOutstandingDR}
```

```sql
SELECT isw.idbarang, isw.kgudang, isw.stok, i.bkode, (CASE {ftStokCase} ELSE 0 END) as stokjual FROM m1_item_stock_warehouse isw JOIN m1_item i ON isw.idbarang = i.bid AND i.bjenis <> 'J' AND i.bjenis <> 'V' AND i.bassembly <> 1 WHERE {ftStok}
```

```sql
SELECT isw.idbarang, isw.kgudang, isw.stok - IFNULL(isb.jmlbooking,0) as stok, i.bkode, (CASE {ftStokAvailableCase} ELSE 0 END) as stokjual FROM m1_item_stock_warehouse isw JOIN m1_item i ON isw.idbarang = i.bid AND i.bjenis <> 'J' AND i.bjenis <> 'V' AND i.bassembly <> 1 LEFT JOIN m1_warehouse w ON isw.kgudang = w.wkode LEFT JOIN m1_item_booking isb ON isw.idbarang = isb.idbarang AND w.wbookingstok = 1 WHERE {ftStokAvailable}
```

```sql
SELECT nbi.nbiidbarang, nbi.nbikode, nbi.nbigudang, nbi.nbijmlsisa, i.bkode FROM m1_no_batch_in nbi JOIN m1_item i ON nbi.nbiidbarang = i.bid WHERE {ftBatch}
```

```sql
SELECT nsi.nsiidbarang, nsi.nsikode, nsi.nsigudang, nsi.nsijmlsisa, i.bkode FROM m1_no_serial_in nsi JOIN m1_item i ON nsi.nsiidbarang = i.bid WHERE {ftSerial}
```

```sql
INSERT INTO m2r_stok_gagal_upload (idbarang, gudang, stoktersedia, stokjual) VALUES {strInsertStokKurang}
```

```sql
SELECT simatauang, sikurs, sijmluangmuka, siidas, sicustomer, sipoindidapat, sibayarpoin, siuploaded FROM m5_si WHERE siid = '{idtransaksi}'
```

```sql
SELECT sicabang, silokasi, sisumber, siautonotransaksi, sinotransaksi, sitgl
```

```sql
UPDATE m0_setting s JOIN m5_si si JOIN m1_contact c ON si.siid = '{result_4}' AND c.kid = si.sicustomer SET c.ktotalpiutang = c.ktotalpiutang + (si.sitotaltransaksi * si.sikurs)
```

```sql
SELECT simatauang, sikurs, sijmluangmuka, siidas, sicarabayar FROM m5_si WHERE siid = '{idtransaksi}'
```

```sql
DELETE sgu FROM m0_user u JOIN m2r_stok_gagal_upload sgu ON u.ugudang = sgu.gudang WHERE u.userid = '{userid}'
```

```sql
DELETE sif, sidf FROM m0_user u JOIN m5_si_failed sif ON u.ugudang = sif.sigudang JOIN m5_si_detail_failed sidf ON sif.siid = sidf.idsi WHERE u.userid = '{userid}'
```

```sql
DELETE sgu FROM m2r_stok_gagal_upload sgu {IIf_Len_ftgudangSGU_0_WHERE}{ftgudangSGU}
```

```sql
DELETE sif, sidf FROM m5_si_failed sif JOIN m5_si_detail_failed sidf ON sif.siid = sidf.idsi {IIf_Len_ftgudangSI_0_WHERE}{ftgudangSI}
```

```sql
UPDATE `m5_si` SET sinofakturpajak = CASE siid
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_si_history.vb`

```sql
INSERT INTO m5_si_history(SELECT 0, si.* FROM m5_si si WHERE si.siid = '{idtransaksi}')
```

```sql
SELECT siidhistory FROM m5_si_history WHERE siid = '{idtransaksi}' ORDER BY simodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m5_si_detail_history (SELECT 0, '{result_4}', si.* FROM m5_si_detail si WHERE si.idsi = '{idtransaksi}' )
```

```sql
INSERT INTO m5_si_pay_history (SELECT 0, '{result_4}', si.* FROM m5_si_pay si WHERE si.idsi = '{idtransaksi}' )
```

```sql
INSERT INTO m5_si_material_history (SELECT 0, '{result_4}', si.* FROM m5_si_material si WHERE si.idsi = '{idtransaksi}' )
```

```sql
INSERT INTO m1_no_batch_transaction_history(SELECT 0, '{result_4}', nb.* FROM m1_no_batch_transaction nb WHERE nb.nbtidtransaksi = '{idtransaksi}' and nb.nbtsumber = 'SI')
```

```sql
INSERT INTO m1_no_serial_transaction_history(SELECT 0, '{result_4}', ns.* FROM m1_no_serial_transaction ns WHERE ns.nstidtransaksi = '{idtransaksi}' and ns.nstsumber = 'SI')
```

```sql
INSERT INTO m7_asset_transaction_history(SELECT 0, '{result_4}', atr.* FROM m7_asset_transaction atr WHERE atr.atidutama = '{idtransaksi}' and atr.atsumber = 'SI')
```

```sql
SELECT sip.idhistorycarabayar, sip.idhistory, sip.idsicarabayar AS idsicarabayar, sip.idsi AS idsi, sip.carabayar AS carabayar, sip.matauang AS matauang, sip.kurs AS kurs, sip.jumlah AS jumlah, sip.jumlahvalas AS jumlahvalas, sip.nogiro AS nogiro, sip.tgljt AS tgljt, sip.bank AS bank, sip.noacbank AS noacbank, sip.rekbank AS rekbank, sip.rekgiro AS rekgiro, sip.catatan AS catatan, sip.urutan AS urutan, sip.isclose AS isclose, pm.nama AS carabayarnama, b.bnama AS banknama, coa1.cnama AS rekbanknama, coa2.cnama AS rekgironama FROM m5_si_pay_history AS sip LEFT JOIN m0_payment_method AS pm ON sip.carabayar = pm.kode LEFT JOIN m1_bank AS b ON sip.bank = b.bkode LEFT JOIN m1_coa AS coa1 ON sip.rekbank = coa1.cnomor LEFT JOIN m1_coa AS coa2 ON sip.rekgiro = coa2.cnomor
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_sie.vb`

```sql
SELECT COUNT(sieid), sienotransaksi FROM M5_sie WHERE sieid='{result_4}' AND siestatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(sieid) FROM M5_sie WHERE sienotransaksi='{notransaksi}'
```

```sql
UPDATE M5_sie sie JOIN M5_sie_detail sied ON sie.sieid = sied.idsie JOIN M5_Si si ON sied.sumber = si.sisumber AND sied.idtransaksi = si.siid LEFT JOIN m0_setting s ON s.smodule = 5 AND s.sgrup = 'tukarfaktur' AND s.skode = 'UpdateTglJatuhTempoSI' AND s.snilai = 1 LEFT JOIN m1_terms tr ON si.sitermin = tr.trkode SET si.sistatussie = 1, si.sitglsie = sie.sietgl, si.sitgljatuhtempo = (CASE IFNULL(s.snilai,0) WHEN 1 THEN DATE_ADD(sie.sietgl,INTERVAL IFNULL(tr.trharijatuhtempo,0) DAY) ELSE si.sitgljatuhtempo END) WHERE sie.sieid = '{result_4}'
```

```sql
UPDATE M5_sie sie JOIN M5_sie_detail sied ON sie.sieid = sied.idsie JOIN M5_Sr sr ON sied.sumber = sr.srsumber AND sied.idtransaksi = sr.srid LEFT JOIN m0_setting s ON s.smodule = 5 AND s.sgrup = 'tukarfaktur' AND s.skode = 'UpdateTglJatuhTempoSR' AND s.snilai = 1 LEFT JOIN m1_terms tr ON sr.srtermin = tr.trkode SET sr.srstatussie = 1, sr.srtglsie = sie.sietgl, sr.srtgljatuhtempo = (CASE IFNULL(s.snilai,0) WHEN 1 THEN DATE_ADD(sie.sietgl,INTERVAL IFNULL(tr.trharijatuhtempo,0) DAY) ELSE sr.srtgljatuhtempo END) WHERE sie.sieid = '{result_4}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}'
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Sietgl, sienotransaksi, siestatus FROM M5_Sie WHERE Sieid='{idtransaksi}'
```

```sql
UPDATE M5_sie sie JOIN M5_sie_detail sied ON sie.sieid = sied.idsie JOIN M5_Si si ON sied.sumber = si.sisumber AND sied.idtransaksi = si.siid LEFT JOIN m0_setting s ON s.smodule = 5 AND s.sgrup = 'tukarfaktur' AND s.skode = 'UpdateTglJatuhTempoSI' AND s.snilai = 1 LEFT JOIN m1_terms tr ON si.sitermin = tr.trkode SET si.sistatussie = 0, si.sitglsie = '1900-01-01', si.sitgljatuhtempo = (CASE IFNULL(s.snilai,0) WHEN 1 THEN '2100-12-31' ELSE si.sitgljatuhtempo END) WHERE sie.sieid = '{idtransaksi}'
```

```sql
UPDATE M5_sie sie JOIN M5_sie_detail sied ON sie.sieid = sied.idsie JOIN M5_Sr sr ON sied.sumber = sr.srsumber AND sied.idtransaksi = sr.srid LEFT JOIN m0_setting s ON s.smodule = 5 AND s.sgrup = 'tukarfaktur' AND s.skode = 'UpdateTglJatuhTempoSR' AND s.snilai = 1 LEFT JOIN m1_terms tr ON sr.srtermin = tr.trkode SET sr.srstatussie = 0, sr.srtglsie = '1900-01-01', sr.srtgljatuhtempo = (CASE IFNULL(s.snilai,0) WHEN 1 THEN '2100-12-31' ELSE sr.srtgljatuhtempo END) WHERE sie.sieid = '{idtransaksi}'
```

```sql
UPDATE M5_Sie SET Siestatus = {nilaiStatus}, Siemodifikasiuser='{userid}', Siemodifikasitgl = NOW(), Sieposting = 0, Siepostingtgl = '1971-01-01 00:00:00', Siejmlrevisi = Siejmlrevisi + 1 WHERE Sieid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Sieid, Sienotransaksi FROM M5_Sie WHERE Sieid='{idtransaksi}'
```

```sql
SELECT siecabang, sielokasi, siesumber, sieautonotransaksi, sienotransaksi, sietgl
```

```sql
DELETE FROM M5_sie_Detail WHERE idsie = '{idtransaksi}'
```

```sql
DELETE FROM M5_sie WHERE sieid = '{idtransaksi}'
```

```sql
SELECT sie.sieid, sie.sienotransaksi, si.sisumber as sumber, si.siid as id, si.sinotransaksi as notransaksi
```

```sql
SELECT sie.sieid, sie.sienotransaksi, sr.srsumber as sumber, sr.srid as id, sr.srnotransaksi as notransaksi
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_sie_history.vb`

```sql
INSERT INTO M5_Sie_history(SELECT 0, sie.* FROM M5_Sie sie WHERE sie.sieid = '{idtransaksi}')
```

```sql
SELECT sieidhistory FROM M5_sie_history WHERE sieid = '{idtransaksi}' ORDER BY siemodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO M5_sie_detail_history (SELECT 0, '{result_4}', sie.* FROM M5_sie_detail sie WHERE sie.idsie = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_so.vb`

```sql
SELECT soid, sonotransaksi FROM m5_so WHERE sonoref = '{Filter}'
```

```sql
SELECT snilai FROM m0_setting WHERE (smodule='0') AND (sgrup='accounting') AND (skode='MataUangFungsional')
```

```sql
SELECT rc.rcmoduleid, rc.rcidpc, rc.rcrole, rc.rcakses FROM m0_permissions_custom pc JOIN m0_role_custom rc ON pc.pcmodule = rc.rcmoduleid AND pc.pcid = rc.rcidpc AND pc.pcmodule = 5 AND pc.pcid = 4 JOIN m0_user_role ur ON rc.rcrole = ur.role AND ur.userid = '{userid}' ORDER BY rc.rcakses DESC LIMIT 1
```

```sql
SELECT c.kbataspiutang, c.ktotalpiutang FROM m0_setting s JOIN m1_contact c ON c.kid = '{drutama_socustomer}' AND s.smodule = 0 AND s.sgrup = 'options' AND s.skode = 'ValidasiPlafonPiutangSO' AND s.snilai = 1
```

```sql
SELECT COUNT(soid), sonotransaksi FROM M5_so WHERE soid='{result_4}' AND sostatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(soid) FROM m5_so WHERE sonotransaksi='{notransaksi}'
```

```sql
SELECT bid, bkode, bjenis FROM m1_item WHERE ({ftBarang})
```

```sql
UPDATE m5_sq_detail SET jmlrealisasi = (CASE idsqdetail {updNilai} ELSE jmlrealisasi END) WHERE {updFilter}
```

```sql
SELECT idsq FROM m5_sq_detail WHERE {updFilter} GROUP BY idsq
```

```sql
SELECT idsq, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m5_sq_detail WHERE {ftDetail} GROUP BY idsq
```

```sql
UPDATE m5_sq SET sqstatusrealisasi = (CASE sqid {updNilai} ELSE sqstatusrealisasi END) WHERE {updFilter}
```

```sql
UPDATE m5_so_detail SET jmlrealisasi = (CASE idsodetail {updNilaiSO} ELSE jmlrealisasi END) WHERE {updFilterSO}
```

```sql
SELECT idso FROM m5_so_detail WHERE {updFilterSO} GROUP BY idso
```

```sql
SELECT idso, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m5_so_detail WHERE {ftDetail} GROUP BY idso
```

```sql
UPDATE m5_so SET sostatusrealisasi = (CASE soid {updNilaiSO} ELSE sostatusrealisasi END) WHERE {updFilterSO}
```

```sql
INSERT INTO m1_item_booking (SELECT idbarang, gudang, jmlbarang FROM m5_so_detail JOIN m1_item ON idbarang = bid AND bjenis <> 'J' AND bhpp <> 'I' AND idso = '{result_4}') ON DUPLICATE KEY UPDATE jmlbooking = jmlbooking + VALUES(jmlbooking)
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}'
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Sotgl, Sonotransaksi, Sostatus FROM M5_So WHERE Soid='{idtransaksi}'
```

```sql
SELECT idbarang, tipebarang, namabarang, satuan, nilaisatuan, jmlbarang, gudang, idsqdetail, urutan, customdbl3 FROM m5_so_detail WHERE idso = '{idtransaksi}'
```

```sql
INSERT INTO m1_item_booking (SELECT idbarang, gudang, jmlbarang * -1 FROM m5_so_detail JOIN m1_item ON idbarang = bid AND bjenis <> 'J' AND bhpp <> 'I' AND idso = '{idtransaksi}') ON DUPLICATE KEY UPDATE jmlbooking = jmlbooking + VALUES(jmlbooking)
```

```sql
UPDATE m1_item_booking ib
```

```sql
UPDATE M5_So SET Sostatus = {nilaiStatus}, Somodifikasiuser='{userid}', Somodifikasitgl = NOW(), Soposting = 0, Sopostingtgl = '1971-01-01 00:00:00', Sojmlrevisi = Sojmlrevisi + 1 WHERE Soid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Soid, Sonotransaksi FROM M5_So WHERE Soid='{idtransaksi}'
```

```sql
SELECT socabang, solokasi, sosumber, soautonotransaksi, sonotransaksi, sotgl
```

```sql
DELETE FROM M5_So_Detail WHERE idso = '{idtransaksi}'
```

```sql
DELETE FROM M5_So WHERE soid = '{idtransaksi}'
```

```sql
SELECT so.soid AS soid, so.sonotransaksi AS sonotransaksi, sq.sqsumber AS sumber, sq.sqid AS idterkait, sq.sqnotransaksi AS noterkait, sq.sqtgl AS tglterkait, sq.sqinputtgl AS inputtglterkait, sq.sqmodifikasitgl AS modifikasitglterkait, 0 as jenisterkait FROM m5_sq_detail sqd JOIN m5_sq sq ON sqd.idsq = sqid JOIN m5_so_detail sod ON sqd.idsqdetail = sod.idsqdetail JOIN m5_so so ON sod.idso = so.soid {filter1} GROUP BY sq.sqid, so.soid
```

```sql
SELECT sq.sqnotransaksi as notransaksi, (CASE sq.sqhargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_sq_detail sqd JOIN m5_sq sq ON sqd.idsq = sq.sqid WHERE {ftSQ} GROUP BY sq.sqhargatermasukpajak
```

```sql
SELECT i.bkode, sqd.idsqdetail, sq.sqnotransaksi as notransaksi, (CASE sq.sqhargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_sq_detail sqd JOIN m5_sq sq ON sqd.idsq = sq.sqid JOIN m1_item i ON sqd.idbarang = i.bid WHERE ({ftSQ}) AND sq.sqhargatermasukpajak <> {termasukPajak} ORDER BY sqd.urutan
```

```sql
SELECT so.sonotransaksi as notransaksi, (CASE so.sohargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_so_detail sod JOIN m5_so so ON sod.idso = so.soid WHERE {ftSQ} GROUP BY so.sohargatermasukpajak
```

```sql
SELECT i.bkode, sod.idsodetail, so.sonotransaksi as notransaksi, (CASE so.sohargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_so_detail sod JOIN m5_so so ON sod.idso = so.soid JOIN m1_item i ON sod.idbarang = i.bid WHERE ({ftSO}) AND so.sohargatermasukpajak <> {termasukPajak} ORDER BY sod.urutan
```

```sql
SELECT idbarang, tipebarang, namabarang, satuan, nilaisatuan, jmlbarang, gudang, idsqdetail, urutan FROM m5_so_detail WHERE idso = '{idtransaksi}'
```

```sql
SELECT soid, sonotransaksi, sod.customtext3 FROM m5_so so JOIN m5_so_detail sod ON so.soid = sod.idso AND sod.customtext3 IN({Filter}) GROUP BY so.soid
```

```sql
SELECT GROUP_CONCAT(DISTINCT CONCAT(sonoref, ' (' , sonotransaksi, ')') SEPARATOR ', ') as errmessage FROM m5_so WHERE sonoref IN ({strValNoref})
```

```sql
SELECT kid, kkode, ksalesman, kkontakperson, k1alamat1, k2alamat1, kpkp, kterminjual, kmatauang FROM m1_contact WHERE kkategori = 'C'
```

```sql
SELECT kid, kkode FROM m1_contact WHERE kkategori = 'M'
```

```sql
SELECT ekode FROM m1_expedition
```

```sql
SELECT trkode, trharijatuhtempo from m1_terms
```

```sql
SELECT ckode, ckurs from m1_currency
```

```sql
SELECT bid, bkode, bnama, bnamaalias1, btipe, bkp, bsatuan, bsatuandefault from m1_item
```

```sql
SELECT ukode, unilai from m1_unit
```

```sql
SELECT tkode, tnilai from m1_tax
```

```sql
SELECT cckode from m1_cost_center
```

```sql
SELECT dkode from m1_division
```

```sql
SELECT sdkode from m1_subdivision
```

```sql
SELECT pkode from m1_project
```

```sql
SELECT smodule, sgrup, skode, snilai FROM m0_setting WHERE (smodule = '0' AND sgrup = 'pajak' AND skode = 'PajakKode')
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_so_history.vb`

```sql
INSERT INTO m5_so_history(SELECT 0, so.* FROM m5_so so WHERE so.soid = '{idtransaksi}')
```

```sql
SELECT soidhistory FROM m5_so_history WHERE soid = '{idtransaksi}' ORDER BY somodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m5_so_detail_history (SELECT 0, '{result_4}', so.* FROM m5_so_detail so WHERE so.idso = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_spa.vb`

```sql
SELECT COUNT(spaid), spanotransaksi FROM M5_Spa WHERE spaid='{result_4}' AND spastatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(spaid) FROM M5_Spa WHERE spanotransaksi='{notransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}'
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT spatgl, spanotransaksi, spastatus FROM M5_Spa WHERE spaid='{idtransaksi}'
```

```sql
UPDATE M5_Spa SET spastatus = {nilaiStatus}, spamodifikasiuser='{userid}', spamodifikasitgl = NOW(), spaposting = 0, spapostingtgl = '1971-01-01 00:00:00', spajmlrevisi = spajmlrevisi + 1 WHERE spaid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT spaid, spanotransaksi FROM M5_Spa WHERE spaid='{idtransaksi}'
```

```sql
SELECT spacabang, spalokasi, spasumber, spaautonotransaksi, spanotransaksi, spatgl
```

```sql
DELETE FROM M5_Spa_Detail WHERE idspa='{idtransaksi}'
```

```sql
DELETE FROM M5_Spa WHERE spaid='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_spa_history.vb`

```sql
INSERT INTO M5_Spa_history(SELECT 0, spa.* FROM M5_Spa spa WHERE spa.spaid = '{idtransaksi}')
```

```sql
SELECT spaidhistory FROM M5_Spa_history WHERE spaid = '{idtransaksi}' ORDER BY spamodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO M5_Spa_detail_history (SELECT 0, '{result_4}', spa.* FROM M5_Spa_detail spa WHERE spa.idspa = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_sq.vb`

```sql
SELECT COUNT(sqid), sqnotransaksi FROM M5_sq WHERE sqid='{result_4}' AND sqstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(sqid) FROM m5_sq WHERE sqnotransaksi='{notransaksi}'
```

```sql
UPDATE m4_pr_detail SET jmlsq = (CASE idprdetail {updNilai} ELSE jmlsq END) WHERE {updFilter}
```

```sql
SELECT idpr FROM m4_pr_detail WHERE {updFilter} GROUP BY idpr
```

```sql
SELECT idpr, SUM(jmlbarang) as jmlbarang, SUM(jmlsq) as jmlsq FROM m4_pr_detail WHERE {ftDetail} GROUP BY idpr
```

```sql
UPDATE m4_pr SET prstatussq = (CASE prid {updNilai} ELSE prstatussq END) WHERE {updFilter}
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}'
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Sqtgl, Sqnotransaksi, Sqstatus FROM M5_Sq WHERE Sqid='{idtransaksi}'
```

```sql
SELECT idbarang, tipebarang, namabarang, satuan, nilaisatuan, jmlbarang, idprdetail, urutan FROM m5_sq_detail WHERE idsq = '{idtransaksi}'
```

```sql
UPDATE M5_Sq SET Sqstatus = {nilaiStatus}, Sqmodifikasiuser='{userid}', Sqmodifikasitgl = NOW(), Sqposting = 0, Sqpostingtgl = '1971-01-01 00:00:00', Sqjmlrevisi = Sqjmlrevisi + 1 WHERE Sqid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Sqid, Sqnotransaksi FROM M5_Sq WHERE Sqid='{idtransaksi}'
```

```sql
SELECT sqcabang, sqlokasi, sqsumber, sqautonotransaksi, sqnotransaksi, sqtgl, sqinputuser
```

```sql
DELETE FROM M5_Sq_Detail WHERE idsq = '{idtransaksi}'
```

```sql
DELETE FROM M5_Sq WHERE sqid = '{idtransaksi}'
```

```sql
SELECT a.*, i.bstok as stokreal FROM m5_sq_out_bahan a JOIN m5_sq b ON a.idsq = b.sqid AND b.sqid = {idtransaksi} JOIN m1_item i ON a.idbarang = i.bid
```

```sql
SELECT prd.idprdetail, (prd.jmlbarang - prd.jmlsq) as sisasq, i.bid, i.bkode FROM m4_pr_detail AS prd INNER JOIN m1_item AS i ON prd.idbarang = i.bid WHERE {ftOutstanding}
```

```sql
SELECT sqcabang, sqlokasi, sqsumber, sqautonotransaksi, sqnotransaksi, sqtgl
```

```sql
SELECT sqo.idbarang, sqo.namabarang, i.btipe tipebarang, sqo.jml, sqo.satuan, u.unilai nilaisatuan, (sqo.jml * u.unilai) jmlbarang, i.bsatuan satuanbarang, sqd.matauang, sqd.kurs, sqo.hargajual harga, sqo.hargabeli hpp, 0 idhppkhususmasuk, 0 idhppfifomasuk, i.brekpersediaan rekpersediaan, sqd.cabang, sqd.lokasi, sqd.gudang gudangasal, sqd.gudang gudangproduksi, sqd.gudang gudangtujuan, sqd.costcenter, sqd.divisi, sqd.subdivisi, sqd.proyek, sqd.catatan, sqo.urutan, 0 idbom, 0 idbomout, sqo.customtext1, sqo.customtext2, sqo.customtext3, sqo.customdbl1, sqo.customdbl2, sqo.customdbl3, sqo.customdate1, sqo.customdate2, sqo.customdate3, sqo.kodebarang, i.bhpp, i.bjenis, i.bserial, i.bbatch, '' costcenternama, '' divisinama, '' subdivisinama, '' proyeknama, sq.sqnotransaksi notransaksi, i.bjmllapangan, i.bsatuanlapangan, 0 prosentase, 0 stokakhir, sqo.hargabeli, 0 stokreal FROM m5_sq_out_bahan sqo JOIN m1_item i ON i.bid = sqo.idbarang JOIN m1_unit u ON u.ukode = i.bsatuan JOIN m5_sq_detail sqd ON sqd.idsq = sqo.idsq AND sqd.idbarang = sqo.idbarangdetail JOIN m5_so_detail sod ON sod.idsqdetail = sqd.idsqdetail LEFT JOIN m5_sq sq ON sq.sqid = sqo.idsq
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_sq_history.vb`

```sql
INSERT INTO m5_sq_history(SELECT 0, sq.* FROM m5_sq sq WHERE sq.sqid = '{idtransaksi}')
```

```sql
SELECT sqidhistory FROM m5_sq_history WHERE sqid = '{idtransaksi}' ORDER BY sqmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m5_sq_detail_history (SELECT 0, '{result_4}', sq.* FROM m5_sq_detail sq WHERE sq.idsq = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_sr.vb`

```sql
SELECT COUNT(srid), srnotransaksi FROM M5_sr WHERE srid='{result_4}' AND srstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(srid) FROM M5_sr WHERE srnotransaksi='{notransaksi}'
```

```sql
SELECT COUNT(srid) FROM m5_sr WHERE srnotransaksi='{notransaksi}'
```

```sql
SELECT si.siid, si.sinotransaksi, si.sitotaltransaksi, si.sijmlbayar FROM m5_sr_detail srd JOIN m5_si_detail sid ON srd.idsidetail = sid.idsidetail JOIN m5_si si ON sid.idsi = si.siid WHERE srd.idsr = '{result_4}' GROUP BY si.siid
```

```sql
UPDATE m5_si_detail SET jmlrealisasi = (CASE idsidetail {updNilaiSI} ELSE jmlrealisasi END) WHERE {updFilterSI}
```

```sql
SELECT idsi FROM m5_si_detail WHERE {updFilterSI} GROUP BY idsi
```

```sql
SELECT idsi, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m5_si_detail WHERE {ftDetail} GROUP BY idsi
```

```sql
UPDATE m5_si SET sistatusrealisasi = (CASE siid {updNilaiSI} ELSE sistatusrealisasi END) WHERE {updFilterSI}
```

```sql
UPDATE m5_rnr_detail SET jmlrealisasi = (CASE idrnrdetail {updNilaiRNR} ELSE jmlrealisasi END) WHERE {updFilterRNR}
```

```sql
SELECT idrnr FROM m5_rnr_detail WHERE {updFilterRNR} GROUP BY idrnr
```

```sql
SELECT idrnr, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m5_rnr_detail WHERE {ftDetail} GROUP BY idrnr
```

```sql
UPDATE m5_rnr SET rnrstatusrealisasi = (CASE rnrid {updNilaiRNR} ELSE rnrstatusrealisasi END) WHERE {updFilterRNR}
```

```sql
UPDATE m7_asset a SET a.aakumulasibeban = a.aakumulasibebansebelumnya, a.anilaibuku = a.anilaibukusebelumnya, a.aisclose = 0 WHERE a.aid IN({strValue2.ToString})
```

```sql
UPDATE m5_si si LEFT JOIN m2_transaction_journal t ON si.sisumber = t.tsumber AND si.siid = t.tidtransaksi AND si.sinotransaksi = t.tnotransaksi SET si.sijmlbayar = si.sijmlbayar + {Double_Parse_drutama_srtotaltransaksi}, si.sitgllunas = (CASE WHEN si.sijmlbayar + {Double_Parse_drutama_srtotaltransaksi} >= si.sitotaltransaksi THEN '{FixQuotes_drutama_srtgl}' ELSE si.sitgllunas END) WHERE si.siid = '{IdSI}'
```

```sql
UPDATE m5_si si LEFT JOIN m2_transaction_journal t ON si.sisumber = t.tsumber AND si.siid = t.tidtransaksi AND si.sinotransaksi = t.tnotransaksi SET t.tstatuslunas = si.sistatuslunas, t.ttgllunas = si.sitgllunas WHERE si.siid = '{IdSI}'
```

```sql
UPDATE m5_sr sr JOIN m1_contact c ON sr.srid = '{result_4}' AND c.kid = sr.srcustomer SET c.ktotalpiutang = c.ktotalpiutang - (sr.srtotaltransaksi * sr.srkurs)
```

```sql
SELECT srd.idsrdetail, srd.idbarang, srd.namabarang, srd.tipebarang, srd.jml, srd.satuan, srd.jmlbarang, srd.satuanbarang, srd.matauang, srd.kurs, srd.harga, srd.diskon, srd.jmldiskon, srd.hpp, srd.idhppkhususkeluar, srd.gudangasal, srd.gudangtransit, srd.gudangtujuan, srd.catatan, srd.costcenter, srd.divisi, srd.subdivisi, srd.proyek, sr.srinputtgl, i.bhpp, IFNULL(sid.hpp,srd.hpp)as hppbaru FROM m5_sr_detail srd JOIN m5_sr sr ON srd.idsr = sr.srid JOIN m1_item i ON srd.idbarang = i.bid LEFT JOIN m5_si_detail sid ON srd.idsidetail=sid.idsidetail WHERE srd.idsr = '{result_4}'
```

```sql
SELECT bstok FROM m1_item WHERE bid = '{idbarang}'
```

```sql
INSERT INTO m1_item_stock_warehouse (idbarang, kgudang, stok) VALUES ('{idbarang}','{gudang}','{jmlbarang}') ON DUPLICATE KEY UPDATE stok = stok + VALUES(stok)
```

```sql
UPDATE m1_item SET bstok = '{saldojml}' WHERE bid = '{idbarang}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}'
```

```sql
SELECT moduleid, menuid, 0, 0, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Srtgl, Srnotransaksi, Srstatus, Srjenis, Srtotaltransaksi FROM M5_Sr WHERE Srid='{idtransaksi}'
```

```sql
SELECT bkode, nbikode FROM m1_no_batch_in JOIN m1_item ON nbiidbarang = bid WHERE nbisumber = '{sumber}' AND nbiidtransaksi = '{idtransaksi}' AND nbijmlkeluar > 0
```

```sql
SELECT bkode, nsikode FROM m1_no_serial_in JOIN m1_item ON nsiidbarang = bid WHERE nsisumber = '{sumber}' AND nsiidtransaksi = '{idtransaksi}' AND nsijmlkeluar > 0
```

```sql
UPDATE m5_sr sr JOIN m1_contact c ON sr.srid = '{idtransaksi}' AND c.kid = sr.srcustomer SET c.ktotalpiutang = c.ktotalpiutang + (sr.srtotaltransaksi * sr.srkurs)
```

```sql
SELECT srd.idsrdetail, srd.idbarang, i.bkode as kodebarang, srd.tipebarang, srd.namabarang, srd.satuan, srd.nilaisatuan, srd.jmlbarang, srd.idsidetail, srd.idrnrdetail, srd.gudangasal, srd.gudangtransit, srd.gudangtujuan, srd.idhppkhususkeluar, srd.idhppfifokeluar, srd.urutan, IFNULL(cso.idhppikm,0) as idhppkhususmasuk, IFNULL(cso.jmlkeluar,0) as jmlkeluar, IFNULL(cfo.cfoidcfi,0) as idhppfifomasuk, IFNULL(cfo.cfojmlkeluar,0) as cfojmlkeluar, i.bhpp, sr.srjenispenjualankategori FROM m5_sr_detail srd JOIN m5_sr sr ON srd.idsr = sr.srid JOIN m1_item i ON srd.idbarang = i.bid LEFT JOIN m1_cogs_special_out cso ON srd.idhppkhususkeluar=cso.idhppikk LEFT JOIN m1_cogs_fifo_out cfo ON srd.idhppfifokeluar=cfo.cfoid WHERE srd.idsr = '{idtransaksi}'
```

```sql
SELECT sid.idsi FROM m5_sr_detail srd JOIN m5_si_detail sid ON srd.idsidetail = sid.idsidetail WHERE srd.idsr = '{idtransaksi}' GROUP BY sid.idsi
```

```sql
UPDATE m5_si si LEFT JOIN m2_transaction_journal t ON si.sisumber = t.tsumber AND si.siid = t.tidtransaksi AND si.sinotransaksi = t.tnotransaksi SET si.sijmlbayar = si.sijmlbayar - {srtotaltransaksi}, si.sitgllunas = '{1900_01_01}' WHERE si.siid = '{IdSi}'
```

```sql
UPDATE m5_si si LEFT JOIN m2_transaction_journal t ON si.sisumber = t.tsumber AND si.siid = t.tidtransaksi AND si.sinotransaksi = t.tnotransaksi SET t.tstatuslunas = si.sistatuslunas, t.ttgllunas = si.sitgllunas WHERE si.siid = '{IdSi}'
```

```sql
DELETE FROM m1_no_batch_in WHERE nbisumber = '{sumber}' AND nbiidtransaksi = '{idtransaksi}'
```

```sql
DELETE FROM m1_no_serial_in WHERE nsisumber = '{sumber}' AND nsiidtransaksi = '{idtransaksi}'
```

```sql
SELECT atasetid FROM m7_asset_transaction WHERE atsumber = '{sumber}' AND atidutama = '{idtransaksi}'
```

```sql
UPDATE m7_asset a SET a.aakumulasibeban = 0, a.anilaibuku = 0, a.aisclose = 1 WHERE a.aid IN({strValue2.ToString})
```

```sql
DELETE FROM m1_cogs_special_in WHERE {ftHppI}
```

```sql
DELETE FROM m1_cogs_fifo_in WHERE {ftHppF}
```

```sql
INSERT INTO m1_item_stock_warehouse (idbarang, kgudang, stok) VALUES {updStokOut} ON DUPLICATE KEY UPDATE stok = stok + VALUES(stok)
```

```sql
UPDATE m1_item SET bstok = (CASE bid {updStokBarang} ELSE bstok END) WHERE {ftStokBarang}
```

```sql
DELETE FROM m1_item_transaction WHERE sumber = '{sumber}' AND idutama = '{idtransaksi}'
```

```sql
UPDATE m1_item i
```

```sql
DELETE FROM M2_Transaction_Journal WHERE tsumber = '{sumber}' AND tidtransaksi = '{idtransaksi}' AND tnotransaksi = '{notransaksi}'
```

```sql
UPDATE M5_Sr SET Srstatus = {nilaiStatus}, Srmodifikasiuser='{userid}', Srmodifikasitgl = NOW(), Srposting = 0, Srpostingtgl = '1971-01-01 00:00:00', Srjmlrevisi = Srjmlrevisi + 1 WHERE Srid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Srid, Srnotransaksi FROM M5_Sr WHERE Srid='{idtransaksi}'
```

```sql
SELECT srcabang, srlokasi, srsumber, srautonotransaksi, srnotransaksi, srtgl
```

```sql
DELETE FROM M5_Sr_Detail WHERE idsr='{idtransaksi}'
```

```sql
DELETE FROM M5_Sr WHERE srid='{idtransaksi}'
```

```sql
SELECT si.sinotransaksi as notransaksi, (CASE si.sihargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_si_detail sid JOIN m5_si si ON sid.idsi = si.siid WHERE {ftSI} GROUP BY si.sihargatermasukpajak
```

```sql
SELECT i.bkode, sid.idsidetail, si.sinotransaksi as notransaksi, (CASE si.sihargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_si_detail sid JOIN m5_si si ON sid.idsi = si.siid JOIN m1_item i ON sid.idbarang = i.bid WHERE ({ftSI}) AND si.sihargatermasukpajak <> {termasukPajak} ORDER BY sid.urutan
```

```sql
SELECT sid.idsidetail, (sid.jmlbarang - sid.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m5_si_detail AS sid INNER JOIN m1_item AS i ON sid.idbarang = i.bid WHERE {ftOutstandingSI}
```

```sql
SELECT rnr.rnrnotransaksi as notransaksi, (CASE rnr.rnrhargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_rnr_detail rnrd JOIN m5_rnr rnr ON rnrd.idrnr = rnr.rnrid WHERE {ftRNR} GROUP BY rnr.rnrhargatermasukpajak
```

```sql
SELECT i.bkode, rnrd.idrnrdetail, rnr.rnrnotransaksi as notransaksi, (CASE rnr.rnrhargatermasukpajak WHEN 0 THEN '(Exclude Tax)' ELSE '(Include Tax)' END) as termasukpajak FROM m5_rnr_detail rnrd JOIN m5_rnr rnr ON rnrd.idrnr = rnr.rnrid JOIN m1_item i ON rnrd.idbarang = i.bid WHERE ({ftRNR}) AND rnr.rnrhargatermasukpajak <> {termasukPajak} ORDER BY rnrd.urutan
```

```sql
SELECT rnrd.idrnrdetail, (rnrd.jmlbarang - rnrd.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m5_rnr_detail AS rnrd INNER JOIN m1_item AS i ON rnrd.idbarang = i.bid WHERE {ftOutstandingRNR}
```

```sql
SELECT idbarang, bkode FROM m1_cogs_special_in JOIN m1_item ON idbarang = bid AND bjenis <> 'J' WHERE ({ftHppI}) AND jmlkeluar > 0
```

```sql
SELECT cfiidbarang, bkode FROM m1_cogs_fifo_in JOIN m1_item ON cfiidbarang = bid AND bjenis <> 'J' WHERE ({ftHppI}) AND cfijmlkeluar > 0
```

```sql
SELECT isw.idbarang, isw.kgudang, isw.stok, i.bkode FROM m1_item_stock_warehouse isw JOIN m1_item i ON isw.idbarang = i.bid AND i.bjenis <> 'J' WHERE {ftStok}
```

```sql
SELECT sr.srid AS srid, sr.srnotransaksi AS srnotransaksi, `sq`.sqsumber AS sumber, `sq`.sqid AS idterkait, `sq`.sqnotransaksi AS noterkait, `sq`.sqtgl AS tglterkait, `sq`.sqinputtgl AS inputtglterkait, `sq`.sqmodifikasitgl AS modifikasitglterkait, 0 as jenisterkait FROM m5_sq_detail sqd JOIN m5_sq `sq` ON sqd.idsq = sqid JOIN m5_sr_detail srd ON sqd.idsqdetail = srd.idsqdetail JOIN m5_sr sr ON srd.idsr = sr.srid {filter_2} GROUP BY `sq`.sqid, sr.srid
```

```sql
SELECT srd.idsrdetail, srd.idbarang, i.bkode as kodebarang, srd.tipebarang, srd.namabarang, srd.satuan, srd.nilaisatuan, srd.jmlbarang, srd.idsidetail, srd.idrnrdetail, srd.gudangasal, srd.gudangtransit, srd.gudangtujuan, srd.idhppkhususkeluar, srd.idhppfifokeluar, srd.urutan, IFNULL(cso.idhppikm,0) as idhppkhususmasuk, IFNULL(cso.jmlkeluar,0) as jmlkeluar, IFNULL(cfo.cfoidcfi,0) as idhppfifomasuk, IFNULL(cfo.cfojmlkeluar,0) as cfojmlkeluar, i.bhpp FROM m5_sr_detail srd JOIN m1_item i ON srd.idbarang = i.bid LEFT JOIN m1_cogs_special_out cso ON srd.idhppkhususkeluar=cso.idhppikk LEFT JOIN m1_cogs_fifo_out cfo ON srd.idhppfifokeluar=cfo.cfoid WHERE srd.idsr = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Srtgl, Srnotransaksi, Srstatus FROM M5_Sr WHERE Srid='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m5/m5_sr_history.vb`

```sql
INSERT INTO m5_sr_history(SELECT 0, sr.* FROM m5_sr sr WHERE sr.srid = '{idtransaksi}')
```

```sql
SELECT sridhistory FROM m5_sr_history WHERE srid = '{idtransaksi}' ORDER BY srmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m5_sr_detail_history (SELECT 0, '{result_4}', sr.* FROM m5_sr_detail sr WHERE sr.idsr = '{idtransaksi}' )
```

```sql
INSERT INTO m1_no_batch_transaction_history(SELECT 0, '{result_4}', nb.* FROM m1_no_batch_transaction nb WHERE nb.nbtidtransaksi = '{idtransaksi}' and nb.nbtsumber = 'SR')
```

```sql
INSERT INTO m1_no_serial_transaction_history(SELECT 0, '{result_4}', ns.* FROM m1_no_serial_transaction ns WHERE ns.nstidtransaksi = '{idtransaksi}' and ns.nstsumber = 'SR')
```

```sql
INSERT INTO m7_asset_transaction_history(SELECT 0, '{result_4}', atr.* FROM m7_asset_transaction atr WHERE atr.atidutama = '{idtransaksi}' and atr.atsumber = 'SR')
```

