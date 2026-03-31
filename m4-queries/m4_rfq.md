# M4_RFQ Queries

## Query 1

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_rfq.vb`

```sql
DELETE FROM M4_rfq WHERE rfqid = '{idtransaksi}'
```

## Query 2

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_rfq.vb`

```sql
DELETE FROM M4_rfq_Detail WHERE idrfq = '{idtransaksi}'
```

## Query 3

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_rfq.vb`

```sql
Delete from M4_Rfq_Detail where idrfq = '{result_4}'
```

## Query 4

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_rfq_history.vb`

```sql
INSERT INTO m4_rfq_detail_history (SELECT 0, '{result_4}', rfq.* FROM m4_rfq_detail rfq WHERE rfq.idrfq = '{idtransaksi}' )
```

## Query 5

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_rfq_history.vb`

```sql
INSERT INTO m4_rfq_history(SELECT 0, rfq.* FROM m4_rfq rfq WHERE rfq.rfqid = '{idtransaksi}')
```

## Query 6

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_rfq.vb`

```sql
Insert into M0_Userlog (uluserid, ulidmodule, ulidmenu, uljenisaktivitas, ulaktivitas, ultgl, ulkodepa) values({userid}, {mdlid}, {mnid}, {jnsaktivitas}, '{notransaksi}', NOW(), {0})
```

## Query 7

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_rfq.vb`

```sql
Insert into M4_Rfq (rfqcabang, rfqlokasi, rfqsumber, rfqautonotransaksi, rfqnotransaksi, rfqtgl, rfqkodepa, rfqidpr, rfqkontakperson, rfq1alamat1, rfq1alamat2, rfq1alamat3, rfq2alamat1, rfq2alamat2, rfq2alamat3, rfquraian, rfqcatatan, rfqnoref, rfqtglnoref, rfqstatus, rfqstatussebelumnya, rfqjmlrevisi, rfqcetakanke, rfqinputuser, rfqinputtgl, rfqmodifikasiuser, rfqmodifikasitgl, rfqposting, rfqpostingtgl, rfqisclose, rfqcustomtext1, rfqcustomtext2, rfqcustomtext3, rfqcustomtext4, rfqcustomtext5, rfqcustomint1, rfqcustomint2, rfqcustomint3, rfqcustomdbl1, rfqcustomdbl2, rfqcustomdbl3, rfqcustomdate1, rfqcustomdate2, rfqcustomdate3, rfqtglawal, rfqtglakhir) values('{rfqcabang}', '{rfqlokasi}', '{rfqsumber}', {rfqautonotransaksi}, '{notransaksi}', '{rfqtgl}', '{rfqkodepa}', '{rfqidpr}', '{rfqkontakperson}', '{rfq1alamat1}', '{rfq1alamat2}', '{rfq1alamat3}', '{rfq2alamat1}', '{rfq2alamat2}', '{rfq2alamat3}', '{rfquraian}', '{rfqcatatan}', '{rfqnoref}', '{rfqtglnoref}', {rfqstatus}, {rfqstatussebelumnya}, {rfqjmlrevisi}, {rfqcetakanke}, '{rfqinputuser}', '{drutama("rfqinputtgl"), "yyyy-MM-dd HH:mm:ss"}', '{rfqmodifikasiuser}', '{drutama("rfqmodifikasitgl"), "yyyy-MM-dd HH:mm:ss"}', {rfqposting}, '{drutama("rfqpostingtgl"), "yyyy-MM-dd HH:mm:ss"}', {rfqisclose}, '{rfqcustomtext1}', '{rfqcustomtext2}', '{rfqcustomtext3}', '{rfqcustomtext4}', '{rfqcustomtext5}', {rfqcustomint1}, {rfqcustomint2}, {rfqcustomint3}, '{rfqcustomdbl1}', '{rfqcustomdbl2}', '{rfqcustomdbl3}', '{rfqcustomdate1}', '{rfqcustomdate2}', '{rfqcustomdate3}', '{rfqtglawal}', '{rfqtglakhir}')
```

## Query 8

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_rfq.vb`

```sql
Insert into M4_Rfq_Detail(idrfqdetail, idrfq, sumber, idkontak, catatan, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2.ToString}
```

## Query 9

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_rfq.vb`

```sql
SELECT rfqcabang, rfqlokasi, rfqsumber, rfqautonotransaksi, rfqnotransaksi, rfqtgl FROM M4_rfq WHERE rfqid = '{idtransaksi}'
```

## Query 10

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_rfq_history.vb`

```sql
SELECT rfqidhistory FROM m4_rfq_history WHERE rfqid = '{idtransaksi}' ORDER BY rfqmodifikasitgl DESC LIMIT 1
```

## Query 11

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_rfq.vb`

```sql
UPDATE m4_Rfq SET Rfqstatus = {nilaiStatus}, Rfqmodifikasiuser='{userid}', Rfqmodifikasitgl = NOW(), Rfqposting = 0, Rfqpostingtgl = '1971-01-01 00:00:00', Rfqjmlrevisi = Rfqjmlrevisi + 1 WHERE Rfqid = '{idtransaksi}'
```

## Query 12

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_rfq.vb`

