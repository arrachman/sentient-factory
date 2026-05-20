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
exports.QueryOutboundDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const DELIVERY_ORDER_STATUSES = ['OPEN', 'DELIVERY', 'DELIVERED', 'COMPLETED'];
class QueryOutboundDto {
    page = 1;
    limit = 10;
    search;
    status;
    customerId;
    warehouseId;
    doDateFrom;
    doDateTo;
    static _OPENAPI_METADATA_FACTORY() {
        return { page: { required: false, type: () => Number, default: 1, minimum: 1 }, limit: { required: false, type: () => Number, default: 10, minimum: 1, maximum: 100 }, search: { required: false, type: () => String }, status: { required: false, type: () => Object, enum: DELIVERY_ORDER_STATUSES }, customerId: { required: false, type: () => String }, warehouseId: { required: false, type: () => String }, doDateFrom: { required: false, type: () => String }, doDateTo: { required: false, type: () => String } };
    }
}
exports.QueryOutboundDto = QueryOutboundDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QueryOutboundDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, default: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], QueryOutboundDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'DO-2026' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryOutboundDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: DELIVERY_ORDER_STATUSES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(DELIVERY_ORDER_STATUSES),
    __metadata("design:type", Object)
], QueryOutboundDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'cm123abc456def' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryOutboundDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryOutboundDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-02-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QueryOutboundDto.prototype, "doDateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-02-29' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QueryOutboundDto.prototype, "doDateTo", void 0);
//# sourceMappingURL=query-outbound.dto.js.map