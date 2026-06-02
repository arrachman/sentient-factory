// Resolves a Kustomisasi-Grid `lookupSource` slug → a SearchSelect loader.
// Unifies two historical vocabularies onto the canonical lookup-source-registry
// slugs (the ones used by Form Builder & shown in the source picker):
//   - 6 sources were already wired in the live grid with short slugs
//     (`account`, `partner`, `costCenter`, …) — kept as back-compat ALIASES so
//     rows/seed saved before unification keep resolving.
//   - 4 new sources (Cabang/Lokasi/Mata Uang/Gudang) come from the shared
//     registry via `buildLookupLoader`.

import {
  loadAccountOptionsCoded,
  loadCostCenterOptions,
  loadDivisionOptions,
  loadSubDivisionOptions,
  loadProjectOptions,
  loadPartnerOptions,
} from '@/components/pages/items-form-lookups';
import { buildLookupLoader } from '@/lib/lookup-source-registry';

export type GridLookupLoader = (
  search: string,
  page: number,
  limit: number,
) => Promise<{ data: { value: string; label: string; code?: unknown }[]; total: number }>;

// Old grid/seed slug → canonical registry slug.
const SOURCE_ALIAS: Record<string, string> = {
  account: 'accounts',
  partner: 'partners',
  costCenter: 'cost-centers',
  division: 'divisions',
  subdivision: 'sub-divisions',
  project: 'projects',
};

/** Normalize any historical slug to its canonical registry slug. */
export function canonicalSource(source: string | null | undefined): string {
  if (!source) return '';
  return SOURCE_ALIAS[source] ?? source;
}

// Canonical-slug → loader. The 6 already-wired sources keep their existing
// loaders (preserves the account "No · Nama" display); the 4 new ones are built
// from the shared registry.
const LOADERS: Record<string, GridLookupLoader> = {
  accounts:        loadAccountOptionsCoded as unknown as GridLookupLoader,
  partners:        loadPartnerOptions as unknown as GridLookupLoader,
  'cost-centers':  loadCostCenterOptions as unknown as GridLookupLoader,
  divisions:       loadDivisionOptions as unknown as GridLookupLoader,
  'sub-divisions': loadSubDivisionOptions as unknown as GridLookupLoader,
  projects:        loadProjectOptions as unknown as GridLookupLoader,
  branches:        buildLookupLoader('branches')   as unknown as GridLookupLoader,
  locations:       buildLookupLoader('locations')  as unknown as GridLookupLoader,
  currencies:      buildLookupLoader('currencies') as unknown as GridLookupLoader,
  warehouses:      buildLookupLoader('warehouses') as unknown as GridLookupLoader,
};

/** Default loader when a column has no (or an unknown) source. */
export const DEFAULT_LOOKUP_LOADER: GridLookupLoader = LOADERS.accounts;

/** Loader for a grid `lookupSource` slug (old or canonical), or null if unknown. */
export function gridLookupLoader(source: string | null | undefined): GridLookupLoader | null {
  const s = canonicalSource(source);
  return s ? (LOADERS[s] ?? null) : null;
}
