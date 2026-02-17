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
exports.QueryMonitoringOutboundDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class QueryMonitoringOutboundDto {
    warehouseId;
    supplierId;
    provinceId;
    cityId;
    doReceivedDateFrom;
    doReceivedDateTo;
    static _OPENAPI_METADATA_FACTORY() {
        return { warehouseId: { required: false, type: () => String }, supplierId: { required: false, type: () => String }, provinceId: { required: false, type: () => String }, cityId: { required: false, type: () => String }, doReceivedDateFrom: { required: false, type: () => String }, doReceivedDateTo: { required: false, type: () => String } };
    }
}
exports.QueryMonitoringOutboundDto = QueryMonitoringOutboundDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'cm123warehouse456' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryMonitoringOutboundDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'cm123supplier456' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryMonitoringOutboundDto.prototype, "supplierId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'cm123province456' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryMonitoringOutboundDto.prototype, "provinceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'cm123city456' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryMonitoringOutboundDto.prototype, "cityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-02-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QueryMonitoringOutboundDto.prototype, "doReceivedDateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-02-29' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QueryMonitoringOutboundDto.prototype, "doReceivedDateTo", void 0);
//# sourceMappingURL=query-monitoring-outbound.dto.js.map