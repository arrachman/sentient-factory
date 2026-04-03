-- m0_report full queries for rmoduleid = 2
-- total rows: 241

-- RID=9 | MENU=3 | ITEM=1 | RQUERY=1 | NAME=Daftar Kas Masuk (CR) | FILE=ListCashReceipt
SELECT cr.crid, cr.crnotransaksi, cr.crtgl, cr.cruraian, k.knama, cr.crkodepa, cr.crkontakperson, crd.catatan, crd.kurs, crd.matauang, cr.crnorek, crd.norek AS norek, stat.nama AS statuscr, crd.divisi, crd.costcenter, crd.proyek, c.cnama AS namarekening, k.kkode, cr.crkontak, sum(crd.jumlahvalas) AS jmlvalas, sum(crd.jumlah) AS kredit FROM m2_cr cr JOIN m2_cr_detail crd ON cr.crid = crd.idcr JOIN m1_contact k ON cr.crkontak = k.kid JOIN m1_coa c ON crd.norek = c.cnomor JOIN m0_status stat ON cr.crstatus = stat.kode LEFT JOIN m1_division d ON crd.divisi = d.dkode LEFT JOIN m1_cost_center cc ON crd.costcenter = cc.cckode LEFT JOIN m1_project p ON crd.proyek = p.pkode WHERE (cr.crsumber = 'CR') GROUP BY crd.idcrdetail ORDER BY cr.crtgl ASC, cr.crnotransaksi, crd.urutan;

-- RID=10 | MENU=3 | ITEM=2 | RQUERY=1 | NAME=Kas Masuk (CR) | FILE=CashReceiptdetailcb_new
SELECT crd.urutan, c.ckodebank, c.cnomor, c.cnama, CASE LEFT(crd.jumlah,1) WHEN "-" THEN "D" ELSE "C" END AS cdc , c2.cnomor AS debit, c2.cnama AS debitnama, ct.knama, crd.norek, crd.jumlah AS kredit, cr.crnotransaksi, cr.crtgl, crd.catatan, f_nominal(cr.crjumlah,"IDR") AS terbilang, crd.matauang, crd.kurs , cr.cruraian, crd.costcenter, crd.divisi FROM m2_cr cr JOIN m2_cr_detail crd ON cr.crid = crd.idcr JOIN m1_coa c ON crd.norek = c.cnomor LEFT JOIN m1_coa c2 ON cr.crnorek = c2.cnomor JOIN m1_contact ct ON cr.crkontak = ct.kid WHERE (cr.crsumber = 'CR') ORDER BY cr.crtgl ASC, cr.crnotransaksi, crd.urutan;

-- RID=515 | MENU=3 | ITEM=3 | RQUERY=1 | NAME=Kas Masuk (CR) | FILE=CashReceiptdetailcb_ud
SELECT crd.urutan, c.ckodebank, c.cnomor, c.cnama, crd.norek, crd.jumlah AS kredit, cr.crnotransaksi, cr.crtgl, crd.catatan, f_nominal(cr.crjumlah,cr.crmatauang) AS terbilang, crd.matauang, crd.kurs FROM m2_cr cr JOIN m2_cr_detail crd ON cr.crid = crd.idcr JOIN m1_coa c ON crd.norek = c.cnomor WHERE (cr.crsumber = 'CR') ORDER BY cr.crtgl ASC, cr.crnotransaksi, crd.urutan;

-- RID=762 | MENU=3 | ITEM=4 | RQUERY=1 | NAME=Kas Masuk (CR) | FILE=CashReceiptdetailcb_new1
SELECT crd.urutan, c.ckodebank, c.cnomor, c.cnama, CASE LEFT(crd.jumlah,1) WHEN "-" THEN "D" ELSE "C" END AS cdc , c2.cnomor AS debit, c2.cnama AS debitnama, ct.knama, crd.norek, crd.jumlah AS kredit, cr.crnotransaksi, cr.crtgl, crd.catatan, f_nominal(cr.crjumlah,"IDR") AS terbilang, crd.matauang, crd.kurs , cr.cruraian, crd.costcenter, crd.divisi FROM m2_cr cr JOIN m2_cr_detail crd ON cr.crid = crd.idcr JOIN m1_coa c ON crd.norek = c.cnomor LEFT JOIN m1_coa c2 ON cr.crnorek = c2.cnomor JOIN m1_contact ct ON cr.crkontak = ct.kid WHERE (cr.crsumber = 'CR') ORDER BY cr.crtgl ASC, cr.crnotransaksi, crd.urutan;

-- RID=1622 | MENU=3 | ITEM=5 | RQUERY=1 | NAME=Daftar Kas Masuk (CR) | FILE=ListCashReceipt2
SELECT cr.crid, cr.crnotransaksi, cr.crtgl, cr.cruraian, k.knama, cr.crkodepa, cr.crkontakperson, crd.catatan, crd.kurs, crd.matauang, cr.crnorek, crd.norek AS norek, stat.nama AS statuscr, crd.divisi, crd.costcenter, crd.proyek, c.cnama AS namarekening, k.kkode, cr.crkontak, sum(crd.jumlahvalas) AS jmlvalas, sum(crd.jumlah) AS kredit FROM m2_cr cr JOIN m2_cr_detail crd ON cr.crid = crd.idcr JOIN m1_contact k ON cr.crkontak = k.kid JOIN m1_coa c ON crd.norek = c.cnomor JOIN m0_status stat ON cr.crstatus = stat.kode LEFT JOIN m1_division d ON crd.divisi = d.dkode LEFT JOIN m1_cost_center cc ON crd.costcenter = cc.cckode LEFT JOIN m1_project p ON crd.proyek = p.pkode WHERE (cr.crsumber = 'CR') GROUP BY crd.idcrdetail ORDER BY cr.crtgl ASC, cr.crnotransaksi, crd.urutan;

-- RID=6166 | MENU=3 | ITEM=6 | RQUERY=1 | NAME=Bukti Penerimaan | FILE=CashDisbursementsdetail_new_SIN
SELECT cr.crnotransaksi AS cdnotransaksi , cr.crtgl AS cdtgl , cr.crnorek AS cdnorek , coa1.cnama , k.knama , cr.crmatauang AS cdmatauang , cr.crjumlah AS cdjumlah , f_nominal(cr.crjumlah, cr.crmatauang) AS terbilang , crd.jumlah , crd.norek, coa2.cnama AS nama FROM m2_cr cr JOIN m2_cr_detail crd ON cr.crid = crd.idcr JOIN m1_coa coa1 ON cr.crnorek = coa1.cnomor JOIN m1_contact k ON cr.crkontak = k.kid JOIN m1_coa coa2 ON crd.norek = coa2.cnomor ORDER BY cr.crtgl , cr.crnotransaksi;

-- RID=11 | MENU=4 | ITEM=1 | RQUERY=1 | NAME=Daftar Kas Keluar (CD) | FILE=ListCashDisbursements
SELECT cd.cdnotransaksi, cd.cdtgl, cd.cduraian, k.knama, cd.cdkodepa, cd.cdkontakperson, cdd.catatan, cdd.kurs, cdd.matauang, cd.cdnorek, cdd.norek AS norek, st.nama AS setatus, cdd.divisi, cdd.costcenter, cdd.proyek, c.cnama AS namarekening, k.kkode, cd.cdkontak, sum(cdd.jumlahvalas) AS jmlvalas, sum(cdd.jumlah) AS kredit FROM m2_cd cd JOIN m2_cd_detail cdd ON cd.cdid = cdd.idcd JOIN m1_contact k ON cd.cdkontak = k.kid JOIN m1_coa c ON cdd.norek = c.cnomor JOIN m0_status st ON cd.cdstatus = st.kode LEFT JOIN m1_division d ON cdd.divisi = d.dkode LEFT JOIN m1_cost_center cc ON cdd.costcenter = cc.cckode LEFT JOIN m1_project p ON cdd.proyek = p.pkode WHERE (cd.cdsumber = 'CD') GROUP BY cdd.idcddetail ORDER BY cd.cdtgl ASC, cd.cdnotransaksi, cdd.urutan;

-- RID=12 | MENU=4 | ITEM=2 | RQUERY=1 | NAME=Kas Keluar (CD) | FILE=CashDisbursementsdetail_new
SELECT cdd.urutan, c.ckodebank, c.cnomor, c.cnama, CASE LEFT(cdd.jumlah,1) WHEN "-" THEN "C" ELSE "D" END AS cdc , c2.cnomor AS akunkredit, c2.cnama AS kreditnama, ct.knama, cdd.norek, cdd.jumlah AS kredit, cd.cdnotransaksi, cd.cdtgl, cdd.catatan, cdd.matauang, cdd.kurs, (SELECT f_nominal(Sum(cdd2.jumlah), "IDR") FROM m2_cd_detail cdd2 WHERE cdd.idcd = cdd2.idcd GROUP BY cdd2.idcd) as terbilang , cd.cduraian, cdd.costcenter , cdd.divisi FROM m2_cd cd JOIN m2_cd_detail cdd ON cd.cdid = cdd.idcd JOIN m1_coa c ON cdd.norek = c.cnomor LEFT JOIN m1_coa c2 ON cd.cdnorek = c2.cnomor JOIN m1_contact ct ON cd.cdkontak = ct.kid WHERE cd.cdsumber = 'CD' ORDER BY cd.cdtgl ASC,cd.cdnotransaksi, cdd.urutan;

-- RID=526 | MENU=4 | ITEM=3 | RQUERY=1 | NAME=Kas Keluar (CD) | FILE=CashDisbursementsdetail_ud
SELECT cdd.urutan, c.ckodebank, c.cnomor, c.cnama, cdd.norek, cdd.jumlah AS kredit, cd.cdnotransaksi, cd.cdtgl, cdd.catatan, cdd.matauang, cdd.kurs, (SELECT f_nominal(Sum(cdd2.jumlah), cdd2.matauang) FROM m2_cd_detail cdd2 WHERE cdd.idcd = cdd2.idcd GROUP BY cdd2.idcd) as terbilang FROM m2_cd cd JOIN m2_cd_detail cdd ON cd.cdid = cdd.idcd JOIN m1_coa c ON cdd.norek = c.cnomor WHERE cd.cdsumber = 'CD' ORDER BY cd.cdtgl ASC,cd.cdnotransaksi, cdd.urutan;

-- RID=763 | MENU=4 | ITEM=4 | RQUERY=1 | NAME=Kas Keluar (CD) | FILE=CashDisbursementsdetail_new2
SELECT cdd.urutan, c.ckodebank, c.cnomor, c.cnama, CASE LEFT(cdd.jumlah,1) WHEN "-" THEN "C" ELSE "D" END AS cdc , c2.cnomor AS akunkredit, c2.cnama AS kreditnama, ct.knama, cdd.norek, cdd.jumlah AS kredit, cd.cdnotransaksi, cd.cdtgl, cdd.catatan, cdd.matauang, cdd.kurs, (SELECT f_nominal(Sum(cdd2.jumlah), "IDR") FROM m2_cd_detail cdd2 WHERE cdd.idcd = cdd2.idcd GROUP BY cdd2.idcd) as terbilang , cd.cduraian, cdd.costcenter , cdd.divisi FROM m2_cd cd JOIN m2_cd_detail cdd ON cd.cdid = cdd.idcd JOIN m1_coa c ON cdd.norek = c.cnomor LEFT JOIN m1_coa c2 ON cd.cdnorek = c2.cnomor JOIN m1_contact ct ON cd.cdkontak = ct.kid WHERE cd.cdsumber = 'CD' ORDER BY cd.cdtgl ASC,cd.cdnotransaksi, cdd.urutan;

-- RID=1596 | MENU=4 | ITEM=5 | RQUERY=1 | NAME=Kas Keluar (CD) | FILE=CashDisbursementsdetail_new_2
SELECT cdd.urutan, c.ckodebank, c.cnomor, c.cnama, cdd.norek, cdd.jumlah AS kredit, cd.cdnotransaksi, cd.cdtgl, cdd.catatan, cdd.matauang, cdd.kurs, (SELECT f_nominal(Sum(cdd2.jumlah), cdd2.matauang) FROM m2_cd_detail cdd2 WHERE cdd.idcd = cdd2.idcd GROUP BY cdd2.idcd) as terbilang FROM m2_cd cd JOIN m2_cd_detail cdd ON cd.cdid = cdd.idcd JOIN m1_coa c ON cdd.norek = c.cnomor WHERE cd.cdsumber = 'CD' ORDER BY cd.cdtgl ASC,cd.cdnotransaksi, cdd.urutan;

-- RID=1623 | MENU=4 | ITEM=6 | RQUERY=1 | NAME=Daftar Kas Keluar (CD) | FILE=ListCashDisbursements2
SELECT cd.cdnotransaksi, cd.cdtgl, cd.cduraian, k.knama, cd.cdkodepa, cd.cdkontakperson, cdd.catatan, cdd.kurs, cdd.matauang, cd.cdnorek, cdd.norek AS norek, st.nama AS setatus, cdd.divisi, cdd.costcenter, cdd.proyek, c.cnama AS namarekening, k.kkode, cd.cdkontak, sum(cdd.jumlahvalas) AS jmlvalas, sum(cdd.jumlah) AS kredit FROM m2_cd cd JOIN m2_cd_detail cdd ON cd.cdid = cdd.idcd JOIN m1_contact k ON cd.cdkontak = k.kid JOIN m1_coa c ON cdd.norek = c.cnomor JOIN m0_status st ON cd.cdstatus = st.kode LEFT JOIN m1_division d ON cdd.divisi = d.dkode LEFT JOIN m1_cost_center cc ON cdd.costcenter = cc.cckode LEFT JOIN m1_project p ON cdd.proyek = p.pkode WHERE (cd.cdsumber = 'CD') GROUP BY cdd.idcddetail ORDER BY cd.cdtgl ASC, cd.cdnotransaksi, cdd.urutan;

-- RID=1754 | MENU=4 | ITEM=7 | RQUERY=1 | NAME=KAS BON | FILE=kaskeluar_kasbon
SELECT cd.cdtgl , cd.cdnotransaksi , cd.cduraian , cd.cdmatauang , cd.cdjumlah , f_nominal(cd.cdjumlah, cd.cdmatauang) AS terbilang , st.nama FROM m2_cd cd JOIN m0_status st ON cd.cdstatus = st.kode ORDER BY cd.cdtgl , cd.cdid;

-- RID=1755 | MENU=4 | ITEM=8 | RQUERY=1 | NAME=Bukti Pembayaran | FILE=kaskeluar_SIN
SELECT cd.cdnotransaksi , cd.cdtgl , cd.cdnorek , coa1.cnama , k.knama , cd.cdmatauang , cd.cdjumlah , f_nominal(cd.cdjumlah, cd.cdmatauang) AS terbilang , cdd.jumlah , cdd.norek, coa2.cnama AS nama FROM m2_cd cd JOIN m2_cd_detail cdd ON cd.cdid = cdd.idcd JOIN m1_coa coa1 ON cd.cdnorek = coa1.cnomor JOIN m1_contact k ON cd.cdkontak = k.kid JOIN m1_coa coa2 ON cdd.norek = coa2.cnomor ORDER BY cd.cdtgl , cd.cdnotransaksi;

-- RID=13 | MENU=5 | ITEM=1 | RQUERY=1 | NAME=Daftar Bank Masuk (RM) | FILE=ListReceiveMoney
SELECT rm.rmnotransaksi, rm.rmtgl, rm.rmuraian, k.knama, rm.rmkodepa, rm.rmkontakperson, rmd.catatan, rmd.kurs, rmd.matauang, rm.rmnorek, rmd.norek AS norek, st.nama AS statusrm, rmd.costcenter, rmd.proyek, c.cnama AS namarekening, k.kkode, rm.rmkontak, sum(rmd.jumlahvalas) AS jmlvalas, sum(rmd.jumlah) AS kredit FROM m2_rm rm JOIN m2_rm_detail rmd ON rm.rmid = rmd.idrm JOIN m1_contact k ON rm.rmkontak = k.kid JOIN m1_coa c ON rmd.norek = c.cnomor JOIN m0_status st ON rm.rmstatus = st.kode LEFT JOIN m1_division d ON rmd.divisi = d.dkode LEFT JOIN m1_cost_center cc ON rmd.costcenter = cc.cckode LEFT JOIN m1_project p ON rmd.proyek = p.pkode WHERE (rm.rmsumber = 'RM') GROUP BY rmd.idrmdetail ORDER BY rm.rmtgl ASC, rm.rmnotransaksi, rmd.urutan;

-- RID=14 | MENU=5 | ITEM=2 | RQUERY=1 | NAME=Bank Masuk (RM) | FILE=ReceiveMoneydetailcb_new
SELECT rm.rmuraian , c1.cnomor AS rmnorek , c1.cnama as rmnoreknama, k.knama, rmd.urutan, c.ckodebank, c.cnomor, c.cnama, CASE LEFT(rmd.jumlah,1) WHEN "-" THEN "D" ELSE "C" END AS cdc , rmd.norek, rmd.jumlah AS kredit, rmd.jumlahvalas AS kreditvalas, rm.rmnotransaksi, rm.rmtgl, rmd.catatan, rmd.matauang, rmd.kurs, (SELECT f_nominal(SUM(rmd2.jumlah), rm.rmmatauang) FROM m2_rm_detail rmd2 WHERE rmd.idrm = rmd2.idrm GROUP BY rmd2.idrm) as terbilang , rmd.costcenter, rmd.divisi FROM m2_rm rm JOIN m2_rm_detail rmd ON rm.rmid = rmd.idrm JOIN m1_coa c1 ON rm.rmnorek = c1.cnomor JOIN m1_coa c ON rmd.norek = c.cnomor LEFT JOIN m1_contact k ON rm.rmkontak = k.kid WHERE rm.rmsumber = 'RM' ORDER BY rm.rmtgl ASC, rm.rmnotransaksi, rmd.urutan;

-- RID=528 | MENU=5 | ITEM=3 | RQUERY=1 | NAME=Bank Masuk (RM) | FILE=ReceiveMoneydetailcb_ud
SELECT rmd.urutan, c.ckodebank, c.cnomor, c.cnama, rmd.norek, rmd.jumlah AS kredit, rmd.jumlahvalas AS kreditvalas, rm.rmnotransaksi, rm.rmtgl, rmd.catatan, rmd.matauang, rmd.kurs, (SELECT f_nominal(SUM(rmd2.jumlah), rm.rmmatauang) FROM m2_rm_detail rmd2 WHERE rmd.idrm = rmd2.idrm GROUP BY rmd2.idrm) as terbilang FROM m2_rm rm JOIN m2_rm_detail rmd ON rm.rmid = rmd.idrm JOIN m1_coa c ON rmd.norek = c.cnomor WHERE rm.rmsumber = 'RM' ORDER BY rm.rmtgl ASC, rm.rmnotransaksi, rmd.urutan;

-- RID=764 | MENU=5 | ITEM=4 | RQUERY=1 | NAME=Bank Masuk (RM) | FILE=ReceiveMoneydetailcb_new1
SELECT rm.rmuraian , c1.cnomor AS rmnorek , c1.cnama as rmnoreknama, k.knama, rmd.urutan, c.ckodebank, c.cnomor, c.cnama, CASE LEFT(rmd.jumlah,1) WHEN "-" THEN "D" ELSE "C" END AS cdc , rmd.norek, rmd.jumlah AS kredit, rmd.jumlahvalas AS kreditvalas, rm.rmnotransaksi, rm.rmtgl, rmd.catatan, rmd.matauang, rmd.kurs, (SELECT f_nominal(SUM(rmd2.jumlah), rm.rmmatauang) FROM m2_rm_detail rmd2 WHERE rmd.idrm = rmd2.idrm GROUP BY rmd2.idrm) as terbilang , rmd.costcenter, rmd.divisi FROM m2_rm rm JOIN m2_rm_detail rmd ON rm.rmid = rmd.idrm JOIN m1_coa c1 ON rm.rmnorek = c1.cnomor JOIN m1_coa c ON rmd.norek = c.cnomor LEFT JOIN m1_contact k ON rm.rmkontak = k.kid WHERE rm.rmsumber = 'RM' ORDER BY rm.rmtgl ASC, rm.rmnotransaksi, rmd.urutan;

