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
exports.CreateErpPartnerDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateErpPartnerDto {
    code;
    name;
    categoryId;
    isCustomer = false;
    isSupplier = false;
    isSalesman = false;
    taxNumber;
    isTaxable = false;
    isActive = true;
    static _OPENAPI_METADATA_FACTORY() {
        return { code: { required: true, type: () => String, maxLength: 50 }, name: { required: true, type: () => String, maxLength: 200 }, categoryId: { required: false, type: () => String }, isCustomer: { required: false, type: () => Boolean, default: false }, isSupplier: { required: false, type: () => Boolean, default: false }, isSalesman: { required: false, type: () => Boolean, default: false }, taxNumber: { required: false, type: () => String, maxLength: 50 }, isTaxable: { required: false, type: () => Boolean, default: false }, isActive: { required: false, type: () => Boolean, default: true } };
    }
}
exports.CreateErpPartnerDto = CreateErpPartnerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'CUST-001', description: 'Unique partner code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateErpPartnerDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PT Maju Bersama' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateErpPartnerDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1', description: 'ErpPartnerCategory ID (string → BigInt)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateErpPartnerDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateErpPartnerDto.prototype, "isCustomer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateErpPartnerDto.prototype, "isSupplier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateErpPartnerDto.prototype, "isSalesman", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '01.234.567.8-901.000' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateErpPartnerDto.prototype, "taxNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateErpPartnerDto.prototype, "isTaxable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateErpPartnerDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-erp-partner.dto.js.map