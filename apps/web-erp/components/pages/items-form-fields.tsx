'use client';

/**
 * Item form UI. Dua mode entry:
 *  - Cepat: hanya section Identitas + Klasifikasi (untuk tambah cepat).
 *  - Lengkap: side-nav layout, satu section terlihat saat ini, navigasi
 *    via list di kiri. Default: Cepat untuk item baru, Lengkap untuk edit.
 *
 * Section: Identitas · Klasifikasi · Inventory (conditional) · Harga ·
 * Pajak · Akuntansi · Dimensi GL · Supplier · Catatan.
 * Data shape + adapters di ./items-form. Atomic tier: Organism.
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BooleanRadio } from '@/components/ui/radio-group';
import type { FormErrors } from '@/lib/form-validation';
import { generateNextItemCode, nextCodePreview } from '@/lib/items-code-generator';
import type { ItemFormData } from './items-form';
import { ITEM_TYPES, COST_METHODS } from './items-form';
import { Section, LookupField, NumField, YesNoField, isStockable, showsWeight } from './items-form-parts';
import {
  loadCategoryOptions, loadUnitOptions, loadKindOptions, loadProductClassOptions,
  loadDivisionOptions, loadSubDivisionOptions, loadDepartmentOptions, loadSubDepartmentOptions,
  loadBranchOptions, loadLocationOptions, loadWarehouseOptions, loadProjectOptions,
  loadCostCenterOptions, loadAccountOptions, loadTaxOptions, loadPartnerOptions,
} from './items-form-lookups';

type Mode = 'cepat' | 'lengkap';
type SectionId = 'identitas' | 'klasifikasi' | 'inventory' | 'harga' | 'pajak' | 'akuntansi' | 'dimensi' | 'supplier' | 'catatan';

const CEPAT_SECTIONS: SectionId[] = ['identitas', 'klasifikasi'];

export function ItemFormFields({
  data, onChange, errors = {},
}: { data: ItemFormData; onChange: (d: ItemFormData) => void; errors?: FormErrors<ItemFormData> }) {
  const set = (k: keyof ItemFormData, v: string | boolean) => onChange({ ...data, [k]: v });

  // Mode default: Cepat untuk item baru (kode kosong) = quick-add; Lengkap untuk edit.
  const [mode, setMode] = React.useState<Mode>(() => (data.code ? 'lengkap' : 'cepat'));
  const [activeSection, setActiveSection] = React.useState<SectionId>('identitas');

  const [generating, setGenerating] = React.useState(false);
  const handleAutoCode = async () => {
    setGenerating(true);
    try { set('code', await generateNextItemCode(data.itemType)); }
    finally { setGenerating(false); }
  };

  const sections: { id: SectionId; label: string; available: boolean; hasError: boolean }[] = [
    { id: 'identitas', label: 'Identitas', available: true, hasError: !!(errors.code || errors.name) },
    { id: 'klasifikasi', label: 'Klasifikasi', available: true, hasError: !!(errors.categoryId || errors.unitId) },
    { id: 'inventory', label: 'Inventory & Tracking', available: isStockable(data.itemType), hasError: false },
    { id: 'harga', label: 'Harga', available: true, hasError: false },
    { id: 'pajak', label: 'Pajak', available: true, hasError: false },
    { id: 'akuntansi', label: 'Akuntansi', available: true, hasError: false },
    { id: 'dimensi', label: 'Dimensi GL', available: true, hasError: false },
    { id: 'supplier', label: 'Supplier', available: true, hasError: false },
    { id: 'catatan', label: 'Catatan', available: true, hasError: false },
  ];

  const renderIdentitas = () => (
    <Section title="Identitas">
      <FormField label="Kode" htmlFor="if-code" required error={errors.code}>
        <div className="flex w-full items-center gap-1.5">
          <Input id="if-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder={nextCodePreview(data.itemType)} aria-invalid={!!errors.code} />
          <button type="button" onClick={handleAutoCode} disabled={generating} className="shrink-0 rounded-[var(--radius)] border border-border bg-[var(--panel-2)] px-2 py-1 text-[11px] font-medium hover:bg-[var(--panel-hover)] disabled:opacity-50" title={`Isi otomatis (${nextCodePreview(data.itemType)})`}>
            {generating ? '…' : 'Auto'}
          </button>
        </div>
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
  );

  const renderKlasifikasi = () => (
    <Section title="Klasifikasi" hint="Tipe menentukan field yang muncul">
      <FormField label="Tipe" htmlFor="if-type" required help="INVENTORY/CONSUMABLE/ASSET = stok fisik. SERVICE = jasa. NON_INVENTORY = non-stok.">
        <Select value={data.itemType} onValueChange={(v) => set('itemType', v)}>
          <SelectTrigger id="if-type"><SelectValue /></SelectTrigger>
          <SelectContent>{ITEM_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
        </Select>
      </FormField>
      <FormField label="Metode HPP" htmlFor="if-hpp" required help="Rumus penghitungan harga pokok saat keluar stok">
        <Select value={data.costMethod} onValueChange={(v) => set('costMethod', v)}>
          <SelectTrigger id="if-hpp"><SelectValue /></SelectTrigger>
          <SelectContent>{COST_METHODS.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
        </Select>
      </FormField>
      <LookupField id="if-cat" label="Kategori" value={data.categoryId} onPick={(v) => set('categoryId', v)} loader={loadCategoryOptions} placeholder="Pilih kategori…" required initialLabel={data.categoryLabel} error={!!errors.categoryId} />
      <LookupField id="if-unit" label="Satuan" value={data.unitId} onPick={(v) => set('unitId', v)} loader={loadUnitOptions} placeholder="Pilih satuan…" required initialLabel={data.unitLabel} error={!!errors.unitId} />
      <LookupField id="if-kind" label="Jenis Barang" value={data.kindId} onPick={(v) => set('kindId', v)} loader={loadKindOptions} placeholder="Pilih jenis…" initialLabel={data.kindLabel} />
      <LookupField id="if-pclass" label="Kelas Produk" value={data.productClassId} onPick={(v) => set('productClassId', v)} loader={loadProductClassOptions} placeholder="Pilih kelas…" initialLabel={data.productClassLabel} />
      {showsWeight(data.itemType) && <NumField id="if-weight" label="Berat (kg)" value={data.weight} onChange={(v) => set('weight', v)} />}
    </Section>
  );

  const renderInventory = () => (
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
  );

  const renderHarga = () => (
    <Section title="Harga">
      <NumField id="if-stdcost" label="Harga Standar" value={data.standardCost} onChange={(v) => set('standardCost', v)} />
      <NumField id="if-buy" label="Harga Beli" value={data.purchasePrice} onChange={(v) => set('purchasePrice', v)} />
      <NumField id="if-sell" label="Harga Jual" value={data.salePrice} onChange={(v) => set('salePrice', v)} />
      <FormField label="Harga berlaku s.d" htmlFor="if-valid" help="Setelah tanggal ini, harga jual perlu di-review">
        <Input id="if-valid" type="date" value={data.validUntil} onChange={(e) => set('validUntil', e.target.value)} />
      </FormField>
    </Section>
  );

  const renderPajak = () => (
    <Section title="Pajak">
      <YesNoField id="if-vat" label="BKP (Kena PPN)" value={data.isVatable} onChange={(v) => set('isVatable', v)} help="Kena PPN saat transaksi beli/jual" />
      <LookupField id="if-buytax" label="Pajak Beli" value={data.purchaseTaxId} onPick={(v) => set('purchaseTaxId', v)} loader={loadTaxOptions} placeholder="Pilih pajak…" initialLabel={data.purchaseTaxLabel} />
      <LookupField id="if-selltax" label="Pajak Jual" value={data.saleTaxId} onPick={(v) => set('saleTaxId', v)} loader={loadTaxOptions} placeholder="Pilih pajak…" initialLabel={data.saleTaxLabel} />
    </Section>
  );

  const renderAkuntansi = () => (
    <Section title="Akuntansi">
      <LookupField id="if-acc-inv" label="Akun Persediaan" value={data.inventoryAccountId} onPick={(v) => set('inventoryAccountId', v)} loader={loadAccountOptions} placeholder="Pilih akun…" initialLabel={data.inventoryAccountLabel} />
      <LookupField id="if-acc-sales" label="Akun Penjualan" value={data.salesAccountId} onPick={(v) => set('salesAccountId', v)} loader={loadAccountOptions} placeholder="Pilih akun…" initialLabel={data.salesAccountLabel} />
      <LookupField id="if-acc-cogs" label="Akun HPP" value={data.cogsAccountId} onPick={(v) => set('cogsAccountId', v)} loader={loadAccountOptions} placeholder="Pilih akun…" initialLabel={data.cogsAccountLabel} />
    </Section>
  );

  const renderDimensi = () => (
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
  );

  const renderSupplier = () => (
    <Section title="Supplier">
      <LookupField id="if-supplier" label="Supplier Utama" value={data.primarySupplierId} onPick={(v) => set('primarySupplierId', v)} loader={loadPartnerOptions} placeholder="Pilih supplier…" initialLabel={data.primarySupplierLabel} />
    </Section>
  );

  const renderCatatan = () => (
    <Section title="Catatan">
      <FormField label="Deskripsi" htmlFor="if-desc" className="col-span-2 grid-cols-[110px_1fr]">
        <Input id="if-desc" value={data.description} onChange={(e) => set('description', e.target.value)} placeholder="Opsional" />
      </FormField>
    </Section>
  );

  const renderById: Record<SectionId, () => React.ReactElement> = {
    identitas: renderIdentitas, klasifikasi: renderKlasifikasi, inventory: renderInventory,
    harga: renderHarga, pajak: renderPajak, akuntansi: renderAkuntansi,
    dimensi: renderDimensi, supplier: renderSupplier, catatan: renderCatatan,
  };

  const modeToggle = (
    <div className="flex items-center gap-2 border-b border-border bg-[var(--panel-2)] px-5 py-1.5">
      <span className="text-[11px] uppercase tracking-wide text-[var(--fg-subtle)]">Mode entri</span>
      <div className="ml-auto inline-flex overflow-hidden rounded-[var(--radius)] border border-border">
        <button type="button" onClick={() => setMode('cepat')} className={`px-3 py-0.5 text-[11px] font-medium transition-colors ${mode === 'cepat' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground hover:bg-[var(--panel-hover)]'}`} title="Hanya field wajib (Identitas + Klasifikasi)">Cepat</button>
        <button type="button" onClick={() => setMode('lengkap')} className={`border-l border-border px-3 py-0.5 text-[11px] font-medium transition-colors ${mode === 'lengkap' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground hover:bg-[var(--panel-hover)]'}`} title="Semua field, navigasi via side-nav">Lengkap</button>
      </div>
    </div>
  );

  if (mode === 'cepat') {
    return (
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(86vh - 120px)' }}>
        {modeToggle}
        {CEPAT_SECTIONS.map((id) => sections.find(s => s.id === id)?.available && <React.Fragment key={id}>{renderById[id]()}</React.Fragment>)}
      </div>
    );
  }

  // Lengkap mode: side-nav layout.
  const availableSections = sections.filter(s => s.available);
  const active = availableSections.find(s => s.id === activeSection) ?? availableSections[0];
  return (
    <div className="flex flex-col" style={{ maxHeight: 'calc(86vh - 120px)' }}>
      {modeToggle}
      <div className="flex min-h-0 flex-1">
        <nav className="w-[200px] shrink-0 overflow-y-auto border-r border-border bg-[var(--panel-2)] py-2" aria-label="Navigasi section form">
          {availableSections.map((s) => (
            <button key={s.id} type="button" onClick={() => setActiveSection(s.id)} className={`flex w-full items-center justify-between px-4 py-1.5 text-left text-xs transition-colors ${active?.id === s.id ? 'bg-card font-medium text-foreground' : 'text-[var(--fg-muted)] hover:bg-[var(--panel-hover)]'}`}>
              <span>{s.label}</span>
              {s.hasError && <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-danger" aria-label="Ada error" />}
            </button>
          ))}
        </nav>
        <div className="flex-1 overflow-y-auto">
          {active && renderById[active.id]()}
        </div>
      </div>
    </div>
  );
}
