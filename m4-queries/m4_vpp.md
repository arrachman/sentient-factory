# M4_VPP Queries

## Query 1

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp.vb`

```sql
DELETE FROM M4_Vpp WHERE vppid='{idtransaksi}'
```

## Query 2

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp.vb`

```sql
DELETE FROM M4_Vpp_Detail WHERE idvpp='{idtransaksi}'
```

## Query 3

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp.vb`

```sql
DELETE FROM M4_Vpp_Pay WHERE idvpp='{idtransaksi}'
```

## Query 4

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp.vb`

```sql
Delete from M4_Vpp_Detail where idvpp = '{result_4}'
```

## Query 5

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp.vb`

```sql
Delete from M4_Vpp_Pay where idvpp = '{result_4}'
```

## Query 6

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp_history.vb`

```sql
INSERT INTO m4_vpp_detail_history (SELECT 0, '{result_4}', vpp.* FROM m4_vpp_detail vpp WHERE vpp.idvpp = '{idtransaksi}' )
```

## Query 7

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp_history.vb`

```sql
INSERT INTO m4_vpp_history(SELECT 0, vpp.* FROM m4_vpp vpp WHERE vpp.vppid = '{idtransaksi}')
```

## Query 8

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp_history.vb`

```sql
INSERT INTO m4_vpp_pay_history (SELECT 0, '{result_4}', vpp.* FROM m4_vpp_pay vpp WHERE vpp.idvpp = '{idtransaksi}' )
```

## Query 9

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp.vb`

```sql
Insert into M0_Userlog (uluserid, ulidmodule, ulidmenu, uljenisaktivitas, ulaktivitas, ultgl, ulkodepa) values({userid}, {mdlid}, {mnid}, {jnsaktivitas}, '{notransaksi}', NOW(), {0})
```

## Query 10

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp.vb`

```sql
Insert into M4_Vpp (vppcabang, vpplokasi, vppgudang, vppsumber, vppautonotransaksi, vppnotransaksi, vpptgl, vppkodepa, vppsupplier, vppsupplierkontak, vpp1alamat1, vpp1alamat2, vpp1alamat3, vpp2alamat1, vpp2alamat2, vpp2alamat3, vppbagianpembayaran, vppuraian, vppcatatan, vppnoref, vpptglnoref, vppcarabayar, vpptglbayar, vppmatauang, vppkurs, vpptotalap, vpptotalapvalas, vpptotalar, vpptotalarvalas, vppbayar, vppbayarvalas, vppselisihkurs, vpprekselisihkurs, vppdiskontermin, vppdiskonterminvalas, vpprekdiskontermin, vppstatusvp, vppstatus, vppstatussebelumnya, vppjmlrevisi, vppcetakanke, vppinputuser, vppinputtgl, vppmodifikasiuser, vppmodifikasitgl, vppisclose, vppcustomtext1, vppcustomtext2, vppcustomtext3, vppcustomtext4, vppcustomtext5, vppcustomint1, vppcustomint2, vppcustomint3, vppcustomdbl1, vppcustomdbl2, vppcustomdbl3, vppcustomdate1, vppcustomdate2, vppcustomdate3) values('{vppcabang}', '{vpplokasi}', '{vppgudang}', '{vppsumber}', {vppautonotransaksi}, '{notransaksi}', '{vpptgl}', {vppkodepa}, {vppsupplier}, '{vppsupplierkontak}', '{vpp1alamat1}', '{vpp1alamat2}', '{vpp1alamat3}', '{vpp2alamat1}', '{vpp2alamat2}', '{vpp2alamat3}', {vppbagianpembayaran}, '{vppuraian}', '{vppcatatan}', '{vppnoref}', '{vpptglnoref}', {vppcarabayar}, '{vpptglbayar}', '{vppmatauang}', '{vppkurs}', '{vpptotalap}', '{vpptotalapvalas}', '{vpptotalar}', '{vpptotalarvalas}', '{vppbayar}', '{vppbayarvalas}', '{vppselisihkurs}', '{vpprekselisihkurs}', '{vppdiskontermin}', '{vppdiskonterminvalas}', '{vpprekdiskontermin}', {vppstatusvp}, {vppstatus}, {vppstatussebelumnya}, {vppjmlrevisi}, {vppcetakanke}, {vppinputuser}, NOW(), {vppmodifikasiuser}, '1971-01-01 00:00:00', {vppisclose}, '{vppcustomtext1}', '{vppcustomtext2}', '{vppcustomtext3}', '{vppcustomtext4}', '{vppcustomtext5}', {vppcustomint1}, {vppcustomint2}, {vppcustomint3}, '{vppcustomdbl1}', '{vppcustomdbl2}', '{vppcustomdbl3}', '{vppcustomdate1}', '{vppcustomdate2}', '{vppcustomdate3}')
```

## Query 11

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp.vb`

```sql
Insert into M4_Vpp_Detail(idvppdetail, idvpp, sumber, idtransaksi, matauang, kurs, totaltransaksi, terbayar, rencana, sisa, jmlbayar, jmlbayarvalas, diskontermin, jmldiskontermin, jmldiskonterminvalas, rekhutangpiutang, catatan, costcenter, divisi, subdivisi, proyek, jmlvp, jmlvpvalas, statusvp, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2.ToString}
```

## Query 12

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp.vb`

```sql
Insert into M4_Vpp_Pay(idvppcarabayar, idvpp, carabayar, matauang, kurs, jumlah, jumlahvalas, nogiro, tgljt, bank, noacbank, rekbank, rekgiro, catatan, urutan, jmlvp, jmlvpvalas, statusvp, isclose) values{strValue2.ToString}
```

## Query 13

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp.vb`

```sql
SELECT ap.apid, ap.apsumber, ap.apnotransaksi, vpp.vppnotransaksi FROM m4_ap ap JOIN m4_vpp_detail vppd ON ap.apsumber = vppd.sumber AND ap.apid = vppd.idtransaksi AND ({updFilterAP}) JOIN m4_vpp vpp ON vppd.idvpp = vpp.vppid AND vpp.vppstatus IN(2,3,4,7) GROUP BY ap.apid, vpp.vppid
```

## Query 14

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp.vb`

```sql
SELECT prt.prtid, prt.prtsumber, prt.prtnotransaksi, vpp.vppnotransaksi FROM m4_prt prt JOIN m4_vpp_detail vppd ON prt.prtsumber = vppd.sumber AND prt.prtid = vppd.idtransaksi AND ({updFilterPRT}) JOIN m4_vpp vpp ON vppd.idvpp = vpp.vppid AND vpp.vppstatus IN(2,3,4,7) GROUP BY prt.prtid, vpp.vppid
```

## Query 15

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp.vb`

```sql
SELECT ri.riid, ri.risumber, ri.rinotransaksi, vpp.vppnotransaksi FROM m4_ri ri JOIN m4_vpp_detail vppd ON ri.risumber = vppd.sumber AND ri.riid = vppd.idtransaksi AND ({updFilterRI}) JOIN m4_vpp vpp ON vppd.idvpp = vpp.vppid AND vpp.vppstatus IN(2,3,4,7) GROUP BY ri.riid, vpp.vppid
```

## Query 16

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp.vb`