-- RID=1547 | MENU=5 | ITEM=5 | RQUERY=1 | NAME=Bukti Penerimaan | FILE=bankmasuk_SIN
SELECT rm.rmnotransaksi AS cdnotransaksi , rm.rmtgl AS cdtgl , rm.rmnorek AS cdnorek , coa1.cnama , k.knama , rm.rmmatauang AS cdmatauang , rm.rmjumlah AS cdjumlah , f_nominal(rm.rmjumlah, rm.rmmatauang) AS terbilang , rmd.jumlah , rmd.norek, coa2.cnama AS nama FROM m2_rm rm JOIN m2_rm_detail rmd ON rm.rmid = rmd.idrm JOIN m1_coa coa1 ON rm.rmnorek = coa1.cnomor JOIN m1_contact k ON rm.rmkontak = k.kid JOIN m1_coa coa2 ON rmd.norek = coa2.cnomor ORDER BY rm.rmtgl , rm.rmnotransaksi;

-- RID=1624 | MENU=5 | ITEM=6 | RQUERY=1 | NAME=Daftar Bank Masuk (RM) | FILE=ListReceiveMoney2
SELECT rm.rmnotransaksi, rm.rmtgl, rm.rmuraian, k.knama, rm.rmkodepa, rm.rmkontakperson, rmd.catatan, rmd.kurs, rmd.matauang, rm.rmnorek, rmd.norek AS norek, st.nama AS statusrm, rmd.costcenter, rmd.proyek, c.cnama AS namarekening, k.kkode, rm.rmkontak, sum(rmd.jumlahvalas) AS jmlvalas, sum(rmd.jumlah) AS kredit FROM m2_rm rm JOIN m2_rm_detail rmd ON rm.rmid = rmd.idrm JOIN m1_contact k ON rm.rmkontak = k.kid JOIN m1_coa c ON rmd.norek = c.cnomor JOIN m0_status st ON rm.rmstatus = st.kode LEFT JOIN m1_division d ON rmd.divisi = d.dkode LEFT JOIN m1_cost_center cc ON rmd.costcenter = cc.cckode LEFT JOIN m1_project p ON rmd.proyek = p.pkode WHERE (rm.rmsumber = 'RM') GROUP BY rmd.idrmdetail ORDER BY rm.rmtgl ASC, rm.rmnotransaksi, rmd.urutan;

-- RID=15 | MENU=6 | ITEM=1 | RQUERY=1 | NAME=Daftar Bank Keluar (SM) | FILE=ListSpendMoney
SELECT sm.smid, sm.smnotransaksi, sm.smtgl, sm.smuraian, k.knama, sm.smkodepa, sm.smkontakperson, smd.catatan, smd.kurs, smd.matauang, sm.smnorek, smd.norek AS norek, st.nama AS statussm, smd.divisi, smd.costcenter, smd.proyek, c.cnama AS namarekening, k.kkode, sm.smkontak, sum(smd.jumlahvalas) AS jmlvalas, sum(smd.jumlah) AS kredit FROM m2_sm sm JOIN m2_sm_detail smd ON sm.smid = smd.idsm JOIN m1_contact k ON sm.smkontak = k.kid JOIN m1_coa c ON smd.norek = c.cnomor JOIN m0_status st ON sm.smstatus = st.kode LEFT JOIN m1_division d ON smd.divisi = d.dkode LEFT JOIN m1_cost_center cc ON smd.costcenter = cc.cckode LEFT JOIN m1_project p ON smd.proyek = p.pkode WHERE (sm.smsumber = 'SM') GROUP BY smd.idsmdetail ORDER BY sm.smtgl ASC,sm.smnotransaksi, smd.urutan;

-- RID=16 | MENU=6 | ITEM=2 | RQUERY=1 | NAME=Bank Keluar (SM) | FILE=SpendMoneydetailcb_new
SELECT smd.urutan, c.ckodebank, c.cnomor, c.cnama, sm.smnorek, smd.norek, sm.smjumlah AS debit, sm.smjumlahvalas AS debitvalas, smd.jumlah AS debit2, smd.jumlahvalas AS debitvalas2, sm.smnotransaksi, smd.catatan, smd.matauang, smd.kurs, sm.smtgl, sm.smid, f_nominal(sm.smjumlah, ss.snilai ) AS terbilang, sm.smuraian , (SELECT CONCAT(cs.cnomor,"/",cs.cnama) FROM m1_coa cs JOIN m2_sm smm ON cs.cnomor = smm.smnorek WHERE smm.smsumber = 'SM' AND smm.smnotransaksi = sm.smnotransaksi ORDER BY smm.smjumlah ASC Limit 1) AS a , k.kkode , k.knama , CASE LEFT(smd.jumlah,1) WHEN "-" THEN "C" ELSE "D" END AS cdc , ss.snilai AS skode , smd.costcenter, smd.divisi FROM m2_sm sm JOIN m2_sm_detail smd ON sm.smid = smd.idsm JOIN m1_coa c ON smd.norek = c.cnomor JOIN m1_contact k ON sm.smkontak = k.kid JOIN m0_setting ss ON ss.skode = "MataUangFungsional" WHERE sm.smsumber = 'SM' ORDER BY sm.smnotransaksi, smd.urutan;

-- RID=530 | MENU=6 | ITEM=3 | RQUERY=1 | NAME=Bank Keluar (SM) | FILE=SpendMoneydetailcb_ud
SELECT smd.urutan, c.ckodebank, c.cnomor, c.cnama, sm.smnorek, smd.norek, sm.smjumlah AS debit, sm.smjumlahvalas AS debitvalas, smd.jumlah AS debit2, smd.jumlahvalas AS debitvalas2, sm.smnotransaksi, smd.catatan, smd.matauang, smd.kurs, sm.smtgl, sm.smid, f_nominal(sm.smjumlah, sm.smmatauang) AS terbilang, (SELECT cs.cnama FROM m1_coa cs JOIN m2_sm smm ON cs.cnomor = smm.smnorek WHERE smm.smsumber = 'SM' AND smm.smnotransaksi = sm.smnotransaksi ORDER BY smm.smjumlah ASC Limit 1) AS a FROM m2_sm sm JOIN m2_sm_detail smd ON sm.smid = smd.idsm JOIN m1_coa c ON smd.norek = c.cnomor WHERE sm.smsumber = 'SM' ORDER BY sm.smnotransaksi, smd.urutan;

-- RID=765 | MENU=6 | ITEM=4 | RQUERY=1 | NAME=Bank Keluar (SM) | FILE=SpendMoneydetailcb_new1
SELECT smd.urutan, c.ckodebank, c.cnomor, c.cnama, sm.smnorek, smd.norek, sm.smjumlah AS debit, sm.smjumlahvalas AS debitvalas, smd.jumlah AS debit2, smd.jumlahvalas AS debitvalas2, sm.smnotransaksi, smd.catatan, smd.matauang, smd.kurs, sm.smtgl, sm.smid, f_nominal(sm.smjumlah, ss.snilai ) AS terbilang, sm.smuraian , (SELECT CONCAT(cs.cnomor,"/",cs.cnama) FROM m1_coa cs JOIN m2_sm smm ON cs.cnomor = smm.smnorek WHERE smm.smsumber = 'SM' AND smm.smnotransaksi = sm.smnotransaksi ORDER BY smm.smjumlah ASC Limit 1) AS a , k.kkode , k.knama , CASE LEFT(smd.jumlah,1) WHEN "-" THEN "C" ELSE "D" END AS cdc , ss.snilai AS skode , smd.costcenter, smd.divisi FROM m2_sm sm JOIN m2_sm_detail smd ON sm.smid = smd.idsm JOIN m1_coa c ON smd.norek = c.cnomor JOIN m1_contact k ON sm.smkontak = k.kid JOIN m0_setting ss ON ss.skode = "MataUangFungsional" WHERE sm.smsumber = 'SM' ORDER BY sm.smnotransaksi, smd.urutan;

-- RID=1625 | MENU=6 | ITEM=5 | RQUERY=1 | NAME=Daftar Bank Keluar (SM) | FILE=ListSpendMoney2
SELECT sm.smid, sm.smnotransaksi, sm.smtgl, sm.smuraian, k.knama, sm.smkodepa, sm.smkontakperson, smd.catatan, smd.kurs, smd.matauang, sm.smnorek, smd.norek AS norek, st.nama AS statussm, smd.divisi, smd.costcenter, smd.proyek, c.cnama AS namarekening, k.kkode, sm.smkontak, sum(smd.jumlahvalas) AS jmlvalas, sum(smd.jumlah) AS kredit FROM m2_sm sm JOIN m2_sm_detail smd ON sm.smid = smd.idsm JOIN m1_contact k ON sm.smkontak = k.kid JOIN m1_coa c ON smd.norek = c.cnomor JOIN m0_status st ON sm.smstatus = st.kode LEFT JOIN m1_division d ON smd.divisi = d.dkode LEFT JOIN m1_cost_center cc ON smd.costcenter = cc.cckode LEFT JOIN m1_project p ON smd.proyek = p.pkode WHERE (sm.smsumber = 'SM') GROUP BY smd.idsmdetail ORDER BY sm.smtgl ASC,sm.smnotransaksi, smd.urutan;

-- RID=632 | MENU=6 | ITEM=6 | RQUERY=1 | NAME=Bukti Pembayaran | FILE=bankkeluar_SIN
SELECT sm.smnotransaksi AS cdnotransaksi , sm.smtgl AS cdtgl , sm.smnorek AS cdnorek , coa1.cnama , k.knama , sm.smmatauang AS cdmatauang , sm.smjumlah AS cdjumlah , f_nominal(sm.smjumlah, sm.smmatauang) AS terbilang , smd.jumlah , smd.norek, coa2.cnama AS nama FROM m2_sm sm JOIN m2_sm_detail smd ON sm.smid = smd.idsm JOIN m1_coa coa1 ON sm.smnorek = coa1.cnomor JOIN m1_contact k ON sm.smkontak = k.kid JOIN m1_coa coa2 ON smd.norek = coa2.cnomor ORDER BY sm.smtgl , sm.smnotransaksi;

-- RID=17 | MENU=7 | ITEM=1 | RQUERY=1 | NAME=Daftar Jurnal Umum (GJ) | FILE=ListGeneralJournal
SELECT gj.gjnotransaksi, gj.gjtgl, gj.gjuraian, kk.knama, kk.kkode, gjd.norek, c.cnama, gjd.matauang, gjd.kurs, gjd.debit, gjd.debitvalas, gjd.kredit, gjd.kreditvalas FROM m2_gj gj JOIN m2_gj_detail gjd ON gj.gjid = gjd.idgj JOIN m1_contact kk ON gj.gjkontak = kk.kid JOIN m1_coa c ON gjd.norek = c.cnomor ORDER BY gj.gjtgl , gj.gjnotransaksi, gjd.urutan ,c.cnama, gjd.matauang;

-- RID=18 | MENU=7 | ITEM=2 | RQUERY=1 | NAME=Jurnal Umum (GJ) | FILE=GeneralJournaldetail
SELECT gj.gjnotransaksi, gj.gjtgl, gj.gjuraian, kk.kkode , kk.knama, gjd.norek, c.cnama, gj.gjmatauang, gj.gjkurs, gjd.debit, gjd.debitvalas, gjd.kredit, gjd.kreditvalas, gjd.urutan , gjd.catatan, gjd.costcenter, gjd.divisi FROM m2_gj gj JOIN m2_gj_detail gjd ON gj.gjid = gjd.idgj JOIN m1_contact kk ON gj.gjkontak = kk.kid LEFT JOIN m1_coa c ON gjd.norek = c.cnomor ORDER BY gj.gjtgl , gj.gjnotransaksi, gjd.urutan ,c.cnama, gjd.matauang;

-- RID=535 | MENU=7 | ITEM=3 | RQUERY=1 | NAME=Jurnal Umum (GJ) | FILE=GeneralJournaldetail_ud
SELECT gj.gjnotransaksi, gj.gjtgl, gj.gjuraian, kk.knama, gjd.norek, c.cnama, gj.gjmatauang, gj.gjkurs, gjd.debit, gjd.debitvalas, gjd.kredit, gjd.kreditvalas, gjd.urutan FROM m2_gj gj JOIN m2_gj_detail gjd ON gj.gjid = gjd.idgj JOIN m1_contact kk ON gj.gjkontak = kk.kid JOIN m1_coa c ON gjd.norek = c.cnomor ORDER BY gj.gjnotransaksi, gjd.urutan ,c.cnama, gjd.matauang;

-- RID=766 | MENU=7 | ITEM=4 | RQUERY=1 | NAME=Jurnal Umum (GJ) | FILE=GeneralJournaldetail1
SELECT gj.gjnotransaksi, gj.gjtgl, gj.gjuraian, kk.kkode , kk.knama, gjd.norek, c.cnama, gj.gjmatauang, gj.gjkurs, gjd.debit, gjd.debitvalas, gjd.kredit, gjd.kreditvalas, gjd.urutan , gjd.catatan, gjd.costcenter, gjd.divisi FROM m2_gj gj JOIN m2_gj_detail gjd ON gj.gjid = gjd.idgj JOIN m1_contact kk ON gj.gjkontak = kk.kid LEFT JOIN m1_coa c ON gjd.norek = c.cnomor ORDER BY gj.gjtgl , gj.gjnotransaksi, gjd.urutan ,c.cnama, gjd.matauang;

-- RID=1626 | MENU=7 | ITEM=5 | RQUERY=1 | NAME=Daftar Jurnal Umum (GJ)  | FILE=ListGeneralJournal2
SELECT gj.gjnotransaksi, gj.gjtgl, gj.gjuraian, kk.knama, kk.kkode, gjd.norek, c.cnama, gjd.matauang, gjd.kurs, gjd.debit, gjd.debitvalas, gjd.kredit, gjd.kreditvalas FROM m2_gj gj JOIN m2_gj_detail gjd ON gj.gjid = gjd.idgj JOIN m1_contact kk ON gj.gjkontak = kk.kid JOIN m1_coa c ON gjd.norek = c.cnomor ORDER BY gj.gjtgl , gj.gjnotransaksi, gjd.urutan ,c.cnama, gjd.matauang;

-- RID=19 | MENU=8 | ITEM=1 | RQUERY=1 | NAME=Daftar Jurnal Penyesuaian (AJ) | FILE=ListAdjustmentJournal
SELECT aj.ajnotransaksi, aj.ajtgl, ajd.matauang, ajd.kurs, aj.ajuraian, kk.knama, c.cnama, ajd.debit, ajd.kredit, ajd.kreditvalas, ajd.debitvalas, ajd.norek FROM m2_aj aj JOIN m2_aj_detail ajd ON aj.ajid = ajd.idaj JOIN m1_contact kk ON aj.ajkontak = kk.kid JOIN m1_coa c ON ajd.norek = c.cnomor ORDER BY aj.ajnotransaksi, ajd.urutan, c.cnama;

-- RID=20 | MENU=8 | ITEM=2 | RQUERY=1 | NAME=Jurnal Penyesuaian (AJ) | FILE=AdjustmentJournaldetail
SELECT aj.ajnotransaksi, aj.ajtgl, ajd.matauang, aj.ajuraian, kk.knama, c.cnama, ajd.debit, ajd.kredit, ajd.kreditvalas, ajd.debitvalas, ajd.norek FROM m2_aj aj JOIN m2_aj_detail ajd ON aj.ajid = ajd.idaj JOIN m1_contact kk ON aj.ajkontak = kk.kid JOIN m1_coa c ON ajd.norek = c.cnomor ORDER BY aj.ajnotransaksi, ajd.urutan, c.cnama;

-- RID=537 | MENU=8 | ITEM=3 | RQUERY=1 | NAME=Jurnal Penyesuaian (AJ) | FILE=AdjustmentJournaldetail_ud
SELECT aj.ajnotransaksi, aj.ajtgl, ajd.matauang, aj.ajuraian, kk.knama, c.cnama, ajd.debit, ajd.kredit, ajd.kreditvalas, ajd.debitvalas, ajd.norek FROM m2_aj aj JOIN m2_aj_detail ajd ON aj.ajid = ajd.idaj JOIN m1_contact kk ON aj.ajkontak = kk.kid JOIN m1_coa c ON ajd.norek = c.cnomor ORDER BY aj.ajnotransaksi, ajd.urutan, c.cnama;

-- RID=767 | MENU=8 | ITEM=4 | RQUERY=1 | NAME=Jurnal Penyesuaian (AJ) | FILE=AdjustmentJournaldetail2
SELECT aj.ajnotransaksi, aj.ajtgl, ajd.matauang, aj.ajuraian, kk.knama, c.cnama, ajd.debit, ajd.kredit, ajd.kreditvalas, ajd.debitvalas, ajd.norek FROM m2_aj aj JOIN m2_aj_detail ajd ON aj.ajid = ajd.idaj JOIN m1_contact kk ON aj.ajkontak = kk.kid JOIN m1_coa c ON ajd.norek = c.cnomor ORDER BY aj.ajnotransaksi, ajd.urutan, c.cnama;

-- RID=21 | MENU=9 | ITEM=1 | RQUERY=1 | NAME=Daftar Giro Masuk (RG) | FILE=receivegirolist
SELECT rg.rgcatatan, rg.rgtgl, rg.rguraian, rg.rgnotransaksi, rg.rgmatauang, rg.rgkurs, rgd.nogiro, rgd.noacbank, rgd.bank, rgd.tgljatuhtempo, rgd.jumlah, c.cnama, c.cnomor, st.nama AS statusrg FROM m2_rg rg JOIN m2_rg_detail rgd ON rg.rgid = rgd.idrg JOIN m0_status st ON rg.rgstatus = st.kode JOIN m1_coa c ON rgd.rekbank = c.cnomor ORDER BY rgd.bank, rgd.nogiro , rg.rgnotransaksi, rgd.urutan;

-- RID=22 | MENU=9 | ITEM=2 | RQUERY=1 | NAME=Giro Masuk (RG) | FILE=receivegirodetail1
SELECT SUM(rgd.jumlah) AS jumlah, rg.rgcatatan, rg.rgnotransaksi, rg.rgtgl, rgd.nogiro, bnk.bnama, rgd.tgljatuhtempo, c.cnomor, c.cnama, rgd.noacbank, st.nama AS statusrg FROM m2_rg rg JOIN m2_rg_detail rgd ON rg.rgid = rgd.idrg JOIN m1_coa c ON rgd.rekbank = c.cnomor JOIN m0_status st ON rg.rgstatus = st.kode LEFT JOIN m1_bank bnk ON rgd.bank = bnk.bkode GROUP BY rgd.bank, rgd.nogiro ORDER BY rgd.urutan, rg.rgnotransaksi, rgd.bank;

-- RID=539 | MENU=9 | ITEM=3 | RQUERY=1 | NAME=Giro Masuk (RG) | FILE=receivegirodetail1_ud
SELECT SUM(rgd.jumlah) AS jumlah, rg.rgcatatan, rg.rgnotransaksi, rg.rgtgl, rgd.nogiro, bnk.bnama, rgd.tgljatuhtempo, c.cnomor, c.cnama, rgd.noacbank, st.nama AS statusrg FROM m2_rg rg JOIN m2_rg_detail rgd ON rg.rgid = rgd.idrg JOIN m1_coa c ON rgd.rekbank = c.cnomor JOIN m0_status st ON rg.rgstatus = st.kode LEFT JOIN m1_bank bnk ON rgd.bank = bnk.bkode GROUP BY rgd.bank, rgd.nogiro ORDER BY rgd.urutan, rg.rgnotransaksi, rgd.bank;

-- RID=442 | MENU=9 | ITEM=4 | RQUERY=1 | NAME=Daftar Giro Masuk | FILE=daftargiromasuk
SELECT gl.glnogiro, gl.glsumber, gl.glidtransaksi, gl.glnotransaksi, gl.glkontak, c1.kkode as glkontakode, c1.knama as glkontaknama, gl.glrekbank, coa1.cnama as glrekbanknama, gl.glrekgiro, coa2.cnama as glrekgironama, gl.gljenis, gl.glbank, gl.glnoacbank, gl.glmatauang, gl.glkurs, gl.gljumlah, gl.gljumlahvalas, gl.gltgljthtempo, gl.gltglcair, gl.glstatus, sg.nama as glstatusnama, gl.glstatussebelumnya, gl.glurutan FROM m2_giro_list gl JOIN m1_contact c1 ON gl.glkontak = c1.kid JOIN m0_status_giro sg ON gl.glstatus = sg.kode LEFT JOIN m1_coa coa1 ON gl.glrekbank = coa1.cnomor LEFT JOIN m1_coa coa2 ON gl.glrekgiro = coa2.cnomor LEFT JOIN m1_bank b ON gl.glbank = b.bkode WHERE gl.gljenis = 0 GROUP BY gl.glnogiro;

