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
import { GridCustomizationPage } from '@/components/pages/grid-customization-page';
import { FormBuilderPage } from '@/components/pages/form-builder-page';
import { ErpDocumentNumberingsPage } from '@/components/pages/document-numberings-page';
import { ErpFiscalPeriodsPage } from '@/components/pages/fiscal-periods-page';
// F3 Master Data pages
import { ErpItemsPage } from '@/components/pages/items-page';
import { ErpUnitsPage } from '@/components/pages/units-page';
import { ErpPartnersPage } from '@/components/pages/partners-page';
import { ErpVendorsPage } from '@/components/pages/vendors-page';
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
// MD legacy batch (2026-05-20) — 20 entitas dari MyERP+ m1_*
import { ErpColorsPage } from '@/components/pages/colors-page';
import { ErpNozzlesPage } from '@/components/pages/nozzles-page';
import { ErpOemsPage } from '@/components/pages/oems-page';
import { ErpItemPermissionsPage } from '@/components/pages/item-permissions-page';
import { ErpBrandsPage } from '@/components/pages/brands-page';
import { ErpMaterialsPage } from '@/components/pages/materials-page';
import { ErpItemModelsPage } from '@/components/pages/item-models-page';
import { ErpSizesPage } from '@/components/pages/sizes-page';
import { ErpSectionsPage } from '@/components/pages/sections-page';
import { ErpItemKindsPage } from '@/components/pages/item-types-page';
import { ErpProductClassesPage } from '@/components/pages/product-classes-page';
import { ErpClassesPage } from '@/components/pages/classes-page';
import { ErpBanksPage } from '@/components/pages/banks-page';
import { ErpExpeditionsPage } from '@/components/pages/expeditions-page';
import { ErpOtherCostsPage } from '@/components/pages/other-costs-page';
import { ErpCommissionsPage } from '@/components/pages/commissions-page';
import { ErpItemTransactionTypesPage } from '@/components/pages/item-transaction-types-page';
import { ErpCountriesPage } from '@/components/pages/countries-page';
import { ErpProvincesPage } from '@/components/pages/provinces-page';
import { ErpCitiesPage } from '@/components/pages/cities-page';
import { ErpAreasPage } from '@/components/pages/areas-page';
import { ErpItemLocationsPage } from '@/components/pages/item-locations-page';
import { ErpPartnerSubCategoriesPage } from '@/components/pages/partner-sub-categories-page';
import { ErpPriceCategoriesPage } from '@/components/pages/price-categories-page';
import { ErpTransactionNotesPage } from '@/components/pages/transaction-notes-page';
import { ErpTxnNoteDetailsPage } from '@/components/pages/txn-note-details-page';
import { ErpPriceIndicesPage } from '@/components/pages/price-indices-page';
import { ErpItemInformationsPage } from '@/components/pages/item-informations-page';
// MD production batch — 10 entitas master produksi baru
import { ErpProductionCategoriesPage } from '@/components/pages/production-categories-page';
import { ErpPointCategoriesPage } from '@/components/pages/point-categories-page';
import { ErpMiscellaneousPage } from '@/components/pages/miscellaneous-page';
import { ErpSubClassesPage } from '@/components/pages/sub-classes-page';
import { ErpWorkEstimatesPage } from '@/components/pages/work-estimates-page';
import { ErpLaborsPage } from '@/components/pages/labors-page';
import { ErpMachinesPage } from '@/components/pages/machines-page';
import { ErpDesignersPage } from '@/components/pages/designers-page';
import { ErpProductionActivitiesPage } from '@/components/pages/production-activities-page';
import { ErpProductionRoutesPage } from '@/components/pages/production-routes-page';
// F2 Finance (m2) pages — skeleton CRUD
import { ErpJournalEntriesPage } from '@/components/pages/fin-journal-entries-page';
import { ErpArReceiptsPage } from '@/components/pages/fin-ar-receipts-page';
import { ErpApPaymentsPage } from '@/components/pages/fin-ap-payments-page';
import { ErpLedgerPage } from '@/components/pages/fin-ledger-page';
import { ErpCashReceiptsPage } from '@/components/pages/fin-cash-receipts-page';
import { ErpBankReceiptsPage } from '@/components/pages/fin-bank-receipts-page';
import { ErpCashDisbursementsPage } from '@/components/pages/fin-cash-disbursements-page';
import { ErpBankDisbursementsPage } from '@/components/pages/fin-bank-disbursements-page';
import { ErpCashbankTransfersPage } from '@/components/pages/fin-cashbank-transfers-page';
import { ErpReceiptGirosPage } from '@/components/pages/fin-receipt-giros-page';
import { ErpSendGirosPage } from '@/components/pages/fin-send-giros-page';
import { ErpReceiptGiroClearingsPage } from '@/components/pages/fin-receipt-giro-clearings-page';
import { ErpSendGiroClearingsPage } from '@/components/pages/fin-send-giro-clearings-page';
import { ErpAdjustmentJournalsPage } from '@/components/pages/fin-adjustment-journals-page';
// Sales (sls, m5)
import { ErpSlsOrdersPage } from '@/components/pages/sls-orders-page';
import {
  ErpInvMaterialRequestsPage,
  ErpInvTransfersPage,
  ErpInvTransferReceiptsPage,
  ErpInvFuelRefillsPage,
} from '@/components/pages/inv-stock-movements-page';
import { ErpInvStockAdjustmentsPage } from '@/components/pages/inv-stock-adjustments-page';
import { ErpInvOpeningStocksPage } from '@/components/pages/inv-opening-stocks-page';
import { ErpInvStockCountsPage } from '@/components/pages/inv-stock-counts-page';
import { ErpInvPriceAdjustmentsPage } from '@/components/pages/inv-price-adjustments-page';
import { ErpInvWeighbridgeTicketsPage } from '@/components/pages/inv-weighbridge-tickets-page';
import { ErpInvDailyChecksPage } from '@/components/pages/inv-daily-checks-page';
// Audit Logs
import { ErpAuditLogsPage } from '@/components/pages/audit-logs-page';
// Admin tools & identity pages
import { ErpLanguagePage } from '@/components/pages/language-page';
import { ErpOnlineUsersPage } from '@/components/pages/online-users-page';
import { ErpFiscalPeriodsClosePage } from '@/components/pages/fiscal-periods-close-page';
import { ErpRecalcCogsPage } from '@/components/pages/tools-recalc-cogs-page';
import { ErpRepostJournalPage } from '@/components/pages/tools-repost-journal-page';
import { ErpDataValidityPage } from '@/components/pages/tools-data-validity-page';
// Settings sub-pages + Import
import { SettingsGroupPage } from '@/components/pages/settings-group-page';
import { AccountCodeFormatPage } from '@/components/pages/account-code-format-page';
import { NumberFormatPage } from '@/components/pages/number-format-page';
import { DateFormatPage } from '@/components/pages/date-format-page';
import { ErpImportPage } from '@/components/pages/import-page';
import { REGISTRY, MODULES, REPORTS } from '@/lib/registry';
import {
  resolveTrxFormRoute,
  type TrxFormPage,
} from '@/lib/trx-route';

