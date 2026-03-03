import type { MenuConfig, MenuItem } from '@/config/types';

const LEGACY_FINANCE_PREFIX = '/app/dashboard/finance';
const NEW_FINANCE_PREFIX = '/app/finance-accounting';

export function toFinancePathByFeature(feature: string | undefined): string {
  const normalizedFeature = feature?.trim();
  if (!normalizedFeature) {
    return NEW_FINANCE_PREFIX;
  }
  return `${NEW_FINANCE_PREFIX}/${normalizedFeature}`;
}

export function normalizeFinancePath(path: string | undefined): string | undefined {
  if (!path) {
    return path;
  }

  if (path === LEGACY_FINANCE_PREFIX) {
    return toFinancePathByFeature(undefined);
  }

  if (path.startsWith(`${LEGACY_FINANCE_PREFIX}/`)) {
    const feature = path.slice(`${LEGACY_FINANCE_PREFIX}/`.length);
    return toFinancePathByFeature(feature);
  }

  if (path.startsWith(`${LEGACY_FINANCE_PREFIX}?`)) {
    const query = path.slice(`${LEGACY_FINANCE_PREFIX}?`.length);
    const params = new URLSearchParams(query);
    const feature = params.get('feature') ?? undefined;
    return toFinancePathByFeature(feature);
  }

  if (path.startsWith(`${NEW_FINANCE_PREFIX}?`)) {
    const query = path.slice(`${NEW_FINANCE_PREFIX}?`.length);
    const params = new URLSearchParams(query);
    const feature = params.get('feature') ?? undefined;
    return toFinancePathByFeature(feature);
  }

  if (path === NEW_FINANCE_PREFIX) {
    return NEW_FINANCE_PREFIX;
  }

  if (path.startsWith(`${NEW_FINANCE_PREFIX}/`)) {
    const feature = path.slice(`${NEW_FINANCE_PREFIX}/`.length);
    return toFinancePathByFeature(feature);
  }

  return path;
}

export function normalizeFinanceMenus(items: MenuConfig): MenuConfig {
  return items.map((item) => normalizeFinanceMenuItem(item));
}

function normalizeFinanceMenuItem(item: MenuItem): MenuItem {
  return {
    ...item,
    path: normalizeFinancePath(item.path),
    children: item.children?.map((child) => normalizeFinanceMenuItem(child)),
  };
}
