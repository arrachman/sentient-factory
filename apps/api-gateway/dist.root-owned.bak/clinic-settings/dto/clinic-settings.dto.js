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
exports.UpdateSettingsDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateSettingsDto {
    clinicName;
    address;
    timezone;
    currency;
    slotsOfDay;
    closedDayOfWeek;
    holidays;
    taxEnabled;
    taxPercentage;
    dpPercentage;
    waSendEnabled;
    waCountryCode;
    static _OPENAPI_METADATA_FACTORY() {
        return { clinicName: { required: false, type: () => String, maxLength: 255 }, address: { required: false, type: () => String, maxLength: 1000 }, timezone: { required: false, type: () => String, maxLength: 60 }, currency: { required: false, type: () => String, maxLength: 10 }, slotsOfDay: { required: false }, closedDayOfWeek: { required: false, type: () => [Number], minimum: 0, maximum: 6 }, holidays: { required: false, type: () => [String] }, taxEnabled: { required: false, type: () => Boolean }, taxPercentage: { required: false, type: () => Number, minimum: 0, maximum: 100 }, dpPercentage: { required: false, type: () => Number, minimum: 0, maximum: 100 }, waSendEnabled: { required: false, type: () => Boolean }, waCountryCode: { required: false, type: () => String, maxLength: 10 } };
    }
}
exports.UpdateSettingsDto = UpdateSettingsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Althea Psychology' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateSettingsDto.prototype, "clinicName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], UpdateSettingsDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Asia/Jakarta' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(60),
    __metadata("design:type", String)
], UpdateSettingsDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'IDR' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], UpdateSettingsDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Slot operasional klinik (terdefinisi). Booking harus pas dengan salah satu slot. Format: [{ start: "HH:MM", end: "HH:MM", label?: string }, ...]',
        example: [
            { start: '08:30', end: '10:00', label: 'Pagi 1' },
            { start: '10:00', end: '11:30', label: 'Pagi 2' },
        ],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdateSettingsDto.prototype, "slotsOfDay", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Hari tutup (0=Minggu, 1=Senin, ..., 6=Sabtu). Default: [0] (Minggu tutup).',
        example: [0],
        type: [Number],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_validator_1.Min)(0, { each: true }),
    (0, class_validator_1.Max)(6, { each: true }),
    __metadata("design:type", Array)
], UpdateSettingsDto.prototype, "closedDayOfWeek", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List ISO date holidays (YYYY-MM-DD) — tanggal libur ad-hoc',
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateSettingsDto.prototype, "holidays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSettingsDto.prototype, "taxEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 11.0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateSettingsDto.prototype, "taxPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 50.0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateSettingsDto.prototype, "dpPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSettingsDto.prototype, "waSendEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+62' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], UpdateSettingsDto.prototype, "waCountryCode", void 0);
//# sourceMappingURL=clinic-settings.dto.js.map