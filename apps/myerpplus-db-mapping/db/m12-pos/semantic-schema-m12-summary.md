# Semantic Schema M12 Summary

Sources: `semantic-schema-m12.json`, `m12-queries.md`, `m12-queries-by-type.md`, `m0_report_rmoduleid_12.sql`

## Overview

- total schema tables: `60`
- total active tables detected: `60`
- total summary modules: `5`
- total join hints: `6`
- query counts: `SELECT 269`, `INSERT 93`, `UPDATE 41`, `DELETE 127`

## Join Hints

- `sales_transaction_flow`: Relationship from POS transaction headers to sales-item details.
- `promo_additional_flow`: Relationship from additional-item promotion headers to rules and additional items.
- `promo_bonus_flow`: Relationship from bonus-item promotion headers to rules and bonus items.
- `voucher_flow`: Relationship from POS vouchers to voucher details and transaction payments.
- `area_and_category_flow`: Relationship from POS areas to area categories and POS categories.
- `type_and_class_product_flow`: Relationship from POS types to product classes.

## Detail-Level Relation Keys

This section is important for the AI agent because many M12 relationships are safest to read from detail or payment relations, not from headers alone.

- `m_12_st_detail.idst -> m_12_st.stid`
  Used to trace POS line items to the cashier-transaction header.
- `m_12_ai_detail.idai -> m_12_ai.aiid`
  Used to trace additional-item rules to the AI promotion header.
- `m_12_ai_additional.idai -> m_12_ai.aiid`
  Used to trace additional items to the AI promotion header.
- `m_12_bi_detail.idbi -> m_12_bi.biid`
  Used to trace bonus-item rules to the BI promotion header.
- `m_12_bi_bonus.idbi -> m_12_bi.biid`
  Used to trace bonus items to the BI promotion header.
- `m_12_ppv_detail.idppv -> m_12_ppv.ppvid`
  Used to trace voucher details to the POS-voucher header.
- `m_12_ppv_pay.idppv -> m_12_ppv.ppvid`
  Used to trace voucher-payment relations to the POS-voucher header.
- `m_12_pos_voucher_out.voidtransaction -> m5_si.siid`
  Used to trace consumed POS vouchers to the formal sales invoice.

Practical rules:

- for revenue and sold-item analysis, start from `m_12_st_detail`
- for promotion rules, start from promotion detail tables or `m_12_pos_*`
- for vouchers tied to formal sales invoices, trace through `m_12_pos_voucher_out`

## Cross-Module Relation Keys

This section is important for the AI agent so POS relations to other modules stay controlled and do not drift into invented joins.

- `m_12_st.stkontak -> m1_contact.kid`
  Used when POS transactions need customer/contact labels from master data.
- `m_12_ppv.ppvcustomer -> m1_contact.kid`
  Used when POS vouchers need customer/contact labels from master data.
- `m_12_st_detail.idbarang -> m1_item.bid`
  Used when POS transaction items need item labels from the master item table.
- `m_12_pos_item.piidbarang -> m1_item.bid`
  Used when POS item setup needs item labels from the master item table.
- `m_12_pos_voucher_out.voidtransaction -> m5_si.siid`
  Used when POS vouchers are traced to the formal sales invoice.

Practical rules:

- for customer and item labels, the most stable cross-module relation is to `M1`
- for formal invoices related to POS vouchers, use the `M12 -> M5` relation
- for journal or cash-bank requirements, identify the POS transaction first and then move to `M2`
- for stock or warehouse-mutation requirements, identify the POS transaction/item first and then move to `M3`
- do not assume a stable direct foreign key from `M12 -> M2` or `M12 -> M3` unless active sources show it

## Master Setup

- total tables: `9`

### Tables

