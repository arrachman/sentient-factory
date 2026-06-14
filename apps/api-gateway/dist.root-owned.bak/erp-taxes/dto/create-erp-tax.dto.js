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
exports.CreateErpTaxDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateErpTaxDto {
    code;
    name;
    rate;
    saleAccountId;
    purchaseAccountId;
    isActive = true;
    static _OPENAPI_METADATA_FACTORY() {
        return { code: { required: true, type: () => String, maxLength: 50 }, name: { required: true, type: () => String, maxLength: 120 }, rate: { required: true, type: () => String }, saleAccountId: { required: false, type: () => String, nullable: true }, purchaseAccountId: { required: false, type: () => String, nullable: true }, isActive: { required: false, type: () => Boolean, default: true } };
    }
}
exports.CreateErpTaxDto = CreateErpTaxDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'VAT11', description: 'Unique tax code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateErpTaxDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'VAT 11%' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateErpTaxDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '11.00', description: 'Tax rate as Decimal (e.g. 11.00 for 11%)' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateErpTaxDto.prototype, "rate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1', description: 'Sale account ID (string BigInt)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateErpTaxDto.prototype, "saleAccountId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2', description: 'Purchase account ID (string BigInt)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateErpTaxDto.prototype, "purchaseAccountId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateErpTaxDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-erp-tax.dto.js.map