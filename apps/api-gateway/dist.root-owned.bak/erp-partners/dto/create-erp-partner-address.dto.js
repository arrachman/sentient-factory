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
exports.CreateErpPartnerAddressDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateErpPartnerAddressDto {
    type;
    addressLine1;
    addressLine2;
    city;
    province;
    country;
    postalCode;
    phone;
    fax;
    isDefault = false;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, type: () => Object }, addressLine1: { required: true, type: () => String, maxLength: 255 }, addressLine2: { required: false, type: () => String, maxLength: 255 }, city: { required: false, type: () => String, maxLength: 100 }, province: { required: false, type: () => String, maxLength: 100 }, country: { required: false, type: () => String, maxLength: 100 }, postalCode: { required: false, type: () => String, maxLength: 20 }, phone: { required: false, type: () => String, maxLength: 50 }, fax: { required: false, type: () => String, maxLength: 50 }, isDefault: { required: false, type: () => Boolean, default: false } };
    }
}
exports.CreateErpPartnerAddressDto = CreateErpPartnerAddressDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ErpAddressType, example: client_1.ErpAddressType.BILLING }),
    (0, class_validator_1.IsEnum)(client_1.ErpAddressType),
    __metadata("design:type", String)
], CreateErpPartnerAddressDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Jl. Sudirman No. 1' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateErpPartnerAddressDto.prototype, "addressLine1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Gedung A Lt. 3' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateErpPartnerAddressDto.prototype, "addressLine2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Jakarta' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateErpPartnerAddressDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'DKI Jakarta' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateErpPartnerAddressDto.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Indonesia' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateErpPartnerAddressDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '10220' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateErpPartnerAddressDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '021-5551234' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateErpPartnerAddressDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '021-5554321' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateErpPartnerAddressDto.prototype, "fax", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateErpPartnerAddressDto.prototype, "isDefault", void 0);
//# sourceMappingURL=create-erp-partner-address.dto.js.map