- `m_12_area`: POS operational-area master. Key columns: aaktif, acaktif, anotes, acnotes, accustomdate1, accustomdate2, accustomdate3, accustomdbl1, accustomdbl2, accustomdbl3, accustomint1, accustomint2
- `m_12_area_category`: POS area-category master. Key columns: acaktif, acnotes, accustomdate1, accustomdate2, accustomdate3, accustomdbl1, accustomdbl2, accustomdbl3, accustomint1, accustomint2, accustomint3, accustomtext1
- `m_12_pos_category`: POS category master for grouping items or programs. Key columns: pcaktif, pcnotes, pccustomdate1, pccustomdate2, pccustomdate3, pccustomdbl1, pccustomdbl2, pccustomdbl3, pccustomint1, pccustomint2, pccustomint3, pccustomtext1
- `m_12_pos_category_setting`: Additional settings per POS category. Key columns: pcsgrup, pcscategory, pcskode, pcsmodule, pcsvalue
- `m_12_pos_hardware`: POS hardware configuration. Key columns: phcashdrawer, phcashdrawerport, phcashdrawerprinter, phcetak, phcetakbarang, phcomputerip, phcomputermac, phcustomdate1, phcustomdate2, phcustomdate3, phcustomdbl1, phcustomdbl2
- `m_12_pos_item`: List of items allowed per POS category. Key columns: picustomdate1, picustomdate2, picustomdate3, picustomdbl1, picustomdbl2, picustomdbl3, picustomint1, picustomint2, picustomint3, picustomtext1, picustomtext2, picustomtext3
- `m_12_pos_setting`: Main configuration for POS behavior. Key columns: scombodata, sgrup, sjenisinputan, skode, smodule, snama, svalue, stipedata, suraian, surutan
- `m_12_pos_type`: POS type master. Key columns: ptaktif, ptnotes, ptcustomdate1, ptcustomdate2, ptcustomdate3, ptcustomdbl1, ptcustomdbl2, ptcustomdbl3, ptcustomint1, ptcustomint2, ptcustomint3, ptcustomtext1
- `m_12_pos_type_class_product`: Mapping from POS type to class product. Key columns: idhistory, kelasproduk, ptaktif, ptnotes, ptcustomdate1, ptcustomdate2, ptcustomdate3, ptcustomdbl1, ptcustomdbl2, ptcustomdbl3, ptcustomint1, ptcustomint2

## Promo and Loyalty

- total tables: `16`

### Tables

