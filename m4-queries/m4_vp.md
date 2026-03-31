# M4_VP Queries

## Query 1

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
DELETE FROM M2_Transaction_Journal WHERE tsumber = 'VP' AND tidtransaksi = '{idtransaksi}' AND tnotransaksi = '{notransaksi}'
```

## Query 2

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
DELETE FROM M4_Vp WHERE vpid='{idtransaksi}'
```

## Query 3

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
DELETE FROM M4_Vp_Detail WHERE idvp='{idtransaksi}'
```

## Query 4

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
DELETE FROM M4_Vp_Pay WHERE idvp='{idtransaksi}'
```

## Query 5

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
DELETE FROM m2_giro_list WHERE glsumber = 'VP' AND glidtransaksi = '{idtransaksi}' AND glnotransaksi = '{notransaksi}'
```

## Query 6

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
Delete from M4_Vp_Detail where idvp = '{result_4}'
```

## Query 7

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
Delete from M4_Vp_Pay where idvp = '{result_4}'
```

## Query 8

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp_history.vb`

```sql
INSERT INTO m4_vp_detail_history (SELECT 0, '{result_4}', vp.* FROM m4_vp_detail vp WHERE vp.idvp = '{idtransaksi}' )
```

## Query 9

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp_history.vb`

```sql
INSERT INTO m4_vp_history(SELECT 0, vp.* FROM m4_vp vp WHERE vp.vpid = '{idtransaksi}')
```

## Query 10

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp_history.vb`

```sql
INSERT INTO m4_vp_pay_history (SELECT 0, '{result_4}', vp.* FROM m4_vp_pay vp WHERE vp.idvp = '{idtransaksi}' )
```

## Query 11

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
Insert into M0_Msmq_Journal(mjid, mjsumber, mjidtransaksi, mjprogress, mjpesan, mjtglantrian, mjtglselesai, mjuserid) values ('{mjid}', '{sumber}', '{result_4}', '{0}', '', NOW(), '1971-01-01 00:00:00', '{userid}')
```

## Query 12

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
Insert into M0_Userlog (uluserid, ulidmodule, ulidmenu, uljenisaktivitas, ulaktivitas, ultgl, ulkodepa) values({userid}, {mdlid}, {mnid}, {jnsaktivitas}, '{notransaksi}', NOW(), {0})
```

## Query 13

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
Insert into M2_Giro_List(glnogiro, glsumber, glidtransaksi, glnotransaksi, glkontak, glrekbank, glrekgiro, gljenis, glbank, glnoacbank, glmatauang, glkurs, gljumlah, gljumlahvalas, gltgljthtempo, gltglcair, glstatus, glstatussebelumnya, glurutan) values{strGiro.ToString}
```

## Query 14

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
Insert into M4_Vp (vpcabang, vplokasi, vpgudang, vpsumber, vpautonotransaksi, vpnotransaksi, vptgl, vpkodepa, vpsupplier, vpsupplierkontak, vp1alamat1, vp1alamat2, vp1alamat3, vp2alamat1, vp2alamat2, vp2alamat3, vpbagianpembayaran, vpuraian, vpcatatan, vpnoref, vptglnoref, vpcarabayar, vptglbayar, vpmatauang, vpkurs, vptotalap, vptotalapvalas, vptotalar, vptotalarvalas, vpbayar, vpbayarvalas, vpselisihkurs, vprekselisihkurs, vpdiskontermin, vpdiskonterminvalas, vprekdiskontermin, vpidvpp, vpstatus, vpstatussebelumnya, vpjmlrevisi, vpcetakanke, vpinputuser, vpinputtgl, vpmodifikasiuser, vpmodifikasitgl, vpisclose, vpcustomtext1, vpcustomtext2, vpcustomtext3, vpcustomtext4, vpcustomtext5, vpcustomint1, vpcustomint2, vpcustomint3, vpcustomdbl1, vpcustomdbl2, vpcustomdbl3, vpcustomdate1, vpcustomdate2, vpcustomdate3) values('{vpcabang}', '{vplokasi}', '{vpgudang}', '{vpsumber}', {vpautonotransaksi}, '{notransaksi}', '{vptgl}', {vpkodepa}, {vpsupplier}, '{vpsupplierkontak}', '{vp1alamat1}', '{vp1alamat2}', '{vp1alamat3}', '{vp2alamat1}', '{vp2alamat2}', '{vp2alamat3}', {vpbagianpembayaran}, '{vpuraian}', '{vpcatatan}', '{vpnoref}', '{vptglnoref}', {vpcarabayar}, '{vptglbayar}', '{vpmatauang}', '{vpkurs}', '{vptotalap}', '{vptotalapvalas}', '{vptotalar}', '{vptotalarvalas}', '{vpbayar}', '{vpbayarvalas}', '{vpselisihkurs}', '{vprekselisihkurs}', '{vpdiskontermin}', '{vpdiskonterminvalas}', '{vprekdiskontermin}', {vpidvpp}, {vpstatus}, {vpstatussebelumnya}, {vpjmlrevisi}, {vpcetakanke}, {vpinputuser}, NOW(), {vpmodifikasiuser}, '1971-01-01 00:00:00', {vpisclose}, '{vpcustomtext1}', '{vpcustomtext2}', '{vpcustomtext3}', '{vpcustomtext4}', '{vpcustomtext5}', {vpcustomint1}, {vpcustomint2}, {vpcustomint3}, '{vpcustomdbl1}', '{vpcustomdbl2}', '{vpcustomdbl3}', '{vpcustomdate1}', '{vpcustomdate2}', '{vpcustomdate3}')
```

## Query 15

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
Insert into M4_Vp_Detail(idvpdetail, idvp, sumber, idtransaksi, matauang, kurs, totaltransaksi, terbayar, rencana, sisa, jmlbayar, jmlbayarvalas, diskontermin, jmldiskontermin, jmldiskonterminvalas, rekhutangpiutang, catatan, costcenter, divisi, subdivisi, proyek, idvppdetail, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2.ToString}
```

## Query 16

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
Insert into M4_Vp_Pay(idvpcarabayar, idvp, carabayar, matauang, kurs, jumlah, jumlahvalas, nogiro, tgljt, bank, noacbank, rekbank, rekgiro, catatan, urutan, idvppcarabayar, isclose) values{strValue2.ToString}
```

## Query 17

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
SELECT ap.apid, ap.apsumber, ap.apnotransaksi, ap.apmatauang, (CASE ap.apmatauang WHEN s.snilai THEN ap.apjumlah - ap.apjumlahbayar ELSE ap.apjumlahvalas - ap.apjumlahbayarvalas END) apsisatransaksi FROM m4_ap ap LEFT JOIN m0_setting s ON s.smodule =0 AND s.sgrup='accounting' AND s.skode = 'MataUangFungsional' WHERE {ftOutstandingAP}
```

## Query 18

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
SELECT ap.apid, ap.apsumber, ap.aptgl, ap.apnotransaksi FROM m4_ap ap WHERE ap.aptgl > '{tglPembayaran}' AND ({updFilterAP})
```

## Query 19

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
SELECT prt.prtid, prt.prtsumber, prt.prtnotransaksi, prt.prtmatauang, prt.prttotaltransaksi - prt.prtjmlbayar as prtsisatransaksi FROM m4_prt prt LEFT JOIN m0_setting s ON s.smodule =0 AND s.sgrup='accounting' AND s.skode = 'MataUangFungsional' WHERE {ftOutstandingPRT}
```

## Query 20

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
SELECT prt.prtid, prt.prtsumber, prt.prttgl, prt.prtnotransaksi FROM m4_prt prt WHERE prt.prttgl > '{tglPembayaran}' AND ({updFilterPRT})
```

## Query 21

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
SELECT ri.riid, ri.risumber, ri.rinotransaksi, ri.rimatauang, COUNT(ri.ritotaltransaksi - ri.rijmlbayar, 5) as risisatransaksi FROM m4_ri ri LEFT JOIN m0_setting s ON s.smodule =0 AND s.sgrup='accounting' AND s.skode = 'MataUangFungsional' WHERE {ftOutstandingRI}
```

## Query 22

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
SELECT ri.riid, ri.risumber, ri.ritgl, ri.rinotransaksi FROM m4_ri ri WHERE ri.ritgl > '{tglPembayaran}' AND ({updFilterRI})
```