-- RID=768 | MENU=9 | ITEM=5 | RQUERY=1 | NAME=Giro Masuk (RG) | FILE=receivegirodetail2
SELECT SUM(rgd.jumlah) AS jumlah, rg.rgcatatan, rg.rgnotransaksi, rg.rgtgl, rgd.nogiro, bnk.bnama, rgd.tgljatuhtempo, c.cnomor, c.cnama, rgd.noacbank, st.nama AS statusrg FROM m2_rg rg JOIN m2_rg_detail rgd ON rg.rgid = rgd.idrg JOIN m1_coa c ON rgd.rekbank = c.cnomor JOIN m0_status st ON rg.rgstatus = st.kode LEFT JOIN m1_bank bnk ON rgd.bank = bnk.bkode GROUP BY rgd.bank, rgd.nogiro ORDER BY rgd.urutan, rg.rgnotransaksi, rgd.bank;

-- RID=1627 | MENU=9 | ITEM=6 | RQUERY=1 | NAME=Daftar Giro Masuk (RG) | FILE=receivegirolist2
SELECT rg.rgcatatan, rg.rgtgl, rg.rguraian, rg.rgnotransaksi, rg.rgmatauang, rg.rgkurs, rgd.nogiro, rgd.noacbank, rgd.bank, rgd.tgljatuhtempo, rgd.jumlah, c.cnama, c.cnomor, st.nama AS statusrg FROM m2_rg rg JOIN m2_rg_detail rgd ON rg.rgid = rgd.idrg JOIN m0_status st ON rg.rgstatus = st.kode JOIN m1_coa c ON rgd.rekbank = c.cnomor ORDER BY rgd.bank, rgd.nogiro , rg.rgnotransaksi, rgd.urutan;

-- RID=862 | MENU=9 | ITEM=7 | RQUERY=1 | NAME=Data Giro Masuk | FILE=datagiromasuk
SELECT gl.glnogiro, gl.glmatauang, gl.glkurs, gl.gljumlah, gl.gljumlahvalas, gl.gltgljthtempo, gl.glbank, k.knama, c.cnomor, c.cnama, sg.nama AS status, gl.glnotransaksi, gl.glsumber , gl.gljenis, tj.ttgl, tj.tnotransaksi AS notransaksi, tj.tnotransaksi, tj.ttgl AS gltgltransaksi FROM m2_giro_list gl JOIN m2_transaction_journal tj ON gl.glsumber = tj.tsumber AND gl.glidtransaksi = tj.tidtransaksi JOIN m1_contact k ON gl.glkontak = k.kid JOIN m1_coa c ON glrekbank = c.cnomor JOIN m0_status_giro sg ON gl.glstatus = sg.kode GROUP BY gl.glnogiro ORDER BY gl.glnogiro;

-- RID=708 | MENU=9 | ITEM=8 | RQUERY=2 | NAME=Umur Giro Masuk (Global) | FILE=analisaumurgiromasuk
SELECT * FROM m2r_giro_voucher_aging ORDER BY glnourut ASC;

-- RID=709 | MENU=9 | ITEM=9 | RQUERY=2 | NAME=Umur Giro Masuk (Detail) | FILE=analisaumurgiromasukdetail
SELECT * FROM m2r_giro_voucher_aging ORDER BY glnourut ASC;

-- RID=706 | MENU=9 | ITEM=10 | RQUERY=2 | NAME=Giro Masuk (Pertanggal) | FILE=giromasukpertanggal
SELECT * FROM m2r_giro_voucher ORDER BY glnourut ASC;

-- RID=137 | MENU=10 | ITEM=1 | RQUERY=1 | NAME=Daftar Giro Keluar (SG) | FILE=spendgirolist
SELECT sg.sgcatatan, sg.sgtgl, sgd.nogiro, sgd.bank, sgd.tgljatuhtempo, sgd.matauang, sgd.kurs, sgd.jumlah, sgd.noacbank, c.cnama, c.cnomor FROM m2_sg sg JOIN m2_sg_detail sgd ON sg.sgid = sgd.idsg JOIN m1_coa c ON sgd.rekbank = c.cnomor ORDER BY sgd.bank, sgd.nogiro;

-- RID=138 | MENU=10 | ITEM=2 | RQUERY=1 | NAME=Giro Keluar (SG) | FILE=spendgirodetail1
SELECT SUM(sgd.jumlah) AS jumlah, sg.sgcatatan, sg.sgnotransaksi, sg.sgtgl, sgd.nogiro, bnk.bnama, sgd.tgljatuhtempo, st.nama AS statussg, sgd.noacbank, c.cnomor, c.cnama FROM m2_sg sg JOIN m2_sg_detail sgd ON sg.sgid = sgd.idsg JOIN m1_coa c ON sgd.rekbank = c.cnomor JOIN m0_status st ON sg.sgstatus = st.kode LEFT JOIN m1_bank bnk ON sgd.bank = bnk.bkode GROUP BY sgd.bank, sgd.nogiro ORDER BY sgd.bank, sg.sgnotransaksi, sgd.urutan, sgd.urutan;

-- RID=541 | MENU=10 | ITEM=3 | RQUERY=1 | NAME=Giro Keluar (SG) | FILE=spendgirodetail1_ud
SELECT SUM(sgd.jumlah) AS jumlah, sg.sgcatatan, sg.sgnotransaksi, sg.sgtgl, sgd.nogiro, bnk.bnama, sgd.tgljatuhtempo, st.nama AS statussg, sgd.noacbank, c.cnomor, c.cnama FROM m2_sg sg JOIN m2_sg_detail sgd ON sg.sgid = sgd.idsg JOIN m1_coa c ON sgd.rekbank = c.cnomor JOIN m0_status st ON sg.sgstatus = st.kode LEFT JOIN m1_bank bnk ON sgd.bank = bnk.bkode GROUP BY sgd.bank, sgd.nogiro ORDER BY sgd.bank, sg.sgnotransaksi, sgd.urutan, sgd.urutan;

-- RID=443 | MENU=10 | ITEM=4 | RQUERY=1 | NAME=Daftar Giro Keluar | FILE=daftargirokeluar
SELECT gl.glnogiro, gl.glsumber, gl.glidtransaksi, gl.glnotransaksi, gl.glkontak, c1.kkode as glkontakode, c1.knama as glkontaknama, gl.glrekbank, coa1.cnama as glrekbanknama, gl.glrekgiro, coa2.cnama as glrekgironama, gl.gljenis, gl.glbank, gl.glnoacbank, gl.glmatauang, gl.glkurs, gl.gljumlah, gl.gljumlahvalas, gl.gltgljthtempo, gl.gltglcair, gl.glstatus, sg.nama as glstatusnama, gl.glstatussebelumnya, gl.glurutan FROM m2_giro_list gl JOIN m1_contact c1 ON gl.glkontak = c1.kid JOIN m0_status_giro sg ON gl.glstatus = sg.kode LEFT JOIN m2_transaction_journal t ON gl.glnotransaksi = t.tnotransaksi LEFT JOIN m1_coa coa1 ON gl.glrekbank = coa1.cnomor LEFT JOIN m1_coa coa2 ON gl.glrekgiro = coa2.cnomor LEFT JOIN m1_bank b ON gl.glbank = b.bkode WHERE gl.gljenis = 1 GROUP BY gl.glnogiro;

-- RID=769 | MENU=10 | ITEM=5 | RQUERY=1 | NAME=Giro Keluar (SG) | FILE=spendgirodetail2
SELECT SUM(sgd.jumlah) AS jumlah, sg.sgcatatan, sg.sgnotransaksi, sg.sgtgl, sgd.nogiro, bnk.bnama, sgd.tgljatuhtempo, st.nama AS statussg, sgd.noacbank, c.cnomor, c.cnama FROM m2_sg sg JOIN m2_sg_detail sgd ON sg.sgid = sgd.idsg JOIN m1_coa c ON sgd.rekbank = c.cnomor JOIN m0_status st ON sg.sgstatus = st.kode LEFT JOIN m1_bank bnk ON sgd.bank = bnk.bkode GROUP BY sgd.bank, sgd.nogiro ORDER BY sgd.bank, sg.sgnotransaksi, sgd.urutan, sgd.urutan;

-- RID=1628 | MENU=10 | ITEM=6 | RQUERY=1 | NAME=Daftar Giro Keluar (SG) | FILE=spendgirolist2
SELECT sg.sgcatatan, sg.sgtgl, sgd.nogiro, sgd.bank, sgd.tgljatuhtempo, sgd.matauang, sgd.kurs, sgd.jumlah, sgd.noacbank, c.cnama, c.cnomor FROM m2_sg sg JOIN m2_sg_detail sgd ON sg.sgid = sgd.idsg JOIN m1_coa c ON sgd.rekbank = c.cnomor ORDER BY sgd.bank, sgd.nogiro;

-- RID=707 | MENU=10 | ITEM=7 | RQUERY=2 | NAME=Giro Keluar (Pertanggal) | FILE=girokeluarpertanggal
SELECT * FROM m2r_giro_voucher ORDER BY glnourut ASC;

-- RID=1673 | MENU=10 | ITEM=8 | RQUERY=1 | NAME=Data Giro Keluar | FILE=datagirokeluar
SELECT gl.glnogiro, gl.glmatauang, gl.glkurs, gl.gljumlah, gl.gljumlahvalas, gl.gltgljthtempo, gl.glbank, k.knama, c.cnomor, c.cnama, sg.nama AS status, gl.glnotransaksi, gl.glsumber , gl.gljenis, tj.ttgl, tj.tnotransaksi AS notransaksi, tj.tnotransaksi, tj.ttgl AS gltgltransaksi FROM m2_giro_list gl JOIN m2_transaction_journal tj ON gl.glsumber = tj.tsumber AND gl.glidtransaksi = tj.tidtransaksi JOIN m1_contact k ON gl.glkontak = k.kid JOIN m1_coa c ON glrekbank = c.cnomor JOIN m0_status_giro sg ON gl.glstatus = sg.kode GROUP BY gl.glnogiro ORDER BY gl.glnogiro;

-- RID=710 | MENU=10 | ITEM=9 | RQUERY=2 | NAME=Umur Giro Keluar (Global) | FILE=analisaumurgirokeluar
SELECT * FROM m2r_giro_voucher_aging ORDER BY glnourut ASC;

-- RID=711 | MENU=10 | ITEM=10 | RQUERY=2 | NAME=Umur Giro Keluar (Detail) | FILE=analisaumurgirokeluardetail
SELECT * FROM m2r_giro_voucher_aging ORDER BY glnourut ASC;

-- RID=190 | MENU=11 | ITEM=1 | RQUERY=1 | NAME=Daftar Giro Masuk Batal (RGC) | FILE=receivegirocancellist
SELECT SUM(rgcd.jumlah) AS jumlah , rgc.rgccatatan, rgc.rgcnotransaksi, rgc.rgctgl, rgcd.nogiro, bank.bnama, rgcd.tgljatuhtempo, rgcd.matauang, rgcd.bank, c.cnomor, rgcd.noacbank, c.cnama FROM m2_rgc rgc JOIN m2_rgc_detail rgcd ON rgc.rgcid = rgcd.idrgc JOIN m1_bank bank ON rgcd.bank = bank.bkode JOIN m1_coa c ON rgcd.rekbank = c.cnomor GROUP BY rgcd.bank, rgcd.nogiro ORDER BY rgcd.bank , rgcd.urutan;

-- RID=191 | MENU=11 | ITEM=2 | RQUERY=1 | NAME=Giro Masuk Batal (RGC) | FILE=receivegirocanceldetail1
SELECT SUM(rgcd.jumlah) AS jumlah, rgc.rgccatatan , rgc.rgcnotransaksi , rgc.rgctgl, rgcd.nogiro, bank.bnama, rgcd.bank, rgcd.tgljatuhtempo, rgcd.matauang, st.nama AS statusrgc, c.cnomor, c.cnama, rgcd.noacbank FROM m2_rgc rgc JOIN m2_rgc_detail rgcd ON rgc.rgcid = rgcd.idrgc JOIN m1_bank bank ON rgcd.bank = bank.bkode JOIN m0_status st ON rgc.rgcstatus = st.kode JOIN m1_coa c ON rgcd.rekbank = c.cnomor GROUP BY rgcd.bank , rgcd.nogiro ORDER BY rgcd.bank , rgcd.urutan;

-- RID=543 | MENU=11 | ITEM=3 | RQUERY=1 | NAME=Giro Masuk Batal (RGC) | FILE=receivegirocanceldetail1_ud
SELECT SUM(rgcd.jumlah) AS jumlah, rgc.rgccatatan , rgc.rgcnotransaksi , rgc.rgctgl, rgcd.nogiro, bank.bnama, rgcd.bank, rgcd.tgljatuhtempo, rgcd.matauang, st.nama AS statusrgc, c.cnomor, c.cnama, rgcd.noacbank FROM m2_rgc rgc JOIN m2_rgc_detail rgcd ON rgc.rgcid = rgcd.idrgc JOIN m1_bank bank ON rgcd.bank = bank.bkode JOIN m0_status st ON rgc.rgcstatus = st.kode JOIN m1_coa c ON rgcd.rekbank = c.cnomor GROUP BY rgcd.bank , rgcd.nogiro ORDER BY rgcd.bank , rgcd.urutan;

-- RID=770 | MENU=11 | ITEM=4 | RQUERY=1 | NAME=Giro Masuk Batal (RGC) | FILE=receivegirocanceldetail1
SELECT SUM(rgcd.jumlah) AS jumlah, rgc.rgccatatan , rgc.rgcnotransaksi , rgc.rgctgl, rgcd.nogiro, bank.bnama, rgcd.bank, rgcd.tgljatuhtempo, rgcd.matauang, st.nama AS statusrgc, c.cnomor, c.cnama, rgcd.noacbank FROM m2_rgc rgc JOIN m2_rgc_detail rgcd ON rgc.rgcid = rgcd.idrgc JOIN m1_bank bank ON rgcd.bank = bank.bkode JOIN m0_status st ON rgc.rgcstatus = st.kode JOIN m1_coa c ON rgcd.rekbank = c.cnomor GROUP BY rgcd.bank , rgcd.nogiro ORDER BY rgcd.bank , rgcd.urutan;

-- RID=1629 | MENU=11 | ITEM=5 | RQUERY=1 | NAME=Daftar Giro Masuk Batal (RGC) | FILE=receivegirocancellist2
SELECT SUM(rgcd.jumlah) AS jumlah , rgc.rgccatatan, rgc.rgcnotransaksi, rgc.rgctgl, rgcd.nogiro, bank.bnama, rgcd.tgljatuhtempo, rgcd.matauang, rgcd.bank, c.cnomor, rgcd.noacbank, c.cnama , rgc.rgckurs FROM m2_rgc rgc JOIN m2_rgc_detail rgcd ON rgc.rgcid = rgcd.idrgc JOIN m1_bank bank ON rgcd.bank = bank.bkode JOIN m1_coa c ON rgcd.rekbank = c.cnomor GROUP BY rgcd.bank, rgcd.nogiro ORDER BY rgcd.bank , rgcd.urutan;

-- RID=193 | MENU=12 | ITEM=1 | RQUERY=1 | NAME=Daftar Giro Keluar Batal (SGC) | FILE=spendgirocancellist
SELECT sgc.sgccatatan, sgc.sgcnotransaksi, sgc.sgctgl, sgcd.nogiro , sgcd.bank , sgcd.tgljatuhtempo , sgcd.matauang , Sum(sgcd.jumlah) AS jumlah , bank.bnama, c.cnomor, c.cnama, sgcd.noacbank FROM m2_sgc sgc JOIN m2_sgc_detail sgcd ON sgc.sgcid = sgcd.idsgc JOIN m1_bank bank ON sgcd.bank = bank.bkode JOIN m1_coa c ON sgcd.rekbank = c.cnomor GROUP BY sgcd.bank, sgcd.nogiro ORDER BY sgcd.urutan, sgcd.bank, sgc.sgcnotransaksi, sgcd.nogiro;

-- RID=194 | MENU=12 | ITEM=2 | RQUERY=1 | NAME=Giro Keluar Batal (SGC) | FILE=spendgirocanceldetail1
SELECT SUM(sgcd.jumlah) AS jumlah, sgc.sgcnotransaksi, sgc.sgccatatan , sgc.sgctgl, sgcd.nogiro , bank.bnama, sgcd.bank , sgcd.rekbank, sgcd.noacbank, sgcd.tgljatuhtempo , st.nama AS statussgc FROM m2_sgc sgc JOIN m2_sgc_detail sgcd ON sgc.sgcid = sgcd.idsgc JOIN m1_bank bank ON sgcd.bank = bank.bkode JOIN m0_status st ON sgc.sgcstatus = st.kode GROUP BY sgcd.bank , sgcd.nogiro ORDER BY sgcd.bank , sgcd.urutan;

-- RID=546 | MENU=12 | ITEM=3 | RQUERY=1 | NAME=Giro Keluar Batal (SGC) | FILE=spendgirocanceldetail1_ud
SELECT SUM(sgcd.jumlah) AS jumlah, sgc.sgcnotransaksi, sgc.sgccatatan , sgc.sgctgl, sgcd.nogiro , bank.bnama, sgcd.bank , sgcd.rekbank, sgcd.noacbank, sgcd.tgljatuhtempo , st.nama AS statussgc FROM m2_sgc sgc JOIN m2_sgc_detail sgcd ON sgc.sgcid = sgcd.idsgc JOIN m1_bank bank ON sgcd.bank = bank.bkode JOIN m0_status st ON sgc.sgcstatus = st.kode GROUP BY sgcd.bank , sgcd.nogiro ORDER BY sgcd.bank , sgcd.urutan;

-- RID=771 | MENU=12 | ITEM=4 | RQUERY=1 | NAME=Giro Keluar Batal (SGC) | FILE=spendgirocanceldetail2
SELECT SUM(sgcd.jumlah) AS jumlah, sgc.sgcnotransaksi, sgc.sgccatatan , sgc.sgctgl, sgcd.nogiro , bank.bnama, sgcd.bank , sgcd.rekbank, sgcd.noacbank, sgcd.tgljatuhtempo , st.nama AS statussgc FROM m2_sgc sgc JOIN m2_sgc_detail sgcd ON sgc.sgcid = sgcd.idsgc JOIN m1_bank bank ON sgcd.bank = bank.bkode JOIN m0_status st ON sgc.sgcstatus = st.kode GROUP BY sgcd.bank , sgcd.nogiro ORDER BY sgcd.bank , sgcd.urutan;

-- RID=1630 | MENU=12 | ITEM=5 | RQUERY=1 | NAME=Daftar Giro Keluar Batal (SGC) | FILE=spendgirocancellist2
SELECT sgc.sgckurs , sgc.sgccatatan, sgc.sgcnotransaksi, sgc.sgctgl, sgcd.nogiro , sgcd.bank , sgcd.tgljatuhtempo , sgcd.matauang , Sum(sgcd.jumlah) AS jumlah , bank.bnama, c.cnomor, c.cnama, sgcd.noacbank FROM m2_sgc sgc JOIN m2_sgc_detail sgcd ON sgc.sgcid = sgcd.idsgc JOIN m1_bank bank ON sgcd.bank = bank.bkode JOIN m1_coa c ON sgcd.rekbank = c.cnomor GROUP BY sgcd.bank, sgcd.nogiro ORDER BY sgcd.urutan, sgcd.bank, sgc.sgcnotransaksi, sgcd.nogiro;

-- RID=140 | MENU=13 | ITEM=1 | RQUERY=1 | NAME=Daftar Revaluasi Valas (RV) | FILE=ListRevaluasiValas
sql FROM rfrom;

-- RID=141 | MENU=13 | ITEM=2 | RQUERY=1 | NAME=Revaluasi Valas (RV) | FILE=RevaluasiValas
sql FROM rfrom;

-- RID=142 | MENU=14 | ITEM=1 | RQUERY=1 | NAME=Daftar Template Jurnal (TJ) | FILE=ListTemplateJournal
sql FROM rfrom;

