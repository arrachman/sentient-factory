'use client';

import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/molecules/page-header';
import { QueryState } from '@/components/molecules/query-state';
import { DataTable, type Column } from '@/components/organisms/data-table';
import { useFaceEnrollments } from '@/lib/api/hooks';
import { faceEnrollmentSnapshotUrl } from '@/lib/api/face-enrollments';
import type { FaceEnrollment } from '@/lib/api/face-enrollments';

const columns: Column<FaceEnrollment>[] = [
  {
    key: 'snapshot',
    header: 'Wajah',
    render: (r) =>
      r.activeEnrollmentId ? (
        <span className="block h-9 w-9 overflow-hidden rounded-full border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={faceEnrollmentSnapshotUrl(String(r.activeEnrollmentId))}
            alt={r.name}
            className="h-full w-full object-cover"
          />
        </span>
      ) : (
        <span className="block h-9 w-9 rounded-full border bg-muted" />
      ),
  },
  { key: 'employeeCode', header: 'Kode', render: (r) => r.employeeCode ?? '—' },
  { key: 'name', header: 'Nama' },
  {
    key: 'enrollmentStatus',
    header: 'Status',
    render: (r) => (
      <Badge variant={r.activeEnrollmentId ? 'success' : 'default'} dot>
        {r.activeEnrollmentId ? 'Terdaftar' : 'Belum'}
      </Badge>
    ),
  },
];

export function FaceEnrollmentsView() {
  const { data, isLoading, error } = useFaceEnrollments();
  const rows = data ?? [];

  return (
    <div>
      <PageHeader
        title="Pendaftaran Wajah"
        description="Kelola template wajah karyawan untuk verifikasi anti buddy-punch (adaptasi jibble Face Recognition)."
      />
      <QueryState isLoading={isLoading} error={error} isEmpty={rows.length === 0}>
        <DataTable columns={columns} rows={rows} rowKey={(r) => String(r.appUserId)} />
      </QueryState>
    </div>
  );
}