## Query 23

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
SELECT vpcabang, vplokasi, vpsumber, vpautonotransaksi, vpnotransaksi, vptgl FROM M4_vp WHERE vpid = '{idtransaksi}'
```

## Query 24

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp_history.vb`

```sql
SELECT vpidhistory FROM m4_vp_history WHERE vpid = '{idtransaksi}' ORDER BY vpmodifikasitgl DESC LIMIT 1
```

## Query 25

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
SELECT vppd.idvppdetail, (vppd.jmlbayar - vppd.jmlvp) as sisavp, (vppd.jmlbayarvalas - vppd.jmlvpvalas) as sisavpvalas, vppd.matauang, vppd.sumber, (CASE vppd.sumber WHEN 'AP' THEN ap.apnotransaksi WHEN 'RI' THEN ri.rinotransaksi WHEN 'PRT' THEN prt.prtnotransaksi ELSE vppd.rekhutangpiutang END) as notransaksi FROM m4_vpp_detail AS vppd LEFT JOIN m4_ap ap ON vppd.sumber = 'AP' AND vppd.idtransaksi = ap.apid LEFT JOIN m4_ri ri ON vppd.sumber = 'RI' AND vppd.idtransaksi = ri.riid LEFT JOIN m4_prt prt ON vppd.sumber = 'PRT' AND vppd.idtransaksi = prt.prtid WHERE {ftOutstanding}
```

## Query 26

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
UPDATE M4_Vp SET Vpstatus = {nilaiStatus}, Vpmodifikasiuser='{userid}', Vpmodifikasitgl = NOW(), Vpposting = 0, Vppostingtgl = '1971-01-01 00:00:00', Vpjmlrevisi = Vpjmlrevisi + 1 WHERE Vpid = '{idtransaksi}'
```

## Query 27

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
UPDATE M4_vpp SET vppstatusvp = (CASE vppid {updNilai} ELSE vppstatusvp END) WHERE {updFilter}
```

## Query 28

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
UPDATE M4_vpp_detail SET jmlvp = (CASE idvppdetail {updNilai} ELSE jmlvp END), jmlvpvalas = (CASE idvppdetail {updNilaiValas} ELSE jmlvpvalas END) WHERE {updFilter}
```

## Query 29

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
UPDATE m4_ap ap JOIN m2_transaction_journal t ON ap.apsumber = t.tsumber AND ap.apid = t.tidtransaksi AND ap.apnotransaksi = t.tnotransaksi SET t.tstatuslunas = ap.apstatusbayar, t.ttgllunas = ap.aptgllunas WHERE {updFilterAP}
```

## Query 30

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
UPDATE m4_ap ap SET ap.apjumlahbayar = (CASE ap.apid {updNilaiAP} ELSE ap.apjumlahbayar END), ap.apjumlahbayarvalas = (CASE ap.apid {updNilaiValasAP} ELSE ap.apjumlahbayarvalas END), ap.aptgllunas = '{tglLunas}' WHERE {updFilterAP}
```

## Query 31

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
UPDATE m4_ap ap SET ap.apjumlahbayar = (CASE ap.apid {updNilaiAP} ELSE ap.apjumlahbayar END), ap.apjumlahbayarvalas = (CASE ap.apid {updNilaiValasAP} ELSE ap.apjumlahbayarvalas END), ap.aptgllunas = (CASE ap.apid {updTglLunasAP} ELSE ap.aptgllunas END) WHERE {updFilterAP}
```

## Query 32

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
UPDATE m4_prt prt JOIN m2_transaction_journal t ON prt.prtsumber = t.tsumber AND prt.prtid = t.tidtransaksi AND prt.prtnotransaksi = t.tnotransaksi SET t.tstatuslunas = prt.prtstatuslunas, t.ttgllunas = prt.prttgllunas WHERE {updFilterPRT}
```

## Query 33

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
UPDATE m4_prt prt SET prt.prtjmlbayar = (CASE prt.prtid {updNilaiPRT} ELSE prt.prtjmlbayar END), prt.prttgllunas = '{tglLunas}' WHERE {updFilterPRT}
```

## Query 34

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
UPDATE m4_prt prt SET prt.prtjmlbayar = (CASE prt.prtid {updNilaiPRT} ELSE prt.prtjmlbayar END), prt.prttgllunas = (CASE prt.prtid {updTglLunasPRT} ELSE prt.prttgllunas END) WHERE {updFilterPRT}
```

## Query 35

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
UPDATE m4_ri ri JOIN m2_transaction_journal t ON ri.risumber = t.tsumber AND ri.riid = t.tidtransaksi AND ri.rinotransaksi = t.tnotransaksi SET t.tstatuslunas = ri.ristatuslunas, t.ttgllunas = ri.ritgllunas WHERE {updFilterRI}
```

## Query 36

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
UPDATE m4_ri ri SET ri.rijmlbayar = (CASE ri.riid {updNilaiRI} ELSE ri.rijmlbayar END), ri.ritgllunas = '{tglLunas}' WHERE {updFilterRI}
```

## Query 37

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
UPDATE m4_ri ri SET ri.rijmlbayar = (CASE ri.riid {updNilaiRI} ELSE ri.rijmlbayar END), ri.ritgllunas = (CASE ri.riid {updTglLunasRI} ELSE ri.ritgllunas END) WHERE {updFilterRI}
```

## Query 38

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
Update M4_Vp set vpcabang = '{vpcabang}', vplokasi = '{vplokasi}', vpgudang = '{vpgudang}', vpsumber = '{vpsumber}', vpautonotransaksi = {vpautonotransaksi}, vpnotransaksi = '{notransaksi}', vptgl = '{vptgl}', vpkodepa = {vpkodepa}, vpsupplier = {vpsupplier}, vpsupplierkontak = '{vpsupplierkontak}', vp1alamat1 = '{vp1alamat1}', vp1alamat2 = '{vp1alamat2}', vp1alamat3 = '{vp1alamat3}', vp2alamat1 = '{vp2alamat1}', vp2alamat2 = '{vp2alamat2}', vp2alamat3 = '{vp2alamat3}', vpbagianpembayaran = {vpbagianpembayaran}, vpuraian = '{vpuraian}', vpcatatan = '{vpcatatan}', vpnoref = '{vpnoref}', vptglnoref = '{vptglnoref}', vpcarabayar = {vpcarabayar}, vptglbayar = '{vptglbayar}', vpmatauang = '{vpmatauang}', vpkurs = '{vpkurs}', vptotalap = '{vptotalap}', vptotalapvalas = '{vptotalapvalas}', vptotalar = '{vptotalar}', vptotalarvalas = '{vptotalarvalas}', vpbayar = '{vpbayar}', vpbayarvalas = '{vpbayarvalas}', vpselisihkurs = '{vpselisihkurs}', vprekselisihkurs = '{vprekselisihkurs}', vpdiskontermin = '{vpdiskontermin}', vpdiskonterminvalas = '{vpdiskonterminvalas}', vprekdiskontermin = '{vprekdiskontermin}', vpidvpp = {vpidvpp}, vpstatus = {vpstatus}, vpstatussebelumnya = {vpstatussebelumnya}, vpjmlrevisi = vpjmlrevisi+1, vpcetakanke = {vpcetakanke}, vpmodifikasiuser = {vpmodifikasiuser}, vpmodifikasitgl = NOW(), vpcustomtext1 = '{vpcustomtext1}', vpcustomtext2 = '{vpcustomtext2}', vpcustomtext3 = '{vpcustomtext3}', vpcustomtext4 = '{vpcustomtext4}', vpcustomtext5 = '{vpcustomtext5}', vpcustomint1 = {vpcustomint1}, vpcustomint2 = {vpcustomint2}, vpcustomint3 = {vpcustomint3}, vpcustomdbl1 = '{vpcustomdbl1}', vpcustomdbl2 = '{vpcustomdbl2}', vpcustomdbl3 = '{vpcustomdbl3}', vpcustomdate1 = '{vpcustomdate1}', vpcustomdate2 = '{vpcustomdate2}', vpcustomdate3 = '{vpcustomdate3}' where vpid = '{vpid}'
```

