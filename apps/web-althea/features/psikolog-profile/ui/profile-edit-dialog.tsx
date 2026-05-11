'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Psikolog } from '@/features/admin-psikolog/model/types';
import { COLOR_PALETTE } from '@/features/admin-psikolog/model/types';
import type { UpdateProfileInput } from '../api/profile.api';

type Props = {
  open: boolean;
  initial: Psikolog;
  submitting: boolean;
  onSubmit: (input: UpdateProfileInput) => void;
  onClose: () => void;
};

/**
 * Self-edit subset profile untuk psikolog (non-sensitive fields).
 * Editable:
 *   - fullName (display name di sidebar + booking notif)
 *   - title (gelar mis. "M.Psi" — muncul di booking detail)
 *   - bio (tampil di profil publik / klinis)
 *   - color (avatar tint, dipakai di schedule grid + sidebar)
 *
 * Restricted (admin-only via /admin/psikolog):
 *   - email, username, license, defaultSlots, specialty, isActive
 */
export function ProfileEditDialog({
  open,
  initial,
  submitting,
  onSubmit,
  onClose,
}: Props) {
  const [fullName, setFullName] = useState(initial.fullName ?? '');
  const [title, setTitle] = useState(initial.title ?? '');
  const [bio, setBio] = useState(initial.bio ?? '');
  const [color, setColor] = useState(initial.color ?? COLOR_PALETTE[0]);

  // Sync state when dialog re-opens with fresh initial
  useEffect(() => {
    if (open) {
      setFullName(initial.fullName ?? '');
      setTitle(initial.title ?? '');
      setBio(initial.bio ?? '');
      setColor(initial.color ?? COLOR_PALETTE[0]);
    }
  }, [open, initial]);

  if (!open) return null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      fullName: fullName.trim() || undefined,
      title: title.trim() || undefined,
      bio: bio.trim() || undefined,
      color: color || undefined,
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-edit-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div
        className="card-althea bg-card"
        style={{ width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div
          className="flex items-center justify-between border-b border-border"
          style={{ padding: '16px 22px' }}
        >
          <h2 id="profile-edit-title" className="h2" style={{ margin: 0 }}>
            Edit profil saya
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="btn btn-ghost btn-icon"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={submit}
          className="flex flex-col"
          style={{ gap: 14, padding: '18px 22px' }}
        >
          <p
            className="caption"
            style={{
              padding: 10,
              background: 'var(--cream-50)',
              borderRadius: 6,
              lineHeight: 1.5,
            }}
          >
            ℹ️ Email, lisensi SIPP, dan spesialisasi dikelola oleh admin.
            Hubungi admin klinik untuk perubahan field tsb.
          </p>

          <div>
            <label className="caption mb-1 block">Nama Lengkap *</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              minLength={2}
              maxLength={255}
              className="input-althea"
              placeholder="Vina Permatasari, M.Psi"
            />
          </div>

          <div>
            <label className="caption mb-1 block">Title / Gelar</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              className="input-althea"
              placeholder="M.Psi"
            />
            <p className="caption" style={{ fontSize: 11, marginTop: 4 }}>
              Muncul setelah nama di booking notif dan tabel jadwal.
            </p>
          </div>

          <div>
            <label className="caption mb-1 block">Bio singkat</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={2000}
              rows={4}
              className="input-althea"
              style={{ height: 'auto', padding: 10, resize: 'vertical', lineHeight: 1.5 }}
              placeholder="Lulusan Magister Psikologi Klinis UI, fokus pada anxiety & burnout..."
            />
          </div>

          <div>
            <label className="caption mb-1 block">Warna avatar</label>
            <div className="flex flex-wrap" style={{ gap: 8 }}>
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="rounded-full transition"
                  style={{
                    width: 32,
                    height: 32,
                    background: c,
                    border:
                      color === c
                        ? '2px solid var(--teal-800)'
                        : '2px solid var(--border)',
                    boxShadow:
                      color === c
                        ? '0 0 0 2px var(--sage-300)'
                        : 'none',
                    cursor: 'pointer',
                  }}
                  aria-label={`Pilih warna ${c}`}
                  aria-pressed={color === c}
                />
              ))}
            </div>
          </div>

          <div
            className="flex items-center justify-end gap-2"
            style={{ paddingTop: 14, borderTop: '1px solid var(--border)' }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn btn-outline btn-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting || !fullName.trim()}
              className="btn btn-primary btn-sm"
            >
              {submitting ? 'Menyimpan…' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
