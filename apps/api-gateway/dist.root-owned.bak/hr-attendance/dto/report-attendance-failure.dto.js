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
exports.ReportAttendanceFailureDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ReportAttendanceFailureDto {
    eventType;
    reasonCode;
    latitude;
    longitude;
    faceScore;
    livenessScore;
    snapshotDataUrl;
    deviceInfo;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { eventType: { required: true, type: () => String }, reasonCode: { required: true, type: () => String }, latitude: { required: false, type: () => Number }, longitude: { required: false, type: () => Number }, faceScore: { required: false, type: () => Number, minimum: 0, maximum: 1 }, livenessScore: { required: false, type: () => Number, minimum: 0, maximum: 1 }, snapshotDataUrl: { required: false, type: () => String }, deviceInfo: { required: false, type: () => Object }, metadata: { required: false, type: () => Object } };
    }
}
exports.ReportAttendanceFailureDto = ReportAttendanceFailureDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clock_in_attempt' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportAttendanceFailureDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'camera_denied' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportAttendanceFailureDto.prototype, "reasonCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: -6.2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ReportAttendanceFailureDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 106.8166 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ReportAttendanceFailureDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0.91 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], ReportAttendanceFailureDto.prototype, "faceScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0.7 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], ReportAttendanceFailureDto.prototype, "livenessScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'data:image/jpeg;base64,...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportAttendanceFailureDto.prototype, "snapshotDataUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ReportAttendanceFailureDto.prototype, "deviceInfo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ReportAttendanceFailureDto.prototype, "metadata", void 0);
//# sourceMappingURL=report-attendance-failure.dto.js.map