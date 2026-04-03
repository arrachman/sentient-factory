# M11 Queries

Collected from `client-backend/api-myerpplus/app_code/ws/myerpplus.vb` dispatch targets under `app_code/ws/m11`.

Total queries: `352`

## `client-backend/api-myerpplus/app_code/ws/m11/m11_ak.vb`

```sql
SELECT EXISTS(SELECT 1 FROM m_11_kj_detail JOIN m_11_kj ON idkj = kjid WHERE idkjdetail = '{idkjdetail}' AND (kjstatus = 2 OR kjstatus = 3 OR kjstatus = 4 OR kjstatus = 7) LIMIT 1) as rowExists, '{idkjdetail}' as idkjdetail, bkode FROM m1_item WHERE bid = '{idbarang}'
```

```sql
SELECT COUNT(akid), aknotransaksi, aknoref FROM M_11_ak WHERE akid='{result_4}' AND akstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(akid) FROM m_11_ak WHERE aknotransaksi='{notransaksi}'
```

```sql
SELECT COUNT(akid), aknoref, aknotransaksi FROM m_11_ak WHERE YEAR(aktgl) = YEAR('{FixQuotes_AsFormatTanggal_drutama}aktgl') AND aknoref = '{FixQuotes_drutama}aknoref' AND akperawatan = '{FixQuotes_drutama}akperawatan' AND akkategoripasien = '{FixQuotes_drutama}akkategoripasien'
```

```sql
SELECT COUNT(akid), aknoref, aknotransaksi FROM m_11_ak WHERE YEAR(aktgl) = YEAR('{FixQuotes_AsFormatTanggal_drutama}aktgl') AND aknoref = '{FixQuotes_drutama}aknoref' AND akperawatan = '{FixQuotes_drutama}akperawatan'
```

```sql
Update M_11_ak set akcabang = '{FixQuotes_drutama}akcabang', aklokasi = '{FixQuotes_drutama}aklokasi', akgudang = '{FixQuotes_drutama}akgudang', aksumber = '{FixQuotes_drutama}aksumber', akautonotransaksi = {drutama}akautonotransaksi, aknotransaksi = '{FixQuotes_notransaksi}', aktgl = '{FixQuotes_AsFormatTanggal_drutama}aktgl', akkodepa = {drutama}akkodepa, akcustomer = {drutama}akcustomer, akcustomerkontak = '{FixQuotes_drutama}akcustomerkontak', akuraian = '{FixQuotes_drutama}akuraian', akcatatan = '{FixQuotes_drutama}akcatatan', aknoref = '{FixQuotes_drutama}aknoref', aktglnoref = '{FixQuotes_AsFormatTanggal_drutama}aktglnoref', aktotaltransaksi = '{FixDouble_drutama}aktotaltransaksi', akidkj = {drutama}akidkj, akstatusrealisasi = {drutama}akstatusrealisasi, akstatus = {drutama}akstatus, akstatussebelumnya = {drutama}akstatussebelumnya, akjmlrevisi = akjmlrevisi+1, akcetakanke = {drutama}akcetakanke, akmodifikasiuser = {drutama}akmodifikasiuser, akmodifikasitgl = NOW(), akcustomtext1 = '{FixQuotes_drutama}akcustomtext1', akcustomtext2 = '{FixQuotes_drutama}akcustomtext2', akcustomtext3 = '{FixQuotes_drutama}akcustomtext3', akcustomtext4 = '{FixQuotes_drutama}akcustomtext4', akcustomtext5 = '{FixQuotes_drutama}akcustomtext5', akcustomtext6 = '{FixQuotes_drutama}akcustomtext6', akcustomtext7 = '{FixQuotes_drutama}akcustomtext7', akcustomtext8 = '{FixQuotes_drutama}akcustomtext8', akcustomtext9 = '{FixQuotes_drutama}akcustomtext9', akcustomtext10 = '{FixQuotes_drutama}akcustomtext10', akcustomtext11 = '{FixQuotes_drutama}akcustomtext11', akcustomtext12 = '{FixQuotes_drutama}akcustomtext12', akcustomtext13 = '{FixQuotes_drutama}akcustomtext13', akcustomtext14 = '{FixQuotes_drutama}akcustomtext14', akcustomtext15 = '{FixQuotes_drutama}akcustomtext15', akcustomtext16 = '{FixQuotes_drutama}akcustomtext16', akcustomtext17 = '{FixQuotes_drutama}akcustomtext17', akcustomtext18 = '{FixQuotes_drutama}akcustomtext18', akcustomtext19 = '{FixQuotes_drutama}akcustomtext19', akcustomtext20 = '{FixQuotes_drutama}akcustomtext20', akcustomint1 = {drutama}akcustomint1, akcustomint2 = {drutama}akcustomint2, akcustomint3 = {drutama}akcustomint3, akcustomint4 = {drutama}akcustomint4, akcustomint5 = {drutama}akcustomint5, akcustomint6 = {drutama}akcustomint6, akcustomint7 = {drutama}akcustomint7, akcustomint8 = {drutama}akcustomint8, akcustomint9 = {drutama}akcustomint9, akcustomint10 = {drutama}akcustomint10, akcustomint11 = {drutama}akcustomint11, akcustomint12 = {drutama}akcustomint12, akcustomint13 = {drutama}akcustomint13, akcustomint14 = {drutama}akcustomint14, akcustomint15 = {drutama}akcustomint15, akcustomint16 = {drutama}akcustomint16, akcustomint17 = {drutama}akcustomint17, akcustomint18 = {drutama}akcustomint18, akcustomint19 = {drutama}akcustomint19, akcustomint20 = {drutama}akcustomint20, akcustomdbl1 = '{FixDouble_drutama}akcustomdbl1', akcustomdbl2 = '{FixDouble_drutama}akcustomdbl2', akcustomdbl3 = '{FixDouble_drutama}akcustomdbl3', akcustomdbl4 = '{FixDouble_drutama}akcustomdbl4', akcustomdbl5 = '{FixDouble_drutama}akcustomdbl5', akcustomdbl6 = '{FixDouble_drutama}akcustomdbl6', akcustomdbl7 = '{FixDouble_drutama}akcustomdbl7', akcustomdbl8 = '{FixDouble_drutama}akcustomdbl8', akcustomdbl9 = '{FixDouble_drutama}akcustomdbl9', akcustomdbl10 = '{FixDouble_drutama}akcustomdbl10', akcustomdbl11 = '{FixDouble_drutama}akcustomdbl11', akcustomdbl12 = '{FixDouble_drutama}akcustomdbl12', akcustomdbl13 = '{FixDouble_drutama}akcustomdbl13', akcustomdbl14 = '{FixDouble_drutama}akcustomdbl14', akcustomdbl15 = '{FixDouble_drutama}akcustomdbl15', akcustomdbl16 = '{FixDouble_drutama}akcustomdbl16', akcustomdbl17 = '{FixDouble_drutama}akcustomdbl17', akcustomdbl18 = '{FixDouble_drutama}akcustomdbl18', akcustomdbl19 = '{FixDouble_drutama}akcustomdbl19', akcustomdbl20 = '{FixDouble_drutama}akcustomdbl20', akcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}akcustomdate1', akcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}akcustomdate2', akcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}akcustomdate3', akcustomdate4 = '{FixQuotes_AsFormatTanggal_drutama}akcustomdate4', akcustomdate5 = '{FixQuotes_AsFormatTanggal_drutama}akcustomdate5', akcustomdate6 = '{FixQuotes_AsFormatTanggal_drutama}akcustomdate6', akcustomdate7 = '{FixQuotes_AsFormatTanggal_drutama}akcustomdate7', akcustomdate8 = '{FixQuotes_AsFormatTanggal_drutama}akcustomdate8', akcustomdate9 = '{FixQuotes_AsFormatTanggal_drutama}akcustomdate9', akcustomdate10 = '{FixQuotes_AsFormatTanggal_drutama}akcustomdate10', akcustomdate11 = '{FixQuotes_AsFormatTanggal_drutama}akcustomdate11', akcustomdate12 = '{FixQuotes_AsFormatTanggal_drutama}akcustomdate12', akcustomdate13 = '{FixQuotes_AsFormatTanggal_drutama}akcustomdate13', akcustomdate14 = '{FixQuotes_AsFormatTanggal_drutama}akcustomdate14', akcustomdate15 = '{FixQuotes_AsFormatTanggal_drutama}akcustomdate15', akcustomdate16 = '{FixQuotes_AsFormatTanggal_drutama}akcustomdate16', akcustomdate17 = '{FixQuotes_AsFormatTanggal_drutama}akcustomdate17', akcustomdate18 = '{FixQuotes_AsFormatTanggal_drutama}akcustomdate18', akcustomdate19 = '{FixQuotes_AsFormatTanggal_drutama}akcustomdate19', akcustomdate20 = '{FixQuotes_AsFormatTanggal_drutama}akcustomdate20', akmatauang = '{FixQuotes_drutama}akmatauang', akkurs = '{FixDouble_drutama}akkurs', akposting = 0, akperawatan = '{FixDouble_drutama}akperawatan', akkategoripasien = '{FixDouble_drutama}akkategoripasien', akkamar = '{FixDouble_drutama}akkamar', akpenjualanlangsung = {drutama}akpenjualanlangsung, akdokter = '{FixDouble_drutama}akdokter', akpetugas = {drutama}akpetugas, aktotalobat = '{FixDouble_drutama}aktotalobat', akresep = '{FixDouble_drutama}akresep', akracik = '{FixDouble_drutama}akracik', akembalase = '{FixDouble_drutama}akembalase', akketerangan = {drutama}akketerangan where akid = '{drutama}akid'
```

```sql
Insert into M_11_ak (akcabang, aklokasi, akgudang, aksumber, akautonotransaksi, aknotransaksi, aktgl, akkodepa, akcustomer, akcustomerkontak, akuraian, akcatatan, aknoref, aktglnoref, aktotaltransaksi, akidkj, akstatusrealisasi, akstatus, akstatussebelumnya, akjmlrevisi, akcetakanke, akinputuser, akinputtgl, akmodifikasiuser, akmodifikasitgl, akisclose, akcustomtext1, akcustomtext2, akcustomtext3, akcustomtext4, akcustomtext5, akcustomtext6, akcustomtext7, akcustomtext8, akcustomtext9, akcustomtext10, akcustomtext11, akcustomtext12, akcustomtext13, akcustomtext14, akcustomtext15, akcustomtext16, akcustomtext17, akcustomtext18, akcustomtext19, akcustomtext20, akcustomint1, akcustomint2, akcustomint3, akcustomint4, akcustomint5, akcustomint6, akcustomint7, akcustomint8, akcustomint9, akcustomint10, akcustomint11, akcustomint12, akcustomint13, akcustomint14, akcustomint15, akcustomint16, akcustomint17, akcustomint18, akcustomint19, akcustomint20, akcustomdbl1, akcustomdbl2, akcustomdbl3, akcustomdbl4, akcustomdbl5, akcustomdbl6, akcustomdbl7, akcustomdbl8, akcustomdbl9, akcustomdbl10, akcustomdbl11, akcustomdbl12, akcustomdbl13, akcustomdbl14, akcustomdbl15, akcustomdbl16, akcustomdbl17, akcustomdbl18, akcustomdbl19, akcustomdbl20, akcustomdate1, akcustomdate2, akcustomdate3, akcustomdate4, akcustomdate5, akcustomdate6, akcustomdate7, akcustomdate8, akcustomdate9, akcustomdate10, akcustomdate11, akcustomdate12, akcustomdate13, akcustomdate14, akcustomdate15, akcustomdate16, akcustomdate17, akcustomdate18, akcustomdate19, akcustomdate20, akmatauang, akkurs, akperawatan, akkategoripasien, akkamar, akpenjualanlangsung, akdokter, akpetugas, aktotalobat, akresep, akracik, akembalase, akketerangan) values('{FixQuotes_drutama}akcabang', '{FixQuotes_drutama}aklokasi', '{FixQuotes_drutama}akgudang', '{FixQuotes_drutama}aksumber', {drutama}akautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}aktgl', {drutama}akkodepa, {drutama}akcustomer, '{FixQuotes_drutama}akcustomerkontak', '{FixQuotes_drutama}akuraian', '{FixQuotes_drutama}akcatatan', '{FixQuotes_drutama}aknoref', '{FixQuotes_AsFormatTanggal_drutama}aktglnoref', '{FixDouble_drutama}aktotaltransaksi', {drutama}akidkj, {drutama}akstatusrealisasi, {drutama}akstatus, {drutama}akstatussebelumnya, {drutama}akjmlrevisi, {drutama}akcetakanke, {drutama}akinputuser, NOW(), {drutama}akmodifikasiuser, '1971-01-01 00:00:00', {drutama}akisclose, '{FixQuotes_drutama}akcustomtext1', '{FixQuotes_drutama}akcustomtext2', '{FixQuotes_drutama}akcustomtext3', '{FixQuotes_drutama}akcustomtext4', '{FixQuotes_drutama}akcustomtext5', '{FixQuotes_drutama}akcustomtext6', '{FixQuotes_drutama}akcustomtext7', '{FixQuotes_drutama}akcustomtext8', '{FixQuotes_drutama}akcustomtext9', '{FixQuotes_drutama}akcustomtext10', '{FixQuotes_drutama}akcustomtext11', '{FixQuotes_drutama}akcustomtext12', '{FixQuotes_drutama}akcustomtext13', '{FixQuotes_drutama}akcustomtext14', '{FixQuotes_drutama}akcustomtext15', '{FixQuotes_drutama}akcustomtext16', '{FixQuotes_drutama}akcustomtext17', '{FixQuotes_drutama}akcustomtext18', '{FixQuotes_drutama}akcustomtext19', '{FixQuotes_drutama}akcustomtext20', {drutama}akcustomint1, {drutama}akcustomint2, {drutama}akcustomint3, {drutama}akcustomint4, {drutama}akcustomint5, {drutama}akcustomint6, {drutama}akcustomint7, {drutama}akcustomint8, {drutama}akcustomint9, {drutama}akcustomint10, {drutama}akcustomint11, {drutama}akcustomint12, {drutama}akcustomint13, {drutama}akcustomint14, {drutama}akcustomint15, {drutama}akcustomint16, {drutama}akcustomint17, {drutama}akcustomint18, {drutama}akcustomint19, {drutama}akcustomint20, '{FixDouble_drutama}akcustomdbl1', '{FixDouble_drutama}akcustomdbl2', '{FixDouble_drutama}akcustomdbl3', '{FixDouble_drutama}akcustomdbl4', '{FixDouble_drutama}akcustomdbl5', '{FixDouble_drutama}akcustomdbl6', '{FixDouble_drutama}akcustomdbl7', '{FixDouble_drutama}akcustomdbl8', '{FixDouble_drutama}akcustomdbl9', '{FixDouble_drutama}akcustomdbl10', '{FixDouble_drutama}akcustomdbl11', '{FixDouble_drutama}akcustomdbl12', '{FixDouble_drutama}akcustomdbl13', '{FixDouble_drutama}akcustomdbl14', '{FixDouble_drutama}akcustomdbl15', '{FixDouble_drutama}akcustomdbl16', '{FixDouble_drutama}akcustomdbl17', '{FixDouble_drutama}akcustomdbl18', '{FixDouble_drutama}akcustomdbl19', '{FixDouble_drutama}akcustomdbl20', '{FixQuotes_AsFormatTanggal_drutama}akcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}akcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}akcustomdate3', '{FixQuotes_AsFormatTanggal_drutama}akcustomdate4', '{FixQuotes_AsFormatTanggal_drutama}akcustomdate5', '{FixQuotes_AsFormatTanggal_drutama}akcustomdate6', '{FixQuotes_AsFormatTanggal_drutama}akcustomdate7', '{FixQuotes_AsFormatTanggal_drutama}akcustomdate8', '{FixQuotes_AsFormatTanggal_drutama}akcustomdate9', '{FixQuotes_AsFormatTanggal_drutama}akcustomdate10', '{FixQuotes_AsFormatTanggal_drutama}akcustomdate11', '{FixQuotes_AsFormatTanggal_drutama}akcustomdate12', '{FixQuotes_AsFormatTanggal_drutama}akcustomdate13', '{FixQuotes_AsFormatTanggal_drutama}akcustomdate14', '{FixQuotes_AsFormatTanggal_drutama}akcustomdate15', '{FixQuotes_AsFormatTanggal_drutama}akcustomdate16', '{FixQuotes_AsFormatTanggal_drutama}akcustomdate17', '{FixQuotes_AsFormatTanggal_drutama}akcustomdate18', '{FixQuotes_AsFormatTanggal_drutama}akcustomdate19', '{FixQuotes_AsFormatTanggal_drutama}akcustomdate20', '{FixQuotes_drutama}akmatauang', '{FixDouble_drutama}akkurs', '{FixDouble_drutama}akperawatan', '{FixDouble_drutama}akkategoripasien', '{FixDouble_drutama}akkamar', {drutama}akpenjualanlangsung, '{FixDouble_drutama}akdokter', {drutama}akpetugas, '{FixDouble_drutama}aktotalobat', '{FixDouble_drutama}akresep', '{FixDouble_drutama}akracik', '{FixDouble_drutama}akembalase', {drutama}akketerangan)
```

```sql
select akid from M_11_ak where aknotransaksi='{notransaksi}' AND akinputuser= '{userid}' order by akmodifikasitgl desc limit 1
```

```sql
Delete from M_11_ak_Detail where idak = '{result_4}'
```

```sql
Insert into M_11_ak_Detail(idakdetail, idak, jenis, idlayanan, namalayanan, jml, satuan, nilaisatuan, jmltotal, satuandefault, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudang, costcenter, divisi, subdivisi, proyek, catatan, urutan, idkjdetail, jmlrealisasi, statusrealisasi, isclose, iddokter, namadokter, customtext1, customtext2, customtext3, customtext4, customtext5, customtext6, customtext7, customtext8, customtext9, customtext10, customtext11, customtext12, customtext13, customtext14, customtext15, customtext16, customtext17, customtext18, customtext19, customtext20, customdbl1, customdbl2, customdbl3, customdbl4, customdbl5, customdbl6, customdbl7, customdbl8, customdbl9, customdbl10, customdbl11, customdbl12, customdbl13, customdbl14, customdbl15, customdbl16, customdbl17, customdbl18, customdbl19, customdbl20, customdate1, customdate2, customdate3, customdate4, customdate5, customdate6, customdate7, customdate8, customdate9, customdate10, customdate11, customdate12, customdate13, customdate14, customdate15, customdate16, customdate17, customdate18, customdate19, customdate20, matauang, kurs, rekpersediaan, rekhargapokok, rekdiskonpenjualan, rekpenjualan, idhppkhususmasuk, hpp, gudangtransit, gudangtujuan, tipebarang) values{strValue2_ToString}
```

```sql
UPDATE m_11_ak_detail SET jmlrealisasi = (CASE idkjdetail {updNilai} ELSE jmlrealisasi END) WHERE
```

```sql
SELECT idkj FROM m_11_kj_detail WHERE {updFilter} GROUP BY idkj
```

```sql
SELECT idkj, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m_11_kj_detail WHERE {ftDetail} GROUP BY idkj
```

```sql
UPDATE m_11_kj SET kjstatusrealisasi = (CASE kjid {updNilai} ELSE kjstatusrealisasi END) WHERE
```

```sql
SELECT kjstatus, kjnotransaksi FROM m_11_kj WHERE kjid='{drutama}akidkj'
```

```sql
Update M_11_Kj set kjstatus = 3 where kjid = '{drutama}akidkj'
```

```sql
SELECT akd.idakdetail, akd.idlayanan, akd.namalayanan, akd.tipebarang, akd.jml, akd.satuan, akd.jmltotal, akd.satuandefault, akd.matauang, akd.kurs, akd.harga, akd.diskon, akd.jmldiskon, akd.idhppkhususmasuk, akd.hpp, akd.gudang, akd.gudangtransit, akd.gudangtujuan, akd.catatan, akd.costcenter, akd.divisi, akd.subdivisi, akd.proyek, ak.akinputtgl, i.bhpp FROM m_11_ak_detail akd JOIN m_11_ak ak ON akd.idak = ak.akid JOIN m1_item i ON akd.idlayanan = i.bid WHERE akd.idak = '{result_4}'
```

```sql
SELECT moduleid, menuid, 0, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT aktgl, aknotransaksi, akstatus, akidkj FROM M_11_ak WHERE akid='{idtransaksi}'
```

```sql
SELECT a.akid as idterkait, a.aksumber as sumber FROM m_11_ak a JOIN m_11_kj kj ON a.akidkj = kj.kjid AND a.akstatus IN(2,3,4,7) AND a.akid <> '{FixDouble_idtransaksi}' AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.kmid as idterkait, a.kmsumber as sumber FROM m_11_km a JOIN m_11_kj kj ON a.kmidkj = kj.kjid AND a.kmstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.kwid as idterkait, a.kwsumber as sumber FROM m_11_kw a JOIN m_11_kw_detail b ON a.kwid = b.idkw AND a.kwstatus IN(2,3,4,7) JOIN m_11_kj kj ON b.sumber = 'KJ' AND b.idtransaksi = kj.kjid AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.lbid as idterkait, a.lbsumber as sumber FROM m_11_lb a JOIN m_11_kj kj ON a.lbidkj = kj.kjid AND a.lbstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.luid as idterkait, a.lusumber as sumber FROM m_11_lu a JOIN m_11_kj kj ON a.luidkj = kj.kjid AND a.lustatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.rkid as idterkait, a.rksumber as sumber FROM m_11_rk a JOIN m_11_kj kj ON a.rkidkj = kj.kjid AND a.rkstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.rmid as idterkait, 'RM' as sumber FROM m_11_rm a JOIN m_11_kj kj ON a.rmidkj = kj.kjid AND a.rmstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.roid as idterkait, a.rosumber as sumber FROM m_11_ro a JOIN m_11_kj kj ON a.roidkj = kj.kjid AND a.rostatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
UPDATE M_11_Kj SET kjstatus = 4 WHERE kjid = '{FixDouble_idkj}'
```

```sql
UPDATE M_11_Kj SET kjstatus = 3 WHERE kjid = '{FixDouble_idkj}'
```

```sql
UPDATE M_11_Kj SET kjstatus = 2 WHERE kjid = '{FixDouble_idkj}'
```

```sql
SELECT idakdetail, idlayanan, tipebarang, namalayanan, satuan, nilaisatuan, jmltotal, idhppkhususmasuk, gudangtujuan, urutan FROM m_11_ak_detail WHERE idak = '{idtransaksi}'
```

```sql
DELETE csi FROM m1_cogs_special_in csi JOIN m_11_ak_detail akd ON csi.sumber = 'AK' AND csi.idtransaksi = akd.idakdetail AND csi.idbarang = akd.idlayanan WHERE akd.idak = '{FixDouble_idtransaksi}'
```

```sql
DELETE cfi FROM m1_cogs_fifo_in cfi JOIN m_11_ak_detail akd ON cfi.cfisumber = 'AK' AND cfi.cfiidtransaksi = akd.idakdetail AND cfi.cfiidbarang = akd.idlayanan WHERE akd.idak = '{FixDouble_idtransaksi}'
```

```sql
INSERT INTO m1_item_stock_warehouse ( SELECT * FROM( SELECT akd.idlayanan, akd.gudangtujuan, akd.jmltotal FROM m_11_ak_detail akd JOIN m1_item i ON akd.idlayanan = i.bid AND i.bassembly <> 1 WHERE akd.idak = '{FixDouble_idtransaksi}' )as stok ) ON DUPLICATE KEY UPDATE stok = stok + VALUES(stok)
```

```sql
SELECT stok.idlayanan FROM ( SELECT akd.idlayanan FROM m_11_ak_detail akd JOIN m1_item i ON i.bid = akd.idlayanan AND i.bassembly <> 1 WHERE akd.idak = '{FixDouble_idtransaksi}') as stok GROUP BY idlayanan
```

```sql
UPDATE M_11_ak SET akstatus = {nilaiStatus}, akmodifikasiuser='{userid}', akmodifikasitgl = NOW(), akjmlrevisi = akjmlrevisi + 1 WHERE akid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT akid, aknotransaksi FROM M_11_ak WHERE akid='{idtransaksi}'
```

```sql
DELETE FROM M_11_ak_Detail WHERE idak = '{idtransaksi}'
```

```sql
DELETE FROM M_11_ak WHERE akid = '{idtransaksi}'
```

```sql
SELECT COUNT(aknoref) FROM m_11_ak WHERE akperawatan = '{idtransaksi_1}' AND akkategoripasien = '{idtransaksi_2}' AND aknoref='{idtransaksi_0}' AND YEAR(aktgl) = '{idtransaksi_3}'
```

```sql
SELECT COUNT(aknoref) FROM m_11_ak WHERE akperawatan = '{idtransaksi_1}' AND aknoref='{idtransaksi_0}' AND YEAR(aktgl) = '{idtransaksi_3}'
```

```sql
SELECT COUNT(aknoref) FROM m11_ak WHERE akperawatan = '{idtransaksi_1}' AND akkategoripasien = '{idtransaksi_2}' AND aknoref='{idtransaksi_0}'
```

## `client-backend/api-myerpplus/app_code/ws/m11/m11_ilo.vb`

```sql
SELECT COUNT(iloid), ilonotransaksi FROM M_11_ilo WHERE iloid='{result_4}' AND ilostatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(iloid) FROM M_11_ilo WHERE ilonotransaksi='{notransaksi}'
```

