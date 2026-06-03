/**
 * Shell route renderer — maps a route string to the correct page component.
 * TRX_FORM_PAGES extracted to shell-trx-pages.ts to stay under 400 lines.
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
// Admin pages
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
import { ErpBankAccountsPage } from '@/components/pages/bank-accounts-page';
import { ErpApprovalRulesPage } from '@/components/pages/approval-rules-page';
import { ErpHomeLayoutPage } from '@/components/pages/home-layout-page';
// Master Data pages
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
// Finance (m2) static (non-TRX) pages
import { ErpArReceiptsPage } from '@/components/pages/fin-ar-receipts-page';
import { ErpApPaymentsPage } from '@/components/pages/fin-ap-payments-page';
import { ErpLedgerPage } from '@/components/pages/fin-ledger-page';
import { ErpTrialBalancePage } from '@/components/pages/fin-trial-balance-page';
import { ErpBalanceSheetPage } from '@/components/pages/fin-balance-sheet-page';
import { ErpIncomeStatementPage } from '@/components/pages/fin-income-statement-page';
import { ErpCashFlowPage } from '@/components/pages/fin-cash-flow-page';
import { ErpDailyCashBankPage } from '@/components/pages/fin-daily-cash-bank-page';
import { ErpArCardPage } from '@/components/pages/fin-ar-card-page';
import { ErpArAgingPage } from '@/components/pages/fin-ar-aging-page';
import { ErpApCardPage } from '@/components/pages/fin-ap-card-page';
import { ErpApAgingPage } from '@/components/pages/fin-ap-aging-page';
import { ErpGiroMaturityPage } from '@/components/pages/fin-giro-maturity-page';
import { ErpBudgetRealizationPage } from '@/components/pages/fin-budget-realization-page';
import { ErpCashbankTransfersPage } from '@/components/pages/fin-cashbank-transfers-page';
// Admin tools & misc
import { ErpAuditLogsPage } from '@/components/pages/audit-logs-page';
import { ErpLanguagePage } from '@/components/pages/language-page';
import { ErpOnlineUsersPage } from '@/components/pages/online-users-page';
import { ErpFiscalPeriodsClosePage } from '@/components/pages/fiscal-periods-close-page';
import { ErpRecalcCogsPage } from '@/components/pages/tools-recalc-cogs-page';
import { ErpRepostJournalPage } from '@/components/pages/tools-repost-journal-page';
import { ErpDataValidityPage } from '@/components/pages/tools-data-validity-page';
import { SettingsGroupPage } from '@/components/pages/settings-group-page';
import { AccountCodeFormatPage } from '@/components/pages/account-code-format-page';
import { NumberFormatPage } from '@/components/pages/number-format-page';
import { DateFormatPage } from '@/components/pages/date-format-page';
import { ErpImportPage } from '@/components/pages/import-page';
import { REGISTRY, MODULES, REPORTS } from '@/lib/registry';
import { resolveTrxFormRoute } from '@/lib/trx-route';
import { TRX_FORM_PAGES } from './shell-trx-pages';
import { DocumentRegisterPage } from '@/components/organisms/document-register-page';
import { REGISTER_CONFIGS } from '@/lib/registers';
import type { Lang } from '@/lib/shell-constants';
import { InvReportPage } from '@/components/pages/inv-report-page';
import { invReportOptions } from '@/lib/inv-report-options';
import { PurReportPage } from '@/components/pages/pur-report-page';
import { purReportOptions } from '@/lib/pur-report-options';
import {
  SlsRptQuotationsPage, SlsRptOrdersPage, SlsRptCustomerAdvancesPage,
  SlsRptPaymentReceiptsPage, SlsRptProformaInvoicesPage, SlsRptPackingListsPage,
  SlsRptDeliveryOrdersPage, SlsRptDeliveryReportsPage, SlsRptInvoicesPage,
  SlsRptFreightReceivablesPage, SlsRptReturnReceiptsPage, SlsRptReturnsPage,
  SlsRptArCollectionsPage, SlsRptArPaymentsPage, SlsRptInvoiceSwapsPage,
  SlsRptOpeningArBalancePage,
} from '@/components/pages/sls-report-doc-pages';
import {
  SlsSummaryPage, SlsByCustomerPage, SlsBySalesmanPage, SlsByItemPage,
  SlsByProjectPage, SlsByDivisionPage, SlsByCostCenterPage, SlsByItemCategoryPage,
  SlsRevenueCollectionPage, SlsByGroupPage,
} from '@/components/pages/sls-report-analytics-pages';

const TRX_BASES = Object.keys(TRX_FORM_PAGES);

/** Base path for the generic Warehouse (M3) report pages. */
const INV_REPORT_PREFIX = '/warehouse/reports/';

/** Base path for the generic Purchasing (M4) report pages. */
const PUR_REPORT_PREFIX = '/purchasing/reports/';

interface ErpPageCtx {
  t: ReturnType<typeof makeTranslator>;
}