```sql
SELECT vppcabang, vpplokasi, vppsumber, vppautonotransaksi, vppnotransaksi, vpptgl FROM M4_vpp WHERE vppid = '{idtransaksi}'
```

## Query 17

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp_history.vb`

```sql
SELECT vppidhistory FROM m4_vpp_history WHERE vppid = '{idtransaksi}' ORDER BY vppmodifikasitgl DESC LIMIT 1
```

## Query 18

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp.vb`

```sql
UPDATE M4_Vpp SET Vppstatus = {nilaiStatus}, Vppmodifikasiuser='{userid}', Vppmodifikasitgl = NOW(), Vppposting = 0, Vpppostingtgl = '1971-01-01 00:00:00', Vppjmlrevisi = Vppjmlrevisi + 1 WHERE Vppid = '{idtransaksi}'
```

## Query 19

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp.vb`

```sql
UPDATE m4_ap ap SET ap.apstatusvpp = 0 WHERE {updFilterAP}
```

## Query 20

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp.vb`

```sql
UPDATE m4_ap ap SET ap.apstatusvpp = 1 WHERE {updFilterAP}
```

## Query 21

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp.vb`

```sql
UPDATE m4_prt prt SET prt.prtstatusvpp = 0 WHERE {updFilterPRT}
```

## Query 22

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp.vb`

```sql
UPDATE m4_prt prt SET prt.prtstatusvpp = 1 WHERE {updFilterPRT}
```

## Query 23

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp.vb`

```sql
UPDATE m4_ri ri SET ri.ristatusvpp = 0 WHERE {updFilterRI}
```

## Query 24

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp.vb`

```sql
UPDATE m4_ri ri SET ri.ristatusvpp = 1 WHERE {updFilterRI}
```

## Query 25

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp.vb`

```sql
Update M4_Vpp set vppcabang = '{vppcabang}', vpplokasi = '{vpplokasi}', vppgudang = '{vppgudang}', vppsumber = '{vppsumber}', vppautonotransaksi = {vppautonotransaksi}, vppnotransaksi = '{notransaksi}', vpptgl = '{vpptgl}', vppkodepa = {vppkodepa}, vppsupplier = {vppsupplier}, vppsupplierkontak = '{vppsupplierkontak}', vpp1alamat1 = '{vpp1alamat1}', vpp1alamat2 = '{vpp1alamat2}', vpp1alamat3 = '{vpp1alamat3}', vpp2alamat1 = '{vpp2alamat1}', vpp2alamat2 = '{vpp2alamat2}', vpp2alamat3 = '{vpp2alamat3}', vppbagianpembayaran = {vppbagianpembayaran}, vppuraian = '{vppuraian}', vppcatatan = '{vppcatatan}', vppnoref = '{vppnoref}', vpptglnoref = '{vpptglnoref}', vppcarabayar = {vppcarabayar}, vpptglbayar = '{vpptglbayar}', vppmatauang = '{vppmatauang}', vppkurs = '{vppkurs}', vpptotalap = '{vpptotalap}', vpptotalapvalas = '{vpptotalapvalas}', vpptotalar = '{vpptotalar}', vpptotalarvalas = '{vpptotalarvalas}', vppbayar = '{vppbayar}', vppbayarvalas = '{vppbayarvalas}', vppselisihkurs = '{vppselisihkurs}', vpprekselisihkurs = '{vpprekselisihkurs}', vppdiskontermin = '{vppdiskontermin}', vppdiskonterminvalas = '{vppdiskonterminvalas}', vpprekdiskontermin = '{vpprekdiskontermin}', vppstatusvp = {vppstatusvp}, vppstatus = {vppstatus}, vppstatussebelumnya = {vppstatussebelumnya}, vppjmlrevisi = vppjmlrevisi+1, vppcetakanke = {vppcetakanke}, vppmodifikasiuser = {vppmodifikasiuser}, vppmodifikasitgl = NOW(), vppcustomtext1 = '{vppcustomtext1}', vppcustomtext2 = '{vppcustomtext2}', vppcustomtext3 = '{vppcustomtext3}', vppcustomtext4 = '{vppcustomtext4}', vppcustomtext5 = '{vppcustomtext5}', vppcustomint1 = {vppcustomint1}, vppcustomint2 = {vppcustomint2}, vppcustomint3 = {vppcustomint3}, vppcustomdbl1 = '{vppcustomdbl1}', vppcustomdbl2 = '{vppcustomdbl2}', vppcustomdbl3 = '{vppcustomdbl3}', vppcustomdate1 = '{vppcustomdate1}', vppcustomdate2 = '{vppcustomdate2}', vppcustomdate3 = '{vppcustomdate3}' where vppid = '{vppid}'
```

## Query 26

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_vpp_takedataOld`

```sql
select `ri`.`riid` AS `idtransaksi`,`ri`.`risumber` AS `sumber`,`ri`.`rinotransaksi` AS `notransaksi`,`ri`.`ritgl` AS `tgl`,`ri`.`risupplier` AS `kontak`,`ri`.`ricatatan` AS `catatan`,`ri`.`ricarabayar` AS `carabayar`,`ri`.`ritermin` AS `termin`,`ri`.`ritgljatuhtempo` AS `tgljatuhtempo`,`ri`.`rimatauang` AS `matauang`,`ri`.`rikurs` AS `kurs`,`ri`.`ritotaltransaksi` AS `totaltransaksi`,`ri`.`rijmlbayar` AS `terbayar`,(sum((`vppd`.`jmlbayar` - `vppd`.`jmlvp`)) / `ri`.`rikurs`) AS `rencana`,((`ri`.`ritotaltransaksi` - `ri`.`rijmlbayar`) * `ri`.`rikurs`) AS `sisa`,(case `ri`.`rimatauang` when `s2`.`snilai` then 0 else (`ri`.`ritotaltransaksi` - `ri`.`rijmlbayar`) end) AS `sisavalas`,`ri`.`ristatuslunas` AS `statuslunas`,`s`.`snilai` AS `rekhutangpiutang`,`tr`.`trdiskon1` AS `diskon1`,`tr`.`trharidiskon1` AS `haridiskon1`,`tr`.`trdiskon2` AS `diskon2`,`tr`.`trharidiskon2` AS `haridiskon2`,`ri`.`riinputtgl` AS `inputtgl` from ((((`m4_ri` `ri` left join `m1_terms` `tr` on((`ri`.`ritermin` = `tr`.`trkode`))) join `m0_setting` `s` on(((`s`.`smodule` = 0) and (`s`.`sgrup` = 'akun') and (`s`.`skode` = 'HutangUsaha')))) join `m0_setting` `s2` on(((`s2`.`smodule` = 0) and (`s2`.`sgrup` = 'accounting') and (`s2`.`skode` = 'MataUangFungsional')))) left join `m4_vpp_detail` `vppd` on(((`vppd`.`sumber` = 'RI') and (`vppd`.`idtransaksi` = `ri`.`riid`) and (`vppd`.`statusvp` <> 2)))) {filter1} group by `ri`.`riid`
```

