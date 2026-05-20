'use client';

/**
 * F2 Finance — General Ledger (read-only, paginated list).
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
import { useErpList } from '@/lib/use-erp-list';
import { listLedgerEntries } from '@/lib/api/fin-ledger';

export function ErpLedgerPage() {
  const { rows, loading, error, reload } = useErpList(() =>
    listLedgerEntries(),
  );
  const [search, setSearch] = React.useState('');

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    return q
      ? rows.filter(
          (r) =>
            r.docNumber.toLowerCase().includes(q) ||
            (r.description ?? '').toLowerCase().includes(q) ||
            (r.referenceNo ?? '').toLowerCase().includes(q),
        )
      : rows;
  }, [rows, search]);

  return (
    <ErpListLayout
      title="General Ledger"
      code="GL"
      loading={loading}
      error={error}
      search={search}
      onSearch={setSearch}
      onRefresh={reload}
    >
      <div className="lines">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>No. Dokumen</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Credit</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableEmpty colSpan={7} />
            ) : (
              filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.entryDate.slice(0, 10)}</TableCell>
                  <TableCell className="mono">{r.docNumber}</TableCell>
                  <TableCell className="muted">{r.source}</TableCell>
                  <TableCell>{r.description ?? '—'}</TableCell>
                  <TableCell className="mono">{r.debit}</TableCell>
                  <TableCell className="mono">{r.credit}</TableCell>
                  <TableCell>
                    <Badge variant={r.status === 'POSTED' ? 'success' : 'default'} dot>
                      {r.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </ErpListLayout>
  );
}