## Query 39

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_vp_getdata_pay_history`

```sql
select `vp`.`idhistorycarabayar` AS `idhistorycarabayar`,`vp`.`idhistory` AS `idhistory`, `vp`.`idvpcarabayar` AS `idvpcarabayar`,`vp`.`idvp` AS `idvp`,`vp`.`carabayar` AS `carabayar`,`vp`.`matauang` AS `matauang`,`vp`.`kurs` AS `kurs`,`vp`.`jumlah` AS `jumlah`,`vp`.`jumlahvalas` AS `jumlahvalas`,`vp`.`nogiro` AS `nogiro`,`vp`.`tgljt` AS `tgljt`,`vp`.`bank` AS `bank`,`vp`.`noacbank` AS `noacbank`,`vp`.`rekbank` AS `rekbank`,`vp`.`rekgiro` AS `rekgiro`,`vp`.`catatan` AS `catatan`,`vp`.`urutan` AS `urutan`,`vp`.`idvppcarabayar` AS `idvppcarabayar`,`vp`.`isclose` AS `isclose`,`pm`.`nama` AS `carabayarnama`,`b`.`bnama` AS `banknama`,`coa1`.`cnama` AS `rekbanknama`,`coa2`.`cnama` AS `rekgironama` from ((((`m4_vp_pay_history` `vp` left join `m0_payment_method` `pm` on((`vp`.`carabayar` = `pm`.`kode`))) left join `m1_bank` `b` on((`vp`.`bank` = `b`.`bkode`))) left join `m1_coa` `coa1` on((`vp`.`rekbank` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`vp`.`rekgiro` = `coa2`.`cnomor`)))
```

## Query 40

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_vp_v`

```sql
select `vp`.`vpid` AS `vpid`,`vp`.`vpcabang` AS `vpcabang`,`vp`.`vplokasi` AS `vplokasi`,`vp`.`vpgudang` AS `vpgudang`,`vp`.`vpsumber` AS `vpsumber`,`vp`.`vpautonotransaksi` AS `vpautonotransaksi`,`vp`.`vpnotransaksi` AS `vpnotransaksi`,`vp`.`vptgl` AS `vptgl`,`vp`.`vpkodepa` AS `vpkodepa`,`vp`.`vpsupplier` AS `vpsupplier`,`vp`.`vpsupplierkontak` AS `vpsupplierkontak`,`vp`.`vp1alamat1` AS `vp1alamat1`,`vp`.`vp1alamat2` AS `vp1alamat2`,`vp`.`vp1alamat3` AS `vp1alamat3`,`vp`.`vp2alamat1` AS `vp2alamat1`,`vp`.`vp2alamat2` AS `vp2alamat2`,`vp`.`vp2alamat3` AS `vp2alamat3`,`vp`.`vpbagianpembayaran` AS `vpbagianpembayaran`,`vp`.`vpuraian` AS `vpuraian`,`vp`.`vpcatatan` AS `vpcatatan`,`vp`.`vpnoref` AS `vpnoref`,`vp`.`vptglnoref` AS `vptglnoref`,`vp`.`vpcarabayar` AS `vpcarabayar`,`vp`.`vptglbayar` AS `vptglbayar`,`vp`.`vpmatauang` AS `vpmatauang`,`vp`.`vpkurs` AS `vpkurs`,`vp`.`vptotalap` AS `vptotalap`,`vp`.`vptotalapvalas` AS `vptotalapvalas`,`vp`.`vptotalar` AS `vptotalar`,`vp`.`vptotalarvalas` AS `vptotalarvalas`,`vp`.`vpbayar` AS `vpbayar`,`vp`.`vpbayarvalas` AS `vpbayarvalas`,`vp`.`vpselisihkurs` AS `vpselisihkurs`,`vp`.`vprekselisihkurs` AS `vprekselisihkurs`,`vp`.`vpdiskontermin` AS `vpdiskontermin`,`vp`.`vpdiskonterminvalas` AS `vpdiskonterminvalas`,`vp`.`vprekdiskontermin` AS `vprekdiskontermin`,`vp`.`vpidvpp` AS `vpidvpp`,`vp`.`vpstatus` AS `vpstatus`,`vp`.`vpstatussebelumnya` AS `vpstatussebelumnya`,`vp`.`vpjmlrevisi` AS `vpjmlrevisi`,`vp`.`vpcetakanke` AS `vpcetakanke`,`vp`.`vpinputuser` AS `vpinputuser`,`vp`.`vpinputtgl` AS `vpinputtgl`,`vp`.`vpmodifikasiuser` AS `vpmodifikasiuser`,`vp`.`vpmodifikasitgl` AS `vpmodifikasitgl`,`vp`.`vpposting` AS `vpposting`,`vp`.`vppostingtgl` AS `vppostingtgl`,`vp`.`vpisclose` AS `vpisclose`,`br`.`bnama` AS `vpcabangnama`,`lc`.`lnama` AS `vplokasinama`,`wh`.`wnama` AS `vpgudangnama`,`c1`.`kkode` AS `vpsupplierkode`,`c1`.`knama` AS `vpsuppliernama`,`c2`.`kkode` AS `vpbagianpembayarankode`,`c2`.`knama` AS `vpbagianpembayarannama`,`pm`.`nama` AS `vpcarabayarnama`,`coa1`.`cnama` AS `vprekselisihkursnama`,`coa2`.`cnama` AS `vprekdiskonterminnama`,`vpp`.`vppnotransaksi` AS `vppnotransaksi`,`st1`.`nama` AS `vpstatusnama`,`st2`.`nama` AS `vpstatussebelumnyanama`,`u1`.`unama` AS `vpinputusernama`,`u2`.`unama` AS `vpmodifikasiusernama` from (((((((((((((`m4_vp` `vp` left join `m1_branch` `br` on((`br`.`bkode` = `vp`.`vpcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `vp`.`vplokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `vp`.`vpgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `vp`.`vpsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `vp`.`vpbagianpembayaran`))) left join `m0_payment_method` `pm` on((`vp`.`vpcarabayar` = `pm`.`kode`))) left join `m1_coa` `coa1` on((`vp`.`vprekselisihkurs` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`vp`.`vprekdiskontermin` = `coa2`.`cnomor`))) left join `m4_vpp` `vpp` on((`vp`.`vpidvpp` = `vpp`.`vppid`))) left join `m0_status` `st1` on((`st1`.`kode` = `vp`.`vpstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `vp`.`vpstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `vp`.`vpinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `vp`.`vpmodifikasiuser`)))
```

## Query 41

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_vp_getdata`

