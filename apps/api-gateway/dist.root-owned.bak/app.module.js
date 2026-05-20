"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const schedule_1 = require("@nestjs/schedule");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./prisma/prisma.module");
const health_module_1 = require("./health/health.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const menus_module_1 = require("./menus/menus.module");
const master_data_contacts_module_1 = require("./master-data-contacts/master-data-contacts.module");
const master_data_uoms_module_1 = require("./master-data-uoms/master-data-uoms.module");
const master_data_divisions_module_1 = require("./master-data-divisions/master-data-divisions.module");
const master_data_items_module_1 = require("./master-data-items/master-data-items.module");
const master_data_provinces_module_1 = require("./master-data-provinces/master-data-provinces.module");
const master_data_cities_module_1 = require("./master-data-cities/master-data-cities.module");
const master_data_city_slas_module_1 = require("./master-data-city-slas/master-data-city-slas.module");
const master_data_warehouses_module_1 = require("./master-data-warehouses/master-data-warehouses.module");
const master_data_permissions_module_1 = require("./master-data-permissions/master-data-permissions.module");
const master_data_roles_module_1 = require("./master-data-roles/master-data-roles.module");
const outbound_module_1 = require("./outbound/outbound.module");
const inbounds_module_1 = require("./inbounds/inbounds.module");
const audit_logs_module_1 = require("./audit-logs/audit-logs.module");
const departments_module_1 = require("./departments/departments.module");
const sessions_module_1 = require("./sessions/sessions.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const hr_attendance_module_1 = require("./hr-attendance/hr-attendance.module");
const clinic_audit_module_1 = require("./clinic-audit/clinic-audit.module");
const clinic_wa_module_1 = require("./clinic-wa/clinic-wa.module");
const clinic_psikolog_module_1 = require("./clinic-psikolog/clinic-psikolog.module");
const clinic_service_module_1 = require("./clinic-service/clinic-service.module");
const clinic_room_module_1 = require("./clinic-room/clinic-room.module");
const clinic_client_module_1 = require("./clinic-client/clinic-client.module");
const clinic_users_module_1 = require("./clinic-users/clinic-users.module");
const clinic_booking_module_1 = require("./clinic-booking/clinic-booking.module");
const clinic_payment_module_1 = require("./clinic-payment/clinic-payment.module");
const clinic_session_note_module_1 = require("./clinic-session-note/clinic-session-note.module");
const clinic_settings_module_1 = require("./clinic-settings/clinic-settings.module");
const erp_auth_module_1 = require("./erp-auth/erp-auth.module");
const erp_users_module_1 = require("./erp-users/erp-users.module");
const erp_roles_module_1 = require("./erp-roles/erp-roles.module");
const erp_permissions_module_1 = require("./erp-permissions/erp-permissions.module");
const erp_branches_module_1 = require("./erp-branches/erp-branches.module");
const erp_locations_module_1 = require("./erp-locations/erp-locations.module");
const erp_warehouses_module_1 = require("./erp-warehouses/erp-warehouses.module");
const erp_units_module_1 = require("./erp-units/erp-units.module");
const erp_item_categories_module_1 = require("./erp-item-categories/erp-item-categories.module");
const erp_items_module_1 = require("./erp-items/erp-items.module");
const erp_partner_categories_module_1 = require("./erp-partner-categories/erp-partner-categories.module");
const erp_partners_module_1 = require("./erp-partners/erp-partners.module");
const erp_currencies_module_1 = require("./erp-currencies/erp-currencies.module");
const erp_accounts_module_1 = require("./erp-accounts/erp-accounts.module");
const erp_taxes_module_1 = require("./erp-taxes/erp-taxes.module");
const erp_payment_terms_module_1 = require("./erp-payment-terms/erp-payment-terms.module");
const erp_settings_module_1 = require("./erp-settings/erp-settings.module");
const erp_sys_menus_module_1 = require("./erp-sys-menus/erp-sys-menus.module");
const erp_document_numberings_module_1 = require("./erp-document-numberings/erp-document-numberings.module");
const erp_fiscal_periods_module_1 = require("./erp-fiscal-periods/erp-fiscal-periods.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (cfg) => [
                    {
                        ttl: cfg.get('THROTTLE_TTL', 60_000),
                        limit: cfg.get('THROTTLE_LIMIT', 600),
                    },
                ],
            }),
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            menus_module_1.MenusModule,
            master_data_contacts_module_1.MasterDataContactsModule,
            master_data_uoms_module_1.MasterDataUomsModule,
            master_data_divisions_module_1.MasterDataDivisionsModule,
            master_data_items_module_1.MasterDataItemsModule,
            master_data_provinces_module_1.MasterDataProvincesModule,
            master_data_cities_module_1.MasterDataCitiesModule,
            master_data_city_slas_module_1.MasterDataCitySlasModule,
            master_data_warehouses_module_1.MasterDataWarehousesModule,
            master_data_permissions_module_1.MasterDataPermissionsModule,
            master_data_roles_module_1.MasterDataRolesModule,
            outbound_module_1.OutboundModule,
            inbounds_module_1.InboundsModule,
            audit_logs_module_1.AuditLogsModule,
            departments_module_1.DepartmentsModule,
            sessions_module_1.SessionsModule,
            dashboard_module_1.DashboardModule,
            hr_attendance_module_1.HrAttendanceModule,
            clinic_audit_module_1.ClinicAuditModule,
            clinic_wa_module_1.ClinicWaModule,
            clinic_psikolog_module_1.ClinicPsikologModule,
            clinic_service_module_1.ClinicServiceModule,
            clinic_room_module_1.ClinicRoomModule,
            clinic_client_module_1.ClinicClientModule,
            clinic_users_module_1.ClinicUsersModule,
            clinic_booking_module_1.ClinicBookingModule,
            clinic_payment_module_1.ClinicPaymentModule,
            clinic_session_note_module_1.ClinicSessionNoteModule,
            clinic_settings_module_1.ClinicSettingsModule,
            erp_auth_module_1.ErpAuthModule,
            erp_users_module_1.ErpUsersModule,
            erp_roles_module_1.ErpRolesModule,
            erp_permissions_module_1.ErpPermissionsModule,
            erp_branches_module_1.ErpBranchesModule,
            erp_locations_module_1.ErpLocationsModule,
            erp_warehouses_module_1.ErpWarehousesModule,
            erp_units_module_1.ErpUnitsModule,
            erp_item_categories_module_1.ErpItemCategoriesModule,
            erp_items_module_1.ErpItemsModule,
            erp_partner_categories_module_1.ErpPartnerCategoriesModule,
            erp_partners_module_1.ErpPartnersModule,
            erp_currencies_module_1.ErpCurrenciesModule,
            erp_accounts_module_1.ErpAccountsModule,
            erp_taxes_module_1.ErpTaxesModule,
            erp_payment_terms_module_1.ErpPaymentTermsModule,
            erp_settings_module_1.ErpSettingsModule,
            erp_sys_menus_module_1.ErpSysMenusModule,
            erp_document_numberings_module_1.ErpDocumentNumberingsModule,
            erp_fiscal_periods_module_1.ErpFiscalPeriodsModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map