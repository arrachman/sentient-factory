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
exports.QueryServiceDto = exports.UpdateServiceDto = exports.CreateServiceDto = exports.SlotOverrideDto = exports.SERVICE_CATEGORIES = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
exports.SERVICE_CATEGORIES = ['konseling', 'terapi', 'tes'];
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;
class SlotOverrideDto {
    index;
    start;
    end;
    static _OPENAPI_METADATA_FACTORY() {
        return { index: { required: true, type: () => Number, minimum: 0 }, start: { required: true, type: () => String, pattern: "HHMM" }, end: { required: true, type: () => String, pattern: "HHMM" } };
    }
}
exports.SlotOverrideDto = SlotOverrideDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: 'Index slot di ClinicSettings.slotsOfDay' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], SlotOverrideDto.prototype, "index", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '08:00', description: 'Jam mulai HH:MM (TZ klinik)' }),
    (0, class_validator_1.Matches)(HHMM, { message: 'start harus format HH:MM' }),
    __metadata("design:type", String)
], SlotOverrideDto.prototype, "start", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '10:00', description: 'Jam selesai HH:MM (TZ klinik)' }),
    (0, class_validator_1.Matches)(HHMM, { message: 'end harus format HH:MM' }),
    __metadata("design:type", String)
], SlotOverrideDto.prototype, "end", void 0);
class CreateServiceDto {
    name;
    category;
    sessionCount;
    durationMinutes;
    basePrice;
    description;
    isActive;
    slotOverrides;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, maxLength: 255 }, category: { required: true, type: () => Object, enum: exports.SERVICE_CATEGORIES }, sessionCount: { required: true, type: () => Number, minimum: 1, maximum: 100 }, durationMinutes: { required: true, type: () => Number, minimum: 15, maximum: 480 }, basePrice: { required: true, type: () => Number, minimum: 0 }, description: { required: false, type: () => String, maxLength: 2000 }, isActive: { required: false, type: () => Boolean }, slotOverrides: { required: false, type: () => [require("./clinic-service.dto").SlotOverrideDto] } };
    }
}
exports.CreateServiceDto = CreateServiceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Konseling Individu Dewasa' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'konseling', enum: exports.SERVICE_CATEGORIES }),
    (0, class_validator_1.IsIn)(exports.SERVICE_CATEGORIES),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Jumlah sesi dalam paket (1=single)' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "sessionCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 60, description: 'Durasi per sesi dalam menit' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(15),
    (0, class_validator_1.Max)(480),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "durationMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500000, description: 'Harga paket TOTAL (bukan per sesi)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "basePrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Sesi konseling 1 jam tatap muka' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateServiceDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [SlotOverrideDto],
        description: 'Override range waktu slot khusus layanan ini. Kosong = pakai slot global apa adanya.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(50),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SlotOverrideDto),
    __metadata("design:type", Array)
], CreateServiceDto.prototype, "slotOverrides", void 0);
class UpdateServiceDto extends (0, swagger_1.PartialType)(CreateServiceDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateServiceDto = UpdateServiceDto;
class QueryServiceDto {
    page = 1;
    limit = 50;
    search;
    category;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { page: { required: false, type: () => Number, default: 1, minimum: 1 }, limit: { required: false, type: () => Number, default: 50, minimum: 1, maximum: 200 }, search: { required: false, type: () => String }, category: { required: false, type: () => Object, enum: exports.SERVICE_CATEGORIES }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.QueryServiceDto = QueryServiceDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QueryServiceDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 50, default: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(200),
    __metadata("design:type", Number)
], QueryServiceDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'konseling' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryServiceDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'konseling', enum: exports.SERVICE_CATEGORIES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(exports.SERVICE_CATEGORIES),
    __metadata("design:type", String)
], QueryServiceDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
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
], QueryServiceDto.prototype, "isActive", void 0);
//# sourceMappingURL=clinic-service.dto.js.map