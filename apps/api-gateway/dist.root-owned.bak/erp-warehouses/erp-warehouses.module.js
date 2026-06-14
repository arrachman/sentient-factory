"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpWarehousesModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const erp_warehouses_controller_1 = require("./erp-warehouses.controller");
const erp_warehouses_service_1 = require("./erp-warehouses.service");
let ErpWarehousesModule = class ErpWarehousesModule {
};
exports.ErpWarehousesModule = ErpWarehousesModule;
exports.ErpWarehousesModule = ErpWarehousesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [erp_warehouses_controller_1.ErpWarehousesController],
        providers: [erp_warehouses_service_1.ErpWarehousesService],
        exports: [erp_warehouses_service_1.ErpWarehousesService],
    })
], ErpWarehousesModule);
//# sourceMappingURL=erp-warehouses.module.js.map