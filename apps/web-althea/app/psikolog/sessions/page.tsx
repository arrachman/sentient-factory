import { Lock } from 'lucide-react';

export default function PsikologSessionsPage() {
  return (
    <div className="flex flex-col items-center justify-center p-6" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="card-althea flex flex-col items-center gap-4 text-center" style={{ maxWidth: 420, padding: '40px 32px' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--cream-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Lock size={22} style={{ color: 'var(--sage-500)' }} />
        </div>
        <div className="flex flex-col gap-1">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 500, color: 'var(--teal-800)', margin: 0 }}>
            Fitur tidak tersedia
          </h2>
          <p className="caption" style={{ fontSize: 13, lineHeight: 1.6 }}>
            Catatan klinis (SOAP) tidak termasuk dalam paket standar. Hubungi administrator klinik untuk informasi lebih lanjut.
          </p>
        </div>
      </div>
    </div>
  );
}
