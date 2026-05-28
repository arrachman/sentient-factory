'use client';

/**
 * Helper komponen + visibility rules untuk items-form-fields.
 * Section header, LookupField (SearchSelect wrapper), NumField (decimal
 * input), YesNoField (BooleanRadio). Atomic tier: Molecule.
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { BooleanRadio } from '@/components/ui/radio-group';
import { NumInput } from '@/components/molecules/num-input';
import { SearchSelect } from '@/components/molecules/search-select';
import type { ErpItemType } from '@/lib/api/items';

export const isStockable = (t: ErpItemType) =>
  t === 'INVENTORY' || t === 'CONSUMABLE' || t === 'ASSET';
export const showsWeight = (t: ErpItemType) => t !== 'SERVICE';

export type LookupLoader = (s: string, p: number, l: number) => Promise<{ data: { value: string; label: string; code?: string }[]; total: number }>;

export function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border first:border-t-0">
      <header className="flex items-baseline gap-2 bg-[var(--panel-2)] px-5 py-1.5">
        <h4 className="text-[11px] font-semibold uppercase tracking-wide text-foreground">{title}</h4>
        {hint && <span className="text-[11px] text-[var(--fg-subtle)]">— {hint}</span>}
      </header>
      <div className="grid grid-cols-2 gap-x-6 gap-y-0 px-5 py-3">{children}</div>
    </section>
  );
}

export function LookupField(props: {
  id: string; label: string; value: string; onPick: (v: string) => void;
  loader: LookupLoader; placeholder: string; required?: boolean; initialLabel?: string; error?: boolean;
}) {
  return (
    <FormField label={props.label} htmlFor={props.id} required={props.required} error={props.error ? `${props.label} wajib diisi` : undefined}>
      <SearchSelect id={props.id} value={props.value} onValueChange={props.onPick} placeholder={props.placeholder} loadOptions={props.loader} initialLabel={props.initialLabel} title={props.label} error={props.error} />
    </FormField>
  );
}

export function NumField(props: { id: string; label: string; value: string; onChange: (v: string) => void; placeholder?: string; decimals?: number }) {
  return (
    <FormField label={props.label} htmlFor={props.id}>
      <NumInput id={props.id} value={props.value} onChange={props.onChange} placeholder={props.placeholder ?? '0'} decimals={props.decimals} />
    </FormField>
  );
}

export function YesNoField(props: { id: string; label: string; value: boolean; onChange: (v: boolean) => void; help?: string }) {
  return (
    <FormField label={props.label} htmlFor={props.id} help={props.help}>
      <BooleanRadio id={props.id} value={props.value} onValueChange={props.onChange} trueLabel="Ya" falseLabel="Tidak" />
    </FormField>
  );
}
