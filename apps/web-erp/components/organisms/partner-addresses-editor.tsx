'use client';

/**
 * Editable sub-list of partner addresses (md_partner_addresses).
 * Phone/fax ("no hp") live here — kept out of the partner's main/"Utama"
 * fields. Add + remove only (matches backend capability).
 * Atomic tier: Organism.
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { BooleanRadio } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from '@/components/organisms/table';
import { confirmAction, notify } from '@/lib/feedback';
import {
  getPartner,
  addPartnerAddress,
  removePartnerAddress,
  type ErpPartnerAddress,
  type ErpAddressType,
} from '@/lib/api/partners';

const TYPE_LABELS: Record<ErpAddressType, string> = {
  BILLING: 'Penagihan',
  SHIPPING: 'Pengiriman',
  OFFICE: 'Kantor',
  OTHER: 'Lainnya',
};

interface DraftAddress {
  type: ErpAddressType;
  addressLine1: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  fax: string;
  isDefault: boolean;
}

const emptyDraft = (): DraftAddress => ({
  type: 'BILLING',
  addressLine1: '',
  city: '',
  province: '',
  postalCode: '',
  phone: '',
  fax: '',
  isDefault: false,
});

export function PartnerAddressesEditor({ partnerId }: { partnerId: string }) {
  const [items, setItems] = React.useState<ErpPartnerAddress[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [draft, setDraft] = React.useState<DraftAddress>(emptyDraft);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    getPartner(partnerId)
      .then((p) => { if (active) setItems(p.addresses ?? []); })
      .catch((e) => notify(e instanceof Error ? e.message : 'Gagal memuat alamat', 'danger'))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [partnerId]);

  const setD = (k: keyof DraftAddress, v: string | boolean) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const handleAdd = async () => {
    if (!draft.addressLine1.trim()) { notify('Alamat wajib diisi', 'warn'); return; }
    setSaving(true);
    try {
      const created = await addPartnerAddress(partnerId, {
        type: draft.type,
        addressLine1: draft.addressLine1.trim(),
        city: draft.city.trim() || undefined,
        province: draft.province.trim() || undefined,
        postalCode: draft.postalCode.trim() || undefined,
        phone: draft.phone.trim() || undefined,
        fax: draft.fax.trim() || undefined,
        isDefault: draft.isDefault,
      });
      setItems((prev) => [...prev, created]);
      setDraft(emptyDraft());
      notify('Alamat ditambahkan', 'success');
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Gagal menambah alamat', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = (a: ErpPartnerAddress) =>
    confirmAction({
      title: 'Hapus alamat?',
      message: `${a.addressLine1} akan dihapus.`,
      variant: 'danger',
      confirmLabel: 'Hapus',
      confirmIcon: 'trash',
      onConfirm: async () => {
        try {
          await removePartnerAddress(partnerId, a.id);
          setItems((prev) => prev.filter((x) => x.id !== a.id));
          notify('Alamat dihapus', 'success');
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
              <TableHead style={{ width: 96 }}>Tipe</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead style={{ width: 120 }}>Kota</TableHead>
              <TableHead style={{ width: 130 }}>No HP</TableHead>
              <TableHead style={{ width: 70 }}>Utama</TableHead>
              <TableHead style={{ width: 64 }} />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="muted">Memuat…</TableCell></TableRow>
            ) : items.length === 0 ? (
              <TableEmpty colSpan={6} variant="empty" entityLabel="alamat" />
            ) : (
              items.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="muted">{TYPE_LABELS[a.type] ?? a.type}</TableCell>
                  <TableCell>{a.addressLine1}</TableCell>
                  <TableCell className="muted">{a.city || '—'}</TableCell>
                  <TableCell>{a.phone || '—'}</TableCell>
                  <TableCell>{a.isDefault ? <Badge variant="info" dot>Utama</Badge> : null}</TableCell>
                  <TableCell>
                    <button type="button" className="btn ghost danger" onClick={() => handleRemove(a)}>
                      Hapus
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <fieldset className="grid grid-cols-2 gap-x-3 gap-y-1 rounded-[var(--radius)] border border-border p-3">
        <legend className="px-1 text-[12px] font-medium text-muted-foreground">Tambah alamat</legend>
        <FormField label="Tipe" htmlFor="pa-type">
          <Select value={draft.type} onValueChange={(v) => setD('type', v as ErpAddressType)}>
            <SelectTrigger id="pa-type"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(TYPE_LABELS) as ErpAddressType[]).map((t) => (
                <SelectItem key={t} value={t}>{TYPE_LABELS[t]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Alamat utama" htmlFor="pa-default">
          <BooleanRadio id="pa-default" value={draft.isDefault} onValueChange={(v) => setD('isDefault', v)} trueLabel="Ya" falseLabel="Tidak" />
        </FormField>
        <div className="col-span-2">
          <FormField label="Alamat" htmlFor="pa-line1" required>
            <Input id="pa-line1" value={draft.addressLine1} onChange={(e) => setD('addressLine1', e.target.value)} placeholder="Jl. Sudirman No. 1" />
          </FormField>
        </div>
        <FormField label="Kota" htmlFor="pa-city">
          <Input id="pa-city" value={draft.city} onChange={(e) => setD('city', e.target.value)} placeholder="Jakarta" />
        </FormField>
        <FormField label="Provinsi" htmlFor="pa-prov">
          <Input id="pa-prov" value={draft.province} onChange={(e) => setD('province', e.target.value)} placeholder="DKI Jakarta" />
        </FormField>
        <FormField label="Kode Pos" htmlFor="pa-postal">
          <Input id="pa-postal" value={draft.postalCode} onChange={(e) => setD('postalCode', e.target.value)} placeholder="10220" />
        </FormField>
        <FormField label="No HP" htmlFor="pa-phone">
          <Input id="pa-phone" value={draft.phone} onChange={(e) => setD('phone', e.target.value)} placeholder="021-5551234" />
        </FormField>
        <FormField label="Fax" htmlFor="pa-fax">
          <Input id="pa-fax" value={draft.fax} onChange={(e) => setD('fax', e.target.value)} placeholder="021-5554321" />
        </FormField>
        <div className="flex items-end justify-end">
          <button type="button" className="btn primary" onClick={handleAdd} disabled={saving}>
            {saving ? 'Menambah…' : 'Tambah alamat'}
          </button>
        </div>
      </fieldset>
    </div>
  );
}
