// Header SearchSelect loaders specific to Purchasing transaction forms.
// Supplier = partners flagged as supplier; payment term = md_payment_terms.
// Branch/Location/Warehouse/Currency reuse items-form-lookups loaders.

import { listPartners } from '@/lib/api/partners';
import { listPaymentTerms } from '@/lib/api/payment-terms';

/** Supplier picker = partners flagged isSupplier (legacy "Pemasok"). */
export const loadSupplierOptions = async (search: string, page: number, limit: number) => {
  const res = await listPartners({ search: search || undefined, page, limit, isActive: true, isSupplier: true });
  return {
    data: res.data.map((x) => ({ value: x.id, label: x.name, code: x.code })),
    total: res.meta.total,
  };
};

/** Payment-term picker (Termin). */
export const loadPaymentTermOptions = async (search: string, page: number, limit: number) => {
  const res = await listPaymentTerms({ search: search || undefined, page, limit, isActive: true });
  return {
    data: res.data.map((x) => ({ value: x.id, label: x.name, code: x.code })),
    total: res.meta.total,
  };
};
