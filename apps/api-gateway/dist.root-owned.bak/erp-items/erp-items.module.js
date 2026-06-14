"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpItemsModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const erp_items_controller_1 = require("./erp-items.controller");
const erp_items_service_1 = require("./erp-items.service");
let ErpItemsModule = class ErpItemsModule {
};
exports.ErpItemsModule = ErpItemsModule;
exports.ErpItemsModule = ErpItemsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [erp_items_controller_1.ErpItemsController],
        providers: [erp_items_service_1.ErpItemsService],
        exports: [erp_items_service_1.ErpItemsService],
    })
], ErpItemsModule);
//# sourceMappingURL=erp-items.module.js.map