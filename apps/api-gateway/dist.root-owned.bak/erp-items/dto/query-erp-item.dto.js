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
exports.QueryErpItemDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class QueryErpItemDto {
    page = 1;
    limit = 10;
    search;
    itemType;
    categoryId;
    unitId;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { page: { required: false, type: () => Number, default: 1, minimum: 1 }, limit: { required: false, type: () => Number, default: 10, minimum: 1, maximum: 100 }, search: { required: false, type: () => String }, itemType: { required: false, type: () => Object }, categoryId: { required: false, type: () => String }, unitId: { required: false, type: () => String }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.QueryErpItemDto = QueryErpItemDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QueryErpItemDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, default: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], QueryErpItemDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'steel', description: 'Search by code, name, or barcode' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryErpItemDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ErpItemType, description: 'Filter by item type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ErpItemType),
    __metadata("design:type", String)
], QueryErpItemDto.prototype, "itemType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1', description: 'Filter by category ID (BigInt as string)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryErpItemDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1', description: 'Filter by unit ID (BigInt as string)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryErpItemDto.prototype, "unitId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Filter by active status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], QueryErpItemDto.prototype, "isActive", void 0);
//# sourceMappingURL=query-erp-item.dto.js.map