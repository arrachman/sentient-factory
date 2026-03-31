-- m0_report full queries for rmoduleid = 8
-- total rows: 17

-- RID=4000 | MENU=10 | ITEM=1 | RQUERY=1 | NAME=Net Profit | FILE=Net_Profit
SELECT nptahun , CASE npbulan WHEN 1 THEN "Januari" WHEN 2 THEN "Februari" WHEN 3 THEN "Maret" WHEN 4 THEN "April" WHEN 5 THEN "Mei" WHEN 6 THEN "Juni" WHEN 7 THEN "Juli" WHEN 8 THEN "Agustus" WHEN 9 THEN "September" WHEN 10 THEN "Oktober" WHEN 11 THEN "November" WHEN 12 THEN "Desember" END AS bulan, npbulan , nppendapatan , npbiaya , npnetprofit , npinputtgl FROM m8_f_np;

-- RID=4001 | MENU=10 | ITEM=2 | RQUERY=1 | NAME=Net Profit Margin | FILE=Net_Profit_Margin
SELECT npmtahun , CASE npmbulan WHEN 1 THEN "Januari" WHEN 2 THEN "Februari" WHEN 3 THEN "Maret" WHEN 4 THEN "April" WHEN 5 THEN "Mei" WHEN 6 THEN "Juni" WHEN 7 THEN "Juli" WHEN 8 THEN "Agustus" WHEN 9 THEN "September" WHEN 10 THEN "Oktober" WHEN 11 THEN "November" WHEN 12 THEN "Desember" END AS bulan, npmbulan , npmpendapatan , npmbiaya , npmlrbelumpajak, npmpajak , npmlrsudahpajak , npmnetprofitmargin , npminputtgl FROM m8_f_npm;

-- RID=4002 | MENU=10 | ITEM=3 | RQUERY=1 | NAME=Gross Profit Margin | FILE=Gross_Profit_Margin
SELECT gpmtahun , CASE gpmbulan WHEN 1 THEN "Januari" WHEN 2 THEN "Februari" WHEN 3 THEN "Maret" WHEN 4 THEN "April" WHEN 5 THEN "Mei" WHEN 6 THEN "Juni" WHEN 7 THEN "Juli" WHEN 8 THEN "Agustus" WHEN 9 THEN "September" WHEN 10 THEN "Oktober" WHEN 11 THEN "November" WHEN 12 THEN "Desember" END AS bulan, gpmbulan , gpmpendapatan , gpmhargapokok , gpmgrossprofitmargin , gpminputtgl FROM m8_f_gpm;

-- RID=4003 | MENU=10 | ITEM=4 | RQUERY=1 | NAME=Operating Profit Margin | FILE=Operating_Profit_Margin
SELECT opmtahun , CASE opmbulan WHEN 1 THEN "Januari" WHEN 2 THEN "Februari" WHEN 3 THEN "Maret" WHEN 4 THEN "April" WHEN 5 THEN "Mei" WHEN 6 THEN "Juni" WHEN 7 THEN "Juli" WHEN 8 THEN "Agustus" WHEN 9 THEN "September" WHEN 10 THEN "Oktober" WHEN 11 THEN "November" WHEN 12 THEN "Desember" END AS bulan, opmbulan , opmpendapatan , opmbiaya , opmlrsebelumpajak, opmoperatingprofitmargin , opminputtgl FROM m8_f_opm;

-- RID=4004 | MENU=10 | ITEM=5 | RQUERY=1 | NAME=EBITDA (Earning Before Interest, Taxes, Depreciation, and Amortization) | FILE=EBITDA
SELECT ebtahun , CASE ebbulan WHEN 1 THEN "Januari" WHEN 2 THEN "Februari" WHEN 3 THEN "Maret" WHEN 4 THEN "April" WHEN 5 THEN "Mei" WHEN 6 THEN "Juni" WHEN 7 THEN "Juli" WHEN 8 THEN "Agustus" WHEN 9 THEN "September" WHEN 10 THEN "Oktober" WHEN 11 THEN "November" WHEN 12 THEN "Desember" END AS bulan, ebbulan , ebpendapatan , ebbiaya , ebebtida , ebinputtgl FROM m8_f_ebtida;

-- RID=4005 | MENU=10 | ITEM=6 | RQUERY=1 | NAME=Revenue Growth Rate | FILE=Revenue_Growth_Rate
SELECT rgrtahun , CASE rgrbulan WHEN 1 THEN "Januari" WHEN 2 THEN "Februari" WHEN 3 THEN "Maret" WHEN 4 THEN "April" WHEN 5 THEN "Mei" WHEN 6 THEN "Juni" WHEN 7 THEN "Juli" WHEN 8 THEN "Agustus" WHEN 9 THEN "September" WHEN 10 THEN "Oktober" WHEN 11 THEN "November" WHEN 12 THEN "Desember" END AS bulan, rgrbulan , rgrrevenue , rgrinputtgl FROM m8_f_rgr;

