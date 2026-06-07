'use client';

import * as React from 'react';
import { useErpList } from '@/lib/use-erp-list';
import { useListPagination } from '@/lib/use-list-pagination';
import { ErpListLayout } from '@/components/organisms/erp-list-layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/organisms/table';
import { ListFooter } from '@/components/organisms/list-footer';
import { RowActionsMenu, type RowActionItem } from '@/components/molecules/row-actions-menu';
import { Badge } from '@/components/ui/badge';
import { notify, confirmAction } from '@/lib/feedback';
import {
  listReportTemplates,
  deleteReportTemplate,
  type RptTemplateRecord,
} from '@/lib/api/reports';
import { ReportTemplateDialog } from '@/components/organisms/report-designer/report-template-dialog';

interface Props {
  onOpenDesigner: (id: string) => void;
}

const MODULE_OPTIONS = [
  { value: '', label: 'Semua Modul' },
  { value: 'sys', label: 'System' },
  { value: 'fin', label: 'Finance' },
  { value: 'pur', label: 'Purchasing' },
  { value: 'sls', label: 'Sales' },
  { value: 'inv', label: 'Inventory' },
  { value: 'mfg', label: 'Manufacturing' },
];

export function ReportDesignerListPage({ onOpenDesigner }: Props) {
  const [search, setSearch] = React.useState('');
  const [moduleFilter, setModuleFilter] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<RptTemplateRecord | undefined>();
  const { page, pageSize, setPage, setPageSize } = useListPagination('reports');

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  React.useEffect(() => { setPage(1); }, [debouncedSearch, moduleFilter, pageSize, setPage]);

  const { rows, meta, loading, error, reload } = useErpList(
    () => listReportTemplates({ page, limit: pageSize, search: debouncedSearch || undefined, module: moduleFilter || undefined, sortBy: 'createdAt', sortDir: 'desc' }),
    [page, pageSize, debouncedSearch, moduleFilter],
  );

  function handleDelete(row: RptTemplateRecord) {
    confirmAction({
      title: 'Hapus Template?',
      message: `${row.code} — ${row.name} akan dihapus permanen.`,
      variant: 'danger',
      confirmLabel: 'Hapus',
      onConfirm: async () => {
        try {
          await deleteReportTemplate(row.id);
          notify('Template dihapus', 'success');
          reload();
        } catch (e: any) {
          notify(e.message, 'danger');
        }
      },
    });
  }

  function rowActions(row: RptTemplateRecord): RowActionItem[] {
    return [
      { label: 'Buka Designer', onSelect: () => onOpenDesigner(row.id) },
      { label: 'Edit Info', onSelect: () => { setEditTarget(row); setDialogOpen(true); } },
      { label: 'Hapus', onSelect: () => handleDelete(row), danger: true, separatorBefore: true },
    ];
  }

  const toolbar = (
    <select
      value={moduleFilter}
      onChange={e => setModuleFilter(e.target.value)}
      className="border rounded px-2 py-1 text-xs bg-[var(--bg-card)] cursor-pointer"
    >
      {MODULE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );

  return (
    <>
      <ErpListLayout
        title="Report Designer"
        code="RPT"
        search={search}
        onSearch={setSearch}
        onRefresh={reload}
        onAdd={() => { setEditTarget(undefined); setDialogOpen(true); }}
        addLabel="+ Buat Template"
        toolbar={toolbar}
        loading={loading}
        error={error}
        pagination={{
          page,
          pageCount: meta?.totalPages ?? 1,
          pageSize,
          totalRows: meta?.total ?? 0,
          onPage: setPage,
          onPageSize: setPageSize,
        }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Modul</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>
                  <button
                    onClick={() => onOpenDesigner(row.id)}
                    className="text-[var(--accent)] hover:underline font-mono text-sm cursor-pointer"
                  >
                    {row.code}
                  </button>
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <Badge variant="default">{row.module.toUpperCase()}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={row.isActive ? 'success' : 'default'}>
                    {row.isActive ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <RowActionsMenu items={rowActions(row)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ErpListLayout>

      <ReportTemplateDialog
        open={dialogOpen}
        initial={editTarget}
        onClose={() => setDialogOpen(false)}
        onSaved={() => { setDialogOpen(false); reload(); }}
        onOpenDesigner={onOpenDesigner}
      />
    </>
  );
}
