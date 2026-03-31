# M4_PIE Queries

## Query 1

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_pie.vb`

```sql
DELETE FROM M4_pie WHERE pieid = '{idtransaksi}'
```

## Query 2

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_pie.vb`

```sql
DELETE FROM M4_pie_Detail WHERE idpie = '{idtransaksi}'
```

## Query 3

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_pie.vb`

```sql
Delete from M4_Pie_Detail where idpie = '{result_4}'
```

## Query 4

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_pie_history.vb`

```sql
INSERT INTO M4_Pie_history(SELECT 0, pie.* FROM M4_Pie pie WHERE pie.pieid = '{idtransaksi}')
```

## Query 5

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_pie_history.vb`

```sql
INSERT INTO m4_pie_detail_history (SELECT 0, '{result_4}', pie.* FROM m4_pie_detail pie WHERE pie.idpie = '{idtransaksi}' )
```

## Query 6

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_pie.vb`

```sql
Insert into M0_Userlog (uluserid, ulidmodule, ulidmenu, uljenisaktivitas, ulaktivitas, ultgl, ulkodepa) values({userid}, {mdlid}, {mnid}, {jnsaktivitas}, '{notransaksi}', NOW(), {0})
```

## Query 7

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_pie.vb`

```sql
Insert into M4_Pie (piecabang, pielokasi, piesumber, pieautonotransaksi, pienotransaksi, pietgl, piekodepa, piekontak, piekontakperson, pie1alamat1, pie1alamat2, pie1alamat3, pie2alamat1, pie2alamat2, pie2alamat3, pieuraian, piecatatan, pienoref, pietglnoref, piestatus, piestatussebelumnya, piejmlrevisi, piecetakanke, pieinputuser, pieinputtgl, piemodifikasiuser, piemodifikasitgl, pieposting, piepostingtgl, pieisclose, piecustomtext1, piecustomtext2, piecustomtext3, piecustomtext4, piecustomtext5, piecustomint1, piecustomint2, piecustomint3, piecustomdbl1, piecustomdbl2, piecustomdbl3, piecustomdate1, piecustomdate2, piecustomdate3) values('{piecabang}', '{pielokasi}', '{piesumber}', {pieautonotransaksi}, '{notransaksi}', '{pietgl}', '{piekodepa}', '{piekontak}', '{piekontakperson}', '{pie1alamat1}', '{pie1alamat2}', '{pie1alamat3}', '{pie2alamat1}', '{pie2alamat2}', '{pie2alamat3}', '{pieuraian}', '{piecatatan}', '{pienoref}', '{pietglnoref}', {piestatus}, {piestatussebelumnya}, {piejmlrevisi}, {piecetakanke}, '{pieinputuser}', '{drutama("pieinputtgl"), "yyyy-MM-dd HH:mm:ss"}', '{piemodifikasiuser}', '{drutama("piemodifikasitgl"), "yyyy-MM-dd HH:mm:ss"}', {pieposting}, '{drutama("piepostingtgl"), "yyyy-MM-dd HH:mm:ss"}', {pieisclose}, '{piecustomtext1}', '{piecustomtext2}', '{piecustomtext3}', '{piecustomtext4}', '{piecustomtext5}', {piecustomint1}, {piecustomint2}, {piecustomint3}, '{piecustomdbl1}', '{piecustomdbl2}', '{piecustomdbl3}', '{piecustomdate1}', '{piecustomdate2}', '{piecustomdate3}')
```

## Query 8

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_pie.vb`

