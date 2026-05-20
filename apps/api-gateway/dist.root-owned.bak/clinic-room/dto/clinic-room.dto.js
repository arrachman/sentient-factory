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
exports.QueryRoomDto = exports.UpdateRoomDto = exports.CreateRoomDto = exports.ROOM_TYPES = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
exports.ROOM_TYPES = ['konseling', 'anak', 'tes', 'seminar'];
class CreateRoomDto {
    name;
    type;
    capacity;
    facilities;
    description;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, maxLength: 120 }, type: { required: true, type: () => Object, enum: exports.ROOM_TYPES }, capacity: { required: false, type: () => Number, minimum: 1, maximum: 50 }, facilities: { required: false, type: () => [String], maxLength: 60 }, description: { required: false, type: () => String, maxLength: 2000 }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.CreateRoomDto = CreateRoomDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sage Room' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'konseling', enum: exports.ROOM_TYPES }),
    (0, class_validator_1.IsIn)(exports.ROOM_TYPES),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], CreateRoomDto.prototype, "capacity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Daftar fasilitas (mis. ["Sofa","Meja","AC","Tisu"]). Max 30.',
        example: ['Sofa', 'Meja', 'AC', 'Tisu'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(30),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(60, { each: true }),
    __metadata("design:type", Array)
], CreateRoomDto.prototype, "facilities", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Catatan freeform admin (mis. "AC service 2026-02-01")',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRoomDto.prototype, "isActive", void 0);
class UpdateRoomDto extends (0, swagger_1.PartialType)(CreateRoomDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateRoomDto = UpdateRoomDto;
class QueryRoomDto {
    page = 1;
    limit = 50;
    search;
    type;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { page: { required: false, type: () => Number, default: 1, minimum: 1 }, limit: { required: false, type: () => Number, default: 50, minimum: 1, maximum: 200 }, search: { required: false, type: () => String }, type: { required: false, type: () => Object, enum: exports.ROOM_TYPES }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.QueryRoomDto = QueryRoomDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QueryRoomDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(200),
    __metadata("design:type", Number)
], QueryRoomDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryRoomDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: exports.ROOM_TYPES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(exports.ROOM_TYPES),
    __metadata("design:type", String)
], QueryRoomDto.prototype, "type", void 0);
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
], QueryRoomDto.prototype, "isActive", void 0);
//# sourceMappingURL=clinic-room.dto.js.map