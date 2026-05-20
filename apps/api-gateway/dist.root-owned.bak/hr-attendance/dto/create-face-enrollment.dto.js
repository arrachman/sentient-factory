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
exports.CreateFaceEnrollmentDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateFaceEnrollmentDto {
    targetAppUserId;
    qualityScore;
    snapshotDataUrl;
    faceEmbedding;
    faceDetectionCount;
    livenessScore;
    faceDetectionMode;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { targetAppUserId: { required: false, type: () => Number, minimum: 1 }, qualityScore: { required: false, type: () => Number, minimum: 0, maximum: 1 }, snapshotDataUrl: { required: false, type: () => String }, faceEmbedding: { required: false, type: () => [Number] }, faceDetectionCount: { required: false, type: () => Number, minimum: 0 }, livenessScore: { required: false, type: () => Number, minimum: 0, maximum: 1 }, faceDetectionMode: { required: false, type: () => String }, metadata: { required: false, type: () => Object } };
    }
}
exports.CreateFaceEnrollmentDto = CreateFaceEnrollmentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 12 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateFaceEnrollmentDto.prototype, "targetAppUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0.88 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], CreateFaceEnrollmentDto.prototype, "qualityScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'data:image/jpeg;base64,...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFaceEnrollmentDto.prototype, "snapshotDataUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [Number], example: [0.12, -0.33, 0.48] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(16),
    (0, class_validator_1.ArrayMaxSize)(512),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], CreateFaceEnrollmentDto.prototype, "faceEmbedding", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 4 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateFaceEnrollmentDto.prototype, "faceDetectionCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0.96 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], CreateFaceEnrollmentDto.prototype, "livenessScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'browser' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFaceEnrollmentDto.prototype, "faceDetectionMode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateFaceEnrollmentDto.prototype, "metadata", void 0);
//# sourceMappingURL=create-face-enrollment.dto.js.map