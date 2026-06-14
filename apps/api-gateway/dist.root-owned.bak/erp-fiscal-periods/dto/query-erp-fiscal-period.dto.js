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
exports.QueryErpFiscalPeriodDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class QueryErpFiscalPeriodDto {
    year;
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { year: { required: false, type: () => Number, minimum: 2000, maximum: 2100 }, status: { required: false, type: () => Object } };
    }
}
exports.QueryErpFiscalPeriodDto = QueryErpFiscalPeriodDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2025, description: 'Filter by fiscal year' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2000),
    (0, class_validator_1.Max)(2100),
    __metadata("design:type", Number)
], QueryErpFiscalPeriodDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ErpFiscalPeriodStatus, description: 'Filter by status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ErpFiscalPeriodStatus),
    __metadata("design:type", String)
], QueryErpFiscalPeriodDto.prototype, "status", void 0);
//# sourceMappingURL=query-erp-fiscal-period.dto.js.map