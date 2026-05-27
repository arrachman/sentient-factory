'use client';

/**
 * Drawer pairing device WA baru via Fonnte.
 *
 * Flow:
 *   1. Step "form"   → admin isi nama + nomor → POST /wa-devices → return device token
 *   2. Step "scan"   → POST /wa-devices/qr → render QR base64; polling status tiap 3s
 *                      via GET /wa-status (pakai token aktif sementara — sebelum activate,
 *                      check status pakai endpoint /device dengan device token baru via
 *                      backend addon? simplification: poll /qr berulang sampai
 *                      `alreadyConnected: true` → artinya device sudah scan QR & connect)
 *   3. Step "done"   → tombol "Aktifkan device ini" → POST /wa-devices/activate
 *                      (default removePrevious=true) → tutup drawer & invalidate cache.
 *
 * Fonnte Free plan: hanya 1 device connect bersamaan, jadi pairing device baru
 * pasti memutus device lama. Tampilkan warning di step 1.
 */

import { useEffect, useRef, useState } from 'react';
import { Smartphone, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  useActivateWaDevice,
  useAddWaDevice,
  useCheckWaDevice,
  useWaDeviceList,
  useWaDeviceQr,
} from '../../../hooks/use-wa-devices';
import { StepIndicator } from './step-indicator';
import { FormStep } from './form-step';
import { ScanStep, STATUS_POLL_INTERVAL_MS } from './scan-step';
import { DoneStep } from './done-step';

type Step = 'form' | 'scan' | 'done';

export function WaDevicePairingDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [devicePhone, setDevicePhone] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const addMut = useAddWaDevice();
  const qrMut = useWaDeviceQr();
  const checkMut = useCheckWaDevice();
  const activateMut = useActivateWaDevice();
  const deviceList = useWaDeviceList({ enabled: open });

  // Reset state setiap drawer dibuka.
  useEffect(() => {
    if (!open) return;
    setStep('form');
    setName('');
    setPhone('');
    setDeviceToken(null);
    setDevicePhone(null);
    setQrUrl(null);
    setConnected(false);
  }, [open]);

  // Saat masuk step "scan":
  //  - Generate QR sekali (call /qr) → tampilkan
  //  - Polling status connect via /check tiap 4 detik (TIDAK call /qr lagi
  //    supaya tidak kena rate limit Fonnte /qr di paket Free)
  useEffect(() => {
    if (step !== 'scan' || !deviceToken) return;

    // Fetch QR sekali.
    const fetchQr = async () => {
      try {
        const res = await qrMut.mutateAsync({ deviceToken });
        if (res.alreadyConnected) {
          setConnected(true);
          setStep('done');
          return;
        }
        if (res.qrUrl) setQrUrl(res.qrUrl);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Gagal generate QR');
      }
    };
    void fetchQr();

    // Polling status (ringan, hit /device saja).
    const tick = async () => {
      try {
        const res = await checkMut.mutateAsync({ deviceToken });
        if (res.connected) {
          setConnected(true);
          setStep('done');
          if (pollTimer.current) clearInterval(pollTimer.current);
        }
      } catch {
        // diamkan, retry interval berikutnya
      }
    };
    pollTimer.current = setInterval(tick, STATUS_POLL_INTERVAL_MS);
    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, deviceToken]);

  async function handleRefreshQr() {
    if (!deviceToken) return;
    setQrUrl(null);
    try {
      const res = await qrMut.mutateAsync({ deviceToken });
      if (res.qrUrl) setQrUrl(res.qrUrl);
      else if (res.alreadyConnected) {
        setConnected(true);
        setStep('done');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal refresh QR');
    }
  }

  async function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    try {
      const res = await addMut.mutateAsync({ name: name.trim(), phone: phone.trim() });
      setDeviceToken(res.deviceToken);
      setDevicePhone(res.devicePhone);
      setStep('scan');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal tambah device';
      toast.error(msg);
    }
  }

  async function handleActivate() {
    if (!deviceToken) return;
    try {
      await activateMut.mutateAsync({
        deviceToken,
        devicePhone: devicePhone ?? phone,
        removePrevious: true,
      });
      toast.success('Device aktif — semua WA selanjutnya kirim dari nomor ini.');
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal aktifkan device';
      toast.error(msg);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Pairing Device WhatsApp"
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative flex flex-col bg-[var(--cream-50)] shadow-xl"
        style={{ width: '100%', maxWidth: 520, height: '100%', zIndex: 1 }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between shrink-0"
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid var(--sage-100)',
            background: '#fff',
          }}
        >
          <div className="flex items-center gap-2">
            <Smartphone size={18} style={{ color: 'var(--sage-600)' }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--teal-800)' }}>
              Tambah / Ganti Device WhatsApp
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px 8px' }}
            aria-label="Tutup"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '20px 22px 32px' }}>
          <StepIndicator current={step} />

          {step === 'form' && (
            <FormStep
              name={name}
              phone={phone}
              activeDevice={
                deviceList.data?.devices.find((d) => d.isActive) ?? null
              }
              onChangeName={setName}
              onChangePhone={setPhone}
              onSubmit={handleSubmitForm}
              submitting={addMut.isPending}
              onCancel={onClose}
            />
          )}

          {step === 'scan' && (
            <ScanStep
              qrUrl={qrUrl}
              devicePhone={devicePhone}
              loading={qrMut.isPending && !qrUrl}
              onBack={() => setStep('form')}
              onRefreshQr={handleRefreshQr}
              refreshing={qrMut.isPending}
            />
          )}

          {step === 'done' && (
            <DoneStep
              devicePhone={devicePhone}
              connected={connected}
              onActivate={handleActivate}
              activating={activateMut.isPending}
            />
          )}
        </div>
      </div>
    </div>
  );
}
