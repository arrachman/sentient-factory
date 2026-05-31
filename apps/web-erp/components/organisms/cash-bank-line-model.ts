/**
 * Shared model for the cash/bank contra-account grid (Kas Masuk/Keluar/Bank).
 * Row shape + factory + grid-column descriptors. Columns are config-driven
 * (Kustomisasi Grid): the organism renders whatever visible columns it is given,
 * falling back to a sensible default set when no config is available.
 */

export interface CashLineRow {
  key: string;
  accountId: string;
  accountLabel?: string;
  amount: string;
  amountFx?: string;
  notes?: string;
  costCenterId?: string;
  costCenterLabel?: string;
  divisionId?: string;
  subdivisionId?: string;
  projectId?: string;
  /** Resolved display labels for lookup columns, keyed by dataField. */
  labels?: Record<string, string>;
  /** User-defined column values (Kustomisasi Grid), keyed by dataField. */
  customFields?: Record<string, unknown>;
}

let seq = 0;
export const newCashLine = (): CashLineRow => ({
  key: `nl-${(seq += 1)}`,
  accountId: '',
  amount: '',
});

export type GridDataType = 'TEXT' | 'NUMBER' | 'DATE' | 'LOOKUP';

/** A single grid column (subset of the API column, what the grid needs to render). */
export interface GridCol {
  dataField: string;
  headerText: string;
  width: number;
  dataType: GridDataType;
  lookupSource?: string | null;
  kind: 'STANDARD' | 'CUSTOM';
  isEditable: boolean;
  isRequired: boolean;
}

const STANDARD_FIELDS = new Set([
  'accountId', 'amount', 'amountFx', 'notes',
  'costCenterId', 'divisionId', 'subdivisionId', 'projectId',
]);

const isStandard = (col: GridCol) => col.kind === 'STANDARD' && STANDARD_FIELDS.has(col.dataField);

/** Read a cell's raw string value from a row for the given column. */
export function getCellRaw(row: CashLineRow, col: GridCol): string {
  if (isStandard(col)) return String((row as unknown as Record<string, unknown>)[col.dataField] ?? '');
  return String(row.customFields?.[col.dataField] ?? '');
}

/** Build the partial-row patch to write `value` (+ optional lookup label) into a column. */
export function buildCellPatch(
  row: CashLineRow,
  col: GridCol,
  value: string,
  label?: string,
): Partial<CashLineRow> {
  if (isStandard(col)) {
    const patch: Partial<CashLineRow> = { [col.dataField]: value } as unknown as Partial<CashLineRow>;
    if (label !== undefined) patch.labels = { ...row.labels, [col.dataField]: label };
    return patch;
  }
  return { customFields: { ...row.customFields, [col.dataField]: value } };
}

/** Default columns when no Kustomisasi Grid config is available (mirrors legacy). */
export function defaultGridCols(showFx: boolean): GridCol[] {
  const cols: GridCol[] = [
    { dataField: 'accountId', headerText: 'Akun (No · Nama)', width: 320, dataType: 'LOOKUP', lookupSource: 'account', kind: 'STANDARD', isEditable: true, isRequired: true },
    { dataField: 'amount', headerText: 'Total', width: 160, dataType: 'NUMBER', kind: 'STANDARD', isEditable: true, isRequired: false },
  ];
  if (showFx) {
    cols.push({ dataField: 'amountFx', headerText: 'Total Valas', width: 140, dataType: 'NUMBER', kind: 'STANDARD', isEditable: true, isRequired: false });
  }
  cols.push(
    { dataField: 'notes', headerText: 'Catatan', width: 240, dataType: 'TEXT', kind: 'STANDARD', isEditable: true, isRequired: false },
    { dataField: 'costCenterId', headerText: 'Cost Center', width: 220, dataType: 'LOOKUP', lookupSource: 'costCenter', kind: 'STANDARD', isEditable: true, isRequired: false },
  );
  return cols;
}
