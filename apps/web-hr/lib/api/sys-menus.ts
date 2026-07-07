// HR sidebar menu tree — role-filtered, served by api-gateway `hr-sys-menus`
// (raw-SQL over live `hr_menus`/`hr_role_menus`). Mirrors the ERP/MDP dynamic
// nav: the backend resolves the user's roles → visible ITEM nodes; MODULE
// containers are always kept (stub group headers).
//
// Canonical `path` has NO `/app` prefix (e.g. `/dashboard`); the shell prepends
// the `/app` base when building hrefs (see lib/nav.ts `toAppPath`).
import { apiGet } from './client';

export type HrMenuType = 'MODULE' | 'GROUP' | 'ITEM';

export interface HrMenuNode {
  id: string;
  code: string;
  title: string;
  path: string | null;
  icon: string | null; // lucide-react export name
  type: HrMenuType;
  parent_id: string | null;
  sort_order: number;
  children: HrMenuNode[];
}

/** GET /api/hr/sys-menus/my-menus → role-filtered MODULE→ITEM tree. */
export async function getMyMenus(): Promise<HrMenuNode[]> {
  const res = await apiGet<{ data?: HrMenuNode[] } | HrMenuNode[]>(
    '/hr/sys-menus/my-menus',
  );
  if (Array.isArray(res)) return res;
  return res.data ?? [];
}
