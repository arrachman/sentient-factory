# M7 Queries By Type

Grouped from `m7-queries.md` by SQL statement type.

## SELECT

Total: `70`

### `client-backend/api-myerpplus/app_code/ws/m7/m7_ab.vb`

```sql
SELECT COUNT(abid) FROM M7_Ab WHERE abid=
```

```sql
select abid from M7_Ab where Abinputuser= '{userid}' order by Abmodifikasitgl desc limit 1
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_ae.vb`

```sql
SELECT EXISTS(SELECT 1 FROM m7_ao_detail JOIN m7_ao ON idao = aoid WHERE idaodetail = '{idaodetail}' AND (aostatus = 2 OR aostatus = 3 OR aostatus = 4 OR aostatus = 7) LIMIT 1) as rowExists, '{idaodetail}' as idaodetail
```

```sql
SELECT COUNT(aeid) FROM M7_Ae WHERE aeid=
```

```sql
SELECT COUNT(aeid) FROM m7_ae WHERE aenotransaksi='{notransaksi}'
```

```sql
select aeid from M7_ae where aenotransaksi='{notransaksi}' AND aeinputuser= '{userid}' order by aemodifikasitgl desc limit 1
```

```sql
select aid from M7_Asset where akode = '{dataRowMaster_1}' order by aid desc limit 1
```

```sql
SELECT idao FROM M7_ao_detail WHERE {updFilterAO} GROUP BY idao
```

```sql
SELECT idao, SUM(jml) as jml, SUM(jmlrealisasi) as jmlrealisasi FROM M7_ao_detail WHERE {ftDetail} GROUP BY idao
```

```sql
select `a`.`aid` AS `aid`,`a`.`akode` AS `akode`,`a`.`anama` AS `anama`,`a`.`akategori` AS `akategori`,`a`.`acabang` AS `acabang`,`a`.`alokasi` AS `alokasi`,`a`.`adivisi` AS `adivisi`,`a`.`asubdivisi` AS `asubdivisi`,`a`.`acatatan` AS `acatatan`,`a`.`anomor` AS `anomor`,`a`.`atglbeli` AS `atglbeli`,`a`.`atglpakai` AS `atglpakai`,`a`.`amatauang` AS `amatauang`,`a`.`akurs` AS `akurs`,`a`.`ahargabeli` AS `ahargabeli`,`a`.`anilairesidu` AS `anilairesidu`,`a`.`aumurekonomis` AS `aumurekonomis`,`a`.`abebanperbln` AS `abebanperbln`,`a`.`aakumulasibeban` AS `aakumulasibeban`,`a`.`anilaibuku` AS `anilaibuku`,`a`.`ametode` AS `ametode`,`a`.`atabelpenyusutan` AS `atabelpenyusutan`,`a`.`aintangible` AS `aintangible`,`a`.`afiskal` AS `afiskal`,`a`.`aatastengahbulan` AS `aatastengahbulan`,`a`.`arekasset` AS `arekasset`,`a`.`arekakumdepresiasi` AS `arekakumdepresiasi`,`a`.`arekdepresiasi` AS `arekdepresiasi`,`a`.`arekpenghapusan` AS `arekpenghapusan`,`a`.`aprodusen` AS `aprodusen`,`a`.`atglpensiun` AS `atglpensiun`,`a`.`apenyusutanke` AS `apenyusutanke`,`a`.`anilaimenurun` AS `anilaimenurun`,`a`.`adispose` AS `adispose`,`a`.`apembelian` AS `apembelian`,`a`.`apenjualan` AS `apenjualan`,`a`.`alocked` AS `alocked`,`a`.`astatus` AS `astatus`,`a`.`astatussebelumnya` AS `astatussebelumnya`,`a`.`aisclose` AS `aisclose`,`a`.`ainputuser` AS `ainputuser`,`a`.`ainputtgl` AS `ainputtgl`,`a`.`amodifikasiuser` AS `amodifikasiuser`,`a`.`amodifikasitgl` AS `amodifikasitgl`,`ac`.`acnama` AS `akategorinama`,`br`.`bnama` AS `acabangnama`,`l`.`lnama` AS `alokasinama`,`d`.`dnama` AS `adivisinama`,`sd`.`sdnama` AS `asubdivisinama`,`dc`.`nama` AS `ametodenama`,`coa1`.`cnama` AS `arekassetnama`,`coa2`.`cnama` AS `arekakumdepresiasinama`,`coa3`.`cnama` AS `arekdepresiasinama`,`coa4`.`cnama` AS `arekpenghapusannama`,`c1`.`kkode` AS `aprodusenkode`,`c1`.`knama` AS `aprodusennama`,`sp1`.`nama` AS `astatusnama`,`sp2`.`nama` AS `astatussebelumnyanama`,`u1`.`unama` AS `ainputusernama`,`u2`.`unama` AS `amodifikasiusernama`,`a`.`acustomtext1` AS `acustomtext1`,`a`.`acustomtext2` AS `acustomtext2`,`a`.`acustomtext3` AS `acustomtext3`,`a`.`acustomtext4` AS `acustomtext4`,`a`.`acustomtext5` AS `acustomtext5`,`a`.`acustomint1` AS `acustomint1`,`a`.`acustomint2` AS `acustomint2`,`a`.`acustomint3` AS `acustomint3`,`a`.`acustomdbl1` AS `acustomdbl1`,`a`.`acustomdbl2` AS `acustomdbl2`,`a`.`acustomdbl3` AS `acustomdbl3`,`a`.`acustomdate1` AS `acustomdate1`,`a`.`acustomdate2` AS `acustomdate2`,`a`.`acustomdate3` AS `acustomdate3`,`a`.`asatuan` AS `asatuan`, `a`.`aharga` AS `aharga`, `a`.`adiskon` AS `adiskon`,`a`.`ajmldiskon` AS `ajmldiskon`,`a`.`apajak1` AS `apajak1`,`a`.`ajmlpajak1` AS `ajmlpajak1`,`a`.`apajak2` AS `apajak2`,`a`.`ajmlpajak2` AS `ajmlpajak2` from ((((((((((((((((`m7_asset` `a` left join `m7_asset_category` `ac` on((`a`.`akategori` = `ac`.`ackode`))) left join `m1_branch` `br` on((`a`.`acabang` = `br`.`bkode`))) left join `m1_location` `l` on((`a`.`alokasi` = `l`.`lkode`))) left join `m1_division` `d` on((`a`.`adivisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`a`.`asubdivisi` = `sd`.`sdkode`))) left join `m7_depreciation_category` `dc` on((`a`.`ametode` = `dc`.`kode`))) left join `m1_coa` `coa1` on((`a`.`arekasset` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`a`.`arekakumdepresiasi` = `coa2`.`cnomor`))) left join `m1_coa` `coa3` on((`a`.`arekdepresiasi` = `coa3`.`cnomor`))) left join `m1_coa` `coa4` on((`a`.`arekpenghapusan` = `coa4`.`cnomor`))) left join `m1_contact` `c1` on((`a`.`aprodusen` = `c1`.`kid`))) left join `m0_status_progress` `sp1` on((`a`.`astatus` = `sp1`.`kode`))) left join `m0_status_progress` `sp2` on((`a`.`astatussebelumnya` = `sp2`.`kode`))) left join `m0_user` `u1` on((`a`.`ainputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`a`.`amodifikasiuser` = `u2`.`userid`))) left join `m7_ae_detail` `ae` on((`a`.`aid` = `ae`.`idasset`)))
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_ag.vb`

```sql
SELECT COUNT(agid) FROM M7_Ag WHERE agid=
```

```sql
SELECT COUNT(agid) FROM m7_ag WHERE agnotransaksi='{notransaksi}'
```

```sql
select agid from M7_ag where agnotransaksi='{notransaksi}' AND aginputuser= '{userid}' order by agmodifikasitgl desc limit 1
```

```sql
select aid from M7_Asset where akode = '{dataRowMaster_1}' order by aid desc limit 1
```

```sql
select `a`.`aid` AS `aid`,`a`.`akode` AS `akode`,`a`.`anama` AS `anama`,`a`.`akategori` AS `akategori`,`a`.`acabang` AS `acabang`,`a`.`alokasi` AS `alokasi`,`a`.`adivisi` AS `adivisi`,`a`.`asubdivisi` AS `asubdivisi`,`a`.`acatatan` AS `acatatan`,`a`.`anomor` AS `anomor`,`a`.`atglbeli` AS `atglbeli`,`a`.`atglpakai` AS `atglpakai`,`a`.`amatauang` AS `amatauang`,`a`.`akurs` AS `akurs`,`a`.`ahargabeli` AS `ahargabeli`,`a`.`anilairesidu` AS `anilairesidu`,`a`.`aumurekonomis` AS `aumurekonomis`,`a`.`abebanperbln` AS `abebanperbln`,`a`.`aakumulasibeban` AS `aakumulasibeban`,`a`.`anilaibuku` AS `anilaibuku`,`a`.`ametode` AS `ametode`,`a`.`atabelpenyusutan` AS `atabelpenyusutan`,`a`.`aintangible` AS `aintangible`,`a`.`afiskal` AS `afiskal`,`a`.`aatastengahbulan` AS `aatastengahbulan`,`a`.`arekasset` AS `arekasset`,`a`.`arekakumdepresiasi` AS `arekakumdepresiasi`,`a`.`arekdepresiasi` AS `arekdepresiasi`,`a`.`arekpenghapusan` AS `arekpenghapusan`,`a`.`aprodusen` AS `aprodusen`,`a`.`atglpensiun` AS `atglpensiun`,`a`.`apenyusutanke` AS `apenyusutanke`,`a`.`anilaimenurun` AS `anilaimenurun`,`a`.`adispose` AS `adispose`,`a`.`apembelian` AS `apembelian`,`a`.`apenjualan` AS `apenjualan`,`a`.`alocked` AS `alocked`,`a`.`astatus` AS `astatus`,`a`.`astatussebelumnya` AS `astatussebelumnya`,`a`.`aisclose` AS `aisclose`,`a`.`ainputuser` AS `ainputuser`,`a`.`ainputtgl` AS `ainputtgl`,`a`.`amodifikasiuser` AS `amodifikasiuser`,`a`.`amodifikasitgl` AS `amodifikasitgl`,`ac`.`acnama` AS `akategorinama`,`br`.`bnama` AS `acabangnama`,`l`.`lnama` AS `alokasinama`,`d`.`dnama` AS `adivisinama`,`sd`.`sdnama` AS `asubdivisinama`,`dc`.`nama` AS `ametodenama`,`coa1`.`cnama` AS `arekassetnama`,`coa2`.`cnama` AS `arekakumdepresiasinama`,`coa3`.`cnama` AS `arekdepresiasinama`,`coa4`.`cnama` AS `arekpenghapusannama`,`c1`.`kkode` AS `aprodusenkode`,`c1`.`knama` AS `aprodusennama`,`sp1`.`nama` AS `astatusnama`,`sp2`.`nama` AS `astatussebelumnyanama`,`u1`.`unama` AS `ainputusernama`,`u2`.`unama` AS `amodifikasiusernama`,`a`.`acustomtext1` AS `acustomtext1`,`a`.`acustomtext2` AS `acustomtext2`,`a`.`acustomtext3` AS `acustomtext3`,`a`.`acustomtext4` AS `acustomtext4`,`a`.`acustomtext5` AS `acustomtext5`,`a`.`acustomint1` AS `acustomint1`,`a`.`acustomint2` AS `acustomint2`,`a`.`acustomint3` AS `acustomint3`,`a`.`acustomdbl1` AS `acustomdbl1`,`a`.`acustomdbl2` AS `acustomdbl2`,`a`.`acustomdbl3` AS `acustomdbl3`,`a`.`acustomdate1` AS `acustomdate1`,`a`.`acustomdate2` AS `acustomdate2`,`a`.`acustomdate3` AS `acustomdate3`,`a`.`asatuan` AS `asatuan`, `a`.`aharga` AS `aharga`, `a`.`adiskon` AS `adiskon`,`a`.`ajmldiskon` AS `ajmldiskon`,`a`.`apajak1` AS `apajak1`,`a`.`ajmlpajak1` AS `ajmlpajak1`,`a`.`apajak2` AS `apajak2`,`a`.`ajmlpajak2` AS `ajmlpajak2` from ((((((((((((((((`m7_asset` `a` left join `m7_asset_category` `ac` on((`a`.`akategori` = `ac`.`ackode`))) left join `m1_branch` `br` on((`a`.`acabang` = `br`.`bkode`))) left join `m1_location` `l` on((`a`.`alokasi` = `l`.`lkode`))) left join `m1_division` `d` on((`a`.`adivisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`a`.`asubdivisi` = `sd`.`sdkode`))) left join `m7_depreciation_category` `dc` on((`a`.`ametode` = `dc`.`kode`))) left join `m1_coa` `coa1` on((`a`.`arekasset` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`a`.`arekakumdepresiasi` = `coa2`.`cnomor`))) left join `m1_coa` `coa3` on((`a`.`arekdepresiasi` = `coa3`.`cnomor`))) left join `m1_coa` `coa4` on((`a`.`arekpenghapusan` = `coa4`.`cnomor`))) left join `m1_contact` `c1` on((`a`.`aprodusen` = `c1`.`kid`))) left join `m0_status_progress` `sp1` on((`a`.`astatus` = `sp1`.`kode`))) left join `m0_status_progress` `sp2` on((`a`.`astatussebelumnya` = `sp2`.`kode`))) left join `m0_user` `u1` on((`a`.`ainputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`a`.`amodifikasiuser` = `u2`.`userid`))) left join `m7_ae_detail` `ae` on((`a`.`aid` = `ae`.`idasset`)))
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Agtgl, Agnotransaksi, Agstatus FROM M7_Ag WHERE Agid='{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_ao.vb`

```sql
SELECT EXISTS(SELECT 1 FROM m7_ar_detail JOIN m4_ar ON idar = arid WHERE idardetail = '{idardetail}' AND (arstatus = 2 OR arstatus = 3 OR arstatus = 4 OR arstatus = 7) LIMIT 1) as rowExists, '{idardetail}' as idardetail
```

```sql
SELECT EXISTS(SELECT 1 FROM m7_aq_detail JOIN m7_aq ON idaq = aqid WHERE idaqdetail = '{idaqdetail}' AND (aqstatus = 2 OR aqstatus = 3 OR aqstatus = 4 OR aqstatus = 7) LIMIT 1) as rowExists, '{idaqdetail}' as idaqdetail
```

```sql
SELECT COUNT(aoid) FROM M7_Ao WHERE aoid=
```

```sql
SELECT COUNT(aoid) FROM m7_ao WHERE aonotransaksi='{notransaksi}'
```

```sql
select aoid from M7_ao where aonotransaksi='{notransaksi}' AND aoinputuser= '{userid}' order by aomodifikasitgl desc limit 1
```

```sql
SELECT idar FROM M7_ar_detail WHERE {updFilterAR} GROUP BY idar
```

```sql
SELECT idar, SUM(jml) as jml, SUM(jmlrealisasi) as jmlrealisasi FROM M7_ar_detail WHERE {ftDetail} GROUP BY idar
```

```sql
SELECT idaq FROM m7_aq_detail WHERE {updFilterAQ} GROUP BY idaq
```

```sql
SELECT idaq, SUM(jml) as jml, SUM(jmlrealisasi) as jmlrealisasi FROM m7_aq_detail WHERE {ftDetail} GROUP BY idaq
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Aotgl, Aonotransaksi, Aostatus FROM M7_Ao WHERE Aoid='{idtransaksi}'
```

```sql
SELECT idasset, namaasset, satuan, jml, idardetail, idaqdetail, urutan FROM m7_ao_detail WHERE idao = '{idtransaksi}'
```

```sql
SELECT idaq, SUM(jml) as jml, SUM(jmlrealisasi) as jmlrealisasi FROM m7_sq_detail WHERE {ftDetail} GROUP BY idaq
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Aoid, Aonotransaksi FROM M7_Ao WHERE Aoid='{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_aq.vb`

```sql
SELECT EXISTS(SELECT 1 FROM M7_ar_detail JOIN M4_ar ON idar = arid WHERE idardetail = '{idardetail}' AND (arstatus = 2 OR arstatus = 3 OR arstatus = 4 OR arstatus = 7) LIMIT 1) as rowExists, '{idardetail}' as idardetail
```

```sql
SELECT COUNT(aqid), aqnotransaksi FROM M7_aq WHERE aqid='{result_4}' AND aqstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(aqid) FROM m7_aq WHERE aqnotransaksi='{notransaksi}'
```

```sql
select aqid from M7_aq where aqnotransaksi='{notransaksi}' AND aqinputuser= '{userid}' order by aqmodifikasitgl desc limit 1
```

```sql
SELECT idar FROM M7_ar_detail WHERE {updFilter} GROUP BY idar
```

```sql
SELECT idar, SUM(jml) as jml, SUM(jmlaq) as jmlaq FROM M7_ar_detail WHERE {ftDetail} GROUP BY idar
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Aqtgl, Aqnotransaksi, Aqstatus FROM M7_Aq WHERE Aqid='{idtransaksi}'
```

```sql
SELECT idasset, namaasset, satuan, jml, idardetail, urutan FROM M7_aq_detail WHERE idaq = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Aqid, Aqnotransaksi FROM M7_Aq WHERE Aqid='{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_ar.vb`

```sql
SELECT COUNT(arid), arnotransaksi FROM M7_ar WHERE arid='{result_4}' AND arstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(arid) FROM m7_ar WHERE arnotransaksi='{notransaksi}'
```

```sql
select arid from M7_ar where arnotransaksi='{notransaksi}' AND arinputuser= '{userid}' order by armodifikasitgl desc limit 1
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Artgl, Arnotransaksi, Arstatus FROM m7_Ar WHERE Arid='{idtransaksi}'
```

```sql
SELECT idasset, namaasset, satuan, jml, urutan FROM m7_ar_detail WHERE idar = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Arid, Arnotransaksi FROM m7_Ar WHERE Arid='{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_asset.vb`

```sql
SELECT COUNT(aid) FROM M7_Asset WHERE aid = '{dataUtama_0}'
```

```sql
select a.aid AS aid, a.akode AS akode, a.anama AS anama, a.akategori AS akategori, a.acabang AS acabang, a.alokasi AS alokasi, a.adivisi AS adivisi, a.asubdivisi AS asubdivisi, a.acatatan AS acatatan, a.anomor AS anomor, a.atglbeli AS atglbeli, a.atglpakai AS atglpakai, a.amatauang AS amatauang, a.akurs AS akurs, a.ahargabeli AS ahargabeli, a.anilairesidu AS anilairesidu, a.aumurekonomis AS aumurekonomis, a.abebanperbln AS abebanperbln, a.aakumulasibeban AS aakumulasibeban, a.anilaibuku AS anilaibuku, (CASE WHEN a.anilaibuku < a.abebanperbln THEN a.anilaibuku ELSE a.abebanperbln END) as anilaipenyusutan, a.ametode AS ametode, a.atabelpenyusutan AS atabelpenyusutan, a.aintangible AS aintangible, a.afiskal AS afiskal, a.aatastengahbulan AS aatastengahbulan, a.arekasset AS arekasset, a.arekakumdepresiasi AS arekakumdepresiasi, a.arekdepresiasi AS arekdepresiasi, a.arekpenghapusan AS arekpenghapusan, a.aprodusen AS aprodusen, a.atglpensiun AS atglpensiun, a.apenyusutanke AS apenyusutanke, a.anilaimenurun AS anilaimenurun, a.adispose AS adispose, a.apembelian AS apembelian, a.apenjualan AS apenjualan, a.alocked AS alocked, a.astatus AS astatus, a.astatussebelumnya AS astatussebelumnya, a.aisclose AS aisclose, a.ainputuser AS ainputuser, a.ainputtgl AS ainputtgl, a.amodifikasiuser AS amodifikasiuser, a.amodifikasitgl AS amodifikasitgl, a.aidbarang AS aidbarang, ac.acnama AS akategorinama, br.bnama AS acabangnama, l.lnama AS alokasinama, d.dnama AS adivisinama, sd.sdnama AS asubdivisinama, dc.nama AS ametodenama, coa1.cnama AS arekassetnama, coa2.cnama AS arekakumdepresiasinama, coa3.cnama AS arekdepresiasinama, coa4.cnama AS arekpenghapusannama, c1.kkode AS aprodusenkode, c1.knama AS aprodusennama, sp1.nama AS astatusnama, sp2.nama AS astatussebelumnyanama, u1.unama AS ainputusernama, u2.unama AS amodifikasiusernama, a.acostcenter AS acostcenter, a.aproyek AS aproyek, a.ajml AS ajml, a.asatuan AS asatuan, a.aharga AS aharga, a.adiskon AS adiskon, a.ajmldiskon AS ajmldiskon, a.apajak1 AS apajak1, a.ajmlpajak1 AS ajmlpajak1, a.apajak2 AS apajak2, a.ajmlpajak2 AS ajmlpajak2, cc.ccnama AS acostcenternama, p.pnama AS aproyeknama, t1.tnama AS apajak1nama, ifnull(t1.tnilai, 0) AS apajak1nilai, t2.tnama AS apajak2nama, ifnull(t2.tnilai, 0) AS apajak2nilai from m7_asset a left join m7_asset_category ac on a.akategori = ac.ackode left join m1_branch br on a.acabang = br.bkode left join m1_location l on a.alokasi = l.lkode left join m1_division d on a.adivisi = d.dkode left join m1_subdivision sd on a.asubdivisi = sd.sdkode left join m7_depreciation_category dc on a.ametode = dc.kode left join m1_coa coa1 on a.arekasset = coa1.cnomor left join m1_coa coa2 on a.arekakumdepresiasi = coa2.cnomor left join m1_coa coa3 on a.arekdepresiasi = coa3.cnomor left join m1_coa coa4 on a.arekpenghapusan = coa4.cnomor left join m1_contact c1 on a.aprodusen = c1.kid left join m0_status_progress sp1 on a.astatus = sp1.kode left join m0_status_progress sp2 on a.astatussebelumnya = sp2.kode left join m0_user u1 on a.ainputuser = u1.userid left join m0_user u2 on a.amodifikasiuser = u2.userid left join m1_cost_center cc on a.acostcenter = cc.cckode left join m1_project p on a.aproyek = p.pkode left join m1_tax t1 on a.apajak1 = t1.tkode left join m1_tax t2 on a.apajak2 = t2.tkode
```

```sql
SELECT COUNT(akode) FROM M7_Asset WHERE akode = '{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_asset_category.vb`

```sql
SELECT COUNT(ackode) FROM M7_Asset_Category WHERE ackode = '{dataUtama_0}'
```

```sql
SELECT COUNT(ackode) FROM m7_asset_category WHERE ackode = '{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_asset_category_history.vb`

```sql
select `ac`.`acidhistory` AS `acidhistory`,`ac`.`ackode` AS `ackode`,`ac`.`acnama` AS `acnama`,`ac`.`ackategoripajak` AS `ackategoripajak`,`ac`.`acrekakumdepresiasi` AS `acrekakumdepresiasi`,`ac`.`acrekdepresiasi` AS `acrekdepresiasi`,`ac`.`acrekasset` AS `acrekasset`,`ac`.`acinputuser` AS `acinputuser`,`ac`.`acinputtgl` AS `acinputtgl`,`ac`.`acmodifikasiuser` AS `acmodifikasiuser`,`ac`.`acmodifikasitgl` AS `acmodifikasitgl`,`ac`.`accustomtext1` AS `accustomtext1`,`ac`.`accustomtext2` AS `accustomtext2`,`ac`.`accustomtext3` AS `accustomtext3`,`ac`.`accustomtext4` AS `accustomtext4`,`ac`.`accustomtext5` AS `accustomtext5`,`ac`.`accustomint1` AS `accustomint1`,`ac`.`accustomint2` AS `accustomint2`,`ac`.`accustomint3` AS `accustomint3`,`ac`.`accustomdbl1` AS `accustomdbl1`,`ac`.`accustomdbl2` AS `accustomdbl2`,`ac`.`accustomdbl3` AS `accustomdbl3`,`ac`.`accustomdate1` AS `accustomdate1`,`ac`.`accustomdate2` AS `accustomdate2`,`ac`.`accustomdate3` AS `accustomdate3`,`act`.`actnama` AS `ackategoripajaknama`,`act`.`actmetode` AS `ackategoripajakmetode`,`dc`.`nama` AS `ackategoripajakmetodenama`,`act`.`actumur` AS `ackategoripajakumur`,`act`.`actpenyusutan` AS `ackategoripajakpenyusutan`,`c1`.`cnama` AS `acrekakumdepresiasinama`,`c2`.`cnama` AS `acrekdepresiasinama`,`c3`.`cnama` AS `acrekassetnama`,`u1`.`unama` AS `acinputusernama`,`u2`.`unama` AS `acmodifikasiusernama` from (((((((`m7_asset_category_history` `ac` left join `m7_asset_category_tax` `act` on((`act`.`actkode` = `ac`.`ackategoripajak`))) left join `m7_depreciation_category` `dc` on((`act`.`actmetode` = `dc`.`kode`))) left join `m1_coa` `c1` on((`c1`.`cnomor` = `ac`.`acrekakumdepresiasi`))) left join `m1_coa` `c2` on((`c2`.`cnomor` = `ac`.`acrekdepresiasi`))) left join `m1_coa` `c3` on((`c3`.`cnomor` = `ac`.`acrekasset`))) left join `m0_user` `u1` on((`u1`.`userid` = `ac`.`acinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `ac`.`acmodifikasiuser`)))
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_asset_category_tax.vb`

```sql
SELECT COUNT(actkode) FROM M7_Asset_Category_Tax WHERE actkode = '{dataUtama_0}'
```

```sql
SELECT COUNT(actkode) FROM m7_asset_category_tax WHERE actkode ='{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_asset_category_tax_history.vb`