```sql
Update M4_Rfq set rfqcabang = '{rfqcabang}', rfqlokasi = '{rfqlokasi}', rfqsumber = '{rfqsumber}', rfqautonotransaksi = {rfqautonotransaksi}, rfqnotransaksi = '{notransaksi}', rfqtgl = '{rfqtgl}', rfqkodepa = '{rfqkodepa}', rfqidpr = '{rfqidpr}', rfqkontakperson = '{rfqkontakperson}', rfq1alamat1 = '{rfq1alamat1}', rfq1alamat2 = '{rfq1alamat2}', rfq1alamat3 = '{rfq1alamat3}', rfq2alamat1 = '{rfq2alamat1}', rfq2alamat2 = '{rfq2alamat2}', rfq2alamat3 = '{rfq2alamat3}', rfquraian = '{rfquraian}', rfqcatatan = '{rfqcatatan}', rfqnoref = '{rfqnoref}', rfqtglnoref = '{rfqtglnoref}', rfqstatus = {rfqstatus}, rfqstatussebelumnya = {rfqstatussebelumnya}, rfqjmlrevisi = {rfqjmlrevisi}, rfqcetakanke = {rfqcetakanke}, rfqinputuser = '{rfqinputuser}', rfqinputtgl = '{drutama("rfqinputtgl"), "yyyy-MM-dd HH:mm:ss"}', rfqmodifikasiuser = '{rfqmodifikasiuser}', rfqmodifikasitgl = '{drutama("rfqmodifikasitgl"), "yyyy-MM-dd HH:mm:ss"}', rfqposting = {rfqposting}, rfqpostingtgl = '{drutama("rfqpostingtgl"), "yyyy-MM-dd HH:mm:ss"}', rfqcustomtext1 = '{rfqcustomtext1}', rfqcustomtext2 = '{rfqcustomtext2}', rfqcustomtext3 = '{rfqcustomtext3}', rfqcustomtext4 = '{rfqcustomtext4}', rfqcustomtext5 = '{rfqcustomtext5}', rfqcustomint1 = {rfqcustomint1}, rfqcustomint2 = {rfqcustomint2}, rfqcustomint3 = {rfqcustomint3}, rfqcustomdbl1 = '{rfqcustomdbl1}', rfqcustomdbl2 = '{rfqcustomdbl2}', rfqcustomdbl3 = '{rfqcustomdbl3}', rfqcustomdate1 = '{rfqcustomdate1}', rfqcustomdate2 = '{rfqcustomdate2}', rfqcustomdate3 = '{rfqcustomdate3}', rfqtglawal = '{rfqtglawal}', rfqtglakhir = '{rfqtglakhir}' where rfqid = {rfqid}
```

