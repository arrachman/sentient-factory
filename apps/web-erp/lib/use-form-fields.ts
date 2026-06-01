import * as React from 'react';
import { getFormFields, type ErpFormField, type FormColumnSlot } from './api/form-fields';

export interface FormFieldsConfig {
  byKey: Record<string, ErpFormField>;
  bySlot: Record<FormColumnSlot, ErpFormField[]>;
  custom: ErpFormField[];
}

const EMPTY: FormFieldsConfig = { byKey: {}, bySlot: { LEFT: [], CENTER: [], RIGHT: [] }, custom: [] };

function toConfig(fields: ErpFormField[]): FormFieldsConfig {
  const byKey: Record<string, ErpFormField> = {};
  const bySlot: Record<FormColumnSlot, ErpFormField[]> = { LEFT: [], CENTER: [], RIGHT: [] };
  const custom: ErpFormField[] = [];

  for (const f of fields) {
    byKey[f.fieldKey] = f;
    if (f.kind === 'CUSTOM') custom.push(f);
  }
  // Custom fields grouped by slot for rendering in each column.
  for (const f of custom) {
    bySlot[f.columnSlot].push(f);
  }
  return { byKey, bySlot, custom };
}

/** Loads form field config for a transaction type. Returns empty config while loading. */
export function useFormFields(transactionCode?: string): FormFieldsConfig {
  const [config, setConfig] = React.useState<FormFieldsConfig>(EMPTY);

  React.useEffect(() => {
    if (!transactionCode) return;
    let cancelled = false;
    getFormFields(transactionCode)
      .then((r) => { if (!cancelled) setConfig(toConfig(r.fields)); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [transactionCode]);

  return config;
}
