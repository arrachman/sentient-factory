'use client';

/**
 * Item create/edit form — types, defaults, adapters, validation.
 * The sectioned 2-column UI lives in ./items-form-fields.
 * Atomic tier: Molecule (data) + Organism (UI in sibling file).
 */

import type { ErpItem, CreateItemPayload } from '@/lib/api/items';
import { validateForm, type FormErrors } from '@/lib/form-validation';
import type { ItemFormData } from './items-form-model';

export { ItemFormFields } from './items-form-fields';
export {
  ITEM_TYPES,
  defaultItemForm,
} from './items-form-model';
export type {
  ItemFormData,
  ItemDistributorFormRow,
  ItemWarehouseStockFormRow,
} from './items-form-model';

const refLabel = (r?: { code?: string; name?: string } | null) =>
  r ? (r.code ? `${r.code} — ${r.name ?? ''}` : r.name ?? '') : '';

/** Numeric API fields (Decimal) may arrive as number or string — form state is string. */
const numStr = (v: unknown): string => (v == null ? '' : String(v));

/**
 * Expand the item's sparse price-tier rows into a fixed 10-slot string array
 * (index 0 = level 1). Level-1 price falls back to the denormalized salePrice.
 */
function tierColumn(item: ErpItem, key: 'price' | 'discountPercent'): string[] {
  const byLevel = new Map((item.prices ?? []).map((p) => [p.level, p]));
  return Array.from({ length: 10 }, (_, i) => {
    const tier = byLevel.get(i + 1);
    if (tier) return numStr(tier[key]);
    if (i === 0 && key === 'price') return numStr(item.salePrice ?? item.sellingPrice);
    return '';
  });
}

export function fromItem(item: ErpItem): ItemFormData {
  return {
    code: item.code,
    name: item.name,
    itemType: item.itemType,
    description: item.description ?? '',
    barcode: item.barcode ?? '',
    categoryId: item.categoryId ?? '', categoryLabel: refLabel(item.category),
    unitId: item.unitId ?? '', unitLabel: refLabel(item.unit),
    kindId: item.kindId ?? '', kindLabel: refLabel(item.kind),
    productClassId: item.productClassId ?? '', productClassLabel: refLabel(item.productClass),
    brandId: item.brandId ?? '', brandLabel: refLabel(item.brand),
    materialId: item.materialId ?? '', materialLabel: refLabel(item.material),
    sizeId: item.sizeId ?? '', sizeLabel: refLabel(item.size),
    colorId: item.colorId ?? '', colorLabel: refLabel(item.color),
    sectionId: item.sectionId ?? '', sectionLabel: refLabel(item.section),
    designerId: item.designerId ?? '', designerLabel: refLabel(item.designer),
    nozzleId: item.nozzleId ?? '', nozzleLabel: refLabel(item.nozzle),
    oemId: item.oemId ?? '', oemLabel: refLabel(item.oem),
    vendorId: item.vendorId ?? '', vendorLabel: refLabel(item.vendor),
    fieldUnitId: item.fieldUnitId ?? '', fieldUnitLabel: refLabel(item.fieldUnit),
    fieldUnitConversionFactor: numStr(item.fieldUnit?.conversionFactor) || '1',
    divisionId: item.divisionId ?? '', divisionLabel: refLabel(item.division),
    subdivisionId: item.subdivisionId ?? '', subdivisionLabel: refLabel(item.subdivision),
    departmentId: item.departmentId ?? '', departmentLabel: refLabel(item.department),
    subDepartmentId: item.subDepartmentId ?? '', subDepartmentLabel: refLabel(item.subDepartment),
    branchId: item.branchId ?? '', branchLabel: refLabel(item.branch),
    defaultLocationId: item.defaultLocationId ?? '', defaultLocationLabel: refLabel(item.defaultLocation),
    defaultWarehouseId: item.defaultWarehouseId ?? '', defaultWarehouseLabel: refLabel(item.defaultWarehouse),
    projectId: item.projectId ?? '', projectLabel: refLabel(item.project),
    costCenterId: item.costCenterId ?? '', costCenterLabel: refLabel(item.costCenter),
    standardCost: numStr(item.standardCost),
    averageCost: numStr(item.averageCost),
    purchasePrice: numStr(item.purchasePrice),
    purchaseDiscount: numStr(item.purchaseDiscount),
    salePrices: tierColumn(item, 'price'),
    saleDiscounts: tierColumn(item, 'discountPercent'),
    distributors: (item.distributors ?? []).map((d, i) => ({
      key: `init-${i}`,
      partnerId: d.partnerId, partnerLabel: refLabel(d.partner),
    })),
    others: { ...(item.metadata?.others ?? {}) },
    custom: { ...(item.metadata?.custom ?? {}) },
    minStock: numStr(item.minStock),
    maxStock: numStr(item.maxStock),
    reorderQty: numStr(item.reorderQty),
    minOrderQty: numStr(item.minOrderQty),
    warehouseStocks: (item.warehouseStocks ?? []).map((w, i) => ({
      key: `init-${i}`,
      warehouseId: w.warehouseId, warehouseLabel: refLabel(w.warehouse),
      minStock: numStr(w.minStock),
      maxStock: numStr(w.maxStock),
      minOrderQty: numStr(w.minOrderQty),
    })),
    tracksSerial: item.tracksSerial ?? false,
    tracksBatch: item.tracksBatch ?? false,
    tracksBin: item.tracksBin ?? false,
    inventoryAccountId: item.inventoryAccountId ?? '', inventoryAccountLabel: refLabel(item.inventoryAccount),
    salesAccountId: item.salesAccountId ?? '', salesAccountLabel: refLabel(item.salesAccount),
    cogsAccountId: item.cogsAccountId ?? '', cogsAccountLabel: refLabel(item.cogsAccount),
    salesReturnAccountId: item.salesReturnAccountId ?? '', salesReturnAccountLabel: refLabel(item.salesReturnAccount),
    salesDiscountAccountId: item.salesDiscountAccountId ?? '', salesDiscountAccountLabel: refLabel(item.salesDiscountAccount),
    purchaseReturnAccountId: item.purchaseReturnAccountId ?? '', purchaseReturnAccountLabel: refLabel(item.purchaseReturnAccount),
    purchaseDiscountAccountId: item.purchaseDiscountAccountId ?? '', purchaseDiscountAccountLabel: refLabel(item.purchaseDiscountAccount),
    consignmentAccountId: item.consignmentAccountId ?? '', consignmentAccountLabel: refLabel(item.consignmentAccount),
    purchaseTaxId: item.purchaseTaxId ?? '', purchaseTaxLabel: refLabel(item.purchaseTax),
    saleTaxId: item.saleTaxId ?? '', saleTaxLabel: refLabel(item.saleTax),
    primarySupplierId: item.primarySupplierId ?? '', primarySupplierLabel: refLabel(item.primarySupplier),
    weight: numStr(item.weight),
    length: numStr(item.length),
    width: numStr(item.width),
    height: numStr(item.height),
    volume: numStr(item.volume),
    conversionKgPcs: numStr(item.conversionKgPcs),
    registrationNo: item.registrationNo ?? '',
    isReturnable: item.isReturnable ?? true,
    isMobile: item.isMobile ?? false,
    ageCategory: item.ageCategory ?? '',
    validUntil: item.validUntil ? item.validUntil.slice(0, 10) : '',
    isVatable: item.isVatable ?? true,
    isSpecial: item.isSpecial ?? false,
    isActive: item.isActive,
  };
}

