'use client';

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { BooleanRadio } from '@/components/ui/radio-group';
import { SimpleMasterPage } from '@/components/organisms/simple-master-page';
import {
  listPaymentTerms, createPaymentTerm, updatePaymentTerm, deletePaymentTerm,
  bulkUpdateErpPaymentTermStatus, bulkDeleteErpPaymentTerms,
  type ErpPaymentTerm, type CreatePaymentTermPayload,
} from '@/lib/api/payment-terms';

interface FormData {
  code: string;
  name: string;
  netDays: string;
  discountDays1: string;
  discountPercent1: string;
  discountDays2: string;
  discountPercent2: string;
  penaltyPercent: string;
  penaltyPeriod: string;
  isActive: boolean;
}

const defaultForm = (): FormData => ({
  code: '',
  name: '',
  netDays: '0',
  discountDays1: '',
  discountPercent1: '',
  discountDays2: '',
  discountPercent2: '',
  penaltyPercent: '',
  penaltyPeriod: '',
  isActive: true,
});

const fromRecord = (r: ErpPaymentTerm): FormData => ({
  code: r.code,
  name: r.name,
  netDays: String(r.netDays),
  discountDays1: r.discountDays1 != null ? String(r.discountDays1) : '',
  discountPercent1: r.discountPercent1 ?? '',
  discountDays2: r.discountDays2 != null ? String(r.discountDays2) : '',
  discountPercent2: r.discountPercent2 ?? '',
  penaltyPercent: r.penaltyPercent ?? '',
  penaltyPeriod: r.penaltyPeriod ?? '',
  isActive: r.isActive,
});

const toPayload = (f: FormData): CreatePaymentTermPayload => {
  const num = (v: string) => (v.trim() === '' ? undefined : Number(v));
  const str = (v: string) => (v.trim() === '' ? undefined : v);
  return {
    code: f.code,
    name: f.name,
    netDays: Number(f.netDays || '0'),
    discountDays1: num(f.discountDays1),
    discountPercent1: str(f.discountPercent1),
    discountDays2: num(f.discountDays2),
    discountPercent2: str(f.discountPercent2),
    penaltyPercent: str(f.penaltyPercent),
    penaltyPeriod: str(f.penaltyPeriod),
    isActive: f.isActive,
  };
};

function FormFields({ data, onChange }: { data: FormData; onChange: (d: FormData) => void }) {
  const set = (k: keyof FormData, v: string | boolean) => onChange({ ...data, [k]: v });
  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="pt-code" required>
        <Input id="pt-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder="NET30" />
      </FormField>
      <FormField label="Nama" htmlFor="pt-name" required>
        <Input id="pt-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Net 30 Days" />
      </FormField>
      <FormField label="Jatuh Tempo (hari)" htmlFor="pt-net" required>
        <Input id="pt-net" type="number" value={data.netDays} onChange={(e) => set('netDays', e.target.value)} placeholder="30" />
      </FormField>
      <FormField label="Diskon Hari (Tier 1)" htmlFor="pt-dd1">
        <Input id="pt-dd1" type="number" value={data.discountDays1} onChange={(e) => set('discountDays1', e.target.value)} placeholder="10" />
      </FormField>
      <FormField label="Diskon Persen (Tier 1)" htmlFor="pt-dp1">
        <Input id="pt-dp1" value={data.discountPercent1} onChange={(e) => set('discountPercent1', e.target.value)} placeholder="2.00" />
      </FormField>
      <FormField label="Diskon Hari (Tier 2)" htmlFor="pt-dd2">
        <Input id="pt-dd2" type="number" value={data.discountDays2} onChange={(e) => set('discountDays2', e.target.value)} placeholder="5" />
      </FormField>
      <FormField label="Diskon Persen (Tier 2)" htmlFor="pt-dp2">
        <Input id="pt-dp2" value={data.discountPercent2} onChange={(e) => set('discountPercent2', e.target.value)} placeholder="1.00" />
      </FormField>
      <FormField label="Denda Persen" htmlFor="pt-pen">
        <Input id="pt-pen" value={data.penaltyPercent} onChange={(e) => set('penaltyPercent', e.target.value)} placeholder="1.50" />
      </FormField>
      <FormField label="Periode Denda" htmlFor="pt-penp">
        <Input id="pt-penp" value={data.penaltyPeriod} onChange={(e) => set('penaltyPeriod', e.target.value)} placeholder="monthly" />
      </FormField>
      <FormField label="Status" htmlFor="pt-active">
        <BooleanRadio id="pt-active" value={data.isActive} onValueChange={(v) => set('isActive', v)} />
      </FormField>
    </div>
  );
}

export function ErpPaymentTermsPage() {
  return (
    <SimpleMasterPage<ErpPaymentTerm, FormData>
      title="Termin Pembayaran"
      code="TERM"
      entityLabel="termin"
      storageKey="payment-terms"
      auditEntityName="ErpPaymentTerm"
      list={listPaymentTerms}
      create={createPaymentTerm}
      update={updatePaymentTerm}
      remove={deletePaymentTerm}
      bulkStatus={bulkUpdateErpPaymentTermStatus}
      bulkDelete={bulkDeleteErpPaymentTerms}
      defaultForm={defaultForm}
      fromRecord={fromRecord}
      toPayload={toPayload}
      FormFields={FormFields}
      extraColumns={[
        { key: 'netDays', label: 'Jatuh Tempo (hari)', sortable: true, render: (row) => `${row.netDays} hari` },
      ]}
      defaultSortBy="code"
      defaultSortDir="asc"
    />
  );
}