- `m_12_pos_additional_item`: Active additional-item master per POS category. Key columns: aiautonotransaction, aicabang, ainotes, aicetakanke, aicustomdate1, aicustomdate2, aicustomdate3, aicustomdbl1, aicustomdbl2, aicustomdbl3, aicustomint1, aicustomint2
- `m_12_pos_additional_item_detail`: Additional-item detail rows for the additional-item master. Key columns: aicategory, customdate1, customdate2, customdate3, customdbl1, customdbl2, customdbl3, customint1, customint2, customint3, customtext1, customtext2
- `m_12_pos_bonus_item`: Active bonus-item master per POS category. Key columns: biautonotransaction, bicabang, binotes, bicetakanke, bicustomdate1, bicustomdate2, bicustomdate3, bicustomdbl1, bicustomdbl2, bicustomdbl3, bicustomint1, bicustomint2
- `m_12_pos_bonus_item_detail`: Bonus-item detail rows for the bonus-item master. Key columns: bicategory, notes, customdate1, customdate2, customdate3, customdbl1, customdbl2, customdbl3, customint1, customint2, customint3, customtext1
- `m_12_pos_bonus_trans`: Bonus notes or bonus-usage rows generated by POS transactions. Key columns: biautonotransaction, bicabang, binotes, bicetakanke, bicustomdate1, bicustomdate2, bicustomdate3, bicustomdbl1, bicustomdbl2, bicustomdbl3, bicustomint1, bicustomint2
- `m_12_pos_bonus_trans_detail`: Bonus-item detail generated by POS transactions. Key columns: bicategory, notes, customdate1, customdate2, customdate3, customdbl1, customdbl2, customdbl3, customint1, customint2, customint3, customtext1
- `m_12_pos_discount_category_customer`: Discount master by POS customer category. Key columns: dcccustomdate1, dcccustomdate2, dcccustomdate3, dcccustomdbl1, dcccustomdbl2, dcccustomdbl3, dcccustomint1, dcccustomint2, dcccustomint3, dcccustomtext1, dcccustomtext2, dcccustomtext3
- `m_12_pos_discount_category_item`: Discount master by POS item category. Key columns: dcicustomdate1, dcicustomdate2, dcicustomdate3, dcicustomdbl1, dcicustomdbl2, dcicustomdbl3, dcicustomint1, dcicustomint2, dcicustomint3, dcicustomtext1, dcicustomtext2, dcicustomtext3
- `m_12_pos_discount_item`: Item-discount master for POS. Key columns: diautonotransaction, dicabang, dinotes, dicetakanke, dicustomdate1, dicustomdate2, dicustomdate3, dicustomdbl1, dicustomdbl2, dicustomdbl3, dicustomint1, dicustomint2
- `m_12_pos_point_category_item`: Reward-point master per POS item category. Key columns: pcicustomdate1, pcicustomdate2, pcicustomdate3, pcicustomdbl1, pcicustomdbl2, pcicustomdbl3, pcicustomint1, pcicustomint2, pcicustomint3, pcicustomtext1, pcicustomtext2, pcicustomtext3
- `m_12_pos_point_item`: Reward-point master per POS item. Key columns: picustomdate1, picustomdate2, picustomdate3, picustomdbl1, picustomdbl2, picustomdbl3, picustomint1, picustomint2, picustomint3, picustomtext1, picustomtext2, picustomtext3
- `m_12_pos_point_transaction`: Point notes or point results generated by POS transactions. Key columns: ptaktif, ptnotes, ptcustomdate1, ptcustomdate2, ptcustomdate3, ptcustomdbl1, ptcustomdbl2, ptcustomdbl3, ptcustomint1, ptcustomint2, ptcustomint3, ptcustomtext1
- `m_12_pos_substitution_item`: POS substitution-item master. Key columns: si1alamat1, si1alamat2, si1alamat3, si2alamat1, si2alamat2, si2alamat3, siasalbarang, siasalbarangcategory, siautonotransaction, sibagianpenjualan, sibayarjmlpoin, sibayarkdebit
- `m_12_pos_substitution_item_detail`: POS substitution-item detail rows. Key columns: carabayar, notes, customdate1, customdate2, customdate3, customdbl1, customdbl2, customdbl3, customint1, customint2, customint3, customtext1
- `m_12_pos_voucher_in`: Incoming or received POS vouchers. Key columns: picustomdate1, picustomdate2, picustomdate3, picustomdbl1, picustomdbl2, picustomdbl3, picustomint1, picustomint2, picustomint3, picustomtext1, picustomtext2, picustomtext3
- `m_12_pos_voucher_out`: Outgoing or redeemed POS vouchers. Key columns: void, voidtransaction, voidvi, voisclose, vojmlbayar, vojmlbayarvalas, vomorang, vosumber

## Transaction Headers

- total tables: `9`

### Tables

- `m_12_ai`: Header for additional-item promotions by POS category. Key columns: aiautonotransaction, aicabang, ainotes, aicetakanke, aicustomdate1, aicustomdate2, aicustomdate3, aicustomdbl1, aicustomdbl2, aicustomdbl3, aicustomint1, aicustomint2
- `m_12_bi`: Header for POS bonus-item promotions. Key columns: biautonotransaction, bicabang, binotes, bicetakanke, bicustomdate1, bicustomdate2, bicustomdate3, bicustomdbl1, bicustomdbl2, bicustomdbl3, bicustomint1, bicustomint2
- `m_12_cpa`: Header for POS price-category settings or approval rules. Key columns: cpaautonotransaction, cpacabang, cpanotes, cpacetakanke, cpacustomdate1, cpacustomdate2, cpacustomdate3, cpacustomdbl1, cpacustomdbl2, cpacustomdbl3, cpacustomint1, cpacustomint2
- `m_12_di`: Header for POS item-discount promotions. Key columns: diautonotransaction, dicabang, dinotes, dicetakanke, dicustomdate1, dicustomdate2, dicustomdate3, dicustomdbl1, dicustomdbl2, dicustomdbl3, dicustomint1, dicustomint2
- `m_12_lp`: Header for POS loyalty programs or point transactions. Key columns: lpautonotransaction, lpbagianlp, lpbagianlpkontak, lpcabang, lpnotes, lpcetakanke, lpcustomdate1, lpcustomdate2, lpcustomdate3, lpcustomdbl1, lpcustomdbl2, lpcustomdbl3
- `m_12_ppa`: Header for advanced POS promotions or advanced POS rule settings. Key columns: ppaautonotransaction, ppabagianppa, ppabagianppakontak, ppacabang, ppanotes, ppacetakanke, ppacustomdate1, ppacustomdate2, ppacustomdate3, ppacustomdbl1, ppacustomdbl2, ppacustomdbl3
- `m_12_ppv`: POS voucher header. Key columns: bank, carabayar, notes, idppv, idppvcarabayar, isclose, jumlah, jumlahvalas, kurs, morang, noacbank, nogiro
- `m_12_sbi`: Header for substitution-item or special-bonus POS programs. Key columns: sbiautonotransaction, sbicabang, sbinotes, sbicetakanke, sbicustomdate1, sbicustomdate2, sbicustomdate3, sbicustomdbl1, sbicustomdbl2, sbicustomdbl3, sbicustomint1, sbicustomint2
- `m_12_st`: POS sales-transaction header. Key columns: kode, nama, stautonotransaction, stcabang, stnotes, stcetakanke, stcustomdate1, stcustomdate2, stcustomdate3, stcustomdbl1, stcustomdbl2, stcustomdbl3

