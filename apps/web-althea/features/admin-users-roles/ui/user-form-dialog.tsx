'use client';

/**
 * Modal form Tambah / Edit User. Saat editing, email + username terkunci
 * (read-only) — backend authoritative untuk identitas. Password optional.
 *
 * Roles: pilih multiple (button toggle, badge sage saat aktif).
 */
import {
  CLINIC_ROLES,
  ROLE_LABEL,
  type ClinicUser,
  type CreateUserInput,
} from '../model/types';

export function UserFormDialog({
  editing,
  form,
  submitting,
  onClose,
  onChangeForm,
  onToggleRole,
  onSubmit,
}: {
  editing: ClinicUser | null;
  form: CreateUserInput;
  submitting: boolean;
  onClose: () => void;
  onChangeForm: (next: CreateUserInput) => void;
  onToggleRole: (role: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card-althea w-full max-w-xl bg-card max-h-[90vh] overflow-y-auto">
        <div className="border-b border-border px-6 py-4">
          <h2 className="h2 m-0">
            {editing ? 'Edit User' : 'Undang user baru'}
          </h2>
        </div>
        <form onSubmit={onSubmit} className="space-y-3 px-6 py-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="caption mb-1 block">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  onChangeForm({ ...form, email: e.target.value })
                }
                disabled={!!editing}
                required
                className="input-althea"
              />
            </div>
            <div>
              <label className="caption mb-1 block">Nama Lengkap *</label>
              <input
                value={form.fullName}
                onChange={(e) =>
                  onChangeForm({ ...form, fullName: e.target.value })
                }
                required
                className="input-althea"
              />
            </div>
          </div>
          {!editing ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="caption mb-1 block">Username</label>
                <input
                  value={form.username ?? ''}
                  onChange={(e) =>
                    onChangeForm({ ...form, username: e.target.value })
                  }
                  placeholder="auto dari email"
                  className="input-althea"
                />
              </div>
              <div>
                <label className="caption mb-1 block">Password</label>
                <input
                  type="password"
                  value={form.password ?? ''}
                  onChange={(e) =>
                    onChangeForm({ ...form, password: e.target.value })
                  }
                  placeholder="default Test1234!"
                  className="input-althea"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="caption mb-1 block">
                Reset Password (kosong = tidak diubah)
              </label>
              <input
                type="password"
                value={form.password ?? ''}
                onChange={(e) =>
                  onChangeForm({ ...form, password: e.target.value })
                }
                className="input-althea"
              />
            </div>
          )}
          <div>
            <label className="caption mb-1 block">Roles * (minimal 1)</label>
            <div className="flex flex-wrap gap-2">
              {CLINIC_ROLES.map((r) => {
                const active = form.roles.includes(r);
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => onToggleRole(r)}
                    className={`badge cursor-pointer transition ${
                      active ? 'badge-sage' : 'badge-neutral'
                    }`}
                  >
                    {ROLE_LABEL[r]}
                  </button>
                );
              })}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive ?? true}
              onChange={(e) =>
                onChangeForm({ ...form, isActive: e.target.checked })
              }
              className="h-4 w-4"
            />
            Aktif
          </label>
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? 'Menyimpan...' : editing ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
