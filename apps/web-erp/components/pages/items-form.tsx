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
  standardCost: string;
  purchasePrice: string;
  salePrice: string;

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
  standardCost: '', purchasePrice: '', salePrice: '',
  minStock: '', maxStock: '', reorderQty: '', minOrderQty: '',
  tracksSerial: false, tracksBatch: false, tracksBin: false,
  inventoryAccountId: '', salesAccountId: '', cogsAccountId: '',
  purchaseTaxId: '', saleTaxId: '',
  primarySupplierId: '', weight: '',
  ageCategory: '', validUntil: '', isVatable: true, isSpecial: false, isActive: true,
});

const refLabel = (r?: { code?: string; name?: string } | null) =>
  r ? (r.code ? `${r.code} — ${r.name ?? ''}` : r.name ?? '') : '';

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
    standardCost: item.standardCost ?? '',
    purchasePrice: item.purchasePrice ?? '',
    salePrice: item.salePrice ?? item.sellingPrice ?? '',
    minStock: item.minStock ?? '',
    maxStock: item.maxStock ?? '',
    reorderQty: item.reorderQty ?? '',
    minOrderQty: item.minOrderQty ?? '',
    tracksSerial: item.tracksSerial ?? false,
    tracksBatch: item.tracksBatch ?? false,
    tracksBin: item.tracksBin ?? false,
    inventoryAccountId: item.inventoryAccountId ?? '', inventoryAccountLabel: refLabel(item.inventoryAccount),
    salesAccountId: item.salesAccountId ?? '', salesAccountLabel: refLabel(item.salesAccount),
    cogsAccountId: item.cogsAccountId ?? '', cogsAccountLabel: refLabel(item.cogsAccount),
    purchaseTaxId: item.purchaseTaxId ?? '', purchaseTaxLabel: refLabel(item.purchaseTax),
    saleTaxId: item.saleTaxId ?? '', saleTaxLabel: refLabel(item.saleTax),
    primarySupplierId: item.primarySupplierId ?? '', primarySupplierLabel: refLabel(item.primarySupplier),
    weight: item.weight ?? '',
    ageCategory: item.ageCategory ?? '',
    validUntil: item.validUntil ? item.validUntil.slice(0, 10) : '',
    isVatable: item.isVatable ?? true,
    isSpecial: item.isSpecial ?? false,
    isActive: item.isActive,
  };
}

const orUndef = (v: string) => (v.trim() === '' ? undefined : v);
const orNull = (v: string) => (v.trim() === '' ? null : v);

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
    salePrice: orUndef(f.salePrice),
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

export const validateItem = (form: ItemFormData): FormErrors<ItemFormData> =>
  validateForm(form, [
    { field: 'code', label: 'Kode', required: true },
    { field: 'name', label: 'Nama', required: true },
    { field: 'categoryId', label: 'Kategori', required: true },
    { field: 'unitId', label: 'Satuan', required: true },
  ]);
