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
exports.CreateOutboundDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const create_outbound_detail_dto_1 = require("./create-outbound-detail.dto");
const DELIVERY_ORDER_STATUSES = ['OPEN', 'DELIVERY', 'DELIVERED', 'COMPLETED'];
class CreateOutboundDto {
    doNumber;
    doDate;
    doReceivedDate;
    customerId;
    warehouseId;
    destinationCityId;
    stdLeadTimeDays;
    stdReturnDoDays;
    shippingDate;
    actualReceivedDate;
    receivedBy;
    doScanReturnDate;
    bu;
    notes;
    status;
    details;
    static _OPENAPI_METADATA_FACTORY() {
        return { doNumber: { required: true, type: () => String, maxLength: 100 }, doDate: { required: true, type: () => String }, doReceivedDate: { required: true, type: () => String }, customerId: { required: true, type: () => String, maxLength: 100 }, warehouseId: { required: true, type: () => String, maxLength: 100 }, destinationCityId: { required: false, type: () => String, maxLength: 100 }, stdLeadTimeDays: { required: false, type: () => Number, minimum: 0 }, stdReturnDoDays: { required: false, type: () => Number, minimum: 0 }, shippingDate: { required: false, type: () => String }, actualReceivedDate: { required: false, type: () => String }, receivedBy: { required: false, type: () => String, maxLength: 150 }, doScanReturnDate: { required: false, type: () => String }, bu: { required: false, type: () => String, maxLength: 120 }, notes: { required: false, type: () => String }, status: { required: false, type: () => Object, enum: DELIVERY_ORDER_STATUSES }, details: { required: true, type: () => [require("./create-outbound-detail.dto").CreateOutboundDetailDto] } };
    }
}
exports.CreateOutboundDto = CreateOutboundDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DO-2026-0001' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateOutboundDto.prototype, "doNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-02-13' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateOutboundDto.prototype, "doDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-02-13' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateOutboundDto.prototype, "doReceivedDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cm123abc456def' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateOutboundDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateOutboundDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'cm123city456def' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateOutboundDto.prototype, "destinationCityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2, default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateOutboundDto.prototype, "stdLeadTimeDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 7, default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateOutboundDto.prototype, "stdReturnDoDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-02-14' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateOutboundDto.prototype, "shippingDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-02-16' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateOutboundDto.prototype, "actualReceivedDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Budi Santoso' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreateOutboundDto.prototype, "receivedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-02-17' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateOutboundDto.prototype, "doScanReturnDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'EXPORT' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateOutboundDto.prototype, "bu", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Urgent delivery' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOutboundDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: DELIVERY_ORDER_STATUSES, default: 'OPEN' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(DELIVERY_ORDER_STATUSES),
    __metadata("design:type", Object)
], CreateOutboundDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [create_outbound_detail_dto_1.CreateOutboundDetailDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_outbound_detail_dto_1.CreateOutboundDetailDto),
    __metadata("design:type", Array)
], CreateOutboundDto.prototype, "details", void 0);
//# sourceMappingURL=create-outbound.dto.js.map