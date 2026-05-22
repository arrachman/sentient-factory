'use client';

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { BooleanRadio } from '@/components/ui/radio-group';
import { SimpleMasterPage } from '@/components/organisms/simple-master-page';
import {
  listCurrencies,
  createCurrency,
  updateCurrency,
  deleteCurrency,
  bulkUpdateErpCurrencyStatus,
  bulkDeleteErpCurrencies,
  type ErpCurrency,
  type CreateCurrencyPayload,
} from '@/lib/api/currencies';
import { CurrencyRatesPanel } from './currencies-rates';

interface CurrencyForm {
  id?: string;
  code: string;
  name: string;
  symbol: string;
  isActive: boolean;
}

const defaultForm = (): CurrencyForm => ({ code: '', name: '', symbol: '', isActive: true });

const fromRecord = (r: ErpCurrency): CurrencyForm => ({
  id: r.id,
  code: r.code,
  name: r.name,
  symbol: r.symbol ?? '',
  isActive: r.isActive,
});

const toPayload = ({ id: _id, ...f }: CurrencyForm): CreateCurrencyPayload => ({
  code: f.code,
  name: f.name,
  symbol: f.symbol || undefined,
  isActive: f.isActive,
});

function FormFields({ data, onChange }: { data: CurrencyForm; onChange: (d: CurrencyForm) => void }) {
  const set = (k: keyof CurrencyForm, v: string | boolean) => onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="cu-code" required>
        <Input id="cu-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder="USD" />
      </FormField>
      <FormField label="Nama" htmlFor="cu-name" required>
        <Input id="cu-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="US Dollar" />
      </FormField>
      <FormField label="Simbol" htmlFor="cu-symbol">
        <Input id="cu-symbol" value={data.symbol} onChange={(e) => set('symbol', e.target.value)} placeholder="$" />
      </FormField>
      <FormField label="Status" htmlFor="cu-active">
        <BooleanRadio id="cu-active" value={data.isActive} onValueChange={(v) => set('isActive', v)} />
      </FormField>
      {data.id && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Kurs Nilai Tukar</div>
          <CurrencyRatesPanel currencyId={data.id} />
        </div>
      )}
    </div>
  );
}

export function ErpCurrenciesPage() {
  return (
    <SimpleMasterPage<ErpCurrency, CurrencyForm>
      title="Mata Uang"
      code="CUR"
      entityLabel="mata uang"
      storageKey="currencies"
      auditEntityName="ErpCurrency"
      list={listCurrencies}
      create={createCurrency}
      update={updateCurrency}
      remove={deleteCurrency}
      bulkStatus={bulkUpdateErpCurrencyStatus}
      bulkDelete={bulkDeleteErpCurrencies}
      defaultForm={defaultForm}
      fromRecord={fromRecord}
      toPayload={toPayload}
      FormFields={FormFields}
      extraColumns={[{ key: 'symbol', label: 'Simbol', render: (row) => row.symbol ?? '—' }]}
    />
  );
}
