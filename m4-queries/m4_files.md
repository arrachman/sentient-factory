# M4_FILES Queries

## Query 1

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_files.vb`

```sql
DELETE FROM M4_Files WHERE fsumber = '{sumber}' AND fidtransaksi ='{idtransaksi}' AND fnamafile='{namafile}'
```

## Query 2

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_files.vb`

```sql
Insert into M4_Files(fsumber, fidtransaksi, fnamafile, fcatatan, fukuranfile, ftanggal, finputuser, finputtgl) values{strValue1.ToString}
```

## Query 3

Sources: `client-backend/api-myerpplus/app_code/ws/m4/m4_files.vb`

```sql
UPDATE m4_files SET fcatatan = CASE fnamafile {strValue1.ToString} ELSE fcatatan END, fukuranfile = CASE fnamafile {strValue2.ToString} ELSE fukuranfile END, ftanggal = CASE fnamafile {strValue3.ToString} ELSE ftanggal END WHERE fsumber='{sumber}' AND fidtransaksi='{idtrans}'
```

## Query 4

Sources: `client-backend/api-myerpplus/app_code/ws/m0/m0_query.vb` `m4_files_v`

```sql
select `f`.`fsumber` AS `fsumber`,`f`.`fidtransaksi` AS `fidtransaksi`,`f`.`fnamafile` AS `fnamafile`,`f`.`fcatatan` AS `fcatatan`,`f`.`fukuranfile` AS `fukuranfile`,`f`.`ftanggal` AS `ftanggal`,`f`.`finputuser` AS `finputuser`,`f`.`finputtgl` AS `finputtgl`,`u`.`unama` AS `finputusernama` from (`m4_files` `f` left join `m0_user` `u` on((`f`.`finputuser` = `u`.`userid`)))
```

