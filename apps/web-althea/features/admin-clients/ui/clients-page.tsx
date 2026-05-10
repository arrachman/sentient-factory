'use client';

import { useMemo, useState } from 'react';
import {
  BellOff,
  Calendar,
  MessageCircle,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import {
  useClientDetail,
  useClientList,
  useCreateClient,
  useDeleteClient,
  useUpdateClient,
} from '../hooks/use-client';
import {
  CATEGORY_LABEL,
  CATEGORY_PALETTE,
  CLIENT_CATEGORIES,
  GENDERS,
  GENDER_LABEL,
  STATUS_BADGE,
  STATUS_LABEL,
  type Client,
  type ClientCategory,
  type ClientStatus,
  type CreateClientInput,
} from '../model/types';
import { ClientAvatar } from './client-avatar';

const EMPTY: CreateClientInput = {
  name: '',
  gender: 'L',
  age: undefined,
  category: undefined,
  phoneWa: '+62',
  medicalRecordNumber: '',
  preferredServiceType: '',
  email: '',
  address: '',
  notes: '',
  waOptedOut: false,
};

type Filter = 'semua' | ClientStatus;

function formatNextSession(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const time = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  if (sameDay(d, today)) return `Hari ini · ${time}`;
  if (sameDay(d, tomorrow)) return `Besok · ${time}`;
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) + ` · ${time}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function ClientsPage() {
  const [filter, setFilter] = useState<Filter>('semua');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ClientCategory | ''>('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Client | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateClientInput>(EMPTY);

  const list = useClientList({
    search: search.trim() || undefined,
    status: filter === 'semua' ? undefined : filter,
    category: categoryFilter || undefined,
    limit: 200,
  });
  const detail = useClientDetail(selectedId);
  const createMut = useCreateClient();
  const updateMut = useUpdateClient();
  const deleteMut = useDeleteClient();

  const items = list.data?.data ?? [];
  const counts = useMemo(() => {
    const all = list.data?.data ?? [];
    return {
      semua: all.length,
      aktif: all.filter((c) => c.derivedStatus === 'aktif').length,
      baru: all.filter((c) => c.derivedStatus === 'baru').length,
      selesai: all.filter((c) => c.derivedStatus === 'selesai').length,
    };
  }, [list.data]);

  const filtered = items;
  const sel = detail.data?.data ?? null;
  const submitting = createMut.isPending || updateMut.isPending;

  function close() { setOpen(false); setEditing(null); }
  function openCreate() { setEditing(null); setForm(EMPTY); setOpen(true); }
  function openEdit(c: Client) {
    setEditing(c);
    setForm({
      name: c.name,
      gender: c.gender,
      age: c.age ?? undefined,
      category: c.category ?? undefined,
      phoneWa: c.phoneWa,
      medicalRecordNumber: c.medicalRecordNumber ?? '',
      preferredServiceType: c.preferredServiceType ?? '',
      email: c.email ?? '',
      address: c.address ?? '',
      notes: c.notes ?? '',
      waOptedOut: c.waOptedOut,
    });
    setOpen(true);
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) updateMut.mutate({ id: editing.id, input: form }, { onSuccess: close });
    else createMut.mutate(form, { onSuccess: close });
  }
  function handleDelete(c: Client) {
    if (!confirm(`Hapus klien "${c.name}"?`)) return;
    deleteMut.mutate(c.id, { onSuccess: () => { if (selectedId === c.id) setSelectedId(null); } });
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col p-4 lg:p-8">
      <div className="flex items-baseline justify-between border-b border-border pb-3">
        <div>
          <h1 className="h1">Daftar Klien</h1>
          <p className="caption mt-1">Kelola pasien klinik — intake form, riwayat sesi, & jadwalkan booking baru.</p>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* List + filters */}
        <div className="flex-1 min-w-0 px-2 pt-4 pb-2 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="inline-flex gap-1 bg-cream-100 rounded-lg p-[3px]">
              {(['semua', 'aktif', 'baru', 'selesai'] as Filter[]).map((f) => {
                const active = filter === f;
                const label = f === 'semua' ? 'Semua' : STATUS_LABEL[f];
                const count = counts[f];
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`px-3 h-[30px] rounded-md text-sm font-medium transition-colors ${
                      active
                        ? 'bg-card text-teal-800 shadow-sm'
                        : 'text-fg-muted hover:text-teal-800'
                    }`}
                  >
                    {label} <span className="ml-1 text-[11px] opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
                <input
                  type="search"
                  placeholder="Cari nama, WA, MRN..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-althea pl-9 w-[260px] h-9 py-0"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as ClientCategory | '')}
                className="input-althea h-9 py-0 max-w-[150px]"
                aria-label="Filter kategori"
              >
                <option value="">Semua kategori</option>
                {CLIENT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
                ))}
              </select>
              <button type="button" onClick={openCreate} className="btn btn-primary">
                <Plus className="h-4 w-4" /> Klien Baru
              </button>
            </div>
          </div>

          <div className="card-althea overflow-hidden flex-1 min-h-0 flex flex-col bg-card">
            <div className="grid items-center px-4 py-2 bg-cream-50 border-b border-border text-[11px] font-semibold text-fg-muted uppercase tracking-wider"
              style={{ gridTemplateColumns: '2fr 1.5fr 1.3fr 1.4fr 1.4fr 90px' }}>
              <span>Nama</span>
              <span>Layanan aktif</span>
              <span>Psikolog</span>
              <span>Sesi terakhir</span>
              <span>Sesi berikutnya</span>
              <span>Status</span>
            </div>
            <div className="overflow-y-auto flex-1">
              {list.isLoading && (
                <div className="px-4 py-8 text-center text-fg-muted">Memuat klien...</div>
              )}
              {!list.isLoading && filtered.length === 0 && (
                <div className="px-4 py-12 text-center text-fg-muted">Belum ada klien sesuai filter.</div>
              )}
              {filtered.map((c) => {
                const isSel = selectedId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={`grid items-center w-full text-left px-4 py-3 border-b border-border transition-colors ${
                      isSel ? 'bg-sage-50 border-l-[3px] border-l-sage-500 pl-[13px]' : 'border-l-[3px] border-l-transparent hover:bg-cream-50'
                    }`}
                    style={{ gridTemplateColumns: '2fr 1.5fr 1.3fr 1.4fr 1.4fr 90px' }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ClientAvatar name={c.name} category={c.category ?? undefined} size="md" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13.5px] font-semibold text-teal-800 truncate">{c.name}</span>
                        <span className="text-[11.5px] text-fg-muted flex items-center gap-1.5">
                          {c.age ? <span>{c.age} thn</span> : null}
                          {c.category && (
                            <span
                              className="px-1.5 py-[1px] rounded text-[10.5px] font-medium"
                              style={{
                                background: CATEGORY_PALETTE[c.category].bg,
                                color: CATEGORY_PALETTE[c.category].fg,
                              }}
                            >
                              {CATEGORY_LABEL[c.category]}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                    <span className="text-[12.5px] text-fg truncate">
                      {c.currentService?.name ?? '—'}
                      {c.currentService && c.currentService.sessionTotal > 1 && (
                        <span className="text-fg-muted"> · {c.currentService.sessionN}/{c.currentService.sessionTotal}</span>
                      )}
                    </span>
                    <span className="text-[12.5px] text-fg truncate">
                      {c.currentService?.psikologName ?? '—'}
                    </span>
                    <span className="text-[12.5px] text-fg-muted">
                      {c.lastSession ? formatDate(c.lastSession.date) : '—'}
                    </span>
                    <span
                      className={`text-[12.5px] ${
                        c.nextSession ? 'text-teal-800 font-medium' : 'text-fg-muted'
                      }`}
                    >
                      {c.nextSession ? formatNextSession(c.nextSession.date) : '—'}
                    </span>
                    <span className={`badge ${STATUS_BADGE[c.derivedStatus]} capitalize text-[11px]`}>
                      {STATUS_LABEL[c.derivedStatus]}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="px-4 py-2.5 border-t border-border flex justify-between items-center">
              <span className="caption">
                Menampilkan {filtered.length} dari {list.data?.meta?.total ?? 0} klien
              </span>
            </div>
          </div>
        </div>

        {/* Detail panel */}
        {selectedId && (
          <aside className="w-[360px] border-l border-border bg-card flex flex-col flex-shrink-0">
            {detail.isLoading || !sel ? (
              <div className="p-6 text-center text-fg-muted">Memuat detail klien...</div>
            ) : (
              <>
                <div className="p-5 border-b border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10.5px] uppercase tracking-wider font-semibold text-fg-muted">Detail klien</span>
                    <button
                      type="button"
                      onClick={() => setSelectedId(null)}
                      className="btn btn-ghost btn-icon h-7 w-7"
                      aria-label="Tutup"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <ClientAvatar name={sel.name} category={sel.category ?? undefined} size="lg" />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-base font-semibold text-teal-800 font-serif truncate">{sel.name}</span>
                      <span className="caption">
                        {sel.age ? `${sel.age} tahun` : ''}
                        {sel.age && sel.category ? ' · ' : ''}
                        {sel.category ? <span className="capitalize">{CATEGORY_LABEL[sel.category]}</span> : null}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`/admin/booking?clientId=${sel.id}`}
                      className="btn btn-primary btn-sm flex-1"
                    >
                      <Calendar className="h-4 w-4" /> Jadwalkan
                    </a>
                    <a
                      href={`https://wa.me/${sel.phoneWa.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline btn-sm btn-icon"
                      aria-label="WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => openEdit(sel)}
                      className="btn btn-outline btn-sm btn-icon"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(sel)}
                      className="btn btn-outline btn-sm btn-icon text-danger"
                      aria-label="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
                  <section className="flex flex-col gap-2">
                    <span className="text-[10.5px] uppercase tracking-wider font-semibold text-fg-muted">Kontak</span>
                    <div className="flex items-center gap-2 text-sm">
                      <MessageCircle className="h-4 w-4 text-success" />
                      <span className="font-mono text-[13px]">{sel.phoneWa}</span>
                    </div>
                    {sel.email && (
                      <div className="text-sm text-fg-muted truncate">{sel.email}</div>
                    )}
                    {sel.medicalRecordNumber && (
                      <div className="text-xs text-fg-muted">MRN: <span className="font-mono">{sel.medicalRecordNumber}</span></div>
                    )}
                  </section>

                  {sel.currentService && (
                    <section className="flex flex-col gap-2">
                      <span className="text-[10.5px] uppercase tracking-wider font-semibold text-fg-muted">Layanan saat ini</span>
                      <div className="rounded-lg p-3 bg-cream-50 border border-border">
                        <div className="text-[13.5px] font-semibold text-teal-800">{sel.currentService.name}</div>
                        {sel.currentService.psikologName && (
                          <div className="caption mt-0.5">Psikolog: {sel.currentService.psikologName}</div>
                        )}
                        {sel.currentService.sessionTotal > 1 && (
                          <div className="mt-2.5">
                            <div className="flex justify-between mb-1">
                              <span className="caption">Progres</span>
                              <span className="caption font-semibold text-teal-800">
                                sesi {sel.currentService.sessionN}/{sel.currentService.sessionTotal}
                              </span>
                            </div>
                            <div className="h-1 bg-cream-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-sage-500 rounded-full transition-all"
                                style={{
                                  width: `${(sel.currentService.sessionN / sel.currentService.sessionTotal) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                  {sel.nextSession && (
                    <section className="flex flex-col gap-2">
                      <span className="text-[10.5px] uppercase tracking-wider font-semibold text-fg-muted">Sesi berikutnya</span>
                      <div className="rounded-lg p-3 bg-sage-50 border border-sage-200">
                        <div className="text-[13.5px] font-semibold text-teal-800">
                          {formatNextSession(sel.nextSession.date)}
                        </div>
                        <div className="caption mt-0.5">
                          {sel.nextSession.serviceName ?? '—'}
                          {sel.nextSession.psikologName ? ` · ${sel.nextSession.psikologName}` : ''}
                        </div>
                      </div>
                    </section>
                  )}

                  <section className="flex flex-col gap-2">
                    <span className="text-[10.5px] uppercase tracking-wider font-semibold text-fg-muted">
                      Riwayat sesi ({sel.recentSessions.length})
                    </span>
                    {sel.recentSessions.length === 0 ? (
                      <p className="caption italic text-fg-muted">Belum ada riwayat sesi selesai.</p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {sel.recentSessions.map((s) => (
                          <div key={s.id} className="rounded-md p-2.5 bg-cream-50 border border-border">
                            <div className="flex justify-between items-center">
                              <span className="text-[12.5px] font-semibold text-teal-800">{formatDate(s.date)}</span>
                              <span className="badge badge-success text-[10px] h-[18px]">{s.status}</span>
                            </div>
                            <span className="caption mt-0.5 block truncate">
                              {s.serviceName ?? '—'}
                              {s.psikologName ? ` · ${s.psikologName}` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {sel.notes && (
                    <section className="flex flex-col gap-2">
                      <span className="text-[10.5px] uppercase tracking-wider font-semibold text-fg-muted">Catatan internal</span>
                      <p className="text-sm text-fg-muted px-3 py-2.5 bg-cream-50 rounded-lg leading-relaxed whitespace-pre-wrap">
                        {sel.notes}
                      </p>
                    </section>
                  )}

                  {sel.waOptedOut && (
                    <div className="rounded-md p-2.5 bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                      <BellOff className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">Notifikasi WhatsApp dimatikan</div>
                        <div className="mt-0.5">Klien minta tidak menerima WA — hubungi manual untuk reminder & konfirmasi.</div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </aside>
        )}
      </div>

      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className="card-althea w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-card">
            <div className="border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="h2">{editing ? 'Edit Klien' : 'Tambah Klien'}</h2>
              <button type="button" onClick={close} className="btn btn-ghost btn-icon" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={submit} className="space-y-3 px-6 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="caption mb-1 block">Nama *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-althea" />
                </div>
                <div>
                  <label className="caption mb-1 block">WhatsApp *</label>
                  <input value={form.phoneWa} onChange={(e) => setForm({ ...form, phoneWa: e.target.value })} required placeholder="+6281234567890" className="input-althea" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="caption mb-1 block">Gender *</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as 'L' | 'P' })} className="input-althea">
                    {GENDERS.map((g) => <option key={g} value={g}>{GENDER_LABEL[g]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="caption mb-1 block">Umur</label>
                  <input type="number" min={0} max={120} value={form.age ?? ''} onChange={(e) => setForm({ ...form, age: e.target.value ? Number(e.target.value) : undefined })} className="input-althea" />
                </div>
                <div>
                  <label className="caption mb-1 block">Kategori</label>
                  <select
                    value={form.category ?? ''}
                    onChange={(e) => setForm({ ...form, category: (e.target.value || undefined) as ClientCategory | undefined })}
                    className="input-althea"
                  >
                    <option value="">Auto (dari umur)</option>
                    {CLIENT_CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="caption mb-1 block">MRN</label>
                  <input value={form.medicalRecordNumber ?? ''} onChange={(e) => setForm({ ...form, medicalRecordNumber: e.target.value })} placeholder="MR-..." className="input-althea" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="caption mb-1 block">Email</label>
                  <input type="email" value={form.email ?? ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-althea" />
                </div>
                <div>
                  <label className="caption mb-1 block">Layanan diminati</label>
                  <input value={form.preferredServiceType ?? ''} onChange={(e) => setForm({ ...form, preferredServiceType: e.target.value })} placeholder="konseling / terapi / tes" className="input-althea" />
                </div>
              </div>
              <div>
                <label className="caption mb-1 block">Alamat</label>
                <input value={form.address ?? ''} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-althea" />
              </div>
              <div>
                <label className="caption mb-1 block">Catatan</label>
                <textarea value={form.notes ?? ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="input-althea h-auto py-2" />
              </div>
              <div className="rounded-md border border-border p-3 bg-cream-50">
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.waOptedOut ?? false}
                    onChange={(e) => setForm({ ...form, waOptedOut: e.target.checked })}
                    className="h-4 w-4 mt-0.5 flex-shrink-0"
                  />
                  <span className="flex flex-col gap-1">
                    <span className="font-medium text-teal-800">
                      Jangan kirim notifikasi WhatsApp ke klien ini
                    </span>
                    <span className="caption">
                      Centang kalau klien minta tidak menerima WA dari klinik (mis. alasan privasi).
                      Sistem akan skip semua reminder, konfirmasi booking, dan kiriman struk via WA —
                      admin perlu hubungi manual lewat telpon/email.
                    </span>
                  </span>
                </label>
              </div>
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
