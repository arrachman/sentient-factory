# M2 Queries

Collected from `client-backend/api-myerpplus/app_code/ws/myerpplus.vb` dispatch targets under `app_code/ws/m2`.

Total queries: `330`

## `client-backend/api-myerpplus/app_code/ws/m2/m2_accounting_period.vb`

```sql
SELECT COUNT(apkode) FROM M2_Accounting_Period WHERE apkode='{dataUtama_0}'
```

```sql
Update M2_Accounting_Period set aptahun = {dataUtama_1}, apbulan = {dataUtama_2}, apaktif = {dataUtama_3}, aptutupperiode = {dataUtama_4} where apkode = '{dataUtama_0}'
```

```sql
SELECT COUNT(apkode) as jmlrow, MONTHNAME('{dataUtama_1}-{dataUtama_2}-01') as bulan FROM m2_accounting_period WHERE aptahun = '{dataUtama_1}' AND apbulan = '{dataUtama_2}'
```

```sql
Insert into M2_Accounting_Period (aptahun, apbulan, apaktif, aptutupperiode) values({dataUtama_1}, {dataUtama_2}, {dataUtama_3}, {dataUtama_4})
```

```sql
DELETE FROM M2_Accounting_Period WHERE apkode = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_aj.vb`

```sql
SELECT COUNT(ajid), ajnotransaksi FROM M2_aj WHERE ajid='{result_4}' AND ajstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(ajid) FROM m2_aj WHERE ajnotransaksi='{notransaksi}'
```

```sql
Update M2_Aj set ajcabang = '{FixQuotes_drutama}ajcabang', ajlokasi = '{FixQuotes_drutama}ajlokasi', ajsumber = '{FixQuotes_drutama}ajsumber', ajautonotransaksi = {drutama}ajautonotransaksi, ajnotransaksi = '{notransaksi}', ajtgl = '{FixQuotes_AsFormatTanggal_drutama}ajtgl', ajkodepa = {drutama}ajkodepa, ajkontak = {drutama}ajkontak, ajkontakperson = '{FixQuotes_drutama}ajkontakperson', ajuraian = '{FixQuotes_drutama}ajuraian', ajcatatan = '{FixQuotes_drutama}ajcatatan', ajmatauang = '{FixQuotes_drutama}ajmatauang', ajkurs = '{FixDouble_drutama}ajkurs', ajdebit = '{FixDouble_drutama}ajdebit', ajdebitvalas = '{FixDouble_drutama}ajdebitvalas', ajkredit = '{FixDouble_drutama}ajkredit', ajkreditvalas = '{FixDouble_drutama}ajkreditvalas', ajjumlahbayar = '{FixDouble_drutama}ajjumlahbayar', ajjumlahbayarvalas = '{FixDouble_drutama}ajjumlahbayarvalas', ajstatusbayar = {drutama}ajstatusbayar, ajtgllunas = '{FixQuotes_AsFormatTanggal_drutama}ajtgllunas', ajstatus = {drutama}ajstatus, ajstatussebelumnya = {drutama}ajstatussebelumnya, ajjmlrevisi = ajjmlrevisi + 1, ajcetakanke = {drutama}ajcetakanke, ajisclose = {drutama}ajisclose, ajmodifikasiuser = {drutama}ajmodifikasiuser, ajmodifikasitgl = NOW(), ajposting = 0, ajcustomtext1 = '{FixQuotes_drutama}ajcustomtext1', ajcustomtext2 = '{FixQuotes_drutama}ajcustomtext2', ajcustomtext3 = '{FixQuotes_drutama}ajcustomtext3', ajcustomtext4 = '{FixQuotes_drutama}ajcustomtext4', ajcustomtext5 = '{FixQuotes_drutama}ajcustomtext5', ajcustomint1 = {drutama}ajcustomint1, ajcustomint2 = {drutama}ajcustomint2, ajcustomint3 = {drutama}ajcustomint3, ajcustomdbl1 = '{FixDouble_drutama}ajcustomdbl1', ajcustomdbl2 = '{FixDouble_drutama}ajcustomdbl2', ajcustomdbl3 = '{FixDouble_drutama}ajcustomdbl3', ajcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}ajcustomdate1', ajcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}ajcustomdate2', ajcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}ajcustomdate3' where ajid = '{drutama}ajid'
```

```sql
Insert into M2_Aj (ajcabang, ajlokasi, ajsumber, ajautonotransaksi, ajnotransaksi, ajtgl, ajkodepa, ajkontak, ajkontakperson, ajuraian, ajcatatan, ajmatauang, ajkurs, ajdebit, ajdebitvalas, ajkredit, ajkreditvalas, ajjumlahbayar, ajjumlahbayarvalas, ajstatusbayar, ajtgllunas, ajstatus, ajstatussebelumnya, ajjmlrevisi, ajcetakanke, ajisclose, ajinputuser, ajinputtgl, ajmodifikasiuser, ajmodifikasitgl, ajposting, ajcustomtext1, ajcustomtext2, ajcustomtext3, ajcustomtext4, ajcustomtext5, ajcustomint1, ajcustomint2, ajcustomint3, ajcustomdbl1, ajcustomdbl2, ajcustomdbl3, ajcustomdate1, ajcustomdate2, ajcustomdate3) values('{FixQuotes_drutama}ajcabang', '{FixQuotes_drutama}ajlokasi', '{FixQuotes_drutama}ajsumber', {drutama}ajautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}ajtgl', {drutama}ajkodepa, {drutama}ajkontak, '{FixQuotes_drutama}ajkontakperson', '{FixQuotes_drutama}ajuraian', '{FixQuotes_drutama}ajcatatan', '{FixQuotes_drutama}ajmatauang', '{FixDouble_drutama}ajkurs', '{FixDouble_drutama}ajdebit', '{FixDouble_drutama}ajdebitvalas', '{FixDouble_drutama}ajkredit', '{FixDouble_drutama}ajkreditvalas', '{FixDouble_drutama}ajjumlahbayar', '{FixDouble_drutama}ajjumlahbayarvalas', {drutama}ajstatusbayar, '{FixQuotes_AsFormatTanggal_drutama}ajtgllunas', {drutama}ajstatus, {drutama}ajstatussebelumnya, {drutama}ajjmlrevisi, {drutama}ajcetakanke, {drutama}ajisclose, {drutama}ajinputuser, NOW(), {drutama}ajmodifikasiuser, '1971-01-01 00:00:00', 0, '{FixQuotes_drutama}ajcustomtext1', '{FixQuotes_drutama}ajcustomtext2', '{FixQuotes_drutama}ajcustomtext3', '{FixQuotes_drutama}ajcustomtext4', '{FixQuotes_drutama}ajcustomtext5', {drutama}ajcustomint1, {drutama}ajcustomint2, {drutama}ajcustomint3, '{FixDouble_drutama}ajcustomdbl1', '{FixDouble_drutama}ajcustomdbl2', '{FixDouble_drutama}ajcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}ajcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}ajcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}ajcustomdate3')
```

```sql
select ajid from M2_aj where ajnotransaksi='{notransaksi}' AND ajinputuser= '{userid}' order by ajmodifikasitgl desc limit 1
```

```sql
Delete from M2_Aj_Detail where idaj = '{result_4}'
```

```sql
Insert into M2_Aj_Detail(idajdetail, idaj, norek, matauang, kurs, debit, debitvalas, kredit, kreditvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Ajtgl, Ajnotransaksi, Ajstatus FROM m2_Aj WHERE Ajid='{idtransaksi}'
```

```sql
DELETE FROM M2_Transaction_Journal WHERE tsumber = 'Aj' AND tidtransaksi = '{idtransaksi}' AND tnotransaksi = '{notransaksi}'
```

```sql
UPDATE M2_Aj SET Ajstatus = {nilaiStatus}, Ajmodifikasiuser='{userid}', Ajmodifikasitgl = NOW(), Ajposting = 0, Ajpostingtgl = '1971-01-01 00:00:00', Ajjmlrevisi = Ajjmlrevisi + 1 WHERE Ajid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Ajid, Ajnotransaksi FROM m2_Aj WHERE Ajid='{idtransaksi}'
```

```sql
DELETE FROM M2_Aj_Detail WHERE idAj = '{idtransaksi}'
```

```sql
DELETE FROM M2_Aj WHERE Ajid = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_aj_history.vb`

```sql
INSERT INTO m2_aj_history(SELECT 0, aj.* FROM m2_aj aj WHERE aj.ajid = '{idtransaksi}')
```

```sql
SELECT ajidhistory FROM m2_aj_history WHERE ajid = '{idtransaksi}' ORDER BY ajmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m2_aj_detail_history (SELECT 0, '{result_4}', aj.* FROM m2_aj_detail aj WHERE aj.idaj = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_bd.vb`

```sql
SELECT COUNT(bdid), bdnotransaksi FROM M2_Bd WHERE bdid='{result_4}' AND bdstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(bdid) FROM m2_bd WHERE bdnotransaksi='{notransaksi}'
```

```sql
Update M2_Bd set bdcabang = '{FixQuotes_drutama}bdcabang', bdlokasi = '{FixQuotes_drutama}bdlokasi', bdsumber = '{FixQuotes_drutama}bdsumber', bdautonotransaksi = {drutama}bdautonotransaksi, bdnotransaksi = '{notransaksi}', bdtgl = '{FixQuotes_AsFormatTanggal_drutama}bdtgl', bdtglanggaran = '{FixQuotes_AsFormatTanggal_drutama}bdtglanggaran', bdkodepa = {drutama}bdkodepa, bdkontak = {drutama}bdkontak, bdkontakperson = '{FixQuotes_drutama}bdkontakperson', bdanggarankategori = {drutama}bdanggarankategori, bdanggarancabang = '{FixQuotes_drutama}bdanggarancabang', bdanggaranlokasi = '{FixQuotes_drutama}bdanggaranlokasi', bdanggarancostcenter = '{FixQuotes_drutama}bdanggarancostcenter', bdanggarandivisi = '{FixQuotes_drutama}bdanggarandivisi', bdanggaransubdivisi = '{FixQuotes_drutama}bdanggaransubdivisi', bdanggaranproyek = '{FixQuotes_drutama}bdanggaranproyek', bduraian = '{FixQuotes_drutama}bduraian', bdcatatan = '{FixQuotes_drutama}bdcatatan', bdmatauang = '{FixQuotes_drutama}bdmatauang', bdkurs = '{FixDouble_drutama}bdkurs', bdstatus = {drutama}bdstatus, bdstatussebelumnya = {drutama}bdstatussebelumnya, bdjmlrevisi = bdjmlrevisi+1, bdcetakanke = {drutama}bdcetakanke, bdisclose = {drutama}bdisclose, bdmodifikasiuser = {drutama}bdmodifikasiuser, bdmodifikasitgl = NOW(), bdposting = 0, bdcustomtext1 = '{FixQuotes_drutama}bdcustomtext1', bdcustomtext2 = '{FixQuotes_drutama}bdcustomtext2', bdcustomtext3 = '{FixQuotes_drutama}bdcustomtext3', bdcustomtext4 = '{FixQuotes_drutama}bdcustomtext4', bdcustomtext5 = '{FixQuotes_drutama}bdcustomtext5', bdcustomint1 = {drutama}bdcustomint1, bdcustomint2 = {drutama}bdcustomint2, bdcustomint3 = {drutama}bdcustomint3, bdcustomdbl1 = '{FixDouble_drutama}bdcustomdbl1', bdcustomdbl2 = '{FixDouble_drutama}bdcustomdbl2', bdcustomdbl3 = '{FixDouble_drutama}bdcustomdbl3', bdcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}bdcustomdate1', bdcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}bdcustomdate2', bdcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}bdcustomdate3' where bdid = '{drutama}bdid'
```

```sql
Insert into M2_Bd (bdcabang, bdlokasi, bdsumber, bdautonotransaksi, bdnotransaksi, bdtgl, bdtglanggaran, bdkodepa, bdkontak, bdkontakperson, bdanggarankategori, bdanggarancabang, bdanggaranlokasi, bdanggarancostcenter, bdanggarandivisi, bdanggaransubdivisi, bdanggaranproyek, bduraian, bdcatatan, bdmatauang, bdkurs, bdstatus, bdstatussebelumnya, bdjmlrevisi, bdcetakanke, bdisclose, bdinputuser, bdinputtgl, bdmodifikasiuser, bdmodifikasitgl, bdposting, bdcustomtext1, bdcustomtext2, bdcustomtext3, bdcustomtext4, bdcustomtext5, bdcustomint1, bdcustomint2, bdcustomint3, bdcustomdbl1, bdcustomdbl2, bdcustomdbl3, bdcustomdate1, bdcustomdate2, bdcustomdate3) values('{FixQuotes_drutama}bdcabang', '{FixQuotes_drutama}bdlokasi', '{FixQuotes_drutama}bdsumber', {drutama}bdautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}bdtgl', '{FixQuotes_AsFormatTanggal_drutama}bdtglanggaran', {drutama}bdkodepa, {drutama}bdkontak, '{FixQuotes_drutama}bdkontakperson', {drutama}bdanggarankategori, '{FixQuotes_drutama}bdanggarancabang', '{FixQuotes_drutama}bdanggaranlokasi', '{FixQuotes_drutama}bdanggarancostcenter', '{FixQuotes_drutama}bdanggarandivisi', '{FixQuotes_drutama}bdanggaransubdivisi', '{FixQuotes_drutama}bdanggaranproyek', '{FixQuotes_drutama}bduraian', '{FixQuotes_drutama}bdcatatan', '{FixQuotes_drutama}bdmatauang', '{FixDouble_drutama}bdkurs', {drutama}bdstatus, {drutama}bdstatussebelumnya, {drutama}bdjmlrevisi, {drutama}bdcetakanke, {drutama}bdisclose, {drutama}bdinputuser, NOW(), {drutama}bdmodifikasiuser, '1971-01-01 00:00:00', 0, '{FixQuotes_drutama}bdcustomtext1', '{FixQuotes_drutama}bdcustomtext2', '{FixQuotes_drutama}bdcustomtext3', '{FixQuotes_drutama}bdcustomtext4', '{FixQuotes_drutama}bdcustomtext5', {drutama}bdcustomint1, {drutama}bdcustomint2, {drutama}bdcustomint3, '{FixDouble_drutama}bdcustomdbl1', '{FixDouble_drutama}bdcustomdbl2', '{FixDouble_drutama}bdcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}bdcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}bdcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}bdcustomdate3')
```

```sql
select bdid from M2_Bd where bdnotransaksi='{notransaksi}' AND Bdinputuser= '{userid}' order by Bdmodifikasitgl desc limit 1
```

```sql
Delete from M2_Bd_Detail where idbd = '{result_4}'
```

```sql
Insert into M2_Bd_Detail(idbddetail, idbd, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
INSERT INTO m2_realization ( SELECT YEAR(bd.bdtglanggaran) as rtahun, MONTH(bd.bdtglanggaran) as rbulan, bdd.norek as rnorek, 0 as rjmldebit, 0 as rjmlkredit, bdd.jumlah as ranggaran, ap.apkode as rkodepa FROM m2_bd bd JOIN m2_bd_detail bdd ON bd.bdid = bdd.idbd JOIN m2_accounting_period ap ON YEAR(bd.bdtglanggaran) = ap.aptahun AND MONTH(bd.bdtglanggaran) = ap.apbulan WHERE bd.bdid = '{result_4}' ) ON DUPLICATE KEY UPDATE ranggaran = VALUES(ranggaran)
```

```sql
INSERT INTO m2_realization_branch ( SELECT YEAR(bd.bdtglanggaran) as rwtahun, MONTH(bd.bdtglanggaran) as rwbulan, bd.bdanggarancabang as rwcabang, bdd.norek as rwnorek, 0 as rwjmldebit, 0 as rwjmlkredit, bdd.jumlah as rwanggaran, ap.apkode as rwkodepa FROM m2_bd bd JOIN m2_bd_detail bdd ON bd.bdid = bdd.idbd JOIN m2_accounting_period ap ON YEAR(bd.bdtglanggaran) = ap.aptahun AND MONTH(bd.bdtglanggaran) = ap.apbulan WHERE bd.bdid = '{result_4}' ) ON DUPLICATE KEY UPDATE rwanggaran = VALUES(rwanggaran)
```

```sql
INSERT INTO m2_realization_location ( SELECT YEAR(bd.bdtglanggaran) as rltahun, MONTH(bd.bdtglanggaran) as rlbulan, bd.bdanggaranlokasi as rllokasi, bdd.norek as rlnorek, 0 as rljmldebit, 0 as rljmlkredit, bdd.jumlah as rlanggaran, ap.apkode as rlkodepa FROM m2_bd bd JOIN m2_bd_detail bdd ON bd.bdid = bdd.idbd JOIN m2_accounting_period ap ON YEAR(bd.bdtglanggaran) = ap.aptahun AND MONTH(bd.bdtglanggaran) = ap.apbulan WHERE bd.bdid = '{result_4}' ) ON DUPLICATE KEY UPDATE rlanggaran = VALUES(rlanggaran)
```

```sql
INSERT INTO m2_realization_cost_center ( SELECT YEAR(bd.bdtglanggaran) as rcctahun, MONTH(bd.bdtglanggaran) as rccbulan, bd.bdanggarancostcenter as rcccostcenter, bdd.norek as rccnorek, 0 as rccjmldebit, 0 as rccjmlkredit, bdd.jumlah as rccanggaran, ap.apkode as rcckodepa FROM m2_bd bd JOIN m2_bd_detail bdd ON bd.bdid = bdd.idbd JOIN m2_accounting_period ap ON YEAR(bd.bdtglanggaran) = ap.aptahun AND MONTH(bd.bdtglanggaran) = ap.apbulan WHERE bd.bdid = '{result_4}' ) ON DUPLICATE KEY UPDATE rccanggaran = VALUES(rccanggaran)
```

```sql
INSERT INTO m2_realization_division ( SELECT YEAR(bd.bdtglanggaran) as rdtahun, MONTH(bd.bdtglanggaran) as rdbulan, bd.bdanggarandivisi as rddivisi, bdd.norek as rdnorek, 0 as rdjmldebit, 0 as rdjmlkredit, bdd.jumlah as rdanggaran, ap.apkode as rdkodepa FROM m2_bd bd JOIN m2_bd_detail bdd ON bd.bdid = bdd.idbd JOIN m2_accounting_period ap ON YEAR(bd.bdtglanggaran) = ap.aptahun AND MONTH(bd.bdtglanggaran) = ap.apbulan WHERE bd.bdid = '{result_4}' ) ON DUPLICATE KEY UPDATE rdanggaran = VALUES(rdanggaran)
```

```sql
INSERT INTO m2_realization_subdivision ( SELECT YEAR(bd.bdtglanggaran) as rsdtahun, MONTH(bd.bdtglanggaran) as rsdbulan, bd.bdanggaransubdivisi as rsdsubdivisi, bdd.norek as rsdnorek, 0 as rsdjmldebit, 0 as rsdjmlkredit, bdd.jumlah as rsdanggaran, ap.apkode as rsdkodepa FROM m2_bd bd JOIN m2_bd_detail bdd ON bd.bdid = bdd.idbd JOIN m2_accounting_period ap ON YEAR(bd.bdtglanggaran) = ap.aptahun AND MONTH(bd.bdtglanggaran) = ap.apbulan WHERE bd.bdid = '{result_4}' ) ON DUPLICATE KEY UPDATE rsdanggaran = VALUES(rsdanggaran)
```

```sql
INSERT INTO m2_realization_project ( SELECT YEAR(bd.bdtglanggaran) as rptahun, MONTH(bd.bdtglanggaran) as rpbulan, bd.bdanggaranproyek as rpproyek, bdd.norek as rpnorek, 0 as rpjmldebit, 0 as rpjmlkredit, bdd.jumlah as rpanggaran, ap.apkode as rpkodepa FROM m2_bd bd JOIN m2_bd_detail bdd ON bd.bdid = bdd.idbd JOIN m2_accounting_period ap ON YEAR(bd.bdtglanggaran) = ap.aptahun AND MONTH(bd.bdtglanggaran) = ap.apbulan WHERE bd.bdid = '{result_4}' ) ON DUPLICATE KEY UPDATE rpanggaran = VALUES(rpanggaran)
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Bdtgl, Bdnotransaksi, Bdstatus FROM m2_Bd WHERE Bdid='{idtransaksi}'
```

```sql
SELECT bdanggarankategori FROM m2_bd bd WHERE bd.bdid = '{idtransaksi}'
```

```sql
INSERT INTO m2_realization ( SELECT YEAR(bd.bdtglanggaran) as rtahun, MONTH(bd.bdtglanggaran) as rbulan, bdd.norek as rnorek, 0 as rjmldebit, 0 as rjmlkredit, 0 as ranggaran, ap.apkode as rkodepa FROM m2_bd bd JOIN m2_bd_detail bdd ON bd.bdid = bdd.idbd JOIN m2_accounting_period ap ON YEAR(bd.bdtglanggaran) = ap.aptahun AND MONTH(bd.bdtglanggaran) = ap.apbulan WHERE bd.bdid = '{idtransaksi}' ) ON DUPLICATE KEY UPDATE ranggaran = VALUES(ranggaran)
```

```sql
INSERT INTO m2_realization_branch ( SELECT YEAR(bd.bdtglanggaran) as rwtahun, MONTH(bd.bdtglanggaran) as rwbulan, bd.bdanggarancabang as rwcabang, bdd.norek as rwnorek, 0 as rwjmldebit, 0 as rwjmlkredit, 0 as rwanggaran, ap.apkode as rwkodepa FROM m2_bd bd JOIN m2_bd_detail bdd ON bd.bdid = bdd.idbd JOIN m2_accounting_period ap ON YEAR(bd.bdtglanggaran) = ap.aptahun AND MONTH(bd.bdtglanggaran) = ap.apbulan WHERE bd.bdid = '{idtransaksi}' ) ON DUPLICATE KEY UPDATE rwanggaran = VALUES(rwanggaran)
```

