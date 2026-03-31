# M6 Queries By Type

Grouped from `m6-queries.md` by SQL statement type.

## SELECT

Total: `128`

### `client-backend/api-myerpplus/app_code/ws/m6/m6_bom.vb`

```sql
SELECT COUNT(bomid), bomnotransaksi FROM M6_bom WHERE bomid='{result_4}' AND bomstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(bomid) FROM M6_bom WHERE bomnotransaksi='{notransaksi}'
```

```sql
SELECT COUNT(bomid) FROM m6_bom WHERE bomnotransaksi='{notransaksi}'
```

```sql
select bomid from M6_bom where bomnotransaksi='{notransaksi}' AND bominputuser= '{userid}' order by bommodifikasitgl desc limit 1
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Bomtgl, Bomnotransaksi, Bomstatus FROM M6_Bom WHERE Bomid='{idtransaksi}'
```

```sql
SELECT idbarang FROM m6_bom_in WHERE idbom = '{FixDouble_idtransaksi}'
```

```sql
SELECT bom.bomid FROM m6_bom_in bomin JOIN m6_bom bom ON bomin.idbom = bom.bomid WHERE bomin.idbarang = '{idBarangHasil}' AND bom.bomstatus IN(2,3,4,7) ORDER BY bominputtgl DESC LIMIT 1
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Bomid, Bomnotransaksi FROM M6_Bom WHERE Bomid='{idtransaksi}'
```

```sql
select bom.bomid AS bomid, bom.bomcabang AS bomcabang, bom.bomlokasi AS bomlokasi, bom.bomgudangasal AS bomgudangasal, bom.bomgudangproduksi AS bomgudangproduksi, bom.bomgudangtujuan AS bomgudangtujuan, bom.bomsumber AS bomsumber, bom.bomjenis AS bomjenis, bom.bomautonotransaksi AS bomautonotransaksi, bom.bomnotransaksi AS bomnotransaksi, bom.bomtgl AS bomtgl, bom.bomkodepa AS bomkodepa, bom.bompembuat AS bompembuat, bom.bompembuatkontak AS bompembuatkontak, bom.bomestimasikerja AS bomestimasikerja, bom.bommatauang AS bommatauang, bom.bomkurs AS bomkurs, bom.bomtotalhargain AS bomtotalhargain, bom.bomtotalhargaout AS bomtotalhargaout, bom.bomtotalhppin AS bomtotalhppin, bom.bomtotalhppout AS bomtotalhppout, bom.bomuraian AS bomuraian, bom.bomcatatan AS bomcatatan, bom.bomnoref AS bomnoref, bom.bomtglnoref AS bomtglnoref, bom.bomstatus AS bomstatus, bom.bomstatussebelumnya AS bomstatussebelumnya, bom.bomjmlrevisi AS bomjmlrevisi, bom.bomcetakanke AS bomcetakanke, bom.bominputuser AS bominputuser, bom.bominputtgl AS bominputtgl, bom.bommodifikasiuser AS bommodifikasiuser, bom.bommodifikasitgl AS bommodifikasitgl, bom.bomposting AS bomposting, bom.bompostingtgl AS bompostingtgl, bom.bomcustomtext1 AS bomcustomtext1, bom.bomcustomtext2 AS bomcustomtext2, bom.bomcustomtext3 AS bomcustomtext3, bom.bomcustomtext4 AS bomcustomtext4, bom.bomcustomtext5 AS bomcustomtext5, bom.bomcustomint1 AS bomcustomint1, bom.bomcustomint2 AS bomcustomint2, bom.bomcustomint3 AS bomcustomint3, bom.bomcustomdbl1 AS bomcustomdbl1, bom.bomcustomdbl2 AS bomcustomdbl2, bom.bomcustomdbl3 AS bomcustomdbl3, bom.bomcustomdate1 AS bomcustomdate1, bom.bomcustomdate2 AS bomcustomdate2, bom.bomcustomdate3 AS bomcustomdate3, br.bnama AS bomcabangnama, lc.lnama AS bomlokasinama, wh1.wnama AS bomgudangasalnama, wh2.wnama AS bomgudangproduksinama, wh3.wnama AS bomgudangtujuannama, pc.pcnama AS bomjenisnama, c1.kkode AS bompembuatkode, c1.knama AS bompembuatnama, we.wenama AS bomestimasikerjanama, st1.nama AS bomstatusnama, st2.nama AS bomstatussebelumnyanama, u1.unama AS bominputusernama, u2.unama AS bommodifikasiusernama, bom.bomaktivitas, pa.pakode as bomaktivitaskode, pa.panama as bomaktivitasnama, pc.pcwajibwo AS bomjeniswajibwo, bomi.idbomin AS idbomin, bomi.idbom AS idbom, bomi.idbarang AS idbarang, bomi.namabarang AS namabarang, bomi.tipebarang AS tipebarang, bomi.jml AS jml, bomi.satuan AS satuan, bomi.nilaisatuan AS nilaisatuan, bomi.jmlbarang AS jmlbarang, bomi.satuanbarang AS satuanbarang, bomi.matauang AS matauang, bomi.kurs AS kurs, bomi.harga AS harga, bomi.hpppersen AS hpppersen, bomi.hpp AS hpp, i.brekpersediaan AS rekpersediaan, bomi.cabang AS cabang, bomi.lokasi AS lokasi, bomi.gudangasal AS gudangasal, bomi.gudangproduksi AS gudangproduksi, bomi.gudangtujuan AS gudangtujuan, bomi.costcenter AS costcenter, bomi.divisi AS divisi, bomi.subdivisi AS subdivisi, bomi.proyek AS proyek, bomi.catatan AS catatan, bomi.urutan AS urutan, bomi.customtext1 AS customtext1, bomi.customtext2 AS customtext2, bomi.customtext3 AS customtext3, bomi.customdbl1 AS customdbl1, bomi.customdbl2 AS customdbl2, bomi.customdbl3 AS customdbl3, bomi.customdate1 AS customdate1, bomi.customdate2 AS customdate2, bomi.customdate3 AS customdate3, i.bkode AS kodebarang, i.bhpp AS bhpp, i.bjenis AS bjenis, i.bserial AS bserial, i.bbatch AS bbatch, cc.ccnama AS costcenternama, d.dnama AS divisinama,sd.sdnama AS subdivisinama, p.pnama AS proyeknama, bom.bomnotransaksi AS notransaksi from m6_bom bom join m6_bom_in bomi on bom.bomid = bomi.idbom left join m1_branch br on bom.bomcabang = br.bkode left join m1_location lc on bom.bomlokasi = lc.lkode left join m1_warehouse wh1 on bom.bomgudangasal = wh1.wkode left join m1_warehouse wh2 on bom.bomgudangproduksi = wh2.wkode left join m1_warehouse wh3 on bom.bomgudangtujuan = wh3.wkode left join m1_production_category pc on bom.bomjenis = pc.pckode left join m1_contact c1 on bom.bompembuat = c1.kid left join m1_working_estimate we on bom.bomestimasikerja = we.wekode left join m0_status st1 on bom.bomstatus = st1.kode left join m0_status st2 on bom.bomstatussebelumnya = st2.kode left join m0_user u1 on bom.bominputuser = u1.userid left join m0_user u2 on bom.bommodifikasiuser = u2.userid left join m1_production_activity pa on bom.bomaktivitas = pa.paid left join m1_item i on bomi.idbarang = i.bid left join m1_cost_center cc on bomi.costcenter = cc.cckode left join m1_division d on bomi.divisi = d.dkode left join m1_subdivision sd on bomi.subdivisi = sd.sdkode left join m1_project p on bomi.proyek = p.pkode
```

