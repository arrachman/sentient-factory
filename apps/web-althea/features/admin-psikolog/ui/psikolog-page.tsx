'use client';

import { useMemo, useState } from 'react';
import { Bell, Check, Edit, Filter, Plus } from 'lucide-react';
import {
  useCreatePsikolog,
  usePsikologList,
  useUpdatePsikolog,
} from '../hooks/use-psikolog';
import {
  SPECIALTY_LABEL,
  type CreatePsikologInput,
  type Psikolog,
} from '../model/types';
import { PsikologForm } from './psikolog-form';

// ============================================================================
// Constants & helpers
// ============================================================================

// Filter chip categories — first 4 most common specialties + 'Semua'
const FILTER_TABS: Array<{ key: string; label: string }> = [
  { key: 'all', label: 'Semua' },
  { key: 'klinis_dewasa', label: 'Klinis Dewasa' },
  { key: 'anak_remaja', label: 'Anak & Remaja' },
  { key: 'tes_psikologi', label: 'Tes' },
  { key: 'keluarga', label: 'Keluarga' },
];

const HARI_SHORT = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function specialtyLabel(s: string): string {
  return SPECIALTY_LABEL[s] ?? s;
}

function initial(p: Psikolog): string {
  return (p.fullName ?? p.email).slice(0, 2).toUpperCase();
}

// Backend belum expose stats endpoint untuk psikolog — tampilkan zero-state
// supaya tidak mengarang angka untuk psikolog baru (tanpa histori transaksi).
function emptyStats(_p: Psikolog) {
  return {
    clients: 0,
    weekSessions: 0,
    weekCap: 0,
    todayClients: 0,
    todayMax: 4,
    recentlyFreed: false,
    utilization: 0,
    rating: null as string | null,
    since: null as number | null,
  };
}

function weekDistribution(_p: Psikolog): number[] {
  return HARI_SHORT.map(() => 0);
}

// ============================================================================
// Sub-components
// ============================================================================

function Avatar({
  p,
  size = 44,
  fontSize = 14,
}: {
  p: Psikolog;
  size?: number;
  fontSize?: number;
}) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: p.color ?? 'var(--sage-500)',
        color: '#fff',
        display: 'grid',
        placeItems: 'center',
        fontSize,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {initial(p)}
    </span>
  );
}