```sql
Insert into M4_Pie (piecabang, pielokasi, piesumber, pieautonotransaksi, pienotransaksi, pietgl, piekodepa, piekontak, piekontakperson, pie1alamat1, pie1alamat2, pie1alamat3, pie2alamat1, pie2alamat2, pie2alamat3, pieuraian, piecatatan, pienoref, pietglnoref, piestatus, piestatussebelumnya, piejmlrevisi, piecetakanke, pieinputuser, pieinputtgl, piemodifikasiuser, piemodifikasitgl, pieposting, piepostingtgl, pieisclose, piecustomtext1, piecustomtext2, piecustomtext3, piecustomtext4, piecustomtext5, piecustomint1, piecustomint2, piecustomint3, piecustomdbl1, piecustomdbl2, piecustomdbl3, piecustomdate1, piecustomdate2, piecustomdate3) values('{piecabang}', '{pielokasi}', '{piesumber}', {pieautonotransaksi}, '{notransaksi}', '{pietgl}', '{piekodepa}', '{piekontak}', '{piekontakperson}', '{pie1alamat1}', '{pie1alamat2}', '{pie1alamat3}', '{pie2alamat1}', '{pie2alamat2}', '{pie2alamat3}', '{pieuraian}', '{piecatatan}', '{pienoref}', '{pietglnoref}', {piestatus}, {piestatussebelumnya}, {piejmlrevisi}, {piecetakanke}, '{pieinputuser}', NOW(), '{piemodifikasiuser}', NOW(), {pieposting}, '{drutama("piepostingtgl"), "yyyy-MM-dd HH:mm:ss"}', {pieisclose}, '{piecustomtext1}', '{piecustomtext2}', '{piecustomtext3}', '{piecustomtext4}', '{piecustomtext5}', {piecustomint1}, {piecustomint2}, {piecustomint3}, '{piecustomdbl1}', '{piecustomdbl2}', '{piecustomdbl3}', '{piecustomdate1}', '{piecustomdate2}', '{piecustomdate3}')
```

## Query 9

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_pie.vb`

```sql
Insert into M4_Pie_Detail(idpiedetail, idpie, sumber, idtransaksi, catatan, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2.ToString}
```

## Query 10

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_pie.vb`

```sql
SELECT pie.pieid, pie.pienotransaksi, prt.prtsumber as sumber, prt.prtid as id, prt.prtnotransaksi as notransaksi FROM m4_pie pie JOIN m4_pie_detail pied ON pie.pieid = pied.idpie JOIN m4_prt prt ON pied.sumber = prt.prtsumber AND pied.idtransaksi = prt.prtid WHERE pie.piestatus IN(2,3,4,7) AND ({ftBelumPiePRT}) GROUP BY pie.pieid, prt.prtid
```

## Query 11

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_pie.vb`

```sql
SELECT pie.pieid, pie.pienotransaksi, ri.risumber as sumber, ri.riid as id, ri.rinotransaksi as notransaksi FROM m4_pie pie JOIN m4_pie_detail pied ON pie.pieid = pied.idpie JOIN m4_ri ri ON pied.sumber = ri.risumber AND pied.idtransaksi = ri.riid WHERE pie.piestatus IN(2,3,4,7) AND ({ftBelumPieRI}) GROUP BY pie.pieid, ri.riid
```

## Query 12

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_pie.vb`

```sql
SELECT piecabang, pielokasi, piesumber, pieautonotransaksi, pienotransaksi, pietgl FROM M4_pie WHERE pieid = '{idtransaksi}'
```

## Query 13

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_pie_history.vb`

```sql
SELECT pieidhistory FROM m4_pie_history WHERE pieid = '{idtransaksi}' ORDER BY piemodifikasitgl DESC LIMIT 1
```

## Query 14

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_pie.vb`

```sql
UPDATE m4_Pie SET Piestatus = {nilaiStatus}, Piemodifikasiuser='{userid}', Piemodifikasitgl = NOW(), Pieposting = 0, Piepostingtgl = '1971-01-01 00:00:00', Piejmlrevisi = Piejmlrevisi + 1 WHERE Pieid = '{idtransaksi}'
```

