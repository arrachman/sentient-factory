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
exports.CreateErpItemDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateErpItemDto {
    code;
    name;
    itemType;
    categoryId;
    unitId;
    description;
    barcode;
    standardCost;
    purchasePrice;
    salePrice;
    minStock;
    maxStock;
    reorderQty;
    tracksSerial = false;
    tracksBatch = false;
    tracksBin = false;
    inventoryAccountId;
    salesAccountId;
    cogsAccountId;
    isActive = true;
    static _OPENAPI_METADATA_FACTORY() {
        return { code: { required: true, type: () => String, maxLength: 50 }, name: { required: true, type: () => String, maxLength: 255 }, itemType: { required: true, type: () => Object }, categoryId: { required: true, type: () => String }, unitId: { required: true, type: () => String }, description: { required: false, type: () => String, maxLength: 1000 }, barcode: { required: false, type: () => String, maxLength: 100 }, standardCost: { required: false, type: () => String }, purchasePrice: { required: false, type: () => String }, salePrice: { required: false, type: () => String }, minStock: { required: false, type: () => String }, maxStock: { required: false, type: () => String }, reorderQty: { required: false, type: () => String }, tracksSerial: { required: false, type: () => Boolean, default: false }, tracksBatch: { required: false, type: () => Boolean, default: false }, tracksBin: { required: false, type: () => Boolean, default: false }, inventoryAccountId: { required: false, type: () => String, nullable: true }, salesAccountId: { required: false, type: () => String, nullable: true }, cogsAccountId: { required: false, type: () => String, nullable: true }, isActive: { required: false, type: () => Boolean, default: true } };
    }
}
exports.CreateErpItemDto = CreateErpItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ITM-001', description: 'Unique item code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateErpItemDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Steel Rod 10mm', description: 'Item name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateErpItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ErpItemType, example: client_1.ErpItemType.INVENTORY, description: 'Item type' }),
    (0, class_validator_1.IsEnum)(client_1.ErpItemType),
    __metadata("design:type", String)
], CreateErpItemDto.prototype, "itemType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1', description: 'Category ID (BigInt as string)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateErpItemDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1', description: 'Base unit ID (BigInt as string)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateErpItemDto.prototype, "unitId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'D6 10mm steel rod', description: 'Item description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateErpItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '12345678', description: 'Barcode' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateErpItemDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '50000', description: 'Standard cost (Decimal as string)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateErpItemDto.prototype, "standardCost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '50000', description: 'Purchase price (Decimal as string)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateErpItemDto.prototype, "purchasePrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '75000', description: 'Sale price (Decimal as string)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateErpItemDto.prototype, "salePrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '10', description: 'Minimum stock level' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateErpItemDto.prototype, "minStock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '500', description: 'Maximum stock level' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateErpItemDto.prototype, "maxStock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '50', description: 'Reorder quantity' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateErpItemDto.prototype, "reorderQty", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateErpItemDto.prototype, "tracksSerial", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateErpItemDto.prototype, "tracksBatch", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateErpItemDto.prototype, "tracksBin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '456',
        description: 'Inventory account ID (BigInt as string)',
        nullable: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateErpItemDto.prototype, "inventoryAccountId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '457',
        description: 'Sales account ID (BigInt as string)',
        nullable: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateErpItemDto.prototype, "salesAccountId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '458',
        description: 'COGS account ID (BigInt as string)',
        nullable: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateErpItemDto.prototype, "cogsAccountId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateErpItemDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-erp-item.dto.js.map