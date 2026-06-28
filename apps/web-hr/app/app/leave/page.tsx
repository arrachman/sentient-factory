import type { Metadata } from 'next';
import { ComingSoon } from '@/components/pages/coming-soon';

export const metadata: Metadata = { title: 'Cuti' };

export default function Page() {
  return (
    <ComingSoon
      title="Cuti"
      description="Kelola kebijakan cuti, saldo, akrual, dan pengajuan."
      bullets={[
          'Definisi kebijakan & tipe cuti',
          'Akrual saldo otomatis',
          'Pengajuan & approval cuti',
          'Sinkron cuti ke timesheet/payroll',      ]}
    />
  );
}