## Query 27

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_vpp_cd`

```sql
select `vpp`.`vppid` AS `vppid`,`vpp`.`vppcabang` AS `vppcabang`,`vpp`.`vpplokasi` AS `vpplokasi`,`vpp`.`vppgudang` AS `vppgudang`,`vpp`.`vppnotransaksi` AS `vppnotransaksi`,`vpp`.`vpptgl` AS `vpptgl`,`vpp`.`vppsupplier` AS `vppsupplier`,`vpp`.`vppsupplierkontak` AS `vppsupplierkontak`,`vpp`.`vppbagianpembayaran` AS `vppbagianpembayaran`,`vpp`.`vppuraian` AS `vppuraian`,`vpp`.`vppcatatan` AS `vppcatatan`,`vpp`.`vppcarabayar` AS `vppcarabayar`,`vpp`.`vpptglbayar` AS `vpptglbayar`,`vpp`.`vppmatauang` AS `vppmatauang`,`vpp`.`vppkurs` AS `vppkurs`,`vpp`.`vpptotalap` AS `vpptotalap`,`vpp`.`vpptotalapvalas` AS `vpptotalapvalas`,`vpp`.`vpptotalar` AS `vpptotalar`,`vpp`.`vpptotalarvalas` AS `vpptotalarvalas`,`vpp`.`vppbayar` AS `vppbayar`,`vpp`.`vppbayarvalas` AS `vppbayarvalas`,`vpp`.`vppselisihkurs` AS `vppselisihkurs`,`vpp`.`vppdiskontermin` AS `vppdiskontermin`,`vpp`.`vppdiskonterminvalas` AS `vppdiskonterminvalas`,`c1`.`kkode` AS `vppsupplierkode`,`c1`.`knama` AS `vppsuppliernama`,`c2`.`kkode` AS `vppbagianpembayarankode`,`c2`.`knama` AS `vppbagianpembayarannama`,`pm`.`nama` AS `vppcarabayarnama` from (((`m4_vpp` `vpp` left join `m1_contact` `c1` on((`vpp`.`vppsupplier` = `c1`.`kid`))) left join `m1_contact` `c2` on((`vpp`.`vppbagianpembayaran` = `c2`.`kid`))) left join `m0_payment_method` `pm` on((`vpp`.`vppcarabayar` = `pm`.`kode`)))
```

## Query 28

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_vpp_v`

```sql
select `vpp`.`vppid` AS `vppid`,`vpp`.`vppcabang` AS `vppcabang`,`vpp`.`vpplokasi` AS `vpplokasi`,`vpp`.`vppgudang` AS `vppgudang`,`vpp`.`vppsumber` AS `vppsumber`,`vpp`.`vppautonotransaksi` AS `vppautonotransaksi`,`vpp`.`vppnotransaksi` AS `vppnotransaksi`,`vpp`.`vpptgl` AS `vpptgl`,`vpp`.`vppkodepa` AS `vppkodepa`,`vpp`.`vppsupplier` AS `vppsupplier`,`vpp`.`vppsupplierkontak` AS `vppsupplierkontak`,`vpp`.`vpp1alamat1` AS `vpp1alamat1`,`vpp`.`vpp1alamat2` AS `vpp1alamat2`,`vpp`.`vpp1alamat3` AS `vpp1alamat3`,`vpp`.`vpp2alamat1` AS `vpp2alamat1`,`vpp`.`vpp2alamat2` AS `vpp2alamat2`,`vpp`.`vpp2alamat3` AS `vpp2alamat3`,`vpp`.`vppbagianpembayaran` AS `vppbagianpembayaran`,`vpp`.`vppuraian` AS `vppuraian`,`vpp`.`vppcatatan` AS `vppcatatan`,`vpp`.`vppnoref` AS `vppnoref`,`vpp`.`vpptglnoref` AS `vpptglnoref`,`vpp`.`vppcarabayar` AS `vppcarabayar`,`vpp`.`vpptglbayar` AS `vpptglbayar`,`vpp`.`vppmatauang` AS `vppmatauang`,`vpp`.`vppkurs` AS `vppkurs`,`vpp`.`vpptotalap` AS `vpptotalap`,`vpp`.`vpptotalapvalas` AS `vpptotalapvalas`,`vpp`.`vpptotalar` AS `vpptotalar`,`vpp`.`vpptotalarvalas` AS `vpptotalarvalas`,`vpp`.`vppbayar` AS `vppbayar`,`vpp`.`vppbayarvalas` AS `vppbayarvalas`,`vpp`.`vppselisihkurs` AS `vppselisihkurs`,`vpp`.`vpprekselisihkurs` AS `vpprekselisihkurs`,`vpp`.`vppdiskontermin` AS `vppdiskontermin`,`vpp`.`vppdiskonterminvalas` AS `vppdiskonterminvalas`,`vpp`.`vpprekdiskontermin` AS `vpprekdiskontermin`,`vpp`.`vppstatusvp` AS `vppstatusvp`,`vpp`.`vppstatus` AS `vppstatus`,`vpp`.`vppstatussebelumnya` AS `vppstatussebelumnya`,`vpp`.`vppjmlrevisi` AS `vppjmlrevisi`,`vpp`.`vppcetakanke` AS `vppcetakanke`,`vpp`.`vppinputuser` AS `vppinputuser`,`vpp`.`vppinputtgl` AS `vppinputtgl`,`vpp`.`vppmodifikasiuser` AS `vppmodifikasiuser`,`vpp`.`vppmodifikasitgl` AS `vppmodifikasitgl`,`vpp`.`vppposting` AS `vppposting`,`vpp`.`vpppostingtgl` AS `vpppostingtgl`,`vpp`.`vppisclose` AS `vppisclose`,`br`.`bnama` AS `vppcabangnama`,`lc`.`lnama` AS `vpplokasinama`,`wh`.`wnama` AS `vppgudangnama`,`c1`.`kkode` AS `vppsupplierkode`,`c1`.`knama` AS `vppsuppliernama`,`c2`.`kkode` AS `vppbagianpembayarankode`,`c2`.`knama` AS `vppbagianpembayarannama`,`pm`.`nama` AS `vppcarabayarnama`,`coa1`.`cnama` AS `vpprekselisihkursnama`,`coa2`.`cnama` AS `vpprekdiskonterminnama`,`st1`.`nama` AS `vppstatusnama`,`st2`.`nama` AS `vppstatussebelumnyanama`,`u1`.`unama` AS `vppinputusernama`,`u2`.`unama` AS `vppmodifikasiusernama` from ((((((((((((`m4_vpp` `vpp` left join `m1_branch` `br` on((`br`.`bkode` = `vpp`.`vppcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `vpp`.`vpplokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `vpp`.`vppgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `vpp`.`vppsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `vpp`.`vppbagianpembayaran`))) left join `m0_payment_method` `pm` on((`vpp`.`vppcarabayar` = `pm`.`kode`))) left join `m1_coa` `coa1` on((`vpp`.`vpprekselisihkurs` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`vpp`.`vpprekdiskontermin` = `coa2`.`cnomor`))) left join `m0_status` `st1` on((`st1`.`kode` = `vpp`.`vppstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `vpp`.`vppstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `vpp`.`vppinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `vpp`.`vppmodifikasiuser`)))
```

## Query 29

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_vpp_getdata`