const orUndef = (v: string) => (v.trim() === '' ? undefined : v);
const orNull = (v: string) => (v.trim() === '' ? null : v);

/** Collapse the 10 price/discount slots into sparse tier rows (skip fully-empty levels). */
function buildPriceTiers(f: ItemFormData): { level: number; price?: string; discountPercent?: string }[] {
  const rows: { level: number; price?: string; discountPercent?: string }[] = [];
  for (let i = 0; i < 10; i += 1) {
    const price = orUndef(f.salePrices[i] ?? '');
    const discountPercent = orUndef(f.saleDiscounts[i] ?? '');
    if (price !== undefined || discountPercent !== undefined) {
      rows.push({ level: i + 1, price, discountPercent });
    }
  }
  return rows;
}

export function toItemPayload(f: ItemFormData): CreateItemPayload {
  return {
    code: f.code,
    name: f.name,
    itemType: f.itemType,
    categoryId: f.categoryId,
    unitId: f.unitId,
    description: orUndef(f.description),
    barcode: orUndef(f.barcode),
    kindId: orNull(f.kindId),
    productClassId: orNull(f.productClassId),
    brandId: orNull(f.brandId),
    materialId: orNull(f.materialId),
    sizeId: orNull(f.sizeId),
    colorId: orNull(f.colorId),
    sectionId: orNull(f.sectionId),
    designerId: orNull(f.designerId),
    nozzleId: orNull(f.nozzleId),
    oemId: orNull(f.oemId),
    vendorId: orNull(f.vendorId),
    fieldUnitId: orNull(f.fieldUnitId),
    divisionId: orNull(f.divisionId),
    subdivisionId: orNull(f.subdivisionId),
    departmentId: orNull(f.departmentId),
    subDepartmentId: orNull(f.subDepartmentId),
    branchId: orNull(f.branchId),
    defaultLocationId: orNull(f.defaultLocationId),
    defaultWarehouseId: orNull(f.defaultWarehouseId),
    projectId: orNull(f.projectId),
    costCenterId: orNull(f.costCenterId),
    standardCost: orUndef(f.standardCost),
    purchasePrice: orUndef(f.purchasePrice),
    purchaseDiscount: orUndef(f.purchaseDiscount),
    salePrice: orUndef(f.salePrices[0]), // level 1 mirror (denormalized cache)
    prices: buildPriceTiers(f),
    distributors: f.distributors
      .filter((d) => d.partnerId !== '')
      .map((d) => ({ partnerId: d.partnerId })),
    others: f.others,
    custom: f.custom,
    minStock: orUndef(f.minStock),
    maxStock: orUndef(f.maxStock),
    reorderQty: orUndef(f.reorderQty),
    minOrderQty: orUndef(f.minOrderQty),
    warehouseStocks: f.warehouseStocks
      .filter((w) => w.warehouseId !== ''
        && (w.minStock.trim() !== '' || w.maxStock.trim() !== '' || w.minOrderQty.trim() !== ''))
      .map((w) => ({
        warehouseId: w.warehouseId,
        minStock: orUndef(w.minStock),
        maxStock: orUndef(w.maxStock),
        minOrderQty: orUndef(w.minOrderQty),
      })),
    tracksSerial: f.tracksSerial,
    tracksBatch: f.tracksBatch,
    tracksBin: f.tracksBin,
    inventoryAccountId: orNull(f.inventoryAccountId),
    salesAccountId: orNull(f.salesAccountId),
    cogsAccountId: orNull(f.cogsAccountId),
    salesReturnAccountId: orNull(f.salesReturnAccountId),
    salesDiscountAccountId: orNull(f.salesDiscountAccountId),
    purchaseReturnAccountId: orNull(f.purchaseReturnAccountId),
    purchaseDiscountAccountId: orNull(f.purchaseDiscountAccountId),
    consignmentAccountId: orNull(f.consignmentAccountId),
    purchaseTaxId: orNull(f.purchaseTaxId),
    saleTaxId: orNull(f.saleTaxId),
    primarySupplierId: orNull(f.primarySupplierId),
    weight: orUndef(f.weight),
    length: orUndef(f.length),
    width: orUndef(f.width),
    height: orUndef(f.height),
    volume: orUndef(f.volume),
    conversionKgPcs: orUndef(f.conversionKgPcs),
    registrationNo: orNull(f.registrationNo),
    isReturnable: f.isReturnable,
    isMobile: f.isMobile,
    ageCategory: orNull(f.ageCategory),
    validUntil: orNull(f.validUntil),
    isVatable: f.isVatable,
    isSpecial: f.isSpecial,
    isActive: f.isActive,
  };
}