## Query 13

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_rfq_history.vb`

```sql
select `rfq`.`rfqidhistory` AS `rfqidhistory`,`rfq`.`rfqid` AS `rfqid`,`rfq`.`rfqcabang` AS `rfqcabang`,`rfq`.`rfqlokasi` AS `rfqlokasi`,`rfq`.`rfqgudang` AS `rfqgudang`,`rfq`.`rfqasalbarang` AS `rfqasalbarang`,`rfq`.`rfqasalbarangkategori` AS `rfqasalbarangkategori`,`rfq`.`rfqjenispembelian` AS `rfqjenispembelian`,`rfq`.`rfqjenispembeliankategori` AS `rfqjenispembeliankategori`,`rfq`.`rfqcarabayar` AS `rfqcarabayar`,`rfq`.`rfqsumber` AS `rfqsumber`,`rfq`.`rfqautonogrup` AS `rfqautonogrup`,`rfq`.`rfqnogrup` AS `rfqnogrup`,`rfq`.`rfqautonotransaksi` AS `rfqautonotransaksi`,`rfq`.`rfqnotransaksi` AS `rfqnotransaksi`,`rfq`.`rfqtgl` AS `rfqtgl`,`rfq`.`rfqkodepa` AS `rfqkodepa`,`rfq`.`rfqsupplier` AS `rfqsupplier`,`rfq`.`rfqsupplierkontak` AS `rfqsupplierkontak`,`rfq`.`rfq1alamat1` AS `rfq1alamat1`,`rfq`.`rfq1alamat2` AS `rfq1alamat2`,`rfq`.`rfq1alamat3` AS `rfq1alamat3`,`rfq`.`rfq2alamat1` AS `rfq2alamat1`,`rfq`.`rfq2alamat2` AS `rfq2alamat2`,`rfq`.`rfq2alamat3` AS `rfq2alamat3`,`rfq`.`rfqbagianpembelian` AS `rfqbagianpembelian`,`rfq`.`rfqtgldipenuhi` AS `rfqtgldipenuhi`,`rfq`.`rfqtermin` AS `rfqtermin`,`rfq`.`rfqtgljatuhtempo` AS `rfqtgljatuhtempo`,`rfq`.`rfquraian` AS `rfquraian`,`rfq`.`rfqcatatan` AS `rfqcatatan`,`rfq`.`rfqnoref` AS `rfqnoref`,`rfq`.`rfqtglnoref` AS `rfqtglnoref`,`rfq`.`rfqtglpenutupan` AS `rfqtglpenutupan`,`rfq`.`rfqmatauang` AS `rfqmatauang`,`rfq`.`rfqkurs` AS `rfqkurs`,`rfq`.`rfqhargatermasukpajak` AS `rfqhargatermasukpajak`,`rfq`.`rfqtotal` AS `rfqtotal`,`rfq`.`rfqdiskonpersen` AS `rfqdiskonpersen`,`rfq`.`rfqdiskon` AS `rfqdiskon`,`rfq`.`rfqtotalpajak1detail` AS `rfqtotalpajak1detail`,`rfq`.`rfqtotalpajak2detail` AS `rfqtotalpajak2detail`,`rfq`.`rfqbiayalainpersen` AS `rfqbiayalainpersen`,`rfq`.`rfqbiayalain` AS `rfqbiayalain`,`rfq`.`rfqtotaltransaksi` AS `rfqtotaltransaksi`,`rfq`.`rfqidpr` AS `rfqidpr`,`rfq`.`rfqidcs` AS `rfqidcs`,`rfq`.`rfqstatuspo` AS `rfqstatuspo`,`rfq`.`rfqstatusipc` AS `rfqstatusipc`,`rfq`.`rfqstatusgrn` AS `rfqstatusgrn`,`rfq`.`rfqstatusri` AS `rfqstatusri`,`rfq`.`rfqstatusdnr` AS `rfqstatusdnr`,`rfq`.`rfqstatusprt` AS `rfqstatusprt`,`rfq`.`rfqstatusrealisasi` AS `rfqstatusrealisasi`,`rfq`.`rfqstatus` AS `rfqstatus`,`rfq`.`rfqstatussebelumnya` AS `rfqstatussebelumnya`,`rfq`.`rfqjmlrevisi` AS `rfqjmlrevisi`,`rfq`.`rfqcetakanke` AS `rfqcetakanke`,`rfq`.`rfqinputuser` AS `rfqinputuser`,`rfq`.`rfqinputtgl` AS `rfqinputtgl`,`rfq`.`rfqmodifikasiuser` AS `rfqmodifikasiuser`,`rfq`.`rfqmodifikasitgl` AS `rfqmodifikasitgl`,`rfq`.`rfqposting` AS `rfqposting`,`rfq`.`rfqpostingtgl` AS `rfqpostingtgl`,`rfq`.`rfqisclose` AS `rfqisclose`,`br`.`bnama` AS `rfqcabangnama`,`lc`.`lnama` AS `rfqlokasinama`,`wh`.`wnama` AS `rfqgudangnama`,`c1`.`kkode` AS `rfqsupplierkode`,`c1`.`knama` AS `rfqsuppliernama`,`c2`.`kkode` AS `rfqbagianpembeliankode`,`c2`.`knama` AS `rfqbagianpembeliannama`,`pr`.`prnotransaksi` AS `prnotransaksi`,`cs`.`csnotransaksi` AS `csnotransaksi`,`st1`.`nama` AS `rfqstatusnama`,`st2`.`nama` AS `rfqstatussebelumnyanama`,`u1`.`unama` AS `rfqinputusernama`,`u2`.`unama` AS `rfqmodifikasiusernama` from (((((((((((`m4_rfq_history` `rfq` left join `m1_branch` `br` on((`br`.`bkode` = `rfq`.`rfqcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `rfq`.`rfqlokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `rfq`.`rfqgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `rfq`.`rfqsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `rfq`.`rfqbagianpembelian`))) left join `m4_pr` `pr` on((`rfq`.`rfqidpr` = `pr`.`prid`))) left join `m4_cs` `cs` on((`rfq`.`rfqidcs` = `cs`.`csid`))) left join `m0_status` `st1` on((`st1`.`kode` = `rfq`.`rfqstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `rfq`.`rfqstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `rfq`.`rfqinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `rfq`.`rfqmodifikasiuser`)))
```

## Query 14

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_rfq_history.vb`

```sql
select `rfq`.`rfqidhistory` AS `rfqidhistory`,`rfq`.`rfqid` AS `rfqid`,`rfq`.`rfqid` AS `rfqid`,`rfq`.`rfqcabang` AS `rfqcabang`,`rfq`.`rfqlokasi` AS `rfqlokasi`,`rfq`.`rfqgudang` AS `rfqgudang`,`rfq`.`rfqasalbarang` AS `rfqasalbarang`,`rfq`.`rfqasalbarangkategori` AS `rfqasalbarangkategori`,`rfq`.`rfqjenispembelian` AS `rfqjenispembelian`,`rfq`.`rfqjenispembeliankategori` AS `rfqjenispembeliankategori`,`rfq`.`rfqcarabayar` AS `rfqcarabayar`,`rfq`.`rfqsumber` AS `rfqsumber`,`rfq`.`rfqautonogrup` AS `rfqautonogrup`,`rfq`.`rfqnogrup` AS `rfqnogrup`,`rfq`.`rfqautonotransaksi` AS `rfqautonotransaksi`,`rfq`.`rfqnotransaksi` AS `rfqnotransaksi`,`rfq`.`rfqtgl` AS `rfqtgl`,`rfq`.`rfqkodepa` AS `rfqkodepa`,`rfq`.`rfqsupplier` AS `rfqsupplier`,`rfq`.`rfqsupplierkontak` AS `rfqsupplierkontak`,`rfq`.`rfq1alamat1` AS `rfq1alamat1`,`rfq`.`rfq1alamat2` AS `rfq1alamat2`,`rfq`.`rfq1alamat3` AS `rfq1alamat3`,`rfq`.`rfq2alamat1` AS `rfq2alamat1`,`rfq`.`rfq2alamat2` AS `rfq2alamat2`,`rfq`.`rfq2alamat3` AS `rfq2alamat3`,`rfq`.`rfqbagianpembelian` AS `rfqbagianpembelian`,`rfq`.`rfqtgldipenuhi` AS `rfqtgldipenuhi`,`rfq`.`rfqtermin` AS `rfqtermin`,`rfq`.`rfqtgljatuhtempo` AS `rfqtgljatuhtempo`,`rfq`.`rfquraian` AS `rfquraian`,`rfq`.`rfqcatatan` AS `rfqcatatan`,`rfq`.`rfqnoref` AS `rfqnoref`,`rfq`.`rfqtglnoref` AS `rfqtglnoref`,`rfq`.`rfqtglpenutupan` AS `rfqtglpenutupan`,`rfq`.`rfqmatauang` AS `rfqmatauang`,`rfq`.`rfqkurs` AS `rfqkurs`,`rfq`.`rfqhargatermasukpajak` AS `rfqhargatermasukpajak`,`rfq`.`rfqtotal` AS `rfqtotal`,`rfq`.`rfqdiskonpersen` AS `rfqdiskonpersen`,`rfq`.`rfqdiskon` AS `rfqdiskon`,`rfq`.`rfqtotalpajak1detail` AS `rfqtotalpajak1detail`,`rfq`.`rfqtotalpajak2detail` AS `rfqtotalpajak2detail`,`rfq`.`rfqbiayalainpersen` AS `rfqbiayalainpersen`,`rfq`.`rfqbiayalain` AS `rfqbiayalain`,`rfq`.`rfqtotaltransaksi` AS `rfqtotaltransaksi`,`rfq`.`rfqidpr` AS `rfqidpr`,`rfq`.`rfqidcs` AS `rfqidcs`,`rfq`.`rfqstatuspo` AS `rfqstatuspo`,`rfq`.`rfqstatusipc` AS `rfqstatusipc`,`rfq`.`rfqstatusgrn` AS `rfqstatusgrn`,`rfq`.`rfqstatusri` AS `rfqstatusri`,`rfq`.`rfqstatusdnr` AS `rfqstatusdnr`,`rfq`.`rfqstatusprt` AS `rfqstatusprt`,`rfq`.`rfqstatusrealisasi` AS `rfqstatusrealisasi`,`rfq`.`rfqstatus` AS `rfqstatus`,`rfq`.`rfqstatussebelumnya` AS `rfqstatussebelumnya`,`rfq`.`rfqjmlrevisi` AS `rfqjmlrevisi`,`rfq`.`rfqcetakanke` AS `rfqcetakanke`,`rfq`.`rfqinputuser` AS `rfqinputuser`,`rfq`.`rfqinputtgl` AS `rfqinputtgl`,`rfq`.`rfqmodifikasiuser` AS `rfqmodifikasiuser`,`rfq`.`rfqmodifikasitgl` AS `rfqmodifikasitgl`,`rfq`.`rfqposting` AS `rfqposting`,`rfq`.`rfqpostingtgl` AS `rfqpostingtgl`,`rfq`.`rfqisclose` AS `rfqisclose`,`rfq`.`rfqcustomtext1` AS `rfqcustomtext1`,`rfq`.`rfqcustomtext2` AS `rfqcustomtext2`,`rfq`.`rfqcustomtext3` AS `rfqcustomtext3`,`rfq`.`rfqcustomtext4` AS `rfqcustomtext4`,`rfq`.`rfqcustomtext5` AS `rfqcustomtext5`,`rfq`.`rfqcustomint1` AS `rfqcustomint1`,`rfq`.`rfqcustomint2` AS `rfqcustomint2`,`rfq`.`rfqcustomint3` AS `rfqcustomint3`,`rfq`.`rfqcustomdbl1` AS `rfqcustomdbl1`,`rfq`.`rfqcustomdbl2` AS `rfqcustomdbl2`,`rfq`.`rfqcustomdbl3` AS `rfqcustomdbl3`,`rfq`.`rfqcustomdate1` AS `rfqcustomdate1`,`rfq`.`rfqcustomdate2` AS `rfqcustomdate2`,`rfq`.`rfqcustomdate3` AS `rfqcustomdate3`,`br`.`bnama` AS `rfqcabangnama`,`lc`.`lnama` AS `rfqlokasinama`,`wh`.`wnama` AS `rfqgudangnama`,`c1`.`kkode` AS `rfqsupplierkode`,`c1`.`knama` AS `rfqsuppliernama`,`c2`.`kkode` AS `rfqbagianpembeliankode`,`c2`.`knama` AS `rfqbagianpembeliannama`,`tr`.`trnama` AS `rfqterminnama`,`tr`.`trdiskon1` AS `rfqtermindiskon1`,`tr`.`trharidiskon1` AS `rfqterminharidiskon1`,`tr`.`trdiskon2` AS `rfqtermindiskon2`,`tr`.`trharidiskon2` AS `rfqterminharidiskon2`,`tr`.`trdenda` AS `rfqtermindenda`,`tr`.`trdendaper` AS `rfqtermindendaper`,`tr`.`trharijatuhtempo` AS `rfqterminharijatuhtempo`,`pr`.`prnotransaksi` AS `rfqnotransaksipr`,`cs`.`csnotransaksi` AS `rfqnotransaksics`,`st1`.`nama` AS `rfqstatusnama`,`st2`.`nama` AS `rfqstatussebelumnyanama`,`u1`.`unama` AS `rfqinputusernama`,`u2`.`unama` AS `rfqmodifikasiusernama`,`rfqd`.`idhistorydetail` AS `idhistorydetail`,`rfqd`.`idhistory` AS `idhistory`,`rfqd`.`idrfqdetail` AS `idrfqdetail`,`rfqd`.`idrfq` AS `idrfq`,`rfqd`.`idbarang` AS `idbarang`,`rfqd`.`namabarang` AS `namabarang`,`rfqd`.`tipebarang` AS `tipebarang`,`rfqd`.`jml` AS `jml`,`rfqd`.`satuan` AS `satuan`,`rfqd`.`nilaisatuan` AS `nilaisatuan`,`rfqd`.`jmlbarang` AS `jmlbarang`,`rfqd`.`satuanbarang` AS `satuanbarang`,`rfqd`.`matauang` AS `matauang`,`rfqd`.`kurs` AS `kurs`,`rfqd`.`harga` AS `harga`,`rfqd`.`diskon` AS `diskon`,`rfqd`.`jmldiskon` AS `jmldiskon`,`rfqd`.`pajak1` AS `pajak1`,`rfqd`.`jmlpajak1` AS `jmlpajak1`,`rfqd`.`pajak2` AS `pajak2`,`rfqd`.`jmlpajak2` AS `jmlpajak2`,`rfqd`.`cabang` AS `cabang`,`rfqd`.`lokasi` AS `lokasi`,`rfqd`.`gudang` AS `gudang`,`rfqd`.`costcenter` AS `costcenter`,`rfqd`.`divisi` AS `divisi`,`rfqd`.`subdivisi` AS `subdivisi`,`rfqd`.`proyek` AS `proyek`,`rfqd`.`catatan` AS `catatan`,`rfqd`.`urutan` AS `urutan`,`rfqd`.`idprdetail` AS `idprdetail`,`rfqd`.`idcsdetail` AS `idcsdetail`,`rfqd`.`jmlpo` AS `jmlpo`,`rfqd`.`statuspo` AS `statuspo`,`rfqd`.`jmlipc` AS `jmlipc`,`rfqd`.`statusipc` AS `statusipc`,`rfqd`.`jmlgrn` AS `jmlgrn`,`rfqd`.`statusgrn` AS `statusgrn`,`rfqd`.`jmlri` AS `jmlri`,`rfqd`.`statusri` AS `statusri`,`rfqd`.`jmldnr` AS `jmldnr`,`rfqd`.`statusdnr` AS `statusdnr`,`rfqd`.`jmlprt` AS `jmlprt`,`rfqd`.`statusprt` AS `statusprt`,`rfqd`.`jmlrealisasi` AS `jmlrealisasi`,`rfqd`.`statusrealisasi` AS `statusrealisasi`,`rfqd`.`isclose` AS `isclose`,`rfqd`.`customtext1` AS `customtext1`,`rfqd`.`customtext2` AS `customtext2`,`rfqd`.`customtext3` AS `customtext3`,`rfqd`.`customdbl1` AS `customdbl1`,`rfqd`.`customdbl2` AS `customdbl2`,`rfqd`.`customdbl3` AS `customdbl3`,`rfqd`.`customdate1` AS `customdate1`,`rfqd`.`customdate2` AS `customdate2`,`rfqd`.`customdate3` AS `customdate3`,`i`.`bkode` AS `kodebarang`,`t1`.`tnama` AS `pajak1nama`,`t1`.`tnilai` AS `pajak1nilai`,`t2`.`tnama` AS `pajak2nama`,`t2`.`tnilai` AS `pajak2nilai`,`brd`.`bnama` AS `cabangnama`,`lcd`.`lnama` AS `lokasinama`,`whd`.`wnama` AS `gudangnama`,`cc`.`ccnama` AS `costcenternama`,`d`.`dnama` AS `divisinama`,`sd`.`sdnama` AS `subdivisinama`,`p`.`pnama` AS `proyeknama`,`pr2`.`prnotransaksi` AS `prnotransaksi`,`cs2`.`csnotransaksi` AS `csnotransaksi`,((`rfqd`.`jmlbarang` - `rfqd`.`jmlpo`) / `rfqd`.`nilaisatuan`) AS `jmlsisapo`,((`rfqd`.`jmlbarang` - `rfqd`.`jmlrealisasi`) / `rfqd`.`nilaisatuan`) AS `jmlsisarealisasi` from (((((((((((((((((((((((((((`m4_rfq_history` `rfq` join `m4_rfq_detail_history` `rfqd` on((`rfq`.`rfqidhistory` = `rfqd`.`idhistory`))) left join `m1_branch` `br` on((`br`.`bkode` = `rfq`.`rfqcabang`))) left join `m1_location` `lc` on((`lc`.`lkode` = `rfq`.`rfqlokasi`))) left join `m1_warehouse` `wh` on((`wh`.`wkode` = `rfq`.`rfqgudang`))) left join `m1_contact` `c1` on((`c1`.`kid` = `rfq`.`rfqsupplier`))) left join `m1_contact` `c2` on((`c2`.`kid` = `rfq`.`rfqbagianpembelian`))) left join `m1_terms` `tr` on((`rfq`.`rfqtermin` = `tr`.`trkode`))) left join `m4_pr` `pr` on((`rfq`.`rfqidpr` = `pr`.`prid`))) left join `m4_cs` `cs` on((`rfq`.`rfqidcs` = `cs`.`csid`))) left join `m0_status` `st1` on((`st1`.`kode` = `rfq`.`rfqstatus`))) left join `m0_status` `st2` on((`st2`.`kode` = `rfq`.`rfqstatussebelumnya`))) left join `m0_user` `u1` on((`u1`.`userid` = `rfq`.`rfqinputuser`))) left join `m0_user` `u2` on((`u2`.`userid` = `rfq`.`rfqmodifikasiuser`))) left join `m1_item` `i` on((`i`.`bid` = `rfqd`.`idbarang`))) left join `m1_tax` `t1` on((`rfqd`.`pajak1` = `t1`.`tkode`))) left join `m1_tax` `t2` on((`rfqd`.`pajak2` = `t2`.`tkode`))) left join `m1_branch` `brd` on((`rfqd`.`cabang` = `brd`.`bkode`))) left join `m1_location` `lcd` on((`rfqd`.`lokasi` = `lcd`.`lkode`))) left join `m1_warehouse` `whd` on((`rfqd`.`gudang` = `whd`.`wkode`))) left join `m1_cost_center` `cc` on((`rfqd`.`costcenter` = `cc`.`cckode`))) left join `m1_division` `d` on((`rfqd`.`divisi` = `d`.`dkode`))) left join `m1_subdivision` `sd` on((`rfqd`.`subdivisi` = `sd`.`sdkode`))) left join `m1_project` `p` on((`rfqd`.`proyek` = `p`.`pkode`))) left join `m4_pr_detail` `prd` on((`rfqd`.`idprdetail` = `prd`.`idprdetail`))) left join `m4_pr` `pr2` on((`prd`.`idpr` = `pr2`.`prid`))) left join `m4_cs_detail` `csd` on((`rfqd`.`idcsdetail` = `csd`.`idcsdetail`))) left join `m4_cs` `cs2` on((`csd`.`idcs` = `cs2`.`csid`)))
```

## Query 15

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_rfq.vb`

```sql
select rfq.rfqid AS rfqid, rfq.rfqtglawal, rfq.rfqtglakhir , rfq.rfqcabang AS rfqcabang, rfq.rfqlokasi AS rfqlokasi, rfq.rfqsumber AS rfqsumber, rfq.rfqnotransaksi AS rfqnotransaksi, rfq.rfqtgl AS rfqtgl, rfq.rfquraian AS rfquraian, rfq.rfqcatatan AS rfqcatatan, rfq.rfqstatus AS rfqstatus, rfq.rfqstatussebelumnya AS rfqstatussebelumnya, rfq.rfqinputuser AS rfqinputuser, rfq.rfqinputtgl AS rfqinputtgl, rfq.rfqmodifikasiuser AS rfqmodifikasiuser, rfq.rfqmodifikasitgl AS rfqmodifikasitgl, br.bnama AS rfqcabangnama, lc.lnama AS rfqlokasinama, st1.nama AS rfqstatusnama, st2.nama AS rfqstatussebelumnyanama, u1.unama AS rfqinputusernama, u2.unama AS rfqmodifikasiusernama, rfq.rfqidpr, pr.prnotransaksi as rfqnotransaksipr from m4_rfq rfq join m1_branch br on rfq.rfqcabang = br.bkode join m1_location lc on rfq.rfqlokasi = lc.lkode join m0_status st1 on rfq.rfqstatus = st1.kode join m0_status st2 on rfq.rfqstatussebelumnya = st2.kode join m0_user u1 on rfq.rfqinputuser = u1.userid left join m0_user u2 on rfq.rfqmodifikasiuser = u2.userid left join m4_pr pr on rfq.rfqidpr = pr.prid
```

## Query 16

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_rfq.vb`

```sql
select rfq.rfqid AS rfqid, rfq.rfqtglawal, rfq.rfqtglakhir, rfq.rfqcabang AS rfqcabang, rfq.rfqlokasi AS rfqlokasi, rfq.rfqsumber AS rfqsumber, rfq.rfqautonotransaksi AS rfqautonotransaksi, rfq.rfqnotransaksi AS rfqnotransaksi, rfq.rfqtgl AS rfqtgl, rfq.rfqkodepa AS rfqkodepa, rfq.rfqidpr AS rfqidpr, rfq.rfqkontakperson AS rfqkontakperson, rfq.rfq1alamat1 AS rfq1alamat1, rfq.rfq1alamat2 AS rfq1alamat2, rfq.rfq1alamat3 AS rfq1alamat3, rfq.rfq2alamat1 AS rfq2alamat1, rfq.rfq2alamat2 AS rfq2alamat2, rfq.rfq2alamat3 AS rfq2alamat3, rfq.rfquraian AS rfquraian, rfq.rfqcatatan AS rfqcatatan, rfq.rfqnoref AS rfqnoref, rfq.rfqtglnoref AS rfqtglnoref, rfq.rfqstatus AS rfqstatus, rfq.rfqstatussebelumnya AS rfqstatussebelumnya, rfq.rfqjmlrevisi AS rfqjmlrevisi, rfq.rfqcetakanke AS rfqcetakanke, rfq.rfqinputuser AS rfqinputuser, rfq.rfqinputtgl AS rfqinputtgl, rfq.rfqmodifikasiuser AS rfqmodifikasiuser, rfq.rfqmodifikasitgl AS rfqmodifikasitgl, rfq.rfqposting AS rfqposting, rfq.rfqpostingtgl AS rfqpostingtgl, rfq.rfqisclose AS rfqisclose, rfq.rfqcustomtext1 AS rfqcustomtext1, rfq.rfqcustomtext2 AS rfqcustomtext2, rfq.rfqcustomtext3 AS rfqcustomtext3, rfq.rfqcustomtext4 AS rfqcustomtext4, rfq.rfqcustomtext5 AS rfqcustomtext5, rfq.rfqcustomint1 AS rfqcustomint1, rfq.rfqcustomint2 AS rfqcustomint2, rfq.rfqcustomint3 AS rfqcustomint3, rfq.rfqcustomdbl1 AS rfqcustomdbl1, rfq.rfqcustomdbl2 AS rfqcustomdbl2, rfq.rfqcustomdbl3 AS rfqcustomdbl3, rfq.rfqcustomdate1 AS rfqcustomdate1, rfq.rfqcustomdate2 AS rfqcustomdate2, rfq.rfqcustomdate3 AS rfqcustomdate3, pr.prnotransaksi as rfqnotransaksipr, rfqd.idrfqdetail AS idrfqdetail, rfqd.idrfq AS idrfq, rfqd.sumber AS sumber, rfqd.idkontak AS idkontak, rfqd.catatan AS catatan, rfqd.urutan AS urutan, rfqd.isclose AS isclose, rfqd.customtext1 AS customtext1, rfqd.customtext2 AS customtext2, rfqd.customtext3 AS customtext3, rfqd.customdbl1 AS customdbl1, rfqd.customdbl2 AS customdbl2, rfqd.customdbl3 AS customdbl3, rfqd.customdate1 AS customdate1, rfqd.customdate2 AS customdate2, rfqd.customdate3 AS customdate3, c.kkode as kodekontak, c.knama as namakontak from m4_rfq rfq join m4_rfq_detail rfqd on rfq.rfqid = rfqd.idrfq left join m4_pr pr on rfq.rfqidpr = pr.prid left join m1_contact c on rfqd.idkontak = c.kid
```

## Query 17

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_rfq_history.vb`

```sql
select rfq.rfqidhistory, rfq.rfqid AS rfqid, rfq.rfqtglawal, rfq.rfqtglakhir , rfq.rfqcabang AS rfqcabang, rfq.rfqlokasi AS rfqlokasi, rfq.rfqsumber AS rfqsumber, rfq.rfqnotransaksi AS rfqnotransaksi, rfq.rfqtgl AS rfqtgl, rfq.rfquraian AS rfquraian, rfq.rfqcatatan AS rfqcatatan, rfq.rfqstatus AS rfqstatus, rfq.rfqstatussebelumnya AS rfqstatussebelumnya, rfq.rfqinputuser AS rfqinputuser, rfq.rfqinputtgl AS rfqinputtgl, rfq.rfqmodifikasiuser AS rfqmodifikasiuser, rfq.rfqmodifikasitgl AS rfqmodifikasitgl, br.bnama AS rfqcabangnama, lc.lnama AS rfqlokasinama, st1.nama AS rfqstatusnama, st2.nama AS rfqstatussebelumnyanama, u1.unama AS rfqinputusernama, u2.unama AS rfqmodifikasiusernama, rfq.rfqidpr, pr.prnotransaksi as rfqnotransaksipr from m4_rfq_history rfq join m1_branch br on rfq.rfqcabang = br.bkode join m1_location lc on rfq.rfqlokasi = lc.lkode join m0_status st1 on rfq.rfqstatus = st1.kode join m0_status st2 on rfq.rfqstatussebelumnya = st2.kode join m0_user u1 on rfq.rfqinputuser = u1.userid left join m0_user u2 on rfq.rfqmodifikasiuser = u2.userid left join m4_pr pr on rfq.rfqidpr = pr.prid
```

## Query 18

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_rfq_history.vb`

```sql
select rfq.rfqidhistory, rfqd.idhistorydetail, rfqd.idhistory, rfq.rfqid AS rfqid, rfq.rfqtglawal, rfq.rfqtglakhir, rfq.rfqcabang AS rfqcabang, rfq.rfqlokasi AS rfqlokasi, rfq.rfqsumber AS rfqsumber, rfq.rfqautonotransaksi AS rfqautonotransaksi, rfq.rfqnotransaksi AS rfqnotransaksi, rfq.rfqtgl AS rfqtgl, rfq.rfqkodepa AS rfqkodepa, rfq.rfqidpr AS rfqidpr, rfq.rfqkontakperson AS rfqkontakperson, rfq.rfq1alamat1 AS rfq1alamat1, rfq.rfq1alamat2 AS rfq1alamat2, rfq.rfq1alamat3 AS rfq1alamat3, rfq.rfq2alamat1 AS rfq2alamat1, rfq.rfq2alamat2 AS rfq2alamat2, rfq.rfq2alamat3 AS rfq2alamat3, rfq.rfquraian AS rfquraian, rfq.rfqcatatan AS rfqcatatan, rfq.rfqnoref AS rfqnoref, rfq.rfqtglnoref AS rfqtglnoref, rfq.rfqstatus AS rfqstatus, rfq.rfqstatussebelumnya AS rfqstatussebelumnya, rfq.rfqjmlrevisi AS rfqjmlrevisi, rfq.rfqcetakanke AS rfqcetakanke, rfq.rfqinputuser AS rfqinputuser, rfq.rfqinputtgl AS rfqinputtgl, rfq.rfqmodifikasiuser AS rfqmodifikasiuser, rfq.rfqmodifikasitgl AS rfqmodifikasitgl, rfq.rfqposting AS rfqposting, rfq.rfqpostingtgl AS rfqpostingtgl, rfq.rfqisclose AS rfqisclose, rfq.rfqcustomtext1 AS rfqcustomtext1, rfq.rfqcustomtext2 AS rfqcustomtext2, rfq.rfqcustomtext3 AS rfqcustomtext3, rfq.rfqcustomtext4 AS rfqcustomtext4, rfq.rfqcustomtext5 AS rfqcustomtext5, rfq.rfqcustomint1 AS rfqcustomint1, rfq.rfqcustomint2 AS rfqcustomint2, rfq.rfqcustomint3 AS rfqcustomint3, rfq.rfqcustomdbl1 AS rfqcustomdbl1, rfq.rfqcustomdbl2 AS rfqcustomdbl2, rfq.rfqcustomdbl3 AS rfqcustomdbl3, rfq.rfqcustomdate1 AS rfqcustomdate1, rfq.rfqcustomdate2 AS rfqcustomdate2, rfq.rfqcustomdate3 AS rfqcustomdate3, pr.prnotransaksi as rfqnotransaksipr, rfqd.idrfqdetail AS idrfqdetail, rfqd.idrfq AS idrfq, rfqd.sumber AS sumber, rfqd.idkontak AS idkontak, rfqd.catatan AS catatan, rfqd.urutan AS urutan, rfqd.isclose AS isclose, rfqd.customtext1 AS customtext1, rfqd.customtext2 AS customtext2, rfqd.customtext3 AS customtext3, rfqd.customdbl1 AS customdbl1, rfqd.customdbl2 AS customdbl2, rfqd.customdbl3 AS customdbl3, rfqd.customdate1 AS customdate1, rfqd.customdate2 AS customdate2, rfqd.customdate3 AS customdate3, c.kkode as kodekontak, c.knama as namakontak from m4_rfq_history rfq join m4_rfq_detail_history rfqd on rfq.rfqidhistory = rfqd.idhistory left join m4_pr pr on rfq.rfqidpr = pr.prid left join m1_contact c on rfqd.idkontak = c.kid
```

