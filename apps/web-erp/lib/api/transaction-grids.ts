// Kustomisasi Grid API — transaction-type catalog + per-transaction grid columns.
// Endpoints: /transaction-grids/types, /:code/columns (GET + PUT).
// NOTE: BASE_URL already ends in /api/erp — paths here must NOT repeat the `erp` segment.

import { apiGet, apiPut } from './client';

export type GridColumnKind = 'STANDARD' | 'CUSTOM';
export type GridDataType = 'TEXT' | 'NUMBER' | 'DATE' | 'LOOKUP';

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
  kind: GridColumnKind;
  dataType: GridDataType;
  lookupSource?: string | null;
}

export interface GridColumnsResponse {
  type: ErpTransactionType;
  columns: ErpGridColumn[];
}

export const listTransactionTypes = () =>
  apiGet<ErpTransactionType[]>('/transaction-grids/types');

export const getGridColumns = (code: string) =>
  apiGet<GridColumnsResponse>(`/transaction-grids/${encodeURIComponent(code)}/columns`);

export const saveGridColumns = (code: string, columns: ErpGridColumn[]) =>
  apiPut<GridColumnsResponse>(`/transaction-grids/${encodeURIComponent(code)}/columns`, {
    columns: columns.map((c, i) => ({ ...c, sortOrder: i })),
  });
