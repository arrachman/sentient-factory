'use client';

/**
 * F3 Master Data — Partner page (Customer / Supplier).
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SearchSelect } from '@/components/molecules/search-select';
import { SimpleMasterPage, type ExtraColumn } from '@/components/organisms/simple-master-page';
import { PartnerContactsEditor } from '@/components/organisms/partner-contacts-editor';
import { PartnerAddressesEditor } from '@/components/organisms/partner-addresses-editor';
import { MultiLookupField } from './items-form-parts';
import { loadBranchOptions, loadWarehouseOptions, loadLocationOptions } from './items-form-lookups';
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

type PartnerTypeKey = 'CUSTOMER' | 'SUPPLIER' | 'BOTH';

function resolvePartnerType(p: ErpPartner): PartnerTypeKey {
  if (p.isCustomer && p.isSupplier) return 'BOTH';
  if (p.isSupplier) return 'SUPPLIER';
  return 'CUSTOMER';
}

function partnerTypeLabel(p: ErpPartner): string {
  const types: string[] = [];
  if (p.isCustomer) types.push('Customer');
  if (p.isSupplier) types.push('Supplier');
  return types.length > 0 ? types.join(', ') : '—';
}

// ─── Form ─────────────────────────────────────────────────────────────────────

interface PartnerForm {
  id: string; // '' when creating; set when editing — needed for contact/address sub-resources
  code: string;
  name: string;
  partnerType: PartnerTypeKey;
  taxNumber: string;
  receivableAccountId: string;
  receivableAccountLabel: string;
  payableAccountId: string;
  payableAccountLabel: string;
  branchIds: string[];
  branchLabels: Record<string, string>;
  warehouseIds: string[];
  warehouseLabels: Record<string, string>;
  locationIds: string[];
  locationLabels: Record<string, string>;
  isActive: boolean;
}

const defaultForm = (): PartnerForm => ({
  id: '',
  code: '',
  name: '',
  partnerType: 'CUSTOMER',
  taxNumber: '',
  receivableAccountId: '',
  receivableAccountLabel: '',
  payableAccountId: '',
  payableAccountLabel: '',
  branchIds: [],
  branchLabels: {},
  warehouseIds: [],
  warehouseLabels: {},
  locationIds: [],
  locationLabels: {},
  isActive: true,
});

// Build the id array + {id: name} label map from a partner's dimension rows.
function dimFromRows<T>(
  rows: T[] | undefined,
  getId: (r: T) => string,
  getRef: (r: T) => { name: string } | null | undefined,
): { ids: string[]; labels: Record<string, string> } {
  const ids: string[] = [];
  const labels: Record<string, string> = {};
  (rows ?? []).forEach((r) => {
    const id = getId(r);
    ids.push(id);
    const ref = getRef(r);
    if (ref) labels[id] = ref.name;
  });
  return { ids, labels };
}

const fromRecord = (p: ErpPartner): PartnerForm => {
  const b = dimFromRows(p.dimBranches, (r) => r.branchId, (r) => r.branch);
  const w = dimFromRows(p.dimWarehouses, (r) => r.warehouseId, (r) => r.warehouse);
  const l = dimFromRows(p.dimLocations, (r) => r.locationId, (r) => r.location);
  return {
    id: p.id,
    code: p.code,
    name: p.name,
    partnerType: resolvePartnerType(p),
    taxNumber: p.taxNumber ?? '',
    receivableAccountId: p.receivableAccountId ?? '',
    receivableAccountLabel: accountLabel(p.receivableAccount),
    payableAccountId: p.payableAccountId ?? '',
    payableAccountLabel: accountLabel(p.payableAccount),
    branchIds: b.ids,
    branchLabels: b.labels,
    warehouseIds: w.ids,
    warehouseLabels: w.labels,
    locationIds: l.ids,
    locationLabels: l.labels,
    isActive: p.isActive,
  };
};

const toPayload = (f: PartnerForm): CreatePartnerPayload => ({
  code: f.code,
  name: f.name,
  isCustomer: f.partnerType === 'CUSTOMER' || f.partnerType === 'BOTH',
  isSupplier: f.partnerType === 'SUPPLIER' || f.partnerType === 'BOTH',
  taxNumber: f.taxNumber || undefined,
  receivableAccountId: f.receivableAccountId || null,
  payableAccountId: f.payableAccountId || null,
  branchIds: f.branchIds,
  warehouseIds: f.warehouseIds,
  locationIds: f.locationIds,
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

  const savedHint = (
    <div className="p-4 text-[12.5px] text-muted-foreground">
      Simpan partner terlebih dahulu untuk menambah kontak &amp; alamat.
    </div>
  );

  return (
    <Tabs defaultValue="umum">
      <TabsList>
        <TabsTrigger value="umum">Umum</TabsTrigger>
        <TabsTrigger value="kontak">Kontak</TabsTrigger>
        <TabsTrigger value="alamat">Alamat</TabsTrigger>
      </TabsList>

      <TabsContent value="umum">
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
          <MultiLookupField
            id="pf-branch"
            label="Cabang"
            values={data.branchIds}
            labels={data.branchLabels}
            onChange={(ids, labels) => onChange({ ...data, branchIds: ids, branchLabels: labels })}
            loader={loadBranchOptions}
            placeholder="Pilih cabang…"
          />
          <MultiLookupField
            id="pf-warehouse"
            label="Gudang"
            values={data.warehouseIds}
            labels={data.warehouseLabels}
            onChange={(ids, labels) => onChange({ ...data, warehouseIds: ids, warehouseLabels: labels })}
            loader={loadWarehouseOptions}
            placeholder="Pilih gudang…"
          />
          <MultiLookupField
            id="pf-location"
            label="Lokasi"
            values={data.locationIds}
            labels={data.locationLabels}
            onChange={(ids, labels) => onChange({ ...data, locationIds: ids, locationLabels: labels })}
            loader={loadLocationOptions}
            placeholder="Pilih lokasi…"
          />
          <FormField label="Status" htmlFor="pf-active">
            <BooleanRadio
              id="pf-active"
              value={data.isActive}
              onValueChange={(v) => set('isActive', v)}
            />
          </FormField>
        </div>
      </TabsContent>

      <TabsContent value="kontak">
        {data.id ? <PartnerContactsEditor partnerId={data.id} /> : savedHint}
      </TabsContent>

      <TabsContent value="alamat">
        {data.id ? <PartnerAddressesEditor partnerId={data.id} /> : savedHint}
      </TabsContent>
    </Tabs>
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
      modalSize="lg"
      extraColumns={extraColumns}
      defaultSortBy="code"
      defaultSortDir="asc"
      extraFilters={TYPE_FILTER_EXTRAS}
      onExtraFilterChange={(vals) => setTypeFilter(vals['type'] ?? '')}
    />
  );
}
