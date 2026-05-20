/**
 * Shell route renderer — maps a route string to the correct page component.
 * Kept separate from AppShell to respect the 400-line limit and give the
 * routing logic a single place to live.
 */

import * as React from 'react';
import { makeTranslator } from '@/lib/mock';
import { Dashboard } from '@/components/pages/dashboard';
import { ComingSoon } from '@/components/pages/coming-soon';
import { Statistik } from '@/components/pages/statistik';
import { SettingsPage } from '@/components/pages/settings';
import { AppearancePage } from '@/components/pages/appearance';
import { KasMasukList } from '@/components/pages/kas-masuk-list';
import { GenericList } from '@/components/pages/generic-list';
import { FinancialReport } from '@/components/pages/financial-report';
import { DataList } from '@/components/pages/data-list';
import { RecordForm } from '@/components/pages/record-form';
import { TrxForm } from '@/components/pages/trx-form';
// F2 Admin pages
import { ErpUsersPage } from '@/components/pages/users-page';
import { ErpBranchesPage } from '@/components/pages/branches-page';
import { ErpRolesPage } from '@/components/pages/roles-page';
import { ErpSettingsPage } from '@/components/pages/settings-page';
import { ErpPermissionsPage } from '@/components/pages/permissions-page';
import { ErpMenusPage } from '@/components/pages/menus-page';
import { ErpDocumentNumberingsPage } from '@/components/pages/document-numberings-page';
import { ErpFiscalPeriodsPage } from '@/components/pages/fiscal-periods-page';
// F3 Master Data pages
import { ErpItemsPage } from '@/components/pages/items-page';
import { ErpUnitsPage } from '@/components/pages/units-page';
import { ErpPartnersPage } from '@/components/pages/partners-page';
import { ErpItemCategoriesPage } from '@/components/pages/item-categories-page';
import { ErpLocationsPage } from '@/components/pages/locations-page';
import { ErpWarehousesPage } from '@/components/pages/warehouses-page';
import { ErpPartnerCategoriesPage } from '@/components/pages/partner-categories-page';
import { ErpAccountsPage } from '@/components/pages/accounts-page';
import { ErpCurrenciesPage } from '@/components/pages/currencies-page';
import { ErpTaxesPage } from '@/components/pages/taxes-page';
import { ErpPaymentTermsPage } from '@/components/pages/payment-terms-page';
import { ErpDivisionsPage } from '@/components/pages/divisions-page';
import { ErpSubDivisionsPage } from '@/components/pages/sub-divisions-page';
import { ErpProjectsPage } from '@/components/pages/projects-page';
import { ErpCostCentersPage } from '@/components/pages/cost-centers-page';
import { ErpDepartmentsPage } from '@/components/pages/departments-page';
import { ErpSubDepartmentsPage } from '@/components/pages/sub-departments-page';
// F2 Finance (m2) pages — skeleton CRUD
import { ErpJournalEntriesPage } from '@/components/pages/fin-journal-entries-page';
import { ErpArReceiptsPage } from '@/components/pages/fin-ar-receipts-page';
import { ErpApPaymentsPage } from '@/components/pages/fin-ap-payments-page';
import { ErpGirosPage } from '@/components/pages/fin-giros-page';
import { ErpLedgerPage } from '@/components/pages/fin-ledger-page';
import { REGISTRY, MODULES, REPORTS } from '@/lib/registry';

/**
 * ERP page registry. Keyed by the canonical route id = the seeded
 * `sys_menus.path` (single source of truth — the dynamic sidebar emits
 * these). Legacy short-ids (`adm-users`, `md-items`, …) are kept as
 * aliases so the static NAV fallback in `lib/nav.ts` keeps working when
 * the API is unreachable.
 */
interface ErpPageCtx {
  t: ReturnType<typeof makeTranslator>;
}

