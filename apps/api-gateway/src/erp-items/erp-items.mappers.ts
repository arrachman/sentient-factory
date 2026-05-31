import { Prisma } from '@prisma/client';

/**
 * Pure query/shape helpers for ErpItemsService: the Prisma `include` graph,
 * DTO→Prisma field builders (FK/Decimal/price/placement rows), and the
 * Prisma→frontend `mapItem` shape. Kept separate to hold the service under
 * the 400-line limit (root CLAUDE.md §5).
 */

export const ITEM_INCLUDE = {
  category:         { select: { id: true, code: true, name: true } },
  baseUnit:         { select: { id: true, code: true, name: true } },
  kind:             { select: { id: true, code: true, name: true } },
  productClass:     { select: { id: true, code: true, name: true } },
  division:         { select: { id: true, code: true, name: true } },
  subdivision:      { select: { id: true, code: true, name: true } },
  department:       { select: { id: true, code: true, name: true } },
  subDepartment:    { select: { id: true, code: true, name: true } },
  branch:           { select: { id: true, code: true, name: true } },
  defaultLocation:  { select: { id: true, code: true, name: true } },
  defaultWarehouse: { select: { id: true, code: true, name: true } },
  project:          { select: { id: true, code: true, name: true } },
  costCenter:       { select: { id: true, code: true, name: true } },
  inventoryAccount: { select: { id: true, code: true, name: true } },
  salesAccount:     { select: { id: true, code: true, name: true } },
  cogsAccount:      { select: { id: true, code: true, name: true } },
  salesReturnAccount:      { select: { id: true, code: true, name: true } },
  salesDiscountAccount:    { select: { id: true, code: true, name: true } },
  purchaseReturnAccount:   { select: { id: true, code: true, name: true } },
  purchaseDiscountAccount: { select: { id: true, code: true, name: true } },
  consignmentAccount:      { select: { id: true, code: true, name: true } },
  purchaseTax:      { select: { id: true, code: true, name: true } },
  saleTax:          { select: { id: true, code: true, name: true } },
  primarySupplier:  { select: { id: true, code: true, name: true } },
  brand:            { select: { id: true, code: true, name: true } },
  material:         { select: { id: true, code: true, name: true } },
  size:             { select: { id: true, code: true, name: true } },
  color:            { select: { id: true, code: true, name: true } },
  section:          { select: { id: true, code: true, name: true } },
  designer:         { select: { id: true, code: true, name: true } },
  nozzle:           { select: { id: true, code: true, name: true } },
  oem:              { select: { id: true, code: true, name: true } },
  vendor:           { select: { id: true, code: true, name: true } },
  fieldUnit:        { select: { id: true, code: true, name: true } },
  prices:           { select: { level: true, price: true, discountPercent: true }, orderBy: { level: 'asc' } },
  placements:       {
    select: {
      warehouseId: true,
      locationId: true,
      warehouse: { select: { id: true, code: true, name: true } },
      location:  { select: { id: true, code: true, name: true } },
    },
    orderBy: { id: 'asc' },
  },
  distributors:     {
    select: {
      partnerId: true,
      partner: { select: { id: true, code: true, name: true } },
    },
    orderBy: { sortOrder: 'asc' },
  },
  branches:         {
    select: {
      branchId: true,
      costCenterId: true,
      branch:     { select: { id: true, code: true, name: true } },
      costCenter: { select: { id: true, code: true, name: true } },
    },
    orderBy: { id: 'asc' },
  },
} as const;

// FK fields where empty string or null = clear the relation; non-empty = BigInt.
const FK_OPTIONAL_FIELDS = [
  'kindId', 'productClassId', 'brandId', 'materialId', 'itemModelId', 'sizeId',
  'colorId', 'sectionId', 'divisionId', 'subdivisionId', 'departmentId',
  'subDepartmentId', 'branchId', 'defaultLocationId', 'defaultWarehouseId',
  'projectId', 'costCenterId', 'inventoryAccountId', 'salesAccountId',
  'cogsAccountId', 'salesReturnAccountId', 'salesDiscountAccountId',
  'purchaseReturnAccountId', 'purchaseDiscountAccountId', 'consignmentAccountId',
  'purchaseTaxId', 'saleTaxId', 'primarySupplierId',
  // Atribut produk (legacy "Atribut")
  'designerId', 'nozzleId', 'oemId', 'vendorId', 'fieldUnitId',
] as const;