-- RID=4006 | MENU=10 | ITEM=7 | RQUERY=1 | NAME=Economic Value Added (EVA) | FILE=Economic_Value_Added
SELECT evtahun , CASE evbulan WHEN 1 THEN "Januari" WHEN 2 THEN "Februari" WHEN 3 THEN "Maret" WHEN 4 THEN "April" WHEN 5 THEN "Mei" WHEN 6 THEN "Juni" WHEN 7 THEN "Juli" WHEN 8 THEN "Agustus" WHEN 9 THEN "September" WHEN 10 THEN "Oktober" WHEN 11 THEN "November" WHEN 12 THEN "Desember" END AS bulan, evbulan , evlrsetelahpajak , evmodal, eveva , evinputtgl FROM m8_f_eva;

-- RID=4007 | MENU=10 | ITEM=8 | RQUERY=1 | NAME=Return On Investment (ROI) | FILE=Return_On_Investment
SELECT rotahun , CASE robulan WHEN 1 THEN "Januari" WHEN 2 THEN "Februari" WHEN 3 THEN "Maret" WHEN 4 THEN "April" WHEN 5 THEN "Mei" WHEN 6 THEN "Juni" WHEN 7 THEN "Juli" WHEN 8 THEN "Agustus" WHEN 9 THEN "September" WHEN 10 THEN "Oktober" WHEN 11 THEN "November" WHEN 12 THEN "Desember" END AS bulan, robulan , ropendapatan , robiaya, rolrsebelumpajak, ropajak , rolrsetelahpajak, roinvestasi , roroi , roinputtgl FROM m8_f_roi;

-- RID=4008 | MENU=10 | ITEM=9 | RQUERY=1 | NAME=Return On Capital Employed (ROCE) | FILE=Return_On_Capital_Employed
SELECT rocetahun , CASE rocebulan WHEN 1 THEN "Januari" WHEN 2 THEN "Februari" WHEN 3 THEN "Maret" WHEN 4 THEN "April" WHEN 5 THEN "Mei" WHEN 6 THEN "Juni" WHEN 7 THEN "Juli" WHEN 8 THEN "Agustus" WHEN 9 THEN "September" WHEN 10 THEN "Oktober" WHEN 11 THEN "November" WHEN 12 THEN "Desember" END AS bulan, rocebulan , rocependapatan , rocebiaya, rocelrsebelumpajak , rocemodal, rocenilai , roceinputtgl FROM m8_f_roce;

-- RID=4009 | MENU=10 | ITEM=10 | RQUERY=1 | NAME=Return On Assets (ROA)   | FILE=Return_On_Assets
SELECT roatahun , CASE roabulan WHEN 1 THEN "Januari" WHEN 2 THEN "Februari" WHEN 3 THEN "Maret" WHEN 4 THEN "April" WHEN 5 THEN "Mei" WHEN 6 THEN "Juni" WHEN 7 THEN "Juli" WHEN 8 THEN "Agustus" WHEN 9 THEN "September" WHEN 10 THEN "Oktober" WHEN 11 THEN "November" WHEN 12 THEN "Desember" END AS bulan, roabulan , roapendapatan , roabiaya, roalrsebelumpajak, roapajak, roalrsetelahpajak, roaasstet , roanilai , roainputtgl FROM m8_f_roa;

-- RID=4010 | MENU=10 | ITEM=11 | RQUERY=1 | NAME=Return On Equity (ROE)   | FILE=Return_On_Equity
SELECT roetahun , CASE roebulan WHEN 1 THEN "Januari" WHEN 2 THEN "Februari" WHEN 3 THEN "Maret" WHEN 4 THEN "April" WHEN 5 THEN "Mei" WHEN 6 THEN "Juni" WHEN 7 THEN "Juli" WHEN 8 THEN "Agustus" WHEN 9 THEN "September" WHEN 10 THEN "Oktober" WHEN 11 THEN "November" WHEN 12 THEN "Desember" END AS bulan, roebulan , roependapatan , roebiaya, roelrsebelumpajak, roepajak, roelrsetelahpajak, roeekuitas , roenilai , roeinputtgl FROM m8_f_roe;

