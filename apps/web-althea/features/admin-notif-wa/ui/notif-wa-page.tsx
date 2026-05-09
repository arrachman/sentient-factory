'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Eye,
  MessageCircle,
  Plus,
  Save,
  Send,
  Settings,
  Trash2,
} from 'lucide-react';
import {
  useCreateTemplate,
  useDeleteTemplate,
  useLogList,
  useSendTest,
  useTemplateList,
  useUpdateTemplate,
} from '../hooks/use-wa';
import {
  CATEGORY_LABEL,
  WA_CATEGORIES,
  type CreateTemplateInput,
  type Template,
  type WaCategory,
} from '../model/types';

// =====================================================================
// Constants — match mockup AdminNotifWA.jsx
// =====================================================================

const CATEGORY_HINT: Record<WaCategory, string> = {
  pengingat: 'Cron-scheduled berdasarkan booking',
  jadwal: 'Dipicu oleh aksi admin',
  onboarding: 'Pendaftaran klien & staff',
  bayar: 'DP, pelunasan, bukti bayar',
};

const RECIPIENT_STYLE: Record<string, { bg: string; fg: string; label: string }> = {
  klien: { bg: 'var(--sage-100)', fg: 'var(--sage-800)', label: 'klien' },
  psikolog: { bg: '#dde8f1', fg: '#3b5b75', label: 'psikolog' },
  staff: { bg: 'var(--cream-200)', fg: '#6b5320', label: 'staff' },
  user: { bg: 'var(--info-soft)', fg: 'var(--info)', label: 'user' },
};

const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  dibaca: { bg: 'var(--success-soft)', fg: 'var(--success)' },
  sampai: { bg: 'var(--info-soft)', fg: 'var(--info)' },
  terkirim: { bg: 'var(--info-soft)', fg: 'var(--info)' },
  gagal: { bg: 'var(--danger-soft)', fg: 'var(--danger)' },
  queued: { bg: 'var(--warning-soft)', fg: '#8a4a00' },
};

const COMMON_VARIABLES = [
  '{{nama_klien}}',
  '{{tanggal}}',
  '{{waktu_sesi}}',
  '{{nama_psikolog}}',
  '{{nama_ruangan}}',
  '{{nama_layanan}}',
  '{{no_rekam_medis}}',
  '{{kode_otp}}',
  '{{jumlah_dp}}',
  '{{link_feedback}}',
  '{{alasan_reschedule}}',
];

const EMPTY_TEMPLATE: CreateTemplateInput = {
  name: '',
  category: 'pengingat',
  triggerEvent: '',
  body: '',
  recipients: ['klien'],
  isActive: true,
};

// =====================================================================
// Helpers
// =====================================================================