```sql
select `bomo`.`idbomout` AS `idbomout`,`bomo`.`idbom` AS `idbom`,`bomo`.`idbarang` AS `idbarang`,`bomo`.`namabarang` AS `namabarang`,`bomo`.`tipebarang` AS `tipebarang`,`bomo`.`jml` AS `jml`,`bomo`.`satuan` AS `satuan`,`bomo`.`nilaisatuan` AS `nilaisatuan`,`bomo`.`jmlbarang` AS `jmlbarang`,`bomo`.`satuanbarang` AS `satuanbarang`,`bomo`.`matauang` AS `matauang`,`bomo`.`kurs` AS `kurs`,`bomo`.`harga` AS `harga`,`bomo`.`hpp` AS `hpp`,`bomo`.`idhppkhususmasuk` AS `idhppkhususmasuk`,`bomo`.`idhppfifomasuk` AS `idhppfifomasuk`,`i`.`brekpersediaan` AS `rekpersediaan`,`bomo`.`cabang` AS `cabang`,`bomo`.`lokasi` AS `lokasi`,`bomo`.`gudangasal` AS `gudangasal`,`bomo`.`gudangproduksi` AS `gudangproduksi`,`bomo`.`gudangtujuan` AS `gudangtujuan`,`bomo`.`costcenter` AS `costcenter`,`bomo`.`divisi` AS `divisi`,`bomo`.`subdivisi` AS `subdivisi`,`bomo`.`proyek` AS `proyek`,`bomo`.`catatan` AS `catatan`,`bomo`.`urutan` AS `urutan`,`bomo`.`customtext1` AS `customtext1`,`bomo`.`customtext2` AS `customtext2`,`bomo`.`customtext3` AS `customtext3`,`bomo`.`customdbl1` AS `customdbl1`,`bomo`.`customdbl2` AS `customdbl2`,`bomo`.`customdbl3` AS `customdbl3`,`bomo`.`customdate1` AS `customdate1`,`bomo`.`customdate2` AS `customdate2`,`bomo`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bhpp` AS `bhpp`,`i`.`bjenis` AS `bjenis`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama`,`bom`.`bomnotransaksi` AS `notransaksi`, i.bstok AS bstok, IFNULL(SUM(ib.jmlbooking),0) AS booking, IFNULL((i.bstok-SUM(ib.jmlbooking)),0) AS stokakhir from (((((((`m6_bom_out` `bomo` join `m6_bom` `bom` on((`bomo`.`idbom` = `bom`.`bomid`))) left join `m1_item` `i` on((`bomo`.`idbarang` = `i`.`bid`))) left join `m1_cost_center` `cc` on((`bomo`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`bomo`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`bomo`.`subdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`bomo`.`proyek` = `p`.`pkode`))) left join `m1_item_booking` `ib` on((`ib`.`idbarang` = bomo.idbarang)))
```

```sql
select bom.bomid AS bomid, bom.bomcabang AS bomcabang, bom.bomlokasi AS bomlokasi, bom.bomgudangasal AS bomgudangasal, bom.bomgudangproduksi AS bomgudangproduksi, bom.bomgudangtujuan AS bomgudangtujuan, bom.bomsumber AS bomsumber, bom.bomjenis AS bomjenis, bom.bomautonotransaksi AS bomautonotransaksi, bom.bomnotransaksi AS bomnotransaksi, bom.bomtgl AS bomtgl, bom.bomkodepa AS bomkodepa, bom.bompembuat AS bompembuat, bom.bompembuatkontak AS bompembuatkontak, bom.bomestimasikerja AS bomestimasikerja, bom.bommatauang AS bommatauang, bom.bomkurs AS bomkurs, bom.bomtotalhargain AS bomtotalhargain, bom.bomtotalhargaout AS bomtotalhargaout, bom.bomtotalhppin AS bomtotalhppin, bom.bomtotalhppout AS bomtotalhppout, bom.bomuraian AS bomuraian, bom.bomcatatan AS bomcatatan, bom.bomnoref AS bomnoref, bom.bomtglnoref AS bomtglnoref, bom.bomstatus AS bomstatus, bom.bomstatussebelumnya AS bomstatussebelumnya, bom.bomjmlrevisi AS bomjmlrevisi, bom.bomcetakanke AS bomcetakanke, bom.bominputuser AS bominputuser, bom.bominputtgl AS bominputtgl, bom.bommodifikasiuser AS bommodifikasiuser, bom.bommodifikasitgl AS bommodifikasitgl, bom.bomposting AS bomposting, bom.bompostingtgl AS bompostingtgl, br.bnama AS bomcabangnama, lc.lnama AS bomlokasinama, wh1.wnama AS bomgudangasalnama, wh2.wnama AS bomgudangproduksinama, wh3.wnama AS bomgudangtujuannama, pc.pcnama AS bomjenisnama, c1.kkode AS bompembuatkode, c1.knama AS bompembuatnama, we.wenama AS bomestimasikerjanama, st1.nama AS bomstatusnama, st2.nama AS bomstatussebelumnyanama, u1.unama AS bominputusernama, u2.unama AS bommodifikasiusernama, bom.bomaktivitas, pa.pakode as bomaktivitaskode, pa.panama as bomaktivitasnama from m6_bom bom left join m1_branch br on bom.bomcabang = br.bkode left join m1_location lc on bom.bomlokasi = lc.lkode left join m1_warehouse wh1 on bom.bomgudangasal = wh1.wkode left join m1_warehouse wh2 on bom.bomgudangproduksi = wh2.wkode left join m1_warehouse wh3 on bom.bomgudangtujuan = wh3.wkode left join m1_production_category pc on bom.bomjenis = pc.pckode left join m1_contact c1 on bom.bompembuat = c1.kid left join m1_working_estimate we on bom.bomestimasikerja = we.wekode left join m0_status st1 on bom.bomstatus = st1.kode left join m0_status st2 on bom.bomstatussebelumnya = st2.kode left join m0_user u1 on bom.bominputuser = u1.userid left join m0_user u2 on bom.bommodifikasiuser = u2.userid left join m1_production_activity pa on bom.bomaktivitas = pa.paid
```

```sql
select bom.bomid AS bomid, bom.bomcabang AS bomcabang, bom.bomlokasi AS bomlokasi, bom.bomgudangasal AS bomgudangasal, bom.bomgudangproduksi AS bomgudangproduksi, bom.bomgudangtujuan AS bomgudangtujuan, bom.bomsumber AS bomsumber, bom.bomjenis AS bomjenis, bom.bomautonotransaksi AS bomautonotransaksi, bom.bomnotransaksi AS bomnotransaksi, bom.bomtgl AS bomtgl, bom.bomkodepa AS bomkodepa, bom.bompembuat AS bompembuat, bom.bompembuatkontak AS bompembuatkontak, bom.bomestimasikerja AS bomestimasikerja, bom.bommatauang AS bommatauang, bom.bomkurs AS bomkurs, bom.bomtotalhargain AS bomtotalhargain, bom.bomtotalhargaout AS bomtotalhargaout, bom.bomtotalhppin AS bomtotalhppin, bom.bomtotalhppout AS bomtotalhppout, bom.bomuraian AS bomuraian, bom.bomcatatan AS bomcatatan, bom.bomnoref AS bomnoref, bom.bomtglnoref AS bomtglnoref, bom.bomstatus AS bomstatus, bom.bomstatussebelumnya AS bomstatussebelumnya, bom.bomjmlrevisi AS bomjmlrevisi, bom.bomcetakanke AS bomcetakanke, bom.bominputuser AS bominputuser, bom.bominputtgl AS bominputtgl, bom.bommodifikasiuser AS bommodifikasiuser, bom.bommodifikasitgl AS bommodifikasitgl, bom.bomposting AS bomposting, bom.bompostingtgl AS bompostingtgl, br.bnama AS bomcabangnama, lc.lnama AS bomlokasinama, wh1.wnama AS bomgudangasalnama, wh2.wnama AS bomgudangproduksinama, wh3.wnama AS bomgudangtujuannama, pc.pcnama AS bomjenisnama, c1.kkode AS bompembuatkode, c1.knama AS bompembuatnama, we.wenama AS bomestimasikerjanama, st1.nama AS bomstatusnama, st2.nama AS bomstatussebelumnyanama, u1.unama AS bominputusernama, u2.unama AS bommodifikasiusernama, bom.bomaktivitas, pa.pakode as bomaktivitaskode, pa.panama as bomaktivitasnama, i.bid, i.bkode, i.bnama from m6_bom bom join m6_bom_in bomi on bom.bomid = bomi.idbom join m1_item i on bomi.idbarang = i.bid left join m1_branch br on bom.bomcabang = br.bkode left join m1_location lc on bom.bomlokasi = lc.lkode left join m1_warehouse wh1 on bom.bomgudangasal = wh1.wkode left join m1_warehouse wh2 on bom.bomgudangproduksi = wh2.wkode left join m1_warehouse wh3 on bom.bomgudangtujuan = wh3.wkode left join m1_production_category pc on bom.bomjenis = pc.pckode left join m1_contact c1 on bom.bompembuat = c1.kid left join m1_working_estimate we on bom.bomestimasikerja = we.wekode left join m0_status st1 on bom.bomstatus = st1.kode left join m0_status st2 on bom.bomstatussebelumnya = st2.kode left join m0_user u1 on bom.bominputuser = u1.userid left join m0_user u2 on bom.bommodifikasiuser = u2.userid left join m1_production_activity pa on bom.bomaktivitas = pa.paid
```

```sql
SELECT IFNULL(SUM(jml*harga),0) as total FROM m6_itembom_in bomin WHERE
```

```sql
SELECT bjmllapangan, bsatuanlapangan, idbarang, namabarang, tipebarang, SUM(jml) as jml, satuan, nilaisatuan, SUM(nilai) as nilai, SUM(jmlbarang) as jmlbarang, satuanbarang, matauang, kurs, harga, hpp, idhppkhususmasuk, idhppfifomasuk, rekpersediaan, cabang, lokasi, gudangasal, gudangproduksi, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idbom, idbomout, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, kodebarang, bhpp, bjenis, bserial, bbatch, costcenternama, divisinama, subdivisinama, proyeknama, notransaksi, IFNULL((stokreal-stokbooking),0) AS stokakhir, IFNULL((stokreal),0) AS stokreal, hargabeli FROM ( SELECT i.bjmllapangan, i.bsatuanlapangan, ibomout.idbaranghasil, ibomout.idbarang, ibomout.namabarang, ibomout.tipebarang, (CASE {strJml} END) as jml, ibomout.satuan, ibomout.nilaisatuan, ibomout.jml * ibomout.harga as nilai, (CASE {strJmlbarang} END) as jmlbarang, ibomout.satuanbarang, ibomout.matauang, ibomout.kurs, ibomout.harga, ibomout.hpp, ibomout.idhppkhususmasuk, ibomout.idhppfifomasuk, ibomout.rekpersediaan, ibomout.cabang, ibomout.lokasi, ibomout.gudangasal, ibomout.gudangproduksi, ibomout.gudangtujuan, ibomout.costcenter, ibomout.divisi, ibomout.subdivisi, ibomout.proyek, ibomout.catatan, ibomout.urutan, ibomout.idbom, ibomout.idbomout, ibomout.customtext1, ibomout.customtext2, ibomout.customtext3, ibomout.customdbl1, ibomout.customdbl2, ibomout.customdbl3, ibomout.customdate1, ibomout.customdate2, ibomout.customdate3, i.bkode as kodebarang, i.bhpp AS bhpp, i.bjenis AS bjenis, i.bserial AS bserial, i.bbatch AS bbatch, cc.ccnama AS costcenternama, d.dnama AS divisinama, sd.sdnama AS subdivisinama, p.pnama AS proyeknama, bom.bomnotransaksi AS notransaksi, i.bstok AS stokreal, SUM(ib.jmlbooking) AS stokbooking, i.bhargabeli AS hargabeli FROM m6_itembom_out ibomout JOIN m6_itembom_in ibomin ON ibomout.idbaranghasil = ibomin.idbarang LEFT JOIN m1_item i ON ibomout.idbarang = i.bid LEFT JOIN m1_cost_center cc ON ibomout.costcenter = cc.cckode LEFT JOIN m1_division d ON ibomout.divisi = d.dkode LEFT JOIN m1_subdivision sd ON ibomout.subdivisi = sd.sdkode LEFT JOIN m1_project p ON ibomout.proyek = p.pkode LEFT JOIN m6_bom bom ON ibomout.idbom = bom.bomid LEFT JOIN m1_item_booking ib ON ibomout.idbarang = ib.idbarang WHERE {ftBarang} GROUP BY ibomout.idbarang) as bom GROUP BY idbarang, satuan
```

```sql
SELECT bjmllapangan, bsatuanlapangan, idbarang, namabarang, tipebarang, SUM(jml) as jml, satuan, nilaisatuan, SUM(nilai) as nilai, SUM(jmlbarang) as jmlbarang, satuanbarang, matauang, kurs, harga, hpp, idhppkhususmasuk, idhppfifomasuk, rekpersediaan, cabang, lokasi, gudangasal, gudangproduksi, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idbom, idbomout, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, kodebarang, bhpp, bjenis, bserial, bbatch, costcenternama, divisinama, subdivisinama, proyeknama, notransaksi, IFNULL((stokreal-stokbooking),0) AS stokakhir, IFNULL((stokreal),0) AS stokreal, hargabeli FROM ( SELECT i.bjmllapangan, i.bsatuanlapangan, ibomout.idbaranghasil, ibomout.idbarang, ibomout.namabarang, ibomout.tipebarang, (CASE {strJml} END) as jml, ibomout.satuan, ibomout.nilaisatuan, ibomout.jml * ibomout.harga as nilai, (CASE {strJmlbarang} END) as jmlbarang, ibomout.satuanbarang, ibomout.matauang, ibomout.kurs, ibomout.harga, ibomout.hpp, ibomout.idhppkhususmasuk, ibomout.idhppfifomasuk, ibomout.rekpersediaan, ibomout.cabang, ibomout.lokasi, ibomout.gudangasal, ibomout.gudangproduksi, ibomout.gudangtujuan, ibomout.costcenter, ibomout.divisi, ibomout.subdivisi, ibomout.proyek, ibomout.catatan, ibomout.urutan, ibomout.idbom, ibomout.idbomout, ibomout.customtext1, ibomout.customtext2, ibomout.customtext3, ibomout.customdbl1, ibomout.customdbl2, ibomout.customdbl3, ibomout.customdate1, ibomout.customdate2, ibomout.customdate3, i.bkode as kodebarang, i.bhpp AS bhpp, i.bjenis AS bjenis, i.bserial AS bserial, i.bbatch AS bbatch, cc.ccnama AS costcenternama, d.dnama AS divisinama, sd.sdnama AS subdivisinama, p.pnama AS proyeknama, bom.bomnotransaksi AS notransaksi, i.bstok AS stokreal, SUM(ib.jmlbooking) AS stokbooking, i.bhargabeli AS hargabeli FROM m6_itembom_out ibomout JOIN m6_bom bom ON ibomout.idbom = bom.bomid JOIN m6_itembom_in ibomin ON ibomout.idbaranghasil = ibomin.idbarang JOIN m1_item i ON ibomout.idbarang = i.bid LEFT JOIN m1_cost_center cc ON ibomout.costcenter = cc.cckode LEFT JOIN m1_division d ON ibomout.divisi = d.dkode LEFT JOIN m1_subdivision sd ON ibomout.subdivisi = sd.sdkode LEFT JOIN m1_project p ON ibomout.proyek = p.pkode LEFT JOIN m1_item_booking ib ON ibomout.idbarang = ib.idbarang WHERE {ftBarang} GROUP BY ibomout.idbomout) as bom GROUP BY idbomout, idbarang, satuan
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_bom_history.vb`

```sql
SELECT bomidhistory FROM m6_bom_history WHERE bomid = '{idtransaksi}' ORDER BY bommodifikasitgl DESC LIMIT 1
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_mrn.vb`

```sql
SELECT EXISTS(SELECT 1 FROM m6_mrs_out JOIN m6_mrs ON idmrs = mrsid WHERE idmrsout = '{idmrsout}' AND (mrsstatus = 2 OR mrsstatus = 3 OR mrsstatus = 4 OR mrsstatus = 7) LIMIT 1) as rowExists, '{idmrsout}' as idmrsout, bkode FROM m1_item WHERE bid = '{idbarang}'
```

```sql
SELECT COUNT(Mrnid), Mrnnotransaksi FROM M6_Mrn WHERE Mrnid='{result_4}' AND mrnstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(Mrnid) FROM M6_Mrn WHERE Mrnnotransaksi='{notransaksi}'
```

```sql
SELECT COUNT(Mrnid) FROM m6_mrn WHERE Mrnnotransaksi='{notransaksi}'
```

```sql
select Mrnid from M6_Mrn where Mrnnotransaksi='{notransaksi}' AND Mrninputuser= '{userid}' order by Mrnmodifikasitgl desc limit 1
```

```sql
SELECT idmrs FROM m6_mrs_out WHERE {updFilterMrsOut} GROUP BY idmrs
```

```sql
SELECT idmrs, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m6_mrs_out WHERE {ftDetail} GROUP BY idmrs
```

```sql
SELECT mrno.idmrnout, mrno.idbarang, mrno.namabarang, mrno.tipebarang, mrno.jml, mrno.satuan, mrno.jmlbarang, mrno.satuanbarang, mrno.matauang, mrno.kurs, mrno.harga, mrno.hpp, mrno.idhppkhususkeluar, mrno.gudangasal, mrno.gudangproduksi, mrno.gudangtujuan, mrno.catatan, mrno.costcenter, mrno.divisi, mrno.subdivisi, mrno.proyek, mrn.mrninputtgl, i.bhpp FROM m6_mrn_out mrno JOIN m6_mrn mrn ON mrno.idmrn = mrn.mrnid JOIN m1_item i ON mrno.idbarang = i.bid WHERE mrno.idmrn = '{result_4}'
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Mrntgl, Mrnnotransaksi, Mrnstatus FROM M6_Mrn WHERE Mrnid='{idtransaksi}'
```

```sql
SELECT idbarang, tipebarang, namabarang, satuan, nilaisatuan, jmlbarang, gudangasal, gudangproduksi, gudangtujuan, idmrsout, urutan FROM m6_mrn_out WHERE idmrn = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Mrnid, Mrnnotransaksi FROM M6_Mrn WHERE Mrnid='{idtransaksi}'
```

```sql
select mrn.mrnid AS mrnid, mrn.mrncabang AS mrncabang, mrn.mrnlokasi AS mrnlokasi, mrn.mrngudangasal AS mrngudangasal, mrn.mrngudangproduksi AS mrngudangproduksi, mrn.mrngudangtujuan AS mrngudangtujuan, mrn.mrnsumber AS mrnsumber, mrn.mrnjenis AS mrnjenis, mrn.mrnautonotransaksi AS mrnautonotransaksi, mrn.mrnnotransaksi AS mrnnotransaksi, mrn.mrntgl AS mrntgl, mrn.mrnkodepa AS mrnkodepa, mrn.mrnbagianmrn AS mrnbagianmrn, mrn.mrnbagianmrnkontak AS mrnbagianmrnkontak, mrn.mrntgldipakai AS mrntgldipakai, mrn.mrnestimasikerja AS mrnestimasikerja, mrn.mrnmatauang AS mrnmatauang, mrn.mrnkurs AS mrnkurs, mrn.mrntotalhargain AS mrntotalhargain, mrn.mrntotalhargaout AS mrntotalhargaout, mrn.mrntotalhppin AS mrntotalhppin, mrn.mrntotalhppout AS mrntotalhppout, mrn.mrnuraian AS mrnuraian, mrn.mrncatatan AS mrncatatan, mrn.mrnnoref AS mrnnoref, mrn.mrntglnoref AS mrntglnoref, mrn.mrnidbom AS mrnidbom, mrn.mrnidpdr AS mrnidpdr, mrn.mrnidwo AS mrnidwo, mrn.mrnidmrs AS mrnidmrs, mrn.mrnstatuspdin AS mrnstatuspdin, mrn.mrnstatuspdout AS mrnstatuspdout, mrn.mrnstatusrealisasiin AS mrnstatusrealisasiin, mrn.mrnstatusrealisasiout AS mrnstatusrealisasiout, mrn.mrnstatus AS mrnstatus, mrn.mrnstatussebelumnya AS mrnstatussebelumnya, mrn.mrnjmlrevisi AS mrnjmlrevisi, mrn.mrncetakanke AS mrncetakanke, mrn.mrninputuser AS mrninputuser, mrn.mrninputtgl AS mrninputtgl, mrn.mrnmodifikasiuser AS mrnmodifikasiuser, mrn.mrnmodifikasitgl AS mrnmodifikasitgl, mrn.mrnposting AS mrnposting, mrn.mrnpostingtgl AS mrnpostingtgl, mrn.mrnisclose AS mrnisclose, mrn.mrncustomtext1 AS mrncustomtext1, mrn.mrncustomtext2 AS mrncustomtext2, mrn.mrncustomtext3 AS mrncustomtext3, mrn.mrncustomtext4 AS mrncustomtext4, mrn.mrncustomtext5 AS mrncustomtext5, mrn.mrncustomint1 AS mrncustomint1, mrn.mrncustomint2 AS mrncustomint2, mrn.mrncustomint3 AS mrncustomint3, mrn.mrncustomdbl1 AS mrncustomdbl1, mrn.mrncustomdbl2 AS mrncustomdbl2, mrn.mrncustomdbl3 AS mrncustomdbl3, mrn.mrncustomdate1 AS mrncustomdate1, mrn.mrncustomdate2 AS mrncustomdate2, mrn.mrncustomdate3 AS mrncustomdate3, br.bnama AS mrncabangnama, lc.lnama AS mrnlokasinama, wh1.wnama AS mrngudangasalnama, wh2.wnama AS mrngudangproduksinama, wh3.wnama AS mrngudangtujuannama, pc.pcnama AS mrnjenisnama, c1.kkode AS mrnbagianmrnkode, c1.knama AS mrnbagianmrnnama, we.wenama AS mrnestimasikerjanama, bom.bomnotransaksi AS mrnnotransaksibom, pdr.pdrnotransaksi AS mrnnotransaksipdr, wo.wonotransaksi AS mrnnotransaksiwo, mrs.mrsnotransaksi AS mrnnotransaksimrs, st1.nama AS mrnstatusnama, st2.nama AS mrnstatussebelumnyanama, u1.unama AS mrninputusernama, u2.unama AS mrnmodifikasiusernama, mrn.mrnaktivitas, pa.pakode as mrnaktivitaskode, pa.panama as mrnaktivitasnama, pc.pcwajibwo AS mrnjeniswajibwo, mrno.idmrnout AS idmrnout, mrno.idmrn AS idmrn, mrno.idbarang AS idbarang, mrno.namabarang AS namabarang, mrno.tipebarang AS tipebarang, mrno.jml AS jml, mrno.satuan AS satuan, mrno.nilaisatuan AS nilaisatuan, mrno.jmlbarang AS jmlbarang, mrno.satuanbarang AS satuanbarang, mrno.matauang AS matauang, mrno.kurs AS kurs, mrno.harga AS harga, mrno.hpp AS hpp, mrno.idhppkhususkeluar AS idhppkhususkeluar, mrno.idhppfifokeluar AS idhppfifokeluar, i.brekpersediaan AS rekpersediaan, mrno.cabang AS cabang, mrno.lokasi AS lokasi, mrno.gudangasal AS gudangasal, mrno.gudangproduksi AS gudangproduksi, mrno.gudangtujuan AS gudangtujuan, mrno.costcenter AS costcenter, mrno.divisi AS divisi, mrno.subdivisi AS subdivisi, mrno.proyek AS proyek, mrno.catatan AS catatan, mrno.urutan AS urutan, mrno.idbomout AS idbomout, mrno.idpdrout AS idpdrout, mrno.idwoout AS idwoout, mrno.idmrsout AS idmrsout, mrno.jmlpd AS jmlpd, mrno.statuspd AS statuspd, mrno.jmlrealisasi AS jmlrealisasi, mrno.statusrealisasi AS statusrealisasi, mrno.isclose AS isclose, mrno.customtext1 AS customtext1, mrno.customtext2 AS customtext2, mrno.customtext3 AS customtext3, mrno.customdbl1 AS customdbl1, mrno.customdbl2 AS customdbl2, mrno.customdbl3 AS customdbl3, mrno.customdate1 AS customdate1, mrno.customdate2 AS customdate2, mrno.customdate3 AS customdate3, i.bkode AS kodebarang, i.bhpp AS bhpp, i.bjenis AS bjenis, i.bserial AS bserial, i.bbatch AS bbatch, cc.ccnama AS costcenternama, d.dnama AS divisinama, sd.sdnama AS subdivisinama, p.pnama AS proyeknama, mrn.mrnnotransaksi AS notransaksi, bom2.bomnotransaksi AS bomnotransaksi, pdr2.pdrnotransaksi AS pdrnotransaksi, wo2.wonotransaksi AS wonotransaksi, mrs2.mrsnotransaksi AS mrsnotransaksi, ((mrno.jmlbarang - mrno.jmlpd) / mrno.nilaisatuan) AS jmlsisapd, ((mrno.jmlbarang - mrno.jmlrealisasi) / mrno.nilaisatuan) AS jmlsisarealisasi from m6_mrn mrn join m6_mrn_out mrno on mrn.mrnid = mrno.idmrn left join m1_branch br on mrn.mrncabang = br.bkode left join m1_location lc on mrn.mrnlokasi = lc.lkode left join m1_warehouse wh1 on mrn.mrngudangasal = wh1.wkode left join m1_warehouse wh2 on mrn.mrngudangproduksi = wh2.wkode left join m1_warehouse wh3 on mrn.mrngudangtujuan = wh3.wkode left join m1_production_category pc on mrn.mrnjenis = pc.pckode left join m1_contact c1 on mrn.mrnbagianmrn = c1.kid left join m1_working_estimate we on mrn.mrnestimasikerja = we.wekode left join m6_bom bom on mrn.mrnidbom = bom.bomid left join m6_pdr pdr on mrn.mrnidpdr = pdr.pdrid left join m6_wo wo on mrn.mrnidwo = wo.woid left join m6_mrs mrs on mrn.mrnidmrs = mrs.mrsid left join m0_status st1 on mrn.mrnstatus = st1.kode left join m0_status st2 on mrn.mrnstatussebelumnya = st2.kode left join m0_user u1 on mrn.mrninputuser = u1.userid left join m0_user u2 on mrn.mrnmodifikasiuser = u2.userid left join m1_production_activity pa on mrn.mrnaktivitas = pa.paid left join m1_item i on mrno.idbarang = i.bid left join m1_cost_center cc on mrno.costcenter = cc.cckode left join m1_division d on mrno.divisi = d.dkode left join m1_subdivision sd on mrno.subdivisi = sd.sdkode left join m1_project p on mrno.proyek = p.pkode left join m6_bom_out bomo on mrno.idbomout = bomo.idbomout left join m6_bom bom2 on bomo.idbom = bom2.bomid left join m6_pdr_out pdro on mrno.idpdrout = pdro.idpdrout left join m6_pdr pdr2 on pdro.idpdr = pdr2.pdrid left join m6_wo_out woo on mrno.idwoout = woo.idwoout left join m6_wo wo2 on woo.idwo = wo2.woid left join m6_mrs_out mrso on mrno.idmrsout = mrso.idmrsout left join m6_mrs mrs2 on mrso.idmrs = mrs2.mrsid
```

```sql
select mrn.mrnid AS mrnid, mrn.mrncabang AS mrncabang, mrn.mrnlokasi AS mrnlokasi, mrn.mrngudangasal AS mrngudangasal, mrn.mrngudangproduksi AS mrngudangproduksi, mrn.mrngudangtujuan AS mrngudangtujuan, mrn.mrnsumber AS mrnsumber, mrn.mrnjenis AS mrnjenis, mrn.mrnautonotransaksi AS mrnautonotransaksi, mrn.mrnnotransaksi AS mrnnotransaksi, mrn.mrntgl AS mrntgl, mrn.mrnkodepa AS mrnkodepa, mrn.mrnbagianmrn AS mrnbagianmrn, mrn.mrnbagianmrnkontak AS mrnbagianmrnkontak, mrn.mrntgldipakai AS mrntgldipakai, mrn.mrnestimasikerja AS mrnestimasikerja, mrn.mrnmatauang AS mrnmatauang, mrn.mrnkurs AS mrnkurs, mrn.mrntotalhargain AS mrntotalhargain, mrn.mrntotalhargaout AS mrntotalhargaout, mrn.mrntotalhppin AS mrntotalhppin, mrn.mrntotalhppout AS mrntotalhppout, mrn.mrnuraian AS mrnuraian, mrn.mrncatatan AS mrncatatan, mrn.mrnnoref AS mrnnoref, mrn.mrntglnoref AS mrntglnoref, mrn.mrnidbom AS mrnidbom, mrn.mrnidpdr AS mrnidpdr, mrn.mrnidwo AS mrnidwo, mrn.mrnidmrs AS mrnidmrs, mrn.mrnstatuspdin AS mrnstatuspdin, mrn.mrnstatuspdout AS mrnstatuspdout, mrn.mrnstatusrealisasiin AS mrnstatusrealisasiin, mrn.mrnstatusrealisasiout AS mrnstatusrealisasiout, mrn.mrnstatus AS mrnstatus, mrn.mrnstatussebelumnya AS mrnstatussebelumnya, mrn.mrnjmlrevisi AS mrnjmlrevisi, mrn.mrncetakanke AS mrncetakanke, mrn.mrninputuser AS mrninputuser, mrn.mrninputtgl AS mrninputtgl, mrn.mrnmodifikasiuser AS mrnmodifikasiuser, mrn.mrnmodifikasitgl AS mrnmodifikasitgl, mrn.mrnposting AS mrnposting, mrn.mrnpostingtgl AS mrnpostingtgl, mrn.mrnisclose AS mrnisclose, br.bnama AS mrncabangnama, lc.lnama AS mrnlokasinama, wh1.wnama AS mrngudangasalnama, wh2.wnama AS mrngudangproduksinama, wh3.wnama AS mrngudangtujuannama, pc.pcnama AS mrnjenisnama, c1.kkode AS mrnbagianmrnkode, c1.knama AS mrnbagianmrnnama, we.wenama AS mrnestimasikerjanama, bom.bomnotransaksi AS mrnnotransaksibom, pdr.pdrnotransaksi AS mrnnotransaksipdr, wo.wonotransaksi AS mrnnotransaksiwo, mrs.mrsnotransaksi AS mrnnotransaksimrs, st1.nama AS mrnstatusnama, st2.nama AS mrnstatussebelumnyanama, u1.unama AS mrninputusernama, u2.unama AS mrnmodifikasiusernama, mrn.mrnaktivitas, pa.pakode as mrnaktivitaskode, pa.panama as mrnaktivitasnama from m6_mrn mrn left join m1_branch br on mrn.mrncabang = br.bkode left join m1_location lc on mrn.mrnlokasi = lc.lkode left join m1_warehouse wh1 on mrn.mrngudangasal = wh1.wkode left join m1_warehouse wh2 on mrn.mrngudangproduksi = wh2.wkode left join m1_warehouse wh3 on mrn.mrngudangtujuan = wh3.wkode left join m1_production_category pc on mrn.mrnjenis = pc.pckode left join m1_contact c1 on mrn.mrnbagianmrn = c1.kid left join m1_working_estimate we on mrn.mrnestimasikerja = we.wekode left join m6_bom bom on mrn.mrnidbom = bom.bomid left join m6_pdr pdr on mrn.mrnidpdr = pdr.pdrid left join m6_wo wo on mrn.mrnidwo = wo.woid left join m6_mrs mrs on mrn.mrnidmrs = mrs.mrsid left join m0_status st1 on mrn.mrnstatus = st1.kode left join m0_status st2 on mrn.mrnstatussebelumnya = st2.kode left join m0_user u1 on mrn.mrninputuser = u1.userid left join m0_user u2 on mrn.mrnmodifikasiuser = u2.userid left join m1_production_activity pa on mrn.mrnaktivitas = pa.paid
```

```sql
SELECT mrsout.idmrsout, (mrsout.jmlbarang - mrsout.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m6_mrs_out AS mrsout INNER JOIN m1_item AS i ON mrsout.idbarang = i.bid WHERE
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_mrn_history.vb`

```sql
SELECT mrnidhistory FROM m6_mrn_history WHERE mrnid = '{idtransaksi}' ORDER BY mrnmodifikasitgl DESC LIMIT 1
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_mrs.vb`

```sql
SELECT costcenter FROM m6_wo_in woin WHERE woin.costcenter <> '' AND woin.idwo = '{FixDouble_dataUtama_28}'
```

```sql
SELECT EXISTS(SELECT 1 FROM m6_wo_out JOIN m6_wo ON idwo = woid WHERE idwoout = '{idwoout}' AND (wostatus = 2 OR wostatus = 3 OR wostatus = 4 OR wostatus = 7) LIMIT 1) as rowExists, '{idwoout}' as idwoout, bkode FROM m1_item WHERE bid = '{idbarang}'
```

```sql
SELECT COUNT(mrsid), mrsnotransaksi FROM M6_mrs WHERE mrsid='{result_4}' AND mrsstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(mrsid) FROM M6_mrs WHERE mrsnotransaksi='{notransaksi}'
```

```sql
SELECT COUNT(mrsid) FROM m6_mrs WHERE mrsnotransaksi='{notransaksi}'
```

```sql
select mrsid from M6_mrs where mrsnotransaksi='{notransaksi}' AND mrsinputuser= '{userid}' order by mrsmodifikasitgl desc limit 1
```

```sql
SELECT idwo FROM m6_wo_out WHERE {updFilterWoOut} GROUP BY idwo
```

```sql
SELECT idwo, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m6_wo_out WHERE {ftDetail} GROUP BY idwo
```

```sql
SELECT mrso.idmrsout, mrso.idbarang, mrso.namabarang, mrso.tipebarang, mrso.jml, mrso.satuan, mrso.jmlbarang, mrso.satuanbarang, mrso.matauang, mrso.kurs, mrso.harga, mrso.hpp, mrso.idhppkhususmasuk, mrso.gudangasal, mrso.gudangproduksi, mrso.gudangtujuan, mrso.catatan, mrso.costcenter, mrso.divisi, mrso.subdivisi, mrso.proyek, mrs.mrsinputtgl, i.bhpp FROM m6_mrs_out mrso JOIN m6_mrs mrs ON mrso.idmrs = mrs.mrsid JOIN m1_item i ON mrso.idbarang = i.bid WHERE mrso.idmrs = '{result_4}'
```

```sql
SELECT mrso.idmrsout, mrso.idbarang, mrso.namabarang, mrso.tipebarang, mrso.jml, mrso.satuan, mrso.jmlbarang, mrso.satuanbarang, mrso.matauang, mrso.kurs, mrso.harga, mrso.hpp, mrso.idhppkhususmasuk, mrso.gudangasal, mrso.gudangproduksi, mrso.gudangtujuan, mrso.catatan, mrso.costcenter, mrso.divisi, mrso.subdivisi, mrso.proyek, mrs.mrsinputtgl, i.bhpp, (CASE LENGTH(IFNULL(cc.ccakun,'')) WHEN 0 THEN 1 ELSE 0 END) as transbarang FROM m6_mrs_out mrso JOIN m6_mrs mrs ON mrso.idmrs = mrs.mrsid JOIN m1_item i ON mrso.idbarang = i.bid LEFT JOIN m1_cost_center cc ON mrso.costcenter = cc.cckode WHERE mrso.idmrs = '{result_4}'
```

```sql
SELECT moduleid, menuid, 0, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Mrstgl, Mrsnotransaksi, Mrsstatus, Mrsidwo FROM M6_Mrs WHERE Mrsid='{idtransaksi}'
```

```sql
SELECT mrsid FROM m6_mrs WHERE mrsstatus IN(2,3,4,7) AND mrsid <> '{FixDouble_idtransaksi}' AND mrsidwo = '{FixDouble_vIdWo}';
```

```sql
SELECT idbarang, tipebarang, namabarang, satuan, nilaisatuan, jmlbarang, gudangasal, gudangproduksi, idpdrout, idwoout, urutan FROM m6_mrs_out WHERE idmrs = '{idtransaksi}'
```

```sql
SELECT idbarang, tipebarang, namabarang, satuan, nilaisatuan, jmlbarang, gudangasal, gudangproduksi, idpdrout, idwoout, urutan, idhppkhususmasuk, idmrsout, (CASE LENGTH(IFNULL(cc.ccakun,'')) WHEN 0 THEN 1 ELSE 0 END) as transbarang FROM m6_mrs_out mrso LEFT JOIN m1_cost_center cc ON mrso.costcenter = cc.cckode WHERE idmrs = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Mrsid, Mrsnotransaksi FROM M6_Mrs WHERE Mrsid='{idtransaksi}'
```

```sql
select mrs.mrsid AS mrsid, mrs.mrscabang AS mrscabang, mrs.mrslokasi AS mrslokasi, mrs.mrsgudangasal AS mrsgudangasal, mrs.mrsgudangproduksi AS mrsgudangproduksi, mrs.mrsgudangtujuan AS mrsgudangtujuan, mrs.mrssumber AS mrssumber, mrs.mrsjenis AS mrsjenis, mrs.mrsautonotransaksi AS mrsautonotransaksi, mrs.mrsnotransaksi AS mrsnotransaksi, mrs.mrstgl AS mrstgl, mrs.mrskodepa AS mrskodepa, mrs.mrsbagianmrs AS mrsbagianmrs, mrs.mrsbagianmrskontak AS mrsbagianmrskontak, mrs.mrstgldipakai AS mrstgldipakai, mrs.mrsestimasikerja AS mrsestimasikerja, mrs.mrsmatauang AS mrsmatauang, mrs.mrskurs AS mrskurs, mrs.mrstotalhargain AS mrstotalhargain, mrs.mrstotalhargaout AS mrstotalhargaout, mrs.mrstotalhppin AS mrstotalhppin, mrs.mrstotalhppout AS mrstotalhppout, mrs.mrsuraian AS mrsuraian, mrs.mrscatatan AS mrscatatan, mrs.mrsnoref AS mrsnoref, mrs.mrstglnoref AS mrstglnoref, mrs.mrsidbom AS mrsidbom, mrs.mrsidpdr AS mrsidpdr, mrs.mrsidwo AS mrsidwo, mrs.mrsstatusmrnin AS mrsstatusmrnin, mrs.mrsstatusmrnout AS mrsstatusmrnout, mrs.mrsstatuspdin AS mrsstatuspdin, mrs.mrsstatuspdout AS mrsstatuspdout, mrs.mrsstatusrealisasiin AS mrsstatusrealisasiin, mrs.mrsstatusrealisasiout AS mrsstatusrealisasiout, mrs.mrsstatus AS mrsstatus, mrs.mrsstatussebelumnya AS mrsstatussebelumnya, mrs.mrsjmlrevisi AS mrsjmlrevisi, mrs.mrscetakanke AS mrscetakanke, mrs.mrsinputuser AS mrsinputuser, mrs.mrsinputtgl AS mrsinputtgl, mrs.mrsmodifikasiuser AS mrsmodifikasiuser, mrs.mrsmodifikasitgl AS mrsmodifikasitgl, mrs.mrsposting AS mrsposting, mrs.mrspostingtgl AS mrspostingtgl, mrs.mrsisclose AS mrsisclose, mrs.mrscustomtext1 AS mrscustomtext1, mrs.mrscustomtext2 AS mrscustomtext2, mrs.mrscustomtext3 AS mrscustomtext3, mrs.mrscustomtext4 AS mrscustomtext4, mrs.mrscustomtext5 AS mrscustomtext5, mrs.mrscustomint1 AS mrscustomint1, mrs.mrscustomint2 AS mrscustomint2, mrs.mrscustomint3 AS mrscustomint3, mrs.mrscustomdbl1 AS mrscustomdbl1, mrs.mrscustomdbl2 AS mrscustomdbl2, mrs.mrscustomdbl3 AS mrscustomdbl3, mrs.mrscustomdate1 AS mrscustomdate1, mrs.mrscustomdate2 AS mrscustomdate2, mrs.mrscustomdate3 AS mrscustomdate3, br.bnama AS mrscabangnama, lc.lnama AS mrslokasinama, wh1.wnama AS mrsgudangasalnama, wh2.wnama AS mrsgudangproduksinama, wh3.wnama AS mrsgudangtujuannama, pc.pcnama AS mrsjenisnama, c1.kkode AS mrsbagianmrskode, c1.knama AS mrsbagianmrsnama, we.wenama AS mrsestimasikerjanama, bom.bomnotransaksi AS mrsnotransaksibom, pdr.pdrnotransaksi AS mrsnotransaksipdr, wo.wonotransaksi AS mrsnotransaksiwo, st1.nama AS mrsstatusnama, st2.nama AS mrsstatussebelumnyanama, u1.unama AS mrsinputusernama, u2.unama AS mrsmodifikasiusernama, mrs.mrsaktivitas, pa.pakode as mrsaktivitaskode, pa.panama as mrsaktivitasnama, pc.pcwajibwo AS mrsjeniswajibwo, mrso.idmrsout AS idmrsout, mrso.idmrs AS idmrs, mrso.idbarang AS idbarang, mrso.namabarang AS namabarang, mrso.tipebarang AS tipebarang, mrso.jml AS jml, mrso.satuan AS satuan, mrso.nilaisatuan AS nilaisatuan, mrso.jmlbarang AS jmlbarang, mrso.satuanbarang AS satuanbarang, mrso.matauang AS matauang, mrso.kurs AS kurs, mrso.harga AS harga, mrso.hpp AS hpp, mrso.idhppkhususmasuk AS idhppkhususmasuk, mrso.idhppfifomasuk AS idhppfifomasuk, i.brekpersediaan AS rekpersediaan, mrso.cabang AS cabang, mrso.lokasi AS lokasi, mrso.gudangasal AS gudangasal, mrso.gudangproduksi AS gudangproduksi, mrso.gudangtujuan AS gudangtujuan, mrso.costcenter AS costcenter, mrso.divisi AS divisi, mrso.subdivisi AS subdivisi, mrso.proyek AS proyek, mrso.catatan AS catatan, mrso.urutan AS urutan, mrso.idbomout AS idbomout, mrso.idpdrout AS idpdrout, mrso.idwoout AS idwoout, mrso.jmlmrn AS jmlmrn, mrso.statusmrn AS statusmrn, mrso.jmlpd AS jmlpd, mrso.statuspd AS statuspd, mrso.jmlrealisasi AS jmlrealisasi, mrso.statusrealisasi AS statusrealisasi, mrso.isclose AS isclose, mrso.customtext1 AS customtext1, mrso.customtext2 AS customtext2, mrso.customtext3 AS customtext3, mrso.customdbl1 AS customdbl1, mrso.customdbl2 AS customdbl2, mrso.customdbl3 AS customdbl3, mrso.customdate1 AS customdate1, mrso.customdate2 AS customdate2, mrso.customdate3 AS customdate3, i.bkode AS kodebarang, i.bhpp AS bhpp, i.bjenis AS bjenis, i.bserial AS bserial, i.bbatch AS bbatch, cc.ccnama AS costcenternama, d.dnama AS divisinama, sd.sdnama AS subdivisinama, p.pnama AS proyeknama, mrs.mrsnotransaksi AS notransaksi, bom2.bomnotransaksi AS bomnotransaksi, pdr2.pdrnotransaksi AS pdrnotransaksi, wo2.wonotransaksi AS wonotransaksi, 0 AS idhppkhususkeluar, 0 AS idhppfifokeluar, ((mrso.jmlbarang - mrso.jmlmrn) / mrso.nilaisatuan) AS jmlsisamrn, ((mrso.jmlbarang - mrso.jmlpd) / mrso.nilaisatuan) AS jmlsisapd, ((mrso.jmlbarang - mrso.jmlrealisasi) / mrso.nilaisatuan) AS jmlsisarealisasi from m6_mrs mrs join m6_mrs_out mrso on mrs.mrsid = mrso.idmrs left join m1_branch br on mrs.mrscabang = br.bkode left join m1_location lc on mrs.mrslokasi = lc.lkode left join m1_warehouse wh1 on mrs.mrsgudangasal = wh1.wkode left join m1_warehouse wh2 on mrs.mrsgudangproduksi = wh2.wkode left join m1_warehouse wh3 on mrs.mrsgudangtujuan = wh3.wkode left join m1_production_category pc on mrs.mrsjenis = pc.pckode left join m1_contact c1 on mrs.mrsbagianmrs = c1.kid left join m1_working_estimate we on mrs.mrsestimasikerja = we.wekode left join m6_bom bom on mrs.mrsidbom = bom.bomid left join m6_pdr pdr on mrs.mrsidpdr = pdr.pdrid left join m6_wo wo on mrs.mrsidwo = wo.woid left join m0_status st1 on mrs.mrsstatus = st1.kode left join m0_status st2 on mrs.mrsstatussebelumnya = st2.kode left join m0_user u1 on mrs.mrsinputuser = u1.userid left join m0_user u2 on mrs.mrsmodifikasiuser = u2.userid left join m1_production_activity pa on mrs.mrsaktivitas = pa.paid left join m1_item i on mrso.idbarang = i.bid left join m1_cost_center cc on mrso.costcenter = cc.cckode left join m1_division d on mrso.divisi = d.dkode left join m1_subdivision sd on mrso.subdivisi = sd.sdkode left join m1_project p on mrso.proyek = p.pkode left join m6_bom_out bomo on mrso.idbomout = bomo.idbomout left join m6_bom bom2 on bomo.idbom = bom2.bomid left join m6_pdr_out pdro on mrso.idpdrout = pdro.idpdrout left join m6_pdr pdr2 on pdro.idpdr = pdr2.pdrid left join m6_wo_out woo on mrso.idwoout = woo.idwoout left join m6_wo wo2 on woo.idwo = wo2.woid
```

```sql
select mrs.mrsid AS mrsid, mrs.mrscabang AS mrscabang, mrs.mrslokasi AS mrslokasi, mrs.mrsgudangasal AS mrsgudangasal, mrs.mrsgudangproduksi AS mrsgudangproduksi, mrs.mrsgudangtujuan AS mrsgudangtujuan, mrs.mrssumber AS mrssumber, mrs.mrsjenis AS mrsjenis, mrs.mrsautonotransaksi AS mrsautonotransaksi, mrs.mrsnotransaksi AS mrsnotransaksi, mrs.mrstgl AS mrstgl, mrs.mrskodepa AS mrskodepa, mrs.mrsbagianmrs AS mrsbagianmrs, mrs.mrsbagianmrskontak AS mrsbagianmrskontak, mrs.mrstgldipakai AS mrstgldipakai, mrs.mrsestimasikerja AS mrsestimasikerja, mrs.mrsmatauang AS mrsmatauang, mrs.mrskurs AS mrskurs, mrs.mrstotalhargain AS mrstotalhargain, mrs.mrstotalhargaout AS mrstotalhargaout, mrs.mrstotalhppin AS mrstotalhppin, mrs.mrstotalhppout AS mrstotalhppout, mrs.mrsuraian AS mrsuraian, mrs.mrscatatan AS mrscatatan, mrs.mrsnoref AS mrsnoref, mrs.mrstglnoref AS mrstglnoref, mrs.mrsidbom AS mrsidbom, mrs.mrsidpdr AS mrsidpdr, mrs.mrsidwo AS mrsidwo, mrs.mrsstatusmrnin AS mrsstatusmrnin, mrs.mrsstatusmrnout AS mrsstatusmrnout, mrs.mrsstatuspdin AS mrsstatuspdin, mrs.mrsstatuspdout AS mrsstatuspdout, mrs.mrsstatusrealisasiin AS mrsstatusrealisasiin, mrs.mrsstatusrealisasiout AS mrsstatusrealisasiout, mrs.mrsstatus AS mrsstatus, mrs.mrsstatussebelumnya AS mrsstatussebelumnya, mrs.mrsjmlrevisi AS mrsjmlrevisi, mrs.mrscetakanke AS mrscetakanke, mrs.mrsinputuser AS mrsinputuser, mrs.mrsinputtgl AS mrsinputtgl, mrs.mrsmodifikasiuser AS mrsmodifikasiuser, mrs.mrsmodifikasitgl AS mrsmodifikasitgl, mrs.mrsposting AS mrsposting, mrs.mrspostingtgl AS mrspostingtgl, mrs.mrsisclose AS mrsisclose, br.bnama AS mrscabangnama, lc.lnama AS mrslokasinama, wh1.wnama AS mrsgudangasalnama, wh2.wnama AS mrsgudangproduksinama, wh3.wnama AS mrsgudangtujuannama, pc.pcnama AS mrsjenisnama, c1.kkode AS mrsbagianmrskode, c1.knama AS mrsbagianmrsnama, we.wenama AS mrsestimasikerjanama, bom.bomnotransaksi AS mrsnotransaksibom, pdr.pdrnotransaksi AS mrsnotransaksipdr, wo.wonotransaksi AS mrsnotransaksiwo, st1.nama AS mrsstatusnama, st2.nama AS mrsstatussebelumnyanama, u1.unama AS mrsinputusernama, u2.unama AS mrsmodifikasiusernama, mrs.mrsaktivitas,pa.pakode as mrsaktivitaskode, pa.panama as mrsaktivitasnama from m6_mrs mrs left join m1_branch br on mrs.mrscabang = br.bkode left join m1_location lc on mrs.mrslokasi = lc.lkode left join m1_warehouse wh1 on mrs.mrsgudangasal = wh1.wkode left join m1_warehouse wh2 on mrs.mrsgudangproduksi = wh2.wkode left join m1_warehouse wh3 on mrs.mrsgudangtujuan = wh3.wkode left join m1_production_category pc on mrs.mrsjenis = pc.pckode left join m1_contact c1 on mrs.mrsbagianmrs = c1.kid left join m1_working_estimate we on mrs.mrsestimasikerja = we.wekode left join m6_bom bom on mrs.mrsidbom = bom.bomid left join m6_pdr pdr on mrs.mrsidpdr = pdr.pdrid left join m6_wo wo on mrs.mrsidwo = wo.woid left join m0_status st1 on mrs.mrsstatus = st1.kode left join m0_status st2 on mrs.mrsstatussebelumnya = st2.kode left join m0_user u1 on mrs.mrsinputuser = u1.userid left join m0_user u2 on mrs.mrsmodifikasiuser = u2.userid left join m1_production_activity pa on mrs.mrsaktivitas = pa.paid
```

```sql
SELECT woout.idwoout, (woout.jmlbarang - woout.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m6_wo_out AS woout INNER JOIN m1_item AS i ON woout.idbarang = i.bid WHERE
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Mrstgl, Mrsnotransaksi, Mrsstatus FROM M6_Mrs WHERE Mrsid='{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_mrs_history.vb`

```sql
SELECT mrsidhistory FROM m6_mrs_history WHERE mrsid = '{idtransaksi}' ORDER BY mrsmodifikasitgl DESC LIMIT 1
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_notes.vb`

```sql
SELECT COUNT(nid) FROM M6_Notes WHERE nid='{result_4}'
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_pd.vb`

```sql
SELECT EXISTS(SELECT 1 FROM m6_wo_in JOIN m6_wo ON idwo = woid WHERE idwoin = '{idwoin}' AND (wostatus = 2 OR wostatus = 3 OR wostatus = 4 OR wostatus = 7) LIMIT 1) as rowExists, '{idwoin}' as idwoin, bkode FROM m1_item WHERE bid = '{idbarang}'
```

```sql
SELECT EXISTS(SELECT 1 FROM m6_mrs_out JOIN m6_mrs ON idmrs = mrsid WHERE idmrsout = '{idmrsout}' AND (mrsstatus = 2 OR mrsstatus = 3 OR mrsstatus = 4 OR mrsstatus = 7) LIMIT 1) as rowExists, '{idmrsout}' as idmrsout, bkode FROM m1_item WHERE bid = '{idbarang}'
```

```sql
SELECT COUNT(Pdid), Pdnotransaksi FROM M6_Pd WHERE Pdid='{result_4}' AND pdstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(Pdid) FROM M6_Pd WHERE Pdnotransaksi='{notransaksi}'
```

```sql
SELECT COUNT(Pdid) FROM m6_pd WHERE Pdnotransaksi='{notransaksi}'
```

```sql
select Pdid from M6_Pd where Pdnotransaksi='{notransaksi}' AND Pdinputuser= '{userid}' order by Pdmodifikasitgl desc limit 1
```

```sql
SELECT idwo FROM m6_wo_in WHERE {updFilterWoIn} GROUP BY idwo
```

```sql
SELECT idwo, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m6_wo_in WHERE {ftDetail} GROUP BY idwo
```

```sql
SELECT idmrs FROM m6_mrs_out WHERE {updFilterMrsOut} GROUP BY idmrs
```

```sql
SELECT idmrs, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m6_mrs_out WHERE {ftDetail} GROUP BY idmrs
```

```sql
SELECT pdo.idpdout, pdo.idbarang, pdo.namabarang, pdo.tipebarang, pdo.jml, pdo.satuan, pdo.jmlbarang, pdo.satuanbarang, pdo.matauang, pdo.kurs, pdo.harga, pdo.hpp, pdo.idhppkhususmasuk, pdo.gudangasal, pd.pdgudangproduksi as gudangproduksi, pdo.gudangtujuan, pdo.catatan, pdo.costcenter, pdo.divisi, pdo.subdivisi, pdo.proyek, pd.pdinputtgl, i.bhpp, (CASE LENGTH(IFNULL(cc.ccakun,'')) WHEN 0 THEN 1 ELSE 0 END) as transbarang FROM m6_pd_out pdo JOIN m6_pd pd ON pdo.idpd = pd.pdid JOIN m1_item i ON pdo.idbarang = i.bid LEFT JOIN m1_cost_center cc ON pdo.costcenter = cc.cckode WHERE pdo.idpd = '{result_4}'
```

```sql
SELECT pdi.idpdin, pdi.idbarang, pdi.namabarang, pdi.tipebarang, pdi.jml, pdi.satuan, pdi.jmlbarang, pdi.satuanbarang, pdi.matauang, pdi.kurs, pdi.harga, pdi.hpp, pdi.gudangasal, pd.pdgudangproduksi as gudangproduksi, pdi.gudangtujuan, pdi.catatan, pdi.costcenter, pdi.divisi, pdi.subdivisi, pdi.proyek, pd.pdinputtgl, i.bhpp, (CASE LENGTH(IFNULL(cc.ccakun,'')) WHEN 0 THEN 1 ELSE 0 END) as transbarang FROM m6_pd_in pdi JOIN m6_pd pd ON pdi.idpd = pd.pdid JOIN m1_item i ON pdi.idbarang = i.bid LEFT JOIN m1_cost_center cc ON pdi.costcenter = cc.cckode WHERE pdi.idpd = '{result_4}'
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Pdtgl, Pdnotransaksi, Pdstatus FROM M6_Pd WHERE Pdid='{idtransaksi}'
```

```sql
SELECT idpdin, idbarang, tipebarang, namabarang, satuan, nilaisatuan, jmlbarang, gudangproduksi, gudangtujuan, idwoin, urutan, (CASE LENGTH(IFNULL(cc.ccakun,'')) WHEN 0 THEN 1 ELSE 0 END) as transbarang FROM m6_pd_in pdi LEFT JOIN m1_cost_center cc ON pdi.costcenter = cc.cckode WHERE idpd = '{idtransaksi}'
```

```sql
SELECT idpdout, idbarang, tipebarang, namabarang, satuan, nilaisatuan, jmlbarang, idhppkhususmasuk, gudangproduksi, gudangtujuan, idmrsout, urutan, (CASE LENGTH(IFNULL(cc.ccakun,'')) WHEN 0 THEN 1 ELSE 0 END) as transbarang FROM m6_pd_out pdo LEFT JOIN m1_cost_center cc ON pdo.costcenter = cc.cckode WHERE idpd = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Pdid, Pdnotransaksi FROM M6_Pd WHERE Pdid='{idtransaksi}'
```

```sql
select pd.pdid AS pdid, pd.pdcabang AS pdcabang, pd.pdlokasi AS pdlokasi, pd.pdgudangasal AS pdgudangasal,pd.pdgudangproduksi AS pdgudangproduksi, pd.pdgudangtujuan AS pdgudangtujuan, pd.pdsumber AS pdsumber, pd.pdjenis AS pdjenis, pd.pdautonotransaksi AS pdautonotransaksi, pd.pdnotransaksi AS pdnotransaksi, pd.pdtgl AS pdtgl, pd.pdkodepa AS pdkodepa, pd.pdbagianpd AS pdbagianpd, pd.pdbagianpdkontak AS pdbagianpdkontak, pd.pdtgldipakai AS pdtgldipakai, pd.pdestimasikerja AS pdestimasikerja, pd.pdmatauang AS pdmatauang, pd.pdkurs AS pdkurs, pd.pdtotalhargain AS pdtotalhargain, pd.pdtotalhargaout AS pdtotalhargaout, pd.pdtotalhppin AS pdtotalhppin, pd.pdtotalhppout AS pdtotalhppout, pd.pduraian AS pduraian, pd.pdcatatan AS pdcatatan, pd.pdnoref AS pdnoref, pd.pdtglnoref AS pdtglnoref, pd.pdidbom AS pdidbom, pd.pdidpdr AS pdidpdr, pd.pdidwo AS pdidwo, pd.pdidmrs AS pdidmrs, pd.pdidmrn AS pdidmrn, pd.pdstatus AS pdstatus, pd.pdstatussebelumnya AS pdstatussebelumnya, pd.pdjmlrevisi AS pdjmlrevisi, pd.pdcetakanke AS pdcetakanke, pd.pdinputuser AS pdinputuser, pd.pdinputtgl AS pdinputtgl, pd.pdmodifikasiuser AS pdmodifikasiuser, pd.pdmodifikasitgl AS pdmodifikasitgl, pd.pdposting AS pdposting, pd.pdpostingtgl AS pdpostingtgl, pd.pdtutupperiode AS pdtutupperiode, pd.pdisclose AS pdisclose, pd.pdcustomtext1 AS pdcustomtext1, pd.pdcustomtext2 AS pdcustomtext2, pd.pdcustomtext3 AS pdcustomtext3, pd.pdcustomtext4 AS pdcustomtext4, pd.pdcustomtext5 AS pdcustomtext5, pd.pdcustomint1 AS pdcustomint1, pd.pdcustomint2 AS pdcustomint2, pd.pdcustomint3 AS pdcustomint3, pd.pdcustomdbl1 AS pdcustomdbl1, pd.pdcustomdbl2 AS pdcustomdbl2, pd.pdcustomdbl3 AS pdcustomdbl3, pd.pdcustomdate1 AS pdcustomdate1, pd.pdcustomdate2 AS pdcustomdate2, pd.pdcustomdate3 AS pdcustomdate3, br.bnama AS pdcabangnama, lc.lnama AS pdlokasinama, wh1.wnama AS pdgudangasalnama, wh2.wnama AS pdgudangproduksinama, wh3.wnama AS pdgudangtujuannama, pc.pcnama AS pdjenisnama, pc.pcwajibwo AS pdjeniswajibwo, c1.kkode AS pdbagianpdkode, c1.knama AS pdbagianpdnama, we.wenama AS pdestimasikerjanama, bom.bomnotransaksi AS pdnotransaksibom, pdr.pdrnotransaksi AS pdnotransaksipdr, wo.wonotransaksi AS pdnotransaksiwo, mrs.mrsnotransaksi AS pdnotransaksimrs, mrn.mrnnotransaksi AS pdnotransaksimrn, st1.nama AS pdstatusnama, st2.nama AS pdstatussebelumnyanama, u1.unama AS pdinputusernama, u2.unama AS pdmodifikasiusernama, pd.pdaktivitas,pa.pakode as pdaktivitaskode,pa.panama as pdaktivitasnama,pdi.idpdin AS idpdin, pdi.idpd AS idpd, pdi.idbarang AS idbarang, pdi.namabarang AS namabarang,pdi.tipebarang AS tipebarang, pdi.jml AS jml, pdi.satuan AS satuan, pdi.nilaisatuan AS nilaisatuan, pdi.jmlbarang AS jmlbarang, pdi.satuanbarang AS satuanbarang, pdi.matauang AS matauang, pdi.kurs AS kurs, pdi.harga AS harga, pdi.hpppersen AS hpppersen, pdi.hpp AS hpp, i.brekpersediaan AS rekpersediaan, pdi.cabang AS cabang, pdi.lokasi AS lokasi, pdi.gudangasal AS gudangasal, pdi.gudangproduksi AS gudangproduksi, pdi.gudangtujuan AS gudangtujuan, pdi.costcenter AS costcenter, pdi.divisi AS divisi, pdi.subdivisi AS subdivisi, pdi.proyek AS proyek, pdi.catatan AS catatan, pdi.urutan AS urutan, pdi.idbomin AS idbomin, pdi.idpdrin AS idpdrin, pdi.idwoin AS idwoin, pdi.idmrsin AS idmrsin, pdi.idmrnin AS idmrnin, pdi.isclose AS isclose, pdi.customtext1 AS customtext1, pdi.customtext2 AS customtext2, pdi.customtext3 AS customtext3, pdi.customdbl1 AS customdbl1, pdi.customdbl2 AS customdbl2, pdi.customdbl3 AS customdbl3, pdi.customdate1 AS customdate1, pdi.customdate2 AS customdate2, pdi.customdate3 AS customdate3, i.bkode AS kodebarang, i.bhpp AS bhpp, i.bjenis AS bjenis, i.bserial AS bserial, i.bbatch AS bbatch, cc.ccnama AS costcenternama, d.dnama AS divisinama, sd.sdnama AS subdivisinama, p.pnama AS proyeknama, mrn.mrnnotransaksi AS notransaksi, bom2.bomnotransaksi AS bomnotransaksi, pdr2.pdrnotransaksi AS pdrnotransaksi, wo2.wonotransaksi AS wonotransaksi, mrs2.mrsnotransaksi AS mrsnotransaksi, mrn2.mrnnotransaksi AS mrnnotransaksi, i.bapanjang, i.balebar, i.batinggi, i.bjmllapangan, i.bsatuanlapangan from m6_pd pd join m6_pd_in pdi on pd.pdid = pdi.idpd left join m1_branch br on pd.pdcabang = br.bkode left join m1_location lc on pd.pdlokasi = lc.lkode left join m1_warehouse wh1 on pd.pdgudangasal = wh1.wkode left join m1_warehouse wh2 on pd.pdgudangproduksi = wh2.wkode left join m1_warehouse wh3 on pd.pdgudangtujuan = wh3.wkode left join m1_production_category pc on pd.pdjenis = pc.pckode left join m1_contact c1 on pd.pdbagianpd = c1.kid left join m1_working_estimate we on pd.pdestimasikerja = we.wekode left join m6_bom bom on pd.pdidbom = bom.bomid left join m6_pdr pdr on pd.pdidpdr = pdr.pdrid left join m6_wo wo on pd.pdidwo = wo.woid left join m6_mrs mrs on pd.pdidmrs = mrs.mrsid left join m6_mrn mrn on pd.pdidmrn = mrn.mrnid left join m0_status st1 on pd.pdstatus = st1.kode left join m0_status st2 on pd.pdstatussebelumnya = st2.kode left join m0_user u1 on pd.pdinputuser = u1.userid left join m0_user u2 on pd.pdmodifikasiuser = u2.userid left join m1_item i on pdi.idbarang = i.bid left join m1_cost_center cc on pdi.costcenter = cc.cckode left join m1_division d on pdi.divisi = d.dkode left join m1_subdivision sd on pdi.subdivisi = sd.sdkode left join m1_project p on pdi.proyek = p.pkode left join m6_bom_in bomi on pdi.idbomin = bomi.idbomin left join m6_bom bom2 on bomi.idbom = bom2.bomid left join m6_pdr_in pdri on pdi.idpdrin = pdri.idpdrin left join m6_pdr pdr2 on pdri.idpdr = pdr2.pdrid left join m6_wo_in woi on pdi.idwoin = woi.idwoin left join m6_wo wo2 on woi.idwo = wo2.woid left join m6_mrs_in mrsi on pdi.idmrsin = mrsi.idmrsin left join m6_mrs mrs2 on mrsi.idmrs = mrs2.mrsid left join m6_mrn_in mrni on pdi.idmrnin = mrni.idmrnin left join m6_mrn mrn2 on mrni.idmrn = mrn2.mrnid left join m1_production_activity pa on pd.pdaktivitas = pa.paid
```

```sql
select pd.pdid AS pdid, pd.pdcabang AS pdcabang, pd.pdlokasi AS pdlokasi, pd.pdgudangasal AS pdgudangasal, pd.pdgudangproduksi AS pdgudangproduksi, pd.pdgudangtujuan AS pdgudangtujuan, pd.pdsumber AS pdsumber, pd.pdjenis AS pdjenis, pd.pdautonotransaksi AS pdautonotransaksi, pd.pdnotransaksi AS pdnotransaksi, pd.pdtgl AS pdtgl, pd.pdkodepa AS pdkodepa, pd.pdbagianpd AS pdbagianpd, pd.pdbagianpdkontak AS pdbagianpdkontak, pd.pdtgldipakai AS pdtgldipakai, pd.pdestimasikerja AS pdestimasikerja, pd.pdmatauang AS pdmatauang, pd.pdkurs AS pdkurs, pd.pdtotalhargain AS pdtotalhargain, pd.pdtotalhargaout AS pdtotalhargaout, pd.pdtotalhppin AS pdtotalhppin, pd.pdtotalhppout AS pdtotalhppout, pd.pduraian AS pduraian, pd.pdcatatan AS pdcatatan, pd.pdnoref AS pdnoref, pd.pdtglnoref AS pdtglnoref, pd.pdidbom AS pdidbom, pd.pdidpdr AS pdidpdr, pd.pdidwo AS pdidwo, pd.pdidmrs AS pdidmrs, pd.pdidmrn AS pdidmrn, pd.pdstatus AS pdstatus, pd.pdstatussebelumnya AS pdstatussebelumnya, pd.pdjmlrevisi AS pdjmlrevisi, pd.pdcetakanke AS pdcetakanke, pd.pdinputuser AS pdinputuser, pd.pdinputtgl AS pdinputtgl, pd.pdmodifikasiuser AS pdmodifikasiuser, pd.pdmodifikasitgl AS pdmodifikasitgl, pd.pdposting AS pdposting, pd.pdpostingtgl AS pdpostingtgl, pd.pdtutupperiode AS pdtutupperiode, pd.pdisclose AS pdisclose, br.bnama AS pdcabangnama, lc.lnama AS pdlokasinama, wh1.wnama AS pdgudangasalnama, wh2.wnama AS pdgudangproduksinama, wh3.wnama AS pdgudangtujuannama, pc.pcnama AS pdjenisnama, c1.kkode AS pdbagianpdkode, c1.knama AS pdbagianpdnama, we.wenama AS pdestimasikerjanama, bom.bomnotransaksi AS pdnotransaksibom, pdr.pdrnotransaksi AS pdnotransaksipdr, wo.wonotransaksi AS pdnotransaksiwo, mrs.mrsnotransaksi AS pdnotransaksimrs, mrn.mrnnotransaksi AS pdnotransaksimrn, st1.nama AS pdstatusnama, st2.nama AS pdstatussebelumnyanama, u1.unama AS pdinputusernama, u2.unama AS pdmodifikasiusernama, pd.pdaktivitas, pa.pakode as pdaktivitaskode, pa.panama as pdaktivitasnama from m6_pd pd left join m1_branch br on pd.pdcabang = br.bkode left join m1_location lc on pd.pdlokasi = lc.lkode left join m1_warehouse wh1 on pd.pdgudangasal = wh1.wkode left join m1_warehouse wh2 on pd.pdgudangproduksi = wh2.wkode left join m1_warehouse wh3 on pd.pdgudangtujuan = wh3.wkode left join m1_production_category pc on pd.pdjenis = pc.pckode left join m1_contact c1 on pd.pdbagianpd = c1.kid left join m1_working_estimate we on pd.pdestimasikerja = we.wekode left join m6_bom bom on pd.pdidbom = bom.bomid left join m6_pdr pdr on pd.pdidpdr = pdr.pdrid left join m6_wo wo on pd.pdidwo = wo.woid left join m6_mrs mrs on pd.pdidmrs = mrs.mrsid left join m6_mrn mrn on pd.pdidmrn = mrn.mrnid left join m0_status st1 on pd.pdstatus = st1.kode left join m0_status st2 on pd.pdstatussebelumnya = st2.kode left join m0_user u1 on pd.pdinputuser = u1.userid left join m0_user u2 on pd.pdmodifikasiuser = u2.userid left join m1_production_activity pa on pd.pdaktivitas = pa.paid
```

```sql
select pd.pdid AS pdid, pd.pdcabang AS pdcabang, pd.pdlokasi AS pdlokasi, pd.pdgudangasal AS pdgudangasal, pd.pdgudangproduksi AS pdgudangproduksi, pd.pdgudangtujuan AS pdgudangtujuan, pd.pdsumber AS pdsumber, pd.pdjenis AS pdjenis, pd.pdautonotransaksi AS pdautonotransaksi, pd.pdnotransaksi AS pdnotransaksi, pd.pdtgl AS pdtgl, pd.pdkodepa AS pdkodepa, pd.pdbagianpd AS pdbagianpd, pd.pdbagianpdkontak AS pdbagianpdkontak, pd.pdtgldipakai AS pdtgldipakai, pd.pdestimasikerja AS pdestimasikerja, pd.pdmatauang AS pdmatauang, pd.pdkurs AS pdkurs, pd.pdtotalhargain AS pdtotalhargain, pd.pdtotalhargaout AS pdtotalhargaout, pd.pdtotalhppin AS pdtotalhppin, pd.pdtotalhppout AS pdtotalhppout, pd.pduraian AS pduraian, pd.pdcatatan AS pdcatatan, pd.pdnoref AS pdnoref, pd.pdtglnoref AS pdtglnoref, pd.pdidbom AS pdidbom, pd.pdidpdr AS pdidpdr, pd.pdidwo AS pdidwo, pd.pdidmrs AS pdidmrs, pd.pdidmrn AS pdidmrn, pd.pdstatus AS pdstatus, pd.pdstatussebelumnya AS pdstatussebelumnya, pd.pdjmlrevisi AS pdjmlrevisi, pd.pdcetakanke AS pdcetakanke, pd.pdinputuser AS pdinputuser, pd.pdinputtgl AS pdinputtgl, pd.pdmodifikasiuser AS pdmodifikasiuser, pd.pdmodifikasitgl AS pdmodifikasitgl, pd.pdposting AS pdposting, pd.pdpostingtgl AS pdpostingtgl, pd.pdtutupperiode AS pdtutupperiode, pd.pdisclose AS pdisclose, br.bnama AS pdcabangnama, lc.lnama AS pdlokasinama, wh1.wnama AS pdgudangasalnama, wh2.wnama AS pdgudangproduksinama, wh3.wnama AS pdgudangtujuannama, pc.pcnama AS pdjenisnama, c1.kkode AS pdbagianpdkode, c1.knama AS pdbagianpdnama, we.wenama AS pdestimasikerjanama, bom.bomnotransaksi AS pdnotransaksibom, pdr.pdrnotransaksi AS pdnotransaksipdr, wo.wonotransaksi AS pdnotransaksiwo, mrs.mrsnotransaksi AS pdnotransaksimrs, mrn.mrnnotransaksi AS pdnotransaksimrn, st1.nama AS pdstatusnama, st2.nama AS pdstatussebelumnyanama, u1.unama AS pdinputusernama, u2.unama AS pdmodifikasiusernama, pd.pdaktivitas, pa.pakode as pdaktivitaskode, pa.panama as pdaktivitasnama, i.bid, i.bkode, i.bnama from m6_pd pd join m6_pd_in pdi on pd.pdid = pdi.idpd join m1_item i on pdi.idbarang = i.bid left join m1_branch br on pd.pdcabang = br.bkode left join m1_location lc on pd.pdlokasi = lc.lkode left join m1_warehouse wh1 on pd.pdgudangasal = wh1.wkode left join m1_warehouse wh2 on pd.pdgudangproduksi = wh2.wkode left join m1_warehouse wh3 on pd.pdgudangtujuan = wh3.wkode left join m1_production_category pc on pd.pdjenis = pc.pckode left join m1_contact c1 on pd.pdbagianpd = c1.kid left join m1_working_estimate we on pd.pdestimasikerja = we.wekode left join m6_bom bom on pd.pdidbom = bom.bomid left join m6_pdr pdr on pd.pdidpdr = pdr.pdrid left join m6_wo wo on pd.pdidwo = wo.woid left join m6_mrs mrs on pd.pdidmrs = mrs.mrsid left join m6_mrn mrn on pd.pdidmrn = mrn.mrnid left join m0_status st1 on pd.pdstatus = st1.kode left join m0_status st2 on pd.pdstatussebelumnya = st2.kode left join m0_user u1 on pd.pdinputuser = u1.userid left join m0_user u2 on pd.pdmodifikasiuser = u2.userid left join m1_production_activity pa on pd.pdaktivitas = pa.paid
```

```sql
SELECT woin.idwoin, (woin.jmlbarang - woin.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m6_wo_in AS woin INNER JOIN m1_item AS i ON woin.idbarang = i.bid WHERE
```

```sql
SELECT mrsout.idmrsout, (mrsout.jmlbarang - mrsout.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m6_mrs_out AS mrsout INNER JOIN m1_item AS i ON mrsout.idbarang = i.bid WHERE
```

```sql
SELECT pdo.idpdout, pdo.idbarang, pdo.namabarang, pdo.tipebarang, pdo.jml, pdo.satuan, pdo.jmlbarang, pdo.satuanbarang, pdo.matauang, pdo.kurs, pdo.harga, pdo.hpp, pdo.idhppkhususmasuk, pdo.gudangasal, pdo.gudangproduksi, pdo.gudangtujuan, pdo.catatan, pdo.costcenter, pdo.divisi, pdo.subdivisi, pdo.proyek, pd.pdinputtgl, i.bhpp FROM m6_pd_out pdo JOIN m6_pd pd ON pdo.idpd = pd.pdid JOIN m1_item i ON pdo.idbarang = i.bid WHERE pdo.idpd = '{result_4}'
```

```sql
SELECT pdi.idpdin, pdi.idbarang, pdi.namabarang, pdi.tipebarang, pdi.jml, pdi.satuan, pdi.jmlbarang, pdi.satuanbarang, pdi.matauang, pdi.kurs, pdi.harga, pdi.hpp, pdi.gudangasal, pdi.gudangproduksi, pdi.gudangtujuan, pdi.catatan, pdi.costcenter, pdi.divisi, pdi.subdivisi, pdi.proyek, pd.pdinputtgl, i.bhpp FROM m6_pd_in pdi JOIN m6_pd pd ON pdi.idpd = pd.pdid JOIN m1_item i ON pdi.idbarang = i.bid WHERE pdi.idpd = '{result_4}'
```

```sql
SELECT idpdin, idbarang, tipebarang, namabarang, satuan, nilaisatuan, jmlbarang, gudangproduksi, gudangtujuan, idwoin, urutan FROM m6_pd_in WHERE idpd = '{idtransaksi}'
```

```sql
SELECT idpdout, idbarang, tipebarang, namabarang, satuan, nilaisatuan, jmlbarang, idhppkhususmasuk, gudangproduksi, gudangtujuan, idmrsout, urutan FROM m6_pd_out WHERE idpd = '{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_pd_history.vb`

```sql
SELECT pdidhistory FROM m6_pd_history WHERE pdid = '{idtransaksi}' ORDER BY pdmodifikasitgl DESC LIMIT 1
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_pdr.vb`

```sql
SELECT EXISTS(SELECT 1 FROM m6_bom_in JOIN m6_bom ON idbom = bomid WHERE idbomin = '{idbomin}' AND (bomstatus = 2 OR bomstatus = 3 OR bomstatus = 4 OR bomstatus = 7) LIMIT 1) as rowExists, '{idbomin}' as idbomin, bkode FROM m1_item WHERE bid = '{idbarang}'
```

```sql
SELECT EXISTS(SELECT 1 FROM m6_bom_out JOIN m6_bom ON idbom = bomid WHERE idbomout = '{idbomout}' AND (bomstatus = 2 OR bomstatus = 3 OR bomstatus = 4 OR bomstatus = 7) LIMIT 1) as rowExists, '{idbomout}' as idbomout, bkode FROM m1_item WHERE bid = '{idbarang}'
```

```sql
SELECT COUNT(pdrid), pdrnotransaksi FROM M6_pdr WHERE pdrid='{result_4}' AND pdrstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(pdrid) FROM M6_pdr WHERE pdrnotransaksi='{notransaksi}'
```

```sql
SELECT COUNT(pdrid) FROM m6_pdr WHERE pdrnotransaksi='{notransaksi}'
```

```sql
select pdrid from M6_pdr where pdrnotransaksi='{notransaksi}' AND pdrinputuser= '{userid}' order by pdrmodifikasitgl desc limit 1
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Pdrtgl, Pdrnotransaksi, Pdrstatus FROM M6_Pdr WHERE Pdrid='{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Pdrid, Pdrnotransaksi FROM M6_Pdr WHERE Pdrid='{idtransaksi}'
```

```sql
select pdr.pdrid AS pdrid, pdr.pdrcabang AS pdrcabang, pdr.pdrlokasi AS pdrlokasi, pdr.pdrgudangasal AS pdrgudangasal, pdr.pdrgudangproduksi AS pdrgudangproduksi, pdr.pdrgudangtujuan AS pdrgudangtujuan, pdr.pdrsumber AS pdrsumber, pdr.pdrjenis AS pdrjenis, pdr.pdrautonotransaksi AS pdrautonotransaksi, pdr.pdrnotransaksi AS pdrnotransaksi, pdr.pdrtgl AS pdrtgl, pdr.pdrkodepa AS pdrkodepa, pdr.pdrdimintaoleh AS pdrdimintaoleh, pdr.pdrdimintaolehkontak AS pdrdimintaolehkontak, pdr.pdrmintake AS pdrmintake, pdr.pdrtgldipakai AS pdrtgldipakai, pdr.pdrestimasikerja AS pdrestimasikerja, pdr.pdrmatauang AS pdrmatauang, pdr.pdrkurs AS pdrkurs, pdr.pdrtotalhargain AS pdrtotalhargain, pdr.pdrtotalhargaout AS pdrtotalhargaout, pdr.pdrtotalhppin AS pdrtotalhppin, pdr.pdrtotalhppout AS pdrtotalhppout, pdr.pdruraian AS pdruraian, pdr.pdrcatatan AS pdrcatatan, pdr.pdrnoref AS pdrnoref, pdr.pdrtglnoref AS pdrtglnoref, pdr.pdridbom AS pdridbom, pdr.pdrstatuswoin AS pdrstatuswoin, pdr.pdrstatuswoout AS pdrstatuswoout, pdr.pdrstatusmrsin AS pdrstatusmrsin, pdr.pdrstatusmrsout AS pdrstatusmrsout, pdr.pdrstatusmrnin AS pdrstatusmrnin, pdr.pdrstatusmrnout AS pdrstatusmrnout, pdr.pdrstatuspdin AS pdrstatuspdin, pdr.pdrstatuspdout AS pdrstatuspdout, pdr.pdrstatusrealisasiin AS pdrstatusrealisasiin, pdr.pdrstatusrealisasiout AS pdrstatusrealisasiout, pdr.pdrstatus AS pdrstatus, pdr.pdrstatussebelumnya AS pdrstatussebelumnya, pdr.pdrjmlrevisi AS pdrjmlrevisi, pdr.pdrcetakanke AS pdrcetakanke, pdr.pdrinputuser AS pdrinputuser, pdr.pdrinputtgl AS pdrinputtgl, pdr.pdrmodifikasiuser AS pdrmodifikasiuser, pdr.pdrmodifikasitgl AS pdrmodifikasitgl, pdr.pdrposting AS pdrposting, pdr.pdrpostingtgl AS pdrpostingtgl, pdr.pdrisclose AS pdrisclose, pdr.pdrcustomtext1 AS pdrcustomtext1, pdr.pdrcustomtext2 AS pdrcustomtext2, pdr.pdrcustomtext3 AS pdrcustomtext3, pdr.pdrcustomtext4 AS pdrcustomtext4, pdr.pdrcustomtext5 AS pdrcustomtext5, pdr.pdrcustomint1 AS pdrcustomint1, pdr.pdrcustomint2 AS pdrcustomint2, pdr.pdrcustomint3 AS pdrcustomint3, pdr.pdrcustomdbl1 AS pdrcustomdbl1, pdr.pdrcustomdbl2 AS pdrcustomdbl2, pdr.pdrcustomdbl3 AS pdrcustomdbl3, pdr.pdrcustomdate1 AS pdrcustomdate1, pdr.pdrcustomdate2 AS pdrcustomdate2, pdr.pdrcustomdate3 AS pdrcustomdate3, br.bnama AS pdrcabangnama, lc.lnama AS pdrlokasinama, wh1.wnama AS pdrgudangasalnama, wh2.wnama AS pdrgudangproduksinama, wh3.wnama AS pdrgudangtujuannama, pc.pcnama AS pdrjenisnama, c1.kkode AS pdrdimintaolehkode, c1.knama AS pdrdimintaolehnama, c2.kkode AS pdrmintakekode, c2.knama AS pdrmintakenama, we.wenama AS pdrestimasikerjanama, bom.bomnotransaksi AS pdrnotransaksibom, st1.nama AS pdrstatusnama, st2.nama AS pdrstatussebelumnyanama, u1.unama AS pdrinputusernama, u2.unama AS pdrmodifikasiusernama, pdr.pdraktivitas, pa.pakode as pdraktivitaskode, pa.panama as pdraktivitasnama, pc.pcwajibwo AS pdrjeniswajibwo, pdri.idpdrin AS idpdrin, pdri.idpdr AS idpdr, pdri.idbarang AS idbarang, pdri.namabarang AS namabarang, pdri.tipebarang AS tipebarang, pdri.jml AS jml, pdri.satuan AS satuan, pdri.nilaisatuan AS nilaisatuan, pdri.jmlbarang AS jmlbarang, pdri.satuanbarang AS satuanbarang, pdri.matauang AS matauang, pdri.kurs AS kurs, pdri.harga AS harga, pdri.hpppersen AS hpppersen, pdri.hpp AS hpp, i.brekpersediaan AS rekpersediaan, pdri.cabang AS cabang, pdri.lokasi AS lokasi, pdri.gudangasal AS gudangasal, pdri.gudangproduksi AS gudangproduksi, pdri.gudangtujuan AS gudangtujuan, pdri.costcenter AS costcenter, pdri.divisi AS divisi, pdri.subdivisi AS subdivisi, pdri.proyek AS proyek, pdri.catatan AS catatan, pdri.urutan AS urutan, pdri.idbomin AS idbomin, pdri.jmlwo AS jmlwo, pdri.statuswo AS statuswo, pdri.jmlmrs AS jmlmrs, pdri.statusmrs AS statusmrs, pdri.jmlmrn AS jmlmrn, pdri.statusmrn AS statusmrn, pdri.jmlpd AS jmlpd, pdri.statuspd AS statuspd, pdri.jmlrealisasi AS jmlrealisasi, pdri.statusrealisasi AS statusrealisasi, pdri.isclose AS isclose, pdri.customtext1 AS customtext1, pdri.customtext2 AS customtext2, pdri.customtext3 AS customtext3, pdri.customdbl1 AS customdbl1, pdri.customdbl2 AS customdbl2, pdri.customdbl3 AS customdbl3, pdri.customdate1 AS customdate1, pdri.customdate2 AS customdate2, pdri.customdate3 AS customdate3, i.bkode AS kodebarang, i.bhpp AS bhpp, i.bjenis AS bjenis, i.bserial AS bserial, i.bbatch AS bbatch, cc.ccnama AS costcenternama, d.dnama AS divisinama, sd.sdnama AS subdivisinama, p.pnama AS proyeknama, pdr.pdrnotransaksi AS notransaksi, bom2.bomnotransaksi AS bomnotransaksi, ((pdri.jmlbarang - pdri.jmlwo) / pdri.nilaisatuan) AS jmlsisawo, ((pdri.jmlbarang - pdri.jmlmrs) / pdri.nilaisatuan) AS jmlsisamrs, ((pdri.jmlbarang - pdri.jmlmrn) / pdri.nilaisatuan) AS jmlsisamrn,((pdri.jmlbarang - pdri.jmlpd) / pdri.nilaisatuan) AS jmlsisapd,((pdri.jmlbarang - pdri.jmlrealisasi) / pdri.nilaisatuan) AS jmlsisarealisasi, i.bjmllapangan, i.bsatuanlapangan, i.bcustom12, i.bcustom11 from m6_pdr pdr join m6_pdr_in pdri on pdr.pdrid = pdri.idpdr left join m1_branch br on pdr.pdrcabang = br.bkode left join m1_location lc on pdr.pdrlokasi = lc.lkode left join m1_warehouse wh1 on pdr.pdrgudangasal = wh1.wkode left join m1_warehouse wh2 on pdr.pdrgudangproduksi = wh2.wkode left join m1_warehouse wh3 on pdr.pdrgudangtujuan = wh3.wkode left join m1_production_category pc on pdr.pdrjenis = pc.pckode left join m1_contact c1 on pdr.pdrdimintaoleh = c1.kid left join m1_contact c2 on pdr.pdrmintake = c2.kid left join m1_working_estimate we on pdr.pdrestimasikerja = we.wekode left join m6_bom bom on pdr.pdridbom = bom.bomid left join m0_status st1 on pdr.pdrstatus = st1.kode left join m0_status st2 on pdr.pdrstatussebelumnya = st2.kode left join m0_user u1 on pdr.pdrinputuser = u1.userid left join m0_user u2 on pdr.pdrmodifikasiuser = u2.userid left join m1_production_activity pa on pdr.pdraktivitas = pa.paid left join m1_item i on pdri.idbarang = i.bid left join m1_cost_center cc on pdri.costcenter = cc.cckode left join m1_division d on pdri.divisi = d.dkode left join m1_subdivision sd on pdri.subdivisi = sd.sdkode left join m1_project p on pdri.proyek = p.pkode left join m6_bom_in bomi on pdri.idbomin = bomi.idbomin left join m6_bom bom2 on bomi.idbom = bom2.bomid
```

```sql
select `pdro`.`idpdrout` AS `idpdrout`,`pdro`.`idpdr` AS `idpdr`,`pdro`.`idbarang` AS `idbarang`,`pdro`.`namabarang` AS `namabarang`,`pdro`.`tipebarang` AS `tipebarang`,`pdro`.`jml` AS `jml`,`pdro`.`satuan` AS `satuan`,`pdro`.`nilaisatuan` AS `nilaisatuan`,`pdro`.`jmlbarang` AS `jmlbarang`,`pdro`.`satuanbarang` AS `satuanbarang`,`pdro`.`matauang` AS `matauang`,`pdro`.`kurs` AS `kurs`,`pdro`.`harga` AS `harga`,`pdro`.`hpp` AS `hpp`,`pdro`.`idhppkhususmasuk` AS `idhppkhususmasuk`,`pdro`.`idhppfifomasuk` AS `idhppfifomasuk`,`i`.`brekpersediaan` AS `rekpersediaan`,`pdro`.`cabang` AS `cabang`,`pdro`.`lokasi` AS `lokasi`,`pdro`.`gudangasal` AS `gudangasal`,`pdro`.`gudangproduksi` AS `gudangproduksi`,`pdro`.`gudangtujuan` AS `gudangtujuan`,`pdro`.`costcenter` AS `costcenter`,`pdro`.`divisi` AS `divisi`,`pdro`.`subdivisi` AS `subdivisi`,`pdro`.`proyek` AS `proyek`,`pdro`.`catatan` AS `catatan`,`pdro`.`urutan` AS `urutan`,`pdro`.`idbomout` AS `idbomout`,`pdro`.`jmlwo` AS `jmlwo`,`pdro`.`statuswo` AS `statuswo`,`pdro`.`jmlmrs` AS `jmlmrs`,`pdro`.`statusmrs` AS `statusmrs`,`pdro`.`jmlmrn` AS `jmlmrn`,`pdro`.`statusmrn` AS `statusmrn`,`pdro`.`jmlpd` AS `jmlpd`,`pdro`.`statuspd` AS `statuspd`,`pdro`.`jmlrealisasi` AS `jmlrealisasi`,`pdro`.`statusrealisasi` AS `statusrealisasi`,`pdro`.`isclose` AS `isclose`,`pdro`.`customtext1` AS `customtext1`,`pdro`.`customtext2` AS `customtext2`,`pdro`.`customtext3` AS `customtext3`,`pdro`.`customdbl1` AS `customdbl1`,`pdro`.`customdbl2` AS `customdbl2`,`pdro`.`customdbl3` AS `customdbl3`,`pdro`.`customdate1` AS `customdate1`,`pdro`.`customdate2` AS `customdate2`,`pdro`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`i`.`bhpp` AS `bhpp`,`i`.`bjenis` AS `bjenis`,`i`.`bserial` AS `bserial`,`i`.`bbatch` AS `bbatch`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama`,`pdr`.`pdrnotransaksi` AS `notransaksi`,`bom2`.`bomnotransaksi` AS `bomnotransaksi`,((`pdro`.`jmlbarang` - `pdro`.`jmlwo`) / `pdro`.`nilaisatuan`) AS `jmlsisawo`,((`pdro`.`jmlbarang` - `pdro`.`jmlmrs`) / `pdro`.`nilaisatuan`) AS `jmlsisamrs`,((`pdro`.`jmlbarang` - `pdro`.`jmlmrn`) / `pdro`.`nilaisatuan`) AS `jmlsisamrn`,((`pdro`.`jmlbarang` - `pdro`.`jmlpd`) / `pdro`.`nilaisatuan`) AS `jmlsisapd`,((`pdro`.`jmlbarang` - `pdro`.`jmlrealisasi`) / `pdro`.`nilaisatuan`) AS `jmlsisarealisasi`, i.bjmllapangan, i.bsatuanlapangan, i.bstok, IFNULL(SUM(ib.jmlbooking),0) AS jmlbooking, IFNULL((i.bstok-SUM(ib.jmlbooking)),0) AS stokakhir from (((((((((`m6_pdr_out` `pdro` left join `m6_pdr` `pdr` on((`pdro`.`idpdr` = `pdr`.`pdrid`))) left join `m1_item` `i` on((`pdro`.`idbarang` = `i`.`bid`))) left join `m1_cost_center` `cc` on((`pdro`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`pdro`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`pdro`.`subdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`pdro`.`proyek` = `p`.`pkode`))) left join `m6_bom_out` `bomo` on((`pdro`.`idbomout` = `bomo`.`idbomout`))) left join `m6_bom` `bom2` on((`bomo`.`idbom` = `bom2`.`bomid`))) left join `m1_item_booking` `ib` on((`pdro`.`idbarang` = `ib`.`idbarang`)))
```

```sql
select pdr.pdrid AS pdrid, pdr.pdrcabang AS pdrcabang, pdr.pdrlokasi AS pdrlokasi, pdr.pdrgudangasal AS pdrgudangasal, pdr.pdrgudangproduksi AS pdrgudangproduksi, pdr.pdrgudangtujuan AS pdrgudangtujuan, pdr.pdrsumber AS pdrsumber, pdr.pdrjenis AS pdrjenis, pdr.pdrautonotransaksi AS pdrautonotransaksi, pdr.pdrnotransaksi AS pdrnotransaksi, pdr.pdrtgl AS pdrtgl, pdr.pdrkodepa AS pdrkodepa, pdr.pdrdimintaoleh AS pdrdimintaoleh, pdr.pdrdimintaolehkontak AS pdrdimintaolehkontak, pdr.pdrmintake AS pdrmintake, pdr.pdrtgldipakai AS pdrtgldipakai, pdr.pdrestimasikerja AS pdrestimasikerja, pdr.pdrmatauang AS pdrmatauang, pdr.pdrkurs AS pdrkurs, pdr.pdrtotalhargain AS pdrtotalhargain, pdr.pdrtotalhargaout AS pdrtotalhargaout, pdr.pdrtotalhppin AS pdrtotalhppin, pdr.pdrtotalhppout AS pdrtotalhppout, pdr.pdruraian AS pdruraian, pdr.pdrcatatan AS pdrcatatan, pdr.pdrnoref AS pdrnoref, pdr.pdrtglnoref AS pdrtglnoref, pdr.pdridbom AS pdridbom, pdr.pdrstatuswoin AS pdrstatuswoin, pdr.pdrstatuswoout AS pdrstatuswoout, pdr.pdrstatusmrsin AS pdrstatusmrsin, pdr.pdrstatusmrsout AS pdrstatusmrsout, pdr.pdrstatusmrnin AS pdrstatusmrnin, pdr.pdrstatusmrnout AS pdrstatusmrnout, pdr.pdrstatuspdin AS pdrstatuspdin, pdr.pdrstatuspdout AS pdrstatuspdout, pdr.pdrstatusrealisasiin AS pdrstatusrealisasiin, pdr.pdrstatusrealisasiout AS pdrstatusrealisasiout, pdr.pdrstatus AS pdrstatus, pdr.pdrstatussebelumnya AS pdrstatussebelumnya, pdr.pdrjmlrevisi AS pdrjmlrevisi, pdr.pdrcetakanke AS pdrcetakanke, pdr.pdrinputuser AS pdrinputuser, pdr.pdrinputtgl AS pdrinputtgl, pdr.pdrmodifikasiuser AS pdrmodifikasiuser, pdr.pdrmodifikasitgl AS pdrmodifikasitgl, pdr.pdrposting AS pdrposting, pdr.pdrpostingtgl AS pdrpostingtgl, pdr.pdrisclose AS pdrisclose, br.bnama AS pdrcabangnama, lc.lnama AS pdrlokasinama, wh1.wnama AS pdrgudangasalnama, wh2.wnama AS pdrgudangproduksinama, wh3.wnama AS pdrgudangtujuannama, pc.pcnama AS pdrjenisnama, c1.kkode AS pdrdimintaolehkode, c1.knama AS pdrdimintaolehnama, c2.kkode AS pdrmintakekode, c2.knama AS pdrmintakenama, we.wenama AS pdrestimasikerjanama, bom.bomnotransaksi AS pdrnotransaksibom, st1.nama AS pdrstatusnama, st2.nama AS pdrstatussebelumnyanama, u1.unama AS pdrinputusernama, u2.unama AS pdrmodifikasiusernama, pdr.pdraktivitas, pa.pakode as pdraktivitaskode, pa.panama as pdraktivitasnama from m6_pdr pdr left join m1_branch br on pdr.pdrcabang = br.bkode left join m1_location lc on pdr.pdrlokasi = lc.lkode left join m1_warehouse wh1 on pdr.pdrgudangasal = wh1.wkode left join m1_warehouse wh2 on pdr.pdrgudangproduksi = wh2.wkode left join m1_warehouse wh3 on pdr.pdrgudangtujuan = wh3.wkode left join m1_production_category pc on pdr.pdrjenis = pc.pckode left join m1_contact c1 on pdr.pdrdimintaoleh = c1.kid left join m1_contact c2 on pdr.pdrmintake = c2.kid left join m1_working_estimate we on pdr.pdrestimasikerja = we.wekode left join m6_bom bom on pdr.pdridbom = bom.bomid left join m0_status st1 on pdr.pdrstatus = st1.kode left join m0_status st2 on pdr.pdrstatussebelumnya = st2.kode left join m0_user u1 on pdr.pdrinputuser = u1.userid left join m0_user u2 on pdr.pdrmodifikasiuser = u2.userid left join m1_production_activity pa on pdr.pdraktivitas = pa.paid
```

```sql
select pdr.pdrid AS pdrid, pdr.pdrcabang AS pdrcabang, pdr.pdrlokasi AS pdrlokasi, pdr.pdrgudangasal AS pdrgudangasal, pdr.pdrgudangproduksi AS pdrgudangproduksi, pdr.pdrgudangtujuan AS pdrgudangtujuan, pdr.pdrsumber AS pdrsumber, pdr.pdrjenis AS pdrjenis, pdr.pdrautonotransaksi AS pdrautonotransaksi, pdr.pdrnotransaksi AS pdrnotransaksi, pdr.pdrtgl AS pdrtgl, pdr.pdrkodepa AS pdrkodepa, pdr.pdrdimintaoleh AS pdrdimintaoleh, pdr.pdrdimintaolehkontak AS pdrdimintaolehkontak, pdr.pdrmintake AS pdrmintake, pdr.pdrtgldipakai AS pdrtgldipakai, pdr.pdrestimasikerja AS pdrestimasikerja, pdr.pdrmatauang AS pdrmatauang, pdr.pdrkurs AS pdrkurs, pdr.pdrtotalhargain AS pdrtotalhargain, pdr.pdrtotalhargaout AS pdrtotalhargaout, pdr.pdrtotalhppin AS pdrtotalhppin, pdr.pdrtotalhppout AS pdrtotalhppout, pdr.pdruraian AS pdruraian, pdr.pdrcatatan AS pdrcatatan, pdr.pdrnoref AS pdrnoref, pdr.pdrtglnoref AS pdrtglnoref, pdr.pdridbom AS pdridbom, pdr.pdrstatuswoin AS pdrstatuswoin, pdr.pdrstatuswoout AS pdrstatuswoout, pdr.pdrstatusmrsin AS pdrstatusmrsin, pdr.pdrstatusmrsout AS pdrstatusmrsout, pdr.pdrstatusmrnin AS pdrstatusmrnin, pdr.pdrstatusmrnout AS pdrstatusmrnout, pdr.pdrstatuspdin AS pdrstatuspdin, pdr.pdrstatuspdout AS pdrstatuspdout, pdr.pdrstatusrealisasiin AS pdrstatusrealisasiin, pdr.pdrstatusrealisasiout AS pdrstatusrealisasiout, pdr.pdrstatus AS pdrstatus, pdr.pdrstatussebelumnya AS pdrstatussebelumnya, pdr.pdrjmlrevisi AS pdrjmlrevisi, pdr.pdrcetakanke AS pdrcetakanke, pdr.pdrinputuser AS pdrinputuser, pdr.pdrinputtgl AS pdrinputtgl, pdr.pdrmodifikasiuser AS pdrmodifikasiuser, pdr.pdrmodifikasitgl AS pdrmodifikasitgl, pdr.pdrposting AS pdrposting, pdr.pdrpostingtgl AS pdrpostingtgl, pdr.pdrisclose AS pdrisclose, br.bnama AS pdrcabangnama, lc.lnama AS pdrlokasinama, wh1.wnama AS pdrgudangasalnama, wh2.wnama AS pdrgudangproduksinama, wh3.wnama AS pdrgudangtujuannama, pc.pcnama AS pdrjenisnama, c1.kkode AS pdrdimintaolehkode, c1.knama AS pdrdimintaolehnama, c2.kkode AS pdrmintakekode, c2.knama AS pdrmintakenama, we.wenama AS pdrestimasikerjanama, bom.bomnotransaksi AS pdrnotransaksibom, st1.nama AS pdrstatusnama, st2.nama AS pdrstatussebelumnyanama, u1.unama AS pdrinputusernama, u2.unama AS pdrmodifikasiusernama, pdr.pdraktivitas, pa.pakode as pdraktivitaskode, pa.panama as pdraktivitasnama , cs.kid as salesid, cs.kkode as saleskode, cs.knama as salesnama from m6_pdr pdr left join m1_branch br on pdr.pdrcabang = br.bkode left join m1_location lc on pdr.pdrlokasi = lc.lkode left join m1_warehouse wh1 on pdr.pdrgudangasal = wh1.wkode left join m1_warehouse wh2 on pdr.pdrgudangproduksi = wh2.wkode left join m1_warehouse wh3 on pdr.pdrgudangtujuan = wh3.wkode left join m1_production_category pc on pdr.pdrjenis = pc.pckode left join m1_contact c1 on pdr.pdrdimintaoleh = c1.kid left join m1_contact c2 on pdr.pdrmintake = c2.kid left join m1_working_estimate we on pdr.pdrestimasikerja = we.wekode left join m6_bom bom on pdr.pdridbom = bom.bomid left join m0_status st1 on pdr.pdrstatus = st1.kode left join m0_status st2 on pdr.pdrstatussebelumnya = st2.kode left join m0_user u1 on pdr.pdrinputuser = u1.userid left join m0_user u2 on pdr.pdrmodifikasiuser = u2.userid left join m1_production_activity pa on pdr.pdraktivitas = pa.paid left join m6_pdr_in pdri on pdr.pdrid = pdri.idpdr left join m5_so_detail sod on pdri.customtext3 = sod.customtext3 and sod.customtext3 <> '' left join m5_so so on sod.idso = so.soid left join m1_contact cs on so.sobagianpenjualan = cs.kid
```

```sql
SELECT bomin.idbomin, (bomin.jmlbarang) as sisapdr, i.bid, i.bkode FROM m6_bom_in AS bomin INNER JOIN m1_item AS i ON bomin.idbarang = i.bid WHERE
```

```sql
SELECT bomout.idbomout, (bomout.jmlbarang) as sisapdr, i.bid, i.bkode FROM m6_bom_out AS bomout INNER JOIN m1_item AS i ON bomout.idbarang = i.bid WHERE
```

```sql
select pdr.pdrid AS pdrid, pdr.pdrnotransaksi AS pdrnotransaksi, bom.bomsumber AS sumber, bom.bomid AS idterkait, bom.bomnotransaksi AS noterkait, bom.bomtgl AS tglterkait, bom.bominputtgl AS inputtglterkait, bom.bommodifikasitgl AS modifikasitglterkait, 0 as jenisterkait from m6_bom_in bomi join m6_bom bom on bomi.idbom = bom.bomid join m6_pdr_in pdri on bomi.idbomin = pdri.idbomin join m6_pdr pdr ON pdri.idpdr = pdr.pdrid {filter1} group by bom.bomid, pdr.pdrid
```

```sql
select pdr.pdrid AS pdrid, pdr.pdrnotransaksi AS pdrnotransaksi, bom.bomsumber AS sumber, bom.bomid AS idterkait, bom.bomnotransaksi AS noterkait, bom.bomtgl AS tglterkait, bom.bominputtgl AS inputtglterkait, bom.bommodifikasitgl AS modifikasitglterkait, 0 as jenisterkait from m6_bom_out bomo join m6_bom bom on bomo.idbom = bom.bomid join m6_pdr_out pdro on bomo.idbomout = pdro.idbomout join m6_pdr pdr ON pdro.idpdr = pdr.pdrid {filter2} group by bom.bomid, pdr.pdrid
```

```sql
select pdr.pdrid AS pdrid, pdr.pdrnotransaksi AS pdrnotransaksi, wo.wosumber AS sumber, wo.woid AS idterkait, wo.wonotransaksi AS noterkait, wo.wotgl AS tglterkait, wo.woinputtgl AS inputtglterkait, wo.womodifikasitgl AS modifikasitglterkait, 1 as jenisterkait from m6_wo_in woi join m6_wo wo on woi.idwo = wo.woid join m6_pdr_in pdri on woi.idpdrin = pdri.idpdrin join m6_pdr pdr ON pdri.idpdr = pdr.pdrid {filter3} group by wo.woid, pdr.pdrid
```

```sql
select pdr.pdrid AS pdrid, pdr.pdrnotransaksi AS pdrnotransaksi, wo.wosumber AS sumber, wo.woid AS idterkait, wo.wonotransaksi AS noterkait, wo.wotgl AS tglterkait, wo.woinputtgl AS inputtglterkait, wo.womodifikasitgl AS modifikasitglterkait, 1 as jenisterkait from m6_wo_out woo join m6_wo wo on woo.idwo = wo.woid join m6_pdr_out pdro on woo.idpdrout = pdro.idpdrout join m6_pdr pdr ON pdro.idpdr = pdr.pdrid {filter4} group by wo.woid, pdr.pdrid
```

```sql
select pdr.pdrid AS pdrid, pdr.pdrnotransaksi AS pdrnotransaksi, mrs.mrssumber AS sumber, mrs.mrsid AS idterkait, mrs.mrsnotransaksi AS noterkait, mrs.mrstgl AS tglterkait, mrs.mrsinputtgl AS inputtglterkait, mrs.mrsmodifikasitgl AS modifikasitglterkait, 1 as jenisterkait from m6_mrs_out mrso join m6_mrs mrs on mrso.idmrs = mrs.mrsid join m6_pdr_out pdro on mrso.idpdrout = pdro.idpdrout join m6_pdr pdr ON pdro.idpdr = pdr.pdrid {filter5} group by mrs.mrsid, pdr.pdrid
```

```sql
select pdr.pdrid AS pdrid, pdr.pdrnotransaksi AS pdrnotransaksi, mrn.mrnsumber AS sumber, mrn.mrnid AS idterkait, mrn.mrnnotransaksi AS noterkait, mrn.mrntgl AS tglterkait, mrn.mrninputtgl AS inputtglterkait, mrn.mrnmodifikasitgl AS modifikasitglterkait, 1 as jenisterkait from m6_mrn_out mrno join m6_mrn mrn on mrno.idmrn = mrn.mrnid join m6_pdr_out pdro on mrno.idpdrout = pdro.idpdrout join m6_pdr pdr ON pdro.idpdr = pdr.pdrid {filter6} group by mrn.mrnid, pdr.pdrid
```

```sql
select pdr.pdrid AS pdrid, pdr.pdrnotransaksi AS pdrnotransaksi, pd.pdsumber AS sumber, pd.pdid AS idterkait, pd.pdnotransaksi AS noterkait, pd.pdtgl AS tglterkait, pd.pdinputtgl AS inputtglterkait, pd.pdmodifikasitgl AS modifikasitglterkait, 1 as jenisterkait from m6_pd_in pdi join m6_pd pd on pdi.idpd = pd.pdid join m6_pdr_in pdri on pdi.idpdrin = pdri.idpdrin join m6_pdr pdr ON pdri.idpdr = pdr.pdrid {filter7} group by pd.pdid, pdr.pdrid
```

```sql
select pdr.pdrid AS pdrid, pdr.pdrnotransaksi AS pdrnotransaksi, pd.pdsumber AS sumber, pd.pdid AS idterkait, pd.pdnotransaksi AS noterkait, pd.pdtgl AS tglterkait, pd.pdinputtgl AS inputtglterkait, pd.pdmodifikasitgl AS modifikasitglterkait, 1 as jenisterkait from m6_pd_out pdo join m6_pd pd on pdo.idpd = pd.pdid join m6_pdr_out pdro on pdo.idpdrout = pdro.idpdrout join m6_pdr pdr ON pdro.idpdr = pdr.pdrid {filter8} group by pd.pdid, pdr.pdrid
```

```sql
SELECT pdr.pdrid AS pdrid, pdr.pdrnotransaksi AS pdrnotransaksi, t.tsumber AS sumber, t.tidtransaksi AS idterkait, t.tnotransaksi AS noterkait, t.ttgl AS tglterkait, t.tinputtgl AS inputtglterkait, t.tmodifikasitgl AS modifikasitglterkait, 1 as jenisterkait FROM m6_pdr pdr JOIN m2_transaction_journal t ON pdr.pdrnotransaksi = t.tcostcenter {filter9} GROUP BY pdr.pdrid, t.tsumber, t.tidtransaksi
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_pdr_history.vb`

```sql
SELECT pdridhistory FROM m6_pdr_history WHERE pdrid = '{idtransaksi}' ORDER BY pdrmodifikasitgl DESC LIMIT 1
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_wo.vb`

```sql
SELECT EXISTS(SELECT 1 FROM m6_bom_in JOIN m6_bom ON idbom = bomid WHERE idbomin = '{idbomin}' AND (bomstatus = 2 OR bomstatus = 3 OR bomstatus = 4 OR bomstatus = 7) LIMIT 1) as rowExists, '{idbomin}' as idbomin, bkode FROM m1_item WHERE bid = '{idbarang}'
```

```sql
SELECT EXISTS(SELECT 1 FROM m6_pdr_in JOIN m6_pdr ON idpdr = pdrid WHERE idpdrin = '{idpdrin}' AND (pdrstatus = 2 OR pdrstatus = 3 OR pdrstatus = 4 OR pdrstatus = 7) LIMIT 1) as rowExists, '{idpdrin}' as idpdrin, bkode FROM m1_item WHERE bid = '{idbarang}'
```

```sql
SELECT EXISTS(SELECT 1 FROM m6_bom_out JOIN m6_bom ON idbom = bomid WHERE idbomout = '{idbomout}' AND (bomstatus = 2 OR bomstatus = 3 OR bomstatus = 4 OR bomstatus = 7) LIMIT 1) as rowExists, '{idbomout}' as idbomout, bkode FROM m1_item WHERE bid = '{idbarang}'
```

```sql
SELECT EXISTS(SELECT 1 FROM m6_pdr_out JOIN m6_pdr ON idpdr = pdrid WHERE idpdrout = '{idpdrout}' AND (pdrstatus = 2 OR pdrstatus = 3 OR pdrstatus = 4 OR pdrstatus = 7) LIMIT 1) as rowExists, '{idpdrout}' as idpdrout, bkode FROM m1_item WHERE bid = '{idbarang}'
```

```sql
SELECT COUNT(woid), wonotransaksi FROM M6_wo WHERE woid='{result_4}' AND wostatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(woid) FROM M6_wo WHERE wonotransaksi='{notransaksi}'
```

```sql
SELECT COUNT(woid) FROM m6_wo WHERE wonotransaksi='{notransaksi}'
```

```sql
select woid from M6_wo where wonotransaksi='{notransaksi}' AND woinputuser= '{userid}' order by womodifikasitgl desc limit 1
```

```sql
SELECT idpdr FROM m6_pdr_in WHERE {updFilterPdrIn} GROUP BY idpdr
```

```sql
SELECT idpdr, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m6_pdr_in WHERE {ftDetail} GROUP BY idpdr
```

```sql
SELECT idpdr FROM m6_pdr_out WHERE {updFilterPdrOut} GROUP BY idpdr
```

```sql
SELECT idpdr, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m6_pdr_out WHERE {ftDetail} GROUP BY idpdr
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Wotgl, Wonotransaksi, Wostatus FROM M6_Wo WHERE Woid='{idtransaksi}'
```

```sql
SELECT idbarang, tipebarang, namabarang, satuan, nilaisatuan, jmlbarang, idpdrin, urutan FROM m6_wo_in WHERE idwo = '{idtransaksi}'
```

```sql
SELECT idbarang, tipebarang, namabarang, satuan, nilaisatuan, jmlbarang, idpdrout, urutan FROM m6_wo_out WHERE idwo = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Woid, Wonotransaksi FROM M6_Wo WHERE Woid='{idtransaksi}'
```

```sql
select wo.woid AS woid, wo.wocabang AS wocabang, wo.wolokasi AS wolokasi, wo.wogudangasal AS wogudangasal, wo.wogudangproduksi AS wogudangproduksi, wo.wogudangtujuan AS wogudangtujuan, wo.wosumber AS wosumber, wo.wojenis AS wojenis, wo.woautonotransaksi AS woautonotransaksi, wo.wonotransaksi AS wonotransaksi, wo.wotgl AS wotgl, wo.wokodepa AS wokodepa, wo.wodimintaoleh AS wodimintaoleh, wo.wodimintaolehkontak AS wodimintaolehkontak, wo.womintake AS womintake, wo.wotgldipakai AS wotgldipakai, wo.woestimasikerja AS woestimasikerja, wo.womatauang AS womatauang, wo.wokurs AS wokurs, wo.wototalhargain AS wototalhargain, wo.wototalhargaout AS wototalhargaout, wo.wototalhppin AS wototalhppin, wo.wototalhppout AS wototalhppout, wo.wouraian AS wouraian, wo.wocatatan AS wocatatan, wo.wonoref AS wonoref, wo.wotglnoref AS wotglnoref, wo.woidbom AS woidbom, wo.woidpdr AS woidpdr, wo.wostatusmrsin AS wostatusmrsin, wo.wostatusmrsout AS wostatusmrsout, wo.wostatusmrnin AS wostatusmrnin, wo.wostatusmrnout AS wostatusmrnout, wo.wostatuspdin AS wostatuspdin, wo.wostatuspdout AS wostatuspdout, wo.wostatusrealisasiin AS wostatusrealisasiin, wo.wostatusrealisasiout AS wostatusrealisasiout, wo.wostatus AS wostatus, wo.wostatussebelumnya AS wostatussebelumnya, wo.wojmlrevisi AS wojmlrevisi, wo.wocetakanke AS wocetakanke, wo.woinputuser AS woinputuser, wo.woinputtgl AS woinputtgl, wo.womodifikasiuser AS womodifikasiuser, wo.womodifikasitgl AS womodifikasitgl, wo.woposting AS woposting, wo.wopostingtgl AS wopostingtgl, wo.woisclose AS woisclose, wo.wocustomtext1 AS wocustomtext1, wo.wocustomtext2 AS wocustomtext2, wo.wocustomtext3 AS wocustomtext3, wo.wocustomtext4 AS wocustomtext4, wo.wocustomtext5 AS wocustomtext5, wo.wocustomint1 AS wocustomint1, wo.wocustomint2 AS wocustomint2, wo.wocustomint3 AS wocustomint3, wo.wocustomdbl1 AS wocustomdbl1, wo.wocustomdbl2 AS wocustomdbl2, wo.wocustomdbl3 AS wocustomdbl3, wo.wocustomdate1 AS wocustomdate1, wo.wocustomdate2 AS wocustomdate2, wo.wocustomdate3 AS wocustomdate3, br.bnama AS wocabangnama, lc.lnama AS wolokasinama, wh1.wnama AS wogudangasalnama, wh2.wnama AS wogudangproduksinama, wh3.wnama AS wogudangtujuannama, pc.pcnama AS wojenisnama, c1.kkode AS wodimintaolehkode, c1.knama AS wodimintaolehnama, c2.kkode AS womintakekode, c2.knama AS womintakenama, we.wenama AS woestimasikerjanama, bom.bomnotransaksi AS wonotransaksibom, pdr.pdrnotransaksi AS wonotransaksipdr, st1.nama AS wostatusnama, st2.nama AS wostatussebelumnyanama, u1.unama AS woinputusernama, u2.unama AS womodifikasiusernama, wo.woaktivitas, pa.pakode as woaktivitaskode, pa.panama as woaktivitasnama, pc.pcwajibwo AS wojeniswajibwo, woi.idwoin AS idwoin, woi.idwo AS idwo, woi.idbarang AS idbarang, woi.namabarang AS namabarang, woi.tipebarang AS tipebarang, woi.jml AS jml, woi.satuan AS satuan, woi.nilaisatuan AS nilaisatuan, woi.jmlbarang AS jmlbarang, woi.satuanbarang AS satuanbarang, woi.matauang AS matauang, woi.kurs AS kurs, woi.harga AS harga, woi.hpppersen AS hpppersen, woi.hpp AS hpp, i.brekpersediaan AS rekpersediaan, woi.cabang AS cabang, woi.lokasi AS lokasi, woi.gudangasal AS gudangasal, woi.gudangproduksi AS gudangproduksi, woi.gudangtujuan AS gudangtujuan, woi.costcenter AS costcenter, woi.divisi AS divisi, woi.subdivisi AS subdivisi, woi.proyek AS proyek, woi.catatan AS catatan, woi.urutan AS urutan, woi.idbomin AS idbomin, woi.idpdrin AS idpdrin, woi.jmlmrs AS jmlmrs, woi.statusmrs AS statusmrs, woi.jmlmrn AS jmlmrn, woi.statusmrn AS statusmrn, woi.jmlpd AS jmlpd, woi.statuspd AS statuspd, woi.jmlrealisasi AS jmlrealisasi, woi.statusrealisasi AS statusrealisasi, woi.isclose AS isclose, woi.customtext1 AS customtext1, woi.customtext2 AS customtext2, woi.customtext3 AS customtext3, woi.customdbl1 AS customdbl1, woi.customdbl2 AS customdbl2, woi.customdbl3 AS customdbl3, woi.customdate1 AS customdate1, woi.customdate2 AS customdate2, woi.customdate3 AS customdate3, i.bkode AS kodebarang, i.bhpp AS bhpp, i.bjenis AS bjenis, i.bserial AS bserial, i.bbatch AS bbatch, cc.ccnama AS costcenternama, d.dnama AS divisinama, sd.sdnama AS subdivisinama, p.pnama AS proyeknama, wo.wonotransaksi AS notransaksi, bom2.bomnotransaksi AS bomnotransaksi, pdr2.pdrnotransaksi AS pdrnotransaksi, ((woi.jmlbarang - woi.jmlmrs) / woi.nilaisatuan) AS jmlsisamrs, ((woi.jmlbarang - woi.jmlmrn) / woi.nilaisatuan) AS jmlsisamrn, ((woi.jmlbarang - woi.jmlpd) / woi.nilaisatuan) AS jmlsisapd, ((woi.jmlbarang - woi.jmlrealisasi) / woi.nilaisatuan) AS jmlsisarealisasi from m6_wo wo join m6_wo_in woi on wo.woid = woi.idwo left join m1_branch br on wo.wocabang = br.bkode left join m1_location lc on wo.wolokasi = lc.lkode left join m1_warehouse wh1 on wo.wogudangasal = wh1.wkode left join m1_warehouse wh2 on wo.wogudangproduksi = wh2.wkode left join m1_warehouse wh3 on wo.wogudangtujuan = wh3.wkode left join m1_production_category pc on wo.wojenis = pc.pckode left join m1_contact c1 on wo.wodimintaoleh = c1.kid left join m1_contact c2 on wo.womintake = c2.kid left join m1_working_estimate we on wo.woestimasikerja = we.wekode left join m6_bom bom on wo.woidbom = bom.bomid left join m6_pdr pdr on wo.woidpdr = pdr.pdrid left join m0_status st1 on wo.wostatus = st1.kode left join m0_status st2 on wo.wostatussebelumnya = st2.kode left join m0_user u1 on wo.woinputuser = u1.userid left join m0_user u2 on wo.womodifikasiuser = u2.userid left join m1_production_activity pa on wo.woaktivitas = pa.paid left join m1_item i on woi.idbarang = i.bid left join m1_cost_center cc on woi.costcenter = cc.cckode left join m1_division d on woi.divisi = d.dkode left join m1_subdivision sd on woi.subdivisi = sd.sdkode left join m1_project p on woi.proyek = p.pkode left join m6_bom_in bomi on woi.idbomin = bomi.idbomin left join m6_bom bom2 on bomi.idbom = bom2.bomid left join m6_pdr_in pdri on woi.idpdrin = pdri.idpdrin left join m6_pdr pdr2 on pdri.idpdr = pdr2.pdrid
```

```sql
SELECT woa.*, pa.pakode AS kodeaktivitas, m.mnama AS namamesin FROM m6_wo_activity woa JOIN m6_wo wo ON woa.idwo = wo.woid JOIN m1_production_activity pa ON woa.idpa = pa.paid LEFT JOIN m1_machine m ON woa.kodemesin = m.mkode
```

```sql
SELECT wrc.* FROM m6_wo_route_card wrc JOIN m6_wo wo ON wrc.idwo = wo.woid
```

```sql
select wo.woid AS woid, wo.wocabang AS wocabang, wo.wolokasi AS wolokasi, wo.wogudangasal AS wogudangasal, wo.wogudangproduksi AS wogudangproduksi, wo.wogudangtujuan AS wogudangtujuan, wo.wosumber AS wosumber, wo.wojenis AS wojenis, wo.woautonotransaksi AS woautonotransaksi, wo.wonotransaksi AS wonotransaksi, wo.wotgl AS wotgl, wo.wokodepa AS wokodepa, wo.wodimintaoleh AS wodimintaoleh, wo.wodimintaolehkontak AS wodimintaolehkontak, wo.womintake AS womintake, wo.wotgldipakai AS wotgldipakai, wo.woestimasikerja AS woestimasikerja, wo.womatauang AS womatauang, wo.wokurs AS wokurs, wo.wototalhargain AS wototalhargain, wo.wototalhargaout AS wototalhargaout, wo.wototalhppin AS wototalhppin, wo.wototalhppout AS wototalhppout, wo.wouraian AS wouraian, wo.wocatatan AS wocatatan, wo.wonoref AS wonoref, wo.wotglnoref AS wotglnoref, wo.woidbom AS woidbom, wo.woidpdr AS woidpdr, wo.wostatusmrsin AS wostatusmrsin, wo.wostatusmrsout AS wostatusmrsout, wo.wostatusmrnin AS wostatusmrnin, wo.wostatusmrnout AS wostatusmrnout, wo.wostatuspdin AS wostatuspdin, wo.wostatuspdout AS wostatuspdout, wo.wostatusrealisasiin AS wostatusrealisasiin, wo.wostatusrealisasiout AS wostatusrealisasiout, wo.wostatus AS wostatus, wo.wostatussebelumnya AS wostatussebelumnya, wo.wojmlrevisi AS wojmlrevisi, wo.wocetakanke AS wocetakanke, wo.woinputuser AS woinputuser, wo.woinputtgl AS woinputtgl, wo.womodifikasiuser AS womodifikasiuser, wo.womodifikasitgl AS womodifikasitgl, wo.woposting AS woposting, wo.wopostingtgl AS wopostingtgl, wo.woisclose AS woisclose, br.bnama AS wocabangnama, lc.lnama AS wolokasinama, wh1.wnama AS wogudangasalnama, wh2.wnama AS wogudangproduksinama, wh3.wnama AS wogudangtujuannama, pc.pcnama AS wojenisnama, c1.kkode AS wodimintaolehkode, c1.knama AS wodimintaolehnama, c2.kkode AS womintakekode, c2.knama AS womintakenama, we.wenama AS woestimasikerjanama, bom.bomnotransaksi AS wonotransaksibom, pdr.pdrnotransaksi AS wonotransaksipdr, st1.nama AS wostatusnama, st2.nama AS wostatussebelumnyanama, u1.unama AS woinputusernama, u2.unama AS womodifikasiusernama, wo.woaktivitas, pa.pakode as woaktivitaskode, pa.panama as woaktivitasnama from m6_wo wo left join m1_branch br on wo.wocabang = br.bkode left join m1_location lc on wo.wolokasi = lc.lkode left join m1_warehouse wh1 on wo.wogudangasal = wh1.wkode left join m1_warehouse wh2 on wo.wogudangproduksi = wh2.wkode left join m1_warehouse wh3 on wo.wogudangtujuan = wh3.wkode left join m1_production_category pc on wo.wojenis = pc.pckode left join m1_contact c1 on wo.wodimintaoleh = c1.kid left join m1_contact c2 on wo.womintake = c2.kid left join m1_working_estimate we on wo.woestimasikerja = we.wekode left join m6_bom bom on wo.woidbom = bom.bomid left join m6_pdr pdr on wo.woidpdr = pdr.pdrid left join m0_status st1 on wo.wostatus = st1.kode left join m0_status st2 on wo.wostatussebelumnya = st2.kode left join m0_user u1 on wo.woinputuser = u1.userid left join m0_user u2 on wo.womodifikasiuser = u2.userid left join m1_production_activity pa on wo.woaktivitas = pa.paid
```

```sql
SELECT bomin.idbomin, (bomin.jmlbarang) as sisarealisasi, i.bid, i.bkode FROM m6_bom_in AS bomin INNER JOIN m1_item AS i ON bomin.idbarang = i.bid WHERE
```

```sql
SELECT bomout.idbomout, (bomout.jmlbarang) as sisarealisasi, i.bid, i.bkode FROM m6_bom_out AS bomout INNER JOIN m1_item AS i ON bomout.idbarang = i.bid WHERE
```

```sql
SELECT pdrin.idpdrin, (pdrin.jmlbarang - pdrin.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m6_pdr_in AS pdrin INNER JOIN m1_item AS i ON pdrin.idbarang = i.bid WHERE
```

```sql
SELECT pdrout.idpdrout, (pdrout.jmlbarang - pdrout.jmlrealisasi) as sisarealisasi, i.bid, i.bkode FROM m6_pdr_out AS pdrout INNER JOIN m1_item AS i ON pdrout.idbarang = i.bid WHERE
```

```sql
select wo.woid AS woid, wo.wocabang AS wocabang, wo.wolokasi AS wolokasi, wo.wogudangasal AS wogudangasal, wo.wogudangproduksi AS wogudangproduksi, wo.wogudangtujuan AS wogudangtujuan, wo.wosumber AS wosumber, wo.wojenis AS wojenis, wo.woautonotransaksi AS woautonotransaksi, wo.wonotransaksi AS wonotransaksi, wo.wotgl AS wotgl, woin.idbarang AS idbarang, woin.namabarang, woin.tipebarang, wrc.jml, i.bkode, woin.satuan, woin.nilaisatuan, woin.jmlbarang, woin.satuanbarang, woin.idwoin, woin.satuanbarang, woin.harga, woin.hpppersen, woin.hpp, woin.rekpersediaan, woin.gudangasal, woin.gudangproduksi, woin.gudangtujuan, woin.costcenter, woin.divisi, woin.subdivisi, woin.proyek, woin.catatan, woin.urutan, i.bsatuanlapangan, i.bserial, i.bbatch, i.bjmllapangan FROM m6_wo wo LEFT JOIN m6_wo_in woin ON wo.woid = woin.idwo LEFT JOIN m6_wo_route_card wrc ON wo.woid = wrc.idwo LEFT JOIN m1_item i ON i.bid = woin.idbarang
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_wo_history.vb`

```sql
SELECT woidhistory FROM m6_wo_history WHERE woid = '{idtransaksi}' ORDER BY womodifikasitgl DESC LIMIT 1
```

## INSERT

Total: `47`

### `client-backend/api-myerpplus/app_code/ws/m6/m6_bom.vb`

```sql
Insert into M6_Bom (bomcabang, bomlokasi, bomgudangasal, bomgudangproduksi, bomgudangtujuan, bomsumber, bomjenis, bomautonotransaksi, bomnotransaksi, bomtgl, bomkodepa, bompembuat, bompembuatkontak, bomestimasikerja, bommatauang, bomkurs, bomtotalhargain, bomtotalhargaout, bomtotalhppin, bomtotalhppout, bomuraian, bomcatatan, bomnoref, bomtglnoref, bomstatus, bomstatussebelumnya, bomjmlrevisi, bomcetakanke, bominputuser, bominputtgl, bommodifikasiuser, bommodifikasitgl, bomcustomtext1, bomcustomtext2, bomcustomtext3, bomcustomtext4, bomcustomtext5, bomcustomint1, bomcustomint2, bomcustomint3, bomcustomdbl1, bomcustomdbl2, bomcustomdbl3, bomcustomdate1, bomcustomdate2, bomcustomdate3, bomaktivitas) values('{FixQuotes_drutama}bomcabang', '{FixQuotes_drutama}bomlokasi', '{FixQuotes_drutama}bomgudangasal', '{FixQuotes_drutama}bomgudangproduksi', '{FixQuotes_drutama}bomgudangtujuan', '{FixQuotes_drutama}bomsumber', '{FixQuotes_drutama}bomjenis', {drutama}bomautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}bomtgl', {drutama}bomkodepa, {drutama}bompembuat, '{FixQuotes_drutama}bompembuatkontak', '{FixQuotes_drutama}bomestimasikerja', '{FixQuotes_drutama}bommatauang', '{FixDouble_drutama}bomkurs', '{FixDouble_drutama}bomtotalhargain', '{FixDouble_drutama}bomtotalhargaout', '{FixDouble_drutama}bomtotalhppin', '{FixDouble_drutama}bomtotalhppout', '{FixQuotes_drutama}bomuraian', '{FixQuotes_drutama}bomcatatan', '{FixQuotes_drutama}bomnoref', '{FixQuotes_AsFormatTanggal_drutama}bomtglnoref', {drutama}bomstatus, {drutama}bomstatussebelumnya, {drutama}bomjmlrevisi, {drutama}bomcetakanke, {drutama}bominputuser, NOW(), {drutama}bommodifikasiuser, '1971-01-01 00:00:00', '{FixQuotes_drutama}bomcustomtext1', '{FixQuotes_drutama}bomcustomtext2', '{FixQuotes_drutama}bomcustomtext3', '{FixQuotes_drutama}bomcustomtext4', '{FixQuotes_drutama}bomcustomtext5', {drutama}bomcustomint1, {drutama}bomcustomint2, {drutama}bomcustomint3, '{FixDouble_drutama}bomcustomdbl1', '{FixDouble_drutama}bomcustomdbl2', '{FixDouble_drutama}bomcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}bomcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}bomcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}bomcustomdate3', '{FixDouble_drutama}bomaktivitas')
```

```sql
Insert into M6_Bom_In(idbomin, idbom, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, harga, hpppersen, hpp, rekpersediaan, cabang, lokasi, gudangasal, gudangproduksi, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
Insert into M6_Bom_Out(idbomout, idbom, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, harga, hpp, idhppkhususmasuk, idhppfifomasuk, rekpersediaan, cabang, lokasi, gudangasal, gudangproduksi, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
INSERT INTO m6_itembom_in (SELECT idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, harga, hpppersen, hpp, rekpersediaan, cabang, lokasi, gudangasal, gudangproduksi, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idbom, idbomin, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3 FROM m6_bom_in bomin WHERE bomin.idbom = '{result_4}')
```

```sql
INSERT INTO m6_itembom_out (SELECT '{FixDouble_idbaranghasil}', idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, harga, hpp, idhppkhususmasuk, idhppfifomasuk, rekpersediaan, cabang, lokasi, gudangasal, gudangproduksi, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idbom, idbomout, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3 FROM m6_bom_out bomout WHERE bomout.idbom = '{result_4}')
```

```sql
INSERT INTO m6_itembom_in (SELECT idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, harga, hpppersen, hpp, rekpersediaan, cabang, lokasi, gudangasal, gudangproduksi, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idbom, idbomin, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3 FROM m6_bom_in bomin WHERE bomin.idbom = '{idbom}')
```

```sql
INSERT INTO m6_itembom_out (SELECT '{FixDouble_idBarangHasil}', idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, harga, hpp, idhppkhususmasuk, idhppfifomasuk, rekpersediaan, cabang, lokasi, gudangasal, gudangproduksi, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idbom, idbomout, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3 FROM m6_bom_out bomout WHERE bomout.idbom = '{idbom}')
```

```sql
Insert into M6_Bom (bomcabang, bomlokasi, bomgudangasal, bomgudangproduksi, bomgudangtujuan, bomsumber, bomjenis, bomautonotransaksi, bomnotransaksi, bomtgl, bomkodepa, bompembuat, bompembuatkontak, bomestimasikerja, bommatauang, bomkurs, bomtotalhargain, bomtotalhargaout, bomtotalhppin, bomtotalhppout, bomuraian, bomcatatan, bomnoref, bomtglnoref, bomstatus, bomstatussebelumnya, bomjmlrevisi, bomcetakanke, bominputuser, bominputtgl, bommodifikasiuser, bommodifikasitgl, bomcustomtext1, bomcustomtext2, bomcustomtext3, bomcustomtext4, bomcustomtext5, bomcustomint1, bomcustomint2, bomcustomint3, bomcustomdbl1, bomcustomdbl2, bomcustomdbl3, bomcustomdate1, bomcustomdate2, bomcustomdate3) values('{FixQuotes_drutama}bomcabang', '{FixQuotes_drutama}bomlokasi', '{FixQuotes_drutama}bomgudangasal', '{FixQuotes_drutama}bomgudangproduksi', '{FixQuotes_drutama}bomgudangtujuan', '{FixQuotes_drutama}bomsumber', '{FixQuotes_drutama}bomjenis', {drutama}bomautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}bomtgl', {drutama}bomkodepa, {drutama}bompembuat, '{FixQuotes_drutama}bompembuatkontak', '{FixQuotes_drutama}bomestimasikerja', '{FixQuotes_drutama}bommatauang', '{FixDouble_drutama}bomkurs', '{FixDouble_drutama}bomtotalhargain', '{FixDouble_drutama}bomtotalhargaout', '{FixDouble_drutama}bomtotalhppin', '{FixDouble_drutama}bomtotalhppout', '{FixQuotes_drutama}bomuraian', '{FixQuotes_drutama}bomcatatan', '{FixQuotes_drutama}bomnoref', '{FixQuotes_AsFormatTanggal_drutama}bomtglnoref', {drutama}bomstatus, {drutama}bomstatussebelumnya, {drutama}bomjmlrevisi, {drutama}bomcetakanke, {drutama}bominputuser, NOW(), {drutama}bommodifikasiuser, '1971-01-01 00:00:00', '{FixQuotes_drutama}bomcustomtext1', '{FixQuotes_drutama}bomcustomtext2', '{FixQuotes_drutama}bomcustomtext3', '{FixQuotes_drutama}bomcustomtext4', '{FixQuotes_drutama}bomcustomtext5', {drutama}bomcustomint1, {drutama}bomcustomint2, {drutama}bomcustomint3, '{FixDouble_drutama}bomcustomdbl1', '{FixDouble_drutama}bomcustomdbl2', '{FixDouble_drutama}bomcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}bomcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}bomcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}bomcustomdate3')
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_bom_history.vb`

```sql
INSERT INTO m6_bom_history(SELECT 0, bom.* FROM m6_bom bom WHERE bom.bomid = '{idtransaksi}')
```

```sql
INSERT INTO m6_bom_in_history (SELECT 0, '{result_4}', bom.* FROM m6_bom_in bom WHERE bom.idbom = '{idtransaksi}' )
```

```sql
INSERT INTO m6_bom_out_history (SELECT 0, '{result_4}', bom.* FROM m6_bom_out bom WHERE bom.idbom = '{idtransaksi}' )
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_files.vb`

```sql
Insert into M6_Files(fsumber, fidtransaksi, fnamafile, fcatatan, fukuranfile, ftanggal, finputuser, finputtgl) values{strValue1_ToString}
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_mrn.vb`

```sql
Insert into M6_Mrn (mrncabang, mrnlokasi, mrngudangasal, mrngudangproduksi, mrngudangtujuan, mrnsumber, mrnjenis, mrnautonotransaksi, mrnnotransaksi, mrntgl, mrnkodepa, mrnbagianmrn, mrnbagianmrnkontak, mrntgldipakai, mrnestimasikerja, mrnmatauang, mrnkurs, mrntotalhargain, mrntotalhargaout, mrntotalhppin, mrntotalhppout, mrnuraian, mrncatatan, mrnnoref, mrntglnoref, mrnidbom, mrnidpdr, mrnidwo, mrnidmrs, mrnstatuspdin, mrnstatuspdout, mrnstatus, mrnstatussebelumnya, mrnjmlrevisi, mrncetakanke, mrninputuser, mrninputtgl, mrnmodifikasiuser, mrnmodifikasitgl, mrnisclose, mrncustomtext1, mrncustomtext2, mrncustomtext3, mrncustomtext4, mrncustomtext5, mrncustomint1, mrncustomint2, mrncustomint3, mrncustomdbl1, mrncustomdbl2, mrncustomdbl3, mrncustomdate1, mrncustomdate2, mrncustomdate3, mrnaktivitas) values('{FixQuotes_drutama}mrncabang', '{FixQuotes_drutama}mrnlokasi', '{FixQuotes_drutama}mrngudangasal', '{FixQuotes_drutama}mrngudangproduksi', '{FixQuotes_drutama}mrngudangtujuan', '{FixQuotes_drutama}mrnsumber', '{FixQuotes_drutama}mrnjenis', {drutama}mrnautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}mrntgl', {drutama}mrnkodepa, {drutama}mrnbagianmrn, '{FixQuotes_drutama}mrnbagianmrnkontak', '{FixQuotes_AsFormatTanggal_drutama}mrntgldipakai', '{FixQuotes_drutama}mrnestimasikerja', '{FixQuotes_drutama}mrnmatauang', '{FixDouble_drutama}mrnkurs', '{FixDouble_drutama}mrntotalhargain', '{FixDouble_drutama}mrntotalhargaout', '{FixDouble_drutama}mrntotalhppin', '{FixDouble_drutama}mrntotalhppout', '{FixQuotes_drutama}mrnuraian', '{FixQuotes_drutama}mrncatatan', '{FixQuotes_drutama}mrnnoref', '{FixQuotes_AsFormatTanggal_drutama}mrntglnoref', {drutama}mrnidbom, {drutama}mrnidpdr, {drutama}mrnidwo, {drutama}mrnidmrs, {drutama}mrnstatuspdin, {drutama}mrnstatuspdout, {drutama}mrnstatus, {drutama}mrnstatussebelumnya, {drutama}mrnjmlrevisi, {drutama}mrncetakanke, {drutama}mrninputuser, NOW(), {drutama}mrnmodifikasiuser, '1971-01-01 00:00:00', {drutama}mrnisclose, '{FixQuotes_drutama}mrncustomtext1', '{FixQuotes_drutama}mrncustomtext2', '{FixQuotes_drutama}mrncustomtext3', '{FixQuotes_drutama}mrncustomtext4', '{FixQuotes_drutama}mrncustomtext5', {drutama}mrncustomint1, {drutama}mrncustomint2, {drutama}mrncustomint3, '{FixDouble_drutama}mrncustomdbl1', '{FixDouble_drutama}mrncustomdbl2', '{FixDouble_drutama}mrncustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}mrncustomdate1', '{FixQuotes_AsFormatTanggal_drutama}mrncustomdate2', '{FixQuotes_AsFormatTanggal_drutama}mrncustomdate3', '{FixDouble_drutama}mrnaktivitas')
```

```sql
Insert into M6_Mrn_Out(idmrnout, idmrn, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, harga, hpp, idhppkhususkeluar, idhppfifokeluar, rekpersediaan, cabang, lokasi, gudangasal, gudangproduksi, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idbomout, idpdrout, idwoout, idmrsout, jmlpd, statuspd, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
Insert into M6_Mrn (mrncabang, mrnlokasi, mrngudangasal, mrngudangproduksi, mrngudangtujuan, mrnsumber, mrnjenis, mrnautonotransaksi, mrnnotransaksi, mrntgl, mrnkodepa, mrnbagianmrn, mrnbagianmrnkontak, mrntgldipakai, mrnestimasikerja, mrnmatauang, mrnkurs, mrntotalhargain, mrntotalhargaout, mrntotalhppin, mrntotalhppout, mrnuraian, mrncatatan, mrnnoref, mrntglnoref, mrnidbom, mrnidpdr, mrnidwo, mrnidmrs, mrnstatuspdin, mrnstatuspdout, mrnstatus, mrnstatussebelumnya, mrnjmlrevisi, mrncetakanke, mrninputuser, mrninputtgl, mrnmodifikasiuser, mrnmodifikasitgl, mrnisclose, mrncustomtext1, mrncustomtext2, mrncustomtext3, mrncustomtext4, mrncustomtext5, mrncustomint1, mrncustomint2, mrncustomint3, mrncustomdbl1, mrncustomdbl2, mrncustomdbl3, mrncustomdate1, mrncustomdate2, mrncustomdate3) values('{FixQuotes_drutama}mrncabang', '{FixQuotes_drutama}mrnlokasi', '{FixQuotes_drutama}mrngudangasal', '{FixQuotes_drutama}mrngudangproduksi', '{FixQuotes_drutama}mrngudangtujuan', '{FixQuotes_drutama}mrnsumber', '{FixQuotes_drutama}mrnjenis', {drutama}mrnautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}mrntgl', {drutama}mrnkodepa, {drutama}mrnbagianmrn, '{FixQuotes_drutama}mrnbagianmrnkontak', '{FixQuotes_AsFormatTanggal_drutama}mrntgldipakai', '{FixQuotes_drutama}mrnestimasikerja', '{FixQuotes_drutama}mrnmatauang', '{FixDouble_drutama}mrnkurs', '{FixDouble_drutama}mrntotalhargain', '{FixDouble_drutama}mrntotalhargaout', '{FixDouble_drutama}mrntotalhppin', '{FixDouble_drutama}mrntotalhppout', '{FixQuotes_drutama}mrnuraian', '{FixQuotes_drutama}mrncatatan', '{FixQuotes_drutama}mrnnoref', '{FixQuotes_AsFormatTanggal_drutama}mrntglnoref', {drutama}mrnidbom, {drutama}mrnidpdr, {drutama}mrnidwo, {drutama}mrnidmrs, {drutama}mrnstatuspdin, {drutama}mrnstatuspdout, {drutama}mrnstatus, {drutama}mrnstatussebelumnya, {drutama}mrnjmlrevisi, {drutama}mrncetakanke, {drutama}mrninputuser, NOW(), {drutama}mrnmodifikasiuser, '1971-01-01 00:00:00', {drutama}mrnisclose, '{FixQuotes_drutama}mrncustomtext1', '{FixQuotes_drutama}mrncustomtext2', '{FixQuotes_drutama}mrncustomtext3', '{FixQuotes_drutama}mrncustomtext4', '{FixQuotes_drutama}mrncustomtext5', {drutama}mrncustomint1, {drutama}mrncustomint2, {drutama}mrncustomint3, '{FixDouble_drutama}mrncustomdbl1', '{FixDouble_drutama}mrncustomdbl2', '{FixDouble_drutama}mrncustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}mrncustomdate1', '{FixQuotes_AsFormatTanggal_drutama}mrncustomdate2', '{FixQuotes_AsFormatTanggal_drutama}mrncustomdate3')
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_mrn_history.vb`

```sql
INSERT INTO m6_mrn_history(SELECT 0, mrn.* FROM m6_mrn mrn WHERE mrn.mrnid = '{idtransaksi}')
```

```sql
INSERT INTO m6_mrn_out_history (SELECT 0, '{result_4}', mrn.* FROM m6_mrn_out mrn WHERE mrn.idmrn = '{idtransaksi}' )
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_mrs.vb`

```sql
Insert into M6_Mrs (mrscabang, mrslokasi, mrsgudangasal, mrsgudangproduksi, mrsgudangtujuan, mrssumber, mrsjenis, mrsautonotransaksi, mrsnotransaksi, mrstgl, mrskodepa, mrsbagianmrs, mrsbagianmrskontak, mrstgldipakai, mrsestimasikerja, mrsmatauang, mrskurs, mrstotalhargain, mrstotalhargaout, mrstotalhppin, mrstotalhppout, mrsuraian, mrscatatan, mrsnoref, mrstglnoref, mrsidbom, mrsidpdr, mrsidwo, mrsstatusmrnin, mrsstatusmrnout, mrsstatuspdin, mrsstatuspdout, mrsstatus, mrsstatussebelumnya, mrsjmlrevisi, mrscetakanke, mrsinputuser, mrsinputtgl, mrsmodifikasiuser, mrsmodifikasitgl, mrsisclose, mrscustomtext1, mrscustomtext2, mrscustomtext3, mrscustomtext4, mrscustomtext5, mrscustomint1, mrscustomint2, mrscustomint3, mrscustomdbl1, mrscustomdbl2, mrscustomdbl3, mrscustomdate1, mrscustomdate2, mrscustomdate3, mrsaktivitas) values('{FixQuotes_drutama}mrscabang', '{FixQuotes_drutama}mrslokasi', '{FixQuotes_drutama}mrsgudangasal', '{FixQuotes_drutama}mrsgudangproduksi', '{FixQuotes_drutama}mrsgudangtujuan', '{FixQuotes_drutama}mrssumber', '{FixQuotes_drutama}mrsjenis', {drutama}mrsautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}mrstgl', {drutama}mrskodepa, {drutama}mrsbagianmrs, '{FixQuotes_drutama}mrsbagianmrskontak', '{FixQuotes_AsFormatTanggal_drutama}mrstgldipakai', '{FixQuotes_drutama}mrsestimasikerja', '{FixQuotes_drutama}mrsmatauang', '{FixDouble_drutama}mrskurs', '{FixDouble_drutama}mrstotalhargain', '{FixDouble_drutama}mrstotalhargaout', '{FixDouble_drutama}mrstotalhppin', '{FixDouble_drutama}mrstotalhppout', '{FixQuotes_drutama}mrsuraian', '{FixQuotes_drutama}mrscatatan', '{FixQuotes_drutama}mrsnoref', '{FixQuotes_AsFormatTanggal_drutama}mrstglnoref', {drutama}mrsidbom, {drutama}mrsidpdr, {drutama}mrsidwo, {drutama}mrsstatusmrnin, {drutama}mrsstatusmrnout, {drutama}mrsstatuspdin, {drutama}mrsstatuspdout, {drutama}mrsstatus, {drutama}mrsstatussebelumnya, {drutama}mrsjmlrevisi, {drutama}mrscetakanke, {drutama}mrsinputuser, NOW(), {drutama}mrsmodifikasiuser, '1971-01-01 00:00:00', {drutama}mrsisclose, '{FixQuotes_drutama}mrscustomtext1', '{FixQuotes_drutama}mrscustomtext2', '{FixQuotes_drutama}mrscustomtext3', '{FixQuotes_drutama}mrscustomtext4', '{FixQuotes_drutama}mrscustomtext5', {drutama}mrscustomint1, {drutama}mrscustomint2, {drutama}mrscustomint3, '{FixDouble_drutama}mrscustomdbl1', '{FixDouble_drutama}mrscustomdbl2', '{FixDouble_drutama}mrscustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}mrscustomdate1', '{FixQuotes_AsFormatTanggal_drutama}mrscustomdate2', '{FixQuotes_AsFormatTanggal_drutama}mrscustomdate3', '{FixDouble_drutama}mrsaktivitas')
```

```sql
Insert into M6_Mrs_Out(idmrsout, idmrs, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, harga, hpp, idhppkhususmasuk, idhppfifomasuk, rekpersediaan, cabang, lokasi, gudangasal, gudangproduksi, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idbomout, idpdrout, idwoout, jmlmrn, statusmrn, jmlpd, statuspd, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
Insert into M6_Mrs (mrscabang, mrslokasi, mrsgudangasal, mrsgudangproduksi, mrsgudangtujuan, mrssumber, mrsjenis, mrsautonotransaksi, mrsnotransaksi, mrstgl, mrskodepa, mrsbagianmrs, mrsbagianmrskontak, mrstgldipakai, mrsestimasikerja, mrsmatauang, mrskurs, mrstotalhargain, mrstotalhargaout, mrstotalhppin, mrstotalhppout, mrsuraian, mrscatatan, mrsnoref, mrstglnoref, mrsidbom, mrsidpdr, mrsidwo, mrsstatusmrnin, mrsstatusmrnout, mrsstatuspdin, mrsstatuspdout, mrsstatus, mrsstatussebelumnya, mrsjmlrevisi, mrscetakanke, mrsinputuser, mrsinputtgl, mrsmodifikasiuser, mrsmodifikasitgl, mrsisclose, mrscustomtext1, mrscustomtext2, mrscustomtext3, mrscustomtext4, mrscustomtext5, mrscustomint1, mrscustomint2, mrscustomint3, mrscustomdbl1, mrscustomdbl2, mrscustomdbl3, mrscustomdate1, mrscustomdate2, mrscustomdate3) values('{FixQuotes_drutama}mrscabang', '{FixQuotes_drutama}mrslokasi', '{FixQuotes_drutama}mrsgudangasal', '{FixQuotes_drutama}mrsgudangproduksi', '{FixQuotes_drutama}mrsgudangtujuan', '{FixQuotes_drutama}mrssumber', '{FixQuotes_drutama}mrsjenis', {drutama}mrsautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}mrstgl', {drutama}mrskodepa, {drutama}mrsbagianmrs, '{FixQuotes_drutama}mrsbagianmrskontak', '{FixQuotes_AsFormatTanggal_drutama}mrstgldipakai', '{FixQuotes_drutama}mrsestimasikerja', '{FixQuotes_drutama}mrsmatauang', '{FixDouble_drutama}mrskurs', '{FixDouble_drutama}mrstotalhargain', '{FixDouble_drutama}mrstotalhargaout', '{FixDouble_drutama}mrstotalhppin', '{FixDouble_drutama}mrstotalhppout', '{FixQuotes_drutama}mrsuraian', '{FixQuotes_drutama}mrscatatan', '{FixQuotes_drutama}mrsnoref', '{FixQuotes_AsFormatTanggal_drutama}mrstglnoref', {drutama}mrsidbom, {drutama}mrsidpdr, {drutama}mrsidwo, {drutama}mrsstatusmrnin, {drutama}mrsstatusmrnout, {drutama}mrsstatuspdin, {drutama}mrsstatuspdout, {drutama}mrsstatus, {drutama}mrsstatussebelumnya, {drutama}mrsjmlrevisi, {drutama}mrscetakanke, {drutama}mrsinputuser, NOW(), {drutama}mrsmodifikasiuser, '1971-01-01 00:00:00', {drutama}mrsisclose, '{FixQuotes_drutama}mrscustomtext1', '{FixQuotes_drutama}mrscustomtext2', '{FixQuotes_drutama}mrscustomtext3', '{FixQuotes_drutama}mrscustomtext4', '{FixQuotes_drutama}mrscustomtext5', {drutama}mrscustomint1, {drutama}mrscustomint2, {drutama}mrscustomint3, '{FixDouble_drutama}mrscustomdbl1', '{FixDouble_drutama}mrscustomdbl2', '{FixDouble_drutama}mrscustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}mrscustomdate1', '{FixQuotes_AsFormatTanggal_drutama}mrscustomdate2', '{FixQuotes_AsFormatTanggal_drutama}mrscustomdate3')
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_mrs_history.vb`

```sql
INSERT INTO m6_mrs_history(SELECT 0, mrs.* FROM m6_mrs mrs WHERE mrs.mrsid = '{idtransaksi}')
```

```sql
INSERT INTO m6_mrs_out_history (SELECT 0, '{result_4}', mrs.* FROM m6_mrs_out mrs WHERE mrs.idmrs = '{idtransaksi}' )
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_notes.vb`

```sql
Insert into M6_Notes (nsumber, nidtransaksi, ncatatan, ninputuser, ninputtgl, nmodifikasiuser, nmodifikasitgl) values('{FixQuotes_dataUtama_1}', {dataUtama_2}, '{FixQuotes_dataUtama_3}', {dataUtama_4}, NOW(), {dataUtama_6}, '1971-01-01 00:00:00')
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_pd.vb`

```sql
Insert into M6_Pd (pdcabang, pdlokasi, pdgudangasal, pdgudangproduksi, pdgudangtujuan, pdsumber, pdjenis, pdautonotransaksi, pdnotransaksi, pdtgl, pdkodepa, pdbagianpd, pdbagianpdkontak, pdtgldipakai, pdestimasikerja, pdmatauang, pdkurs, pdtotalhargain, pdtotalhargaout, pdtotalhppin, pdtotalhppout, pduraian, pdcatatan, pdnoref, pdtglnoref, pdidbom, pdidpdr, pdidwo, pdidmrs, pdidmrn, pdstatus, pdstatussebelumnya, pdjmlrevisi, pdcetakanke, pdinputuser, pdinputtgl, pdmodifikasiuser, pdmodifikasitgl, pdposting, pdtutupperiode, pdisclose, pdcustomtext1, pdcustomtext2, pdcustomtext3, pdcustomtext4, pdcustomtext5, pdcustomint1, pdcustomint2, pdcustomint3, pdcustomdbl1, pdcustomdbl2, pdcustomdbl3, pdcustomdate1, pdcustomdate2, pdcustomdate3, pdaktivitas) values('{FixQuotes_drutama}pdcabang', '{FixQuotes_drutama}pdlokasi', '{FixQuotes_drutama}pdgudangasal', '{FixQuotes_drutama}pdgudangproduksi', '{FixQuotes_drutama}pdgudangtujuan', '{FixQuotes_drutama}pdsumber', '{FixQuotes_drutama}pdjenis', {drutama}pdautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}pdtgl', {drutama}pdkodepa, {drutama}pdbagianpd, '{FixQuotes_drutama}pdbagianpdkontak', '{FixQuotes_AsFormatTanggal_drutama}pdtgldipakai', '{FixQuotes_drutama}pdestimasikerja', '{FixQuotes_drutama}pdmatauang', '{FixDouble_drutama}pdkurs', '{FixDouble_drutama}pdtotalhargain', '{FixDouble_drutama}pdtotalhargaout', '{FixDouble_drutama}pdtotalhppin', '{FixDouble_drutama}pdtotalhppout', '{FixQuotes_drutama}pduraian', '{FixQuotes_drutama}pdcatatan', '{FixQuotes_drutama}pdnoref', '{FixQuotes_AsFormatTanggal_drutama}pdtglnoref', {drutama}pdidbom, {drutama}pdidpdr, {drutama}pdidwo, {drutama}pdidmrs, {drutama}pdidmrn, {drutama}pdstatus, {drutama}pdstatussebelumnya, {drutama}pdjmlrevisi, {drutama}pdcetakanke, {drutama}pdinputuser, NOW(), {drutama}pdmodifikasiuser, '1971-01-01 00:00:00', 0, {drutama}pdtutupperiode, {drutama}pdisclose, '{FixQuotes_drutama}pdcustomtext1', '{FixQuotes_drutama}pdcustomtext2', '{FixQuotes_drutama}pdcustomtext3', '{FixQuotes_drutama}pdcustomtext4', '{FixQuotes_drutama}pdcustomtext5', {drutama}pdcustomint1, {drutama}pdcustomint2, {drutama}pdcustomint3, '{FixDouble_drutama}pdcustomdbl1', '{FixDouble_drutama}pdcustomdbl2', '{FixDouble_drutama}pdcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}pdcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}pdcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}pdcustomdate3', '{FixDouble_drutama}pdaktivitas')
```

```sql
Insert into M6_Pd_In(idpdin, idpd, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, harga, hpppersen, hpp, rekpersediaan, cabang, lokasi, gudangasal, gudangproduksi, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idbomin, idpdrin, idwoin, idmrsin, idmrnin, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
Insert into M6_Pd_Out(idpdout, idpd, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, harga, hpp, idhppkhususmasuk, idhppfifomasuk, rekpersediaan, cabang, lokasi, gudangasal, gudangproduksi, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idbomout, idpdrout, idwoout, idmrsout, idmrnout, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
INSERT INTO m6_pd_bom(SELECT '{FixDouble_result_4}' as idpd, ibomout.idbaranghasil, ibomout.idbarang, ibomout.namabarang, ibomout.tipebarang, (CASE {strJml} END) as jml, ibomout.satuan, ibomout.nilaisatuan, (CASE {strJmlbarang} END) as jmlbarang, ibomout.satuanbarang, ibomout.matauang, ibomout.kurs, ibomout.harga, ibomout.hpp, ibomout.idhppkhususmasuk, ibomout.idhppfifomasuk, ibomout.rekpersediaan, ibomout.cabang, ibomout.lokasi, ibomout.gudangasal, ibomout.gudangproduksi, ibomout.gudangtujuan, ibomout.costcenter, ibomout.divisi, ibomout.subdivisi, ibomout.proyek, ibomout.catatan, ibomout.urutan, ibomout.idbom, ibomout.idbomout, ibomout.customtext1, ibomout.customtext2, ibomout.customtext3, ibomout.customdbl1, ibomout.customdbl2, ibomout.customdbl3, ibomout.customdate1, ibomout.customdate2, ibomout.customdate3 FROM m6_itembom_out ibomout JOIN m6_itembom_in ibomin ON ibomout.idbaranghasil = ibomin.idbarang WHERE {ftBarangBom} )
```

```sql
Insert into M6_Pd (pdcabang, pdlokasi, pdgudangasal, pdgudangproduksi, pdgudangtujuan, pdsumber, pdjenis, pdautonotransaksi, pdnotransaksi, pdtgl, pdkodepa, pdbagianpd, pdbagianpdkontak, pdtgldipakai, pdestimasikerja, pdmatauang, pdkurs, pdtotalhargain, pdtotalhargaout, pdtotalhppin, pdtotalhppout, pduraian, pdcatatan, pdnoref, pdtglnoref, pdidbom, pdidpdr, pdidwo, pdidmrs, pdidmrn, pdstatus, pdstatussebelumnya, pdjmlrevisi, pdcetakanke, pdinputuser, pdinputtgl, pdmodifikasiuser, pdmodifikasitgl, pdposting, pdtutupperiode, pdisclose, pdcustomtext1, pdcustomtext2, pdcustomtext3, pdcustomtext4, pdcustomtext5, pdcustomint1, pdcustomint2, pdcustomint3, pdcustomdbl1, pdcustomdbl2, pdcustomdbl3, pdcustomdate1, pdcustomdate2, pdcustomdate3) values('{FixQuotes_drutama}pdcabang', '{FixQuotes_drutama}pdlokasi', '{FixQuotes_drutama}pdgudangasal', '{FixQuotes_drutama}pdgudangproduksi', '{FixQuotes_drutama}pdgudangtujuan', '{FixQuotes_drutama}pdsumber', '{FixQuotes_drutama}pdjenis', {drutama}pdautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}pdtgl', {drutama}pdkodepa, {drutama}pdbagianpd, '{FixQuotes_drutama}pdbagianpdkontak', '{FixQuotes_AsFormatTanggal_drutama}pdtgldipakai', '{FixQuotes_drutama}pdestimasikerja', '{FixQuotes_drutama}pdmatauang', '{FixDouble_drutama}pdkurs', '{FixDouble_drutama}pdtotalhargain', '{FixDouble_drutama}pdtotalhargaout', '{FixDouble_drutama}pdtotalhppin', '{FixDouble_drutama}pdtotalhppout', '{FixQuotes_drutama}pduraian', '{FixQuotes_drutama}pdcatatan', '{FixQuotes_drutama}pdnoref', '{FixQuotes_AsFormatTanggal_drutama}pdtglnoref', {drutama}pdidbom, {drutama}pdidpdr, {drutama}pdidwo, {drutama}pdidmrs, {drutama}pdidmrn, {drutama}pdstatus, {drutama}pdstatussebelumnya, {drutama}pdjmlrevisi, {drutama}pdcetakanke, {drutama}pdinputuser, NOW(), {drutama}pdmodifikasiuser, '1971-01-01 00:00:00', 0, {drutama}pdtutupperiode, {drutama}pdisclose, '{FixQuotes_drutama}pdcustomtext1', '{FixQuotes_drutama}pdcustomtext2', '{FixQuotes_drutama}pdcustomtext3', '{FixQuotes_drutama}pdcustomtext4', '{FixQuotes_drutama}pdcustomtext5', {drutama}pdcustomint1, {drutama}pdcustomint2, {drutama}pdcustomint3, '{FixDouble_drutama}pdcustomdbl1', '{FixDouble_drutama}pdcustomdbl2', '{FixDouble_drutama}pdcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}pdcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}pdcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}pdcustomdate3')
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_pd_history.vb`

```sql
INSERT INTO m6_pd_history(SELECT 0, pd.* FROM m6_pd pd WHERE pd.pdid = '{idtransaksi}')
```

```sql
INSERT INTO m6_pd_in_history (SELECT 0, '{result_4}', pd.* FROM m6_pd_in pd WHERE pd.idpd = '{idtransaksi}' )
```

```sql
INSERT INTO m6_pd_out_history (SELECT 0, '{result_4}', pd.* FROM m6_pd_out pd WHERE pd.idpd = '{idtransaksi}' )
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_pdr.vb`

```sql
Insert into M6_Pdr (pdrcabang, pdrlokasi, pdrgudangasal, pdrgudangproduksi, pdrgudangtujuan, pdrsumber, pdrjenis, pdrautonotransaksi, pdrnotransaksi, pdrtgl, pdrkodepa, pdrdimintaoleh, pdrdimintaolehkontak, pdrmintake, pdrtgldipakai, pdrestimasikerja, pdrmatauang, pdrkurs, pdrtotalhargain, pdrtotalhargaout, pdrtotalhppin, pdrtotalhppout, pdruraian, pdrcatatan, pdrnoref, pdrtglnoref, pdridbom, pdrstatuswoin, pdrstatuswoout, pdrstatusmrsin, pdrstatusmrsout, pdrstatusmrnin, pdrstatusmrnout, pdrstatuspdin, pdrstatuspdout, pdrstatus, pdrstatussebelumnya, pdrjmlrevisi, pdrcetakanke, pdrinputuser, pdrinputtgl, pdrmodifikasiuser, pdrmodifikasitgl, pdrisclose, pdrcustomtext1, pdrcustomtext2, pdrcustomtext3, pdrcustomtext4, pdrcustomtext5, pdrcustomint1, pdrcustomint2, pdrcustomint3, pdrcustomdbl1, pdrcustomdbl2, pdrcustomdbl3, pdrcustomdate1, pdrcustomdate2, pdrcustomdate3, pdraktivitas) values('{FixQuotes_drutama}pdrcabang', '{FixQuotes_drutama}pdrlokasi', '{FixQuotes_drutama}pdrgudangasal', '{FixQuotes_drutama}pdrgudangproduksi', '{FixQuotes_drutama}pdrgudangtujuan', '{FixQuotes_drutama}pdrsumber', '{FixQuotes_drutama}pdrjenis', {drutama}pdrautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}pdrtgl', {drutama}pdrkodepa, {drutama}pdrdimintaoleh, '{FixQuotes_drutama}pdrdimintaolehkontak', {drutama}pdrmintake, '{FixQuotes_AsFormatTanggal_drutama}pdrtgldipakai', '{FixQuotes_drutama}pdrestimasikerja', '{FixQuotes_drutama}pdrmatauang', '{FixDouble_drutama}pdrkurs', '{FixDouble_drutama}pdrtotalhargain', '{FixDouble_drutama}pdrtotalhargaout', '{FixDouble_drutama}pdrtotalhppin', '{FixDouble_drutama}pdrtotalhppout', '{FixQuotes_drutama}pdruraian', '{FixQuotes_drutama}pdrcatatan', '{FixQuotes_drutama}pdrnoref', '{FixQuotes_AsFormatTanggal_drutama}pdrtglnoref', {drutama}pdridbom, {drutama}pdrstatuswoin, {drutama}pdrstatuswoout, {drutama}pdrstatusmrsin, {drutama}pdrstatusmrsout, {drutama}pdrstatusmrnin, {drutama}pdrstatusmrnout, {drutama}pdrstatuspdin, {drutama}pdrstatuspdout, {drutama}pdrstatus, {drutama}pdrstatussebelumnya, {drutama}pdrjmlrevisi, {drutama}pdrcetakanke, {drutama}pdrinputuser, NOW(), {drutama}pdrmodifikasiuser, '1971-01-01 00:00:00', {drutama}pdrisclose, '{FixQuotes_drutama}pdrcustomtext1', '{FixQuotes_drutama}pdrcustomtext2', '{FixQuotes_drutama}pdrcustomtext3', '{FixQuotes_drutama}pdrcustomtext4', '{FixQuotes_drutama}pdrcustomtext5', {drutama}pdrcustomint1, {drutama}pdrcustomint2, {drutama}pdrcustomint3, '{FixDouble_drutama}pdrcustomdbl1', '{FixDouble_drutama}pdrcustomdbl2', '{FixDouble_drutama}pdrcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}pdrcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}pdrcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}pdrcustomdate3', '{FixDouble_drutama}pdraktivitas')
```

```sql
Insert into M6_Pdr_In(idpdrin, idpdr, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, harga, hpppersen, hpp, rekpersediaan, cabang, lokasi, gudangasal, gudangproduksi, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idbomin, jmlwo, statuswo, jmlmrs, statusmrs, jmlmrn, statusmrn, jmlpd, statuspd, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
Insert into M6_Pdr_Out(idpdrout, idpdr, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, harga, hpp, idhppkhususmasuk, idhppfifomasuk, rekpersediaan, cabang, lokasi, gudangasal, gudangproduksi, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idbomout, jmlwo, statuswo, jmlmrs, statusmrs, jmlmrn, statusmrn, jmlpd, statuspd, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
Insert into M6_Pdr (pdrcabang, pdrlokasi, pdrgudangasal, pdrgudangproduksi, pdrgudangtujuan, pdrsumber, pdrjenis, pdrautonotransaksi, pdrnotransaksi, pdrtgl, pdrkodepa, pdrdimintaoleh, pdrdimintaolehkontak, pdrmintake, pdrtgldipakai, pdrestimasikerja, pdrmatauang, pdrkurs, pdrtotalhargain, pdrtotalhargaout, pdrtotalhppin, pdrtotalhppout, pdruraian, pdrcatatan, pdrnoref, pdrtglnoref, pdridbom, pdrstatuswoin, pdrstatuswoout, pdrstatusmrsin, pdrstatusmrsout, pdrstatusmrnin, pdrstatusmrnout, pdrstatuspdin, pdrstatuspdout, pdrstatus, pdrstatussebelumnya, pdrjmlrevisi, pdrcetakanke, pdrinputuser, pdrinputtgl, pdrmodifikasiuser, pdrmodifikasitgl, pdrisclose, pdrcustomtext1, pdrcustomtext2, pdrcustomtext3, pdrcustomtext4, pdrcustomtext5, pdrcustomint1, pdrcustomint2, pdrcustomint3, pdrcustomdbl1, pdrcustomdbl2, pdrcustomdbl3, pdrcustomdate1, pdrcustomdate2, pdrcustomdate3) values('{FixQuotes_drutama}pdrcabang', '{FixQuotes_drutama}pdrlokasi', '{FixQuotes_drutama}pdrgudangasal', '{FixQuotes_drutama}pdrgudangproduksi', '{FixQuotes_drutama}pdrgudangtujuan', '{FixQuotes_drutama}pdrsumber', '{FixQuotes_drutama}pdrjenis', {drutama}pdrautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}pdrtgl', {drutama}pdrkodepa, {drutama}pdrdimintaoleh, '{FixQuotes_drutama}pdrdimintaolehkontak', {drutama}pdrmintake, '{FixQuotes_AsFormatTanggal_drutama}pdrtgldipakai', '{FixQuotes_drutama}pdrestimasikerja', '{FixQuotes_drutama}pdrmatauang', '{FixDouble_drutama}pdrkurs', '{FixDouble_drutama}pdrtotalhargain', '{FixDouble_drutama}pdrtotalhargaout', '{FixDouble_drutama}pdrtotalhppin', '{FixDouble_drutama}pdrtotalhppout', '{FixQuotes_drutama}pdruraian', '{FixQuotes_drutama}pdrcatatan', '{FixQuotes_drutama}pdrnoref', '{FixQuotes_AsFormatTanggal_drutama}pdrtglnoref', {drutama}pdridbom, {drutama}pdrstatuswoin, {drutama}pdrstatuswoout, {drutama}pdrstatusmrsin, {drutama}pdrstatusmrsout, {drutama}pdrstatusmrnin, {drutama}pdrstatusmrnout, {drutama}pdrstatuspdin, {drutama}pdrstatuspdout, {drutama}pdrstatus, {drutama}pdrstatussebelumnya, {drutama}pdrjmlrevisi, {drutama}pdrcetakanke, {drutama}pdrinputuser, NOW(), {drutama}pdrmodifikasiuser, '1971-01-01 00:00:00', {drutama}pdrisclose, '{FixQuotes_drutama}pdrcustomtext1', '{FixQuotes_drutama}pdrcustomtext2', '{FixQuotes_drutama}pdrcustomtext3', '{FixQuotes_drutama}pdrcustomtext4', '{FixQuotes_drutama}pdrcustomtext5', {drutama}pdrcustomint1, {drutama}pdrcustomint2, {drutama}pdrcustomint3, '{FixDouble_drutama}pdrcustomdbl1', '{FixDouble_drutama}pdrcustomdbl2', '{FixDouble_drutama}pdrcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}pdrcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}pdrcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}pdrcustomdate3')
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_pdr_history.vb`

```sql
INSERT INTO m6_pdr_history(SELECT 0, pdr.* FROM m6_pdr pdr WHERE pdr.pdrid = '{idtransaksi}')
```

```sql
INSERT INTO m6_pdr_in_history (SELECT 0, '{result_4}', pdr.* FROM m6_pdr_in pdr WHERE pdr.idpdr = '{idtransaksi}' )
```

```sql
INSERT INTO m6_pdr_out_history (SELECT 0, '{result_4}', pdr.* FROM m6_pdr_out pdr WHERE pdr.idpdr = '{idtransaksi}' )
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_wo.vb`

```sql
Insert into M6_Wo (wocabang, wolokasi, wogudangasal, wogudangproduksi, wogudangtujuan, wosumber, wojenis, woautonotransaksi, wonotransaksi, wotgl, wokodepa, wodimintaoleh, wodimintaolehkontak, womintake, wotgldipakai, woestimasikerja, womatauang, wokurs, wototalhargain, wototalhargaout, wototalhppin, wototalhppout, wouraian, wocatatan, wonoref, wotglnoref, woidbom, woidpdr, wostatusmrsin, wostatusmrsout, wostatusmrnin, wostatusmrnout, wostatuspdin, wostatuspdout, wostatus, wostatussebelumnya, wojmlrevisi, wocetakanke, woinputuser, woinputtgl, womodifikasiuser, womodifikasitgl, woisclose, wocustomtext1, wocustomtext2, wocustomtext3, wocustomtext4, wocustomtext5, wocustomint1, wocustomint2, wocustomint3, wocustomdbl1, wocustomdbl2, wocustomdbl3, wocustomdate1, wocustomdate2, wocustomdate3, woaktivitas) values('{FixQuotes_drutama}wocabang', '{FixQuotes_drutama}wolokasi', '{FixQuotes_drutama}wogudangasal', '{FixQuotes_drutama}wogudangproduksi', '{FixQuotes_drutama}wogudangtujuan', '{FixQuotes_drutama}wosumber', '{FixQuotes_drutama}wojenis', {drutama}woautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}wotgl', {drutama}wokodepa, {drutama}wodimintaoleh, '{FixQuotes_drutama}wodimintaolehkontak', {drutama}womintake, '{FixQuotes_AsFormatTanggal_drutama}wotgldipakai', '{FixQuotes_drutama}woestimasikerja', '{FixQuotes_drutama}womatauang', '{FixDouble_drutama}wokurs', '{FixDouble_drutama}wototalhargain', '{FixDouble_drutama}wototalhargaout', '{FixDouble_drutama}wototalhppin', '{FixDouble_drutama}wototalhppout', '{FixQuotes_drutama}wouraian', '{FixQuotes_drutama}wocatatan', '{FixQuotes_drutama}wonoref', '{FixQuotes_AsFormatTanggal_drutama}wotglnoref', {drutama}woidbom, {drutama}woidpdr, {drutama}wostatusmrsin, {drutama}wostatusmrsout, {drutama}wostatusmrnin, {drutama}wostatusmrnout, {drutama}wostatuspdin, {drutama}wostatuspdout, {drutama}wostatus, {drutama}wostatussebelumnya, {drutama}wojmlrevisi, {drutama}wocetakanke, {drutama}woinputuser, NOW(), {drutama}womodifikasiuser, '1971-01-01 00:00:00', {drutama}woisclose, '{FixQuotes_drutama}wocustomtext1', '{FixQuotes_drutama}wocustomtext2', '{FixQuotes_drutama}wocustomtext3', '{FixQuotes_drutama}wocustomtext4', '{FixQuotes_drutama}wocustomtext5', {drutama}wocustomint1, {drutama}wocustomint2, {drutama}wocustomint3, '{FixDouble_drutama}wocustomdbl1', '{FixDouble_drutama}wocustomdbl2', '{FixDouble_drutama}wocustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}wocustomdate1', '{FixQuotes_AsFormatTanggal_drutama}wocustomdate2', '{FixQuotes_AsFormatTanggal_drutama}wocustomdate3', '{FixDouble_drutama}woaktivitas')
```

```sql
Insert into M6_Wo_In(idwoin, idwo, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, harga, hpppersen, hpp, rekpersediaan, cabang, lokasi, gudangasal, gudangproduksi, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idbomin, idpdrin, jmlmrs, statusmrs, jmlmrn, statusmrn, jmlpd, statuspd, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
Insert into M6_Wo_Out(idwoout, idwo, idbarang, namabarang, tipebarang, jml, satuan, nilaisatuan, jmlbarang, satuanbarang, matauang, kurs, harga, hpp, idhppkhususmasuk, idhppfifomasuk, rekpersediaan, cabang, lokasi, gudangasal, gudangproduksi, gudangtujuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idbomout, idpdrout, jmlmrs, statusmrs, jmlmrn, statusmrn, jmlpd, statuspd, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
Insert into M6_wo_activity(idwoactivity, idwo, idpa, namaaktivitas, kodemesin, costcenter, divisi, subdivisi, proyek, catatan, urutan, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
Insert into M6_wo_route_card(idworoutecard, idwo, notransaksi, jml, satuan, costcenter, divisi, subdivisi, proyek, catatan, urutan, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
Insert into M6_Wo (wocabang, wolokasi, wogudangasal, wogudangproduksi, wogudangtujuan, wosumber, wojenis, woautonotransaksi, wonotransaksi, wotgl, wokodepa, wodimintaoleh, wodimintaolehkontak, womintake, wotgldipakai, woestimasikerja, womatauang, wokurs, wototalhargain, wototalhargaout, wototalhppin, wototalhppout, wouraian, wocatatan, wonoref, wotglnoref, woidbom, woidpdr, wostatusmrsin, wostatusmrsout, wostatusmrnin, wostatusmrnout, wostatuspdin, wostatuspdout, wostatus, wostatussebelumnya, wojmlrevisi, wocetakanke, woinputuser, woinputtgl, womodifikasiuser, womodifikasitgl, woisclose, wocustomtext1, wocustomtext2, wocustomtext3, wocustomtext4, wocustomtext5, wocustomint1, wocustomint2, wocustomint3, wocustomdbl1, wocustomdbl2, wocustomdbl3, wocustomdate1, wocustomdate2, wocustomdate3) values('{FixQuotes_drutama}wocabang', '{FixQuotes_drutama}wolokasi', '{FixQuotes_drutama}wogudangasal', '{FixQuotes_drutama}wogudangproduksi', '{FixQuotes_drutama}wogudangtujuan', '{FixQuotes_drutama}wosumber', '{FixQuotes_drutama}wojenis', {drutama}woautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}wotgl', {drutama}wokodepa, {drutama}wodimintaoleh, '{FixQuotes_drutama}wodimintaolehkontak', {drutama}womintake, '{FixQuotes_AsFormatTanggal_drutama}wotgldipakai', '{FixQuotes_drutama}woestimasikerja', '{FixQuotes_drutama}womatauang', '{FixDouble_drutama}wokurs', '{FixDouble_drutama}wototalhargain', '{FixDouble_drutama}wototalhargaout', '{FixDouble_drutama}wototalhppin', '{FixDouble_drutama}wototalhppout', '{FixQuotes_drutama}wouraian', '{FixQuotes_drutama}wocatatan', '{FixQuotes_drutama}wonoref', '{FixQuotes_AsFormatTanggal_drutama}wotglnoref', {drutama}woidbom, {drutama}woidpdr, {drutama}wostatusmrsin, {drutama}wostatusmrsout, {drutama}wostatusmrnin, {drutama}wostatusmrnout, {drutama}wostatuspdin, {drutama}wostatuspdout, {drutama}wostatus, {drutama}wostatussebelumnya, {drutama}wojmlrevisi, {drutama}wocetakanke, {drutama}woinputuser, NOW(), {drutama}womodifikasiuser, '1971-01-01 00:00:00', {drutama}woisclose, '{FixQuotes_drutama}wocustomtext1', '{FixQuotes_drutama}wocustomtext2', '{FixQuotes_drutama}wocustomtext3', '{FixQuotes_drutama}wocustomtext4', '{FixQuotes_drutama}wocustomtext5', {drutama}wocustomint1, {drutama}wocustomint2, {drutama}wocustomint3, '{FixDouble_drutama}wocustomdbl1', '{FixDouble_drutama}wocustomdbl2', '{FixDouble_drutama}wocustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}wocustomdate1', '{FixQuotes_AsFormatTanggal_drutama}wocustomdate2', '{FixQuotes_AsFormatTanggal_drutama}wocustomdate3')
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_wo_history.vb`

```sql
INSERT INTO m6_wo_history(SELECT 0, wo.* FROM m6_wo wo WHERE wo.woid = '{idtransaksi}')
```

```sql
INSERT INTO m6_wo_in_history (SELECT 0, '{result_4}', wo.* FROM m6_wo_in wo WHERE wo.idwo = '{idtransaksi}' )
```

```sql
INSERT INTO m6_wo_out_history (SELECT 0, '{result_4}', wo.* FROM m6_wo_out wo WHERE wo.idwo = '{idtransaksi}' )
```

## UPDATE

Total: `36`

### `client-backend/api-myerpplus/app_code/ws/m6/m6_bom.vb`

```sql
Update M6_Bom set bomcabang = '{FixQuotes_drutama}bomcabang', bomlokasi = '{FixQuotes_drutama}bomlokasi', bomgudangasal = '{FixQuotes_drutama}bomgudangasal', bomgudangproduksi = '{FixQuotes_drutama}bomgudangproduksi', bomgudangtujuan = '{FixQuotes_drutama}bomgudangtujuan', bomsumber = '{FixQuotes_drutama}bomsumber', bomjenis = '{FixQuotes_drutama}bomjenis', bomautonotransaksi = {drutama}bomautonotransaksi, bomnotransaksi = '{FixQuotes_notransaksi}', bomtgl = '{FixQuotes_AsFormatTanggal_drutama}bomtgl', bomkodepa = {drutama}bomkodepa, bompembuat = {drutama}bompembuat, bompembuatkontak = '{FixQuotes_drutama}bompembuatkontak', bomestimasikerja = '{FixQuotes_drutama}bomestimasikerja', bommatauang = '{FixQuotes_drutama}bommatauang', bomkurs = '{FixDouble_drutama}bomkurs', bomtotalhargain = '{FixDouble_drutama}bomtotalhargain', bomtotalhargaout = '{FixDouble_drutama}bomtotalhargaout', bomtotalhppin = '{FixDouble_drutama}bomtotalhppin', bomtotalhppout = '{FixDouble_drutama}bomtotalhppout', bomuraian = '{FixQuotes_drutama}bomuraian', bomcatatan = '{FixQuotes_drutama}bomcatatan', bomnoref = '{FixQuotes_drutama}bomnoref', bomtglnoref = '{FixQuotes_AsFormatTanggal_drutama}bomtglnoref', bomstatus = {drutama}bomstatus, bomstatussebelumnya = {drutama}bomstatussebelumnya, bomjmlrevisi = bomjmlrevisi+1, bomcetakanke = {drutama}bomcetakanke, bommodifikasiuser = {drutama}bommodifikasiuser, bommodifikasitgl = NOW(), bomcustomtext1 = '{FixQuotes_drutama}bomcustomtext1', bomcustomtext2 = '{FixQuotes_drutama}bomcustomtext2', bomcustomtext3 = '{FixQuotes_drutama}bomcustomtext3', bomcustomtext4 = '{FixQuotes_drutama}bomcustomtext4', bomcustomtext5 = '{FixQuotes_drutama}bomcustomtext5', bomcustomint1 = {drutama}bomcustomint1, bomcustomint2 = {drutama}bomcustomint2, bomcustomint3 = {drutama}bomcustomint3, bomcustomdbl1 = '{FixDouble_drutama}bomcustomdbl1', bomcustomdbl2 = '{FixDouble_drutama}bomcustomdbl2', bomcustomdbl3 = '{FixDouble_drutama}bomcustomdbl3', bomcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}bomcustomdate1', bomcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}bomcustomdate2', bomcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}bomcustomdate3', bomaktivitas = '{FixDouble_drutama}bomaktivitas' where bomid = '{drutama}bomid'
```

```sql
UPDATE M6_Bom SET Bomstatus = {nilaiStatus}, Bommodifikasiuser='{userid}', Bommodifikasitgl = NOW(), Bomposting = 0, Bompostingtgl = '1971-01-01 00:00:00', Bomjmlrevisi = Bomjmlrevisi + 1 WHERE Bomid = '{idtransaksi}'
```

```sql
Update M6_Bom set bomcabang = '{FixQuotes_drutama}bomcabang', bomlokasi = '{FixQuotes_drutama}bomlokasi', bomgudangasal = '{FixQuotes_drutama}bomgudangasal', bomgudangproduksi = '{FixQuotes_drutama}bomgudangproduksi', bomgudangtujuan = '{FixQuotes_drutama}bomgudangtujuan', bomsumber = '{FixQuotes_drutama}bomsumber', bomjenis = '{FixQuotes_drutama}bomjenis', bomautonotransaksi = {drutama}bomautonotransaksi, bomnotransaksi = '{FixQuotes_notransaksi}', bomtgl = '{FixQuotes_AsFormatTanggal_drutama}bomtgl', bomkodepa = {drutama}bomkodepa, bompembuat = {drutama}bompembuat, bompembuatkontak = '{FixQuotes_drutama}bompembuatkontak', bomestimasikerja = '{FixQuotes_drutama}bomestimasikerja', bommatauang = '{FixQuotes_drutama}bommatauang', bomkurs = '{FixDouble_drutama}bomkurs', bomtotalhargain = '{FixDouble_drutama}bomtotalhargain', bomtotalhargaout = '{FixDouble_drutama}bomtotalhargaout', bomtotalhppin = '{FixDouble_drutama}bomtotalhppin', bomtotalhppout = '{FixDouble_drutama}bomtotalhppout', bomuraian = '{FixQuotes_drutama}bomuraian', bomcatatan = '{FixQuotes_drutama}bomcatatan', bomnoref = '{FixQuotes_drutama}bomnoref', bomtglnoref = '{FixQuotes_AsFormatTanggal_drutama}bomtglnoref', bomstatus = {drutama}bomstatus, bomstatussebelumnya = {drutama}bomstatussebelumnya, bomjmlrevisi = bomjmlrevisi+1, bomcetakanke = {drutama}bomcetakanke, bommodifikasiuser = {drutama}bommodifikasiuser, bommodifikasitgl = NOW(), bomcustomtext1 = '{FixQuotes_drutama}bomcustomtext1', bomcustomtext2 = '{FixQuotes_drutama}bomcustomtext2', bomcustomtext3 = '{FixQuotes_drutama}bomcustomtext3', bomcustomtext4 = '{FixQuotes_drutama}bomcustomtext4', bomcustomtext5 = '{FixQuotes_drutama}bomcustomtext5', bomcustomint1 = {drutama}bomcustomint1, bomcustomint2 = {drutama}bomcustomint2, bomcustomint3 = {drutama}bomcustomint3, bomcustomdbl1 = '{FixDouble_drutama}bomcustomdbl1', bomcustomdbl2 = '{FixDouble_drutama}bomcustomdbl2', bomcustomdbl3 = '{FixDouble_drutama}bomcustomdbl3', bomcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}bomcustomdate1', bomcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}bomcustomdate2', bomcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}bomcustomdate3' where bomid = '{drutama}bomid'
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_files.vb`

```sql
UPDATE m6_files SET fcatatan = CASE fnamafile {strValue1_ToString} ELSE fcatatan END, fukuranfile = CASE fnamafile {strValue2_ToString} ELSE fukuranfile END, ftanggal = CASE fnamafile {strValue3_ToString} ELSE ftanggal END WHERE fsumber='{sumber}' AND fidtransaksi='{idtrans}'
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_mrn.vb`

```sql
Update M6_Mrn set mrncabang = '{FixQuotes_drutama}mrncabang', mrnlokasi = '{FixQuotes_drutama}mrnlokasi', mrngudangasal = '{FixQuotes_drutama}mrngudangasal', mrngudangproduksi = '{FixQuotes_drutama}mrngudangproduksi', mrngudangtujuan = '{FixQuotes_drutama}mrngudangtujuan', mrnsumber = '{FixQuotes_drutama}mrnsumber', mrnjenis = '{FixQuotes_drutama}mrnjenis', mrnautonotransaksi = {drutama}mrnautonotransaksi, mrnnotransaksi = '{FixQuotes_notransaksi}', mrntgl = '{FixQuotes_AsFormatTanggal_drutama}mrntgl', mrnkodepa = {drutama}mrnkodepa, mrnbagianmrn = {drutama}mrnbagianmrn, mrnbagianmrnkontak = '{FixQuotes_drutama}mrnbagianmrnkontak', mrntgldipakai = '{FixQuotes_AsFormatTanggal_drutama}mrntgldipakai', mrnestimasikerja = '{FixQuotes_drutama}mrnestimasikerja', mrnmatauang = '{FixQuotes_drutama}mrnmatauang', mrnkurs = '{FixDouble_drutama}mrnkurs', mrntotalhargain = '{FixDouble_drutama}mrntotalhargain', mrntotalhargaout = '{FixDouble_drutama}mrntotalhargaout', mrntotalhppin = '{FixDouble_drutama}mrntotalhppin', mrntotalhppout = '{FixDouble_drutama}mrntotalhppout', mrnuraian = '{FixQuotes_drutama}mrnuraian', mrncatatan = '{FixQuotes_drutama}mrncatatan', mrnnoref = '{FixQuotes_drutama}mrnnoref', mrntglnoref = '{FixQuotes_AsFormatTanggal_drutama}mrntglnoref', mrnidbom = {drutama}mrnidbom, mrnidpdr = {drutama}mrnidpdr, mrnidwo = {drutama}mrnidwo, mrnidmrs = {drutama}mrnidmrs, mrnstatuspdin = {drutama}mrnstatuspdin, mrnstatuspdout = {drutama}mrnstatuspdout, mrnstatus = {drutama}mrnstatus, mrnstatussebelumnya = {drutama}mrnstatussebelumnya, mrnjmlrevisi = mrnjmlrevisi+1, mrncetakanke = {drutama}mrncetakanke, mrnmodifikasiuser = {drutama}mrnmodifikasiuser, mrnmodifikasitgl = NOW(), mrncustomtext1 = '{FixQuotes_drutama}mrncustomtext1', mrncustomtext2 = '{FixQuotes_drutama}mrncustomtext2', mrncustomtext3 = '{FixQuotes_drutama}mrncustomtext3', mrncustomtext4 = '{FixQuotes_drutama}mrncustomtext4', mrncustomtext5 = '{FixQuotes_drutama}mrncustomtext5', mrncustomint1 = {drutama}mrncustomint1, mrncustomint2 = {drutama}mrncustomint2, mrncustomint3 = {drutama}mrncustomint3, mrncustomdbl1 = '{FixDouble_drutama}mrncustomdbl1', mrncustomdbl2 = '{FixDouble_drutama}mrncustomdbl2', mrncustomdbl3 = '{FixDouble_drutama}mrncustomdbl3', mrncustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}mrncustomdate1', mrncustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}mrncustomdate2', mrncustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}mrncustomdate3', mrnaktivitas = '{FixDouble_drutama}mrnaktivitas' where mrnid = '{drutama}mrnid'
```

```sql
UPDATE m6_mrs_out SET jmlrealisasi = (CASE idmrsout {updNilaiMrsOut} ELSE jmlrealisasi END) WHERE
```

```sql
UPDATE m6_mrs SET mrsstatusrealisasiout = (CASE mrsid {updNilaiMrsUtamaOut} ELSE mrsstatusrealisasiout END) WHERE
```

```sql
UPDATE M6_Mrn SET Mrnstatus = {nilaiStatus}, Mrnmodifikasiuser='{userid}', Mrnmodifikasitgl = NOW(), Mrnposting = 0, Mrnpostingtgl = '1971-01-01 00:00:00', Mrnjmlrevisi = Mrnjmlrevisi + 1 WHERE Mrnid = '{idtransaksi}'
```

```sql
Update M6_Mrn set mrncabang = '{FixQuotes_drutama}mrncabang', mrnlokasi = '{FixQuotes_drutama}mrnlokasi', mrngudangasal = '{FixQuotes_drutama}mrngudangasal', mrngudangproduksi = '{FixQuotes_drutama}mrngudangproduksi', mrngudangtujuan = '{FixQuotes_drutama}mrngudangtujuan', mrnsumber = '{FixQuotes_drutama}mrnsumber', mrnjenis = '{FixQuotes_drutama}mrnjenis', mrnautonotransaksi = {drutama}mrnautonotransaksi, mrnnotransaksi = '{FixQuotes_notransaksi}', mrntgl = '{FixQuotes_AsFormatTanggal_drutama}mrntgl', mrnkodepa = {drutama}mrnkodepa, mrnbagianmrn = {drutama}mrnbagianmrn, mrnbagianmrnkontak = '{FixQuotes_drutama}mrnbagianmrnkontak', mrntgldipakai = '{FixQuotes_AsFormatTanggal_drutama}mrntgldipakai', mrnestimasikerja = '{FixQuotes_drutama}mrnestimasikerja', mrnmatauang = '{FixQuotes_drutama}mrnmatauang', mrnkurs = '{FixDouble_drutama}mrnkurs', mrntotalhargain = '{FixDouble_drutama}mrntotalhargain', mrntotalhargaout = '{FixDouble_drutama}mrntotalhargaout', mrntotalhppin = '{FixDouble_drutama}mrntotalhppin', mrntotalhppout = '{FixDouble_drutama}mrntotalhppout', mrnuraian = '{FixQuotes_drutama}mrnuraian', mrncatatan = '{FixQuotes_drutama}mrncatatan', mrnnoref = '{FixQuotes_drutama}mrnnoref', mrntglnoref = '{FixQuotes_AsFormatTanggal_drutama}mrntglnoref', mrnidbom = {drutama}mrnidbom, mrnidpdr = {drutama}mrnidpdr, mrnidwo = {drutama}mrnidwo, mrnidmrs = {drutama}mrnidmrs, mrnstatuspdin = {drutama}mrnstatuspdin, mrnstatuspdout = {drutama}mrnstatuspdout, mrnstatus = {drutama}mrnstatus, mrnstatussebelumnya = {drutama}mrnstatussebelumnya, mrnjmlrevisi = mrnjmlrevisi+1, mrncetakanke = {drutama}mrncetakanke, mrnmodifikasiuser = {drutama}mrnmodifikasiuser, mrnmodifikasitgl = NOW(), mrncustomtext1 = '{FixQuotes_drutama}mrncustomtext1', mrncustomtext2 = '{FixQuotes_drutama}mrncustomtext2', mrncustomtext3 = '{FixQuotes_drutama}mrncustomtext3', mrncustomtext4 = '{FixQuotes_drutama}mrncustomtext4', mrncustomtext5 = '{FixQuotes_drutama}mrncustomtext5', mrncustomint1 = {drutama}mrncustomint1, mrncustomint2 = {drutama}mrncustomint2, mrncustomint3 = {drutama}mrncustomint3, mrncustomdbl1 = '{FixDouble_drutama}mrncustomdbl1', mrncustomdbl2 = '{FixDouble_drutama}mrncustomdbl2', mrncustomdbl3 = '{FixDouble_drutama}mrncustomdbl3', mrncustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}mrncustomdate1', mrncustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}mrncustomdate2', mrncustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}mrncustomdate3' where mrnid = '{drutama}mrnid'
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_mrs.vb`

```sql
Update M6_Mrs set mrscabang = '{FixQuotes_drutama}mrscabang', mrslokasi = '{FixQuotes_drutama}mrslokasi', mrsgudangasal = '{FixQuotes_drutama}mrsgudangasal', mrsgudangproduksi = '{FixQuotes_drutama}mrsgudangproduksi', mrsgudangtujuan = '{FixQuotes_drutama}mrsgudangtujuan', mrssumber = '{FixQuotes_drutama}mrssumber', mrsjenis = '{FixQuotes_drutama}mrsjenis', mrsautonotransaksi = {drutama}mrsautonotransaksi, mrsnotransaksi = '{FixQuotes_notransaksi}', mrstgl = '{FixQuotes_AsFormatTanggal_drutama}mrstgl', mrskodepa = {drutama}mrskodepa, mrsbagianmrs = {drutama}mrsbagianmrs, mrsbagianmrskontak = '{FixQuotes_drutama}mrsbagianmrskontak', mrstgldipakai = '{FixQuotes_AsFormatTanggal_drutama}mrstgldipakai', mrsestimasikerja = '{FixQuotes_drutama}mrsestimasikerja', mrsmatauang = '{FixQuotes_drutama}mrsmatauang', mrskurs = '{FixDouble_drutama}mrskurs', mrstotalhargain = '{FixDouble_drutama}mrstotalhargain', mrstotalhargaout = '{FixDouble_drutama}mrstotalhargaout', mrstotalhppin = '{FixDouble_drutama}mrstotalhppin', mrstotalhppout = '{FixDouble_drutama}mrstotalhppout', mrsuraian = '{FixQuotes_drutama}mrsuraian', mrscatatan = '{FixQuotes_drutama}mrscatatan', mrsnoref = '{FixQuotes_drutama}mrsnoref', mrstglnoref = '{FixQuotes_AsFormatTanggal_drutama}mrstglnoref', mrsidbom = {drutama}mrsidbom, mrsidpdr = {drutama}mrsidpdr, mrsidwo = {drutama}mrsidwo, mrsstatusmrnin = {drutama}mrsstatusmrnin, mrsstatusmrnout = {drutama}mrsstatusmrnout, mrsstatuspdin = {drutama}mrsstatuspdin, mrsstatuspdout = {drutama}mrsstatuspdout, mrsstatus = {drutama}mrsstatus, mrsstatussebelumnya = {drutama}mrsstatussebelumnya, mrsjmlrevisi = mrsjmlrevisi+1, mrscetakanke = {drutama}mrscetakanke, mrsmodifikasiuser = {drutama}mrsmodifikasiuser, mrsmodifikasitgl = NOW(), mrscustomtext1 = '{FixQuotes_drutama}mrscustomtext1', mrscustomtext2 = '{FixQuotes_drutama}mrscustomtext2', mrscustomtext3 = '{FixQuotes_drutama}mrscustomtext3', mrscustomtext4 = '{FixQuotes_drutama}mrscustomtext4', mrscustomtext5 = '{FixQuotes_drutama}mrscustomtext5', mrscustomint1 = {drutama}mrscustomint1, mrscustomint2 = {drutama}mrscustomint2, mrscustomint3 = {drutama}mrscustomint3, mrscustomdbl1 = '{FixDouble_drutama}mrscustomdbl1', mrscustomdbl2 = '{FixDouble_drutama}mrscustomdbl2', mrscustomdbl3 = '{FixDouble_drutama}mrscustomdbl3', mrscustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}mrscustomdate1', mrscustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}mrscustomdate2', mrscustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}mrscustomdate3', mrsaktivitas = '{FixDouble_drutama}mrsaktivitas' where mrsid = '{drutama}mrsid'
```

```sql
UPDATE m6_wo_out SET jmlrealisasi = (CASE idwoout {updNilaiWoOut} ELSE jmlrealisasi END) WHERE
```

```sql
UPDATE m6_wo SET wostatusrealisasiout = (CASE woid {updNilaiWoUtamaOut} ELSE wostatusrealisasiout END) WHERE
```

```sql
UPDATE m6_wo SET wostatusrealisasiout = (CASE wostatusrealisasiout WHEN 2 THEN wostatusrealisasiout ELSE 1 END) WHERE woid = '{FixDouble_drutama}mrsidwo'
```

```sql
UPDATE M6_Mrs SET Mrsstatus = {nilaiStatus}, Mrsmodifikasiuser='{userid}', Mrsmodifikasitgl = NOW(), Mrsposting = 0, Mrspostingtgl = '1971-01-01 00:00:00', Mrsjmlrevisi = Mrsjmlrevisi + 1 WHERE Mrsid = '{idtransaksi}'
```

```sql
Update M6_Mrs set mrscabang = '{FixQuotes_drutama}mrscabang', mrslokasi = '{FixQuotes_drutama}mrslokasi', mrsgudangasal = '{FixQuotes_drutama}mrsgudangasal', mrsgudangproduksi = '{FixQuotes_drutama}mrsgudangproduksi', mrsgudangtujuan = '{FixQuotes_drutama}mrsgudangtujuan', mrssumber = '{FixQuotes_drutama}mrssumber', mrsjenis = '{FixQuotes_drutama}mrsjenis', mrsautonotransaksi = {drutama}mrsautonotransaksi, mrsnotransaksi = '{FixQuotes_notransaksi}', mrstgl = '{FixQuotes_AsFormatTanggal_drutama}mrstgl', mrskodepa = {drutama}mrskodepa, mrsbagianmrs = {drutama}mrsbagianmrs, mrsbagianmrskontak = '{FixQuotes_drutama}mrsbagianmrskontak', mrstgldipakai = '{FixQuotes_AsFormatTanggal_drutama}mrstgldipakai', mrsestimasikerja = '{FixQuotes_drutama}mrsestimasikerja', mrsmatauang = '{FixQuotes_drutama}mrsmatauang', mrskurs = '{FixDouble_drutama}mrskurs', mrstotalhargain = '{FixDouble_drutama}mrstotalhargain', mrstotalhargaout = '{FixDouble_drutama}mrstotalhargaout', mrstotalhppin = '{FixDouble_drutama}mrstotalhppin', mrstotalhppout = '{FixDouble_drutama}mrstotalhppout', mrsuraian = '{FixQuotes_drutama}mrsuraian', mrscatatan = '{FixQuotes_drutama}mrscatatan', mrsnoref = '{FixQuotes_drutama}mrsnoref', mrstglnoref = '{FixQuotes_AsFormatTanggal_drutama}mrstglnoref', mrsidbom = {drutama}mrsidbom, mrsidpdr = {drutama}mrsidpdr, mrsidwo = {drutama}mrsidwo, mrsstatusmrnin = {drutama}mrsstatusmrnin, mrsstatusmrnout = {drutama}mrsstatusmrnout, mrsstatuspdin = {drutama}mrsstatuspdin, mrsstatuspdout = {drutama}mrsstatuspdout, mrsstatus = {drutama}mrsstatus, mrsstatussebelumnya = {drutama}mrsstatussebelumnya, mrsjmlrevisi = mrsjmlrevisi+1, mrscetakanke = {drutama}mrscetakanke, mrsmodifikasiuser = {drutama}mrsmodifikasiuser, mrsmodifikasitgl = NOW(), mrscustomtext1 = '{FixQuotes_drutama}mrscustomtext1', mrscustomtext2 = '{FixQuotes_drutama}mrscustomtext2', mrscustomtext3 = '{FixQuotes_drutama}mrscustomtext3', mrscustomtext4 = '{FixQuotes_drutama}mrscustomtext4', mrscustomtext5 = '{FixQuotes_drutama}mrscustomtext5', mrscustomint1 = {drutama}mrscustomint1, mrscustomint2 = {drutama}mrscustomint2, mrscustomint3 = {drutama}mrscustomint3, mrscustomdbl1 = '{FixDouble_drutama}mrscustomdbl1', mrscustomdbl2 = '{FixDouble_drutama}mrscustomdbl2', mrscustomdbl3 = '{FixDouble_drutama}mrscustomdbl3', mrscustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}mrscustomdate1', mrscustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}mrscustomdate2', mrscustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}mrscustomdate3' where mrsid = '{drutama}mrsid'
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_notes.vb`

```sql
Update M6_Notes set nsumber = '{FixQuotes_dataUtama_1}', nidtransaksi = {dataUtama_2}, ncatatan = '{FixQuotes_dataUtama_3}', nmodifikasiuser = {dataUtama_6}, nmodifikasitgl = NOW() where nid = '{result_4}'
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_pd.vb`

```sql
Update M6_Pd set pdcabang = '{FixQuotes_drutama}pdcabang', pdlokasi = '{FixQuotes_drutama}pdlokasi', pdgudangasal = '{FixQuotes_drutama}pdgudangasal', pdgudangproduksi = '{FixQuotes_drutama}pdgudangproduksi', pdgudangtujuan = '{FixQuotes_drutama}pdgudangtujuan', pdsumber = '{FixQuotes_drutama}pdsumber', pdjenis = '{FixQuotes_drutama}pdjenis', pdautonotransaksi = {drutama}pdautonotransaksi, pdnotransaksi = '{FixQuotes_notransaksi}', pdtgl = '{FixQuotes_AsFormatTanggal_drutama}pdtgl', pdkodepa = {drutama}pdkodepa, pdbagianpd = {drutama}pdbagianpd, pdbagianpdkontak = '{FixQuotes_drutama}pdbagianpdkontak', pdtgldipakai = '{FixQuotes_AsFormatTanggal_drutama}pdtgldipakai', pdestimasikerja = '{FixQuotes_drutama}pdestimasikerja', pdmatauang = '{FixQuotes_drutama}pdmatauang', pdkurs = '{FixDouble_drutama}pdkurs', pdtotalhargain = '{FixDouble_drutama}pdtotalhargain', pdtotalhargaout = '{FixDouble_drutama}pdtotalhargaout', pdtotalhppin = '{FixDouble_drutama}pdtotalhppin', pdtotalhppout = '{FixDouble_drutama}pdtotalhppout', pduraian = '{FixQuotes_drutama}pduraian', pdcatatan = '{FixQuotes_drutama}pdcatatan', pdnoref = '{FixQuotes_drutama}pdnoref', pdtglnoref = '{FixQuotes_AsFormatTanggal_drutama}pdtglnoref', pdidbom = {drutama}pdidbom, pdidpdr = {drutama}pdidpdr, pdidwo = {drutama}pdidwo, pdidmrs = {drutama}pdidmrs, pdidmrn = {drutama}pdidmrn, pdstatus = {drutama}pdstatus, pdstatussebelumnya = {drutama}pdstatussebelumnya, pdjmlrevisi = pdjmlrevisi+1, pdcetakanke = {drutama}pdcetakanke, pdmodifikasiuser = {drutama}pdmodifikasiuser, pdmodifikasitgl = NOW(), pdposting = 0, pdtutupperiode = {drutama}pdtutupperiode, pdcustomtext1 = '{FixQuotes_drutama}pdcustomtext1', pdcustomtext2 = '{FixQuotes_drutama}pdcustomtext2', pdcustomtext3 = '{FixQuotes_drutama}pdcustomtext3', pdcustomtext4 = '{FixQuotes_drutama}pdcustomtext4', pdcustomtext5 = '{FixQuotes_drutama}pdcustomtext5', pdcustomint1 = {drutama}pdcustomint1, pdcustomint2 = {drutama}pdcustomint2, pdcustomint3 = {drutama}pdcustomint3, pdcustomdbl1 = '{FixDouble_drutama}pdcustomdbl1', pdcustomdbl2 = '{FixDouble_drutama}pdcustomdbl2', pdcustomdbl3 = '{FixDouble_drutama}pdcustomdbl3', pdcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}pdcustomdate1', pdcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}pdcustomdate2', pdcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}pdcustomdate3', pdaktivitas = '{FixDouble_drutama}pdaktivitas' where pdid = '{drutama}pdid'
```

```sql
UPDATE m6_wo_in SET jmlrealisasi = (CASE idwoin {updNilaiWoIn} ELSE jmlrealisasi END) WHERE
```

```sql
UPDATE m6_mrs_out SET jmlrealisasi = (CASE idmrsout {updNilaiMrsOut} ELSE jmlrealisasi END) WHERE
```

```sql
UPDATE m6_wo SET wostatusrealisasiin = (CASE woid {updNilaiWoUtamaIn} ELSE wostatusrealisasiin END) WHERE
```

```sql
UPDATE m6_mrs SET mrsstatusrealisasiout = (CASE mrsid {updNilaiMrsUtamaOut} ELSE mrsstatusrealisasiout END) WHERE
```

```sql
UPDATE m6_pd_in pdi JOIN m1_cost_center cc ON pdi.costcenter = cc.cckode JOIN m0_setting s2 ON s2.smodule = 0 AND s2.sgrup = 'options' AND s2.skode = 'PDNonaktifCostcenter' AND s2.snilai = 1 SET cc.ccaktif = 0 WHERE pdi.idpd = '{result_4}';
```

```sql
UPDATE m6_pd_in pdi JOIN m1_cost_center cc ON pdi.costcenter = cc.cckode JOIN m0_setting s2 ON s2.smodule = 0 AND s2.sgrup = 'options' AND s2.skode = 'PDNonaktifCostcenter' AND s2.snilai = 1 SET cc.ccaktif = 1 WHERE pdi.idpd = '{idtransaksi}';
```

```sql
UPDATE M6_Pd SET Pdstatus = {nilaiStatus}, Pdmodifikasiuser='{userid}', Pdmodifikasitgl = NOW(), Pdposting = 0, Pdpostingtgl = '1971-01-01 00:00:00', Pdjmlrevisi = Pdjmlrevisi + 1 WHERE Pdid = '{idtransaksi}'
```

```sql
Update M6_Pd set pdcabang = '{FixQuotes_drutama}pdcabang', pdlokasi = '{FixQuotes_drutama}pdlokasi', pdgudangasal = '{FixQuotes_drutama}pdgudangasal', pdgudangproduksi = '{FixQuotes_drutama}pdgudangproduksi', pdgudangtujuan = '{FixQuotes_drutama}pdgudangtujuan', pdsumber = '{FixQuotes_drutama}pdsumber', pdjenis = '{FixQuotes_drutama}pdjenis', pdautonotransaksi = {drutama}pdautonotransaksi, pdnotransaksi = '{FixQuotes_notransaksi}', pdtgl = '{FixQuotes_AsFormatTanggal_drutama}pdtgl', pdkodepa = {drutama}pdkodepa, pdbagianpd = {drutama}pdbagianpd, pdbagianpdkontak = '{FixQuotes_drutama}pdbagianpdkontak', pdtgldipakai = '{FixQuotes_AsFormatTanggal_drutama}pdtgldipakai', pdestimasikerja = '{FixQuotes_drutama}pdestimasikerja', pdmatauang = '{FixQuotes_drutama}pdmatauang', pdkurs = '{FixDouble_drutama}pdkurs', pdtotalhargain = '{FixDouble_drutama}pdtotalhargain', pdtotalhargaout = '{FixDouble_drutama}pdtotalhargaout', pdtotalhppin = '{FixDouble_drutama}pdtotalhppin', pdtotalhppout = '{FixDouble_drutama}pdtotalhppout', pduraian = '{FixQuotes_drutama}pduraian', pdcatatan = '{FixQuotes_drutama}pdcatatan', pdnoref = '{FixQuotes_drutama}pdnoref', pdtglnoref = '{FixQuotes_AsFormatTanggal_drutama}pdtglnoref', pdidbom = {drutama}pdidbom, pdidpdr = {drutama}pdidpdr, pdidwo = {drutama}pdidwo, pdidmrs = {drutama}pdidmrs, pdidmrn = {drutama}pdidmrn, pdstatus = {drutama}pdstatus, pdstatussebelumnya = {drutama}pdstatussebelumnya, pdjmlrevisi = pdjmlrevisi+1, pdcetakanke = {drutama}pdcetakanke, pdmodifikasiuser = {drutama}pdmodifikasiuser, pdmodifikasitgl = NOW(), pdposting = 0, pdtutupperiode = {drutama}pdtutupperiode, pdcustomtext1 = '{FixQuotes_drutama}pdcustomtext1', pdcustomtext2 = '{FixQuotes_drutama}pdcustomtext2', pdcustomtext3 = '{FixQuotes_drutama}pdcustomtext3', pdcustomtext4 = '{FixQuotes_drutama}pdcustomtext4', pdcustomtext5 = '{FixQuotes_drutama}pdcustomtext5', pdcustomint1 = {drutama}pdcustomint1, pdcustomint2 = {drutama}pdcustomint2, pdcustomint3 = {drutama}pdcustomint3, pdcustomdbl1 = '{FixDouble_drutama}pdcustomdbl1', pdcustomdbl2 = '{FixDouble_drutama}pdcustomdbl2', pdcustomdbl3 = '{FixDouble_drutama}pdcustomdbl3', pdcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}pdcustomdate1', pdcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}pdcustomdate2', pdcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}pdcustomdate3' where pdid = '{drutama}pdid'
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_pdr.vb`

```sql
Update M6_Pdr set pdrcabang = '{FixQuotes_drutama}pdrcabang', pdrlokasi = '{FixQuotes_drutama}pdrlokasi', pdrgudangasal = '{FixQuotes_drutama}pdrgudangasal', pdrgudangproduksi = '{FixQuotes_drutama}pdrgudangproduksi', pdrgudangtujuan = '{FixQuotes_drutama}pdrgudangtujuan', pdrsumber = '{FixQuotes_drutama}pdrsumber', pdrjenis = '{FixQuotes_drutama}pdrjenis', pdrautonotransaksi = {drutama}pdrautonotransaksi, pdrnotransaksi = '{FixQuotes_notransaksi}', pdrtgl = '{FixQuotes_AsFormatTanggal_drutama}pdrtgl', pdrkodepa = {drutama}pdrkodepa, pdrdimintaoleh = {drutama}pdrdimintaoleh, pdrdimintaolehkontak = '{FixQuotes_drutama}pdrdimintaolehkontak', pdrmintake = {drutama}pdrmintake, pdrtgldipakai = '{FixQuotes_AsFormatTanggal_drutama}pdrtgldipakai', pdrestimasikerja = '{FixQuotes_drutama}pdrestimasikerja', pdrmatauang = '{FixQuotes_drutama}pdrmatauang', pdrkurs = '{FixDouble_drutama}pdrkurs', pdrtotalhargain = '{FixDouble_drutama}pdrtotalhargain', pdrtotalhargaout = '{FixDouble_drutama}pdrtotalhargaout', pdrtotalhppin = '{FixDouble_drutama}pdrtotalhppin', pdrtotalhppout = '{FixDouble_drutama}pdrtotalhppout', pdruraian = '{FixQuotes_drutama}pdruraian', pdrcatatan = '{FixQuotes_drutama}pdrcatatan', pdrnoref = '{FixQuotes_drutama}pdrnoref', pdrtglnoref = '{FixQuotes_AsFormatTanggal_drutama}pdrtglnoref', pdridbom = {drutama}pdridbom, pdrstatuswoin = {drutama}pdrstatuswoin, pdrstatuswoout = {drutama}pdrstatuswoout, pdrstatusmrsin = {drutama}pdrstatusmrsin, pdrstatusmrsout = {drutama}pdrstatusmrsout, pdrstatusmrnin = {drutama}pdrstatusmrnin, pdrstatusmrnout = {drutama}pdrstatusmrnout, pdrstatuspdin = {drutama}pdrstatuspdin, pdrstatuspdout = {drutama}pdrstatuspdout, pdrstatus = {drutama}pdrstatus, pdrstatussebelumnya = {drutama}pdrstatussebelumnya, pdrjmlrevisi = pdrjmlrevisi+1, pdrcetakanke = {drutama}pdrcetakanke, pdrmodifikasiuser = {drutama}pdrmodifikasiuser, pdrmodifikasitgl = NOW(), pdrcustomtext1 = '{FixQuotes_drutama}pdrcustomtext1', pdrcustomtext2 = '{FixQuotes_drutama}pdrcustomtext2', pdrcustomtext3 = '{FixQuotes_drutama}pdrcustomtext3', pdrcustomtext4 = '{FixQuotes_drutama}pdrcustomtext4', pdrcustomtext5 = '{FixQuotes_drutama}pdrcustomtext5', pdrcustomint1 = {drutama}pdrcustomint1, pdrcustomint2 = {drutama}pdrcustomint2, pdrcustomint3 = {drutama}pdrcustomint3, pdrcustomdbl1 = '{FixDouble_drutama}pdrcustomdbl1', pdrcustomdbl2 = '{FixDouble_drutama}pdrcustomdbl2', pdrcustomdbl3 = '{FixDouble_drutama}pdrcustomdbl3', pdrcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}pdrcustomdate1', pdrcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}pdrcustomdate2', pdrcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}pdrcustomdate3', pdraktivitas = '{FixDouble_drutama}pdraktivitas' where pdrid = '{drutama}pdrid'
```

```sql
UPDATE M6_Pdr SET Pdrstatus = {nilaiStatus}, Pdrmodifikasiuser='{userid}', Pdrmodifikasitgl = NOW(), Pdrposting = 0, Pdrpostingtgl = '1971-01-01 00:00:00', Pdrjmlrevisi = Pdrjmlrevisi + 1 WHERE Pdrid = '{idtransaksi}'
```

```sql
Update M6_Pdr set pdrcabang = '{FixQuotes_drutama}pdrcabang', pdrlokasi = '{FixQuotes_drutama}pdrlokasi', pdrgudangasal = '{FixQuotes_drutama}pdrgudangasal', pdrgudangproduksi = '{FixQuotes_drutama}pdrgudangproduksi', pdrgudangtujuan = '{FixQuotes_drutama}pdrgudangtujuan', pdrsumber = '{FixQuotes_drutama}pdrsumber', pdrjenis = '{FixQuotes_drutama}pdrjenis', pdrautonotransaksi = {drutama}pdrautonotransaksi, pdrnotransaksi = '{FixQuotes_notransaksi}', pdrtgl = '{FixQuotes_AsFormatTanggal_drutama}pdrtgl', pdrkodepa = {drutama}pdrkodepa, pdrdimintaoleh = {drutama}pdrdimintaoleh, pdrdimintaolehkontak = '{FixQuotes_drutama}pdrdimintaolehkontak', pdrmintake = {drutama}pdrmintake, pdrtgldipakai = '{FixQuotes_AsFormatTanggal_drutama}pdrtgldipakai', pdrestimasikerja = '{FixQuotes_drutama}pdrestimasikerja', pdrmatauang = '{FixQuotes_drutama}pdrmatauang', pdrkurs = '{FixDouble_drutama}pdrkurs', pdrtotalhargain = '{FixDouble_drutama}pdrtotalhargain', pdrtotalhargaout = '{FixDouble_drutama}pdrtotalhargaout', pdrtotalhppin = '{FixDouble_drutama}pdrtotalhppin', pdrtotalhppout = '{FixDouble_drutama}pdrtotalhppout', pdruraian = '{FixQuotes_drutama}pdruraian', pdrcatatan = '{FixQuotes_drutama}pdrcatatan', pdrnoref = '{FixQuotes_drutama}pdrnoref', pdrtglnoref = '{FixQuotes_AsFormatTanggal_drutama}pdrtglnoref', pdridbom = {drutama}pdridbom, pdrstatuswoin = {drutama}pdrstatuswoin, pdrstatuswoout = {drutama}pdrstatuswoout, pdrstatusmrsin = {drutama}pdrstatusmrsin, pdrstatusmrsout = {drutama}pdrstatusmrsout, pdrstatusmrnin = {drutama}pdrstatusmrnin, pdrstatusmrnout = {drutama}pdrstatusmrnout, pdrstatuspdin = {drutama}pdrstatuspdin, pdrstatuspdout = {drutama}pdrstatuspdout, pdrstatus = {drutama}pdrstatus, pdrstatussebelumnya = {drutama}pdrstatussebelumnya, pdrjmlrevisi = pdrjmlrevisi+1, pdrcetakanke = {drutama}pdrcetakanke, pdrmodifikasiuser = {drutama}pdrmodifikasiuser, pdrmodifikasitgl = NOW(), pdrcustomtext1 = '{FixQuotes_drutama}pdrcustomtext1', pdrcustomtext2 = '{FixQuotes_drutama}pdrcustomtext2', pdrcustomtext3 = '{FixQuotes_drutama}pdrcustomtext3', pdrcustomtext4 = '{FixQuotes_drutama}pdrcustomtext4', pdrcustomtext5 = '{FixQuotes_drutama}pdrcustomtext5', pdrcustomint1 = {drutama}pdrcustomint1, pdrcustomint2 = {drutama}pdrcustomint2, pdrcustomint3 = {drutama}pdrcustomint3, pdrcustomdbl1 = '{FixDouble_drutama}pdrcustomdbl1', pdrcustomdbl2 = '{FixDouble_drutama}pdrcustomdbl2', pdrcustomdbl3 = '{FixDouble_drutama}pdrcustomdbl3', pdrcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}pdrcustomdate1', pdrcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}pdrcustomdate2', pdrcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}pdrcustomdate3' where pdrid = '{drutama}pdrid'
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_wo.vb`

```sql
Update M6_Wo set wocabang = '{FixQuotes_drutama}wocabang', wolokasi = '{FixQuotes_drutama}wolokasi', wogudangasal = '{FixQuotes_drutama}wogudangasal', wogudangproduksi = '{FixQuotes_drutama}wogudangproduksi', wogudangtujuan = '{FixQuotes_drutama}wogudangtujuan', wosumber = '{FixQuotes_drutama}wosumber', wojenis = '{FixQuotes_drutama}wojenis', woautonotransaksi = {drutama}woautonotransaksi, wonotransaksi = '{FixQuotes_notransaksi}', wotgl = '{FixQuotes_AsFormatTanggal_drutama}wotgl', wokodepa = {drutama}wokodepa, wodimintaoleh = {drutama}wodimintaoleh, wodimintaolehkontak = '{FixQuotes_drutama}wodimintaolehkontak', womintake = {drutama}womintake, wotgldipakai = '{FixQuotes_AsFormatTanggal_drutama}wotgldipakai', woestimasikerja = '{FixQuotes_drutama}woestimasikerja', womatauang = '{FixQuotes_drutama}womatauang', wokurs = '{FixDouble_drutama}wokurs', wototalhargain = '{FixDouble_drutama}wototalhargain', wototalhargaout = '{FixDouble_drutama}wototalhargaout', wototalhppin = '{FixDouble_drutama}wototalhppin', wototalhppout = '{FixDouble_drutama}wototalhppout', wouraian = '{FixQuotes_drutama}wouraian', wocatatan = '{FixQuotes_drutama}wocatatan', wonoref = '{FixQuotes_drutama}wonoref', wotglnoref = '{FixQuotes_AsFormatTanggal_drutama}wotglnoref', woidbom = {drutama}woidbom, woidpdr = {drutama}woidpdr, wostatusmrsin = {drutama}wostatusmrsin, wostatusmrsout = {drutama}wostatusmrsout, wostatusmrnin = {drutama}wostatusmrnin, wostatusmrnout = {drutama}wostatusmrnout, wostatuspdin = {drutama}wostatuspdin, wostatuspdout = {drutama}wostatuspdout, wostatus = {drutama}wostatus, wostatussebelumnya = {drutama}wostatussebelumnya, wojmlrevisi = wojmlrevisi+1, wocetakanke = {drutama}wocetakanke, womodifikasiuser = {drutama}womodifikasiuser, womodifikasitgl = NOW(), wocustomtext1 = '{FixQuotes_drutama}wocustomtext1', wocustomtext2 = '{FixQuotes_drutama}wocustomtext2', wocustomtext3 = '{FixQuotes_drutama}wocustomtext3', wocustomtext4 = '{FixQuotes_drutama}wocustomtext4', wocustomtext5 = '{FixQuotes_drutama}wocustomtext5', wocustomint1 = {drutama}wocustomint1, wocustomint2 = {drutama}wocustomint2, wocustomint3 = {drutama}wocustomint3, wocustomdbl1 = '{FixDouble_drutama}wocustomdbl1', wocustomdbl2 = '{FixDouble_drutama}wocustomdbl2', wocustomdbl3 = '{FixDouble_drutama}wocustomdbl3', wocustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}wocustomdate1', wocustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}wocustomdate2', wocustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}wocustomdate3', woaktivitas = '{FixDouble_drutama}woaktivitas' where woid = '{drutama}woid'
```

```sql
UPDATE m6_pdr_in SET jmlrealisasi = (CASE idpdrin {updNilaiPdrIn} ELSE jmlrealisasi END) WHERE
```

```sql
UPDATE m6_pdr_out SET jmlrealisasi = (CASE idpdrout {updNilaiPdrOut} ELSE jmlrealisasi END) WHERE
```

```sql
UPDATE m6_pdr SET pdrstatusrealisasiin = (CASE pdrid {updNilaiPdrUtamaIn} ELSE pdrstatusrealisasiin END), pdrstatusrealisasiout = (CASE pdrid {updNilaiPdrUtamaOut} ELSE pdrstatusrealisasiout END) WHERE
```

```sql
UPDATE m6_pdr SET pdrstatusrealisasiin = (CASE pdrid {updNilaiPdrUtamaIn} ELSE pdrstatusrealisasiin END) WHERE
```

```sql
UPDATE m6_pdr SET pdrstatusrealisasiout = (CASE pdrid {updNilaiPdrUtamaOut} ELSE pdrstatusrealisasiout END) WHERE
```

```sql
UPDATE M6_Wo SET Wostatus = {nilaiStatus}, Womodifikasiuser='{userid}', Womodifikasitgl = NOW(), Woposting = 0, Wopostingtgl = '1971-01-01 00:00:00', Wojmlrevisi = Wojmlrevisi + 1 WHERE Woid = '{idtransaksi}'
```

```sql
Update M6_Wo set wocabang = '{FixQuotes_drutama}wocabang', wolokasi = '{FixQuotes_drutama}wolokasi', wogudangasal = '{FixQuotes_drutama}wogudangasal', wogudangproduksi = '{FixQuotes_drutama}wogudangproduksi', wogudangtujuan = '{FixQuotes_drutama}wogudangtujuan', wosumber = '{FixQuotes_drutama}wosumber', wojenis = '{FixQuotes_drutama}wojenis', woautonotransaksi = {drutama}woautonotransaksi, wonotransaksi = '{FixQuotes_notransaksi}', wotgl = '{FixQuotes_AsFormatTanggal_drutama}wotgl', wokodepa = {drutama}wokodepa, wodimintaoleh = {drutama}wodimintaoleh, wodimintaolehkontak = '{FixQuotes_drutama}wodimintaolehkontak', womintake = {drutama}womintake, wotgldipakai = '{FixQuotes_AsFormatTanggal_drutama}wotgldipakai', woestimasikerja = '{FixQuotes_drutama}woestimasikerja', womatauang = '{FixQuotes_drutama}womatauang', wokurs = '{FixDouble_drutama}wokurs', wototalhargain = '{FixDouble_drutama}wototalhargain', wototalhargaout = '{FixDouble_drutama}wototalhargaout', wototalhppin = '{FixDouble_drutama}wototalhppin', wototalhppout = '{FixDouble_drutama}wototalhppout', wouraian = '{FixQuotes_drutama}wouraian', wocatatan = '{FixQuotes_drutama}wocatatan', wonoref = '{FixQuotes_drutama}wonoref', wotglnoref = '{FixQuotes_AsFormatTanggal_drutama}wotglnoref', woidbom = {drutama}woidbom, woidpdr = {drutama}woidpdr, wostatusmrsin = {drutama}wostatusmrsin, wostatusmrsout = {drutama}wostatusmrsout, wostatusmrnin = {drutama}wostatusmrnin, wostatusmrnout = {drutama}wostatusmrnout, wostatuspdin = {drutama}wostatuspdin, wostatuspdout = {drutama}wostatuspdout, wostatus = {drutama}wostatus, wostatussebelumnya = {drutama}wostatussebelumnya, wojmlrevisi = wojmlrevisi+1, wocetakanke = {drutama}wocetakanke, womodifikasiuser = {drutama}womodifikasiuser, womodifikasitgl = NOW(), wocustomtext1 = '{FixQuotes_drutama}wocustomtext1', wocustomtext2 = '{FixQuotes_drutama}wocustomtext2', wocustomtext3 = '{FixQuotes_drutama}wocustomtext3', wocustomtext4 = '{FixQuotes_drutama}wocustomtext4', wocustomtext5 = '{FixQuotes_drutama}wocustomtext5', wocustomint1 = {drutama}wocustomint1, wocustomint2 = {drutama}wocustomint2, wocustomint3 = {drutama}wocustomint3, wocustomdbl1 = '{FixDouble_drutama}wocustomdbl1', wocustomdbl2 = '{FixDouble_drutama}wocustomdbl2', wocustomdbl3 = '{FixDouble_drutama}wocustomdbl3', wocustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}wocustomdate1', wocustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}wocustomdate2', wocustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}wocustomdate3' where woid = '{drutama}woid'
```

## DELETE

Total: `35`

### `client-backend/api-myerpplus/app_code/ws/m6/m6_bom.vb`

```sql
Delete from M6_Bom_In where idbom = '{result_4}'
```

```sql
Delete from M6_Bom_Out where idbom = '{result_4}'
```

```sql
DELETE FROM m6_itembom_in WHERE idbarang = '{FixDouble_idbaranghasil}'
```

```sql
DELETE FROM m6_itembom_out WHERE idbaranghasil = '{FixDouble_idbaranghasil}'
```

```sql
DELETE FROM m6_itembom_in WHERE idbarang = '{FixDouble_idBarangHasil}'
```

```sql
DELETE FROM m6_itembom_out WHERE idbaranghasil = '{FixDouble_idBarangHasil}'
```

```sql
DELETE FROM M6_Bom_In WHERE idBom ='{idtransaksi}'
```

```sql
DELETE FROM M6_Bom_Out WHERE idBom ='{idtransaksi}'
```

```sql
DELETE FROM M6_Bom WHERE Bomid ='{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_files.vb`

```sql
DELETE FROM M6_Files WHERE fsumber = '{sumber}' AND fidtransaksi ='{idtransaksi}' AND fnamafile='{namafile}'
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_mrn.vb`

```sql
Delete from M6_Mrn_Out where idMrn = '{result_4}'
```

```sql
DELETE FROM M6_Mrn_Out WHERE idMrn ='{idtransaksi}'
```

```sql
DELETE FROM M6_Mrn WHERE Mrnid ='{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_mrs.vb`

```sql
Delete from M6_Mrs_Out where idmrs = '{result_4}'
```

```sql
DELETE FROM M6_Mrs_Out WHERE idmrs ='{idtransaksi}'
```

```sql
DELETE FROM M6_Mrs WHERE mrsid ='{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_notes.vb`

```sql
DELETE FROM M6_Notes WHERE nid = '{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_pd.vb`

```sql
Delete from M6_Pd_In where idPd = '{result_4}'
```

```sql
Delete from M6_Pd_Out where idPd = '{result_4}'
```

```sql
DELETE FROM M6_Pd_bom WHERE idPd ='{idtransaksi}'
```

```sql
DELETE FROM M6_Pd_In WHERE idPd ='{idtransaksi}'
```

```sql
DELETE FROM M6_Pd_Out WHERE idPd ='{idtransaksi}'
```

```sql
DELETE FROM M6_Pd WHERE Pdid ='{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_pdr.vb`

```sql
Delete from M6_Pdr_In where idpdr = '{result_4}'
```

```sql
Delete from M6_Pdr_Out where idpdr = '{result_4}'
```

```sql
DELETE FROM M6_Pdr_In WHERE idpdr ='{idtransaksi}'
```

```sql
DELETE FROM M6_Pdr_Out WHERE idpdr ='{idtransaksi}'
```

```sql
DELETE FROM M6_Pdr WHERE pdrid ='{idtransaksi}'
```

### `client-backend/api-myerpplus/app_code/ws/m6/m6_wo.vb`

```sql
Delete from M6_Wo_In where idwo = '{result_4}'
```

```sql
Delete from M6_Wo_Out where idwo = '{result_4}'
```

```sql
Delete from M6_wo_activity where idwo = '{result_4}'
```

```sql
Delete from M6_wo_route_card where idwo = '{result_4}'
```

```sql
DELETE FROM M6_Wo_In WHERE idwo ='{idtransaksi}'
```

```sql
DELETE FROM M6_Wo_Out WHERE idwo ='{idtransaksi}'
```

```sql
DELETE FROM M6_Wo WHERE woid ='{idtransaksi}'
```

