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
exports.CreateErpPaymentTermDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateErpPaymentTermDto {
    code;
    name;
    netDays;
    discountDays1;
    discountPercent1;
    discountDays2;
    discountPercent2;
    penaltyPercent;
    penaltyPeriod;
    isActive = true;
    static _OPENAPI_METADATA_FACTORY() {
        return { code: { required: true, type: () => String, maxLength: 50 }, name: { required: true, type: () => String, maxLength: 120 }, netDays: { required: true, type: () => Number, minimum: 0 }, discountDays1: { required: false, type: () => Number, minimum: 0 }, discountPercent1: { required: false, type: () => String }, discountDays2: { required: false, type: () => Number, minimum: 0 }, discountPercent2: { required: false, type: () => String }, penaltyPercent: { required: false, type: () => String }, penaltyPeriod: { required: false, type: () => String, maxLength: 50 }, isActive: { required: false, type: () => Boolean, default: true } };
    }
}
exports.CreateErpPaymentTermDto = CreateErpPaymentTermDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NET30', description: 'Unique payment term code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateErpPaymentTermDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Net 30 Days' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateErpPaymentTermDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 30, description: 'Net due days' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateErpPaymentTermDto.prototype, "netDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, description: 'Early payment discount days (tier 1)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateErpPaymentTermDto.prototype, "discountDays1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2.00', description: 'Early payment discount percent (tier 1), Decimal' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateErpPaymentTermDto.prototype, "discountPercent1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5, description: 'Early payment discount days (tier 2)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateErpPaymentTermDto.prototype, "discountDays2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1.00', description: 'Early payment discount percent (tier 2), Decimal' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateErpPaymentTermDto.prototype, "discountPercent2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1.50', description: 'Late payment penalty percent, Decimal' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateErpPaymentTermDto.prototype, "penaltyPercent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'monthly', description: 'Penalty period descriptor' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateErpPaymentTermDto.prototype, "penaltyPeriod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateErpPaymentTermDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-erp-payment-term.dto.js.map