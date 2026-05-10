/**
 * Tab "Notifikasi" — composer dari 4 section terpisah:
 *   1. Koneksi WA + master toggle
 *   2. Pengingat sesi otomatis (7 event)
 *   3. Perubahan jadwal + Onboarding + Pembayaran (NotifEventRow only)
 *   4. Pengiriman & retry + Email + Telegram + Country Code
 */
import type { UpdateSettingsInput } from '../../api/settings.api';
import { PengingatSection } from './notifikasi/pengingat-section';
import { PengirimanSection } from './notifikasi/pengiriman-section';
import { PerubahanOnboardingSection } from './notifikasi/perubahan-onboarding-section';
import { WaConnectionSection } from './notifikasi/wa-connection-section';

export function TabNotifikasi({
  form,
  set,
}: {
  form: UpdateSettingsInput;
  set: <K extends keyof UpdateSettingsInput>(
    key: K,
    value: UpdateSettingsInput[K],
  ) => void;
}) {
  return (
    <div className="card-althea" style={{ padding: '6px 22px 22px' }}>
      <WaConnectionSection form={form} set={set} />
      <PengingatSection />
      <PerubahanOnboardingSection />
      <PengirimanSection form={form} set={set} />
    </div>
  );
}
