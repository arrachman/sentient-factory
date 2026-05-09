'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bell, Printer } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import type { Booking } from '@/features/admin-booking/model/types';
import { useMe } from '@/features/auth/hooks/use-me';

// ============================================================================
// Service category → SOAP fields & status row config (mirror mockup)
// ============================================================================

type ServiceKind = 'dewasa' | 'anak' | 'pasangan' | 'tes';

const STATUS_FIELDS: Record<ServiceKind, Array<[string, string, string]>> = {
  dewasa: [
    ['Mood klien', '— / 10', 'belum diisi'],
    ['Tidur', '—', 'jam'],
    ['Kepatuhan PR', '—', 'frekuensi'],
    ['Risiko self-harm', '—', 'tidak ada flag'],
  ],
  anak: [
    ['Mood', '— / 10', 'belum diisi'],
    ['Tidur', '—', 'jam'],
    ['Perilaku makan', '—', '—'],
    ['Kepatuhan PR', '—', '—'],
    ['Observasi ortu', '—', '—'],
    ['Risiko', '—', '—'],
  ],
  pasangan: [
    ['Mood — pasangan A', '— / 10', '—'],
    ['Mood — pasangan B', '— / 10', '—'],
    ['Dinamika hubungan', '—', '—'],
    ['Kepatuhan latihan', '—', '—'],
    ['Risiko KDRT', '—', '—'],
  ],
  tes: [
    ['Skor mentah', '—', '—'],
    ['Klasifikasi', '—', '—'],
    ['Interpretasi', '—', '—'],
    ['Rekomendasi', '—', '—'],
  ],
};

const SOAP_LABELS: Record<ServiceKind, Array<{ key: string; label: string; placeholder: string }>> = {
  dewasa: [
    { key: 's', label: 'S · Subjective', placeholder: 'Apa yang dilaporkan klien minggu ini? Gejala, keluhan, perubahan…' },
    { key: 'o', label: 'O · Objective', placeholder: 'Pengamatan klinis: postur, kontak mata, afek, tempo bicara…' },
    { key: 'a', label: 'A · Assessment', placeholder: 'Interpretasi & analisis: progress vs goal, hipotesis, perubahan diagnosa…' },
    { key: 'p', label: 'P · Plan', placeholder: 'Sesi berikutnya: fokus, intervensi, PR, asesmen ulang…' },
  ],
  anak: [
    { key: 's', label: 'S · Subjective (laporan ortu & anak)', placeholder: 'Laporan dari ortu + anak: tantrum, tidur, makan, sosial…' },
    { key: 'o', label: 'O · Objective (observasi sesi)', placeholder: 'Observasi langsung: bermain, kontak mata, regulasi emosi…' },
    { key: 'a', label: 'A · Assessment', placeholder: 'Adaptasi sosial, skill regulasi, bonding ortu-anak…' },
    { key: 'p', label: 'P · Plan', placeholder: 'Sesi berikutnya + PR untuk ortu (timer, pujian, dll)' },
  ],
  pasangan: [
    { key: 's', label: 'S · Subjective', placeholder: 'Laporan dari pasangan: konflik, latihan, dinamika minggu ini…' },
    { key: 'o', label: 'O · Objective', placeholder: 'Pengamatan dalam sesi: jarak duduk, eye contact, interupsi, listening…' },
    { key: 'a', label: 'A · Assessment', placeholder: 'Komunikasi, listening skill, trigger laten yang muncul…' },
    { key: 'p', label: 'P · Plan', placeholder: 'Latihan untuk minggu depan + tema sesi berikutnya…' },
  ],
  tes: [
    { key: 's', label: 'Riwayat administrasi', placeholder: 'Tes apa, tanggal, durasi, ruangan, rapport, gangguan…' },
    { key: 'o', label: 'Hasil per skala', placeholder: 'Skor mentah & komposit per subskala…' },
    { key: 'a', label: 'Interpretasi narasi', placeholder: 'Profil kognitif: kekuatan, kelemahan, disparitas antar-skala…' },
    { key: 'p', label: 'Rekomendasi', placeholder: '1) … 2) … 3) …' },
  ],
};

const SERVICE_OPTIONS: Array<{ key: ServiceKind; label: string }> = [
  { key: 'dewasa', label: 'Konseling/Terapi Dewasa' },
  { key: 'anak', label: 'Konseling/Terapi Anak' },
  { key: 'pasangan', label: 'Konseling Pasangan/Keluarga' },
  { key: 'tes', label: 'Tes Psikologi' },
];