const ERP_PAGES: Record<string, (ctx: ErpPageCtx) => React.ReactNode> = {
  // ── Admin (sys/adm) ───────────────────────────────────────────────────────
  '/admin/users': () => <ErpUsersPage />,
  '/admin/roles': () => <ErpRolesPage />,
  '/admin/settings': () => <ErpSettingsPage />,
  '/admin/permissions': () => <ErpPermissionsPage />,
  '/admin/menus': () => <ErpMenusPage />,
  '/admin/document-numbering': () => <ErpDocumentNumberingsPage />,
  '/admin/fiscal-periods': () => <ErpFiscalPeriodsPage />,
  '/admin/preferences': (ctx) => <SettingsPage t={ctx.t} />,
  // ── Master Data (md) ──────────────────────────────────────────────────────
  '/master/branches': () => <ErpBranchesPage />,
  '/master/items': () => <ErpItemsPage />,
  '/master/units': () => <ErpUnitsPage />,
  '/master/partners': () => <ErpPartnersPage />,
  '/master/item-categories': () => <ErpItemCategoriesPage />,
  '/master/locations': () => <ErpLocationsPage />,
  '/master/warehouses': () => <ErpWarehousesPage />,
  '/master/partner-categories': () => <ErpPartnerCategoriesPage />,
  '/master/accounts': () => <ErpAccountsPage />,
  '/master/currencies': () => <ErpCurrenciesPage />,
  '/master/taxes': () => <ErpTaxesPage />,
  '/master/payment-terms': () => <ErpPaymentTermsPage />,
  '/master/divisions': () => <ErpDivisionsPage />,
  '/master/subdivisions': () => <ErpSubDivisionsPage />,
  // ── Organization (md, mirror of /master/* org masters) ───────────────────
  '/org/branches': () => <ErpBranchesPage />,
  '/org/locations': () => <ErpLocationsPage />,
  '/org/warehouses': () => <ErpWarehousesPage />,
  '/org/divisions': () => <ErpDivisionsPage />,
  '/org/sub-divisions': () => <ErpSubDivisionsPage />,
  '/org/projects': () => <ErpProjectsPage />,
  '/org/cost-centers': () => <ErpCostCentersPage />,
  '/org/departments': () => <ErpDepartmentsPage />,
  '/org/sub-departments': () => <ErpSubDepartmentsPage />,
  // ── User Settings (personal preferences) ─────────────────────────────────
  '/settings/appearance': (ctx) => <AppearancePage t={ctx.t} />,
  // ── Finance (fin, m2) ─────────────────────────────────────────────────────
  '/keuangan/journal-entries': () => <ErpJournalEntriesPage />,
  '/keuangan/ar-receipts': () => <ErpArReceiptsPage />,
  '/keuangan/ap-payments': () => <ErpApPaymentsPage />,
  '/keuangan/giros': () => <ErpGirosPage />,
  '/keuangan/ledger': () => <ErpLedgerPage />,
  // ── Legacy short-id aliases (static NAV fallback) ─────────────────────────
  'adm-users': () => <ErpUsersPage />,
  'adm-roles': () => <ErpRolesPage />,
  'adm-branches': () => <ErpBranchesPage />,
  'adm-settings': () => <ErpSettingsPage />,
  'md-items': () => <ErpItemsPage />,
  'md-units': () => <ErpUnitsPage />,
  'md-partners': () => <ErpPartnersPage />,
  'md-item-categories': () => <ErpItemCategoriesPage />,
};
import type { Lang } from '@/lib/shell-constants';

/** If `route` ends with `-new`, returns the base route; otherwise `null`. */
function resolveNewRoute(route: string): string | null {
  if (!route.endsWith('-new')) return null;
  return route.slice(0, -'-new'.length);
}

/**
 * Render the page component that corresponds to `route`.
 *
 * @param route       The current route string (e.g. `'home'`, `'items'`, `'items-new'`).
 * @param onNavigate  Navigate within the active tab (replaces current route).
 * @param onOpenTab   Open a route in a new tab (or switch to an existing one).
 * @param t           Translator produced by `makeTranslator`.
 * @param lang        Active UI language.
 */
export function renderRoute(
  route: string,
  onNavigate: (r: string) => void,
  onOpenTab: (r: string) => void,
  t: ReturnType<typeof makeTranslator>,
  lang: Lang,
): React.ReactNode {
  if (route === 'home') return <Dashboard t={t} onNavigate={onOpenTab} />;
  if (route === 'statistik') return <Statistik t={t} onNavigate={onOpenTab} />;
  if (route === 'set-prefs') return <SettingsPage t={t} />;
  if (route === 'set-appearance') return <AppearancePage t={t} />;

  // ── ERP pages (seeded sys_menus path = canonical id; short-id aliases) ─────
  const erpPage = ERP_PAGES[route];
  if (erpPage) return erpPage({ t });

  const baseRoute = resolveNewRoute(route);
  if (baseRoute) {
    if (MODULES[baseRoute])
      return (
        <TrxForm
          moduleId={baseRoute}
          t={t}
          lang={lang}
          onNavigate={onNavigate}
        />
      );
    if (REGISTRY[baseRoute])
      return <RecordForm moduleId={baseRoute} t={t} onNavigate={onNavigate} />;
    return <ComingSoon route={route} />;
  }

  if (route === 'kas-masuk')
    return (
      <KasMasukList
        t={t}
        lang={lang}
        onNavigate={onNavigate}
        onOpenTab={onOpenTab}
      />
    );
  if (MODULES[route])
    return (
      <GenericList
        moduleId={route}
        t={t}
        lang={lang}
        onNavigate={onNavigate}
        onOpenTab={onOpenTab}
      />
    );
  if (REPORTS[route]) return <FinancialReport moduleId={route} t={t} />;
  if (REGISTRY[route])
    return (
      <DataList
        moduleId={route}
        t={t}
        onNavigate={onNavigate}
        onOpenTab={onOpenTab}
      />
    );
  return <ComingSoon route={route} />;
}
