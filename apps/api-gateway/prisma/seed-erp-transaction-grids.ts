/**
 * Seed for Kustomisasi Grid: the transaction-type catalog (left module→transaction
 * tree) + default grid columns for the cash/bank family (CR/CD/BD), which the live
 * grid reads. Idempotent (upsert by code / by [type, dataField]).
 */

import { PrismaClient } from '@prisma/client';

interface ModuleDef { key: string; label: string; sortOrder: number }

const MODULES: ModuleDef[] = [
  { key: 'finance', label: 'Finance & Accounting', sortOrder: 1 },
  { key: 'inventory', label: 'Inventory & Warehouse', sortOrder: 2 },
  { key: 'purchasing', label: 'Purchasing', sortOrder: 3 },
  { key: 'sales', label: 'Sales & Distribution', sortOrder: 4 },
  { key: 'production', label: 'Production', sortOrder: 5 },
  { key: 'fixed-asset', label: 'Fixed Asset', sortOrder: 6 },
  { key: 'administrator', label: 'Administrator', sortOrder: 7 },
  { key: 'data-master', label: 'Data Master', sortOrder: 8 },
  { key: 'business-intelligence', label: 'Business Intelligence', sortOrder: 9 },
  { key: 'consolidation', label: 'Consolidation', sortOrder: 10 },
  { key: 'hrd-payroll', label: 'HRD & Payroll', sortOrder: 11 },
  { key: 'hospital', label: 'Hospital', sortOrder: 12 },
  { key: 'point-of-sales', label: 'Point of Sales', sortOrder: 13 },
  { key: 'academic', label: 'Academic', sortOrder: 14 },
  { key: 'cooperative', label: 'Cooperative', sortOrder: 15 },
];

const CASH_BANK_LINE_TABLE = 'fin_cash_bank_lines';

interface TxnDef { code: string; name: string; moduleKey: string; group: string; lineTable?: string }

const TXNS: TxnDef[] = [
  // Finance — Transaction
  { code: 'FIN.CR', name: 'Cash Receipt (CR)', moduleKey: 'finance', group: 'Transaction', lineTable: CASH_BANK_LINE_TABLE },
  { code: 'FIN.CD', name: 'Cash Disbursement (CD)', moduleKey: 'finance', group: 'Transaction', lineTable: CASH_BANK_LINE_TABLE },
  { code: 'FIN.BR', name: 'Bank Receipt (RM)', moduleKey: 'finance', group: 'Transaction', lineTable: CASH_BANK_LINE_TABLE },
  { code: 'FIN.BP', name: 'Bank Payment (SM)', moduleKey: 'finance', group: 'Transaction', lineTable: CASH_BANK_LINE_TABLE },
  { code: 'FIN.GJ', name: 'General Journal (GJ)', moduleKey: 'finance', group: 'Transaction' },
  { code: 'FIN.AJ', name: 'Adjustment Journal (AJ)', moduleKey: 'finance', group: 'Transaction' },
  { code: 'FIN.JM', name: 'Journal Memorial (JM)', moduleKey: 'finance', group: 'Transaction' },
  { code: 'FIN.RG', name: 'Receive Giro (RG)', moduleKey: 'finance', group: 'Transaction' },
  { code: 'FIN.SG', name: 'Spend Giro (SG)', moduleKey: 'finance', group: 'Transaction' },
  { code: 'FIN.RV', name: 'Revaluasi Valas (RV)', moduleKey: 'finance', group: 'Transaction' },
  { code: 'FIN.BB', name: 'Beginning Balance (CB)', moduleKey: 'finance', group: 'Transaction' },
  // Inventory
  { code: 'INV.IN', name: 'Stock In', moduleKey: 'inventory', group: 'Transaction' },
  { code: 'INV.OUT', name: 'Stock Out', moduleKey: 'inventory', group: 'Transaction' },
  { code: 'INV.TRF', name: 'Stock Transfer', moduleKey: 'inventory', group: 'Transaction' },
  { code: 'INV.OPN', name: 'Stock Opname', moduleKey: 'inventory', group: 'Transaction' },
  // Purchasing
  { code: 'PUR.PO', name: 'Purchase Order', moduleKey: 'purchasing', group: 'Transaction' },
  { code: 'PUR.GR', name: 'Goods Receipt', moduleKey: 'purchasing', group: 'Transaction' },
  { code: 'PUR.INV', name: 'Purchase Invoice', moduleKey: 'purchasing', group: 'Transaction' },
  { code: 'PUR.RET', name: 'Purchase Return', moduleKey: 'purchasing', group: 'Transaction' },
  // Sales
  { code: 'SLS.SO', name: 'Sales Order', moduleKey: 'sales', group: 'Transaction' },
  { code: 'SLS.DO', name: 'Delivery Order', moduleKey: 'sales', group: 'Transaction' },
  { code: 'SLS.INV', name: 'Sales Invoice', moduleKey: 'sales', group: 'Transaction' },
  { code: 'SLS.RET', name: 'Sales Return', moduleKey: 'sales', group: 'Transaction' },
  // Production
  { code: 'MFG.WO', name: 'Work Order', moduleKey: 'production', group: 'Transaction' },
  { code: 'MFG.RES', name: 'Production Result', moduleKey: 'production', group: 'Transaction' },
  // Fixed Asset
  { code: 'FA.ACQ', name: 'Asset Acquisition', moduleKey: 'fixed-asset', group: 'Transaction' },
  { code: 'FA.DEP', name: 'Depreciation', moduleKey: 'fixed-asset', group: 'Transaction' },
  { code: 'FA.DIS', name: 'Asset Disposal', moduleKey: 'fixed-asset', group: 'Transaction' },
  // Point of Sales
  { code: 'POS.SALE', name: 'POS Sale', moduleKey: 'point-of-sales', group: 'Transaction' },
];

