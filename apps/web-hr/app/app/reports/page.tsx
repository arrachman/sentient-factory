import type { Metadata } from 'next';
import { ComingSoon } from '@/components/pages/coming-soon';

export const metadata: Metadata = { title: 'Laporan' };

export default function Page() {
  return (
    <ComingSoon
      title="Laporan"
      description="Analitik kehadiran & data siap-payroll dengan export."
      bullets={[
          'Laporan kehadiran & jam kerja',
          'Rekap lembur & keterlambatan',
          'Export XLS/CSV',
          'Audit trail & lock periode',      ]}
    />
  );
}
