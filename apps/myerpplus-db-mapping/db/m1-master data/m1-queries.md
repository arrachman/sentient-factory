# M1 Queries

Collected from `client-backend/api-myerpplus/app_code/ws/myerpplus.vb` dispatch targets under `app_code/ws/m1`.

Total queries: `731`

## `client-backend/api-myerpplus/app_code/ws/m1/m1_accident.vb`

```sql
SELECT COUNT(akode) FROM M1_Accident WHERE akode ='{dataUtama_0}'
```

```sql
Update M1_Accident set anama = '{FixQuotes_dataUtama_1}', acatatan = '{FixQuotes_dataUtama_2}', aaktif = {dataUtama_3}, amodifikasiuser = {dataUtama_6}, amodifikasitgl = NOW() where akode = '{dataUtama_0}'
```

```sql
Insert into M1_Accident (akode, anama, acatatan, aaktif, ainputuser, ainputtgl, amodifikasiuser, amodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Accident WHERE akode = '{idtransaksi}'
```

```sql
SELECT COUNT(akode) FROM m1_accident WHERE akode='{idtransaksi}'
```

```sql
DELETE FROM M1_Accident
```

```sql
Insert into M1_Accident(akode, anama, acatatan, aaktif, ainputuser, ainputtgl, amodifikasiuser, amodifikasitgl) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_accident_history.vb`

```sql
INSERT INTO m1_accident_history(SELECT 0, accident.* FROM m1_accident accident WHERE accident.akode = '{idtransaksi}')
```

```sql
SELECT `a`.`aidhistory` AS `aidhistory`,`a`.`akode` AS `akode`,`a`.`anama` AS `anama`,`a`.`acatatan` AS `acatatan`,`a`.`aaktif` AS `aaktif`,`a`.`ainputuser` AS `ainputuser`,`a`.`ainputtgl` AS `ainputtgl`,`a`.`amodifikasiuser` AS `amodifikasiuser`,`a`.`amodifikasitgl` AS `amodifikasitgl`,`ui`.`unama` AS `ainputusernama`,`um`.`unama` AS `amodifikasiusernama` FROM ((`m1_accident_history` `a` LEFT JOIN `m0_user` `ui` ON ((`a`.`ainputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`a`.`amodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_area.vb`

```sql
SELECT COUNT(akode) FROM M1_Area WHERE akode ='{dataUtama_0}'
```

```sql
Update M1_Area set anama = '{FixQuotes_dataUtama_1}', acatatan = '{FixQuotes_dataUtama_2}', aaktif = {dataUtama_3}, amodifikasiuser = {dataUtama_6}, amodifikasitgl = NOW() where akode = '{dataUtama_0}'
```

```sql
Insert into M1_Area (akode, anama, acatatan, aaktif, ainputuser, ainputtgl, amodifikasiuser, amodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Area WHERE akode = '{idtransaksi}'
```

```sql
SELECT COUNT(akode) FROM m1_area WHERE akode='{idtransaksi}'
```

```sql
DELETE FROM M1_Area
```

```sql
Insert into M1_Area(akode, anama, acatatan, aaktif, ainputuser, ainputtgl, amodifikasiuser, amodifikasitgl) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_area_history.vb`

```sql
INSERT INTO m1_area_history(SELECT 0, area.* FROM m1_area area WHERE area.akode = '{idtransaksi}')
```

```sql
SELECT `a`.`aidhistory` AS `aidhistory`,`a`.`akode` AS `akode`,`a`.`anama` AS `anama`,`a`.`acatatan` AS `acatatan`,`a`.`aaktif` AS `aaktif`,`a`.`ainputuser` AS `ainputuser`,`a`.`ainputtgl` AS `ainputtgl`,`a`.`amodifikasiuser` AS `amodifikasiuser`,`a`.`amodifikasitgl` AS `amodifikasitgl`,`ui`.`unama` AS `ainputusernama`,`um`.`unama` AS `amodifikasiusernama` FROM ((`m1_area_history` `a` LEFT JOIN `m0_user` `ui` ON ((`a`.`ainputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`a`.`amodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_bank.vb`

```sql
SELECT COUNT(bkode) FROM M1_Bank WHERE bkode ='{dataUtama_0}'
```

```sql
Update M1_Bank set bnama = '{FixQuotes_dataUtama_1}', balamat = '{FixQuotes_dataUtama_2}', bkota = '{FixQuotes_dataUtama_3}', bnotelp = '{FixQuotes_dataUtama_4}', bnofax = '{FixQuotes_dataUtama_5}', bcatatan = '{FixQuotes_dataUtama_6}', baktif = {dataUtama_7}, bmodifikasiuser = {dataUtama_10}, bmodifikasitgl = NOW(), bcustomtext1 = '{FixQuotes_dataUtama_12}', bcustomtext2 = '{FixQuotes_dataUtama_13}', bcustomtext3 = '{FixQuotes_dataUtama_14}', bcustomtext4 = '{FixQuotes_dataUtama_15}', bcustomtext5 = '{FixQuotes_dataUtama_16}', bcustomint1 = '{FixQuotes_dataUtama_17}', bcustomint2 = '{FixQuotes_dataUtama_18}', bcustomint3 = '{FixQuotes_dataUtama_19}', bcustomdbl1 = '{FixQuotes_dataUtama_20}', bcustomdbl2 = '{FixQuotes_dataUtama_21}', bcustomdbl3 = '{FixQuotes_dataUtama_22}', bcustomdate1 = '{FixQuotes_AsFormatTanggal_dataUtama_23}', bcustomdate2 = '{FixQuotes_AsFormatTanggal_dataUtama_24}', bcustomdate3 = '{FixQuotes_AsFormatTanggal_dataUtama_25}' where bkode = '{dataUtama_0}'
```

```sql
Insert into M1_Bank (bkode, bnama, balamat, bkota, bnotelp, bnofax, bcatatan, baktif, binputuser, binputtgl, bmodifikasiuser, bmodifikasitgl,bcustomtext1, bcustomtext2, bcustomtext3, bcustomtext4, bcustomtext5, bcustomint1, bcustomint2, bcustomint3, bcustomdbl1, bcustomdbl2, bcustomdbl3, bcustomdate1, bcustomdate2, bcustomdate3) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', '{FixQuotes_dataUtama_4}', '{FixQuotes_dataUtama_5}', '{FixQuotes_dataUtama_6}', {dataUtama_7}, {dataUtama_8}, NOW(), {dataUtama_10}, '1971-01-01 00:00:00', '{FixQuotes_dataUtama_12}', '{FixQuotes_dataUtama_13}', '{FixQuotes_dataUtama_14}', '{FixQuotes_dataUtama_15}', '{FixQuotes_dataUtama_16}', '{FixQuotes_dataUtama_17}', '{FixQuotes_dataUtama_18}', '{FixQuotes_dataUtama_19}', '{FixQuotes_dataUtama_20}', '{FixQuotes_dataUtama_21}', '{FixQuotes_dataUtama_22}', '{FixQuotes_AsFormatTanggal_dataUtama_23}', '{FixQuotes_AsFormatTanggal_dataUtama_24}', '{FixQuotes_AsFormatTanggal_dataUtama_25}')
```

```sql
DELETE FROM M1_Bank WHERE bkode = '{idtransaksi}'
```

```sql
SELECT COUNT(bkode) FROM m1_bank WHERE bkode='{idtransaksi}'
```

```sql
DELETE FROM M1_Bank
```

```sql
Insert into M1_Bank(bkode, bnama, balamat, bkota, bnotelp, bnofax, bcatatan, baktif, binputuser, binputtgl, bmodifikasiuser, bmodifikasitgl) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_bank_history.vb`

```sql
INSERT INTO m1_bank_history(SELECT 0, bank.* FROM m1_bank bank WHERE bank.bkode = '{idtransaksi}')
```

```sql
SELECT `b`.`bidhistory` AS `bidhistory`,`b`.`bkode` AS `bkode`,`b`.`bnama` AS `bnama`,`b`.`balamat` AS `balamat`,`b`.`bkota` AS `bkota`,`b`.`bnotelp` AS `bnotelp`,`b`.`bnofax` AS `bnofax`,`b`.`bcatatan` AS `bcatatan`,`b`.`baktif` AS `baktif`,`b`.`binputuser` AS `binputuser`,`b`.`binputtgl` AS `binputtgl`,`b`.`bmodifikasiuser` AS `bmodifikasiuser`,`b`.`bmodifikasitgl` AS `bmodifikasitgl`,`ui`.`unama` AS `binputusernama`,`um`.`unama` AS `bmodifikasiusernama`, b.bcustomtext1, b.bcustomtext2, b.bcustomtext3, b.bcustomtext4, b.bcustomtext5, b.bcustomint1, b.bcustomint2, b.bcustomint3, b.bcustomdbl1, b.bcustomdbl2, b.bcustomdbl3, b.bcustomdate1, b.bcustomdate2, b.bcustomdate3 FROM ((`m1_bank_history` `b` LEFT JOIN `m0_user` `ui` ON ((`b`.`binputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`b`.`bmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_bed.vb`

```sql
SELECT COUNT(bkode) FROM M1_Bed WHERE bkode='{dataUtama_0}'
```

```sql
Update M1_Bed set bkamar = '{FixQuotes_dataUtama_1}', bnama = '{FixQuotes_dataUtama_2}', bcatatan = '{FixQuotes_dataUtama_3}', baktif = {dataUtama_4}, bisclose = {dataUtama_5}, bmodifikasiuser = {dataUtama_8}, bmodifikasitgl = NOW() where bkode = '{dataUtama_0}'
```

```sql
Insert into M1_Bed (bkode, bkamar, bnama, bcatatan, baktif, bisclose, binputuser, binputtgl, bmodifikasiuser, bmodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', {dataUtama_4}, {dataUtama_5}, {dataUtama_6}, NOW(), {dataUtama_8}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Bed WHERE bkode = '{idtransaksi}'
```

```sql
select `b`.`bkode` AS `bkode`,`b`.`bkamar` AS `bkamar`,`b`.`bnama` AS `bnama`,`b`.`bcatatan` AS `bcatatan`,`b`.`baktif` AS `baktif`,`b`.`bisclose` AS `bisclose`,`b`.`binputuser` AS `binputuser`,`b`.`binputtgl` AS `binputtgl`,`b`.`bmodifikasiuser` AS `bmodifikasiuser`,`b`.`bmodifikasitgl` AS `bmodifikasitgl`,`r`.`rnama` AS `bkamarnama` from (`m1_bed` `b` left join `m1_room` `r` on((`b`.`bkamar` = `r`.`rkode`)))
```

```sql
SELECT COUNT(bkode) FROM m1_bed WHERE bkode='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_bed_history.vb`

```sql
INSERT INTO m1_bed_history(SELECT 0, bed.* FROM m1_bed bed WHERE bed.bkode = '{idtransaksi}')
```

```sql
SELECT `b`.`bidhistory` AS `bidhistory`,`b`.`bkode` AS `bkode`,`b`.`bkamar` AS `bkamar`,`b`.`bnama` AS `bnama`,`b`.`bcatatan` AS `bcatatan`,`b`.`baktif` AS `baktif`,`b`.`bisclose` AS `bisclose`,`b`.`binputuser` AS `binputuser`,`b`.`binputtgl` AS `binputtgl`,`r`.`rnama` AS `bkamarnama`,`b`.`bmodifikasiuser` AS `bmodifikasiuser`,`b`.`bmodifikasitgl` AS `bmodifikasitgl`,`ui`.`unama` AS `binputusernama`,`um`.`unama` AS `bmodifikasiusernama` FROM (((`m1_bed_history` `b` LEFT JOIN `m1_room` `r` ON ((`b`.`bkamar` = `r`.`rnama`)))LEFT JOIN `m0_user` `ui` ON ((`b`.`binputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`b`.`bmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_branch.vb`

```sql
SELECT COUNT(bkode) FROM M1_Branch WHERE bkode ='{dataUtama_0}'
```

```sql
Update M1_Branch set bnama = '{FixQuotes_dataUtama_1}', balamat1 = '{FixQuotes_dataUtama_2}', balamat2 = '{FixQuotes_dataUtama_3}', bkota = '{FixQuotes_dataUtama_4}', bkodepos = '{FixQuotes_dataUtama_5}', bnotelp = '{FixQuotes_dataUtama_6}', bnofax = '{FixQuotes_dataUtama_7}', bcatatan = '{FixQuotes_dataUtama_8}', baktif = {dataUtama_9}, bmodifikasiuser = {dataUtama_12}, bmodifikasitgl = NOW() where bkode = '{dataUtama_0}'
```

```sql
Insert into M1_Branch (bkode, bnama, balamat1, balamat2, bkota, bkodepos, bnotelp, bnofax, bcatatan, baktif, binputuser, binputtgl, bmodifikasiuser, bmodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', '{FixQuotes_dataUtama_4}', '{FixQuotes_dataUtama_5}', '{FixQuotes_dataUtama_6}', '{FixQuotes_dataUtama_7}', '{FixQuotes_dataUtama_8}', {dataUtama_9}, {dataUtama_10}, NOW(), {dataUtama_12}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Branch WHERE bkode = '{idtransaksi}'
```

```sql
SELECT COUNT(bkode) FROM m1_branch WHERE bkode='{idtransaksi}'
```

```sql
DELETE FROM M1_Branch
```

```sql
Insert into M1_Branch(bkode, bnama, balamat1, balamat2, bkota, bkodepos, bnotelp, bnofax, bcatatan, baktif, binputuser, binputtgl, bmodifikasiuser, bmodifikasitgl) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_branch_history.vb`

```sql
INSERT INTO m1_branch_history(SELECT 0, branch.* FROM m1_branch branch WHERE branch.bkode = '{idtransaksi}')
```

```sql
SELECT `b`.`bidhistory` AS `bidhistory`,`b`.`bkode` AS `bkode`,`b`.`bnama` AS `bnama`,`b`.`balamat1` AS `balamat1`,`b`.`balamat2` AS `balamat2`,`b`.`bkota` AS `bkota`,`b`.`bkodepos` AS `bkodepos`,`b`.`bnotelp` AS `bnotelp`,`b`.`bnofax` AS `bnofax`,`b`.`bcatatan` AS `bcatatan`,`b`.`baktif` AS `baktif`,`b`.`binputuser` AS `binputuser`,`b`.`binputtgl` AS `binputtgl`,`b`.`bmodifikasiuser` AS `bmodifikasiuser`,`b`.`bmodifikasitgl` AS `bmodifikasitgl`,`ui`.`unama` AS `binputusernama`,`um`.`unama` AS `bmodifikasiusernama` FROM ((`m1_branch_history` `b` LEFT JOIN `m0_user` `ui` ON ((`b`.`binputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`b`.`bmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_checking_category.vb`

```sql
SELECT COUNT(ccid) FROM M1_Checking_Category WHERE ccid = '{dataUtama_0}'
```

```sql
Update M1_Checking_Category set ccnama = '{FixQuotes_dataUtama_1}', cccatatan = '{FixQuotes_dataUtama_2}', ccurutan = {dataUtama_3}, ccaktif = {dataUtama_4}, ccmodifikasiuser = '{FixQuotes_dataUtama_7}', ccmodifikasitgl = NOW() where ccid = '{dataUtama_0}'
```

```sql
Insert into M1_Checking_Category (ccnama, cccatatan, ccurutan, ccaktif, ccinputuser, ccinputtgl, ccmodifikasiuser, ccmodifikasitgl) values('{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, {dataUtama_4}, '{FixQuotes_dataUtama_5}', NOW(), '{0}', '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Checking_Category WHERE ccid = '{idtransaksi}'
```

```sql
SELECT cc.ccid, cc.ccnama, dc.dcsumber as sumber, dc.dcnotransaksi as idterkait FROM m1_checking_category cc JOIN m3_dc_check dcc ON cc.ccid = dcc.idkategoricheck JOIN m3_dc dc ON dcc.iddc = dc.dcid WHERE cc.ccid = 'valkode' GROUP BY dc.dcid
```

```sql
SELECT COUNT(ccnama) FROM m1_checking_category WHERE ccnama='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_checking_category_history.vb`

```sql
INSERT INTO m1_checking_category_history(SELECT 0, cc.* FROM m1_checking_category cc WHERE cc.ccid = '{idtransaksi}')
```

```sql
SELECT cch.ccidhistory, cch.ccid, cch.ccnama, cch.cccatatan, cch.ccurutan, cch.ccaktif, cch.ccinputuser, cch.ccinputtgl, cch.ccmodifikasiuser, cch.ccmodifikasitgl, u1.unama as ccinputusernama, u2.unama as ccmodifikasiusernama FROM m1_checking_category_history cch LEFT JOIN m0_user u1 ON cch.ccinputuser = u1.userid LEFT JOIN m0_user u2 ON cch.ccmodifikasiuser = u2.userid
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_city.vb`

```sql
SELECT COUNT(ckode) FROM M1_City WHERE ckode ='{dataUtama_0}'
```

```sql
Update M1_City set cnama = '{FixQuotes_dataUtama_1}', cpropinsi = '{FixQuotes_dataUtama_2}', ccatatan = '{FixQuotes_dataUtama_3}', caktif = {dataUtama_4}, cmodifikasiuser = {dataUtama_7}, cmodifikasitgl = NOW() where ckode = '{dataUtama_0}'
```

```sql
Insert into M1_City (ckode, cnama, cpropinsi, ccatatan, caktif, cinputuser, cinputtgl, cmodifikasiuser, cmodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', {dataUtama_4}, {dataUtama_5}, NOW(), {dataUtama_7}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_City WHERE ckode = '{idtransaksi}'
```

```sql
SELECT COUNT(ckode) FROM m1_city WHERE ckode='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_city_history.vb`

```sql
INSERT INTO m1_city_history(SELECT 0, city.* FROM m1_city city WHERE city.ckode = '{idtransaksi}')
```

```sql
SELECT `c`.`cidhistory` AS `cidhistory`,`c`.`ckode` AS `ckode`,`c`.`cnama` AS `cnama`,`c`.`cpropinsi` AS `cpropinsi`,`c`.`ccatatan` AS `ccatatan`,`c`.`caktif` AS `caktif`,`c`.`cinputuser` AS `cinputuser`,`c`.`cinputtgl` AS `cinputtgl`,`c`.`cmodifikasiuser` AS `cmodifikasiuser`,`c`.`cmodifikasitgl` AS `cmodifikasitgl`,`ui`.`unama` AS `cinputusernama`,`um`.`unama` AS `cmodifikasiusernama` FROM ((`m1_city_history` `c` LEFT JOIN `m0_user` `ui` ON ((`c`.`cinputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`c`.`cmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_class.vb`

```sql
Insert into M1_Class(ckode, cnama, ccatatan, caktif, cinputuser, cinputtgl, cmodifikasiuser, cmodifikasitgl, ccustomtext1, ccustomtext2, ccustomtext3, ccustomtext4, ccustomtext5, ccustomint1, ccustomint2, ccustomint3, ccustomdbl1, ccustomdbl2, ccustomdbl3, ccustomdate1, ccustomdate2, ccustomdate3, cindexbarcode) values{strValue2_ToString} ON DUPLICATE KEY UPDATE cnama = VALUES(cnama), ccatatan = VALUES(ccatatan), caktif = VALUES(caktif), cmodifikasiuser = VALUES(cmodifikasiuser), cmodifikasitgl = NOW(), ccustomtext1 = VALUES(ccustomtext1), ccustomtext2 = VALUES(ccustomtext2), ccustomtext3 = VALUES(ccustomtext3), ccustomtext4 = VALUES(ccustomtext4), ccustomtext5 = VALUES(ccustomtext5), ccustomint1 = VALUES(ccustomint1), ccustomint2 = VALUES(ccustomint2), ccustomint3 = VALUES(ccustomint3), ccustomdbl1 = VALUES(ccustomdbl1), ccustomdbl2 = VALUES(ccustomdbl2), ccustomdbl3 = VALUES(ccustomdbl3), ccustomdate1 = VALUES(ccustomdate1), ccustomdate2 = VALUES(ccustomdate2), ccustomdate3 = VALUES(ccustomdate3), cindexbarcode = VALUES(cindexbarcode)
```

```sql
DELETE FROM M1_Class WHERE ckode = '{idtransaksi}'
```

```sql
select `c`.`ckode` AS `ckode`,`c`.`cnama` AS `cnama`,`c`.`ccatatan` AS `ccatatan`,`c`.`caktif` AS `caktif`,`c`.`cinputuser` AS `cinputuser`,`c`.`cinputtgl` AS `cinputtgl`,`c`.`cmodifikasiuser` AS `cmodifikasiuser`,`c`.`cmodifikasitgl` AS `cmodifikasitgl`,`c`.`ccustomtext1` AS `ccustomtext1`,`c`.`ccustomtext2` AS `ccustomtext2`,`c`.`ccustomtext3` AS `ccustomtext3`,`c`.`ccustomtext4` AS `ccustomtext4`,`c`.`ccustomtext5` AS `ccustomtext5`,`c`.`ccustomint1` AS `ccustomint1`,`c`.`ccustomint2` AS `ccustomint2`,`c`.`ccustomint3` AS `ccustomint3`,`c`.`ccustomdbl1` AS `ccustomdbl1`,`c`.`ccustomdbl2` AS `ccustomdbl2`,`c`.`ccustomdbl3` AS `ccustomdbl3`,`c`.`ccustomdate1` AS `ccustomdate1`,`c`.`ccustomdate2` AS `ccustomdate2`,`c`.`ccustomdate3` AS `ccustomdate3`,`c`.`cindexbarcode` AS `cindexbarcode`,`u1`.`unama` AS `cinputusernama`,`u2`.`unama` AS `cmodifikasiusernama` from ((`M1_Class` `c` left join `m0_user` `u1` on((`c`.`cinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`c`.`cmodifikasiuser` = `u2`.`userid`)))
```

```sql
SELECT COUNT(ckode) FROM M1_Class WHERE ckode='{idtransaksi}'
```

```sql
select c.ckode AS ckode, c.cnama AS cnama, s.skode AS sumber, CONCAT('Setting : ', s.smodule, ' - ', s.sgrup, ' - ', s.skode) AS idterkait from m0_setting s join m1_class_product c on (s.smodule = 0 AND s.sgrup = 'options' AND s.skode = 'KelasProduk' AND s.snilai = c.ckode) WHERE c.ckode = 'valkode' union all SELECT c.ckode as ckode, c.cnama as cnama, 'Item' as sumber, i.bkode as idterkait FROM m1_item i JOIN m1_class_product c ON i.bkelasproduk = c.ckode AND c.ckode = 'valkode' GROUP BY c.ckode, i.bid UNION ALL SELECT c.ckode as ckode, c.cnama as cnama, 'POS Type' as sumber, ptc.tipepos as idterkait FROM m_12_pos_type_class_product ptc JOIN m1_class_product c ON ptc.kelasproduk = c.ckode AND c.ckode = 'valkode' GROUP BY c.ckode, ptc.tipepos
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_class_history.vb`

```sql
INSERT INTO M1_Class_history(SELECT 0, class_product.* FROM M1_Class class_product WHERE class_product.ckode = '{idtransaksi}')
```

```sql
select `c`.`cidhistory` AS `cidhistory`,`c`.`ckode` AS `ckode`,`c`.`cnama` AS `cnama`,`c`.`ccatatan` AS `ccatatan`,`c`.`caktif` AS `caktif`,`c`.`cinputuser` AS `cinputuser`,`c`.`cinputtgl` AS `cinputtgl`,`c`.`cmodifikasiuser` AS `cmodifikasiuser`,`c`.`cmodifikasitgl` AS `cmodifikasitgl`,`c`.`ccustomtext1` AS `ccustomtext1`,`c`.`ccustomtext2` AS `ccustomtext2`,`c`.`ccustomtext3` AS `ccustomtext3`,`c`.`ccustomtext4` AS `ccustomtext4`,`c`.`ccustomtext5` AS `ccustomtext5`,`c`.`ccustomint1` AS `ccustomint1`,`c`.`ccustomint2` AS `ccustomint2`,`c`.`ccustomint3` AS `ccustomint3`,`c`.`ccustomdbl1` AS `ccustomdbl1`,`c`.`ccustomdbl2` AS `ccustomdbl2`,`c`.`ccustomdbl3` AS `ccustomdbl3`,`c`.`ccustomdate1` AS `ccustomdate1`,`c`.`ccustomdate2` AS `ccustomdate2`,`c`.`ccustomdate3` AS `ccustomdate3`,`c`.`cindexbarcode` AS `cindexbarcode`,`u1`.`unama` AS `cinputusernama`,`u2`.`unama` AS `cmodifikasiusernama` from ((`M1_Class_history` `c` left join `m0_user` `u1` on((`c`.`cinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`c`.`cmodifikasiuser` = `u2`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_class_product.vb`

```sql
Insert into M1_Class_Product(cpkode, cpnama, cpcatatan, cpaktif, cpinputuser, cpinputtgl, cpmodifikasiuser, cpmodifikasitgl, cpcustomtext1, cpcustomtext2, cpcustomtext3, cpcustomtext4, cpcustomtext5, cpcustomint1, cpcustomint2, cpcustomint3, cpcustomdbl1, cpcustomdbl2, cpcustomdbl3, cpcustomdate1, cpcustomdate2, cpcustomdate3) values{strValue2_ToString} ON DUPLICATE KEY UPDATE cpnama = VALUES(cpnama), cpcatatan = VALUES(cpcatatan), cpaktif = VALUES(cpaktif), cpmodifikasiuser = VALUES(cpmodifikasiuser), cpmodifikasitgl = NOW(), cpcustomtext1 = VALUES(cpcustomtext1), cpcustomtext2 = VALUES(cpcustomtext2), cpcustomtext3 = VALUES(cpcustomtext3), cpcustomtext4 = VALUES(cpcustomtext4), cpcustomtext5 = VALUES(cpcustomtext5), cpcustomint1 = VALUES(cpcustomint1), cpcustomint2 = VALUES(cpcustomint2), cpcustomint3 = VALUES(cpcustomint3), cpcustomdbl1 = VALUES(cpcustomdbl1), cpcustomdbl2 = VALUES(cpcustomdbl2), cpcustomdbl3 = VALUES(cpcustomdbl3), cpcustomdate1 = VALUES(cpcustomdate1), cpcustomdate2 = VALUES(cpcustomdate2), cpcustomdate3 = VALUES(cpcustomdate3)
```

```sql
DELETE FROM M1_Class_Product WHERE cpkode = '{idtransaksi}'
```

```sql
select `cp`.`cpkode` AS `cpkode`,`cp`.`cpnama` AS `cpnama`,`cp`.`cpcatatan` AS `cpcatatan`,`cp`.`cpaktif` AS `cpaktif`,`cp`.`cpinputuser` AS `cpinputuser`,`cp`.`cpinputtgl` AS `cpinputtgl`,`cp`.`cpmodifikasiuser` AS `cpmodifikasiuser`,`cp`.`cpmodifikasitgl` AS `cpmodifikasitgl`,`cp`.`cpcustomtext1` AS `cpcustomtext1`,`cp`.`cpcustomtext2` AS `cpcustomtext2`,`cp`.`cpcustomtext3` AS `cpcustomtext3`,`cp`.`cpcustomtext4` AS `cpcustomtext4`,`cp`.`cpcustomtext5` AS `cpcustomtext5`,`cp`.`cpcustomint1` AS `cpcustomint1`,`cp`.`cpcustomint2` AS `cpcustomint2`,`cp`.`cpcustomint3` AS `cpcustomint3`,`cp`.`cpcustomdbl1` AS `cpcustomdbl1`,`cp`.`cpcustomdbl2` AS `cpcustomdbl2`,`cp`.`cpcustomdbl3` AS `cpcustomdbl3`,`cp`.`cpcustomdate1` AS `cpcustomdate1`,`cp`.`cpcustomdate2` AS `cpcustomdate2`,`cp`.`cpcustomdate3` AS `cpcustomdate3`,`u1`.`unama` AS `cpinputusernama`,`u2`.`unama` AS `cpmodifikasiusernama` from ((`M1_Class_Product` `cp` left join `m0_user` `u1` on((`cp`.`cpinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`cp`.`cpmodifikasiuser` = `u2`.`userid`)))
```

```sql
SELECT COUNT(cpkode) FROM M1_Class_Product WHERE cpkode='{idtransaksi}'
```

```sql
select cp.cpkode AS cpkode, cp.cpnama AS cpnama, s.skode AS sumber, CONCAT('Setting : ', s.smodule, ' - ', s.sgrup, ' - ', s.skode) AS idterkait from m0_setting s join m1_class_product cp on (s.smodule = 0 AND s.sgrup = 'options' AND s.skode = 'KelasProduk' AND s.snilai = cp.cpkode) WHERE cp.cpkode = 'valkode' union all SELECT cp.cpkode as cpkode, cp.cpnama as cpnama, 'Item' as sumber, i.bkode as idterkait FROM m1_item i JOIN m1_class_product cp ON i.bkelasproduk = cp.cpkode AND cp.cpkode = 'valkode' GROUP BY cp.cpkode, i.bid UNION ALL SELECT cp.cpkode as cpkode, cp.cpnama as cpnama, 'POS Type' as sumber, ptcp.tipepos as idterkait FROM m_12_pos_type_class_product ptcp JOIN m1_class_product cp ON ptcp.kelasproduk = cp.cpkode AND cp.cpkode = 'valkode' GROUP BY cp.cpkode, ptcp.tipepos
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_class_product_history.vb`

```sql
INSERT INTO M1_Class_Product_history(SELECT 0, class_product.* FROM M1_Class_Product class_product WHERE class_product.cpkode = '{idtransaksi}')
```

```sql
select `cp`.`cpidhistory` AS `cpidhistory`,`cp`.`cpkode` AS `cpkode`,`cp`.`cpnama` AS `cpnama`,`cp`.`cpcatatan` AS `cpcatatan`,`cp`.`cpaktif` AS `cpaktif`,`cp`.`cpinputuser` AS `cpinputuser`,`cp`.`cpinputtgl` AS `cpinputtgl`,`cp`.`cpmodifikasiuser` AS `cpmodifikasiuser`,`cp`.`cpmodifikasitgl` AS `cpmodifikasitgl`,`cp`.`cpcustomtext1` AS `cpcustomtext1`,`cp`.`cpcustomtext2` AS `cpcustomtext2`,`cp`.`cpcustomtext3` AS `cpcustomtext3`,`cp`.`cpcustomtext4` AS `cpcustomtext4`,`cp`.`cpcustomtext5` AS `cpcustomtext5`,`cp`.`cpcustomint1` AS `cpcustomint1`,`cp`.`cpcustomint2` AS `cpcustomint2`,`cp`.`cpcustomint3` AS `cpcustomint3`,`cp`.`cpcustomdbl1` AS `cpcustomdbl1`,`cp`.`cpcustomdbl2` AS `cpcustomdbl2`,`cp`.`cpcustomdbl3` AS `cpcustomdbl3`,`cp`.`cpcustomdate1` AS `cpcustomdate1`,`cp`.`cpcustomdate2` AS `cpcustomdate2`,`cp`.`cpcustomdate3` AS `cpcustomdate3`,`u1`.`unama` AS `cpinputusernama`,`u2`.`unama` AS `cpmodifikasiusernama` from ((`M1_Class_Product_history` `cp` left join `m0_user` `u1` on((`cp`.`cpinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`cp`.`cpmodifikasiuser` = `u2`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_coa.vb`

```sql
SELECT COUNT(cid) FROM M1_Coa WHERE cid='{dataUtama_0}'
```

```sql
Update M1_Coa set cnomor = '{FixQuotes_dataUtama_1}', ctipe = {dataUtama_2}, cdc = '{FixQuotes_dataUtama_3}', curutan = {dataUtama_4}, caktif = {dataUtama_5}, cnama = '{FixQuotes_dataUtama_6}', cnamaalias1 = '{FixQuotes_dataUtama_7}', cnamaalias2 = '{FixQuotes_dataUtama_8}', cnamaalias3 = '{FixQuotes_dataUtama_9}', cgd = '{FixQuotes_dataUtama_10}', clevel = {dataUtama_11}, csubdari = {dataUtama_12}, cparent = '{FixQuotes_dataUtama_13}', clevel1 = '{FixQuotes_dataUtama_14}', clevel2 = '{FixQuotes_dataUtama_15}', clevel3 = '{FixQuotes_dataUtama_16}', clevel4 = '{FixQuotes_dataUtama_17}', clevel5 = '{FixQuotes_dataUtama_18}', cjenisaruskas = '{FixQuotes_dataUtama_19}', cbukupembantu = {dataUtama_20}, ccabang = '{FixQuotes_dataUtama_21}', clokasi = '{FixQuotes_dataUtama_22}', cdivisi = '{FixQuotes_dataUtama_23}', cmatauang = '{FixQuotes_dataUtama_24}', ckodebank = '{FixQuotes_dataUtama_25}', cnorekbank = '{FixQuotes_dataUtama_26}', cjenis = '{FixQuotes_dataUtama_27}', csaldoawal = '{FixDouble_dataUtama_28}', csaldoberjalan = '{FixDouble_dataUtama_29}', ccatatan = '{FixQuotes_dataUtama_30}', cinputuser = {dataUtama_31}, cinputtgl = '{FixQuotes_AsFormatTanggal_dataUtama_32}yyyy-MM-dd H:mm:ss', cmodifikasiuser = {dataUtama_33}, cmodifikasitgl = '{FixQuotes_AsFormatTanggal_dataUtama_34}yyyy-MM-dd H:mm:ss', ccostcenter = {dataUtama_35}, ccustomtext1 = '{FixQuotes_dataUtama_36}', ccustomtext2 = '{FixQuotes_dataUtama_37}', ccustomtext3 = '{FixQuotes_dataUtama_38}', ccustomtext4 = '{FixQuotes_dataUtama_39}', ccustomtext5 = '{FixQuotes_dataUtama_40}', ccustomtext6 = '{FixQuotes_dataUtama_41}', ccustomtext7 = '{FixQuotes_dataUtama_42}', ccustomtext8 = '{FixQuotes_dataUtama_43}', ccustomtext9 = '{FixQuotes_dataUtama_44}', ccustomtext10 = '{FixQuotes_dataUtama_45}', ccustomint1 = {dataUtama_46}, ccustomint2 = {dataUtama_47}, ccustomint3 = {dataUtama_48}, ccustomint4 = {dataUtama_49}, ccustomint5 = {dataUtama_50}, ccustomint6 = {dataUtama_51}, ccustomint7 = {dataUtama_52}, ccustomint8 = {dataUtama_53}, ccustomint9 = {dataUtama_54}, ccustomint10 = {dataUtama_55}, ccustomdbl1 = '{FixDouble_dataUtama_56}', ccustomdbl2 = '{FixDouble_dataUtama_57}', ccustomdbl3 = '{FixDouble_dataUtama_58}', ccustomdbl4 = '{FixDouble_dataUtama_59}', ccustomdbl5 = '{FixDouble_dataUtama_60}', ccustomdbl6 = '{FixDouble_dataUtama_61}', ccustomdbl7 = '{FixDouble_dataUtama_62}', ccustomdbl8 = '{FixDouble_dataUtama_63}', ccustomdbl9 = '{FixDouble_dataUtama_64}', ccustomdbl10 = '{FixDouble_dataUtama_65}', ccustomdate1 = '{FixQuotes_AsFormatTanggal_dataUtama_66}', ccustomdate2 = '{FixQuotes_AsFormatTanggal_dataUtama_67}', ccustomdate3 = '{FixQuotes_AsFormatTanggal_dataUtama_68}', ccustomdate4 = '{FixQuotes_AsFormatTanggal_dataUtama_69}', ccustomdate5 = '{FixQuotes_AsFormatTanggal_dataUtama_70}', ccustomdate6 = '{FixQuotes_AsFormatTanggal_dataUtama_71}', ccustomdate7 = '{FixQuotes_AsFormatTanggal_dataUtama_72}', ccustomdate8 = '{FixQuotes_AsFormatTanggal_dataUtama_73}', ccustomdate9 = '{FixQuotes_AsFormatTanggal_dataUtama_74}', ccustomdate10 = '{FixQuotes_AsFormatTanggal_dataUtama_75}' where cid = '{dataUtama_0}'
```

```sql
Insert into M1_Coa (cnomor, ctipe, cdc, curutan, caktif, cnama, cnamaalias1, cnamaalias2, cnamaalias3, cgd, clevel, csubdari, cparent, clevel1, clevel2, clevel3, clevel4, clevel5, cjenisaruskas, cbukupembantu, ccabang, clokasi, cdivisi, cmatauang, ckodebank, cnorekbank, cjenis, csaldoawal, csaldoberjalan, ccatatan, cinputuser, cinputtgl, cmodifikasiuser, cmodifikasitgl, ccostcenter, ccustomtext1, ccustomtext2, ccustomtext3, ccustomtext4, ccustomtext5, ccustomtext6, ccustomtext7, ccustomtext8, ccustomtext9, ccustomtext10, ccustomint1, ccustomint2, ccustomint3, ccustomint4, ccustomint5, ccustomint6, ccustomint7, ccustomint8, ccustomint9, ccustomint10, ccustomdbl1, ccustomdbl2, ccustomdbl3, ccustomdbl4, ccustomdbl5, ccustomdbl6, ccustomdbl7, ccustomdbl8, ccustomdbl9, ccustomdbl10, ccustomdate1, ccustomdate2, ccustomdate3, ccustomdate4, ccustomdate5, ccustomdate6, ccustomdate7, ccustomdate8, ccustomdate9, ccustomdate10) values('{FixQuotes_dataUtama_1}', {dataUtama_2}, '{FixQuotes_dataUtama_3}', {dataUtama_4}, {dataUtama_5}, '{FixQuotes_dataUtama_6}', '{FixQuotes_dataUtama_7}', '{FixQuotes_dataUtama_8}', '{FixQuotes_dataUtama_9}', '{FixQuotes_dataUtama_10}', {dataUtama_11}, {dataUtama_12}, '{FixQuotes_dataUtama_13}', '{FixQuotes_dataUtama_14}', '{FixQuotes_dataUtama_15}', '{FixQuotes_dataUtama_16}', '{FixQuotes_dataUtama_17}', '{FixQuotes_dataUtama_18}', '{FixQuotes_dataUtama_19}', {dataUtama_20}, '{FixQuotes_dataUtama_21}', '{FixQuotes_dataUtama_22}', '{FixQuotes_dataUtama_23}', '{FixQuotes_dataUtama_24}', '{FixQuotes_dataUtama_25}', '{FixQuotes_dataUtama_26}', '{FixQuotes_dataUtama_27}', '{FixDouble_dataUtama_28}', '{FixDouble_dataUtama_29}', '{FixQuotes_dataUtama_30}', {dataUtama_31}, '{FixQuotes_AsFormatTanggal_dataUtama_32}yyyy-MM-dd H:mm:ss', {dataUtama_33}, '{FixQuotes_AsFormatTanggal_dataUtama_34}yyyy-MM-dd H:mm:ss', {dataUtama_35}, '{FixQuotes_dataUtama_36}', '{FixQuotes_dataUtama_37}', '{FixQuotes_dataUtama_38}', '{FixQuotes_dataUtama_39}', '{FixQuotes_dataUtama_40}', '{FixQuotes_dataUtama_41}', '{FixQuotes_dataUtama_42}', '{FixQuotes_dataUtama_43}', '{FixQuotes_dataUtama_44}', '{FixQuotes_dataUtama_45}', {dataUtama_46}, {dataUtama_47}, {dataUtama_48}, {dataUtama_49}, {dataUtama_50}, {dataUtama_51}, {dataUtama_52}, {dataUtama_53}, {dataUtama_54}, {dataUtama_55}, '{FixDouble_dataUtama_56}', '{FixDouble_dataUtama_57}', '{FixDouble_dataUtama_58}', '{FixDouble_dataUtama_59}', '{FixDouble_dataUtama_60}', '{FixDouble_dataUtama_61}', '{FixDouble_dataUtama_62}', '{FixDouble_dataUtama_63}', '{FixDouble_dataUtama_64}', '{FixDouble_dataUtama_65}', '{FixQuotes_AsFormatTanggal_dataUtama_66}', '{FixQuotes_AsFormatTanggal_dataUtama_67}', '{FixQuotes_AsFormatTanggal_dataUtama_68}', '{FixQuotes_AsFormatTanggal_dataUtama_69}', '{FixQuotes_AsFormatTanggal_dataUtama_70}', '{FixQuotes_AsFormatTanggal_dataUtama_71}', '{FixQuotes_AsFormatTanggal_dataUtama_72}', '{FixQuotes_AsFormatTanggal_dataUtama_73}', '{FixQuotes_AsFormatTanggal_dataUtama_74}', '{FixQuotes_AsFormatTanggal_dataUtama_75}')
```

```sql
DELETE FROM M1_Coa WHERE cnomor = '{idtransaksi}'
```

```sql
SELECT c.cid AS cid, c.cnomor AS cnomor, c.ctipe AS ctipe, c.cdc AS cdc, c.curutan AS curutan, c.caktif AS caktif, c.cnama AS cnama, c.cnamaalias1 AS cnamaalias1, c.cnamaalias2 AS cnamaalias2, c.cnamaalias3 AS cnamaalias3, c.cgd AS cgd, c.clevel AS clevel, c.csubdari AS csubdari, c.cparent AS cparent, c.clevel1 AS clevel1, c.clevel2 AS clevel2, c.clevel3 AS clevel3, c.clevel4 AS clevel4, c.clevel5 AS clevel5, c.cjenisaruskas AS cjenisaruskas, c.cbukupembantu AS cbukupembantu, c.ccabang AS ccabang, c.clokasi AS clokasi, c.cdivisi AS cdivisi, c.cmatauang AS cmatauang, c.ckodebank AS ckodebank, c.cnorekbank AS cnorekbank, c.cjenis AS cjenis, c.csaldoawal AS csaldoawal, c.csaldoberjalan AS csaldoberjalan, c.ccatatan AS ccatatan, c.cinputuser AS cinputuser, c.cinputtgl AS cinputtgl, c.cmodifikasiuser AS cmodifikasiuser, c.cmodifikasitgl AS cmodifikasitgl, (c.csaldoawal + c.csaldoberjalan) AS csaldoakhir, c2.cnama AS cparentnama, br.bnama AS ccabangnama, lc.lnama AS clokasinama, d.dnama AS cdivisinama, cr.cnama AS cmatauangnama, bn.bnama AS cnamabank, c.ccostcenter, c.ccustomtext1, c.ccustomtext2, c.ccustomtext3, c.ccustomtext4, c.ccustomtext5, c.ccustomtext6, c.ccustomtext7, c.ccustomtext8, c.ccustomtext9, c.ccustomtext10, c.ccustomint1, c.ccustomint2, c.ccustomint3, c.ccustomint4, c.ccustomint5, c.ccustomint6, c.ccustomint7, c.ccustomint8, c.ccustomint9, c.ccustomint10, c.ccustomdbl1, c.ccustomdbl2, c.ccustomdbl3, c.ccustomdbl4, c.ccustomdbl5, c.ccustomdbl6, c.ccustomdbl7, c.ccustomdbl8, c.ccustomdbl9, c.ccustomdbl10, c.ccustomdate1, c.ccustomdate2, c.ccustomdate3, c.ccustomdate4, c.ccustomdate5, c.ccustomdate6, c.ccustomdate7, c.ccustomdate8, c.ccustomdate9, c.ccustomdate10 from m1_coa c left join m1_coa c2 on c.cparent = c2.cnomor left join m1_branch br on c.ccabang = br.bkode left join m1_location lc on c.clokasi = lc.lkode left join m1_division d on c.cdivisi = d.dkode left join m1_bank bn on c.ckodebank = bn.bkode left join m1_currency cr on c.cmatauang = cr.ckode
```

```sql
SELECT COUNT(cnomor) FROM m1_coa WHERE cnomor='{idtransaksi}'
```

```sql
DELETE FROM M1_Coa
```

```sql
Insert into M1_Coa(cid, cnomor, ctipe, ckategori, cdc, curutan, caktif, cnama, cnamaalias1, cnamaalias2, cnamaalias3, cgd, clevel, csubdari, cparent, clevel1, clevel2, clevel3, clevel4, clevel5, cjenisaruskas, cbukupembantu, ccabang, clokasi, cdivisi, cmatauang, ckodebank, cnorekbank, cjenis, csaldoawal, csaldoberjalan, ccatatan, cinputuser, cinputtgl, cmodifikasiuser, cmodifikasitgl, ccostcenter) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_coa_history.vb`

```sql
INSERT INTO m1_coa_history(SELECT 0, coa.* FROM m1_coa coa WHERE coa.cnomor = '{idtransaksi}')
```

```sql
SELECT c.cidhistory, c.cid AS cid, c.cnomor AS cnomor, c.ctipe AS ctipe, c.cdc AS cdc, c.curutan AS curutan, c.caktif AS caktif, c.cnama AS cnama, c.cnamaalias1 AS cnamaalias1, c.cnamaalias2 AS cnamaalias2, c.cnamaalias3 AS cnamaalias3, c.cgd AS cgd, c.clevel AS clevel, c.csubdari AS csubdari, c.cparent AS cparent, c.clevel1 AS clevel1, c.clevel2 AS clevel2, c.clevel3 AS clevel3, c.clevel4 AS clevel4, c.clevel5 AS clevel5, c.cjenisaruskas AS cjenisaruskas, c.cbukupembantu AS cbukupembantu, c.ccabang AS ccabang, c.clokasi AS clokasi, c.cdivisi AS cdivisi, c.cmatauang AS cmatauang, c.ckodebank AS ckodebank, c.cnorekbank AS cnorekbank, c.cjenis AS cjenis, c.csaldoawal AS csaldoawal, c.csaldoberjalan AS csaldoberjalan, c.ccatatan AS ccatatan, c.cinputuser AS cinputuser, c.cinputtgl AS cinputtgl, c.cmodifikasiuser AS cmodifikasiuser, c.cmodifikasitgl AS cmodifikasitgl, (c.csaldoawal + c.csaldoberjalan) AS csaldoakhir, c2.cnama AS cparentnama, br.bnama AS ccabangnama, lc.lnama AS clokasinama, d.dnama AS cdivisinama, cr.cnama AS cmatauangnama, bn.bnama AS cnamabank, c.ccostcenter, c.ccustomtext1, c.ccustomtext2, c.ccustomtext3, c.ccustomtext4, c.ccustomtext5, c.ccustomtext6, c.ccustomtext7, c.ccustomtext8, c.ccustomtext9, c.ccustomtext10, c.ccustomint1, c.ccustomint2, c.ccustomint3, c.ccustomint4, c.ccustomint5, c.ccustomint6, c.ccustomint7, c.ccustomint8, c.ccustomint9, c.ccustomint10, c.ccustomdbl1, c.ccustomdbl2, c.ccustomdbl3, c.ccustomdbl4, c.ccustomdbl5, c.ccustomdbl6, c.ccustomdbl7, c.ccustomdbl8, c.ccustomdbl9, c.ccustomdbl10, c.ccustomdate1, c.ccustomdate2, c.ccustomdate3, c.ccustomdate4, c.ccustomdate5, c.ccustomdate6, c.ccustomdate7, c.ccustomdate8, c.ccustomdate9, c.ccustomdate10 from m1_coa_history c left join m1_coa_history c2 on c.cparent = c2.cnomor left join m1_branch br on c.ccabang = br.bkode left join m1_location lc on c.clokasi = lc.lkode left join m1_division d on c.cdivisi = d.dkode left join m1_bank bn on c.ckodebank = bn.bkode left join m1_currency cr on c.cmatauang = cr.ckode
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_colleague.vb`

```sql
SELECT COUNT(cid), ckode FROM m1_colleague WHERE cid='{result_4}'
```

```sql
SELECT COUNT(pid) FROM m1_patient WHERE pkode='{notransaksi}'
```

```sql
Update m1_colleague set ckode = '{FixQuotes_drutama}ckode', cnama = '{FixQuotes_drutama}cnama', cdebit = '{FixQuotes_drutama}cdebit', ckredit = '{FixQuotes_drutama}ckredit', cnotelepon = '{FixQuotes_drutama}cnotelepon', cnofax = '{FixQuotes_drutama}cnofax', cnohp = '{FixQuotes_drutama}cnohp', cemail = '{FixQuotes_drutama}cemail', calamat = '{FixQuotes_drutama}calamat', ckota = '{FixQuotes_drutama}ckota', cprovinsi = '{FixQuotes_drutama}cprovinsi', cnegara = '{FixQuotes_drutama}cnegara', ckodepos = '{FixQuotes_drutama}ckodepos', ccatatan = '{FixQuotes_drutama}ccatatan', caktif = {drutama}caktif, cmodifikasiuser = {drutama}cmodifikasiuser, cmodifikasitgl = NOW() where cid = '{drutama}cid'
```

```sql
SELECT COUNT(cid) FROM m1_colleague WHERE ckode='{notransaksi}'
```

```sql
Insert into m1_colleague (ckode, cnama, cdebit, ckredit, cnotelepon, cnofax, cnohp, cemail, calamat, ckota, cprovinsi, cnegara, ckodepos, ccatatan, caktif, cinputuser, cinputtgl, cmodifikasiuser, cmodifikasitgl) values('{FixQuotes_drutama}ckode', '{FixQuotes_drutama}cnama', '{FixQuotes_drutama}cdebit', '{FixQuotes_drutama}ckredit', '{FixQuotes_drutama}cnotelepon', '{FixQuotes_drutama}cnofax', '{FixQuotes_drutama}cnohp', '{FixQuotes_drutama}cemail', '{FixQuotes_drutama}calamat', '{FixQuotes_drutama}ckota', '{FixQuotes_drutama}cprovinsi', '{FixQuotes_drutama}cnegara', '{FixQuotes_drutama}ckodepos', '{FixQuotes_drutama}ccatatan', {drutama}caktif, {drutama}cinputuser, NOW(), {drutama}cmodifikasiuser, '1971-01-01 00:00:00')
```

```sql
select pid from m1_patient where pkode ='{notransaksi}' AND pinputuser= '{userid}' order by pmodifikasitgl desc limit 1
```

```sql
DELETE FROM M1_Colleague WHERE ckode = '{idtransaksi}'
```

```sql
SELECT COUNT(ckode) FROM m1_colleague WHERE ckode='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_color.vb`

```sql
Insert into M1_Color(ckode, cnama, ccatatan, caktif, cinputuser, cinputtgl, cmodifikasiuser, cmodifikasitgl, ccustomtext1, ccustomtext2, ccustomtext3, ccustomtext4, ccustomtext5, ccustomint1, ccustomint2, ccustomint3, ccustomdbl1, ccustomdbl2, ccustomdbl3, ccustomdate1, ccustomdate2, ccustomdate3, cindexbarcode) values{strValue2_ToString} ON DUPLICATE KEY UPDATE cnama = VALUES(cnama), ccatatan = VALUES(ccatatan), caktif = VALUES(caktif), cmodifikasiuser = VALUES(cmodifikasiuser), cmodifikasitgl = NOW(), ccustomtext1 = VALUES(ccustomtext1), ccustomtext2 = VALUES(ccustomtext2), ccustomtext3 = VALUES(ccustomtext3), ccustomtext4 = VALUES(ccustomtext4), ccustomtext5 = VALUES(ccustomtext5), ccustomint1 = VALUES(ccustomint1), ccustomint2 = VALUES(ccustomint2), ccustomint3 = VALUES(ccustomint3), ccustomdbl1 = VALUES(ccustomdbl1), ccustomdbl2 = VALUES(ccustomdbl2), ccustomdbl3 = VALUES(ccustomdbl3), ccustomdate1 = VALUES(ccustomdate1), ccustomdate2 = VALUES(ccustomdate2), ccustomdate3 = VALUES(ccustomdate3), cindexbarcode = VALUES(cindexbarcode)
```

```sql
DELETE FROM M1_Color WHERE ckode = '{idtransaksi}'
```

```sql
select `c`.`ckode` AS `ckode`,`c`.`cnama` AS `cnama`,`c`.`ccatatan` AS `ccatatan`,`c`.`caktif` AS `caktif`,`c`.`cinputuser` AS `cinputuser`,`c`.`cinputtgl` AS `cinputtgl`,`c`.`cmodifikasiuser` AS `cmodifikasiuser`,`c`.`cmodifikasitgl` AS `cmodifikasitgl`,`c`.`ccustomtext1` AS `ccustomtext1`,`c`.`ccustomtext2` AS `ccustomtext2`,`c`.`ccustomtext3` AS `ccustomtext3`,`c`.`ccustomtext4` AS `ccustomtext4`,`c`.`ccustomtext5` AS `ccustomtext5`,`c`.`ccustomint1` AS `ccustomint1`,`c`.`ccustomint2` AS `ccustomint2`,`c`.`ccustomint3` AS `ccustomint3`,`c`.`ccustomdbl1` AS `ccustomdbl1`,`c`.`ccustomdbl2` AS `ccustomdbl2`,`c`.`ccustomdbl3` AS `ccustomdbl3`,`c`.`ccustomdate1` AS `ccustomdate1`,`c`.`ccustomdate2` AS `ccustomdate2`,`c`.`ccustomdate3` AS `ccustomdate3`,`u1`.`unama` AS `cinputusernama`,`u2`.`unama` AS `cmodifikasiusernama`,`c`.`cindexbarcode` AS `cindexbarcode` from ((`M1_Color` `c` left join `m0_user` `u1` on((`c`.`cinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`c`.`cmodifikasiuser` = `u2`.`userid`)))
```

```sql
SELECT COUNT(ckode) FROM M1_Color WHERE ckode='{idtransaksi}'
```

```sql
select c.ckode AS ckode, c.cnama AS cnama, s.skode AS sumber, CONCAT('Setting : ', s.smodule, ' - ', s.sgrup, ' - ', s.skode) AS idterkait from m0_setting s join m1_color c on (s.smodule = 0 AND s.sgrup = 'options' AND s.skode = 'KelasProduk' AND s.snilai = c.ckode) WHERE c.ckode = 'valkode' union all SELECT c.ckode as ckode, c.cnama as cnama, 'Item' as sumber, i.bkode as idterkait FROM m1_item i JOIN m1_color c ON i.bkelasproduk = c.ckode AND c.ckode = 'valkode' GROUP BY c.ckode, i.bid UNION ALL SELECT c.ckode as ckode, c.cnama as cnama, 'POS Type' as sumber, ptc.tipepos as idterkait FROM m_12_pos_type_color ptc JOIN m1_color c ON ptc.kelasproduk = c.ckode AND c.ckode = 'valkode' GROUP BY c.ckode, ptc.tipepos
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_color_history.vb`

```sql
INSERT INTO M1_Color_history(SELECT 0, color.* FROM M1_Color color WHERE color.ckode = '{idtransaksi}')
```

```sql
select `c`.`cidhistory` AS `cidhistory`,`c`.`ckode` AS `ckode`,`c`.`cnama` AS `cnama`,`c`.`ccatatan` AS `ccatatan`,`c`.`caktif` AS `caktif`,`c`.`cinputuser` AS `cinputuser`,`c`.`cinputtgl` AS `cinputtgl`,`c`.`cmodifikasiuser` AS `cmodifikasiuser`,`c`.`cmodifikasitgl` AS `cmodifikasitgl`,`c`.`ccustomtext1` AS `ccustomtext1`,`c`.`ccustomtext2` AS `ccustomtext2`,`c`.`ccustomtext3` AS `ccustomtext3`,`c`.`ccustomtext4` AS `ccustomtext4`,`c`.`ccustomtext5` AS `ccustomtext5`,`c`.`ccustomint1` AS `ccustomint1`,`c`.`ccustomint2` AS `ccustomint2`,`c`.`ccustomint3` AS `ccustomint3`,`c`.`ccustomdbl1` AS `ccustomdbl1`,`c`.`ccustomdbl2` AS `ccustomdbl2`,`c`.`ccustomdbl3` AS `ccustomdbl3`,`c`.`ccustomdate1` AS `ccustomdate1`,`c`.`ccustomdate2` AS `ccustomdate2`,`c`.`ccustomdate3` AS `ccustomdate3`,`u1`.`unama` AS `cinputusernama`,`u2`.`unama` AS `cmodifikasiusernama`,`c`.`cindexbarcode` AS `cindexbarcode` from ((`M1_Color_history` `c` left join `m0_user` `u1` on((`c`.`cinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`c`.`cmodifikasiuser` = `u2`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_commission.vb`

```sql
SELECT COUNT(kmkode) FROM M1_Commission WHERE kmkode ='{dataUtama_0}'
```

```sql
Update M1_Commission set kmnama = '{dataUtama_1}', kmketerangan = '{dataUtama_2}', kmaktif = {dataUtama_3}, kmmodifikasiuser = {dataUtama_6}, kmmodifikasitgl = NOW(), kmcustomtext1 = '{FixQuotes_dataUtama_8}', kmcustomtext2 = '{FixQuotes_dataUtama_9}', kmcustomtext3 = '{FixQuotes_dataUtama_10}', kmcustomtext4 = '{FixQuotes_dataUtama_11}', kmcustomtext5 = '{FixQuotes_dataUtama_12}', kmcustomint1 = {dataUtama_13}, kmcustomint2 = {dataUtama_14}, kmcustomint3 = {dataUtama_15}, kmcustomdbl1 = '{FixDouble_dataUtama_16}', kmcustomdbl2 = '{FixDouble_dataUtama_17}', kmcustomdbl3 = '{FixDouble_dataUtama_18}', kmcustomdate1 = '{FixQuotes_AsFormatTanggal_dataUtama_19}', kmcustomdate2 = '{FixQuotes_AsFormatTanggal_dataUtama_20}', kmcustomdate3 = '{FixQuotes_AsFormatTanggal_dataUtama_21}' where kmkode = '{dataUtama_0}'
```

```sql
Delete from M1_Commission_Detail where kmdkodekomisi = '{dataUtama_0}'
```

```sql
Insert into M1_Commission (kmkode, kmnama, kmketerangan, kmaktif, kminputuser, kminputtgl, kmmodifikasiuser, kmmodifikasitgl, kmcustomtext1, kmcustomtext2, kmcustomtext3, kmcustomtext4, kmcustomtext5, kmcustomint1, kmcustomint2, kmcustomint3, kmcustomdbl1, kmcustomdbl2, kmcustomdbl3, kmcustomdate1, kmcustomdate2, kmcustomdate3) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, {dataUtama_4}, '{FixQuotes_AsFormatTanggal_dataUtama_5}yyyy-MM-dd H:mm:ss', {dataUtama_6}, '{FixQuotes_AsFormatTanggal_dataUtama_7}yyyy-MM-dd H:mm:ss', '{FixQuotes_dataUtama_8}', '{FixQuotes_dataUtama_9}', '{FixQuotes_dataUtama_10}', '{FixQuotes_dataUtama_11}', '{FixQuotes_dataUtama_12}', {dataUtama_13}, {dataUtama_14}, {dataUtama_15}, '{dataUtama_16}', '{dataUtama_17}', '{dataUtama_18}', '{FixQuotes_AsFormatTanggal_dataUtama_19}yyyy-MM-dd', '{FixQuotes_AsFormatTanggal_dataUtama_20}yyyy-MM-dd', '{FixQuotes_AsFormatTanggal_dataUtama_21}yyyy-MM-dd')
```

```sql
SELECT kmd.kmdkodekomisi as kategori, kmd.kmdoperator as operator, (CASE kmd.kmdoperator WHEN 0 THEN 'Between' WHEN 1 THEN '>=' WHEN 2 THEN 'Multiple' ELSE 'Unknown' END) as operatornama FROM m1_commission_detail kmd WHERE kmd.kmdkodekomisi = '{dataUtama_0}' GROUP BY kmd.kmdoperator ORDER BY kmd.kmdoperator
```

```sql
Insert into M1_Commission_Detail(kmdiddetail,kmdkodekomisi,kmdkriteria,kmdoperator,kmdjml1,kmdjml2,kmdkriterianilai,kmdnilai,kmdcustomtext1,kmdcustomtext2,kmdcustomtext3,kmdcustomtext4,kmdcustomtext5,kmdcustomint1,kmdcustomint2,kmdcustomint3,kmdcustomdbl1,kmdcustomdbl2,kmdcustomdbl3,kmdcustomdate1,kmdcustomdate2,kmdcustomdate3) values{strValue2_ToString}
```

```sql
DELETE FROM m1_commission WHERE kmkode = '{idtransaksi}'; DELETE FROM m1_commission_detail where kmdkodekomisi = '{idtransaksi}'
```

```sql
SELECT km.kmkode, km.kmnama, km.kmketerangan, km.kmaktif, km.kminputuser, km.kminputtgl, km.kmmodifikasiuser, km.kmmodifikasitgl, km.kmcustomtext1, km.kmcustomtext2, km.kmcustomtext3, km.kmcustomtext4, km.kmcustomtext5, km.kmcustomint1, km.kmcustomint2, km.kmcustomint3, km.kmcustomdbl1, km.kmcustomdbl2, km.kmcustomdbl3, km.kmcustomdate1, km.kmcustomdate2, km.kmcustomdate3, u1.unama as kminputusernama, u2.unama as kmmodifikasiusernama FROM m1_commission km LEFT JOIN m0_user u1 ON km.kminputuser = u1.userid LEFT JOIN m0_user u2 ON km.kmmodifikasiuser = u2.userid
```

```sql
SELECT COUNT(kmkode) FROM m1_commission WHERE kmkode='{idtransaksi}'
```

```sql
select `km`.`kmkode` AS `kmkode`,`km`.`kmnama` AS `kmnama`,'CONTACT' AS `sumber`,`c`.`kkode` AS `idterkait` from `m1_contact` `c` join `m1_commission` `km` on `c`.`kkomisikode` = `km`.`kmkode` where km.kmkode='valkode' GROUP BY km.kmkode, c.kid
```

```sql
SELECT km.kmkode, km.kmnama, km.kmketerangan, km.kmaktif, km.kminputuser, km.kminputtgl, km.kmmodifikasiuser, km.kmmodifikasitgl, km.kmcustomtext1, km.kmcustomtext2, km.kmcustomtext3, km.kmcustomtext4, km.kmcustomtext5, km.kmcustomint1, km.kmcustomint2, km.kmcustomint3, km.kmcustomdbl1, km.kmcustomdbl2, km.kmcustomdbl3, km.kmcustomdate1, km.kmcustomdate2, km.kmcustomdate3, u1.unama as kminputusernama, u2.unama as kmmodifikasiusernama,kmd.kmdiddetail,kmd.kmdkodekomisi,kmd.kmdkriteria,kmd.kmdoperator,kmd.kmdjml1,kmd.kmdjml2,kmd.kmdkriterianilai,kmd.kmdnilai, kmd.kmdcustomtext1, kmd.kmdcustomtext2, kmd.kmdcustomtext3, kmd.kmdcustomtext4, kmd.kmdcustomtext5, kmd.kmdcustomint1, kmd.kmdcustomint2, kmd.kmdcustomint3, kmd.kmdcustomdbl1, kmd.kmdcustomdbl2, kmd.kmdcustomdbl3, kmd.kmdcustomdate1, kmd.kmdcustomdate2, kmd.kmdcustomdate3 FROM (((m1_commission km JOIN m1_commission_detail kmd ON((`km`.`kmkode` = `kmd`.`kmdkodekomisi`)))LEFT JOIN m0_user u1 ON km.kminputuser = u1.userid)LEFT JOIN m0_user u2 ON km.kmmodifikasiuser = u2.userid)
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_commission_history.vb`

```sql
INSERT INTO m1_commission_history(SELECT 0, km.* FROM m1_commission km WHERE km.kmkode = '{idtransaksi}')
```

```sql
SELECT kmidhistory FROM m1_commission_history WHERE kmkode = '{idtransaksi}' ORDER BY kmmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m1_commission_detail_history (SELECT 0, '{result_4}', km.* FROM m1_commission_detail km WHERE km.kmdkodekomisi = '{idtransaksi}' )
```

```sql
SELECT km.kmkode, km.kmnama, km.kmketerangan, km.kmaktif, km.kminputuser, km.kminputtgl, km.kmmodifikasiuser, km.kmmodifikasitgl, km.kmcustomtext1, km.kmcustomtext2, km.kmcustomtext3, km.kmcustomtext4, km.kmcustomtext5, km.kmcustomint1, km.kmcustomint2, km.kmcustomint3, km.kmcustomdbl1, km.kmcustomdbl2, km.kmcustomdbl3, km.kmcustomdate1, km.kmcustomdate2, km.kmcustomdate3, u1.unama as kminputusernama, u2.unama as kmmodifikasiusernama FROM m1_commission_history km LEFT JOIN m0_user u1 ON km.kminputuser = u1.userid LEFT JOIN m0_user u2 ON km.kmmodifikasiuser = u2.userid
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_contact.vb`

```sql
SELECT COUNT(kid) FROM m1_contact WHERE kkode='{kodekontak}' AND kkategori='{kategorikontak}'
```

```sql
SELECT COUNT(kid) FROM M1_Contact WHERE kid='{result_4}'
```

```sql
Update M1_Contact set kkode = '{FixQuotes_drutama}kkode', knama = '{FixQuotes_drutama}knama', kkategori = '{FixQuotes_drutama}kkategori', kkategorinama = '{FixQuotes_drutama}kkategorinama', kcabang = '{FixQuotes_drutama}kcabang', kcabangnama = '{FixQuotes_drutama}kcabangnama', klokasi = '{FixQuotes_drutama}klokasi', klokasinama = '{FixQuotes_drutama}klokasinama', kgudang = '{FixQuotes_drutama}kgudang', kgudangnama = '{FixQuotes_drutama}kgudangnama', kkategorisalesman = '{FixQuotes_drutama}kkategorisalesman', kkategorisalesmannama = '{FixQuotes_drutama}kkategorisalesmannama', karea = '{FixQuotes_drutama}karea', kareanama = '{FixQuotes_drutama}kareanama', kkategoricustomer = '{FixQuotes_drutama}kkategoricustomer', kkategoricustomernama = '{FixQuotes_drutama}kkategoricustomernama', kkategorisupplier = '{FixQuotes_drutama}kkategorisupplier', kkategorisuppliernama = '{FixQuotes_drutama}kkategorisuppliernama', kdivisi = '{FixQuotes_drutama}kdivisi', kdivisinama = '{FixQuotes_drutama}kdivisinama', ksubdivisi = '{FixQuotes_drutama}ksubdivisi', ksubdivisinama = '{FixQuotes_drutama}ksubdivisinama', ksalesman = {drutama}ksalesman, ksalesmannama = '{FixQuotes_drutama}ksalesmannama', kkontakperson = '{FixQuotes_drutama}kkontakperson', kterminglobal = {drutama}kterminglobal, kaktif = {drutama}kaktif, kaktiftgl = '{FixQuotes_AsFormatTanggal_drutama}kaktiftgl', k1alamat1 = '{FixQuotes_drutama}k1alamat1', k1alamat2 = '{FixQuotes_drutama}k1alamat2', k1alamat3 = '{FixQuotes_drutama}k1alamat3', k1alamat4 = '{FixQuotes_drutama}k1alamat4', k1alamat5 = '{FixQuotes_drutama}k1alamat5', k1kota = '{FixQuotes_drutama}k1kota', k1propinsi = '{FixQuotes_drutama}k1propinsi', k1kodepos = '{FixQuotes_drutama}k1kodepos', k1negara = '{FixQuotes_drutama}k1negara', k1kontakperson = '{FixQuotes_drutama}k1kontakperson', k1kontaknohp = '{FixQuotes_drutama}k1kontaknohp', k1kontakemail = '{FixQuotes_drutama}k1kontakemail', k1notelp1 = '{FixQuotes_drutama}k1notelp1', k1notelp2 = '{FixQuotes_drutama}k1notelp2', k1nofax = '{FixQuotes_drutama}k1nofax', k1email = '{FixQuotes_drutama}k1email', k1website = '{FixQuotes_drutama}k1website', k2alamat1 = '{FixQuotes_drutama}k2alamat1', k2alamat2 = '{FixQuotes_drutama}k2alamat2', k2alamat3 = '{FixQuotes_drutama}k2alamat3', k2alamat4 = '{FixQuotes_drutama}k2alamat4', k2alamat5 = '{FixQuotes_drutama}k2alamat5', k2propinsi = '{FixQuotes_drutama}k2propinsi', k2kota = '{FixQuotes_drutama}k2kota', k2kodepos = '{FixQuotes_drutama}k2kodepos', k2negara = '{FixQuotes_drutama}k2negara', k2kontakperson = '{FixQuotes_drutama}k2kontakperson', k2kontaknohp = '{FixQuotes_drutama}k2kontaknohp', k2kontakemail = '{FixQuotes_drutama}k2kontakemail', k2notelp1 = '{FixQuotes_drutama}k2notelp1', k2notelp2 = '{FixQuotes_drutama}k2notelp2', k2nofax = '{FixQuotes_drutama}k2nofax', k2email = '{FixQuotes_drutama}k2email', k2website = '{FixQuotes_drutama}k2website', k3alamat1 = '{FixQuotes_drutama}k3alamat1', k3alamat2 = '{FixQuotes_drutama}k3alamat2', k3alamat3 = '{FixQuotes_drutama}k3alamat3', k3alamat4 = '{FixQuotes_drutama}k3alamat4', k3alamat5 = '{FixQuotes_drutama}k3alamat5', k3kota = '{FixQuotes_drutama}k3kota', k3propinsi = '{FixQuotes_drutama}k3propinsi', k3kodepos = '{FixQuotes_drutama}k3kodepos', k3negara = '{FixQuotes_drutama}k3negara', k3kontakperson = '{FixQuotes_drutama}k3kontakperson', k3kontaknohp = '{FixQuotes_drutama}k3kontaknohp', k3kontakemail = '{FixQuotes_drutama}k3kontakemail', k3notelp1 = '{FixQuotes_drutama}k3notelp1', k3notelp2 = '{FixQuotes_drutama}k3notelp2', k3nofax = '{FixQuotes_drutama}k3nofax', k3email = '{FixQuotes_drutama}k3email', k3website = '{FixQuotes_drutama}k3website', k4alamat1 = '{FixQuotes_drutama}k4alamat1', k4alamat2 = '{FixQuotes_drutama}k4alamat2', k4alamat3 = '{FixQuotes_drutama}k4alamat3', k4alamat4 = '{FixQuotes_drutama}k4alamat4', k4alamat5 = '{FixQuotes_drutama}k4alamat5', k4kota = '{FixQuotes_drutama}k4kota', k4propinsi = '{FixQuotes_drutama}k4propinsi', k4kodepos = '{FixQuotes_drutama}k4kodepos', k4negara = '{FixQuotes_drutama}k4negara', k4kontakperson = '{FixQuotes_drutama}k4kontakperson', k4kontaknohp = '{FixQuotes_drutama}k4kontaknohp', k4kontakemail = '{FixQuotes_drutama}k4kontakemail', k4notelp1 = '{FixQuotes_drutama}k4notelp1', k4notelp2 = '{FixQuotes_drutama}k4notelp2', k4nofax = '{FixQuotes_drutama}k4nofax', k4email = '{FixQuotes_drutama}k4email', k4website = '{FixQuotes_drutama}k4website', knpwp = '{FixQuotes_drutama}knpwp', kpkp = {drutama}kpkp, kbatashutang = '{FixDouble_drutama}kbatashutang', kterminbeli = '{FixQuotes_drutama}kterminbeli', krekhutang = '{FixQuotes_drutama}krekhutang', kbagpembelian = {drutama}kbagpembelian, kfobbeli = '{FixQuotes_drutama}kfobbeli', kviabeli = '{FixQuotes_drutama}kviabeli', kbataspiutang = '{FixDouble_drutama}kbataspiutang', kterminjual = '{FixQuotes_drutama}kterminjual', krekpiutang = '{FixQuotes_drutama}krekpiutang', kbagpenjualan = {drutama}kbagpenjualan, ktingkatjual = {drutama}ktingkatjual, kfobjual = '{FixQuotes_drutama}kfobjual', kviajual = '{FixQuotes_drutama}kviajual', ktglkontrak = '{FixQuotes_AsFormatTanggal_drutama}ktglkontrak', kbank = '{FixQuotes_drutama}kbank', knorekening = '{FixQuotes_drutama}knorekening', kjeniskelamin = {drutama}kjeniskelamin, kmatauang = '{FixQuotes_drutama}kmatauang', ktgllahir = '{FixQuotes_AsFormatTanggal_drutama}ktgllahir', ktglnikah = '{FixQuotes_AsFormatTanggal_drutama}ktglnikah', kkomisipenjualan = '{FixDouble_drutama}kkomisipenjualan', kcatatan = '{FixQuotes_drutama}kcatatan', kcustomtext1 = '{FixQuotes_drutama}kcustomtext1', kcustomtext2 = '{FixQuotes_drutama}kcustomtext2', kcustomtext3 = '{FixQuotes_drutama}kcustomtext3', kcustomtext4 = '{FixQuotes_drutama}kcustomtext4', kcustomtext5 = '{FixQuotes_drutama}kcustomtext5', kcustomtext6 = '{FixQuotes_drutama}kcustomtext6', kcustomtext7 = '{FixQuotes_drutama}kcustomtext7', kcustomtext8 = '{FixQuotes_drutama}kcustomtext8', kcustomtext9 = '{FixQuotes_drutama}kcustomtext9', kmodifikasiuser = {drutama}kmodifikasiuser, kmodifikasitgl = NOW(), kcustomtext10 = '{FixQuotes_drutama}kcustomtext10', kcustomint1 = {drutama}kcustomint1, kcustomint2 = {drutama}kcustomint2, kcustomint3 = {drutama}kcustomint3, kcustomdbl1 = '{FixDouble_drutama}kcustomdbl1', kcustomdbl2 = '{FixDouble_drutama}kcustomdbl2', kcustomdbl3 = '{FixDouble_drutama}kcustomdbl3', kcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}kcustomdate1', kcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}kcustomdate2', kcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}kcustomdate3', kkomisikode = '{FixQuotes_drutama}kkomisikode', kdownloaded = 0, khargacustom = '{FixDouble_drutama}khargacustom' where kid = '{drutama}kid'
```

```sql
Insert into M1_Contact (kkode, knama, kkategori, kkategorinama, kcabang, kcabangnama, klokasi, klokasinama, kgudang, kgudangnama, kkategorisalesman, kkategorisalesmannama, karea, kareanama, kkategoricustomer, kkategoricustomernama, kkategorisupplier, kkategorisuppliernama, kdivisi, kdivisinama, ksubdivisi, ksubdivisinama, ksalesman, ksalesmannama, kkontakperson, kterminglobal, kaktif, kaktiftgl, k1alamat1, k1alamat2, k1alamat3, k1alamat4, k1alamat5, k1kota, k1propinsi, k1kodepos, k1negara, k1kontakperson, k1kontaknohp, k1kontakemail, k1notelp1, k1notelp2, k1nofax, k1email, k1website, k2alamat1, k2alamat2, k2alamat3, k2alamat4, k2alamat5, k2propinsi, k2kota, k2kodepos, k2negara, k2kontakperson, k2kontaknohp, k2kontakemail, k2notelp1, k2notelp2, k2nofax, k2email, k2website, k3alamat1, k3alamat2, k3alamat3, k3alamat4, k3alamat5, k3kota, k3propinsi, k3kodepos, k3negara, k3kontakperson, k3kontaknohp, k3kontakemail, k3notelp1, k3notelp2, k3nofax, k3email, k3website, k4alamat1, k4alamat2, k4alamat3, k4alamat4, k4alamat5, k4kota, k4propinsi, k4kodepos, k4negara, k4kontakperson, k4kontaknohp, k4kontakemail, k4notelp1, k4notelp2, k4nofax, k4email, k4website, knpwp, kpkp, kbatashutang, kterminbeli, krekhutang, kbagpembelian, kfobbeli, kviabeli, kbataspiutang, kterminjual, krekpiutang, kbagpenjualan, ktingkatjual, kfobjual, kviajual, ktglkontrak, kbank, knorekening, kjeniskelamin, kmatauang, ktgllahir, ktglnikah, kkomisipenjualan, kcatatan, kinputuser, kinputtgl, kcustomtext1, kcustomtext2, kcustomtext3, kcustomtext4, kcustomtext5, kcustomtext6, kcustomtext7, kcustomtext8, kcustomtext9, kmodifikasiuser, kmodifikasitgl, kcustomtext10, kcustomint1, kcustomint2, kcustomint3, kcustomdbl1, kcustomdbl2, kcustomdbl3, kcustomdate1, kcustomdate2, kcustomdate3, kkomisikode, khargacustom) values('{FixQuotes_drutama}kkode', '{FixQuotes_drutama}knama', '{FixQuotes_drutama}kkategori', '{FixQuotes_drutama}kkategorinama', '{FixQuotes_drutama}kcabang', '{FixQuotes_drutama}kcabangnama', '{FixQuotes_drutama}klokasi', '{FixQuotes_drutama}klokasinama', '{FixQuotes_drutama}kgudang', '{FixQuotes_drutama}kgudangnama', '{FixQuotes_drutama}kkategorisalesman', '{FixQuotes_drutama}kkategorisalesmannama', '{FixQuotes_drutama}karea', '{FixQuotes_drutama}kareanama', '{FixQuotes_drutama}kkategoricustomer', '{FixQuotes_drutama}kkategoricustomernama', '{FixQuotes_drutama}kkategorisupplier', '{FixQuotes_drutama}kkategorisuppliernama', '{FixQuotes_drutama}kdivisi', '{FixQuotes_drutama}kdivisinama', '{FixQuotes_drutama}ksubdivisi', '{FixQuotes_drutama}ksubdivisinama', {drutama}ksalesman, '{FixQuotes_drutama}ksalesmannama', '{FixQuotes_drutama}kkontakperson', {drutama}kterminglobal, {drutama}kaktif, '{FixQuotes_AsFormatTanggal_drutama}kaktiftgl', '{FixQuotes_drutama}k1alamat1', '{FixQuotes_drutama}k1alamat2', '{FixQuotes_drutama}k1alamat3', '{FixQuotes_drutama}k1alamat4', '{FixQuotes_drutama}k1alamat5', '{FixQuotes_drutama}k1kota', '{FixQuotes_drutama}k1propinsi', '{FixQuotes_drutama}k1kodepos', '{FixQuotes_drutama}k1negara', '{FixQuotes_drutama}k1kontakperson', '{FixQuotes_drutama}k1kontaknohp', '{FixQuotes_drutama}k1kontakemail', '{FixQuotes_drutama}k1notelp1', '{FixQuotes_drutama}k1notelp2', '{FixQuotes_drutama}k1nofax', '{FixQuotes_drutama}k1email', '{FixQuotes_drutama}k1website', '{FixQuotes_drutama}k2alamat1', '{FixQuotes_drutama}k2alamat2', '{FixQuotes_drutama}k2alamat3', '{FixQuotes_drutama}k2alamat4', '{FixQuotes_drutama}k2alamat5', '{FixQuotes_drutama}k2propinsi', '{FixQuotes_drutama}k2kota', '{FixQuotes_drutama}k2kodepos', '{FixQuotes_drutama}k2negara', '{FixQuotes_drutama}k2kontakperson', '{FixQuotes_drutama}k2kontaknohp', '{FixQuotes_drutama}k2kontakemail', '{FixQuotes_drutama}k2notelp1', '{FixQuotes_drutama}k2notelp2', '{FixQuotes_drutama}k2nofax', '{FixQuotes_drutama}k2email', '{FixQuotes_drutama}k2website', '{FixQuotes_drutama}k3alamat1', '{FixQuotes_drutama}k3alamat2', '{FixQuotes_drutama}k3alamat3', '{FixQuotes_drutama}k3alamat4', '{FixQuotes_drutama}k3alamat5', '{FixQuotes_drutama}k3kota', '{FixQuotes_drutama}k3propinsi', '{FixQuotes_drutama}k3kodepos', '{FixQuotes_drutama}k3negara', '{FixQuotes_drutama}k3kontakperson', '{FixQuotes_drutama}k3kontaknohp', '{FixQuotes_drutama}k3kontakemail', '{FixQuotes_drutama}k3notelp1', '{FixQuotes_drutama}k3notelp2', '{FixQuotes_drutama}k3nofax', '{FixQuotes_drutama}k3email', '{FixQuotes_drutama}k3website', '{FixQuotes_drutama}k4alamat1', '{FixQuotes_drutama}k4alamat2', '{FixQuotes_drutama}k4alamat3', '{FixQuotes_drutama}k4alamat4', '{FixQuotes_drutama}k4alamat5', '{FixQuotes_drutama}k4kota', '{FixQuotes_drutama}k4propinsi', '{FixQuotes_drutama}k4kodepos', '{FixQuotes_drutama}k4negara', '{FixQuotes_drutama}k4kontakperson', '{FixQuotes_drutama}k4kontaknohp', '{FixQuotes_drutama}k4kontakemail', '{FixQuotes_drutama}k4notelp1', '{FixQuotes_drutama}k4notelp2', '{FixQuotes_drutama}k4nofax', '{FixQuotes_drutama}k4email', '{FixQuotes_drutama}k4website', '{FixQuotes_drutama}knpwp', {drutama}kpkp, '{FixDouble_drutama}kbatashutang', '{FixQuotes_drutama}kterminbeli', '{FixQuotes_drutama}krekhutang', {drutama}kbagpembelian, '{FixQuotes_drutama}kfobbeli', '{FixQuotes_drutama}kviabeli', '{FixDouble_drutama}kbataspiutang', '{FixQuotes_drutama}kterminjual', '{FixQuotes_drutama}krekpiutang', {drutama}kbagpenjualan, {drutama}ktingkatjual, '{FixQuotes_drutama}kfobjual', '{FixQuotes_drutama}kviajual', '{FixQuotes_AsFormatTanggal_drutama}ktglkontrak', '{FixQuotes_drutama}kbank', '{FixQuotes_drutama}knorekening', {drutama}kjeniskelamin, '{FixQuotes_drutama}kmatauang', '{FixQuotes_AsFormatTanggal_drutama}ktgllahir', '{FixQuotes_AsFormatTanggal_drutama}ktglnikah', '{FixDouble_drutama}kkomisipenjualan', '{FixQuotes_drutama}kcatatan', {drutama}kinputuser, NOW(), '{FixQuotes_drutama}kcustomtext1', '{FixQuotes_drutama}kcustomtext2', '{FixQuotes_drutama}kcustomtext3', '{FixQuotes_drutama}kcustomtext4', '{FixQuotes_drutama}kcustomtext5', '{FixQuotes_drutama}kcustomtext6', '{FixQuotes_drutama}kcustomtext7', '{FixQuotes_drutama}kcustomtext8', '{FixQuotes_drutama}kcustomtext9', {drutama}kmodifikasiuser, '1971-01-01 00:00:00', '{FixQuotes_drutama}kcustomtext10', {drutama}kcustomint1, {drutama}kcustomint2, {drutama}kcustomint3, '{FixDouble_drutama}kcustomdbl1', '{FixDouble_drutama}kcustomdbl2', '{FixDouble_drutama}kcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}kcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}kcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}kcustomdate3', '{FixQuotes_drutama}kkomisikode', '{FixDouble_drutama}khargacustom')
```

```sql
select kid from M1_Contact where kkode='{FixQuotes_drutama}kkode' AND kkategori='{FixQuotes_drutama}kkategori' AND kinputuser= '{userid}' order by kmodifikasitgl desc limit 1
```

```sql
Delete from M1_Contact_Attention where kaidkontak = '{result_4}'
```

```sql
Insert into M1_Contact_Attention(kaid, kaidkontak, kakodekontak, kanama, kajabatan, kanotelp, kanofax, kanohp, kaemail, kawebsite, kamessenger, kaalamat, katgllahir, katglnikah, kacatatan, kadefault, kainputuser, kainputtgl, kamodifikasiuser, kamodifikasitgl) values{strValue2_ToString}
```

```sql
Insert into M1_Contact_Attention(kaidkontak, kakodekontak, kanama, kajabatan, kanotelp, kanofax, kanohp, kaemail, kawebsite, kamessenger, kaalamat, katgllahir, katglnikah, kacatatan, kadefault, kainputuser, kainputtgl, kamodifikasiuser, kamodifikasitgl) values{strValue2_ToString}
```

```sql
Delete from M1_Contact_Price where khidkontak =
```

```sql
Insert into M1_Contact_Price(khidkontak, khidbarang, khsatuan, khkomisi, khhargabeli, khhargajual, khberlakudari, khberlakusampai, khcatatan, khinputuser, khinputtgl, khmodifikasiuser, khmodifikasitgl, khcustomtext1, khcustomtext2, khcustomtext3, khcustomtext4, khcustomtext5, khcustomint1, khcustomint2, khcustomint3, khcustomint4, khcustomint5, khcustomdbl1, khcustomdbl2, khcustomdbl3, khcustomdbl4, khcustomdbl5, khcustomdate1, khcustomdate2, khcustomdate3, khcustomdate4, khcustomdate5) values{strValue2_ToString}
```

```sql
Delete from M1_Salesman_Commission where scidkontak =
```

```sql
Insert into M1_Salesman_Commission(scidkontak, sckomisi1, sckomisi2, sckomisi3, sckomisi4, sckomisi5, sckomisi6, sckomisi7, sckomisi8, sckomisi9, sckomisi10, sccustomtext1, sccustomtext2, sccustomtext3, sccustomtext4, sccustomtext5, sccustomtext6, sccustomtext7, sccustomtext8, sccustomtext9, sccustomtext10, sccustomint1, sccustomint2, sccustomint3, sccustomint4, sccustomint5, sccustomint6, sccustomint7, sccustomint8, sccustomint9, sccustomint10, sccustomdbl1, sccustomdbl2, sccustomdbl3, sccustomdbl4, sccustomdbl5, sccustomdbl6, sccustomdbl7, sccustomdbl8, sccustomdbl9, sccustomdbl10, sccustomdate1, sccustomdate2, sccustomdate3, sccustomdate4, sccustomdate5, sccustomdate6, sccustomdate7, sccustomdate8, sccustomdate9, sccustomdate10) values{strValue2_ToString}
```

```sql
DELETE FROM M1_Contact_Price WHERE khidkontak = '{idtransaksi}'
```

```sql
DELETE FROM M1_Contact_Attention WHERE kaidkontak = '{idtransaksi}'
```

```sql
DELETE FROM M1_Contact WHERE kid = '{idtransaksi}'
```

```sql
SELECT c.kid AS kid, c.kkode AS kkode, c.knama AS knama, c.kkategori AS kkategori, cc.ccnama AS kkategorinama, c.kcabang AS kcabang, c.klokasi AS klokasi, c.kgudang AS kgudang, c.kkategorisalesman AS kkategorisalesman, sc.scnama AS kkategorisalesmannama, c.karea AS karea, a.anama AS kareanama, c.kkategoricustomer AS kkategoricustomer, custc.ccnama AS kkategoricustomernama, c.kkategorisupplier AS kkategorisupplier, suppc.scnama AS kkategorisuppliernama, c.ksalesman AS ksalesman, cs.knama AS ksalesmannama, ca.kanama AS kkontakperson, c.kaktif AS kaktif, c.k1alamat1 AS k1alamat1, c.k1alamat2 AS k1alamat2, c.k1kota AS k1kota, c.k1propinsi AS k1propinsi, c.k1kodepos AS k1kodepos, c.k1negara AS k1negara, c.k1kontakperson AS k1kontakperson, c.k1notelp1 AS k1notelp1, c.k2alamat1 AS k2alamat1, c.k2alamat2 AS k2alamat2, c.k2propinsi AS k2propinsi, c.k2kota AS k2kota, c.k2kodepos AS k2kodepos, c.k2negara AS k2negara, c.k2kontakperson AS k2kontakperson, c.k2notelp1 AS k2notelp1, c.kterminbeli AS kterminbeli, c.kterminjual AS kterminjual, c.ktingkatjual AS ktingkatjual, c.kkomisipenjualan AS kkomisipenjualan, cs.kkode AS ksalesmankode, cp.cppoin, c.kpkp, IFNULL(dcc.dccnilai,0) as dccnilai from `m1_contact` `c` join `m0_user` `u` on `u`.`userid` = 'valuserid' and (`c`.`klokasi` = '' or `c`.`klokasi` = `u`.`ulokasi`) left join `m1_contact` `cs` on `c`.`ksalesman` = `cs`.`kid` left join `m1_contact_attention` `ca` on `c`.`kid` = `ca`.`kaidkontak` and `ca`.`kadefault` = 1 left join `m1_area` `a` on `c`.`karea` = `a`.`akode` left join `m1_contact_category` `cc` on `c`.`kkategori` = `cc`.`cckode` left join `m1_salesman_category` `sc` on `c`.`kkategorisalesman` = `sc`.`sckode` left join `m1_customer_category` `custc` on `c`.`kkategoricustomer` = `custc`.`cckode` left join `m1_supplier_category` `suppc` on `c`.`kkategorisupplier` = `suppc`.`sckode` left join m1_contact_point cp ON c.kid = cp.cpidkontak left join m1_location l on u.ulokasi = l.lkode left join m_12_pos_discount_category_customer dcc on l.lkategoripos = dcc.dcckategori and c.kkategoricustomer = dcc.dcckategoricustomer
```

```sql
SELECT c.kid AS kid, c.kkode AS kkode, c.knama AS knama, c.kkategori AS kkategori, cc.ccnama AS kkategorinama, c.kcabang AS kcabang, c.klokasi AS klokasi, c.kgudang AS kgudang, c.kkategorisalesman AS kkategorisalesman, sc.scnama AS kkategorisalesmannama, c.karea AS karea, a.anama AS kareanama, c.kkategoricustomer AS kkategoricustomer, custc.ccnama AS kkategoricustomernama, c.kkategorisupplier AS kkategorisupplier, suppc.scnama AS kkategorisuppliernama, c.ksalesman AS ksalesman, cs.knama AS ksalesmannama, ca.kanama AS kkontakperson, c.kaktif AS kaktif, c.k1alamat1 AS k1alamat1, c.k1alamat2 AS k1alamat2, c.k1kota AS k1kota, c.k1propinsi AS k1propinsi, c.k1kodepos AS k1kodepos, c.k1negara AS k1negara, c.k1kontakperson AS k1kontakperson, c.k1notelp1 AS k1notelp1, c.k2alamat1 AS k2alamat1, c.k2alamat2 AS k2alamat2, c.k2propinsi AS k2propinsi, c.k2kota AS k2kota, c.k2kodepos AS k2kodepos, c.k2negara AS k2negara, c.k2kontakperson AS k2kontakperson, c.k2notelp1 AS k2notelp1, c.kterminbeli AS kterminbeli, c.kterminjual AS kterminjual, c.ktingkatjual AS ktingkatjual, c.kkomisipenjualan AS kkomisipenjualan, cs.kkode AS ksalesmankode, cp.cppoin, c.kpkp, IFNULL(dcc.dccnilai,0) as dccnilai from `m1_contact` `c` join `m0_user` `u` on `u`.`userid` = 'valuserid' left join `m1_contact` `cs` on `c`.`ksalesman` = `cs`.`kid` left join `m1_contact_attention` `ca` on `c`.`kid` = `ca`.`kaidkontak` and `ca`.`kadefault` = 1 left join `m1_area` `a` on `c`.`karea` = `a`.`akode` left join `m1_contact_category` `cc` on `c`.`kkategori` = `cc`.`cckode` left join `m1_salesman_category` `sc` on `c`.`kkategorisalesman` = `sc`.`sckode` left join `m1_customer_category` `custc` on `c`.`kkategoricustomer` = `custc`.`cckode` left join `m1_supplier_category` `suppc` on `c`.`kkategorisupplier` = `suppc`.`sckode` left join m1_contact_point cp ON c.kid = cp.cpidkontak left join m1_location l on u.ulokasi = l.lkode left join m_12_pos_discount_category_customer dcc on l.lkategoripos = dcc.dcckategori and c.kkategoricustomer = dcc.dcckategoricustomer
```

```sql
SELECT c.kid AS kid, c.kkode AS kkode, c.knama AS knama, c.kkategori AS kkategori, cc.ccnama AS kkategorinama, c.kcabang AS kcabang, c.klokasi AS klokasi, c.kgudang AS kgudang, c.kkategorisalesman AS kkategorisalesman, sc.scnama AS kkategorisalesmannama, c.karea AS karea, a.anama AS kareanama, c.kkategoricustomer AS kkategoricustomer, custc.ccnama AS kkategoricustomernama, c.kkategorisupplier AS kkategorisupplier, suppc.scnama AS kkategorisuppliernama, c.ksalesman AS ksalesman, cs.knama AS ksalesmannama, ca.kanama AS kkontakperson, c.kaktif AS kaktif, c.k1alamat1 AS k1alamat1, c.k1alamat2 AS k1alamat2, c.k1kota AS k1kota, c.k1propinsi AS k1propinsi, c.k1kodepos AS k1kodepos, c.k1negara AS k1negara, c.k1kontakperson AS k1kontakperson, c.k1notelp1 AS k1notelp1, c.k2alamat1 AS k2alamat1, c.k2alamat2 AS k2alamat2, c.k2propinsi AS k2propinsi, c.k2kota AS k2kota, c.k2kodepos AS k2kodepos, c.k2negara AS k2negara, c.k2kontakperson AS k2kontakperson, c.k2notelp1 AS k2notelp1, c.kterminbeli AS kterminbeli, c.kterminjual AS kterminjual, c.ktingkatjual AS ktingkatjual, c.kkomisipenjualan AS kkomisipenjualan, cs.kkode AS ksalesmankode, cp.cppoin, c.kpkp, c.knpwp from `m1_contact` `c` left join `m1_contact` `cs` on `c`.`ksalesman` = `cs`.`kid` left join `m1_contact_attention` `ca` on `c`.`kid` = `ca`.`kaidkontak` and `ca`.`kadefault` = 1 left join `m1_area` `a` on `c`.`karea` = `a`.`akode` left join `m1_contact_category` `cc` on `c`.`kkategori` = `cc`.`cckode` left join `m1_salesman_category` `sc` on `c`.`kkategorisalesman` = `sc`.`sckode` left join `m1_customer_category` `custc` on `c`.`kkategoricustomer` = `custc`.`cckode` left join `m1_supplier_category` `suppc` on `c`.`kkategorisupplier` = `suppc`.`sckode` left join m1_contact_point cp ON c.kid = cp.cpidkontak
```

```sql
select `c1`.`kid` AS `kid`, `c1`.`kkode` AS `kkode`, `c1`.`knama` AS `knama`, `c1`.`kkategori` AS `kkategori`, `cc`.`ccnama` AS `kkategorinama`, `c1`.`kcabang` AS `kcabang`, `br`.`bnama` AS `kcabangnama`, `c1`.`klokasi` AS `klokasi`, `l`.`lnama` AS `klokasinama`, `c1`.`kgudang` AS `kgudang`, `w`.`wnama` AS `kgudangnama`, `c1`.`kkategorisalesman` AS `kkategorisalesman`, `sc`.`scnama` AS `kkategorisalesmannama`, `c1`.`karea` AS `karea`, `a`.`anama` AS `kareanama`, `c1`.`kkategoricustomer` AS `kkategoricustomer`, `cusc`.`ccnama` AS `kkategoricustomernama`, `c1`.`kkategorisupplier` AS `kkategorisupplier`, `suppc`.`scnama` AS `kkategorisuppliernama`, `c1`.`kdivisi` AS `kdivisi`, `d`.`dnama` AS `kdivisinama`, `c1`.`ksubdivisi` AS `ksubdivisi`, `sd`.`sdnama` AS `ksubdivisinama`, `c1`.`ksalesman` AS `ksalesman`, `c2`.`knama` AS `ksalesmannama`, `c1`.`kkontakperson` AS `kkontakperson`, `c1`.`kterminglobal` AS `kterminglobal`, `c1`.`kaktif` AS `kaktif`, `c1`.`kaktiftgl` AS `kaktiftgl`, `c1`.`k1alamat1` AS `k1alamat1`, `c1`.`k1alamat2` AS `k1alamat2`, `c1`.`k1alamat3` AS `k1alamat3`, `c1`.`k1alamat4` AS `k1alamat4`, `c1`.`k1alamat5` AS `k1alamat5`, `c1`.`k1kota` AS `k1kota`, `c1`.`k1propinsi` AS `k1propinsi`, `c1`.`k1kodepos` AS `k1kodepos`, `c1`.`k1negara` AS `k1negara`, `c1`.`k1kontakperson` AS `k1kontakperson`, `c1`.`k1kontaknohp` AS `k1kontaknohp`, `c1`.`k1kontakemail` AS `k1kontakemail`, `c1`.`k1notelp1` AS `k1notelp1`, `c1`.`k1notelp2` AS `k1notelp2`, `c1`.`k1nofax` AS `k1nofax`, `c1`.`k1email` AS `k1email`, `c1`.`k1website` AS `k1website`, `c1`.`k2alamat1` AS `k2alamat1`, `c1`.`k2alamat2` AS `k2alamat2`, `c1`.`k2alamat3` AS `k2alamat3`, `c1`.`k2alamat4` AS `k2alamat4`, `c1`.`k2alamat5` AS `k2alamat5`, `c1`.`k2propinsi` AS `k2propinsi`, `c1`.`k2kota` AS `k2kota`, `c1`.`k2kodepos` AS `k2kodepos`, `c1`.`k2negara` AS `k2negara`, `c1`.`k2kontakperson` AS `k2kontakperson`, `c1`.`k2kontaknohp` AS `k2kontaknohp`, `c1`.`k2kontakemail` AS `k2kontakemail`, `c1`.`k2notelp1` AS `k2notelp1`, `c1`.`k2notelp2` AS `k2notelp2`, `c1`.`k2nofax` AS `k2nofax`, `c1`.`k2email` AS `k2email`, `c1`.`k2website` AS `k2website`, `c1`.`k3alamat1` AS `k3alamat1`, `c1`.`k3alamat2` AS `k3alamat2`, `c1`.`k3alamat3` AS `k3alamat3`, `c1`.`k3alamat4` AS `k3alamat4`, `c1`.`k3alamat5` AS `k3alamat5`, `c1`.`k3kota` AS `k3kota`, `c1`.`k3propinsi` AS `k3propinsi`, `c1`.`k3kodepos` AS `k3kodepos`, `c1`.`k3negara` AS `k3negara`, `c1`.`k3kontakperson` AS `k3kontakperson`, `c1`.`k3kontaknohp` AS `k3kontaknohp`, `c1`.`k3kontakemail` AS `k3kontakemail`, `c1`.`k3notelp1` AS `k3notelp1`, `c1`.`k3notelp2` AS `k3notelp2`, `c1`.`k3nofax` AS `k3nofax`, `c1`.`k3email` AS `k3email`, `c1`.`k3website` AS `k3website`, `c1`.`k4alamat1` AS `k4alamat1`, `c1`.`k4alamat2` AS `k4alamat2`, `c1`.`k4alamat3` AS `k4alamat3`, `c1`.`k4alamat4` AS `k4alamat4`, `c1`.`k4alamat5` AS `k4alamat5`, `c1`.`k4kota` AS `k4kota`, `c1`.`k4propinsi` AS `k4propinsi`, `c1`.`k4kodepos` AS `k4kodepos`, `c1`.`k4negara` AS `k4negara`, `c1`.`k4kontakperson` AS `k4kontakperson`, `c1`.`k4kontaknohp` AS `k4kontaknohp`, `c1`.`k4kontakemail` AS `k4kontakemail`, `c1`.`k4notelp1` AS `k4notelp1`, `c1`.`k4notelp2` AS `k4notelp2`, `c1`.`k4nofax` AS `k4nofax`, `c1`.`k4email` AS `k4email`, `c1`.`k4website` AS `k4website`, `c1`.`knpwp` AS `knpwp`, `c1`.`kpkp` AS `kpkp`, `c1`.`kbatashutang` AS `kbatashutang`, `c1`.`kterminbeli` AS `kterminbeli`, `c1`.`krekhutang` AS `krekhutang`, `c1`.`kbagpembelian` AS `kbagpembelian`, `c1`.`kfobbeli` AS `kfobbeli`, `c1`.`kviabeli` AS `kviabeli`, `c1`.`kbataspiutang` AS `kbataspiutang`, `c1`.`kterminjual` AS `kterminjual`, `c1`.`krekpiutang` AS `krekpiutang`, `c1`.`kbagpenjualan` AS `kbagpenjualan`, `c1`.`ktingkatjual` AS `ktingkatjual`, `c1`.`kfobjual` AS `kfobjual`, `c1`.`kviajual` AS `kviajual`, `c1`.`ktglkontrak` AS `ktglkontrak`, `c1`.`kbank` AS `kbank`, `c1`.`knorekening` AS `knorekening`, `c1`.`kjeniskelamin` AS `kjeniskelamin`, `c1`.`kmatauang` AS `kmatauang`, `c1`.`ktgllahir` AS `ktgllahir`, `c1`.`ktglnikah` AS `ktglnikah`, `c1`.`kkomisipenjualan` AS `kkomisipenjualan`, `c1`.`kcatatan` AS `kcatatan`, `c1`.`kinputuser` AS `kinputuser`, `c1`.`kinputtgl` AS `kinputtgl`, `c1`.`kcustomtext1` AS `kcustomtext1`, `c1`.`kcustomtext2` AS `kcustomtext2`, `c1`.`kcustomtext3` AS `kcustomtext3`, `c1`.`kcustomtext4` AS `kcustomtext4`, `c1`.`kcustomtext5` AS `kcustomtext5`, `c1`.`kcustomtext6` AS `kcustomtext6`, `c1`.`kcustomtext7` AS `kcustomtext7`, `c1`.`kcustomtext8` AS `kcustomtext8`, `c1`.`kcustomtext9` AS `kcustomtext9`, `c1`.`kmodifikasiuser` AS `kmodifikasiuser`, `c1`.`kmodifikasitgl` AS `kmodifikasitgl`, `c1`.`kcustomtext10` AS `kcustomtext10`, `c1`.`kcustomint1` AS `kcustomint1`, `c1`.`kcustomint2` AS `kcustomint2`, `c1`.`kcustomint3` AS `kcustomint3`, `c1`.`kcustomdbl1` AS `kcustomdbl1`, `c1`.`kcustomdbl2` AS `kcustomdbl2`, `c1`.`kcustomdbl3` AS `kcustomdbl3`, `c1`.`kcustomdate1` AS `kcustomdate1`, `c1`.`kcustomdate2` AS `kcustomdate2`, `c1`.`kcustomdate3` AS `kcustomdate3`, `c2`.`kkode` AS `ksalesmankode`, `coa1`.`cnama` AS `krekhutangnama`, `c3`.`kkode` AS `kbagpembeliankode`, `c3`.`knama` AS `kbagpembeliannama`, `coa2`.`cnama` AS `krekpiutangnama`, `c4`.`kkode` AS `kbagpenjualankode`, `c4`.`knama` AS `kbagpenjualannama`, `b`.`bnama` AS `kbanknama`, `sr`.`nama` AS `ktingkatjualnama`, c1.kkomisikode, comm.kmnama as kkomisinama, `ca`.`kaid` AS `kaid`, `ca`.`kaidkontak` AS `kaidkontak`, `ca`.`kakodekontak` AS `kakodekontak`, `ca`.`kanama` AS `kanama`, `ca`.`kajabatan` AS `kajabatan`, `ca`.`kanotelp` AS `kanotelp`, `ca`.`kanofax` AS `kanofax`, `ca`.`kanohp` AS `kanohp`, `ca`.`kaemail` AS `kaemail`, `ca`.`kawebsite` AS `kawebsite`, `ca`.`kamessenger` AS `kamessenger`, `ca`.`kaalamat` AS `kaalamat`, `ca`.`katgllahir` AS `katgllahir`, `ca`.`katglnikah` AS `katglnikah`, `ca`.`kacatatan` AS `kacatatan`, `ca`.`kadefault` AS `kadefault`, `ca`.`kainputuser` AS `kainputuser`, `ca`.`kainputtgl` AS `kainputtgl`, `ca`.`kamodifikasiuser` AS `kamodifikasiuser`, `ca`.`kamodifikasitgl` AS `kamodifikasitgl`, c1.khargacustom from `m1_contact` `c1` left join `m1_contact` `c2` on `c1`.`ksalesman` = `c2`.`kid` left join `m1_coa` `coa1` on `c1`.`krekhutang` = `coa1`.`cnomor` left join `m1_contact` `c3` on `c1`.`kbagpembelian` = `c3`.`kid` left join `m1_coa` `coa2` on `c1`.`krekpiutang` = `coa2`.`cnomor` left join `m1_contact` `c4` on `c1`.`kbagpenjualan` = `c4`.`kid` left join `m1_bank` `b` on `c1`.`kbank` = `b`.`bkode` left join `m1_contact_attention` `ca` on `c1`.`kid` = `ca`.`kaidkontak` left join `m1_contact_category` `cc` on `c1`.`kkategori` = `cc`.`cckode` left join `m1_branch` `br` on `c1`.`kcabang` = `br`.`bkode` left join `m1_location` `l` on `c1`.`klokasi` = `l`.`lkode` left join `m1_warehouse` `w` on `c1`.`kgudang` = `w`.`wkode` left join `m1_salesman_category` `sc` on `c1`.`kkategorisalesman` = `sc`.`sckode` left join `m1_area` `a` on `c1`.`karea` = `a`.`akode` left join `m1_customer_category` `cusc` on `c1`.`kkategoricustomer` = `cusc`.`cckode` left join `m1_supplier_category` `suppc` on `c1`.`kkategorisupplier` = `suppc`.`sckode` left join `m1_division` `d` on `c1`.`kdivisi` = `d`.`dkode` left join `m1_subdivision` `sd` on `c1`.`ksubdivisi` = `sd`.`sdkode` left join `m0_selling_rate` `sr` on `c1`.`ktingkatjual` = `sr`.`kode` left join m1_commission comm on c1.kkomisikode = comm.kmkode
```

```sql
SELECT cp.khidkontak, cp.khidbarang, i.bkode, i.bnama, cp.khsatuan, cp.khkomisi, cp.khhargabeli, cp.khhargajual, cp.khberlakudari, cp.khberlakusampai, cp.khcatatan, cp.khinputuser, cp.khinputtgl, cp.khmodifikasiuser, cp.khmodifikasitgl, cp.khcustomtext1, cp.khcustomtext2, cp.khcustomtext3, cp.khcustomtext4, cp.khcustomtext5, cp.khcustomint1, cp.khcustomint2, cp.khcustomint3, cp.khcustomint4, cp.khcustomint5, cp.khcustomdbl1, cp.khcustomdbl2, cp.khcustomdbl3, cp.khcustomdbl4, cp.khcustomdbl5, cp.khcustomdate1, cp.khcustomdate2, cp.khcustomdate3, cp.khcustomdate4, cp.khcustomdate5 FROM m1_contact_price cp JOIN m1_contact c ON cp.khidkontak = c.kid AND cp.khidkontak = '{FixDouble_idtransaksi}' JOIN m1_item i ON cp.khidbarang = i.bid
```

```sql
SELECT * FROM m1_salesman_commission where scidkontak = '{FixDouble_idtransaksi}'
```

```sql
SELECT COUNT(kid) FROM m1_contact WHERE kkode='{kode}' AND kkategori='{kategori}'
```

```sql
SELECT COUNT(kid) FROM M1_Contact WHERE kid='{dataUtama_0}'
```

```sql
Update M1_Contact set kkode = '{FixQuotes_dataUtama_1}', knama = '{FixQuotes_dataUtama_2}', kkategori = '{FixQuotes_dataUtama_3}', kkategorinama = '{FixQuotes_dataUtama_4}', kcabang = '{FixQuotes_dataUtama_5}', kcabangnama = '{FixQuotes_dataUtama_6}', klokasi = '{FixQuotes_dataUtama_7}', klokasinama = '{FixQuotes_dataUtama_8}', kgudang = '{FixQuotes_dataUtama_9}', kgudangnama = '{FixQuotes_dataUtama_10}', kkategorisalesman = '{FixQuotes_dataUtama_11}', kkategorisalesmannama = '{FixQuotes_dataUtama_12}', karea = '{FixQuotes_dataUtama_13}', kareanama = '{FixQuotes_dataUtama_14}', kkategoricustomer = '{FixQuotes_dataUtama_15}', kkategoricustomernama = '{FixQuotes_dataUtama_16}', kdivisi = '{FixQuotes_dataUtama_17}', kdivisinama = '{FixQuotes_dataUtama_18}', ksubdivisi = '{FixQuotes_dataUtama_19}', ksubdivisinama = '{FixQuotes_dataUtama_20}', ksalesman = {dataUtama_21}, ksalesmannama = '{FixQuotes_dataUtama_22}', kkontakperson = '{FixQuotes_dataUtama_23}', kterminglobal = {dataUtama_24}, kaktif = {dataUtama_25}, kaktiftgl = '{FixQuotes_AsFormatTanggal_dataUtama_26}', k1alamat1 = '{FixQuotes_dataUtama_27}', k1alamat2 = '{FixQuotes_dataUtama_28}', k1alamat3 = '{FixQuotes_dataUtama_29}', k1alamat4 = '{FixQuotes_dataUtama_30}', k1alamat5 = '{FixQuotes_dataUtama_31}', k1kota = '{FixQuotes_dataUtama_32}', k1propinsi = '{FixQuotes_dataUtama_33}', k1kodepos = '{FixQuotes_dataUtama_34}', k1negara = '{FixQuotes_dataUtama_35}', k1kontakperson = '{FixQuotes_dataUtama_36}', k1kontaknohp = '{FixQuotes_dataUtama_37}', k1kontakemail = '{FixQuotes_dataUtama_38}', k1notelp1 = '{FixQuotes_dataUtama_39}', k1notelp2 = '{FixQuotes_dataUtama_40}', k1nofax = '{FixQuotes_dataUtama_41}', k1email = '{FixQuotes_dataUtama_42}', k1website = '{FixQuotes_dataUtama_43}', k2alamat1 = '{FixQuotes_dataUtama_44}', k2alamat2 = '{FixQuotes_dataUtama_45}', k2alamat3 = '{FixQuotes_dataUtama_46}', k2alamat4 = '{FixQuotes_dataUtama_47}', k2alamat5 = '{FixQuotes_dataUtama_48}', k2propinsi = '{FixQuotes_dataUtama_49}', k2kota = '{FixQuotes_dataUtama_50}', k2kodepos = '{FixQuotes_dataUtama_51}', k2negara = '{FixQuotes_dataUtama_52}', k2kontakperson = '{FixQuotes_dataUtama_53}', k2kontaknohp = '{FixQuotes_dataUtama_54}', k2kontakemail = '{FixQuotes_dataUtama_55}', k2notelp1 = '{FixQuotes_dataUtama_56}', k2notelp2 = '{FixQuotes_dataUtama_57}', k2nofax = '{FixQuotes_dataUtama_58}', k2email = '{FixQuotes_dataUtama_59}', k2website = '{FixQuotes_dataUtama_60}', k3alamat1 = '{FixQuotes_dataUtama_61}', k3alamat2 = '{FixQuotes_dataUtama_62}', k3alamat3 = '{FixQuotes_dataUtama_63}', k3alamat4 = '{FixQuotes_dataUtama_64}', k3alamat5 = '{FixQuotes_dataUtama_65}', k3kota = '{FixQuotes_dataUtama_66}', k3propinsi = '{FixQuotes_dataUtama_67}', k3kodepos = '{FixQuotes_dataUtama_68}', k3negara = '{FixQuotes_dataUtama_69}', k3kontakperson = '{FixQuotes_dataUtama_70}', k3kontaknohp = '{FixQuotes_dataUtama_71}', k3kontakemail = '{FixQuotes_dataUtama_72}', k3notelp1 = '{FixQuotes_dataUtama_73}', k3notelp2 = '{FixQuotes_dataUtama_74}', k3nofax = '{FixQuotes_dataUtama_75}', k3email = '{FixQuotes_dataUtama_76}', k3website = '{FixQuotes_dataUtama_77}', k4alamat1 = '{FixQuotes_dataUtama_78}', k4alamat2 = '{FixQuotes_dataUtama_79}', k4alamat3 = '{FixQuotes_dataUtama_80}', k4alamat4 = '{FixQuotes_dataUtama_81}', k4alamat5 = '{FixQuotes_dataUtama_82}', k4kota = '{FixQuotes_dataUtama_83}', k4propinsi = '{FixQuotes_dataUtama_84}', k4kodepos = '{FixQuotes_dataUtama_85}', k4negara = '{FixQuotes_dataUtama_86}', k4kontakperson = '{FixQuotes_dataUtama_87}', k4kontaknohp = '{FixQuotes_dataUtama_88}', k4kontakemail = '{FixQuotes_dataUtama_89}', k4notelp1 = '{FixQuotes_dataUtama_90}', k4notelp2 = '{FixQuotes_dataUtama_91}', k4nofax = '{FixQuotes_dataUtama_92}', k4email = '{FixQuotes_dataUtama_93}', k4website = '{FixQuotes_dataUtama_94}', knpwp = '{FixQuotes_dataUtama_95}', kpkp = {dataUtama_96}, kbatashutang = '{FixDouble_dataUtama_97}', kterminbeli = '{FixQuotes_dataUtama_98}', krekhutang = '{FixQuotes_dataUtama_99}', kbagpembelian = {dataUtama_100}, kfobbeli = '{FixQuotes_dataUtama_101}', kviabeli = '{FixQuotes_dataUtama_102}', kbataspiutang = '{FixDouble_dataUtama_103}', kterminjual = '{FixQuotes_dataUtama_104}', krekpiutang = '{FixQuotes_dataUtama_105}', kbagpenjualan = {dataUtama_106}, ktingkatjual = {dataUtama_107}, kfobjual = '{FixQuotes_dataUtama_108}', kviajual = '{FixQuotes_dataUtama_109}', ktglkontrak = '{FixQuotes_AsFormatTanggal_dataUtama_110}', kbank = '{FixQuotes_dataUtama_111}', knorekening = '{FixQuotes_dataUtama_112}', kjeniskelamin = {dataUtama_113}, kmatauang = '{FixQuotes_dataUtama_114}', ktgllahir = '{FixQuotes_AsFormatTanggal_dataUtama_115}', ktglnikah = '{FixQuotes_AsFormatTanggal_dataUtama_116}', kkomisipenjualan = '{FixDouble_dataUtama_117}', kcatatan = '{FixQuotes_dataUtama_118}', kinputuser = {dataUtama_119}, kinputtgl = '{FixQuotes_AsFormatTanggal_dataUtama_120}yyyy-MM-dd H:mm:ss', kcustomtext1 = '{FixQuotes_dataUtama_121}', kcustomtext2 = '{FixQuotes_dataUtama_122}', kcustomtext3 = '{FixQuotes_dataUtama_123}', kcustomtext4 = '{FixQuotes_dataUtama_124}', kcustomtext5 = '{FixQuotes_dataUtama_125}', kcustomtext6 = '{FixQuotes_dataUtama_126}', kcustomtext7 = '{FixQuotes_dataUtama_127}', kcustomtext8 = '{FixQuotes_dataUtama_128}', kcustomtext9 = '{FixQuotes_dataUtama_129}', kmodifikasiuser = {dataUtama_130}, kmodifikasitgl = '{FixQuotes_AsFormatTanggal_dataUtama_131}yyyy-MM-dd H:mm:ss', kcustomtext10 = '{FixQuotes_dataUtama_132}', kcustomint1 = {dataUtama_133}, kcustomint2 = {dataUtama_134}, kcustomint3 = {dataUtama_135}, kcustomdbl1 = '{FixDouble_dataUtama_136}', kcustomdbl2 = '{FixDouble_dataUtama_137}', kcustomdbl3 = '{FixDouble_dataUtama_138}', kcustomdate1 = '{FixQuotes_AsFormatTanggal_dataUtama_139}', kcustomdate2 = '{FixQuotes_AsFormatTanggal_dataUtama_140}', kcustomdate3 = '{FixQuotes_AsFormatTanggal_dataUtama_141}' where kid = '{dataUtama_0}'
```

```sql
SELECT kid FROM m1_contact WHERE kkode = '{FixQuotes_dataUtama_1}' AND kkategori = '{FixQuotes_dataUtama_3}'
```

```sql
Insert into M1_Contact (kkode, knama, kkategori, kkategorinama, kcabang, kcabangnama, klokasi, klokasinama, kgudang, kgudangnama, kkategorisalesman, kkategorisalesmannama, karea, kareanama, kkategoricustomer, kkategoricustomernama, kdivisi, kdivisinama, ksubdivisi, ksubdivisinama, ksalesman, ksalesmannama, kkontakperson, kterminglobal, kaktif, kaktiftgl, k1alamat1, k1alamat2, k1alamat3, k1alamat4, k1alamat5, k1kota, k1propinsi, k1kodepos, k1negara, k1kontakperson, k1kontaknohp, k1kontakemail, k1notelp1, k1notelp2, k1nofax, k1email, k1website, k2alamat1, k2alamat2, k2alamat3, k2alamat4, k2alamat5, k2propinsi, k2kota, k2kodepos, k2negara, k2kontakperson, k2kontaknohp, k2kontakemail, k2notelp1, k2notelp2, k2nofax, k2email, k2website, k3alamat1, k3alamat2, k3alamat3, k3alamat4, k3alamat5, k3kota, k3propinsi, k3kodepos, k3negara, k3kontakperson, k3kontaknohp, k3kontakemail, k3notelp1, k3notelp2, k3nofax, k3email, k3website, k4alamat1, k4alamat2, k4alamat3, k4alamat4, k4alamat5, k4kota, k4propinsi, k4kodepos, k4negara, k4kontakperson, k4kontaknohp, k4kontakemail, k4notelp1, k4notelp2, k4nofax, k4email, k4website, knpwp, kpkp, kbatashutang, kterminbeli, krekhutang, kbagpembelian, kfobbeli, kviabeli, kbataspiutang, kterminjual, krekpiutang, kbagpenjualan, ktingkatjual, kfobjual, kviajual, ktglkontrak, kbank, knorekening, kjeniskelamin, kmatauang, ktgllahir, ktglnikah, kkomisipenjualan, kcatatan, kinputuser, kinputtgl, kcustomtext1, kcustomtext2, kcustomtext3, kcustomtext4, kcustomtext5, kcustomtext6, kcustomtext7, kcustomtext8, kcustomtext9, kmodifikasiuser, kmodifikasitgl, kcustomtext10, kcustomint1, kcustomint2, kcustomint3, kcustomdbl1, kcustomdbl2, kcustomdbl3, kcustomdate1, kcustomdate2, kcustomdate3) values('{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', '{FixQuotes_dataUtama_4}', '{FixQuotes_dataUtama_5}', '{FixQuotes_dataUtama_6}', '{FixQuotes_dataUtama_7}', '{FixQuotes_dataUtama_8}', '{FixQuotes_dataUtama_9}', '{FixQuotes_dataUtama_10}', '{FixQuotes_dataUtama_11}', '{FixQuotes_dataUtama_12}', '{FixQuotes_dataUtama_13}', '{FixQuotes_dataUtama_14}', '{FixQuotes_dataUtama_15}', '{FixQuotes_dataUtama_16}', '{FixQuotes_dataUtama_17}', '{FixQuotes_dataUtama_18}', '{FixQuotes_dataUtama_19}', '{FixQuotes_dataUtama_20}', {dataUtama_21}, '{FixQuotes_dataUtama_22}', '{FixQuotes_dataUtama_23}', {dataUtama_24}, {dataUtama_25}, '{FixQuotes_AsFormatTanggal_dataUtama_26}', '{FixQuotes_dataUtama_27}', '{FixQuotes_dataUtama_28}', '{FixQuotes_dataUtama_29}', '{FixQuotes_dataUtama_30}', '{FixQuotes_dataUtama_31}', '{FixQuotes_dataUtama_32}', '{FixQuotes_dataUtama_33}', '{FixQuotes_dataUtama_34}', '{FixQuotes_dataUtama_35}', '{FixQuotes_dataUtama_36}', '{FixQuotes_dataUtama_37}', '{FixQuotes_dataUtama_38}', '{FixQuotes_dataUtama_39}', '{FixQuotes_dataUtama_40}', '{FixQuotes_dataUtama_41}', '{FixQuotes_dataUtama_42}', '{FixQuotes_dataUtama_43}', '{FixQuotes_dataUtama_44}', '{FixQuotes_dataUtama_45}', '{FixQuotes_dataUtama_46}', '{FixQuotes_dataUtama_47}', '{FixQuotes_dataUtama_48}', '{FixQuotes_dataUtama_49}', '{FixQuotes_dataUtama_50}', '{FixQuotes_dataUtama_51}', '{FixQuotes_dataUtama_52}', '{FixQuotes_dataUtama_53}', '{FixQuotes_dataUtama_54}', '{FixQuotes_dataUtama_55}', '{FixQuotes_dataUtama_56}', '{FixQuotes_dataUtama_57}', '{FixQuotes_dataUtama_58}', '{FixQuotes_dataUtama_59}', '{FixQuotes_dataUtama_60}', '{FixQuotes_dataUtama_61}', '{FixQuotes_dataUtama_62}', '{FixQuotes_dataUtama_63}', '{FixQuotes_dataUtama_64}', '{FixQuotes_dataUtama_65}', '{FixQuotes_dataUtama_66}', '{FixQuotes_dataUtama_67}', '{FixQuotes_dataUtama_68}', '{FixQuotes_dataUtama_69}', '{FixQuotes_dataUtama_70}', '{FixQuotes_dataUtama_71}', '{FixQuotes_dataUtama_72}', '{FixQuotes_dataUtama_73}', '{FixQuotes_dataUtama_74}', '{FixQuotes_dataUtama_75}', '{FixQuotes_dataUtama_76}', '{FixQuotes_dataUtama_77}', '{FixQuotes_dataUtama_78}', '{FixQuotes_dataUtama_79}', '{FixQuotes_dataUtama_80}', '{FixQuotes_dataUtama_81}', '{FixQuotes_dataUtama_82}', '{FixQuotes_dataUtama_83}', '{FixQuotes_dataUtama_84}', '{FixQuotes_dataUtama_85}', '{FixQuotes_dataUtama_86}', '{FixQuotes_dataUtama_87}', '{FixQuotes_dataUtama_88}', '{FixQuotes_dataUtama_89}', '{FixQuotes_dataUtama_90}', '{FixQuotes_dataUtama_91}', '{FixQuotes_dataUtama_92}', '{FixQuotes_dataUtama_93}', '{FixQuotes_dataUtama_94}', '{FixQuotes_dataUtama_95}', {dataUtama_96}, '{FixDouble_dataUtama_97}', '{FixQuotes_dataUtama_98}', '{FixQuotes_dataUtama_99}', {dataUtama_100}, '{FixQuotes_dataUtama_101}', '{FixQuotes_dataUtama_102}', '{FixDouble_dataUtama_103}', '{FixQuotes_dataUtama_104}', '{FixQuotes_dataUtama_105}', {dataUtama_106}, {dataUtama_107}, '{FixQuotes_dataUtama_108}', '{FixQuotes_dataUtama_109}', '{FixQuotes_AsFormatTanggal_dataUtama_110}', '{FixQuotes_dataUtama_111}', '{FixQuotes_dataUtama_112}', {dataUtama_113}, '{FixQuotes_dataUtama_114}', '{FixQuotes_AsFormatTanggal_dataUtama_115}', '{FixQuotes_AsFormatTanggal_dataUtama_116}', '{FixDouble_dataUtama_117}', '{FixQuotes_dataUtama_118}', {dataUtama_119}, '{FixQuotes_AsFormatTanggal_dataUtama_120}yyyy-MM-dd H:mm:ss', '{FixQuotes_dataUtama_121}', '{FixQuotes_dataUtama_122}', '{FixQuotes_dataUtama_123}', '{FixQuotes_dataUtama_124}', '{FixQuotes_dataUtama_125}', '{FixQuotes_dataUtama_126}', '{FixQuotes_dataUtama_127}', '{FixQuotes_dataUtama_128}', '{FixQuotes_dataUtama_129}', {dataUtama_130}, '{FixQuotes_AsFormatTanggal_dataUtama_131}yyyy-MM-dd H:mm:ss', '{FixQuotes_dataUtama_132}', {dataUtama_133}, {dataUtama_134}, {dataUtama_135}, '{FixDouble_dataUtama_136}', '{FixDouble_dataUtama_137}', '{FixDouble_dataUtama_138}', '{FixQuotes_AsFormatTanggal_dataUtama_139}', '{FixQuotes_AsFormatTanggal_dataUtama_140}', '{FixQuotes_AsFormatTanggal_dataUtama_141}')
```

```sql
SELECT ca.kaid, ca.kaidkontak, ca.kakodekontak, ca.kanama, ca.kajabatan, ca.kanotelp, ca.kanofax, ca.kanohp, ca.kaemail, ca.kawebsite, ca.kamessenger, ca.kaalamat, ca.katgllahir, ca.katglnikah, ca.kacatatan, ca.kadefault, ca.kainputuser, ca.kainputtgl, ca.kamodifikasiuser, ca.kamodifikasitgl FROM m1_contact_attention ca JOIN m1_contact c ON ca.kaidkontak = c.kid
```

```sql
Delete from M1_Contact
```

```sql
Delete from M1_Contact_Attention
```

```sql
Insert into M1_Contact(kid, kkode, knama, kkategori, kkategorinama, kcabang, kcabangnama, klokasi, klokasinama, kgudang, kgudangnama, kkategorisalesman, kkategorisalesmannama, karea, kareanama, kkategoricustomer, kkategoricustomernama, kkategorisupplier, kkategorisuppliernama, kdivisi, kdivisinama, ksubdivisi, ksubdivisinama, ksalesman, ksalesmannama, kkontakperson, kterminglobal, kaktif, kaktiftgl, k1alamat1, k1alamat2, k1alamat3, k1alamat4, k1alamat5, k1kota, k1propinsi, k1kodepos, k1negara, k1kontakperson, k1kontaknohp, k1kontakemail, k1notelp1, k1notelp2, k1nofax, k1email, k1website, k2alamat1, k2alamat2, k2alamat3, k2alamat4, k2alamat5, k2propinsi, k2kota, k2kodepos, k2negara, k2kontakperson, k2kontaknohp, k2kontakemail, k2notelp1, k2notelp2, k2nofax, k2email, k2website, k3alamat1, k3alamat2, k3alamat3, k3alamat4, k3alamat5, k3kota, k3propinsi, k3kodepos, k3negara, k3kontakperson, k3kontaknohp, k3kontakemail, k3notelp1, k3notelp2, k3nofax, k3email, k3website, k4alamat1, k4alamat2, k4alamat3, k4alamat4, k4alamat5, k4kota, k4propinsi, k4kodepos, k4negara, k4kontakperson, k4kontaknohp, k4kontakemail, k4notelp1, k4notelp2, k4nofax, k4email, k4website, knpwp, kpkp, kbatashutang, kterminbeli, krekhutang, kbagpembelian, kfobbeli, kviabeli, kbataspiutang, kterminjual, krekpiutang, kbagpenjualan, ktingkatjual, kfobjual, kviajual, ktglkontrak, kbank, knorekening, kjeniskelamin, kmatauang, ktgllahir, ktglnikah, kkomisipenjualan, kcatatan, kinputuser, kinputtgl, kmodifikasiuser, kmodifikasitgl, kcustomtext1, kcustomtext2, kcustomtext3, kcustomtext4, kcustomtext5, kcustomtext6, kcustomtext7, kcustomtext8, kcustomtext9, kcustomtext10, kcustomint1, kcustomint2, kcustomint3, kcustomdbl1, kcustomdbl2, kcustomdbl3, kcustomdate1, kcustomdate2, kcustomdate3, ksinkron) values{strValue1_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_contact_attention.vb`

```sql
SELECT COUNT(kaid) FROM M1_Contact_Attention WHERE kaid='{dataUtama_0}'
```

```sql
Update M1_Contact_Attention set kakodekontak = '{FixQuotes_dataUtama_1}', kanama = '{FixQuotes_dataUtama_2}', kajabatan = '{FixQuotes_dataUtama_3}', kanotelp = '{FixQuotes_dataUtama_4}', kanofax = '{FixQuotes_dataUtama_5}', kanohp = '{FixQuotes_dataUtama_6}', kaemail = '{FixQuotes_dataUtama_7}', kawebsite = '{FixQuotes_dataUtama_8}', kamessenger = '{FixQuotes_dataUtama_9}', kaalamat = '{FixQuotes_dataUtama_10}', katgllahir = '{FixQuotes_AsFormatTanggal_dataUtama_11}', katglnikah = '{FixQuotes_AsFormatTanggal_dataUtama_12}', kacatatan = '{FixQuotes_dataUtama_13}', kadefault = {dataUtama_14}, kainputuser = {dataUtama_15}, kainputtgl = '{FixQuotes_AsFormatTanggal_dataUtama_16}yyyy-MM-dd H:mm:ss', kamodifikasiuser = {dataUtama_17}, kamodifikasitgl = '{FixQuotes_AsFormatTanggal_dataUtama_18}yyyy-MM-dd H:mm:ss' where kaid = '{dataUtama_0}'
```

```sql
Insert into M1_Contact_Attention (kakodekontak, kanama, kajabatan, kanotelp, kanofax, kanohp, kaemail, kawebsite, kamessenger, kaalamat, katgllahir, katglnikah, kacatatan, kadefault, kainputuser, kainputtgl, kamodifikasiuser, kamodifikasitgl) values('{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', '{FixQuotes_dataUtama_4}', '{FixQuotes_dataUtama_5}', '{FixQuotes_dataUtama_6}', '{FixQuotes_dataUtama_7}', '{FixQuotes_dataUtama_8}', '{FixQuotes_dataUtama_9}', '{FixQuotes_dataUtama_10}', '{FixQuotes_AsFormatTanggal_dataUtama_11}', '{FixQuotes_AsFormatTanggal_dataUtama_12}', '{FixQuotes_dataUtama_13}', {dataUtama_14}, {dataUtama_15}, '{FixQuotes_AsFormatTanggal_dataUtama_16}yyyy-MM-dd H:mm:ss', {dataUtama_17}, '{FixQuotes_AsFormatTanggal_dataUtama_18}yyyy-MM-dd H:mm:ss')
```

```sql
DELETE FROM M1_Contact_Attention WHERE kaid = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_contact_attention_history.vb`

```sql
INSERT INTO m1_contact_attention_history(SELECT 0, ca.* FROM m1_contact_attention ca WHERE ca.kaid = '{idtransaksi}')
```

```sql
SELECT `ka`.`kaidhistory` AS `kaidhistory`,`ka`.`kaid` AS `kaid`,`ka`.`kakodekontak` AS `kakodekontak`,`ka`.`kanama` AS `kanama`,`ka`.`kajabatan` AS `kajabatan`,`ka`.`kanotelp` AS `kanotelp`,`ka`.`kanofax` AS `kanofax`,`ka`.`kanohp` AS `kanohp`,`ka`.`kaemail` AS `kaemail`,`ka`.`kawebsite` AS `kawebsite`,`ka`.`kamessenger` AS `kamessenger`,`ka`.`kaalamat` AS `kaalamat`,`ka`.`katgllahir` AS `katgllahir`,`ka`.`katglnikah` AS `katglnikah`,`ka`.`kacatatan` AS `kacatatan`,`ka`.`kadefault` AS `kadefault`,`ka`.`kainputuser` AS `kainputuser`,`ka`.`kainputtgl` AS `kainputtgl`,`ka`.`kamodifikasiuser` AS `kamodifikasiuser`,`ka`.`kamodifikasitgl` AS `kamodifikasitgl`,`ui`.`unama` AS `kainputusernama`,`um`.`unama` AS `kamodifikasiusernama` FROM ((`m1_contact_attention_history` `ka` LEFT JOIN `m0_user` `ui` ON ((`ka`.`kainputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`ka`.`kamodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_contact_category.vb`

```sql
SELECT COUNT(cckode) FROM M1_Contact_Category WHERE cckode ='{dataUtama_0}'
```

```sql
Update M1_Contact_Category set ccnama = '{FixQuotes_dataUtama_1}', cccatatan = '{FixQuotes_dataUtama_2}', ccmodifikasiuser = {dataUtama_5}, ccmodifikasitgl = NOW() where cckode = '{dataUtama_0}'
```

```sql
Insert into M1_Contact_Category (cckode, ccnama, cccatatan, ccinputuser, ccinputtgl, ccmodifikasiuser, ccmodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, NOW(), {dataUtama_5}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Contact_Category WHERE cckode = '{idtransaksi}'
```

```sql
SELECT COUNT(cckode) FROM m1_contact_category WHERE cckode='{idtransaksi}'
```

```sql
SELECT cc.cckode, cc.ccnama, 'Contact' as sumber, c.kid as idterkait FROM m1_contact c JOIN m1_contact_category cc ON c.kkategori=cc.cckode WHERE cc.cckode='valkode'
```

```sql
DELETE FROM M1_Contact_Category
```

```sql
Insert into M1_Contact_Category(cckode, ccnama, cccatatan, ccinputuser, ccinputtgl, ccmodifikasiuser, ccmodifikasitgl) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_contact_category_history.vb`

```sql
INSERT INTO m1_contact_category_history(SELECT 0, cc.* FROM m1_contact_category cc WHERE cc.cckode = '{idtransaksi}')
```

```sql
SELECT `cc`.`ccidhistory` AS `ccidhistory`,`cc`.`cckode` AS `cckode`,`cc`.`ccnama` AS `ccnama`,`cc`.`cccatatan` AS `cccatatan`,`cc`.`ccinputuser` AS `ccinputuser`,`cc`.`ccinputtgl` AS `ccinputtgl`,`cc`.`ccmodifikasiuser` AS `ccmodifikasiuser`,`cc`.`ccmodifikasitgl` AS `ccmodifikasitgl`,`ui`.`unama` AS `ccinputusernama`,`um`.`unama` AS `ccmodifikasiusernama` FROM ((`m1_contact_category_history` `cc` LEFT JOIN `m0_user` `ui` ON ((`cc`.`ccinputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`cc`.`ccmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_contact_comment.vb`

```sql
SELECT COUNT(idcc) FROM M1_Contact_Comment WHERE idcc='{dataUtama_0}'
```

```sql
Update M1_Contact_Comment set idkontak = {dataUtama_1}, tanggal = '{FixQuotes_AsFormatTanggal_dataUtama_2}', komentar = '{FixQuotes_dataUtama_3}', inputuser = {dataUtama_4}, inputtgl = '{FixQuotes_AsFormatTanggal_dataUtama_5}yyyy-MM-dd H:mm:ss', modifikasiuser = {dataUtama_6}, modifikasitgl = '{FixQuotes_AsFormatTanggal_dataUtama_7}yyyy-MM-dd H:mm:ss' where idcc = '{dataUtama_0}'
```

```sql
Insert into M1_Contact_Comment (idkontak, tanggal, komentar, inputuser, inputtgl, modifikasiuser, modifikasitgl) values({dataUtama_1}, '{FixQuotes_AsFormatTanggal_dataUtama_2}', '{FixQuotes_dataUtama_3}', {dataUtama_4}, '{FixQuotes_AsFormatTanggal_dataUtama_5}yyyy-MM-dd H:mm:ss', {dataUtama_6}, '{FixQuotes_AsFormatTanggal_dataUtama_7}yyyy-MM-dd H:mm:ss')
```

```sql
DELETE FROM M1_Contact_Comment WHERE idcc = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_contact_comment_history.vb`

```sql
INSERT INTO m1_contact_comment_history(SELECT 0, cc.* FROM m1_contact_comment cc WHERE cc.idcc = '{idtransaksi}')
```

```sql
SELECT `cc`.`idhistory` AS `idhistory`,`cc`.`idcc` AS `idcc`,`cc`.`idkontak` AS `idkontak`,`cc`.`tanggal` AS `tanggal`,`cc`.`komentar` AS `komentar`,`cc`.`inputuser` AS `inputuser`,`cc`.`inputtgl` AS `inputtgl`,`cc`.`modifikasiuser` AS `modifikasiuser`,`cc`.`modifikasitgl` AS `modifikasitgl`,`ui`.`unama` AS `inputusernama`,`um`.`unama` AS `modifikasiusernama` FROM ((`m1_contact_comment_history` `cc` LEFT JOIN `m0_user` `ui` ON ((`cc`.`inputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`cc`.`modifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_contact_history.vb`

```sql
INSERT INTO m1_contact_history(SELECT 0, contact.* FROM m1_contact contact WHERE contact.kid = '{idtransaksi}')
```

```sql
SELECT kidhistory FROM m1_contact_history WHERE kid = '{idtransaksi}' ORDER BY kmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m1_contact_attention_history(SELECT '{FixDouble_result_4}', 0, contact.* FROM m1_contact_attention contact WHERE contact.kaidkontak = '{idtransaksi}')
```

```sql
INSERT INTO m1_contact_price_history(SELECT '{FixDouble_result_4}', 0, contact.* FROM m1_contact_price contact WHERE contact.khidkontak = '{idtransaksi}')
```

```sql
select `c1`.`kidhistory` AS `kidhistory`, `c1`.`kid` AS `kid`, `c1`.`kkode` AS `kkode`, `c1`.`knama` AS `knama`, `c1`.`kkategori` AS `kkategori`, `cc`.`ccnama` AS `kkategorinama`, `c1`.`kcabang` AS `kcabang`, `br`.`bnama` AS `kcabangnama`, `c1`.`klokasi` AS `klokasi`, `l`.`lnama` AS `klokasinama`, `c1`.`kgudang` AS `kgudang`, `w`.`wnama` AS `kgudangnama`, `c1`.`kkategorisalesman` AS `kkategorisalesman`, `sc`.`scnama` AS `kkategorisalesmannama`, `c1`.`karea` AS `karea`, `a`.`anama` AS `kareanama`, `c1`.`kkategoricustomer` AS `kkategoricustomer`, `cusc`.`ccnama` AS `kkategoricustomernama`, `c1`.`kkategorisupplier` AS `kkategorisupplier`, `suppc`.`scnama` AS `kkategorisuppliernama`, `c1`.`kdivisi` AS `kdivisi`, `d`.`dnama` AS `kdivisinama`, `c1`.`ksubdivisi` AS `ksubdivisi`, `sd`.`sdnama` AS `ksubdivisinama`, `c1`.`ksalesman` AS `ksalesman`, `c2`.`knama` AS `ksalesmannama`, `c1`.`kkontakperson` AS `kkontakperson`, `c1`.`kterminglobal` AS `kterminglobal`, `c1`.`kaktif` AS `kaktif`, `c1`.`kaktiftgl` AS `kaktiftgl`, `c1`.`k1alamat1` AS `k1alamat1`, `c1`.`k1alamat2` AS `k1alamat2`, `c1`.`k1alamat3` AS `k1alamat3`, `c1`.`k1alamat4` AS `k1alamat4`, `c1`.`k1alamat5` AS `k1alamat5`, `c1`.`k1kota` AS `k1kota`, `c1`.`k1propinsi` AS `k1propinsi`, `c1`.`k1kodepos` AS `k1kodepos`, `c1`.`k1negara` AS `k1negara`, `c1`.`k1kontakperson` AS `k1kontakperson`, `c1`.`k1kontaknohp` AS `k1kontaknohp`, `c1`.`k1kontakemail` AS `k1kontakemail`, `c1`.`k1notelp1` AS `k1notelp1`, `c1`.`k1notelp2` AS `k1notelp2`, `c1`.`k1nofax` AS `k1nofax`, `c1`.`k1email` AS `k1email`, `c1`.`k1website` AS `k1website`, `c1`.`k2alamat1` AS `k2alamat1`, `c1`.`k2alamat2` AS `k2alamat2`, `c1`.`k2alamat3` AS `k2alamat3`, `c1`.`k2alamat4` AS `k2alamat4`, `c1`.`k2alamat5` AS `k2alamat5`, `c1`.`k2propinsi` AS `k2propinsi`, `c1`.`k2kota` AS `k2kota`, `c1`.`k2kodepos` AS `k2kodepos`, `c1`.`k2negara` AS `k2negara`, `c1`.`k2kontakperson` AS `k2kontakperson`, `c1`.`k2kontaknohp` AS `k2kontaknohp`, `c1`.`k2kontakemail` AS `k2kontakemail`, `c1`.`k2notelp1` AS `k2notelp1`, `c1`.`k2notelp2` AS `k2notelp2`, `c1`.`k2nofax` AS `k2nofax`, `c1`.`k2email` AS `k2email`, `c1`.`k2website` AS `k2website`, `c1`.`k3alamat1` AS `k3alamat1`, `c1`.`k3alamat2` AS `k3alamat2`, `c1`.`k3alamat3` AS `k3alamat3`, `c1`.`k3alamat4` AS `k3alamat4`, `c1`.`k3alamat5` AS `k3alamat5`, `c1`.`k3kota` AS `k3kota`, `c1`.`k3propinsi` AS `k3propinsi`, `c1`.`k3kodepos` AS `k3kodepos`, `c1`.`k3negara` AS `k3negara`, `c1`.`k3kontakperson` AS `k3kontakperson`, `c1`.`k3kontaknohp` AS `k3kontaknohp`, `c1`.`k3kontakemail` AS `k3kontakemail`, `c1`.`k3notelp1` AS `k3notelp1`, `c1`.`k3notelp2` AS `k3notelp2`, `c1`.`k3nofax` AS `k3nofax`, `c1`.`k3email` AS `k3email`, `c1`.`k3website` AS `k3website`, `c1`.`k4alamat1` AS `k4alamat1`, `c1`.`k4alamat2` AS `k4alamat2`, `c1`.`k4alamat3` AS `k4alamat3`, `c1`.`k4alamat4` AS `k4alamat4`, `c1`.`k4alamat5` AS `k4alamat5`, `c1`.`k4kota` AS `k4kota`, `c1`.`k4propinsi` AS `k4propinsi`, `c1`.`k4kodepos` AS `k4kodepos`, `c1`.`k4negara` AS `k4negara`, `c1`.`k4kontakperson` AS `k4kontakperson`, `c1`.`k4kontaknohp` AS `k4kontaknohp`, `c1`.`k4kontakemail` AS `k4kontakemail`, `c1`.`k4notelp1` AS `k4notelp1`, `c1`.`k4notelp2` AS `k4notelp2`, `c1`.`k4nofax` AS `k4nofax`, `c1`.`k4email` AS `k4email`, `c1`.`k4website` AS `k4website`, `c1`.`knpwp` AS `knpwp`, `c1`.`kpkp` AS `kpkp`, `c1`.`kbatashutang` AS `kbatashutang`, `c1`.`kterminbeli` AS `kterminbeli`, `c1`.`krekhutang` AS `krekhutang`, `c1`.`kbagpembelian` AS `kbagpembelian`, `c1`.`kfobbeli` AS `kfobbeli`, `c1`.`kviabeli` AS `kviabeli`, `c1`.`kbataspiutang` AS `kbataspiutang`, `c1`.`kterminjual` AS `kterminjual`, `c1`.`krekpiutang` AS `krekpiutang`, `c1`.`kbagpenjualan` AS `kbagpenjualan`, `c1`.`ktingkatjual` AS `ktingkatjual`, `c1`.`kfobjual` AS `kfobjual`, `c1`.`kviajual` AS `kviajual`, `c1`.`ktglkontrak` AS `ktglkontrak`, `c1`.`kbank` AS `kbank`, `c1`.`knorekening` AS `knorekening`, `c1`.`kjeniskelamin` AS `kjeniskelamin`, `c1`.`kmatauang` AS `kmatauang`, `c1`.`ktgllahir` AS `ktgllahir`, `c1`.`ktglnikah` AS `ktglnikah`, `c1`.`kkomisipenjualan` AS `kkomisipenjualan`, `c1`.`kcatatan` AS `kcatatan`, `c1`.`kinputuser` AS `kinputuser`, `c1`.`kinputtgl` AS `kinputtgl`, `c1`.`kcustomtext1` AS `kcustomtext1`, `c1`.`kcustomtext2` AS `kcustomtext2`, `c1`.`kcustomtext3` AS `kcustomtext3`, `c1`.`kcustomtext4` AS `kcustomtext4`, `c1`.`kcustomtext5` AS `kcustomtext5`, `c1`.`kcustomtext6` AS `kcustomtext6`, `c1`.`kcustomtext7` AS `kcustomtext7`, `c1`.`kcustomtext8` AS `kcustomtext8`, `c1`.`kcustomtext9` AS `kcustomtext9`, `c1`.`kmodifikasiuser` AS `kmodifikasiuser`, `c1`.`kmodifikasitgl` AS `kmodifikasitgl`, `c1`.`kcustomtext10` AS `kcustomtext10`, `c1`.`kcustomint1` AS `kcustomint1`, `c1`.`kcustomint2` AS `kcustomint2`, `c1`.`kcustomint3` AS `kcustomint3`, `c1`.`kcustomdbl1` AS `kcustomdbl1`, `c1`.`kcustomdbl2` AS `kcustomdbl2`, `c1`.`kcustomdbl3` AS `kcustomdbl3`, `c1`.`kcustomdate1` AS `kcustomdate1`, `c1`.`kcustomdate2` AS `kcustomdate2`, `c1`.`kcustomdate3` AS `kcustomdate3`, `c2`.`kkode` AS `ksalesmankode`, `coa1`.`cnama` AS `krekhutangnama`, `c3`.`kkode` AS `kbagpembeliankode`, `c3`.`knama` AS `kbagpembeliannama`, `coa2`.`cnama` AS `krekpiutangnama`, `c4`.`kkode` AS `kbagpenjualankode`, `c4`.`knama` AS `kbagpenjualannama`, `b`.`bnama` AS `kbanknama`, `sr`.`nama` AS `ktingkatjualnama`, c1.kkomisikode, comm.kmnama as kkomisinama, `ca`.`kaidhistorykontak` AS `kaidhistorykontak`, `ca`.`kaidhistory` AS `kaidhistory`, `ca`.`kaid` AS `kaid`, `ca`.`kaidkontak` AS `kaidkontak`, `ca`.`kakodekontak` AS `kakodekontak`, `ca`.`kanama` AS `kanama`, `ca`.`kajabatan` AS `kajabatan`, `ca`.`kanotelp` AS `kanotelp`, `ca`.`kanofax` AS `kanofax`, `ca`.`kanohp` AS `kanohp`, `ca`.`kaemail` AS `kaemail`, `ca`.`kawebsite` AS `kawebsite`, `ca`.`kamessenger` AS `kamessenger`, `ca`.`kaalamat` AS `kaalamat`, `ca`.`katgllahir` AS `katgllahir`, `ca`.`katglnikah` AS `katglnikah`, `ca`.`kacatatan` AS `kacatatan`, `ca`.`kadefault` AS `kadefault`, `ca`.`kainputuser` AS `kainputuser`, `ca`.`kainputtgl` AS `kainputtgl`, `ca`.`kamodifikasiuser` AS `kamodifikasiuser`, `ca`.`kamodifikasitgl` AS `kamodifikasitgl`, c1.khargacustom from `m1_contact_history` `c1` left join `m1_contact` `c2` on `c1`.`ksalesman` = `c2`.`kid` left join `m1_coa` `coa1` on `c1`.`krekhutang` = `coa1`.`cnomor` left join `m1_contact` `c3` on `c1`.`kbagpembelian` = `c3`.`kid` left join `m1_coa` `coa2` on `c1`.`krekpiutang` = `coa2`.`cnomor` left join `m1_contact` `c4` on `c1`.`kbagpenjualan` = `c4`.`kid` left join `m1_bank` `b` on `c1`.`kbank` = `b`.`bkode` left join `m1_contact_attention_history` `ca` on `c1`.`kidhistory` = `ca`.`kaidhistorykontak` left join `m1_contact_category` `cc` on `c1`.`kkategori` = `cc`.`cckode` left join `m1_branch` `br` on `c1`.`kcabang` = `br`.`bkode` left join `m1_location` `l` on `c1`.`klokasi` = `l`.`lkode` left join `m1_warehouse` `w` on `c1`.`kgudang` = `w`.`wkode` left join `m1_salesman_category` `sc` on `c1`.`kkategorisalesman` = `sc`.`sckode` left join `m1_area` `a` on `c1`.`karea` = `a`.`akode` left join `m1_customer_category` `cusc` on `c1`.`kkategoricustomer` = `cusc`.`cckode` left join `m1_supplier_category` `suppc` on `c1`.`kkategorisupplier` = `suppc`.`sckode` left join `m1_division` `d` on `c1`.`kdivisi` = `d`.`dkode` left join `m1_subdivision` `sd` on `c1`.`ksubdivisi` = `sd`.`sdkode` left join `m0_selling_rate` `sr` on `c1`.`ktingkatjual` = `sr`.`kode` left join m1_commission comm on c1.kkomisikode = comm.kmkode
```

```sql
SELECT cp.khidhistorykontak, cp.khidhistory, cp.khidkontak, cp.khidbarang, i.bkode, i.bnama, cp.khsatuan, cp.khkomisi, cp.khhargabeli, cp.khhargajual, cp.khberlakudari, cp.khberlakusampai, cp.khcatatan, cp.khinputuser, cp.khinputtgl, cp.khmodifikasiuser, cp.khmodifikasitgl, cp.khcustomtext1, cp.khcustomtext2, cp.khcustomtext3, cp.khcustomtext4, cp.khcustomtext5, cp.khcustomint1, cp.khcustomint2, cp.khcustomint3, cp.khcustomint4, cp.khcustomint5, cp.khcustomdbl1, cp.khcustomdbl2, cp.khcustomdbl3, cp.khcustomdbl4, cp.khcustomdbl5, cp.khcustomdate1, cp.khcustomdate2, cp.khcustomdate3, cp.khcustomdate4, cp.khcustomdate5 FROM m1_contact_price_history cp JOIN m1_contact c ON cp.khidkontak = c.kid AND cp.khidkontak = '{FixDouble_idtransaksi}' JOIN m1_item i ON cp.khidbarang = i.bid
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_cost_center.vb`

```sql
SELECT COUNT(cckode) FROM M1_Cost_Center WHERE cckode ='{dataUtama_0}'
```

```sql
Update M1_Cost_Center set ccnama = '{FixQuotes_dataUtama_1}', ccdivisi = '{FixQuotes_dataUtama_2}', ccakun = '{FixQuotes_dataUtama_3}', ccaktif = {dataUtama_4}, cccatatan = '{FixQuotes_dataUtama_5}', ccmodifikasiuser = {dataUtama_8}, ccmodifikasitgl = NOW() where cckode = '{dataUtama_0}'
```

```sql
Insert into M1_Cost_Center (cckode, ccnama, ccdivisi, ccakun, ccaktif, cccatatan, ccinputuser, ccinputtgl, ccmodifikasiuser, ccmodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', {dataUtama_4}, '{FixQuotes_dataUtama_5}', {dataUtama_6}, NOW(), {dataUtama_8}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Cost_Center WHERE cckode = '{idtransaksi}'
```

```sql
select `cc`.`cckode` AS `cckode`,`cc`.`ccnama` AS `ccnama`,`cc`.`ccdivisi` AS `ccdivisi`,`cc`.`ccakun` AS `ccakun`,`cc`.`ccaktif` AS `ccaktif`,`cc`.`cccatatan` AS `cccatatan`,`cc`.`ccinputuser` AS `ccinputuser`,`cc`.`ccinputtgl` AS `ccinputtgl`,`cc`.`ccmodifikasiuser` AS `ccmodifikasiuser`,`cc`.`ccmodifikasitgl` AS `ccmodifikasitgl`,`d`.`dnama` AS `ccdivisinama`,`c`.`cnama` AS `ccakunnama` from ((`m1_cost_center` `cc` left join `m1_division` `d` on((`cc`.`ccdivisi` = `d`.`dkode`))) left join `m1_coa` `c` on((`cc`.`ccakun` = `c`.`cnomor`)))
```

```sql
select `cc`.`cckode` AS `cckode`,`cc`.`ccnama` AS `ccnama`,`cc`.`ccdivisi` AS `ccdivisi`,`cc`.`ccakun` AS `ccakun`,`cc`.`ccaktif` AS `ccaktif`,`cc`.`cccatatan` AS `cccatatan`,`cc`.`ccinputuser` AS `ccinputuser`,`cc`.`ccinputtgl` AS `ccinputtgl`,`cc`.`ccmodifikasiuser` AS `ccmodifikasiuser`,`cc`.`ccmodifikasitgl` AS `ccmodifikasitgl`,`d`.`dnama` AS `ccdivisinama`,`c`.`cnama` AS `ccakunnama` , u1.unama as ccinputusernama, u2.unama as ccmodifikasiusernama from `m1_cost_center` `cc` left join `m1_division` `d` on `cc`.`ccdivisi` = `d`.`dkode` left join `m1_coa` `c` on `cc`.`ccakun` = `c`.`cnomor` left join m0_user u1 on cc.ccinputuser = u1.userid left join m0_user u2 on cc.ccmodifikasiuser = u2.userid
```

```sql
SELECT COUNT(cckode) FROM m1_cost_center WHERE cckode='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_cost_center_history.vb`

```sql
INSERT INTO m1_cost_center_history(SELECT 0, cc.* FROM m1_cost_center cc WHERE cc.cckode = '{idtransaksi}')
```

```sql
select `cc`.`ccidhistory` AS `ccidhistory`,`cc`.`cckode` AS `cckode`,`cc`.`ccnama` AS `ccnama`,`cc`.`ccdivisi` AS `ccdivisi`,`cc`.`ccakun` AS `ccakun`,`cc`.`ccaktif` AS `ccaktif`,`cc`.`cccatatan` AS `cccatatan`,`cc`.`ccinputuser` AS `ccinputuser`,`cc`.`ccinputtgl` AS `ccinputtgl`,`cc`.`ccmodifikasiuser` AS `ccmodifikasiuser`,`cc`.`ccmodifikasitgl` AS `ccmodifikasitgl`,`d`.`dnama` AS `ccdivisinama`,`c`.`cnama` AS `ccakunnama`,`ui`.`unama` AS `ccinputusernama`,`um`.`unama` AS `ccmodifikasiusernama` from ((((`m1_cost_center_history` `cc` left join `m1_division` `d` on((`cc`.`ccdivisi` = `d`.`dkode`))) left join `m1_coa` `c` on((`cc`.`ccakun` = `c`.`cnomor`))) LEFT JOIN `m0_user` `ui` ON ((`cc`.`ccinputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`cc`.`ccmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_country.vb`

```sql
SELECT COUNT(ckode) FROM M1_Country WHERE ckode ='{dataUtama_0}'
```

```sql
Update M1_Country set cnama = '{FixQuotes_dataUtama_1}', ccatatan = '{FixQuotes_dataUtama_2}', caktif = {dataUtama_3}, cmodifikasiuser = {dataUtama_6}, cmodifikasitgl = NOW() where ckode = '{dataUtama_0}'
```

```sql
Insert into M1_Country (ckode, cnama, ccatatan, caktif, cinputuser, cinputtgl, cmodifikasiuser, cmodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Country WHERE ckode = '{idtransaksi}'
```

```sql
SELECT COUNT(ckode) FROM m1_country WHERE ckode='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_country_history.vb`

```sql
INSERT INTO m1_country_history(SELECT 0, c.* FROM m1_country c WHERE c.ckode = '{idtransaksi}')
```

```sql
SELECT `c`.`cidhistory` AS `cidhistory`,`c`.`ckode` AS `ckode`,`c`.`cnama` AS `cnama`,`c`.`ccatatan` AS `ccatatan`,`c`.`caktif` AS `caktif`,`c`.`cinputuser` AS `cinputuser`,`c`.`cinputtgl` AS `cinputtgl`,`c`.`cmodifikasiuser` AS `cmodifikasiuser`,`c`.`cmodifikasitgl` AS `cmodifikasitgl`,`ui`.`unama` AS `cinputusernama`,`um`.`unama` AS `cmodifikasiusernama` FROM ((`m1_country_history` `c` LEFT JOIN `m0_user` `ui` ON ((`c`.`cinputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`c`.`cmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_currency.vb`

```sql
SELECT COUNT(ckode) FROM M1_Currency WHERE ckode ='{dataUtama_0}'
```

```sql
Update M1_Currency set cnama = '{FixQuotes_dataUtama_1}', csimbol = '{FixQuotes_dataUtama_2}', ckurs = '{FixDouble_dataUtama_3}', ccatatan = '{FixQuotes_dataUtama_4}', caktif = {dataUtama_5}, cmodifikasiuser = {dataUtama_8}, cmodifikasitgl = NOW() where ckode = '{dataUtama_0}'
```

```sql
Insert into M1_Currency (ckode, cnama, csimbol, ckurs, ccatatan, caktif, cinputuser, cinputtgl, cmodifikasiuser, cmodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixDouble_dataUtama_3}', '{FixQuotes_dataUtama_4}', {dataUtama_5}, {dataUtama_6}, NOW(), {dataUtama_8}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Currency WHERE ckode = '{idtransaksi}'
```

```sql
SELECT c.ckode, c.cnama, c.csimbol, c.ckurs, c.ccatatan, c.caktif, c.cinputuser, c.cinputtgl, c.cmodifikasiuser, c.cmodifikasitgl, 0 as ckurstengah FROM m1_currency c
```

```sql
SELECT COUNT(ckode) FROM m1_currency WHERE ckode='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_currency_history.vb`

```sql
INSERT INTO m1_currency_history(SELECT 0, c.* FROM m1_currency c WHERE c.ckode = '{idtransaksi}')
```

```sql
SELECT `c`.`cidhistory` AS `cidhistory`,`c`.`ckode` AS `ckode`,`c`.`cnama` AS `cnama`,`c`.`csimbol` AS `csimbol`,`c`.`ckurs` AS `ckurs`,`c`.`ccatatan` AS `ccatatan`,`c`.`caktif` AS `caktif`,`c`.`cinputuser` AS `cinputuser`,`c`.`cinputtgl` AS `cinputtgl`,`c`.`cmodifikasiuser` AS `cmodifikasiuser`,`c`.`cmodifikasitgl` AS `cmodifikasitgl`,`ui`.`unama` AS `cinputusernama`,`um`.`unama` AS `cmodifikasiusernama` from ((`m1_currency_history` `c` LEFT JOIN `m0_user` `ui` ON ((`c`.`cinputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`c`.`cmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_customer_category.vb`

```sql
SELECT COUNT(cckode) FROM M1_Customer_Category WHERE cckode ='{dataUtama_0}'
```

```sql
Update M1_Customer_Category set ccnama = '{FixQuotes_dataUtama_1}', cccatatan = '{FixQuotes_dataUtama_2}', ccaktif = {dataUtama_3}, ccmodifikasiuser = {dataUtama_6}, ccmodifikasitgl = NOW(), cctingkatjual = {dataUtama_8} where cckode = '{dataUtama_0}'
```

```sql
Insert into M1_Customer_Category (cckode, ccnama, cccatatan, ccaktif, ccinputuser, ccinputtgl, ccmodifikasiuser, ccmodifikasitgl, cctingkatjual) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00', {dataUtama_8})
```

```sql
DELETE FROM M1_Customer_Category WHERE cckode = '{idtransaksi}'
```

```sql
SELECT cc.cckode, cc.ccnama, cc.cccatatan, cc.ccaktif, cc.ccinputuser, cc.ccinputtgl, cc.ccmodifikasiuser, cc.ccmodifikasitgl, cc.cctingkatjual, sr.nama as cctingkatjualnama FROM m1_customer_category cc LEFT JOIN m0_selling_rate sr ON cc.cctingkatjual = sr.kode
```

```sql
SELECT COUNT(cckode) FROM m1_customer_category WHERE cckode='{idtransaksi}'
```

```sql
SELECT cc.cckode, cc.ccnama, 'Contact' as sumber, c.kid as idterkait FROM m1_contact c JOIN m1_customer_category cc ON c.kkategoricustomer=cc.cckode WHERE cc.cckode='valkode'
```

```sql
DELETE FROM M1_Customer_Category
```

```sql
Insert into M1_Customer_Category(cckode, ccnama, cccatatan, cctingkatjual, ccaktif, ccinputuser, ccinputtgl, ccmodifikasiuser, ccmodifikasitgl) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_customer_category_history.vb`

```sql
INSERT INTO m1_customer_category_history(SELECT 0, c.* FROM m1_customer_category c WHERE c.cckode = '{idtransaksi}')
```

```sql
SELECT cc.ccidhistory AS ccidhistory, cc.cckode AS cckode, cc.ccnama AS ccnama, cc.cccatatan AS cccatatan, cc.ccaktif AS ccaktif, cc.ccinputuser AS ccinputuser, cc.ccinputtgl AS ccinputtgl, cc.ccmodifikasiuser AS ccmodifikasiuser, cc.ccmodifikasitgl AS ccmodifikasitgl, ui.unama AS ccinputusernama, um.unama AS ccmodifikasiusernama, cc.cctingkatjual, sr.nama as cctingkatjualnama from m1_customer_category_history cc LEFT JOIN m0_user ui ON cc.ccinputuser = ui.userid LEFT JOIN m0_user um ON cc.ccmodifikasiuser = um.userid LEFT JOIN m0_selling_rate sr ON cc.cctingkatjual = sr.kode
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_department.vb`

```sql
Insert into M1_Department(dpkode, dpnama, dpdivisi, dpsubdivisi, dpcatatan, dpaktif, dpinputuser, dpinputtgl, dpmodifikasiuser, dpmodifikasitgl, dpcustomtext1, dpcustomtext2, dpcustomtext3, dpcustomtext4, dpcustomtext5, dpcustomint1, dpcustomint2, dpcustomint3, dpcustomdbl1, dpcustomdbl2, dpcustomdbl3, dpcustomdate1, dpcustomdate2, dpcustomdate3, dpindexbarcode) values{strValue2_ToString} ON DUPLICATE KEY UPDATE dpnama = VALUES(dpnama), dpdivisi = VALUES(dpdivisi), dpsubdivisi = VALUES(dpsubdivisi), dpcatatan = VALUES(dpcatatan), dpaktif = VALUES(dpaktif), dpinputuser = VALUES(dpinputuser), dpinputtgl = VALUES(dpinputtgl), dpmodifikasiuser = VALUES(dpmodifikasiuser), dpmodifikasitgl = VALUES(dpmodifikasitgl), dpcustomtext1 = VALUES(dpcustomtext1), dpcustomtext2 = VALUES(dpcustomtext2), dpcustomtext3 = VALUES(dpcustomtext3), dpcustomtext4 = VALUES(dpcustomtext4), dpcustomtext5 = VALUES(dpcustomtext5), dpcustomint1 = VALUES(dpcustomint1), dpcustomint2 = VALUES(dpcustomint2), dpcustomint3 = VALUES(dpcustomint3), dpcustomdbl1 = VALUES(dpcustomdbl1), dpcustomdbl2 = VALUES(dpcustomdbl2), dpcustomdbl3 = VALUES(dpcustomdbl3), dpcustomdate1 = VALUES(dpcustomdate1), dpcustomdate2 = VALUES(dpcustomdate2), dpcustomdate3 = VALUES(dpcustomdate3), dpindexbarcode = VALUES(dpindexbarcode)
```

```sql
DELETE FROM M1_Department WHERE dpkode = '{idtransaksi}'
```

```sql
SELECT dp.dpkode, dp.dpnama, dp.dpdivisi, dp.dpsubdivisi, dp.dpcatatan, dp.dpaktif, dp.dpinputuser, dp.dpinputtgl, dp.dpmodifikasiuser, dp.dpmodifikasitgl, dp.dpcustomtext1, dp.dpcustomtext2, dp.dpcustomtext3, dp.dpcustomtext4, dp.dpcustomtext5, dp.dpcustomint1, dp.dpcustomint2, dp.dpcustomint3, dp.dpcustomdbl1, dp.dpcustomdbl2, dp.dpcustomdbl3, dp.dpcustomdate1, dp.dpcustomdate2, dp.dpcustomdate3, d.dnama as dpdivisinama, sd.sdnama as dpsubdivisinama, u1.unama as dpinputusernama, u2.unama as dpmodifikasiusernama, dp.dpindexbarcode FROM m1_department dp LEFT JOIN m1_division d ON dp.dpdivisi = d.dkode LEFT JOIN m1_subdivision sd ON dp.dpsubdivisi = sd.sdkode LEFT JOIN m0_user u1 ON dp.dpinputuser = u1.userid LEFT JOIN m0_user u2 ON dp.dpmodifikasiuser = u2.userid
```

```sql
SELECT COUNT(dpkode) FROM M1_Department WHERE dpkode='{idtransaksi}'
```

```sql
SELECT dp.dpkode as dpkode, dp.dpnama as dpnama, 'Sub Department' as sumber, sdp.sdpkode as idterkait FROM m1_subdepartment sdp JOIN m1_department dp ON sdp.sdpdepartemen = dp.dpkode AND dp.dpkode = 'valkode' GROUP BY dp.dpkode, sdp.sdpkode UNION ALL SELECT dp.dpkode as dpkode, dp.dpnama as dpnama, 'Item' as sumber, i.bkode as idterkait FROM m1_item i JOIN m1_department dp ON i.bdepartemen = dp.dpkode AND dp.dpkode = 'valkode' GROUP BY dp.dpkode, i.bid
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_department_history.vb`

```sql
INSERT INTO M1_Department_history(SELECT 0, department.* FROM M1_Department department WHERE department.dpkode = '{idtransaksi}')
```

```sql
SELECT dp.dpidhistory, dp.dpkode, dp.dpnama, dp.dpdivisi, dp.dpsubdivisi, dp.dpcatatan, dp.dpaktif, dp.dpinputuser, dp.dpinputtgl, dp.dpmodifikasiuser, dp.dpmodifikasitgl, dp.dpcustomtext1, dp.dpcustomtext2, dp.dpcustomtext3, dp.dpcustomtext4, dp.dpcustomtext5, dp.dpcustomint1, dp.dpcustomint2, dp.dpcustomint3, dp.dpcustomdbl1, dp.dpcustomdbl2, dp.dpcustomdbl3, dp.dpcustomdate1, dp.dpcustomdate2, dp.dpcustomdate3, d.dnama as dpdivisinama, sd.sdnama as dpsubdivisinama, u1.unama as dpinputusernama, u2.unama as dpmodifikasiusernama, dp.dpindexbarcode FROM m1_department_history dp LEFT JOIN m1_division d ON dp.dpdivisi = d.dkode LEFT JOIN m1_subdivision sd ON dp.dpsubdivisi = sd.sdkode LEFT JOIN m0_user u1 ON dp.dpinputuser = u1.userid LEFT JOIN m0_user u2 ON dp.dpmodifikasiuser = u2.userid
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_designer.vb`

```sql
Insert into M1_Designer(dkode, dnama, dcatatan, daktif, dinputuser, dinputtgl, dmodifikasiuser, dmodifikasitgl, dcustomtext1, dcustomtext2, dcustomtext3, dcustomtext4, dcustomtext5, dcustomint1, dcustomint2, dcustomint3, dcustomdbl1, dcustomdbl2, dcustomdbl3, dcustomdate1, dcustomdate2, dcustomdate3, dindexbarcode) values{strValue2_ToString} ON DUPLICATE KEY UPDATE dnama = VALUES(dnama), dcatatan = VALUES(dcatatan), daktif = VALUES(daktif), dmodifikasiuser = VALUES(dmodifikasiuser), dmodifikasitgl = NOW(), dcustomtext1 = VALUES(dcustomtext1), dcustomtext2 = VALUES(dcustomtext2), dcustomtext3 = VALUES(dcustomtext3), dcustomtext4 = VALUES(dcustomtext4), dcustomtext5 = VALUES(dcustomtext5), dcustomint1 = VALUES(dcustomint1), dcustomint2 = VALUES(dcustomint2), dcustomint3 = VALUES(dcustomint3), dcustomdbl1 = VALUES(dcustomdbl1), dcustomdbl2 = VALUES(dcustomdbl2), dcustomdbl3 = VALUES(dcustomdbl3), dcustomdate1 = VALUES(dcustomdate1), dcustomdate2 = VALUES(dcustomdate2), dcustomdate3 = VALUES(dcustomdate3), dindexbarcode = VALUES(dindexbarcode)
```

```sql
DELETE FROM M1_Designer WHERE dkode = '{idtransaksi}'
```

```sql
select `d`.`dkode` AS `dkode`,`d`.`dnama` AS `dnama`,`d`.`dcatatan` AS `dcatatan`,`d`.`daktif` AS `daktif`,`d`.`dinputuser` AS `dinputuser`,`d`.`dinputtgl` AS `dinputtgl`,`d`.`dmodifikasiuser` AS `dmodifikasiuser`,`d`.`dmodifikasitgl` AS `dmodifikasitgl`,`d`.`dcustomtext1` AS `dcustomtext1`,`d`.`dcustomtext2` AS `dcustomtext2`,`d`.`dcustomtext3` AS `dcustomtext3`,`d`.`dcustomtext4` AS `dcustomtext4`,`d`.`dcustomtext5` AS `dcustomtext5`,`d`.`dcustomint1` AS `dcustomint1`,`d`.`dcustomint2` AS `dcustomint2`,`d`.`dcustomint3` AS `dcustomint3`,`d`.`dcustomdbl1` AS `dcustomdbl1`,`d`.`dcustomdbl2` AS `dcustomdbl2`,`d`.`dcustomdbl3` AS `dcustomdbl3`,`d`.`dcustomdate1` AS `dcustomdate1`,`d`.`dcustomdate2` AS `dcustomdate2`,`d`.`dcustomdate3` AS `dcustomdate3`,`d`.`dindexbarcode` AS `dindexbarcode`,`u1`.`unama` AS `dinputusernama`,`u2`.`unama` AS `dmodifikasiusernama` from ((`M1_Designer` `d` left join `m0_user` `u1` on((`d`.`dinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`d`.`dmodifikasiuser` = `u2`.`userid`)))
```

```sql
SELECT COUNT(dkode) FROM M1_Designer WHERE dkode='{idtransaksi}'
```

```sql
select d.dkode AS dkode, d.dnama AS dnama, s.skode AS sumber, CONCAT('Setting : ', s.smodule, ' - ', s.sgrup, ' - ', s.skode) AS idterkait from m0_setting s join M1_Designer d on (s.smodule = 0 AND s.sgrup = 'options' AND s.skode = 'KelasProduk' AND s.snilai = d.dkode) WHERE d.dkode = 'valkode' union all SELECT d.dkode as dkode, d.dnama as dnama, 'Item' as sumber, i.bkode as idterkait FROM m1_item i JOIN M1_Designer d ON i.bkelasproduk = d.dkode AND d.dkode = 'valkode' GROUP BY d.dkode, i.bid UNION ALL SELECT d.dkode as dkode, d.dnama as dnama, 'POS Type' as sumber, ptd.tipepos as idterkait FROM m_12_pos_type_class_product ptd JOIN M1_Designer d ON ptd.kelasproduk = d.dkode AND d.dkode = 'valkode' GROUP BY d.dkode, ptd.tipepos
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_designer_history.vb`

```sql
INSERT INTO M1_Designer_history(SELECT 0, class_product.* FROM M1_Designer class_product WHERE class_product.dkode = '{idtransaksi}')
```

```sql
select `d`.`didhistory` AS `didhistory`,`d`.`dkode` AS `dkode`,`d`.`dnama` AS `dnama`,`d`.`dcatatan` AS `dcatatan`,`d`.`daktif` AS `daktif`,`d`.`dinputuser` AS `dinputuser`,`d`.`dinputtgl` AS `dinputtgl`,`d`.`dmodifikasiuser` AS `dmodifikasiuser`,`d`.`dmodifikasitgl` AS `dmodifikasitgl`,`d`.`dcustomtext1` AS `dcustomtext1`,`d`.`dcustomtext2` AS `dcustomtext2`,`d`.`dcustomtext3` AS `dcustomtext3`,`d`.`dcustomtext4` AS `dcustomtext4`,`d`.`dcustomtext5` AS `dcustomtext5`,`d`.`dcustomint1` AS `dcustomint1`,`d`.`dcustomint2` AS `dcustomint2`,`d`.`dcustomint3` AS `dcustomint3`,`d`.`dcustomdbl1` AS `dcustomdbl1`,`d`.`dcustomdbl2` AS `dcustomdbl2`,`d`.`dcustomdbl3` AS `dcustomdbl3`,`d`.`dcustomdate1` AS `dcustomdate1`,`d`.`dcustomdate2` AS `dcustomdate2`,`d`.`dcustomdate3` AS `dcustomdate3`,`u1`.`unama` AS `dinputusernama`,`u2`.`unama` AS `dmodifikasiusernama`,`d`.`dindexbarcode` AS `dindexbarcode` from ((`M1_Designer_history` `d` left join `m0_user` `u1` on((`d`.`dinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`d`.`dmodifikasiuser` = `u2`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_diagnosis.vb`

```sql
SELECT COUNT(dkode) FROM M1_Diagnosis WHERE dkode ='{dataUtama_0}'
```

```sql
Update M1_Diagnosis set dnama = '{FixQuotes_dataUtama_1}', dcatatan = '{FixQuotes_dataUtama_2}', daktif = {dataUtama_3}, dmodifikasiuser = {dataUtama_6}, dmodifikasitgl = NOW(), dkategori = '{FixQuotes_dataUtama_8}' where dkode = '{dataUtama_0}'
```

```sql
Insert into M1_Diagnosis (dkode, dnama, dcatatan, daktif, dinputuser, dinputtgl, dmodifikasiuser, dmodifikasitgl, dkategori) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00', '{FixQuotes_dataUtama_8}')
```

```sql
DELETE FROM M1_Diagnosis WHERE dkode = '{idtransaksi}'
```

```sql
SELECT COUNT(dkode) FROM m1_diagnosis WHERE dkode='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_division.vb`

```sql
SELECT COUNT(dkode) FROM M1_Division WHERE dkode ='{dataUtama_0}'
```

```sql
Update M1_Division set dnama = '{FixQuotes_dataUtama_1}', dcatatan = '{FixQuotes_dataUtama_2}', daktif = {dataUtama_3}, dmodifikasiuser = {dataUtama_6}, dmodifikasitgl = NOW(), dindexbarcode = '{FixQuotes_dataUtama_8}' where dkode = '{dataUtama_0}'
```

```sql
Insert into M1_Division (dkode, dnama, dcatatan, daktif, dinputuser, dinputtgl, dmodifikasiuser, dmodifikasitgl, dindexbarcode) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00', '{FixQuotes_dataUtama_8}')
```

```sql
DELETE FROM M1_Division WHERE dkode = '{idtransaksi}'
```

```sql
SELECT COUNT(dkode) FROM m1_division WHERE dkode='{idtransaksi}'
```

```sql
DELETE FROM M1_Division
```

```sql
Insert into M1_Division(dkode, dnama, dcatatan, daktif, dinputuser, dinputtgl, dmodifikasiuser, dmodifikasitgl) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_division_history.vb`

```sql
INSERT INTO m1_division_history(SELECT 0, c.* FROM m1_division c WHERE c.dkode = '{idtransaksi}')
```

```sql
SELECT `d`.`didhistory` AS `didhistory`,`d`.`dkode` AS `dkode`,`d`.`dnama` AS `dnama`,`d`.`dcatatan` AS `dcatatan`,`d`.`daktif` AS `daktif`,`d`.`dinputuser` AS `dinputuser`,`d`.`dinputtgl` AS `dinputtgl`,`d`.`dmodifikasiuser` AS `dmodifikasiuser`,`d`.`dmodifikasitgl` AS `dmodifikasitgl`,`ui`.`unama` AS `dinputusernama`,`um`.`unama` AS `dmodifikasiusernama`, d.dindexbarcode from ((`m1_division_history` `d` LEFT JOIN `m0_user` `ui` ON ((`d`.`dinputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`d`.`dmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_expedition.vb`

```sql
SELECT COUNT(ekode) FROM M1_Expedition WHERE ekode ='{dataUtama_0}'
```

```sql
Update M1_Expedition set enama = '{FixQuotes_dataUtama_1}', ealamat = '{FixQuotes_dataUtama_2}', ekota = '{FixQuotes_dataUtama_3}', etelp = '{FixQuotes_dataUtama_4}', efax = '{FixQuotes_dataUtama_5}', ecatatan = '{FixQuotes_dataUtama_6}', ekontakperson = '{FixQuotes_dataUtama_7}', eemail = '{FixQuotes_dataUtama_8}', eaktif = {dataUtama_9}, emodifikasiuser = {dataUtama_12}, emodifikasitgl = NOW() where ekode = '{dataUtama_0}'
```

```sql
Insert into M1_Expedition (ekode, enama, ealamat, ekota, etelp, efax, ecatatan, ekontakperson, eemail, eaktif, einputuser, einputtgl, emodifikasiuser, emodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', '{FixQuotes_dataUtama_4}', '{FixQuotes_dataUtama_5}', '{FixQuotes_dataUtama_6}', '{FixQuotes_dataUtama_7}', '{FixQuotes_dataUtama_8}', {dataUtama_9}, {dataUtama_10}, NOW(), {dataUtama_12}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Expedition WHERE ekode = '{idtransaksi}'
```

```sql
SELECT COUNT(ekode) FROM m1_expedition WHERE ekode='{idtransaksi}'
```

```sql
SELECT ekode, enama, 'PL' sumber, pl.plid as idterkait FROM m1_expedition e JOIN m5_pl pl ON e.ekode = pl.plekspedisi WHERE ekode = 'valkode'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_expedition_history.vb`

```sql
INSERT INTO m1_expedition_history(SELECT 0, c.* FROM m1_expedition c WHERE c.ekode = '{idtransaksi}')
```

```sql
SELECT `e`.`eidhistory` AS `eidhistory`,`e`.`ekode` AS `ekode`,`e`.`enama` AS `enama`,`e`.`ealamat` AS `ealamat`,`e`.`ekota` AS `ekota`,`e`.`etelp` AS `etelp`,`e`.`efax` AS `efax`,`e`.`ecatatan` AS `ecatatan`,`e`.`ekontakperson` AS `ekontakperson`,`e`.`eemail` AS `eemail`,`e`.`eaktif` AS `eaktif`,`e`.`einputuser` AS `einputuser`,`e`.`einputtgl` AS `einputtgl`,`e`.`emodifikasiuser` AS `emodifikasiuser`,`e`.`emodifikasitgl` AS `emodifikasitgl`,`ui`.`unama` AS `einputusernama`,`um`.`unama` AS `emodifikasiusernama` from ((`m1_expedition_history` `e` LEFT JOIN `m0_user` `ui` ON ((`e`.`einputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`e`.`emodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_files.vb`

```sql
UPDATE m1_files SET fcatatan = CASE fnamafile {strValue1_ToString} ELSE fcatatan END, fukuranfile = CASE fnamafile {strValue2_ToString} ELSE fukuranfile END, ftanggal = CASE fnamafile {strValue3_ToString} ELSE ftanggal END, fdefault = CASE fnamafile {strValue4_ToString} ELSE fdefault END WHERE fsumber='{sumber}' AND fidtransaksi='{idtrans}'
```

```sql
Insert into M1_Files(fsumber, fnamafile, fidtransaksi, fidtransaksi2, fcatatan, fukuranfile, ftanggal, finputuser, finputtgl, fdefault) values{strValue2_ToString}
```

```sql
DELETE FROM M1_Files WHERE fsumber = '{sumber}' AND fnamafile='{namafile}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_icd.vb`

```sql
SELECT COUNT(akode) FROM M1_Icd WHERE ikode ='{dataUtama_0}'
```

```sql
Update M1_Icd set inama = '{FixQuotes_dataUtama_1}', icatatan = '{FixQuotes_dataUtama_2}', iaktif = {dataUtama_3}, imodifikasiuser = {dataUtama_6}, imodifikasitgl = NOW() where ikode = '{dataUtama_0}'
```

```sql
Insert into M1_Icd (ikode, inama, icatatan, iaktif, iinputuser, iinputtgl, imodifikasiuser, imodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Icd WHERE ikode = '{idtransaksi}'
```

```sql
SELECT COUNT(ikode) FROM m1_icd WHERE ikode='{idtransaksi}'
```

```sql
DELETE FROM M1_Icd
```

```sql
Insert into M1_Icd(ikode, inama, icatatan, iaktif, iinputuser, iinputtgl, imodifikasiuser, imodifikasitgl) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_icd_history.vb`

```sql
INSERT INTO m1_Icd_history(SELECT 0, icd.* FROM m1_icd icd WHERE icd.ikode = '{idtransaksi}')
```

```sql
SELECT `i`.`iidhistory` AS `iidhistory`,`i`.`ikode` AS `ikode`,`i`.`inama` AS `inama`,`i`.`icatatan` AS `icatatan`,`i`.`iaktif` AS `iaktif`,`i`.`iinputuser` AS `iinputuser`,`i`.`iinputtgl` AS `iinputtgl`,`i`.`imodifikasiuser` AS `imodifikasiuser`,`i`.`imodifikasitgl` AS `imodifikasitgl`,`ui`.`unama` AS `iinputusernama`,`um`.`unama` AS `imodifikasiusernama` FROM ((`m1_icd_history` `i` LEFT JOIN `m0_user` `ui` ON ((`i`.`iinputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`i`.`imodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_index_price.vb`

```sql
Insert into M1_Index_Price(ipkode, ipnama, ipcatatan, ipaktif, ipinputuser, ipinputtgl, ipmodifikasiuser, ipmodifikasitgl, ipcustomtext1, ipcustomtext2, ipcustomtext3, ipcustomtext4, ipcustomtext5, ipcustomint1, ipcustomint2, ipcustomint3, ipcustomdbl1, ipcustomdbl2, ipcustomdbl3, ipcustomdate1, ipcustomdate2, ipcustomdate3, ipmargin) values{strValue2_ToString} ON DUPLICATE KEY UPDATE ipnama = VALUES(ipnama), ipcatatan = VALUES(ipcatatan), ipaktif = VALUES(ipaktif), ipmodifikasiuser = VALUES(ipmodifikasiuser), ipmodifikasitgl = NOW(), ipcustomtext1 = VALUES(ipcustomtext1), ipcustomtext2 = VALUES(ipcustomtext2), ipcustomtext3 = VALUES(ipcustomtext3), ipcustomtext4 = VALUES(ipcustomtext4), ipcustomtext5 = VALUES(ipcustomtext5), ipcustomint1 = VALUES(ipcustomint1), ipcustomint2 = VALUES(ipcustomint2), ipcustomint3 = VALUES(ipcustomint3), ipcustomdbl1 = VALUES(ipcustomdbl1), ipcustomdbl2 = VALUES(ipcustomdbl2), ipcustomdbl3 = VALUES(ipcustomdbl3), ipcustomdate1 = VALUES(ipcustomdate1), ipcustomdate2 = VALUES(ipcustomdate2), ipcustomdate3 = VALUES(ipcustomdate3), ipmargin = VALUES(ipmargin)
```

```sql
DELETE FROM M1_Index_Price WHERE ipkode = '{idtransaksi}'
```

```sql
select `ip`.`ipkode` AS `ipkode`,`ip`.`ipnama` AS `ipnama`,`ip`.`ipcatatan` AS `ipcatatan`,`ip`.`ipaktif` AS `ipaktif`,`ip`.`ipinputuser` AS `ipinputuser`,`ip`.`ipinputtgl` AS `ipinputtgl`,`ip`.`ipmodifikasiuser` AS `ipmodifikasiuser`,`ip`.`ipmodifikasitgl` AS `ipmodifikasitgl`,`ip`.`ipcustomtext1` AS `ipcustomtext1`,`ip`.`ipcustomtext2` AS `ipcustomtext2`,`ip`.`ipcustomtext3` AS `ipcustomtext3`,`ip`.`ipcustomtext4` AS `ipcustomtext4`,`ip`.`ipcustomtext5` AS `ipcustomtext5`,`ip`.`ipcustomint1` AS `ipcustomint1`,`ip`.`ipcustomint2` AS `ipcustomint2`,`ip`.`ipcustomint3` AS `ipcustomint3`,`ip`.`ipcustomdbl1` AS `ipcustomdbl1`,`ip`.`ipcustomdbl2` AS `ipcustomdbl2`,`ip`.`ipcustomdbl3` AS `ipcustomdbl3`,`ip`.`ipcustomdate1` AS `ipcustomdate1`,`ip`.`ipcustomdate2` AS `ipcustomdate2`,`ip`.`ipcustomdate3` AS `ipcustomdate3`,`u1`.`unama` AS `ipinputusernama`,`u2`.`unama` AS `ipmodifikasiusernama`, ip.ipmargin from ((`M1_Index_Price` `ip` left join `m0_user` `u1` on((`ip`.`ipinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`ip`.`ipmodifikasiuser` = `u2`.`userid`)))
```

```sql
SELECT COUNT(ipkode) FROM M1_Index_Price WHERE ipkode='{idtransaksi}'
```

```sql
SELECT ip.ipkode as ipkode, ip.ipnama as ipnama, 'POS Category' as sumber, pc.pckode as idterkait FROM m_12_pos_category pc JOIN m1_index_price ip ON pc.pcindeksharga = ip.ipkode AND ip.ipkode = 'valkode' GROUP BY ip.ipkode, pc.pckode
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_index_price_history.vb`

```sql
INSERT INTO M1_Index_Price_history(SELECT 0, Index_Price.* FROM M1_Index_Price Index_Price WHERE Index_Price.ipkode = '{idtransaksi}')
```

```sql
select `ip`.`ipidhistory` AS `ipidhistory`,`ip`.`ipkode` AS `ipkode`,`ip`.`ipnama` AS `ipnama`,`ip`.`ipcatatan` AS `ipcatatan`,`ip`.`ipaktif` AS `ipaktif`,`ip`.`ipinputuser` AS `ipinputuser`,`ip`.`ipinputtgl` AS `ipinputtgl`,`ip`.`ipmodifikasiuser` AS `ipmodifikasiuser`,`ip`.`ipmodifikasitgl` AS `ipmodifikasitgl`,`ip`.`ipcustomtext1` AS `ipcustomtext1`,`ip`.`ipcustomtext2` AS `ipcustomtext2`,`ip`.`ipcustomtext3` AS `ipcustomtext3`,`ip`.`ipcustomtext4` AS `ipcustomtext4`,`ip`.`ipcustomtext5` AS `ipcustomtext5`,`ip`.`ipcustomint1` AS `ipcustomint1`,`ip`.`ipcustomint2` AS `ipcustomint2`,`ip`.`ipcustomint3` AS `ipcustomint3`,`ip`.`ipcustomdbl1` AS `ipcustomdbl1`,`ip`.`ipcustomdbl2` AS `ipcustomdbl2`,`ip`.`ipcustomdbl3` AS `ipcustomdbl3`,`ip`.`ipcustomdate1` AS `ipcustomdate1`,`ip`.`ipcustomdate2` AS `ipcustomdate2`,`ip`.`ipcustomdate3` AS `ipcustomdate3`,`u1`.`unama` AS `ipinputusernama`,`u2`.`unama` AS `ipmodifikasiusernama`, ip.ipmargin from ((`M1_Index_Price_history` `ip` left join `m0_user` `u1` on((`ip`.`ipinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`ip`.`ipmodifikasiuser` = `u2`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_insurer.vb`

```sql
SELECT COUNT(iid) FROM M1_Insurer WHERE iid ='{dataUtama_0}'
```

```sql
Update M1_Insurer set ikode = '{FixQuotes_dataUtama_1}', inama = '{FixQuotes_dataUtama_2}', icatatan = '{FixQuotes_dataUtama_3}', iaktif = {dataUtama_4}, imodifikasiuser = {dataUtama_7}, imodifikasitgl = NOW(), ikategoriharga = '{FixQuotes_dataUtama_9}' where iid = '{dataUtama_0}'
```

```sql
Insert into M1_Insurer (ikode, inama, icatatan, iaktif, iinputuser, iinputtgl, imodifikasiuser, imodifikasitgl, ikategoriharga) values('{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', '{FixQuotes_dataUtama_4}', {dataUtama_5}, NOW(), {dataUtama_7}, '1971-01-01 00:00:00','{FixQuotes_dataUtama_9}')
```

```sql
DELETE FROM M1_Insurer WHERE iid = '{idtransaksi}'
```

```sql
SELECT COUNT(ikode) FROM m1_insurer WHERE ikode='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_item.vb`

```sql
SELECT COUNT(bid) FROM M1_Item WHERE bid='{result_4}'
```

```sql
Update M1_Item set bkode = '{FixQuotes_dr1}bkode', bnama = '{FixQuotes_dr1}bnama', bnamaalias1 = '{FixQuotes_dr1}bnamaalias1', bnamaalias2 = '{FixQuotes_dr1}bnamaalias2', bnamaalias3 = '{FixQuotes_dr1}bnamaalias3', bnamaalias4 = '{FixQuotes_dr1}bnamaalias4', bnamaalias5 = '{FixQuotes_dr1}bnamaalias5', btipe = '{FixQuotes_dr1}btipe', bjenis = '{FixQuotes_dr1}bjenis', bjenisdetail = {dr1}bjenisdetail, bkategori = '{FixQuotes_dr1}bkategori', bketerangan = '{FixQuotes_dr1}bketerangan', bsatuan = '{FixQuotes_dr1}bsatuan', bnilaisatuan = '{FixDouble_dr1}bnilaisatuan', bsatuandefault = '{FixQuotes_dr1}bsatuandefault', bnilaisatuandefault = '{FixDouble_dr1}bnilaisatuandefault', bhpp = '{FixQuotes_dr1}bhpp', bcabang = '{FixQuotes_dr1}bcabang', blokasi = '{FixQuotes_dr1}blokasi', bdivisi = '{FixQuotes_dr1}bdivisi', bsubdivisi = '{FixQuotes_dr1}bsubdivisi', bgudang = '{FixQuotes_dr1}bgudang', bproyek = '{FixQuotes_dr1}bproyek', bsubitem = {dr1}bsubitem, bsubitemdari = {dr1}bsubitemdari, bbarcode = '{FixQuotes_dr1}bbarcode', bsuplier = {dr1}bsuplier, baktif = {dr1}baktif, baktiftgl = '{FixQuotes_AsFormatTanggal_dr1}baktiftgl', bstokminimal = '{FixDouble_dr1}bstokminimal', bstokmaksimal = '{FixDouble_dr1}bstokmaksimal', breorder = '{FixDouble_dr1}breorder', bjmlorderbeli = '{FixDouble_dr1}bjmlorderbeli', bjmlorderjual = '{FixDouble_dr1}bjmlorderjual', bkategoriumur = '{FixQuotes_dr1}bkategoriumur', bstatusmoving = '{FixQuotes_dr1}bstatusmoving', bsifatharga = '{FixQuotes_dr1}bsifatharga', bpromo = {dr1}bpromo, bpromoberlaku = '{FixQuotes_AsFormatTanggal_dr1}bpromoberlaku', bpajakbeli = '{FixQuotes_dr1}bpajakbeli', bpajakjual = '{FixQuotes_dr1}bpajakjual', bhargabeli = '{FixDouble_dr1}bhargabeli', bhppaverage = '{FixDouble_dr1}bhppaverage', bhargajual1 = '{FixDouble_dr1}bhargajual1', bhargajual2 = '{FixDouble_dr1}bhargajual2', bhargajual3 = '{FixDouble_dr1}bhargajual3', bhargajual4 = '{FixDouble_dr1}bhargajual4', bhargajual5 = '{FixDouble_dr1}bhargajual5', bdiskonjual1 = '{FixDouble_dr1}bdiskonjual1', bdiskonjual2 = '{FixDouble_dr1}bdiskonjual2', bdiskonjual3 = '{FixDouble_dr1}bdiskonjual3', bdiskonjual4 = '{FixDouble_dr1}bdiskonjual4', bdiskonjual5 = '{FixDouble_dr1}bdiskonjual5', bstok = '{FixDouble_dr1}bstok', bkomisi = '{FixDouble_dr1}bkomisi', bmarginminimal = '{FixDouble_dr1}bmarginminimal', brekpersediaan = '{FixQuotes_dr1}brekpersediaan', brekpenjualan = '{FixQuotes_dr1}brekpenjualan', brekreturpenjualan = '{FixQuotes_dr1}brekreturpenjualan', brekdiskonpenjualan = '{FixQuotes_dr1}brekdiskonpenjualan', brekhargapokok = '{FixQuotes_dr1}brekhargapokok', brekreturpembelian = '{FixQuotes_dr1}brekreturpembelian', brekdiskonpembelian = '{FixQuotes_dr1}brekdiskonpembelian', brekkonsinyasi = '{FixQuotes_dr1}brekkonsinyasi', bapanjang = '{FixDouble_dr1}bapanjang', balebar = '{FixDouble_dr1}balebar', batinggi = '{FixDouble_dr1}batinggi', bavolume = '{FixDouble_dr1}bavolume', baberat = '{FixDouble_dr1}baberat', bawarna = '{FixQuotes_dr1}bawarna', baoem = '{FixQuotes_dr1}baoem', bamerk = '{FixQuotes_dr1}bamerk', baukuran = '{FixQuotes_dr1}baukuran', bamodel = '{FixQuotes_dr1}bamodel', bakelas = '{FixQuotes_dr1}bakelas', bserial = {dr1}bserial, bbatch = {dr1}bbatch, bpengganti = {dr1}bpengganti, bgambar = '{FixQuotes_dr1}bgambar', burutan = {dr1}burutan, bcustom1 = '{FixQuotes_dr1}bcustom1', bcustom2 = '{FixQuotes_dr1}bcustom2', bcustom3 = '{FixQuotes_dr1}bcustom3', bcustom4 = '{FixQuotes_dr1}bcustom4', bcustom5 = '{FixQuotes_dr1}bcustom5', bcustom6 = '{FixQuotes_dr1}bcustom6', bcustom7 = '{FixQuotes_dr1}bcustom7', bcustom8 = '{FixQuotes_dr1}bcustom8', bcustom9 = '{FixQuotes_dr1}bcustom9', bcustom10 = '{FixQuotes_dr1}bcustom10', bcustom11 = {dr1}bcustom11, bcustom12 = {dr1}bcustom12, bcustom13 = {dr1}bcustom13, bcustom14 = '{FixDouble_dr1}bcustom14', bcustom15 = '{FixDouble_dr1}bcustom15', bcatatan = '{FixQuotes_dr1}bcatatan', bmodifikasiuser = {dr1}bmodifikasiuser, bmodifikasitgl = NOW(), bedithpp = {dr1}bedithpp, bmobile = {dr1}bmobile, bassembly = {dr1}bassembly, bdownloaded = 0, bkelasproduk = '{dr1}bkelasproduk', bretur = '{dr1}bretur', btag = '{dr1}btag', bminorder = '{dr1}bminorder', bdepartemen = '{dr1}bdepartemen', bsubdepartemen = '{dr1}bsubdepartemen', bkp = '{dr1}bkp', bkl = '{dr1}bkl' , bjmllapangan = '{dr1}bjmllapangan' , bsatuanlapangan = '{dr1}bsatuanlapangan', bsubkelas = '{dr1}bsubkelas', bmaterial = '{dr1}bmaterial', bsection = '{dr1}bsection', bvendor = '{dr1}bvendor', bdesigner = '{dr1}bdesigner', basset = '{dr1}basset', bhargajual6 = '{FixDouble_dr1}bhargajual6', bhargajual7 = '{FixDouble_dr1}bhargajual7', bhargajual8 = '{FixDouble_dr1}bhargajual8', bhargajual9 = '{FixDouble_dr1}bhargajual9', bhargajual10 = '{FixDouble_dr1}bhargajual10', bdiskonjual6 = '{FixDouble_dr1}bdiskonjual6', bdiskonjual7 = '{FixDouble_dr1}bdiskonjual7', bdiskonjual8 = '{FixDouble_dr1}bdiskonjual8', bdiskonjual9 = '{FixDouble_dr1}bdiskonjual9', bdiskonjual10 = '{FixDouble_dr1}bdiskonjual10', bavolumevarchar = '{FixDouble_dr1}bavolumevarchar' where bid = '{dr1}bid'
```

```sql
Insert into M1_Item (bkode, bnama, bnamaalias1, bnamaalias2, bnamaalias3, bnamaalias4, bnamaalias5, btipe, bjenis, bjenisdetail, bkategori, bketerangan, bsatuan, bnilaisatuan, bsatuandefault, bnilaisatuandefault, bhpp, bcabang, blokasi, bdivisi, bsubdivisi, bgudang, bproyek, bsubitem, bsubitemdari, bbarcode, bsuplier, baktif, baktiftgl, bstokminimal, bstokmaksimal, breorder, bjmlorderbeli, bjmlorderjual, bkategoriumur, bstatusmoving, bsifatharga, bpromo, bpromoberlaku, bpajakbeli, bpajakjual, bhargabeli, bhppaverage, bhargajual1, bhargajual2, bhargajual3, bhargajual4, bhargajual5, bdiskonjual1, bdiskonjual2, bdiskonjual3, bdiskonjual4, bdiskonjual5, bstok, bkomisi, bmarginminimal, brekpersediaan, brekpenjualan, brekreturpenjualan, brekdiskonpenjualan, brekhargapokok, brekreturpembelian, brekdiskonpembelian, brekkonsinyasi, bapanjang, balebar, batinggi, bavolume, baberat, bawarna, baoem, bamerk, baukuran, bamodel, bakelas, bserial, bbatch, bpengganti, bgambar, burutan, bcustom1, bcustom2, bcustom3, bcustom4, bcustom5, bcustom6, bcustom7, bcustom8, bcustom9, bcustom10, bcustom11, bcustom12, bcustom13, bcustom14, bcustom15, bcatatan, binputuser, binputtgl, bmodifikasiuser, bmodifikasitgl, bedithpp, bmobile, bassembly, bkelasproduk, bretur, btag, bminorder, bdepartemen, bsubdepartemen, bkp, bkl, bjmllapangan, bsatuanlapangan, bsubkelas, bmaterial, bsection, bvendor, bdesigner, basset, bhargajual6, bhargajual7, bhargajual8, bhargajual9, bhargajual10, bdiskonjual6, bdiskonjual7, bdiskonjual8, bdiskonjual9, bdiskonjual10, bavolumevarchar) values('{FixQuotes_dr1}bkode', '{FixQuotes_dr1}bnama', '{FixQuotes_dr1}bnamaalias1', '{FixQuotes_dr1}bnamaalias2', '{FixQuotes_dr1}bnamaalias3', '{FixQuotes_dr1}bnamaalias4', '{FixQuotes_dr1}bnamaalias5', '{FixQuotes_dr1}btipe', '{FixQuotes_dr1}bjenis', {dr1}bjenisdetail, '{FixQuotes_dr1}bkategori', '{FixQuotes_dr1}bketerangan', '{FixQuotes_dr1}bsatuan', '{FixDouble_dr1}bnilaisatuan', '{FixQuotes_dr1}bsatuandefault', '{FixDouble_dr1}bnilaisatuandefault', '{FixQuotes_dr1}bhpp', '{FixQuotes_dr1}bcabang', '{FixQuotes_dr1}blokasi', '{FixQuotes_dr1}bdivisi', '{FixQuotes_dr1}bsubdivisi', '{FixQuotes_dr1}bgudang', '{FixQuotes_dr1}bproyek', {dr1}bsubitem, {dr1}bsubitemdari, '{FixQuotes_dr1}bbarcode', {dr1}bsuplier, {dr1}baktif, '{FixQuotes_AsFormatTanggal_dr1}baktiftgl', '{FixDouble_dr1}bstokminimal', '{FixDouble_dr1}bstokmaksimal', '{FixDouble_dr1}breorder', '{FixDouble_dr1}bjmlorderbeli', '{FixDouble_dr1}bjmlorderjual', '{FixQuotes_dr1}bkategoriumur', '{FixQuotes_dr1}bstatusmoving', '{FixQuotes_dr1}bsifatharga', {dr1}bpromo, '{FixQuotes_AsFormatTanggal_dr1}bpromoberlaku', '{FixQuotes_dr1}bpajakbeli', '{FixQuotes_dr1}bpajakjual', '{FixDouble_dr1}bhargabeli', '{FixDouble_dr1}bhppaverage', '{FixDouble_dr1}bhargajual1', '{FixDouble_dr1}bhargajual2', '{FixDouble_dr1}bhargajual3', '{FixDouble_dr1}bhargajual4', '{FixDouble_dr1}bhargajual5', '{FixDouble_dr1}bdiskonjual1', '{FixDouble_dr1}bdiskonjual2', '{FixDouble_dr1}bdiskonjual3', '{FixDouble_dr1}bdiskonjual4', '{FixDouble_dr1}bdiskonjual5', '{FixDouble_dr1}bstok', '{FixDouble_dr1}bkomisi', '{FixDouble_dr1}bmarginminimal', '{FixQuotes_dr1}brekpersediaan', '{FixQuotes_dr1}brekpenjualan', '{FixQuotes_dr1}brekreturpenjualan', '{FixQuotes_dr1}brekdiskonpenjualan', '{FixQuotes_dr1}brekhargapokok', '{FixQuotes_dr1}brekreturpembelian', '{FixQuotes_dr1}brekdiskonpembelian', '{FixQuotes_dr1}brekkonsinyasi', '{FixDouble_dr1}bapanjang', '{FixDouble_dr1}balebar', '{FixDouble_dr1}batinggi', '{FixDouble_dr1}bavolume', '{FixDouble_dr1}baberat', '{FixQuotes_dr1}bawarna', '{FixQuotes_dr1}baoem', '{FixQuotes_dr1}bamerk', '{FixQuotes_dr1}baukuran', '{FixQuotes_dr1}bamodel', '{FixQuotes_dr1}bakelas', {dr1}bserial, {dr1}bbatch, {dr1}bpengganti, '{FixQuotes_dr1}bgambar', {dr1}burutan, '{FixQuotes_dr1}bcustom1', '{FixQuotes_dr1}bcustom2', '{FixQuotes_dr1}bcustom3', '{FixQuotes_dr1}bcustom4', '{FixQuotes_dr1}bcustom5', '{FixQuotes_dr1}bcustom6', '{FixQuotes_dr1}bcustom7', '{FixQuotes_dr1}bcustom8', '{FixQuotes_dr1}bcustom9', '{FixQuotes_dr1}bcustom10', {dr1}bcustom11, {dr1}bcustom12, {dr1}bcustom13, '{FixDouble_dr1}bcustom14', '{FixDouble_dr1}bcustom15', '{FixQuotes_dr1}bcatatan', {dr1}binputuser, NOW(), {dr1}bmodifikasiuser, '1971-01-01 00:00:00', {dr1}bedithpp, {dr1}bmobile, {dr1}bassembly, '{dr1}bkelasproduk', '{dr1}bretur', '{dr1}btag', '{dr1}bminorder', '{dr1}bdepartemen', '{dr1}bsubdepartemen', '{dr1}bkp', '{dr1}bkl', '{dr1}bjmllapangan', '{dr1}bsatuanlapangan', '{FixQuotes_dr1}bsubkelas', '{FixQuotes_dr1}bmaterial', '{FixQuotes_dr1}bsection', '{FixQuotes_dr1}bvendor', '{FixQuotes_dr1}bdesigner', '{FixQuotes_dr1}basset', '{FixDouble_dr1}bhargajual6', '{FixDouble_dr1}bhargajual7', '{FixDouble_dr1}bhargajual8', '{FixDouble_dr1}bhargajual9', '{FixDouble_dr1}bhargajual10', '{FixDouble_dr1}bdiskonjual6', '{FixDouble_dr1}bdiskonjual7', '{FixDouble_dr1}bdiskonjual8', '{FixDouble_dr1}bdiskonjual9', '{FixDouble_dr1}bdiskonjual10', '{FixDouble_dr1}bavolumevarchar')
```

```sql
select bid from M1_Item where bkode= '{kode}' limit 1
```

```sql
Delete from M1_Item_Location_Warehouse where blgidbarang = '{result_4}'
```

```sql
Insert into M1_Item_Location_Warehouse(blgidbarang, blgkodebarang, blggudang, blgidlokasi, blgkodelokasi, blgnamalokasi, blginputuser, blginputtgl, blgmodifikasiuser, blgmodifikasitgl) values{strValue2_ToString}
```

```sql
Insert into M1_Item_Location_Warehouse(blgidbarang, blggudang, blgkodebarang, blgidlokasi, blgkodelokasi, blgnamalokasi, blginputuser, blginputtgl, blgmodifikasiuser, blgmodifikasitgl) values{strValue2_ToString}
```

```sql
Delete from M1_Item_Assembly where iaidbarang = '{result_4}'
```

```sql
Insert into M1_Item_Assembly(iaidbarang, iakodebarang, iaidbarangpenyusun, iakodebarangpenyusun, iaurutan, iajml, iasatuan, iainputuser, iainputtgl, iamodifikasiuser, iamodifikasitgl) values{strValue2_ToString}
```

```sql
Delete from M1_Item_Supplier where isidbarang = '{result_4}'
```

```sql
Insert into M1_Item_Supplier(isidbarang, isidkontak, iscatatan, isurutan, iscustomtext1, iscustomtext2, iscustomtext3, iscustomtext4, iscustomtext5, iscustomint1, iscustomint2, iscustomint3, iscustomdbl1, iscustomdbl2, iscustomdbl3, iscustomdate1, iscustomdate2, iscustomdate3) values{strValue2_ToString}
```

```sql
Delete from m1_item_description where ididbarang = '{result_4}'
```

```sql
Insert into m1_item_description(ididbarang, idkode, idketerangan, idurutan, idinputuser, idinputtgl, idmodifikasiuser, idmodifikasitgl) values{strValue2_ToString}
```

```sql
Delete from m1_item_price where khidbarang = '{result_4}'
```

```sql
Insert into M1_Item_Price(khidbarang, khmatauang, khhargabeli, khhargajual, khcatatan, khinputuser, khinputtgl, khmodifikasiuser, khmodifikasitgl, khcustomtext1, khcustomtext2, khcustomtext3, khcustomtext4, khcustomtext5, khcustomint1, khcustomint2, khcustomint3, khcustomint4, khcustomint5, khcustomdbl1, khcustomdbl2, khcustomdbl3, khcustomdbl4, khcustomdbl5, khcustomdate1, khcustomdate2, khcustomdate3, khcustomdate4, khcustomdate5) values{strValue2_ToString} ON DUPLICATE KEY UPDATE khhargabeli=VALUES(khhargabeli), khhargajual=VALUES(khhargajual), khcatatan=VALUES(khcatatan), khmodifikasiuser=VALUES(khmodifikasiuser), khmodifikasitgl=VALUES(khmodifikasitgl), khcustomtext1=VALUES(khcustomtext1), khcustomtext2=VALUES(khcustomtext2), khcustomtext3=VALUES(khcustomtext3), khcustomtext4=VALUES(khcustomtext4), khcustomtext5=VALUES(khcustomtext5), khcustomint1=VALUES(khcustomint1), khcustomint2=VALUES(khcustomint2), khcustomint3=VALUES(khcustomint3), khcustomint4=VALUES(khcustomint4), khcustomint5=VALUES(khcustomint5), khcustomdbl1=VALUES(khcustomdbl1), khcustomdbl2=VALUES(khcustomdbl2), khcustomdbl3=VALUES(khcustomdbl3), khcustomdbl4=VALUES(khcustomdbl4), khcustomdbl5=VALUES(khcustomdbl5), khcustomdate1=VALUES(khcustomdate1), khcustomdate2=VALUES(khcustomdate2), khcustomdate3=VALUES(khcustomdate3), khcustomdate4=VALUES(khcustomdate4), khcustomdate5=VALUES(khcustomdate5)
```

```sql
Delete from m1_item_branch_costcenter where ibcitem = '{result_4}'
```

```sql
Insert into m1_item_branch_costcenter(ibcitem, ibcbranch, ibccostcenter) values{strValue2_ToString}
```

```sql
DELETE FROM m1_item_supplier WHERE isidbarang = '{idtransaksi}'
```

```sql
DELETE FROM m1_item_assembly WHERE iaidbarang = '{idtransaksi}'
```

```sql
DELETE FROM m1_item_location_warehouse WHERE blgidbarang = '{idtransaksi}'
```

```sql
DELETE FROM M1_Item WHERE bid = '{idtransaksi}'
```

```sql
SELECT i.bid AS bid, i.bkode AS bkode, i.bnama AS bnama, i.bnamaalias1 AS bnamaalias1, i.bnamaalias2 AS bnamaalias2, i.bnamaalias3 AS bnamaalias3, i.bnamaalias4 AS bnamaalias4, i.bnamaalias5 AS bnamaalias5, i.btipe AS btipe, i.bjenis AS bjenis, i.bjenisdetail AS bjenisdetail, i.bkategori AS bkategori, i.bketerangan AS bketerangan, i.bsatuan AS bsatuan, i.bnilaisatuan AS bnilaisatuan, i.bsatuandefault AS bsatuandefault, i.bnilaisatuandefault AS bnilaisatuandefault, i.bhpp AS bhpp, i.bcabang AS bcabang, i.blokasi AS blokasi, i.bdivisi AS bdivisi, i.bsubdivisi AS bsubdivisi, i.bgudang AS bgudang, i.bproyek AS bproyek, i.bsubitem AS bsubitem, i.bsubitemdari AS bsubitemdari, i.bbarcode AS bbarcode, i.bsuplier AS bsuplier, i.baktif AS baktif, i.baktiftgl AS baktiftgl, i.bstokminimal AS bstokminimal, i.bstokmaksimal AS bstokmaksimal, i.breorder AS breorder, i.bjmlorderbeli AS bjmlorderbeli, i.bjmlorderjual AS bjmlorderjual, i.bkategoriumur AS bkategoriumur, i.bstatusmoving AS bstatusmoving, i.bsifatharga AS bsifatharga, i.bpromo AS bpromo, i.bpromoberlaku AS bpromoberlaku, i.bpajakbeli AS bpajakbeli, i.bpajakjual AS bpajakjual, i.bhargabeli AS bhargabeli, i.bhppaverage AS bhppaverage, i.bhargajual1 AS bhargajual1, i.bhargajual2 AS bhargajual2, i.bhargajual3 AS bhargajual3, i.bhargajual4 AS bhargajual4, i.bhargajual5 AS bhargajual5, i.bdiskonjual1 AS bdiskonjual1, i.bdiskonjual2 AS bdiskonjual2, i.bdiskonjual3 AS bdiskonjual3, i.bdiskonjual4 AS bdiskonjual4, i.bdiskonjual5 AS bdiskonjual5, (CASE i.bjenis WHEN 'J' THEN 0 ELSE i.bstok END) AS bstok, i.bkomisi AS bkomisi, i.bmarginminimal AS bmarginminimal, i.brekpersediaan AS brekpersediaan, i.brekpenjualan AS brekpenjualan, i.brekreturpenjualan AS brekreturpenjualan, i.brekdiskonpenjualan AS brekdiskonpenjualan, i.brekhargapokok AS brekhargapokok, i.brekreturpembelian AS brekreturpembelian, i.brekdiskonpembelian AS brekdiskonpembelian, i.brekkonsinyasi AS brekkonsinyasi, i.bapanjang AS bapanjang, i.balebar AS balebar, i.batinggi AS batinggi, i.bavolume AS bavolume, i.baberat AS baberat, i.bawarna AS bawarna, i.baoem AS baoem, i.bamerk AS bamerk, i.baukuran AS baukuran, i.bamodel AS bamodel, i.bakelas AS bakelas, i.bserial AS bserial, i.bbatch AS bbatch, i.bpengganti AS bpengganti, i.bgambar AS bgambar, i.burutan AS burutan, i.bcustom1 AS bcustom1, i.bcustom2 AS bcustom2, i.bcustom3 AS bcustom3, i.bcustom4 AS bcustom4, i.bcustom5 AS bcustom5, i.bcustom6 AS bcustom6, i.bcustom7 AS bcustom7, i.bcustom8 AS bcustom8, i.bcustom9 AS bcustom9, i.bcustom10 AS bcustom10, i.bcustom11 AS bcustom11, i.bcustom12 AS bcustom12, i.bcustom13 AS bcustom13, i.bcustom14 AS bcustom14, i.bcustom15 AS bcustom15, i.bcatatan AS bcatatan, i.binputuser AS binputuser, i.binputtgl AS binputtgl, i.bmodifikasiuser AS bmodifikasiuser, i.bmodifikasitgl AS bmodifikasitgl, i.bedithpp AS bedithpp, it.itnama AS btipenama, ic.icnama AS bkategorinama, u1.unama AS bsatuannama, u2.unama AS bsatuandefaultnama, br.bnama AS bcabangnama, lc.lnama AS blokasinama, dv.dnama AS bdivisinama, sdv.sdnama AS bsubdivisinama, wh.wnama AS bgudangnama, p.pnama AS bproyeknama, i2.bkode AS bsubitemdarikode, c.kkode AS bsuplierkode, c.knama AS bsupliernama, tax1.tnama AS bpajakbelinama, tax2.tnama AS bpajakjualnama, coa1.cnama AS brekpersediaannama, coa2.cnama AS brekpenjualannama, coa3.cnama AS brekreturpenjualannama, coa4.cnama AS brekdiskonpenjualannama, coa5.cnama AS brekhargapokoknama, coa6.cnama AS brekreturpembeliannama, coa7.cnama AS brekdiskonpembeliannama, coa8.cnama AS brekkonsinyasinama, i.bkelasproduk, i.bretur, i.btag, i.bminorder, i.bmobile, i.bassembly, i.bdownloaded, cp.cpnama as bkelasproduknama, tag.ipnama as btagnama, tag.ipjual AS btagjual, tag.ipmutasipusat AS btagmutasipusat, tag.ippermintaanmutasi AS btagpermintaanmutasi ,tag.ipmutasicabang AS btagmutasicabang, tag.ipretursupplier AS btagretursupplier, tag.ippermintaanpembelian AS btagpermintaanpembelian, i.bkp, i.bkl, i.basset, i.bhargajual6, i.bhargajual7, i.bhargajual8, i.bhargajual9, i.bhargajual10, i.bdiskonjual6, i.bdiskonjual7, i.bdiskonjual8, i.bdiskonjual9, i.bdiskonjual10 from `m1_item` `i` left join `m1_item_type` `it` on `i`.`btipe` = `it`.`itkode` left join `m1_item_category` `ic` on `i`.`bkategori` = `ic`.`ickode` left join `m1_unit` `u1` on `i`.`bsatuan` = `u1`.`ukode` left join `m1_unit` `u2` on `i`.`bsatuandefault` = `u2`.`ukode` left join `m1_branch` `br` on `i`.`bcabang` = `br`.`bkode` left join `m1_division` `dv` on `i`.`bdivisi` = `dv`.`dkode` left join `m1_subdivision` `sdv` on `i`.`bsubdivisi` = `sdv`.`sdkode` left join `m1_location` `lc` on `i`.`blokasi` = `lc`.`lkode` left join `m1_warehouse` `wh` on `i`.`bgudang` = `wh`.`wkode` left join `m1_project` `p` on `i`.`bproyek` = `p`.`pkode` left join `m1_item` `i2` on `i`.`bsubitemdari` = `i2`.`bid` left join `m1_contact` `c` on `i`.`bsuplier` = `c`.`kid` left join `m1_tax` `tax1` on `i`.`bpajakbeli` = `tax1`.`tkode` left join `m1_tax` `tax2` on `i`.`bpajakjual` = `tax2`.`tkode` left join `m1_coa` `coa1` on `i`.`brekpersediaan` = `coa1`.`cnomor` left join `m1_coa` `coa2` on `i`.`brekpenjualan` = `coa2`.`cnomor` left join `m1_coa` `coa3` on `i`.`brekreturpenjualan` = `coa3`.`cnomor` left join `m1_coa` `coa4` on `i`.`brekdiskonpenjualan` = `coa4`.`cnomor` left join `m1_coa` `coa5` on `i`.`brekhargapokok` = `coa5`.`cnomor` left join `m1_coa` `coa6` on `i`.`brekreturpembelian` = `coa6`.`cnomor` left join `m1_coa` `coa7` on `i`.`brekdiskonpembelian` = `coa7`.`cnomor` left join `m1_coa` `coa8` on `i`.`brekkonsinyasi` = `coa8`.`cnomor` left join m1_class_product cp on i.bkelasproduk = cp.cpkode left join m1_item_permission tag on i.btag = tag.ipkode
```

```sql
SELECT COUNT(bkode) FROM m1_item WHERE bkode='{idtransaksi}'
```

```sql
SELECT i.bid AS bid, i.bkode AS bkode, i.bnama AS bnama, i.bnamaalias1 AS bnamaalias1, i.bnamaalias2 AS bnamaalias2, i.bnamaalias3 AS bnamaalias3, i.bnamaalias4 AS bnamaalias4, i.bnamaalias5 AS bnamaalias5, i.btipe AS btipe, i.bjenis AS bjenis, i.bjenisdetail AS bjenisdetail, i.bkategori AS bkategori, i.bketerangan AS bketerangan, i.bsatuan AS bsatuan, i.bnilaisatuan AS bnilaisatuan, i.bsatuandefault AS bsatuandefault, i.bnilaisatuandefault AS bnilaisatuandefault, i.bhpp AS bhpp, i.bcabang AS bcabang, i.blokasi AS blokasi, i.bdivisi AS bdivisi, i.bsubdivisi AS bsubdivisi, i.bgudang AS bgudang, i.bproyek AS bproyek, i.bsubitem AS bsubitem, i.bsubitemdari AS bsubitemdari, i.bbarcode AS bbarcode, i.bsuplier AS bsuplier, i.baktif AS baktif, i.baktiftgl AS baktiftgl, i.bstokminimal AS bstokminimal, i.bstokmaksimal AS bstokmaksimal, i.breorder AS breorder, i.bjmlorderbeli AS bjmlorderbeli, i.bjmlorderjual AS bjmlorderjual, i.bkategoriumur AS bkategoriumur, i.bstatusmoving AS bstatusmoving, i.bsifatharga AS bsifatharga, i.bpromo AS bpromo, i.bpromoberlaku AS bpromoberlaku, i.bpajakbeli AS bpajakbeli, i.bpajakjual AS bpajakjual, i.bhargabeli AS bhargabeli, i.bhppaverage AS bhppaverage, i.bhargajual1 AS bhargajual1, i.bhargajual2 AS bhargajual2, i.bhargajual3 AS bhargajual3, i.bhargajual4 AS bhargajual4, i.bhargajual5 AS bhargajual5, i.bdiskonjual1 AS bdiskonjual1, i.bdiskonjual2 AS bdiskonjual2, i.bdiskonjual3 AS bdiskonjual3, i.bdiskonjual4 AS bdiskonjual4, i.bdiskonjual5 AS bdiskonjual5, (CASE i.bjenis WHEN 'J' THEN 0 ELSE i.bstok END) AS bstok, i.bkomisi AS bkomisi, i.bmarginminimal AS bmarginminimal, i.brekpersediaan AS brekpersediaan, i.brekpenjualan AS brekpenjualan, i.brekreturpenjualan AS brekreturpenjualan, i.brekdiskonpenjualan AS brekdiskonpenjualan, i.brekhargapokok AS brekhargapokok, i.brekreturpembelian AS brekreturpembelian, i.brekdiskonpembelian AS brekdiskonpembelian, i.brekkonsinyasi AS brekkonsinyasi, i.bapanjang AS bapanjang, i.balebar AS balebar, i.batinggi AS batinggi, i.bavolume AS bavolume, i.baberat AS baberat, i.bawarna AS bawarna, i.baoem AS baoem, i.bamerk AS bamerk, i.baukuran AS baukuran, i.bamodel AS bamodel, i.bakelas AS bakelas, i.bserial AS bserial, i.bbatch AS bbatch, i.bpengganti AS bpengganti, i.bgambar AS bgambar, i.burutan AS burutan, i.bcustom1 AS bcustom1, i.bcustom2 AS bcustom2, i.bcustom3 AS bcustom3, i.bcustom4 AS bcustom4, i.bcustom5 AS bcustom5, i.bcustom6 AS bcustom6, i.bcustom7 AS bcustom7, i.bcustom8 AS bcustom8, i.bcustom9 AS bcustom9, i.bcustom10 AS bcustom10, i.bcustom11 AS bcustom11, i.bcustom12 AS bcustom12, i.bcustom13 AS bcustom13, i.bcustom14 AS bcustom14, i.bcustom15 AS bcustom15, i.bcatatan AS bcatatan, i.binputuser AS binputuser, i.binputtgl AS binputtgl, i.bmodifikasiuser AS bmodifikasiuser, i.bmodifikasitgl AS bmodifikasitgl, i.bedithpp AS bedithpp, i.bmobile, it.itnama AS btipenama, ic.icnama AS bkategorinama, u1.unama AS bsatuannama, u2.unama AS bsatuandefaultnama, br.bnama AS bcabangnama, lc.lnama AS blokasinama, dv.dnama AS bdivisinama, sdv.sdnama AS bsubdivisinama, wh.wnama AS bgudangnama, p.pnama AS bproyeknama, i2.bkode AS bsubitemdarikode, c.kkode AS bsuplierkode, c.knama AS bsupliernama, tax1.tnama AS bpajakbelinama, tax2.tnama AS bpajakjualnama, coa1.cnama AS brekpersediaannama, coa2.cnama AS brekpenjualannama, coa3.cnama AS brekreturpenjualannama, coa4.cnama AS brekdiskonpenjualannama, coa5.cnama AS brekhargapokoknama, coa6.cnama AS brekreturpembeliannama, coa7.cnama AS brekdiskonpembeliannama, coa8.cnama AS brekkonsinyasinama, sp.spkode AS bkomisikode, sp.spnama AS bkomisinama, ilw.blgidbarang AS blgidbarang, ilw.blgkodebarang AS blgkodebarang, ilw.blggudang AS blggudang, ilw.blgidlokasi AS blgidlokasi, ilw.blgkodelokasi AS blgkodelokasi, ilw.blgnamalokasi AS blgnamalokasi, ilw.blginputuser AS blginputuser, ilw.blginputtgl AS blginputtgl, ilw.blgmodifikasiuser AS blgmodifikasiuser, ilw.blgmodifikasitgl AS blgmodifikasitgl, i.bassembly, i.bkelasproduk, i.bretur, i.btag, i.bminorder, i.bdownloaded, cp.cpnama as bkelasproduknama, tag.ipnama as btagnama, i.bdepartemen, i.bsubdepartemen, dp.dpnama as bdepartemennama, sdp.sdpnama as bsubdepartemennama, i.bkp, i.bkl, i.bjmllapangan, i.bsatuanlapangan, cls.cnama as bakelasnama, i.bsubkelas, scl.scnama as bsubkelasnama, clr.cnama as bawarnanama, i.bdesigner, dsg.dnama as bdesignernama, mdl.mnama as bamodelnama, mrk.mnama as bamerknama, i.bmaterial, mtr.mnama as bmaterialnama, oem.onama as baoemnama, i.bsection, sct.snama as bsectionnama, sze.snama as baukurannama, i.bvendor, vdr.knama as bvendornama, i.basset, i.bhargajual6, i.bhargajual7, i.bhargajual8, i.bhargajual9, i.bhargajual10, i.bdiskonjual6, i.bdiskonjual7, i.bdiskonjual8, i.bdiskonjual9, i.bdiskonjual10, pr.prkode AS bproductionroutekode, pr.prnama AS bproductionroutenama, i.bavolumevarchar from m1_item i left join m1_item_type it on i.btipe = it.itkode left join m1_item_category ic on i.bkategori = ic.ickode left join m1_unit u1 on i.bsatuan = u1.ukode left join m1_unit u2 on i.bsatuandefault = u2.ukode left join m1_branch br on i.bcabang = br.bkode left join m1_division dv on i.bdivisi = dv.dkode left join m1_subdivision sdv on i.bsubdivisi = sdv.sdkode left join m1_location lc on i.blokasi = lc.lkode left join m1_warehouse wh on i.bgudang = wh.wkode left join m1_project p on i.bproyek = p.pkode left join m1_item i2 on i.bsubitemdari = i2.bid left join m1_contact c on i.bsuplier = c.kid left join m1_tax tax1 on i.bpajakbeli = tax1.tkode left join m1_tax tax2 on i.bpajakjual = tax2.tkode left join m1_coa coa1 on i.brekpersediaan = coa1.cnomor left join m1_coa coa2 on i.brekpenjualan = coa2.cnomor left join m1_coa coa3 on i.brekreturpenjualan = coa3.cnomor left join m1_coa coa4 on i.brekdiskonpenjualan = coa4.cnomor left join m1_coa coa5 on i.brekhargapokok = coa5.cnomor left join m1_coa coa6 on i.brekreturpembelian = coa6.cnomor left join m1_coa coa7 on i.brekdiskonpembelian = coa7.cnomor left join m1_coa coa8 on i.brekkonsinyasi = coa8.cnomor left join m1_item_location_warehouse ilw on i.bid = ilw.blgidbarang left join m1_selling_point sp on i.bkomisi = sp.spid left join m1_class_product cp on i.bkelasproduk = cp.cpkode left join m1_department dp on i.bdepartemen = dp.dpkode left join m1_subdepartment sdp on i.bsubdepartemen = sdp.sdpkode left join m1_item_permission tag ON tag.ipkode = i.btag left join m1_class cls on i.bakelas = cls.ckode left join m1_subclass scl on i.bsubkelas = scl.sckode left join m1_color clr on i.bawarna = clr.ckode left join m1_designer dsg on i.bdesigner = dsg.dkode left join m1_model mdl on i.bamodel = mdl.mkode left join m1_merk mrk on i.bamerk = mrk.mkode left join m1_material mtr on i.bmaterial = mtr.mkode left join m1_oem oem on i.baoem = oem.okode left join m1_section sct on i.bsection = sct.skode left join m1_size sze on i.baukuran = sze.skode left join m1_contact vdr on i.bvendor = vdr.kkode LEFT JOIN m1_production_route pr ON pr.prid = i.bcustom11
```

```sql
SELECT i.*, b.bnama AS ianamabarangpenyusun FROM `m1_item_assembly` i JOIN m1_item b ON b.bid = i.iaidbarangpenyusun
```

```sql
SELECT its.isidbarang, its.isidkontak, its.iscatatan, its.isurutan, its.iscustomtext1, its.iscustomtext2, its.iscustomtext3, its.iscustomtext4, its.iscustomtext5, its.iscustomint1, its.iscustomint2, its.iscustomint3, its.iscustomdbl1, its.iscustomdbl2, its.iscustomdbl3, its.iscustomdate1, its.iscustomdate2, its.iscustomdate3, c.kkode, c.knama FROM m1_item_supplier its JOIN m1_contact c ON its.isidkontak = c.kid
```

```sql
SELECT ididbarang, idkode, idketerangan, idurutan, idinputuser, idinputtgl, idmodifikasiuser, idmodifikasitgl FROM m1_item_description
```

```sql
SELECT khidbarang, khmatauang, khhargabeli, khhargajual, khcatatan, khinputuser, khinputtgl, khmodifikasiuser, khmodifikasitgl, khcustomtext1, khcustomtext2, khcustomtext3, khcustomtext4, khcustomtext5, khcustomint1, khcustomint2, khcustomint3, khcustomint4, khcustomint5, khcustomdbl1, khcustomdbl2, khcustomdbl3, khcustomdbl4, khcustomdbl5, khcustomdate1, khcustomdate2, khcustomdate3, khcustomdate4, khcustomdate5 FROM m1_item_price
```

```sql
SELECT ibc.ibcid, ibc.ibcitem, ibc.ibcbranch, ibc.ibccostcenter FROM m1_item_branch_costcenter ibc
```

```sql
select i.bid AS bid, i.bkode AS bkode, i.bnama AS bnama, i.bnamaalias1 AS bnamaalias1, i.bnamaalias2 AS bnamaalias2, i.bnamaalias3 AS bnamaalias3, i.bnamaalias4 AS bnamaalias4, i.bnamaalias5 AS bnamaalias5, i.btipe AS btipe, i.bjenis AS bjenis, i.bjenisdetail AS bjenisdetail, i.bkategori AS bkategori, i.bketerangan AS bketerangan, i.bsatuan AS bsatuan, i.bnilaisatuan AS bnilaisatuan, i.bsatuandefault AS bsatuandefault, i.bnilaisatuandefault AS bnilaisatuandefault, i.bhpp AS bhpp, i.bcabang AS bcabang, i.blokasi AS blokasi, i.bdivisi AS bdivisi, i.bsubdivisi AS bsubdivisi, i.bgudang AS bgudang, i.bproyek AS bproyek, ifnull(sum(ibpo.jmlbooking), 0) AS bjmlorderbeli, ifnull(sum(ib.jmlbooking), 0) AS bjmlorderjual, i.bpajakbeli AS bpajakbeli, i.bpajakjual AS bpajakjual, i.bhargabeli AS bhargabeli, i.bhppaverage AS bhppaverage, i.bhargajual1 AS bhargajual1, i.bhargajual2 AS bhargajual2, i.bhargajual3 AS bhargajual3, i.bhargajual4 AS bhargajual4, i.bhargajual5 AS bhargajual5, i.bdiskonjual1 AS bdiskonjual1, i.bdiskonjual2 AS bdiskonjual2, i.bdiskonjual3 AS bdiskonjual3, i.bdiskonjual4 AS bdiskonjual4, i.bdiskonjual5 AS bdiskonjual5, (CASE i.bjenis WHEN 'J' THEN 0 ELSE i.bstok END) AS bstok, i.bserial AS bserial, i.bbatch AS bbatch, i.bcatatan AS bcatatan, ifnull(f.fnamafile,'') AS fnamafile, i.bkp, i.bkl, i.bjmllapangan, i.bsatuanlapangan, i.baktif, i.baktiftgl, i.basset, i.bhargajual6, i.bhargajual7, i.bhargajual8, i.bhargajual9, i.bhargajual10, i.bdiskonjual6, i.bdiskonjual7, i.bdiskonjual8, i.bdiskonjual9, i.bdiskonjual10 from m1_item i left join m1_item_booking ib on i.bid = ib.idbarang left join m1_item_booking_po ibpo on i.bid = ibpo.idbarang left join m1_files f on (i.bid = f.fidtransaksi) and (f.fdefault = 1) and (f.fsumber = 'Item') left join m1_item_supplier its on i.bid = its.isidbarang left join m1_contact c on its.isidkontak = c.kid
```

```sql
select i.bid AS bid, i.bkode AS bkode, i.bnama AS bnama, i.bnamaalias1 AS bnamaalias1, i.bnamaalias2 AS bnamaalias2, i.bnamaalias3 AS bnamaalias3, i.bnamaalias4 AS bnamaalias4, i.bnamaalias5 AS bnamaalias5, i.btipe AS btipe, i.bjenis AS bjenis, i.bjenisdetail AS bjenisdetail, i.bkategori AS bkategori, i.bketerangan AS bketerangan, i.bsatuan AS bsatuan, i.bnilaisatuan AS bnilaisatuan, i.bsatuandefault AS bsatuandefault, i.bnilaisatuandefault AS bnilaisatuandefault, i.bhpp AS bhpp, i.bcabang AS bcabang, i.blokasi AS blokasi, i.bdivisi AS bdivisi, i.bsubdivisi AS bsubdivisi, i.bgudang AS bgudang, i.bproyek AS bproyek, ifnull(sum(ibpo.jmlbooking), 0) AS bjmlorderbeli, ifnull(sum(ib.jmlbooking), 0) AS bjmlorderjual, i.bpajakbeli AS bpajakbeli, i.bpajakjual AS bpajakjual, i.bhargabeli AS bhargabeli, i.bhppaverage AS bhppaverage, i.bhargajual1 AS bhargajual1, i.bhargajual2 AS bhargajual2, i.bhargajual3 AS bhargajual3, i.bhargajual4 AS bhargajual4, i.bhargajual5 AS bhargajual5, i.bdiskonjual1 AS bdiskonjual1, i.bdiskonjual2 AS bdiskonjual2, i.bdiskonjual3 AS bdiskonjual3, i.bdiskonjual4 AS bdiskonjual4, i.bdiskonjual5 AS bdiskonjual5, (CASE i.bjenis WHEN 'J' THEN 0 ELSE i.bstok END) AS bstok, i.bserial AS bserial, i.bbatch AS bbatch, i.bcatatan AS bcatatan, ifnull(f.fnamafile,'') AS fnamafile, i.bkp, i.bkl, i.bjmllapangan, i.bsatuanlapangan, i.baktif, i.baktiftgl, i.basset, i.bhargajual6, i.bhargajual7, i.bhargajual8, i.bhargajual9, i.bhargajual10, i.bdiskonjual6, i.bdiskonjual7, i.bdiskonjual8, i.bdiskonjual9, i.bdiskonjual10, i.binputtgl, i.binputuser, u1.unama as binputusernama, i.bmodifikasitgl, i.bmodifikasiuser, u2.unama as bmodifikasiusernama, i.bstokminimal from m1_item i left join m1_item_booking ib on i.bid = ib.idbarang left join m1_item_booking_po ibpo on i.bid = ibpo.idbarang left join m1_files f on (i.bid = f.fidtransaksi) and (f.fdefault = 1) and (f.fsumber = 'Item') left join m1_item_supplier its on i.bid = its.isidbarang left join m1_contact c on its.isidkontak = c.kid left join m0_user u1 on i.binputuser = u1.userid left join m0_user u2 on i.bmodifikasiuser = u2.userid
```

```sql
select i.bid AS bid, i.bkode AS bkode, i.bnama AS bnama, i.bnamaalias1 AS bnamaalias1, i.bnamaalias2 AS bnamaalias2, i.bnamaalias3 AS bnamaalias3, i.bnamaalias4 AS bnamaalias4, i.bnamaalias5 AS bnamaalias5, i.btipe AS btipe, i.bjenis AS bjenis, i.bjenisdetail AS bjenisdetail, i.bkategori AS bkategori, i.bketerangan AS bketerangan, i.bsatuan AS bsatuan, i.bnilaisatuan AS bnilaisatuan, i.bsatuandefault AS bsatuandefault, i.bnilaisatuandefault AS bnilaisatuandefault, i.bhpp AS bhpp, i.bcabang AS bcabang, i.blokasi AS blokasi, i.bdivisi AS bdivisi, i.bsubdivisi AS bsubdivisi, i.bgudang AS bgudang, i.bproyek AS bproyek, ifnull(sum(ibpo.jmlbooking), 0) AS bjmlorderbeli, ifnull(sum(ib.jmlbooking), 0) AS bjmlorderjual, i.bpajakbeli AS bpajakbeli, i.bpajakjual AS bpajakjual, i.bhargabeli AS bhargabeli, i.bhppaverage AS bhppaverage, i.bhargajual1 AS bhargajual1, i.bhargajual2 AS bhargajual2, i.bhargajual3 AS bhargajual3, i.bhargajual4 AS bhargajual4, i.bhargajual5 AS bhargajual5, i.bdiskonjual1 AS bdiskonjual1, i.bdiskonjual2 AS bdiskonjual2, i.bdiskonjual3 AS bdiskonjual3, i.bdiskonjual4 AS bdiskonjual4, i.bdiskonjual5 AS bdiskonjual5, (CASE i.bjenis WHEN 'J' THEN 0 ELSE i.bstok END) AS bstok, i.bserial AS bserial, i.bbatch AS bbatch, i.bcatatan AS bcatatan, ifnull(f.fnamafile,'') AS fnamafile, i.bkp, i.bkl, i.bjmllapangan, i.bsatuanlapangan, i.baktif, i.baktiftgl, i.basset, i.bhargajual6, i.bhargajual7, i.bhargajual8, i.bhargajual9, i.bhargajual10, i.bdiskonjual6, i.bdiskonjual7, i.bdiskonjual8, i.bdiskonjual9, i.bdiskonjual10, i.binputtgl, i.binputuser, u1.unama as binputusernama, i.bmodifikasitgl, i.bmodifikasiuser, u2.unama as bmodifikasiusernama, i.bstokminimal from m1_item i left join (SELECT idbarang, SUM(jmlbooking) as jmlbooking FROM m1_item_booking GROUP BY idbarang) as ib on i.bid = ib.idbarang left join (SELECT idbarang, SUM(jmlbooking) as jmlbooking FROM m1_item_booking_po GROUP BY idbarang) as ibpo on i.bid = ibpo.idbarang left join m1_files f on (i.bid = f.fidtransaksi) and (f.fdefault = 1) and (f.fsumber = 'Item') left join m1_item_supplier its on i.bid = its.isidbarang left join m1_contact c on its.isidkontak = c.kid left join m0_user u1 on i.binputuser = u1.userid left join m0_user u2 on i.bmodifikasiuser = u2.userid
```

```sql
select i.bid AS bid, i.bkode AS bkode, i.bnama AS bnama, i.bnamaalias1 AS bnamaalias1, i.bnamaalias2 AS bnamaalias2, i.bnamaalias3 AS bnamaalias3, i.bnamaalias4 AS bnamaalias4, i.bnamaalias5 AS bnamaalias5, i.btipe AS btipe, i.bjenis AS bjenis, i.bjenisdetail AS bjenisdetail, i.bkategori AS bkategori, i.bketerangan AS bketerangan, i.bsatuan AS bsatuan, i.bnilaisatuan AS bnilaisatuan, i.bsatuandefault AS bsatuandefault, i.bnilaisatuandefault AS bnilaisatuandefault, i.bhpp AS bhpp, i.bcabang AS bcabang, i.blokasi AS blokasi, i.bdivisi AS bdivisi, i.bsubdivisi AS bsubdivisi, i.bgudang AS bgudang, i.bproyek AS bproyek, ifnull(sum(ibpo.jmlbooking), 0) AS bjmlorderbeli, ifnull(sum(ib.jmlbooking), 0) AS bjmlorderjual, i.bpajakbeli AS bpajakbeli, i.bpajakjual AS bpajakjual, i.bhargabeli AS bhargabeli, i.bhppaverage AS bhppaverage, i.bhargajual1 AS bhargajual1, i.bhargajual2 AS bhargajual2, i.bhargajual3 AS bhargajual3, i.bhargajual4 AS bhargajual4, i.bhargajual5 AS bhargajual5, i.bdiskonjual1 AS bdiskonjual1, i.bdiskonjual2 AS bdiskonjual2, i.bdiskonjual3 AS bdiskonjual3, i.bdiskonjual4 AS bdiskonjual4, i.bdiskonjual5 AS bdiskonjual5, (CASE i.bjenis WHEN 'J' THEN 0 ELSE IFNULL(st.stok,0) END) AS bstok, i.bserial AS bserial, i.bbatch AS bbatch, i.bcatatan AS bcatatan, ifnull(f.fnamafile,'') AS fnamafile, i.bkp, i.bkl, i.bjmllapangan, i.bsatuanlapangan, i.baktif, i.baktiftgl, i.basset, i.bhargajual6, i.bhargajual7, i.bhargajual8, i.bhargajual9, i.bhargajual10, i.bdiskonjual6, i.bdiskonjual7, i.bdiskonjual8, i.bdiskonjual9, i.bdiskonjual10, i.binputtgl, i.binputuser, u1.unama as binputusernama, i.bmodifikasitgl, i.bmodifikasiuser, u2.unama as bmodifikasiusernama, i.bstokminimal from m1_item i left join (SELECT idbarang, SUM(jmlbooking) as jmlbooking FROM m1_item_booking GROUP BY idbarang) as ib on i.bid = ib.idbarang left join (SELECT idbarang, SUM(jmlbooking) as jmlbooking FROM m1_item_booking_po GROUP BY idbarang) as ibpo on i.bid = ibpo.idbarang left join m1_files f on (i.bid = f.fidtransaksi) and (f.fdefault = 1) and (f.fsumber = 'Item') left join m1_item_supplier its on i.bid = its.isidbarang left join m1_contact c on its.isidkontak = c.kid left join m0_user u1 on i.binputuser = u1.userid left join m0_user u2 on i.bmodifikasiuser = u2.userid left join (SELECT idbarang, SUM(stok) as stok FROM m1_item_stock_warehouse GROUP BY idbarang) as st on i.bid = st.idbarang
```

```sql
select i.bid AS bid, i.bkode AS bkode, i.bnama AS bnama, i.bnamaalias1 AS bnamaalias1, i.bnamaalias2 AS bnamaalias2, i.bnamaalias3 AS bnamaalias3, i.bnamaalias4 AS bnamaalias4, i.bnamaalias5 AS bnamaalias5, i.btipe AS btipe, i.bjenis AS bjenis, i.bjenisdetail AS bjenisdetail, i.bkategori AS bkategori, i.bketerangan AS bketerangan, i.bsatuan AS bsatuan, i.bnilaisatuan AS bnilaisatuan, i.bsatuandefault AS bsatuandefault, i.bnilaisatuandefault AS bnilaisatuandefault, i.bhpp AS bhpp, i.bcabang AS bcabang, i.blokasi AS blokasi, i.bdivisi AS bdivisi, i.bsubdivisi AS bsubdivisi, i.bgudang AS bgudang, i.bproyek AS bproyek, bjmlorderbeli AS bjmlorderbeli, bjmlorderjual AS bjmlorderjual, i.bpajakbeli AS bpajakbeli, i.bpajakjual AS bpajakjual, i.bhargabeli AS bhargabeli, i.bhppaverage AS bhppaverage, i.bhargajual1 AS bhargajual1, i.bhargajual2 AS bhargajual2, i.bhargajual3 AS bhargajual3, i.bhargajual4 AS bhargajual4, i.bhargajual5 AS bhargajual5, i.bdiskonjual1 AS bdiskonjual1, i.bdiskonjual2 AS bdiskonjual2, i.bdiskonjual3 AS bdiskonjual3, i.bdiskonjual4 AS bdiskonjual4, i.bdiskonjual5 AS bdiskonjual5, (CASE i.bjenis WHEN 'J' THEN 0 ELSE IFNULL(bstok,0) END) AS bstok, i.bserial AS bserial, i.bbatch AS bbatch, i.bcatatan AS bcatatan, ifnull(f.fnamafile,'') AS fnamafile, i.bkp, i.bkl, i.bjmllapangan, i.bsatuanlapangan, i.baktif, i.baktiftgl, i.basset, i.bhargajual6, i.bhargajual7, i.bhargajual8, i.bhargajual9, i.bhargajual10, i.bdiskonjual6, i.bdiskonjual7, i.bdiskonjual8, i.bdiskonjual9, i.bdiskonjual10, i.binputtgl, i.binputuser, u1.unama as binputusernama, i.bmodifikasitgl, i.bmodifikasiuser, u2.unama as bmodifikasiusernama, i.bstokminimal from m1_item i
```

```sql
select `i`.`bid` AS `bid`,`i`.`bkode` AS `bkode`,`i`.`bnama` AS `bnama`,`i`.`btipe` AS `btipe`,`i`.`bjenis` AS `bjenis`,`i`.`bkategori` AS `bkategori`,`i`.`bsatuan` AS `bsatuan`,`i`.`bsatuandefault` AS `bsatuandefault`,`i`.`bhpp` AS `bhpp`,`i`.`bbarcode` AS `bbarcode`,`i`.`bhargabeli` AS `bhargabeli`,`i`.`bhppaverage` AS `bhppaverage`,`i`.`bhargajual1` AS `bhargajual1`,`i`.`bhargajual2` AS `bhargajual2`,`i`.`bhargajual3` AS `bhargajual3`,`i`.`bhargajual4` AS `bhargajual4`,`i`.`bhargajual5` AS `bhargajual5`,`i`.`bdiskonjual1` AS `bdiskonjual1`,`i`.`bdiskonjual2` AS `bdiskonjual2`,`i`.`bdiskonjual3` AS `bdiskonjual3`,`i`.`bdiskonjual4` AS `bdiskonjual4`,`i`.`bdiskonjual5` AS `bdiskonjual5`,(CASE i.bjenis WHEN 'J' THEN 0 ELSE `i`.`bstok` END) AS `bstok`,(CASE i.bjenis WHEN 'J' THEN 0 ELSE ifnull(sum(`ib`.`jmlbooking`),0) END) AS `bstokbooking`,`i`.`bmarginminimal` AS `bmarginminimal`,`i`.`brekpersediaan` AS `brekpersediaan`,`i`.`brekpenjualan` AS `brekpenjualan`,`i`.`brekreturpenjualan` AS `brekreturpenjualan`,`i`.`brekdiskonpenjualan` AS `brekdiskonpenjualan`,`i`.`brekhargapokok` AS `brekhargapokok`,`i`.`brekreturpembelian` AS `brekreturpembelian`,`i`.`brekdiskonpembelian` AS `brekdiskonpembelian`,`i`.`brekkonsinyasi` AS `brekkonsinyasi`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,`i`.`bnilaisatuan` AS `bnilaisatuan`,`i`.`bnilaisatuandefault` AS `bnilaisatuandefault`,`i`.`bsuplier` AS `bsuplier`,`c`.`kkode` AS `bsuplierkode`,`c`.`knama` AS `bsupliernama`,`i`.`bstokminimal` AS `bstokminimal`,`i`.`bstokmaksimal` AS `bstokmaksimal`,`i`.`bstatusmoving` AS `bstatusmoving`,`i`.`binputuser` AS `binputuser`,`i`.`binputtgl` AS `binputtgl`,`i`.`bmodifikasiuser` AS `bmodifikasiuser`,`i`.`bmodifikasitgl` AS `bmodifikasitgl`,`f`.`fnamafile` AS `fnamafile`, i.baktif, i.baktiftgl, i.bhargajual6, i.bhargajual7, i.bhargajual8, i.bhargajual9, i.bhargajual10, i.bdiskonjual6, i.bdiskonjual7, i.bdiskonjual8, i.bdiskonjual9, i.bdiskonjual10 from (((`m1_item` `i` left join `m1_item_booking` `ib` on((`i`.`bid` = `ib`.`idbarang`))) left join `m1_contact` `c` on((`i`.`bsuplier` = `c`.`kid`))) left join `m1_files` `f` on(((`i`.`bid` = `f`.`fidtransaksi`) and (`f`.`fdefault` = 1) and (`f`.`fsumber` = 'Item'))))
```

```sql
select `i`.`bid` AS `bid`,`i`.`bkode` AS `bkode`,`i`.`bnama` AS `bnama`,`i`.`btipe` AS `btipe`,`i`.`bjenis` AS `bjenis`,`i`.`bkategori` AS `bkategori`,`i`.`bsatuan` AS `bsatuan`,`i`.`bsatuandefault` AS `bsatuandefault`,`i`.`bhpp` AS `bhpp`,`i`.`bbarcode` AS `bbarcode`,`i`.`bhargabeli` AS `bhargabeli`,`i`.`bhppaverage` AS `bhppaverage`,`i`.`bhargajual1` AS `bhargajual1`,`i`.`bhargajual2` AS `bhargajual2`,`i`.`bhargajual3` AS `bhargajual3`,`i`.`bhargajual4` AS `bhargajual4`,`i`.`bhargajual5` AS `bhargajual5`,`i`.`bdiskonjual1` AS `bdiskonjual1`,`i`.`bdiskonjual2` AS `bdiskonjual2`,`i`.`bdiskonjual3` AS `bdiskonjual3`,`i`.`bdiskonjual4` AS `bdiskonjual4`,`i`.`bdiskonjual5` AS `bdiskonjual5`,(CASE i.bjenis WHEN 'J' THEN 0 ELSE IFNULL(st.stok,0) END) AS `bstok`,(CASE i.bjenis WHEN 'J' THEN 0 ELSE ifnull(sum(`ib`.`jmlbooking`),0) END) AS `bstokbooking`,`i`.`bmarginminimal` AS `bmarginminimal`,`i`.`brekpersediaan` AS `brekpersediaan`,`i`.`brekpenjualan` AS `brekpenjualan`,`i`.`brekreturpenjualan` AS `brekreturpenjualan`,`i`.`brekdiskonpenjualan` AS `brekdiskonpenjualan`,`i`.`brekhargapokok` AS `brekhargapokok`,`i`.`brekreturpembelian` AS `brekreturpembelian`,`i`.`brekdiskonpembelian` AS `brekdiskonpembelian`,`i`.`brekkonsinyasi` AS `brekkonsinyasi`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,`i`.`bnilaisatuan` AS `bnilaisatuan`,`i`.`bnilaisatuandefault` AS `bnilaisatuandefault`,`i`.`bsuplier` AS `bsuplier`,`c`.`kkode` AS `bsuplierkode`,`c`.`knama` AS `bsupliernama`,`i`.`bstokminimal` AS `bstokminimal`,`i`.`bstokmaksimal` AS `bstokmaksimal`,`i`.`bstatusmoving` AS `bstatusmoving`,`i`.`binputuser` AS `binputuser`,`i`.`binputtgl` AS `binputtgl`,`i`.`bmodifikasiuser` AS `bmodifikasiuser`,`i`.`bmodifikasitgl` AS `bmodifikasitgl`,`f`.`fnamafile` AS `fnamafile`, i.baktif, i.baktiftgl, i.bhargajual6, i.bhargajual7, i.bhargajual8, i.bhargajual9, i.bhargajual10, i.bdiskonjual6, i.bdiskonjual7, i.bdiskonjual8, i.bdiskonjual9, i.bdiskonjual10 from `m1_item` `i` left join `m1_item_booking` `ib` on `i`.`bid` = `ib`.`idbarang` left join `m1_contact` `c` on `i`.`bsuplier` = `c`.`kid` left join `m1_files` `f` on `i`.`bid` = `f`.`fidtransaksi` and `f`.`fdefault` = 1 and `f`.`fsumber` = 'Item' left join (SELECT idbarang, SUM(stok) as stok FROM m1_item_stock_warehouse GROUP BY idbarang) as st on i.bid = st.idbarang
```

```sql
Update M1_Item set bkode = '{FixQuotes_dr1}bkode', bnama = '{FixQuotes_dr1}bnama', bnamaalias1 = '{FixQuotes_dr1}bnamaalias1', bnamaalias2 = '{FixQuotes_dr1}bnamaalias2', bnamaalias3 = '{FixQuotes_dr1}bnamaalias3', bnamaalias4 = '{FixQuotes_dr1}bnamaalias4', bnamaalias5 = '{FixQuotes_dr1}bnamaalias5', btipe = '{FixQuotes_dr1}btipe', bjenis = '{FixQuotes_dr1}bjenis', bjenisdetail = {dr1}bjenisdetail, bkategori = '{FixQuotes_dr1}bkategori', bketerangan = '{FixQuotes_dr1}bketerangan', bsatuan = '{FixQuotes_dr1}bsatuan', bnilaisatuan = '{FixDouble_dr1}bnilaisatuan', bsatuandefault = '{FixQuotes_dr1}bsatuandefault', bnilaisatuandefault = '{FixDouble_dr1}bnilaisatuandefault', bhpp = '{FixQuotes_dr1}bhpp', bcabang = '{FixQuotes_dr1}bcabang', blokasi = '{FixQuotes_dr1}blokasi', bdivisi = '{FixQuotes_dr1}bdivisi', bsubdivisi = '{FixQuotes_dr1}bsubdivisi', bgudang = '{FixQuotes_dr1}bgudang', bproyek = '{FixQuotes_dr1}bproyek', bsubitem = {dr1}bsubitem, bsubitemdari = {dr1}bsubitemdari, bbarcode = '{FixQuotes_dr1}bbarcode', bsuplier = {dr1}bsuplier, baktif = {dr1}baktif, baktiftgl = '{FixQuotes_AsFormatTanggal_dr1}baktiftgl', bstokminimal = '{FixDouble_dr1}bstokminimal', bstokmaksimal = '{FixDouble_dr1}bstokmaksimal', breorder = '{FixDouble_dr1}breorder', bjmlorderbeli = '{FixDouble_dr1}bjmlorderbeli', bjmlorderjual = '{FixDouble_dr1}bjmlorderjual', bkategoriumur = '{FixQuotes_dr1}bkategoriumur', bstatusmoving = '{FixQuotes_dr1}bstatusmoving', bsifatharga = '{FixQuotes_dr1}bsifatharga', bpromo = {dr1}bpromo, bpromoberlaku = '{FixQuotes_AsFormatTanggal_dr1}bpromoberlaku', bpajakbeli = '{FixQuotes_dr1}bpajakbeli', bpajakjual = '{FixQuotes_dr1}bpajakjual', bhargabeli = '{FixDouble_dr1}bhargabeli', bhppaverage = '{FixDouble_dr1}bhppaverage', bhargajual1 = '{FixDouble_dr1}bhargajual1', bhargajual2 = '{FixDouble_dr1}bhargajual2', bhargajual3 = '{FixDouble_dr1}bhargajual3', bhargajual4 = '{FixDouble_dr1}bhargajual4', bhargajual5 = '{FixDouble_dr1}bhargajual5', bdiskonjual1 = '{FixDouble_dr1}bdiskonjual1', bdiskonjual2 = '{FixDouble_dr1}bdiskonjual2', bdiskonjual3 = '{FixDouble_dr1}bdiskonjual3', bdiskonjual4 = '{FixDouble_dr1}bdiskonjual4', bdiskonjual5 = '{FixDouble_dr1}bdiskonjual5', bstok = '{FixDouble_dr1}bstok', bkomisi = '{FixDouble_dr1}bkomisi', bmarginminimal = '{FixDouble_dr1}bmarginminimal', brekpersediaan = '{FixQuotes_dr1}brekpersediaan', brekpenjualan = '{FixQuotes_dr1}brekpenjualan', brekreturpenjualan = '{FixQuotes_dr1}brekreturpenjualan', brekdiskonpenjualan = '{FixQuotes_dr1}brekdiskonpenjualan', brekhargapokok = '{FixQuotes_dr1}brekhargapokok', brekreturpembelian = '{FixQuotes_dr1}brekreturpembelian', brekdiskonpembelian = '{FixQuotes_dr1}brekdiskonpembelian', brekkonsinyasi = '{FixQuotes_dr1}brekkonsinyasi', bapanjang = '{FixDouble_dr1}bapanjang', balebar = '{FixDouble_dr1}balebar', batinggi = '{FixDouble_dr1}batinggi', bavolume = '{FixDouble_dr1}bavolume', baberat = '{FixDouble_dr1}baberat', bawarna = '{FixQuotes_dr1}bawarna', baoem = '{FixQuotes_dr1}baoem', bamerk = '{FixQuotes_dr1}bamerk', baukuran = '{FixQuotes_dr1}baukuran', bamodel = '{FixQuotes_dr1}bamodel', bakelas = '{FixQuotes_dr1}bakelas', bserial = {dr1}bserial, bbatch = {dr1}bbatch, bpengganti = {dr1}bpengganti, bgambar = '{FixQuotes_dr1}bgambar', burutan = {dr1}burutan, bcustom1 = '{FixQuotes_dr1}bcustom1', bcustom2 = '{FixQuotes_dr1}bcustom2', bcustom3 = '{FixQuotes_dr1}bcustom3', bcustom4 = '{FixQuotes_dr1}bcustom4', bcustom5 = '{FixQuotes_dr1}bcustom5', bcustom6 = '{FixQuotes_dr1}bcustom6', bcustom7 = '{FixQuotes_dr1}bcustom7', bcustom8 = '{FixQuotes_dr1}bcustom8', bcustom9 = '{FixQuotes_dr1}bcustom9', bcustom10 = '{FixQuotes_dr1}bcustom10', bcustom11 = {dr1}bcustom11, bcustom12 = {dr1}bcustom12, bcustom13 = {dr1}bcustom13, bcustom14 = '{FixDouble_dr1}bcustom14', bcustom15 = '{FixDouble_dr1}bcustom15', bcatatan = '{FixQuotes_dr1}bcatatan', bmodifikasiuser = {dr1}bmodifikasiuser, bmodifikasitgl = NOW(), bedithpp = {dr1}bedithpp, bmobile = {dr1}bmobile, bassembly = {dr1}bassembly, bdownloaded = 0, bkelasproduk = '{dr1}bkelasproduk', bretur = '{dr1}bretur', btag = '{dr1}btag', bminorder = '{dr1}bminorder', bdepartemen = '{dr1}bdepartemen', bsubdepartemen = '{dr1}bsubdepartemen', bkp = '{dr1}bkp', bkl = '{dr1}bkl' , bjmllapangan = '{dr1}bjmllapangan' , bsatuanlapangan = '{dr1}bsatuanlapangan', bsubkelas = '{dr1}bsubkelas', bmaterial = '{dr1}bmaterial', bsection = '{dr1}bsection', bvendor = '{dr1}bvendor', bdesigner = '{dr1}bdesigner' where bid = '{dr1}bid'
```

```sql
Insert into M1_Item (bkode, bnama, bnamaalias1, bnamaalias2, bnamaalias3, bnamaalias4, bnamaalias5, btipe, bjenis, bjenisdetail, bkategori, bketerangan, bsatuan, bnilaisatuan, bsatuandefault, bnilaisatuandefault, bhpp, bcabang, blokasi, bdivisi, bsubdivisi, bgudang, bproyek, bsubitem, bsubitemdari, bbarcode, bsuplier, baktif, baktiftgl, bstokminimal, bstokmaksimal, breorder, bjmlorderbeli, bjmlorderjual, bkategoriumur, bstatusmoving, bsifatharga, bpromo, bpromoberlaku, bpajakbeli, bpajakjual, bhargabeli, bhppaverage, bhargajual1, bhargajual2, bhargajual3, bhargajual4, bhargajual5, bdiskonjual1, bdiskonjual2, bdiskonjual3, bdiskonjual4, bdiskonjual5, bstok, bkomisi, bmarginminimal, brekpersediaan, brekpenjualan, brekreturpenjualan, brekdiskonpenjualan, brekhargapokok, brekreturpembelian, brekdiskonpembelian, brekkonsinyasi, bapanjang, balebar, batinggi, bavolume, baberat, bawarna, baoem, bamerk, baukuran, bamodel, bakelas, bserial, bbatch, bpengganti, bgambar, burutan, bcustom1, bcustom2, bcustom3, bcustom4, bcustom5, bcustom6, bcustom7, bcustom8, bcustom9, bcustom10, bcustom11, bcustom12, bcustom13, bcustom14, bcustom15, bcatatan, binputuser, binputtgl, bmodifikasiuser, bmodifikasitgl, bedithpp, bmobile, bassembly, bkelasproduk, bretur, btag, bminorder, bdepartemen, bsubdepartemen, bkp, bkl, bjmllapangan, bsatuanlapangan, bsubkelas, bmaterial, bsection, bvendor, bdesigner) values('{FixQuotes_dr1}bkode', '{FixQuotes_dr1}bnama', '{FixQuotes_dr1}bnamaalias1', '{FixQuotes_dr1}bnamaalias2', '{FixQuotes_dr1}bnamaalias3', '{FixQuotes_dr1}bnamaalias4', '{FixQuotes_dr1}bnamaalias5', '{FixQuotes_dr1}btipe', '{FixQuotes_dr1}bjenis', {dr1}bjenisdetail, '{FixQuotes_dr1}bkategori', '{FixQuotes_dr1}bketerangan', '{FixQuotes_dr1}bsatuan', '{FixDouble_dr1}bnilaisatuan', '{FixQuotes_dr1}bsatuandefault', '{FixDouble_dr1}bnilaisatuandefault', '{FixQuotes_dr1}bhpp', '{FixQuotes_dr1}bcabang', '{FixQuotes_dr1}blokasi', '{FixQuotes_dr1}bdivisi', '{FixQuotes_dr1}bsubdivisi', '{FixQuotes_dr1}bgudang', '{FixQuotes_dr1}bproyek', {dr1}bsubitem, {dr1}bsubitemdari, '{FixQuotes_dr1}bbarcode', {dr1}bsuplier, {dr1}baktif, '{FixQuotes_AsFormatTanggal_dr1}baktiftgl', '{FixDouble_dr1}bstokminimal', '{FixDouble_dr1}bstokmaksimal', '{FixDouble_dr1}breorder', '{FixDouble_dr1}bjmlorderbeli', '{FixDouble_dr1}bjmlorderjual', '{FixQuotes_dr1}bkategoriumur', '{FixQuotes_dr1}bstatusmoving', '{FixQuotes_dr1}bsifatharga', {dr1}bpromo, '{FixQuotes_AsFormatTanggal_dr1}bpromoberlaku', '{FixQuotes_dr1}bpajakbeli', '{FixQuotes_dr1}bpajakjual', '{FixDouble_dr1}bhargabeli', '{FixDouble_dr1}bhppaverage', '{FixDouble_dr1}bhargajual1', '{FixDouble_dr1}bhargajual2', '{FixDouble_dr1}bhargajual3', '{FixDouble_dr1}bhargajual4', '{FixDouble_dr1}bhargajual5', '{FixDouble_dr1}bdiskonjual1', '{FixDouble_dr1}bdiskonjual2', '{FixDouble_dr1}bdiskonjual3', '{FixDouble_dr1}bdiskonjual4', '{FixDouble_dr1}bdiskonjual5', '{FixDouble_dr1}bstok', '{FixDouble_dr1}bkomisi', '{FixDouble_dr1}bmarginminimal', '{FixQuotes_dr1}brekpersediaan', '{FixQuotes_dr1}brekpenjualan', '{FixQuotes_dr1}brekreturpenjualan', '{FixQuotes_dr1}brekdiskonpenjualan', '{FixQuotes_dr1}brekhargapokok', '{FixQuotes_dr1}brekreturpembelian', '{FixQuotes_dr1}brekdiskonpembelian', '{FixQuotes_dr1}brekkonsinyasi', '{FixDouble_dr1}bapanjang', '{FixDouble_dr1}balebar', '{FixDouble_dr1}batinggi', '{FixDouble_dr1}bavolume', '{FixDouble_dr1}baberat', '{FixQuotes_dr1}bawarna', '{FixQuotes_dr1}baoem', '{FixQuotes_dr1}bamerk', '{FixQuotes_dr1}baukuran', '{FixQuotes_dr1}bamodel', '{FixQuotes_dr1}bakelas', {dr1}bserial, {dr1}bbatch, {dr1}bpengganti, '{FixQuotes_dr1}bgambar', {dr1}burutan, '{FixQuotes_dr1}bcustom1', '{FixQuotes_dr1}bcustom2', '{FixQuotes_dr1}bcustom3', '{FixQuotes_dr1}bcustom4', '{FixQuotes_dr1}bcustom5', '{FixQuotes_dr1}bcustom6', '{FixQuotes_dr1}bcustom7', '{FixQuotes_dr1}bcustom8', '{FixQuotes_dr1}bcustom9', '{FixQuotes_dr1}bcustom10', {dr1}bcustom11, {dr1}bcustom12, {dr1}bcustom13, '{FixDouble_dr1}bcustom14', '{FixDouble_dr1}bcustom15', '{FixQuotes_dr1}bcatatan', {dr1}binputuser, NOW(), {dr1}bmodifikasiuser, '1971-01-01 00:00:00', {dr1}bedithpp, {dr1}bmobile, {dr1}bassembly, '{dr1}bkelasproduk', '{dr1}bretur', '{dr1}btag', '{dr1}bminorder', '{dr1}bdepartemen', '{dr1}bsubdepartemen', '{dr1}bkp', '{dr1}bkl', '{dr1}bjmllapangan', '{dr1}bsatuanlapangan', '{FixQuotes_dr1}bsubkelas', '{FixQuotes_dr1}bmaterial', '{FixQuotes_dr1}bsection', '{FixQuotes_dr1}bvendor', '{FixQuotes_dr1}bdesigner')
```

```sql
Insert into M1_Unit (ukode, unama, unilai, uketerangan, uaktif, uindexbarcode, uinputuser, uinputtgl, umodifikasiuser, umodifikasitgl) values('{FixQuotes_dr1}bsatuan', '{FixQuotes_dr1}bsatuan', '{FixQuotes_dr1}bnilaisatuan', '', '1', '', '{dr1}binputuser', NOW(), 0, '1971-01-01 00:00:00'), ('{FixQuotes_dr1}bsatuandefault', '{FixQuotes_dr1}bsatuandefault', '{FixQuotes_dr1}bnilaisatuandefault', '', '1', '', '{dr1}binputuser', NOW(), 0, '1971-01-01 00:00:00') ON DUPLICATE KEY UPDATE ukode = VALUES(ukode)
```

```sql
SELECT COUNT(bid) FROM M1_Item WHERE bid='{dataUtama_0}'
```

```sql
Update M1_Item set bkode = '{FixQuotes_dataUtama_1}', bnama = '{FixQuotes_dataUtama_2}', bnamaalias1 = '{FixQuotes_dataUtama_3}', bnamaalias2 = '{FixQuotes_dataUtama_4}', bnamaalias3 = '{FixQuotes_dataUtama_5}', bnamaalias4 = '{FixQuotes_dataUtama_6}', bnamaalias5 = '{FixQuotes_dataUtama_7}', btipe = '{FixQuotes_dataUtama_8}', bjenis = '{FixQuotes_dataUtama_9}', bjenisdetail = {dataUtama_10}, bkategori = '{FixQuotes_dataUtama_11}', bketerangan = '{FixQuotes_dataUtama_12}', bsatuan = '{FixQuotes_dataUtama_13}', bnilaisatuan = '{FixDouble_dataUtama_14}', bsatuandefault = '{FixQuotes_dataUtama_15}', bnilaisatuandefault = '{FixDouble_dataUtama_16}', bhpp = '{FixQuotes_dataUtama_17}', bcabang = '{FixQuotes_dataUtama_18}', blokasi = '{FixQuotes_dataUtama_19}', bdivisi = '{FixQuotes_dataUtama_20}', bsubdivisi = '{FixQuotes_dataUtama_21}', bgudang = '{FixQuotes_dataUtama_22}', bproyek = '{FixQuotes_dataUtama_23}', bsubitem = {dataUtama_24}, bsubitemdari = {dataUtama_25}, bbarcode = '{FixQuotes_dataUtama_26}', bsuplier = {dataUtama_27}, baktif = {dataUtama_28}, baktiftgl = '{FixQuotes_AsFormatTanggal_dataUtama_29}', bstokminimal = '{FixDouble_dataUtama_30}', bstokmaksimal = '{FixDouble_dataUtama_31}', breorder = '{FixDouble_dataUtama_32}', bjmlorderbeli = '{FixDouble_dataUtama_33}', bjmlorderjual = '{FixDouble_dataUtama_34}', bkategoriumur = '{FixQuotes_dataUtama_35}', bstatusmoving = '{FixQuotes_dataUtama_36}', bsifatharga = '{FixQuotes_dataUtama_37}', bpromo = {dataUtama_38}, bpromoberlaku = '{FixQuotes_AsFormatTanggal_dataUtama_39}', bpajakbeli = '{FixQuotes_dataUtama_40}', bpajakjual = '{FixQuotes_dataUtama_41}', bhargabeli = '{FixDouble_dataUtama_42}', bhppaverage = '{FixDouble_dataUtama_43}', bhargajual1 = '{FixDouble_dataUtama_44}', bhargajual2 = '{FixDouble_dataUtama_45}', bhargajual3 = '{FixDouble_dataUtama_46}', bhargajual4 = '{FixDouble_dataUtama_47}', bhargajual5 = '{FixDouble_dataUtama_48}', bdiskonjual1 = '{FixDouble_dataUtama_49}', bdiskonjual2 = '{FixDouble_dataUtama_50}', bdiskonjual3 = '{FixDouble_dataUtama_51}', bdiskonjual4 = '{FixDouble_dataUtama_52}', bdiskonjual5 = '{FixDouble_dataUtama_53}', bstok = '{FixDouble_dataUtama_54}', bkomisi = '{FixDouble_dataUtama_55}', bmarginminimal = '{FixDouble_dataUtama_56}', brekpersediaan = '{FixQuotes_dataUtama_57}', brekpenjualan = '{FixQuotes_dataUtama_58}', brekreturpenjualan = '{FixQuotes_dataUtama_59}', brekdiskonpenjualan = '{FixQuotes_dataUtama_60}', brekhargapokok = '{FixQuotes_dataUtama_61}', brekreturpembelian = '{FixQuotes_dataUtama_62}', brekdiskonpembelian = '{FixQuotes_dataUtama_63}', brekkonsinyasi = '{FixQuotes_dataUtama_64}', bapanjang = '{FixDouble_dataUtama_65}', balebar = '{FixDouble_dataUtama_66}', batinggi = '{FixDouble_dataUtama_67}', bavolume = '{FixDouble_dataUtama_68}', baberat = '{FixDouble_dataUtama_69}', bawarna = '{FixQuotes_dataUtama_70}', baoem = '{FixQuotes_dataUtama_71}', bamerk = '{FixQuotes_dataUtama_72}', baukuran = '{FixQuotes_dataUtama_73}', bamodel = '{FixQuotes_dataUtama_74}', bakelas = '{FixQuotes_dataUtama_75}', bserial = {dataUtama_76}, bbatch = {dataUtama_77}, bpengganti = {dataUtama_78}, bgambar = '{FixQuotes_dataUtama_79}', burutan = {dataUtama_80}, bcustom1 = '{FixQuotes_dataUtama_81}', bcustom2 = '{FixQuotes_dataUtama_82}', bcustom3 = '{FixQuotes_dataUtama_83}', bcustom4 = '{FixQuotes_dataUtama_84}', bcustom5 = '{FixQuotes_dataUtama_85}', bcustom6 = '{FixQuotes_dataUtama_86}', bcustom7 = '{FixQuotes_dataUtama_87}', bcustom8 = '{FixQuotes_dataUtama_88}', bcustom9 = '{FixQuotes_dataUtama_89}', bcustom10 = '{FixQuotes_dataUtama_90}', bcustom11 = {dataUtama_91}, bcustom12 = {dataUtama_92}, bcustom13 = {dataUtama_93}, bcustom14 = '{FixDouble_dataUtama_94}', bcustom15 = '{FixDouble_dataUtama_95}', bcatatan = '{FixQuotes_dataUtama_96}', binputuser = {dataUtama_97}, binputtgl = '{FixQuotes_AsFormatTanggal_dataUtama_98}yyyy-MM-dd H:mm:ss', bmodifikasiuser = {dataUtama_99}, bmodifikasitgl = '{FixQuotes_AsFormatTanggal_dataUtama_100}yyyy-MM-dd H:mm:ss', bedithpp = {dataUtama_101}, bmobile = {dataUtama_102}, bsubkelas = '{FixQuotes_dataUtama_103}', bmaterial = '{FixQuotes_dataUtama_104}', bsection = '{FixQuotes_dataUtama_105}', bvendor = '{FixQuotes_dataUtama_106}', bdesigner = '{FixQuotes_dataUtama_107}' where bid = '{dataUtama_0}'
```

```sql
Insert into M1_Item (bkode, bnama, bnamaalias1, bnamaalias2, bnamaalias3, bnamaalias4, bnamaalias5, btipe, bjenis, bjenisdetail, bkategori, bketerangan, bsatuan, bnilaisatuan, bsatuandefault, bnilaisatuandefault, bhpp, bcabang, blokasi, bdivisi, bsubdivisi, bgudang, bproyek, bsubitem, bsubitemdari, bbarcode, bsuplier, baktif, baktiftgl, bstokminimal, bstokmaksimal, breorder, bjmlorderbeli, bjmlorderjual, bkategoriumur, bstatusmoving, bsifatharga, bpromo, bpromoberlaku, bpajakbeli, bpajakjual, bhargabeli, bhppaverage, bhargajual1, bhargajual2, bhargajual3, bhargajual4, bhargajual5, bdiskonjual1, bdiskonjual2, bdiskonjual3, bdiskonjual4, bdiskonjual5, bstok, bkomisi, bmarginminimal, brekpersediaan, brekpenjualan, brekreturpenjualan, brekdiskonpenjualan, brekhargapokok, brekreturpembelian, brekdiskonpembelian, brekkonsinyasi, bapanjang, balebar, batinggi, bavolume, baberat, bawarna, baoem, bamerk, baukuran, bamodel, bakelas, bserial, bbatch, bpengganti, bgambar, burutan, bcustom1, bcustom2, bcustom3, bcustom4, bcustom5, bcustom6, bcustom7, bcustom8, bcustom9, bcustom10, bcustom11, bcustom12, bcustom13, bcustom14, bcustom15, bcatatan, binputuser, binputtgl, bmodifikasiuser, bmodifikasitgl, bedithpp, bmobile, bsubkelas, bmaterial, bsection, bvendor, bdesigner) values('{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', '{FixQuotes_dataUtama_4}', '{FixQuotes_dataUtama_5}', '{FixQuotes_dataUtama_6}', '{FixQuotes_dataUtama_7}', '{FixQuotes_dataUtama_8}', '{FixQuotes_dataUtama_9}', {dataUtama_10}, '{FixQuotes_dataUtama_11}', '{FixQuotes_dataUtama_12}', '{FixQuotes_dataUtama_13}', '{FixDouble_dataUtama_14}', '{FixQuotes_dataUtama_15}', '{FixDouble_dataUtama_16}', '{FixQuotes_dataUtama_17}', '{FixQuotes_dataUtama_18}', '{FixQuotes_dataUtama_19}', '{FixQuotes_dataUtama_20}', '{FixQuotes_dataUtama_21}', '{FixQuotes_dataUtama_22}', '{FixQuotes_dataUtama_23}', {dataUtama_24}, {dataUtama_25}, '{FixQuotes_dataUtama_26}', {dataUtama_27}, {dataUtama_28}, '{FixQuotes_AsFormatTanggal_dataUtama_29}', '{FixDouble_dataUtama_30}', '{FixDouble_dataUtama_31}', '{FixDouble_dataUtama_32}', '{FixDouble_dataUtama_33}', '{FixDouble_dataUtama_34}', '{FixQuotes_dataUtama_35}', '{FixQuotes_dataUtama_36}', '{FixQuotes_dataUtama_37}', {dataUtama_38}, '{FixQuotes_AsFormatTanggal_dataUtama_39}', '{FixQuotes_dataUtama_40}', '{FixQuotes_dataUtama_41}', '{FixDouble_dataUtama_42}', '{FixDouble_dataUtama_43}', '{FixDouble_dataUtama_44}', '{FixDouble_dataUtama_45}', '{FixDouble_dataUtama_46}', '{FixDouble_dataUtama_47}', '{FixDouble_dataUtama_48}', '{FixDouble_dataUtama_49}', '{FixDouble_dataUtama_50}', '{FixDouble_dataUtama_51}', '{FixDouble_dataUtama_52}', '{FixDouble_dataUtama_53}', '{FixDouble_dataUtama_54}', '{FixDouble_dataUtama_55}', '{FixDouble_dataUtama_56}', '{FixQuotes_dataUtama_57}', '{FixQuotes_dataUtama_58}', '{FixQuotes_dataUtama_59}', '{FixQuotes_dataUtama_60}', '{FixQuotes_dataUtama_61}', '{FixQuotes_dataUtama_62}', '{FixQuotes_dataUtama_63}', '{FixQuotes_dataUtama_64}', '{FixDouble_dataUtama_65}', '{FixDouble_dataUtama_66}', '{FixDouble_dataUtama_67}', '{FixDouble_dataUtama_68}', '{FixDouble_dataUtama_69}', '{FixQuotes_dataUtama_70}', '{FixQuotes_dataUtama_71}', '{FixQuotes_dataUtama_72}', '{FixQuotes_dataUtama_73}', '{FixQuotes_dataUtama_74}', '{FixQuotes_dataUtama_75}', {dataUtama_76}, {dataUtama_77}, {dataUtama_78}, '{FixQuotes_dataUtama_79}', {dataUtama_80}, '{FixQuotes_dataUtama_81}', '{FixQuotes_dataUtama_82}', '{FixQuotes_dataUtama_83}', '{FixQuotes_dataUtama_84}', '{FixQuotes_dataUtama_85}', '{FixQuotes_dataUtama_86}', '{FixQuotes_dataUtama_87}', '{FixQuotes_dataUtama_88}', '{FixQuotes_dataUtama_89}', '{FixQuotes_dataUtama_90}', {dataUtama_91}, {dataUtama_92}, {dataUtama_93}, '{FixDouble_dataUtama_94}', '{FixDouble_dataUtama_95}', '{FixQuotes_dataUtama_96}', {dataUtama_97}, '{FixQuotes_AsFormatTanggal_dataUtama_98}yyyy-MM-dd H:mm:ss', {dataUtama_99}, '{FixQuotes_AsFormatTanggal_dataUtama_100}yyyy-MM-dd H:mm:ss', {dataUtama_101}, {dataUtama_102}, '{FixQuotes_dataUtama_103}', '{FixQuotes_dataUtama_104}', '{FixQuotes_dataUtama_105}', '{FixQuotes_dataUtama_106}', '{FixQuotes_dataUtama_107}')
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_item_assembly.vb`

```sql
SELECT COUNT(iaidbarang) FROM M1_Item_Assembly WHERE iaidbarang ='{dataUtama_0}' AND iaurutan ='{dataUtama_4}'
```

```sql
Update M1_Item_Assembly set iakodebarang = '{FixQuotes_dataUtama_1}', iaidbarangpenyusun = {dataUtama_2}, iakodebarangpenyusun = '{FixQuotes_dataUtama_3}', iajml = '{FixDouble_dataUtama_5}', iasatuan = '{FixQuotes_dataUtama_6}', iainputuser = {dataUtama_7}, iainputtgl = '{FixQuotes_AsFormatTanggal_dataUtama_8}yyyy-MM-dd H:mm:ss', iamodifikasiuser = {dataUtama_9}, iamodifikasitgl = '{FixQuotes_AsFormatTanggal_dataUtama_10}yyyy-MM-dd H:mm:ss' WHERE iaidbarang ='{dataUtama_0}' AND iaurutan ='{dataUtama_4}'
```

```sql
Insert into M1_Item_Assembly (iaidbarang, iakodebarang, iaidbarangpenyusun, iakodebarangpenyusun, iaurutan, iajml, iasatuan, iainputuser, iainputtgl, iamodifikasiuser, iamodifikasitgl) values({dataUtama_0}, '{FixQuotes_dataUtama_1}', {dataUtama_2}, '{FixQuotes_dataUtama_3}', {dataUtama_4}, '{FixDouble_dataUtama_5}', '{FixQuotes_dataUtama_6}', {dataUtama_7}, '{FixQuotes_AsFormatTanggal_dataUtama_8}yyyy-MM-dd H:mm:ss', {dataUtama_9}, '{FixQuotes_AsFormatTanggal_dataUtama_10}yyyy-MM-dd H:mm:ss')
```

```sql
DELETE FROM M1_Item_Assembly WHERE iaidbarang = '{idbarang}' AND iaurutan = '{urutan}'
```

```sql
SELECT COUNT(iaidbarang) FROM m1_item_assembly WHERE iaidbarang='{idbarang}' AND iaurutan='{urutan}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_item_assembly_history.vb`

```sql
INSERT INTO m1_item_assembly_history(SELECT 0, ia.* FROM m1_item_assembly ia WHERE ia.iaidbarang = '{idtransaksi}' AND ia.iaurutan = '{urutan}')
```

```sql
SELECT `ia`.`iaidhistory` AS `iaidhistory`,`ia`.`iaidbarang` AS `iaidbarang`,`ia`.`iakodebarang` AS `iakodebarang`,`ia`.`iaidbarangpenyusun` AS `iaidbarangpenyusun`,`ia`.`iakodebarangpenyusun` AS `iakodebarangpenyusun`,`ia`.`iaurutan` AS `iaurutan`,`ia`.`iajml` AS `iajml`,`ia`.`iasatuan` AS `iasatuan`,`ia`.`iainputuser` AS `iainputuser`,`ia`.`iainputtgl` AS `iainputtgl`,`ia`.`iamodifikasiuser` AS `iamodifikasiuser`,`ia`.`iamodifikasitgl` AS `iamodifikasitgl`,`ui`.`unama` AS `iainputusernama`,`um`.`unama` AS `iamodifikasiusernama` from ((`m1_item_assembly_history` `ia` LEFT JOIN `m0_user` `ui` ON ((`ia`.`iainputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`ia`.`iamodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_item_category.vb`

```sql
SELECT COUNT(ickode) FROM M1_Item_Category WHERE ickode ='{dataUtama_0}'
```

```sql
Update M1_Item_Category set icnama = '{FixQuotes_dataUtama_1}', icrekpersediaan = '{FixQuotes_dataUtama_2}', icrekhargapokok = '{FixQuotes_dataUtama_3}', icrekpenjualan = '{FixQuotes_dataUtama_4}', iccatatan = '{FixQuotes_dataUtama_5}', icaktif = {dataUtama_6}, icmodifikasiuser = {dataUtama_9}, icmodifikasitgl = NOW(), icdivisi = '{dataUtama_11}', icsubdivisi = '{dataUtama_12}', icdepartemen = '{dataUtama_13}', icsubdepartemen = '{dataUtama_14}', icindexbarcode = '{dataUtama_15}' where ickode = '{dataUtama_0}'
```

```sql
Insert into M1_Item_Category (ickode, icnama, icrekpersediaan, icrekhargapokok, icrekpenjualan, iccatatan, icaktif, icinputuser, icinputtgl, icmodifikasiuser, icmodifikasitgl, icdivisi, icsubdivisi, icdepartemen, icsubdepartemen, icindexbarcode) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', '{FixQuotes_dataUtama_4}', '{FixQuotes_dataUtama_5}', {dataUtama_6}, {dataUtama_7}, NOW(), {dataUtama_9}, '1971-01-01 00:00:00', '{FixQuotes_dataUtama_11}', '{FixQuotes_dataUtama_12}', '{FixQuotes_dataUtama_13}', '{FixQuotes_dataUtama_14}', '{FixQuotes_dataUtama_15}')
```

```sql
DELETE FROM M1_Item_Category WHERE ickode = '{idtransaksi}'
```

```sql
select `ic`.`ickode` AS `ickode`,`ic`.`icnama` AS `icnama`,`ic`.`icrekpersediaan` AS `icrekpersediaan`,`ic`.`icrekhargapokok` AS `icrekhargapokok`,`ic`.`icrekpenjualan` AS `icrekpenjualan`,`ic`.`iccatatan` AS `iccatatan`,`ic`.`icaktif` AS `icaktif`,`ic`.`icinputuser` AS `icinputuser`,`ic`.`icinputtgl` AS `icinputtgl`,`ic`.`icmodifikasiuser` AS `icmodifikasiuser`,`ic`.`icmodifikasitgl` AS `icmodifikasitgl`,`coa1`.`cnama` AS `icrekpersediaannama`,`coa2`.`cnama` AS `icrekhargapokoknama`,`coa3`.`cnama` AS `icrekpenjualannama`, `ic`.`icdivisi` AS `icdivisi`,`ic`.`icsubdivisi` AS `icsubdivisi`,`ic`.`icdepartemen` AS `icdepartemen`,`ic`.`icsubdepartemen` AS `icsubdepartemen`,`divisi`.`dnama` AS `icdivisinama`,`subdivisi`.`sdnama` AS `icsubdivisinama`,`departemen`.`dpnama` AS `icdepartemennama`,`subdepartemen`.`sdpnama` AS `icsubdepartemennama`, ic.icindexbarcode from (((`m1_item_category` `ic` left join `m1_coa` `coa1` on((`ic`.`icrekpersediaan` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`ic`.`icrekhargapokok` = `coa2`.`cnomor`))) left join `m1_coa` `coa3` on((`ic`.`icrekpenjualan` = `coa3`.`cnomor`)) LEFT join `m1_division` `divisi` on((`ic`.`icdivisi` = `divisi`.`dkode`)) LEFT join `m1_subdivision` `subdivisi` on((`ic`.`icsubdivisi` = `subdivisi`.`sdkode`)) LEFT join `m1_department` `departemen` on((`ic`.`icdepartemen` = `departemen`.`dpkode`)) LEFT join `m1_subdepartment` `subdepartemen` on((`ic`.`icsubdepartemen` = `subdepartemen`.`sdpkode`)))
```

```sql
SELECT COUNT(ickode) FROM m1_item_category WHERE ickode='{idtransaksi}'
```

```sql
select ic.ickode AS ickode, ic.icnama AS icnama, s.skode AS sumber, CONCAT('Setting : ', s.smodule, ' - ', s.sgrup, ' - ', s.skode) AS idterkait from m0_setting s join m1_item_category ic on (s.smodule = 0 AND s.sgrup = 'options' AND s.skode = 'KategoriBarang' AND s.snilai = ic.ickode) WHERE ic.ickode = 'valkode' union all select `ic`.`ickode` AS `ickode`,`ic`.`icnama` AS `icnama`,'ITEM' AS `sumber`,`i`.`bid` AS `idterkait` from (`m1_item` `i` join `m1_item_category` `ic` on((`i`.`bkategori` = `ic`.`ickode`))) WHERE ic.ickode='valkode'
```

```sql
DELETE FROM M1_Item_Category
```

```sql
Insert into M1_Item_Category(ickode, icnama, icrekpersediaan, icrekhargapokok, icrekpenjualan, iccatatan, icaktif, icinputuser, icinputtgl, icmodifikasiuser, icmodifikasitgl) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_item_category_history.vb`

```sql
INSERT INTO m1_item_category_history(SELECT 0, c.* FROM m1_item_category c WHERE c.ickode = '{idtransaksi}')
```

```sql
select `ic`.`icidhistory` AS `icidhistory`,`ic`.`ickode` AS `ickode`,`ic`.`icnama` AS `icnama`,`ic`.`icrekpersediaan` AS `icrekpersediaan`,`ic`.`icrekhargapokok` AS `icrekhargapokok`,`ic`.`icrekpenjualan` AS `icrekpenjualan`,`ic`.`iccatatan` AS `iccatatan`,`ic`.`icaktif` AS `icaktif`,`ic`.`icinputuser` AS `icinputuser`,`ic`.`icinputtgl` AS `icinputtgl`,`ic`.`icmodifikasiuser` AS `icmodifikasiuser`,`ic`.`icmodifikasitgl` AS `icmodifikasitgl`,`coa1`.`cnama` AS `icrekpersediaannama`,`coa2`.`cnama` AS `icrekhargapokoknama`,`coa3`.`cnama` AS `icrekpenjualannama`,`ui`.`unama` AS `icinputusernama`,`um`.`unama` AS `icmodifikasiusernama`, ic.icindexbarcode from (((((`m1_item_category_history` `ic` left join `m1_coa` `coa1` on((`ic`.`icrekpersediaan` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`ic`.`icrekhargapokok` = `coa2`.`cnomor`))) left join `m1_coa` `coa3` on((`ic`.`icrekpenjualan` = `coa3`.`cnomor`))) left join `m0_user` `ui` on ((`ic`.`icinputuser` = `ui`.`userid`))) left join `m0_user` `um` on ((`ic`.`icmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_item_hauling.vb`

```sql
SELECT COUNT(bid) FROM M1_Item_Hauling WHERE bid=
```

```sql
Update M1_Item_Hauling set bkode = '{FixQuotes_dataUtama_1}', bnama = '{FixQuotes_dataUtama_2}', bnamaalias1 = '{FixQuotes_dataUtama_3}', bnamaalias2 = '{FixQuotes_dataUtama_4}', bnamaalias3 = '{FixQuotes_dataUtama_5}', bnamaalias4 = '{FixQuotes_dataUtama_6}', bnamaalias5 = '{FixQuotes_dataUtama_7}', btipe = '{FixQuotes_dataUtama_8}', bjenis = '{FixQuotes_dataUtama_9}', bjenisdetail = {dataUtama_10}, bkategori = '{FixQuotes_dataUtama_11}', bketerangan = '{FixQuotes_dataUtama_12}', bsatuan = '{FixQuotes_dataUtama_13}', bnilaisatuan = '{FixDouble_dataUtama_14}', bsatuandefault = '{FixQuotes_dataUtama_15}', bnilaisatuandefault = '{FixDouble_dataUtama_16}', bhpp = '{FixQuotes_dataUtama_17}', bcabang = '{FixQuotes_dataUtama_18}', blokasi = '{FixQuotes_dataUtama_19}', bdivisi = '{FixQuotes_dataUtama_20}', bsubdivisi = '{FixQuotes_dataUtama_21}', bgudang = '{FixQuotes_dataUtama_22}', bproyek = '{FixQuotes_dataUtama_23}', bsubitem = {dataUtama_24}, bsubitemdari = {dataUtama_25}, bbarcode = '{FixQuotes_dataUtama_26}', bsuplier = {dataUtama_27}, baktif = {dataUtama_28}, baktiftgl = '{FixQuotes_AsFormatTanggal_dataUtama_29}', bstokminimal = '{FixDouble_dataUtama_30}', bstokmaksimal = '{FixDouble_dataUtama_31}', breorder = '{FixDouble_dataUtama_32}', bjmlorderbeli = '{FixDouble_dataUtama_33}', bjmlorderjual = '{FixDouble_dataUtama_34}', bkategoriumur = '{FixQuotes_dataUtama_35}', bstatusmoving = '{FixQuotes_dataUtama_36}', bsifatharga = '{FixQuotes_dataUtama_37}', bpromo = {dataUtama_38}, bpromoberlaku = '{FixQuotes_AsFormatTanggal_dataUtama_39}', bpajakbeli = '{FixQuotes_dataUtama_40}', bpajakjual = '{FixQuotes_dataUtama_41}', bhargabeli = '{FixDouble_dataUtama_42}', bhppaverage = '{FixDouble_dataUtama_43}', bhargajual1 = '{FixDouble_dataUtama_44}', bhargajual2 = '{FixDouble_dataUtama_45}', bhargajual3 = '{FixDouble_dataUtama_46}', bhargajual4 = '{FixDouble_dataUtama_47}', bhargajual5 = '{FixDouble_dataUtama_48}', bdiskonjual1 = '{FixQuotes_dataUtama_49}', bdiskonjual2 = '{FixQuotes_dataUtama_50}', bdiskonjual3 = '{FixQuotes_dataUtama_51}', bdiskonjual4 = '{FixQuotes_dataUtama_52}', bdiskonjual5 = '{FixQuotes_dataUtama_53}', bstok = '{FixDouble_dataUtama_54}', bkomisi = '{FixDouble_dataUtama_55}', bmarginminimal = '{FixDouble_dataUtama_56}', brekpersediaan = '{FixQuotes_dataUtama_57}', brekpenjualan = '{FixQuotes_dataUtama_58}', brekreturpenjualan = '{FixQuotes_dataUtama_59}', brekdiskonpenjualan = '{FixQuotes_dataUtama_60}', brekhargapokok = '{FixQuotes_dataUtama_61}', brekreturpembelian = '{FixQuotes_dataUtama_62}', brekdiskonpembelian = '{FixQuotes_dataUtama_63}', brekkonsinyasi = '{FixQuotes_dataUtama_64}', bastatus = {dataUtama_65}, bahourmeter = '{FixDouble_dataUtama_66}', bapanjang = '{FixDouble_dataUtama_67}', balebar = '{FixDouble_dataUtama_68}', batinggi = '{FixDouble_dataUtama_69}', bavolume = '{FixDouble_dataUtama_70}', baberat = '{FixDouble_dataUtama_71}', bawarna = '{FixQuotes_dataUtama_72}', baoem = '{FixQuotes_dataUtama_73}', bamerk = '{FixQuotes_dataUtama_74}', baukuran = '{FixQuotes_dataUtama_75}', bamodel = '{FixQuotes_dataUtama_76}', bakelas = '{FixQuotes_dataUtama_77}', bserial = {dataUtama_78}, bbatch = {dataUtama_79}, bpengganti = {dataUtama_80}, bgambar = '{FixQuotes_dataUtama_81}', bedithpp = {dataUtama_82}, burutan = {dataUtama_83}, bcatatan = '{FixQuotes_dataUtama_84}', binputuser = {dataUtama_85}, bmodifikasiuser = {dataUtama_87}, bmodifikasitgl = NOW(), bcustomtext1 = '{FixQuotes_dataUtama_89}', bcustomtext2 = '{FixQuotes_dataUtama_90}', bcustomtext3 = '{FixQuotes_dataUtama_91}', bcustomtext4 = '{FixQuotes_dataUtama_92}', bcustomtext5 = '{FixQuotes_dataUtama_93}', bcustomtext6 = '{FixQuotes_dataUtama_94}', bcustomtext7 = '{FixQuotes_dataUtama_95}', bcustomtext8 = '{FixQuotes_dataUtama_96}', bcustomtext9 = '{FixQuotes_dataUtama_97}', bcustomtext10 = '{FixQuotes_dataUtama_98}', bcustomint1 = {dataUtama_99}, bcustomint2 = {dataUtama_100}, bcustomint3 = {dataUtama_101}, bcustomint4 = {dataUtama_102}, bcustomint5 = {dataUtama_103}, bcustomdbl1 = '{FixDouble_dataUtama_104}', bcustomdbl2 = '{FixDouble_dataUtama_105}', bcustomdbl3 = '{FixDouble_dataUtama_106}', bcustomdbl4 = '{FixDouble_dataUtama_107}', bcustomdbl5 = '{FixDouble_dataUtama_108}', bcustomdate1 = '{FixQuotes_AsFormatTanggal_dataUtama_109}', bcustomdate2 = '{FixQuotes_AsFormatTanggal_dataUtama_110}', bcustomdate3 = '{FixQuotes_AsFormatTanggal_dataUtama_111}', bcustomdate4 = '{FixQuotes_AsFormatTanggal_dataUtama_112}', bcustomdate5 = '{FixQuotes_AsFormatTanggal_dataUtama_113}' where bid = '{dataUtama_0}'
```

```sql
Insert into M1_Item_Hauling (bkode, bnama, bnamaalias1, bnamaalias2, bnamaalias3, bnamaalias4, bnamaalias5, btipe, bjenis, bjenisdetail, bkategori, bketerangan, bsatuan, bnilaisatuan, bsatuandefault, bnilaisatuandefault, bhpp, bcabang, blokasi, bdivisi, bsubdivisi, bgudang, bproyek, bsubitem, bsubitemdari, bbarcode, bsuplier, baktif, baktiftgl, bstokminimal, bstokmaksimal, breorder, bjmlorderbeli, bjmlorderjual, bkategoriumur, bstatusmoving, bsifatharga, bpromo, bpromoberlaku, bpajakbeli, bpajakjual, bhargabeli, bhppaverage, bhargajual1, bhargajual2, bhargajual3, bhargajual4, bhargajual5, bdiskonjual1, bdiskonjual2, bdiskonjual3, bdiskonjual4, bdiskonjual5, bstok, bkomisi, bmarginminimal, brekpersediaan, brekpenjualan, brekreturpenjualan, brekdiskonpenjualan, brekhargapokok, brekreturpembelian, brekdiskonpembelian, brekkonsinyasi, bastatus, bahourmeter, bapanjang, balebar, batinggi, bavolume, baberat, bawarna, baoem, bamerk, baukuran, bamodel, bakelas, bserial, bbatch, bpengganti, bgambar, bedithpp, burutan, bcatatan, binputuser, binputtgl, bmodifikasiuser, bmodifikasitgl, bcustomtext1, bcustomtext2, bcustomtext3, bcustomtext4, bcustomtext5, bcustomtext6, bcustomtext7, bcustomtext8, bcustomtext9, bcustomtext10, bcustomint1, bcustomint2, bcustomint3, bcustomint4, bcustomint5, bcustomdbl1, bcustomdbl2, bcustomdbl3, bcustomdbl4, bcustomdbl5, bcustomdate1, bcustomdate2, bcustomdate3, bcustomdate4, bcustomdate5) values('{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', '{FixQuotes_dataUtama_4}', '{FixQuotes_dataUtama_5}', '{FixQuotes_dataUtama_6}', '{FixQuotes_dataUtama_7}', '{FixQuotes_dataUtama_8}', '{FixQuotes_dataUtama_9}', {dataUtama_10}, '{FixQuotes_dataUtama_11}', '{FixQuotes_dataUtama_12}', '{FixQuotes_dataUtama_13}', '{FixDouble_dataUtama_14}', '{FixQuotes_dataUtama_15}', '{FixDouble_dataUtama_16}', '{FixQuotes_dataUtama_17}', '{FixQuotes_dataUtama_18}', '{FixQuotes_dataUtama_19}', '{FixQuotes_dataUtama_20}', '{FixQuotes_dataUtama_21}', '{FixQuotes_dataUtama_22}', '{FixQuotes_dataUtama_23}', {dataUtama_24}, {dataUtama_25}, '{FixQuotes_dataUtama_26}', {dataUtama_27}, {dataUtama_28}, '{FixQuotes_AsFormatTanggal_dataUtama_29}', '{FixDouble_dataUtama_30}', '{FixDouble_dataUtama_31}', '{FixDouble_dataUtama_32}', '{FixDouble_dataUtama_33}', '{FixDouble_dataUtama_34}', '{FixQuotes_dataUtama_35}', '{FixQuotes_dataUtama_36}', '{FixQuotes_dataUtama_37}', {dataUtama_38}, '{FixQuotes_AsFormatTanggal_dataUtama_39}', '{FixQuotes_dataUtama_40}', '{FixQuotes_dataUtama_41}', '{FixDouble_dataUtama_42}', '{FixDouble_dataUtama_43}', '{FixDouble_dataUtama_44}', '{FixDouble_dataUtama_45}', '{FixDouble_dataUtama_46}', '{FixDouble_dataUtama_47}', '{FixDouble_dataUtama_48}', '{FixQuotes_dataUtama_49}', '{FixQuotes_dataUtama_50}', '{FixQuotes_dataUtama_51}', '{FixQuotes_dataUtama_52}', '{FixQuotes_dataUtama_53}', '{FixDouble_dataUtama_54}', '{FixDouble_dataUtama_55}', '{FixDouble_dataUtama_56}', '{FixQuotes_dataUtama_57}', '{FixQuotes_dataUtama_58}', '{FixQuotes_dataUtama_59}', '{FixQuotes_dataUtama_60}', '{FixQuotes_dataUtama_61}', '{FixQuotes_dataUtama_62}', '{FixQuotes_dataUtama_63}', '{FixQuotes_dataUtama_64}', {dataUtama_65}, '{FixDouble_dataUtama_66}', '{FixDouble_dataUtama_67}', '{FixDouble_dataUtama_68}', '{FixDouble_dataUtama_69}', '{FixDouble_dataUtama_70}', '{FixDouble_dataUtama_71}', '{FixQuotes_dataUtama_72}', '{FixQuotes_dataUtama_73}', '{FixQuotes_dataUtama_74}', '{FixQuotes_dataUtama_75}', '{FixQuotes_dataUtama_76}', '{FixQuotes_dataUtama_77}', {dataUtama_78}, {dataUtama_79}, {dataUtama_80}, '{FixQuotes_dataUtama_81}', {dataUtama_82}, {dataUtama_83}, '{FixQuotes_dataUtama_84}', {dataUtama_85}, NOW(), 0, '1971-01-01 00:00:00', '{FixQuotes_dataUtama_89}', '{FixQuotes_dataUtama_90}', '{FixQuotes_dataUtama_91}', '{FixQuotes_dataUtama_92}', '{FixQuotes_dataUtama_93}', '{FixQuotes_dataUtama_94}', '{FixQuotes_dataUtama_95}', '{FixQuotes_dataUtama_96}', '{FixQuotes_dataUtama_97}', '{FixQuotes_dataUtama_98}', {dataUtama_99}, {dataUtama_100}, {dataUtama_101}, {dataUtama_102}, {dataUtama_103}, '{FixDouble_dataUtama_104}', '{FixDouble_dataUtama_105}', '{FixDouble_dataUtama_106}', '{FixDouble_dataUtama_107}', '{FixDouble_dataUtama_108}', '{FixQuotes_AsFormatTanggal_dataUtama_109}', '{FixQuotes_AsFormatTanggal_dataUtama_110}', '{FixQuotes_AsFormatTanggal_dataUtama_111}', '{FixQuotes_AsFormatTanggal_dataUtama_112}', '{FixQuotes_AsFormatTanggal_dataUtama_113}')
```

```sql
DELETE FROM M1_Item_Hauling WHERE bid = '{idtransaksi}'
```

```sql
select `ih`.`bid` AS `bid`,`ih`.`bkode` AS `bkode`,`ih`.`bnama` AS `bnama`,`ih`.`bnamaalias1` AS `bnamaalias1`,`ih`.`bnamaalias2` AS `bnamaalias2`,`ih`.`bnamaalias3` AS `bnamaalias3`,`ih`.`bnamaalias4` AS `bnamaalias4`,`ih`.`bnamaalias5` AS `bnamaalias5`,`ih`.`btipe` AS `btipe`,`ih`.`bjenis` AS `bjenis`,`ih`.`bjenisdetail` AS `bjenisdetail`,`ih`.`bkategori` AS `bkategori`,`ih`.`bketerangan` AS `bketerangan`,`ih`.`bsatuan` AS `bsatuan`,`ih`.`bnilaisatuan` AS `bnilaisatuan`,`ih`.`bsatuandefault` AS `bsatuandefault`,`ih`.`bnilaisatuandefault` AS `bnilaisatuandefault`,`ih`.`bhpp` AS `bhpp`,`ih`.`bcabang` AS `bcabang`,`ih`.`blokasi` AS `blokasi`,`ih`.`bdivisi` AS `bdivisi`,`ih`.`bsubdivisi` AS `bsubdivisi`,`ih`.`bgudang` AS `bgudang`,`ih`.`bproyek` AS `bproyek`,`ih`.`bsubitem` AS `bsubitem`,`ih`.`bsubitemdari` AS `bsubitemdari`,`ih`.`bbarcode` AS `bbarcode`,`ih`.`bsuplier` AS `bsuplier`,`ih`.`baktif` AS `baktif`,`ih`.`baktiftgl` AS `baktiftgl`,`ih`.`bstokminimal` AS `bstokminimal`,`ih`.`bstokmaksimal` AS `bstokmaksimal`,`ih`.`breorder` AS `breorder`,`ih`.`bjmlorderbeli` AS `bjmlorderbeli`,`ih`.`bjmlorderjual` AS `bjmlorderjual`,`ih`.`bkategoriumur` AS `bkategoriumur`,`ih`.`bstatusmoving` AS `bstatusmoving`,`ih`.`bsifatharga` AS `bsifatharga`,`ih`.`bpromo` AS `bpromo`,`ih`.`bpromoberlaku` AS `bpromoberlaku`,`ih`.`bpajakbeli` AS `bpajakbeli`,`ih`.`bpajakjual` AS `bpajakjual`,`ih`.`bhargabeli` AS `bhargabeli`,`ih`.`bhppaverage` AS `bhppaverage`,`ih`.`bhargajual1` AS `bhargajual1`,`ih`.`bhargajual2` AS `bhargajual2`,`ih`.`bhargajual3` AS `bhargajual3`,`ih`.`bhargajual4` AS `bhargajual4`,`ih`.`bhargajual5` AS `bhargajual5`,`ih`.`bdiskonjual1` AS `bdiskonjual1`,`ih`.`bdiskonjual2` AS `bdiskonjual2`,`ih`.`bdiskonjual3` AS `bdiskonjual3`,`ih`.`bdiskonjual4` AS `bdiskonjual4`,`ih`.`bdiskonjual5` AS `bdiskonjual5`,`ih`.`bstok` AS `bstok`,`ih`.`bkomisi` AS `bkomisi`,`ih`.`bmarginminimal` AS `bmarginminimal`,`ih`.`brekpersediaan` AS `brekpersediaan`,`ih`.`brekpenjualan` AS `brekpenjualan`,`ih`.`brekreturpenjualan` AS `brekreturpenjualan`,`ih`.`brekdiskonpenjualan` AS `brekdiskonpenjualan`,`ih`.`brekhargapokok` AS `brekhargapokok`,`ih`.`brekreturpembelian` AS `brekreturpembelian`,`ih`.`brekdiskonpembelian` AS `brekdiskonpembelian`,`ih`.`brekkonsinyasi` AS `brekkonsinyasi`,`ih`.`bastatus` AS `bastatus`,`ih`.`bahourmeter` AS `bahourmeter`,`ih`.`bapanjang` AS `bapanjang`,`ih`.`balebar` AS `balebar`,`ih`.`batinggi` AS `batinggi`,`ih`.`bavolume` AS `bavolume`,`ih`.`baberat` AS `baberat`,`ih`.`bawarna` AS `bawarna`,`ih`.`baoem` AS `baoem`,`ih`.`bamerk` AS `bamerk`,`ih`.`baukuran` AS `baukuran`,`ih`.`bamodel` AS `bamodel`,`ih`.`bakelas` AS `bakelas`,`ih`.`bserial` AS `bserial`,`ih`.`bbatch` AS `bbatch`,`ih`.`bpengganti` AS `bpengganti`,`ih`.`bgambar` AS `bgambar`,`ih`.`bedithpp` AS `bedithpp`,`ih`.`burutan` AS `burutan`,`ih`.`bcatatan` AS `bcatatan`,`ih`.`binputuser` AS `binputuser`,`ih`.`binputtgl` AS `binputtgl`,`ih`.`bmodifikasiuser` AS `bmodifikasiuser`,`ih`.`bmodifikasitgl` AS `bmodifikasitgl`,`ih`.`bcustomtext1` AS `bcustomtext1`,`ih`.`bcustomtext2` AS `bcustomtext2`,`ih`.`bcustomtext3` AS `bcustomtext3`,`ih`.`bcustomtext4` AS `bcustomtext4`,`ih`.`bcustomtext5` AS `bcustomtext5`,`ih`.`bcustomtext6` AS `bcustomtext6`,`ih`.`bcustomtext7` AS `bcustomtext7`,`ih`.`bcustomtext8` AS `bcustomtext8`,`ih`.`bcustomtext9` AS `bcustomtext9`,`ih`.`bcustomtext10` AS `bcustomtext10`,`ih`.`bcustomint1` AS `bcustomint1`,`ih`.`bcustomint2` AS `bcustomint2`,`ih`.`bcustomint3` AS `bcustomint3`,`ih`.`bcustomint4` AS `bcustomint4`,`ih`.`bcustomint5` AS `bcustomint5`,`ih`.`bcustomdbl1` AS `bcustomdbl1`,`ih`.`bcustomdbl2` AS `bcustomdbl2`,`ih`.`bcustomdbl3` AS `bcustomdbl3`,`ih`.`bcustomdbl4` AS `bcustomdbl4`,`ih`.`bcustomdbl5` AS `bcustomdbl5`,`ih`.`bcustomdate1` AS `bcustomdate1`,`ih`.`bcustomdate2` AS `bcustomdate2`,`ih`.`bcustomdate3` AS `bcustomdate3`,`ih`.`bcustomdate4` AS `bcustomdate4`,`ih`.`bcustomdate5` AS `bcustomdate5`,`br`.`bnama` AS `bcabangnama`,`lc`.`lnama` AS `blokasinama`,`w`.`wnama` AS `bgudangnama`,`d`.`dnama` AS `bdivisinama`,`sd`.`sdnama` AS `bsubdivisinama`,`p`.`pnama` AS `bproyeknama` from ((((((`m1_item_hauling` `ih` left join `m1_branch` `br` on((`ih`.`bcabang` = `br`.`bkode`))) left join `m1_location` `lc` on((`ih`.`blokasi` = `lc`.`lkode`))) left join `m1_warehouse` `w` on((`ih`.`bgudang` = `w`.`wkode`))) left join `m1_division` `d` on((`ih`.`bdivisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`ih`.`bsubdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`ih`.`bproyek` = `p`.`pkode`)))
```

```sql
select `ih`.`bid` AS `bid`,`ih`.`bkode` AS `bkode`,`ih`.`bnama` AS `bnama`,`ih`.`bnamaalias1` AS `bnamaalias1`,`ih`.`bnamaalias2` AS `bnamaalias2`,`ih`.`bnamaalias3` AS `bnamaalias3`,`ih`.`bnamaalias4` AS `bnamaalias4`,`ih`.`bnamaalias5` AS `bnamaalias5`,`ih`.`btipe` AS `btipe`,`ih`.`bketerangan` AS `bketerangan`,`ih`.`bsatuan` AS `bsatuan`,`ih`.`bnilaisatuan` AS `bnilaisatuan`,`ih`.`bsatuandefault` AS `bsatuandefault`,`ih`.`bnilaisatuandefault` AS `bnilaisatuandefault`,`ih`.`bastatus` AS `bastatus`,`ih`.`bahourmeter` AS `bahourmeter`,`ih`.`bcatatan` AS `bcatatan`,`ih`.`binputuser` AS `binputuser`,`ih`.`binputtgl` AS `binputtgl`,`ih`.`bmodifikasiuser` AS `bmodifikasiuser`,`ih`.`bmodifikasitgl` AS `bmodifikasitgl`,`u1`.`unama` AS `binputusernama`,`u2`.`unama` AS `bmodifikasiusernama` from ((`m1_item_hauling` `ih` left join `m0_user` `u1` on((`ih`.`binputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`ih`.`bmodifikasiuser` = `u2`.`userid`)))
```

```sql
SELECT COUNT(bkode) FROM m1_item_hauling WHERE bkode='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_item_hauling_history.vb`

```sql
INSERT INTO M1_Item_Hauling_History(SELECT 0, ih.* FROM m1_item_hauling ih WHERE ih.bid = '{idtransaksi}')
```

```sql
select `ih`.`bidhistory` AS `bidhistory`,`ih`.`bid` AS `bid`,`ih`.`bkode` AS `bkode`,`ih`.`bnama` AS `bnama`,`ih`.`bnamaalias1` AS `bnamaalias1`,`ih`.`bnamaalias2` AS `bnamaalias2`,`ih`.`bnamaalias3` AS `bnamaalias3`,`ih`.`bnamaalias4` AS `bnamaalias4`,`ih`.`bnamaalias5` AS `bnamaalias5`,`ih`.`btipe` AS `btipe`,`ih`.`bketerangan` AS `bketerangan`,`ih`.`bsatuan` AS `bsatuan`,`ih`.`bnilaisatuan` AS `bnilaisatuan`,`ih`.`bsatuandefault` AS `bsatuandefault`,`ih`.`bnilaisatuandefault` AS `bnilaisatuandefault`,`ih`.`bastatus` AS `bastatus`,`ih`.`bahourmeter` AS `bahourmeter`,`ih`.`bcatatan` AS `bcatatan`,`ih`.`binputuser` AS `binputuser`,`ih`.`binputtgl` AS `binputtgl`,`ih`.`bmodifikasiuser` AS `bmodifikasiuser`,`ih`.`bmodifikasitgl` AS `bmodifikasitgl`,`u1`.`unama` AS `binputusernama`,`u2`.`unama` AS `bmodifikasiusernama` from ((`m1_item_hauling_history` `ih` left join `m0_user` `u1` on((`ih`.`binputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`ih`.`bmodifikasiuser` = `u2`.`userid`)))
```

```sql
select `ih`.`bidhistory` AS `bidhistory`, `ih`.`bid` AS `bid`,`ih`.`bkode` AS `bkode`,`ih`.`bnama` AS `bnama`,`ih`.`bnamaalias1` AS `bnamaalias1`,`ih`.`bnamaalias2` AS `bnamaalias2`,`ih`.`bnamaalias3` AS `bnamaalias3`,`ih`.`bnamaalias4` AS `bnamaalias4`,`ih`.`bnamaalias5` AS `bnamaalias5`,`ih`.`btipe` AS `btipe`,`ih`.`bjenis` AS `bjenis`,`ih`.`bjenisdetail` AS `bjenisdetail`,`ih`.`bkategori` AS `bkategori`,`ih`.`bketerangan` AS `bketerangan`,`ih`.`bsatuan` AS `bsatuan`,`ih`.`bnilaisatuan` AS `bnilaisatuan`,`ih`.`bsatuandefault` AS `bsatuandefault`,`ih`.`bnilaisatuandefault` AS `bnilaisatuandefault`,`ih`.`bhpp` AS `bhpp`,`ih`.`bcabang` AS `bcabang`,`ih`.`blokasi` AS `blokasi`,`ih`.`bdivisi` AS `bdivisi`,`ih`.`bsubdivisi` AS `bsubdivisi`,`ih`.`bgudang` AS `bgudang`,`ih`.`bproyek` AS `bproyek`,`ih`.`bsubitem` AS `bsubitem`,`ih`.`bsubitemdari` AS `bsubitemdari`,`ih`.`bbarcode` AS `bbarcode`,`ih`.`bsuplier` AS `bsuplier`,`ih`.`baktif` AS `baktif`,`ih`.`baktiftgl` AS `baktiftgl`,`ih`.`bstokminimal` AS `bstokminimal`,`ih`.`bstokmaksimal` AS `bstokmaksimal`,`ih`.`breorder` AS `breorder`,`ih`.`bjmlorderbeli` AS `bjmlorderbeli`,`ih`.`bjmlorderjual` AS `bjmlorderjual`,`ih`.`bkategoriumur` AS `bkategoriumur`,`ih`.`bstatusmoving` AS `bstatusmoving`,`ih`.`bsifatharga` AS `bsifatharga`,`ih`.`bpromo` AS `bpromo`,`ih`.`bpromoberlaku` AS `bpromoberlaku`,`ih`.`bpajakbeli` AS `bpajakbeli`,`ih`.`bpajakjual` AS `bpajakjual`,`ih`.`bhargabeli` AS `bhargabeli`,`ih`.`bhppaverage` AS `bhppaverage`,`ih`.`bhargajual1` AS `bhargajual1`,`ih`.`bhargajual2` AS `bhargajual2`,`ih`.`bhargajual3` AS `bhargajual3`,`ih`.`bhargajual4` AS `bhargajual4`,`ih`.`bhargajual5` AS `bhargajual5`,`ih`.`bdiskonjual1` AS `bdiskonjual1`,`ih`.`bdiskonjual2` AS `bdiskonjual2`,`ih`.`bdiskonjual3` AS `bdiskonjual3`,`ih`.`bdiskonjual4` AS `bdiskonjual4`,`ih`.`bdiskonjual5` AS `bdiskonjual5`,`ih`.`bstok` AS `bstok`,`ih`.`bkomisi` AS `bkomisi`,`ih`.`bmarginminimal` AS `bmarginminimal`,`ih`.`brekpersediaan` AS `brekpersediaan`,`ih`.`brekpenjualan` AS `brekpenjualan`,`ih`.`brekreturpenjualan` AS `brekreturpenjualan`,`ih`.`brekdiskonpenjualan` AS `brekdiskonpenjualan`,`ih`.`brekhargapokok` AS `brekhargapokok`,`ih`.`brekreturpembelian` AS `brekreturpembelian`,`ih`.`brekdiskonpembelian` AS `brekdiskonpembelian`,`ih`.`brekkonsinyasi` AS `brekkonsinyasi`,`ih`.`bastatus` AS `bastatus`,`ih`.`bahourmeter` AS `bahourmeter`,`ih`.`bapanjang` AS `bapanjang`,`ih`.`balebar` AS `balebar`,`ih`.`batinggi` AS `batinggi`,`ih`.`bavolume` AS `bavolume`,`ih`.`baberat` AS `baberat`,`ih`.`bawarna` AS `bawarna`,`ih`.`baoem` AS `baoem`,`ih`.`bamerk` AS `bamerk`,`ih`.`baukuran` AS `baukuran`,`ih`.`bamodel` AS `bamodel`,`ih`.`bakelas` AS `bakelas`,`ih`.`bserial` AS `bserial`,`ih`.`bbatch` AS `bbatch`,`ih`.`bpengganti` AS `bpengganti`,`ih`.`bgambar` AS `bgambar`,`ih`.`bedithpp` AS `bedithpp`,`ih`.`burutan` AS `burutan`,`ih`.`bcatatan` AS `bcatatan`,`ih`.`binputuser` AS `binputuser`,`ih`.`binputtgl` AS `binputtgl`,`ih`.`bmodifikasiuser` AS `bmodifikasiuser`,`ih`.`bmodifikasitgl` AS `bmodifikasitgl`,`ih`.`bcustomtext1` AS `bcustomtext1`,`ih`.`bcustomtext2` AS `bcustomtext2`,`ih`.`bcustomtext3` AS `bcustomtext3`,`ih`.`bcustomtext4` AS `bcustomtext4`,`ih`.`bcustomtext5` AS `bcustomtext5`,`ih`.`bcustomtext6` AS `bcustomtext6`,`ih`.`bcustomtext7` AS `bcustomtext7`,`ih`.`bcustomtext8` AS `bcustomtext8`,`ih`.`bcustomtext9` AS `bcustomtext9`,`ih`.`bcustomtext10` AS `bcustomtext10`,`ih`.`bcustomint1` AS `bcustomint1`,`ih`.`bcustomint2` AS `bcustomint2`,`ih`.`bcustomint3` AS `bcustomint3`,`ih`.`bcustomint4` AS `bcustomint4`,`ih`.`bcustomint5` AS `bcustomint5`,`ih`.`bcustomdbl1` AS `bcustomdbl1`,`ih`.`bcustomdbl2` AS `bcustomdbl2`,`ih`.`bcustomdbl3` AS `bcustomdbl3`,`ih`.`bcustomdbl4` AS `bcustomdbl4`,`ih`.`bcustomdbl5` AS `bcustomdbl5`,`ih`.`bcustomdate1` AS `bcustomdate1`,`ih`.`bcustomdate2` AS `bcustomdate2`,`ih`.`bcustomdate3` AS `bcustomdate3`,`ih`.`bcustomdate4` AS `bcustomdate4`,`ih`.`bcustomdate5` AS `bcustomdate5`,`br`.`bnama` AS `bcabangnama`,`lc`.`lnama` AS `blokasinama`,`w`.`wnama` AS `bgudangnama`,`d`.`dnama` AS `bdivisinama`,`sd`.`sdnama` AS `bsubdivisinama`,`p`.`pnama` AS `bproyeknama` from ((((((`m1_item_hauling_history` `ih` left join `m1_branch` `br` on((`ih`.`bcabang` = `br`.`bkode`))) left join `m1_location` `lc` on((`ih`.`blokasi` = `lc`.`lkode`))) left join `m1_warehouse` `w` on((`ih`.`bgudang` = `w`.`wkode`))) left join `m1_division` `d` on((`ih`.`bdivisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`ih`.`bsubdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`ih`.`bproyek` = `p`.`pkode`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_item_history.vb`

```sql
INSERT INTO m1_item_history(SELECT 0, item.* FROM m1_item item WHERE item.bid = '{idtransaksi}')
```

```sql
SELECT bidhistory FROM m1_item_history WHERE bid = '{idtransaksi}' ORDER BY bmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m1_item_location_warehouse_history(SELECT '{FixDouble_result_4}', 0, item.* FROM m1_item_location_warehouse item WHERE item.blgidbarang = '{idtransaksi}')
```

```sql
INSERT INTO m1_item_assembly_history(SELECT '{FixDouble_result_4}', 0, item.* FROM m1_item_assembly item WHERE item.iaidbarang = '{idtransaksi}')
```

```sql
INSERT INTO m1_item_supplier_history(SELECT '{FixDouble_result_4}', 0, item.* FROM m1_item_supplier item WHERE item.isidbarang = '{idtransaksi}')
```

```sql
SELECT its.isidhistorybarang, its.isidhistory, its.isidbarang, its.isidkontak, its.iscatatan, its.isurutan, its.iscustomtext1, its.iscustomtext2, its.iscustomtext3, its.iscustomtext4, its.iscustomtext5, its.iscustomint1, its.iscustomint2, its.iscustomint3, its.iscustomdbl1, its.iscustomdbl2, its.iscustomdbl3, its.iscustomdate1, its.iscustomdate2, its.iscustomdate3, c.kkode, c.knama FROM m1_item_supplier_history its JOIN m1_contact c ON its.isidkontak = c.kid
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_item_location.vb`

```sql
SELECT COUNT(ilid) FROM M1_Item_Location WHERE ilid='{dataUtama_0}'
```

```sql
Update M1_Item_Location set ilkode = '{FixQuotes_dataUtama_1}', ilnama = '{FixQuotes_dataUtama_2}', ilgudang = '{FixQuotes_dataUtama_3}', ilmodifikasiuser = {dataUtama_6}, ilmodifikasitgl = NOW() where ilid = '{dataUtama_0}'
```

```sql
Insert into M1_Item_Location (ilkode, ilnama, ilgudang, ilinputuser, ilinputtgl, ilmodifikasiuser, ilmodifikasitgl) values('{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Item_Location WHERE ilid = '{idtransaksi}'
```

```sql
select `il`.`ilid` AS `ilid`,`il`.`ilkode` AS `ilkode`,`il`.`ilnama` AS `ilnama`,`il`.`ilgudang` AS `ilgudang`,`il`.`ilinputuser` AS `ilinputuser`,`il`.`ilinputtgl` AS `ilinputtgl`,`il`.`ilmodifikasiuser` AS `ilmodifikasiuser`,`il`.`ilmodifikasitgl` AS `ilmodifikasitgl`,`wh`.`wnama` AS `ilgudangnama` from (`m1_item_location` `il` left join `m1_warehouse` `wh` on((`il`.`ilgudang` = `wh`.`wkode`)))
```

```sql
SELECT COUNT(ilkode) FROM m1_item_location WHERE ilkode='{idtransaksi}'
```

```sql
select `il`.`ilid` AS `ilid`,`il`.`ilkode` AS `ilkode`,'ITEM LOCATION WAREHOUSE' AS `sumber`,`ilw`.`blggudang` AS `idterkait` from (`m1_item_location_warehouse` `ilw` join `m1_item_location` `il` on((`ilw`.`blgidlokasi` = `il`.`ilid`))) where il.ilid='valkode'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_item_location_history.vb`

```sql
INSERT INTO m1_item_location_history(SELECT 0, il.* FROM m1_item_location il WHERE il.ilid = '{idtransaksi}')
```

```sql
select `il`.`ilidhistory` AS `ilidhistory`,`il`.`ilid` AS `ilid`,`il`.`ilkode` AS `ilkode`,`il`.`ilnama` AS `ilnama`,`il`.`ilgudang` AS `ilgudang`,`il`.`ilinputuser` AS `ilinputuser`,`il`.`ilinputtgl` AS `ilinputtgl`,`il`.`ilmodifikasiuser` AS `ilmodifikasiuser`,`il`.`ilmodifikasitgl` AS `ilmodifikasitgl`,`wh`.`wnama` AS `ilgudangnama`,`ui`.`unama` AS `ilinputusernama`,`um`.`unama` AS `ilmodifikasiusernama` from (((`m1_item_location_history` `il` left join `m1_warehouse` `wh` on((`il`.`ilgudang` = `wh`.`wkode`))) left join `m0_user` `ui` on ((`il`.`ilinputuser` = `ui`.`userid`))) left join `m0_user` `um` on ((`il`.`ilmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_item_location_warehouse.vb`

```sql
SELECT COUNT(blgidbarang) FROM M1_Item_Location_Warehouse WHERE blgidbarang ='{dataUtama_0}' AND blggudang='{dataUtama_2}'
```

```sql
Update M1_Item_Location_Warehouse set blgkodebarang = '{FixQuotes_dataUtama_1}', blgidlokasi = {dataUtama_3}, blgkodelokasi = '{FixQuotes_dataUtama_4}', blgnamalokasi = '{FixQuotes_dataUtama_5}', blginputuser = {dataUtama_6}, blginputtgl = '{FixQuotes_AsFormatTanggal_dataUtama_7}yyyy-MM-dd H:mm:ss', blgmodifikasiuser = {dataUtama_8}, blgmodifikasitgl = '{FixQuotes_AsFormatTanggal_dataUtama_9}yyyy-MM-dd H:mm:ss' WHERE blgidbarang ='{dataUtama_0}' AND blggudang='{dataUtama_2}'
```

```sql
Insert into M1_Item_Location_Warehouse (blgidbarang, blgkodebarang, blggudang, blgidlokasi, blgkodelokasi, blgnamalokasi, blginputuser, blginputtgl, blgmodifikasiuser, blgmodifikasitgl) values({dataUtama_0}, '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, '{FixQuotes_dataUtama_4}', '{FixQuotes_dataUtama_5}', {dataUtama_6}, '{FixQuotes_AsFormatTanggal_dataUtama_7}yyyy-MM-dd H:mm:ss', {dataUtama_8}, '{FixQuotes_AsFormatTanggal_dataUtama_9}yyyy-MM-dd H:mm:ss')
```

```sql
DELETE FROM M1_Item_Location_Warehouse WHERE blgidbarang = '{idbarang}' AND blggudang = '{gudang}'
```

```sql
SELECT COUNT(blgidbarang) FROM m1_item_location_warehouse WHERE blgidbarang='{idbarang}' AND blggudang='{gudang}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_item_location_warehouse_history.vb`

```sql
INSERT INTO m1_item_location_warehouse_history(SELECT 0, blg.* FROM m1_item_location_warehouse blg WHERE blg.blgidbarang = '{idtransaksi}' AND blg.blggudang = '{gudang}')
```

```sql
SELECT `blg`.`blgidhistory` AS `blgidhistory`,`blg`.`blgidbarang` AS `blgidbarang`,`blg`.`blgkodebarang` AS `blgkodebarang`,`blg`.`blggudang` AS `blggudang`,`blg`.`blgidlokasi` AS `blgidlokasi`,`blg`.`blgkodelokasi` AS `blgkodelokasi`,`blg`.`blgnamalokasi` AS `blgnamalokasi`,`blg`.`blginputuser` AS `blginputuser`,`blg`.`blginputtgl` AS `blginputtgl`,`blg`.`blgmodifikasiuser` AS `blgmodifikasiuser`,`blg`.`blgmodifikasitgl` AS `blgmodifikasitgl`,`ui`.`unama` AS `blginputusernama`,`um`.`unama` AS `blgmodifikasiusernama` from ((`m1_item_location_warehouse_history` `blg` LEFT JOIN `m0_user` `ui` ON ((`blg`.`blginputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`blg`.`blgmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_item_permission.vb`

```sql
SELECT COUNT(ip.ipkode) FROM M1_Item_Permission ip WHERE ip.ipkode ='{FixQuotes_dataUtama_0}'
```

```sql
Update M1_Item_Permission set ipnama = '{FixQuotes_dataUtama_1}', ipcatatan = '{FixQuotes_dataUtama_2}', ipjual = '{FixQuotes_dataUtama_3}', ipmutasipusat = '{FixQuotes_dataUtama_4}', ippermintaanmutasi = '{FixQuotes_dataUtama_5}', ipmutasicabang = '{FixQuotes_dataUtama_6}', ipretursupplier = {dataUtama_7}, ippermintaanpembelian = {dataUtama_8}, ipmodifikasiuser = {dataUtama_11}, ipmodifikasitgl = NOW(), ipcustomtext1 = '{FixQuotes_dataUtama_13}', ipcustomtext2 = '{FixQuotes_dataUtama_14}', ipcustomtext3 = '{FixQuotes_dataUtama_15}', ipcustomtext4 = '{FixQuotes_dataUtama_16}', ipcustomtext5 = '{FixQuotes_dataUtama_17}', ipcustomint1 = {FixQuotes_dataUtama_18}, ipcustomint2 = {FixQuotes_dataUtama_19}, ipcustomint3 = {FixQuotes_dataUtama_20}, ipcustomdbl1 = {FixQuotes_dataUtama_21}, ipcustomdbl2 = {FixQuotes_dataUtama_22}, ipcustomdbl3 = {FixQuotes_dataUtama_23}, ipcustomdate1 = '{FixQuotes_dataUtama_24}', ipcustomdate2 = '{FixQuotes_dataUtama_25}', ipcustomdate3 = '{FixQuotes_dataUtama_26}' where ipkode = '{dataUtama_0}'
```

```sql
Insert into M1_Item_Permission (ipkode, ipnama, ipcatatan, ipjual, ipmutasipusat, ippermintaanmutasi, ipmutasicabang, ipretursupplier, ippermintaanpembelian, ipinputuser, ipinputtgl, ipmodifikasiuser, ipmodifikasitgl, ipcustomtext1, ipcustomtext2, ipcustomtext3, ipcustomtext4, ipcustomtext5, ipcustomint1, ipcustomint2, ipcustomint3, ipcustomdbl1, ipcustomdbl2, ipcustomdbl3, ipcustomdate1, ipcustomdate2, ipcustomdate3) values ('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', '{FixQuotes_dataUtama_4}', '{FixQuotes_dataUtama_5}', '{FixQuotes_dataUtama_6}', {dataUtama_7}, {dataUtama_8}, {dataUtama_9}, NOW(), {dataUtama_11}, '1971-01-01 00:00:00', '{dataUtama_13}', '{dataUtama_14}', '{dataUtama_15}', '{dataUtama_16}', '{dataUtama_17}', {dataUtama_18}, {dataUtama_19}, {dataUtama_20}, {dataUtama_21}, {dataUtama_22}, {dataUtama_23}, '{dataUtama_24}', '{dataUtama_25}', '{dataUtama_26}')
```

```sql
DELETE FROM M1_Item_Permission WHERE ipkode = '{idtransaksi}'
```

```sql
select `ip`.`ipkode` AS `ipkode`, `ip`.`ipnama` AS `ipnama`, `ip`.`ipcatatan` AS `ipcatatan`,`ip`.`ipjual` AS `ipjual`, `ip`.`ipmutasipusat` AS `ipmutasipusat`, `ip`.`ippermintaanmutasi` AS `ippermintaanmutasi`, `ip`.`ipmutasicabang` AS `ipmutasicabang`, `ip`.`ipretursupplier` AS `ipretursupplier`, `ip`.`ippermintaanpembelian` AS `ippermintaanpembelian`, `ip`.`ipinputuser` AS `ipinputuser`, `ip`.`ipinputtgl` AS `ipinputtgl`, `ip`.`ipmodifikasiuser` AS `ipmodifikasiuser`, `ip`.`ipmodifikasitgl` AS `ipmodifikasitgl`, `ip`.`ipcustomtext1` AS `ipcustomtext1`, `ip`.`ipcustomtext2` AS `ipcustomtext2`, `ip`.`ipcustomtext3` AS `ipcustomtext3`, `ip`.`ipcustomtext4` AS `ipcustomtext4`, `ip`.`ipcustomtext5` AS `ipcustomtext5`, `ip`.`ipcustomint1` AS `ipcustomint1`, `ip`.`ipcustomint2` AS `ipcustomint2`, `ip`.`ipcustomint3` AS `ipcustomint3`, `ip`.`ipcustomdbl1` AS `ipcustomdbl1`, `ip`.`ipcustomdbl2` AS `ipcustomdbl2`, `ip`.`ipcustomdbl3` AS `ipcustomdbl3`, `ip`.`ipcustomdate1` AS `ipcustomdate1`, `ip`.`ipcustomdate2` AS `ipcustomdate2`, `ip`.`ipcustomdate3` AS `ipcustomdate3`, `u1`.`unama` AS `ipinputusernama`, `u2`.`unama` AS `ipmodifikasiusernama`from `m1_item_permission` `ip` left join `m0_user` `u1` on `ip`.`ipinputuser` = `u1`.`userid` left join `m0_user` `u2` on `ip`.`ipmodifikasiuser` = `u2`.`userid`
```

```sql
SELECT COUNT(ipkode) FROM M1_Item_Permission WHERE ipkode='{idtransaksi}'
```

```sql
select ip.ipkode AS ipkode, ip.ipnama AS ipnama, s.skode AS sumber, CONCAT('Setting : ', s.smodule, ' - ', s.sgrup, ' - ', s.skode) AS idterkait from m0_setting s join m1_item_permission ip on (s.smodule = 0 AND s.sgrup = 'options' AND s.skode = 'Tag' AND s.snilai = ip.ipkode) WHERE ip.ipkode = 'valkode' UNION ALL select ip.ipkode AS ipkode, ip.ipnama AS ipnama, 'Item' AS sumber, i.bkode AS idterkait from m1_item i join m1_item_permission ip on (i.btag = ip.ipkode) WHERE ip.ipkode = 'valkode'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_item_permission_history.vb`

```sql
INSERT INTO m1_item_permission_history(SELECT 0, ip.* FROM m1_item_permission ip WHERE ip.ipkode = '{idtransaksi}')
```

```sql
select `ip`.`ipkode` AS `ipkode`, `ip`.`ipnama` AS `ipnama`, `ip`.`ipcatatan` AS `ipcatatan`,`ip`.`ipjual` AS `ipjual`, `ip`.`ipmutasipusat` AS `ipmutasipusat`, `ip`.`ippermintaanmutasi` AS `ippermintaanmutasi`, `ip`.`ipmutasicabang` AS `ipmutasicabang`, `ip`.`ipretursupplier` AS `ipretursupplier`, `ip`.`ippermintaanpembelian` AS `ippermintaanpembelian`, `ip`.`ipinputuser` AS `ipinputuser`, `ip`.`ipinputtgl` AS `ipinputtgl`, `ip`.`ipmodifikasiuser` AS `ipmodifikasiuser`, `ip`.`ipmodifikasitgl` AS `ipmodifikasitgl`, `ip`.`ipcustomtext1` AS `ipcustomtext1`, `ip`.`ipcustomtext2` AS `ipcustomtext2`, `ip`.`ipcustomtext3` AS `ipcustomtext3`, `ip`.`ipcustomtext4` AS `ipcustomtext4`, `ip`.`ipcustomtext5` AS `ipcustomtext5`, `ip`.`ipcustomint1` AS `ipcustomint1`, `ip`.`ipcustomint2` AS `ipcustomint2`, `ip`.`ipcustomint3` AS `ipcustomint3`, `ip`.`ipcustomdbl1` AS `ipcustomdbl1`, `ip`.`ipcustomdbl2` AS `ipcustomdbl2`, `ip`.`ipcustomdbl3` AS `ipcustomdbl3`, `ip`.`ipcustomdate1` AS `ipcustomdate1`, `ip`.`ipcustomdate2` AS `ipcustomdate2`, `ip`.`ipcustomdate3` AS `ipcustomdate3`, `u1`.`unama` AS `ipinputusernama`, `u2`.`unama` AS `ipmodifikasiusernama`from `m1_item_permission_history` `ip` left join `m0_user` `u1` on `ip`.`ipinputuser` = `u1`.`userid` left join `m0_user` `u2` on `ip`.`ipmodifikasiuser` = `u2`.`userid`
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_item_type.vb`

```sql
SELECT COUNT(itkode) FROM M1_Item_Type WHERE itkode ='{dataUtama_0}'
```

```sql
Update M1_Item_Type set itnama = '{FixQuotes_dataUtama_1}', itcatatan = '{FixQuotes_dataUtama_2}', itaktif = {dataUtama_3}, itmodifikasiuser = {dataUtama_6}, itmodifikasitgl = NOW() where itkode = '{dataUtama_0}'
```

```sql
Insert into M1_Item_Type (itkode, itnama, itcatatan, itaktif, itinputuser, itinputtgl, itmodifikasiuser, itmodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Item_Type WHERE itkode = '{idtransaksi}'
```

```sql
SELECT COUNT(itkode) FROM m1_item_type WHERE itkode='{idtransaksi}'
```

```sql
select `it`.`itkode` AS `itkode`,`it`.`itnama` AS `itnama`,'ITEM' AS `sumber`,`i`.`bid` AS `idterkait` from (`m1_item` `i` join `m1_item_type` `it` on((`i`.`btipe` = `it`.`itkode`))) where it.itkode='valkode'
```

```sql
DELETE FROM M1_Item_Type
```

```sql
Insert into M1_Item_Type(itkode, itnama, itcatatan, itaktif, itinputuser, itinputtgl, itmodifikasiuser, itmodifikasitgl) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_item_type_history.vb`

```sql
INSERT INTO m1_item_type_history(SELECT 0, it.* FROM m1_item_type it WHERE it.itkode = '{idtransaksi}')
```

```sql
SELECT `it`.`itidhistory` AS `itidhistory`,`it`.`itkode` AS `itkode`,`it`.`itnama` AS `itnama`,`it`.`itcatatan` AS `itcatatan`,`it`.`itaktif` AS `itaktif`,`it`.`itinputuser` AS `itinputuser`,`it`.`itinputtgl` AS `itinputtgl`,`it`.`itmodifikasiuser` AS `itmodifikasiuser`,`it`.`itmodifikasitgl` AS `itmodifikasitgl`,`ui`.`unama` AS `itinputusernama`,`um`.`unama` AS `itmodifikasiusernama` from ((`m1_item_type_history` `it` left join `m0_user` `ui` on ((`it`.`itinputuser` = `ui`.`userid`))) left join `m0_user` `um` on ((`it`.`itmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_lab_result.vb`

```sql
SELECT COUNT(lrid) FROM M1_Lab_Result WHERE lrid ='{dataUtama_0}'
```

```sql
Update M1_Lab_Result set lrkode = '{FixQuotes_dataUtama_1}', lrnama = '{FixQuotes_dataUtama_2}', lrcatatan = '{FixQuotes_dataUtama_3}', lraktif = {dataUtama_4}, lrmodifikasiuser = {dataUtama_7}, lrmodifikasitgl = NOW(), lrstandart = '{FixQuotes_dataUtama_9}', lrkelompok = {dataUtama_10} where lrid = '{dataUtama_0}'
```

```sql
Insert into M1_Lab_Result (lrkode, lrnama, lrcatatan, lraktif, lrinputuser, lrinputtgl, lrmodifikasiuser, lrmodifikasitgl, lrstandart, lrkelompok) values('{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', '{FixQuotes_dataUtama_4}', {dataUtama_5}, NOW(), {dataUtama_7}, '1971-01-01 00:00:00','{FixQuotes_dataUtama_9}',{dataUtama_10})
```

```sql
DELETE FROM M1_Lab_Result WHERE lrid = '{idtransaksi}'
```

```sql
Select a.*, b.bkode AS lrkelompokkode, b.bnama AS lrkelompoknama From m1_lab_result a LEFT JOIN m1_item b ON (a.lrkelompok = b.bid)
```

```sql
SELECT COUNT(lrkode) FROM m1_lab_result WHERE lrkode='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_labour_cost.vb`

```sql
SELECT COUNT(lckode) FROM m1_labour_cost WHERE lckode ='{dataUtama_0}'
```

```sql
Update m1_labour_cost set lcnama = '{FixQuotes_dataUtama_1}', lctipe = {dataUtama_2}, lcakundebit = '{FixQuotes_dataUtama_3}', lcakunkredit = '{FixQuotes_dataUtama_4}', lcharga = '{FixDouble_dataUtama_5}', lcwaktu = {dataUtama_6}, lcsatuanwaktu = '{FixQuotes_dataUtama_7}', lccatatan = '{FixQuotes_dataUtama_8}', lcaktif = {dataUtama_9}, lcmodifikasiuser = {dataUtama_12}, lcmodifikasitgl = NOW() where lckode = '{dataUtama_0}'
```

```sql
Insert into m1_labour_cost (lckode, lcnama, lctipe, lcakundebit, lcakunkredit, lcharga, lcwaktu, lcsatuanwaktu, lccatatan, lcaktif, lcinputuser, lcinputtgl, lcmodifikasiuser, lcmodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', {dataUtama_2}, '{FixQuotes_dataUtama_3}', '{FixQuotes_dataUtama_4}', '{FixDouble_dataUtama_5}', {dataUtama_6}, '{FixQuotes_dataUtama_7}','{FixQuotes_dataUtama_8}', {dataUtama_9},{dataUtama_10}, NOW(), {dataUtama_12}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Labour_cost WHERE lckode = '{idtransaksi}'
```

```sql
SELECT lc.*, c.cnama AS lcakundebetnama, c1.cnama AS lcakunkreditnama, u.unama AS lcsatuanwaktunama FROM m1_labour_cost lc LEFT JOIN m1_coa c ON (lc.lcakundebit = c.cnomor) LEFT JOIN m1_coa c1 ON (lc.lcakunkredit = c1.cnomor) JOIN m1_unit u ON (lc.lcsatuanwaktu = u.ukode)
```

```sql
SELECT COUNT(lckode) FROM m1_labour_cost WHERE lckode='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_layanan.vb`

```sql
SELECT COUNT(lkode) FROM M1_Layanan WHERE lkode ='{dataUtama_0}'
```

```sql
Update M1_Layanan set lnama = '{FixQuotes_dataUtama_1}', lcatatan = '{FixQuotes_dataUtama_2}', laktif = {dataUtama_3}, lmodifikasiuser = {dataUtama_6}, lmodifikasitgl = NOW() where lkode = '{dataUtama_0}'
```

```sql
Insert into M1_Layanan (lkode, lnama, lcatatan, laktif, linputuser, linputtgl, lmodifikasiuser, lmodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Layanan WHERE lkode = '{idtransaksi}'
```

```sql
SELECT COUNT(lkode) FROM m1_layanan WHERE lkode='{idtransaksi}'
```

```sql
DELETE FROM M1_Layanan
```

```sql
Insert into M1_Layanan(lkode, lnama, lcatatan, laktif, linputuser, linputtgl, lmodifikasiuser, lmodifikasitgl) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_location.vb`

```sql
SELECT COUNT(lkode) FROM M1_Location WHERE lkode ='{dataUtama_0}'
```

```sql
Update M1_Location set lnama = '{FixQuotes_dataUtama_1}', lkodetransaksi = '{FixQuotes_dataUtama_2}', lcabang = '{FixQuotes_dataUtama_3}', laktif = {dataUtama_4}, lalamat1 = '{FixQuotes_dataUtama_5}', lalamat2 = '{FixQuotes_dataUtama_6}', lkota = '{FixQuotes_dataUtama_7}', lkodepos = '{FixQuotes_dataUtama_8}', lnotelp = '{FixQuotes_dataUtama_9}', lnofax = '{FixQuotes_dataUtama_10}', lcatatan = '{FixQuotes_dataUtama_11}', lmodifikasiuser = {dataUtama_14}, lmodifikasitanggal = NOW(), lluas = {dataUtama_16} where lkode = '{dataUtama_0}'
```

```sql
Insert into M1_Location (lkode, lnama, lkodetransaksi, lcabang, laktif, lalamat1, lalamat2, lkota, lkodepos, lnotelp, lnofax, lcatatan, linputuser, linputtgl, lmodifikasiuser, lmodifikasitanggal, lluas) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', {dataUtama_4}, '{FixQuotes_dataUtama_5}', '{FixQuotes_dataUtama_6}', '{FixQuotes_dataUtama_7}', '{FixQuotes_dataUtama_8}', '{FixQuotes_dataUtama_9}', '{FixQuotes_dataUtama_10}', '{FixQuotes_dataUtama_11}', {dataUtama_12}, NOW(), {dataUtama_14}, '1971-01-01 00:00:00', {dataUtama_16})
```

```sql
DELETE FROM M1_Location WHERE lkode = '{idtransaksi}'
```

```sql
select `l`.`lkode` AS `lkode`,`l`.`lnama` AS `lnama`,`l`.`lkodetransaksi` AS `lkodetransaksi`,`l`.`lcabang` AS `lcabang`,`l`.`laktif` AS `laktif`,`l`.`lalamat1` AS `lalamat1`,`l`.`lalamat2` AS `lalamat2`,`l`.`lkota` AS `lkota`,`l`.`lkodepos` AS `lkodepos`,`l`.`lnotelp` AS `lnotelp`,`l`.`lnofax` AS `lnofax`,`l`.`lcatatan` AS `lcatatan`,`l`.`linputuser` AS `linputuser`,`l`.`linputtgl` AS `linputtgl`,`l`.`lmodifikasiuser` AS `lmodifikasiuser`,`l`.`lmodifikasitanggal` AS `lmodifikasitanggal`,`b`.`bnama` AS `lcabangnama`,`l`.`lkategoripos` AS `lkategoripos`,`pc`.`pcnama` AS `pcnama`,`l`.`lluas` AS `lluas` from ((`m1_location` `l` left join `m1_branch` `b` on((`l`.`lcabang` = `b`.`bkode`))) left join `m_12_pos_category` `pc` on((`l`.`lkategoripos` = `pc`.`pckode`)))
```

```sql
SELECT COUNT(lkode) FROM m1_location WHERE lkode='{idtransaksi}'
```

```sql
Update M1_Location set lkategoripos = '{FixQuotes_dataUtama_1}' where lkode = '{dataUtama_0}'
```

```sql
DELETE FROM M1_Location
```

```sql
Insert into M1_Location(lkode, lnama, lkodetransaksi, lcabang, laktif, lalamat1, lalamat2, lkota, lkodepos, lnotelp, lnofax, lcatatan, linputuser, linputtgl, lmodifikasiuser, lmodifikasitanggal, lkategoripos) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_location_history.vb`

```sql
INSERT INTO m1_location_history(SELECT 0, l.* FROM m1_location l WHERE l.lkode = '{idtransaksi}')
```

```sql
select `l`.`lidhistory` AS `lidhistory`,`l`.`lkode` AS `lkode`,`l`.`lnama` AS `lnama`,`l`.`lkodetransaksi` AS `lkodetransaksi`,`l`.`lcabang` AS `lcabang`,`l`.`laktif` AS `laktif`,`l`.`lalamat1` AS `lalamat1`,`l`.`lalamat2` AS `lalamat2`,`l`.`lkota` AS `lkota`,`l`.`lkodepos` AS `lkodepos`,`l`.`lnotelp` AS `lnotelp`,`l`.`lnofax` AS `lnofax`,`l`.`lcatatan` AS `lcatatan`,`l`.`linputuser` AS `linputuser`,`l`.`linputtgl` AS `linputtgl`,`l`.`lmodifikasiuser` AS `lmodifikasiuser`,`l`.`lmodifikasitanggal` AS `lmodifikasitgl`,`b`.`bnama` AS `lcabangnama`,`ui`.`unama` AS `linputusernama`,`um`.`unama` AS `lmodifikasiusernama` from (((`m1_location_history` `l` left join `m1_branch` `b` on((`l`.`lcabang` = `b`.`bkode`))) left join `m0_user` `ui` on ((`l`.`linputuser` = `ui`.`userid`))) left join `m0_user` `um` on ((`l`.`lmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_machine.vb`

```sql
SELECT COUNT(mkode) FROM m1_machine WHERE mkode ='{dataUtama_0}'
```

```sql
Update M1_Machine set mnama = '{FixQuotes_dataUtama_1}', mtipe = {dataUtama_2}, mumur = {dataUtama_3}, msatuan = '{FixQuotes_dataUtama_4}', mtglperolehan = '{FixQuotes_AsFormatTanggal_dataUtama_5}', mnilaiperolehan = '{FixDouble_dataUtama_6}', mnilairesidu = '{FixDouble_dataUtama_7}', makumulasipemakaian = {dataUtama_8}, mnilaisisamesin = '{FixDouble_dataUtama_9}', mbiayaperpemakaian = '{FixDouble_dataUtama_10}', makunaktiva = '{FixQuotes_dataUtama_11}', makundepresiasi = '{FixQuotes_dataUtama_12}', makunakumpenyusutan = '{FixQuotes_dataUtama_13}', mcatatan = '{FixQuotes_dataUtama_14}', maktif = {dataUtama_15}, mmodifikasiuser = '{FixQuotes_dataUtama_18}', mmodifikasitgl = NOW(), maktivitasproduksi = '{FixQuotes_dataUtama_20}' where mkode = '{dataUtama_0}'
```

```sql
Insert into M1_Machine (mkode, mnama, mtipe, mumur, msatuan, mtglperolehan, mnilaiperolehan, mnilairesidu, makumulasipemakaian, mnilaisisamesin, mbiayaperpemakaian, makunaktiva, makundepresiasi, makunakumpenyusutan, mcatatan, maktif, minputuser, minputtgl, mmodifikasiuser, mmodifikasitgl, maktivitasproduksi) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', {dataUtama_2}, {dataUtama_3}, '{FixQuotes_dataUtama_4}', '{FixQuotes_AsFormatTanggal_dataUtama_5}', '{FixDouble_dataUtama_6}', '{FixDouble_dataUtama_7}', {dataUtama_8}, '{FixDouble_dataUtama_9}', '{FixDouble_dataUtama_10}', '{FixQuotes_dataUtama_11}', '{FixQuotes_dataUtama_12}', '{FixQuotes_dataUtama_13}', '{FixQuotes_dataUtama_14}', {dataUtama_15}, '{FixQuotes_dataUtama_16}', NOW(), '0', '1971-01-01 00:00:00', '{FixQuotes_dataUtama_20}')
```

```sql
DELETE FROM M1_Machine WHERE mkode = '{idtransaksi}'
```

```sql
SELECT m.*, c1.cnama AS makunaktivanama, c2.cnama AS makundepresiasinama, c3.cnama AS makunakumpenyusutannama, u.unama AS msatuannama, pa.pakode, pa.panama FROM m1_machine m LEFT JOIN m1_coa c1 ON (m.makunaktiva = c1.cnomor) LEFT JOIN m1_coa c2 ON (m.makundepresiasi = c2.cnomor) LEFT JOIN m1_coa c3 ON (m.makunakumpenyusutan = c3.cnomor) LEFT JOIN m1_unit u ON (m.msatuan = u.ukode) LEFT JOIN m1_production_activity pa ON m.maktivitasproduksi = pa.paid
```

```sql
SELECT COUNT(mkode) FROM m1_machine WHERE mkode='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_machine_history.vb`

```sql
INSERT INTO m1_machine_history(SELECT 0, m.* FROM m1_machine m WHERE m.mkode = '{idtransaksi}')
```

```sql
SELECT m.*, c1.cnama AS makunaktivanama, c2.cnama AS makundepresiasinama, c3.cnama AS makunakumpenyusutannama, u.unama AS msatuannama, pa.pakode, pa.panama FROM m1_machine_history m LEFT JOIN m1_coa c1 ON (m.makunaktiva = c1.cnomor) LEFT JOIN m1_coa c2 ON (m.makundepresiasi = c2.cnomor) LEFT JOIN m1_coa c3 ON (m.makunakumpenyusutan = c3.cnomor) LEFT JOIN m1_unit u ON (m.msatuan = u.ukode) LEFT JOIN m1_production_activity pa ON m.maktivitasproduksi = pa.paid
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_material.vb`

```sql
Insert into M1_Material(mkode, mnama, mcatatan, maktif, minputuser, minputtgl, mmodifikasiuser, mmodifikasitgl, mcustomtext1, mcustomtext2, mcustomtext3, mcustomtext4, mcustomtext5, mcustomint1, mcustomint2, mcustomint3, mcustomdbl1, mcustomdbl2, mcustomdbl3, mcustomdate1, mcustomdate2, mcustomdate3, mindexbarcode) values{strValue2_ToString} ON DUPLICATE KEY UPDATE mnama = VALUES(mnama), mcatatan = VALUES(mcatatan), maktif = VALUES(maktif), mmodifikasiuser = VALUES(mmodifikasiuser), mmodifikasitgl = NOW(), mcustomtext1 = VALUES(mcustomtext1), mcustomtext2 = VALUES(mcustomtext2), mcustomtext3 = VALUES(mcustomtext3), mcustomtext4 = VALUES(mcustomtext4), mcustomtext5 = VALUES(mcustomtext5), mcustomint1 = VALUES(mcustomint1), mcustomint2 = VALUES(mcustomint2), mcustomint3 = VALUES(mcustomint3), mcustomdbl1 = VALUES(mcustomdbl1), mcustomdbl2 = VALUES(mcustomdbl2), mcustomdbl3 = VALUES(mcustomdbl3), mcustomdate1 = VALUES(mcustomdate1), mcustomdate2 = VALUES(mcustomdate2), mcustomdate3 = VALUES(mcustomdate3), mindexbarcode = VALUES(mindexbarcode)
```

```sql
DELETE FROM M1_Material WHERE mkode = '{idtransaksi}'
```

```sql
select `m`.`mkode` AS `mkode`,`m`.`mnama` AS `mnama`,`m`.`mcatatan` AS `mcatatan`,`m`.`maktif` AS `maktif`,`m`.`minputuser` AS `minputuser`,`m`.`minputtgl` AS `minputtgl`,`m`.`mmodifikasiuser` AS `mmodifikasiuser`,`m`.`mmodifikasitgl` AS `mmodifikasitgl`,`m`.`mcustomtext1` AS `mcustomtext1`,`m`.`mcustomtext2` AS `mcustomtext2`,`m`.`mcustomtext3` AS `mcustomtext3`,`m`.`mcustomtext4` AS `mcustomtext4`,`m`.`mcustomtext5` AS `mcustomtext5`,`m`.`mcustomint1` AS `mcustomint1`,`m`.`mcustomint2` AS `mcustomint2`,`m`.`mcustomint3` AS `mcustomint3`,`m`.`mcustomdbl1` AS `mcustomdbl1`,`m`.`mcustomdbl2` AS `mcustomdbl2`,`m`.`mcustomdbl3` AS `mcustomdbl3`,`m`.`mcustomdate1` AS `mcustomdate1`,`m`.`mcustomdate2` AS `mcustomdate2`,`m`.`mcustomdate3` AS `mcustomdate3`,`m`.`mindexbarcode` AS `mindexbarcode`,`u1`.`unama` AS `minputusernama`,`u2`.`unama` AS `mmodifikasiusernama` from ((`M1_Material` `m` left join `m0_user` `u1` on((`m`.`minputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`m`.`mmodifikasiuser` = `u2`.`userid`)))
```

```sql
SELECT COUNT(mkode) FROM M1_Material WHERE mkode='{idtransaksi}'
```

```sql
select m.mkode AS mkode, m.mnama AS mnama, s.skode AS sumber, CONCAT('Setting : ', s.smodule, ' - ', s.sgrup, ' - ', s.skode) AS idterkait from m0_setting s join m1_class_product m on (s.smodule = 0 AND s.sgrup = 'options' AND s.skode = 'KelasProduk' AND s.snilai = m.mkode) WHERE m.mkode = 'valkode' union all SELECT m.mkode as mkode, m.mnama as mnama, 'Item' as sumber, i.bkode as idterkait FROM m1_item i JOIN m1_class_product m ON i.bkelasproduk = m.mkode AND m.mkode = 'valkode' GROUP BY m.mkode, i.bid UNION ALL SELECT m.mkode as mkode, m.mnama as mnama, 'POS Type' as sumber, ptm.tipepos as idterkait FROM m_12_pos_type_class_product ptm JOIN m1_class_product m ON ptm.kelasproduk = m.mkode AND m.mkode = 'valkode' GROUP BY m.mkode, ptm.tipepos
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_material_history.vb`

```sql
INSERT INTO M1_Material_history(SELECT 0, class_product.* FROM M1_Material class_product WHERE class_product.mkode = '{idtransaksi}')
```

```sql
select `m`.`midhistory` AS `midhistory`,`m`.`mkode` AS `mkode`,`m`.`mnama` AS `mnama`,`m`.`mcatatan` AS `mcatatan`,`m`.`maktif` AS `maktif`,`m`.`minputuser` AS `minputuser`,`m`.`minputtgl` AS `minputtgl`,`m`.`mmodifikasiuser` AS `mmodifikasiuser`,`m`.`mmodifikasitgl` AS `mmodifikasitgl`,`m`.`mcustomtext1` AS `mcustomtext1`,`m`.`mcustomtext2` AS `mcustomtext2`,`m`.`mcustomtext3` AS `mcustomtext3`,`m`.`mcustomtext4` AS `mcustomtext4`,`m`.`mcustomtext5` AS `mcustomtext5`,`m`.`mcustomint1` AS `mcustomint1`,`m`.`mcustomint2` AS `mcustomint2`,`m`.`mcustomint3` AS `mcustomint3`,`m`.`mcustomdbl1` AS `mcustomdbl1`,`m`.`mcustomdbl2` AS `mcustomdbl2`,`m`.`mcustomdbl3` AS `mcustomdbl3`,`m`.`mcustomdate1` AS `mcustomdate1`,`m`.`mcustomdate2` AS `mcustomdate2`,`m`.`mcustomdate3` AS `mcustomdate3`,`u1`.`unama` AS `minputusernama`,`u2`.`unama` AS `mmodifikasiusernama` from ((`M1_Material_history` `m` left join `m0_user` `u1` on((`m`.`minputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`m`.`mmodifikasiuser` = `u2`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_merk.vb`

```sql
Insert into M1_Merk(mkode, mnama, mcatatan, maktif, minputuser, minputtgl, mmodifikasiuser, mmodifikasitgl, mcustomtext1, mcustomtext2, mcustomtext3, mcustomtext4, mcustomtext5, mcustomint1, mcustomint2, mcustomint3, mcustomdbl1, mcustomdbl2, mcustomdbl3, mcustomdate1, mcustomdate2, mcustomdate3, mindexbarcode) values{strValue2_ToString} ON DUPLICATE KEY UPDATE mnama = VALUES(mnama), mcatatan = VALUES(mcatatan), maktif = VALUES(maktif), mmodifikasiuser = VALUES(mmodifikasiuser), mmodifikasitgl = NOW(), mcustomtext1 = VALUES(mcustomtext1), mcustomtext2 = VALUES(mcustomtext2), mcustomtext3 = VALUES(mcustomtext3), mcustomtext4 = VALUES(mcustomtext4), mcustomtext5 = VALUES(mcustomtext5), mcustomint1 = VALUES(mcustomint1), mcustomint2 = VALUES(mcustomint2), mcustomint3 = VALUES(mcustomint3), mcustomdbl1 = VALUES(mcustomdbl1), mcustomdbl2 = VALUES(mcustomdbl2), mcustomdbl3 = VALUES(mcustomdbl3), mcustomdate1 = VALUES(mcustomdate1), mcustomdate2 = VALUES(mcustomdate2), mcustomdate3 = VALUES(mcustomdate3), mindexbarcode = VALUES(mindexbarcode)
```

```sql
DELETE FROM M1_Merk WHERE mkode = '{idtransaksi}'
```

```sql
select `m`.`mkode` AS `mkode`,`m`.`mnama` AS `mnama`,`m`.`mcatatan` AS `mcatatan`,`m`.`maktif` AS `maktif`,`m`.`minputuser` AS `minputuser`,`m`.`minputtgl` AS `minputtgl`,`m`.`mmodifikasiuser` AS `mmodifikasiuser`,`m`.`mmodifikasitgl` AS `mmodifikasitgl`,`m`.`mcustomtext1` AS `mcustomtext1`,`m`.`mcustomtext2` AS `mcustomtext2`,`m`.`mcustomtext3` AS `mcustomtext3`,`m`.`mcustomtext4` AS `mcustomtext4`,`m`.`mcustomtext5` AS `mcustomtext5`,`m`.`mcustomint1` AS `mcustomint1`,`m`.`mcustomint2` AS `mcustomint2`,`m`.`mcustomint3` AS `mcustomint3`,`m`.`mcustomdbl1` AS `mcustomdbl1`,`m`.`mcustomdbl2` AS `mcustomdbl2`,`m`.`mcustomdbl3` AS `mcustomdbl3`,`m`.`mcustomdate1` AS `mcustomdate1`,`m`.`mcustomdate2` AS `mcustomdate2`,`m`.`mcustomdate3` AS `mcustomdate3`,`u1`.`unama` AS `minputusernama`,`u2`.`unama` AS `mmodifikasiusernama`,`m`.`mindexbarcode` AS `mindexbarcode` from ((`M1_Merk` `m` left join `m0_user` `u1` on((`m`.`minputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`m`.`mmodifikasiuser` = `u2`.`userid`)))
```

```sql
SELECT COUNT(mkode) FROM M1_Merk WHERE mkode='{idtransaksi}'
```

```sql
select m.mkode AS mkode, m.mnama AS mnama, s.skode AS sumber, CONCAT('Setting : ', s.smodule, ' - ', s.sgrup, ' - ', s.skode) AS idterkait from m0_setting s join m1_merk m on (s.smodule = 0 AND s.sgrup = 'options' AND s.skode = 'KelasProduk' AND s.snilai = m.mkode) WHERE m.mkode = 'valkode' union all SELECT m.mkode AS mkode, m.mnama AS mnama, 'Item' as sumber, i.bkode as idterkait FROM m1_item i JOIN m1_merk m ON i.bkelasproduk = m.mkode AND m.mkode = 'valkode' GROUP BY m.mkode, i.bid UNION ALL SELECT m.mkode AS mkode, m.mnama AS mnama, 'POS Type' as sumber, ptc.tipepos as idterkait FROM m_12_pos_type_merk ptc JOIN m1_merk m ON ptc.kelasproduk = m.mkode AND m.mkode = 'valkode' GROUP BY m.mkode, ptc.tipepos
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_merk_history.vb`

```sql
INSERT INTO M1_Merk_history(SELECT 0, merk.* FROM M1_Merk merk WHERE merk.mkode = '{idtransaksi}')
```

```sql
select `m`.`midhistory` AS `midhistory`,`m`.`mkode` AS `mkode`,`m`.`mnama` AS `mnama`,`m`.`mcatatan` AS `mcatatan`,`m`.`maktif` AS `maktif`,`m`.`minputuser` AS `minputuser`,`m`.`minputtgl` AS `minputtgl`,`m`.`mmodifikasiuser` AS `mmodifikasiuser`,`m`.`mmodifikasitgl` AS `mmodifikasitgl`,`m`.`mcustomtext1` AS `mcustomtext1`,`m`.`mcustomtext2` AS `mcustomtext2`,`m`.`mcustomtext3` AS `mcustomtext3`,`m`.`mcustomtext4` AS `mcustomtext4`,`m`.`mcustomtext5` AS `mcustomtext5`,`m`.`mcustomint1` AS `mcustomint1`,`m`.`mcustomint2` AS `mcustomint2`,`m`.`mcustomint3` AS `mcustomint3`,`m`.`mcustomdbl1` AS `mcustomdbl1`,`m`.`mcustomdbl2` AS `mcustomdbl2`,`m`.`mcustomdbl3` AS `mcustomdbl3`,`m`.`mcustomdate1` AS `mcustomdate1`,`m`.`mcustomdate2` AS `mcustomdate2`,`m`.`mcustomdate3` AS `mcustomdate3`,`u1`.`unama` AS `minputusernama`,`u2`.`unama` AS `mmodifikasiusernama`,`m`.`mindexbarcode` AS `mindexbarcode` from ((`M1_Merk_history` `m` left join `m0_user` `u1` on((`m`.`minputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`m`.`mmodifikasiuser` = `u2`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_model.vb`

```sql
Insert into M1_Model(mkode, mnama, mcatatan, maktif, minputuser, minputtgl, mmodifikasiuser, mmodifikasitgl, mcustomtext1, mcustomtext2, mcustomtext3, mcustomtext4, mcustomtext5, mcustomint1, mcustomint2, mcustomint3, mcustomdbl1, mcustomdbl2, mcustomdbl3, mcustomdate1, mcustomdate2, mcustomdate3, mindexbarcode) values{strValue2_ToString} ON DUPLICATE KEY UPDATE mnama = VALUES(mnama), mcatatan = VALUES(mcatatan), maktif = VALUES(maktif), mmodifikasiuser = VALUES(mmodifikasiuser), mmodifikasitgl = NOW(), mcustomtext1 = VALUES(mcustomtext1), mcustomtext2 = VALUES(mcustomtext2), mcustomtext3 = VALUES(mcustomtext3), mcustomtext4 = VALUES(mcustomtext4), mcustomtext5 = VALUES(mcustomtext5), mcustomint1 = VALUES(mcustomint1), mcustomint2 = VALUES(mcustomint2), mcustomint3 = VALUES(mcustomint3), mcustomdbl1 = VALUES(mcustomdbl1), mcustomdbl2 = VALUES(mcustomdbl2), mcustomdbl3 = VALUES(mcustomdbl3), mcustomdate1 = VALUES(mcustomdate1), mcustomdate2 = VALUES(mcustomdate2), mcustomdate3 = VALUES(mcustomdate3), mindexbarcode = VALUES(mindexbarcode)
```

```sql
DELETE FROM M1_Model WHERE mkode = '{idtransaksi}'
```

```sql
select `m`.`mkode` AS `mkode`,`m`.`mnama` AS `mnama`,`m`.`mcatatan` AS `mcatatan`,`m`.`maktif` AS `maktif`,`m`.`minputuser` AS `minputuser`,`m`.`minputtgl` AS `minputtgl`,`m`.`mmodifikasiuser` AS `mmodifikasiuser`,`m`.`mmodifikasitgl` AS `mmodifikasitgl`,`m`.`mcustomtext1` AS `mcustomtext1`,`m`.`mcustomtext2` AS `mcustomtext2`,`m`.`mcustomtext3` AS `mcustomtext3`,`m`.`mcustomtext4` AS `mcustomtext4`,`m`.`mcustomtext5` AS `mcustomtext5`,`m`.`mcustomint1` AS `mcustomint1`,`m`.`mcustomint2` AS `mcustomint2`,`m`.`mcustomint3` AS `mcustomint3`,`m`.`mcustomdbl1` AS `mcustomdbl1`,`m`.`mcustomdbl2` AS `mcustomdbl2`,`m`.`mcustomdbl3` AS `mcustomdbl3`,`m`.`mcustomdate1` AS `mcustomdate1`,`m`.`mcustomdate2` AS `mcustomdate2`,`m`.`mcustomdate3` AS `mcustomdate3`,`m`.`mindexbarcode` AS `mindexbarcode`,`u1`.`unama` AS `minputusernama`,`u2`.`unama` AS `mmodifikasiusernama` from ((`M1_Model` `m` left join `m0_user` `u1` on((`m`.`minputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`m`.`mmodifikasiuser` = `u2`.`userid`)))
```

```sql
SELECT COUNT(mkode) FROM M1_Model WHERE mkode='{idtransaksi}'
```

```sql
select m.mkode AS mkode, m.mnama AS mnama, s.skode AS sumber, CONCAT('Setting : ', s.smodule, ' - ', s.sgrup, ' - ', s.skode) AS idterkait from m0_setting s join m1_class_product m on (s.smodule = 0 AND s.sgrup = 'options' AND s.skode = 'KelasProduk' AND s.snilai = m.mkode) WHERE m.mkode = 'valkode' union all SELECT m.mkode as mkode, m.mnama as mnama, 'Item' as sumber, i.bkode as idterkait FROM m1_item i JOIN m1_class_product m ON i.bkelasproduk = m.mkode AND m.mkode = 'valkode' GROUP BY m.mkode, i.bid UNION ALL SELECT m.mkode as mkode, m.mnama as mnama, 'POS Type' as sumber, ptm.tipepos as idterkait FROM m_12_pos_type_class_product ptm JOIN m1_class_product m ON ptm.kelasproduk = m.mkode AND m.mkode = 'valkode' GROUP BY m.mkode, ptm.tipepos
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_model_history.vb`

```sql
INSERT INTO M1_Model_history(SELECT 0, class_product.* FROM M1_Model class_product WHERE class_product.mkode = '{idtransaksi}')
```

```sql
select `m`.`midhistory` AS `midhistory`,`m`.`mkode` AS `mkode`,`m`.`mnama` AS `mnama`,`m`.`mcatatan` AS `mcatatan`,`m`.`maktif` AS `maktif`,`m`.`minputuser` AS `minputuser`,`m`.`minputtgl` AS `minputtgl`,`m`.`mmodifikasiuser` AS `mmodifikasiuser`,`m`.`mmodifikasitgl` AS `mmodifikasitgl`,`m`.`mcustomtext1` AS `mcustomtext1`,`m`.`mcustomtext2` AS `mcustomtext2`,`m`.`mcustomtext3` AS `mcustomtext3`,`m`.`mcustomtext4` AS `mcustomtext4`,`m`.`mcustomtext5` AS `mcustomtext5`,`m`.`mcustomint1` AS `mcustomint1`,`m`.`mcustomint2` AS `mcustomint2`,`m`.`mcustomint3` AS `mcustomint3`,`m`.`mcustomdbl1` AS `mcustomdbl1`,`m`.`mcustomdbl2` AS `mcustomdbl2`,`m`.`mcustomdbl3` AS `mcustomdbl3`,`m`.`mcustomdate1` AS `mcustomdate1`,`m`.`mcustomdate2` AS `mcustomdate2`,`m`.`mcustomdate3` AS `mcustomdate3`,`u1`.`unama` AS `minputusernama`,`u2`.`unama` AS `mmodifikasiusernama` from ((`M1_Model_history` `m` left join `m0_user` `u1` on((`m`.`minputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`m`.`mmodifikasiuser` = `u2`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_notes.vb`

```sql
SELECT COUNT(nid) FROM M1_Notes WHERE nid='{result_4}'
```

```sql
Update M1_Notes set nsumber = '{FixQuotes_dataUtama_1}', nidtransaksi = '{FixQuotes_dataUtama_2}', nidtransaksi2 = '{FixQuotes_dataUtama_3}', ncatatan = '{FixQuotes_dataUtama_4}', nmodifikasiuser = {dataUtama_7}, nmodifikasitgl = NOW() where nid = '{result_4}'
```

```sql
Insert into M1_Notes (nsumber, nidtransaksi, nidtransaksi2, ncatatan, ninputuser, ninputtgl, nmodifikasiuser, nmodifikasitgl) values('{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', '{FixQuotes_dataUtama_4}', {dataUtama_5}, NOW(), {dataUtama_7}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Notes WHERE nid = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_oem.vb`

```sql
Insert into M1_Oem(okode, onama, ocatatan, oaktif, oinputuser, oinputtgl, omodifikasiuser, omodifikasitgl, ocustomtext1, ocustomtext2, ocustomtext3, ocustomtext4, ocustomtext5, ocustomint1, ocustomint2, ocustomint3, ocustomdbl1, ocustomdbl2, ocustomdbl3, ocustomdate1, ocustomdate2, ocustomdate3, oindexbarcode) values{strValue2_ToString} ON DUPLICATE KEY UPDATE onama = VALUES(onama), ocatatan = VALUES(ocatatan), oaktif = VALUES(oaktif), omodifikasiuser = VALUES(omodifikasiuser), omodifikasitgl = NOW(), ocustomtext1 = VALUES(ocustomtext1), ocustomtext2 = VALUES(ocustomtext2), ocustomtext3 = VALUES(ocustomtext3), ocustomtext4 = VALUES(ocustomtext4), ocustomtext5 = VALUES(ocustomtext5), ocustomint1 = VALUES(ocustomint1), ocustomint2 = VALUES(ocustomint2), ocustomint3 = VALUES(ocustomint3), ocustomdbl1 = VALUES(ocustomdbl1), ocustomdbl2 = VALUES(ocustomdbl2), ocustomdbl3 = VALUES(ocustomdbl3), ocustomdate1 = VALUES(ocustomdate1), ocustomdate2 = VALUES(ocustomdate2), ocustomdate3 = VALUES(ocustomdate3), oindexbarcode = VALUES(oindexbarcode)
```

```sql
DELETE FROM M1_Oem WHERE okode = '{idtransaksi}'
```

```sql
select `o`.`okode` AS `okode`,`o`.`onama` AS `onama`,`o`.`ocatatan` AS `ocatatan`,`o`.`oaktif` AS `oaktif`,`o`.`oinputuser` AS `oinputuser`,`o`.`oinputtgl` AS `oinputtgl`,`o`.`omodifikasiuser` AS `omodifikasiuser`,`o`.`omodifikasitgl` AS `omodifikasitgl`,`o`.`ocustomtext1` AS `ocustomtext1`,`o`.`ocustomtext2` AS `ocustomtext2`,`o`.`ocustomtext3` AS `ocustomtext3`,`o`.`ocustomtext4` AS `ocustomtext4`,`o`.`ocustomtext5` AS `ocustomtext5`,`o`.`ocustomint1` AS `ocustomint1`,`o`.`ocustomint2` AS `ocustomint2`,`o`.`ocustomint3` AS `ocustomint3`,`o`.`ocustomdbl1` AS `ocustomdbl1`,`o`.`ocustomdbl2` AS `ocustomdbl2`,`o`.`ocustomdbl3` AS `ocustomdbl3`,`o`.`ocustomdate1` AS `ocustomdate1`,`o`.`ocustomdate2` AS `ocustomdate2`,`o`.`ocustomdate3` AS `ocustomdate3`,`u1`.`unama` AS `oinputusernama`,`u2`.`unama` AS `omodifikasiusernama`,`o`.`oindexbarcode` AS `oindexbarcode` from ((`M1_Oem` `o` left join `m0_user` `u1` on((`o`.`oinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`o`.`omodifikasiuser` = `u2`.`userid`)))
```

```sql
SELECT COUNT(okode) FROM M1_Oem WHERE okode='{idtransaksi}'
```

```sql
select o.okode AS okode, o.onama AS onama, s.skode AS sumber, CONCAT('Setting : ', s.smodule, ' - ', s.sgrup, ' - ', s.skode) AS idterkait from m0_setting s join m1_oem o on (s.smodule = 0 AND s.sgrup = 'options' AND s.skode = 'KelasProduk' AND s.snilai = o.okode) WHERE o.okode = 'valkode' union all SELECT o.okode as okode, o.onama as onama, 'Item' as sumber, i.bkode as idterkait FROM m1_item i JOIN m1_oem o ON i.bkelasproduk = o.okode AND o.okode = 'valkode' GROUP BY o.okode, i.bid UNION ALL SELECT o.okode as okode, o.onama as onama, 'POS Type' as sumber, ptc.tipepos as idterkait FROM m_12_pos_type_oem ptc JOIN m1_oem o ON ptc.kelasproduk = o.okode AND o.okode = 'valkode' GROUP BY o.okode, ptc.tipepos
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_oem_history.vb`

```sql
INSERT INTO M1_Oem_history(SELECT 0, oem.* FROM M1_Oem oem WHERE oem.okode = '{idtransaksi}')
```

```sql
select `o`.`oidhistory` AS `oidhistory`,`o`.`okode` AS `okode`,`o`.`onama` AS `onama`,`o`.`ocatatan` AS `ocatatan`,`o`.`oaktif` AS `oaktif`,`o`.`oinputuser` AS `oinputuser`,`o`.`oinputtgl` AS `oinputtgl`,`o`.`omodifikasiuser` AS `omodifikasiuser`,`o`.`omodifikasitgl` AS `omodifikasitgl`,`o`.`ocustomtext1` AS `ocustomtext1`,`o`.`ocustomtext2` AS `ocustomtext2`,`o`.`ocustomtext3` AS `ocustomtext3`,`o`.`ocustomtext4` AS `ocustomtext4`,`o`.`ocustomtext5` AS `ocustomtext5`,`o`.`ocustomint1` AS `ocustomint1`,`o`.`ocustomint2` AS `ocustomint2`,`o`.`ocustomint3` AS `ocustomint3`,`o`.`ocustomdbl1` AS `ocustomdbl1`,`o`.`ocustomdbl2` AS `ocustomdbl2`,`o`.`ocustomdbl3` AS `ocustomdbl3`,`o`.`ocustomdate1` AS `ocustomdate1`,`o`.`ocustomdate2` AS `ocustomdate2`,`o`.`ocustomdate3` AS `ocustomdate3`,`u1`.`unama` AS `oinputusernama`,`u2`.`unama` AS `omodifikasiusernama`,`o`.`oindexbarcode` AS `oindexbarcode` from ((`M1_Oem_history` `o` left join `m0_user` `u1` on((`o`.`oinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`o`.`omodifikasiuser` = `u2`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_other.vb`

```sql
SELECT COUNT(ojenis) FROM M1_Other WHERE ojenis ='{dataUtama_0}' AND okode='{dataUtama_1}'
```

```sql
Update M1_Other set onama = '{FixQuotes_dataUtama_2}', ocatatan = '{FixQuotes_dataUtama_3}', oaktif = {dataUtama_4}, omodifikasiuser = {dataUtama_7}, omodifikasitgl = NOW() WHERE ojenis ='{dataUtama_0}' AND okode ='{dataUtama_1}'
```

```sql
Insert into M1_Other (ojenis, okode, onama, ocatatan, oaktif, oinputuser, oinputtgl, omodifikasiuser, omodifikasitgl) values({dataUtama_0}, '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', {dataUtama_4}, {dataUtama_5}, NOW(), {dataUtama_7}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Other WHERE ojenis = '{jenis}' AND okode='{kode}'
```

```sql
select `o`.`ojenis` AS `ojenis`,(case `o`.`ojenis` when 0 then 'Application' when 1 then 'Group' when 2 then 'Class' when 3 then 'Location' when 4 then 'Brand' when 5 then 'Status' when 6 then 'Type' when 7 then 'Vehicle' when 8 then 'Shipping Method' when 9 then 'Model' when 10 then 'Transportation' when 11 then 'Size' when 12 then 'Colour' end) AS `ojenisnama`,`o`.`okode` AS `okode`,`o`.`onama` AS `onama`,`o`.`ocatatan` AS `ocatatan`,`o`.`oaktif` AS `oaktif`,`o`.`oinputuser` AS `oinputuser`,`o`.`oinputtgl` AS `oinputtgl`,`o`.`omodifikasiuser` AS `omodifikasiuser`,`o`.`omodifikasitgl` AS `omodifikasitgl` from `m1_other` `o`
```

```sql
SELECT COUNT(okode) FROM m1_other WHERE ojenis='{jenis}' AND okode='{kode}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_other_cost.vb`

```sql
SELECT COUNT(ockode) FROM M1_Other_Cost WHERE ockode ='{dataUtama_0}'
```

```sql
Update M1_Other_Cost set ocnama = '{FixQuotes_dataUtama_1}', ocrekdebit = '{FixQuotes_dataUtama_2}', ocrekkredit = '{FixQuotes_dataUtama_3}', ocmodifikasiuser = {dataUtama_6}, ocmodifikasitgl = NOW() where ockode = '{dataUtama_0}'
```

```sql
Insert into M1_Other_Cost (ockode, ocnama, ocrekdebit, ocrekkredit, ocinputuser, ocinputtgl, ocmodifikasiuser, ocmodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00')
```

```sql
Insert into M1_Other_Cost(ockode, ocnama, ocrekdebit, ocrekkredit, octermasukhpp, occatatan, ocinputuser, ocinputtgl, ocmodifikasiuser, ocmodifikasitgl, occustomtext1, occustomtext2, occustomtext3, occustomtext4, occustomtext5, occustomint1, occustomint2, occustomint3, occustomdbl1, occustomdbl2, occustomdbl3, occustomdate1, occustomdate2, occustomdate3, ockontak) values {strValue2_ToString} ON DUPLICATE KEY UPDATE ocnama = VALUES(ocnama), ocrekdebit = VALUES(ocrekdebit), ocrekkredit = VALUES(ocrekkredit), octermasukhpp = VALUES(octermasukhpp), occatatan = VALUES(occatatan), ocinputuser = VALUES(ocinputuser), ocinputtgl = VALUES(ocinputtgl), ocmodifikasiuser = VALUES(ocmodifikasiuser), ocmodifikasitgl = VALUES(ocmodifikasitgl), occustomtext1 = VALUES(occustomtext1), occustomtext2 = VALUES(occustomtext2), occustomtext3 = VALUES(occustomtext3), occustomtext4 = VALUES(occustomtext4), occustomtext5 = VALUES(occustomtext5), occustomint1 = VALUES(occustomint1), occustomint2 = VALUES(occustomint2), occustomint3 = VALUES(occustomint3), occustomdbl1 = VALUES(occustomdbl1), occustomdbl2 = VALUES(occustomdbl2), occustomdbl3 = VALUES(occustomdbl3), occustomdate1 = VALUES(occustomdate1), occustomdate2 = VALUES(occustomdate2), occustomdate3 = VALUES(occustomdate3), ockontak = VALUES(ockontak)
```

```sql
DELETE FROM M1_Other_Cost WHERE ockode = '{idtransaksi}'
```

```sql
SELECT oc.ockode, oc.ocnama, oc.ocrekdebit, oc.ocrekkredit, oc.octermasukhpp, oc.occatatan, oc.ocinputuser, oc.ocinputtgl, oc.ocmodifikasiuser, oc.ocmodifikasitgl, oc.occustomtext1, oc.occustomtext2, oc.occustomtext3, oc.occustomtext4, oc.occustomtext5, oc.occustomint1, oc.occustomint2, oc.occustomint3, oc.occustomdbl1, oc.occustomdbl2, oc.occustomdbl3, oc.occustomdate1, oc.occustomdate2, oc.occustomdate3, coa1.cnama as ocrekdebitnama, coa2.cnama as ocrekkreditnama, u1.unama as ocinputusernama, u2.unama as ocmodifikasiusernama, oc.ockontak, c.kkode as ockontakkode, c.knama as ockontaknama FROM m1_other_cost oc LEFT JOIN m1_coa coa1 ON oc.ocrekdebit = coa1.cnomor LEFT JOIN m1_coa coa2 ON oc.ocrekkredit = coa2.cnomor LEFT JOIN m0_user u1 ON oc.ocinputuser = u1.userid LEFT JOIN m0_user u2 ON oc.ocmodifikasiuser = u2.userid LEFT JOIN m1_contact c on oc.ockontak = c.kid
```

```sql
SELECT COUNT(ockode) FROM m1_other_cost WHERE ockode='{idtransaksi}'
```

```sql
SELECT oc.ockode as ockode, oc.ocnama as ocnama, 'PO' as sumber, po.ponotransaksi as idterkait FROM m4_po_cost poc JOIN m4_po po ON poc.idpo = po.poid JOIN m1_other_cost oc ON poc.kodecost = oc.ockode WHERE oc.ockode = 'valkode' GROUP BY oc.ockode, po.poid UNION ALL SELECT oc.ockode as ockode, oc.ocnama as ocnama, 'GRN' as sumber, grn.grnnotransaksi as idterkait FROM m4_grn_cost grnc JOIN m4_grn grn ON grnc.idgrn = grn.grnid JOIN m1_other_cost oc ON grnc.kodecost = oc.ockode WHERE oc.ockode = 'valkode' GROUP BY oc.ockode, grn.grnid UNION ALL SELECT oc.ockode as ockode, oc.ocnama as ocnama, 'RI' as sumber, ri.rinotransaksi as idterkait FROM m4_ri_cost ric JOIN m4_ri ri ON ric.idri = ri.riid JOIN m1_other_cost oc ON ric.kodecost = oc.ockode WHERE oc.ockode = 'valkode' GROUP BY oc.ockode, ri.riid
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_other_cost_history.vb`

```sql
INSERT INTO m1_other_cost_history(SELECT 0, oc.* FROM m1_other_cost oc WHERE oc.ockode = '{idtransaksi}')
```

```sql
SELECT oc.ocidhistory, oc.ockode, oc.ocnama, oc.ocrekdebit, oc.ocrekkredit, oc.octermasukhpp, oc.occatatan, oc.ocinputuser, oc.ocinputtgl, oc.ocmodifikasiuser, oc.ocmodifikasitgl, oc.occustomtext1, oc.occustomtext2, oc.occustomtext3, oc.occustomtext4, oc.occustomtext5, oc.occustomint1, oc.occustomint2, oc.occustomint3, oc.occustomdbl1, oc.occustomdbl2, oc.occustomdbl3, oc.occustomdate1, oc.occustomdate2, oc.occustomdate3, coa1.cnama as ocrekdebitnama, coa2.cnama as ocrekkreditnama, u1.unama as ocinputusernama, u2.unama as ocmodifikasiusernama, oc.ockontak, c.kkode as ockontakkode, c.knama as ockontaknama FROM m1_other_cost_history oc LEFT JOIN m1_coa coa1 ON oc.ocrekdebit = coa1.cnomor LEFT JOIN m1_coa coa2 ON oc.ocrekkredit = coa2.cnomor LEFT JOIN m0_user u1 ON oc.ocinputuser = u1.userid LEFT JOIN m0_user u2 ON oc.ocmodifikasiuser = u2.userid LEFT JOIN m1_contact c on oc.ockontak = c.kid
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_other_history.vb`

```sql
INSERT INTO m1_other_history(SELECT 0, o.* FROM m1_other o WHERE o.ojenis = '{jenis}' AND o.okode = '{idtransaksi}')
```

```sql
select `o`.`oidhistory` AS `oidhistory`,`o`.`ojenis` AS `ojenis`,(case `o`.`ojenis` when 0 then 'Application' when 1 then 'Group' when 2 then 'Class' when 3 then 'Location' when 4 then 'Brand' when 5 then 'Status' when 6 then 'Type' when 7 then 'Vehicle' when 8 then 'Shipping Method' when 9 then 'Model' when 10 then 'Transportation' when 11 then 'Size' when 12 then 'Colour' end) AS `ojenisnama`,`o`.`okode` AS `okode`,`o`.`onama` AS `onama`,`o`.`ocatatan` AS `ocatatan`,`o`.`oaktif` AS `oaktif`,`o`.`oinputuser` AS `oinputuser`,`o`.`oinputtgl` AS `oinputtgl`,`o`.`omodifikasiuser` AS `omodifikasiuser`,`o`.`omodifikasitgl` AS `omodifikasitgl`,`ui`.`unama` AS `oinputusernama`,`um`.`unama` AS `omodifikasiusernama` from ((`m1_other_history` `o` left join `m0_user` `ui` on ((`o`.`oinputuser` = `ui`.`userid`))) left join `m0_user` `um` on ((`o`.`omodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_patient.vb`

```sql
SELECT COUNT(pid), pkode FROM m1_patient WHERE pid='{result_4}'
```

```sql
SELECT COUNT(pid) FROM m1_patient WHERE pkode='{notransaksi}'
```

```sql
Update m1_patient set pkode = '{FixQuotes_drutama}pkode', pnama = '{FixQuotes_drutama}pnama', pprefix = '{FixQuotes_drutama}pprefix', ptgllahir = '{FixQuotes_AsFormatTanggal_drutama}ptgllahir', pumur = {drutama}pumur, pjeniskelamin = '{FixQuotes_drutama}pjeniskelamin', pstatusperkawinan = {drutama}pstatusperkawinan, pagama = {drutama}pagama, payah = '{FixQuotes_drutama}payah', pibu = '{FixQuotes_drutama}pibu', psuamiistri = '{FixQuotes_drutama}psuamiistri', pnotelepon = '{FixQuotes_drutama}pnotelepon', pnofax = '{FixQuotes_drutama}pnofax', pnohp = '{FixQuotes_drutama}pnohp', pemail = '{FixQuotes_drutama}pemail', palamat = '{FixQuotes_drutama}palamat', pkota = '{FixQuotes_drutama}pkota', pprovinsi = '{FixQuotes_drutama}pprovinsi', pnegara = '{FixQuotes_drutama}pnegara', pkodepos = '{FixQuotes_drutama}pkodepos', pkeluargalain = '{FixQuotes_drutama}pkeluargalain', pnoteleponlain = '{FixQuotes_drutama}pnoteleponlain', pcatatan = '{FixQuotes_drutama}pcatatan', paktif = {drutama}paktif, pmodifikasiuser = {drutama}pmodifikasiuser, pmodifikasitgl = NOW(), ptingkatjual = {drutama}ptingkatjual, pkategoripasien = '{FixQuotes_drutama}pkategoripasien', pkategoripasiennama = '{FixQuotes_drutama}pkategoripasiennama', pdesa = '{FixQuotes_drutama}pdesa', pkecamatan = '{FixQuotes_drutama}pkecamatan', pketumur = {drutama}pketumur where pid = '{drutama}pid'
```

```sql
Insert into m1_patient (pkode, pnama, pprefix, ptgllahir, pumur, pjeniskelamin, pstatusperkawinan, pagama, payah, pibu, psuamiistri, pnotelepon, pnofax, pnohp, pemail, palamat, pkota, pprovinsi, pnegara, pkodepos, pkeluargalain, pnoteleponlain, pcatatan, paktif, pinputuser, pinputtgl, pmodifikasiuser, pmodifikasitgl, ptingkatjual, pkategoripasien, pkategoripasiennama, pdesa, pkecamatan, pketumur) values('{FixQuotes_drutama}pkode', '{FixQuotes_drutama}pnama', '{FixQuotes_drutama}pprefix', '{FixQuotes_AsFormatTanggal_drutama}ptgllahir', {drutama}pumur, '{FixQuotes_drutama}pjeniskelamin', {drutama}pstatusperkawinan, {drutama}pagama, '{FixQuotes_drutama}payah', '{FixQuotes_drutama}pibu', '{FixQuotes_drutama}psuamiistri', '{FixQuotes_drutama}pnotelepon', '{FixQuotes_drutama}pnofax', '{FixQuotes_drutama}pnohp', '{FixQuotes_drutama}pemail', '{FixQuotes_drutama}palamat', '{FixQuotes_drutama}pkota', '{FixQuotes_drutama}pprovinsi', '{FixQuotes_drutama}pnegara', '{FixQuotes_drutama}pkodepos', '{FixQuotes_drutama}pkeluargalain', '{FixQuotes_drutama}pnoteleponlain', '{FixQuotes_drutama}pcatatan', {drutama}paktif, {drutama}pinputuser, NOW(), {drutama}pmodifikasiuser, '1971-01-01 00:00:00', {drutama}ptingkatjual, '{FixQuotes_drutama}pkategoripasien', '{FixQuotes_drutama}pkategoripasiennama', '{FixQuotes_drutama}pdesa', '{FixQuotes_drutama}pkecamatan', {drutama}pketumur)
```

```sql
select pid from m1_patient where pkode ='{notransaksi}' AND pinputuser= '{userid}' order by pmodifikasitgl desc limit 1
```

```sql
DELETE FROM M1_Patient WHERE pkode = '{idtransaksi}'
```

```sql
SELECT p.*, pc.pcawalannotran AS pawalankatpasien FROM m1_patient p LEFT JOIN m1_patient_category pc ON p.pkategoripasien = pc.pckode
```

```sql
SELECT p.*, pc.pcawalannotran AS pawalankatpasien, v.vnama AS pdesanama, sd.sdnama AS pkecamatannama, c1.cnama AS pkotanama, pr.pnama AS pprovinsinama, c2.cnama AS pnegaranama FROM m1_patient p LEFT JOIN m1_patient_category pc ON p.pkategoripasien = pc.pckode LEFT JOIN m1_village v ON p.pdesa = v.vkode LEFT JOIN m1_subdistrict sd ON p.pkecamatan = sd.sdkode LEFT JOIN m1_city c1 ON p.pkota = c1.ckode LEFT JOIN m1_province pr ON p.pprovinsi = pr.pkode LEFT JOIN m1_country c2 ON p.pnegara = c2.ckode
```

```sql
SELECT COUNT(pkode) FROM m1_patient WHERE pkode='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_patient_category.vb`

```sql
SELECT COUNT(pckode) FROM M1_Patient_Category WHERE pckode ='{dataUtama_0}'
```

```sql
Update M1_Patient_Category set pcnama = '{FixQuotes_dataUtama_1}', pccatatan = '{FixQuotes_dataUtama_2}', pcaktif = {dataUtama_3}, pcmodifikasiuser = {dataUtama_6}, pcmodifikasitgl = NOW(), pctingkatjual = {dataUtama_8}, pcawalannotran = '{FixQuotes_dataUtama_9}' where pckode = '{dataUtama_0}'
```

```sql
Insert into M1_Patient_Category (pckode, pcnama, pccatatan, pcaktif, pcinputuser, pcinputtgl, pcmodifikasiuser, pcmodifikasitgl, pctingkatjual, pcawalannotran) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00', {dataUtama_8}, '{FixQuotes_dataUtama_9}')
```

```sql
DELETE FROM M1_Patient_Category WHERE pckode = '{idtransaksi}'
```

```sql
SELECT pc.pckode, pc.pcnama, pc.pccatatan, pc.pcaktif, pc.pcinputuser, pc.pcinputtgl, pc.pcmodifikasiuser, pc.pcmodifikasitgl, pc.pctingkatjual, sr.nama as pctingkatjualnama, pc.pcawalannotran FROM m1_patient_category pc LEFT JOIN m0_selling_rate sr ON pc.pctingkatjual = sr.kode
```

```sql
SELECT COUNT(pckode) FROM m1_patient_category WHERE pckode='{idtransaksi}'
```

```sql
select pc.pckode AS pckode, pc.pcnama AS pcnama, s.skode AS sumber, CONCAT('Setting : ', s.smodule, ' - ', s.sgrup, ' - ', s.skode) AS idterkait from m0_setting s join m1_patient_category pc on (s.smodule = 11 AND s.sgrup = 'kategoripasien' AND s.skode = 'Umum' AND s.snilai = pc.pckode) WHERE pc.pckode = 'valkode' union all SELECT pc.pckode, pc.pcnama, 'Contact' as sumber, c.kid as idterkait FROM m1_contact c JOIN m1_patient_category pc ON c.kkategoricustomer=pc.pckode WHERE pc.pckode='valkode'
```

```sql
DELETE FROM M1_Patient_Category
```

```sql
Insert into M1_Patient_Category(pckode, pcnama, pccatatan, pctingkatjual, pcaktif, pcinputuser, pcinputtgl, pcmodifikasiuser, pcmodifikasitgl) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_price_category.vb`

```sql
Insert into M1_Price_Category(pckode, pcnama, pccatatan, pcaktif, pcinputuser, pcinputtgl, pcmodifikasiuser, pcmodifikasitgl, pccustomtext1, pccustomtext2, pccustomtext3, pccustomtext4, pccustomtext5, pccustomint1, pccustomint2, pccustomint3, pccustomdbl1, pccustomdbl2, pccustomdbl3, pccustomdate1, pccustomdate2, pccustomdate3) values{strValue2_ToString} ON DUPLICATE KEY UPDATE pcnama = VALUES(pcnama), pccatatan = VALUES(pccatatan), pcaktif = VALUES(pcaktif), pcmodifikasiuser = VALUES(pcmodifikasiuser), pcmodifikasitgl = NOW(), pccustomtext1 = VALUES(pccustomtext1), pccustomtext2 = VALUES(pccustomtext2), pccustomtext3 = VALUES(pccustomtext3), pccustomtext4 = VALUES(pccustomtext4), pccustomtext5 = VALUES(pccustomtext5), pccustomint1 = VALUES(pccustomint1), pccustomint2 = VALUES(pccustomint2), pccustomint3 = VALUES(pccustomint3), pccustomdbl1 = VALUES(pccustomdbl1), pccustomdbl2 = VALUES(pccustomdbl2), pccustomdbl3 = VALUES(pccustomdbl3), pccustomdate1 = VALUES(pccustomdate1), pccustomdate2 = VALUES(pccustomdate2), pccustomdate3 = VALUES(pccustomdate3)
```

```sql
DELETE FROM M1_Price_Category WHERE pckode = '{idtransaksi}'
```

```sql
select `pc`.`pckode` AS `pckode`,`pc`.`pcnama` AS `pcnama`,`pc`.`pccatatan` AS `pccatatan`,`pc`.`pcaktif` AS `pcaktif`,`pc`.`pcinputuser` AS `pcinputuser`,`pc`.`pcinputtgl` AS `pcinputtgl`,`pc`.`pcmodifikasiuser` AS `pcmodifikasiuser`,`pc`.`pcmodifikasitgl` AS `pcmodifikasitgl`,`pc`.`pccustomtext1` AS `pccustomtext1`,`pc`.`pccustomtext2` AS `pccustomtext2`,`pc`.`pccustomtext3` AS `pccustomtext3`,`pc`.`pccustomtext4` AS `pccustomtext4`,`pc`.`pccustomtext5` AS `pccustomtext5`,`pc`.`pccustomint1` AS `pccustomint1`,`pc`.`pccustomint2` AS `pccustomint2`,`pc`.`pccustomint3` AS `pccustomint3`,`pc`.`pccustomdbl1` AS `pccustomdbl1`,`pc`.`pccustomdbl2` AS `pccustomdbl2`,`pc`.`pccustomdbl3` AS `pccustomdbl3`,`pc`.`pccustomdate1` AS `pccustomdate1`,`pc`.`pccustomdate2` AS `pccustomdate2`,`pc`.`pccustomdate3` AS `pccustomdate3`,`u1`.`unama` AS `pcinputusernama`,`u2`.`unama` AS `pcmodifikasiusernama` from ((`M1_Price_category` `pc` left join `m0_user` `u1` on((`pc`.`pcinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`pc`.`pcmodifikasiuser` = `u2`.`userid`)))
```

```sql
SELECT COUNT(pckode) FROM M1_Price_category WHERE pckode='{idtransaksi}'
```

```sql
SELECT pc.pckode, pc.pcnama, 'Price' as sumber, a.anama as idterkait FROM M1_Price a JOIN M1_Price_category pc ON a.akategori = pc.pckode WHERE pc.pckode = 'valkode' GROUP BY pc.pckode, a.akode
```

```sql
DELETE FROM M1_Price_Category
```

```sql
Insert into M1_Price_Category(pckode, pcnama, pccatatan, pcaktif, pcinputuser, pcinputtgl, pcmodifikasiuser, pcmodifikasitgl, pccustomtext1, pccustomtext2, pccustomtext3, pccustomtext4, pccustomtext5, pccustomint1, pccustomint2, pccustomint3, pccustomdbl1, pccustomdbl2, pccustomdbl3, pccustomdate1, pccustomdate2, pccustomdate3) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_price_category_history.vb`

```sql
INSERT INTO M1_Price_category_history(SELECT 0, Price.* FROM M1_Price_category Price WHERE Price.pckode = '{idtransaksi}')
```

```sql
select `pc`.`pcidhistory` AS `pcidhistory`,`pc`.`pckode` AS `pckode`,`pc`.`pcnama` AS `pcnama`,`pc`.`pccatatan` AS `pccatatan`,`pc`.`pcaktif` AS `pcaktif`,`pc`.`pcinputuser` AS `pcinputuser`,`pc`.`pcinputtgl` AS `pcinputtgl`,`pc`.`pcmodifikasiuser` AS `pcmodifikasiuser`,`pc`.`pcmodifikasitgl` AS `pcmodifikasitgl`,`pc`.`pccustomtext1` AS `pccustomtext1`,`pc`.`pccustomtext2` AS `pccustomtext2`,`pc`.`pccustomtext3` AS `pccustomtext3`,`pc`.`pccustomtext4` AS `pccustomtext4`,`pc`.`pccustomtext5` AS `pccustomtext5`,`pc`.`pccustomint1` AS `pccustomint1`,`pc`.`pccustomint2` AS `pccustomint2`,`pc`.`pccustomint3` AS `pccustomint3`,`pc`.`pccustomdbl1` AS `pccustomdbl1`,`pc`.`pccustomdbl2` AS `pccustomdbl2`,`pc`.`pccustomdbl3` AS `pccustomdbl3`,`pc`.`pccustomdate1` AS `pccustomdate1`,`pc`.`pccustomdate2` AS `pccustomdate2`,`pc`.`pccustomdate3` AS `pccustomdate3`,`u1`.`unama` AS `pcinputusernama`,`u2`.`unama` AS `pcmodifikasiusernama` from ((`M1_Price_category_history` `pc` left join `m0_user` `u1` on((`pc`.`pcinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`pc`.`pcmodifikasiuser` = `u2`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_production_activity.vb`

```sql
Update M1_Production_Activity set pakode = '{FixQuotes_drutama}pakode', panama = '{FixQuotes_drutama}panama', pacatatan = '{FixQuotes_drutama}pacatatan', paaktif = {drutama}paaktif, pamodifikasiuser = '{FixQuotes_drutama}pamodifikasiuser', pamodifikasitgl = NOW(), pacustomtext1 = '{FixQuotes_drutama}pacustomtext1', pacustomtext2 = '{FixQuotes_drutama}pacustomtext2', pacustomtext3 = '{FixQuotes_drutama}pacustomtext3', pacustomtext4 = '{FixQuotes_drutama}pacustomtext4', pacustomtext5 = '{FixQuotes_drutama}pacustomtext5', pacustomint1 = {drutama}pacustomint1, pacustomint2 = {drutama}pacustomint2, pacustomint3 = {drutama}pacustomint3, pacustomdbl1 = '{FixDouble_drutama}pacustomdbl1', pacustomdbl2 = '{FixDouble_drutama}pacustomdbl2', pacustomdbl3 = '{FixDouble_drutama}pacustomdbl3', pacustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}pacustomdate1', pacustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}pacustomdate2', pacustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}pacustomdate3', pagudangbahan = '{FixQuotes_drutama}pagudangbahan', pagudanghasil = '{FixQuotes_drutama}pagudanghasil' where paid = {drutama}paid
```

```sql
Insert into M1_Production_Activity (pakode, panama, pacatatan, paaktif, painputuser, painputtgl, pamodifikasiuser, pamodifikasitgl, pacustomtext1, pacustomtext2, pacustomtext3, pacustomtext4, pacustomtext5, pacustomint1, pacustomint2, pacustomint3, pacustomdbl1, pacustomdbl2, pacustomdbl3, pacustomdate1, pacustomdate2, pacustomdate3, pagudangbahan, pagudanghasil) values('{FixQuotes_drutama}pakode', '{FixQuotes_drutama}panama', '{FixQuotes_drutama}pacatatan', {drutama}paaktif, '{FixQuotes_drutama}painputuser', '{FixQuotes_AsFormatTanggal_drutama}painputtglyyyy-MM-dd HH:mm:ss', '{FixQuotes_drutama}pamodifikasiuser', '{FixQuotes_AsFormatTanggal_drutama}pamodifikasitglyyyy-MM-dd HH:mm:ss', '{FixQuotes_drutama}pacustomtext1', '{FixQuotes_drutama}pacustomtext2', '{FixQuotes_drutama}pacustomtext3', '{FixQuotes_drutama}pacustomtext4', '{FixQuotes_drutama}pacustomtext5', {drutama}pacustomint1, {drutama}pacustomint2, {drutama}pacustomint3, '{FixDouble_drutama}pacustomdbl1', '{FixDouble_drutama}pacustomdbl2', '{FixDouble_drutama}pacustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}pacustomdate1', '{FixQuotes_AsFormatTanggal_drutama}pacustomdate2', '{FixQuotes_AsFormatTanggal_drutama}pacustomdate3', '{FixQuotes_drutama}pagudangbahan', '{FixQuotes_drutama}pagudanghasil')
```

```sql
select paid from m1_production_activity where pakode='{FixQuotes_drutama}pakode' AND painputuser= '{userid}' order by pamodifikasitgl desc limit 1
```

```sql
Delete from m1_production_activity_Detail where idpa = '{result_4}'
```

```sql
Insert into M1_Production_Activity_Detail(idpadetail, idpa, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, harga, hpppersen, hpp, rekpersediaan, cabang, lokasi, gudangasal, gudangproduksi, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idbom, idbomin, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
DELETE FROM M1_Production_Activity_Detail WHERE idpa = '{idtransaksi}'
```

```sql
DELETE FROM M1_Production_Activity WHERE paid = '{idtransaksi}'
```

```sql
SELECT pa.paid, pa.pakode, pa.panama, pa.pacatatan, pa.paaktif, pa.painputuser, pa.painputtgl, pa.pamodifikasiuser, pa.pamodifikasitgl, pa.pacustomtext1, pa.pacustomtext2, pa.pacustomtext3, pa.pacustomtext4, pa.pacustomtext5, pa.pacustomint1, pa.pacustomint2, pa.pacustomint3, pa.pacustomdbl1, pa.pacustomdbl2, pa.pacustomdbl3, pa.pacustomdate1, pa.pacustomdate2, pa.pacustomdate3, u1.unama as painputusernama, u2.unama as pamodifikasiusernama, pa.pagudangbahan, pa.pagudanghasil, wh1.wnama as pagudangbahannama, wh2.wnama as pagudanghasilnama FROM m1_production_activity pa LEFT JOIN m0_user u1 ON pa.painputuser = u1.userid LEFT JOIN m0_user u2 ON pa.pamodifikasiuser = u2.userid LEFT JOIN m1_warehouse wh1 ON pa.pagudangbahan = wh1.wkode LEFT JOIN m1_warehouse wh2 ON pa.pagudanghasil = wh2.wkode
```

```sql
SELECT COUNT(pakode) FROM m1_production_activity WHERE pakode='{idtransaksi}'
```

```sql
SELECT pa.paid, pa.pakode, pa.panama, pa.pacatatan, pa.paaktif, pa.painputuser, pa.painputtgl, pa.pamodifikasiuser, pa.pamodifikasitgl, pa.pacustomtext1, pa.pacustomtext2, pa.pacustomtext3, pa.pacustomtext4, pa.pacustomtext5, pa.pacustomint1, pa.pacustomint2, pa.pacustomint3, pa.pacustomdbl1, pa.pacustomdbl2, pa.pacustomdbl3, pa.pacustomdate1, pa.pacustomdate2, pa.pacustomdate3, u1.unama AS painputusernama, u2.unama AS pamodifikasiusernama, pad.idpadetail, pad.idpa, pad.idbarang, pad.namabarang, pad.tipebarang, pad.jml, pad.satuan, pad.nilaisatuan, pad.jmlbarang, pad.satuanbarang, pad.matauang, pad.kurs, pad.harga, pad.hpppersen, pad.hpp, i.brekpersediaan as rekpersediaan, pad.cabang, pad.lokasi, pad.gudangasal, pad.gudangproduksi, pad.gudangtujuan, pad.costcenter, pad.divisi, pad.subdivisi, pad.proyek, pad.catatan, pad.urutan, pad.idbom, pad.idbomin, pad.customtext1, pad.customtext2, pad.customtext3, pad.customdbl1, pad.customdbl2, pad.customdbl3, pad.customdate1, pad.customdate2, pad.customdate3, i.bkode AS kodebarang, i.bhpp, i.bjenis, i.bserial, i.bbatch, i.bjmllapangan, i.bsatuanlapangan, i.basset, pa.pagudangbahan, pa.pagudanghasil, wh1.wnama as pagudangbahannama, wh2.wnama as pagudanghasilnama FROM m1_production_activity pa JOIN m1_production_activity_detail pad ON pa.paid = pad.idpa JOIN m1_item i ON pad.idbarang = i.bid LEFT JOIN m0_user u1 ON pa.painputuser = u1.userid LEFT JOIN m0_user u2 ON pa.pamodifikasiuser = u2.userid LEFT JOIN m1_warehouse wh1 ON pa.pagudangbahan = wh1.wkode LEFT JOIN m1_warehouse wh2 ON pa.pagudanghasil = wh2.wkode
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_production_activity_history.vb`

```sql
INSERT INTO m1_production_activity_history(SELECT 0, pa.* FROM m1_production_activity pa WHERE pa.paid = '{idtransaksi}')
```

```sql
SELECT paidhistory FROM m1_production_activity_history WHERE paid = '{idtransaksi}' ORDER BY pamodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m1_production_activity_detail_history (SELECT 0, '{result_4}', pa.* FROM m1_production_activity_detail pa WHERE pa.idpa = '{idtransaksi}' )
```

```sql
SELECT pa.paidhistory, pa.paid, pa.pakode, pa.panama, pa.pacatatan, pa.paaktif, pa.painputuser, pa.painputtgl, pa.pamodifikasiuser, pa.pamodifikasitgl, pa.pacustomtext1, pa.pacustomtext2, pa.pacustomtext3, pa.pacustomtext4, pa.pacustomtext5, pa.pacustomint1, pa.pacustomint2, pa.pacustomint3, pa.pacustomdbl1, pa.pacustomdbl2, pa.pacustomdbl3, pa.pacustomdate1, pa.pacustomdate2, pa.pacustomdate3, u1.unama as painputusernama, u2.unama as pamodifikasiusernama FROM m1_production_activity_history pa LEFT JOIN m0_user u1 ON pa.painputuser = u1.userid LEFT JOIN m0_user u2 ON pa.pamodifikasiuser = u2.userid
```

```sql
SELECT pa.paidhistory, pa.paid, pa.pakode, pa.panama, pa.pacatatan, pa.paaktif, pa.painputuser, pa.painputtgl, pa.pamodifikasiuser, pa.pamodifikasitgl, pa.pacustomtext1, pa.pacustomtext2, pa.pacustomtext3, pa.pacustomtext4, pa.pacustomtext5, pa.pacustomint1, pa.pacustomint2, pa.pacustomint3, pa.pacustomdbl1, pa.pacustomdbl2, pa.pacustomdbl3, pa.pacustomdate1, pa.pacustomdate2, pa.pacustomdate3, u1.unama AS painputusernama, u2.unama AS pamodifikasiusernama, pad.idhistorydetail, pad.idhistory, pad.idpadetail, pad.idpa, pad.idbarang, pad.namabarang, pad.tipebarang, pad.jml, pad.satuan, pad.nilaisatuan, pad.jmlbarang, pad.satuanbarang, pad.matauang, pad.kurs, pad.harga, pad.hpppersen, pad.hpp, i.brekpersediaan as rekpersediaan, pad.cabang, pad.lokasi, pad.gudangasal, pad.gudangproduksi, pad.gudangtujuan, pad.costcenter, pad.divisi, pad.subdivisi, pad.proyek, pad.catatan, pad.urutan, pad.idbom, pad.idbomin, pad.customtext1, pad.customtext2, pad.customtext3, pad.customdbl1, pad.customdbl2, pad.customdbl3, pad.customdate1, pad.customdate2, pad.customdate3, i.bkode, i.bhpp, i.bjenis, i.bserial, i.bbatch, i.bjmllapangan, i.bsatuanlapangan, i.basset FROM m1_production_activity_history pa JOIN m1_production_activity_detail_history pad ON pa.paidhistory = pad.idhistory JOIN m1_item i ON pad.idbarang = i.bid LEFT JOIN m0_user u1 ON pa.painputuser = u1.userid LEFT JOIN m0_user u2 ON pa.pamodifikasiuser = u2.userid
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_production_category.vb`

```sql
SELECT COUNT(pckode) FROM M1_Production_Category WHERE pckode ='{dataUtama_0}'
```

```sql
Update M1_Production_Category set pcnama = '{FixQuotes_dataUtama_1}', pccatatan = '{FixQuotes_dataUtama_2}', pcaktif = {dataUtama_3}, pcmodifikasiuser = {dataUtama_6}, pcmodifikasitgl = NOW(), pccustomtext1 = '{FixQuotes_dataUtama_8}', pccustomtext2 = '{FixQuotes_dataUtama_9}', pccustomtext3 = '{FixQuotes_dataUtama_10}', pccustomtext4 = '{FixQuotes_dataUtama_11}', pccustomtext5 = '{FixQuotes_dataUtama_12}', pccustomint1 = {dataUtama_13}, pccustomint2 = {dataUtama_14}, pccustomint3 = {dataUtama_15}, pccustomdbl1 = '{FixDouble_dataUtama_16}', pccustomdbl2 = '{FixDouble_dataUtama_17}', pccustomdbl3 = '{FixDouble_dataUtama_18}', pccustomdate1 = '{FixQuotes_AsFormatTanggal_dataUtama_19}', pccustomdate2 = '{FixQuotes_AsFormatTanggal_dataUtama_20}', pccustomdate3 = '{FixQuotes_AsFormatTanggal_dataUtama_21}', pcwajibwo = '{FixDouble_dataUtama_22}' where pckode = '{dataUtama_0}'
```

```sql
Insert into M1_Production_Category (pckode, pcnama, pccatatan, pcaktif, pcinputuser, pcinputtgl, pcmodifikasiuser, pcmodifikasitgl, pccustomtext1, pccustomtext2, pccustomtext3, pccustomtext4, pccustomtext5, pccustomint1, pccustomint2, pccustomint3, pccustomdbl1, pccustomdbl2, pccustomdbl3, pccustomdate1, pccustomdate2, pccustomdate3, pcwajibwo) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00', '{FixQuotes_dataUtama_8}', '{FixQuotes_dataUtama_9}', '{FixQuotes_dataUtama_10}', '{FixQuotes_dataUtama_11}', '{FixQuotes_dataUtama_12}', {dataUtama_13}, {dataUtama_14}, {dataUtama_15}, '{FixDouble_dataUtama_16}', '{FixDouble_dataUtama_17}', '{FixDouble_dataUtama_18}', '{FixQuotes_AsFormatTanggal_dataUtama_19}', '{FixQuotes_AsFormatTanggal_dataUtama_20}', '{FixQuotes_AsFormatTanggal_dataUtama_21}', '{FixDouble_dataUtama_22}')
```

```sql
DELETE FROM M1_Production_Category WHERE pckode = '{idtransaksi}'
```

```sql
SELECT COUNT(pckode) FROM m1_production_category WHERE pckode='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_production_category_history.vb`

```sql
INSERT INTO m1_production_category_history(SELECT 0, pc.* FROM m1_production_category pc WHERE pc.pckode = '{idtransaksi}')
```

```sql
select `pc`.`pcidhistory` AS `pcidhistory`,`pc`.`pckode` AS `pckode`,`pc`.`pcnama` AS `pcnama`,`pc`.`pccatatan` AS `pccatatan`,`pc`.`pcwajibwo` AS `pcwajibwo`,`pc`.`pcaktif` AS `pcaktif`,`pc`.`pcinputuser` AS `pcinputuser`,`pc`.`pcinputtgl` AS `pcinputtgl`,`pc`.`pcmodifikasiuser` AS `pcmodifikasiuser`,`pc`.`pcmodifikasitgl` AS `pcmodifikasitgl`,`pc`.`pccustomtext1` AS `pccustomtext1`,`pc`.`pccustomtext2` AS `pccustomtext2`,`pc`.`pccustomtext3` AS `pccustomtext3`,`pc`.`pccustomtext4` AS `pccustomtext4`,`pc`.`pccustomtext5` AS `pccustomtext5`,`pc`.`pccustomint1` AS `pccustomint1`,`pc`.`pccustomint2` AS `pccustomint2`,`pc`.`pccustomint3` AS `pccustomint3`,`pc`.`pccustomdbl1` AS `pccustomdbl1`,`pc`.`pccustomdbl2` AS `pccustomdbl2`,`pc`.`pccustomdbl3` AS `pccustomdbl3`,`pc`.`pccustomdate1` AS `pccustomdate1`,`pc`.`pccustomdate2` AS `pccustomdate2`,`pc`.`pccustomdate3` AS `pccustomdate3`,`ui`.`unama` AS `pcinputusernama`,`um`.`unama` AS `pcmodifikasiusernama` from ((`m1_production_category_history` `pc` left join `m0_user` `ui` on ((`pc`.`pcinputuser` = `ui`.`userid`))) left join `m0_user` `um` on ((`pc`.`pcmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_production_route.vb`

```sql
Update M1_Production_Route set prkode = '{FixQuotes_drutama}prkode', prnama = '{FixQuotes_drutama}prnama', prcatatan = '{FixQuotes_drutama}prcatatan', praktif = {drutama}praktif, prmodifikasiuser = '{FixQuotes_drutama}prmodifikasiuser', prmodifikasitgl = NOW(), prcustomtext1 = '{FixQuotes_drutama}prcustomtext1', prcustomtext2 = '{FixQuotes_drutama}prcustomtext2', prcustomtext3 = '{FixQuotes_drutama}prcustomtext3', prcustomtext4 = '{FixQuotes_drutama}prcustomtext4', prcustomtext5 = '{FixQuotes_drutama}prcustomtext5', prcustomint1 = {drutama}prcustomint1, prcustomint2 = {drutama}prcustomint2, prcustomint3 = {drutama}prcustomint3, prcustomdbl1 = '{FixDouble_drutama}prcustomdbl1', prcustomdbl2 = '{FixDouble_drutama}prcustomdbl2', prcustomdbl3 = '{FixDouble_drutama}prcustomdbl3', prcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}prcustomdate1', prcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}prcustomdate2', prcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}prcustomdate3' where prid = {drutama}prid
```

```sql
Insert into M1_Production_Route (prkode, prnama, prcatatan, praktif, prinputuser, prinputtgl, prmodifikasiuser, prmodifikasitgl, prcustomtext1, prcustomtext2, prcustomtext3, prcustomtext4, prcustomtext5, prcustomint1, prcustomint2, prcustomint3, prcustomdbl1, prcustomdbl2, prcustomdbl3, prcustomdate1, prcustomdate2, prcustomdate3) values('{FixQuotes_drutama}prkode', '{FixQuotes_drutama}prnama', '{FixQuotes_drutama}prcatatan', {drutama}praktif, '{FixQuotes_drutama}prinputuser', '{FixQuotes_AsFormatTanggal_drutama}prinputtglyyyy-MM-dd HH:mm:ss', '{FixQuotes_drutama}prmodifikasiuser', '{FixQuotes_AsFormatTanggal_drutama}prmodifikasitglyyyy-MM-dd HH:mm:ss', '{FixQuotes_drutama}prcustomtext1', '{FixQuotes_drutama}prcustomtext2', '{FixQuotes_drutama}prcustomtext3', '{FixQuotes_drutama}prcustomtext4', '{FixQuotes_drutama}prcustomtext5', {drutama}prcustomint1, {drutama}prcustomint2, {drutama}prcustomint3, '{FixDouble_drutama}prcustomdbl1', '{FixDouble_drutama}prcustomdbl2', '{FixDouble_drutama}prcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}prcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}prcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}prcustomdate3')
```

```sql
select prid from M1_Production_Route where prkode='{FixQuotes_drutama}prkode' AND prinputuser= '{userid}' order by prmodifikasitgl desc limit 1
```

```sql
Delete from M1_Production_Route_Detail where idpr = '{result_4}'
```

```sql
Insert into M1_Production_Route_Detail(idprdetail, idpr, idpa, namaaktivitas, kodemesin, costcenter, divisi, subdivisi, proyek, catatan, urutan, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
DELETE FROM M1_Production_Route_Detail WHERE idpr = '{idtransaksi}'
```

```sql
DELETE FROM M1_Production_Route WHERE prid = '{idtransaksi}'
```

```sql
SELECT pr.prid, pr.prkode, pr.prnama, pr.prcatatan, pr.praktif, pr.prinputuser, pr.prinputtgl, pr.prmodifikasiuser, pr.prmodifikasitgl, pr.prcustomtext1, pr.prcustomtext2, pr.prcustomtext3, pr.prcustomtext4, pr.prcustomtext5, pr.prcustomint1, pr.prcustomint2, pr.prcustomint3, pr.prcustomdbl1, pr.prcustomdbl2, pr.prcustomdbl3, pr.prcustomdate1, pr.prcustomdate2, pr.prcustomdate3, u1.unama as prinputusernama, u2.unama as prmodifikasiusernama FROM M1_Production_Route pr LEFT JOIN m0_user u1 ON pr.prinputuser = u1.userid LEFT JOIN m0_user u2 ON pr.prmodifikasiuser = u2.userid
```

```sql
SELECT COUNT(prkode) FROM M1_Production_Route WHERE prkode='{idtransaksi}'
```

```sql
SELECT pr.prid, pr.prkode, pr.prnama, pr.prcatatan, pr.praktif, pr.prinputuser, pr.prinputtgl, pr.prmodifikasiuser, pr.prmodifikasitgl, pr.prcustomtext1, pr.prcustomtext2, pr.prcustomtext3, pr.prcustomtext4, pr.prcustomtext5, pr.prcustomint1, pr.prcustomint2, pr.prcustomint3, pr.prcustomdbl1, pr.prcustomdbl2, pr.prcustomdbl3, pr.prcustomdate1, pr.prcustomdate2, pr.prcustomdate3, u1.unama AS prinputusernama, u2.unama AS prmodifikasiusernama, prd.idprdetail, prd.idpr, prd.idpa, prd.namaaktivitas, prd.kodemesin, prd.costcenter, prd.divisi, prd.subdivisi, prd.proyek, prd.catatan, prd.urutan, prd.customtext1, prd.customtext2, prd.customtext3, prd.customdbl1, prd.customdbl2, prd.customdbl3, prd.customdate1, prd.customdate2, prd.customdate3, pa.pakode AS kodeaktivitas, m.mnama AS namamesin FROM M1_Production_Route pr JOIN M1_Production_Route_detail prd ON pr.prid = prd.idpr LEFT JOIN m0_user u1 ON pr.prinputuser = u1.userid LEFT JOIN m0_user u2 ON pr.prmodifikasiuser = u2.userid LEFT JOIN m1_production_activity pa ON prd.idpa = pa.paid LEFT JOIN m1_machine m ON prd.kodemesin = m.mkode
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_production_route_history.vb`

```sql
INSERT INTO m1_production_activity_history(SELECT 0, pr.* FROM m1_production_route pr WHERE pr.prid = '{idtransaksi}')
```

```sql
SELECT pridhistory FROM m1_production_route_history WHERE prid = '{idtransaksi}' ORDER BY prmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m1_production_route_detail_history (SELECT 0, '{result_4}', pr.* FROM m1_production_route_detail pr WHERE pr.idpr = '{idtransaksi}' )
```

```sql
SELECT pr.pridhistory, pr.prid, pr.prkode, pr.prnama, pr.prcatatan, pr.praktif, pr.prinputuser, pr.prinputtgl, pr.prmodifikasiuser, pr.prmodifikasitgl, pr.prcustomtext1, pr.prcustomtext2, pr.prcustomtext3, pr.prcustomtext4, pr.prcustomtext5, pr.prcustomint1, pr.prcustomint2, pr.prcustomint3, pr.prcustomdbl1, pr.prcustomdbl2, pr.prcustomdbl3, pr.prcustomdate1, pr.prcustomdate2, pr.prcustomdate3, u1.unama as prinputusernama, u2.unama as prmodifikasiusernama FROM m1_production_route_history pr LEFT JOIN m0_user u1 ON pr.prinputuser = u1.userid LEFT JOIN m0_user u2 ON pr.prmodifikasiuser = u2.userid
```

```sql
SELECT pr.pridhistory, pr.prid, pr.prkode, pr.prnama, pr.prcatatan, pr.praktif, pr.prinputuser, pr.prinputtgl, pr.prmodifikasiuser, pr.prmodifikasitgl, pr.prcustomtext1, pr.prcustomtext2, pr.prcustomtext3, pr.prcustomtext4, pr.prcustomtext5, pr.prcustomint1, pr.prcustomint2, pr.prcustomint3, pr.prcustomdbl1, pr.prcustomdbl2, pr.prcustomdbl3, pr.prcustomdate1, pr.prcustomdate2, pr.prcustomdate3, u1.unama AS prinputusernama, u2.unama AS prmodifikasiusernama, pad.idhistorydetail, pad.idhistory, pad.idprdetail, pad.idpr, pad.idpa, pad.namaaktivitas, pad.kodemesin, pad.costcenter, pad.divisi, pad.subdivisi, pad.proyek, pad.catatan, pad.urutan, pad.customtext1, pad.customtext2, pad.customtext3, pad.customdbl1, pad.customdbl2, pad.customdbl3, pad.customdate1, pad.customdate2, pad.customdate3 FROM m1_production_route_history pr JOIN m1_production_route_detail_history pad ON pr.pridhistory = pad.idhistory LEFT JOIN m0_user u1 ON pr.prinputuser = u1.userid LEFT JOIN m0_user u2 ON pr.prmodifikasiuser = u2.userid
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_project.vb`

```sql
SELECT COUNT(pkode) FROM M1_Project WHERE pkode ='{dataUtama_0}'
```

```sql
Update M1_Project set pnama = '{FixQuotes_dataUtama_1}', pkategori = '{FixQuotes_dataUtama_2}', paktif = {dataUtama_3}, ptglorder = '{FixQuotes_AsFormatTanggal_dataUtama_4}', ptglmulairencana = '{FixQuotes_AsFormatTanggal_dataUtama_5}', ptglmulairealisasi = '{FixQuotes_AsFormatTanggal_dataUtama_6}', ptglselesairencana = '{FixQuotes_AsFormatTanggal_dataUtama_7}', ptglselesairealisasi = '{FixQuotes_AsFormatTanggal_dataUtama_8}', pprioritas = '{FixQuotes_dataUtama_9}', pselesai = '{FixDouble_dataUtama_10}', pkontak = {dataUtama_11}, pkontakperson = '{FixQuotes_dataUtama_12}', ppimpinanproyek = {dataUtama_13}, pdivisi = '{FixQuotes_dataUtama_14}', pketerangan = '{FixQuotes_dataUtama_15}', ptglkontrak = '{FixQuotes_AsFormatTanggal_dataUtama_16}', pnokontrak = '{FixQuotes_dataUtama_17}', pnilaikontrak = '{FixDouble_dataUtama_18}', psubdari = {dataUtama_19}, pparent = '{FixQuotes_dataUtama_20}', plevel = {dataUtama_21}, pcustom1 = '{FixQuotes_dataUtama_22}', pcustom2 = '{FixQuotes_dataUtama_23}', pcustom3 = '{FixQuotes_dataUtama_24}', pcustom4 = '{FixQuotes_dataUtama_25}', pcustom5 = '{FixQuotes_dataUtama_26}', pmodifikasiuser = {dataUtama_29}, pmodifikasitgl = NOW(), pgd = '{FixQuotes_dataUtama_31}', pstatus = '{FixQuotes_dataUtama_32}' where pkode = '{dataUtama_0}'
```

```sql
Insert into M1_Project (pkode, pnama, pkategori, paktif, ptglorder, ptglmulairencana, ptglmulairealisasi, ptglselesairencana, ptglselesairealisasi, pprioritas, pselesai, pkontak, pkontakperson, ppimpinanproyek, pdivisi, pketerangan, ptglkontrak, pnokontrak, pnilaikontrak, psubdari, pparent, plevel, pcustom1, pcustom2, pcustom3, pcustom4, pcustom5, pinputuser, pinputtgl, pmodifikasiuser, pmodifikasitgl, pgd, pstatus) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, '{FixQuotes_AsFormatTanggal_dataUtama_4}', '{FixQuotes_AsFormatTanggal_dataUtama_5}', '{FixQuotes_AsFormatTanggal_dataUtama_6}', '{FixQuotes_AsFormatTanggal_dataUtama_7}', '{FixQuotes_AsFormatTanggal_dataUtama_8}', '{FixQuotes_dataUtama_9}', '{FixDouble_dataUtama_10}', {dataUtama_11}, '{FixQuotes_dataUtama_12}', {dataUtama_13}, '{FixQuotes_dataUtama_14}', '{FixQuotes_dataUtama_15}', '{FixQuotes_AsFormatTanggal_dataUtama_16}', '{FixQuotes_dataUtama_17}', '{FixDouble_dataUtama_18}', {dataUtama_19}, '{FixQuotes_dataUtama_20}', {dataUtama_21}, '{FixQuotes_dataUtama_22}', '{FixQuotes_dataUtama_23}', '{FixQuotes_dataUtama_24}', '{FixQuotes_dataUtama_25}', '{FixQuotes_dataUtama_26}', {dataUtama_27}, NOW(), {dataUtama_29}, '1971-01-01 00:00:00', '{FixQuotes_dataUtama_31}', '{FixQuotes_dataUtama_32}')
```

```sql
DELETE FROM M1_Project WHERE pkode = '{idtransaksi}'
```

```sql
select `p`.`pkode` AS `pkode`,`p`.`pnama` AS `pnama`,`p`.`pkategori` AS `pkategori`,`p`.`paktif` AS `paktif`,`p`.`ptglorder` AS `ptglorder`,`p`.`ptglmulairencana` AS `ptglmulairencana`,`p`.`ptglmulairealisasi` AS `ptglmulairealisasi`,`p`.`ptglselesairencana` AS `ptglselesairencana`,`p`.`ptglselesairealisasi` AS `ptglselesairealisasi`,`p`.`pprioritas` AS `pprioritas`,`p`.`pselesai` AS `pselesai`,`p`.`pkontak` AS `pkontak`,`p`.`pkontakperson` AS `pkontakperson`,`p`.`ppimpinanproyek` AS `ppimpinanproyek`,`p`.`pdivisi` AS `pdivisi`,`p`.`pketerangan` AS `pketerangan`,`p`.`ptglkontrak` AS `ptglkontrak`,`p`.`pnokontrak` AS `pnokontrak`,`p`.`pnilaikontrak` AS `pnilaikontrak`,`p`.`psubdari` AS `psubdari`,`p`.`pparent` AS `pparent`,`p`.`plevel` AS `plevel`,`p`.`pcustom1` AS `pcustom1`,`p`.`pcustom2` AS `pcustom2`,`p`.`pcustom3` AS `pcustom3`,`p`.`pcustom4` AS `pcustom4`,`p`.`pcustom5` AS `pcustom5`,`p`.`pinputuser` AS `pinputuser`,`p`.`pinputtgl` AS `pinputtgl`,`p`.`pmodifikasiuser` AS `pmodifikasiuser`,`p`.`pmodifikasitgl` AS `pmodifikasitgl`,`p`.`pgd` AS `pgd`,`p`.`pstatus` AS `pstatus`,`c1`.`kkode` AS `pkontakkode`,`c1`.`knama` AS `pkontaknama`,`c2`.`kkode` AS `ppimpinanproyekkode`,`c2`.`knama` AS `ppimpinanproyeknama`,`d`.`dnama` AS `pdivisinama` from (((`m1_project` `p` left join `m1_contact` `c1` on((`p`.`pkontak` = `c1`.`kid`))) left join `m1_contact` `c2` on((`p`.`ppimpinanproyek` = `c2`.`kid`))) left join `m1_division` `d` on((`p`.`pdivisi` = `d`.`dkode`)))
```

```sql
SELECT COUNT(pkode) FROM m1_project WHERE pkode='{idtransaksi}'
```

```sql
DELETE FROM M1_Project
```

```sql
Insert into M1_Project(pkode, pnama, pkategori, paktif, ptglorder, ptglmulairencana, ptglmulairealisasi, ptglselesairencana, ptglselesairealisasi, pprioritas, pselesai, pkontak, pkontakperson, ppimpinanproyek, pdivisi, pketerangan, ptglkontrak, pnokontrak, pnilaikontrak, psubdari, pparent, plevel, pcustom1, pcustom2, pcustom3, pcustom4, pcustom5, pinputuser, pinputtgl, pmodifikasiuser, pmodifikasitgl, pgd, pstatus) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_project_history.vb`

```sql
INSERT INTO m1_project_history(SELECT 0, p.* FROM m1_project p WHERE p.pkode = '{idtransaksi}')
```

```sql
select `p`.`pidhistory` AS `pidhistory`,`p`.`pkode` AS `pkode`,`p`.`pnama` AS `pnama`,`p`.`pkategori` AS `pkategori`,`p`.`paktif` AS `paktif`,`p`.`ptglorder` AS `ptglorder`,`p`.`ptglmulairencana` AS `ptglmulairencana`,`p`.`ptglmulairealisasi` AS `ptglmulairealisasi`,`p`.`ptglselesairencana` AS `ptglselesairencana`,`p`.`ptglselesairealisasi` AS `ptglselesairealisasi`,`p`.`pprioritas` AS `pprioritas`,`p`.`pselesai` AS `pselesai`,`p`.`pkontak` AS `pkontak`,`p`.`pkontakperson` AS `pkontakperson`,`p`.`ppimpinanproyek` AS `ppimpinanproyek`,`p`.`pdivisi` AS `pdivisi`,`p`.`pketerangan` AS `pketerangan`,`p`.`ptglkontrak` AS `ptglkontrak`,`p`.`pnokontrak` AS `pnokontrak`,`p`.`pnilaikontrak` AS `pnilaikontrak`,`p`.`psubdari` AS `psubdari`,`p`.`pparent` AS `pparent`,`p`.`plevel` AS `plevel`,`p`.`pcustom1` AS `pcustom1`,`p`.`pcustom2` AS `pcustom2`,`p`.`pcustom3` AS `pcustom3`,`p`.`pcustom4` AS `pcustom4`,`p`.`pcustom5` AS `pcustom5`,`p`.`pinputuser` AS `pinputuser`,`p`.`pinputtgl` AS `pinputtgl`,`p`.`pmodifikasiuser` AS `pmodifikasiuser`,`p`.`pmodifikasitgl` AS `pmodifikasitgl`,`p`.`pgd` AS `pgd`,`p`.`pstatus` AS `pstatus`,`c1`.`kkode` AS `pkontakkode`,`c1`.`knama` AS `pkontaknama`,`c2`.`kkode` AS `ppimpinanproyekkode`,`c2`.`knama` AS `ppimpinanproyeknama`,`d`.`dnama` AS `pdivisinama`,`ui`.`unama` AS `pinputusernama`,`um`.`unama` AS `pmodifikasiusernama` from (((((`m1_project_history` `p` left join `m1_contact` `c1` on((`p`.`pkontak` = `c1`.`kid`))) left join `m1_contact` `c2` on((`p`.`ppimpinanproyek` = `c2`.`kid`))) left join `m1_division` `d` on((`p`.`pdivisi` = `d`.`dkode`))) LEFT JOIN `m0_user` `ui` ON ((`p`.`pinputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`p`.`pmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_province.vb`

```sql
SELECT COUNT(pkode) FROM M1_Province WHERE pkode ='{dataUtama_0}'
```

```sql
Update M1_Province set pnama = '{FixQuotes_dataUtama_1}', pcatatan = '{FixQuotes_dataUtama_2}', paktif = {dataUtama_3}, pmodifikasiuser = {dataUtama_6}, pmodifikasitgl = NOW() where pkode = '{dataUtama_0}'
```

```sql
Insert into M1_Province (pkode, pnama, pcatatan, paktif, pinputuser, pinputtgl, pmodifikasiuser, pmodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Province WHERE pkode = '{idtransaksi}'
```

```sql
SELECT COUNT(pkode) FROM m1_province WHERE pkode='{idtransaksi}'
```

```sql
select `p`.`pkode` AS `pkode`,`p`.`pnama` AS `pnama`,'CONTACT' AS `sumber`,`c`.`kid` AS `idterkait` from (`m1_contact` `c` join `m1_province` `p` on(((`c`.`k1propinsi` = `p`.`pkode`) or (`c`.`k2propinsi` = `p`.`pkode`) or (`c`.`k3propinsi` = `p`.`pkode`) or (`c`.`k4propinsi` = `p`.`pkode`)))) where p.pkode='valkode'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_province_history.vb`

```sql
INSERT INTO m1_province_history(SELECT 0, p.* FROM m1_province p WHERE p.pkode = '{idtransaksi}')
```

```sql
SELECT `p`.`pidhistory` AS `pidhistory`,`p`.`pkode` AS `pkode`,`p`.`pnama` AS `pnama`,`p`.`pcatatan` AS `pcatatan`,`p`.`paktif` AS `paktif`,`p`.`pinputuser` AS `pinputuser`,`p`.`pinputtgl` AS `pinputtgl`,`p`.`pmodifikasiuser` AS `pmodifikasiuser`,`p`.`pmodifikasitgl` AS `pmodifikasitgl`,`ui`.`unama` AS `pinputusernama`,`um`.`unama` AS `pmodifikasiusernama` from ((`m1_province_history` `p` left join `m0_user` `ui` on ((`p`.`pinputuser` = `ui`.`userid`))) left join `m0_user` `um` on ((`p`.`pmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_reference.vb`

```sql
SELECT COUNT(rid) FROM M1_reference WHERE rid ='{dataUtama_0}'
```

```sql
Update M1_reference set rkode = '{FixQuotes_dataUtama_1}', rnama = '{FixQuotes_dataUtama_2}', rcatatan = '{FixQuotes_dataUtama_3}', raktif = {dataUtama_4}, rmodifikasiuser = {dataUtama_7}, rmodifikasitgl = NOW(), rjenis = {dataUtama_9} where rid = '{dataUtama_0}'
```

```sql
Insert into M1_reference (rkode, rnama, rcatatan, raktif, rinputuser, rinputtgl, rmodifikasiuser, rmodifikasitgl, rjenis) values('{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', '{FixQuotes_dataUtama_4}', {dataUtama_5}, NOW(), {dataUtama_7}, '1971-01-01 00:00:00', {dataUtama_9})
```

```sql
DELETE FROM M1_Reference WHERE rid = '{idtransaksi}'
```

```sql
SELECT COUNT(rid) FROM m1_reference WHERE rkode='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_region.vb`

```sql
SELECT COUNT(rkode) FROM M1_Region WHERE rkode ='{dataUtama_0}'
```

```sql
Update M1_Region set rnama = '{FixQuotes_dataUtama_1}', rcatatan = '{FixQuotes_dataUtama_2}', raktif = {dataUtama_3}, rinputuser = {dataUtama_4}, rinputtgl = '{FixQuotes_AsFormatTanggal_dataUtama_5}yyyy-MM-dd H:mm:ss', rmodifikasiuser = {dataUtama_6}, rmodifikasitgl = '{FixQuotes_AsFormatTanggal_dataUtama_7}yyyy-MM-dd H:mm:ss' where rkode = '{dataUtama_0}'
```

```sql
Insert into M1_Region (rkode, rnama, rcatatan, raktif, rinputuser, rinputtgl, rmodifikasiuser, rmodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, {dataUtama_4}, '{FixQuotes_AsFormatTanggal_dataUtama_5}yyyy-MM-dd H:mm:ss', {dataUtama_6}, '{FixQuotes_AsFormatTanggal_dataUtama_7}yyyy-MM-dd H:mm:ss')
```

```sql
DELETE FROM M1_Region WHERE rkode = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_region_history.vb`

```sql
INSERT INTO m1_region_history(SELECT 0, r.* FROM m1_region r WHERE r.rkode = '{idtransaksi}')
```

```sql
select `r`.`ridhistory` AS `ridhistory`,`r`.`rkode` AS `rkode`,`r`.`rnama` AS `rnama`,`r`.`rcatatan` AS `rcatatan`,`r`.`raktif` AS `raktif`,`r`.`rinputuser` AS `rinputuser`,`r`.`rinputtgl` AS `rinputtgl`,`r`.`rmodifikasiuser` AS `rmodifikasiuser`,`r`.`rmodifikasitgl` AS `rmodifikasitgl`,`ui`.`unama` AS `rinputusernama`,`um`.`unama` AS `rmodifikasiusernama` from ((`m1_region_history` `r` left join `m0_user` `ui` on ((`r`.`rinputuser` = `ui`.`userid`))) left join `m0_user` `um` on ((`r`.`rmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_room.vb`

```sql
SELECT COUNT(rkode) FROM M1_Room WHERE rkode='{dataUtama_0}'
```

```sql
Update M1_Room set rnama = '{FixQuotes_dataUtama_1}', rhargajual1 = '{FixDouble_dataUtama_2}', rhargajual2 = '{FixDouble_dataUtama_3}', rhargajual3 = '{FixDouble_dataUtama_4}', rhargajual4 = '{FixDouble_dataUtama_5}', rhargajual5 = '{FixDouble_dataUtama_6}', rdiskonjual1 = '{FixQuotes_dataUtama_7}', rdiskonjual2 = '{FixQuotes_dataUtama_8}', rdiskonjual3 = '{FixQuotes_dataUtama_9}', rdiskonjual4 = '{FixQuotes_dataUtama_10}', rdiskonjual5 = '{FixQuotes_dataUtama_11}', rjmlkasur = '{FixDouble_dataUtama_12}', rcatatan = '{FixQuotes_dataUtama_13}', rrekpersediaan = '{FixQuotes_dataUtama_14}', rrekhargapokok = '{FixQuotes_dataUtama_15}', rrekdiskonpenjualan = '{FixQuotes_dataUtama_16}', rrekpenjualan = '{FixQuotes_dataUtama_17}', raktif = {dataUtama_18}, risclose = {dataUtama_19}, rmodifikasiuser = {dataUtama_20}, rmodifikasitgl = NOW() , rcustomtext1 = '{FixQuotes_dataUtama_24}' , rcustomtext2 = '{FixQuotes_dataUtama_25}', rcustomtext3 = '{FixQuotes_dataUtama_26}', rcustomtext4 = '{FixQuotes_dataUtama_27}', rcustomtext5 = '{FixQuotes_dataUtama_28}', rcustomint1 = {dataUtama_29}, rcustomint2 = {dataUtama_30}, rcustomint3 = {dataUtama_31}, rcustomint4 = {dataUtama_32}, rcustomint5 = {dataUtama_33}, rcustomdbl1 = {FixDouble_dataUtama_34}, rcustomdbl2 = {FixDouble_dataUtama_35}, rcustomdbl3 = {FixDouble_dataUtama_36}, rcustomdbl4 = {FixDouble_dataUtama_37}, rcustomdbl5 = {FixDouble_dataUtama_38}, rcustomdate1 = '{FixQuotes_AsFormatTanggal_dataUtama_39}', rcustomdate2 = '{FixQuotes_AsFormatTanggal_dataUtama_40}', rcustomdate3 = '{FixQuotes_AsFormatTanggal_dataUtama_41}', rcustomdate4 = '{FixQuotes_AsFormatTanggal_dataUtama_42}', rcustomdate5 = '{FixQuotes_AsFormatTanggal_dataUtama_43}', rkelas = {dataUtama_44} where rkode = '{dataUtama_0}'
```

```sql
Insert into M1_Room (rkode, rnama, rhargajual1, rhargajual2, rhargajual3, rhargajual4, rhargajual5, rdiskonjual1, rdiskonjual2, rdiskonjual3, rdiskonjual4, rdiskonjual5, rjmlkasur, rcatatan, rrekpersediaan, rrekhargapokok, rrekdiskonpenjualan, rrekpenjualan, raktif, risclose, rinputuser, rinputtgl, rmodifikasiuser, rmodifikasitgl, rcustomtext1, rcustomtext2, rcustomtext3, rcustomtext4, rcustomtext5, rcustomint1, rcustomint2, rcustomint3, rcustomint4, rcustomint5, rcustomdbl1, rcustomdbl2, rcustomdbl3, rcustomdbl4, rcustomdbl5, rcustomdate1, rcustomdate2, rcustomdate3, rcustomdate4, rcustomdate5, rkelas) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixDouble_dataUtama_2}', '{FixDouble_dataUtama_3}', '{FixDouble_dataUtama_4}', '{FixDouble_dataUtama_5}', '{FixDouble_dataUtama_6}', '{FixQuotes_dataUtama_7}', '{FixQuotes_dataUtama_8}', '{FixQuotes_dataUtama_9}', '{FixQuotes_dataUtama_10}', '{FixQuotes_dataUtama_11}', '{FixDouble_dataUtama_12}', '{FixQuotes_dataUtama_13}', '{FixQuotes_dataUtama_14}', '{FixQuotes_dataUtama_15}', '{FixQuotes_dataUtama_16}', '{FixQuotes_dataUtama_17}', {dataUtama_18}, {dataUtama_19}, {dataUtama_20}, NOW(), {dataUtama_22}, '1971-01-01 00:00:00', '{FixQuotes_dataUtama_24}', '{FixQuotes_dataUtama_25}', '{FixQuotes_dataUtama_26}', '{FixQuotes_dataUtama_27}', '{FixQuotes_dataUtama_28}', {dataUtama_29}, {dataUtama_30}, {dataUtama_31}, {dataUtama_32}, {dataUtama_33}, {FixDouble_dataUtama_34}, {FixDouble_dataUtama_35}, {FixDouble_dataUtama_36}, {FixDouble_dataUtama_37}, {FixDouble_dataUtama_38}, '{FixQuotes_AsFormatTanggal_dataUtama_39}', '{FixQuotes_AsFormatTanggal_dataUtama_40}', '{FixQuotes_AsFormatTanggal_dataUtama_41}', '{FixQuotes_AsFormatTanggal_dataUtama_42}', '{FixQuotes_AsFormatTanggal_dataUtama_43}', {dataUtama_44})
```

```sql
DELETE FROM M1_Room WHERE rkode = '{idtransaksi}'
```

```sql
select `r`.`rkode` AS `rkode`,`r`.`rnama` AS `rnama`,`r`.`rhargajual1` AS `rhargajual1`,`r`.`rhargajual2` AS `rhargajual2`,`r`.`rhargajual3` AS `rhargajual3`,`r`.`rhargajual4` AS `rhargajual4`,`r`.`rhargajual5` AS `rhargajual5`,`r`.`rdiskonjual1` AS `rdiskonjual1`,`r`.`rdiskonjual2` AS `rdiskonjual2`,`r`.`rdiskonjual3` AS `rdiskonjual3`,`r`.`rdiskonjual4` AS `rdiskonjual4`,`r`.`rdiskonjual5` AS `rdiskonjual5`,`r`.`rjmlkasur` AS `rjmlkasur`,`r`.`rcatatan` AS `rcatatan`,`r`.`rrekpersediaan` AS `rrekpersediaan`,`r`.`rrekhargapokok` AS `rrekhargapokok`,`r`.`rrekdiskonpenjualan` AS `rrekdiskonpenjualan`,`r`.`rrekpenjualan` AS `rrekpenjualan`,`r`.`raktif` AS `raktif`,`r`.`risclose` AS `risclose`,`r`.`rinputuser` AS `rinputuser`,`r`.`rinputtgl` AS `rinputtgl`,`r`.`rmodifikasiuser` AS `rmodifikasiuser`,`r`.`rmodifikasitgl` AS `rmodifikasitgl`,`r`.`rcustomtext1` AS `rcustomtext1`,`r`.`rcustomtext2` AS `rcustomtext2`,`r`.`rcustomtext3` AS `rcustomtext3`,`r`.`rcustomtext4` AS `rcustomtext4`,`r`.`rcustomtext5` AS `rcustomtext5`,`r`.`rcustomint1` AS `rcustomint1`,`r`.`rcustomint2` AS `rcustomint2`,`r`.`rcustomint3` AS `rcustomint3`,`r`.`rcustomint4` AS `rcustomint4`,`r`.`rcustomint5` AS `rcustomint5`,`r`.`rcustomdbl1` AS `rcustomdbl1`,`r`.`rcustomdbl2` AS `rcustomdbl2`,`r`.`rcustomdbl3` AS `rcustomdbl3`,`r`.`rcustomdbl4` AS `rcustomdbl4`,`r`.`rcustomdbl5` AS `rcustomdbl5`,`r`.`rcustomdate1` AS `rcustomdate1`,`r`.`rcustomdate2` AS `rcustomdate2`,`r`.`rcustomdate3` AS `rcustomdate3`,`r`.`rcustomdate4` AS `rcustomdate4`,`r`.`rcustomdate5` AS `rcustomdate5`,`c1`.`cnama` AS `rrekpersediaannama`,`c2`.`cnama` AS `rrekhargapokoknama`,`c3`.`cnama` AS `rrekdiskonpenjualannama`,`c4`.`cnama` AS `rrekpenjualannama`,r.rkelas AS rkelas from ((((`m1_room` `r` left join `m1_coa` `c1` on((`c1`.`cnomor` = `r`.`rrekpersediaan`))) left join `m1_coa` `c2` on((`c2`.`cnomor` = `r`.`rrekhargapokok`)))left join `m1_coa` `c3` on((`c3`.`cnomor` = `r`.`rrekdiskonpenjualan`)))left join `m1_coa` `c4` on((`c4`.`cnomor` = `r`.`rrekpenjualan`)))
```

```sql
SELECT COUNT(rkode) FROM m1_room WHERE rkode='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_room_history.vb`

```sql
INSERT INTO m1_room_history(SELECT 0, room.* FROM m1_room room WHERE room.rkode = '{idtransaksi}')
```

```sql
select `r`.`ridhistory` AS `ridhistory`,`r`.`rkode` AS `rkode`,`r`.`rnama` AS `rnama`,`r`.`rhargajual1` AS `rhargajual1`,`r`.`rhargajual2` AS `rhargajual2`,`r`.`rhargajual3` AS `rhargajual3`,`r`.`rhargajual4` AS `rhargajual4`,`r`.`rhargajual5` AS `rhargajual5`,`r`.`rdiskonjual1` AS `rdiskonjual1`,`r`.`rdiskonjual2` AS `rdiskonjual2`,`r`.`rdiskonjual3` AS `rdiskonjual3`,`r`.`rdiskonjual4` AS `rdiskonjual4`,`r`.`rdiskonjual5` AS `rdiskonjual5`,`r`.`rjmlkasur` AS `rjmlkasur`,`r`.`rcatatan` AS `rcatatan`,`r`.`rrekpersediaan` AS `rrekpersediaan`,`r`.`rrekhargapokok` AS `rrekhargapokok`,`r`.`rrekdiskonpenjualan` AS `rrekdiskonpenjualan`,`r`.`rrekpenjualan` AS `rrekpenjualan`,`r`.`raktif` AS `raktif`,`r`.`risclose` AS `risclose`,`r`.`rinputuser` AS `rinputuser`,`r`.`rinputtgl` AS `rinputtgl`,`r`.`rmodifikasiuser` AS `rmodifikasiuser`,`r`.`rmodifikasitgl` AS `rmodifikasitgl`,`r`.`rcustomtext1` AS `rcustomtext1`,`r`.`rcustomtext2` AS `rcustomtext2`,`r`.`rcustomtext3` AS `rcustomtext3`,`r`.`rcustomtext4` AS `rcustomtext4`,`r`.`rcustomtext5` AS `rcustomtext5`,`r`.`rcustomint1` AS `rcustomint1`,`r`.`rcustomint2` AS `rcustomint2`,`r`.`rcustomint3` AS `rcustomint3`,`r`.`rcustomint4` AS `rcustomint4`,`r`.`rcustomint5` AS `rcustomint5`,`r`.`rcustomdbl1` AS `rcustomdbl1`,`r`.`rcustomdbl2` AS `rcustomdbl2`,`r`.`rcustomdbl3` AS `rcustomdbl3`,`r`.`rcustomdbl4` AS `rcustomdbl4`,`r`.`rcustomdbl5` AS `rcustomdbl5`,`r`.`rcustomdate1` AS `rcustomdate1`,`r`.`rcustomdate2` AS `rcustomdate2`,`r`.`rcustomdate3` AS `rcustomdate3`,`r`.`rcustomdate4` AS `rcustomdate4`,`r`.`rcustomdate5` AS `rcustomdate5`,`c1`.`cnama` AS `rrekpersediaannama`,`c2`.`cnama` AS `rrekhargapokoknama`,`c3`.`cnama` AS `rrekdiskonpenjualannama`,`c4`.`cnama` AS `rrekpenjualannama`,`ui`.`unama` AS `rinputusernama`,`um`.`unama` AS `rmodifikasiusernama` from ((((((`m1_room_history` `r` left join `m1_coa` `c1` on((`c1`.`cnomor` = `r`.`rrekpersediaan`))) left join `m1_coa` `c2` on((`c2`.`cnomor` = `r`.`rrekhargapokok`)))left join `m1_coa` `c3` on((`c3`.`cnomor` = `r`.`rrekdiskonpenjualan`)))left join `m1_coa` `c4` on((`c4`.`cnomor` = `r`.`rrekpenjualan`)))LEFT JOIN `m0_user` `ui` ON ((`r`.`rinputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`r`.`rmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_salesman_category.vb`

```sql
SELECT COUNT(sckode) FROM M1_Salesman_Category WHERE sckode ='{dataUtama_0}'
```

```sql
Update M1_Salesman_Category set scnama = '{FixQuotes_dataUtama_1}', scarea = '{FixQuotes_dataUtama_2}', sccatatan = '{FixQuotes_dataUtama_3}', scaktif = {dataUtama_4}, scmodifikasiuser = {dataUtama_7}, scmodifikasitgl = NOW() where sckode = '{dataUtama_0}'
```

```sql
Insert into M1_Salesman_Category (sckode, scnama, scarea, sccatatan, scaktif, scinputuser, scinputtgl, scmodifikasiuser, scmodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', {dataUtama_4}, {dataUtama_5}, NOW(), {dataUtama_7}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Salesman_Category WHERE sckode = '{idtransaksi}'
```

```sql
select `sc`.`sckode` AS `sckode`,`sc`.`scnama` AS `scnama`,`sc`.`scarea` AS `scarea`,`sc`.`sccatatan` AS `sccatatan`,`sc`.`scaktif` AS `scaktif`,`sc`.`scinputuser` AS `scinputuser`,`sc`.`scinputtgl` AS `scinputtgl`,`sc`.`scmodifikasiuser` AS `scmodifikasiuser`,`sc`.`scmodifikasitgl` AS `scmodifikasitgl`,`a`.`anama` AS `scareanama` from (`m1_salesman_category` `sc` left join `m1_area` `a` on((`sc`.`scarea` = `a`.`akode`)))
```

```sql
SELECT COUNT(sckode) FROM m1_salesman_category WHERE sckode='{idtransaksi}'
```

```sql
SELECT sc.sckode, sc.scnama, 'CONTACT' as sumber, c.kid as idterkait FROM m1_contact c JOIN m1_salesman_category sc ON c.kkategorisalesman=sc.sckode WHERE sc.sckode='valkode'
```

```sql
DELETE FROM M1_Salesman_Category
```

```sql
Insert into M1_Salesman_Category(sckode, scnama, scarea, sccatatan, scaktif, scinputuser, scinputtgl, scmodifikasiuser, scmodifikasitgl) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_salesman_category_history.vb`

```sql
INSERT INTO m1_salesman_category_history(SELECT 0, sc.* FROM m1_salesman_category sc WHERE sc.sckode = '{idtransaksi}')
```

```sql
select `sc`.`scidhistory` AS `scidhistory`,`sc`.`sckode` AS `sckode`,`sc`.`scnama` AS `scnama`,`sc`.`scarea` AS `scarea`,`sc`.`sccatatan` AS `sccatatan`,`sc`.`scaktif` AS `scaktif`,`sc`.`scinputuser` AS `scinputuser`,`sc`.`scinputtgl` AS `scinputtgl`,`sc`.`scmodifikasiuser` AS `scmodifikasiuser`,`sc`.`scmodifikasitgl` AS `scmodifikasitgl`,`a`.`anama` AS `scareanama`,`ui`.`unama` AS `scinputusernama`,`um`.`unama` AS `scmodifikasiusernama` from (((`m1_salesman_category_history` `sc` left join `m1_area` `a` on((`sc`.`scarea` = `a`.`akode`))) LEFT JOIN `m0_user` `ui` ON ((`sc`.`scinputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`sc`.`scmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_section.vb`

```sql
Insert into M1_Section(skode, snama, scatatan, saktif, sinputuser, sinputtgl, smodifikasiuser, smodifikasitgl, scustomtext1, scustomtext2, scustomtext3, scustomtext4, scustomtext5, scustomint1, scustomint2, scustomint3, scustomdbl1, scustomdbl2, scustomdbl3, scustomdate1, scustomdate2, scustomdate3, sindexbarcode) values{strValue2_ToString} ON DUPLICATE KEY UPDATE snama = VALUES(snama), scatatan = VALUES(scatatan), saktif = VALUES(saktif), smodifikasiuser = VALUES(smodifikasiuser), smodifikasitgl = NOW(), scustomtext1 = VALUES(scustomtext1), scustomtext2 = VALUES(scustomtext2), scustomtext3 = VALUES(scustomtext3), scustomtext4 = VALUES(scustomtext4), scustomtext5 = VALUES(scustomtext5), scustomint1 = VALUES(scustomint1), scustomint2 = VALUES(scustomint2), scustomint3 = VALUES(scustomint3), scustomdbl1 = VALUES(scustomdbl1), scustomdbl2 = VALUES(scustomdbl2), scustomdbl3 = VALUES(scustomdbl3), scustomdate1 = VALUES(scustomdate1), scustomdate2 = VALUES(scustomdate2), scustomdate3 = VALUES(scustomdate3), sindexbarcode = VALUES(sindexbarcode)
```

```sql
DELETE FROM M1_Section WHERE skode = '{idtransaksi}'
```

```sql
select `s`.`skode` AS `skode`,`s`.`snama` AS `snama`,`s`.`scatatan` AS `scatatan`,`s`.`saktif` AS `saktif`,`s`.`sinputuser` AS `sinputuser`,`s`.`sinputtgl` AS `sinputtgl`,`s`.`smodifikasiuser` AS `smodifikasiuser`,`s`.`smodifikasitgl` AS `smodifikasitgl`,`s`.`scustomtext1` AS `scustomtext1`,`s`.`scustomtext2` AS `scustomtext2`,`s`.`scustomtext3` AS `scustomtext3`,`s`.`scustomtext4` AS `scustomtext4`,`s`.`scustomtext5` AS `scustomtext5`,`s`.`scustomint1` AS `scustomint1`,`s`.`scustomint2` AS `scustomint2`,`s`.`scustomint3` AS `scustomint3`,`s`.`scustomdbl1` AS `scustomdbl1`,`s`.`scustomdbl2` AS `scustomdbl2`,`s`.`scustomdbl3` AS `scustomdbl3`,`s`.`scustomdate1` AS `scustomdate1`,`s`.`scustomdate2` AS `scustomdate2`,`s`.`scustomdate3` AS `scustomdate3`,`s`.`sindexbarcode` AS `sindexbarcode`,`u1`.`unama` AS `sinputusernama`,`u2`.`unama` AS `smodifikasiusernama` from ((`M1_Section` `s` left join `m0_user` `u1` on((`s`.`sinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`s`.`smodifikasiuser` = `u2`.`userid`)))
```

```sql
SELECT COUNT(skode) FROM M1_Section WHERE skode='{idtransaksi}'
```

```sql
select s.skode AS skode, s.snama AS snama, s.skode AS sumber, CONCAT('Setting : ', s.smodule, ' - ', s.sgrup, ' - ', s.skode) AS idterkait from m0_setting s join m1_class_product s on (s.smodule = 0 AND s.sgrup = 'options' AND s.skode = 'KelasProduk' AND s.snilai = s.skode) WHERE s.skode = 'valkode' union all SELECT s.skode as skode, s.snama as snama, 'Item' as sumber, i.bkode as idterkait FROM m1_item i JOIN m1_class_product s ON i.bkelasproduk = s.skode AND s.skode = 'valkode' GROUP BY s.skode, i.bid UNION ALL SELECT s.skode as skode, s.snama as snama, 'POS Type' as sumber, pts.tipepos as idterkait FROM m_12_pos_type_class_product pts JOIN m1_class_product s ON pts.kelasproduk = s.skode AND s.skode = 'valkode' GROUP BY s.skode, pts.tipepos
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_section_history.vb`

```sql
INSERT INTO M1_Section_history(SELECT 0, class_product.* FROM M1_Section class_product WHERE class_product.skode = '{idtransaksi}')
```

```sql
select `s`.`sidhistory` AS `sidhistory`,`s`.`skode` AS `skode`,`s`.`snama` AS `snama`,`s`.`scatatan` AS `scatatan`,`s`.`saktif` AS `saktif`,`s`.`sinputuser` AS `sinputuser`,`s`.`sinputtgl` AS `sinputtgl`,`s`.`smodifikasiuser` AS `smodifikasiuser`,`s`.`smodifikasitgl` AS `smodifikasitgl`,`s`.`scustomtext1` AS `scustomtext1`,`s`.`scustomtext2` AS `scustomtext2`,`s`.`scustomtext3` AS `scustomtext3`,`s`.`scustomtext4` AS `scustomtext4`,`s`.`scustomtext5` AS `scustomtext5`,`s`.`scustomint1` AS `scustomint1`,`s`.`scustomint2` AS `scustomint2`,`s`.`scustomint3` AS `scustomint3`,`s`.`scustomdbl1` AS `scustomdbl1`,`s`.`scustomdbl2` AS `scustomdbl2`,`s`.`scustomdbl3` AS `scustomdbl3`,`s`.`scustomdate1` AS `scustomdate1`,`s`.`scustomdate2` AS `scustomdate2`,`s`.`scustomdate3` AS `scustomdate3`,`s`.`sindexbarcode` AS `sindexbarcode`,`u1`.`unama` AS `sinputusernama`,`u2`.`unama` AS `smodifikasiusernama` from ((`M1_Section_history` `s` left join `m0_user` `u1` on((`s`.`sinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`s`.`smodifikasiuser` = `u2`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_selling_point.vb`

```sql
SELECT COUNT(spid) FROM M1_Selling_Point WHERE spid ='{dataUtama_0}'
```

```sql
Update M1_Selling_Point set spkode = '{FixQuotes_dataUtama_1}', spnama = '{FixQuotes_dataUtama_2}', spjmlbarang = {dataUtama_3}, sppoint = {dataUtama_4}, spcatatan = '{FixQuotes_dataUtama_5}', spmodifikasiuser = {dataUtama_8}, spmodifikasitgl = NOW() where spid = {dataUtama_0}
```

```sql
Insert into M1_Selling_Point (spid, spkode, spnama, spjmlbarang, sppoint, spcatatan, spinputuser, spinputtgl, spmodifikasiuser, spmodifikasitgl) values({0}, '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, {dataUtama_4}, '{FixQuotes_dataUtama_5}', {dataUtama_6}, NOW(), {0}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Selling_Point WHERE spid = '{idtransaksi}'
```

```sql
SELECT COUNT(spkode) FROM M1_Selling_Point WHERE spkode='{idtransaksi}'
```

```sql
SELECT spkode, spnama, 'Item' as sumber, i.bkode as idterkait FROM m1_selling_point sp JOIN m1_item i ON sp.spid = i.bkomisi WHERE sp.spid = '{idtransaksi}'
```

```sql
DELETE FROM M1_Selling_Point
```

```sql
Insert into M1_Selling_Point(spid, spkode, spnama, spjmlbarang, sppoint, spcatatan, spinputuser, spinputtgl, spmodifikasiuser, spmodifikasitgl) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_selling_point_history.vb`

```sql
INSERT INTO M1_Selling_Point_history(SELECT 0, sp.* FROM M1_Selling_Point sp WHERE sp.spid = '{idtransaksi}')
```

```sql
SELECT sp.spidhistory, sp.spid, sp.spkode, sp.spnama, sp.spjmlbarang, sp.sppoint, sp.spcatatan, sp.spinputuser, sp.spinputtgl, sp.spmodifikasiuser, sp.spmodifikasitgl, u1.unama as spinputusernama, u2.unama as spmodifikasiusernama FROM m1_selling_point_history sp left join m0_user u1 on sp.spinputuser = u1.userid left join m0_user u2 on sp.spmodifikasiuser = u2.userid
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_size.vb`

```sql
Insert into M1_Size(skode, snama, scatatan, saktif, sinputuser, sinputtgl, smodifikasiuser, smodifikasitgl, scustomtext1, scustomtext2, scustomtext3, scustomtext4, scustomtext5, scustomint1, scustomint2, scustomint3, scustomdbl1, scustomdbl2, scustomdbl3, scustomdate1, scustomdate2, scustomdate3, sindexbarcode) values{strValue2_ToString} ON DUPLICATE KEY UPDATE snama = VALUES(snama), scatatan = VALUES(scatatan), saktif = VALUES(saktif), smodifikasiuser = VALUES(smodifikasiuser), smodifikasitgl = NOW(), scustomtext1 = VALUES(scustomtext1), scustomtext2 = VALUES(scustomtext2), scustomtext3 = VALUES(scustomtext3), scustomtext4 = VALUES(scustomtext4), scustomtext5 = VALUES(scustomtext5), scustomint1 = VALUES(scustomint1), scustomint2 = VALUES(scustomint2), scustomint3 = VALUES(scustomint3), scustomdbl1 = VALUES(scustomdbl1), scustomdbl2 = VALUES(scustomdbl2), scustomdbl3 = VALUES(scustomdbl3), scustomdate1 = VALUES(scustomdate1), scustomdate2 = VALUES(scustomdate2), scustomdate3 = VALUES(scustomdate3), sindexbarcode = VALUES(sindexbarcode)
```

```sql
DELETE FROM M1_Size WHERE skode = '{idtransaksi}'
```

```sql
select `s`.`skode` AS `skode`,`s`.`snama` AS `snama`,`s`.`scatatan` AS `scatatan`,`s`.`saktif` AS `saktif`,`s`.`sinputuser` AS `sinputuser`,`s`.`sinputtgl` AS `sinputtgl`,`s`.`smodifikasiuser` AS `smodifikasiuser`,`s`.`smodifikasitgl` AS `smodifikasitgl`,`s`.`scustomtext1` AS `scustomtext1`,`s`.`scustomtext2` AS `scustomtext2`,`s`.`scustomtext3` AS `scustomtext3`,`s`.`scustomtext4` AS `scustomtext4`,`s`.`scustomtext5` AS `scustomtext5`,`s`.`scustomint1` AS `scustomint1`,`s`.`scustomint2` AS `scustomint2`,`s`.`scustomint3` AS `scustomint3`,`s`.`scustomdbl1` AS `scustomdbl1`,`s`.`scustomdbl2` AS `scustomdbl2`,`s`.`scustomdbl3` AS `scustomdbl3`,`s`.`scustomdate1` AS `scustomdate1`,`s`.`scustomdate2` AS `scustomdate2`,`s`.`scustomdate3` AS `scustomdate3`,`s`.`sindexbarcode` AS `sindexbarcode`,`u1`.`unama` AS `sinputusernama`,`u2`.`unama` AS `smodifikasiusernama` from ((`M1_Size` `s` left join `m0_user` `u1` on((`s`.`sinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`s`.`smodifikasiuser` = `u2`.`userid`)))
```

```sql
SELECT COUNT(skode) FROM M1_Size WHERE skode='{idtransaksi}'
```

```sql
select s.skode AS skode, s.snama AS snama, s.skode AS sumber, CONCAT('Setting : ', s.smodule, ' - ', s.sgrup, ' - ', s.skode) AS idterkait from m0_setting s join m1_class_product s on (s.smodule = 0 AND s.sgrup = 'options' AND s.skode = 'KelasProduk' AND s.snilai = s.skode) WHERE s.skode = 'valkode' union all SELECT s.skode as skode, s.snama as snama, 'Item' as sumber, i.bkode as idterkait FROM m1_item i JOIN m1_class_product s ON i.bkelasproduk = s.skode AND s.skode = 'valkode' GROUP BY s.skode, i.bid UNION ALL SELECT s.skode as skode, s.snama as snama, 'POS Type' as sumber, pts.tipepos as idterkait FROM m_12_pos_type_class_product pts JOIN m1_class_product s ON pts.kelasproduk = s.skode AND s.skode = 'valkode' GROUP BY s.skode, pts.tipepos
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_size_history.vb`

```sql
INSERT INTO M1_Size_history(SELECT 0, class_product.* FROM M1_Size class_product WHERE class_product.skode = '{idtransaksi}')
```

```sql
select `s`.`sidhistory` AS `sidhistory`,`s`.`skode` AS `skode`,`s`.`snama` AS `snama`,`s`.`scatatan` AS `scatatan`,`s`.`saktif` AS `saktif`,`s`.`sinputuser` AS `sinputuser`,`s`.`sinputtgl` AS `sinputtgl`,`s`.`smodifikasiuser` AS `smodifikasiuser`,`s`.`smodifikasitgl` AS `smodifikasitgl`,`s`.`scustomtext1` AS `scustomtext1`,`s`.`scustomtext2` AS `scustomtext2`,`s`.`scustomtext3` AS `scustomtext3`,`s`.`scustomtext4` AS `scustomtext4`,`s`.`scustomtext5` AS `scustomtext5`,`s`.`scustomint1` AS `scustomint1`,`s`.`scustomint2` AS `scustomint2`,`s`.`scustomint3` AS `scustomint3`,`s`.`scustomdbl1` AS `scustomdbl1`,`s`.`scustomdbl2` AS `scustomdbl2`,`s`.`scustomdbl3` AS `scustomdbl3`,`s`.`scustomdate1` AS `scustomdate1`,`s`.`scustomdate2` AS `scustomdate2`,`s`.`scustomdate3` AS `scustomdate3`,`s`.`sindexbarcode` AS `sindexbarcode`,`u1`.`unama` AS `sinputusernama`,`u2`.`unama` AS `smodifikasiusernama` from ((`M1_Size_history` `s` left join `m0_user` `u1` on((`s`.`sinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`s`.`smodifikasiuser` = `u2`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_subclass.vb`

```sql
Insert into M1_Subclass(sckode, scnama, sccatatan, scaktif, scinputuser, scinputtgl, scmodifikasiuser, scmodifikasitgl, sccustomtext1, sccustomtext2, sccustomtext3, sccustomtext4, sccustomtext5, sccustomint1, sccustomint2, sccustomint3, sccustomdbl1, sccustomdbl2, sccustomdbl3, sccustomdate1, sccustomdate2, sccustomdate3, scindexbarcode, sckelas) values{strValue2_ToString} ON DUPLICATE KEY UPDATE scnama = VALUES(scnama), sccatatan = VALUES(sccatatan), scaktif = VALUES(scaktif), scmodifikasiuser = VALUES(scmodifikasiuser), scmodifikasitgl = NOW(), sccustomtext1 = VALUES(sccustomtext1), sccustomtext2 = VALUES(sccustomtext2), sccustomtext3 = VALUES(sccustomtext3), sccustomtext4 = VALUES(sccustomtext4), sccustomtext5 = VALUES(sccustomtext5), sccustomint1 = VALUES(sccustomint1), sccustomint2 = VALUES(sccustomint2), sccustomint3 = VALUES(sccustomint3), sccustomdbl1 = VALUES(sccustomdbl1), sccustomdbl2 = VALUES(sccustomdbl2), sccustomdbl3 = VALUES(sccustomdbl3), sccustomdate1 = VALUES(sccustomdate1), sccustomdate2 = VALUES(sccustomdate2), sccustomdate3 = VALUES(sccustomdate3), scindexbarcode = VALUES(scindexbarcode), sckelas = VALUES(sckelas)
```

```sql
DELETE FROM M1_Subclass WHERE sckode = '{idtransaksi}'
```

```sql
select `sc`.`sckode` AS `sckode`,`sc`.`scnama` AS `scnama`,`sc`.`sccatatan` AS `sccatatan`,`sc`.`scaktif` AS `scaktif`,`sc`.`scinputuser` AS `scinputuser`,`sc`.`scinputtgl` AS `scinputtgl`,`sc`.`scmodifikasiuser` AS `scmodifikasiuser`,`sc`.`scmodifikasitgl` AS `scmodifikasitgl`,`sc`.`sccustomtext1` AS `sccustomtext1`,`sc`.`sccustomtext2` AS `sccustomtext2`,`sc`.`sccustomtext3` AS `sccustomtext3`,`sc`.`sccustomtext4` AS `sccustomtext4`,`sc`.`sccustomtext5` AS `sccustomtext5`,`sc`.`sccustomint1` AS `sccustomint1`,`sc`.`sccustomint2` AS `sccustomint2`,`sc`.`sccustomint3` AS `sccustomint3`,`sc`.`sccustomdbl1` AS `sccustomdbl1`,`sc`.`sccustomdbl2` AS `sccustomdbl2`,`sc`.`sccustomdbl3` AS `sccustomdbl3`,`sc`.`sccustomdate1` AS `sccustomdate1`,`sc`.`sccustomdate2` AS `sccustomdate2`,`sc`.`sccustomdate3` AS `sccustomdate3`,`sc`.`scindexbarcode` AS `scindexbarcode`,`sc`.`sckelas` AS `sckelas`,`u1`.`unama` AS `scinputusernama`,`u2`.`unama` AS `scmodifikasiusernama` from ((`M1_Subclass` `sc` left join `m0_user` `u1` on((`sc`.`scinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`sc`.`scmodifikasiuser` = `u2`.`userid`)))
```

```sql
SELECT COUNT(sckode) FROM M1_Subclass WHERE sckode='{idtransaksi}'
```

```sql
select sc.sckode AS sckode, sc.scnama AS scnama, s.skode AS sumber, CONCAT('Setting : ', s.smodule, ' - ', s.sgrup, ' - ', s.skode) AS idterkait from m0_setting s join M1_Subclass sc on (s.smodule = 0 AND s.sgrup = 'options' AND s.skode = 'KelasProduk' AND s.snilai = sc.sckode) WHERE sc.sckode = 'valkode' union all SELECT sc.sckode as sckode, sc.scnama as scnama, 'Item' as sumber, i.bkode as idterkait FROM m1_item i JOIN M1_Subclass sc ON i.bkelasproduk = sc.sckode AND sc.sckode = 'valkode' GROUP BY sc.sckode, i.bid UNION ALL SELECT sc.sckode as sckode, sc.scnama as scnama, 'POS Type' as sumber, ptsc.tipepos as idterkait FROM m_12_pos_type_class_product ptsc JOIN M1_Subclass sc ON ptsc.kelasproduk = sc.sckode AND sc.sckode = 'valkode' GROUP BY sc.sckode, ptsc.tipepos
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_subclass_history.vb`

```sql
INSERT INTO M1_Subclass_history(SELECT 0, class_product.* FROM M1_Subclass class_product WHERE class_product.sckode = '{idtransaksi}')
```

```sql
select `sc`.`scidhistory` AS `scidhistory`,`sc`.`sckode` AS `sckode`,`sc`.`scnama` AS `scnama`,`sc`.`sccatatan` AS `sccatatan`,`sc`.`scaktif` AS `scaktif`,`sc`.`scinputuser` AS `scinputuser`,`sc`.`scinputtgl` AS `scinputtgl`,`sc`.`scmodifikasiuser` AS `scmodifikasiuser`,`sc`.`scmodifikasitgl` AS `scmodifikasitgl`,`sc`.`sccustomtext1` AS `sccustomtext1`,`sc`.`sccustomtext2` AS `sccustomtext2`,`sc`.`sccustomtext3` AS `sccustomtext3`,`sc`.`sccustomtext4` AS `sccustomtext4`,`sc`.`sccustomtext5` AS `sccustomtext5`,`sc`.`sccustomint1` AS `sccustomint1`,`sc`.`sccustomint2` AS `sccustomint2`,`sc`.`sccustomint3` AS `sccustomint3`,`sc`.`sccustomdbl1` AS `sccustomdbl1`,`sc`.`sccustomdbl2` AS `sccustomdbl2`,`sc`.`sccustomdbl3` AS `sccustomdbl3`,`sc`.`sccustomdate1` AS `sccustomdate1`,`sc`.`sccustomdate2` AS `sccustomdate2`,`sc`.`sccustomdate3` AS `sccustomdate3`,`sc`.`scindexbarcode` AS `scindexbarcode`,`sc`.`sckelas` AS `sckelas`,`u1`.`unama` AS `scinputusernama`,`u2`.`unama` AS `scmodifikasiusernama` from ((`M1_Subclass_history` `sc` left join `m0_user` `u1` on((`sc`.`scinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`sc`.`scmodifikasiuser` = `u2`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_subdepartment.vb`

```sql
Insert into M1_Subdepartment(sdpkode, sdpnama, sdpdepartemen, sdpdivisi, sdpsubdivisi, sdpcatatan, sdpaktif, sdpinputuser, sdpinputtgl, sdpmodifikasiuser, sdpmodifikasitgl, sdpcustomtext1, sdpcustomtext2, sdpcustomtext3, sdpcustomtext4, sdpcustomtext5, sdpcustomint1, sdpcustomint2, sdpcustomint3, sdpcustomdbl1, sdpcustomdbl2, sdpcustomdbl3, sdpcustomdate1, sdpcustomdate2, sdpcustomdate3, sdpindexbarcode) values{strValue2_ToString} ON DUPLICATE KEY UPDATE sdpnama = VALUES(sdpnama), sdpdepartemen = VALUES(sdpdepartemen), sdpdivisi = VALUES(sdpdivisi), sdpsubdivisi = VALUES(sdpsubdivisi), sdpcatatan = VALUES(sdpcatatan), sdpaktif = VALUES(sdpaktif), sdpinputuser = VALUES(sdpinputuser), sdpinputtgl = VALUES(sdpinputtgl), sdpmodifikasiuser = VALUES(sdpmodifikasiuser), sdpmodifikasitgl = VALUES(sdpmodifikasitgl), sdpcustomtext1 = VALUES(sdpcustomtext1), sdpcustomtext2 = VALUES(sdpcustomtext2), sdpcustomtext3 = VALUES(sdpcustomtext3), sdpcustomtext4 = VALUES(sdpcustomtext4), sdpcustomtext5 = VALUES(sdpcustomtext5), sdpcustomint1 = VALUES(sdpcustomint1), sdpcustomint2 = VALUES(sdpcustomint2), sdpcustomint3 = VALUES(sdpcustomint3), sdpcustomdbl1 = VALUES(sdpcustomdbl1), sdpcustomdbl2 = VALUES(sdpcustomdbl2), sdpcustomdbl3 = VALUES(sdpcustomdbl3), sdpcustomdate1 = VALUES(sdpcustomdate1), sdpcustomdate2 = VALUES(sdpcustomdate2), sdpcustomdate3 = VALUES(sdpcustomdate3), sdpindexbarcode = VALUES(sdpindexbarcode)
```

```sql
DELETE FROM M1_Subdepartment WHERE sdpkode = '{idtransaksi}'
```

```sql
SELECT sdp.sdpkode, sdp.sdpnama, sdp.sdpdepartemen, sdp.sdpdivisi, sdp.sdpsubdivisi, sdp.sdpcatatan, sdp.sdpaktif, sdp.sdpinputuser, sdp.sdpinputtgl, sdp.sdpmodifikasiuser, sdp.sdpmodifikasitgl, sdp.sdpcustomtext1, sdp.sdpcustomtext2, sdp.sdpcustomtext3, sdp.sdpcustomtext4, sdp.sdpcustomtext5, sdp.sdpcustomint1, sdp.sdpcustomint2, sdp.sdpcustomint3, sdp.sdpcustomdbl1, sdp.sdpcustomdbl2, sdp.sdpcustomdbl3, sdp.sdpcustomdate1, sdp.sdpcustomdate2, sdp.sdpcustomdate3, dp.dpnama as sdpdepartemennama, d.dnama as sdpdivisinama, sd.sdnama as sdpsubdivisinama, u1.unama as sdpinputusernama, u2.unama as sdpmodifikasiusernama, sdp.sdpindexbarcode FROM m1_subdepartment sdp LEFT JOIN m1_department dp ON sdp.sdpdepartemen = dp.dpkode LEFT JOIN m1_subdivision sd ON sdp.sdpsubdivisi = sd.sdkode LEFT JOIN m1_division d ON sdp.sdpdivisi = d.dkode LEFT JOIN m0_user u1 ON sdp.sdpinputuser = u1.userid LEFT JOIN m0_user u2 ON sdp.sdpmodifikasiuser = u2.userid
```

```sql
SELECT COUNT(sdpkode) FROM M1_Subdepartment WHERE sdpkode='{idtransaksi}'
```

```sql
SELECT sdp.sdpkode as sdpkode, sdp.sdpnama as sdpnama, 'Item' as sumber, i.bkode as idterkait FROM m1_item i JOIN m1_subdepartment sdp ON i.bsubdepartemen = sdp.sdpkode AND sdp.sdpkode = 'valkode' GROUP BY sdp.sdpkode, i.bid
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_subdepartment_history.vb`

```sql
INSERT INTO M1_Subdepartment_history(SELECT 0, Subdepartment.* FROM M1_Subdepartment Subdepartment WHERE Subdepartment.sdpkode = '{idtransaksi}')
```

```sql
SELECT sdp.sdpidhistory, sdp.sdpkode, sdp.sdpnama, sdp.sdpdepartemen, sdp.sdpdivisi, sdp.sdpsubdivisi, sdp.sdpcatatan, sdp.sdpaktif, sdp.sdpinputuser, sdp.sdpinputtgl, sdp.sdpmodifikasiuser, sdp.sdpmodifikasitgl, sdp.sdpcustomtext1, sdp.sdpcustomtext2, sdp.sdpcustomtext3, sdp.sdpcustomtext4, sdp.sdpcustomtext5, sdp.sdpcustomint1, sdp.sdpcustomint2, sdp.sdpcustomint3, sdp.sdpcustomdbl1, sdp.sdpcustomdbl2, sdp.sdpcustomdbl3, sdp.sdpcustomdate1, sdp.sdpcustomdate2, sdp.sdpcustomdate3, dp.dpnama as sdpdepartemennama, d.dnama as sdpdivisinama, sd.sdnama as sdpsubdivisinama, u1.unama as sdpinputusernama, u2.unama as sdpmodifikasiusernama, sdp.sdpindexbarcode FROM m1_subdepartment_history sdp LEFT JOIN m1_department dp ON sdp.sdpdepartemen = dp.dpkode LEFT JOIN m1_subdivision sd ON sdp.sdpsubdivisi = sd.sdkode LEFT JOIN m1_division d ON sdp.sdpdivisi = d.dkode LEFT JOIN m0_user u1 ON sdp.sdpinputuser = u1.userid LEFT JOIN m0_user u2 ON sdp.sdpmodifikasiuser = u2.userid
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_subdistrict.vb`

```sql
SELECT COUNT(sdkode) FROM M1_Subdistrict WHERE sdkode ='{dataUtama_0}'
```

```sql
Update M1_Subdistrict set sdnama = '{FixQuotes_dataUtama_1}', sdcatatan = '{FixQuotes_dataUtama_2}', sdaktif = {dataUtama_3}, sdmodifikasiuser = {dataUtama_6}, sdmodifikasitgl = NOW(), sdnegara = '{FixQuotes_dataUtama_8}', sdprov = '{FixQuotes_dataUtama_9}', sdkab = '{FixQuotes_dataUtama_10}' where sdkode = '{dataUtama_0}'
```

```sql
Insert into M1_Subdistrict (sdkode, sdnama, sdcatatan, sdaktif, sdinputuser, sdinputtgl, sdmodifikasiuser, sdmodifikasitgl, sdnegara, sdprov, sdkab) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00','{FixQuotes_dataUtama_8}','{FixQuotes_dataUtama_9}','{FixQuotes_dataUtama_10}')
```

```sql
DELETE FROM M1_Subdistrict WHERE sdkode = '{idtransaksi}'
```

```sql
SELECT sd.*, ci.cnama AS sdkabnama, p.pnama AS sdprovnama, co.cnama AS sdnegaranama FROM m1_subdistrict sd LEFT JOIN m1_city ci ON (sd.sdkab = ci.ckode) LEFT JOIN m1_province p ON (sd.sdprov = p.pkode) LEFT JOIN m1_country co ON (sd.sdnegara = co.ckode)
```

```sql
SELECT COUNT(sdkode) FROM m1_subdistrict WHERE sdkode='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_subdivision.vb`

```sql
SELECT COUNT(sdkode) FROM M1_Subdivision WHERE sdkode='{dataUtama_0}'
```

```sql
Update M1_Subdivision set sddivisi = '{FixQuotes_dataUtama_1}', sdnama = '{FixQuotes_dataUtama_2}', sdcatatan = '{FixQuotes_dataUtama_3}', sdaktif = {dataUtama_4}, sdmodifikasiuser = {dataUtama_7}, sdmodifikasitgl = NOW(), sdindexbarcode = '{FixQuotes_dataUtama_9}' where sdkode = '{dataUtama_0}'
```

```sql
Insert into M1_Subdivision (sdkode, sddivisi, sdnama, sdcatatan, sdaktif, sdinputuser, sdinputtgl, sdmodifikasiuser, sdmodifikasitgl, sdindexbarcode) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', {dataUtama_4}, {dataUtama_5}, NOW(), {dataUtama_7}, '1971-01-01 00:00:00', '{FixQuotes_dataUtama_9}')
```

```sql
DELETE FROM M1_Subdivision WHERE sdkode = '{idtransaksi}'
```

```sql
select `sd`.`sdkode` AS `sdkode`,`sd`.`sddivisi` AS `sddivisi`,`sd`.`sdnama` AS `sdnama`,`sd`.`sdcatatan` AS `sdcatatan`,`sd`.`sdaktif` AS `sdaktif`,`sd`.`sdinputuser` AS `sdinputuser`,`sd`.`sdinputtgl` AS `sdinputtgl`,`sd`.`sdmodifikasiuser` AS `sdmodifikasiuser`,`sd`.`sdmodifikasitgl` AS `sdmodifikasitgl`,`d`.`dnama` AS `sddivisinama`, sd.sdindexbarcode from (`m1_subdivision` `sd` left join `m1_division` `d` on((`sd`.`sddivisi` = `d`.`dkode`)))
```

```sql
SELECT COUNT(sdkode) FROM m1_subdivision WHERE sdkode='{idtransaksi}'
```

```sql
DELETE FROM M1_Subdivision
```

```sql
Insert into M1_Subdivision(sdkode, sddivisi, sdnama, sdcatatan, sdaktif, sdinputuser, sdinputtgl, sdmodifikasiuser, sdmodifikasitgl) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_subdivision_history.vb`

```sql
INSERT INTO m1_subdivision_history(SELECT 0, sd.* FROM m1_subdivision sd WHERE sd.sdkode = '{idtransaksi}')
```

```sql
select `sd`.`sdidhistory` AS `sdidhistory`,`sd`.`sdkode` AS `sdkode`,`sd`.`sddivisi` AS `sddivisi`,`sd`.`sdnama` AS `sdnama`,`sd`.`sdcatatan` AS `sdcatatan`,`sd`.`sdaktif` AS `sdaktif`,`sd`.`sdinputuser` AS `sdinputuser`,`sd`.`sdinputtgl` AS `sdinputtgl`,`sd`.`sdmodifikasiuser` AS `sdmodifikasiuser`,`sd`.`sdmodifikasitgl` AS `sdmodifikasitgl`,`d`.`dnama` AS `sddivisinama`,`ui`.`unama` AS `sdinputusernama`,`um`.`unama` AS `sdmodifikasiusernama`, sd.sdindexbarcode from (((`m1_subdivision_history` `sd` left join `m1_division` `d` on((`sd`.`sddivisi` = `d`.`dkode`))) LEFT JOIN `m0_user` `ui` ON ((`sd`.`sdinputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`sd`.`sdmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_supplier_category.vb`

```sql
SELECT COUNT(sckode) FROM M1_Supplier_Category WHERE sckode ='{dataUtama_0}'
```

```sql
Update M1_Supplier_Category set scnama = '{FixQuotes_dataUtama_1}', sccatatan = '{FixQuotes_dataUtama_2}', scaktif = {dataUtama_3}, scmodifikasiuser = {dataUtama_6}, scmodifikasitgl = NOW() where sckode = '{dataUtama_0}'
```

```sql
Insert into M1_Supplier_Category (sckode, scnama, sccatatan, scaktif, scinputuser, scinputtgl, scmodifikasiuser, scmodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Supplier_Category WHERE sckode = '{idtransaksi}'
```

```sql
SELECT COUNT(sckode) FROM m1_Supplier_category WHERE sckode='{idtransaksi}'
```

```sql
SELECT cc.sckode, cc.scnama, 'Contact' as sumber, c.kid as idterkait FROM m1_contact c JOIN m1_Supplier_category cc ON c.kkategoriSupplier=cc.sckode WHERE cc.sckode='valkode'
```

```sql
DELETE FROM M1_Supplier_Category
```

```sql
Insert into M1_Supplier_Category(sckode, scnama, sccatatan, scaktif, scinputuser, scinputtgl, scmodifikasiuser, scmodifikasitgl) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_supplier_category_history.vb`

```sql
INSERT INTO m1_supplier_category_history(SELECT 0, sc.* FROM m1_supplier_category sc WHERE sc.sckode = '{idtransaksi}')
```

```sql
select `sc`.`scidhistory` AS `scidhistory`,`sc`.`sckode` AS `sckode`,`sc`.`scnama` AS `scnama`,`sc`.`sccatatan` AS `sccatatan`,`sc`.`scaktif` AS `scaktif`,`sc`.`scinputuser` AS `scinputuser`,`sc`.`scinputtgl` AS `scinputtgl`,`sc`.`scmodifikasiuser` AS `scmodifikasiuser`,`sc`.`scmodifikasitgl` AS `scmodifikasitgl`,`ui`.`unama` AS `scinputusernama`,`um`.`unama` AS `scmodifikasiusernama` from ((`m1_supplier_category_history` `sc` LEFT JOIN `m0_user` `ui` ON ((`sc`.`scinputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`sc`.`scmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_tax.vb`

```sql
SELECT COUNT(tkode) FROM M1_Tax WHERE tkode ='{dataUtama_0}'
```

```sql
Update M1_Tax set tnama = '{FixQuotes_dataUtama_1}', tnilai = '{FixDouble_dataUtama_2}', tcatatan = '{FixQuotes_dataUtama_3}', taktif = {dataUtama_4}, tmodifikasiuser = {dataUtama_7}, tmodifikasitgl = NOW(), takunbeli = '{FixQuotes_dataUtama_9}', takunjual = '{FixQuotes_dataUtama_10}' where tkode = '{dataUtama_0}'
```

```sql
Insert into M1_Tax (tkode, tnama, tnilai, tcatatan, taktif, tinputuser, tinputtgl, tmodifikasiuser, tmodifikasitgl, takunbeli, takunjual) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixDouble_dataUtama_2}', '{FixQuotes_dataUtama_3}', {dataUtama_4}, {dataUtama_5}, NOW(), {dataUtama_7}, '1971-01-01 00:00:00', '{FixQuotes_dataUtama_9}', '{FixQuotes_dataUtama_10}')
```

```sql
DELETE FROM M1_Tax WHERE tkode = '{idtransaksi}'
```

```sql
SELECT t.tkode, t.tnama, t.tnilai, t.tcatatan, t.taktif, t.tinputuser, t.tinputtgl, t.tmodifikasiuser, t.tmodifikasitgl, t.takunbeli, c.cnama as takunbelinama, t.takunjual, c2.cnama as takunjualnama FROM `m1_tax` t LEFT JOIN m1_coa c ON t.takunbeli = c.cnomor LEFT JOIN m1_coa c2 ON t.takunjual = c2.cnomor
```

```sql
SELECT COUNT(tkode) FROM m1_tax WHERE tkode='{idtransaksi}'
```

```sql
DELETE FROM M1_Tax
```

```sql
Insert into M1_Tax(tkode, tnama, tnilai, tcatatan, taktif, tinputuser, tinputtgl, tmodifikasiuser, tmodifikasitgl) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_tax_history.vb`

```sql
INSERT INTO m1_tax_history(SELECT 0, t.* FROM m1_tax t WHERE t.tkode = '{idtransaksi}')
```

```sql
select `t`.`tidhistory` AS `tidhistory`,`t`.`tkode` AS `tkode`,`t`.`tnama` AS `tnama`,`t`.`tnilai` AS `tnilai`,`t`.`tcatatan` AS `tcatatan`,`t`.`taktif` AS `taktif`,`t`.`tinputuser` AS `tinputuser`,`t`.`tinputtgl` AS `tinputtgl`,`t`.`tmodifikasiuser` AS `tmodifikasiuser`,`t`.`tmodifikasitgl` AS `tmodifikasitgl`,`ui`.`unama` AS `tinputusernama`,`um`.`unama` AS `tmodifikasiusernama` from ((`m1_tax_history` `t` LEFT JOIN `m0_user` `ui` ON ((`t`.`tinputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`t`.`tmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_terms.vb`

```sql
SELECT COUNT(trkode) FROM M1_Terms WHERE trkode ='{dataUtama_0}'
```

```sql
Update M1_Terms set trnama = '{FixQuotes_dataUtama_1}', trdiskon1 = '{FixDouble_dataUtama_2}', trharidiskon1 = {dataUtama_3}, trdiskon2 = '{FixDouble_dataUtama_4}', trharidiskon2 = {dataUtama_5}, trdenda = '{FixDouble_dataUtama_6}', trharijatuhtempo = {dataUtama_7}, trdendaper = {dataUtama_8}, trcatatan = '{FixQuotes_dataUtama_9}', traktif = {dataUtama_10}, trmodifikasiuser = {dataUtama_13}, trmodifikasitgl = NOW() where trkode = '{dataUtama_0}'
```

```sql
Insert into M1_Terms (trkode, trnama, trdiskon1, trharidiskon1, trdiskon2, trharidiskon2, trdenda, trharijatuhtempo, trdendaper, trcatatan, traktif, trinputuser, trinputtgl, trmodifikasiuser, trmodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixDouble_dataUtama_2}', {dataUtama_3}, '{FixDouble_dataUtama_4}', {dataUtama_5}, '{FixDouble_dataUtama_6}', {dataUtama_7}, {dataUtama_8}, '{FixQuotes_dataUtama_9}', {dataUtama_10}, {dataUtama_11}, NOW(), {dataUtama_13}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Terms WHERE trkode = '{idtransaksi}'
```

```sql
select `tr`.`trkode` AS `trkode`,`tr`.`trnama` AS `trnama`,`tr`.`trdiskon1` AS `trdiskon1`,`tr`.`trharidiskon1` AS `trharidiskon1`,`tr`.`trdiskon2` AS `trdiskon2`,`tr`.`trharidiskon2` AS `trharidiskon2`,`tr`.`trdenda` AS `trdenda`,`tr`.`trharijatuhtempo` AS `trharijatuhtempo`,`tr`.`trdendaper` AS `trdendaper`,`tr`.`trcatatan` AS `trcatatan`,`tr`.`traktif` AS `traktif`,`tr`.`trinputuser` AS `trinputuser`,`tr`.`trinputtgl` AS `trinputtgl`,`tr`.`trmodifikasiuser` AS `trmodifikasiuser`,`tr`.`trmodifikasitgl` AS `trmodifikasitgl`,(case `tr`.`trdendaper` when 0 then 'Month' when 1 then 'Week' when 2 then 'Day' end) AS `trdendapernama` from `m1_terms` `tr`
```

```sql
SELECT COUNT(trkode) FROM m1_terms WHERE trkode='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_terms_history.vb`

```sql
INSERT INTO m1_terms_history(SELECT 0, t.* FROM m1_terms t WHERE t.trkode = '{idtransaksi}')
```

```sql
select `tr`.`tridhistory` AS `tridhistory`,`tr`.`trkode` AS `trkode`,`tr`.`trnama` AS `trnama`,`tr`.`trdiskon1` AS `trdiskon1`,`tr`.`trharidiskon1` AS `trharidiskon1`,`tr`.`trdiskon2` AS `trdiskon2`,`tr`.`trharidiskon2` AS `trharidiskon2`,`tr`.`trdenda` AS `trdenda`,`tr`.`trharijatuhtempo` AS `trharijatuhtempo`,`tr`.`trdendaper` AS `trdendaper`,`tr`.`trcatatan` AS `trcatatan`,`tr`.`traktif` AS `traktif`,`tr`.`trinputuser` AS `trinputuser`,`tr`.`trinputtgl` AS `trinputtgl`,`tr`.`trmodifikasiuser` AS `trmodifikasiuser`,`tr`.`trmodifikasitgl` AS `trmodifikasitgl`,(case `tr`.`trdendaper` when 0 then 'Month' when 1 then 'Week' when 2 then 'Day' end) AS `trdendapernama`,`ui`.`unama` AS `trinputusernama`,`um`.`unama` AS `trmodifikasiusernama` from ((`m1_terms_history` `tr` LEFT JOIN `m0_user` `ui` ON ((`tr`.`trinputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`tr`.`trmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_transaction_note.vb`

```sql
SELECT COUNT(tnkode) FROM M1_Transaction_Note WHERE tnsumber ='{dataUtama_0}' AND tnkode='{dataUtama_1}'
```

```sql
Update M1_Transaction_Note set tncatatan = '{FixQuotes_dataUtama_2}', tnaktif = {dataUtama_3}, tnmodifikasiuser = {dataUtama_6}, tnmodifikasitgl = NOW() WHERE tnsumber ='{dataUtama_0}' AND tnkode='{dataUtama_1}'
```

```sql
Insert into M1_Transaction_Note (tnsumber, tnkode, tncatatan, tnaktif, tninputuser, tninputtgl, tnmodifikasiuser, tnmodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Transaction_Note WHERE tnsumber = '{sumber}' AND tnkode = '{kode}'
```

```sql
SELECT COUNT(tnsumber) FROM m1_transaction_note WHERE tnsumber='{sumber}' AND tnkode='{kode}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_transaction_note_detail.vb`

```sql
SELECT COUNT(tndkode) FROM M1_Transaction_Note_Detail WHERE tndkode='{FixQuotes_dataUtama_0}'
```

```sql
Update M1_Transaction_Note_Detail set tndsumber = '{FixQuotes_dataUtama_1}', tndcatatan = '{FixQuotes_dataUtama_2}', tndaktif = {dataUtama_3}, tndmodifikasiuser = {dataUtama_6}, tndmodifikasitgl = NOW() where tndkode = '{dataUtama_0}'
```

```sql
Insert into M1_Transaction_Note_Detail (tndkode, tndsumber, tndcatatan, tndaktif, tndinputuser, tndinputtgl, tndmodifikasiuser, tndmodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Transaction_Note_Detail WHERE tndkode = '{idtransaksi}'
```

```sql
SELECT COUNT(tndkode) FROM M1_Transaction_Note_Detail WHERE tndkode='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_transaction_note_detail_history.vb`

```sql
INSERT INTO m1_transaction_note_detail_history(SELECT 0, tnd.* FROM m1_transaction_note_detail tnd WHERE tnd.tndkode = '{idtransaksi}')
```

```sql
select `tnd`.`tndidhistory` AS `tndidhistory`,`tnd`.`tndkode` AS `tndkode`,`tnd`.`tndsumber` AS `tndsumber`,`tnd`.`tndcatatan` AS `tndcatatan`,`tnd`.`tndaktif` AS `tndaktif`,`tnd`.`tndinputuser` AS `tndinputuser`,`tnd`.`tndinputtgl` AS `tndinputtgl`,`tnd`.`tndmodifikasiuser` AS `tndmodifikasiuser`,`tnd`.`tndmodifikasitgl` AS `tndmodifikasitgl`,`ui`.`unama` AS `tndinputusernama`,`um`.`unama` AS `tndmodifikasiusernama` from ((`m1_transaction_note_detail_history` `tnd` LEFT JOIN `m0_user` `ui` ON ((`tnd`.`tndinputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`tnd`.`tndmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_transaction_note_history.vb`

```sql
INSERT INTO m1_transaction_note_history(SELECT 0, tn.* FROM m1_transaction_note tn WHERE tn.tnsumber = '{sumber}' AND tn.tnkode = '{idtransaksi}')
```

```sql
select `tn`.`tnidhistory` AS `tnidhistory`,`tn`.`tnkode` AS `tnkode`,`tn`.`tnsumber` AS `tnsumber`,`tn`.`tncatatan` AS `tncatatan`,`tn`.`tnaktif` AS `tnaktif`,`tn`.`tninputuser` AS `tninputuser`,`tn`.`tninputtgl` AS `tninputtgl`,`tn`.`tnmodifikasiuser` AS `tnmodifikasiuser`,`tn`.`tnmodifikasitgl` AS `tnmodifikasitgl`,`ui`.`unama` AS `tninputusernama`,`um`.`unama` AS `tnmodifikasiusernama` from ((`m1_transaction_note_history` `tn` LEFT JOIN `m0_user` `ui` ON ((`tn`.`tninputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`tn`.`tnmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_trm.vb`

```sql
SELECT COUNT(trmkode) FROM M1_trm WHERE trmkode ='{dataUtama_0}'
```

```sql
Update M1_trm set trmnama = '{FixQuotes_dataUtama_1}', trmcatatan = '{FixQuotes_dataUtama_2}', trmaktif = {dataUtama_3}, trmmodifikasiuser = {dataUtama_6}, trmmodifikasitgl = NOW() where trmkode = '{dataUtama_0}'
```

```sql
Insert into M1_trm (trmkode, trmnama, trmcatatan, trmaktif, trminputuser, trminputtgl, trmmodifikasiuser, trmmodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_trm WHERE trmkode = '{idtransaksi}'
```

```sql
SELECT COUNT(trmkode) FROM m1_trm WHERE trmkode='{idtransaksi}'
```

```sql
DELETE FROM M1_trm
```

```sql
Insert into M1_trm(trmkode, trmnama, trmcatatan, trmaktif, trminputuser, trminputtgl, trmmodifikasiuser, trmmodifikasitgl) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_type_sa.vb`

```sql
SELECT COUNT(tsakode) FROM M1_Type_Sa WHERE tsakode ='{dataUtama_0}'
```

```sql
Update M1_Type_Sa set tsanama = '{FixQuotes_dataUtama_1}', tsarek = '{FixQuotes_dataUtama_2}', tsacatatan = '{FixQuotes_dataUtama_3}', tsaaktif = {dataUtama_4}, tsamodifikasiuser = {dataUtama_7}, tsamodifikasitgl = NOW() where tsakode = '{dataUtama_0}'
```

```sql
Insert into M1_Type_Sa (tsakode, tsanama, tsarek, tsacatatan, tsaaktif, tsainputuser, tsainputtgl, tsamodifikasiuser, tsamodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', {dataUtama_4}, {dataUtama_5}, NOW(), {dataUtama_7}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Type_Sa WHERE tsakode = '{idtransaksi}'
```

```sql
select `tsa`.`tsakode` AS `tsakode`,`tsa`.`tsanama` AS `tsanama`,`tsa`.`tsarek` AS `tsarek`,`tsa`.`tsacatatan` AS `tsacatatan`,`tsa`.`tsaaktif` AS `tsaaktif`,`tsa`.`tsainputuser` AS `tsainputuser`,`tsa`.`tsainputtgl` AS `tsainputtgl`,`tsa`.`tsamodifikasiuser` AS `tsamodifikasiuser`,`tsa`.`tsamodifikasitgl` AS `tsamodifikasitgl`,`c`.`cnama` AS `tsareknama` from (`m1_type_sa` `tsa` left join `m1_coa` `c` on((`tsa`.`tsarek` = `c`.`cnomor`)))
```

```sql
SELECT COUNT(tsakode) FROM m1_type_sa WHERE tsakode='{idtransaksi}'
```

```sql
select `tsa`.`tsakode` AS `tsakode`,`tsa`.`tsanama` AS `tsanama`,'M3 SA' AS `sumber`,`sa`.`sanotransaksi` AS `idterkait` from (`m3_sa` `sa` join `m1_type_sa` `tsa` on((`sa`.`sajenis` = `tsa`.`tsakode`))) where tsa.tsakode='valkode'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_type_sa_history.vb`

```sql
INSERT INTO m1_type_sa_history(SELECT 0, tsa.* FROM m1_type_sa tsa WHERE tsa.tsakode = '{idtransaksi}')
```

```sql
select `tsa`.`tsaidhistory` AS `tsaidhistory`,`tsa`.`tsakode` AS `tsakode`,`tsa`.`tsanama` AS `tsanama`,`tsa`.`tsarek` AS `tsarek`,`tsa`.`tsacatatan` AS `tsacatatan`,`tsa`.`tsaaktif` AS `tsaaktif`,`tsa`.`tsainputuser` AS `tsainputuser`,`tsa`.`tsainputtgl` AS `tsainputtgl`,`tsa`.`tsamodifikasiuser` AS `tsamodifikasiuser`,`tsa`.`tsamodifikasitgl` AS `tsamodifikasitgl`,`c`.`cnama` AS `tsareknama`,`ui`.`unama` AS `tsainputusernama`,`um`.`unama` AS `tsamodifikasiusernama` from (((`m1_type_sa_history` `tsa` left join `m1_coa` `c` on((`tsa`.`tsarek` = `c`.`cnomor`))) LEFT JOIN `m0_user` `ui` ON ((`tsa`.`tsainputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`tsa`.`tsamodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_unit.vb`

```sql
SELECT COUNT(ukode) FROM M1_Unit WHERE ukode ='{dataUtama_0}'
```

```sql
Update M1_Unit set unama = '{FixQuotes_dataUtama_1}', unilai = '{FixDouble_dataUtama_2}', uketerangan = '{FixQuotes_dataUtama_3}', uaktif = {dataUtama_4}, uindexbarcode = '{FixQuotes_dataUtama_5}', umodifikasiuser = {dataUtama_8}, umodifikasitgl = NOW() where ukode = '{dataUtama_0}'
```

```sql
Insert into M1_Unit (ukode, unama, unilai, uketerangan, uaktif, uindexbarcode, uinputuser, uinputtgl, umodifikasiuser, umodifikasitgl) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixDouble_dataUtama_2}', '{FixQuotes_dataUtama_3}', {dataUtama_4}, '{FixQuotes_dataUtama_5}', {dataUtama_6}, NOW(), {dataUtama_8}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M1_Unit WHERE ukode = '{idtransaksi}'
```

```sql
SELECT COUNT(ukode) FROM m1_unit WHERE ukode='{idtransaksi}'
```

```sql
DELETE FROM M1_Unit
```

```sql
Insert into M1_Unit(ukode, unama, unilai, uketerangan, uaktif, uindexbarcode, uinputuser, uinputtgl, umodifikasiuser, umodifikasitgl) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_unit_history.vb`

```sql
INSERT INTO m1_unit_history(SELECT 0, u.* FROM m1_unit u WHERE u.ukode = '{idtransaksi}')
```

```sql
select `u`.`uidhistory` AS `uidhistory`,`u`.`ukode` AS `ukode`,`u`.`unama` AS `unama`,`u`.`unilai` AS `unilai`,`u`.`uketerangan` AS `uketerangan`,`u`.`uaktif` AS `uaktif`,`u`.`uindexbarcode` AS `uindexbarcode`,`u`.`uinputuser` AS `uinputuser`,`u`.`uinputtgl` AS `uinputtgl`,`u`.`umodifikasiuser` AS `umodifikasiuser`,`u`.`umodifikasitgl` AS `umodifikasitgl`,`ui`.`unama` AS `uinputusernama`,`um`.`unama` AS `umodifikasiusernama` from ((`m1_unit_history` `u` LEFT JOIN `m0_user` `ui` ON ((`u`.`uinputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`u`.`umodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_vendor.vb`

```sql
Insert into M1_Vendor(vkode, vnama, vcatatan, vaktif, vinputuser, vinputtgl, vmodifikasiuser, vmodifikasitgl, vcustomtext1, vcustomtext2, vcustomtext3, vcustomtext4, vcustomtext5, vcustomint1, vcustomint2, vcustomint3, vcustomdbl1, vcustomdbl2, vcustomdbl3, vcustomdate1, vcustomdate2, vcustomdate3, vindexbarcode) values{strValue2_ToString} ON DUPLICATE KEY UPDATE vnama = VALUES(vnama), vcatatan = VALUES(vcatatan), vaktif = VALUES(vaktif), vmodifikasiuser = VALUES(vmodifikasiuser), vmodifikasitgl = NOW(), vcustomtext1 = VALUES(vcustomtext1), vcustomtext2 = VALUES(vcustomtext2), vcustomtext3 = VALUES(vcustomtext3), vcustomtext4 = VALUES(vcustomtext4), vcustomtext5 = VALUES(vcustomtext5), vcustomint1 = VALUES(vcustomint1), vcustomint2 = VALUES(vcustomint2), vcustomint3 = VALUES(vcustomint3), vcustomdbl1 = VALUES(vcustomdbl1), vcustomdbl2 = VALUES(vcustomdbl2), vcustomdbl3 = VALUES(vcustomdbl3), vcustomdate1 = VALUES(vcustomdate1), vcustomdate2 = VALUES(vcustomdate2), vcustomdate3 = VALUES(vcustomdate3), vindexbarcode = VALUES(vindexbarcode)
```

```sql
DELETE FROM M1_Vendor WHERE vkode = '{idtransaksi}'
```

```sql
select `v`.`vkode` AS `vkode`,`v`.`vnama` AS `vnama`,`v`.`vcatatan` AS `vcatatan`,`v`.`vaktif` AS `vaktif`,`v`.`vinputuser` AS `vinputuser`,`v`.`vinputtgl` AS `vinputtgl`,`v`.`vmodifikasiuser` AS `vmodifikasiuser`,`v`.`vmodifikasitgl` AS `vmodifikasitgl`,`v`.`vcustomtext1` AS `vcustomtext1`,`v`.`vcustomtext2` AS `vcustomtext2`,`v`.`vcustomtext3` AS `vcustomtext3`,`v`.`vcustomtext4` AS `vcustomtext4`,`v`.`vcustomtext5` AS `vcustomtext5`,`v`.`vcustomint1` AS `vcustomint1`,`v`.`vcustomint2` AS `vcustomint2`,`v`.`vcustomint3` AS `vcustomint3`,`v`.`vcustomdbl1` AS `vcustomdbl1`,`v`.`vcustomdbl2` AS `vcustomdbl2`,`v`.`vcustomdbl3` AS `vcustomdbl3`,`v`.`vcustomdate1` AS `vcustomdate1`,`v`.`vcustomdate2` AS `vcustomdate2`,`v`.`vcustomdate3` AS `vcustomdate3`,`v`.`vindexbarcode` AS `vindexbarcode`,`u1`.`unama` AS `vinputusernama`,`u2`.`unama` AS `vmodifikasiusernama` from ((`M1_Vendor` `v` left join `m0_user` `u1` on((`v`.`vinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`v`.`vmodifikasiuser` = `u2`.`userid`)))
```

```sql
SELECT COUNT(vkode) FROM M1_Vendor WHERE vkode='{idtransaksi}'
```

```sql
select v.vkode AS vkode, v.vnama AS vnama, s.skode AS sumber, CONCAT('Setting : ', s.smodule, ' - ', s.sgrup, ' - ', s.skode) AS idterkait from m0_setting s join M1_Vendor v on (s.smodule = 0 AND s.sgrup = 'options' AND s.skode = 'KelasProduk' AND s.snilai = v.vkode) WHERE v.vkode = 'valkode' union all SELECT v.vkode as vkode, v.vnama as vnama, 'Item' as sumber, i.bkode as idterkait FROM m1_item i JOIN M1_Vendor v ON i.bkelasproduk = v.vkode AND v.vkode = 'valkode' GROUP BY v.vkode, i.bid UNION ALL SELECT v.vkode as vkode, v.vnama as vnama, 'POS Type' as sumber, ptv.tipepos as idterkait FROM m_12_pos_type_class_product ptv JOIN M1_Vendor v ON ptv.kelasproduk = v.vkode AND v.vkode = 'valkode' GROUP BY v.vkode, ptv.tipepos
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_vendor_history.vb`

```sql
INSERT INTO M1_Vendor_history(SELECT 0, class_product.* FROM M1_Vendor class_product WHERE class_product.vkode = '{idtransaksi}')
```

```sql
select `v`.`vidhistory` AS `vidhistory`,`v`.`vkode` AS `vkode`,`v`.`vnama` AS `vnama`,`v`.`vcatatan` AS `vcatatan`,`v`.`vaktif` AS `vaktif`,`v`.`vinputuser` AS `vinputuser`,`v`.`vinputtgl` AS `vinputtgl`,`v`.`vmodifikasiuser` AS `vmodifikasiuser`,`v`.`vmodifikasitgl` AS `vmodifikasitgl`,`v`.`vcustomtext1` AS `vcustomtext1`,`v`.`vcustomtext2` AS `vcustomtext2`,`v`.`vcustomtext3` AS `vcustomtext3`,`v`.`vcustomtext4` AS `vcustomtext4`,`v`.`vcustomtext5` AS `vcustomtext5`,`v`.`vcustomint1` AS `vcustomint1`,`v`.`vcustomint2` AS `vcustomint2`,`v`.`vcustomint3` AS `vcustomint3`,`v`.`vcustomdbl1` AS `vcustomdbl1`,`v`.`vcustomdbl2` AS `vcustomdbl2`,`v`.`vcustomdbl3` AS `vcustomdbl3`,`v`.`vcustomdate1` AS `vcustomdate1`,`v`.`vcustomdate2` AS `vcustomdate2`,`v`.`vcustomdate3` AS `vcustomdate3`,`v`.`vindexbarcode` AS `vindexbarcode`,`u1`.`unama` AS `vinputusernama`,`u2`.`unama` AS `vmodifikasiusernama` from ((`M1_Vendor_history` `v` left join `m0_user` `u1` on((`v`.`vinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`v`.`vmodifikasiuser` = `u2`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_village.vb`

```sql
SELECT COUNT(vkode) FROM M1_Village WHERE vkode ='{dataUtama_0}'
```

```sql
Update M1_Village set vnama = '{FixQuotes_dataUtama_1}', vcatatan = '{FixQuotes_dataUtama_2}', vaktif = {dataUtama_3}, vmodifikasiuser = {dataUtama_6}, vmodifikasitgl = NOW(), vnegara = '{FixQuotes_dataUtama_8}', vprov = '{FixQuotes_dataUtama_9}', vkab = '{FixQuotes_dataUtama_10}', vkec = '{FixQuotes_dataUtama_11}' where vkode = '{dataUtama_0}'
```

```sql
Insert into M1_Village (vkode, vnama, vcatatan, vaktif, vinputuser, vinputtgl, vmodifikasiuser, vmodifikasitgl, vnegara, vprov, vkab, vkec) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00', '{FixQuotes_dataUtama_8}', '{FixQuotes_dataUtama_9}', '{FixQuotes_dataUtama_10}', '{FixQuotes_dataUtama_11}')
```

```sql
DELETE FROM M1_Village WHERE vkode = '{idtransaksi}'
```

```sql
SELECT v.*, sd.sdnama AS vkecnama, ci.cnama AS vkabnama, p.pnama AS vprovnama, co.cnama AS vnegaranama FROM m1_village v LEFT JOIN m1_subdistrict sd ON (v.vkec = sd.sdkode) LEFT JOIN m1_city ci ON (v.vkab = ci.ckode) LEFT JOIN m1_province p ON (v.vprov = p.pkode) LEFT JOIN m1_country co ON (v.vnegara = co.ckode)
```

```sql
SELECT COUNT(vkode) FROM m1_village WHERE vkode='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_warehouse.vb`

```sql
SELECT COUNT(wkode) FROM M1_Warehouse WHERE wkode ='{dataUtama_0}'
```

```sql
Update M1_Warehouse set wnama = '{FixQuotes_dataUtama_1}', wdivisi = '{FixQuotes_dataUtama_2}', wlokasi = '{FixQuotes_dataUtama_3}', walamat1 = '{FixQuotes_dataUtama_4}', walamat2 = '{FixQuotes_dataUtama_5}', wkota = '{FixQuotes_dataUtama_6}', wkodepos = '{FixQuotes_dataUtama_7}', wnotelp = '{FixQuotes_dataUtama_8}', wnofax = '{FixQuotes_dataUtama_9}', wketerangan = '{FixQuotes_dataUtama_10}', waktif = {dataUtama_11}, wmodifikasiuser = {dataUtama_14}, wmodifikasitanggal = NOW(), wbookingstok = {dataUtama_16} where wkode = '{dataUtama_0}'
```

```sql
Insert into M1_Warehouse (wkode, wnama, wdivisi, wlokasi, walamat1, walamat2, wkota, wkodepos, wnotelp, wnofax, wketerangan, waktif, winputuser, winputtgl, wmodifikasiuser, wmodifikasitanggal, wbookingstok) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', '{FixQuotes_dataUtama_4}', '{FixQuotes_dataUtama_5}', '{FixQuotes_dataUtama_6}', '{FixQuotes_dataUtama_7}', '{FixQuotes_dataUtama_8}', '{FixQuotes_dataUtama_9}', '{FixQuotes_dataUtama_10}', {dataUtama_11}, {dataUtama_12}, NOW(), {dataUtama_14}, '1971-01-01 00:00:00', {dataUtama_16})
```

```sql
DELETE FROM M1_Warehouse WHERE wkode = '{idtransaksi}'
```

```sql
select `w`.`wkode` AS `wkode`,`w`.`wnama` AS `wnama`,`w`.`wdivisi` AS `wdivisi`,`w`.`wlokasi` AS `wlokasi`,`w`.`walamat1` AS `walamat1`,`w`.`walamat2` AS `walamat2`,`w`.`wkota` AS `wkota`,`w`.`wkodepos` AS `wkodepos`,`w`.`wnotelp` AS `wnotelp`,`w`.`wnofax` AS `wnofax`,`w`.`wketerangan` AS `wketerangan`,`w`.`waktif` AS `waktif`,`w`.`winputuser` AS `winputuser`,`w`.`winputtgl` AS `winputtgl`,`w`.`wmodifikasiuser` AS `wmodifikasiuser`,`w`.`wmodifikasitanggal` AS `wmodifikasitanggal`,`d`.`dnama` AS `wdivisinama`,`l`.`lnama` AS `wlokasinama`, w.wbookingstok from ((`m1_warehouse` `w` left join `m1_division` `d` on((`w`.`wdivisi` = `d`.`dkode`))) left join `m1_location` `l` on((`w`.`wlokasi` = `l`.`lkode`)))
```

```sql
SELECT COUNT(wkode) FROM m1_warehouse WHERE wkode='{idtransaksi}'
```

```sql
DELETE FROM M1_Warehouse
```

```sql
Insert into M1_Warehouse(wkode, wnama, wdivisi, wlokasi, walamat1, walamat2, wkota, wkodepos, wnotelp, wnofax, wketerangan, waktif, winputuser, winputtgl, wmodifikasiuser, wmodifikasitanggal, wbookingstok) values{strValue2_ToString}
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_warehouse_history.vb`

```sql
INSERT INTO m1_warehouse_history(SELECT 0, w.* FROM m1_warehouse w WHERE w.wkode = '{idtransaksi}')
```

```sql
select `w`.`widhistory` AS `widhistory`,`w`.`wkode` AS `wkode`,`w`.`wnama` AS `wnama`,`w`.`wdivisi` AS `wdivisi`,`w`.`wlokasi` AS `wlokasi`,`w`.`walamat1` AS `walamat1`,`w`.`walamat2` AS `walamat2`,`w`.`wkota` AS `wkota`,`w`.`wkodepos` AS `wkodepos`,`w`.`wnotelp` AS `wnotelp`,`w`.`wnofax` AS `wnofax`,`w`.`wketerangan` AS `wketerangan`,`w`.`waktif` AS `waktif`,`w`.`winputuser` AS `winputuser`,`w`.`winputtgl` AS `winputtgl`,`w`.`wmodifikasiuser` AS `wmodifikasiuser`,`w`.`wmodifikasitanggal` AS `wmodifikasitanggal`,`d`.`dnama` AS `wdivisinama`,`l`.`lnama` AS `wlokasinama`,`ui`.`unama` AS `winputusernama`,`um`.`unama` AS `wmodifikasiusernama`, w.wbookingstok from ((((`m1_warehouse_history` `w` left join `m1_division` `d` on((`w`.`wdivisi` = `d`.`dkode`))) left join `m1_location` `l` on((`w`.`wlokasi` = `l`.`lkode`))) LEFT JOIN `m0_user` `ui` ON ((`w`.`winputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`w`.`wmodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_working_estimate.vb`

```sql
SELECT COUNT(wekode) FROM M1_Working_Estimate WHERE wekode ='{dataUtama_0}'
```

```sql
Update M1_Working_Estimate set wenama = '{FixQuotes_dataUtama_1}', wecatatan = '{FixQuotes_dataUtama_2}', weaktif = {dataUtama_3}, wemodifikasiuser = {dataUtama_6}, wemodifikasitgl = NOW(), wecustomtext1 = '{FixQuotes_dataUtama_8}', wecustomtext2 = '{FixQuotes_dataUtama_9}', wecustomtext3 = '{FixQuotes_dataUtama_10}', wecustomtext4 = '{FixQuotes_dataUtama_11}', wecustomtext5 = '{FixQuotes_dataUtama_12}', wecustomint1 = {dataUtama_13}, wecustomint2 = {dataUtama_14}, wecustomint3 = {dataUtama_15}, wecustomdbl1 = '{FixDouble_dataUtama_16}', wecustomdbl2 = '{FixDouble_dataUtama_17}', wecustomdbl3 = '{FixDouble_dataUtama_18}', wecustomdate1 = '{FixQuotes_AsFormatTanggal_dataUtama_19}', wecustomdate2 = '{FixQuotes_AsFormatTanggal_dataUtama_20}', wecustomdate3 = '{FixQuotes_AsFormatTanggal_dataUtama_21}' where wekode = '{dataUtama_0}'
```

```sql
Insert into M1_Working_Estimate (wekode, wenama, wecatatan, weaktif, weinputuser, weinputtgl, wemodifikasiuser, wemodifikasitgl, wecustomtext1, wecustomtext2, wecustomtext3, wecustomtext4, wecustomtext5, wecustomint1, wecustomint2, wecustomint3, wecustomdbl1, wecustomdbl2, wecustomdbl3, wecustomdate1, wecustomdate2, wecustomdate3) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', {dataUtama_3}, {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00', '{FixQuotes_dataUtama_8}', '{FixQuotes_dataUtama_9}', '{FixQuotes_dataUtama_10}', '{FixQuotes_dataUtama_11}', '{FixQuotes_dataUtama_12}', {dataUtama_13}, {dataUtama_14}, {dataUtama_15}, '{FixDouble_dataUtama_16}', '{FixDouble_dataUtama_17}', '{FixDouble_dataUtama_18}', '{FixQuotes_AsFormatTanggal_dataUtama_19}', '{FixQuotes_AsFormatTanggal_dataUtama_20}', '{FixQuotes_AsFormatTanggal_dataUtama_21}')
```

```sql
DELETE FROM M1_Working_Estimate WHERE wekode = '{idtransaksi}'
```

```sql
SELECT * FROM `m1_working_estimate`
```

```sql
SELECT COUNT(wekode) FROM m1_working_estimate WHERE wekode='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m1/m1_working_estimate_history.vb`

```sql
INSERT INTO m1_working_estimate_history(SELECT 0, we.* FROM m1_working_estimate we WHERE we.wekode = '{idtransaksi}')
```

```sql
select `we`.`weidhistory` AS `weidhistory`,`we`.`wekode` AS `wekode`,`we`.`wenama` AS `wenama`,`we`.`wecatatan` AS `wecatatan`,`we`.`weaktif` AS `weaktif`,`we`.`weinputuser` AS `weinputuser`,`we`.`weinputtgl` AS `weinputtgl`,`we`.`wemodifikasiuser` AS `wemodifikasiuser`,`we`.`wemodifikasitgl` AS `wemodifikasitgl`,`we`.`wecustomtext1` AS `wecustomtext1`,`we`.`wecustomtext2` AS `wecustomtext2`,`we`.`wecustomtext3` AS `wecustomtext3`,`we`.`wecustomtext4` AS `wecustomtext4`,`we`.`wecustomtext5` AS `wecustomtext5`,`we`.`wecustomint1` AS `wecustomint1`,`we`.`wecustomint2` AS `wecustomint2`,`we`.`wecustomint3` AS `wecustomint3`,`we`.`wecustomdbl1` AS `wecustomdbl1`,`we`.`wecustomdbl2` AS `wecustomdbl2`,`we`.`wecustomdbl3` AS `wecustomdbl3`,`we`.`wecustomdate1` AS `wecustomdate1`,`we`.`wecustomdate2` AS `wecustomdate2`,`we`.`wecustomdate3` AS `wecustomdate3`,`ui`.`unama` AS `weinputusernama`,`um`.`unama` AS `wemodifikasiusernama` from ((`m1_working_estimate_history` `we` LEFT JOIN `m0_user` `ui` ON ((`we`.`weinputuser` = `ui`.`userid`))) LEFT JOIN `m0_user` `um` ON ((`we`.`wemodifikasiuser` = `um`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m1/mob_m1_contact.vb`

```sql
SELECT kid FROM m1_contact WHERE kkode = '{FixQuotes_dr1_1}' AND kkategori = '{FixQuotes_dr1_3}'
```

```sql
Insert into M1_Contact (kkode, knama, kkategori, kkategorinama, kcabang, kcabangnama, klokasi, klokasinama, kgudang, kgudangnama, kkategorisalesman, kkategorisalesmannama, karea, kareanama, kkategoricustomer, kkategoricustomernama, kdivisi, kdivisinama, ksubdivisi, ksubdivisinama, ksalesman, ksalesmannama, kkontakperson, kterminglobal, kaktif, kaktiftgl, k1alamat1, k1alamat2, k1alamat3, k1alamat4, k1alamat5, k1kota, k1propinsi, k1kodepos, k1negara, k1kontakperson, k1kontaknohp, k1kontakemail, k1notelp1, k1notelp2, k1nofax, k1email, k1website, k2alamat1, k2alamat2, k2alamat3, k2alamat4, k2alamat5, k2propinsi, k2kota, k2kodepos, k2negara, k2kontakperson, k2kontaknohp, k2kontakemail, k2notelp1, k2notelp2, k2nofax, k2email, k2website, k3alamat1, k3alamat2, k3alamat3, k3alamat4, k3alamat5, k3kota, k3propinsi, k3kodepos, k3negara, k3kontakperson, k3kontaknohp, k3kontakemail, k3notelp1, k3notelp2, k3nofax, k3email, k3website, k4alamat1, k4alamat2, k4alamat3, k4alamat4, k4alamat5, k4kota, k4propinsi, k4kodepos, k4negara, k4kontakperson, k4kontaknohp, k4kontakemail, k4notelp1, k4notelp2, k4nofax, k4email, k4website, knpwp, kpkp, kbatashutang, kterminbeli, krekhutang, kbagpembelian, kfobbeli, kviabeli, kbataspiutang, kterminjual, krekpiutang, kbagpenjualan, ktingkatjual, kfobjual, kviajual, ktglkontrak, kbank, knorekening, kjeniskelamin, kmatauang, ktgllahir, ktglnikah, kkomisipenjualan, kcatatan, kinputuser, kinputtgl, kcustomtext1, kcustomtext2, kcustomtext3, kcustomtext4, kcustomtext5, kcustomtext6, kcustomtext7, kcustomtext8, kcustomtext9, kmodifikasiuser, kmodifikasitgl, kcustomtext10, kcustomint1, kcustomint2, kcustomint3, kcustomdbl1, kcustomdbl2, kcustomdbl3, kcustomdate1, kcustomdate2, kcustomdate3, ksinkron) values{strValue2_ToString} ON DUPLICATE KEY UPDATE kkode = values(kkode), knama = values(knama), kkategori = values(kkategori), kkategorinama = values(kkategorinama), kcabang = values(kcabang), kcabangnama = values(kcabangnama), klokasi = values(klokasi), klokasinama = values(klokasinama), kgudang = values(kgudang), kgudangnama = values(kgudangnama), kkategorisalesman = values(kkategorisalesman), kkategorisalesmannama = values(kkategorisalesmannama), karea = values(karea), kareanama = values(kareanama), kkategoricustomer = values(kkategoricustomer), kkategoricustomernama = values(kkategoricustomernama), kdivisi = values(kdivisi), kdivisinama = values(kdivisinama), ksubdivisi = values(ksubdivisi), ksubdivisinama = values(ksubdivisinama), ksalesman = values(ksalesman), ksalesmannama = values(ksalesmannama), kkontakperson = values(kkontakperson), kterminglobal = values(kterminglobal), kaktif = values(kaktif), kaktiftgl = values(kaktiftgl), k1alamat1 = values(k1alamat1), k1alamat2 = values(k1alamat2), k1alamat3 = values(k1alamat3), k1alamat4 = values(k1alamat4), k1alamat5 = values(k1alamat5), k1kota = values(k1kota), k1propinsi = values(k1propinsi), k1kodepos = values(k1kodepos), k1negara = values(k1negara), k1kontakperson = values(k1kontakperson), k1kontaknohp = values(k1kontaknohp), k1kontakemail = values(k1kontakemail), k1notelp1 = values(k1notelp1), k1notelp2 = values(k1notelp2), k1nofax = values(k1nofax), k1email = values(k1email), k1website = values(k1website), k2alamat1 = values(k2alamat1), k2alamat2 = values(k2alamat2), k2alamat3 = values(k2alamat3), k2alamat4 = values(k2alamat4), k2alamat5 = values(k2alamat5), k2propinsi = values(k2propinsi), k2kota = values(k2kota), k2kodepos = values(k2kodepos), k2negara = values(k2negara), k2kontakperson = values(k2kontakperson), k2kontaknohp = values(k2kontaknohp), k2kontakemail = values(k2kontakemail), k2notelp1 = values(k2notelp1), k2notelp2 = values(k2notelp2), k2nofax = values(k2nofax), k2email = values(k2email), k2website = values(k2website), k3alamat1 = values(k3alamat1), k3alamat2 = values(k3alamat2), k3alamat3 = values(k3alamat3), k3alamat4 = values(k3alamat4), k3alamat5 = values(k3alamat5), k3kota = values(k3kota), k3propinsi = values(k3propinsi), k3kodepos = values(k3kodepos), k3negara = values(k3negara), k3kontakperson = values(k3kontakperson), k3kontaknohp = values(k3kontaknohp), k3kontakemail = values(k3kontakemail), k3notelp1 = values(k3notelp1), k3notelp2 = values(k3notelp2), k3nofax = values(k3nofax), k3email = values(k3email), k3website = values(k3website), k4alamat1 = values(k4alamat1), k4alamat2 = values(k4alamat2), k4alamat3 = values(k4alamat3), k4alamat4 = values(k4alamat4), k4alamat5 = values(k4alamat5), k4kota = values(k4kota), k4propinsi = values(k4propinsi), k4kodepos = values(k4kodepos), k4negara = values(k4negara), k4kontakperson = values(k4kontakperson), k4kontaknohp = values(k4kontaknohp), k4kontakemail = values(k4kontakemail), k4notelp1 = values(k4notelp1), k4notelp2 = values(k4notelp2), k4nofax = values(k4nofax), k4email = values(k4email), k4website = values(k4website), knpwp = values(knpwp), kpkp = values(kpkp), kbatashutang = values(kbatashutang), kterminbeli = values(kterminbeli), krekhutang = values(krekhutang), kbagpembelian = values(kbagpembelian), kfobbeli = values(kfobbeli), kviabeli = values(kviabeli), kbataspiutang = values(kbataspiutang), kterminjual = values(kterminjual), krekpiutang = values(krekpiutang), kbagpenjualan = values(kbagpenjualan), ktingkatjual = values(ktingkatjual), kfobjual = values(kfobjual), kviajual = values(kviajual), ktglkontrak = values(ktglkontrak), kbank = values(kbank), knorekening = values(knorekening), kjeniskelamin = values(kjeniskelamin), kmatauang = values(kmatauang), ktgllahir = values(ktgllahir), ktglnikah = values(ktglnikah), kkomisipenjualan = values(kkomisipenjualan), kcatatan = values(kcatatan), kinputuser = values(kinputuser), kinputtgl = values(kinputtgl), kcustomtext1 = values(kcustomtext1), kcustomtext2 = values(kcustomtext2), kcustomtext3 = values(kcustomtext3), kcustomtext4 = values(kcustomtext4), kcustomtext5 = values(kcustomtext5), kcustomtext6 = values(kcustomtext6), kcustomtext7 = values(kcustomtext7), kcustomtext8 = values(kcustomtext8), kcustomtext9 = values(kcustomtext9), kmodifikasiuser = values(kmodifikasiuser), kmodifikasitgl = values(kmodifikasitgl), kcustomtext10 = values(kcustomtext10), kcustomint1 = values(kcustomint1), kcustomint2 = values(kcustomint2), kcustomint3 = values(kcustomint3), kcustomdbl1 = values(kcustomdbl1), kcustomdbl2 = values(kcustomdbl2), kcustomdbl3 = values(kcustomdbl3), kcustomdate1 = values(kcustomdate1), kcustomdate2 = values(kcustomdate2), kcustomdate3 = values(kcustomdate3), ksinkron = values(ksinkron)
```

