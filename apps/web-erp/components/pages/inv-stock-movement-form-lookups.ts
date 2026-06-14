// Header SearchSelect loaders for the inventory stock-movement form.
// Warehouse (source/transit/destination) + Branch + Location reuse the Item
// form loaders. Requested-partner = partners flagged as supplier (the unit/vendor
// a Material Request is addressed to). No currency on inventory movements.

import { listPartners } from '@/lib/api/partners';

export {
  loadWarehouseOptions,
  loadBranchOptions,
  loadLocationOptions,
} from '@/components/pages/items-form-lookups';

/** Requested-partner picker = partners flagged isSupplier (vendor / requested-to). */
export const loadRequestedPartnerOptions = async (search: string, page: number, limit: number) => {
  const res = await listPartners({ search: search || undefined, page, limit, isActive: true, isSupplier: true });
  return {
    data: res.data.map((x) => ({ value: x.id, label: x.name, code: x.code })),
    total: res.meta.total,
  };
};
