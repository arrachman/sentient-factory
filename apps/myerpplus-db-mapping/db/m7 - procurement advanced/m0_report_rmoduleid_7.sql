-- m0_report full queries for rmoduleid = 7
-- total rows: 10

-- RID=502 | MENU=12 | ITEM=1 | RQUERY=1 | NAME=Penyusutan Aset (DA) | FILE=PenyusutanAset
SELECT da.datgl , da.danotransaksi , st.nama AS dastatus , da.dauraian , asset.akode , asset.anama , asset.atglbeli , asset.aumurekonomis , asset.ahargabeli , asset.abebanperbln , asset.anilaibuku , asset.acatatan , CASE asset.ametode WHEN 1 then "Garis Lurus" WHEN 2 then "Saldo Menurun" end AS ametode , stt.nama AS astatus FROM m7_da da JOIN m0_status st ON da.dastatus = st.kode JOIN m7_da_detail dad ON da.daid = dad.idda JOIN m7_asset asset ON dad.idaset = asset.aid JOIN m0_status_progress stt ON asset.astatus = stt.kode ORDER BY da.datgl, da.daid , da.danotransaksi , dad.urutan;

-- RID=559 | MENU=12 | ITEM=2 | RQUERY=1 | NAME=Penyusutan Aset (DA) | FILE=PenyusutanAset_UD
SELECT da.datgl , da.danotransaksi , st.nama AS dastatus , da.dauraian , asset.akode , asset.anama , asset.atglbeli , asset.aumurekonomis , asset.ahargabeli , asset.abebanperbln , asset.anilaibuku , asset.acatatan , CASE asset.ametode WHEN 1 then "Garis Lurus" WHEN 2 then "Saldo Menurun" end AS ametode , stt.nama AS astatus FROM m7_da da JOIN m0_status st ON da.dastatus = st.kode JOIN m7_da_detail dad ON da.daid = dad.idda JOIN m7_asset asset ON dad.idaset = asset.aid JOIN m0_status stt ON asset.astatus = stt.kode ORDER BY da.datgl, da.daid , da.danotransaksi , dad.urutan;

-- RID=827 | MENU=23 | ITEM=1 | RQUERY=1 | NAME=Kategori Pajak Aktiva Tetap | FILE=katpajakaktivatetap
SELECT act.actkode, act.actnama, act.actumur, act.actpenyusutan, dc.nama AS metode FROM m7_asset_category_tax act JOIN m7_depreciation_category dc ON act.actmetode = dc.kode ORDER BY act.actkode, act.actnama;

-- RID=828 | MENU=24 | ITEM=1 | RQUERY=1 | NAME=Kategori Aktiva Tetap | FILE=kataktivatetap
SELECT ac.acnama, ac.ackode, act.actnama AS kategoripajak FROM m7_asset_category ac JOIN m7_asset_category_tax act ON ac.ackategoripajak = act.actkode ORDER BY ac.ackode;

-- RID=829 | MENU=25 | ITEM=1 | RQUERY=1 | NAME=Aktiva Tetap | FILE=aktivatetap
SELECT ass.akode, ass.anama, ass.akategori, ass.atglbeli, ass.ahargabeli, ass.aumurekonomis,ass.abebanperbln, ass.aakumulasibeban, ass.anilaibuku, sp.nama AS status FROM m7_asset ass JOIN m0_status_progress sp ON ass.astatus = sp.kode ORDER BY ass.akode;

-- RID=1000 | MENU=25 | ITEM=2 | RQUERY=1 | NAME=Analisa Penyusutan Aktiva Tetap | FILE=analisapenyusutanaktivatetap
SELECT IFNULL((assc.acnama),'-') AS acnama , ass.anama , ass.ahargabeli, ass.anilairesidu, ass.abebanperbln , ass.aakumulasibeban , ass.anilaibuku FROM m7_asset ass LEFT JOIN m7_asset_category assc ON ass.akategori = assc.ackode ORDER BY assc.ackode , assc.acnama , ass.anama;

-- RID=1001 | MENU=25 | ITEM=3 | RQUERY=1 | NAME=Daftar Aktiva Tetap | FILE=aktivatetap2
SELECT IFNULL((assc.acnama),'-') AS acnama , ass.anama , ass.anomor , ass.atglbeli , ass.anilairesidu , ass.aumurekonomis , ass.ahargabeli FROM m7_asset ass LEFT JOIN m7_asset_category assc ON ass.akategori = assc.ackode ORDER BY assc.ackode , assc.acnama , ass.anama;

-- RID=1002 | MENU=25 | ITEM=4 | RQUERY=1 | NAME=Aktiva Tetap Habis Umur Ekonomis | FILE=aktivatetaphabisumurekonomis
SELECT IFNULL((assc.acnama),'-') AS acnama , ass.anama , ass.anomor , ass.atglbeli , ass.anilairesidu , ass.aumurekonomis , ass.ahargabeli FROM m7_asset ass LEFT JOIN m7_asset_category assc ON ass.akategori = assc.ackode WHERE ass.astatus = 2 ORDER BY assc.ackode , assc.acnama , ass.anama;

-- RID=1003 | MENU=25 | ITEM=5 | RQUERY=1 | NAME=Penyusutan Per Kelompok | FILE=penyusutanperkelompok
SELECT assc.acnama , SUM(ass.ahargabeli) AS ahargabeli , SUM(ass.aakumulasibeban) AS aakumulasibeban, SUM(ass.abebanperbln) AS abebanperbln , SUM(ass.anilaibuku) AS anilaibuku FROM m7_asset ass LEFT JOIN m7_asset_category assc ON ass.akategori = assc.ackode GROUP BY assc.ackode ORDER BY assc.ackode;

-- RID=1359 | MENU=69 | ITEM=1 | RQUERY=2 | NAME=Analisa Penyusutan Aktiva Tetap | FILE=analisapenyusutanaktivatetap_1
SELECT * FROM m2r_analisa_penyusutan ORDER BY akategori, atglbeli, akode;