const DECIMAL_FIELDS = [
  'standardCost', 'purchasePrice', 'purchaseDiscount', 'salePrice',
  'minStock', 'maxStock', 'reorderQty', 'minOrderQty', 'weight',
  // Dimensi fisik (legacy "Atribut")
  'length', 'width', 'height', 'volume', 'conversionKgPcs',
] as const;

interface PriceTierInput { level: number; price?: string; discountPercent?: string }

/** Build md_item_prices rows from DTO tiers, skipping empty (no price + no discount). */
export function buildPriceRows(prices: PriceTierInput[] | undefined, actorId?: string) {
  if (!prices) return undefined;
  const actor = actorId ? BigInt(actorId) : null;
  return prices
    .filter((p) => (p.price ?? '') !== '' || (p.discountPercent ?? '') !== '')
    .map((p) => ({
      level: p.level,
      price: new Prisma.Decimal(p.price && p.price !== '' ? p.price : 0),
      discountPercent: new Prisma.Decimal(p.discountPercent && p.discountPercent !== '' ? p.discountPercent : 0),
      createdById: actor,
      updatedById: actor,
    }));
}

/**
 * Denormalized salePrice cache = level-1 tier price (§2.32). Returns the L1
 * price so create/update can keep md_items.salePrice in sync server-side
 * regardless of whether the client sent salePrice. Undefined when no tiers
 * given or the L1 price is blank (don't touch the existing cache).
 */
export function deriveSalePriceFromTiers(prices: PriceTierInput[] | undefined): Prisma.Decimal | undefined {
  if (!prices) return undefined;
  const l1 = prices.find((p) => p.level === 1);
  if (!l1 || (l1.price ?? '') === '') return undefined;
  return new Prisma.Decimal(l1.price as string);
}

interface LocationInput { warehouseId?: string; locationId?: string }

