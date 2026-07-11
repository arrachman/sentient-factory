'use client';

/**
 * Editable sub-list of partner contacts (md_partner_contacts).
 * Phone ("no hp") lives here — deliberately kept out of the partner's
 * main/"Utama" fields. Add, edit (kebab menu, §2.11), and remove.
 * Atomic tier: Organism.
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { BooleanRadio } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from '@/components/organisms/table';
import { RowActionsMenu, RowContextMenu, type RowActionItem } from '@/components/molecules/row-actions-menu';
import { confirmAction, notify } from '@/lib/feedback';
import {
  getPartner,
  addPartnerContact,
  updatePartnerContact,
  removePartnerContact,
  type ErpPartnerContact,
} from '@/lib/api/partners';

interface DraftContact {
  name: string;
  title: string;
  phone: string;
  email: string;
  isDefault: boolean;
}

const emptyDraft = (): DraftContact => ({
  name: '',
  title: '',
  phone: '',
  email: '',
  isDefault: false,
});

export function PartnerContactsEditor({ partnerId }: { partnerId: string }) {
  const [items, setItems] = React.useState<ErpPartnerContact[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [draft, setDraft] = React.useState<DraftContact>(emptyDraft);
  const [saving, setSaving] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    getPartner(partnerId)
      .then((p) => { if (active) setItems(p.contacts ?? []); })
      .catch((e) => notify(e instanceof Error ? e.message : 'Gagal memuat kontak', 'danger'))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [partnerId]);

  const setD = (k: keyof DraftContact, v: string | boolean) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const handleEdit = (c: ErpPartnerContact) => {
    setEditingId(c.id);
    setDraft({
      name: c.name,
      title: c.title ?? '',
      phone: c.phone ?? '',
      email: c.email ?? '',
      isDefault: c.isDefault,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDraft(emptyDraft());
  };

  const handleSubmit = async () => {
    if (!draft.name.trim()) { notify('Nama kontak wajib diisi', 'warn'); return; }
    setSaving(true);
    try {
      const payload = {
        name: draft.name.trim(),
        title: draft.title.trim() || undefined,
        phone: draft.phone.trim() || undefined,
        email: draft.email.trim() || undefined,
        isDefault: draft.isDefault,
      };
      if (editingId) {
        const updated = await updatePartnerContact(partnerId, editingId, payload);
        setItems((prev) => prev.map((x) => (x.id === editingId ? updated : x)));
        notify('Kontak diperbarui', 'success');
      } else {
        const created = await addPartnerContact(partnerId, payload);
        setItems((prev) => [...prev, created]);
        notify('Kontak ditambahkan', 'success');
      }
      setEditingId(null);
      setDraft(emptyDraft());
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Gagal menyimpan kontak', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = (c: ErpPartnerContact) =>
    confirmAction({
      title: 'Hapus kontak?',
      message: `${c.name} akan dihapus.`,
      variant: 'danger',
      confirmLabel: 'Hapus',
      confirmIcon: 'trash',
      onConfirm: async () => {
        try {
          await removePartnerContact(partnerId, c.id);
          setItems((prev) => prev.filter((x) => x.id !== c.id));
          if (editingId === c.id) handleCancelEdit();
          notify('Kontak dihapus', 'success');
        } catch (e) {
          notify(e instanceof Error ? e.message : 'Gagal menghapus', 'danger');
        }
      },
    });

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="lines">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead>No HP</TableHead>
              <TableHead>Email</TableHead>
              <TableHead style={{ width: 80 }}>Utama</TableHead>
              <TableHead style={{ width: 64 }} />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="muted">Memuat…</TableCell></TableRow>
            ) : items.length === 0 ? (
              <TableEmpty colSpan={6} variant="empty" entityLabel="kontak" />
            ) : (
              items.map((c) => {
                const rowActions: RowActionItem[] = [
                  { label: 'Edit', onSelect: () => handleEdit(c) },
                  { label: 'Hapus', onSelect: () => handleRemove(c), danger: true, separatorBefore: true },
                ];
                return (
                  <RowContextMenu key={c.id} items={rowActions}>
                    <TableRow>
                      <TableCell>{c.name}</TableCell>
                      <TableCell className="muted">{c.title || '—'}</TableCell>
                      <TableCell>{c.phone || '—'}</TableCell>
                      <TableCell className="muted">{c.email || '—'}</TableCell>
                      <TableCell>{c.isDefault ? <Badge variant="info" dot>Utama</Badge> : null}</TableCell>
                      <TableCell>
                        <RowActionsMenu items={rowActions} />
                      </TableCell>
                    </TableRow>
                  </RowContextMenu>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <fieldset className="grid grid-cols-2 gap-x-3 gap-y-1 rounded-[var(--radius)] border border-border p-3">
        <legend className="px-1 text-[12px] font-medium text-muted-foreground">
          {editingId ? 'Edit kontak' : 'Tambah kontak'}
        </legend>
        <FormField label="Nama" htmlFor="pc-name" required>
          <Input id="pc-name" value={draft.name} onChange={(e) => setD('name', e.target.value)} placeholder="Budi Santoso" />
        </FormField>
        <FormField label="Jabatan" htmlFor="pc-title">
          <Input id="pc-title" value={draft.title} onChange={(e) => setD('title', e.target.value)} placeholder="Manager Pembelian" />
        </FormField>
        <FormField label="No HP" htmlFor="pc-phone">
          <Input id="pc-phone" value={draft.phone} onChange={(e) => setD('phone', e.target.value)} placeholder="08123456789" />
        </FormField>
        <FormField label="Email" htmlFor="pc-email">
          <Input id="pc-email" type="email" value={draft.email} onChange={(e) => setD('email', e.target.value)} placeholder="budi@example.com" />
        </FormField>
        <FormField label="Kontak utama" htmlFor="pc-default">
          <BooleanRadio id="pc-default" value={draft.isDefault} onValueChange={(v) => setD('isDefault', v)} trueLabel="Ya" falseLabel="Tidak" />
        </FormField>
        <div className="col-span-2 flex justify-end gap-2">
          {editingId && (
            <button type="button" className="btn ghost" onClick={handleCancelEdit} disabled={saving}>
              Batal
            </button>
          )}
          <button type="button" className="btn primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Menyimpan…' : editingId ? 'Simpan' : 'Tambah kontak'}
          </button>
        </div>
      </fieldset>
    </div>
  );
}
