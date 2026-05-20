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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateErpAccountDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateErpAccountDto {
    code;
    name;
    alias;
    accountType;
    accountKind;
    normalBalance;
    cashFlowCategory;
    parentId;
    currencyId;
    level;
    isActive = true;
    isControlAccount = false;
    bankName;
    bankAccountNo;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { code: { required: true, type: () => String, maxLength: 50 }, name: { required: true, type: () => String, maxLength: 120 }, alias: { required: false, type: () => String, maxLength: 120 }, accountType: { required: true, type: () => Object }, accountKind: { required: true, type: () => Object }, normalBalance: { required: true, type: () => Object }, cashFlowCategory: { required: false, type: () => Object }, parentId: { required: false, type: () => String, nullable: true }, currencyId: { required: false, type: () => String, nullable: true }, level: { required: false, type: () => Number }, isActive: { required: false, type: () => Boolean, default: true }, isControlAccount: { required: false, type: () => Boolean, default: false }, bankName: { required: false, type: () => String, maxLength: 100 }, bankAccountNo: { required: false, type: () => String, maxLength: 50 }, notes: { required: false, type: () => String } };
    }
}
exports.CreateErpAccountDto = CreateErpAccountDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1-1001', description: 'Unique account code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateErpAccountDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Cash on Hand' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateErpAccountDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Kas Besar' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateErpAccountDto.prototype, "alias", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ErpAccountType, example: client_1.ErpAccountType.ASSET }),
    (0, class_validator_1.IsEnum)(client_1.ErpAccountType),
    __metadata("design:type", String)
], CreateErpAccountDto.prototype, "accountType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ErpAccountKind, example: client_1.ErpAccountKind.POSTABLE }),
    (0, class_validator_1.IsEnum)(client_1.ErpAccountKind),
    __metadata("design:type", String)
], CreateErpAccountDto.prototype, "accountKind", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ErpNormalBalance, example: client_1.ErpNormalBalance.DEBIT }),
    (0, class_validator_1.IsEnum)(client_1.ErpNormalBalance),
    __metadata("design:type", String)
], CreateErpAccountDto.prototype, "normalBalance", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ErpCashFlowCategory }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ErpCashFlowCategory),
    __metadata("design:type", String)
], CreateErpAccountDto.prototype, "cashFlowCategory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1', description: 'Parent account ID (string BigInt)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateErpAccountDto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1', description: 'Currency ID (string BigInt)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateErpAccountDto.prototype, "currencyId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, description: 'Account level in hierarchy' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateErpAccountDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateErpAccountDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateErpAccountDto.prototype, "isControlAccount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Bank BCA' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateErpAccountDto.prototype, "bankName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1234567890' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateErpAccountDto.prototype, "bankAccountNo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Opening balance notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateErpAccountDto.prototype, "notes", void 0);
//# sourceMappingURL=create-erp-account.dto.js.map