-- RID=143 | MENU=14 | ITEM=2 | RQUERY=1 | NAME=Template Jurnal (TJ) | FILE=TemplateJournal
sql FROM rfrom;

-- RID=404 | MENU=41 | ITEM=1 | RQUERY=2 | NAME=Buku Besar | FILE=bukubesarglobaltidakpertanggal
SELECT * FROM m2r_general_ledger ORDER BY glnorek ASC, glnourut;

-- RID=411 | MENU=41 | ITEM=2 | RQUERY=2 | NAME=Buku Besar Rekap Tanggal | FILE=bukubesarglobalpertanggal
SELECT * FROM m2r_general_ledger ORDER BY glnorek ASC, glnourut;

-- RID=494 | MENU=41 | ITEM=3 | RQUERY=2 | NAME=Buku Besar Valas | FILE=bukubesarglobaltidakpertanggal
SELECT * FROM m2r_general_ledger ORDER BY glnorek ASC, glnourut;

-- RID=495 | MENU=41 | ITEM=4 | RQUERY=2 | NAME=Buku Besar Valas Rekap Tanggal | FILE=bukubesarglobalpertanggal
SELECT * FROM m2r_general_ledger ORDER BY glnorek ASC, glnourut;

-- RID=1637 | MENU=41 | ITEM=5 | RQUERY=2 | NAME=Buku Besar (Akun Lawan) | FILE=bukubesar_akunlawan
SELECT * FROM M2r_BukuBesar_AkunLawan ORDER BY kbhnorek, kbhtgl, kbhnotransaksi, kbhidlawan;

-- RID=50001758 | MENU=41 | ITEM=6 | RQUERY=2 | NAME=Buku Besar Per Sumber | FILE=bukubesarglobaltidakpertanggal
SELECT * FROM m2r_general_ledger ORDER BY glnorek ASC, glnourut;

-- RID=406 | MENU=42 | ITEM=1 | RQUERY=2 | NAME=Neraca Mutasi | FILE=neracamutasi
SELECT LEFT (nmnorek, 1) AS nomor, CASE (LEFT (nmnorek, 1)) WHEN 1 THEN "AKTIVA" WHEN 2 THEN "PASIVA" WHEN 3 THEN "PASIVA" WHEN 4 THEN "PENDAPATAN" WHEN 5 THEN "BIAYA" WHEN 6 THEN "PENDAPATAN LAIN-LAIN" WHEN 7 THEN "BIAYA LAIN-LAIN" END AS grop, idlogin, idmsmq, nmnorek, nmnoreknama, nmtipe, nmsaldoawal, nmdebit, nmkredit, nmsaldoakhir FROM m2r_neraca_mutasi ORDER BY nmnorek ASC;

-- RID=407 | MENU=43 | ITEM=1 | RQUERY=2 | NAME=Kas Harian (Global) | FILE=kasharianglobal
SELECT nmnorek, nmnoreknama, nmtipe, nmsaldoawal, nmdebit, nmkredit, nmsaldoakhir FROM m2r_neraca_mutasi ORDER BY nmnorek ASC;

-- RID=409 | MENU=43 | ITEM=2 | RQUERY=2 | NAME=Kas Harian (Akun Lawan) | FILE=kasharianakunlawan
SELECT * FROM m2r_kasbank_harian ORDER BY kbhnorek, kbhtgl, kbhnotransaksi, kbhidlawan;

-- RID=54210 | MENU=43 | ITEM=3 | RQUERY=2 | NAME=Kas Harian (Global) Per Akun Rekap | FILE=kasharianakunlawan_global
SELECT * FROM m2r_kasbank_harian ORDER BY kbhnorek ASC, kbhnoreklawan ASC , kbhtgl ASC , kbhnotransaksi ASC;

-- RID=54211 | MENU=43 | ITEM=4 | RQUERY=2 | NAME=Kas Harian (Global) Per Akun Rekap Detail | FILE=kasharianakunlawan_detail
SELECT * FROM m2r_kasbank_harian ORDER BY kbhnorek ASC, kbhnoreklawan ASC , kbhtgl ASC , kbhnotransaksi ASC;

-- RID=408 | MENU=44 | ITEM=1 | RQUERY=2 | NAME=Bank Harian (Global) | FILE=bankharianglobal
SELECT nmnorek, nmnoreknama, nmtipe, nmsaldoawal, nmdebit, nmkredit, nmsaldoakhir FROM m2r_neraca_mutasi ORDER BY nmnorek ASC;

-- RID=410 | MENU=44 | ITEM=2 | RQUERY=2 | NAME=Bank Harian (Akun Lawan) | FILE=bankharianakunlawan
SELECT * FROM m2r_kasbank_harian ORDER BY kbhnorek, kbhtgl, kbhdebitlawan, kbhkreditlawan;

-- RID=50003784 | MENU=44 | ITEM=3 | RQUERY=2 | NAME=Daily Bank Balance Report (Summary) | FILE=dailybank
SELECT * FROM m2r_dailybank ORDER BY urut;

-- RID=412 | MENU=45 | ITEM=1 | RQUERY=2 | NAME=Laporan Posisi Keuangan | FILE=posisikeuangan
SELECT * FROM m2r_posisi_keuangan ORDER BY pkurut ASC;

-- RID=496 | MENU=45 | ITEM=2 | RQUERY=2 | NAME=Laporan Posisi Keuangan (T) | FILE=posisikeuanganT
SELECT * FROM m2r_posisi_keuangan_t;

-- RID=413 | MENU=46 | ITEM=1 | RQUERY=2 | NAME=Laporan Laba Rugi | FILE=labarugi
SELECT * FROM m2r_posisi_keuangan ORDER BY pkurut ASC;

-- RID=1031 | MENU=46 | ITEM=2 | RQUERY=2 | NAME=Laporan Laba Rugi Tahun Berjalan | FILE=labarugi
SELECT * FROM m2r_posisi_keuangan ORDER BY pkurut ASC;

-- RID=1566 | MENU=46 | ITEM=3 | RQUERY=2 | NAME=Laporan Laba Rugi Per Tahun | FILE=labarugi_pertahun
SELECT * FROM m2r_laba_pertahun ORDER BY pkurut ASC;

-- RID=50000573 | MENU=46 | ITEM=4 | RQUERY=2 | NAME=Laporan Laba Rugi Tahun | FILE=labarugi_tahun
SELECT * FROM m2r_posisi_keuangan ORDER BY pkurut ASC;

-- RID=50000725 | MENU=46 | ITEM=5 | RQUERY=2 | NAME=Laporan Laba Rugi (Anggaran) | FILE=labarugianggaran
SELECT * FROM m2r_posisi_keuangan ORDER BY pkurut ASC;

-- RID=50000726 | MENU=46 | ITEM=6 | RQUERY=2 | NAME=Laporan Laba Rugi Tahun Berjalan (Anggaran) | FILE=labarugianggaran
SELECT * FROM m2r_posisi_keuangan ORDER BY pkurut ASC;

-- RID=50001756 | MENU=46 | ITEM=7 | RQUERY=2 | NAME=Laporan Laba Rugi | FILE=labarugimultiperiode
SELECT * FROM m2r_posisi_keuangan_tahun ORDER BY pkurut ASC;

-- RID=414 | MENU=47 | ITEM=1 | RQUERY=2 | NAME=Kartu Piutang | FILE=kartupiutang
SELECT idlogin, arnourut, arid, artgl, arsumber, arnotransaksi, arkontak, arkontakkode, arkontaknama, aralamat1, aralamat2, aralamat3, aralamat4 aralamat5, arnotelp1, arnotelp2, arnorek, armatauang, arkurs, case arcatatan when "Sales Order (SO)" then aruraian else arcatatan end as aruraian, arcatatan, arsaldoawal, ardebit, arkredit, arsaldoakhir, artgljatuhtempo, arstatuslunas, artgllunas, arinputtgl, arisfungsional, arissaldoakhir, idmsmq, aruserid, arcustomtext1, arcustomtext2, arcustomtext3, arcustomtext4, arcustomtext5, arcustomint1, arcustomint2, arcustomint3, arcustomint4, arcustomint5, arcustomdbl1, arcustomdbl2, arcustomdbl3, arcustomdbl4, arcustomdbl5, arcustomdate1, arcustomdate2, arcustomdate3, arcustomdate4, arcustomdate5 FROM m2r_ar_card ORDER BY arnourut ASC;

-- RID=50000717 | MENU=47 | ITEM=2 | RQUERY=1 | NAME=Kartu Piutang Selisih | FILE=insentive_persalesman
SELECT si.sibagianpenjualan , ks.kkode AS kodesalesman , ks.knama AS namasalesman , si.sitgl , si.sinotransaksi , si.sicustomer , kc.kkode AS kodecustomer , kc.knama AS namacustomer , si.sitotaltransaksi , si.sitgllunas , si.sijmlbayar , CASE YEAR(si.sitgllunas) WHEN '1900' THEN 0 ELSE DATEDIFF(si.sitgllunas, si.sitgl) END AS selisih , (si.sinotransaksi - si.sijmlbayar ) AS sisa FROM m5_si si JOIN m1_contact ks ON si.sibagianpenjualan = ks.kid JOIN m1_contact kc ON si.sicustomer = kc.kid ORDER BY si.sibagianpenjualan ASC , si.sitgl ASC;

-- RID=415 | MENU=48 | ITEM=1 | RQUERY=2 | NAME=Rekap Piutang | FILE=rekappiutang[CB2]
SELECT idlogin, arnourut, arid, artgl, arsumber, arnotransaksi, arkontak, arkontakkode, arkontaknama, aralamat1, aralamat2, aralamat3, aralamat4, aralamat5, arnotelp1, arnotelp2, arnorek, armatauang, arkurs, aruraian, arcatatan, arsaldoawal, ardebit, arkredit, arsaldoakhir, artgljatuhtempo, arstatuslunas, artgllunas, arinputtgl, arisfungsional, arissaldoakhir, idmsmq, aruserid, arcustomtext1, arcustomtext2, arcustomtext3, arcustomtext4, arcustomtext5, arcustomint1, arcustomint2, arcustomint3, arcustomint4, arcustomint5, arcustomdbl1, arcustomdbl2, arcustomdbl3, arcustomdbl4, arcustomdbl5, arcustomdate1, arcustomdate2, arcustomdate3, arcustomdate4, arcustomdate5, kkategoricustomer, kkategoricustomernama FROM m2r_ar_card left join m1_contact on arkontak = kid ORDER BY arnourut ASC;

-- RID=4548552 | MENU=48 | ITEM=2 | RQUERY=2 | NAME=Rekap Piutang (Retur dan Pelunasan) | FILE=rekappiutang_split
SELECT * FROM m2r_ar_card ORDER BY arnourut ASC;

-- RID=6000000 | MENU=48 | ITEM=3 | RQUERY=2 | NAME=Rekap Piutang Detail | FILE=Rekap Piutang Detail
SELECT * FROM m2r_ar_card ORDER BY arnourut ASC;

-- RID=418 | MENU=49 | ITEM=1 | RQUERY=2 | NAME=Voucher Piutang | FILE=voucherpiutang
SELECT * FROM m2r_ar_voucher ORDER BY arnourut ASC;

-- RID=4188 | MENU=49 | ITEM=2 | RQUERY=2 | NAME=Voucher Piutang Per Salesman | FILE=voucherpiutang2
SELECT ar.* , k.kkode , k.knama FROM m2r_ar_voucher ar JOIN m1_contact k ON arcustomtext1 = k.kkode ORDER BY arnourut ASC;

-- RID=50003816 | MENU=49 | ITEM=3 | RQUERY=2 | NAME=Daily AR Estimate | FILE=Daily AR Estimate
SELECT * FROM m2r_ar_voucher ORDER BY arnourut ASC;

-- RID=416 | MENU=50 | ITEM=1 | RQUERY=2 | NAME=Kartu Hutang | FILE=kartuhutang
SELECT idlogin, apnourut, apid, aptgl, apsumber, apnotransaksi, apkontak, apkontakkode, apkontaknama, apalamat1, apalamat2, apalamat3, apalamat4, apalamat5, apnotelp1, apnotelp2, apnorek, apmatauang, apkurs, apcatatan as apuraian, apcatatan, apsaldoawal, apdebit, apkredit, apsaldoakhir, aptgljatuhtempo, apstatuslunas, aptgllunas, apinputtgl, apisfungsional, apissaldoakhir, idmsmq, apuserid, apcustomtext1, apcustomtext2, apcustomtext3, apcustomtext4, apcustomtext5, apcustomint1, apcustomint4, apcustomint5, apcustomdbl1, apcustomdbl2, apcustomdbl3, apcustomdbl4, apcustomdbl5, apcustomdate1, apcustomdate2, apcustomdate3, apcustomdate4, apcustomdate5 FROM m2r_ap_card ORDER BY apnourut ASC;

-- RID=417 | MENU=51 | ITEM=1 | RQUERY=2 | NAME=Rekap Hutang | FILE=rekaphutang[CB2]
SELECT idlogin, apnourut, apid, aptgl, apsumber, apnotransaksi, apkontak, apkontakkode, apkontaknama, apalamat1, apalamat2, apalamat3, apalamat4, apalamat5, apnotelp1, apnotelp2, apnorek, apmatauang, apkurs, apuraian, apcatatan, apsaldoawal, apdebit, apkredit, apsaldoakhir, aptgljatuhtempo, apstatuslunas, aptgllunas, apinputtgl, apisfungsional, apissaldoakhir, idmsmq, apuserid, apcustomtext1, apcustomtext2, apcustomtext3, apcustomtext4, apcustomtext5, apcustomint1, apcustomint2, apcustomint3, apcustomint4, apcustomint5, apcustomdbl1, apcustomdbl2, apcustomdbl3, apcustomdbl4, apcustomdbl5, apcustomdate1, apcustomdate2, apcustomdate3, apcustomdate4, apcustomdate5, kkategorisupplier, kkategorisuppliernama FROM m2r_ap_card left join m1_contact on apkontak = kid ORDER BY apnourut ASC;

-- RID=5000524 | MENU=51 | ITEM=2 | RQUERY=2 | NAME=Rekap Hutang (Retur dan Pelunasan) | FILE=rekaphutang_split
SELECT * FROM m2r_ap_card ORDER BY apnourut ASC;

-- RID=419 | MENU=52 | ITEM=1 | RQUERY=2 | NAME=Voucher Hutang | FILE=voucherhutang
SELECT * FROM m2r_ap_voucher ORDER BY apnourut ASC;

-- RID=50003815 | MENU=52 | ITEM=2 | RQUERY=2 | NAME=Daily AP Estimate | FILE=Daily AP Estimate
SELECT * FROM m2r_ap_voucher ORDER BY apnourut ASC;

-- RID=420 | MENU=53 | ITEM=1 | RQUERY=2 | NAME=Kartu UM Penjualan | FILE=kartuumpenjualan
SELECT * FROM m2r_umpenjualan_card ORDER BY arnourut ASC;

-- RID=421 | MENU=54 | ITEM=1 | RQUERY=2 | NAME=Rekap UM Penjualan | FILE=rekapumpenjualan
SELECT * FROM m2r_umpenjualan_card ORDER BY arnourut ASC;

-- RID=422 | MENU=55 | ITEM=1 | RQUERY=2 | NAME=Voucher UM Penjualan | FILE=voucherumpenjualan
SELECT * FROM m2r_umpenjualan_voucher ORDER BY arnourut ASC;

-- RID=423 | MENU=56 | ITEM=1 | RQUERY=2 | NAME=Kartu UM Pembelian | FILE=kartuumpembelian
SELECT * FROM m2r_umpembelian_card ORDER BY apnourut ASC;

-- RID=424 | MENU=57 | ITEM=1 | RQUERY=2 | NAME=Rekap UM Pembelian | FILE=rekapumpembelian
SELECT * FROM m2r_umpembelian_card ORDER BY apnourut ASC;

-- RID=425 | MENU=58 | ITEM=1 | RQUERY=2 | NAME=Voucher UM Pembelian | FILE=voucherumpembelian
SELECT * FROM m2r_umpembelian_voucher ORDER BY apnourut ASC;

-- RID=426 | MENU=59 | ITEM=1 | RQUERY=2 | NAME=Kartu Piutang Ongkos Kirim | FILE=kartupiutangongkoskirim
SELECT * FROM m2r_arpostage_card ORDER BY arnourut ASC;

-- RID=427 | MENU=60 | ITEM=1 | RQUERY=2 | NAME=Rekap Piutang Ongkos Kirim | FILE=rekappiutangongkoskirim
SELECT * FROM m2r_arpostage_card ORDER BY arnourut ASC;

-- RID=428 | MENU=61 | ITEM=1 | RQUERY=2 | NAME=Voucher Piutang Ongkos Kirim | FILE=voucherpiutangongkoskirim
SELECT * FROM m2r_arpostage_voucher ORDER BY arnourut ASC;

-- RID=429 | MENU=62 | ITEM=1 | RQUERY=2 | NAME=Kartu Terima Pembayaran | FILE=kartuterimapembayaran
SELECT * FROM m2r_ip_card ORDER BY arnourut ASC;

-- RID=430 | MENU=63 | ITEM=1 | RQUERY=2 | NAME=Rekap Terima Pembayaran | FILE=rekapterimapembayaran
SELECT * FROM m2r_ip_card ORDER BY arnourut ASC;

-- RID=431 | MENU=64 | ITEM=1 | RQUERY=2 | NAME=Voucher Terima Pembayaran | FILE=voucherterimapembayaran
SELECT * FROM m2r_ip_voucher ORDER BY arnourut ASC;

-- RID=476 | MENU=65 | ITEM=1 | RQUERY=1 | NAME=Daftar Saldo Awal COA (CB) | FILE=daftarsaldoawalcoa
SELECT cb.cbnotransaksi, cb.cbtgl, c.cnomor, c.cnama, st.nama AS statuscb, k.knama AS kontak, cb.cbmatauang, cb.cbkurs, cb.cburaian, cb.cbkredit, cb.cbdebit, cb.cbdebitvalas, cb.cbkreditvalas, cbd.kredit, cbd.kreditvalas, cbd.debit, cbd.debitvalas FROM m2_cb cb JOIN m2_cb_detail cbd ON cb.cbid = cbd.idcb JOIN m1_contact k ON cb.cbkontak = k.kid JOIN m0_status st ON cb.cbstatus = st.kode JOIN m1_coa c ON cbd.norek = c.cnomor ORDER BY cb.cbnotransaksi, cbd.urutan;

-- RID=477 | MENU=65 | ITEM=2 | RQUERY=1 | NAME=Saldo Awal COA (CB) | FILE=saldoawalcoa
SELECT cb.cbnotransaksi, cb.cbtgl, c.cnomor, c.cnama, cbd.catatan, st.nama AS statuscb, k.knama AS kontak, cb.cbmatauang, cb.cbkurs, cb.cburaian, cb.cbkredit, cb.cbdebit, cb.cbdebitvalas, cb.cbkreditvalas, cbd.kredit, cbd.kreditvalas, cbd.debit, cbd.debitvalas, cb.cbid, cbd.norek FROM m2_cb cb JOIN m2_cb_detail cbd ON cb.cbid = cbd.idcb JOIN m1_contact k ON cb.cbkontak = k.kid JOIN m0_status st ON cb.cbstatus = st.kode JOIN m1_coa c ON cbd.norek = c.cnomor ORDER BY cb.cbnotransaksi;

-- RID=552 | MENU=65 | ITEM=3 | RQUERY=1 | NAME=Saldo Awal COA (CB) | FILE=saldoawalcoa_ud
SELECT cb.cbnotransaksi, cb.cbtgl, c.cnomor, c.cnama, cbd.catatan, st.nama AS statuscb, k.knama AS kontak, cb.cbmatauang, cb.cbkurs, cb.cburaian, cb.cbkredit, cb.cbdebit, cb.cbdebitvalas, cb.cbkreditvalas, cbd.kredit, cbd.kreditvalas, cbd.debit, cbd.debitvalas, cb.cbid, cbd.norek FROM m2_cb cb JOIN m2_cb_detail cbd ON cb.cbid = cbd.idcb JOIN m1_contact k ON cb.cbkontak = k.kid JOIN m0_status st ON cb.cbstatus = st.kode JOIN m1_coa c ON cbd.norek = c.cnomor ORDER BY cb.cbnotransaksi;

