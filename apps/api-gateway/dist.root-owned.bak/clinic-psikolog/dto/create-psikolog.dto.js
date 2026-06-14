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
exports.CreatePsikologDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreatePsikologDto {
    email;
    fullName;
    phone;
    username;
    password;
    title;
    specialty;
    color;
    license;
    defaultSlots;
    weeklyAvailability;
    serviceIds;
    bio;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String, maxLength: 255 }, fullName: { required: true, type: () => String, maxLength: 255 }, phone: { required: false, type: () => String, maxLength: 32 }, username: { required: false, type: () => String, maxLength: 120 }, password: { required: false, type: () => String, minLength: 8, maxLength: 120 }, title: { required: false, type: () => String, maxLength: 80 }, specialty: { required: false, type: () => [String] }, color: { required: false, type: () => String, maxLength: 20 }, license: { required: false, type: () => String, maxLength: 80 }, defaultSlots: { required: false, type: () => Number, minimum: 0, maximum: 20 }, weeklyAvailability: { required: false, type: () => Object }, serviceIds: { required: false, type: () => [Number] }, bio: { required: false, type: () => String, maxLength: 2000 }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.CreatePsikologDto = CreatePsikologDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'farah@althea.local' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreatePsikologDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Farah Rahmadhani, M.Psi' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreatePsikologDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'No WhatsApp psikolog (E.164 atau format lokal Indonesia)',
        example: '081234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(32),
    __metadata("design:type", String)
], CreatePsikologDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Username; auto-generated dari email kalau kosong',
        example: 'farah-rahmadhani',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreatePsikologDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Initial password (min 8 chars). Auto-generate kalau kosong (TODO: send via WA)',
        example: 'Test1234!',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreatePsikologDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'M.Psi' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], CreatePsikologDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List spesialisasi (e.g., klinis_dewasa, anak_remaja)',
        example: ['klinis_dewasa', 'pasangan'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(10),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreatePsikologDto.prototype, "specialty", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '#5b8a66', description: 'Hex color untuk avatar/badge' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreatePsikologDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'SIPP-12345', description: 'Surat Izin Praktik Psikolog' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], CreatePsikologDto.prototype, "license", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 4, default: 4 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(20),
    __metadata("design:type", Number)
], CreatePsikologDto.prototype, "defaultSlots", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Jadwal mingguan psikolog. Format: { "monday": { isOpen: true, slotIndices?: [0,1,2] }, ..., "sunday": { isOpen: false } }. Empty {} = belum set → admin tidak bisa booking.',
        example: { monday: { isOpen: true }, tuesday: { isOpen: true } },
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePsikologDto.prototype, "weeklyAvailability", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Layanan yang ditangani psikolog (service IDs). Kosong/undefined = handle SEMUA layanan (default). Filled = hanya layanan yang di-list.',
        example: [1, 3, 5],
        type: [Number],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    __metadata("design:type", Array)
], CreatePsikologDto.prototype, "serviceIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Lulusan Universitas Indonesia, fokus...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreatePsikologDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePsikologDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-psikolog.dto.js.map