```sql
Update m_11_ilo set ilocabang = '{FixQuotes_drutama}ilocabang', ilolokasi = '{FixQuotes_drutama}ilolokasi', ilosumber = '{FixQuotes_drutama}ilosumber', iloautonotransaksi = '{FixQuotes_drutama}iloautonotransaksi', ilonotransaksi = '{FixQuotes_drutama}ilonotransaksi', ilotgl = '{FixQuotes_AsFormatTanggal_drutama}ilotgl', iloidkj = {drutama}iloidkj , iloklasifikasiluka = {drutama}iloklasifikasiluka , ilopascabedah = {drutama}ilopascabedah , ilosuhutubuh = {drutama}ilosuhutubuh , ilonyeri = ilonyeri, ilobiakan = {drutama}ilobiakan, ilolainlain = '{FixQuotes_drutama}ilolainlain', ilocatatan = '{FixQuotes_drutama}ilocatatan' , ilostatusrealisasi = {drutama}ilostatusrealisasi, ilostatus = {drutama}ilostatus, ilostatussebelumnya = {drutama}ilostatussebelumnya, ilojmlrevisi = ilojmlrevisi+1, ilocetakanke = {drutama}ilocetakanke, ilomodifikasiuser = {drutama}ilomodifikasiuser, ilomodifikasitgl = NOW(), ilopetugas = {drutama}ilopetugas where iloid = '{drutama}iloid'
```

```sql
SELECT COUNT(kjid), kjnopasien, kjnotransaksi FROM m_11_kj WHERE kjperawatan = 'RI' AND kjnopasien = '{FixQuotes_drutama}kjnopasien' AND kjtgl = '{drutama}kjtgl'
```

```sql
SELECT COUNT(iloid) FROM m_11_ilo WHERE ilonotransaksi='{notransaksi}'
```

```sql
Insert into m_11_ilo (ilocabang, ilolokasi, ilosumber, iloautonotransaksi, ilonotransaksi, ilotgl, iloidkj, iloklasifikasiluka, ilopascabedah, ilosuhutubuh, ilonyeri, ilobiakan, ilolainlain, ilocatatan, ilostatus, ilostatussebelumnya, ilojmlrevisi, ilocetakanke, iloinputuser, iloinputtgl, ilomodifikasiuser, ilomodifikasitgl, iloisclose, ilopetugas) values('{FixQuotes_drutama}ilocabang','{FixQuotes_drutama}ilolokasi','{FixQuotes_drutama}ilosumber', {drutama}iloautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}ilotgl', {drutama}iloidkj, {drutama}iloklasifikasiluka, {drutama}ilopascabedah, {drutama}ilosuhutubuh, {drutama}ilonyeri, {drutama}ilobiakan, '{FixQuotes_drutama}ilolainlain', '{FixQuotes_drutama}ilocatatan', {drutama}ilostatus, {drutama}ilostatussebelumnya, {drutama}ilojmlrevisi, {drutama}ilocetakanke, {drutama}iloinputuser, NOW(), {drutama}ilomodifikasiuser, '1971-01-01 00:00:00', {drutama}iloisclose, {drutama}ilopetugas)
```

```sql
select iloid from m_11_ilo where ilonotransaksi='{notransaksi}' AND iloinputuser= '{userid}' order by ilomodifikasitgl desc limit 1
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT ilotgl, ilonotransaksi, ilostatus FROM m_11_ilo WHERE iloid='{idtransaksi}'
```

```sql
UPDATE M_11_ilo SET ilostatus = {nilaiStatus}, ilomodifikasiuser='{userid}', ilomodifikasitgl = NOW(), ilojmlrevisi = ilojmlrevisi + 1 WHERE iloid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT iloid, ilonotransaksi FROM m_11_ilo WHERE iloid='{idtransaksi}'
```

```sql
DELETE FROM m_11_ilo WHERE iloid = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m11/m11_isk.vb`

```sql
SELECT COUNT(iskid), isknotransaksi FROM M_11_isk WHERE iskid='{result_4}' AND iskstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(iskid) FROM M_11_isk WHERE isknotransaksi='{notransaksi}'
```

```sql
Update m_11_isk set iskcabang = '{FixQuotes_drutama}iskcabang', isklokasi = '{FixQuotes_drutama}isklokasi', isksumber = '{FixQuotes_drutama}isksumber', iskautonotransaksi = '{FixQuotes_drutama}iskautonotransaksi', isknotransaksi = '{FixQuotes_drutama}isknotransaksi', isktgl = '{FixQuotes_AsFormatTanggal_drutama}isktgl', iskidkj = {drutama}iskidkj , iskjenispemasangan = {drutama}iskjenispemasangan , iskpemasanganharike = {drutama}iskpemasanganharike , iskpenampunganurine = {drutama}iskpenampunganurine , isksuhutubuh = {drutama}isksuhutubuh, isknikuria = {drutama}isknikuria, isknyerisuprapublik = {drutama}isknyerisuprapublik, iskdisuria = {drutama}iskdisuria, iskhasilbiakanurine = '{FixQuotes_drutama}iskhasilbiakanurine' , iskleukositosis = '{FixQuotes_drutama}iskleukositosis' , iskcatatan = '{FixQuotes_drutama}iskcatatan' , iskstatusrealisasi = {drutama}iskstatusrealisasi, iskstatus = {drutama}iskstatus, iskstatussebelumnya = {drutama}iskstatussebelumnya, iskjmlrevisi = iskjmlrevisi+1, iskcetakanke = {drutama}iskcetakanke, iskmodifikasiuser = {drutama}iskmodifikasiuser, iskmodifikasitgl = NOW(), iskpetugas = {drutama}iskpetugas where iskid = '{drutama}iskid'
```

```sql
SELECT COUNT(kjid), kjnopasien, kjnotransaksi FROM m_11_kj WHERE kjperawatan = 'RI' AND kjnopasien = '{FixQuotes_drutama}kjnopasien' AND kjtgl = '{drutama}kjtgl'
```

```sql
SELECT COUNT(iskid) FROM m_11_isk WHERE isknotransaksi='{notransaksi}'
```

```sql
Insert into m_11_isk (iskcabang, isklokasi, isksumber, iskautonotransaksi, isknotransaksi, isktgl, iskidkj, iskjenispemasangan, iskpemasanganharike, iskpenampunganurine, isksuhutubuh, isknikuria, isknyerisuprapublik, iskdisuria, iskhasilbiakanurine, iskleukositosis, iskcatatan, iskstatus, iskstatussebelumnya, iskjmlrevisi, iskcetakanke, iskinputuser, iskinputtgl, iskmodifikasiuser, iskmodifikasitgl, iskisclose, iskpetugas) values('{FixQuotes_drutama}iskcabang','{FixQuotes_drutama}isklokasi','{FixQuotes_drutama}isksumber', {drutama}iskautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}isktgl', {drutama}iskidkj, {drutama}iskjenispemasangan, {drutama}iskpemasanganharike, {drutama}iskpenampunganurine, {drutama}isksuhutubuh, {drutama}isknikuria, {drutama}isknyerisuprapublik, {drutama}iskdisuria, '{FixQuotes_drutama}iskhasilbiakanurine', '{FixQuotes_drutama}iskleukositosis', '{FixQuotes_drutama}iskcatatan', {drutama}iskstatus, {drutama}iskstatussebelumnya, {drutama}iskjmlrevisi, {drutama}iskcetakanke, {drutama}iskinputuser, NOW(), {drutama}iskmodifikasiuser, '1971-01-01 00:00:00', {drutama}iskisclose, {drutama}iskpetugas)
```

```sql
select iskid from m_11_isk where isknotransaksi='{notransaksi}' AND iskinputuser= '{userid}' order by iskmodifikasitgl desc limit 1
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT isktgl, isknotransaksi, iskstatus FROM m_11_isk WHERE iskid='{idtransaksi}'
```

```sql
UPDATE M_11_isk SET iskstatus = {nilaiStatus}, iskmodifikasiuser='{userid}', iskmodifikasitgl = NOW(), iskjmlrevisi = iskjmlrevisi + 1 WHERE iskid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT iskid, isknotransaksi FROM m_11_isk WHERE iskid='{idtransaksi}'
```

```sql
DELETE FROM m_11_isk WHERE iskid = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m11/m11_kj.vb`

```sql
SELECT COUNT(kjid), kjnotransaksi FROM M_11_kj WHERE kjid='{result_4}' AND kjstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(kjid) FROM M_11_kj WHERE kjnotransaksi='{notransaksi}'
```

```sql
Update m_11_kj set kjcabang = '{FixQuotes_drutama}kjcabang', kjlokasi = '{FixQuotes_drutama}kjlokasi', kjsumber = '{FixQuotes_drutama}kjsumber', kjautonotransaksi = '{FixQuotes_drutama}kjautonotransaksi', kjnotransaksi = '{FixQuotes_drutama}kjnotransaksi', kjtgl = '{FixQuotes_AsFormatTanggal_drutama}kjtgl', kjkodepa = {drutama}kjkodepa, kjnopasien = '{FixQuotes_drutama}kjnopasien', kjnama = '{FixQuotes_drutama}kjnama', kjprefix = '{FixQuotes_drutama}kjprefix', kjtgllahir = '{FixQuotes_AsFormatTanggal_drutama}kjtgllahir', kjumur = {drutama}kjumur, kjjeniskelamin = '{FixQuotes_drutama}kjjeniskelamin', kjstatusperkawinan = {drutama}kjstatusperkawinan, kjagama = {drutama}kjagama, kjayah = '{FixQuotes_drutama}kjayah', kjibu = '{FixQuotes_drutama}kjibu', kjsuamiistri = '{FixQuotes_drutama}kjsuamiistri', kjnotelepon = '{FixQuotes_drutama}kjnotelepon', kjnofax = '{FixQuotes_drutama}kjnofax', kjnohp = '{FixQuotes_drutama}kjnohp', kjemail = '{FixQuotes_drutama}kjemail', kjalamat = '{FixQuotes_drutama}kjalamat', kjkota = '{FixQuotes_drutama}kjkota', kjprovinsi = '{FixQuotes_drutama}kjprovinsi', kjnegara = '{FixQuotes_drutama}kjnegara', kjkodepos = '{FixQuotes_drutama}kjkodepos', kjkeluargalain = '{FixQuotes_drutama}kjkeluargalain', kjnoteleponlain = '{FixQuotes_drutama}kjnoteleponlain', kjcatatan = '{FixQuotes_drutama}kjcatatan', kjtglkeluar = '{FixQuotes_AsFormatTanggal_drutama}kjtglkeluar', kjtglmeninggal = '{FixQuotes_AsFormatTanggal_drutama}kjtglmeninggal', kjcarakunjungan = {drutama}kjcarakunjungan, kjdirujukoleh = {drutama}kjdirujukoleh, kjditanggungoleh = {drutama}kjditanggungoleh, kjstatusrealisasi = {drutama}kjstatusrealisasi, kjstatus = {drutama}kjstatus, kjstatussebelumnya = {drutama}kjstatussebelumnya, kjjmlrevisi = kjjmlrevisi+1, kjcetakanke = {drutama}kjcetakanke, kjmodifikasiuser = {drutama}kjmodifikasiuser, kjmodifikasitgl = NOW(), kjcustomtext1 = '{FixQuotes_drutama}kjcustomtext1', kjcustomtext2 = '{FixQuotes_drutama}kjcustomtext2', kjcustomtext3 = '{FixQuotes_drutama}kjcustomtext3', kjcustomtext4 = '{FixQuotes_drutama}kjcustomtext4', kjcustomtext5 = '{FixQuotes_drutama}kjcustomtext5', kjcustomtext6 = '{FixQuotes_drutama}kjcustomtext6', kjcustomtext7 = '{FixQuotes_drutama}kjcustomtext7', kjcustomtext8 = '{FixQuotes_drutama}kjcustomtext8', kjcustomtext9 = '{FixQuotes_drutama}kjcustomtext9', kjcustomtext10 = '{FixQuotes_drutama}kjcustomtext10', kjcustomtext11 = '{FixQuotes_drutama}kjcustomtext11', kjcustomtext12 = '{FixQuotes_drutama}kjcustomtext12', kjcustomtext13 = '{FixQuotes_drutama}kjcustomtext13', kjcustomtext14 = '{FixQuotes_drutama}kjcustomtext14', kjcustomtext15 = '{FixQuotes_drutama}kjcustomtext15', kjcustomtext16 = '{FixQuotes_drutama}kjcustomtext16', kjcustomtext17 = '{FixQuotes_drutama}kjcustomtext17', kjcustomtext18 = '{FixQuotes_drutama}kjcustomtext18', kjcustomtext19 = '{FixQuotes_drutama}kjcustomtext19', kjcustomtext20 = '{FixQuotes_drutama}kjcustomtext20', kjcustomint1 = {drutama}kjcustomint1, kjcustomint2 = {drutama}kjcustomint2, kjcustomint3 = {drutama}kjcustomint3, kjcustomint4 = {drutama}kjcustomint14, kjcustomint5 = {drutama}kjcustomint5, kjcustomint6 = {drutama}kjcustomint6, kjcustomint7 = {drutama}kjcustomint7, kjcustomint8 = {drutama}kjcustomint8, kjcustomint9 = {drutama}kjcustomint9, kjcustomint10 = {drutama}kjcustomint10, kjcustomint11 = {drutama}kjcustomint11, kjcustomint12 = {drutama}kjcustomint12, kjcustomint13 = {drutama}kjcustomint13, kjcustomint14 = {drutama}kjcustomint14, kjcustomint15 = {drutama}kjcustomint15, kjcustomint16 = {drutama}kjcustomint16, kjcustomint17 = {drutama}kjcustomint17, kjcustomint18 = {drutama}kjcustomint18, kjcustomint19 = {drutama}kjcustomint19, kjcustomint20 = {drutama}kjcustomint20, kjcustomdbl1 = '{FixDouble_drutama}kjcustomdbl1', kjcustomdbl2 = '{FixDouble_drutama}kjcustomdbl2', kjcustomdbl3 = '{FixDouble_drutama}kjcustomdbl3', kjcustomdbl4 = '{FixDouble_drutama}kjcustomdbl4', kjcustomdbl5 = '{FixDouble_drutama}kjcustomdbl5', kjcustomdbl6 = '{FixDouble_drutama}kjcustomdbl6', kjcustomdbl7 = '{FixDouble_drutama}kjcustomdbl7', kjcustomdbl8 = '{FixDouble_drutama}kjcustomdbl8', kjcustomdbl9 = '{FixDouble_drutama}kjcustomdbl9', kjcustomdbl10 = '{FixDouble_drutama}kjcustomdbl10', kjcustomdbl11 = '{FixDouble_drutama}kjcustomdbl11', kjcustomdbl12 = '{FixDouble_drutama}kjcustomdbl12', kjcustomdbl13 = '{FixDouble_drutama}kjcustomdbl13', kjcustomdbl14 = '{FixDouble_drutama}kjcustomdbl14', kjcustomdbl15 = '{FixDouble_drutama}kjcustomdbl15', kjcustomdbl16 = '{FixDouble_drutama}kjcustomdbl16', kjcustomdbl17 = '{FixDouble_drutama}kjcustomdbl17', kjcustomdbl18 = '{FixDouble_drutama}kjcustomdbl18', kjcustomdbl19 = '{FixDouble_drutama}kjcustomdbl19', kjcustomdbl20 = '{FixDouble_drutama}kjcustomdbl20', kjcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate1', kjcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate2', kjcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate3', kjcustomdate4 = '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate4', kjcustomdate5 = '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate5', kjcustomdate6 = '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate6', kjcustomdate7 = '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate7', kjcustomdate8 = '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate8', kjcustomdate9 = '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate9', kjcustomdate10 = '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate10', kjcustomdate11 = '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate11', kjcustomdate12 = '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate12', kjcustomdate13 = '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate13', kjcustomdate14 = '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate14', kjcustomdate15 = '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate15', kjcustomdate16 = '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate16', kjcustomdate17 = '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate17', kjcustomdate18 = '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate18', kjcustomdate19 = '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate19', kjcustomdate20 = '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate20', kjstatuskamar = {drutama}kjstatuskamar, kjkategoriharga = '{FixQuotes_drutama}kjkategoriharga', kjperawatan = '{FixQuotes_drutama}kjperawatan', kjkategoripasien = '{FixQuotes_drutama}kjkategoripasien', kjlayanan = '{FixQuotes_drutama}kjlayanan', kjkamar = '{FixQuotes_drutama}kjkamar', kjdokter = '{FixQuotes_drutama}kjdokter', kjdirujukke = '{FixQuotes_drutama}kjdirujukke', kjstatuspasien = {drutama}kjstatuspasien, kjpetugas = {drutama}kjpetugas, kjdesa = '{FixQuotes_drutama}kjdesa', kjkecamatan = '{FixQuotes_drutama}kjkecamatan', kjdiagnosa = '{FixQuotes_drutama}kjdiagnosa', kjketerangan = {drutama}kjketerangan where kjid = '{drutama}kjid'
```

```sql
SELECT COUNT(kjid), kjnopasien, kjnotransaksi FROM m_11_kj WHERE kjperawatan = 'RI' AND kjnopasien = '{FixQuotes_drutama}kjnopasien' AND kjtgl = '{drutama}kjtgl'
```

```sql
SELECT COUNT(kjid) FROM m_11_kj WHERE kjnotransaksi='{notransaksi}'
```

```sql
Insert into m_11_kj (kjcabang, kjlokasi, kjsumber, kjautonotransaksi, kjnotransaksi, kjtgl, kjkodepa, kjnopasien, kjnama, kjprefix, kjtgllahir, kjumur, kjjeniskelamin, kjstatusperkawinan, kjagama, kjayah, kjibu, kjsuamiistri, kjnotelepon, kjnofax, kjnohp, kjemail, kjalamat, kjkota, kjprovinsi, kjnegara, kjkodepos, kjkeluargalain, kjnoteleponlain, kjcatatan, kjtglkeluar, kjtglmeninggal, kjcarakunjungan, kjdirujukoleh, kjditanggungoleh, kjstatus, kjstatussebelumnya, kjjmlrevisi, kjcetakanke, kjinputuser, kjinputtgl, kjmodifikasiuser, kjmodifikasitgl, kjisclose, kjcustomtext1, kjcustomtext2, kjcustomtext3, kjcustomtext4, kjcustomtext5, kjcustomtext6, kjcustomtext7, kjcustomtext8, kjcustomtext9, kjcustomtext10, kjcustomtext11, kjcustomtext12, kjcustomtext13, kjcustomtext14, kjcustomtext15, kjcustomtext16, kjcustomtext17, kjcustomtext18, kjcustomtext19, kjcustomtext20, kjcustomint1, kjcustomint2, kjcustomint3, kjcustomint4, kjcustomint5, kjcustomint6, kjcustomint7, kjcustomint8, kjcustomint9, kjcustomint10, kjcustomint11, kjcustomint12, kjcustomint13, kjcustomint14, kjcustomint15, kjcustomint16, kjcustomint17, kjcustomint18, kjcustomint19, kjcustomint20, kjcustomdbl1, kjcustomdbl2, kjcustomdbl3, kjcustomdbl4, kjcustomdbl5, kjcustomdbl6, kjcustomdbl7, kjcustomdbl8, kjcustomdbl9, kjcustomdbl10, kjcustomdbl11, kjcustomdbl12, kjcustomdbl13, kjcustomdbl14, kjcustomdbl15, kjcustomdbl16, kjcustomdbl17, kjcustomdbl18, kjcustomdbl19, kjcustomdbl20, kjcustomdate1, kjcustomdate2, kjcustomdate3, kjcustomdate4, kjcustomdate5, kjcustomdate6, kjcustomdate7, kjcustomdate8, kjcustomdate9, kjcustomdate10, kjcustomdate11, kjcustomdate12, kjcustomdate13, kjcustomdate14, kjcustomdate15, kjcustomdate16, kjcustomdate17, kjcustomdate18, kjcustomdate19, kjcustomdate20, kjstatuskamar, kjkategoriharga, kjperawatan, kjkategoripasien, kjlayanan, kjkamar, kjdokter, kjdirujukke, kjstatuspasien, kjpetugas, kjdesa, kjkecamatan, kjdiagnosa, kjketerangan) values('{FixQuotes_drutama}kjcabang','{FixQuotes_drutama}kjlokasi','{FixQuotes_drutama}kjsumber', {drutama}kjautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}kjtgl', {drutama}kjkodepa, '{FixQuotes_drutama}kjnopasien', '{FixQuotes_drutama}kjnama', '{FixQuotes_drutama}kjprefix', '{FixQuotes_AsFormatTanggal_drutama}kjtgllahir', {drutama}kjumur, '{FixQuotes_drutama}kjjeniskelamin', {drutama}kjstatusperkawinan, {drutama}kjagama, '{FixQuotes_drutama}kjayah', '{FixQuotes_drutama}kjibu', '{FixQuotes_drutama}kjsuamiistri', '{FixQuotes_drutama}kjnotelepon', '{FixQuotes_drutama}kjnofax', '{FixQuotes_drutama}kjnohp', '{FixQuotes_drutama}kjemail', '{FixQuotes_drutama}kjalamat', '{FixQuotes_drutama}kjkota', '{FixQuotes_drutama}kjprovinsi', '{FixQuotes_drutama}kjnegara', '{FixQuotes_drutama}kjkodepos', '{FixQuotes_drutama}kjkeluargalain', '{FixQuotes_drutama}kjnoteleponlain', '{FixQuotes_drutama}kjcatatan', '{FixQuotes_AsFormatTanggal_drutama}kjtglkeluar', '{FixQuotes_AsFormatTanggal_drutama}kjtglmeninggal', {drutama}kjcarakunjungan, {drutama}kjdirujukoleh, {drutama}kjditanggungoleh, {drutama}kjstatus, {drutama}kjstatussebelumnya, {drutama}kjjmlrevisi, {drutama}kjcetakanke, {drutama}kjinputuser, NOW(), {drutama}kjmodifikasiuser, '1971-01-01 00:00:00', {drutama}kjisclose, '{FixQuotes_drutama}kjcustomtext1', '{FixQuotes_drutama}kjcustomtext2', '{FixQuotes_drutama}kjcustomtext3', '{FixQuotes_drutama}kjcustomtext4', '{FixQuotes_drutama}kjcustomtext5', '{FixQuotes_drutama}kjcustomtext6', '{FixQuotes_drutama}kjcustomtext7', '{FixQuotes_drutama}kjcustomtext8', '{FixQuotes_drutama}kjcustomtext9', '{FixQuotes_drutama}kjcustomtext10', '{FixQuotes_drutama}kjcustomtext11', '{FixQuotes_drutama}kjcustomtext12', '{FixQuotes_drutama}kjcustomtext13', '{FixQuotes_drutama}kjcustomtext14', '{FixQuotes_drutama}kjcustomtext15', '{FixQuotes_drutama}kjcustomtext16', '{FixQuotes_drutama}kjcustomtext17', '{FixQuotes_drutama}kjcustomtext18', '{FixQuotes_drutama}kjcustomtext19', '{FixQuotes_drutama}kjcustomtext20', {drutama}kjcustomint1, {drutama}kjcustomint2, {drutama}kjcustomint3, {drutama}kjcustomint4, {drutama}kjcustomint5, {drutama}kjcustomint6, {drutama}kjcustomint7, {drutama}kjcustomint8, {drutama}kjcustomint9, {drutama}kjcustomint10, {drutama}kjcustomint11, {drutama}kjcustomint12, {drutama}kjcustomint13, {drutama}kjcustomint14, {drutama}kjcustomint15, {drutama}kjcustomint16, {drutama}kjcustomint17, {drutama}kjcustomint18, {drutama}kjcustomint19, {drutama}kjcustomint20, '{FixDouble_drutama}kjcustomdbl1', '{FixDouble_drutama}kjcustomdbl2', '{FixDouble_drutama}kjcustomdbl3', '{FixDouble_drutama}kjcustomdbl4', '{FixDouble_drutama}kjcustomdbl5', '{FixDouble_drutama}kjcustomdbl6', '{FixDouble_drutama}kjcustomdbl7', '{FixDouble_drutama}kjcustomdbl8', '{FixDouble_drutama}kjcustomdbl9', '{FixDouble_drutama}kjcustomdbl10', '{FixDouble_drutama}kjcustomdbl11', '{FixDouble_drutama}kjcustomdbl12', '{FixDouble_drutama}kjcustomdbl13', '{FixDouble_drutama}kjcustomdbl14', '{FixDouble_drutama}kjcustomdbl15', '{FixDouble_drutama}kjcustomdbl16', '{FixDouble_drutama}kjcustomdbl17', '{FixDouble_drutama}kjcustomdbl18', '{FixDouble_drutama}kjcustomdbl19', '{FixDouble_drutama}kjcustomdbl20', '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate3', '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate4', '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate5', '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate6', '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate7', '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate8', '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate9', '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate10', '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate11', '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate12', '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate13', '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate14', '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate15', '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate16', '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate17', '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate18', '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate19', '{FixQuotes_AsFormatTanggal_drutama}kjcustomdate20', {drutama}kjstatuskamar, '{FixQuotes_drutama}kjkategoriharga', '{FixQuotes_drutama}kjperawatan', '{FixQuotes_drutama}kjkategoripasien', '{FixQuotes_drutama}kjlayanan', '{FixQuotes_drutama}kjkamar', '{FixQuotes_drutama}kjdokter', '{FixQuotes_drutama}kjdirujukke', {drutama}kjstatuspasien, {drutama}kjpetugas, '{FixQuotes_drutama}kjdesa', '{FixQuotes_drutama}kjkecamatan', '{FixQuotes_drutama}kjdiagnosa', {drutama}kjketerangan)
```

```sql
select kjid from m_11_kj where kjnotransaksi='{notransaksi}' AND kjinputuser= '{userid}' order by kjmodifikasitgl desc limit 1
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT kjtgl, kjnotransaksi, kjstatus FROM m_11_kj WHERE kjid='{idtransaksi}'
```

```sql
UPDATE M_11_kj SET kjstatus = {nilaiStatus}, kjmodifikasiuser='{userid}', kjmodifikasitgl = NOW(), kjjmlrevisi = kjjmlrevisi + 1 WHERE kjid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT kjid, kjnotransaksi FROM m_11_kj WHERE kjid='{idtransaksi}'
```

```sql
DELETE FROM m_11_kj WHERE kjid = '{idtransaksi}'
```

```sql
SELECT COUNT(kjid), kjnotransaksi FROM m_11_kj WHERE kjid='{result_4}'
```

