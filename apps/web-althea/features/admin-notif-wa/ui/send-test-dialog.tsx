'use client';

/**
 * Modal Send Test — kirim WA preview ke nomor manual dengan isian variabel.
 * Variabel diambil dari hasil regex `{{var}}` di body template aktif.
 */
import { useState } from 'react';
import { Eye, Send } from 'lucide-react';
import type { useSendTest } from '../hooks/use-wa';
import type { Template } from '../model/types';

export function SendTestDialog({
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
            <p className="caption mt-1">
              Format E.164 (+62 untuk Indonesia)
            </p>
          </div>
          {variables.length > 0 ? (
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
          ) : null}
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline btn-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={sendTest.isPending}
              className="btn btn-primary btn-sm"
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