-- RID=772 | MENU=65 | ITEM=4 | RQUERY=1 | NAME=Saldo Awal COA (CB) | FILE=saldoawalcoa2
SELECT cb.cbnotransaksi, cb.cbtgl, c.cnomor, c.cnama, cbd.catatan, st.nama AS statuscb, k.knama AS kontak, cb.cbmatauang, cb.cbkurs, cb.cburaian, cb.cbkredit, cb.cbdebit, cb.cbdebitvalas, cb.cbkreditvalas, cbd.kredit, cbd.kreditvalas, cbd.debit, cbd.debitvalas, cb.cbid, cbd.norek FROM m2_cb cb JOIN m2_cb_detail cbd ON cb.cbid = cbd.idcb JOIN m1_contact k ON cb.cbkontak = k.kid JOIN m0_status st ON cb.cbstatus = st.kode JOIN m1_coa c ON cbd.norek = c.cnomor ORDER BY cb.cbnotransaksi;

-- RID=1632 | MENU=65 | ITEM=5 | RQUERY=1 | NAME=Daftar Saldo Awal COA (CB) | FILE=daftarsaldoawalcoa2
SELECT cb.cbnotransaksi, cb.cbtgl, c.cnomor, c.cnama, st.nama AS statuscb, k.knama AS kontak, cb.cbmatauang, cb.cbkurs, cb.cburaian, cb.cbkredit, cb.cbdebit, cb.cbdebitvalas, cb.cbkreditvalas, cbd.kredit, cbd.kreditvalas, cbd.debit, cbd.debitvalas FROM m2_cb cb JOIN m2_cb_detail cbd ON cb.cbid = cbd.idcb JOIN m1_contact k ON cb.cbkontak = k.kid JOIN m0_status st ON cb.cbstatus = st.kode JOIN m1_coa c ON cbd.norek = c.cnomor ORDER BY cb.cbnotransaksi, cbd.urutan;

-- RID=436 | MENU=68 | ITEM=1 | RQUERY=2 | NAME=Rekap Per Cost Center | FILE=rekappercostcenter
SELECT * FROM m2r_bp_card ORDER BY bpnourut ASC;

-- RID=437 | MENU=69 | ITEM=1 | RQUERY=2 | NAME=Buku Besar Per Cost Center | FILE=bukubesarpercostcenter
SELECT * FROM m2r_bp_card ORDER BY bpnourut ASC;

-- RID=1613 | MENU=69 | ITEM=2 | RQUERY=2 | NAME=Buku Besar Cost Center (Mesin) | FILE=bukubesar_mesin1
SELECT idlogin , idmsmq , divisikode , divisinama, norek, namarek, tgl, cdc, SUM(debit) AS debit, SUM(kredit) AS kredit, customedbl1, SUM(qty1) AS qty1, SUM(qty2) as qty2, SUM(qty3) AS qty3, SUM(qty4) AS qty4, SUM(qty5) AS qty5, SUM(qty6) as qty6, SUM(qty7) AS qty7, SUM(jumlah1) as jumlah1, SUM(jumlah2) AS jumlah2, SUM(jumlah3) AS jumlah3, SUM(jumlah4) AS jumlah4, SUM(jumlah5) AS jumlah5, SUM(jumlah6) AS jumlah6, SUM(jumlah7) AS jumlah7 FROM m2r_bb_divisi GROUP BY norek ASC, divisikode ASC ORDER BY norek ASC, divisikode ASC;

-- RID=1614 | MENU=69 | ITEM=3 | RQUERY=1 | NAME=Buku Besar Cost Center (Mesin) | FILE=bukubesar_mesin2
SELECT IFNULL(t.tcostcenter,'') as divisikode, IFNULL(cc.ccnama, '') as divisinama, IFNULL(t.tnorek, '') as norek, IFNULL(c.cnamaalias1, '') as namarek, t.ttgl, c.cdc, SUM(t.tdebit) AS tdebit , SUM(t.tkredit) AS tkredit , IFNULL(c.ccustomdbl1,0) AS ccustomdbl1, IFNULL((CASE c.cdc WHEN 'D' THEN SUM(t.tdebit - t.tkredit) WHEN 'C' THEN SUM(t.tkredit - t.tdebit) ELSE 0 END) / c.ccustomdbl1,0) AS qty , IFNULL(CASE c.cdc WHEN 'D' THEN SUM(t.tdebit - t.tkredit) WHEN 'C' THEN SUM(t.tkredit - t.tdebit) ELSE 0 END ,0)AS jumlah FROM m2_transaction_journal t JOIN m1_cost_center cc ON t.tcostcenter = cc.cckode LEFT JOIN m1_coa c ON t.tnorek = c.cnomor WHERE t.tstatus in (2,3,4,7) GROUP BY t.tnorek ASC, t.tcostcenter ASC, t.ttgl ASC ORDER BY t.tnorek ASC, t.tcostcenter ASC, t.ttgl ASC;

-- RID=1616 | MENU=69 | ITEM=4 | RQUERY=1 | NAME=Buku Besar Cost Center (Mesin) | FILE=bukubesar_mesin3
SELECT IFNULL(t.tcostcenter,'') as divisikode, IFNULL(cc.ccnama, '') as divisinama, IFNULL(t.tnorek, '') as norek, IFNULL(c.cnamaalias1, '') as namarek, COUNT(DISTINCT t.ttgl) as hari, c.cdc, SUM(t.tdebit) AS tdebit , SUM(t.tkredit) AS tkredit , IFNULL(c.ccustomdbl1,0) AS ccustomdbl1, IFNULL((CASE c.cdc WHEN 'D' THEN SUM(t.tdebit - t.tkredit) WHEN 'C' THEN SUM(t.tkredit - t.tdebit) ELSE 0 END) / c.ccustomdbl1,0) AS qty , IFNULL(CASE c.cdc WHEN 'D' THEN SUM(t.tdebit - t.tkredit) WHEN 'C' THEN SUM(t.tkredit - t.tdebit) ELSE 0 END ,0)AS jumlah FROM m2_transaction_journal t JOIN m1_cost_center cc ON t.tcostcenter = cc.cckode LEFT JOIN m1_coa c ON t.tnorek = c.cnomor WHERE t.tstatus in (2,3,4,7) GROUP BY t.tnorek ASC, t.tcostcenter ASC ORDER BY t.tnorek ASC, t.tcostcenter ASC;

-- RID=438 | MENU=70 | ITEM=1 | RQUERY=1 | NAME=Rekap Buku Besar Piutang Usaha | FILE=rekapbukubesarpiutang
SELECT c.kkode, c.knama, t.tnorek, t.tsumber, n.uraian as tsumbernama, SUM(t.tdebit) AS tdebit, SUM(t.tkredit) AS tkredit FROM m2_transaction_journal t JOIN m1_contact c ON t.tkontak = c.kid JOIN m0_nomor n ON t.tsumber = n.kodetabel JOIN m0_setting s ON t.tnorek = s.snilai AND s.smodule = 0 AND s.sgrup = 'akun' AND s.skode = 'PiutangUsaha' WHERE t.tstatus IN(2,3,4,7) GROUP BY t.tsumber;

-- RID=439 | MENU=70 | ITEM=2 | RQUERY=1 | NAME=Rekap Buku Besar Piutang Usaha (Per Customer) | FILE=rekapbukubesarpiutangpercustomer
SELECT c.kkode, c.knama, t.tnorek, t.tsumber, n.uraian as tsumbernama, SUM(t.tdebit) AS tdebit, SUM(t.tkredit) AS tkredit FROM m2_transaction_journal t JOIN m1_contact c ON t.tkontak = c.kid JOIN m0_nomor n ON t.tsumber = n.kodetabel JOIN m0_setting s ON t.tnorek = s.snilai AND s.smodule = 0 AND s.sgrup = 'akun' AND s.skode = 'PiutangUsaha' WHERE t.tstatus IN(2,3,4,7) GROUP BY t.tkontak, t.tsumber;

-- RID=440 | MENU=71 | ITEM=1 | RQUERY=1 | NAME=Rekap Buku Besar Hutang Usaha | FILE=rekapbukubesarhutang
SELECT c.kkode, c.knama, t.tnorek, t.tsumber, n.uraian as tsumbernama, SUM(t.tdebit) AS tdebit, SUM(t.tkredit) AS tkredit FROM m2_transaction_journal t JOIN m1_contact c ON t.tkontak = c.kid JOIN m0_nomor n ON t.tsumber = n.kodetabel JOIN m0_setting s ON t.tnorek = s.snilai AND s.smodule = 0 AND s.sgrup = 'akun' AND s.skode = 'HutangUsaha' WHERE t.tstatus IN(2,3,4,7) GROUP BY t.tsumber;

-- RID=441 | MENU=71 | ITEM=2 | RQUERY=1 | NAME=Rekap Buku Besar Hutang Usaha (Per Supplier) | FILE=rekapbukubesarhutangpersupplier
SELECT c.kkode, c.knama, t.tnorek, t.tsumber, n.uraian as tsumbernama, SUM(t.tdebit) AS tdebit, SUM(t.tkredit) AS tkredit FROM m2_transaction_journal t JOIN m1_contact c ON t.tkontak = c.kid JOIN m0_nomor n ON t.tsumber = n.kodetabel JOIN m0_setting s ON t.tnorek = s.snilai AND s.smodule = 0 AND s.sgrup = 'akun' AND s.skode = 'HutangUsaha' WHERE t.tstatus IN(2,3,4,7) GROUP BY t.tkontak, t.tsumber;

-- RID=452 | MENU=78 | ITEM=1 | RQUERY=2 | NAME=Persediaan Barang Per Gudang | FILE=persediaanbarangpergudang
SELECT * FROM m2r_persediaan ORDER BY pgudang ASC, pkategori ASC;

-- RID=453 | MENU=78 | ITEM=2 | RQUERY=2 | NAME=Persediaan Barang Per Kategori | FILE=persediaanbarangperkategori
SELECT * FROM m2r_persediaan ORDER BY pkategori ASC, pgudang ASC;

-- RID=575 | MENU=78 | ITEM=3 | RQUERY=2 | NAME=Persediaan Barang Detail | FILE=persediaanbarangdetail2
SELECT * FROM m2r_persediaan_detail ORDER BY pdid;

-- RID=1342 | MENU=78 | ITEM=5 | RQUERY=2 | NAME=Nilai Persediaan Per Tanggal | FILE=nilaipersediaan
SELECT * FROM m2r_kartu_stok ORDER BY ksnourut ASC;

-- RID=1598 | MENU=78 | ITEM=6 | RQUERY=2 | NAME=Nilai Persediaan Per Gudang (Detail) | FILE=nilaipersediaangudang_detail
SELECT idlogin, ksnourut, ksid, ksgudang, ksgudangnama, kskategoribarang, kskategoribarangnama, ksidbarang, kskodebarang, kstipebarang, ksnamabarang, kssatuanbarang, kstgl, kssumber, ksnotransaksi, kskontak, kskontakkode, kskontaknama, ksuraian, kscatatan, kscatatandetail, ksmatauang, kskurs, ksharga, ksdiskon, ksjmldiskon, ksjenismutasi, case when ROUND(ksjmlmasuk,2) = 0 then 0 else ksjmlmasuk END as kssaldoawal, case when ROUND(ksjmlmasuk,2) = 0 then 0 else kshargamasuk END as kshargaawal, case when ROUND(ksjmlmasuk,2) = 0 then 0 else ksnilaimasuk END as ksnilaiawal, case when ROUND(ksjmlkeluar,2) = 0 then 0 else ksjmlkeluar END as ksjmlmutasi, case when ROUND(ksjmlkeluar,2) = 0 then 0 else kshargakeluar END as kshargamutasi, case when ROUND(ksjmlkeluar,2) = 0 then 0 else ksnilaikeluar END as ksnilaimutasi, case when ROUND(kssaldojml,2) = 0 THEN 0 ELSE kssaldojml END AS kssaldojml, case when ROUND(kssaldojml,2) = 0 THEN 0 ELSE kssaldohpp END AS kssaldohpp, case when ROUND(kssaldojml,2) = 0 THEN 0 ELSE kssaldojml END * case when ROUND(kssaldojml,2) = 0 THEN 0 ELSE kssaldohpp END AS kssaldonilai, kspostingtgl, ksinputtgl, idmsmq, ksuserid, kscustomtext1, kscustomtext2, kscustomtext3, kscustomtext4, kscustomtext5, kscustomint1, kscustomint2, kscustomint3, kscustomint4, kscustomint5, kscustomdbl1, kscustomdbl2, kscustomdbl3, kscustomdbl4, kscustomdbl5, kscustomdate1, kscustomdate2, kscustomdate3, kscustomdate4, kscustomdate5, i.brekpersediaan, i.brekhargapokok, i.brekpenjualan , i.brekreturpenjualan , i.brekreturpembelian , i.brekdiskonpembelian , i.brekdiskonpenjualan , i.brekkonsinyasi, i.bsection, i.bdivisi, case when ROUND(kscustomdbl1,2) = 0 then 0 else kscustomdbl1 END as ksjmlmutasimasuk, case when ROUND(kscustomdbl2,2) = 0 then 0 else kscustomdbl2 END as ksjmlmutasikeluar FROM m2r_kartu_stok ks join m1_item i on ks.ksidbarang = i.bid WHERE i.bjenis = "P" ORDER BY ksgudang ASC, kskategoribarang ASC, ksnourut ASC;

-- RID=1599 | MENU=78 | ITEM=7 | RQUERY=2 | NAME=Nilai Persediaan Per Gudang (Global) | FILE=nilaipersediaangudang_global
SELECT idlogin, ksnourut, ksid, ksgudang, ksgudangnama, kskategoribarang, kskategoribarangnama, ksidbarang, kskodebarang, kstipebarang, ksnamabarang, kssatuanbarang, kstgl, kssumber, ksnotransaksi, kskontak, kskontakkode, kskontaknama, ksuraian, kscatatan, kscatatandetail, ksmatauang, kskurs, ksharga, ksdiskon, ksjmldiskon, ksjenismutasi, SUM(ksjmlmasuk) as ksjmlmasuk, SUM(kshargamasuk) as kshargamasuk, SUM(ksnilaimasuk) as ksnilaimasuk, SUM(ksjmlkeluar) as ksjmlkeluar, SUM(kshargakeluar) as kshargakeluar, SUM(ksnilaikeluar) as ksnilaikeluar, SUM(kssaldojml) as kssaldojml, SUM(kssaldohpp) as kssaldohpp, SUM(kssaldonilai) as kssaldonilai, kspostingtgl, ksinputtgl, idmsmq, ksuserid, kscustomtext1, kscustomtext2, kscustomtext3, kscustomtext4, kscustomtext5, kscustomint1, kscustomint2, kscustomint3, kscustomint4, kscustomint5, kscustomdbl1, kscustomdbl2, kscustomdbl3, kscustomdbl4, kscustomdbl5, kscustomdate1, kscustomdate2, kscustomdate3, kscustomdate4, kscustomdate5 FROM m2r_kartu_stok WHERE (ksjmlmasuk <> 0 OR ksnilaimasuk <> 0 OR kssaldojml <> 0 OR kssaldonilai <> 0) GROUP BY ksgudang ASC, kskategoribarang ASC ORDER BY ksgudang ASC, kskategoribarang ASC, ksnourut ASC;

-- RID=1669 | MENU=78 | ITEM=8 | RQUERY=2 | NAME=Nilai Persediaan Per Gudang Per Kategori | FILE=persediaanbarangpergudangperkategori
SELECT * FROM m2r_persediaan ORDER BY pgudang ASC, pkategori ASC;

-- RID=1670 | MENU=78 | ITEM=9 | RQUERY=2 | NAME=Nilai Persediaan Per Kategori Per Gudang | FILE=persediaanbarangperkategoripergudang
SELECT * FROM m2r_persediaan ORDER BY pkategori ASC, pgudang ASC;

-- RID=4548553 | MENU=78 | ITEM=10 | RQUERY=2 | NAME=Nilai Persediaan Per Gudang (RS Wijaya) | FILE=nilaipersediaangudang_detailrswijaya
SELECT ks.ksgudang, ks.ksgudangnama, ks.kskategoribarang, ks.kskategoribarangnama, ks.ksidbarang, ks.kskodebarang, ks.kstipebarang, ks.ksnamabarang, ks.kssatuanbarang, SUM((CASE ks.ksgudang WHEN 'BPJS' THEN ks.kssaldojml ELSE 0 END)) as bpjs, SUM((CASE ks.ksgudang WHEN 'G' THEN ks.kssaldojml ELSE 0 END)) as g, SUM((CASE ks.ksgudang WHEN 'RI' THEN ks.kssaldojml ELSE 0 END)) as ri, SUM((CASE ks.ksgudang WHEN 'RJ' THEN ks.kssaldojml ELSE 0 END)) as rj, SUM(ks.kssaldojml) as kssaldojml, ks.kssaldohpp, SUM(ks.kssaldonilai) as kssaldonilai FROM m2r_kartu_stok ks WHERE (ks.ksjmlmasuk <> 0 OR ks.ksnilaimasuk <> 0 OR ks.kssaldojml <> 0 OR ks.kssaldonilai <> 0) GROUP BY ks.kskategoribarang ASC, ks.kskodebarang ASC ORDER BY ks.kskategoribarang ASC, ks.kskodebarang ASC;

-- RID=5000525 | MENU=78 | ITEM=11 | RQUERY=2 | NAME=Saldo Persediaan Per Gudang (Detail) | FILE=saldopersediaangudang_detail
SELECT * FROM m2r_kartu_stok WHERE (kssaldojml <> 0 OR kssaldohpp <> 0 OR kssaldonilai <> 0) ORDER BY ksgudang ASC, kskategoribarang ASC, ksnourut ASC;

-- RID=5000526 | MENU=78 | ITEM=12 | RQUERY=2 | NAME=Saldo Persediaan Per Gudang (Global) | FILE=saldopersediaangudang_global
SELECT idlogin, ksnourut, ksid, ksgudang, ksgudangnama, kskategoribarang, kskategoribarangnama, ksidbarang, kskodebarang, kstipebarang, ksnamabarang, kssatuanbarang, kstgl, kssumber, ksnotransaksi, kskontak, kskontakkode, kskontaknama, ksuraian, kscatatan, kscatatandetail, ksmatauang, kskurs, ksharga, ksdiskon, ksjmldiskon, ksjenismutasi, SUM(ksjmlmasuk) as ksjmlmasuk, IFNULL((SUM(ksnilaimasuk) / SUM(ksjmlmasuk)),0) as kshargamasuk, SUM(ksnilaimasuk) as ksnilaimasuk, SUM(ksjmlkeluar) as ksjmlkeluar, IFNULL((SUM(ksnilaikeluar) / SUM(ksjmlkeluar)),0) as kshargakeluar, SUM(ksnilaikeluar) as ksnilaikeluar, SUM(kssaldojml) as kssaldojml, IFNULL((SUM(kssaldonilai) / SUM(kssaldojml)),0) as kssaldohpp, SUM(kssaldonilai) as kssaldonilai, kspostingtgl, ksinputtgl, idmsmq, ksuserid, kscustomtext1, kscustomtext2, kscustomtext3, kscustomtext4, kscustomtext5, kscustomint1, kscustomint2, kscustomint3, kscustomint4, kscustomint5, kscustomdbl1, kscustomdbl2, kscustomdbl3, kscustomdbl4, kscustomdbl5, kscustomdate1, kscustomdate2, kscustomdate3, kscustomdate4, kscustomdate5 FROM m2r_kartu_stok WHERE (kssaldojml <> 0 OR kssaldohpp <> 0 OR kssaldonilai <> 0) GROUP BY ksgudang ASC, kskategoribarang ASC ORDER BY ksgudang ASC, kskategoribarang ASC, ksnourut ASC;

-- RID=50000527 | MENU=78 | ITEM=13 | RQUERY=1 | NAME=Nilai Persediaan Per Tanggal  | FILE=nilaipersediaan_satuan
SELECT s.* , b.bcustom2 , CASE bcustom2 WHEN "KRT100" THEN kssaldojml MOD 100 WHEN "KRT141" THEN kssaldojml MOD 141 END as MODD , CASE bcustom2 WHEN "KRT100" THEN 100 WHEN "KRT141" THEN 141 END as BAGI , (CASE bcustom2 WHEN "KRT100" THEN kssaldojml MOD 100 WHEN "KRT141" THEN kssaldojml MOD 141 END ) mod 12 AS "PCS" FROM m2r_kartu_stok s JOIN m1_item b ON s.ksidbarang = b.bid ORDER BY ksnourut ASC;