```sql
select `vpp`.`vppid` AS `vppid`,`vpp`.`vppcabang` AS `vppcabang`,`vpp`.`vpplokasi` AS `vpplokasi`,`vpp`.`vppgudang` AS `vppgudang`,`vpp`.`vppsumber` AS `vppsumber`,`vpp`.`vppautonotransaksi` AS `vppautonotransaksi`,`vpp`.`vppnotransaksi` AS `vppnotransaksi`,`vpp`.`vpptgl` AS `vpptgl`,`vpp`.`vppkodepa` AS `vppkodepa`,`vpp`.`vppsupplier` AS `vppsupplier`,`vpp`.`vppsupplierkontak` AS `vppsupplierkontak`,`vpp`.`vpp1alamat1` AS `vpp1alamat1`,`vpp`.`vpp1alamat2` AS `vpp1alamat2`,`vpp`.`vpp1alamat3` AS `vpp1alamat3`,`vpp`.`vpp2alamat1` AS `vpp2alamat1`,`vpp`.`vpp2alamat2` AS `vpp2alamat2`,`vpp`.`vpp2alamat3` AS `vpp2alamat3`,`vpp`.`vppbagianpembayaran` AS `vppbagianpembayaran`,`vpp`.`vppuraian` AS `vppuraian`,`vpp`.`vppcatatan` AS `vppcatatan`,`vpp`.`vppnoref` AS `vppnoref`,`vpp`.`vpptglnoref` AS `vpptglnoref`,`vpp`.`vppcarabayar` AS `vppcarabayar`,`vpp`.`vpptglbayar` AS `vpptglbayar`,`vpp`.`vppmatauang` AS `vppmatauang`,`vpp`.`vppkurs` AS `vppkurs`,`vpp`.`vpptotalap` AS `vpptotalap`,`vpp`.`vpptotalapvalas` AS `vpptotalapvalas`,`vpp`.`vpptotalar` AS `vpptotalar`,`vpp`.`vpptotalarvalas` AS `vpptotalarvalas`,`vpp`.`vppbayar` AS `vppbayar`,`vpp`.`vppbayarvalas` AS `vppbayarvalas`,`vpp`.`vppselisihkurs` AS `vppselisihkurs`,`vpp`.`vpprekselisihkurs` AS `vpprekselisihkurs`,`vpp`.`vppdiskontermin` AS `vppdiskontermin`,`vpp`.`vppdiskonterminvalas` AS `vppdiskonterminvalas`,`vpp`.`vpprekdiskontermin` AS `vpprekdiskontermin`,`vpp`.`vppstatusvp` AS `vppstatusvp`,`vpp`.`vppstatus` AS `vppstatus`,`vpp`.`vppstatussebelumnya` AS `vppstatussebelumnya`,`vpp`.`vppjmlrevisi` AS `vppjmlrevisi`,`vpp`.`vppcetakanke` AS `vppcetakanke`,`vpp`.`vppinputuser` AS `vppinputuser`,`vpp`.`vppinputtgl` AS `vppinputtgl`,`vpp`.`vppmodifikasiuser` AS `vppmodifikasiuser`,`vpp`.`vppmodifikasitgl` AS `vppmodifikasitgl`,`vpp`.`vppposting` AS `vppposting`,`vpp`.`vpppostingtgl` AS `vpppostingtgl`,`vpp`.`vppisclose` AS `vppisclose`,`vpp`.`vppcustomtext1` AS `vppcustomtext1`,`vpp`.`vppcustomtext2` AS `vppcustomtext2`,`vpp`.`vppcustomtext3` AS `vppcustomtext3`,`vpp`.`vppcustomtext4` AS `vppcustomtext4`,`vpp`.`vppcustomtext5` AS `vppcustomtext5`,`vpp`.`vppcustomint1` AS `vppcustomint1`,`vpp`.`vppcustomint2` AS `vppcustomint2`,`vpp`.`vppcustomint3` AS `vppcustomint3`,`vpp`.`vppcustomdbl1` AS `vppcustomdbl1`,`vpp`.`vppcustomdbl2` AS `vppcustomdbl2`,`vpp`.`vppcustomdbl3` AS `vppcustomdbl3`,`vpp`.`vppcustomdate1` AS `vppcustomdate1`,`vpp`.`vppcustomdate2` AS `vppcustomdate2`,`vpp`.`vppcustomdate3` AS `vppcustomdate3`,`br`.`bnama` AS `vppcabangnama`,`lc`.`lnama` AS `vpplokasinama`,`wh`.`wnama` AS `vppgudangnama`,`c1`.`kkode` AS `vppsupplierkode`,`c1`.`knama` AS `vppsuppliernama`,`c2`.`kkode` AS `vppbagianpembayarankode`,`c2`.`knama` AS `vppbagianpembayarannama`,`pm`.`nama` AS `vppcarabayarnama`,`coa1`.`cnama` AS `vpprekselisihkursnama`,`coa2`.`cnama` AS `vpprekdiskonterminnama`,`st1`.`nama` AS `vppstatusnama`,`st2`.`nama` AS `vppstatussebelumnyanama`,`u1`.`unama` AS `vppinputusernama`,`u2`.`unama` AS `vppmodifikasiusernama`,`vppd`.`idvppdetail` AS `idvppdetail`,`vppd`.`idvpp` AS `idvpp`,`vppd`.`sumber` AS `sumber`,`vppd`.`idtransaksi` AS `idtransaksi`,`vppd`.`matauang` AS `matauang`,`vppd`.`kurs` AS `kurs`,`vppd`.`totaltransaksi` AS `totaltransaksi`,`vppd`.`terbayar` AS `terbayar`,`vppd`.`sisa` AS `sisa`,`vppd`.`jmlbayar` AS `jmlbayar`,`vppd`.`jmlbayarvalas` AS `jmlbayarvalas`,`vppd`.`diskontermin` AS `diskontermin`,`vppd`.`jmldiskontermin` AS `jmldiskontermin`,`vppd`.`jmldiskonterminvalas` AS `jmldiskonterminvalas`,`vppd`.`rekhutangpiutang` AS `rekhutangpiutang`,`vppd`.`catatan` AS `catatan`,`vppd`.`costcenter` AS `costcenter`,`vppd`.`divisi` AS `divisi`,`vppd`.`subdivisi` AS `subdivisi`,`vppd`.`proyek` AS `proyek`,`vppd`.`jmlvp` AS `jmlvp`,`vppd`.`jmlvpvalas` AS `jmlvpvalas`,`vppd`.`statusvp` AS `statusvp`,`vppd`.`urutan` AS `urutan`,`vppd`.`isclose` AS `isclose`,`vppd`.`customtext1` AS `customtext1`,`vppd`.`customtext2` AS `customtext2`,`vppd`.`customtext3` AS `customtext3`,`vppd`.`customdbl1` AS `customdbl1`,`vppd`.`customdbl2` AS `customdbl2`,`vppd`.`customdbl3` AS `customdbl3`,`vppd`.`customdate1` AS `customdate1`,`vppd`.`customdate2` AS `customdate2`,`vppd`.`customdate3` AS `customdate3`,(case `vppd`.`sumber` when 'RI' then `ri`.`rinotransaksi` when 'AP' then `ap`.`apnotransaksi` when 'PRT' then `prt`.`prtnotransaksi` else '' end) AS `notransaksi`,(case `vppd`.`sumber` when 'RI' then `ri`.`ritgl` when 'AP' then `ap`.`aptgl` when 'PRT' then `prt`.`prttgl` else `vpp`.`vpptgl` end) AS `tgl`,(case `vppd`.`sumber` when 'RI' then `ri`.`ricarabayar` when 'AP' then 0 when 'PRT' then `prt`.`prtcarabayar` else `vpp`.`vppcarabayar` end) AS `carabayar`,(case `vppd`.`sumber` when 'RI' then `ri`.`ritermin` when 'AP' then `ap`.`aptermin` when 'PRT' then `prt`.`prttermin` else '' end) AS `termin`,(case `vppd`.`sumber` when 'RI' then `ri`.`ritgljatuhtempo` when 'AP' then `ap`.`aptgljatuhtempo` when 'PRT' then `prt`.`prttgljatuhtempo` else `vpp`.`vpptgl` end) AS `tgljatuhtempo`, `vppd`.`rencana` AS `rencana`,(case `vppd`.`sumber` when 'RI' then `ri`.`ristatuslunas` when 'AP' then `ap`.`apstatusbayar` when 'PRT' then `prt`.`prtstatuslunas` else 0 end) AS `statuslunas`,`tr`.`trdiskon1` AS `diskon1`,`tr`.`trharidiskon1` AS `haridiskon1`,`tr`.`trdiskon2` AS `diskon2`,`tr`.`trharidiskon2` AS `haridiskon2`,`coa3`.`cnama` AS `rekhutangpiutangnama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama`,`vpp`.`vppnotransaksi` AS `notransaksivpp`,(case `vppd`.`sumber` when 'RI' then `ri`.`riinputtgl` when 'AP' then `ap`.`apinputtgl` when 'PRT' then `prt`.`prtinputtgl` else `vpp`.`vppinputtgl` end) AS `inputtgl`, c1.kpkp from ((((((((((((((((((((((`m4_vpp` `vpp` join `m4_vpp_detail` `vppd` on((`vpp`.`vppid` = `vppd`.`idvpp`))) left join `m1_branch` `br` on((`br`.`bkode` = `vpp`.`vppcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `vpp`.`vpplokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `vpp`.`vppgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `vpp`.`vppsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `vpp`.`vppbagianpembayaran`))) left join `m0_payment_method` `pm` on((`vpp`.`vppcarabayar` = `pm`.`kode`))) left join `m1_coa` `coa1` on((`vpp`.`vpprekselisihkurs` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`vpp`.`vpprekdiskontermin` = `coa2`.`cnomor`))) left join `m0_status` `st1` on((`st1`.`kode` = `vpp`.`vppstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `vpp`.`vppstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `vpp`.`vppinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `vpp`.`vppmodifikasiuser`))) left join `m4_ri` `ri` on(((`vppd`.`sumber` = 'RI') and (`vppd`.`idtransaksi` = `ri`.`riid`)))) left join `m4_ap` `ap` on(((`vppd`.`sumber` = 'AP') and (`vppd`.`idtransaksi` = `ap`.`apid`)))) left join `m4_prt` `prt` on(((`vppd`.`sumber` = 'PRT') and (`vppd`.`idtransaksi` = `prt`.`prtid`)))) left join `m1_coa` `coa3` on((`vppd`.`rekhutangpiutang` = `coa3`.`cnomor`))) left join `m1_cost_center` `cc` on((`vppd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`vppd`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`vppd`.`subdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`vppd`.`proyek` = `p`.`pkode`))) left join `m1_terms` `tr` on((case `vppd`.`sumber` when 'RI' then (`ri`.`ritermin` = `tr`.`trkode`) when 'AP' then (`ap`.`aptermin` = `tr`.`trkode`) when 'PRT' then (`prt`.`prttermin` = `tr`.`trkode`) end)))
```

## Query 30

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_vpp_terkait`