```sql
INSERT INTO m2_realization_location ( SELECT YEAR(bd.bdtglanggaran) as rltahun, MONTH(bd.bdtglanggaran) as rlbulan, bd.bdanggaranlokasi as rllokasi, bdd.norek as rlnorek, 0 as rljmldebit, 0 as rljmlkredit, 0 as rlanggaran, ap.apkode as rlkodepa FROM m2_bd bd JOIN m2_bd_detail bdd ON bd.bdid = bdd.idbd JOIN m2_accounting_period ap ON YEAR(bd.bdtglanggaran) = ap.aptahun AND MONTH(bd.bdtglanggaran) = ap.apbulan WHERE bd.bdid = '{idtransaksi}' ) ON DUPLICATE KEY UPDATE rlanggaran = VALUES(rlanggaran)
```

```sql
INSERT INTO m2_realization_cost_center ( SELECT YEAR(bd.bdtglanggaran) as rcctahun, MONTH(bd.bdtglanggaran) as rccbulan, bd.bdanggarancostcenter as rcccostcenter, bdd.norek as rccnorek, 0 as rccjmldebit, 0 as rccjmlkredit, 0 as rccanggaran, ap.apkode as rcckodepa FROM m2_bd bd JOIN m2_bd_detail bdd ON bd.bdid = bdd.idbd JOIN m2_accounting_period ap ON YEAR(bd.bdtglanggaran) = ap.aptahun AND MONTH(bd.bdtglanggaran) = ap.apbulan WHERE bd.bdid = '{idtransaksi}' ) ON DUPLICATE KEY UPDATE rccanggaran = VALUES(rccanggaran)
```

```sql
INSERT INTO m2_realization_division ( SELECT YEAR(bd.bdtglanggaran) as rdtahun, MONTH(bd.bdtglanggaran) as rdbulan, bd.bdanggarandivisi as rddivisi, bdd.norek as rdnorek, 0 as rdjmldebit, 0 as rdjmlkredit, 0 as rdanggaran, ap.apkode as rdkodepa FROM m2_bd bd JOIN m2_bd_detail bdd ON bd.bdid = bdd.idbd JOIN m2_accounting_period ap ON YEAR(bd.bdtglanggaran) = ap.aptahun AND MONTH(bd.bdtglanggaran) = ap.apbulan WHERE bd.bdid = '{idtransaksi}' ) ON DUPLICATE KEY UPDATE rdanggaran = VALUES(rdanggaran)
```

```sql
INSERT INTO m2_realization_subdivision ( SELECT YEAR(bd.bdtglanggaran) as rsdtahun, MONTH(bd.bdtglanggaran) as rsdbulan, bd.bdanggaransubdivisi as rsdsubdivisi, bdd.norek as rsdnorek, 0 as rsdjmldebit, 0 as rsdjmlkredit, 0 as rsdanggaran, ap.apkode as rsdkodepa FROM m2_bd bd JOIN m2_bd_detail bdd ON bd.bdid = bdd.idbd JOIN m2_accounting_period ap ON YEAR(bd.bdtglanggaran) = ap.aptahun AND MONTH(bd.bdtglanggaran) = ap.apbulan WHERE bd.bdid = '{idtransaksi}' ) ON DUPLICATE KEY UPDATE rsdanggaran = VALUES(rsdanggaran)
```

```sql
INSERT INTO m2_realization_project ( SELECT YEAR(bd.bdtglanggaran) as rptahun, MONTH(bd.bdtglanggaran) as rpbulan, bd.bdanggaranproyek as rpproyek, bdd.norek as rpnorek, 0 as rpjmldebit, 0 as rpjmlkredit, 0 as rpanggaran, ap.apkode as rpkodepa FROM m2_bd bd JOIN m2_bd_detail bdd ON bd.bdid = bdd.idbd JOIN m2_accounting_period ap ON YEAR(bd.bdtglanggaran) = ap.aptahun AND MONTH(bd.bdtglanggaran) = ap.apbulan WHERE bd.bdid = '{idtransaksi}' ) ON DUPLICATE KEY UPDATE rpanggaran = VALUES(rpanggaran)
```

```sql
UPDATE M2_Bd SET Bdstatus = {nilaiStatus}, bdmodifikasiuser='{userid}', bdmodifikasitgl = NOW(), bdposting = 0, bdpostingtgl = '1971-01-01 00:00:00', Bdjmlrevisi = Bdjmlrevisi + 1 WHERE bdid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT bdid, bdnotransaksi FROM m2_bd WHERE bdid='{idtransaksi}'
```

```sql
DELETE FROM M2_Bd_Detail WHERE idbd = '{idtransaksi}'
```

```sql
DELETE FROM M2_Bd WHERE bdid = '{idtransaksi}'
```

