'use client';

import { useMemo, useState } from 'react';
import { Bell, Edit, Eye, MessageSquare, Search } from 'lucide-react';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import type { Booking } from '@/features/admin-booking/model/types';
import { useMe } from '@/features/auth/hooks/use-me';

// ============================================================================
// Types & constants
// ============================================================================

type ClientStatus = 'aktif' | 'baru' | 'paket selesai';
type RiskLevel = 'rendah' | 'sedang' | 'tinggi' | 'belum dinilai';

type AggregatedClient = {
  id: number;
  name: string;
  initial: string;
  category: string;
  age: number | null;
  service: string;
  sessionN: number;
  sessionTotal: number;
  next: string;
  nextRoom: string | null;
  status: ClientStatus;
  risk: RiskLevel;
  wa: string;
  email: string;
  totalBookings: number;
  lastSession: string | null;
  lastGap: number | null;
  flags: string[];
};

const RISK_TONE: Record<RiskLevel, { bg: string; fg: string; dot: string }> = {
  rendah: { bg: 'var(--success-soft, #e0eee2)', fg: 'var(--success, #4f8c5b)', dot: 'var(--success, #4f8c5b)' },
  sedang: { bg: 'var(--warn-soft, #fbf3dc)', fg: '#8a4a00', dot: '#c98a00' },
  tinggi: { bg: 'var(--danger-soft, #fce4e4)', fg: 'var(--danger, #b54141)', dot: 'var(--danger, #b54141)' },
  'belum dinilai': { bg: 'var(--cream-200)', fg: 'var(--fg-muted)', dot: 'var(--fg-muted)' },
};

const STATUS_TONE: Record<ClientStatus, { bg: string; fg: string }> = {
  aktif: { bg: 'var(--sage-100)', fg: 'var(--sage-800)' },
  baru: { bg: 'var(--teal-700)', fg: '#fff' },
  'paket selesai': { bg: 'var(--cream-200)', fg: 'var(--fg-muted)' },
};

const CATEGORY_OPTIONS = ['Semua', 'Anak', 'Remaja', 'Dewasa', 'Pasangan', 'Keluarga'] as const;

