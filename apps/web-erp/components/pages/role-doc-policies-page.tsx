'use client';

/**
 * Admin page — Role Document Creation Policies.
 * Configures which initial statuses each role may set when creating a document.
 * Lives under Administrator → Initial Setup → Doc Creation Policy.
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Badge } from '@/components/ui/badge';
import { BooleanRadio } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ErpListLayout,
  type SummaryConfig,
  type ListPaginationConfig,
} from '@/components/organisms/erp-list-layout';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from '@/components/organisms/table';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from '@/components/organisms/modal';
import { confirmAction, notify } from '@/lib/feedback';
import { useErpList } from '@/lib/use-erp-list';
import { useListPagination } from '@/lib/use-list-pagination';
import { listRoles } from '@/lib/api/roles';
import type { ErpRole } from '@/lib/api/roles';
import {
  listRoleDocPolicies,
  createRoleDocPolicy,
  updateRoleDocPolicy,
  deleteRoleDocPolicy,
  CREATION_STATUSES,
  type ErpRoleDocPolicy,
  type CreateRoleDocPolicyPayload,
} from '@/lib/api/role-doc-policies';

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_DOC_TYPES = [
  'CASH_RECEIPT', 'CASH_DISBURSEMENT', 'BANK_RECEIPT', 'BANK_DISBURSEMENT',
  'JOURNAL_ENTRY', 'ADJUSTING_JOURNAL', 'JOURNAL_MEMO', 'BANK_BALANCE', 'REVERSAL',
  'INCOMING_GIRO', 'OUTGOING_GIRO', 'GIRO_CLEARING_IN', 'GIRO_CLEARING_OUT',
  'PUR.PO', 'PUR.PR', 'PUR.PI', 'PUR.GRN', 'PUR.DNR', 'PUR.PRT',
  'SLS.SO', 'SLS.SI', 'SLS.DO', 'SLS.RO', 'SLS.CR',
  'INV.OS', 'INV.SA', 'INV.SC', 'INV.SM', 'INV.PA',
  'MFG.WO',
] as const;

const DOC_TYPE_LABELS: Record<string, string> = {
  CASH_RECEIPT: 'Kas Masuk', CASH_DISBURSEMENT: 'Kas Keluar',
  BANK_RECEIPT: 'Bank Masuk', BANK_DISBURSEMENT: 'Bank Keluar',
  JOURNAL_ENTRY: 'Jurnal Umum', ADJUSTING_JOURNAL: 'Jurnal Penyesuaian',
  JOURNAL_MEMO: 'Jurnal Memorial', BANK_BALANCE: 'Bank Balance',
  REVERSAL: 'Reversal', INCOMING_GIRO: 'Giro Masuk',
  OUTGOING_GIRO: 'Giro Keluar', GIRO_CLEARING_IN: 'Penagihan Giro Masuk',
  GIRO_CLEARING_OUT: 'Penagihan Giro Keluar',
  'PUR.PO': 'Purchase Order', 'PUR.PR': 'Purchase Request',
  'PUR.PI': 'Purchase Invoice', 'PUR.GRN': 'Goods Receipt Note',
  'PUR.DNR': 'Debit Note Return', 'PUR.PRT': 'Purchase Return',
  'SLS.SO': 'Sales Order', 'SLS.SI': 'Sales Invoice',
  'SLS.DO': 'Delivery Order', 'SLS.RO': 'Sales Return',
  'SLS.CR': 'Credit Note (Sales)',
  'INV.OS': 'Opening Stock', 'INV.SA': 'Stock Adjustment',
  'INV.SC': 'Stock Count', 'INV.SM': 'Stock Movement',
  'INV.PA': 'Price Adjustment', 'MFG.WO': 'Work Order',
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft', NEED_APPROVE: 'Need Approve',
  APPROVE_1: 'Approve 1', APPROVE_2: 'Approve 2',
  APPROVE_3: 'Approve 3', APPROVE_4: 'Approve 4',
  APPROVED: 'Approved', REJECTED: 'Rejected',
};

const STATUS_VARIANTS: Record<string, 'default' | 'warn' | 'success' | 'danger'> = {
  DRAFT: 'default',
  NEED_APPROVE: 'warn', APPROVE_1: 'warn', APPROVE_2: 'warn',
  APPROVE_3: 'warn', APPROVE_4: 'warn',
  APPROVED: 'success', REJECTED: 'danger',
};

// ─── Form helpers ─────────────────────────────────────────────────────────────

interface PolicyForm {
  roleId: string;
  documentType: string;
  allowedStatuses: string[];
  isActive: boolean;
}

const defaultForm = (): PolicyForm => ({
  roleId: '', documentType: '', allowedStatuses: ['DRAFT'], isActive: true,
});

const fromRecord = (r: ErpRoleDocPolicy): PolicyForm => ({
  roleId: r.roleId,
  documentType: r.documentType,
  allowedStatuses: [...r.allowedStatuses],
  isActive: r.isActive,
});

const toPayload = (f: PolicyForm): CreateRoleDocPolicyPayload => ({
  roleId: f.roleId,
  documentType: f.documentType,
  allowedStatuses: f.allowedStatuses as CreateRoleDocPolicyPayload['allowedStatuses'],
  isActive: f.isActive,
});

// ─── Form Fields ──────────────────────────────────────────────────────────────

function FormFields({
  data,
  isEditing,
  onChange,
  roles,
}: {
  data: PolicyForm;
  isEditing: boolean;
  onChange: (d: PolicyForm) => void;
  roles: ErpRole[];
}) {
  const set = <K extends keyof PolicyForm>(k: K, v: PolicyForm[K]) =>
    onChange({ ...data, [k]: v });

  const toggleStatus = (s: string) => {
    const next = data.allowedStatuses.includes(s)
      ? data.allowedStatuses.filter((x) => x !== s)
      : [...data.allowedStatuses, s];
    set('allowedStatuses', next);
  };

  return (
    <div className="p-4">
      {isEditing ? (
        <>
          <FormField label="Role" htmlFor="rdp-role">
            <div
              style={{
                padding: '4px 8px',
                background: 'var(--bg-muted, var(--card))',
                borderRadius: 'var(--radius)',
                fontSize: 'calc(13px * var(--font-scale, 1))',
                border: '1px solid var(--border)',
                color: 'var(--fg-muted)',
              }}
            >
              {roles.find((r) => r.id === data.roleId)?.name ?? data.roleId}
            </div>
          </FormField>
          <FormField label="Jenis Dokumen" htmlFor="rdp-doctype">
            <div
              style={{
                padding: '4px 8px',
                background: 'var(--bg-muted, var(--card))',
                borderRadius: 'var(--radius)',
                fontSize: 'calc(13px * var(--font-scale, 1))',
                border: '1px solid var(--border)',
                color: 'var(--fg-muted)',
              }}
            >
              {DOC_TYPE_LABELS[data.documentType] ?? data.documentType}
              <span style={{ marginLeft: 6, opacity: 0.6 }}>({data.documentType})</span>
            </div>
          </FormField>
        </>
      ) : (
        <>
          <FormField label="Role" htmlFor="rdp-role" required>
            <Select value={data.roleId} onValueChange={(v) => set('roleId', v)}>
              <SelectTrigger id="rdp-role">
                <SelectValue placeholder="Pilih role…" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Jenis Dokumen" htmlFor="rdp-doctype" required>
            <Select value={data.documentType} onValueChange={(v) => set('documentType', v)}>
              <SelectTrigger id="rdp-doctype">
                <SelectValue placeholder="Pilih jenis dokumen…" />
              </SelectTrigger>
              <SelectContent>
                {ALL_DOC_TYPES.map((dt) => (
                  <SelectItem key={dt} value={dt}>
                    {DOC_TYPE_LABELS[dt] ?? dt}
                    <span style={{ color: 'var(--fg-muted)', marginLeft: 6 }}>({dt})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </>
      )}

      <FormField label="Status yang diizinkan saat input" htmlFor="rdp-statuses" required>
        <div style={{ display: 'flex', gap: 16, marginTop: 4, flexWrap: 'wrap' }}>
          {CREATION_STATUSES.map((s) => (
            <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={data.allowedStatuses.includes(s)}
                onChange={() => toggleStatus(s)}
                style={{ cursor: 'pointer' }}
              />
              <Badge variant={STATUS_VARIANTS[s] ?? 'default'}>{STATUS_LABELS[s] ?? s}</Badge>
            </label>
          ))}
        </div>
        {data.allowedStatuses.length === 0 && (
          <div style={{ fontSize: 'calc(11px * var(--font-scale, 1))', color: 'var(--danger)', marginTop: 4 }}>
            Pilih minimal satu status
          </div>
        )}
      </FormField>

      <FormField label="Aktif" htmlFor="rdp-active">
        <BooleanRadio
          id="rdp-active"
          value={data.isActive}
          onValueChange={(v) => set('isActive', v)}
        />
      </FormField>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ErpRoleDocPoliciesPage() {
  const [search, setSearch] = React.useState('');
  const { page, pageSize, setPage, setPageSize } = useListPagination('role-doc-policies');
  const [roles, setRoles] = React.useState<ErpRole[]>([]);
  const [rolesMap, setRolesMap] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    listRoles({ limit: 200 }).then((res) => {
      setRoles(res.data);
      const map: Record<string, string> = {};
      for (const r of res.data) map[r.id] = r.name;
      setRolesMap(map);
    }).catch(() => {});
  }, []);

  const [debouncedSearch, setDebouncedSearch] = React.useState(search);
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { rows, meta, loading, error, reload } = useErpList(
    () => listRoleDocPolicies({ page, limit: pageSize, search: debouncedSearch || undefined }),
    [page, pageSize, debouncedSearch],
  );

  React.useEffect(() => { setPage(1); }, [debouncedSearch, pageSize]);

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ErpRoleDocPolicy | null>(null);
  const [form, setForm] = React.useState<PolicyForm>(defaultForm());
  const [saving, setSaving] = React.useState(false);

  const totalRows = meta?.total ?? 0;
  const pageCount = meta?.totalPages ?? 1;

  const summary: SummaryConfig = {
    metricLabel: 'Σ policy', rowCount: totalRows, totalCount: totalRows,
  };
  const pagination: ListPaginationConfig = {
    page, pageCount, pageSize, totalRows, onPage: setPage, onPageSize: setPageSize,
  };

  const openCreate = () => { setEditing(null); setForm(defaultForm()); setOpen(true); };
  const openEdit = (r: ErpRoleDocPolicy) => { setEditing(r); setForm(fromRecord(r)); setOpen(true); };

  const handleSave = async () => {
    if (!form.roleId || !form.documentType) {
      notify('Role dan Jenis Dokumen wajib diisi', 'danger');
      return;
    }
    if (form.allowedStatuses.length === 0) {
      notify('Pilih minimal satu status yang diizinkan', 'danger');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateRoleDocPolicy(editing.id, {
          allowedStatuses: form.allowedStatuses as CreateRoleDocPolicyPayload['allowedStatuses'],
          isActive: form.isActive,
        });
        notify('Policy diperbarui', 'success');
      } else {
        await createRoleDocPolicy(toPayload(form));
        notify('Policy dibuat', 'success');
      }
      setOpen(false);
      reload();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal menyimpan', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (r: ErpRoleDocPolicy) => {
    const roleName = rolesMap[r.roleId] ?? r.roleId;
    const docLabel = DOC_TYPE_LABELS[r.documentType] ?? r.documentType;
    confirmAction({
      title: 'Hapus policy?',
      message: `${roleName} — ${docLabel} akan dihapus permanen.`,
      variant: 'danger',
      confirmLabel: 'Hapus',
      confirmIcon: 'trash',
      onConfirm: async () => {
        try {
          await deleteRoleDocPolicy(r.id);
          notify('Policy dihapus', 'success');
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
        title="Kebijakan Status Dokumen"
        code="RDP"
        loading={loading}
        error={error}
        search={search}
        onSearch={setSearch}
        onAdd={openCreate}
        onRefresh={reload}
        summary={summary}
        pagination={pagination}
      >
        <div className="lines">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Jenis Dokumen</TableHead>
                <TableHead>Status Diizinkan</TableHead>
                <TableHead>Aktif</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableEmpty colSpan={5} />
              ) : (
                rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{rolesMap[r.roleId] ?? r.roleId}</TableCell>
                    <TableCell>
                      {DOC_TYPE_LABELS[r.documentType] ?? r.documentType}
                      <span
                        className="muted"
                        style={{ marginLeft: 6, fontSize: 'calc(11px * var(--font-scale, 1))' }}
                      >
                        ({r.documentType})
                      </span>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {r.allowedStatuses.map((s) => (
                          <Badge key={s} variant={STATUS_VARIANTS[s] ?? 'default'}>
                            {STATUS_LABELS[s] ?? s}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={r.isActive ? 'success' : 'default'} dot>
                        {r.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn sm" onClick={() => openEdit(r)}>Edit</button>
                        <button className="btn sm danger" onClick={() => handleDelete(r)}>Hapus</button>
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
            <ModalTitle>{editing ? 'Edit Policy' : 'Tambah Policy'}</ModalTitle>
          </ModalHeader>
          <FormFields
            data={form}
            isEditing={!!editing}
            onChange={setForm}
            roles={roles}
          />
          <ModalFooter>
            <button className="btn ghost" onClick={() => setOpen(false)}>Batal</button>
            <button className="btn primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Menyimpan…' : 'Simpan'}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
