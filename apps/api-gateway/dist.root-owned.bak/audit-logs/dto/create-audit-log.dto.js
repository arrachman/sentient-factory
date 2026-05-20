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
exports.CreateAuditLogDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateAuditLogDto {
    userId;
    action;
    entityType;
    entityId;
    oldData;
    newData;
    ipAddress;
    userAgent;
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: false, type: () => Number, minimum: 1 }, action: { required: true, type: () => String, maxLength: 100 }, entityType: { required: true, type: () => String, maxLength: 120 }, entityId: { required: false, type: () => String, maxLength: 120 }, oldData: { required: false, type: () => Object }, newData: { required: false, type: () => Object }, ipAddress: { required: false, type: () => String, maxLength: 120 }, userAgent: { required: false, type: () => String, maxLength: 500 } };
    }
}
exports.CreateAuditLogDto = CreateAuditLogDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateAuditLogDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'UPDATE' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateAuditLogDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'USER' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateAuditLogDto.prototype, "entityType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '25' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateAuditLogDto.prototype, "entityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: { before: { isActive: true } } }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateAuditLogDto.prototype, "oldData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: { after: { isActive: false } } }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateAuditLogDto.prototype, "newData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '127.0.0.1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateAuditLogDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Mozilla/5.0' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateAuditLogDto.prototype, "userAgent", void 0);
//# sourceMappingURL=create-audit-log.dto.js.map