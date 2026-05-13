'use client';

import { useMemo, useState } from 'react';
import { MoreHorizontal, Pencil, Plus, PowerOff, Search, Settings, Trash2, X } from 'lucide-react';
import {
  useCreateService,
  useDeactivateService,
  useDeleteService,
  useServiceList,
  useUpdateService,
} from '../hooks/use-service';
import {
  SERVICE_CATEGORIES,
  SERVICE_CATEGORY_LABEL,
  SERVICE_GROUPS,
  SERVICE_GROUP_INFO,
  serviceGroupOf,
  type CreateServiceInput,
  type Service,
  type ServiceGroup,
} from '../model/types';

const EMPTY: CreateServiceInput = {
  name: '',
  category: 'konseling',
  sessionCount: 1,
  durationMinutes: 60,
  basePrice: 500000,
  description: '',
  isActive: true,
};

function formatRp(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function sessionLabel(s: Service): string {
  if (s.sessionCount === 1) return 'sesi tunggal';
  return `paket ${s.sessionCount} sesi`;
}

export function LayananPage() {
  const [editing, setEditing] = useState<Service | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateServiceInput>(EMPTY);
  const [search, setSearch] = useState('');

  const list = useServiceList({ limit: 200 });
  const createMut = useCreateService();
  const updateMut = useUpdateService();
  const deleteMut = useDeleteService();
  const deactivateMut = useDeactivateService();

  const items = list.data?.data ?? [];

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((s) =>
      [s.name, s.description ?? '', SERVICE_CATEGORY_LABEL[s.category]]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [items, search]);

  const groupBuckets = useMemo(() => {
    const map = new Map<ServiceGroup, Service[]>();
    for (const g of SERVICE_GROUPS) map.set(g, []);
    for (const s of visible) {
      const g = serviceGroupOf(s);
      map.get(g)!.push(s);
    }
    return map;
  }, [visible]);

  const groupBookedTotals = useMemo(() => {
    const out: Record<ServiceGroup, number> = { konseling: 0, terapi: 0, anak: 0, tes: 0 };
    for (const [g, list] of groupBuckets.entries()) {
      out[g] = list.reduce((acc, s) => acc + (s.bookedThisMonth ?? 0), 0);
    }
    return out;
  }, [groupBuckets]);

  function openCreate(presetGroup?: ServiceGroup) {
    setEditing(null);
    let preset: CreateServiceInput['category'] = 'konseling';
    if (presetGroup === 'terapi') preset = 'terapi';
    else if (presetGroup === 'tes') preset = 'tes';
    else if (presetGroup === 'anak') preset = 'terapi'; // anak biasanya terapi atau konseling
    setForm({ ...EMPTY, category: preset });
    setOpen(true);
  }
  function openEdit(s: Service) {
    setEditing(s);
    setForm({
      name: s.name,
      category: s.category,
      sessionCount: s.sessionCount,
      durationMinutes: s.durationMinutes,
      basePrice: s.basePrice,
      description: s.description ?? '',
      isActive: s.isActive,
    });
    setOpen(true);
  }
  function close() { setOpen(false); setEditing(null); }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) updateMut.mutate({ id: editing.id, input: form }, { onSuccess: close });
    else createMut.mutate(form, { onSuccess: close });
  }
  function handleDelete(s: Service) {
    if (!confirm(`Hapus layanan "${s.name}"?`)) return;
    deleteMut.mutate(s.id);
  }
  function handleDeactivate(s: Service) {
    if (!confirm(`Nonaktifkan layanan "${s.name}"? Layanan tidak akan muncul di booking baru.`)) return;
    deactivateMut.mutate(s.id);
  }

  const submitting = createMut.isPending || updateMut.isPending;

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-7">
      {/* Top toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative w-[280px] max-w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-muted" />
          <input
            type="search"
            placeholder="Cari layanan…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-althea pl-8 h-9 py-0 text-[13px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="btn btn-outline btn-sm" disabled title="Coming soon">
            <Settings className="h-3.5 w-3.5" /> Kelola Kategori
          </button>
          <button type="button" onClick={() => openCreate()} className="btn btn-primary btn-sm">
            <Plus className="h-3.5 w-3.5" /> Layanan Baru
          </button>
        </div>
      </div>

      {/* KPI cards per group */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {SERVICE_GROUPS.map((g) => {
          const info = SERVICE_GROUP_INFO[g];
          const bucket = groupBuckets.get(g) ?? [];
          const totalBooked = groupBookedTotals[g];
          return (
            <div key={g} className="card-althea p-3.5 bg-card flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="caption">{info.label}</span>
                <span style={{ width: 8, height: 8, background: info.color, borderRadius: 2 }} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif font-medium text-teal-800" style={{ fontSize: 26 }}>
                  {bucket.length}
                </span>
                <span className="caption">{totalBooked} booking bulan ini</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grouped sections */}
      <div className="flex flex-col gap-5">
        {SERVICE_GROUPS.map((g) => {
          const info = SERVICE_GROUP_INFO[g];
          const bucket = groupBuckets.get(g) ?? [];
          if (bucket.length === 0 && search.trim()) return null;
          const maxBooked = Math.max(1, ...bucket.map((s) => s.bookedThisMonth ?? 0));
          return (
            <div key={g} className="card-althea overflow-hidden bg-card">
              <div
                className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border"
                style={{ borderLeft: `3px solid ${info.color}` }}
              >
                <div>
                  <h2 className="h2 m-0">{info.label}</h2>
                  <span className="caption mt-0.5 block">
                    {info.desc} · {bucket.length} layanan
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => openCreate(g)}
                  className="btn btn-ghost btn-sm"
                >
                  Tambah ke {info.label.toLowerCase()} <Plus className="h-3 w-3 ml-1" />
                </button>
              </div>

              {bucket.length === 0 ? (
                <div className="px-4 py-8 text-center text-fg-muted text-sm">
                  Belum ada layanan di grup ini.
                </div>
              ) : (
                <>
                  <div
                    className="grid items-center px-4 py-2 bg-cream-50 border-b border-border text-[11px] font-semibold text-fg-muted uppercase tracking-wider"
                    style={{ gridTemplateColumns: '2.5fr 1fr 1fr 1.3fr 1fr 80px' }}
                  >
                    <span>Layanan</span>
                    <span>Sesi</span>
                    <span>Durasi</span>
                    <span>Harga</span>
                    <span>Booking</span>
                    <span />
                  </div>
                  {bucket.map((s, i) => (
                    <div
                      key={s.id}
                      className={`grid items-center px-4 py-3 ${
                        i === bucket.length - 1 ? '' : 'border-b border-border'
                      } ${s.isActive ? '' : 'opacity-60'}`}
                      style={{ gridTemplateColumns: '2.5fr 1fr 1fr 1.3fr 1fr 80px' }}
                    >
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[13.5px] font-semibold text-teal-800 truncate"
                            title={s.description ?? undefined}
                          >
                            {s.name}
                          </span>
                          {!s.isActive && (
                            <span className="badge badge-neutral text-[10px] h-[18px]">nonaktif</span>
                          )}
                        </div>
                        <span className="caption">{sessionLabel(s)}</span>
                      </div>
                      <span className="text-[13px] text-fg tabular-nums">{s.sessionCount}</span>
                      <span className="text-[13px] text-fg">{s.durationMinutes} min</span>
                      <span className="text-[13px] font-semibold text-teal-800 tabular-nums">
                        {formatRp(s.basePrice)}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] text-fg tabular-nums w-6 text-right">
                          {s.bookedThisMonth ?? 0}
                        </span>
                        <div className="flex-1 h-1 bg-cream-200 rounded-full max-w-[50px] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, ((s.bookedThisMonth ?? 0) / maxBooked) * 100)}%`,
                              background: info.color,
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(s)}
                          className="btn btn-icon btn-ghost btn-sm"
                          aria-label="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        {s.hasBookings ? (
                          <button
                            type="button"
                            onClick={() => handleDeactivate(s)}
                            disabled={!s.isActive}
                            className="btn btn-icon btn-ghost btn-sm text-warning disabled:opacity-30 disabled:cursor-not-allowed"
                            title={s.isActive ? 'Ada booking terkait — klik untuk nonaktifkan' : 'Sudah nonaktif'}
                            aria-label="Nonaktifkan layanan"
                          >
                            <PowerOff className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDelete(s)}
                            className="btn btn-icon btn-ghost btn-sm text-danger"
                            aria-label="Hapus"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button type="button" className="btn btn-icon btn-ghost btn-sm" aria-label="Lainnya">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          );
        })}
      </div>

      {visible.length === 0 && !list.isLoading && (
        <div className="card-althea p-8 text-center text-fg-muted">
          {search.trim() ? `Tidak ada layanan cocok dengan "${search}".` : 'Belum ada layanan.'}
        </div>
      )}

      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className="card-althea w-full max-w-xl bg-card max-h-[92vh] overflow-y-auto">
            <div className="border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="h2">{editing ? 'Edit Layanan' : 'Layanan Baru'}</h2>
              <button type="button" onClick={close} className="btn btn-ghost btn-icon" aria-label="Tutup">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={submit} className="space-y-3 px-6 py-4">
              <div>
                <label className="caption mb-1 block">Nama *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-althea" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="caption mb-1 block">Kategori *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as CreateServiceInput['category'] })} className="input-althea">
                    {SERVICE_CATEGORIES.map((c) => <option key={c} value={c}>{SERVICE_CATEGORY_LABEL[c]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="caption mb-1 block">Jumlah Sesi *</label>
                  <input type="number" min={1} value={form.sessionCount} onChange={(e) => setForm({ ...form, sessionCount: Number(e.target.value) })} className="input-althea" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="caption mb-1 block">Durasi (menit) *</label>
                  <input type="number" min={15} value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} className="input-althea" />
                </div>
                <div>
                  <label className="caption mb-1 block">Harga Total (Rp) *</label>
                  <input type="number" min={0} value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })} className="input-althea" />
                </div>
              </div>
              <div>
                <label className="caption mb-1 block">Deskripsi</label>
                <textarea
                  value={form.description ?? ''}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  placeholder="Catatan opsional"
                  className="input-althea h-auto py-2"
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive ?? true} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4" />
                Aktif
              </label>
              <div className="flex justify-end gap-2 border-t border-border pt-3">
                <button type="button" onClick={close} className="btn btn-outline">Batal</button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Menyimpan...' : editing ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
