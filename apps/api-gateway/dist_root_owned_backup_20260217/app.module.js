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
const prisma_module_1 = require("./prisma/prisma.module");
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
const outbound_module_1 = require("./outbound/outbound.module");
const inbounds_module_1 = require("./inbounds/inbounds.module");
const audit_logs_module_1 = require("./audit-logs/audit-logs.module");
const departments_module_1 = require("./departments/departments.module");
const sessions_module_1 = require("./sessions/sessions.module");
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
            prisma_module_1.PrismaModule,
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
            outbound_module_1.OutboundModule,
            inbounds_module_1.InboundsModule,
            audit_logs_module_1.AuditLogsModule,
            departments_module_1.DepartmentsModule,
            sessions_module_1.SessionsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map