```sql
Update M_11_kj set kjketerangan = {drutama}kjketerangan where kjid = '{drutama}kjid'
```

```sql
Update M_11_lb set lbketerangan = {drutama}kjketerangan where lbidkj = '{drutama}kjid'
```

```sql
Update M_11_ak set akketerangan = {drutama}kjketerangan where akidkj = '{drutama}kjid'
```

```sql
Update m_11_kj set kjketerangan = {drutama}kjketerangan where kjid = '{drutama}kjid'
```

```sql
Update m_11_lb set lbketerangan = {drutama}kjketerangan where lbidkj = '{drutama}kjid'
```

```sql
Update m_11_ak set akketerangan = {drutama}kjketerangan where akidkj = '{drutama}kjid'
```

## `client-backend/api-myerpplus/app_code/ws/m11/m11_kj_history.vb`

```sql
INSERT INTO m_11_kj_history(SELECT 0, kj.* FROM m_11_kj kj WHERE kj.kjid = '{idtransaksi}')
```

```sql
SELECT kjidhistory FROM m_11_kj_history WHERE kjid = '{idtransaksi}' ORDER BY kjmodifikasitgl DESC LIMIT 1
```

## `client-backend/api-myerpplus/app_code/ws/m11/m11_km.vb`

```sql
SELECT COUNT(kmid), kmnotransaksi FROM M_11_km WHERE kmid='{result_4}' AND kmstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(kmid) FROM m_11_km WHERE kmnotransaksi='{notransaksi}'
```

```sql
Update M_11_Km set kmcabang = '{FixQuotes_drutama}kmcabang', kmlokasi = '{FixQuotes_drutama}kmlokasi', kmgudang = '{FixQuotes_drutama}kmgudang', kmsumber = '{FixQuotes_drutama}kmsumber', kmautonotransaksi = {drutama}kmautonotransaksi, kmnotransaksi = '{FixQuotes_notransaksi}', kmtgl = '{FixQuotes_AsFormatTanggal_drutama}kmtgl', kmkodepa = {drutama}kmkodepa, kmcustomer = {drutama}kmcustomer, kmcustomerkontak = '{FixQuotes_drutama}kmcustomerkontak', kmuraian = '{FixQuotes_drutama}kmuraian', kmcatatan = '{FixQuotes_drutama}kmcatatan', kmnoref = '{FixQuotes_drutama}kmnoref', kmtglnoref = '{FixQuotes_AsFormatTanggal_drutama}kmtglnoref', kmmatauang = '{FixQuotes_drutama}kmmatauang', kmkurs = '{FixDouble_drutama}kmkurs', kmidkj = {drutama}kmidkj, kmkamar = '{FixQuotes_drutama}kmkamar', kmkasur = '{FixQuotes_drutama}kmkasur', kmtglmasuk = '{FixQuotes_drutama}kmtglmasuk', kmtglkeluar = '{FixQuotes_drutama}kmtglkeluar', kmjmlhari = {drutama}kmjmlhari, kmharga = {drutama}kmharga, kmtotaltransaksi = {drutama}kmtotaltransaksi, kmrekpersediaan = '{FixQuotes_drutama}kmrekpersediaan', kmrekhargapokok = '{FixQuotes_drutama}kmrekhargapokok', kmrekdiskonpenjualan = '{FixQuotes_drutama}kmrekdiskonpenjualan', kmrekpenjualan = '{FixQuotes_drutama}kmrekpenjualan', kmstatusrealisasi = {drutama}kmstatusrealisasi, kmstatus = {drutama}kmstatus, kmstatussebelumnya = {drutama}kmstatussebelumnya, kmjmlrevisi = kmjmlrevisi+1, kmcetakanke = {drutama}kmcetakanke, kmmodifikasiuser = {drutama}kmmodifikasiuser, kmmodifikasitgl = NOW(), kmposting = '{FixDouble_drutama}kmposting', kmcustomtext1 = '{FixQuotes_drutama}kmcustomtext1', kmcustomtext2 = '{FixQuotes_drutama}kmcustomtext2', kmcustomtext3 = '{FixQuotes_drutama}kmcustomtext3', kmcustomtext4 = '{FixQuotes_drutama}kmcustomtext4', kmcustomtext5 = '{FixQuotes_drutama}kmcustomtext5', kmcustomtext6 = '{FixQuotes_drutama}kmcustomtext6', kmcustomtext7 = '{FixQuotes_drutama}kmcustomtext7', kmcustomtext8 = '{FixQuotes_drutama}kmcustomtext8', kmcustomtext9 = '{FixQuotes_drutama}kmcustomtext9', kmcustomtext10 = '{FixQuotes_drutama}kmcustomtext10', kmcustomtext11 = '{FixQuotes_drutama}kmcustomtext11', kmcustomtext12 = '{FixQuotes_drutama}kmcustomtext12', kmcustomtext13 = '{FixQuotes_drutama}kmcustomtext13', kmcustomtext14 = '{FixQuotes_drutama}kmcustomtext14', kmcustomtext15 = '{FixQuotes_drutama}kmcustomtext15', kmcustomtext16 = '{FixQuotes_drutama}kmcustomtext16', kmcustomtext17 = '{FixQuotes_drutama}kmcustomtext17', kmcustomtext18 = '{FixQuotes_drutama}kmcustomtext18', kmcustomtext19 = '{FixQuotes_drutama}kmcustomtext19', kmcustomtext20 = '{FixQuotes_drutama}kmcustomtext20', kmcustomint1 = {drutama}kmcustomint1, kmcustomint2 = {drutama}kmcustomint2, kmcustomint3 = {drutama}kmcustomint3, kmcustomint4 = {drutama}kmcustomint4, kmcustomint5 = {drutama}kmcustomint5, kmcustomint6 = {drutama}kmcustomint6, kmcustomint7 = {drutama}kmcustomint7, kmcustomint8 = {drutama}kmcustomint8, kmcustomint9 = {drutama}kmcustomint9, kmcustomint10 = {drutama}kmcustomint10, kmcustomint11 = {drutama}kmcustomint11, kmcustomint12 = {drutama}kmcustomint12, kmcustomint13 = {drutama}kmcustomint13, kmcustomint14 = {drutama}kmcustomint14, kmcustomint15 = {drutama}kmcustomint15, kmcustomint16 = {drutama}kmcustomint16, kmcustomint17 = {drutama}kmcustomint17, kmcustomint18 = {drutama}kmcustomint18, kmcustomint19 = {drutama}kmcustomint19, kmcustomint20 = {drutama}kmcustomint20, kmcustomdbl1 = '{FixDouble_drutama}kmcustomdbl1', kmcustomdbl2 = '{FixDouble_drutama}kmcustomdbl2', kmcustomdbl3 = '{FixDouble_drutama}kmcustomdbl3', kmcustomdbl4 = '{FixDouble_drutama}kmcustomdbl4', kmcustomdbl5 = '{FixDouble_drutama}kmcustomdbl5', kmcustomdbl6 = '{FixDouble_drutama}kmcustomdbl6', kmcustomdbl7 = '{FixDouble_drutama}kmcustomdbl7', kmcustomdbl8 = '{FixDouble_drutama}kmcustomdbl8', kmcustomdbl9 = '{FixDouble_drutama}kmcustomdbl9', kmcustomdbl10 = '{FixDouble_drutama}kmcustomdbl10', kmcustomdbl11 = '{FixDouble_drutama}kmcustomdbl11', kmcustomdbl12 = '{FixDouble_drutama}kmcustomdbl12', kmcustomdbl13 = '{FixDouble_drutama}kmcustomdbl13', kmcustomdbl14 = '{FixDouble_drutama}kmcustomdbl14', kmcustomdbl15 = '{FixDouble_drutama}kmcustomdbl15', kmcustomdbl16 = '{FixDouble_drutama}kmcustomdbl16', kmcustomdbl17 = '{FixDouble_drutama}kmcustomdbl17', kmcustomdbl18 = '{FixDouble_drutama}kmcustomdbl18', kmcustomdbl19 = '{FixDouble_drutama}kmcustomdbl19', kmcustomdbl20 = '{FixDouble_drutama}kmcustomdbl20', kmcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate1', kmcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate2', kmcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate3', kmcustomdate4 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate4', kmcustomdate5 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate5', kmcustomdate6 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate6', kmcustomdate7 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate7', kmcustomdate8 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate8', kmcustomdate9 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate9', kmcustomdate10 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate10', kmcustomdate11 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate11', kmcustomdate12 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate12', kmcustomdate13 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate13', kmcustomdate14 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate14', kmcustomdate15 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate15', kmcustomdate16 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate16', kmcustomdate17 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate17', kmcustomdate18 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate18', kmcustomdate19 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate19', kmcustomdate20 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate20', kmperawatan = '{FixQuotes_drutama}kmperawatan', kmkategoripasien = '{FixQuotes_drutama}kmkategoripasien' where kmid = '{drutama}kmid'
```

```sql
SELECT kjstatuskamar, kjnotransaksi FROM m_11_kj WHERE kjid='{drutama}kmidkj'
```

```sql
Update M_11_Kj set kjstatuskamar = 1 where kjid = '{drutama}kmidkj'
```

```sql
Insert into M_11_Km (kmcabang, kmlokasi, kmgudang, kmsumber, kmautonotransaksi, kmnotransaksi, kmtgl, kmkodepa, kmcustomer, kmcustomerkontak, kmuraian, kmcatatan, kmnoref, kmtglnoref, kmmatauang, kmkurs, kmidkj, kmkamar, kmkasur, kmtglmasuk, kmtglkeluar, kmjmlhari, kmharga, kmtotaltransaksi, kmrekpersediaan, kmrekhargapokok, kmrekdiskonpenjualan, kmrekpenjualan, kmstatusrealisasi, kmstatus, kmstatussebelumnya, kmjmlrevisi, kmcetakanke, kminputuser, kminputtgl, kmmodifikasiuser, kmmodifikasitgl, kmisclose, kmcustomtext1, kmcustomtext2, kmcustomtext3, kmcustomtext4, kmcustomtext5, kmcustomtext6, kmcustomtext7, kmcustomtext8, kmcustomtext9, kmcustomtext10, kmcustomtext11, kmcustomtext12, kmcustomtext13, kmcustomtext14, kmcustomtext15, kmcustomtext16, kmcustomtext17, kmcustomtext18, kmcustomtext19, kmcustomtext20, kmcustomint1, kmcustomint2, kmcustomint3, kmcustomint4, kmcustomint5, kmcustomint6, kmcustomint7, kmcustomint8, kmcustomint9, kmcustomint10, kmcustomint11, kmcustomint12, kmcustomint13, kmcustomint14, kmcustomint15, kmcustomint16, kmcustomint17, kmcustomint18, kmcustomint19, kmcustomint20, kmcustomdbl1, kmcustomdbl2, kmcustomdbl3, kmcustomdbl4, kmcustomdbl5, kmcustomdbl6, kmcustomdbl7, kmcustomdbl8, kmcustomdbl9, kmcustomdbl10, kmcustomdbl11, kmcustomdbl12, kmcustomdbl13, kmcustomdbl14, kmcustomdbl15, kmcustomdbl16, kmcustomdbl17, kmcustomdbl18, kmcustomdbl19, kmcustomdbl20, kmcustomdate1, kmcustomdate2, kmcustomdate3, kmcustomdate4, kmcustomdate5, kmcustomdate6, kmcustomdate7, kmcustomdate8, kmcustomdate9, kmcustomdate10, kmcustomdate11, kmcustomdate12, kmcustomdate13, kmcustomdate14, kmcustomdate15, kmcustomdate16, kmcustomdate17, kmcustomdate18, kmcustomdate19, kmcustomdate20, kmperawatan, kmkategoripasien) values('{FixQuotes_drutama}kmcabang', '{FixQuotes_drutama}kmlokasi', '{FixQuotes_drutama}kmgudang', '{FixQuotes_drutama}kmsumber', {drutama}kmautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}kmtgl', {drutama}kmkodepa, {drutama}kmcustomer, '{FixQuotes_drutama}kmcustomerkontak', '{FixQuotes_drutama}kmuraian', '{FixQuotes_drutama}kmcatatan', '{FixQuotes_drutama}kmnoref', '{FixQuotes_AsFormatTanggal_drutama}kmtglnoref', '{FixQuotes_drutama}kmmatauang', '{FixDouble_drutama}kmkurs', {drutama}kmidkj, '{FixQuotes_drutama}kmkamar', '{FixQuotes_drutama}kmkasur', '{FixQuotes_drutama}kmtglmasuk', '{FixQuotes_drutama}kmtglkeluar', '{FixDouble_drutama}kmjmlhari', '{FixDouble_drutama}kmharga', '{FixDouble_drutama}kmtotaltransaksi', '{FixQuotes_drutama}kmrekpersediaan', '{FixQuotes_drutama}kmrekhargapokok', '{FixQuotes_drutama}kmrekdiskonpenjualan', '{FixQuotes_drutama}kmrekpenjualan', {drutama}kmstatusrealisasi, {drutama}kmstatus, {drutama}kmstatussebelumnya, {drutama}kmjmlrevisi, {drutama}kmcetakanke, {drutama}kminputuser, NOW(), {drutama}kmmodifikasiuser, '1971-01-01 00:00:00', {drutama}kmisclose, '{FixQuotes_drutama}kmcustomtext1', '{FixQuotes_drutama}kmcustomtext2', '{FixQuotes_drutama}kmcustomtext3', '{FixQuotes_drutama}kmcustomtext4', '{FixQuotes_drutama}kmcustomtext5', '{FixQuotes_drutama}kmcustomtext6', '{FixQuotes_drutama}kmcustomtext7', '{FixQuotes_drutama}kmcustomtext8', '{FixQuotes_drutama}kmcustomtext9', '{FixQuotes_drutama}kmcustomtext10', '{FixQuotes_drutama}kmcustomtext11', '{FixQuotes_drutama}kmcustomtext12', '{FixQuotes_drutama}kmcustomtext13', '{FixQuotes_drutama}kmcustomtext14', '{FixQuotes_drutama}kmcustomtext15', '{FixQuotes_drutama}kmcustomtext16', '{FixQuotes_drutama}kmcustomtext17', '{FixQuotes_drutama}kmcustomtext18', '{FixQuotes_drutama}kmcustomtext19', '{FixQuotes_drutama}kmcustomtext20', {drutama}kmcustomint1, {drutama}kmcustomint2, {drutama}kmcustomint3, {drutama}kmcustomint4, {drutama}kmcustomint5, {drutama}kmcustomint6, {drutama}kmcustomint7, {drutama}kmcustomint8, {drutama}kmcustomint9, {drutama}kmcustomint10, {drutama}kmcustomint11, {drutama}kmcustomint12, {drutama}kmcustomint13, {drutama}kmcustomint14, {drutama}kmcustomint15, {drutama}kmcustomint16, {drutama}kmcustomint17, {drutama}kmcustomint18, {drutama}kmcustomint19, {drutama}kmcustomint20, '{FixDouble_drutama}kmcustomdbl1', '{FixDouble_drutama}kmcustomdbl2', '{FixDouble_drutama}kmcustomdbl3', '{FixDouble_drutama}kmcustomdbl4', '{FixDouble_drutama}kmcustomdbl5', '{FixDouble_drutama}kmcustomdbl6', '{FixDouble_drutama}kmcustomdbl7', '{FixDouble_drutama}kmcustomdbl8', '{FixDouble_drutama}kmcustomdbl9', '{FixDouble_drutama}kmcustomdbl10', '{FixDouble_drutama}kmcustomdbl11', '{FixDouble_drutama}kmcustomdbl12', '{FixDouble_drutama}kmcustomdbl13', '{FixDouble_drutama}kmcustomdbl14', '{FixDouble_drutama}kmcustomdbl15', '{FixDouble_drutama}kmcustomdbl16', '{FixDouble_drutama}kmcustomdbl17', '{FixDouble_drutama}kmcustomdbl18', '{FixDouble_drutama}kmcustomdbl19', '{FixDouble_drutama}kmcustomdbl20', '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate3', '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate4', '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate5', '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate6', '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate7', '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate8', '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate9', '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate10', '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate11', '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate12', '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate13', '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate14', '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate15', '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate16', '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate17', '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate18', '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate19', '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate20', '{FixQuotes_drutama}kmperawatan', '{FixQuotes_drutama}kmkategoripasien')
```

```sql
select kmid from M_11_km where kmnotransaksi='{notransaksi}' AND kminputuser= '{userid}' order by kmmodifikasitgl desc limit 1
```

```sql
SELECT moduleid, menuid, 0, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Kmtgl, Kmnotransaksi, Kmstatus, kmidkj FROM M_11_Km WHERE Kmid='{idtransaksi}'
```

```sql
SELECT a.akid as idterkait, a.aksumber as sumber FROM m_11_ak a JOIN m_11_kj kj ON a.akidkj = kj.kjid AND a.akstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.kmid as idterkait, a.kmsumber as sumber FROM m_11_km a JOIN m_11_kj kj ON a.kmidkj = kj.kjid AND a.kmstatus IN(2,3,4,7) AND a.kmid <> '{FixDouble_idtransaksi}' AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.kwid as idterkait, a.kwsumber as sumber FROM m_11_kw a JOIN m_11_kw_detail b ON a.kwid = b.idkw AND a.kwstatus IN(2,3,4,7) JOIN m_11_kj kj ON b.sumber = 'KJ' AND b.idtransaksi = kj.kjid AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.lbid as idterkait, a.lbsumber as sumber FROM m_11_lb a JOIN m_11_kj kj ON a.lbidkj = kj.kjid AND a.lbstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.luid as idterkait, a.lusumber as sumber FROM m_11_lu a JOIN m_11_kj kj ON a.luidkj = kj.kjid AND a.lustatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.rkid as idterkait, a.rksumber as sumber FROM m_11_rk a JOIN m_11_kj kj ON a.rkidkj = kj.kjid AND a.rkstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.rmid as idterkait, 'RM' as sumber FROM m_11_rm a JOIN m_11_kj kj ON a.rmidkj = kj.kjid AND a.rmstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.roid as idterkait, a.rosumber as sumber FROM m_11_ro a JOIN m_11_kj kj ON a.roidkj = kj.kjid AND a.rostatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
UPDATE M_11_Kj SET kjstatus = 4 WHERE kjid = '{FixDouble_idkj}'
```

```sql
UPDATE M_11_Kj SET kjstatus = 3 WHERE kjid = '{FixDouble_idkj}'
```

```sql
UPDATE M_11_Kj SET kjstatus = 2 WHERE kjid = '{FixDouble_idkj}'
```

```sql
UPDATE M_11_Km SET Kmstatus = {nilaiStatus}, Kmmodifikasiuser='{userid}', Kmmodifikasitgl = NOW(), Kmjmlrevisi = Kmjmlrevisi + 1 WHERE Kmid = '{idtransaksi}'
```

```sql
SELECT kmidkj, kmkamar, kmkasur FROM m_11_km WHERE kmid='{idtransaksi}'
```

```sql
Update M_11_Kj set kjstatuskamar = 0 where kjid = '{cekIdkj}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Kmid, Kmnotransaksi FROM M_11_Km WHERE Kmid='{idtransaksi}'
```

```sql
DELETE FROM M_11_Km WHERE kmid = '{idtransaksi}'
```

```sql
SELECT COUNT(kmid), kmnotransaksi FROM M_11_km WHERE kmid='{result_4}'
```

```sql
Update M_11_Km set kmcabang = '{FixQuotes_drutama}kmcabang', kmlokasi = '{FixQuotes_drutama}kmlokasi', kmgudang = '{FixQuotes_drutama}kmgudang', kmsumber = '{FixQuotes_drutama}kmsumber', kmautonotransaksi = {drutama}kmautonotransaksi, kmnotransaksi = '{FixQuotes_notransaksi}', kmtgl = '{FixQuotes_AsFormatTanggal_drutama}kmtgl', kmkodepa = {drutama}kmkodepa, kmcustomer = {drutama}kmcustomer, kmcustomerkontak = '{FixQuotes_drutama}kmcustomerkontak', kmuraian = '{FixQuotes_drutama}kmuraian', kmcatatan = '{FixQuotes_drutama}kmcatatan', kmnoref = '{FixQuotes_drutama}kmnoref', kmtglnoref = '{FixQuotes_AsFormatTanggal_drutama}kmtglnoref', kmmatauang = '{FixQuotes_drutama}kmmatauang', kmkurs = '{FixDouble_drutama}kmkurs', kmidkj = {drutama}kmidkj, kmkamar = '{FixQuotes_drutama}kmkamar', kmkasur = '{FixQuotes_drutama}kmkasur', kmtglkeluar = '{FixQuotes_drutama}kmtglkeluar', kmjmlhari = {drutama}kmjmlhari, kmharga = {FixDouble_drutama}kmharga, kmtotaltransaksi = {FixDouble_drutama}kmtotaltransaksi, kmrekpersediaan = '{FixQuotes_drutama}kmrekpersediaan', kmrekhargapokok = '{FixQuotes_drutama}kmrekhargapokok', kmrekdiskonpenjualan = '{FixQuotes_drutama}kmrekdiskonpenjualan', kmrekpenjualan = '{FixQuotes_drutama}kmrekpenjualan', kmstatusrealisasi = 2, kmstatus = 4, kmstatussebelumnya = {drutama}kmstatussebelumnya, kmjmlrevisi = {drutama}kmjmlrevisi, kmcetakanke = {drutama}kmcetakanke, kmmodifikasiuser = {drutama}kmmodifikasiuser, kmmodifikasitgl = '{drutama}kmmodifikasitgl', kmposting = '{FixDouble_drutama}kmposting', kmcustomtext1 = '{FixQuotes_drutama}kmcustomtext1', kmcustomtext2 = '{FixQuotes_drutama}kmcustomtext2', kmcustomtext3 = '{FixQuotes_drutama}kmcustomtext3', kmcustomtext4 = '{FixQuotes_drutama}kmcustomtext4', kmcustomtext5 = '{FixQuotes_drutama}kmcustomtext5', kmcustomtext6 = '{FixQuotes_drutama}kmcustomtext6', kmcustomtext7 = '{FixQuotes_drutama}kmcustomtext7', kmcustomtext8 = '{FixQuotes_drutama}kmcustomtext8', kmcustomtext9 = '{FixQuotes_drutama}kmcustomtext9', kmcustomtext10 = '{FixQuotes_drutama}kmcustomtext10', kmcustomtext11 = '{FixQuotes_drutama}kmcustomtext11', kmcustomtext12 = '{FixQuotes_drutama}kmcustomtext12', kmcustomtext13 = '{FixQuotes_drutama}kmcustomtext13', kmcustomtext14 = '{FixQuotes_drutama}kmcustomtext14', kmcustomtext15 = '{FixQuotes_drutama}kmcustomtext15', kmcustomtext16 = '{FixQuotes_drutama}kmcustomtext16', kmcustomtext17 = '{FixQuotes_drutama}kmcustomtext17', kmcustomtext18 = '{FixQuotes_drutama}kmcustomtext18', kmcustomtext19 = '{FixQuotes_drutama}kmcustomtext19', kmcustomtext20 = '{FixQuotes_drutama}kmcustomtext20', kmcustomint1 = {drutama}kmcustomint1, kmcustomint2 = {drutama}kmcustomint2, kmcustomint3 = {drutama}kmcustomint3, kmcustomint4 = {drutama}kmcustomint4, kmcustomint5 = {drutama}kmcustomint5, kmcustomint6 = {drutama}kmcustomint6, kmcustomint7 = {drutama}kmcustomint7, kmcustomint8 = {drutama}kmcustomint8, kmcustomint9 = {drutama}kmcustomint9, kmcustomint10 = {drutama}kmcustomint10, kmcustomint11 = {drutama}kmcustomint11, kmcustomint12 = {drutama}kmcustomint12, kmcustomint13 = {drutama}kmcustomint13, kmcustomint14 = {drutama}kmcustomint14, kmcustomint15 = {drutama}kmcustomint15, kmcustomint16 = {drutama}kmcustomint16, kmcustomint17 = {drutama}kmcustomint17, kmcustomint18 = {drutama}kmcustomint18, kmcustomint19 = {drutama}kmcustomint19, kmcustomint20 = {drutama}kmcustomint20, kmcustomdbl1 = '{FixDouble_drutama}kmcustomdbl1', kmcustomdbl2 = '{FixDouble_drutama}kmcustomdbl2', kmcustomdbl3 = '{FixDouble_drutama}kmcustomdbl3', kmcustomdbl4 = '{FixDouble_drutama}kmcustomdbl4', kmcustomdbl5 = '{FixDouble_drutama}kmcustomdbl5', kmcustomdbl6 = '{FixDouble_drutama}kmcustomdbl6', kmcustomdbl7 = '{FixDouble_drutama}kmcustomdbl7', kmcustomdbl8 = '{FixDouble_drutama}kmcustomdbl8', kmcustomdbl9 = '{FixDouble_drutama}kmcustomdbl9', kmcustomdbl10 = '{FixDouble_drutama}kmcustomdbl10', kmcustomdbl11 = '{FixDouble_drutama}kmcustomdbl11', kmcustomdbl12 = '{FixDouble_drutama}kmcustomdbl12', kmcustomdbl13 = '{FixDouble_drutama}kmcustomdbl13', kmcustomdbl14 = '{FixDouble_drutama}kmcustomdbl14', kmcustomdbl15 = '{FixDouble_drutama}kmcustomdbl15', kmcustomdbl16 = '{FixDouble_drutama}kmcustomdbl16', kmcustomdbl17 = '{FixDouble_drutama}kmcustomdbl17', kmcustomdbl18 = '{FixDouble_drutama}kmcustomdbl18', kmcustomdbl19 = '{FixDouble_drutama}kmcustomdbl19', kmcustomdbl20 = '{FixDouble_drutama}kmcustomdbl20', kmcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate1', kmcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate2', kmcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate3', kmcustomdate4 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate4', kmcustomdate5 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate5', kmcustomdate6 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate6', kmcustomdate7 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate7', kmcustomdate8 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate8', kmcustomdate9 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate9', kmcustomdate10 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate10', kmcustomdate11 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate11', kmcustomdate12 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate12', kmcustomdate13 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate13', kmcustomdate14 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate14', kmcustomdate15 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate15', kmcustomdate16 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate16', kmcustomdate17 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate17', kmcustomdate18 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate18', kmcustomdate19 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate19', kmcustomdate20 = '{FixQuotes_AsFormatTanggal_drutama}kmcustomdate20', kmperawatan = '{FixQuotes_drutama}kmperawatan', kmkategoripasien = '{FixQuotes_drutama}kmkategoripasien' where kmid = '{drutama}kmid'
```

