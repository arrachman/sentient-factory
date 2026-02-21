# PT MyERPPlus - Initial ERD (Heuristic)

Generated: 2026-02-20  
Source schema: `myerpplus`

Catatan:
- Schema ini tidak memiliki foreign key fisik (`06_foreign_keys.tsv` kosong).
- Relasi di diagram adalah **heuristic mapping** berdasarkan pola nama kolom (`idpo`, `idso`, `idbarang`, dll).
- Confidence relasi: `[H]=High`, `[M]=Medium`, `[L]=Low`.

## Domain map

```mermaid
flowchart LR
  A[m1 - Master Data\n271 tabel]
  B[m5 - Sales\n150 tabel]
  C[m4 - Purchasing\n136 tabel]
  D[m2 - Finance\n115 tabel]
  E[m0 - System\n106 tabel]
  F[m2r - Reports\n96 tabel]
  G[m7 - Assets\n88 tabel]
  H[m3 - Inventory\n77 tabel]
  I[m6 - Production\n71 tabel]
  A --- B
  A --- C
  C --- D
  B --- D
  H --- B
  H --- C
  I --- H
  E --- A
  E --- B
  E --- C
  F --- D
```

## Initial ERD

```mermaid
flowchart LR
  %% Heuristic ERD (no physical FK found in schema)

  subgraph IAM[Identity & Access]
    users["users\\nPK: UserId"]
    roles["roles\\nPK: RoleId"]
    userroles["userroles\\nPK: UserRoleId\\nUserId, RoleId"]
    rolepermissions["rolepermissions\\nPK: RolePermissionId\\nRoleId"]
    userpermissions["userpermissions\\nPK: UserPermissionId\\nUserId"]
    userpreferences["userpreferences\\nPK: UserPreferenceId\\nUserId"]

    users -->|UserId| userroles
    roles -->|RoleId| userroles
    roles -->|RoleId| rolepermissions
    users -->|UserId| userpermissions
    users -->|UserId| userpreferences
  end

  subgraph LegacyIAM[Legacy IAM]
    m0_user["m0_user\\nPK: userid"]
    m0_role["m0_role\\nPK: rkode"]
    m0_user_role["m0_user_role\\nPK: userid, role"]

    m0_user -->|userid| m0_user_role
    m0_role -->|rkode ~= role| m0_user_role
  end

  subgraph MasterData[Master Data]
    contacts["contacts\\nPK: ContactId\\nUserId"]
    businessunits["businessunits\\nPK: UnitId\\nParentUnitId"]
    m1_contact["m1_contact\\nPK: kid"]
    m1_item["m1_item\\nPK: bid"]

    users -->|UserId| contacts
    businessunits -->|ParentUnitId| businessunits
  end

  subgraph ProcureToPay[Procure to Pay]
    m4_po["m4_po\\nPK: poid, poisclose\\nposupplier"]
    m4_po_detail["m4_po_detail\\nPK: idpodetail, isclose\\nidpo, idbarang"]
    m4_ri["m4_ri\\nPK: riid, riisclose\\nriidpo, risupplier"]
    m4_ri_detail["m4_ri_detail\\nPK: idridetail, isclose\\nidri, idpodetail, idbarang"]

    m4_po -->|poid = idpo| m4_po_detail
    m4_po -->|poid = riidpo| m4_ri
    m4_ri -->|riid = idri| m4_ri_detail
    m4_po_detail -->|idpodetail| m4_ri_detail
    m1_contact -->|kid ~= posupplier/risupplier| m4_po
    m1_contact -->|kid ~= risupplier| m4_ri
    m1_item -->|bid = idbarang| m4_po_detail
    m1_item -->|bid = idbarang| m4_ri_detail
  end

  subgraph OrderToCash[Order to Cash]
    m5_so["m5_so\\nPK: soid, soisclose\\nsocustomer"]
    m5_so_detail["m5_so_detail\\nPK: idsodetail, isclose\\nidso, idbarang"]
    m5_si["m5_si\\nPK: siid, siisclose\\nsiidso, sicustomer"]
    m5_si_detail["m5_si_detail\\nPK: idsidetail, isclose\\nidsi, idsodetail, idbarang"]

    m5_so -->|soid = idso| m5_so_detail
    m5_so -->|soid = siidso| m5_si
    m5_si -->|siid = idsi| m5_si_detail
    m5_so_detail -->|idsodetail| m5_si_detail
    m1_contact -->|kid ~= socustomer/sicustomer| m5_so
    m1_contact -->|kid ~= sicustomer| m5_si
    m1_item -->|bid = idbarang| m5_so_detail
    m1_item -->|bid = idbarang| m5_si_detail
  end
```

## Referensi data sumber
- `output/02_table_catalog.tsv`
- `output/03_primary_keys.tsv`
- `output/06_foreign_keys.tsv`
- `output/relationship-confidence.csv`

## ERD per domain
- `output/domains/iam.mmd`
- `output/domains/master-data.mmd`
- `output/domains/procure-to-pay.mmd`
- `output/domains/order-to-cash.mmd`
