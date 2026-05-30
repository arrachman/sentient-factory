'use client';

/**
 * Item create/edit form — types, defaults, adapters, validation.
 * The sectioned 2-column UI lives in ./items-form-fields.
 * Atomic tier: Molecule (data) + Organism (UI in sibling file).
 */

import type { ErpItem, ErpItemType, ErpCostingMethod, CreateItemPayload } from '@/lib/api/items';
import { validateForm, type FormErrors } from '@/lib/form-validation';

export { ItemFormFields } from './items-form-fields';

export const ITEM_TYPES: ErpItemType[] = ['INVENTORY', 'SERVICE', 'CONSUMABLE', 'ASSET', 'NON_INVENTORY'];

/** One row in the "Lokasi" section (legacy Gudang + Lokasi). `key` is a stable
 *  client id so SearchSelect display state survives row add/remove (not sent). */
export interface ItemLocationFormRow {
  key: string;
  warehouseId: string; warehouseLabel?: string;
  locationId: string; locationLabel?: string;
}
export const COST_METHODS: { value: ErpCostingMethod; label: string }[] = [
  { value: 'AVG', label: 'Average' },
  { value: 'FIFO', label: 'FIFO' },
  { value: 'STD', label: 'Standard' },
];

export interface ItemFormData {
  code: string;
  name: string;
  itemType: ErpItemType;
  costMethod: ErpCostingMethod;
  description: string;
  barcode: string;

  // Classification lookups (id + label for edit-mode display)
  categoryId: string; categoryLabel?: string;
  unitId: string; unitLabel?: string;
  kindId: string; kindLabel?: string;
  productClassId: string; productClassLabel?: string;

  // GL / org dimensions
  divisionId: string; divisionLabel?: string;
  subdivisionId: string; subdivisionLabel?: string;
  departmentId: string; departmentLabel?: string;
  subDepartmentId: string; subDepartmentLabel?: string;
  branchId: string; branchLabel?: string;
  defaultLocationId: string; defaultLocationLabel?: string;
  defaultWarehouseId: string; defaultWarehouseLabel?: string;
  projectId: string; projectLabel?: string;
  costCenterId: string; costCenterLabel?: string;

  // Costs & prices
  standardCost: string;       // "Hpp Update" (manual HPP)
  averageCost: string;        // "Hpp rata-rata" (computed, readonly — display only)
  purchasePrice: string;      // "Harga Beli Terakhir"
  purchaseDiscount: string;   // "Diskon Pembelian" (percent)
  salePrices: string[];       // "Harga Jual 1..10" (index 0 = level 1)
  saleDiscounts: string[];    // "Diskon Jual 1..10" (index 0 = level 1)

  // Storage placements ("Lokasi" tab: Gudang + Lokasi per row)
  locations: ItemLocationFormRow[];

  // Stock
  minStock: string;
  maxStock: string;
  reorderQty: string;
  minOrderQty: string;
  tracksSerial: boolean;
  tracksBatch: boolean;
  tracksBin: boolean;

  // Accounts & tax
  inventoryAccountId: string; inventoryAccountLabel?: string;
  salesAccountId: string; salesAccountLabel?: string;
  cogsAccountId: string; cogsAccountLabel?: string;
  salesReturnAccountId: string; salesReturnAccountLabel?: string;
  salesDiscountAccountId: string; salesDiscountAccountLabel?: string;
  purchaseReturnAccountId: string; purchaseReturnAccountLabel?: string;
  purchaseDiscountAccountId: string; purchaseDiscountAccountLabel?: string;
  consignmentAccountId: string; consignmentAccountLabel?: string;
  purchaseTaxId: string; purchaseTaxLabel?: string;
  saleTaxId: string; saleTaxLabel?: string;

  // Supplier & physical
  primarySupplierId: string; primarySupplierLabel?: string;
  weight: string;

  // Validity & flags
  ageCategory: string;
  validUntil: string;
  isVatable: boolean;
  isSpecial: boolean;
  isActive: boolean;
}

export const defaultItemForm = (): ItemFormData => ({
  code: '', name: '', itemType: 'INVENTORY', costMethod: 'AVG', description: '', barcode: '',
  categoryId: '', unitId: '', kindId: '', productClassId: '',
  divisionId: '', subdivisionId: '', departmentId: '', subDepartmentId: '',
  branchId: '', defaultLocationId: '', defaultWarehouseId: '', projectId: '', costCenterId: '',
  standardCost: '', averageCost: '', purchasePrice: '', purchaseDiscount: '',
  salePrices: Array<string>(10).fill(''), saleDiscounts: Array<string>(10).fill(''),
  locations: [],
  minStock: '', maxStock: '', reorderQty: '', minOrderQty: '',
  tracksSerial: false, tracksBatch: false, tracksBin: false,
  inventoryAccountId: '', salesAccountId: '', cogsAccountId: '',
  salesReturnAccountId: '', salesDiscountAccountId: '',
  purchaseReturnAccountId: '', purchaseDiscountAccountId: '', consignmentAccountId: '',
  purchaseTaxId: '', saleTaxId: '',
  primarySupplierId: '', weight: '',
  ageCategory: '', validUntil: '', isVatable: true, isSpecial: false, isActive: true,
});

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
    costMethod: item.costMethod ?? 'AVG',
    description: item.description ?? '',
    barcode: item.barcode ?? '',
    categoryId: item.categoryId ?? '', categoryLabel: refLabel(item.category),
    unitId: item.unitId ?? '', unitLabel: refLabel(item.unit),
    kindId: item.kindId ?? '', kindLabel: refLabel(item.kind),
    productClassId: item.productClassId ?? '', productClassLabel: refLabel(item.productClass),
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
    locations: (item.locations ?? []).map((l, i) => ({
      key: `init-${i}`,
      warehouseId: l.warehouseId, warehouseLabel: refLabel(l.warehouse),
      locationId: l.locationId, locationLabel: refLabel(l.location),
    })),
    minStock: numStr(item.minStock),
    maxStock: numStr(item.maxStock),
    reorderQty: numStr(item.reorderQty),
    minOrderQty: numStr(item.minOrderQty),
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
    costMethod: f.costMethod,
    categoryId: f.categoryId,
    unitId: f.unitId,
    description: orUndef(f.description),
    barcode: orUndef(f.barcode),
    kindId: orNull(f.kindId),
    productClassId: orNull(f.productClassId),
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
    locations: f.locations
      .filter((l) => l.warehouseId !== '' && l.locationId !== '')
      .map((l) => ({ warehouseId: l.warehouseId, locationId: l.locationId })),
    minStock: orUndef(f.minStock),
    maxStock: orUndef(f.maxStock),
    reorderQty: orUndef(f.reorderQty),
    minOrderQty: orUndef(f.minOrderQty),
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