function formatTime(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getRecipStyle(r: string) {
  return (
    RECIPIENT_STYLE[r] || {
      bg: 'var(--cream-100)',
      fg: 'var(--fg-muted)',
      label: r,
    }
  );
}

function getStatusStyle(s: string) {
  return STATUS_STYLE[s] || { bg: 'var(--cream-100)', fg: 'var(--fg-muted)' };
}

// =====================================================================
// Page
// =====================================================================

export function NotifWaPage() {
  const tplList = useTemplateList({ limit: 200 });
  const logList = useLogList({ limit: 50 });
  const updateMut = useUpdateTemplate();
  const deleteMut = useDeleteTemplate();
  const createMut = useCreateTemplate();
  const sendTestMut = useSendTest();

  const templates = useMemo(() => tplList.data?.data ?? [], [tplList.data]);
  const logs = logList.data?.data ?? [];

  // Editor state
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [draft, setDraft] = useState<CreateTemplateInput>(EMPTY_TEMPLATE);
  const [creating, setCreating] = useState(false);
  const [testOpen, setTestOpen] = useState(false);

  // Pre-select first template on load
  useEffect(() => {
    if (selectedId === null && templates.length > 0) {
      const first = templates[0];
      setSelectedId(first.id);
      setDraft({
        name: first.name,
        category: first.category,
        triggerEvent: first.triggerEvent ?? '',
        body: first.body,
        recipients: first.recipients,
        isActive: first.isActive,
      });
    }
  }, [templates, selectedId]);

  function selectTemplate(t: Template) {
    setCreating(false);
    setSelectedId(t.id);
    setDraft({
      name: t.name,
      category: t.category,
      triggerEvent: t.triggerEvent ?? '',
      body: t.body,
      recipients: t.recipients,
      isActive: t.isActive,
    });
  }

  function startCreate() {
    setCreating(true);
    setSelectedId(null);
    setDraft(EMPTY_TEMPLATE);
  }

  function toggleRecipient(r: string) {
    if (draft.recipients.includes(r)) {
      setDraft({ ...draft, recipients: draft.recipients.filter((x) => x !== r) });
    } else {
      setDraft({ ...draft, recipients: [...draft.recipients, r] });
    }
  }

  function toggleActive(t: Template) {
    updateMut.mutate({ id: t.id, input: { isActive: !t.isActive } });
  }

  function save() {
    if (creating) {
      createMut.mutate(draft, {
        onSuccess: (res) => {
          setCreating(false);
          setSelectedId(res.data.id);
        },
      });
    } else if (selectedId !== null) {
      updateMut.mutate({ id: selectedId, input: draft });
    }
  }

  function handleDelete() {
    if (selectedId === null) return;
    const t = templates.find((x) => x.id === selectedId);
    if (!t || !confirm(`Hapus template "${t.name}"?`)) return;
    deleteMut.mutate(selectedId, {
      onSuccess: () => {
        setSelectedId(null);
        setDraft(EMPTY_TEMPLATE);
      },
    });
  }

  function insertVariable(v: string) {
    setDraft({ ...draft, body: draft.body + v });
  }

  // Stats
  const totalTemplates = templates.length;
  const activeTemplates = templates.filter((t) => t.isActive).length;
  const sentToday = logs.filter((l) => {
    const created = new Date(l.createdAt);
    const today = new Date();
    return (
      created.getFullYear() === today.getFullYear() &&
      created.getMonth() === today.getMonth() &&
      created.getDate() === today.getDate()
    );
  });
  const sentTodayCount = sentToday.length;
  const readToday = sentToday.filter((l) => l.status === 'dibaca').length;
  const readRate =
    sentTodayCount > 0 ? Math.round((readToday / sentTodayCount) * 100) : 0;
  const failedToday = sentToday.filter((l) => l.status === 'gagal').length;

  // Body preview vars detection (untuk send test dialog)
  const bodyVars = useMemo(() => {
    if (!selectedId) return [];
    const tpl = templates.find((t) => t.id === selectedId);
    if (!tpl) return [];
    const matches = tpl.body.match(/\{\{(\w+)\}\}/g) ?? [];
    return [...new Set(matches.map((m) => m.slice(2, -2)))];
  }, [selectedId, templates]);

  return (
    <div className="space-y-4 p-4 lg:p-8">
      {/* ===== Header ===== */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="h1">Notifikasi WhatsApp</h1>
          <p className="caption mt-1">
            Template + log delivery. Provider: Fonnte (atau Mock kalau belum
            konfigurasi token).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ConnectionStatus />
          <button type="button" className="btn btn-outline btn-sm" disabled>
            <Settings className="h-3.5 w-3.5" />
            Pengaturan WA
          </button>
          <button
            type="button"
            onClick={startCreate}
            className="btn btn-primary btn-sm"
          >
            <Plus className="h-4 w-4" />
            Template Baru
          </button>
        </div>
      </div>

      {/* ===== Stats ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Terkirim hari ini" value={String(sentTodayCount)} sub="Auto refresh tiap 5s" />
        <StatCard label="Tingkat baca" value={`${readRate}%`} sub={`${readToday}/${sentTodayCount} hari ini`} />
        <StatCard label="Gagal kirim" value={String(failedToday)} sub={failedToday === 0 ? 'tidak ada gagal' : 'cek log untuk detail'} />
        <StatCard label="Template aktif" value={`${activeTemplates}/${totalTemplates}`} sub={`${totalTemplates - activeTemplates} dijeda`} />
      </div>

      {/* ===== 3-column grid ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr_380px] gap-4 min-h-[640px]">
        {/* LEFT: Template list grouped by category */}
        <div className="card-althea overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="h2">Template ({totalTemplates})</h2>
            <span className="caption">sinkron Pengaturan</span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[700px]">
            {tplList.isLoading ? (
              <div className="p-8 text-center text-fg-muted">Memuat...</div>
            ) : (
              WA_CATEGORIES.map((cat, ci) => {
                const items = templates.filter((t) => t.category === cat);
                if (items.length === 0) return null;
                return (
                  <div key={cat}>
                    <div
                      className={`px-4 py-2 bg-cream-50 ${ci > 0 ? 'border-t border-border' : ''} border-b border-border`}
                    >
                      <div className="text-xs font-semibold uppercase tracking-wide text-teal-800">
                        {CATEGORY_LABEL[cat]}
                      </div>
                      <div className="caption">{CATEGORY_HINT[cat]}</div>
                    </div>
                    {items.map((t) => {
                      const isSel = t.id === selectedId && !creating;
                      return (
                        <div
                          key={t.id}
                          onClick={() => selectTemplate(t)}
                          className={`px-4 py-2.5 border-b border-border cursor-pointer transition ${
                            isSel
                              ? 'bg-sage-50 border-l-[3px] border-l-sage-500 pl-[13px]'
                              : 'hover:bg-cream-50 border-l-[3px] border-l-transparent pl-[13px]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-teal-800 truncate">
                                {t.name}
                              </div>
                              {t.triggerEvent && (
                                <div className="caption text-xs mt-0.5 truncate">
                                  {t.triggerEvent}
                                </div>
                              )}
                            </div>

                            {/* Toggle active */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleActive(t);
                              }}
                              aria-label={t.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                              className="flex-shrink-0 mt-1"
                            >
                              <span
                                className={`block w-6 h-3.5 rounded-full relative transition ${
                                  t.isActive
                                    ? 'bg-sage-500'
                                    : 'bg-cream-200'
                                }`}
                              >
                                <span
                                  className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-all ${
                                    t.isActive ? 'left-3' : 'left-0.5'
                                  }`}
                                />
                              </span>
                            </button>
                          </div>

                          {/* Recipient badges */}
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {t.recipients.map((r) => {
                              const rs = getRecipStyle(r);
                              return (
                                <span
                                  key={r}
                                  className="inline-flex items-center px-1.5 h-4 rounded-full text-[10px] font-medium"
                                  style={{ background: rs.bg, color: rs.fg }}
                                >
                                  {rs.label}
                                </span>
                              );
                            })}
                            {!t.isActive && (
                              <span className="badge badge-warn text-[10px] h-4 px-1.5">
                                dijeda
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
            {templates.length === 0 && !tplList.isLoading && (
              <div className="p-8 text-center text-fg-muted">
                Belum ada template. Klik <strong>Template Baru</strong> di atas.
              </div>
            )}
          </div>
        </div>

        {/* CENTER: Activity log */}
        <div className="card-althea overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="h2">Aktivitas Hari Ini</h2>
            <span className="caption">{sentTodayCount} kirim · auto refresh</span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[700px]">
            {logList.isLoading ? (
              <div className="p-8 text-center text-fg-muted">Memuat...</div>
            ) : logs.length === 0 ? (
              <div className="p-8 text-center text-fg-muted">
                Belum ada log pengiriman hari ini.
              </div>
            ) : (
              logs.map((l) => {
                const ss = getStatusStyle(l.status);
                return (
                  <div
                    key={l.id}
                    className="flex items-start gap-3 px-4 py-3 border-b border-border last:border-b-0"
                  >
                    <span className="caption font-mono w-12 flex-shrink-0 pt-0.5 tabular-nums">
                      {formatTime(l.createdAt)}
                    </span>
                    <div
                      className="flex-shrink-0 rounded-full grid place-items-center"
                      style={{
                        width: 28,
                        height: 28,
                        background: 'var(--success-soft)',
                      }}
                    >
                      <MessageCircle
                        className="h-3.5 w-3.5"
                        style={{ color: 'var(--success)' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-teal-800">
                          {l.recipientType === 'klien' ? 'Klien' : l.recipientType === 'psikolog' ? 'Psikolog' : l.recipientType}
                        </span>
                        <span className="caption">
                          · {l.template?.name ?? '(template dihapus)'}
                        </span>
                      </div>
                      <div className="caption mt-0.5 font-mono text-xs">
                        {l.recipientPhone}
                        {l.errorReason && (
                          <span className="text-danger"> · {l.errorReason}</span>
                        )}
                      </div>
                    </div>
                    <span
                      className="badge flex-shrink-0 capitalize"
                      style={{ background: ss.bg, color: ss.fg }}
                    >
                      {l.status}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT: Template editor */}
        <div className="card-althea overflow-hidden flex flex-col">
          {!creating && selectedId === null ? (
            <div className="p-8 text-center text-fg-muted flex-1 flex items-center justify-center">
              Pilih template di kiri untuk edit, atau klik{' '}
              <strong className="ml-1">Template Baru</strong>.
            </div>
          ) : (
            <>
              <div className="border-b border-border px-4 py-3 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
                  {creating ? 'Template Baru' : `Edit · ID ${selectedId}`}
                </span>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="Nama template"
                  className="block w-full text-lg font-medium text-teal-800 bg-transparent border-0 outline-none focus:ring-0 px-0 brand-mark"
                  required
                />
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="caption mb-1 block">Kategori</label>
                    <select
                      value={draft.category}
                      onChange={(e) =>
                        setDraft({ ...draft, category: e.target.value as WaCategory })
                      }
                      className="input-althea"
                    >
                      {WA_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {CATEGORY_LABEL[c]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="caption mb-1 block">Trigger Event</label>
                    <input
                      value={draft.triggerEvent ?? ''}
                      onChange={(e) =>
                        setDraft({ ...draft, triggerEvent: e.target.value })
                      }
                      placeholder="confirmation"
                      className="input-althea"
                    />
                  </div>
                </div>

                <div>
                  <label className="caption mb-1 block">Penerima</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['klien', 'psikolog', 'staff', 'user'].map((r) => {
                      const rs = getRecipStyle(r);
                      const active = draft.recipients.includes(r);
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => toggleRecipient(r)}
                          className="badge cursor-pointer transition"
                          style={
                            active
                              ? { background: rs.bg, color: rs.fg }
                              : { background: 'var(--cream-100)', color: 'var(--fg-muted)' }
                          }
                        >
                          {rs.label}
                          {active && ' ✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="caption mb-1 block">Pesan</label>
                  <textarea
                    value={draft.body}
                    onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                    rows={9}
                    className="input-althea h-auto py-2 font-mono text-xs leading-relaxed"
                    placeholder="Halo {{nama_klien}}, ..."
                    required
                  />
                </div>

                <div>
                  <label className="caption mb-1 block">
                    Variabel (klik untuk insert)
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {COMMON_VARIABLES.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => insertVariable(v)}
                        className="badge badge-neutral font-mono text-[10px] cursor-pointer hover:bg-cream-200"
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.isActive ?? true}
                    onChange={(e) =>
                      setDraft({ ...draft, isActive: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  Template aktif (auto-trigger di event)
                </label>
              </div>

              <div className="border-t border-border px-4 py-3 flex flex-wrap gap-2 justify-end">
                {!creating && (
                  <>
                    <button
                      type="button"
                      onClick={() => setTestOpen(true)}
                      className="btn btn-outline btn-sm"
                      disabled={!draft.body}
                    >
                      <Send className="h-3.5 w-3.5" />
                      Send Test
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="btn btn-ghost btn-sm text-danger"
                      title="Hapus"
                      aria-label="Hapus"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={save}
                  disabled={!draft.name || !draft.body || createMut.isPending || updateMut.isPending}
                  className="btn btn-primary btn-sm"
                >
                  <Save className="h-3.5 w-3.5" />
                  {createMut.isPending || updateMut.isPending
                    ? 'Menyimpan...'
                    : creating
                      ? 'Buat'
                      : 'Simpan'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Send test dialog */}
      {testOpen && selectedId !== null && (
        <SendTestDialog
          template={templates.find((t) => t.id === selectedId)!}
          variables={bodyVars}
          onClose={() => setTestOpen(false)}
          sendTest={sendTestMut}
        />
      )}
    </div>
  );
}

// =====================================================================
// Sub-components
// =====================================================================

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="card-althea p-3">
      <div className="caption mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="brand-mark text-2xl text-teal-800">{value}</span>
        <span className="caption text-xs">{sub}</span>
      </div>
    </div>
  );
}

function ConnectionStatus() {
  // TODO: actual probe ke /api/clinic/wa/health (kalau ada) atau cek setting
  // Placeholder: tampil sebagai "Tersambung" karena Fonnte/Mock provider always responds.
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
      style={{
        background: 'var(--success-soft)',
        color: 'var(--success)',
        border: '1px solid #c8e0ce',
      }}
    >
      <span
        className="block rounded-full"
        style={{
          width: 8,
          height: 8,
          background: 'var(--success)',
          boxShadow: '0 0 0 4px rgba(79,140,91,0.18)',
        }}
      />
      WA Provider Active
    </div>
  );
}

function SendTestDialog({
  template,
  variables,
  onClose,
  sendTest,
}: {
  template: Template;
  variables: string[];
  onClose: () => void;
  sendTest: ReturnType<typeof useSendTest>;
}) {
  const [phone, setPhone] = useState('+62');
  const [varValues, setVarValues] = useState<Record<string, string>>(
    Object.fromEntries(variables.map((v) => [v, ''])),
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    sendTest.mutate(
      { phone, templateId: template.id, variables: varValues },
      { onSuccess: () => onClose() },
    );
  }

  return (
    <div
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card-althea w-full max-w-md max-h-[90vh] overflow-y-auto bg-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="h2">
            <Eye className="inline h-4 w-4 mr-2" />
            Send Test: {template.name}
          </h2>
          <p className="caption mt-1">
            Isi variabel + nomor WA untuk preview.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-3 px-6 py-4">
          <div>
            <label className="caption mb-1 block">No. WhatsApp *</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+6281234567890"
              className="input-althea font-mono text-sm"
            />
            <p className="caption mt-1">Format E.164 (+62 untuk Indonesia)</p>
          </div>
          {variables.length > 0 && (
            <div className="space-y-2">
              <p className="caption font-semibold">
                Variabel template ({variables.length}):
              </p>
              {variables.map((v) => (
                <div key={v}>
                  <label className="caption mb-1 block font-mono">{`{{${v}}}`}</label>
                  <input
                    value={varValues[v] ?? ''}
                    onChange={(e) =>
                      setVarValues({ ...varValues, [v]: e.target.value })
                    }
                    className="input-althea"
                    placeholder={v}
                  />
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Batal
            </button>
            <button
              type="submit"
              disabled={sendTest.isPending}
              className="btn btn-primary"
            >
              <Send className="h-4 w-4" />
              {sendTest.isPending ? 'Mengirim...' : 'Kirim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
