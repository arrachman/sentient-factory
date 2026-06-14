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
exports.QuerySessionNoteDto = exports.UpdateSessionNoteDto = exports.CreateSessionNoteDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateSessionNoteDto {
    bookingId;
    noteText;
    isPrivate;
    static _OPENAPI_METADATA_FACTORY() {
        return { bookingId: { required: true, type: () => Number }, noteText: { required: true, type: () => String, maxLength: 20000 }, isPrivate: { required: false, type: () => Boolean } };
    }
}
exports.CreateSessionNoteDto = CreateSessionNoteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Booking ID' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSessionNoteDto.prototype, "bookingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Pasien tampak lebih relaks dari sesi sebelumnya...',
        description: 'Catatan klinis (markdown supported)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20000),
    __metadata("design:type", String)
], CreateSessionNoteDto.prototype, "noteText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        default: true,
        description: 'Private = hanya psikolog yang lihat. Public = admin juga bisa.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSessionNoteDto.prototype, "isPrivate", void 0);
class UpdateSessionNoteDto extends (0, swagger_1.PartialType)(CreateSessionNoteDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateSessionNoteDto = UpdateSessionNoteDto;
class QuerySessionNoteDto {
    page = 1;
    limit = 50;
    bookingId;
    psikologUserId;
    isPrivate;
    static _OPENAPI_METADATA_FACTORY() {
        return { page: { required: false, type: () => Number, default: 1, minimum: 1 }, limit: { required: false, type: () => Number, default: 50, minimum: 1, maximum: 200 }, bookingId: { required: false, type: () => Number }, psikologUserId: { required: false, type: () => Number }, isPrivate: { required: false, type: () => Boolean } };
    }
}
exports.QuerySessionNoteDto = QuerySessionNoteDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QuerySessionNoteDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(200),
    __metadata("design:type", Number)
], QuerySessionNoteDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by booking ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], QuerySessionNoteDto.prototype, "bookingId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by psikolog user ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], QuerySessionNoteDto.prototype, "psikologUserId", void 0);
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
], QuerySessionNoteDto.prototype, "isPrivate", void 0);
//# sourceMappingURL=clinic-session-note.dto.js.map