## Query 15

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_pie.vb`

```sql
UPDATE m4_pie pie JOIN m4_pie_detail pied ON pie.pieid = pied.idpie JOIN m4_prt prt ON pied.sumber = prt.prtsumber AND pied.idtransaksi = prt.prtid LEFT JOIN m0_setting s ON s.smodule = 4 AND s.sgrup = 'tukarfaktur' AND s.skode = 'UpdateTglJatuhTempoPRT' AND s.snilai = 1 LEFT JOIN m1_terms tr ON prt.prttermin = tr.trkode SET prt.prtstatuspie = 0, prt.prttglpie = '1900-01-01', prt.prttgljatuhtempo = (CASE IFNULL(s.snilai,0) WHEN 1 THEN '2100-12-31' ELSE prt.prttgljatuhtempo END) WHERE pie.pieid = '{idtransaksi}'
```

## Query 16

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_pie.vb`

```sql
UPDATE m4_pie pie JOIN m4_pie_detail pied ON pie.pieid = pied.idpie JOIN m4_prt prt ON pied.sumber = prt.prtsumber AND pied.idtransaksi = prt.prtid LEFT JOIN m0_setting s ON s.smodule = 4 AND s.sgrup = 'tukarfaktur' AND s.skode = 'UpdateTglJatuhTempoPRT' AND s.snilai = 1 LEFT JOIN m1_terms tr ON prt.prttermin = tr.trkode SET prt.prtstatuspie = 1, prt.prttglpie = pie.pietgl, prt.prttgljatuhtempo = (CASE IFNULL(s.snilai,0) WHEN 1 THEN DATE_ADD(pie.pietgl,INTERVAL IFNULL(tr.trharijatuhtempo,0) DAY) ELSE prt.prttgljatuhtempo END) WHERE pie.pieid = '{result_4}'
```

## Query 17

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_pie.vb`

```sql
UPDATE m4_pie pie JOIN m4_pie_detail pied ON pie.pieid = pied.idpie JOIN m4_ri ri ON pied.sumber = ri.risumber AND pied.idtransaksi = ri.riid LEFT JOIN m0_setting s ON s.smodule = 4 AND s.sgrup = 'tukarfaktur' AND s.skode = 'UpdateTglJatuhTempoRI' AND s.snilai = 1 LEFT JOIN m1_terms tr ON ri.ritermin = tr.trkode SET ri.ristatuspie = 0, ri.ritglpie = '1900-01-01', ri.ritgljatuhtempo = (CASE IFNULL(s.snilai,0) WHEN 1 THEN '2100-12-31' ELSE ri.ritgljatuhtempo END) WHERE pie.pieid = '{idtransaksi}'
```

## Query 18

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_pie.vb`

```sql
UPDATE m4_pie pie JOIN m4_pie_detail pied ON pie.pieid = pied.idpie JOIN m4_ri ri ON pied.sumber = ri.risumber AND pied.idtransaksi = ri.riid LEFT JOIN m0_setting s ON s.smodule = 4 AND s.sgrup = 'tukarfaktur' AND s.skode = 'UpdateTglJatuhTempoRI' AND s.snilai = 1 LEFT JOIN m1_terms tr ON ri.ritermin = tr.trkode SET ri.ristatuspie = 1, ri.ritglpie = pie.pietgl, ri.ritgljatuhtempo = (CASE IFNULL(s.snilai,0) WHEN 1 THEN DATE_ADD(pie.pietgl,INTERVAL IFNULL(tr.trharijatuhtempo,0) DAY) ELSE ri.ritgljatuhtempo END) WHERE pie.pieid = '{result_4}'
```