-- RID=4011 | MENU=10 | ITEM=12 | RQUERY=1 | NAME=Debt-To-Equity (D/E) Ratio   | FILE=Debt_To_Equity
SELECT dtetahun , CASE dtebulan WHEN 1 THEN "Januari" WHEN 2 THEN "Februari" WHEN 3 THEN "Maret" WHEN 4 THEN "April" WHEN 5 THEN "Mei" WHEN 6 THEN "Juni" WHEN 7 THEN "Juli" WHEN 8 THEN "Agustus" WHEN 9 THEN "September" WHEN 10 THEN "Oktober" WHEN 11 THEN "November" WHEN 12 THEN "Desember" END AS bulan, dtebulan , dtehutang, dteekuitas, dtenilai, dteinputtgl FROM m8_f_dte;

-- RID=4012 | MENU=10 | ITEM=13 | RQUERY=1 | NAME=Days of sales outstanding (DSO)  | FILE=Days_of_sales_outstanding
SELECT dsotahun , CASE dsobulan WHEN 1 THEN "Januari" WHEN 2 THEN "Februari" WHEN 3 THEN "Maret" WHEN 4 THEN "April" WHEN 5 THEN "Mei" WHEN 6 THEN "Juni" WHEN 7 THEN "Juli" WHEN 8 THEN "Agustus" WHEN 9 THEN "September" WHEN 10 THEN "Oktober" WHEN 11 THEN "November" WHEN 12 THEN "Desember" END AS bulan, dsobulan , dsopiutang , dsopendapatan , dsonilai, dsoinputtgl FROM m8_f_dso;

-- RID=4013 | MENU=10 | ITEM=14 | RQUERY=1 | NAME=Days of sales in Inventory (DSI)  | FILE=Days_of_sales_in_Inventory
SELECT dsitahun , CASE dsibulan WHEN 1 THEN "Januari" WHEN 2 THEN "Februari" WHEN 3 THEN "Maret" WHEN 4 THEN "April" WHEN 5 THEN "Mei" WHEN 6 THEN "Juni" WHEN 7 THEN "Juli" WHEN 8 THEN "Agustus" WHEN 9 THEN "September" WHEN 10 THEN "Oktober" WHEN 11 THEN "November" WHEN 12 THEN "Desember" END AS bulan, dsibulan , dsipersediaan , dsihargapokok, dsinilai , dsiinputtgl FROM m8_f_dsi;

-- RID=4014 | MENU=10 | ITEM=15 | RQUERY=1 | NAME=Days of payables outstanding (DPO) | FILE=Days_of_payables_outstanding
SELECT dpotahun , CASE dpobulan WHEN 1 THEN "Januari" WHEN 2 THEN "Februari" WHEN 3 THEN "Maret" WHEN 4 THEN "April" WHEN 5 THEN "Mei" WHEN 6 THEN "Juni" WHEN 7 THEN "Juli" WHEN 8 THEN "Agustus" WHEN 9 THEN "September" WHEN 10 THEN "Oktober" WHEN 11 THEN "November" WHEN 12 THEN "Desember" END AS bulan, dpobulan , dpohutang , dpohargapokokpenjualan , dponilai , dpoinputtgl FROM m8_f_dpo;

-- RID=4015 | MENU=10 | ITEM=16 | RQUERY=1 | NAME=Working Capital Turn Over Ratio (WCTR) | FILE=Working_Capital_Turn_Over_Ratio
SELECT wtahun , CASE wbulan WHEN 1 THEN "Januari" WHEN 2 THEN "Februari" WHEN 3 THEN "Maret" WHEN 4 THEN "April" WHEN 5 THEN "Mei" WHEN 6 THEN "Juni" WHEN 7 THEN "Juli" WHEN 8 THEN "Agustus" WHEN 9 THEN "September" WHEN 10 THEN "Oktober" WHEN 11 THEN "November" WHEN 12 THEN "Desember" END AS bulan, wbulan , wpendapatan , wasset , wliabilitas , wwctr , winputtgl FROM m8_f_wctr;

-- RID=4016 | MENU=10 | ITEM=17 | RQUERY=1 | NAME=CAPEX To Sales Ratio | FILE=CAPEX
SELECT catahun , CASE cabulan WHEN 1 THEN "Januari" WHEN 2 THEN "Februari" WHEN 3 THEN "Maret" WHEN 4 THEN "April" WHEN 5 THEN "Mei" WHEN 6 THEN "Juni" WHEN 7 THEN "Juli" WHEN 8 THEN "Agustus" WHEN 9 THEN "September" WHEN 10 THEN "Oktober" WHEN 11 THEN "November" WHEN 12 THEN "Desember" END AS bulan, cabulan , casaldoawalat , casaldoakhirat , capendapatan , cacapex , cainputtgl FROM m8_f_capex;