```sql
Update M_11_Kj set kjstatuskamar = 0 where kjid = '{drutama}kmidkj'
```

## `client-backend/api-myerpplus/app_code/ws/m11/m11_km_history.vb`

```sql
INSERT INTO m_11_km_history(SELECT 0, km.* FROM m_11_km km WHERE km.kmid = '{idtransaksi}')
```

## `client-backend/api-myerpplus/app_code/ws/m11/m11_kw.vb`

```sql
SELECT COUNT(kwid), kwnotransaksi FROM m_11_kw WHERE kwid='{result_4}' AND kwstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(kwid) FROM m_11_kw WHERE kwnotransaksi='{notransaksi}'
```

```sql
Update m_11_kw set kwcabang = '{FixQuotes_drutama}kwcabang', kwlokasi = '{FixQuotes_drutama}kwlokasi', kwgudang = '{FixQuotes_drutama}kwgudang', kwsumber = '{FixQuotes_drutama}kwsumber', kwautonotransaksi = {drutama}kwautonotransaksi, kwnotransaksi = '{FixQuotes_notransaksi}', kwtgl = '{FixQuotes_AsFormatTanggal_drutama}kwtgl', kwkodepa = {drutama}kwkodepa, kwcustomer = {drutama}kwcustomer, kwcustomerkontak = '{FixQuotes_drutama}kwcustomerkontak', kw1alamat1 = '{FixQuotes_drutama}kw1alamat1', kw1alamat2 = '{FixQuotes_drutama}kw1alamat2', kw1alamat3 = '{FixQuotes_drutama}kw1alamat3', kw2alamat1 = '{FixQuotes_drutama}kw2alamat1', kw2alamat2 = '{FixQuotes_drutama}kw2alamat2', kw2alamat3 = '{FixQuotes_drutama}kw2alamat3', kwbagianpenjualan = {drutama}kwbagianpenjualan, kwbagianpenagihan = {drutama}kwbagianpenagihan, kwuraian = '{FixQuotes_drutama}kwuraian', kwcatatan = '{FixQuotes_drutama}kwcatatan', kwnoref = '{FixQuotes_drutama}kwnoref', kwtglnoref = '{FixQuotes_AsFormatTanggal_drutama}kwtglnoref', kwcarabayar = {drutama}kwcarabayar, kwtglbayar = '{FixQuotes_AsFormatTanggal_drutama}kwtglbayar', kwmatauang = '{FixQuotes_drutama}kwmatauang', kwkurs = '{FixDouble_drutama}kwkurs', kwtotalap = '{FixDouble_drutama}kwtotalap', kwtotalapvalas = '{FixDouble_drutama}kwtotalapvalas', kwtotalar = '{FixDouble_drutama}kwtotalar', kwtotalarvalas = '{FixDouble_drutama}kwtotalarvalas', kwjmltagih = '{FixDouble_drutama}kwjmltagih', kwjmltagihvalas = '{FixDouble_drutama}kwjmltagihvalas', kwbayar = '{FixDouble_drutama}kwbayar', kwbayarvalas = '{FixDouble_drutama}kwbayarvalas', kwselisihkurs = '{FixDouble_drutama}kwselisihkurs', kwrekselisihkurs = '{FixQuotes_drutama}kwrekselisihkurs', kwdiskontermin = '{FixDouble_drutama}kwdiskontermin', kwdiskonterminvalas = '{FixDouble_drutama}kwdiskonterminvalas', kwrekdiskontermin = '{FixQuotes_drutama}kwrekdiskontermin', kwstatuspb = {drutama}kwstatuspb, kwstatus = {drutama}kwstatus, kwstatussebelumnya = {drutama}kwstatussebelumnya, kwjmlrevisi = kwjmlrevisi+1, kwcetakanke = {drutama}kwcetakanke, kwmodifikasiuser = {drutama}kwmodifikasiuser, kwmodifikasitgl = NOW(), kwcustomtext1 = '{FixQuotes_drutama}kwcustomtext1', kwcustomtext2 = '{FixQuotes_drutama}kwcustomtext2', kwcustomtext3 = '{FixQuotes_drutama}kwcustomtext3', kwcustomtext4 = '{FixQuotes_drutama}kwcustomtext4', kwcustomtext5 = '{FixQuotes_drutama}kwcustomtext5', kwcustomint1 = {drutama}kwcustomint1, kwcustomint2 = {drutama}kwcustomint2, kwcustomint3 = {drutama}kwcustomint3, kwcustomdbl1 = '{FixDouble_drutama}kwcustomdbl1', kwcustomdbl2 = '{FixDouble_drutama}kwcustomdbl2', kwcustomdbl3 = '{FixDouble_drutama}kwcustomdbl3', kwcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}kwcustomdate1', kwcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}kwcustomdate2', kwcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}kwcustomdate3', kwjenistransaksi = {drutama}kwjenistransaksi, kwpetugas = {drutama}kwpetugas, kwtglkeluar = '{FixQuotes_AsFormatTanggal_drutama}kwtglkeluar', kwdokter = '{FixQuotes_drutama}kwdokter' where kwid = '{drutama}kwid'
```

```sql
Insert into m_11_kw (kwcabang, kwlokasi, kwgudang, kwsumber, kwautonotransaksi, kwnotransaksi, kwtgl, kwkodepa, kwcustomer, kwcustomerkontak, kw1alamat1, kw1alamat2, kw1alamat3, kw2alamat1, kw2alamat2, kw2alamat3, kwbagianpenjualan, kwbagianpenagihan, kwuraian, kwcatatan, kwnoref, kwtglnoref, kwcarabayar, kwtglbayar, kwmatauang, kwkurs, kwtotalap, kwtotalapvalas, kwtotalar, kwtotalarvalas, kwjmltagih, kwjmltagihvalas, kwbayar, kwbayarvalas, kwselisihkurs, kwrekselisihkurs, kwdiskontermin, kwdiskonterminvalas, kwrekdiskontermin, kwstatuspb, kwstatus, kwstatussebelumnya, kwjmlrevisi, kwcetakanke, kwinputuser, kwinputtgl, kwmodifikasiuser, kwmodifikasitgl, kwisclose, kwcustomtext1, kwcustomtext2, kwcustomtext3, kwcustomtext4, kwcustomtext5, kwcustomint1, kwcustomint2, kwcustomint3, kwcustomdbl1, kwcustomdbl2, kwcustomdbl3, kwcustomdate1, kwcustomdate2, kwcustomdate3, kwjenistransaksi, kwpetugas, kwtglkeluar, kwdokter) values('{FixQuotes_drutama}kwcabang', '{FixQuotes_drutama}kwlokasi', '{FixQuotes_drutama}kwgudang', '{FixQuotes_drutama}kwsumber', {drutama}kwautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}kwtgl', {drutama}kwkodepa, {drutama}kwcustomer, '{FixQuotes_drutama}kwcustomerkontak', '{FixQuotes_drutama}kw1alamat1', '{FixQuotes_drutama}kw1alamat2', '{FixQuotes_drutama}kw1alamat3', '{FixQuotes_drutama}kw2alamat1', '{FixQuotes_drutama}kw2alamat2', '{FixQuotes_drutama}kw2alamat3', {drutama}kwbagianpenjualan, {drutama}kwbagianpenagihan, '{FixQuotes_drutama}kwuraian', '{FixQuotes_drutama}kwcatatan', '{FixQuotes_drutama}kwnoref', '{FixQuotes_AsFormatTanggal_drutama}kwtglnoref', {drutama}kwcarabayar, '{FixQuotes_AsFormatTanggal_drutama}kwtglbayar', '{FixQuotes_drutama}kwmatauang', '{FixDouble_drutama}kwkurs', '{FixDouble_drutama}kwtotalap', '{FixDouble_drutama}kwtotalapvalas', '{FixDouble_drutama}kwtotalar', '{FixDouble_drutama}kwtotalarvalas', '{FixDouble_drutama}kwjmltagih', '{FixDouble_drutama}kwjmltagihvalas', '{FixDouble_drutama}kwbayar', '{FixDouble_drutama}kwbayarvalas', '{FixDouble_drutama}kwselisihkurs', '{FixQuotes_drutama}kwrekselisihkurs', '{FixDouble_drutama}kwdiskontermin', '{FixDouble_drutama}kwdiskonterminvalas', '{FixQuotes_drutama}kwrekdiskontermin', {drutama}kwstatuspb, {drutama}kwstatus, {drutama}kwstatussebelumnya, {drutama}kwjmlrevisi, {drutama}kwcetakanke, {drutama}kwinputuser, NOW(), {drutama}kwmodifikasiuser, '1971-01-01 00:00:00', {drutama}kwisclose, '{FixQuotes_drutama}kwcustomtext1', '{FixQuotes_drutama}kwcustomtext2', '{FixQuotes_drutama}kwcustomtext3', '{FixQuotes_drutama}kwcustomtext4', '{FixQuotes_drutama}kwcustomtext5', {drutama}kwcustomint1, {drutama}kwcustomint2, {drutama}kwcustomint3, '{FixDouble_drutama}kwcustomdbl1', '{FixDouble_drutama}kwcustomdbl2', '{FixDouble_drutama}kwcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}kwcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}kwcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}kwcustomdate3', {drutama}kwjenistransaksi, {drutama}kwpetugas, '{FixQuotes_AsFormatTanggal_drutama}kwtglkeluar', '{FixQuotes_drutama}kwdokter')
```

```sql
select kwid from m_11_kw where kwnotransaksi='{notransaksi}' AND kwinputuser= '{userid}' order by kwmodifikasitgl desc limit 1
```

```sql
Delete from m_11_kw_detail where idkw = '{result_4}'
```

```sql
Insert into m_11_kw_detail(idkwdetail, idkw, sumber, idtransaksi, matauang, kurs, totaltransaksi, terbayar, rencana, sisa, jmlbayar, jmlbayarvalas, diskontermin, jmldiskontermin, jmldiskonterminvalas, nogiro, rekhutangpiutang, catatan, costcenter, divisi, subdivisi, proyek, jmlpb, jmlpbvalas, statuspb, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3, uraian) values{strValue2_ToString}
```

```sql
UPDATE m_11_kj SET kjtglkeluar = '{FixQuotes_AsFormatTanggal_drutama}kwtglkeluar', kjstatus = 4, kjdokter = '{FixQuotes_drutama}kwdokter' WHERE kjid = '{dr2}idtransaksi'
```

```sql
UPDATE m_11_lu SET lustatus = 4 WHERE luidkj = '{dr2}idtransaksi' AND lustatus IN (2,3)
```

```sql
UPDATE m_11_km SET kmstatus = 4 WHERE kmidkj = '{dr2}idtransaksi' AND kmstatus IN (2,3)
```

```sql
SELECT COUNT(akid) FROM m_11_ak WHERE akidkj = '{dr2}idtransaksi' AND akidkj <> 0 AND akpenjualanlangsung = 0
```

```sql
UPDATE m_11_ak SET akstatus = 4, aktglbayar = '{FixQuotes_AsFormatTanggal_drutama}kwtgl' WHERE akidkj = '{dr2}idtransaksi' AND akidkj <> 0 AND akstatus IN (2,3) AND akpenjualanlangsung = 0
```

```sql
SELECT COUNT(lbid) FROM m_11_lb WHERE lbidkj = '{dr2}idtransaksi' AND lbidkj <> 0 AND lbpenjualanlangsung = 0
```

```sql
UPDATE m_11_lb SET lbstatus = 4 WHERE lbidkj = '{dr2}idtransaksi' AND lbidkj <> 0 AND lbstatus IN (2,3) AND lbpenjualanlangsung = 0
```

```sql
UPDATE m_11_rk SET rkstatus = 4 WHERE rkidkj = '{dr2}idtransaksi' AND rkstatus IN (2,3)
```

```sql
UPDATE m_11_ro SET rostatus = 4 WHERE roidkj = '{dr2}idtransaksi' AND rostatus IN (2,3)
```

```sql
SELECT COUNT(akid) FROM m_11_ak WHERE akid = '{dr3}idtransaksi' AND akidkj = 0 AND akpenjualanlangsung = 1
```

```sql
UPDATE m_11_ak SET akstatus = 4, aktglbayar = '{FixQuotes_AsFormatTanggal_drutama}kwtgl' WHERE akid = '{dr3}idtransaksi' AND akidkj = 0 AND akstatus = 2 AND akpenjualanlangsung = 1
```

```sql
UPDATE m_11_lu SET lustatus = 4 WHERE luid = '{dr3}idtransaksi'
```

```sql
SELECT COUNT(lbid) FROM m_11_lb WHERE lbid = '{dr3}idtransaksi' AND lbidkj = 0 AND lbpenjualanlangsung = 1
```

```sql
UPDATE m_11_lb SET lbstatus = 4 WHERE lbid = '{dr3}idtransaksi' AND lbidkj = 0 AND lbstatus = 2 AND lbpenjualanlangsung = 1
```

```sql
UPDATE m_11_km SET kmstatus = 4 WHERE kmid = '{dr3}idtransaksi'
```

```sql
UPDATE m_11_rk SET rkstatus = 4 WHERE rkid = '{dr3}idtransaksi'
```

```sql
UPDATE m_11_ro SET rostatus = 4 WHERE roid = '{dr3}idtransaksi'
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT kwtgl, kwnotransaksi, kwstatus FROM m_11_kw WHERE kwid='{idtransaksi}'
```

```sql
SELECT kwd.sumber, kwd.idtransaksi, kwd.urutan, kw.kwjenistransaksi FROM m_11_kw_detail kwd JOIN m_11_kw kw ON kwd.idkw = kw.kwid WHERE kw.kwid = '{idtransaksi}'
```

```sql
UPDATE m_11_kj SET kjtglkeluar = '1900-01-01', kjstatus = kjstatussebelumnya WHERE kjid = '{dr1}idtransaksi'
```

```sql
UPDATE m_11_lu SET lustatus = lustatussebelumnya WHERE luidkj = '{dr1}idtransaksi' AND lustatus IN (4)
```

```sql
UPDATE m_11_km SET kmstatus = kmstatussebelumnya WHERE kmidkj = '{dr1}idtransaksi' AND kmstatus IN (4)
```

```sql
UPDATE m_11_ak SET akstatus = akstatussebelumnya WHERE akidkj = '{dr1}idtransaksi' AND akpenjualanlangsung = 0 AND akstatus IN (4)
```

```sql
UPDATE m_11_lb SET lbstatus = lbstatussebelumnya WHERE lbidkj = '{dr1}idtransaksi' AND lbpenjualanlangsung = 0 AND lbstatus IN (4)
```

```sql
UPDATE m_11_rk SET rkstatus = rkstatussebelumnya WHERE rkidkj = '{dr1}idtransaksi' AND rkstatus IN (4)
```

```sql
UPDATE m_11_ro SET rostatus = rostatussebelumnya WHERE roidkj = '{dr1}idtransaksi' AND rostatus IN (4)
```

```sql
UPDATE m_11_ak SET akstatus = akstatussebelumnya WHERE akid = '{dr1}idtransaksi' AND akpenjualanlangsung = 1 AND akstatus = 4
```

```sql
UPDATE m_11_lu SET lustatus = lustatussebelumnya WHERE luid = '{dr1}idtransaksi'
```

```sql
UPDATE m_11_lb SET lbstatus = lbstatussebelumnya WHERE lbid = '{dr1}idtransaksi' AND lbpenjualanlangsung = 1 AND lbstatus = 4
```

```sql
UPDATE m_11_km SET kmstatus = kmstatussebelumnya WHERE kmid = '{dr1}idtransaksi'
```

```sql
UPDATE m_11_rk SET rkstatus = rkstatussebelumnya WHERE rkid = '{dr1}idtransaksi'
```

```sql
UPDATE m_11_ro SET rostatus = rostatussebelumnya WHERE roid = '{dr1}idtransaksi'
```

```sql
UPDATE m_11_kw SET kwstatus = {nilaiStatus}, kwmodifikasiuser='{userid}', kwmodifikasitgl = NOW(), kwposting = 0, kwpostingtgl = '1971-01-01 00:00:00', kwjmlrevisi = kwjmlrevisi + 1 WHERE kwid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Kwid, Kwnotransaksi FROM m_11_kw WHERE kwid='{idtransaksi}'
```

```sql
DELETE FROM m_11_kw_detail WHERE idkw='{idtransaksi}'
```

```sql
DELETE FROM m_11_kw WHERE kwid='{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m11/m11_lb.vb`

```sql
SELECT COUNT(lbid), lbnotransaksi FROM M_11_lb WHERE lbid='{result_4}' AND lbstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(lbid) FROM m_11_lb WHERE lbnotransaksi='{notransaksi}'
```

```sql
Update M_11_lb set lbcabang = '{FixQuotes_drutama}lbcabang', lblokasi = '{FixQuotes_drutama}lblokasi', lbgudang = '{FixQuotes_drutama}lbgudang', lbsumber = '{FixQuotes_drutama}lbsumber', lbautonotransaksi = {drutama}lbautonotransaksi, lbnotransaksi = '{FixQuotes_notransaksi}', lbtgl = '{FixQuotes_AsFormatTanggal_drutama}lbtgl', lbkodepa = {drutama}lbkodepa, lbcustomer = {drutama}lbcustomer, lbcustomerkontak = '{FixQuotes_drutama}lbcustomerkontak', lburaian = '{FixQuotes_drutama}lburaian', lbcatatan = '{FixQuotes_drutama}lbcatatan', lbnoref = '{FixQuotes_drutama}lbnoref', lbtglnoref = '{FixQuotes_AsFormatTanggal_drutama}lbtglnoref', lbtotaltransaksi = '{FixDouble_drutama}lbtotaltransaksi', lbidkj = {drutama}lbidkj, lbstatusrealisasi = {drutama}lbstatusrealisasi, lbstatus = {drutama}lbstatus, lbstatussebelumnya = {drutama}lbstatussebelumnya, lbjmlrevisi = lbjmlrevisi+1, lbcetakanke = {drutama}lbcetakanke, lbmodifikasiuser = {drutama}lbmodifikasiuser, lbmodifikasitgl = NOW(), lbcustomtext1 = '{FixQuotes_drutama}lbcustomtext1', lbcustomtext2 = '{FixQuotes_drutama}lbcustomtext2', lbcustomtext3 = '{FixQuotes_drutama}lbcustomtext3', lbcustomtext4 = '{FixQuotes_drutama}lbcustomtext4', lbcustomtext5 = '{FixQuotes_drutama}lbcustomtext5', lbcustomtext6 = '{FixQuotes_drutama}lbcustomtext6', lbcustomtext7 = '{FixQuotes_drutama}lbcustomtext7', lbcustomtext8 = '{FixQuotes_drutama}lbcustomtext8', lbcustomtext9 = '{FixQuotes_drutama}lbcustomtext9', lbcustomtext10 = '{FixQuotes_drutama}lbcustomtext10', lbcustomtext11 = '{FixQuotes_drutama}lbcustomtext11', lbcustomtext12 = '{FixQuotes_drutama}lbcustomtext12', lbcustomtext13 = '{FixQuotes_drutama}lbcustomtext13', lbcustomtext14 = '{FixQuotes_drutama}lbcustomtext14', lbcustomtext15 = '{FixQuotes_drutama}lbcustomtext15', lbcustomtext16 = '{FixQuotes_drutama}lbcustomtext16', lbcustomtext17 = '{FixQuotes_drutama}lbcustomtext17', lbcustomtext18 = '{FixQuotes_drutama}lbcustomtext18', lbcustomtext19 = '{FixQuotes_drutama}lbcustomtext19', lbcustomtext20 = '{FixQuotes_drutama}lbcustomtext20', lbcustomint1 = {drutama}lbcustomint1, lbcustomint2 = {drutama}lbcustomint2, lbcustomint3 = {drutama}lbcustomint3, lbcustomint4 = {drutama}lbcustomint4, lbcustomint5 = {drutama}lbcustomint5, lbcustomint6 = {drutama}lbcustomint6, lbcustomint7 = {drutama}lbcustomint7, lbcustomint8 = {drutama}lbcustomint8, lbcustomint9 = {drutama}lbcustomint9, lbcustomint10 = {drutama}lbcustomint10, lbcustomint11 = {drutama}lbcustomint11, lbcustomint12 = {drutama}lbcustomint12, lbcustomint13 = {drutama}lbcustomint13, lbcustomint14 = {drutama}lbcustomint14, lbcustomint15 = {drutama}lbcustomint15, lbcustomint16 = {drutama}lbcustomint16, lbcustomint17 = {drutama}lbcustomint17, lbcustomint18 = {drutama}lbcustomint18, lbcustomint19 = {drutama}lbcustomint19, lbcustomint20 = {drutama}lbcustomint20, lbcustomdbl1 = '{FixDouble_drutama}lbcustomdbl1', lbcustomdbl2 = '{FixDouble_drutama}lbcustomdbl2', lbcustomdbl3 = '{FixDouble_drutama}lbcustomdbl3', lbcustomdbl4 = '{FixDouble_drutama}lbcustomdbl4', lbcustomdbl5 = '{FixDouble_drutama}lbcustomdbl5', lbcustomdbl6 = '{FixDouble_drutama}lbcustomdbl6', lbcustomdbl7 = '{FixDouble_drutama}lbcustomdbl7', lbcustomdbl8 = '{FixDouble_drutama}lbcustomdbl8', lbcustomdbl9 = '{FixDouble_drutama}lbcustomdbl9', lbcustomdbl10 = '{FixDouble_drutama}lbcustomdbl10', lbcustomdbl11 = '{FixDouble_drutama}lbcustomdbl11', lbcustomdbl12 = '{FixDouble_drutama}lbcustomdbl12', lbcustomdbl13 = '{FixDouble_drutama}lbcustomdbl13', lbcustomdbl14 = '{FixDouble_drutama}lbcustomdbl14', lbcustomdbl15 = '{FixDouble_drutama}lbcustomdbl15', lbcustomdbl16 = '{FixDouble_drutama}lbcustomdbl16', lbcustomdbl17 = '{FixDouble_drutama}lbcustomdbl17', lbcustomdbl18 = '{FixDouble_drutama}lbcustomdbl18', lbcustomdbl19 = '{FixDouble_drutama}lbcustomdbl19', lbcustomdbl20 = '{FixDouble_drutama}lbcustomdbl20', lbcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate1', lbcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate2', lbcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate3', lbcustomdate4 = '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate4', lbcustomdate5 = '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate5', lbcustomdate6 = '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate6', lbcustomdate7 = '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate7', lbcustomdate8 = '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate8', lbcustomdate9 = '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate9', lbcustomdate10 = '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate10', lbcustomdate11 = '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate11', lbcustomdate12 = '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate12', lbcustomdate13 = '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate13', lbcustomdate14 = '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate14', lbcustomdate15 = '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate15', lbcustomdate16 = '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate16', lbcustomdate17 = '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate17', lbcustomdate18 = '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate18', lbcustomdate19 = '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate19', lbcustomdate20 = '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate20', lbmatauang = '{FixQuotes_drutama}lbmatauang', lbkurs = '{FixDouble_drutama}lbkurs', lbposting = 0, lbjenislab = '{FixQuotes_drutama}lbjenislab', lbperawatan = '{FixQuotes_drutama}lbperawatan', lbkategoripasien = '{FixQuotes_drutama}lbkategoripasien', lbkamar = '{FixQuotes_drutama}lbkamar', lbdokter = '{FixQuotes_drutama}lbdokter', lbpenjualanlangsung = {drutama}lbpenjualanlangsung, lbpetugas = {drutama}lbpetugas, lbumur = '{FixQuotes_drutama}lbumur', lbketerangan = {drutama}lbketerangan where lbid = '{drutama}lbid'
```

```sql
SELECT COUNT(lbid), lbnoref, lbnotransaksi FROM m_11_lb WHERE lbnoref = '{FixQuotes_drutama}lbnoref' AND lbperawatan = '{FixQuotes_drutama}lbperawatan' AND lbkategoripasien = '{FixQuotes_drutama}lbkategoripasien'
```

```sql
SELECT COUNT(lbid), lbnoref, lbnotransaksi FROM m_11_lb WHERE lbnoref = '{FixQuotes_drutama}lbnoref'
```