## Query 19

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_pie.vb`

```sql
Update M4_Pie set piecabang = '{piecabang}', pielokasi = '{pielokasi}', piesumber = '{piesumber}', pieautonotransaksi = {pieautonotransaksi}, pienotransaksi = '{notransaksi}', pietgl = '{pietgl}', piekodepa = '{piekodepa}', piekontak = '{piekontak}', piekontakperson = '{piekontakperson}', pie1alamat1 = '{pie1alamat1}', pie1alamat2 = '{pie1alamat2}', pie1alamat3 = '{pie1alamat3}', pie2alamat1 = '{pie2alamat1}', pie2alamat2 = '{pie2alamat2}', pie2alamat3 = '{pie2alamat3}', pieuraian = '{pieuraian}', piecatatan = '{piecatatan}', pienoref = '{pienoref}', pietglnoref = '{pietglnoref}', piestatus = {piestatus}, piestatussebelumnya = {piestatussebelumnya}, piejmlrevisi = {piejmlrevisi}, piecetakanke = {piecetakanke}, pieinputuser = '{pieinputuser}', pieinputtgl = '{drutama("pieinputtgl"), "yyyy-MM-dd HH:mm:ss"}', piemodifikasiuser = '{piemodifikasiuser}', piemodifikasitgl = '{drutama("piemodifikasitgl"), "yyyy-MM-dd HH:mm:ss"}', pieposting = {pieposting}, piepostingtgl = '{drutama("piepostingtgl"), "yyyy-MM-dd HH:mm:ss"}', piecustomtext1 = '{piecustomtext1}', piecustomtext2 = '{piecustomtext2}', piecustomtext3 = '{piecustomtext3}', piecustomtext4 = '{piecustomtext4}', piecustomtext5 = '{piecustomtext5}', piecustomint1 = {piecustomint1}, piecustomint2 = {piecustomint2}, piecustomint3 = {piecustomint3}, piecustomdbl1 = '{piecustomdbl1}', piecustomdbl2 = '{piecustomdbl2}', piecustomdbl3 = '{piecustomdbl3}', piecustomdate1 = '{piecustomdate1}', piecustomdate2 = '{piecustomdate2}', piecustomdate3 = '{piecustomdate3}' where pieid = {pieid}
```

## Query 20

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_pie.vb`

```sql
Update M4_Pie set piecabang = '{piecabang}', pielokasi = '{pielokasi}', piesumber = '{piesumber}', pieautonotransaksi = {pieautonotransaksi}, pienotransaksi = '{notransaksi}', pietgl = '{pietgl}', piekodepa = '{piekodepa}', piekontak = '{piekontak}', piekontakperson = '{piekontakperson}', pie1alamat1 = '{pie1alamat1}', pie1alamat2 = '{pie1alamat2}', pie1alamat3 = '{pie1alamat3}', pie2alamat1 = '{pie2alamat1}', pie2alamat2 = '{pie2alamat2}', pie2alamat3 = '{pie2alamat3}', pieuraian = '{pieuraian}', piecatatan = '{piecatatan}', pienoref = '{pienoref}', pietglnoref = '{pietglnoref}', piestatus = {piestatus}, piestatussebelumnya = {piestatussebelumnya}, piejmlrevisi = {piejmlrevisi}, piecetakanke = {piecetakanke}, pieinputuser = '{pieinputuser}', pieinputtgl = '{drutama("pieinputtgl"), "yyyy-MM-dd HH:mm:ss"}', piemodifikasiuser = '{piemodifikasiuser}', piemodifikasitgl = NOW(), pieposting = {pieposting}, piepostingtgl = '{drutama("piepostingtgl"), "yyyy-MM-dd HH:mm:ss"}', piecustomtext1 = '{piecustomtext1}', piecustomtext2 = '{piecustomtext2}', piecustomtext3 = '{piecustomtext3}', piecustomtext4 = '{piecustomtext4}', piecustomtext5 = '{piecustomtext5}', piecustomint1 = {piecustomint1}, piecustomint2 = {piecustomint2}, piecustomint3 = {piecustomint3}, piecustomdbl1 = '{piecustomdbl1}', piecustomdbl2 = '{piecustomdbl2}', piecustomdbl3 = '{piecustomdbl3}', piecustomdate1 = '{piecustomdate1}', piecustomdate2 = '{piecustomdate2}', piecustomdate3 = '{piecustomdate3}' where pieid = {pieid}
```

