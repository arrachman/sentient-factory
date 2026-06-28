import type { Metadata } from 'next';
import { ComingSoon } from '@/components/pages/coming-soon';

export const metadata: Metadata = { title: 'Jadwal & Shift' };

export default function Page() {
  return (
    <ComingSoon
      title="Jadwal & Shift"
      description="Susun & publikasikan jadwal kerja dan pola shift."
      bullets={[
          'Buat shift & pola rotasi',
          'Assign shift ke karyawan/tim',
          'Publikasikan & notifikasi jadwal',
          'Bandingkan jadwal vs absensi aktual',      ]}
    />
  );
}
