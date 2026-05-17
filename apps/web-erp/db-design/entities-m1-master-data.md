# Master Data: Entity Catalog (MVP core)

> Legacy "Master Data" (m1) maps to the **`md_*`** semantic domain per
> [web-erp/CLAUDE.md §1](../CLAUDE.md). No `erp_` prefix, no numeric `m<n>` segment.

Field-level model. Types are Prisma/Postgres (PK/FK = **`BigInt`**, resolved
[README §8](README.md#8-resolved-decisions-2026-05-17) #2). All entities also carry the global
**audit + soft-delete** columns from [README §3](README.md#3-global-conventions) — omitted below.
Every `md_*` master also carries **`legacyCode String?`** (nullable, `@@index`; original
MyERP+ code for CDC/ETL backfill — resolved §8 #7) — omitted per-row below.

Legend: 🔑 business key · ➜ FK · ◆ enum · ○ nullable.

The biggest modernization is **`m1_contact` (128 fields, 4 inline address blocks) →
normalized `Partner` + `PartnerAddress` + `PartnerContact` + `PartnerBankAccount`**.

---

## Organization (`md_*`)

### Branch  → `md_branches`  (legacy `m1_branch`)

| Field | Type | Notes |
| --- | --- | --- |
| id | BigInt PK | |
| code 🔑 | String unique | `bkode` |
| name | String | `bnama` |
| addressLine1 ○ | String | `balamat1` |
| addressLine2 ○ | String | `balamat2` |
| city ○ | String | `bkota` |
| postalCode ○ | String | `bkodepos` |
| phone ○ | String | `bnotelp` |
| fax ○ | String | `bnofax` |
| notes ○ | String | `bcatatan` |
| isActive | Boolean | `baktif` |

Relations: `locations Location[]`.

### Location  → `md_locations`  (legacy `m1_location`)

| Field | Type | Notes |
| --- | --- | --- |
| id | BigInt PK | |
| code 🔑 | String unique | `lkode` |
| name | String | `lnama` |
| branchId ➜ | BigInt → Branch | `lcabang` |
| addressLine1 ○ | String | `lalamat1` |
| city ○ | String | `lkota` |
| postalCode ○ | String | `lkodepos` |
| phone ○ | String | `lnotelp` |
| notes ○ | String | `lcatatan` |
| isActive | Boolean | `laktif` |

Relations: `branch Branch`, `warehouses Warehouse[]`.

### Warehouse  → `md_warehouses`  (legacy `m1_warehouse`)

| Field | Type | Notes |
| --- | --- | --- |
| id | BigInt PK | |
| code 🔑 | String unique | `wkode` |
| name | String | `wnama` |
| locationId ➜ | BigInt → Location | `wlokasi` |
| allowNegativeStock | Boolean | policy flag (new; legacy implicit) |
| notes ○ | String | `wcatatan` |
| isActive | Boolean | `waktif` |

> Legacy `wdivisi` (division) intentionally dropped from MVP — org hierarchy deferred.

---

## Items (`md_*`)

### Unit  → `md_units`  (legacy `m1_unit`)

| Field | Type | Notes |
| --- | --- | --- |
| id | BigInt PK | |
| code 🔑 | String unique | `ukode` |
| name | String | `unama` |
| conversionFactor | Decimal(19,4) | factor to base unit (`unilai`) |
| notes ○ | String | `uketerangan` |
| isActive | Boolean | `uaktif` |

> Alternate units per item (multi-UOM) → future `ItemUnit` table; MVP = one base unit/item.

### ItemCategory  → `md_item_categories`  (legacy `m1_item_category`)

| Field | Type | Notes |
| --- | --- | --- |
| id | BigInt PK | |
| code 🔑 | String unique | `ickode` |
| name | String | `icnama` |
| parentId ○ ➜ | BigInt → ItemCategory | nesting (modern; legacy flat) |
| inventoryAccountId ○ ➜ | BigInt → Account | default GL (`icrekpersediaan`) |
| cogsAccountId ○ ➜ | BigInt → Account | default GL (`icrekhargapokok`) |
| salesAccountId ○ ➜ | BigInt → Account | default GL (`icrekpenjualan`) |
| isActive | Boolean | `icaktif` |

Relations: self `parent`/`children`, `items Item[]`, GL accounts.

### Item  → `md_items`  (legacy `m1_item` — trimmed 128 → ~24 core)

| Field | Type | Notes |
| --- | --- | --- |
| id | BigInt PK | |
| code 🔑 | String unique | `bkode` |
| name | String | `bnama` |
| barcode ○ | String | `bbarcode` |
| type ◆ | `ItemType` | `bjenis`/`btipe` → enum |
| categoryId ➜ | BigInt → ItemCategory | `bkategori` |
| baseUnitId ➜ | BigInt → Unit | `bsatuan` |
| standardCost | Decimal(19,4) | `bhpp` |
| averageCost | Decimal(19,4) | `bhppaverage` |
| purchasePrice | Decimal(19,4) | `bhargabeli` |
| salePrice | Decimal(19,4) | `bhargajual1` (tiers 2–10 deferred) |
| minStock | Decimal(19,4) | `bstokminimal` |
| maxStock | Decimal(19,4) | `bstokmaksimal` |
| reorderQty | Decimal(19,4) | `breorder` |
| tracksSerial | Boolean | `bserial` |
| tracksBatch | Boolean | `bbatch` |
| inventoryAccountId ○ ➜ | BigInt → Account | `brekpersediaan` |
| salesAccountId ○ ➜ | BigInt → Account | `brekpenjualan` |
| cogsAccountId ○ ➜ | BigInt → Account | `brekhargapokok` |
| purchaseTaxId ○ ➜ | BigInt → Tax | `bpajakbeli` |
| saleTaxId ○ ➜ | BigInt → Tax | `bpajakjual` |
| primarySupplierId ○ ➜ | BigInt → Partner | `bsuplier` |
| weight ○ | Decimal(19,4) | optional logistics |
| isActive | Boolean | `baktif` |
| metadata ○ | Json | `bcustom1..15`, dimensions, etc. |

> **`stockOnHand` is intentionally NOT a column.** Legacy `bstok` is a denormalized
> cache; modern stock is derived from inventory transactions (future module).

---

## Partners — unified Customer / Supplier / Salesman (`md_*`)

### Partner  → `md_partners`  (legacy `m1_contact` — normalized)

| Field | Type | Notes |
| --- | --- | --- |
| id | BigInt PK | |
| code 🔑 | String unique | `kkode` |
| name | String | `knama` |
| isCustomer | Boolean | duality — `kkategoricustomer` present |
| isSupplier | Boolean | duality — `kkategorisupplier` present |
| isSalesman | Boolean | salesman-type contact |
| categoryId ○ ➜ | BigInt → PartnerCategory | `kkategori` |
| taxNumber ○ | String | NPWP (`knpwp`) |
| isTaxable | Boolean | PKP flag (`kpkp`) |
| currencyId ○ ➜ | BigInt → Currency | `kmatauang` |
| receivableAccountId ○ ➜ | BigInt → Account | AR control (`krekpiutang`) |
| payableAccountId ○ ➜ | BigInt → Account | AP control (`krekhutang`) |
| arCreditLimit ○ | Decimal(19,4) | `kbataspiutang` |
| apCreditLimit ○ | Decimal(19,4) | `kbatashutang` |
| saleTermId ○ ➜ | BigInt → PaymentTerm | `kterminjual` |
| purchaseTermId ○ ➜ | BigInt → PaymentTerm | `kterminbeli` |
| salesmanId ○ ➜ | BigInt → Partner | self-ref, salesman (`ksalesman`) |
| commissionRate ○ | Decimal(9,4) | `kkomisipenjualan` |
| branchId ○ ➜ | BigInt → Branch | `kcabang` |
| isActive | Boolean | `kaktif` |
| metadata ○ | Json | `kcustomtext*`, misc |

Relations: `category`, `currency`, `receivableAccount`/`payableAccount`,
`saleTerm`/`purchaseTerm`, `salesman` (self), `addresses PartnerAddress[]`,
`contacts PartnerContact[]`, `bankAccounts PartnerBankAccount[]`.

> Balances `ktotalpiutang`/`ktotalhutang` are **derived** (AR/AP ledger) — not stored.

### PartnerAddress  → `md_partner_addresses`  (legacy `m1_contact` k1..k4 blocks)

| Field | Type | Notes |
| --- | --- | --- |
| id | BigInt PK | |
| partnerId ➜ | BigInt → Partner | |
| type ◆ | `AddressType` | BILLING/SHIPPING/OFFICE/OTHER |
| isDefault | Boolean | one default per type |
| addressLine1 | String | |
| addressLine2 ○ | String | |
| city ○ | String | |
| province ○ | String | |
| country ○ | String | |
| postalCode ○ | String | |
| phone ○ | String | |
| fax ○ | String | |

`@@index([partnerId])`. Replaces 4 hard-coded inline address blocks.

### PartnerContact  → `md_partner_contacts`  (legacy `m1_contact_attention`)

| Field | Type | Notes |
| --- | --- | --- |
| id | BigInt PK | |
| partnerId ➜ | BigInt → Partner | `kaidkontak` |
| name | String | `kanama` |
| title ○ | String | role/position |
| phone ○ | String | |
| email ○ | String | |
| isDefault | Boolean | `kadefault` |

### PartnerBankAccount  → `md_partner_bank_accounts`  (legacy `kbank`/`knorekening`)

| Field | Type | Notes |
| --- | --- | --- |
| id | BigInt PK | |
| partnerId ➜ | BigInt → Partner | |
| bankName | String | `kbank` |
| accountNumber | String | `knorekening` |
| accountHolder ○ | String | |
| isDefault | Boolean | |

### PartnerCategory  → `md_partner_categories`  (merged contact/customer/supplier/salesman categories)

| Field | Type | Notes |
| --- | --- | --- |
| id | BigInt PK | |
| code 🔑 | String unique | |
| name | String | |
| kind ◆ | `PartnerCategoryKind` | CUSTOMER/SUPPLIER/SALESMAN/GENERAL |
| salesTier ○ | Int | `cctingkatjual` (customer price tier) |
| isActive | Boolean | |

---

## Finance (`md_*`)

### Currency  → `md_currencies`  (legacy `m1_currency`)

| Field | Type | Notes |
| --- | --- | --- |
| id | BigInt PK | |
| code 🔑 | String unique | ISO 4217 recommended (`ckode`) |
| name | String | `cnama` |
| symbol ○ | String | `csimbol` |
| isActive | Boolean | `caktif` |

> No `exchangeRate` snapshot column — rates are dated rows in `CurrencyRate`
> (resolved §8 #8; replaces legacy single `ckurs`). Relations: `rates CurrencyRate[]`.

### CurrencyRate  → `md_currency_rates`  (new — dated FX, resolved §8 #8)

| Field | Type | Notes |
| --- | --- | --- |
| id | BigInt PK | |
| currencyId ➜ | BigInt → Currency | |
| rateDate | Date | effective date of the rate |
| rate | Decimal(19,6) | units of base currency per 1 unit of `currency` |
| isActive | Boolean | |

Unique: `@@unique([currencyId, rateDate])`. `@@index([currencyId, rateDate])`.
Rate at a transaction date = latest row with `rateDate <= txnDate`. Base currency
(the org's home currency) has no rows (implicit 1.0); configured in `sys_settings`.

### Account  → `md_accounts`  (legacy `m1_coa` — Chart of Accounts)

| Field | Type | Notes |
| --- | --- | --- |
| id | BigInt PK | |
| code 🔑 | String unique | account number (`cnomor`) |
| name | String | `cnama` |
| alias ○ | String | `cnamaalias1` (alias2/3 → metadata) |
| type ◆ | `AccountType` | `ctipe` |
| kind ◆ | `AccountKind` | HEADER vs POSTABLE (`cjenis`) |
| normalBalance ◆ | `NormalBalance` | `cdc` |
| parentId ○ ➜ | BigInt → Account | tree (`cparent`/`csubdari`) |
| level | Int | `clevel` |
| cashFlowCategory ○ ◆ | `CashFlowCategory` | `caruskas` |
| currencyId ○ ➜ | BigInt → Currency | `cmatauang` |
| isControlAccount | Boolean | has sub-ledger (`cbukupembantu`) |
| bankName ○ | String | for cash/bank accounts (`ckodebank`) |
| bankAccountNo ○ | String | `cnorekbank` |
| openingBalance | Decimal(19,4) | `csaldoawal` |
| isActive | Boolean | `caktif` |
| notes ○ | String | `ccatatan` |

Relations: self `parent`/`children`, `currency`.
> Running balance `csaldoberjalan` is **derived** from journal entries (finance phase).
> Multi-dimension (`ccabang`/`clokasi`/`cdivisi`) deferred — resolved §8 #9.

### Tax  → `md_taxes`  (legacy `m1_tax`)

| Field | Type | Notes |
| --- | --- | --- |
| id | BigInt PK | |
| code 🔑 | String unique | `tkode` |
| name | String | `tnama` |
| rate | Decimal(9,4) | percent (`tnilai`) |
| saleAccountId ○ ➜ | BigInt → Account | output tax GL (`takunjual`) |
| purchaseAccountId ○ ➜ | BigInt → Account | input tax GL (`takunbeli`) |
| isActive | Boolean | `taktif` |

### PaymentTerm  → `md_payment_terms`  (legacy `m1_terms`)

| Field | Type | Notes |
| --- | --- | --- |
| id | BigInt PK | |
| code 🔑 | String unique | `trkode` |
| name | String | `trnama` |
| netDays | Int | due (`trharijatuhtempo`) |
| discountPercent1 ○ | Decimal(9,4) | `trdiskon1` |
| discountDays1 ○ | Int | `trharidiskon1` |
| discountPercent2 ○ | Decimal(9,4) | `trdiskon2` |
| discountDays2 ○ | Int | `trharidiskon2` |
| penaltyPercent ○ | Decimal(9,4) | `trdenda` |
| penaltyPeriod ○ | String | per day/month (`trdendaper`) |
| isActive | Boolean | `traktif` |

---

**Count:** 17 Master Data (`md_*`) core entities (3 org, 3 items, 5 partner, 5 finance¹ + ItemCategory/Unit).
¹ finance = Currency, **CurrencyRate**, Account, Tax, PaymentTerm.
Combined MVP total = **31 tables** (14 Administrator `sys_*`/`adm_*` + 17 `md_*`).
Legacy field-mapping appendix: **[legacy-mapping.md](legacy-mapping.md)**.
