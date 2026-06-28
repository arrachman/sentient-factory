import type { Metadata } from 'next';
import { ComingSoon } from '@/components/pages/coming-soon';

export const metadata: Metadata = { title: 'Timesheet' };

export default function Page() {
  return (
    <ComingSoon
      title="Timesheet"
      description="Timesheet otomatis dari sesi absensi untuk approval & payroll."
      bullets={[
          'Generate timesheet per periode dari clock-in/out',
          'Hitung jam reguler, lembur, dan break',
          'Approval timesheet satu klik',
          'Export ke payroll (CSV/XLS)',      ]}
    />
  );
}
