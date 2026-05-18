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
import { ErpUsersModule } from './erp-users/erp-users.module';
import { ErpRolesModule } from './erp-roles/erp-roles.module';
import { ErpPermissionsModule } from './erp-permissions/erp-permissions.module';
import { ErpBranchesModule } from './erp-branches/erp-branches.module';
import { ErpLocationsModule } from './erp-locations/erp-locations.module';
import { ErpWarehousesModule } from './erp-warehouses/erp-warehouses.module';
import { ErpUnitsModule } from './erp-units/erp-units.module';
import { ErpItemCategoriesModule } from './erp-item-categories/erp-item-categories.module';
import { ErpItemsModule } from './erp-items/erp-items.module';
import { ErpPartnerCategoriesModule } from './erp-partner-categories/erp-partner-categories.module';
import { ErpPartnersModule } from './erp-partners/erp-partners.module';
import { ErpCurrenciesModule } from './erp-currencies/erp-currencies.module';
import { ErpAccountsModule } from './erp-accounts/erp-accounts.module';
import { ErpTaxesModule } from './erp-taxes/erp-taxes.module';
import { ErpPaymentTermsModule } from './erp-payment-terms/erp-payment-terms.module';
import { ErpSettingsModule } from './erp-settings/erp-settings.module';
import { ErpSysMenusModule } from './erp-sys-menus/erp-sys-menus.module';
import { ErpDocumentNumberingsModule } from './erp-document-numberings/erp-document-numberings.module';
import { ErpFiscalPeriodsModule } from './erp-fiscal-periods/erp-fiscal-periods.module';

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
    ErpUsersModule,
    ErpRolesModule,
    ErpPermissionsModule,
    ErpBranchesModule,
    ErpLocationsModule,
    ErpWarehousesModule,
    ErpUnitsModule,
    ErpItemCategoriesModule,
    ErpItemsModule,
    ErpPartnerCategoriesModule,
    ErpPartnersModule,
    ErpCurrenciesModule,
    ErpAccountsModule,
    ErpTaxesModule,
    ErpPaymentTermsModule,
    ErpSettingsModule,
    ErpSysMenusModule,
    ErpDocumentNumberingsModule,
    ErpFiscalPeriodsModule,
  ],
  providers: [
    // Global rate limiter (apply to all routes)
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