-- RID=54012 | MENU=78 | ITEM=14 | RQUERY=2 | NAME=Nilai Persediaan Per Kategori Barang | FILE=nilaipersediaan_perkategori
SELECT * FROM m2r_kartu_stok ORDER BY kskategoribarang ASC , ksnourut ASC;

-- RID=50000528 | MENU=78 | ITEM=25 | RQUERY=2 | NAME=Nilai Persediaan Per Tanggal  | FILE=nilaipersediaan_satuan_25
SELECT ks.* , CASE bcustom2 WHEN "KRT100" THEN kssaldojml MOD 100 WHEN "KRT141" THEN kssaldojml MOD 141 END as MODD , CASE bcustom2 WHEN "KRT100" THEN 100 WHEN "KRT141" THEN 141 END as BAGI , ks.kssaldojml MOD unit.unilai "hasi bagi KRT", ((ks.kssaldojml) - ((ks.kssaldojml) MOD unit.unilai)) / unit.unilai As KRT , (((ks.kssaldojml) MOD unit.unilai ) - ((ks.kssaldojml) MOD unit.unilai) mod 12) / 12 AS LSN , ((ks.kssaldojml) MOD unit.unilai) mod 12 AS PCS , unit.unilai , b.bcustom2 FROM m2r_kartu_stok ks JOIN m1_item b ON ks.ksidbarang = b.bid LEFT JOIN m1_unit unit ON b.bcustom2 = unit.ukode WHERE (kssaldojml <> 0 OR kssaldohpp <> 0 OR kssaldonilai <> 0) ORDER BY ks.ksgudang ASC, ks.kscatatan ASC, ks.ksnourut ASC;

-- RID=500528 | MENU=78 | ITEM=26 | RQUERY=2 | NAME=Rekap Penjualan Per Barang (Week Cover) | FILE=rekap_penjualan_perbarang_alamindo_2
SELECT ks.ksgudang, ks.ksgudangnama , ks.kscustomtext1 , ks.kscustomtext2 , ks.kskodebarang , ks.ksnamabarang , ks.ksjmlkeluar , ((ks.ksjmlkeluar*-1) / unit.unilai) AS terjual , unit.unama , (((ks.ksjmlkeluar*-1) / unit.unilai) / 13) AS rata , (ks.kssaldojml / unit.unilai) AS kssaldojml , (ks.ksnilaikeluar*-1) ksnilaikeluar, (ks.kssaldojml / (((ks.ksjmlkeluar*-1) / unit.unilai) / 13) ) AS weekcover FROM m2r_kartu_stok ks JOIN m1_item b ON ks.ksidbarang = b.bid LEFT JOIN m1_unit unit ON b.bcustom2 = unit.ukode JOIN m1_department dp ON b.bdepartemen = dp.dpkode JOIN m1_subdepartment sdp ON b.bsubdepartemen = sdp.sdpkode WHERE (ksjmlkeluar <> 0 OR kssaldohpp <> 0 OR kssaldonilai <> 0) ORDER BY ks.ksgudang ASC, ks.kscustomtext1 ASC, ks.kscustomtext2 ASC, ks.ksnourut ASC;

-- RID=50000529 | MENU=78 | ITEM=27 | RQUERY=2 | NAME=Nilai Persediaan Per Tanggal  | FILE=nilaipersediaan_satuan_hj
SELECT ks.* , CASE bcustom2 WHEN "KRT100" THEN kssaldojml MOD 100 WHEN "KRT141" THEN kssaldojml MOD 141 END as MODD , CASE bcustom2 WHEN "KRT100" THEN 100 WHEN "KRT141" THEN 141 END as BAGI , ks.kssaldojml MOD unit.unilai "hasi bagi KRT", ((ks.kssaldojml) - ((ks.kssaldojml) MOD unit.unilai)) / unit.unilai As KRT , (((ks.kssaldojml) MOD unit.unilai ) - ((ks.kssaldojml) MOD unit.unilai) mod 12) / 12 AS LSN , ((ks.kssaldojml) MOD unit.unilai) mod 12 AS PCS , unit.unilai , b.bcustom2 , b.bhargajual1 hj, b.bhargajual1*ks.kssaldojml hjnilai FROM m2r_kartu_stok ks JOIN m1_item b ON ks.ksidbarang = b.bid LEFT JOIN m1_unit unit ON b.bcustom2 = unit.ukode WHERE (kssaldojml <> 0 OR kssaldohpp <> 0 OR kssaldonilai <> 0) ORDER BY ks.ksgudang ASC, ks.kscatatan ASC, ks.ksnourut ASC;

-- RID=470 | MENU=81 | ITEM=1 | RQUERY=2 | NAME=Laba Rugi Invoice (Global) | FILE=labarugiinvoiceglobal
SELECT idlogin , lrsumber , lrnotransaksi , lrtgl , lrnamacustomer , CASE lrsumber WHEN "SI" THEN lrnilaipenjualan * 1 WHEN "SR" THEN lrnilaipenjualan * -1 END AS lrnilaipenjualan , CASE lrsumber WHEN "SI" THEN lrhargapokok * 1 WHEN "SR" THEN lrhargapokok * -1 END AS lrhargapokok , CASE lrsumber WHEN "SI" THEN lrlabarugi * 1 WHEN "SR" THEN lrlabarugi * -1 END AS lrlabarugi , lrmargin , idmsmq , lrcustomtext1 , lrcustomtext2 , lrcustomtext3 , lrcustomtext4 , lrcustomtext5 , lrcustomint1 , lrcustomint2 , lrcustomint3 , lrcustomint4 , lrcustomint5 , lrcustomdbl1 , lrcustomdbl2 , lrcustomdbl3 , lrcustomdbl4 , lrcustomdbl5 , lrcustomdate1 , lrcustomdate2 , lrcustomdate3 , lrcustomdate4 , lrcustomdate5 FROM m2r_lr_invoice_global ORDER BY lrtgl, lrnotransaksi;

-- RID=471 | MENU=81 | ITEM=2 | RQUERY=2 | NAME=Laba Rugi Invoice (Detail) | FILE=labarugiinvoicedetail
SELECT idlogin , lrsumber , lrnotransaksi , lrtgl , lrnamacustomer , CASE lrsumber WHEN "SI" THEN lrnilaipenjualan * 1 WHEN "SR" THEN lrnilaipenjualan * -1 END AS lrnilaipenjualan , CASE lrsumber WHEN "SI" THEN lrhargapokok * 1 WHEN "SR" THEN lrhargapokok * -1 END AS lrhargapokok , CASE lrsumber WHEN "SI" THEN lrlabarugi * 1 WHEN "SR" THEN lrlabarugi * -1 END AS lrlabarugi , lrmargin , lridbarang , lrkodebarang , lrnamabarang , lrtipebarang , lrsatuan , lrjml , idmsmq , lrcustomtext1 , lrcustomtext2 , lrcustomtext3 , lrcustomtext4 , lrcustomtext5 , lrcustomint1 , lrcustomint2 , lrcustomint3 , lrcustomint4 , lrcustomint5 , lrcustomdbl1 , lrcustomdbl2 , lrcustomdbl3 , lrcustomdbl4 , lrcustomdbl5 , lrcustomdate1 , lrcustomdate2 , lrcustomdate3 , lrcustomdate4 , lrcustomdate5 FROM m2r_lr_invoice_detail ORDER BY lrtgl, lrnotransaksi;

-- RID=50000536 | MENU=81 | ITEM=3 | RQUERY=2 | NAME=Summary Sales Report | FILE=summarysalesreport
SELECT idlogin , lrsumber , lrnotransaksi , lrtgl , lrnamacustomer , SUM(lrnilaipenjualan) AS lrnilaipenjualan , SUM(lrhargapokok) AS lrhargapokok , CASE lrsumber WHEN "SI" THEN SUM(lrlabarugi) * 1 WHEN "SR" THEN SUM(lrlabarugi) * -1 END AS lrlabarugi , lrmargin , lridbarang , lrkodebarang , lrnamabarang , lrtipebarang , lrsatuan , SUM(lrjml) AS lrjml , idmsmq , lrcustomtext1 , lrcustomtext2 , lrcustomtext3 , lrcustomtext4 , lrcustomtext5 , lrcustomint1 , lrcustomint2 , lrcustomint3 , lrcustomint4 , lrcustomint5 , lrcustomdbl1 , lrcustomdbl2 , lrcustomdbl3 , lrcustomdbl4 , lrcustomdbl5 , lrcustomdate1 , lrcustomdate2 , lrcustomdate3 , lrcustomdate4 , lrcustomdate5 FROM m2r_lr_invoice_detail WHERE lrsumber = 'SI' GROUP BY lridbarang ORDER BY lrkodebarang, lrtgl, lrnotransaksi;

-- RID=50000554 | MENU=81 | ITEM=4 | RQUERY=1 | NAME=Laba Rugi Per Barang | FILE=Laba_Rugi_Per_Barang
SELECT idlogin , lrsumber , lrnotransaksi , lrtgl , lrnamacustomer , CASE lrsumber WHEN "SI" THEN lrnilaipenjualan * 1 WHEN "SR" THEN lrnilaipenjualan * -1 END AS lrnilaipenjualan , CASE lrsumber WHEN "SI" THEN lrhargapokok * 1 WHEN "SR" THEN lrhargapokok * -1 END AS lrhargapokok , CASE lrsumber WHEN "SI" THEN lrlabarugi * 1 WHEN "SR" THEN lrlabarugi * -1 END AS lrlabarugi , lrmargin , idmsmq , lrcustomtext1 , lrcustomtext2 , lrcustomtext3 , lrcustomtext4 , lrcustomtext5 , lrcustomint1 , lrcustomint2 , lrcustomint3 , lrcustomint4 , lrcustomint5 , lrcustomdbl1 , lrcustomdbl2 , lrcustomdbl3 , lrcustomdbl4 , lrcustomdbl5 , lrcustomdate1 , lrcustomdate2 , lrcustomdate3 , lrcustomdate4 , lrcustomdate5 FROM SELECT idlogin , lrsumber , lrnotransaksi , lrtgl , lrnamacustomer , CASE lrsumber WHEN "SI" THEN lrnilaipenjualan * 1 WHEN "SR" THEN lrnilaipenjualan * -1 END AS lrnilaipenjualan , CASE lrsumber WHEN "SI" THEN lrhargapokok * 1 WHEN "SR" THEN lrhargapokok * -1 END AS lrhargapokok , CASE lrsumber WHEN "SI" THEN lrlabarugi * 1 WHEN "SR" THEN lrlabarugi * -1 END AS lrlabarugi , lrmargin , idmsmq , lrcustomtext1 , lrcustomtext2 , lrcustomtext3 , lrcustomtext4 , lrcustomtext5 , lrcustomint1 , lrcustomint2 , lrcustomint3 , lrcustomint4 , lrcustomint5 , lrcustomdbl1 , lrcustomdbl2 , lrcustomdbl3 , lrcustomdbl4 , lrcustomdbl5 , lrcustomdate1 , lrcustomdate2 , lrcustomdate3 , lrcustomdate4 , lrcustomdate5;

-- RID=472 | MENU=82 | ITEM=1 | RQUERY=2 | NAME=Mutasi Keuangan | FILE=mutasikeuangan
SELECT * FROM m2r_mutasi_keuangan ORDER BY mkstatus, mkakun;

-- RID=592 | MENU=90 | ITEM=1 | RQUERY=2 | NAME=Buku Besar Kontak | FILE=bukubesarpekontak2
SELECT idlogin , glnourut , glid , glkontak , glkontakkode , glkontaknama , gltgl , glnotransaksi , glnorek , glnoreknama , glmatauang , glkurs , glcatatan as gluraian , glcatatan, gldebit , glkredit , glsaldo , glinputtgl , idmsmq , gluserid , glcustomtext1 , glcustomtext2 , glcustomtext3 , glcustomtext4 , glcustomtext5 , glcustomint1 , glcustomint2 , glcustomint3 , glcustomint4 , glcustomint5 , glcustomdbl1 , glcustomdbl2 , glcustomdbl3 , glcustomdbl4 , glcustomdbl5 , glcustomdate1 , glcustomdate2 , glcustomdate3 , glcustomdate4 , glcustomdate5 FROM m2r_general_ledger rgl JOIN m1_coa c ON rgl.glnorek = c.cnomor ORDER BY glkontakkode, glkontak, glnorek, glnourut;

-- RID=593 | MENU=90 | ITEM=2 | RQUERY=2 | NAME=Buku Besar Kontak Rekap Tanggal | FILE=bukubesarpekontak
SELECT * FROM m2r_general_ledger rgl JOIN m1_coa c ON rgl.glnorek = c.cnomor ORDER BY glkontakkode, glkontak, glnorek, glnourut;

-- RID=698 | MENU=90 | ITEM=3 | RQUERY=2 | NAME=Rekap Buku Besar Kontak | FILE=rekapperkontak
SELECT * FROM m2r_bp_card ORDER BY bpnourut ASC;

-- RID=50000608 | MENU=90 | ITEM=4 | RQUERY=2 | NAME=SURAT PEMESANAN TANAH | FILE=bukubesarpekontak2_kop1
SELECT * , (case k.kjeniskelamin when 0 then 'Laki-Laki' else 'Perempuan' end ) as jknama FROM m2r_general_ledger rgl JOIN m1_coa c ON rgl.glnorek = c.cnomor LEFT JOIN m1_contact k ON rgl.glkontak = k.kid ORDER BY glkontakkode, glkontak, glnorek, glnourut;

-- RID=50000609 | MENU=90 | ITEM=5 | RQUERY=2 | NAME=TW-4 | FILE=bukubesarpekontak2_kop2
SELECT * , (case k.kjeniskelamin when 0 then 'Laki-Laki' else 'Perempuan' end ) as jknama FROM m2r_general_ledger rgl JOIN m1_coa c ON rgl.glnorek = c.cnomor LEFT JOIN m1_contact k ON rgl.glkontak = k.kid ORDER BY glkontakkode, glkontak, glnorek, glnourut;

-- RID=699 | MENU=91 | ITEM=1 | RQUERY=2 | NAME=Perincian Biaya | FILE=perincianbiaya
SELECT * FROM m2r_perincian_biaya;

-- RID=700 | MENU=92 | ITEM=1 | RQUERY=2 | NAME=Umur Piutang (Global) | FILE=analisaumurpiutang
SELECT arg.*, k.kterminjual FROM m2r_ar_voucher_aging arg left join m1_contact k on arg.arkontak = k.kid ORDER BY arnourut ASC;

-- RID=701 | MENU=92 | ITEM=2 | RQUERY=2 | NAME=Umur Piutang (Detail) | FILE=analisaumurpiutangdetail
SELECT arg.*, k.kbataspiutang FROM m2r_ar_voucher_aging arg left join m1_contact k on arg.arkontak = k.kid ORDER BY arnourut ASC;

-- RID=702 | MENU=93 | ITEM=1 | RQUERY=2 | NAME=Umur Hutang (Global) | FILE=analisaumurhutang
SELECT ap.*, k.kterminbeli FROM m2r_ap_voucher_aging ap left join m1_contact k on ap.apkontak = kid ORDER BY apnourut ASC;

-- RID=703 | MENU=93 | ITEM=2 | RQUERY=2 | NAME=Umur Hutang (Detail) | FILE=analisaumurhutangdetail
SELECT * FROM m2r_ap_voucher_aging ORDER BY apnourut ASC;

-- RID=704 | MENU=95 | ITEM=1 | RQUERY=1 | NAME=Data Jurnal | FILE=daftardatajurnal
SELECT * FROM (SELECT tj.tinputuser , u.unama AS tinputuserkode, tj.tnotransaksi, tj.ttgl, tj.turaian, tj.turutan, k.knama, tj.tkodetabelangka, tj.tkodepa, tj.tkontak, tj.tcatatan, tj.tkurs, tj.tsumber, tj.tmatauang, tj.tnorek, k.kkode AS tkontakkode, (CASE tj.tstatus WHEN 0 THEN 'Draft' WHEN 1 THEN 'Approve' WHEN 2 THEN 'Approved' END) AS tstatusnama, tj.tstatus, tj.tdivisi, tj.tcostcenter, tj.tproyek, tj.thutangpiutang, SUM(tj.tdebit) AS tdebit, SUM(tj.tkredit) AS tkredit, c.cnama AS namarekening, k.kkode, tj.tinputtgl FROM m2_transaction_journal tj JOIN m1_contact k ON tj.tkontak = k.kid JOIN m1_coa c ON tj.tnorek = c.cnomor LEFT JOIN m1_division d ON tj.tdivisi = d.dkode LEFT JOIN m1_project p ON tj.tproyek = p.pkode LEFT JOIN m0_user u ON tj.tinputuser = u.userid GROUP BY tj.tnotransaksi, tj.tdebit DESC, tj.tkredit ASC, tj.tmatauang, tj.tnorek, tj,tid ) AS datatran ORDER BY ttgl, tinputtgl, tnotransaksi, turutan;

-- RID=705 | MENU=96 | ITEM=1 | RQUERY=1 | NAME=Data Item Transaksi | FILE=itemtransaction
SELECT * FROM (SELECT it.notransaksi AS itnotransaksi, it.tgl AS ittgl, it.namabarang, it.jmlbarang, k.kkode AS itkontakkode, it.satuanbarang AS itsatuanbarang, k.knama, w.wnama , it.gudang AS itgudang, b.bkode AS itkodebarang, it.harga, it.diskon, it.catatan, it.uraian AS ituraian , CASE it.jenismutasi WHEN 0 then "Masuk" WHEN 1 then "Keluar" end AS jenismutasi FROM m1_item_transaction it JOIN m1_contact k ON it.kontak = k.kid JOIN m1_warehouse w ON it.gudang = w.wkode JOIN m1_item b ON it.idbarang = b.bid ) AS dataran ORDER BY ittgl DESC, itkodebarang, namabarang,itnotransaksi ASC;

-- RID=1672 | MENU=100 | ITEM=1 | RQUERY=1 | NAME=Data Giro Masuk  | FILE=datagiromasuk
SELECT gl.glnogiro, gl.glmatauang, gl.glkurs, gl.gljumlah, gl.gljumlahvalas, gl.gltgljthtempo, gl.glbank, k.knama, c.cnomor, c.cnama, sg.nama AS status, gl.glnotransaksi, gl.glsumber , gl.gljenis, tj.ttgl, tj.tnotransaksi AS notransaksi, tj.tnotransaksi, tj.ttgl AS gltgltransaksi FROM m2_giro_list gl JOIN m2_transaction_journal tj ON gl.glsumber = tj.tsumber AND gl.glidtransaksi = tj.tidtransaksi JOIN m1_contact k ON gl.glkontak = k.kid JOIN m1_coa c ON glrekbank = c.cnomor JOIN m0_status_giro sg ON gl.glstatus = sg.kode GROUP BY gl.glnogiro ORDER BY gl.glnogiro;

-- RID=863 | MENU=101 | ITEM=1 | RQUERY=1 | NAME=Data Giro Keluar | FILE=datagirokeluar
SELECT gl.glnogiro, gl.glmatauang, gl.glkurs, gl.gljumlah, gl.gljumlahvalas, gl.gltgljthtempo, gl.glbank, k.knama, c.cnomor, c.cnama, sg.nama AS status, gl.glnotransaksi, gl.glsumber , gl.gljenis, tj.ttgl, tj.tnotransaksi AS notransaksi, tj.tnotransaksi, tj.ttgl AS gltgltransaksi FROM m2_giro_list gl JOIN m2_transaction_journal tj ON gl.glsumber = tj.tsumber AND gl.glidtransaksi = tj.tidtransaksi JOIN m1_contact k ON gl.glkontak = k.kid JOIN m1_coa c ON glrekbank = c.cnomor JOIN m0_status_giro sg ON gl.glstatus = sg.kode GROUP BY gl.glnogiro ORDER BY gl.glnogiro;

