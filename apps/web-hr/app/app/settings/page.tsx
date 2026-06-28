import type { Metadata } from 'next';
import { ComingSoon } from '@/components/pages/coming-soon';

export const metadata: Metadata = { title: 'Pengaturan' };

export default function Page() {
  return (
    <ComingSoon
      title="Pengaturan"
      description="Konfigurasi kebijakan absensi, verifikasi, dan keamanan."
      bullets={[
          'Aturan geofence & toleransi',
          'Ambang skor wajah & liveness',
          'Kebijakan lembur/break & kalender libur',
          'SSO/2FA & RBAC',      ]}
    />
  );
}