## Query 21

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_pie.vb`

```sql
select `pie`.`pieid` AS `pieid`,`pie`.`piecabang` AS `piecabang`,`pie`.`pielokasi` AS `pielokasi`,`pie`.`piesumber` AS `piesumber`,`pie`.`pieautonotransaksi` AS `pieautonotransaksi`,`pie`.`pienotransaksi` AS `pienotransaksi`,`pie`.`pietgl` AS `pietgl`,`pie`.`piekodepa` AS `piekodepa`,`pie`.`piekontak` AS `piekontak`,`pie`.`piekontakperson` AS `piekontakperson`,`pie`.`pie1alamat1` AS `pie1alamat1`,`pie`.`pie1alamat2` AS `pie1alamat2`,`pie`.`pie1alamat3` AS `pie1alamat3`,`pie`.`pie2alamat1` AS `pie2alamat1`,`pie`.`pie2alamat2` AS `pie2alamat2`,`pie`.`pie2alamat3` AS `pie2alamat3`,`pie`.`pieuraian` AS `pieuraian`,`pie`.`piecatatan` AS `piecatatan`,`pie`.`pienoref` AS `pienoref`,`pie`.`pietglnoref` AS `pietglnoref`,`pie`.`piestatus` AS `piestatus`,`pie`.`piestatussebelumnya` AS `piestatussebelumnya`,`pie`.`piejmlrevisi` AS `piejmlrevisi`,`pie`.`piecetakanke` AS `piecetakanke`,`pie`.`pieinputuser` AS `pieinputuser`,`pie`.`pieinputtgl` AS `pieinputtgl`,`pie`.`piemodifikasiuser` AS `piemodifikasiuser`,`pie`.`piemodifikasitgl` AS `piemodifikasitgl`,`pie`.`pieposting` AS `pieposting`,`pie`.`piepostingtgl` AS `piepostingtgl`,`pie`.`pieisclose` AS `pieisclose`,`pie`.`piecustomtext1` AS `piecustomtext1`,`pie`.`piecustomtext2` AS `piecustomtext2`,`pie`.`piecustomtext3` AS `piecustomtext3`,`pie`.`piecustomtext4` AS `piecustomtext4`,`pie`.`piecustomtext5` AS `piecustomtext5`,`pie`.`piecustomint1` AS `piecustomint1`,`pie`.`piecustomint2` AS `piecustomint2`,`pie`.`piecustomint3` AS `piecustomint3`,`pie`.`piecustomdbl1` AS `piecustomdbl1`,`pie`.`piecustomdbl2` AS `piecustomdbl2`,`pie`.`piecustomdbl3` AS `piecustomdbl3`,`pie`.`piecustomdate1` AS `piecustomdate1`,`pie`.`piecustomdate2` AS `piecustomdate2`,`pie`.`piecustomdate3` AS `piecustomdate3`,`pied`.`idpiedetail` AS `idpiedetail`,`pied`.`idpie` AS `idpie`,`pied`.`sumber` AS `sumber`,`pied`.`idtransaksi` AS `idtransaksi`,`pied`.`catatan` AS `catatan`,`pied`.`urutan` AS `urutan`,`pied`.`isclose` AS `isclose`,`pied`.`customtext1` AS `customtext1`,`pied`.`customtext2` AS `customtext2`,`pied`.`customtext3` AS `customtext3`,`pied`.`customdbl1` AS `customdbl1`,`pied`.`customdbl2` AS `customdbl2`,`pied`.`customdbl3` AS `customdbl3`,`pied`.`customdate1` AS `customdate1`,`pied`.`customdate2` AS `customdate2`,`pied`.`customdate3` AS `customdate3`,ifnull(`ri`.`ricabang`,`prt`.`prtcabang`) AS `cabang`,ifnull(`ri`.`rilokasi`,`prt`.`prtlokasi`) AS `lokasi`,ifnull(`ri`.`rigudang`,`prt`.`prtgudang`) AS `gudang`,ifnull(`ri`.`rinotransaksi`,`prt`.`prtnotransaksi`) AS `notransaksi`,ifnull(`ri`.`ritgl`,`prt`.`prttgl`) AS `tgl`,ifnull(`ri`.`risupplier`,`prt`.`prtsupplier`) AS `supplier`,ifnull(`c`.`kkode`,'') AS `supplierkode`,ifnull(`c`.`knama`,'') AS `suppliernama`,ifnull(`ri`.`risupplierkontak`,`prt`.`prtsupplierkontak`) AS `supplierkontak`,ifnull(`ri`.`ritermin`,`prt`.`prttermin`) AS `termin`,ifnull(`ri`.`riuraian`,`prt`.`prturaian`) AS `uraian`,ifnull(`ri`.`rimatauang`,`prt`.`prtmatauang`) AS `matauang`,ifnull(`ri`.`rikurs`,`prt`.`prtkurs`) AS `kurs`,ifnull(`ri`.`ritotaltransaksi`,`prt`.`prttotaltransaksi`) AS `totaltransaksi`,ifnull(`ri`.`rijmlbayar`,`prt`.`prtjmlbayar`) AS `jmlbayar` from ((((`m4_pie` `pie` join `m4_pie_detail` `pied` on((`pie`.`pieid` = `pied`.`idpie`))) left join `m4_ri` `ri` on(((`pied`.`sumber` = `ri`.`risumber`) and (`pied`.`idtransaksi` = `ri`.`riid`)))) left join `m4_prt` `prt` on(((`pied`.`sumber` = `prt`.`prtsumber`) and (`pied`.`idtransaksi` = `prt`.`prtid`)))) left join `m1_contact` `c` on((ifnull(`ri`.`risupplier`,`prt`.`prtsupplier`) = `c`.`kid`)))
```

## Query 22

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_pie.vb`