/**
 * Transaction form pages — URL-addressable in three shapes per `lib/trx-route`:
 * `<base>` (list), `<base>/new` (create), `<base>/:id` (edit). Keyed by the
 * canonical `sys_menus.path`. Add new transaction modules here (CD/BD/giro/
 * jurnal…) as they adopt the sub-route convention.
 */
const TRX_FORM_PAGES: Record<string, TrxFormPage> = {
  '/finance/cash-receipts': ErpCashReceiptsPage,
  '/finance/cash-disbursements': ErpCashDisbursementsPage,
  '/finance/bank-receipts': ErpBankReceiptsPage,
  '/finance/bank-disbursements': ErpBankDisbursementsPage,
  '/sales/orders': ErpSlsOrdersPage,
  '/warehouse/material-requests': ErpInvMaterialRequestsPage,
  '/warehouse/transfers': ErpInvTransfersPage,
  '/warehouse/transfer-receipts': ErpInvTransferReceiptsPage,
  '/warehouse/fuel-refills': ErpInvFuelRefillsPage,
  '/warehouse/stock-adjustments': ErpInvStockAdjustmentsPage,
  '/warehouse/opening-stocks': ErpInvOpeningStocksPage,
  '/warehouse/stock-counts': ErpInvStockCountsPage,
  '/warehouse/price-adjustments': ErpInvPriceAdjustmentsPage,
  '/warehouse/receipt-weighers': ErpInvWeighbridgeTicketsPage,
  '/warehouse/daily-checks': ErpInvDailyChecksPage,
};
const TRX_BASES = Object.keys(TRX_FORM_PAGES);

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
  // ── Admin Settings sub-pages ─────────────────────────────────────────────
  '/admin/settings/company': () => <SettingsGroupPage group="company" title="Pengaturan Perusahaan" />,
  '/admin/settings/accounting': () => <SettingsGroupPage group="accounting" title="Pengaturan Akuntansi" />,
  '/admin/settings/bank-accounts': () => <SettingsGroupPage group="bank-accounts" title="Rekening Bank Perusahaan" />,
  '/admin/settings/tax': () => <SettingsGroupPage group="tax" title="Pengaturan Pajak" />,
  '/admin/settings/description': () => <SettingsGroupPage group="description" title="Deskripsi Dokumen" />,
  '/admin/settings/format': () => <SettingsGroupPage group="format" title="Format Tampilan" />,
  '/admin/settings/defaults': () => <SettingsGroupPage group="defaults" title="Nilai Default" />,
  '/admin/settings/report-defaults': () => <SettingsGroupPage group="report-defaults" title="Default Laporan" />,
  '/admin/settings/signature': () => <SettingsGroupPage group="signature" title="Tanda Tangan" />,
  '/admin/settings/options': () => <SettingsGroupPage group="options" title="Opsi Lanjutan" />,
  '/admin/settings/home': () => <SettingsGroupPage group="home" title="Pengaturan Beranda" />,
  '/admin/settings/approval': () => <SettingsGroupPage group="approval" title="Pengaturan Persetujuan" />,
  '/admin/account-code-format': () => <AccountCodeFormatPage />,
  '/admin/number-format': () => <NumberFormatPage />,
  '/admin/date-format': () => <DateFormatPage />,
  // ── Import ────────────────────────────────────────────────────────────────
  '/admin/import': () => <ErpImportPage />,
  // ── Admin (sys/adm) ───────────────────────────────────────────────────────
  '/admin/users': () => <ErpUsersPage />,
  '/admin/roles': () => <ErpRolesPage />,
  '/admin/settings': () => <ErpSettingsPage />,
  '/admin/permissions': () => <ErpPermissionsPage />,
  '/admin/menus': () => <ErpMenusPage />,
  '/admin/grid-customization': () => <GridCustomizationPage />,
  '/admin/form-builder': () => <FormBuilderPage />,
  '/admin/document-numbering': () => <ErpDocumentNumberingsPage />,
  '/admin/fiscal-periods': () => <ErpFiscalPeriodsPage />,
  '/admin/audit-logs': () => <ErpAuditLogsPage />,
  '/admin/language': () => <ErpLanguagePage />,
  '/admin/users/online': () => <ErpOnlineUsersPage />,
  '/admin/fiscal-periods/close': () => <ErpFiscalPeriodsClosePage />,
  '/admin/tools/recalc-cogs': () => <ErpRecalcCogsPage />,
  '/admin/tools/repost-journal': () => <ErpRepostJournalPage />,
  '/admin/tools/data-validity': () => <ErpDataValidityPage />,
  '/admin/preferences': (ctx) => <SettingsPage t={ctx.t} />,
  // ── Master Data (md) ──────────────────────────────────────────────────────
  '/master/branches': () => <ErpBranchesPage />,
  '/master/items': () => <ErpItemsPage />,
  '/master/units': () => <ErpUnitsPage />,
  '/master/partners': () => <ErpPartnersPage />,
  '/master/vendors': () => <ErpVendorsPage />,
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
  // ── Master Data Legacy Batch (2026-05-20) ─────────────────────────────────
  '/master/colors': () => <ErpColorsPage />,
  '/master/nozzles': () => <ErpNozzlesPage />,
  '/master/oems': () => <ErpOemsPage />,
  '/master/item-permissions': () => <ErpItemPermissionsPage />,
  '/master/brands': () => <ErpBrandsPage />,
  '/master/materials': () => <ErpMaterialsPage />,
  '/master/models': () => <ErpItemModelsPage />,
  '/master/sizes': () => <ErpSizesPage />,
  '/master/sections': () => <ErpSectionsPage />,
  '/master/item-types': () => <ErpItemKindsPage />,
  '/master/product-classes': () => <ErpProductClassesPage />,
  '/master/classes': () => <ErpClassesPage />,
  '/master/banks': () => <ErpBanksPage />,
  '/master/expeditions': () => <ErpExpeditionsPage />,
  '/master/other-costs': () => <ErpOtherCostsPage />,
  '/master/commissions': () => <ErpCommissionsPage />,
  '/master/item-txn-types': () => <ErpItemTransactionTypesPage />,
  '/master/countries': () => <ErpCountriesPage />,
  '/master/provinces': () => <ErpProvincesPage />,
  '/master/cities': () => <ErpCitiesPage />,
  '/master/areas': () => <ErpAreasPage />,
  '/master/item-locations': () => <ErpItemLocationsPage />,
  // PartnerSubCategory: 1 table dengan enum type, 3 menu sidebar share page (decision 2026-05-20)
  '/master/customer-categories': () => <ErpPartnerSubCategoriesPage type="CUSTOMER" />,
  '/master/supplier-categories': () => <ErpPartnerSubCategoriesPage type="SUPPLIER" />,
  '/master/salesman-categories': () => <ErpPartnerSubCategoriesPage type="SALESMAN" />,
  '/master/price-categories': () => <ErpPriceCategoriesPage />,
  '/master/transaction-notes': () => <ErpTransactionNotesPage />,
  '/master/txn-note-details': () => <ErpTxnNoteDetailsPage />,
  '/master/price-indices': () => <ErpPriceIndicesPage />,
  '/master/item-info': () => <ErpItemInformationsPage />,
  // Alias — legacy/long-form path; canonical lives in sys_menus as /master/item-info
  '/master/item-informations': () => <ErpItemInformationsPage />,
  // MD production batch (2026-05-23) — 10 master produksi baru
  '/master/production-categories': () => <ErpProductionCategoriesPage />,
  '/master/point-categories': () => <ErpPointCategoriesPage />,
  '/master/miscellaneous': () => <ErpMiscellaneousPage />,
  '/master/sub-classes': () => <ErpSubClassesPage />,
  '/master/work-estimates': () => <ErpWorkEstimatesPage />,
  '/master/labors': () => <ErpLaborsPage />,
  '/master/machines': () => <ErpMachinesPage />,
  '/master/designers': () => <ErpDesignersPage />,
  '/master/production-activities': () => <ErpProductionActivitiesPage />,
  '/master/production-routes': () => <ErpProductionRoutesPage />,
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
  // ── Legacy short-id aliases for settings routes ───────────────────────────
  'set-appearance': (ctx) => <AppearancePage t={ctx.t} />,
  'set-prefs': (ctx) => <SettingsPage t={ctx.t} />,
  // ── Finance (fin, m2) ─────────────────────────────────────────────────────
  '/finance/general-journals': () => <ErpJournalEntriesPage />,
  '/finance/receipt-memos': () => <ErpArReceiptsPage />,
  '/finance/send-memos': () => <ErpApPaymentsPage />,
  '/finance/ledger': () => <ErpLedgerPage />,
  // /finance/cash-receipts + /finance/cash-disbursements + /finance/bank-receipts
  // + /finance/bank-disbursements → handled by TRX_FORM_PAGES (list + /new + /:id).
  '/finance/cashbank-transfers': () => <ErpCashbankTransfersPage />,
  '/finance/receipt-giros': () => <ErpReceiptGirosPage />,
  '/finance/send-giros': () => <ErpSendGirosPage />,
  '/finance/receipt-giro-clearings': () => <ErpReceiptGiroClearingsPage />,
  '/finance/send-giro-clearings': () => <ErpSendGiroClearingsPage />,
  '/finance/adjustment-journals': () => <ErpAdjustmentJournalsPage />,
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

  // ── ERP pages (seeded sys_menus path = canonical id; short-id aliases) ─────
  const erpPage = ERP_PAGES[route];
  if (erpPage) return erpPage({ t });

  // ── Transaction form pages (list / <base>/new / <base>/:id) ────────────────
  const TrxListPage = TRX_FORM_PAGES[route];
  if (TrxListPage) return <TrxListPage onNavigate={onNavigate} />;
  const trx = resolveTrxFormRoute(route, TRX_BASES);
  if (trx) {
    const TrxFormPageCmp = TRX_FORM_PAGES[trx.base];
    return (
      <TrxFormPageCmp
        formMode={trx.mode}
        recordId={trx.recordId}
        onNavigate={onNavigate}
      />
    );
  }

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
