# M8 Queries

Collected from `client-backend/api-myerpplus/app_code/ws/myerpplus.vb` dispatch targets under `app_code/ws/m8`.

Total queries: `9`

## `client-backend/api-myerpplus/app_code/ws/m8/m8_content.vb`

```sql
SELECT c.ckode, c.cmodule, c.cnama, c.cformula, c.cformat, c.cperiode, c.cketerangan, c.clinkdetail, c.curutan, c.caktif, c.cinputuser, cinputtgl, cmodifikasiuser, cmodifikasitgl, m.mname, i.igreater, i.ivalue1, i.ivalue2 FROM m8_content AS c JOIN m0_module m ON m.mid = c.cmodule JOIN m8_indicator i ON i.ikode = c.ckode
```

```sql
SELECT c.ckode, c.cmodule, c.cnama, c.cformula, c.cformat, c.cperiode, c.cketerangan, c.clinkdetail, c.curutan, c.caktif, IFNULL(i.igreater,3) AS igreater, IFNULL(i.ivalue1,0) AS ivalue1, IFNULL(i.ivalue2,0) AS ivalue2, IFNULL(i.ivalue3,0) AS ivalue3 FROM m8_content c LEFT JOIN m8_indicator i on i.ikode = c.ckode
```

## `client-backend/api-myerpplus/app_code/ws/m8/m8_content_chart.vb`

```sql
SELECT c.cnama AS chnama, ch.* FROM `m8_content_chart` ch JOIN m8_content c ON c.ckode = ch.chkode
```

```sql
SELECT c.ckode, c.cmodule, c.cnama, c.cformula, c.cformat, c.cperiode, c.cketerangan, c.ctipe, c.csubtipe, c.clinkdetail, c.curutan, c.caktif FROM m8_content c
```

```sql
SELECT * FROM m8_content_chart
```

## `client-backend/api-myerpplus/app_code/ws/m8/m8_indicator.vb`

```sql
SELECT COUNT(ikode) FROM m8_indicator WHERE ikode ='{dataUtama_0}'
```

```sql
Update m8_indicator set ivalue1 = '{dataUtama_1}', ivalue2 = '{dataUtama_2}', ivalue3 = '{dataUtama_3}', igreater = '{dataUtama_4}, imodifikasiuser = {dataUtama_7}, amodifikasitgl = NOW() where akode = '{dataUtama_0}'
```

```sql
Insert into m8_indicator (ikode, ivalue1, ivalue2, ivalue3, igreater, iinputuser, iinputtgl, imodifikasiuser, imodifikasitgl) values('{FixQuotes_dataUtama_0}', {dataUtama_1}, {dataUtama_2}, {dataUtama_3}, {dataUtama_4}, {dataUtama_5}, NOW(), {dataUtama_7}, '1971-01-01 00:00:00')
```

```sql
SELECT c.cmodule, m.mname AS cmodulename, c.cnama, i.ikode, i.ivalue1, i.ivalue2, i.ivalue3, i.igreater, i.iinputuser, i.iinputtgl, i.imodifikasiuser, i.imodifikasitgl FROM m8_indicator AS i JOIN m8_content c ON c.ckode = i.ikode JOIN m0_module m on m.mid = c.cmodule
```