// ============================================================================
// Helpers
// ============================================================================

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatNext(start: Date): string {
  const today = new Date();
  if (isSameDay(start, today)) {
    return `Hari ini · ${start.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
  }
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  if (isSameDay(start, tomorrow)) {
    return `Besok · ${start.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
  }
  return start.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) + ` · ${start.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
}

function categoryLabel(cat: string): string {
  if (!cat) return 'Dewasa';
  const c = cat.toLowerCase();
  if (c === 'anak' || c === 'kanak-kanak') return 'Anak';
  if (c === 'remaja') return 'Remaja';
  if (c === 'pasangan') return 'Pasangan';
  if (c === 'keluarga') return 'Keluarga';
  return 'Dewasa';
}

function clientInitial(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function deriveStatus(totalBookings: number, sessionN: number, sessionTotal: number): ClientStatus {
  if (totalBookings === 1) return 'baru';
  if (sessionTotal > 0 && sessionN >= sessionTotal) return 'paket selesai';
  return 'aktif';
}

// Risk stub — backend belum punya GAD-7/PHQ-9 endpoint. Derive dari activity gap
// sebagai placeholder: gap > 21 hari → sedang, < 7 → rendah, sisanya belum dinilai.
function deriveRisk(lastGapDays: number | null, totalBookings: number): RiskLevel {
  if (totalBookings <= 1) return 'belum dinilai';
  if (lastGapDays === null) return 'belum dinilai';
  if (lastGapDays > 21) return 'sedang';
  if (lastGapDays < 7) return 'rendah';
  return 'belum dinilai';
}

function aggregateClients(bookings: Booking[]): AggregatedClient[] {
  const map = new Map<number, AggregatedClient & { _bookings: Booking[] }>();
  for (const b of bookings) {
    const cid = b.client.id;
    const existing = map.get(cid);
    if (existing) {
      existing._bookings.push(b);
      existing.totalBookings += 1;
    } else {
      map.set(cid, {
        id: cid,
        name: b.client.name,
        initial: clientInitial(b.client.name),
        category: 'Dewasa', // backend client category not in booking projection — stub
        age: null,
        service: b.service.name,
        sessionN: b.sessionN,
        sessionTotal: b.sessionTotal,
        next: '—',
        nextRoom: null,
        status: 'aktif',
        risk: 'belum dinilai',
        wa: b.client.phoneWa,
        email: '',
        totalBookings: 1,
        lastSession: null,
        lastGap: null,
        flags: [],
        _bookings: [b],
      });
    }
  }

  const now = new Date();
  const out: AggregatedClient[] = [];
  for (const c of map.values()) {
    const sortedFuture = c._bookings
      .filter((b) => new Date(b.scheduledStart) >= now && b.status !== 'cancelled' && b.status !== 'completed')
      .sort((a, b) => new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime());
    const nextBooking = sortedFuture[0];
    if (nextBooking) {
      c.next = formatNext(new Date(nextBooking.scheduledStart));
      c.nextRoom = nextBooking.room.name;
      c.service = nextBooking.service.name;
      c.sessionN = nextBooking.sessionN;
      c.sessionTotal = nextBooking.sessionTotal;
    }

    const sortedPast = c._bookings
      .filter((b) => b.status === 'completed' || new Date(b.scheduledStart) < now)
      .sort((a, b) => new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime());
    const lastBooking = sortedPast[0];
    if (lastBooking) {
      const lastDate = new Date(lastBooking.scheduledStart);
      c.lastSession = lastDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
      c.lastGap = Math.max(0, Math.floor((now.getTime() - lastDate.getTime()) / (24 * 60 * 60 * 1000)));
    }

    c.status = deriveStatus(c.totalBookings, c.sessionN, c.sessionTotal);
    c.risk = deriveRisk(c.lastGap, c.totalBookings);

    if (c.totalBookings === 1 && c.status === 'baru') c.flags.push('intake');
    if (c.totalBookings >= 5 && c.status === 'aktif') c.flags.push('high-engagement');
    if (c.status === 'paket selesai') c.flags.push('terminasi');

    out.push(c);
  }

  return out;
}

// ============================================================================
// Sub-components
// ============================================================================

function ClientAvatar({
  initial,
  risk,
  size = 32,
}: {
  initial: string;
  risk: RiskLevel;
  size?: number;
}) {
  const dotSize = size > 40 ? 14 : 10;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: 'var(--sage-200)',
        color: 'var(--sage-800)',
        display: 'grid',
        placeItems: 'center',
        fontSize: size > 40 ? 19 : 12,
        fontWeight: 600,
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {initial}
      <span
        title={`Risiko: ${risk}`}
        style={{
          position: 'absolute',
          bottom: -1,
          right: -1,
          width: dotSize,
          height: dotSize,
          borderRadius: 999,
          background: RISK_TONE[risk].dot,
          border: `2px solid var(--bg-elev, #fff)`,
        }}
      />
    </div>
  );
}

// ============================================================================
// Main page
// ============================================================================

