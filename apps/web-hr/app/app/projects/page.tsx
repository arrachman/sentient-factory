import type { Metadata } from 'next';
import { ComingSoon } from '@/components/pages/coming-soon';

export const metadata: Metadata = { title: 'Proyek & Aktivitas' };

export default function Page() {
  return (
    <ComingSoon
      title="Proyek & Aktivitas"
      description="Lacak waktu per proyek, aktivitas, dan klien."
      bullets={[
          'Master proyek, aktivitas, dan klien',
          'Alokasi waktu absensi ke proyek',
          'Tampilan live siapa-mengerjakan-apa',
          'Laporan jam per proyek (billable)',      ]}
    />
  );
}
