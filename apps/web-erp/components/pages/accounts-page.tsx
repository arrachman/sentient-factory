'use client';

/**
 * F3 Master Data — Chart of Accounts page.
 * Lists md_accounts; supports create, edit, delete, bulk actions, audit.
 * Atomic tier: Page.
 */

import * as React from 'react';
import { SimpleMasterPage, type ExtraColumn, type ExtraFilterDef } from '@/components/organisms/simple-master-page';
import {
  listAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  bulkUpdateAccountStatus,
  bulkDeleteAccounts,
  ACCOUNT_TYPES,
  ACCOUNT_KINDS,
  type ErpAccount,
} from '@/lib/api/accounts';
import { AccountFormFields, defaultAccountForm, fromAccount, toAccountPayload, validateAccount } from './accounts-form';
import type { AccountFormData } from './accounts-form';

const fromRecord = (r: ErpAccount): AccountFormData => fromAccount(r);

const extraColumns: ExtraColumn<ErpAccount>[] = [
  { key: 'type', label: 'Tipe', sortable: true, render: (r) => r.type },
  { key: 'kind', label: 'Jenis', sortable: true, render: (r) => r.kind },
  { key: 'level', label: 'Level', sortable: true, render: (r) => r.level ?? '—' },
  {
    key: 'parent',
    label: 'Parent',
    render: (r) => (r.parent ? `${r.parent.code} — ${r.parent.name}` : '—'),
  },
  {
    key: 'currency',
    label: 'Mata Uang',
    render: (r) => r.currency?.code ?? '—',
  },
];

const accountFilters: ExtraFilterDef[] = [
  { key: 'accountType', label: 'Tipe', options: ACCOUNT_TYPES.map(t => ({ label: t, value: t })) },
  { key: 'accountKind', label: 'Jenis', options: [
    { label: 'Header', value: 'HEADER' },
    { label: 'Postable', value: 'POSTABLE' },
  ]},
];

export function ErpAccountsPage() {
  return (
    <SimpleMasterPage<ErpAccount, AccountFormData>
      title="Bagan Akun"
      code="COA"
      entityLabel="akun"
      storageKey="accounts"
      auditEntityName="ErpAccount"
      list={listAccounts}
      create={createAccount}
      update={updateAccount}
      remove={deleteAccount}
      bulkStatus={bulkUpdateAccountStatus}
      bulkDelete={bulkDeleteAccounts}
      defaultForm={defaultAccountForm}
      fromRecord={fromRecord}
      toPayload={toAccountPayload}
      FormFields={AccountFormFields}
      validate={validateAccount}
      extraColumns={extraColumns}
      modalSize="lg"
      defaultSortBy="code"
      defaultSortDir="asc"
      extraFilters={accountFilters}
    />
  );
}