export default function PsikologPatientsPage() {
  const me = useMe();
  const myUserId = me.data?.data.id;

  const [statusTab, setStatusTab] = useState<'Semua' | 'Aktif' | 'Baru' | 'Selesai'>('Semua');
  const [katFilter, setKatFilter] = useState<(typeof CATEGORY_OPTIONS)[number]>('Semua');
  const [sortBy, setSortBy] = useState<'next' | 'name' | 'risk'>('next');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const list = useBookingList({
    psikologUserId: myUserId,
    limit: 200,
    includeCancelled: true,
  });

  const allClients = useMemo<AggregatedClient[]>(() => {
    const items = list.data?.data ?? [];
    return aggregateClients(items);
  }, [list.data]);

  const counts = useMemo(() => {
    return {
      Semua: allClients.length,
      Aktif: allClients.filter((c) => c.status === 'aktif').length,
      Baru: allClients.filter((c) => c.status === 'baru').length,
      Selesai: allClients.filter((c) => c.status === 'paket selesai').length,
    };
  }, [allClients]);

  const todayCount = useMemo(
    () => allClients.filter((c) => c.next.startsWith('Hari ini')).length,
    [allClients],
  );

  const visible = useMemo(() => {
    let rows = allClients.slice();
    if (statusTab === 'Aktif') rows = rows.filter((c) => c.status === 'aktif');
    else if (statusTab === 'Baru') rows = rows.filter((c) => c.status === 'baru');
    else if (statusTab === 'Selesai') rows = rows.filter((c) => c.status === 'paket selesai');
    if (katFilter !== 'Semua') rows = rows.filter((c) => c.category === katFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter(
        (c) => c.name.toLowerCase().includes(q) || c.service.toLowerCase().includes(q),
      );
    }
    if (sortBy === 'next') {
      rows.sort((a, b) => {
        if (a.next === '—') return 1;
        if (b.next === '—') return -1;
        return a.next.localeCompare(b.next);
      });
    } else if (sortBy === 'name') {
      rows.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'risk') {
      const o: Record<RiskLevel, number> = { tinggi: 0, sedang: 1, rendah: 2, 'belum dinilai': 3 };
      rows.sort((a, b) => o[a.risk] - o[b.risk]);
    }
    return rows;
  }, [allClients, statusTab, katFilter, sortBy, query]);

  const selected: AggregatedClient | null = useMemo(() => {
    if (allClients.length === 0) return null;
    if (selectedId !== null) {
      const found = allClients.find((c) => c.id === selectedId);
      if (found) return found;
    }
    return visible[0] ?? allClients[0] ?? null;
  }, [selectedId, visible, allClients]);

  const sesiPct = selected
    ? Math.round((selected.sessionN / Math.max(1, selected.sessionTotal)) * 100)
    : 0;

  return (
    <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
      {/* Left: list */}
      <div
        style={{
          flex: 1.5,
          padding: 20,
          overflow: 'auto',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          minWidth: 0,
        }}
      >
        {/* Privacy banner */}
        <div
          className="flex items-center gap-2"
          style={{
            padding: '8px 12px',
            background: 'var(--info-soft, #e6f0f7)',
            border: '1px solid #cfdde8',
            borderRadius: 8,
          }}
        >
          <Eye size={14} style={{ color: 'var(--info, #4a90c0)', flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: '#2c4a60', lineHeight: 1.4 }}>
            Menampilkan <strong>hanya klien Anda</strong> ({allClients.length} klien). Data klien
            psikolog lain tidak bisa diakses sesuai kebijakan privasi (BR-04).
          </span>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center" style={{ gap: 12 }}>
          <div
            className="flex items-center"
            style={{
              background: 'var(--bg-elev, #fff)',
              padding: 4,
              borderRadius: 8,
              border: '1px solid var(--border)',
              gap: 2,
            }}
          >
            {(['Semua', 'Aktif', 'Baru', 'Selesai'] as const).map((t) => {
              const sel = t === statusTab;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setStatusTab(t)}
                  className="btn btn-sm"
                  style={{
                    height: 28,
                    padding: '0 12px',
                    background: sel ? 'var(--sage-500)' : 'transparent',
                    color: sel ? '#fff' : 'var(--fg)',
                    fontWeight: sel ? 600 : 500,
                  }}
                >
                  {t} <span style={{ marginLeft: 4, opacity: 0.8 }}>{counts[t]}</span>
                </button>
              );
            })}
          </div>

          <div
            style={{
              position: 'relative',
              flex: 1,
              minWidth: 200,
              maxWidth: 280,
            }}
          >
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: 11,
                top: 10,
                color: 'var(--fg-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              className="input-althea"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama klien atau layanan…"
              style={{ paddingLeft: 32, height: 34, fontSize: 13 }}
            />
          </div>

          <select
            className="input-althea"
            value={katFilter}
            onChange={(e) => setKatFilter(e.target.value as typeof katFilter)}
            style={{ height: 34, fontSize: 12.5, width: 'auto', minWidth: 150 }}
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c === 'Semua' ? 'Semua kategori' : c}
              </option>
            ))}
          </select>

          <select
            className="input-althea"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            style={{ height: 34, fontSize: 12.5, width: 'auto', minWidth: 180 }}
          >
            <option value="next">Urut: sesi terdekat</option>
            <option value="name">Urut: nama A–Z</option>
            <option value="risk">Urut: risiko tertinggi</option>
          </select>

          <span style={{ flex: 1 }} />

          <span className="caption" style={{ fontVariantNumeric: 'tabular-nums' }}>
            <strong style={{ color: 'var(--sage-700)' }}>{todayCount} hari ini</strong> ·{' '}
            {visible.length}/{allClients.length} klien
          </span>
        </div>

        {/* Table */}
        <div
          className="card-althea"
          style={{
            padding: 0,
            overflow: 'hidden',
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.8fr 0.8fr 1.4fr 1.5fr 1.6fr 0.9fr 0.5fr',
              padding: '12px 16px',
              background: 'var(--cream-50)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            {['Klien', 'Kategori', 'Layanan', 'Progres sesi', 'Sesi berikutnya', 'Risiko', ''].map(
              (h, i) => (
                <span key={i} className="eyebrow" style={{ fontSize: 10.5 }}>
                  {h}
                </span>
              ),
            )}
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {list.isLoading ? (
              <div className="caption" style={{ padding: 32, textAlign: 'center' }}>
                Memuat klien...
              </div>
            ) : visible.length === 0 ? (
              <div
                className="flex flex-col items-center"
                style={{ padding: '60px 24px', textAlign: 'center', gap: 8 }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 999,
                    background: 'var(--cream-100)',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Eye size={20} style={{ color: 'var(--fg-muted)' }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal-800)' }}>
                  Tidak ada klien yang cocok
                </span>
                <span className="caption" style={{ maxWidth: 320, lineHeight: 1.45 }}>
                  {query
                    ? `Tidak ada klien dengan kata kunci "${query}".`
                    : 'Belum ada klien dengan filter saat ini.'}{' '}
                  Coba ubah filter atau hapus pencarian.
                </span>
                {(query || katFilter !== 'Semua' || statusTab !== 'Semua') && (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setQuery('');
                      setKatFilter('Semua');
                      setStatusTab('Semua');
                    }}
                    style={{ marginTop: 6 }}
                  >
                    Reset filter
                  </button>
                )}
              </div>
            ) : (
              visible.map((c, i) => {
                const isSel = c.id === selected?.id;
                const isHov = c.id === hoveredId;
                const pct = c.sessionTotal > 0
                  ? Math.round((c.sessionN / c.sessionTotal) * 100)
                  : 0;
                const rt = RISK_TONE[c.risk];
                const st = STATUS_TONE[c.status];
                const isToday = c.next.startsWith('Hari ini');
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    onMouseEnter={() => setHoveredId(c.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.8fr 0.8fr 1.4fr 1.5fr 1.6fr 0.9fr 0.5fr',
                      padding: '14px 16px',
                      borderTop: i ? '1px solid var(--border)' : 'none',
                      alignItems: 'center',
                      cursor: 'pointer',
                      background: isSel
                        ? 'var(--sage-50)'
                        : isHov
                        ? 'var(--cream-50)'
                        : 'transparent',
                      borderLeft: isSel ? '3px solid var(--sage-500)' : '3px solid transparent',
                      paddingLeft: isSel ? 13 : 16,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <ClientAvatar initial={c.initial} risk={c.risk} />
                      <div className="flex flex-col" style={{ minWidth: 0 }}>
                        <span
                          style={{
                            fontSize: 13.5,
                            fontWeight: 500,
                            color: 'var(--teal-800)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          title={c.name}
                        >
                          {c.name}
                        </span>
                        <div
                          className="flex items-center gap-1"
                          style={{ marginTop: 1, flexWrap: 'wrap' }}
                        >
                          <span
                            className="badge"
                            style={{
                              background: st.bg,
                              color: st.fg,
                              height: 16,
                              fontSize: 9.5,
                              padding: '0 6px',
                            }}
                          >
                            {c.status}
                          </span>
                          {c.flags.map((f) => (
                            <span
                              key={f}
                              className="badge"
                              style={{
                                background: 'var(--cream-200)',
                                color: 'var(--fg-muted)',
                                height: 16,
                                fontSize: 9.5,
                                padding: '0 6px',
                              }}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="caption">{c.category}</span>
                    <span style={{ fontSize: 12.5, color: 'var(--fg)' }}>{c.service}</span>
                    <div className="flex flex-col" style={{ gap: 4 }}>
                      <div className="flex items-baseline justify-between">
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'var(--sage-700)',
                            fontFamily: 'var(--font-serif)',
                          }}
                        >
                          {c.sessionN} dari {c.sessionTotal || '?'}
                        </span>
                        <span className="caption" style={{ fontSize: 10.5 }}>
                          {pct}%
                        </span>
                      </div>
                      <div
                        style={{
                          height: 4,
                          background: 'var(--cream-200)',
                          borderRadius: 999,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: '100%',
                            background: pct === 100 ? 'var(--cream-300)' : 'var(--sage-500)',
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col" style={{ gap: 2 }}>
                      <span
                        style={{
                          fontSize: 12.5,
                          color: isToday ? 'var(--sage-700)' : 'var(--fg)',
                          fontWeight: isToday ? 600 : 400,
                        }}
                      >
                        {c.next}
                      </span>
                      {c.nextRoom && (
                        <span className="caption" style={{ fontSize: 10.5 }}>
                          📍 {c.nextRoom}
                        </span>
                      )}
                    </div>
                    <span
                      className="badge"
                      style={{
                        background: rt.bg,
                        color: rt.fg,
                        height: 20,
                        fontSize: 10.5,
                        textTransform: 'capitalize',
                      }}
                    >
                      {c.risk}
                    </span>
                    <div
                      className="flex items-center justify-end gap-1"
                      style={{
                        opacity: isHov || isSel ? 1 : 0.15,
                        transition: 'opacity .15s',
                      }}
                    >
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="btn btn-icon btn-ghost btn-sm"
                        title={`WA: ${c.wa}`}
                      >
                        <MessageSquare size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="btn btn-icon btn-ghost btn-sm"
                        title="Buka catatan klinis"
                      >
                        <Edit size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Right: detail aside */}
      {selected && (
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
            <span className="eyebrow" style={{ marginBottom: 6, display: 'block' }}>
              Kontak
            </span>
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
                  <span className="flex items-center gap-2" style={{ minWidth: 0 }}>
                    <span style={{ fontSize: 12.5, color: 'var(--fg)' }}>{selected.email}</span>
                  </span>
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

          {/* Sesi mendatang */}
          <div className="card-althea-flat" style={{ padding: 12, marginBottom: 12 }}>
            <span className="eyebrow" style={{ display: 'block' }}>
              Sesi berikutnya
            </span>
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
              <div
                className="flex items-center justify-between"
                style={{ marginTop: 8, gap: 8 }}
              >
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
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ height: 28, flexShrink: 0 }}
                >
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
                <span className="caption" style={{ fontSize: 10.5 }}>
                  {selected.service}
                </span>
              </div>
              <div
                className="flex items-baseline"
                style={{ marginTop: 8, gap: 6 }}
              >
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
            <span className="eyebrow" style={{ display: 'block' }}>
              Asesmen terbaru
            </span>
            <div className="flex" style={{ gap: 8, marginTop: 8 }}>
              {[
                { label: 'GAD-7', max: 21, value: null },
                { label: 'PHQ-9', max: 27, value: null },
              ].map((it) => (
                <div
                  key={it.label}
                  className="flex flex-col"
                  style={{
                    flex: 1,
                    padding: 10,
                    background: 'var(--bg-elev, #fff)',
                    borderRadius: 6,
                  }}
                >
                  <span className="caption" style={{ fontSize: 10.5 }}>
                    {it.label}
                  </span>
                  <div
                    className="flex items-baseline"
                    style={{ gap: 6, marginTop: 2 }}
                  >
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
                    <span className="caption" style={{ fontSize: 10 }}>
                      / {it.max} · belum tersedia
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Catatan klinis (stub — kalau endpoint /booking/:id/note ada, render) */}
          <div
            className="flex items-baseline justify-between"
            style={{ marginBottom: 8 }}
          >
            <span className="eyebrow">Catatan klinis</span>
            <a
              href="/psikolog/sessions"
              style={{ fontSize: 11, color: 'var(--sage-700)', fontWeight: 500 }}
            >
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

          <button type="button" className="btn btn-primary" style={{ width: '100%' }}>
            + Tulis catatan sesi hari ini
          </button>

          {/* Privacy */}
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
              Data klien ini hanya dapat diakses oleh Anda sebagai psikolog penanggung. BR-04.
            </span>
          </div>
        </aside>
      )}
    </div>
  );
}
