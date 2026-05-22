'use client';

/**
 * F3 Master Data — Partner page (Customer / Supplier / Salesman).
 * Lists md_partners; supports create, edit, delete, bulk actions.
 * Atomic tier: Page.
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BooleanRadio } from '@/components/ui/radio-group';
import { SimpleMasterPage, type ExtraColumn } from '@/components/organisms/simple-master-page';
import {
  listPartners,
  createPartner,
  updatePartner,
  deletePartner,
  bulkUpdatePartnerStatus,
  bulkDeletePartners,
  type ErpPartner,
  type CreatePartnerPayload,
} from '@/lib/api/partners';

// ─── Partner type helpers ─────────────────────────────────────────────────────

type PartnerTypeKey = 'CUSTOMER' | 'SUPPLIER' | 'BOTH' | 'SALESMAN';

function resolvePartnerType(p: ErpPartner): PartnerTypeKey {
  if (p.isCustomer && p.isSupplier) return 'BOTH';
  if (p.isSupplier) return 'SUPPLIER';
  if (p.isSalesman) return 'SALESMAN';
  return 'CUSTOMER';
}

function partnerTypeLabel(p: ErpPartner): string {
  const types: string[] = [];
  if (p.isCustomer) types.push('Customer');
  if (p.isSupplier) types.push('Supplier');
  if (p.isSalesman) types.push('Salesman');
  return types.length > 0 ? types.join(', ') : '—';
}

// ─── Form ─────────────────────────────────────────────────────────────────────

interface PartnerForm {
  code: string;
  name: string;
  partnerType: PartnerTypeKey;
  taxNumber: string;
  isActive: boolean;
}

const defaultForm = (): PartnerForm => ({
  code: '',
  name: '',
  partnerType: 'CUSTOMER',
  taxNumber: '',
  isActive: true,
});

const fromRecord = (p: ErpPartner): PartnerForm => ({
  code: p.code,
  name: p.name,
  partnerType: resolvePartnerType(p),
  taxNumber: p.taxNumber ?? '',
  isActive: p.isActive,
});

const toPayload = (f: PartnerForm): CreatePartnerPayload => ({
  code: f.code,
  name: f.name,
  isCustomer: f.partnerType === 'CUSTOMER' || f.partnerType === 'BOTH',
  isSupplier: f.partnerType === 'SUPPLIER' || f.partnerType === 'BOTH',
  isSalesman: f.partnerType === 'SALESMAN',
  taxNumber: f.taxNumber || undefined,
  isActive: f.isActive,
});

function PartnerFormFields({
  data,
  onChange,
}: {
  data: PartnerForm;
  onChange: (d: PartnerForm) => void;
}) {
  const set = (k: keyof PartnerForm, v: string | boolean) =>
    onChange({ ...data, [k]: v });

  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="pf-code" required>
        <Input
          id="pf-code"
          value={data.code}
          onChange={(e) => set('code', e.target.value)}
          placeholder="CUST-001"
        />
      </FormField>
      <FormField label="Nama" htmlFor="pf-name" required>
        <Input
          id="pf-name"
          value={data.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="PT Maju Bersama"
        />
      </FormField>
      <FormField label="Tipe" htmlFor="pf-type">
        <Select
          value={data.partnerType}
          onValueChange={(v) => set('partnerType', v as PartnerTypeKey)}
        >
          <SelectTrigger id="pf-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CUSTOMER">Customer</SelectItem>
            <SelectItem value="SUPPLIER">Supplier</SelectItem>
            <SelectItem value="BOTH">Customer &amp; Supplier</SelectItem>
            <SelectItem value="SALESMAN">Salesman</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="NPWP" htmlFor="pf-tax">
        <Input
          id="pf-tax"
          value={data.taxNumber}
          onChange={(e) => set('taxNumber', e.target.value)}
          placeholder="01.234.567.8-901.000"
        />
      </FormField>
      <FormField label="Status" htmlFor="pf-active">
        <BooleanRadio
          id="pf-active"
          value={data.isActive}
          onValueChange={(v) => set('isActive', v)}
        />
      </FormField>
    </div>
  );
}

// ─── Extra columns ────────────────────────────────────────────────────────────

const extraColumns: ExtraColumn<ErpPartner>[] = [
  { key: 'partnerType', label: 'Tipe', render: (r) => partnerTypeLabel(r) },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ErpPartnersPage() {
  return (
    <SimpleMasterPage<ErpPartner, PartnerForm>
      title="Partner"
      code="PTR"
      entityLabel="partner"
      storageKey="partners"
      auditEntityName="ErpPartner"
      list={listPartners}
      create={createPartner}
      update={updatePartner}
      remove={deletePartner}
      bulkStatus={bulkUpdatePartnerStatus}
      bulkDelete={bulkDeletePartners}
      defaultForm={defaultForm}
      fromRecord={fromRecord}
      toPayload={toPayload}
      FormFields={PartnerFormFields}
      extraColumns={extraColumns}
      defaultSortBy="code"
      defaultSortDir="asc"
    />
  );
}