```sql
Insert into M_11_lb (lbcabang, lblokasi, lbgudang, lbsumber, lbautonotransaksi, lbnotransaksi, lbtgl, lbkodepa, lbcustomer, lbcustomerkontak, lburaian, lbcatatan, lbnoref, lbtglnoref, lbtotaltransaksi, lbidkj, lbstatusrealisasi, lbstatus, lbstatussebelumnya, lbjmlrevisi, lbcetakanke, lbinputuser, lbinputtgl, lbmodifikasiuser, lbmodifikasitgl, lbisclose, lbcustomtext1, lbcustomtext2, lbcustomtext3, lbcustomtext4, lbcustomtext5, lbcustomtext6, lbcustomtext7, lbcustomtext8, lbcustomtext9, lbcustomtext10, lbcustomtext11, lbcustomtext12, lbcustomtext13, lbcustomtext14, lbcustomtext15, lbcustomtext16, lbcustomtext17, lbcustomtext18, lbcustomtext19, lbcustomtext20, lbcustomint1, lbcustomint2, lbcustomint3, lbcustomint4, lbcustomint5, lbcustomint6, lbcustomint7, lbcustomint8, lbcustomint9, lbcustomint10, lbcustomint11, lbcustomint12, lbcustomint13, lbcustomint14, lbcustomint15, lbcustomint16, lbcustomint17, lbcustomint18, lbcustomint19, lbcustomint20, lbcustomdbl1, lbcustomdbl2, lbcustomdbl3, lbcustomdbl4, lbcustomdbl5, lbcustomdbl6, lbcustomdbl7, lbcustomdbl8, lbcustomdbl9, lbcustomdbl10, lbcustomdbl11, lbcustomdbl12, lbcustomdbl13, lbcustomdbl14, lbcustomdbl15, lbcustomdbl16, lbcustomdbl17, lbcustomdbl18, lbcustomdbl19, lbcustomdbl20, lbcustomdate1, lbcustomdate2, lbcustomdate3, lbcustomdate4, lbcustomdate5, lbcustomdate6, lbcustomdate7, lbcustomdate8, lbcustomdate9, lbcustomdate10, lbcustomdate11, lbcustomdate12, lbcustomdate13, lbcustomdate14, lbcustomdate15, lbcustomdate16, lbcustomdate17, lbcustomdate18, lbcustomdate19, lbcustomdate20, lbmatauang, lbkurs, lbjenislab, lbperawatan, lbkategoripasien, lbkamar, lbdokter, lbpenjualanlangsung, lbpetugas, lbumur, lbketerangan) values('{FixQuotes_drutama}lbcabang', '{FixQuotes_drutama}lblokasi', '{FixQuotes_drutama}lbgudang', '{FixQuotes_drutama}lbsumber', {drutama}lbautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}lbtgl', {drutama}lbkodepa, {drutama}lbcustomer, '{FixQuotes_drutama}lbcustomerkontak', '{FixQuotes_drutama}lburaian', '{FixQuotes_drutama}lbcatatan', '{FixQuotes_drutama}lbnoref', '{FixQuotes_AsFormatTanggal_drutama}lbtglnoref', '{FixDouble_drutama}lbtotaltransaksi', {drutama}lbidkj, {drutama}lbstatusrealisasi, {drutama}lbstatus, {drutama}lbstatussebelumnya, {drutama}lbjmlrevisi, {drutama}lbcetakanke, {drutama}lbinputuser, NOW(), {drutama}lbmodifikasiuser, '1971-01-01 00:00:00', {drutama}lbisclose, '{FixQuotes_drutama}lbcustomtext1', '{FixQuotes_drutama}lbcustomtext2', '{FixQuotes_drutama}lbcustomtext3', '{FixQuotes_drutama}lbcustomtext4', '{FixQuotes_drutama}lbcustomtext5', '{FixQuotes_drutama}lbcustomtext6', '{FixQuotes_drutama}lbcustomtext7', '{FixQuotes_drutama}lbcustomtext8', '{FixQuotes_drutama}lbcustomtext9', '{FixQuotes_drutama}lbcustomtext10', '{FixQuotes_drutama}lbcustomtext11', '{FixQuotes_drutama}lbcustomtext12', '{FixQuotes_drutama}lbcustomtext13', '{FixQuotes_drutama}lbcustomtext14', '{FixQuotes_drutama}lbcustomtext15', '{FixQuotes_drutama}lbcustomtext16', '{FixQuotes_drutama}lbcustomtext17', '{FixQuotes_drutama}lbcustomtext18', '{FixQuotes_drutama}lbcustomtext19', '{FixQuotes_drutama}lbcustomtext20', {drutama}lbcustomint1, {drutama}lbcustomint2, {drutama}lbcustomint3, {drutama}lbcustomint4, {drutama}lbcustomint5, {drutama}lbcustomint6, {drutama}lbcustomint7, {drutama}lbcustomint8, {drutama}lbcustomint9, {drutama}lbcustomint10, {drutama}lbcustomint11, {drutama}lbcustomint12, {drutama}lbcustomint13, {drutama}lbcustomint14, {drutama}lbcustomint15, {drutama}lbcustomint16, {drutama}lbcustomint17, {drutama}lbcustomint18, {drutama}lbcustomint19, {drutama}lbcustomint20, '{FixDouble_drutama}lbcustomdbl1', '{FixDouble_drutama}lbcustomdbl2', '{FixDouble_drutama}lbcustomdbl3', '{FixDouble_drutama}lbcustomdbl4', '{FixDouble_drutama}lbcustomdbl5', '{FixDouble_drutama}lbcustomdbl6', '{FixDouble_drutama}lbcustomdbl7', '{FixDouble_drutama}lbcustomdbl8', '{FixDouble_drutama}lbcustomdbl9', '{FixDouble_drutama}lbcustomdbl10', '{FixDouble_drutama}lbcustomdbl11', '{FixDouble_drutama}lbcustomdbl12', '{FixDouble_drutama}lbcustomdbl13', '{FixDouble_drutama}lbcustomdbl14', '{FixDouble_drutama}lbcustomdbl15', '{FixDouble_drutama}lbcustomdbl16', '{FixDouble_drutama}lbcustomdbl17', '{FixDouble_drutama}lbcustomdbl18', '{FixDouble_drutama}lbcustomdbl19', '{FixDouble_drutama}lbcustomdbl20', '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate3', '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate4', '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate5', '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate6', '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate7', '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate8', '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate9', '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate10', '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate11', '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate12', '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate13', '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate14', '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate15', '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate16', '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate17', '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate18', '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate19', '{FixQuotes_AsFormatTanggal_drutama}lbcustomdate20', '{FixQuotes_drutama}lbmatauang', '{FixDouble_drutama}lbkurs', '{FixQuotes_drutama}lbjenislab', '{FixQuotes_drutama}lbperawatan', '{FixQuotes_drutama}lbkategoripasien', '{FixQuotes_drutama}lbkamar', '{FixQuotes_drutama}lbdokter', {drutama}lbpenjualanlangsung, {drutama}lbpetugas, '{FixQuotes_drutama}lbumur', {drutama}lbketerangan)
```

```sql
select lbid from M_11_lb where lbnotransaksi='{notransaksi}' AND lbinputuser= '{userid}' order by lbmodifikasitgl desc limit 1
```

```sql
Delete from M_11_lb_Detail where idlb = '{result_4}'
```

```sql
Delete from M_11_lb_Hasil where idlb = '{result_4}'
```

```sql
Insert into M_11_lb_Detail(idlbdetail, idlb, jenis, idlayanan, namalayanan, jml, satuan, nilaisatuan, jmltotal, satuandefault, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudang, costcenter, divisi, subdivisi, proyek, catatan, urutan, idkjdetail, jmlrealisasi, statusrealisasi, isclose, iddokter, namadokter, customtext1, customtext2, customtext3, customtext4, customtext5, customtext6, customtext7, customtext8, customtext9, customtext10, customtext11, customtext12, customtext13, customtext14, customtext15, customtext16, customtext17, customtext18, customtext19, customtext20, customdbl1, customdbl2, customdbl3, customdbl4, customdbl5, customdbl6, customdbl7, customdbl8, customdbl9, customdbl10, customdbl11, customdbl12, customdbl13, customdbl14, customdbl15, customdbl16, customdbl17, customdbl18, customdbl19, customdbl20, customdate1, customdate2, customdate3, customdate4, customdate5, customdate6, customdate7, customdate8, customdate9, customdate10, customdate11, customdate12, customdate13, customdate14, customdate15, customdate16, customdate17, customdate18, customdate19, customdate20, matauang, kurs, rekpersediaan, rekhargapokok, rekdiskonpenjualan, rekpenjualan) values{strValue2_ToString}
```

```sql
Insert into M_11_lb_Hasil(idlbhasil, idlb, jenis, idlayanan, namalayanan, hasil, standart, catatan, urutan, kelompok, jml) values{strValue2_ToString}
```

```sql
UPDATE m_11_lb_detail SET jmlrealisasi = (CASE idkjdetail {updNilai} ELSE jmlrealisasi END) WHERE
```

```sql
SELECT idkj FROM m_11_kj_detail WHERE {updFilter} GROUP BY idkj
```

```sql
SELECT idkj, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m_11_kj_detail WHERE {ftDetail} GROUP BY idkj
```

```sql
UPDATE m_11_kj SET kjstatusrealisasi = (CASE kjid {updNilai} ELSE kjstatusrealisasi END) WHERE
```

```sql
SELECT kjstatus, kjnotransaksi FROM m_11_kj WHERE kjid='{drutama}lbidkj'
```

```sql
Update M_11_Kj set kjstatus = 3 where kjid = '{drutama}lbidkj'
```

```sql
SELECT moduleid, menuid, 0, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT lbtgl, lbnotransaksi, lbstatus, lbidkj FROM M_11_lb WHERE lbid='{idtransaksi}'
```

```sql
SELECT a.akid as idterkait, a.aksumber as sumber FROM m_11_ak a JOIN m_11_kj kj ON a.akidkj = kj.kjid AND a.akstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.kmid as idterkait, a.kmsumber as sumber FROM m_11_km a JOIN m_11_kj kj ON a.kmidkj = kj.kjid AND a.kmstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.kwid as idterkait, a.kwsumber as sumber FROM m_11_kw a JOIN m_11_kw_detail b ON a.kwid = b.idkw AND a.kwstatus IN(2,3,4,7) JOIN m_11_kj kj ON b.sumber = 'KJ' AND b.idtransaksi = kj.kjid AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.lbid as idterkait, a.lbsumber as sumber FROM m_11_lb a JOIN m_11_kj kj ON a.lbidkj = kj.kjid AND a.lbstatus IN(2,3,4,7) AND a.lbid <> '{FixDouble_idtransaksi}' AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.luid as idterkait, a.lusumber as sumber FROM m_11_lu a JOIN m_11_kj kj ON a.luidkj = kj.kjid AND a.lustatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.rkid as idterkait, a.rksumber as sumber FROM m_11_rk a JOIN m_11_kj kj ON a.rkidkj = kj.kjid AND a.rkstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.rmid as idterkait, 'RM' as sumber FROM m_11_rm a JOIN m_11_kj kj ON a.rmidkj = kj.kjid AND a.rmstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.roid as idterkait, a.rosumber as sumber FROM m_11_ro a JOIN m_11_kj kj ON a.roidkj = kj.kjid AND a.rostatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
UPDATE M_11_Kj SET kjstatus = 4 WHERE kjid = '{FixDouble_idkj}'
```

```sql
UPDATE M_11_Kj SET kjstatus = 3 WHERE kjid = '{FixDouble_idkj}'
```

```sql
UPDATE M_11_Kj SET kjstatus = 2 WHERE kjid = '{FixDouble_idkj}'
```

```sql
SELECT jenis, idlayanan, namalayanan, satuan, nilaisatuan, jmltotal, gudang, idkjdetail, urutan FROM m11_lu_detail WHERE idlu = '{idtransaksi}'
```

```sql
UPDATE m11_kj_detail SET jmlrealisasi = (CASE idkjdetail {updNilai} ELSE jmlrealisasi END) WHERE
```

```sql
SELECT idkj FROM m11_kj_detail WHERE {updFilter} GROUP BY idkj
```

```sql
UPDATE M_11_lb SET lbstatus = {nilaiStatus}, lbmodifikasiuser='{userid}', lbmodifikasitgl = NOW(), lbjmlrevisi = lbjmlrevisi + 1 WHERE lbid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT lbid, lbnotransaksi FROM M_11_lb WHERE lbid='{idtransaksi}'
```

```sql
DELETE FROM M_11_lb_Detail WHERE idlb = '{idtransaksi}'
```

```sql
DELETE FROM M_11_lb WHERE lbid = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m11/m11_lu.vb`

```sql
SELECT COUNT(luid), lunotransaksi FROM M_11_lu WHERE luid='{result_4}' AND lustatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(soid) FROM m_11_lu WHERE lunotransaksi='{notransaksi}'
```

```sql
Update M_11_Lu set lucabang = '{FixQuotes_drutama}lucabang', lulokasi = '{FixQuotes_drutama}lulokasi', lugudang = '{FixQuotes_drutama}lugudang', lusumber = '{FixQuotes_drutama}lusumber', luautonotransaksi = {drutama}luautonotransaksi, lunotransaksi = '{FixQuotes_notransaksi}', lutgl = '{FixQuotes_AsFormatTanggal_drutama}lutgl', lukodepa = {drutama}lukodepa, lucustomer = {drutama}lucustomer, lucustomerkontak = '{FixQuotes_drutama}lucustomerkontak', luuraian = '{FixQuotes_drutama}luuraian', lucatatan = '{FixQuotes_drutama}lucatatan', lunoref = '{FixQuotes_drutama}lunoref', lutglnoref = '{FixQuotes_AsFormatTanggal_drutama}lutglnoref', lutotaltransaksi = '{FixDouble_drutama}lutotaltransaksi', luidkj = {drutama}luidkj, lustatusrealisasi = {drutama}lustatusrealisasi, lustatus = {drutama}lustatus, lustatussebelumnya = {drutama}lustatussebelumnya, lujmlrevisi = lujmlrevisi+1, lucetakanke = {drutama}lucetakanke, lumodifikasiuser = {drutama}lumodifikasiuser, lumodifikasitgl = NOW(), lucustomtext1 = '{FixQuotes_drutama}lucustomtext1', lucustomtext2 = '{FixQuotes_drutama}lucustomtext2', lucustomtext3 = '{FixQuotes_drutama}lucustomtext3', lucustomtext4 = '{FixQuotes_drutama}lucustomtext4', lucustomtext5 = '{FixQuotes_drutama}lucustomtext5', lucustomtext6 = '{FixQuotes_drutama}lucustomtext6', lucustomtext7 = '{FixQuotes_drutama}lucustomtext7', lucustomtext8 = '{FixQuotes_drutama}lucustomtext8', lucustomtext9 = '{FixQuotes_drutama}lucustomtext9', lucustomtext10 = '{FixQuotes_drutama}lucustomtext10', lucustomtext11 = '{FixQuotes_drutama}lucustomtext11', lucustomtext12 = '{FixQuotes_drutama}lucustomtext12', lucustomtext13 = '{FixQuotes_drutama}lucustomtext13', lucustomtext14 = '{FixQuotes_drutama}lucustomtext14', lucustomtext15 = '{FixQuotes_drutama}lucustomtext15', lucustomtext16 = '{FixQuotes_drutama}lucustomtext16', lucustomtext17 = '{FixQuotes_drutama}lucustomtext17', lucustomtext18 = '{FixQuotes_drutama}lucustomtext18', lucustomtext19 = '{FixQuotes_drutama}lucustomtext19', lucustomtext20 = '{FixQuotes_drutama}lucustomtext20', lucustomint1 = {drutama}lucustomint1, lucustomint2 = {drutama}lucustomint2, lucustomint3 = {drutama}lucustomint3, lucustomint4 = {drutama}lucustomint4, lucustomint5 = {drutama}lucustomint5, lucustomint6 = {drutama}lucustomint6, lucustomint7 = {drutama}lucustomint7, lucustomint8 = {drutama}lucustomint8, lucustomint9 = {drutama}lucustomint9, lucustomint10 = {drutama}lucustomint10, lucustomint11 = {drutama}lucustomint11, lucustomint12 = {drutama}lucustomint12, lucustomint13 = {drutama}lucustomint13, lucustomint14 = {drutama}lucustomint14, lucustomint15 = {drutama}lucustomint15, lucustomint16 = {drutama}lucustomint16, lucustomint17 = {drutama}lucustomint17, lucustomint18 = {drutama}lucustomint18, lucustomint19 = {drutama}lucustomint19, lucustomint20 = {drutama}lucustomint20, lucustomdbl1 = '{FixDouble_drutama}lucustomdbl1', lucustomdbl2 = '{FixDouble_drutama}lucustomdbl2', lucustomdbl3 = '{FixDouble_drutama}lucustomdbl3', lucustomdbl4 = '{FixDouble_drutama}lucustomdbl4', lucustomdbl5 = '{FixDouble_drutama}lucustomdbl5', lucustomdbl6 = '{FixDouble_drutama}lucustomdbl6', lucustomdbl7 = '{FixDouble_drutama}lucustomdbl7', lucustomdbl8 = '{FixDouble_drutama}lucustomdbl8', lucustomdbl9 = '{FixDouble_drutama}lucustomdbl9', lucustomdbl10 = '{FixDouble_drutama}lucustomdbl10', lucustomdbl11 = '{FixDouble_drutama}lucustomdbl11', lucustomdbl12 = '{FixDouble_drutama}lucustomdbl12', lucustomdbl13 = '{FixDouble_drutama}lucustomdbl13', lucustomdbl14 = '{FixDouble_drutama}lucustomdbl14', lucustomdbl15 = '{FixDouble_drutama}lucustomdbl15', lucustomdbl16 = '{FixDouble_drutama}lucustomdbl16', lucustomdbl17 = '{FixDouble_drutama}lucustomdbl17', lucustomdbl18 = '{FixDouble_drutama}lucustomdbl18', lucustomdbl19 = '{FixDouble_drutama}lucustomdbl19', lucustomdbl20 = '{FixDouble_drutama}lucustomdbl20', lucustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}lucustomdate1', lucustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}lucustomdate2', lucustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}lucustomdate3', lucustomdate4 = '{FixQuotes_AsFormatTanggal_drutama}lucustomdate4', lucustomdate5 = '{FixQuotes_AsFormatTanggal_drutama}lucustomdate5', lucustomdate6 = '{FixQuotes_AsFormatTanggal_drutama}lucustomdate6', lucustomdate7 = '{FixQuotes_AsFormatTanggal_drutama}lucustomdate7', lucustomdate8 = '{FixQuotes_AsFormatTanggal_drutama}lucustomdate8', lucustomdate9 = '{FixQuotes_AsFormatTanggal_drutama}lucustomdate9', lucustomdate10 = '{FixQuotes_AsFormatTanggal_drutama}lucustomdate10', lucustomdate11 = '{FixQuotes_AsFormatTanggal_drutama}lucustomdate11', lucustomdate12 = '{FixQuotes_AsFormatTanggal_drutama}lucustomdate12', lucustomdate13 = '{FixQuotes_AsFormatTanggal_drutama}lucustomdate13', lucustomdate14 = '{FixQuotes_AsFormatTanggal_drutama}lucustomdate14', lucustomdate15 = '{FixQuotes_AsFormatTanggal_drutama}lucustomdate15', lucustomdate16 = '{FixQuotes_AsFormatTanggal_drutama}lucustomdate16', lucustomdate17 = '{FixQuotes_AsFormatTanggal_drutama}lucustomdate17', lucustomdate18 = '{FixQuotes_AsFormatTanggal_drutama}lucustomdate18', lucustomdate19 = '{FixQuotes_AsFormatTanggal_drutama}lucustomdate19', lucustomdate20 = '{FixQuotes_AsFormatTanggal_drutama}lucustomdate20', lumatauang = '{FixQuotes_drutama}lumatauang', lukurs = '{FixDouble_drutama}lukurs', luperawatan = '{FixDouble_drutama}luperawatan', lukategoripasien = '{FixDouble_drutama}lukategoripasien', lukamar = '{FixDouble_drutama}lukamar', luposting = 0, lujenisbilling = {drutama}lujenisbilling, lupetugas = {drutama}lupetugas where luid = '{drutama}luid'
```

```sql
SELECT COUNT(luid) FROM m_11_lu WHERE lunotransaksi='{notransaksi}'
```

```sql
Insert into M_11_Lu (lucabang, lulokasi, lugudang, lusumber, luautonotransaksi, lunotransaksi, lutgl, lukodepa, lucustomer, lucustomerkontak, luuraian, lucatatan, lunoref, lutglnoref, lumatauang, lukurs, lutotaltransaksi, luidkj, lustatusrealisasi, lustatus, lustatussebelumnya, lujmlrevisi, lucetakanke, luinputuser, luinputtgl, lumodifikasiuser, lumodifikasitgl, luisclose, lucustomtext1, lucustomtext2, lucustomtext3, lucustomtext4, lucustomtext5, lucustomtext6, lucustomtext7, lucustomtext8, lucustomtext9, lucustomtext10, lucustomtext11, lucustomtext12, lucustomtext13, lucustomtext14, lucustomtext15, lucustomtext16, lucustomtext17, lucustomtext18, lucustomtext19, lucustomtext20, lucustomint1, lucustomint2, lucustomint3, lucustomint4, lucustomint5, lucustomint6, lucustomint7, lucustomint8, lucustomint9, lucustomint10, lucustomint11, lucustomint12, lucustomint13, lucustomint14, lucustomint15, lucustomint16, lucustomint17, lucustomint18, lucustomint19, lucustomint20, lucustomdbl1, lucustomdbl2, lucustomdbl3, lucustomdbl4, lucustomdbl5, lucustomdbl6, lucustomdbl7, lucustomdbl8, lucustomdbl9, lucustomdbl10, lucustomdbl11, lucustomdbl12, lucustomdbl13, lucustomdbl14, lucustomdbl15, lucustomdbl16, lucustomdbl17, lucustomdbl18, lucustomdbl19, lucustomdbl20, lucustomdate1, lucustomdate2, lucustomdate3, lucustomdate4, lucustomdate5, lucustomdate6, lucustomdate7, lucustomdate8, lucustomdate9, lucustomdate10, lucustomdate11, lucustomdate12, lucustomdate13, lucustomdate14, lucustomdate15, lucustomdate16, lucustomdate17, lucustomdate18, lucustomdate19, lucustomdate20, luperawatan, lukategoripasien, lukamar, lujenisbilling, lupetugas) values('{FixQuotes_drutama}lucabang', '{FixQuotes_drutama}lulokasi', '{FixQuotes_drutama}lugudang', '{FixQuotes_drutama}lusumber', {drutama}luautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}lutgl', {drutama}lukodepa, {drutama}lucustomer, '{FixQuotes_drutama}lucustomerkontak', '{FixQuotes_drutama}luuraian', '{FixQuotes_drutama}lucatatan', '{FixQuotes_drutama}lunoref', '{FixQuotes_AsFormatTanggal_drutama}lutglnoref', '{FixQuotes_drutama}lumatauang', '{FixDouble_drutama}lukurs', '{FixDouble_drutama}lutotaltransaksi', {drutama}luidkj, {drutama}lustatusrealisasi, {drutama}lustatus, {drutama}lustatussebelumnya, {drutama}lujmlrevisi, {drutama}lucetakanke, {drutama}luinputuser, NOW(), {drutama}lumodifikasiuser, '1971-01-01 00:00:00', {drutama}luisclose, '{FixQuotes_drutama}lucustomtext1', '{FixQuotes_drutama}lucustomtext2', '{FixQuotes_drutama}lucustomtext3', '{FixQuotes_drutama}lucustomtext4', '{FixQuotes_drutama}lucustomtext5', '{FixQuotes_drutama}lucustomtext6', '{FixQuotes_drutama}lucustomtext7', '{FixQuotes_drutama}lucustomtext8', '{FixQuotes_drutama}lucustomtext9', '{FixQuotes_drutama}lucustomtext10', '{FixQuotes_drutama}lucustomtext11', '{FixQuotes_drutama}lucustomtext12', '{FixQuotes_drutama}lucustomtext13', '{FixQuotes_drutama}lucustomtext14', '{FixQuotes_drutama}lucustomtext15', '{FixQuotes_drutama}lucustomtext16', '{FixQuotes_drutama}lucustomtext17', '{FixQuotes_drutama}lucustomtext18', '{FixQuotes_drutama}lucustomtext19', '{FixQuotes_drutama}lucustomtext20', {drutama}lucustomint1, {drutama}lucustomint2, {drutama}lucustomint3, {drutama}lucustomint4, {drutama}lucustomint5, {drutama}lucustomint6, {drutama}lucustomint7, {drutama}lucustomint8, {drutama}lucustomint9, {drutama}lucustomint10, {drutama}lucustomint11, {drutama}lucustomint12, {drutama}lucustomint13, {drutama}lucustomint14, {drutama}lucustomint15, {drutama}lucustomint16, {drutama}lucustomint17, {drutama}lucustomint18, {drutama}lucustomint19, {drutama}lucustomint20, '{FixDouble_drutama}lucustomdbl1', '{FixDouble_drutama}lucustomdbl2', '{FixDouble_drutama}lucustomdbl3', '{FixDouble_drutama}lucustomdbl4', '{FixDouble_drutama}lucustomdbl5', '{FixDouble_drutama}lucustomdbl6', '{FixDouble_drutama}lucustomdbl7', '{FixDouble_drutama}lucustomdbl8', '{FixDouble_drutama}lucustomdbl9', '{FixDouble_drutama}lucustomdbl10', '{FixDouble_drutama}lucustomdbl11', '{FixDouble_drutama}lucustomdbl12', '{FixDouble_drutama}lucustomdbl13', '{FixDouble_drutama}lucustomdbl14', '{FixDouble_drutama}lucustomdbl15', '{FixDouble_drutama}lucustomdbl16', '{FixDouble_drutama}lucustomdbl17', '{FixDouble_drutama}lucustomdbl18', '{FixDouble_drutama}lucustomdbl19', '{FixDouble_drutama}lucustomdbl20', '{FixQuotes_AsFormatTanggal_drutama}lucustomdate1', '{FixQuotes_AsFormatTanggal_drutama}lucustomdate2', '{FixQuotes_AsFormatTanggal_drutama}lucustomdate3', '{FixQuotes_AsFormatTanggal_drutama}lucustomdate4', '{FixQuotes_AsFormatTanggal_drutama}lucustomdate5', '{FixQuotes_AsFormatTanggal_drutama}lucustomdate6', '{FixQuotes_AsFormatTanggal_drutama}lucustomdate7', '{FixQuotes_AsFormatTanggal_drutama}lucustomdate8', '{FixQuotes_AsFormatTanggal_drutama}lucustomdate9', '{FixQuotes_AsFormatTanggal_drutama}lucustomdate10', '{FixQuotes_AsFormatTanggal_drutama}lucustomdate11', '{FixQuotes_AsFormatTanggal_drutama}lucustomdate12', '{FixQuotes_AsFormatTanggal_drutama}lucustomdate13', '{FixQuotes_AsFormatTanggal_drutama}lucustomdate14', '{FixQuotes_AsFormatTanggal_drutama}lucustomdate15', '{FixQuotes_AsFormatTanggal_drutama}lucustomdate16', '{FixQuotes_AsFormatTanggal_drutama}lucustomdate17', '{FixQuotes_AsFormatTanggal_drutama}lucustomdate18', '{FixQuotes_AsFormatTanggal_drutama}lucustomdate19', '{FixQuotes_AsFormatTanggal_drutama}lucustomdate20', '{FixDouble_drutama}luperawatan', '{FixDouble_drutama}lukategoripasien', '{FixDouble_drutama}lukamar', {drutama}lujenisbilling, {drutama}lupetugas)
```

