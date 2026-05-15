'use client';

/**
 * Right column halaman Notifikasi WA — editor template aktif.
 *
 * Empty state saat tidak ada selected & not creating. Else: header (eyebrow
 * "Template Baru" / "Edit · ID X" + nama input), body (form fields), footer
 * (tombol Send Test + Hapus + Simpan/Buat).
 */
import { Info, Save, Send, Trash2 } from 'lucide-react';
import {
  CATEGORY_LABEL,
  WA_CATEGORIES,
  type CreateTemplateInput,
  type WaCategory,
} from '../model/types';
import {
  COMMON_VARIABLES,
  STATUS_LABEL,
  STATUS_PILL_STYLE,
  TRIGGER_META,
} from '../model/constants';
import { getRecipStyle } from '../model/format';

export function TemplateEditor({
  creating,
  selectedId,
  draft,
  submitting,
  bodyEmpty,
  onChangeDraft,
  onToggleRecipient,
  onInsertVariable,
  onRequestSendTest,
  onSave,
  onDelete,
}: {
  creating: boolean;
  selectedId: number | null;
  draft: CreateTemplateInput;
  submitting: boolean;
  bodyEmpty: boolean;
  onChangeDraft: (next: CreateTemplateInput) => void;
  onToggleRecipient: (r: string) => void;
  onInsertVariable: (v: string) => void;
  onRequestSendTest: () => void;
  onSave: () => void;
  onDelete: () => void;
}) {
  if (!creating && selectedId === null) {
    return (
      <div className="card-althea overflow-hidden flex flex-col">
        <div className="p-8 text-center text-fg-muted flex-1 flex items-center justify-center">
          Pilih template di kiri untuk edit, atau klik{' '}
          <strong className="ml-1">Template Baru</strong>.
        </div>
      </div>
    );
  }

  const saveLabel = submitting
    ? 'Menyimpan...'
    : creating
      ? 'Buat'
      : 'Simpan';

  return (
    <div className="card-althea overflow-hidden flex flex-col">
      <EditorHeader
        title={creating ? 'Template Baru' : `Edit · ID ${selectedId}`}
        nameValue={draft.name}
        onChangeName={(v) => onChangeDraft({ ...draft, name: v })}
      />
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="caption mb-1 block">Kategori</label>
            <select
              value={draft.category}
              onChange={(e) =>
                onChangeDraft({
                  ...draft,
                  category: e.target.value as WaCategory,
                })
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
                onChangeDraft({ ...draft, triggerEvent: e.target.value })
              }
              placeholder="confirmation"
              className="input-althea"
            />
          </div>
        </div>

        <TriggerInfo triggerEvent={draft.triggerEvent ?? ''} />

        <RecipientPicker
          recipients={draft.recipients}
          onToggle={onToggleRecipient}
        />

        <div>
          <label className="caption mb-1 block">Pesan</label>
          <textarea
            value={draft.body}
            onChange={(e) => onChangeDraft({ ...draft, body: e.target.value })}
            rows={9}
            className="input-althea h-auto py-2 font-mono text-xs leading-relaxed"
            placeholder="Halo {{nama_klien}}, ..."
            required
          />
        </div>

        <VariablePicker onInsert={onInsertVariable} />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={draft.isActive ?? true}
            onChange={(e) =>
              onChangeDraft({ ...draft, isActive: e.target.checked })
            }
            className="h-4 w-4"
          />
          Template aktif (auto-trigger di event)
        </label>
      </div>

      <div className="border-t border-border px-4 py-3 flex flex-wrap gap-2 justify-end">
        {!creating ? (
          <>
            <button
              type="button"
              onClick={onRequestSendTest}
              className="btn btn-outline btn-sm"
              disabled={bodyEmpty}
            >
              <Send className="h-3.5 w-3.5" />
              Send Test
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="btn btn-ghost btn-sm text-danger"
              title="Hapus"
              aria-label="Hapus"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        ) : null}
        <button
          type="button"
          onClick={onSave}
          disabled={!draft.name || !draft.body || submitting}
          className="btn btn-primary btn-sm"
        >
          <Save className="h-3.5 w-3.5" />
          {saveLabel}
        </button>
      </div>
    </div>
  );
}

