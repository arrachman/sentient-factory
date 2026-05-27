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
import { Check, Loader2, RefreshCw, Smartphone, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  useActivateWaDevice,
  useAddWaDevice,
  useCheckWaDevice,
  useWaDeviceList,
  useWaDeviceQr,
} from '../../../hooks/use-wa-devices';

type Step = 'form' | 'scan' | 'done';

// Polling status connect via /check (POST /device, ringan). Tidak hit /qr berulang
// supaya tidak kena rate limit Fonnte Free.
const STATUS_POLL_INTERVAL_MS = 4_000;

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
          {/* Stepper kecil */}
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

function StepIndicator({ current }: { current: Step }) {
  const items: Array<{ key: Step; label: string }> = [
    { key: 'form', label: '1. Detail' },
    { key: 'scan', label: '2. Scan QR' },
    { key: 'done', label: '3. Aktifkan' },
  ];
  const currentIdx = items.findIndex((i) => i.key === current);
  return (
    <div className="flex items-center gap-2" style={{ marginBottom: 18 }}>
      {items.map((it, idx) => {
        const isPast = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        return (
          <div key={it.key} className="flex items-center gap-2">
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isCurrent
                  ? 'var(--sage-500)'
                  : isPast
                    ? 'var(--success, #4f8c5b)'
                    : 'var(--cream-100, #f3f0e8)',
                color: isCurrent || isPast ? '#fff' : 'var(--teal-500)',
              }}
            >
              {isPast ? <Check size={12} /> : idx + 1}
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: isCurrent ? 700 : 500,
                color: isCurrent ? 'var(--teal-800)' : 'var(--teal-500)',
              }}
            >
              {it.label}
            </span>
            {idx < items.length - 1 && (
              <span
                style={{
                  width: 18,
                  height: 1,
                  background: 'var(--sage-200)',
                  marginLeft: 2,
                  marginRight: 2,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FormStep({
  name,
  phone,
  activeDevice,
  onChangeName,
  onChangePhone,
  onSubmit,
  submitting,
  onCancel,
}: {
  name: string;
  phone: string;
  activeDevice: { name?: string; device?: string } | null;
  onChangeName: (v: string) => void;
  onChangePhone: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  onCancel: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      {activeDevice && (
        <div
          style={{
            padding: '10px 14px',
            background: 'var(--cream-100, #f3f0e8)',
            border: '1px solid var(--sage-200)',
            borderRadius: 8,
            fontSize: 12,
            color: 'var(--teal-700)',
            lineHeight: 1.5,
          }}
        >
          <strong>Device aktif sekarang:</strong> {activeDevice.name ?? '—'} ·{' '}
          {activeDevice.device ?? '—'}
          <div style={{ marginTop: 4, fontSize: 11, color: 'var(--teal-500)' }}>
            Paket Fonnte Free hanya boleh 1 device terhubung. Pairing device baru akan
            men-disconnect dan menghapus device lama dari akun Fonnte secara otomatis.
          </div>
        </div>
      )}

      <label className="flex flex-col gap-1">
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--teal-700)' }}>
          Nama device
        </span>
        <input
          required
          maxLength={60}
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="Mis. Althea Klinik"
          className="input-althea"
          style={{ padding: '8px 12px', fontSize: 13 }}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--teal-700)' }}>
          Nomor WhatsApp
        </span>
        <input
          required
          maxLength={20}
          value={phone}
          onChange={(e) => onChangePhone(e.target.value)}
          placeholder="Mis. 6282211008899"
          className="input-althea"
          style={{ padding: '8px 12px', fontSize: 13 }}
        />
        <span style={{ fontSize: 11, color: 'var(--teal-500)' }}>
          Format bebas (62xxx / +62xxx / 08xxx) — sebaiknya pakai 62xxx.
        </span>
      </label>

      <div className="flex items-center justify-end gap-2" style={{ marginTop: 8 }}>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost btn-sm"
          disabled={submitting}
        >
          Batal
        </button>
        <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
          {submitting && <Loader2 size={14} className="animate-spin" />}
          {submitting ? 'Membuat device...' : 'Lanjut → Scan QR'}
        </button>
      </div>
    </form>
  );
}

function ScanStep({
  qrUrl,
  devicePhone,
  loading,
  onBack,
  onRefreshQr,
  refreshing,
}: {
  qrUrl: string | null;
  devicePhone: string | null;
  loading: boolean;
  onBack: () => void;
  onRefreshQr: () => void;
  refreshing: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <ol
        style={{
          paddingLeft: 18,
          fontSize: 12.5,
          color: 'var(--teal-700)',
          lineHeight: 1.6,
        }}
      >
        <li>
          Buka WhatsApp di HP nomor <strong>{devicePhone ?? '—'}</strong>.
        </li>
        <li>
          Menu (titik tiga) → <strong>Linked devices</strong> →{' '}
          <strong>Link a device</strong>.
        </li>
        <li>Arahkan kamera HP ke QR di bawah ini.</li>
      </ol>

      <div
        style={{
          padding: 16,
          border: '1px solid var(--sage-200)',
          borderRadius: 12,
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 280,
        }}
      >
        {loading || !qrUrl ? (
          <div className="flex flex-col items-center gap-2" style={{ color: 'var(--teal-500)' }}>
            <Loader2 className="animate-spin" size={28} />
            <span style={{ fontSize: 12 }}>Memuat QR Fonnte...</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qrUrl}
            alt="QR Fonnte"
            style={{ width: 240, height: 240, objectFit: 'contain' }}
          />
        )}
      </div>

      <div
        className="flex items-center gap-2"
        style={{ fontSize: 11.5, color: 'var(--teal-500)' }}
      >
        <RefreshCw size={11} className="animate-spin" />
        Auto-cek status koneksi setiap {Math.round(STATUS_POLL_INTERVAL_MS / 1000)} detik. Setelah
        scan berhasil, halaman akan lanjut ke step Aktifkan.
      </div>

      <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
        <button type="button" onClick={onBack} className="btn btn-ghost btn-sm">
          ← Kembali
        </button>
        <button
          type="button"
          onClick={onRefreshQr}
          disabled={refreshing}
          className="btn btn-ghost btn-sm"
          style={{ fontSize: 11.5 }}
        >
          <RefreshCw size={12} className={refreshing ? 'animate-spin' : undefined} />
          {refreshing ? 'Memuat ulang...' : 'Muat ulang QR'}
        </button>
      </div>
    </div>
  );
}

function DoneStep({
  devicePhone,
  connected,
  onActivate,
  activating,
}: {
  devicePhone: string | null;
  connected: boolean;
  onActivate: () => void;
  activating: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div
        style={{
          padding: '14px 16px',
          background: 'var(--success-soft, #e8f1ea)',
          border: '1px solid #c8e0ce',
          borderRadius: 10,
          color: 'var(--success, #4f8c5b)',
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        ✓ Device {devicePhone ?? '—'} berhasil terhubung ke Fonnte.
      </div>

      <p
        style={{ fontSize: 12.5, color: 'var(--teal-700)', lineHeight: 1.6 }}
      >
        Klik <strong>Aktifkan</strong> untuk menjadikan device ini sebagai pengirim WA
        di Althea. Device lama (jika ada) otomatis dihapus dari akun Fonnte.
      </p>

      {!connected && (
        <div
          style={{
            padding: 10,
            border: '1px dashed var(--sage-200)',
            borderRadius: 8,
            fontSize: 11.5,
            color: 'var(--teal-500)',
          }}
        >
          Catatan: status belum confirm `connect` — kalau setelah aktivasi WA gagal kirim,
          coba scan ulang QR.
        </div>
      )}

      <div className="flex items-center justify-end gap-2" style={{ marginTop: 6 }}>
        <button
          type="button"
          onClick={onActivate}
          disabled={activating}
          className="btn btn-primary btn-sm"
        >
          {activating && <Loader2 size={14} className="animate-spin" />}
          {activating ? 'Mengaktifkan...' : 'Aktifkan device ini'}
        </button>
      </div>
    </div>
  );
}
