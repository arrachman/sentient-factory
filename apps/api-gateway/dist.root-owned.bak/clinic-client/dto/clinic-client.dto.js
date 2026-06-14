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
exports.QueryClientDto = exports.UpdateClientDto = exports.CreateClientDto = exports.CLIENT_STATUSES = exports.CLIENT_CATEGORIES = exports.GENDERS = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
exports.GENDERS = ['L', 'P'];
exports.CLIENT_CATEGORIES = ['dewasa', 'remaja', 'anak', 'pasangan', 'keluarga'];
exports.CLIENT_STATUSES = ['baru', 'aktif', 'selesai'];
class CreateClientDto {
    name;
    gender;
    age;
    category;
    phoneWa;
    medicalRecordNumber;
    preferredServiceType;
    email;
    address;
    notes;
    waOptedOut;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, maxLength: 255 }, gender: { required: true, type: () => Object, enum: exports.GENDERS }, age: { required: false, type: () => Number, minimum: 0, maximum: 120 }, category: { required: false, type: () => Object, enum: exports.CLIENT_CATEGORIES }, phoneWa: { required: true, type: () => String, maxLength: 30 }, medicalRecordNumber: { required: false, type: () => String, maxLength: 80 }, preferredServiceType: { required: false, type: () => String, maxLength: 60 }, email: { required: false, type: () => String, maxLength: 255 }, address: { required: false, type: () => String, maxLength: 1000 }, notes: { required: false, type: () => String, maxLength: 2000 }, waOptedOut: { required: false, type: () => Boolean }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.CreateClientDto = CreateClientDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Andi Wijaya' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateClientDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'L', enum: exports.GENDERS }),
    (0, class_validator_1.IsIn)(exports.GENDERS),
    __metadata("design:type", String)
], CreateClientDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 28 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(120),
    __metadata("design:type", Number)
], CreateClientDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: exports.CLIENT_CATEGORIES, example: 'dewasa' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(exports.CLIENT_CATEGORIES),
    __metadata("design:type", String)
], CreateClientDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+6281234567890', description: 'WhatsApp E.164' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(30),
    __metadata("design:type", String)
], CreateClientDto.prototype, "phoneWa", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'MR-2026-0001' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], CreateClientDto.prototype, "medicalRecordNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'konseling' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(60),
    __metadata("design:type", String)
], CreateClientDto.prototype, "preferredServiceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateClientDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateClientDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreateClientDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateClientDto.prototype, "waOptedOut", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true, description: 'False = klien dinonaktifkan (tidak muncul di pilihan booking baru, histori tetap)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateClientDto.prototype, "isActive", void 0);
class UpdateClientDto extends (0, swagger_1.PartialType)(CreateClientDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateClientDto = UpdateClientDto;
class QueryClientDto {
    page = 1;
    limit = 50;
    search;
    gender;
    category;
    status;
    waOptedOut;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { page: { required: false, type: () => Number, default: 1, minimum: 1 }, limit: { required: false, type: () => Number, default: 50, minimum: 1, maximum: 200 }, search: { required: false, type: () => String }, gender: { required: false, type: () => Object, enum: exports.GENDERS }, category: { required: false, type: () => Object, enum: exports.CLIENT_CATEGORIES }, status: { required: false, type: () => Object, enum: exports.CLIENT_STATUSES }, waOptedOut: { required: false, type: () => Boolean }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.QueryClientDto = QueryClientDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QueryClientDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(200),
    __metadata("design:type", Number)
], QueryClientDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search nama, phone, MRN' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryClientDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: exports.GENDERS }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(exports.GENDERS),
    __metadata("design:type", String)
], QueryClientDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: exports.CLIENT_CATEGORIES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(exports.CLIENT_CATEGORIES),
    __metadata("design:type", String)
], QueryClientDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: exports.CLIENT_STATUSES, description: 'Derived dari booking activity' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(exports.CLIENT_STATUSES),
    __metadata("design:type", String)
], QueryClientDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'boolean')
            return value;
        if (typeof value === 'string') {
            const v = value.trim().toLowerCase();
            if (v === 'true')
                return true;
            if (v === 'false')
                return false;
        }
        return value;
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], QueryClientDto.prototype, "waOptedOut", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'boolean')
            return value;
        if (typeof value === 'string') {
            const v = value.trim().toLowerCase();
            if (v === 'true')
                return true;
            if (v === 'false')
                return false;
        }
        return value;
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], QueryClientDto.prototype, "isActive", void 0);
//# sourceMappingURL=clinic-client.dto.js.map