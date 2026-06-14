"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpAccountsModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const erp_accounts_controller_1 = require("./erp-accounts.controller");
const erp_accounts_service_1 = require("./erp-accounts.service");
let ErpAccountsModule = class ErpAccountsModule {
};
exports.ErpAccountsModule = ErpAccountsModule;
exports.ErpAccountsModule = ErpAccountsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [erp_accounts_controller_1.ErpAccountsController],
        providers: [erp_accounts_service_1.ErpAccountsService],
        exports: [erp_accounts_service_1.ErpAccountsService],
    })
], ErpAccountsModule);
//# sourceMappingURL=erp-accounts.module.js.map