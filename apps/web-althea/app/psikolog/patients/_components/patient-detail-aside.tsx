import { Bell, MessageSquare } from 'lucide-react';
import { RISK_TONE, STATUS_TONE, type AggregatedClient } from '../_lib/patients-model';
import { ClientAvatar } from './client-avatar';

export function PatientDetailAside({ selected }: { selected: AggregatedClient }) {
  const sesiPct = Math.round((selected.sessionN / Math.max(1, selected.sessionTotal)) * 100);

  return (
    <aside
      className="hidden lg:block"
      style={{
        width: 380,
        padding: 22,
        background: 'var(--cream-50)',
        overflow: 'auto',
        flexShrink: 0,
      }}
    >
      <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
        <ClientAvatar initial={selected.initial} risk={selected.risk} size={56} />
        <div className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--teal-800)' }}>
            {selected.name}
          </span>
          <span className="caption">
            {selected.category}
            {selected.age ? ` · ${selected.age} thn` : ''}
            {selected.totalBookings > 0 ? ` · ${selected.totalBookings} sesi total` : ''}
          </span>
          <div className="flex items-center gap-1" style={{ marginTop: 4, flexWrap: 'wrap' }}>
            <span
              className="badge"
              style={{
                background: STATUS_TONE[selected.status].bg,
                color: STATUS_TONE[selected.status].fg,
                height: 18,
                fontSize: 10,
              }}
            >
              {selected.status}
            </span>
            <span
              className="badge"
              style={{
                background: RISK_TONE[selected.risk].bg,
                color: RISK_TONE[selected.risk].fg,
                height: 18,
                fontSize: 10,
                textTransform: 'capitalize',
              }}
            >
              risiko {selected.risk}
            </span>
          </div>
        </div>
      </div>

      {/* Kontak */}
      <div className="card-althea-flat" style={{ padding: 12, marginBottom: 12 }}>
        <span className="eyebrow" style={{ marginBottom: 6, display: 'block' }}>Kontak</span>
        <div className="flex flex-col" style={{ gap: 6, marginTop: 4 }}>
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <MessageSquare size={12} style={{ color: 'var(--success, #4f8c5b)' }} />
              <span style={{ fontSize: 12.5, color: 'var(--fg)', fontFamily: 'monospace' }}>
                {selected.wa}
              </span>
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ height: 24, padding: '0 8px', fontSize: 11 }}
              onClick={() => navigator.clipboard?.writeText(selected.wa)}
            >
              Salin
            </button>
          </div>
          {selected.email && (
            <div className="flex items-center justify-between gap-2">
              <span style={{ fontSize: 12.5, color: 'var(--fg)' }}>{selected.email}</span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ height: 24, padding: '0 8px', fontSize: 11 }}
                onClick={() => navigator.clipboard?.writeText(selected.email)}
              >
                Salin
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sesi berikutnya */}
      <div className="card-althea-flat" style={{ padding: 12, marginBottom: 12 }}>
        <span className="eyebrow" style={{ display: 'block' }}>Sesi berikutnya</span>
        {selected.next === '—' ? (
          <div className="flex flex-col" style={{ marginTop: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-muted)' }}>
              Belum dijadwalkan
            </span>
            <span className="caption" style={{ marginTop: 2 }}>
              Hubungi admin untuk menjadwalkan sesi lanjutan
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between" style={{ marginTop: 8, gap: 8 }}>
            <div className="flex flex-col" style={{ minWidth: 0 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal-800)' }}>
                {selected.next}
              </span>
              {selected.nextRoom && (
                <span className="caption" style={{ marginTop: 2 }}>
                  📍 Ruangan {selected.nextRoom}
                  {selected.sessionTotal > 1
                    ? ` · sesi ${selected.sessionN}/${selected.sessionTotal}`
                    : ''}
                </span>
              )}
            </div>
            <button type="button" className="btn btn-outline btn-sm" style={{ height: 28, flexShrink: 0 }}>
              Request reschedule
            </button>
          </div>
        )}
      </div>

      {/* Progres paket */}
      {selected.sessionTotal > 0 && (
        <div className="card-althea-flat" style={{ padding: 14, marginBottom: 12 }}>
          <div className="flex items-baseline justify-between">
            <span className="eyebrow">Progres paket</span>
            <span className="caption" style={{ fontSize: 10.5 }}>{selected.service}</span>
          </div>
          <div className="flex items-baseline" style={{ marginTop: 8, gap: 6 }}>
            <span
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: 'var(--teal-800)',
                fontFamily: 'var(--font-serif)',
              }}
            >
              {selected.sessionN} dari {selected.sessionTotal}
            </span>
            <span className="caption">sesi</span>
          </div>
          <div
            style={{
              height: 6,
              background: 'var(--cream-200)',
              borderRadius: 999,
              marginTop: 8,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${sesiPct}%`,
                height: '100%',
                background: sesiPct === 100 ? 'var(--cream-300)' : 'var(--sage-500)',
              }}
            />
          </div>
          {selected.lastSession && (
            <div className="flex items-center justify-between" style={{ marginTop: 8 }}>
              <span className="caption">Sesi terakhir</span>
              <span style={{ fontSize: 11.5, color: 'var(--teal-800)', fontWeight: 500 }}>
                {selected.lastSession}
                {selected.lastGap && selected.lastGap > 0
                  ? ` · ${selected.lastGap} hari lalu`
                  : ''}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Asesmen — backend stub */}
      <div className="card-althea-flat" style={{ padding: 12, marginBottom: 12 }}>
        <span className="eyebrow" style={{ display: 'block' }}>Asesmen terbaru</span>
        <div className="flex" style={{ gap: 8, marginTop: 8 }}>
          {[
            { label: 'GAD-7', max: 21 },
            { label: 'PHQ-9', max: 27 },
          ].map((it) => (
            <div
              key={it.label}
              className="flex flex-col"
              style={{ flex: 1, padding: 10, background: 'var(--bg-elev, #fff)', borderRadius: 6 }}
            >
              <span className="caption" style={{ fontSize: 10.5 }}>{it.label}</span>
              <div className="flex items-baseline" style={{ gap: 6, marginTop: 2 }}>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: 'var(--fg-muted)',
                    fontFamily: 'var(--font-serif)',
                  }}
                >
                  —
                </span>
                <span className="caption" style={{ fontSize: 10 }}>/ {it.max} · belum tersedia</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Catatan klinis */}
      <div className="flex items-baseline justify-between" style={{ marginBottom: 8 }}>
        <span className="eyebrow">Catatan klinis</span>
        <a href="/psikolog/sessions" style={{ fontSize: 11, color: 'var(--sage-700)', fontWeight: 500 }}>
          Buka editor lengkap →
        </a>
      </div>
      <div className="flex flex-col" style={{ gap: 8, marginBottom: 14 }}>
        <div
          className="card-althea-flat"
          style={{ padding: 14, background: 'var(--bg-elev, #fff)', textAlign: 'center' }}
        >
          <span className="caption" style={{ fontSize: 11.5, lineHeight: 1.45 }}>
            Catatan klinis per-sesi tersedia di halaman <strong>Catatan klinis</strong>.
          </span>
        </div>
      </div>

      <button type="button" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
        + Tulis catatan sesi hari ini
      </button>

      <div
        className="flex items-start gap-2"
        style={{
          marginTop: 12,
          padding: 10,
          background: 'var(--info-soft, #e6f0f7)',
          borderRadius: 6,
        }}
      >
        <Bell size={12} style={{ color: 'var(--info, #4a90c0)', flexShrink: 0, marginTop: 2 }} />
        <span style={{ fontSize: 11, color: '#2c4a60', lineHeight: 1.45 }}>
          Data klien ini hanya dapat diakses oleh Anda sebagai psikolog penanggung.
        </span>
      </div>
    </aside>
  );
}
