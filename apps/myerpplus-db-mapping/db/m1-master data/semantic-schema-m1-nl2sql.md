# M1 NL2SQL Guide

Primary sources:
- `semantic-schema-m1.json`
- `semantic-schema-m1-summary.md`
- `m1-queries.md`
- `m1-queries-by-type.md`

Purpose:
- help select the correct M1 master-data tables
- help choose safe reference joins
- provide natural business synonyms for retrieval
- highlight the master relationships most frequently used across domains

## Main Table Coverage

- `m1_contact`, `m1_contact_category`, `m1_contact_terms`, `m1_contact_price`: contact master and commercial setup
- `m1_item`, `m1_item_category`, `m1_item_type`, `m1_item_price`, `m1_item_supplier`, `m1_item_stock_warehouse`, `m1_item_location`, `m1_item_location_warehouse`, `m1_item_permission`, `m1_item_transaction`: item master and product setup
- `m1_warehouse`: warehouse master
- `m1_branch`, `m1_location`, `m1_division`, `m1_department`, `m1_subdepartment`, `m1_subdivision`, `m1_section`, `m1_project`, `m1_cost_center`: organization structure
- `m1_coa`: account master
- `m1_terms`, `m1_tax`, `m1_currency`, `m1_bank`, `m1_expedition`: commercial and finance reference masters
- `m1_country`, `m1_province`, `m1_city`: geography master
- `m1_class_product`, `m1_price_category`, `m1_price_category_detail`, `m1_material`, `m1_merk`, `m1_model`, `m1_size`, `m1_type_sa`, `m1_unit`, `m1_other_cost`: product attributes and classification
- `m1_transaction_note`, `m1_transaction_note_detail`: transaction notes by document source

## Business Synonyms

- `CONTACT`: contact, customer, supplier, salesman, business partner
- `ITEM`: goods, product, item, SKU
- `WAREHOUSE`: warehouse
- `COA`: chart of accounts, account, ledger account
- `BRANCH`: branch
- `LOCATION`: location
- `TERMS`: payment terms
- `TAX`: tax
- `PRICE CATEGORY`: price category
- `TRANSACTION NOTE`: transaction notes, notes by document source

## Primary Join Hints

### Contact commercial hierarchy

```sql
m1_contact.kkategori = m1_contact_category.cckode
m1_contact.kkategoricustomer = m1_customer_category.cckode
m1_contact.kkategorisupplier = m1_supplier_category.sckode
m1_contact.kkategorisalesman = m1_salesman_category.sckode
m1_contact.ksalesman = m1_contact.kid
```

### Item classification and related master

```sql
m1_item.bkelasproduk = m1_class_product.cpkode
m1_item.bsubdepartemen = m1_subdepartment.sdpkode
m1_item.bkomisi = m1_selling_point.spid
```

### Warehouse and organization

```sql
m1_warehouse.wdivisi = m1_division.dkode
m1_warehouse.wlokasi = m1_location.lkode
m1_location.lcabang = m1_branch.bkode
```

### COA master reference

```sql
m1_coa.cparent = m1_coa.cnomor
m1_coa.ccabang = m1_branch.bkode
m1_coa.clokasi = m1_location.lkode
m1_coa.cdivisi = m1_division.dkode
m1_coa.ckodebank = m1_bank.bkode
m1_coa.cmorang = m1_currency.ckode
```

### Transaction note

```sql
m1_transaction_note.tnkode = m1_transaction_note_detail.tndkode
m1_transaction_note.tnsumber = m1_transaction_note_detail.tndsumber
```

## Polymorphic Relations

- No explicit polymorphic relationships were detected in M1.

## Table Selection Rules

- Use `m1_contact` for customer, supplier, salesman, or business-contact questions.
- Use `m1_item` for products, items, item setup, item classification, and selling or purchasing attributes.
- Use `m1_warehouse`, `m1_branch`, `m1_location`, and `m1_division` for organization and warehouse structure.
- Use `m1_coa` for account lookup, opening balance structure, parent-child accounts, or transaction-account references.
- Use detail tables such as `m1_price_category_detail` or `m1_transaction_note_detail` when the user needs row-level setup by item or source.
- Use reference tables such as `m1_terms`, `m1_tax`, `m1_currency`, and `m1_bank` when the user asks for payment terms, tax, currency, or bank setup.

## Important Rules

- M1 is a master-data domain, not a staged document-flow domain.
- Most M1 queries are listings, lookups, setup, and reference joins.
- Avoid assuming foreign keys that are not visible in active queries.
- If the question is about customers, suppliers, or salesmen, start from `m1_contact` and join categories or salesman references only when needed.
- If the question is about products or items, start from `m1_item` and then join classification tables as needed.
- If the question is about accounts, use `m1_coa` and pay attention to parent-child hierarchy and organizational dimensions.
- `custom*` fields are extension fields. Avoid them unless explicitly requested.

## Safe Query Patterns

### Contact master listing

```sql
SELECT kkode, knama, kkategori, kaktif
FROM m1_contact
```

### Item master listing

```sql
SELECT bkode, bnama, bkategori, btipe
FROM m1_item
```

### Account lookup and parent hierarchy

```sql
SELECT cnomor, cnama, cparent
FROM m1_coa
```

### Warehouses by location and division

```sql
SELECT w.wkode, w.wnama, l.lnama, d.dnama
FROM m1_warehouse w
JOIN m1_location l ON w.wlokasi = l.lkode
JOIN m1_division d ON w.wdivisi = d.dkode
```

### Transaction note by source

```sql
SELECT tn.tnsumber, tn.tnkode, tnd.tndcatatan
FROM m1_transaction_note tn
JOIN m1_transaction_note_detail tnd
  ON tn.tnkode = tnd.tndkode
 AND tn.tnsumber = tnd.tndsumber
```

## Queries That Need Extra Caution

- questions that mix contact master data with business transactions, because M1 is only the master domain
- questions that assume every contact category lives in one table
- item questions that actually belong to inventory, purchasing, or sales transaction domains
- account questions that actually ask for transactional balances instead of the account master
- questions that rely on `custom*`

## NL2SQL Checklist for M1

- ensure the request is truly master-data scope, not a transaction-domain question
- choose the primary master table first: contact, item, warehouse, coa, or organization
- check whether category or detail tables are needed
- use clear and direct reference joins
- avoid document-flow assumptions because M1 is not a document-flow domain