const ERP_PAGES: Record<string, (ctx: ErpPageCtx) => React.ReactNode> = {
  '/admin/settings/company': () => <SettingsGroupPage group="company" title="Pengaturan Perusahaan" />,
  '/admin/settings/accounting': () => <SettingsGroupPage group="accounting" title="Pengaturan Akuntansi" />,
  '/admin/settings/bank-accounts': () => <ErpBankAccountsPage />,
  '/admin/settings/tax': () => <SettingsGroupPage group="tax" title="Pengaturan Pajak" />,
  '/admin/settings/description': () => <SettingsGroupPage group="description" title="Deskripsi Dokumen" />,
  '/admin/settings/format': () => <SettingsGroupPage group="format" title="Format Tampilan" />,
  '/admin/settings/defaults': () => <SettingsGroupPage group="defaults" title="Nilai Default" />,
  '/admin/settings/report-defaults': () => <SettingsGroupPage group="report-defaults" title="Default Laporan" />,
  '/admin/settings/signature': () => <SettingsGroupPage group="signature" title="Tanda Tangan" />,
  '/admin/settings/options': () => <SettingsGroupPage group="options" title="Opsi Lanjutan" />,
  '/admin/settings/home': () => <ErpHomeLayoutPage />,
  '/admin/settings/approval': () => <ErpApprovalRulesPage />,
  '/admin/account-code-format': () => <AccountCodeFormatPage />,
  '/admin/number-format': () => <NumberFormatPage />,
  '/admin/date-format': () => <DateFormatPage />,
  '/admin/import': () => <ErpImportPage />,
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
  '/master/customer-categories': () => <ErpPartnerSubCategoriesPage type="CUSTOMER" />,
  '/master/supplier-categories': () => <ErpPartnerSubCategoriesPage type="SUPPLIER" />,
  '/master/salesman-categories': () => <ErpPartnerSubCategoriesPage type="SALESMAN" />,
  '/master/price-categories': () => <ErpPriceCategoriesPage />,
  '/master/transaction-notes': () => <ErpTransactionNotesPage />,
  '/master/txn-note-details': () => <ErpTxnNoteDetailsPage />,
  '/master/price-indices': () => <ErpPriceIndicesPage />,
  '/master/item-info': () => <ErpItemInformationsPage />,
  '/master/item-informations': () => <ErpItemInformationsPage />,
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
  '/org/branches': () => <ErpBranchesPage />,
  '/org/locations': () => <ErpLocationsPage />,
  '/org/warehouses': () => <ErpWarehousesPage />,
  '/org/divisions': () => <ErpDivisionsPage />,
  '/org/sub-divisions': () => <ErpSubDivisionsPage />,
  '/org/projects': () => <ErpProjectsPage />,
  '/org/cost-centers': () => <ErpCostCentersPage />,
  '/org/departments': () => <ErpDepartmentsPage />,
  '/org/sub-departments': () => <ErpSubDepartmentsPage />,
  '/settings/appearance': (ctx) => <AppearancePage t={ctx.t} />,
  'set-appearance': (ctx) => <AppearancePage t={ctx.t} />,
  'set-prefs': (ctx) => <SettingsPage t={ctx.t} />,
  '/finance/receipt-memos': () => <ErpArReceiptsPage />,
  '/finance/send-memos': () => <ErpApPaymentsPage />,
  '/finance/ledger': () => <ErpLedgerPage />,
  '/finance/trial-balance': () => <ErpTrialBalancePage />,
  '/finance/balance-sheet': () => <ErpBalanceSheetPage />,
  '/finance/income-statement': () => <ErpIncomeStatementPage />,
  '/finance/cash-flow': () => <ErpCashFlowPage />,
  '/finance/daily-cash-bank': () => <ErpDailyCashBankPage />,
  '/finance/ar-card': () => <ErpArCardPage />,
  '/finance/ar-aging': () => <ErpArAgingPage />,
  '/finance/ap-card': () => <ErpApCardPage />,
  '/finance/ap-aging': () => <ErpApAgingPage />,
  '/finance/giro-maturity': () => <ErpGiroMaturityPage />,
  '/finance/budget-realization': () => <ErpBudgetRealizationPage />,
  '/finance/cashbank-transfers': () => <ErpCashbankTransfersPage />,
  // Sales (M5) reports
  '/sales/reports/quotations': () => <SlsRptQuotationsPage />,
  '/sales/reports/orders': () => <SlsRptOrdersPage />,
  '/sales/reports/customer-advances': () => <SlsRptCustomerAdvancesPage />,
  '/sales/reports/payment-receipts': () => <SlsRptPaymentReceiptsPage />,
  '/sales/reports/proforma-invoices': () => <SlsRptProformaInvoicesPage />,
  '/sales/reports/packing-lists': () => <SlsRptPackingListsPage />,
  '/sales/reports/delivery-orders': () => <SlsRptDeliveryOrdersPage />,
  '/sales/reports/delivery-reports': () => <SlsRptDeliveryReportsPage />,
  '/sales/reports/invoices': () => <SlsRptInvoicesPage />,
  '/sales/reports/freight-receivables': () => <SlsRptFreightReceivablesPage />,
  '/sales/reports/return-receipts': () => <SlsRptReturnReceiptsPage />,
  '/sales/reports/returns': () => <SlsRptReturnsPage />,
  '/sales/reports/ar-collections': () => <SlsRptArCollectionsPage />,
  '/sales/reports/ar-payments': () => <SlsRptArPaymentsPage />,
  '/sales/reports/invoice-swaps': () => <SlsRptInvoiceSwapsPage />,
  '/sales/reports/opening-ar-balance': () => <SlsRptOpeningArBalancePage />,
  '/sales/reports/summary': () => <SlsSummaryPage />,
  '/sales/reports/by-customer': () => <SlsByCustomerPage />,
  '/sales/reports/by-salesman': () => <SlsBySalesmanPage />,
  '/sales/reports/by-item': () => <SlsByItemPage />,
  '/sales/reports/by-project': () => <SlsByProjectPage />,
  '/sales/reports/by-division': () => <SlsByDivisionPage />,
  '/sales/reports/by-cost-center': () => <SlsByCostCenterPage />,
  '/sales/reports/by-item-category': () => <SlsByItemCategoryPage />,
  '/sales/reports/revenue-collection': () => <SlsRevenueCollectionPage />,
  '/sales/reports/by-group': () => <SlsByGroupPage />,
  // Legacy aliases
  'adm-users': () => <ErpUsersPage />,
  'adm-roles': () => <ErpRolesPage />,
  'adm-branches': () => <ErpBranchesPage />,
  'adm-settings': () => <ErpSettingsPage />,
  'md-items': () => <ErpItemsPage />,
  'md-units': () => <ErpUnitsPage />,
  'md-partners': () => <ErpPartnersPage />,
  'md-item-categories': () => <ErpItemCategoriesPage />,
};

