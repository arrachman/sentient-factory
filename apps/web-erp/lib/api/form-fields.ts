// Form Builder API — per-transaction-type header form field configuration.
// Mirrors the backend erp-form-fields module. Endpoints: /:code/fields (GET + PUT).

import { apiGet, apiPut } from './client';

export const FORM_FIELD_KINDS = ['STRUCTURAL', 'CUSTOM'] as const;
export const FORM_FIELD_TYPES = [
  'TEXT', 'NUMBER', 'DATE',
  'PARTNER', 'ACCOUNT', 'BRANCH', 'LOCATION', 'CURRENCY', 'LOOKUP',
] as const;
export const FORM_COLUMN_SLOTS = ['LEFT', 'CENTER', 'RIGHT'] as const;

export type FormFieldKind = (typeof FORM_FIELD_KINDS)[number];
export type FormFieldType = (typeof FORM_FIELD_TYPES)[number];
export type FormColumnSlot = (typeof FORM_COLUMN_SLOTS)[number];

export const FORM_FIELD_TYPE_LABELS: Record<FormFieldType, string> = {
  TEXT: 'Teks',
  NUMBER: 'Angka',
  DATE: 'Tanggal',
  PARTNER: 'Partner (Lookup)',
  ACCOUNT: 'Akun GL (Lookup)',
  BRANCH: 'Cabang (Lookup)',
  LOCATION: 'Lokasi (Lookup)',
  CURRENCY: 'Mata Uang (Lookup)',
  LOOKUP: 'Lookup Kustom',
};

export const STRUCTURAL_FIELD_KEYS = [
  'partnerId', 'bankAccountId', 'description',
  'branchId', 'locationId', 'transactionDate', 'docNumber', 'currencyId',
] as const;

export interface ErpFormField {
  id?: string;
  fieldKey: string;
  kind: FormFieldKind;
  label: string;
  fieldType: FormFieldType;
  lookupSource?: string | null;
  lookupDefaultFilter?: Record<string, unknown> | null;
  lookupDefaultSort?: string | null;
  isRequired: boolean;
  isVisible: boolean;
  sortOrder: number;
  columnSlot: FormColumnSlot;
}

export interface FormFieldsResponse {
  code: string;
  fields: ErpFormField[];
}

export const getFormFields = (code: string) =>
  apiGet<FormFieldsResponse>(`/transaction-forms/${encodeURIComponent(code)}/fields`);

export const saveFormFields = (code: string, fields: ErpFormField[]) =>
  apiPut<FormFieldsResponse>(`/transaction-forms/${encodeURIComponent(code)}/fields`, {
    fields: fields.map((f, i) => ({
      fieldKey: f.fieldKey,
      kind: f.kind,
      label: f.label,
      fieldType: f.fieldType,
      lookupSource: f.lookupSource ?? undefined,
      lookupDefaultFilter: f.lookupDefaultFilter ?? undefined,
      lookupDefaultSort: f.lookupDefaultSort ?? undefined,
      isRequired: f.isRequired,
      isVisible: f.isVisible,
      sortOrder: i,
      columnSlot: f.columnSlot,
    })),
  });
