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
exports.QueryDashboardRangeDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class QueryDashboardRangeDto {
    fromDate;
    toDate;
    feature;
    static _OPENAPI_METADATA_FACTORY() {
        return { fromDate: { required: false, type: () => String }, toDate: { required: false, type: () => String }, feature: { required: false, type: () => String } };
    }
}
exports.QueryDashboardRangeDto = QueryDashboardRangeDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2026-01-01',
        description: 'Start date (inclusive). Default handled at service level.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QueryDashboardRangeDto.prototype, "fromDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2026-01-31',
        description: 'End date (inclusive). Default handled at service level.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QueryDashboardRangeDto.prototype, "toDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'm2_bd',
        description: 'Feature code for feature-specific filtering, e.g. m2_bd.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryDashboardRangeDto.prototype, "feature", void 0);
//# sourceMappingURL=query-dashboard-range.dto.js.map