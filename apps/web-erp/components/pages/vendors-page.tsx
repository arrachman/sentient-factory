'use client';

/**
 * F3 Master Data — Vendor page (md_partners filtered to isSupplier=true).
 * All entries created here are Suppliers. Type is locked; no dropdown shown.
 * Atomic tier: Page.
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
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
import { validateForm, type FormErrors } from '@/lib/form-validation';

// ─── Form ─────────────────────────────────────────────────────────────────────

interface VendorForm {
  code: string;
  name: string;
  taxNumber: string;
  isTaxable: boolean;
  isActive: boolean;
}

const defaultForm = (): VendorForm => ({
  code: '',
  name: '',
  taxNumber: '',
  isTaxable: true,
  isActive: true,
});

const fromRecord = (p: ErpPartner): VendorForm => ({
  code: p.code,
  name: p.name,
  taxNumber: p.taxNumber ?? '',
  isTaxable: p.isTaxable,
  isActive: p.isActive,
});

const toPayload = (f: VendorForm): CreatePartnerPayload => ({
  code: f.code,
  name: f.name,
  isCustomer: false,
  isSupplier: true,
  taxNumber: f.taxNumber || undefined,
  isTaxable: f.isTaxable,
  isActive: f.isActive,
});

const validateVendor = (form: VendorForm) =>
  validateForm(form, [
    { field: 'code', label: 'Kode', required: true },
    { field: 'name', label: 'Nama', required: true },
  ]);

function VendorFormFields({
  data,
  onChange,
  errors = {},
}: {
  data: VendorForm;
  onChange: (d: VendorForm) => void;
  errors?: FormErrors<VendorForm>;
}) {
  const set = (k: keyof VendorForm, v: string | boolean) =>
    onChange({ ...data, [k]: v });

  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="vf-code" required error={errors.code}>
        <Input
          id="vf-code"
          value={data.code}
          onChange={(e) => set('code', e.target.value)}
          placeholder="VND-0001"
          aria-invalid={!!errors.code}
        />
      </FormField>
      <FormField label="Nama" htmlFor="vf-name" required error={errors.name}>
        <Input
          id="vf-name"
          value={data.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="PT Sumber Makmur"
          aria-invalid={!!errors.name}
        />
      </FormField>
      <FormField label="NPWP" htmlFor="vf-tax">
        <Input
          id="vf-tax"
          value={data.taxNumber}
          onChange={(e) => set('taxNumber', e.target.value)}
          placeholder="01.234.567.8-901.000"
        />
      </FormField>
      <FormField label="PKP (Kena Pajak)" htmlFor="vf-taxable">
        <BooleanRadio
          id="vf-taxable"
          value={data.isTaxable}
          onValueChange={(v) => set('isTaxable', v)}
          trueLabel="PKP"
          falseLabel="Non-PKP"
        />
      </FormField>
      <FormField label="Status" htmlFor="vf-active">
        <BooleanRadio
          id="vf-active"
          value={data.isActive}
          onValueChange={(v) => set('isActive', v)}
        />
      </FormField>
    </div>
  );
}

// ─── Extra columns ────────────────────────────────────────────────────────────

const extraColumns: ExtraColumn<ErpPartner>[] = [
  {
    key: 'isTaxable',
    label: 'PKP',
    render: (r) => (r.isTaxable ? 'PKP' : 'Non-PKP'),
  },
  {
    key: 'taxNumber',
    label: 'NPWP',
    render: (r) => r.taxNumber ?? '—',
  },
];

// ─── Vendor list = partners filtered to isSupplier=true ───────────────────────

function listVendors(params: Parameters<typeof listPartners>[0]) {
  return listPartners({ ...params, isSupplier: true });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ErpVendorsPage() {
  return (
    <SimpleMasterPage<ErpPartner, VendorForm>
      title="Vendor"
      code="VND"
      entityLabel="vendor"
      storageKey="vendors"
      auditEntityName="ErpPartner"
      list={listVendors}
      create={createPartner}
      update={updatePartner}
      remove={deletePartner}
      bulkStatus={bulkUpdatePartnerStatus}
      bulkDelete={bulkDeletePartners}
      defaultForm={defaultForm}
      fromRecord={fromRecord}
      toPayload={toPayload}
      FormFields={VendorFormFields}
      validate={validateVendor}
      extraColumns={extraColumns}
      defaultSortBy="code"
      defaultSortDir="asc"
    />
  );
}
