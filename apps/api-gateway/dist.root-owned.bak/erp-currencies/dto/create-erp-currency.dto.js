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
exports.CreateErpCurrencyDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateErpCurrencyDto {
    code;
    name;
    symbol;
    isBase = false;
    isActive = true;
    static _OPENAPI_METADATA_FACTORY() {
        return { code: { required: true, type: () => String, maxLength: 10 }, name: { required: true, type: () => String, maxLength: 120 }, symbol: { required: false, type: () => String, maxLength: 10 }, isBase: { required: false, type: () => Boolean, default: false }, isActive: { required: false, type: () => Boolean, default: true } };
    }
}
exports.CreateErpCurrencyDto = CreateErpCurrencyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'USD', description: 'ISO 4217 currency code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], CreateErpCurrencyDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'US Dollar' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateErpCurrencyDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '$' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], CreateErpCurrencyDto.prototype, "symbol", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateErpCurrencyDto.prototype, "isBase", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateErpCurrencyDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-erp-currency.dto.js.map