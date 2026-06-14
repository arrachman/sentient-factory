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
import { SearchSelect } from '@/components/molecules/search-select';
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
import { listAccounts, type ErpAccountType } from '@/lib/api/accounts';
import { validateForm, type FormErrors } from '@/lib/form-validation';

const accountOptionLoader = (accountType: ErpAccountType) =>
  async (search: string, page: number, limit: number) => {
    const res = await listAccounts({
      page,
      limit,
      search: search || undefined,
      accountType,
      accountKind: 'POSTABLE',
      isActive: true,
    });
    return {
      data: res.data.map((a) => ({
        value: a.id,
        label: a.name,
        code: a.code,
      })),
      total: res.meta.total,
    };
  };

const loadReceivableAccounts = accountOptionLoader('ASSET');
const loadPayableAccounts = accountOptionLoader('LIABILITY');

const accountLabel = (acct?: { code: string; name: string } | null) =>
  acct ? `${acct.code} — ${acct.name}` : '';

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
  receivableAccountId: string;
  receivableAccountLabel: string;
  payableAccountId: string;
  payableAccountLabel: string;
  isActive: boolean;
}

const defaultForm = (): PartnerForm => ({
  code: '',
  name: '',
  partnerType: 'CUSTOMER',
  taxNumber: '',
  receivableAccountId: '',
  receivableAccountLabel: '',
  payableAccountId: '',
  payableAccountLabel: '',
  isActive: true,
});

const fromRecord = (p: ErpPartner): PartnerForm => ({
  code: p.code,
  name: p.name,
  partnerType: resolvePartnerType(p),
  taxNumber: p.taxNumber ?? '',
  receivableAccountId: p.receivableAccountId ?? '',
  receivableAccountLabel: accountLabel(p.receivableAccount),
  payableAccountId: p.payableAccountId ?? '',
  payableAccountLabel: accountLabel(p.payableAccount),
  isActive: p.isActive,
});

const toPayload = (f: PartnerForm): CreatePartnerPayload => ({
  code: f.code,
  name: f.name,
  isCustomer: f.partnerType === 'CUSTOMER' || f.partnerType === 'BOTH',
  isSupplier: f.partnerType === 'SUPPLIER' || f.partnerType === 'BOTH',
  isSalesman: f.partnerType === 'SALESMAN',
  taxNumber: f.taxNumber || undefined,
  receivableAccountId: f.receivableAccountId || null,
  payableAccountId: f.payableAccountId || null,
  isActive: f.isActive,
});

const validatePartner = (form: PartnerForm) =>
  validateForm(form, [
    { field: 'code', label: 'Kode', required: true },
    { field: 'name', label: 'Nama', required: true },
  ]);

function PartnerFormFields({
  data,
  onChange,
  errors = {},
}: {
  data: PartnerForm;
  onChange: (d: PartnerForm) => void;
  errors?: FormErrors<PartnerForm>;
}) {
  const set = (k: keyof PartnerForm, v: string | boolean) =>
    onChange({ ...data, [k]: v });

  const showCustomerFields =
    data.partnerType === 'CUSTOMER' || data.partnerType === 'BOTH';
  const showSupplierFields =
    data.partnerType === 'SUPPLIER' || data.partnerType === 'BOTH';

  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="pf-code" required error={errors.code}>
        <Input
          id="pf-code"
          value={data.code}
          onChange={(e) => set('code', e.target.value)}
          placeholder="CUST-001"
          aria-invalid={!!errors.code}
        />
      </FormField>
      <FormField label="Nama" htmlFor="pf-name" required error={errors.name}>
        <Input
          id="pf-name"
          value={data.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="PT Maju Bersama"
          aria-invalid={!!errors.name}
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
      {showCustomerFields && (
        <FormField label="Akun Piutang (AR)" htmlFor="pf-recv-acct">
          <SearchSelect
            id="pf-recv-acct"
            value={data.receivableAccountId}
            onValueChange={(v) => set('receivableAccountId', v)}
            placeholder="Cari akun piutang…"
            loadOptions={loadReceivableAccounts}
            initialLabel={data.receivableAccountLabel}
            title="Akun Piutang"
          />
        </FormField>
      )}
      {showSupplierFields && (
        <FormField label="Akun Hutang (AP)" htmlFor="pf-pay-acct">
          <SearchSelect
            id="pf-pay-acct"
            value={data.payableAccountId}
            onValueChange={(v) => set('payableAccountId', v)}
            placeholder="Cari akun hutang…"
            loadOptions={loadPayableAccounts}
            initialLabel={data.payableAccountLabel}
            title="Akun Hutang"
          />
        </FormField>
      )}
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

// ─── Type filter extras ───────────────────────────────────────────────────────

const TYPE_FILTER_EXTRAS = [
  {
    key: 'type',
    label: 'Tipe',
    defaultValue: '',
    options: [
      { label: 'Customer', value: 'customer' },
      { label: 'Supplier', value: 'supplier' },
    ],
  },
];

function makeListPartners(typeVal: string) {
  return (params: Parameters<typeof listPartners>[0]) => {
    // Remove the FE-only 'type' key before forwarding to avoid backend 400
    const { type: _type, ...rest } = params as typeof params & { type?: string };
    return listPartners({
      ...rest,
      isCustomer: typeVal === 'customer' ? true : undefined,
      isSupplier: typeVal === 'supplier' ? true : undefined,
    });
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ErpPartnersPage() {
  const [typeFilter, setTypeFilter] = React.useState('');

  const listFn = React.useMemo(
    () => makeListPartners(typeFilter),
    [typeFilter],
  );

  return (
    <SimpleMasterPage<ErpPartner, PartnerForm>
      title="Partner"
      code="PTR"
      entityLabel="partner"
      storageKey="partners"
      auditEntityName="ErpPartner"
      list={listFn}
      create={createPartner}
      update={updatePartner}
      remove={deletePartner}
      bulkStatus={bulkUpdatePartnerStatus}
      bulkDelete={bulkDeletePartners}
      defaultForm={defaultForm}
      fromRecord={fromRecord}
      toPayload={toPayload}
      FormFields={PartnerFormFields}
      validate={validatePartner}
      extraColumns={extraColumns}
      defaultSortBy="code"
      defaultSortDir="asc"
      extraFilters={TYPE_FILTER_EXTRAS}
      onExtraFilterChange={(vals) => setTypeFilter(vals['type'] ?? '')}
    />
  );
}
