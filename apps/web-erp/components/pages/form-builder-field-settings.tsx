'use client';

/**
 * Per-field settings popover for the Form Builder, shown for EVERY field type.
 * Holds the generic knobs (placeholder, default value, read-only) plus, for
 * lookup-style fields, the lookup source/sort/filter config (LookupConfigSection).
 */

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icons';
import { NumInput } from '@/components/molecules/num-input';
import { DateInput } from '@/components/ui/date-input';
import { BooleanRadio } from '@/components/ui/radio-group';
import { SearchSelect } from '@/components/molecules/search-select';
import {
  Popover, PopoverTrigger, PopoverContent,
} from '@/components/ui/popover';
import {
  loadPartnerOptions, loadAccountOptionsCoded, loadBranchOptions,
  loadLocationOptions, loadCurrencyOptions,
} from '@/components/pages/items-form-lookups';
import { buildLookupLoader, BUILTIN_SOURCE } from '@/lib/lookup-source-registry';
import type { ErpFormField, FormFieldType } from '@/lib/api/form-fields';
import type { SearchSelectProps } from '@/components/molecules/search-select-types';
import { LookupConfigSection, hasLookupConfig } from './form-builder-lookup-config';

type LoaderFn = SearchSelectProps['loadOptions'];

const LOOKUP_TYPES = ['PARTNER', 'ACCOUNT', 'BRANCH', 'LOCATION', 'CURRENCY', 'LOOKUP'] as const;
const isLookupType = (t: FormFieldType) => (LOOKUP_TYPES as readonly string[]).includes(t);

const BUILTIN_LOADERS: Partial<Record<FormFieldType, LoaderFn>> = {
  PARTNER: loadPartnerOptions,
  ACCOUNT: loadAccountOptionsCoded,
  BRANCH: loadBranchOptions,
  LOCATION: loadLocationOptions,
  CURRENCY: loadCurrencyOptions,
};

/** Type-aware editor for a field's default value. Stores lookup id / raw string. */
function DefaultValueEditor({
  field,
  onChange,
}: {
  field: ErpFormField;
  onChange: (v: string | null) => void;
}) {
  const value = field.defaultValue ?? '';

  if (isLookupType(field.fieldType)) {
    const hasCfg = !!field.lookupDefaultFilter || !!field.lookupDefaultSort || !!field.lookupSource;
    const builtinSource = BUILTIN_SOURCE[field.fieldType];
    const loader = (hasCfg
      ? buildLookupLoader(
          field.fieldType === 'LOOKUP' ? field.lookupSource : builtinSource,
          field.lookupDefaultFilter,
          field.lookupDefaultSort,
        )
      : BUILTIN_LOADERS[field.fieldType] ?? BUILTIN_LOADERS.PARTNER) as LoaderFn;
    return (
      <SearchSelect
        placeholder="Pilih nilai default…"
        value={value}
        onValueChange={(v) => onChange(v || null)}
        loadOptions={loader}
      />
    );
  }

  if (field.fieldType === 'DATE') {
    return <DateInput value={value} onChange={(v) => onChange(v || null)} />;
  }

  if (field.fieldType === 'NUMBER') {
    return <NumInput value={value} onChange={(v) => onChange(v || null)} />;
  }

  return (
    <Input
      className="h-8 text-xs"
      placeholder="Nilai default…"
      value={value}
      onChange={(e) => onChange(e.target.value || null)}
    />
  );
}

export function FieldSettingsPopover({
  field,
  onUpdate,
}: {
  field: ErpFormField;
  onUpdate: (patch: Partial<ErpFormField>) => void;
}) {
  const lookup = isLookupType(field.fieldType);
  const configured =
    !!field.placeholder || !!field.defaultValue || field.isReadonly === true ||
    (lookup && hasLookupConfig(field));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`iconbtn ${configured ? 'text-primary' : 'text-muted-foreground'}`}
          title="Konfigurasi field"
        >
          <Icon name="gear" size={12} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[480px] p-5 flex flex-col gap-5">
        <p className="text-xs font-semibold text-foreground">Konfigurasi Field</p>

        {/* Placeholder */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Placeholder</span>
          <Input
            className="h-8 text-xs"
            placeholder="Teks petunjuk saat kosong…"
            value={field.placeholder ?? ''}
            onChange={(e) => onUpdate({ placeholder: e.target.value || null })}
          />
        </div>

        {/* Default value */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Nilai default (saat tambah baru)</span>
          <DefaultValueEditor field={field} onChange={(v) => onUpdate({ defaultValue: v })} />
        </div>

        {/* Read-only */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">Kunci (read-only)</span>
          <BooleanRadio
            value={field.isReadonly === true}
            onValueChange={(v) => onUpdate({ isReadonly: v })}
            trueLabel="Ya"
            falseLabel="Tidak"
          />
        </div>

        {/* Lookup-specific config */}
        {lookup && (
          <div className="flex flex-col gap-5 border-t border-border pt-4">
            <LookupConfigSection field={field} onUpdate={onUpdate} />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
