import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MenusModule } from './menus/menus.module';
import { MasterDataContactsModule } from './master-data-contacts/master-data-contacts.module';
import { MasterDataUomsModule } from './master-data-uoms/master-data-uoms.module';
import { MasterDataDivisionsModule } from './master-data-divisions/master-data-divisions.module';
import { MasterDataItemsModule } from './master-data-items/master-data-items.module';
import { MasterDataProvincesModule } from './master-data-provinces/master-data-provinces.module';
import { MasterDataCitiesModule } from './master-data-cities/master-data-cities.module';
import { MasterDataCitySlasModule } from './master-data-city-slas/master-data-city-slas.module';
import { MasterDataWarehousesModule } from './master-data-warehouses/master-data-warehouses.module';
import { MasterDataPermissionsModule } from './master-data-permissions/master-data-permissions.module';
import { MasterDataRolesModule } from './master-data-roles/master-data-roles.module';
import { OutboundModule } from './outbound/outbound.module';
import { InboundsModule } from './inbounds/inbounds.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { DepartmentsModule } from './departments/departments.module';
import { SessionsModule } from './sessions/sessions.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HrAttendanceModule } from './hr-attendance/hr-attendance.module';
import { HrLeaveModule } from './hr-leave/hr-leave.module';
import { HrWorkforceModule } from './hr-workforce/hr-workforce.module';
import { HrReportsModule } from './hr-reports/hr-reports.module';
import { HrKioskModule } from './hr-kiosk/hr-kiosk.module';
import { HrHolidaysModule } from './hr-holidays/hr-holidays.module';
import { HrPolicyModule } from './hr-policy/hr-policy.module';
import { HrRolesModule } from './hr-roles/hr-roles.module';
import { HrSysMenusModule } from './hr-sys-menus/hr-sys-menus.module';
import { HrUserPreferencesModule } from './hr-user-preferences/hr-user-preferences.module';
// ERP domain (web-erp)
import { ErpAuthModule } from './erp-auth/erp-auth.module';
// MD legacy batch (2026-05-20)
import { ErpBrandsModule } from './erp-brands/brands.module';
import { ErpMaterialsModule } from './erp-materials/materials.module';
import { ErpItemModelsModule } from './erp-item-models/item-models.module';
import { ErpSizesModule } from './erp-sizes/sizes.module';
import { ErpSectionsModule } from './erp-sections/sections.module';
import { ErpItemKindsModule } from './erp-item-types/item-types.module';
import { ErpProductClassesModule } from './erp-product-classes/product-classes.module';
import { ErpClassesModule } from './erp-classes/classes.module';
import { ErpBanksModule } from './erp-banks/banks.module';
import { ErpExpeditionsModule } from './erp-expeditions/expeditions.module';
import { ErpOtherCostsModule } from './erp-other-costs/other-costs.module';
import { ErpProductionCategoriesModule } from './erp-production-categories/production-categories.module';
import { ErpPointCategoriesModule } from './erp-point-categories/point-categories.module';
import { ErpMiscellaneousModule } from './erp-miscellaneous/miscellaneous.module';
import { ErpSubClassesModule } from './erp-sub-classes/sub-classes.module';
import { ErpWorkEstimatesModule } from './erp-work-estimates/work-estimates.module';
import { ErpLaborsModule } from './erp-labors/labors.module';
import { ErpMachinesModule } from './erp-machines/machines.module';
import { ErpDesignersModule } from './erp-designers/designers.module';
import { ErpProductionActivitiesModule } from './erp-production-activities/production-activities.module';
import { ErpProductionRoutesModule } from './erp-production-routes/production-routes.module';
import { ErpCommissionsModule } from './erp-commissions/commissions.module';
import { ErpItemTransactionTypesModule } from './erp-item-transaction-types/item-transaction-types.module';
import { ErpCountriesModule } from './erp-countries/countries.module';
import { ErpProvincesModule } from './erp-provinces/provinces.module';
import { ErpCitiesModule } from './erp-cities/cities.module';
import { ErpAreasModule } from './erp-areas/areas.module';
import { ErpSubAreasModule } from './erp-sub-areas/sub-areas.module';
import { ErpStorageBinsModule } from './erp-storage-bins/storage-bins.module';
import { ErpPartnerSubCategoriesModule } from './erp-partner-sub-categories/partner-sub-categories.module';
import { ErpPriceCategoriesModule } from './erp-price-categories/price-categories.module';
import { ErpItemInformationsModule } from './erp-item-informations/erp-item-informations.module';
import { ErpPriceIndicesModule } from './erp-price-indices/erp-price-indices.module';
import { ErpTransactionNotesModule } from './erp-transaction-notes/transaction-notes.module';
import { ErpTxnNoteDetailsModule } from './erp-txn-note-details/txn-note-details.module';
import { ErpUsersModule } from './erp-users/erp-users.module';
import { ErpRolesModule } from './erp-roles/erp-roles.module';
import { ErpPermissionsModule } from './erp-permissions/erp-permissions.module';
import { ErpBranchesModule } from './erp-branches/erp-branches.module';
import { ErpLocationsModule } from './erp-locations/erp-locations.module';
import { ErpWarehousesModule } from './erp-warehouses/erp-warehouses.module';
import { ErpMdpWorkCentersModule } from './erp-mdp-work-centers/erp-mdp-work-centers.module';
import { ErpMdpProductionOrdersModule } from './erp-mdp-production-orders/erp-mdp-production-orders.module';
import { ErpMdpShiftsModule } from './erp-mdp-shifts/erp-mdp-shifts.module';
import { ErpMdpReasonCodesModule } from './erp-mdp-reason-codes/erp-mdp-reason-codes.module';
import { ErpMdpAssetsModule } from './erp-mdp-assets/erp-mdp-assets.module';
import { ErpMdpProductionLogsModule } from './erp-mdp-production-logs/erp-mdp-production-logs.module';
import { ErpMdpDowntimeEventsModule } from './erp-mdp-downtime-events/erp-mdp-downtime-events.module';
import { ErpMdpOperationsModule } from './erp-mdp-operations/erp-mdp-operations.module';
import { ErpMdpMaterialConsumptionsModule } from './erp-mdp-material-consumptions/erp-mdp-material-consumptions.module';
import { ErpMdpLaborLogsModule } from './erp-mdp-labor-logs/erp-mdp-labor-logs.module';
import { ErpMdpWorkCalendarsModule } from './erp-mdp-work-calendars/erp-mdp-work-calendars.module';
import { ErpMdpMenusModule } from './erp-mdp-menus/erp-mdp-menus.module';
import { ErpMdpRoleMenusModule } from './erp-mdp-role-menus/erp-mdp-role-menus.module';
import { ErpMdpWmsTasksModule } from './erp-mdp-wms-tasks/erp-mdp-wms-tasks.module';
import { ErpMdpWmsHandlingUnitsModule } from './erp-mdp-wms-handling-units/erp-mdp-wms-handling-units.module';
import { ErpMdpWmsPicksModule } from './erp-mdp-wms-picks/erp-mdp-wms-picks.module';
import { ErpMdpWmsMovementsModule } from './erp-mdp-wms-movements/erp-mdp-wms-movements.module';
import { ErpMdpQmsPlansModule } from './erp-mdp-qms-plans/erp-mdp-qms-plans.module';
import { ErpMdpQmsCharacteristicsModule } from './erp-mdp-qms-characteristics/erp-mdp-qms-characteristics.module';
import { ErpMdpQmsInspectionsModule } from './erp-mdp-qms-inspections/erp-mdp-qms-inspections.module';
import { ErpMdpQmsResultsModule } from './erp-mdp-qms-results/erp-mdp-qms-results.module';
import { ErpMdpQmsNonconformancesModule } from './erp-mdp-qms-nonconformances/erp-mdp-qms-nonconformances.module';
import { ErpMdpQmsCapaActionsModule } from './erp-mdp-qms-capa-actions/erp-mdp-qms-capa-actions.module';
import { ErpMdpMntWorkOrdersModule } from './erp-mdp-mnt-work-orders/erp-mdp-mnt-work-orders.module';
import { ErpMdpMntPmSchedulesModule } from './erp-mdp-mnt-pm-schedules/erp-mdp-mnt-pm-schedules.module';
import { ErpMdpMntFailureCodesModule } from './erp-mdp-mnt-failure-codes/erp-mdp-mnt-failure-codes.module';
import { ErpMdpMntSparePartsModule } from './erp-mdp-mnt-spare-parts/erp-mdp-mnt-spare-parts.module';
import { ErpMdpPrtIssuesModule } from './erp-mdp-prt-issues/erp-mdp-prt-issues.module';
import { ErpMdpPrtEscalationsModule } from './erp-mdp-prt-escalations/erp-mdp-prt-escalations.module';
import { ErpMdpDmsDocumentsModule } from './erp-mdp-dms-documents/erp-mdp-dms-documents.module';
import { ErpMdpDmsRevisionsModule } from './erp-mdp-dms-revisions/erp-mdp-dms-revisions.module';
import { ErpMdpDmsAcknowledgementsModule } from './erp-mdp-dms-acknowledgements/erp-mdp-dms-acknowledgements.module';
import { ErpMdpEhsIncidentsModule } from './erp-mdp-ehs-incidents/erp-mdp-ehs-incidents.module';
import { ErpMdpEhsAuditsModule } from './erp-mdp-ehs-audits/erp-mdp-ehs-audits.module';
import { ErpMdpEhsPermitsModule } from './erp-mdp-ehs-permits/erp-mdp-ehs-permits.module';
import { ErpMdpLmsCoursesModule } from './erp-mdp-lms-courses/erp-mdp-lms-courses.module';
import { ErpMdpLmsEnrollmentsModule } from './erp-mdp-lms-enrollments/erp-mdp-lms-enrollments.module';
import { ErpMdpLmsCompetenciesModule } from './erp-mdp-lms-competencies/erp-mdp-lms-competencies.module';
import { ErpMdpOeeModule } from './erp-mdp-oee/erp-mdp-oee.module';
import { ErpDivisionsModule } from './erp-divisions/erp-divisions.module';
import { ErpSubDivisionsModule } from './erp-sub-divisions/erp-sub-divisions.module';
import { ErpProjectsModule } from './erp-projects/erp-projects.module';
import { ErpCostCentersModule } from './erp-cost-centers/erp-cost-centers.module';
import { ErpDepartmentsModule } from './erp-departments/erp-departments.module';
import { ErpSubDepartmentsModule } from './erp-sub-departments/erp-sub-departments.module';
import { ErpUnitsModule } from './erp-units/erp-units.module';
import { ErpItemCategoriesModule } from './erp-item-categories/erp-item-categories.module';
import { ErpItemsModule } from './erp-items/erp-items.module';
import { ErpAttachmentsModule } from './erp-attachments/erp-attachments.module';
import { ErpPartnerCategoriesModule } from './erp-partner-categories/erp-partner-categories.module';
import { ErpPartnersModule } from './erp-partners/erp-partners.module';
import { ErpColorsModule } from './erp-colors/erp-colors.module';
import { ErpNozzlesModule } from './erp-nozzles/nozzles.module';
import { ErpOemsModule } from './erp-oems/oems.module';
import { ErpCurrenciesModule } from './erp-currencies/erp-currencies.module';
import { ErpAccountsModule } from './erp-accounts/erp-accounts.module';
import { ErpTaxesModule } from './erp-taxes/erp-taxes.module';
import { ErpPaymentTermsModule } from './erp-payment-terms/erp-payment-terms.module';
import { ErpSettingsModule } from './erp-settings/erp-settings.module';
import { ErpUserPreferencesModule } from './erp-user-preferences/erp-user-preferences.module';
import { ErpNotificationsModule } from './erp-notifications/erp-notifications.module';
import { ErpSysMenusModule } from './erp-sys-menus/erp-sys-menus.module';
import { ErpDocumentNumberingsModule } from './erp-document-numberings/erp-document-numberings.module';
import { ErpFiscalPeriodsModule } from './erp-fiscal-periods/erp-fiscal-periods.module';
import { ErpFinJournalEntriesModule } from './erp-fin-journal-entries/erp-fin-journal-entries.module';
import { ErpFinGiroEntriesModule } from './erp-fin-giro-entries/erp-fin-giro-entries.module';
import { ErpFinArReceiptsModule } from './erp-fin-ar-receipts/erp-fin-ar-receipts.module';
import { ErpFinApPaymentsModule } from './erp-fin-ap-payments/erp-fin-ap-payments.module';
import { ErpFinGirosModule } from './erp-fin-giros/erp-fin-giros.module';
import { ErpFinLedgerModule } from './erp-fin-ledger/erp-fin-ledger.module';
import { ErpFinReportsModule } from './erp-fin-reports/erp-fin-reports.module';
import { ErpFinCashBankTransactionsModule } from './erp-fin-cash-bank-transactions/erp-fin-cash-bank-transactions.module';
import { ErpSlsOrdersModule } from './erp-sls-orders/erp-sls-orders.module';
import { ErpSlsQuotationsModule } from './erp-sls-quotations/erp-sls-quotations.module';
import { ErpSlsProformaInvoicesModule } from './erp-sls-proforma-invoices/erp-sls-proforma-invoices.module';
import { ErpSlsPackingListsModule } from './erp-sls-packing-lists/erp-sls-packing-lists.module';
import { ErpSlsDeliveryOrdersModule } from './erp-sls-delivery-orders/erp-sls-delivery-orders.module';
import { ErpSlsDeliveryReportsModule } from './erp-sls-delivery-reports/erp-sls-delivery-reports.module';
import { ErpSlsInvoicesModule } from './erp-sls-invoices/erp-sls-invoices.module';
import { ErpSlsReturnsModule } from './erp-sls-returns/erp-sls-returns.module';
import { ErpSlsReturnReceiptsModule } from './erp-sls-return-receipts/erp-sls-return-receipts.module';
import { ErpSlsCustomerAdvancesModule } from './erp-sls-customer-advances/erp-sls-customer-advances.module';
import { ErpSlsInvoiceSwapsModule } from './erp-sls-invoice-swaps/erp-sls-invoice-swaps.module';
import { ErpInvStockMovementsModule } from './erp-inv-stock-movements/erp-inv-stock-movements.module';
import { ErpInvStockAdjustmentsModule } from './erp-inv-stock-adjustments/erp-inv-stock-adjustments.module';
import { ErpInvOpeningStocksModule } from './erp-inv-opening-stocks/erp-inv-opening-stocks.module';
import { ErpInvStockCountsModule } from './erp-inv-stock-counts/erp-inv-stock-counts.module';
import { ErpInvPriceAdjustmentsModule } from './erp-inv-price-adjustments/erp-inv-price-adjustments.module';
import { ErpInvWeighbridgeTicketsModule } from './erp-inv-weighbridge-tickets/erp-inv-weighbridge-tickets.module';
import { ErpInvReportsModule } from './erp-inv-reports/erp-inv-reports.module';
import { ErpInvStatsModule } from './erp-inv-stats/erp-inv-stats.module';
import { ErpPurReportsModule } from './erp-pur-reports/erp-pur-reports.module';
import { ErpSlsReportsModule } from './erp-sls-reports/erp-sls-reports.module';
import { ErpInvDailyChecksModule } from './erp-inv-daily-checks/erp-inv-daily-checks.module';
import { ErpPurOrdersModule } from './erp-pur-orders/erp-pur-orders.module';
import { ErpPurRequisitionsModule } from './erp-pur-requisitions/erp-pur-requisitions.module';
import { ErpPurInvoicesModule } from './erp-pur-invoices/erp-pur-invoices.module';
import { ErpPurReturnsModule } from './erp-pur-returns/erp-pur-returns.module';
import { ErpPurGoodsReceiptsModule } from './erp-pur-goods-receipts/erp-pur-goods-receipts.module';
import { ErpPurRfqsModule } from './erp-pur-rfqs/erp-pur-rfqs.module';
import { ErpPurBidSelectionsModule } from './erp-pur-bid-selections/erp-pur-bid-selections.module';
import { ErpSysTransactionGridsModule } from './erp-sys-transaction-grids/erp-sys-transaction-grids.module';
import { ErpFormFieldsModule } from './erp-form-fields/erp-form-fields.module';
import { ErpAuditModule } from './erp-audit/erp-audit.module';
import { ErpLanguagesModule } from './erp-languages/erp-languages.module';
import { ErpToolsModule } from './erp-tools/erp-tools.module';
import { ErpBankAccountsModule } from './erp-bank-accounts/erp-bank-accounts.module';
import { ErpApprovalRulesModule } from './erp-approval-rules/erp-approval-rules.module';
import { ErpRoleDocPoliciesModule } from './erp-role-doc-policies/erp-role-doc-policies.module';
import { ErpHomeWidgetsModule } from './erp-home-widgets/erp-home-widgets.module';
import { ErpImportModule } from './erp-import/erp-import.module';
import { ErpReportsModule } from './erp-reports/erp-reports.module';
import { ErpMfgBomsModule } from './erp-mfg-boms/erp-mfg-boms.module';
import { ErpMfgWorkOrdersModule } from './erp-mfg-work-orders/erp-mfg-work-orders.module';
import { ErpSlsArCollectionsModule } from './erp-sls-ar-collections/erp-sls-ar-collections.module';
import { ErpPurVendorAdvancesModule } from './erp-pur-vendor-advances/erp-pur-vendor-advances.module';
import { ErpPurFreightPayablesModule } from './erp-pur-freight-payables/erp-pur-freight-payables.module';
import { ErpPurPaymentSchedulesModule } from './erp-pur-payment-schedules/erp-pur-payment-schedules.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Rate limit: env-tunable (default 600 req / 60s). Internal staff
    // dashboard fires 10+ parallel queries on load (today, week-range,
    // settings, rooms, services), jadi global 60/min terlalu tight dan
    // bikin 429. Per-route override via @Throttle / @SkipThrottle decorator.
    // Override prod via THROTTLE_LIMIT=N / THROTTLE_TTL=ms di .env.
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => [
        {
          ttl: cfg.get<number>('THROTTLE_TTL', 60_000),
          limit: cfg.get<number>('THROTTLE_LIMIT', 600),
        },
      ],
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    MenusModule,
    MasterDataContactsModule,
    MasterDataUomsModule,
    MasterDataDivisionsModule,
    MasterDataItemsModule,
    MasterDataProvincesModule,
    MasterDataCitiesModule,
    MasterDataCitySlasModule,
    MasterDataWarehousesModule,
    MasterDataPermissionsModule,
    MasterDataRolesModule,
    OutboundModule,
    InboundsModule,
    AuditLogsModule,
    DepartmentsModule,
    SessionsModule,
    DashboardModule,
    HrAttendanceModule,
    HrLeaveModule,
    HrWorkforceModule,
    HrReportsModule,
    HrKioskModule,
    HrHolidaysModule,
    HrPolicyModule,
    HrRolesModule,
    HrSysMenusModule,
    HrUserPreferencesModule,
    // ERP domain (web-erp) — auth + admin + org + items + partners + finance + system config
    ErpAuthModule,
    // MD legacy batch (2026-05-20)
    ErpBrandsModule,
    ErpMaterialsModule,
    ErpItemModelsModule,
    ErpSizesModule,
    ErpSectionsModule,
    ErpItemKindsModule,
    ErpProductClassesModule,
    ErpClassesModule,
    ErpBanksModule,
    ErpExpeditionsModule,
    ErpOtherCostsModule,
    ErpProductionCategoriesModule,
    ErpPointCategoriesModule,
    ErpMiscellaneousModule,
    ErpSubClassesModule,
    ErpWorkEstimatesModule,
    ErpLaborsModule,
    ErpMachinesModule,
    ErpDesignersModule,
    ErpProductionActivitiesModule,
    ErpProductionRoutesModule,
    ErpCommissionsModule,
    ErpItemTransactionTypesModule,
    ErpCountriesModule,
    ErpProvincesModule,
    ErpCitiesModule,
    ErpAreasModule,
    ErpSubAreasModule,
    ErpStorageBinsModule,
    ErpPartnerSubCategoriesModule,
    ErpPriceCategoriesModule,
    ErpItemInformationsModule,
    ErpPriceIndicesModule,
    ErpTransactionNotesModule,
    ErpTxnNoteDetailsModule,
    ErpUsersModule,
    ErpRolesModule,
    ErpPermissionsModule,
    ErpBranchesModule,
    ErpLocationsModule,
    ErpWarehousesModule,
    ErpMdpWorkCentersModule,
    ErpMdpProductionOrdersModule,
    ErpMdpShiftsModule,
    ErpMdpReasonCodesModule,
    ErpMdpAssetsModule,
    ErpMdpProductionLogsModule,
    ErpMdpDowntimeEventsModule,
    ErpMdpOperationsModule,
    ErpMdpMaterialConsumptionsModule,
    ErpMdpLaborLogsModule,
    ErpMdpWorkCalendarsModule,
    ErpMdpMenusModule,
    ErpMdpRoleMenusModule,
    ErpMdpWmsTasksModule,
    ErpMdpWmsHandlingUnitsModule,
    ErpMdpWmsPicksModule,
    ErpMdpWmsMovementsModule,
    ErpMdpQmsPlansModule,
    ErpMdpQmsCharacteristicsModule,
    ErpMdpQmsInspectionsModule,
    ErpMdpQmsResultsModule,
    ErpMdpQmsNonconformancesModule,
    ErpMdpQmsCapaActionsModule,
    ErpMdpMntWorkOrdersModule,
    ErpMdpMntPmSchedulesModule,
    ErpMdpMntFailureCodesModule,
    ErpMdpMntSparePartsModule,
    ErpMdpPrtIssuesModule,
    ErpMdpPrtEscalationsModule,
    ErpMdpDmsDocumentsModule,
    ErpMdpDmsRevisionsModule,
    ErpMdpDmsAcknowledgementsModule,
    ErpMdpEhsIncidentsModule,
    ErpMdpEhsAuditsModule,
    ErpMdpEhsPermitsModule,
    ErpMdpLmsCoursesModule,
    ErpMdpLmsEnrollmentsModule,
    ErpMdpLmsCompetenciesModule,
    ErpMdpOeeModule,
    ErpDivisionsModule,
    ErpSubDivisionsModule,
    ErpProjectsModule,
    ErpCostCentersModule,
    ErpDepartmentsModule,
    ErpSubDepartmentsModule,
    ErpUnitsModule,
    ErpItemCategoriesModule,
    ErpItemsModule,
    ErpAttachmentsModule,
    ErpPartnerCategoriesModule,
    ErpPartnersModule,
    ErpColorsModule,
    ErpNozzlesModule,
    ErpOemsModule,
    ErpCurrenciesModule,
    ErpAccountsModule,
    ErpTaxesModule,
    ErpPaymentTermsModule,
    ErpSettingsModule,
    ErpUserPreferencesModule,
    ErpNotificationsModule,
    ErpSysMenusModule,
    ErpDocumentNumberingsModule,
    ErpFiscalPeriodsModule,
    ErpAuditModule,
    ErpLanguagesModule,
    ErpToolsModule,
    // ERP m2 Finance (skeleton CRUD)
    ErpFinJournalEntriesModule,
    ErpFinGiroEntriesModule,
    ErpFinArReceiptsModule,
    ErpFinApPaymentsModule,
    // ERP Purchasing — Payment Schedules (VPP) — Jadwal Pembayaran Vendor M4.TX.VPP
    ErpPurPaymentSchedulesModule,
    ErpPurFreightPayablesModule,
    ErpFinGirosModule,
    ErpFinLedgerModule,
    ErpFinReportsModule,
    ErpFinCashBankTransactionsModule,
    ErpSlsOrdersModule,
    ErpSlsQuotationsModule,
    ErpSlsProformaInvoicesModule,
    ErpSlsPackingListsModule,
    ErpSlsDeliveryOrdersModule,
    ErpSlsDeliveryReportsModule,
    ErpSlsInvoicesModule,
    ErpSlsReturnsModule,
    ErpSlsReturnReceiptsModule,
    ErpSlsCustomerAdvancesModule,
    ErpSlsInvoiceSwapsModule,
    ErpInvStockMovementsModule,
    ErpInvStockAdjustmentsModule,
    ErpInvOpeningStocksModule,
    ErpInvStockCountsModule,
    ErpInvPriceAdjustmentsModule,
    ErpInvReportsModule,
    ErpInvStatsModule,
    ErpPurReportsModule,
    ErpSlsReportsModule,
    ErpInvWeighbridgeTicketsModule,
    ErpInvDailyChecksModule,
    ErpPurOrdersModule,
    ErpPurRequisitionsModule,
    ErpPurInvoicesModule,
    ErpPurReturnsModule,
    ErpPurGoodsReceiptsModule,
    ErpPurRfqsModule,
    ErpPurBidSelectionsModule,
    ErpSysTransactionGridsModule,
    ErpFormFieldsModule,
    ErpBankAccountsModule,
    ErpApprovalRulesModule,
    ErpRoleDocPoliciesModule,
    ErpHomeWidgetsModule,
    ErpImportModule,
    ErpReportsModule,
    ErpMfgBomsModule,
    ErpMfgWorkOrdersModule,
    // ERP Sales — AR Collections (IC) — Penagihan Piutang M5.TX.IC
    ErpSlsArCollectionsModule,
    // ERP Purchasing — Vendor Advances (AP) — Uang Muka Pembelian M4.TX.AP
    ErpPurVendorAdvancesModule,
  ],
  providers: [
    // Global rate limiter (apply to all routes)
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
