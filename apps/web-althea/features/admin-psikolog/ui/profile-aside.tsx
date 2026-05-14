'use client';

import { Check, Edit, PowerOff, Trash2 } from 'lucide-react';
import { useServiceList } from '../../admin-layanan/hooks/use-service';
import type { Service } from '../../admin-layanan/model/types';
import { DAY_KEYS, SPECIALTY_LABEL, type DayKey, type Psikolog } from '../model/types';
import { PsikologAvatarSimple as Avatar } from './psikolog-card';

const HARI_SHORT = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function specialtyLabel(s: string) {
  return SPECIALTY_LABEL[s] ?? s;
}

export function ProfileAside({
  p,
  onEdit,
  onDelete,
  onDeactivate,
}: {
  p: Psikolog;
  onEdit: () => void;
  onDelete: (p: Psikolog) => void;
  onDeactivate: (p: Psikolog) => void;
}) {
  const sinceYear = p.createdAt ? new Date(p.createdAt).getFullYear() : null;
  const specialtyText =
    Array.isArray(p.specialty) && p.specialty.length > 0
      ? specialtyLabel(p.specialty[0])
      : (p.title ?? '');

  const weeklyCapacity = DAY_KEYS.slice(0, 6).map((key) => {
    const day = p.weeklyAvailability?.[key as DayKey];
    if (!day?.isOpen) return 0;
    return day.slotIndices?.length ?? p.defaultSlots ?? 0;
  });
  const weeklyMax = Math.max(1, ...weeklyCapacity);
  const weeklyTotal = weeklyCapacity.reduce((a, b) => a + b, 0);

  const serviceListQuery = useServiceList({ isActive: true, limit: 100 });
  const allServices: Service[] = serviceListQuery.data?.data ?? [];
  const handlesAll = !p.serviceIds || p.serviceIds.length === 0;
  const myServices = handlesAll
    ? allServices
    : allServices.filter((s) => p.serviceIds.includes(s.id));

  return (
    <aside
      className="card-althea"
      style={{ width: 320, flexShrink: 0, padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }}
    >
      <div className="flex items-center justify-between">
        <span className="eyebrow">Profil</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="btn btn-icon btn-ghost btn-sm"
            aria-label="Edit profil"
            title="Edit"
          >
            <Edit size={14} />
          </button>
          {p.hasBookings ? (
            <button
              type="button"
              onClick={() => onDeactivate(p)}
              className="btn btn-icon btn-ghost btn-sm text-warning"
              title="Ada booking terkait — klik untuk nonaktifkan"
              aria-label="Nonaktifkan psikolog"
            >
              <PowerOff size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onDelete(p)}
              className="btn btn-icon btn-ghost btn-sm text-danger"
              title="Hapus psikolog"
              aria-label="Hapus psikolog"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center" style={{ textAlign: 'center', gap: 8, paddingBottom: 6 }}>
        <Avatar p={p} size={64} fontSize={20} />
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--teal-800)', fontFamily: 'var(--font-serif)' }}>
            {p.fullName ?? p.email}
          </div>
          <div className="caption" style={{ marginTop: 2 }}>
            {specialtyText}
            {specialtyText && sinceYear ? ' · ' : ''}
            {sinceYear ? `sejak ${sinceYear}` : ''}
          </div>
        </div>
        {p.license && <div className="caption" style={{ fontSize: 11.5 }}>SIPP {p.license}</div>}
        {p.phone && <div className="caption" style={{ fontSize: 11.5 }}>WA {p.phone}</div>}
      </div>

      <div style={{ height: 1, background: 'var(--border)' }} />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="eyebrow">Kapasitas mingguan</span>
          <span className="caption" style={{ fontSize: 11 }}>{weeklyTotal} slot</span>
        </div>
        {weeklyTotal === 0 ? (
          <div className="caption" style={{ padding: '10px 12px', background: 'var(--cream-100)', borderRadius: 6, fontSize: 11.5 }}>
            Jadwal mingguan belum di-set.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
            {HARI_SHORT.map((d, i) => {
              const v = weeklyCapacity[i];
              return (
                <div key={d} className="flex flex-col items-center" style={{ gap: 4 }}>
                  <div style={{ width: '100%', height: 56, background: 'var(--cream-100)', borderRadius: 4, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: '100%',
                        height: `${(v / weeklyMax) * 100}%`,
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
        )}
      </div>

      <div style={{ height: 1, background: 'var(--border)' }} />

      {Array.isArray(p.specialty) && p.specialty.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="eyebrow">Spesialisasi</span>
          <div className="flex flex-wrap" style={{ gap: 4 }}>
            {p.specialty.map((t) => (
              <span key={t} className="badge badge-sage">{specialtyLabel(t)}</span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <span className="eyebrow">Layanan tersedia</span>
        {serviceListQuery.isLoading ? (
          <span className="caption" style={{ fontSize: 11.5 }}>Memuat layanan...</span>
        ) : myServices.length === 0 ? (
          <span className="caption" style={{ fontSize: 11.5 }}>
            {handlesAll ? 'Belum ada layanan aktif.' : 'Belum di-assign layanan.'}
          </span>
        ) : (
          <>
            {handlesAll && (
              <span className="caption" style={{ fontSize: 11, fontStyle: 'italic' }}>
                Menangani semua layanan aktif
              </span>
            )}
            <div className="flex flex-col" style={{ gap: 4 }}>
              {myServices.map((s) => (
                <div key={s.id} className="flex items-center gap-2" style={{ padding: '6px 0' }}>
                  <Check size={13} style={{ color: 'var(--success, #4f8c5b)', strokeWidth: 2.5 }} />
                  <span style={{ fontSize: 13 }}>{s.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <button type="button" onClick={onEdit} className="btn btn-outline btn-sm" style={{ marginTop: 'auto' }}>
        Lihat profil lengkap
      </button>
    </aside>
  );
}
