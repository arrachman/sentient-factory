'use client';

/**
 * Renders custom header fields added via Form Builder for a given column slot.
 * Structural fields are still rendered directly in cash-bank-transaction-form.tsx.
 */

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { NumInput } from '@/components/molecules/num-input';
import { DateInput } from '@/components/ui/date-input';
import { SearchSelect } from '@/components/molecules/search-select';
import {
  loadPartnerOptions,
  loadAccountOptionsCoded,
  loadBranchOptions,
  loadLocationOptions,
  loadCurrencyOptions,
} from '@/components/pages/items-form-lookups';
import { buildLookupLoader, BUILTIN_SOURCE } from '@/lib/lookup-source-registry';
import type { ErpFormField, FormFieldType, FormColumnSlot } from '@/lib/api/form-fields';

// Fallback loaders for built-in types when no custom config is set.
const BUILTIN_LOADERS: Partial<Record<FormFieldType, (search: string, page: number, limit: number) => Promise<any>>> = {
  PARTNER:  loadPartnerOptions,
  ACCOUNT:  loadAccountOptionsCoded,
  BRANCH:   loadBranchOptions,
  LOCATION: loadLocationOptions,
  CURRENCY: loadCurrencyOptions,
};

function CustomField({
  field,
  value,
  onChange,
  disabled,
}: {
  field: ErpFormField;
  value: string | number | null;
  onChange: (v: string | number | null) => void;
  disabled?: boolean;
}) {
  const hasLookupConfig = !!field.lookupDefaultFilter || !!field.lookupDefaultSort || !!field.lookupSource;
  const isLookupType = (['PARTNER','ACCOUNT','BRANCH','LOCATION','CURRENCY','LOOKUP'] as string[]).includes(field.fieldType);

  if (isLookupType) {
    // Build a configured loader when custom filter/sort/source is set; fall back to built-in loaders.
    const builtinSource = BUILTIN_SOURCE[field.fieldType as FormFieldType];
    const configuredLoader = hasLookupConfig
      ? buildLookupLoader(
          field.fieldType === 'LOOKUP' ? field.lookupSource : builtinSource,
          field.lookupDefaultFilter,
          field.lookupDefaultSort,
        )
      : null;
    const effectiveLoader = configuredLoader ?? BUILTIN_LOADERS[field.fieldType as FormFieldType] ?? BUILTIN_LOADERS.PARTNER!;
    return (
      <SearchSelect
        placeholder={`Pilih ${field.label.toLowerCase()}…`}
        value={value ? String(value) : ''}
        disabled={disabled}
        onValueChange={(v) => onChange(v)}
        loadOptions={effectiveLoader}
      />
    );
  }

  if (field.fieldType === 'DATE') {
    return (
      <DateInput
        value={value ? String(value) : ''}
        disabled={disabled}
        onChange={(v) => onChange(v)}
      />
    );
  }

  if (field.fieldType === 'NUMBER') {
    return (
      <NumInput
        value={value != null ? String(value) : ''}
        disabled={disabled}
        onChange={(v) => onChange(v)}
      />
    );
  }

  return (
    <Input
      value={value ? String(value) : ''}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-24 shrink-0 text-left">
        {label}
        {required && <span className="text-danger">&nbsp;*</span>}
      </span>
      <div className="flex-1 min-w-0">{children}</div>
    </label>
  );
}

/** Renders all visible custom fields for a given column slot. */
export function CashBankCustomFields({
  fields,
  values,
  onValueChange,
  disabled,
}: {
  fields: ErpFormField[];
  values: Record<string, string | number | null>;
  onValueChange: (key: string, value: string | number | null) => void;
  disabled?: boolean;
}) {
  const visible = fields.filter((f) => f.isVisible);
  if (visible.length === 0) return null;

  return (
    <>
      {visible.map((f) => (
        <Field key={f.fieldKey} label={f.label} required={f.isRequired}>
          <CustomField
            field={f}
            value={values[f.fieldKey] ?? null}
            onChange={(v) => onValueChange(f.fieldKey, v)}
            disabled={disabled}
          />
        </Field>
      ))}
    </>
  );
}
