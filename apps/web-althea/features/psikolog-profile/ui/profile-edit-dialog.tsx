'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, Trash2, Upload, X } from 'lucide-react';
import type { Psikolog } from '@/features/admin-psikolog/model/types';
import { COLOR_PALETTE } from '@/features/admin-psikolog/model/types';
import type { UpdateProfileInput } from '../api/profile.api';
import { resizeAvatarFile } from '../lib/avatar-resize';

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
  const [phone, setPhone] = useState(initial.phone ?? '');
  // Avatar state:
  //   - undefined = tidak diubah dari initial
  //   - null = user mau hapus avatar (kirim null ke API)
  //   - string = data URL hasil resize (kirim ke API)
  const [avatarChange, setAvatarChange] = useState<string | null | undefined>(undefined);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when dialog re-opens with fresh initial
  useEffect(() => {
    if (open) {
      setFullName(initial.fullName ?? '');
      setTitle(initial.title ?? '');
      setBio(initial.bio ?? '');
      setColor(initial.color ?? COLOR_PALETTE[0]);
      setPhone(initial.phone ?? '');
      setAvatarChange(undefined);
      setAvatarError(null);
      setAvatarBusy(false);
    }
  }, [open, initial]);

  if (!open) return null;

  // Resolve displayed avatar:
  //   - kalau user baru pilih file → preview data URL baru
  //   - kalau user hapus → null (fallback ke colored initial)
  //   - kalau belum diubah → pakai initial.avatarUrl (kalau ada)
  const displayedAvatar =
    avatarChange !== undefined ? avatarChange : initial.avatarUrl;
  const userInitial =
    (initial.fullName?.trim().charAt(0) ?? initial.email.charAt(0)).toUpperCase();

  async function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // reset supaya bisa re-pick file yang sama
    if (!file) return;

    // Browser-level size limit sebelum resize (cegah upload file 20MB+)
    const MAX_INPUT_BYTES = 8 * 1024 * 1024; // 8MB raw input
    if (file.size > MAX_INPUT_BYTES) {
      setAvatarError(
        `File terlalu besar (${Math.round(file.size / 1024 / 1024)}MB). Maksimal 8MB sebelum resize.`,
      );
      return;
    }

    setAvatarError(null);
    setAvatarBusy(true);
    try {
      const { dataUrl } = await resizeAvatarFile(file);
      setAvatarChange(dataUrl);
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : String(err));
    } finally {
      setAvatarBusy(false);
    }
  }

  function handleRemoveAvatar() {
    setAvatarChange(null);
    setAvatarError(null);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      fullName: fullName.trim() || undefined,
      title: title.trim() || undefined,
      bio: bio.trim() || undefined,
      color: color || undefined,
      phone: phone.trim(),
      // Kirim hanya kalau user benar-benar ubah (undefined = skip)
      avatarUrl: avatarChange,
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
            className="btn btn-ghost btn-icon btn-sm"
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

          {/* Avatar picker */}
          <div>
            <label className="caption mb-2 block">Foto profil</label>
            <div className="flex items-center gap-4">
              <div
                className="relative rounded-full overflow-hidden shrink-0"
                style={{
                  width: 80,
                  height: 80,
                  background: color || 'var(--sage-500)',
                  border: '2px solid var(--border)',
                }}
              >
                {displayedAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={displayedAvatar}
                    alt="Foto profil"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '100%',
                      height: '100%',
                      color: '#fff',
                      fontFamily: 'var(--font-serif)',
                      fontSize: 32,
                      fontWeight: 600,
                    }}
                  >
                    {userInitial}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2" style={{ flex: 1 }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFilePick}
                    style={{ display: 'none' }}
                    aria-label="Pilih foto profil"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarBusy || submitting}
                    className="btn btn-outline btn-sm"
                  >
                    {avatarBusy ? (
                      <>
                        <Camera size={14} /> Memproses…
                      </>
                    ) : displayedAvatar ? (
                      <>
                        <Upload size={14} /> Ganti foto
                      </>
                    ) : (
                      <>
                        <Upload size={14} /> Upload foto
                      </>
                    )}
                  </button>
                  {displayedAvatar && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      disabled={avatarBusy || submitting}
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--danger, #b54141)' }}
                    >
                      <Trash2 size={14} /> Hapus
                    </button>
                  )}
                </div>
                <span className="caption" style={{ fontSize: 11 }}>
                  JPG/PNG/WEBP, otomatis di-crop kotak & resize ke 256px. Maks 8MB.
                </span>
                {avatarError && (
                  <span
                    className="caption"
                    style={{
                      fontSize: 11,
                      color: 'var(--danger, #b54141)',
                    }}
                  >
                    ⚠ {avatarError}
                  </span>
                )}
              </div>
            </div>
          </div>

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
            <label className="caption mb-1 block">No. HP / WA *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              maxLength={20}
              className="input-althea"
              placeholder="628xxxxxxxxxx"
            />
            <p className="caption" style={{ fontSize: 11, marginTop: 4 }}>
              Format internasional (62xxx). Dipakai untuk notifikasi WhatsApp.
            </p>
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
              disabled={submitting || !fullName.trim() || !phone.trim()}
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
