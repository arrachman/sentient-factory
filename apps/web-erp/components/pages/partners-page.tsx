'use client';

/**
 * F3 Master Data — Partner page (Customer / Supplier).
 * Lists md_partners; supports create, edit, delete, bulk actions.
 * Atomic tier: Page.
 */

import * as React from 'react';
import { SimpleMasterPage, type ExtraColumn } from '@/components/organisms/simple-master-page';
import {
  listPartners,
  createPartner,
  updatePartner,
  deletePartner,
  bulkUpdatePartnerStatus,
  bulkDeletePartners,
  type ErpPartner,
} from '@/lib/api/partners';
import { PartnerFormFields } from './partners-form-fields';
import {
  defaultForm,
  fromRecord,
  toPayload,
  validatePartner,
  partnerTypeLabel,
  type PartnerForm,
} from './partners-form-types';

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
