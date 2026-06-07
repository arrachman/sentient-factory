'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { notify } from '@/lib/feedback';
import {
  createReportTemplate,
  updateReportTemplate,
  type RptTemplateRecord,
} from '@/lib/api/reports';

interface Props {
  open: boolean;
  initial?: RptTemplateRecord;
  onClose: () => void;
  onSaved: () => void;
  onOpenDesigner: (id: string) => void;
}

const MODULES = ['sys', 'fin', 'pur', 'sls', 'inv', 'mfg', 'fa', 'md', 'pos', 'pln'];

export function ReportTemplateDialog({ open, initial, onClose, onSaved, onOpenDesigner }: Props) {
  const isEdit = !!initial;
  const [code, setCode] = React.useState('');
  const [name, setName] = React.useState('');
  const [module, setModule] = React.useState('sys');
  const [description, setDescription] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setCode(initial?.code ?? '');
      setName(initial?.name ?? '');
      setModule(initial?.module ?? 'sys');
      setDescription(initial?.description ?? '');
    }
  }, [open, initial]);

  async function handleSave() {
    if (!code.trim() || !name.trim()) {
      notify('Kode dan Nama wajib diisi', 'danger');
      return;
    }
    setSaving(true);
    try {
      let saved: RptTemplateRecord;
      if (isEdit) {
        saved = await updateReportTemplate(initial!.id, { name, module, description });
      } else {
        saved = await createReportTemplate({ code, name, module, description });
      }
      notify(isEdit ? 'Template diperbarui' : 'Template dibuat', 'success');
      onSaved();
      if (!isEdit) onOpenDesigner(saved.id);
    } catch (e: any) {
      notify(e.message, 'danger');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Info Template' : 'Buat Template Baru'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {!isEdit && (
            <div>
              <label className="block text-sm font-medium mb-1">Kode *</label>
              <Input
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="RPT-PO-001"
                className="font-mono"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Nama *</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Laporan Purchase Order" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Modul</label>
            <select
              value={module}
              onChange={e => setModule(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm bg-[var(--bg-card)] cursor-pointer"
            >
              {MODULES.map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              className="w-full border rounded px-3 py-2 text-sm resize-none bg-[var(--bg-card)]"
              placeholder="Keterangan opsional..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={saving}>Batal</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Menyimpan...' : isEdit ? 'Simpan' : 'Buat & Buka Designer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
