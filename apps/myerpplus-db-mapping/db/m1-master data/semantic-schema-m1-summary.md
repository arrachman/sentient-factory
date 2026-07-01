# Semantic Schema M1 Summary

Schema source: `/opt/sentient-factory/apps/myerpplus-db-mapping/db/semantic-schema-m1.json`
Function/query source: `/opt/sentient-factory/m1-queries.md`, `/opt/sentient-factory/m1-queries-by-type.md`, `/opt/sentient-factory/m0_report_rmoduleid_1.sql`

Total M1 tables in schema: **49**
Total explicit join hints in schema: **0**
Total polymorphic relationships: **0**

This document summarizes the `M1` master-data domain. Its main focus is contact, item, warehouse, branch, location, pricing, tax, COA, and reference tables used across other domains.

## Overview Domain

- **MASTER CONTACT**: `m1_contact`, `m1_contact_category`, `m1_contact_terms`, `m1_contact_price`
- **MASTER ITEM**: `m1_item`, `m1_item_category`, `m1_item_type`, `m1_item_price`, `m1_item_supplier`, `m1_item_stock_warehouse`, `m1_item_location`, `m1_item_location_warehouse`, `m1_item_permission`, `m1_item_transaction`
- **MASTER ORGANIZATION**: `m1_branch`, `m1_location`, `m1_division`, `m1_department`, `m1_subdepartment`, `m1_subdivision`, `m1_section`, `m1_project`, `m1_cost_center`
- **MASTER GEO**: `m1_country`, `m1_province`, `m1_city`
- **MASTER COMMERCIAL**: `m1_terms`, `m1_tax`, `m1_currency`, `m1_bank`, `m1_expedition`, `m1_salesman_category`, `m1_customer_category`, `m1_supplier_category`
- **MASTER PRODUCT ATTRIBUTE**: `m1_class_product`, `m1_price_category`, `m1_price_category_detail`, `m1_material`, `m1_merk`, `m1_model`, `m1_size`, `m1_type_sa`, `m1_unit`, `m1_other_cost`
- **MASTER FINANCE REFERENCE**: `m1_coa`
- **MASTER WAREHOUSE**: `m1_warehouse`
- **MASTER NOTE**: `m1_transaction_note`, `m1_transaction_note_detail`

## Core Tables

### `m1_contact`

Business contact master for customers, suppliers, salesmen, and other counterparties.

Important columns visible in active queries:
- `kid`, `kkode`, `knama`
- `kcategory`
- `kcabang`, `klokasi`, `kguandg`
- `kcategorycustomer`, `kcategorysupplier`, `kcategorysalesman`
- `ksalesman`
- `kterminbeli`, `kterminjual`
- `ktingkatjual`
- `kaktif`

Joins commonly seen:
- `m1_contact.kcategory -> m1_contact_category.cckode`
- `m1_contact.kcategorycustomer -> m1_customer_category.cckode`
- `m1_contact.kcategorysupplier -> m1_supplier_category.sckode`
- `m1_contact.kcategorysalesman -> m1_salesman_category.sckode`
- `m1_contact.ksalesman -> m1_contact.kid`
- `m1_contact.karea -> m1_area.akode`

### `m1_item`

Cross-domain item/service master for inventory, purchasing, and sales.

Important columns visible in schema and queries:
- `bid`, `bkode`, `bnama`
- `bcategory`, `btipe`
- `bsatuan`
- `bkelasproduk`
- `bsubdepartemen`
- `bkomisi`
- purchasing, sales, and inventory reference accounts

Joins commonly seen:
- `m1_item.bkelasproduk -> m1_class_product.cpkode`
- `m1_item.bsubdepartemen -> m1_subdepartment.sdpkode`
- `m1_item.bkomisi -> m1_selling_point.spid`

### `m1_warehouse`

Warehouse master used by inventory, purchasing, and sales domains.

Key columns:
- `wkode`, `wnama`
- `wdivisi`, `wlokasi`
- `waktif`
- `wbookingstok`

Joins commonly seen:
- `m1_warehouse.wdivisi -> m1_division.dkode`
- `m1_warehouse.wlokasi -> m1_location.lkode`

### `m1_coa`

Chart of accounts for all financial transactions.

Key columns:
- `cid`, `cnomor`, `cnama`
- `ctipe`, `cdc`
- `cparent`
- `ccabang`, `clokasi`, `cdivisi`
- `cmorang`, `ckodebank`
- `csaldoawal`, `csaldoberjalan`

Joins commonly seen:
- `m1_coa.cparent -> m1_coa.cnomor`
- `m1_coa.ccabang -> m1_branch.bkode`
- `m1_coa.clokasi -> m1_location.lkode`
- `m1_coa.cdivisi -> m1_division.dkode`
- `m1_coa.ckodebank -> m1_bank.bkode`
- `m1_coa.cmorang -> m1_currency.ckode`

## Important Relations

### Contact hierarchy and commercial setup

```sql
m1_contact.kcategory = m1_contact_category.cckode
m1_contact.kcategorycustomer = m1_customer_category.cckode
m1_contact.kcategorysupplier = m1_supplier_category.sckode
m1_contact.kcategorysalesman = m1_salesman_category.sckode
m1_contact.ksalesman = m1_contact.kid
```

### Item classification and pricing

```sql
m1_item.bkelasproduk = m1_class_product.cpkode
m1_item.bsubdepartemen = m1_subdepartment.sdpkode
m1_item.bkomisi = m1_selling_point.spid
m1_price_category.pckode = m1_price_category_detail.idpricecategory
```

### Warehouse and organization

```sql
m1_warehouse.wdivisi = m1_division.dkode
m1_warehouse.wlokasi = m1_location.lkode
m1_location.lcabang = m1_branch.bkode
```

### COA reference

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

## Notes Domain

- M1 is the master-data domain. Many of its tables are used across other domains.
- M1 generally does not have staged document flows like M4 or M5.
- The main NL2SQL focus in M1 is lookup, listing, reference relationships, classification, and master setup.
- The main risk in M1 is not polymorphic relationships, but choosing overly similar master tables or misreading organization and item hierarchies.