```sql
select luid from M_11_lu where lunotransaksi='{notransaksi}' AND luinputuser= '{userid}' order by lumodifikasitgl desc limit 1
```

```sql
Delete from M_11_Lu_Detail where idlu = '{result_4}'
```

```sql
Insert into M_11_lu_Detail(idludetail, idlu, jenis, idlayanan, namalayanan, jml, satuan, nilaisatuan, jmltotal, satuandefault, matauang, kurs, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudang, rekpersediaan, rekhargapokok, rekdiskonpenjualan, rekpenjualan, costcenter, divisi, subdivisi, proyek, catatan, urutan, idkjdetail, jmlrealisasi, statusrealisasi, isclose, iddokter, namadokter, customtext1, customtext2, customtext3, customtext4, customtext5, customtext6, customtext7, customtext8, customtext9, customtext10, customtext11, customtext12, customtext13, customtext14, customtext15, customtext16, customtext17, customtext18, customtext19, customtext20, customdbl1, customdbl2, customdbl3, customdbl4, customdbl5, customdbl6, customdbl7, customdbl8, customdbl9, customdbl10, customdbl11, customdbl12, customdbl13, customdbl14, customdbl15, customdbl16, customdbl17, customdbl18, customdbl19, customdbl20, customdate1, customdate2, customdate3, customdate4, customdate5, customdate6, customdate7, customdate8, customdate9, customdate10, customdate11, customdate12, customdate13, customdate14, customdate15, customdate16, customdate17, customdate18, customdate19, customdate20) values{strValue2_ToString}
```

```sql
UPDATE m_11_lu_detail SET jmlrealisasi = (CASE idkjdetail {updNilai} ELSE jmlrealisasi END) WHERE
```

```sql
SELECT idkj FROM m_11_kj_detail WHERE {updFilter} GROUP BY idkj
```

```sql
SELECT idkj, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m_11_kj_detail WHERE {ftDetail} GROUP BY idkj
```

```sql
UPDATE m_11_kj SET kjstatusrealisasi = (CASE kjid {updNilai} ELSE kjstatusrealisasi END) WHERE
```

```sql
SELECT kjstatus, kjnotransaksi FROM m_11_kj WHERE kjid='{drutama}luidkj'
```

```sql
Update M_11_Kj set kjstatus = 3 where kjid = '{drutama}luidkj'
```

```sql
Update M_11_Kj set kjkamar = '{drutama}lukamar' where kjid = '{drutama}luidkj'
```

```sql
SELECT moduleid, menuid, 0, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Lutgl, Lunotransaksi, Lustatus, Luidkj FROM M_11_Lu WHERE Luid='{idtransaksi}'
```

```sql
SELECT a.akid as idterkait, a.aksumber as sumber FROM m_11_ak a JOIN m_11_kj kj ON a.akidkj = kj.kjid AND a.akstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.kmid as idterkait, a.kmsumber as sumber FROM m_11_km a JOIN m_11_kj kj ON a.kmidkj = kj.kjid AND a.kmstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.kwid as idterkait, a.kwsumber as sumber FROM m_11_kw a JOIN m_11_kw_detail b ON a.kwid = b.idkw AND a.kwstatus IN(2,3,4,7) JOIN m_11_kj kj ON b.sumber = 'KJ' AND b.idtransaksi = kj.kjid AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.lbid as idterkait, a.lbsumber as sumber FROM m_11_lb a JOIN m_11_kj kj ON a.lbidkj = kj.kjid AND a.lbstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.luid as idterkait, a.lusumber as sumber FROM m_11_lu a JOIN m_11_kj kj ON a.luidkj = kj.kjid AND a.lustatus IN(2,3,4,7) AND a.luid <> '{FixDouble_idtransaksi}' AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.rkid as idterkait, a.rksumber as sumber FROM m_11_rk a JOIN m_11_kj kj ON a.rkidkj = kj.kjid AND a.rkstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.rmid as idterkait, 'RM' as sumber FROM m_11_rm a JOIN m_11_kj kj ON a.rmidkj = kj.kjid AND a.rmstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.roid as idterkait, a.rosumber as sumber FROM m_11_ro a JOIN m_11_kj kj ON a.roidkj = kj.kjid AND a.rostatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
UPDATE M_11_Kj SET kjstatus = 4 WHERE kjid = '{FixDouble_idkj}'
```

```sql
UPDATE M_11_Kj SET kjstatus = 3 WHERE kjid = '{FixDouble_idkj}'
```

```sql
UPDATE M_11_Kj SET kjstatus = 2 WHERE kjid = '{FixDouble_idkj}'
```

```sql
SELECT jenis, idlayanan, namalayanan, satuan, nilaisatuan, jmltotal, gudang, idkjdetail, urutan FROM m11_lu_detail WHERE idlu = '{idtransaksi}'
```

```sql
UPDATE m11_kj_detail SET jmlrealisasi = (CASE idkjdetail {updNilai} ELSE jmlrealisasi END) WHERE
```

```sql
SELECT idkj FROM m11_kj_detail WHERE {updFilter} GROUP BY idkj
```

```sql
UPDATE M_11_Lu SET Lustatus = {nilaiStatus}, Lumodifikasiuser='{userid}', Lumodifikasitgl = NOW(), Lujmlrevisi = Lujmlrevisi + 1 WHERE Luid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Luid, Lunotransaksi FROM M_11_Lu WHERE Luid='{idtransaksi}'
```

```sql
DELETE FROM M_11_Lu_Detail WHERE idlu = '{idtransaksi}'
```

```sql
DELETE FROM M_11_Lu WHERE luid = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m11/m11_lu_history.vb`

```sql
INSERT INTO m_11_lu_history(SELECT 0, lu.* FROM m_11_lu lu WHERE lu.luid = '{idtransaksi}')
```

```sql
SELECT luidhistory FROM m_11_lu_history WHERE luid = '{idtransaksi}' ORDER BY lumodifikasitgl DESC LIMIT 1
```

```sql
INSERT INTO m_11_lu_detail_history (SELECT 0, '{result_4}', lu.* FROM m_11_lu_detail lu WHERE lu.idlu = '{idtransaksi}' )
```

## `client-backend/api-myerpplus/app_code/ws/m11/m11_pb.vb`

```sql
SELECT EXISTS(SELECT 1 FROM m_11_kw_detail JOIN m_11_kw ON idkw = kwid WHERE idkwdetail = '{idicdetail}' AND (kwstatus = 2 OR kwstatus = 3 OR kwstatus = 4 OR kwstatus = 7) LIMIT 1) as rowExists, '{idicdetail}' as idkwdetail, '{sumberDetail}' as sumber, kwnotransaksi as notransaksi FROM m_11_kw WHERE kwid = '{idtransaksiDetail}'
```

```sql
SELECT COUNT(pvid), pvnotransaksi FROM m_11_pb WHERE pvid='{result_4}' AND pvstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(pvid) FROM m_11_pb WHERE pvnotransaksi='{notransaksi}'
```

```sql
Update m_11_pb set pvcabang = '{FixQuotes_drutama}pvcabang', pvlokasi = '{FixQuotes_drutama}pvlokasi', pvgudang = '{FixQuotes_drutama}pvgudang', pvsumber = '{FixQuotes_drutama}pvsumber', pvautonotransaksi = {drutama}pvautonotransaksi, pvnotransaksi = '{FixQuotes_notransaksi}', pvtgl = '{FixQuotes_AsFormatTanggal_drutama}pvtgl', pvkodepa = {drutama}pvkodepa, pvcustomer = {drutama}pvcustomer, pvcustomerkontak = '{FixQuotes_drutama}pvcustomerkontak', pv1alamat1 = '{FixQuotes_drutama}pv1alamat1', pv1alamat2 = '{FixQuotes_drutama}pv1alamat2', pv1alamat3 = '{FixQuotes_drutama}pv1alamat3', pv2alamat1 = '{FixQuotes_drutama}pv2alamat1', pv2alamat2 = '{FixQuotes_drutama}pv2alamat2', pv2alamat3 = '{FixQuotes_drutama}pv2alamat3', pvbagianpenjualan = {drutama}pvbagianpenjualan, pvbagianterima = {drutama}pvbagianterima, pvuraian = '{FixQuotes_drutama}pvuraian', pvcatatan = '{FixQuotes_drutama}pvcatatan', pvnoref = '{FixQuotes_drutama}pvnoref', pvtglnoref = '{FixQuotes_AsFormatTanggal_drutama}pvtglnoref', pvcarabayar = {drutama}pvcarabayar, pvtglbayar = '{FixQuotes_AsFormatTanggal_drutama}pvtglbayar', pvmatauang = '{FixQuotes_drutama}pvmatauang', pvkurs = '{FixDouble_drutama}pvkurs', pvtotalap = '{FixDouble_drutama}pvtotalap', pvtotalapvalas = '{FixDouble_drutama}pvtotalapvalas', pvtotalar = '{FixDouble_drutama}pvtotalar', pvtotalarvalas = '{FixDouble_drutama}pvtotalarvalas', pvbayar = '{FixDouble_drutama}pvbayar', pvbayarvalas = '{FixDouble_drutama}pvbayarvalas', pvselisihkurs = '{FixDouble_drutama}pvselisihkurs', pvrekselisihkurs = '{FixQuotes_drutama}pvrekselisihkurs', pvdiskontermin = '{FixDouble_drutama}pvdiskontermin', pvdiskonterminvalas = '{FixDouble_drutama}pvdiskonterminvalas', pvrekdiskontermin = '{FixQuotes_drutama}pvrekdiskontermin', pvidic = {drutama}pvidic, pvstatus = {drutama}pvstatus, pvstatussebelumnya = {drutama}pvstatussebelumnya, pvjmlrevisi = pvjmlrevisi+1, pvcetakanke = {drutama}pvcetakanke, pvmodifikasiuser = {drutama}pvmodifikasiuser, pvmodifikasitgl = NOW(), pvcustomtext1 = '{FixQuotes_drutama}pvcustomtext1', pvcustomtext2 = '{FixQuotes_drutama}pvcustomtext2', pvcustomtext3 = '{FixQuotes_drutama}pvcustomtext3', pvcustomtext4 = '{FixQuotes_drutama}pvcustomtext4', pvcustomtext5 = '{FixQuotes_drutama}pvcustomtext5', pvcustomint1 = {drutama}pvcustomint1, pvcustomint2 = {drutama}pvcustomint2, pvcustomint3 = {drutama}pvcustomint3, pvcustomdbl1 = '{FixDouble_drutama}pvcustomdbl1', pvcustomdbl2 = '{FixDouble_drutama}pvcustomdbl2', pvcustomdbl3 = '{FixDouble_drutama}pvcustomdbl3', pvcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}pvcustomdate1', pvcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}pvcustomdate2', pvcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}pvcustomdate3', pvpetugas = {drutama}pvpetugas where pvid = '{drutama}pvid'
```

```sql
Insert into m_11_pb (pvcabang, pvlokasi, pvgudang, pvsumber, pvautonotransaksi, pvnotransaksi, pvtgl, pvkodepa, pvcustomer, pvcustomerkontak, pv1alamat1, pv1alamat2, pv1alamat3, pv2alamat1, pv2alamat2, pv2alamat3, pvbagianpenjualan, pvbagianterima, pvuraian, pvcatatan, pvnoref, pvtglnoref, pvcarabayar, pvtglbayar, pvmatauang, pvkurs, pvtotalap, pvtotalapvalas, pvtotalar, pvtotalarvalas, pvbayar, pvbayarvalas, pvselisihkurs, pvrekselisihkurs, pvdiskontermin, pvdiskonterminvalas, pvrekdiskontermin, pvidic, pvstatus, pvstatussebelumnya, pvjmlrevisi, pvcetakanke, pvinputuser, pvinputtgl, pvmodifikasiuser, pvmodifikasitgl, pvisclose, pvcustomtext1, pvcustomtext2, pvcustomtext3, pvcustomtext4, pvcustomtext5, pvcustomint1, pvcustomint2, pvcustomint3, pvcustomdbl1, pvcustomdbl2, pvcustomdbl3, pvcustomdate1, pvcustomdate2, pvcustomdate3, pvpetugas) values('{FixQuotes_drutama}pvcabang', '{FixQuotes_drutama}pvlokasi', '{FixQuotes_drutama}pvgudang', '{FixQuotes_drutama}pvsumber', {drutama}pvautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}pvtgl', {drutama}pvkodepa, {drutama}pvcustomer, '{FixQuotes_drutama}pvcustomerkontak', '{FixQuotes_drutama}pv1alamat1', '{FixQuotes_drutama}pv1alamat2', '{FixQuotes_drutama}pv1alamat3', '{FixQuotes_drutama}pv2alamat1', '{FixQuotes_drutama}pv2alamat2', '{FixQuotes_drutama}pv2alamat3', {drutama}pvbagianpenjualan, {drutama}pvbagianterima, '{FixQuotes_drutama}pvuraian', '{FixQuotes_drutama}pvcatatan', '{FixQuotes_drutama}pvnoref', '{FixQuotes_AsFormatTanggal_drutama}pvtglnoref', {drutama}pvcarabayar, '{FixQuotes_AsFormatTanggal_drutama}pvtglbayar', '{FixQuotes_drutama}pvmatauang', '{FixDouble_drutama}pvkurs', '{FixDouble_drutama}pvtotalap', '{FixDouble_drutama}pvtotalapvalas', '{FixDouble_drutama}pvtotalar', '{FixDouble_drutama}pvtotalarvalas', '{FixDouble_drutama}pvbayar', '{FixDouble_drutama}pvbayarvalas', '{FixDouble_drutama}pvselisihkurs', '{FixQuotes_drutama}pvrekselisihkurs', '{FixDouble_drutama}pvdiskontermin', '{FixDouble_drutama}pvdiskonterminvalas', '{FixQuotes_drutama}pvrekdiskontermin', {drutama}pvidic, {drutama}pvstatus, {drutama}pvstatussebelumnya, {drutama}pvjmlrevisi, {drutama}pvcetakanke, {drutama}pvinputuser, NOW(), {drutama}pvmodifikasiuser, '1971-01-01 00:00:00', {drutama}pvisclose, '{FixQuotes_drutama}pvcustomtext1', '{FixQuotes_drutama}pvcustomtext2', '{FixQuotes_drutama}pvcustomtext3', '{FixQuotes_drutama}pvcustomtext4', '{FixQuotes_drutama}pvcustomtext5', {drutama}pvcustomint1, {drutama}pvcustomint2, {drutama}pvcustomint3, '{FixDouble_drutama}pvcustomdbl1', '{FixDouble_drutama}pvcustomdbl2', '{FixDouble_drutama}pvcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}pvcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}pvcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}pvcustomdate3',{FixDouble_drutama}pvpetugas)
```

```sql
select pvid from m_11_pb where pvnotransaksi='{notransaksi}' AND pvinputuser= '{userid}' order by pvmodifikasitgl desc limit 1
```

```sql
Delete from m_11_pb_detail where idpv = '{result_4}'
```

```sql
Insert into m_11_pb_detail(idpvdetail, idpv, sumber, idtransaksi, matauang, kurs, totaltransaksi, terbayar, rencana, sisa, jmlbayar, jmlbayarvalas, diskontermin, jmldiskontermin, jmldiskonterminvalas, nogiro, rekhutangpiutang, catatan, costcenter, divisi, subdivisi, proyek, idicdetail, urutan, isclose, customtext1, customtext2, customtext3, customdbl1, customdbl2, customdbl3, customdate1, customdate2, customdate3) values{strValue2_ToString}
```

```sql
UPDATE m_11_kw SET kwstatus = 4 WHERE
```

```sql
UPDATE m_11_kw_detail SET jmlpb = '{FixDouble_drutama}pvtotalap', statuspb = 2 WHERE idkw = '{drutama}pvidic'
```

```sql
SELECT idkw FROM m_11_kw_detail WHERE {updFilter} GROUP BY idkw
```

```sql
SELECT idkw, SUM(jmlbayar) as jmlbayar, SUM(jmlpb) as jmlpb FROM m_11_kw_detail WHERE {ftDetail} GROUP BY idkw
```

```sql
UPDATE m_11_kw SET kwstatuspb = 2, kwstatus = 4 WHERE kwid = '{drutama}pvidic'
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Pvtgl, Pvnotransaksi, Pvstatus FROM M_11_Pb WHERE Pvid='{idtransaksi}'
```

```sql
SELECT pvd.sumber as sumber, pvd.idtransaksi as idtransaksi, pvd.totaltransaksi as totaltransaksi, pvd.rekhutangpiutang as rekhutangpiutang, pv.pvidic as idic, pvd.urutan as urutan FROM m_11_pb_detail pvd join m_11_pb pv on (pvd.idpv = pv.pvid) and pvd.sumber = 'KW' WHERE pvd.idpv = '{idtransaksi}'
```

```sql
UPDATE m_11_kw SET kwstatus = kwstatussebelumnya WHERE
```

```sql
UPDATE m_11_kw_detail SET jmlpb = 0, statuspb = 0 WHERE
```

```sql
UPDATE m_11_kw SET kwstatuspb = 0 WHERE
```

```sql
UPDATE M_11_Pb SET Pvstatus = {nilaiStatus}, Pvmodifikasiuser='{userid}', Pvmodifikasitgl = NOW(), Pvposting = 0, Pvpostingtgl = '1971-01-01 00:00:00', Pvjmlrevisi = Pvjmlrevisi + 1 WHERE Pvid = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m11/m11_pt.vb`

```sql
SELECT COUNT(ptid), ptnotransaksi FROM M_11_pt WHERE ptid='{result_4}' AND ptstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(ptid) FROM M_11_pt WHERE ptnotransaksi='{notransaksi}'
```

```sql
Update m_11_pt set ptcabang = '{FixQuotes_drutama}ptcabang', ptlokasi = '{FixQuotes_drutama}ptlokasi', ptsumber = '{FixQuotes_drutama}ptsumber', ptautonotransaksi = '{FixQuotes_drutama}ptautonotransaksi', ptnotransaksi = '{FixQuotes_drutama}ptnotransaksi', pttgl = '{FixQuotes_AsFormatTanggal_drutama}pttgl', ptidkj = {drutama}ptidkj , ptjenispemasangan = {drutama}ptjenispemasangan , ptpemasanganharike = {drutama}ptpemasanganharike , ptjeniscairan = {drutama}ptjeniscairan ,ptjenisjarum = ptjenisjarum, ptobatobatan = '{FixQuotes_drutama}ptobatobatan',ptsuhutubuh = {drutama}ptsuhutubuh, ptrasapanas = {drutama}ptrasapanas, ptbengkak = {drutama}ptbengkak, ptkemerahan = {drutama}ptkemerahan, ptkeluarpus = {drutama}ptkeluarpus, ptleukositosis = '{FixQuotes_drutama}ptleukositosis' , ptkultur = '{FixQuotes_drutama}ptkultur' , ptcatatan = '{FixQuotes_drutama}ptcatatan' , ptstatusrealisasi = {drutama}ptstatusrealisasi, ptstatus = {drutama}ptstatus, ptstatussebelumnya = {drutama}ptstatussebelumnya, ptjmlrevisi = ptjmlrevisi+1, ptcetakanke = {drutama}ptcetakanke, ptmodifikasiuser = {drutama}ptmodifikasiuser, ptmodifikasitgl = NOW(), ptpetugas = {drutama}ptpetugas where ptid = '{drutama}ptid'
```

```sql
SELECT COUNT(kjid), kjnopasien, kjnotransaksi FROM m_11_kj WHERE kjperawatan = 'RI' AND kjnopasien = '{FixQuotes_drutama}kjnopasien' AND kjtgl = '{drutama}kjtgl'
```

```sql
SELECT COUNT(ptid) FROM m_11_pt WHERE ptnotransaksi='{notransaksi}'
```

```sql
Insert into m_11_pt (ptcabang, ptlokasi, ptsumber, ptautonotransaksi, ptnotransaksi, pttgl, ptidkj, ptjenispemasangan, ptpemasanganharike, ptjeniscairan, ptjenisjarum, ptobatobatan, ptsuhutubuh, ptrasapanas, ptbengkak, ptkemerahan, ptkeluarpus, ptleukositosis, ptkultur, ptcatatan, ptstatus, ptstatussebelumnya, ptjmlrevisi, ptcetakanke, ptinputuser, ptinputtgl, ptmodifikasiuser, ptmodifikasitgl, ptisclose, ptpetugas) values('{FixQuotes_drutama}ptcabang','{FixQuotes_drutama}ptlokasi','{FixQuotes_drutama}ptsumber', {drutama}ptautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}pttgl', {drutama}ptidkj, {drutama}ptjenispemasangan, {drutama}ptpemasanganharike, {drutama}ptjeniscairan, {drutama}ptjenisjarum, '{FixQuotes_drutama}ptobatobatan', {drutama}ptsuhutubuh, {drutama}ptrasapanas, {drutama}ptbengkak, {drutama}ptkemerahan, {drutama}ptkeluarpus, '{FixQuotes_drutama}ptleukositosis', '{FixQuotes_drutama}ptkultur', '{FixQuotes_drutama}ptcatatan', {drutama}ptstatus, {drutama}ptstatussebelumnya, {drutama}ptjmlrevisi, {drutama}ptcetakanke, {drutama}ptinputuser, NOW(), {drutama}ptmodifikasiuser, '1971-01-01 00:00:00', {drutama}ptisclose, {drutama}ptpetugas)
```

```sql
select ptid from m_11_pt where ptnotransaksi='{notransaksi}' AND ptinputuser= '{userid}' order by ptmodifikasitgl desc limit 1
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT pttgl, ptnotransaksi, ptstatus FROM m_11_pt WHERE ptid='{idtransaksi}'
```

```sql
UPDATE M_11_pt SET ptstatus = {nilaiStatus}, ptmodifikasiuser='{userid}', ptmodifikasitgl = NOW(), ptjmlrevisi = ptjmlrevisi + 1 WHERE ptid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT ptid, ptnotransaksi FROM m_11_pt WHERE ptid='{idtransaksi}'
```

```sql
DELETE FROM m_11_pt WHERE ptid = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m11/m11_rk.vb`

```sql
SELECT COUNT(rkid), rknotransaksi FROM m_11_rk WHERE rkid='{result_4}' AND rkstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(rkid) FROM m_11_rk WHERE rknotransaksi='{notransaksi}'
```

```sql
Update m_11_rk set rkcabang = '{FixQuotes_drutama}rkcabang', rklokasi = '{FixQuotes_drutama}rklokasi', rksumber = '{FixQuotes_drutama}rksumber', rkautonotransaksi = {drutama}rkautonotransaksi, rknotransaksi = '{notransaksi}', rktgl = '{FixQuotes_AsFormatTanggal_drutama}rktgl', rkkodepa = {drutama}rkkodepa, rkkontak = {drutama}rkkontak, rkkontakperson = '{FixQuotes_drutama}rkkontakperson', rkalamat = '{FixQuotes_drutama}rkalamat', rkbagianterima = {drutama}rkbagianterima, rktermin = '{FixQuotes_drutama}rktermin', rktgljatuhtempo = '{FixQuotes_AsFormatTanggal_drutama}rktgljatuhtempo', rknorek = '{FixQuotes_drutama}rknorek', rkuraian = '{FixQuotes_drutama}rkuraian', rkcatatan = '{FixQuotes_drutama}rkcatatan', rknoref = '{FixQuotes_drutama}rknoref', rktglnoref = '{FixQuotes_AsFormatTanggal_drutama}rktglnoref', rkmatauang = '{FixQuotes_drutama}rkmatauang', rkkurs = '{FixDouble_drutama}rkkurs', rkjumlah = '{FixDouble_drutama}rkjumlah', rkjumlahvalas = '{FixDouble_drutama}rkjumlahvalas', rkjumlahbayar = '{FixDouble_drutama}rkjumlahbayar', rkjumlahbayarvalas = '{FixDouble_drutama}rkjumlahbayarvalas', rkstatusbayar = {drutama}rkstatusbayar, rktgllunas = '{FixQuotes_AsFormatTanggal_drutama}rktgllunas', rkcostcenter = '{FixQuotes_drutama}rkcostcenter', rkdivisi = '{FixQuotes_drutama}rkdivisi', rksubdivisi = '{FixQuotes_drutama}rksubdivisi', rkproyek = '{FixQuotes_drutama}rkproyek', rkstatus = {drutama}rkstatus, rkstatussebelumnya = {drutama}rkstatussebelumnya, rkjmlrevisi = rkjmlrevisi+1, rkcetakanke = {drutama}rkcetakanke, rkmodifikasiuser = {drutama}rkmodifikasiuser, rkmodifikasitgl = NOW(), rkposting = 0, rkcustomtext1 = '{FixQuotes_drutama}rkcustomtext1', rkcustomtext2 = '{FixQuotes_drutama}rkcustomtext2', rkcustomtext3 = '{FixQuotes_drutama}rkcustomtext3', rkcustomtext4 = '{FixQuotes_drutama}rkcustomtext4', rkcustomtext5 = '{FixQuotes_drutama}rkcustomtext5', rkcustomint1 = {drutama}rkcustomint1, rkcustomint2 = {drutama}rkcustomint2, rkcustomint3 = {drutama}rkcustomint3, rkcustomdbl1 = '{FixDouble_drutama}rkcustomdbl1', rkcustomdbl2 = '{FixDouble_drutama}rkcustomdbl2', rkcustomdbl3 = '{FixDouble_drutama}rkcustomdbl3', rkcustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}rkcustomdate1', rkcustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}rkcustomdate2', rkcustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}rkcustomdate3', rkidkj = {drutama}rkidkj, rkperawatan = '{FixQuotes_drutama}rkperawatan', rkkategoripasien = '{FixQuotes_drutama}rkkategoripasien', rkkamar = '{FixQuotes_drutama}rkkamar', rkkategori = {drutama}rkkategori, rkjenistransaksi = {drutama}rkjenistransaksi where rkid = '{drutama}rkid'
```

