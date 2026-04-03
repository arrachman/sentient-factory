# M3 Queries

Collected from `client-backend/api-myerpplus/app_code/ws/myerpplus.vb` dispatch targets under `app_code/ws/m3`.

Total queries: `246`

## `client-backend/api-myerpplus/app_code/ws/m3/m3_dc.vb`

```sql
SELECT COUNT(dcid), dcnotransaksi FROM M3_Dc WHERE dcid='{result_4}' AND dcstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(dcid) FROM m3_dc WHERE dcnotransaksi='{notransaksi}'
```

```sql
Update M3_Dc set dccabang = '{FixQuotes_drutama}dccabang', dclokasi = '{FixQuotes_drutama}dclokasi', dcgudangasal = '{FixQuotes_drutama}dcgudangasal', dcgudangtujuan = '{FixQuotes_drutama}dcgudangtujuan', dcsumber = '{FixQuotes_drutama}dcsumber', dcautonotransaksi = {drutama}dcautonotransaksi, dcnotransaksi = '{notransaksi}', dctgl = '{FixQuotes_AsFormatTanggal_drutama}dctgl', dckodepa = {drutama}dckodepa, dcdimintaoleh = {drutama}dcdimintaoleh, dcdimintaolehkontak = '{FixQuotes_drutama}dcdimintaolehkontak', dcmintake = {drutama}dcmintake, dctgldipakai = '{FixQuotes_AsFormatTanggal_drutama}dctgldipakai', dcuraian = '{FixQuotes_drutama}dcuraian', dccatatan = '{FixQuotes_drutama}dccatatan', dcnoref = '{FixQuotes_drutama}dcnoref', dctglnoref = '{FixQuotes_AsFormatTanggal_drutama}dctglnoref', dcstatusts = {drutama}dcstatusts, dcstatusrs = {drutama}dcstatusrs, dcstatus = {drutama}dcstatus, dcstatussebelumnya = {drutama}dcstatussebelumnya, dcjmlrevisi = dcjmlrevisi+1, dccetakanke = {drutama}dccetakanke, dcmodifikasiuser = {drutama}dcmodifikasiuser, dcmodifikasitgl = NOW(), dccustomtext1 = '{FixQuotes_drutama}dccustomtext1', dccustomtext2 = '{FixQuotes_drutama}dccustomtext2', dccustomtext3 = '{FixQuotes_drutama}dccustomtext3', dccustomtext4 = '{FixQuotes_drutama}dccustomtext4', dccustomtext5 = '{FixQuotes_drutama}dccustomtext5', dccustomint1 = {drutama}dccustomint1, dccustomint2 = {drutama}dccustomint2, dccustomint3 = {drutama}dccustomint3, dccustomdbl1 = '{FixDouble_drutama}dccustomdbl1', dccustomdbl2 = '{FixDouble_drutama}dccustomdbl2', dccustomdbl3 = '{FixDouble_drutama}dccustomdbl3', dccustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}dccustomdate1', dccustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}dccustomdate2', dccustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}dccustomdate3', dcshift = '{FixQuotes_drutama}dcshift', dcidbarang = '{FixQuotes_drutama}dcidbarang', dcnamabarang = '{FixQuotes_drutama}dcnamabarang', dctipebarang = '{FixQuotes_drutama}dctipebarang', dchmstart = '{FixQuotes_drutama}dchmstart', dchmstop = '{FixQuotes_drutama}dchmstop', dchmtotal = '{FixQuotes_drutama}dchmtotal' where dcid = '{drutama}dcid'
```

```sql
Insert into M3_Dc (dccabang, dclokasi, dcgudangasal, dcgudangtujuan, dcsumber, dcautonotransaksi, dcnotransaksi, dctgl, dckodepa, dcdimintaoleh, dcdimintaolehkontak, dcmintake, dctgldipakai, dcuraian, dccatatan, dcnoref, dctglnoref, dcstatusts, dcstatusrs, dcstatus, dcstatussebelumnya, dcjmlrevisi, dccetakanke, dcinputuser, dcinputtgl, dcmodifikasiuser, dcmodifikasitgl, dcisclose, dccustomtext1, dccustomtext2, dccustomtext3, dccustomtext4, dccustomtext5, dccustomint1, dccustomint2, dccustomint3, dccustomdbl1, dccustomdbl2, dccustomdbl3, dccustomdate1, dccustomdate2, dccustomdate3, dcshift, dcidbarang, dcnamabarang, dctipebarang, dchmstart, dchmstop, dchmtotal) values('{FixQuotes_drutama}dccabang', '{FixQuotes_drutama}dclokasi', '{FixQuotes_drutama}dcgudangasal', '{FixQuotes_drutama}dcgudangtujuan', '{FixQuotes_drutama}dcsumber', {drutama}dcautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}dctgl', {drutama}dckodepa, {drutama}dcdimintaoleh, '{FixQuotes_drutama}dcdimintaolehkontak', {drutama}dcmintake, '{FixQuotes_AsFormatTanggal_drutama}dctgldipakai', '{FixQuotes_drutama}dcuraian', '{FixQuotes_drutama}dccatatan', '{FixQuotes_drutama}dcnoref', '{FixQuotes_AsFormatTanggal_drutama}dctglnoref', {drutama}dcstatusts, {drutama}dcstatusrs, {drutama}dcstatus, {drutama}dcstatussebelumnya, {drutama}dcjmlrevisi, {drutama}dccetakanke, {drutama}dcinputuser, NOW(), {drutama}dcmodifikasiuser, '1971-01-01 00:00:00', {drutama}dcisclose, '{FixQuotes_drutama}dccustomtext1', '{FixQuotes_drutama}dccustomtext2', '{FixQuotes_drutama}dccustomtext3', '{FixQuotes_drutama}dccustomtext4', '{FixQuotes_drutama}dccustomtext5', {drutama}dccustomint1, {drutama}dccustomint2, {drutama}dccustomint3, '{FixDouble_drutama}dccustomdbl1', '{FixDouble_drutama}dccustomdbl2', '{FixDouble_drutama}dccustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}dccustomdate1', '{FixQuotes_AsFormatTanggal_drutama}dccustomdate2', '{FixQuotes_AsFormatTanggal_drutama}dccustomdate3', '{FixQuotes_drutama}dcshift', '{FixQuotes_drutama}dcidbarang', '{FixQuotes_drutama}dcnamabarang', '{FixQuotes_drutama}dctipebarang', '{FixQuotes_drutama}dchmstart', '{FixQuotes_drutama}dchmstop', '{FixQuotes_drutama}dchmtotal')
```

```sql
select dcid from M3_Dc where dcnotransaksi='{notransaksi}' AND Dcinputuser= '{userid}' order by Dcmodifikasitgl desc limit 1
```

```sql
Delete from M3_Dc_Detail where iddc = '{result_4}'
```

```sql
Insert into M3_Dc_Detail(iddcdetail, iddc, opstart, opend, sbstart, sbend, spstart, spend, rfstart, rfend, bdstart, bdend, cabang, lokasi, gudangasal, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, jmlrealisasi, statusrealisasi, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
Delete from M3_Dc_Check where iddc = '{result_4}'
```

```sql
Insert into M3_Dc_Check(iddccheck, iddc, idkategoricheck, catatan, status, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Dctgl, Dcnotransaksi, Dcstatus FROM m3_Dc WHERE Dcid='{idtransaksi}'
```

```sql
SELECT dcidbarang, dchmtotal FROM m3_dc WHERE dcid = '{idtransaksi}'
```

```sql
UPDATE M3_Dc SET Dcstatus = {nilaiStatus}, dcmodifikasiuser='{userid}', dcmodifikasitgl = NOW(), dcposting = 0, dcpostingtgl = '1971-01-01 00:00:00', dcjmlrevisi = dcjmlrevisi + 1 WHERE dcid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Dcid, Dcnotransaksi FROM m3_Dc WHERE Dcid='{idtransaksi}'
```

```sql
DELETE FROM M3_Dc_Check WHERE iddc = '{idtransaksi}'
```

```sql
DELETE FROM M3_Dc_Detail WHERE iddc = '{idtransaksi}'
```

```sql
DELETE FROM M3_Dc WHERE dcid = '{idtransaksi}'
```

