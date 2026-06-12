'use client';

/**
 * Item form "Atribut" section (legacy MyERP+ "Atribut" tab parity), grouped
 * best-practice into three sub-sections: Dimensi & Berat · Klasifikasi Produk ·
 * Penanganan & Regulasi. Lookups reuse existing masters (Warna/Merk/Ukuran/
 * Material/Section/Desainer), the two new masters (Nozzle/OEM), partners
 * (Vendor) and units (Satuan Jual Default + faktor konversi). Atomic tier: Organism.
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import type { ItemFormData } from './items-form';
import { Section, LookupField, NumField, YesNoField } from './items-form-parts';
import {
  loadColorOptions, loadBrandOptions, loadSizeOptions, loadMaterialOptions,
  loadSectionOptions, loadDesignerOptions, loadNozzleOptions, loadOemOptions,
  loadPartnerOptions, loadUnitOptions,
} from './items-form-lookups';

export function ItemAtributSection({
  data, onChange,
}: { data: ItemFormData; onChange: (d: ItemFormData) => void }) {
  const set = (k: keyof ItemFormData, v: string | boolean) => onChange({ ...data, [k]: v });

  return (
    <>
      <Section title="Dimensi & Berat" hint="Ukuran fisik & konversi (paritas MyERP+)">
        <NumField id="if-length" label="Panjang" value={data.length} onChange={(v) => set('length', v)} />
        <NumField id="if-width" label="Lebar" value={data.width} onChange={(v) => set('width', v)} />
        <NumField id="if-height" label="Tinggi" value={data.height} onChange={(v) => set('height', v)} />
        <NumField id="if-volume" label="Volume" value={data.volume} onChange={(v) => set('volume', v)} />
        <NumField id="if-weight" label="Berat (kg)" value={data.weight} onChange={(v) => set('weight', v)} />
        <NumField id="if-convkg" label="Konversi Kg/Pcs" value={data.conversionKgPcs} onChange={(v) => set('conversionKgPcs', v)} placeholder="1" help="Faktor konversi Kg ke Pcs" />
      </Section>

      <Section title="Klasifikasi Produk" hint="Atribut katalog (master data)">
        <LookupField id="if-color" label="Warna" value={data.colorId} onPick={(v) => set('colorId', v)} loader={loadColorOptions} placeholder="Pilih warna…" initialLabel={data.colorLabel} />
        <LookupField id="if-brand" label="Merk" value={data.brandId} onPick={(v) => set('brandId', v)} loader={loadBrandOptions} placeholder="Pilih merk…" initialLabel={data.brandLabel} />
        <LookupField id="if-size" label="Ukuran" value={data.sizeId} onPick={(v) => set('sizeId', v)} loader={loadSizeOptions} placeholder="Pilih ukuran…" initialLabel={data.sizeLabel} />
        <LookupField id="if-material" label="Material" value={data.materialId} onPick={(v) => set('materialId', v)} loader={loadMaterialOptions} placeholder="Pilih material…" initialLabel={data.materialLabel} />
        <LookupField id="if-section" label="Section" value={data.sectionId} onPick={(v) => set('sectionId', v)} loader={loadSectionOptions} placeholder="Pilih section…" initialLabel={data.sectionLabel} />
        <LookupField id="if-designer" label="Desainer" value={data.designerId} onPick={(v) => set('designerId', v)} loader={loadDesignerOptions} placeholder="Pilih desainer…" initialLabel={data.designerLabel} />
        <LookupField id="if-nozzle" label="Nozzle" value={data.nozzleId} onPick={(v) => set('nozzleId', v)} loader={loadNozzleOptions} placeholder="Pilih nozzle…" initialLabel={data.nozzleLabel} />
        <LookupField id="if-oem" label="OEM" value={data.oemId} onPick={(v) => set('oemId', v)} loader={loadOemOptions} placeholder="Pilih OEM…" initialLabel={data.oemLabel} />
        <LookupField id="if-vendor" label="Vendor" value={data.vendorId} onPick={(v) => set('vendorId', v)} loader={loadPartnerOptions} placeholder="Pilih vendor…" initialLabel={data.vendorLabel} />
      </Section>

      <Section title="Penanganan & Regulasi" hint="Satuan jual default, izin edar & flag operasional">
        <LookupField id="if-fieldunit" label="Satuan Jual Default" value={data.fieldUnitId} onPick={(v) => set('fieldUnitId', v)} loader={loadUnitOptions} placeholder="Pilih satuan…" initialLabel={data.fieldUnitLabel} />
        <NumField id="if-fieldunit-factor" label="Faktor Konversi Satuan Jual" value={data.fieldUnitFactor} onChange={(v) => set('fieldUnitFactor', v)} placeholder="1" help="1 satuan jual = N satuan dasar (mis. 1 kwintal = 100 kg)" />
        <FormField label="No. Ijin Edar" htmlFor="if-regno">
          <Input id="if-regno" value={data.registrationNo} onChange={(e) => set('registrationNo', e.target.value)} placeholder="Opsional" />
        </FormField>
        <YesNoField id="if-returnable" label="Retur" value={data.isReturnable} onChange={(v) => set('isReturnable', v)} help="Item dapat diretur" />
        <YesNoField id="if-mobile" label="Mobile" value={data.isMobile} onChange={(v) => set('isMobile', v)} help="Tersedia di aplikasi mobile" />
      </Section>
    </>
  );
}
