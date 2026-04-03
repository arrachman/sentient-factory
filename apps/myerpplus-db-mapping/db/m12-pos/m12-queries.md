# M12 Queries

Collected from `client-backend/api-myerpplus/app_code/ws/myerpplus.vb` dispatch targets under `app_code/ws/m12`.

Total queries: `530`

## `client-backend/api-myerpplus/app_code/ws/m12/m12_ai.vb`

```sql
SELECT COUNT(aiid), ainotransaksi FROM M_12_Ai WHERE aiid=
```

```sql
SELECT COUNT(aiid) FROM M_12_Ai WHERE ainotransaksi='{notransaksi}'
```

```sql
Update M_12_Ai set aicabang = '{FixQuotes_drutama}aicabang', ailokasi = '{FixQuotes_drutama}ailokasi', aisumber = '{FixQuotes_drutama}aisumber', aikategoripos = '{FixQuotes_drutama}aikategoripos', aiautonotransaksi = {drutama}aiautonotransaksi, ainotransaksi = '{FixQuotes_drutama}ainotransaksi', aitgl = '{FixQuotes_AsFormatTanggal_drutama}aitgl', aikodepa = '{FixQuotes_drutama}aikodepa', aikontak = '{FixQuotes_drutama}aikontak', aikontakperson = '{FixQuotes_drutama}aikontakperson', aiuraian = '{FixQuotes_drutama}aiuraian', aicatatan = '{FixQuotes_drutama}aicatatan', aistatus = {drutama}aistatus, aistatussebelumnya = {drutama}aistatussebelumnya, aijmlrevisi = {drutama}aijmlrevisi, aicetakanke = {drutama}aicetakanke, aiisclose = {drutama}aiisclose, aiinputuser = '{FixQuotes_drutama}aiinputuser', aimodifikasiuser = '{FixQuotes_drutama}aimodifikasiuser', aimodifikasitgl = NOW(), aiposting = {drutama}aiposting, aipostingtgl = '{FixQuotes_AsFormatTanggal_drutama}aipostingtglyyyy-MM-dd H:mm:ss', aicustomtext1 = '{FixQuotes_drutama}aicustomtext1', aicustomtext2 = '{FixQuotes_drutama}aicustomtext2', aicustomtext3 = '{FixQuotes_drutama}aicustomtext3', aicustomtext4 = '{FixQuotes_drutama}aicustomtext4', aicustomtext5 = '{FixQuotes_drutama}aicustomtext5', aicustomint1 = {drutama}aicustomint1, aicustomint2 = {drutama}aicustomint2, aicustomint3 = {drutama}aicustomint3, aicustomdbl1 = '{FixDouble_drutama}aicustomdbl1', aicustomdbl2 = '{FixDouble_drutama}aicustomdbl2', aicustomdbl3 = '{FixDouble_drutama}aicustomdbl3', aicustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}aicustomdate1', aicustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}aicustomdate2', aicustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}aicustomdate3', aijeniskategori = '{FixQuotes_drutama}aijeniskategori' where aiid = {drutama}aiid
```

```sql
SELECT COUNT(aiid) FROM m_12_ai WHERE ainotransaksi='{notransaksi}'
```

```sql
Insert into M_12_Ai (aicabang, ailokasi, aisumber, aikategoripos, aiautonotransaksi, ainotransaksi, aitgl, aikodepa, aikontak, aikontakperson, aiuraian, aicatatan, aistatus, aistatussebelumnya, aijmlrevisi, aicetakanke, aiisclose, aiinputuser, aiinputtgl, aimodifikasiuser, aimodifikasitgl, aiposting, aipostingtgl, aicustomtext1, aicustomtext2, aicustomtext3, aicustomtext4, aicustomtext5, aicustomint1, aicustomint2, aicustomint3, aicustomdbl1, aicustomdbl2, aicustomdbl3, aicustomdate1, aicustomdate2, aicustomdate3, aijeniskategori) values('{FixQuotes_drutama}aicabang', '{FixQuotes_drutama}ailokasi', '{FixQuotes_drutama}aisumber', '{FixQuotes_drutama}aikategoripos', {drutama}aiautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}aitgl', '{FixQuotes_drutama}aikodepa', '{FixQuotes_drutama}aikontak', '{FixQuotes_drutama}aikontakperson', '{FixQuotes_drutama}aiuraian', '{FixQuotes_drutama}aicatatan', {drutama}aistatus, {drutama}aistatussebelumnya, {drutama}aijmlrevisi, {drutama}aicetakanke, {drutama}aiisclose, '{FixQuotes_drutama}aiinputuser', NOW(), '{FixQuotes_drutama}aimodifikasiuser', '1971-01-01 00:00:00', 0, '1971-01-01 00:00:00', '{FixQuotes_drutama}aicustomtext1', '{FixQuotes_drutama}aicustomtext2', '{FixQuotes_drutama}aicustomtext3', '{FixQuotes_drutama}aicustomtext4', '{FixQuotes_drutama}aicustomtext5', {drutama}aicustomint1, {drutama}aicustomint2, {drutama}aicustomint3, '{FixDouble_drutama}aicustomdbl1', '{FixDouble_drutama}aicustomdbl2', '{FixDouble_drutama}aicustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}aicustomdate1', '{FixQuotes_AsFormatTanggal_drutama}aicustomdate2', '{FixQuotes_AsFormatTanggal_drutama}aicustomdate3', {drutama}aijeniskategori)
```

```sql
select aiid from M_12_ai where ainotransaksi='{notransaksi}' AND aiinputuser= '{drutama}aiinputuser' order by aimodifikasitgl desc limit 1
```

```sql
Delete from M_12_Ai_Detail where idai =
```

```sql
Delete from M_12_Ai_Additional where idai =
```

```sql
SELECT aid.aikategori as kategori, aid.idbarang as idbarang, aid.operator as operator, i.bkode, (CASE aid.operator WHEN 0 THEN 'Between' WHEN 1 THEN '>=' WHEN 2 THEN 'Multiple' ELSE 'Unknown' END) as operatornama FROM m_12_ai_detail aid JOIN m1_item i ON aid.idbarang = i.bid WHERE aid.aikategori = '{FxDB_drutama}aikategoripos' AND aid.idbarang = '{FxDB_dr1}idbarang' AND aid.idai = '{result_4}' AND aid.idaidetail <> '{FxDB_dr1}idaidetail' GROUP BY aid.operator ORDER BY aid.operator
```

```sql
Insert into M_12_Bi_Detail(idbidetail, idbi, bikategori, idbarang, operator, jml1, jml2, customtext1, customtext2, customtext3, customtext4, customtext5, customint1, customint2, customint3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, tgl1, tgl2, nopromo) values{strValue2_ToString}
```

```sql
Insert into M_12_Ai_Detail(idaidetail, idai, aikategori, idbarang, operator, jml1, jml2, customtext1, customtext2, customtext3, customtext4, customtext5, customint1, customint2, customint3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, tgl1, tgl2, nopromo, catatan, urutan) values('{FixQuotes_dr1}idaidetail', {result_4}, '{FixQuotes_drutama}aikategoripos', '{FixQuotes_dr1}idbarang', '{FixQuotes_dr1}operator', '{FixDouble_dr1}jml1', '{FixDouble_dr1}jml2', '{FixQuotes_dr1}customtext1', '{FixQuotes_dr1}customtext2', '{FixQuotes_dr1}customtext3', '{FixQuotes_dr1}customtext4', '{FixQuotes_dr1}customtext5', {dr1}customint1, {dr1}customint2, {dr1}customint3, '{FixDouble_dr1}customdbl1', '{FixDouble_dr1}customdbl2', '{FixDouble_dr1}customdbl3', '{FixQuotes_AsFormatTanggal_dr1}customdate1', '{FixQuotes_AsFormatTanggal_dr1}customdate2', '{FixQuotes_AsFormatTanggal_dr1}customdate3', '{FixQuotes_AsFormatTanggal_dr1}tgl1', '{FixQuotes_AsFormatTanggal_dr1}tgl2', '{notransaksi}', '{FixQuotes_dr1}catatan','{FixQuotes_dr1}urutan')
```

```sql
select idaidetail from M_12_ai_detail where idai='{result_4}' and aikategori = '{drutama}aikategoripos' AND idbarang = '{dr1}idbarang' AND operator = '{dr1}operator' AND jml1 = '{dr1}jml1' AND jml2 = '{dr1}jml2' order by idaidetail desc limit 1
```

```sql
Insert into M_12_Ai_Additional(idadditional, idai, idaidetail, idbarang, jml, satuan, customtext1, customtext2, customtext3, customtext4, customtext5, customint1, customint2, customint3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, urutan) values{strValue2_ToString}
```

```sql
select aiid from M_12_Pos_Additional_Item where aikategori = '{drutama}aikategoripos'
```

```sql
Delete From m_12_pos_additional_item where {strValueItemUtama_ToString}
```

```sql
Delete From m_12_pos_additional_item_detail where {strValueItemDetail_ToString}
```

```sql
select aiid from M_12_Pos_Additional_Item where aikategori IN ({dtCatPOS_Rows_0_0})
```

```sql
Delete From m_12_pos_additional_item
```

```sql
Delete From m_12_pos_additional_item_detail
```

```sql
select * from M_12_Ai_Detail where idai = '{result_4}' order by idai asc
```

```sql
select * from M_12_Ai_Additional where idai = '{result_4}' order by idai asc
```

```sql
Insert into M_12_Pos_Additional_Item (aikategori, aiidbarang, aioperator, aijml1, aijml2, aicustomtext1, aicustomtext2, aicustomtext3, aicustomtext4, aicustomtext5, aicustomint1, aicustomint2, aicustomint3, aicustomdbl1, aicustomdbl2, aicustomdbl3, aicustomdate1, aicustomdate2, aicustomdate3, aitgl1, aitgl2, ainopromo) values {strValueInsertAdditionalItem_ToString}
```

```sql
select aiid from M_12_Pos_Additional_Item where ainopromo = '{drdtl2}nopromo' AND aikategori = '{drdtl2}aikategori' AND aiidbarang = '{drdtl2}idbarang' AND aioperator = '{drdtl2}operator' AND aijml1 = '{drdtl2}jml1' AND aijml2 = '{drdtl2}jml2' limit 1
```

```sql
Insert into M_12_Pos_Additional_Item_Detail(idai, idbarang, jml, satuan, customtext1, customtext2, customtext3, customtext4, customtext5, customint1, customint2, customint3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValueAdditionalItemDetail_ToString}
```

```sql
select pckode from m_12_pos_category WHERE pckode IN ({dtCatPOS_Rows_0_0})
```

```sql
select piidbarang from M_12_Pos_Item where pikategori = '{drKatPos}pckode' AND piidbarang = '{drdtl}idbarang' order by pikategori asc
```

```sql
select piidbarang from M_12_Pos_Item where pikategori = '{drKatPos}pckode' AND piidbarang = '{drdtl2}idbarang' order by pikategori asc
```

```sql
select aiid from M_12_Pos_Additional_Item where ainopromo = '{drdtl2}nopromo' AND aikategori = '{drKatPos}pckode' AND aiidbarang = '{drdtl2}idbarang' AND aioperator = '{drdtl2}operator' AND aijml1 = '{drdtl2}jml1' AND aijml2 = '{drdtl2}jml2' limit 1
```

```sql
select pckode from m_12_pos_category
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Aitgl, Ainotransaksi, Aistatus FROM m_12_Ai WHERE Aiid='{idtransaksi}'
```

```sql
SELECT * FROM M_12_ai WHERE aiid=
```

```sql
SELECT * FROM M_12_Ai_Detail WHERE idai=
```

```sql
SELECT aiid FROM m_12_pos_additional_item WHERE aikategori='{drdetail}aikategori'
```

```sql
Delete from M_12_pos_additional_item WHERE
```

```sql
Delete from M_12_pos_additional_item_Detail WHERE
```

```sql
SELECT aiid FROM m_12_pos_additional_item WHERE sinopromo = '{drdetail}nopromo'
```

```sql
Delete from m_12_pos_additional_item WHERE
```

```sql
Delete from m_12_pos_additional_item_Detail WHERE
```

```sql
Delete from M_12_Bi_Detail WHERE idbidetail=
```

```sql
SELECT Bistatussebelumnya FROM M_12_Bi WHERE biid=
```

```sql
UPDATE M_12_Ai SET Aistatus = {nilaiStatus}, aimodifikasiuser='{userid}', aimodifikasitgl = NOW(), aiposting = 0, aipostingtgl = '1971-01-01 00:00:00', Aijmlrevisi = Aijmlrevisi + 1 WHERE aiid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT aiid, ainotransaksi FROM m_12_ai WHERE aiid='{idtransaksi}'
```

```sql
DELETE FROM M_12_Ai_Detail WHERE idai = '{idtransaksi}'
```

```sql
DELETE FROM M_12_Ai WHERE aiid = '{idtransaksi}'
```

```sql
select aiid from M_12_Pos_Additional_Item where aikategori = '{drdtl2}aikategori' AND aiidbarang = '{drdtl2}idbarang' AND aioperator = '{drdtl2}operator' AND aijml1 = '{drdtl2}jml1' AND aijml2 = '{drdtl2}jml2' limit 1
```

```sql
select * from m_12_pos_category
```

```sql
select * from M_12_Pos_Item where pikategori = '{drKatPos}pckode' AND piidbarang = '{drdtl}idbarang' order by pikategori asc
```

```sql
select * from M_12_Pos_Item where pikategori = '{drKatPos}pckode' AND piidbarang = '{drdtl2}idbarang' order by pikategori asc
```

```sql
select aiid from M_12_Pos_Additional_Item where aikategori = '{drKatPos}pckode' AND aiidbarang = '{drdtl2}idbarang' AND aioperator = '{drdtl2}operator' AND aijml1 = '{drdtl2}jml1' AND aijml2 = '{drdtl2}jml2' limit 1
```

```sql
select `aib`.`idadditional` AS `idadditional`, `aib`.`idaidetail` AS `idaidetail`,`aib`.`idai` AS `idai`,`aib`.`idbarang` AS `idbarang`,`aib`.`jml` AS `jml`,`aib`.`satuan` AS `satuan`,`aib`.`customtext1` AS `customtext1`,`aib`.`customtext2` AS `customtext2`,`aib`.`customtext3` AS `customtext3`,`aib`.`customtext4` AS `customtext4`,`aib`.`customtext5` AS `customtext5`,`aib`.`customint1` AS `customint1`,`aib`.`customint2` AS `customint2`,`aib`.`customint3` AS `customint3`,`aib`.`customdbl1` AS `customdbl1`,`aib`.`customdbl2` AS `customdbl2`,`aib`.`customdbl3` AS `customdbl3`,`aib`.`customdate1` AS `customdate1`,`aib`.`customdate2` AS `customdate2`,`aib`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bnama` AS `namabarang`,`aib`.`urutan` AS `urutan` FROM `m_12_ai_additional` `aib` JOIN m1_item `i` ON (`aib`.`idbarang` = `i`.bid) WHERE `aib`.idai='{idtransaksi}' ORDER BY `aib`.`urutan` ASC
```

```sql
select `ai`.`aiid` AS `aiid`,`ai`.`aicabang` AS `aicabang`,`ai`.`ailokasi` AS `ailokasi`,`ai`.`aisumber` AS `aisumber`,`ai`.`aiautonotransaksi` AS `aiautonotransaksi`,`ai`.`ainotransaksi` AS `ainotransaksi`,`ai`.`aitgl` AS `aitgl`,`ai`.`aikodepa` AS `aikodepa`,`ai`.`aikontak` AS `aikontak`,`ai`.`aikontakperson` AS `aikontakperson`,`ai`.`aikategoripos` AS `aikategoripos`,`ai`.`aiuraian` AS `aiuraian`,`ai`.`aicatatan` AS `aicatatan`,`ai`.`aistatus` AS `aistatus`,`ai`.`aistatussebelumnya` AS `aistatussebelumnya`,`ai`.`aijmlrevisi` AS `aijmlrevisi`,`ai`.`aicetakanke` AS `aicetakanke`,`ai`.`aiisclose` AS `aiisclose`,`ai`.`aiinputuser` AS `aiinputuser`,`ai`.`aiinputtgl` AS `aiinputtgl`,`ai`.`aimodifikasiuser` AS `aimodifikasiuser`,`ai`.`aimodifikasitgl` AS `aimodifikasitgl`,`ai`.`aiposting` AS `aiposting`,`ai`.`aipostingtgl` AS `aipostingtgl`,`ai`.`aicustomtext1` AS `aicustomtext1`,`ai`.`aicustomtext2` AS `aicustomtext2`,`ai`.`aicustomtext3` AS `aicustomtext3`,`ai`.`aicustomtext4` AS `aicustomtext4`,`ai`.`aicustomtext5` AS `aicustomtext5`,`ai`.`aicustomint1` AS `aicustomint1`,`ai`.`aicustomint2` AS `aicustomint2`,`ai`.`aicustomint3` AS `aicustomint3`,`ai`.`aicustomdbl1` AS `aicustomdbl1`,`ai`.`aicustomdbl2` AS `aicustomdbl2`,`ai`.`aicustomdbl3` AS `aicustomdbl3`,`ai`.`aicustomdate1` AS `aicustomdate1`,`ai`.`aicustomdate2` AS `aicustomdate2`,`ai`.`aicustomdate3` AS `aicustomdate3`,`br`.`bnama` AS `aicabangnama`,`lc`.`lnama` AS `ailokasinama`,`c`.`kkode` AS `aikontakkode`,`c`.`knama` AS `aikontaknama`,`st1`.`nama` AS `aistatusnama`,`st2`.`nama` AS `aistatussebelumnyanama`,`u1`.`unama` AS `aiinputusernama`,`u2`.`unama` AS `aimodifikasiusernama` from (((((((`m_12_ai` `ai` left join `m1_branch` `br` on((`ai`.`aicabang` = `br`.`bkode`))) left join `m1_location` `lc` on((`ai`.`ailokasi` = `lc`.`lkode`))) left join `m1_contact` `c` on((`ai`.`aikontak` = `c`.`kid`))) left join `m0_status` `st1` on((`ai`.`aistatus` = `st1`.`kode`))) left join `m0_status` `st2` on((`ai`.`aistatussebelumnya` = `st2`.`kode`))) left join `m0_user` `u1` on((`ai`.`aiinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`ai`.`aimodifikasiuser` = `u2`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_area.vb`

```sql
Insert into M_12_Area(akategori, akode, anama, acatatan, aaktif, ainputuser, ainputtgl, amodifikasiuser, amodifikasitgl, acustomtext1, acustomtext2, acustomtext3, acustomtext4, acustomtext5, acustomint1, acustomint2, acustomint3, acustomdbl1, acustomdbl2, acustomdbl3, acustomdate1, acustomdate2, acustomdate3) values{strValue2_ToString} ON DUPLICATE KEY UPDATE akategori = VALUES(akategori), anama = VALUES(anama), acatatan = VALUES(acatatan), aaktif = VALUES(aaktif), amodifikasiuser = VALUES(amodifikasiuser), amodifikasitgl = NOW(), acustomtext1 = VALUES(acustomtext1), acustomtext2 = VALUES(acustomtext2), acustomtext3 = VALUES(acustomtext3), acustomtext4 = VALUES(acustomtext4), acustomtext5 = VALUES(acustomtext5), acustomint1 = VALUES(acustomint1), acustomint2 = VALUES(acustomint2), acustomint3 = VALUES(acustomint3), acustomdbl1 = VALUES(acustomdbl1), acustomdbl2 = VALUES(acustomdbl2), acustomdbl3 = VALUES(acustomdbl3), acustomdate1 = VALUES(acustomdate1), acustomdate2 = VALUES(acustomdate2), acustomdate3 = VALUES(acustomdate3)
```

```sql
DELETE FROM M_12_Area WHERE akode = '{idtransaksi}'
```

```sql
select `a`.`akategori` AS `akategori`,`a`.`akode` AS `akode`,`a`.`anama` AS `anama`,`a`.`acatatan` AS `acatatan`,`a`.`aaktif` AS `aaktif`,`a`.`ainputuser` AS `ainputuser`,`a`.`ainputtgl` AS `ainputtgl`,`a`.`amodifikasiuser` AS `amodifikasiuser`,`a`.`amodifikasitgl` AS `amodifikasitgl`,`a`.`acustomtext1` AS `acustomtext1`,`a`.`acustomtext2` AS `acustomtext2`,`a`.`acustomtext3` AS `acustomtext3`,`a`.`acustomtext4` AS `acustomtext4`,`a`.`acustomtext5` AS `acustomtext5`,`a`.`acustomint1` AS `acustomint1`,`a`.`acustomint2` AS `acustomint2`,`a`.`acustomint3` AS `acustomint3`,`a`.`acustomdbl1` AS `acustomdbl1`,`a`.`acustomdbl2` AS `acustomdbl2`,`a`.`acustomdbl3` AS `acustomdbl3`,`a`.`acustomdate1` AS `acustomdate1`,`a`.`acustomdate2` AS `acustomdate2`,`a`.`acustomdate3` AS `acustomdate3`,`ac`.`acnama` AS `acnama`,`u1`.`unama` AS `ainputusernama`,`u2`.`unama` AS `amodifikasiusernama` from (((`m_12_area` `a` left join `m_12_area_category` `ac` on((`a`.`akategori` = `ac`.`ackode`))) left join `m0_user` `u1` on((`a`.`ainputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`a`.`amodifikasiuser` = `u2`.`userid`)))
```

```sql
SELECT COUNT(akode) FROM M_12_Area WHERE akode='{idtransaksi}'
```

```sql
SELECT ac.akode, ac.anama, 'Area' as sumber, a.anama as idterkait FROM m_12_area a JOIN M_12_Area ac ON a.akategori = ac.akode WHERE ac.akode = 'valkode' GROUP BY ac.akode, a.akode
```

```sql
DELETE FROM M_12_Area
```

```sql
Insert into M_12_Area(akategori, akode, anama, acatatan, aaktif, ainputuser, ainputtgl, amodifikasiuser, amodifikasitgl, acustomtext1, acustomtext2, acustomtext3, acustomtext4, acustomtext5, acustomint1, acustomint2, acustomint3, acustomdbl1, acustomdbl2, acustomdbl3, acustomdate1, acustomdate2, acustomdate3) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_area_category.vb`

```sql
Insert into M_12_Area_Category(ackode, acnama, accatatan, acaktif, acinputuser, acinputtgl, acmodifikasiuser, acmodifikasitgl, accustomtext1, accustomtext2, accustomtext3, accustomtext4, accustomtext5, accustomint1, accustomint2, accustomint3, accustomdbl1, accustomdbl2, accustomdbl3, accustomdate1, accustomdate2, accustomdate3) values{strValue2_ToString} ON DUPLICATE KEY UPDATE acnama = VALUES(acnama), accatatan = VALUES(accatatan), acaktif = VALUES(acaktif), acmodifikasiuser = VALUES(acmodifikasiuser), acmodifikasitgl = NOW(), accustomtext1 = VALUES(accustomtext1), accustomtext2 = VALUES(accustomtext2), accustomtext3 = VALUES(accustomtext3), accustomtext4 = VALUES(accustomtext4), accustomtext5 = VALUES(accustomtext5), accustomint1 = VALUES(accustomint1), accustomint2 = VALUES(accustomint2), accustomint3 = VALUES(accustomint3), accustomdbl1 = VALUES(accustomdbl1), accustomdbl2 = VALUES(accustomdbl2), accustomdbl3 = VALUES(accustomdbl3), accustomdate1 = VALUES(accustomdate1), accustomdate2 = VALUES(accustomdate2), accustomdate3 = VALUES(accustomdate3)
```

```sql
DELETE FROM M_12_Area_Category WHERE ackode = '{idtransaksi}'
```

```sql
select `ac`.`ackode` AS `ackode`,`ac`.`acnama` AS `acnama`,`ac`.`accatatan` AS `accatatan`,`ac`.`acaktif` AS `acaktif`,`ac`.`acinputuser` AS `acinputuser`,`ac`.`acinputtgl` AS `acinputtgl`,`ac`.`acmodifikasiuser` AS `acmodifikasiuser`,`ac`.`acmodifikasitgl` AS `acmodifikasitgl`,`ac`.`accustomtext1` AS `accustomtext1`,`ac`.`accustomtext2` AS `accustomtext2`,`ac`.`accustomtext3` AS `accustomtext3`,`ac`.`accustomtext4` AS `accustomtext4`,`ac`.`accustomtext5` AS `accustomtext5`,`ac`.`accustomint1` AS `accustomint1`,`ac`.`accustomint2` AS `accustomint2`,`ac`.`accustomint3` AS `accustomint3`,`ac`.`accustomdbl1` AS `accustomdbl1`,`ac`.`accustomdbl2` AS `accustomdbl2`,`ac`.`accustomdbl3` AS `accustomdbl3`,`ac`.`accustomdate1` AS `accustomdate1`,`ac`.`accustomdate2` AS `accustomdate2`,`ac`.`accustomdate3` AS `accustomdate3`,`u1`.`unama` AS `acinputusernama`,`u2`.`unama` AS `acmodifikasiusernama` from ((`m_12_area_category` `ac` left join `m0_user` `u1` on((`ac`.`acinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`ac`.`acmodifikasiuser` = `u2`.`userid`)))
```

```sql
SELECT COUNT(ackode) FROM m_12_area_category WHERE ackode='{idtransaksi}'
```

```sql
SELECT ac.ackode, ac.acnama, 'Area' as sumber, a.anama as idterkait FROM m_12_area a JOIN m_12_area_category ac ON a.akategori = ac.ackode WHERE ac.ackode = 'valkode' GROUP BY ac.ackode, a.akode
```

```sql
DELETE FROM M_12_Area_Category
```

```sql
Insert into M_12_Area_Category(ackode, acnama, accatatan, acaktif, acinputuser, acinputtgl, acmodifikasiuser, acmodifikasitgl, accustomtext1, accustomtext2, accustomtext3, accustomtext4, accustomtext5, accustomint1, accustomint2, accustomint3, accustomdbl1, accustomdbl2, accustomdbl3, accustomdate1, accustomdate2, accustomdate3) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_area_category_history.vb`

```sql
INSERT INTO m_12_area_category_history(SELECT 0, area.* FROM m_12_area_category area WHERE area.ackode = '{idtransaksi}')
```

```sql
select `ac`.`acidhistory` AS `acidhistory`,`ac`.`ackode` AS `ackode`,`ac`.`acnama` AS `acnama`,`ac`.`accatatan` AS `accatatan`,`ac`.`acaktif` AS `acaktif`,`ac`.`acinputuser` AS `acinputuser`,`ac`.`acinputtgl` AS `acinputtgl`,`ac`.`acmodifikasiuser` AS `acmodifikasiuser`,`ac`.`acmodifikasitgl` AS `acmodifikasitgl`,`ac`.`accustomtext1` AS `accustomtext1`,`ac`.`accustomtext2` AS `accustomtext2`,`ac`.`accustomtext3` AS `accustomtext3`,`ac`.`accustomtext4` AS `accustomtext4`,`ac`.`accustomtext5` AS `accustomtext5`,`ac`.`accustomint1` AS `accustomint1`,`ac`.`accustomint2` AS `accustomint2`,`ac`.`accustomint3` AS `accustomint3`,`ac`.`accustomdbl1` AS `accustomdbl1`,`ac`.`accustomdbl2` AS `accustomdbl2`,`ac`.`accustomdbl3` AS `accustomdbl3`,`ac`.`accustomdate1` AS `accustomdate1`,`ac`.`accustomdate2` AS `accustomdate2`,`ac`.`accustomdate3` AS `accustomdate3`,`u1`.`unama` AS `acinputusernama`,`u2`.`unama` AS `acmodifikasiusernama` from ((`m_12_area_category_history` `ac` left join `m0_user` `u1` on((`ac`.`acinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`ac`.`acmodifikasiuser` = `u2`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_area_history.vb`

```sql
INSERT INTO m_12_area_history(SELECT 0, area.* FROM m_12_area area WHERE area.akode = '{idtransaksi}')
```

```sql
select `a`.`aidhistory` AS `aidhistory`,`a`.`akategori` AS `akategori`,`a`.`akode` AS `akode`,`a`.`anama` AS `anama`,`a`.`acatatan` AS `acatatan`,`a`.`aaktif` AS `aaktif`,`a`.`ainputuser` AS `ainputuser`,`a`.`ainputtgl` AS `ainputtgl`,`a`.`amodifikasiuser` AS `amodifikasiuser`,`a`.`amodifikasitgl` AS `amodifikasitgl`,`a`.`acustomtext1` AS `acustomtext1`,`a`.`acustomtext2` AS `acustomtext2`,`a`.`acustomtext3` AS `acustomtext3`,`a`.`acustomtext4` AS `acustomtext4`,`a`.`acustomtext5` AS `acustomtext5`,`a`.`acustomint1` AS `acustomint1`,`a`.`acustomint2` AS `acustomint2`,`a`.`acustomint3` AS `acustomint3`,`a`.`acustomdbl1` AS `acustomdbl1`,`a`.`acustomdbl2` AS `acustomdbl2`,`a`.`acustomdbl3` AS `acustomdbl3`,`a`.`acustomdate1` AS `acustomdate1`,`a`.`acustomdate2` AS `acustomdate2`,`a`.`acustomdate3` AS `acustomdate3`,`ac`.`acnama` AS `acnama`,`u1`.`unama` AS `ainputusernama`,`u2`.`unama` AS `amodifikasiusernama` from (((`m_12_area_history` `a` left join `m_12_area_category` `ac` on((`a`.`akategori` = `ac`.`ackode`))) left join `m0_user` `u1` on((`a`.`ainputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`a`.`amodifikasiuser` = `u2`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_bi.vb`

```sql
SELECT COUNT(biid), binotransaksi FROM M_12_Bi WHERE biid=
```

```sql
SELECT COUNT(biid) FROM M_12_Bi WHERE binotransaksi='{notransaksi}'
```

```sql
Update M_12_Bi set bicabang = '{FixQuotes_drutama}bicabang', bilokasi = '{FixQuotes_drutama}bilokasi', bisumber = '{FixQuotes_drutama}bisumber', bikategoripos = '{FixQuotes_drutama}bikategoripos', biautonotransaksi = {drutama}biautonotransaksi, binotransaksi = '{FixQuotes_drutama}binotransaksi', bitgl = '{FixQuotes_AsFormatTanggal_drutama}bitgl', bikodepa = '{FixQuotes_drutama}bikodepa', bikontak = '{FixQuotes_drutama}bikontak', bikontakperson = '{FixQuotes_drutama}bikontakperson', biuraian = '{FixQuotes_drutama}biuraian', bicatatan = '{FixQuotes_drutama}bicatatan', bistatus = {drutama}bistatus, bistatussebelumnya = {drutama}bistatussebelumnya, bijmlrevisi = {drutama}bijmlrevisi, bicetakanke = {drutama}bicetakanke, biisclose = {drutama}biisclose, biinputuser = '{FixQuotes_drutama}biinputuser', bimodifikasiuser = '{FixQuotes_drutama}bimodifikasiuser', bimodifikasitgl = NOW(), biposting = {drutama}biposting, bipostingtgl = '{FixQuotes_AsFormatTanggal_drutama}bipostingtglyyyy-MM-dd H:mm:ss', bicustomtext1 = '{FixQuotes_drutama}bicustomtext1', bicustomtext2 = '{FixQuotes_drutama}bicustomtext2', bicustomtext3 = '{FixQuotes_drutama}bicustomtext3', bicustomtext4 = '{FixQuotes_drutama}bicustomtext4', bicustomtext5 = '{FixQuotes_drutama}bicustomtext5', bicustomint1 = {drutama}bicustomint1, bicustomint2 = {drutama}bicustomint2, bicustomint3 = {drutama}bicustomint3, bicustomdbl1 = '{FixDouble_drutama}bicustomdbl1', bicustomdbl2 = '{FixDouble_drutama}bicustomdbl2', bicustomdbl3 = '{FixDouble_drutama}bicustomdbl3', bicustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}bicustomdate1', bicustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}bicustomdate2', bicustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}bicustomdate3', bijeniskategori = '{FixQuotes_drutama}bijeniskategori', bijenis = '{FixQuotes_drutama}bijenis' where biid = {drutama}biid
```

```sql
SELECT COUNT(biid) FROM m_12_bi WHERE binotransaksi='{notransaksi}'
```

```sql
Insert into M_12_Bi (bicabang, bilokasi, bisumber, bikategoripos, biautonotransaksi, binotransaksi, bitgl, bikodepa, bikontak, bikontakperson, biuraian, bicatatan, bistatus, bistatussebelumnya, bijmlrevisi, bicetakanke, biisclose, biinputuser, biinputtgl, bimodifikasiuser, bimodifikasitgl, biposting, bipostingtgl, bicustomtext1, bicustomtext2, bicustomtext3, bicustomtext4, bicustomtext5, bicustomint1, bicustomint2, bicustomint3, bicustomdbl1, bicustomdbl2, bicustomdbl3, bicustomdate1, bicustomdate2, bicustomdate3, bijeniskategori, bijenis) values('{FixQuotes_drutama}bicabang', '{FixQuotes_drutama}bilokasi', '{FixQuotes_drutama}bisumber', '{FixQuotes_drutama}bikategoripos', {drutama}biautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}bitgl', '{FixQuotes_drutama}bikodepa', '{FixQuotes_drutama}bikontak', '{FixQuotes_drutama}bikontakperson', '{FixQuotes_drutama}biuraian', '{FixQuotes_drutama}bicatatan', {drutama}bistatus, {drutama}bistatussebelumnya, {drutama}bijmlrevisi, {drutama}bicetakanke, {drutama}biisclose, '{FixQuotes_drutama}biinputuser', NOW(), '{FixQuotes_drutama}bimodifikasiuser', '1971-01-01 00:00:00', 0, '1971-01-01 00:00:00', '{FixQuotes_drutama}bicustomtext1', '{FixQuotes_drutama}bicustomtext2', '{FixQuotes_drutama}bicustomtext3', '{FixQuotes_drutama}bicustomtext4', '{FixQuotes_drutama}bicustomtext5', {drutama}bicustomint1, {drutama}bicustomint2, {drutama}bicustomint3, '{FixDouble_drutama}bicustomdbl1', '{FixDouble_drutama}bicustomdbl2', '{FixDouble_drutama}bicustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}bicustomdate1', '{FixQuotes_AsFormatTanggal_drutama}bicustomdate2', '{FixQuotes_AsFormatTanggal_drutama}bicustomdate3', {drutama}bijeniskategori, {drutama}bijenis)
```

```sql
select biid from M_12_bi where binotransaksi='{notransaksi}' AND biinputuser= '{drutama}biinputuser' order by bimodifikasitgl desc limit 1
```

```sql
Delete from M_12_Bi_Detail where idbi =
```

```sql
Delete from M_12_Bi_Bonus where idbi =
```

```sql
SELECT bid.bikategori as kategori, bid.idbarang as idbarang, bid.operator as operator, i.bkode, (CASE bid.operator WHEN 0 THEN 'Between' WHEN 1 THEN '>=' WHEN 2 THEN 'Multiple' ELSE 'Unknown' END) as operatornama FROM m_12_bi_detail bid LEFT JOIN m1_item i ON bid.idbarang = i.bid WHERE bid.bikategori = '{FxDB_drutama}bikategoripos' AND bid.idbarang = '{FxDB_dr1}idbarang' AND bid.idbi = '{result_4}' AND bid.idbidetail <> '{FxDB_dr1}idbidetail' GROUP BY bid.operator ORDER BY bid.operator
```

```sql
Insert into M_12_Bi_Detail(idbidetail, idbi, bikategori, idbarang, operator, jml1, jml2, customtext1, customtext2, customtext3, customtext4, customtext5, customint1, customint2, customint3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, tgl1, tgl2, nopromo) values{strValue2_ToString}
```

```sql
Insert into M_12_Bi_Detail(idbidetail, idbi, bikategori, idbarang, operator, jml1, jml2, customtext1, customtext2, customtext3, customtext4, customtext5, customint1, customint2, customint3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, tgl1, tgl2, nopromo, catatan, urutan) values('{FixQuotes_dr1}idbidetail', {result_4}, '{FixQuotes_drutama}bikategoripos', '{FixQuotes_dr1}idbarang', '{FixQuotes_dr1}operator', '{FixDouble_dr1}jml1', '{FixDouble_dr1}jml2', '{FixQuotes_dr1}customtext1', '{FixQuotes_dr1}customtext2', '{FixQuotes_dr1}customtext3', '{FixQuotes_dr1}customtext4', '{FixQuotes_dr1}customtext5', {dr1}customint1, {dr1}customint2, {dr1}customint3, '{FixDouble_dr1}customdbl1', '{FixDouble_dr1}customdbl2', '{FixDouble_dr1}customdbl3', '{FixQuotes_AsFormatTanggal_dr1}customdate1', '{FixQuotes_AsFormatTanggal_dr1}customdate2', '{FixQuotes_AsFormatTanggal_dr1}customdate3', '{FixQuotes_AsFormatTanggal_dr1}tgl1', '{FixQuotes_AsFormatTanggal_dr1}tgl2', '{notransaksi}', '{FixQuotes_dr1}catatan','{FixQuotes_dr1}urutan')
```

```sql
select idbidetail from M_12_bi_detail where idbi='{result_4}' and bikategori = '{drutama}bikategoripos' AND idbarang = '{dr1}idbarang' AND operator = '{dr1}operator' AND jml1 = '{dr1}jml1' AND jml2 = '{dr1}jml2' order by idbidetail desc limit 1
```

```sql
Insert into M_12_Bi_Bonus(idbonus, idbi, idbidetail, idbarang, jml, satuan, customtext1, customtext2, customtext3, customtext4, customtext5, customint1, customint2, customint3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, urutan) values{strValue2_ToString}
```

```sql
select * from M_12_Bi_Detail where idbi = '{result_4}' order by idbi asc
```

```sql
select * from M_12_Bi_Bonus where idbi = '{result_4}' order by idbi asc
```

```sql
select pckode from m_12_pos_category WHERE pckode IN ({dtCatPOS_Rows_0_0})
```

```sql
select pckode from m_12_pos_category
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Bitgl, Binotransaksi, Bistatus FROM m_12_Bi WHERE Biid='{idtransaksi}'
```

```sql
SELECT * FROM M_12_Bi WHERE biid=
```

```sql
SELECT * FROM M_12_Bi_Detail WHERE idbi=
```

```sql
Delete from M_12_Bi_Detail WHERE idbidetail=
```

```sql
SELECT Bistatussebelumnya FROM M_12_Bi WHERE biid=
```

```sql
UPDATE M_12_Bi SET Bistatus = {nilaiStatus}, bimodifikasiuser='{userid}', bimodifikasitgl = NOW(), biposting = 0, bipostingtgl = '1971-01-01 00:00:00', Bijmlrevisi = Bijmlrevisi + 1 WHERE biid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT biid, binotransaksi FROM m_12_bi WHERE biid='{idtransaksi}'
```

```sql
DELETE FROM M_12_Bi_Detail WHERE idbi = '{idtransaksi}'
```

```sql
DELETE FROM M_12_Bi WHERE biid = '{idtransaksi}'
```

```sql
Update M_12_Bi set bicabang = '{FixQuotes_drutama}bicabang', bilokasi = '{FixQuotes_drutama}bilokasi', bisumber = '{FixQuotes_drutama}bisumber', bikategoripos = '{FixQuotes_drutama}bikategoripos', biautonotransaksi = {drutama}biautonotransaksi, binotransaksi = '{FixQuotes_drutama}binotransaksi', bitgl = '{FixQuotes_AsFormatTanggal_drutama}bitgl', bikodepa = '{FixQuotes_drutama}bikodepa', bikontak = '{FixQuotes_drutama}bikontak', bikontakperson = '{FixQuotes_drutama}bikontakperson', biuraian = '{FixQuotes_drutama}biuraian', bicatatan = '{FixQuotes_drutama}bicatatan', bistatus = {drutama}bistatus, bistatussebelumnya = {drutama}bistatussebelumnya, bijmlrevisi = {drutama}bijmlrevisi, bicetakanke = {drutama}bicetakanke, biisclose = {drutama}biisclose, biinputuser = '{FixQuotes_drutama}biinputuser', bimodifikasiuser = '{FixQuotes_drutama}bimodifikasiuser', bimodifikasitgl = NOW(), biposting = {drutama}biposting, bipostingtgl = '{FixQuotes_AsFormatTanggal_drutama}bipostingtglyyyy-MM-dd H:mm:ss', bicustomtext1 = '{FixQuotes_drutama}bicustomtext1', bicustomtext2 = '{FixQuotes_drutama}bicustomtext2', bicustomtext3 = '{FixQuotes_drutama}bicustomtext3', bicustomtext4 = '{FixQuotes_drutama}bicustomtext4', bicustomtext5 = '{FixQuotes_drutama}bicustomtext5', bicustomint1 = {drutama}bicustomint1, bicustomint2 = {drutama}bicustomint2, bicustomint3 = {drutama}bicustomint3, bicustomdbl1 = '{FixDouble_drutama}bicustomdbl1', bicustomdbl2 = '{FixDouble_drutama}bicustomdbl2', bicustomdbl3 = '{FixDouble_drutama}bicustomdbl3', bicustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}bicustomdate1', bicustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}bicustomdate2', bicustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}bicustomdate3', bijeniskategori = '{FixQuotes_drutama}bijeniskategori' where biid = {drutama}biid
```

```sql
Insert into M_12_Bi (bicabang, bilokasi, bisumber, bikategoripos, biautonotransaksi, binotransaksi, bitgl, bikodepa, bikontak, bikontakperson, biuraian, bicatatan, bistatus, bistatussebelumnya, bijmlrevisi, bicetakanke, biisclose, biinputuser, biinputtgl, bimodifikasiuser, bimodifikasitgl, biposting, bipostingtgl, bicustomtext1, bicustomtext2, bicustomtext3, bicustomtext4, bicustomtext5, bicustomint1, bicustomint2, bicustomint3, bicustomdbl1, bicustomdbl2, bicustomdbl3, bicustomdate1, bicustomdate2, bicustomdate3, bijeniskategori) values('{FixQuotes_drutama}bicabang', '{FixQuotes_drutama}bilokasi', '{FixQuotes_drutama}bisumber', '{FixQuotes_drutama}bikategoripos', {drutama}biautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}bitgl', '{FixQuotes_drutama}bikodepa', '{FixQuotes_drutama}bikontak', '{FixQuotes_drutama}bikontakperson', '{FixQuotes_drutama}biuraian', '{FixQuotes_drutama}bicatatan', {drutama}bistatus, {drutama}bistatussebelumnya, {drutama}bijmlrevisi, {drutama}bicetakanke, {drutama}biisclose, '{FixQuotes_drutama}biinputuser', NOW(), '{FixQuotes_drutama}bimodifikasiuser', '1971-01-01 00:00:00', 0, '1971-01-01 00:00:00', '{FixQuotes_drutama}bicustomtext1', '{FixQuotes_drutama}bicustomtext2', '{FixQuotes_drutama}bicustomtext3', '{FixQuotes_drutama}bicustomtext4', '{FixQuotes_drutama}bicustomtext5', {drutama}bicustomint1, {drutama}bicustomint2, {drutama}bicustomint3, '{FixDouble_drutama}bicustomdbl1', '{FixDouble_drutama}bicustomdbl2', '{FixDouble_drutama}bicustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}bicustomdate1', '{FixQuotes_AsFormatTanggal_drutama}bicustomdate2', '{FixQuotes_AsFormatTanggal_drutama}bicustomdate3', {drutama}bijeniskategori)
```

```sql
SELECT bid.bikategori as kategori, bid.idbarang as idbarang, bid.operator as operator, i.bkode, (CASE bid.operator WHEN 0 THEN 'Between' WHEN 1 THEN '>=' WHEN 2 THEN 'Multiple' ELSE 'Unknown' END) as operatornama FROM m_12_bi_detail bid JOIN m1_item i ON bid.idbarang = i.bid WHERE bid.bikategori = '{FxDB_drutama}bikategoripos' AND bid.idbarang = '{FxDB_dr1}idbarang' AND bid.idbi = '{result_4}' AND bid.idbidetail <> '{FxDB_dr1}idbidetail' GROUP BY bid.operator ORDER BY bid.operator
```

```sql
select biid from M_12_Pos_Bonus_Item where bikategori = '{drutama}bikategoripos'
```

```sql
Delete From m_12_pos_bonus_item where {strValueItemUtama_ToString}
```

```sql
Delete From m_12_pos_bonus_item_detail where {strValueItemDetail_ToString}
```

```sql
Delete From m_12_pos_bonus_item
```

```sql
Delete From m_12_pos_bonus_item_detail
```

```sql
Insert into M_12_Pos_Bonus_Item (bikategori, biidbarang, bioperator, bijml1, bijml2, bicustomtext1, bicustomtext2, bicustomtext3, bicustomtext4, bicustomtext5, bicustomint1, bicustomint2, bicustomint3, bicustomdbl1, bicustomdbl2, bicustomdbl3, bicustomdate1, bicustomdate2, bicustomdate3, bitgl1, bitgl2, binopromo) values {strValueInsertBonusItem_ToString}
```

```sql
select biid from M_12_Pos_Bonus_Item where bikategori = '{drdtl2}bikategori' AND biidbarang = '{drdtl2}idbarang' AND bioperator = '{drdtl2}operator' AND bijml1 = '{drdtl2}jml1' AND bijml2 = '{drdtl2}jml2' limit 1
```

```sql
Insert into M_12_Pos_Bonus_Item_Detail(idbi, idbarang, jml, satuan, customtext1, customtext2, customtext3, customtext4, customtext5, customint1, customint2, customint3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValueBonusItemDetail_ToString}
```

```sql
select * from m_12_pos_category
```

```sql
select * from M_12_Pos_Item where pikategori = '{drKatPos}pckode' AND piidbarang = '{drdtl}idbarang' order by pikategori asc
```

```sql
select * from M_12_Pos_Item where pikategori = '{drKatPos}pckode' AND piidbarang = '{drdtl2}idbarang' order by pikategori asc
```

```sql
select biid from M_12_Pos_Bonus_Item where bikategori = '{drKatPos}pckode' AND biidbarang = '{drdtl2}idbarang' AND bioperator = '{drdtl2}operator' AND bijml1 = '{drdtl2}jml1' AND bijml2 = '{drdtl2}jml2' limit 1
```

```sql
SELECT biid FROM m_12_pos_bonus_item WHERE bikategori='{drdetail}bikategori' AND binopromo = '{drdetail}nopromo'
```

```sql
Delete from M_12_pos_bonus_item WHERE
```

```sql
Delete from M_12_pos_bonus_item_Detail WHERE
```

```sql
SELECT biid FROM m_12_pos_bonus_item WHERE binopromo = '{drdetail}nopromo'
```

```sql
select `bib`.`idbonus` AS `idbonus`, `bib`.`idbidetail` AS `idbidetail`,`bib`.`idbi` AS `idbi`,`bib`.`idbarang` AS `idbarang`,`bib`.`jml` AS `jml`,`bib`.`satuan` AS `satuan`,`bib`.`customtext1` AS `customtext1`,`bib`.`customtext2` AS `customtext2`,`bib`.`customtext3` AS `customtext3`,`bib`.`customtext4` AS `customtext4`,`bib`.`customtext5` AS `customtext5`,`bib`.`customint1` AS `customint1`,`bib`.`customint2` AS `customint2`,`bib`.`customint3` AS `customint3`,`bib`.`customdbl1` AS `customdbl1`,`bib`.`customdbl2` AS `customdbl2`,`bib`.`customdbl3` AS `customdbl3`,`bib`.`customdate1` AS `customdate1`,`bib`.`customdate2` AS `customdate2`,`bib`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bnama` AS `namabarang`,`bib`.`urutan` AS `urutan` FROM `m_12_bi_bonus` `bib` JOIN m1_item `i` ON (`bib`.`idbarang` = `i`.bid) WHERE `bib`.idbi='{idtransaksi}' ORDER BY `bib`.`urutan` ASC
```

```sql
select `bi`.`biid` AS `biid`,`bi`.`bicabang` AS `bicabang`,`bi`.`bilokasi` AS `bilokasi`,`bi`.`bisumber` AS `bisumber`,`bi`.`biautonotransaksi` AS `biautonotransaksi`,`bi`.`binotransaksi` AS `binotransaksi`,`bi`.`bitgl` AS `bitgl`,`bi`.`bikodepa` AS `bikodepa`,`bi`.`bikontak` AS `bikontak`,`bi`.`bikontakperson` AS `bikontakperson`,`bi`.`bikategoripos` AS `bikategoripos`,`bi`.`biuraian` AS `biuraian`,`bi`.`bicatatan` AS `bicatatan`,`bi`.`bistatus` AS `bistatus`,`bi`.`bistatussebelumnya` AS `bistatussebelumnya`,`bi`.`bijmlrevisi` AS `bijmlrevisi`,`bi`.`bicetakanke` AS `bicetakanke`,`bi`.`biisclose` AS `biisclose`,`bi`.`biinputuser` AS `biinputuser`,`bi`.`biinputtgl` AS `biinputtgl`,`bi`.`bimodifikasiuser` AS `bimodifikasiuser`,`bi`.`bimodifikasitgl` AS `bimodifikasitgl`,`bi`.`biposting` AS `biposting`,`bi`.`bipostingtgl` AS `bipostingtgl`,`bi`.`bicustomtext1` AS `bicustomtext1`,`bi`.`bicustomtext2` AS `bicustomtext2`,`bi`.`bicustomtext3` AS `bicustomtext3`,`bi`.`bicustomtext4` AS `bicustomtext4`,`bi`.`bicustomtext5` AS `bicustomtext5`,`bi`.`bicustomint1` AS `bicustomint1`,`bi`.`bicustomint2` AS `bicustomint2`,`bi`.`bicustomint3` AS `bicustomint3`,`bi`.`bicustomdbl1` AS `bicustomdbl1`,`bi`.`bicustomdbl2` AS `bicustomdbl2`,`bi`.`bicustomdbl3` AS `bicustomdbl3`,`bi`.`bicustomdate1` AS `bicustomdate1`,`bi`.`bicustomdate2` AS `bicustomdate2`,`bi`.`bicustomdate3` AS `bicustomdate3`,`br`.`bnama` AS `bicabangnama`,`lc`.`lnama` AS `bilokasinama`,`c`.`kkode` AS `bikontakkode`,`c`.`knama` AS `bikontaknama`,`st1`.`nama` AS `bistatusnama`,`st2`.`nama` AS `bistatussebelumnyanama`,`u1`.`unama` AS `biinputusernama`,`u2`.`unama` AS `bimodifikasiusernama` from (((((((`m_12_bi` `bi` left join `m1_branch` `br` on((`bi`.`bicabang` = `br`.`bkode`))) left join `m1_location` `lc` on((`bi`.`bilokasi` = `lc`.`lkode`))) left join `m1_contact` `c` on((`bi`.`bikontak` = `c`.`kid`))) left join `m0_status` `st1` on((`bi`.`bistatus` = `st1`.`kode`))) left join `m0_status` `st2` on((`bi`.`bistatussebelumnya` = `st2`.`kode`))) left join `m0_user` `u1` on((`bi`.`biinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`bi`.`bimodifikasiuser` = `u2`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_bi_history.vb`

```sql
INSERT INTO m_12_bi_history(SELECT 0, bi.* FROM m_12_bi bi WHERE bi.biid = '{idtransaksi}')
```

```sql
SELECT biidhistory FROM m_12_bi_history WHERE biid = '{idtransaksi}' ORDER BY bimodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m_12_bi_detail_history (SELECT 0, '{result_4}', bi.* FROM m_12_bi_detail bi WHERE bi.idbi = '{idtransaksi}' )
```

```sql
INSERT INTO m_12_bi_bonus_history (SELECT 0, '{result_4}', bi.* FROM m_12_bi_bonus bi WHERE bi.idbi = '{idtransaksi}' )
```

```sql
select `bi`.`biidhistory` AS `biidhistory`,`bi`.`biid` AS `biid`,`bi`.`bicabang` AS `bicabang`,`bi`.`bilokasi` AS `bilokasi`,`bi`.`bisumber` AS `bisumber`,`bi`.`biautonotransaksi` AS `biautonotransaksi`,`bi`.`binotransaksi` AS `binotransaksi`,`bi`.`bitgl` AS `bitgl`,`bi`.`bikodepa` AS `bikodepa`,`bi`.`bikontak` AS `bikontak`,`bi`.`bikontakperson` AS `bikontakperson`,`bi`.`bikategoripos` AS `bikategoripos`,`bi`.`biuraian` AS `biuraian`,`bi`.`bicatatan` AS `bicatatan`,`bi`.`bistatus` AS `bistatus`,`bi`.`bistatussebelumnya` AS `bistatussebelumnya`,`bi`.`bijmlrevisi` AS `bijmlrevisi`,`bi`.`bicetakanke` AS `bicetakanke`,`bi`.`biisclose` AS `biisclose`,`bi`.`biinputuser` AS `biinputuser`,`bi`.`biinputtgl` AS `biinputtgl`,`bi`.`bimodifikasiuser` AS `bimodifikasiuser`,`bi`.`bimodifikasitgl` AS `bimodifikasitgl`,`bi`.`biposting` AS `biposting`,`bi`.`bipostingtgl` AS `bipostingtgl`,`bi`.`bicustomtext1` AS `bicustomtext1`,`bi`.`bicustomtext2` AS `bicustomtext2`,`bi`.`bicustomtext3` AS `bicustomtext3`,`bi`.`bicustomtext4` AS `bicustomtext4`,`bi`.`bicustomtext5` AS `bicustomtext5`,`bi`.`bicustomint1` AS `bicustomint1`,`bi`.`bicustomint2` AS `bicustomint2`,`bi`.`bicustomint3` AS `bicustomint3`,`bi`.`bicustomdbl1` AS `bicustomdbl1`,`bi`.`bicustomdbl2` AS `bicustomdbl2`,`bi`.`bicustomdbl3` AS `bicustomdbl3`,`bi`.`bicustomdate1` AS `bicustomdate1`,`bi`.`bicustomdate2` AS `bicustomdate2`,`bi`.`bicustomdate3` AS `bicustomdate3`,`br`.`bnama` AS `bicabangnama`,`lc`.`lnama` AS `bilokasinama`,`c`.`kkode` AS `bikontakkode`,`c`.`knama` AS `bikontaknama`,`st1`.`nama` AS `bistatusnama`,`st2`.`nama` AS `bistatussebelumnyanama`,`u1`.`unama` AS `biinputusernama`,`u2`.`unama` AS `bimodifikasiusernama` from (((((((`m_12_bi_history` `bi` left join `m1_branch` `br` on((`bi`.`bicabang` = `br`.`bkode`))) left join `m1_location` `lc` on((`bi`.`bilokasi` = `lc`.`lkode`))) left join `m1_contact` `c` on((`bi`.`bikontak` = `c`.`kid`))) left join `m0_status` `st1` on((`bi`.`bistatus` = `st1`.`kode`))) left join `m0_status` `st2` on((`bi`.`bistatussebelumnya` = `st2`.`kode`))) left join `m0_user` `u1` on((`bi`.`biinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`bi`.`bimodifikasiuser` = `u2`.`userid`)))
```

```sql
select `bi`.`biidhistory` AS `biidhistory`,`bi`.`biid` AS `biid`,`bi`.`bicabang` AS `bicabang`,`bi`.`bilokasi` AS `bilokasi`,`bi`.`bisumber` AS `bisumber`,`bi`.`bikategoripos` AS `bikategoripos`,`bi`.`biautonotransaksi` AS `biautonotransaksi`,`bi`.`binotransaksi` AS `binotransaksi`,`bi`.`bitgl` AS `bitgl`,`bi`.`bikodepa` AS `bikodepa`,`bi`.`bikontak` AS `bikontak`,`bi`.`bikontakperson` AS `bikontakperson`,`bi`.`biuraian` AS `biuraian`,`bi`.`bicatatan` AS `bicatatan`,`bi`.`bistatus` AS `bistatus`,`bi`.`bistatussebelumnya` AS `bistatussebelumnya`,`bi`.`bijmlrevisi` AS `bijmlrevisi`,`bi`.`bicetakanke` AS `bicetakanke`,`bi`.`biisclose` AS `biisclose`,`bi`.`biinputuser` AS `biinputuser`,`bi`.`biinputtgl` AS `biinputtgl`,`bi`.`bimodifikasiuser` AS `bimodifikasiuser`,`bi`.`bimodifikasitgl` AS `bimodifikasitgl`,`bi`.`biposting` AS `biposting`,`bi`.`bipostingtgl` AS `bipostingtgl`,`bi`.`bicustomtext1` AS `bicustomtext1`,`bi`.`bicustomtext2` AS `bicustomtext2`,`bi`.`bicustomtext3` AS `bicustomtext3`,`bi`.`bicustomtext4` AS `bicustomtext4`,`bi`.`bicustomtext5` AS `bicustomtext5`,`bi`.`bicustomint1` AS `bicustomint1`,`bi`.`bicustomint2` AS `bicustomint2`,`bi`.`bicustomint3` AS `bicustomint3`,`bi`.`bicustomdbl1` AS `bicustomdbl1`,`bi`.`bicustomdbl2` AS `bicustomdbl2`,`bi`.`bicustomdbl3` AS `bicustomdbl3`,`bi`.`bicustomdate1` AS `bicustomdate1`,`bi`.`bicustomdate2` AS `bicustomdate2`,`bi`.`bicustomdate3` AS `bicustomdate3`,`br`.`bnama` AS `bicabangnama`,`lc`.`lnama` AS `bilokasinama`,`c`.`kkode` AS `bikontakkode`,`c`.`knama` AS `bikontaknama`,`st1`.`nama` AS `bistatusnama`,`st2`.`nama` AS `bistatussebelumnyanama`,`u1`.`unama` AS `biinputusernama`,`u2`.`unama` AS `bimodifikasiusernama`,`pc`.`pcnama` AS `bikategoriposnama`,`bi`.`bijeniskategori` AS `bijeniskategori`,`bid`.`idhistorydetail` AS `idhistorydetail`,`bid`.`idhistory` AS `idhistory`,`bid`.`idbidetail` AS `idbidetail`,`bid`.`idbi` AS `idbi`,`bid`.`bikategori` AS `bikategori`,`bid`.`idbarang` AS `idbarang`,`bid`.`operator` AS `operator`,`bid`.`jml1` AS `jml1`,`bid`.`jml2` AS `jml2`,`bid`.`customtext1` AS `customtext1`,`bid`.`customtext2` AS `customtext2`,`bid`.`customtext3` AS `customtext3`,`bid`.`customtext4` AS `customtext4`,`bid`.`customtext5` AS `customtext5`,`bid`.`customint1` AS `customint1`,`bid`.`customint2` AS `customint2`,`bid`.`customint3` AS `customint3`,`bid`.`customdbl1` AS `customdbl1`,`bid`.`customdbl2` AS `customdbl2`,`bid`.`customdbl3` AS `customdbl3`,`bid`.`customdate1` AS `customdate1`,`bid`.`customdate2` AS `customdate2`,`bid`.`customdate3` AS `customdate3`,`bid`.`tgl1` AS `tgl1`,`bid`.`tgl2` AS `tgl2`,`bid`.`nopromo` AS `nopromo`,`i`.`bkode` AS `kodebarang`,`i`.`bnama` AS `namabarang`, `bid`.`catatan` AS `catatan`, `bid`.`urutan` AS `urutan` from ((((((((((`m_12_bi_history` `bi` join `m_12_bi_detail_history` `bid` on((`bi`.`biidhistory` = `bid`.`idhistory`))) left join `m1_branch` `br` on((`bi`.`bicabang` = `br`.`bkode`))) left join `m1_location` `lc` on((`bi`.`bilokasi` = `lc`.`lkode`))) left join `m1_contact` `c` on((`bi`.`bikontak` = `c`.`kid`))) left join `m0_status` `st1` on((`bi`.`bistatus` = `st1`.`kode`))) left join `m0_status` `st2` on((`bi`.`bistatussebelumnya` = `st2`.`kode`))) left join `m0_user` `u1` on((`bi`.`biinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`bi`.`bimodifikasiuser` = `u2`.`userid`))) left join `m1_item` `i` on((`bid`.`idbarang` = `i`.`bid`))) left join `m_12_pos_category` `pc` on((`bi`.`bikategoripos` = `pc`.`pckode`)))
```

```sql
select `bib`.`idhistorybonus` AS `idhistorybonus`, `bib`.`idhistory` AS `idhistory`, `bib`.`idbonus` AS `idbonus`, `bib`.`idbidetail` AS `idbidetail`,`bib`.`idbi` AS `idbi`,`bib`.`idbarang` AS `idbarang`,`bib`.`jml` AS `jml`,`bib`.`satuan` AS `satuan`,`bib`.`customtext1` AS `customtext1`,`bib`.`customtext2` AS `customtext2`,`bib`.`customtext3` AS `customtext3`,`bib`.`customtext4` AS `customtext4`,`bib`.`customtext5` AS `customtext5`,`bib`.`customint1` AS `customint1`,`bib`.`customint2` AS `customint2`,`bib`.`customint3` AS `customint3`,`bib`.`customdbl1` AS `customdbl1`,`bib`.`customdbl2` AS `customdbl2`,`bib`.`customdbl3` AS `customdbl3`,`bib`.`customdate1` AS `customdate1`,`bib`.`customdate2` AS `customdate2`,`bib`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bnama` AS `namabarang`,`bib`.`urutan` AS `urutan` FROM `m_12_bi_bonus_history` `bib` JOIN m1_item `i` ON (`bib`.`idbarang` = `i`.bid) WHERE `bib`.idhistory='{idtransaksi}' ORDER BY `bib`.`urutan` ASC
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_cpa.vb`

```sql
SELECT COUNT(cpaid), cpanotransaksi FROM M_12_Cpa WHERE cpaid='{result_4}' AND cpastatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(cpaid) FROM M_12_Cpa WHERE cpanotransaksi='{notransaksi}'
```

```sql
Update M_12_Cpa set cpacabang = '{FixQuotes_drutama}cpacabang', cpalokasi = '{FixQuotes_drutama}cpalokasi', cpasumber = '{FixQuotes_drutama}cpasumber', cpaautonotransaksi = {drutama}cpaautonotransaksi, cpanotransaksi = '{FixQuotes_notransaksi}', cpatgl = '{FixQuotes_AsFormatTanggal_drutama}cpatgl', cpakodepa = '{FixQuotes_drutama}cpakodepa', cpakontak = '{FixQuotes_drutama}cpakontak', cpakontakperson = '{FixQuotes_drutama}cpakontakperson', cpauraian = '{FixQuotes_drutama}cpauraian', cpacatatan = '{FixQuotes_drutama}cpacatatan', cpastatus = {drutama}cpastatus, cpastatussebelumnya = {drutama}cpastatussebelumnya, cpajmlrevisi = cpajmlrevisi+1, cpacetakanke = {drutama}cpacetakanke, cpaisclose = {drutama}cpaisclose, cpamodifikasiuser = '{FixQuotes_drutama}cpamodifikasiuser', cpamodifikasitgl = NOW(), cpacustomtext1 = '{FixQuotes_drutama}cpacustomtext1', cpacustomtext2 = '{FixQuotes_drutama}cpacustomtext2', cpacustomtext3 = '{FixQuotes_drutama}cpacustomtext3', cpacustomtext4 = '{FixQuotes_drutama}cpacustomtext4', cpacustomtext5 = '{FixQuotes_drutama}cpacustomtext5', cpacustomint1 = {drutama}cpacustomint1, cpacustomint2 = {drutama}cpacustomint2, cpacustomint3 = {drutama}cpacustomint3, cpacustomdbl1 = '{FixDouble_drutama}cpacustomdbl1', cpacustomdbl2 = '{FixDouble_drutama}cpacustomdbl2', cpacustomdbl3 = '{FixDouble_drutama}cpacustomdbl3', cpacustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}cpacustomdate1', cpacustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}cpacustomdate2', cpacustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}cpacustomdate3' where cpaid = '{drutama}cpaid'
```

```sql
SELECT COUNT(cpaid) FROM M_12_cpa WHERE cpanotransaksi='{notransaksi}'
```

```sql
Insert into M_12_cpa (cpacabang, cpalokasi, cpasumber, cpaautonotransaksi, cpanotransaksi, cpatgl, cpakodepa, cpakontak, cpakontakperson, cpauraian, cpacatatan, cpastatus, cpastatussebelumnya, cpajmlrevisi, cpacetakanke, cpaisclose, cpainputuser, cpainputtgl, cpamodifikasiuser, cpamodifikasitgl, cpaposting, cpapostingtgl, cpacustomtext1, cpacustomtext2, cpacustomtext3, cpacustomtext4, cpacustomtext5, cpacustomint1, cpacustomint2, cpacustomint3, cpacustomdbl1, cpacustomdbl2, cpacustomdbl3, cpacustomdate1, cpacustomdate2, cpacustomdate3) values('{FixQuotes_drutama}cpacabang', '{FixQuotes_drutama}cpalokasi', '{FixQuotes_drutama}cpasumber', {drutama}cpaautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}cpatgl', '{FixQuotes_drutama}cpakodepa', '{FixQuotes_drutama}cpakontak', '{FixQuotes_drutama}cpakontakperson', '{FixQuotes_drutama}cpauraian', '{FixQuotes_drutama}cpacatatan', {drutama}cpastatus, {drutama}cpastatussebelumnya, {drutama}cpajmlrevisi, {drutama}cpacetakanke, {drutama}cpaisclose, '{FixQuotes_drutama}cpainputuser', NOW(), 0, '1971-01-01 00:00:00', 0, '1971-01-01 00:00:00', '{FixQuotes_drutama}cpacustomtext1', '{FixQuotes_drutama}cpacustomtext2', '{FixQuotes_drutama}cpacustomtext3', '{FixQuotes_drutama}cpacustomtext4', '{FixQuotes_drutama}cpacustomtext5', {drutama}cpacustomint1, {drutama}cpacustomint2, {drutama}cpacustomint3, '{FixDouble_drutama}cpacustomdbl1', '{FixDouble_drutama}cpacustomdbl2', '{FixDouble_drutama}cpacustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}cpacustomdate1', '{FixQuotes_AsFormatTanggal_drutama}cpacustomdate2', '{FixQuotes_AsFormatTanggal_drutama}cpacustomdate3')
```

```sql
select cpaid from M_12_cpa where cpanotransaksi='{notransaksi}' AND cpainputuser= '{userid}' order by cpamodifikasitgl desc limit 1
```

```sql
Delete from M_12_cpa_Detail where idcpa = '{result_4}'
```

```sql
Insert into M_12_cpa_Detail(idcpadetail, idcpa, kontak, poinlama, poinmasuk, poinkeluar, poinbaru, catatan, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
UPDATE m1_contact_point cp JOIN m_12_cpa_detail cpad ON cp.cpidkontak = cpad.kontak SET cp.cppoin = cp.cppoin + cpad.poinmasuk - cpad.poinkeluar WHERE cpad.idcpa = '{result_4}'
```

```sql
INSERT INTO m1_contact_point(SELECT cpad.kontak as cpidkontak, cpad.poinmasuk - cpad.poinkeluar as cppoin, '' as cpcustomtext1, '' as cpcustomtext2, '' as cpcustomtext3, '' as cpcustomtext4, '' as cpcustomtext5, 0 as cpcustomint1, 0 as cpcustomint2, 0 as cpcustomint3, 0 as cpcustomdbl1, 0 as cpcustomdbl2, 0 as cpcustomdbl3, '1900-01-01' as cpcustomdate1, '1900-01-01' as cpcustomdate2, '1900-01-01' as cpcustomdate3 FROM m_12_cpa_detail cpad WHERE cpad.idcpa = '{result_4}') ON DUPLICATE KEY UPDATE cppoin = cppoin + VALUES(cppoin)
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT cpatgl, cpanotransaksi, cpastatus FROM M_12_Cpa WHERE cpaid='{idtransaksi}'
```

```sql
UPDATE m1_contact_point cp JOIN m_12_cpa_detail cpad ON cp.cpidkontak = cpad.kontak SET cp.cppoin = cp.cppoin - cpad.poinmasuk + cpad.poinkeluar WHERE cpad.idcpa = '{idtransaksi}'
```

```sql
INSERT INTO m1_contact_point(SELECT cpad.kontak as cpidkontak, cpad.poinkeluar - cpad.poinmasuk as cppoin, '' as cpcustomtext1, '' as cpcustomtext2, '' as cpcustomtext3, '' as cpcustomtext4, '' as cpcustomtext5, 0 as cpcustomint1, 0 as cpcustomint2, 0 as cpcustomint3, 0 as cpcustomdbl1, 0 as cpcustomdbl2, 0 as cpcustomdbl3, '1900-01-01' as cpcustomdate1, '1900-01-01' as cpcustomdate2, '1900-01-01' as cpcustomdate3 FROM m_12_cpa_detail cpad WHERE cpad.idcpa = '{idtransaksi}') ON DUPLICATE KEY UPDATE cppoin = cppoin + VALUES(cppoin)
```

```sql
UPDATE M_12_Cpa SET cpastatus = {nilaiStatus}, cpamodifikasiuser='{userid}', cpamodifikasitgl = NOW(), cpaposting = 0, cpapostingtgl = '1971-01-01 00:00:00', cpajmlrevisi = cpajmlrevisi + 1 WHERE cpaid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT cpaid, cpanotransaksi FROM M_12_Cpa WHERE cpaid='{idtransaksi}'
```

```sql
DELETE FROM M_12_Cpa_Detail WHERE idcpa='{idtransaksi}'
```

```sql
DELETE FROM M_12_Cpa WHERE cpaid='{idtransaksi}'
```

```sql
select `cpa`.`cpaid` AS `cpaid`,`cpa`.`cpacabang` AS `cpacabang`,`cpa`.`cpalokasi` AS `cpalokasi`,`cpa`.`cpasumber` AS `cpasumber`,`cpa`.`cpaautonotransaksi` AS `cpaautonotransaksi`,`cpa`.`cpanotransaksi` AS `cpanotransaksi`,`cpa`.`cpatgl` AS `cpatgl`,`cpa`.`cpakodepa` AS `cpakodepa`,`cpa`.`cpakontak` AS `cpakontak`,`cpa`.`cpakontakperson` AS `cpakontakperson`,`cpa`.`cpauraian` AS `cpauraian`,`cpa`.`cpacatatan` AS `cpacatatan`,`cpa`.`cpastatus` AS `cpastatus`,`cpa`.`cpastatussebelumnya` AS `cpastatussebelumnya`,`cpa`.`cpajmlrevisi` AS `cpajmlrevisi`,`cpa`.`cpacetakanke` AS `cpacetakanke`,`cpa`.`cpaisclose` AS `cpaisclose`,`cpa`.`cpainputuser` AS `cpainputuser`,`cpa`.`cpainputtgl` AS `cpainputtgl`,`cpa`.`cpamodifikasiuser` AS `cpamodifikasiuser`,`cpa`.`cpamodifikasitgl` AS `cpamodifikasitgl`,`cpa`.`cpaposting` AS `cpaposting`,`cpa`.`cpapostingtgl` AS `cpapostingtgl`,`cpa`.`cpacustomtext1` AS `cpacustomtext1`,`cpa`.`cpacustomtext2` AS `cpacustomtext2`,`cpa`.`cpacustomtext3` AS `cpacustomtext3`,`cpa`.`cpacustomtext4` AS `cpacustomtext4`,`cpa`.`cpacustomtext5` AS `cpacustomtext5`,`cpa`.`cpacustomint1` AS `cpacustomint1`,`cpa`.`cpacustomint2` AS `cpacustomint2`,`cpa`.`cpacustomint3` AS `cpacustomint3`,`cpa`.`cpacustomdbl1` AS `cpacustomdbl1`,`cpa`.`cpacustomdbl2` AS `cpacustomdbl2`,`cpa`.`cpacustomdbl3` AS `cpacustomdbl3`,`cpa`.`cpacustomdate1` AS `cpacustomdate1`,`cpa`.`cpacustomdate2` AS `cpacustomdate2`,`cpa`.`cpacustomdate3` AS `cpacustomdate3`,`br`.`bnama` AS `cpacabangnama`,`lc`.`lnama` AS `cpalokasinama`,`c1`.`kkode` AS `cpakontakkode`,`c1`.`knama` AS `cpakontaknama`,`st1`.`nama` AS `cpastatusnama`,`st2`.`nama` AS `cpastatussebelumnyanama`,`u1`.`unama` AS `cpainputusernama`,`u2`.`unama` AS `cpamodifikasiusernama`,`cpad`.`idcpadetail` AS `idcpadetail`,`cpad`.`idcpa` AS `idcpa`,`cpad`.`kontak` AS `kontak`,`cpad`.`poinlama` AS `poinlama`,`cpad`.`poinmasuk` AS `poinmasuk`,`cpad`.`poinkeluar` AS `poinkeluar`,`cpad`.`poinbaru` AS `poinbaru`,`cpad`.`catatan` AS `catatan`,`cpad`.`urutan` AS `urutan`,`cpad`.`isclose` AS `isclose`,`cpad`.`customtext1` AS `customtext1`,`cpad`.`customtext2` AS `customtext2`,`cpad`.`customtext3` AS `customtext3`,`cpad`.`customdbl1` AS `customdbl1`,`cpad`.`customdbl2` AS `customdbl2`,`cpad`.`customdbl3` AS `customdbl3`,`cpad`.`customdate1` AS `customdate1`,`cpad`.`customdate2` AS `customdate2`,`cpad`.`customdate3` AS `customdate3`,`c2`.`kkode` AS `kontakkode`,`c2`.`knama` AS `kontaknama`,`c2`.`kkategori` AS `kontakkategori`,`cc`.`ccnama` AS `kontakkategorinama`,`c2`.`kkategorisalesman` AS `kontakkategorisalesman`,`sc`.`scnama` AS `kontakkategorisalesmannama`,`c2`.`karea` AS `kontakarea`,`a`.`anama` AS `kontakareanama` from ((((((((((((`m_12_cpa` `cpa` join `m0_status` `st1` on((`cpa`.`cpastatus` = `st1`.`kode`))) join `m0_status` `st2` on((`cpa`.`cpastatussebelumnya` = `st2`.`kode`))) join `m_12_cpa_detail` `cpad` on((`cpa`.`cpaid` = `cpad`.`idcpa`))) left join `m1_branch` `br` on((`cpa`.`cpacabang` = `br`.`bkode`))) left join `m1_location` `lc` on((`cpa`.`cpalokasi` = `lc`.`lkode`))) left join `m1_contact` `c1` on((`cpa`.`cpakontak` = `c1`.`kid`))) left join `m0_user` `u1` on((`cpa`.`cpainputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`cpa`.`cpamodifikasiuser` = `u2`.`userid`))) left join `m1_contact` `c2` on((`cpad`.`kontak` = `c2`.`kid`))) left join `m1_contact_category` `cc` on((`c2`.`kkategori` = `cc`.`cckode`))) left join `m1_salesman_category` `sc` on((`c2`.`kkategorisalesman` = `sc`.`sckode`))) left join `m1_area` `a` on((`c2`.`karea` = `a`.`akode`)))
```

```sql
select `cpa`.`cpaid` AS `cpaid`,`cpa`.`cpacabang` AS `cpacabang`,`cpa`.`cpalokasi` AS `cpalokasi`,`cpa`.`cpasumber` AS `cpasumber`,`cpa`.`cpaautonotransaksi` AS `cpaautonotransaksi`,`cpa`.`cpanotransaksi` AS `cpanotransaksi`,`cpa`.`cpatgl` AS `cpatgl`,`cpa`.`cpakodepa` AS `cpakodepa`,`cpa`.`cpakontak` AS `cpakontak`,`cpa`.`cpakontakperson` AS `cpakontakperson`,`cpa`.`cpauraian` AS `cpauraian`,`cpa`.`cpacatatan` AS `cpacatatan`,`cpa`.`cpastatus` AS `cpastatus`,`cpa`.`cpastatussebelumnya` AS `cpastatussebelumnya`,`cpa`.`cpajmlrevisi` AS `cpajmlrevisi`,`cpa`.`cpacetakanke` AS `cpacetakanke`,`cpa`.`cpaisclose` AS `cpaisclose`,`cpa`.`cpainputuser` AS `cpainputuser`,`cpa`.`cpainputtgl` AS `cpainputtgl`,`cpa`.`cpamodifikasiuser` AS `cpamodifikasiuser`,`cpa`.`cpamodifikasitgl` AS `cpamodifikasitgl`,`cpa`.`cpaposting` AS `cpaposting`,`cpa`.`cpapostingtgl` AS `cpapostingtgl`,`br`.`bnama` AS `cpacabangnama`,`lc`.`lnama` AS `cpalokasinama`,`c1`.`kkode` AS `cpakontakkode`,`c1`.`knama` AS `cpakontaknama`,`st1`.`nama` AS `cpastatusnama`,`st2`.`nama` AS `cpastatussebelumnyanama`,`u1`.`unama` AS `cpainputusernama`,`u2`.`unama` AS `cpamodifikasiusernama` from (((((((`m_12_cpa` `cpa` join `m0_status` `st1` on((`cpa`.`cpastatus` = `st1`.`kode`))) join `m0_status` `st2` on((`cpa`.`cpastatussebelumnya` = `st2`.`kode`))) left join `m1_branch` `br` on((`cpa`.`cpacabang` = `br`.`bkode`))) left join `m1_location` `lc` on((`cpa`.`cpalokasi` = `lc`.`lkode`))) left join `m1_contact` `c1` on((`cpa`.`cpakontak` = `c1`.`kid`))) left join `m0_user` `u1` on((`cpa`.`cpainputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`cpa`.`cpamodifikasiuser` = `u2`.`userid`)))
```

```sql
select `cpa`.`cpaid` AS `cpaid`, `cpa`.`cpacabang` AS `cpacabang`, `cpa`.`cpalokasi` AS `cpalokasi`, `cpa`.`cpasumber` AS `cpasumber`, `cpa`.`cpaautonotransaksi` AS `cpaautonotransaksi`, `cpa`.`cpanotransaksi` AS `cpanotransaksi`, `cpa`.`cpatgl` AS `cpatgl`, `cpa`.`cpakodepa` AS `cpakodepa`, `cpa`.`cpakontak` AS `cpakontak`, `cpa`.`cpakontakperson` AS `cpakontakperson`, `cpa`.`cpauraian` AS `cpauraian`, `cpa`.`cpacatatan` AS `cpacatatan`, `cpa`.`cpastatus` AS `cpastatus`, `cpa`.`cpastatussebelumnya` AS `cpastatussebelumnya`, `cpa`.`cpajmlrevisi` AS `cpajmlrevisi`, `cpa`.`cpacetakanke` AS `cpacetakanke`, `cpa`.`cpaisclose` AS `cpaisclose`, `cpa`.`cpainputuser` AS `cpainputuser`, `cpa`.`cpainputtgl` AS `cpainputtgl`, `cpa`.`cpamodifikasiuser` AS `cpamodifikasiuser`, `cpa`.`cpamodifikasitgl` AS `cpamodifikasitgl`, `cpa`.`cpaposting` AS `cpaposting`, `cpa`.`cpapostingtgl` AS `cpapostingtgl`, `br`.`bnama` AS `cpacabangnama`, `lc`.`lnama` AS `cpalokasinama`, `c1`.`kkode` AS `cpakontakkode`, `c1`.`knama` AS `cpakontaknama`, `st1`.`nama` AS `cpastatusnama`, `st2`.`nama` AS `cpastatussebelumnyanama`, `u1`.`unama` AS `cpainputusernama`, `u2`.`unama` AS `cpamodifikasiusernama` from `m_12_cpa` `cpa` join m0_userlogin ul on ul.ulid = '{FixQuotes_paramSplit_0}' join m0_user_branch ub on ul.uluser = ub.userid and cpa.cpacabang = ub.cabang join m0_user_location uloc on ul.uluser = uloc.userid and cpa.cpalokasi = uloc.lokasi join `m0_status` `st1` on `cpa`.`cpastatus` = `st1`.`kode` join `m0_status` `st2` on `cpa`.`cpastatussebelumnya` = `st2`.`kode` left join `m1_branch` `br` on `cpa`.`cpacabang` = `br`.`bkode` left join `m1_location` `lc` on `cpa`.`cpalokasi` = `lc`.`lkode` left join `m1_contact` `c1` on `cpa`.`cpakontak` = `c1`.`kid` left join `m0_user` `u1` on `cpa`.`cpainputuser` = `u1`.`userid` left join `m0_user` `u2` on `cpa`.`cpamodifikasiuser` = `u2`.`userid`
```

```sql
select `cpa`.`cpaid` AS `cpaid`, `cpa`.`cpacabang` AS `cpacabang`, `cpa`.`cpalokasi` AS `cpalokasi`, `cpa`.`cpasumber` AS `cpasumber`, `cpa`.`cpaautonotransaksi` AS `cpaautonotransaksi`, `cpa`.`cpanotransaksi` AS `cpanotransaksi`, `cpa`.`cpatgl` AS `cpatgl`, `cpa`.`cpakodepa` AS `cpakodepa`, `cpa`.`cpakontak` AS `cpakontak`, `cpa`.`cpakontakperson` AS `cpakontakperson`, `cpa`.`cpauraian` AS `cpauraian`, `cpa`.`cpacatatan` AS `cpacatatan`, `cpa`.`cpastatus` AS `cpastatus`, `cpa`.`cpastatussebelumnya` AS `cpastatussebelumnya`, `cpa`.`cpajmlrevisi` AS `cpajmlrevisi`, `cpa`.`cpacetakanke` AS `cpacetakanke`, `cpa`.`cpaisclose` AS `cpaisclose`, `cpa`.`cpainputuser` AS `cpainputuser`, `cpa`.`cpainputtgl` AS `cpainputtgl`, `cpa`.`cpamodifikasiuser` AS `cpamodifikasiuser`, `cpa`.`cpamodifikasitgl` AS `cpamodifikasitgl`, `cpa`.`cpaposting` AS `cpaposting`, `cpa`.`cpapostingtgl` AS `cpapostingtgl`, `br`.`bnama` AS `cpacabangnama`, `lc`.`lnama` AS `cpalokasinama`, `c1`.`kkode` AS `cpakontakkode`, `c1`.`knama` AS `cpakontaknama`, `st1`.`nama` AS `cpastatusnama`, `st2`.`nama` AS `cpastatussebelumnyanama`, `u1`.`unama` AS `cpainputusernama`, `u2`.`unama` AS `cpamodifikasiusernama` from `m_12_cpa` `cpa` join m0_userlogin ul on ul.ulid = '{FixQuotes_paramSplit_0}' join `m0_status` `st1` on `cpa`.`cpastatus` = `st1`.`kode` join `m0_status` `st2` on `cpa`.`cpastatussebelumnya` = `st2`.`kode` left join m0_user_branch ub on ul.uluser = ub.userid left join m0_user_location uloc on ul.uluser = uloc.userid left join `m1_branch` `br` on `cpa`.`cpacabang` = `br`.`bkode` left join `m1_location` `lc` on `cpa`.`cpalokasi` = `lc`.`lkode` left join `m1_contact` `c1` on `cpa`.`cpakontak` = `c1`.`kid` left join `m0_user` `u1` on `cpa`.`cpainputuser` = `u1`.`userid` left join `m0_user` `u2` on `cpa`.`cpamodifikasiuser` = `u2`.`userid`
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_cpa_history.vb`

```sql
INSERT INTO M_12_Cpa_history(SELECT 0, cpa.* FROM M_12_Cpa cpa WHERE cpa.cpaid = '{idtransaksi}')
```

```sql
SELECT cpaidhistory FROM M_12_Cpa_history WHERE cpaid = '{idtransaksi}' ORDER BY cpamodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO M_12_Cpa_detail_history (SELECT 0, '{result_4}', cpa.* FROM M_12_Cpa_detail cpa WHERE cpa.idcpa = '{idtransaksi}' )
```

```sql
select `cpa`.`cpaidhistory` AS `cpaidhistory`,`cpa`.`cpaid` AS `cpaid`,`cpa`.`cpacabang` AS `cpacabang`,`cpa`.`cpalokasi` AS `cpalokasi`,`cpa`.`cpasumber` AS `cpasumber`,`cpa`.`cpaautonotransaksi` AS `cpaautonotransaksi`,`cpa`.`cpanotransaksi` AS `cpanotransaksi`,`cpa`.`cpatgl` AS `cpatgl`,`cpa`.`cpakodepa` AS `cpakodepa`,`cpa`.`cpakontak` AS `cpakontak`,`cpa`.`cpakontakperson` AS `cpakontakperson`,`cpa`.`cpauraian` AS `cpauraian`,`cpa`.`cpacatatan` AS `cpacatatan`,`cpa`.`cpastatus` AS `cpastatus`,`cpa`.`cpastatussebelumnya` AS `cpastatussebelumnya`,`cpa`.`cpajmlrevisi` AS `cpajmlrevisi`,`cpa`.`cpacetakanke` AS `cpacetakanke`,`cpa`.`cpaisclose` AS `cpaisclose`,`cpa`.`cpainputuser` AS `cpainputuser`,`cpa`.`cpainputtgl` AS `cpainputtgl`,`cpa`.`cpamodifikasiuser` AS `cpamodifikasiuser`,`cpa`.`cpamodifikasitgl` AS `cpamodifikasitgl`,`cpa`.`cpaposting` AS `cpaposting`,`cpa`.`cpapostingtgl` AS `cpapostingtgl`,`br`.`bnama` AS `cpacabangnama`,`lc`.`lnama` AS `cpalokasinama`,`c1`.`kkode` AS `cpakontakkode`,`c1`.`knama` AS `cpakontaknama`,`st1`.`nama` AS `cpastatusnama`,`st2`.`nama` AS `cpastatussebelumnyanama`,`u1`.`unama` AS `cpainputusernama`,`u2`.`unama` AS `cpamodifikasiusernama` from (((((((`m_12_cpa_history` `cpa` join `m0_status` `st1` on((`cpa`.`cpastatus` = `st1`.`kode`))) join `m0_status` `st2` on((`cpa`.`cpastatussebelumnya` = `st2`.`kode`))) left join `m1_branch` `br` on((`cpa`.`cpacabang` = `br`.`bkode`))) left join `m1_location` `lc` on((`cpa`.`cpalokasi` = `lc`.`lkode`))) left join `m1_contact` `c1` on((`cpa`.`cpakontak` = `c1`.`kid`))) left join `m0_user` `u1` on((`cpa`.`cpainputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`cpa`.`cpamodifikasiuser` = `u2`.`userid`)))
```

```sql
select `cpa`.`cpaidhistory` AS `cpaidhistory`,`cpa`.`cpaid` AS `cpaid`,`cpa`.`cpacabang` AS `cpacabang`,`cpa`.`cpalokasi` AS `cpalokasi`,`cpa`.`cpasumber` AS `cpasumber`,`cpa`.`cpaautonotransaksi` AS `cpaautonotransaksi`,`cpa`.`cpanotransaksi` AS `cpanotransaksi`,`cpa`.`cpatgl` AS `cpatgl`,`cpa`.`cpakodepa` AS `cpakodepa`,`cpa`.`cpakontak` AS `cpakontak`,`cpa`.`cpakontakperson` AS `cpakontakperson`,`cpa`.`cpauraian` AS `cpauraian`,`cpa`.`cpacatatan` AS `cpacatatan`,`cpa`.`cpastatus` AS `cpastatus`,`cpa`.`cpastatussebelumnya` AS `cpastatussebelumnya`,`cpa`.`cpajmlrevisi` AS `cpajmlrevisi`,`cpa`.`cpacetakanke` AS `cpacetakanke`,`cpa`.`cpaisclose` AS `cpaisclose`,`cpa`.`cpainputuser` AS `cpainputuser`,`cpa`.`cpainputtgl` AS `cpainputtgl`,`cpa`.`cpamodifikasiuser` AS `cpamodifikasiuser`,`cpa`.`cpamodifikasitgl` AS `cpamodifikasitgl`,`cpa`.`cpaposting` AS `cpaposting`,`cpa`.`cpapostingtgl` AS `cpapostingtgl`,`cpa`.`cpacustomtext1` AS `cpacustomtext1`,`cpa`.`cpacustomtext2` AS `cpacustomtext2`,`cpa`.`cpacustomtext3` AS `cpacustomtext3`,`cpa`.`cpacustomtext4` AS `cpacustomtext4`,`cpa`.`cpacustomtext5` AS `cpacustomtext5`,`cpa`.`cpacustomint1` AS `cpacustomint1`,`cpa`.`cpacustomint2` AS `cpacustomint2`,`cpa`.`cpacustomint3` AS `cpacustomint3`,`cpa`.`cpacustomdbl1` AS `cpacustomdbl1`,`cpa`.`cpacustomdbl2` AS `cpacustomdbl2`,`cpa`.`cpacustomdbl3` AS `cpacustomdbl3`,`cpa`.`cpacustomdate1` AS `cpacustomdate1`,`cpa`.`cpacustomdate2` AS `cpacustomdate2`,`cpa`.`cpacustomdate3` AS `cpacustomdate3`,`br`.`bnama` AS `cpacabangnama`,`lc`.`lnama` AS `cpalokasinama`,`c1`.`kkode` AS `cpakontakkode`,`c1`.`knama` AS `cpakontaknama`,`st1`.`nama` AS `cpastatusnama`,`st2`.`nama` AS `cpastatussebelumnyanama`,`u1`.`unama` AS `cpainputusernama`,`u2`.`unama` AS `cpamodifikasiusernama`,`cpad`.`idhistorydetail` AS `idhistorydetail`,`cpad`.`idhistory` AS `idhistory`,`cpad`.`idcpadetail` AS `idcpadetail`,`cpad`.`idcpa` AS `idcpa`,`cpad`.`kontak` AS `kontak`,`cpad`.`poinlama` AS `poinlama`,`cpad`.`poinmasuk` AS `poinmasuk`,`cpad`.`poinkeluar` AS `poinkeluar`,`cpad`.`poinbaru` AS `poinbaru`,`cpad`.`catatan` AS `catatan`,`cpad`.`urutan` AS `urutan`,`cpad`.`isclose` AS `isclose`,`cpad`.`customtext1` AS `customtext1`,`cpad`.`customtext2` AS `customtext2`,`cpad`.`customtext3` AS `customtext3`,`cpad`.`customdbl1` AS `customdbl1`,`cpad`.`customdbl2` AS `customdbl2`,`cpad`.`customdbl3` AS `customdbl3`,`cpad`.`customdate1` AS `customdate1`,`cpad`.`customdate2` AS `customdate2`,`cpad`.`customdate3` AS `customdate3`,`c2`.`kkode` AS `kontakkode`,`c2`.`knama` AS `kontaknama`,`c2`.`kkategori` AS `kontakkategori`,`cc`.`ccnama` AS `kontakkategorinama`,`c2`.`kkategorisalesman` AS `kontakkategorisalesman`,`sc`.`scnama` AS `kontakkategorisalesmannama`,`c2`.`karea` AS `kontakarea`,`a`.`anama` AS `kontakareanama` from ((((((((((((`m_12_cpa_history` `cpa` join `m0_status` `st1` on((`cpa`.`cpastatus` = `st1`.`kode`))) join `m0_status` `st2` on((`cpa`.`cpastatussebelumnya` = `st2`.`kode`))) join `m_12_cpa_detail_history` `cpad` on((`cpa`.`cpaidhistory` = `cpad`.`idhistory`))) left join `m1_branch` `br` on((`cpa`.`cpacabang` = `br`.`bkode`))) left join `m1_location` `lc` on((`cpa`.`cpalokasi` = `lc`.`lkode`))) left join `m1_contact` `c1` on((`cpa`.`cpakontak` = `c1`.`kid`))) left join `m0_user` `u1` on((`cpa`.`cpainputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`cpa`.`cpamodifikasiuser` = `u2`.`userid`))) left join `m1_contact` `c2` on((`cpad`.`kontak` = `c2`.`kid`))) left join `m1_contact_category` `cc` on((`c2`.`kkategori` = `cc`.`cckode`))) left join `m1_salesman_category` `sc` on((`c2`.`kkategorisalesman` = `sc`.`sckode`))) left join `m1_area` `a` on((`c2`.`karea` = `a`.`akode`)))
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_di.vb`

```sql
SELECT COUNT(diid), dinotransaksi FROM M_12_Di WHERE diid=
```

```sql
SELECT COUNT(diid) FROM M_12_Di WHERE dinotransaksi='{notransaksi}'
```

```sql
Update M_12_Di set dicabang = '{FixQuotes_drutama}dicabang', dilokasi = '{FixQuotes_drutama}dilokasi', disumber = '{FixQuotes_drutama}disumber', dikategoripos = '{FixQuotes_drutama}dikategoripos', diautonotransaksi = {drutama}diautonotransaksi, dinotransaksi = '{FixQuotes_drutama}dinotransaksi', ditgl = '{FixQuotes_AsFormatTanggal_drutama}ditgl', dikodepa = '{FixQuotes_drutama}dikodepa', dikontak = '{FixQuotes_drutama}dikontak', dikontakperson = '{FixQuotes_drutama}dikontakperson', diuraian = '{FixQuotes_drutama}diuraian', dicatatan = '{FixQuotes_drutama}dicatatan', distatus = {drutama}distatus, distatussebelumnya = {drutama}distatussebelumnya, dijmlrevisi = {drutama}dijmlrevisi, dicetakanke = {drutama}dicetakanke, diisclose = {drutama}diisclose, diinputuser = '{FixQuotes_drutama}diinputuser', diinputtgl = '{FixQuotes_AsFormatTanggal_drutama}diinputtglyyyy-MM-dd H:mm:ss', dimodifikasiuser = '{FixQuotes_drutama}dimodifikasiuser', dimodifikasitgl = NOW(), diposting = {drutama}diposting, dipostingtgl = '{FixQuotes_AsFormatTanggal_drutama}dipostingtglyyyy-MM-dd H:mm:ss', dicustomtext1 = '{FixQuotes_drutama}dicustomtext1', dicustomtext2 = '{FixQuotes_drutama}dicustomtext2', dicustomtext3 = '{FixQuotes_drutama}dicustomtext3', dicustomtext4 = '{FixQuotes_drutama}dicustomtext4', dicustomtext5 = '{FixQuotes_drutama}dicustomtext5', dicustomint1 = {drutama}dicustomint1, dicustomint2 = {drutama}dicustomint2, dicustomint3 = {drutama}dicustomint3, dicustomdbl1 = '{FixDouble_drutama}dicustomdbl1', dicustomdbl2 = '{FixDouble_drutama}dicustomdbl2', dicustomdbl3 = '{FixDouble_drutama}dicustomdbl3', dicustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}dicustomdate1', dicustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}dicustomdate2', dicustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}dicustomdate3', dijeniskategori = '{FixQuotes_drutama}dijeniskategori' where diid = {drutama}diid
```

```sql
SELECT COUNT(diid) FROM m_12_di WHERE dinotransaksi='{notransaksi}'
```

```sql
Insert into M_12_di (dicabang, dilokasi, disumber, dikategoripos, diautonotransaksi, dinotransaksi, ditgl, dikodepa, dikontak, dikontakperson, diuraian, dicatatan, distatus, distatussebelumnya, dijmlrevisi, dicetakanke, diisclose, diinputuser, diinputtgl, dimodifikasiuser, dimodifikasitgl, diposting, dipostingtgl, dicustomtext1, dicustomtext2, dicustomtext3, dicustomtext4, dicustomtext5, dicustomint1, dicustomint2, dicustomint3, dicustomdbl1, dicustomdbl2, dicustomdbl3, dicustomdate1, dicustomdate2, dicustomdate3, dijeniskategori) values('{FixQuotes_drutama}dicabang', '{FixQuotes_drutama}dilokasi', '{FixQuotes_drutama}disumber', '{FixQuotes_drutama}dikategoripos', {drutama}diautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}ditgl', '{FixQuotes_drutama}dikodepa', '{FixQuotes_drutama}dikontak', '{FixQuotes_drutama}dikontakperson', '{FixQuotes_drutama}diuraian', '{FixQuotes_drutama}dicatatan', {drutama}distatus, {drutama}distatussebelumnya, {drutama}dijmlrevisi, {drutama}dicetakanke, {drutama}diisclose, '{FixQuotes_drutama}diinputuser', NOW(), '{FixQuotes_drutama}dimodifikasiuser', '{FixQuotes_AsFormatTanggal_drutama}dimodifikasitglyyyy-MM-dd H:mm:ss', 0, '1971-01-01 00:00:00', '{FixQuotes_drutama}dicustomtext1', '{FixQuotes_drutama}dicustomtext2', '{FixQuotes_drutama}dicustomtext3', '{FixQuotes_drutama}dicustomtext4', '{FixQuotes_drutama}dicustomtext5', {drutama}dicustomint1, {drutama}dicustomint2, {drutama}dicustomint3, '{FixDouble_drutama}dicustomdbl1', '{FixDouble_drutama}dicustomdbl2', '{FixDouble_drutama}dicustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}dicustomdate1', '{FixQuotes_AsFormatTanggal_drutama}dicustomdate2', '{FixQuotes_AsFormatTanggal_drutama}dicustomdate3', '{FixQuotes_drutama}dijeniskategori')
```

```sql
select diid from M_12_di where dinotransaksi='{notransaksi}' AND diinputuser= '{drutama}diinputuser' order by dimodifikasitgl desc limit 1
```

```sql
Delete from M_12_Di_Detail where iddi =
```

```sql
SELECT did.dikategori as kategori, did.idbarang as idbarang, did.operator as operator, i.bkode, (CASE did.operator WHEN 0 THEN 'Between' WHEN 1 THEN '>=' WHEN 2 THEN 'Multiple' ELSE 'Unknown' END) as operatornama FROM m_12_di_detail did JOIN m1_item i ON did.idbarang = i.bid WHERE did.dikategori = '{FxDB_drutama}dikategoripos' AND did.idbarang = '{FxDB_dr1}idbarang' AND did.iddi = '{result_4}' AND did.iddidetail <> '{FxDB_dr1}iddidetail' GROUP BY did.operator ORDER BY did.operator
```

```sql
Insert into M_12_Di_Detail(iddidetail, iddi, dikategori, idbarang, operator, jml1, jml2, kriteria, nilai, tgl1, tgl2, jam1, jam2, catatan, urutan, customtext1, customtext2, customtext3, customtext4, customtext5, customint1, customint2, customint3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, nopromo) values{strValue2_ToString}
```

```sql
Delete From m_12_pos_discount_item where dikategori = '{drutama}dikategoripos'
```

```sql
Delete From m_12_pos_discount_item where dikategori IN ({dtCatPOS_Rows_0_0})
```

```sql
Delete From m_12_pos_discount_item
```

```sql
select * from M_12_Di_Detail where iddi = '{result_4}' order by iddi asc
```

```sql
Insert into M_12_Pos_Discount_Item(dikategori, diidbarang, dioperator, dijml1, dijml2, dikriteria, dinilai, ditgl1, ditgl2, dijam1, dijam2, dicustomtext1, dicustomtext2, dicustomtext3, dicustomtext4, dicustomtext5, dicustomint1, dicustomint2, dicustomint3, dicustomdbl1, dicustomdbl2, dicustomdbl3, dicustomdate1, dicustomdate2, dicustomdate3, dinopromo) values{strInsertDiscountItem_ToString}
```

```sql
select pckode from m_12_pos_category WHERE pckode IN ({dtCatPOS_Rows_0_0})
```

```sql
select piidbarang from M_12_Pos_Item where pikategori = '{drKatPos}pckode' AND piidbarang = '{drdtl}idbarang' order by pikategori asc
```

```sql
select pckode from m_12_pos_category
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Ditgl, Dinotransaksi, Distatus FROM m_12_Di WHERE Diid='{idtransaksi}'
```

```sql
SELECT * FROM M_12_Di WHERE diid=
```

```sql
SELECT * FROM M_12_Di_Detail WHERE iddi=
```

```sql
Delete from M_12_pos_discount_item WHERE dikategori='{drdetail}dikategori' AND dinopromo = '{drdetail}nopromo'
```

```sql
Delete from M_12_pos_discount_item WHERE dinopromo = '{drdetail}nopromo'
```

```sql
Delete from M_12_Bi_Detail WHERE idbidetail=
```

```sql
SELECT Bistatussebelumnya FROM M_12_Bi WHERE biid=
```

```sql
UPDATE M_12_Di SET Distatus = {nilaiStatus}, dimodifikasiuser='{userid}', dimodifikasitgl = NOW(), diposting = 0, dipostingtgl = '1971-01-01 00:00:00', Dijmlrevisi = Dijmlrevisi + 1 WHERE diid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT diid, dinotransaksi FROM m_12_di WHERE diid='{idtransaksi}'
```

```sql
DELETE FROM M_12_Di_Detail WHERE iddi = '{idtransaksi}'
```

```sql
DELETE FROM M_12_Di WHERE diid = '{idtransaksi}'
```

```sql
select * from m_12_pos_category
```

```sql
select * from M_12_Pos_Item where pikategori = '{drKatPos}pckode' AND piidbarang = '{drdtl}idbarang' order by pikategori asc
```

```sql
select `di`.`diid` AS `diid`,`di`.`dicabang` AS `dicabang`,`di`.`dilokasi` AS `dilokasi`,`di`.`disumber` AS `disumber`,`di`.`diautonotransaksi` AS `diautonotransaksi`,`di`.`dinotransaksi` AS `dinotransaksi`,`di`.`ditgl` AS `ditgl`,`di`.`dikodepa` AS `dikodepa`,`di`.`dikontak` AS `dikontak`,`di`.`dikontakperson` AS `dikontakperson`,`di`.`dikategoripos` AS `dikategoripos`,`di`.`diuraian` AS `diuraian`,`di`.`dicatatan` AS `dicatatan`,`di`.`distatus` AS `distatus`,`di`.`distatussebelumnya` AS `distatussebelumnya`,`di`.`dijmlrevisi` AS `dijmlrevisi`,`di`.`dicetakanke` AS `dicetakanke`,`di`.`diisclose` AS `diisclose`,`di`.`diinputuser` AS `diinputuser`,`di`.`diinputtgl` AS `diinputtgl`,`di`.`dimodifikasiuser` AS `dimodifikasiuser`,`di`.`dimodifikasitgl` AS `dimodifikasitgl`,`di`.`diposting` AS `diposting`,`di`.`dipostingtgl` AS `dipostingtgl`,`di`.`dicustomtext1` AS `dicustomtext1`,`di`.`dicustomtext2` AS `dicustomtext2`,`di`.`dicustomtext3` AS `dicustomtext3`,`di`.`dicustomtext4` AS `dicustomtext4`,`di`.`dicustomtext5` AS `dicustomtext5`,`di`.`dicustomint1` AS `dicustomint1`,`di`.`dicustomint2` AS `dicustomint2`,`di`.`dicustomint3` AS `dicustomint3`,`di`.`dicustomdbl1` AS `dicustomdbl1`,`di`.`dicustomdbl2` AS `dicustomdbl2`,`di`.`dicustomdbl3` AS `dicustomdbl3`,`di`.`dicustomdate1` AS `dicustomdate1`,`di`.`dicustomdate2` AS `dicustomdate2`,`di`.`dicustomdate3` AS `dicustomdate3`,`br`.`bnama` AS `dicabangnama`,`lc`.`lnama` AS `dilokasinama`,`c`.`kkode` AS `dikontakkode`,`c`.`knama` AS `dikontaknama`,`st1`.`nama` AS `distatusnama`,`st2`.`nama` AS `distatussebelumnyanama`,`u1`.`unama` AS `diinputusernama`,`u2`.`unama` AS `dimodifikasiusernama` from (((((((`m_12_di` `di` left join `m1_branch` `br` on((`di`.`dicabang` = `br`.`bkode`))) left join `m1_location` `lc` on((`di`.`dilokasi` = `lc`.`lkode`))) left join `m1_contact` `c` on((`di`.`dikontak` = `c`.`kid`))) left join `m0_status` `st1` on((`di`.`distatus` = `st1`.`kode`))) left join `m0_status` `st2` on((`di`.`distatussebelumnya` = `st2`.`kode`))) left join `m0_user` `u1` on((`di`.`diinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`di`.`dimodifikasiuser` = `u2`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_di_history.vb`

```sql
INSERT INTO m_12_di_history(SELECT 0, di.* FROM m_12_di di WHERE di.diid = '{idtransaksi}')
```

```sql
SELECT diidhistory FROM m_12_di_history WHERE diid = '{idtransaksi}' ORDER BY dimodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m_12_di_detail_history (SELECT 0, '{result_4}', di.* FROM m_12_di_detail di WHERE di.iddi = '{idtransaksi}' )
```

```sql
select `di`.`diidhistory` AS `diidhistory`, `di`.`diid` AS `diid`,`di`.`dicabang` AS `dicabang`,`di`.`dilokasi` AS `dilokasi`,`di`.`disumber` AS `disumber`,`di`.`diautonotransaksi` AS `diautonotransaksi`,`di`.`dinotransaksi` AS `dinotransaksi`,`di`.`ditgl` AS `ditgl`,`di`.`dikodepa` AS `dikodepa`,`di`.`dikontak` AS `dikontak`,`di`.`dikontakperson` AS `dikontakperson`,`di`.`dikategoripos` AS `dikategoripos`,`di`.`diuraian` AS `diuraian`,`di`.`dicatatan` AS `dicatatan`,`di`.`distatus` AS `distatus`,`di`.`distatussebelumnya` AS `distatussebelumnya`,`di`.`dijmlrevisi` AS `dijmlrevisi`,`di`.`dicetakanke` AS `dicetakanke`,`di`.`diisclose` AS `diisclose`,`di`.`diinputuser` AS `diinputuser`,`di`.`diinputtgl` AS `diinputtgl`,`di`.`dimodifikasiuser` AS `dimodifikasiuser`,`di`.`dimodifikasitgl` AS `dimodifikasitgl`,`di`.`diposting` AS `diposting`,`di`.`dipostingtgl` AS `dipostingtgl`,`di`.`dicustomtext1` AS `dicustomtext1`,`di`.`dicustomtext2` AS `dicustomtext2`,`di`.`dicustomtext3` AS `dicustomtext3`,`di`.`dicustomtext4` AS `dicustomtext4`,`di`.`dicustomtext5` AS `dicustomtext5`,`di`.`dicustomint1` AS `dicustomint1`,`di`.`dicustomint2` AS `dicustomint2`,`di`.`dicustomint3` AS `dicustomint3`,`di`.`dicustomdbl1` AS `dicustomdbl1`,`di`.`dicustomdbl2` AS `dicustomdbl2`,`di`.`dicustomdbl3` AS `dicustomdbl3`,`di`.`dicustomdate1` AS `dicustomdate1`,`di`.`dicustomdate2` AS `dicustomdate2`,`di`.`dicustomdate3` AS `dicustomdate3`,`br`.`bnama` AS `dicabangnama`,`lc`.`lnama` AS `dilokasinama`,`c`.`kkode` AS `dikontakkode`,`c`.`knama` AS `dikontaknama`,`st1`.`nama` AS `distatusnama`,`st2`.`nama` AS `distatussebelumnyanama`,`u1`.`unama` AS `diinputusernama`,`u2`.`unama` AS `dimodifikasiusernama` from (((((((`m_12_di_history` `di` left join `m1_branch` `br` on((`di`.`dicabang` = `br`.`bkode`))) left join `m1_location` `lc` on((`di`.`dilokasi` = `lc`.`lkode`))) left join `m1_contact` `c` on((`di`.`dikontak` = `c`.`kid`))) left join `m0_status` `st1` on((`di`.`distatus` = `st1`.`kode`))) left join `m0_status` `st2` on((`di`.`distatussebelumnya` = `st2`.`kode`))) left join `m0_user` `u1` on((`di`.`diinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`di`.`dimodifikasiuser` = `u2`.`userid`)))
```

```sql
select `di`.`diidhistory` AS `diidhistory`,`di`.`diid` AS `diid`,`di`.`dicabang` AS `dicabang`,`di`.`dilokasi` AS `dilokasi`,`di`.`disumber` AS `disumber`,`di`.`dikategoripos` AS `dikategoripos`,`di`.`diautonotransaksi` AS `diautonotransaksi`,`di`.`dinotransaksi` AS `dinotransaksi`,`di`.`ditgl` AS `ditgl`,`di`.`dikodepa` AS `dikodepa`,`di`.`dikontak` AS `dikontak`,`di`.`dikontakperson` AS `dikontakperson`,`di`.`diuraian` AS `diuraian`,`di`.`dicatatan` AS `dicatatan`,`di`.`distatus` AS `distatus`,`di`.`distatussebelumnya` AS `distatussebelumnya`,`di`.`dijmlrevisi` AS `dijmlrevisi`,`di`.`dicetakanke` AS `dicetakanke`,`di`.`diisclose` AS `diisclose`,`di`.`diinputuser` AS `diinputuser`,`di`.`diinputtgl` AS `diinputtgl`,`di`.`dimodifikasiuser` AS `dimodifikasiuser`,`di`.`dimodifikasitgl` AS `dimodifikasitgl`,`di`.`diposting` AS `diposting`,`di`.`dipostingtgl` AS `dipostingtgl`,`di`.`dicustomtext1` AS `dicustomtext1`,`di`.`dicustomtext2` AS `dicustomtext2`,`di`.`dicustomtext3` AS `dicustomtext3`,`di`.`dicustomtext4` AS `dicustomtext4`,`di`.`dicustomtext5` AS `dicustomtext5`,`di`.`dicustomint1` AS `dicustomint1`,`di`.`dicustomint2` AS `dicustomint2`,`di`.`dicustomint3` AS `dicustomint3`,`di`.`dicustomdbl1` AS `dicustomdbl1`,`di`.`dicustomdbl2` AS `dicustomdbl2`,`di`.`dicustomdbl3` AS `dicustomdbl3`,`di`.`dicustomdate1` AS `dicustomdate1`,`di`.`dicustomdate2` AS `dicustomdate2`,`di`.`dicustomdate3` AS `dicustomdate3`,`br`.`bnama` AS `dicabangnama`,`lc`.`lnama` AS `dilokasinama`,`c`.`kkode` AS `dikontakkode`,`c`.`knama` AS `dikontaknama`,`st1`.`nama` AS `distatusnama`,`st2`.`nama` AS `distatussebelumnyanama`,`u1`.`unama` AS `diinputusernama`,`u2`.`unama` AS `dimodifikasiusernama`,`pc`.`pcnama` AS `dikategoriposnama`,`di`.`dijeniskategori` AS `dijeniskategori`,`did`.`idhistorydetail` AS `idhistorydetail`,`did`.`idhistory` AS `idhistory`,`did`.`iddidetail` AS `iddidetail`,`did`.`iddi` AS `iddi`,`did`.`dikategori` AS `dikategori`,`did`.`idbarang` AS `idbarang`,`did`.`operator` AS `operator`,`did`.`jml1` AS `jml1`,`did`.`jml2` AS `jml2`,`did`.`kriteria` AS `kriteria`,`did`.`nilai` AS `nilai`,`did`.`customtext1` AS `customtext1`,`did`.`customtext2` AS `customtext2`,`did`.`customtext3` AS `customtext3`,`did`.`customtext4` AS `customtext4`,`did`.`customtext5` AS `customtext5`,`did`.`customint1` AS `customint1`,`did`.`customint2` AS `customint2`,`did`.`customint3` AS `customint3`,`did`.`customdbl1` AS `customdbl1`,`did`.`customdbl2` AS `customdbl2`,`did`.`customdbl3` AS `customdbl3`,`did`.`customdate1` AS `customdate1`,`did`.`customdate2` AS `customdate2`,`did`.`customdate3` AS `customdate3`,`did`.`tgl1` AS `tgl1`,`did`.`tgl2` AS `tgl2`,`did`.`nopromo` AS `nopromo`,`did`.`jam1` AS `jam1`,`did`.`jam2` AS `jam2`,`i`.`bkode` AS `kodebarang`,`i`.`bnama` AS `namabarang`, `did`.`catatan` AS `catatan`, `did`.`urutan` AS `urutan` from ((((((((((`m_12_di_history` `di` join `m_12_di_detail_history` `did` on((`di`.`diidhistory` = `did`.`idhistory`))) left join `m1_branch` `br` on((`di`.`dicabang` = `br`.`bkode`))) left join `m1_location` `lc` on((`di`.`dilokasi` = `lc`.`lkode`))) left join `m1_contact` `c` on((`di`.`dikontak` = `c`.`kid`))) left join `m0_status` `st1` on((`di`.`distatus` = `st1`.`kode`))) left join `m0_status` `st2` on((`di`.`distatussebelumnya` = `st2`.`kode`))) left join `m0_user` `u1` on((`di`.`diinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`di`.`dimodifikasiuser` = `u2`.`userid`))) left join `m1_item` `i` on((`did`.`idbarang` = `i`.`bid`))) left join `m_12_pos_category` `pc` on((`di`.`dikategoripos` = `pc`.`pckode`)))
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_item.vb`

```sql
select `i`.`bid` AS `bid`, `i`.`bkode` AS `bkode`, `i`.`bnama` AS `bnama`, `i`.`btipe` AS `btipe`, `i`.`bjenis` AS `bjenis`, `i`.`bkategori` AS `bkategori`, `i`.`bsatuan` AS `bsatuan`, `i`.`bsatuandefault` AS `bsatuandefault`, `i`.`bhpp` AS `bhpp`, `i`.`bbarcode` AS `bbarcode`, `i`.`bhargabeli` AS `bhargabeli`, `i`.`bhppaverage` AS `bhppaverage`, `pi`.`pihargajual1` AS `bhargajual1`, `pi`.`pihargajual2` AS `bhargajual2`, `pi`.`pihargajual3` AS `bhargajual3`, `pi`.`pihargajual4` AS `bhargajual4`, `pi`.`pihargajual5` AS `bhargajual5`, `pi`.`pidiskonjual1` AS `bdiskonjual1`, `pi`.`pidiskonjual2` AS `bdiskonjual2`, `pi`.`pidiskonjual3` AS `bdiskonjual3`, `pi`.`pidiskonjual4` AS `bdiskonjual4`, `pi`.`pidiskonjual5` AS `bdiskonjual5`, `i`.`bstok` AS `bstok`, ifnull(sum(`ib`.`jmlbooking`), 0) AS `bstokbooking`, `i`.`bmarginminimal` AS `bmarginminimal`, `i`.`brekpersediaan` AS `brekpersediaan`, `i`.`brekpenjualan` AS `brekpenjualan`, `i`.`brekreturpenjualan` AS `brekreturpenjualan`, `i`.`brekdiskonpenjualan` AS `brekdiskonpenjualan`, `i`.`brekhargapokok` AS `brekhargapokok`, `i`.`brekreturpembelian` AS `brekreturpembelian`, `i`.`brekdiskonpembelian` AS `brekdiskonpembelian`, `i`.`brekkonsinyasi` AS `brekkonsinyasi`, `i`.`bserial` AS `bserial`, `i`.`bbatch` AS `bbatch`, `i`.`bnilaisatuan` AS `bnilaisatuan`, `i`.`bnilaisatuandefault` AS `bnilaisatuandefault`, `i`.`bsuplier` AS `bsuplier`, `c`.`kkode` AS `bsuplierkode`, `c`.`knama` AS `bsupliernama`, `pi`.`pistokminimal` AS `bstokminimal`, `pi`.`pistokmaksimal` AS `bstokmaksimal`, `i`.`bstatusmoving` AS `bstatusmoving`, `i`.`binputuser` AS `binputuser`, `i`.`binputtgl` AS `binputtgl`, `i`.`bmodifikasiuser` AS `bmodifikasiuser`, `i`.`bmodifikasitgl` AS `bmodifikasitgl`, `f`.`fnamafile` AS `fnamafile`, l.lkategoripos as lkategoripos, pc.pcnama, pi.pistokreorder, ic.icnama from `m1_item` `i` join `m0_user` `u` on `u`.`userid` = 'valuserid' join `m1_location` `l` on `u`.`ulokasi` = `l`.`lkode` join `m_12_pos_item` `pi` on `l`.`lkategoripos` = `pi`.`pikategori` and `i`.`bid` = `pi`.`piidbarang` join m_12_pos_category pc on l.lkategoripos = pc.pckode left join m1_item_category ic on i.bkategori = ic.ickode left join `m1_item_booking` `ib` on `i`.`bid` = `ib`.`idbarang` left join `m1_contact` `c` on `i`.`bsuplier` = `c`.`kid` left join `m1_files` `f` on `i`.`bid` = `f`.`fidtransaksi` and `f`.`fdefault` = 1 and `f`.`fsumber` = 'Item'
```

```sql
select `i`.`bid` AS `bid`, `i`.`bkode` AS `bkode`, `i`.`bnama` AS `bnama`, `i`.`btipe` AS `btipe`, `i`.`bjenis` AS `bjenis`, `i`.`bkategori` AS `bkategori`, `i`.`bsatuan` AS `bsatuan`, `i`.`bsatuandefault` AS `bsatuandefault`, `i`.`bhpp` AS `bhpp`, `i`.`bbarcode` AS `bbarcode`, `i`.`bhargabeli` AS `bhargabeli`, `i`.`bhppaverage` AS `bhppaverage`, `pi`.`pihargajual1` AS `bhargajual1`, `pi`.`pihargajual2` AS `bhargajual2`, `pi`.`pihargajual3` AS `bhargajual3`, `pi`.`pihargajual4` AS `bhargajual4`, `pi`.`pihargajual5` AS `bhargajual5`, `pi`.`pidiskonjual1` AS `bdiskonjual1`, `pi`.`pidiskonjual2` AS `bdiskonjual2`, `pi`.`pidiskonjual3` AS `bdiskonjual3`, `pi`.`pidiskonjual4` AS `bdiskonjual4`, `pi`.`pidiskonjual5` AS `bdiskonjual5`, (CASE i.bjenis WHEN 'J' THEN 0 ELSE IFNULL(SUM(isw.stok),0) END) AS `bstok`, (CASE i.bjenis WHEN 'J' THEN 0 ELSE ifnull(sum(`ib`.`jmlbooking`), 0) END) AS `bstokbooking`, `i`.`bmarginminimal` AS `bmarginminimal`, `i`.`brekpersediaan` AS `brekpersediaan`, `i`.`brekpenjualan` AS `brekpenjualan`, `i`.`brekreturpenjualan` AS `brekreturpenjualan`, `i`.`brekdiskonpenjualan` AS `brekdiskonpenjualan`, `i`.`brekhargapokok` AS `brekhargapokok`, `i`.`brekreturpembelian` AS `brekreturpembelian`, `i`.`brekdiskonpembelian` AS `brekdiskonpembelian`, `i`.`brekkonsinyasi` AS `brekkonsinyasi`, `i`.`bserial` AS `bserial`, `i`.`bbatch` AS `bbatch`, `i`.`bnilaisatuan` AS `bnilaisatuan`, `i`.`bnilaisatuandefault` AS `bnilaisatuandefault`, `i`.`bsuplier` AS `bsuplier`, `c`.`kkode` AS `bsuplierkode`, `c`.`knama` AS `bsupliernama`, `pi`.`pistokminimal` AS `bstokminimal`, `pi`.`pistokmaksimal` AS `bstokmaksimal`, `i`.`bstatusmoving` AS `bstatusmoving`, `i`.`binputuser` AS `binputuser`, `i`.`binputtgl` AS `binputtgl`, `i`.`bmodifikasiuser` AS `bmodifikasiuser`, `i`.`bmodifikasitgl` AS `bmodifikasitgl`, `f`.`fnamafile` AS `fnamafile`, l.lkategoripos as lkategoripos, pc.pcnama, pi.pistokreorder, ic.icnama, i.baktif, i.baktiftgl from `m1_item` `i` join `m0_user` `u` on `u`.`userid` = 'valuserid' join `m1_location` `l` on `u`.`ulokasi` = `l`.`lkode` join `m_12_pos_item` `pi` on `l`.`lkategoripos` = `pi`.`pikategori` and `i`.`bid` = `pi`.`piidbarang` join m_12_pos_category pc on l.lkategoripos = pc.pckode left join m0_user_warehouse uw on u.userid = uw.userid left join m1_item_stock_warehouse isw on i.bid = isw.idbarang AND (CASE LENGTH(IFNULL(uw.gudang,'')) WHEN 0 THEN isw.kgudang LIKE '%' OR isw.kgudang IS NULL ELSE isw.kgudang = uw.gudang END) left join m1_item_category ic on i.bkategori = ic.ickode left join `m1_item_booking` `ib` on `i`.`bid` = `ib`.`idbarang` and uw.gudang = ib.gudang left join `m1_contact` `c` on `i`.`bsuplier` = `c`.`kid` left join `m1_files` `f` on `i`.`bid` = `f`.`fidtransaksi` and `f`.`fdefault` = 1 and `f`.`fsumber` = 'Item'
```

```sql
select `i`.`bid` AS `bid`, `i`.`bkode` AS `bkode`, `i`.`bnama` AS `bnama`, `i`.`btipe` AS `btipe`, `i`.`bjenis` AS `bjenis`, `i`.`bkategori` AS `bkategori`, `i`.`bsatuan` AS `bsatuan`, `i`.`bsatuandefault` AS `bsatuandefault`, `i`.`bhpp` AS `bhpp`, `i`.`bbarcode` AS `bbarcode`, `i`.`bhargabeli` AS `bhargabeli`, `i`.`bhppaverage` AS `bhppaverage`, `pi`.`pihargajual1` AS `bhargajual1`, `pi`.`pihargajual2` AS `bhargajual2`, `pi`.`pihargajual3` AS `bhargajual3`, `pi`.`pihargajual4` AS `bhargajual4`, `pi`.`pihargajual5` AS `bhargajual5`, `pi`.`pidiskonjual1` AS `bdiskonjual1`, `pi`.`pidiskonjual2` AS `bdiskonjual2`, `pi`.`pidiskonjual3` AS `bdiskonjual3`, `pi`.`pidiskonjual4` AS `bdiskonjual4`, `pi`.`pidiskonjual5` AS `bdiskonjual5`, (CASE i.bjenis WHEN 'J' THEN 0 ELSE IFNULL(SUM(isw.stok),0) END) AS `bstok`, (CASE i.bjenis WHEN 'J' THEN 0 ELSE ifnull(sum(`ib`.`jmlbooking`), 0) END) AS `bstokbooking`, `i`.`bmarginminimal` AS `bmarginminimal`, `i`.`brekpersediaan` AS `brekpersediaan`, `i`.`brekpenjualan` AS `brekpenjualan`, `i`.`brekreturpenjualan` AS `brekreturpenjualan`, `i`.`brekdiskonpenjualan` AS `brekdiskonpenjualan`, `i`.`brekhargapokok` AS `brekhargapokok`, `i`.`brekreturpembelian` AS `brekreturpembelian`, `i`.`brekdiskonpembelian` AS `brekdiskonpembelian`, `i`.`brekkonsinyasi` AS `brekkonsinyasi`, `i`.`bserial` AS `bserial`, `i`.`bbatch` AS `bbatch`, `i`.`bnilaisatuan` AS `bnilaisatuan`, `i`.`bnilaisatuandefault` AS `bnilaisatuandefault`, `i`.`bsuplier` AS `bsuplier`, `c`.`kkode` AS `bsuplierkode`, `c`.`knama` AS `bsupliernama`, `pi`.`pistokminimal` AS `bstokminimal`, `pi`.`pistokmaksimal` AS `bstokmaksimal`, `i`.`bstatusmoving` AS `bstatusmoving`, `i`.`binputuser` AS `binputuser`, `i`.`binputtgl` AS `binputtgl`, `i`.`bmodifikasiuser` AS `bmodifikasiuser`, `i`.`bmodifikasitgl` AS `bmodifikasitgl`, `f`.`fnamafile` AS `fnamafile`, l.lkategoripos as lkategoripos, pc.pcnama, pi.pistokreorder, ic.icnama from `m1_item` `i` join `m0_user` `u` on `u`.`userid` = 'valuserid' join `m1_location` `l` on `u`.`ulokasi` = `l`.`lkode` join `m_12_pos_item` `pi` on `l`.`lkategoripos` = `pi`.`pikategori` and `i`.`bid` = `pi`.`piidbarang` join m_12_pos_category pc on l.lkategoripos = pc.pckode join m0_user_warehouse uw on u.userid = uw.userid left join m1_item_stock_warehouse isw on uw.gudang = isw.kgudang and i.bid = isw.idbarang left join m1_item_category ic on i.bkategori = ic.ickode left join `m1_item_booking` `ib` on `i`.`bid` = `ib`.`idbarang` and uw.gudang = ib.gudang left join `m1_contact` `c` on `i`.`bsuplier` = `c`.`kid` left join `m1_files` `f` on `i`.`bid` = `f`.`fidtransaksi` and `f`.`fdefault` = 1 and `f`.`fsumber` = 'Item'
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_lp.vb`

```sql
SELECT COUNT(lpid), lpnotransaksi FROM M_12_lp WHERE lpid='{result_4}' AND lpstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(lpid) FROM m_12_lp WHERE lpnotransaksi='{notransaksi}'
```

```sql
Update M_12_lp set lpcabang = '{FixQuotes_drutama}lpcabang', lplokasi = '{FixQuotes_drutama}lplokasi', lpgudang = '{FixQuotes_drutama}lpgudang', lpsumber = '{FixQuotes_drutama}lpsumber', lpautonotransaksi = {drutama}lpautonotransaksi, lpnotransaksi = '{notransaksi}', lptgl = '{FixQuotes_AsFormatTanggal_drutama}lptgl', lptglberlakusampai = '{FixQuotes_AsFormatTanggal_drutama}lptglberlakusampai', lpkodepa = {drutama}lpkodepa, lpbagianlp = {drutama}lpbagianlp, lpbagianlpkontak = '{FixQuotes_drutama}lpbagianlpkontak', lpmatauang = '{FixQuotes_drutama}lpmatauang', lpkurs = '{FixDouble_drutama}lpkurs', lpuraian = '{FixQuotes_drutama}lpuraian', lpcatatan = '{FixQuotes_drutama}lpcatatan', lpnoref = '{FixQuotes_drutama}lpnoref', lptglnoref = '{FixQuotes_AsFormatTanggal_drutama}lptglnoref', lpstatus = {drutama}lpstatus, lpstatussebelumnya = {drutama}lpstatussebelumnya, lpjmlrevisi = lpjmlrevisi+1, lpcetakanke = {drutama}lpcetakanke, lpmodifikasiuser = {drutama}lpmodifikasiuser, lpmodifikasitgl = NOW(), lpposting = 0, lptutupperiode = {drutama}lptutupperiode, lpcustomtext1 = '{FixQuotes_drutama}lpcustomtext1', lpcustomtext2 = '{FixQuotes_drutama}lpcustomtext2', lpcustomtext3 = '{FixQuotes_drutama}lpcustomtext3', lpcustomtext4 = '{FixQuotes_drutama}lpcustomtext4', lpcustomtext5 = '{FixQuotes_drutama}lpcustomtext5', lpcustomint1 = {drutama}lpcustomint1, lpcustomint2 = {drutama}lpcustomint2, lpcustomint3 = {drutama}lpcustomint3, lpcustomdbl1 = '{FixDouble_drutama}lpcustomdbl1', lpcustomdbl2 = '{FixDouble_drutama}lpcustomdbl2', lpcustomdbl3 = '{FixDouble_drutama}lpcustomdbl3', lpcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}lpcustomdate1', lpcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}lpcustomdate2', lpcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}lpcustomdate3', lpkategori = '{FixQuotes_drutama}lpkategori', lpkategoripos = '{FixQuotes_drutama}lpkategoripos', lpidppa = '{FixQuotes_drutama}lpidppa' where lpid = '{drutama}lpid'
```

```sql
Insert into M_12_lp (lpcabang, lplokasi, lpgudang, lpsumber, lpautonotransaksi, lpnotransaksi, lptgl, lptglberlakusampai, lpkodepa, lpbagianlp, lpbagianlpkontak, lpmatauang, lpkurs, lpuraian, lpcatatan, lpnoref, lptglnoref, lpstatus, lpstatussebelumnya, lpjmlrevisi, lpcetakanke, lpinputuser, lpinputtgl, lpmodifikasiuser, lpmodifikasitgl, lpposting, lptutupperiode, lpisclose, lpcustomtext1, lpcustomtext2, lpcustomtext3, lpcustomtext4, lpcustomtext5, lpcustomint1, lpcustomint2, lpcustomint3, lpcustomdbl1, lpcustomdbl2, lpcustomdbl3, lpcustomdate1, lpcustomdate2, lpcustomdate3, lpkategori, lpkategoripos, lpidppa) values('{FixQuotes_drutama}lpcabang', '{FixQuotes_drutama}lplokasi', '{FixQuotes_drutama}lpgudang', '{FixQuotes_drutama}lpsumber', {drutama}lpautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}lptgl', '{FixQuotes_AsFormatTanggal_drutama}lptglberlakusampai', {drutama}lpkodepa, {drutama}lpbagianlp, '{FixQuotes_drutama}lpbagianlpkontak', '{FixQuotes_drutama}lpmatauang', '{FixDouble_drutama}lpkurs', '{FixQuotes_drutama}lpuraian', '{FixQuotes_drutama}lpcatatan', '{FixQuotes_drutama}lpnoref', '{FixQuotes_AsFormatTanggal_drutama}lptglnoref', {drutama}lpstatus, {drutama}lpstatussebelumnya, {drutama}lpjmlrevisi, {drutama}lpcetakanke, {drutama}lpinputuser, NOW(), {drutama}lpmodifikasiuser, '1971-01-01 00:00:00', 0, {drutama}lptutupperiode, {drutama}lpisclose, '{FixQuotes_drutama}lpcustomtext1', '{FixQuotes_drutama}lpcustomtext2', '{FixQuotes_drutama}lpcustomtext3', '{FixQuotes_drutama}lpcustomtext4', '{FixQuotes_drutama}lpcustomtext5', {drutama}lpcustomint1, {drutama}lpcustomint2, {drutama}lpcustomint3, '{FixDouble_drutama}lpcustomdbl1', '{FixDouble_drutama}lpcustomdbl2', '{FixDouble_drutama}lpcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}lpcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}lpcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}lpcustomdate3', '{FixQuotes_drutama}lpkategori', '{FixQuotes_drutama}lpkategoripos', '{FixQuotes_drutama}lpidppa')
```

```sql
select lpid from M_12_lp where lpnotransaksi='{notransaksi}' AND lpinputuser= '{userid}' order by lpmodifikasitgl desc limit 1
```

```sql
Delete from M_12_lp_Detail where idlp = '{result_4}'
```

```sql
Insert into M_12_lp_Detail(idlpdetail, idlp, idbarang, satuan, nilaisatuan, satuanbarang, matauang, kurs, hargajual1lama, hargajual2lama, hargajual3lama, hargajual4lama, hargajual5lama, hargajual1, hargajual2, hargajual3, hargajual4, hargajual5, diskonjual1lama, diskonjual2lama, diskonjual3lama, diskonjual4lama, diskonjual5lama, diskonjual1, diskonjual2, diskonjual3, diskonjual4, diskonjual5, cabang, lokasi, gudang, costcenter, divisi, subdivisi, proyek, catatan, urutan, statusberlaku, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3,stokminimallama,stokminimal,stokmaksimallama,stokmaksimal,stokreorderlama,stokreorder,stokminorderlama,stokminorder, hargabeli, margin1, margin2, margin3, margin4, margin5, idppadetail) values{strValue2_ToString}
```

```sql
SELECT moduleid, menuid, 0, 0, '' FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Lptgl, Lpnotransaksi, Lpstatus, Lpkategori, Lpkategoripos FROM m_12_Lp WHERE Lpid='{idtransaksi}'
```

```sql
UPDATE m_12_ppa_detail ppad JOIN m_12_pos_item pi ON ppad.idbarang = pi.piidbarang SET pi.pihargajual1 = ppad.hargajual1lama, pi.pihargajual2 = ppad.hargajual2lama, pi.pihargajual3 = ppad.hargajual3lama, pi.pihargajual4 = ppad.hargajual4lama, pi.pihargajual5 = ppad.hargajual5lama, pi.pidiskonjual1 = ppad.diskonjual1lama, pi.pidiskonjual2 = ppad.diskonjual2lama, pi.pidiskonjual3 = ppad.diskonjual3lama, pi.pidiskonjual4 = ppad.diskonjual4lama, pi.pidiskonjual5 = ppad.diskonjual5lama, pi.pistokminimal = ppad.stokminimallama, pi.pistokmaksimal = ppad.stokmaksimallama, pi.pistokreorder = ppad.stokreorderlama, pi.pistokminorder = ppad.stokminorderlama WHERE ppad.idppa = '{FixDouble_result_4}'
```

```sql
UPDATE M_12_lp SET lpstatus = {nilaiStatus}, lpmodifikasiuser='{userid}', lpmodifikasitgl = NOW(), lpposting = 0, lppostingtgl = '1971-01-01 00:00:00', lpjmlrevisi = lpjmlrevisi + 1 WHERE lpid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Paid, Ppanotransaksi FROM m_12_Ppa WHERE Ppaid='{idtransaksi}'
```

```sql
DELETE FROM M_12_Ppa_Detail WHERE idppa = '{idtransaksi}'
```

```sql
DELETE FROM M_12_Ppa WHERE ppaid = '{idtransaksi}'
```

```sql
select lp.lpid AS lpid, lp.lpcabang AS lpcabang, lp.lplokasi AS lplokasi, lp.lpgudang AS lpgudang, lp.lpsumber AS lpsumber, lp.lpautonotransaksi AS lpautonotransaksi, lp.lpnotransaksi AS lpnotransaksi, lp.lptgl AS lptgl, lp.lptglberlakusampai AS lptglberlakusampai, lp.lpkodepa AS lpkodepa, lp.lpbagianlp AS lpbagianlp, lp.lpbagianlpkontak AS lpbagianlpkontak, lp.lpmatauang AS lpmatauang, lp.lpkurs AS lpkurs, lp.lpuraian AS lpuraian, lp.lpcatatan AS lpcatatan, lp.lpnoref AS lpnoref, lp.lptglnoref AS lptglnoref, lp.lpstatus AS lpstatus, lp.lpstatussebelumnya AS lpstatussebelumnya, lp.lpjmlrevisi AS lpjmlrevisi, lp.lpcetakanke AS lpcetakanke, lp.lpinputuser AS lpinputuser, lp.lpinputtgl AS lpinputtgl, lp.lpmodifikasiuser AS lpmodifikasiuser, lp.lpmodifikasitgl AS lpmodifikasitgl, lp.lpposting AS lpposting, lp.lppostingtgl AS lppostingtgl, lp.lptutupperiode AS lptutupperiode, lp.lpisclose AS lpisclose, lp.lpcustomtext1 AS lpcustomtext1, lp.lpcustomtext2 AS lpcustomtext2, lp.lpcustomtext3 AS lpcustomtext3, lp.lpcustomtext4 AS lpcustomtext4, lp.lpcustomtext5 AS lpcustomtext5, lp.lpcustomint1 AS lpcustomint1, lp.lpcustomint2 AS lpcustomint2, lp.lpcustomint3 AS lpcustomint3, lp.lpcustomdbl1 AS lpcustomdbl1, lp.lpcustomdbl2 AS lpcustomdbl2, lp.lpcustomdbl3 AS lpcustomdbl3, lp.lpcustomdate1 AS lpcustomdate1, lp.lpcustomdate2 AS lpcustomdate2, lp.lpcustomdate3 AS lpcustomdate3, br.bnama AS lpcabangnama, lc.lnama AS lplokasinama, wh.wnama AS lpgudangnama, c1.kkode AS lpbagianlpkode, c1.knama AS lpbagianlpnama, st1.nama AS lpstatusnama, st2.nama AS lpstatussebelumnyanama, u1.unama AS lpinputusernama, u2.unama AS lpmodifikasiusernama, lp.lpkategori, lp.lpidppa, (CASE lp.lpkategori WHEN 0 THEN 'Global' ELSE 'Category' END) as lpkategorinama, lp.lpkategoripos, pc.pcnama as lpkategoriposnama, lpd.idlpdetail AS idlpdetail, lpd.idlp AS idlp, lpd.idbarang AS idbarang, lpd.satuan AS satuan, lpd.nilaisatuan AS nilaisatuan, lpd.satuanbarang AS satuanbarang, lpd.matauang AS matauang, lpd.kurs AS kurs, lpd.hargajual1lama AS hargajual1lama, lpd.hargajual2lama AS hargajual2lama, lpd.hargajual3lama AS hargajual3lama, lpd.hargajual4lama AS hargajual4lama, lpd.hargajual5lama AS hargajual5lama, lpd.hargajual1 AS hargajual1, lpd.hargajual2 AS hargajual2, lpd.hargajual3 AS hargajual3, lpd.hargajual4 AS hargajual4, lpd.hargajual5 AS hargajual5, lpd.diskonjual1lama AS diskonjual1lama, lpd.diskonjual2lama AS diskonjual2lama, lpd.diskonjual3lama AS diskonjual3lama, lpd.diskonjual4lama AS diskonjual4lama, lpd.diskonjual5lama AS diskonjual5lama, lpd.diskonjual1 AS diskonjual1, lpd.diskonjual2 AS diskonjual2, lpd.diskonjual3 AS diskonjual3, lpd.diskonjual4 AS diskonjual4, lpd.diskonjual5 AS diskonjual5, lpd.cabang AS cabang, lpd.lokasi AS lokasi, lpd.gudang AS gudang, lpd.costcenter AS costcenter, lpd.divisi AS divisi, lpd.subdivisi AS subdivisi, lpd.proyek AS proyek, lpd.catatan AS catatan, lpd.urutan AS urutan, lpd.statusberlaku AS statusberlaku, lpd.isclose AS isclose, lpd.customtext1 AS customtext1, lpd.customtext2 AS customtext2, lpd.customtext3 AS customtext3, lpd.customdbl1 AS customdbl1, lpd.customdbl2 AS customdbl2, lpd.customdbl3 AS customdbl3, lpd.customdate1 AS customdate1, lpd.customdate2 AS customdate2, lpd.customdate3 AS customdate3, i.bkode AS kodebarang, i.bnama AS namabarang, i.btipe AS tipebarang, brd.bnama AS cabangnama, lcd.lnama AS lokasinama, whd.wnama AS gudangnama, cc.ccnama AS costcenternama, d.dnama AS divisinama, sd.sdnama AS subdivisinama, p.pnama AS proyeknama, lpd.stokminimallama AS stokminimallama, lpd.stokmaksimallama AS stokmaksimallama, lpd.stokreorderlama AS stokreorderlama, lpd.stokminorderlama AS stokminorderlama, lpd.stokminimal AS stokminimal, lpd.stokmaksimal AS stokmaksimal, lpd.stokreorder AS stokreorder, lpd.stokminorder AS stokminorder, lpd.hargabeli AS hargabeli, lpd.margin1 AS margin1, lpd.margin2 AS margin2, lpd.margin3 AS margin3, lpd.margin4 AS margin4, lpd.margin5 AS margin5, lpd.idppadetail from m_12_lp lp join m_12_lp_detail lpd on lp.lpid = lpd.idlp join m0_status st1 on st1.kode = lp.lpstatus join m0_status st2 on st2.kode = lp.lpstatussebelumnya left join m1_branch br on br.bkode = lp.lpcabang left join m1_location lc on lc.lkode = lp.lplokasi left join m1_warehouse wh on wh.wkode = lp.lpgudang left join m1_contact c1 on c1.kid = lp.lpbagianlp left join m0_user u1 on u1.userid = lp.lpinputuser left join m0_user u2 on u2.userid = lp.lpmodifikasiuser left join m_12_pos_category pc on lp.lpkategoripos = pc.pckode left join m1_item i on lpd.idbarang = i.bid left join m1_branch brd on lpd.cabang = brd.bkode left join m1_location lcd on lpd.lokasi = lcd.lkode left join m1_warehouse whd on lpd.gudang = whd.wkode left join m1_cost_center cc on lpd.costcenter = cc.cckode left join m1_division d on lpd.divisi = d.dkode left join m1_subdivision sd on lpd.subdivisi = sd.sdkode left join m1_project p on lpd.proyek = p.pkode
```

```sql
select lp.lpid AS lpid, lp.lpcabang AS lpcabang, lp.lplokasi AS lplokasi, lp.lpgudang AS lpgudang, lp.lpsumber AS lpsumber, lp.lpautonotransaksi AS lpautonotransaksi, lp.lpnotransaksi AS lpnotransaksi, lp.lptgl AS lptgl, lp.lptglberlakusampai AS lptglberlakusampai, lp.lpkodepa AS lpkodepa, lp.lpbagianlp AS lpbagianlp, lp.lpbagianlpkontak AS lpbagianlpkontak, lp.lpmatauang AS lpmatauang, lp.lpkurs AS lpkurs, lp.lpuraian AS lpuraian, lp.lpcatatan AS lpcatatan, lp.lpnoref AS lpnoref, lp.lptglnoref AS lptglnoref, lp.lpstatus AS lpstatus, lp.lpstatussebelumnya AS lpstatussebelumnya, lp.lpjmlrevisi AS lpjmlrevisi, lp.lpcetakanke AS lpcetakanke, lp.lpinputuser AS lpinputuser, lp.lpinputtgl AS lpinputtgl, lp.lpmodifikasiuser AS lpmodifikasiuser, lp.lpmodifikasitgl AS lpmodifikasitgl, lp.lpposting AS lpposting, lp.lppostingtgl AS lppostingtgl, lp.lptutupperiode AS lptutupperiode, lp.lpisclose AS lpisclose, br.bnama AS lpcabangnama, lc.lnama AS lplokasinama, wh.wnama AS lpgudangnama, c1.kkode AS lpbagianlpkode, c1.knama AS lpbagianlpnama, st1.nama AS lpstatusnama, st2.nama AS lpstatussebelumnyanama, u1.unama AS lpinputusernama, u2.unama AS lpmodifikasiusernama, lp.lpkategori, (CASE lp.lpkategori WHEN 0 THEN 'All Category' ELSE 'Per Category' END) as lpkategorinama, lp.lpkategoripos, pc.pcnama as lpkategoriposnama from m_12_lp lp join m0_status st1 on st1.kode = lp.lpstatus join m0_status st2 on st2.kode = lp.lpstatussebelumnya left join m1_branch br on br.bkode = lp.lpcabang left join m1_location lc on lc.lkode = lp.lplokasi left join m1_warehouse wh on wh.wkode = lp.lpgudang left join m1_contact c1 on c1.kid = lp.lpbagianlp left join m0_user u1 on u1.userid = lp.lpinputuser left join m0_user u2 on u2.userid = lp.lpmodifikasiuser left join m_12_pos_category pc on lp.lpkategoripos = pc.pckode
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_pos_additional_item.vb`

```sql
SELECT ai.aikategori as kategori, ai.aiidbarang as idbarang, ai.aioperator as operator, i.bkode, (CASE ai.aioperator WHEN 0 THEN 'Between' WHEN 1 THEN '>=' WHEN 2 THEN 'Multiple' ELSE 'Unknown' END) as operatornama FROM m_12_pos_additional_item ai JOIN m1_item i ON ai.aiidbarang = i.bid WHERE ai.aikategori = '{FxDB_drutama}aikategori' AND ai.aiidbarang = '{FxDB_drutama}aiidbarang' AND ai.aiid <> '{FxDB_drutama}aiid' GROUP BY ai.aioperator ORDER BY ai.aioperator
```

```sql
SELECT COUNT(aiid) FROM M_12_Pos_Additional_Item WHERE aiid = '{result_4}'
```

```sql
Update M_12_Pos_Additional_Item set aikategori = '{FixQuotes_drutama}aikategori', aiidbarang = '{FixQuotes_drutama}aiidbarang', aioperator = '{FixQuotes_drutama}aioperator', aijml1 = '{FixDouble_drutama}aijml1', aijml2 = '{FixDouble_drutama}aijml2', aicustomtext1 = '{FixQuotes_drutama}aicustomtext1', aicustomtext2 = '{FixQuotes_drutama}aicustomtext2', aicustomtext3 = '{FixQuotes_drutama}aicustomtext3', aicustomtext4 = '{FixQuotes_drutama}aicustomtext4', aicustomtext5 = '{FixQuotes_drutama}aicustomtext5', aicustomint1 = {drutama}aicustomint1, aicustomint2 = {drutama}aicustomint2, aicustomint3 = {drutama}aicustomint3, aicustomdbl1 = '{FixDouble_drutama}aicustomdbl1', aicustomdbl2 = '{FixDouble_drutama}aicustomdbl2', aicustomdbl3 = '{FixDouble_drutama}aicustomdbl3', aicustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}aicustomdate1', aicustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}aicustomdate2', aicustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}aicustomdate3', aitgl1 = '{FixQuotes_AsFormatTanggal_drutama}aitgl1', aitgl2 = '{FixQuotes_AsFormatTanggal_drutama}aitgl2', ainopromo = '{FixQuotes_drutama}ainopromo' where aiid = '{drutama}aiid'
```

```sql
Insert into M_12_Pos_Additional_Item (aikategori, aiidbarang, aioperator, aijml1, aijml2, aicustomtext1, aicustomtext2, aicustomtext3, aicustomtext4, aicustomtext5, aicustomint1, aicustomint2, aicustomint3, aicustomdbl1, aicustomdbl2, aicustomdbl3, aicustomdate1, aicustomdate2, aicustomdate3, aitgl1, aitgl2, ainopromo) values('{FixQuotes_drutama}aikategori', '{FixQuotes_drutama}aiidbarang', '{FixQuotes_drutama}aioperator', '{FixDouble_drutama}aijml1', '{FixDouble_drutama}aijml2', '{FixQuotes_drutama}aicustomtext1', '{FixQuotes_drutama}aicustomtext2', '{FixQuotes_drutama}aicustomtext3', '{FixQuotes_drutama}aicustomtext4', '{FixQuotes_drutama}aicustomtext5', {drutama}aicustomint1, {drutama}aicustomint2, {drutama}aicustomint3, '{FixDouble_drutama}aicustomdbl1', '{FixDouble_drutama}aicustomdbl2', '{FixDouble_drutama}aicustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}aicustomdate1', '{FixQuotes_AsFormatTanggal_drutama}aicustomdate2', '{FixQuotes_AsFormatTanggal_drutama}aicustomdate3', '{FixQuotes_AsFormatTanggal_drutama}aitgl1', '{FixQuotes_AsFormatTanggal_drutama}aitgl2', '{FixQuotes_drutama}ainopromo')
```

```sql
select aiid from M_12_Pos_Additional_Item where aikategori = '{drutama}aikategori' AND aiidbarang = '{drutama}aiidbarang' AND aioperator = '{drutama}aioperator' AND aijml1 = '{drutama}aijml1' AND aijml2 = '{drutama}aijml2' limit 1
```

```sql
Delete from M_12_Pos_Additional_Item_Detail where idai = '{result_4}'
```

```sql
Insert into M_12_Pos_Additional_Item_Detail(idaidetail, idai, idbarang, jml, satuan, customtext1, customtext2, customtext3, customtext4, customtext5, customint1, customint2, customint3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
SELECT aikategori as kategoripos FROM M_12_Pos_Additional_Item WHERE aiid = '{idtransaksi}' GROUP BY aikategori
```

```sql
DELETE FROM M_12_Pos_Additional_Item_Detail WHERE idai = '{idtransaksi}'
```

```sql
DELETE FROM M_12_Pos_Additional_Item WHERE aiid = '{idtransaksi}'
```

```sql
Delete from M_12_Pos_Additional_Item
```

```sql
Delete from M_12_Pos_Additional_Item_Detail
```

```sql
Insert into M_12_Pos_Additional_Item(aiid, aikategori, aiidbarang, aioperator, aijml1, aijml2, aicustomtext1, aicustomtext2, aicustomtext3, aicustomtext4, aicustomtext5, aicustomint1, aicustomint2, aicustomint3, aicustomdbl1, aicustomdbl2, aicustomdbl3, aicustomdate1, aicustomdate2, aicustomdate3) values{strValue1_ToString}
```

```sql
select `ai`.`aiid` AS `aiid`,`ai`.`aikategori` AS `aikategori`,`ai`.`aiidbarang` AS `aiidbarang`,`ai`.`aioperator` AS `aioperator`,`ai`.`aijml1` AS `aijml1`,`ai`.`aijml2` AS `aijml2`,`ai`.`aicustomtext1` AS `aicustomtext1`,`ai`.`aicustomtext2` AS `aicustomtext2`,`ai`.`aicustomtext3` AS `aicustomtext3`,`ai`.`aicustomtext4` AS `aicustomtext4`,`ai`.`aicustomtext5` AS `aicustomtext5`,`ai`.`aicustomint1` AS `aicustomint1`,`ai`.`aicustomint2` AS `aicustomint2`,`ai`.`aicustomint3` AS `aicustomint3`,`ai`.`aicustomdbl1` AS `aicustomdbl1`,`ai`.`aicustomdbl2` AS `aicustomdbl2`,`ai`.`aicustomdbl3` AS `aicustomdbl3`,`ai`.`aicustomdate1` AS `aicustomdate1`,`ai`.`aicustomdate2` AS `aicustomdate2`,`ai`.`aicustomdate3` AS `aicustomdate3`,`pc`.`pcnama` AS `pcnama`,`i`.`bkode` AS `bkode`,`i`.`bnama` AS `bnama`,`i`.`btipe` AS `btipe`,`i`.`bsatuan` AS `bsatuan`,(case `ai`.`aioperator` when 0 then 'Between' when 1 then '>=' when 2 then 'Multiple' else 'Unknown' end) AS `aioperatornama`, `ai`.`aitgl1` AS `aitgl1`, `ai`.`aitgl2` AS `aitgl2`, `ai`.`ainopromo` AS `ainopromo`,`aid`.`idaidetail` AS `idaidetail`,`aid`.`idai` AS `idai`,`aid`.`idbarang` AS `idbarang`,`aid`.`jml` AS `jml`,`i2`.`bsatuan` AS `satuan`,`aid`.`customtext1` AS `customtext1`,`aid`.`customtext2` AS `customtext2`,`aid`.`customtext3` AS `customtext3`,`aid`.`customtext4` AS `customtext4`,`aid`.`customtext5` AS `customtext5`,`aid`.`customint1` AS `customint1`,`aid`.`customint2` AS `customint2`,`aid`.`customint3` AS `customint3`,`aid`.`customdbl1` AS `customdbl1`,`aid`.`customdbl2` AS `customdbl2`,`aid`.`customdbl3` AS `customdbl3`,`aid`.`customdate1` AS `customdate1`,`aid`.`customdate2` AS `customdate2`,`aid`.`customdate3` AS `customdate3`,`i2`.`bkode` AS `kodebarang`,`i2`.`bnama` AS `namabarang`,`i2`.`btipe` AS `tipebarang` from ((((`M_12_Pos_Additional_Item` `ai` join `m_12_pos_category` `pc` on((`ai`.`aikategori` = `pc`.`pckode`))) join `m1_item` `i` on((`ai`.`aiidbarang` = `i`.`bid`))) join `M_12_Pos_Additional_Item_detail` `aid` on((`ai`.`aiid` = `aid`.`idai`))) join `m1_item` `i2` on((`aid`.`idbarang` = `i2`.`bid`)))
```

```sql
select `ai`.`aiid` AS `aiid`,`ai`.`aikategori` AS `aikategori`,`ai`.`aiidbarang` AS `aiidbarang`,`ai`.`aioperator` AS `aioperator`,`ai`.`aijml1` AS `aijml1`,`ai`.`aijml2` AS `aijml2`,`ai`.`aicustomtext1` AS `aicustomtext1`,`ai`.`aicustomtext2` AS `aicustomtext2`,`ai`.`aicustomtext3` AS `aicustomtext3`,`ai`.`aicustomtext4` AS `aicustomtext4`,`ai`.`aicustomtext5` AS `aicustomtext5`,`ai`.`aicustomint1` AS `aicustomint1`,`ai`.`aicustomint2` AS `aicustomint2`,`ai`.`aicustomint3` AS `aicustomint3`,`ai`.`aicustomdbl1` AS `aicustomdbl1`,`ai`.`aicustomdbl2` AS `aicustomdbl2`,`ai`.`aicustomdbl3` AS `aicustomdbl3`,`ai`.`aicustomdate1` AS `aicustomdate1`,`ai`.`aicustomdate2` AS `aicustomdate2`,`ai`.`aicustomdate3` AS `aicustomdate3`,`pc`.`pcnama` AS `pcnama`,`i`.`bkode` AS `bkode`,`i`.`bnama` AS `bnama`,`i`.`btipe` AS `btipe`,`i`.`bsatuan` AS `bsatuan`,(case `ai`.`aioperator` when 0 then 'Between' when 1 then '>=' when 2 then 'Multiple' else 'Unknown' end) AS `aioperatornama`, `aitgl1` AS `aitgl1`, `aitgl2` AS `aitgl2`, `ainopromo` AS `ainopromo` from ((`M_12_Pos_Additional_Item` `ai` join `m_12_pos_category` `pc` on((`ai`.`aikategori` = `pc`.`pckode`))) join `m1_item` `i` on((`ai`.`aiidbarang` = `i`.`bid`)))
```

```sql
select `aid`.`idaidetail` AS `idaidetail`,`aid`.`idai` AS `idai`,`aid`.`idbarang` AS `idbarang`,`aid`.`jml` AS `jml`,`i`.`bsatuan` AS `satuan`,`aid`.`customtext1` AS `customtext1`,`aid`.`customtext2` AS `customtext2`,`aid`.`customtext3` AS `customtext3`,`aid`.`customtext4` AS `customtext4`,`aid`.`customtext5` AS `customtext5`,`aid`.`customint1` AS `customint1`,`aid`.`customint2` AS `customint2`,`aid`.`customint3` AS `customint3`,`aid`.`customdbl1` AS `customdbl1`,`aid`.`customdbl2` AS `customdbl2`,`aid`.`customdbl3` AS `customdbl3`,`aid`.`customdate1` AS `customdate1`,`aid`.`customdate2` AS `customdate2`,`aid`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bnama` AS `namabarang`,`i`.`btipe` AS `tipebarang` from (`m_12_pos_additional_item_detail` `aid` join `m1_item` `i` on((`aid`.`idbarang` = `i`.`bid`)))
```

```sql
SELECT ai.aiid, i.bid AS bid, i.bkode AS bkode, i.bnama AS bnama, i.btipe AS btipe, i.bjenis AS bjenis, i.bkategori AS bkategori, i.bsatuan AS bsatuan, i.bsatuandefault AS bsatuandefault, i.bhpp AS bhpp, i.bbarcode AS bbarcode, i.bhargabeli AS bhargabeli, i.bhppaverage AS bhppaverage, pi.pihargajual1 AS bhargajual1, pi.pihargajual2 AS bhargajual2, pi.pihargajual3 AS bhargajual3, pi.pihargajual4 AS bhargajual4, pi.pihargajual5 AS bhargajual5, pi.pidiskonjual1 AS bdiskonjual1, pi.pidiskonjual2 AS bdiskonjual2, pi.pidiskonjual3 AS bdiskonjual3, pi.pidiskonjual4 AS bdiskonjual4, pi.pidiskonjual5 AS bdiskonjual5, i.bstok AS bstok, ifnull(sum(`ib`.`jmlbooking`),0) AS bstokbooking, i.bmarginminimal AS bmarginminimal, i.brekpersediaan AS brekpersediaan, i.brekpenjualan AS brekpenjualan, i.brekreturpenjualan AS brekreturpenjualan, i.brekdiskonpenjualan AS brekdiskonpenjualan, i.brekhargapokok AS brekhargapokok, i.brekreturpembelian AS brekreturpembelian, i.brekdiskonpembelian AS brekdiskonpembelian, i.brekkonsinyasi AS brekkonsinyasi, i.bserial AS bserial, i.bbatch AS bbatch, i.bnilaisatuan AS bnilaisatuan, i.bnilaisatuandefault AS bnilaisatuandefault, i.bsuplier AS bsuplier, c.kkode AS bsuplierkode, c.knama AS bsupliernama, f.fnamafile AS bnamafile, i.bapanjang AS bapanjang, i.balebar AS balebar, i.batinggi AS batinggi, pi.pistokminimal AS bstokminimal, pi.pistokmaksimal AS bstokmaksimal, pi.pistokreorder AS breorder, aid.jml, aid.customtext1, aid.customtext2, aid.customtext3, aid.customtext4, aid.customtext5, aid.customint1, aid.customint2, aid.customint3, aid.customdbl1, aid.customdbl2, aid.customdbl3, aid.customdate1, aid.customdate2, aid.customdate3 from `m1_item` `i` JOIN m_12_pos_additional_item_detail aid ON i.bid = aid.idbarang JOIN m_12_pos_additional_item ai ON aid.idai = ai.aiid JOIN m_12_pos_item pi ON aid.idbarang = pi.piidbarang AND ai.aikategori = pi.pikategori left join `m1_item_booking` `ib` on `i`.`bid` = `ib`.`idbarang` left join `m1_contact` `c` on `i`.`bsuplier` = `c`.`kid` left join `m1_files` `f` on `f`.`fsumber` = 'Item' and `i`.`bid` = `f`.`fidtransaksi` and `f`.`fdefault` = 1
```

```sql
SELECT aid.idaidetail, aid.idai, aid.idbarang, aid.jml, aid.satuan, aid.customtext1, aid.customtext2, aid.customtext3, aid.customtext4, aid.customtext5, aid.customint1, aid.customint2, aid.customint3, aid.customdbl1, aid.customdbl2, aid.customdbl3, aid.customdate1, aid.customdate2, aid.customdate3 FROM m_12_pos_additional_item ai JOIN m_12_pos_additional_item_detail aid ON ai.aiid = aid.idai
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_pos_bonus_item.vb`

```sql
SELECT bi.bikategori as kategori, bi.biidbarang as idbarang, bi.bioperator as operator, i.bkode, (CASE bi.bioperator WHEN 0 THEN 'Between' WHEN 1 THEN '>=' WHEN 2 THEN 'Multiple' ELSE 'Unknown' END) as operatornama FROM m_12_pos_bonus_item bi JOIN m1_item i ON bi.biidbarang = i.bid WHERE bi.bikategori = '{FxDB_drutama}bikategori' AND bi.biidbarang = '{FxDB_drutama}biidbarang' AND bi.biid <> '{FxDB_drutama}biid' GROUP BY bi.bioperator ORDER BY bi.bioperator
```

```sql
SELECT COUNT(biid) FROM M_12_Pos_Bonus_Item WHERE biid = '{result_4}'
```

```sql
Update M_12_Pos_Bonus_Item set bikategori = '{FixQuotes_drutama}bikategori', biidbarang = '{FixQuotes_drutama}biidbarang', bioperator = '{FixQuotes_drutama}bioperator', bijml1 = '{FixDouble_drutama}bijml1', bijml2 = '{FixDouble_drutama}bijml2', bicustomtext1 = '{FixQuotes_drutama}bicustomtext1', bicustomtext2 = '{FixQuotes_drutama}bicustomtext2', bicustomtext3 = '{FixQuotes_drutama}bicustomtext3', bicustomtext4 = '{FixQuotes_drutama}bicustomtext4', bicustomtext5 = '{FixQuotes_drutama}bicustomtext5', bicustomint1 = {drutama}bicustomint1, bicustomint2 = {drutama}bicustomint2, bicustomint3 = {drutama}bicustomint3, bicustomdbl1 = '{FixDouble_drutama}bicustomdbl1', bicustomdbl2 = '{FixDouble_drutama}bicustomdbl2', bicustomdbl3 = '{FixDouble_drutama}bicustomdbl3', bicustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}bicustomdate1', bicustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}bicustomdate2', bicustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}bicustomdate3', bitgl1 = '{FixQuotes_drutama}bitgl1', bitgl2 = '{FixQuotes_drutama}bitgl2', binopromo = '{FixQuotes_drutama}binopromo' where biid = '{drutama}biid'
```

```sql
Insert into M_12_Pos_Bonus_Item (bikategori, biidbarang, bioperator, bijml1, bijml2, bicustomtext1, bicustomtext2, bicustomtext3, bicustomtext4, bicustomtext5, bicustomint1, bicustomint2, bicustomint3, bicustomdbl1, bicustomdbl2, bicustomdbl3, bicustomdate1, bicustomdate2, bicustomdate3, bitgl1, bitgl2, binopromo) values('{FixQuotes_drutama}bikategori', '{FixQuotes_drutama}biidbarang', '{FixQuotes_drutama}bioperator', '{FixDouble_drutama}bijml1', '{FixDouble_drutama}bijml2', '{FixQuotes_drutama}bicustomtext1', '{FixQuotes_drutama}bicustomtext2', '{FixQuotes_drutama}bicustomtext3', '{FixQuotes_drutama}bicustomtext4', '{FixQuotes_drutama}bicustomtext5', {drutama}bicustomint1, {drutama}bicustomint2, {drutama}bicustomint3, '{FixDouble_drutama}bicustomdbl1', '{FixDouble_drutama}bicustomdbl2', '{FixDouble_drutama}bicustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}bicustomdate1', '{FixQuotes_AsFormatTanggal_drutama}bicustomdate2', '{FixQuotes_AsFormatTanggal_drutama}bicustomdate3', '{FixQuotes_drutama}bitgl1', '{FixQuotes_drutama}bitgl2', '{FixQuotes_drutama}binopromo')
```

```sql
select biid from M_12_Pos_Bonus_Item where bikategori = '{drutama}bikategori' AND biidbarang = '{drutama}biidbarang' AND bioperator = '{drutama}bioperator' AND bijml1 = '{drutama}bijml1' AND bijml2 = '{drutama}bijml2' limit 1
```

```sql
Delete from M_12_Pos_Bonus_Item_Detail where idbi = '{result_4}'
```

```sql
Insert into M_12_Pos_Bonus_Item_Detail(idbidetail, idbi, idbarang, jml, satuan, customtext1, customtext2, customtext3, customtext4, customtext5, customint1, customint2, customint3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
SELECT bikategori as kategoripos FROM M_12_Pos_Bonus_Item WHERE biid = '{idtransaksi}' GROUP BY bikategori
```

```sql
DELETE FROM M_12_Pos_Bonus_Item_Detail WHERE idbi = '{idtransaksi}'
```

```sql
DELETE FROM M_12_Pos_Bonus_Item WHERE biid = '{idtransaksi}'
```

```sql
Delete from M_12_Pos_Bonus_Item
```

```sql
Delete from M_12_Pos_Bonus_Item_Detail
```

```sql
Insert into M_12_Pos_Bonus_Item(biid, bikategori, biidbarang, bioperator, bijml1, bijml2, bicustomtext1, bicustomtext2, bicustomtext3, bicustomtext4, bicustomtext5, bicustomint1, bicustomint2, bicustomint3, bicustomdbl1, bicustomdbl2, bicustomdbl3, bicustomdate1, bicustomdate2, bicustomdate3) values{strValue1_ToString}
```

```sql
select `bi`.`biid` AS `biid`,`bi`.`bikategori` AS `bikategori`,`bi`.`biidbarang` AS `biidbarang`,`bi`.`bioperator` AS `bioperator`,`bi`.`bijml1` AS `bijml1`,`bi`.`bijml2` AS `bijml2`,`bi`.`bicustomtext1` AS `bicustomtext1`,`bi`.`bicustomtext2` AS `bicustomtext2`,`bi`.`bicustomtext3` AS `bicustomtext3`,`bi`.`bicustomtext4` AS `bicustomtext4`,`bi`.`bicustomtext5` AS `bicustomtext5`,`bi`.`bicustomint1` AS `bicustomint1`,`bi`.`bicustomint2` AS `bicustomint2`,`bi`.`bicustomint3` AS `bicustomint3`,`bi`.`bicustomdbl1` AS `bicustomdbl1`,`bi`.`bicustomdbl2` AS `bicustomdbl2`,`bi`.`bicustomdbl3` AS `bicustomdbl3`,`bi`.`bicustomdate1` AS `bicustomdate1`,`bi`.`bicustomdate2` AS `bicustomdate2`,`bi`.`bicustomdate3` AS `bicustomdate3`,`pc`.`pcnama` AS `pcnama`,`i`.`bkode` AS `bkode`,`i`.`bnama` AS `bnama`,`i`.`btipe` AS `btipe`,`i`.`bsatuan` AS `bsatuan`,(case `bi`.`bioperator` when 0 then 'Between' when 1 then '>=' when 2 then 'Multiple' else 'Unknown' end) AS `bioperatornama`, `bi`.`bitgl1` AS `bitgl1`, `bi`.`bitgl2` AS `bitgl2`, `bi`.`binopromo` AS `binopromo`, `bid`.`idbidetail` AS `idbidetail`,`bid`.`idbi` AS `idbi`,`bid`.`idbarang` AS `idbarang`,`bid`.`jml` AS `jml`,`i2`.`bsatuan` AS `satuan`,`bid`.`customtext1` AS `customtext1`,`bid`.`customtext2` AS `customtext2`,`bid`.`customtext3` AS `customtext3`,`bid`.`customtext4` AS `customtext4`,`bid`.`customtext5` AS `customtext5`,`bid`.`customint1` AS `customint1`,`bid`.`customint2` AS `customint2`,`bid`.`customint3` AS `customint3`,`bid`.`customdbl1` AS `customdbl1`,`bid`.`customdbl2` AS `customdbl2`,`bid`.`customdbl3` AS `customdbl3`,`bid`.`customdate1` AS `customdate1`,`bid`.`customdate2` AS `customdate2`,`bid`.`customdate3` AS `customdate3`,`i2`.`bkode` AS `kodebarang`,`i2`.`bnama` AS `namabarang`,`i2`.`btipe` AS `tipebarang` from ((((`m_12_pos_bonus_item` `bi` join `m_12_pos_category` `pc` on((`bi`.`bikategori` = `pc`.`pckode`))) join `m1_item` `i` on((`bi`.`biidbarang` = `i`.`bid`))) join `m_12_pos_bonus_item_detail` `bid` on((`bi`.`biid` = `bid`.`idbi`))) join `m1_item` `i2` on((`bid`.`idbarang` = `i2`.`bid`)))
```

```sql
select `bi`.`biid` AS `biid`,`bi`.`bikategori` AS `bikategori`,`bi`.`biidbarang` AS `biidbarang`,`bi`.`bioperator` AS `bioperator`,`bi`.`bijml1` AS `bijml1`,`bi`.`bijml2` AS `bijml2`,`bi`.`bicustomtext1` AS `bicustomtext1`,`bi`.`bicustomtext2` AS `bicustomtext2`,`bi`.`bicustomtext3` AS `bicustomtext3`,`bi`.`bicustomtext4` AS `bicustomtext4`,`bi`.`bicustomtext5` AS `bicustomtext5`,`bi`.`bicustomint1` AS `bicustomint1`,`bi`.`bicustomint2` AS `bicustomint2`,`bi`.`bicustomint3` AS `bicustomint3`,`bi`.`bicustomdbl1` AS `bicustomdbl1`,`bi`.`bicustomdbl2` AS `bicustomdbl2`,`bi`.`bicustomdbl3` AS `bicustomdbl3`,`bi`.`bicustomdate1` AS `bicustomdate1`,`bi`.`bicustomdate2` AS `bicustomdate2`,`bi`.`bicustomdate3` AS `bicustomdate3`,`pc`.`pcnama` AS `pcnama`,`i`.`bkode` AS `bkode`,`i`.`bnama` AS `bnama`,`i`.`btipe` AS `btipe`,`i`.`bsatuan` AS `bsatuan`,(case `bi`.`bioperator` when 0 then 'Between' when 1 then '>=' when 2 then 'Multiple' else 'Unknown' end) AS `bioperatornama`, `bi`.`bitgl1` AS `bitgl1`, `bi`.`bitgl2` AS `bitgl2`, `bi`.`binopromo` AS `binopromo` from ((`m_12_pos_bonus_item` `bi` join `m_12_pos_category` `pc` on((`bi`.`bikategori` = `pc`.`pckode`))) join `m1_item` `i` on((`bi`.`biidbarang` = `i`.`bid`)))
```

```sql
select `bid`.`idbidetail` AS `idbidetail`,`bid`.`idbi` AS `idbi`,`bid`.`idbarang` AS `idbarang`,`bid`.`jml` AS `jml`,`i`.`bsatuan` AS `satuan`,`bid`.`customtext1` AS `customtext1`,`bid`.`customtext2` AS `customtext2`,`bid`.`customtext3` AS `customtext3`,`bid`.`customtext4` AS `customtext4`,`bid`.`customtext5` AS `customtext5`,`bid`.`customint1` AS `customint1`,`bid`.`customint2` AS `customint2`,`bid`.`customint3` AS `customint3`,`bid`.`customdbl1` AS `customdbl1`,`bid`.`customdbl2` AS `customdbl2`,`bid`.`customdbl3` AS `customdbl3`,`bid`.`customdate1` AS `customdate1`,`bid`.`customdate2` AS `customdate2`,`bid`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bnama` AS `namabarang`,`i`.`btipe` AS `tipebarang` from (`m_12_pos_bonus_item_detail` `bid` join `m1_item` `i` on((`bid`.`idbarang` = `i`.`bid`)))
```

```sql
SELECT bi.biid, i.bid AS bid, i.bkode AS bkode, i.bnama AS bnama, i.btipe AS btipe, i.bjenis AS bjenis, i.bkategori AS bkategori, i.bsatuan AS bsatuan, i.bsatuandefault AS bsatuandefault, i.bhpp AS bhpp, i.bbarcode AS bbarcode, i.bhargabeli AS bhargabeli, i.bhppaverage AS bhppaverage, pi.pihargajual1 AS bhargajual1, pi.pihargajual2 AS bhargajual2, pi.pihargajual3 AS bhargajual3, pi.pihargajual4 AS bhargajual4, pi.pihargajual5 AS bhargajual5, pi.pidiskonjual1 AS bdiskonjual1, pi.pidiskonjual2 AS bdiskonjual2, pi.pidiskonjual3 AS bdiskonjual3, pi.pidiskonjual4 AS bdiskonjual4, pi.pidiskonjual5 AS bdiskonjual5, i.bstok AS bstok, ifnull(sum(`ib`.`jmlbooking`),0) AS bstokbooking, i.bmarginminimal AS bmarginminimal, i.brekpersediaan AS brekpersediaan, i.brekpenjualan AS brekpenjualan, i.brekreturpenjualan AS brekreturpenjualan, i.brekdiskonpenjualan AS brekdiskonpenjualan, i.brekhargapokok AS brekhargapokok, i.brekreturpembelian AS brekreturpembelian, i.brekdiskonpembelian AS brekdiskonpembelian, i.brekkonsinyasi AS brekkonsinyasi, i.bserial AS bserial, i.bbatch AS bbatch, i.bnilaisatuan AS bnilaisatuan, i.bnilaisatuandefault AS bnilaisatuandefault, i.bsuplier AS bsuplier, c.kkode AS bsuplierkode, c.knama AS bsupliernama, f.fnamafile AS bnamafile, i.bapanjang AS bapanjang, i.balebar AS balebar, i.batinggi AS batinggi, pi.pistokminimal AS bstokminimal, pi.pistokmaksimal AS bstokmaksimal, pi.pistokreorder AS breorder, bid.jml from `m1_item` `i` JOIN m_12_pos_bonus_item_detail bid ON i.bid = bid.idbarang JOIN m_12_pos_bonus_item bi ON bid.idbi = bi.biid JOIN m_12_pos_item pi ON bid.idbarang = pi.piidbarang AND bi.bikategori = pi.pikategori left join `m1_item_booking` `ib` on `i`.`bid` = `ib`.`idbarang` left join `m1_contact` `c` on `i`.`bsuplier` = `c`.`kid` left join `m1_files` `f` on `f`.`fsumber` = 'Item' and `i`.`bid` = `f`.`fidtransaksi` and `f`.`fdefault` = 1
```

```sql
SELECT bid.idbidetail, bid.idbi, bid.idbarang, bid.jml, bid.satuan, bid.customtext1, bid.customtext2, bid.customtext3, bid.customtext4, bid.customtext5, bid.customint1, bid.customint2, bid.customint3, bid.customdbl1, bid.customdbl2, bid.customdbl3, bid.customdate1, bid.customdate2, bid.customdate3 FROM m_12_pos_bonus_item bi JOIN m_12_pos_bonus_item_detail bid ON bi.biid = bid.idbi
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_pos_bonus_trans.vb`

```sql
SELECT bi.bikategori as kategori, bi.biidbarang as idbarang, bi.bioperator as operator, i.bkode, (CASE bi.bioperator WHEN 0 THEN 'Between' WHEN 1 THEN '>=' WHEN 2 THEN 'Multiple' ELSE 'Unknown' END) as operatornama FROM m_12_pos_bonus_Trans bi LEFT JOIN m1_item i ON bi.biidbarang = i.bid WHERE bi.bikategori = '{FxDB_drutama}bikategori' AND bi.biidbarang = '{FxDB_drutama}biidbarang' AND bi.biid <> '{FxDB_drutama}biid' GROUP BY bi.bioperator ORDER BY bi.bioperator
```

```sql
SELECT COUNT(biid) FROM M_12_Pos_Bonus_Trans WHERE biid = '{result_4}'
```

```sql
Update M_12_Pos_Bonus_Trans set bikategori = '{FixQuotes_drutama}bikategori', biidbarang = '{FixQuotes_drutama}biidbarang', bioperator = '{FixQuotes_drutama}bioperator', bijml1 = '{FixDouble_drutama}bijml1', bijml2 = '{FixDouble_drutama}bijml2', bicustomtext1 = '{FixQuotes_drutama}bicustomtext1', bicustomtext2 = '{FixQuotes_drutama}bicustomtext2', bicustomtext3 = '{FixQuotes_drutama}bicustomtext3', bicustomtext4 = '{FixQuotes_drutama}bicustomtext4', bicustomtext5 = '{FixQuotes_drutama}bicustomtext5', bicustomint1 = {drutama}bicustomint1, bicustomint2 = {drutama}bicustomint2, bicustomint3 = {drutama}bicustomint3, bicustomdbl1 = '{FixDouble_drutama}bicustomdbl1', bicustomdbl2 = '{FixDouble_drutama}bicustomdbl2', bicustomdbl3 = '{FixDouble_drutama}bicustomdbl3', bicustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}bicustomdate1', bicustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}bicustomdate2', bicustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}bicustomdate3', bitgl1 = '{FixQuotes_drutama}bitgl1', bitgl2 = '{FixQuotes_drutama}bitgl2', binopromo = '{FixQuotes_drutama}binopromo' where biid = '{drutama}biid'
```

```sql
Insert into M_12_Pos_Bonus_Trans (bikategori, biidbarang, bioperator, bijml1, bijml2, bicustomtext1, bicustomtext2, bicustomtext3, bicustomtext4, bicustomtext5, bicustomint1, bicustomint2, bicustomint3, bicustomdbl1, bicustomdbl2, bicustomdbl3, bicustomdate1, bicustomdate2, bicustomdate3, bitgl1, bitgl2, binopromo) values('{FixQuotes_drutama}bikategori', '{FixQuotes_drutama}biidbarang', '{FixQuotes_drutama}bioperator', '{FixDouble_drutama}bijml1', '{FixDouble_drutama}bijml2', '{FixQuotes_drutama}bicustomtext1', '{FixQuotes_drutama}bicustomtext2', '{FixQuotes_drutama}bicustomtext3', '{FixQuotes_drutama}bicustomtext4', '{FixQuotes_drutama}bicustomtext5', {drutama}bicustomint1, {drutama}bicustomint2, {drutama}bicustomint3, '{FixDouble_drutama}bicustomdbl1', '{FixDouble_drutama}bicustomdbl2', '{FixDouble_drutama}bicustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}bicustomdate1', '{FixQuotes_AsFormatTanggal_drutama}bicustomdate2', '{FixQuotes_AsFormatTanggal_drutama}bicustomdate3', '{FixQuotes_drutama}bitgl1', '{FixQuotes_drutama}bitgl2', '{FixQuotes_drutama}binopromo')
```

```sql
select biid from M_12_Pos_Bonus_Trans where bikategori = '{drutama}bikategori' AND biidbarang = '{drutama}biidbarang' AND bioperator = '{drutama}bioperator' AND bijml1 = '{drutama}bijml1' AND bijml2 = '{drutama}bijml2' limit 1
```

```sql
Delete from M_12_Pos_Bonus_Trans_Detail where idbi = '{result_4}'
```

```sql
Insert into M_12_Pos_Bonus_Trans_Detail(idbidetail, idbi, idbarang, jml, satuan, customtext1, customtext2, customtext3, customtext4, customtext5, customint1, customint2, customint3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
SELECT bikategori as kategoripos FROM M_12_Pos_Bonus_Trans WHERE biid = '{idtransaksi}' GROUP BY bikategori
```

```sql
DELETE FROM M_12_Pos_Bonus_Trans_Detail WHERE idbi = '{idtransaksi}'
```

```sql
DELETE FROM M_12_Pos_Bonus_Trans WHERE biid = '{idtransaksi}'
```

```sql
Delete from M_12_Pos_Bonus_Trans
```

```sql
Delete from M_12_Pos_Bonus_Trans_Detail
```

```sql
Insert into M_12_Pos_Bonus_Trans(biid, bikategori, biidbarang, bioperator, bijml1, bijml2, bicustomtext1, bicustomtext2, bicustomtext3, bicustomtext4, bicustomtext5, bicustomint1, bicustomint2, bicustomint3, bicustomdbl1, bicustomdbl2, bicustomdbl3, bicustomdate1, bicustomdate2, bicustomdate3) values{strValue1_ToString}
```

```sql
select `bi`.`biid` AS `biid`,`bi`.`bikategori` AS `bikategori`,`bi`.`biidbarang` AS `biidbarang`,`bi`.`bioperator` AS `bioperator`,`bi`.`bijml1` AS `bijml1`,`bi`.`bijml2` AS `bijml2`,`bi`.`bicustomtext1` AS `bicustomtext1`,`bi`.`bicustomtext2` AS `bicustomtext2`,`bi`.`bicustomtext3` AS `bicustomtext3`,`bi`.`bicustomtext4` AS `bicustomtext4`,`bi`.`bicustomtext5` AS `bicustomtext5`,`bi`.`bicustomint1` AS `bicustomint1`,`bi`.`bicustomint2` AS `bicustomint2`,`bi`.`bicustomint3` AS `bicustomint3`,`bi`.`bicustomdbl1` AS `bicustomdbl1`,`bi`.`bicustomdbl2` AS `bicustomdbl2`,`bi`.`bicustomdbl3` AS `bicustomdbl3`,`bi`.`bicustomdate1` AS `bicustomdate1`,`bi`.`bicustomdate2` AS `bicustomdate2`,`bi`.`bicustomdate3` AS `bicustomdate3`,`pc`.`pcnama` AS `pcnama`,`i`.`bkode` AS `bkode`,`i`.`bnama` AS `bnama`,`i`.`btipe` AS `btipe`,`i`.`bsatuan` AS `bsatuan`,(case `bi`.`bioperator` when 0 then 'Between' when 1 then '>=' when 2 then 'Multiple' else 'Unknown' end) AS `bioperatornama`, `bi`.`bitgl1` AS `bitgl1`, `bi`.`bitgl2` AS `bitgl2`, `bi`.`binopromo` AS `binopromo`, `bid`.`idbidetail` AS `idbidetail`,`bid`.`idbi` AS `idbi`,`bid`.`idbarang` AS `idbarang`,`bid`.`jml` AS `jml`,`i2`.`bsatuan` AS `satuan`,`bid`.`customtext1` AS `customtext1`,`bid`.`customtext2` AS `customtext2`,`bid`.`customtext3` AS `customtext3`,`bid`.`customtext4` AS `customtext4`,`bid`.`customtext5` AS `customtext5`,`bid`.`customint1` AS `customint1`,`bid`.`customint2` AS `customint2`,`bid`.`customint3` AS `customint3`,`bid`.`customdbl1` AS `customdbl1`,`bid`.`customdbl2` AS `customdbl2`,`bid`.`customdbl3` AS `customdbl3`,`bid`.`customdate1` AS `customdate1`,`bid`.`customdate2` AS `customdate2`,`bid`.`customdate3` AS `customdate3`,`i2`.`bkode` AS `kodebarang`,`i2`.`bnama` AS `namabarang`,`i2`.`btipe` AS `tipebarang` from ((((`m_12_pos_bonus_Trans` `bi` join `m_12_pos_category` `pc` on((`bi`.`bikategori` = `pc`.`pckode`))) left join `m1_item` `i` on((`bi`.`biidbarang` = `i`.`bid`))) join `m_12_pos_bonus_Trans_detail` `bid` on((`bi`.`biid` = `bid`.`idbi`))) left join `m1_item` `i2` on((`bid`.`idbarang` = `i2`.`bid`)))
```

```sql
select bi.biid AS biid, bi.bikategori AS bikategori, bi.biidbarang AS biidbarang, bi.bioperator AS bioperator, bi.bijml1 AS bijml1, bi.bijml2 AS bijml2, bi.bicustomtext1 AS bicustomtext1, bi.bicustomtext2 AS bicustomtext2, bi.bicustomtext3 AS bicustomtext3, bi.bicustomtext4 AS bicustomtext4, bi.bicustomtext5 AS bicustomtext5, bi.bicustomint1 AS bicustomint1, bi.bicustomint2 AS bicustomint2, bi.bicustomint3 AS bicustomint3, bi.bicustomdbl1 AS bicustomdbl1, bi.bicustomdbl2 AS bicustomdbl2, bi.bicustomdbl3 AS bicustomdbl3, bi.bicustomdate1 AS bicustomdate1, bi.bicustomdate2 AS bicustomdate2, bi.bicustomdate3 AS bicustomdate3, pc.pcnama AS pcnama, i.bkode AS bkode, i.bnama AS bnama, i.btipe AS btipe, i.bsatuan AS bsatuan, (case bi.bioperator when 0 then 'Between' when 1 then '>=' when 2 then 'Multiple' else 'Unknown' end) AS bioperatornama, bi.bitgl1 AS bitgl1, bi.bitgl2 AS bitgl2, bi.binopromo AS binopromo, bid.idbidetail AS idbidetail, bid.idbi AS idbi, bid.idbarang AS idbarang, bid.jml AS jml, i2.bsatuan AS satuan, bid.customtext1 AS customtext1, bid.customtext2 AS customtext2, bid.customtext3 AS customtext3, bid.customtext4 AS customtext4, bid.customtext5 AS customtext5, bid.customint1 AS customint1, bid.customint2 AS customint2, bid.customint3 AS customint3, bid.customdbl1 AS customdbl1, bid.customdbl2 AS customdbl2, bid.customdbl3 AS customdbl3, bid.customdate1 AS customdate1, bid.customdate2 AS customdate2, bid.customdate3 AS customdate3, i2.bkode AS kodebarang, i2.bnama AS namabarang, i2.btipe AS tipebarang from m_12_pos_bonus_Trans bi join m_12_pos_category pc on bi.bikategori = pc.pckode join m_12_pos_bonus_Trans_detail bid on bi.biid = bid.idbi left join m1_item i on bi.biidbarang = i.bid left join m1_item i2 on bid.idbarang = i2.bid
```

```sql
select `bi`.`biid` AS `biid`,`bi`.`bikategori` AS `bikategori`,`bi`.`biidbarang` AS `biidbarang`,`bi`.`bioperator` AS `bioperator`,`bi`.`bijml1` AS `bijml1`,`bi`.`bijml2` AS `bijml2`,`bi`.`bicustomtext1` AS `bicustomtext1`,`bi`.`bicustomtext2` AS `bicustomtext2`,`bi`.`bicustomtext3` AS `bicustomtext3`,`bi`.`bicustomtext4` AS `bicustomtext4`,`bi`.`bicustomtext5` AS `bicustomtext5`,`bi`.`bicustomint1` AS `bicustomint1`,`bi`.`bicustomint2` AS `bicustomint2`,`bi`.`bicustomint3` AS `bicustomint3`,`bi`.`bicustomdbl1` AS `bicustomdbl1`,`bi`.`bicustomdbl2` AS `bicustomdbl2`,`bi`.`bicustomdbl3` AS `bicustomdbl3`,`bi`.`bicustomdate1` AS `bicustomdate1`,`bi`.`bicustomdate2` AS `bicustomdate2`,`bi`.`bicustomdate3` AS `bicustomdate3`,`pc`.`pcnama` AS `pcnama`,`i`.`bkode` AS `bkode`,`i`.`bnama` AS `bnama`,`i`.`btipe` AS `btipe`,`i`.`bsatuan` AS `bsatuan`,(case `bi`.`bioperator` when 0 then 'Between' when 1 then '>=' when 2 then 'Multiple' else 'Unknown' end) AS `bioperatornama`, `bi`.`bitgl1` AS `bitgl1`, `bi`.`bitgl2` AS `bitgl2`, `bi`.`binopromo` AS `binopromo` from ((`m_12_pos_bonus_Trans` `bi` join `m_12_pos_category` `pc` on((`bi`.`bikategori` = `pc`.`pckode`))) left join `m1_item` `i` on((`bi`.`biidbarang` = `i`.`bid`)))
```

```sql
select bi.biid AS biid, bi.bikategori AS bikategori, bi.biidbarang AS biidbarang, bi.bioperator AS bioperator, bi.bijml1 AS bijml1, bi.bijml2 AS bijml2, bi.bicustomtext1 AS bicustomtext1, bi.bicustomtext2 AS bicustomtext2, bi.bicustomtext3 AS bicustomtext3, bi.bicustomtext4 AS bicustomtext4, bi.bicustomtext5 AS bicustomtext5, bi.bicustomint1 AS bicustomint1, bi.bicustomint2 AS bicustomint2, bi.bicustomint3 AS bicustomint3, bi.bicustomdbl1 AS bicustomdbl1, bi.bicustomdbl2 AS bicustomdbl2, bi.bicustomdbl3 AS bicustomdbl3, bi.bicustomdate1 AS bicustomdate1, bi.bicustomdate2 AS bicustomdate2, bi.bicustomdate3 AS bicustomdate3, pc.pcnama AS pcnama, i.bkode AS bkode, i.bnama AS bnama, i.btipe AS btipe, i.bsatuan AS bsatuan, (case bi.bioperator when 0 then 'Between' when 1 then '>=' when 2 then 'Multiple' else 'Unknown' end) AS bioperatornama, bi.bitgl1 AS bitgl1, bi.bitgl2 AS bitgl2, bi.binopromo AS binopromo from m_12_pos_bonus_Trans bi join m_12_pos_category pc on bi.bikategori = pc.pckode left join m1_item i on bi.biidbarang = i.bid
```

```sql
select `bid`.`idbidetail` AS `idbidetail`,`bid`.`idbi` AS `idbi`,`bid`.`idbarang` AS `idbarang`,`bid`.`jml` AS `jml`,`i`.`bsatuan` AS `satuan`,`bid`.`customtext1` AS `customtext1`,`bid`.`customtext2` AS `customtext2`,`bid`.`customtext3` AS `customtext3`,`bid`.`customtext4` AS `customtext4`,`bid`.`customtext5` AS `customtext5`,`bid`.`customint1` AS `customint1`,`bid`.`customint2` AS `customint2`,`bid`.`customint3` AS `customint3`,`bid`.`customdbl1` AS `customdbl1`,`bid`.`customdbl2` AS `customdbl2`,`bid`.`customdbl3` AS `customdbl3`,`bid`.`customdate1` AS `customdate1`,`bid`.`customdate2` AS `customdate2`,`bid`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bnama` AS `namabarang`,`i`.`btipe` AS `tipebarang` from (`m_12_pos_bonus_Trans_detail` `bid` left join `m1_item` `i` on((`bid`.`idbarang` = `i`.`bid`)))
```

```sql
select bid.idbidetail AS idbidetail, bid.idbi AS idbi, bid.idbarang AS idbarang, bid.jml AS jml, i.bsatuan AS satuan, bid.customtext1 AS customtext1, bid.customtext2 AS customtext2, bid.customtext3 AS customtext3, bid.customtext4 AS customtext4, bid.customtext5 AS customtext5, bid.customint1 AS customint1, bid.customint2 AS customint2, bid.customint3 AS customint3, bid.customdbl1 AS customdbl1, bid.customdbl2 AS customdbl2, bid.customdbl3 AS customdbl3, bid.customdate1 AS customdate1, bid.customdate2 AS customdate2, bid.customdate3 AS customdate3, i.bkode AS kodebarang, i.bnama AS namabarang, i.btipe AS tipebarang from m_12_pos_bonus_Trans_detail bid left join m1_item i on bid.idbarang = i.bid
```

```sql
SELECT bi.biid, i.bid AS bid, i.bkode AS bkode, i.bnama AS bnama, i.btipe AS btipe, i.bjenis AS bjenis, i.bkategori AS bkategori, i.bsatuan AS bsatuan, i.bsatuandefault AS bsatuandefault, i.bhpp AS bhpp, i.bbarcode AS bbarcode, i.bhargabeli AS bhargabeli, i.bhppaverage AS bhppaverage, pi.pihargajual1 AS bhargajual1, pi.pihargajual2 AS bhargajual2, pi.pihargajual3 AS bhargajual3, pi.pihargajual4 AS bhargajual4, pi.pihargajual5 AS bhargajual5, pi.pidiskonjual1 AS bdiskonjual1, pi.pidiskonjual2 AS bdiskonjual2, pi.pidiskonjual3 AS bdiskonjual3, pi.pidiskonjual4 AS bdiskonjual4, pi.pidiskonjual5 AS bdiskonjual5, i.bstok AS bstok, ifnull(sum(`ib`.`jmlbooking`),0) AS bstokbooking, i.bmarginminimal AS bmarginminimal, i.brekpersediaan AS brekpersediaan, i.brekpenjualan AS brekpenjualan, i.brekreturpenjualan AS brekreturpenjualan, i.brekdiskonpenjualan AS brekdiskonpenjualan, i.brekhargapokok AS brekhargapokok, i.brekreturpembelian AS brekreturpembelian, i.brekdiskonpembelian AS brekdiskonpembelian, i.brekkonsinyasi AS brekkonsinyasi, i.bserial AS bserial, i.bbatch AS bbatch, i.bnilaisatuan AS bnilaisatuan, i.bnilaisatuandefault AS bnilaisatuandefault, i.bsuplier AS bsuplier, c.kkode AS bsuplierkode, c.knama AS bsupliernama, f.fnamafile AS bnamafile, i.bapanjang AS bapanjang, i.balebar AS balebar, i.batinggi AS batinggi, pi.pistokminimal AS bstokminimal, pi.pistokmaksimal AS bstokmaksimal, pi.pistokreorder AS breorder, bid.jml from `m1_item` `i` JOIN m_12_pos_bonus_Trans_detail bid ON i.bid = bid.idbarang JOIN m_12_pos_bonus_Trans bi ON bid.idbi = bi.biid JOIN m_12_pos_item pi ON bid.idbarang = pi.piidbarang AND bi.bikategori = pi.pikategori left join `m1_item_booking` `ib` on `i`.`bid` = `ib`.`idbarang` left join `m1_contact` `c` on `i`.`bsuplier` = `c`.`kid` left join `m1_files` `f` on `f`.`fsumber` = 'Item' and `i`.`bid` = `f`.`fidtransaksi` and `f`.`fdefault` = 1
```

```sql
SELECT bi.biid, i.bid AS bid, i.bkode AS bkode, i.bnama AS bnama, i.btipe AS btipe, i.bjenis AS bjenis, i.bkategori AS bkategori, i.bsatuan AS bsatuan, i.bsatuandefault AS bsatuandefault, i.bhpp AS bhpp, i.bbarcode AS bbarcode, i.bhargabeli AS bhargabeli, i.bhppaverage AS bhppaverage, pi.pihargajual1 AS bhargajual1, pi.pihargajual2 AS bhargajual2, pi.pihargajual3 AS bhargajual3, pi.pihargajual4 AS bhargajual4, pi.pihargajual5 AS bhargajual5, pi.pidiskonjual1 AS bdiskonjual1, pi.pidiskonjual2 AS bdiskonjual2, pi.pidiskonjual3 AS bdiskonjual3, pi.pidiskonjual4 AS bdiskonjual4, pi.pidiskonjual5 AS bdiskonjual5, i.bstok AS bstok, ifnull(sum(ib.jmlbooking), 0) AS bstokbooking, i.bmarginminimal AS bmarginminimal, i.brekpersediaan AS brekpersediaan, i.brekpenjualan AS brekpenjualan, i.brekreturpenjualan AS brekreturpenjualan, i.brekdiskonpenjualan AS brekdiskonpenjualan, i.brekhargapokok AS brekhargapokok, i.brekreturpembelian AS brekreturpembelian, i.brekdiskonpembelian AS brekdiskonpembelian, i.brekkonsinyasi AS brekkonsinyasi, i.bserial AS bserial, i.bbatch AS bbatch, i.bnilaisatuan AS bnilaisatuan, i.bnilaisatuandefault AS bnilaisatuandefault, i.bsuplier AS bsuplier, c.kkode AS bsuplierkode, c.knama AS bsupliernama, f.fnamafile AS bnamafile, i.bapanjang AS bapanjang, i.balebar AS balebar, i.batinggi AS batinggi, pi.pistokminimal AS bstokminimal, pi.pistokmaksimal AS bstokmaksimal, pi.pistokreorder AS breorder, bid.jml from m_12_pos_bonus_Trans_detail bid JOIN m_12_pos_bonus_Trans bi ON bid.idbi = bi.biid left join m1_item i ON i.bid = bid.idbarang left join m_12_pos_item pi ON bid.idbarang = pi.piidbarang AND bi.bikategori = pi.pikategori left join m1_item_booking ib on i.bid = ib.idbarang left join m1_contact c on i.bsuplier = c.kid left join m1_files f on f.fsumber = 'Item' and i.bid = f.fidtransaksi and f.fdefault = 1
```

```sql
SELECT bid.idbidetail, bid.idbi, bid.idbarang, bid.jml, bid.satuan, bid.customtext1, bid.customtext2, bid.customtext3, bid.customtext4, bid.customtext5, bid.customint1, bid.customint2, bid.customint3, bid.customdbl1, bid.customdbl2, bid.customdbl3, bid.customdate1, bid.customdate2, bid.customdate3 FROM m_12_pos_bonus_Trans bi JOIN m_12_pos_bonus_Trans_detail bid ON bi.biid = bid.idbi
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_pos_category.vb`

```sql
Insert into M_12_Pos_Category(pckode, pcnama, pccatatan, pcaktif, pcinputuser, pcinputtgl, pcmodifikasiuser, pcmodifikasitgl, pccustomtext1, pccustomtext2, pccustomtext3, pccustomtext4, pccustomtext5, pccustomint1, pccustomint2, pccustomint3, pccustomdbl1, pccustomdbl2, pccustomdbl3, pccustomdate1, pccustomdate2, pccustomdate3, pctipepos, pcindeksharga) values{strValue2_ToString} ON DUPLICATE KEY UPDATE pcnama = VALUES(pcnama), pccatatan = VALUES(pccatatan), pcaktif = VALUES(pcaktif), pcmodifikasiuser = VALUES(pcmodifikasiuser), pcmodifikasitgl = NOW(), pccustomtext1 = VALUES(pccustomtext1), pccustomtext2 = VALUES(pccustomtext2), pccustomtext3 = VALUES(pccustomtext3), pccustomtext4 = VALUES(pccustomtext4), pccustomtext5 = VALUES(pccustomtext5), pccustomint1 = VALUES(pccustomint1), pccustomint2 = VALUES(pccustomint2), pccustomint3 = VALUES(pccustomint3), pccustomdbl1 = VALUES(pccustomdbl1), pccustomdbl2 = VALUES(pccustomdbl2), pccustomdbl3 = VALUES(pccustomdbl3), pccustomdate1 = VALUES(pccustomdate1), pccustomdate2 = VALUES(pccustomdate2), pccustomdate3 = VALUES(pccustomdate3), pctipepos = VALUES(pctipepos), pcindeksharga = VALUES(pcindeksharga)
```

```sql
DELETE FROM M_12_Pos_Category WHERE pckode = '{idtransaksi}'
```

```sql
select `pc`.`pckode` AS `pckode`, `pc`.`pcnama` AS `pcnama`, `pc`.`pccatatan` AS `pccatatan`, `pc`.`pcaktif` AS `pcaktif`, `pc`.`pcinputuser` AS `pcinputuser`, `pc`.`pcinputtgl` AS `pcinputtgl`, `pc`.`pcmodifikasiuser` AS `pcmodifikasiuser`, `pc`.`pcmodifikasitgl` AS `pcmodifikasitgl`, `pc`.`pccustomtext1` AS `pccustomtext1`, `pc`.`pccustomtext2` AS `pccustomtext2`, `pc`.`pccustomtext3` AS `pccustomtext3`, `pc`.`pccustomtext4` AS `pccustomtext4`, `pc`.`pccustomtext5` AS `pccustomtext5`, `pc`.`pccustomint1` AS `pccustomint1`, `pc`.`pccustomint2` AS `pccustomint2`, `pc`.`pccustomint3` AS `pccustomint3`, `pc`.`pccustomdbl1` AS `pccustomdbl1`, `pc`.`pccustomdbl2` AS `pccustomdbl2`, `pc`.`pccustomdbl3` AS `pccustomdbl3`, `pc`.`pccustomdate1` AS `pccustomdate1`, `pc`.`pccustomdate2` AS `pccustomdate2`, `pc`.`pccustomdate3` AS `pccustomdate3`, `u1`.`unama` AS `pcinputusernama`, `u2`.`unama` AS `pcmodifikasiusernama`, pc.pctipepos as pctipepos, pc.pcindeksharga as pcindeksharga, pt.ptnama as pctipeposnama, ip.ipnama as pcindeksharganama from `m_12_pos_category` `pc` left join `m0_user` `u1` on `pc`.`pcinputuser` = `u1`.`userid` left join `m0_user` `u2` on `pc`.`pcmodifikasiuser` = `u2`.`userid` left join m_12_pos_type pt on pc.pctipepos = pt.ptkode left join m1_index_price ip on pc.pcindeksharga = ip.ipkode
```

```sql
SELECT COUNT(pckode) FROM M_12_Pos_Category WHERE pckode='{idtransaksi}'
```

```sql
select pc.pckode AS pckode, pc.pcnama AS pcnama, s.skode AS sumber, CONCAT('Setting : ', s.smodule, ' - ', s.sgrup, ' - ', s.skode) AS idterkait from m0_setting s join m_12_pos_category pc on (s.smodule = 12 AND s.sgrup = 'company' AND s.skode = 'KategoriPOS' AND s.snilai = pc.pckode) WHERE pc.pckode = 'valkode' union all SELECT pc.pckode, pc.pcnama, 'Location' as sumber, l.lnama as idterkait FROM m_12_pos_category pc JOIN m1_location l ON pc.pckode = l.lkategoripos WHERE pc.pckode = 'valkode' GROUP BY pc.pckode, l.lkode
```

```sql
DELETE FROM M_12_Pos_Category
```

```sql
Insert into M_12_Pos_Category(pckode, pcnama, pccatatan, pcaktif, pcinputuser, pcinputtgl, pcmodifikasiuser, pcmodifikasitgl, pccustomtext1, pccustomtext2, pccustomtext3, pccustomtext4, pccustomtext5, pccustomint1, pccustomint2, pccustomint3, pccustomdbl1, pccustomdbl2, pccustomdbl3, pccustomdate1, pccustomdate2, pccustomdate3) values{strValue2_ToString} ON DUPLICATE KEY UPDATE pcnama = VALUES(pcnama), pccatatan = VALUES(pccatatan), pcaktif = VALUES(pcaktif), pcmodifikasiuser = VALUES(pcmodifikasiuser), pcmodifikasitgl = NOW(), pccustomtext1 = VALUES(pccustomtext1), pccustomtext2 = VALUES(pccustomtext2), pccustomtext3 = VALUES(pccustomtext3), pccustomtext4 = VALUES(pccustomtext4), pccustomtext5 = VALUES(pccustomtext5), pccustomint1 = VALUES(pccustomint1), pccustomint2 = VALUES(pccustomint2), pccustomint3 = VALUES(pccustomint3), pccustomdbl1 = VALUES(pccustomdbl1), pccustomdbl2 = VALUES(pccustomdbl2), pccustomdbl3 = VALUES(pccustomdbl3), pccustomdate1 = VALUES(pccustomdate1), pccustomdate2 = VALUES(pccustomdate2), pccustomdate3 = VALUES(pccustomdate3)
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_pos_category_history.vb`

```sql
INSERT INTO M_12_Pos_Category_history(SELECT 0, pc.* FROM M_12_Pos_Category pc WHERE pc.pckode = '{idtransaksi}')
```

```sql
select `pc`.`pcidhistory` AS `pcidhistory`, `pc`.`pckode` AS `pckode`, `pc`.`pcnama` AS `pcnama`, `pc`.`pccatatan` AS `pccatatan`, `pc`.`pcaktif` AS `pcaktif`, `pc`.`pcinputuser` AS `pcinputuser`, `pc`.`pcinputtgl` AS `pcinputtgl`, `pc`.`pcmodifikasiuser` AS `pcmodifikasiuser`, `pc`.`pcmodifikasitgl` AS `pcmodifikasitgl`, `pc`.`pccustomtext1` AS `pccustomtext1`, `pc`.`pccustomtext2` AS `pccustomtext2`, `pc`.`pccustomtext3` AS `pccustomtext3`, `pc`.`pccustomtext4` AS `pccustomtext4`, `pc`.`pccustomtext5` AS `pccustomtext5`, `pc`.`pccustomint1` AS `pccustomint1`, `pc`.`pccustomint2` AS `pccustomint2`, `pc`.`pccustomint3` AS `pccustomint3`, `pc`.`pccustomdbl1` AS `pccustomdbl1`, `pc`.`pccustomdbl2` AS `pccustomdbl2`, `pc`.`pccustomdbl3` AS `pccustomdbl3`, `pc`.`pccustomdate1` AS `pccustomdate1`, `pc`.`pccustomdate2` AS `pccustomdate2`, `pc`.`pccustomdate3` AS `pccustomdate3`, `u1`.`unama` AS `pcinputusernama`, `u2`.`unama` AS `pcmodifikasiusernama`, pc.pctipepos, pc.pcindeksharga, pt.ptnama as pctipeposnama, ip.ipnama as pcindeksharganama from `m_12_pos_category_history` `pc` left join `m0_user` `u1` on `pc`.`pcinputuser` = `u1`.`userid` left join `m0_user` `u2` on `pc`.`pcmodifikasiuser` = `u2`.`userid` left join m_12_pos_type pt on pc.pctipepos = pt.ptkode left join m1_index_price ip on pc.pcindeksharga = ip.ipkode
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_pos_category_setting.vb`

```sql
Insert into M_12_Pos_Category_Setting(pcskategori, pcsmodule, pcsgrup, pcskode, pcsnilai) values{strValue2_ToString} ON DUPLICATE KEY UPDATE pcsnilai = VALUES(pcsnilai)
```

```sql
SELECT pcskategori as kategoripos FROM M_12_Pos_Category_Setting WHERE pcskategori = '{kategori}' AND pcsmodule = '{modul}' AND pcsgrup = '{grup}' GROUP BY pcskategori
```

```sql
DELETE FROM M_12_Pos_Category_Setting WHERE pcskategori = '{kategori}' AND pcsmodule = '{modul}' AND pcsgrup = '{grup}'
```

```sql
select pcs.pcskategori AS pcskategori, ifnull(pcs.pcsmodule, ps.smodule) AS pcsmodule, ifnull(pcs.pcsgrup, ps.sgrup) AS pcsgrup, ifnull(pcs.pcskode, ps.skode) AS pcskode, ifnull(pcs.pcsnilai,ps.snilai) AS pcsnilai, ps.snama AS snama, ps.suraian AS suraian, ps.surutan AS surutan, ps.stipedata AS stipedata, ps.sjenisinputan AS sjenisinputan, ps.scombodata AS scombodata, pc.pcnama AS pcnama, pc.pccatatan AS pccatatan, m.mname AS modulename from m_12_pos_setting ps join m0_module m on ps.smodule = m.mid join m_12_pos_category_setting pcs on ps.smodule = pcs.pcsmodule and ps.sgrup = pcs.pcsgrup and ps.skode = pcs.pcskode join m0_userlogin ul on ul.ulid = '{FixQuotes_paramSplit_0}' join m0_user_location uloc on ul.uluser = uloc.userid join m1_location l on uloc.lokasi = l.lkode and pcs.pcskategori = l.lkategoripos left join m_12_pos_category pc on pcs.pcskategori = pc.pckode
```

```sql
select pcs.pcskategori AS pcskategori, ifnull(pcs.pcsmodule, ps.smodule) AS pcsmodule, ifnull(pcs.pcsgrup, ps.sgrup) AS pcsgrup, ifnull(pcs.pcskode, ps.skode) AS pcskode, ifnull(pcs.pcsnilai,ps.snilai) AS pcsnilai, ps.snama AS snama, ps.suraian AS suraian, ps.surutan AS surutan, ps.stipedata AS stipedata, ps.sjenisinputan AS sjenisinputan, ps.scombodata AS scombodata, pc.pcnama AS pcnama, pc.pccatatan AS pccatatan, m.mname AS modulename from m_12_pos_setting ps join m0_module m on ps.smodule = m.mid join m_12_pos_category_setting pcs on ps.smodule = pcs.pcsmodule and ps.sgrup = pcs.pcsgrup and ps.skode = pcs.pcskode join m0_userlogin ul on ul.ulid = '{FixQuotes_paramSplit_0}' left join m0_user_location uloc on ul.uluser = uloc.userid left join m1_location l on uloc.lokasi = l.lkode and pcs.pcskategori = l.lkategoripos left join m_12_pos_category pc on pcs.pcskategori = pc.pckode
```

```sql
select `pcs`.`pcskategori` AS `pcskategori`,ifnull(`pcs`.`pcsmodule`,`ps`.`smodule`) AS `pcsmodule`,ifnull(`pcs`.`pcsgrup`,`ps`.`sgrup`) AS `pcsgrup`,ifnull(`pcs`.`pcskode`,`ps`.`skode`) AS `pcskode`,ifnull(`pcs`.`pcsnilai`,`ps`.`snilai`) AS `pcsnilai`,`ps`.`snama` AS `snama`,`ps`.`suraian` AS `suraian`,`ps`.`surutan` AS `surutan`,`ps`.`stipedata` AS `stipedata`,`ps`.`sjenisinputan` AS `sjenisinputan`,`ps`.`scombodata` AS `scombodata`,`pc`.`pcnama` AS `pcnama`,`m`.`mname` AS `modulename` from (((`m_12_pos_setting` `ps` join `m0_module` `m` on((`ps`.`smodule` = `m`.`mid`))) left join `m_12_pos_category_setting` `pcs` on(((`ps`.`smodule` = `pcs`.`pcsmodule`) and (`ps`.`sgrup` = `pcs`.`pcsgrup`) and (`ps`.`skode` = `pcs`.`pcskode`) and (`pcs`.`pcskategori` = 'valkategoripos')))) left join `m_12_pos_category` `pc` on((`pcs`.`pcskategori` = `pc`.`pckode`)))
```

```sql
select l.lkode AS lkode, l.lnama AS lnama, l.lkodetransaksi AS lkodetransaksi, l.lcabang AS lcabang, l.laktif AS laktif, l.lalamat1 AS lalamat1, l.lalamat2 AS lalamat2, l.lkota AS lkota, l.lkodepos AS lkodepos, l.lnotelp AS lnotelp, l.lnofax AS lnofax, l.lcatatan AS lcatatan, l.linputuser AS linputuser, l.linputtgl AS linputtgl, l.lmodifikasiuser AS lmodifikasiuser, l.lmodifikasitanggal AS lmodifikasitanggal, b.bnama AS lcabangnama, l.lkategoripos AS lkategoripos, pc.pcnama AS pcnama from m1_location l join m_12_pos_category pc on l.lkategoripos = pc.pckode join m0_userlogin ul on ul.ulid = '{FixQuotes_paramSplit_0}' join m0_user_location uloc on ul.uluser = uloc.userid and l.lkode = uloc.lokasi left join m1_branch b on l.lcabang = b.bkode
```

```sql
select l.lkode AS lkode, l.lnama AS lnama, l.lkodetransaksi AS lkodetransaksi, l.lcabang AS lcabang, l.laktif AS laktif, l.lalamat1 AS lalamat1, l.lalamat2 AS lalamat2, l.lkota AS lkota, l.lkodepos AS lkodepos, l.lnotelp AS lnotelp, l.lnofax AS lnofax, l.lcatatan AS lcatatan, l.linputuser AS linputuser, l.linputtgl AS linputtgl, l.lmodifikasiuser AS lmodifikasiuser, l.lmodifikasitanggal AS lmodifikasitanggal, b.bnama AS lcabangnama, l.lkategoripos AS lkategoripos, pc.pcnama AS pcnama from m1_location l join m_12_pos_category pc on l.lkategoripos = pc.pckode join m0_userlogin ul on ul.ulid = '{FixQuotes_paramSplit_0}' LEFT JOIN m0_user_location uloc ON ul.uluser = uloc.userid left join m1_branch b on l.lcabang = b.bkode
```

```sql
DELETE FROM M_12_Pos_Category_Setting
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_pos_discount_category_customer.vb`

```sql
DELETE FROM M_12_Pos_Discount_Category_Customer WHERE {ftDelKategori} AND dcckategoricustomer = '{FixQuotes_drutama}dcckategoricustomer'
```

```sql
select pckode from m_12_pos_category WHERE
```

```sql
SELECT dcc.dcckategori as kategori, dcc.dcckategoricustomer as kategoricustomer, dcc.dccoperator as operator, cc.ccnama, (CASE dcc.dccoperator WHEN 0 THEN 'Between' WHEN 1 THEN '>=' WHEN 2 THEN 'Multiple' ELSE 'Unknown' END) as operatornama FROM M_12_Pos_Discount_Category_Customer dcc JOIN m1_customer_category cc ON dcc.dcckategoricustomer = cc.cckode WHERE dcc.dcckategori = '{FxDB_drCatPos}pckode' AND dcc.dcckategoricustomer = '{FxDB_dr1}dcckategoricustomer' GROUP BY dcc.dccoperator ORDER BY dcc.dccoperator
```

```sql
Insert into M_12_Pos_Discount_Category_Customer(dcckategori, dcckategoricustomer, dccoperator, dccjml1, dccjml2, dcckriteria, dccnilai, dcctgl1, dcctgl2, dccjam1, dccjam2, dcccustomtext1, dcccustomtext2, dcccustomtext3, dcccustomtext4, dcccustomtext5, dcccustomint1, dcccustomint2, dcccustomint3, dcccustomdbl1, dcccustomdbl2, dcccustomdbl3, dcccustomdate1, dcccustomdate2, dcccustomdate3) values{strValue2_ToString}
```

```sql
SELECT dcckategori as kategoripos FROM M_12_Pos_Discount_Category_Customer WHERE dcckategori = '{dcckategori}' AND dcckategoricustomer = '{dcckategoricustomer}' AND dccoperator = '{dccoperator}' AND dccjml1 = '{dccjml1}' AND dccjml2 = '{dccjml2}' GROUP BY dcckategori
```

```sql
DELETE FROM M_12_Pos_Discount_Category_Customer WHERE dcckategori = '{dcckategori}' AND dcckategoricustomer = '{dcckategoricustomer}' AND dccoperator = '{dccoperator}' AND dccjml1 = '{dccjml1}' AND dccjml2 = '{dccjml2}'
```

```sql
DELETE FROM M_12_Pos_Discount_Category_Customer
```

```sql
select `dcc`.`dcckategori` AS `dcckategori`,`dcc`.`dcckategoricustomer` AS `dcckategoricustomer`,`dcc`.`dccoperator` AS `dccoperator`,`dcc`.`dccjml1` AS `dccjml1`,`dcc`.`dccjml2` AS `dccjml2`,`dcc`.`dcckriteria` AS `dcckriteria`,`dcc`.`dccnilai` AS `dccnilai`,`dcc`.`dcctgl1` AS `dcctgl1`,`dcc`.`dcctgl2` AS `dcctgl2`,`dcc`.`dccjam1` AS `dccjam1`,`dcc`.`dccjam2` AS `dccjam2`,`dcc`.`dcccustomtext1` AS `dcccustomtext1`,`dcc`.`dcccustomtext2` AS `dcccustomtext2`,`dcc`.`dcccustomtext3` AS `dcccustomtext3`,`dcc`.`dcccustomtext4` AS `dcccustomtext4`,`dcc`.`dcccustomtext5` AS `dcccustomtext5`,`dcc`.`dcccustomint1` AS `dcccustomint1`,`dcc`.`dcccustomint2` AS `dcccustomint2`,`dcc`.`dcccustomint3` AS `dcccustomint3`,`dcc`.`dcccustomdbl1` AS `dcccustomdbl1`,`dcc`.`dcccustomdbl2` AS `dcccustomdbl2`,`dcc`.`dcccustomdbl3` AS `dcccustomdbl3`,`dcc`.`dcccustomdate1` AS `dcccustomdate1`,`dcc`.`dcccustomdate2` AS `dcccustomdate2`,`dcc`.`dcccustomdate3` AS `dcccustomdate3`,`pc`.`pcnama` AS `pcnama`,`cc`.`ccnama` AS `ccnama`,(case `dcc`.`dcckriteria` when 0 then 'Price' when 1 then 'Discount Percent' when 2 then 'Discount Nominal' else 'Unknown' end) AS `dcckriterianama`,(case `dcc`.`dccoperator` when 0 then 'Between' when 1 then '>=' when 2 then 'Multiple' else 'Unknown' end) AS `dccoperatornama` from ((`M_12_Pos_Discount_Category_Customer` `dcc` join `m_12_pos_category` `pc` on((`dcc`.`dcckategori` = `pc`.`pckode`))) join `m1_customer_category` `cc` on((`dcc`.`dcckategoricustomer` = `cc`.`cckode`)))
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_pos_discount_category_item.vb`

```sql
DELETE FROM M_12_Pos_Discount_Category_Item WHERE dcikategori = '{FixQuotes_drutama}dcikategori' AND dcikategoribarang = '{FixQuotes_drutama}dcikategoribarang'
```

```sql
SELECT dci.dcikategori as kategori, dci.dcikategoribarang as kategoribarang, dci.dcioperator as operator, ic.icnama, (CASE dci.dcioperator WHEN 0 THEN 'Between' WHEN 1 THEN '>=' WHEN 2 THEN 'Multiple' ELSE 'Unknown' END) as operatornama FROM M_12_Pos_Discount_Category_Item dci JOIN m1_item_category ic ON dci.dcikategoribarang = ic.ickode WHERE dci.dcikategori = '{FxDB_dr1}dcikategori' AND dci.dcikategoribarang = '{FxDB_dr1}dcikategoribarang' GROUP BY dci.dcioperator ORDER BY dci.dcioperator
```

```sql
Insert into M_12_Pos_Discount_Category_Item(dcikategori, dcikategoribarang, dcioperator, dcijml1, dcijml2, dcikriteria, dcinilai, dcitgl1, dcitgl2, dcijam1, dcijam2, dcicustomtext1, dcicustomtext2, dcicustomtext3, dcicustomtext4, dcicustomtext5, dcicustomint1, dcicustomint2, dcicustomint3, dcicustomdbl1, dcicustomdbl2, dcicustomdbl3, dcicustomdate1, dcicustomdate2, dcicustomdate3) values{strValue2_ToString}
```

```sql
SELECT dcikategori as kategoripos FROM M_12_Pos_Discount_Category_Item WHERE dcikategori = '{dcikategori}' AND dcikategoribarang = '{dcikategoribarang}' AND dcioperator = '{dcioperator}' AND dcijml1 = '{dcijml1}' AND dcijml2 = '{dcijml2}' GROUP BY dcikategori
```

```sql
DELETE FROM M_12_Pos_Discount_Category_Item WHERE dcikategori = '{dcikategori}' AND dcikategoribarang = '{dcikategoribarang}' AND dcioperator = '{dcioperator}' AND dcijml1 = '{dcijml1}' AND dcijml2 = '{dcijml2}'
```

```sql
DELETE FROM M_12_Pos_Discount_Category_Item
```

```sql
select `dci`.`dcikategori` AS `dcikategori`,`dci`.`dcikategoribarang` AS `dcikategoribarang`,`dci`.`dcioperator` AS `dcioperator`,`dci`.`dcijml1` AS `dcijml1`,`dci`.`dcijml2` AS `dcijml2`,`dci`.`dcikriteria` AS `dcikriteria`,`dci`.`dcinilai` AS `dcinilai`,`dci`.`dcitgl1` AS `dcitgl1`,`dci`.`dcitgl2` AS `dcitgl2`,`dci`.`dcijam1` AS `dcijam1`,`dci`.`dcijam2` AS `dcijam2`,`dci`.`dcicustomtext1` AS `dcicustomtext1`,`dci`.`dcicustomtext2` AS `dcicustomtext2`,`dci`.`dcicustomtext3` AS `dcicustomtext3`,`dci`.`dcicustomtext4` AS `dcicustomtext4`,`dci`.`dcicustomtext5` AS `dcicustomtext5`,`dci`.`dcicustomint1` AS `dcicustomint1`,`dci`.`dcicustomint2` AS `dcicustomint2`,`dci`.`dcicustomint3` AS `dcicustomint3`,`dci`.`dcicustomdbl1` AS `dcicustomdbl1`,`dci`.`dcicustomdbl2` AS `dcicustomdbl2`,`dci`.`dcicustomdbl3` AS `dcicustomdbl3`,`dci`.`dcicustomdate1` AS `dcicustomdate1`,`dci`.`dcicustomdate2` AS `dcicustomdate2`,`dci`.`dcicustomdate3` AS `dcicustomdate3`,`pc`.`pcnama` AS `pcnama`,`ic`.`icnama` AS `icnama`,(case `dci`.`dcikriteria` when 0 then 'Price' when 1 then 'Discount Percent' when 2 then 'Discount Nominal' else 'Unknown' end) AS `dcikriterianama`,(case `dci`.`dcioperator` when 0 then 'Between' when 1 then '>=' when 2 then 'Multiple' else 'Unknown' end) AS `dcioperatornama` from ((`M_12_Pos_Discount_Category_Item` `dci` join `m_12_pos_category` `pc` on((`dci`.`dcikategori` = `pc`.`pckode`))) join `m1_item_category` `ic` on((`dci`.`dcikategoribarang` = `ic`.`ickode`)))
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_pos_discount_item.vb`

```sql
DELETE FROM m_12_pos_discount_item WHERE dikategori = '{FixQuotes_drutama}dikategori' AND diidbarang = '{FixQuotes_drutama}diidbarang'
```

```sql
SELECT di.dikategori as kategori, di.diidbarang as idbarang, di.dioperator as operator, i.bkode, (CASE di.dioperator WHEN 0 THEN 'Between' WHEN 1 THEN '>=' WHEN 2 THEN 'Multiple' ELSE 'Unknown' END) as operatornama FROM m_12_pos_discount_item di JOIN m1_item i ON di.diidbarang = i.bid WHERE di.dikategori = '{FxDB_dr1}dikategori' AND di.diidbarang = '{FxDB_dr1}diidbarang' GROUP BY di.dioperator ORDER BY di.dioperator
```

```sql
Insert into M_12_Pos_Discount_Item(dikategori, diidbarang, dioperator, dijml1, dijml2, dikriteria, dinilai, ditgl1, ditgl2, dijam1, dijam2, dicustomtext1, dicustomtext2, dicustomtext3, dicustomtext4, dicustomtext5, dicustomint1, dicustomint2, dicustomint3, dicustomdbl1, dicustomdbl2, dicustomdbl3, dicustomdate1, dicustomdate2, dicustomdate3) values{strValue2_ToString}
```

```sql
SELECT dikategori as kategoripos FROM M_12_Pos_Discount_Item WHERE dikategori = '{dikategori}' AND diidbarang = '{diidbarang}' AND dioperator = '{dioperator}' AND dijml1 = '{dijml1}' AND dijml2 = '{dijml2}' GROUP BY dikategori
```

```sql
DELETE FROM M_12_Pos_Discount_Item WHERE dikategori = '{dikategori}' AND diidbarang = '{diidbarang}' AND dioperator = '{dioperator}' AND dijml1 = '{dijml1}' AND dijml2 = '{dijml2}'
```

```sql
DELETE FROM M_12_Pos_Discount_Item
```

```sql
select `di`.`dikategori` AS `dikategori`,`di`.`diidbarang` AS `diidbarang`,`di`.`dioperator` AS `dioperator`,`di`.`dijml1` AS `dijml1`,`di`.`dijml2` AS `dijml2`,`di`.`dikriteria` AS `dikriteria`,`di`.`dinilai` AS `dinilai`,`di`.`ditgl1` AS `ditgl1`,`di`.`ditgl2` AS `ditgl2`,`di`.`dijam1` AS `dijam1`,`di`.`dijam2` AS `dijam2`,`di`.`dicustomtext1` AS `dicustomtext1`,`di`.`dicustomtext2` AS `dicustomtext2`,`di`.`dicustomtext3` AS `dicustomtext3`,`di`.`dicustomtext4` AS `dicustomtext4`,`di`.`dicustomtext5` AS `dicustomtext5`,`di`.`dicustomint1` AS `dicustomint1`,`di`.`dicustomint2` AS `dicustomint2`,`di`.`dicustomint3` AS `dicustomint3`,`di`.`dicustomdbl1` AS `dicustomdbl1`,`di`.`dicustomdbl2` AS `dicustomdbl2`,`di`.`dicustomdbl3` AS `dicustomdbl3`,`di`.`dicustomdate1` AS `dicustomdate1`,`di`.`dicustomdate2` AS `dicustomdate2`,`di`.`dicustomdate3` AS `dicustomdate3`,`pc`.`pcnama` AS `pcnama`,`i`.`bkode` AS `bkode`,`i`.`bnama` AS `bnama`,`i`.`btipe` AS `btipe`,`i`.`bsatuan` AS `bsatuan`,(case `di`.`dikriteria` when 0 then 'Price' when 1 then 'Discount Percent' when 2 then 'Discount Nominal' else 'Unknown' end) AS `dikriterianama`,(case `di`.`dioperator` when 0 then 'Between' when 1 then '>=' when 2 then 'Multiple' else 'Unknown' end) AS `dioperatornama` from ((`m_12_pos_discount_item` `di` join `m_12_pos_category` `pc` on((`di`.`dikategori` = `pc`.`pckode`))) join `m1_item` `i` on((`di`.`diidbarang` = `i`.`bid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_pos_hardware.vb`

```sql
Insert into M_12_Pos_Hardware(phcomputermac, phcomputerip, phprinter, phprinterport, phidreport, phcetak, phcetakbarang, phfeed, phcashdrawer, phcashdrawerprinter, phcashdrawerport, phpolenama, phpoleport, phpoledisplay, phpolebaudrate, phpoleparity, phpoledatabit, phpolestopbit, phescheader, phescbody, phescfooter, phesccashdrawer, phcustomtext1, phcustomtext2, phcustomtext3, phcustomtext4, phcustomtext5, phcustomint1, phcustomint2, phcustomint3, phcustomdbl1, phcustomdbl2, phcustomdbl3, phcustomdate1, phcustomdate2, phcustomdate3, phuserid) values{strValue2_ToString} ON DUPLICATE KEY UPDATE phcomputermac = VALUES(phcomputermac), phcomputerip = VALUES(phcomputerip), phprinter = VALUES(phprinter), phprinterport = VALUES(phprinterport), phidreport = VALUES(phidreport), phcetak = VALUES(phcetak), phcetakbarang = VALUES(phcetakbarang), phfeed = VALUES(phfeed), phcashdrawer = VALUES(phcashdrawer), phcashdrawerprinter = VALUES(phcashdrawerprinter), phcashdrawerport = VALUES(phcashdrawerport), phpolenama = VALUES(phpolenama), phpoleport = VALUES(phpoleport), phpoledisplay = VALUES(phpoledisplay), phpolebaudrate = VALUES(phpolebaudrate), phpoleparity = VALUES(phpoleparity), phpoledatabit = VALUES(phpoledatabit), phpolestopbit = VALUES(phpolestopbit), phescheader = VALUES(phescheader), phescbody = VALUES(phescbody), phescfooter = VALUES(phescfooter), phesccashdrawer = VALUES(phesccashdrawer), phcustomtext1 = VALUES(phcustomtext1), phcustomtext2 = VALUES(phcustomtext2), phcustomtext3 = VALUES(phcustomtext3), phcustomtext4 = VALUES(phcustomtext4), phcustomtext5 = VALUES(phcustomtext5), phcustomint1 = VALUES(phcustomint1), phcustomint2 = VALUES(phcustomint2), phcustomint3 = VALUES(phcustomint3), phcustomdbl1 = VALUES(phcustomdbl1), phcustomdbl2 = VALUES(phcustomdbl2), phcustomdbl3 = VALUES(phcustomdbl3), phcustomdate1 = VALUES(phcustomdate1), phcustomdate2 = VALUES(phcustomdate2), phcustomdate3 = VALUES(phcustomdate3)
```

```sql
DELETE FROM M_12_Pos_Hardware WHERE phuserid = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_pos_item.vb`

```sql
Delete from M_12_Pos_Item where {strValue1_ToString}
```

```sql
Insert into M_12_Pos_Item(pikategori, piidbarang, pistokminimal, pistokmaksimal, pistokreorder, pihargajual1, pihargajual2, pihargajual3, pihargajual4, pihargajual5, pidiskonjual1, pidiskonjual2, pidiskonjual3, pidiskonjual4, pidiskonjual5, picustomtext1, picustomtext2, picustomtext3, picustomtext4, picustomtext5, picustomint1, picustomint2, picustomint3, picustomdbl1, picustomdbl2, picustomdbl3, picustomdate1, picustomdate2, picustomdate3, pistokminorder) values{strValue2_ToString} ON DUPLICATE KEY UPDATE pistokminimal = VALUES(pistokminimal), pistokmaksimal = VALUES(pistokmaksimal), pistokreorder = VALUES(pistokreorder), pihargajual1 = VALUES(pihargajual1), pihargajual2 = VALUES(pihargajual2), pihargajual3 = VALUES(pihargajual3), pihargajual4 = VALUES(pihargajual4), pihargajual5 = VALUES(pihargajual5), pidiskonjual1 = VALUES(pidiskonjual1), pidiskonjual2 = VALUES(pidiskonjual2), pidiskonjual3 = VALUES(pidiskonjual3), pidiskonjual4 = VALUES(pidiskonjual4), pidiskonjual5 = VALUES(pidiskonjual5), picustomtext1 = VALUES(picustomtext1), picustomtext2 = VALUES(picustomtext2), picustomtext3 = VALUES(picustomtext3), picustomtext4 = VALUES(picustomtext4), picustomtext5 = VALUES(picustomtext5), picustomint1 = VALUES(picustomint1), picustomint2 = VALUES(picustomint2), picustomint3 = VALUES(picustomint3), picustomdbl1 = VALUES(picustomdbl1), picustomdbl2 = VALUES(picustomdbl2), picustomdbl3 = VALUES(picustomdbl3), picustomdate1 = VALUES(picustomdate1), picustomdate2 = VALUES(picustomdate2), picustomdate3 = VALUES(picustomdate3), pistokminorder = VALUES(pistokminorder)
```

```sql
Insert into M_12_Pos_Item(pikategori, piidbarang, pistokminimal, pistokmaksimal, pistokreorder, pihargajual1, pihargajual2, pihargajual3, pihargajual4, pihargajual5, pidiskonjual1, pidiskonjual2, pidiskonjual3, pidiskonjual4, pidiskonjual5, picustomtext1, picustomtext2, picustomtext3, picustomtext4, picustomtext5, picustomint1, picustomint2, picustomint3, picustomdbl1, picustomdbl2, picustomdbl3, picustomdate1, picustomdate2, picustomdate3, pistokminorder, pihargaedited) values{strValue2_ToString} ON DUPLICATE KEY UPDATE pistokminimal = VALUES(pistokminimal), pistokmaksimal = VALUES(pistokmaksimal), pistokreorder = VALUES(pistokreorder), pihargajual1 = VALUES(pihargajual1), pihargajual2 = VALUES(pihargajual2), pihargajual3 = VALUES(pihargajual3), pihargajual4 = VALUES(pihargajual4), pihargajual5 = VALUES(pihargajual5), pidiskonjual1 = VALUES(pidiskonjual1), pidiskonjual2 = VALUES(pidiskonjual2), pidiskonjual3 = VALUES(pidiskonjual3), pidiskonjual4 = VALUES(pidiskonjual4), pidiskonjual5 = VALUES(pidiskonjual5), picustomtext1 = VALUES(picustomtext1), picustomtext2 = VALUES(picustomtext2), picustomtext3 = VALUES(picustomtext3), picustomtext4 = VALUES(picustomtext4), picustomtext5 = VALUES(picustomtext5), picustomint1 = VALUES(picustomint1), picustomint2 = VALUES(picustomint2), picustomint3 = VALUES(picustomint3), picustomdbl1 = VALUES(picustomdbl1), picustomdbl2 = VALUES(picustomdbl2), picustomdbl3 = VALUES(picustomdbl3), picustomdate1 = VALUES(picustomdate1), picustomdate2 = VALUES(picustomdate2), picustomdate3 = VALUES(picustomdate3), pistokminorder = VALUES(pistokminorder), pihargaedited = VALUES(pihargaedited)
```

```sql
SELECT pikategori as kategoripos FROM M_12_Pos_Item WHERE pikategori = '{pikategori}' AND piidbarang = '{piidbarang}' GROUP BY pikategori
```

```sql
DELETE FROM M_12_Pos_Item WHERE pikategori = '{pikategori}' AND piidbarang = '{piidbarang}'
```

```sql
DELETE FROM M_12_Pos_Item
```

```sql
Insert into M_12_Pos_Item(pikategori, piidbarang, pistokminimal, pistokmaksimal, pistokreorder, pihargajual1, pihargajual2, pihargajual3, pihargajual4, pihargajual5, pidiskonjual1, pidiskonjual2, pidiskonjual3, pidiskonjual4, pidiskonjual5, picustomtext1, picustomtext2, picustomtext3, picustomtext4, picustomtext5, picustomint1, picustomint2, picustomint3, picustomdbl1, picustomdbl2, picustomdbl3, picustomdate1, picustomdate2, picustomdate3) values{strValue2_ToString} ON DUPLICATE KEY UPDATE pistokminimal = VALUES(pistokminimal), pistokmaksimal = VALUES(pistokmaksimal), pistokreorder = VALUES(pistokreorder), pihargajual1 = VALUES(pihargajual1), pihargajual2 = VALUES(pihargajual2), pihargajual3 = VALUES(pihargajual3), pihargajual4 = VALUES(pihargajual4), pihargajual5 = VALUES(pihargajual5), pidiskonjual1 = VALUES(pidiskonjual1), pidiskonjual2 = VALUES(pidiskonjual2), pidiskonjual3 = VALUES(pidiskonjual3), pidiskonjual4 = VALUES(pidiskonjual4), pidiskonjual5 = VALUES(pidiskonjual5), picustomtext1 = VALUES(picustomtext1), picustomtext2 = VALUES(picustomtext2), picustomtext3 = VALUES(picustomtext3), picustomtext4 = VALUES(picustomtext4), picustomtext5 = VALUES(picustomtext5), picustomint1 = VALUES(picustomint1), picustomint2 = VALUES(picustomint2), picustomint3 = VALUES(picustomint3), picustomdbl1 = VALUES(picustomdbl1), picustomdbl2 = VALUES(picustomdbl2), picustomdbl3 = VALUES(picustomdbl3), picustomdate1 = VALUES(picustomdate1), picustomdate2 = VALUES(picustomdate2), picustomdate3 = VALUES(picustomdate3)
```

```sql
Insert into M_12_Pos_Item(SELECT '{FixQuotes_dr1}pikategori' as pikategori, bid as piidbarang, bstokminimal as pistokminimal, bstokmaksimal as pistokmaksimal, breorder as pistokreorder, bminorder as pistokminorder, bhargajual1 as pihargajual1, bhargajual2 as pihargajual2, bhargajual3 as pihargajual3, bhargajual4 as pihargajual4, bhargajual5 as pihargajual5, bdiskonjual1 as pidiskonjual1, bdiskonjual2 as pidiskonjual2, bdiskonjual3 as pidiskonjual3, bdiskonjual4 as pidiskonjual4, bdiskonjual5 as pidiskonjual5, '' as picustomtext1, '' as picustomtext2, '' as picustomtext3, '' as picustomtext4, '' as picustomtext5, 0 as picustomint1, 0 as picustomint2, 0 as picustomint3, 0 as picustomdbl1, 0 as picustomdbl2, 0 as picustomdbl3, '1900-01-01' as picustomdate1, '1900-01-01' as picustomdate2, '1900-01-01' as picustomdate3, 0 as pidownloaded FROM m1_item WHERE bkategori = '{FixQuotes_dr1}pikategoribarang') ON DUPLICATE KEY UPDATE pistokminimal = VALUES(pistokminimal), pistokmaksimal = VALUES(pistokmaksimal), pistokreorder = VALUES(pistokreorder), pistokminorder = VALUES(pistokminorder), pihargajual1 = VALUES(pihargajual1), pihargajual2 = VALUES(pihargajual2), pihargajual3 = VALUES(pihargajual3), pihargajual4 = VALUES(pihargajual4), pihargajual5 = VALUES(pihargajual5), pidiskonjual1 = VALUES(pidiskonjual1), pidiskonjual2 = VALUES(pidiskonjual2), pidiskonjual3 = VALUES(pidiskonjual3), pidiskonjual4 = VALUES(pidiskonjual4), pidiskonjual5 = VALUES(pidiskonjual5), picustomtext1 = VALUES(picustomtext1), picustomtext2 = VALUES(picustomtext2), picustomtext3 = VALUES(picustomtext3), picustomtext4 = VALUES(picustomtext4), picustomtext5 = VALUES(picustomtext5), picustomint1 = VALUES(picustomint1), picustomint2 = VALUES(picustomint2), picustomint3 = VALUES(picustomint3), picustomdbl1 = VALUES(picustomdbl1), picustomdbl2 = VALUES(picustomdbl2), picustomdbl3 = VALUES(picustomdbl3), picustomdate1 = VALUES(picustomdate1), picustomdate2 = VALUES(picustomdate2), picustomdate3 = VALUES(picustomdate3), pidownloaded = VALUES(pidownloaded)
```

```sql
Insert into M_12_Pos_Item(SELECT '{FixQuotes_dr1}pikategori' as pikategori, bid as piidbarang, bstokminimal as pistokminimal, bstokmaksimal as pistokmaksimal, breorder as pistokreorder, bminorder as pistokminorder, bhargajual1 as pihargajual1, bhargajual2 as pihargajual2, bhargajual3 as pihargajual3, bhargajual4 as pihargajual4, bhargajual5 as pihargajual5, bdiskonjual1 as pidiskonjual1, bdiskonjual2 as pidiskonjual2, bdiskonjual3 as pidiskonjual3, bdiskonjual4 as pidiskonjual4, bdiskonjual5 as pidiskonjual5, '' as picustomtext1, '' as picustomtext2, '' as picustomtext3, '' as picustomtext4, '' as picustomtext5, 0 as picustomint1, 0 as picustomint2, 0 as picustomint3, 0 as picustomdbl1, 0 as picustomdbl2, 0 as picustomdbl3, '1900-01-01' as picustomdate1, '1900-01-01' as picustomdate2, '1900-01-01' as picustomdate3, 0 as pidownloaded, 0 as pihargaedited FROM m1_item WHERE bkategori = '{FixQuotes_dr1}pikategoribarang') ON DUPLICATE KEY UPDATE picustomtext1 = VALUES(picustomtext1), picustomtext2 = VALUES(picustomtext2), picustomtext3 = VALUES(picustomtext3), picustomtext4 = VALUES(picustomtext4), picustomtext5 = VALUES(picustomtext5), picustomint1 = VALUES(picustomint1), picustomint2 = VALUES(picustomint2), picustomint3 = VALUES(picustomint3), picustomdbl1 = VALUES(picustomdbl1), picustomdbl2 = VALUES(picustomdbl2), picustomdbl3 = VALUES(picustomdbl3), picustomdate1 = VALUES(picustomdate1), picustomdate2 = VALUES(picustomdate2), picustomdate3 = VALUES(picustomdate3)
```

```sql
Insert into M_12_Pos_Item(SELECT '{FixQuotes_dr1}pikategori' as pikategori, bid as piidbarang, bstokminimal as pistokminimal, bstokmaksimal as pistokmaksimal, breorder as pistokreorder, bminorder as pistokminorder, bhargajual1 as pihargajual1, bhargajual2 as pihargajual2, bhargajual3 as pihargajual3, bhargajual4 as pihargajual4, bhargajual5 as pihargajual5, bdiskonjual1 as pidiskonjual1, bdiskonjual2 as pidiskonjual2, bdiskonjual3 as pidiskonjual3, bdiskonjual4 as pidiskonjual4, bdiskonjual5 as pidiskonjual5, '' as picustomtext1, '' as picustomtext2, '' as picustomtext3, '' as picustomtext4, '' as picustomtext5, 0 as picustomint1, 0 as picustomint2, 0 as picustomint3, 0 as picustomdbl1, 0 as picustomdbl2, 0 as picustomdbl3, '1900-01-01' as picustomdate1, '1900-01-01' as picustomdate2, '1900-01-01' as picustomdate3, 0 as pidownloaded FROM m1_item i JOIN m_12_pos_category pc ON pc.pckode = '{FixQuotes_dr1}pikategori' JOIN m_12_pos_type pt ON pc.pctipepos = pt.ptkode JOIN m_12_pos_type_class_product ptcp ON pt.ptkode = ptcp.tipepos AND i.bkelasproduk = ptcp.kelasproduk GROUP BY i.bid) ON DUPLICATE KEY UPDATE pistokminimal = VALUES(pistokminimal), pistokmaksimal = VALUES(pistokmaksimal), pistokreorder = VALUES(pistokreorder), pistokminorder = VALUES(pistokminorder), pihargajual1 = VALUES(pihargajual1), pihargajual2 = VALUES(pihargajual2), pihargajual3 = VALUES(pihargajual3), pihargajual4 = VALUES(pihargajual4), pihargajual5 = VALUES(pihargajual5), pidiskonjual1 = VALUES(pidiskonjual1), pidiskonjual2 = VALUES(pidiskonjual2), pidiskonjual3 = VALUES(pidiskonjual3), pidiskonjual4 = VALUES(pidiskonjual4), pidiskonjual5 = VALUES(pidiskonjual5), picustomtext1 = VALUES(picustomtext1), picustomtext2 = VALUES(picustomtext2), picustomtext3 = VALUES(picustomtext3), picustomtext4 = VALUES(picustomtext4), picustomtext5 = VALUES(picustomtext5), picustomint1 = VALUES(picustomint1), picustomint2 = VALUES(picustomint2), picustomint3 = VALUES(picustomint3), picustomdbl1 = VALUES(picustomdbl1), picustomdbl2 = VALUES(picustomdbl2), picustomdbl3 = VALUES(picustomdbl3), picustomdate1 = VALUES(picustomdate1), picustomdate2 = VALUES(picustomdate2), picustomdate3 = VALUES(picustomdate3), pidownloaded = VALUES(pidownloaded)
```

```sql
Insert into M_12_Pos_Item(SELECT '{FixQuotes_dr1}pikategori' as pikategori, bid as piidbarang, bstokminimal as pistokminimal, bstokmaksimal as pistokmaksimal, breorder as pistokreorder, bminorder as pistokminorder, bhargajual1 as pihargajual1, bhargajual2 as pihargajual2, bhargajual3 as pihargajual3, bhargajual4 as pihargajual4, bhargajual5 as pihargajual5, bdiskonjual1 as pidiskonjual1, bdiskonjual2 as pidiskonjual2, bdiskonjual3 as pidiskonjual3, bdiskonjual4 as pidiskonjual4, bdiskonjual5 as pidiskonjual5, '' as picustomtext1, '' as picustomtext2, '' as picustomtext3, '' as picustomtext4, '' as picustomtext5, 0 as picustomint1, 0 as picustomint2, 0 as picustomint3, 0 as picustomdbl1, 0 as picustomdbl2, 0 as picustomdbl3, '1900-01-01' as picustomdate1, '1900-01-01' as picustomdate2, '1900-01-01' as picustomdate3, 0 as pidownloaded, 0 as pihargaedited FROM m1_item i JOIN m_12_pos_category pc ON pc.pckode = '{FixQuotes_dr1}pikategori' JOIN m_12_pos_type pt ON pc.pctipepos = pt.ptkode JOIN m_12_pos_type_class_product ptcp ON pt.ptkode = ptcp.tipepos AND i.bkelasproduk = ptcp.kelasproduk GROUP BY i.bid) ON DUPLICATE KEY UPDATE pidownloaded = VALUES(pidownloaded), pihargaedited = VALUES(pihargaedited)
```

```sql
SELECT pph.kelasproduk as kelasproduk FROM m_12_pos_category `pch` JOIN m_12_pos_type `pth` ON pch.pctipepos = pth.ptkode JOIN m_12_pos_type_class_product `pph` ON pph.tipepos = pch.pctipepos WHERE pch.pckode = '{KategoriPOS}'
```

```sql
SELECT `pi`.`piidbarang` AS idbarang FROM m_12_pos_item `pi` JOIN m1_item `i` ON pi.piidbarang = i.bid JOIN m_12_pos_category `pc` ON pi.pikategori = pc.pckode JOIN m_12_pos_type `pt` ON pc.pctipepos = pt.ptkode JOIN m_12_pos_type_class_product `pp` ON pp.tipepos = pc.pctipepos WHERE pi.pikategori = '{KategoriPOS}' AND ({filterkp}) GROUP BY pi.piidbarang , pp.kelasproduk
```

```sql
DELETE FROM m_12_pos_item WHERE pikategori = '{KategoriPOS}' AND piidbarang = '{FixQuotes_dr2}idbarang'
```

```sql
Insert into M_12_Pos_Item(SELECT '{FixQuotes_dr1}pikategori' as pikategori, bid as piidbarang, bstokminimal as pistokminimal, bstokmaksimal as pistokmaksimal, breorder as pistokreorder, bminorder as pistokminorder, bhargajual1 as pihargajual1, bhargajual2 as pihargajual2, bhargajual3 as pihargajual3, bhargajual4 as pihargajual4, bhargajual5 as pihargajual5, bdiskonjual1 as pidiskonjual1, bdiskonjual2 as pidiskonjual2, bdiskonjual3 as pidiskonjual3, bdiskonjual4 as pidiskonjual4, bdiskonjual5 as pidiskonjual5, '' as picustomtext1, '' as picustomtext2, '' as picustomtext3, '' as picustomtext4, '' as picustomtext5, 0 as picustomint1, 0 as picustomint2, 0 as picustomint3, 0 as picustomdbl1, 0 as picustomdbl2, 0 as picustomdbl3, '1900-01-01' as picustomdate1, '1900-01-01' as picustomdate2, '1900-01-01' as picustomdate3, 0 as pidownloaded, 0 as pidownloaded FROM m1_item) ON DUPLICATE KEY UPDATE pistokminimal = VALUES(pistokminimal), pistokmaksimal = VALUES(pistokmaksimal), pistokreorder = VALUES(pistokreorder), pistokminorder = VALUES(pistokminorder), pihargajual1 = VALUES(pihargajual1), pihargajual2 = VALUES(pihargajual2), pihargajual3 = VALUES(pihargajual3), pihargajual4 = VALUES(pihargajual4), pihargajual5 = VALUES(pihargajual5), pidiskonjual1 = VALUES(pidiskonjual1), pidiskonjual2 = VALUES(pidiskonjual2), pidiskonjual3 = VALUES(pidiskonjual3), pidiskonjual4 = VALUES(pidiskonjual4), pidiskonjual5 = VALUES(pidiskonjual5), picustomtext1 = VALUES(picustomtext1), picustomtext2 = VALUES(picustomtext2), picustomtext3 = VALUES(picustomtext3), picustomtext4 = VALUES(picustomtext4), picustomtext5 = VALUES(picustomtext5), picustomint1 = VALUES(picustomint1), picustomint2 = VALUES(picustomint2), picustomint3 = VALUES(picustomint3), picustomdbl1 = VALUES(picustomdbl1), picustomdbl2 = VALUES(picustomdbl2), picustomdbl3 = VALUES(picustomdbl3), picustomdate1 = VALUES(picustomdate1), picustomdate2 = VALUES(picustomdate2), picustomdate3 = VALUES(picustomdate3), pidownloaded = VALUES(pidownloaded)
```

```sql
Insert into M_12_Pos_Item(SELECT '{FixQuotes_dr1}pikategori' as pikategori, bid as piidbarang, bstokminimal as pistokminimal, bstokmaksimal as pistokmaksimal, breorder as pistokreorder, bminorder as pistokminorder, bhargajual1 as pihargajual1, bhargajual2 as pihargajual2, bhargajual3 as pihargajual3, bhargajual4 as pihargajual4, bhargajual5 as pihargajual5, bdiskonjual1 as pidiskonjual1, bdiskonjual2 as pidiskonjual2, bdiskonjual3 as pidiskonjual3, bdiskonjual4 as pidiskonjual4, bdiskonjual5 as pidiskonjual5, '' as picustomtext1, '' as picustomtext2, '' as picustomtext3, '' as picustomtext4, '' as picustomtext5, 0 as picustomint1, 0 as picustomint2, 0 as picustomint3, 0 as picustomdbl1, 0 as picustomdbl2, 0 as picustomdbl3, '1900-01-01' as picustomdate1, '1900-01-01' as picustomdate2, '1900-01-01' as picustomdate3, 0 as pidownloaded, 0 as pihargaedited FROM m1_item) ON DUPLICATE KEY UPDATE picustomtext1 = VALUES(picustomtext1), picustomtext2 = VALUES(picustomtext2), picustomtext3 = VALUES(picustomtext3), picustomtext4 = VALUES(picustomtext4), picustomtext5 = VALUES(picustomtext5), picustomint1 = VALUES(picustomint1), picustomint2 = VALUES(picustomint2), picustomint3 = VALUES(picustomint3), picustomdbl1 = VALUES(picustomdbl1), picustomdbl2 = VALUES(picustomdbl2), picustomdbl3 = VALUES(picustomdbl3), picustomdate1 = VALUES(picustomdate1), picustomdate2 = VALUES(picustomdate2), picustomdate3 = VALUES(picustomdate3)
```

```sql
Insert into M_12_Pos_Item(SELECT '{FixQuotes_dr1}pikategori' as pikategori, piidbarang as piidbarang, pistokminimal as pistokminimal, pistokmaksimal as pistokmaksimal, pistokreorder as pistokreorder, pistokminorder as pistokminorder, pihargajual1 as pihargajual1, pihargajual2 as pihargajual2, pihargajual3 as pihargajual3, pihargajual4 as pihargajual4, pihargajual5 as pihargajual5, pidiskonjual1 as pidiskonjual1, pidiskonjual2 as pidiskonjual2, pidiskonjual3 as pidiskonjual3, pidiskonjual4 as pidiskonjual4, pidiskonjual5 as pidiskonjual5, picustomtext1 as picustomtext1, picustomtext2 as picustomtext2, picustomtext3 as picustomtext3, picustomtext4 as picustomtext4, picustomtext5 as picustomtext5, picustomint1 as picustomint1, picustomint2 as picustomint2, picustomint3 as picustomint3, picustomdbl1 as picustomdbl1, picustomdbl2 as picustomdbl2, picustomdbl3 as picustomdbl3, picustomdate1 as picustomdate1, picustomdate2 as picustomdate2, picustomdate3 as picustomdate3, pidownloaded as pidownloaded, pihargaedited as pihargaedited FROM m_12_pos_item where pikategori = '{FixQuotes_dr1}pikategorilain') ON DUPLICATE KEY UPDATE pistokminimal = VALUES(pistokminimal), pistokmaksimal = VALUES(pistokmaksimal), pistokreorder = VALUES(pistokreorder), pistokminorder = VALUES(pistokminorder), pihargajual1 = VALUES(pihargajual1), pihargajual2 = VALUES(pihargajual2), pihargajual3 = VALUES(pihargajual3), pihargajual4 = VALUES(pihargajual4), pihargajual5 = VALUES(pihargajual5), pidiskonjual1 = VALUES(pidiskonjual1), pidiskonjual2 = VALUES(pidiskonjual2), pidiskonjual3 = VALUES(pidiskonjual3), pidiskonjual4 = VALUES(pidiskonjual4), pidiskonjual5 = VALUES(pidiskonjual5), picustomtext1 = VALUES(picustomtext1), picustomtext2 = VALUES(picustomtext2), picustomtext3 = VALUES(picustomtext3), picustomtext4 = VALUES(picustomtext4), picustomtext5 = VALUES(picustomtext5), picustomint1 = VALUES(picustomint1), picustomint2 = VALUES(picustomint2), picustomint3 = VALUES(picustomint3), picustomdbl1 = VALUES(picustomdbl1), picustomdbl2 = VALUES(picustomdbl2), picustomdbl3 = VALUES(picustomdbl3), picustomdate1 = VALUES(picustomdate1), picustomdate2 = VALUES(picustomdate2), picustomdate3 = VALUES(picustomdate3), pidownloaded = VALUES(pidownloaded)
```

```sql
SELECT pikategori as kategoripos FROM m_12_pos_item pi WHERE pi.pikategori = '{FixQuotes_dr1}pikategori' GROUP BY pikategori
```

```sql
DELETE pi FROM m_12_pos_item pi JOIN m1_item i ON pi.piidbarang = i.bid WHERE pi.pikategori = '{FixQuotes_dr1}pikategori' AND i.bkategori = '{FixQuotes_dr1}pikategoribarang'
```

```sql
DELETE pi FROM m_12_pos_item pi WHERE pi.pikategori = '{FixQuotes_dr1}pikategori'
```

```sql
DELETE pi FROM m_12_pos_item pi JOIN m1_item i ON pi.piidbarang = i.bid JOIN m_12_pos_category pc ON pi.pikategori = pc.pckode AND pi.pikategori = '{FixQuotes_dr1}pikategori' JOIN m_12_pos_type pt ON pc.pctipepos = pt.ptkode JOIN m_12_pos_type_class_product ptcp ON pt.ptkode = ptcp.tipepos AND i.bkelasproduk = ptcp.kelasproduk
```

```sql
UPDATE m1_item i JOIN m_12_pos_item pi ON i.bid = pi.piidbarang JOIN m_12_pos_category pc ON pi.pikategori = pc.pckode AND pc.pckode = '{FixQuotes_dr1}pikategori' JOIN m1_index_price ip ON pc.pcindeksharga = ip.ipkode SET pi.pihargajual1 = ROUND((CASE WHEN ip.ipmargin = 0 THEN i.bhppaverage ELSE i.bhppaverage + ((ip.ipmargin / 100) * i.bhppaverage) END),2)
```

```sql
UPDATE m1_item i JOIN m_12_pos_item pi ON i.bid = pi.piidbarang JOIN m_12_pos_category pc ON pi.pikategori = pc.pckode AND pc.pckode = '{FixQuotes_dr1}pikategori' JOIN m1_index_price ip ON pc.pcindeksharga = ip.ipkode SET pi.pihargajual1 = ROUND((CASE WHEN ip.ipmargin = 0 THEN i.bhargabeli ELSE i.bhargabeli + ((ip.ipmargin / 100) * i.bhargabeli) END),2), pihargaedited = 1 WHERE pihargaedited = '0'
```

```sql
select `pi`.`pikategori` AS `pikategori`,`pi`.`piidbarang` AS `piidbarang`,`pi`.`pistokminimal` AS `pistokminimal`,`pi`.`pistokmaksimal` AS `pistokmaksimal`,`pi`.`pistokreorder` AS `pistokreorder`,`pi`.`pihargajual1` AS `pihargajual1`,`pi`.`pihargajual2` AS `pihargajual2`,`pi`.`pihargajual3` AS `pihargajual3`,`pi`.`pihargajual4` AS `pihargajual4`,`pi`.`pihargajual5` AS `pihargajual5`,`pi`.`pidiskonjual1` AS `pidiskonjual1`,`pi`.`pidiskonjual2` AS `pidiskonjual2`,`pi`.`pidiskonjual3` AS `pidiskonjual3`,`pi`.`pidiskonjual4` AS `pidiskonjual4`,`pi`.`pidiskonjual5` AS `pidiskonjual5`,`pi`.`picustomtext1` AS `picustomtext1`,`pi`.`picustomtext2` AS `picustomtext2`,`pi`.`picustomtext3` AS `picustomtext3`,`pi`.`picustomtext4` AS `picustomtext4`,`pi`.`picustomtext5` AS `picustomtext5`,`pi`.`picustomint1` AS `picustomint1`,`pi`.`picustomint2` AS `picustomint2`,`pi`.`picustomint3` AS `picustomint3`,`pi`.`picustomdbl1` AS `picustomdbl1`,`pi`.`picustomdbl2` AS `picustomdbl2`,`pi`.`picustomdbl3` AS `picustomdbl3`,`pi`.`picustomdate1` AS `picustomdate1`,`pi`.`picustomdate2` AS `picustomdate2`,`pi`.`picustomdate3` AS `picustomdate3`,`pc`.`pcnama` AS `pcnama`,`i`.`bkode` AS `bkode`,`i`.`bnama` AS `bnama`,`i`.`btipe` AS `btipe`,`i`.`bsatuan` AS `bsatuan`, pi.pistokminorder, pi.pihargaedited from ((`m_12_pos_item` `pi` join `m_12_pos_category` `pc` on((`pi`.`pikategori` = `pc`.`pckode`))) join `m1_item` `i` on((`pi`.`piidbarang` = `i`.`bid`)))
```

```sql
SELECT `pi`.`piidbarang` AS `piidbarang` FROM (m_12_pos_bonus_item `pbi` JOIN m_12_pos_item `pi` ON ((pbi.biidbarang = `pi`.`piidbarang`))) WHERE (`pi`.`pikategori` = 'valkode' AND `pi`.`piidbarang` = 'fidbarang') UNION ALL SELECT `pbid`.`idbarang` AS `piidbarang` FROM (m_12_pos_bonus_item_detail `pbid` JOIN m_12_pos_bonus_item `pbi` ON ((pbid.idbi = `pbi`.`biid`))) WHERE (`pbi`.`bikategori` = 'valkode' AND `pbid`.`idbarang` = 'fidbarang') UNION ALL SELECT `pi`.`piidbarang` AS `piidbarang` FROM (m_12_pos_additional_item `pai` JOIN m_12_pos_item `pi` ON ((pai.aiidbarang = `pi`.`piidbarang`))) WHERE (`pi`.`pikategori` = 'valkode' AND `pi`.`piidbarang` = 'fidbarang') UNION ALL SELECT `paid`.`idbarang` AS `piidbarang` FROM (m_12_pos_additional_item_detail `paid` JOIN m_12_pos_additional_item `pai` ON ((paid.idai = `pai`.`aiid`))) WHERE (`pai`.`aikategori` = 'valkode' AND `paid`.`idbarang` = 'fidbarang') UNION ALL SELECT `pi`.`piidbarang` AS `piidbarang` FROM (m_12_pos_additional_item `pai` JOIN m_12_pos_item `pi` ON ((pai.aiidbarang = `pi`.`piidbarang`))) WHERE (`pi`.`pikategori` = 'valkode' AND `pi`.`piidbarang` = 'fidbarang') UNION ALL SELECT `paid`.`idbarang` AS `piidbarang` FROM (m_12_pos_additional_item_detail `paid` JOIN m_12_pos_additional_item `pai` ON ((paid.idai = `pai`.`aiid`))) WHERE (`pai`.`aikategori` = 'valkode' AND `paid`.`idbarang` = 'fidbarang') UNION ALL SELECT `pi`.`piidbarang` AS `piidbarang` FROM (m_12_pos_substitution_item `psi` JOIN m_12_pos_item `pi` ON ((psi.siidbarang = `pi`.`piidbarang`))) WHERE (`pi`.`pikategori` = 'valkode' AND `pi`.`piidbarang` = 'fidbarang') UNION ALL SELECT `psid`.`idbarang` AS `piidbarang` FROM (m_12_pos_substitution_item_detail `psid` JOIN m_12_pos_substitution_item `psi` ON ((psid.idsi = `psi`.`siid`))) WHERE (`psi`.`sikategori` = 'valkode' AND `psid`.`idbarang` = 'fidbarang') UNION ALL SELECT `pi`.`piidbarang` AS `piidbarang` FROM (m_12_pos_discount_item `pdi` JOIN m_12_pos_item `pi` ON ((pdi.diidbarang = `pi`.`piidbarang`))) WHERE (`pi`.`pikategori` = 'valkode' AND `pi`.`piidbarang` = 'fidbarang') UNION ALL SELECT `ppi`.`piidbarang` AS `piidbarang` FROM (m_12_pos_point_item `ppi` JOIN m_12_pos_item `pi` ON ((ppi.piidbarang = `pi`.`piidbarang`))) WHERE (`ppi`.`pikategori` = 'valkode' AND `pi`.`piidbarang` = 'fidbarang')
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_pos_point_category_item.vb`

```sql
DELETE FROM M_12_Pos_Point_Category_Item WHERE pcikategori = '{FixQuotes_drutama}pcikategori' AND pcikategoribarang = '{FixQuotes_drutama}pcikategoribarang'
```

```sql
SELECT pci.pcikategori as kategori, pci.pcikategoribarang as kategoribarang, pci.pcioperator as operator, ic.icnama, (CASE pci.pcioperator WHEN 0 THEN 'Between' WHEN 1 THEN '>=' WHEN 2 THEN 'Multiple' ELSE 'Unknown' END) as operatornama FROM M_12_Pos_Point_Category_Item pci JOIN m1_item_category ic ON pci.pcikategoribarang = ic.ickode WHERE pci.pcikategori = '{FxDB_dr1}pcikategori' AND pci.pcikategoribarang = '{FxDB_dr1}pcikategoribarang' GROUP BY pci.pcioperator ORDER BY pci.pcioperator
```

```sql
Insert into M_12_Pos_Point_Category_Item(pcikategori, pcikategoribarang, pcioperator, pcijml1, pcijml2, pcijmlpoint, pcicustomtext1, pcicustomtext2, pcicustomtext3, pcicustomtext4, pcicustomtext5, pcicustomint1, pcicustomint2, pcicustomint3, pcicustomdbl1, pcicustomdbl2, pcicustomdbl3, pcicustomdate1, pcicustomdate2, pcicustomdate3) values{strValue2_ToString}
```

```sql
SELECT pcikategori as kategoripos FROM M_12_Pos_Point_Category_Item WHERE pcikategori = '{pcikategori}' AND pcikategoribarang = '{pcikategoribarang}' AND pcioperator = '{pcioperator}' AND pcijml1 = '{pcijml1}' AND pcijml2 = '{pcijml2}' GROUP BY pcikategori
```

```sql
DELETE FROM M_12_Pos_Point_Category_Item WHERE pcikategori = '{pcikategori}' AND pcikategoribarang = '{pcikategoribarang}' AND pcioperator = '{pcioperator}' AND pcijml1 = '{pcijml1}' AND pcijml2 = '{pcijml2}'
```

```sql
DELETE FROM M_12_Pos_Point_Category_Item
```

```sql
select `pci`.`pcikategori` AS `pcikategori`,`pci`.`pcikategoribarang` AS `pcikategoribarang`,`pci`.`pcioperator` AS `pcioperator`,`pci`.`pcijml1` AS `pcijml1`,`pci`.`pcijml2` AS `pcijml2`,`pci`.`pcijmlpoint` AS `pcijmlpoint`,`pci`.`pcicustomtext1` AS `pcicustomtext1`,`pci`.`pcicustomtext2` AS `pcicustomtext2`,`pci`.`pcicustomtext3` AS `pcicustomtext3`,`pci`.`pcicustomtext4` AS `pcicustomtext4`,`pci`.`pcicustomtext5` AS `pcicustomtext5`,`pci`.`pcicustomint1` AS `pcicustomint1`,`pci`.`pcicustomint2` AS `pcicustomint2`,`pci`.`pcicustomint3` AS `pcicustomint3`,`pci`.`pcicustomdbl1` AS `pcicustomdbl1`,`pci`.`pcicustomdbl2` AS `pcicustomdbl2`,`pci`.`pcicustomdbl3` AS `pcicustomdbl3`,`pci`.`pcicustomdate1` AS `pcicustomdate1`,`pci`.`pcicustomdate2` AS `pcicustomdate2`,`pci`.`pcicustomdate3` AS `pcicustomdate3`,`pc`.`pcnama` AS `pcnama`,`ic`.`icnama` AS `icnama`,(case `pci`.`pcioperator` when 0 then 'Between' when 1 then '>=' when 2 then 'Multiple' else 'Unknown' end) AS `pcioperatornama` from ((`M_12_Pos_Point_Category_Item` `pci` join `m_12_pos_category` `pc` on((`pci`.`pcikategori` = `pc`.`pckode`))) join `m1_item_category` `ic` on((`pci`.`pcikategoribarang` = `ic`.`ickode`)))
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_pos_point_item.vb`

```sql
DELETE FROM m_12_pos_point_item WHERE pikategori = '{FixQuotes_drutama}pikategori' AND piidbarang = '{FixQuotes_drutama}piidbarang'
```

```sql
SELECT pi.pikategori as kategori, pi.piidbarang as idbarang, pi.pioperator as operator, i.bkode, (CASE pi.pioperator WHEN 0 THEN 'Between' WHEN 1 THEN '>=' WHEN 2 THEN 'Multiple' ELSE 'Unknown' END) as operatornama FROM m_12_pos_point_item pi JOIN m1_item i ON pi.piidbarang = i.bid WHERE pi.pikategori = '{FxDB_dr1}pikategori' AND pi.piidbarang = '{FxDB_dr1}piidbarang' GROUP BY pi.pioperator ORDER BY pi.pioperator
```

```sql
Insert into M_12_Pos_Point_Item(pikategori, piidbarang, pioperator, pijml1, pijml2, pijmlpoint, picustomtext1, picustomtext2, picustomtext3, picustomtext4, picustomtext5, picustomint1, picustomint2, picustomint3, picustomdbl1, picustomdbl2, picustomdbl3, picustomdate1, picustomdate2, picustomdate3, pitgl1, pitgl2) values{strValue2_ToString}
```

```sql
SELECT pikategori as kategoripos FROM M_12_Pos_Point_Item WHERE pikategori = '{pikategori}' AND piidbarang = '{piidbarang}' AND pioperator = '{pioperator}' AND pijml1 = '{pijml1}' AND pijml2 = '{pijml2}' GROUP BY pikategori
```

```sql
DELETE FROM M_12_Pos_Point_Item WHERE pikategori = '{pikategori}' AND piidbarang = '{piidbarang}' AND pioperator = '{pioperator}' AND pijml1 = '{pijml1}' AND pijml2 = '{pijml2}'
```

```sql
DELETE FROM M_12_Pos_Point_Item
```

```sql
Insert into M_12_Pos_Point_Item(pikategori, piidbarang, pioperator, pijml1, pijml2, pijmlpoint, picustomtext1, picustomtext2, picustomtext3, picustomtext4, picustomtext5, picustomint1, picustomint2, picustomint3, picustomdbl1, picustomdbl2, picustomdbl3, picustomdate1, picustomdate2, picustomdate3) values{strValue2_ToString}
```

```sql
select `pi`.`pikategori` AS `pikategori`,`pi`.`piidbarang` AS `piidbarang`,`pi`.`pioperator` AS `pioperator`,`pi`.`pijml1` AS `pijml1`,`pi`.`pijml2` AS `pijml2`,`pi`.`pijmlpoint` AS `pijmlpoint`,`pi`.`picustomtext1` AS `picustomtext1`,`pi`.`picustomtext2` AS `picustomtext2`,`pi`.`picustomtext3` AS `picustomtext3`,`pi`.`picustomtext4` AS `picustomtext4`,`pi`.`picustomtext5` AS `picustomtext5`,`pi`.`picustomint1` AS `picustomint1`,`pi`.`picustomint2` AS `picustomint2`,`pi`.`picustomint3` AS `picustomint3`,`pi`.`picustomdbl1` AS `picustomdbl1`,`pi`.`picustomdbl2` AS `picustomdbl2`,`pi`.`picustomdbl3` AS `picustomdbl3`,`pi`.`picustomdate1` AS `picustomdate1`,`pi`.`picustomdate2` AS `picustomdate2`,`pi`.`picustomdate3` AS `picustomdate3`,`pc`.`pcnama` AS `pcnama`,`i`.`bkode` AS `bkode`,`i`.`bnama` AS `bnama`,`i`.`btipe` AS `btipe`,`i`.`bsatuan` AS `bsatuan`,(case `pi`.`pioperator` when 0 then 'Between' when 1 then '>=' when 2 then 'Multiple' else 'Unknown' end) AS `pioperatornama`, `pitgl1` AS `pitgl1`, `pitgl2` AS `pitgl2` from ((`m_12_pos_point_item` `pi` join `m_12_pos_category` `pc` on((`pi`.`pikategori` = `pc`.`pckode`))) join `m1_item` `i` on((`pi`.`piidbarang` = `i`.`bid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_pos_point_transaction.vb`

```sql
DELETE FROM m_12_pos_point_transaction WHERE ptkategori = '{FixQuotes_drutama}ptkategori'
```

```sql
SELECT pt.ptkategori as kategori, pt.ptoperator as operator, (CASE pt.ptoperator WHEN 0 THEN 'Between' WHEN 1 THEN '>=' WHEN 2 THEN 'Multiple' ELSE 'Unknown' END) as operatornama FROM m_12_pos_point_transaction pt WHERE pt.ptkategori = '{FxDB_dr1}ptkategori' GROUP BY pt.ptoperator ORDER BY pt.ptoperator
```

```sql
Insert into M_12_Pos_Point_Transaction(ptkategori, ptoperator, ptjml1, ptjml2, ptjmlpoint, ptcustomtext1, ptcustomtext2, ptcustomtext3, ptcustomtext4, ptcustomtext5, ptcustomint1, ptcustomint2, ptcustomint3, ptcustomdbl1, ptcustomdbl2, ptcustomdbl3, ptcustomdate1, ptcustomdate2, ptcustomdate3, pttgl1, pttgl2) values{strValue2_ToString}
```

```sql
SELECT ptkategori as kategoripos FROM M_12_Pos_Point_Transaction WHERE ptkategori = '{ptkategori}' AND ptoperator = '{ptoperator}' AND ptjml1 = '{ptjml1}' AND ptjml2 = '{ptjml2}' GROUP BY ptkategori
```

```sql
DELETE FROM M_12_Pos_Point_Transaction WHERE ptkategori = '{ptkategori}' AND ptoperator = '{ptoperator}' AND ptjml1 = '{ptjml1}' AND ptjml2 = '{ptjml2}'
```

```sql
DELETE FROM M_12_Pos_Point_Transaction
```

```sql
Insert into M_12_Pos_Point_Transaction(ptkategori, ptoperator, ptjml1, ptjml2, ptjmlpoint, ptcustomtext1, ptcustomtext2, ptcustomtext3, ptcustomtext4, ptcustomtext5, ptcustomint1, ptcustomint2, ptcustomint3, ptcustomdbl1, ptcustomdbl2, ptcustomdbl3, ptcustomdate1, ptcustomdate2, ptcustomdate3) values{strValue2_ToString}
```

```sql
select `pt`.`ptkategori` AS `ptkategori`,`pt`.`ptoperator` AS `ptoperator`,`pt`.`ptjml1` AS `ptjml1`,`pt`.`ptjml2` AS `ptjml2`,`pt`.`ptjmlpoint` AS `ptjmlpoint`,`pt`.`ptcustomtext1` AS `ptcustomtext1`,`pt`.`ptcustomtext2` AS `ptcustomtext2`,`pt`.`ptcustomtext3` AS `ptcustomtext3`,`pt`.`ptcustomtext4` AS `ptcustomtext4`,`pt`.`ptcustomtext5` AS `ptcustomtext5`,`pt`.`ptcustomint1` AS `ptcustomint1`,`pt`.`ptcustomint2` AS `ptcustomint2`,`pt`.`ptcustomint3` AS `ptcustomint3`,`pt`.`ptcustomdbl1` AS `ptcustomdbl1`,`pt`.`ptcustomdbl2` AS `ptcustomdbl2`,`pt`.`ptcustomdbl3` AS `ptcustomdbl3`,`pt`.`ptcustomdate1` AS `ptcustomdate1`,`pt`.`ptcustomdate2` AS `ptcustomdate2`,`pt`.`ptcustomdate3` AS `ptcustomdate3`,`pc`.`pcnama` AS `pcnama`,(case `pt`.`ptoperator` when 0 then 'Between' when 1 then '>=' when 2 then 'Multiple' else 'Unknown' end) AS `ptoperatornama`, `pt`.`pttgl1` AS `pttgl1`, `pt`.`pttgl2` AS `pttgl2` from (`m_12_pos_point_transaction` `pt` join `m_12_pos_category` `pc` on((`pt`.`ptkategori` = `pc`.`pckode`)))
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_pos_promo.vb`

```sql
SELECT pi.pikategori, pc.pcnama, i.bid, i.bkode, i.bnama, i.bsatuan, pi.pihargajual1 FROM m_12_pos_item pi JOIN m1_item i ON i.bid = pi.piidbarang JOIN m_12_pos_category pc ON pc.pckode = pi.pikategori
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_pos_setting.vb`

```sql
Insert into M_12_Pos_Setting(smodule, sgrup, skode, snama, suraian, surutan, snilai, stipedata, sjenisinputan, scombodata) values{strValue2_ToString} ON DUPLICATE KEY UPDATE snama = VALUES(snama), suraian = VALUES(suraian), surutan = VALUES(surutan), snilai = VALUES(snilai), stipedata = VALUES(stipedata), sjenisinputan = VALUES(sjenisinputan), scombodata = VALUES(scombodata)
```

```sql
DELETE FROM M_12_Pos_Setting WHERE smodule = '{modul}' AND sgrup='{grup}' AND skode='{kode}'
```

```sql
select `ps`.`smodule` AS `smodule`,`ps`.`sgrup` AS `sgrup`,`ps`.`skode` AS `skode`,`ps`.`snama` AS `snama`,`ps`.`suraian` AS `suraian`,`ps`.`surutan` AS `surutan`,`ps`.`snilai` AS `snilai`,`ps`.`stipedata` AS `stipedata`,`ps`.`sjenisinputan` AS `sjenisinputan`,`ps`.`scombodata` AS `scombodata`,`m`.`mname` AS `modulename` from (`m_12_pos_setting` `ps` join `m0_module` `m` on((`ps`.`smodule` = `m`.`mid`)))
```

```sql
DELETE FROM M_12_Pos_Setting
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_pos_substitution_item.vb`

```sql
SELECT si.sikategori as kategori, si.siidbarang as idbarang, si.sioperator as operator, i.bkode, (CASE si.sioperator WHEN 0 THEN 'Between' WHEN 1 THEN '>=' WHEN 2 THEN 'Multiple' ELSE 'Unknown' END) as operatornama FROM m_12_pos_substitution_item si JOIN m1_item i ON si.siidbarang = i.bid WHERE si.sikategori = '{FxDB_drutama}sikategori' AND si.siidbarang = '{FxDB_drutama}siidbarang' AND si.siid <> '{FxDB_drutama}siid' GROUP BY si.sioperator ORDER BY si.sioperator
```

```sql
SELECT COUNT(siid) FROM M_12_Pos_Substitution_Item WHERE siid = '{result_4}'
```

```sql
Update M_12_Pos_Substitution_Item set sikategori = '{FixQuotes_drutama}sikategori', siidbarang = '{FixQuotes_drutama}siidbarang', sioperator = '{FixQuotes_drutama}sioperator', sijml1 = '{FixDouble_drutama}sijml1', sijml2 = '{FixDouble_drutama}sijml2', sicustomtext1 = '{FixQuotes_drutama}sicustomtext1', sicustomtext2 = '{FixQuotes_drutama}sicustomtext2', sicustomtext3 = '{FixQuotes_drutama}sicustomtext3', sicustomtext4 = '{FixQuotes_drutama}sicustomtext4', sicustomtext5 = '{FixQuotes_drutama}sicustomtext5', sicustomint1 = {drutama}sicustomint1, sicustomint2 = {drutama}sicustomint2, sicustomint3 = {drutama}sicustomint3, sicustomdbl1 = '{FixDouble_drutama}sicustomdbl1', sicustomdbl2 = '{FixDouble_drutama}sicustomdbl2', sicustomdbl3 = '{FixDouble_drutama}sicustomdbl3', sicustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}sicustomdate1', sicustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}sicustomdate2', sicustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}sicustomdate3', sitgl1 = '{FixQuotes_AsFormatTanggal_drutama}sitgl1', sitgl2 = '{FixQuotes_AsFormatTanggal_drutama}sitgl2', sinopromo = '{FixQuotes_drutama}sinopromo' where siid = '{drutama}siid'
```

```sql
Insert into M_12_Pos_Substitution_Item (sikategori, siidbarang, sioperator, sijml1, sijml2, sicustomtext1, sicustomtext2, sicustomtext3, sicustomtext4, sicustomtext5, sicustomint1, sicustomint2, sicustomint3, sicustomdbl1, sicustomdbl2, sicustomdbl3, sicustomdate1, sicustomdate2, sicustomdate3, sitgl1, sitgl2, sinopromo) values('{FixQuotes_drutama}sikategori', '{FixQuotes_drutama}siidbarang', '{FixQuotes_drutama}sioperator', '{FixDouble_drutama}sijml1', '{FixDouble_drutama}sijml2', '{FixQuotes_drutama}sicustomtext1', '{FixQuotes_drutama}sicustomtext2', '{FixQuotes_drutama}sicustomtext3', '{FixQuotes_drutama}sicustomtext4', '{FixQuotes_drutama}sicustomtext5', {drutama}sicustomint1, {drutama}sicustomint2, {drutama}sicustomint3, '{FixDouble_drutama}sicustomdbl1', '{FixDouble_drutama}sicustomdbl2', '{FixDouble_drutama}sicustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}sicustomdate1', '{FixQuotes_AsFormatTanggal_drutama}sicustomdate2', '{FixQuotes_AsFormatTanggal_drutama}sicustomdate3', '{FixQuotes_AsFormatTanggal_drutama}sitgl1', '{FixQuotes_AsFormatTanggal_drutama}sitgl2', '{FixQuotes_drutama}sinopromo')
```

```sql
select siid from M_12_Pos_Substitution_Item where sikategori = '{drutama}sikategori' AND siidbarang = '{drutama}siidbarang' AND sioperator = '{drutama}sioperator' AND sijml1 = '{drutama}sijml1' AND sijml2 = '{drutama}sijml2' limit 1
```

```sql
Delete from M_12_Pos_Substitution_Item_Detail where idsi = '{result_4}'
```

```sql
Insert into M_12_Pos_Substitution_Item_Detail(idsidetail, idsi, idbarang, jml, satuan, customtext1, customtext2, customtext3, customtext4, customtext5, customint1, customint2, customint3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
SELECT sikategori as kategoripos FROM M_12_Pos_Substitution_Item WHERE siid = '{idtransaksi}' GROUP BY sikategori
```

```sql
DELETE FROM M_12_Pos_Substitution_Item_Detail WHERE idsi = '{idtransaksi}'
```

```sql
DELETE FROM M_12_Pos_Substitution_Item WHERE siid = '{idtransaksi}'
```

```sql
Delete from M_12_Pos_Substitution_Item
```

```sql
Delete from M_12_Pos_Substitution_Item_Detail
```

```sql
Insert into M_12_Pos_Substitution_Item(siid, sikategori, siidbarang, sioperator, sijml1, sijml2, sicustomtext1, sicustomtext2, sicustomtext3, sicustomtext4, sicustomtext5, sicustomint1, sicustomint2, sicustomint3, sicustomdbl1, sicustomdbl2, sicustomdbl3, sicustomdate1, sicustomdate2, sicustomdate3) values{strValue1_ToString}
```

```sql
select `si`.`siid` AS `siid`,`si`.`sikategori` AS `sikategori`,`si`.`siidbarang` AS `siidbarang`,`si`.`sioperator` AS `sioperator`,`si`.`sijml1` AS `sijml1`,`si`.`sijml2` AS `sijml2`,`si`.`sicustomtext1` AS `sicustomtext1`,`si`.`sicustomtext2` AS `sicustomtext2`,`si`.`sicustomtext3` AS `sicustomtext3`,`si`.`sicustomtext4` AS `sicustomtext4`,`si`.`sicustomtext5` AS `sicustomtext5`,`si`.`sicustomint1` AS `sicustomint1`,`si`.`sicustomint2` AS `sicustomint2`,`si`.`sicustomint3` AS `sicustomint3`,`si`.`sicustomdbl1` AS `sicustomdbl1`,`si`.`sicustomdbl2` AS `sicustomdbl2`,`si`.`sicustomdbl3` AS `sicustomdbl3`,`si`.`sicustomdate1` AS `sicustomdate1`,`si`.`sicustomdate2` AS `sicustomdate2`,`si`.`sicustomdate3` AS `sicustomdate3`,`pc`.`pcnama` AS `pcnama`,`i`.`bkode` AS `bkode`,`i`.`bnama` AS `bnama`,`i`.`btipe` AS `btipe`,`i`.`bsatuan` AS `bsatuan`,(case `si`.`sioperator` when 0 then 'Between' when 1 then '>=' when 2 then 'Multiple' else 'Unknown' end) AS `sioperatornama`, `si`.`sitgl1` AS `sitgl1`, `si`.`sitgl2` AS `sitgl2`, `si`.`sitgl2` AS `sitgl2`, `si`.`sinopromo` AS `sinopromo`,`sid`.`idsidetail` AS `idsidetail`,`sid`.`idsi` AS `idsi`,`sid`.`idbarang` AS `idbarang`,`sid`.`jml` AS `jml`,`i2`.`bsatuan` AS `satuan`,`sid`.`customtext1` AS `customtext1`,`sid`.`customtext2` AS `customtext2`,`sid`.`customtext3` AS `customtext3`,`sid`.`customtext4` AS `customtext4`,`sid`.`customtext5` AS `customtext5`,`sid`.`customint1` AS `customint1`,`sid`.`customint2` AS `customint2`,`sid`.`customint3` AS `customint3`,`sid`.`customdbl1` AS `customdbl1`,`sid`.`customdbl2` AS `customdbl2`,`sid`.`customdbl3` AS `customdbl3`,`sid`.`customdate1` AS `customdate1`,`sid`.`customdate2` AS `customdate2`,`sid`.`customdate3` AS `customdate3`,`i2`.`bkode` AS `kodebarang`,`i2`.`bnama` AS `namabarang`,`i2`.`btipe` AS `tipebarang` from ((((`M_12_Pos_Substitution_Item` `si` join `m_12_pos_category` `pc` on((`si`.`sikategori` = `pc`.`pckode`))) join `m1_item` `i` on((`si`.`siidbarang` = `i`.`bid`))) join `M_12_Pos_Substitution_Item_detail` `sid` on((`si`.`siid` = `sid`.`idsi`))) join `m1_item` `i2` on((`sid`.`idbarang` = `i2`.`bid`)))
```

```sql
select `si`.`siid` AS `siid`,`si`.`sikategori` AS `sikategori`,`si`.`siidbarang` AS `siidbarang`,`si`.`sioperator` AS `sioperator`,`si`.`sijml1` AS `sijml1`,`si`.`sijml2` AS `sijml2`,`si`.`sicustomtext1` AS `sicustomtext1`,`si`.`sicustomtext2` AS `sicustomtext2`,`si`.`sicustomtext3` AS `sicustomtext3`,`si`.`sicustomtext4` AS `sicustomtext4`,`si`.`sicustomtext5` AS `sicustomtext5`,`si`.`sicustomint1` AS `sicustomint1`,`si`.`sicustomint2` AS `sicustomint2`,`si`.`sicustomint3` AS `sicustomint3`,`si`.`sicustomdbl1` AS `sicustomdbl1`,`si`.`sicustomdbl2` AS `sicustomdbl2`,`si`.`sicustomdbl3` AS `sicustomdbl3`,`si`.`sicustomdate1` AS `sicustomdate1`,`si`.`sicustomdate2` AS `sicustomdate2`,`si`.`sicustomdate3` AS `sicustomdate3`,`pc`.`pcnama` AS `pcnama`,`i`.`bkode` AS `bkode`,`i`.`bnama` AS `bnama`,`i`.`btipe` AS `btipe`,`i`.`bsatuan` AS `bsatuan`,(case `si`.`sioperator` when 0 then 'Between' when 1 then '>=' when 2 then 'Multiple' else 'Unknown' end) AS `sioperatornama`, si.`sitgl1` AS `sitgl1`, si.`sitgl2` AS `sitgl2`, si.`sinopromo` AS `sinopromo` from ((`M_12_Pos_Substitution_Item` `si` join `m_12_pos_category` `pc` on((`si`.`sikategori` = `pc`.`pckode`))) join `m1_item` `i` on((`si`.`siidbarang` = `i`.`bid`)))
```

```sql
select `sid`.`idsidetail` AS `idsidetail`,`sid`.`idsi` AS `idsi`,`sid`.`idbarang` AS `idbarang`,`sid`.`jml` AS `jml`,`i`.`bsatuan` AS `satuan`,`sid`.`customtext1` AS `customtext1`,`sid`.`customtext2` AS `customtext2`,`sid`.`customtext3` AS `customtext3`,`sid`.`customtext4` AS `customtext4`,`sid`.`customtext5` AS `customtext5`,`sid`.`customint1` AS `customint1`,`sid`.`customint2` AS `customint2`,`sid`.`customint3` AS `customint3`,`sid`.`customdbl1` AS `customdbl1`,`sid`.`customdbl2` AS `customdbl2`,`sid`.`customdbl3` AS `customdbl3`,`sid`.`customdate1` AS `customdate1`,`sid`.`customdate2` AS `customdate2`,`sid`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bnama` AS `namabarang`,`i`.`btipe` AS `tipebarang` from (`m_12_pos_substitution_item_detail` `sid` join `m1_item` `i` on((`sid`.`idbarang` = `i`.`bid`)))
```

```sql
SELECT si.siid, i.bid AS bid, i.bkode AS bkode, i.bnama AS bnama, i.btipe AS btipe, i.bjenis AS bjenis, i.bkategori AS bkategori, i.bsatuan AS bsatuan, i.bsatuandefault AS bsatuandefault, i.bhpp AS bhpp, i.bbarcode AS bbarcode, i.bhargabeli AS bhargabeli, i.bhppaverage AS bhppaverage, pi.pihargajual1 AS bhargajual1, pi.pihargajual2 AS bhargajual2, pi.pihargajual3 AS bhargajual3, pi.pihargajual4 AS bhargajual4, pi.pihargajual5 AS bhargajual5, pi.pidiskonjual1 AS bdiskonjual1, pi.pidiskonjual2 AS bdiskonjual2, pi.pidiskonjual3 AS bdiskonjual3, pi.pidiskonjual4 AS bdiskonjual4, pi.pidiskonjual5 AS bdiskonjual5, i.bstok AS bstok, ifnull(sum(`ib`.`jmlbooking`),0) AS bstokbooking, i.bmarginminimal AS bmarginminimal, i.brekpersediaan AS brekpersediaan, i.brekpenjualan AS brekpenjualan, i.brekreturpenjualan AS brekreturpenjualan, i.brekdiskonpenjualan AS brekdiskonpenjualan, i.brekhargapokok AS brekhargapokok, i.brekreturpembelian AS brekreturpembelian, i.brekdiskonpembelian AS brekdiskonpembelian, i.brekkonsinyasi AS brekkonsinyasi, i.bserial AS bserial, i.bbatch AS bbatch, i.bnilaisatuan AS bnilaisatuan, i.bnilaisatuandefault AS bnilaisatuandefault, i.bsuplier AS bsuplier, c.kkode AS bsuplierkode, c.knama AS bsupliernama, f.fnamafile AS bnamafile, i.bapanjang AS bapanjang, i.balebar AS balebar, i.batinggi AS batinggi, pi.pistokminimal AS bstokminimal, pi.pistokmaksimal AS bstokmaksimal, pi.pistokreorder AS breorder, sid.jml from `m1_item` `i` JOIN m_12_pos_substitution_item_detail sid ON i.bid = sid.idbarang JOIN m_12_pos_substitution_item si ON sid.idsi = si.siid JOIN m_12_pos_item pi ON sid.idbarang = pi.piidbarang AND si.sikategori = pi.pikategori left join `m1_item_booking` `ib` on `i`.`bid` = `ib`.`idbarang` left join `m1_contact` `c` on `i`.`bsuplier` = `c`.`kid` left join `m1_files` `f` on `f`.`fsumber` = 'Item' and `i`.`bid` = `f`.`fidtransaksi` and `f`.`fdefault` = 1
```

```sql
SELECT sid.idsidetail, sid.idsi, sid.idbarang, sid.jml, sid.satuan, sid.customtext1, sid.customtext2, sid.customtext3, sid.customtext4, sid.customtext5, sid.customint1, sid.customint2, sid.customint3, sid.customdbl1, sid.customdbl2, sid.customdbl3, sid.customdate1, sid.customdate2, sid.customdate3 FROM m_12_pos_substitution_item si JOIN m_12_pos_substitution_item_detail sid ON si.siid = sid.idsi
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_pos_type.vb`

```sql
SELECT COUNT(ptkode) FROM M_12_Pos_Type WHERE ptkode= '{result_4}'
```

```sql
Update M_12_Pos_Type set ptnama = '{FixQuotes_drutama}ptnama', ptcatatan = '{FixQuotes_drutama}ptcatatan', ptaktif = {drutama}ptaktif, ptmodifikasiuser = {drutama}ptmodifikasiuser, ptmodifikasitgl = '{FixQuotes_AsFormatTanggal_drutama}ptmodifikasitglyyyy-MM-dd H:mm:ss', ptcustomtext1 = '{FixQuotes_drutama}ptcustomtext1', ptcustomtext2 = '{FixQuotes_drutama}ptcustomtext2', ptcustomtext3 = '{FixQuotes_drutama}ptcustomtext3', ptcustomtext4 = '{FixQuotes_drutama}ptcustomtext4', ptcustomtext5 = '{FixQuotes_drutama}ptcustomtext5', ptcustomint1 = {drutama}ptcustomint1, ptcustomint2 = {drutama}ptcustomint2, ptcustomint3 = {drutama}ptcustomint3, ptcustomdbl1 = '{FixDouble_drutama}ptcustomdbl1', ptcustomdbl2 = '{FixDouble_drutama}ptcustomdbl2', ptcustomdbl3 = '{FixDouble_drutama}ptcustomdbl3', ptcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}ptcustomdate1', ptcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}ptcustomdate2', ptcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}ptcustomdate3' where ptkode = '{drutama}ptkode'
```

```sql
Insert into M_12_Pos_Type (ptkode, ptnama, ptcatatan, ptaktif, ptinputuser, ptinputtgl, ptmodifikasiuser, ptmodifikasitgl, ptcustomtext1, ptcustomtext2, ptcustomtext3, ptcustomtext4, ptcustomtext5, ptcustomint1, ptcustomint2, ptcustomint3, ptcustomdbl1, ptcustomdbl2, ptcustomdbl3, ptcustomdate1, ptcustomdate2, ptcustomdate3) values('{FixQuotes_drutama}ptkode', '{FixQuotes_drutama}ptnama', '{FixQuotes_drutama}ptcatatan', {drutama}ptaktif, {drutama}ptinputuser, '{FixQuotes_AsFormatTanggal_drutama}ptinputtglyyyy-MM-dd H:mm:ss', 0, '1971-01-01 00:00:00', '{FixQuotes_drutama}ptcustomtext1', '{FixQuotes_drutama}ptcustomtext2', '{FixQuotes_drutama}ptcustomtext3', '{FixQuotes_drutama}ptcustomtext4', '{FixQuotes_drutama}ptcustomtext5', {drutama}ptcustomint1, {drutama}ptcustomint2, {drutama}ptcustomint3, '{FixDouble_drutama}ptcustomdbl1', '{FixDouble_drutama}ptcustomdbl2', '{FixDouble_drutama}ptcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}ptcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}ptcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}ptcustomdate3')
```

```sql
select ptkode from M_12_Pos_Type where ptkode = '{FixQuotes_drutama}ptkode' order by ptmodifikasitgl desc limit 1
```

```sql
Delete from M_12_Pos_Type_Class_Product where tipepos = '{result_4}'
```

```sql
Insert into M_12_Pos_Type_Class_Product(tipepos, kelasproduk) values{strValue2_ToString}
```

```sql
DELETE FROM M_12_Pos_Type_Class_Product WHERE tipepos = '{idtransaksi}'
```

```sql
DELETE FROM M_12_Pos_Type WHERE ptkode = '{idtransaksi}'
```

```sql
select `pt`.`ptkode` AS `ptkode`,`pt`.`ptnama` AS `ptnama`,`pt`.`ptcatatan` AS `ptcatatan`,`pt`.`ptaktif` AS `ptaktif`,`pt`.`ptinputuser` AS `ptinputuser`,`pt`.`ptinputtgl` AS `ptinputtgl`,`pt`.`ptmodifikasiuser` AS `ptmodifikasiuser`,`pt`.`ptmodifikasitgl` AS `ptmodifikasitgl`,`pt`.`ptcustomtext1` AS `ptcustomtext1`,`pt`.`ptcustomtext2` AS `ptcustomtext2`,`pt`.`ptcustomtext3` AS `ptcustomtext3`,`pt`.`ptcustomtext4` AS `ptcustomtext4`,`pt`.`ptcustomtext5` AS `ptcustomtext5`,`pt`.`ptcustomint1` AS `ptcustomint1`,`pt`.`ptcustomint2` AS `ptcustomint2`,`pt`.`ptcustomint3` AS `ptcustomint3`,`pt`.`ptcustomdbl1` AS `ptcustomdbl1`,`pt`.`ptcustomdbl2` AS `ptcustomdbl2`,`pt`.`ptcustomdbl3` AS `ptcustomdbl3`,`pt`.`ptcustomdate1` AS `ptcustomdate1`,`pt`.`ptcustomdate2` AS `ptcustomdate2`,`pt`.`ptcustomdate3` AS `ptcustomdate3`,`u1`.`unama` AS `ptinputusernama`,`u2`.`unama` AS `ptmodifikasiusernama` from ((`m_12_pos_type` `pt` left join `m0_user` `u1` on((`pt`.`ptinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`pt`.`ptmodifikasiuser` = `u2`.`userid`)))
```

```sql
select `pt`.`ptkode` AS `ptkode`,`pt`.`ptnama` AS `ptnama`,`pt`.`ptcatatan` AS `ptcatatan`,`pt`.`ptaktif` AS `ptaktif`,`pt`.`ptinputuser` AS `ptinputuser`,`pt`.`ptinputtgl` AS `ptinputtgl`,`pt`.`ptmodifikasiuser` AS `ptmodifikasiuser`,`pt`.`ptmodifikasitgl` AS `ptmodifikasitgl`,`pt`.`ptcustomtext1` AS `ptcustomtext1`,`pt`.`ptcustomtext2` AS `ptcustomtext2`,`pt`.`ptcustomtext3` AS `ptcustomtext3`,`pt`.`ptcustomtext4` AS `ptcustomtext4`,`pt`.`ptcustomtext5` AS `ptcustomtext5`,`pt`.`ptcustomint1` AS `ptcustomint1`,`pt`.`ptcustomint2` AS `ptcustomint2`,`pt`.`ptcustomint3` AS `ptcustomint3`,`pt`.`ptcustomdbl1` AS `ptcustomdbl1`,`pt`.`ptcustomdbl2` AS `ptcustomdbl2`,`pt`.`ptcustomdbl3` AS `ptcustomdbl3`,`pt`.`ptcustomdate1` AS `ptcustomdate1`,`pt`.`ptcustomdate2` AS `ptcustomdate2`,`pt`.`ptcustomdate3` AS `ptcustomdate3`,`u1`.`unama` AS `ptinputusernama`,`u2`.`unama` AS `ptmodifikasiusernama` from `m_12_pos_type` `pt` left join `m0_user` `u1` on `pt`.`ptinputuser` = `u1`.`userid` left join `m0_user` `u2` on `pt`.`ptmodifikasiuser` = `u2`.`userid`
```

```sql
SELECT ptcp.tipepos as tipepos, cp.cpkode as kelasproduk, cp.cpnama as kelasproduknama FROM m1_class_product cp LEFT JOIN m_12_pos_type_class_product ptcp ON cp.cpkode = ptcp.kelasproduk AND ptcp.tipepos = 'valkode'
```

```sql
SELECT pt.ptkode as ptkode, pt.ptnama as ptnama, 'POS Category' as sumber, pc.pckode as idterkait FROM m_12_pos_category pc JOIN m_12_pos_type pt ON pc.pctipepos = pt.ptkode AND pt.ptkode = 'valkode' GROUP BY pt.ptkode, pc.pckode
```

```sql
SELECT COUNT(ptkode) FROM M_12_Pos_Type WHERE ptkode='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_pos_type_history.vb`

```sql
INSERT INTO M_12_Pos_Type_History(SELECT 0, pt.* FROM M_12_Pos_Type pt WHERE pt.ptkode = '{idtransaksi}')
```

```sql
SELECT ptidhistory FROM M_12_Pos_Type_History WHERE ptkode = '{idtransaksi}' ORDER BY ptmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO M_12_Pos_Type_Class_Product_History(SELECT '{FixQuotes_result_4}', pt.* FROM M_12_Pos_Type_Class_Product pt WHERE pt.tipepos = '{idtransaksi}')
```

```sql
select pt.ptidhistory, `pt`.`ptkode` AS `ptkode`,`pt`.`ptnama` AS `ptnama`,`pt`.`ptcatatan` AS `ptcatatan`,`pt`.`ptaktif` AS `ptaktif`,`pt`.`ptinputuser` AS `ptinputuser`,`pt`.`ptinputtgl` AS `ptinputtgl`,`pt`.`ptmodifikasiuser` AS `ptmodifikasiuser`,`pt`.`ptmodifikasitgl` AS `ptmodifikasitgl`,`pt`.`ptcustomtext1` AS `ptcustomtext1`,`pt`.`ptcustomtext2` AS `ptcustomtext2`,`pt`.`ptcustomtext3` AS `ptcustomtext3`,`pt`.`ptcustomtext4` AS `ptcustomtext4`,`pt`.`ptcustomtext5` AS `ptcustomtext5`,`pt`.`ptcustomint1` AS `ptcustomint1`,`pt`.`ptcustomint2` AS `ptcustomint2`,`pt`.`ptcustomint3` AS `ptcustomint3`,`pt`.`ptcustomdbl1` AS `ptcustomdbl1`,`pt`.`ptcustomdbl2` AS `ptcustomdbl2`,`pt`.`ptcustomdbl3` AS `ptcustomdbl3`,`pt`.`ptcustomdate1` AS `ptcustomdate1`,`pt`.`ptcustomdate2` AS `ptcustomdate2`,`pt`.`ptcustomdate3` AS `ptcustomdate3`,`u1`.`unama` AS `ptinputusernama`,`u2`.`unama` AS `ptmodifikasiusernama` from ((`m_12_pos_type_history` `pt` left join `m0_user` `u1` on((`pt`.`ptinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`pt`.`ptmodifikasiuser` = `u2`.`userid`)))
```

```sql
select pt.ptidhistory, `pt`.`ptkode` AS `ptkode`,`pt`.`ptnama` AS `ptnama`,`pt`.`ptcatatan` AS `ptcatatan`,`pt`.`ptaktif` AS `ptaktif`,`pt`.`ptinputuser` AS `ptinputuser`,`pt`.`ptinputtgl` AS `ptinputtgl`,`pt`.`ptmodifikasiuser` AS `ptmodifikasiuser`,`pt`.`ptmodifikasitgl` AS `ptmodifikasitgl`,`pt`.`ptcustomtext1` AS `ptcustomtext1`,`pt`.`ptcustomtext2` AS `ptcustomtext2`,`pt`.`ptcustomtext3` AS `ptcustomtext3`,`pt`.`ptcustomtext4` AS `ptcustomtext4`,`pt`.`ptcustomtext5` AS `ptcustomtext5`,`pt`.`ptcustomint1` AS `ptcustomint1`,`pt`.`ptcustomint2` AS `ptcustomint2`,`pt`.`ptcustomint3` AS `ptcustomint3`,`pt`.`ptcustomdbl1` AS `ptcustomdbl1`,`pt`.`ptcustomdbl2` AS `ptcustomdbl2`,`pt`.`ptcustomdbl3` AS `ptcustomdbl3`,`pt`.`ptcustomdate1` AS `ptcustomdate1`,`pt`.`ptcustomdate2` AS `ptcustomdate2`,`pt`.`ptcustomdate3` AS `ptcustomdate3`,`u1`.`unama` AS `ptinputusernama`,`u2`.`unama` AS `ptmodifikasiusernama` from `m_12_pos_type_history` `pt` left join `m0_user` `u1` on `pt`.`ptinputuser` = `u1`.`userid` left join `m0_user` `u2` on `pt`.`ptmodifikasiuser` = `u2`.`userid`
```

```sql
SELECT ptcp.idhistory, ptcp.tipepos as tipepos, cp.cpkode as kelasproduk, cp.cpnama as kelasproduknama FROM m1_class_product cp LEFT JOIN m_12_pos_type_class_product_history ptcp ON cp.cpkode = ptcp.kelasproduk AND ptcp.idhistory = 'valkode'
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_pos_voucher.vb`

```sql
SELECT GROUP_CONCAT(si.sinotransaksi SEPARATOR ', ') as sinotransaksi FROM m_12_pos_voucher_out vo JOIN m5_si si ON vo.voidtransaksi = si.siid WHERE vo.voidvi = '{FixQuotes_dr1}viid' GROUP BY vo.voidvi ORDER BY si.sitgl, si.sinotransaksi
```

```sql
Insert into M_12_Pos_Voucher_In(viid, vikategori, vicabang, vilokasi, vikode, vimatauang, vijml, vijmlvalas, vijmlbayar, vijmlbayarvalas, vitgllunas, viisclose, vicustomtext1, vicustomtext2, vicustomtext3, vicustomdbl1, vicustomdbl2, vicustomdbl3, vicustomdate1, vicustomdate2, vicustomdate3, vitglbuat, vitglexpired) values{strValue2_ToString} ON DUPLICATE KEY UPDATE vikategori = VALUES(vikategori), vicabang = VALUES(vicabang), vilokasi = VALUES(vilokasi), vikode = VALUES(vikode), vimatauang = VALUES(vimatauang), vijml = VALUES(vijml), vijmlvalas = VALUES(vijmlvalas), vijmlbayar = VALUES(vijmlbayar), vijmlbayarvalas = VALUES(vijmlbayarvalas), vitgllunas = VALUES(vitgllunas), viisclose = VALUES(viisclose), vicustomtext1 = VALUES(vicustomtext1), vicustomtext2 = VALUES(vicustomtext2), vicustomtext3 = VALUES(vicustomtext3), vicustomdbl1 = VALUES(vicustomdbl1), vicustomdbl2 = VALUES(vicustomdbl2), vicustomdbl3 = VALUES(vicustomdbl3), vicustomdate1 = VALUES(vicustomdate1), vicustomdate2 = VALUES(vicustomdate2), vicustomdate3 = VALUES(vicustomdate3), vitglbuat = VALUES(vitglbuat), vitglexpired = VALUES(vitglexpired)
```

```sql
SELECT GROUP_CONCAT(si.sinotransaksi SEPARATOR ', ') as sinotransaksi FROM m_12_pos_voucher_out vo JOIN m5_si si ON vo.voidtransaksi = si.siid WHERE vo.voidvi = '{FixQuotes_idtransaksi}' GROUP BY vo.voidvi ORDER BY si.sitgl, si.sinotransaksi
```

```sql
DELETE FROM M_12_Pos_Voucher_In WHERE viid = '{idtransaksi}'
```

```sql
DELETE FROM M_12_Pos_Voucher_In
```

```sql
select vi.viid AS viid, vi.vikategori AS vikategori, vi.vicabang AS vicabang, vi.vilokasi AS vilokasi, vi.vikode AS vikode, vi.vimatauang AS vimatauang, vi.vijml AS vijml, vi.vijmlvalas AS vijmlvalas, vi.vijmlbayar AS vijmlbayar, vi.vijmlbayarvalas AS vijmlbayarvalas, vi.vijml - vi.vijmlbayar as vijmlsisa, vi.vijmlvalas - vi.vijmlbayarvalas as vijmlsisavalas, vi.vitgllunas AS vitgllunas, vi.viisclose AS viisclose, vi.vicustomtext1 AS vicustomtext1, vi.vicustomtext2 AS vicustomtext2, vi.vicustomtext3 AS vicustomtext3, vi.vicustomdbl1 AS vicustomdbl1, vi.vicustomdbl2 AS vicustomdbl2, vi.vicustomdbl3 AS vicustomdbl3, vi.vicustomdate1 AS vicustomdate1, vi.vicustomdate2 AS vicustomdate2, vi.vicustomdate3 AS vicustomdate3, pc.pcnama AS pcnama, br.bnama AS bnama, lc.lnama AS lnama, (case vi.viisclose when 1 then 'Close' else 'Available' end) AS viisclosenama, vi.vitglbuat AS vitglbuat, vi.vitglexpired AS vitglexpired from m_12_pos_voucher_in vi join m_12_pos_category pc on vi.vikategori = pc.pckode join m1_branch br on vi.vicabang = br.bkode join m0_userlogin ul on ul.ulid = '{FixQuotes_paramSplit_0}' join m0_user_location uloc on ul.uluser = uloc.userid join m1_location lc on uloc.lokasi = lc.lkode and vi.vikategori = lc.lkategoripos
```

```sql
select vi.viid AS viid, vi.vikategori AS vikategori, vi.vicabang AS vicabang, vi.vilokasi AS vilokasi, vi.vikode AS vikode, vi.vimatauang AS vimatauang, vi.vijml AS vijml, vi.vijmlvalas AS vijmlvalas, vi.vijmlbayar AS vijmlbayar, vi.vijmlbayarvalas AS vijmlbayarvalas, vi.vijml - vi.vijmlbayar as vijmlsisa, vi.vijmlvalas - vi.vijmlbayarvalas as vijmlsisavalas, vi.vitgllunas AS vitgllunas, vi.viisclose AS viisclose, vi.vicustomtext1 AS vicustomtext1, vi.vicustomtext2 AS vicustomtext2, vi.vicustomtext3 AS vicustomtext3, vi.vicustomdbl1 AS vicustomdbl1, vi.vicustomdbl2 AS vicustomdbl2, vi.vicustomdbl3 AS vicustomdbl3, vi.vicustomdate1 AS vicustomdate1, vi.vicustomdate2 AS vicustomdate2, vi.vicustomdate3 AS vicustomdate3, pc.pcnama AS pcnama, br.bnama AS bnama, lc.lnama AS lnama, (case vi.viisclose when 1 then 'Close' else 'Available' end) AS viisclosenama, vi.vitglbuat AS vitglbuat, vi.vitglexpired AS vitglexpired from m_12_pos_voucher_in vi join m_12_pos_category pc on vi.vikategori = pc.pckode join m1_branch br on vi.vicabang = br.bkode join m0_userlogin ul on ul.ulid = '{FixQuotes_paramSplit_0}' left join m0_user_location uloc on ul.uluser = uloc.userid left join m1_location lc on uloc.lokasi = lc.lkode and vi.vikategori = lc.lkategoripos
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_ppa.vb`

```sql
SELECT COUNT(ppaid), ppanotransaksi FROM M_12_ppa WHERE ppaid='{result_4}' AND ppastatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(ppaid) FROM m_12_ppa WHERE ppanotransaksi='{notransaksi}'
```

```sql
Update M_12_PPa set ppacabang = '{FixQuotes_drutama}ppacabang', ppalokasi = '{FixQuotes_drutama}ppalokasi', ppagudang = '{FixQuotes_drutama}ppagudang', ppasumber = '{FixQuotes_drutama}ppasumber', ppaautonotransaksi = {drutama}ppaautonotransaksi, ppanotransaksi = '{notransaksi}', ppatgl = '{FixQuotes_AsFormatTanggal_drutama}ppatgl', ppatglberlakusampai = '{FixQuotes_AsFormatTanggal_drutama}ppatglberlakusampai', ppakodepa = {drutama}ppakodepa, ppabagianppa = {drutama}ppabagianppa, ppabagianppakontak = '{FixQuotes_drutama}ppabagianppakontak', ppamatauang = '{FixQuotes_drutama}ppamatauang', ppakurs = '{FixDouble_drutama}ppakurs', ppauraian = '{FixQuotes_drutama}ppauraian', ppacatatan = '{FixQuotes_drutama}ppacatatan', ppanoref = '{FixQuotes_drutama}ppanoref', ppatglnoref = '{FixQuotes_AsFormatTanggal_drutama}ppatglnoref', ppastatus = {drutama}ppastatus, ppastatussebelumnya = {drutama}ppastatussebelumnya, ppajmlrevisi = ppajmlrevisi+1, ppacetakanke = {drutama}ppacetakanke, ppamodifikasiuser = {drutama}ppamodifikasiuser, ppamodifikasitgl = NOW(), ppaposting = 0, ppatutupperiode = {drutama}ppatutupperiode, ppacustomtext1 = '{FixQuotes_drutama}ppacustomtext1', ppacustomtext2 = '{FixQuotes_drutama}ppacustomtext2', ppacustomtext3 = '{FixQuotes_drutama}ppacustomtext3', ppacustomtext4 = '{FixQuotes_drutama}ppacustomtext4', ppacustomtext5 = '{FixQuotes_drutama}ppacustomtext5', ppacustomint1 = {drutama}ppacustomint1, ppacustomint2 = {drutama}ppacustomint2, ppacustomint3 = {drutama}ppacustomint3, ppacustomdbl1 = '{FixDouble_drutama}ppacustomdbl1', ppacustomdbl2 = '{FixDouble_drutama}ppacustomdbl2', ppacustomdbl3 = '{FixDouble_drutama}ppacustomdbl3', ppacustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}ppacustomdate1', ppacustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}ppacustomdate2', ppacustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}ppacustomdate3', ppakategori = '{FixQuotes_drutama}ppakategori', ppakategoripos = '{FixQuotes_drutama}ppakategoripos', ppajenis = '{FixQuotes_drutama}ppajenis' where ppaid = '{drutama}ppaid'
```

```sql
Insert into M_12_Ppa (ppacabang, ppalokasi, ppagudang, ppasumber, ppaautonotransaksi, ppanotransaksi, ppatgl, ppatglberlakusampai, ppakodepa, ppabagianppa, ppabagianppakontak, ppamatauang, ppakurs, ppauraian, ppacatatan, ppanoref, ppatglnoref, ppastatus, ppastatussebelumnya, ppajmlrevisi, ppacetakanke, ppainputuser, ppainputtgl, ppamodifikasiuser, ppamodifikasitgl, ppaposting, ppatutupperiode, ppaisclose, ppacustomtext1, ppacustomtext2, ppacustomtext3, ppacustomtext4, ppacustomtext5, ppacustomint1, ppacustomint2, ppacustomint3, ppacustomdbl1, ppacustomdbl2, ppacustomdbl3, ppacustomdate1, ppacustomdate2, ppacustomdate3, ppakategori, ppakategoripos, ppajenis) values('{FixQuotes_drutama}ppacabang', '{FixQuotes_drutama}ppalokasi', '{FixQuotes_drutama}ppagudang', '{FixQuotes_drutama}ppasumber', {drutama}ppaautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}ppatgl', '{FixQuotes_AsFormatTanggal_drutama}ppatglberlakusampai', {drutama}ppakodepa, {drutama}ppabagianppa, '{FixQuotes_drutama}ppabagianppakontak', '{FixQuotes_drutama}ppamatauang', '{FixDouble_drutama}ppakurs', '{FixQuotes_drutama}ppauraian', '{FixQuotes_drutama}ppacatatan', '{FixQuotes_drutama}ppanoref', '{FixQuotes_AsFormatTanggal_drutama}ppatglnoref', {drutama}ppastatus, {drutama}ppastatussebelumnya, {drutama}ppajmlrevisi, {drutama}ppacetakanke, {drutama}ppainputuser, NOW(), {drutama}ppamodifikasiuser, '1971-01-01 00:00:00', 0, {drutama}ppatutupperiode, {drutama}ppaisclose, '{FixQuotes_drutama}ppacustomtext1', '{FixQuotes_drutama}ppacustomtext2', '{FixQuotes_drutama}ppacustomtext3', '{FixQuotes_drutama}ppacustomtext4', '{FixQuotes_drutama}ppacustomtext5', {drutama}ppacustomint1, {drutama}ppacustomint2, {drutama}ppacustomint3, '{FixDouble_drutama}ppacustomdbl1', '{FixDouble_drutama}ppacustomdbl2', '{FixDouble_drutama}ppacustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}ppacustomdate1', '{FixQuotes_AsFormatTanggal_drutama}ppacustomdate2', '{FixQuotes_AsFormatTanggal_drutama}ppacustomdate3', '{FixQuotes_drutama}ppakategori', '{FixQuotes_drutama}ppakategoripos', '{FixQuotes_drutama}ppajenis')
```

```sql
select ppaid from M_12_ppa where ppanotransaksi='{notransaksi}' AND ppainputuser= '{userid}' order by ppamodifikasitgl desc limit 1
```

```sql
Delete from M_12_Ppa_Detail where idppa = '{result_4}'
```

```sql
Insert into M_12_Ppa_Detail(idppadetail, idppa, idbarang, satuan, nilaisatuan, satuanbarang, matauang, kurs, hargajual1lama, hargajual2lama, hargajual3lama, hargajual4lama, hargajual5lama, hargajual1, hargajual2, hargajual3, hargajual4, hargajual5, diskonjual1lama, diskonjual2lama, diskonjual3lama, diskonjual4lama, diskonjual5lama, diskonjual1, diskonjual2, diskonjual3, diskonjual4, diskonjual5, cabang, lokasi, gudang, costcenter, divisi, subdivisi, proyek, catatan, urutan, statusberlaku, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3,stokminimallama,stokminimal,stokmaksimallama,stokmaksimal,stokreorderlama,stokreorder,stokminorderlama,stokminorder, hargabeli, margin1, margin2, margin3, margin4, margin5) values{strValue2_ToString}
```

```sql
UPDATE m_12_ppa ppa JOIN m_12_ppa_detail ppad ON ppa.ppaid = ppad.idppa JOIN m_12_pos_item pi ON ppad.idbarang = pi.piidbarang SET ppad.hargajual1lama = pi.pihargajual1, ppad.hargajual2lama = pi.pihargajual2, ppad.hargajual3lama = pi.pihargajual3, ppad.hargajual4lama = pi.pihargajual4, ppad.hargajual5lama = pi.pihargajual5, ppad.diskonjual1lama = pi.pidiskonjual1, ppad.diskonjual2lama = pi.pidiskonjual2, ppad.diskonjual3lama = pi.pidiskonjual3, ppad.diskonjual4lama = pi.pidiskonjual4, ppad.diskonjual5lama = pi.pidiskonjual5, ppad.stokminimallama = pi.pistokminimal, ppad.stokmaksimallama = pi.pistokmaksimal, ppad.stokreorderlama = pi.pistokreorder, ppad.stokminorderlama = pi.pistokminorder WHERE ppad.idppa = '{FixDouble_result_4}' AND pi.pikategori ='{drutama}ppakategoripos'
```

```sql
UPDATE m_12_ppa ppa JOIN m_12_ppa_detail ppad ON ppa.ppaid = ppad.idppa JOIN m_12_pos_item pi ON ppad.idbarang = pi.piidbarang AND ppad.idppa = '{FixDouble_result_4}' AND pi.pikategori ='{drutama}ppakategoripos' SET ppad.hargajual1lama = pi.pihargajual1, ppad.hargajual2lama = pi.pihargajual2, ppad.hargajual3lama = pi.pihargajual3, ppad.hargajual4lama = pi.pihargajual4, ppad.hargajual5lama = pi.pihargajual5, ppad.diskonjual1lama = pi.pidiskonjual1, ppad.diskonjual2lama = pi.pidiskonjual2, ppad.diskonjual3lama = pi.pidiskonjual3, ppad.diskonjual4lama = pi.pidiskonjual4, ppad.diskonjual5lama = pi.pidiskonjual5, ppad.stokminimallama = pi.pistokminimal, ppad.stokmaksimallama = pi.pistokmaksimal, ppad.stokreorderlama = pi.pistokreorder, ppad.stokminorderlama = pi.pistokminorder
```

```sql
UPDATE m_12_ppa ppa JOIN m_12_ppa_detail ppad ON ppa.ppaid = ppad.idppa JOIN m_12_pos_item pi ON ppad.idbarang = pi.piidbarang SET pi.pihargajual1 = ppad.hargajual1, pi.pihargajual2 = ppad.hargajual2, pi.pihargajual3 = ppad.hargajual3, pi.pihargajual4 = ppad.hargajual4, pi.pihargajual5 = ppad.hargajual5, pi.pidiskonjual1 = ppad.diskonjual1, pi.pidiskonjual2 = ppad.diskonjual2, pi.pidiskonjual3 = ppad.diskonjual3, pi.pidiskonjual4 = ppad.diskonjual4, pi.pidiskonjual5 = ppad.diskonjual5, pi.pistokminimal = ppad.stokminimal, pi.pistokmaksimal = ppad.stokmaksimal, pi.pistokreorder = ppad.stokreorder, pi.pistokminorder = ppad.stokminorder WHERE ppad.idppa = '{FixDouble_result_4}' AND pi.pikategori ='{drutama}ppakategoripos'
```

```sql
UPDATE m_12_ppa ppa JOIN m_12_ppa_detail ppad ON ppa.ppaid = ppad.idppa JOIN m_12_pos_item pi ON ppad.idbarang = pi.piidbarang AND ppad.idppa = '{FixDouble_result_4}' AND pi.pikategori ='{drutama}ppakategoripos' SET pi.pihargajual1 = ppad.hargajual1, pi.pihargajual2 = ppad.hargajual2, pi.pihargajual3 = ppad.hargajual3, pi.pihargajual4 = ppad.hargajual4, pi.pihargajual5 = ppad.hargajual5, pi.pidiskonjual1 = ppad.diskonjual1, pi.pidiskonjual2 = ppad.diskonjual2, pi.pidiskonjual3 = ppad.diskonjual3, pi.pidiskonjual4 = ppad.diskonjual4, pi.pidiskonjual5 = ppad.diskonjual5, pi.pistokminimal = ppad.stokminimal, pi.pistokmaksimal = ppad.stokmaksimal, pi.pistokreorder = ppad.stokreorder, pi.pistokminorder = ppad.stokminorder
```

```sql
UPDATE m_12_ppa_detail ppad JOIN m_12_pos_item pi ON ppad.idbarang = pi.piidbarang AND ppad.idppa = '{FixDouble_result_4}' SET ppad.hargajual1lama = pi.pihargajual1, ppad.hargajual2lama = pi.pihargajual2, ppad.hargajual3lama = pi.pihargajual3, ppad.hargajual4lama = pi.pihargajual4, ppad.hargajual5lama = pi.pihargajual5, ppad.diskonjual1lama = pi.pidiskonjual1, ppad.diskonjual2lama = pi.pidiskonjual2, ppad.diskonjual3lama = pi.pidiskonjual3, ppad.diskonjual4lama = pi.pidiskonjual4, ppad.diskonjual5lama = pi.pidiskonjual5, ppad.stokminimallama = pi.pistokminimal, ppad.stokmaksimallama = pi.pistokmaksimal, ppad.stokreorderlama = pi.pistokreorder, ppad.stokminorderlama = pi.pistokminorder
```

```sql
UPDATE m_12_ppa ppa JOIN m_12_ppa_detail ppad ON ppa.ppaid = ppad.idppa JOIN m_12_pos_item pi ON ppad.idbarang = pi.piidbarang AND ppad.idppa = '{FixDouble_result_4}' SET pi.pihargajual1 = ppad.hargajual1, pi.pihargajual2 = ppad.hargajual2, pi.pihargajual3 = ppad.hargajual3, pi.pihargajual4 = ppad.hargajual4, pi.pihargajual5 = ppad.hargajual5, pi.pidiskonjual1 = ppad.diskonjual1, pi.pidiskonjual2 = ppad.diskonjual2, pi.pidiskonjual3 = ppad.diskonjual3, pi.pidiskonjual4 = ppad.diskonjual4, pi.pidiskonjual5 = ppad.diskonjual5, pi.pistokminimal = ppad.stokminimal, pi.pistokmaksimal = ppad.stokmaksimal, pi.pistokreorder = ppad.stokreorder, pi.pistokminorder = ppad.stokminorder
```

```sql
SELECT moduleid, menuid, 0, 0, '' FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Ppatgl, Ppanotransaksi, Ppastatus, Ppakategori, Ppakategoripos FROM m_12_Ppa WHERE Ppaid='{idtransaksi}'
```

```sql
UPDATE m_12_ppa_detail ppad JOIN m_12_pos_item pi ON ppad.idbarang = pi.piidbarang SET pi.pihargajual1 = ppad.hargajual1lama, pi.pihargajual2 = ppad.hargajual2lama, pi.pihargajual3 = ppad.hargajual3lama, pi.pihargajual4 = ppad.hargajual4lama, pi.pihargajual5 = ppad.hargajual5lama, pi.pidiskonjual1 = ppad.diskonjual1lama, pi.pidiskonjual2 = ppad.diskonjual2lama, pi.pidiskonjual3 = ppad.diskonjual3lama, pi.pidiskonjual4 = ppad.diskonjual4lama, pi.pidiskonjual5 = ppad.diskonjual5lama, pi.pistokminimal = ppad.stokminimallama, pi.pistokmaksimal = ppad.stokmaksimallama, pi.pistokreorder = ppad.stokreorderlama, pi.pistokminorder = ppad.stokminorderlama WHERE ppad.idppa = '{FixDouble_result_4}'
```

```sql
UPDATE M_12_Ppa SET Ppastatus = {nilaiStatus}, Ppamodifikasiuser='{userid}', Ppamodifikasitgl = NOW(), Ppaposting = 0, Ppapostingtgl = '1971-01-01 00:00:00', Ppajmlrevisi = Ppajmlrevisi + 1 WHERE Ppaid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Paid, Ppanotransaksi FROM m_12_Ppa WHERE Ppaid='{idtransaksi}'
```

```sql
DELETE FROM M_12_Ppa_Detail WHERE idppa = '{idtransaksi}'
```

```sql
DELETE FROM M_12_Ppa WHERE ppaid = '{idtransaksi}'
```

```sql
select ppa.ppaid AS ppaid, ppa.ppacabang AS ppacabang, ppa.ppalokasi AS ppalokasi, ppa.ppagudang AS ppagudang, ppa.ppasumber AS ppasumber, ppa.ppaautonotransaksi AS ppaautonotransaksi, ppa.ppanotransaksi AS ppanotransaksi, ppa.ppatgl AS ppatgl, ppa.ppatglberlakusampai AS ppatglberlakusampai, ppa.ppakodepa AS ppakodepa, ppa.ppabagianppa AS ppabagianppa, ppa.ppabagianppakontak AS ppabagianppakontak, ppa.ppamatauang AS ppamatauang, ppa.ppakurs AS ppakurs, ppa.ppauraian AS ppauraian, ppa.ppacatatan AS ppacatatan, ppa.ppanoref AS ppanoref, ppa.ppatglnoref AS ppatglnoref, ppa.ppastatus AS ppastatus, ppa.ppastatussebelumnya AS ppastatussebelumnya, ppa.ppajmlrevisi AS ppajmlrevisi, ppa.ppacetakanke AS ppacetakanke, ppa.ppainputuser AS ppainputuser, ppa.ppainputtgl AS ppainputtgl, ppa.ppamodifikasiuser AS ppamodifikasiuser, ppa.ppamodifikasitgl AS ppamodifikasitgl, ppa.ppaposting AS ppaposting, ppa.ppapostingtgl AS ppapostingtgl, ppa.ppatutupperiode AS ppatutupperiode, ppa.ppaisclose AS ppaisclose, ppa.ppacustomtext1 AS ppacustomtext1, ppa.ppacustomtext2 AS ppacustomtext2, ppa.ppacustomtext3 AS ppacustomtext3, ppa.ppacustomtext4 AS ppacustomtext4, ppa.ppacustomtext5 AS ppacustomtext5, ppa.ppacustomint1 AS ppacustomint1, ppa.ppacustomint2 AS ppacustomint2, ppa.ppacustomint3 AS ppacustomint3, ppa.ppacustomdbl1 AS ppacustomdbl1, ppa.ppacustomdbl2 AS ppacustomdbl2, ppa.ppacustomdbl3 AS ppacustomdbl3, ppa.ppacustomdate1 AS ppacustomdate1, ppa.ppacustomdate2 AS ppacustomdate2, ppa.ppacustomdate3 AS ppacustomdate3, br.bnama AS ppacabangnama, lc.lnama AS ppalokasinama, wh.wnama AS ppagudangnama, c1.kkode AS ppabagianppakode, c1.knama AS ppabagianppanama, st1.nama AS ppastatusnama, st2.nama AS ppastatussebelumnyanama, u1.unama AS ppainputusernama, u2.unama AS ppamodifikasiusernama, ppa.ppakategori, (CASE ppa.ppakategori WHEN 0 THEN 'Global' ELSE 'Category' END) as ppakategorinama, ppa.ppakategoripos, pc.pcnama as ppakategoriposnama, ppa.ppajenis, ppad.idppadetail AS idppadetail, ppad.idppa AS idppa, ppad.idbarang AS idbarang, ppad.satuan AS satuan, ppad.nilaisatuan AS nilaisatuan, ppad.satuanbarang AS satuanbarang, ppad.matauang AS matauang, ppad.kurs AS kurs, ppad.hargajual1lama AS hargajual1lama, ppad.hargajual2lama AS hargajual2lama, ppad.hargajual3lama AS hargajual3lama, ppad.hargajual4lama AS hargajual4lama, ppad.hargajual5lama AS hargajual5lama, ppad.hargajual1 AS hargajual1, ppad.hargajual2 AS hargajual2, ppad.hargajual3 AS hargajual3, ppad.hargajual4 AS hargajual4, ppad.hargajual5 AS hargajual5, ppad.diskonjual1lama AS diskonjual1lama, ppad.diskonjual2lama AS diskonjual2lama, ppad.diskonjual3lama AS diskonjual3lama, ppad.diskonjual4lama AS diskonjual4lama, ppad.diskonjual5lama AS diskonjual5lama, ppad.diskonjual1 AS diskonjual1, ppad.diskonjual2 AS diskonjual2, ppad.diskonjual3 AS diskonjual3, ppad.diskonjual4 AS diskonjual4, ppad.diskonjual5 AS diskonjual5, ppad.cabang AS cabang, ppad.lokasi AS lokasi, ppad.gudang AS gudang, ppad.costcenter AS costcenter, ppad.divisi AS divisi, ppad.subdivisi AS subdivisi, ppad.proyek AS proyek, ppad.catatan AS catatan, ppad.urutan AS urutan, ppad.statusberlaku AS statusberlaku, ppad.isclose AS isclose, ppad.customtext1 AS customtext1, ppad.customtext2 AS customtext2, ppad.customtext3 AS customtext3, ppad.customdbl1 AS customdbl1, ppad.customdbl2 AS customdbl2, ppad.customdbl3 AS customdbl3, ppad.customdate1 AS customdate1, ppad.customdate2 AS customdate2, ppad.customdate3 AS customdate3, i.bkode AS kodebarang, i.bnama AS namabarang, i.btipe AS tipebarang, brd.bnama AS cabangnama, lcd.lnama AS lokasinama, whd.wnama AS gudangnama, cc.ccnama AS costcenternama, d.dnama AS divisinama, sd.sdnama AS subdivisinama, p.pnama AS proyeknama, ppad.stokminimallama AS stokminimallama, ppad.stokmaksimallama AS stokmaksimallama, ppad.stokreorderlama AS stokreorderlama, ppad.stokminorderlama AS stokminorderlama, ppad.stokminimal AS stokminimal, ppad.stokmaksimal AS stokmaksimal, ppad.stokreorder AS stokreorder, ppad.stokminorder AS stokminorder, ppad.hargabeli AS hargabeli, ppad.margin1 AS margin1, ppad.margin2 AS margin2, ppad.margin3 AS margin3, ppad.margin4 AS margin4, ppad.margin5 AS margin5 from m_12_ppa ppa join m_12_ppa_detail ppad on ppa.ppaid = ppad.idppa join m0_status st1 on st1.kode = ppa.ppastatus join m0_status st2 on st2.kode = ppa.ppastatussebelumnya left join m1_branch br on br.bkode = ppa.ppacabang left join m1_location lc on lc.lkode = ppa.ppalokasi left join m1_warehouse wh on wh.wkode = ppa.ppagudang left join m1_contact c1 on c1.kid = ppa.ppabagianppa left join m0_user u1 on u1.userid = ppa.ppainputuser left join m0_user u2 on u2.userid = ppa.ppamodifikasiuser left join m_12_pos_category pc on ppa.ppakategoripos = pc.pckode left join m1_item i on ppad.idbarang = i.bid left join m1_branch brd on ppad.cabang = brd.bkode left join m1_location lcd on ppad.lokasi = lcd.lkode left join m1_warehouse whd on ppad.gudang = whd.wkode left join m1_cost_center cc on ppad.costcenter = cc.cckode left join m1_division d on ppad.divisi = d.dkode left join m1_subdivision sd on ppad.subdivisi = sd.sdkode left join m1_project p on ppad.proyek = p.pkode
```

```sql
select ppa.ppaid AS ppaid, ppa.ppacabang AS ppacabang, ppa.ppalokasi AS ppalokasi, ppa.ppagudang AS ppagudang, ppa.ppasumber AS ppasumber, ppa.ppaautonotransaksi AS ppaautonotransaksi, ppa.ppanotransaksi AS ppanotransaksi, ppa.ppatgl AS ppatgl, ppa.ppatglberlakusampai AS ppatglberlakusampai, ppa.ppakodepa AS ppakodepa, ppa.ppabagianppa AS ppabagianppa, ppa.ppabagianppakontak AS ppabagianppakontak, ppa.ppamatauang AS ppamatauang, ppa.ppakurs AS ppakurs, ppa.ppauraian AS ppauraian, ppa.ppacatatan AS ppacatatan, ppa.ppanoref AS ppanoref, ppa.ppatglnoref AS ppatglnoref, ppa.ppastatus AS ppastatus, ppa.ppastatussebelumnya AS ppastatussebelumnya, ppa.ppajmlrevisi AS ppajmlrevisi, ppa.ppacetakanke AS ppacetakanke, ppa.ppainputuser AS ppainputuser, ppa.ppainputtgl AS ppainputtgl, ppa.ppamodifikasiuser AS ppamodifikasiuser, ppa.ppamodifikasitgl AS ppamodifikasitgl, ppa.ppaposting AS ppaposting, ppa.ppapostingtgl AS ppapostingtgl, ppa.ppatutupperiode AS ppatutupperiode, ppa.ppaisclose AS ppaisclose, br.bnama AS ppacabangnama, lc.lnama AS ppalokasinama, wh.wnama AS ppagudangnama, c1.kkode AS ppabagianppakode, c1.knama AS ppabagianppanama, st1.nama AS ppastatusnama, st2.nama AS ppastatussebelumnyanama, u1.unama AS ppainputusernama, u2.unama AS ppamodifikasiusernama, ppa.ppakategori, (CASE ppa.ppakategori WHEN 0 THEN 'All Category' ELSE 'Per Category' END) as ppakategorinama, ppa.ppakategoripos, pc.pcnama as ppakategoriposnama from m_12_ppa ppa join m0_status st1 on st1.kode = ppa.ppastatus join m0_status st2 on st2.kode = ppa.ppastatussebelumnya left join m1_branch br on br.bkode = ppa.ppacabang left join m1_location lc on lc.lkode = ppa.ppalokasi left join m1_warehouse wh on wh.wkode = ppa.ppagudang left join m1_contact c1 on c1.kid = ppa.ppabagianppa left join m0_user u1 on u1.userid = ppa.ppainputuser left join m0_user u2 on u2.userid = ppa.ppamodifikasiuser left join m_12_pos_category pc on ppa.ppakategoripos = pc.pckode
```

```sql
select ppad.idppadetail AS idppadetail, ppad.idppa AS idppa, ppad.idbarang AS idbarang, ppad.satuan AS satuan, ppad.nilaisatuan AS nilaisatuan, ppad.satuanbarang AS satuanbarang, ppad.matauang AS matauang, ppad.kurs AS kurs, ppad.hargajual1lama AS hargajual1lama, ppad.hargajual2lama AS hargajual2lama, ppad.hargajual3lama AS hargajual3lama, ppad.hargajual4lama AS hargajual4lama, ppad.hargajual5lama AS hargajual5lama, ppad.hargajual1 AS hargajual1, ppad.hargajual2 AS hargajual2, ppad.hargajual3 AS hargajual3, ppad.hargajual4 AS hargajual4, ppad.hargajual5 AS hargajual5, ppad.diskonjual1lama AS diskonjual1lama, ppad.diskonjual2lama AS diskonjual2lama, ppad.diskonjual3lama AS diskonjual3lama, ppad.diskonjual4lama AS diskonjual4lama, ppad.diskonjual5lama AS diskonjual5lama, ppad.diskonjual1 AS diskonjual1, ppad.diskonjual2 AS diskonjual2, ppad.diskonjual3 AS diskonjual3, ppad.diskonjual4 AS diskonjual4, ppad.diskonjual5 AS diskonjual5, ppad.cabang AS cabang, ppad.lokasi AS lokasi, ppad.gudang AS gudang, ppad.costcenter AS costcenter, ppad.divisi AS divisi, ppad.subdivisi AS subdivisi, ppad.proyek AS proyek, ppad.catatan AS catatan, ppad.urutan AS urutan, ppad.statusberlaku AS statusberlaku, ppad.isclose AS isclose, ppad.customtext1 AS customtext1, ppad.customtext2 AS customtext2, ppad.customtext3 AS customtext3, ppad.customdbl1 AS customdbl1, ppad.customdbl2 AS customdbl2, ppad.customdbl3 AS customdbl3, ppad.customdate1 AS customdate1, ppad.customdate2 AS customdate2, ppad.customdate3 AS customdate3, i.bkode AS kodebarang, i.bnama AS namabarang, i.btipe AS tipebarang, brd.bnama AS cabangnama, lcd.lnama AS lokasinama, whd.wnama AS gudangnama, cc.ccnama AS costcenternama, d.dnama AS divisinama, sd.sdnama AS subdivisinama, p.pnama AS proyeknama, ppad.stokminimallama AS stokminimallama, ppad.stokmaksimallama AS stokmaksimallama, ppad.stokreorderlama AS stokreorderlama, ppad.stokminorderlama AS stokminorderlama, ppad.stokminimal AS stokminimal, ppad.stokmaksimal AS stokmaksimal, ppad.stokreorder AS stokreorder, ppad.stokminorder AS stokminorder, ppad.hargabeli AS hargabeli, ppad.margin1 AS margin1, ppad.margin2 AS margin2, ppad.margin3 AS margin3, ppad.margin4 AS margin4, ppad.margin5 AS margin5, ppa.ppaid AS ppaid, ppa.ppamatauang AS ppamatauang, ppa.ppakurs AS ppakurs, ppa.ppauraian AS ppauraian, ppa.ppacatatan AS ppacatatan, ppa.ppakategori, (CASE ppa.ppakategori WHEN 0 THEN 'Global' ELSE 'Category' END) as ppakategorinama, ppa.ppakategoripos, pc.pcnama as ppakategoriposnama, ppa.ppanotransaksi from m_12_ppa ppa join m_12_ppa_detail ppad on ppa.ppaid = ppad.idppa join m0_status st1 on st1.kode = ppa.ppastatus join m0_status st2 on st2.kode = ppa.ppastatussebelumnya left join m1_branch br on br.bkode = ppa.ppacabang left join m1_location lc on lc.lkode = ppa.ppalokasi left join m1_warehouse wh on wh.wkode = ppa.ppagudang left join m1_contact c1 on c1.kid = ppa.ppabagianppa left join m0_user u1 on u1.userid = ppa.ppainputuser left join m0_user u2 on u2.userid = ppa.ppamodifikasiuser left join m_12_pos_category pc on ppa.ppakategoripos = pc.pckode left join m1_item i on ppad.idbarang = i.bid left join m1_branch brd on ppad.cabang = brd.bkode left join m1_location lcd on ppad.lokasi = lcd.lkode left join m1_warehouse whd on ppad.gudang = whd.wkode left join m1_cost_center cc on ppad.costcenter = cc.cckode left join m1_division d on ppad.divisi = d.dkode left join m1_subdivision sd on ppad.subdivisi = sd.sdkode left join m1_project p on ppad.proyek = p.pkode
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_ppv.vb`

```sql
SELECT COUNT(ppvid), ppvnotransaksi FROM M_12_Ppv WHERE ppvid='{result_4}' AND ppvstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(ppvid) FROM M_12_Ppv WHERE ppvnotransaksi='{notransaksi}'
```

```sql
Update M_12_Ppv set ppvcabang = '{FixQuotes_drutama}ppvcabang', ppvlokasi = '{FixQuotes_drutama}ppvlokasi', ppvgudang = '{FixQuotes_drutama}ppvgudang', ppvsumber = '{FixQuotes_drutama}ppvsumber', ppvautonotransaksi = {drutama}ppvautonotransaksi, ppvnotransaksi = '{FixQuotes_notransaksi}', ppvtgl = '{FixQuotes_AsFormatTanggal_drutama}ppvtgl', ppvkodepa = {drutama}ppvkodepa, ppvcustomer = {drutama}ppvcustomer, ppvcustomerkontak = '{FixQuotes_drutama}ppvcustomerkontak', ppv1alamat1 = '{FixQuotes_drutama}ppv1alamat1', ppv1alamat2 = '{FixQuotes_drutama}ppv1alamat2', ppv1alamat3 = '{FixQuotes_drutama}ppv1alamat3', ppv2alamat1 = '{FixQuotes_drutama}ppv2alamat1', ppv2alamat2 = '{FixQuotes_drutama}ppv2alamat2', ppv2alamat3 = '{FixQuotes_drutama}ppv2alamat3', ppvbagianpenjualan = {drutama}ppvbagianpenjualan, ppvbagianterima = {drutama}ppvbagianterima, ppvuraian = '{FixQuotes_drutama}ppvuraian', ppvcatatan = '{FixQuotes_drutama}ppvcatatan', ppvnoref = '{FixQuotes_drutama}ppvnoref', ppvtglnoref = '{FixQuotes_AsFormatTanggal_drutama}ppvtglnoref', ppvcarabayar = {drutama}ppvcarabayar, ppvtglbayar = '{FixQuotes_AsFormatTanggal_drutama}ppvtglbayar', ppvmatauang = '{FixQuotes_drutama}ppvmatauang', ppvkurs = '{FixDouble_drutama}ppvkurs', ppvtotalap = '{FixDouble_drutama}ppvtotalap', ppvtotalapvalas = '{FixDouble_drutama}ppvtotalapvalas', ppvtotalar = '{FixDouble_drutama}ppvtotalar', ppvtotalarvalas = '{FixDouble_drutama}ppvtotalarvalas', ppvbayar = '{FixDouble_drutama}ppvbayar', ppvbayarvalas = '{FixDouble_drutama}ppvbayarvalas', ppvselisihkurs = '{FixDouble_drutama}ppvselisihkurs', ppvrekselisihkurs = '{FixQuotes_drutama}ppvrekselisihkurs', ppvdiskon = '{FixDouble_drutama}ppvdiskon', ppvdiskonvalas = '{FixDouble_drutama}ppvdiskonvalas', ppvrekdiskon = '{FixQuotes_drutama}ppvrekdiskon', ppvstatus = {drutama}ppvstatus, ppvstatussebelumnya = {drutama}ppvstatussebelumnya, ppvjmlrevisi = ppvjmlrevisi+1, ppvcetakanke = {drutama}ppvcetakanke, ppvmodifikasiuser = {drutama}ppvmodifikasiuser, ppvmodifikasitgl = NOW(), ppvcustomtext1 = '{FixQuotes_drutama}ppvcustomtext1', ppvcustomtext2 = '{FixQuotes_drutama}ppvcustomtext2', ppvcustomtext3 = '{FixQuotes_drutama}ppvcustomtext3', ppvcustomtext4 = '{FixQuotes_drutama}ppvcustomtext4', ppvcustomtext5 = '{FixQuotes_drutama}ppvcustomtext5', ppvcustomint1 = {drutama}ppvcustomint1, ppvcustomint2 = {drutama}ppvcustomint2, ppvcustomint3 = {drutama}ppvcustomint3, ppvcustomdbl1 = '{FixDouble_drutama}ppvcustomdbl1', ppvcustomdbl2 = '{FixDouble_drutama}ppvcustomdbl2', ppvcustomdbl3 = '{FixDouble_drutama}ppvcustomdbl3', ppvcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}ppvcustomdate1', ppvcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}ppvcustomdate2', ppvcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}ppvcustomdate3', ppvdenda = '{FixQuotes_drutama}ppvdenda', ppvdendavalas = '{FixQuotes_drutama}ppvdendavalas', ppvrekdenda = '{FixQuotes_drutama}ppvrekdenda' where ppvid = '{drutama}ppvid'
```

```sql
SELECT COUNT(ppvid) FROM m_12_ppv WHERE ppvnotransaksi='{notransaksi}'
```

```sql
Insert into M_12_Ppv (ppvcabang, ppvlokasi, ppvgudang, ppvsumber, ppvautonotransaksi, ppvnotransaksi, ppvtgl, ppvkodepa, ppvcustomer, ppvcustomerkontak, ppv1alamat1, ppv1alamat2, ppv1alamat3, ppv2alamat1, ppv2alamat2, ppv2alamat3, ppvbagianpenjualan, ppvbagianterima, ppvuraian, ppvcatatan, ppvnoref, ppvtglnoref, ppvcarabayar, ppvtglbayar, ppvmatauang, ppvkurs, ppvtotalap, ppvtotalapvalas, ppvtotalar, ppvtotalarvalas, ppvbayar, ppvbayarvalas, ppvselisihkurs, ppvrekselisihkurs, ppvdiskon, ppvdiskonvalas, ppvrekdiskon, ppvstatus, ppvstatussebelumnya, ppvjmlrevisi, ppvcetakanke, ppvinputuser, ppvinputtgl, ppvmodifikasiuser, ppvmodifikasitgl, ppvisclose, ppvcustomtext1, ppvcustomtext2, ppvcustomtext3, ppvcustomtext4, ppvcustomtext5, ppvcustomint1, ppvcustomint2, ppvcustomint3, ppvcustomdbl1, ppvcustomdbl2, ppvcustomdbl3, ppvcustomdate1, ppvcustomdate2, ppvcustomdate3, ppvdenda, ppvdendavalas, ppvrekdenda) values('{FixQuotes_drutama}ppvcabang', '{FixQuotes_drutama}ppvlokasi', '{FixQuotes_drutama}ppvgudang', '{FixQuotes_drutama}ppvsumber', {drutama}ppvautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}ppvtgl', {drutama}ppvkodepa, {drutama}ppvcustomer, '{FixQuotes_drutama}ppvcustomerkontak', '{FixQuotes_drutama}ppv1alamat1', '{FixQuotes_drutama}ppv1alamat2', '{FixQuotes_drutama}ppv1alamat3', '{FixQuotes_drutama}ppv2alamat1', '{FixQuotes_drutama}ppv2alamat2', '{FixQuotes_drutama}ppv2alamat3', {drutama}ppvbagianpenjualan, {drutama}ppvbagianterima, '{FixQuotes_drutama}ppvuraian', '{FixQuotes_drutama}ppvcatatan', '{FixQuotes_drutama}ppvnoref', '{FixQuotes_AsFormatTanggal_drutama}ppvtglnoref', {drutama}ppvcarabayar, '{FixQuotes_AsFormatTanggal_drutama}ppvtglbayar', '{FixQuotes_drutama}ppvmatauang', '{FixDouble_drutama}ppvkurs', '{FixDouble_drutama}ppvtotalap', '{FixDouble_drutama}ppvtotalapvalas', '{FixDouble_drutama}ppvtotalar', '{FixDouble_drutama}ppvtotalarvalas', '{FixDouble_drutama}ppvbayar', '{FixDouble_drutama}ppvbayarvalas', '{FixDouble_drutama}ppvselisihkurs', '{FixQuotes_drutama}ppvrekselisihkurs', '{FixDouble_drutama}ppvdiskon', '{FixDouble_drutama}ppvdiskonvalas', '{FixQuotes_drutama}ppvrekdiskon', {drutama}ppvstatus, {drutama}ppvstatussebelumnya, {drutama}ppvjmlrevisi, {drutama}ppvcetakanke, {drutama}ppvinputuser, NOW(), {drutama}ppvmodifikasiuser, '1971-01-01 00:00:00', {drutama}ppvisclose, '{FixQuotes_drutama}ppvcustomtext1', '{FixQuotes_drutama}ppvcustomtext2', '{FixQuotes_drutama}ppvcustomtext3', '{FixQuotes_drutama}ppvcustomtext4', '{FixQuotes_drutama}ppvcustomtext5', {drutama}ppvcustomint1, {drutama}ppvcustomint2, {drutama}ppvcustomint3, '{FixDouble_drutama}ppvcustomdbl1', '{FixDouble_drutama}ppvcustomdbl2', '{FixDouble_drutama}ppvcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}ppvcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}ppvcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}ppvcustomdate3', '{FixDouble_drutama}ppvdenda', '{FixDouble_drutama}ppvdendavalas', '{FixQuotes_drutama}ppvrekdenda')
```

```sql
select ppvid from M_12_ppv where ppvnotransaksi='{notransaksi}' AND ppvinputuser= '{userid}' order by ppvmodifikasitgl desc limit 1
```

```sql
Delete from M_12_Ppv_Detail where idppv = '{result_4}'
```

```sql
Insert into M_12_Ppv_Detail(idppvdetail, idppv, sumber, idtransaksi, matauang, kurs, totaltransaksi, terbayar, rencana, sisa, jmlbayar, jmlbayarvalas, diskon, jmldiskon, jmldiskonvalas, nogiro, rekhutangpiutang, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
Delete from M_12_PPv_Pay where idppv = '{result_4}'
```

```sql
Insert into M_12_Ppv_Pay(idppvcarabayar, idppv, carabayar, matauang, kurs, jumlah, jumlahvalas, nogiro, tgljt, bank, noacbank, rekbank, rekgiro, catatan, urutan, isclose) values{strValue2_ToString}
```

```sql
SELECT si.siid, sum(ppvd.jmlbayar) as bayar, sum(ppvd.jmlbayarvalas) as bayarvalas FROM m5_si si JOIN m5_si_installment sii ON si.siid = sii.idsi JOIN m_12_ppv_detail ppvd ON si.sisumber = ppvd.sumber AND sii.idsiinstallment = ppvd.idtransaksi WHERE ppvd.idppv = '{result_4}' GROUP BY si.siid
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Ppvtgl, Ppvnotransaksi, Ppvstatus FROM M_12_Ppv WHERE Ppvid='{idtransaksi}'
```

```sql
SELECT sumber, idtransaksi, matauang, jmlbayar, jmlbayarvalas, rekhutangpiutang, urutan FROM m_12_ppv_detail WHERE idppv = '{idtransaksi}'
```

```sql
SELECT si.siid, sum(ppvd.jmlbayar) as bayar, sum(ppvd.jmlbayarvalas) as bayarvalas FROM m5_si si JOIN m5_si_installment sii ON si.siid = sii.idsi JOIN m_12_ppv_detail ppvd ON si.sisumber = ppvd.sumber AND sii.idsiinstallment = ppvd.idtransaksi WHERE ppvd.idppv = '{idtransaksi}' GROUP BY si.siid
```

```sql
UPDATE M_12_Ppv SET Ppvstatus = {nilaiStatus}, Ppvmodifikasiuser='{userid}', Ppvmodifikasitgl = NOW(), Ppvposting = 0, Ppvpostingtgl = '1971-01-01 00:00:00', Ppvjmlrevisi = Ppvjmlrevisi + 1 WHERE Ppvid = '{idtransaksi}'
```

```sql
DELETE FROM M_12_Ppv_Detail WHERE idppv='{idtransaksi}'
```

```sql
DELETE FROM M_12_Ppv WHERE ppvid='{idtransaksi}'
```

```sql
select `ppv`.`ppvid` AS `ppvid`,`ppv`.`ppvcabang` AS `ppvcabang`,`ppv`.`ppvlokasi` AS `ppvlokasi`,`ppv`.`ppvgudang` AS `ppvgudang`,`ppv`.`ppvsumber` AS `ppvsumber`,`ppv`.`ppvautonotransaksi` AS `ppvautonotransaksi`,`ppv`.`ppvnotransaksi` AS `ppvnotransaksi`,`ppv`.`ppvtgl` AS `ppvtgl`,`ppv`.`ppvkodepa` AS `ppvkodepa`,`ppv`.`ppvcustomer` AS `ppvcustomer`,`ppv`.`ppvcustomerkontak` AS `ppvcustomerkontak`,`ppv`.`ppv1alamat1` AS `ppv1alamat1`,`ppv`.`ppv1alamat2` AS `ppv1alamat2`,`ppv`.`ppv1alamat3` AS `ppv1alamat3`,`ppv`.`ppv2alamat1` AS `ppv2alamat1`,`ppv`.`ppv2alamat2` AS `ppv2alamat2`,`ppv`.`ppv2alamat3` AS `ppv2alamat3`,`ppv`.`ppvbagianpenjualan` AS `ppvbagianpenjualan`,`ppv`.`ppvbagianterima` AS `ppvbagianterima`,`ppv`.`ppvuraian` AS `ppvuraian`,`ppv`.`ppvcatatan` AS `ppvcatatan`,`ppv`.`ppvnoref` AS `ppvnoref`,`ppv`.`ppvtglnoref` AS `ppvtglnoref`,`ppv`.`ppvcarabayar` AS `ppvcarabayar`,`ppv`.`ppvtglbayar` AS `ppvtglbayar`,`ppv`.`ppvmatauang` AS `ppvmatauang`,`ppv`.`ppvkurs` AS `ppvkurs`,`ppv`.`ppvtotalap` AS `ppvtotalap`,`ppv`.`ppvtotalapvalas` AS `ppvtotalapvalas`,`ppv`.`ppvtotalar` AS `ppvtotalar`,`ppv`.`ppvtotalarvalas` AS `ppvtotalarvalas`,`ppv`.`ppvbayar` AS `ppvbayar`,`ppv`.`ppvbayarvalas` AS `ppvbayarvalas`,`ppv`.`ppvselisihkurs` AS `ppvselisihkurs`,`ppv`.`ppvrekselisihkurs` AS `ppvrekselisihkurs`,`ppv`.`ppvdiskon` AS `ppvdiskon`,`ppv`.`ppvdiskonvalas` AS `ppvdiskonvalas`,`ppv`.`ppvrekdiskon` AS `ppvrekdiskon`,`ppv`.`ppvstatus` AS `ppvstatus`,`ppv`.`ppvstatussebelumnya` AS `ppvstatussebelumnya`,`ppv`.`ppvjmlrevisi` AS `ppvjmlrevisi`,`ppv`.`ppvcetakanke` AS `ppvcetakanke`,`ppv`.`ppvinputuser` AS `ppvinputuser`,`ppv`.`ppvinputtgl` AS `ppvinputtgl`,`ppv`.`ppvmodifikasiuser` AS `ppvmodifikasiuser`,`ppv`.`ppvmodifikasitgl` AS `ppvmodifikasitgl`,`ppv`.`ppvposting` AS `ppvposting`,`ppv`.`ppvpostingtgl` AS `ppvpostingtgl`,`ppv`.`ppvisclose` AS `ppvisclose`,`br`.`bnama` AS `ppvcabangnama`,`lc`.`lnama` AS `ppvlokasinama`,`wh`.`wnama` AS `ppvgudangnama`,`c1`.`kkode` AS `ppvcustomerkode`,`c1`.`knama` AS `ppvcustomernama`,`c2`.`kkode` AS `ppvbagianpenjualankode`,`c2`.`knama` AS `ppvbagianpenjualannama`,`c3`.`kkode` AS `ppvbagianterimakode`,`c3`.`knama` AS `ppvbagianterimanama`,`pm`.`nama` AS `ppvcarabayarnama`,`coa1`.`cnama` AS `ppvrekselisihkursnama`,`coa2`.`cnama` AS `ppvrekdiskonnama`,`st1`.`nama` AS `ppvstatusnama`,`st2`.`nama` AS `ppvstatussebelumnyanama`,`u1`.`unama` AS `ppvinputusernama`,`u2`.`unama` AS `ppvmodifikasiusernama`,`ppv`.`ppvdenda` AS `ppvdenda`,`ppv`.`ppvdendavalas` AS `ppvdendavalas`,`ppv`.`ppvrekdenda` AS `ppvrekdenda`from ((((((((((((((`m_12_ppv` `ppv` left join `m1_branch` `br` on((`br`.`bkode` = `ppv`.`ppvcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `ppv`.`ppvlokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `ppv`.`ppvgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `ppv`.`ppvcustomer`))) left join `m1_contact` `c2` on((`c2`.`kid` = `ppv`.`ppvbagianpenjualan`))) left join `m1_contact` `c3` on((`c3`.`kid` = `ppv`.`ppvbagianterima`))) left join `m0_payment_method` `pm` on((`ppv`.`ppvcarabayar` = `pm`.`kode`))) left join `m1_coa` `coa1` on((`ppv`.`ppvrekselisihkurs` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`ppv`.`ppvrekdiskon` = `coa2`.`cnomor`)))) left join `m0_status` `st1` on((`st1`.`kode` = `ppv`.`ppvstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `ppv`.`ppvstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `ppv`.`ppvinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `ppv`.`ppvmodifikasiuser`)))
```

```sql
select `ppv`.`ppvid` AS `ppvid`,`ppv`.`ppvcabang` AS `ppvcabang`,`ppv`.`ppvlokasi` AS `ppvlokasi`,`ppv`.`ppvgudang` AS `ppvgudang`,`ppv`.`ppvsumber` AS `ppvsumber`,`ppv`.`ppvautonotransaksi` AS `ppvautonotransaksi`,`ppv`.`ppvnotransaksi` AS `ppvnotransaksi`,`ppv`.`ppvtgl` AS `ppvtgl`,`ppv`.`ppvkodepa` AS `ppvkodepa`,`ppv`.`ppvcustomer` AS `ppvcustomer`,`ppv`.`ppvcustomerkontak` AS `ppvcustomerkontak`,`ppv`.`ppv1alamat1` AS `ppv1alamat1`,`ppv`.`ppv1alamat2` AS `ppv1alamat2`,`ppv`.`ppv1alamat3` AS `ppv1alamat3`,`ppv`.`ppv2alamat1` AS `ppv2alamat1`,`ppv`.`ppv2alamat2` AS `ppv2alamat2`,`ppv`.`ppv2alamat3` AS `ppv2alamat3`,`ppv`.`ppvbagianpenjualan` AS `ppvbagianpenjualan`,`ppv`.`ppvbagianterima` AS `ppvbagianterima`,`ppv`.`ppvuraian` AS `ppvuraian`,`ppv`.`ppvcatatan` AS `ppvcatatan`,`ppv`.`ppvnoref` AS `ppvnoref`,`ppv`.`ppvtglnoref` AS `ppvtglnoref`,`ppv`.`ppvcarabayar` AS `ppvcarabayar`,`ppv`.`ppvtglbayar` AS `ppvtglbayar`,`ppv`.`ppvmatauang` AS `ppvmatauang`,`ppv`.`ppvkurs` AS `ppvkurs`,`ppv`.`ppvtotalap` AS `ppvtotalap`,`ppv`.`ppvtotalapvalas` AS `ppvtotalapvalas`,`ppv`.`ppvtotalar` AS `ppvtotalar`,`ppv`.`ppvtotalarvalas` AS `ppvtotalarvalas`,`ppv`.`ppvbayar` AS `ppvbayar`,`ppv`.`ppvbayarvalas` AS `ppvbayarvalas`,`ppv`.`ppvselisihkurs` AS `ppvselisihkurs`,`ppv`.`ppvrekselisihkurs` AS `ppvrekselisihkurs`,`ppv`.`ppvdiskon` AS `ppvdiskon`,`ppv`.`ppvdiskonvalas` AS `ppvdiskonvalas`,`ppv`.`ppvrekdiskon` AS `ppvrekdiskon`,`ppv`.`ppvdenda` AS `ppvdenda`,`ppv`.`ppvdendavalas` AS `ppvdendavalas`,`ppv`.`ppvrekdenda` AS `ppvrekdenda`,`ppv`.`ppvstatus` AS `ppvstatus`,`ppv`.`ppvstatussebelumnya` AS `ppvstatussebelumnya`,`ppv`.`ppvjmlrevisi` AS `ppvjmlrevisi`,`ppv`.`ppvcetakanke` AS `ppvcetakanke`,`ppv`.`ppvinputuser` AS `ppvinputuser`,`ppv`.`ppvinputtgl` AS `ppvinputtgl`,`ppv`.`ppvmodifikasiuser` AS `ppvmodifikasiuser`,`ppv`.`ppvmodifikasitgl` AS `ppvmodifikasitgl`,`ppv`.`ppvposting` AS `ppvposting`,`ppv`.`ppvpostingtgl` AS `ppvpostingtgl`,`ppv`.`ppvisclose` AS `ppvisclose`,`ppv`.`ppvcustomtext1` AS `ppvcustomtext1`,`ppv`.`ppvcustomtext2` AS `ppvcustomtext2`,`ppv`.`ppvcustomtext3` AS `ppvcustomtext3`,`ppv`.`ppvcustomtext4` AS `ppvcustomtext4`,`ppv`.`ppvcustomtext5` AS `ppvcustomtext5`,`ppv`.`ppvcustomint1` AS `ppvcustomint1`,`ppv`.`ppvcustomint2` AS `ppvcustomint2`,`ppv`.`ppvcustomint3` AS `ppvcustomint3`,`ppv`.`ppvcustomdbl1` AS `ppvcustomdbl1`,`ppv`.`ppvcustomdbl2` AS `ppvcustomdbl2`,`ppv`.`ppvcustomdbl3` AS `ppvcustomdbl3`,`ppv`.`ppvcustomdate1` AS `ppvcustomdate1`,`ppv`.`ppvcustomdate2` AS `ppvcustomdate2`,`ppv`.`ppvcustomdate3` AS `ppvcustomdate3`,`br`.`bnama` AS `ppvcabangnama`,`lc`.`lnama` AS `ppvlokasinama`,`wh`.`wnama` AS `ppvgudangnama`,`c1`.`kkode` AS `ppvcustomerkode`,`c1`.`knama` AS `ppvcustomernama`,`c2`.`kkode` AS `ppvbagianpenjualankode`,`c2`.`knama` AS `ppvbagianpenjualannama`,`c3`.`kkode` AS `ppvbagianterimakode`,`c3`.`knama` AS `ppvbagianterimanama`,`pm`.`nama` AS `ppvcarabayarnama`,`coa1`.`cnama` AS `ppvrekselisihkursnama`,`coa2`.`cnama` AS `ppvrekdiskonnama`,`coa4`.`cnama` AS `ppvrekdendanama`,`st1`.`nama` AS `ppvstatusnama`,`st2`.`nama` AS `ppvstatussebelumnyanama`,`u1`.`unama` AS `ppvinputusernama`,`u2`.`unama` AS `ppvmodifikasiusernama`,`ppvd`.`idppvdetail` AS `idppvdetail`,`ppvd`.`idppv` AS `idppv`,`ppvd`.`sumber` AS `sumber`,`ppvd`.`idtransaksi` AS `idtransaksi`,`ppvd`.`matauang` AS `matauang`,`ppvd`.`kurs` AS `kurs`,`ppvd`.`totaltransaksi` AS `totaltransaksi`,`ppvd`.`terbayar` AS `terbayar`,`ppvd`.`sisa` AS `sisa`,`ppvd`.`jmlbayar` AS `jmlbayar`,`ppvd`.`jmlbayarvalas` AS `jmlbayarvalas`,`ppvd`.`diskon` AS `diskon`,`ppvd`.`jmldiskon` AS `jmldiskon`,`ppvd`.`jmldiskonvalas` AS `jmldiskonvalas`,`ppvd`.`nogiro` AS `nogiro`,`ppvd`.`rekhutangpiutang` AS `rekhutangpiutang`,`ppvd`.`catatan` AS `catatan`,`ppvd`.`costcenter` AS `costcenter`,`ppvd`.`divisi` AS `divisi`,`ppvd`.`subdivisi` AS `subdivisi`,`ppvd`.`proyek` AS `proyek`,`ppvd`.`urutan` AS `urutan`,`ppvd`.`isclose` AS `isclose`,`ppvd`.`customtext1` AS `customtext1`,`ppvd`.`customtext2` AS `customtext2`,`ppvd`.`customtext3` AS `customtext3`,`ppvd`.`customdbl1` AS `customdbl1`,`ppvd`.`customdbl2` AS `customdbl2`,`ppvd`.`customdbl3` AS `customdbl3`,`ppvd`.`customdate1` AS `customdate1`,`ppvd`.`customdate2` AS `customdate2`,`ppvd`.`customdate3` AS `customdate3`,(case `ppvd`.`sumber` when 'SI' then sinotransaksi when 'IP' then `ip`.`ipnotransaksi` else '' end) AS `notransaksi`,(case `ppvd`.`sumber` when 'SI' then angsuranke when 'IP' then angsuranke else '' end) AS `angsuranke`,(case `ppvd`.`sumber` when 'SI' then `si`.`sitgl` when 'IP' then `ip`.`iptgl` else `ppv`.`ppvtgl` end) AS `tgl`,(case `ppvd`.`sumber` when 'SI' then `si`.`sicarabayar` else `ppv`.`ppvcarabayar` end) AS `carabayar`,(case `ppvd`.`sumber` when 'SI' then `si`.`sitgljatuhtempo` when 'IP' then `ip`.`iptgljatuhtempo` else `ppv`.`ppvtgl` end) AS `tgljatuhtempo`, `ppvd`.`rencana` AS `rencana`,(case `ppvd`.`sumber` when 'SI' then `si`.`sistatuslunas` when 'IP' then `ip`.`ipstatusbayar` else 0 end) AS `statuslunas`,`coa3`.`cnama` AS `rekhutangpiutangnama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama`,(case `ppvd`.`sumber` when 'SI' then `si`.`siinputtgl` when 'IP' then `ip`.`ipinputtgl` else `ppv`.`ppvinputtgl` end) AS `inputtgl`, c1.kpkp from (((((((((((((((((((((`m_12_ppv` `ppv` join `m_12_ppv_detail` `ppvd` on((`ppv`.`ppvid` = `ppvd`.`idppv`))) left join `m1_branch` `br` on((`br`.`bkode` = `ppv`.`ppvcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `ppv`.`ppvlokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `ppv`.`ppvgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `ppv`.`ppvcustomer`))) left join `m1_contact` `c2` on((`c2`.`kid` = `ppv`.`ppvbagianpenjualan`))) left join `m1_contact` `c3` on((`c3`.`kid` = `ppv`.`ppvbagianterima`))) left join `m0_payment_method` `pm` on((`ppv`.`ppvcarabayar` = `pm`.`kode`))) left join `m1_coa` `coa1` on((`ppv`.`ppvrekselisihkurs` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`ppv`.`ppvrekdiskon` = `coa2`.`cnomor`))) left join `m1_coa` `coa4` on((`ppv`.`ppvrekdenda` = `coa4`.`cnomor`)))left join `m0_status` `st1` on((`st1`.`kode` = `ppv`.`ppvstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `ppv`.`ppvstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `ppv`.`ppvinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `ppv`.`ppvmodifikasiuser`))) left join `m5_si_installment` `sii` on(((`ppvd`.`sumber` = 'SI') and (`ppvd`.`idtransaksi` = `sii`.`idsiinstallment`)))) LEFT JOIN `m5_si` `si` on(((`ppvd`.`sumber` = 'SI') and (`sii`.`idsi` = `si`.`siid`)))) left join `m5_ip` `ip` on(((`ppvd`.`sumber` = 'IP') and (`ppvd`.`idtransaksi` = `ip`.`ipid`))) left join `m1_coa` `coa3` on((`ppvd`.`rekhutangpiutang` = `coa3`.`cnomor`))) left join `m1_project` `p` on((`ppvd`.`proyek` = `p`.`pkode`))) left join `m1_cost_center` `cc` on((`ppvd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`ppvd`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`ppvd`.`subdivisi` = `sd`.`sdkode`))
```

```sql
select `ppv`.`idppvcarabayar` AS `idppvcarabayar`, `ppv`.`idppv` AS `idppv`,`ppv`.`carabayar` AS `carabayar`, `ppv`.`matauang` AS `matauang`, `ppv`.`kurs` AS `kurs`,`ppv`.`jumlah` AS `jumlah`, `ppv`.`jumlahvalas` AS `jumlahvalas`,`ppv`.`nogiro` AS `nogiro`, `ppv`.`tgljt` AS `tgljt`,`ppv`.`bank` AS `bank`,`ppv`.`noacbank` AS `noacbank`, `ppv`.`rekbank` AS `rekbank`,`ppv`.`rekgiro` AS `rekgiro`,`ppv`.`catatan` AS `catatan`, `ppv`.`urutan` AS `urutan`,`ppv`.`isclose` AS `isclose`, `pm`.`nama` AS `carabayarnama`,`b`.`bnama` AS `banknama`,`coa1`.`cnama` AS `rekbanknama`, `coa2`.`cnama` AS `rekgironama` from ((((`m_12_ppv_pay` `ppv` left join `m0_payment_method` `pm` on((`ppv`.`carabayar` = `pm`.`kode`))) left join `m1_bank` `b` on((`ppv`.`bank` = `b`.`bkode`))) left join `m1_coa` `coa1` on((`ppv`.`rekbank` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`ppv`.`rekgiro` = `coa2`.`cnomor`)))
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_sbi.vb`

```sql
SELECT COUNT(sbiid), sbinotransaksi FROM M_12_Sbi WHERE sbiid=
```

```sql
SELECT COUNT(sbiid) FROM M_12_Sbi WHERE sbinotransaksi='{notransaksi}'
```

```sql
Update M_12_Sbi set sbicabang = '{FixQuotes_drutama}sbicabang', sbilokasi = '{FixQuotes_drutama}sbilokasi', sbisumber = '{FixQuotes_drutama}sbisumber', sbikategoripos = '{FixQuotes_drutama}sbikategoripos', sbiautonotransaksi = {drutama}sbiautonotransaksi, sbinotransaksi = '{FixQuotes_drutama}sbinotransaksi', sbitgl = '{FixQuotes_AsFormatTanggal_drutama}sbitgl', sbikodepa = '{FixQuotes_drutama}sbikodepa', sbikontak = '{FixQuotes_drutama}sbikontak', sbikontakperson = '{FixQuotes_drutama}sbikontakperson', sbiuraian = '{FixQuotes_drutama}sbiuraian', sbicatatan = '{FixQuotes_drutama}sbicatatan', sbistatus = {drutama}sbistatus, sbistatussebelumnya = {drutama}sbistatussebelumnya, sbijmlrevisi = {drutama}sbijmlrevisi, sbicetakanke = {drutama}sbicetakanke, sbiisclose = {drutama}sbiisclose, sbiinputuser = '{FixQuotes_drutama}sbiinputuser', sbimodifikasiuser = '{FixQuotes_drutama}sbimodifikasiuser', sbimodifikasitgl = NOW(), sbiposting = {drutama}sbiposting, sbipostingtgl = '{FixQuotes_AsFormatTanggal_drutama}sbipostingtglyyyy-MM-dd H:mm:ss', sbicustomtext1 = '{FixQuotes_drutama}sbicustomtext1', sbicustomtext2 = '{FixQuotes_drutama}sbicustomtext2', sbicustomtext3 = '{FixQuotes_drutama}sbicustomtext3', sbicustomtext4 = '{FixQuotes_drutama}sbicustomtext4', sbicustomtext5 = '{FixQuotes_drutama}sbicustomtext5', sbicustomint1 = {drutama}sbicustomint1, sbicustomint2 = {drutama}sbicustomint2, sbicustomint3 = {drutama}sbicustomint3, sbicustomdbl1 = '{FixDouble_drutama}sbicustomdbl1', sbicustomdbl2 = '{FixDouble_drutama}sbicustomdbl2', sbicustomdbl3 = '{FixDouble_drutama}sbicustomdbl3', sbicustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}sbicustomdate1', sbicustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}sbicustomdate2', sbicustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}sbicustomdate3', sbijeniskategori = '{FixQuotes_drutama}sbijeniskategori' where sbiid = {drutama}sbiid
```

```sql
SELECT COUNT(sbiid) FROM m_12_sbi WHERE sbinotransaksi='{notransaksi}'
```

```sql
Insert into M_12_Sbi (sbicabang, sbilokasi, sbisumber, sbikategoripos, sbiautonotransaksi, sbinotransaksi, sbitgl, sbikodepa, sbikontak, sbikontakperson, sbiuraian, sbicatatan, sbistatus, sbistatussebelumnya, sbijmlrevisi, sbicetakanke, sbiisclose, sbiinputuser, sbiinputtgl, sbimodifikasiuser, sbimodifikasitgl, sbiposting, sbipostingtgl, sbicustomtext1, sbicustomtext2, sbicustomtext3, sbicustomtext4, sbicustomtext5, sbicustomint1, sbicustomint2, sbicustomint3, sbicustomdbl1, sbicustomdbl2, sbicustomdbl3, sbicustomdate1, sbicustomdate2, sbicustomdate3, sbijeniskategori) values('{FixQuotes_drutama}sbicabang', '{FixQuotes_drutama}sbilokasi', '{FixQuotes_drutama}sbisumber', '{FixQuotes_drutama}sbikategoripos', {drutama}sbiautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}sbitgl', '{FixQuotes_drutama}sbikodepa', '{FixQuotes_drutama}sbikontak', '{FixQuotes_drutama}sbikontakperson', '{FixQuotes_drutama}sbiuraian', '{FixQuotes_drutama}sbicatatan', {drutama}sbistatus, {drutama}sbistatussebelumnya, {drutama}sbijmlrevisi, {drutama}sbicetakanke, {drutama}sbiisclose, '{FixQuotes_drutama}sbiinputuser', NOW(), '{FixQuotes_drutama}sbimodifikasiuser', '1971-01-01 00:00:00', 0, '1971-01-01 00:00:00', '{FixQuotes_drutama}sbicustomtext1', '{FixQuotes_drutama}sbicustomtext2', '{FixQuotes_drutama}sbicustomtext3', '{FixQuotes_drutama}sbicustomtext4', '{FixQuotes_drutama}sbicustomtext5', {drutama}sbicustomint1, {drutama}sbicustomint2, {drutama}sbicustomint3, '{FixDouble_drutama}sbicustomdbl1', '{FixDouble_drutama}sbicustomdbl2', '{FixDouble_drutama}sbicustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}sbicustomdate1', '{FixQuotes_AsFormatTanggal_drutama}sbicustomdate2', '{FixQuotes_AsFormatTanggal_drutama}sbicustomdate3', {drutama}sbijeniskategori)
```

```sql
select sbiid from M_12_sbi where sbinotransaksi='{notransaksi}' AND sbiinputuser= '{drutama}sbiinputuser' order by sbimodifikasitgl desc limit 1
```

```sql
Delete from M_12_Sbi_Detail where idsbi =
```

```sql
Delete from M_12_Sbi_Substitution where idsbi =
```

```sql
SELECT sbid.sbikategori as kategori, sbid.idbarang as idbarang, sbid.operator as operator, i.bkode, (CASE sbid.operator WHEN 0 THEN 'Between' WHEN 1 THEN '>=' WHEN 2 THEN 'Multiple' ELSE 'Unknown' END) as operatornama FROM m_12_sbi_detail sbid JOIN m1_item i ON sbid.idbarang = i.bid WHERE sbid.sbikategori = '{FxDB_drutama}sbikategoripos' AND sbid.idbarang = '{FxDB_dr1}idbarang' AND sbid.idsbi = '{result_4}' AND sbid.idsbidetail <> '{FxDB_dr1}idsbidetail' GROUP BY sbid.operator ORDER BY sbid.operator
```

```sql
Insert into M_12_Bi_Detail(idbidetail, idbi, bikategori, idbarang, operator, jml1, jml2, customtext1, customtext2, customtext3, customtext4, customtext5, customint1, customint2, customint3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, tgl1, tgl2, nopromo) values{strValue2_ToString}
```

```sql
Insert into M_12_Sbi_Detail(idsbidetail, idsbi, sbikategori, idbarang, operator, jml1, jml2, customtext1, customtext2, customtext3, customtext4, customtext5, customint1, customint2, customint3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, tgl1, tgl2, nopromo, catatan, urutan) values('{FixQuotes_dr1}idsbidetail', {result_4}, '{FixQuotes_drutama}sbikategoripos', '{FixQuotes_dr1}idbarang', '{FixQuotes_dr1}operator', '{FixDouble_dr1}jml1', '{FixDouble_dr1}jml2', '{FixQuotes_dr1}customtext1', '{FixQuotes_dr1}customtext2', '{FixQuotes_dr1}customtext3', '{FixQuotes_dr1}customtext4', '{FixQuotes_dr1}customtext5', {dr1}customint1, {dr1}customint2, {dr1}customint3, '{FixDouble_dr1}customdbl1', '{FixDouble_dr1}customdbl2', '{FixDouble_dr1}customdbl3', '{FixQuotes_AsFormatTanggal_dr1}customdate1', '{FixQuotes_AsFormatTanggal_dr1}customdate2', '{FixQuotes_AsFormatTanggal_dr1}customdate3', '{FixQuotes_AsFormatTanggal_dr1}tgl1', '{FixQuotes_AsFormatTanggal_dr1}tgl2', '{notransaksi}', '{FixQuotes_dr1}catatan','{FixQuotes_dr1}urutan')
```

```sql
select idsbidetail from M_12_sbi_detail where idsbi='{result_4}' and sbikategori = '{drutama}sbikategoripos' AND idbarang = '{dr1}idbarang' AND operator = '{dr1}operator' AND jml1 = '{dr1}jml1' AND jml2 = '{dr1}jml2' order by idsbidetail desc limit 1
```

```sql
Insert into M_12_Sbi_Substitution(idsubstitution, idsbi, idsbidetail, idbarang, jml, satuan, customtext1, customtext2, customtext3, customtext4, customtext5, customint1, customint2, customint3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, urutan) values{strValue2_ToString}
```

```sql
select siid from M_12_Pos_Substitution_Item where sikategori = '{drutama}sbikategoripos'
```

```sql
Delete From m_12_pos_substitution_item where {strValueItemUtama_ToString}
```

```sql
Delete From m_12_pos_substitution_item_detail where {strValueItemDetail_ToString}
```

```sql
select siid from M_12_Pos_Substitution_Item where sikategori IN ({dtCatPOS_Rows_0_0})
```

```sql
Delete From m_12_pos_substitution_item
```

```sql
Delete From m_12_pos_substitution_item_detail
```

```sql
select * from M_12_Sbi_Detail where idsbi = '{result_4}' order by idsbi asc
```

```sql
select * from M_12_Sbi_Substitution where idsbi = '{result_4}' order by idsbi asc
```

```sql
Insert into M_12_Pos_Substitution_Item (sikategori, siidbarang, sioperator, sijml1, sijml2, sicustomtext1, sicustomtext2, sicustomtext3, sicustomtext4, sicustomtext5, sicustomint1, sicustomint2, sicustomint3, sicustomdbl1, sicustomdbl2, sicustomdbl3, sicustomdate1, sicustomdate2, sicustomdate3, sitgl1, sitgl2, sinopromo) values {strValueInsertSubstitutionItem_ToString}
```

```sql
select siid from M_12_Pos_Substitution_Item where sinopromo = '{drdtl2}nopromo' AND sikategori = '{drdtl2}sbikategori' AND siidbarang = '{drdtl2}idbarang' AND sioperator = '{drdtl2}operator' AND sijml1 = '{drdtl2}jml1' AND sijml2 = '{drdtl2}jml2' limit 1
```

```sql
Insert into M_12_Pos_Substitution_Item_Detail(idsi, idbarang, jml, satuan, customtext1, customtext2, customtext3, customtext4, customtext5, customint1, customint2, customint3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValueSubstitutionItemDetail_ToString}
```

```sql
select pckode from m_12_pos_category WHERE pckode IN ({dtCatPOS_Rows_0_0})
```

```sql
select piidbarang from M_12_Pos_Item where pikategori = '{drKatPos}pckode' AND piidbarang = '{drdtl}idbarang' order by pikategori asc
```

```sql
select piidbarang from M_12_Pos_Item where pikategori = '{drKatPos}pckode' AND piidbarang = '{drdtl2}idbarang' order by pikategori asc
```

```sql
select siid from M_12_Pos_Substitution_Item where sinopromo = '{drdtl2}nopromo' AND sikategori = '{drKatPos}pckode' AND siidbarang = '{drdtl2}idbarang' AND sioperator = '{drdtl2}operator' AND sijml1 = '{drdtl2}jml1' AND sijml2 = '{drdtl2}jml2' limit 1
```

```sql
select pckode from m_12_pos_category
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Sbitgl, Sbinotransaksi, Sbistatus FROM m_12_Sbi WHERE Sbiid='{idtransaksi}'
```

```sql
SELECT * FROM M_12_Sbi WHERE sbiid=
```

```sql
SELECT * FROM M_12_Sbi_Detail WHERE idsbi=
```

```sql
SELECT siid FROM m_12_pos_substitution_item WHERE sikategori='{drdetail}sbikategori' AND sinopromo = '{drdetail}nopromo'
```

```sql
Delete from M_12_pos_substitution_item WHERE
```

```sql
Delete from M_12_pos_substitution_item_Detail WHERE
```

```sql
SELECT siid FROM m_12_pos_substitution_item WHERE sinopromo = '{drdetail}nopromo'
```

```sql
Delete from M_12_Bi_Detail WHERE idbidetail=
```

```sql
SELECT Bistatussebelumnya FROM M_12_Bi WHERE biid=
```

```sql
UPDATE M_12_Sbi SET Sbistatus = {nilaiStatus}, Sbimodifikasiuser='{userid}', Sbimodifikasitgl = NOW(), Sbiposting = 0, Sbipostingtgl = '1971-01-01 00:00:00', Sbijmlrevisi = Sbijmlrevisi + 1 WHERE Sbiid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT sbiid, sbinotransaksi FROM m_12_sbi WHERE sbiid='{idtransaksi}'
```

```sql
DELETE FROM M_12_sbi_Detail WHERE idsbi = '{idtransaksi}'
```

```sql
DELETE FROM M_12_sbi WHERE sbiid = '{idtransaksi}'
```

```sql
select siid from M_12_Pos_Substitution_Item where sikategori = '{drdtl2}sbikategori' AND siidbarang = '{drdtl2}idbarang' AND sioperator = '{drdtl2}operator' AND sijml1 = '{drdtl2}jml1' AND sijml2 = '{drdtl2}jml2' limit 1
```

```sql
select * from m_12_pos_category
```

```sql
select * from M_12_Pos_Item where pikategori = '{drKatPos}pckode' AND piidbarang = '{drdtl}idbarang' order by pikategori asc
```

```sql
select * from M_12_Pos_Item where pikategori = '{drKatPos}pckode' AND piidbarang = '{drdtl2}idbarang' order by pikategori asc
```

```sql
select siid from M_12_Pos_Substitution_Item where sikategori = '{drKatPos}pckode' AND siidbarang = '{drdtl2}idbarang' AND sioperator = '{drdtl2}operator' AND sijml1 = '{drdtl2}jml1' AND sijml2 = '{drdtl2}jml2' limit 1
```

```sql
select `sbib`.`idsubstitution` AS `idsubstitution`, `sbib`.`idsbidetail` AS `idsbidetail`,`sbib`.`idsbi` AS `idsbi`,`sbib`.`idbarang` AS `idbarang`,`sbib`.`jml` AS `jml`,`sbib`.`satuan` AS `satuan`,`sbib`.`customtext1` AS `customtext1`,`sbib`.`customtext2` AS `customtext2`,`sbib`.`customtext3` AS `customtext3`,`sbib`.`customtext4` AS `customtext4`,`sbib`.`customtext5` AS `customtext5`,`sbib`.`customint1` AS `customint1`,`sbib`.`customint2` AS `customint2`,`sbib`.`customint3` AS `customint3`,`sbib`.`customdbl1` AS `customdbl1`,`sbib`.`customdbl2` AS `customdbl2`,`sbib`.`customdbl3` AS `customdbl3`,`sbib`.`customdate1` AS `customdate1`,`sbib`.`customdate2` AS `customdate2`,`sbib`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bnama` AS `namabarang`,`sbib`.`urutan` AS `urutan` FROM `m_12_sbi_substitution` `sbib` JOIN m1_item `i` ON (`sbib`.`idbarang` = `i`.bid) WHERE `sbib`.idsbi='{idtransaksi}' ORDER BY `sbib`.`urutan` ASC
```

```sql
select `sbi`.`sbiid` AS `sbiid`,`sbi`.`sbicabang` AS `sbicabang`,`sbi`.`sbilokasi` AS `sbilokasi`,`sbi`.`sbisumber` AS `sbisumber`,`sbi`.`sbiautonotransaksi` AS `sbiautonotransaksi`,`sbi`.`sbinotransaksi` AS `sbinotransaksi`,`sbi`.`sbitgl` AS `sbitgl`,`sbi`.`sbikodepa` AS `sbikodepa`,`sbi`.`sbikontak` AS `sbikontak`,`sbi`.`sbikontakperson` AS `sbikontakperson`,`sbi`.`sbikategoripos` AS `sbikategoripos`,`sbi`.`sbiuraian` AS `sbiuraian`,`sbi`.`sbicatatan` AS `sbicatatan`,`sbi`.`sbistatus` AS `sbistatus`,`sbi`.`sbistatussebelumnya` AS `sbistatussebelumnya`,`sbi`.`sbijmlrevisi` AS `sbijmlrevisi`,`sbi`.`sbicetakanke` AS `sbicetakanke`,`sbi`.`sbiisclose` AS `sbiisclose`,`sbi`.`sbiinputuser` AS `sbiinputuser`,`sbi`.`sbiinputtgl` AS `sbiinputtgl`,`sbi`.`sbimodifikasiuser` AS `sbimodifikasiuser`,`sbi`.`sbimodifikasitgl` AS `sbimodifikasitgl`,`sbi`.`sbiposting` AS `sbiposting`,`sbi`.`sbipostingtgl` AS `sbipostingtgl`,`sbi`.`sbicustomtext1` AS `sbicustomtext1`,`sbi`.`sbicustomtext2` AS `sbicustomtext2`,`sbi`.`sbicustomtext3` AS `sbicustomtext3`,`sbi`.`sbicustomtext4` AS `sbicustomtext4`,`sbi`.`sbicustomtext5` AS `sbicustomtext5`,`sbi`.`sbicustomint1` AS `sbicustomint1`,`sbi`.`sbicustomint2` AS `sbicustomint2`,`sbi`.`sbicustomint3` AS `sbicustomint3`,`sbi`.`sbicustomdbl1` AS `sbicustomdbl1`,`sbi`.`sbicustomdbl2` AS `sbicustomdbl2`,`sbi`.`sbicustomdbl3` AS `sbicustomdbl3`,`sbi`.`sbicustomdate1` AS `sbicustomdate1`,`sbi`.`sbicustomdate2` AS `sbicustomdate2`,`sbi`.`sbicustomdate3` AS `sbicustomdate3`,`br`.`bnama` AS `sbicabangnama`,`lc`.`lnama` AS `sbilokasinama`,`c`.`kkode` AS `sbikontakkode`,`c`.`knama` AS `sbikontaknama`,`st1`.`nama` AS `sbistatusnama`,`st2`.`nama` AS `sbistatussebelumnyanama`,`u1`.`unama` AS `sbiinputusernama`,`u2`.`unama` AS `sbimodifikasiusernama` from (((((((`m_12_sbi` `sbi` left join `m1_branch` `br` on((`sbi`.`sbicabang` = `br`.`bkode`))) left join `m1_location` `lc` on((`sbi`.`sbilokasi` = `lc`.`lkode`))) left join `m1_contact` `c` on((`sbi`.`sbikontak` = `c`.`kid`))) left join `m0_status` `st1` on((`sbi`.`sbistatus` = `st1`.`kode`))) left join `m0_status` `st2` on((`sbi`.`sbistatussebelumnya` = `st2`.`kode`))) left join `m0_user` `u1` on((`sbi`.`sbiinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`sbi`.`sbimodifikasiuser` = `u2`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_si.vb`

```sql
SELECT vi.vikode, vi.vimatauang, (CASE vi.vimatauang WHEN s.snilai THEN vi.vijml - vi.vijmlbayar ELSE vi.vijmlvalas - vi.vijmlbayarvalas END) as sisa FROM m_12_pos_voucher_in vi JOIN m0_setting s ON s.smodule = 0 AND s.sgrup = 'accounting' AND s.skode = 'MataUangFungsional' WHERE vi.viid = '{FixQuotes_dr1}nogiro' AND (CASE vi.vimatauang WHEN s.snilai THEN vi.vijml - vi.vijmlbayar < '{jmlV}' ELSE vi.vijmlvalas - vi.vijmlbayarvalas < '{jmlVValas}' END)
```

```sql
UPDATE m_12_pos_voucher_in SET vijmlbayar = vijmlbayar + {FixDouble_dr1}jumlah, vijmlbayarvalas = vijmlbayarvalas + {FixDouble_dr1}jumlahvalas WHERE viid = '{FixQuotes_dr1}nogiro'
```

```sql
SELECT vi.vikode, vi.vitglexpired FROM m_12_pos_voucher_in vi WHERE vi.vitglexpired < '{FixQuotes_AsFormatTanggal_drutama}sitgl' AND ({ftVoucher_ToString})
```

```sql
Insert into M_12_Pos_Voucher_Out(void, voidvi, vosumber, voidtransaksi, vomatauang, vojmlbayar, vojmlbayarvalas, voisclose) values{strVoucher_ToString}
```

```sql
DELETE FROM m_12_pos_voucher_out WHERE vosumber = '{sumber}' AND voidtransaksi = '{idtransaksi}'
```

```sql
UPDATE m_12_pos_voucher_in SET vijmlbayar = vijmlbayar - {FixDouble_dr1}jumlah, vijmlbayarvalas = vijmlbayarvalas - {FixDouble_dr1}jumlahvalas WHERE viid = '{FixQuotes_dr1}nogiro'
```

```sql
UPDATE m_12_pos_voucher_in SET vijmlbayar = vijmlbayar - {FixDouble_dr1}customdbl1, vijmlbayarvalas = vijmlbayarvalas - {FixDouble_dr1}customdbl1 WHERE viid = '{FixQuotes_dr1}customint1'
```

```sql
select `si`.`siid` AS `siid`, `si`.`sicabang` AS `sicabang`, `si`.`silokasi` AS `silokasi`, `si`.`sigudang` AS `sigudang`, `si`.`siasalbarang` AS `siasalbarang`, `si`.`siasalbarangkategori` AS `siasalbarangkategori`, `si`.`sijenispenjualan` AS `sijenispenjualan`, `si`.`sijenispenjualankategori` AS `sijenispenjualankategori`, `si`.`sicarabayar` AS `sicarabayar`, `si`.`sisumber` AS `sisumber`, `si`.`siautonotransaksi` AS `siautonotransaksi`, `si`.`sinotransaksi` AS `sinotransaksi`, `si`.`sitgl` AS `sitgl`, `si`.`sikodepa` AS `sikodepa`, `si`.`sicustomer` AS `sicustomer`, `si`.`sicustomerkontak` AS `sicustomerkontak`, `si`.`si1alamat1` AS `si1alamat1`, `si`.`si1alamat2` AS `si1alamat2`, `si`.`si1alamat3` AS `si1alamat3`, `si`.`si2alamat1` AS `si2alamat1`, `si`.`si2alamat2` AS `si2alamat2`, `si`.`si2alamat3` AS `si2alamat3`, `si`.`sibagianpenjualan` AS `sibagianpenjualan`, `si`.`siekspedisi` AS `siekspedisi`, `si`.`sitglkirim` AS `sitglkirim`, `si`.`sitermin` AS `sitermin`, `si`.`sitgljatuhtempo` AS `sitgljatuhtempo`, `si`.`siuraian` AS `siuraian`, `si`.`sicatatan` AS `sicatatan`, `si`.`sinoref` AS `sinoref`, `si`.`sitglnoref` AS `sitglnoref`, `si`.`sitglpenutupan` AS `sitglpenutupan`, `si`.`simatauang` AS `simatauang`, `si`.`sikurs` AS `sikurs`, `si`.`sihargatermasukpajak` AS `sihargatermasukpajak`, `si`.`sitotal` AS `sitotal`, `si`.`sidiskonpersen` AS `sidiskonpersen`, `si`.`sijmldiskon` AS `sijmldiskon`, `si`.`sitotalpajak1detail` AS `sitotalpajak1detail`, `si`.`sitotalpajak2detail` AS `sitotalpajak2detail`, `si`.`sibiayalainpersen` AS `sibiayalainpersen`, `si`.`sibiayalain` AS `sibiayalain`, `si`.`sitotaltransaksi` AS `sitotaltransaksi`, `si`.`sijmlbayar` AS `sijmlbayar`, `si`.`sistatuslunas` AS `sistatuslunas`, `si`.`sitgllunas` AS `sitgllunas`, `si`.`sinofakturpajak` AS `sinofakturpajak`, `si`.`sisdhbayarpajak` AS `sisdhbayarpajak`, `si`.`sitglbayarpajak` AS `sitglbayarpajak`, `si`.`sirekdiskon` AS `sirekdiskon`, `si`.`sirekpajak1` AS `sirekpajak1`, `si`.`sirekpajak2` AS `sirekpajak2`, `si`.`sirekbiayalain` AS `sirekbiayalain`, `si`.`sirekbayar` AS `sirekbayar`, `si`.`siidsq` AS `siidsq`, `si`.`siidso` AS `siidso`, `si`.`siidpl` AS `siidpl`, `si`.`siiddo` AS `siiddo`, `si`.`siiddr` AS `siiddr`, `si`.`siidpi` AS `siidpi`, `si`.`sistatusrnr` AS `sistatusrnr`, `si`.`sistatussr` AS `sistatussr`, `si`.`sistatusrealisasi` AS `sistatusrealisasi`, `si`.`sistatus` AS `sistatus`, `si`.`sistatussebelumnya` AS `sistatussebelumnya`, `si`.`sijmlrevisi` AS `sijmlrevisi`, `si`.`sicetakanke` AS `sicetakanke`, `si`.`siinputuser` AS `siinputuser`, `si`.`siinputtgl` AS `siinputtgl`, `si`.`simodifikasiuser` AS `simodifikasiuser`, `si`.`simodifikasitgl` AS `simodifikasitgl`, `si`.`siposting` AS `siposting`, `si`.`sipostingtgl` AS `sipostingtgl`, `si`.`situtupperiode` AS `situtupperiode`, `si`.`siisclose` AS `siisclose`, `br`.`bnama` AS `sicabangnama`, `lc`.`lnama` AS `silokasinama`, `wh`.`wnama` AS `sigudangnama`, `c1`.`kkode` AS `sicustomerkode`, `c1`.`knama` AS `sicustomernama`, `c2`.`kkode` AS `sibagianpenjualankode`, `c2`.`knama` AS `sibagianpenjualannama`, `e`.`enama` AS `siekspedisinama`, `sq`.`sqnotransaksi` AS `sqnotransaksi`, `so`.`sonotransaksi` AS `sonotransaksi`, `pl`.`plnotransaksi` AS `plnotransaksi`, `do`.`donotransaksi` AS `donotransaksi`, `dr`.`drnotransaksi` AS `drnotransaksi`, `pi`.`pinotransaksi` AS `pinotransaksi`, `st1`.`nama` AS `sistatusnama`, `st2`.`nama` AS `sistatussebelumnyanama`, `u1`.`unama` AS `siinputusernama`, `u2`.`unama` AS `simodifikasiusernama`, `si`.`sijmluangmuka` AS `sijmluangmuka`, `si`.`sirekuangmuka` AS `sirekuangmuka`, `si`.`siidas` AS `siidas`, `as`.`asnotransaksi` AS `asnotransaksi`, `si`.`sisaldoawal` AS `sisaldoawal`, `si`.`sibayartunai` AS `sibayartunai`, `si`.`sibayarkkredit` AS `sibayarkkredit`, `si`.`sibayarkdebit` AS `sibayarkdebit`, `si`.`sibayarvoucher` AS `sibayarvoucher`, `si`.`sibayarpoin` AS `sibayarpoin`, `si`.`sibayarjmlpoin` AS `sibayarjmlpoin`, `si`.`sichargepersen` AS `sichargepersen`, `si`.`sicharge` AS `sicharge`, `si`.`sipoinsebelumnya` AS `sipoinsebelumnya`, `si`.`sipoindidapat` AS `sipoindidapat`, `si`.`sicustomarea` AS `sicustomarea`, `area`.`anama` AS `sicustomareanama`, si.siuploaded, si.sirekcharge, si.sijmlkembali, si.sirekkembali,(CASE si.siuploaded WHEN 1 THEN 'Sudah Upload' ELSE 'Belum Upload' END) as siuploadednama from `m5_si` `si` join m0_userlogin ul on ul.ulid = '{FixQuotes_paramSplit_0}' left join m0_user_branch ub on ul.uluser = ub.userid left join m0_user_location uloc on ul.uluser = uloc.userid left join `m1_branch` `br` on `br`.`bkode` = `si`.`sicabang` left join `m1_location` `lc` on `lc`.`lkode` = `si`.`silokasi` left join `m1_warehouse` `wh` on `wh`.`wkode` = `si`.`sigudang` left join `m1_contact` `c1` on `c1`.`kid` = `si`.`sicustomer` left join `m1_contact` `c2` on `c2`.`kid` = `si`.`sibagianpenjualan` left join `m1_expedition` `e` on `si`.`siekspedisi` = `e`.`ekode` left join `m5_sq` `sq` on `si`.`siidsq` = `sq`.`sqid` left join `m5_so` `so` on `si`.`siidso` = `so`.`soid` left join `m5_pl` `pl` on `si`.`siidpl` = `pl`.`plid` left join `m5_do` `do` on `si`.`siiddo` = `do`.`doid` left join `m5_dr` `dr` on `si`.`siiddr` = `dr`.`drid` left join `m5_pi` `pi` on `si`.`siidpi` = `pi`.`piid` left join `m0_status` `st1` on `st1`.`kode` = `si`.`sistatus` left join `m0_status` `st2` on `st2`.`kode` = `si`.`sistatussebelumnya` left join `m0_user` `u1` on `u1`.`userid` = `si`.`siinputuser` left join `m0_user` `u2` on `u2`.`userid` = `si`.`simodifikasiuser` left join `m5_as` `as` on `si`.`siidas` = `as`.`asid` left join `m_12_area` `area` on `si`.`sicustomarea` = `area`.`akode`
```

```sql
select `si`.`siid` AS `siid`, `si`.`sicabang` AS `sicabang`, `si`.`silokasi` AS `silokasi`, `si`.`sigudang` AS `sigudang`, `si`.`siasalbarang` AS `siasalbarang`, `si`.`siasalbarangkategori` AS `siasalbarangkategori`, `si`.`sijenispenjualan` AS `sijenispenjualan`, `si`.`sijenispenjualankategori` AS `sijenispenjualankategori`, `si`.`sicarabayar` AS `sicarabayar`, `si`.`sisumber` AS `sisumber`, `si`.`siautonotransaksi` AS `siautonotransaksi`, `si`.`sinotransaksi` AS `sinotransaksi`, `si`.`sitgl` AS `sitgl`, `si`.`sikodepa` AS `sikodepa`, `si`.`sicustomer` AS `sicustomer`, `si`.`sicustomerkontak` AS `sicustomerkontak`, `si`.`si1alamat1` AS `si1alamat1`, `si`.`si1alamat2` AS `si1alamat2`, `si`.`si1alamat3` AS `si1alamat3`, `si`.`si2alamat1` AS `si2alamat1`, `si`.`si2alamat2` AS `si2alamat2`, `si`.`si2alamat3` AS `si2alamat3`, `si`.`sibagianpenjualan` AS `sibagianpenjualan`, `si`.`siekspedisi` AS `siekspedisi`, `si`.`sitglkirim` AS `sitglkirim`, `si`.`sitermin` AS `sitermin`, `si`.`sitgljatuhtempo` AS `sitgljatuhtempo`, `si`.`siuraian` AS `siuraian`, `si`.`sicatatan` AS `sicatatan`, `si`.`sinoref` AS `sinoref`, `si`.`sitglnoref` AS `sitglnoref`, `si`.`sitglpenutupan` AS `sitglpenutupan`, `si`.`simatauang` AS `simatauang`, `si`.`sikurs` AS `sikurs`, `si`.`sihargatermasukpajak` AS `sihargatermasukpajak`, `si`.`sitotal` AS `sitotal`, `si`.`sidiskonpersen` AS `sidiskonpersen`, `si`.`sijmldiskon` AS `sijmldiskon`, `si`.`sitotalpajak1detail` AS `sitotalpajak1detail`, `si`.`sitotalpajak2detail` AS `sitotalpajak2detail`, `si`.`sibiayalainpersen` AS `sibiayalainpersen`, `si`.`sibiayalain` AS `sibiayalain`, `si`.`sitotaltransaksi` AS `sitotaltransaksi`, `si`.`sijmlbayar` AS `sijmlbayar`, `si`.`sistatuslunas` AS `sistatuslunas`, `si`.`sitgllunas` AS `sitgllunas`, `si`.`sinofakturpajak` AS `sinofakturpajak`, `si`.`sisdhbayarpajak` AS `sisdhbayarpajak`, `si`.`sitglbayarpajak` AS `sitglbayarpajak`, `si`.`sirekdiskon` AS `sirekdiskon`, `si`.`sirekpajak1` AS `sirekpajak1`, `si`.`sirekpajak2` AS `sirekpajak2`, `si`.`sirekbiayalain` AS `sirekbiayalain`, `si`.`sirekbayar` AS `sirekbayar`, `si`.`siidsq` AS `siidsq`, `si`.`siidso` AS `siidso`, `si`.`siidpl` AS `siidpl`, `si`.`siiddo` AS `siiddo`, `si`.`siiddr` AS `siiddr`, `si`.`siidpi` AS `siidpi`, `si`.`sistatusrnr` AS `sistatusrnr`, `si`.`sistatussr` AS `sistatussr`, `si`.`sistatusrealisasi` AS `sistatusrealisasi`, `si`.`sistatus` AS `sistatus`, `si`.`sistatussebelumnya` AS `sistatussebelumnya`, `si`.`sijmlrevisi` AS `sijmlrevisi`, `si`.`sicetakanke` AS `sicetakanke`, `si`.`siinputuser` AS `siinputuser`, `si`.`siinputtgl` AS `siinputtgl`, `si`.`simodifikasiuser` AS `simodifikasiuser`, `si`.`simodifikasitgl` AS `simodifikasitgl`, `si`.`siposting` AS `siposting`, `si`.`sipostingtgl` AS `sipostingtgl`, `si`.`situtupperiode` AS `situtupperiode`, `si`.`siisclose` AS `siisclose`, `br`.`bnama` AS `sicabangnama`, `lc`.`lnama` AS `silokasinama`, `wh`.`wnama` AS `sigudangnama`, `c1`.`kkode` AS `sicustomerkode`, `c1`.`knama` AS `sicustomernama`, `c2`.`kkode` AS `sibagianpenjualankode`, `c2`.`knama` AS `sibagianpenjualannama`, `e`.`enama` AS `siekspedisinama`, `sq`.`sqnotransaksi` AS `sqnotransaksi`, `so`.`sonotransaksi` AS `sonotransaksi`, `pl`.`plnotransaksi` AS `plnotransaksi`, `do`.`donotransaksi` AS `donotransaksi`, `dr`.`drnotransaksi` AS `drnotransaksi`, `pi`.`pinotransaksi` AS `pinotransaksi`, `st1`.`nama` AS `sistatusnama`, `st2`.`nama` AS `sistatussebelumnyanama`, `u1`.`unama` AS `siinputusernama`, `u2`.`unama` AS `simodifikasiusernama`, `si`.`sijmluangmuka` AS `sijmluangmuka`, `si`.`sirekuangmuka` AS `sirekuangmuka`, `si`.`siidas` AS `siidas`, `as`.`asnotransaksi` AS `asnotransaksi`, `si`.`sisaldoawal` AS `sisaldoawal`, `si`.`sibayartunai` AS `sibayartunai`, `si`.`sibayarkkredit` AS `sibayarkkredit`, `si`.`sibayarkdebit` AS `sibayarkdebit`, `si`.`sibayarvoucher` AS `sibayarvoucher`, `si`.`sibayarpoin` AS `sibayarpoin`, `si`.`sibayarjmlpoin` AS `sibayarjmlpoin`, `si`.`sichargepersen` AS `sichargepersen`, `si`.`sicharge` AS `sicharge`, `si`.`sipoinsebelumnya` AS `sipoinsebelumnya`, `si`.`sipoindidapat` AS `sipoindidapat`, `si`.`sicustomarea` AS `sicustomarea`, `area`.`anama` AS `sicustomareanama`, si.siuploaded, si.sirekcharge, si.sijmlkembali, si.sirekkembali,(CASE si.siuploaded WHEN 1 THEN 'Sudah Upload' ELSE 'Belum Upload' END) as siuploadednama from `m5_si` `si` join m0_userlogin ul on ul.ulid = '{FixQuotes_paramSplit_0}' join m0_user u ON ul.uluser = u.userid and si.sicabang = u.ucabang and si.silokasi = u.ulokasi left join `m1_branch` `br` on `br`.`bkode` = `si`.`sicabang` left join `m1_location` `lc` on `lc`.`lkode` = `si`.`silokasi` left join `m1_warehouse` `wh` on `wh`.`wkode` = `si`.`sigudang` left join `m1_contact` `c1` on `c1`.`kid` = `si`.`sicustomer` left join `m1_contact` `c2` on `c2`.`kid` = `si`.`sibagianpenjualan` left join `m1_expedition` `e` on `si`.`siekspedisi` = `e`.`ekode` left join `m5_sq` `sq` on `si`.`siidsq` = `sq`.`sqid` left join `m5_so` `so` on `si`.`siidso` = `so`.`soid` left join `m5_pl` `pl` on `si`.`siidpl` = `pl`.`plid` left join `m5_do` `do` on `si`.`siiddo` = `do`.`doid` left join `m5_dr` `dr` on `si`.`siiddr` = `dr`.`drid` left join `m5_pi` `pi` on `si`.`siidpi` = `pi`.`piid` left join `m0_status` `st1` on `st1`.`kode` = `si`.`sistatus` left join `m0_status` `st2` on `st2`.`kode` = `si`.`sistatussebelumnya` left join `m0_user` `u1` on `u1`.`userid` = `si`.`siinputuser` left join `m0_user` `u2` on `u2`.`userid` = `si`.`simodifikasiuser` left join `m5_as` `as` on `si`.`siidas` = `as`.`asid` left join `m_12_area` `area` on `si`.`sicustomarea` = `area`.`akode`
```

```sql
select `si`.`siid` AS `siid`, `si`.`sicabang` AS `sicabang`, `si`.`silokasi` AS `silokasi`, `si`.`sigudang` AS `sigudang`, `si`.`siasalbarang` AS `siasalbarang`, `si`.`siasalbarangkategori` AS `siasalbarangkategori`, `si`.`sijenispenjualan` AS `sijenispenjualan`, `si`.`sijenispenjualankategori` AS `sijenispenjualankategori`, `si`.`sicarabayar` AS `sicarabayar`, `si`.`sisumber` AS `sisumber`, `si`.`siautonotransaksi` AS `siautonotransaksi`, `si`.`sinotransaksi` AS `sinotransaksi`, `si`.`sitgl` AS `sitgl`, `si`.`sikodepa` AS `sikodepa`, `si`.`sicustomer` AS `sicustomer`, `si`.`sicustomerkontak` AS `sicustomerkontak`, `si`.`si1alamat1` AS `si1alamat1`, `si`.`si1alamat2` AS `si1alamat2`, `si`.`si1alamat3` AS `si1alamat3`, `si`.`si2alamat1` AS `si2alamat1`, `si`.`si2alamat2` AS `si2alamat2`, `si`.`si2alamat3` AS `si2alamat3`, `si`.`sibagianpenjualan` AS `sibagianpenjualan`, `si`.`siekspedisi` AS `siekspedisi`, `si`.`sitglkirim` AS `sitglkirim`, `si`.`sitermin` AS `sitermin`, `si`.`sitgljatuhtempo` AS `sitgljatuhtempo`, `si`.`siuraian` AS `siuraian`, `si`.`sicatatan` AS `sicatatan`, `si`.`sinoref` AS `sinoref`, `si`.`sitglnoref` AS `sitglnoref`, `si`.`sitglpenutupan` AS `sitglpenutupan`, `si`.`simatauang` AS `simatauang`, `si`.`sikurs` AS `sikurs`, `si`.`sihargatermasukpajak` AS `sihargatermasukpajak`, `si`.`sitotal` AS `sitotal`, `si`.`sidiskonpersen` AS `sidiskonpersen`, `si`.`sijmldiskon` AS `sijmldiskon`, `si`.`sitotalpajak1detail` AS `sitotalpajak1detail`, `si`.`sitotalpajak2detail` AS `sitotalpajak2detail`, `si`.`sibiayalainpersen` AS `sibiayalainpersen`, `si`.`sibiayalain` AS `sibiayalain`, `si`.`sitotaltransaksi` AS `sitotaltransaksi`, `si`.`sijmlbayar` AS `sijmlbayar`, `si`.`sistatuslunas` AS `sistatuslunas`, `si`.`sitgllunas` AS `sitgllunas`, `si`.`sinofakturpajak` AS `sinofakturpajak`, `si`.`sisdhbayarpajak` AS `sisdhbayarpajak`, `si`.`sitglbayarpajak` AS `sitglbayarpajak`, `si`.`sirekdiskon` AS `sirekdiskon`, `si`.`sirekpajak1` AS `sirekpajak1`, `si`.`sirekpajak2` AS `sirekpajak2`, `si`.`sirekbiayalain` AS `sirekbiayalain`, `si`.`sirekbayar` AS `sirekbayar`, `si`.`siidsq` AS `siidsq`, `si`.`siidso` AS `siidso`, `si`.`siidpl` AS `siidpl`, `si`.`siiddo` AS `siiddo`, `si`.`siiddr` AS `siiddr`, `si`.`siidpi` AS `siidpi`, `si`.`sistatusrnr` AS `sistatusrnr`, `si`.`sistatussr` AS `sistatussr`, `si`.`sistatusrealisasi` AS `sistatusrealisasi`, `si`.`sistatus` AS `sistatus`, `si`.`sistatussebelumnya` AS `sistatussebelumnya`, `si`.`sijmlrevisi` AS `sijmlrevisi`, `si`.`sicetakanke` AS `sicetakanke`, `si`.`siinputuser` AS `siinputuser`, `si`.`siinputtgl` AS `siinputtgl`, `si`.`simodifikasiuser` AS `simodifikasiuser`, `si`.`simodifikasitgl` AS `simodifikasitgl`, `si`.`siposting` AS `siposting`, `si`.`sipostingtgl` AS `sipostingtgl`, `si`.`situtupperiode` AS `situtupperiode`, `si`.`siisclose` AS `siisclose`, `br`.`bnama` AS `sicabangnama`, `lc`.`lnama` AS `silokasinama`, `wh`.`wnama` AS `sigudangnama`, `c1`.`kkode` AS `sicustomerkode`, `c1`.`knama` AS `sicustomernama`, `c2`.`kkode` AS `sibagianpenjualankode`, `c2`.`knama` AS `sibagianpenjualannama`, `e`.`enama` AS `siekspedisinama`, `sq`.`sqnotransaksi` AS `sqnotransaksi`, `so`.`sonotransaksi` AS `sonotransaksi`, `pl`.`plnotransaksi` AS `plnotransaksi`, `do`.`donotransaksi` AS `donotransaksi`, `dr`.`drnotransaksi` AS `drnotransaksi`, `pi`.`pinotransaksi` AS `pinotransaksi`, `st1`.`nama` AS `sistatusnama`, `st2`.`nama` AS `sistatussebelumnyanama`, `u1`.`unama` AS `siinputusernama`, `u2`.`unama` AS `simodifikasiusernama`, `si`.`sijmluangmuka` AS `sijmluangmuka`, `si`.`sirekuangmuka` AS `sirekuangmuka`, `si`.`siidas` AS `siidas`, `as`.`asnotransaksi` AS `asnotransaksi`, `si`.`sisaldoawal` AS `sisaldoawal`, `si`.`sibayartunai` AS `sibayartunai`, `si`.`sibayarkkredit` AS `sibayarkkredit`, `si`.`sibayarkdebit` AS `sibayarkdebit`, `si`.`sibayarvoucher` AS `sibayarvoucher`, `si`.`sibayarpoin` AS `sibayarpoin`, `si`.`sibayarjmlpoin` AS `sibayarjmlpoin`, `si`.`sichargepersen` AS `sichargepersen`, `si`.`sicharge` AS `sicharge`, `si`.`sipoinsebelumnya` AS `sipoinsebelumnya`, `si`.`sipoindidapat` AS `sipoindidapat`, `si`.`sicustomarea` AS `sicustomarea`, `area`.`anama` AS `sicustomareanama`, si.siuploaded, si.sirekcharge, si.sijmlkembali, si.sirekkembali,(CASE si.siuploaded WHEN 1 THEN 'Sudah Upload' ELSE 'Belum Upload' END) as siuploadednama from `m5_si` `si` join m0_userlogin ul on ul.ulid = '{FixQuotes_paramSplit_0}' join m0_user_branch ub on ul.uluser = ub.userid and si.sicabang = ub.cabang join m0_user_location uloc on ul.uluser = uloc.userid and si.silokasi = uloc.lokasi left join `m1_branch` `br` on `br`.`bkode` = `si`.`sicabang` left join `m1_location` `lc` on `lc`.`lkode` = `si`.`silokasi` left join `m1_warehouse` `wh` on `wh`.`wkode` = `si`.`sigudang` left join `m1_contact` `c1` on `c1`.`kid` = `si`.`sicustomer` left join `m1_contact` `c2` on `c2`.`kid` = `si`.`sibagianpenjualan` left join `m1_expedition` `e` on `si`.`siekspedisi` = `e`.`ekode` left join `m5_sq` `sq` on `si`.`siidsq` = `sq`.`sqid` left join `m5_so` `so` on `si`.`siidso` = `so`.`soid` left join `m5_pl` `pl` on `si`.`siidpl` = `pl`.`plid` left join `m5_do` `do` on `si`.`siiddo` = `do`.`doid` left join `m5_dr` `dr` on `si`.`siiddr` = `dr`.`drid` left join `m5_pi` `pi` on `si`.`siidpi` = `pi`.`piid` left join `m0_status` `st1` on `st1`.`kode` = `si`.`sistatus` left join `m0_status` `st2` on `st2`.`kode` = `si`.`sistatussebelumnya` left join `m0_user` `u1` on `u1`.`userid` = `si`.`siinputuser` left join `m0_user` `u2` on `u2`.`userid` = `si`.`simodifikasiuser` left join `m5_as` `as` on `si`.`siidas` = `as`.`asid` left join `m_12_area` `area` on `si`.`sicustomarea` = `area`.`akode`
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_st.vb`

```sql
SELECT COUNT(stid), stnotransaksi FROM M_12_St WHERE stid=
```

```sql
SELECT COUNT(stid) FROM M_12_St WHERE stnotransaksi='{notransaksi}'
```

```sql
Update M_12_St set stcabang = '{FixQuotes_drutama}stcabang', stlokasi = '{FixQuotes_drutama}stlokasi', stsumber = '{FixQuotes_drutama}stsumber', stkategoripos = '{FixQuotes_drutama}stkategoripos', stautonotransaksi = {drutama}stautonotransaksi, stnotransaksi = '{FixQuotes_drutama}stnotransaksi', sttgl = '{FixQuotes_AsFormatTanggal_drutama}sttgl', stkodepa = '{FixQuotes_drutama}stkodepa', stkontak = '{FixQuotes_drutama}stkontak', stkontakperson = '{FixQuotes_drutama}stkontakperson', sturaian = '{FixQuotes_drutama}sturaian', stcatatan = '{FixQuotes_drutama}stcatatan', ststatus = {drutama}ststatus, ststatussebelumnya = {drutama}ststatussebelumnya, stjmlrevisi = {drutama}stjmlrevisi, stcetakanke = {drutama}stcetakanke, stisclose = {drutama}stisclose, stmodifikasiuser = '{FixQuotes_drutama}stmodifikasiuser', stmodifikasitgl = NOW(), stposting = {drutama}stposting, stpostingtgl = '{FixQuotes_AsFormatTanggal_drutama}stpostingtglyyyy-MM-dd H:mm:ss', stcustomtext1 = '{FixQuotes_drutama}stcustomtext1', stcustomtext2 = '{FixQuotes_drutama}stcustomtext2', stcustomtext3 = '{FixQuotes_drutama}stcustomtext3', stcustomtext4 = '{FixQuotes_drutama}stcustomtext4', stcustomtext5 = '{FixQuotes_drutama}stcustomtext5', stcustomint1 = {drutama}stcustomint1, stcustomint2 = {drutama}stcustomint2, stcustomint3 = {drutama}stcustomint3, stcustomdbl1 = '{FixDouble_drutama}stcustomdbl1', stcustomdbl2 = '{FixDouble_drutama}stcustomdbl2', stcustomdbl3 = '{FixDouble_drutama}stcustomdbl3', stcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}stcustomdate1', stcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}stcustomdate2', stcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}stcustomdate3', stjenispoint = '{FixQuotes_drutama}stjenispoint' where stid = {drutama}stid
```

```sql
SELECT COUNT(stid) FROM m_12_st WHERE stnotransaksi='{notransaksi}'
```

```sql
Insert into M_12_st (stcabang, stlokasi, stsumber, stkategoripos, stautonotransaksi, stnotransaksi, sttgl, stkodepa, stkontak, stkontakperson, sturaian, stcatatan, ststatus, ststatussebelumnya, stjmlrevisi, stcetakanke, stisclose, stinputuser, stinputtgl, stposting, stpostingtgl, stcustomtext1, stcustomtext2, stcustomtext3, stcustomtext4, stcustomtext5, stcustomint1, stcustomint2, stcustomint3, stcustomdbl1, stcustomdbl2, stcustomdbl3, stcustomdate1, stcustomdate2, stcustomdate3, stjenispoint) values('{FixQuotes_drutama}stcabang', '{FixQuotes_drutama}stlokasi', '{FixQuotes_drutama}stsumber', '{FixQuotes_drutama}stkategoripos', {drutama}stautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}sttgl', '{FixQuotes_drutama}stkodepa', '{FixQuotes_drutama}stkontak', '{FixQuotes_drutama}stkontakperson', '{FixQuotes_drutama}sturaian', '{FixQuotes_drutama}stcatatan', {drutama}ststatus, {drutama}ststatussebelumnya, {drutama}stjmlrevisi, {drutama}stcetakanke, {drutama}stisclose, '{FixQuotes_drutama}stinputuser', NOW(), 0, '1971-01-01 00:00:00', '{FixQuotes_drutama}stcustomtext1', '{FixQuotes_drutama}stcustomtext2', '{FixQuotes_drutama}stcustomtext3', '{FixQuotes_drutama}stcustomtext4', '{FixQuotes_drutama}stcustomtext5', {drutama}stcustomint1, {drutama}stcustomint2, {drutama}stcustomint3, '{FixDouble_drutama}stcustomdbl1', '{FixDouble_drutama}stcustomdbl2', '{FixDouble_drutama}stcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}stcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}stcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}stcustomdate3', '{FixQuotes_drutama}stjenispoint')
```

```sql
select stid from M_12_st where stnotransaksi='{notransaksi}' AND stinputuser= '{drutama}stinputuser' order by stmodifikasitgl desc limit 1
```

```sql
Delete from M_12_St_Detail where idst =
```

```sql
Insert into M_12_St_Detail(idstdetail, idst, stkategori, idbarang, operator, jml1, jml2, nilai, tgl1, tgl2, jam1, jam2, catatan, urutan, customtext1, customtext2, customtext3, customtext4, customtext5, customint1, customint2, customint3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, nopromo) values{strValue2_ToString}
```

```sql
Delete From m_12_pos_point_item where pikategori = '{drutama}stkategoripos'
```

```sql
Delete From m_12_pos_point_transaction where ptkategori = '{drutama}stkategoripos'
```

```sql
select * from M_12_ST_Detail where idst = '{result_4}' order by idst asc
```

```sql
Insert into M_12_Pos_Point_Item(pikategori, piidbarang, pioperator, pijml1, pijml2, pijmlpoint, pitgl1, pitgl2, picustomtext1, picustomtext2, picustomtext3, picustomtext4, picustomtext5, picustomint1, picustomint2, picustomint3, picustomdbl1, picustomdbl2, picustomdbl3, picustomdate1, picustomdate2, picustomdate3, pinopromo) values{strInsertPoint_ToString}
```

```sql
Insert into M_12_Pos_Point_Transaction(ptkategori, ptoperator, ptjml1, ptjml2, ptjmlpoint, pttgl1, pttgl2, ptcustomtext1, ptcustomtext2, ptcustomtext3, ptcustomtext4, ptcustomtext5, ptcustomint1, ptcustomint2, ptcustomint3, ptcustomdbl1, ptcustomdbl2, ptcustomdbl3, ptcustomdate1, ptcustomdate2, ptcustomdate3, ptnopromo) values{strInsertPoint_ToString}
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Sttgl, Stnotransaksi, Ststatus FROM m_12_St WHERE Stid='{idtransaksi}'
```

```sql
SELECT * FROM M_12_St WHERE stid=
```

```sql
SELECT * FROM M_12_St_Detail WHERE idst=
```

```sql
Delete from M_12_pos_point_item WHERE pikategori='{drutama}stkategoripos' AND pinopromo = '{drutama}stnotransaksi'
```

```sql
Delete from M_12_pos_point_transaction WHERE ptkategori='{drutama}stkategoripos' AND ptnopromo = '{drutama}stnotransaksi'
```

```sql
Delete from M_12_Bi_Detail WHERE idbidetail=
```

```sql
SELECT Bistatussebelumnya FROM M_12_Bi WHERE biid=
```

```sql
UPDATE M_12_St SET Ststatus = {nilaiStatus}, stmodifikasiuser='{userid}', stmodifikasitgl = NOW(), stposting = 0, stpostingtgl = '1971-01-01 00:00:00', Stjmlrevisi = Stjmlrevisi + 1 WHERE stid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT stid, stnotransaksi FROM m_12_st WHERE stid='{idtransaksi}'
```

```sql
DELETE FROM M_12_St_Detail WHERE idst = '{idtransaksi}'
```

```sql
DELETE FROM M_12_St WHERE stid = '{idtransaksi}'
```

```sql
select `st`.`stid` AS `stid`,`st`.`stcabang` AS `stcabang`,`st`.`stlokasi` AS `stlokasi`,`st`.`stsumber` AS `stsumber`,`st`.`stkategoripos` AS `stkategoripos`,`st`.`stautonotransaksi` AS `stautonotransaksi`,`st`.`stnotransaksi` AS `stnotransaksi`,`st`.`sttgl` AS `sttgl`,`st`.`stkodepa` AS `stkodepa`,`st`.`stkontak` AS `stkontak`,`st`.`stkontakperson` AS `stkontakperson`,`st`.`sturaian` AS `sturaian`,`st`.`stcatatan` AS `stcatatan`,`st`.`ststatus` AS `ststatus`,`st`.`ststatussebelumnya` AS `ststatussebelumnya`,`st`.`stjmlrevisi` AS `stjmlrevisi`,`st`.`stcetakanke` AS `stcetakanke`,`st`.`stisclose` AS `stisclose`,`st`.`stinputuser` AS `stinputuser`,`st`.`stinputtgl` AS `stinputtgl`,`st`.`stmodifikasiuser` AS `stmodifikasiuser`,`st`.`stmodifikasitgl` AS `stmodifikasitgl`,`st`.`stposting` AS `stposting`,`st`.`stpostingtgl` AS `stpostingtgl`,`st`.`stcustomtext1` AS `stcustomtext1`,`st`.`stcustomtext2` AS `stcustomtext2`,`st`.`stcustomtext3` AS `stcustomtext3`,`st`.`stcustomtext4` AS `stcustomtext4`,`st`.`stcustomtext5` AS `stcustomtext5`,`st`.`stcustomint1` AS `stcustomint1`,`st`.`stcustomint2` AS `stcustomint2`,`st`.`stcustomint3` AS `stcustomint3`,`st`.`stcustomdbl1` AS `stcustomdbl1`,`st`.`stcustomdbl2` AS `stcustomdbl2`,`st`.`stcustomdbl3` AS `stcustomdbl3`,`st`.`stcustomdate1` AS `stcustomdate1`,`st`.`stcustomdate2` AS `stcustomdate2`,`st`.`stcustomdate3` AS `stcustomdate3`,`br`.`bnama` AS `stcabangnama`,`lc`.`lnama` AS `stlokasinama`,`c`.`kkode` AS `stkontakkode`,`c`.`knama` AS `stkontaknama`,`st1`.`nama` AS `ststatusnama`,`st2`.`nama` AS `ststatussebelumnyanama`,`u1`.`unama` AS `stinputusernama`,`u2`.`unama` AS `stmodifikasiusernama`,`pc`.`pcnama` AS `stkategoriposnama`,`st`.`stjenispoint` AS `stjenispoint`,`std`.`idstdetail` AS `idstdetail`,`std`.`idst` AS `idst`,`std`.`stkategori` AS `stkategori`,`std`.`idbarang` AS `idbarang`,`std`.`operator` AS `operator`,`std`.`jml1` AS `jml1`,`std`.`jml2` AS `jml2`,`std`.`nilai` AS `nilai`,`std`.`customtext1` AS `customtext1`,`std`.`customtext2` AS `customtext2`,`std`.`customtext3` AS `customtext3`,`std`.`customtext4` AS `customtext4`,`std`.`customtext5` AS `customtext5`,`std`.`customint1` AS `customint1`,`std`.`customint2` AS `customint2`,`std`.`customint3` AS `customint3`,`std`.`customdbl1` AS `customdbl1`,`std`.`customdbl2` AS `customdbl2`,`std`.`customdbl3` AS `customdbl3`,`std`.`customdate1` AS `customdate1`,`std`.`customdate2` AS `customdate2`,`std`.`customdate3` AS `customdate3`,`std`.`tgl1` AS `tgl1`,`std`.`tgl2` AS `tgl2`,`std`.`nopromo` AS `nopromo`,`std`.`jam1` AS `jam1`,`std`.`jam2` AS `jam2`,`i`.`bkode` AS `kodebarang`,`i`.`bnama` AS `namabarang`, `std`.`catatan` AS `catatan`, `std`.`urutan` AS `urutan` from ((((((((((`m_12_st` `st` join `m_12_st_detail` `std` on((`st`.`stid` = `std`.`idst`))) left join `m1_branch` `br` on((`st`.`stcabang` = `br`.`bkode`))) left join `m1_location` `lc` on((`st`.`stlokasi` = `lc`.`lkode`))) left join `m1_contact` `c` on((`st`.`stkontak` = `c`.`kid`))) left join `m0_status` `st1` on((`st`.`ststatus` = `st1`.`kode`))) left join `m0_status` `st2` on((`st`.`ststatussebelumnya` = `st2`.`kode`))) left join `m0_user` `u1` on((`st`.`stinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`st`.`stmodifikasiuser` = `u2`.`userid`))) left join `m1_item` `i` on((`std`.`idbarang` = `i`.`bid`))) left join `m_12_pos_category` `pc` on((`st`.`stkategoripos` = `pc`.`pckode`)))
```

```sql
select `st`.`stid` AS `stid`, `st`.`stcabang` AS `stcabang`, `st`.`stlokasi` AS `stlokasi`, `st`.`stsumber` AS `stsumber`, `st`.`stautonotransaksi` AS `stautonotransaksi`, `st`.`stnotransaksi` AS `stnotransaksi`, `st`.`sttgl` AS `sttgl`, `st`.`stkodepa` AS `stkodepa`, `st`.`stkontak` AS `stkontak`, `st`.`stkontakperson` AS `stkontakperson`, `st`.`stkategoripos` AS `stkategoripos`, `st`.`sturaian` AS `sturaian`, `st`.`stcatatan` AS `stcatatan`, `st`.`ststatus` AS `ststatus`, `st`.`ststatussebelumnya` AS `ststatussebelumnya`, `st`.`stjmlrevisi` AS `stjmlrevisi`, `st`.`stcetakanke` AS `stcetakanke`, `st`.`stisclose` AS `stisclose`, `st`.`stinputuser` AS `stinputuser`, `st`.`stinputtgl` AS `stinputtgl`, `st`.`stmodifikasiuser` AS `stmodifikasiuser`, `st`.`stmodifikasitgl` AS `stmodifikasitgl`, `st`.`stposting` AS `stposting`, `st`.`stpostingtgl` AS `stpostingtgl`, `st`.`stcustomtext1` AS `stcustomtext1`, `st`.`stcustomtext2` AS `stcustomtext2`, `st`.`stcustomtext3` AS `stcustomtext3`, `st`.`stcustomtext4` AS `stcustomtext4`, `st`.`stcustomtext5` AS `stcustomtext5`, `st`.`stcustomint1` AS `stcustomint1`, `st`.`stcustomint2` AS `stcustomint2`, `st`.`stcustomint3` AS `stcustomint3`, `st`.`stcustomdbl1` AS `stcustomdbl1`, `st`.`stcustomdbl2` AS `stcustomdbl2`, `st`.`stcustomdbl3` AS `stcustomdbl3`, `st`.`stcustomdate1` AS `stcustomdate1`, `st`.`stcustomdate2` AS `stcustomdate2`, `st`.`stcustomdate3` AS `stcustomdate3`, `br`.`bnama` AS `stcabangnama`, `lc`.`lnama` AS `stlokasinama`, `c`.`kkode` AS `stkontakkode`, `c`.`knama` AS `stkontaknama`, `st1`.`nama` AS `ststatusnama`, `st2`.`nama` AS `ststatussebelumnyanama`, `u1`.`unama` AS `stinputusernama`, `u2`.`unama` AS `stmodifikasiusernama` from (((((((`m_12_st` `st` left join `m1_branch` `br` on((`st`.`stcabang` = `br`.`bkode`))) left join `m1_location` `lc` on((`st`.`stlokasi` = `lc`.`lkode`))) left join `m1_contact` `c` on((`st`.`stkontak` = `c`.`kid`))) left join `m0_status` `st1` on((`st`.`ststatus` = `st1`.`kode`))) left join `m0_status` `st2` on((`st`.`ststatussebelumnya` = `st2`.`kode`))) left join `m0_user` `u1` on((`st`.`stinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`st`.`stmodifikasiuser` = `u2`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m12/m12_upload.vb`

```sql
update m_12_pos_voucher_in vi join m0_si_pay sid on vi.vikode = sid.noacbank AND sid.carabayar = 6 SET vi.vijmlbayar = sid.jumlah, vijmlbayarvalas = sid.jumlahvalas
```

```sql
INSERT INTO m_12_pos_voucher_out (SELECT si.sicustomer as cpidkontak, SUM(si.sipoindidapat - si.sibayarpoin) as cppoin, '' as cpcustomtext1, '' as cpcustomtext2, '' as cpcustomtext3, '' as cpcustomtext4, '' as cpcustomtext5, '0' as cpcustomint1, '0' as cpcustomint2, '0' as cpcustomint3, '0' as cpcustomdbl1, '0' as cpcustomdbl2, '0' as cpcustomdbl3, '1900-01-01' as cpcustomdate1, '1900-01-01' as cpcustomdate2, '1900-01-01' as cpcustomdate3 FROM m0_si si WHERE si.siid in {Filter} GROUP BY si.sicustomer) ON DUPLICATE KEY UPDATE cppoin = cppoin + VALUES(cppoin)
```

```sql
UPDATE m1_contact_point SET cppoin = 0; INSERT INTO m1_contact_point(SELECT cpad.kontak as cpidkontak, SUM(cpad.poinmasuk - cpad.poinkeluar) as cppoin, '' as cpcustomtext1, '' as cpcustomtext2, '' as cpcustomtext3, '' as cpcustomtext4, '' as cpcustomtext5, '0' as cpcustomint1, '0' as cpcustomint2, '0' as cpcustomint3, '0' as cpcustomdbl1, '0' as cpcustomdbl2, '0' as cpcustomdbl3, '1900-01-01' as cpcustomdate1, '1900-01-01' as cpcustomdate2, '1900-01-01' as cpcustomdate3 FROM m_12_cpa cpa JOIN m_12_cpa_detail cpad ON cpa.cpaid = cpad.idcpa AND cpa.cpastatus IN(2,3,4,7) GROUP BY cpad.kontak) ON DUPLICATE KEY UPDATE cppoin = cppoin + VALUES(cppoin); INSERT INTO m1_contact_point (SELECT si.sicustomer as cpidkontak, SUM(si.sipoindidapat - si.sibayarpoin) as cppoin, '' as cpcustomtext1, '' as cpcustomtext2, '' as cpcustomtext3, '' as cpcustomtext4, '' as cpcustomtext5, '0' as cpcustomint1, '0' as cpcustomint2, '0' as cpcustomint3, '0' as cpcustomdbl1, '0' as cpcustomdbl2, '0' as cpcustomdbl3, '1900-01-01' as cpcustomdate1, '1900-01-01' as cpcustomdate2, '1900-01-01' as cpcustomdate3 FROM m5_si si WHERE si.sistatus IN(2,3,4,7) GROUP BY si.sicustomer) ON DUPLICATE KEY UPDATE cppoin = cppoin + VALUES(cppoin);
```