// ============================================================================
// Helpers
// ============================================================================

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function formatSessionTime(start: string): string {
  const d = new Date(start);
  return d.toLocaleString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatSessionShort(start: string): string {
  const d = new Date(start);
  return d.toLocaleDateString('id-ID', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
}

function formatTimeOnly(iso: string): string {
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function toServiceKind(category: string): ServiceKind {
  const c = category.toLowerCase();
  if (c === 'anak' || c === 'kanak-kanak') return 'anak';
  if (c === 'pasangan' || c === 'keluarga') return 'pasangan';
  if (c === 'tes' || c === 'tes_psikologi') return 'tes';
  return 'dewasa';
}

// SOAP serialization — concat ke single noteText karena backend cuma terima
// freeform string (ClinicSessionNote.noteText). Format: '[S] ...\n\n[O] ...\n\n[A] ...\n\n[P] ...'
function serializeSOAP(soap: Record<string, string>, kind: ServiceKind): string {
  const labels = SOAP_LABELS[kind];
  return labels
    .map((l) => `[${l.label}]\n${(soap[l.key] ?? '').trim()}`)
    .filter((s) => s.split('\n').slice(1).join('').trim().length > 0)
    .join('\n\n');
}

function parseSOAPFromNote(noteText: string, kind: ServiceKind): Record<string, string> {
  const result: Record<string, string> = {};
  const labels = SOAP_LABELS[kind];
  for (const l of labels) {
    const re = new RegExp(`\\[${l.label.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\]\\s*([\\s\\S]*?)(?=\\n\\n\\[|$)`);
    const match = noteText.match(re);
    result[l.key] = match ? match[1].trim() : '';
  }
  return result;
}

// ============================================================================
// Sub-components
// ============================================================================

function SessionTimelineItem({
  b,
  selected,
  onClick,
}: {
  b: Booking;
  selected: boolean;
  onClick: () => void;
}) {
  const isCompleted = b.status === 'completed';
  const isInProgress = b.status === 'in_progress';
  return (
    <button
      type="button"
      onClick={onClick}
      className="card-althea-flat text-left"
      style={{
        padding: 12,
        background: selected ? 'var(--sage-50)' : 'var(--bg-elev, #fff)',
        border: '1px solid ' + (selected ? 'var(--sage-300)' : 'var(--border)'),
        cursor: 'pointer',
        width: '100%',
      }}
    >
      <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--teal-800)' }}>
        Sesi #{b.id} · {formatSessionShort(b.scheduledStart)}
      </span>
      <div className="caption" style={{ fontSize: 11, marginTop: 2 }}>
        {formatTimeOnly(b.scheduledStart)} · {b.room.name}
      </div>
      <div
        className="caption"
        style={{
          fontSize: 10.5,
          marginTop: 4,
          color: isCompleted ? 'var(--sage-700)' : isInProgress ? 'var(--success, #4f8c5b)' : 'var(--fg-muted)',
        }}
      >
        ●{' '}
        {isCompleted
          ? 'Selesai'
          : isInProgress
          ? 'Berlangsung'
          : b.status === 'checked_in'
          ? 'Check-in'
          : 'Akan datang'}
      </div>
    </button>
  );
}

// ============================================================================
// Main page
// ============================================================================

export default function PsikologSessionsPage() {
  const me = useMe();
  const myUserId = me.data?.data.id;
  const qc = useQueryClient();

  // Fetch own bookings (recent + completed) — sorted later
  const list = useBookingList({
    psikologUserId: myUserId,
    limit: 50,
    includeCancelled: false,
  });

  const items = useMemo(() => {
    const data = list.data?.data ?? [];
    return [...data].sort(
      (a, b) => new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime(),
    );
  }, [list.data]);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Auto-select most recent session when list loads
  useEffect(() => {
    if (selectedId === null && items.length > 0) {
      setSelectedId(items[0].id);
    }
  }, [items, selectedId]);

  const selected: Booking | null = useMemo(() => {
    if (selectedId === null) return null;
    return items.find((b) => b.id === selectedId) ?? null;
  }, [selectedId, items]);

  // Fetch existing notes for selected booking
  const notesQuery = useQuery({
    queryKey: ['clinic', 'booking', selected?.id, 'notes'],
    queryFn: () =>
      apiClient.get<{
        success: boolean;
        data: Array<{ id: number; noteText: string; createdAt: string }>;
      }>(`/booking/${selected!.id}/note`),
    enabled: !!selected?.id,
  });

  // Manual override service kind (mockup punya category toggle untuk demo)
  const inferredKind: ServiceKind = selected ? toServiceKind(selected.service.category) : 'dewasa';
  const [kind, setKind] = useState<ServiceKind>('dewasa');

  // Sync kind ke inferred saat selection berubah
  useEffect(() => {
    setKind(inferredKind);
  }, [selected?.id, inferredKind]);

  // SOAP form state
  const [soap, setSoap] = useState<Record<string, string>>({});
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // Load latest note into form when notes refetch
  useEffect(() => {
    const latest = notesQuery.data?.data?.[0];
    if (latest) {
      setSoap(parseSOAPFromNote(latest.noteText, kind));
      setSavedAt(new Date(latest.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    } else if (selected) {
      // Fresh form
      setSoap({});
      setSavedAt(null);
    }
  }, [notesQuery.data, selected?.id, kind]);

  // Save note mutation
  const saveMut = useMutation({
    mutationFn: async () => {
      if (!selected) throw new Error('Pilih sesi dulu');
      const noteText = serializeSOAP(soap, kind);
      if (!noteText.trim()) throw new Error('Isi minimal satu bagian SOAP sebelum simpan');
      return apiClient.post(`/booking/${selected.id}/note`, { noteText });
    },
    onSuccess: () => {
      toast.success('Catatan tersimpan');
      qc.invalidateQueries({ queryKey: ['clinic', 'booking', selected?.id, 'notes'] });
      setSavedAt(
        new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      );
    },
    onError: (e: Error) => toast.error('Gagal simpan', { description: e.message }),
  });

  const fields = STATUS_FIELDS[kind];
  const soapLabels = SOAP_LABELS[kind];

  return (
    <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
      {/* Left aside: session timeline */}
      <aside
        style={{
          width: 260,
          borderRight: '1px solid var(--border)',
          padding: '20px 16px',
          background: 'var(--cream-50)',
          overflow: 'auto',
          flexShrink: 0,
        }}
      >
        <span className="eyebrow" style={{ marginBottom: 10, display: 'block' }}>
          Riwayat sesi
        </span>
        <div className="flex flex-col" style={{ gap: 6 }}>
          {list.isLoading ? (
            <span className="caption">Memuat...</span>
          ) : items.length === 0 ? (
            <span className="caption">Belum ada sesi.</span>
          ) : (
            items.slice(0, 20).map((b) => (
              <SessionTimelineItem
                key={b.id}
                b={b}
                selected={b.id === selectedId}
                onClick={() => setSelectedId(b.id)}
              />
            ))
          )}
        </div>

        {/* Asesmen placeholder */}
        <span
          className="eyebrow"
          style={{ marginTop: 18, marginBottom: 8, display: 'block' }}
        >
          Asesmen
        </span>
        <div className="flex flex-col" style={{ gap: 6 }}>
          {[
            { label: 'GAD-7', score: '— / 21', sev: '—' },
            { label: 'PHQ-9', score: '— / 27', sev: '—' },
          ].map((it) => (
            <div
              key={it.label}
              className="card-althea-flat"
              style={{ padding: 10, background: 'var(--bg-elev, #fff)' }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--teal-800)' }}>
                {it.label}
              </span>
              <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--fg-muted)',
                    fontFamily: 'var(--font-serif)',
                  }}
                >
                  {it.score}
                </span>
                <span
                  className="badge"
                  style={{
                    background: 'var(--cream-200)',
                    color: 'var(--fg-muted)',
                    height: 18,
                    fontSize: 10,
                  }}
                >
                  {it.sev}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="caption" style={{ marginTop: 8, fontSize: 10.5 }}>
          Asesmen endpoint belum tersedia (UI stub).
        </p>
      </aside>

      {/* Center: editor */}
      <div style={{ flex: 1, padding: '20px 28px', overflow: 'auto', minWidth: 0 }}>
        {!selected ? (
          <div
            className="card-althea"
            style={{ padding: 32, textAlign: 'center', maxWidth: 480, margin: '40px auto' }}
          >
            <p className="caption">Pilih sesi dari panel kiri untuk mulai isi catatan klinis.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div
              className="flex items-start justify-between"
              style={{ marginBottom: 14, gap: 16, flexWrap: 'wrap' }}
            >
              <div className="flex flex-col" style={{ minWidth: 0 }}>
                <span className="eyebrow">
                  Sesi #{selected.id} · {formatSessionTime(selected.scheduledStart)}
                </span>
                <h2
                  style={{
                    margin: '4px 0 6px',
                    fontFamily: 'var(--font-serif)',
                    fontSize: 21,
                    fontWeight: 500,
                    color: 'var(--teal-800)',
                  }}
                >
                  Catatan klinis · {selected.client.name}
                </h2>
                <span className="caption" style={{ fontSize: 11.5 }}>
                  {selected.service.name}
                  {selected.sessionTotal > 1 ? ` · sesi ${selected.sessionN}/${selected.sessionTotal}` : ''}
                </span>
              </div>
              <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
                {savedAt && (
                  <span className="caption" style={{ fontSize: 11.5 }}>
                    Tersimpan otomatis · {savedAt}
                  </span>
                )}
                <button type="button" className="btn btn-outline btn-sm">
                  <Printer size={13} /> Cetak
                </button>
                <button
                  type="button"
                  onClick={() => saveMut.mutate()}
                  disabled={saveMut.isPending}
                  className="btn btn-primary btn-sm"
                >
                  {saveMut.isPending ? 'Menyimpan...' : 'Simpan catatan'}
                </button>
              </div>
            </div>

            {/* Layanan category toggle */}
            <div
              style={{
                padding: 10,
                background: 'var(--cream-50)',
                borderRadius: 8,
                marginBottom: 14,
              }}
            >
              <div
                className="flex items-center"
                style={{ gap: 8, flexWrap: 'wrap' }}
              >
                <span className="caption" style={{ fontSize: 11.5, fontWeight: 600 }}>
                  Field Status & SOAP menyesuaikan kategori layanan:
                </span>
                <div
                  style={{
                    display: 'inline-flex',
                    background: 'var(--bg-elev, #fff)',
                    borderRadius: 8,
                    padding: 3,
                    gap: 2,
                  }}
                >
                  {SERVICE_OPTIONS.map((o) => {
                    const active = kind === o.key;
                    return (
                      <button
                        key={o.key}
                        type="button"
                        onClick={() => setKind(o.key)}
                        className="btn btn-sm"
                        style={{
                          height: 28,
                          padding: '0 12px',
                          fontSize: 11.5,
                          background: active ? 'var(--sage-500)' : 'transparent',
                          color: active ? '#fff' : 'var(--fg-muted)',
                          fontWeight: active ? 600 : 500,
                        }}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Status row */}
            <div
              className="card-althea-flat"
              style={{
                padding: 14,
                marginBottom: 16,
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.min(fields.length, 6)}, 1fr)`,
                gap: 12,
              }}
            >
              {fields.map(([lbl, val, sub], i) => (
                <div key={i} className="flex flex-col">
                  <span className="caption" style={{ fontSize: 11 }}>
                    {lbl}
                  </span>
                  <span
                    style={{
                      fontSize: 14.5,
                      fontWeight: 600,
                      color: 'var(--teal-800)',
                      marginTop: 2,
                    }}
                  >
                    {val}
                  </span>
                  <span className="caption" style={{ fontSize: 10.5 }}>
                    {sub}
                  </span>
                </div>
              ))}
            </div>

            {/* SOAP textareas */}
            {soapLabels.map((l) => (
              <div key={l.key} className="flex flex-col gap-2" style={{ marginBottom: 14 }}>
                <span className="eyebrow">{l.label}</span>
                <textarea
                  className="input-althea"
                  value={soap[l.key] ?? ''}
                  onChange={(e) => setSoap((prev) => ({ ...prev, [l.key]: e.target.value }))}
                  placeholder={l.placeholder}
                  style={{
                    minHeight: 80,
                    height: 'auto',
                    padding: 12,
                    resize: 'vertical',
                    lineHeight: 1.55,
                    fontSize: 13,
                  }}
                />
              </div>
            ))}

            {/* Confidentiality footnote */}
            <div
              className="flex items-start gap-2"
              style={{
                padding: 12,
                background: 'var(--info-soft, #e6f0f7)',
                borderRadius: 8,
                border: '1px solid #cfdde8',
              }}
            >
              <Bell
                size={14}
                style={{ color: 'var(--info, #4a90c0)', flexShrink: 0, marginTop: 2 }}
              />
              <span className="caption" style={{ color: '#2c4a60' }}>
                Catatan klinis bersifat rahasia. Hanya psikolog penanggung & klien (atas izin) yang
                dapat mengakses.
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
