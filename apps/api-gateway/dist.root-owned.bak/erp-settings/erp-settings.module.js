"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpSettingsModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const erp_settings_controller_1 = require("./erp-settings.controller");
const erp_settings_service_1 = require("./erp-settings.service");
let ErpSettingsModule = class ErpSettingsModule {
};
exports.ErpSettingsModule = ErpSettingsModule;
exports.ErpSettingsModule = ErpSettingsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [erp_settings_controller_1.ErpSettingsController],
        providers: [erp_settings_service_1.ErpSettingsService],
        exports: [erp_settings_service_1.ErpSettingsService],
    })
], ErpSettingsModule);
//# sourceMappingURL=erp-settings.module.js.map