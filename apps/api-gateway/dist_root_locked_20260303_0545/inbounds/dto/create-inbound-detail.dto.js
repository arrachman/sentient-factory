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
exports.CreateInboundDetailDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const create_inbound_batch_dto_1 = require("./create-inbound-batch.dto");
class CreateInboundDetailDto {
    itemId;
    qty;
    notes;
    uomInput;
    batches;
    static _OPENAPI_METADATA_FACTORY() {
        return { itemId: { required: true, type: () => String, maxLength: 100 }, qty: { required: true, type: () => Number, minimum: 0.0001 }, notes: { required: false, type: () => String }, uomInput: { required: true, type: () => Number, minimum: 0 }, batches: { required: true, type: () => [require("./create-inbound-batch.dto").CreateInboundBatchDto] } };
    }
}
exports.CreateInboundDetailDto = CreateInboundDetailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cm123abc456def' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateInboundDetailDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.0001),
    __metadata("design:type", Number)
], CreateInboundDetailDto.prototype, "qty", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Barang A inbound' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInboundDetailDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 25,
        description: 'Input integer bebas untuk kebutuhan UOM kg/liter',
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInboundDetailDto.prototype, "uomInput", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [create_inbound_batch_dto_1.CreateInboundBatchDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_inbound_batch_dto_1.CreateInboundBatchDto),
    __metadata("design:type", Array)
], CreateInboundDetailDto.prototype, "batches", void 0);
//# sourceMappingURL=create-inbound-detail.dto.js.map