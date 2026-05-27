'use client';

/**
 * Item form UI — compact sectioned 2-column layout inside an lg modal.
 * Sections: Identitas · Klasifikasi · Inventory & Tracking (conditional) ·
 * Harga · Pajak · Akuntansi · Dimensi GL · Supplier · Catatan.
 * Data shape + adapters live in ./items-form. Atomic tier: Organism.
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { BooleanRadio } from '@/components/ui/radio-group';
import { SearchSelect } from '@/components/molecules/search-select';
import type { FormErrors } from '@/lib/form-validation';
import type { ErpItemType } from '@/lib/api/items';
import type { ItemFormData } from './items-form';
import { ITEM_TYPES, COST_METHODS } from './items-form';

// Visibility rules per item type — sembunyikan field yang tidak relevan.
// INVENTORY/CONSUMABLE/ASSET = barang fisik → tampilkan stok & tracking.
// SERVICE = jasa, tanpa fisik → sembunyikan stok/tracking & berat.
// NON_INVENTORY = barang non-stok (mis. fee, biaya) → sembunyikan stok/tracking.
const isStockable = (t: ErpItemType) =>
  t === 'INVENTORY' || t === 'CONSUMABLE' || t === 'ASSET';
const showsWeight = (t: ErpItemType) => t !== 'SERVICE';
import {
  loadCategoryOptions, loadUnitOptions, loadKindOptions, loadProductClassOptions,
  loadDivisionOptions, loadSubDivisionOptions, loadDepartmentOptions, loadSubDepartmentOptions,
  loadBranchOptions, loadLocationOptions, loadWarehouseOptions, loadProjectOptions,
  loadCostCenterOptions, loadAccountOptions, loadTaxOptions, loadPartnerOptions,
} from './items-form-lookups';

type Loader = (s: string, p: number, l: number) => Promise<{ data: { value: string; label: string; code?: string }[]; total: number }>;

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border first:border-t-0">
      <header className="flex items-baseline gap-2 bg-[var(--panel-2)] px-5 py-1.5">
        <h4 className="text-[11px] font-semibold uppercase tracking-wide text-foreground">
          {title}
        </h4>
        {hint && <span className="text-[11px] text-[var(--fg-subtle)]">— {hint}</span>}
      </header>
      <div className="grid grid-cols-2 gap-x-6 gap-y-0 px-5 py-3">{children}</div>
    </section>
  );
}

function LookupField(props: {
  id: string; label: string; value: string; onPick: (v: string) => void;
  loader: Loader; placeholder: string; required?: boolean; initialLabel?: string; error?: boolean;
}) {
  return (
    <FormField label={props.label} htmlFor={props.id} required={props.required} error={props.error ? `${props.label} wajib diisi` : undefined}>
      <SearchSelect
        id={props.id}
        value={props.value}
        onValueChange={props.onPick}
        placeholder={props.placeholder}
        loadOptions={props.loader}
        initialLabel={props.initialLabel}
        title={props.label}
        error={props.error}
      />
    </FormField>
  );
}

function NumField(props: { id: string; label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <FormField label={props.label} htmlFor={props.id}>
      <Input
        id={props.id}
        inputMode="decimal"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder ?? '0'}
        className="text-right tabular-nums"
      />
    </FormField>
  );
}

function YesNoField(props: { id: string; label: string; value: boolean; onChange: (v: boolean) => void; help?: string }) {
  return (
    <FormField label={props.label} htmlFor={props.id} help={props.help}>
      <BooleanRadio id={props.id} value={props.value} onValueChange={props.onChange} trueLabel="Ya" falseLabel="Tidak" />
    </FormField>
  );
}

export function ItemFormFields({
  data, onChange, errors = {},
}: { data: ItemFormData; onChange: (d: ItemFormData) => void; errors?: FormErrors<ItemFormData> }) {
  const set = (k: keyof ItemFormData, v: string | boolean) => onChange({ ...data, [k]: v });

  return (
    <div className="overflow-y-auto" style={{ maxHeight: 'calc(86vh - 120px)' }}>
      <Section title="Identitas">
        <FormField label="Kode" htmlFor="if-code" required error={errors.code}>
          <Input id="if-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder="ITM-001" aria-invalid={!!errors.code} />
        </FormField>
        <FormField label="Nama" htmlFor="if-name" required error={errors.name}>
          <Input id="if-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Baja Plat 2mm" aria-invalid={!!errors.name} />
        </FormField>
        <FormField label="Barcode" htmlFor="if-barcode">
          <Input id="if-barcode" value={data.barcode} onChange={(e) => set('barcode', e.target.value)} placeholder="Opsional" />
        </FormField>
        <FormField label="Status" htmlFor="if-active">
          <BooleanRadio id="if-active" value={data.isActive} onValueChange={(v) => set('isActive', v)} />
        </FormField>
        <YesNoField id="if-special" label="Spesial" value={data.isSpecial} onChange={(v) => set('isSpecial', v)} help="Item khusus, tidak masuk laporan reguler" />
      </Section>

      <Section title="Klasifikasi" hint="Tipe menentukan field yang muncul di bawah">
        <FormField label="Tipe" htmlFor="if-type" required help="INVENTORY/CONSUMABLE/ASSET = stok fisik. SERVICE = jasa. NON_INVENTORY = non-stok.">
          <Select value={data.itemType} onValueChange={(v) => set('itemType', v)}>
            <SelectTrigger id="if-type"><SelectValue /></SelectTrigger>
            <SelectContent>
              {ITEM_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Metode HPP" htmlFor="if-hpp" required help="Rumus penghitungan harga pokok saat keluar stok">
          <Select value={data.costMethod} onValueChange={(v) => set('costMethod', v)}>
            <SelectTrigger id="if-hpp"><SelectValue /></SelectTrigger>
            <SelectContent>
              {COST_METHODS.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>
        <LookupField id="if-cat" label="Kategori" value={data.categoryId} onPick={(v) => set('categoryId', v)} loader={loadCategoryOptions} placeholder="Pilih kategori…" required initialLabel={data.categoryLabel} error={!!errors.categoryId} />
        <LookupField id="if-unit" label="Satuan" value={data.unitId} onPick={(v) => set('unitId', v)} loader={loadUnitOptions} placeholder="Pilih satuan…" required initialLabel={data.unitLabel} error={!!errors.unitId} />
        <LookupField id="if-kind" label="Jenis Barang" value={data.kindId} onPick={(v) => set('kindId', v)} loader={loadKindOptions} placeholder="Pilih jenis…" initialLabel={data.kindLabel} />
        <LookupField id="if-pclass" label="Kelas Produk" value={data.productClassId} onPick={(v) => set('productClassId', v)} loader={loadProductClassOptions} placeholder="Pilih kelas…" initialLabel={data.productClassLabel} />
        {showsWeight(data.itemType) && (
          <NumField id="if-weight" label="Berat (kg)" value={data.weight} onChange={(v) => set('weight', v)} />
        )}
      </Section>

      {isStockable(data.itemType) && (
        <Section title="Inventory & Tracking">
          <NumField id="if-minstock" label="Stok Min" value={data.minStock} onChange={(v) => set('minStock', v)} />
          <NumField id="if-maxstock" label="Stok Maks" value={data.maxStock} onChange={(v) => set('maxStock', v)} />
          <NumField id="if-reorder" label="Jumlah Reorder" value={data.reorderQty} onChange={(v) => set('reorderQty', v)} />
          <NumField id="if-minorder" label="Min Order" value={data.minOrderQty} onChange={(v) => set('minOrderQty', v)} />
          <YesNoField id="if-serial" label="Serial No." value={data.tracksSerial} onChange={(v) => set('tracksSerial', v)} />
          <YesNoField id="if-batch" label="Batch / Lot" value={data.tracksBatch} onChange={(v) => set('tracksBatch', v)} />
          <YesNoField id="if-bin" label="Bin / Rak" value={data.tracksBin} onChange={(v) => set('tracksBin', v)} />
          {data.tracksBatch && (
            <FormField label="Kategori Umur" htmlFor="if-age">
              <Input id="if-age" value={data.ageCategory} onChange={(e) => set('ageCategory', e.target.value)} placeholder="mis. FIFO 30 hari" />
            </FormField>
          )}
        </Section>
      )}

      <Section title="Harga">
        <NumField id="if-stdcost" label="Harga Standar" value={data.standardCost} onChange={(v) => set('standardCost', v)} />
        <NumField id="if-buy" label="Harga Beli" value={data.purchasePrice} onChange={(v) => set('purchasePrice', v)} />
        <NumField id="if-sell" label="Harga Jual" value={data.salePrice} onChange={(v) => set('salePrice', v)} />
        <FormField label="Harga berlaku s.d" htmlFor="if-valid" help="Setelah tanggal ini, harga jual perlu di-review">
          <Input id="if-valid" type="date" value={data.validUntil} onChange={(e) => set('validUntil', e.target.value)} />
        </FormField>
      </Section>

      <Section title="Pajak">
        <YesNoField id="if-vat" label="BKP (Kena PPN)" value={data.isVatable} onChange={(v) => set('isVatable', v)} help="Kena PPN saat transaksi beli/jual" />
        <LookupField id="if-buytax" label="Pajak Beli" value={data.purchaseTaxId} onPick={(v) => set('purchaseTaxId', v)} loader={loadTaxOptions} placeholder="Pilih pajak…" initialLabel={data.purchaseTaxLabel} />
        <LookupField id="if-selltax" label="Pajak Jual" value={data.saleTaxId} onPick={(v) => set('saleTaxId', v)} loader={loadTaxOptions} placeholder="Pilih pajak…" initialLabel={data.saleTaxLabel} />
      </Section>

      <Section title="Akuntansi">
        <LookupField id="if-acc-inv" label="Akun Persediaan" value={data.inventoryAccountId} onPick={(v) => set('inventoryAccountId', v)} loader={loadAccountOptions} placeholder="Pilih akun…" initialLabel={data.inventoryAccountLabel} />
        <LookupField id="if-acc-sales" label="Akun Penjualan" value={data.salesAccountId} onPick={(v) => set('salesAccountId', v)} loader={loadAccountOptions} placeholder="Pilih akun…" initialLabel={data.salesAccountLabel} />
        <LookupField id="if-acc-cogs" label="Akun HPP" value={data.cogsAccountId} onPick={(v) => set('cogsAccountId', v)} loader={loadAccountOptions} placeholder="Pilih akun…" initialLabel={data.cogsAccountLabel} />
      </Section>

      <Section title="Dimensi GL">
        <LookupField id="if-branch" label="Cabang" value={data.branchId} onPick={(v) => set('branchId', v)} loader={loadBranchOptions} placeholder="Pilih cabang…" initialLabel={data.branchLabel} />
        <LookupField id="if-wh" label="Gudang Default" value={data.defaultWarehouseId} onPick={(v) => set('defaultWarehouseId', v)} loader={loadWarehouseOptions} placeholder="Pilih gudang…" initialLabel={data.defaultWarehouseLabel} />
        <LookupField id="if-loc" label="Lokasi Default" value={data.defaultLocationId} onPick={(v) => set('defaultLocationId', v)} loader={loadLocationOptions} placeholder="Pilih lokasi…" initialLabel={data.defaultLocationLabel} />
        <LookupField id="if-div" label="Divisi" value={data.divisionId} onPick={(v) => set('divisionId', v)} loader={loadDivisionOptions} placeholder="Pilih divisi…" initialLabel={data.divisionLabel} />
        <LookupField id="if-subdiv" label="Sub Divisi" value={data.subdivisionId} onPick={(v) => set('subdivisionId', v)} loader={loadSubDivisionOptions} placeholder="Pilih sub divisi…" initialLabel={data.subdivisionLabel} />
        <LookupField id="if-dept" label="Departemen" value={data.departmentId} onPick={(v) => set('departmentId', v)} loader={loadDepartmentOptions} placeholder="Pilih departemen…" initialLabel={data.departmentLabel} />
        <LookupField id="if-subdept" label="Sub Departemen" value={data.subDepartmentId} onPick={(v) => set('subDepartmentId', v)} loader={loadSubDepartmentOptions} placeholder="Pilih sub departemen…" initialLabel={data.subDepartmentLabel} />
        <LookupField id="if-cc" label="Cost Center" value={data.costCenterId} onPick={(v) => set('costCenterId', v)} loader={loadCostCenterOptions} placeholder="Pilih cost center…" initialLabel={data.costCenterLabel} />
        <LookupField id="if-proj" label="Proyek" value={data.projectId} onPick={(v) => set('projectId', v)} loader={loadProjectOptions} placeholder="Pilih proyek…" initialLabel={data.projectLabel} />
      </Section>

      <Section title="Supplier">
        <LookupField id="if-supplier" label="Supplier Utama" value={data.primarySupplierId} onPick={(v) => set('primarySupplierId', v)} loader={loadPartnerOptions} placeholder="Pilih supplier…" initialLabel={data.primarySupplierLabel} />
      </Section>

      <Section title="Catatan">
        <FormField label="Deskripsi" htmlFor="if-desc" className="col-span-2 grid-cols-[110px_1fr]">
          <Input id="if-desc" value={data.description} onChange={(e) => set('description', e.target.value)} placeholder="Opsional" />
        </FormField>
      </Section>
    </div>
  );
}