function EditorHeader({
  title,
  nameValue,
  onChangeName,
}: {
  title: string;
  nameValue: string;
  onChangeName: (v: string) => void;
}) {
  return (
    <div className="border-b border-border px-4 py-3 space-y-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
        {title}
      </span>
      <input
        type="text"
        value={nameValue}
        onChange={(e) => onChangeName(e.target.value)}
        placeholder="Nama template"
        className="block w-full text-lg font-medium text-teal-800 bg-transparent border-0 outline-none focus:ring-0 px-0 brand-mark"
        required
      />
    </div>
  );
}

function RecipientPicker({
  recipients,
  onToggle,
}: {
  recipients: string[];
  onToggle: (r: string) => void;
}) {
  return (
    <div>
      <label className="caption mb-1 block">Penerima</label>
      <div className="flex flex-wrap gap-1.5">
        {(['klien', 'psikolog', 'staff', 'user'] as const).map((r) => {
          const rs = getRecipStyle(r);
          const active = recipients.includes(r);
          return (
            <button
              key={r}
              type="button"
              onClick={() => onToggle(r)}
              className="badge cursor-pointer transition"
              style={
                active
                  ? { background: rs.bg, color: rs.fg }
                  : {
                      background: 'var(--cream-100)',
                      color: 'var(--fg-muted)',
                    }
              }
            >
              {rs.label}
              {active ? ' ✓' : ''}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TriggerInfo({ triggerEvent }: { triggerEvent: string }) {
  const key = triggerEvent.trim().toLowerCase();
  const meta = key ? TRIGGER_META[key] : undefined;

  if (!meta) {
    return (
      <div className="rounded-md border border-dashed border-border bg-cream-50 px-3 py-2.5">
        <div className="flex items-start gap-2">
          <Info className="h-3.5 w-3.5 mt-0.5 text-fg-muted flex-shrink-0" />
          <p className="text-xs text-fg-muted leading-relaxed">
            {key
              ? `Trigger "${key}" belum punya dokumentasi. Tambahkan di TRIGGER_META (constants.ts) untuk membantu admin lain memahami kapan notif ini terkirim.`
              : 'Isi Trigger Event di atas untuk melihat penjelasan lengkap kapan dan bagaimana notifikasi ini bekerja.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border bg-cream-50 divide-y divide-border">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-teal-800 flex-shrink-0" />
          <span className="text-xs font-semibold text-teal-800">
            Cara kerja notifikasi ini
          </span>
        </div>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${STATUS_PILL_STYLE[meta.status]}`}
        >
          {STATUS_LABEL[meta.status]}
        </span>
      </div>

      {/* Narasi */}
      <div className="px-3 py-2.5">
        <p className="text-xs text-teal-800 leading-relaxed">{meta.cerita}</p>
      </div>

      {/* Syarat */}
      <div className="px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-fg-muted mb-1.5">
          Supaya terkirim, pastikan:
        </p>
        <ul className="space-y-1">
          {meta.syarat.map((s, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-teal-800">
              <span className="mt-0.5 h-3.5 w-3.5 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Tips */}
      {meta.tips ? (
        <div className="px-3 py-2 bg-amber-50 rounded-b-md">
          <p className="text-xs text-amber-900 leading-relaxed">
            <span className="font-semibold">Tips: </span>
            {meta.tips}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function VariablePicker({ onInsert }: { onInsert: (v: string) => void }) {
  return (
    <div>
      <label className="caption mb-1 block">
        Variabel (klik untuk insert)
      </label>
      <div className="flex flex-wrap gap-1">
        {COMMON_VARIABLES.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onInsert(v)}
            className="badge badge-neutral font-mono text-[10px] cursor-pointer hover:bg-cream-200"
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
