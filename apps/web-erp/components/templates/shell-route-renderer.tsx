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
import { ErpUsersPage } from '@/components/pages/erp-users-page';
import { ErpBranchesPage } from '@/components/pages/erp-branches-page';
import { ErpRolesPage } from '@/components/pages/erp-roles-page';
import { ErpSettingsPage } from '@/components/pages/erp-settings-page';
// F3 Master Data pages
import { ErpItemsPage } from '@/components/pages/erp-items-page';
import { ErpUnitsPage } from '@/components/pages/erp-units-page';
import { ErpPartnersPage } from '@/components/pages/erp-partners-page';
import { ErpItemCategoriesPage } from '@/components/pages/erp-item-categories-page';
import { REGISTRY, MODULES, REPORTS } from '@/lib/registry';
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

  // ── F2 Admin ──────────────────────────────────────────────────────────────
  if (route === 'adm-users') return <ErpUsersPage />;
  if (route === 'adm-branches') return <ErpBranchesPage />;
  if (route === 'adm-roles') return <ErpRolesPage />;
  if (route === 'adm-settings') return <ErpSettingsPage />;

  // ── F3 Master Data ────────────────────────────────────────────────────────
  if (route === 'md-items') return <ErpItemsPage />;
  if (route === 'md-units') return <ErpUnitsPage />;
  if (route === 'md-partners') return <ErpPartnersPage />;
  if (route === 'md-item-categories') return <ErpItemCategoriesPage />;

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
