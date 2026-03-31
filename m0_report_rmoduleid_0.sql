-- m0_report full queries for rmoduleid = 0
-- total rows: 1

-- RID=196 | MENU=0 | ITEM=1 | RQUERY=1 | NAME=Assembly | FILE=assembly
SELECT asd.urutan , sa.asnotransaksi , sa.astgl , sa.asuraian , asd.jml as jmldetail , asd.satuan as satuandetail, asd.hpp , asd.namabarang as namabarangdetail, asd.tipebarang as tipebarangdetail , b.bkode as kodedetail, bj.bsatuan as satuan, sa.asjmljadi , bj.bkode AS bk2 , bj.bnama AS bn2 , bj.btipe as bt2 , g.gnama FROM m3_as sa JOIN m3_as_detail asd on sa.asid = asd.idas JOIN m1_barang b on asd.idbarang = b.bid JOIN m1_barang bj on sa.asidbarangjadi = bj.bid LEFT JOIN m1_gudang g on sa.asgudang = g.gkode;

