'use client';

/**
 * Editable sub-list of partner addresses (md_partner_addresses).
 * Location fields use cascading lookups: Negara → Provinsi → Kota → Kecamatan.
 * Kode pos auto-filled from selected kecamatan but remains editable.
 */

import * as React from 'react';
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
  addPartnerAddress,
  updatePartnerAddress,
  removePartnerAddress,
  type ErpPartnerAddress,
  type ErpAddressType,
} from '@/lib/api/partners';
import {
  ADDRESS_TYPE_LABELS,
  loadCountryOptions,
  makeProvinceLoader,
  makeCityLoader,
  makeAreaLoader,
  makeSubAreaLoader,
  addressLocationLabel,
} from '@/lib/partner-address-lookups';
import {
  PartnerAddressFormFields,
  type AddressInitialLabels,
  type DraftAddress,
} from '@/components/organisms/partner-address-form-fields';

const emptyDraft = (): DraftAddress => ({
  type: 'BILLING',
  addressLine1: '',
  countryId: '',
  provinceId: '',
  cityId: '',
  areaId: '',
  subAreaId: '',
  postalCode: '',
  phone: '',
  fax: '',
  email: '',
  website: '',
  isDefault: false,
});

export function PartnerAddressesEditor({ partnerId }: { partnerId: string }) {
  const [items, setItems] = React.useState<ErpPartnerAddress[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [draft, setDraft] = React.useState<DraftAddress>(emptyDraft);
  const [saving, setSaving] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [initialLabels, setInitialLabels] = React.useState<AddressInitialLabels>({});

  // Cache kode pos per subAreaId — diisi saat loader dipanggil
  const subAreaPostalRef = React.useRef<Record<string, string>>({});

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

  const provinceLoader = React.useMemo(() => makeProvinceLoader(draft.countryId), [draft.countryId]);
  const cityLoader = React.useMemo(() => makeCityLoader(draft.provinceId), [draft.provinceId]);
  const areaLoader = React.useMemo(() => makeAreaLoader(draft.cityId), [draft.cityId]);

  const subAreaLoader = React.useMemo(() => {
    subAreaPostalRef.current = {};
    const inner = makeSubAreaLoader(draft.areaId);
    return async (search: string, page: number, limit: number) => {
      const result = await inner(search, page, limit);
      result.data.forEach((opt) => {
        const postal = String(opt.meta ?? '');
        if (postal) subAreaPostalRef.current[opt.value] = postal;
      });
      return result;
    };
  }, [draft.areaId]);

  // Backup: set kode pos saat subAreaId berubah — tidak bergantung timing onPick
  React.useEffect(() => {
    if (!draft.subAreaId) return;
    const postal = subAreaPostalRef.current[draft.subAreaId];
    if (postal) setDraft((d) => ({ ...d, postalCode: postal }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.subAreaId]);

  const handleEdit = (a: ErpPartnerAddress) => {
    setEditingId(a.id);
    setDraft({
      type: a.type,
      addressLine1: a.addressLine1,
      countryId: a.countryId ?? '',
      provinceId: a.provinceId ?? '',
      cityId: a.cityId ?? '',
      areaId: a.areaId ?? '',
      subAreaId: a.subAreaId ?? '',
      postalCode: a.postalCode ?? '',
      phone: a.phone ?? '',
      fax: a.fax ?? '',
      email: a.email ?? '',
      website: a.website ?? '',
      isDefault: a.isDefault,
    });
    setInitialLabels({
      country: a.country?.name,
      province: a.province?.name,
      city: a.city?.name,
      area: a.area?.name,
      subArea: a.subArea?.name,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDraft(emptyDraft());
    setInitialLabels({});
  };

  const handleSubmit = async () => {
    if (!draft.addressLine1.trim()) { notify('Alamat wajib diisi', 'warn'); return; }
    setSaving(true);
    try {
      const payload = {
        type: draft.type,
        addressLine1: draft.addressLine1.trim(),
        countryId: draft.countryId || undefined,
        provinceId: draft.provinceId || undefined,
        cityId: draft.cityId || undefined,
        areaId: draft.areaId || undefined,
        subAreaId: draft.subAreaId || undefined,
        postalCode: draft.postalCode.trim() || undefined,
        phone: draft.phone.trim() || undefined,
        fax: draft.fax.trim() || undefined,
        email: draft.email.trim() || undefined,
        website: draft.website.trim() || undefined,
        isDefault: draft.isDefault,
      };
      if (editingId) {
        const updated = await updatePartnerAddress(partnerId, editingId, payload);
        setItems((prev) => prev.map((x) => (x.id === editingId ? updated : x)));
        notify('Alamat diperbarui', 'success');
      } else {
        const created = await addPartnerAddress(partnerId, payload);
        setItems((prev) => [...prev, created]);
        notify('Alamat ditambahkan', 'success');
      }
      setEditingId(null);
      setDraft(emptyDraft());
      setInitialLabels({});
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Gagal menyimpan alamat', 'danger');
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
          if (editingId === a.id) handleCancelEdit();
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
              <TableHead>Lokasi</TableHead>
              <TableHead style={{ width: 80 }}>Kode Pos</TableHead>
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
              items.map((a) => {
                const rowActions: RowActionItem[] = [
                  { label: 'Edit', onSelect: () => handleEdit(a) },
                  { label: 'Hapus', onSelect: () => handleRemove(a), danger: true, separatorBefore: true },
                ];
                return (
                  <RowContextMenu key={a.id} items={rowActions}>
                    <TableRow>
                      <TableCell className="muted">{ADDRESS_TYPE_LABELS[a.type as ErpAddressType] ?? a.type}</TableCell>
                      <TableCell>{a.addressLine1}</TableCell>
                      <TableCell className="muted">{addressLocationLabel(a)}</TableCell>
                      <TableCell className="muted">{a.postalCode || '—'}</TableCell>
                      <TableCell>{a.phone || '—'}</TableCell>
                      <TableCell className="muted">{a.email || '—'}</TableCell>
                      <TableCell>{a.isDefault ? <Badge variant="info" dot>Utama</Badge> : null}</TableCell>
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
          {editingId ? 'Edit alamat' : 'Tambah alamat'}
        </legend>

        <PartnerAddressFormFields
          draft={draft}
          setD={setD}
          setDraft={setDraft}
          initialLabels={initialLabels}
          provinceLoader={provinceLoader}
          cityLoader={cityLoader}
          areaLoader={areaLoader}
          subAreaLoader={subAreaLoader}
          loadCountryOptions={loadCountryOptions}
        />

        <div className="flex items-end justify-end gap-2">
          {editingId && (
            <button type="button" className="btn ghost" onClick={handleCancelEdit} disabled={saving}>
              Batal
            </button>
          )}
          <button type="button" className="btn primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Menyimpan…' : editingId ? 'Simpan' : 'Tambah alamat'}
          </button>
        </div>
      </fieldset>
    </div>
  );
}
