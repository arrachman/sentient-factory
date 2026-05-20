"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpDocumentNumberingsModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const erp_document_numberings_controller_1 = require("./erp-document-numberings.controller");
const erp_document_numberings_service_1 = require("./erp-document-numberings.service");
let ErpDocumentNumberingsModule = class ErpDocumentNumberingsModule {
};
exports.ErpDocumentNumberingsModule = ErpDocumentNumberingsModule;
exports.ErpDocumentNumberingsModule = ErpDocumentNumberingsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [erp_document_numberings_controller_1.ErpDocumentNumberingsController],
        providers: [erp_document_numberings_service_1.ErpDocumentNumberingsService],
        exports: [erp_document_numberings_service_1.ErpDocumentNumberingsService],
    })
], ErpDocumentNumberingsModule);
//# sourceMappingURL=erp-document-numberings.module.js.map