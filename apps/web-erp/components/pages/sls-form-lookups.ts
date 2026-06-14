// Header SearchSelect loaders specific to Sales transaction forms.
// Customer = partners flagged as customer; payment term = md_payment_terms.
// Branch/Location/Warehouse/Division/Currency reuse items-form-lookups loaders.

import { listPartners } from '@/lib/api/partners';
import { listPaymentTerms } from '@/lib/api/payment-terms';

/** Customer picker = partners flagged isCustomer (legacy "Pelanggan"). */
export const loadCustomerOptions = async (search: string, page: number, limit: number) => {
  const res = await listPartners({ search: search || undefined, page, limit, isActive: true, isCustomer: true });
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
