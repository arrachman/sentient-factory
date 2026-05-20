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
exports.FonnteWebhookDto = exports.SendTestDto = exports.QueryWaLogDto = exports.QueryTemplateDto = exports.UpdateTemplateDto = exports.CreateTemplateDto = exports.WA_RECIPIENTS = exports.WA_CATEGORIES = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
exports.WA_CATEGORIES = ['pengingat', 'jadwal', 'onboarding', 'bayar'];
exports.WA_RECIPIENTS = ['klien', 'psikolog'];
class CreateTemplateDto {
    name;
    category;
    triggerEvent;
    body;
    recipients;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, maxLength: 120 }, category: { required: true, type: () => Object, enum: exports.WA_CATEGORIES }, triggerEvent: { required: false, type: () => String, maxLength: 80 }, body: { required: true, type: () => String, maxLength: 4000 }, recipients: { required: true, type: () => [String] }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.CreateTemplateDto = CreateTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Konfirmasi Booking' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'jadwal', enum: exports.WA_CATEGORIES }),
    (0, class_validator_1.IsIn)(exports.WA_CATEGORIES),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'confirmation' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "triggerEvent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hai {{nama_klien}}, sesi kamu...' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(4000),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "body", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['klien'], type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateTemplateDto.prototype, "recipients", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTemplateDto.prototype, "isActive", void 0);
class UpdateTemplateDto extends (0, swagger_1.PartialType)(CreateTemplateDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateTemplateDto = UpdateTemplateDto;
class QueryTemplateDto {
    page = 1;
    limit = 50;
    category;
    search;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { page: { required: false, type: () => Number, default: 1, minimum: 1 }, limit: { required: false, type: () => Number, default: 50, minimum: 1, maximum: 200 }, category: { required: false, type: () => Object, enum: exports.WA_CATEGORIES }, search: { required: false, type: () => String }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.QueryTemplateDto = QueryTemplateDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QueryTemplateDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(200),
    __metadata("design:type", Number)
], QueryTemplateDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: exports.WA_CATEGORIES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(exports.WA_CATEGORIES),
    __metadata("design:type", String)
], QueryTemplateDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryTemplateDto.prototype, "search", void 0);
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
], QueryTemplateDto.prototype, "isActive", void 0);
class QueryWaLogDto {
    page = 1;
    limit = 50;
    status;
    recipientPhone;
    templateId;
    static _OPENAPI_METADATA_FACTORY() {
        return { page: { required: false, type: () => Number, default: 1, minimum: 1 }, limit: { required: false, type: () => Number, default: 50, minimum: 1, maximum: 200 }, status: { required: false, type: () => String }, recipientPhone: { required: false, type: () => String }, templateId: { required: false, type: () => Number } };
    }
}
exports.QueryWaLogDto = QueryWaLogDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QueryWaLogDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(200),
    __metadata("design:type", Number)
], QueryWaLogDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['queued', 'terkirim', 'sampai', 'dibaca', 'gagal'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryWaLogDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryWaLogDto.prototype, "recipientPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], QueryWaLogDto.prototype, "templateId", void 0);
class SendTestDto {
    phone;
    templateId;
    body;
    variables;
    static _OPENAPI_METADATA_FACTORY() {
        return { phone: { required: true, type: () => String, maxLength: 30 }, templateId: { required: false, type: () => Number }, body: { required: false, type: () => String, maxLength: 4000 }, variables: { required: false, type: () => Object } };
    }
}
exports.SendTestDto = SendTestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+6281234567890' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(30),
    __metadata("design:type", String)
], SendTestDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Template ID (optional). Kalau kosong, pakai body raw.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], SendTestDto.prototype, "templateId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Raw body kalau tidak pakai template.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(4000),
    __metadata("design:type", String)
], SendTestDto.prototype, "body", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: 'object', additionalProperties: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], SendTestDto.prototype, "variables", void 0);
class FonnteWebhookDto {
    device;
    id;
    sender;
    status;
    state;
    reason;
    static _OPENAPI_METADATA_FACTORY() {
        return { device: { required: false, type: () => String }, id: { required: false, type: () => String }, sender: { required: false, type: () => String }, status: { required: false, type: () => String }, state: { required: false, type: () => String }, reason: { required: false, type: () => String } };
    }
}
exports.FonnteWebhookDto = FonnteWebhookDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FonnteWebhookDto.prototype, "device", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Message ID dari Fonnte. Fonnte kadang kirim sebagai number, kadang string — Transform paksa ke string.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === undefined || value === null ? value : String(value))),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FonnteWebhookDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'sender phone (format 62xxx)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FonnteWebhookDto.prototype, "sender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'message status: sent/delivered/read/failed',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FonnteWebhookDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Fonnte state field — some webhook types use this instead of status',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FonnteWebhookDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FonnteWebhookDto.prototype, "reason", void 0);
//# sourceMappingURL=wa.dto.js.map