```sql
select `bd`.`bdid` AS `bdid`,`bd`.`bdcabang` AS `bdcabang`,`bd`.`bdlokasi` AS `bdlokasi`,`bd`.`bdsumber` AS `bdsumber`,`bd`.`bdautonotransaksi` AS `bdautonotransaksi`,`bd`.`bdnotransaksi` AS `bdnotransaksi`,`bd`.`bdtgl` AS `bdtgl`,`bd`.`bdtglanggaran` AS `bdtglanggaran`,`bd`.`bdkodepa` AS `bdkodepa`,`bd`.`bdkontak` AS `bdkontak`,`bd`.`bdkontakperson` AS `bdkontakperson`,`bd`.`bdanggarankategori` AS `bdanggarankategori`,`bd`.`bdanggarancabang` AS `bdanggarancabang`,`bd`.`bdanggaranlokasi` AS `bdanggaranlokasi`,`bd`.`bdanggarancostcenter` AS `bdanggarancostcenter`,`bd`.`bdanggarandivisi` AS `bdanggarandivisi`,`bd`.`bdanggaransubdivisi` AS `bdanggaransubdivisi`,`bd`.`bdanggaranproyek` AS `bdanggaranproyek`,`bd`.`bduraian` AS `bduraian`,`bd`.`bdcatatan` AS `bdcatatan`,`bd`.`bdmatauang` AS `bdmatauang`,`bd`.`bdkurs` AS `bdkurs`,`bd`.`bdstatus` AS `bdstatus`,`bd`.`bdstatussebelumnya` AS `bdstatussebelumnya`,`bd`.`bdjmlrevisi` AS `bdjmlrevisi`,`bd`.`bdcetakanke` AS `bdcetakanke`,`bd`.`bdisclose` AS `bdisclose`,`bd`.`bdinputuser` AS `bdinputuser`,`bd`.`bdinputtgl` AS `bdinputtgl`,`bd`.`bdmodifikasiuser` AS `bdmodifikasiuser`,`bd`.`bdmodifikasitgl` AS `bdmodifikasitgl`,`bd`.`bdposting` AS `bdposting`,`bd`.`bdpostingtgl` AS `bdpostingtgl`,`bd`.`bdcustomtext1` AS `bdcustomtext1`,`bd`.`bdcustomtext2` AS `bdcustomtext2`,`bd`.`bdcustomtext3` AS `bdcustomtext3`,`bd`.`bdcustomtext4` AS `bdcustomtext4`,`bd`.`bdcustomtext5` AS `bdcustomtext5`,`bd`.`bdcustomint1` AS `bdcustomint1`,`bd`.`bdcustomint2` AS `bdcustomint2`,`bd`.`bdcustomint3` AS `bdcustomint3`,`bd`.`bdcustomdbl1` AS `bdcustomdbl1`,`bd`.`bdcustomdbl2` AS `bdcustomdbl2`,`bd`.`bdcustomdbl3` AS `bdcustomdbl3`,`bd`.`bdcustomdate1` AS `bdcustomdate1`,`bd`.`bdcustomdate2` AS `bdcustomdate2`,`bd`.`bdcustomdate3` AS `bdcustomdate3`,`br`.`bnama` AS `bdcabangnama`,`lc`.`lnama` AS `bdlokasinama`,`c`.`kkode` AS `bdkontakkode`,`c`.`knama` AS `bdkontaknama`,`rc`.`nama` AS `bdanggarankategorinama`,`br2`.`bnama` AS `bdanggarancabangnama`,`lc2`.`lnama` AS `bdanggaranlokasinama`,`cc2`.`ccnama` AS `bdanggarancostcenternama`,`d2`.`dnama` AS `bdanggarandivisinama`,`sd2`.`sdnama` AS `bdanggaransubdivisinama`,`p2`.`pnama` AS `bdanggaranproyeknama`,`st1`.`nama` AS `bdstatusnama`,`st2`.`nama` AS `bdstatussebelumnyanama`,`u1`.`unama` AS `bdinputusernama`,`u2`.`unama` AS `bdmodifikasiusernama`,`bdd`.`idbddetail` AS `idbddetail`,`bdd`.`idbd` AS `idbd`,`bdd`.`norek` AS `norek`,`bdd`.`matauang` AS `matauang`,`bdd`.`kurs` AS `kurs`,`bdd`.`jumlah` AS `jumlah`,`bdd`.`jumlahvalas` AS `jumlahvalas`,`bdd`.`catatan` AS `catatan`,`bdd`.`costcenter` AS `costcenter`,`bdd`.`divisi` AS `divisi`,`bdd`.`subdivisi` AS `subdivisi`,`bdd`.`proyek` AS `proyek`,`bdd`.`urutan` AS `urutan`,`bdd`.`isclose` AS `isclose`,`bdd`.`customtext1` AS `customtext1`,`bdd`.`customtext2` AS `customtext2`,`bdd`.`customtext3` AS `customtext3`,`bdd`.`customdbl1` AS `customdbl1`,`bdd`.`customdbl2` AS `customdbl2`,`bdd`.`customdbl3` AS `customdbl3`,`bdd`.`customdate1` AS `customdate1`,`bdd`.`customdate2` AS `customdate2`,`bdd`.`customdate3` AS `customdate3`,`coa`.`cnama` AS `noreknama` from ((((((((((((((((`m2_bd` `bd` join `m0_status` `st1` on((`bd`.`bdstatus` = `st1`.`kode`))) join `m0_status` `st2` on((`bd`.`bdstatussebelumnya` = `st2`.`kode`))) join `m0_realization_category` `rc` on((`bd`.`bdanggarankategori` = `rc`.`kode`))) join `m2_bd_detail` `bdd` on((`bd`.`bdid` = `bdd`.`idbd`))) left join `m1_branch` `br` on((`bd`.`bdcabang` = `br`.`bkode`))) left join `m1_location` `lc` on((`bd`.`bdlokasi` = `lc`.`lkode`))) left join `m1_contact` `c` on((`bd`.`bdkontak` = `c`.`kid`))) left join `m1_branch` `br2` on((`bd`.`bdanggarancabang` = `br2`.`bkode`))) left join `m1_location` `lc2` on((`bd`.`bdanggaranlokasi` = `lc2`.`lkode`))) left join `m1_cost_center` `cc2` on((`bd`.`bdanggarancostcenter` = `cc2`.`cckode`))) left join `m1_division` `d2` on((`bd`.`bdanggarandivisi` = `d2`.`dkode`))) left join `m1_subdivision` `sd2` on((`bd`.`bdanggaransubdivisi` = `sd2`.`sdkode`))) left join `m1_project` `p2` on((`bd`.`bdanggaranproyek` = `p2`.`pkode`))) left join `m0_user` `u1` on((`bd`.`bdinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`bd`.`bdmodifikasiuser` = `u2`.`userid`))) left join `m1_coa` `coa` on((`bdd`.`norek` = `coa`.`cnomor`)))
```

```sql
select `bd`.`bdid` AS `bdid`,`bd`.`bdcabang` AS `bdcabang`,`bd`.`bdlokasi` AS `bdlokasi`,`bd`.`bdsumber` AS `bdsumber`,`bd`.`bdautonotransaksi` AS `bdautonotransaksi`,`bd`.`bdnotransaksi` AS `bdnotransaksi`,`bd`.`bdtgl` AS `bdtgl`,`bd`.`bdtglanggaran` AS `bdtglanggaran`,`bd`.`bdkodepa` AS `bdkodepa`,`bd`.`bdkontak` AS `bdkontak`,`bd`.`bdkontakperson` AS `bdkontakperson`,`bd`.`bdanggarankategori` AS `bdanggarankategori`,`bd`.`bdanggarancabang` AS `bdanggarancabang`,`bd`.`bdanggaranlokasi` AS `bdanggaranlokasi`,`bd`.`bdanggarancostcenter` AS `bdanggarancostcenter`,`bd`.`bdanggarandivisi` AS `bdanggarandivisi`,`bd`.`bdanggaransubdivisi` AS `bdanggaransubdivisi`,`bd`.`bdanggaranproyek` AS `bdanggaranproyek`,`bd`.`bduraian` AS `bduraian`,`bd`.`bdcatatan` AS `bdcatatan`,`bd`.`bdmatauang` AS `bdmatauang`,`bd`.`bdkurs` AS `bdkurs`,`bd`.`bdstatus` AS `bdstatus`,`bd`.`bdstatussebelumnya` AS `bdstatussebelumnya`,`bd`.`bdjmlrevisi` AS `bdjmlrevisi`,`bd`.`bdcetakanke` AS `bdcetakanke`,`bd`.`bdisclose` AS `bdisclose`,`bd`.`bdinputuser` AS `bdinputuser`,`bd`.`bdinputtgl` AS `bdinputtgl`,`bd`.`bdmodifikasiuser` AS `bdmodifikasiuser`,`bd`.`bdmodifikasitgl` AS `bdmodifikasitgl`,`bd`.`bdposting` AS `bdposting`,`bd`.`bdpostingtgl` AS `bdpostingtgl`,`br`.`bnama` AS `bdcabangnama`,`lc`.`lnama` AS `bdlokasinama`,`c`.`kkode` AS `bdkontakkode`,`c`.`knama` AS `bdkontaknama`,`rc`.`nama` AS `bdanggarankategorinama`,`br2`.`bnama` AS `bdanggarancabangnama`,`lc2`.`lnama` AS `bdanggaranlokasinama`,`cc2`.`ccnama` AS `bdanggarancostcenternama`,`d2`.`dnama` AS `bdanggarandivisinama`,`sd2`.`sdnama` AS `bdanggaransubdivisinama`,`p2`.`pnama` AS `bdanggaranproyeknama`,`st1`.`nama` AS `bdstatusnama`,`st2`.`nama` AS `bdstatussebelumnyanama`,`u1`.`unama` AS `bdinputusernama`,`u2`.`unama` AS `bdmodifikasiusernama` from ((((((((((((((`m2_bd` `bd` join `m0_status` `st1` on((`bd`.`bdstatus` = `st1`.`kode`))) join `m0_status` `st2` on((`bd`.`bdstatussebelumnya` = `st2`.`kode`))) join `m0_realization_category` `rc` on((`bd`.`bdanggarankategori` = `rc`.`kode`))) left join `m1_branch` `br` on((`bd`.`bdcabang` = `br`.`bkode`))) left join `m1_location` `lc` on((`bd`.`bdlokasi` = `lc`.`lkode`))) left join `m1_contact` `c` on((`bd`.`bdkontak` = `c`.`kid`))) left join `m1_branch` `br2` on((`bd`.`bdanggarancabang` = `br2`.`bkode`))) left join `m1_location` `lc2` on((`bd`.`bdanggaranlokasi` = `lc2`.`lkode`))) left join `m1_cost_center` `cc2` on((`bd`.`bdanggarancostcenter` = `cc2`.`cckode`))) left join `m1_division` `d2` on((`bd`.`bdanggarandivisi` = `d2`.`dkode`))) left join `m1_subdivision` `sd2` on((`bd`.`bdanggaransubdivisi` = `sd2`.`sdkode`))) left join `m1_project` `p2` on((`bd`.`bdanggaranproyek` = `p2`.`pkode`))) left join `m0_user` `u1` on((`bd`.`bdinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`bd`.`bdmodifikasiuser` = `u2`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_bd_history.vb`

```sql
INSERT INTO m2_bd_history(SELECT 0, bd.* FROM m2_bd bd WHERE bd.bdid = '{idtransaksi}')
```

```sql
SELECT bdidhistory FROM m2_bd_history WHERE bdid = '{idtransaksi}' ORDER BY bdmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m2_bd_detail_history (SELECT 0, '{result_4}', bd.* FROM m2_bd_detail bd WHERE bd.idbd = '{idtransaksi}' )
```

```sql
select `bd`.`bdidhistory` AS `bdidhistory`,`bd`.`bdid` AS `bdid`,`bd`.`bdcabang` AS `bdcabang`,`bd`.`bdlokasi` AS `bdlokasi`,`bd`.`bdsumber` AS `bdsumber`,`bd`.`bdautonotransaksi` AS `bdautonotransaksi`,`bd`.`bdnotransaksi` AS `bdnotransaksi`,`bd`.`bdtgl` AS `bdtgl`,`bd`.`bdtglanggaran` AS `bdtglanggaran`,`bd`.`bdkodepa` AS `bdkodepa`,`bd`.`bdkontak` AS `bdkontak`,`bd`.`bdkontakperson` AS `bdkontakperson`,`bd`.`bdanggarankategori` AS `bdanggarankategori`,`bd`.`bdanggarancabang` AS `bdanggarancabang`,`bd`.`bdanggaranlokasi` AS `bdanggaranlokasi`,`bd`.`bdanggarancostcenter` AS `bdanggarancostcenter`,`bd`.`bdanggarandivisi` AS `bdanggarandivisi`,`bd`.`bdanggaransubdivisi` AS `bdanggaransubdivisi`,`bd`.`bdanggaranproyek` AS `bdanggaranproyek`,`bd`.`bduraian` AS `bduraian`,`bd`.`bdcatatan` AS `bdcatatan`,`bd`.`bdmatauang` AS `bdmatauang`,`bd`.`bdkurs` AS `bdkurs`,`bd`.`bdstatus` AS `bdstatus`,`bd`.`bdstatussebelumnya` AS `bdstatussebelumnya`,`bd`.`bdjmlrevisi` AS `bdjmlrevisi`,`bd`.`bdcetakanke` AS `bdcetakanke`,`bd`.`bdisclose` AS `bdisclose`,`bd`.`bdinputuser` AS `bdinputuser`,`bd`.`bdinputtgl` AS `bdinputtgl`,`bd`.`bdmodifikasiuser` AS `bdmodifikasiuser`,`bd`.`bdmodifikasitgl` AS `bdmodifikasitgl`,`bd`.`bdposting` AS `bdposting`,`bd`.`bdpostingtgl` AS `bdpostingtgl`,`br`.`bnama` AS `bdcabangnama`,`lc`.`lnama` AS `bdlokasinama`,`c`.`kkode` AS `bdkontakkode`,`c`.`knama` AS `bdkontaknama`,`rc`.`nama` AS `bdanggarankategorinama`,`br2`.`bnama` AS `bdanggarancabangnama`,`lc2`.`lnama` AS `bdanggaranlokasinama`,`cc2`.`ccnama` AS `bdanggarancostcenternama`,`d2`.`dnama` AS `bdanggarandivisinama`,`sd2`.`sdnama` AS `bdanggaransubdivisinama`,`p2`.`pnama` AS `bdanggaranproyeknama`,`st1`.`nama` AS `bdstatusnama`,`st2`.`nama` AS `bdstatussebelumnyanama`,`u1`.`unama` AS `bdinputusernama`,`u2`.`unama` AS `bdmodifikasiusernama` from ((((((((((((((`m2_bd_history` `bd` join `m0_status` `st1` on((`bd`.`bdstatus` = `st1`.`kode`))) join `m0_status` `st2` on((`bd`.`bdstatussebelumnya` = `st2`.`kode`))) join `m0_realization_category` `rc` on((`bd`.`bdanggarankategori` = `rc`.`kode`))) left join `m1_branch` `br` on((`bd`.`bdcabang` = `br`.`bkode`))) left join `m1_location` `lc` on((`bd`.`bdlokasi` = `lc`.`lkode`))) left join `m1_contact` `c` on((`bd`.`bdkontak` = `c`.`kid`))) left join `m1_branch` `br2` on((`bd`.`bdanggarancabang` = `br2`.`bkode`))) left join `m1_location` `lc2` on((`bd`.`bdanggaranlokasi` = `lc2`.`lkode`))) left join `m1_cost_center` `cc2` on((`bd`.`bdanggarancostcenter` = `cc2`.`cckode`))) left join `m1_division` `d2` on((`bd`.`bdanggarandivisi` = `d2`.`dkode`))) left join `m1_subdivision` `sd2` on((`bd`.`bdanggaransubdivisi` = `sd2`.`sdkode`))) left join `m1_project` `p2` on((`bd`.`bdanggaranproyek` = `p2`.`pkode`))) left join `m0_user` `u1` on((`bd`.`bdinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`bd`.`bdmodifikasiuser` = `u2`.`userid`)))
```

```sql
select `bd`.`bdidhistory` AS `bdidhistory`,`bd`.`bdid` AS `bdid`,`bd`.`bdcabang` AS `bdcabang`,`bd`.`bdlokasi` AS `bdlokasi`,`bd`.`bdsumber` AS `bdsumber`,`bd`.`bdautonotransaksi` AS `bdautonotransaksi`,`bd`.`bdnotransaksi` AS `bdnotransaksi`,`bd`.`bdtgl` AS `bdtgl`,`bd`.`bdtglanggaran` AS `bdtglanggaran`,`bd`.`bdkodepa` AS `bdkodepa`,`bd`.`bdkontak` AS `bdkontak`,`bd`.`bdkontakperson` AS `bdkontakperson`,`bd`.`bdanggarankategori` AS `bdanggarankategori`,`bd`.`bdanggarancabang` AS `bdanggarancabang`,`bd`.`bdanggaranlokasi` AS `bdanggaranlokasi`,`bd`.`bdanggarancostcenter` AS `bdanggarancostcenter`,`bd`.`bdanggarandivisi` AS `bdanggarandivisi`,`bd`.`bdanggaransubdivisi` AS `bdanggaransubdivisi`,`bd`.`bdanggaranproyek` AS `bdanggaranproyek`,`bd`.`bduraian` AS `bduraian`,`bd`.`bdcatatan` AS `bdcatatan`,`bd`.`bdmatauang` AS `bdmatauang`,`bd`.`bdkurs` AS `bdkurs`,`bd`.`bdstatus` AS `bdstatus`,`bd`.`bdstatussebelumnya` AS `bdstatussebelumnya`,`bd`.`bdjmlrevisi` AS `bdjmlrevisi`,`bd`.`bdcetakanke` AS `bdcetakanke`,`bd`.`bdisclose` AS `bdisclose`,`bd`.`bdinputuser` AS `bdinputuser`,`bd`.`bdinputtgl` AS `bdinputtgl`,`bd`.`bdmodifikasiuser` AS `bdmodifikasiuser`,`bd`.`bdmodifikasitgl` AS `bdmodifikasitgl`,`bd`.`bdposting` AS `bdposting`,`bd`.`bdpostingtgl` AS `bdpostingtgl`,`bd`.`bdcustomtext1` AS `bdcustomtext1`,`bd`.`bdcustomtext2` AS `bdcustomtext2`,`bd`.`bdcustomtext3` AS `bdcustomtext3`,`bd`.`bdcustomtext4` AS `bdcustomtext4`,`bd`.`bdcustomtext5` AS `bdcustomtext5`,`bd`.`bdcustomint1` AS `bdcustomint1`,`bd`.`bdcustomint2` AS `bdcustomint2`,`bd`.`bdcustomint3` AS `bdcustomint3`,`bd`.`bdcustomdbl1` AS `bdcustomdbl1`,`bd`.`bdcustomdbl2` AS `bdcustomdbl2`,`bd`.`bdcustomdbl3` AS `bdcustomdbl3`,`bd`.`bdcustomdate1` AS `bdcustomdate1`,`bd`.`bdcustomdate2` AS `bdcustomdate2`,`bd`.`bdcustomdate3` AS `bdcustomdate3`,`br`.`bnama` AS `bdcabangnama`,`lc`.`lnama` AS `bdlokasinama`,`c`.`kkode` AS `bdkontakkode`,`c`.`knama` AS `bdkontaknama`,`rc`.`nama` AS `bdanggarankategorinama`,`br2`.`bnama` AS `bdanggarancabangnama`,`lc2`.`lnama` AS `bdanggaranlokasinama`,`cc2`.`ccnama` AS `bdanggarancostcenternama`,`d2`.`dnama` AS `bdanggarandivisinama`,`sd2`.`sdnama` AS `bdanggaransubdivisinama`,`p2`.`pnama` AS `bdanggaranproyeknama`,`st1`.`nama` AS `bdstatusnama`,`st2`.`nama` AS `bdstatussebelumnyanama`,`u1`.`unama` AS `bdinputusernama`,`u2`.`unama` AS `bdmodifikasiusernama`,`bdd`.`idhistorydetail` AS `idhistorydetail`,`bdd`.`idhistory` AS `idhistory`,`bdd`.`idbddetail` AS `idbddetail`,`bdd`.`idbd` AS `idbd`,`bdd`.`norek` AS `norek`,`bdd`.`matauang` AS `matauang`,`bdd`.`kurs` AS `kurs`,`bdd`.`jumlah` AS `jumlah`,`bdd`.`jumlahvalas` AS `jumlahvalas`,`bdd`.`catatan` AS `catatan`,`bdd`.`costcenter` AS `costcenter`,`bdd`.`divisi` AS `divisi`,`bdd`.`subdivisi` AS `subdivisi`,`bdd`.`proyek` AS `proyek`,`bdd`.`urutan` AS `urutan`,`bdd`.`isclose` AS `isclose`,`bdd`.`customtext1` AS `customtext1`,`bdd`.`customtext2` AS `customtext2`,`bdd`.`customtext3` AS `customtext3`,`bdd`.`customdbl1` AS `customdbl1`,`bdd`.`customdbl2` AS `customdbl2`,`bdd`.`customdbl3` AS `customdbl3`,`bdd`.`customdate1` AS `customdate1`,`bdd`.`customdate2` AS `customdate2`,`bdd`.`customdate3` AS `customdate3`,`coa`.`cnama` AS `noreknama` from ((((((((((((((((`m2_bd_history` `bd` join `m0_status` `st1` on((`bd`.`bdstatus` = `st1`.`kode`))) join `m0_status` `st2` on((`bd`.`bdstatussebelumnya` = `st2`.`kode`))) join `m0_realization_category` `rc` on((`bd`.`bdanggarankategori` = `rc`.`kode`))) join `m2_bd_detail_history` `bdd` on((`bd`.`bdidhistory` = `bdd`.`idhistory`))) left join `m1_branch` `br` on((`bd`.`bdcabang` = `br`.`bkode`))) left join `m1_location` `lc` on((`bd`.`bdlokasi` = `lc`.`lkode`))) left join `m1_contact` `c` on((`bd`.`bdkontak` = `c`.`kid`))) left join `m1_branch` `br2` on((`bd`.`bdanggarancabang` = `br2`.`bkode`))) left join `m1_location` `lc2` on((`bd`.`bdanggaranlokasi` = `lc2`.`lkode`))) left join `m1_cost_center` `cc2` on((`bd`.`bdanggarancostcenter` = `cc2`.`cckode`))) left join `m1_division` `d2` on((`bd`.`bdanggarandivisi` = `d2`.`dkode`))) left join `m1_subdivision` `sd2` on((`bd`.`bdanggaransubdivisi` = `sd2`.`sdkode`))) left join `m1_project` `p2` on((`bd`.`bdanggaranproyek` = `p2`.`pkode`))) left join `m0_user` `u1` on((`bd`.`bdinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`bd`.`bdmodifikasiuser` = `u2`.`userid`))) left join `m1_coa` `coa` on((`bdd`.`norek` = `coa`.`cnomor`)))
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_cb.vb`

```sql
SELECT COUNT(cbid), cbnotransaksi FROM M2_cb WHERE cbid='{result_4}' AND cbstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(cbid) FROM m2_cb WHERE cbnotransaksi='{notransaksi}'
```

```sql
Update M2_cb set cbcabang = '{FixQuotes_drutama}cbcabang', cblokasi = '{FixQuotes_drutama}cblokasi', cbsumber = '{FixQuotes_drutama}cbsumber', cbautonotransaksi = {drutama}cbautonotransaksi, cbnotransaksi = '{notransaksi}', cbtgl = '{FixQuotes_AsFormatTanggal_drutama}cbtgl', cbkodepa = {drutama}cbkodepa, cbkontak = {drutama}cbkontak, cbkontakperson = '{FixQuotes_drutama}cbkontakperson', cburaian = '{FixQuotes_drutama}cburaian', cbcatatan = '{FixQuotes_drutama}cbcatatan', cbmatauang = '{FixQuotes_drutama}cbmatauang', cbkurs = '{FixDouble_drutama}cbkurs', cbdebit = '{FixDouble_drutama}cbdebit', cbdebitvalas = '{FixDouble_drutama}cbdebitvalas', cbkredit = '{FixDouble_drutama}cbkredit', cbkreditvalas = '{FixDouble_drutama}cbkreditvalas', cbjumlahbayar = '{FixDouble_drutama}cbjumlahbayar', cbjumlahbayarvalas = '{FixDouble_drutama}cbjumlahbayarvalas', cbstatusbayar = {drutama}cbstatusbayar, cbtgllunas = '{FixQuotes_AsFormatTanggal_drutama}cbtgllunas', cbstatus = {drutama}cbstatus, cbstatussebelumnya = {drutama}cbstatussebelumnya, cbjmlrevisi = cbjmlrevisi+1, cbcetakanke = {drutama}cbcetakanke, cbisclose = {drutama}cbisclose, cbmodifikasiuser = {drutama}cbmodifikasiuser, cbmodifikasitgl = NOW(), cbposting = 0, cbcustomtext1 = '{FixQuotes_drutama}cbcustomtext1', cbcustomtext2 = '{FixQuotes_drutama}cbcustomtext2', cbcustomtext3 = '{FixQuotes_drutama}cbcustomtext3', cbcustomtext4 = '{FixQuotes_drutama}cbcustomtext4', cbcustomtext5 = '{FixQuotes_drutama}cbcustomtext5', cbcustomint1 = {drutama}cbcustomint1, cbcustomint2 = {drutama}cbcustomint2, cbcustomint3 = {drutama}cbcustomint3, cbcustomdbl1 = '{FixDouble_drutama}cbcustomdbl1', cbcustomdbl2 = '{FixDouble_drutama}cbcustomdbl2', cbcustomdbl3 = '{FixDouble_drutama}cbcustomdbl3', cbcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}cbcustomdate1', cbcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}cbcustomdate2', cbcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}cbcustomdate3' where cbid = '{drutama}cbid'
```

```sql
Insert into M2_cb (cbcabang, cblokasi, cbsumber, cbautonotransaksi, cbnotransaksi, cbtgl, cbkodepa, cbkontak, cbkontakperson, cburaian, cbcatatan, cbmatauang, cbkurs, cbdebit, cbdebitvalas, cbkredit, cbkreditvalas, cbjumlahbayar, cbjumlahbayarvalas, cbstatusbayar, cbtgllunas, cbstatus, cbstatussebelumnya, cbjmlrevisi, cbcetakanke, cbisclose, cbinputuser, cbinputtgl, cbmodifikasiuser, cbmodifikasitgl, cbposting, cbcustomtext1, cbcustomtext2, cbcustomtext3, cbcustomtext4, cbcustomtext5, cbcustomint1, cbcustomint2, cbcustomint3, cbcustomdbl1, cbcustomdbl2, cbcustomdbl3, cbcustomdate1, cbcustomdate2, cbcustomdate3) values('{FixQuotes_drutama}cbcabang', '{FixQuotes_drutama}cblokasi', '{FixQuotes_drutama}cbsumber', {drutama}cbautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}cbtgl', {drutama}cbkodepa, {drutama}cbkontak, '{FixQuotes_drutama}cbkontakperson', '{FixQuotes_drutama}cburaian', '{FixQuotes_drutama}cbcatatan', '{FixQuotes_drutama}cbmatauang', '{FixDouble_drutama}cbkurs', '{FixDouble_drutama}cbdebit', '{FixDouble_drutama}cbdebitvalas', '{FixDouble_drutama}cbkredit', '{FixDouble_drutama}cbkreditvalas', '{FixDouble_drutama}cbjumlahbayar', '{FixDouble_drutama}cbjumlahbayarvalas', {drutama}cbstatusbayar, '{FixQuotes_AsFormatTanggal_drutama}cbtgllunas', {drutama}cbstatus, {drutama}cbstatussebelumnya, {drutama}cbjmlrevisi, {drutama}cbcetakanke, {drutama}cbisclose, {drutama}cbinputuser, NOW(), {drutama}cbmodifikasiuser, '1971-01-01 00:00:00', 0, '{FixQuotes_drutama}cbcustomtext1', '{FixQuotes_drutama}cbcustomtext2', '{FixQuotes_drutama}cbcustomtext3', '{FixQuotes_drutama}cbcustomtext4', '{FixQuotes_drutama}cbcustomtext5', {drutama}cbcustomint1, {drutama}cbcustomint2, {drutama}cbcustomint3, '{FixDouble_drutama}cbcustomdbl1', '{FixDouble_drutama}cbcustomdbl2', '{FixDouble_drutama}cbcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}cbcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}cbcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}cbcustomdate3')
```

```sql
select cbid from M2_cb where cbnotransaksi='{notransaksi}' AND cbinputuser= '{userid}' order by cbmodifikasitgl desc limit 1
```

```sql
Delete from M2_cb_Detail where idcb = '{result_4}'
```

```sql
Insert into M2_cb_Detail(idcbdetail, idcb, norek, matauang, kurs, debit, debitvalas, kredit, kreditvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
Delete from M2_Cb_Pay where idcb = '{result_4}'
```

```sql
Insert into M2_Cb_Pay(idcbcarabayar, idcb, jenisgiro, matauang, kurs, jumlah, jumlahvalas, nogiro, tgljt, bank, noacbank, rekbank, rekgiro, catatan, urutan) values{strValue2_ToString}
```

```sql
Insert into M2_Giro_List(glnogiro, glsumber, glidtransaksi, glnotransaksi, glkontak, glrekbank, glrekgiro, gljenis, glbank, glnoacbank, glmatauang, glkurs, gljumlah, gljumlahvalas, gltgljthtempo, gltglcair, glstatus, glstatussebelumnya, glurutan) values{strGiro_ToString}
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Cbtgl, Cbnotransaksi, Cbstatus FROM m2_Cb WHERE Cbid='{idtransaksi}'
```

```sql
SELECT glnogiro FROM m2_giro_list WHERE glsumber = 'Cb' AND glidtransaksi = '{idtransaksi}' AND glnotransaksi = '{notransaksi}' AND glstatus <> 0
```

```sql
DELETE FROM M2_Transaction_Journal WHERE tsumber = 'Cb' AND tidtransaksi = '{idtransaksi}' AND tnotransaksi = '{notransaksi}'
```

```sql
DELETE FROM m2_giro_list WHERE glsumber = 'Cb' AND glidtransaksi = '{idtransaksi}' AND glnotransaksi = '{notransaksi}'
```

```sql
UPDATE M2_Cb SET Cbstatus = {nilaiStatus}, Cbmodifikasiuser='{userid}', Cbmodifikasitgl = NOW(), Cbposting = 0, Cbpostingtgl = '1971-01-01 00:00:00', Cbjmlrevisi = Cbjmlrevisi + 1 WHERE Cbid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Cbid, Cbnotransaksi FROM M2_Cb WHERE Cbid='{idtransaksi}'
```

```sql
DELETE FROM M2_Cb_Pay WHERE idCb = '{idtransaksi}'
```

```sql
DELETE FROM M2_Cb_Detail WHERE idCb = '{idtransaksi}'
```

```sql
DELETE FROM M2_Cb WHERE Cbid = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_cb_history.vb`

```sql
INSERT INTO m2_cb_history(SELECT 0, cb.* FROM m2_cb cb WHERE cb.cbid = '{idtransaksi}')
```

```sql
SELECT cbidhistory FROM m2_cb_history WHERE cbid = '{idtransaksi}' ORDER BY cbmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m2_cb_detail_history (SELECT 0, '{result_4}', cb.* FROM m2_cb_detail cb WHERE cb.idcb = '{idtransaksi}' )
```

```sql
INSERT INTO m2_cb_pay_history (SELECT 0, '{result_4}', cb.* FROM m2_cb_pay cb WHERE cb.idcb = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_cd.vb`

```sql
SELECT COUNT(cdid), cdnotransaksi FROM M2_Cd WHERE cdid='{result_4}' AND cdstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(cdid) FROM m2_cd WHERE cdnotransaksi='{notransaksi}'
```

```sql
Update M2_Cd set cdcabang = '{FixQuotes_drutama}cdcabang', cdlokasi = '{FixQuotes_drutama}cdlokasi', cdsumber = '{FixQuotes_drutama}cdsumber', cdautonotransaksi = {drutama}cdautonotransaksi, cdnotransaksi = '{notransaksi}', cdtgl = '{FixQuotes_AsFormatTanggal_drutama}cdtgl', cdkodepa = {drutama}cdkodepa, cdkontak = {drutama}cdkontak, cdkontakperson = '{FixQuotes_drutama}cdkontakperson', cdnorek = '{FixQuotes_drutama}cdnorek', cduraian = '{FixQuotes_drutama}cduraian', cdcatatan = '{FixQuotes_drutama}cdcatatan', cdmatauang = '{FixQuotes_drutama}cdmatauang', cdkurs = '{FixDouble_drutama}cdkurs', cdjumlah = '{FixDouble_drutama}cdjumlah', cdjumlahvalas = '{FixDouble_drutama}cdjumlahvalas', cdjumlahbayar = '{FixDouble_drutama}cdjumlahbayar', cdjumlahbayarvalas = '{FixDouble_drutama}cdjumlahbayarvalas', cdstatusbayar = {drutama}cdstatusbayar, cdtgllunas = '{FixQuotes_AsFormatTanggal_drutama}cdtgllunas', cdstatus = {drutama}cdstatus, cdstatussebelumnya = {drutama}cdstatussebelumnya, cdjmlrevisi = cdjmlrevisi + 1, cdcetakanke = {drutama}cdcetakanke, cdisclose = {drutama}cdisclose, cdmodifikasiuser = {drutama}cdmodifikasiuser, cdmodifikasitgl = NOW(), cdposting = 0, cdcustomtext1 = '{FixQuotes_drutama}cdcustomtext1', cdcustomtext2 = '{FixQuotes_drutama}cdcustomtext2', cdcustomtext3 = '{FixQuotes_drutama}cdcustomtext3', cdcustomtext4 = '{FixQuotes_drutama}cdcustomtext4', cdcustomtext5 = '{FixQuotes_drutama}cdcustomtext5', cdcustomint1 = {drutama}cdcustomint1, cdcustomint2 = {drutama}cdcustomint2, cdcustomint3 = {drutama}cdcustomint3, cdcustomdbl1 = '{FixDouble_drutama}cdcustomdbl1', cdcustomdbl2 = '{FixDouble_drutama}cdcustomdbl2', cdcustomdbl3 = '{FixDouble_drutama}cdcustomdbl3', cdcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}cdcustomdate1', cdcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}cdcustomdate2', cdcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}cdcustomdate3' where cdid = '{drutama}cdid'
```

```sql
Insert into M2_Cd (cdcabang, cdlokasi, cdsumber, cdautonotransaksi, cdnotransaksi, cdtgl, cdkodepa, cdkontak, cdkontakperson, cdnorek, cduraian, cdcatatan, cdmatauang, cdkurs, cdjumlah, cdjumlahvalas, cdjumlahbayar, cdjumlahbayarvalas, cdstatusbayar, cdtgllunas, cdstatus, cdstatussebelumnya, cdjmlrevisi, cdcetakanke, cdisclose, cdinputuser, cdinputtgl, cdmodifikasiuser, cdmodifikasitgl, cdposting, cdcustomtext1, cdcustomtext2, cdcustomtext3, cdcustomtext4, cdcustomtext5, cdcustomint1, cdcustomint2, cdcustomint3, cdcustomdbl1, cdcustomdbl2, cdcustomdbl3, cdcustomdate1, cdcustomdate2, cdcustomdate3) values('{FixQuotes_drutama}cdcabang', '{FixQuotes_drutama}cdlokasi', '{FixQuotes_drutama}cdsumber', {drutama}cdautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}cdtgl', {drutama}cdkodepa, {drutama}cdkontak, '{FixQuotes_drutama}cdkontakperson', '{FixQuotes_drutama}cdnorek', '{FixQuotes_drutama}cduraian', '{FixQuotes_drutama}cdcatatan', '{FixQuotes_drutama}cdmatauang', '{FixDouble_drutama}cdkurs', '{FixDouble_drutama}cdjumlah', '{FixDouble_drutama}cdjumlahvalas', '{FixDouble_drutama}cdjumlahbayar', '{FixDouble_drutama}cdjumlahbayarvalas', {drutama}cdstatusbayar, '{FixQuotes_AsFormatTanggal_drutama}cdtgllunas', {drutama}cdstatus, {drutama}cdstatussebelumnya, {drutama}cdjmlrevisi, {drutama}cdcetakanke, {drutama}cdisclose, {drutama}cdinputuser, NOW(), {drutama}cdmodifikasiuser, '1971-01-01 00:00:00', 0, '{FixQuotes_drutama}cdcustomtext1', '{FixQuotes_drutama}cdcustomtext2', '{FixQuotes_drutama}cdcustomtext3', '{FixQuotes_drutama}cdcustomtext4', '{FixQuotes_drutama}cdcustomtext5', {drutama}cdcustomint1, {drutama}cdcustomint2, {drutama}cdcustomint3, '{FixDouble_drutama}cdcustomdbl1', '{FixDouble_drutama}cdcustomdbl2', '{FixDouble_drutama}cdcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}cdcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}cdcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}cdcustomdate3')
```

```sql
select cdid from M2_Cd where cdnotransaksi='{notransaksi}' AND Cdinputuser= '{userid}' order by Cdmodifikasitgl desc limit 1
```

```sql
Delete from M2_Cd_Detail where idcd = '{result_4}'
```

```sql
Insert into M2_Cd_Detail(idcddetail, idcd, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Cdtgl, Cdnotransaksi, Cdstatus FROM m2_Cd WHERE Cdid='{idtransaksi}'
```

```sql
DELETE FROM M2_Transaction_Journal WHERE tsumber = 'CD' AND tidtransaksi = '{idtransaksi}' AND tnotransaksi = '{notransaksi}'
```

```sql
UPDATE M2_Cd SET Cdstatus = {nilaiStatus}, Cdmodifikasiuser='{userid}', Cdmodifikasitgl = NOW(), Cdposting = 0, Cdpostingtgl = '1971-01-01 00:00:00', Cdjmlrevisi = Cdjmlrevisi + 1 WHERE Cdid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Cdid, Cdnotransaksi FROM m2_Cd WHERE Cdid='{idtransaksi}'
```

```sql
DELETE FROM M2_Cd_Detail WHERE idCd = '{idtransaksi}'
```

```sql
DELETE FROM M2_Cd WHERE Cdid = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_cd_history.vb`

```sql
INSERT INTO m2_cd_history(SELECT 0, cd.* FROM m2_cd cd WHERE cd.cdid = '{idtransaksi}')
```

```sql
SELECT cdidhistory FROM m2_cd_history WHERE cdid = '{idtransaksi}' ORDER BY cdmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m2_cd_detail_history (SELECT 0, '{result_4}', cd.* FROM m2_cd_detail cd WHERE cd.idcd = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_cr.vb`

```sql
SELECT COUNT(crid), crnotransaksi FROM M2_Cr WHERE crid='{result_4}' AND crstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(crid) FROM m2_cr WHERE crnotransaksi='{notransaksi}'
```

```sql
Update M2_Cr set crcabang = '{FixQuotes_drutama}crcabang', crlokasi = '{FixQuotes_drutama}crlokasi', crsumber = '{FixQuotes_drutama}crsumber', crautonotransaksi = {drutama}crautonotransaksi, crnotransaksi = '{notransaksi}', crtgl = '{FixQuotes_AsFormatTanggal_drutama}crtgl', crkodepa = {drutama}crkodepa, crkontak = {drutama}crkontak, crkontakperson = '{FixQuotes_drutama}crkontakperson', crnorek = '{FixQuotes_drutama}crnorek', cruraian = '{FixQuotes_drutama}cruraian', crcatatan = '{FixQuotes_drutama}crcatatan', crmatauang = '{FixQuotes_drutama}crmatauang', crkurs = '{FixDouble_drutama}crkurs', crjumlah = '{FixDouble_drutama}crjumlah', crjumlahvalas = '{FixDouble_drutama}crjumlahvalas', crjumlahbayar = '{FixDouble_drutama}crjumlahbayar', crjumlahbayarvalas = '{FixDouble_drutama}crjumlahbayarvalas', crstatusbayar = {drutama}crstatusbayar, crtgllunas = '{FixQuotes_AsFormatTanggal_drutama}crtgllunas', crstatus = {drutama}crstatus, crstatussebelumnya = {drutama}crstatussebelumnya, crjmlrevisi = crjmlrevisi+1, crcetakanke = {drutama}crcetakanke, crisclose = {drutama}crisclose, crmodifikasiuser = {drutama}crmodifikasiuser, crmodifikasitgl = NOW(), crposting = 0, crcustomtext1 = '{FixQuotes_drutama}crcustomtext1', crcustomtext2 = '{FixQuotes_drutama}crcustomtext2', crcustomtext3 = '{FixQuotes_drutama}crcustomtext3', crcustomtext4 = '{FixQuotes_drutama}crcustomtext4', crcustomtext5 = '{FixQuotes_drutama}crcustomtext5', crcustomint1 = {drutama}crcustomint1, crcustomint2 = {drutama}crcustomint2, crcustomint3 = {drutama}crcustomint3, crcustomdbl1 = '{FixDouble_drutama}crcustomdbl1', crcustomdbl2 = '{FixDouble_drutama}crcustomdbl2', crcustomdbl3 = '{FixDouble_drutama}crcustomdbl3', crcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}crcustomdate1', crcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}crcustomdate2', crcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}crcustomdate3' where crid = '{drutama}crid'
```

```sql
Insert into M2_Cr (crcabang, crlokasi, crsumber, crautonotransaksi, crnotransaksi, crtgl, crkodepa, crkontak, crkontakperson, crnorek, cruraian, crcatatan, crmatauang, crkurs, crjumlah, crjumlahvalas, crjumlahbayar, crjumlahbayarvalas, crstatusbayar, crtgllunas, crstatus, crstatussebelumnya, crjmlrevisi, crcetakanke, crisclose, crinputuser, crinputtgl, crmodifikasiuser, crmodifikasitgl, crposting, crcustomtext1, crcustomtext2, crcustomtext3, crcustomtext4, crcustomtext5, crcustomint1, crcustomint2, crcustomint3, crcustomdbl1, crcustomdbl2, crcustomdbl3, crcustomdate1, crcustomdate2, crcustomdate3) values('{FixQuotes_drutama}crcabang', '{FixQuotes_drutama}crlokasi', '{FixQuotes_drutama}crsumber', {drutama}crautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}crtgl', {drutama}crkodepa, {drutama}crkontak, '{FixQuotes_drutama}crkontakperson', '{FixQuotes_drutama}crnorek', '{FixQuotes_drutama}cruraian', '{FixQuotes_drutama}crcatatan', '{FixQuotes_drutama}crmatauang', '{FixDouble_drutama}crkurs', '{FixDouble_drutama}crjumlah', '{FixDouble_drutama}crjumlahvalas', '{FixDouble_drutama}crjumlahbayar', '{FixDouble_drutama}crjumlahbayarvalas', {drutama}crstatusbayar, '{FixQuotes_AsFormatTanggal_drutama}crtgllunas', {drutama}crstatus, {drutama}crstatussebelumnya, {drutama}crjmlrevisi, {drutama}crcetakanke, {drutama}crisclose, {drutama}crinputuser, NOW(), {drutama}crmodifikasiuser, '1971-01-01 00:00:00', 0, '{FixQuotes_drutama}crcustomtext1', '{FixQuotes_drutama}crcustomtext2', '{FixQuotes_drutama}crcustomtext3', '{FixQuotes_drutama}crcustomtext4', '{FixQuotes_drutama}crcustomtext5', {drutama}crcustomint1, {drutama}crcustomint2, {drutama}crcustomint3, '{FixDouble_drutama}crcustomdbl1', '{FixDouble_drutama}crcustomdbl2', '{FixDouble_drutama}crcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}crcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}crcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}crcustomdate3')
```

```sql
select crid from M2_Cr where crnotransaksi='{notransaksi}' AND Crinputuser= '{userid}' order by Crmodifikasitgl desc limit 1
```

```sql
Delete from M2_Cr_Detail where idcr = '{result_4}'
```

```sql
Insert into M2_Cr_Detail(idcrdetail, idcr, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Crtgl, Crnotransaksi, Crstatus FROM m2_Cr WHERE Crid='{idtransaksi}'
```

```sql
DELETE FROM M2_Transaction_Journal WHERE tsumber = 'CR' AND tidtransaksi = '{idtransaksi}' AND tnotransaksi = '{notransaksi}'
```

```sql
UPDATE M2_Cr SET Crstatus = {nilaiStatus}, crmodifikasiuser='{userid}', crmodifikasitgl = NOW(), crposting = 0, crpostingtgl = '1971-01-01 00:00:00', Crjmlrevisi = Crjmlrevisi + 1 WHERE crid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT crid, crnotransaksi FROM m2_cr WHERE crid='{idtransaksi}'
```

```sql
DELETE FROM M2_Cr_Detail WHERE idcr = '{idtransaksi}'
```

```sql
DELETE FROM M2_Cr WHERE crid = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_cr_history.vb`

```sql
INSERT INTO m2_cr_history(SELECT 0, cr.* FROM m2_cr cr WHERE cr.crid = '{idtransaksi}')
```

```sql
SELECT cridhistory FROM m2_cr_history WHERE crid = '{idtransaksi}' ORDER BY crmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m2_cr_detail_history (SELECT 0, '{result_4}', cr.* FROM m2_cr_detail cr WHERE cr.idcr = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_files.vb`

```sql
UPDATE m2_files SET fcatatan = CASE fnamafile {strValue1_ToString} ELSE fcatatan END, fukuranfile = CASE fnamafile {strValue2_ToString} ELSE fukuranfile END, ftanggal = CASE fnamafile {strValue3_ToString} ELSE ftanggal END WHERE fsumber='{sumber}' AND fidtransaksi='{idtrans}'
```

```sql
Insert into M2_Files(fsumber, fidtransaksi, fnamafile, fcatatan, fukuranfile, ftanggal, finputuser, finputtgl) values{strValue1_ToString}
```

```sql
DELETE FROM M2_Files WHERE fsumber = '{sumber}' AND fidtransaksi ='{idtransaksi}' AND fnamafile='{namafile}'
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_gj.vb`

```sql
SELECT COUNT(gjid), gjnotransaksi FROM M2_gj WHERE gjid='{result_4}' AND gjstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(gjid) FROM m2_gj WHERE gjnotransaksi='{notransaksi}'
```

```sql
Update M2_Gj set gjcabang = '{FixQuotes_drutama}gjcabang', gjlokasi = '{FixQuotes_drutama}gjlokasi', gjsumber = '{FixQuotes_drutama}gjsumber', gjautonotransaksi = {drutama}gjautonotransaksi, gjnotransaksi = '{notransaksi}', gjtgl = '{FixQuotes_AsFormatTanggal_drutama}gjtgl', gjkodepa = {drutama}gjkodepa, gjkontak = {drutama}gjkontak, gjkontakperson = '{FixQuotes_drutama}gjkontakperson', gjuraian = '{FixQuotes_drutama}gjuraian', gjcatatan = '{FixQuotes_drutama}gjcatatan', gjmatauang = '{FixQuotes_drutama}gjmatauang', gjkurs = '{FixDouble_drutama}gjkurs', gjdebit = '{FixDouble_drutama}gjdebit', gjdebitvalas = '{FixDouble_drutama}gjdebitvalas', gjkredit = '{FixDouble_drutama}gjkredit', gjkreditvalas = '{FixDouble_drutama}gjkreditvalas', gjjumlahbayar = '{FixDouble_drutama}gjjumlahbayar', gjjumlahbayarvalas = '{FixDouble_drutama}gjjumlahbayarvalas', gjstatusbayar = {drutama}gjstatusbayar, gjtgllunas = '{FixQuotes_AsFormatTanggal_drutama}gjtgllunas', gjstatus = {drutama}gjstatus, gjstatussebelumnya = {drutama}gjstatussebelumnya, gjjmlrevisi = gjjmlrevisi+1, gjcetakanke = {drutama}gjcetakanke, gjisclose = {drutama}gjisclose, gjmodifikasiuser = {drutama}gjmodifikasiuser, gjmodifikasitgl = NOW(), gjposting = 0, gjcustomtext1 = '{FixQuotes_drutama}gjcustomtext1', gjcustomtext2 = '{FixQuotes_drutama}gjcustomtext2', gjcustomtext3 = '{FixQuotes_drutama}gjcustomtext3', gjcustomtext4 = '{FixQuotes_drutama}gjcustomtext4', gjcustomtext5 = '{FixQuotes_drutama}gjcustomtext5', gjcustomint1 = {drutama}gjcustomint1, gjcustomint2 = {drutama}gjcustomint2, gjcustomint3 = {drutama}gjcustomint3, gjcustomdbl1 = '{FixDouble_drutama}gjcustomdbl1', gjcustomdbl2 = '{FixDouble_drutama}gjcustomdbl2', gjcustomdbl3 = '{FixDouble_drutama}gjcustomdbl3', gjcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}gjcustomdate1', gjcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}gjcustomdate2', gjcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}gjcustomdate3' where gjid = '{drutama}gjid'
```

```sql
Insert into M2_Gj (gjcabang, gjlokasi, gjsumber, gjautonotransaksi, gjnotransaksi, gjtgl, gjkodepa, gjkontak, gjkontakperson, gjuraian, gjcatatan, gjmatauang, gjkurs, gjdebit, gjdebitvalas, gjkredit, gjkreditvalas, gjjumlahbayar, gjjumlahbayarvalas, gjstatusbayar, gjtgllunas, gjstatus, gjstatussebelumnya, gjjmlrevisi, gjcetakanke, gjisclose, gjinputuser, gjinputtgl, gjmodifikasiuser, gjmodifikasitgl, gjposting, gjcustomtext1, gjcustomtext2, gjcustomtext3, gjcustomtext4, gjcustomtext5, gjcustomint1, gjcustomint2, gjcustomint3, gjcustomdbl1, gjcustomdbl2, gjcustomdbl3, gjcustomdate1, gjcustomdate2, gjcustomdate3) values('{FixQuotes_drutama}gjcabang', '{FixQuotes_drutama}gjlokasi', '{FixQuotes_drutama}gjsumber', {drutama}gjautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}gjtgl', {drutama}gjkodepa, {drutama}gjkontak, '{FixQuotes_drutama}gjkontakperson', '{FixQuotes_drutama}gjuraian', '{FixQuotes_drutama}gjcatatan', '{FixQuotes_drutama}gjmatauang', '{FixDouble_drutama}gjkurs', '{FixDouble_drutama}gjdebit', '{FixDouble_drutama}gjdebitvalas', '{FixDouble_drutama}gjkredit', '{FixDouble_drutama}gjkreditvalas', '{FixDouble_drutama}gjjumlahbayar', '{FixDouble_drutama}gjjumlahbayarvalas', {drutama}gjstatusbayar, '{FixQuotes_AsFormatTanggal_drutama}gjtgllunas', {drutama}gjstatus, {drutama}gjstatussebelumnya, {drutama}gjjmlrevisi, {drutama}gjcetakanke, {drutama}gjisclose, {drutama}gjinputuser, NOW(), {drutama}gjmodifikasiuser, '1971-01-01 00:00:00', 0, '{FixQuotes_drutama}gjcustomtext1', '{FixQuotes_drutama}gjcustomtext2', '{FixQuotes_drutama}gjcustomtext3', '{FixQuotes_drutama}gjcustomtext4', '{FixQuotes_drutama}gjcustomtext5', {drutama}gjcustomint1, {drutama}gjcustomint2, {drutama}gjcustomint3, '{FixDouble_drutama}gjcustomdbl1', '{FixDouble_drutama}gjcustomdbl2', '{FixDouble_drutama}gjcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}gjcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}gjcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}gjcustomdate3')
```

```sql
select gjid from M2_gj where gjnotransaksi='{notransaksi}' AND gjinputuser= '{userid}' order by gjmodifikasitgl desc limit 1
```

```sql
Delete from M2_Gj_Detail where idgj = '{result_4}'
```

```sql
Insert into M2_Gj_Detail(idgjdetail, idgj, norek, matauang, kurs, debit, debitvalas, kredit, kreditvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Gjtgl, Gjnotransaksi, Gjstatus FROM m2_Gj WHERE Gjid='{idtransaksi}'
```

```sql
DELETE FROM M2_Transaction_Journal WHERE tsumber = 'GJ' AND tidtransaksi = '{idtransaksi}' AND tnotransaksi = '{notransaksi}'
```

```sql
UPDATE M2_Gj SET Gjstatus = {nilaiStatus}, Gjmodifikasiuser='{userid}', Gjmodifikasitgl = NOW(), Gjposting = 0, Gjpostingtgl = '1971-01-01 00:00:00', Gjjmlrevisi = Gjjmlrevisi + 1 WHERE Gjid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Gjid, Gjnotransaksi FROM m2_Gj WHERE Gjid='{idtransaksi}'
```

```sql
DELETE FROM M2_Gj_Detail WHERE idGj = '{idtransaksi}'
```

```sql
DELETE FROM M2_Gj WHERE Gjid = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_gj_history.vb`

```sql
INSERT INTO m2_gj_history(SELECT 0, gj.* FROM m2_gj gj WHERE gj.gjid = '{idtransaksi}')
```

```sql
SELECT gjidhistory FROM m2_gj_history WHERE gjid = '{idtransaksi}' ORDER BY gjmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m2_gj_detail_history (SELECT 0, '{result_4}', gj.* FROM m2_gj_detail gj WHERE gj.idgj = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_jm.vb`

```sql
SELECT COUNT(jmid), jmnotransaksi FROM M2_jm WHERE jmid='{result_4}' AND jmstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(jmid) FROM m2_jm WHERE jmnotransaksi='{notransaksi}'
```

```sql
Update M2_Jm set jmcabang = '{FixQuotes_drutama}jmcabang', jmlokasi = '{FixQuotes_drutama}jmlokasi', jmsumber = '{FixQuotes_drutama}jmsumber', jmautonotransaksi = {drutama}jmautonotransaksi, jmnotransaksi = '{notransaksi}', jmtgl = '{FixQuotes_AsFormatTanggal_drutama}jmtgl', jmkodepa = {drutama}jmkodepa, jmkontakperson = '{FixQuotes_drutama}jmkontakperson', jmuraian = '{FixQuotes_drutama}jmuraian', jmcatatan = '{FixQuotes_drutama}jmcatatan', jmmatauang = '{FixQuotes_drutama}jmmatauang', jmkurs = '{FixDouble_drutama}jmkurs', jmdebit = '{FixDouble_drutama}jmdebit', jmdebitvalas = '{FixDouble_drutama}jmdebitvalas', jmkredit = '{FixDouble_drutama}jmkredit', jmkreditvalas = '{FixDouble_drutama}jmkreditvalas', jmjumlahbayar = '{FixDouble_drutama}jmjumlahbayar', jmjumlahbayarvalas = '{FixDouble_drutama}jmjumlahbayarvalas', jmstatusbayar = {drutama}jmstatusbayar, jmtgllunas = '{FixQuotes_AsFormatTanggal_drutama}jmtgllunas', jmstatus = {drutama}jmstatus, jmstatussebelumnya = {drutama}jmstatussebelumnya, jmjmlrevisi = jmjmlrevisi+1, jmcetakanke = {drutama}jmcetakanke, jmisclose = {drutama}jmisclose, jmmodifikasiuser = {drutama}jmmodifikasiuser, jmmodifikasitgl = NOW(), jmposting = 0, jmcustomtext1 = '{FixQuotes_drutama}jmcustomtext1', jmcustomtext2 = '{FixQuotes_drutama}jmcustomtext2', jmcustomtext3 = '{FixQuotes_drutama}jmcustomtext3', jmcustomtext4 = '{FixQuotes_drutama}jmcustomtext4', jmcustomtext5 = '{FixQuotes_drutama}jmcustomtext5', jmcustomint1 = {drutama}jmcustomint1, jmcustomint2 = {drutama}jmcustomint2, jmcustomint3 = {drutama}jmcustomint3, jmcustomdbl1 = '{FixDouble_drutama}jmcustomdbl1', jmcustomdbl2 = '{FixDouble_drutama}jmcustomdbl2', jmcustomdbl3 = '{FixDouble_drutama}jmcustomdbl3', jmcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}jmcustomdate1', jmcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}jmcustomdate2', jmcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}jmcustomdate3' where jmid = '{drutama}jmid'
```

```sql
Insert into M2_Jm (jmcabang, jmlokasi, jmsumber, jmautonotransaksi, jmnotransaksi, jmtgl, jmkodepa, jmkontakperson, jmuraian, jmcatatan, jmmatauang, jmkurs, jmdebit, jmdebitvalas, jmkredit, jmkreditvalas, jmjumlahbayar, jmjumlahbayarvalas, jmstatusbayar, jmtgllunas, jmstatus, jmstatussebelumnya, jmjmlrevisi, jmcetakanke, jmisclose, jminputuser, jminputtgl, jmmodifikasiuser, jmmodifikasitgl, jmposting, jmcustomtext1, jmcustomtext2, jmcustomtext3, jmcustomtext4, jmcustomtext5, jmcustomint1, jmcustomint2, jmcustomint3, jmcustomdbl1, jmcustomdbl2, jmcustomdbl3, jmcustomdate1, jmcustomdate2, jmcustomdate3) values('{FixQuotes_drutama}jmcabang', '{FixQuotes_drutama}jmlokasi', '{FixQuotes_drutama}jmsumber', {drutama}jmautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}jmtgl', {drutama}jmkodepa, '{FixQuotes_drutama}jmkontakperson', '{FixQuotes_drutama}jmuraian', '{FixQuotes_drutama}jmcatatan', '{FixQuotes_drutama}jmmatauang', '{FixDouble_drutama}jmkurs', '{FixDouble_drutama}jmdebit', '{FixDouble_drutama}jmdebitvalas', '{FixDouble_drutama}jmkredit', '{FixDouble_drutama}jmkreditvalas', '{FixDouble_drutama}jmjumlahbayar', '{FixDouble_drutama}jmjumlahbayarvalas', {drutama}jmstatusbayar, '{FixQuotes_AsFormatTanggal_drutama}jmtgllunas', {drutama}jmstatus, {drutama}jmstatussebelumnya, {drutama}jmjmlrevisi, {drutama}jmcetakanke, {drutama}jmisclose, {drutama}jminputuser, NOW(), {drutama}jmmodifikasiuser, '1971-01-01 00:00:00', 0, '{FixQuotes_drutama}jmcustomtext1', '{FixQuotes_drutama}jmcustomtext2', '{FixQuotes_drutama}jmcustomtext3', '{FixQuotes_drutama}jmcustomtext4', '{FixQuotes_drutama}jmcustomtext5', {drutama}jmcustomint1, {drutama}jmcustomint2, {drutama}jmcustomint3, '{FixDouble_drutama}jmcustomdbl1', '{FixDouble_drutama}jmcustomdbl2', '{FixDouble_drutama}jmcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}jmcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}jmcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}jmcustomdate3')
```

```sql
select jmid from M2_jm where jmnotransaksi='{notransaksi}' AND jminputuser= '{userid}' order by jmmodifikasitgl desc limit 1
```

```sql
Delete from M2_Jm_Detail where idjm = '{result_4}'
```

```sql
Insert into M2_Jm_Detail(idjmdetail, idjm, kontak, norek, matauang, kurs, debit, debitvalas, kredit, kreditvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Jmtgl, Jmnotransaksi, Jmstatus FROM m2_Jm WHERE Jmid='{idtransaksi}'
```

```sql
DELETE FROM M2_Transaction_Journal WHERE tsumber = 'JM' AND tidtransaksi = '{idtransaksi}' AND tnotransaksi = '{notransaksi}'
```

```sql
UPDATE M2_Jm SET Jmstatus = {nilaiStatus}, Jmmodifikasiuser='{userid}', Jmmodifikasitgl = NOW(), Jmposting = 0, Jmpostingtgl = '1971-01-01 00:00:00', Jmjmlrevisi = Jmjmlrevisi + 1 WHERE Jmid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Jmid, Jmnotransaksi FROM m2_Jm WHERE Jmid='{idtransaksi}'
```

```sql
DELETE FROM M2_Jm_Detail WHERE idJm = '{idtransaksi}'
```

```sql
DELETE FROM M2_Jm WHERE Jmid = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_jm_history.vb`

```sql
INSERT INTO m2_jm_history(SELECT 0, jm.* FROM m2_jm jm WHERE jm.jmid = '{idtransaksi}')
```

```sql
SELECT jmidhistory FROM m2_jm_history WHERE jmid = '{idtransaksi}' ORDER BY jmmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m2_jm_detail_history (SELECT 0, '{result_4}', jm.* FROM m2_jm_detail jm WHERE jm.idjm = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_notes.vb`

```sql
SELECT COUNT(nid) FROM M2_Notes WHERE nid='{result_4}'
```

```sql
Update M2_Notes set nsumber = '{FixQuotes_dataUtama_1}', nidtransaksi = {dataUtama_2}, ncatatan = '{FixQuotes_dataUtama_3}', nmodifikasiuser = {dataUtama_6}, nmodifikasitgl = NOW() where nid = '{result_4}'
```

```sql
Insert into M2_Notes (nsumber, nidtransaksi, ncatatan, ninputuser, ninputtgl, nmodifikasiuser, nmodifikasitgl) values('{FixQuotes_dataUtama_1}', {dataUtama_2}, '{FixQuotes_dataUtama_3}', {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00')
```

```sql
DELETE FROM M2_Notes WHERE nid = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_rg.vb`

```sql
SELECT EXISTS(SELECT 1 FROM m2_giro_list WHERE glnogiro = '{vNogiro}' LIMIT 1) as rowExists, '{vNogiro}' as glnogiro
```

```sql
SELECT COUNT(rgid), rgnotransaksi FROM M2_rg WHERE rgid='{result_4}' AND rgstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(rgid) FROM m2_rg WHERE rgnotransaksi='{notransaksi}'
```

```sql
Update M2_Rg set rgcabang = '{FixQuotes_drutama}rgcabang', rglokasi = '{FixQuotes_drutama}rglokasi', rgsumber = '{FixQuotes_drutama}rgsumber', rgautonotransaksi = {drutama}rgautonotransaksi, rgnotransaksi = '{notransaksi}', rgtgl = '{FixQuotes_AsFormatTanggal_drutama}rgtgl', rgkodepa = {drutama}rgkodepa, rgkontak = {drutama}rgkontak, rgkontakperson = '{FixQuotes_drutama}rgkontakperson', rguraian = '{FixQuotes_drutama}rguraian', rgcatatan = '{FixQuotes_drutama}rgcatatan', rgmatauang = '{FixQuotes_drutama}rgmatauang', rgkurs = '{FixDouble_drutama}rgkurs', rgjumlah = '{FixDouble_drutama}rgjumlah', rgjumlahvalas = '{FixDouble_drutama}rgjumlahvalas', rgstatusrgc = {drutama}rgstatusrgc, rgstatus = {drutama}rgstatus, rgstatussebelumnya = {drutama}rgstatussebelumnya, rgjmlrevisi = rgjmlrevisi+1, rgcetakanke = {drutama}rgcetakanke, rgisclose = {drutama}rgisclose, rgmodifikasiuser = {drutama}rgmodifikasiuser, rgmodifikasitgl = NOW(), rgposting = 0, rgcustomtext1 = '{FixQuotes_drutama}rgcustomtext1', rgcustomtext2 = '{FixQuotes_drutama}rgcustomtext2', rgcustomtext3 = '{FixQuotes_drutama}rgcustomtext3', rgcustomtext4 = '{FixQuotes_drutama}rgcustomtext4', rgcustomtext5 = '{FixQuotes_drutama}rgcustomtext5', rgcustomint1 = {drutama}rgcustomint1, rgcustomint2 = {drutama}rgcustomint2, rgcustomint3 = {drutama}rgcustomint3, rgcustomdbl1 = '{FixDouble_drutama}rgcustomdbl1', rgcustomdbl2 = '{FixDouble_drutama}rgcustomdbl2', rgcustomdbl3 = '{FixDouble_drutama}rgcustomdbl3', rgcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}rgcustomdate1', rgcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}rgcustomdate2', rgcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}rgcustomdate3' where rgid = '{drutama}rgid'
```

```sql
Insert into M2_Rg (rgcabang, rglokasi, rgsumber, rgautonotransaksi, rgnotransaksi, rgtgl, rgkodepa, rgkontak, rgkontakperson, rguraian, rgcatatan, rgmatauang, rgkurs, rgjumlah, rgjumlahvalas, rgstatusrgc, rgstatus, rgstatussebelumnya, rgjmlrevisi, rgcetakanke, rgisclose, rginputuser, rginputtgl, rgmodifikasiuser, rgmodifikasitgl, rgposting, rgcustomtext1, rgcustomtext2, rgcustomtext3, rgcustomtext4, rgcustomtext5, rgcustomint1, rgcustomint2, rgcustomint3, rgcustomdbl1, rgcustomdbl2, rgcustomdbl3, rgcustomdate1, rgcustomdate2, rgcustomdate3) values('{FixQuotes_drutama}rgcabang', '{FixQuotes_drutama}rglokasi', '{FixQuotes_drutama}rgsumber', {drutama}rgautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}rgtgl', {drutama}rgkodepa, {drutama}rgkontak, '{FixQuotes_drutama}rgkontakperson', '{FixQuotes_drutama}rguraian', '{FixQuotes_drutama}rgcatatan', '{FixQuotes_drutama}rgmatauang', '{FixDouble_drutama}rgkurs', '{FixDouble_drutama}rgjumlah', '{FixDouble_drutama}rgjumlahvalas', {drutama}rgstatusrgc, {drutama}rgstatus, {drutama}rgstatussebelumnya, {drutama}rgjmlrevisi, {drutama}rgcetakanke, {drutama}rgisclose, {drutama}rginputuser, NOW(), {drutama}rgmodifikasiuser, '1971-01-01 00:00:00', 0, '{FixQuotes_drutama}rgcustomtext1', '{FixQuotes_drutama}rgcustomtext2', '{FixQuotes_drutama}rgcustomtext3', '{FixQuotes_drutama}rgcustomtext4', '{FixQuotes_drutama}rgcustomtext5', {drutama}rgcustomint1, {drutama}rgcustomint2, {drutama}rgcustomint3, '{FixDouble_drutama}rgcustomdbl1', '{FixDouble_drutama}rgcustomdbl2', '{FixDouble_drutama}rgcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}rgcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}rgcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}rgcustomdate3')
```

```sql
select rgid from M2_rg where rgnotransaksi='{notransaksi}' AND rginputuser= '{userid}' order by rgmodifikasitgl desc limit 1
```

```sql
Delete from M2_Rg_Detail where idrg = '{result_4}'
```

```sql
Insert into M2_Rg_Detail(idrgdetail, idrg, nogiro, kontak, matauang, kurs, jumlah, jumlahvalas, bank, noacbank, rekbank, rekgiro, tgljatuhtempo, catatan, urutan, statusgiro, statusrgc, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
UPDATE m2_giro_list SET glstatus = 1, gltglcair = '{drutama}rgtgl', glrekbank = (CASE glnogiro {strRekbank_ToString} ELSE glrekbank END), glbank = (CASE glnogiro {strBank_ToString} ELSE glbank END), glnoacbank = (CASE glnogiro {strNoacbank_ToString} ELSE glnoacbank END) WHERE {strGiro_ToString}
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Rgtgl, Rgnotransaksi, Rgstatus FROM m2_Rg WHERE Rgid='{idtransaksi}'
```

```sql
SELECT nogiro FROM m2_rg_detail WHERE idrg = '{idtransaksi}'
```

```sql
UPDATE m2_giro_list SET glstatus = glstatussebelumnya, gltglcair = '{FixQuotes_AsFormatTanggal}1900-01-01' WHERE ({strGiro_ToString})
```

```sql
UPDATE m2_giro_list gl LEFT JOIN (SELECT rgcd.nogiro, rgc.rgctgl as tgl FROM m2_rgc_detail rgcd JOIN m2_rgc rgc ON rgcd.idrgc = rgc.rgcid AND rgc.rgcstatus IN(2,3,4,7) WHERE ({strGiroBatal_ToString})) as gc ON gl.glnogiro = gc.nogiro SET gl.glstatus = gl.glstatussebelumnya, gl.gltglcair = (CASE gl.glstatussebelumnya WHEN 0 THEN '{FixQuotes_AsFormatTanggal}1900-01-01' ELSE IFNULL(gc.tgl,'1900-01-01') END) WHERE ({strGiro_ToString})
```

```sql
DELETE FROM M2_Transaction_Journal WHERE tsumber = 'RG' AND tidtransaksi = '{idtransaksi}' AND tnotransaksi = '{notransaksi}'
```

```sql
UPDATE M2_Rg SET Rgstatus = {nilaiStatus}, Rgmodifikasiuser='{userid}', Rgmodifikasitgl = NOW(), Rgposting = 0, Rgpostingtgl = '1971-01-01 00:00:00', Rgjmlrevisi = Rgjmlrevisi + 1 WHERE Rgid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Rgid, Rgnotransaksi FROM m2_Rg WHERE Rgid='{idtransaksi}'
```

```sql
DELETE FROM M2_Rg_Detail WHERE idRg = '{idtransaksi}'
```

```sql
DELETE FROM M2_Rg WHERE Rgid = '{idtransaksi}'
```

```sql
SELECT glnogiro, rgnotransaksi FROM m2_giro_list JOIN m2_rg_detail ON glnogiro=nogiro JOIN m2_rg ON idrg=rgid WHERE (glstatus = 1) AND (rgstatus=2 OR rgstatus=3 OR rgstatus=4 OR rgstatus=7) AND ({filter}) LIMIT 1
```

```sql
SELECT glnogiro, rgcnotransaksi, rgctgl FROM m2_giro_list JOIN m2_rgc_detail ON glnogiro = nogiro JOIN m2_rgc ON idrgc = rgcid WHERE (glstatus = 2 OR glstatus = 3) AND (rgcstatus = 2 OR rgcstatus = 3 OR rgcstatus = 4 OR rgcstatus = 7) AND rgctgl > '{FixQuotes_AsFormatTanggal_tgl}' AND ({filter}) LIMIT 1
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_rg_history.vb`

```sql
INSERT INTO m2_rg_history(SELECT 0, rg.* FROM m2_rg rg WHERE rg.rgid = '{idtransaksi}')
```

```sql
SELECT rgidhistory FROM m2_rg_history WHERE rgid = '{idtransaksi}' ORDER BY rgmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m2_rg_detail_history (SELECT 0, '{result_4}', rg.* FROM m2_rg_detail rg WHERE rg.idrg = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_rgc.vb`

```sql
SELECT EXISTS(SELECT 1 FROM m2_giro_list WHERE glnogiro = '{vNogiro}' LIMIT 1) as rowExists, '{vNogiro}' as glnogiro
```

```sql
SELECT COUNT(rgcid), rgcnotransaksi FROM M2_rgc WHERE rgcid='{result_4}' AND rgcstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(rgcid) FROM m2_rgc WHERE rgcnotransaksi='{notransaksi}'
```

```sql
Update M2_Rgc set rgccabang = '{FixQuotes_drutama}rgccabang', rgclokasi = '{FixQuotes_drutama}rgclokasi', rgcsumber = '{FixQuotes_drutama}rgcsumber', rgcjenis = {drutama}rgcjenis, rgcautonotransaksi = {drutama}rgcautonotransaksi, rgcnotransaksi = '{notransaksi}', rgctgl = '{FixQuotes_AsFormatTanggal_drutama}rgctgl', rgckodepa = {drutama}rgckodepa, rgckontak = {drutama}rgckontak, rgckontakperson = '{FixQuotes_drutama}rgckontakperson', rgcuraian = '{FixQuotes_drutama}rgcuraian', rgccatatan = '{FixQuotes_drutama}rgccatatan', rgcmatauang = '{FixQuotes_drutama}rgcmatauang', rgckurs = '{FixDouble_drutama}rgckurs', rgcjumlah = '{FixDouble_drutama}rgcjumlah', rgcjumlahvalas = '{FixDouble_drutama}rgcjumlahvalas', rgcidrg = {drutama}rgcidrg, rgcstatus = {drutama}rgcstatus, rgcstatussebelumnya = {drutama}rgcstatussebelumnya, rgcjmlrevisi = rgcjmlrevisi+1, rgccetakanke = {drutama}rgccetakanke, rgcisclose = {drutama}rgcisclose, rgcmodifikasiuser = {drutama}rgcmodifikasiuser, rgcmodifikasitgl = NOW(), rgcposting = 0, rgccustomtext1 = '{FixQuotes_drutama}rgccustomtext1', rgccustomtext2 = '{FixQuotes_drutama}rgccustomtext2', rgccustomtext3 = '{FixQuotes_drutama}rgccustomtext3', rgccustomtext4 = '{FixQuotes_drutama}rgccustomtext4', rgccustomtext5 = '{FixQuotes_drutama}rgccustomtext5', rgccustomint1 = {drutama}rgccustomint1, rgccustomint2 = {drutama}rgccustomint2, rgccustomint3 = {drutama}rgccustomint3, rgccustomdbl1 = '{FixDouble_drutama}rgccustomdbl1', rgccustomdbl2 = '{FixDouble_drutama}rgccustomdbl2', rgccustomdbl3 = '{FixDouble_drutama}rgccustomdbl3', rgccustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}rgccustomdate1', rgccustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}rgccustomdate2', rgccustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}rgccustomdate3' where rgcid = '{drutama}rgcid'
```

```sql
Insert into M2_Rgc (rgccabang, rgclokasi, rgcsumber, rgcjenis, rgcautonotransaksi, rgcnotransaksi, rgctgl, rgckodepa, rgckontak, rgckontakperson, rgcuraian, rgccatatan, rgcmatauang, rgckurs, rgcjumlah, rgcjumlahvalas, rgcidrg, rgcstatus, rgcstatussebelumnya, rgcjmlrevisi, rgccetakanke, rgcisclose, rgcinputuser, rgcinputtgl, rgcmodifikasiuser, rgcmodifikasitgl, rgcposting, rgccustomtext1, rgccustomtext2, rgccustomtext3, rgccustomtext4, rgccustomtext5, rgccustomint1, rgccustomint2, rgccustomint3, rgccustomdbl1, rgccustomdbl2, rgccustomdbl3, rgccustomdate1, rgccustomdate2, rgccustomdate3) values('{FixQuotes_drutama}rgccabang', '{FixQuotes_drutama}rgclokasi', '{FixQuotes_drutama}rgcsumber', {drutama}rgcjenis, {drutama}rgcautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}rgctgl', {drutama}rgckodepa, {drutama}rgckontak, '{FixQuotes_drutama}rgckontakperson', '{FixQuotes_drutama}rgcuraian', '{FixQuotes_drutama}rgccatatan', '{FixQuotes_drutama}rgcmatauang', '{FixDouble_drutama}rgckurs', '{FixDouble_drutama}rgcjumlah', '{FixDouble_drutama}rgcjumlahvalas', {drutama}rgcidrg, {drutama}rgcstatus, {drutama}rgcstatussebelumnya, {drutama}rgcjmlrevisi, {drutama}rgccetakanke, {drutama}rgcisclose, {drutama}rgcinputuser, NOW(), {drutama}rgcmodifikasiuser, '1971-01-01 00:00:00', 0, '{FixQuotes_drutama}rgccustomtext1', '{FixQuotes_drutama}rgccustomtext2', '{FixQuotes_drutama}rgccustomtext3', '{FixQuotes_drutama}rgccustomtext4', '{FixQuotes_drutama}rgccustomtext5', {drutama}rgccustomint1, {drutama}rgccustomint2, {drutama}rgccustomint3, '{FixDouble_drutama}rgccustomdbl1', '{FixDouble_drutama}rgccustomdbl2', '{FixDouble_drutama}rgccustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}rgccustomdate1', '{FixQuotes_AsFormatTanggal_drutama}rgccustomdate2', '{FixQuotes_AsFormatTanggal_drutama}rgccustomdate3')
```

```sql
select rgcid from M2_rgc where rgcnotransaksi='{notransaksi}' AND rgcinputuser= '{userid}' order by rgcmodifikasitgl desc limit 1
```

```sql
Delete from M2_Rgc_Detail where idrgc = '{result_4}'
```

```sql
Insert into M2_Rgc_Detail(idrgcdetail, idrgc, nogiro, kontak, matauang, kurs, jumlah, jumlahvalas, bank, noacbank, rekbank, rekgiro, tgljatuhtempo, catatan, urutan, statusgiro, idrgdetail, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
SELECT glnogiro FROM m2_giro_list WHERE glstatus = 1 AND ({strGiro_ToString})
```

```sql
UPDATE m2_giro_list SET glstatus = '{drutama}rgcjenis', gltglcair = '{drutama}rgctgl', glrekgiro = (CASE glnogiro {strRekgiro_ToString} ELSE glrekgiro END) WHERE {strGiro_ToString}
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Rgctgl, Rgcnotransaksi, Rgcstatus FROM m2_Rgc WHERE Rgcid='{idtransaksi}'
```

```sql
SELECT nogiro FROM m2_rgc_detail WHERE idrgc = '{idtransaksi}'
```

```sql
SELECT glnogiro, glstatus FROM m2_giro_list WHERE ({strGiro_ToString})
```

```sql
UPDATE m2_giro_list SET glstatus = '0', gltglcair = '{FixQuotes_AsFormatTanggal}1900-01-01', glrekgiro = '{rekgiro}' WHERE ({strGiro_ToString})
```

```sql
DELETE FROM M2_Transaction_Journal WHERE tsumber = 'RGC' AND tidtransaksi = '{idtransaksi}' AND tnotransaksi = '{notransaksi}'
```

```sql
UPDATE M2_Rgc SET Rgcstatus = {nilaiStatus}, Rgcmodifikasiuser='{userid}', Rgcmodifikasitgl = NOW(), Rgcposting = 0, Rgcpostingtgl = '1971-01-01 00:00:00', Rgcjmlrevisi = Rgcjmlrevisi + 1 WHERE Rgcid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Rgcid, Rgcnotransaksi FROM m2_Rgc WHERE Rgcid='{idtransaksi}'
```

```sql
DELETE FROM M2_Rgc_Detail WHERE idRgc = '{idtransaksi}'
```

```sql
DELETE FROM M2_Rgc WHERE Rgcid = '{idtransaksi}'
```

```sql
SELECT glnogiro, glstatus FROM m2_giro_list WHERE (glstatus <> 0) AND ({filter}) LIMIT 1
```

```sql
SELECT glnogiro, rgnotransaksi FROM m2_giro_list JOIN m2_rg_detail ON glnogiro = nogiro JOIN m2_rg ON idrg = rgid WHERE (rgstatus = 2 OR rgstatus = 3 OR rgstatus = 4 OR rgstatus = 7) AND (glnogiro = '{FixQuotes_dtvalidasi_Rows_0}glnogiro') LIMIT 1
```

```sql
SELECT glnogiro, rgcnotransaksi FROM m2_giro_list JOIN m2_rgc_detail ON glnogiro = nogiro JOIN m2_rgc ON idrgc = rgcid WHERE (rgcstatus = 2 OR rgcstatus = 3 OR rgcstatus = 4 OR rgcstatus = 7) AND (glnogiro = '{FixQuotes_dtvalidasi_Rows_0}glnogiro') LIMIT 1
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_rgc_history.vb`

```sql
INSERT INTO m2_rgc_history(SELECT 0, rgc.* FROM m2_rgc rgc WHERE rgc.rgcid = '{idtransaksi}')
```

```sql
SELECT rgcidhistory FROM m2_rgc_history WHERE rgcid = '{idtransaksi}' ORDER BY rgcmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m2_rgc_detail_history (SELECT 0, '{result_4}', rgc.* FROM m2_rgc_detail rgc WHERE rgc.idrgc = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_rm.vb`

```sql
SELECT COUNT(rmid), rmnotransaksi FROM M2_Rm WHERE rmid='{result_4}' AND rmstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(rmid) FROM m2_rm WHERE rmnotransaksi='{notransaksi}'
```

```sql
Update M2_Rm set rmcabang = '{FixQuotes_drutama}rmcabang', rmlokasi = '{FixQuotes_drutama}rmlokasi', rmsumber = '{FixQuotes_drutama}rmsumber', rmautonotransaksi = {drutama}rmautonotransaksi, rmnotransaksi = '{notransaksi}', rmtgl = '{FixQuotes_AsFormatTanggal_drutama}rmtgl', rmkodepa = {drutama}rmkodepa, rmcarabayar = {drutama}rmcarabayar, rmkontak = {drutama}rmkontak, rmkontakperson = '{FixQuotes_drutama}rmkontakperson', rmnorek = '{FixQuotes_drutama}rmnorek', rmuraian = '{FixQuotes_drutama}rmuraian', rmcatatan = '{FixQuotes_drutama}rmcatatan', rmmatauang = '{FixQuotes_drutama}rmmatauang', rmkurs = '{FixDouble_drutama}rmkurs', rmjumlah = '{FixDouble_drutama}rmjumlah', rmjumlahvalas = '{FixDouble_drutama}rmjumlahvalas', rmjumlahbayar = '{FixDouble_drutama}rmjumlahbayar', rmjumlahbayarvalas = '{FixDouble_drutama}rmjumlahbayarvalas', rmstatusbayar = {drutama}rmstatusbayar, rmtgllunas = '{FixQuotes_AsFormatTanggal_drutama}rmtgllunas', rmstatus = {drutama}rmstatus, rmstatussebelumnya = {drutama}rmstatussebelumnya, rmjmlrevisi = rmjmlrevisi+1, rmcetakanke = {drutama}rmcetakanke, rmisclose = {drutama}rmisclose, rmmodifikasiuser = {drutama}rmmodifikasiuser, rmmodifikasitgl = NOW(), rmposting = 0, rmcustomtext1 = '{FixQuotes_drutama}rmcustomtext1', rmcustomtext2 = '{FixQuotes_drutama}rmcustomtext2', rmcustomtext3 = '{FixQuotes_drutama}rmcustomtext3', rmcustomtext4 = '{FixQuotes_drutama}rmcustomtext4', rmcustomtext5 = '{FixQuotes_drutama}rmcustomtext5', rmcustomint1 = {drutama}rmcustomint1, rmcustomint2 = {drutama}rmcustomint2, rmcustomint3 = {drutama}rmcustomint3, rmcustomdbl1 = '{FixDouble_drutama}rmcustomdbl1', rmcustomdbl2 = '{FixDouble_drutama}rmcustomdbl2', rmcustomdbl3 = '{FixDouble_drutama}rmcustomdbl3', rmcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}rmcustomdate1', rmcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}rmcustomdate2', rmcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}rmcustomdate3' where rmid = '{drutama}rmid'
```

```sql
Insert into M2_Rm (rmcabang, rmlokasi, rmsumber, rmautonotransaksi, rmnotransaksi, rmtgl, rmkodepa, rmcarabayar, rmkontak, rmkontakperson, rmnorek, rmuraian, rmcatatan, rmmatauang, rmkurs, rmjumlah, rmjumlahvalas, rmjumlahbayar, rmjumlahbayarvalas, rmstatusbayar, rmtgllunas, rmstatus, rmstatussebelumnya, rmjmlrevisi, rmcetakanke, rmisclose, rminputuser, rminputtgl, rmmodifikasiuser, rmmodifikasitgl, rmposting, rmcustomtext1, rmcustomtext2, rmcustomtext3, rmcustomtext4, rmcustomtext5, rmcustomint1, rmcustomint2, rmcustomint3, rmcustomdbl1, rmcustomdbl2, rmcustomdbl3, rmcustomdate1, rmcustomdate2, rmcustomdate3) values('{FixQuotes_drutama}rmcabang', '{FixQuotes_drutama}rmlokasi', '{FixQuotes_drutama}rmsumber', {drutama}rmautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}rmtgl', {drutama}rmkodepa, {drutama}rmcarabayar, {drutama}rmkontak, '{FixQuotes_drutama}rmkontakperson', '{FixQuotes_drutama}rmnorek', '{FixQuotes_drutama}rmuraian', '{FixQuotes_drutama}rmcatatan', '{FixQuotes_drutama}rmmatauang', '{FixDouble_drutama}rmkurs', '{FixDouble_drutama}rmjumlah', '{FixDouble_drutama}rmjumlahvalas', '{FixDouble_drutama}rmjumlahbayar', '{FixDouble_drutama}rmjumlahbayarvalas', {drutama}rmstatusbayar, '{FixQuotes_AsFormatTanggal_drutama}rmtgllunas', {drutama}rmstatus, {drutama}rmstatussebelumnya, {drutama}rmjmlrevisi, {drutama}rmcetakanke, {drutama}rmisclose, {drutama}rminputuser, NOW(), {drutama}rmmodifikasiuser, '1971-01-01 00:00:00', 0, '{FixQuotes_drutama}rmcustomtext1', '{FixQuotes_drutama}rmcustomtext2', '{FixQuotes_drutama}rmcustomtext3', '{FixQuotes_drutama}rmcustomtext4', '{FixQuotes_drutama}rmcustomtext5', {drutama}rmcustomint1, {drutama}rmcustomint2, {drutama}rmcustomint3, '{FixDouble_drutama}rmcustomdbl1', '{FixDouble_drutama}rmcustomdbl2', '{FixDouble_drutama}rmcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}rmcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}rmcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}rmcustomdate3')
```

```sql
select rmid from M2_Rm where rmnotransaksi='{notransaksi}' AND Rminputuser= '{userid}' order by Rmmodifikasitgl desc limit 1
```

```sql
Delete from M2_Rm_Detail where idrm = '{result_4}'
```

```sql
Insert into M2_Rm_Detail(idrmdetail, idrm, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
Delete from M2_Rm_Pay where idrm = '{result_4}'
```

```sql
Insert into M2_Rm_Pay(idrmcarabayar, idrm, carabayar, matauang, kurs, jumlah, jumlahvalas, nogiro, tgljt, bank, noacbank, rekbank, rekgiro, catatan, urutan) values{strValue2_ToString}
```

```sql
Insert into M2_Giro_List(glnogiro, glsumber, glidtransaksi, glnotransaksi, glkontak, glrekbank, glrekgiro, gljenis, glbank, glnoacbank, glmatauang, glkurs, gljumlah, gljumlahvalas, gltgljthtempo, gltglcair, glstatus, glstatussebelumnya, glurutan) values{strGiro_ToString}
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Rmtgl, Rmnotransaksi, Rmstatus FROM m2_Rm WHERE Rmid='{idtransaksi}'
```

```sql
SELECT glnogiro FROM m2_giro_list WHERE glsumber = 'RM' AND glidtransaksi = '{idtransaksi}' AND glnotransaksi = '{notransaksi}' AND glstatus <> 0
```

```sql
DELETE FROM M2_Transaction_Journal WHERE tsumber = 'RM' AND tidtransaksi = '{idtransaksi}' AND tnotransaksi = '{notransaksi}'
```

```sql
DELETE FROM m2_giro_list WHERE glsumber = 'RM' AND glidtransaksi = '{idtransaksi}' AND glnotransaksi = '{notransaksi}'
```

```sql
UPDATE M2_Rm SET Rmstatus = {nilaiStatus}, Rmmodifikasiuser='{userid}', Rmmodifikasitgl = NOW(), Rmposting = 0, Rmpostingtgl = '1971-01-01 00:00:00', Rmjmlrevisi = Rmjmlrevisi + 1 WHERE Rmid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Rmid, Rmnotransaksi FROM m2_Rm WHERE Rmid='{idtransaksi}'
```

```sql
DELETE FROM M2_Rm_Pay WHERE idRm = '{idtransaksi}'
```

```sql
DELETE FROM M2_Rm_Detail WHERE idRm = '{idtransaksi}'
```

```sql
DELETE FROM M2_Rm WHERE Rmid = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_rm_history.vb`

```sql
INSERT INTO m2_rm_history(SELECT 0, rm.* FROM m2_rm rm WHERE rm.rmid = '{idtransaksi}')
```

```sql
SELECT rmidhistory FROM m2_rm_history WHERE rmid = '{idtransaksi}' ORDER BY rmmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m2_rm_detail_history (SELECT 0, '{result_4}', rm.* FROM m2_rm_detail rm WHERE rm.idrm = '{idtransaksi}' )
```

```sql
INSERT INTO m2_rm_pay_history (SELECT 0, '{result_4}', rm.* FROM m2_rm_pay rm WHERE rm.idrm = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_sg.vb`

```sql
SELECT EXISTS(SELECT 1 FROM m2_giro_list WHERE glnogiro = '{vNogiro}' LIMIT 1) as rowExists, '{vNogiro}' as glnogiro
```

```sql
SELECT COUNT(sgid), sgnotransaksi FROM M2_sg WHERE sgid='{result_4}' AND sgstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(sgid) FROM m2_sg WHERE sgnotransaksi='{notransaksi}'
```

```sql
Update M2_Sg set sgcabang = '{FixQuotes_drutama}sgcabang', sglokasi = '{FixQuotes_drutama}sglokasi', sgsumber = '{FixQuotes_drutama}sgsumber', sgautonotransaksi = {drutama}sgautonotransaksi, sgnotransaksi = '{notransaksi}', sgtgl = '{FixQuotes_AsFormatTanggal_drutama}sgtgl', sgkodepa = {drutama}sgkodepa, sgkontak = {drutama}sgkontak, sgkontakperson = '{FixQuotes_drutama}sgkontakperson', sguraian = '{FixQuotes_drutama}sguraian', sgcatatan = '{FixQuotes_drutama}sgcatatan', sgmatauang = '{FixQuotes_drutama}sgmatauang', sgkurs = '{FixDouble_drutama}sgkurs', sgjumlah = '{FixDouble_drutama}sgjumlah', sgjumlahvalas = '{FixDouble_drutama}sgjumlahvalas', sgstatussgc = {drutama}sgstatussgc, sgstatus = {drutama}sgstatus, sgstatussebelumnya = {drutama}sgstatussebelumnya, sgjmlrevisi = sgjmlrevisi+1, sgcetakanke = {drutama}sgcetakanke, sgisclose = {drutama}sgisclose, sgmodifikasiuser = {drutama}sgmodifikasiuser, sgmodifikasitgl = NOW(), sgposting = 0, sgcustomtext1 = '{FixQuotes_drutama}sgcustomtext1', sgcustomtext2 = '{FixQuotes_drutama}sgcustomtext2', sgcustomtext3 = '{FixQuotes_drutama}sgcustomtext3', sgcustomtext4 = '{FixQuotes_drutama}sgcustomtext4', sgcustomtext5 = '{FixQuotes_drutama}sgcustomtext5', sgcustomint1 = {drutama}sgcustomint1, sgcustomint2 = {drutama}sgcustomint2, sgcustomint3 = {drutama}sgcustomint3, sgcustomdbl1 = '{FixDouble_drutama}sgcustomdbl1', sgcustomdbl2 = '{FixDouble_drutama}sgcustomdbl2', sgcustomdbl3 = '{FixDouble_drutama}sgcustomdbl3', sgcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}sgcustomdate1', sgcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}sgcustomdate2', sgcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}sgcustomdate3' where sgid = '{drutama}sgid'
```

```sql
Insert into M2_Sg (sgcabang, sglokasi, sgsumber, sgautonotransaksi, sgnotransaksi, sgtgl, sgkodepa, sgkontak, sgkontakperson, sguraian, sgcatatan, sgmatauang, sgkurs, sgjumlah, sgjumlahvalas, sgstatussgc, sgstatus, sgstatussebelumnya, sgjmlrevisi, sgcetakanke, sgisclose, sginputuser, sginputtgl, sgmodifikasiuser, sgmodifikasitgl, sgposting, sgcustomtext1, sgcustomtext2, sgcustomtext3, sgcustomtext4, sgcustomtext5, sgcustomint1, sgcustomint2, sgcustomint3, sgcustomdbl1, sgcustomdbl2, sgcustomdbl3, sgcustomdate1, sgcustomdate2, sgcustomdate3) values('{FixQuotes_drutama}sgcabang', '{FixQuotes_drutama}sglokasi', '{FixQuotes_drutama}sgsumber', {drutama}sgautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}sgtgl', {drutama}sgkodepa, {drutama}sgkontak, '{FixQuotes_drutama}sgkontakperson', '{FixQuotes_drutama}sguraian', '{FixQuotes_drutama}sgcatatan', '{FixQuotes_drutama}sgmatauang', '{FixDouble_drutama}sgkurs', '{FixDouble_drutama}sgjumlah', '{FixDouble_drutama}sgjumlahvalas', {drutama}sgstatussgc, {drutama}sgstatus, {drutama}sgstatussebelumnya, {drutama}sgjmlrevisi, {drutama}sgcetakanke, {drutama}sgisclose, {drutama}sginputuser, NOW(), {drutama}sgmodifikasiuser, '1971-01-01 00:00:00', 0, '{FixQuotes_drutama}sgcustomtext1', '{FixQuotes_drutama}sgcustomtext2', '{FixQuotes_drutama}sgcustomtext3', '{FixQuotes_drutama}sgcustomtext4', '{FixQuotes_drutama}sgcustomtext5', {drutama}sgcustomint1, {drutama}sgcustomint2, {drutama}sgcustomint3, '{FixDouble_drutama}sgcustomdbl1', '{FixDouble_drutama}sgcustomdbl2', '{FixDouble_drutama}sgcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}sgcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}sgcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}sgcustomdate3')
```

```sql
select sgid from M2_sg where sgnotransaksi='{notransaksi}' AND sginputuser= '{userid}' order by sgmodifikasitgl desc limit 1
```

```sql
Delete from M2_Sg_Detail where idsg = '{result_4}'
```

```sql
Insert into M2_Sg_Detail(idsgdetail, idsg, nogiro, kontak, matauang, kurs, jumlah, jumlahvalas, bank, noacbank, rekbank, rekgiro, tgljatuhtempo, catatan, urutan, statusgiro, statussgc, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
UPDATE m2_giro_list SET glstatus = 1, gltglcair = '{drutama}sgtgl', glrekbank = (CASE glnogiro {strRekbank_ToString} ELSE glrekbank END), glbank = (CASE glnogiro {strBank_ToString} ELSE glbank END), glnoacbank = (CASE glnogiro {strNoacbank_ToString} ELSE glnoacbank END) WHERE {strGiro_ToString}
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Sgtgl, Sgnotransaksi, Sgstatus FROM m2_Sg WHERE Sgid='{idtransaksi}'
```

```sql
SELECT nogiro FROM m2_sg_detail WHERE idsg = '{idtransaksi}'
```

```sql
UPDATE m2_giro_list SET glstatus = glstatussebelumnya, gltglcair = '{FixQuotes_AsFormatTanggal}1900-01-01' WHERE ({strGiro_ToString})
```

```sql
UPDATE m2_giro_list gl LEFT JOIN (SELECT sgcd.nogiro, sgc.sgctgl as tgl FROM m2_sgc_detail sgcd JOIN m2_sgc sgc ON sgcd.idsgc = sgc.sgcid AND sgc.sgcstatus IN(2,3,4,7) WHERE ({strGiroBatal_ToString})) as gc ON gl.glnogiro = gc.nogiro SET gl.glstatus = gl.glstatussebelumnya, gl.gltglcair = (CASE gl.glstatussebelumnya WHEN 0 THEN '{FixQuotes_AsFormatTanggal}1900-01-01' ELSE IFNULL(gc.tgl,'1900-01-01') END) WHERE ({strGiro_ToString})
```

```sql
DELETE FROM M2_Transaction_Journal WHERE tsumber = 'SG' AND tidtransaksi = '{idtransaksi}' AND tnotransaksi = '{notransaksi}'
```

```sql
UPDATE M2_Sg SET Sgstatus = {nilaiStatus}, Sgmodifikasiuser='{userid}', Sgmodifikasitgl = NOW(), Sgposting = 0, Sgpostingtgl = '1971-01-01 00:00:00', Sgjmlrevisi = Sgjmlrevisi + 1 WHERE Sgid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Sgid, Sgnotransaksi FROM m2_Sg WHERE Sgid='{idtransaksi}'
```

```sql
DELETE FROM M2_Sg_Detail WHERE idSg = '{idtransaksi}'
```

```sql
DELETE FROM M2_Sg WHERE Sgid = '{idtransaksi}'
```

```sql
SELECT glnogiro, sgnotransaksi FROM m2_giro_list JOIN m2_sg_detail ON glnogiro=nogiro JOIN m2_sg ON idsg=sgid WHERE (glstatus = 1) AND (sgstatus=2 OR sgstatus=3 OR sgstatus=4 OR sgstatus=7) AND ({filter}) LIMIT 1
```

```sql
SELECT glnogiro, sgcnotransaksi, sgctgl FROM m2_giro_list JOIN m2_sgc_detail ON glnogiro = nogiro JOIN m2_sgc ON idsgc = sgcid WHERE (glstatus = 2 OR glstatus = 3) AND (sgcstatus = 2 OR sgcstatus = 3 OR sgcstatus = 4 OR sgcstatus = 7) AND sgctgl > '{FixQuotes_AsFormatTanggal_tgl}' AND ({filter}) LIMIT 1
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_sg_history.vb`

```sql
INSERT INTO m2_sg_history(SELECT 0, sg.* FROM m2_sg sg WHERE sg.sgid = '{idtransaksi}')
```

```sql
SELECT sgidhistory FROM m2_sg_history WHERE sgid = '{idtransaksi}' ORDER BY sgmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m2_sg_detail_history (SELECT 0, '{result_4}', sg.* FROM m2_sg_detail sg WHERE sg.idsg = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_sgc.vb`

```sql
SELECT EXISTS(SELECT 1 FROM m2_giro_list WHERE glnogiro = '{vNogiro}' LIMIT 1) as rowExists, '{vNogiro}' as glnogiro
```

```sql
SELECT COUNT(sgcid), sgcnotransaksi FROM M2_sgc WHERE sgcid='{result_4}' AND sgcstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(sgcid) FROM m2_sgc WHERE sgcnotransaksi='{notransaksi}'
```

```sql
Update M2_Sgc set sgccabang = '{FixQuotes_drutama}sgccabang', sgclokasi = '{FixQuotes_drutama}sgclokasi', sgcsumber = '{FixQuotes_drutama}sgcsumber', sgcjenis = {drutama}sgcjenis, sgcautonotransaksi = {drutama}sgcautonotransaksi, sgcnotransaksi = '{notransaksi}', sgctgl = '{FixQuotes_AsFormatTanggal_drutama}sgctgl', sgckodepa = {drutama}sgckodepa, sgckontak = {drutama}sgckontak, sgckontakperson = '{FixQuotes_drutama}sgckontakperson', sgcuraian = '{FixQuotes_drutama}sgcuraian', sgccatatan = '{FixQuotes_drutama}sgccatatan', sgcmatauang = '{FixQuotes_drutama}sgcmatauang', sgckurs = '{FixDouble_drutama}sgckurs', sgcjumlah = '{FixDouble_drutama}sgcjumlah', sgcjumlahvalas = '{FixDouble_drutama}sgcjumlahvalas', sgcidsg = {drutama}sgcidsg, sgcstatus = {drutama}sgcstatus, sgcstatussebelumnya = {drutama}sgcstatussebelumnya, sgcjmlrevisi = sgcjmlrevisi+1, sgccetakanke = {drutama}sgccetakanke, sgcisclose = {drutama}sgcisclose, sgcmodifikasiuser = {drutama}sgcmodifikasiuser, sgcmodifikasitgl = NOW(), sgcposting = 0, sgccustomtext1 = '{FixQuotes_drutama}sgccustomtext1', sgccustomtext2 = '{FixQuotes_drutama}sgccustomtext2', sgccustomtext3 = '{FixQuotes_drutama}sgccustomtext3', sgccustomtext4 = '{FixQuotes_drutama}sgccustomtext4', sgccustomtext5 = '{FixQuotes_drutama}sgccustomtext5', sgccustomint1 = {drutama}sgccustomint1, sgccustomint2 = {drutama}sgccustomint2, sgccustomint3 = {drutama}sgccustomint3, sgccustomdbl1 = '{FixDouble_drutama}sgccustomdbl1', sgccustomdbl2 = '{FixDouble_drutama}sgccustomdbl2', sgccustomdbl3 = '{FixDouble_drutama}sgccustomdbl3', sgccustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}sgccustomdate1', sgccustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}sgccustomdate2', sgccustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}sgccustomdate3' where sgcid = '{drutama}sgcid'
```

```sql
Insert into M2_Sgc (sgccabang, sgclokasi, sgcsumber, sgcjenis, sgcautonotransaksi, sgcnotransaksi, sgctgl, sgckodepa, sgckontak, sgckontakperson, sgcuraian, sgccatatan, sgcmatauang, sgckurs, sgcjumlah, sgcjumlahvalas, sgcidsg, sgcstatus, sgcstatussebelumnya, sgcjmlrevisi, sgccetakanke, sgcisclose, sgcinputuser, sgcinputtgl, sgcmodifikasiuser, sgcmodifikasitgl, sgcposting, sgccustomtext1, sgccustomtext2, sgccustomtext3, sgccustomtext4, sgccustomtext5, sgccustomint1, sgccustomint2, sgccustomint3, sgccustomdbl1, sgccustomdbl2, sgccustomdbl3, sgccustomdate1, sgccustomdate2, sgccustomdate3) values('{FixQuotes_drutama}sgccabang', '{FixQuotes_drutama}sgclokasi', '{FixQuotes_drutama}sgcsumber', {drutama}sgcjenis, {drutama}sgcautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}sgctgl', {drutama}sgckodepa, {drutama}sgckontak, '{FixQuotes_drutama}sgckontakperson', '{FixQuotes_drutama}sgcuraian', '{FixQuotes_drutama}sgccatatan', '{FixQuotes_drutama}sgcmatauang', '{FixDouble_drutama}sgckurs', '{FixDouble_drutama}sgcjumlah', '{FixDouble_drutama}sgcjumlahvalas', {drutama}sgcidsg, {drutama}sgcstatus, {drutama}sgcstatussebelumnya, {drutama}sgcjmlrevisi, {drutama}sgccetakanke, {drutama}sgcisclose, {drutama}sgcinputuser, NOW(), {drutama}sgcmodifikasiuser, '1971-01-01 00:00:00', 0, '{FixQuotes_drutama}sgccustomtext1', '{FixQuotes_drutama}sgccustomtext2', '{FixQuotes_drutama}sgccustomtext3', '{FixQuotes_drutama}sgccustomtext4', '{FixQuotes_drutama}sgccustomtext5', {drutama}sgccustomint1, {drutama}sgccustomint2, {drutama}sgccustomint3, '{FixDouble_drutama}sgccustomdbl1', '{FixDouble_drutama}sgccustomdbl2', '{FixDouble_drutama}sgccustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}sgccustomdate1', '{FixQuotes_AsFormatTanggal_drutama}sgccustomdate2', '{FixQuotes_AsFormatTanggal_drutama}sgccustomdate3')
```

```sql
select sgcid from M2_sgc where sgcnotransaksi='{notransaksi}' AND sgcinputuser= '{userid}' order by sgcmodifikasitgl desc limit 1
```

```sql
Delete from M2_Sgc_Detail where idsgc = '{result_4}'
```

```sql
Insert into M2_Sgc_Detail(idsgcdetail, idsgc, nogiro, kontak, matauang, kurs, jumlah, jumlahvalas, bank, noacbank, rekbank, rekgiro, tgljatuhtempo, catatan, urutan, statusgiro, idsgdetail, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
SELECT glnogiro FROM m2_giro_list WHERE glstatus = 1 AND ({strGiro_ToString})
```

```sql
UPDATE m2_giro_list SET glstatus = '{drutama}sgcjenis', gltglcair = '{drutama}sgctgl', glrekgiro = (CASE glnogiro {strRekgiro_ToString} ELSE glrekgiro END) WHERE {strGiro_ToString}
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Sgctgl, Sgcnotransaksi, Sgcstatus FROM m2_Sgc WHERE Sgcid='{idtransaksi}'
```

```sql
SELECT nogiro FROM m2_sgc_detail WHERE idsgc = '{idtransaksi}'
```

```sql
SELECT glnogiro, glstatus FROM m2_giro_list WHERE ({strGiro_ToString})
```

```sql
UPDATE m2_giro_list SET glstatus = '0', gltglcair = '{FixQuotes_AsFormatTanggal}1900-01-01', glrekgiro = '{rekgiro}' WHERE ({strGiro_ToString})
```

```sql
DELETE FROM M2_Transaction_Journal WHERE tsumber = 'SGC' AND tidtransaksi = '{idtransaksi}' AND tnotransaksi = '{notransaksi}'
```

```sql
UPDATE M2_Sgc SET Sgcstatus = {nilaiStatus}, Sgcmodifikasiuser='{userid}', Sgcmodifikasitgl = NOW(), Sgcposting = 0, Sgcpostingtgl = '1971-01-01 00:00:00', Sgcjmlrevisi = Sgcjmlrevisi + 1 WHERE Sgcid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Sgcid, Sgcnotransaksi FROM m2_Sgc WHERE Sgcid='{idtransaksi}'
```

```sql
DELETE FROM M2_Sgc_Detail WHERE idSgc = '{idtransaksi}'
```

```sql
DELETE FROM M2_Sgc WHERE Sgcid = '{idtransaksi}'
```

```sql
SELECT glnogiro, glstatus FROM m2_giro_list WHERE (glstatus <> 0) AND ({filter}) LIMIT 1
```

```sql
SELECT glnogiro, sgnotransaksi FROM m2_giro_list JOIN m2_sg_detail ON glnogiro = nogiro JOIN m2_sg ON idsg = sgid WHERE (sgstatus = 2 OR sgstatus = 3 OR sgstatus = 4 OR sgstatus = 7) AND (glnogiro = '{FixQuotes_dtvalidasi_Rows_0}glnogiro') LIMIT 1
```

```sql
SELECT glnogiro, sgcnotransaksi FROM m2_giro_list JOIN m2_sgc_detail ON glnogiro = nogiro JOIN m2_sgc ON idsgc = sgcid WHERE (sgcstatus = 2 OR sgcstatus = 3 OR sgcstatus = 4 OR sgcstatus = 7) AND (glnogiro = '{FixQuotes_dtvalidasi_Rows_0}glnogiro') LIMIT 1
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_sgc_history.vb`

```sql
INSERT INTO m2_sgc_history(SELECT 0, sgc.* FROM m2_sgc sgc WHERE sgc.sgcid = '{idtransaksi}')
```

```sql
SELECT sgcidhistory FROM m2_sgc_history WHERE sgcid = '{idtransaksi}' ORDER BY sgcmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m2_sgc_detail_history (SELECT 0, '{result_4}', sgc.* FROM m2_sgc_detail sgc WHERE sgc.idsgc = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_sm.vb`

```sql
SELECT COUNT(smid), smnotransaksi FROM M2_sm WHERE smid='{result_4}' AND smstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(smid) FROM m2_sm WHERE smnotransaksi='{notransaksi}'
```

```sql
Update M2_sm set smcabang = '{FixQuotes_drutama}smcabang', smlokasi = '{FixQuotes_drutama}smlokasi', smsumber = '{FixQuotes_drutama}smsumber', smautonotransaksi = {drutama}smautonotransaksi, smnotransaksi = '{notransaksi}', smtgl = '{FixQuotes_AsFormatTanggal_drutama}smtgl', smkodepa = {drutama}smkodepa, smcarabayar = {drutama}smcarabayar, smkontak = {drutama}smkontak, smkontakperson = '{FixQuotes_drutama}smkontakperson', smnorek = '{FixQuotes_drutama}smnorek', smuraian = '{FixQuotes_drutama}smuraian', smcatatan = '{FixQuotes_drutama}smcatatan', smmatauang = '{FixQuotes_drutama}smmatauang', smkurs = '{FixDouble_drutama}smkurs', smjumlah = '{FixDouble_drutama}smjumlah', smjumlahvalas = '{FixDouble_drutama}smjumlahvalas', smjumlahbayar = '{FixDouble_drutama}smjumlahbayar', smjumlahbayarvalas = '{FixDouble_drutama}smjumlahbayarvalas', smstatusbayar = {drutama}smstatusbayar, smtgllunas = '{FixQuotes_AsFormatTanggal_drutama}smtgllunas', smstatus = {drutama}smstatus, smstatussebelumnya = {drutama}smstatussebelumnya, smjmlrevisi = smjmlrevisi+1, smcetakanke = {drutama}smcetakanke, smisclose = {drutama}smisclose, smmodifikasiuser = {drutama}smmodifikasiuser, smmodifikasitgl = NOW(), smposting = 0, smcustomtext1 = '{FixQuotes_drutama}smcustomtext1', smcustomtext2 = '{FixQuotes_drutama}smcustomtext2', smcustomtext3 = '{FixQuotes_drutama}smcustomtext3', smcustomtext4 = '{FixQuotes_drutama}smcustomtext4', smcustomtext5 = '{FixQuotes_drutama}smcustomtext5', smcustomint1 = {drutama}smcustomint1, smcustomint2 = {drutama}smcustomint2, smcustomint3 = {drutama}smcustomint3, smcustomdbl1 = '{FixDouble_drutama}smcustomdbl1', smcustomdbl2 = '{FixDouble_drutama}smcustomdbl2', smcustomdbl3 = '{FixDouble_drutama}smcustomdbl3', smcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}smcustomdate1', smcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}smcustomdate2', smcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}smcustomdate3' where smid = '{drutama}smid'
```

```sql
Insert into M2_sm (smcabang, smlokasi, smsumber, smautonotransaksi, smnotransaksi, smtgl, smkodepa, smcarabayar, smkontak, smkontakperson, smnorek, smuraian, smcatatan, smmatauang, smkurs, smjumlah, smjumlahvalas, smjumlahbayar, smjumlahbayarvalas, smstatusbayar, smtgllunas, smstatus, smstatussebelumnya, smjmlrevisi, smcetakanke, smisclose, sminputuser, sminputtgl, smmodifikasiuser, smmodifikasitgl, smposting, smcustomtext1, smcustomtext2, smcustomtext3, smcustomtext4, smcustomtext5, smcustomint1, smcustomint2, smcustomint3, smcustomdbl1, smcustomdbl2, smcustomdbl3, smcustomdate1, smcustomdate2, smcustomdate3) values('{FixQuotes_drutama}smcabang', '{FixQuotes_drutama}smlokasi', '{FixQuotes_drutama}smsumber', {drutama}smautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}smtgl', {drutama}smkodepa, {drutama}smcarabayar, {drutama}smkontak, '{FixQuotes_drutama}smkontakperson', '{FixQuotes_drutama}smnorek', '{FixQuotes_drutama}smuraian', '{FixQuotes_drutama}smcatatan', '{FixQuotes_drutama}smmatauang', '{FixDouble_drutama}smkurs', '{FixDouble_drutama}smjumlah', '{FixDouble_drutama}smjumlahvalas', '{FixDouble_drutama}smjumlahbayar', '{FixDouble_drutama}smjumlahbayarvalas', {drutama}smstatusbayar, '{FixQuotes_AsFormatTanggal_drutama}smtgllunas', {drutama}smstatus, {drutama}smstatussebelumnya, {drutama}smjmlrevisi, {drutama}smcetakanke, {drutama}smisclose, {drutama}sminputuser, NOW(), {drutama}smmodifikasiuser, '1971-01-01 00:00:00', 0, '{FixQuotes_drutama}smcustomtext1', '{FixQuotes_drutama}smcustomtext2', '{FixQuotes_drutama}smcustomtext3', '{FixQuotes_drutama}smcustomtext4', '{FixQuotes_drutama}smcustomtext5', {drutama}smcustomint1, {drutama}smcustomint2, {drutama}smcustomint3, '{FixDouble_drutama}smcustomdbl1', '{FixDouble_drutama}smcustomdbl2', '{FixDouble_drutama}smcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}smcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}smcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}smcustomdate3')
```

```sql
select smid from M2_sm where smnotransaksi='{notransaksi}' AND sminputuser= '{userid}' order by smmodifikasitgl desc limit 1
```

```sql
Delete from M2_sm_Detail where idsm = '{result_4}'
```

```sql
Insert into M2_sm_Detail(idsmdetail, idsm, norek, matauang, kurs, jumlah, jumlahvalas, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
Delete from M2_sm_Pay where idsm = '{result_4}'
```

```sql
Insert into M2_sm_Pay(idsmcarabayar, idsm, carabayar, matauang, kurs, jumlah, jumlahvalas, nogiro, tgljt, bank, noacbank, rekbank, rekgiro, catatan, urutan) values{strValue2_ToString}
```

```sql
Insert into M2_Giro_List(glnogiro, glsumber, glidtransaksi, glnotransaksi, glkontak, glrekbank, glrekgiro, gljenis, glbank, glnoacbank, glmatauang, glkurs, gljumlah, gljumlahvalas, gltgljthtempo, gltglcair, glstatus, glstatussebelumnya, glurutan) values{strGiro_ToString}
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Smtgl, Smnotransaksi, Smstatus FROM m2_Sm WHERE Smid='{idtransaksi}'
```

```sql
SELECT glnogiro FROM m2_giro_list WHERE glsumber = 'SM' AND glidtransaksi = '{idtransaksi}' AND glnotransaksi = '{notransaksi}' AND glstatus <> 0
```

```sql
DELETE FROM M2_Transaction_Journal WHERE tsumber = 'SM' AND tidtransaksi = '{idtransaksi}' AND tnotransaksi = '{notransaksi}'
```

```sql
DELETE FROM m2_giro_list WHERE glsumber = 'SM' AND glidtransaksi = '{idtransaksi}' AND glnotransaksi = '{notransaksi}'
```

```sql
UPDATE M2_Sm SET Smstatus = {nilaiStatus}, Smmodifikasiuser='{userid}', Smmodifikasitgl = NOW(), Smposting = 0, Smpostingtgl = '1971-01-01 00:00:00', Smjmlrevisi = Smjmlrevisi + 1 WHERE Smid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Smid, Smnotransaksi FROM m2_Sm WHERE Smid='{idtransaksi}'
```

```sql
DELETE FROM M2_Sm_Pay WHERE idSm = '{idtransaksi}'
```

```sql
DELETE FROM M2_Sm_Detail WHERE idSm = '{idtransaksi}'
```

```sql
DELETE FROM M2_Sm WHERE Smid = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_sm_history.vb`

```sql
INSERT INTO m2_sm_history(SELECT 0, sm.* FROM m2_sm sm WHERE sm.smid = '{idtransaksi}')
```

```sql
SELECT smidhistory FROM m2_sm_history WHERE smid = '{idtransaksi}' ORDER BY smmodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m2_sm_detail_history (SELECT 0, '{result_4}', sm.* FROM m2_sm_detail sm WHERE sm.idsm = '{idtransaksi}' )
```

```sql
INSERT INTO m2_sm_pay_history (SELECT 0, '{result_4}', sm.* FROM m2_sm_pay sm WHERE sm.idsm = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2_transaction_journal.vb`

```sql
select t.tid AS tid, t.tnotransaksi AS tnotransaksi, t.tnorek AS tnorek,c.cnama AS tnoreknama,t.tmatauang AS tmatauang,t.tkurs AS tkurs,t.tdebit AS tdebit,t.tkredit AS tkredit,t.tdebitvalas AS tdebitvalas, t.tkreditvalas AS tkreditvalas, t.tkontak as tkontak, k.kkode as tkontakkode, k.knama as tkontaknama from m2_transaction_journal t left join m1_coa c on t.tnorek = c.cnomor left join m1_contact k on t.tkontak = k.kid
```

```sql
SELECT `tj`.`tidtransaksi` AS `tidtransaksi`,`tj`.`tsumber` AS `tsumber`,`tj`.`tnotransaksi` AS `tnotransaksi`,`tj`.`ttgl` AS `ttgl`,`tj`.`turaian` AS `turaian`,SUM(`tj`.`tdebit`) AS `tdebit`,`tj`.`tkontak` AS `tkontak`,`c`.`kkode` AS `tkontakkode`,`c`.`knama` AS `tkontaknama`,`tj`.`tmatauang` AS `tmatauang`,`tj`.`tkurs` AS `tkurs`,`tj`.`tinputtgl` AS `tinputtgl`,`tj`.`tinputuser` AS `tinputuser`,`ui`.`ukode` AS `tinputuserkode`,`ui`.`unama` AS `tinputusernama`,`tj`.`tstatus` AS `tstatus`,`s`.`nama` AS `tstatusnama`,`tj`.`tmodifikasitgl` AS `tmodifikasitgl`,`tj`.`tmodifikasiuser` AS `tmodifikasiuser`,`um`.`ukode` AS `tmodifikasiuserkode`,`um`.`unama` AS `tmodifikasiusernama`, tj.tsaldoawal as tsaldoawal FROM `m2_transaction_journal` `tj` LEFT JOIN `m1_contact` `c` ON `c`.`kid` = `tj`.`tkontak` LEFT JOIN `m0_user` `ui` ON `ui`.`userid` = `tj`.`tinputuser` LEFT JOIN `m0_user` `um` ON `um`.`userid` = `tj`.`tmodifikasiuser` LEFT JOIN `m0_status` `s` ON `s`.`kode` = `tj`.`tstatus`
```

## `client-backend/api-myerpplus/app_code/ws/m2/m2r_laba_pertahun.vb`

```sql
DELETE FROM M2r_Posisi_Keuangan WHERE idmsmq = '{FixQuotes_idMsmq}'
```

```sql
SELECT '{FixDouble_tahun}' as pktahun, '{FixDouble_bulan}' as pkbulan, c.cnomor as pknorek, c.cnama as pknoreknama, c.ctipe as pktipe, c.cgd as pkgd, c.cjenis as pkjenis, c.clevel as pklevel, c.clevel1 as pklevel1, c.clevel2 as pklevel2, c.clevel3 as pklevel3, c.clevel4 as pklevel4, c.clevel5 as pklevel5, (CASE c.clevel WHEN '{FixDouble_level}' THEN 'D' ELSE 'G' END) AS pkgddata, '{FixDouble_level}' as pkleveldata, (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) AS pkdebit, (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) AS pkkredit, (CASE c.cdc WHEN 'D' THEN (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) ELSE (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) END) AS pksaldo FROM m1_coa c LEFT JOIN m2_realization r ON c.cnomor = r.rnorek AND (r.rtahun = '{FixDouble_tahun}' AND r.rbulan = '{FixDouble_bulan}') WHERE (c.ctipe = '11') AND c.clevel <= '{FixDouble_level}' GROUP BY c.cnomor ORDER BY c.cnomor
```

```sql
SELECT c.cnomor as pknorek, (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) AS pkdebitlalu, (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) AS pkkreditlalu, (CASE c.cdc WHEN 'D' THEN (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) ELSE (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) END) AS pksaldolalu FROM m1_coa c LEFT JOIN m2_realization r ON c.cnomor = r.rnorek AND (r.rtahun = '{FixDouble_tahunLalu}' AND r.rbulan = '{FixDouble_bulanLalu}') WHERE (c.ctipe = '11') AND c.clevel <= '{FixDouble_level}' GROUP BY c.cnomor ORDER BY c.cnomor
```

```sql
SELECT '{FixDouble_tahun}'as pktahun, '{FixDouble_bulan}' as pkbulan, c.cnomor as plnorek, c.cnama as pknoreknama, c.ctipe as pktipe, c.cdg as pkgd, c.cjenis as pkjenis, c.clevel as pklevel, c.clevel1 as pklevel1, c.clevel1, c.clevel2 as pklevel2, c.clevel3 as pklevel3, c.clevel4 as pklevel4, c.clevel5 as pklevel5, (CASE c.clevel WHEN '{FixDouble_level}' THEN 'D' ELSE 'G' END) AS pkgddata, '{FixDouble_level}' as pkleveldata, (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) AS pkdebit, (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) AS pkkredit, (CASE c.cdc WHEN 'D' THEN (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) ELSE (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) END) AS pksaldo FROM m1_coa c LEFT JOIN m2_realization r ON c.cnomor = r.rnorek AND (r.rtahun = '{FixDouble_tahun}' ) WHERE (c.ctipe = '11') AND r.rbulan = '1' AND c.clevel <= '{FixDouble_level}' GROUP BY c.cnomor ORDER BY c.cnomor
```

```sql
SELECT '{FixDouble_tahun}'as pktahun, '{FixDouble_bulan}' as pkbulan, c.cnomor as plnorek, c.cnama as pknoreknama, c.ctipe as pktipe, c.cdg as pkgd, c.cjenis as pkjenis, c.clevel as pklevel, c.clevel1 as pklevel1, c.clevel1, c.clevel2 as pklevel2, c.clevel3 as pklevel3, c.clevel4 as pklevel4, c.clevel5 as pklevel5, (CASE c.clevel WHEN '{FixDouble_level}' THEN 'D' ELSE 'G' END) AS pkgddata, '{FixDouble_level}' as pkleveldata, (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) AS pkdebit, (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) AS pkkredit, (CASE c.cdc WHEN 'D' THEN (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) ELSE (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) END) AS pksaldolalu FROM m1_coa c LEFT JOIN m2_realization r ON c.cnomor = r.rnorek AND (r.rtahun = '{FixDouble_tahun}' ) WHERE (c.ctipe = '11') AND r.rbulan = '2' AND c.clevel <= '{FixDouble_level}' GROUP BY c.cnomor ORDER BY c.cnomor
```

```sql
Insert into M2r_Posisi_Keuangan(pkurut, idlogin, pktahun, pkbulan, pknorek, pknoreknama, pktipe, pkgd, pkjenis, pklevel, pklevel1, pklevel2, pklevel3, pklevel4, pklevel5, pkgddata, pkleveldata, pkdebit, pkkredit, pksaldo, pkdebitlalu, pkkreditlalu, pksaldolalu, pkdebitvariasi, pkkreditvariasi, pksaldovariasi, idmsmq, pkuserid, pkcustomtext1, pkcustomtext2, pkcustomtext3, pkcustomtext4, pkcustomtext5, pkcustomint1, pkcustomint2, pkcustomint3, pkcustomint4, pkcustomint5, pkcustomdbl1, pkcustomdbl2, pkcustomdbl3, pkcustomdbl4, pkcustomdbl5, pkcustomdate1, pkcustomdate2, pkcustomdate3, pkcustomdate4, pkcustomdate5) values{strValue_ToString}
```

```sql
SELECT '{FixDouble_tahun}' as pktahun, '{FixDouble_bulan}' as pkbulan, c.cnomor as pknorek, c.cnama as pknoreknama, c.ctipe as pktipe, c.cgd as pkgd, c.cjenis as pkjenis, c.clevel as pklevel, c.clevel1 as pklevel1, c.clevel2 as pklevel2, c.clevel3 as pklevel3, c.clevel4 as pklevel4, c.clevel5 as pklevel5, (CASE c.clevel WHEN '{FixDouble_level}' THEN 'D' ELSE 'G' END) AS pkgddata, '{FixDouble_level}' as pkleveldata, (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) AS pkdebit, (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) AS pkkredit, (CASE c.cdc WHEN 'D' THEN (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) ELSE (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) END) AS pksaldo FROM m1_coa c LEFT JOIN m2_realization r ON c.cnomor = r.rnorek AND (r.rtahun = '{FixDouble_tahun}' AND r.rbulan = '{FixDouble_bulan}') WHERE (c.ctipe = '12') AND c.clevel <= '{IIf_levelInduk_1_And_level_levelInduk_FixDouble_levelInduk_FixDouble_level}' GROUP BY c.cnomor ORDER BY c.cnomor
```

```sql
SELECT '{FixDouble_tahun}' as pktahun, '{FixDouble_bulan}' as pkbulan, c.cnomor as pknorek, c.cnama as pknoreknama, c.ctipe as pktipe, c.cgd as pkgd, c.cjenis as pkjenis, c.clevel as pklevel, c.clevel1 as pklevel1, c.clevel2 as pklevel2, c.clevel3 as pklevel3, c.clevel4 as pklevel4, c.clevel5 as pklevel5, (CASE c.clevel WHEN '{FixDouble_level}' THEN 'D' ELSE 'G' END) AS pkgddata, '{FixDouble_level}' as pkleveldata, (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) AS pkdebit, (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) AS pkkredit, (CASE c.cdc WHEN 'D' THEN (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) ELSE (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) END) AS pksaldo FROM m1_coa c LEFT JOIN m2_realization r ON c.cnomor = r.rnorek AND (r.rtahun = '{FixDouble_tahun}' ) WHERE (c.ctipe = '12') AND r.rbulan = '1' AND c.clevel <= '{IIf_levelInduk_1_And_level_levelInduk_FixDouble_levelInduk_FixDouble_level}' GROUP BY c.cnomor ORDER BY c.cnomor
```

```sql
SELECT '{FixDouble_tahun}' as pktahun, '{FixDouble_bulan}' as pkbulan, c.cnomor as pknorek, c.cnama as pknoreknama, c.ctipe as pktipe, c.cgd as pkgd, c.cjenis as pkjenis, c.clevel as pklevel, c.clevel1 as pklevel1, c.clevel2 as pklevel2, c.clevel3 as pklevel3, c.clevel4 as pklevel4, c.clevel5 as pklevel5, (CASE c.clevel WHEN '{FixDouble_level}' THEN 'D' ELSE 'G' END) AS pkgddata, '{FixDouble_level}' as pkleveldata, (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) AS pkdebit, (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) AS pkkredit, (CASE c.cdc WHEN 'D' THEN (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) ELSE (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) END) AS pksaldolalu FROM m1_coa c LEFT JOIN m2_realization r ON c.cnomor = r.rnorek AND (r.rtahun = '{FixDouble_tahun}' ) WHERE (c.ctipe = '12') AND r.rbulan = '2' AND c.clevel <= '{IIf_levelInduk_1_And_level_levelInduk_FixDouble_levelInduk_FixDouble_level}' GROUP BY c.cnomor ORDER BY c.cnomor
```

```sql
SELECT c.cnomor as pknorek, (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) AS pkdebitlalu, (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) AS pkkreditlalu, (CASE c.cdc WHEN 'D' THEN (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) ELSE (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) END) AS pksaldolalu FROM m1_coa c LEFT JOIN m2_realization r ON c.cnomor = r.rnorek AND (r.rtahun = '{FixDouble_tahunLalu}' AND r.rbulan = '{FixDouble_bulanLalu}') WHERE (c.ctipe = '12') AND c.clevel <= '{IIf_levelInduk_1_And_level_levelInduk_FixDouble_levelInduk_FixDouble_level}' GROUP BY c.cnomor ORDER BY c.cnomor
```

```sql
SELECT '{FixDouble_tahun}' as pktahun, '{FixDouble_bulan}' as pkbulan, c.cnomor as pknorek, c.cnama as pknoreknama, c.ctipe as pktipe, c.cgd as pkgd, c.cjenis as pkjenis, c.clevel as pklevel, c.clevel1 as pklevel1, c.clevel2 as pklevel2, c.clevel3 as pklevel3, c.clevel4 as pklevel4, c.clevel5 as pklevel5, (CASE c.clevel WHEN '{FixDouble_level}' THEN 'D' ELSE 'G' END) AS pkgddata, '{FixDouble_level}' as pkleveldata, (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) AS pkdebit, (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) AS pkkredit, (CASE c.cdc WHEN 'D' THEN (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) ELSE (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) END) AS pksaldo FROM m1_coa c LEFT JOIN m2_realization r ON c.cnomor = r.rnorek AND (r.rtahun = '{FixDouble_tahun}' AND r.rbulan = '{FixDouble_bulan}') WHERE (c.ctipe = '14') AND c.clevel <= '{FixDouble_level}' GROUP BY c.cnomor ORDER BY c.cnomor
```

```sql
SELECT c.cnomor as pknorek, (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) AS pkdebitlalu, (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) AS pkkreditlalu, (CASE c.cdc WHEN 'D' THEN (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) ELSE (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) END) AS pksaldolalu FROM m1_coa c LEFT JOIN m2_realization r ON c.cnomor = r.rnorek AND (r.rtahun = '{FixDouble_tahunLalu}' AND r.rbulan = '{FixDouble_bulanLalu}') WHERE (c.ctipe = '14') AND c.clevel <= '{FixDouble_level}' GROUP BY c.cnomor ORDER BY c.cnomor
```

```sql
SELECT '{FixDouble_tahun}' as pktahun, '{FixDouble_bulan}' as pkbulan, c.cnomor as pknorek, c.cnama as pknoreknama, c.ctipe as pktipe, c.cgd as pkgd, c.cjenis as pkjenis, c.clevel as pklevel, c.clevel1 as pklevel1, c.clevel2 as pklevel2, c.clevel3 as pklevel3, c.clevel4 as pklevel4, c.clevel5 as pklevel5, (CASE c.clevel WHEN '{FixDouble_level}' THEN 'D' ELSE 'G' END) AS pkgddata, '{FixDouble_level}' as pkleveldata, (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) AS pkdebit, (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) AS pkkredit, (CASE c.cdc WHEN 'D' THEN (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) ELSE (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) END) AS pksaldo FROM m1_coa c LEFT JOIN m2_realization r ON c.cnomor = r.rnorek AND (r.rtahun = '{FixDouble_tahun}' ) WHERE (c.ctipe = '14') AND r.rbulan = '1' AND c.clevel <= '{FixDouble_level}' GROUP BY c.cnomor ORDER BY c.cnomor
```

```sql
SELECT '{FixDouble_tahun}' as pktahun, '{FixDouble_bulan}' as pkbulan, c.cnomor as pknorek, c.cnama as pknoreknama, c.ctipe as pktipe, c.cgd as pkgd, c.cjenis as pkjenis, c.clevel as pklevel, c.clevel1 as pklevel1, c.clevel2 as pklevel2, c.clevel3 as pklevel3, c.clevel4 as pklevel4, c.clevel5 as pklevel5, (CASE c.clevel WHEN '{FixDouble_level}' THEN 'D' ELSE 'G' END) AS pkgddata, '{FixDouble_level}' as pkleveldata, (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) AS pkdebit, (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) AS pkkredit, (CASE c.cdc WHEN 'D' THEN (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) ELSE (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) END) AS pksaldolalu FROM m1_coa c LEFT JOIN m2_realization r ON c.cnomor = r.rnorek AND (r.rtahun = '{FixDouble_tahun}' ) WHERE (c.ctipe = '14') AND r.rbulan = '2' AND c.clevel <= '{FixDouble_level}' GROUP BY c.cnomor ORDER BY c.cnomor
```

```sql
SELECT '{FixDouble_tahun}' as pktahun, '{FixDouble_bulan}' as pkbulan, c.cnomor as pknorek, c.cnama as pknoreknama, c.ctipe as pktipe, c.cgd as pkgd, c.cjenis as pkjenis, c.clevel as pklevel, c.clevel1 as pklevel1, c.clevel2 as pklevel2, c.clevel3 as pklevel3, c.clevel4 as pklevel4, c.clevel5 as pklevel5, (CASE c.clevel WHEN '{FixDouble_level}' THEN 'D' ELSE 'G' END) AS pkgddata, '{FixDouble_level}' as pkleveldata, (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) AS pkdebit, (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) AS pkkredit, (CASE c.cdc WHEN 'D' THEN (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) ELSE (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) END) AS pksaldo FROM m1_coa c LEFT JOIN m2_realization r ON c.cnomor = r.rnorek AND (r.rtahun = '{FixDouble_tahun}' AND r.rbulan = '{FixDouble_bulan}') WHERE (c.ctipe = '13') AND c.clevel <= '{FixDouble_level}' GROUP BY c.cnomor ORDER BY c.cnomor
```

```sql
SELECT c.cnomor as pknorek, (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) AS pkdebitlalu, (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) AS pkkreditlalu, (CASE c.cdc WHEN 'D' THEN (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) ELSE (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) END) AS pksaldolalu FROM m1_coa c LEFT JOIN m2_realization r ON c.cnomor = r.rnorek AND (r.rtahun = '{FixDouble_tahunLalu}' AND r.rbulan = '{FixDouble_bulanLalu}') WHERE (c.ctipe = '13') AND c.clevel <= '{FixDouble_level}' GROUP BY c.cnomor ORDER BY c.cnomor
```

```sql
SELECT '{FixDouble_tahun}' as pktahun, '{FixDouble_bulan}' as pkbulan, c.cnomor as pknorek, c.cnama as pknoreknama, c.ctipe as pktipe, c.cgd as pkgd, c.cjenis as pkjenis, c.clevel as pklevel, c.clevel1 as pklevel1, c.clevel2 as pklevel2, c.clevel3 as pklevel3, c.clevel4 as pklevel4, c.clevel5 as pklevel5, (CASE c.clevel WHEN '{FixDouble_level}' THEN 'D' ELSE 'G' END) AS pkgddata, '{FixDouble_level}' as pkleveldata, (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) AS pkdebit, (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) AS pkkredit, (CASE c.cdc WHEN 'D' THEN (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) ELSE (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) END) AS pksaldo FROM m1_coa c LEFT JOIN m2_realization r ON c.cnomor = r.rnorek AND (r.rtahun = '{FixDouble_tahun}') WHERE (c.ctipe = '13') AND r.rbulan = '1' AND c.clevel <= '{FixDouble_level}' GROUP BY c.cnomor ORDER BY c.cnomor
```

```sql
SELECT '{FixDouble_tahun}' as pktahun, '{FixDouble_bulan}' as pkbulan, c.cnomor as pknorek, c.cnama as pknoreknama, c.ctipe as pktipe, c.cgd as pkgd, c.cjenis as pkjenis, c.clevel as pklevel, c.clevel1 as pklevel1, c.clevel2 as pklevel2, c.clevel3 as pklevel3, c.clevel4 as pklevel4, c.clevel5 as pklevel5, (CASE c.clevel WHEN '{FixDouble_level}' THEN 'D' ELSE 'G' END) AS pkgddata, '{FixDouble_level}' as pkleveldata, (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) AS pkdebit, (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) AS pkkredit, (CASE c.cdc WHEN 'D' THEN (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) ELSE (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) END) AS pksaldolalu FROM m1_coa c LEFT JOIN m2_realization r ON c.cnomor = r.rnorek AND (r.rtahun = '{FixDouble_tahun}') WHERE (c.ctipe = '13') AND r.rbulan = '2' AND c.clevel <= '{FixDouble_level}' GROUP BY c.cnomor ORDER BY c.cnomor
```

```sql
SELECT '{FixDouble_tahun}' as pktahun, '{FixDouble_bulan}' as pkbulan, c.cnomor as pknorek, c.cnama as pknoreknama, c.ctipe as pktipe, c.cgd as pkgd, c.cjenis as pkjenis, c.clevel as pklevel, c.clevel1 as pklevel1, c.clevel2 as pklevel2, c.clevel3 as pklevel3, c.clevel4 as pklevel4, c.clevel5 as pklevel5, (CASE c.clevel WHEN '{FixDouble_level}' THEN 'D' ELSE 'G' END) AS pkgddata, '{FixDouble_level}' as pkleveldata, (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) AS pkdebit, (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) AS pkkredit, (CASE c.cdc WHEN 'D' THEN (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) ELSE (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) END) AS pksaldo FROM m1_coa c LEFT JOIN m2_realization r ON c.cnomor = r.rnorek AND (r.rtahun = '{FixDouble_tahun}' AND r.rbulan = '{FixDouble_bulan}') WHERE (c.ctipe = '15') AND c.clevel <= '{FixDouble_level}' GROUP BY c.cnomor ORDER BY c.cnomor
```

```sql
SELECT c.cnomor as pknorek, (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) AS pkdebitlalu, (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) AS pkkreditlalu, (CASE c.cdc WHEN 'D' THEN (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) ELSE (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) END) AS pksaldolalu FROM m1_coa c LEFT JOIN m2_realization r ON c.cnomor = r.rnorek AND (r.rtahun = '{FixDouble_tahunLalu}' AND r.rbulan = '{FixDouble_bulanLalu}') WHERE (c.ctipe = '15') AND c.clevel <= '{FixDouble_level}' GROUP BY c.cnomor ORDER BY c.cnomor
```

```sql
SELECT '{FixDouble_tahun}' as pktahun, '{FixDouble_bulan}' as pkbulan, c.cnomor as pknorek, c.cnama as pknoreknama, c.ctipe as pktipe, c.cgd as pkgd, c.cjenis as pkjenis, c.clevel as pklevel, c.clevel1 as pklevel1, c.clevel2 as pklevel2, c.clevel3 as pklevel3, c.clevel4 as pklevel4, c.clevel5 as pklevel5, (CASE c.clevel WHEN '{FixDouble_level}' THEN 'D' ELSE 'G' END) AS pkgddata, '{FixDouble_level}' as pkleveldata, (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) AS pkdebit, (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) AS pkkredit, (CASE c.cdc WHEN 'D' THEN (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) ELSE (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) END) AS pksaldo FROM m1_coa c LEFT JOIN m2_realization r ON c.cnomor = r.rnorek AND (r.rtahun = '{FixDouble_tahun}') WHERE (c.ctipe = '15') AND r.rbulan = '1' AND c.clevel <= '{FixDouble_level}' GROUP BY c.cnomor ORDER BY c.cnomor
```

```sql
SELECT '{FixDouble_tahun}' as pktahun, '{FixDouble_bulan}' as pkbulan, c.cnomor as pknorek, c.cnama as pknoreknama, c.ctipe as pktipe, c.cgd as pkgd, c.cjenis as pkjenis, c.clevel as pklevel, c.clevel1 as pklevel1, c.clevel2 as pklevel2, c.clevel3 as pklevel3, c.clevel4 as pklevel4, c.clevel5 as pklevel5, (CASE c.clevel WHEN '{FixDouble_level}' THEN 'D' ELSE 'G' END) AS pkgddata, '{FixDouble_level}' as pkleveldata, (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) AS pkdebit, (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) AS pkkredit, (CASE c.cdc WHEN 'D' THEN (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) ELSE (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) END) AS pksaldolalu FROM m1_coa c LEFT JOIN m2_realization r ON c.cnomor = r.rnorek AND (r.rtahun = '{FixDouble_tahun}') WHERE (c.ctipe = '15') AND r.rbulan = '2' AND c.clevel <= '{FixDouble_level}' GROUP BY c.cnomor ORDER BY c.cnomor
```

```sql
SELECT '{FixDouble_tahun}' as pktahun, '{FixDouble_bulan}' as pkbulan, c.cnomor as pknorek, c.cnama as pknoreknama, c.ctipe as pktipe, c.cgd as pkgd, c.cjenis as pkjenis, c.clevel as pklevel, c.clevel1 as pklevel1, c.clevel2 as pklevel2, c.clevel3 as pklevel3, c.clevel4 as pklevel4, c.clevel5 as pklevel5, (CASE c.clevel WHEN '{FixDouble_level}' THEN 'D' ELSE 'G' END) AS pkgddata, '{FixDouble_level}' as pkleveldata, (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) AS pkdebit, (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) AS pkkredit, (CASE c.cdc WHEN 'D' THEN (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) ELSE (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) END) AS pksaldo FROM m1_coa c LEFT JOIN m2_realization r ON c.cnomor = r.rnorek AND (r.rtahun = '{FixDouble_tahun}' AND r.rbulan = '{FixDouble_bulan}') WHERE (c.ctipe = '11' OR c.ctipe = '12' OR c.ctipe = '13' OR c.ctipe = '14' OR c.ctipe = '15') AND c.clevel = '{FixDouble_1}' GROUP BY c.cjenis ORDER BY c.cnomor
```

```sql
SELECT c.cnomor as pknorek, (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) AS pkdebitlalu, (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) AS pkkreditlalu, (CASE c.cdc WHEN 'D' THEN (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) ELSE (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) END) AS pksaldolalu FROM m1_coa c LEFT JOIN m2_realization r ON c.cnomor = r.rnorek AND (r.rtahun = '{FixDouble_tahunLalu}' AND r.rbulan = '{FixDouble_bulanLalu}') WHERE (c.ctipe = '11' OR c.ctipe = '12' OR c.ctipe = '13' OR c.ctipe = '14' OR c.ctipe = '15') AND c.clevel = '{FixDouble_1}' GROUP BY c.cjenis ORDER BY c.cnomor
```

```sql
SELECT '{FixDouble_tahun}' as pktahun, '{FixDouble_bulan}' as pkbulan, c.cnomor as pknorek, c.cnama as pknoreknama, c.ctipe as pktipe, c.cgd as pkgd, c.cjenis as pkjenis, c.clevel as pklevel, c.clevel1 as pklevel1, c.clevel2 as pklevel2, c.clevel3 as pklevel3, c.clevel4 as pklevel4, c.clevel5 as pklevel5, (CASE c.clevel WHEN '{FixDouble_level}' THEN 'D' ELSE 'G' END) AS pkgddata, '{FixDouble_level}' as pkleveldata, (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) AS pkdebit, (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) AS pkkredit, (CASE c.cdc WHEN 'D' THEN (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) ELSE (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) END) AS pksaldo FROM m1_coa c LEFT JOIN m2_realization r ON c.cnomor = r.rnorek AND (r.rtahun = '{FixDouble_tahun}' ) WHERE (c.ctipe = '11' OR c.ctipe = '12' OR c.ctipe = '13' OR c.ctipe = '14' OR c.ctipe = '15') AND r.rbulan = '1' AND c.clevel = '{FixDouble_1}' GROUP BY c.cjenis ORDER BY c.cnomor
```

```sql
SELECT '{FixDouble_tahun}' as pktahun, '{FixDouble_bulan}' as pkbulan, c.cnomor as pknorek, c.cnama as pknoreknama, c.ctipe as pktipe, c.cgd as pkgd, c.cjenis as pkjenis, c.clevel as pklevel, c.clevel1 as pklevel1, c.clevel2 as pklevel2, c.clevel3 as pklevel3, c.clevel4 as pklevel4, c.clevel5 as pklevel5, (CASE c.clevel WHEN '{FixDouble_level}' THEN 'D' ELSE 'G' END) AS pkgddata, '{FixDouble_level}' as pkleveldata, (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) AS pkdebit, (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) AS pkkredit, (CASE c.cdc WHEN 'D' THEN (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) ELSE (IFNULL(SUM(r.rjmlkredit),0) / {FixDouble_pembagiNominal}) - (IFNULL(SUM(r.rjmldebit),0) / {FixDouble_pembagiNominal}) END) AS pksaldolalu FROM m1_coa c LEFT JOIN m2_realization r ON c.cnomor = r.rnorek AND (r.rtahun = '{FixDouble_tahun}' ) WHERE (c.ctipe = '11' OR c.ctipe = '12' OR c.ctipe = '13' OR c.ctipe = '14' OR c.ctipe = '15') AND r.rbulan = '2' AND c.clevel = '{FixDouble_1}' GROUP BY c.cjenis ORDER BY c.cnomor
```

```sql
SELECT apkode, aptutupperiode FROM m2_accounting_period WHERE aptahun = '{vtahun}' AND apbulan = '{vbulan}'
```

```sql
UPDATE m2_realization SET rjmldebit = 0, rjmlkredit = 0 WHERE rkodepa = '{vkodepa}'
```

```sql
SELECT tnorek as norek, SUM(tdebit) as debit, SUM(tkredit) as kredit FROM m2_transaction_journal WHERE tstatus IN(2, 3, 4, 7) AND tkodepa = '{vkodepa}' GROUP BY tnorek
```

```sql
INSERT INTO m2_realization (rtahun, rbulan, rnorek, rjmldebit, rjmlkredit, ranggaran, rkodepa) VALUES {strUpdate} ON DUPLICATE KEY UPDATE rjmldebit = VALUES(rjmldebit), rjmlkredit = VALUES(rjmlkredit)
```

```sql
SELECT IFNULL(SUM(tkredit) - SUM(tdebit),0) as saldo FROM m2_transaction_journal JOIN m1_coa ON tnorek = cnomor WHERE tstatus IN(2, 3, 4, 7) AND (ctipe = 11 OR ctipe = 14) AND tkodepa = '{vkodepa}'
```

```sql
SELECT IFNULL(SUM(tdebit) - SUM(tkredit),0) as saldo FROM m2_transaction_journal JOIN m1_coa ON tnorek = cnomor WHERE tstatus IN(2, 3, 4, 7) AND (ctipe = 12 OR ctipe = 13 OR ctipe = 15) AND tkodepa = '{vkodepa}'
```

```sql
INSERT INTO m2_realization (rtahun, rbulan, rnorek, rjmldebit, rjmlkredit, ranggaran, rkodepa) VALUES {strUpdate} ON DUPLICATE KEY UPDATE rjmldebit = rjmldebit + VALUES(rjmldebit), rjmlkredit = rjmlkredit + VALUES(rjmlkredit)
```

```sql
SELECT c.clevel4 as norek, SUM(r.rjmldebit) as debit, SUM(r.rjmlkredit) as kredit FROM m2_realization r JOIN m1_coa c ON r.rnorek = c.cnomor WHERE r.rkodepa = '{vkodepa}' AND c.clevel = 5 GROUP BY c.clevel4
```

```sql
SELECT c.clevel3 as norek, SUM(r.rjmldebit) as debit, SUM(r.rjmlkredit) as kredit FROM m2_realization r JOIN m1_coa c ON r.rnorek = c.cnomor WHERE r.rkodepa = '{vkodepa}' AND c.clevel = 4 GROUP BY c.clevel3
```

```sql
SELECT c.clevel2 as norek, SUM(r.rjmldebit) as debit, SUM(r.rjmlkredit) as kredit FROM m2_realization r JOIN m1_coa c ON r.rnorek = c.cnomor WHERE r.rkodepa = '{vkodepa}' AND c.clevel = 3 GROUP BY c.clevel2
```

```sql
SELECT c.clevel1 as norek, SUM(r.rjmldebit) as debit, SUM(r.rjmlkredit) as kredit FROM m2_realization r JOIN m1_coa c ON r.rnorek = c.cnomor WHERE r.rkodepa = '{vkodepa}' AND c.clevel = 2 GROUP BY c.clevel1
```