```sql
select `vp`.`vpid` AS `vpid`,`vp`.`vpcabang` AS `vpcabang`,`vp`.`vplokasi` AS `vplokasi`,`vp`.`vpgudang` AS `vpgudang`,`vp`.`vpsumber` AS `vpsumber`,`vp`.`vpautonotransaksi` AS `vpautonotransaksi`,`vp`.`vpnotransaksi` AS `vpnotransaksi`,`vp`.`vptgl` AS `vptgl`,`vp`.`vpkodepa` AS `vpkodepa`,`vp`.`vpsupplier` AS `vpsupplier`,`vp`.`vpsupplierkontak` AS `vpsupplierkontak`,`vp`.`vp1alamat1` AS `vp1alamat1`,`vp`.`vp1alamat2` AS `vp1alamat2`,`vp`.`vp1alamat3` AS `vp1alamat3`,`vp`.`vp2alamat1` AS `vp2alamat1`,`vp`.`vp2alamat2` AS `vp2alamat2`,`vp`.`vp2alamat3` AS `vp2alamat3`,`vp`.`vpbagianpembayaran` AS `vpbagianpembayaran`,`vp`.`vpuraian` AS `vpuraian`,`vp`.`vpcatatan` AS `vpcatatan`,`vp`.`vpnoref` AS `vpnoref`,`vp`.`vptglnoref` AS `vptglnoref`,`vp`.`vpcarabayar` AS `vpcarabayar`,`vp`.`vptglbayar` AS `vptglbayar`,`vp`.`vpmatauang` AS `vpmatauang`,`vp`.`vpkurs` AS `vpkurs`,`vp`.`vptotalap` AS `vptotalap`,`vp`.`vptotalapvalas` AS `vptotalapvalas`,`vp`.`vptotalar` AS `vptotalar`,`vp`.`vptotalarvalas` AS `vptotalarvalas`,`vp`.`vpbayar` AS `vpbayar`,`vp`.`vpbayarvalas` AS `vpbayarvalas`,`vp`.`vpselisihkurs` AS `vpselisihkurs`,`vp`.`vprekselisihkurs` AS `vprekselisihkurs`,`vp`.`vpdiskontermin` AS `vpdiskontermin`,`vp`.`vpdiskonterminvalas` AS `vpdiskonterminvalas`,`vp`.`vprekdiskontermin` AS `vprekdiskontermin`,`vp`.`vpidvpp` AS `vpidvpp`,`vp`.`vpstatus` AS `vpstatus`,`vp`.`vpstatussebelumnya` AS `vpstatussebelumnya`,`vp`.`vpjmlrevisi` AS `vpjmlrevisi`,`vp`.`vpcetakanke` AS `vpcetakanke`,`vp`.`vpinputuser` AS `vpinputuser`,`vp`.`vpinputtgl` AS `vpinputtgl`,`vp`.`vpmodifikasiuser` AS `vpmodifikasiuser`,`vp`.`vpmodifikasitgl` AS `vpmodifikasitgl`,`vp`.`vpposting` AS `vpposting`,`vp`.`vppostingtgl` AS `vppostingtgl`,`vp`.`vpisclose` AS `vpisclose`,`vp`.`vpcustomtext1` AS `vpcustomtext1`,`vp`.`vpcustomtext2` AS `vpcustomtext2`,`vp`.`vpcustomtext3` AS `vpcustomtext3`,`vp`.`vpcustomtext4` AS `vpcustomtext4`,`vp`.`vpcustomtext5` AS `vpcustomtext5`,`vp`.`vpcustomint1` AS `vpcustomint1`,`vp`.`vpcustomint2` AS `vpcustomint2`,`vp`.`vpcustomint3` AS `vpcustomint3`,`vp`.`vpcustomdbl1` AS `vpcustomdbl1`,`vp`.`vpcustomdbl2` AS `vpcustomdbl2`,`vp`.`vpcustomdbl3` AS `vpcustomdbl3`,`vp`.`vpcustomdate1` AS `vpcustomdate1`,`vp`.`vpcustomdate2` AS `vpcustomdate2`,`vp`.`vpcustomdate3` AS `vpcustomdate3`,`br`.`bnama` AS `vpcabangnama`,`lc`.`lnama` AS `vplokasinama`,`wh`.`wnama` AS `vpgudangnama`,`c1`.`kkode` AS `vpsupplierkode`,`c1`.`knama` AS `vpsuppliernama`,`c2`.`kkode` AS `vpbagianpembayarankode`,`c2`.`knama` AS `vpbagianpembayarannama`,`pm`.`nama` AS `vpcarabayarnama`,`coa1`.`cnama` AS `vprekselisihkursnama`,`coa2`.`cnama` AS `vprekdiskonterminnama`,`vpp`.`vppnotransaksi` AS `vpnotransaksivpp`,`st1`.`nama` AS `vpstatusnama`,`st2`.`nama` AS `vpstatussebelumnyanama`,`u1`.`unama` AS `vpinputusernama`,`u2`.`unama` AS `vpmodifikasiusernama`,`vpd`.`idvpdetail` AS `idvpdetail`,`vpd`.`idvp` AS `idvp`,`vpd`.`sumber` AS `sumber`,`vpd`.`idtransaksi` AS `idtransaksi`,`vpd`.`matauang` AS `matauang`,`vpd`.`kurs` AS `kurs`,`vpd`.`totaltransaksi` AS `totaltransaksi`,`vpd`.`terbayar` AS `terbayar`,`vpd`.`sisa` AS `sisa`,`vpd`.`jmlbayar` AS `jmlbayar`,`vpd`.`jmlbayarvalas` AS `jmlbayarvalas`,`vpd`.`diskontermin` AS `diskontermin`,`vpd`.`jmldiskontermin` AS `jmldiskontermin`,`vpd`.`jmldiskonterminvalas` AS `jmldiskonterminvalas`,`vpd`.`rekhutangpiutang` AS `rekhutangpiutang`,`vpd`.`catatan` AS `catatan`,`vpd`.`costcenter` AS `costcenter`,`vpd`.`divisi` AS `divisi`,`vpd`.`subdivisi` AS `subdivisi`,`vpd`.`proyek` AS `proyek`,`vpd`.`idvppdetail` AS `idvppdetail`,`vpd`.`urutan` AS `urutan`,`vpd`.`isclose` AS `isclose`,`vpd`.`customtext1` AS `customtext1`,`vpd`.`customtext2` AS `customtext2`,`vpd`.`customtext3` AS `customtext3`,`vpd`.`customdbl1` AS `customdbl1`,`vpd`.`customdbl2` AS `customdbl2`,`vpd`.`customdbl3` AS `customdbl3`,`vpd`.`customdate1` AS `customdate1`,`vpd`.`customdate2` AS `customdate2`,`vpd`.`customdate3` AS `customdate3`,(case `vpd`.`sumber` when 'RI' then `ri`.`rinotransaksi` when 'AP' then `ap`.`apnotransaksi` when 'PRT' then `prt`.`prtnotransaksi` else '' end) AS `notransaksi`,(case `vpd`.`sumber` when 'RI' then `ri`.`ritgl` when 'AP' then `ap`.`aptgl` when 'PRT' then `prt`.`prttgl` else `vp`.`vptgl` end) AS `tgl`,(case `vpd`.`sumber` when 'RI' then `ri`.`ricarabayar` when 'AP' then 0 when 'PRT' then `prt`.`prtcarabayar` else `vp`.`vpcarabayar` end) AS `carabayar`,(case `vpd`.`sumber` when 'RI' then `ri`.`ritermin` when 'AP' then `ap`.`aptermin` when 'PRT' then `prt`.`prttermin` else '' end) AS `termin`,(case `vpd`.`sumber` when 'RI' then `ri`.`ritgljatuhtempo` when 'AP' then `ap`.`aptgljatuhtempo` when 'PRT' then `prt`.`prttgljatuhtempo` else `vp`.`vptgl` end) AS `tgljatuhtempo`, `vpd`.`rencana` AS `rencana`,(case `vpd`.`sumber` when 'RI' then `ri`.`ristatuslunas` when 'AP' then `ap`.`apstatusbayar` when 'PRT' then `prt`.`prtstatuslunas` else 0 end) AS `statuslunas`,`tr`.`trdiskon1` AS `diskon1`,`tr`.`trharidiskon1` AS `haridiskon1`,`tr`.`trdiskon2` AS `diskon2`,`tr`.`trharidiskon2` AS `haridiskon2`,`coa3`.`cnama` AS `rekhutangpiutangnama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama`,`vpp2`.`vppnotransaksi` AS `vppnotransaksi`,(case `vpd`.`sumber` when 'RI' then `ri`.`riinputtgl` when 'AP' then `ap`.`apinputtgl` when 'PRT' then `prt`.`prtinputtgl` else `vp`.`vpinputtgl` end) AS `inputtgl`, c1.kpkp from (((((((((((((((((((((((((`m4_vp` `vp` join `m4_vp_detail` `vpd` on((`vp`.`vpid` = `vpd`.`idvp`))) left join `m1_branch` `br` on((`br`.`bkode` = `vp`.`vpcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `vp`.`vplokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `vp`.`vpgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `vp`.`vpsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `vp`.`vpbagianpembayaran`))) left join `m0_payment_method` `pm` on((`vp`.`vpcarabayar` = `pm`.`kode`))) left join `m1_coa` `coa1` on((`vp`.`vprekselisihkurs` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`vp`.`vprekdiskontermin` = `coa2`.`cnomor`))) left join `m4_vpp` `vpp` on((`vp`.`vpidvpp` = `vpp`.`vppid`))) left join `m0_status` `st1` on((`st1`.`kode` = `vp`.`vpstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `vp`.`vpstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `vp`.`vpinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `vp`.`vpmodifikasiuser`))) left join `m4_ri` `ri` on(((`vpd`.`sumber` = 'RI') and (`vpd`.`idtransaksi` = `ri`.`riid`)))) left join `m4_ap` `ap` on(((`vpd`.`sumber` = 'AP') and (`vpd`.`idtransaksi` = `ap`.`apid`)))) left join `m4_prt` `prt` on(((`vpd`.`sumber` = 'PRT') and (`vpd`.`idtransaksi` = `prt`.`prtid`)))) left join `m1_coa` `coa3` on((`vpd`.`rekhutangpiutang` = `coa3`.`cnomor`))) left join `m1_cost_center` `cc` on((`vpd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`vpd`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`vpd`.`subdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`vpd`.`proyek` = `p`.`pkode`))) left join `m4_vpp_detail` `vppd` on((`vpd`.`idvppdetail` = `vppd`.`idvppdetail`))) left join `m4_vpp` `vpp2` on((`vppd`.`idvpp` = `vpp2`.`vppid`))) left join `m1_terms` `tr` on((case `vpd`.`sumber` when 'RI' then (`ri`.`ritermin` = `tr`.`trkode`) when 'AP' then (`ap`.`aptermin` = `tr`.`trkode`) when 'PRT' then (`prt`.`prttermin` = `tr`.`trkode`) end)))
```

## Query 42

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`

