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
exports.CreateErpFiscalPeriodDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateErpFiscalPeriodDto {
    year;
    periodNo;
    name;
    startDate;
    endDate;
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { year: { required: true, type: () => Number, minimum: 2000, maximum: 2100 }, periodNo: { required: true, type: () => Number, minimum: 1, maximum: 12 }, name: { required: true, type: () => String, maxLength: 100 }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date }, status: { required: false, type: () => Object } };
    }
}
exports.CreateErpFiscalPeriodDto = CreateErpFiscalPeriodDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2025, description: 'Fiscal year' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2000),
    (0, class_validator_1.Max)(2100),
    __metadata("design:type", Number)
], CreateErpFiscalPeriodDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Period number within the year (1–12 for monthly)' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    __metadata("design:type", Number)
], CreateErpFiscalPeriodDto.prototype, "periodNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Jan 2025', description: 'Human-readable period name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateErpFiscalPeriodDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-01', description: 'Period start date (YYYY-MM-DD)' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateErpFiscalPeriodDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-31', description: 'Period end date (YYYY-MM-DD)' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateErpFiscalPeriodDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.ErpFiscalPeriodStatus,
        default: client_1.ErpFiscalPeriodStatus.OPEN,
        description: 'Initial period status',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ErpFiscalPeriodStatus),
    __metadata("design:type", String)
], CreateErpFiscalPeriodDto.prototype, "status", void 0);
//# sourceMappingURL=create-erp-fiscal-period.dto.js.map