-- RID=726 | MENU=104 | ITEM=1 | RQUERY=2 | NAME=Arus Kas (Tidak Langsung) | FILE=laporanaruskas
SELECT pk.* FROM m2r_aruskas pk JOIN m0_setting s ON s.smodule = '0' AND s.sgrup = 'akun' AND s.skode = 'LabaRugiBerjalan' ORDER BY pk.pknorek = s.snilai DESC, pk.pktipe = 6 DESC, pk.pktipe = 2 DESC, pk.pktipe = 3 DESC, pk.pktipe = 4 DESC, pk.pktipe = 7 DESC, pk.pktipe = 8 DESC, pk.pktipe = 5 DESC, pk.pktipe = 9 DESC, pk.pktipe = 10 DESC, pk.pknorek;

-- RID=454594 | MENU=104 | ITEM=2 | RQUERY=2 | NAME=Cash Flow | FILE=cashflow
SELECT kh.idlogin, kh.kbhid, kh.kbhkontak, kh.kbhkontakkode, kh.kbhkontaknama, kh.kbhtgl, kh.kbhidtransaksi, kh.kbhsumber, kh.kbhnotransaksi, kh.kbhmatauang, kh.kbhkurs, kh.kbhnorek, kh.kbhnoreknama, kh.kbhdebit, kh.kbhkredit, kh.kbhidlawan, kh.kbhnoreklawan, kh.kbhnoreklawannama, SUM(kh.kbhdebitlawan) as kbhdebitlawan, SUM(kh.kbhkreditlawan) as kbhkreditlawan, kh.kbhuraian, kh.kbhcatatan, kh.kbhsaldoawal, kh.kbhsaldomutasi, kh.kbhsaldoakhir, kh.kbhinputtgl, kh.kbhnogiro, kh.kbhbank, kh.kbhjumlah, kh.kbhtgljthtempo, kh.kbhtglcair, kh.idmsmq, kh.kbhuserid, kh.kbhcustomtext1, kh.kbhcustomtext2, kh.kbhcustomtext3, kh.kbhcustomtext4, kh.kbhcustomtext5, kh.kbhcustomint1, kh.kbhcustomint2, kh.kbhcustomint3, kh.kbhcustomint4, kh.kbhcustomint5, kh.kbhcustomdbl1, kh.kbhcustomdbl2, kh.kbhcustomdbl3, kh.kbhcustomdbl4, kh.kbhcustomdbl5, kh.kbhcustomdate1, kh.kbhcustomdate2, kh.kbhcustomdate3, kh.kbhcustomdate4, kh.kbhcustomdate5, CASE kh.kbhnoreklawan WHEN "" THEN "1" ELSE "0" END AS a FROM M2r_Kasbank_Harian kh GROUP BY kh.kbhnorek ASC, kh.kbhnoreklawan ASC ORDER BY kh.kbhnorek ASC, kh.kbhnoreklawan ASC;

-- RID=796 | MENU=105 | ITEM=1 | RQUERY=2 | NAME=Buku Besar Cabang | FILE=bukubesarpercabang
SELECT * FROM m2r_general_ledger_detail ORDER BY bpnourut ASC;

-- RID=797 | MENU=105 | ITEM=2 | RQUERY=2 | NAME=Buku Besar Cabang Rekap Tanggal | FILE=bukubesarcabangpertanggal
SELECT * FROM m2r_general_ledger_detail ORDER BY bpnourut ASC;

-- RID=798 | MENU=106 | ITEM=1 | RQUERY=2 | NAME=Buku Besar Lokasi | FILE=bukubesarlokasi
SELECT * FROM m2r_general_ledger_detail ORDER BY bpnourut ASC;

-- RID=799 | MENU=106 | ITEM=2 | RQUERY=2 | NAME=Buku Besar Lokasi Rekap Tanggal  | FILE=bukubesarlokasipertanggal
SELECT * FROM m2r_general_ledger_detail ORDER BY bpnourut ASC;

-- RID=800 | MENU=107 | ITEM=1 | RQUERY=2 | NAME=Buku Besar Divisi | FILE=bukubesardivisi
SELECT * FROM m2r_general_ledger_detail ORDER BY bpnourut ASC;

-- RID=801 | MENU=107 | ITEM=2 | RQUERY=2 | NAME=Buku Besar Divisi Rekap Tanggal | FILE=bukubesardivisipertanggal
SELECT * FROM m2r_general_ledger_detail ORDER BY bpnourut ASC;

-- RID=1612 | MENU=107 | ITEM=3 | RQUERY=2 | NAME=Buku Besar Divisi (Tenaga Kerja) | FILE=bukubesarorang1
SELECT idlogin , idmsmq , divisikode , divisinama, norek, namarek, tgl, cdc, SUM(debit) AS debit, SUM(kredit) AS kredit, customedbl1, SUM(qty1) AS qty1, SUM(qty2) as qty2, SUM(qty3) AS qty3, SUM(qty4) AS qty4, SUM(qty5) AS qty5, SUM(qty6) as qty6, SUM(qty7) AS qty7, SUM(jumlah1) as jumlah1, SUM(jumlah2) AS jumlah2, SUM(jumlah3) AS jumlah3, SUM(jumlah4) AS jumlah4, SUM(jumlah5) AS jumlah5, SUM(jumlah6) AS jumlah6, SUM(jumlah7) AS jumlah7 FROM m2r_bb_divisi GROUP BY norek ASC, divisikode ASC ORDER BY norek ASC, divisikode ASC;

-- RID=1615 | MENU=107 | ITEM=4 | RQUERY=1 | NAME=Buku Besar Divisi (Tenaga Kerja) | FILE=bukubesarorang2
SELECT IFNULL(t.tdivisi,'') as divisikode, IFNULL(d.dnama, '') as divisinama, IFNULL(t.tnorek, '') as norek, IFNULL(c.cnamaalias1, '') as namarek, t.ttgl, c.cdc, SUM(t.tdebit) AS tdebit , SUM(t.tkredit) AS tkredit , IFNULL(c.ccustomdbl1,0) AS ccustomdbl1, IFNULL((CASE c.cdc WHEN 'D' THEN SUM(t.tdebit - t.tkredit) WHEN 'C' THEN SUM(t.tkredit - t.tdebit) ELSE 0 END) / c.ccustomdbl1,0) AS qty , IFNULL(CASE c.cdc WHEN 'D' THEN SUM(t.tdebit - t.tkredit) WHEN 'C' THEN SUM(t.tkredit - t.tdebit) ELSE 0 END ,0)AS jumlah FROM m2_transaction_journal t JOIN m1_division d ON t.tdivisi = d.dkode LEFT JOIN m1_coa c ON t.tnorek = c.cnomor WHERE t.tstatus in (2,3,4,7) GROUP BY t.tnorek ASC, t.tdivisi ASC, t.ttgl ASC ORDER BY t.tnorek ASC, t.tdivisi ASC, t.ttgl ASC;

-- RID=1617 | MENU=107 | ITEM=5 | RQUERY=1 | NAME=Buku Besar Divisi (Tenaga Kerja)  | FILE=bukubesarorang3
SELECT IFNULL(t.tdivisi,'') as divisikode, IFNULL(d.dnama, '') as divisinama, IFNULL(t.tnorek, '') as norek, IFNULL(c.cnamaalias1, '') as namarek, COUNT(DISTINCT t.ttgl) as hari, c.cdc, SUM(t.tdebit) AS tdebit , SUM(t.tkredit) AS tkredit , IFNULL(c.ccustomdbl1,0) AS ccustomdbl1, IFNULL((CASE c.cdc WHEN 'D' THEN SUM(t.tdebit - t.tkredit) WHEN 'C' THEN SUM(t.tkredit - t.tdebit) ELSE 0 END) / c.ccustomdbl1,0) AS qty , IFNULL(CASE c.cdc WHEN 'D' THEN SUM(t.tdebit - t.tkredit) WHEN 'C' THEN SUM(t.tkredit - t.tdebit) ELSE 0 END ,0)AS jumlah FROM m2_transaction_journal t JOIN m1_division d ON t.tdivisi = d.dkode LEFT JOIN m1_coa c ON t.tnorek = c.cnomor WHERE t.tstatus in (2,3,4,7) GROUP BY t.tnorek ASC, t.tdivisi ASC ORDER BY t.tnorek ASC, t.tdivisi ASC;

-- RID=802 | MENU=108 | ITEM=1 | RQUERY=2 | NAME=Buku Besar Proyek | FILE=bukubesarproyek
SELECT * FROM m2r_general_ledger_detail ORDER BY bpnourut ASC;

-- RID=803 | MENU=108 | ITEM=2 | RQUERY=2 | NAME=Buku Besar Proyek (Global per Tanggal) | FILE=bukubesarproyekpertanggal
SELECT * FROM m2r_general_ledger_detail ORDER BY bpnourut ASC;

-- RID=807 | MENU=109 | ITEM=1 | RQUERY=2 | NAME=Laporan Laba Rugi Cabang | FILE=labarugicabang
SELECT * FROM m2r_posisi_keuangan_detail ORDER BY pkurut ASC;

-- RID=808 | MENU=110 | ITEM=1 | RQUERY=2 | NAME=Laporan Laba Rugi Lokasi | FILE=labarugilokasi
SELECT * FROM m2r_posisi_keuangan_detail ORDER BY pkurut ASC;

-- RID=809 | MENU=111 | ITEM=1 | RQUERY=2 | NAME=Laporan Laba Rugi Divisi | FILE=labarugidivisi
SELECT * FROM m2r_posisi_keuangan_detail ORDER BY pkurut ASC;

-- RID=810 | MENU=112 | ITEM=1 | RQUERY=2 | NAME=Laporan Laba Rugi Proyek | FILE=labarugiproyek
SELECT * FROM m2r_posisi_keuangan_detail ORDER BY pkurut ASC;

-- RID=811 | MENU=113 | ITEM=1 | RQUERY=2 | NAME=Laporan Laba Rugi Cost Center | FILE=labarugicostcenter
SELECT * FROM m2r_posisi_keuangan_detail ORDER BY pkurut ASC;

-- RID=812 | MENU=114 | ITEM=1 | RQUERY=2 | NAME=Laporan Posisi Keuangan Cabang | FILE=posisikeuangancabang
SELECT * FROM m2r_posisi_keuangan_detail ORDER BY pkurut ASC;

-- RID=813 | MENU=114 | ITEM=2 | RQUERY=2 | NAME=Laporan Posisi Keuangan Cabang (T) | FILE=posisikeuangancabangT
SELECT * FROM m2r_posisi_keuangan_t_detail;

-- RID=814 | MENU=115 | ITEM=1 | RQUERY=2 | NAME=Laporan Posisi Keuangan Lokasi | FILE=posisikeuanganLokasi
SELECT * FROM m2r_posisi_keuangan_detail ORDER BY pkurut ASC;

-- RID=815 | MENU=115 | ITEM=2 | RQUERY=2 | NAME=Laporan Posisi Keuangan Lokasi (T) | FILE=posisikeuanganLokasiT
SELECT * FROM m2r_posisi_keuangan_t_detail;

-- RID=816 | MENU=116 | ITEM=1 | RQUERY=2 | NAME=Laporan Posisi Keuangan Divisi | FILE=posisikeuanganDivisi
SELECT * FROM m2r_posisi_keuangan_detail ORDER BY pkurut ASC;

-- RID=817 | MENU=116 | ITEM=2 | RQUERY=2 | NAME=Laporan Posisi Keuangan Divisi (T) | FILE=posisikeuanganDivisiT
SELECT * FROM m2r_posisi_keuangan_t_detail;

-- RID=818 | MENU=117 | ITEM=1 | RQUERY=2 | NAME=Laporan Posisi Keuangan Proyek | FILE=posisikeuanganProyek
SELECT * FROM m2r_posisi_keuangan_detail ORDER BY pkurut ASC;

-- RID=819 | MENU=117 | ITEM=2 | RQUERY=2 | NAME=Laporan Posisi Keuangan Proyek (T) | FILE=posisikeuanganProyekT
SELECT * FROM m2r_posisi_keuangan_t_detail;

-- RID=820 | MENU=118 | ITEM=1 | RQUERY=2 | NAME=Laporan Posisi Keuangan Cost Center | FILE=posisikeuanganCostcenter
SELECT * FROM m2r_posisi_keuangan_detail ORDER BY pkurut ASC;

-- RID=821 | MENU=118 | ITEM=2 | RQUERY=2 | NAME=Laporan Posisi Keuangan Cost Center (T) | FILE=posisikeuanganCostcenterT
SELECT * FROM m2r_posisi_keuangan_t_detail;

-- RID=831 | MENU=119 | ITEM=1 | RQUERY=2 | NAME=Kartu Piutang Cabang | FILE=kartupiutangCabang
SELECT * FROM m2r_ar_card_detail ORDER BY arnourut ASC;

-- RID=832 | MENU=120 | ITEM=1 | RQUERY=2 | NAME=Kartu Piutang Lokasi | FILE=kartupiutangLokasi
SELECT * FROM m2r_ar_card_detail ORDER BY arnourut ASC;

-- RID=833 | MENU=121 | ITEM=1 | RQUERY=2 | NAME=Rekap Piutang Cabang | FILE=rekappiutangCabang
SELECT * FROM m2r_ar_card_detail ORDER BY arnourut ASC;

-- RID=834 | MENU=122 | ITEM=1 | RQUERY=2 | NAME=Rekap Piutang Lokasi | FILE=rekappiutangLokasi
SELECT * FROM m2r_ar_card_detail ORDER BY arnourut ASC;

-- RID=835 | MENU=123 | ITEM=1 | RQUERY=2 | NAME=Voucher Piutang Cabang | FILE=voucherpiutangCabang
SELECT * FROM m2r_ar_voucher_detail ORDER BY arnourut ASC;

-- RID=836 | MENU=124 | ITEM=1 | RQUERY=2 | NAME=Voucher Piutang Lokasi | FILE=voucherpiutangLokasi
SELECT * FROM m2r_ar_voucher_detail ORDER BY arnourut ASC;

-- RID=837 | MENU=125 | ITEM=1 | RQUERY=2 | NAME=Umur Piutang Cabang (Global) | FILE=analisaumurpiutangCabang
SELECT * FROM m2r_ar_voucher_aging_detail ORDER BY arnourut ASC;

-- RID=838 | MENU=125 | ITEM=2 | RQUERY=2 | NAME=Umur Piutang Cabang (Detail) | FILE=analisaumurpiutangCabangdetail
SELECT * FROM m2r_ar_voucher_aging_detail ORDER BY arnourut ASC;

-- RID=839 | MENU=126 | ITEM=1 | RQUERY=2 | NAME=Umur Piutang Lokasi (Global) | FILE=analisaumurpiutangLokasi
SELECT * FROM m2r_ar_voucher_aging_detail ORDER BY arnourut ASC;

-- RID=840 | MENU=126 | ITEM=2 | RQUERY=2 | NAME=Umur Piutang Lokasi (Detail) | FILE=analisaumurpiutangLokasidetail
SELECT * FROM m2r_ar_voucher_aging_detail ORDER BY arnourut ASC;

-- RID=841 | MENU=127 | ITEM=1 | RQUERY=2 | NAME=Kartu Hutang Cabang | FILE=kartuHutangCabang
SELECT * FROM m2r_ap_card_detail ORDER BY apnourut ASC;

-- RID=842 | MENU=128 | ITEM=1 | RQUERY=2 | NAME=Kartu Hutang Lokasi | FILE=kartuHutangLokasi
SELECT * FROM m2r_ap_card_detail ORDER BY apnourut ASC;

-- RID=843 | MENU=129 | ITEM=1 | RQUERY=2 | NAME=Rekap Hutang Cabang | FILE=rekapHutangCabang
SELECT * FROM m2r_ap_card_detail ORDER BY apnourut ASC;

-- RID=844 | MENU=130 | ITEM=1 | RQUERY=2 | NAME=Rekap Hutang Lokasi | FILE=rekapHutangLokasi
SELECT * FROM m2r_ap_card_detail ORDER BY apnourut ASC;

-- RID=845 | MENU=131 | ITEM=1 | RQUERY=2 | NAME=Voucher Hutang Cabang | FILE=voucherHutangCabang
SELECT * FROM m2r_ap_voucher_detail ORDER BY apnourut ASC;

-- RID=846 | MENU=132 | ITEM=1 | RQUERY=2 | NAME=Voucher Hutang Lokasi | FILE=voucherHutangLokasi
SELECT * FROM m2r_ap_voucher_detail ORDER BY apnourut ASC;

-- RID=847 | MENU=133 | ITEM=1 | RQUERY=2 | NAME=Umur Hutang Cabang (Global) | FILE=analisaumurHutangCabang
SELECT * FROM m2r_ap_voucher_aging_detail ORDER BY apnourut ASC;

-- RID=848 | MENU=133 | ITEM=2 | RQUERY=2 | NAME=Umur Hutang Cabang (Detail) | FILE=analisaumurHutangCabangdetail
SELECT * FROM m2r_ap_voucher_aging_detail ORDER BY apnourut ASC;

-- RID=849 | MENU=134 | ITEM=1 | RQUERY=2 | NAME=Umur Hutang Lokasi (Global) | FILE=analisaumurHutangLokasi
SELECT * FROM m2r_ap_voucher_aging_detail ORDER BY apnourut ASC;

-- RID=850 | MENU=134 | ITEM=2 | RQUERY=2 | NAME=Umur Hutang Lokasi (Detail) | FILE=analisaumurHutangLokasidetail
SELECT * FROM m2r_ap_voucher_aging_detail ORDER BY apnourut ASC;

-- RID=856 | MENU=135 | ITEM=1 | RQUERY=2 | NAME=Anggaran dan Realisasi (Global) | FILE=anggarandanrealisasiglobal
SELECT * FROM m2r_anggaran ORDER BY nmnorek ASC;

-- RID=857 | MENU=135 | ITEM=2 | RQUERY=2 | NAME=Anggaran dan Realisasi (Cabang) | FILE=anggarandanrealisasiCabang
SELECT * FROM m2r_anggaran ORDER BY nmnorek ASC;

-- RID=858 | MENU=135 | ITEM=3 | RQUERY=2 | NAME=Anggaran dan Realisasi (Lokasi) | FILE=anggarandanrealisasiLokasi
SELECT * FROM m2r_anggaran ORDER BY nmnorek ASC;

-- RID=859 | MENU=135 | ITEM=4 | RQUERY=2 | NAME=Anggaran dan Realisasi (Cost Center) | FILE=anggarandanrealisasiCostCenter
SELECT * FROM m2r_anggaran ORDER BY nmnorek ASC;

-- RID=860 | MENU=135 | ITEM=5 | RQUERY=2 | NAME=Anggaran dan Realisasi (Divisi) | FILE=anggarandanrealisasiDivisi
SELECT * FROM m2r_anggaran ORDER BY nmnorek ASC;

-- RID=861 | MENU=135 | ITEM=6 | RQUERY=2 | NAME=Anggaran dan Realisasi (Proyek) | FILE=anggarandanrealisasiProyek
SELECT * FROM m2r_anggaran ORDER BY nmnorek ASC;

-- RID=864 | MENU=135 | ITEM=7 | RQUERY=1 | NAME=Daftar Anggaran (BD) | FILE=daftaranggaran
SELECT bd.bdnotransaksi, bd.bdtgl, bd.bdtglanggaran, c.cnomor, c.cnama, bdd.jumlah, bdd.catatan, bd.bduraian, st.nama AS status, b.bnama AS barchnama, b.bkode AS barchkode, (CASE bd.bdanggarankategori WHEN '0' THEN ' ' WHEN '1' THEN b.bnama WHEN '2' THEN lc.lnama WHEN '3' THEN cc.ccnama WHEN '4' THEN d.dnama WHEN '5' THEN sd.sdnama WHEN '6' THEN p.pnama END) AS namakategori , (CASE bd.bdanggarankategori WHEN '0' THEN ' ' WHEN '1' THEN b.bkode WHEN '2' THEN lc.lkode WHEN '3' THEN cc.cckode WHEN '4' THEN d.dkode WHEN '5' THEN sd.sdkode WHEN '6' THEN p.pkode END) AS kodekategori, bd.bdanggarankategori, rc.nama AS kategori FROM m2_bd bd JOIN m2_bd_detail bdd ON bd.bdid = bdd.idbd JOIN m1_coa c ON bdd.norek = c.cnomor JOIN m0_status st ON bd.bdstatus = st.kode JOIN m0_realization_category rc ON bd.bdanggarankategori = rc.kode LEFT JOIN m1_branch b ON bd.bdanggarancabang = b.bkode LEFT JOIN m1_location lc ON bd.bdanggaranlokasi = lc.lkode LEFT JOIN m1_cost_center cc ON bd.bdanggarancostcenter = cc.cckode LEFT JOIN m1_division d ON bd.bdanggarandivisi = d.dkode LEFT JOIN m1_subdivision sd ON bd.bdanggaransubdivisi = sd.sdkode LEFT JOIN m1_project p ON bd.bdanggaranproyek = p.pkode ORDER BY bd.bdnotransaksi, c.cnomor;