```sql
Insert into m_11_rk (rkcabang, rklokasi, rksumber, rkautonotransaksi, rknotransaksi, rktgl, rkkodepa, rkkontak, rkkontakperson, rkalamat, rkbagianterima, rktermin, rktgljatuhtempo, rknorek, rkuraian, rkcatatan, rknoref, rktglnoref, rkmatauang, rkkurs, rkjumlah, rkjumlahvalas, rkjumlahbayar, rkjumlahbayarvalas, rkstatusbayar, rktgllunas, rkcostcenter, rkdivisi, rksubdivisi, rkproyek, rkstatus, rkstatussebelumnya, rkjmlrevisi, rkcetakanke, rkinputuser, rkinputtgl, rkmodifikasiuser, rkmodifikasitgl, rkposting, rkisclose, rkcustomtext1, rkcustomtext2, rkcustomtext3, rkcustomtext4, rkcustomtext5, rkcustomint1, rkcustomint2, rkcustomint3, rkcustomdbl1, rkcustomdbl2, rkcustomdbl3, rkcustomdate1, rkcustomdate2, rkcustomdate3, rkidkj, rkperawatan, rkkategoripasien, rkkamar, rkkategori, rkjenistransaksi) values('{FixQuotes_drutama}rkcabang', '{FixQuotes_drutama}rklokasi', '{FixQuotes_drutama}rksumber', {drutama}rkautonotransaksi, '{notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}rktgl', {drutama}rkkodepa, {drutama}rkkontak, '{FixQuotes_drutama}rkkontakperson', '{FixQuotes_drutama}rkalamat', {drutama}rkbagianterima, '{FixQuotes_drutama}rktermin', '{FixQuotes_AsFormatTanggal_drutama}rktgljatuhtempo', '{FixQuotes_drutama}rknorek', '{FixQuotes_drutama}rkuraian', '{FixQuotes_drutama}rkcatatan', '{FixQuotes_drutama}rknoref', '{FixQuotes_AsFormatTanggal_drutama}rktglnoref', '{FixQuotes_drutama}rkmatauang', '{FixDouble_drutama}rkkurs', '{FixDouble_drutama}rkjumlah', '{FixDouble_drutama}rkjumlahvalas', '{FixDouble_drutama}rkjumlahbayar', '{FixDouble_drutama}rkjumlahbayarvalas', {drutama}rkstatusbayar, '{FixQuotes_AsFormatTanggal_drutama}rktgllunas', '{FixQuotes_drutama}rkcostcenter', '{FixQuotes_drutama}rkdivisi', '{FixQuotes_drutama}rksubdivisi', '{FixQuotes_drutama}rkproyek', {drutama}rkstatus, {drutama}rkstatussebelumnya, {drutama}rkjmlrevisi, {drutama}rkcetakanke, {drutama}rkinputuser, NOW(), {drutama}rkmodifikasiuser, '1971-01-01 00:00:00', 0, {drutama}rkisclose, '{FixQuotes_drutama}rkcustomtext1', '{FixQuotes_drutama}rkcustomtext2', '{FixQuotes_drutama}rkcustomtext3', '{FixQuotes_drutama}rkcustomtext4', '{FixQuotes_drutama}rkcustomtext5', {drutama}rkcustomint1, {drutama}rkcustomint2, {drutama}rkcustomint3, '{FixDouble_drutama}rkcustomdbl1', '{FixDouble_drutama}rkcustomdbl2', '{FixDouble_drutama}rkcustomdbl3', '{FixQuotes_AsFormatTanggal_drutama}rkcustomdate1', '{FixQuotes_AsFormatTanggal_drutama}rkcustomdate2', '{FixQuotes_AsFormatTanggal_drutama}rkcustomdate3',{drutama}rkidkj, '{FixQuotes_drutama}rkperawatan', '{FixQuotes_drutama}rkkategoripasien', '{FixQuotes_drutama}rkkamar', {drutama}rkkategori, {drutama}rkjenistransaksi)
```

```sql
select rkid from m_11_rk where rknotransaksi='{notransaksi}' AND rkinputuser= '{userid}' order by rkmodifikasitgl desc limit 1
```

```sql
Delete from m_11_rk_pay where idrk = '{result_4}'
```

```sql
Insert into m_11_rk_pay(idrkcarabayar, idrk, carabayar, matauang, kurs, jumlah, jumlahvalas, nogiro, tgljt, bank, noacbank, rekbank, rekgiro, catatan, urutan, isclose) values{strValue2_ToString}
```

```sql
SELECT kjstatus, kjnotransaksi FROM m_11_kj WHERE kjid='{drutama}rkidkj'
```

```sql
Update M_11_Kj set kjstatus = 3 where kjid = '{drutama}rkidkj'
```

```sql
SELECT moduleid, menuid, 0, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Rktgl, Rknotransaksi, Rkstatus, rkidkj FROM M_11_Rk WHERE Rkid='{idtransaksi}'
```

```sql
SELECT a.akid as idterkait, a.aksumber as sumber FROM m_11_ak a JOIN m_11_kj kj ON a.akidkj = kj.kjid AND a.akstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.kmid as idterkait, a.kmsumber as sumber FROM m_11_km a JOIN m_11_kj kj ON a.kmidkj = kj.kjid AND a.kmstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.kwid as idterkait, a.kwsumber as sumber FROM m_11_kw a JOIN m_11_kw_detail b ON a.kwid = b.idkw AND a.kwstatus IN(2,3,4,7) JOIN m_11_kj kj ON b.sumber = 'KJ' AND b.idtransaksi = kj.kjid AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.lbid as idterkait, a.lbsumber as sumber FROM m_11_lb a JOIN m_11_kj kj ON a.lbidkj = kj.kjid AND a.lbstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.luid as idterkait, a.lusumber as sumber FROM m_11_lu a JOIN m_11_kj kj ON a.luidkj = kj.kjid AND a.lustatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.rkid as idterkait, a.rksumber as sumber FROM m_11_rk a JOIN m_11_kj kj ON a.rkidkj = kj.kjid AND a.rkstatus IN(2,3,4,7) AND a.rkid <> '{FixDouble_idtransaksi}' AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.rmid as idterkait, 'RM' as sumber FROM m_11_rm a JOIN m_11_kj kj ON a.rmidkj = kj.kjid AND a.rmstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.roid as idterkait, a.rosumber as sumber FROM m_11_ro a JOIN m_11_kj kj ON a.roidkj = kj.kjid AND a.rostatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
UPDATE M_11_Kj SET kjstatus = 4 WHERE kjid = '{FixDouble_idkj}'
```

```sql
UPDATE M_11_Kj SET kjstatus = 3 WHERE kjid = '{FixDouble_idkj}'
```

```sql
UPDATE M_11_Kj SET kjstatus = 2 WHERE kjid = '{FixDouble_idkj}'
```

```sql
UPDATE M_11_rk SET rkstatus = {nilaiStatus}, rkmodifikasiuser='{userid}', rkmodifikasitgl = NOW(), rkposting = 0, rkpostingtgl = '1971-01-01 00:00:00', rkjmlrevisi = rkjmlrevisi + 1 WHERE rkid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT rkid, rknotransaksi FROM M_11_rk WHERE rkid='{idtransaksi}'
```

```sql
DELETE FROM M_11_rk_Pay WHERE idrk='{idtransaksi}'
```

```sql
DELETE FROM M_11_rk WHERE rkid ='{idtransaksi}'
```

```sql
select `m11rk`.`rkid` AS `rkid`,`m11rk`.`rkcabang` AS `rkcabang`,`m11rk`.`rklokasi` AS `rklokasi`,`m11rk`.`rksumber` AS `rksumber`,`m11rk`.`rkautonotransaksi` AS `rkautonotransaksi`,`m11rk`.`rknotransaksi` AS `rknotransaksi`,`m11rk`.`rktgl` AS `rktgl`,`m11rk`.`rkkodepa` AS `rkkodepa`,`m11rk`.`rkkontak` AS `rkkontak`,`m11rk`.`rkkontakperson` AS `rkkontakperson`,`m11rk`.`rkalamat` AS `rkalamat`,`m11rk`.`rkbagianterima` AS `rkbagianterima`,`m11rk`.`rktermin` AS `rktermin`,`m11rk`.`rktgljatuhtempo` AS `rktgljatuhtempo`,`m11rk`.`rknorek` AS `rknorek`,`m11rk`.`rkuraian` AS `rkuraian`,`m11rk`.`rkcatatan` AS `rkcatatan`,`m11rk`.`rknoref` AS `rknoref`,`m11rk`.`rktglnoref` AS `rktglnoref`,`m11rk`.`rkmatauang` AS `rkmatauang`,`m11rk`.`rkkurs` AS `rkkurs`,`m11rk`.`rkjumlah` AS `rkjumlah`,`m11rk`.`rkjumlahvalas` AS `rkjumlahvalas`,`m11rk`.`rkjumlahbayar` AS `rkjumlahbayar`,`m11rk`.`rkjumlahbayarvalas` AS `rkjumlahbayarvalas`,`m11rk`.`rkstatusbayar` AS `rkstatusbayar`,`m11rk`.`rktgllunas` AS `rktgllunas`,`m11rk`.`rkcostcenter` AS `rkcostcenter`,`m11rk`.`rkdivisi` AS `rkdivisi`,`m11rk`.`rksubdivisi` AS `rksubdivisi`,`m11rk`.`rkproyek` AS `rkproyek`,`m11rk`.`rkstatus` AS `rkstatus`,`m11rk`.`rkstatussebelumnya` AS `rkstatussebelumnya`,`m11rk`.`rkjmlrevisi` AS `rkjmlrevisi`,`m11rk`.`rkcetakanke` AS `rkcetakanke`,`m11rk`.`rkinputuser` AS `rkinputuser`,`m11rk`.`rkinputtgl` AS `rkinputtgl`,`m11rk`.`rkmodifikasiuser` AS `rkmodifikasiuser`,`m11rk`.`rkmodifikasitgl` AS `rkmodifikasitgl`,`m11rk`.`rkposting` AS `rkposting`,`m11rk`.`rkpostingtgl` AS `rkpostingtgl`,`m11rk`.`rkisclose` AS `rkisclose`,`br`.`bnama` AS `rkcabangnama`,`lc`.`lnama` AS `rklokasinama`,`c1`.`ckode` AS `rkkontakkode`,`c1`.`cnama` AS `rkkontaknama`,`c2`.`kkode` AS `rkbagianterimakode`,`c2`.`knama` AS `rkbagianterimanama`,`coa`.`cnama` AS `rknoreknama`,`st1`.`nama` AS `rkstatusnama`,`st2`.`nama` AS `rkstatussebelumnyanama`,`u1`.`unama` AS `rkinputusernama`,`u2`.`unama` AS `rkmodifikasiusernama` from (((((((((`m_11_rk` `m11rk` left join `m1_branch` `br` on((`m11rk`.`rkcabang` = `br`.`bkode`))) left join `m1_location` `lc` on((`m11rk`.`rklokasi` = `lc`.`lkode`))) left join `m1_colleague` `c1` on((`m11rk`.`rkkontak` = `c1`.`cid`))) left join `m1_contact` `c2` on((`m11rk`.`rkbagianterima` = `c2`.`kid`))) left join `m1_coa` `coa` on((`m11rk`.`rknorek` = `coa`.`cnomor`))) left join `m0_status` `st1` on((`m11rk`.`rkstatus` = `st1`.`kode`))) left join `m0_status` `st2` on((`m11rk`.`rkstatussebelumnya` = `st2`.`kode`))) left join `m0_user` `u1` on((`m11rk`.`rkinputuser` = `u1`.`userid`))) left join `m0_user` `u2` on((`m11rk`.`rkmodifikasiuser` = `u2`.`userid`)))
```

## `client-backend/api-myerpplus/app_code/ws/m11/m11_rm.vb`

```sql
SELECT COUNT(rmid), rmnotransaksi FROM M_11_rm WHERE rmid='{result_4}' AND rmstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(rmid) FROM M_11_rm WHERE rmnotransaksi='{notransaksi}'
```

```sql
Update m_11_rm set rmidkj = {drutama}rmidkj, rmnorm = '{FixQuotes_drutama}rmnorm', rmperawatan = '{FixQuotes_drutama}rmperawatan', rmkategoripasien = '{FixQuotes_drutama}rmkategoripasien', rmlayanan = '{FixQuotes_drutama}rmlayanan', rmdokter = '{FixQuotes_drutama}rmdokter', rmkecelakaan = '{FixQuotes_drutama}rmkecelakaan', rmtgl = '{FixQuotes_AsFormatTanggal_drutama}rmtgl', rmnotransaksi = '{FixQuotes_drutama}rmnotransaksi', rmkasus = {drutama}rmkasus, rmicd = '{FixQuotes_drutama}rmicd', rmtindaklanjut = {drutama}rmtindaklanjut, rmkrs = {drutama}rmkrs, rmcarakrs = {drutama}rmcarakrs, rmstatus = {drutama}rmstatus, rmstatussebelumnya = {drutama}rmstatussebelumnya, rmjmlrevisi = rmjmlrevisi+1, rmcetakanke = {drutama}rmcetakanke, rmmodifikasiuser = {drutama}rmmodifikasiuser, rmmodifikasitgl = NOW(), rmjmlrawat = {drutama}rmjmlrawat, rmstatusimunisasi = {drutama}rmstatusimunisasi, rmtgllahir = '{FixQuotes_AsFormatTanggal_drutama}rmtgllahir', rmumur = {drutama}rmumur, rmketumur = '{FixQuotes_drutama}rmketumur', rmrujukan = {drutama}rmrujukan, rmrujukandetail = {drutama}rmrujukandetail, rmrehabmedik = '{FixQuotes_drutama}rmrehabmedik', rmhamilke = {drutama}rmhamilke, rmpersalinan = {drutama}rmpersalinan, rmkeadaanbayi = {drutama}rmkeadaanbayi, rmjeniskelamin = '{FixQuotes_drutama}rmjeniskelamin', rmpanjang = {drutama}rmpanjang, rmberat = {drutama}rmberat, rmketerangan = '{FixQuotes_drutama}rmketerangan', rmicd10 = '{FixQuotes_drutama}rmicd10', rmdokumen = {drutama}rmdokumen, rmtpip11 = {drutama}rmtpip11, rmtpip12 = {drutama}rmtpip12, rmtpip13 = {drutama}rmtpip13, rmtpip4 = {drutama}rmtpip4, rmtpip5 = {drutama}rmtpip5, rmigd21 = {drutama}rmigd21, rmigd22 = {drutama}rmigd22, rmigd18a = {drutama}rmigd18a, rmigd31 = {drutama}rmigd31, rmigd32 = {drutama}rmigd32, rmigd33 = {drutama}rmigd33, rmigd34 = {drutama}rmigd34, rmigd35 = {drutama}rmigd35, rmigd6 = {drutama}rmigd6, rmigd7 = {drutama}rmigd7, rmvk10 = {drutama}rmvk10, rmvk10b = {drutama}rmvk10b, rmvk22bayi = {drutama}rmvk22bayi, rmrawat36 = {drutama}rmrawat36, rmrawat37 = {drutama}rmrawat37, rmrawat38 = {drutama}rmrawat38, rmrawat9 = {drutama}rmrawat9, rmrawat10 = {drutama}rmrawat10, rmrawat14 = {drutama}rmrawat14, rmrawat15 = {drutama}rmrawat15, rmrawat16 = {drutama}rmrawat16, rmrawat20 = {drutama}rmrawat20, rmrawat21a = {drutama}rmrawat21a, rmrawat21b = {drutama}rmrawat21b, rmrawat22 = {drutama}rmrawat22, rmfp16oral = {drutama}rmfp16oral, rmgizi17 = {drutama}rmgizi17, rmoklapanastesi = {drutama}rmoklapanastesi, rmok19 = {drutama}rmok19, rmpetugas = {drutama}rmpetugas, rmalasan = {drutama}rmalasan, rmrawat18 = {drutama}rmrawat18, rmok18 = {drutama}rmok18, rmdiagnosa = '{FixQuotes_drutama}rmdiagnosa', rmcatatandiagnosa = '{FixQuotes_drutama}rmcatatandiagnosa', rmlokasidokumen = '{FixQuotes_drutama}rmlokasidokumen', rmicd10nama = '{FixQuotes_drutama}rmicd10nama' where rmid = '{drutama}rmid'
```

```sql
SELECT COUNT(rmid) FROM m_11_rm WHERE rmnotransaksi='{notransaksi}'
```

```sql
Insert into m_11_rm (rmidkj, rmnorm, rmperawatan, rmkategoripasien, rmlayanan, rmdokter, rmkecelakaan, rmtgl, rmnotransaksi, rmkasus, rmicd, rmtindaklanjut, rmkrs, rmcarakrs, rmstatus, rmstatussebelumnya, rmjmlrevisi, rmcetakanke, rminputuser, rminputtgl, rmmodifikasiuser, rmmodifikasitgl, rmisclose, rmjmlrawat, rmstatusimunisasi, rmtgllahir,rmumur,rmketumur,rmrujukan,rmrujukandetail,rmrehabmedik,rmhamilke,rmpersalinan,rmkeadaanbayi,rmjeniskelamin,rmpanjang,rmberat,rmketerangan,rmicd10,rmdokumen,rmtpip11,rmtpip12,rmtpip13,rmtpip4,rmtpip5,rmigd21,rmigd22,rmigd18a,rmigd31,rmigd32,rmigd33,rmigd34,rmigd35,rmigd6,rmigd7,rmvk10,rmvk10b,rmvk22bayi,rmrawat36,rmrawat37,rmrawat38,rmrawat9,rmrawat10,rmrawat14,rmrawat15,rmrawat16,rmrawat20,rmrawat21a,rmrawat21b,rmrawat22,rmfp16oral,rmgizi17,rmoklapanastesi,rmok19,rmpetugas,rmalasan,rmrawat18,rmok18,rmdiagnosa,rmcatatandiagnosa,rmlokasidokumen,rmicd10nama) values({drutama}rmidkj,'{FixQuotes_drutama}rmnorm','{FixQuotes_drutama}rmperawatan', '{FixQuotes_drutama}rmkategoripasien', '{FixQuotes_drutama}rmlayanan', '{FixQuotes_drutama}rmdokter', '{FixQuotes_drutama}rmkecelakaan', '{FixQuotes_AsFormatTanggal_drutama}rmtgl', '{FixQuotes_notransaksi}', {drutama}rmkasus, '{FixQuotes_drutama}rmicd', {drutama}rmtindaklanjut, {drutama}rmkrs, {drutama}rmcarakrs, {drutama}rmstatus, {drutama}rmstatussebelumnya, {drutama}rmjmlrevisi, {drutama}rmcetakanke, {drutama}rminputuser, NOW(), {drutama}rmmodifikasiuser, '1971-01-01 00:00:00', {drutama}rmisclose, {drutama}rmjmlrawat, {drutama}rmstatusimunisasi, '{FixQuotes_AsFormatTanggal_drutama}rmtgllahir',{drutama}rmumur,'{FixQuotes_drutama}rmketumur',{drutama}rmrujukan,{drutama}rmrujukandetail,'{FixQuotes_drutama}rmrehabmedik',{drutama}rmhamilke,{drutama}rmpersalinan,{drutama}rmkeadaanbayi,'{FixQuotes_drutama}rmjeniskelamin',{FixDouble_drutama}rmpanjang,{FixDouble_drutama}rmberat,'{FixQuotes_drutama}rmketerangan','{FixQuotes_drutama}rmicd10',{drutama}rmdokumen,{drutama}rmtpip11,{drutama}rmtpip12,{drutama}rmtpip13,{drutama}rmtpip4,{drutama}rmtpip5,{drutama}rmigd21,{drutama}rmigd22,{drutama}rmigd18a,{drutama}rmigd31,{drutama}rmigd32,{drutama}rmigd33,{drutama}rmigd34,{drutama}rmigd35,{drutama}rmigd6,{drutama}rmigd7,{drutama}rmvk10,{drutama}rmvk10b,{drutama}rmvk22bayi,{drutama}rmrawat36,{drutama}rmrawat37,{drutama}rmrawat38,{drutama}rmrawat9,{drutama}rmrawat10,{drutama}rmrawat14,{drutama}rmrawat15,{drutama}rmrawat16,{drutama}rmrawat20,{drutama}rmrawat21a,{drutama}rmrawat21b,{drutama}rmrawat22,{drutama}rmfp16oral,{drutama}rmgizi17,{drutama}rmoklapanastesi,{drutama}rmok19,{drutama}rmpetugas,{drutama}rmalasan,{drutama}rmrawat18,{drutama}rmok18,'{FixQuotes_drutama}rmdiagnosa','{FixQuotes_drutama}rmcatatandiagnosa','{FixQuotes_drutama}rmlokasidokumen','{FixQuotes_drutama}rmicd10nama')
```

```sql
select rmid from m_11_rm where rmnotransaksi='{notransaksi}' AND rminputuser= '{userid}' order by rmmodifikasitgl desc limit 1
```

```sql
SELECT moduleid, menuid, 0, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT rmtgl, rmnotransaksi, rmstatus, rmidkj FROM m_11_rm WHERE rmid='{idtransaksi}'
```

```sql
SELECT a.akid as idterkait, a.aksumber as sumber FROM m_11_ak a JOIN m_11_kj kj ON a.akidkj = kj.kjid AND a.akstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.kmid as idterkait, a.kmsumber as sumber FROM m_11_km a JOIN m_11_kj kj ON a.kmidkj = kj.kjid AND a.kmstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.kwid as idterkait, a.kwsumber as sumber FROM m_11_kw a JOIN m_11_kw_detail b ON a.kwid = b.idkw AND a.kwstatus IN(2,3,4,7) JOIN m_11_kj kj ON b.sumber = 'KJ' AND b.idtransaksi = kj.kjid AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.lbid as idterkait, a.lbsumber as sumber FROM m_11_lb a JOIN m_11_kj kj ON a.lbidkj = kj.kjid AND a.lbstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.luid as idterkait, a.lusumber as sumber FROM m_11_lu a JOIN m_11_kj kj ON a.luidkj = kj.kjid AND a.lustatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.rkid as idterkait, a.rksumber as sumber FROM m_11_rk a JOIN m_11_kj kj ON a.rkidkj = kj.kjid AND a.rkstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.rmid as idterkait, 'RM' as sumber FROM m_11_rm a JOIN m_11_kj kj ON a.rmidkj = kj.kjid AND a.rmstatus IN(2,3,4,7) AND a.rmid <> '{FixDouble_idtransaksi}' AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.roid as idterkait, a.rosumber as sumber FROM m_11_ro a JOIN m_11_kj kj ON a.roidkj = kj.kjid AND a.rostatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
UPDATE M_11_Kj SET kjstatus = 4 WHERE kjid = '{FixDouble_idkj}'
```

```sql
UPDATE M_11_Kj SET kjstatus = 3 WHERE kjid = '{FixDouble_idkj}'
```

```sql
UPDATE M_11_Kj SET kjstatus = 2 WHERE kjid = '{FixDouble_idkj}'
```

```sql
UPDATE M_11_rm SET rmstatus = {nilaiStatus}, rmmodifikasiuser='{userid}', rmmodifikasitgl = NOW(), rmjmlrevisi = rmjmlrevisi + 1 WHERE rmid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT rmid, rmnotransaksi FROM m_11_rm WHERE rmid='{idtransaksi}'
```

```sql
DELETE FROM m_11_rm WHERE rmid = '{idtransaksi}'
```

## `client-backend/api-myerpplus/app_code/ws/m11/m11_ro.vb`

```sql
SELECT EXISTS(SELECT 1 FROM m_11_kj_detail JOIN m_11_kj ON idkj = kjid WHERE idkjdetail = '{idkjdetail}' AND (kjstatus = 2 OR kjstatus = 3 OR kjstatus = 4 OR kjstatus = 7) LIMIT 1) as rowExists, '{idkjdetail}' as idkjdetail, bkode FROM m1_item WHERE bid = '{idbarang}'
```

```sql
SELECT COUNT(roid), ronotransaksi FROM M_11_ro WHERE roid='{result_4}' AND rostatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(soid) FROM m_11_ro WHERE ronotransaksi='{notransaksi}'
```