/** Build md_item_locations rows, skipping incomplete pairs and deduping (itemId,warehouse,location). */
export function buildLocationRows(locations: LocationInput[] | undefined, actorId?: string) {
  if (!locations) return undefined;
  const actor = actorId ? BigInt(actorId) : null;
  const seen = new Set<string>();
  return locations
    .filter((l) => (l.warehouseId ?? '') !== '' && (l.locationId ?? '') !== '')
    .filter((l) => {
      const key = `${l.warehouseId}:${l.locationId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((l) => ({
      warehouseId: BigInt(l.warehouseId as string),
      locationId: BigInt(l.locationId as string),
      createdById: actor,
      updatedById: actor,
    }));
}

interface DistributorInput { partnerId?: string }

/** Build md_item_distributors rows, skipping empty partner refs and deduping by partner. */
export function buildDistributorRows(distributors: DistributorInput[] | undefined, actorId?: string) {
  if (!distributors) return undefined;
  const actor = actorId ? BigInt(actorId) : null;
  const seen = new Set<string>();
  return distributors
    .filter((d) => (d.partnerId ?? '') !== '')
    .filter((d) => {
      const key = d.partnerId as string;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((d, i) => ({
      partnerId: BigInt(d.partnerId as string),
      sortOrder: i,
      createdById: actor,
      updatedById: actor,
    }));
}

interface BranchInput { branchId?: string; costCenterId?: string }

/** Build md_item_branches rows, skipping incomplete pairs and deduping by branch (one cost center per branch). */
export function buildBranchRows(branches: BranchInput[] | undefined, actorId?: string) {
  if (!branches) return undefined;
  const actor = actorId ? BigInt(actorId) : null;
  const seen = new Set<string>();
  return branches
    .filter((b) => (b.branchId ?? '') !== '' && (b.costCenterId ?? '') !== '')
    .filter((b) => {
      const key = b.branchId as string;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((b) => ({
      branchId: BigInt(b.branchId as string),
      costCenterId: BigInt(b.costCenterId as string),
      createdById: actor,
      updatedById: actor,
    }));
}

function toFkOrNull(v: string | null | undefined): bigint | null | undefined {
  if (v === undefined) return undefined;
  if (v === null || v === '') return null;
  return BigInt(v);
}

function toDecimalOrUndefined(v: string | null | undefined): Prisma.Decimal | undefined {
  if (v === undefined || v === null || v === '') return undefined;
  return new Prisma.Decimal(v);
}

export function buildFkData(dto: Record<string, unknown>): Record<string, bigint | null | undefined> {
  const out: Record<string, bigint | null | undefined> = {};
  for (const f of FK_OPTIONAL_FIELDS) {
    const v = dto[f] as string | null | undefined;
    const conv = toFkOrNull(v);
    if (conv !== undefined) out[f] = conv;
  }
  return out;
}

export function buildDecimalData(dto: Record<string, unknown>): Record<string, Prisma.Decimal | undefined> {
  const out: Record<string, Prisma.Decimal | undefined> = {};
  for (const f of DECIMAL_FIELDS) {
    const v = dto[f] as string | null | undefined;
    const conv = toDecimalOrUndefined(v);
    if (conv !== undefined) out[f] = conv;
  }
  return out;
}

/** Drop empty-string/null/undefined values; return undefined when nothing remains. */
function compactMeta(obj?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!obj) return undefined;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null && v !== '') out[k] = v;
  }
  return Object.keys(out).length ? out : undefined;
}

/**
 * Assemble md_items.metadata from the "Lain-lain" (`others`) + "Custom"
 * (`custom`) DTO sub-objects (§2.38 — stored as JSON, no dedicated columns).
 * Merges onto any existing metadata so unrelated keys survive; clears a
 * namespace whose fields are all blank. Returns undefined when neither sub-
 * object was sent, so create/update leaves the column untouched.
 */
export function buildItemMetadata(
  dto: { others?: object | null; custom?: object | null },
  existing?: Prisma.JsonValue | null,
): Prisma.InputJsonValue | undefined {
  if (dto.others == null && dto.custom == null) return undefined;
  const base: Record<string, unknown> =
    existing && typeof existing === 'object' && !Array.isArray(existing)
      ? { ...(existing as Record<string, unknown>) }
      : {};
  if (dto.others != null) {
    const c = compactMeta(dto.others as Record<string, unknown>);
    if (c) base.others = c;
    else delete base.others;
  }
  if (dto.custom != null) {
    const c = compactMeta(dto.custom as Record<string, unknown>);
    if (c) base.custom = c;
    else delete base.custom;
  }
  return base as Prisma.InputJsonValue;
}

// Maps Prisma field names to the frontend ErpItem interface shape
export function mapItem(item: any) {
  const { type, baseUnit, baseUnitId, salePrice, prices, placements, distributors, branches, ...rest } = item;
  return {
    ...rest,
    itemType: type,
    unitId: String(baseUnitId),
    unit: baseUnit ?? null,
    sellingPrice: salePrice != null ? String(salePrice) : null,
    salePrice: salePrice != null ? String(salePrice) : null,
    prices: (prices ?? []).map((p: any) => ({
      level: p.level,
      price: String(p.price),
      discountPercent: String(p.discountPercent),
    })),
    locations: (placements ?? []).map((l: any) => ({
      warehouseId: String(l.warehouseId),
      locationId: String(l.locationId),
      warehouse: l.warehouse ?? null,
      location: l.location ?? null,
    })),
    distributors: (distributors ?? []).map((d: any) => ({
      partnerId: String(d.partnerId),
      partner: d.partner ?? null,
    })),
    branches: (branches ?? []).map((b: any) => ({
      branchId: String(b.branchId),
      costCenterId: String(b.costCenterId),
      branch: b.branch ?? null,
      costCenter: b.costCenter ?? null,
    })),
  };
}
