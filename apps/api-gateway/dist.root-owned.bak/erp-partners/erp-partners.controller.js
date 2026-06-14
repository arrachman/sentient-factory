"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpPartnersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_erp_partner_dto_1 = require("./dto/create-erp-partner.dto");
const query_erp_partner_dto_1 = require("./dto/query-erp-partner.dto");
const update_erp_partner_dto_1 = require("./dto/update-erp-partner.dto");
const create_erp_partner_address_dto_1 = require("./dto/create-erp-partner-address.dto");
const create_erp_partner_contact_dto_1 = require("./dto/create-erp-partner-contact.dto");
const create_erp_partner_bank_account_dto_1 = require("./dto/create-erp-partner-bank-account.dto");
const erp_partners_service_1 = require("./erp-partners.service");
let ErpPartnersController = class ErpPartnersController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto, req) {
        return this.service.create(dto, req.user?.id);
    }
    findAll(query) {
        return this.service.findAll(query);
    }
    findOne(id) {
        return this.service.findOne(BigInt(id));
    }
    update(id, dto, req) {
        return this.service.update(BigInt(id), dto, req.user?.id);
    }
    remove(id, req) {
        return this.service.remove(BigInt(id), req.user?.id);
    }
    addAddress(id, dto, req) {
        return this.service.addAddress(BigInt(id), dto, req.user?.id);
    }
    removeAddress(addressId, req) {
        return this.service.removeAddress(BigInt(addressId), req.user?.id);
    }
    addContact(id, dto, req) {
        return this.service.addContact(BigInt(id), dto, req.user?.id);
    }
    removeContact(contactId, req) {
        return this.service.removeContact(BigInt(contactId), req.user?.id);
    }
    addBankAccount(id, dto, req) {
        return this.service.addBankAccount(BigInt(id), dto, req.user?.id);
    }
    removeBankAccount(bankId, req) {
        return this.service.removeBankAccount(BigInt(bankId), req.user?.id);
    }
};
exports.ErpPartnersController = ErpPartnersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create ERP partner' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'ERP partner created' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_erp_partner_dto_1.CreateErpPartnerDto, Object]),
    __metadata("design:returntype", void 0)
], ErpPartnersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get ERP partner list' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of ERP partners' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_erp_partner_dto_1.QueryErpPartnerDto]),
    __metadata("design:returntype", void 0)
], ErpPartnersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get one ERP partner with addresses, contacts, and bank accounts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ERP partner detail' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ErpPartnersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update ERP partner' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ERP partner updated' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_erp_partner_dto_1.UpdateErpPartnerDto, Object]),
    __metadata("design:returntype", void 0)
], ErpPartnersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete ERP partner (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ERP partner deleted' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ErpPartnersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/addresses'),
    (0, swagger_1.ApiOperation)({ summary: 'Add address to ERP partner' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Partner address added' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_erp_partner_address_dto_1.CreateErpPartnerAddressDto, Object]),
    __metadata("design:returntype", void 0)
], ErpPartnersController.prototype, "addAddress", null);
__decorate([
    (0, common_1.Delete)(':id/addresses/:addressId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove address from ERP partner (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Partner address deleted' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('addressId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ErpPartnersController.prototype, "removeAddress", null);
__decorate([
    (0, common_1.Post)(':id/contacts'),
    (0, swagger_1.ApiOperation)({ summary: 'Add contact to ERP partner' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Partner contact added' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_erp_partner_contact_dto_1.CreateErpPartnerContactDto, Object]),
    __metadata("design:returntype", void 0)
], ErpPartnersController.prototype, "addContact", null);
__decorate([
    (0, common_1.Delete)(':id/contacts/:contactId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove contact from ERP partner (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Partner contact deleted' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('contactId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ErpPartnersController.prototype, "removeContact", null);
__decorate([
    (0, common_1.Post)(':id/bank-accounts'),
    (0, swagger_1.ApiOperation)({ summary: 'Add bank account to ERP partner' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Partner bank account added' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_erp_partner_bank_account_dto_1.CreateErpPartnerBankAccountDto, Object]),
    __metadata("design:returntype", void 0)
], ErpPartnersController.prototype, "addBankAccount", null);
__decorate([
    (0, common_1.Delete)(':id/bank-accounts/:bankId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove bank account from ERP partner (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Partner bank account deleted' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('bankId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ErpPartnersController.prototype, "removeBankAccount", null);
exports.ErpPartnersController = ErpPartnersController = __decorate([
    (0, swagger_1.ApiTags)('ERP Partners'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('erp/partners'),
    __metadata("design:paramtypes", [erp_partners_service_1.ErpPartnersService])
], ErpPartnersController);
//# sourceMappingURL=erp-partners.controller.js.map