```sql
select `vp`.`vpid` AS `vpid`,`vp`.`vpcabang` AS `vpcabang`,`vp`.`vplokasi` AS `vplokasi`,`vp`.`vpgudang` AS `vpgudang`,`vp`.`vpsumber` AS `vpsumber`,`vp`.`vpautonotransaksi` AS `vpautonotransaksi`,`vp`.`vpnotransaksi` AS `vpnotransaksi`,`vp`.`vptgl` AS `vptgl`,`vp`.`vpkodepa` AS `vpkodepa`,`vp`.`vpsupplier` AS `vpsupplier`,`vp`.`vpsupplierkontak` AS `vpsupplierkontak`,`vp`.`vp1alamat1` AS `vp1alamat1`,`vp`.`vp1alamat2` AS `vp1alamat2`,`vp`.`vp1alamat3` AS `vp1alamat3`,`vp`.`vp2alamat1` AS `vp2alamat1`,`vp`.`vp2alamat2` AS `vp2alamat2`,`vp`.`vp2alamat3` AS `vp2alamat3`,`vp`.`vpbagianpembayaran` AS `vpbagianpembayaran`,`vp`.`vpuraian` AS `vpuraian`,`vp`.`vpcatatan` AS `vpcatatan`,`vp`.`vpnoref` AS `vpnoref`,`vp`.`vptglnoref` AS `vptglnoref`,`vp`.`vpcarabayar` AS `vpcarabayar`,`vp`.`vptglbayar` AS `vptglbayar`,`vp`.`vpmatauang` AS `vpmatauang`,`vp`.`vpkurs` AS `vpkurs`,`vp`.`vptotalap` AS `vptotalap`,`vp`.`vptotalapvalas` AS `vptotalapvalas`,`vp`.`vptotalar` AS `vptotalar`,`vp`.`vptotalarvalas` AS `vptotalarvalas`,`vp`.`vpbayar` AS `vpbayar`,`vp`.`vpbayarvalas` AS `vpbayarvalas`,`vp`.`vpselisihkurs` AS `vpselisihkurs`,`vp`.`vprekselisihkurs` AS `vprekselisihkurs`,`vp`.`vpdiskontermin` AS `vpdiskontermin`,`vp`.`vpdiskonterminvalas` AS `vpdiskonterminvalas`,`vp`.`vprekdiskontermin` AS `vprekdiskontermin`,`vp`.`vpidvpp` AS `vpidvpp`,`vp`.`vpstatus` AS `vpstatus`,`vp`.`vpstatussebelumnya` AS `vpstatussebelumnya`,`vp`.`vpjmlrevisi` AS `vpjmlrevisi`,`vp`.`vpcetakanke` AS `vpcetakanke`,`vp`.`vpinputuser` AS `vpinputuser`,`vp`.`vpinputtgl` AS `vpinputtgl`,`vp`.`vpmodifikasiuser` AS `vpmodifikasiuser`,`vp`.`vpmodifikasitgl` AS `vpmodifikasitgl`,`vp`.`vpposting` AS `vpposting`,`vp`.`vppostingtgl` AS `vppostingtgl`,`vp`.`vpisclose` AS `vpisclose`,`vp`.`vpcustomtext1` AS `vpcustomtext1`,`vp`.`vpcustomtext2` AS `vpcustomtext2`,`vp`.`vpcustomtext3` AS `vpcustomtext3`,`vp`.`vpcustomtext4` AS `vpcustomtext4`,`vp`.`vpcustomtext5` AS `vpcustomtext5`,`vp`.`vpcustomint1` AS `vpcustomint1`,`vp`.`vpcustomint2` AS `vpcustomint2`,`vp`.`vpcustomint3` AS `vpcustomint3`,`vp`.`vpcustomdbl1` AS `vpcustomdbl1`,`vp`.`vpcustomdbl2` AS `vpcustomdbl2`,`vp`.`vpcustomdbl3` AS `vpcustomdbl3`,`vp`.`vpcustomdate1` AS `vpcustomdate1`,`vp`.`vpcustomdate2` AS `vpcustomdate2`,`vp`.`vpcustomdate3` AS `vpcustomdate3`,`br`.`bnama` AS `vpcabangnama`,`lc`.`lnama` AS `vplokasinama`,`wh`.`wnama` AS `vpgudangnama`,`c1`.`kkode` AS `vpsupplierkode`,`c1`.`knama` AS `vpsuppliernama`,`c2`.`kkode` AS `vpbagianpembayarankode`,`c2`.`knama` AS `vpbagianpembayarannama`,`pm`.`nama` AS `vpcarabayarnama`,`coa1`.`cnama` AS `vprekselisihkursnama`,`coa2`.`cnama` AS `vprekdiskonterminnama`,`vpp`.`vppnotransaksi` AS `vpnotransaksivpp`,`st1`.`nama` AS `vpstatusnama`,`st2`.`nama` AS `vpstatussebelumnyanama`,`u1`.`unama` AS `vpinputusernama`,`u2`.`unama` AS `vpmodifikasiusernama`,`vpd`.`idvpdetail` AS `idvpdetail`,`vpd`.`idvp` AS `idvp`,`vpd`.`sumber` AS `sumber`,`vpd`.`idtransaksi` AS `idtransaksi`,`vpd`.`matauang` AS `matauang`,`vpd`.`kurs` AS `kurs`,`vpd`.`totaltransaksi` AS `totaltransaksi`,`vpd`.`terbayar` AS `terbayar`,`vpd`.`sisa` AS `sisa`,`vpd`.`jmlbayar` AS `jmlbayar`,`vpd`.`jmlbayarvalas` AS `jmlbayarvalas`,`vpd`.`diskontermin` AS `diskontermin`,`vpd`.`jmldiskontermin` AS `jmldiskontermin`,`vpd`.`jmldiskonterminvalas` AS `jmldiskonterminvalas`,`vpd`.`rekhutangpiutang` AS `rekhutangpiutang`,`vpd`.`catatan` AS `catatan`,`vpd`.`costcenter` AS `costcenter`,`vpd`.`divisi` AS `divisi`,`vpd`.`subdivisi` AS `subdivisi`,`vpd`.`proyek` AS `proyek`,`vpd`.`idvppdetail` AS `idvppdetail`,`vpd`.`urutan` AS `urutan`,`vpd`.`isclose` AS `isclose`,`vpd`.`customtext1` AS `customtext1`,`vpd`.`customtext2` AS `customtext2`,`vpd`.`customtext3` AS `customtext3`,`vpd`.`customdbl1` AS `customdbl1`,`vpd`.`customdbl2` AS `customdbl2`,`vpd`.`customdbl3` AS `customdbl3`,`vpd`.`customdate1` AS `customdate1`,`vpd`.`customdate2` AS `customdate2`,`vpd`.`customdate3` AS `customdate3`,(case `vpd`.`sumber` when 'RI' then `ri`.`rinotransaksi` when 'AP' then `ap`.`apnotransaksi` when 'PRT' then `prt`.`prtnotransaksi` else '' end) AS `notransaksi`,(case `vpd`.`sumber` when 'RI' then `ri`.`ritgl` when 'AP' then `ap`.`aptgl` when 'PRT' then `prt`.`prttgl` else `vp`.`vptgl` end) AS `tgl`,(case `vpd`.`sumber` when 'RI' then `ri`.`ricarabayar` when 'AP' then 0 when 'PRT' then `prt`.`prtcarabayar` else `vp`.`vpcarabayar` end) AS `carabayar`,(case `vpd`.`sumber` when 'RI' then `ri`.`ritermin` when 'AP' then `ap`.`aptermin` when 'PRT' then `prt`.`prttermin` else '' end) AS `termin`,(case `vpd`.`sumber` when 'RI' then `ri`.`ritgljatuhtempo` when 'AP' then `ap`.`aptgljatuhtempo` when 'PRT' then `prt`.`prttgljatuhtempo` else `vp`.`vptgl` end) AS `tgljatuhtempo`,`vpd`.`rencana` AS `rencana`, (case `vpd`.`sumber` when 'RI' then `ri`.`ristatuslunas` when 'AP' then `ap`.`apstatusbayar` when 'PRT' then `prt`.`prtstatuslunas` else 0 end) AS `statuslunas`, `tr`.`trdiskon1` AS `diskon1`,`tr`.`trharidiskon1` AS `haridiskon1`,`tr`.`trdiskon2` AS `diskon2`,`tr`.`trharidiskon2` AS `haridiskon2`, `coa3`.`cnama` AS `rekhutangpiutangnama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`, `p`.`pnama` AS `proyeknama`,`vpp2`.`vppnotransaksi` AS `vppnotransaksi`, (case `vpd`.`sumber` when 'RI' then `ri`.`riinputtgl` when 'AP' then `ap`.`apinputtgl` when 'PRT' then `prt`.`prtinputtgl` else `vp`.`vpinputtgl` end) AS `inputtgl`, c1.kpkp, (case `vpd`.`sumber` when 'RI' then `ri`.`rinoref` when 'AP' then `ap`.`apnoref` when 'PRT' then `prt`.`prtnoref` else `vp`.`vpnoref` end) AS `noref` from (((((((((((((((((((((((((`m4_vp` `vp` join `m4_vp_detail` `vpd` on((`vp`.`vpid` = `vpd`.`idvp`))) left join `m1_branch` `br` on((`br`.`bkode` = `vp`.`vpcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `vp`.`vplokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `vp`.`vpgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `vp`.`vpsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `vp`.`vpbagianpembayaran`))) left join `m0_payment_method` `pm` on((`vp`.`vpcarabayar` = `pm`.`kode`))) left join `m1_coa` `coa1` on((`vp`.`vprekselisihkurs` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`vp`.`vprekdiskontermin` = `coa2`.`cnomor`))) left join `m4_vpp` `vpp` on((`vp`.`vpidvpp` = `vpp`.`vppid`))) left join `m0_status` `st1` on((`st1`.`kode` = `vp`.`vpstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `vp`.`vpstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `vp`.`vpinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `vp`.`vpmodifikasiuser`))) left join `m4_ri` `ri` on(((`vpd`.`sumber` = 'RI') and (`vpd`.`idtransaksi` = `ri`.`riid`)))) left join `m4_ap` `ap` on(((`vpd`.`sumber` = 'AP') and (`vpd`.`idtransaksi` = `ap`.`apid`)))) left join `m4_prt` `prt` on(((`vpd`.`sumber` = 'PRT') and (`vpd`.`idtransaksi` = `prt`.`prtid`)))) left join `m1_coa` `coa3` on((`vpd`.`rekhutangpiutang` = `coa3`.`cnomor`))) left join `m1_cost_center` `cc` on((`vpd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`vpd`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`vpd`.`subdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`vpd`.`proyek` = `p`.`pkode`))) left join `m4_vpp_detail` `vppd` on((`vpd`.`idvppdetail` = `vppd`.`idvppdetail`))) left join `m4_vpp` `vpp2` on((`vppd`.`idvpp` = `vpp2`.`vppid`))) left join `m1_terms` `tr` on((case `vpd`.`sumber` when 'RI' then (`ri`.`ritermin` = `tr`.`trkode`) when 'AP' then (`ap`.`aptermin` = `tr`.`trkode`) when 'PRT' then (`prt`.`prttermin` = `tr`.`trkode`) end)))
```

## Query 43

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_vp_terkait`

