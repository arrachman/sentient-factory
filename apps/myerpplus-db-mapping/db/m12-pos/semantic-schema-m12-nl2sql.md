# Semantic Schema M12 NL2SQL

This guide helps a readonly AI agent generate SQL for the POS or retail transaction flow domain.

## Main Areas

- `MASTER_SETUP`: POS categories, POS types, hardware, area, and settings
- `PROMO_LOYALTY`: bonus item, additional item, discount, voucher, and point
- `TRANSACTION_HEADERS`: header documents such as `m_12_st`, `m_12_ai`, `m_12_bi`, `m_12_ppv`
- `TRANSACTION_DETAILS`: item detail, bonus detail, substitution, printing, and payment relations
- `HISTORY`: audit trail for master or transaction changes

## Agent Rules

- prioritize `m_12_st` and `m_12_st_detail` for POS sales analysis
- use `m_12_pos_*` for setup, promo, loyalty, voucher, and configuration
- use `_history` tables only when the user explicitly asks for history or status change
- do not assume final accounting impact or final stock impact if the query only comes from POS promo/setup tables
- stay readonly: `SELECT` only, never `INSERT`, `UPDATE`, `DELETE`, `CALL`, or DDL

## Join Hints

- `sales_transaction_flow`: `m_12_st.stid = m_12_st_detail.idst`
- `promo_additional_flow`: `m_12_ai.aiid = m_12_ai_detail.idai`; `m_12_ai.aiid = m_12_ai_additional.idai`
- `promo_bonus_flow`: `m_12_bi.biid = m_12_bi_detail.idbi`; `m_12_bi.biid = m_12_bi_bonus.idbi`
- `voucher_flow`: `m_12_ppv.ppvid = m_12_ppv_detail.idppv`; `m_12_ppv.ppvid = m_12_ppv_pay.idppv`
- `area_and_category_flow`: `m_12_area.akategori = m_12_area_category.ackode`; `m_12_pos_item.pikategori = m_12_pos_category.pckode`
- `type_and_class_product_flow`: `m_12_pos_type.ptkode = m_12_pos_type_class_product.idpostype`

## Cross-Document Lineage Keys

In M12, the main relations are mostly header-to-detail relations inside the POS domain. However, the agent still needs to understand that some operational documents and voucher flows must be traced from detail or payment tables.

### POS transactions

```sql
m_12_st_detail.idst -> m_12_st.stid
```

### Additional-item promo

```sql
m_12_ai_detail.idai -> m_12_ai.aiid
m_12_ai_additional.idai -> m_12_ai.aiid
```

### Bonus-item promo

```sql
m_12_bi_detail.idbi -> m_12_bi.biid
m_12_bi_bonus.idbi -> m_12_bi.biid
```

### POS voucher

```sql
m_12_ppv_detail.idppv -> m_12_ppv.ppvid
m_12_ppv_pay.idppv -> m_12_ppv.ppvid
```

### POS voucher to formal sales invoice

```sql
m_12_pos_voucher_out.voidtransaksi -> m5_si.siid
```

Practical rules:

- for revenue and sold items, start from `m_12_st_detail`
- for promo rules, start from `m_12_ai_detail`, `m_12_bi_detail`, or `m_12_pos_*`
- for vouchers related to formal sales invoices, trace through `m_12_pos_voucher_out`

## Cross-Module Relation Keys

This section is important so the AI agent does not invent cross-domain joins from POS.

### POS to master contact and item

```sql
m_12_st.stkontak -> m1_contact.kid
m_12_ppv.ppvcustomer -> m1_contact.kid
m_12_st_detail.idbarang -> m1_item.bid
m_12_pos_item.piidbarang -> m1_item.bid
```

Business meaning:

- customer/contact labels for POS transactions are safest when taken from master `M1`
- item labels for both POS transactions and POS setup are safest when taken from master `M1`

### POS to formal sales

```sql
m_12_pos_voucher_out.voidtransaksi -> m5_si.siid
```

Business meaning:

- the most stable cross-module relation from POS to formal sales is the POS voucher consumed on a formal sales invoice
- if the user asks which formal invoice is related to a POS voucher, use the route `M12 -> M5`

### POS boundary to finance and inventory

- `M12` is the retail/POS and promo domain
- if the user asks about posting journals, cash-bank, or ledger, identify the relevant POS transaction first and then move to `M2`
- if the user asks about stock or warehouse movement, identify the relevant POS transaction or item first and then move to `M3`
- do not assume one stable direct foreign key `M12 -> M2` or `M12 -> M3` if the active source does not show it

## Key Tables

- `m_12_st`: POS sales transaction
- `m_12_st_detail`: POS transaction item detail
- `m_12_pos_item`: mapping from item to POS category
- `m_12_pos_category`: POS category master
- `m_12_pos_bonus_item`, `m_12_pos_additional_item`, `m_12_pos_discount_item`: promo rules
- `m_12_ppv`, `m_12_ppv_detail`, `m_12_ppv_pay`: voucher and POS payment structures

## Guardrails

- if the question is ambiguous between promo master rules and actual transactions, prefer actual transactions first
- if the user asks for revenue, sold quantity, or transaction value, start from `m_12_st` and `m_12_st_detail`
- if the user asks for promo configuration, start from `m_12_pos_*`, `m_12_ai*`, `m_12_bi*`, `m_12_di*`, or `m_12_sbi*`
