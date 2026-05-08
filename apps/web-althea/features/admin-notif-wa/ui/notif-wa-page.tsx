'use client';

import { useState } from 'react';
import { Pencil, Plus, Send, Trash2 } from 'lucide-react';
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
  STATUS_BADGE,
  WA_CATEGORIES,
  type CreateTemplateInput,
  type Template,
} from '../model/types';

const EMPTY: CreateTemplateInput = {
  name: '',
  category: 'pengingat',
  triggerEvent: '',
  body: '',
  recipients: ['klien'],
  isActive: true,
};

export function NotifWaPage() {
  const [tab, setTab] = useState<'template' | 'log'>('template');
  const [open, setOpen] = useState(false);
  const [testOpen, setTestOpen] = useState<Template | null>(null);
  const [editing, setEditing] = useState<Template | null>(null);
  const [form, setForm] = useState<CreateTemplateInput>(EMPTY);

  const tplList = useTemplateList({ limit: 100 });
  const logList = useLogList({ limit: 50 });
  const createMut = useCreateTemplate();
  const updateMut = useUpdateTemplate();
  const deleteMut = useDeleteTemplate();
  const sendTestMut = useSendTest();

  function close() { setOpen(false); setEditing(null); }
  function openCreate() { setEditing(null); setForm(EMPTY); setOpen(true); }
  function openEdit(t: Template) {
    setEditing(t);
    setForm({
      name: t.name,
      category: t.category,
      triggerEvent: t.triggerEvent ?? '',
      body: t.body,
      recipients: t.recipients,
      isActive: t.isActive,
    });
    setOpen(true);
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) updateMut.mutate({ id: editing.id, input: form }, { onSuccess: close });
    else createMut.mutate(form, { onSuccess: close });
  }
  function handleDelete(t: Template) {
    if (!confirm(`Hapus template "${t.name}"?`)) return;
    deleteMut.mutate(t.id);
  }

  function toggleRecipient(r: string) {
    if (form.recipients.includes(r)) {
      setForm({ ...form, recipients: form.recipients.filter((x) => x !== r) });
    } else {
      setForm({ ...form, recipients: [...form.recipients, r] });
    }
  }

  const templates = tplList.data?.data ?? [];
  const logs = logList.data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1">Notifikasi WhatsApp</h1>
          <p className="caption mt-1">Template + log delivery. Provider: Fonnte (kalau FONNTE_API_TOKEN set, else MockProvider).</p>
        </div>
        {tab === 'template' && (
          <button type="button" onClick={openCreate} className="btn btn-primary">
            <Plus className="h-4 w-4" /> Tambah Template
          </button>
        )}
      </div>

      <div className="border-b border-border">
        <button
          type="button"
          onClick={() => setTab('template')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === 'template' ? 'border-sage-500 text-sage-700' : 'border-transparent text-fg-muted'}`}
        >
          Templates ({templates.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('log')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === 'log' ? 'border-sage-500 text-sage-700' : 'border-transparent text-fg-muted'}`}
        >
          Log Pengiriman
        </button>
      </div>

      {tab === 'template' ? (
        <div className="space-y-4">
          {WA_CATEGORIES.map((cat) => {
            const items = templates.filter((t) => t.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat} className="space-y-2">
                <h2 className="h2">{CATEGORY_LABEL[cat]} ({items.length})</h2>
                <div className="card-althea overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-cream-100 border-b border-border text-left">
                      <tr>
                        <th className="px-4 py-2 font-medium">Nama</th>
                        <th className="px-4 py-2 font-medium">Trigger Event</th>
                        <th className="px-4 py-2 font-medium">Recipients</th>
                        <th className="px-4 py-2 font-medium">Status</th>
                        <th className="px-4 py-2 font-medium text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((t) => (
                        <tr key={t.id} className="border-b border-border last:border-b-0 hover:bg-cream-50">
                          <td className="px-4 py-2">
                            <div className="font-medium text-teal-800">{t.name}</div>
                            <div className="caption text-fg-muted truncate max-w-[300px]">{t.body.slice(0, 80)}...</div>
                          </td>
                          <td className="px-4 py-2 font-mono text-xs">{t.triggerEvent ?? '—'}</td>
                          <td className="px-4 py-2">{t.recipients.join(', ')}</td>
                          <td className="px-4 py-2">
                            {t.isActive ? <span className="badge badge-success">Aktif</span> : <span className="badge badge-neutral">Nonaktif</span>}
                          </td>
                          <td className="px-4 py-2 text-right">
                            <button type="button" onClick={() => setTestOpen(t)} className="btn btn-ghost btn-icon" title="Send Test" aria-label="Send Test">
                              <Send className="h-4 w-4" />
                            </button>
                            <button type="button" onClick={() => openEdit(t)} className="btn btn-ghost btn-icon" aria-label="Edit">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button type="button" onClick={() => handleDelete(t)} className="btn btn-ghost btn-icon text-danger" aria-label="Hapus">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card-althea overflow-hidden">
          <div className="caption px-4 py-2 border-b border-border bg-cream-50">
            Auto-refresh tiap 5 detik. Status: queued → terkirim → sampai → dibaca | gagal
          </div>
          <table className="w-full text-sm">
            <thead className="bg-cream-100 border-b border-border text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Waktu</th>
                <th className="px-4 py-2 font-medium">Recipient</th>
                <th className="px-4 py-2 font-medium">Template</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Body</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-2 caption">{new Date(l.createdAt).toLocaleString('id-ID')}</td>
                  <td className="px-4 py-2 font-mono text-xs">{l.recipientPhone}</td>
                  <td className="px-4 py-2">{l.template?.name ?? '—'}</td>
                  <td className="px-4 py-2">
                    <span className={`badge ${STATUS_BADGE[l.status] ?? 'badge-neutral'}`}>{l.status}</span>
                    {l.errorReason && <div className="caption text-danger mt-1">{l.errorReason}</div>}
                  </td>
                  <td className="px-4 py-2 text-fg-muted truncate max-w-[400px]">{l.body.slice(0, 100)}</td>
                </tr>
              ))}
              {logs.length === 0 && !logList.isLoading && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-fg-muted">Belum ada log pengiriman.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Template Form Dialog */}
      {open && (
        <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className="card-althea w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
            <div className="border-b border-border px-6 py-4">
              <h2 className="h2">{editing ? 'Edit Template' : 'Tambah Template'}</h2>
            </div>
            <form onSubmit={submit} className="space-y-3 px-6 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="caption mb-1 block">Nama *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-althea" />
                </div>
                <div>
                  <label className="caption mb-1 block">Kategori *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as CreateTemplateInput['category'] })} className="input-althea">
                    {WA_CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="caption mb-1 block">Trigger Event (opsional)</label>
                <input
                  value={form.triggerEvent ?? ''}
                  onChange={(e) => setForm({ ...form, triggerEvent: e.target.value })}
                  placeholder="e.g., confirmation, reminder_h1, follow_up"
                  className="input-althea"
                />
              </div>
              <div>
                <label className="caption mb-1 block">Body (Mustache `{`{{var}}`}`) *</label>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  required
                  rows={6}
                  className="input-althea h-auto py-2 font-mono text-xs"
                />
              </div>
              <div>
                <label className="caption mb-1 block">Recipients * (minimal 1)</label>
                <div className="flex gap-2">
                  {['klien', 'psikolog'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => toggleRecipient(r)}
                      className={`badge cursor-pointer ${form.recipients.includes(r) ? 'badge-sage' : 'badge-neutral'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive ?? true} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4" />
                Aktif
              </label>
              <div className="flex justify-end gap-2 border-t border-border pt-3">
                <button type="button" onClick={close} className="btn btn-outline">Batal</button>
                <button type="submit" disabled={createMut.isPending || updateMut.isPending} className="btn btn-primary">
                  {createMut.isPending || updateMut.isPending ? 'Menyimpan...' : editing ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Test Dialog */}
      {testOpen && (
        <SendTestDialog template={testOpen} onClose={() => setTestOpen(null)} sendTest={sendTestMut} />
      )}
    </div>
  );
}

function SendTestDialog({
  template,
  onClose,
  sendTest,
}: {
  template: Template;
  onClose: () => void;
  sendTest: ReturnType<typeof useSendTest>;
}) {
  const [phone, setPhone] = useState('+62');
  const variables = template.body.match(/\{\{(\w+)\}\}/g)?.map((m) => m.slice(2, -2)) ?? [];
  const uniqueVars = [...new Set(variables)];
  const [varValues, setVarValues] = useState<Record<string, string>>(
    Object.fromEntries(uniqueVars.map((v) => [v, ''])),
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    sendTest.mutate(
      { phone, templateId: template.id, variables: varValues },
      { onSuccess: () => onClose() },
    );
  }

  return (
    <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="card-althea w-full max-w-md bg-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="h2">Send Test: {template.name}</h2>
        </div>
        <form onSubmit={submit} className="space-y-3 px-6 py-4">
          <div>
            <label className="caption mb-1 block">No. WhatsApp *</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+6281234567890" className="input-althea" />
          </div>
          {uniqueVars.length > 0 && (
            <div className="space-y-2">
              <p className="caption">Variabel template:</p>
              {uniqueVars.map((v) => (
                <div key={v}>
                  <label className="caption mb-1 block">{`{{${v}}}`}</label>
                  <input
                    value={varValues[v] ?? ''}
                    onChange={(e) => setVarValues({ ...varValues, [v]: e.target.value })}
                    className="input-althea"
                  />
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <button type="button" onClick={onClose} className="btn btn-outline">Batal</button>
            <button type="submit" disabled={sendTest.isPending} className="btn btn-primary">
              <Send className="h-4 w-4" />
              {sendTest.isPending ? 'Mengirim...' : 'Kirim Test'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
