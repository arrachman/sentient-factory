"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutboundModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const outbound_batch_service_1 = require("./outbound-batch.service");
const outbound_controller_1 = require("./outbound.controller");
const outbound_inventory_service_1 = require("./outbound-inventory.service");
const outbound_query_service_1 = require("./outbound-query.service");
const outbound_service_1 = require("./outbound.service");
const outbound_stock_mutation_service_1 = require("./outbound-stock-mutation.service");
const outbound_stock_report_service_1 = require("./outbound-stock-report.service");
const outbound_validators_service_1 = require("./outbound-validators.service");
let OutboundModule = class OutboundModule {
};
exports.OutboundModule = OutboundModule;
exports.OutboundModule = OutboundModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [outbound_controller_1.OutboundController],
        providers: [
            outbound_service_1.OutboundService,
            outbound_batch_service_1.OutboundBatchService,
            outbound_inventory_service_1.OutboundInventoryService,
            outbound_stock_mutation_service_1.OutboundStockMutationService,
            outbound_stock_report_service_1.OutboundStockReportService,
            outbound_validators_service_1.OutboundValidatorsService,
            outbound_query_service_1.OutboundQueryService,
        ],
        exports: [outbound_service_1.OutboundService],
    })
], OutboundModule);
//# sourceMappingURL=outbound.module.js.map