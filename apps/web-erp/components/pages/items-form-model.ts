/**
 * Item create/edit form — types, defaults, and static option lists.
 * Adapters (fromItem/toItemPayload/validateItem) live in ./items-form.
 */

import type {
  ErpItemType,
  ItemOthersData, ItemCustomData,
} from '@/lib/api/items';

export const ITEM_TYPES: ErpItemType[] = ['INVENTORY', 'SERVICE', 'CONSUMABLE', 'ASSET', 'NON_INVENTORY'];

/** One row in the "Lokasi" section (legacy Gudang + Lokasi). `key` is a stable
 *  client id so SearchSelect display state survives row add/remove (not sent). */
export interface ItemLocationFormRow {
  key: string;
  warehouseId: string; warehouseLabel?: string;
  locationId: string; locationLabel?: string;
}

/** One row in the "Distributor" section (legacy m1_item_supplier). `key` is a
 *  stable client id so SearchSelect display state survives row add/remove. */
export interface ItemDistributorFormRow {
  key: string;
  partnerId: string; partnerLabel?: string;
}

/** One row in the per-warehouse stock override table (Stok Min/Maks + Min Order
 *  per Gudang). `key` is a stable client id so SearchSelect state survives
 *  row add/remove (not sent to API). */
export interface ItemWarehouseStockFormRow {
  key: string;
  warehouseId: string; warehouseLabel?: string;
  minStock: string;
  maxStock: string;
  minOrderQty: string;
}

/** One row in the "Branch" section (legacy Cabang + Cost Center). `key` is a
 *  stable client id so SearchSelect display state survives row add/remove. */
export interface ItemBranchFormRow {
  key: string;
  branchId: string; branchLabel?: string;
  costCenterId: string; costCenterLabel?: string;
}

export interface ItemFormData {
  code: string;
  name: string;
  itemType: ErpItemType;
  description: string;
  barcode: string;

  // Classification lookups (id + label for edit-mode display)
  categoryId: string; categoryLabel?: string;
  unitId: string; unitLabel?: string;
  kindId: string; kindLabel?: string;
  productClassId: string; productClassLabel?: string;

  // Atribut produk (legacy "Atribut") — id + label for edit-mode display
  brandId: string; brandLabel?: string;
  materialId: string; materialLabel?: string;
  sizeId: string; sizeLabel?: string;
  colorId: string; colorLabel?: string;
  sectionId: string; sectionLabel?: string;
  designerId: string; designerLabel?: string;
  nozzleId: string; nozzleLabel?: string;
  oemId: string; oemLabel?: string;
  vendorId: string; vendorLabel?: string;
  fieldUnitId: string; fieldUnitLabel?: string;
  fieldUnitFactor: string; // 1 satuan jual = N satuan dasar

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

  // Distributors ("Distributor" tab: supplier partner per row)
  distributors: ItemDistributorFormRow[];

  // Branches ("Branch" tab: Cabang + Cost Center per row)
  branches: ItemBranchFormRow[];

  // Lain-lain ("Lain-lain" tab) + Custom ("Custom" tab) → metadata sidecar
  others: ItemOthersData;
  custom: ItemCustomData;

  // Stock (global defaults; per-warehouse overrides in warehouseStocks)
  minStock: string;
  maxStock: string;
  reorderQty: string;
  minOrderQty: string;
  warehouseStocks: ItemWarehouseStockFormRow[];
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

  // Atribut fisik & regulasi (legacy "Atribut")
  length: string;
  width: string;
  height: string;
  volume: string;
  conversionKgPcs: string;
  registrationNo: string;
  isReturnable: boolean;
  isMobile: boolean;

  // Validity & flags
  ageCategory: string;
  validUntil: string;
  isVatable: boolean;
  isSpecial: boolean;
  isActive: boolean;
}

export const defaultItemForm = (): ItemFormData => ({
  code: '', name: '', itemType: 'INVENTORY', description: '', barcode: '',
  categoryId: '', unitId: '', kindId: '', productClassId: '',
  brandId: '', materialId: '', sizeId: '', colorId: '', sectionId: '',
  designerId: '', nozzleId: '', oemId: '', vendorId: '', fieldUnitId: '', fieldUnitFactor: '1',
  divisionId: '', subdivisionId: '', departmentId: '', subDepartmentId: '',
  branchId: '', defaultLocationId: '', defaultWarehouseId: '', projectId: '', costCenterId: '',
  standardCost: '', averageCost: '', purchasePrice: '', purchaseDiscount: '',
  salePrices: Array<string>(10).fill(''), saleDiscounts: Array<string>(10).fill(''),
  locations: [],
  distributors: [],
  branches: [],
  others: {}, custom: {},
  minStock: '', maxStock: '', reorderQty: '', minOrderQty: '',
  warehouseStocks: [],
  tracksSerial: false, tracksBatch: false, tracksBin: false,
  inventoryAccountId: '', salesAccountId: '', cogsAccountId: '',
  salesReturnAccountId: '', salesDiscountAccountId: '',
  purchaseReturnAccountId: '', purchaseDiscountAccountId: '', consignmentAccountId: '',
  purchaseTaxId: '', saleTaxId: '',
  primarySupplierId: '', weight: '',
  length: '', width: '', height: '', volume: '', conversionKgPcs: '1', registrationNo: '',
  isReturnable: true, isMobile: false,
  ageCategory: '', validUntil: '', isVatable: true, isSpecial: false, isActive: true,
});