```sql
select `vpp`.`vppid` AS `vppid`,`vpp`.`vppnotransaksi` AS `vppnotransaksi`,`vp`.`vpsumber` AS `sumber`,`vp`.`vpid` AS `idterkait`,`vp`.`vpnotransaksi` AS `noterkait`,`vp`.`vptgl` AS `tglterkait`,`vp`.`vpinputtgl` AS `inputtglterkait`,`vp`.`vpmodifikasitgl` AS `modifikasitglterkait`,1 AS `jenisterkait` from (((`m4_vp_detail` `vpd` join `m4_vp` `vp` on((`vpd`.`idvp` = `vp`.`vpid`))) join `m4_vpp_detail` `vppd` on((`vppd`.`idvppdetail` = `vpd`.`idvppdetail`))) join `m4_vpp` `vpp` on((`vpp`.`vppid` = `vppd`.`idvpp`))) where (((`vp`.`vpstatus` = 2) or (`vp`.`vpstatus` = 3) or (`vp`.`vpstatus` = 4) or (`vp`.`vpstatus` = 7)) and (`vpp`.`vppid` = 'validtransaksi')) group by `vp`.`vpid`,`vpp`.`vppid`
```

## Query 31

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_vpp_v_history`

```sql
select `vpp`.`vppidhistory` AS `vppidhistory`,`vpp`.`vppid` AS `vppid`,`vpp`.`vppcabang` AS `vppcabang`,`vpp`.`vpplokasi` AS `vpplokasi`,`vpp`.`vppgudang` AS `vppgudang`,`vpp`.`vppsumber` AS `vppsumber`,`vpp`.`vppautonotransaksi` AS `vppautonotransaksi`,`vpp`.`vppnotransaksi` AS `vppnotransaksi`,`vpp`.`vpptgl` AS `vpptgl`,`vpp`.`vppkodepa` AS `vppkodepa`,`vpp`.`vppsupplier` AS `vppsupplier`,`vpp`.`vppsupplierkontak` AS `vppsupplierkontak`,`vpp`.`vpp1alamat1` AS `vpp1alamat1`,`vpp`.`vpp1alamat2` AS `vpp1alamat2`,`vpp`.`vpp1alamat3` AS `vpp1alamat3`,`vpp`.`vpp2alamat1` AS `vpp2alamat1`,`vpp`.`vpp2alamat2` AS `vpp2alamat2`,`vpp`.`vpp2alamat3` AS `vpp2alamat3`,`vpp`.`vppbagianpembayaran` AS `vppbagianpembayaran`,`vpp`.`vppuraian` AS `vppuraian`,`vpp`.`vppcatatan` AS `vppcatatan`,`vpp`.`vppnoref` AS `vppnoref`,`vpp`.`vpptglnoref` AS `vpptglnoref`,`vpp`.`vppcarabayar` AS `vppcarabayar`,`vpp`.`vpptglbayar` AS `vpptglbayar`,`vpp`.`vppmatauang` AS `vppmatauang`,`vpp`.`vppkurs` AS `vppkurs`,`vpp`.`vpptotalap` AS `vpptotalap`,`vpp`.`vpptotalapvalas` AS `vpptotalapvalas`,`vpp`.`vpptotalar` AS `vpptotalar`,`vpp`.`vpptotalarvalas` AS `vpptotalarvalas`,`vpp`.`vppbayar` AS `vppbayar`,`vpp`.`vppbayarvalas` AS `vppbayarvalas`,`vpp`.`vppselisihkurs` AS `vppselisihkurs`,`vpp`.`vpprekselisihkurs` AS `vpprekselisihkurs`,`vpp`.`vppdiskontermin` AS `vppdiskontermin`,`vpp`.`vppdiskonterminvalas` AS `vppdiskonterminvalas`,`vpp`.`vpprekdiskontermin` AS `vpprekdiskontermin`,`vpp`.`vppstatusvp` AS `vppstatusvp`,`vpp`.`vppstatus` AS `vppstatus`,`vpp`.`vppstatussebelumnya` AS `vppstatussebelumnya`,`vpp`.`vppjmlrevisi` AS `vppjmlrevisi`,`vpp`.`vppcetakanke` AS `vppcetakanke`,`vpp`.`vppinputuser` AS `vppinputuser`,`vpp`.`vppinputtgl` AS `vppinputtgl`,`vpp`.`vppmodifikasiuser` AS `vppmodifikasiuser`,`vpp`.`vppmodifikasitgl` AS `vppmodifikasitgl`,`vpp`.`vppposting` AS `vppposting`,`vpp`.`vpppostingtgl` AS `vpppostingtgl`,`vpp`.`vppisclose` AS `vppisclose`,`br`.`bnama` AS `vppcabangnama`,`lc`.`lnama` AS `vpplokasinama`,`wh`.`wnama` AS `vppgudangnama`,`c1`.`kkode` AS `vppsupplierkode`,`c1`.`knama` AS `vppsuppliernama`,`c2`.`kkode` AS `vppbagianpembayarankode`,`c2`.`knama` AS `vppbagianpembayarannama`,`pm`.`nama` AS `vppcarabayarnama`,`coa1`.`cnama` AS `vpprekselisihkursnama`,`coa2`.`cnama` AS `vpprekdiskonterminnama`,`st1`.`nama` AS `vppstatusnama`,`st2`.`nama` AS `vppstatussebelumnyanama`,`u1`.`unama` AS `vppinputusernama`,`u2`.`unama` AS `vppmodifikasiusernama` from ((((((((((((`m4_vpp_history` `vpp` left join `m1_branch` `br` on((`br`.`bkode` = `vpp`.`vppcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `vpp`.`vpplokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `vpp`.`vppgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `vpp`.`vppsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `vpp`.`vppbagianpembayaran`))) left join `m0_payment_method` `pm` on((`vpp`.`vppcarabayar` = `pm`.`kode`))) left join `m1_coa` `coa1` on((`vpp`.`vpprekselisihkurs` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`vpp`.`vpprekdiskontermin` = `coa2`.`cnomor`))) left join `m0_status` `st1` on((`st1`.`kode` = `vpp`.`vppstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `vpp`.`vppstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `vpp`.`vppinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `vpp`.`vppmodifikasiuser`)))
```

## Query 32

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_vpp_getdata_history`

```sql
select `vpp`.`vppidhistory` AS `vppidhistory`,`vpp`.`vppid` AS `vppid`,`vpp`.`vppcabang` AS `vppcabang`,`vpp`.`vpplokasi` AS `vpplokasi`,`vpp`.`vppgudang` AS `vppgudang`,`vpp`.`vppsumber` AS `vppsumber`,`vpp`.`vppautonotransaksi` AS `vppautonotransaksi`,`vpp`.`vppnotransaksi` AS `vppnotransaksi`,`vpp`.`vpptgl` AS `vpptgl`,`vpp`.`vppkodepa` AS `vppkodepa`,`vpp`.`vppsupplier` AS `vppsupplier`,`vpp`.`vppsupplierkontak` AS `vppsupplierkontak`,`vpp`.`vpp1alamat1` AS `vpp1alamat1`,`vpp`.`vpp1alamat2` AS `vpp1alamat2`,`vpp`.`vpp1alamat3` AS `vpp1alamat3`,`vpp`.`vpp2alamat1` AS `vpp2alamat1`,`vpp`.`vpp2alamat2` AS `vpp2alamat2`,`vpp`.`vpp2alamat3` AS `vpp2alamat3`,`vpp`.`vppbagianpembayaran` AS `vppbagianpembayaran`,`vpp`.`vppuraian` AS `vppuraian`,`vpp`.`vppcatatan` AS `vppcatatan`,`vpp`.`vppnoref` AS `vppnoref`,`vpp`.`vpptglnoref` AS `vpptglnoref`,`vpp`.`vppcarabayar` AS `vppcarabayar`,`vpp`.`vpptglbayar` AS `vpptglbayar`,`vpp`.`vppmatauang` AS `vppmatauang`,`vpp`.`vppkurs` AS `vppkurs`,`vpp`.`vpptotalap` AS `vpptotalap`,`vpp`.`vpptotalapvalas` AS `vpptotalapvalas`,`vpp`.`vpptotalar` AS `vpptotalar`,`vpp`.`vpptotalarvalas` AS `vpptotalarvalas`,`vpp`.`vppbayar` AS `vppbayar`,`vpp`.`vppbayarvalas` AS `vppbayarvalas`,`vpp`.`vppselisihkurs` AS `vppselisihkurs`,`vpp`.`vpprekselisihkurs` AS `vpprekselisihkurs`,`vpp`.`vppdiskontermin` AS `vppdiskontermin`,`vpp`.`vppdiskonterminvalas` AS `vppdiskonterminvalas`,`vpp`.`vpprekdiskontermin` AS `vpprekdiskontermin`,`vpp`.`vppstatusvp` AS `vppstatusvp`,`vpp`.`vppstatus` AS `vppstatus`,`vpp`.`vppstatussebelumnya` AS `vppstatussebelumnya`,`vpp`.`vppjmlrevisi` AS `vppjmlrevisi`,`vpp`.`vppcetakanke` AS `vppcetakanke`,`vpp`.`vppinputuser` AS `vppinputuser`,`vpp`.`vppinputtgl` AS `vppinputtgl`,`vpp`.`vppmodifikasiuser` AS `vppmodifikasiuser`,`vpp`.`vppmodifikasitgl` AS `vppmodifikasitgl`,`vpp`.`vppposting` AS `vppposting`,`vpp`.`vpppostingtgl` AS `vpppostingtgl`,`vpp`.`vppisclose` AS `vppisclose`,`vpp`.`vppcustomtext1` AS `vppcustomtext1`,`vpp`.`vppcustomtext2` AS `vppcustomtext2`,`vpp`.`vppcustomtext3` AS `vppcustomtext3`,`vpp`.`vppcustomtext4` AS `vppcustomtext4`,`vpp`.`vppcustomtext5` AS `vppcustomtext5`,`vpp`.`vppcustomint1` AS `vppcustomint1`,`vpp`.`vppcustomint2` AS `vppcustomint2`,`vpp`.`vppcustomint3` AS `vppcustomint3`,`vpp`.`vppcustomdbl1` AS `vppcustomdbl1`,`vpp`.`vppcustomdbl2` AS `vppcustomdbl2`,`vpp`.`vppcustomdbl3` AS `vppcustomdbl3`,`vpp`.`vppcustomdate1` AS `vppcustomdate1`,`vpp`.`vppcustomdate2` AS `vppcustomdate2`,`vpp`.`vppcustomdate3` AS `vppcustomdate3`,`br`.`bnama` AS `vppcabangnama`,`lc`.`lnama` AS `vpplokasinama`,`wh`.`wnama` AS `vppgudangnama`,`c1`.`kkode` AS `vppsupplierkode`,`c1`.`knama` AS `vppsuppliernama`,`c2`.`kkode` AS `vppbagianpembayarankode`,`c2`.`knama` AS `vppbagianpembayarannama`,`pm`.`nama` AS `vppcarabayarnama`,`coa1`.`cnama` AS `vpprekselisihkursnama`,`coa2`.`cnama` AS `vpprekdiskonterminnama`,`st1`.`nama` AS `vppstatusnama`,`st2`.`nama` AS `vppstatussebelumnyanama`,`u1`.`unama` AS `vppinputusernama`,`u2`.`unama` AS `vppmodifikasiusernama`,`vppd`.`idhistorydetail` AS `idhistorydetail`,`vppd`.`idhistory` AS `idhistory`,`vppd`.`idvppdetail` AS `idvppdetail`,`vppd`.`idvpp` AS `idvpp`,`vppd`.`sumber` AS `sumber`,`vppd`.`idtransaksi` AS `idtransaksi`,`vppd`.`matauang` AS `matauang`,`vppd`.`kurs` AS `kurs`,`vppd`.`totaltransaksi` AS `totaltransaksi`,`vppd`.`terbayar` AS `terbayar`,`vppd`.`sisa` AS `sisa`,`vppd`.`jmlbayar` AS `jmlbayar`,`vppd`.`jmlbayarvalas` AS `jmlbayarvalas`,`vppd`.`diskontermin` AS `diskontermin`,`vppd`.`jmldiskontermin` AS `jmldiskontermin`,`vppd`.`jmldiskonterminvalas` AS `jmldiskonterminvalas`,`vppd`.`rekhutangpiutang` AS `rekhutangpiutang`,`vppd`.`catatan` AS `catatan`,`vppd`.`costcenter` AS `costcenter`,`vppd`.`divisi` AS `divisi`,`vppd`.`subdivisi` AS `subdivisi`,`vppd`.`proyek` AS `proyek`,`vppd`.`jmlvp` AS `jmlvp`,`vppd`.`jmlvpvalas` AS `jmlvpvalas`,`vppd`.`statusvp` AS `statusvp`,`vppd`.`urutan` AS `urutan`,`vppd`.`isclose` AS `isclose`,`vppd`.`customtext1` AS `customtext1`,`vppd`.`customtext2` AS `customtext2`,`vppd`.`customtext3` AS `customtext3`,`vppd`.`customdbl1` AS `customdbl1`,`vppd`.`customdbl2` AS `customdbl2`,`vppd`.`customdbl3` AS `customdbl3`,`vppd`.`customdate1` AS `customdate1`,`vppd`.`customdate2` AS `customdate2`,`vppd`.`customdate3` AS `customdate3`,(case `vppd`.`sumber` when 'RI' then `ri`.`rinotransaksi` when 'AP' then `ap`.`apnotransaksi` when 'PRT' then `prt`.`prtnotransaksi` else '' end) AS `notransaksi`,(case `vppd`.`sumber` when 'RI' then `ri`.`ritgl` when 'AP' then `ap`.`aptgl` when 'PRT' then `prt`.`prttgl` else `vpp`.`vpptgl` end) AS `tgl`,(case `vppd`.`sumber` when 'RI' then `ri`.`ricarabayar` when 'AP' then 0 when 'PRT' then `prt`.`prtcarabayar` else `vpp`.`vppcarabayar` end) AS `carabayar`,(case `vppd`.`sumber` when 'RI' then `ri`.`ritermin` when 'AP' then `ap`.`aptermin` when 'PRT' then `prt`.`prttermin` else '' end) AS `termin`,(case `vppd`.`sumber` when 'RI' then `ri`.`ritgljatuhtempo` when 'AP' then `ap`.`aptgljatuhtempo` when 'PRT' then `prt`.`prttgljatuhtempo` else `vpp`.`vpptgl` end) AS `tgljatuhtempo`, `vppd`.`rencana` AS `rencana`,(case `vppd`.`sumber` when 'RI' then `ri`.`ristatuslunas` when 'AP' then `ap`.`apstatusbayar` when 'PRT' then `prt`.`prtstatuslunas` else 0 end) AS `statuslunas`,`tr`.`trdiskon1` AS `diskon1`,`tr`.`trharidiskon1` AS `haridiskon1`,`tr`.`trdiskon2` AS `diskon2`,`tr`.`trharidiskon2` AS `haridiskon2`,`coa3`.`cnama` AS `rekhutangpiutangnama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama`,`vpp`.`vppnotransaksi` AS `notransaksivpp`,(case `vppd`.`sumber` when 'RI' then `ri`.`riinputtgl` when 'AP' then `ap`.`apinputtgl` when 'PRT' then `prt`.`prtinputtgl` else `vpp`.`vppinputtgl` end) AS `inputtgl` from ((((((((((((((((((((((`m4_vpp_history` `vpp` join `m4_vpp_detail_history` `vppd` on((`vpp`.`vppidhistory` = `vppd`.`idhistory`))) left join `m1_branch` `br` on((`br`.`bkode` = `vpp`.`vppcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `vpp`.`vpplokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `vpp`.`vppgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `vpp`.`vppsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `vpp`.`vppbagianpembayaran`))) left join `m0_payment_method` `pm` on((`vpp`.`vppcarabayar` = `pm`.`kode`))) left join `m1_coa` `coa1` on((`vpp`.`vpprekselisihkurs` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`vpp`.`vpprekdiskontermin` = `coa2`.`cnomor`))) left join `m0_status` `st1` on((`st1`.`kode` = `vpp`.`vppstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `vpp`.`vppstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `vpp`.`vppinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `vpp`.`vppmodifikasiuser`))) left join `m4_ri` `ri` on(((`vppd`.`sumber` = 'RI') and (`vppd`.`idtransaksi` = `ri`.`riid`)))) left join `m4_ap` `ap` on(((`vppd`.`sumber` = 'AP') and (`vppd`.`idtransaksi` = `ap`.`apid`)))) left join `m4_prt` `prt` on(((`vppd`.`sumber` = 'PRT') and (`vppd`.`idtransaksi` = `prt`.`prtid`)))) left join `m1_coa` `coa3` on((`vppd`.`rekhutangpiutang` = `coa3`.`cnomor`))) left join `m1_cost_center` `cc` on((`vppd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`vppd`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`vppd`.`subdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`vppd`.`proyek` = `p`.`pkode`))) left join `m1_terms` `tr` on((case `vppd`.`sumber` when 'RI' then (`ri`.`ritermin` = `tr`.`trkode`) when 'AP' then (`ap`.`aptermin` = `tr`.`trkode`) when 'PRT' then (`prt`.`prttermin` = `tr`.`trkode`) end)))
```

## Query 33

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_vpp_getdata_pay_history`

```sql
select `vppp`.`idhistorycarabayar` AS `idhistorycarabayar`,`vppp`.`idhistory` AS `idhistory`,`vppp`.`idvppcarabayar` AS `idvppcarabayar`,`vppp`.`idvpp` AS `idvpp`,`vppp`.`carabayar` AS `carabayar`,`vppp`.`matauang` AS `matauang`,`vppp`.`kurs` AS `kurs`,`vppp`.`jumlah` AS `jumlah`,`vppp`.`jumlahvalas` AS `jumlahvalas`,`vppp`.`nogiro` AS `nogiro`,`vppp`.`tgljt` AS `tgljt`,`vppp`.`bank` AS `bank`,`vppp`.`noacbank` AS `noacbank`,`vppp`.`rekbank` AS `rekbank`,`vppp`.`rekgiro` AS `rekgiro`,`vppp`.`catatan` AS `catatan`,`vppp`.`urutan` AS `urutan`,`vppp`.`jmlvp` AS `jmlvp`,`vppp`.`jmlvpvalas` AS `jmlvpvalas`,`vppp`.`statusvp` AS `statusvp`,`vppp`.`isclose` AS `isclose`,`pm`.`nama` AS `carabayarnama`,`b`.`bnama` AS `banknama`,`coa1`.`cnama` AS `rekbanknama`,`coa2`.`cnama` AS `rekgironama` from ((((`m4_vpp_pay_history` `vppp` left join `m0_payment_method` `pm` on((`vppp`.`carabayar` = `pm`.`kode`))) left join `m1_bank` `b` on((`vppp`.`bank` = `b`.`bkode`))) left join `m1_coa` `coa1` on((`vppp`.`rekbank` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`vppp`.`rekgiro` = `coa2`.`cnomor`)))
```

## Query 34

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_vpp_getdata_pay`

```sql
select `vppp`.`idvppcarabayar` AS `idvppcarabayar`,`vppp`.`idvpp` AS `idvpp`,`vppp`.`carabayar` AS `carabayar`,`vppp`.`matauang` AS `matauang`,`vppp`.`kurs` AS `kurs`,`vppp`.`jumlah` AS `jumlah`,`vppp`.`jumlahvalas` AS `jumlahvalas`,`vppp`.`nogiro` AS `nogiro`,`vppp`.`tgljt` AS `tgljt`,`vppp`.`bank` AS `bank`,`vppp`.`noacbank` AS `noacbank`,`vppp`.`rekbank` AS `rekbank`,`vppp`.`rekgiro` AS `rekgiro`,`vppp`.`catatan` AS `catatan`,`vppp`.`urutan` AS `urutan`,`vppp`.`jmlvp` AS `jmlvp`,`vppp`.`jmlvpvalas` AS `jmlvpvalas`,`vppp`.`statusvp` AS `statusvp`,`vppp`.`isclose` AS `isclose`,`pm`.`nama` AS `carabayarnama`,`b`.`bnama` AS `banknama`,`coa1`.`cnama` AS `rekbanknama`,`coa2`.`cnama` AS `rekgironama` from ((((`m4_vpp_pay` `vppp` left join `m0_payment_method` `pm` on((`vppp`.`carabayar` = `pm`.`kode`))) left join `m1_bank` `b` on((`vppp`.`bank` = `b`.`bkode`))) left join `m1_coa` `coa1` on((`vppp`.`rekbank` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`vppp`.`rekgiro` = `coa2`.`cnomor`)))
```

## Query 35

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_vpp.vb`

```sql
select ri.riid AS idtransaksi, ri.risumber AS sumber, ri.rinotransaksi AS notransaksi,ri.ritgl AS tgl,ri.risupplier AS kontak,ri.ricatatan AS catatan,ri.ricarabayar AS carabayar,ri.ritermin AS termin,ri.ritgljatuhtempo AS tgljatuhtempo,ri.rimatauang AS matauang,ri.rikurs AS kurs,ri.ritotaltransaksi AS totaltransaksi,ri.rijmlbayar AS terbayar,(sum((vppd.jmlbayar - vppd.jmlvp)) / ri.rikurs) AS rencana,((ri.ritotaltransaksi - ri.rijmlbayar) * ri.rikurs) AS sisa,(case ri.rimatauang when s2.snilai then 0 else (ri.ritotaltransaksi - ri.rijmlbayar) end) AS sisavalas,ri.ristatuslunas AS statuslunas,c.krekhutang AS rekhutangpiutang,tr.trdiskon1 AS diskon1,tr.trharidiskon1 AS haridiskon1,tr.trdiskon2 AS diskon2,tr.trharidiskon2 AS haridiskon2,ri.riinputtgl AS inputtgl, ri.ristatusvpp as statusvpp, ri.rinoref as noref from m4_ri ri join m1_contact c on ri.risupplier = c.kid join m0_setting s on s.smodule = 0 and s.sgrup = 'akun' and (case c.kcustomint1 when 0 then s.skode = 'HutangUsaha' else s.skode = 'HutangKonsinyasi' end) join m0_setting s2 on s2.smodule = 0 and s2.sgrup = 'accounting' and s2.skode = 'MataUangFungsional' left join m1_terms tr on ri.ritermin = tr.trkode left join m4_vpp_detail vppd on vppd.sumber = 'RI' and vppd.idtransaksi = ri.riid and vppd.statusvp <> 2 {filter1} group by ri.riid
```

## Query 36

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_vpp_takedata`

```sql
select ri.riid AS idtransaksi, ri.risumber AS sumber, ri.rinotransaksi AS notransaksi,ri.ritgl AS tgl,ri.risupplier AS kontak,ri.ricatatan AS catatan,ri.ricarabayar AS carabayar,ri.ritermin AS termin,ri.ritgljatuhtempo AS tgljatuhtempo,ri.rimatauang AS matauang,ri.rikurs AS kurs,ri.ritotaltransaksi AS totaltransaksi,ri.rijmlbayar AS terbayar,(sum((vppd.jmlbayar - vppd.jmlvp)) / ri.rikurs) AS rencana,((ri.ritotaltransaksi - ri.rijmlbayar) * ri.rikurs) AS sisa,(case ri.rimatauang when s2.snilai then 0 else (ri.ritotaltransaksi - ri.rijmlbayar) end) AS sisavalas,ri.ristatuslunas AS statuslunas,s.snilai AS rekhutangpiutang,tr.trdiskon1 AS diskon1,tr.trharidiskon1 AS haridiskon1,tr.trdiskon2 AS diskon2,tr.trharidiskon2 AS haridiskon2,ri.riinputtgl AS inputtgl, ri.rinoref as noref from m4_ri ri join m1_contact c on ri.risupplier = c.kid join m0_setting s on s.smodule = 0 and s.sgrup = 'akun' and (case c.kcustomint1 when 0 then s.skode = 'HutangUsaha' else s.skode = 'HutangKonsinyasi' end) join m0_setting s2 on s2.smodule = 0 and s2.sgrup = 'accounting' and s2.skode = 'MataUangFungsional' left join m1_terms tr on ri.ritermin = tr.trkode left join m4_vpp_detail vppd on vppd.sumber = 'RI' and vppd.idtransaksi = ri.riid and vppd.statusvp <> 2 {filter1} group by ri.riid
```

