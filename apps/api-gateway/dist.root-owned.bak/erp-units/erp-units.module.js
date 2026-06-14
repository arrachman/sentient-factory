"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpUnitsModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const erp_units_controller_1 = require("./erp-units.controller");
const erp_units_service_1 = require("./erp-units.service");
let ErpUnitsModule = class ErpUnitsModule {
};
exports.ErpUnitsModule = ErpUnitsModule;
exports.ErpUnitsModule = ErpUnitsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [erp_units_controller_1.ErpUnitsController],
        providers: [erp_units_service_1.ErpUnitsService],
        exports: [erp_units_service_1.ErpUnitsService],
    })
], ErpUnitsModule);
//# sourceMappingURL=erp-units.module.js.map