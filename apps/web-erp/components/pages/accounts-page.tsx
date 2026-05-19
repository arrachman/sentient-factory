'use client';

/**
 * F3 Master Data — Chart of Accounts page.
 * Lists md_accounts; supports create, edit, delete.
 * Hierarchy rendered via parentId indentation (flat list from API).
 * Atomic tier: Page.
 */

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from '@/components/organisms/modal';
import { ErpListLayout } from '@/components/organisms/erp-list-layout';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from '@/components/organisms/table';
import { confirmAction, notify } from '@/lib/feedback';
import { useErpList } from '@/lib/use-erp-list';
import {
  listAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from '@/lib/api/accounts';
import type { ErpAccount } from '@/lib/api/accounts';
import {
  AccountFormFields,
  defaultAccountForm,
  fromAccount,
  toAccountPayload,
} from './accounts-form';
import type { AccountFormData } from './accounts-form';

export function ErpAccountsPage() {
  const { rows, loading, error, reload } = useErpList(() => listAccounts());
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ErpAccount | null>(null);
  const [form, setForm] = React.useState<AccountFormData>(defaultAccountForm);
  const [saving, setSaving] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    return q
      ? rows.filter(
          (r) =>
            r.code.toLowerCase().includes(q) ||
            r.name.toLowerCase().includes(q),
        )
      : rows;
  }, [rows, search]);

  const parentMap = React.useMemo(() => {
    const m: Record<string, string> = {};
    rows.forEach((r) => (m[r.id] = `${r.code} — ${r.name}`));
    return m;
  }, [rows]);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultAccountForm());
    setOpen(true);
  };

  const openEdit = (a: ErpAccount) => {
    setEditing(a);
    setForm(fromAccount(a));
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updateAccount(editing.id, toAccountPayload(form));
        notify('Akun diperbarui', 'success');
      } else {
        await createAccount(toAccountPayload(form));
        notify('Akun dibuat', 'success');
      }
      setOpen(false);
      reload();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal menyimpan', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (a: ErpAccount) => {
    confirmAction({
      title: 'Hapus akun?',
      message: `${a.code} — ${a.name} akan dihapus permanen.`,
      variant: 'danger',
      confirmLabel: 'Hapus',
      confirmIcon: 'trash',
      onConfirm: async () => {
        try {
          await deleteAccount(a.id);
          notify('Akun dihapus', 'success');
          reload();
        } catch (e: unknown) {
          notify(e instanceof Error ? e.message : 'Gagal', 'danger');
        }
      },
    });
  };

  return (
    <>
      <ErpListLayout
        title="Bagan Akun"
        code="COA"
        loading={loading}
        error={error}
        search={search}
        onSearch={setSearch}
        onAdd={openCreate}
        onRefresh={reload}
      >
        <div className="lines">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableEmpty colSpan={7} />
              ) : (
                filtered.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="mono">{a.code}</TableCell>
                    <TableCell>
                      {a.parentId && (
                        <span className="muted" style={{ marginRight: 4 }}>
                          ↳
                        </span>
                      )}
                      {a.name}
                    </TableCell>
                    <TableCell className="muted">{a.type}</TableCell>
                    <TableCell className="muted">{a.kind}</TableCell>
                    <TableCell className="muted">
                      {a.parentId
                        ? (parentMap[a.parentId] ?? a.parentId)
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={a.isActive ? 'success' : 'default'} dot>
                        {a.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn sm" onClick={() => openEdit(a)}>
                          Edit
                        </button>
                        <button
                          className="btn sm danger"
                          onClick={() => handleDelete(a)}
                        >
                          Hapus
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </ErpListLayout>

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{editing ? 'Edit Akun' : 'Tambah Akun'}</ModalTitle>
          </ModalHeader>
          <AccountFormFields
            data={form}
            onChange={setForm}
            allRows={rows}
            editingId={editing?.id}
          />
          <ModalFooter>
            <button className="btn ghost" onClick={() => setOpen(false)}>
              Batal
            </button>
            <button
              className="btn primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
