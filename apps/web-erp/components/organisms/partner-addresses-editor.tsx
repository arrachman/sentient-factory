'use client';

/**
 * Editable sub-list of partner addresses (md_partner_addresses).
 * Phone/fax ("no hp") live here — kept out of the partner's main/"Utama"
 * fields. Add + remove only (matches backend capability).
 * Atomic tier: Organism.
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input, Textarea } from '@/components/ui/input';
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
import { SearchSelect } from '@/components/molecules/search-select';
import { confirmAction, notify } from '@/lib/feedback';
import {
  getPartner,
  addPartnerAddress,
  removePartnerAddress,
  type ErpPartnerAddress,
  type ErpAddressType,
} from '@/lib/api/partners';
import { listProvinces } from '@/lib/api/provinces';
import { listCities } from '@/lib/api/cities';

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
  cityId: string;
  province: string;
  provinceId: string;
  postalCode: string;
  country: string;
  phone: string;
  fax: string;
  email: string;
  website: string;
  isDefault: boolean;
}

const emptyDraft = (): DraftAddress => ({
  type: 'BILLING',
  addressLine1: '',
  city: '',
  cityId: '',
  province: '',
  provinceId: '',
  postalCode: '',
  country: '',
  phone: '',
  fax: '',
  email: '',
  website: '',
  isDefault: false,
});

async function loadProvinceOptions(search: string, page: number, limit: number) {
  const res = await listProvinces({ search: search || undefined, page, limit, isActive: true });
  return { data: res.data.map((p) => ({ value: p.id, label: p.name })), total: res.meta.total };
}

async function loadCityOptions(search: string, page: number, limit: number) {
  const res = await listCities({ search: search || undefined, page, limit, isActive: true });
  return { data: res.data.map((c) => ({ value: c.id, label: c.name })), total: res.meta.total };
}

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
        country: draft.country.trim() || undefined,
        postalCode: draft.postalCode.trim() || undefined,
        phone: draft.phone.trim() || undefined,
        fax: draft.fax.trim() || undefined,
        email: draft.email.trim() || undefined,
        website: draft.website.trim() || undefined,
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
              <TableHead style={{ width: 100 }}>Negara</TableHead>
              <TableHead style={{ width: 130 }}>No HP</TableHead>
              <TableHead style={{ width: 160 }}>Email</TableHead>
              <TableHead style={{ width: 70 }}>Utama</TableHead>
              <TableHead style={{ width: 64 }} />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={8} className="muted">Memuat…</TableCell></TableRow>
            ) : items.length === 0 ? (
              <TableEmpty colSpan={8} variant="empty" entityLabel="alamat" />
            ) : (
              items.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="muted">{TYPE_LABELS[a.type] ?? a.type}</TableCell>
                  <TableCell>{a.addressLine1}</TableCell>
                  <TableCell className="muted">{a.city || '—'}</TableCell>
                  <TableCell className="muted">{a.country || '—'}</TableCell>
                  <TableCell>{a.phone || '—'}</TableCell>
                  <TableCell className="muted">{a.email || '—'}</TableCell>
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
            <Textarea id="pa-line1" value={draft.addressLine1} onChange={(e) => setD('addressLine1', e.target.value)} placeholder="Jl. Sudirman No. 1" rows={3} />
          </FormField>
        </div>
        <FormField label="Provinsi" htmlFor="pa-prov">
          <SearchSelect
            id="pa-prov"
            value={draft.provinceId}
            onValueChange={(v) => setD('provinceId', v)}
            onPick={(opt) => setDraft((d) => ({ ...d, provinceId: opt.value, province: opt.label, cityId: '', city: '' }))}
            loadOptions={loadProvinceOptions}
            placeholder="Pilih provinsi…"
            title="Provinsi"
          />
        </FormField>
        <FormField label="Kota" htmlFor="pa-city">
          <SearchSelect
            id="pa-city"
            value={draft.cityId}
            onValueChange={(v) => setD('cityId', v)}
            onPick={(opt) => setDraft((d) => ({ ...d, cityId: opt.value, city: opt.label }))}
            loadOptions={loadCityOptions}
            placeholder="Pilih kota…"
            title="Kota"
          />
        </FormField>
        <FormField label="Kode Pos" htmlFor="pa-postal">
          <Input id="pa-postal" value={draft.postalCode} onChange={(e) => setD('postalCode', e.target.value)} placeholder="10220" />
        </FormField>
        <FormField label="Negara" htmlFor="pa-country">
          <Input id="pa-country" value={draft.country} onChange={(e) => setD('country', e.target.value)} placeholder="Indonesia" />
        </FormField>
        <FormField label="No HP" htmlFor="pa-phone">
          <Input id="pa-phone" value={draft.phone} onChange={(e) => setD('phone', e.target.value)} placeholder="021-5551234" />
        </FormField>
        <FormField label="Fax" htmlFor="pa-fax">
          <Input id="pa-fax" value={draft.fax} onChange={(e) => setD('fax', e.target.value)} placeholder="021-5554321" />
        </FormField>
        <FormField label="Email" htmlFor="pa-email">
          <Input id="pa-email" value={draft.email} onChange={(e) => setD('email', e.target.value)} placeholder="info@example.com" />
        </FormField>
        <FormField label="Website" htmlFor="pa-website">
          <Input id="pa-website" value={draft.website} onChange={(e) => setD('website', e.target.value)} placeholder="https://www.example.com" />
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
