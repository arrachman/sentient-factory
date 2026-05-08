'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { SPECIALTY_LABEL } from '../model/types';
import type { Psikolog } from '../model/types';

type Props = {
  data: Psikolog[];
  loading?: boolean;
  onEdit: (p: Psikolog) => void;
  onDelete: (p: Psikolog) => void;
};

export function PsikologList({ data, loading, onEdit, onDelete }: Props) {
  if (loading) {
    return (
      <div className="card-althea p-8 text-center text-fg-muted">
        Memuat data...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card-althea p-8 text-center text-fg-muted">
        Belum ada psikolog. Klik <strong>Tambah</strong> untuk menambahkan.
      </div>
    );
  }

  return (
    <div className="card-althea overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-cream-100 border-b border-border">
          <tr>
            <th className="px-4 py-3 font-medium text-teal-800">Nama</th>
            <th className="px-4 py-3 font-medium text-teal-800">Title</th>
            <th className="px-4 py-3 font-medium text-teal-800">Spesialisasi</th>
            <th className="px-4 py-3 font-medium text-teal-800">License</th>
            <th className="px-4 py-3 font-medium text-teal-800">Status</th>
            <th className="px-4 py-3 font-medium text-teal-800 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr
              key={p.id}
              className="border-b border-border last:border-b-0 hover:bg-cream-50"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div
                    className="avatar avatar-md"
                    style={p.color ? { backgroundColor: p.color, color: '#fff' } : undefined}
                  >
                    {(p.fullName || p.email).slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-teal-800">{p.fullName || '—'}</div>
                    <div className="text-xs text-fg-muted">{p.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-fg">{p.title || '—'}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {p.specialty.length === 0 ? (
                    <span className="text-fg-muted">—</span>
                  ) : (
                    p.specialty.map((s) => (
                      <span key={s} className="badge badge-sage">
                        {SPECIALTY_LABEL[s] || s}
                      </span>
                    ))
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-fg">{p.license || '—'}</td>
              <td className="px-4 py-3">
                {p.isActive ? (
                  <span className="badge badge-success">Aktif</span>
                ) : (
                  <span className="badge badge-neutral">Nonaktif</span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(p)}
                    className="btn btn-ghost btn-icon"
                    title="Edit"
                    aria-label="Edit psikolog"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(p)}
                    className="btn btn-ghost btn-icon text-danger"
                    title="Hapus"
                    aria-label="Hapus psikolog"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