function resolveNewRoute(route: string): string | null {
  if (!route.endsWith('-new')) return null;
  return route.slice(0, -'-new'.length);
}

export function renderRoute(
  route: string,
  onNavigate: (r: string) => void,
  onOpenTab: (r: string) => void,
  t: ReturnType<typeof makeTranslator>,
  lang: Lang,
): React.ReactNode {
  if (route === 'home') return <Dashboard t={t} onNavigate={onOpenTab} />;
  if (route === 'statistik') return <Statistik t={t} onNavigate={onOpenTab} />;

  const erpPage = ERP_PAGES[route];
  if (erpPage) return erpPage({ t });

  // ── Warehouse (M3) reports: one generic page driven by the report key ──────
  if (route.startsWith(INV_REPORT_PREFIX)) {
    const reportKey = route.slice(INV_REPORT_PREFIX.length);
    if (reportKey) {
      const opt = invReportOptions(reportKey);
      return (
        <InvReportPage
          reportKey={reportKey}
          title={opt.title}
          asOfMode={opt.asOfMode}
          showItem={opt.showItem}
          statusOptions={opt.statusOptions}
        />
      );
    }
  }

  // ── Purchasing (M4) reports: one generic page driven by the report key ──────
  if (route.startsWith(PUR_REPORT_PREFIX)) {
    const reportKey = route.slice(PUR_REPORT_PREFIX.length);
    if (reportKey) {
      const opt = purReportOptions(reportKey);
      return (
        <PurReportPage
          reportKey={reportKey}
          title={opt.title}
          showVendor={opt.showVendor}
          showItem={opt.showItem}
          statusOptions={opt.statusOptions}
        />
      );
    }
  }

  // ── Read-only "Data" registers (legacy DATA group): one config-driven page ──
  const registerCfg = REGISTER_CONFIGS[route];
  if (registerCfg) return <DocumentRegisterPage config={registerCfg} onNavigate={onNavigate} />;

  // Serial Item Cards "Data" entry is a report, not a document register.
  if (route === '/warehouse/data/serial-cards') {
    const opt = invReportOptions('serial-cards');
    return (
      <InvReportPage
        reportKey="serial-cards"
        title={opt.title}
        asOfMode={opt.asOfMode}
        showItem={opt.showItem}
        statusOptions={opt.statusOptions}
      />
    );
  }

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
      return <TrxForm moduleId={baseRoute} t={t} lang={lang} onNavigate={onNavigate} />;
    if (REGISTRY[baseRoute])
      return <RecordForm moduleId={baseRoute} t={t} onNavigate={onNavigate} />;
    return <ComingSoon route={route} />;
  }

  if (MODULES[route])
    return <GenericList moduleId={route} t={t} lang={lang} onNavigate={onNavigate} onOpenTab={onOpenTab} />;
  if (REPORTS[route]) return <FinancialReport moduleId={route} t={t} />;
  if (REGISTRY[route])
    return <DataList moduleId={route} t={t} onNavigate={onNavigate} onOpenTab={onOpenTab} />;
  return <ComingSoon route={route} />;
}
