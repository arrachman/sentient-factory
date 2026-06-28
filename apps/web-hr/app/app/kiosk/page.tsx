import type { Metadata } from 'next';
import { ComingSoon } from '@/components/pages/coming-soon';

export const metadata: Metadata = { title: 'Mode Kiosk' };

export default function Page() {
  return (
    <ComingSoon
      title="Mode Kiosk"
      description="Clock-in dari perangkat bersama on-site (face/PIN/NFC)."
      bullets={[
          'Mode layar penuh untuk tablet',
          'Verifikasi wajah / PIN / NFC',
          'Antrian offline & sync',
          'Scoping per worksite',      ]}
    />
  );
}
