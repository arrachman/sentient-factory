// Registry that maps a lookup source slug → list function.
// Used by Form Builder (dropdown) and by the custom-fields renderer (loader builder).

import { listPartners } from '@/lib/api/partners';
import { listAccounts } from '@/lib/api/accounts';
import { listBranches } from '@/lib/api/branches';
import { listLocations } from '@/lib/api/locations';
import { listCurrencies } from '@/lib/api/currencies';
import { listCostCenters } from '@/lib/api/cost-centers';
import { listDivisions } from '@/lib/api/divisions';
import { listSubDivisions } from '@/lib/api/sub-divisions';
import { listWarehouses } from '@/lib/api/warehouses';
import { listProjects } from '@/lib/api/projects';
import type { FormFieldType } from '@/lib/api/form-fields';

type AnyListFn = (params: Record<string, unknown>) => Promise<{
  data: { id: string; name: string; code?: string }[];
  meta: { total: number };
}>;

const SOURCE_MAP: Record<string, { label: string; listFn: AnyListFn }> = {
  partners:      { label: 'Partner',       listFn: listPartners      as unknown as AnyListFn },
  accounts:      { label: 'Akun (CoA)',    listFn: listAccounts      as unknown as AnyListFn },
  branches:      { label: 'Cabang',        listFn: listBranches      as unknown as AnyListFn },
  locations:     { label: 'Lokasi',        listFn: listLocations     as unknown as AnyListFn },
  currencies:    { label: 'Mata Uang',     listFn: listCurrencies    as unknown as AnyListFn },
  'cost-centers':{ label: 'Cost Center',  listFn: listCostCenters   as unknown as AnyListFn },
  divisions:     { label: 'Divisi',        listFn: listDivisions     as unknown as AnyListFn },
  'sub-divisions':{ label: 'Sub Divisi',  listFn: listSubDivisions  as unknown as AnyListFn },
  warehouses:    { label: 'Gudang',        listFn: listWarehouses    as unknown as AnyListFn },
  projects:      { label: 'Proyek',        listFn: listProjects      as unknown as AnyListFn },
};

/** Fixed source slug for built-in lookup field types. */
export const BUILTIN_SOURCE: Partial<Record<FormFieldType, string>> = {
  PARTNER:  'partners',
  ACCOUNT:  'accounts',
  BRANCH:   'branches',
  LOCATION: 'locations',
  CURRENCY: 'currencies',
};

/** Options for the source <Select> in Form Builder (LOOKUP fields). */
export const LOOKUP_SOURCE_OPTIONS = Object.entries(SOURCE_MAP).map(
  ([value, { label }]) => ({ value, label }),
);

/** Human-readable label for a source slug, e.g. "partners" → "Partner". */
export function sourceLabelOf(slug: string | null | undefined): string {
  return slug ? (SOURCE_MAP[slug]?.label ?? slug) : '—';
}

/**
 * Build a SearchSelect-compatible loader from a source slug + optional default filter/sort.
 * Returns null if the slug is unknown.
 */
export function buildLookupLoader(
  source: string | null | undefined,
  defaultFilter?: Record<string, unknown> | null,
  defaultSort?: string | null,
): ((search: string, page: number, limit: number) => Promise<{ data: { value: string; label: string; code?: string }[]; total: number }>) | null {
  if (!source) return null;
  const entry = SOURCE_MAP[source];
  if (!entry) return null;

  const [sortField, sortDir] = (defaultSort ?? 'name:asc').split(':');

  return async (search: string, page: number, limit: number) => {
    const res = await entry.listFn({
      search: search || undefined,
      page,
      limit,
      sortBy: sortField || 'name',
      sortDir: (sortDir || 'asc') as 'asc' | 'desc',
      ...(defaultFilter ?? {}),
    } as Record<string, unknown>);
    return {
      data: res.data.map((x) => ({ value: x.id, label: x.name, code: x.code })),
      total: res.meta.total,
    };
  };
}