## Transaction Details

- total tables: `14`

### Tables

- `m_12_ai_additional`: List of additional items granted by AI promotions. Key columns: customdate1, customdate2, customdate3, customdbl1, customdbl2, customdbl3, customint1, customint2, customint3, customtext1, customtext2, customtext3
- `m_12_ai_detail`: Main-item rules that trigger additional-item promotions. Key columns: aicategory, notes, customdate1, customdate2, customdate3, customdbl1, customdbl2, customdbl3, customint1, customint2, customint3, customtext1
- `m_12_bi_bonus`: List of bonus items from BI promotions. Key columns: biautonotransaction, bicabang, binotes, bicetakanke, bicustomdate1, bicustomdate2, bicustomdate3, bicustomdbl1, bicustomdbl2, bicustomdbl3, bicustomint1, bicustomint2
- `m_12_bi_detail`: Main-item rules that trigger bonus-item promotions. Key columns: biautonotransaction, bicabang, binotes, bicetakanke, bicustomdate1, bicustomdate2, bicustomdate3, bicustomdbl1, bicustomdbl2, bicustomdbl3, bicustomint1, bicustomint2
- `m_12_cpa_detail`: Item detail or rule detail on CPA documents. Key columns: notes, cpaautonotransaction, cpacabang, cpanotes, cpacetakanke, cpacustomdate1, cpacustomdate2, cpacustomdate3, cpacustomdbl1, cpacustomdbl2, cpacustomdbl3, cpacustomint1
- `m_12_di_detail`: Main-item rules that trigger item discounts. Key columns: notes, customdate1, customdate2, customdate3, customdbl1, customdbl2, customdbl3, customint1, customint2, customint3, customtext1, customtext2
- `m_12_lp_cetak`: Print history for loyalty or POS documents. Key columns: cabang, notes, costcenter, customdate1, customdate2, customdate3, customdbl1, customdbl2, customdbl3, customtext1, customtext2, customtext3
- `m_12_lp_detail`: Per-item detail or accumulation detail for loyalty programs. Key columns: cabang, notes, costcenter, customdate1, customdate2, customdate3, customdbl1, customdbl2, customdbl3, customtext1, customtext2, customtext3
- `m_12_ppa_detail`: Item detail or rule detail for PPA documents. Key columns: cabang, notes, costcenter, customdate1, customdate2, customdate3, customdbl1, customdbl2, customdbl3, customtext1, customtext2, customtext3
- `m_12_ppv_detail`: POS voucher detail per item or category. Key columns: notes, costcenter, customdate1, customdate2, customdate3, customdbl1, customdbl2, customdbl3, customtext1, customtext2, customtext3, diskon
- `m_12_ppv_pay`: Relationship from POS vouchers to payment or transaction rows. Key columns: bank, carabayar, notes, idppv, idppvcarabayar, isclose, jumlah, jumlahvalas, kurs, morang, noacbank, nogiro
- `m_12_sbi_detail`: Main-item rules for substitution-bonus programs. Key columns: notes, customdate1, customdate2, customdate3, customdbl1, customdbl2, customdbl3, customint1, customint2, customint3, customtext1, customtext2
- `m_12_sbi_substitution`: List of substitution items from SBI programs. Key columns: customdate1, customdate2, customdate3, customdbl1, customdbl2, customdbl3, customint1, customint2, customint3, customtext1, customtext2, customtext3
- `m_12_st_detail`: POS sales-transaction item detail. Key columns: notes, customdate1, customdate2, customdate3, customdbl1, customdbl2, customdbl3, customint1, customint2, customint3, customtext1, customtext2