```sql
SELECT `act`.`actidhistory` AS `actidhistory`,`act`.`actkode` AS `actkode`,`act`.`actnama` AS `actnama`,`act`.`actmetode` AS `actmetode`,`act`.`actumur` AS `actumur`,`act`.`actpenyusutan` AS `actpenyusutan`,`act`.`actinputuser` AS `actinputuser`,`act`.`actinputtgl` AS `actinputtgl`,`act`.`actmodifikasiuser` AS `actmodifikasiuser`,`act`.`actmodifikasitgl` AS `actmodifikasitgl`,`act`.`actcustomtext1` AS `actcustomtext1`,`act`.`actcustomtext2` AS `actcustomtext2`,`act`.`actcustomtext3` AS `actcustomtext3`,`act`.`actcustomtext4` AS `actcustomtext4`,`act`.`actcustomtext5` AS `actcustomtext5`,`act`.`actcustomint1` AS `actcustomint1`,`act`.`actcustomint2` AS `actcustomint2`,`act`.`actcustomint3` AS `actcustomint3`,`act`.`actcustomdbl1` AS `actcustomdbl1`,`act`.`actcustomdbl2` AS `actcustomdbl2`,`act`.`actcustomdbl3` AS `actcustomdbl3`,`act`.`actcustomdate1` AS `actcustomdate1`,`act`.`actcustomdate2` AS `actcustomdate2`,`act`.`actcustomdate3` AS `actcustomdate3`,`dc`.`nama` AS `actmetodenama`,`u1`.`unama` AS `actinputusernama`,`u2`.`unama` AS `actmodifikasiusernama` from (((`m7_asset_category_tax_history` `act` left join `m7_depreciation_category` `dc` on((`act`.`actmetode` = `dc`.`kode`))) left join `m0_user` `u1` on((`act`.`actinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`act`.`actmodifikasiuser` = `u2`.`userid`)))
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_asset_history.vb`

```sql
select `a`.`aidhistory` AS `aidhistory`,`a`.`aid` AS `aid`,`a`.`akode` AS `akode`,`a`.`anama` AS `anama`,`a`.`akategori` AS `akategori`,`a`.`acabang` AS `acabang`,`a`.`alokasi` AS `alokasi`,`a`.`adivisi` AS `adivisi`,`a`.`asubdivisi` AS `asubdivisi`,`a`.`acatatan` AS `acatatan`,`a`.`anomor` AS `anomor`,`a`.`atglbeli` AS `atglbeli`,`a`.`atglpakai` AS `atglpakai`,`a`.`amatauang` AS `amatauang`,`a`.`akurs` AS `akurs`,`a`.`ahargabeli` AS `ahargabeli`,`a`.`anilairesidu` AS `anilairesidu`,`a`.`aumurekonomis` AS `aumurekonomis`,`a`.`abebanperbln` AS `abebanperbln`,`a`.`aakumulasibeban` AS `aakumulasibeban`,`a`.`anilaibuku` AS `anilaibuku`,`a`.`ametode` AS `ametode`,`a`.`atabelpenyusutan` AS `atabelpenyusutan`,`a`.`aintangible` AS `aintangible`,`a`.`afiskal` AS `afiskal`,`a`.`aatastengahbulan` AS `aatastengahbulan`,`a`.`arekasset` AS `arekasset`,`a`.`arekakumdepresiasi` AS `arekakumdepresiasi`,`a`.`arekdepresiasi` AS `arekdepresiasi`,`a`.`arekpenghapusan` AS `arekpenghapusan`,`a`.`aprodusen` AS `aprodusen`,`a`.`atglpensiun` AS `atglpensiun`,`a`.`apenyusutanke` AS `apenyusutanke`,`a`.`anilaimenurun` AS `anilaimenurun`,`a`.`adispose` AS `adispose`,`a`.`apembelian` AS `apembelian`,`a`.`apenjualan` AS `apenjualan`,`a`.`alocked` AS `alocked`,`a`.`astatus` AS `astatus`,`a`.`astatussebelumnya` AS `astatussebelumnya`,`a`.`aisclose` AS `aisclose`,`a`.`ainputuser` AS `ainputuser`,`a`.`ainputtgl` AS `ainputtgl`,`a`.`amodifikasiuser` AS `amodifikasiuser`,`a`.`amodifikasitgl` AS `amodifikasitgl`,`ac`.`acnama` AS `akategorinama`,`br`.`bnama` AS `acabangnama`,`l`.`lnama` AS `alokasinama`,`d`.`dnama` AS `adivisinama`,`sd`.`sdnama` AS `asubdivisinama`,`dc`.`nama` AS `ametodenama`,`coa1`.`cnama` AS `arekassetnama`,`coa2`.`cnama` AS `arekakumdepresiasinama`,`coa3`.`cnama` AS `arekdepresiasinama`,`coa4`.`cnama` AS `arekpenghapusannama`,`c1`.`kkode` AS `aprodusenkode`,`c1`.`knama` AS `aprodusennama`,`sp1`.`nama` AS `astatusnama`,`sp2`.`nama` AS `astatussebelumnyanama`,`u1`.`unama` AS `ainputusernama`,`u2`.`unama` AS `amodifikasiusernama` from (((((((((((((((`m7_asset_history` `a` left join `m7_asset_category` `ac` on((`a`.`akategori` = `ac`.`ackode`))) left join `m1_branch` `br` on((`a`.`acabang` = `br`.`bkode`))) left join `m1_location` `l` on((`a`.`alokasi` = `l`.`lkode`))) left join `m1_division` `d` on((`a`.`adivisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`a`.`asubdivisi` = `sd`.`sdkode`))) left join `m7_depreciation_category` `dc` on((`a`.`ametode` = `dc`.`kode`))) left join `m1_coa` `coa1` on((`a`.`arekasset` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`a`.`arekakumdepresiasi` = `coa2`.`cnomor`))) left join `m1_coa` `coa3` on((`a`.`arekdepresiasi` = `coa3`.`cnomor`))) left join `m1_coa` `coa4` on((`a`.`arekpenghapusan` = `coa4`.`cnomor`))) left join `m1_contact` `c1` on((`a`.`aprodusen` = `c1`.`kid`))) left join `m0_status_progress` `sp1` on((`a`.`astatus` = `sp1`.`kode`))) left join `m0_status_progress` `sp2` on((`a`.`astatussebelumnya` = `sp2`.`kode`))) left join `m0_user` `u1` on((`a`.`ainputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`a`.`amodifikasiuser` = `u2`.`userid`)))
```

```sql
select `a`.`aidhistory` AS `aidhistory`,`a`.`aid` AS `aid`,`a`.`akode` AS `akode`,`a`.`anama` AS `anama`,`a`.`akategori` AS `akategori`,`a`.`acabang` AS `acabang`,`a`.`alokasi` AS `alokasi`,`a`.`adivisi` AS `adivisi`,`a`.`asubdivisi` AS `asubdivisi`,`a`.`acatatan` AS `acatatan`,`a`.`anomor` AS `anomor`,`a`.`atglbeli` AS `atglbeli`,`a`.`atglpakai` AS `atglpakai`,`a`.`amatauang` AS `amatauang`,`a`.`akurs` AS `akurs`,`a`.`ahargabeli` AS `ahargabeli`,`a`.`anilairesidu` AS `anilairesidu`,`a`.`aumurekonomis` AS `aumurekonomis`,`a`.`abebanperbln` AS `abebanperbln`,`a`.`aakumulasibeban` AS `aakumulasibeban`,`a`.`anilaibuku` AS `anilaibuku`,`a`.`ametode` AS `ametode`,`a`.`atabelpenyusutan` AS `atabelpenyusutan`,`a`.`aintangible` AS `aintangible`,`a`.`afiskal` AS `afiskal`,`a`.`aatastengahbulan` AS `aatastengahbulan`,`a`.`arekasset` AS `arekasset`,`a`.`arekakumdepresiasi` AS `arekakumdepresiasi`,`a`.`arekdepresiasi` AS `arekdepresiasi`,`a`.`arekpenghapusan` AS `arekpenghapusan`,`a`.`aprodusen` AS `aprodusen`,`a`.`atglpensiun` AS `atglpensiun`,`a`.`apenyusutanke` AS `apenyusutanke`,`a`.`anilaimenurun` AS `anilaimenurun`,`a`.`adispose` AS `adispose`,`a`.`apembelian` AS `apembelian`,`a`.`apenjualan` AS `apenjualan`,`a`.`alocked` AS `alocked`,`a`.`astatus` AS `astatus`,`a`.`astatussebelumnya` AS `astatussebelumnya`,`a`.`aisclose` AS `aisclose`,`a`.`ainputuser` AS `ainputuser`,`a`.`ainputtgl` AS `ainputtgl`,`a`.`amodifikasiuser` AS `amodifikasiuser`,`a`.`amodifikasitgl` AS `amodifikasitgl`,`ac`.`acnama` AS `akategorinama`,`br`.`bnama` AS `acabangnama`,`l`.`lnama` AS `alokasinama`,`d`.`dnama` AS `adivisinama`,`sd`.`sdnama` AS `asubdivisinama`,`dc`.`nama` AS `ametodenama`,`coa1`.`cnama` AS `arekassetnama`,`coa2`.`cnama` AS `arekakumdepresiasinama`,`coa3`.`cnama` AS `arekdepresiasinama`,`coa4`.`cnama` AS `arekpenghapusannama`,`c1`.`kkode` AS `aprodusenkode`,`c1`.`knama` AS `aprodusennama`,`sp1`.`nama` AS `astatusnama`,`sp2`.`nama` AS `astatussebelumnyanama`,`u1`.`unama` AS `ainputusernama`,`u2`.`unama` AS `amodifikasiusernama`,`a`.`acostcenter` AS `acostcenter`,`a`.`aproyek` AS `aproyek`,`a`.`ajml` AS `ajml`,`a`.`asatuan` AS `asatuan`,`a`.`aharga` AS `aharga`,`a`.`adiskon` AS `adiskon`,`a`.`ajmldiskon` AS `ajmldiskon`,`a`.`apajak1` AS `apajak1`,`a`.`ajmlpajak1` AS `ajmlpajak1`,`a`.`apajak2` AS `apajak2`,`a`.`ajmlpajak2` AS `ajmlpajak2`,`cc`.`ccnama` AS `acostcenternama`,`p`.`pnama` AS `aproyeknama`,`t1`.`tnama` AS `apajak1nama`,ifnull(`t1`.`tnilai`,0) AS `apajak1nilai`,`t2`.`tnama` AS `apajak2nama`,ifnull(`t2`.`tnilai`,0) AS `apajak2nilai` from (((((((((((((((((((`m7_asset_history` `a` left join `m7_asset_category` `ac` on((`a`.`akategori` = `ac`.`ackode`))) left join `m1_branch` `br` on((`a`.`acabang` = `br`.`bkode`))) left join `m1_location` `l` on((`a`.`alokasi` = `l`.`lkode`))) left join `m1_division` `d` on((`a`.`adivisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`a`.`asubdivisi` = `sd`.`sdkode`))) left join `m7_depreciation_category` `dc` on((`a`.`ametode` = `dc`.`kode`))) left join `m1_coa` `coa1` on((`a`.`arekasset` = `coa1`.`cnomor`))) left join `m1_coa` `coa2` on((`a`.`arekakumdepresiasi` = `coa2`.`cnomor`))) left join `m1_coa` `coa3` on((`a`.`arekdepresiasi` = `coa3`.`cnomor`))) left join `m1_coa` `coa4` on((`a`.`arekpenghapusan` = `coa4`.`cnomor`))) left join `m1_contact` `c1` on((`a`.`aprodusen` = `c1`.`kid`))) left join `m0_status_progress` `sp1` on((`a`.`astatus` = `sp1`.`kode`))) left join `m0_status_progress` `sp2` on((`a`.`astatussebelumnya` = `sp2`.`kode`))) left join `m0_user` `u1` on((`a`.`ainputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`a`.`amodifikasiuser` = `u2`.`userid`))) left join `m1_cost_center` `cc` on((`a`.`acostcenter` = `cc`.`cckode`))) left join `m1_project` `p` on((`a`.`aproyek` = `p`.`pkode`))) left join `m1_tax` `t1` on((`a`.`apajak1` = `t1`.`tkode`))) left join `m1_tax` `t2` on((`a`.`apajak2` = `t2`.`tkode`)))
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_at.vb`

```sql
SELECT EXISTS(SELECT 1 FROM m7_ae WHERE aeid = '{idtransaksiDetail}' AND (aestatus = 2 OR aestatus = 3 OR aestatus = 4 OR aestatus = 7) LIMIT 1) as rowExists, aeid, aesumber, aenotransaksi FROM m7_ae WHERE aeid = '{idtransaksiDetail}'
```

```sql
SELECT COUNT(atid) FROM M7_At WHERE atid={result_4}' AND atstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(atid) FROM m7_at WHERE atnotransaksi='{notransaksi}'
```

```sql
select atid from M7_at where atnotransaksi='{notransaksi}' AND atinputuser= '{userid}' order by atmodifikasitgl desc limit 1
```

```sql
select `ae`.`aeid` AS `idtransaksi`,`ae`.`aesumber` AS `sumber`,`ae`.`aenotransaksi` AS `notransaksi`,`ae`.`aetgl` AS `tgl`,`ae`.`aesupplier` AS `kontak`,`ae`.`aecatatan` AS `catatan`,`ae`.`aecarabayar` AS `carabayar`,`ae`.`aetermin` AS `termin`,`ae`.`aetgljatuhtempo` AS `tgljatuhtempo`,`ae`.`aematauang` AS `matauang`,`ae`.`aekurs` AS `kurs`,`ae`.`aetotaltransaksi` AS `totaltransaksi`,`ae`.`aejmlbayar` AS `terbayar`,((`ae`.`aetotaltransaksi` - `ae`.`aejmlbayar`) * `ae`.`aekurs`) AS `sisa`,(case `ae`.`aematauang` when `s2`.`snilai` then 0 else (`ae`.`aetotaltransaksi` - `ae`.`aejmlbayar`) end) AS `sisavalas`,`ae`.`aestatuslunas` AS `statuslunas`,`s`.`snilai` AS `rekhutangpiutang`,`tr`.`trdiskon1` AS `diskon1`,`tr`.`trharidiskon1` AS `haridiskon1`,`tr`.`trdiskon2` AS `diskon2`,`tr`.`trharidiskon2` AS `haridiskon2`,`ae`.`aeinputtgl` AS `inputtgl` from ((((`m7_ae` `ae` left join `m1_terms` `tr` on((`ae`.`aetermin` = `tr`.`trkode`))) join `m0_setting` `s` on(((`s`.`smodule` = 0) and (`s`.`sgrup` = 'akun') and (`s`.`skode` = 'HutangUsaha')))) join `m0_setting` `s2` on(((`s2`.`smodule` = 0) and (`s2`.`sgrup` = 'accounting') and (`s2`.`skode` = 'MataUangFungsional')))) left join `m7_at_detail` `atd` on(((`atd`.`sumber` = 'AE') and (`atd`.`idtransaksi` = `ae`.`aeid`) and (`atd`.`sisa` <> 0)))) {filter} group by `ae`.`aeid`
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Attgl, Atnotransaksi, Atstatus FROM M7_At WHERE Atid='{idtransaksi}'
```

```sql
SELECT sumber, idtransaksi, matauang, jmlbayar, jmlbayarvalas, rekhutangpiutang, urutan FROM M7_at_detail WHERE idat = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Atid, Atnotransaksi FROM M7_At WHERE Atid='{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_da.vb`

```sql
SELECT COUNT(daid), danotransaksi FROM M7_Da WHERE daid='{result_4}' AND dastatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(daid) FROM M7_Da WHERE danotransaksi='{notransaksi}'
```

```sql
select daid from M7_Da where danotransaksi='{notransaksi}' AND dainputuser= '{userid}' order by damodifikasitgl desc limit 1
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Datgl, Danotransaksi, Dastatus FROM M7_Da WHERE Daid='{idtransaksi}'
```

```sql
SELECT iddadetail FROM m7_da_detail WHERE idda = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Daid, Danotransaksi FROM M7_Da WHERE Daid='{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_notes.vb`

```sql
SELECT COUNT(nid) FROM M7_Notes WHERE nid='{result_4}'
```

## INSERT

Total: `28`

### `client-backend/api-myerpplus/app_code/ws/m7/m7_ab.vb`

```sql
Insert into M7_Ab (abcabang, ablokasi, abgudang, abasalbarang, abasalbarangkategori, abjenispembelian, abjenispembeliankategori, abcarabayar, absumber, abnogrup, abautonotransaksi, abnotransaksi, abtgl, abkodepa, abbagianperbandingan, abbagianperbandingankontak, aburaian, abcatatan, abnoref, abtglnoref, abtglpenutupan, abmatauang, abidaq1, abidaq2, abidaq3, abidaq4, abidaq5, abidaq1statusao, abidaq2statusao, abidaq3statusao, abidaq4statusao, abidaq5statusao, abstatus, abstatussebelumnya, abjmlrevisi, abcetakanke, abinputuser, abinputtgl, abmodifikasiuser, abmodifikasitgl, abisclose, abcustomtext1, abcustomtext2, abcustomtext3, abcustomtext4, abcustomtext5, abcustomint1, abcustomint2, abcustomint3, abcustomdbl1, abcustomdbl2, abcustomdbl3, abcustomdate1, abcustomdate2, abcustomdate3) values('{FixQuotes_dr1}abcabang', '{FixQuotes_dr1}ablokasi', '{FixQuotes_dr1}abgudang', '{FixQuotes_dr1}abasalbarang', {dr1}abasalbarangkategori, '{FixQuotes_dr1}abjenispembelian', {dr1}abjenispembeliankategori, {dr1}abcarabayar, '{FixQuotes_dr1}absumber', '{FixQuotes_dr1}abnogrup', {dr1}abautonotransaksi, '{FixQuotes_dr1}abnotransaksi', '{FixQuotes_AsFormatTanggal_dr1}abtgl', '{FixQuotes_dr1}abkodepa', '{FixQuotes_dr1}abbagianperbandingan', '{FixQuotes_dr1}abbagianperbandingankontak', '{FixQuotes_dr1}aburaian', '{FixQuotes_dr1}abcatatan', '{FixQuotes_dr1}abnoref', '{FixQuotes_AsFormatTanggal_dr1}abtglnoref', '{FixQuotes_AsFormatTanggal_dr1}abtglpenutupan', '{FixQuotes_dr1}abmatauang', '{FixQuotes_dr1}abidaq1', '{FixQuotes_dr1}abidaq2', '{FixQuotes_dr1}abidaq3', '{FixQuotes_dr1}abidaq4', '{FixQuotes_dr1}abidaq5', {dr1}abidaq1statusao, {dr1}abidaq2statusao, {dr1}abidaq3statusao, {dr1}abidaq4statusao, {dr1}abidaq5statusao, {dr1}abstatus, {dr1}abstatussebelumnya, {dr1}abjmlrevisi, {dr1}abcetakanke, '{FixQuotes_dr1}abinputuser', '{FixQuotes_AsFormatTanggal_dr1}abinputtglyyyy-MM-dd HH:mm:ss', '{FixQuotes_dr1}abmodifikasiuser', '{FixQuotes_AsFormatTanggal_dr1}abmodifikasitglyyyy-MM-dd HH:mm:ss', {dr1}abisclose, '{FixQuotes_dr1}abcustomtext1', '{FixQuotes_dr1}abcustomtext2', '{FixQuotes_dr1}abcustomtext3', '{FixQuotes_dr1}abcustomtext4', '{FixQuotes_dr1}abcustomtext5', {dr1}abcustomint1, {dr1}abcustomint2, {dr1}abcustomint3, '{FixDouble_dr1}abcustomdbl1', '{FixDouble_dr1}abcustomdbl2', '{FixDouble_dr1}abcustomdbl3', '{FixQuotes_AsFormatTanggal_dr1}abcustomdate1', '{FixQuotes_AsFormatTanggal_dr1}abcustomdate2', '{FixQuotes_AsFormatTanggal_dr1}abcustomdate3')
```

```sql
Insert into M7_Ab_Detail(idabdetail, idab, idaqdetail, terpilih, hargake, catatan, urutan) values{strValue2_ToString}
```

```sql
Insert into M7_Ab_Detail(idab, idaqdetail, terpilih, hargake, catatan, urutan) values{strValue2_ToString}
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_ae.vb`

```sql
Insert into M7_Ae (aecabang, aelokasi, aesumber, aeautonotransaksi, aenotransaksi, aetgl, aekodepa, aesupplier, aesupplierkontak, ae1alamat1, ae1alamat2, ae1alamat3, ae2alamat1, ae2alamat2, ae2alamat3, aebagianpembelian, aetermin, aetgljatuhtempo, aeuraian, aecatatan, aenoref, aetglnoref, aetglpenutupan, aematauang, aekurs, aehargatermasukpajak, aetotal, aediskonpersen, aejmldiskon, aetotalpajak1detail, aetotalpajak2detail, aebiayalainpersen, aebiayalain, aetotaltransaksi, aejmlbayar, aerekdiskon, aerekpajak1, aerekpajak2, aerekbiayalain, aerekbayar, aeidar, aeidaq, aeidab, aeidao, aestatus, aestatussebelumnya, aejmlrevisi, aecetakanke, aeinputuser, aeinputtgl, aemodifikasiuser, aemodifikasitgl, aeposting, aepostingtgl, aetutupperiode, aeisclose, aecustomtext1, aecustomtext2, aecustomtext3, aecustomtext4, aecustomtext5, aecustomint1, aecustomint2, aecustomint3, aecustomdbl1, aecustomdbl2, aecustomdbl3, aecustomdate1, aecustomdate2, aecustomdate3, aecarabayar, aestatuslunas, aetgllunas, aenofakturpajak, aesdhbayarpajak, aetglbayarpajak) values('{FixQuotes_drutama}aecabang', '{FixQuotes_drutama}aelokasi', '{FixQuotes_drutama}aesumber', {drutama}aeautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}aetgl', '{FixQuotes_drutama}aekodepa', '{FixQuotes_drutama}aesupplier', '{FixQuotes_drutama}aesupplierkontak', '{FixQuotes_drutama}ae1alamat1', '{FixQuotes_drutama}ae1alamat2', '{FixQuotes_drutama}ae1alamat3', '{FixQuotes_drutama}ae2alamat1', '{FixQuotes_drutama}ae2alamat2', '{FixQuotes_drutama}ae2alamat3', '{FixQuotes_drutama}aebagianpembelian', '{FixQuotes_drutama}aetermin', '{FixQuotes_AsFormatTanggal_drutama}aetgljatuhtempo', '{FixQuotes_drutama}aeuraian', '{FixQuotes_drutama}aecatatan', '{FixQuotes_drutama}aenoref', '{FixQuotes_AsFormatTanggal_drutama}aetglnoref', '{FixQuotes_AsFormatTanggal_drutama}aetglpenutupan', '{FixQuotes_drutama}aematauang', '{FixDouble_drutama}aekurs', {drutama}aehargatermasukpajak, '{FixDouble_drutama}aetotal', '{FixQuotes_drutama}aediskonpersen', '{FixDouble_drutama}aejmldiskon', '{FixDouble_drutama}aetotalpajak1detail', '{FixDouble_drutama}aetotalpajak2detail', '{FixQuotes_drutama}aebiayalainpersen', '{FixDouble_drutama}aebiayalain', '{FixDouble_drutama}aetotaltransaksi', '{FixDouble_drutama}aejmlbayar', '{FixQuotes_drutama}aerekdiskon', '{FixQuotes_drutama}aerekpajak1', '{FixQuotes_drutama}aerekpajak2', '{FixQuotes_drutama}aerekbiayalain', '{FixQuotes_drutama}aerekbayar', '{FixQuotes_drutama}aeidar', '{FixQuotes_drutama}aeidaq', '{FixQuotes_drutama}aeidab', '{FixQuotes_drutama}aeidao', {drutama}aestatus, {drutama}aestatussebelumnya, {drutama}aejmlrevisi, {drutama}aecetakanke, '{FixQuotes_drutama}aeinputuser', NOW(), '{FixQuotes_drutama}aemodifikasiuser', '1971-01-01', {drutama}aeposting, '{FixQuotes_AsFormatTanggal_drutama}aepostingtglyyyy-MM-dd H:mm:ss', {drutama}aetutupperiode, {drutama}aeisclose, '{FixQuotes_drutama}aecustomtext1', '{FixQuotes_drutama}aecustomtext2', '{FixQuotes_drutama}aecustomtext3', '{FixQuotes_drutama}aecustomtext4', '{FixQuotes_drutama}aecustomtext5', {drutama}aecustomint1, {drutama}aecustomint2, {drutama}aecustomint3, '{FixDouble_drutama}aecustomdbl1', '{FixDouble_drutama}aecustomdbl2', '{FixDouble_drutama}aecustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}aecustomdate1', '{FixQuotes_AsFormatTanggal_drutama}aecustomdate2', '{FixQuotes_AsFormatTanggal_drutama}aecustomdate3', '{FixQuotes_drutama}aecarabayar', '{FixQuotes_drutama}aestatuslunas', '{FixQuotes_AsFormatTanggal_drutama}aetgllunas', '{FixQuotes_drutama}aenofakturpajak', '{FixQuotes_drutama}aesdhbayarpajak', '{FixQuotes_AsFormatTanggal_drutama}aetglbayarpajak')
```

```sql
Insert into M7_Asset (akode, anama, akategori, acabang, alokasi, adivisi, asubdivisi, acatatan, anomor, atglbeli, atglpakai, amatauang, akurs, ahargabeli, anilairesidu, aumurekonomis, abebanperbln, aakumulasibeban, anilaibuku, ametode, atabelpenyusutan, aintangible, afiskal, aatastengahbulan, arekasset, arekakumdepresiasi, arekdepresiasi, arekpenghapusan, aprodusen, atglpensiun, apenyusutanke, anilaimenurun, adispose, apembelian, apenjualan, alocked, astatus, astatussebelumnya, aisclose, ainputuser, ainputtgl, amodifikasiuser, amodifikasitgl, acustomtext1, acustomtext2, acustomtext3, acustomtext4, acustomtext5, acustomint1, acustomint2, acustomint3, acustomdbl1, acustomdbl2, acustomdbl3, acustomdate1, acustomdate2, acustomdate3, asatuan, aharga, adiskon, ajmldiskon, apajak1, ajmlpajak1, apajak2, ajmlpajak2) values('{FixQuotes_dataRowMaster_1}', '{FixQuotes_dataRowMaster_2}', '{FixQuotes_dataRowMaster_3}', '{FixQuotes_dataRowMaster_4}', '{FixQuotes_dataRowMaster_5}', '{FixQuotes_dataRowMaster_6}', '{FixQuotes_dataRowMaster_7}', '{FixQuotes_dataRowMaster_8}', '{FixQuotes_dataRowMaster_9}', '{FixQuotes_AsFormatTanggal_dataRowMaster_10}', '{FixQuotes_AsFormatTanggal_dataRowMaster_11}', '{FixQuotes_dataRowMaster_12}', '{FixDouble_dataRowMaster_13}', '{FixDouble_dataRowMaster_14}', '{FixDouble_dataRowMaster_15}', '{FixDouble_dataRowMaster_16}', '{FixDouble_dataRowMaster_17}', '{FixDouble_dataRowMaster_18}', '{FixDouble_dataRowMaster_19}', {dataRowMaster_20}, '{FixQuotes_dataRowMaster_21}', {dataRowMaster_22}, {dataRowMaster_23}, {dataRowMaster_24}, '{FixQuotes_dataRowMaster_25}', '{FixQuotes_dataRowMaster_26}', '{FixQuotes_dataRowMaster_27}', '{FixQuotes_dataRowMaster_28}', {dataRowMaster_29}, '{FixQuotes_AsFormatTanggal_dataRowMaster_30}', '{FixDouble_dataRowMaster_31}', '{FixDouble_dataRowMaster_32}', {dataRowMaster_33}, {dataRowMaster_34}, {dataRowMaster_35}, {dataRowMaster_36}, {dataRowMaster_37}, {dataRowMaster_38}, {dataRowMaster_39}, {dataRowMaster_40}, NOW(), {dataRowMaster_42}, '1971-01-01 00:00:00', '{FixQuotes_dataRowMaster_44}', '{FixQuotes_dataRowMaster_45}', '{FixQuotes_dataRowMaster_46}', '{FixQuotes_dataRowMaster_47}', '{FixQuotes_dataRowMaster_48}', {dataRowMaster_49}, {dataRowMaster_50}, {dataRowMaster_51}, '{FixDouble_dataRowMaster_52}', '{FixDouble_dataRowMaster_53}', '{FixDouble_dataRowMaster_54}', '{FixQuotes_AsFormatTanggal_dataRowMaster_55}', '{FixQuotes_AsFormatTanggal_dataRowMaster_56}', '{FixQuotes_AsFormatTanggal_dataRowMaster_57}', '{FixQuotes_dataRowMaster_58}', '{FixQuotes_dataRowMaster_59}', '{FixQuotes_dataRowMaster_60}', '{FixQuotes_dataRowMaster_61}', '{FixQuotes_dataRowMaster_62}', '{FixQuotes_dataRowMaster_63}', '{FixQuotes_dataRowMaster_64}', '{FixQuotes_dataRowMaster_65}')
```

```sql
Insert into M7_Ae_Detail(idae, idasset, namaasset, jml, matauang, kurs, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, rekasset, rekdiskonpembelian, rekhutangpembelian, costcenter, divisi, subdivisi, proyek, catatan, urutan, idardetail, idaqdetail, idabdetail, idaodetail, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, satuan) values{strValue2_ToString}
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_ag.vb`

```sql
Insert into M7_Ag (agcabang, aglokasi, agsumber, agautonotransaksi, agnotransaksi, agtgl, agkodepa, agbagianag, agbagianagkontak, agmatauang, agkurs, aguraian, agcatatan, agnoref, agtglnoref, agstatus, agstatussebelumnya, agjmlrevisi, agcetakanke, aginputuser, aginputtgl, agmodifikasiuser, agmodifikasitgl, agposting, agpostingtgl, agtutupperiode, agisclose, agcustomtext1, agcustomtext2, agcustomtext3, agcustomtext4, agcustomtext5, agcustomint1, agcustomint2, agcustomint3, agcustomdbl1, agcustomdbl2, agcustomdbl3, agcustomdate1, agcustomdate2, agcustomdate3) values('{FixQuotes_dr1}agcabang', '{FixQuotes_dr1}aglokasi', '{FixQuotes_dr1}agsumber', {dr1}agautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_dr1}agtgl', '{FixQuotes_dr1}agkodepa', '{FixQuotes_dr1}agbagianag', '{FixQuotes_dr1}agbagianagkontak', '{FixQuotes_dr1}agmatauang', '{FixDouble_dr1}agkurs', '{FixQuotes_dr1}aguraian', '{FixQuotes_dr1}agcatatan', '{FixQuotes_dr1}agnoref', '{FixQuotes_AsFormatTanggal_dr1}agtglnoref', {dr1}agstatus, {dr1}agstatussebelumnya, {dr1}agjmlrevisi, {dr1}agcetakanke, '{FixQuotes_dr1}aginputuser', NOW(), '{FixQuotes_dr1}agmodifikasiuser', '1971-01-01 00:00:00', {dr1}agposting, '{FixQuotes_AsFormatTanggal_dr1}agpostingtglyyyy-MM-dd H:mm:ss', {dr1}agtutupperiode, {dr1}agisclose, '{FixQuotes_dr1}agcustomtext1', '{FixQuotes_dr1}agcustomtext2', '{FixQuotes_dr1}agcustomtext3', '{FixQuotes_dr1}agcustomtext4', '{FixQuotes_dr1}agcustomtext5', {dr1}agcustomint1, {dr1}agcustomint2, {dr1}agcustomint3, '{FixDouble_dr1}agcustomdbl1', '{FixDouble_dr1}agcustomdbl2', '{FixDouble_dr1}agcustomdbl3', '{FixQuotes_AsFormatTanggal_dr1}agcustomdate1', '{FixQuotes_AsFormatTanggal_dr1}agcustomdate2', '{FixQuotes_AsFormatTanggal_dr1}agcustomdate3')
```

```sql
Insert into M7_Asset (akode, anama, akategori, acabang, alokasi, adivisi, asubdivisi, acatatan, anomor, atglbeli, atglpakai, amatauang, akurs, ahargabeli, anilairesidu, aumurekonomis, abebanperbln, aakumulasibeban, anilaibuku, ametode, atabelpenyusutan, aintangible, afiskal, aatastengahbulan, arekasset, arekakumdepresiasi, arekdepresiasi, arekpenghapusan, aprodusen, atglpensiun, apenyusutanke, anilaimenurun, adispose, apembelian, apenjualan, alocked, astatus, astatussebelumnya, aisclose, ainputuser, ainputtgl, amodifikasiuser, amodifikasitgl, acustomtext1, acustomtext2, acustomtext3, acustomtext4, acustomtext5, acustomint1, acustomint2, acustomint3, acustomdbl1, acustomdbl2, acustomdbl3, acustomdate1, acustomdate2, acustomdate3, asatuan, aharga, adiskon, ajmldiskon, apajak1, ajmlpajak1, apajak2, ajmlpajak2) values('{FixQuotes_dataRowMaster_1}', '{FixQuotes_dataRowMaster_2}', '{FixQuotes_dataRowMaster_3}', '{FixQuotes_dataRowMaster_4}', '{FixQuotes_dataRowMaster_5}', '{FixQuotes_dataRowMaster_6}', '{FixQuotes_dataRowMaster_7}', '{FixQuotes_dataRowMaster_8}', '{FixQuotes_dataRowMaster_9}', '{FixQuotes_AsFormatTanggal_dataRowMaster_10}', '{FixQuotes_AsFormatTanggal_dataRowMaster_11}', '{FixQuotes_dataRowMaster_12}', '{FixDouble_dataRowMaster_13}', '{FixDouble_dataRowMaster_14}', '{FixDouble_dataRowMaster_15}', '{FixDouble_dataRowMaster_16}', '{FixDouble_dataRowMaster_17}', '{FixDouble_dataRowMaster_18}', '{FixDouble_dataRowMaster_19}', {dataRowMaster_20}, '{FixQuotes_dataRowMaster_21}', {dataRowMaster_22}, {dataRowMaster_23}, {dataRowMaster_24}, '{FixQuotes_dataRowMaster_25}', '{FixQuotes_dataRowMaster_26}', '{FixQuotes_dataRowMaster_27}', '{FixQuotes_dataRowMaster_28}', {dataRowMaster_29}, '{FixQuotes_AsFormatTanggal_dataRowMaster_30}', '{FixDouble_dataRowMaster_31}', '{FixDouble_dataRowMaster_32}', {dataRowMaster_33}, {dataRowMaster_34}, {dataRowMaster_35}, {dataRowMaster_36}, {dataRowMaster_37}, {dataRowMaster_38}, {dataRowMaster_39}, {dataRowMaster_40}, NOW(), {dataRowMaster_42}, '1971-01-01 00:00:00', '{FixQuotes_dataRowMaster_44}', '{FixQuotes_dataRowMaster_45}', '{FixQuotes_dataRowMaster_46}', '{FixQuotes_dataRowMaster_47}', '{FixQuotes_dataRowMaster_48}', {dataRowMaster_49}, {dataRowMaster_50}, {dataRowMaster_51}, '{FixDouble_dataRowMaster_52}', '{FixDouble_dataRowMaster_53}', '{FixDouble_dataRowMaster_54}', '{FixQuotes_AsFormatTanggal_dataRowMaster_55}', '{FixQuotes_AsFormatTanggal_dataRowMaster_56}', '{FixQuotes_AsFormatTanggal_dataRowMaster_57}', '{FixQuotes_dataRowMaster_58}', '{FixQuotes_dataRowMaster_59}', '{FixQuotes_dataRowMaster_60}', '{FixQuotes_dataRowMaster_61}', '{FixQuotes_dataRowMaster_62}', '{FixQuotes_dataRowMaster_63}', '{FixQuotes_dataRowMaster_64}', '{FixQuotes_dataRowMaster_65}')
```

```sql
Insert into M7_Ag_Detail(idagdetail, idag, idasset, namaasset, jml, matauang, kurs, hargabeli, rekasset, cabang, lokasi, costcenter, divisi, subdivisi, proyek, catatan, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, satuan) values{strValue2_ToString}
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_ao.vb`

```sql
Insert into M7_Ao (aocabang, aolokasi, aosumber, aoautonotransaksi, aonotransaksi, aotgl, aokodepa, aosupplier, aosupplierkontak, ao1alamat1, ao1alamat2, ao1alamat3, ao2alamat1, ao2alamat2, ao2alamat3, aobagianpembelian, aotgldipenuhi, aotermin, aotgljatuhtempo, aouraian, aocatatan, aonoref, aotglnoref, aotglpenutupan, aomatauang, aokurs, aohargatermasukpajak, aototal, aodiskonpersen, aojmldiskon, aototalpajak1detail, aototalpajak2detail, aobiayalainpersen, aobiayalain, aototaltransaksi, aojmlbayar, aorekdiskon, aorekpajak1, aorekpajak2, aorekbiayalain, aorekbayar, aoidar, aoidab, aostatusae, aostatus, aostatussebelumnya, aojmlrevisi, aocetakanke, aoinputuser, aoinputtgl, aomodifikasiuser, aomodifikasitgl, aoposting, aopostingtgl, aoisclose, aocustomtext1, aocustomtext2, aocustomtext3, aocustomtext4, aocustomtext5, aocustomint1, aocustomint2, aocustomint3, aocustomdbl1, aocustomdbl2, aocustomdbl3, aocustomdate1, aocustomdate2, aocustomdate3, aoidaq) values('{FixQuotes_drutama}aocabang', '{FixQuotes_drutama}aolokasi', '{FixQuotes_drutama}aosumber', {drutama}aoautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}aotgl', '{FixQuotes_drutama}aokodepa', '{FixQuotes_drutama}aosupplier', '{FixQuotes_drutama}aosupplierkontak', '{FixQuotes_drutama}ao1alamat1', '{FixQuotes_drutama}ao1alamat2', '{FixQuotes_drutama}ao1alamat3', '{FixQuotes_drutama}ao2alamat1', '{FixQuotes_drutama}ao2alamat2', '{FixQuotes_drutama}ao2alamat3', '{FixQuotes_drutama}aobagianpembelian', '{FixQuotes_AsFormatTanggal_drutama}aotgldipenuhi', '{FixQuotes_drutama}aotermin', '{FixQuotes_AsFormatTanggal_drutama}aotgljatuhtempo', '{FixQuotes_drutama}aouraian', '{FixQuotes_drutama}aocatatan', '{FixQuotes_drutama}aonoref', '{FixQuotes_AsFormatTanggal_drutama}aotglnoref', '{FixQuotes_AsFormatTanggal_drutama}aotglpenutupan', '{FixQuotes_drutama}aomatauang', '{FixDouble_drutama}aokurs', {drutama}aohargatermasukpajak, '{FixDouble_drutama}aototal', '{FixQuotes_drutama}aodiskonpersen', '{FixDouble_drutama}aojmldiskon', '{FixDouble_drutama}aototalpajak1detail', '{FixDouble_drutama}aototalpajak2detail', '{FixQuotes_drutama}aobiayalainpersen', '{FixDouble_drutama}aobiayalain', '{FixDouble_drutama}aototaltransaksi', '{FixDouble_drutama}aojmlbayar', '{FixQuotes_drutama}aorekdiskon', '{FixQuotes_drutama}aorekpajak1', '{FixQuotes_drutama}aorekpajak2', '{FixQuotes_drutama}aorekbiayalain', '{FixQuotes_drutama}aorekbayar', '{FixQuotes_drutama}aoidar', '{FixQuotes_drutama}aoidab', {drutama}aostatusae, {drutama}aostatus, {drutama}aostatussebelumnya, {drutama}aojmlrevisi, {drutama}aocetakanke, '{FixQuotes_drutama}aoinputuser', NOW(), '{FixQuotes_drutama}aomodifikasiuser', '1971-01-01', {drutama}aoposting, '{FixQuotes_AsFormatTanggal_drutama}aopostingtglyyyy-MM-dd HH:mm:ss', {drutama}aoisclose, '{FixQuotes_drutama}aocustomtext1', '{FixQuotes_drutama}aocustomtext2', '{FixQuotes_drutama}aocustomtext3', '{FixQuotes_drutama}aocustomtext4', '{FixQuotes_drutama}aocustomtext5', {drutama}aocustomint1, {drutama}aocustomint2, {drutama}aocustomint3, '{FixDouble_drutama}aocustomdbl1', '{FixDouble_drutama}aocustomdbl2', '{FixDouble_drutama}aocustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}aocustomdate1', '{FixQuotes_AsFormatTanggal_drutama}aocustomdate2', '{FixQuotes_AsFormatTanggal_drutama}aocustomdate3', '{FixQuotes_drutama}aoidaq')
```

```sql
Insert into M7_Ao_Detail(idaodetail, idao, idasset, namaasset, jml, matauang, kurs, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, costcenter, divisi, subdivisi, proyek, catatan, urutan, idardetail, idaqdetail, idabdetail, jmlae, statusae, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, satuan) values{strValue2_ToString}
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_aq.vb`

```sql
Insert into M7_Aq (aqcabang, aqlokasi, aqsumber, aqautonogrup, aqnogrup, aqautonotransaksi, aqnotransaksi, aqtgl, aqkodepa, aqsupplier, aqsupplierkontak, aq1alamat1, aq1alamat2, aq1alamat3, aq2alamat1, aq2alamat2, aq2alamat3, aqbagianpembelian, aqtgldipenuhi, aqtermin, aqtgljatuhtempo, aquraian, aqcatatan, aqnoref, aqtglnoref, aqtglpenutupan, aqmatauang, aqkurs, aqhargatermasukpajak, aqtotal, aqdiskonpersen, aqdiskon, aqtotalpajak1detail, aqtotalpajak2detail, aqbiayalainpersen, aqbiayalain, aqtotaltransaksi, aqidar, aqstatusao, aqstatusae, aqstatus, aqstatussebelumnya, aqjmlrevisi, aqcetakanke, aqinputuser, aqinputtgl, aqmodifikasiuser, aqmodifikasitgl, aqposting, aqpostingtgl, aqisclose, aqcustomtext1, aqcustomtext2, aqcustomtext3, aqcustomtext4, aqcustomtext5, aqcustomint1, aqcustomint2, aqcustomint3, aqcustomdbl1, aqcustomdbl2, aqcustomdbl3, aqcustomdate1, aqcustomdate2, aqcustomdate3) values('{FixQuotes_drutama}aqcabang', '{FixQuotes_drutama}aqlokasi', '{FixQuotes_drutama}aqsumber', {drutama}aqautonogrup, '{nogrup}', {drutama}aqautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}aqtgl', '{FixQuotes_drutama}aqkodepa', '{FixQuotes_drutama}aqsupplier', '{FixQuotes_drutama}aqsupplierkontak', '{FixQuotes_drutama}aq1alamat1', '{FixQuotes_drutama}aq1alamat2', '{FixQuotes_drutama}aq1alamat3', '{FixQuotes_drutama}aq2alamat1', '{FixQuotes_drutama}aq2alamat2', '{FixQuotes_drutama}aq2alamat3', '{FixQuotes_drutama}aqbagianpembelian', '{FixQuotes_AsFormatTanggal_drutama}aqtgldipenuhi', '{FixQuotes_drutama}aqtermin', '{FixQuotes_AsFormatTanggal_drutama}aqtgljatuhtempo', '{FixQuotes_drutama}aquraian', '{FixQuotes_drutama}aqcatatan', '{FixQuotes_drutama}aqnoref', '{FixQuotes_AsFormatTanggal_drutama}aqtglnoref', '{FixQuotes_AsFormatTanggal_drutama}aqtglpenutupan', '{FixQuotes_drutama}aqmatauang', '{FixDouble_drutama}aqkurs', {drutama}aqhargatermasukpajak, '{FixDouble_drutama}aqtotal', '{FixQuotes_drutama}aqdiskonpersen', '{FixDouble_drutama}aqdiskon', '{FixDouble_drutama}aqtotalpajak1detail', '{FixDouble_drutama}aqtotalpajak2detail', '{FixQuotes_drutama}aqbiayalainpersen', '{FixDouble_drutama}aqbiayalain', '{FixDouble_drutama}aqtotaltransaksi', '{FixQuotes_drutama}aqidar', {drutama}aqstatusao, {drutama}aqstatusae, {drutama}aqstatus, {drutama}aqstatussebelumnya, {drutama}aqjmlrevisi, {drutama}aqcetakanke, '{FixQuotes_drutama}aqinputuser', NOW(), '{FixQuotes_drutama}aqmodifikasiuser', '1971-01-01 00:00:00', {drutama}aqposting, '1971-01-01 00:00:00', {drutama}aqisclose, '{FixQuotes_drutama}aqcustomtext1', '{FixQuotes_drutama}aqcustomtext2', '{FixQuotes_drutama}aqcustomtext3', '{FixQuotes_drutama}aqcustomtext4', '{FixQuotes_drutama}aqcustomtext5', {drutama}aqcustomint1, {drutama}aqcustomint2, {drutama}aqcustomint3, '{FixDouble_drutama}aqcustomdbl1', '{FixDouble_drutama}aqcustomdbl2', '{FixDouble_drutama}aqcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}aqcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}aqcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}aqcustomdate3')
```

```sql
Insert into M7_Aq_Detail(idaqdetail, idaq, idasset, namaasset, jml, matauang, kurs, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, costcenter, divisi, subdivisi, proyek, catatan, urutan, idardetail, jmlao, statusao, jmlae, statusae, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, satuan) values{strValue2_ToString}
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_ar.vb`

```sql
Insert into M7_Ar (arcabang, arlokasi, arsumber, arautonotransaksi, arnotransaksi, artgl, arkodepa, ardimintaoleh, ardimintaolehkontak, armintake, artgldipakai, artermin, artgljatuhtempo, aruraian, arcatatan, arnoref, artglnoref, artglpenutupan, armatauang, arkurs, arhargatermasukpajak, artotal, ardiskonpersen, arjmldiskon, artotalpajak1detail, artotalpajak2detail, arbiayalainpersen, arbiayalain, artotaltransaksi, arstatusaq, arstatusao, arstatusae, arstatus, arstatussebelumnya, arjmlrevisi, arcetakanke, arinputuser, arinputtgl, armodifikasiuser, armodifikasitgl, arposting, arpostingtgl, arisclose, arcustomtext1, arcustomtext2, arcustomtext3, arcustomtext4, arcustomtext5, arcustomint1, arcustomint2, arcustomint3, arcustomdbl1, arcustomdbl2, arcustomdbl3, arcustomdate1, arcustomdate2, arcustomdate3) values('{FixQuotes_drutama}arcabang', '{FixQuotes_drutama}arlokasi', '{FixQuotes_drutama}arsumber', {drutama}arautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}artgl', '{FixQuotes_drutama}arkodepa', '{FixQuotes_drutama}ardimintaoleh', '{FixQuotes_drutama}ardimintaolehkontak', '{FixQuotes_drutama}armintake', '{FixQuotes_AsFormatTanggal_drutama}artgldipakai', '{FixQuotes_drutama}artermin', '{FixQuotes_AsFormatTanggal_drutama}artgljatuhtempo', '{FixQuotes_drutama}aruraian', '{FixQuotes_drutama}arcatatan', '{FixQuotes_drutama}arnoref', '{FixQuotes_AsFormatTanggal_drutama}artglnoref', '{FixQuotes_AsFormatTanggal_drutama}artglpenutupan', '{FixQuotes_drutama}armatauang', '{FixDouble_drutama}arkurs', {drutama}arhargatermasukpajak, '{FixDouble_drutama}artotal', '{FixQuotes_drutama}ardiskonpersen', '{FixDouble_drutama}arjmldiskon', '{FixDouble_drutama}artotalpajak1detail', '{FixDouble_drutama}artotalpajak2detail', '{FixQuotes_drutama}arbiayalainpersen', '{FixDouble_drutama}arbiayalain', '{FixDouble_drutama}artotaltransaksi', {drutama}arstatusaq, {drutama}arstatusao, {drutama}arstatusae, {drutama}arstatus, {drutama}arstatussebelumnya, {drutama}arjmlrevisi, {drutama}arcetakanke, '{FixQuotes_drutama}arinputuser', NOW(), '{FixQuotes_drutama}armodifikasiuser', '1971-01-01 00:00:00', {drutama}arposting, '1971-01-01 00:00:00', {drutama}arisclose, '{FixQuotes_drutama}arcustomtext1', '{FixQuotes_drutama}arcustomtext2', '{FixQuotes_drutama}arcustomtext3', '{FixQuotes_drutama}arcustomtext4', '{FixQuotes_drutama}arcustomtext5', {drutama}arcustomint1, {drutama}arcustomint2, {drutama}arcustomint3, '{FixDouble_drutama}arcustomdbl1', '{FixDouble_drutama}arcustomdbl2', '{FixDouble_drutama}arcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}arcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}arcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}arcustomdate3')
```

```sql
Insert into M7_Ar_Detail(idardetail, idar, idasset, namaasset, jml, matauang, kurs, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, costcenter, divisi, subdivisi, proyek, catatan, urutan, jmlaq, statusaq, jmlao, statusao, jmlae, statusae, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, satuan) values{strValue2_ToString}
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_asset.vb`

```sql
Insert into M7_Asset (akode, anama, akategori, acabang, alokasi, adivisi, asubdivisi, acatatan, anomor, atglbeli, atglpakai, amatauang, akurs, ahargabeli, anilairesidu, aumurekonomis, abebanperbln, aakumulasibeban, anilaibuku, ametode, atabelpenyusutan, aintangible, afiskal, aatastengahbulan, arekasset, arekakumdepresiasi, arekdepresiasi, arekpenghapusan, aprodusen, atglpensiun, apenyusutanke, anilaimenurun, adispose, apembelian, apenjualan, alocked, astatus, astatussebelumnya, aisclose, ainputuser, ainputtgl, amodifikasiuser, amodifikasitgl, acustomtext1, acustomtext2, acustomtext3, acustomtext4, acustomtext5, acustomint1, acustomint2, acustomint3, acustomdbl1, acustomdbl2, acustomdbl3, acustomdate1, acustomdate2, acustomdate3, acostcenter, aproyek, ajml, asatuan, aharga, adiskon, ajmldiskon, apajak1, ajmlpajak1, apajak2, ajmlpajak2) values('{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', '{FixQuotes_dataUtama_4}', '{FixQuotes_dataUtama_5}', '{FixQuotes_dataUtama_6}', '{FixQuotes_dataUtama_7}', '{FixQuotes_dataUtama_8}', '{FixQuotes_dataUtama_9}', '{FixQuotes_AsFormatTanggal_dataUtama_10}', '{FixQuotes_AsFormatTanggal_dataUtama_11}', '{FixQuotes_dataUtama_12}', '{FixDouble_dataUtama_13}', '{FixDouble_dataUtama_14}', '{FixDouble_dataUtama_15}', '{FixDouble_dataUtama_16}', '{FixDouble_dataUtama_17}', '{FixDouble_dataUtama_18}', '{FixDouble_dataUtama_19}', {dataUtama_20}, '{FixQuotes_dataUtama_21}', {dataUtama_22}, {dataUtama_23}, {dataUtama_24}, '{FixQuotes_dataUtama_25}', '{FixQuotes_dataUtama_26}', '{FixQuotes_dataUtama_27}', '{FixQuotes_dataUtama_28}', {dataUtama_29}, '{FixQuotes_AsFormatTanggal_dataUtama_30}', '{FixDouble_dataUtama_31}', '{FixDouble_dataUtama_32}', {dataUtama_33}, {dataUtama_34}, {dataUtama_35}, {dataUtama_36}, {dataUtama_37}, {dataUtama_38}, {dataUtama_39}, {dataUtama_40}, NOW(), {dataUtama_42}, '1971-01-01 00:00:00', '{FixQuotes_dataUtama_44}', '{FixQuotes_dataUtama_45}', '{FixQuotes_dataUtama_46}', '{FixQuotes_dataUtama_47}', '{FixQuotes_dataUtama_48}', {dataUtama_49}, {dataUtama_50}, {dataUtama_51}, '{FixDouble_dataUtama_52}', '{FixDouble_dataUtama_53}', '{FixDouble_dataUtama_54}', '{FixQuotes_AsFormatTanggal_dataUtama_55}', '{FixQuotes_AsFormatTanggal_dataUtama_56}', '{FixQuotes_AsFormatTanggal_dataUtama_57}', '{FixQuotes_dataUtama_58}', '{FixQuotes_dataUtama_59}', '{FixDouble_dataUtama_60}', '{FixQuotes_dataUtama_61}', '{FixDouble_dataUtama_62}', '{FixQuotes_dataUtama_63}', '{FixDouble_dataUtama_64}', '{FixQuotes_dataUtama_65}', '{FixDouble_dataUtama_66}', '{FixQuotes_dataUtama_67}', '{FixDouble_dataUtama_68}')
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_asset_category.vb`

```sql
Insert into M7_Asset_Category (ackode, acnama, ackategoripajak, acrekakumdepresiasi, acrekdepresiasi, acrekasset, acinputuser, acinputtgl, acmodifikasiuser, acmodifikasitgl, accustomtext1, accustomtext2, accustomtext3, accustomtext4, accustomtext5, accustomint1, accustomint2, accustomint3, accustomdbl1, accustomdbl2, accustomdbl3, accustomdate1, accustomdate2, accustomdate3) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixQuotes_dataUtama_3}', '{FixQuotes_dataUtama_4}', '{FixQuotes_dataUtama_5}', {dataUtama_6}, NOW(), {dataUtama_8}, '1971-01-01 00:00:00', '{FixQuotes_dataUtama_10}', '{FixQuotes_dataUtama_11}', '{FixQuotes_dataUtama_12}', '{FixQuotes_dataUtama_13}', '{FixQuotes_dataUtama_14}', {dataUtama_15}, {dataUtama_16}, {dataUtama_17}, '{FixDouble_dataUtama_18}', '{FixDouble_dataUtama_19}', '{FixDouble_dataUtama_20}', '{FixQuotes_AsFormatTanggal_dataUtama_21}', '{FixQuotes_AsFormatTanggal_dataUtama_22}', '{FixQuotes_AsFormatTanggal_dataUtama_23}')
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_asset_category_history.vb`

```sql
INSERT INTO m7_asset_category_history(SELECT 0, asset_category.* FROM m7_asset_category asset_category WHERE asset_category.ackode = '{idtransaksi}')
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_asset_category_tax.vb`

```sql
Insert into M7_Asset_Category_Tax (actkode, actnama, actmetode, actumur, actpenyusutan, actinputuser, actinputtgl, actmodifikasiuser, actmodifikasitgl, actcustomtext1, actcustomtext2, actcustomtext3, actcustomtext4, actcustomtext5, actcustomint1, actcustomint2, actcustomint3, actcustomdbl1, actcustomdbl2, actcustomdbl3, actcustomdate1, actcustomdate2, actcustomdate3) values('{FixQuotes_dataUtama_0}', '{FixQuotes_dataUtama_1}', '{FixQuotes_dataUtama_2}', '{FixDouble_dataUtama_3}', '{FixDouble_dataUtama_4}', {dataUtama_5}, NOW(), {dataUtama_7}, '1971-01-01 00:00:00', '{FixQuotes_dataUtama_9}', '{FixQuotes_dataUtama_10}', '{FixQuotes_dataUtama_11}', '{FixQuotes_dataUtama_12}', '{FixQuotes_dataUtama_13}', {dataUtama_14}, {dataUtama_15}, {dataUtama_16}, '{FixDouble_dataUtama_17}', '{FixDouble_dataUtama_18}', '{FixDouble_dataUtama_19}', '{FixQuotes_AsFormatTanggal_dataUtama_20}', '{FixQuotes_AsFormatTanggal_dataUtama_21}', '{FixQuotes_AsFormatTanggal_dataUtama_22}')
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_asset_category_tax_history.vb`

```sql
INSERT INTO m7_asset_category_tax_history(SELECT 0, asset_category_tax.* FROM m7_asset_category_tax asset_category_tax WHERE asset_category_tax.actkode = '{idtransaksi}')
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_asset_history.vb`

```sql
INSERT INTO m7_asset_history(SELECT 0, asset.* FROM m7_asset asset WHERE asset.aid = '{idtransaksi}')
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_at.vb`

```sql
Insert into M7_At (atcabang, atlokasi, atgudang, atsumber, atautonotransaksi, atnotransaksi, attgl, atkodepa, atsupplier, atsupplierkontak, at1alamat1, at1alamat2, at1alamat3, at2alamat1, at2alamat2, at2alamat3, atbagianpembayaran, aturaian, atcatatan, atnoref, attglnoref, atcarabayar, attglbayar, atmatauang, atkurs, attotalap, attotalapvalas, atbayar, atbayarvalas, atdiskontermin, atdiskonterminvalas, atrekdiskontermin, atstatus, atstatussebelumnya, atjmlrevisi, atcetakanke, atinputuser, atinputtgl, atmodifikasiuser, atmodifikasitgl, atposting, atpostingtgl, atisclose, atcustomtext1, atcustomtext2, atcustomtext3, atcustomtext4, atcustomtext5, atcustomint1, atcustomint2, atcustomint3, atcustomdbl1, atcustomdbl2, atcustomdbl3, atcustomdate1, atcustomdate2, atcustomdate3) values('{FixQuotes_drutama}atcabang', '{FixQuotes_drutama}atlokasi', '{FixQuotes_drutama}atgudang', '{FixQuotes_drutama}atsumber', {drutama}atautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}attgl', '{FixQuotes_drutama}atkodepa', '{FixQuotes_drutama}atsupplier', '{FixQuotes_drutama}atsupplierkontak', '{FixQuotes_drutama}at1alamat1', '{FixQuotes_drutama}at1alamat2', '{FixQuotes_drutama}at1alamat3', '{FixQuotes_drutama}at2alamat1', '{FixQuotes_drutama}at2alamat2', '{FixQuotes_drutama}at2alamat3', '{FixQuotes_drutama}atbagianpembayaran', '{FixQuotes_drutama}aturaian', '{FixQuotes_drutama}atcatatan', '{FixQuotes_drutama}atnoref', '{FixQuotes_AsFormatTanggal_drutama}attglnoref', {drutama}atcarabayar, '{FixQuotes_AsFormatTanggal_drutama}attglbayar', '{FixQuotes_drutama}atmatauang', '{FixDouble_drutama}atkurs', '{FixDouble_drutama}attotalap', '{FixDouble_drutama}attotalapvalas', '{FixDouble_drutama}atbayar', '{FixDouble_drutama}atbayarvalas', '{FixDouble_drutama}atdiskontermin', '{FixDouble_drutama}atdiskonterminvalas', '{FixQuotes_drutama}atrekdiskontermin', {drutama}atstatus, {drutama}atstatussebelumnya, {drutama}atjmlrevisi, {drutama}atcetakanke, '{FixQuotes_drutama}atinputuser', '{FixQuotes_AsFormatTanggal_drutama}atinputtglyyyy-MM-dd HH:mm:ss', '{FixQuotes_drutama}atmodifikasiuser', '1971-01-01 00:00:00', {drutama}atposting, '1971-01-01 00:00:00', {drutama}atisclose, '{FixQuotes_drutama}atcustomtext1', '{FixQuotes_drutama}atcustomtext2', '{FixQuotes_drutama}atcustomtext3', '{FixQuotes_drutama}atcustomtext4', '{FixQuotes_drutama}atcustomtext5', {drutama}atcustomint1, {drutama}atcustomint2, {drutama}atcustomint3, '{FixDouble_drutama}atcustomdbl1', '{FixDouble_drutama}atcustomdbl2', '{FixDouble_drutama}atcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}atcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}atcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}atcustomdate3')
```

```sql
Insert into M7_At_Detail(idatdetail, idat, sumber, idtransaksi, matauang, kurs, totaltransaksi, terbayar, rencana, sisa, jmlbayar, jmlbayarvalas, diskontermin, jmldiskontermin, jmldiskonterminvalas, rekhutangpiutang, catatan, costcenter, divisi, subdivisi, proyek, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
Insert into M7_at_Pay(idatcarabayar, idat, carabayar, matauang, kurs, jumlah, jumlahvalas, nogiro, tgljt, bank, noacbank, rekbank, rekgiro, catatan, urutan, isclose) values{strValue2_ToString}
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_da.vb`

```sql
Insert into M7_Da (dacabang, dalokasi, dagudang, dasumber, daautonotransaksi, danotransaksi, datgl, dakodepa, damatauang, dakurs, dabagianda, dabagiandakontak, dauraian, dacatatan, danoref, datglnoref, dastatus, dastatussebelumnya, dajmlrevisi, dacetakanke, dainputuser, dainputtgl, damodifikasiuser, damodifikasitgl, daposting, datutupperiode, daisclose, dacustomtext1, dacustomtext2, dacustomtext3, dacustomtext4, dacustomtext5, dacustomint1, dacustomint2, dacustomint3, dacustomdbl1, dacustomdbl2, dacustomdbl3, dacustomdate1, dacustomdate2, dacustomdate3) values('{FixQuotes_drutama}dacabang', '{FixQuotes_drutama}dalokasi', '{FixQuotes_drutama}dagudang', '{FixQuotes_drutama}dasumber', {drutama}daautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}datgl', {drutama}dakodepa, '{FixQuotes_drutama}damatauang', '{FixDouble_drutama}dakurs', {drutama}dabagianda, '{FixQuotes_drutama}dabagiandakontak', '{FixQuotes_drutama}dauraian', '{FixQuotes_drutama}dacatatan', '{FixQuotes_drutama}danoref', '{FixQuotes_AsFormatTanggal_drutama}datglnoref', {drutama}dastatus, {drutama}dastatussebelumnya, {drutama}dajmlrevisi, {drutama}dacetakanke, {drutama}dainputuser, NOW(), {drutama}damodifikasiuser, '1971-01-01 00:00:00', 0, {drutama}datutupperiode, {drutama}daisclose, '{FixQuotes_drutama}dacustomtext1', '{FixQuotes_drutama}dacustomtext2', '{FixQuotes_drutama}dacustomtext3', '{FixQuotes_drutama}dacustomtext4', '{FixQuotes_drutama}dacustomtext5', {drutama}dacustomint1, {drutama}dacustomint2, {drutama}dacustomint3, '{FixDouble_drutama}dacustomdbl1', '{FixDouble_drutama}dacustomdbl2', '{FixDouble_drutama}dacustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}dacustomdate1', '{FixQuotes_AsFormatTanggal_drutama}dacustomdate2', '{FixQuotes_AsFormatTanggal_drutama}dacustomdate3')
```

```sql
Insert into M7_Da_Detail(iddadetail, idda, idaset, penyusutanke, matauang, kurs, nilaipenyusutan, nilaibukusebelumnya, costcenter, divisi, subdivisi, proyek, catatan, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_files.vb`

```sql
Insert into M7_Files(fsumber, fidtransaksi, fnamafile, fcatatan, fukuranfile, ftanggal, finputuser, finputtgl) values{strValue1_ToString}
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_notes.vb`

```sql
Insert into M7_Notes (nsumber, nidtransaksi, ncatatan, ninputuser, ninputtgl, nmodifikasiuser, nmodifikasitgl) values('{FixQuotes_dataUtama_1}', {dataUtama_2}, '{FixQuotes_dataUtama_3}', {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00')
```

## UPDATE

Total: `30`

### `client-backend/api-myerpplus/app_code/ws/m7/m7_ab.vb`

```sql
Update M7_Ab set abcabang = '{FixQuotes_dr1}abcabang', ablokasi = '{FixQuotes_dr1}ablokasi', abgudang = '{FixQuotes_dr1}abgudang', abasalbarang = '{FixQuotes_dr1}abasalbarang', abasalbarangkategori = {dr1}abasalbarangkategori, abjenispembelian = '{FixQuotes_dr1}abjenispembelian', abjenispembeliankategori = {dr1}abjenispembeliankategori, abcarabayar = {dr1}abcarabayar, absumber = '{FixQuotes_dr1}absumber', abnogrup = '{FixQuotes_dr1}abnogrup', abautonotransaksi = {dr1}abautonotransaksi, abnotransaksi = '{FixQuotes_dr1}abnotransaksi', abtgl = '{FixQuotes_AsFormatTanggal_dr1}abtgl', abkodepa = '{FixQuotes_dr1}abkodepa', abbagianperbandingan = '{FixQuotes_dr1}abbagianperbandingan', abbagianperbandingankontak = '{FixQuotes_dr1}abbagianperbandingankontak', aburaian = '{FixQuotes_dr1}aburaian', abcatatan = '{FixQuotes_dr1}abcatatan', abnoref = '{FixQuotes_dr1}abnoref', abtglnoref = '{FixQuotes_AsFormatTanggal_dr1}abtglnoref', abtglpenutupan = '{FixQuotes_AsFormatTanggal_dr1}abtglpenutupan', abmatauang = '{FixQuotes_dr1}abmatauang', abidaq1 = '{FixQuotes_dr1}abidaq1', abidaq2 = '{FixQuotes_dr1}abidaq2', abidaq3 = '{FixQuotes_dr1}abidaq3', abidaq4 = '{FixQuotes_dr1}abidaq4', abidaq5 = '{FixQuotes_dr1}abidaq5', abidaq1statusao = {dr1}abidaq1statusao, abidaq2statusao = {dr1}abidaq2statusao, abidaq3statusao = {dr1}abidaq3statusao, abidaq4statusao = {dr1}abidaq4statusao, abidaq5statusao = {dr1}abidaq5statusao, abstatus = {dr1}abstatus, abstatussebelumnya = {dr1}abstatussebelumnya, abjmlrevisi = {dr1}abjmlrevisi, abcetakanke = {dr1}abcetakanke, abinputuser = '{FixQuotes_dr1}abinputuser', abinputtgl = '{FixQuotes_AsFormatTanggal_dr1}abinputtglyyyy-MM-dd HH:mm:ss', abmodifikasiuser = '{FixQuotes_dr1}abmodifikasiuser', abmodifikasitgl = '{FixQuotes_AsFormatTanggal_dr1}abmodifikasitglyyyy-MM-dd HH:mm:ss', abcustomtext1 = '{FixQuotes_dr1}abcustomtext1', abcustomtext2 = '{FixQuotes_dr1}abcustomtext2', abcustomtext3 = '{FixQuotes_dr1}abcustomtext3', abcustomtext4 = '{FixQuotes_dr1}abcustomtext4', abcustomtext5 = '{FixQuotes_dr1}abcustomtext5', abcustomint1 = {dr1}abcustomint1, abcustomint2 = {dr1}abcustomint2, abcustomint3 = {dr1}abcustomint3, abcustomdbl1 = '{FixDouble_dr1}abcustomdbl1', abcustomdbl2 = '{FixDouble_dr1}abcustomdbl2', abcustomdbl3 = '{FixDouble_dr1}abcustomdbl3', abcustomdate1 = '{FixQuotes_AsFormatTanggal_dr1}abcustomdate1', abcustomdate2 = '{FixQuotes_AsFormatTanggal_dr1}abcustomdate2', abcustomdate3 = '{FixQuotes_AsFormatTanggal_dr1}abcustomdate3' where abid = {dr1}abid
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_ae.vb`

```sql
Update M7_Ae set aecabang = '{FixQuotes_drutama}aecabang', aelokasi = '{FixQuotes_drutama}aelokasi', aesumber = '{FixQuotes_drutama}aesumber', aeautonotransaksi = {drutama}aeautonotransaksi, aenotransaksi = '{FixQuotes_drutama}aenotransaksi', aetgl = '{FixQuotes_AsFormatTanggal_drutama}aetgl', aekodepa = '{FixQuotes_drutama}aekodepa', aesupplier = '{FixQuotes_drutama}aesupplier', aesupplierkontak = '{FixQuotes_drutama}aesupplierkontak', ae1alamat1 = '{FixQuotes_drutama}ae1alamat1', ae1alamat2 = '{FixQuotes_drutama}ae1alamat2', ae1alamat3 = '{FixQuotes_drutama}ae1alamat3', ae2alamat1 = '{FixQuotes_drutama}ae2alamat1', ae2alamat2 = '{FixQuotes_drutama}ae2alamat2', ae2alamat3 = '{FixQuotes_drutama}ae2alamat3', aebagianpembelian = '{FixQuotes_drutama}aebagianpembelian', aetermin = '{FixQuotes_drutama}aetermin', aetgljatuhtempo = '{FixQuotes_AsFormatTanggal_drutama}aetgljatuhtempo', aeuraian = '{FixQuotes_drutama}aeuraian', aecatatan = '{FixQuotes_drutama}aecatatan', aenoref = '{FixQuotes_drutama}aenoref', aetglnoref = '{FixQuotes_AsFormatTanggal_drutama}aetglnoref', aetglpenutupan = '{FixQuotes_AsFormatTanggal_drutama}aetglpenutupan', aematauang = '{FixQuotes_drutama}aematauang', aekurs = '{FixDouble_drutama}aekurs', aehargatermasukpajak = {drutama}aehargatermasukpajak, aetotal = '{FixDouble_drutama}aetotal', aediskonpersen = '{FixQuotes_drutama}aediskonpersen', aejmldiskon = '{FixDouble_drutama}aejmldiskon', aetotalpajak1detail = '{FixDouble_drutama}aetotalpajak1detail', aetotalpajak2detail = '{FixDouble_drutama}aetotalpajak2detail', aebiayalainpersen = '{FixQuotes_drutama}aebiayalainpersen', aebiayalain = '{FixDouble_drutama}aebiayalain', aetotaltransaksi = '{FixDouble_drutama}aetotaltransaksi', aejmlbayar = '{FixDouble_drutama}aejmlbayar', aerekdiskon = '{FixQuotes_drutama}aerekdiskon', aerekpajak1 = '{FixQuotes_drutama}aerekpajak1', aerekpajak2 = '{FixQuotes_drutama}aerekpajak2', aerekbiayalain = '{FixQuotes_drutama}aerekbiayalain', aerekbayar = '{FixQuotes_drutama}aerekbayar', aeidar = '{FixQuotes_drutama}aeidar', aeidaq = '{FixQuotes_drutama}aeidaq', aeidab = '{FixQuotes_drutama}aeidab', aeidao = '{FixQuotes_drutama}aeidao', aestatus = {drutama}aestatus, aestatussebelumnya = {drutama}aestatussebelumnya, aejmlrevisi = {drutama}aejmlrevisi, aecetakanke = {drutama}aecetakanke, aemodifikasiuser = '{FixQuotes_drutama}aemodifikasiuser', aemodifikasitgl = NOW(), aeposting = {drutama}aeposting, aepostingtgl = '{FixQuotes_AsFormatTanggal_drutama}aepostingtglyyyy-MM-dd H:mm:ss', aetutupperiode = {drutama}aetutupperiode, aecustomtext1 = '{FixQuotes_drutama}aecustomtext1', aecustomtext2 = '{FixQuotes_drutama}aecustomtext2', aecustomtext3 = '{FixQuotes_drutama}aecustomtext3', aecustomtext4 = '{FixQuotes_drutama}aecustomtext4', aecustomtext5 = '{FixQuotes_drutama}aecustomtext5', aecustomint1 = {drutama}aecustomint1, aecustomint2 = {drutama}aecustomint2, aecustomint3 = {drutama}aecustomint3, aecustomdbl1 = '{FixDouble_drutama}aecustomdbl1', aecustomdbl2 = '{FixDouble_drutama}aecustomdbl2', aecustomdbl3 = '{FixDouble_drutama}aecustomdbl3', aecustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}aecustomdate1', aecustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}aecustomdate2', aecustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}aecustomdate3', aecarabayar = '{FixQuotes_drutama}aecarabayar', aestatuslunas = '{FixQuotes_drutama}aestatuslunas', aetgllunas = '{FixQuotes_AsFormatTanggal_drutama}aetgllunas', aenofakturpajak = '{FixQuotes_drutama}aenofakturpajak', aesdhbayarpajak = '{FixQuotes_drutama}aesdhbayarpajak', aetglbayarpajak = '{FixQuotes_AsFormatTanggal_drutama}aetglbayarpajak' where aeid = {drutama}aeid
```

```sql
UPDATE m7_ao_detail SET jmlrealisasi = (CASE idaodetail {updNilaiAO} ELSE jmlrealisasi END) WHERE
```

```sql
UPDATE m7_ao SET aostatusrealisasi = (CASE aoid {updNilaiAO} ELSE aostatusrealisasi END) WHERE
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_ag.vb`

```sql
Update M7_Ag set agcabang = '{FixQuotes_dr1}agcabang', aglokasi = '{FixQuotes_dr1}aglokasi', agsumber = '{FixQuotes_dr1}agsumber', agautonotransaksi = {dr1}agautonotransaksi, agnotransaksi = '{FixQuotes_dr1}agnotransaksi', agtgl = '{FixQuotes_AsFormatTanggal_dr1}agtgl', agkodepa = '{FixQuotes_dr1}agkodepa', agbagianag = '{FixQuotes_dr1}agbagianag', agbagianagkontak = '{FixQuotes_dr1}agbagianagkontak', agmatauang = '{FixQuotes_dr1}agmatauang', agkurs = '{FixDouble_dr1}agkurs', aguraian = '{FixQuotes_dr1}aguraian', agcatatan = '{FixQuotes_dr1}agcatatan', agnoref = '{FixQuotes_dr1}agnoref', agtglnoref = '{FixQuotes_AsFormatTanggal_dr1}agtglnoref', agstatus = {dr1}agstatus, agstatussebelumnya = {dr1}agstatussebelumnya, agjmlrevisi = {dr1}agjmlrevisi, agcetakanke = {dr1}agcetakanke, aginputuser = '{FixQuotes_dr1}aginputuser', aginputtgl = '{FixQuotes_AsFormatTanggal_dr1}aginputtglyyyy-MM-dd H:mm:ss', agmodifikasiuser = '{FixQuotes_dr1}agmodifikasiuser', agmodifikasitgl = NOW(), agposting = {dr1}agposting, agpostingtgl = '{FixQuotes_AsFormatTanggal_dr1}agpostingtglyyyy-MM-dd H:mm:ss', agtutupperiode = {dr1}agtutupperiode, agcustomtext1 = '{FixQuotes_dr1}agcustomtext1', agcustomtext2 = '{FixQuotes_dr1}agcustomtext2', agcustomtext3 = '{FixQuotes_dr1}agcustomtext3', agcustomtext4 = '{FixQuotes_dr1}agcustomtext4', agcustomtext5 = '{FixQuotes_dr1}agcustomtext5', agcustomint1 = {dr1}agcustomint1, agcustomint2 = {dr1}agcustomint2, agcustomint3 = {dr1}agcustomint3, agcustomdbl1 = '{FixDouble_dr1}agcustomdbl1', agcustomdbl2 = '{FixDouble_dr1}agcustomdbl2', agcustomdbl3 = '{FixDouble_dr1}agcustomdbl3', agcustomdate1 = '{FixQuotes_AsFormatTanggal_dr1}agcustomdate1', agcustomdate2 = '{FixQuotes_AsFormatTanggal_dr1}agcustomdate2', agcustomdate3 = '{FixQuotes_AsFormatTanggal_dr1}agcustomdate3' where agid = {dr1}agid
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_ao.vb`

```sql
Update M7_Ao set aocabang = '{FixQuotes_drutama}aocabang', aolokasi = '{FixQuotes_drutama}aolokasi', aosumber = '{FixQuotes_drutama}aosumber', aoautonotransaksi = {drutama}aoautonotransaksi, aonotransaksi = '{FixQuotes_drutama}aonotransaksi', aotgl = '{FixQuotes_AsFormatTanggal_drutama}aotgl', aokodepa = '{FixQuotes_drutama}aokodepa', aosupplier = '{FixQuotes_drutama}aosupplier', aosupplierkontak = '{FixQuotes_drutama}aosupplierkontak', ao1alamat1 = '{FixQuotes_drutama}ao1alamat1', ao1alamat2 = '{FixQuotes_drutama}ao1alamat2', ao1alamat3 = '{FixQuotes_drutama}ao1alamat3', ao2alamat1 = '{FixQuotes_drutama}ao2alamat1', ao2alamat2 = '{FixQuotes_drutama}ao2alamat2', ao2alamat3 = '{FixQuotes_drutama}ao2alamat3', aobagianpembelian = '{FixQuotes_drutama}aobagianpembelian', aotgldipenuhi = '{FixQuotes_AsFormatTanggal_drutama}aotgldipenuhi', aotermin = '{FixQuotes_drutama}aotermin', aotgljatuhtempo = '{FixQuotes_AsFormatTanggal_drutama}aotgljatuhtempo', aouraian = '{FixQuotes_drutama}aouraian', aocatatan = '{FixQuotes_drutama}aocatatan', aonoref = '{FixQuotes_drutama}aonoref', aotglnoref = '{FixQuotes_AsFormatTanggal_drutama}aotglnoref', aotglpenutupan = '{FixQuotes_AsFormatTanggal_drutama}aotglpenutupan', aomatauang = '{FixQuotes_drutama}aomatauang', aokurs = '{FixDouble_drutama}aokurs', aohargatermasukpajak = {drutama}aohargatermasukpajak, aototal = '{FixDouble_drutama}aototal', aodiskonpersen = '{FixQuotes_drutama}aodiskonpersen', aojmldiskon = '{FixDouble_drutama}aojmldiskon', aototalpajak1detail = '{FixDouble_drutama}aototalpajak1detail', aototalpajak2detail = '{FixDouble_drutama}aototalpajak2detail', aobiayalainpersen = '{FixQuotes_drutama}aobiayalainpersen', aobiayalain = '{FixDouble_drutama}aobiayalain', aototaltransaksi = '{FixDouble_drutama}aototaltransaksi', aojmlbayar = '{FixDouble_drutama}aojmlbayar', aorekdiskon = '{FixQuotes_drutama}aorekdiskon', aorekpajak1 = '{FixQuotes_drutama}aorekpajak1', aorekpajak2 = '{FixQuotes_drutama}aorekpajak2', aorekbiayalain = '{FixQuotes_drutama}aorekbiayalain', aorekbayar = '{FixQuotes_drutama}aorekbayar', aoidar = '{FixQuotes_drutama}aoidar', aoidab = '{FixQuotes_drutama}aoidab', aostatusae = {drutama}aostatusae, aostatus = {drutama}aostatus, aostatussebelumnya = {drutama}aostatussebelumnya, aojmlrevisi = {drutama}aojmlrevisi, aocetakanke = {drutama}aocetakanke, aomodifikasiuser = '{FixQuotes_drutama}aomodifikasiuser', aomodifikasitgl = NOW(), aoposting = {drutama}aoposting, aopostingtgl = '{FixQuotes_AsFormatTanggal_drutama}aopostingtglyyyy-MM-dd HH:mm:ss', aocustomtext1 = '{FixQuotes_drutama}aocustomtext1', aocustomtext2 = '{FixQuotes_drutama}aocustomtext2', aocustomtext3 = '{FixQuotes_drutama}aocustomtext3', aocustomtext4 = '{FixQuotes_drutama}aocustomtext4', aocustomtext5 = '{FixQuotes_drutama}aocustomtext5', aocustomint1 = {drutama}aocustomint1, aocustomint2 = {drutama}aocustomint2, aocustomint3 = {drutama}aocustomint3, aocustomdbl1 = '{FixDouble_drutama}aocustomdbl1', aocustomdbl2 = '{FixDouble_drutama}aocustomdbl2', aocustomdbl3 = '{FixDouble_drutama}aocustomdbl3', aocustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}aocustomdate1', aocustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}aocustomdate2', aocustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}aocustomdate3', aoidaq = '{FixQuotes_drutama}aoidaq' where aoid = {drutama}aoid
```

```sql
UPDATE m7_ar_detail SET jmlrealisasi = (CASE idardetail {updNilaiAR} ELSE jmlrealisasi END) WHERE
```

```sql
UPDATE m7_ar SET arstatusrealisasi = (CASE arid {updNilaiAR} ELSE arstatusrealisasi END) WHERE
```

```sql
UPDATE m7_aq_detail SET jmlrealisasi = (CASE idaqdetail {updNilaiAQ} ELSE jmlrealisasi END) WHERE
```

```sql
UPDATE m7_aq SET aqstatusrealisasi = (CASE aqid {updNilaiAQ} ELSE aqstatusrealisasi END) WHERE
```

```sql
UPDATE M7_Ao SET Aostatus = {nilaiStatus}, Aomodifikasiuser='{userid}', Aomodifikasitgl = NOW(), Aoposting = 0, Aopostingtgl = '1971-01-01 00:00:00', Aojmlrevisi = Aojmlrevisi + 1 WHERE Aoid = '{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_aq.vb`

```sql
Update M7_Aq set aqcabang = '{FixQuotes_drutama}aqcabang', aqlokasi = '{FixQuotes_drutama}aqlokasi', aqsumber = '{FixQuotes_drutama}aqsumber', aqautonogrup = {drutama}aqautonogrup, aqnogrup = '{FixQuotes_drutama}aqnogrup', aqautonotransaksi = {drutama}aqautonotransaksi, aqnotransaksi = '{FixQuotes_drutama}aqnotransaksi', aqtgl = '{FixQuotes_AsFormatTanggal_drutama}aqtgl', aqkodepa = '{FixQuotes_drutama}aqkodepa', aqsupplier = '{FixQuotes_drutama}aqsupplier', aqsupplierkontak = '{FixQuotes_drutama}aqsupplierkontak', aq1alamat1 = '{FixQuotes_drutama}aq1alamat1', aq1alamat2 = '{FixQuotes_drutama}aq1alamat2', aq1alamat3 = '{FixQuotes_drutama}aq1alamat3', aq2alamat1 = '{FixQuotes_drutama}aq2alamat1', aq2alamat2 = '{FixQuotes_drutama}aq2alamat2', aq2alamat3 = '{FixQuotes_drutama}aq2alamat3', aqbagianpembelian = '{FixQuotes_drutama}aqbagianpembelian', aqtgldipenuhi = '{FixQuotes_AsFormatTanggal_drutama}aqtgldipenuhi', aqtermin = '{FixQuotes_drutama}aqtermin', aqtgljatuhtempo = '{FixQuotes_AsFormatTanggal_drutama}aqtgljatuhtempo', aquraian = '{FixQuotes_drutama}aquraian', aqcatatan = '{FixQuotes_drutama}aqcatatan', aqnoref = '{FixQuotes_drutama}aqnoref', aqtglnoref = '{FixQuotes_AsFormatTanggal_drutama}aqtglnoref', aqtglpenutupan = '{FixQuotes_AsFormatTanggal_drutama}aqtglpenutupan', aqmatauang = '{FixQuotes_drutama}aqmatauang', aqkurs = '{FixDouble_drutama}aqkurs', aqhargatermasukpajak = {drutama}aqhargatermasukpajak, aqtotal = '{FixDouble_drutama}aqtotal', aqdiskonpersen = '{FixQuotes_drutama}aqdiskonpersen', aqdiskon = '{FixDouble_drutama}aqdiskon', aqtotalpajak1detail = '{FixDouble_drutama}aqtotalpajak1detail', aqtotalpajak2detail = '{FixDouble_drutama}aqtotalpajak2detail', aqbiayalainpersen = '{FixQuotes_drutama}aqbiayalainpersen', aqbiayalain = '{FixDouble_drutama}aqbiayalain', aqtotaltransaksi = '{FixDouble_drutama}aqtotaltransaksi', aqidar = '{FixQuotes_drutama}aqidar', aqstatusao = {drutama}aqstatusao, aqstatusae = {drutama}aqstatusae, aqstatus = {drutama}aqstatus, aqstatussebelumnya = {drutama}aqstatussebelumnya, aqjmlrevisi = {drutama}aqjmlrevisi, aqcetakanke = {drutama}aqcetakanke, aqmodifikasiuser = '{FixQuotes_drutama}aqmodifikasiuser', aqmodifikasitgl = NOW(), aqposting = {drutama}aqposting, aqpostingtgl = '{FixQuotes_AsFormatTanggal_drutama}aqpostingtglyyyy-MM-dd H:mm:ss', aqcustomtext1 = '{FixQuotes_drutama}aqcustomtext1', aqcustomtext2 = '{FixQuotes_drutama}aqcustomtext2', aqcustomtext3 = '{FixQuotes_drutama}aqcustomtext3', aqcustomtext4 = '{FixQuotes_drutama}aqcustomtext4', aqcustomtext5 = '{FixQuotes_drutama}aqcustomtext5', aqcustomint1 = {drutama}aqcustomint1, aqcustomint2 = {drutama}aqcustomint2, aqcustomint3 = {drutama}aqcustomint3, aqcustomdbl1 = '{FixDouble_drutama}aqcustomdbl1', aqcustomdbl2 = '{FixDouble_drutama}aqcustomdbl2', aqcustomdbl3 = '{FixDouble_drutama}aqcustomdbl3', aqcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}aqcustomdate1', aqcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}aqcustomdate2', aqcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}aqcustomdate3' where aqid = {drutama}aqid
```

```sql
UPDATE M7_ar_detail SET jmlaq = (CASE idardetail {updNilai} ELSE jmlaq END) WHERE
```

```sql
UPDATE M7_ar SET arstatusaq = (CASE arid {updNilai} ELSE arstatusaq END) WHERE
```

```sql
UPDATE M7_Aq SET Aqstatus = {nilaiStatus}, Aqmodifikasiuser='{userid}', Aqmodifikasitgl = NOW(), Aqposting = 0, Aqpostingtgl = '1971-01-01 00:00:00', Aqjmlrevisi = Aqjmlrevisi + 1 WHERE Aqid = '{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_ar.vb`

```sql
Update M7_Ar set arcabang = '{FixQuotes_drutama}arcabang', arlokasi = '{FixQuotes_drutama}arlokasi', arsumber = '{FixQuotes_drutama}arsumber', arautonotransaksi = {drutama}arautonotransaksi, arnotransaksi = '{FixQuotes_drutama}arnotransaksi', artgl = '{FixQuotes_AsFormatTanggal_drutama}artgl', arkodepa = '{FixQuotes_drutama}arkodepa', ardimintaoleh = '{FixQuotes_drutama}ardimintaoleh', ardimintaolehkontak = '{FixQuotes_drutama}ardimintaolehkontak', armintake = '{FixQuotes_drutama}armintake', artgldipakai = '{FixQuotes_AsFormatTanggal_drutama}artgldipakai', artermin = '{FixQuotes_drutama}artermin', artgljatuhtempo = '{FixQuotes_AsFormatTanggal_drutama}artgljatuhtempo', aruraian = '{FixQuotes_drutama}aruraian', arcatatan = '{FixQuotes_drutama}arcatatan', arnoref = '{FixQuotes_drutama}arnoref', artglnoref = '{FixQuotes_AsFormatTanggal_drutama}artglnoref', artglpenutupan = '{FixQuotes_AsFormatTanggal_drutama}artglpenutupan', armatauang = '{FixQuotes_drutama}armatauang', arkurs = '{FixDouble_drutama}arkurs', arhargatermasukpajak = {drutama}arhargatermasukpajak, artotal = '{FixDouble_drutama}artotal', ardiskonpersen = '{FixQuotes_drutama}ardiskonpersen', arjmldiskon = '{FixDouble_drutama}arjmldiskon', artotalpajak1detail = '{FixDouble_drutama}artotalpajak1detail', artotalpajak2detail = '{FixDouble_drutama}artotalpajak2detail', arbiayalainpersen = '{FixQuotes_drutama}arbiayalainpersen', arbiayalain = '{FixDouble_drutama}arbiayalain', artotaltransaksi = '{FixDouble_drutama}artotaltransaksi', arstatusaq = {drutama}arstatusaq, arstatusao = {drutama}arstatusao, arstatusae = {drutama}arstatusae, arstatus = {drutama}arstatus, arstatussebelumnya = {drutama}arstatussebelumnya, arjmlrevisi = arjmlrevisi+1, arcetakanke = {drutama}arcetakanke, armodifikasiuser = '{FixQuotes_drutama}armodifikasiuser', armodifikasitgl = NOW(), arposting = {drutama}arposting, arpostingtgl = '{FixQuotes_AsFormatTanggal_drutama}arpostingtglyyyy-MM-dd H:mm:ss', arcustomtext1 = '{FixQuotes_drutama}arcustomtext1', arcustomtext2 = '{FixQuotes_drutama}arcustomtext2', arcustomtext3 = '{FixQuotes_drutama}arcustomtext3', arcustomtext4 = '{FixQuotes_drutama}arcustomtext4', arcustomtext5 = '{FixQuotes_drutama}arcustomtext5', arcustomint1 = {drutama}arcustomint1, arcustomint2 = {drutama}arcustomint2, arcustomint3 = {drutama}arcustomint3, arcustomdbl1 = '{FixDouble_drutama}arcustomdbl1', arcustomdbl2 = '{FixDouble_drutama}arcustomdbl2', arcustomdbl3 = '{FixDouble_drutama}arcustomdbl3', arcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}arcustomdate1', arcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}arcustomdate2', arcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}arcustomdate3' where arid = {drutama}arid
```

```sql
UPDATE m7_Ar SET Arstatus = {nilaiStatus}, Armodifikasiuser='{userid}', Armodifikasitgl = NOW(), Arposting = 0, Arpostingtgl = '1971-01-01 00:00:00', Arjmlrevisi = Arjmlrevisi + 1 WHERE Arid = '{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_asset.vb`

```sql
Update M7_Asset set akode = '{FixQuotes_dataUtama_1}', anama = '{FixQuotes_dataUtama_2}', akategori = '{FixQuotes_dataUtama_3}', acabang = '{FixQuotes_dataUtama_4}', alokasi = '{FixQuotes_dataUtama_5}', adivisi = '{FixQuotes_dataUtama_6}', asubdivisi = '{FixQuotes_dataUtama_7}', acatatan = '{FixQuotes_dataUtama_8}', anomor = '{FixQuotes_dataUtama_9}', atglbeli = '{FixQuotes_AsFormatTanggal_dataUtama_10}', atglpakai = '{FixQuotes_AsFormatTanggal_dataUtama_11}', amatauang = '{FixQuotes_dataUtama_12}', akurs = '{FixDouble_dataUtama_13}', ahargabeli = '{FixDouble_dataUtama_14}', anilairesidu = '{FixDouble_dataUtama_15}', aumurekonomis = '{FixDouble_dataUtama_16}', abebanperbln = '{FixDouble_dataUtama_17}', aakumulasibeban = '{FixDouble_dataUtama_18}', anilaibuku = '{FixDouble_dataUtama_19}', ametode = {dataUtama_20}, atabelpenyusutan = '{FixQuotes_dataUtama_21}', aintangible = {dataUtama_22}, afiskal = {dataUtama_23}, aatastengahbulan = {dataUtama_24}, arekasset = '{FixQuotes_dataUtama_25}', arekakumdepresiasi = '{FixQuotes_dataUtama_26}', arekdepresiasi = '{FixQuotes_dataUtama_27}', arekpenghapusan = '{FixQuotes_dataUtama_28}', aprodusen = {dataUtama_29}, atglpensiun = '{FixQuotes_AsFormatTanggal_dataUtama_30}', apenyusutanke = '{FixDouble_dataUtama_31}', anilaimenurun = '{FixDouble_dataUtama_32}', adispose = {dataUtama_33}, apembelian = {dataUtama_34}, apenjualan = {dataUtama_35}, alocked = {dataUtama_36}, astatus = {dataUtama_37}, astatussebelumnya = {dataUtama_38}, aisclose = {dataUtama_39}, amodifikasiuser = {dataUtama_42}, amodifikasitgl = NOW(), acustomtext1 = '{FixQuotes_dataUtama_44}', acustomtext2 = '{FixQuotes_dataUtama_45}', acustomtext3 = '{FixQuotes_dataUtama_46}', acustomtext4 = '{FixQuotes_dataUtama_47}', acustomtext5 = '{FixQuotes_dataUtama_48}', acustomint1 = {dataUtama_49}, acustomint2 = {dataUtama_50}, acustomint3 = {dataUtama_51}, acustomdbl1 = '{FixDouble_dataUtama_52}', acustomdbl2 = '{FixDouble_dataUtama_53}', acustomdbl3 = '{FixDouble_dataUtama_54}', acustomdate1 = '{FixQuotes_AsFormatTanggal_dataUtama_55}', acustomdate2 = '{FixQuotes_AsFormatTanggal_dataUtama_56}', acustomdate3 = '{FixQuotes_AsFormatTanggal_dataUtama_57}', acostcenter = '{FixQuotes_dataUtama_58}', aproyek = '{FixQuotes_dataUtama_59}', ajml = '{FixDouble_dataUtama_60}', asatuan = '{FixQuotes_dataUtama_61}', aharga = '{FixDouble_dataUtama_62}', adiskon = '{FixQuotes_dataUtama_63}', ajmldiskon = '{FixDouble_dataUtama_64}', apajak1 = '{FixQuotes_dataUtama_65}', ajmlpajak1 = '{FixDouble_dataUtama_66}', apajak2 = '{FixQuotes_dataUtama_67}', ajmlpajak2 = '{FixDouble_dataUtama_68}' where aid = '{dataUtama_0}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_asset_category.vb`

```sql
Update M7_Asset_Category set acnama = '{FixQuotes_dataUtama_1}', ackategoripajak = '{FixQuotes_dataUtama_2}', acrekakumdepresiasi = '{FixQuotes_dataUtama_3}', acrekdepresiasi = '{FixQuotes_dataUtama_4}', acrekasset = '{FixQuotes_dataUtama_5}', acmodifikasiuser = {dataUtama_8}, acmodifikasitgl = NOW(), accustomtext1 = '{FixQuotes_dataUtama_10}', accustomtext2 = '{FixQuotes_dataUtama_11}', accustomtext3 = '{FixQuotes_dataUtama_12}', accustomtext4 = '{FixQuotes_dataUtama_13}', accustomtext5 = '{FixQuotes_dataUtama_14}', accustomint1 = {dataUtama_15}, accustomint2 = {dataUtama_16}, accustomint3 = {dataUtama_17}, accustomdbl1 = '{FixDouble_dataUtama_18}', accustomdbl2 = '{FixDouble_dataUtama_19}', accustomdbl3 = '{FixDouble_dataUtama_20}', accustomdate1 = '{FixQuotes_AsFormatTanggal_dataUtama_21}', accustomdate2 = '{FixQuotes_AsFormatTanggal_dataUtama_22}', accustomdate3 = '{FixQuotes_AsFormatTanggal_dataUtama_23}' where ackode = '{dataUtama_0}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_asset_category_tax.vb`

```sql
Update M7_Asset_Category_Tax set actnama = '{FixQuotes_dataUtama_1}', actmetode = '{FixQuotes_dataUtama_2}', actumur = '{FixDouble_dataUtama_3}', actpenyusutan = '{FixDouble_dataUtama_4}', actmodifikasiuser = {dataUtama_7}, actmodifikasitgl = NOW(), actcustomtext1 = '{FixQuotes_dataUtama_9}', actcustomtext2 = '{FixQuotes_dataUtama_10}', actcustomtext3 = '{FixQuotes_dataUtama_11}', actcustomtext4 = '{FixQuotes_dataUtama_12}', actcustomtext5 = '{FixQuotes_dataUtama_13}', actcustomint1 = {dataUtama_14}, actcustomint2 = {dataUtama_15}, actcustomint3 = {dataUtama_16}, actcustomdbl1 = '{FixDouble_dataUtama_17}', actcustomdbl2 = '{FixDouble_dataUtama_18}', actcustomdbl3 = '{FixDouble_dataUtama_19}', actcustomdate1 = '{FixQuotes_AsFormatTanggal_dataUtama_20}', actcustomdate2 = '{FixQuotes_AsFormatTanggal_dataUtama_21}', actcustomdate3 = '{FixQuotes_AsFormatTanggal_dataUtama_22}' where actkode = '{dataUtama_0}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_at.vb`

```sql
Update M7_At set atcabang = '{FixQuotes_drutama}atcabang', atlokasi = '{FixQuotes_drutama}atlokasi', atgudang = '{FixQuotes_drutama}atgudang', atsumber = '{FixQuotes_drutama}atsumber', atautonotransaksi = {drutama}atautonotransaksi, atnotransaksi = '{FixQuotes_drutama}atnotransaksi', attgl = '{FixQuotes_AsFormatTanggal_drutama}attgl', atkodepa = '{FixQuotes_drutama}atkodepa', atsupplier = '{FixQuotes_drutama}atsupplier', atsupplierkontak = '{FixQuotes_drutama}atsupplierkontak', at1alamat1 = '{FixQuotes_drutama}at1alamat1', at1alamat2 = '{FixQuotes_drutama}at1alamat2', at1alamat3 = '{FixQuotes_drutama}at1alamat3', at2alamat1 = '{FixQuotes_drutama}at2alamat1', at2alamat2 = '{FixQuotes_drutama}at2alamat2', at2alamat3 = '{FixQuotes_drutama}at2alamat3', atbagianpembayaran = '{FixQuotes_drutama}atbagianpembayaran', aturaian = '{FixQuotes_drutama}aturaian', atcatatan = '{FixQuotes_drutama}atcatatan', atnoref = '{FixQuotes_drutama}atnoref', attglnoref = '{FixQuotes_AsFormatTanggal_drutama}attglnoref', atcarabayar = {drutama}atcarabayar, attglbayar = '{FixQuotes_AsFormatTanggal_drutama}attglbayar', atmatauang = '{FixQuotes_drutama}atmatauang', atkurs = '{FixDouble_drutama}atkurs', attotalap = '{FixDouble_drutama}attotalap', attotalapvalas = '{FixDouble_drutama}attotalapvalas', atbayar = '{FixDouble_drutama}atbayar', atbayarvalas = '{FixDouble_drutama}atbayarvalas', atdiskontermin = '{FixDouble_drutama}atdiskontermin', atdiskonterminvalas = '{FixDouble_drutama}atdiskonterminvalas', atrekdiskontermin = '{FixQuotes_drutama}atrekdiskontermin', atstatus = {drutama}atstatus, atstatussebelumnya = {drutama}atstatussebelumnya, atjmlrevisi = atjmlrevisi+1, atcetakanke = {drutama}atcetakanke, atinputuser = '{FixQuotes_drutama}atinputuser', atinputtgl = '{FixQuotes_AsFormatTanggal_drutama}atinputtglyyyy-MM-dd HH:mm:ss', atmodifikasiuser = '{FixQuotes_drutama}atmodifikasiuser', atmodifikasitgl = NOW(), atposting = {drutama}atposting, atpostingtgl = '{FixQuotes_AsFormatTanggal_drutama}atpostingtglyyyy-MM-dd HH:mm:ss', atcustomtext1 = '{FixQuotes_drutama}atcustomtext1', atcustomtext2 = '{FixQuotes_drutama}atcustomtext2', atcustomtext3 = '{FixQuotes_drutama}atcustomtext3', atcustomtext4 = '{FixQuotes_drutama}atcustomtext4', atcustomtext5 = '{FixQuotes_drutama}atcustomtext5', atcustomint1 = {drutama}atcustomint1, atcustomint2 = {drutama}atcustomint2, atcustomint3 = {drutama}atcustomint3, atcustomdbl1 = '{FixDouble_drutama}atcustomdbl1', atcustomdbl2 = '{FixDouble_drutama}atcustomdbl2', atcustomdbl3 = '{FixDouble_drutama}atcustomdbl3', atcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}atcustomdate1', atcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}atcustomdate2', atcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}atcustomdate3' where atid = {drutama}atid
```

```sql
UPDATE m7_ae ae LEFT JOIN m2_transaction_journal t ON ae.aesumber = t.tsumber AND ae.aeid = t.tidtransaksi AND ae.aenotransaksi = t.tnotransaksi SET ae.aejmlbayar = (CASE ae.aeid {updNilaiAE} ELSE ae.aejmlbayar END), ae.aetgllunas = (CASE ae.aeid {updTglLunasAE} ELSE ae.aetgllunas END), t.tstatuslunas = ae.aestatuslunas, t.ttgllunas = ae.aetgllunas WHERE
```

```sql
UPDATE m7_ae ae LEFT JOIN m2_transaction_journal t ON ae.aesumber = t.tsumber AND ae.aeid = t.tidtransaksi AND ae.aenotransaksi = t.tnotransaksi SET ae.aejmlbayar = (CASE ae.aeid {updNilaiRI} ELSE ae.aejmlbayar END), ae.aetgllunas = '{FixQuotes_tglLunas}', t.tstatuslunas = ae.aestatuslunas, t.ttgllunas = ae.aetgllunas WHERE
```

```sql
UPDATE M7_At SET Atstatus = {nilaiStatus}, Atmodifikasiuser='{userid}', Atmodifikasitgl = NOW(), Atposting = 0, Atpostingtgl = '1971-01-01 00:00:00', Atjmlrevisi = Atjmlrevisi + 1 WHERE Atid = '{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_da.vb`

```sql
Update M7_Da set dacabang = '{FixQuotes_drutama}dacabang', dalokasi = '{FixQuotes_drutama}dalokasi', dagudang = '{FixQuotes_drutama}dagudang', dasumber = '{FixQuotes_drutama}dasumber', daautonotransaksi = {drutama}daautonotransaksi, danotransaksi = '{notransaksi}', datgl = '{FixQuotes_AsFormatTanggal_drutama}datgl', dakodepa = {drutama}dakodepa, damatauang = '{FixQuotes_drutama}damatauang', dakurs = '{FixDouble_drutama}dakurs', dabagianda = {drutama}dabagianda, dabagiandakontak = '{FixQuotes_drutama}dabagiandakontak', dauraian = '{FixQuotes_drutama}dauraian', dacatatan = '{FixQuotes_drutama}dacatatan', danoref = '{FixQuotes_drutama}danoref', datglnoref = '{FixQuotes_AsFormatTanggal_drutama}datglnoref', dastatus = {drutama}dastatus, dastatussebelumnya = {drutama}dastatussebelumnya, dajmlrevisi = dajmlrevisi+1, dacetakanke = {drutama}dacetakanke, damodifikasiuser = {drutama}damodifikasiuser, damodifikasitgl = NOW(), daposting = 0, datutupperiode = {drutama}datutupperiode, dacustomtext1 = '{FixQuotes_drutama}dacustomtext1', dacustomtext2 = '{FixQuotes_drutama}dacustomtext2', dacustomtext3 = '{FixQuotes_drutama}dacustomtext3', dacustomtext4 = '{FixQuotes_drutama}dacustomtext4', dacustomtext5 = '{FixQuotes_drutama}dacustomtext5', dacustomint1 = {drutama}dacustomint1, dacustomint2 = {drutama}dacustomint2, dacustomint3 = {drutama}dacustomint3, dacustomdbl1 = '{FixDouble_drutama}dacustomdbl1', dacustomdbl2 = '{FixDouble_drutama}dacustomdbl2', dacustomdbl3 = '{FixDouble_drutama}dacustomdbl3', dacustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}dacustomdate1', dacustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}dacustomdate2', dacustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}dacustomdate3' where daid = '{drutama}daid'
```

```sql
UPDATE m7_asset SET apenyusutanke = apenyusutanke + 1, aakumulasibeban = aakumulasibeban + ({Double_Parse_FixDouble_dr1}nilaipenyusutan * {Double_Parse_FixDouble_dr1}kurs), anilaibuku = anilaibuku - ({Double_Parse_FixDouble_dr1}nilaipenyusutan * {Double_Parse_FixDouble_dr1}kurs) WHERE aid = '{FixDouble_dr1}idaset'
```

```sql
UPDATE m7_asset a JOIN m7_da_detail dad ON a.aid = dad.idaset SET a.apenyusutanke = a.apenyusutanke - 1, a.aakumulasibeban = a.aakumulasibeban - (dad.nilaipenyusutan * dad.kurs), a.anilaibuku = a.anilaibuku + (dad.nilaipenyusutan * dad.kurs) WHERE dad.iddadetail = '{FixDouble_iddetail}'
```

```sql
UPDATE M7_Da SET Dastatus = {nilaiStatus}, Damodifikasiuser='{userid}', Damodifikasitgl = NOW(), Daposting = 0, Dapostingtgl = '1971-01-01 00:00:00', Dajmlrevisi = Dajmlrevisi + 1 WHERE Daid = '{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_files.vb`

```sql
UPDATE M7_files SET fcatatan = CASE fnamafile {strValue1_ToString} ELSE fcatatan END, fukuranfile = CASE fnamafile {strValue2_ToString} ELSE fukuranfile END, ftanggal = CASE fnamafile {strValue3_ToString} ELSE ftanggal END WHERE fsumber='{sumber}' AND fidtransaksi='{idtrans}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_notes.vb`

```sql
Update M7_Notes set nsumber = '{FixQuotes_dataUtama_1}', nidtransaksi = {dataUtama_2}, ncatatan = '{FixQuotes_dataUtama_3}', nmodifikasiuser = {dataUtama_6}, nmodifikasitgl = NOW() where nid = '{result_4}'
```

## DELETE

Total: `25`

### `client-backend/api-myerpplus/app_code/ws/m7/m7_ab.vb`

```sql
Delete from M7_Ab_Detail where idab =
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_ae.vb`

```sql
Delete from M7_Ae_Detail where idae =
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_ag.vb`

```sql
Delete from M7_Ag_Detail where idag =
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_ao.vb`

```sql
Delete from M7_Ao_Detail where idao =
```

```sql
DELETE FROM M7_Ao_Detail WHERE idao = '{idtransaksi}'
```

```sql
DELETE FROM M7_Ao WHERE aoid = '{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_aq.vb`

```sql
Delete from M7_Aq_Detail where idaq =
```

```sql
DELETE FROM M7_Aq_Detail WHERE idaq = '{idtransaksi}'
```

```sql
DELETE FROM M7_Aq WHERE aqid = '{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_ar.vb`

```sql
Delete from M7_Ar_Detail where idar =
```

```sql
DELETE FROM M7_Ar_Detail WHERE idar ='{idtransaksi}'
```

```sql
DELETE FROM M7_Ar WHERE arid ='{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_asset.vb`

```sql
DELETE FROM M7_Asset WHERE aid = '{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_asset_category.vb`

```sql
DELETE FROM M7_Asset_Category WHERE ackode = '{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_asset_category_tax.vb`

```sql
DELETE FROM M7_Asset_Category_Tax WHERE actkode = '{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_at.vb`

```sql
Delete from M7_At_Detail where idat =
```

```sql
Delete from M7_at_Pay where idat = '{result_4}'
```

```sql
DELETE FROM M7_At_Pay WHERE idat='{idtransaksi}'
```

```sql
DELETE FROM M7_At_Detail WHERE idat='{idtransaksi}'
```

```sql
DELETE FROM M7_At WHERE atid='{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_da.vb`

```sql
Delete from M7_Da_Detail where idda = '{result_4}'
```

```sql
DELETE FROM M7_Da_Detail WHERE idDa = '{idtransaksi}'
```

```sql
DELETE FROM M7_Da WHERE Daid = '{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_files.vb`

```sql
DELETE FROM M7_Files WHERE fsumber = '{sumber}' AND fidtransaksi ='{idtransaksi}' AND fnamafile='{namafile}'
```

### `client-backend/api-myerpplus/app_code/ws/m7/m7_notes.vb`

```sql
DELETE FROM M7_Notes WHERE nid = '{idtransaksi}'
```