function PsikologCard({
  p,
  selected,
  onClick,
}: {
  p: Psikolog;
  selected: boolean;
  onClick: () => void;
}) {
  const stats = emptyStats(p);
  const dayFull = stats.todayClients >= stats.todayMax;
  const utilColor = stats.utilization > 90 ? 'var(--danger, #b54141)' : (p.color ?? 'var(--sage-500)');
  const specialtyText = Array.isArray(p.specialty) && p.specialty.length > 0
    ? specialtyLabel(p.specialty[0])
    : (p.title ?? '');

  return (
    <button
      type="button"
      onClick={onClick}
      className="card-althea text-left"
      style={{
        padding: 16,
        cursor: 'pointer',
        position: 'relative',
        borderColor: selected ? (p.color ?? 'var(--sage-500)') : 'var(--border)',
        boxShadow: selected ? `0 0 0 2px ${p.color ?? 'var(--sage-500)'}33` : 'none',
        transition: 'all .15s var(--ease, ease)',
      }}
    >
      {/* Top-right quota badges */}
      <div
        className="flex items-center gap-1"
        style={{ position: 'absolute', top: 12, right: 12 }}
      >
        {stats.recentlyFreed && (
          <span
            className="badge badge-success"
            style={{ height: 20, fontSize: 10 }}
            title="Slot baru terbuka karena reschedule/cancel"
          >
            slot baru terbuka
          </span>
        )}
        <span
          className="badge"
          style={{
            height: 20,
            fontSize: 10,
            background: dayFull ? 'var(--danger-soft, #fce4e4)' : 'var(--cream-100)',
            color: dayFull ? 'var(--danger, #b54141)' : 'var(--fg-muted)',
            fontWeight: 600,
          }}
        >
          hari ini {stats.todayClients}/{stats.todayMax}
        </span>
      </div>

      {/* Avatar + name */}
      <div className="flex items-center gap-3" style={{ marginBottom: 12, paddingRight: 90 }}>
        <Avatar p={p} size={48} fontSize={16} />
        <div className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--teal-800)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={p.fullName ?? p.email}
          >
            {p.fullName ?? p.email}
          </span>
          {specialtyText && (
            <span className="caption" style={{ marginTop: 2 }}>
              {specialtyText}
            </span>
          )}
        </div>
      </div>

      {/* Specialty tags */}
      {Array.isArray(p.specialty) && p.specialty.length > 0 && (
        <div className="flex flex-wrap" style={{ gap: 4, marginBottom: 12 }}>
          {p.specialty.slice(0, 4).map((t) => (
            <span key={t} className="badge badge-neutral" style={{ height: 20 }}>
              {specialtyLabel(t)}
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: 'var(--border)',
          margin: '0 -16px 12px',
        }}
      />

      {/* Stats: Klien / Minggu ini / Utilisasi */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
        }}
      >
        <div>
          <div className="caption">Klien</div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--teal-800)',
              fontFamily: 'var(--font-serif)',
            }}
          >
            {stats.clients}
          </div>
        </div>
        <div>
          <div className="caption">Minggu ini</div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--teal-800)',
              fontFamily: 'var(--font-serif)',
            }}
          >
            {stats.weekSessions}
          </div>
        </div>
        <div>
          <div className="caption">Utilisasi</div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: stats.utilization > 90 ? 'var(--danger, #b54141)' : 'var(--teal-800)',
              fontFamily: 'var(--font-serif)',
            }}
          >
            {stats.utilization}%
          </div>
        </div>
      </div>

      {/* Utilization bar */}
      <div
        style={{
          height: 4,
          background: 'var(--cream-200)',
          borderRadius: 999,
          marginTop: 10,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${Math.min(100, stats.utilization)}%`,
            height: '100%',
            background: utilColor,
            borderRadius: 999,
            transition: 'width .2s ease',
          }}
        />
      </div>
    </button>
  );
}

function ProfileAside({
  p,
  onEdit,
}: {
  p: Psikolog;
  onEdit: () => void;
}) {
  const stats = emptyStats(p);
  const week = weekDistribution(p);
  const specialtyText = Array.isArray(p.specialty) && p.specialty.length > 0
    ? specialtyLabel(p.specialty[0])
    : (p.title ?? '');

  return (
    <aside
      className="card-althea"
      style={{
        width: 320,
        flexShrink: 0,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="eyebrow">Profil</span>
        <button
          type="button"
          onClick={onEdit}
          className="btn btn-icon btn-ghost btn-sm"
          aria-label="Edit profil"
          title="Edit"
        >
          <Edit size={14} />
        </button>
      </div>

      <div
        className="flex flex-col items-center"
        style={{ textAlign: 'center', gap: 8, paddingBottom: 6 }}
      >
        <Avatar p={p} size={64} fontSize={20} />
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--teal-800)',
              fontFamily: 'var(--font-serif)',
            }}
          >
            {p.fullName ?? p.email}
          </div>
          <div className="caption" style={{ marginTop: 2 }}>
            {specialtyText}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="caption">Belum ada histori sesi</span>
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* Sesi minggu ini — bar chart */}
      <div className="flex flex-col gap-2">
        <span className="eyebrow">Sesi minggu ini</span>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 6,
          }}
        >
          {HARI_SHORT.map((d, i) => {
            const v = week[i];
            const max = 4;
            return (
              <div key={d} className="flex flex-col items-center" style={{ gap: 4 }}>
                <div
                  style={{
                    width: '100%',
                    height: 56,
                    background: 'var(--cream-100)',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'flex-end',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: `${(v / max) * 100}%`,
                      background: p.color ?? 'var(--sage-500)',
                      borderRadius: 4,
                      opacity: 0.85,
                    }}
                  />
                </div>
                <span style={{ fontSize: 10.5, color: 'var(--fg-muted)' }}>{d}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--teal-800)' }}>{v}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* Spesialisasi */}
      {Array.isArray(p.specialty) && p.specialty.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="eyebrow">Spesialisasi</span>
          <div className="flex flex-wrap" style={{ gap: 4 }}>
            {p.specialty.map((t) => (
              <span key={t} className="badge badge-sage">
                {specialtyLabel(t)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Layanan tersedia (UI stub — belum ada relasi psikolog × service di backend) */}
      <div className="flex flex-col gap-2">
        <span className="eyebrow">Layanan tersedia</span>
        <div className="flex flex-col" style={{ gap: 4 }}>
          {['Konseling Individu', 'Terapi Dewasa', 'Konseling Pasangan'].map((s) => (
            <div
              key={s}
              className="flex items-center gap-2"
              style={{ padding: '6px 0' }}
            >
              <Check size={13} style={{ color: 'var(--success, #4f8c5b)', strokeWidth: 2.5 }} />
              <span style={{ fontSize: 13 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="btn btn-outline btn-sm"
        style={{ marginTop: 'auto' }}
      >
        Lihat profil lengkap
      </button>
    </aside>
  );
}

// ============================================================================
// Main page
// ============================================================================

export function PsikologPage() {
  const [filter, setFilter] = useState<string>('all');
  const [editing, setEditing] = useState<Psikolog | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const listQuery = usePsikologList({
    isActive: true,
    specialty: filter === 'all' ? undefined : filter,
    limit: 100,
  });

  const createMut = useCreatePsikolog();
  const updateMut = useUpdatePsikolog();

  const psikologs = listQuery.data?.data ?? [];

  // Auto-select first when list loads
  const selected = useMemo(() => {
    if (psikologs.length === 0) return null;
    if (selectedId !== null) {
      const found = psikologs.find((p) => p.id === selectedId);
      if (found) return found;
    }
    return psikologs[0];
  }, [psikologs, selectedId]);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(p: Psikolog) {
    setEditing(p);
    setDialogOpen(true);
  }

  function handleSubmit(input: CreatePsikologInput) {
    if (editing) {
      const { email: _email, username: _u, password: _p, ...rest } = input;
      updateMut.mutate(
        { id: editing.id, input: rest },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditing(null);
          },
        },
      );
    } else {
      createMut.mutate(input, {
        onSuccess: () => {
          setDialogOpen(false);
        },
      });
    }
  }

  const submitting = createMut.isPending || updateMut.isPending;

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 100px)' }}>
      {/* Toolbar — filter chips + Sortir + Tambah */}
      <div
        style={{
          padding: '18px 28px 10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div
          className="flex items-center"
          style={{
            background: 'var(--cream-100)',
            borderRadius: 8,
            padding: 3,
            gap: 2,
          }}
        >
          {FILTER_TABS.map((t) => {
            const active = filter === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setFilter(t.key)}
                className="btn btn-sm"
                style={{
                  height: 30,
                  padding: '0 12px',
                  background: active ? 'var(--bg-elev, #fff)' : 'transparent',
                  boxShadow: active ? 'var(--shadow-xs, 0 1px 2px rgba(0,0,0,0.05))' : 'none',
                  color: active ? 'var(--teal-800)' : 'var(--fg-muted)',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="btn btn-outline btn-sm">
            <Filter size={14} /> Sortir
          </button>
          <button type="button" onClick={openCreate} className="btn btn-primary btn-sm">
            <Plus size={15} style={{ stroke: '#fff' }} /> Tambah Psikolog
          </button>
        </div>
      </div>

      {/* BR-01 quota explainer */}
      <div style={{ padding: '0 28px 12px' }}>
        <div
          className="flex items-start gap-2 card-althea-flat"
          style={{
            padding: 12,
            background: 'var(--info-soft, #e6f0f7)',
            borderColor: '#cfdde8',
          }}
        >
          <Bell size={14} style={{ color: 'var(--info, #4a90c0)', flexShrink: 0, marginTop: 2 }} />
          <div className="flex flex-col">
            <span className="caption" style={{ fontWeight: 600, color: '#2c4a60' }}>
              Kuota harian psikolog (BR-01)
            </span>
            <span
              className="caption"
              style={{ fontSize: 11.5, color: '#2c4a60', lineHeight: 1.5, marginTop: 2 }}
            >
              Tiap psikolog default maksimal <strong>4 klien per hari</strong>. Begitu sesi{' '}
              <em>reschedule</em> atau <em>dibatalkan</em>, kuota terbuka otomatis — admin bisa
              langsung menambah klien lain ke psikolog tersebut tanpa unblock manual.
            </span>
          </div>
        </div>
      </div>

      {/* Card grid + detail aside */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          padding: '0 28px 28px',
          display: 'flex',
          gap: 16,
        }}
      >
        {/* Left: card grid */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 14,
            alignContent: 'start',
            overflowY: 'auto',
          }}
        >
          {listQuery.isLoading ? (
            <div className="caption" style={{ gridColumn: '1 / -1', padding: 32, textAlign: 'center' }}>
              Memuat psikolog...
            </div>
          ) : psikologs.length === 0 ? (
            <div
              className="card-althea-flat"
              style={{ gridColumn: '1 / -1', padding: 32, textAlign: 'center' }}
            >
              <p className="caption">Belum ada psikolog dengan filter ini.</p>
              <button
                type="button"
                onClick={openCreate}
                className="btn btn-primary btn-sm"
                style={{ marginTop: 12 }}
              >
                <Plus size={15} style={{ stroke: '#fff' }} /> Tambah Psikolog
              </button>
            </div>
          ) : (
            psikologs.map((p) => (
              <PsikologCard
                key={p.id}
                p={p}
                selected={selected?.id === p.id}
                onClick={() => setSelectedId(p.id)}
              />
            ))
          )}
        </div>

        {/* Right: detail aside (desktop only) */}
        {selected && (
          <div className="hidden lg:block">
            <ProfileAside p={selected} onEdit={() => openEdit(selected)} />
          </div>
        )}
      </div>

      <PsikologForm
        open={dialogOpen}
        initial={editing}
        submitting={submitting}
        onSubmit={handleSubmit}
        onClose={() => {
          setDialogOpen(false);
          setEditing(null);
        }}
      />
    </div>
  );
}