```sql
select `vp`.`vpid` AS `vpid`,`vp`.`vpnotransaksi` AS `vpnotransaksi`,`vpp`.`vppsumber` AS `sumber`,`vpp`.`vppid` AS `idterkait`,`vpp`.`vppnotransaksi` AS `noterkait`,`vpp`.`vpptgl` AS `tglterkait`,`vpp`.`vppinputtgl` AS `inputtglterkait`,`vpp`.`vppmodifikasitgl` AS `modifikasitglterkait`,0 AS `jenisterkait` from (((`m4_vpp_detail` `vppd` join `m4_vpp` `vpp` on((`vppd`.`idvpp` = `vpp`.`vppid`))) join `m4_vp_detail` `vpd` on((`vppd`.`idvppdetail` = `vpd`.`idvppdetail`))) join `m4_vp` `vp` on((`vpd`.`idvp` = `vp`.`vpid`))) where (`vp`.`vpid` = 'validtransaksi') group by `vpp`.`vppid`,`vp`.`vpid` union all select `vp`.`vpid` AS `vpid`,`vp`.`vpnotransaksi` AS `vpnotransaksi`,`sg`.`sgsumber` AS `sumber`,`sg`.`sgid` AS `idterkait`,`sg`.`sgnotransaksi` AS `noterkait`,`sg`.`sgtgl` AS `tglterkait`,`sg`.`sginputtgl` AS `inputtglterkait`,`sg`.`sgmodifikasitgl` AS `modifikasitglterkait`,1 AS `jenisterkait` from (((`m4_vp` `vp` join `m2_giro_list` `gl` on((`vp`.`vpnotransaksi` = `gl`.`glnotransaksi`))) join `m2_sg_detail` `sgd` on((`gl`.`glnogiro` = `sgd`.`nogiro`))) join `m2_sg` `sg` on((`sgd`.`idsg` = `sg`.`sgid`))) where (((`sg`.`sgstatus` = 2) or (`sg`.`sgstatus` = 3) or (`sg`.`sgstatus` = 4) or (`sg`.`sgstatus` = 7)) and (`vp`.`vpid` = 'validtransaksi')) group by `sg`.`sgid`,`vp`.`vpid` union all select `vp`.`vpid` AS `vpid`,`vp`.`vpnotransaksi` AS `vpnotransaksi`,`sgc`.`sgcsumber` AS `sumber`,`sgc`.`sgcid` AS `idterkait`,`sgc`.`sgcnotransaksi` AS `noterkait`,`sgc`.`sgctgl` AS `tglterkait`,`sgc`.`sgcinputtgl` AS `inputtglterkait`,`sgc`.`sgcmodifikasitgl` AS `modifikasitglterkait`,1 AS `jenisterkait` from (((`m4_vp` `vp` join `m2_giro_list` `gl` on((`vp`.`vpnotransaksi` = `gl`.`glnotransaksi`))) join `m2_sgc_detail` `sgcd` on((`gl`.`glnogiro` = `sgcd`.`nogiro`))) join `m2_sgc` `sgc` on((`sgcd`.`idsgc` = `sgc`.`sgcid`))) where (((`sgc`.`sgcstatus` = 2) or (`sgc`.`sgcstatus` = 3) or (`sgc`.`sgcstatus` = 4) or (`sgc`.`sgcstatus` = 7)) and (`vp`.`vpid` = 'validtransaksi')) group by `sgc`.`sgcid`,`vp`.`vpid`
```