/** Akun GL wajib diisi hanya saat tipe INVENTORY (track stok + HPP, paritas legacy). */
export const REQUIRED_INVENTORY_ACCOUNTS: { field: keyof ItemFormData; label: string }[] = [
  { field: 'inventoryAccountId', label: 'Akun Persediaan' },
  { field: 'salesAccountId', label: 'Akun Penjualan' },
  { field: 'salesReturnAccountId', label: 'Akun Retur Penjualan' },
  { field: 'salesDiscountAccountId', label: 'Akun Diskon Penjualan' },
  { field: 'cogsAccountId', label: 'Akun HPP' },
  { field: 'purchaseReturnAccountId', label: 'Akun Retur Pembelian' },
  { field: 'purchaseDiscountAccountId', label: 'Akun Diskon Pembelian' },
  { field: 'consignmentAccountId', label: 'Akun Konsinyasi' },
];

const requiredWhenInventory = (label: string) =>
  (value: ItemFormData[keyof ItemFormData], form: ItemFormData) =>
    form.itemType === 'INVENTORY' && (value === '' || value == null)
      ? `${label} wajib diisi untuk item Inventory`
      : undefined;

export const validateItem = (form: ItemFormData): FormErrors<ItemFormData> =>
  validateForm(form, [
    { field: 'code', label: 'Kode', required: true },
    { field: 'name', label: 'Nama', required: true },
    { field: 'categoryId', label: 'Kategori', required: true },
    { field: 'unitId', label: 'Satuan', required: true },
    ...REQUIRED_INVENTORY_ACCOUNTS.map(({ field, label }) => ({
      field, label, validate: requiredWhenInventory(label),
    })),
  ]);