```sql
Update M_11_ro set rocabang = '{FixQuotes_drutama}rocabang', rolokasi = '{FixQuotes_drutama}rolokasi', rogudang = '{FixQuotes_drutama}rogudang', rosumber = '{FixQuotes_drutama}rosumber', roautonotransaksi = {drutama}roautonotransaksi, ronotransaksi = '{FixQuotes_notransaksi}', rotgl = '{FixQuotes_AsFormatTanggal_drutama}rotgl', rokodepa = {drutama}rokodepa, rocustomer = {drutama}rocustomer, rocustomerkontak = '{FixQuotes_drutama}rocustomerkontak', rouraian = '{FixQuotes_drutama}rouraian', rocatatan = '{FixQuotes_drutama}rocatatan', ronoref = '{FixQuotes_drutama}ronoref', rotglnoref = '{FixQuotes_AsFormatTanggal_drutama}rotglnoref', rototaltransaksi = '{FixDouble_drutama}rototaltransaksi', roidkj = {drutama}roidkj, rostatusrealisasi = {drutama}rostatusrealisasi, rostatus = {drutama}rostatus, rostatussebelumnya = {drutama}rostatussebelumnya, rojmlrevisi = rojmlrevisi+1, rocetakanke = {drutama}rocetakanke, romodifikasiuser = {drutama}romodifikasiuser, romodifikasitgl = NOW(), rocustomtext1 = '{FixQuotes_drutama}rocustomtext1', rocustomtext2 = '{FixQuotes_drutama}rocustomtext2', rocustomtext3 = '{FixQuotes_drutama}rocustomtext3', rocustomtext4 = '{FixQuotes_drutama}rocustomtext4', rocustomtext5 = '{FixQuotes_drutama}rocustomtext5', rocustomtext6 = '{FixQuotes_drutama}rocustomtext6', rocustomtext7 = '{FixQuotes_drutama}rocustomtext7', rocustomtext8 = '{FixQuotes_drutama}rocustomtext8', rocustomtext9 = '{FixQuotes_drutama}rocustomtext9', rocustomtext10 = '{FixQuotes_drutama}rocustomtext10', rocustomtext11 = '{FixQuotes_drutama}rocustomtext11', rocustomtext12 = '{FixQuotes_drutama}rocustomtext12', rocustomtext13 = '{FixQuotes_drutama}rocustomtext13', rocustomtext14 = '{FixQuotes_drutama}rocustomtext14', rocustomtext15 = '{FixQuotes_drutama}rocustomtext15', rocustomtext16 = '{FixQuotes_drutama}rocustomtext16', rocustomtext17 = '{FixQuotes_drutama}rocustomtext17', rocustomtext18 = '{FixQuotes_drutama}rocustomtext18', rocustomtext19 = '{FixQuotes_drutama}rocustomtext19', rocustomtext20 = '{FixQuotes_drutama}rocustomtext20', rocustomint1 = {drutama}rocustomint1, rocustomint2 = {drutama}rocustomint2, rocustomint3 = {drutama}rocustomint3, rocustomint4 = {drutama}rocustomint4, rocustomint5 = {drutama}rocustomint5, rocustomint6 = {drutama}rocustomint6, rocustomint7 = {drutama}rocustomint7, rocustomint8 = {drutama}rocustomint8, rocustomint9 = {drutama}rocustomint9, rocustomint10 = {drutama}rocustomint10, rocustomint11 = {drutama}rocustomint11, rocustomint12 = {drutama}rocustomint12, rocustomint13 = {drutama}rocustomint13, rocustomint14 = {drutama}rocustomint14, rocustomint15 = {drutama}rocustomint15, rocustomint16 = {drutama}rocustomint16, rocustomint17 = {drutama}rocustomint17, rocustomint18 = {drutama}rocustomint18, rocustomint19 = {drutama}rocustomint19, rocustomint20 = {drutama}rocustomint20, rocustomdbl1 = '{FixDouble_drutama}rocustomdbl1', rocustomdbl2 = '{FixDouble_drutama}rocustomdbl2', rocustomdbl3 = '{FixDouble_drutama}rocustomdbl3', rocustomdbl4 = '{FixDouble_drutama}rocustomdbl4', rocustomdbl5 = '{FixDouble_drutama}rocustomdbl5', rocustomdbl6 = '{FixDouble_drutama}rocustomdbl6', rocustomdbl7 = '{FixDouble_drutama}rocustomdbl7', rocustomdbl8 = '{FixDouble_drutama}rocustomdbl8', rocustomdbl9 = '{FixDouble_drutama}rocustomdbl9', rocustomdbl10 = '{FixDouble_drutama}rocustomdbl10', rocustomdbl11 = '{FixDouble_drutama}rocustomdbl11', rocustomdbl12 = '{FixDouble_drutama}rocustomdbl12', rocustomdbl13 = '{FixDouble_drutama}rocustomdbl13', rocustomdbl14 = '{FixDouble_drutama}rocustomdbl14', rocustomdbl15 = '{FixDouble_drutama}rocustomdbl15', rocustomdbl16 = '{FixDouble_drutama}rocustomdbl16', rocustomdbl17 = '{FixDouble_drutama}rocustomdbl17', rocustomdbl18 = '{FixDouble_drutama}rocustomdbl18', rocustomdbl19 = '{FixDouble_drutama}rocustomdbl19', rocustomdbl20 = '{FixDouble_drutama}rocustomdbl20', rocustomdate1 = '{FixQuotes_AsFormatTanggal_drutama}rocustomdate1', rocustomdate2 = '{FixQuotes_AsFormatTanggal_drutama}rocustomdate2', rocustomdate3 = '{FixQuotes_AsFormatTanggal_drutama}rocustomdate3', rocustomdate4 = '{FixQuotes_AsFormatTanggal_drutama}rocustomdate4', rocustomdate5 = '{FixQuotes_AsFormatTanggal_drutama}rocustomdate5', rocustomdate6 = '{FixQuotes_AsFormatTanggal_drutama}rocustomdate6', rocustomdate7 = '{FixQuotes_AsFormatTanggal_drutama}rocustomdate7', rocustomdate8 = '{FixQuotes_AsFormatTanggal_drutama}rocustomdate8', rocustomdate9 = '{FixQuotes_AsFormatTanggal_drutama}rocustomdate9', rocustomdate10 = '{FixQuotes_AsFormatTanggal_drutama}rocustomdate10', rocustomdate11 = '{FixQuotes_AsFormatTanggal_drutama}rocustomdate11', rocustomdate12 = '{FixQuotes_AsFormatTanggal_drutama}rocustomdate12', rocustomdate13 = '{FixQuotes_AsFormatTanggal_drutama}rocustomdate13', rocustomdate14 = '{FixQuotes_AsFormatTanggal_drutama}rocustomdate14', rocustomdate15 = '{FixQuotes_AsFormatTanggal_drutama}rocustomdate15', rocustomdate16 = '{FixQuotes_AsFormatTanggal_drutama}rocustomdate16', rocustomdate17 = '{FixQuotes_AsFormatTanggal_drutama}rocustomdate17', rocustomdate18 = '{FixQuotes_AsFormatTanggal_drutama}rocustomdate18', rocustomdate19 = '{FixQuotes_AsFormatTanggal_drutama}rocustomdate19', rocustomdate20 = '{FixQuotes_AsFormatTanggal_drutama}rocustomdate20', romatauang = '{FixQuotes_drutama}romatauang', rokurs = '{FixDouble_drutama}rokurs', roposting = 0, roperawatan = '{FixDouble_drutama}roperawatan', rokategoripasien = '{FixDouble_drutama}rokategoripasien', rokamar = '{FixDouble_drutama}rokamar', ropetugas = {drutama}ropetugas, rojenistransaksi = {drutama}rojenistransaksi where roid = '{drutama}roid'
```

```sql
SELECT COUNT(roid) FROM m_11_ro WHERE ronotransaksi='{notransaksi}'
```

```sql
Insert into M_11_ro (rocabang, rolokasi, rogudang, rosumber, roautonotransaksi, ronotransaksi, rotgl, rokodepa, rocustomer, rocustomerkontak, rouraian, rocatatan, ronoref, rotglnoref, rototaltransaksi, roidkj, rostatusrealisasi, rostatus, rostatussebelumnya, rojmlrevisi, rocetakanke, roinputuser, roinputtgl, romodifikasiuser, romodifikasitgl, roisclose, rocustomtext1, rocustomtext2, rocustomtext3, rocustomtext4, rocustomtext5, rocustomtext6, rocustomtext7, rocustomtext8, rocustomtext9, rocustomtext10, rocustomtext11, rocustomtext12, rocustomtext13, rocustomtext14, rocustomtext15, rocustomtext16, rocustomtext17, rocustomtext18, rocustomtext19, rocustomtext20, rocustomint1, rocustomint2, rocustomint3, rocustomint4, rocustomint5, rocustomint6, rocustomint7, rocustomint8, rocustomint9, rocustomint10, rocustomint11, rocustomint12, rocustomint13, rocustomint14, rocustomint15, rocustomint16, rocustomint17, rocustomint18, rocustomint19, rocustomint20, rocustomdbl1, rocustomdbl2, rocustomdbl3, rocustomdbl4, rocustomdbl5, rocustomdbl6, rocustomdbl7, rocustomdbl8, rocustomdbl9, rocustomdbl10, rocustomdbl11, rocustomdbl12, rocustomdbl13, rocustomdbl14, rocustomdbl15, rocustomdbl16, rocustomdbl17, rocustomdbl18, rocustomdbl19, rocustomdbl20, rocustomdate1, rocustomdate2, rocustomdate3, rocustomdate4, rocustomdate5, rocustomdate6, rocustomdate7, rocustomdate8, rocustomdate9, rocustomdate10, rocustomdate11, rocustomdate12, rocustomdate13, rocustomdate14, rocustomdate15, rocustomdate16, rocustomdate17, rocustomdate18, rocustomdate19, rocustomdate20, romatauang, rokurs, roperawatan, rokategoripasien, rokamar, ropetugas, rojenistransaksi) values('{FixQuotes_drutama}rocabang', '{FixQuotes_drutama}rolokasi', '{FixQuotes_drutama}rogudang', '{FixQuotes_drutama}rosumber', {drutama}roautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}rotgl', {drutama}rokodepa, {drutama}rocustomer, '{FixQuotes_drutama}rocustomerkontak', '{FixQuotes_drutama}rouraian', '{FixQuotes_drutama}rocatatan', '{FixQuotes_drutama}ronoref', '{FixQuotes_AsFormatTanggal_drutama}rotglnoref', '{FixDouble_drutama}rototaltransaksi', {drutama}roidkj, {drutama}rostatusrealisasi, {drutama}rostatus, {drutama}rostatussebelumnya, {drutama}rojmlrevisi, {drutama}rocetakanke, {drutama}roinputuser, NOW(), {drutama}romodifikasiuser, '1971-01-01 00:00:00', {drutama}roisclose, '{FixQuotes_drutama}rocustomtext1', '{FixQuotes_drutama}rocustomtext2', '{FixQuotes_drutama}rocustomtext3', '{FixQuotes_drutama}rocustomtext4', '{FixQuotes_drutama}rocustomtext5', '{FixQuotes_drutama}rocustomtext6', '{FixQuotes_drutama}rocustomtext7', '{FixQuotes_drutama}rocustomtext8', '{FixQuotes_drutama}rocustomtext9', '{FixQuotes_drutama}rocustomtext10', '{FixQuotes_drutama}rocustomtext11', '{FixQuotes_drutama}rocustomtext12', '{FixQuotes_drutama}rocustomtext13', '{FixQuotes_drutama}rocustomtext14', '{FixQuotes_drutama}rocustomtext15', '{FixQuotes_drutama}rocustomtext16', '{FixQuotes_drutama}rocustomtext17', '{FixQuotes_drutama}rocustomtext18', '{FixQuotes_drutama}rocustomtext19', '{FixQuotes_drutama}rocustomtext20', {drutama}rocustomint1, {drutama}rocustomint2, {drutama}rocustomint3, {drutama}rocustomint4, {drutama}rocustomint5, {drutama}rocustomint6, {drutama}rocustomint7, {drutama}rocustomint8, {drutama}rocustomint9, {drutama}rocustomint10, {drutama}rocustomint11, {drutama}rocustomint12, {drutama}rocustomint13, {drutama}rocustomint14, {drutama}rocustomint15, {drutama}rocustomint16, {drutama}rocustomint17, {drutama}rocustomint18, {drutama}rocustomint19, {drutama}rocustomint20, '{FixDouble_drutama}rocustomdbl1', '{FixDouble_drutama}rocustomdbl2', '{FixDouble_drutama}rocustomdbl3', '{FixDouble_drutama}rocustomdbl4', '{FixDouble_drutama}rocustomdbl5', '{FixDouble_drutama}rocustomdbl6', '{FixDouble_drutama}rocustomdbl7', '{FixDouble_drutama}rocustomdbl8', '{FixDouble_drutama}rocustomdbl9', '{FixDouble_drutama}rocustomdbl10', '{FixDouble_drutama}rocustomdbl11', '{FixDouble_drutama}rocustomdbl12', '{FixDouble_drutama}rocustomdbl13', '{FixDouble_drutama}rocustomdbl14', '{FixDouble_drutama}rocustomdbl15', '{FixDouble_drutama}rocustomdbl16', '{FixDouble_drutama}rocustomdbl17', '{FixDouble_drutama}rocustomdbl18', '{FixDouble_drutama}rocustomdbl19', '{FixDouble_drutama}rocustomdbl20', '{FixQuotes_AsFormatTanggal_drutama}rocustomdate1', '{FixQuotes_AsFormatTanggal_drutama}rocustomdate2', '{FixQuotes_AsFormatTanggal_drutama}rocustomdate3', '{FixQuotes_AsFormatTanggal_drutama}rocustomdate4', '{FixQuotes_AsFormatTanggal_drutama}rocustomdate5', '{FixQuotes_AsFormatTanggal_drutama}rocustomdate6', '{FixQuotes_AsFormatTanggal_drutama}rocustomdate7', '{FixQuotes_AsFormatTanggal_drutama}rocustomdate8', '{FixQuotes_AsFormatTanggal_drutama}rocustomdate9', '{FixQuotes_AsFormatTanggal_drutama}rocustomdate10', '{FixQuotes_AsFormatTanggal_drutama}rocustomdate11', '{FixQuotes_AsFormatTanggal_drutama}rocustomdate12', '{FixQuotes_AsFormatTanggal_drutama}rocustomdate13', '{FixQuotes_AsFormatTanggal_drutama}rocustomdate14', '{FixQuotes_AsFormatTanggal_drutama}rocustomdate15', '{FixQuotes_AsFormatTanggal_drutama}rocustomdate16', '{FixQuotes_AsFormatTanggal_drutama}rocustomdate17', '{FixQuotes_AsFormatTanggal_drutama}rocustomdate18', '{FixQuotes_AsFormatTanggal_drutama}rocustomdate19', '{FixQuotes_AsFormatTanggal_drutama}rocustomdate20', '{FixQuotes_drutama}romatauang', '{FixDouble_drutama}rokurs', '{FixDouble_drutama}roperawatan', '{FixDouble_drutama}rokategoripasien', '{FixDouble_drutama}rokamar', {drutama}ropetugas, {drutama}rojenistransaksi)
```

```sql
select roid from M_11_ro where ronotransaksi='{notransaksi}' AND roinputuser= '{userid}' order by romodifikasitgl desc limit 1
```

```sql
Delete from M_11_ro_Detail where idro = '{result_4}'
```

```sql
Insert into M_11_ro_Detail(idrodetail, idro, jenis, idlayanan, namalayanan, jml, satuan, nilaisatuan, jmltotal, satuandefault, harga, diskon, jmldiskon, pajak1, jmlpajak1, pajak2, jmlpajak2, cabang, lokasi, gudang, costcenter, divisi, subdivisi, proyek, catatan, urutan, idkjdetail, jmlrealisasi, statusrealisasi, isclose, iddokter, namadokter, customtext1, customtext2, customtext3, customtext4, customtext5, customtext6, customtext7, customtext8, customtext9, customtext10, customtext11, customtext12, customtext13, customtext14, customtext15, customtext16, customtext17, customtext18, customtext19, customtext20, customdbl1, customdbl2, customdbl3, customdbl4, customdbl5, customdbl6, customdbl7, customdbl8, customdbl9, customdbl10, customdbl11, customdbl12, customdbl13, customdbl14, customdbl15, customdbl16, customdbl17, customdbl18, customdbl19, customdbl20, customdate1, customdate2, customdate3, customdate4, customdate5, customdate6, customdate7, customdate8, customdate9, customdate10, customdate11, customdate12, customdate13, customdate14, customdate15, customdate16, customdate17, customdate18, customdate19, customdate20, matauang, kurs, rekpersediaan, rekhargapokok, rekdiskonpenjualan, rekpenjualan, idhppkhususkeluar, hpp, gudangtransit, gudangtujuan, tipebarang) values{strValue2_ToString}
```

```sql
UPDATE m_11_ro_detail SET jmlrealisasi = (CASE idkjdetail {updNilai} ELSE jmlrealisasi END) WHERE
```

```sql
SELECT idkj FROM m_11_kj_detail WHERE {updFilter} GROUP BY idkj
```

```sql
SELECT idkj, SUM(jmlbarang) as jmlbarang, SUM(jmlrealisasi) as jmlrealisasi FROM m_11_kj_detail WHERE {ftDetail} GROUP BY idkj
```

```sql
UPDATE m_11_kj SET kjstatusrealisasi = (CASE kjid {updNilai} ELSE kjstatusrealisasi END) WHERE
```

```sql
SELECT kjstatus, kjnotransaksi FROM m_11_kj WHERE kjid='{drutama}roidkj'
```

```sql
Update M_11_Kj set kjstatus = 3 where kjid = '{drutama}roidkj'
```

```sql
SELECT rod.idrodetail, rod.idlayanan, rod.namalayanan, rod.tipebarang, rod.jml, rod.satuan, rod.jmltotal, rod.satuandefault, rod.matauang, rod.kurs, rod.harga, rod.diskon, rod.jmldiskon, rod.idhppkhususkeluar, rod.hpp, rod.gudang, rod.gudangtransit, rod.gudangtujuan, rod.catatan, rod.costcenter, rod.divisi, rod.subdivisi, rod.proyek, ro.roinputtgl, i.bhpp FROM m_11_ro_detail rod JOIN m_11_ro ro ON rod.idro = ro.roid JOIN m1_item i ON rod.idlayanan = i.bid WHERE rod.idro = '{result_4}'
```

```sql
SELECT moduleid, menuid, 0, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT Rotgl, Ronotransaksi, Rostatus, roidkj FROM M_11_Ro WHERE Roid='{idtransaksi}'
```

```sql
SELECT a.akid as idterkait, a.aksumber as sumber FROM m_11_ak a JOIN m_11_kj kj ON a.akidkj = kj.kjid AND a.akstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.kmid as idterkait, a.kmsumber as sumber FROM m_11_km a JOIN m_11_kj kj ON a.kmidkj = kj.kjid AND a.kmstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.kwid as idterkait, a.kwsumber as sumber FROM m_11_kw a JOIN m_11_kw_detail b ON a.kwid = b.idkw AND a.kwstatus IN(2,3,4,7) JOIN m_11_kj kj ON b.sumber = 'KJ' AND b.idtransaksi = kj.kjid AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.lbid as idterkait, a.lbsumber as sumber FROM m_11_lb a JOIN m_11_kj kj ON a.lbidkj = kj.kjid AND a.lbstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.luid as idterkait, a.lusumber as sumber FROM m_11_lu a JOIN m_11_kj kj ON a.luidkj = kj.kjid AND a.lustatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.rkid as idterkait, a.rksumber as sumber FROM m_11_rk a JOIN m_11_kj kj ON a.rkidkj = kj.kjid AND a.rkstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.rmid as idterkait, 'RM' as sumber FROM m_11_rm a JOIN m_11_kj kj ON a.rmidkj = kj.kjid AND a.rmstatus IN(2,3,4,7) AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
SELECT a.roid as idterkait, a.rosumber as sumber FROM m_11_ro a JOIN m_11_kj kj ON a.roidkj = kj.kjid AND a.rostatus IN(2,3,4,7) AND a.roid <> '{FixDouble_idtransaksi}' AND kj.kjid = '{FixDouble_idkj}' GROUP BY kj.kjid
```

```sql
UPDATE M_11_Kj SET kjstatus = 4 WHERE kjid = '{FixDouble_idkj}'
```

```sql
UPDATE M_11_Kj SET kjstatus = 3 WHERE kjid = '{FixDouble_idkj}'
```

```sql
UPDATE M_11_Kj SET kjstatus = 2 WHERE kjid = '{FixDouble_idkj}'
```

```sql
SELECT rod.idrodetail, rod.idlayanan, i.bkode as kodebarang, rod.tipebarang, rod.namalayanan, rod.satuan, rod.nilaisatuan, rod.jmltotal, rod.gudang, rod.gudangtransit, rod.gudangtujuan, rod.idhppkhususkeluar, rod.urutan, i.bhpp FROM m_11_ro_detail rod JOIN m1_item i ON rod.idlayanan = i.bid WHERE rod.idro = '{idtransaksi}'
```

```sql
UPDATE M_11_ro SET Rostatus = {nilaiStatus}, Romodifikasiuser='{userid}', Romodifikasitgl = NOW(), Roposting = 0, Rotglposting = '1971-01-01 00:00:00', Rojmlrevisi = Rojmlrevisi + 1 WHERE Roid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT roid, ronotransaksi FROM M_11_ro WHERE roid='{idtransaksi}'
```

```sql
DELETE FROM M_11_ro_Detail WHERE idro = '{idtransaksi}'
```

```sql
DELETE FROM M_11_ro WHERE roid = '{idtransaksi}'
```

```sql
SELECT COUNT(ronoref) FROM m_11_ro WHERE roperawatan = '{idtransaksi_1}' AND rokategoripasien = '{idtransaksi_2}' AND ronoref='{idtransaksi_0}' AND YEAR(rotgl) = '{idtransaksi_3}'
```

```sql
SELECT COUNT(ronoref) FROM m_11_ro WHERE roperawatan = '{idtransaksi_1}' AND ronoref='{idtransaksi_0}' AND YEAR(rotgl) = '{idtransaksi_3}'
```

```sql
SELECT COUNT(aknoref) FROM m_11_ak WHERE akperawatan = '{idtransaksi_1}' AND akkategoripasien = '{idtransaksi_2}' AND aknoref='{idtransaksi_0}' AND YEAR(aktgl) = '{idtransaksi_3}'
```

```sql
SELECT COUNT(aknoref) FROM m11_ak WHERE akperawatan = '{idtransaksi_1}' AND akkategoripasien = '{idtransaksi_2}' AND aknoref='{idtransaksi_0}'
```

## `client-backend/api-myerpplus/app_code/ws/m11/m11_ud.vb`

```sql
SELECT COUNT(udid), udnotransaksi FROM M_11_ud WHERE udid='{result_4}' AND udstatus NOT IN(2,3,4,7)
```

```sql
SELECT COUNT(udid) FROM M_11_ud WHERE udnotransaksi='{notransaksi}'
```

```sql
Update m_11_ud set udcabang = '{FixQuotes_drutama}udcabang', udlokasi = '{FixQuotes_drutama}udlokasi', udsumber = '{FixQuotes_drutama}udsumber', udautonotransaksi = '{FixQuotes_drutama}udautonotransaksi', udnotransaksi = '{FixQuotes_drutama}udnotransaksi', udtgl = '{FixQuotes_AsFormatTanggal_drutama}udtgl', udidkj = {drutama}udidkj , udkejadiandi = {drutama}udkejadiandi , udterjadipadaharike = {drutama}udterjadipadaharike , udkemerahan = {drutama}udkemerahan ,udnyeritekan = udnyeritekan, udbengkak = {drutama}udbengkak, udtirahbaring = {drutama}udtirahbaring, uddekubitus = {drutama}uddekubitus, udkuman = {drutama}udkuman, udcatatan = '{FixQuotes_drutama}udcatatan' , udstatusrealisasi = {drutama}udstatusrealisasi, udstatus = {drutama}udstatus, udstatussebelumnya = {drutama}udstatussebelumnya, udjmlrevisi = udjmlrevisi+1, udcetakanke = {drutama}udcetakanke, udmodifikasiuser = {drutama}udmodifikasiuser, udmodifikasitgl = NOW(), udpetugas = {drutama}udpetugas where udid = '{drutama}udid'
```

```sql
SELECT COUNT(kjid), kjnopasien, kjnotransaksi FROM m_11_kj WHERE kjperawatan = 'RI' AND kjnopasien = '{FixQuotes_drutama}kjnopasien' AND kjtgl = '{drutama}kjtgl'
```

```sql
SELECT COUNT(udid) FROM m_11_ud WHERE udnotransaksi='{notransaksi}'
```

```sql
Insert into m_11_ud (udcabang, udlokasi, udsumber, udautonotransaksi, udnotransaksi, udtgl, udidkj, udkejadiandi, udterjadipadaharike, udkemerahan, udnyeritekan, udbengkak, udtirahbaring, uddekubitus, udkuman, udcatatan, udstatus, udstatussebelumnya, udjmlrevisi, udcetakanke, udinputuser, udinputtgl, udmodifikasiuser, udmodifikasitgl, udisclose, udpetugas) values('{FixQuotes_drutama}udcabang','{FixQuotes_drutama}udlokasi','{FixQuotes_drutama}udsumber', {drutama}udautonotransaksi, '{FixQuotes_notransaksi}', '{FixQuotes_AsFormatTanggal_drutama}udtgl', {drutama}udidkj, {drutama}udkejadiandi, {drutama}udterjadipadaharike, {drutama}udkemerahan, {drutama}udnyeritekan, {drutama}udbengkak, {drutama}udtirahbaring, {drutama}uddekubitus, {drutama}udkuman, '{FixQuotes_drutama}udcatatan', {drutama}udstatus, {drutama}udstatussebelumnya, {drutama}udjmlrevisi, {drutama}udcetakanke, {drutama}udinputuser, NOW(), {drutama}udmodifikasiuser, '1971-01-01 00:00:00', {drutama}udisclose, {drutama}udpetugas)
```

```sql
select udid from m_11_ud where udnotransaksi='{notransaksi}' AND udinputuser= '{userid}' order by udmodifikasitgl desc limit 1
```

```sql
SELECT moduleid, menuid, 0 FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT udtgl, udnotransaksi, udstatus FROM m_11_ud WHERE udid='{idtransaksi}'
```

```sql
UPDATE M_11_ud SET udstatus = {nilaiStatus}, udmodifikasiuser='{userid}', udmodifikasitgl = NOW(), udjmlrevisi = udjmlrevisi + 1 WHERE udid = '{idtransaksi}'
```

```sql
SELECT moduleid, menuid FROM m0_nomor WHERE kodetabel='{sumber}' UNION SELECT udid, udnotransaksi FROM m_11_ud WHERE udid='{idtransaksi}'
```

```sql
DELETE FROM m_11_ud WHERE udid = '{idtransaksi}'
```

