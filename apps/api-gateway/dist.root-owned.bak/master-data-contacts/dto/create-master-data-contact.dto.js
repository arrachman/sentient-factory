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
exports.CreateMasterDataContactDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const CONTACT_TYPES = ['customer', 'supplier', 'company'];
class CreateMasterDataContactDto {
    code;
    name;
    tax;
    website;
    address;
    street;
    city;
    province;
    zipCode;
    type;
    contactFirstName;
    contactEmail;
    contactPhone;
    static _OPENAPI_METADATA_FACTORY() {
        return { code: { required: true, type: () => String, maxLength: 100 }, name: { required: true, type: () => String, maxLength: 255 }, tax: { required: false, type: () => String, maxLength: 100 }, website: { required: false, type: () => String, maxLength: 255 }, address: { required: false, type: () => String }, street: { required: false, type: () => String, maxLength: 255 }, city: { required: false, type: () => String, maxLength: 120 }, province: { required: false, type: () => String, maxLength: 120 }, zipCode: { required: false, type: () => String, maxLength: 20 }, type: { required: true, type: () => Object, enum: CONTACT_TYPES }, contactFirstName: { required: false, type: () => String, maxLength: 120 }, contactEmail: { required: false, type: () => String, maxLength: 255 }, contactPhone: { required: false, type: () => String, maxLength: 50 } };
    }
}
exports.CreateMasterDataContactDto = CreateMasterDataContactDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'CUST-001' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateMasterDataContactDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PT Sentient Customer A' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateMasterDataContactDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '01.234.567.8-999.000' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateMasterDataContactDto.prototype, "tax", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateMasterDataContactDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Kawasan Industri Sentient, Blok A1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMasterDataContactDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Jl. Industri Raya No. 12' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateMasterDataContactDto.prototype, "street", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Jakarta' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateMasterDataContactDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'DKI Jakarta' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateMasterDataContactDto.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '12950' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateMasterDataContactDto.prototype, "zipCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: CONTACT_TYPES, example: 'customer' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(CONTACT_TYPES),
    __metadata("design:type", Object)
], CreateMasterDataContactDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Budi' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateMasterDataContactDto.prototype, "contactFirstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'budi@example.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateMasterDataContactDto.prototype, "contactEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+6281234569' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateMasterDataContactDto.prototype, "contactPhone", void 0);
//# sourceMappingURL=create-master-data-contact.dto.js.map