interface ColDef {
  field: string; header: string; width: number; type: 'TEXT' | 'NUMBER' | 'DATE' | 'LOOKUP';
  kind?: 'STANDARD' | 'CUSTOM'; lookup?: string; visible?: boolean; required?: boolean; editable?: boolean;
}

// Default columns for the cash/bank family — maps to fin_cash_bank_lines fields
// + custom slots (hidden by default). Mirrors current hardcoded grid.
const CASH_BANK_COLUMNS: ColDef[] = [
  { field: 'accountId', header: 'Akun (No · Nama)', width: 320, type: 'LOOKUP', lookup: 'account', required: true },
  { field: 'amount', header: 'Total', width: 160, type: 'NUMBER' },
  { field: 'amountFx', header: 'Total Valas', width: 140, type: 'NUMBER', visible: false },
  { field: 'notes', header: 'Catatan', width: 240, type: 'TEXT' },
  { field: 'costCenterId', header: 'Cost Center', width: 220, type: 'LOOKUP', lookup: 'costCenter' },
  { field: 'divisionId', header: 'Divisi', width: 180, type: 'LOOKUP', lookup: 'division', visible: false },
  { field: 'subdivisionId', header: 'Sub Divisi', width: 180, type: 'LOOKUP', lookup: 'subdivision', visible: false },
  { field: 'projectId', header: 'Proyek', width: 180, type: 'LOOKUP', lookup: 'project', visible: false },
  { field: 'customText1', header: 'Custom Text 1', width: 140, type: 'TEXT', kind: 'CUSTOM', visible: false },
  { field: 'customText2', header: 'Custom Text 2', width: 140, type: 'TEXT', kind: 'CUSTOM', visible: false },
  { field: 'customText3', header: 'Custom Text 3', width: 140, type: 'TEXT', kind: 'CUSTOM', visible: false },
  { field: 'customDouble1', header: 'Custom Double 1', width: 140, type: 'NUMBER', kind: 'CUSTOM', visible: false },
  { field: 'customDouble2', header: 'Custom Double 2', width: 140, type: 'NUMBER', kind: 'CUSTOM', visible: false },
  { field: 'customDate1', header: 'Custom Date 1', width: 140, type: 'DATE', kind: 'CUSTOM', visible: false },
  { field: 'customDate2', header: 'Custom Date 2', width: 140, type: 'DATE', kind: 'CUSTOM', visible: false },
];

export async function seedTransactionGrids(prisma: PrismaClient): Promise<void> {
  const moduleLabel = new Map(MODULES.map((m) => [m.key, m.label]));
  const moduleOrder = new Map(MODULES.map((m) => [m.key, m.sortOrder]));

  for (const [i, t] of TXNS.entries()) {
    await prisma.erpTransactionType.upsert({
      where: { code: t.code },
      create: {
        code: t.code, name: t.name, moduleKey: t.moduleKey,
        moduleLabel: moduleLabel.get(t.moduleKey) ?? t.moduleKey,
        groupLabel: t.group, lineTable: t.lineTable ?? null,
        sortOrder: (moduleOrder.get(t.moduleKey) ?? 0) * 100 + i,
      },
      update: {
        name: t.name, moduleLabel: moduleLabel.get(t.moduleKey) ?? t.moduleKey,
        groupLabel: t.group, lineTable: t.lineTable ?? null,
      },
    });
  }

  // Primary "main" grid (tab) + default columns for the cash/bank family.
  const cashBankCodes = TXNS.filter((t) => t.lineTable === CASH_BANK_LINE_TABLE).map((t) => t.code);
  for (const code of cashBankCodes) {
    const type = await prisma.erpTransactionType.findUnique({ where: { code } });
    if (!type) continue;
    const grid = await prisma.erpTransactionGrid.upsert({
      where: { transactionTypeId_key: { transactionTypeId: type.id, key: 'main' } },
      create: {
        transactionTypeId: type.id, key: 'main', label: 'Utama', sortOrder: 0,
        lineTable: type.lineTable, isPrimary: true,
      },
      update: { lineTable: type.lineTable, isPrimary: true },
    });
    for (const [i, c] of CASH_BANK_COLUMNS.entries()) {
      await prisma.erpTransactionGridColumn.upsert({
        where: { gridId_dataField: { gridId: grid.id, dataField: c.field } },
        create: {
          gridId: grid.id, sortOrder: i, headerText: c.header, dataField: c.field,
          width: c.width, dataType: c.type, kind: c.kind ?? 'STANDARD', lookupSource: c.lookup ?? null,
          isVisible: c.visible ?? true, isRequired: c.required ?? false, isEditable: c.editable ?? true,
        },
        update: {}, // keep user edits on re-seed; only create missing defaults
      });
    }
  }

  console.log(`✓ sys_transaction_types (${TXNS.length}) + primary grid + default columns (cash/bank)`);
}