## Query 44

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_vp_v_history`

```sql
select `vp`.`vpidhistory` AS `vpidhistory`,`vp`.`vpid` AS `vpid`,`vp`.`vpcabang` AS `vpcabang`,`vp`.`vplokasi` AS `vplokasi`,`vp`.`vpgudang` AS `vpgudang`,`vp`.`vpsumber` AS `vpsumber`,`vp`.`vpautonotransaksi` AS `vpautonotransaksi`,`vp`.`vpnotransaksi` AS `vpnotransaksi`,`vp`.`vptgl` AS `vptgl`,`vp`.`vpkodepa` AS `vpkodepa`,`vp`.`vpsupplier` AS `vpsupplier`,`vp`.`vpsupplierkontak` AS `vpsupplierkontak`,`vp`.`vp1alamat1` AS `vp1alamat1`,`vp`.`vp1alamat2` AS `vp1alamat2`,`vp`.`vp1alamat3` AS `vp1alamat3`,`vp`.`vp2alamat1` AS `vp2alamat1`,`vp`.`vp2alamat2` AS `vp2alamat2`,`vp`.`vp2alamat3` AS `vp2alamat3`,`vp`.`vpbagianpembayaran` AS `vpbagianpembayaran`,`vp`.`vpuraian` AS `vpuraian`,`vp`.`vpcatatan` AS `vpcatatan`,`vp`.`vpnoref` AS `vpnoref`,`vp`.`vptglnoref` AS `vptglnoref`,`vp`.`vpcarabayar` AS `vpcarabayar`,`vp`.`vptglbayar` AS `vptglbayar`,`vp`.`vpmatauang` AS `vpmatauang`,`vp`.`vpkurs` AS `vpkurs`,`vp`.`vptotalap` AS `vptotalap`,`vp`.`vptotalapvalas` AS `vptotalapvalas`,`vp`.`vptotalar` AS `vptotalar`,`vp`.`vptotalarvalas` AS `vptotalarvalas`,`vp`.`vpbayar` AS `vpbayar`,`vp`.`vpbayarvalas` AS `vpbayarvalas`,`vp`.`vpselisihkurs` AS `vpselisihkurs`,`vp`.`vprekselisihkurs` AS `vprekselisihkurs`,`vp`.`vpdiskontermin` AS `vpdiskontermin`,`vp`.`vpdiskonterminvalas` AS `vpdiskonterminvalas`,`vp`.`vprekdiskontermin` AS `vprekdiskontermin`,`vp`.`vpidvpp` AS `vpidvpp`,`vp`.`vpstatus` AS `vpstatus`,`vp`.`vpstatussebelumnya` AS `vpstatussebelumnya`,`vp`.`vpjmlrevisi` AS `vpjmlrevisi`,`vp`.`vpcetakanke` AS `vpcetakanke`,`vp`.`vpinputuser` AS `vpinputuser`,`vp`.`vpinputtgl` AS `vpinputtgl`,`vp`.`vpmodifikasiuser` AS `vpmodifikasiuser`,`vp`.`vpmodifikasitgl` AS `vpmodifikasitgl`,`vp`.`vpposting` AS `vpposting`,`vp`.`vppostingtgl` AS `vppostingtgl`,`vp`.`vpisclose` AS `vpisclose`,`br`.`bnama` AS `vpcabangnama`,`lc`.`lnama` AS `vplokasinama`,`wh`.`wnama` AS `vpgudangnama`,`c1`.`kkode` AS `vpsupplierkode`,`c1`.`knama` AS `vpsuppliernama`,`c2`.`kkode` AS `vpbagianpembayarankode`,`c2`.`knama` AS `vpbagianpembayarannama`,`pm`.`nama` AS `vpcarabayarnama`,`coa1`.`cnama` AS `vprekselisihkursnama`,`coa2`.`cnama` AS `vprekdiskonterminnama`,`vpp`.`vppnotransaksi` AS `vppnotransaksi`,`st1`.`nama` AS `vpstatusnama`,`st2`.`nama` AS `vpstatussebelumnyanama`,`u1`.`unama` AS `vpinputusernama`,`u2`.`unama` AS `vpmodifikasiusernama` from (((((((((((((`m4_vp_history` `vp` left join `m1_branch` `br` on((`br`.`bkode` = `vp`.`vpcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `vp`.`vplokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `vp`.`vpgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `vp`.`vpsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `vp`.`vpbagianpembayaran`))) left join `m0_payment_method` `pm` on((`vp`.`vpcarabayar` = `pm`.`kode`))) left join `m1_coa` `coa1` on((`vp`.`vprekselisihkurs` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`vp`.`vprekdiskontermin` = `coa2`.`cnomor`))) left join `m4_vpp` `vpp` on((`vp`.`vpidvpp` = `vpp`.`vppid`))) left join `m0_status` `st1` on((`st1`.`kode` = `vp`.`vpstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `vp`.`vpstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `vp`.`vpinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `vp`.`vpmodifikasiuser`)))
```

## Query 45

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_vp_getdata_history`

```sql
select `vp`.`vpidhistory` AS `vpidhistory`,`vp`.`vpid` AS `vpid`,`vp`.`vpcabang` AS `vpcabang`,`vp`.`vplokasi` AS `vplokasi`,`vp`.`vpgudang` AS `vpgudang`,`vp`.`vpsumber` AS `vpsumber`,`vp`.`vpautonotransaksi` AS `vpautonotransaksi`,`vp`.`vpnotransaksi` AS `vpnotransaksi`,`vp`.`vptgl` AS `vptgl`,`vp`.`vpkodepa` AS `vpkodepa`,`vp`.`vpsupplier` AS `vpsupplier`,`vp`.`vpsupplierkontak` AS `vpsupplierkontak`,`vp`.`vp1alamat1` AS `vp1alamat1`,`vp`.`vp1alamat2` AS `vp1alamat2`,`vp`.`vp1alamat3` AS `vp1alamat3`,`vp`.`vp2alamat1` AS `vp2alamat1`,`vp`.`vp2alamat2` AS `vp2alamat2`,`vp`.`vp2alamat3` AS `vp2alamat3`,`vp`.`vpbagianpembayaran` AS `vpbagianpembayaran`,`vp`.`vpuraian` AS `vpuraian`,`vp`.`vpcatatan` AS `vpcatatan`,`vp`.`vpnoref` AS `vpnoref`,`vp`.`vptglnoref` AS `vptglnoref`,`vp`.`vpcarabayar` AS `vpcarabayar`,`vp`.`vptglbayar` AS `vptglbayar`,`vp`.`vpmatauang` AS `vpmatauang`,`vp`.`vpkurs` AS `vpkurs`,`vp`.`vptotalap` AS `vptotalap`,`vp`.`vptotalapvalas` AS `vptotalapvalas`,`vp`.`vptotalar` AS `vptotalar`,`vp`.`vptotalarvalas` AS `vptotalarvalas`,`vp`.`vpbayar` AS `vpbayar`,`vp`.`vpbayarvalas` AS `vpbayarvalas`,`vp`.`vpselisihkurs` AS `vpselisihkurs`,`vp`.`vprekselisihkurs` AS `vprekselisihkurs`,`vp`.`vpdiskontermin` AS `vpdiskontermin`,`vp`.`vpdiskonterminvalas` AS `vpdiskonterminvalas`,`vp`.`vprekdiskontermin` AS `vprekdiskontermin`,`vp`.`vpidvpp` AS `vpidvpp`,`vp`.`vpstatus` AS `vpstatus`,`vp`.`vpstatussebelumnya` AS `vpstatussebelumnya`,`vp`.`vpjmlrevisi` AS `vpjmlrevisi`,`vp`.`vpcetakanke` AS `vpcetakanke`,`vp`.`vpinputuser` AS `vpinputuser`,`vp`.`vpinputtgl` AS `vpinputtgl`,`vp`.`vpmodifikasiuser` AS `vpmodifikasiuser`,`vp`.`vpmodifikasitgl` AS `vpmodifikasitgl`,`vp`.`vpposting` AS `vpposting`,`vp`.`vppostingtgl` AS `vppostingtgl`,`vp`.`vpisclose` AS `vpisclose`,`vp`.`vpcustomtext1` AS `vpcustomtext1`,`vp`.`vpcustomtext2` AS `vpcustomtext2`,`vp`.`vpcustomtext3` AS `vpcustomtext3`,`vp`.`vpcustomtext4` AS `vpcustomtext4`,`vp`.`vpcustomtext5` AS `vpcustomtext5`,`vp`.`vpcustomint1` AS `vpcustomint1`,`vp`.`vpcustomint2` AS `vpcustomint2`,`vp`.`vpcustomint3` AS `vpcustomint3`,`vp`.`vpcustomdbl1` AS `vpcustomdbl1`,`vp`.`vpcustomdbl2` AS `vpcustomdbl2`,`vp`.`vpcustomdbl3` AS `vpcustomdbl3`,`vp`.`vpcustomdate1` AS `vpcustomdate1`,`vp`.`vpcustomdate2` AS `vpcustomdate2`,`vp`.`vpcustomdate3` AS `vpcustomdate3`,`br`.`bnama` AS `vpcabangnama`,`lc`.`lnama` AS `vplokasinama`,`wh`.`wnama` AS `vpgudangnama`,`c1`.`kkode` AS `vpsupplierkode`,`c1`.`knama` AS `vpsuppliernama`,`c2`.`kkode` AS `vpbagianpembayarankode`,`c2`.`knama` AS `vpbagianpembayarannama`,`pm`.`nama` AS `vpcarabayarnama`,`coa1`.`cnama` AS `vprekselisihkursnama`,`coa2`.`cnama` AS `vprekdiskonterminnama`,`vpp`.`vppnotransaksi` AS `vpnotransaksivpp`,`st1`.`nama` AS `vpstatusnama`,`st2`.`nama` AS `vpstatussebelumnyanama`,`u1`.`unama` AS `vpinputusernama`,`u2`.`unama` AS `vpmodifikasiusernama`,`vpd`.`idhistorydetail` AS `idhistorydetail`,`vpd`.`idhistory` AS `idhistory`,`vpd`.`idvpdetail` AS `idvpdetail`,`vpd`.`idvp` AS `idvp`,`vpd`.`sumber` AS `sumber`,`vpd`.`idtransaksi` AS `idtransaksi`,`vpd`.`matauang` AS `matauang`,`vpd`.`kurs` AS `kurs`,`vpd`.`totaltransaksi` AS `totaltransaksi`,`vpd`.`terbayar` AS `terbayar`,`vpd`.`sisa` AS `sisa`,`vpd`.`jmlbayar` AS `jmlbayar`,`vpd`.`jmlbayarvalas` AS `jmlbayarvalas`,`vpd`.`diskontermin` AS `diskontermin`,`vpd`.`jmldiskontermin` AS `jmldiskontermin`,`vpd`.`jmldiskonterminvalas` AS `jmldiskonterminvalas`,`vpd`.`rekhutangpiutang` AS `rekhutangpiutang`,`vpd`.`catatan` AS `catatan`,`vpd`.`costcenter` AS `costcenter`,`vpd`.`divisi` AS `divisi`,`vpd`.`subdivisi` AS `subdivisi`,`vpd`.`proyek` AS `proyek`,`vpd`.`idvppdetail` AS `idvppdetail`,`vpd`.`urutan` AS `urutan`,`vpd`.`isclose` AS `isclose`,`vpd`.`customtext1` AS `customtext1`,`vpd`.`customtext2` AS `customtext2`,`vpd`.`customtext3` AS `customtext3`,`vpd`.`customdbl1` AS `customdbl1`,`vpd`.`customdbl2` AS `customdbl2`,`vpd`.`customdbl3` AS `customdbl3`,`vpd`.`customdate1` AS `customdate1`,`vpd`.`customdate2` AS `customdate2`,`vpd`.`customdate3` AS `customdate3`,(case `vpd`.`sumber` when 'RI' then `ri`.`rinotransaksi` when 'AP' then `ap`.`apnotransaksi` when 'PRT' then `prt`.`prtnotransaksi` else '' end) AS `notransaksi`,(case `vpd`.`sumber` when 'RI' then `ri`.`ritgl` when 'AP' then `ap`.`aptgl` when 'PRT' then `prt`.`prttgl` else `vp`.`vptgl` end) AS `tgl`,(case `vpd`.`sumber` when 'RI' then `ri`.`ricarabayar` when 'AP' then 0 when 'PRT' then `prt`.`prtcarabayar` else `vp`.`vpcarabayar` end) AS `carabayar`,(case `vpd`.`sumber` when 'RI' then `ri`.`ritermin` when 'AP' then `ap`.`aptermin` when 'PRT' then `prt`.`prttermin` else '' end) AS `termin`,(case `vpd`.`sumber` when 'RI' then `ri`.`ritgljatuhtempo` when 'AP' then `ap`.`aptgljatuhtempo` when 'PRT' then `prt`.`prttgljatuhtempo` else `vp`.`vptgl` end) AS `tgljatuhtempo`, `vpd`.`rencana` AS `rencana`,(case `vpd`.`sumber` when 'RI' then `ri`.`ristatuslunas` when 'AP' then `ap`.`apstatusbayar` when 'PRT' then `prt`.`prtstatuslunas` else 0 end) AS `statuslunas`,`tr`.`trdiskon1` AS `diskon1`,`tr`.`trharidiskon1` AS `haridiskon1`,`tr`.`trdiskon2` AS `diskon2`,`tr`.`trharidiskon2` AS `haridiskon2`,`coa3`.`cnama` AS `rekhutangpiutangnama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama`,`vpp2`.`vppnotransaksi` AS `vppnotransaksi`,(case `vpd`.`sumber` when 'RI' then `ri`.`riinputtgl` when 'AP' then `ap`.`apinputtgl` when 'PRT' then `prt`.`prtinputtgl` else `vp`.`vpinputtgl` end) AS `inputtgl` from (((((((((((((((((((((((((`m4_vp_history` `vp` join `m4_vp_detail_history` `vpd` on((`vp`.`vpidhistory` = `vpd`.`idhistory`))) left join `m1_branch` `br` on((`br`.`bkode` = `vp`.`vpcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `vp`.`vplokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `vp`.`vpgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `vp`.`vpsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `vp`.`vpbagianpembayaran`))) left join `m0_payment_method` `pm` on((`vp`.`vpcarabayar` = `pm`.`kode`))) left join `m1_coa` `coa1` on((`vp`.`vprekselisihkurs` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`vp`.`vprekdiskontermin` = `coa2`.`cnomor`))) left join `m4_vpp` `vpp` on((`vp`.`vpidvpp` = `vpp`.`vppid`))) left join `m0_status` `st1` on((`st1`.`kode` = `vp`.`vpstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `vp`.`vpstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `vp`.`vpinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `vp`.`vpmodifikasiuser`))) left join `m4_ri` `ri` on(((`vpd`.`sumber` = 'RI') and (`vpd`.`idtransaksi` = `ri`.`riid`)))) left join `m4_ap` `ap` on(((`vpd`.`sumber` = 'AP') and (`vpd`.`idtransaksi` = `ap`.`apid`)))) left join `m4_prt` `prt` on(((`vpd`.`sumber` = 'PRT') and (`vpd`.`idtransaksi` = `prt`.`prtid`)))) left join `m1_coa` `coa3` on((`vpd`.`rekhutangpiutang` = `coa3`.`cnomor`))) left join `m1_cost_center` `cc` on((`vpd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`vpd`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`vpd`.`subdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`vpd`.`proyek` = `p`.`pkode`))) left join `m4_vpp_detail` `vppd` on((`vpd`.`idvppdetail` = `vppd`.`idvppdetail`))) left join `m4_vpp` `vpp2` on((`vppd`.`idvpp` = `vpp2`.`vppid`))) left join `m1_terms` `tr` on((case `vpd`.`sumber` when 'RI' then (`ri`.`ritermin` = `tr`.`trkode`) when 'AP' then (`ap`.`aptermin` = `tr`.`trkode`) when 'PRT' then (`prt`.`prttermin` = `tr`.`trkode`) end)))
```

## Query 46

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vp.vb`, `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_vp_getdata_pay`

```sql
select `vpp`.`idvpcarabayar` AS `idvpcarabayar`,`vpp`.`idvp` AS `idvp`,`vpp`.`carabayar` AS `carabayar`,`vpp`.`matauang` AS `matauang`,`vpp`.`kurs` AS `kurs`,`vpp`.`jumlah` AS `jumlah`,`vpp`.`jumlahvalas` AS `jumlahvalas`,`vpp`.`nogiro` AS `nogiro`,`vpp`.`tgljt` AS `tgljt`,`vpp`.`bank` AS `bank`,`vpp`.`noacbank` AS `noacbank`,`vpp`.`rekbank` AS `rekbank`,`vpp`.`rekgiro` AS `rekgiro`,`vpp`.`catatan` AS `catatan`,`vpp`.`urutan` AS `urutan`,`vpp`.`idvppcarabayar` AS `idvppcarabayar`,`vpp`.`isclose` AS `isclose`,`pm`.`nama` AS `carabayarnama`,`b`.`bnama` AS `banknama`,`coa1`.`cnama` AS `rekbanknama`,`coa2`.`cnama` AS `rekgironama` from ((((`m4_vp_pay` `vpp` left join `m0_payment_method` `pm` on((`vpp`.`carabayar` = `pm`.`kode`))) left join `m1_bank` `b` on((`vpp`.`bank` = `b`.`bkode`))) left join `m1_coa` `coa1` on((`vpp`.`rekbank` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`vpp`.`rekgiro` = `coa2`.`cnomor`)))
```

