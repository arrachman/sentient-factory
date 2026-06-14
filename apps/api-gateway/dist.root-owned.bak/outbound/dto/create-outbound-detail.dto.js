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
exports.CreateOutboundDetailDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateOutboundDetailDto {
    itemId;
    batchNumber;
    qtyPcs;
    qtyKg;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { itemId: { required: true, type: () => String, maxLength: 100 }, batchNumber: { required: true, type: () => String, maxLength: 100 }, qtyPcs: { required: false, type: () => Number, minimum: 0 }, qtyKg: { required: true, type: () => Number, minimum: 0.001 }, notes: { required: false, type: () => String } };
    }
}
exports.CreateOutboundDetailDto = CreateOutboundDetailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cm123abc456def' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateOutboundDetailDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'BATCH-20260213-001' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateOutboundDetailDto.prototype, "batchNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateOutboundDetailDto.prototype, "qtyPcs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1250.5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.001),
    __metadata("design:type", Number)
], CreateOutboundDetailDto.prototype, "qtyKg", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Frozen box condition OK' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOutboundDetailDto.prototype, "notes", void 0);
//# sourceMappingURL=create-outbound-detail.dto.js.map