```sql
select `dc`.`dcid` AS `dcid`,`dc`.`dccabang` AS `dccabang`,`dc`.`dclokasi` AS `dclokasi`,`dc`.`dcgudangasal` AS `dcgudangasal`,`dc`.`dcgudangtujuan` AS `dcgudangtujuan`,`dc`.`dcsumber` AS `dcsumber`,`dc`.`dcautonotransaksi` AS `dcautonotransaksi`,`dc`.`dcnotransaksi` AS `dcnotransaksi`,`dc`.`dctgl` AS `dctgl`,`dc`.`dckodepa` AS `dckodepa`,`dc`.`dcdimintaoleh` AS `dcdimintaoleh`,`dc`.`dcdimintaolehkontak` AS `dcdimintaolehkontak`,`dc`.`dcmintake` AS `dcmintake`,`dc`.`dctgldipakai` AS `dctgldipakai`,`dc`.`dcuraian` AS `dcuraian`,`dc`.`dccatatan` AS `dccatatan`,`dc`.`dcnoref` AS `dcnoref`,`dc`.`dctglnoref` AS `dctglnoref`,`dc`.`dcstatusts` AS `dcstatusts`,`dc`.`dcstatusrs` AS `dcstatusrs`,`dc`.`dcstatusrealisasi` AS `dcstatusrealisasi`,`dc`.`dcstatus` AS `dcstatus`,`dc`.`dcstatussebelumnya` AS `dcstatussebelumnya`,`dc`.`dcjmlrevisi` AS `dcjmlrevisi`,`dc`.`dccetakanke` AS `dccetakanke`,`dc`.`dcinputuser` AS `dcinputuser`,`dc`.`dcinputtgl` AS `dcinputtgl`,`dc`.`dcmodifikasiuser` AS `dcmodifikasiuser`,`dc`.`dcmodifikasitgl` AS `dcmodifikasitgl`,`dc`.`dcposting` AS `dcposting`,`dc`.`dcpostingtgl` AS `dcpostingtgl`,`dc`.`dcisclose` AS `dcisclose`,`dc`.`dccustomtext1` AS `dccustomtext1`,`dc`.`dccustomtext2` AS `dccustomtext2`,`dc`.`dccustomtext3` AS `dccustomtext3`,`dc`.`dccustomtext4` AS `dccustomtext4`,`dc`.`dccustomtext5` AS `dccustomtext5`,`dc`.`dccustomint1` AS `dccustomint1`,`dc`.`dccustomint2` AS `dccustomint2`,`dc`.`dccustomint3` AS `dccustomint3`,`dc`.`dccustomdbl1` AS `dccustomdbl1`,`dc`.`dccustomdbl2` AS `dccustomdbl2`,`dc`.`dccustomdbl3` AS `dccustomdbl3`,`dc`.`dccustomdate1` AS `dccustomdate1`,`dc`.`dccustomdate2` AS `dccustomdate2`,`dc`.`dccustomdate3` AS `dccustomdate3`,`br`.`bnama` AS `dccabangnama`,`lc`.`lnama` AS `dclokasinama`,`wh1`.`wnama` AS `dcgudangasalnama`,`wh2`.`wnama` AS `dcgudangtujuannama`,`c1`.`kkode` AS `dcdimintaolehkode`,`c1`.`knama` AS `dcdimintaolehnama`,`c2`.`kkode` AS `dcmintakekode`,`c2`.`knama` AS `dcmintakenama`,`st1`.`nama` AS `dcstatusnama`,`st2`.`nama` AS `dcstatussebelumnyanama`,`u1`.`unama` AS `dcinputusernama`,`u2`.`unama` AS `dcmodifikasiusernama`,`dc`.`dcshift` AS `dcshift`,`dc`.`dcidbarang` AS `dcidbarang`,`dc`.`dcnamabarang` AS `dcnamabarang`,`dc`.`dctipebarang` AS `dctipebarang`,`dc`.`dchmstart` AS `dchmstart`,`dc`.`dchmstop` AS `dchmstop`,`dc`.`dchmtotal` AS `dchmtotal`,`ih`.`bkode` AS `dckodebarang`,`dcd`.`iddcdetail` AS `iddcdetail`,`dcd`.`iddc` AS `iddc`,`dcd`.`opstart` AS `opstart`,`dcd`.`opend` AS `opend`,`dcd`.`sbstart` AS `sbstart`,`dcd`.`sbend` AS `sbend`,`dcd`.`spstart` AS `spstart`,`dcd`.`spend` AS `spend`,`dcd`.`rfstart` AS `rfstart`,`dcd`.`rfend` AS `rfend`,`dcd`.`bdstart` AS `bdstart`,`dcd`.`bdend` AS `bdend`,`dcd`.`cabang` AS `cabang`,`dcd`.`lokasi` AS `lokasi`,`dcd`.`gudangasal` AS `gudangasal`,`dcd`.`gudangtujuan` AS `gudangtujuan`,`dcd`.`costcenter` AS `costcenter`,`dcd`.`divisi` AS `divisi`,`dcd`.`subdivisi` AS `subdivisi`,`dcd`.`proyek` AS `proyek`,`dcd`.`catatan` AS `catatan`,`dcd`.`urutan` AS `urutan`,`dcd`.`jmlrealisasi` AS `jmlrealisasi`,`dcd`.`statusrealisasi` AS `statusrealisasi`,`dcd`.`isclose` AS `isclose`,`dcd`.`customtext1` AS `customtext1`,`dcd`.`customtext2` AS `customtext2`,`dcd`.`customtext3` AS `customtext3`,`dcd`.`customdbl1` AS `customdbl1`,`dcd`.`customdbl2` AS `customdbl2`,`dcd`.`customdbl3` AS `customdbl3`,`dcd`.`customdate1` AS `customdate1`,`dcd`.`customdate2` AS `customdate2`,`dcd`.`customdate3` AS `customdate3`,`brd`.`bnama` AS `cabangnama`,`lcd`.`lnama` AS `lokasinama`,`whd1`.`wnama` AS `gudangasalnama`,`whd2`.`wnama` AS `gudangtujuannama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama` from ((((((((((((((((((((`m3_dc` `dc` join `m3_dc_detail` `dcd` on((`dc`.`dcid` = `dcd`.`iddc`))) left join `m1_branch` `br` on((`br`.`bkode` = `dc`.`dccabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `dc`.`dclokasi`))) left join `m1_warehouse` `wh1` on((`wh1`.`wkode` = `dc`.`dcgudangasal`))) left join `m1_warehouse` `wh2` on((`wh2`.`wkode` = `dc`.`dcgudangtujuan`))) left join `m1_contact` `c1` on((`c1`.`kid` = `dc`.`dcdimintaoleh`))) left join `m1_contact` `c2` on((`c2`.`kid` = `dc`.`dcmintake`))) left join `m1_item_hauling` `ih` on((`dc`.`dcidbarang` = `ih`.`bid`))) left join `m0_status` `st1` on((`st1`.`kode` = `dc`.`dcstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `dc`.`dcstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `dc`.`dcinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `dc`.`dcmodifikasiuser`))) left join `m1_branch` `brd` on((`dcd`.`cabang` = `brd`.`bkode`))) left join `m1_location` `lcd` on((`dcd`.`lokasi` = `lcd`.`lkode`))) left join `m1_warehouse` `whd1` on((`dcd`.`gudangasal` = `whd1`.`wkode`))) left join `m1_warehouse` `whd2` on((`dcd`.`gudangtujuan` = `whd2`.`wkode`))) left join `m1_cost_center` `cc` on((`dcd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`dcd`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`dcd`.`subdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`dcd`.`proyek` = `p`.`pkode`)))
```

```sql
select `dcc`.`iddccheck` AS `iddccheck`,`dcc`.`iddc` AS `iddc`,`dcc`.`idkategoricheck` AS `idkategoricheck`,`dcc`.`catatan` AS `catatan`,`dcc`.`status` AS `status`,`dcc`.`urutan` AS `urutan`,`dcc`.`isclose` AS `isclose`,`dcc`.`customtext1` AS `customtext1`,`dcc`.`customtext2` AS `customtext2`,`dcc`.`customtext3` AS `customtext3`,`dcc`.`customdbl1` AS `customdbl1`,`dcc`.`customdbl2` AS `customdbl2`,`dcc`.`customdbl3` AS `customdbl3`,`dcc`.`customdate1` AS `customdate1`,`dcc`.`customdate2` AS `customdate2`,`dcc`.`customdate3` AS `customdate3`,`chc`.`ccnama` AS `ccnama` from (`m3_dc_check` `dcc` left join `m1_checking_category` `chc` on((`dcc`.`idkategoricheck` = `chc`.`ccid`)))
```

```sql
select `dc`.`dcid` AS `dcid`,`dc`.`dccabang` AS `dccabang`,`dc`.`dclokasi` AS `dclokasi`,`dc`.`dcgudangasal` AS `dcgudangasal`,`dc`.`dcgudangtujuan` AS `dcgudangtujuan`,`dc`.`dcsumber` AS `dcsumber`,`dc`.`dcautonotransaksi` AS `dcautonotransaksi`,`dc`.`dcnotransaksi` AS `dcnotransaksi`,`dc`.`dctgl` AS `dctgl`,`dc`.`dckodepa` AS `dckodepa`,`dc`.`dcdimintaoleh` AS `dcdimintaoleh`,`dc`.`dcdimintaolehkontak` AS `dcdimintaolehkontak`,`dc`.`dcmintake` AS `dcmintake`,`dc`.`dctgldipakai` AS `dctgldipakai`,`dc`.`dcuraian` AS `dcuraian`,`dc`.`dccatatan` AS `dccatatan`,`dc`.`dcnoref` AS `dcnoref`,`dc`.`dctglnoref` AS `dctglnoref`,`dc`.`dcstatusts` AS `dcstatusts`,`dc`.`dcstatusrs` AS `dcstatusrs`,`dc`.`dcstatusrealisasi` AS `dcstatusrealisasi`,`dc`.`dcstatus` AS `dcstatus`,`dc`.`dcstatussebelumnya` AS `dcstatussebelumnya`,`dc`.`dcjmlrevisi` AS `dcjmlrevisi`,`dc`.`dccetakanke` AS `dccetakanke`,`dc`.`dcinputuser` AS `dcinputuser`,`dc`.`dcinputtgl` AS `dcinputtgl`,`dc`.`dcmodifikasiuser` AS `dcmodifikasiuser`,`dc`.`dcmodifikasitgl` AS `dcmodifikasitgl`,`dc`.`dcposting` AS `dcposting`,`dc`.`dcpostingtgl` AS `dcpostingtgl`,`dc`.`dcisclose` AS `dcisclose`,`br`.`bnama` AS `dccabangnama`,`lc`.`lnama` AS `dclokasinama`,`wh1`.`wnama` AS `dcgudangasalnama`,`wh2`.`wnama` AS `dcgudangtujuannama`,`c1`.`kkode` AS `dcdimintaolehkode`,`c1`.`knama` AS `dcdimintaolehnama`,`c2`.`kkode` AS `dcmintakekode`,`c2`.`knama` AS `dcmintakenama`,`st1`.`nama` AS `dcstatusnama`,`st2`.`nama` AS `dcstatussebelumnyanama`,`u1`.`unama` AS `dcinputusernama`,`u2`.`unama` AS `dcmodifikasiusernama`,`dc`.`dcshift` AS `dcshift`,`dc`.`dcidbarang` AS `dcidbarang`,`dc`.`dcnamabarang` AS `dcnamabarang`,`dc`.`dctipebarang` AS `dctipebarang`,`dc`.`dchmstart` AS `dchmstart`,`dc`.`dchmstop` AS `dchmstop`,`dc`.`dchmtotal` AS `dchmtotal`,`ih`.`bkode` AS `dckodebarang` from (((((((((((`m3_dc` `dc` left join `m1_item_hauling` `ih` on((`dc`.`dcidbarang` = `ih`.`bid`))) left join `m1_branch` `br` on((`br`.`bkode` = `dc`.`dccabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `dc`.`dclokasi`))) left join `m1_warehouse` `wh1` on((`wh1`.`wkode` = `dc`.`dcgudangasal`))) left join `m1_warehouse` `wh2` on((`wh2`.`wkode` = `dc`.`dcgudangtujuan`))) left join `m1_contact` `c1` on((`c1`.`kid` = `dc`.`dcdimintaoleh`))) left join `m1_contact` `c2` on((`c2`.`kid` = `dc`.`dcmintake`))) left join `m0_status` `st1` on((`st1`.`kode` = `dc`.`dcstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `dc`.`dcstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `dc`.`dcinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `dc`.`dcmodifikasiuser`)))
```

## `client-backend/api-myerpplus/app_code/ws/m3/m3_dc_history.vb`

```sql
INSERT INTO M3_Dc_history(SELECT 0, dc.* FROM M3_Dc dc WHERE dc.dcid = '{idtransaksi}')
```

```sql
SELECT dcidhistory FROM M3_Dc_History WHERE dcid = '{idtransaksi}' ORDER BY dcmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO M3_Dc_Detail_History (SELECT 0, '{result_4}', dc.* FROM M3_Dc_Detail dc WHERE dc.iddc = '{idtransaksi}' )
```

```sql
INSERT INTO M3_Dc_Check_History (SELECT 0, '{result_4}', dc.* FROM M3_Dc_Check dc WHERE dc.iddc = '{idtransaksi}' )
```

```sql
select `dc`.`dcidhistory` AS `dcidhistory`,`dc`.`dcid` AS `dcid`,`dc`.`dccabang` AS `dccabang`,`dc`.`dclokasi` AS `dclokasi`,`dc`.`dcgudangasal` AS `dcgudangasal`,`dc`.`dcgudangtujuan` AS `dcgudangtujuan`,`dc`.`dcsumber` AS `dcsumber`,`dc`.`dcautonotransaksi` AS `dcautonotransaksi`,`dc`.`dcnotransaksi` AS `dcnotransaksi`,`dc`.`dctgl` AS `dctgl`,`dc`.`dckodepa` AS `dckodepa`,`dc`.`dcdimintaoleh` AS `dcdimintaoleh`,`dc`.`dcdimintaolehkontak` AS `dcdimintaolehkontak`,`dc`.`dcmintake` AS `dcmintake`,`dc`.`dctgldipakai` AS `dctgldipakai`,`dc`.`dcuraian` AS `dcuraian`,`dc`.`dccatatan` AS `dccatatan`,`dc`.`dcnoref` AS `dcnoref`,`dc`.`dctglnoref` AS `dctglnoref`,`dc`.`dcstatusts` AS `dcstatusts`,`dc`.`dcstatusrs` AS `dcstatusrs`,`dc`.`dcstatusrealisasi` AS `dcstatusrealisasi`,`dc`.`dcstatus` AS `dcstatus`,`dc`.`dcstatussebelumnya` AS `dcstatussebelumnya`,`dc`.`dcjmlrevisi` AS `dcjmlrevisi`,`dc`.`dccetakanke` AS `dccetakanke`,`dc`.`dcinputuser` AS `dcinputuser`,`dc`.`dcinputtgl` AS `dcinputtgl`,`dc`.`dcmodifikasiuser` AS `dcmodifikasiuser`,`dc`.`dcmodifikasitgl` AS `dcmodifikasitgl`,`dc`.`dcposting` AS `dcposting`,`dc`.`dcpostingtgl` AS `dcpostingtgl`,`dc`.`dcisclose` AS `dcisclose`,`br`.`bnama` AS `dccabangnama`,`lc`.`lnama` AS `dclokasinama`,`wh1`.`wnama` AS `dcgudangasalnama`,`wh2`.`wnama` AS `dcgudangtujuannama`,`c1`.`kkode` AS `dcdimintaolehkode`,`c1`.`knama` AS `dcdimintaolehnama`,`c2`.`kkode` AS `dcmintakekode`,`c2`.`knama` AS `dcmintakenama`,`st1`.`nama` AS `dcstatusnama`,`st2`.`nama` AS `dcstatussebelumnyanama`,`u1`.`unama` AS `dcinputusernama`,`u2`.`unama` AS `dcmodifikasiusernama`,`dc`.`dcshift` AS `dcshift`,`dc`.`dcidbarang` AS `dcidbarang`,`dc`.`dcnamabarang` AS `dcnamabarang`,`dc`.`dctipebarang` AS `dctipebarang`,`dc`.`dchmstart` AS `dchmstart`,`dc`.`dchmstop` AS `dchmstop`,`dc`.`dchmtotal` AS `dchmtotal`,`ih`.`bkode` AS `dckodebarang` from (((((((((((`m3_dc_history` `dc` left join `m1_item_hauling` `ih` on((`dc`.`dcidbarang` = `ih`.`bid`))) left join `m1_branch` `br` on((`br`.`bkode` = `dc`.`dccabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `dc`.`dclokasi`))) left join `m1_warehouse` `wh1` on((`wh1`.`wkode` = `dc`.`dcgudangasal`))) left join `m1_warehouse` `wh2` on((`wh2`.`wkode` = `dc`.`dcgudangtujuan`))) left join `m1_contact` `c1` on((`c1`.`kid` = `dc`.`dcdimintaoleh`))) left join `m1_contact` `c2` on((`c2`.`kid` = `dc`.`dcmintake`))) left join `m0_status` `st1` on((`st1`.`kode` = `dc`.`dcstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `dc`.`dcstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `dc`.`dcinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `dc`.`dcmodifikasiuser`)))
```

```sql
select `dc`.`dcidhistory` AS `dcidhistory`,`dc`.`dcid` AS `dcid`,`dc`.`dccabang` AS `dccabang`,`dc`.`dclokasi` AS `dclokasi`,`dc`.`dcgudangasal` AS `dcgudangasal`,`dc`.`dcgudangtujuan` AS `dcgudangtujuan`,`dc`.`dcsumber` AS `dcsumber`,`dc`.`dcautonotransaksi` AS `dcautonotransaksi`,`dc`.`dcnotransaksi` AS `dcnotransaksi`,`dc`.`dctgl` AS `dctgl`,`dc`.`dckodepa` AS `dckodepa`,`dc`.`dcdimintaoleh` AS `dcdimintaoleh`,`dc`.`dcdimintaolehkontak` AS `dcdimintaolehkontak`,`dc`.`dcmintake` AS `dcmintake`,`dc`.`dctgldipakai` AS `dctgldipakai`,`dc`.`dcuraian` AS `dcuraian`,`dc`.`dccatatan` AS `dccatatan`,`dc`.`dcnoref` AS `dcnoref`,`dc`.`dctglnoref` AS `dctglnoref`,`dc`.`dcstatusts` AS `dcstatusts`,`dc`.`dcstatusrs` AS `dcstatusrs`,`dc`.`dcstatusrealisasi` AS `dcstatusrealisasi`,`dc`.`dcstatus` AS `dcstatus`,`dc`.`dcstatussebelumnya` AS `dcstatussebelumnya`,`dc`.`dcjmlrevisi` AS `dcjmlrevisi`,`dc`.`dccetakanke` AS `dccetakanke`,`dc`.`dcinputuser` AS `dcinputuser`,`dc`.`dcinputtgl` AS `dcinputtgl`,`dc`.`dcmodifikasiuser` AS `dcmodifikasiuser`,`dc`.`dcmodifikasitgl` AS `dcmodifikasitgl`,`dc`.`dcposting` AS `dcposting`,`dc`.`dcpostingtgl` AS `dcpostingtgl`,`dc`.`dcisclose` AS `dcisclose`,`dc`.`dccustomtext1` AS `dccustomtext1`,`dc`.`dccustomtext2` AS `dccustomtext2`,`dc`.`dccustomtext3` AS `dccustomtext3`,`dc`.`dccustomtext4` AS `dccustomtext4`,`dc`.`dccustomtext5` AS `dccustomtext5`,`dc`.`dccustomint1` AS `dccustomint1`,`dc`.`dccustomint2` AS `dccustomint2`,`dc`.`dccustomint3` AS `dccustomint3`,`dc`.`dccustomdbl1` AS `dccustomdbl1`,`dc`.`dccustomdbl2` AS `dccustomdbl2`,`dc`.`dccustomdbl3` AS `dccustomdbl3`,`dc`.`dccustomdate1` AS `dccustomdate1`,`dc`.`dccustomdate2` AS `dccustomdate2`,`dc`.`dccustomdate3` AS `dccustomdate3`,`br`.`bnama` AS `dccabangnama`,`lc`.`lnama` AS `dclokasinama`,`wh1`.`wnama` AS `dcgudangasalnama`,`wh2`.`wnama` AS `dcgudangtujuannama`,`c1`.`kkode` AS `dcdimintaolehkode`,`c1`.`knama` AS `dcdimintaolehnama`,`c2`.`kkode` AS `dcmintakekode`,`c2`.`knama` AS `dcmintakenama`,`st1`.`nama` AS `dcstatusnama`,`st2`.`nama` AS `dcstatussebelumnyanama`,`u1`.`unama` AS `dcinputusernama`,`u2`.`unama` AS `dcmodifikasiusernama`,`dc`.`dcshift` AS `dcshift`,`dc`.`dcidbarang` AS `dcidbarang`,`dc`.`dcnamabarang` AS `dcnamabarang`,`dc`.`dctipebarang` AS `dctipebarang`,`dc`.`dchmstart` AS `dchmstart`,`dc`.`dchmstop` AS `dchmstop`,`dc`.`dchmtotal` AS `dchmtotal`,`ih`.`bkode` AS `dckodebarang`,`dcd`.`iddcdetailhistory` AS `iddcdetailhistory`,`dcd`.`iddchistory` AS `iddchistory`,`dcd`.`iddcdetail` AS `iddcdetail`,`dcd`.`iddc` AS `iddc`,`dcd`.`opstart` AS `opstart`,`dcd`.`opend` AS `opend`,`dcd`.`sbstart` AS `sbstart`,`dcd`.`sbend` AS `sbend`,`dcd`.`spstart` AS `spstart`,`dcd`.`spend` AS `spend`,`dcd`.`rfstart` AS `rfstart`,`dcd`.`rfend` AS `rfend`,`dcd`.`bdstart` AS `bdstart`,`dcd`.`bdend` AS `bdend`,`dcd`.`cabang` AS `cabang`,`dcd`.`lokasi` AS `lokasi`,`dcd`.`gudangasal` AS `gudangasal`,`dcd`.`gudangtujuan` AS `gudangtujuan`,`dcd`.`costcenter` AS `costcenter`,`dcd`.`divisi` AS `divisi`,`dcd`.`subdivisi` AS `subdivisi`,`dcd`.`proyek` AS `proyek`,`dcd`.`catatan` AS `catatan`,`dcd`.`urutan` AS `urutan`,`dcd`.`jmlrealisasi` AS `jmlrealisasi`,`dcd`.`statusrealisasi` AS `statusrealisasi`,`dcd`.`isclose` AS `isclose`,`dcd`.`customtext1` AS `customtext1`,`dcd`.`customtext2` AS `customtext2`,`dcd`.`customtext3` AS `customtext3`,`dcd`.`customdbl1` AS `customdbl1`,`dcd`.`customdbl2` AS `customdbl2`,`dcd`.`customdbl3` AS `customdbl3`,`dcd`.`customdate1` AS `customdate1`,`dcd`.`customdate2` AS `customdate2`,`dcd`.`customdate3` AS `customdate3`,`brd`.`bnama` AS `cabangnama`,`lcd`.`lnama` AS `lokasinama`,`whd1`.`wnama` AS `gudangasalnama`,`whd2`.`wnama` AS `gudangtujuannama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama` from ((((((((((((((((((((`m3_dc_history` `dc` join `m3_dc_detail_history` `dcd` on((`dc`.`dcid` = `dcd`.`iddc`))) left join `m1_branch` `br` on((`br`.`bkode` = `dc`.`dccabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `dc`.`dclokasi`))) left join `m1_warehouse` `wh1` on((`wh1`.`wkode` = `dc`.`dcgudangasal`))) left join `m1_warehouse` `wh2` on((`wh2`.`wkode` = `dc`.`dcgudangtujuan`))) left join `m1_contact` `c1` on((`c1`.`kid` = `dc`.`dcdimintaoleh`))) left join `m1_contact` `c2` on((`c2`.`kid` = `dc`.`dcmintake`))) left join `m1_item_hauling` `ih` on((`dc`.`dcidbarang` = `ih`.`bid`))) left join `m0_status` `st1` on((`st1`.`kode` = `dc`.`dcstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `dc`.`dcstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `dc`.`dcinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `dc`.`dcmodifikasiuser`))) left join `m1_branch` `brd` on((`dcd`.`cabang` = `brd`.`bkode`))) left join `m1_location` `lcd` on((`dcd`.`lokasi` = `lcd`.`lkode`))) left join `m1_warehouse` `whd1` on((`dcd`.`gudangasal` = `whd1`.`wkode`))) left join `m1_warehouse` `whd2` on((`dcd`.`gudangtujuan` = `whd2`.`wkode`))) left join `m1_cost_center` `cc` on((`dcd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`dcd`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`dcd`.`subdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`dcd`.`proyek` = `p`.`pkode`)))
```

```sql
select `dcc`.`iddccheckhistory` AS `iddccheckhistory`,`dcc`.`iddchistory` AS `iddchistory`,`dcc`.`iddccheck` AS `iddccheck`,`dcc`.`iddc` AS `iddc`,`dcc`.`idkategoricheck` AS `idkategoricheck`,`dcc`.`catatan` AS `catatan`,`dcc`.`status` AS `status`,`dcc`.`urutan` AS `urutan`,`dcc`.`isclose` AS `isclose`,`dcc`.`customtext1` AS `customtext1`,`dcc`.`customtext2` AS `customtext2`,`dcc`.`customtext3` AS `customtext3`,`dcc`.`customdbl1` AS `customdbl1`,`dcc`.`customdbl2` AS `customdbl2`,`dcc`.`customdbl3` AS `customdbl3`,`dcc`.`customdate1` AS `customdate1`,`dcc`.`customdate2` AS `customdate2`,`dcc`.`customdate3` AS `customdate3`,`chc`.`ccnama` AS `ccnama` from (`m3_dc_check_history` `dcc` left join `m1_checking_category` `chc` on((`dcc`.`idkategoricheck` = `chc`.`ccid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m3/m3_files.vb`

```sql
UPDATE m3_files SET fcatatan = CASE fnamafile {strValue1_ToString} ELSE fcatatan END, fukuranfile = CASE fnamafile {strValue2_ToString} ELSE fukuranfile END, ftanggal = CASE fnamafile {strValue3_ToString} ELSE ftanggal END WHERE fsumber='{sumber}' AND fidtransaksi='{idtrans}'
```

```sql
Insert into M3_Files(fsumber, fidtransaksi, fnamafile, fcatatan, fukuranfile, ftanggal, finputuser, finputtgl) values{strValue1_ToString}
```

```sql
DELETE FROM M3_Files WHERE fsumber = '{sumber}' AND fidtransaksi ='{idtransaksi}' AND fnamafile='{namafile}'
```

## `client-backend/api-myerpplus/app_code/ws/m3/m3_ib.vb`

```sql
SELECT COUNT(ibid), ibnotransaksi FROM M3_Ib WHERE ibid='{result_4}' AND ibstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(ibid) FROM M3_Ib WHERE ibnotransaksi='{notransaksi}'
```

```sql
Update M3_Ib set ibcabang = '{FixQuotes_drutama}ibcabang', iblokasi = '{FixQuotes_drutama}iblokasi', ibgudang = '{FixQuotes_drutama}ibgudang', ibsumber = '{FixQuotes_drutama}ibsumber', ibjenis = '{FixQuotes_drutama}ibjenis', ibautonotransaksi = {drutama}ibautonotransaksi, ibnotransaksi = '{notransaksi}', ibtgl = '{FixQuotes_AsFormatTanggal_drutama}ibtgl', ibkodepa = {drutama}ibkodepa, ibbagianib = '{FixQuotes_drutama}ibbagianib', ibbagianibkontak = '{FixQuotes_drutama}ibbagianibkontak', ibmatauang = '{FixQuotes_drutama}ibmatauang', ibkurs = '{FixDouble_drutama}ibkurs', iburaian = '{FixQuotes_drutama}iburaian', ibcatatan = '{FixQuotes_drutama}ibcatatan', ibnoref = '{FixQuotes_drutama}ibnoref', ibtglnoref = '{FixQuotes_AsFormatTanggal_drutama}ibtglnoref', ibstatus = {drutama}ibstatus, ibstatussebelumnya = {drutama}ibstatussebelumnya, ibjmlrevisi = ibjmlrevisi + 1, ibcetakanke = {drutama}ibcetakanke, ibmodifikasiuser = '{FixQuotes_drutama}ibmodifikasiuser', ibmodifikasitgl = NOW(), ibposting = 0, ibtutupperiode = {drutama}ibtutupperiode, ibcustomtext1 = '{FixQuotes_drutama}ibcustomtext1', ibcustomtext2 = '{FixQuotes_drutama}ibcustomtext2', ibcustomtext3 = '{FixQuotes_drutama}ibcustomtext3', ibcustomtext4 = '{FixQuotes_drutama}ibcustomtext4', ibcustomtext5 = '{FixQuotes_drutama}ibcustomtext5', ibcustomint1 = {drutama}ibcustomint1, ibcustomint2 = {drutama}ibcustomint2, ibcustomint3 = {drutama}ibcustomint3, ibcustomdbl1 = '{FixDouble_drutama}ibcustomdbl1', ibcustomdbl2 = '{FixDouble_drutama}ibcustomdbl2', ibcustomdbl3 = '{FixDouble_drutama}ibcustomdbl3', ibcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}ibcustomdate1', ibcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}ibcustomdate2', ibcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}ibcustomdate3' where ibid = '{drutama}ibid'
```

```sql
Insert into M3_Ib (ibcabang, iblokasi, ibgudang, ibsumber, ibjenis, ibautonotransaksi, ibnotransaksi, ibtgl, ibkodepa, ibbagianib, ibbagianibkontak, ibmatauang, ibkurs, iburaian, ibcatatan, ibnoref, ibtglnoref, ibstatus, ibstatussebelumnya, ibjmlrevisi, ibcetakanke, ibinputuser, ibinputtgl, ibmodifikasiuser, ibmodifikasitgl, ibposting, ibpostingtgl, ibtutupperiode, ibisclose, ibcustomtext1, ibcustomtext2, ibcustomtext3, ibcustomtext4, ibcustomtext5, ibcustomint1, ibcustomint2, ibcustomint3, ibcustomdbl1, ibcustomdbl2, ibcustomdbl3, ibcustomdate1, ibcustomdate2, ibcustomdate3) values('{FixQuotes_drutama}ibcabang', '{FixQuotes_drutama}iblokasi', '{FixQuotes_drutama}ibgudang', '{FixQuotes_drutama}ibsumber', '{FixQuotes_drutama}ibjenis', {drutama}ibautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}ibtgl', '{FixQuotes_drutama}ibkodepa', '{FixQuotes_drutama}ibbagianib', '{FixQuotes_drutama}ibbagianibkontak', '{FixQuotes_drutama}ibmatauang', '{FixDouble_drutama}ibkurs', '{FixQuotes_drutama}iburaian', '{FixQuotes_drutama}ibcatatan', '{FixQuotes_drutama}ibnoref', '{FixQuotes_AsFormatTanggal_drutama}ibtglnoref', {drutama}ibstatus, {drutama}ibstatussebelumnya, {drutama}ibjmlrevisi, {drutama}ibcetakanke, '{FixQuotes_drutama}ibinputuser', NOW(), '{FixQuotes_drutama}ibmodifikasiuser', '1971-01-01 00:00:00', 0, '1971-01-01 00:00:00', {drutama}ibtutupperiode, {drutama}ibisclose, '{FixQuotes_drutama}ibcustomtext1', '{FixQuotes_drutama}ibcustomtext2', '{FixQuotes_drutama}ibcustomtext3', '{FixQuotes_drutama}ibcustomtext4', '{FixQuotes_drutama}ibcustomtext5', {drutama}ibcustomint1, {drutama}ibcustomint2, {drutama}ibcustomint3, '{FixDouble_drutama}ibcustomdbl1', '{FixDouble_drutama}ibcustomdbl2', '{FixDouble_drutama}ibcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}ibcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}ibcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}ibcustomdate3')
```

```sql
select ibid from M3_Ib where ibnotransaksi='{notransaksi}' AND ibinputuser= '{userid}' order by ibmodifikasitgl desc limit 1
```

```sql
Delete from M3_Ib_Detail where idib = '{result_4}'
```

```sql
Insert into M3_Ib_Detail(idibdetail, idib, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, hpplama, hpp, rekpersediaan, cabang, lokasi, gudang, costcenter, divisi, subdivisi, proyek, catatan, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
SELECT ibd.idibdetail, ibd.idbarang, ibd.namabarang, ibd.tipebarang, ibd.jml, ibd.satuan, ibd.jmlbarang, ibd.satuanbarang, ibd.matauang, ibd.kurs, ibd.hpp, ibd.gudang, ibd.catatan, ibd.costcenter, ibd.divisi, ibd.subdivisi, ibd.proyek, ib.ibinputtgl, i.bhpp FROM m3_ib_detail ibd JOIN m3_ib ib ON ibd.idib = ib.ibid JOIN m1_item i ON ibd.idbarang = i.bid WHERE ibd.idib = '{result_4}' ORDER BY ibd.urutan
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Ibtgl, Ibnotransaksi, Ibstatus FROM M3_Ib WHERE Ibid='{idtransaksi}'
```

```sql
SELECT idibdetail, idbarang, tipebarang, namabarang, satuan, nilaisatuan, jmlbarang, gudang, urutan FROM M3_Ib_detail WHERE idib = '{idtransaksi}'
```

```sql
DELETE a FROM m7_asset_transaction atr JOIN m3_ib ib ON atr.atsumber = ib.ibsumber AND atr.atidutama = ib.ibid AND ib.ibid = '{idtransaksi}' JOIN m7_asset a ON atr.atkode = a.akode
```

```sql
UPDATE M3_Ib SET IBstatus = {nilaiStatus}, IBmodifikasiuser='{userid}', IBmodifikasitgl = NOW(), IBposting = 0, IBpostingtgl = '1971-01-01 00:00:00', IBjmlrevisi = IBjmlrevisi + 1 WHERE IBid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Ibid, Ibnotransaksi FROM M3_Ib WHERE Ibid='{idtransaksi}'
```

```sql
DELETE FROM M3_Ib_Detail WHERE idIb = '{idtransaksi}'
```

```sql
DELETE FROM M3_Ib WHERE Ibid = '{idtransaksi}'
```

```sql
select `ib`.`ibid` AS `ibid`,`ib`.`ibcabang` AS `ibcabang`,`ib`.`iblokasi` AS `iblokasi`,`ib`.`ibgudang` AS `ibgudang`,`ib`.`ibsumber` AS `ibsumber`,`ib`.`ibjenis` AS `ibjenis`,`ib`.`ibautonotransaksi` AS `ibautonotransaksi`,`ib`.`ibnotransaksi` AS `ibnotransaksi`,`ib`.`ibtgl` AS `ibtgl`,`ib`.`ibkodepa` AS `ibkodepa`,`ib`.`ibbagianib` AS `ibbagianib`,`ib`.`ibbagianibkontak` AS `ibbagianibkontak`,`ib`.`ibmatauang` AS `ibmatauang`,`ib`.`ibkurs` AS `ibkurs`,`ib`.`iburaian` AS `iburaian`,`ib`.`ibcatatan` AS `ibcatatan`,`ib`.`ibnoref` AS `ibnoref`,`ib`.`ibtglnoref` AS `ibtglnoref`,`ib`.`ibstatus` AS `ibstatus`,`ib`.`ibstatussebelumnya` AS `ibstatussebelumnya`,`ib`.`ibjmlrevisi` AS `ibjmlrevisi`,`ib`.`ibcetakanke` AS `ibcetakanke`,`ib`.`ibinputuser` AS `ibinputuser`,`ib`.`ibinputtgl` AS `ibinputtgl`,`ib`.`ibmodifikasiuser` AS `ibmodifikasiuser`,`ib`.`ibmodifikasitgl` AS `ibmodifikasitgl`,`ib`.`ibposting` AS `ibposting`,`ib`.`ibpostingtgl` AS `ibpostingtgl`,`ib`.`ibtutupperiode` AS `ibtutupperiode`,`ib`.`ibisclose` AS `ibisclose`,`ib`.`ibcustomtext1` AS `ibcustomtext1`,`ib`.`ibcustomtext2` AS `ibcustomtext2`,`ib`.`ibcustomtext3` AS `ibcustomtext3`,`ib`.`ibcustomtext4` AS `ibcustomtext4`,`ib`.`ibcustomtext5` AS `ibcustomtext5`,`ib`.`ibcustomint1` AS `ibcustomint1`,`ib`.`ibcustomint2` AS `ibcustomint2`,`ib`.`ibcustomint3` AS `ibcustomint3`,`ib`.`ibcustomdbl1` AS `ibcustomdbl1`,`ib`.`ibcustomdbl2` AS `ibcustomdbl2`,`ib`.`ibcustomdbl3` AS `ibcustomdbl3`,`ib`.`ibcustomdate1` AS `ibcustomdate1`,`ib`.`ibcustomdate2` AS `ibcustomdate2`,`ib`.`ibcustomdate3` AS `ibcustomdate3`,`br`.`bnama` AS `ibcabangnama`,`lc`.`lnama` AS `iblokasinama`,`wh`.`wnama` AS `ibgudangnama`,`tsa`.`tsanama` AS `ibjenisnama`,`tsa`.`tsarek` AS `ibjenisrek`,`c1`.`kkode` AS `ibbagianibkode`,`c1`.`knama` AS `ibbagianibnama`,`st1`.`nama` AS `ibstatusnama`,`st2`.`nama` AS `ibstatussebelumnyanama`,`u1`.`unama` AS `ibinputusernama`,`u2`.`unama` AS `ibmodifikasiusernama`,`ibd`.`idibdetail` AS `idibdetail`,`ibd`.`idib` AS `idib`,`ibd`.`idbarang` AS `idbarang`,`ibd`.`namabarang` AS `namabarang`,`ibd`.`tipebarang` AS `tipebarang`,`ibd`.`jml` AS `jml`,`ibd`.`satuan` AS `satuan`,`ibd`.`nilaisatuan` AS `nilaisatuan`,`ibd`.`jmlbarang` AS `jmlbarang`,`ibd`.`satuanbarang` AS `satuanbarang`,`ibd`.`matauang` AS `matauang`,`ibd`.`kurs` AS `kurs`,`ibd`.`hpplama` AS `hpplama`,`ibd`.`hpp` AS `hpp`,`i`.`brekpersediaan` AS `rekpersediaan`,`ibd`.`cabang` AS `cabang`,`ibd`.`lokasi` AS `lokasi`,`ibd`.`gudang` AS `gudang`,`ibd`.`costcenter` AS `costcenter`,`ibd`.`divisi` AS `divisi`,`ibd`.`subdivisi` AS `subdivisi`,`ibd`.`proyek` AS `proyek`,`ibd`.`catatan` AS `catatan`,`ibd`.`urutan` AS `urutan`,`ibd`.`isclose` AS `isclose`,`ibd`.`customtext1` AS `customtext1`,`ibd`.`customtext2` AS `customtext2`,`ibd`.`customtext3` AS `customtext3`,`ibd`.`customdbl1` AS `customdbl1`,`ibd`.`customdbl2` AS `customdbl2`,`ibd`.`customdbl3` AS `customdbl3`,`ibd`.`customdate1` AS `customdate1`,`ibd`.`customdate2` AS `customdate2`,`ibd`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bhpp` AS `bhpp`,`i`.`bhppaverage` AS `bhppaverage`,`i`.`bjenis` AS `bjenis`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,`i`.`basset` AS `basset`,`coa1`.`cnama` AS `rekpersediaannama`,`brd`.`bnama` AS `cabangnama`,`lcd`.`lnama` AS `lokasinama`,`whd`.`wnama` AS `gudangnama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama` from (((((((((((((((((((`m3_ib` `ib` join `m3_ib_detail` `ibd` on((`ib`.`ibid` = `ibd`.`idib`))) left join `m1_branch` `br` on((`br`.`bkode` = `ib`.`ibcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `ib`.`iblokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `ib`.`ibgudang`))) left join `m1_type_sa` `tsa` on((`tsa`.`tsakode` = `ib`.`ibjenis`))) left join `m1_contact` `c1` on((`c1`.`kid` = `ib`.`ibbagianib`))) left join `m0_status` `st1` on((`st1`.`kode` = `ib`.`ibstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `ib`.`ibstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `ib`.`ibinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `ib`.`ibmodifikasiuser`))) left join `m1_item` `i` on((`ibd`.`idbarang` = `i`.`bid`))) left join `m1_coa` `coa1` on((`i`.`brekpersediaan` = `coa1`.`cnomor`))) left join `m1_branch` `brd` on((`ibd`.`cabang` = `brd`.`bkode`))) left join `m1_location` `lcd` on((`ibd`.`lokasi` = `lcd`.`lkode`))) left join `m1_warehouse` `whd` on((`ibd`.`gudang` = `whd`.`wkode`))) left join `m1_cost_center` `cc` on((`ibd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`ibd`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`ibd`.`subdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`ibd`.`proyek` = `p`.`pkode`)))
```

## `client-backend/api-myerpplus/app_code/ws/m3/m3_ib_history.vb`

```sql
INSERT INTO m3_ib_history(SELECT 0, ib.* FROM m3_ib ib WHERE ib.ibid = '{idtransaksi}')
```

```sql
SELECT ibidhistory FROM m3_ib_history WHERE ibid = '{idtransaksi}' ORDER BY ibmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m3_ib_detail_history (SELECT 0, '{result_4}', ib.* FROM m3_ib_detail ib WHERE ib.idib = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m3/m3_mr.vb`

```sql
SELECT COUNT(mrid), mrnotransaksi FROM M3_Mr WHERE mrid='{result_4}' AND mrstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(mrid) FROM m3_mr WHERE mrnotransaksi='{notransaksi}'
```

```sql
Update M3_Mr set mrcabang = '{FixQuotes_drutama}mrcabang', mrlokasi = '{FixQuotes_drutama}mrlokasi', mrgudangasal = '{FixQuotes_drutama}mrgudangasal', mrgudangtujuan = '{FixQuotes_drutama}mrgudangtujuan', mrsumber = '{FixQuotes_drutama}mrsumber', mrautonotransaksi = {drutama}mrautonotransaksi, mrnotransaksi = '{notransaksi}', mrtgl = '{FixQuotes_AsFormatTanggal_drutama}mrtgl', mrkodepa = {drutama}mrkodepa, mrdimintaoleh = {drutama}mrdimintaoleh, mrdimintaolehkontak = '{FixQuotes_drutama}mrdimintaolehkontak', mrmintake = {drutama}mrmintake, mrtgldipakai = '{FixQuotes_AsFormatTanggal_drutama}mrtgldipakai', mruraian = '{FixQuotes_drutama}mruraian', mrcatatan = '{FixQuotes_drutama}mrcatatan', mrnoref = '{FixQuotes_drutama}mrnoref', mrtglnoref = '{FixQuotes_AsFormatTanggal_drutama}mrtglnoref', mrstatusts = {drutama}mrstatusts, mrstatusrs = {drutama}mrstatusrs, mrstatus = {drutama}mrstatus, mrstatussebelumnya = {drutama}mrstatussebelumnya, mrjmlrevisi = mrjmlrevisi+1, mrcetakanke = {drutama}mrcetakanke, mrmodifikasiuser = {drutama}mrmodifikasiuser, mrmodifikasitgl = NOW(), mrcustomtext1 = '{FixQuotes_drutama}mrcustomtext1', mrcustomtext2 = '{FixQuotes_drutama}mrcustomtext2', mrcustomtext3 = '{FixQuotes_drutama}mrcustomtext3', mrcustomtext4 = '{FixQuotes_drutama}mrcustomtext4', mrcustomtext5 = '{FixQuotes_drutama}mrcustomtext5', mrcustomint1 = {drutama}mrcustomint1, mrcustomint2 = {drutama}mrcustomint2, mrcustomint3 = {drutama}mrcustomint3, mrcustomdbl1 = '{FixDouble_drutama}mrcustomdbl1', mrcustomdbl2 = '{FixDouble_drutama}mrcustomdbl2', mrcustomdbl3 = '{FixDouble_drutama}mrcustomdbl3', mrcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}mrcustomdate1', mrcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}mrcustomdate2', mrcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}mrcustomdate3' where mrid = '{drutama}mrid'
```

```sql
Insert into M3_Mr (mrcabang, mrlokasi, mrgudangasal, mrgudangtujuan, mrsumber, mrautonotransaksi, mrnotransaksi, mrtgl, mrkodepa, mrdimintaoleh, mrdimintaolehkontak, mrmintake, mrtgldipakai, mruraian, mrcatatan, mrnoref, mrtglnoref, mrstatusts, mrstatusrs, mrstatus, mrstatussebelumnya, mrjmlrevisi, mrcetakanke, mrinputuser, mrinputtgl, mrmodifikasiuser, mrmodifikasitgl, mrisclose, mrcustomtext1, mrcustomtext2, mrcustomtext3, mrcustomtext4, mrcustomtext5, mrcustomint1, mrcustomint2, mrcustomint3, mrcustomdbl1, mrcustomdbl2, mrcustomdbl3, mrcustomdate1, mrcustomdate2, mrcustomdate3) values('{FixQuotes_drutama}mrcabang', '{FixQuotes_drutama}mrlokasi', '{FixQuotes_drutama}mrgudangasal', '{FixQuotes_drutama}mrgudangtujuan', '{FixQuotes_drutama}mrsumber', {drutama}mrautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}mrtgl', {drutama}mrkodepa, {drutama}mrdimintaoleh, '{FixQuotes_drutama}mrdimintaolehkontak', {drutama}mrmintake, '{FixQuotes_AsFormatTanggal_drutama}mrtgldipakai', '{FixQuotes_drutama}mruraian', '{FixQuotes_drutama}mrcatatan', '{FixQuotes_drutama}mrnoref', '{FixQuotes_AsFormatTanggal_drutama}mrtglnoref', {drutama}mrstatusts, {drutama}mrstatusrs, {drutama}mrstatus, {drutama}mrstatussebelumnya, {drutama}mrjmlrevisi, {drutama}mrcetakanke, {drutama}mrinputuser, NOW(), {drutama}mrmodifikasiuser, '1971-01-01 00:00:00', {drutama}mrisclose, '{FixQuotes_drutama}mrcustomtext1', '{FixQuotes_drutama}mrcustomtext2', '{FixQuotes_drutama}mrcustomtext3', '{FixQuotes_drutama}mrcustomtext4', '{FixQuotes_drutama}mrcustomtext5', {drutama}mrcustomint1, {drutama}mrcustomint2, {drutama}mrcustomint3, '{FixDouble_drutama}mrcustomdbl1', '{FixDouble_drutama}mrcustomdbl2', '{FixDouble_drutama}mrcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}mrcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}mrcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}mrcustomdate3')
```

```sql
select mrid from M3_Mr where mrnotransaksi='{notransaksi}' AND Mrinputuser= '{userid}' order by Mrmodifikasitgl desc limit 1
```

```sql
Delete from M3_Mr_Detail where idmr = '{result_4}'
```

```sql
Insert into M3_Mr_Detail(idmrdetail, idmr, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, hargabeli, hargajual, stokterakhir, cabang, lokasi, gudangasal, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, jmlts, statusts, jmlrs, statusrs, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Mrtgl, Mrnotransaksi, Mrstatus FROM m3_Mr WHERE Mrid='{idtransaksi}'
```

```sql
UPDATE M3_Mr SET Mrstatus = {nilaiStatus}, mrmodifikasiuser='{userid}', mrmodifikasitgl = NOW(), mrposting = 0, mrpostingtgl = '1971-01-01 00:00:00', mrjmlrevisi = mrjmlrevisi + 1 WHERE mrid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Mrid, Mrnotransaksi FROM m3_Mr WHERE Mrid='{idtransaksi}'
```

```sql
DELETE FROM M3_Mr_Detail WHERE idmr = '{idtransaksi}'
```

```sql
DELETE FROM M3_Mr WHERE mrid = '{idtransaksi}'
```

```sql
select `mrd`.`idmrdetail` AS `idmrdetail`, `mrd`.`idmr` AS `idmr`, `mrd`.`idbarang` AS `idbarang`, `mrd`.`namabarang` AS `namabarang`, `mrd`.`tipebarang` AS `tipebarang`, `mrd`.`jml` AS `jml`, `mrd`.`satuan` AS `satuan`, `mrd`.`nilaisatuan` AS `nilaisatuan`, `mrd`.`jmlbarang` AS `jmlbarang`, `mrd`.`satuanbarang` AS `satuanbarang`, `mrd`.`matauang` AS `matauang`, `mrd`.`kurs` AS `kurs`, `mrd`.`hargabeli` AS `hargabeli`, `mrd`.`hargajual` AS `hargajual`, `mrd`.`stokterakhir` AS `stokterakhir`, `mrd`.`cabang` AS `cabang`, `mrd`.`lokasi` AS `lokasi`, `mrd`.`gudangasal` AS `gudangasal`, `mrd`.`gudangtujuan` AS `gudangtujuan`, `mrd`.`costcenter` AS `costcenter`, `mrd`.`divisi` AS `divisi`, `mrd`.`subdivisi` AS `subdivisi`, `mrd`.`proyek` AS `proyek`, `mrd`.`catatan` AS `catatan`, `mrd`.`urutan` AS `urutan`, `mrd`.`jmlts` AS `jmlts`, `mrd`.`statusts` AS `statusts`, `mrd`.`jmlrs` AS `jmlrs`, `mrd`.`statusrs` AS `statusrs`, `mrd`.`jmlrealisasi` AS `jmlrealisasi`, `mrd`.`statusrealisasi` AS `statusrealisasi`, `mrd`.`isclose` AS `isclose`, `mrd`.`customtext1` AS `customtext1`, `mrd`.`customtext2` AS `customtext2`, `mrd`.`customtext3` AS `customtext3`, `mrd`.`customdbl1` AS `customdbl1`, `mrd`.`customdbl2` AS `customdbl2`, `mrd`.`customdbl3` AS `customdbl3`, `mrd`.`customdate1` AS `customdate1`, `mrd`.`customdate2` AS `customdate2`, `mrd`.`customdate3` AS `customdate3`, `mr`.`mrnotransaksi` AS `mrnotransaksi`, `i`.`bkode` AS `kodebarang`, `i`.`bhpp` AS `bhpp`, `i`.`bhppaverage` AS `bhppaverage`, `i`.`bjenis` AS `bjenis`, `i`.`bserial` AS `bserial`, `i`.`bbatch` AS `bbatch`, ((`mrd`.`jmlbarang` - `mrd`.`jmlts`) / `mrd`.`nilaisatuan`) AS `jmlsisats`, ((`mrd`.`jmlbarang` - `mrd`.`jmlrs`) / `mrd`.`nilaisatuan`) AS `jmlsisars`, ((`mrd`.`jmlbarang` - `mrd`.`jmlrealisasi`) / `mrd`.`nilaisatuan`) AS `jmlsisarealisasi`, i.bapanjang, i.balebar, i.batinggi,`i`.`btag` AS `btag`,ip.ipjual AS btagjual, ip.ipmutasipusat AS btagmutasipusat, ip.ippermintaanmutasi AS btagpermintaanmutasi ,ip.ipmutasicabang AS btagmutasicabang, ip.ipretursupplier AS btagretursupplier, ip.ippermintaanpembelian AS btagpermintaanpembelian, i.bjmllapangan, i.bsatuanlapangan, i.basset from ((`m3_mr_detail` `mrd` join `m3_mr` `mr` on((`mrd`.`idmr` = `mr`.`mrid`))) join `m1_item` `i` on((`mrd`.`idbarang` = `i`.`bid`)) join `m1_item_permission` `ip` on((`i`.`btag` = `ip`.`ipkode`)))
```

## `client-backend/api-myerpplus/app_code/ws/m3/m3_mr_history.vb`

```sql
INSERT INTO m3_mr_history(SELECT 0, mr.* FROM m3_mr mr WHERE mr.mrid = '{idtransaksi}')
```

```sql
SELECT mridhistory FROM m3_mr_history WHERE mrid = '{idtransaksi}' ORDER BY mrmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m3_mr_detail_history (SELECT 0, '{result_4}', mr.* FROM m3_mr_detail mr WHERE mr.idmr = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m3/m3_notes.vb`

```sql
SELECT COUNT(nid) FROM M3_Notes WHERE nid='{result_4}'
```

```sql
Update M3_Notes set nsumber = '{FixQuotes_dataUtama_1}', nidtransaksi = {dataUtama_2}, ncatatan = '{FixQuotes_dataUtama_3}', nmodifikasiuser = {dataUtama_6}, nmodifikasitgl = NOW() where nid = '{result_4}'
```

```sql
Insert into M3_Notes (nsumber, nidtransaksi, ncatatan, ninputuser, ninputtgl, nmodifikasiuser, nmodifikasitgl) values('{FixQuotes_dataUtama_1}', {dataUtama_2}, '{FixQuotes_dataUtama_3}', {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M3_Notes WHERE nid = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m3/m3_pa.vb`

```sql
SELECT COUNT(paid), panotransaksi FROM M3_pa WHERE paid='{result_4}' AND pastatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(paid) FROM m3_pa WHERE panotransaksi='{notransaksi}'
```

```sql
Update M3_Pa set pacabang = '{FixQuotes_drutama}pacabang', palokasi = '{FixQuotes_drutama}palokasi', pagudang = '{FixQuotes_drutama}pagudang', pasumber = '{FixQuotes_drutama}pasumber', paautonotransaksi = {drutama}paautonotransaksi, panotransaksi = '{notransaksi}', patgl = '{FixQuotes_AsFormatTanggal_drutama}patgl', patglberlakusampai = '{FixQuotes_AsFormatTanggal_drutama}patglberlakusampai', pakodepa = {drutama}pakodepa, pabagianpa = {drutama}pabagianpa, pabagianpakontak = '{FixQuotes_drutama}pabagianpakontak', pamatauang = '{FixQuotes_drutama}pamatauang', pakurs = '{FixDouble_drutama}pakurs', pauraian = '{FixQuotes_drutama}pauraian', pacatatan = '{FixQuotes_drutama}pacatatan', panoref = '{FixQuotes_drutama}panoref', patglnoref = '{FixQuotes_AsFormatTanggal_drutama}patglnoref', pastatus = {drutama}pastatus, pastatussebelumnya = {drutama}pastatussebelumnya, pajmlrevisi = pajmlrevisi+1, pacetakanke = {drutama}pacetakanke, pamodifikasiuser = {drutama}pamodifikasiuser, pamodifikasitgl = NOW(), paposting = 0, patutupperiode = {drutama}patutupperiode, pacustomtext1 = '{FixQuotes_drutama}pacustomtext1', pacustomtext2 = '{FixQuotes_drutama}pacustomtext2', pacustomtext3 = '{FixQuotes_drutama}pacustomtext3', pacustomtext4 = '{FixQuotes_drutama}pacustomtext4', pacustomtext5 = '{FixQuotes_drutama}pacustomtext5', pacustomint1 = {drutama}pacustomint1, pacustomint2 = {drutama}pacustomint2, pacustomint3 = {drutama}pacustomint3, pacustomdbl1 = '{FixDouble_drutama}pacustomdbl1', pacustomdbl2 = '{FixDouble_drutama}pacustomdbl2', pacustomdbl3 = '{FixDouble_drutama}pacustomdbl3', pacustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}pacustomdate1', pacustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}pacustomdate2', pacustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}pacustomdate3', pakategori = '{FixQuotes_drutama}pakategori', pakategoriharga = '{FixQuotes_drutama}pakategoriharga' where paid = '{drutama}paid'
```

```sql
Insert into M3_Pa (pacabang, palokasi, pagudang, pasumber, paautonotransaksi, panotransaksi, patgl, patglberlakusampai, pakodepa, pabagianpa, pabagianpakontak, pamatauang, pakurs, pauraian, pacatatan, panoref, patglnoref, pastatus, pastatussebelumnya, pajmlrevisi, pacetakanke, painputuser, painputtgl, pamodifikasiuser, pamodifikasitgl, paposting, patutupperiode, paisclose, pacustomtext1, pacustomtext2, pacustomtext3, pacustomtext4, pacustomtext5, pacustomint1, pacustomint2, pacustomint3, pacustomdbl1, pacustomdbl2, pacustomdbl3, pacustomdate1, pacustomdate2, pacustomdate3, pakategori, pakategoriharga) values('{FixQuotes_drutama}pacabang', '{FixQuotes_drutama}palokasi', '{FixQuotes_drutama}pagudang', '{FixQuotes_drutama}pasumber', {drutama}paautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}patgl', '{FixQuotes_AsFormatTanggal_drutama}patglberlakusampai', {drutama}pakodepa, {drutama}pabagianpa, '{FixQuotes_drutama}pabagianpakontak', '{FixQuotes_drutama}pamatauang', '{FixDouble_drutama}pakurs', '{FixQuotes_drutama}pauraian', '{FixQuotes_drutama}pacatatan', '{FixQuotes_drutama}panoref', '{FixQuotes_AsFormatTanggal_drutama}patglnoref', {drutama}pastatus, {drutama}pastatussebelumnya, {drutama}pajmlrevisi, {drutama}pacetakanke, {drutama}painputuser, NOW(), {drutama}pamodifikasiuser, '1971-01-01 00:00:00', 0, {drutama}patutupperiode, {drutama}paisclose, '{FixQuotes_drutama}pacustomtext1', '{FixQuotes_drutama}pacustomtext2', '{FixQuotes_drutama}pacustomtext3', '{FixQuotes_drutama}pacustomtext4', '{FixQuotes_drutama}pacustomtext5', {drutama}pacustomint1, {drutama}pacustomint2, {drutama}pacustomint3, '{FixDouble_drutama}pacustomdbl1', '{FixDouble_drutama}pacustomdbl2', '{FixDouble_drutama}pacustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}pacustomdate1', '{FixQuotes_AsFormatTanggal_drutama}pacustomdate2', '{FixQuotes_AsFormatTanggal_drutama}pacustomdate3', '{FixQuotes_drutama}pakategori', '{FixQuotes_drutama}pakategoriharga')
```

```sql
select paid from M3_pa where panotransaksi='{notransaksi}' AND painputuser= '{userid}' order by pamodifikasitgl desc limit 1
```

```sql
Delete from M3_Pa_Detail where idpa = '{result_4}'
```

```sql
Insert into M3_Pa_Detail(idpadetail, idpa, idbarang, satuan, nilaisatuan, satuanbarang, matauang, kurs, hargajual1lama, hargajual2lama, hargajual3lama, hargajual4lama, hargajual5lama, hargajual1, hargajual2, hargajual3, hargajual4, hargajual5, diskonjual1lama, diskonjual2lama, diskonjual3lama, diskonjual4lama, diskonjual5lama, diskonjual1, diskonjual2, diskonjual3, diskonjual4, diskonjual5, cabang, lokasi, gudang, costcenter, divisi, subdivisi, proyek, catatan, urutan, statusberlaku, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, kontak, hargajual6lama, hargajual7lama, hargajual8lama, hargajual9lama, hargajual10lama, hargajual6, hargajual7, hargajual8, hargajual9, hargajual10, diskonjual6lama, diskonjual7lama, diskonjual8lama, diskonjual9lama, diskonjual10lama, diskonjual6, diskonjual7, diskonjual8, diskonjual9, diskonjual10) values{strValue2_ToString}
```

```sql
UPDATE m3_pa_detail pad JOIN m1_item i ON pad.idbarang = i.bid SET pad.hargajual1lama = i.bhargajual1, pad.hargajual2lama = i.bhargajual2, pad.hargajual3lama = i.bhargajual3, pad.hargajual4lama = i.bhargajual4, pad.hargajual5lama = i.bhargajual5, pad.diskonjual1lama = i.bdiskonjual1, pad.diskonjual2lama = i.bdiskonjual2, pad.diskonjual3lama = i.bdiskonjual3, pad.diskonjual4lama = i.bdiskonjual4, pad.diskonjual5lama = i.bdiskonjual5, pad.hargajual6lama = i.bhargajual6, pad.hargajual7lama = i.bhargajual7, pad.hargajual8lama = i.bhargajual8, pad.hargajual9lama = i.bhargajual9, pad.hargajual10lama = i.bhargajual10, pad.diskonjual6lama = i.bdiskonjual6, pad.diskonjual7lama = i.bdiskonjual7, pad.diskonjual8lama = i.bdiskonjual8, pad.diskonjual9lama = i.bdiskonjual9, pad.diskonjual10lama = i.bdiskonjual10 WHERE pad.idpa = '{FixDouble_result_4}'
```

```sql
UPDATE m3_pa_detail pad JOIN m1_item i ON pad.idbarang = i.bid SET i.bhargajual1 = pad.hargajual1 / pad.nilaisatuan, i.bhargajual2 = pad.hargajual2 / pad.nilaisatuan, i.bhargajual3 = pad.hargajual3 / pad.nilaisatuan, i.bhargajual4 = pad.hargajual4 / pad.nilaisatuan, i.bhargajual5 = pad.hargajual5 / pad.nilaisatuan, i.bdiskonjual1 = pad.diskonjual1, i.bdiskonjual2 = pad.diskonjual2, i.bdiskonjual3 = pad.diskonjual3, i.bdiskonjual4 = pad.diskonjual4, i.bdiskonjual5 = pad.diskonjual5, i.bhargajual6 = pad.hargajual6 / pad.nilaisatuan, i.bhargajual7 = pad.hargajual7 / pad.nilaisatuan, i.bhargajual8 = pad.hargajual8 / pad.nilaisatuan, i.bhargajual9 = pad.hargajual9 / pad.nilaisatuan, i.bhargajual10 = pad.hargajual10 / pad.nilaisatuan, i.bdiskonjual6 = pad.diskonjual6, i.bdiskonjual7 = pad.diskonjual7, i.bdiskonjual8 = pad.diskonjual8, i.bdiskonjual9 = pad.diskonjual9, i.bdiskonjual10 = pad.diskonjual10, i.bhargabeli = pad.customdbl1 WHERE pad.idpa = '{FixDouble_result_4}'
```

```sql
UPDATE m3_pa_detail pad JOIN m1_item i ON pad.idbarang = i.bid LEFT JOIN m1_price_category_detail pcd ON pad.idbarang = pcd.pcdidbarang AND pcd.pcdkategori = '{FixQuotes_drutama}pakategoriharga' SET pad.hargajual1lama = ifnull(pcd.pcdhargajual1, i.bhargajual1), pad.hargajual2lama = ifnull(pcd.pcdhargajual2, i.bhargajual2), pad.hargajual3lama = ifnull(pcd.pcdhargajual3, i.bhargajual3), pad.hargajual4lama = ifnull(pcd.pcdhargajual4, i.bhargajual4), pad.hargajual5lama = ifnull(pcd.pcdhargajual5, i.bhargajual5), pad.diskonjual1lama = ifnull(pcd.pcddiskonjual1, i.bdiskonjual1), pad.diskonjual2lama = ifnull(pcd.pcddiskonjual2, i.bdiskonjual2), pad.diskonjual3lama = ifnull(pcd.pcddiskonjual3, i.bdiskonjual3), pad.diskonjual4lama = ifnull(pcd.pcddiskonjual4, i.bdiskonjual4), pad.diskonjual5lama = ifnull(pcd.pcddiskonjual5, i.bdiskonjual5), pad.hargajual6lama = ifnull(pcd.pcdhargajual6, i.bhargajual6), pad.hargajual7lama = ifnull(pcd.pcdhargajual7, i.bhargajual7), pad.hargajual8lama = ifnull(pcd.pcdhargajual8, i.bhargajual8), pad.hargajual9lama = ifnull(pcd.pcdhargajual9, i.bhargajual9), pad.hargajual10lama = ifnull(pcd.pcdhargajual10, i.bhargajual10), pad.diskonjual6lama = ifnull(pcd.pcddiskonjual6, i.bdiskonjual6), pad.diskonjual7lama = ifnull(pcd.pcddiskonjual7, i.bdiskonjual7), pad.diskonjual8lama = ifnull(pcd.pcddiskonjual8, i.bdiskonjual8), pad.diskonjual9lama = ifnull(pcd.pcddiskonjual9, i.bdiskonjual9), pad.diskonjual10lama = ifnull(pcd.pcddiskonjual10, i.bdiskonjual10) WHERE pad.idpa = '{FixDouble_result_4}'
```

```sql
INSERT INTO M1_Price_Category_Detail (SELECT '{FixQuotes_drutama}pakategoriharga' as pcdkategori, pad.idbarang as pcdidbarang, i.bstokminimal as pcdstokminimal, i.bstokmaksimal as pcdstokmaksimal, i.breorder as pcdstokreorder, i.bminorder as pcdstokminorder, pad.hargajual1 / pad.nilaisatuan as pcdhargajual1, pad.hargajual2 / pad.nilaisatuan as pcdhargajual2, pad.hargajual3 / pad.nilaisatuan as pcdhargajual3, pad.hargajual4 / pad.nilaisatuan as pcdhargajual4, pad.hargajual5 / pad.nilaisatuan as pcdhargajual5, pad.diskonjual1 as pcddiskonjual1, pad.diskonjual2 as pcddiskonjual2, pad.diskonjual3 as pcddiskonjual3, pad.diskonjual4 as pcddiskonjual4, pad.diskonjual5 as pcddiskonjual5, pad.customtext1 as pcdcustomtext1, pad.customtext2 as pcdcustomtext2, pad.customtext3 as pcdcustomtext3, '' as pcdcustomtext4, '' as pcdcustomtext5, 0 as pcdcustomint1, 0 as pcdcustomint2, 0 as pcdcustomint3, pad.customdbl1 as pcdcustomdbl1, pad.customdbl2 as pcdcustomdbl2, pad.customdbl3 as pcdcustomdbl3, pad.customdate1 as pcdcustomdate1, pad.customdate2 as pcdcustomdate2, pad.customdate3 as pcdcustomdate3, 0 as pcddownloaded, pad.hargajual6 / pad.nilaisatuan as pcdhargajual6, pad.hargajual7 / pad.nilaisatuan as pcdhargajual7, pad.hargajual8 / pad.nilaisatuan as pcdhargajual8, pad.hargajual9 / pad.nilaisatuan as pcdhargajual9, pad.hargajual10 / pad.nilaisatuan as pcdhargajual10, pad.diskonjual6 as pcddiskonjual6, pad.diskonjual7 as pcddiskonjual7, pad.diskonjual8 as pcddiskonjual8, pad.diskonjual9 as pcddiskonjual9, pad.diskonjual10 as pcddiskonjual10 FROM m3_pa_detail pad JOIN m1_item i ON pad.idbarang = i.bid AND pad.idpa = '{FixDouble_result_4}') ON DUPLICATE KEY UPDATE pcdhargajual1 = VALUES(pcdhargajual1), pcdhargajual2 = VALUES(pcdhargajual2), pcdhargajual3 = VALUES(pcdhargajual3), pcdhargajual4 = VALUES(pcdhargajual4), pcdhargajual5 = VALUES(pcdhargajual5), pcddiskonjual1 = VALUES(pcddiskonjual1), pcddiskonjual2 = VALUES(pcddiskonjual2), pcddiskonjual3 = VALUES(pcddiskonjual3), pcddiskonjual4 = VALUES(pcddiskonjual4), pcddiskonjual5 = VALUES(pcddiskonjual5), pcdhargajual6 = VALUES(pcdhargajual6), pcdhargajual7 = VALUES(pcdhargajual7), pcdhargajual8 = VALUES(pcdhargajual8), pcdhargajual9 = VALUES(pcdhargajual9), pcdhargajual10 = VALUES(pcdhargajual10), pcddiskonjual6 = VALUES(pcddiskonjual6), pcddiskonjual7 = VALUES(pcddiskonjual7), pcddiskonjual8 = VALUES(pcddiskonjual8), pcddiskonjual9 = VALUES(pcddiskonjual9), pcddiskonjual10 = VALUES(pcddiskonjual10)
```

```sql
UPDATE m3_pa_detail pad LEFT JOIN m1_contact_price cp ON pad.idbarang = cp.khidbarang AND pad.kontak = cp.khidkontak SET pad.hargajual1lama = IFNULL(cp.khhargajual,0), pad.hargajual2lama = 0, pad.hargajual3lama = 0, pad.hargajual4lama = 0, pad.hargajual5lama = 0, pad.diskonjual1lama = 0, pad.diskonjual2lama = 0, pad.diskonjual3lama = 0, pad.diskonjual4lama = 0, pad.diskonjual5lama = 0, pad.hargajual6lama = 0, pad.hargajual7lama = 0, pad.hargajual8lama = 0, pad.hargajual9lama = 0, pad.hargajual10lama = 0, pad.diskonjual6lama = 0, pad.diskonjual7lama = 0, pad.diskonjual8lama = 0, pad.diskonjual9lama = 0, pad.diskonjual10lama = 0 WHERE pad.idpa = '{FixDouble_result_4}'
```

```sql
INSERT INTO m1_contact_price( SELECT pad.kontak as khidkontak, pad.idbarang as khidbarang, pad.satuan as khsatuan, 0 as khkomisi, 0 as khhargabeli, pad.hargajual1 as khhargajual, pa.patgl as khberlakudari, '1900-01-01' as khberlakusampai, '' as khcatatan, pa.painputuser as khinputuser, pa.painputtgl as khinputtgl, pa.pamodifikasiuser as khmodifikasiuser, pa.pamodifikasitgl as khmodifikasitgl, '' as khcustomtext1, '' as khcustomtext2, '' as khcustomtext3, '' as khcustomtext4, '' as khcustomtext5, '0' as khcustomint1, '0' as khcustomint2, '0' as khcustomint3, '0' as khcustomint4, '0' as khcustomint5, '0' as khcustomdbl1, '0' as khcustomdbl2, '0' as khcustomdbl3, '0' as khcustomdbl4, '0' as khcustomdbl5, '1900-01-01' as khcustomdate1, '1900-01-01' as khcustomdate2, '1900-01-01' as khcustomdate3, '1900-01-01' as khcustomdate4, '1900-01-01' as khcustomdate5 FROM m3_pa_detail pad JOIN m3_pa pa ON pad.idpa = pa.paid WHERE pad.idpa = '{FixDouble_result_4}' ) ON DUPLICATE KEY UPDATE khidkontak = VALUES(khidkontak), khidbarang = VALUES(khidbarang), khsatuan = VALUES(khsatuan), khhargajual = VALUES(khhargajual), khberlakudari = VALUES(khberlakudari), khinputuser = VALUES(khinputuser), khinputtgl = VALUES(khinputtgl), khmodifikasiuser = VALUES(khmodifikasiuser), khmodifikasitgl = VALUES(khmodifikasitgl)
```

```sql
SELECT moduleid, menuid, 0, 0, '' FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Patgl, Panotransaksi, Pastatus, Pakategori, Pakategoriharga FROM m3_Pa WHERE Paid='{idtransaksi}'
```

```sql
UPDATE m3_pa_detail pad JOIN m1_item i ON pad.idbarang = i.bid SET i.bhargajual1 = pad.hargajual1lama, i.bhargajual2 = pad.hargajual2lama, i.bhargajual3 = pad.hargajual3lama, i.bhargajual4 = pad.hargajual4lama, i.bhargajual5 = pad.hargajual5lama, i.bdiskonjual1 = pad.diskonjual1lama, i.bdiskonjual2 = pad.diskonjual2lama, i.bdiskonjual3 = pad.diskonjual3lama, i.bdiskonjual4 = pad.diskonjual4lama, i.bdiskonjual5 = pad.diskonjual5lama, i.bhargajual6 = pad.hargajual6lama, i.bhargajual7 = pad.hargajual7lama, i.bhargajual8 = pad.hargajual8lama, i.bhargajual9 = pad.hargajual9lama, i.bhargajual10 = pad.hargajual10lama, i.bdiskonjual6 = pad.diskonjual6lama, i.bdiskonjual7 = pad.diskonjual7lama, i.bdiskonjual8 = pad.diskonjual8lama, i.bdiskonjual9 = pad.diskonjual9lama, i.bdiskonjual10 = pad.diskonjual10lama WHERE pad.idpa = '{FixDouble_idtransaksi}'
```

```sql
UPDATE m3_pa_detail pad JOIN m1_price_category_detail i ON i.pcdkategori = '{pakategoriharga}' AND pad.idbarang = i.pcdidbarang SET i.pcdhargajual1 = pad.hargajual1lama, i.pcdhargajual2 = pad.hargajual2lama, i.pcdhargajual3 = pad.hargajual3lama, i.pcdhargajual4 = pad.hargajual4lama, i.pcdhargajual5 = pad.hargajual5lama, i.pcddiskonjual1 = pad.diskonjual1lama, i.pcddiskonjual2 = pad.diskonjual2lama, i.pcddiskonjual3 = pad.diskonjual3lama, i.pcddiskonjual4 = pad.diskonjual4lama, i.pcddiskonjual5 = pad.diskonjual5lama, i.pcdhargajual6 = pad.hargajual6lama, i.pcdhargajual7 = pad.hargajual7lama, i.pcdhargajual8 = pad.hargajual8lama, i.pcdhargajual9 = pad.hargajual9lama, i.pcdhargajual10 = pad.hargajual10lama, i.pcddiskonjual6 = pad.diskonjual6lama, i.pcddiskonjual7 = pad.diskonjual7lama, i.pcddiskonjual8 = pad.diskonjual8lama, i.pcddiskonjual9 = pad.diskonjual9lama, i.pcddiskonjual10 = pad.diskonjual10lama WHERE pad.idpa = '{FixDouble_idtransaksi}'
```

```sql
UPDATE m3_pa_detail pad JOIN m1_contact_price cp ON pad.idbarang = cp.khidbarang AND pad.kontak = cp.khidkontak SET cp.khhargajual = pad.pad.hargajual1lama WHERE pad.idpa = '{FixDouble_idtransaksi}'
```

```sql
UPDATE M3_Pa SET Pastatus = {nilaiStatus}, Pamodifikasiuser='{userid}', Pamodifikasitgl = NOW(), Paposting = 0, Papostingtgl = '1971-01-01 00:00:00', Pajmlrevisi = Pajmlrevisi + 1 WHERE Paid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Paid, Panotransaksi FROM m3_Pa WHERE Paid='{idtransaksi}'
```

```sql
DELETE FROM M3_Pa_Detail WHERE idpa = '{idtransaksi}'
```

```sql
DELETE FROM M3_Pa WHERE paid = '{idtransaksi}'
```

```sql
select pa.paid AS paid, pa.pacabang AS pacabang, pa.palokasi AS palokasi, pa.pagudang AS pagudang, pa.pasumber AS pasumber, pa.paautonotransaksi AS paautonotransaksi, pa.panotransaksi AS panotransaksi, pa.patgl AS patgl, pa.patglberlakusampai AS patglberlakusampai, pa.pakodepa AS pakodepa, pa.pabagianpa AS pabagianpa, pa.pabagianpakontak AS pabagianpakontak, pa.pamatauang AS pamatauang, pa.pakurs AS pakurs, pa.pauraian AS pauraian, pa.pacatatan AS pacatatan, pa.panoref AS panoref, pa.patglnoref AS patglnoref, pa.pastatus AS pastatus, pa.pastatussebelumnya AS pastatussebelumnya, pa.pajmlrevisi AS pajmlrevisi, pa.pacetakanke AS pacetakanke, pa.painputuser AS painputuser, pa.painputtgl AS painputtgl, pa.pamodifikasiuser AS pamodifikasiuser, pa.pamodifikasitgl AS pamodifikasitgl, pa.paposting AS paposting, pa.papostingtgl AS papostingtgl, pa.patutupperiode AS patutupperiode, pa.paisclose AS paisclose, pa.pacustomtext1 AS pacustomtext1, pa.pacustomtext2 AS pacustomtext2, pa.pacustomtext3 AS pacustomtext3, pa.pacustomtext4 AS pacustomtext4, pa.pacustomtext5 AS pacustomtext5, pa.pacustomint1 AS pacustomint1, pa.pacustomint2 AS pacustomint2, pa.pacustomint3 AS pacustomint3, pa.pacustomdbl1 AS pacustomdbl1, pa.pacustomdbl2 AS pacustomdbl2, pa.pacustomdbl3 AS pacustomdbl3, pa.pacustomdate1 AS pacustomdate1, pa.pacustomdate2 AS pacustomdate2, pa.pacustomdate3 AS pacustomdate3, br.bnama AS pacabangnama, lc.lnama AS palokasinama, wh.wnama AS pagudangnama, c1.kkode AS pabagianpakode, c1.knama AS pabagianpanama, st1.nama AS pastatusnama, st2.nama AS pastatussebelumnyanama, u1.unama AS painputusernama, u2.unama AS pamodifikasiusernama, pa.pakategori, (CASE pa.pakategori WHEN 0 THEN 'Global' ELSE 'Category' END) as pakategorinama, pa.pakategoriharga, pc.pcnama as pakategoriharganama, pad.idpadetail AS idpadetail, pad.idpa AS idpa, pad.idbarang AS idbarang, pad.satuan AS satuan, pad.nilaisatuan AS nilaisatuan, pad.satuanbarang AS satuanbarang, pad.matauang AS matauang, pad.kurs AS kurs, pad.hargajual1lama AS hargajual1lama, pad.hargajual2lama AS hargajual2lama, pad.hargajual3lama AS hargajual3lama, pad.hargajual4lama AS hargajual4lama, pad.hargajual5lama AS hargajual5lama, pad.hargajual1 AS hargajual1, pad.hargajual2 AS hargajual2, pad.hargajual3 AS hargajual3, pad.hargajual4 AS hargajual4, pad.hargajual5 AS hargajual5, pad.diskonjual1lama AS diskonjual1lama, pad.diskonjual2lama AS diskonjual2lama, pad.diskonjual3lama AS diskonjual3lama, pad.diskonjual4lama AS diskonjual4lama, pad.diskonjual5lama AS diskonjual5lama, pad.diskonjual1 AS diskonjual1, pad.diskonjual2 AS diskonjual2, pad.diskonjual3 AS diskonjual3, pad.diskonjual4 AS diskonjual4, pad.diskonjual5 AS diskonjual5, pad.cabang AS cabang, pad.lokasi AS lokasi, pad.gudang AS gudang, pad.costcenter AS costcenter, pad.divisi AS divisi, pad.subdivisi AS subdivisi, pad.proyek AS proyek, pad.catatan AS catatan, pad.urutan AS urutan, pad.statusberlaku AS statusberlaku, pad.isclose AS isclose, pad.customtext1 AS customtext1, pad.customtext2 AS customtext2, pad.customtext3 AS customtext3, pad.customdbl1 AS customdbl1, pad.customdbl2 AS customdbl2, pad.customdbl3 AS customdbl3, pad.customdate1 AS customdate1, pad.customdate2 AS customdate2, pad.customdate3 AS customdate3, i.bkode AS kodebarang, i.bnama AS namabarang, i.btipe AS tipebarang, brd.bnama AS cabangnama, lcd.lnama AS lokasinama, whd.wnama AS gudangnama, cc.ccnama AS costcenternama, d.dnama AS divisinama, sd.sdnama AS subdivisinama, p.pnama AS proyeknama, i.bhargabeli, pad.kontak, c2.kkode as kontakkode, c2.knama as kontaknama, pad.hargajual6lama, pad.hargajual7lama, pad.hargajual8lama, pad.hargajual9lama, pad.hargajual10lama, pad.hargajual6, pad.hargajual7, pad.hargajual8, pad.hargajual9, pad.hargajual10, pad.diskonjual6lama, pad.diskonjual7lama, pad.diskonjual8lama, pad.diskonjual9lama, pad.diskonjual10lama, pad.diskonjual6, pad.diskonjual7, pad.diskonjual8, pad.diskonjual9, pad.diskonjual10 from m3_pa pa join m3_pa_detail pad on pa.paid = pad.idpa join m0_status st1 on st1.kode = pa.pastatus join m0_status st2 on st2.kode = pa.pastatussebelumnya left join m1_branch br on br.bkode = pa.pacabang left join m1_location lc on lc.lkode = pa.palokasi left join m1_warehouse wh on wh.wkode = pa.pagudang left join m1_contact c1 on c1.kid = pa.pabagianpa left join m0_user u1 on u1.userid = pa.painputuser left join m0_user u2 on u2.userid = pa.pamodifikasiuser left join m1_price_category pc on pa.pakategoriharga = pc.pckode left join m1_item i on pad.idbarang = i.bid left join m1_branch brd on pad.cabang = brd.bkode left join m1_location lcd on pad.lokasi = lcd.lkode left join m1_warehouse whd on pad.gudang = whd.wkode left join m1_cost_center cc on pad.costcenter = cc.cckode left join m1_division d on pad.divisi = d.dkode left join m1_subdivision sd on pad.subdivisi = sd.sdkode left join m1_project p on pad.proyek = p.pkode left join m1_contact c2 on pad.kontak = c2.kid
```

```sql
Insert into M3_Pa_Detail(idpadetail, idpa, idbarang, satuan, nilaisatuan, satuanbarang, matauang, kurs, hargajual1lama, hargajual2lama, hargajual3lama, hargajual4lama, hargajual5lama, hargajual1, hargajual2, hargajual3, hargajual4, hargajual5, diskonjual1lama, diskonjual2lama, diskonjual3lama, diskonjual4lama, diskonjual5lama, diskonjual1, diskonjual2, diskonjual3, diskonjual4, diskonjual5, cabang, lokasi, gudang, costcenter, divisi, subdivisi, proyek, catatan, urutan, statusberlaku, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
UPDATE m3_pa_detail pad JOIN m1_item i ON pad.idbarang = i.bid SET pad.hargajual1lama = i.bhargajual1, pad.hargajual2lama = i.bhargajual2, pad.hargajual3lama = i.bhargajual3, pad.hargajual4lama = i.bhargajual4, pad.hargajual5lama = i.bhargajual5, pad.diskonjual1lama = i.bdiskonjual1, pad.diskonjual2lama = i.bdiskonjual2, pad.diskonjual3lama = i.bdiskonjual3, pad.diskonjual4lama = i.bdiskonjual4, pad.diskonjual5lama = i.bdiskonjual5 WHERE pad.idpa = '{FixDouble_result_4}'
```

```sql
UPDATE m3_pa_detail pad JOIN m1_item i ON pad.idbarang = i.bid SET i.bhargajual1 = pad.hargajual1 / pad.nilaisatuan, i.bhargajual2 = pad.hargajual2 / pad.nilaisatuan, i.bhargajual3 = pad.hargajual3 / pad.nilaisatuan, i.bhargajual4 = pad.hargajual4 / pad.nilaisatuan, i.bhargajual5 = pad.hargajual5 / pad.nilaisatuan, i.bdiskonjual1 = pad.diskonjual1, i.bdiskonjual2 = pad.diskonjual2, i.bdiskonjual3 = pad.diskonjual3, i.bdiskonjual4 = pad.diskonjual4, i.bdiskonjual5 = pad.diskonjual5, i.bhargabeli = pad.customdbl1 WHERE pad.idpa = '{FixDouble_result_4}'
```

```sql
UPDATE m3_pa_detail pad JOIN m1_item i ON pad.idbarang = i.bid LEFT JOIN m1_price_category_detail pcd ON pad.idbarang = pcd.pcdidbarang AND pcd.pcdkategori = '{FixQuotes_drutama}pakategoriharga' SET pad.hargajual1lama = ifnull(pcd.pcdhargajual1, i.bhargajual1), pad.hargajual2lama = ifnull(pcd.pcdhargajual2, i.bhargajual2), pad.hargajual3lama = ifnull(pcd.pcdhargajual3, i.bhargajual3), pad.hargajual4lama = ifnull(pcd.pcdhargajual4, i.bhargajual4), pad.hargajual5lama = ifnull(pcd.pcdhargajual5, i.bhargajual5), pad.diskonjual1lama = ifnull(pcd.pcddiskonjual1, i.bdiskonjual1), pad.diskonjual2lama = ifnull(pcd.pcddiskonjual2, i.bdiskonjual2), pad.diskonjual3lama = ifnull(pcd.pcddiskonjual3, i.bdiskonjual3), pad.diskonjual4lama = ifnull(pcd.pcddiskonjual4, i.bdiskonjual4), pad.diskonjual5lama = ifnull(pcd.pcddiskonjual5, i.bdiskonjual5) WHERE pad.idpa = '{FixDouble_result_4}'
```

```sql
INSERT INTO M1_Price_Category_Detail (SELECT '{FixQuotes_drutama}pakategoriharga' as pcdkategori, pad.idbarang as pcdidbarang, i.bstokminimal as pcdstokminimal, i.bstokmaksimal as pcdstokmaksimal, i.breorder as pcdstokreorder, i.bminorder as pcdstokminorder, pad.hargajual1 / pad.nilaisatuan as pcdhargajual1, pad.hargajual2 / pad.nilaisatuan as pcdhargajual2, pad.hargajual3 / pad.nilaisatuan as pcdhargajual3, pad.hargajual4 / pad.nilaisatuan as pcdhargajual4, pad.hargajual5 / pad.nilaisatuan as pcdhargajual5, pad.diskonjual1 as pcddiskonjual1, pad.diskonjual2 as pcddiskonjual2, pad.diskonjual3 as pcddiskonjual3, pad.diskonjual4 as pcddiskonjual4, pad.diskonjual5 as pcddiskonjual5, pad.customtext1 as pcdcustomtext1, pad.customtext2 as pcdcustomtext2, pad.customtext3 as pcdcustomtext3, '' as pcdcustomtext4, '' as pcdcustomtext5, 0 as pcdcustomint1, 0 as pcdcustomint2, 0 as pcdcustomint3, pad.customdbl1 as pcdcustomdbl1, pad.customdbl2 as pcdcustomdbl2, pad.customdbl3 as pcdcustomdbl3, pad.customdate1 as pcdcustomdate1, pad.customdate2 as pcdcustomdate2, pad.customdate3 as pcdcustomdate3, 0 as pcddownloaded FROM m3_pa_detail pad JOIN m1_item i ON pad.idbarang = i.bid AND pad.idpa = '{FixDouble_result_4}') ON DUPLICATE KEY UPDATE pcdhargajual1 = VALUES(pcdhargajual1), pcdhargajual2 = VALUES(pcdhargajual2), pcdhargajual3 = VALUES(pcdhargajual3), pcdhargajual4 = VALUES(pcdhargajual4), pcdhargajual5 = VALUES(pcdhargajual5), pcddiskonjual1 = VALUES(pcddiskonjual1), pcddiskonjual2 = VALUES(pcddiskonjual2), pcddiskonjual3 = VALUES(pcddiskonjual3), pcddiskonjual4 = VALUES(pcddiskonjual4), pcddiskonjual5 = VALUES(pcddiskonjual5)
```

```sql
UPDATE m3_pa_detail pad JOIN m1_item i ON pad.idbarang = i.bid SET i.bhargajual1 = pad.hargajual1lama, i.bhargajual2 = pad.hargajual2lama, i.bhargajual3 = pad.hargajual3lama, i.bhargajual4 = pad.hargajual4lama, i.bhargajual5 = pad.hargajual5lama, i.bdiskonjual1 = pad.diskonjual1lama, i.bdiskonjual2 = pad.diskonjual2lama, i.bdiskonjual3 = pad.diskonjual3lama, i.bdiskonjual4 = pad.diskonjual4lama, i.bdiskonjual5 = pad.diskonjual5lama WHERE pad.idpa = '{FixDouble_result_4}'
```

```sql
UPDATE m3_pa_detail pad JOIN m1_price_category_detail i ON i.pcdkategori = '{pakategoriharga}' AND pad.idbarang = i.pcdidbarang SET i.pcdhargajual1 = pad.hargajual1lama, i.pcdhargajual2 = pad.hargajual2lama, i.pcdhargajual3 = pad.hargajual3lama, i.pcdhargajual4 = pad.hargajual4lama, i.pcdhargajual5 = pad.hargajual5lama, i.pcddiskonjual1 = pad.diskonjual1lama, i.pcddiskonjual2 = pad.diskonjual2lama, i.pcddiskonjual3 = pad.diskonjual3lama, i.pcddiskonjual4 = pad.diskonjual4lama, i.pcddiskonjual5 = pad.diskonjual5lama WHERE pad.idpa = '{FixDouble_result_4}'
```

## `client-backend/api-myerpplus/app_code/ws/m3/m3_pa_history.vb`

```sql
INSERT INTO m3_pa_history(SELECT 0, pa.* FROM m3_pa pa WHERE pa.paid = '{idtransaksi}')
```

```sql
SELECT paidhistory FROM m3_pa_history WHERE paid = '{idtransaksi}' ORDER BY pamodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m3_pa_detail_history (SELECT 0, '{result_4}', pa.* FROM m3_pa_detail pa WHERE pa.idpa = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m3/m3_rf.vb`

```sql
SELECT COUNT(rfid), rfnotransaksi FROM M3_Rf WHERE rfid='{result_4}' AND rfstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(rfid) FROM m3_rf WHERE rfnotransaksi='{notransaksi}'
```

```sql
Update M3_Rf set rfcabang = '{FixQuotes_drutama}rfcabang', rflokasi = '{FixQuotes_drutama}rflokasi', rfgudangasal = '{FixQuotes_drutama}rfgudangasal', rfgudangtujuan = '{FixQuotes_drutama}rfgudangtujuan', rfsumber = '{FixQuotes_drutama}rfsumber', rfautonotransaksi = {drutama}rfautonotransaksi, rfnotransaksi = '{notransaksi}', rftgl = '{FixQuotes_AsFormatTanggal_drutama}rftgl', rfkodepa = {drutama}rfkodepa, rfdimintaoleh = {drutama}rfdimintaoleh, rfdimintaolehkontak = '{FixQuotes_drutama}rfdimintaolehkontak', rfmintake = {drutama}rfmintake, rftgldipakai = '{FixQuotes_AsFormatTanggal_drutama}rftgldipakai', rfuraian = '{FixQuotes_drutama}rfuraian', rfcatatan = '{FixQuotes_drutama}rfcatatan', rfnoref = '{FixQuotes_drutama}rfnoref', rftglnoref = '{FixQuotes_AsFormatTanggal_drutama}rftglnoref', rfstatusts = {drutama}rfstatusts, rfstatusrs = {drutama}rfstatusrs, rfstatus = {drutama}rfstatus, rfstatussebelumnya = {drutama}rfstatussebelumnya, rfjmlrevisi = rfjmlrevisi+1, rfcetakanke = {drutama}rfcetakanke, rfmodifikasiuser = {drutama}rfmodifikasiuser, rfmodifikasitgl = NOW(), rfcustomtext1 = '{FixQuotes_drutama}rfcustomtext1', rfcustomtext2 = '{FixQuotes_drutama}rfcustomtext2', rfcustomtext3 = '{FixQuotes_drutama}rfcustomtext3', rfcustomtext4 = '{FixQuotes_drutama}rfcustomtext4', rfcustomtext5 = '{FixQuotes_drutama}rfcustomtext5', rfcustomint1 = {drutama}rfcustomint1, rfcustomint2 = {drutama}rfcustomint2, rfcustomint3 = {drutama}rfcustomint3, rfcustomdbl1 = '{FixDouble_drutama}rfcustomdbl1', rfcustomdbl2 = '{FixDouble_drutama}rfcustomdbl2', rfcustomdbl3 = '{FixDouble_drutama}rfcustomdbl3', rfcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}rfcustomdate1', rfcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}rfcustomdate2', rfcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}rfcustomdate3' where rfid = '{drutama}rfid'
```

```sql
Insert into M3_Rf (rfcabang, rflokasi, rfgudangasal, rfgudangtujuan, rfsumber, rfautonotransaksi, rfnotransaksi, rftgl, rfkodepa, rfdimintaoleh, rfdimintaolehkontak, rfmintake, rftgldipakai, rfuraian, rfcatatan, rfnoref, rftglnoref, rfstatusts, rfstatusrs, rfstatus, rfstatussebelumnya, rfjmlrevisi, rfcetakanke, rfinputuser, rfinputtgl, rfmodifikasiuser, rfmodifikasitgl, rfisclose, rfcustomtext1, rfcustomtext2, rfcustomtext3, rfcustomtext4, rfcustomtext5, rfcustomint1, rfcustomint2, rfcustomint3, rfcustomdbl1, rfcustomdbl2, rfcustomdbl3, rfcustomdate1, rfcustomdate2, rfcustomdate3) values('{FixQuotes_drutama}rfcabang', '{FixQuotes_drutama}rflokasi', '{FixQuotes_drutama}rfgudangasal', '{FixQuotes_drutama}rfgudangtujuan', '{FixQuotes_drutama}rfsumber', {drutama}rfautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}rftgl', {drutama}rfkodepa, {drutama}rfdimintaoleh, '{FixQuotes_drutama}rfdimintaolehkontak', {drutama}rfmintake, '{FixQuotes_AsFormatTanggal_drutama}rftgldipakai', '{FixQuotes_drutama}rfuraian', '{FixQuotes_drutama}rfcatatan', '{FixQuotes_drutama}rfnoref', '{FixQuotes_AsFormatTanggal_drutama}rftglnoref', {drutama}rfstatusts, {drutama}rfstatusrs, {drutama}rfstatus, {drutama}rfstatussebelumnya, {drutama}rfjmlrevisi, {drutama}rfcetakanke, {drutama}rfinputuser, NOW(), {drutama}rfmodifikasiuser, '1971-01-01 00:00:00', {drutama}rfisclose, '{FixQuotes_drutama}rfcustomtext1', '{FixQuotes_drutama}rfcustomtext2', '{FixQuotes_drutama}rfcustomtext3', '{FixQuotes_drutama}rfcustomtext4', '{FixQuotes_drutama}rfcustomtext5', {drutama}rfcustomint1, {drutama}rfcustomint2, {drutama}rfcustomint3, '{FixDouble_drutama}rfcustomdbl1', '{FixDouble_drutama}rfcustomdbl2', '{FixDouble_drutama}rfcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}rfcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}rfcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}rfcustomdate3')
```

```sql
select rfid from M3_Rf where rfnotransaksi='{notransaksi}' AND Rfinputuser= '{userid}' order by Rfmodifikasitgl desc limit 1
```

```sql
Delete from M3_Rf_Detail where idrf = '{result_4}'
```

```sql
Insert into M3_Rf_Detail(idrfdetail, idrf, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, hargabeli, hargajual, stokterakhir, cabang, lokasi, gudangasal, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, jmlts, statusts, jmlrs, statusrs, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Rftgl, Rfnotransaksi, Rfstatus FROM m3_Rf WHERE Rfid='{idtransaksi}'
```

```sql
UPDATE M3_Rf SET Rfstatus = {nilaiStatus}, rfmodifikasiuser='{userid}', rfmodifikasitgl = NOW(), rfposting = 0, rfpostingtgl = '1971-01-01 00:00:00', rfjmlrevisi = rfjmlrevisi + 1 WHERE rfid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Rfid, Rfnotransaksi FROM m3_Rf WHERE Rfid='{idtransaksi}'
```

```sql
DELETE FROM M3_Rf_Detail WHERE idrf = '{idtransaksi}'
```

```sql
DELETE FROM M3_Rf WHERE rfid = '{idtransaksi}'
```

```sql
select `rf`.`rfid` AS `rfid`,`rf`.`rfcabang` AS `rfcabang`,`rf`.`rflokasi` AS `rflokasi`,`rf`.`rfgudangasal` AS `rfgudangasal`,`rf`.`rfgudangtujuan` AS `rfgudangtujuan`,`rf`.`rfsumber` AS `rfsumber`,`rf`.`rfautonotransaksi` AS `rfautonotransaksi`,`rf`.`rfnotransaksi` AS `rfnotransaksi`,`rf`.`rftgl` AS `rftgl`,`rf`.`rfkodepa` AS `rfkodepa`,`rf`.`rfdimintaoleh` AS `rfdimintaoleh`,`rf`.`rfdimintaolehkontak` AS `rfdimintaolehkontak`,`rf`.`rfmintake` AS `rfmintake`,`rf`.`rftgldipakai` AS `rftgldipakai`,`rf`.`rfuraian` AS `rfuraian`,`rf`.`rfcatatan` AS `rfcatatan`,`rf`.`rfnoref` AS `rfnoref`,`rf`.`rftglnoref` AS `rftglnoref`,`rf`.`rfstatusts` AS `rfstatusts`,`rf`.`rfstatusrs` AS `rfstatusrs`,`rf`.`rfstatusrealisasi` AS `rfstatusrealisasi`,`rf`.`rfstatus` AS `rfstatus`,`rf`.`rfstatussebelumnya` AS `rfstatussebelumnya`,`rf`.`rfjmlrevisi` AS `rfjmlrevisi`,`rf`.`rfcetakanke` AS `rfcetakanke`,`rf`.`rfinputuser` AS `rfinputuser`,`rf`.`rfinputtgl` AS `rfinputtgl`,`rf`.`rfmodifikasiuser` AS `rfmodifikasiuser`,`rf`.`rfmodifikasitgl` AS `rfmodifikasitgl`,`rf`.`rfposting` AS `rfposting`,`rf`.`rfpostingtgl` AS `rfpostingtgl`,`rf`.`rfisclose` AS `rfisclose`,`rf`.`rfcustomtext1` AS `rfcustomtext1`,`rf`.`rfcustomtext2` AS `rfcustomtext2`,`rf`.`rfcustomtext3` AS `rfcustomtext3`,`rf`.`rfcustomtext4` AS `rfcustomtext4`,`rf`.`rfcustomtext5` AS `rfcustomtext5`,`rf`.`rfcustomint1` AS `rfcustomint1`,`rf`.`rfcustomint2` AS `rfcustomint2`,`rf`.`rfcustomint3` AS `rfcustomint3`,`rf`.`rfcustomdbl1` AS `rfcustomdbl1`,`rf`.`rfcustomdbl2` AS `rfcustomdbl2`,`rf`.`rfcustomdbl3` AS `rfcustomdbl3`,`rf`.`rfcustomdate1` AS `rfcustomdate1`,`rf`.`rfcustomdate2` AS `rfcustomdate2`,`rf`.`rfcustomdate3` AS `rfcustomdate3`,`br`.`bnama` AS `rfcabangnama`,`lc`.`lnama` AS `rflokasinama`,`wh1`.`wnama` AS `rfgudangasalnama`,`wh2`.`wnama` AS `rfgudangtujuannama`,`c1`.`kkode` AS `rfdimintaolehkode`,`c1`.`knama` AS `rfdimintaolehnama`,`c2`.`kkode` AS `rfmintakekode`,`c2`.`knama` AS `rfmintakenama`,`st1`.`nama` AS `rfstatusnama`,`st2`.`nama` AS `rfstatussebelumnyanama`,`u1`.`unama` AS `rfinputusernama`,`u2`.`unama` AS `rfmodifikasiusernama`,`rfd`.`idrfdetail` AS `idrfdetail`,`rfd`.`idrf` AS `idrf`,`rfd`.`idbarang` AS `idbarang`,`rfd`.`namabarang` AS `namabarang`,`rfd`.`tipebarang` AS `tipebarang`,`rfd`.`jml` AS `jml`,`rfd`.`satuan` AS `satuan`,`rfd`.`nilaisatuan` AS `nilaisatuan`,`rfd`.`jmlbarang` AS `jmlbarang`,`rfd`.`satuanbarang` AS `satuanbarang`,`rfd`.`matauang` AS `matauang`,`rfd`.`kurs` AS `kurs`,`rfd`.`hargabeli` AS `hargabeli`,`rfd`.`hargajual` AS `hargajual`,`rfd`.`stokterakhir` AS `stokterakhir`,`rfd`.`cabang` AS `cabang`,`rfd`.`lokasi` AS `lokasi`,`rfd`.`gudangasal` AS `gudangasal`,`rfd`.`gudangtujuan` AS `gudangtujuan`,`rfd`.`costcenter` AS `costcenter`,`rfd`.`divisi` AS `divisi`,`rfd`.`subdivisi` AS `subdivisi`,`rfd`.`proyek` AS `proyek`,`rfd`.`catatan` AS `catatan`,`rfd`.`urutan` AS `urutan`,`rfd`.`jmlts` AS `jmlts`,`rfd`.`statusts` AS `statusts`,`rfd`.`jmlrs` AS `jmlrs`,`rfd`.`statusrs` AS `statusrs`,`rfd`.`jmlrealisasi` AS `jmlrealisasi`,`rfd`.`statusrealisasi` AS `statusrealisasi`,`rfd`.`isclose` AS `isclose`,`rfd`.`customtext1` AS `customtext1`,`rfd`.`customtext2` AS `customtext2`,`rfd`.`customtext3` AS `customtext3`,`rfd`.`customdbl1` AS `customdbl1`,`rfd`.`customdbl2` AS `customdbl2`,`rfd`.`customdbl3` AS `customdbl3`,`rfd`.`customdate1` AS `customdate1`,`rfd`.`customdate2` AS `customdate2`,`rfd`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`brd`.`bnama` AS `cabangnama`,`lcd`.`lnama` AS `lokasinama`,`whd1`.`wnama` AS `gudangasalnama`,`whd2`.`wnama` AS `gudangtujuannama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama` from ((((((((((((((((((((`m3_rf` `rf` join `m3_rf_detail` `rfd` on((`rf`.`rfid` = `rfd`.`idrf`))) left join `m1_branch` `br` on((`br`.`bkode` = `rf`.`rfcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `rf`.`rflokasi`))) left join `m1_warehouse` `wh1` on((`wh1`.`wkode` = `rf`.`rfgudangasal`))) left join `m1_warehouse` `wh2` on((`wh2`.`wkode` = `rf`.`rfgudangtujuan`))) left join `m1_contact` `c1` on((`c1`.`kid` = `rf`.`rfdimintaoleh`))) left join `m1_contact` `c2` on((`c2`.`kid` = `rf`.`rfmintake`))) left join `m0_status` `st1` on((`st1`.`kode` = `rf`.`rfstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `rf`.`rfstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `rf`.`rfinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `rf`.`rfmodifikasiuser`))) left join `m1_item_hauling` `i` on((`i`.`bid` = `rfd`.`idbarang`))) left join `m1_branch` `brd` on((`rfd`.`cabang` = `brd`.`bkode`))) left join `m1_location` `lcd` on((`rfd`.`lokasi` = `lcd`.`lkode`))) left join `m1_warehouse` `whd1` on((`rfd`.`gudangasal` = `whd1`.`wkode`))) left join `m1_warehouse` `whd2` on((`rfd`.`gudangtujuan` = `whd2`.`wkode`))) left join `m1_cost_center` `cc` on((`rfd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`rfd`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`rfd`.`subdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`rfd`.`proyek` = `p`.`pkode`)))
```

```sql
select `rf`.`rfid` AS `rfid`,`rf`.`rfcabang` AS `rfcabang`,`rf`.`rflokasi` AS `rflokasi`,`rf`.`rfgudangasal` AS `rfgudangasal`,`rf`.`rfgudangtujuan` AS `rfgudangtujuan`,`rf`.`rfsumber` AS `rfsumber`,`rf`.`rfautonotransaksi` AS `rfautonotransaksi`,`rf`.`rfnotransaksi` AS `rfnotransaksi`,`rf`.`rftgl` AS `rftgl`,`rf`.`rfkodepa` AS `rfkodepa`,`rf`.`rfdimintaoleh` AS `rfdimintaoleh`,`rf`.`rfdimintaolehkontak` AS `rfdimintaolehkontak`,`rf`.`rfmintake` AS `rfmintake`,`rf`.`rftgldipakai` AS `rftgldipakai`,`rf`.`rfuraian` AS `rfuraian`,`rf`.`rfcatatan` AS `rfcatatan`,`rf`.`rfnoref` AS `rfnoref`,`rf`.`rftglnoref` AS `rftglnoref`,`rf`.`rfstatusts` AS `rfstatusts`,`rf`.`rfstatusrs` AS `rfstatusrs`,`rf`.`rfstatusrealisasi` AS `rfstatusrealisasi`,`rf`.`rfstatus` AS `rfstatus`,`rf`.`rfstatussebelumnya` AS `rfstatussebelumnya`,`rf`.`rfjmlrevisi` AS `rfjmlrevisi`,`rf`.`rfcetakanke` AS `rfcetakanke`,`rf`.`rfinputuser` AS `rfinputuser`,`rf`.`rfinputtgl` AS `rfinputtgl`,`rf`.`rfmodifikasiuser` AS `rfmodifikasiuser`,`rf`.`rfmodifikasitgl` AS `rfmodifikasitgl`,`rf`.`rfposting` AS `rfposting`,`rf`.`rfpostingtgl` AS `rfpostingtgl`,`rf`.`rfisclose` AS `rfisclose`,`br`.`bnama` AS `rfcabangnama`,`lc`.`lnama` AS `rflokasinama`,`wh1`.`wnama` AS `rfgudangasalnama`,`wh2`.`wnama` AS `rfgudangtujuannama`,`c1`.`kkode` AS `rfdimintaolehkode`,`c1`.`knama` AS `rfdimintaolehnama`,`c2`.`kkode` AS `rfmintakekode`,`c2`.`knama` AS `rfmintakenama`,`st1`.`nama` AS `rfstatusnama`,`st2`.`nama` AS `rfstatussebelumnyanama`,`u1`.`unama` AS `rfinputusernama`,`u2`.`unama` AS `rfmodifikasiusernama` from ((((((((((`m3_rf` `rf` left join `m1_branch` `br` on((`br`.`bkode` = `rf`.`rfcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `rf`.`rflokasi`))) left join `m1_warehouse` `wh1` on((`wh1`.`wkode` = `rf`.`rfgudangasal`))) left join `m1_warehouse` `wh2` on((`wh2`.`wkode` = `rf`.`rfgudangtujuan`))) left join `m1_contact` `c1` on((`c1`.`kid` = `rf`.`rfdimintaoleh`))) left join `m1_contact` `c2` on((`c2`.`kid` = `rf`.`rfmintake`))) left join `m0_status` `st1` on((`st1`.`kode` = `rf`.`rfstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `rf`.`rfstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `rf`.`rfinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `rf`.`rfmodifikasiuser`)))
```

```sql
select `rfd`.`idrfdetail` AS `idrfdetail`,`rfd`.`idrf` AS `idrf`,`rfd`.`idbarang` AS `idbarang`,`rfd`.`namabarang` AS `namabarang`,`rfd`.`tipebarang` AS `tipebarang`,`rfd`.`jml` AS `jml`,`rfd`.`satuan` AS `satuan`,`rfd`.`nilaisatuan` AS `nilaisatuan`,`rfd`.`jmlbarang` AS `jmlbarang`,`rfd`.`satuanbarang` AS `satuanbarang`,`rfd`.`matauang` AS `matauang`,`rfd`.`kurs` AS `kurs`,`rfd`.`hargabeli` AS `hargabeli`,`rfd`.`hargajual` AS `hargajual`,`rfd`.`stokterakhir` AS `stokterakhir`,`rfd`.`cabang` AS `cabang`,`rfd`.`lokasi` AS `lokasi`,`rfd`.`gudangasal` AS `gudangasal`,`rfd`.`gudangtujuan` AS `gudangtujuan`,`rfd`.`costcenter` AS `costcenter`,`rfd`.`divisi` AS `divisi`,`rfd`.`subdivisi` AS `subdivisi`,`rfd`.`proyek` AS `proyek`,`rfd`.`catatan` AS `catatan`,`rfd`.`urutan` AS `urutan`,`rfd`.`jmlts` AS `jmlts`,`rfd`.`statusts` AS `statusts`,`rfd`.`jmlrs` AS `jmlrs`,`rfd`.`statusrs` AS `statusrs`,`rfd`.`jmlrealisasi` AS `jmlrealisasi`,`rfd`.`statusrealisasi` AS `statusrealisasi`,`rfd`.`isclose` AS `isclose`,`rfd`.`customtext1` AS `customtext1`,`rfd`.`customtext2` AS `customtext2`,`rfd`.`customtext3` AS `customtext3`,`rfd`.`customdbl1` AS `customdbl1`,`rfd`.`customdbl2` AS `customdbl2`,`rfd`.`customdbl3` AS `customdbl3`,`rfd`.`customdate1` AS `customdate1`,`rfd`.`customdate2` AS `customdate2`,`rfd`.`customdate3` AS `customdate3`,`rf`.`rfnotransaksi` AS `rfnotransaksi`,`i`.`bkode` AS `kodebarang`,`i`.`bhpp` AS `bhpp`,`i`.`bhppaverage` AS `bhppaverage`,`i`.`bjenis` AS `bjenis`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,((`rfd`.`jmlbarang` - `rfd`.`jmlts`) / `rfd`.`nilaisatuan`) AS `jmlsisats`,((`rfd`.`jmlbarang` - `rfd`.`jmlrs`) / `rfd`.`nilaisatuan`) AS `jmlsisars`,((`rfd`.`jmlbarang` - `rfd`.`jmlrealisasi`) / `rfd`.`nilaisatuan`) AS `jmlsisarealisasi` from ((`m3_rf_detail` `rfd` join `m3_rf` `rf` on((`rfd`.`idrf` = `rf`.`rfid`))) join `m1_item_hauling` `i` on((`rfd`.`idbarang` = `i`.`bid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m3/m3_rf_history.vb`

```sql
INSERT INTO m3_rf_history(SELECT 0, rf.* FROM m3_rf rf WHERE rf.rfid = '{idtransaksi}')
```

```sql
SELECT rfidhistory FROM m3_rf_history WHERE rfid = '{idtransaksi}' ORDER BY rfmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m3_rf_detail_history (SELECT 0, '{result_4}', rf.* FROM m3_rf_detail rf WHERE rf.idrf = '{idtransaksi}' )
```

```sql
select `rf`.`rfidhistory` AS `rfidhistory`,`rf`.`rfid` AS `rfid`,`rf`.`rfcabang` AS `rfcabang`,`rf`.`rflokasi` AS `rflokasi`,`rf`.`rfgudangasal` AS `rfgudangasal`,`rf`.`rfgudangtujuan` AS `rfgudangtujuan`,`rf`.`rfsumber` AS `rfsumber`,`rf`.`rfautonotransaksi` AS `rfautonotransaksi`,`rf`.`rfnotransaksi` AS `rfnotransaksi`,`rf`.`rftgl` AS `rftgl`,`rf`.`rfkodepa` AS `rfkodepa`,`rf`.`rfdimintaoleh` AS `rfdimintaoleh`,`rf`.`rfdimintaolehkontak` AS `rfdimintaolehkontak`,`rf`.`rfmintake` AS `rfmintake`,`rf`.`rftgldipakai` AS `rftgldipakai`,`rf`.`rfuraian` AS `rfuraian`,`rf`.`rfcatatan` AS `rfcatatan`,`rf`.`rfnoref` AS `rfnoref`,`rf`.`rftglnoref` AS `rftglnoref`,`rf`.`rfstatusts` AS `rfstatusts`,`rf`.`rfstatusrs` AS `rfstatusrs`,`rf`.`rfstatusrealisasi` AS `rfstatusrealisasi`,`rf`.`rfstatus` AS `rfstatus`,`rf`.`rfstatussebelumnya` AS `rfstatussebelumnya`,`rf`.`rfjmlrevisi` AS `rfjmlrevisi`,`rf`.`rfcetakanke` AS `rfcetakanke`,`rf`.`rfinputuser` AS `rfinputuser`,`rf`.`rfinputtgl` AS `rfinputtgl`,`rf`.`rfmodifikasiuser` AS `rfmodifikasiuser`,`rf`.`rfmodifikasitgl` AS `rfmodifikasitgl`,`rf`.`rfposting` AS `rfposting`,`rf`.`rfpostingtgl` AS `rfpostingtgl`,`rf`.`rfisclose` AS `rfisclose`,`br`.`bnama` AS `rfcabangnama`,`lc`.`lnama` AS `rflokasinama`,`wh1`.`wnama` AS `rfgudangasalnama`,`wh2`.`wnama` AS `rfgudangtujuannama`,`c1`.`kkode` AS `rfdimintaolehkode`,`c1`.`knama` AS `rfdimintaolehnama`,`c2`.`kkode` AS `rfmintakekode`,`c2`.`knama` AS `rfmintakenama`,`st1`.`nama` AS `rfstatusnama`,`st2`.`nama` AS `rfstatussebelumnyanama`,`u1`.`unama` AS `rfinputusernama`,`u2`.`unama` AS `rfmodifikasiusernama` from ((((((((((`m3_rf_history` `rf` left join `m1_branch` `br` on((`br`.`bkode` = `rf`.`rfcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `rf`.`rflokasi`))) left join `m1_warehouse` `wh1` on((`wh1`.`wkode` = `rf`.`rfgudangasal`))) left join `m1_warehouse` `wh2` on((`wh2`.`wkode` = `rf`.`rfgudangtujuan`))) left join `m1_contact` `c1` on((`c1`.`kid` = `rf`.`rfdimintaoleh`))) left join `m1_contact` `c2` on((`c2`.`kid` = `rf`.`rfmintake`))) left join `m0_status` `st1` on((`st1`.`kode` = `rf`.`rfstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `rf`.`rfstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `rf`.`rfinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `rf`.`rfmodifikasiuser`)))
```

```sql
select `rf`.`rfidhistory` AS `rfidhistory`,`rf`.`rfid` AS `rfid`,`rf`.`rfcabang` AS `rfcabang`,`rf`.`rflokasi` AS `rflokasi`,`rf`.`rfgudangasal` AS `rfgudangasal`,`rf`.`rfgudangtujuan` AS `rfgudangtujuan`,`rf`.`rfsumber` AS `rfsumber`,`rf`.`rfautonotransaksi` AS `rfautonotransaksi`,`rf`.`rfnotransaksi` AS `rfnotransaksi`,`rf`.`rftgl` AS `rftgl`,`rf`.`rfkodepa` AS `rfkodepa`,`rf`.`rfdimintaoleh` AS `rfdimintaoleh`,`rf`.`rfdimintaolehkontak` AS `rfdimintaolehkontak`,`rf`.`rfmintake` AS `rfmintake`,`rf`.`rftgldipakai` AS `rftgldipakai`,`rf`.`rfuraian` AS `rfuraian`,`rf`.`rfcatatan` AS `rfcatatan`,`rf`.`rfnoref` AS `rfnoref`,`rf`.`rftglnoref` AS `rftglnoref`,`rf`.`rfstatusts` AS `rfstatusts`,`rf`.`rfstatusrs` AS `rfstatusrs`,`rf`.`rfstatusrealisasi` AS `rfstatusrealisasi`,`rf`.`rfstatus` AS `rfstatus`,`rf`.`rfstatussebelumnya` AS `rfstatussebelumnya`,`rf`.`rfjmlrevisi` AS `rfjmlrevisi`,`rf`.`rfcetakanke` AS `rfcetakanke`,`rf`.`rfinputuser` AS `rfinputuser`,`rf`.`rfinputtgl` AS `rfinputtgl`,`rf`.`rfmodifikasiuser` AS `rfmodifikasiuser`,`rf`.`rfmodifikasitgl` AS `rfmodifikasitgl`,`rf`.`rfposting` AS `rfposting`,`rf`.`rfpostingtgl` AS `rfpostingtgl`,`rf`.`rfisclose` AS `rfisclose`,`rf`.`rfcustomtext1` AS `rfcustomtext1`,`rf`.`rfcustomtext2` AS `rfcustomtext2`,`rf`.`rfcustomtext3` AS `rfcustomtext3`,`rf`.`rfcustomtext4` AS `rfcustomtext4`,`rf`.`rfcustomtext5` AS `rfcustomtext5`,`rf`.`rfcustomint1` AS `rfcustomint1`,`rf`.`rfcustomint2` AS `rfcustomint2`,`rf`.`rfcustomint3` AS `rfcustomint3`,`rf`.`rfcustomdbl1` AS `rfcustomdbl1`,`rf`.`rfcustomdbl2` AS `rfcustomdbl2`,`rf`.`rfcustomdbl3` AS `rfcustomdbl3`,`rf`.`rfcustomdate1` AS `rfcustomdate1`,`rf`.`rfcustomdate2` AS `rfcustomdate2`,`rf`.`rfcustomdate3` AS `rfcustomdate3`,`br`.`bnama` AS `rfcabangnama`,`lc`.`lnama` AS `rflokasinama`,`wh1`.`wnama` AS `rfgudangasalnama`,`wh2`.`wnama` AS `rfgudangtujuannama`,`c1`.`kkode` AS `rfdimintaolehkode`,`c1`.`knama` AS `rfdimintaolehnama`,`c2`.`kkode` AS `rfmintakekode`,`c2`.`knama` AS `rfmintakenama`,`st1`.`nama` AS `rfstatusnama`,`st2`.`nama` AS `rfstatussebelumnyanama`,`u1`.`unama` AS `rfinputusernama`,`u2`.`unama` AS `rfmodifikasiusernama`,`rfd`.`idhistorydetail` AS `idhistorydetail`,`rfd`.`idhistory` AS `idhistory`,`rfd`.`idrfdetail` AS `idrfdetail`,`rfd`.`idrf` AS `idrf`,`rfd`.`idbarang` AS `idbarang`,`rfd`.`namabarang` AS `namabarang`,`rfd`.`tipebarang` AS `tipebarang`,`rfd`.`jml` AS `jml`,`rfd`.`satuan` AS `satuan`,`rfd`.`nilaisatuan` AS `nilaisatuan`,`rfd`.`jmlbarang` AS `jmlbarang`,`rfd`.`satuanbarang` AS `satuanbarang`,`rfd`.`matauang` AS `matauang`,`rfd`.`kurs` AS `kurs`,`rfd`.`hargabeli` AS `hargabeli`,`rfd`.`hargajual` AS `hargajual`,`rfd`.`stokterakhir` AS `stokterakhir`,`rfd`.`cabang` AS `cabang`,`rfd`.`lokasi` AS `lokasi`,`rfd`.`gudangasal` AS `gudangasal`,`rfd`.`gudangtujuan` AS `gudangtujuan`,`rfd`.`costcenter` AS `costcenter`,`rfd`.`divisi` AS `divisi`,`rfd`.`subdivisi` AS `subdivisi`,`rfd`.`proyek` AS `proyek`,`rfd`.`catatan` AS `catatan`,`rfd`.`urutan` AS `urutan`,`rfd`.`jmlts` AS `jmlts`,`rfd`.`statusts` AS `statusts`,`rfd`.`jmlrs` AS `jmlrs`,`rfd`.`statusrs` AS `statusrs`,`rfd`.`jmlrealisasi` AS `jmlrealisasi`,`rfd`.`statusrealisasi` AS `statusrealisasi`,`rfd`.`isclose` AS `isclose`,`rfd`.`customtext1` AS `customtext1`,`rfd`.`customtext2` AS `customtext2`,`rfd`.`customtext3` AS `customtext3`,`rfd`.`customdbl1` AS `customdbl1`,`rfd`.`customdbl2` AS `customdbl2`,`rfd`.`customdbl3` AS `customdbl3`,`rfd`.`customdate1` AS `customdate1`,`rfd`.`customdate2` AS `customdate2`,`rfd`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`brd`.`bnama` AS `cabangnama`,`lcd`.`lnama` AS `lokasinama`,`whd1`.`wnama` AS `gudangasalnama`,`whd2`.`wnama` AS `gudangtujuannama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama` from ((((((((((((((((((((`m3_rf_history` `rf` join `m3_rf_detail_history` `rfd` on((`rf`.`rfidhistory` = `rfd`.`idhistory`))) left join `m1_branch` `br` on((`br`.`bkode` = `rf`.`rfcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `rf`.`rflokasi`))) left join `m1_warehouse` `wh1` on((`wh1`.`wkode` = `rf`.`rfgudangasal`))) left join `m1_warehouse` `wh2` on((`wh2`.`wkode` = `rf`.`rfgudangtujuan`))) left join `m1_contact` `c1` on((`c1`.`kid` = `rf`.`rfdimintaoleh`))) left join `m1_contact` `c2` on((`c2`.`kid` = `rf`.`rfmintake`))) left join `m0_status` `st1` on((`st1`.`kode` = `rf`.`rfstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `rf`.`rfstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `rf`.`rfinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `rf`.`rfmodifikasiuser`))) left join `m1_item_hauling` `i` on((`i`.`bid` = `rfd`.`idbarang`))) left join `m1_branch` `brd` on((`rfd`.`cabang` = `brd`.`bkode`))) left join `m1_location` `lcd` on((`rfd`.`lokasi` = `lcd`.`lkode`))) left join `m1_warehouse` `whd1` on((`rfd`.`gudangasal` = `whd1`.`wkode`))) left join `m1_warehouse` `whd2` on((`rfd`.`gudangtujuan` = `whd2`.`wkode`))) left join `m1_cost_center` `cc` on((`rfd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`rfd`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`rfd`.`subdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`rfd`.`proyek` = `p`.`pkode`)))
```

## `client-backend/api-myerpplus/app_code/ws/m3/m3_rs.vb`

```sql
SELECT EXISTS(SELECT 1 FROM m3_ts_detail JOIN m3_ts ON idts = tsid WHERE idtsdetail = '{idtsdetail}' AND (tsstatus = 2 OR tsstatus = 3 OR tsstatus = 4 OR tsstatus = 7) LIMIT 1) as rowExists, '{idtsdetail}' as idtsdetail, bkode FROM m1_item WHERE bid = '{idbarang}'
```

```sql
SELECT EXISTS(SELECT 1 FROM m3_ts_detail JOIN m3_ts ON idts = tsid WHERE idtsdetail = '{idtsdetail}' AND (tsstatus = 2 OR tsstatus = 3) LIMIT 1) as rowExists, '{idtsdetail}' as idtsdetail, bkode FROM m1_item WHERE bid = '{idbarang}'
```

```sql
SELECT COUNT(rsid), rsnotransaksi FROM M3_Rs WHERE rsid='{result_4}' AND rsstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(rsid) FROM m3_rs WHERE rsnotransaksi='{notransaksi}'
```

```sql
Update M3_Rs set rscabang = '{FixQuotes_drutama}rscabang', rslokasi = '{FixQuotes_drutama}rslokasi', rsgudangasal = '{FixQuotes_drutama}rsgudangasal', rsgudangtransit = '{FixQuotes_drutama}rsgudangtransit', rsgudangtujuan = '{FixQuotes_drutama}rsgudangtujuan', rssumber = '{FixQuotes_drutama}rssumber', rsautonotransaksi = {drutama}rsautonotransaksi, rsnotransaksi = '{notransaksi}', rstgl = '{FixQuotes_AsFormatTanggal_drutama}rstgl', rskodepa = {drutama}rskodepa, rsbagianterima = {drutama}rsbagianterima, rsbagianterimakontak = '{FixQuotes_drutama}rsbagianterimakontak', rsuraian = '{FixQuotes_drutama}rsuraian', rscatatan = '{FixQuotes_drutama}rscatatan', rsnoref = '{FixQuotes_drutama}rsnoref', rstglnoref = '{FixQuotes_AsFormatTanggal_drutama}rstglnoref', rsidmr = {drutama}rsidmr, rsidts = {drutama}rsidts, rsstatus = {drutama}rsstatus, rsstatussebelumnya = {drutama}rsstatussebelumnya, rsjmlrevisi = rsjmlrevisi+1, rscetakanke = {drutama}rscetakanke, rsmodifikasiuser = {drutama}rsmodifikasiuser, rsmodifikasitgl = NOW(), rscustomtext1 = '{FixQuotes_drutama}rscustomtext1', rscustomtext2 = '{FixQuotes_drutama}rscustomtext2', rscustomtext3 = '{FixQuotes_drutama}rscustomtext3', rscustomtext4 = '{FixQuotes_drutama}rscustomtext4', rscustomtext5 = '{FixQuotes_drutama}rscustomtext5', rscustomint1 = {drutama}rscustomint1, rscustomint2 = {drutama}rscustomint2, rscustomint3 = {drutama}rscustomint3, rscustomdbl1 = '{FixDouble_drutama}rscustomdbl1', rscustomdbl2 = '{FixDouble_drutama}rscustomdbl2', rscustomdbl3 = '{FixDouble_drutama}rscustomdbl3', rscustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}rscustomdate1', rscustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}rscustomdate2', rscustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}rscustomdate3' where rsid = '{drutama}rsid'
```

```sql
Insert into M3_Rs (rscabang, rslokasi, rsgudangasal, rsgudangtransit, rsgudangtujuan, rssumber, rsautonotransaksi, rsnotransaksi, rstgl, rskodepa, rsbagianterima, rsbagianterimakontak, rsuraian, rscatatan, rsnoref, rstglnoref, rsidmr, rsidts, rsstatus, rsstatussebelumnya, rsjmlrevisi, rscetakanke, rsinputuser, rsinputtgl, rsmodifikasiuser, rsmodifikasitgl, rsisclose, rscustomtext1, rscustomtext2, rscustomtext3, rscustomtext4, rscustomtext5, rscustomint1, rscustomint2, rscustomint3, rscustomdbl1, rscustomdbl2, rscustomdbl3, rscustomdate1, rscustomdate2, rscustomdate3) values('{FixQuotes_drutama}rscabang', '{FixQuotes_drutama}rslokasi', '{FixQuotes_drutama}rsgudangasal', '{FixQuotes_drutama}rsgudangtransit', '{FixQuotes_drutama}rsgudangtujuan', '{FixQuotes_drutama}rssumber', {drutama}rsautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}rstgl', {drutama}rskodepa, {drutama}rsbagianterima, '{FixQuotes_drutama}rsbagianterimakontak', '{FixQuotes_drutama}rsuraian', '{FixQuotes_drutama}rscatatan', '{FixQuotes_drutama}rsnoref', '{FixQuotes_AsFormatTanggal_drutama}rstglnoref', {drutama}rsidmr, {drutama}rsidts, {drutama}rsstatus, {drutama}rsstatussebelumnya, {drutama}rsjmlrevisi, {drutama}rscetakanke, {drutama}rsinputuser, NOW(), {drutama}rsmodifikasiuser, '1971-01-01 00:00:00', {drutama}rsisclose, '{FixQuotes_drutama}rscustomtext1', '{FixQuotes_drutama}rscustomtext2', '{FixQuotes_drutama}rscustomtext3', '{FixQuotes_drutama}rscustomtext4', '{FixQuotes_drutama}rscustomtext5', {drutama}rscustomint1, {drutama}rscustomint2, {drutama}rscustomint3, '{FixDouble_drutama}rscustomdbl1', '{FixDouble_drutama}rscustomdbl2', '{FixDouble_drutama}rscustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}rscustomdate1', '{FixQuotes_AsFormatTanggal_drutama}rscustomdate2', '{FixQuotes_AsFormatTanggal_drutama}rscustomdate3')
```

```sql
select rsid from M3_rs where rsnotransaksi='{notransaksi}' AND rsinputuser= '{userid}' order by rsmodifikasitgl desc limit 1
```

```sql
Delete from M3_Rs_Detail where idrs = '{result_4}'
```

```sql
Insert into M3_Rs_Detail(idrsdetail, idrs, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, cabang, lokasi, gudangasal, gudangtransit, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idmrdetail, idtsdetail, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
UPDATE m3_ts_detail SET jmlrealisasi = (CASE idtsdetail {updNilai} ELSE jmlrealisasi END) WHERE
```

```sql
SELECT idts FROM m3_ts_detail WHERE {updFilter} GROUP BY idts
```

```sql
SELECT idts, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m3_ts_detail WHERE {ftDetail} GROUP BY idts
```

```sql
UPDATE m3_ts SET tsstatusrealisasi = (CASE tsid {updNilai} ELSE tsstatusrealisasi END) WHERE
```

```sql
UPDATE m3_mr_detail SET jmlrealisasi = (CASE idmrdetail {updNilaiMR} ELSE jmlrealisasi END) WHERE
```

```sql
SELECT idmr FROM m3_mr_detail WHERE {updFilterMR} GROUP BY idmr
```

```sql
SELECT idmr, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m3_mr_detail WHERE {ftDetail} GROUP BY idmr
```

```sql
UPDATE m3_mr SET mrstatusrealisasi = (CASE mrid {updNilaiMR} ELSE mrstatusrealisasi END) WHERE
```

```sql
SELECT rsd.idrsdetail, rsd.idbarang, rsd.namabarang, rsd.tipebarang, rsd.jml, rsd.satuan, rsd.jmlbarang, rsd.satuanbarang, rsd.gudangasal, rsd.gudangtransit, rsd.gudangtujuan, rsd.catatan, rsd.costcenter, rsd.divisi, rsd.subdivisi, rsd.proyek, rs.rsinputtgl, i.bhpp, i.bhppaverage FROM m3_rs_detail rsd JOIN m3_rs rs ON rsd.idrs = rs.rsid JOIN m1_item i ON rsd.idbarang = i.bid WHERE rsd.idrs = '{result_4}'
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT rstgl, rsnotransaksi, rsstatus FROM m3_rs WHERE rsid='{idtransaksi}'
```

```sql
SELECT idbarang, tipebarang, namabarang, satuan, nilaisatuan, jmlbarang, gudangtransit, gudangtujuan, idmrdetail, idtsdetail, urutan FROM m3_rs_detail WHERE idrs = '{idtransaksi}'
```

```sql
UPDATE M3_rs SET rsstatus = {nilaiStatus}, rsmodifikasiuser='{userid}', rsmodifikasitgl = NOW(), rsposting = 0, rspostingtgl = '1971-01-01 00:00:00', rsjmlrevisi = rsjmlrevisi + 1 WHERE rsid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Rsid, Rsnotransaksi FROM m3_Rs WHERE Rsid='{idtransaksi}'
```

```sql
DELETE FROM M3_Rs_Detail WHERE idrs = '{idtransaksi}'
```

```sql
DELETE FROM M3_Rs WHERE rsid = '{idtransaksi}'
```

```sql
select `rs`.`rsid` AS `rsid`,`rs`.`rscabang` AS `rscabang`,`rs`.`rslokasi` AS `rslokasi`,`rs`.`rsgudangasal` AS `rsgudangasal`,`rs`.`rsgudangtransit` AS `rsgudangtransit`,`rs`.`rsgudangtujuan` AS `rsgudangtujuan`,`rs`.`rssumber` AS `rssumber`,`rs`.`rsautonotransaksi` AS `rsautonotransaksi`,`rs`.`rsnotransaksi` AS `rsnotransaksi`,`rs`.`rstgl` AS `rstgl`,`rs`.`rskodepa` AS `rskodepa`,`rs`.`rsbagianterima` AS `rsbagianterima`,`rs`.`rsbagianterimakontak` AS `rsbagianterimakontak`,`rs`.`rsuraian` AS `rsuraian`,`rs`.`rscatatan` AS `rscatatan`,`rs`.`rsnoref` AS `rsnoref`,`rs`.`rstglnoref` AS `rstglnoref`,`rs`.`rsidmr` AS `rsidmr`,`rs`.`rsidts` AS `rsidts`,`rs`.`rsstatus` AS `rsstatus`,`rs`.`rsstatussebelumnya` AS `rsstatussebelumnya`,`rs`.`rsjmlrevisi` AS `rsjmlrevisi`,`rs`.`rscetakanke` AS `rscetakanke`,`rs`.`rsinputuser` AS `rsinputuser`,`rs`.`rsinputtgl` AS `rsinputtgl`,`rs`.`rsmodifikasiuser` AS `rsmodifikasiuser`,`rs`.`rsmodifikasitgl` AS `rsmodifikasitgl`,`rs`.`rsposting` AS `rsposting`,`rs`.`rspostingtgl` AS `rspostingtgl`,`rs`.`rsisclose` AS `rsisclose`,`rs`.`rscustomtext1` AS `rscustomtext1`,`rs`.`rscustomtext2` AS `rscustomtext2`,`rs`.`rscustomtext3` AS `rscustomtext3`,`rs`.`rscustomtext4` AS `rscustomtext4`,`rs`.`rscustomtext5` AS `rscustomtext5`,`rs`.`rscustomint1` AS `rscustomint1`,`rs`.`rscustomint2` AS `rscustomint2`,`rs`.`rscustomint3` AS `rscustomint3`,`rs`.`rscustomdbl1` AS `rscustomdbl1`,`rs`.`rscustomdbl2` AS `rscustomdbl2`,`rs`.`rscustomdbl3` AS `rscustomdbl3`,`rs`.`rscustomdate1` AS `rscustomdate1`,`rs`.`rscustomdate2` AS `rscustomdate2`,`rs`.`rscustomdate3` AS `rscustomdate3`,`br`.`bnama` AS `rscabangnama`,`lc`.`lnama` AS `rslokasinama`,`wh1`.`wnama` AS `rsgudangasalnama`,`wh2`.`wnama` AS `rsgudangtransitnama`,`wh3`.`wnama` AS `rsgudangtujuannama`,`c1`.`kkode` AS `rsbagianterimakode`,`c1`.`knama` AS `rsbagianterimanama`,`mr`.`mrnotransaksi` AS `rsmrnotransaksi`,`ts`.`tsnotransaksi` AS `rstsnotransaksi`,`st1`.`nama` AS `rsstatusnama`,`st2`.`nama` AS `rsstatussebelumnyanama`,`u1`.`unama` AS `rsinputusernama`,`u2`.`unama` AS `rsmodifikasiusernama`,`rsd`.`idrsdetail` AS `idrsdetail`,`rsd`.`idrs` AS `idrs`,`rsd`.`idbarang` AS `idbarang`,`rsd`.`namabarang` AS `namabarang`,`rsd`.`tipebarang` AS `tipebarang`,`rsd`.`jml` AS `jml`,`rsd`.`satuan` AS `satuan`,`rsd`.`nilaisatuan` AS `nilaisatuan`,`rsd`.`jmlbarang` AS `jmlbarang`,`rsd`.`satuanbarang` AS `satuanbarang`,`rsd`.`cabang` AS `cabang`,`rsd`.`lokasi` AS `lokasi`,`rsd`.`gudangasal` AS `gudangasal`,`rsd`.`gudangtransit` AS `gudangtransit`,`rsd`.`gudangtujuan` AS `gudangtujuan`,`rsd`.`costcenter` AS `costcenter`,`rsd`.`divisi` AS `divisi`,`rsd`.`subdivisi` AS `subdivisi`,`rsd`.`proyek` AS `proyek`,`rsd`.`catatan` AS `catatan`,`rsd`.`urutan` AS `urutan`,`rsd`.`idmrdetail` AS `idmrdetail`,`rsd`.`idtsdetail` AS `idtsdetail`,`rsd`.`isclose` AS `isclose`,`rsd`.`customtext1` AS `customtext1`,`rsd`.`customtext2` AS `customtext2`,`rsd`.`customtext3` AS `customtext3`,`rsd`.`customdbl1` AS `customdbl1`,`rsd`.`customdbl2` AS `customdbl2`,`rsd`.`customdbl3` AS `customdbl3`,`rsd`.`customdate1` AS `customdate1`,`rsd`.`customdate2` AS `customdate2`,`rsd`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bhpp` AS `bhpp`,`i`.`bhppaverage` AS `bhppaverage`,`i`.`bjenis` AS `bjenis`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,`i`.`basset` AS `basset`,`brd`.`bnama` AS `cabangnama`,`lcd`.`lnama` AS `lokasinama`,`whd1`.`wnama` AS `gudangasalnama`,`whd2`.`wnama` AS `gudangtransitnama`,`whd2`.`wnama` AS `gudangtujuannama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama`,`mr2`.`mrnotransaksi` AS `mrnotransaksi`,`ts2`.`tsnotransaksi` AS `tsnotransaksi`, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan from (((((((((((((((((((((((((((`m3_rs` `rs` join `m3_rs_detail` `rsd` on((`rsd`.`idrs` = `rs`.`rsid`))) left join `m1_branch` `br` on((`br`.`bkode` = `rs`.`rscabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `rs`.`rslokasi`))) left join `m1_warehouse` `wh1` on((`wh1`.`wkode` = `rs`.`rsgudangasal`))) left join `m1_warehouse` `wh2` on((`wh2`.`wkode` = `rs`.`rsgudangtransit`))) left join `m1_warehouse` `wh3` on((`wh3`.`wkode` = `rs`.`rsgudangtujuan`))) left join `m1_contact` `c1` on((`c1`.`kid` = `rs`.`rsbagianterima`))) left join `m3_mr` `mr` on((`mr`.`mrid` = `rs`.`rsidmr`))) left join `m3_ts` `ts` on((`ts`.`tsid` = `rs`.`rsidts`))) left join `m0_status` `st1` on((`st1`.`kode` = `rs`.`rsstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `rs`.`rsstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `rs`.`rsinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `rs`.`rsmodifikasiuser`))) left join `m1_item` `i` on((`i`.`bid` = `rsd`.`idbarang`))) left join `m1_branch` `brd` on((`rsd`.`cabang` = `brd`.`bkode`))) left join `m1_location` `lcd` on((`rsd`.`lokasi` = `lcd`.`lkode`))) left join `m1_warehouse` `whd1` on((`rsd`.`gudangasal` = `whd1`.`wkode`))) left join `m1_warehouse` `whd2` on((`rsd`.`gudangtransit` = `whd2`.`wkode`))) left join `m1_warehouse` `whd3` on((`rsd`.`gudangtujuan` = `whd3`.`wkode`))) left join `m1_cost_center` `cc` on((`rsd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`rsd`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`rsd`.`subdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`rsd`.`proyek` = `p`.`pkode`))) left join `m3_mr_detail` `mrd` on((`rsd`.`idmrdetail` = `mrd`.`idmrdetail`))) left join `m3_mr` `mr2` on((`mrd`.`idmr` = `mr2`.`mrid`))) left join `m3_ts_detail` `tsd` on((`rsd`.`idtsdetail` = `tsd`.`idtsdetail`))) left join `m3_ts` `ts2` on((`tsd`.`idts` = `ts2`.`tsid`)))
```

```sql
SELECT tsd.idtsdetail, (tsd.jmlbarang - tsd.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m3_ts_detail AS tsd INNER JOIN m1_item AS i ON tsd.idbarang = i.bid WHERE
```

## `client-backend/api-myerpplus/app_code/ws/m3/m3_rs_history.vb`

```sql
INSERT INTO m3_rs_history(SELECT 0, rs.* FROM m3_rs rs WHERE rs.rsid = '{idtransaksi}')
```

```sql
SELECT rsidhistory FROM m3_rs_history WHERE rsid = '{idtransaksi}' ORDER BY rsmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m3_rs_detail_history (SELECT 0, '{result_4}', rs.* FROM m3_rs_detail rs WHERE rs.idrs = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m3/m3_rw.vb`

```sql
SELECT rwid, rwcabang, rwlokasi, rwsumber, rwautonotransaksi, rwnotransaksi, rwtgl, rwkodepa, rwuraian, rwcatatan, rwnoref, rwtglnoref, rwstatus, rwstatussebelumnya, rwjmlrevisi, rwcetakanke, rwinputuser, rwinputtgl, rwmodifikasiuser, rwmodifikasitgl, rwposting, rwpostingtgl, rwisclose, st1.nama AS rwstatusnama, st2.nama AS rwstatussebelumnyanama,u1.unama AS rwinputusernama,u2.unama AS rwmodifikasiusernama, i.bnama, rwbruto, rwtara, rwneto FROM m3_rw rw JOIN m1_item i ON i.bid = rw.rwbid left join m0_status st1 on st1.kode = rw.rwstatus left join m0_status st2 on st2.kode = rw.rwstatussebelumnya left join m0_user u1 on u1.userid = rw.rwinputuser left join m0_user u2 on u2.userid = rw.rwmodifikasiuser
```

```sql
SELECT COUNT(rwid) FROM M3_Rw WHERE rwid=
```

```sql
Update M3_Rw set rwcabang = '{FixQuotes_dr1}rwcabang', rwlokasi = '{FixQuotes_dr1}rwlokasi', rwsumber = '{FixQuotes_dr1}rwsumber', rwautonotransaksi = {dr1}rwautonotransaksi, rwnotransaksi = '{FixQuotes_dr1}rwnotransaksi', rwtgl = '{FixQuotes_AsFormatTanggal_dr1}rwtgl', rwkodepa = '{FixQuotes_dr1}rwkodepa', rwnopol = '{FixQuotes_dr1}rwnopol', rwbid = '{FixQuotes_dr1}rwbid', rwkid = '{FixQuotes_dr1}rwkid', rwtglbruto = '{FixQuotes_AsFormatTanggal_dr1}rwtglbrutoyyyy-MM-dd HH:mm:ss', rwbruto = '{FixDouble_dr1}rwbruto', rwtgltara = '{FixQuotes_AsFormatTanggal_dr1}rwtgltarayyyy-MM-dd HH:mm:ss', rwtara = '{FixDouble_dr1}rwtara', rwneto = '{FixDouble_dr1}rwneto', rwharga = '{FixDouble_dr1}rwharga', rwsopir = '{FixQuotes_dr1}rwsopir', rwuraian = '{FixQuotes_dr1}rwuraian', rwcatatan = '{FixQuotes_dr1}rwcatatan', rwnoref = '{FixQuotes_dr1}rwnoref', rwtglnoref = '{FixQuotes_AsFormatTanggal_dr1}rwtglnoref', rwstatus = {dr1}rwstatus, rwstatussebelumnya = {dr1}rwstatussebelumnya, rwjmlrevisi = {dr1}rwjmlrevisi, rwcetakanke = {dr1}rwcetakanke, rwmodifikasiuser = '{FixQuotes_dr1}rwmodifikasiuser', rwmodifikasitgl = NOW(), rwposting = {dr1}rwposting, rwpostingtgl = '{FixQuotes_AsFormatTanggal_dr1}rwpostingtglyyyy-MM-dd HH:mm:ss', rwcustomtext1 = '{FixQuotes_dr1}rwcustomtext1', rwcustomtext2 = '{FixQuotes_dr1}rwcustomtext2', rwcustomtext3 = '{FixQuotes_dr1}rwcustomtext3', rwcustomtext4 = '{FixQuotes_dr1}rwcustomtext4', rwcustomtext5 = '{FixQuotes_dr1}rwcustomtext5', rwcustomint1 = {dr1}rwcustomint1, rwcustomint2 = {dr1}rwcustomint2, rwcustomint3 = {dr1}rwcustomint3, rwcustomdbl1 = '{FixDouble_dr1}rwcustomdbl1', rwcustomdbl2 = '{FixDouble_dr1}rwcustomdbl2', rwcustomdbl3 = '{FixDouble_dr1}rwcustomdbl3', rwcustomdate1 = '{FixQuotes_AsFormatTanggal_dr1}rwcustomdate1', rwcustomdate2 = '{FixQuotes_AsFormatTanggal_dr1}rwcustomdate2', rwcustomdate3 = '{FixQuotes_AsFormatTanggal_dr1}rwcustomdate3' where rwid = {dr1}rwid
```

```sql
SELECT COUNT(rwid) FROM m3_rw WHERE rwnotransaksi='{notransaksi}'
```

```sql
Insert into M3_Rw (rwcabang, rwlokasi, rwsumber, rwautonotransaksi, rwnotransaksi, rwtgl, rwkodepa, rwnopol, rwbid, rwkid, rwtglbruto, rwbruto, rwtgltara, rwtara, rwneto, rwharga, rwsopir, rwuraian, rwcatatan, rwnoref, rwtglnoref, rwstatus, rwstatussebelumnya, rwjmlrevisi, rwcetakanke, rwinputuser, rwinputtgl, rwmodifikasiuser, rwmodifikasitgl, rwposting, rwpostingtgl, rwisclose, rwcustomtext1, rwcustomtext2, rwcustomtext3, rwcustomtext4, rwcustomtext5, rwcustomint1, rwcustomint2, rwcustomint3, rwcustomdbl1, rwcustomdbl2, rwcustomdbl3, rwcustomdate1, rwcustomdate2, rwcustomdate3) values('{FixQuotes_dr1}rwcabang', '{FixQuotes_dr1}rwlokasi', '{FixQuotes_dr1}rwsumber', {dr1}rwautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_dr1}rwtgl', '{FixQuotes_dr1}rwkodepa', '{FixQuotes_dr1}rwnopol', '{FixQuotes_dr1}rwbid', '{FixQuotes_dr1}rwkid', '{FixQuotes_AsFormatTanggal_dr1}rwtglbrutoyyyy-MM-dd HH:mm:ss', '{FixDouble_dr1}rwbruto', '{FixQuotes_AsFormatTanggal_dr1}rwtgltarayyyy-MM-dd HH:mm:ss', '{FixDouble_dr1}rwtara', '{FixDouble_dr1}rwbruto{FixDouble_dr1}rwtara', '{FixDouble_dr1}rwharga', '{FixQuotes_dr1}rwsopir', '{FixQuotes_dr1}rwuraian', '{FixQuotes_dr1}rwcatatan', '{FixQuotes_dr1}rwnoref', '{FixQuotes_AsFormatTanggal_dr1}rwtglnoref', {dr1}rwstatus, {dr1}rwstatussebelumnya, {dr1}rwjmlrevisi, {dr1}rwcetakanke, '{FixQuotes_dr1}rwinputuser', NOW(), '{FixQuotes_dr1}rwmodifikasiuser', '{FixQuotes_AsFormatTanggal_dr1}rwmodifikasitglyyyy-MM-dd HH:mm:ss', {dr1}rwposting, '{FixQuotes_AsFormatTanggal_dr1}rwpostingtglyyyy-MM-dd HH:mm:ss', {dr1}rwisclose, '{FixQuotes_dr1}rwcustomtext1', '{FixQuotes_dr1}rwcustomtext2', '{FixQuotes_dr1}rwcustomtext3', '{FixQuotes_dr1}rwcustomtext4', '{FixQuotes_dr1}rwcustomtext5', {dr1}rwcustomint1, {dr1}rwcustomint2, {dr1}rwcustomint3, '{FixDouble_dr1}rwcustomdbl1', '{FixDouble_dr1}rwcustomdbl2', '{FixDouble_dr1}rwcustomdbl3', '{FixQuotes_AsFormatTanggal_dr1}rwcustomdate1', '{FixQuotes_AsFormatTanggal_dr1}rwcustomdate2', '{FixQuotes_AsFormatTanggal_dr1}rwcustomdate3')
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT rwtgl, rwnotransaksi, rwstatus FROM m3_rw WHERE rwid='{idtransaksi}'
```

```sql
UPDATE m3_Rw SET Rwstatus = {nilaiStatus}, Rwmodifikasiuser='{userid}', Rwmodifikasitgl = NOW(), Rwposting = 0, Rwpostingtgl = '1971-01-01 00:00:00', Rwjmlrevisi = Rwjmlrevisi + 1 WHERE Rwid = '{idtransaksi}'
```

```sql
DELETE FROM M3_Rw WHERE rwid =
```

```sql
SELECT um.unama rwmodifikasiusernama, u.unama rwinputusernama, sb.nama rwstatussebelumnyanama, s.nama rwstatusnama, l.lnama rwlokasinama, b.bnama rwcabangnama, cs.kkode rwkodesopir, cs.knama rwnamasopir, i.bkode rwkodebarang, i.bnama rwnamabarang, rwid, rwcabang, rwlokasi, rwsumber, rwautonotransaksi, rwnotransaksi, rwtgl, rwkodepa, rwnopol, rwbid, rwkid, rwtglbruto, rwbruto, rwtgltara, rwtara, rwneto, rwharga, rwsopir, rwuraian, rwcatatan, rwnoref, rwtglnoref, rwstatus, rwstatussebelumnya, rwjmlrevisi, rwcetakanke, rwinputuser, rwinputtgl, rwmodifikasiuser, rwmodifikasitgl, rwposting, rwpostingtgl, rwisclose, rwcustomtext1, rwcustomtext2, rwcustomtext3, rwcustomtext4, rwcustomtext5, rwcustomint1, rwcustomint2, rwcustomint3, rwcustomdbl1, rwcustomdbl2, rwcustomdbl3, rwcustomdate1, rwcustomdate2, rwcustomdate3 FROM M3_Rw rw JOIN m1_item i ON i.bid = rw.rwbid JOIN m1_contact cs ON cs.kid = rw.rwkid JOIN m1_branch b ON b.bkode = rw.rwcabang JOIN m1_location l ON l.lkode = rw.rwlokasi JOIN m0_status s ON s.kode = rw.rwstatus JOIN m0_status sb ON sb.kode = rw.rwstatussebelumnya LEFT JOIN m0_user u ON u.userid = rw.rwinputuser LEFT JOIN m0_user um ON um.userid = rw.rwmodifikasiuser
```

## `client-backend/api-myerpplus/app_code/ws/m3/m3_sa.vb`

```sql
SELECT said, sanotransaksi FROM m3_sa WHERE sanoref = '{FixQuotes_Filter}'
```

```sql
SELECT EXISTS(SELECT 1 FROM m3_sp_detail JOIN m3_sp ON idsp = spid WHERE idspdetail = '{idspdetail}' AND (spstatus = 2 OR spstatus = 3 OR spstatus = 4 OR spstatus = 7) LIMIT 1) as rowExists, '{idspdetail}' as idspdetail, bkode FROM m1_item WHERE bid = '{idbarang}'
```

```sql
SELECT EXISTS(SELECT 1 FROM m3_sp_detail JOIN m3_sp ON idsp = spid WHERE idspdetail = '{idspdetail}' AND (spstatus = 2 OR spstatus = 3) LIMIT 1) as rowExists, '{idspdetail}' as idspdetail, bkode FROM m1_item WHERE bid = '{idbarang}'
```

```sql
SELECT COUNT(said), sanotransaksi FROM M3_sa WHERE said='{result_4}' AND sastatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(said) FROM m3_sa WHERE sanotransaksi='{notransaksi}'
```

```sql
Update M3_Sa set sacabang = '{FixQuotes_drutama}sacabang', salokasi = '{FixQuotes_drutama}salokasi', sagudang = '{FixQuotes_drutama}sagudang', sasumber = '{FixQuotes_drutama}sasumber', sajenis = '{FixQuotes_drutama}sajenis', saautonotransaksi = {drutama}saautonotransaksi, sanotransaksi = '{notransaksi}', satgl = '{FixQuotes_AsFormatTanggal_drutama}satgl', sakodepa = {drutama}sakodepa, sabagiansa = {drutama}sabagiansa, sabagiansakontak = '{FixQuotes_drutama}sabagiansakontak', sauraian = '{FixQuotes_drutama}sauraian', sacatatan = '{FixQuotes_drutama}sacatatan', sanoref = '{FixQuotes_drutama}sanoref', satglnoref = '{FixQuotes_AsFormatTanggal_drutama}satglnoref', saidsp = {drutama}saidsp, sastatus = {drutama}sastatus, sastatussebelumnya = {drutama}sastatussebelumnya, sajmlrevisi = sajmlrevisi+1, sacetakanke = {drutama}sacetakanke, samodifikasiuser = {drutama}samodifikasiuser, samodifikasitgl = NOW(), saposting = 0, satutupperiode = {drutama}satutupperiode, sacustomtext1 = '{FixQuotes_drutama}sacustomtext1', sacustomtext2 = '{FixQuotes_drutama}sacustomtext2', sacustomtext3 = '{FixQuotes_drutama}sacustomtext3', sacustomtext4 = '{FixQuotes_drutama}sacustomtext4', sacustomtext5 = '{FixQuotes_drutama}sacustomtext5', sacustomint1 = {drutama}sacustomint1, sacustomint2 = {drutama}sacustomint2, sacustomint3 = {drutama}sacustomint3, sacustomdbl1 = '{FixDouble_drutama}sacustomdbl1', sacustomdbl2 = '{FixDouble_drutama}sacustomdbl2', sacustomdbl3 = '{FixDouble_drutama}sacustomdbl3', sacustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}sacustomdate1', sacustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}sacustomdate2', sacustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}sacustomdate3' where said = '{drutama}said'
```

```sql
Insert into M3_Sa (sacabang, salokasi, sagudang, sasumber, sajenis, saautonotransaksi, sanotransaksi, satgl, sakodepa, sabagiansa, sabagiansakontak, sauraian, sacatatan, sanoref, satglnoref, saidsp, sastatus, sastatussebelumnya, sajmlrevisi, sacetakanke, sainputuser, sainputtgl, samodifikasiuser, samodifikasitgl, saposting, satutupperiode, saisclose, sacustomtext1, sacustomtext2, sacustomtext3, sacustomtext4, sacustomtext5, sacustomint1, sacustomint2, sacustomint3, sacustomdbl1, sacustomdbl2, sacustomdbl3, sacustomdate1, sacustomdate2, sacustomdate3) values('{FixQuotes_drutama}sacabang', '{FixQuotes_drutama}salokasi', '{FixQuotes_drutama}sagudang', '{FixQuotes_drutama}sasumber', '{FixQuotes_drutama}sajenis', {drutama}saautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}satgl', {drutama}sakodepa, {drutama}sabagiansa, '{FixQuotes_drutama}sabagiansakontak', '{FixQuotes_drutama}sauraian', '{FixQuotes_drutama}sacatatan', '{FixQuotes_drutama}sanoref', '{FixQuotes_AsFormatTanggal_drutama}satglnoref', {drutama}saidsp, {drutama}sastatus, {drutama}sastatussebelumnya, {drutama}sajmlrevisi, {drutama}sacetakanke, {drutama}sainputuser, NOW(), {drutama}samodifikasiuser, '1971-01-01 00:00:00', 0, {drutama}satutupperiode, {drutama}saisclose, '{FixQuotes_drutama}sacustomtext1', '{FixQuotes_drutama}sacustomtext2', '{FixQuotes_drutama}sacustomtext3', '{FixQuotes_drutama}sacustomtext4', '{FixQuotes_drutama}sacustomtext5', {drutama}sacustomint1, {drutama}sacustomint2, {drutama}sacustomint3, '{FixDouble_drutama}sacustomdbl1', '{FixDouble_drutama}sacustomdbl2', '{FixDouble_drutama}sacustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}sacustomdate1', '{FixQuotes_AsFormatTanggal_drutama}sacustomdate2', '{FixQuotes_AsFormatTanggal_drutama}sacustomdate3')
```

```sql
select said from M3_sa where sanotransaksi='{notransaksi}' AND sainputuser= '{userid}' order by samodifikasitgl desc limit 1
```

```sql
Delete from M3_Sa_Detail where idsa = '{result_4}'
```

```sql
Insert into M3_Sa_Detail(idsadetail, idsa, idbarang, namabarang, tipebarang, jmlmasuk, jmlkeluar, satuan, nilaisatuan, jmlbarangmasuk, jmlbarangkeluar, satuanbarang, idhppkhususmasuk, hpplama, hpp, rekpersediaan, reklawan, idspdetail, cabang, lokasi, gudang, costcenter, divisi, subdivisi, proyek, catatan, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
UPDATE m3_sp_detail SET jmlsa = (CASE idspdetail {updNilai} ELSE jmlsa END) WHERE
```

```sql
SELECT idsp, SUM(ABS(selisihbarang)) as selisihbarang, SUM(jmlsa) as jmlsa FROM m3_sp_detail WHERE {updFilter} GROUP BY idsp
```

```sql
UPDATE m3_sp SET spstatussa = (CASE spid {updNilai} ELSE spstatussa END) WHERE
```

```sql
SELECT sad.idsadetail, sad.idbarang, sad.namabarang, sad.tipebarang, (CASE j.jenismutasi WHEN 1 THEN isw.stok / sad.nilaisatuan ELSE 0 END) as jmlmasuk, (CASE j.jenismutasi WHEN 0 THEN isw.stok / sad.nilaisatuan ELSE 0 END) as jmlkeluar, sad.satuan, sad.nilaisatuan, (CASE j.jenismutasi WHEN 1 THEN isw.stok ELSE 0 END) as jmlbarangmasuk, (CASE j.jenismutasi WHEN 0 THEN isw.stok ELSE 0 END) as jmlbarangkeluar, sad.satuanbarang, sad.hpp, sad.idhppkhususmasuk, isw.kgudang as gudang, sad.catatan, sad.costcenter, sad.divisi, sad.subdivisi, sad.customdbl1, sad.proyek, sa.sainputtgl, i.bhpp FROM m3_sa_detail sad JOIN m3_sa sa ON sad.idsa = sa.said JOIN m1_item i ON sad.idbarang = i.bid JOIN m0_jenismutasi j JOIN m1_item_stock_warehouse isw ON sad.idbarang = isw.idbarang AND isw.stok <> 0 WHERE sad.idsa = '{result_4}' ORDER BY sad.urutan, j.jenismutasi, isw.kgudang, sad.idsadetail
```

```sql
SELECT sad.idsadetail, sad.idbarang, sad.namabarang, sad.tipebarang, sad.jmlmasuk, sad.jmlkeluar, sad.satuan, sad.jmlbarangmasuk, sad.jmlbarangkeluar, sad.satuanbarang, sad.hpp, sad.idhppkhususmasuk, sad.gudang, sad.catatan, sad.costcenter, sad.divisi, sad.subdivisi, sad.customdbl1, sad.proyek, sa.sainputtgl, i.bhpp FROM m3_sa_detail sad JOIN m3_sa sa ON sad.idsa = sa.said JOIN m1_item i ON sad.idbarang = i.bid WHERE sad.idsa = '{result_4}'
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Satgl, Sanotransaksi, Sastatus FROM m3_Sa WHERE Said='{idtransaksi}'
```

```sql
SELECT idsadetail, idbarang, jmlbarangmasuk, jmlbarangkeluar, idhppkhususmasuk, gudang, idspdetail FROM m3_sa_detail WHERE idsa = '{idtransaksi}'
```

```sql
SELECT idsadetail, idbarang, jmlbarangmasuk, jmlbarangkeluar, idhppkhususmasuk, gudang, idspdetail, tipebarang, namabarang, urutan, satuan, nilaisatuan, customdbl2 FROM m3_sa_detail WHERE idsa = '{idtransaksi}'
```

```sql
UPDATE M3_Sa SET Sastatus = {nilaiStatus}, Samodifikasiuser='{userid}', Samodifikasitgl = NOW(), Saposting = 0, Sapostingtgl = '1971-01-01 00:00:00', Sajmlrevisi = Sajmlrevisi + 1 WHERE Said = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Said, Sanotransaksi FROM M3_Sa WHERE Said='{idtransaksi}'
```

```sql
DELETE FROM M3_Sa_Detail WHERE idsa = '{idtransaksi}'
```

```sql
DELETE FROM M3_Sa WHERE said = '{idtransaksi}'
```

```sql
SELECT spd.idspdetail, (ABS(spd.selisihbarang) - spd.jmlsa) as sisasa, i.bid, i.bkode FROM m3_sp_detail AS spd INNER JOIN m1_item AS i ON spd.idbarang = i.bid WHERE
```

## `client-backend/api-myerpplus/app_code/ws/m3/m3_sa_history.vb`

```sql
INSERT INTO m3_sa_history(SELECT 0, sa.* FROM m3_sa sa WHERE sa.said = '{idtransaksi}')
```

```sql
SELECT saidhistory FROM m3_sa_history WHERE said = '{idtransaksi}' ORDER BY samodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m3_sa_detail_history (SELECT 0, '{result_4}', sa.* FROM m3_sa_detail sa WHERE sa.idsa = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m3/m3_sp.vb`

```sql
SELECT spid, spnotransaksi FROM m3_sp WHERE spnoref = '{FixQuotes_Filter}'
```

```sql
SELECT COUNT(spid), spnotransaksi FROM M3_Sp WHERE spid='{result_4}' AND spstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(spid) FROM m3_sp WHERE spnotransaksi='{notransaksi}'
```

```sql
Update M3_Sp set spcabang = '{FixQuotes_drutama}spcabang', splokasi = '{FixQuotes_drutama}splokasi', spgudang = '{FixQuotes_drutama}spgudang', spsumber = '{FixQuotes_drutama}spsumber', spautonotransaksi = {drutama}spautonotransaksi, spnotransaksi = '{notransaksi}', sptgl = '{FixQuotes_AsFormatTanggal_drutama}sptgl', spkodepa = {drutama}spkodepa, spbagiansp = {drutama}spbagiansp, spbagianspkontak = '{FixQuotes_drutama}spbagianspkontak', spuraian = '{FixQuotes_drutama}spuraian', spcatatan = '{FixQuotes_drutama}spcatatan', spnoref = '{FixQuotes_drutama}spnoref', sptglnoref = '{FixQuotes_AsFormatTanggal_drutama}sptglnoref', spstatussa = {drutama}spstatussa, spstatus = {drutama}spstatus, spstatussebelumnya = {drutama}spstatussebelumnya, spjmlrevisi = spjmlrevisi+1, spcetakanke = {drutama}spcetakanke, spmodifikasiuser = {drutama}spmodifikasiuser, spmodifikasitgl = NOW(), spposting = 0, sptutupperiode = {drutama}sptutupperiode, spcustomtext1 = '{FixQuotes_drutama}spcustomtext1', spcustomtext2 = '{FixQuotes_drutama}spcustomtext2', spcustomtext3 = '{FixQuotes_drutama}spcustomtext3', spcustomtext4 = '{FixQuotes_drutama}spcustomtext4', spcustomtext5 = '{FixQuotes_drutama}spcustomtext5', spcustomint1 = {drutama}spcustomint1, spcustomint2 = {drutama}spcustomint2, spcustomint3 = {drutama}spcustomint3, spcustomdbl1 = '{FixDouble_drutama}spcustomdbl1', spcustomdbl2 = '{FixDouble_drutama}spcustomdbl2', spcustomdbl3 = '{FixDouble_drutama}spcustomdbl3', spcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}spcustomdate1', spcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}spcustomdate2', spcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}spcustomdate3', spstepke = '{drutama}spstepke' where spid = '{drutama}spid'
```

```sql
Insert into M3_Sp (spcabang, splokasi, spgudang, spsumber, spautonotransaksi, spnotransaksi, sptgl, spkodepa, spbagiansp, spbagianspkontak, spuraian, spcatatan, spnoref, sptglnoref, spstatussa, spstatus, spstatussebelumnya, spjmlrevisi, spcetakanke, spinputuser, spinputtgl, spmodifikasiuser, spmodifikasitgl, spposting, sptutupperiode, spisclose, spcustomtext1, spcustomtext2, spcustomtext3, spcustomtext4, spcustomtext5, spcustomint1, spcustomint2, spcustomint3, spcustomdbl1, spcustomdbl2, spcustomdbl3, spcustomdate1, spcustomdate2, spcustomdate3, spstepke) values('{FixQuotes_drutama}spcabang', '{FixQuotes_drutama}splokasi', '{FixQuotes_drutama}spgudang', '{FixQuotes_drutama}spsumber', {drutama}spautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}sptgl', {drutama}spkodepa, {drutama}spbagiansp, '{FixQuotes_drutama}spbagianspkontak', '{FixQuotes_drutama}spuraian', '{FixQuotes_drutama}spcatatan', '{FixQuotes_drutama}spnoref', '{FixQuotes_AsFormatTanggal_drutama}sptglnoref', {drutama}spstatussa, {drutama}spstatus, {drutama}spstatussebelumnya, {drutama}spjmlrevisi, {drutama}spcetakanke, {drutama}spinputuser, NOW(), {drutama}spmodifikasiuser, '1971-01-01 00:00:00', 0, {drutama}sptutupperiode, {drutama}spisclose, '{FixQuotes_drutama}spcustomtext1', '{FixQuotes_drutama}spcustomtext2', '{FixQuotes_drutama}spcustomtext3', '{FixQuotes_drutama}spcustomtext4', '{FixQuotes_drutama}spcustomtext5', {drutama}spcustomint1, {drutama}spcustomint2, {drutama}spcustomint3, '{FixDouble_drutama}spcustomdbl1', '{FixDouble_drutama}spcustomdbl2', '{FixDouble_drutama}spcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}spcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}spcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}spcustomdate3', '{drutama}spstepke')
```

```sql
select spid from M3_Sp where spnotransaksi='{notransaksi}' AND spinputuser= '{userid}' order by spmodifikasitgl desc limit 1
```

```sql
Delete from M3_Sp_Detail where idsp = '{result_4}'
```

```sql
Insert into M3_Sp_Detail(idspdetail, idsp, idbarang, namabarang, tipebarang, jmlsistem, jmlfisik, jmlbagus, jmlrusak, selisih, satuan, nilaisatuan, jmlbarangsistem, jmlbarangfisik, jmlbarangbagus, jmlbarangrusak, selisihbarang, satuanbarang, cabang, lokasi, gudang, lokasibarang, jmlsa, statussa, costcenter, divisi, subdivisi, proyek, catatan, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
DELETE spd, sp FROM m3_sp_detail_progress spd JOIN m3_sp_progress sp ON spd.idprogress = sp.spidprogress WHERE sp.spid = '{FixQuotes_result_4}' AND sp.spstepke = '{FixQuotes_drutama}spstepke'
```

```sql
INSERT INTO m3_sp_progress(SELECT 0, sp.* FROM m3_sp sp WHERE sp.spid = '{FixQuotes_result_4}')
```

```sql
SELECT spidprogress FROM m3_sp_progress WHERE spid = '{FixQuotes_result_4}' ORDER BY spmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m3_sp_detail_progress (SELECT 0, '{idProgress}', sp.* FROM m3_sp_detail sp WHERE sp.idsp = '{FixQuotes_result_4}' )
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Sptgl, Spnotransaksi, Spstatus FROM m3_Sp WHERE Spid='{idtransaksi}'
```

```sql
UPDATE M3_Sp SET Spstatus = {nilaiStatus}, Spmodifikasiuser='{userid}', Spmodifikasitgl = NOW(), Spposting = 0, Sppostingtgl = '1971-01-01 00:00:00', Spjmlrevisi = Spjmlrevisi + 1 WHERE Spid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Spid, Spnotransaksi FROM M3_Sp WHERE Spid='{idtransaksi}'
```

```sql
DELETE FROM M3_Sp_Detail WHERE idsp = '{idtransaksi}'
```

```sql
DELETE FROM M3_Sp WHERE spid = '{idtransaksi}'
```

```sql
select `sp`.`spid` AS `spid`,`sp`.`spcabang` AS `spcabang`,`sp`.`splokasi` AS `splokasi`,`sp`.`spgudang` AS `spgudang`,`sp`.`spsumber` AS `spsumber`,`sp`.`spautonotransaksi` AS `spautonotransaksi`,`sp`.`spnotransaksi` AS `spnotransaksi`,`sp`.`sptgl` AS `sptgl`,`sp`.`spkodepa` AS `spkodepa`,`sp`.`spbagiansp` AS `spbagiansp`,`sp`.`spbagianspkontak` AS `spbagianspkontak`,`sp`.`spuraian` AS `spuraian`,`sp`.`spcatatan` AS `spcatatan`,`sp`.`spnoref` AS `spnoref`,`sp`.`sptglnoref` AS `sptglnoref`,`sp`.`spstatussa` AS `spstatussa`,`sp`.`spstatus` AS `spstatus`,`sp`.`spstatussebelumnya` AS `spstatussebelumnya`,`sp`.`spjmlrevisi` AS `spjmlrevisi`,`sp`.`spcetakanke` AS `spcetakanke`,`sp`.`spinputuser` AS `spinputuser`,`sp`.`spinputtgl` AS `spinputtgl`,`sp`.`spmodifikasiuser` AS `spmodifikasiuser`,`sp`.`spmodifikasitgl` AS `spmodifikasitgl`,`sp`.`spposting` AS `spposting`,`sp`.`sppostingtgl` AS `sppostingtgl`,`sp`.`sptutupperiode` AS `sptutupperiode`,`sp`.`spisclose` AS `spisclose`,`sp`.`spcustomtext1` AS `spcustomtext1`,`sp`.`spcustomtext2` AS `spcustomtext2`,`sp`.`spcustomtext3` AS `spcustomtext3`,`sp`.`spcustomtext4` AS `spcustomtext4`,`sp`.`spcustomtext5` AS `spcustomtext5`,`sp`.`spcustomint1` AS `spcustomint1`,`sp`.`spcustomint2` AS `spcustomint2`,`sp`.`spcustomint3` AS `spcustomint3`,`sp`.`spcustomdbl1` AS `spcustomdbl1`,`sp`.`spcustomdbl2` AS `spcustomdbl2`,`sp`.`spcustomdbl3` AS `spcustomdbl3`,`sp`.`spcustomdate1` AS `spcustomdate1`,`sp`.`spcustomdate2` AS `spcustomdate2`,`sp`.`spcustomdate3` AS `spcustomdate3`,`br`.`bnama` AS `spcabangnama`,`lc`.`lnama` AS `splokasinama`,`wh`.`wnama` AS `spgudangnama`,`c1`.`kkode` AS `spbagianspkode`,`c1`.`knama` AS `spbagianspnama`,`st1`.`nama` AS `spstatusnama`,`st2`.`nama` AS `spstatussebelumnyanama`,`u1`.`unama` AS `spinputusernama`,`u2`.`unama` AS `spmodifikasiusernama`,`spd`.`idspdetail` AS `idspdetail`,`spd`.`idsp` AS `idsp`,`spd`.`idbarang` AS `idbarang`,`spd`.`namabarang` AS `namabarang`,`spd`.`tipebarang` AS `tipebarang`,`spd`.`jmlsistem` AS `jmlsistem`,`spd`.`jmlfisik` AS `jmlfisik`,`spd`.`jmlbagus` AS `jmlbagus`,`spd`.`jmlrusak` AS `jmlrusak`,`spd`.`selisih` AS `selisih`,`spd`.`satuan` AS `satuan`,`spd`.`nilaisatuan` AS `nilaisatuan`,`spd`.`jmlbarangsistem` AS `jmlbarangsistem`,`spd`.`jmlbarangfisik` AS `jmlbarangfisik`,`spd`.`jmlbarangbagus` AS `jmlbarangbagus`,`spd`.`jmlbarangrusak` AS `jmlbarangrusak`,`spd`.`selisihbarang` AS `selisihbarang`,`spd`.`satuanbarang` AS `satuanbarang`,`spd`.`cabang` AS `cabang`,`spd`.`lokasi` AS `lokasi`,`spd`.`gudang` AS `gudang`,`spd`.`lokasibarang` AS `lokasibarang`,`spd`.`jmlsa` AS `jmlsa`,`spd`.`statussa` AS `statussa`,`spd`.`costcenter` AS `costcenter`,`spd`.`divisi` AS `divisi`,`spd`.`subdivisi` AS `subdivisi`,`spd`.`proyek` AS `proyek`,`spd`.`catatan` AS `catatan`,`spd`.`urutan` AS `urutan`,`spd`.`isclose` AS `isclose`,`spd`.`customtext1` AS `customtext1`,`spd`.`customtext2` AS `customtext2`,`spd`.`customtext3` AS `customtext3`,`spd`.`customdbl1` AS `customdbl1`,`spd`.`customdbl2` AS `customdbl2`,`spd`.`customdbl3` AS `customdbl3`,`spd`.`customdate1` AS `customdate1`,`spd`.`customdate2` AS `customdate2`,`spd`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`brd`.`bnama` AS `cabangnama`,`lcd`.`lnama` AS `lokasinama`,`whd`.`wnama` AS `gudangnama`,`il`.`ilnama` AS `lokasibarangnama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama`, sp.spstepke from ((((((((((((((((((`m3_sp` `sp` join `m3_sp_detail` `spd` on((`sp`.`spid` = `spd`.`idsp`))) left join `m1_branch` `br` on((`br`.`bkode` = `sp`.`spcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `sp`.`splokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `sp`.`spgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `sp`.`spbagiansp`))) left join `m0_status` `st1` on((`st1`.`kode` = `sp`.`spstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `sp`.`spstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `sp`.`spinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `sp`.`spmodifikasiuser`))) left join `m1_item` `i` on((`i`.`bid` = `spd`.`idbarang`))) left join `m1_branch` `brd` on((`spd`.`cabang` = `brd`.`bkode`))) left join `m1_location` `lcd` on((`spd`.`lokasi` = `lcd`.`lkode`))) left join `m1_warehouse` `whd` on((`spd`.`gudang` = `whd`.`wkode`))) left join `m1_item_location` `il` on((`spd`.`lokasibarang` = `il`.`ilkode` AND spd.gudang = il.ilgudang))) left join `m1_cost_center` `cc` on((`spd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`spd`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`spd`.`subdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`spd`.`proyek` = `p`.`pkode`)))
```

```sql
select `sp`.`spid` AS `spid`,`sp`.`spcabang` AS `spcabang`,`sp`.`splokasi` AS `splokasi`,`sp`.`spgudang` AS `spgudang`,`sp`.`spsumber` AS `spsumber`,`sp`.`spautonotransaksi` AS `spautonotransaksi`,`sp`.`spnotransaksi` AS `spnotransaksi`,`sp`.`sptgl` AS `sptgl`,`sp`.`spkodepa` AS `spkodepa`,`sp`.`spbagiansp` AS `spbagiansp`,`sp`.`spbagianspkontak` AS `spbagianspkontak`,`sp`.`spuraian` AS `spuraian`,`sp`.`spcatatan` AS `spcatatan`,`sp`.`spnoref` AS `spnoref`,`sp`.`sptglnoref` AS `sptglnoref`,`sp`.`spstatussa` AS `spstatussa`,`sp`.`spstatus` AS `spstatus`,`sp`.`spstatussebelumnya` AS `spstatussebelumnya`,`sp`.`spjmlrevisi` AS `spjmlrevisi`,`sp`.`spcetakanke` AS `spcetakanke`,`sp`.`spinputuser` AS `spinputuser`,`sp`.`spinputtgl` AS `spinputtgl`,`sp`.`spmodifikasiuser` AS `spmodifikasiuser`,`sp`.`spmodifikasitgl` AS `spmodifikasitgl`,`sp`.`spposting` AS `spposting`,`sp`.`sppostingtgl` AS `sppostingtgl`,`sp`.`sptutupperiode` AS `sptutupperiode`,`sp`.`spisclose` AS `spisclose`,`br`.`bnama` AS `spcabangnama`,`lc`.`lnama` AS `splokasinama`,`wh`.`wnama` AS `spgudangnama`,`c1`.`kkode` AS `spbagianspkode`,`c1`.`knama` AS `spbagianspnama`,`st1`.`nama` AS `spstatusnama`,`st2`.`nama` AS `spstatussebelumnyanama`,`u1`.`unama` AS `spinputusernama`,`u2`.`unama` AS `spmodifikasiusernama`, sp.spstepke from ((((((((`m3_sp` `sp` left join `m1_branch` `br` on((`br`.`bkode` = `sp`.`spcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `sp`.`splokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `sp`.`spgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `sp`.`spbagiansp`))) left join `m0_status` `st1` on((`st1`.`kode` = `sp`.`spstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `sp`.`spstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `sp`.`spinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `sp`.`spmodifikasiuser`)))
```

```sql
select `spd`.`idspdetail` AS `idspdetail`,`spd`.`idsp` AS `idsp`,`spd`.`idbarang` AS `idbarang`,`spd`.`namabarang` AS `namabarang`,`spd`.`tipebarang` AS `tipebarang`,`spd`.`jmlsistem` AS `jmlsistem`,`spd`.`jmlfisik` AS `jmlfisik`,`spd`.`jmlbagus` AS `jmlbagus`,`spd`.`jmlrusak` AS `jmlrusak`,`spd`.`selisih` AS `selisih`,`spd`.`satuan` AS `satuan`,`spd`.`nilaisatuan` AS `nilaisatuan`,`spd`.`jmlbarangsistem` AS `jmlbarangsistem`,`spd`.`jmlbarangfisik` AS `jmlbarangfisik`,`spd`.`jmlbarangbagus` AS `jmlbarangbagus`,`spd`.`jmlbarangrusak` AS `jmlbarangrusak`,`spd`.`selisihbarang` AS `selisihbarang`,`spd`.`satuanbarang` AS `satuanbarang`,`spd`.`cabang` AS `cabang`,`spd`.`lokasi` AS `lokasi`,`spd`.`gudang` AS `gudang`,`spd`.`lokasibarang` AS `lokasibarang`,`spd`.`jmlsa` AS `jmlsa`,`spd`.`statussa` AS `statussa`,`spd`.`costcenter` AS `costcenter`,`spd`.`divisi` AS `divisi`,`spd`.`subdivisi` AS `subdivisi`,`spd`.`proyek` AS `proyek`,`spd`.`catatan` AS `catatan`,`spd`.`urutan` AS `urutan`,`spd`.`isclose` AS `isclose`,`spd`.`customtext1` AS `customtext1`,`spd`.`customtext2` AS `customtext2`,`spd`.`customtext3` AS `customtext3`,`spd`.`customdbl1` AS `customdbl1`,`spd`.`customdbl2` AS `customdbl2`,`spd`.`customdbl3` AS `customdbl3`,`spd`.`customdate1` AS `customdate1`,`spd`.`customdate2` AS `customdate2`,`spd`.`customdate3` AS `customdate3`,`sp`.`spnotransaksi` AS `spnotransaksi`,`i`.`bkode` AS `kodebarang`,`i`.`bhpp` AS `bhpp`,`i`.`bhppaverage` AS `bhppaverage`,`i`.`bjenis` AS `bjenis`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,`i`.`brekpersediaan` AS `brekpersediaan`,if((`spd`.`selisihbarang` < 0),0,1) AS `jenisselisih`,abs(((`spd`.`selisihbarang` - `spd`.`jmlsa`) / `spd`.`nilaisatuan`)) AS `selisihsisasa` from ((`m3_sp_detail` `spd` left join `m3_sp` `sp` on((`spd`.`idsp` = `sp`.`spid`))) left join `m1_item` `i` on((`spd`.`idbarang` = `i`.`bid`)))
```

```sql
select spd.idspdetail AS idspdetail, spd.idsp AS idsp, spd.idbarang AS idbarang, spd.namabarang AS namabarang, spd.tipebarang AS tipebarang, spd.jmlsistem AS jmlsistem, spd.jmlfisik AS jmlfisik, spd.jmlbagus AS jmlbagus, spd.jmlrusak AS jmlrusak, SUM((CASE LENGTH(IFNULL(si.siid,'')) WHEN 0 THEN 0 ELSE sid.jmlbarang END)) / spd.nilaisatuan as jmljual, (spd.jmlbarangsistem - SUM((CASE LENGTH(IFNULL(si.siid,'')) WHEN 0 THEN 0 ELSE sid.jmlbarang END)) - spd.jmlbarangfisik) / spd.nilaisatuan AS selisih, spd.satuan AS satuan, spd.nilaisatuan AS nilaisatuan, spd.jmlbarangsistem AS jmlbarangsistem, spd.jmlbarangfisik AS jmlbarangfisik, spd.jmlbarangbagus AS jmlbarangbagus, spd.jmlbarangrusak AS jmlbarangrusak, SUM((CASE LENGTH(IFNULL(si.siid,'')) WHEN 0 THEN 0 ELSE sid.jmlbarang END))as jmlbarangjual, (spd.jmlbarangsistem - SUM((CASE LENGTH(IFNULL(si.siid,'')) WHEN 0 THEN 0 ELSE sid.jmlbarang END)) - spd.jmlbarangfisik) AS selisihbarang, spd.satuanbarang AS satuanbarang, spd.cabang AS cabang, spd.lokasi AS lokasi, spd.gudang AS gudang, spd.lokasibarang AS lokasibarang, spd.jmlsa AS jmlsa, spd.statussa AS statussa, spd.costcenter AS costcenter, spd.divisi AS divisi, spd.subdivisi AS subdivisi, spd.proyek AS proyek, spd.catatan AS catatan, spd.urutan AS urutan, spd.isclose AS isclose, spd.customtext1 AS customtext1, spd.customtext2 AS customtext2, spd.customtext3 AS customtext3, spd.customdbl1 AS customdbl1, spd.customdbl2 AS customdbl2, spd.customdbl3 AS customdbl3, spd.customdate1 AS customdate1, spd.customdate2 AS customdate2, spd.customdate3 AS customdate3, sp.spnotransaksi AS spnotransaksi, i.bkode AS kodebarang, i.bhpp AS bhpp, i.bhppaverage AS bhppaverage, i.bjenis AS bjenis, i.bserial AS bserial, i.bbatch AS bbatch, i.brekpersediaan AS brekpersediaan, IF(((spd.jmlbarangsistem - SUM((CASE LENGTH(IFNULL(si.siid,'')) WHEN 0 THEN 0 ELSE sid.jmlbarang END)) - spd.jmlbarangfisik) < 0), 0, 1) AS jenisselisih, ABS((((spd.jmlbarangsistem - SUM((CASE LENGTH(IFNULL(si.siid,'')) WHEN 0 THEN 0 ELSE sid.jmlbarang END)) - spd.jmlbarangfisik) - spd.jmlsa) / spd.nilaisatuan)) AS selisihsisasa FROM m3_sp_detail spd JOIN m3_sp sp ON spd.idsp = sp.spid JOIN m1_item i ON spd.idbarang = i.bid LEFT JOIN m5_si_detail sid ON spd.idbarang = sid.idbarang LEFT JOIN m5_si si ON sid.idsi = si.siid AND sp.sptgl = si.sitgl AND sp.spgudang = si.sigudang AND si.sistatus IN(2,3,4,7)
```

```sql
DELETE spd FROM m3_sp_detail_progress spd JOIN m3_sp_progress sp ON spd.idprogress = sp.spidprogress WHERE sp.spid = '{idtransaksi}' AND sp.spstepke = '{tahapke}'
```

```sql
DELETE spd, sp FROM m3_sp_detail_progress spd JOIN m3_sp_progress sp ON spd.idprogress = sp.spidprogress WHERE sp.spid = '{idtransaksi}' AND sp.spstepke = '{tahapke}'
```

```sql
DELETE sp FROM m3_sp_progress sp WHERE sp.spid = '{idtransaksi}' AND sp.spstepke = '{tahapke}'
```

```sql
INSERT INTO m3_sp_progress(SELECT 0, sp.* FROM m3_sp sp WHERE sp.spid = '{idtransaksi}')
```

```sql
SELECT spidprogress FROM m3_sp_progress WHERE spid = '{idtransaksi}' ORDER BY spmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m3_sp_detail_progress (SELECT 0, '{result_4}', sp.* FROM m3_sp_detail sp WHERE sp.idsp = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m3/m3_sp_history.vb`

```sql
INSERT INTO m3_sp_history(SELECT 0, sp.* FROM m3_sp sp WHERE sp.spid = '{idtransaksi}')
```

```sql
SELECT spidhistory FROM m3_sp_history WHERE spid = '{idtransaksi}' ORDER BY spmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m3_sp_detail_history (SELECT 0, '{result_4}', sp.* FROM m3_sp_detail sp WHERE sp.idsp = '{idtransaksi}' )
```

```sql
select `sp`.`spidhistory` AS `spidhistory`, `sp`.`spid` AS `spid`,`sp`.`spcabang` AS `spcabang`,`sp`.`splokasi` AS `splokasi`,`sp`.`spgudang` AS `spgudang`,`sp`.`spsumber` AS `spsumber`,`sp`.`spautonotransaksi` AS `spautonotransaksi`,`sp`.`spnotransaksi` AS `spnotransaksi`,`sp`.`sptgl` AS `sptgl`,`sp`.`spkodepa` AS `spkodepa`,`sp`.`spbagiansp` AS `spbagiansp`,`sp`.`spbagianspkontak` AS `spbagianspkontak`,`sp`.`spuraian` AS `spuraian`,`sp`.`spcatatan` AS `spcatatan`,`sp`.`spnoref` AS `spnoref`,`sp`.`sptglnoref` AS `sptglnoref`,`sp`.`spstatussa` AS `spstatussa`,`sp`.`spstatus` AS `spstatus`,`sp`.`spstatussebelumnya` AS `spstatussebelumnya`,`sp`.`spjmlrevisi` AS `spjmlrevisi`,`sp`.`spcetakanke` AS `spcetakanke`,`sp`.`spinputuser` AS `spinputuser`,`sp`.`spinputtgl` AS `spinputtgl`,`sp`.`spmodifikasiuser` AS `spmodifikasiuser`,`sp`.`spmodifikasitgl` AS `spmodifikasitgl`,`sp`.`spposting` AS `spposting`,`sp`.`sppostingtgl` AS `sppostingtgl`,`sp`.`sptutupperiode` AS `sptutupperiode`,`sp`.`spisclose` AS `spisclose`,`br`.`bnama` AS `spcabangnama`,`lc`.`lnama` AS `splokasinama`,`wh`.`wnama` AS `spgudangnama`,`c1`.`kkode` AS `spbagianspkode`,`c1`.`knama` AS `spbagianspnama`,`st1`.`nama` AS `spstatusnama`,`st2`.`nama` AS `spstatussebelumnyanama`,`u1`.`unama` AS `spinputusernama`,`u2`.`unama` AS `spmodifikasiusernama`, sp.spstepke from ((((((((`m3_sp_history` `sp` left join `m1_branch` `br` on((`br`.`bkode` = `sp`.`spcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `sp`.`splokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `sp`.`spgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `sp`.`spbagiansp`))) left join `m0_status` `st1` on((`st1`.`kode` = `sp`.`spstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `sp`.`spstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `sp`.`spinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `sp`.`spmodifikasiuser`)))
```

```sql
select `sp`.`spidhistory` AS `spidhistory`,`sp`.`spid` AS `spid`,`sp`.`spcabang` AS `spcabang`,`sp`.`splokasi` AS `splokasi`,`sp`.`spgudang` AS `spgudang`,`sp`.`spsumber` AS `spsumber`,`sp`.`spautonotransaksi` AS `spautonotransaksi`,`sp`.`spnotransaksi` AS `spnotransaksi`,`sp`.`sptgl` AS `sptgl`,`sp`.`spkodepa` AS `spkodepa`,`sp`.`spbagiansp` AS `spbagiansp`,`sp`.`spbagianspkontak` AS `spbagianspkontak`,`sp`.`spuraian` AS `spuraian`,`sp`.`spcatatan` AS `spcatatan`,`sp`.`spnoref` AS `spnoref`,`sp`.`sptglnoref` AS `sptglnoref`,`sp`.`spstatussa` AS `spstatussa`,`sp`.`spstatus` AS `spstatus`,`sp`.`spstatussebelumnya` AS `spstatussebelumnya`,`sp`.`spjmlrevisi` AS `spjmlrevisi`,`sp`.`spcetakanke` AS `spcetakanke`,`sp`.`spinputuser` AS `spinputuser`,`sp`.`spinputtgl` AS `spinputtgl`,`sp`.`spmodifikasiuser` AS `spmodifikasiuser`,`sp`.`spmodifikasitgl` AS `spmodifikasitgl`,`sp`.`spposting` AS `spposting`,`sp`.`sppostingtgl` AS `sppostingtgl`,`sp`.`sptutupperiode` AS `sptutupperiode`,`sp`.`spisclose` AS `spisclose`,`sp`.`spcustomtext1` AS `spcustomtext1`,`sp`.`spcustomtext2` AS `spcustomtext2`,`sp`.`spcustomtext3` AS `spcustomtext3`,`sp`.`spcustomtext4` AS `spcustomtext4`,`sp`.`spcustomtext5` AS `spcustomtext5`,`sp`.`spcustomint1` AS `spcustomint1`,`sp`.`spcustomint2` AS `spcustomint2`,`sp`.`spcustomint3` AS `spcustomint3`,`sp`.`spcustomdbl1` AS `spcustomdbl1`,`sp`.`spcustomdbl2` AS `spcustomdbl2`,`sp`.`spcustomdbl3` AS `spcustomdbl3`,`sp`.`spcustomdate1` AS `spcustomdate1`,`sp`.`spcustomdate2` AS `spcustomdate2`,`sp`.`spcustomdate3` AS `spcustomdate3`,`br`.`bnama` AS `spcabangnama`,`lc`.`lnama` AS `splokasinama`,`wh`.`wnama` AS `spgudangnama`,`c1`.`kkode` AS `spbagianspkode`,`c1`.`knama` AS `spbagianspnama`,`st1`.`nama` AS `spstatusnama`,`st2`.`nama` AS `spstatussebelumnyanama`,`u1`.`unama` AS `spinputusernama`,`u2`.`unama` AS `spmodifikasiusernama`,`spd`.`idhistorydetail` AS `idhistorydetail`,`spd`.`idhistory` AS `idhistory`,`spd`.`idspdetail` AS `idspdetail`,`spd`.`idsp` AS `idsp`,`spd`.`idbarang` AS `idbarang`,`spd`.`namabarang` AS `namabarang`,`spd`.`tipebarang` AS `tipebarang`,`spd`.`jmlsistem` AS `jmlsistem`,`spd`.`jmlfisik` AS `jmlfisik`,`spd`.`jmlbagus` AS `jmlbagus`,`spd`.`jmlrusak` AS `jmlrusak`,`spd`.`selisih` AS `selisih`,`spd`.`satuan` AS `satuan`,`spd`.`nilaisatuan` AS `nilaisatuan`,`spd`.`jmlbarangsistem` AS `jmlbarangsistem`,`spd`.`jmlbarangfisik` AS `jmlbarangfisik`,`spd`.`jmlbarangbagus` AS `jmlbarangbagus`,`spd`.`jmlbarangrusak` AS `jmlbarangrusak`,`spd`.`selisihbarang` AS `selisihbarang`,`spd`.`satuanbarang` AS `satuanbarang`,`spd`.`cabang` AS `cabang`,`spd`.`lokasi` AS `lokasi`,`spd`.`gudang` AS `gudang`,`spd`.`lokasibarang` AS `lokasibarang`,`spd`.`jmlsa` AS `jmlsa`,`spd`.`statussa` AS `statussa`,`spd`.`costcenter` AS `costcenter`,`spd`.`divisi` AS `divisi`,`spd`.`subdivisi` AS `subdivisi`,`spd`.`proyek` AS `proyek`,`spd`.`catatan` AS `catatan`,`spd`.`urutan` AS `urutan`,`spd`.`isclose` AS `isclose`,`spd`.`customtext1` AS `customtext1`,`spd`.`customtext2` AS `customtext2`,`spd`.`customtext3` AS `customtext3`,`spd`.`customdbl1` AS `customdbl1`,`spd`.`customdbl2` AS `customdbl2`,`spd`.`customdbl3` AS `customdbl3`,`spd`.`customdate1` AS `customdate1`,`spd`.`customdate2` AS `customdate2`,`spd`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`brd`.`bnama` AS `cabangnama`,`lcd`.`lnama` AS `lokasinama`,`whd`.`wnama` AS `gudangnama`,`il`.`ilnama` AS `lokasibarangnama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama`, sp.spstepke from ((((((((((((((((((`m3_sp_history` `sp` join `m3_sp_detail_history` `spd` on((`sp`.`spidhistory` = `spd`.`idhistory`))) left join `m1_branch` `br` on((`br`.`bkode` = `sp`.`spcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `sp`.`splokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `sp`.`spgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `sp`.`spbagiansp`))) left join `m0_status` `st1` on((`st1`.`kode` = `sp`.`spstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `sp`.`spstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `sp`.`spinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `sp`.`spmodifikasiuser`))) left join `m1_item` `i` on((`i`.`bid` = `spd`.`idbarang`))) left join `m1_branch` `brd` on((`spd`.`cabang` = `brd`.`bkode`))) left join `m1_location` `lcd` on((`spd`.`lokasi` = `lcd`.`lkode`))) left join `m1_warehouse` `whd` on((`spd`.`gudang` = `whd`.`wkode`))) left join `m1_item_location` `il` on((`spd`.`lokasibarang` = `il`.`ilkode`))) left join `m1_cost_center` `cc` on((`spd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`spd`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`spd`.`subdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`spd`.`proyek` = `p`.`pkode`)))
```

## `client-backend/api-myerpplus/app_code/ws/m3/m3_ts.vb`

```sql
SELECT EXISTS(SELECT 1 FROM m3_mr_detail JOIN m3_mr ON idmr = mrid WHERE idmrdetail = '{idmrdetail}' AND (mrstatus = 2 OR mrstatus = 3 OR mrstatus = 4 OR mrstatus = 7) LIMIT 1) as rowExists, '{idmrdetail}' as idmrdetail, bkode FROM m1_item WHERE bid = '{idbarang}'
```

```sql
SELECT EXISTS(SELECT 1 FROM m3_mr_detail JOIN m3_mr ON idmr = mrid WHERE idmrdetail = '{idmrdetail}' AND (mrstatus = 2 OR mrstatus = 3) LIMIT 1) as rowExists, '{idmrdetail}' as idmrdetail, bkode FROM m1_item WHERE bid = '{idbarang}'
```

```sql
SELECT COUNT(tsid), tsnotransaksi FROM M3_Ts WHERE tsid='{result_4}' AND tsstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(tsid) FROM m3_ts WHERE tsnotransaksi='{notransaksi}'
```

```sql
Update M3_Ts set tscabang = '{FixQuotes_drutama}tscabang', tslokasi = '{FixQuotes_drutama}tslokasi', tsgudangasal = '{FixQuotes_drutama}tsgudangasal', tsgudangtransit = '{FixQuotes_drutama}tsgudangtransit', tsgudangtujuan = '{FixQuotes_drutama}tsgudangtujuan', tssumber = '{FixQuotes_drutama}tssumber', tsautonotransaksi = {drutama}tsautonotransaksi, tsnotransaksi = '{notransaksi}', tstgl = '{FixQuotes_AsFormatTanggal_drutama}tstgl', tskodepa = {drutama}tskodepa, tsbagianmutasi = {drutama}tsbagianmutasi, tsbagianmutasikontak = '{FixQuotes_drutama}tsbagianmutasikontak', tsuraian = '{FixQuotes_drutama}tsuraian', tscatatan = '{FixQuotes_drutama}tscatatan', tsnoref = '{FixQuotes_drutama}tsnoref', tstglnoref = '{FixQuotes_AsFormatTanggal_drutama}tstglnoref', tsidmr = {drutama}tsidmr, tsstatusrs = {drutama}tsstatusrs, tsstatus = {drutama}tsstatus, tsstatussebelumnya = {drutama}tsstatussebelumnya, tsjmlrevisi = tsjmlrevisi+1, tscetakanke = {drutama}tscetakanke, tsmodifikasiuser = {drutama}tsmodifikasiuser, tsmodifikasitgl = NOW(), tscustomtext1 = '{FixQuotes_drutama}tscustomtext1', tscustomtext2 = '{FixQuotes_drutama}tscustomtext2', tscustomtext3 = '{FixQuotes_drutama}tscustomtext3', tscustomtext4 = '{FixQuotes_drutama}tscustomtext4', tscustomtext5 = '{FixQuotes_drutama}tscustomtext5', tscustomint1 = {drutama}tscustomint1, tscustomint2 = {drutama}tscustomint2, tscustomint3 = {drutama}tscustomint3, tscustomdbl1 = '{FixDouble_drutama}tscustomdbl1', tscustomdbl2 = '{FixDouble_drutama}tscustomdbl2', tscustomdbl3 = '{FixDouble_drutama}tscustomdbl3', tscustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}tscustomdate1', tscustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}tscustomdate2', tscustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}tscustomdate3', tsjenis = {drutama}tsjenis where tsid = '{drutama}tsid'
```

```sql
Insert into M3_Ts (tscabang, tslokasi, tsgudangasal, tsgudangtransit, tsgudangtujuan, tssumber, tsautonotransaksi, tsnotransaksi, tstgl, tskodepa, tsbagianmutasi, tsbagianmutasikontak, tsuraian, tscatatan, tsnoref, tstglnoref, tsidmr, tsstatusrs, tsstatus, tsstatussebelumnya, tsjmlrevisi, tscetakanke, tsinputuser, tsinputtgl, tsmodifikasiuser, tsmodifikasitgl, tsisclose, tscustomtext1, tscustomtext2, tscustomtext3, tscustomtext4, tscustomtext5, tscustomint1, tscustomint2, tscustomint3, tscustomdbl1, tscustomdbl2, tscustomdbl3, tscustomdate1, tscustomdate2, tscustomdate3, tsjenis) values('{FixQuotes_drutama}tscabang', '{FixQuotes_drutama}tslokasi', '{FixQuotes_drutama}tsgudangasal', '{FixQuotes_drutama}tsgudangtransit', '{FixQuotes_drutama}tsgudangtujuan', '{FixQuotes_drutama}tssumber', {drutama}tsautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}tstgl', {drutama}tskodepa, {drutama}tsbagianmutasi, '{FixQuotes_drutama}tsbagianmutasikontak', '{FixQuotes_drutama}tsuraian', '{FixQuotes_drutama}tscatatan', '{FixQuotes_drutama}tsnoref', '{FixQuotes_AsFormatTanggal_drutama}tstglnoref', {drutama}tsidmr, {drutama}tsstatusrs, {drutama}tsstatus, {drutama}tsstatussebelumnya, {drutama}tsjmlrevisi, {drutama}tscetakanke, {drutama}tsinputuser, NOW(), {drutama}tsmodifikasiuser, '1971-01-01 00:00:00', {drutama}tsisclose, '{FixQuotes_drutama}tscustomtext1', '{FixQuotes_drutama}tscustomtext2', '{FixQuotes_drutama}tscustomtext3', '{FixQuotes_drutama}tscustomtext4', '{FixQuotes_drutama}tscustomtext5', {drutama}tscustomint1, {drutama}tscustomint2, {drutama}tscustomint3, '{FixDouble_drutama}tscustomdbl1', '{FixDouble_drutama}tscustomdbl2', '{FixDouble_drutama}tscustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}tscustomdate1', '{FixQuotes_AsFormatTanggal_drutama}tscustomdate2', '{FixQuotes_AsFormatTanggal_drutama}tscustomdate3', {drutama}tsjenis)
```

```sql
select tsid from M3_Ts where tsnotransaksi='{notransaksi}' AND tsinputuser= '{userid}' order by tsmodifikasitgl desc limit 1
```

```sql
Delete from M3_Ts_Detail where idts = '{result_4}'
```

```sql
Insert into M3_Ts_Detail(idtsdetail, idts, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, idhppkhususmasuk, cabang, lokasi, gudangasal, gudangtransit, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idmrdetail, jmlrs, statusrs, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, idgrndetail) values{strValue2_ToString}
```

```sql
UPDATE m3_mr_detail SET jmlrealisasi = (CASE idmrdetail {updNilai} ELSE jmlrealisasi END) WHERE
```

```sql
SELECT idmr FROM m3_mr_detail WHERE {updFilter} GROUP BY idmr
```

```sql
SELECT idmr, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m3_mr_detail WHERE {ftDetail} GROUP BY idmr
```

```sql
UPDATE m3_mr SET mrstatusrealisasi = (CASE mrid {updNilai} ELSE mrstatusrealisasi END) WHERE
```

```sql
SELECT tsd.idtsdetail, tsd.idbarang, tsd.namabarang, tsd.tipebarang, tsd.jml, tsd.satuan, tsd.jmlbarang, tsd.satuanbarang, tsd.idhppkhususmasuk, tsd.gudangasal, tsd.gudangtransit, tsd.gudangtujuan, tsd.catatan, tsd.costcenter, tsd.divisi, tsd.subdivisi, tsd.proyek, ts.tsinputtgl, i.bhpp, i.bhppaverage FROM m3_ts_detail tsd JOIN m3_ts ts ON tsd.idts = ts.tsid JOIN m1_item i ON tsd.idbarang = i.bid WHERE tsd.idts = '{result_4}'
```

```sql
SELECT moduleid, menuid, 0, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Tstgl, Tsnotransaksi, Tsstatus, Tsjenis FROM m3_Ts WHERE Tsid='{idtransaksi}'
```

```sql
SELECT idbarang, tipebarang, namabarang, satuan, nilaisatuan, jmlbarang, gudangasal, gudangtransit, gudangtujuan, idmrdetail, urutan, customdbl2, idgrndetail FROM m3_ts_detail WHERE idts = '{idtransaksi}'
```

```sql
UPDATE M3_Ts SET Tsstatus = {nilaiStatus}, Tsmodifikasiuser='{userid}', Tsmodifikasitgl = NOW(), Tsposting = 0, Tspostingtgl = '1971-01-01 00:00:00', Tsjmlrevisi = Tsjmlrevisi + 1 WHERE Tsid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Tsid, Tsnotransaksi FROM m3_Ts WHERE Tsid='{idtransaksi}'
```

```sql
DELETE FROM M3_Ts_Detail WHERE idts ='{idtransaksi}'
```

```sql
DELETE FROM M3_Ts WHERE tsid ='{idtransaksi}'
```

```sql
select `ts`.`tsid` AS `tsid`,`ts`.`tscabang` AS `tscabang`,`ts`.`tslokasi` AS `tslokasi`,`ts`.`tsgudangasal` AS `tsgudangasal`,`ts`.`tsgudangtransit` AS `tsgudangtransit`,`ts`.`tsgudangtujuan` AS `tsgudangtujuan`,`ts`.`tssumber` AS `tssumber`,`ts`.`tsautonotransaksi` AS `tsautonotransaksi`,`ts`.`tsnotransaksi` AS `tsnotransaksi`,`ts`.`tstgl` AS `tstgl`,`ts`.`tskodepa` AS `tskodepa`,`ts`.`tsbagianmutasi` AS `tsbagianmutasi`,`ts`.`tsbagianmutasikontak` AS `tsbagianmutasikontak`,`ts`.`tsuraian` AS `tsuraian`,`ts`.`tscatatan` AS `tscatatan`,`ts`.`tsnoref` AS `tsnoref`,`ts`.`tstglnoref` AS `tstglnoref`,`ts`.`tsidmr` AS `tsidmr`,`ts`.`tsstatusrs` AS `tsstatusrs`,`ts`.`tsstatusrealisasi` AS `tsstatusrealisasi`,`ts`.`tsstatus` AS `tsstatus`,`ts`.`tsstatussebelumnya` AS `tsstatussebelumnya`,`ts`.`tsjmlrevisi` AS `tsjmlrevisi`,`ts`.`tscetakanke` AS `tscetakanke`,`ts`.`tsinputuser` AS `tsinputuser`,`ts`.`tsinputtgl` AS `tsinputtgl`,`ts`.`tsmodifikasiuser` AS `tsmodifikasiuser`,`ts`.`tsmodifikasitgl` AS `tsmodifikasitgl`,`ts`.`tsposting` AS `tsposting`,`ts`.`tspostingtgl` AS `tspostingtgl`,`ts`.`tsisclose` AS `tsisclose`,`ts`.`tscustomtext1` AS `tscustomtext1`,`ts`.`tscustomtext2` AS `tscustomtext2`,`ts`.`tscustomtext3` AS `tscustomtext3`,`ts`.`tscustomtext4` AS `tscustomtext4`,`ts`.`tscustomtext5` AS `tscustomtext5`,`ts`.`tscustomint1` AS `tscustomint1`,`ts`.`tscustomint2` AS `tscustomint2`,`ts`.`tscustomint3` AS `tscustomint3`,`ts`.`tscustomdbl1` AS `tscustomdbl1`,`ts`.`tscustomdbl2` AS `tscustomdbl2`,`ts`.`tscustomdbl3` AS `tscustomdbl3`,`ts`.`tscustomdate1` AS `tscustomdate1`,`ts`.`tscustomdate2` AS `tscustomdate2`,`ts`.`tscustomdate3` AS `tscustomdate3`,`br`.`bnama` AS `tscabangnama`,`lc`.`lnama` AS `tslokasinama`,`wh1`.`wnama` AS `tsgudangasalnama`,`wh2`.`wnama` AS `tsgudangtransitnama`,`wh3`.`wnama` AS `tsgudangtujuannama`,`c1`.`kkode` AS `tsbagianmutasikode`,`c1`.`knama` AS `tsbagianmutasinama`,`mr`.`mrnotransaksi` AS `tsmrnotransaksi`,`st1`.`nama` AS `tsstatusnama`,`st2`.`nama` AS `tsstatussebelumnyanama`,`u1`.`unama` AS `tsinputusernama`,`u2`.`unama` AS `tsmodifikasiusernama`, ts.tsjenis, `tsd`.`idtsdetail` AS `idtsdetail`,`tsd`.`idts` AS `idts`,`tsd`.`idbarang` AS `idbarang`,`tsd`.`namabarang` AS `namabarang`,`tsd`.`tipebarang` AS `tipebarang`,`tsd`.`jml` AS `jml`,`tsd`.`satuan` AS `satuan`,`tsd`.`nilaisatuan` AS `nilaisatuan`,`tsd`.`jmlbarang` AS `jmlbarang`,`tsd`.`satuanbarang` AS `satuanbarang`,`tsd`.`idhppkhususmasuk` AS `idhppkhususmasuk`,`tsd`.`cabang` AS `cabang`,`tsd`.`lokasi` AS `lokasi`,`tsd`.`gudangasal` AS `gudangasal`,`tsd`.`gudangtransit` AS `gudangtransit`,`tsd`.`gudangtujuan` AS `gudangtujuan`,`tsd`.`costcenter` AS `costcenter`,`tsd`.`divisi` AS `divisi`,`tsd`.`subdivisi` AS `subdivisi`,`tsd`.`proyek` AS `proyek`,`tsd`.`catatan` AS `catatan`,`tsd`.`urutan` AS `urutan`,`tsd`.`idmrdetail` AS `idmrdetail`,`tsd`.`jmlrs` AS `jmlrs`,`tsd`.`statusrs` AS `statusrs`,`tsd`.`jmlrealisasi` AS `jmlrealisasi`,`tsd`.`statusrealisasi` AS `statusrealisasi`,`tsd`.`isclose` AS `isclose`,`tsd`.`customtext1` AS `customtext1`,`tsd`.`customtext2` AS `customtext2`,`tsd`.`customtext3` AS `customtext3`,`tsd`.`customdbl1` AS `customdbl1`,`tsd`.`customdbl2` AS `customdbl2`,`tsd`.`customdbl3` AS `customdbl3`,`tsd`.`customdate1` AS `customdate1`,`tsd`.`customdate2` AS `customdate2`,`tsd`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bhpp` AS `bhpp`,`i`.`bhppaverage` AS `bhppaverage`,`i`.`bjenis` AS `bjenis`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,`i`.`basset` AS `basset`,`brd`.`bnama` AS `cabangnama`,`lcd`.`lnama` AS `lokasinama`,`whd1`.`wnama` AS `gudangasalnama`,`whd2`.`wnama` AS `gudangtransitnama`,`whd2`.`wnama` AS `gudangtujuannama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama`,`mr2`.`mrnotransaksi` AS `mrnotransaksi`, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan, tsd.idgrndetail from ((((((((((((((((((((((((`m3_ts` `ts` join `m3_ts_detail` `tsd` on((`ts`.`tsid` = `tsd`.`idts`))) left join `m1_branch` `br` on((`br`.`bkode` = `ts`.`tscabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `ts`.`tslokasi`))) left join `m1_warehouse` `wh1` on((`wh1`.`wkode` = `ts`.`tsgudangasal`))) left join `m1_warehouse` `wh2` on((`wh2`.`wkode` = `ts`.`tsgudangtransit`))) left join `m1_warehouse` `wh3` on((`wh3`.`wkode` = `ts`.`tsgudangtujuan`))) left join `m1_contact` `c1` on((`c1`.`kid` = `ts`.`tsbagianmutasi`))) left join `m3_mr` `mr` on((`mr`.`mrid` = `ts`.`tsidmr`))) left join `m0_status` `st1` on((`st1`.`kode` = `ts`.`tsstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `ts`.`tsstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `ts`.`tsinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `ts`.`tsmodifikasiuser`))) left join `m1_item` `i` on((`i`.`bid` = `tsd`.`idbarang`))) left join `m1_branch` `brd` on((`tsd`.`cabang` = `brd`.`bkode`))) left join `m1_location` `lcd` on((`tsd`.`lokasi` = `lcd`.`lkode`))) left join `m1_warehouse` `whd1` on((`tsd`.`gudangasal` = `whd1`.`wkode`))) left join `m1_warehouse` `whd2` on((`tsd`.`gudangtransit` = `whd2`.`wkode`))) left join `m1_warehouse` `whd3` on((`tsd`.`gudangtujuan` = `whd3`.`wkode`))) left join `m1_cost_center` `cc` on((`tsd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`tsd`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`tsd`.`subdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`tsd`.`proyek` = `p`.`pkode`))) left join `m3_mr_detail` `mrd` on((`tsd`.`idmrdetail` = `mrd`.`idmrdetail`))) left join `m3_mr` `mr2` on((`mrd`.`idmr` = `mr2`.`mrid`)))
```

```sql
select `tsd`.`idtsdetail` AS `idtsdetail`,`tsd`.`idts` AS `idts`,`tsd`.`idbarang` AS `idbarang`,`tsd`.`namabarang` AS `namabarang`,`tsd`.`tipebarang` AS `tipebarang`,`tsd`.`jml` AS `jml`,`tsd`.`satuan` AS `satuan`,`tsd`.`nilaisatuan` AS `nilaisatuan`,`tsd`.`jmlbarang` AS `jmlbarang`,`tsd`.`satuanbarang` AS `satuanbarang`,`tsd`.`idhppkhususmasuk` AS `idhppkhususmasuk`,`tsd`.`cabang` AS `cabang`,`tsd`.`lokasi` AS `lokasi`,`tsd`.`gudangasal` AS `gudangasal`,`tsd`.`gudangtransit` AS `gudangtransit`,`tsd`.`gudangtujuan` AS `gudangtujuan`,`tsd`.`costcenter` AS `costcenter`,`tsd`.`divisi` AS `divisi`,`tsd`.`subdivisi` AS `subdivisi`,`tsd`.`proyek` AS `proyek`,`tsd`.`catatan` AS `catatan`,`tsd`.`urutan` AS `urutan`,`tsd`.`idmrdetail` AS `idmrdetail`,`tsd`.`jmlrs` AS `jmlrs`,`tsd`.`statusrs` AS `statusrs`,`tsd`.`jmlrealisasi` AS `jmlrealisasi`,`tsd`.`statusrealisasi` AS `statusrealisasi`,`tsd`.`isclose` AS `isclose`,`tsd`.`customtext1` AS `customtext1`,`tsd`.`customtext2` AS `customtext2`,`tsd`.`customtext3` AS `customtext3`,`tsd`.`customdbl1` AS `customdbl1`,`tsd`.`customdbl2` AS `customdbl2`,`tsd`.`customdbl3` AS `customdbl3`,`tsd`.`customdate1` AS `customdate1`,`tsd`.`customdate2` AS `customdate2`,`tsd`.`customdate3` AS `customdate3`,`ts`.`tsnotransaksi` AS `tsnotransaksi`,`i`.`bkode` AS `kodebarang`,`i`.`bhpp` AS `bhpp`,`i`.`bhppaverage` AS `bhppaverage`,`i`.`bjenis` AS `bjenis`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,((`tsd`.`jmlbarang` - `tsd`.`jmlrs`) / `tsd`.`nilaisatuan`) AS `jmlsisars`,((`tsd`.`jmlbarang` - `tsd`.`jmlrealisasi`) / `tsd`.`nilaisatuan`) AS `jmlsisarealisasi`, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan, i.basset from ((`m3_ts_detail` `tsd` join `m3_ts` `ts` on((`tsd`.`idts` = `ts`.`tsid`))) join `m1_item` `i` on((`tsd`.`idbarang` = `i`.`bid`)))
```

```sql
SELECT mrd.idmrdetail, (mrd.jmlbarang - mrd.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m3_mr_detail AS mrd INNER JOIN m1_item AS i ON mrd.idbarang = i.bid WHERE
```

```sql
select `ts`.`tsid` AS `tsid`,`ts`.`tsnotransaksi` AS `tsnotransaksi`,'MR' AS `sumber`,`mr`.`mrid` AS `idterkait`,`mr`.`mrnotransaksi` AS `noterkait`,`mr`.`mrtgl` AS `tglterkait`,`mr`.`mrinputtgl` AS `inputtglterkait`,`mr`.`mrmodifikasitgl` AS `modifikasitglterkait`,0 AS `jenisterkait` from (((`m3_ts_detail` `tsd` join `m3_ts` `ts` on((`tsd`.`idts` = `ts`.`tsid`))) join `m3_mr_detail` `mrd` on((`tsd`.`idmrdetail` = `mrd`.`idmrdetail`))) join `m3_mr` `mr` on((`mrd`.`idmr` = `mr`.`mrid`))) {filter1} group by `mr`.`mrid`,`ts`.`tsid`
```

```sql
select `ts`.`tsid` AS `tsid`,`ts`.`tsnotransaksi` AS `tsnotransaksi`,'GRN' AS `sumber`,`grn`.`grnid` AS `idterkait`,`grn`.`grnnotransaksi` AS `noterkait`,`grn`.`grntgl` AS `tglterkait`,`grn`.`grninputtgl` AS `inputtglterkait`,`grn`.`grnmodifikasitgl` AS `modifikasitglterkait`,0 AS `jenisterkait` from (((`m3_ts_detail` `tsd` join `m3_ts` `ts` on((`tsd`.`idts` = `ts`.`tsid`))) join `m4_grn_detail` `grnd` on((`tsd`.`idgrndetail` = `grnd`.`idgrndetail`))) join `m4_grn` `grn` on((`grnd`.`idgrn` = `grn`.`grnid`))) {filter2} group by `grn`.`grnid`,`ts`.`tsid`
```

```sql
select `ts`.`tsid` AS `tsid`,`ts`.`tsnotransaksi` AS `tsnotransaksi`,'RS' AS `sumber`,`m3_rs`.`rsid` AS `idterkait`,`m3_rs`.`rsnotransaksi` AS `noterkait`,`m3_rs`.`rstgl` AS `tglterkait`,`m3_rs`.`rsinputtgl` AS `inputtglterkait`,`m3_rs`.`rsmodifikasitgl` AS `modifikasitglterkait`, 1 as jenisterkait from (((`m3_ts_detail` `tsd` join `m3_ts` `ts` on((`tsd`.`idts` = `ts`.`tsid`))) join `m3_rs_detail` on((`m3_rs_detail`.`idtsdetail` = `tsd`.`idtsdetail`))) join `m3_rs` on((`m3_rs_detail`.`idrs` = `m3_rs`.`rsid`))) {filter3} group by `m3_rs`.`rsid`, `ts`.`tsid`
```

```sql
Insert into M3_Ts_Detail(idtsdetail, idts, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, idhppkhususmasuk, cabang, lokasi, gudangasal, gudangtransit, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idmrdetail, jmlrs, statusrs, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m3/m3_ts_history.vb`

```sql
INSERT INTO m3_ts_history(SELECT 0, ts.* FROM m3_ts ts WHERE ts.tsid = '{idtransaksi}')
```

```sql
SELECT tsidhistory FROM m3_ts_history WHERE tsid = '{idtransaksi}' ORDER BY tsmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m3_ts_detail_history (SELECT 0, '{result_4}', ts.* FROM m3_ts_detail ts WHERE ts.idts = '{idtransaksi}' )
```

