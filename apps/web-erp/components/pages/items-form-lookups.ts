// Lookup option loaders for the Item form's SearchSelect controls.
// Each loader returns { data: {value,label,code}[], total } from a master list API.

import { listItemCategories } from '@/lib/api/item-categories';
import { listUnits } from '@/lib/api/units';
import { listItemKinds } from '@/lib/api/item-types';
import { listProductClasses } from '@/lib/api/product-classes';
import { listDivisions } from '@/lib/api/divisions';
import { listSubDivisions } from '@/lib/api/sub-divisions';
import { listDepartments } from '@/lib/api/departments';
import { listSubDepartments } from '@/lib/api/sub-departments';
import { listBranches } from '@/lib/api/branches';
import { listLocations } from '@/lib/api/locations';
import { listItemLocations } from '@/lib/api/item-locations';
import { listWarehouses } from '@/lib/api/warehouses';
import { listProjects } from '@/lib/api/projects';
import { listCostCenters } from '@/lib/api/cost-centers';
import { listAccounts } from '@/lib/api/accounts';
import { listTaxes } from '@/lib/api/taxes';
import { listPartners } from '@/lib/api/partners';

interface Listable { id: string; code?: string; name: string }
type ListFn = (p: { search?: string; page: number; limit: number; isActive?: boolean }) => Promise<{ data: Listable[]; meta: { total: number } }>;

function makeLoader(listFn: ListFn) {
  return async (search: string, page: number, limit: number) => {
    const res = await listFn({ search: search || undefined, page, limit, isActive: true });
    return {
      data: res.data.map((x) => ({ value: x.id, label: x.name, code: x.code })),
      total: res.meta.total,
    };
  };
}

export const loadCategoryOptions = makeLoader(listItemCategories as unknown as ListFn);
export const loadUnitOptions = makeLoader(listUnits as unknown as ListFn);
export const loadKindOptions = makeLoader(listItemKinds as unknown as ListFn);
export const loadProductClassOptions = makeLoader(listProductClasses as unknown as ListFn);
export const loadDivisionOptions = makeLoader(listDivisions as unknown as ListFn);
export const loadSubDivisionOptions = makeLoader(listSubDivisions as unknown as ListFn);
export const loadDepartmentOptions = makeLoader(listDepartments as unknown as ListFn);
export const loadSubDepartmentOptions = makeLoader(listSubDepartments as unknown as ListFn);
export const loadBranchOptions = makeLoader(listBranches as unknown as ListFn);
export const loadLocationOptions = makeLoader(listLocations as unknown as ListFn);
export const loadItemLocationOptions = makeLoader(listItemLocations as unknown as ListFn);
export const loadWarehouseOptions = makeLoader(listWarehouses as unknown as ListFn);
export const loadProjectOptions = makeLoader(listProjects as unknown as ListFn);
export const loadCostCenterOptions = makeLoader(listCostCenters as unknown as ListFn);
export const loadAccountOptions = makeLoader(listAccounts as unknown as ListFn);
export const loadTaxOptions = makeLoader(listTaxes as unknown as ListFn);
export const loadPartnerOptions = makeLoader(listPartners as unknown as ListFn);