```sql
select `pie`.`pieid` AS `pieid`,`pie`.`piecabang` AS `piecabang`,`pie`.`pielokasi` AS `pielokasi`,`pie`.`piesumber` AS `piesumber`,`pie`.`pienotransaksi` AS `pienotransaksi`,`pie`.`pietgl` AS `pietgl`,`pie`.`pieuraian` AS `pieuraian`,`pie`.`piecatatan` AS `piecatatan`,`pie`.`piestatus` AS `piestatus`,`pie`.`piestatussebelumnya` AS `piestatussebelumnya`,`pie`.`pieinputuser` AS `pieinputuser`,`pie`.`pieinputtgl` AS `pieinputtgl`,`pie`.`piemodifikasiuser` AS `piemodifikasiuser`,`pie`.`piemodifikasitgl` AS `piemodifikasitgl`,`br`.`bnama` AS `piecabangnama`,`lc`.`lnama` AS `pielokasinama`,`st1`.`nama` AS `piestatusnama`,`st2`.`nama` AS `piestatussebelumnyanama`,`u1`.`unama` AS `pieinputusernama`,`u2`.`unama` AS `piemodifikasiusernama`,IFNULL(c.kkode,'') AS supplierkode, ifnull(c.knama,'') AS suppliernama from ((((((`m4_pie` `pie` join `m1_branch` `br` on((`pie`.`piecabang` = `br`.`bkode`))) join `m1_location` `lc` on((`pie`.`pielokasi` = `lc`.`lkode`))) join `m0_status` `st1` on((`pie`.`piestatus` = `st1`.`kode`))) join `m0_status` `st2` on((`pie`.`piestatussebelumnya` = `st2`.`kode`))) join `m0_user` `u1` on((`pie`.`pieinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`pie`.`piemodifikasiuser` = `u2`.`userid`))) LEFT JOIN m1_contact c ON c.kid = pie.piekontak{'BUKA KONEKSI}
```

## Query 23

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_pie_history.vb`

```sql
select `pie`.`pieidhistory` AS `pieidhistory`,`pie`.`pieid` AS `pieid`,`pie`.`piecabang` AS `piecabang`,`pie`.`pielokasi` AS `pielokasi`,`pie`.`piesumber` AS `piesumber`,`pie`.`pieautonotransaksi` AS `pieautonotransaksi`,`pie`.`pienotransaksi` AS `pienotransaksi`,`pie`.`pietgl` AS `pietgl`,`pie`.`piekodepa` AS `piekodepa`,`pie`.`piekontak` AS `piekontak`,`pie`.`piekontakperson` AS `piekontakperson`,`pie`.`pie1alamat1` AS `pie1alamat1`,`pie`.`pie1alamat2` AS `pie1alamat2`,`pie`.`pie1alamat3` AS `pie1alamat3`,`pie`.`pie2alamat1` AS `pie2alamat1`,`pie`.`pie2alamat2` AS `pie2alamat2`,`pie`.`pie2alamat3` AS `pie2alamat3`,`pie`.`pieuraian` AS `pieuraian`,`pie`.`piecatatan` AS `piecatatan`,`pie`.`pienoref` AS `pienoref`,`pie`.`pietglnoref` AS `pietglnoref`,`pie`.`piestatus` AS `piestatus`,`pie`.`piestatussebelumnya` AS `piestatussebelumnya`,`pie`.`piejmlrevisi` AS `piejmlrevisi`,`pie`.`piecetakanke` AS `piecetakanke`,`pie`.`pieinputuser` AS `pieinputuser`,`pie`.`pieinputtgl` AS `pieinputtgl`,`pie`.`piemodifikasiuser` AS `piemodifikasiuser`,`pie`.`piemodifikasitgl` AS `piemodifikasitgl`,`pie`.`pieposting` AS `pieposting`,`pie`.`piepostingtgl` AS `piepostingtgl`,`pie`.`pieisclose` AS `pieisclose`,`pie`.`piecustomtext1` AS `piecustomtext1`,`pie`.`piecustomtext2` AS `piecustomtext2`,`pie`.`piecustomtext3` AS `piecustomtext3`,`pie`.`piecustomtext4` AS `piecustomtext4`,`pie`.`piecustomtext5` AS `piecustomtext5`,`pie`.`piecustomint1` AS `piecustomint1`,`pie`.`piecustomint2` AS `piecustomint2`,`pie`.`piecustomint3` AS `piecustomint3`,`pie`.`piecustomdbl1` AS `piecustomdbl1`,`pie`.`piecustomdbl2` AS `piecustomdbl2`,`pie`.`piecustomdbl3` AS `piecustomdbl3`,`pie`.`piecustomdate1` AS `piecustomdate1`,`pie`.`piecustomdate2` AS `piecustomdate2`,`pie`.`piecustomdate3` AS `piecustomdate3`,`pied`.`idhistorydetail` AS `idhistorydetail`,`pied`.`idhistory` AS `idhistory`,`pied`.`idpiedetail` AS `idpiedetail`,`pied`.`idpie` AS `idpie`,`pied`.`sumber` AS `sumber`,`pied`.`idtransaksi` AS `idtransaksi`,`pied`.`catatan` AS `catatan`,`pied`.`urutan` AS `urutan`,`pied`.`isclose` AS `isclose`,`pied`.`customtext1` AS `customtext1`,`pied`.`customtext2` AS `customtext2`,`pied`.`customtext3` AS `customtext3`,`pied`.`customdbl1` AS `customdbl1`,`pied`.`customdbl2` AS `customdbl2`,`pied`.`customdbl3` AS `customdbl3`,`pied`.`customdate1` AS `customdate1`,`pied`.`customdate2` AS `customdate2`,`pied`.`customdate3` AS `customdate3`,ifnull(`ri`.`ricabang`,`prt`.`prtcabang`) AS `cabang`,ifnull(`ri`.`rilokasi`,`prt`.`prtlokasi`) AS `lokasi`,ifnull(`ri`.`rigudang`,`prt`.`prtgudang`) AS `gudang`,ifnull(`ri`.`rinotransaksi`,`prt`.`prtnotransaksi`) AS `notransaksi`,ifnull(`ri`.`ritgl`,`prt`.`prttgl`) AS `tgl`,ifnull(`ri`.`risupplier`,`prt`.`prtsupplier`) AS `supplier`,ifnull(`c`.`kkode`,'') AS `supplierkode`,ifnull(`c`.`knama`,'') AS `suppliernama`,ifnull(`ri`.`risupplierkontak`,`prt`.`prtsupplierkontak`) AS `supplierkontak`,ifnull(`ri`.`ritermin`,`prt`.`prttermin`) AS `termin`,ifnull(`ri`.`riuraian`,`prt`.`prturaian`) AS `uraian`,ifnull(`ri`.`rimatauang`,`prt`.`prtmatauang`) AS `matauang`,ifnull(`ri`.`rikurs`,`prt`.`prtkurs`) AS `kurs`,ifnull(`ri`.`ritotaltransaksi`,`prt`.`prttotaltransaksi`) AS `totaltransaksi`,ifnull(`ri`.`rijmlbayar`,`prt`.`prtjmlbayar`) AS `jmlbayar` from ((((`m4_pie_history` `pie` join `m4_pie_detail_history` `pied` on((`pie`.`pieid` = `pied`.`idpie`))) left join `m4_ri` `ri` on(((`pied`.`sumber` = `ri`.`risumber`) and (`pied`.`idtransaksi` = `ri`.`riid`)))) left join `m4_prt` `prt` on(((`pied`.`sumber` = `prt`.`prtsumber`) and (`pied`.`idtransaksi` = `prt`.`prtid`)))) left join `m1_contact` `c` on((ifnull(`ri`.`risupplier`,`prt`.`prtsupplier`) = `c`.`kid`)))
```

## Query 24

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_pie_history.vb`

```sql
select `pie`.`pieidhistory` AS `pieidhistory`,`pie`.`pieid` AS `pieid`,`pie`.`piecabang` AS `piecabang`,`pie`.`pielokasi` AS `pielokasi`,`pie`.`piesumber` AS `piesumber`,`pie`.`pienotransaksi` AS `pienotransaksi`,`pie`.`pietgl` AS `pietgl`,`pie`.`pieuraian` AS `pieuraian`,`pie`.`piecatatan` AS `piecatatan`,`pie`.`piestatus` AS `piestatus`,`pie`.`piestatussebelumnya` AS `piestatussebelumnya`,`pie`.`pieinputuser` AS `pieinputuser`,`pie`.`pieinputtgl` AS `pieinputtgl`,`pie`.`piemodifikasiuser` AS `piemodifikasiuser`,`pie`.`piemodifikasitgl` AS `piemodifikasitgl`,`br`.`bnama` AS `piecabangnama`,`lc`.`lnama` AS `pielokasinama`,`st1`.`nama` AS `piestatusnama`,`st2`.`nama` AS `piestatussebelumnyanama`,`u1`.`unama` AS `pieinputusernama`,`u2`.`unama` AS `piemodifikasiusernama` from ((((((`m4_pie_history` `pie` join `m1_branch` `br` on((`pie`.`piecabang` = `br`.`bkode`))) join `m1_location` `lc` on((`pie`.`pielokasi` = `lc`.`lkode`))) join `m0_status` `st1` on((`pie`.`piestatus` = `st1`.`kode`))) join `m0_status` `st2` on((`pie`.`piestatussebelumnya` = `st2`.`kode`))) join `m0_user` `u1` on((`pie`.`pieinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`pie`.`piemodifikasiuser` = `u2`.`userid`)))
```