## History Tables

- total tables: `12`

### Tables

- `m_12_area_category_history`: Status-change history for m_12_area_category. Key columns: acaktif, acnotes, accustomdate1, accustomdate2, accustomdate3, accustomdbl1, accustomdbl2, accustomdbl3, accustomint1, accustomint2, accustomint3, accustomtext1
- `m_12_area_history`: Status-change history for m_12_area. Key columns: aaktif, anotes, acustomdate1, acustomdate2, acustomdate3, acustomdbl1, acustomdbl2, acustomdbl3, acustomint1, acustomint2, acustomint3, acustomtext1
- `m_12_bi_bonus_history`: Status-change history for m_12_bi_bonus. Key columns: customdate1, customdate2, customdate3, customdbl1, customdbl2, customdbl3, customint1, customint2, customint3, customtext1, customtext2, customtext3
- `m_12_bi_detail_history`: Status-change history for m_12_bi_detail. Key columns: bicategory, notes, customdate1, customdate2, customdate3, customdbl1, customdbl2, customdbl3, customint1, customint2, customint3, customtext1
- `m_12_bi_history`: Status-change history for m_12_bi. Key columns: biautonotransaction, bicabang, binotes, bicetakanke, bicustomdate1, bicustomdate2, bicustomdate3, bicustomdbl1, bicustomdbl2, bicustomdbl3, bicustomint1, bicustomint2
- `m_12_cpa_detail_history`: Status-change history for m_12_cpa_detail. Key columns: notes, customdate1, customdate2, customdate3, customdbl1, customdbl2, customdbl3, customtext1, customtext2, customtext3, idcpa, idcpadetail
- `m_12_cpa_history`: Status-change history for m_12_cpa. Key columns: cpaautonotransaction, cpacabang, cpanotes, cpacetakanke, cpacustomdate1, cpacustomdate2, cpacustomdate3, cpacustomdbl1, cpacustomdbl2, cpacustomdbl3, cpacustomint1, cpacustomint2
- `m_12_di_detail_history`: Status-change history for m_12_di_detail. Key columns: notes, customdate1, customdate2, customdate3, customdbl1, customdbl2, customdbl3, customint1, customint2, customint3, customtext1, customtext2
- `m_12_di_history`: Status-change history for m_12_di. Key columns: diautonotransaction, dicabang, dinotes, dicetakanke, dicustomdate1, dicustomdate2, dicustomdate3, dicustomdbl1, dicustomdbl2, dicustomdbl3, dicustomint1, dicustomint2
- `m_12_pos_category_history`: Status-change history for m_12_pos_category. Key columns: pcaktif, pcnotes, pccustomdate1, pccustomdate2, pccustomdate3, pccustomdbl1, pccustomdbl2, pccustomdbl3, pccustomint1, pccustomint2, pccustomint3, pccustomtext1
- `m_12_pos_type_class_product_history`: Status-change history for m_12_pos_type_class_product. Key columns: idhistory, kelasproduk, tipepos
- `m_12_pos_type_history`: Status-change history for m_12_pos_type. Key columns: ptaktif, ptnotes, ptcustomdate1, ptcustomdate2, ptcustomdate3, ptcustomdbl1, ptcustomdbl2, ptcustomdbl3, ptcustomint1, ptcustomint2, ptcustomint3, ptcustomtext1
