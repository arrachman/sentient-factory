'use client';

/**
 * F3 Master Data — Chart of Accounts page.
 * Lists md_accounts; supports create, edit, delete, bulk actions, audit.
 * Atomic tier: Page.
 */

import * as React from 'react';
import { SimpleMasterPage, type ExtraColumn } from '@/components/organisms/simple-master-page';
import {
  listAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  bulkUpdateAccountStatus,
  bulkDeleteAccounts,
  type ErpAccount,
} from '@/lib/api/accounts';
import { AccountFormFields, defaultAccountForm, fromAccount, toAccountPayload, validateAccount } from './accounts-form';
import type { AccountFormData } from './accounts-form';

const fromRecord = (r: ErpAccount): AccountFormData => fromAccount(r);

const extraColumns: ExtraColumn<ErpAccount>[] = [
  { key: 'type', label: 'Tipe', sortable: true, render: (r) => r.type },
  { key: 'kind', label: 'Jenis', sortable: true, render: (r) => r.kind },
  {
    key: 'parent',
    label: 'Parent',
    render: (r) => {
      const p = (r as ErpAccount & { parent?: { code: string; name: string } | null }).parent;
      return p ? `${p.code} — ${p.name}` : '—';
    },
  },
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
      defaultSortBy="code"
      defaultSortDir="asc"
    />
  );
}
