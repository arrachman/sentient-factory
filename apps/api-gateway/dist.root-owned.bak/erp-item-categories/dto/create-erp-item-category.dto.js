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
exports.CreateErpItemCategoryDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateErpItemCategoryDto {
    code;
    name;
    parentId;
    inventoryAccountId;
    cogsAccountId;
    salesAccountId;
    isActive = true;
    static _OPENAPI_METADATA_FACTORY() {
        return { code: { required: true, type: () => String, maxLength: 50 }, name: { required: true, type: () => String, maxLength: 120 }, parentId: { required: false, type: () => String, nullable: true }, inventoryAccountId: { required: false, type: () => String, nullable: true }, cogsAccountId: { required: false, type: () => String, nullable: true }, salesAccountId: { required: false, type: () => String, nullable: true }, isActive: { required: false, type: () => Boolean, default: true } };
    }
}
exports.CreateErpItemCategoryDto = CreateErpItemCategoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'RAW-MAT', description: 'Unique category code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateErpItemCategoryDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Raw Materials', description: 'Category name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateErpItemCategoryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123',
        description: 'Parent category ID (BigInt as string), null for root',
        nullable: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateErpItemCategoryDto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '456',
        description: 'Inventory account ID (BigInt as string)',
        nullable: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateErpItemCategoryDto.prototype, "inventoryAccountId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '457',
        description: 'COGS account ID (BigInt as string)',
        nullable: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateErpItemCategoryDto.prototype, "cogsAccountId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '458',
        description: 'Sales account ID (BigInt as string)',
        nullable: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateErpItemCategoryDto.prototype, "salesAccountId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateErpItemCategoryDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-erp-item-category.dto.js.map