-- RID=865 | MENU=135 | ITEM=8 | RQUERY=1 | NAME=Anggaran (BD) | FILE=anggarandetail
SELECT bd.bdnotransaksi, bd.bdtgl, bd.bdtglanggaran, c.cnomor, c.cnama, bdd.jumlah, bdd.catatan, bd.bduraian, st.nama AS status, b.bnama AS barchnama, b.bkode AS barchkode, (CASE bd.bdanggarankategori WHEN '0' THEN ' ' WHEN '1' THEN b.bnama WHEN '2' THEN lc.lnama WHEN '3' THEN cc.ccnama WHEN '4' THEN d.dnama WHEN '5' THEN sd.sdnama WHEN '6' THEN p.pnama END) AS namakategori , (CASE bd.bdanggarankategori WHEN '0' THEN ' ' WHEN '1' THEN b.bkode WHEN '2' THEN lc.lkode WHEN '3' THEN cc.cckode WHEN '4' THEN d.dkode WHEN '5' THEN sd.sdkode WHEN '6' THEN p.pkode END) AS kodekategori, bd.bdanggarankategori, rc.nama AS kategori FROM m2_bd bd JOIN m2_bd_detail bdd ON bd.bdid = bdd.idbd JOIN m1_coa c ON bdd.norek = c.cnomor JOIN m0_status st ON bd.bdstatus = st.kode JOIN m0_realization_category rc ON bd.bdanggarankategori = rc.kode LEFT JOIN m1_branch b ON bd.bdanggarancabang = b.bkode LEFT JOIN m1_location lc ON bd.bdanggaranlokasi = lc.lkode LEFT JOIN m1_cost_center cc ON bd.bdanggarancostcenter = cc.cckode LEFT JOIN m1_division d ON bd.bdanggarandivisi = d.dkode LEFT JOIN m1_subdivision sd ON bd.bdanggaransubdivisi = sd.sdkode LEFT JOIN m1_project p ON bd.bdanggaranproyek = p.pkode ORDER BY bd.bdnotransaksi, c.cnomor;

-- RID=866 | MENU=135 | ITEM=9 | RQUERY=1 | NAME=Anggaran (BD) | FILE=anggarandetail2
SELECT bd.bdnotransaksi, bd.bdtgl, bd.bdtglanggaran, c.cnomor, c.cnama, bdd.jumlah, bdd.catatan, bd.bduraian, st.nama AS status, b.bnama AS barchnama, b.bkode AS barchkode, (CASE bd.bdanggarankategori WHEN '0' THEN ' ' WHEN '1' THEN b.bnama WHEN '2' THEN lc.lnama WHEN '3' THEN cc.ccnama WHEN '4' THEN d.dnama WHEN '5' THEN sd.sdnama WHEN '6' THEN p.pnama END) AS namakategori , (CASE bd.bdanggarankategori WHEN '0' THEN ' ' WHEN '1' THEN b.bkode WHEN '2' THEN lc.lkode WHEN '3' THEN cc.cckode WHEN '4' THEN d.dkode WHEN '5' THEN sd.sdkode WHEN '6' THEN p.pkode END) AS kodekategori, bd.bdanggarankategori, rc.nama AS kategori FROM m2_bd bd JOIN m2_bd_detail bdd ON bd.bdid = bdd.idbd JOIN m1_coa c ON bdd.norek = c.cnomor JOIN m0_status st ON bd.bdstatus = st.kode JOIN m0_realization_category rc ON bd.bdanggarankategori = rc.kode LEFT JOIN m1_branch b ON bd.bdanggarancabang = b.bkode LEFT JOIN m1_location lc ON bd.bdanggaranlokasi = lc.lkode LEFT JOIN m1_cost_center cc ON bd.bdanggarancostcenter = cc.cckode LEFT JOIN m1_division d ON bd.bdanggarandivisi = d.dkode LEFT JOIN m1_subdivision sd ON bd.bdanggaransubdivisi = sd.sdkode LEFT JOIN m1_project p ON bd.bdanggaranproyek = p.pkode ORDER BY bd.bdnotransaksi, c.cnomor;

-- RID=1633 | MENU=135 | ITEM=10 | RQUERY=1 | NAME=Daftar Anggaran (BD) | FILE=daftaranggaran2
SELECT bd.bdnotransaksi, bd.bdtgl, bd.bdtglanggaran, c.cnomor, c.cnama, bdd.jumlah, bdd.catatan, bd.bduraian, st.nama AS status, b.bnama AS barchnama, b.bkode AS barchkode, (CASE bd.bdanggarankategori WHEN '0' THEN ' ' WHEN '1' THEN b.bnama WHEN '2' THEN lc.lnama WHEN '3' THEN cc.ccnama WHEN '4' THEN d.dnama WHEN '5' THEN sd.sdnama WHEN '6' THEN p.pnama END) AS namakategori , (CASE bd.bdanggarankategori WHEN '0' THEN ' ' WHEN '1' THEN b.bkode WHEN '2' THEN lc.lkode WHEN '3' THEN cc.cckode WHEN '4' THEN d.dkode WHEN '5' THEN sd.sdkode WHEN '6' THEN p.pkode END) AS kodekategori, bd.bdanggarankategori, rc.nama AS kategori FROM m2_bd bd JOIN m2_bd_detail bdd ON bd.bdid = bdd.idbd JOIN m1_coa c ON bdd.norek = c.cnomor JOIN m0_status st ON bd.bdstatus = st.kode JOIN m0_realization_category rc ON bd.bdanggarankategori = rc.kode LEFT JOIN m1_branch b ON bd.bdanggarancabang = b.bkode LEFT JOIN m1_location lc ON bd.bdanggaranlokasi = lc.lkode LEFT JOIN m1_cost_center cc ON bd.bdanggarancostcenter = cc.cckode LEFT JOIN m1_division d ON bd.bdanggarandivisi = d.dkode LEFT JOIN m1_subdivision sd ON bd.bdanggaransubdivisi = sd.sdkode LEFT JOIN m1_project p ON bd.bdanggaranproyek = p.pkode ORDER BY bd.bdnotransaksi, c.cnomor;

-- RID=1020 | MENU=138 | ITEM=1 | RQUERY=1 | NAME=Daftar Jurnal Memorial (JM) | FILE=daftarjurnalmemorial
SELECT jm.jmnotransaksi, jm.jmtgl, jm.jmuraian, kk.knama, jmd.norek, c.cnama, jmd.matauang, jmd.kurs, jmd.debit, jmd.debitvalas, jmd.kredit, jmd.kreditvalas FROM m2_jm jm JOIN m2_jm_detail jmd ON jm.jmid = jmd.idjm JOIN m1_contact kk ON jmd.kontak = kk.kid JOIN m1_coa c ON jmd.norek = c.cnomor ORDER BY jm.jmnotransaksi,jmd.urutan, c.cnama, jmd.matauang;

-- RID=1021 | MENU=138 | ITEM=2 | RQUERY=1 | NAME=Jurnal Memorial (JM) | FILE=jurnalmemorialdetail
SELECT jm.jmnotransaksi, jm.jmtgl, jm.jmuraian, kk.knama, jmd.norek, c.cnama, jm.jmmatauang, jm.jmkurs, jmd.debit, jmd.debitvalas, jmd.kredit, jmd.kreditvalas, jmd.urutan FROM m2_jm jm JOIN m2_jm_detail jmd ON jm.jmid = jmd.idjm JOIN m1_contact kk ON jmd.kontak = kk.kid JOIN m1_coa c ON jmd.norek = c.cnomor ORDER BY jm.jmnotransaksi, jmd.urutan ,c.cnama, jmd.matauang;

-- RID=1022 | MENU=138 | ITEM=3 | RQUERY=1 | NAME=Jurnal Memorial (JM) | FILE=jurnalmemorialdetail2
SELECT jm.jmnotransaksi, jm.jmtgl, jm.jmuraian, kk.knama, jmd.norek, c.cnama, jm.jmmatauang, jm.jmkurs, jmd.debit, jmd.debitvalas, jmd.kredit, jmd.kreditvalas, jmd.urutan FROM m2_jm jm JOIN m2_jm_detail jmd ON jm.jmid = jmd.idjm JOIN m1_contact kk ON jmd.kontak = kk.kid JOIN m1_coa c ON jmd.norek = c.cnomor ORDER BY jm.jmnotransaksi, jmd.urutan ,c.cnama, jmd.matauang;

-- RID=1352 | MENU=142 | ITEM=1 | RQUERY=1 | NAME=Laporan Pajak Masukan  | FILE=pajak_masukan
SELECT t.tkode , t.tnama , ri.ritgl , ri.riuraian , ri.rinotransaksi , ri.rinofakturpajak , k.knama , ri.rikurs , ri.ritotalpajak1detail FROM m4_ri_detail rid JOIN m4_ri ri ON rid.idri = ri.riid JOIN m1_contact k ON ri.risupplier = k.kid JOIN m1_tax t ON rid.pajak1 = t.tkode GROUP BY rid.pajak1 , rid.idri ORDER BY rid.pajak1 , ri.ritgl , ri.rinotransaksi;

-- RID=1353 | MENU=142 | ITEM=2 | RQUERY=1 | NAME=Laporan Pajak Keluaran | FILE=pajak_kluaran
SELECT t.tkode , t.tnama , si.sitgl , si.siuraian , si.sinotransaksi , si.sinofakturpajak , k.knama , si.sikurs , SUM(sid.jmlpajak1) AS sitotalpajak1detail FROM m5_si_detail sid JOIN m5_si si ON sid.idsi = si.siid JOIN m1_contact k ON si.sibagianpenjualan = k.kid LEFT JOIN m1_tax t ON sid.pajak1 = t.tkode WHERE (sisaldoawal = 0) GROUP BY sid.pajak1 , si.sitgl , si.sibagianpenjualan , sid.idsi , si.sinotransaksi ORDER BY sid.pajak1 , si.sitgl , si.sinotransaksi;

-- RID=50003835 | MENU=143 | ITEM=1 | RQUERY=1 | NAME=Data Jurnal | FILE=daftardatajurnal
SELECT * FROM (SELECT tj.tinputuser , u.unama AS tinputuserkode, tj.tnotransaksi, tj.ttgl, tj.turaian, tj.turutan, k.knama, tj.tkodetabelangka, tj.tkodepa, tj.tkontak, tj.tcatatan, tj.tkurs, tj.tsumber, tj.tmatauang, tj.tnorek, k.kkode AS tkontakkode, (CASE tj.tstatus WHEN 0 THEN 'Draft' WHEN 1 THEN 'Approve' WHEN 2 THEN 'Approved' END) AS tstatusnama, tj.tstatus, tj.tdivisi, tj.tcostcenter, tj.tproyek, tj.thutangpiutang, SUM(tj.tdebit) AS tdebit, SUM(tj.tkredit) AS tkredit, c.cnama AS namarekening, k.kkode, tj.tinputtgl FROM m2_transaction_journal tj JOIN m1_contact k ON tj.tkontak = k.kid JOIN m1_coa c ON tj.tnorek = c.cnomor LEFT JOIN m1_division d ON tj.tdivisi = d.dkode LEFT JOIN m1_project p ON tj.tproyek = p.pkode LEFT JOIN m0_user u ON tj.tinputuser = u.userid GROUP BY tj.tnotransaksi, tj.tdebit DESC, tj.tkredit ASC, tj.tmatauang, tj.tnorek, tj.tid ) AS datatran ORDER BY ttgl, tinputtgl, tnotransaksi, turutan;

-- RID=1641 | MENU=144 | ITEM=1 | RQUERY=2 | NAME=Neraca Mutasi Cabang | FILE=NeracaMutasiCabang
SELECT nmcabang , nmcabangnama, LEFT (nmnorek, 1) AS nomor, CASE (LEFT (nmnorek, 1)) WHEN 1 THEN "AKTIVA" WHEN 2 THEN "PASIVA" WHEN 3 THEN "PASIVA" WHEN 4 THEN "PENDAPATAN" WHEN 5 THEN "BIAYA" WHEN 6 THEN "PENDAPATAN LAIN-LAIN" WHEN 7 THEN "BIAYA LAIN-LAIN" END AS grop, idlogin, idmsmq, nmnorek, nmnoreknama, nmtipe, nmsaldoawal, nmdebit, nmkredit, nmsaldoakhir FROM m2r_neraca_mutasi_detail ORDER BY nmnorek ASC;

-- RID=1647 | MENU=145 | ITEM=1 | RQUERY=2 | NAME=Neraca Mutasi Lokasi | FILE=NeracaMutasiLokasi
SELECT nmcabang , nmcabangnama, LEFT (nmnorek, 1) AS nomor, CASE (LEFT (nmnorek, 1)) WHEN 1 THEN "AKTIVA" WHEN 2 THEN "PASIVA" WHEN 3 THEN "PASIVA" WHEN 4 THEN "PENDAPATAN" WHEN 5 THEN "BIAYA" WHEN 6 THEN "PENDAPATAN LAIN-LAIN" WHEN 7 THEN "BIAYA LAIN-LAIN" END AS grop, idlogin, idmsmq, nmnorek, nmnoreknama, nmtipe, nmsaldoawal, nmdebit, nmkredit, nmsaldoakhir FROM m2r_neraca_mutasi_detail ORDER BY nmnorek ASC;

-- RID=50000560 | MENU=146 | ITEM=1 | RQUERY=2 | NAME=Laporan Harian Alamindo | FILE=harianalamindo
SELECT *, CASE lhgrup WHEN 1 THEN "PENJUALAN/OMZET" WHEN 2 THEN "PIUTANG" WHEN 3 THEN "PERSEDIAAN" WHEN 4 THEN "SALDO CLAIM" WHEN 5 THEN "SALDO SLIP BELUM CAIR" WHEN 6 THEN "DANA MASUK" WHEN 7 THEN "DANA MASUK" WHEN 8 THEN "HUTANG" WHEN 9 THEN "SALDO KAS BANK" END AS "A" FROM m2r_laporan_harian ORDER BY lhgrup, lhurutan;

-- RID=50000563 | MENU=147 | ITEM=1 | RQUERY=2 | NAME=Stock Cover Month | FILE=covermonth
SELECT scm.idlogin, scm.scidbarang, scm.sckodebarang, scm.scnamabarang, scm.sctipebarang, scm.sckategoribarang, scm.sckategoribarangnama, scm.scgudang, scm.scgudangnama, scm.scstok, scm.scsatuan, scm.scsatuannama, scm.scsatuannilai, scm.scjmlkeluar, scm.scnilai, scm.sccovermonth, scm.idmsmq, scm.scuserid, scm.scscustomtext1, scm.sccustomtext2, scm.sccustomtext3, scm.sccustomtext4, scm.sccustomtext5, scm.sccustomint1, scm.sccustomint2, scm.sccustomint3, scm.sccustomint4, scm.sccustomint5, scm.sccustomdbl1, scm.sccustomdbl2, scm.sccustomdbl3, scm.sccustomdbl4, scm.sccustomdbl5, scm.sccustomdate1, scm.sccustomdate2, scm.sccustomdate3, scm.sccustomdate4, scm.sccustomdate5, (CASE WHEN scm.sccovermonth <= 3 THEN 'Fast' ELSE 'Slow' END) as statusmoving FROM m2r_stok_covermonth scm ORDER BY scm.sckategoribarang ASC, scm.sckodebarang ASC;

-- RID=50000724 | MENU=148 | ITEM=1 | RQUERY=2 | NAME=Laporan HPP Produksi | FILE=HPP
SELECT * FROM m2r_hpp_produksi ORDER BY purutan;

-- RID=50003783 | MENU=149 | ITEM=1 | RQUERY=2 | NAME=Costing | FILE=Costing
SELECT * FROM m2r_costing ORDER BY urut;

-- RID=50003828 | MENU=149 | ITEM=2 | RQUERY=2 | NAME=Material Used | FILE=materialused
SELECT m.idlogin, m.grup, CASE m.grup WHEN 0 THEN 'MATERIAL USED SUMMARY (IN IDR)' WHEN 1 THEN 'MATERIAL USED SUMMARY (IN QTY)' WHEN 2 THEN '% PRODUCTION LOSS' ELSE '' END as grupnama, m.tingkatan, m.tampil, m.tebal, m.urutan, CASE m.tingkatan WHEN 1 THEN CONCAT('     ',m.uraian) WHEN 2 THEN CONCAT('          ',m.uraian) WHEN 3 THEN CONCAT('               ',m.uraian) ELSE m.uraian END as uraian, m.nilaitotal, m.nilaibr, m.nilaibw, m.idmsmq, m.userid FROM m2r_materialused m ORDER BY m.grup, m.urutan;

-- RID=50003829 | MENU=149 | ITEM=3 | RQUERY=2 | NAME=Costing | FILE=materialcosting
SELECT m.idlogin, m.divisi, m.grup, m.tingkatan, m.tampil, m.tebal, m.urutan, CASE m.tingkatan WHEN 1 THEN CONCAT('     ',m.uraian) WHEN 2 THEN CONCAT('          ',m.uraian) WHEN 3 THEN CONCAT('               ',m.uraian) ELSE m.uraian END as uraian, CASE m.divisi WHEN 'BR' THEN m.totalbr ELSE m.totalbw END as totalbr, CASE m.divisi WHEN 'BR' THEN m.hargabr ELSE m.hargabw END as hargabr, CASE m.divisi WHEN 'BR' THEN m.hargachnbr ELSE m.hargachnbw END as hargachnbr, CASE m.divisi WHEN 'BR' THEN m.selisihbr ELSE m.selisihbw END as selisihbr, m.idmsmq, m.userid FROM m2r_materialcosting m ORDER BY m.grup, m.urutan;

-- RID=50003837 | MENU=149 | ITEM=4 | RQUERY=2 | NAME=Costing | FILE=materialcosting2025
SELECT m.idlogin, m.divisi, m.grup, m.tingkatan, m.tampil, m.tebal, m.urutan, CASE m.tingkatan WHEN 1 THEN CONCAT('     ',m.uraian) WHEN 2 THEN CONCAT('          ',m.uraian) WHEN 3 THEN CONCAT('               ',m.uraian) ELSE m.uraian END as uraian, CASE m.divisi WHEN 'BR' THEN m.totalbr ELSE m.totalbw END as totalbr, CASE m.divisi WHEN 'BR' THEN m.hargabr ELSE m.hargabw END as hargabr, CASE m.divisi WHEN 'BR' THEN m.hargachnbr ELSE m.hargachnbw END as hargachnbr, CASE m.divisi WHEN 'BR' THEN m.selisihbr ELSE m.selisihbw END as selisihbr, m.idmsmq, m.userid FROM m2r_materialcosting m ORDER BY m.grup, m.urutan;

-- RID=50003838 | MENU=149 | ITEM=5 | RQUERY=2 | NAME=Costing | FILE=materialcosting2025
SELECT m.idlogin, m.divisi, m.grup, m.tingkatan, m.tampil, m.tebal, m.urutan, CASE m.tingkatan WHEN 1 THEN CONCAT('     ',m.uraian) WHEN 2 THEN CONCAT('          ',m.uraian) WHEN 3 THEN CONCAT('               ',m.uraian) ELSE m.uraian END as uraian, CASE m.divisi WHEN 'BR' THEN m.totalbr ELSE m.totalbw END as totalbr, CASE m.divisi WHEN 'BR' THEN m.hargabr ELSE m.hargabw END as hargabr, CASE m.divisi WHEN 'BR' THEN m.hargachnbr ELSE m.hargachnbw END as hargachnbr, CASE m.divisi WHEN 'BR' THEN m.selisihbr ELSE m.selisihbw END as selisihbr, m.idmsmq, m.userid FROM m2r_materialcosting m WHERE m.tingkatan < 2 ORDER BY m.grup, m.urutan;

-- RID=50003785 | MENU=150 | ITEM=1 | RQUERY=2 | NAME=Sales and Purchases | FILE=SalesPurchase
SELECT * FROM m2r_salespurchase ORDER BY urut;

