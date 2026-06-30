'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/molecules/page-header';
import { QueryState } from '@/components/molecules/query-state';
import { DataTable, type Column } from '@/components/organisms/data-table';
import { RoleDialog } from '@/components/pages/role-dialog';
import { RoleAssignDialog } from '@/components/pages/role-assign-dialog';
import { useRoles, useEmployees, hrQueryKeys } from '@/lib/api/hooks';
import { deleteRole } from '@/lib/api/roles';
import type { HrRole } from '@/lib/api/roles';
import type { HrEmployee } from '@/lib/api/employees';

export function RolesView() {
  const qc = useQueryClient();
  const roles = useRoles();
  const employees = useEmployees();

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<HrRole | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignEmployee, setAssignEmployee] = useState<HrEmployee | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function openCreateRole() {
    setEditingRole(null);
    setRoleDialogOpen(true);
  }

  function openEditRole(role: HrRole) {
    setEditingRole(role);
    setRoleDialogOpen(true);
  }

  function openAssign(employee: HrEmployee) {
    setAssignEmployee(employee);
    setAssignOpen(true);
  }

  async function removeRole(role: HrRole) {
    if (!window.confirm(`Hapus peran "${role.name}"?`)) return;
    setBusyId(role.id);
    try {
      await deleteRole(role.id);
      toast.success('Peran dihapus.');
      await qc.invalidateQueries({ queryKey: hrQueryKeys.roles });
    } catch (e) {
      toast.error((e as Error)?.message ?? 'Gagal menghapus peran.');
    } finally {
      setBusyId(null);
    }
  }

  const roleColumns: Column<HrRole>[] = [
    { key: 'code', header: 'Kode', render: (r) => <span className="font-mono text-xs">{r.code}</span> },
    { key: 'name', header: 'Nama', render: (r) => r.name },
    { key: 'description', header: 'Deskripsi', render: (r) => r.description ?? '—' },
    { key: 'memberCount', header: 'Anggota', render: (r) => r.memberCount ?? 0 },
    {
      key: 'flags',
      header: 'Sifat',
      render: (r) => (
        <div className="flex gap-1.5">
          {r.isSystem && <Badge variant="default">Sistem</Badge>}
          <Badge variant={r.isActive ? 'success' : 'default'} dot>
            {r.isActive ? 'aktif' : 'nonaktif'}
          </Badge>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) => {
        const busy = busyId === r.id;
        return (
          <div className="flex justify-end gap-1.5">
            <Button size="sm" variant="default" disabled={busy} onClick={() => openEditRole(r)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant="danger"
              disabled={busy || r.isSystem}
              title={r.isSystem ? 'Peran sistem tidak dapat dihapus' : 'Hapus'}
              onClick={() => removeRole(r)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];

  const employeeColumns: Column<HrEmployee>[] = [
    { key: 'name', header: 'Karyawan', render: (e) => e.name ?? e.username ?? '—' },
    { key: 'employeeCode', header: 'Kode', render: (e) => e.employeeCode ?? '—' },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (e) => (
        <Button size="sm" variant="default" onClick={() => openAssign(e)}>
          <ShieldCheck className="h-3.5 w-3.5" /> Atur Peran
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <PageHeader
          title="Akses & Peran (RBAC)"
          description="Definisikan peran HR dan tetapkan ke karyawan (adaptasi jibble People & Groups). Privileged-only."
          actions={
            <Button variant="primary" onClick={openCreateRole}>
              <Plus className="h-4 w-4" /> Tambah Peran
            </Button>
          }
        />
        <QueryState
          isLoading={roles.isLoading}
          error={roles.error}
          isEmpty={(roles.data ?? []).length === 0}
        >
          <DataTable columns={roleColumns} rows={roles.data ?? []} rowKey={(r) => r.id} />
        </QueryState>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Penugasan Peran Karyawan</h2>
        <QueryState
          isLoading={employees.isLoading}
          error={employees.error}
          isEmpty={(employees.data ?? []).length === 0}
        >
          <DataTable
            columns={employeeColumns}
            rows={employees.data ?? []}
            rowKey={(e) => String(e.appUserId)}
          />
        </QueryState>
      </div>

      <RoleDialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen} role={editingRole} />
      <RoleAssignDialog open={assignOpen} onOpenChange={setAssignOpen} employee={assignEmployee} />
    </div>
  );
}
