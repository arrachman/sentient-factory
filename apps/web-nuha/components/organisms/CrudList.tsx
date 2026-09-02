'use client';

import { useState } from 'react';
import { CrudPanel } from '@/components/CrudPanel';
import { LimitPicker, Pagination } from '@/components';
import type { ClientEntity, Row } from '@/lib/crud/types';

const LIMIT_OPTIONS = [10, 25, 50, 100];

type Props = {
  entity: ClientEntity;
  initialRows: Row[];
  initialHalaman: number;
  initialLimit: number;
  initialTotal: number;
  filters: Record<string, string>;
  hrefBase: string;
};

type ListResponse = { success: boolean; data?: { rows: Row[]; total: number }; error?: { message?: string } };

const queryFor = (halaman: number, limit: number, filters: Record<string, string>) => {
  const query = new URLSearchParams({ halaman: String(halaman), limit: String(limit), ...filters });
  return query.toString();
};

export function CrudList({ entity, initialRows, initialHalaman, initialLimit, initialTotal, filters, hrefBase }: Props) {
  const [rows, setRows] = useState(initialRows);
  const [halaman, setHalaman] = useState(initialHalaman);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const pindahHalaman = async (nextHalaman: number, nextLimit = limit) => {
    if (loading || (nextHalaman === halaman && nextLimit === limit)) return;
    setLoading(true);
    setMessage('');
    const query = queryFor(nextHalaman, nextLimit, filters);
    try {
      const response = await fetch(`/api/crud/${entity.key}?${query}`);
      const result = await response.json() as ListResponse;
      if (!result.success || !result.data) throw new Error(result.error?.message ?? 'Gagal memuat daftar.');
      setRows(result.data.rows);
      setTotal(result.data.total);
      setHalaman(nextHalaman);
      setLimit(nextLimit);
      window.history.pushState(null, '', `${hrefBase}?${query}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Gagal memuat daftar.');
    } finally {
      setLoading(false);
    }
  };

  const totalHalaman = Math.max(1, Math.ceil(total / limit));
  return <div aria-busy={loading}>
    {message && <p className="muted" role="status" style={{ marginBottom: 8 }}>{message}</p>}
    <CrudPanel entity={entity} rows={rows} />
    <Pagination
      halaman={halaman}
      totalHalaman={totalHalaman}
      total={total}
      jumlahBaris={rows.length}
      ukuranHalaman={limit}
      onPageChange={(nextHalaman) => void pindahHalaman(nextHalaman)}
      ekstra={<LimitPicker limit={limit} onLimitChange={(nextLimit) => void pindahHalaman(1, nextLimit)} />}
    />
  </div>;
}
