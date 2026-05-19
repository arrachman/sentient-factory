'use client';

/**
 * F2 Admin — Permissions page (read-only).
 * Lists adm_permissions; no create / edit / delete.
 * Atomic tier: Page.
 */

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
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
import { notify } from '@/lib/feedback';
import { useErpList } from '@/lib/use-erp-list';
import { listPermissions } from '@/lib/api/permissions';

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ErpPermissionsPage() {
  const { rows, loading, error, reload } = useErpList(() =>
    listPermissions({ limit: 100 }),
  );
  const [search, setSearch] = React.useState('');

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    return q
      ? rows.filter(
          (r) =>
            r.code.toLowerCase().includes(q) ||
            r.name.toLowerCase().includes(q) ||
            (r.group ?? '').toLowerCase().includes(q),
        )
      : rows;
  }, [rows, search]);

  return (
    <ErpListLayout
      title="Hak Akses"
      code="PERM"
      loading={loading}
      error={error}
      search={search}
      onSearch={setSearch}
      onAdd={() =>
        notify('Hak akses dikelola oleh sistem (read-only)', 'info')
      }
      onRefresh={reload}
    >
      <div className="lines">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Grup</TableHead>
              <TableHead>Deskripsi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableEmpty colSpan={4} />
            ) : (
              filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="mono">{p.code}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>
                    {p.group ? (
                      <Badge variant="default">{p.group}</Badge>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell>{p.description ?? '—'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </ErpListLayout>
  );
}
