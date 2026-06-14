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
exports.CreateErpWarehouseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateErpWarehouseDto {
    code;
    name;
    locationId;
    allowNegativeStock = false;
    notes;
    isActive = true;
    static _OPENAPI_METADATA_FACTORY() {
        return { code: { required: true, type: () => String, maxLength: 50 }, name: { required: true, type: () => String, maxLength: 150 }, locationId: { required: true, type: () => String }, allowNegativeStock: { required: false, type: () => Boolean, default: false }, notes: { required: false, type: () => String }, isActive: { required: false, type: () => Boolean, default: true } };
    }
}
exports.CreateErpWarehouseDto = CreateErpWarehouseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'WH-001', description: 'Unique warehouse code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateErpWarehouseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Gudang Bahan Baku A' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreateErpWarehouseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2', description: 'Location ID as numeric string (BigInt) — required' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateErpWarehouseDto.prototype, "locationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateErpWarehouseDto.prototype, "allowNegativeStock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Gudang utama bahan baku produksi' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateErpWarehouseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateErpWarehouseDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-erp-warehouse.dto.js.map