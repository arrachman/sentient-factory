# Semantic Cross-Module Lineage

This document summarizes the safest cross-module relationships in MyERPPlus for readonly AI agents.

Its main focus is:

- high-confidence cross-module relations
- the document anchor that should be chosen first
- boundary rules so the agent does not invent joins across domains

This document does not try to make every module directly joinable to every other module. The core principle is:

- start from the module where the business document originates
- use only stable foreign keys
- move to another module only when the user intent clearly leaves the source domain

## Module Backbone

### `M1` as the shared dimension layer

`M1 master data` is the cross-module foundation for business labels such as:

- contact / customer / supplier
- item / product
- branch / location / project / division

Relations to `M1` are usually more stable than direct relations between operational documents.

### `M2` as the finance posting boundary

Use `M2 finance` when the question is clearly about:

- cash / bank
- payment allocation
- posted journal
- ledger / accounting impact

Operational documents in `M4`, `M5`, and `M12` may remain the business anchor, but once the user asks about journal or cash/bank impact, the agent should move into `M2`.

### `M3` as the inventory boundary

Use `M3 inventory` when the question is clearly about:

- stock
- warehouse movement
- stock transfer
- stock receiving
- stock opname / adjustment

Documents in `M4`, `M5`, and `M12` may remain the business anchor, but once the user intent shifts to warehouse inventory movement, the agent should move into `M3`.

## High-Confidence Cross-Module Relations

### `M5 Sales -> M1 Master Data`

Safest relation:

```sql
m5_*customer -> m1_contact.kid
m5_*_detail.idbarang -> m1_item.bid
```

Meaning:

- sales customer labels should come from `m1_contact`
- item labels in SQ, SO, PL, DO, DR, PI, SI, RNR, and SR should come from `m1_item`

### `M12 POS -> M1 Master Data`

Safest relation:

```sql
m_12_st.stkontak -> m1_contact.kid
m_12_ppv.ppvcustomer -> m1_contact.kid
m_12_st_detail.idbarang -> m1_item.bid
m_12_pos_item.piidbarang -> m1_item.bid
```

Meaning:

- POS transactions and POS vouchers still rely on master contact and item from `M1`
- POS setup tables are not the authoritative item master; item labels should still come from `M1`

### `M12 POS -> M5 Sales`

Most stable cross-module relation:

```sql
m_12_pos_voucher_out.voidtransaksi -> m5_si.siid
```

Meaning:

- a POS voucher actually consumed by a formal sales invoice points to `m5_si`
- this is the main route when the user asks which formal sales invoice used a POS voucher

## Semantic Boundaries

### `M5 Sales -> M2 Finance`

Use `M5` as the anchor when the question starts from:

- sales order
- delivery
- invoice
- return
- receivable collection

Move into `M2` when the question changes into:

- invoice posting journal
- cash / bank receipt
- payment allocation
- ledger / account movement

Rule:

- do not assume one stable direct foreign key `M5 -> M2`
- identify the relevant `M5` document first, then locate the relevant finance representation in `M2`

### `M5 Sales -> M3 Inventory`

Use `M5` as the anchor when the question starts from:

- DO
- DR
- RNR
- SR

Move into `M3` when the question changes into:

- warehouse stock
- inbound / outbound movement
- in-transit stock position
- adjustment / opname

Rule:

- `M5` represents the commercial or logistics side of sales
- `M3` represents the formal inventory side
- do not force a direct join if the active source does not show a stable FK

### `M12 POS -> M2 Finance`

Use `M12` as the anchor when the question starts from:

- cashier transactions
- promo
- voucher
- loyalty

Move into `M2` when the question changes into:

- POS posting journal
- cash-bank accounting impact
- retail sales ledger impact

Rule:

- `M12` is not the final journal source
- do not invent a direct foreign key `M12 -> M2` if the active schema does not show a stable relation

### `M12 POS -> M3 Inventory`

Use `M12` as the anchor when the question starts from:

- sold POS items
- vouchers or promos affecting items

Move into `M3` when the question changes into:

- remaining stock
- warehouse movement for POS items
- retail inventory effect

Rule:

- `M12` is the retail transaction flow domain
- `M3` is the formal inventory domain
- the agent should change domain only when the user intent is truly inventory-oriented

## Common Agent Tracing Patterns

### POS voucher to formal invoice

```sql
m_12_pos_voucher_out.voidtransaksi -> m5_si.siid
```

If the user also asks for customer or item:

```sql
m5_si.sicustomer -> m1_contact.kid
m5_si_detail.idbarang -> m1_item.bid
```

### Sales invoice to master labels

```sql
m5_si.sicustomer -> m1_contact.kid
m5_si_detail.idbarang -> m1_item.bid
```

If the user asks for document origin:

```sql
m5_si_detail -> m5_so_detail / m5_do_detail / m5_pl_detail / m5_pi_detail / m5_dr_detail
```

### POS transaction to customer and item labels

```sql
m_12_st.stkontak -> m1_contact.kid
m_12_st_detail.idbarang -> m1_item.bid
```

If the user asks about promo or voucher:

```sql
m_12_ppv -> m_12_ppv_detail / m_12_ppv_pay
```

## What The Agent Must Not Do

- do not jump from sales or POS directly into finance without confirming that the user intent is accounting
- do not jump from sales or POS directly into inventory without confirming that the user intent is stock movement
- do not use POS setup tables as the main item master
- do not treat `M5` or `M12` as a reliable source of posted journals
- do not create header-to-header cross-module joins when the stable relation exists only at detail level

## Recommended Agent Strategy

1. identify the source business document first
2. keep the query inside the source domain as long as possible
3. use `M1` for customer, supplier, item, branch, and location labels
4. move to `M2` only when finance meaning is explicit
5. move to `M3` only when inventory meaning is explicit
6. prefer detail-level lineage over guessed header-level joins
