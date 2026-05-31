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
import { ClinicAuditModule } from './clinic-audit/clinic-audit.module';
import { ClinicWaModule } from './clinic-wa/clinic-wa.module';
import { ClinicPsikologModule } from './clinic-psikolog/clinic-psikolog.module';
import { ClinicServiceModule } from './clinic-service/clinic-service.module';
import { ClinicRoomModule } from './clinic-room/clinic-room.module';
import { ClinicClientModule } from './clinic-client/clinic-client.module';
import { ClinicUsersModule } from './clinic-users/clinic-users.module';
import { ClinicBookingModule } from './clinic-booking/clinic-booking.module';
import { ClinicPaymentModule } from './clinic-payment/clinic-payment.module';
import { ClinicSessionNoteModule } from './clinic-session-note/clinic-session-note.module';
import { ClinicSettingsModule } from './clinic-settings/clinic-settings.module';
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
import { ErpItemLocationsModule } from './erp-item-locations/item-locations.module';
import { ErpPartnerSubCategoriesModule } from './erp-partner-sub-categories/partner-sub-categories.module';
import { ErpPriceCategoriesModule } from './erp-price-categories/price-categories.module';
import { ErpItemInformationsModule } from './erp-item-informations/erp-item-informations.module';
import { ErpPriceIndicesModule } from './erp-price-indices/erp-price-indices.module';
import { ErpItemPermissionsModule } from './erp-item-permissions/item-permissions.module';
import { ErpTransactionNotesModule } from './erp-transaction-notes/transaction-notes.module';
import { ErpTxnNoteDetailsModule } from './erp-txn-note-details/txn-note-details.module';
import { ErpUsersModule } from './erp-users/erp-users.module';
import { ErpRolesModule } from './erp-roles/erp-roles.module';
import { ErpPermissionsModule } from './erp-permissions/erp-permissions.module';
import { ErpBranchesModule } from './erp-branches/erp-branches.module';
import { ErpLocationsModule } from './erp-locations/erp-locations.module';
import { ErpWarehousesModule } from './erp-warehouses/erp-warehouses.module';
import { ErpDivisionsModule } from './erp-divisions/erp-divisions.module';
import { ErpSubDivisionsModule } from './erp-sub-divisions/erp-sub-divisions.module';
import { ErpProjectsModule } from './erp-projects/erp-projects.module';
import { ErpCostCentersModule } from './erp-cost-centers/erp-cost-centers.module';
import { ErpDepartmentsModule } from './erp-departments/erp-departments.module';
import { ErpSubDepartmentsModule } from './erp-sub-departments/erp-sub-departments.module';
import { ErpUnitsModule } from './erp-units/erp-units.module';
import { ErpItemCategoriesModule } from './erp-item-categories/erp-item-categories.module';
import { ErpItemsModule } from './erp-items/erp-items.module';
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
import { ErpFinArReceiptsModule } from './erp-fin-ar-receipts/erp-fin-ar-receipts.module';
import { ErpFinApPaymentsModule } from './erp-fin-ap-payments/erp-fin-ap-payments.module';
import { ErpFinGirosModule } from './erp-fin-giros/erp-fin-giros.module';
import { ErpFinLedgerModule } from './erp-fin-ledger/erp-fin-ledger.module';
import { ErpFinCashBankTransactionsModule } from './erp-fin-cash-bank-transactions/erp-fin-cash-bank-transactions.module';
import { ErpSysTransactionGridsModule } from './erp-sys-transaction-grids/erp-sys-transaction-grids.module';
import { ErpAuditModule } from './erp-audit/erp-audit.module';
import { ErpLanguagesModule } from './erp-languages/erp-languages.module';
import { ErpToolsModule } from './erp-tools/erp-tools.module';

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
    // Clinic domain (Althea Psychology) — see .planning/ADRs/002, 005, 006
    ClinicAuditModule,
    ClinicWaModule,
    ClinicPsikologModule,
    ClinicServiceModule,
    ClinicRoomModule,
    ClinicClientModule,
    ClinicUsersModule,
    ClinicBookingModule,
    ClinicPaymentModule,
    ClinicSessionNoteModule,
    ClinicSettingsModule,
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
    ErpItemLocationsModule,
    ErpPartnerSubCategoriesModule,
    ErpPriceCategoriesModule,
    ErpItemInformationsModule,
    ErpPriceIndicesModule,
    ErpItemPermissionsModule,
    ErpTransactionNotesModule,
    ErpTxnNoteDetailsModule,
    ErpUsersModule,
    ErpRolesModule,
    ErpPermissionsModule,
    ErpBranchesModule,
    ErpLocationsModule,
    ErpWarehousesModule,
    ErpDivisionsModule,
    ErpSubDivisionsModule,
    ErpProjectsModule,
    ErpCostCentersModule,
    ErpDepartmentsModule,
    ErpSubDepartmentsModule,
    ErpUnitsModule,
    ErpItemCategoriesModule,
    ErpItemsModule,
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
    ErpFinArReceiptsModule,
    ErpFinApPaymentsModule,
    ErpFinGirosModule,
    ErpFinLedgerModule,
    ErpFinCashBankTransactionsModule,
    ErpSysTransactionGridsModule,
  ],
  providers: [
    // Global rate limiter (apply to all routes)
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
