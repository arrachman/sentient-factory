// Kustomisasi Grid API — transaction-type catalog + per-transaction grids (tabs)
// + columns. Endpoints: /transaction-grids/types, /:code/columns (GET, compat),
// /:code/grids (GET + PUT).
// NOTE: BASE_URL already ends in /api/erp — paths here must NOT repeat the `erp` segment.

import { apiGet, apiPut } from './client';

export type GridColumnKind = 'STANDARD' | 'CUSTOM';
export type GridDataType = 'TEXT' | 'NUMBER' | 'DATE' | 'LOOKUP';

// Presentation/edit slots — fixed allowlists mirrored by the backend DTO.
export const LABEL_FORMATTERS = ['NONE', 'NUMBER', 'DECIMAL', 'CURRENCY', 'PERCENT', 'DATE', 'DATETIME', 'BOOLEAN'] as const;
export const HEADER_RENDERERS = ['DEFAULT', 'REQUIRED', 'CENTER', 'WRAP', 'HELP'] as const;
export const CELL_RENDERERS = ['TEXT', 'NUMERIC', 'CURRENCY', 'BADGE', 'CHECK', 'LINK', 'LOOKUP'] as const;
export const CELL_EDITORS = ['TEXT', 'NUMBER', 'DATE', 'LOOKUP', 'TEXTAREA', 'CHECKBOX', 'NONE'] as const;

export type LabelFormatter = (typeof LABEL_FORMATTERS)[number];
export type HeaderRenderer = (typeof HEADER_RENDERERS)[number];
export type CellRenderer = (typeof CELL_RENDERERS)[number];
export type CellEditor = (typeof CELL_EDITORS)[number];

export interface ErpTransactionType {
  id: string;
  code: string;
  name: string;
  moduleKey: string;
  moduleLabel: string;
  groupLabel?: string | null;
  lineTable?: string | null;
  sortOrder: number;
}

export interface ErpGridColumn {
  id?: string;
  sortOrder: number;
  headerText: string;
  dataField: string;
  width: number;
  isVisible: boolean;
  isRequired: boolean;
  isEditable: boolean;
  isSkippable: boolean;
  kind: GridColumnKind;
  dataType: GridDataType;
  lookupSource?: string | null;
  labelFormatter?: LabelFormatter | null;
  headerRenderer?: HeaderRenderer | null;
  cellRenderer?: CellRenderer | null;
  cellEditor?: CellEditor | null;
}

export interface ErpTransactionGrid {
  id?: string;
  key: string;
  label: string;
  sortOrder: number;
  lineTable?: string | null;
  isPrimary: boolean;
  columns: ErpGridColumn[];
}

export interface GridColumnsResponse {
  type: ErpTransactionType;
  columns: ErpGridColumn[];
}

export interface GridsResponse {
  type: ErpTransactionType;
  grids: ErpTransactionGrid[];
}

export const listTransactionTypes = () =>
  apiGet<ErpTransactionType[]>('/transaction-grids/types');

/** Compat: primary-grid columns — read by the live cash/bank entry grid. */
export const getGridColumns = (code: string) =>
  apiGet<GridColumnsResponse>(`/transaction-grids/${encodeURIComponent(code)}/columns`);

export const getTransactionGrids = (code: string) =>
  apiGet<GridsResponse>(`/transaction-grids/${encodeURIComponent(code)}/grids`);

export const saveTransactionGrids = (code: string, grids: ErpTransactionGrid[]) =>
  apiPut<GridsResponse>(`/transaction-grids/${encodeURIComponent(code)}/grids`, {
    grids: grids.map((g, gi) => ({
      ...g,
      sortOrder: gi,
      columns: g.columns.map((c, ci) => ({ ...c, sortOrder: ci })),
    })),
  });
