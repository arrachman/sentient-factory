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
exports.CreateInboundDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const create_inbound_detail_dto_1 = require("./create-inbound-detail.dto");
const INBOUND_STATUSES = ['DRAFT', 'POSTED', 'CANCELLED'];
class CreateInboundDto {
    transactionNo;
    transactionDate;
    supplierId;
    warehouseId;
    notes;
    status;
    details;
    static _OPENAPI_METADATA_FACTORY() {
        return { transactionNo: { required: false, type: () => String, maxLength: 100 }, transactionDate: { required: false, type: () => String }, supplierId: { required: true, type: () => String, maxLength: 100 }, warehouseId: { required: true, type: () => String, maxLength: 100 }, notes: { required: false, type: () => String }, status: { required: false, type: () => Object, enum: INBOUND_STATUSES }, details: { required: true, type: () => [require("./create-inbound-detail.dto").CreateInboundDetailDto] } };
    }
}
exports.CreateInboundDto = CreateInboundDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'INB-20260214-0001',
        description: 'Optional. Leave empty to auto-generate.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateInboundDto.prototype, "transactionNo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2026-02-14',
        description: 'Optional. Defaults to current date.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInboundDto.prototype, "transactionDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'cm123supplier456def',
        description: 'Supplier contact UUID (type=supplier)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateInboundDto.prototype, "supplierId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cm123warehouse456def', description: 'Warehouse UUID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateInboundDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Barang datang sesuai PO' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInboundDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: INBOUND_STATUSES, default: 'DRAFT' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(INBOUND_STATUSES),
    __metadata("design:type", Object)
], CreateInboundDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [create_inbound_detail_dto_1.CreateInboundDetailDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_inbound_detail_dto_1.CreateInboundDetailDto),
    __metadata("design:type", Array)
], CreateInboundDto.prototype, "details", void 0);
//# sourceMappingURL=create-inbound.dto.js.map