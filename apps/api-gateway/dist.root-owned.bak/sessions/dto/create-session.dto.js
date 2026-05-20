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
exports.CreateSessionDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSessionDto {
    userId;
    token;
    expiresAt;
    ipAddress;
    userAgent;
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => String }, token: { required: true, type: () => String, maxLength: 512 }, expiresAt: { required: true, type: () => String }, ipAddress: { required: false, type: () => String, maxLength: 120 }, userAgent: { required: false, type: () => String, maxLength: 1000 } };
    }
}
exports.CreateSessionDto = CreateSessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1', description: 'User ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(512),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2026-02-20T10:00:00.000Z',
        description: 'Session expiry date-time in ISO format',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '192.168.1.10' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Mozilla/5.0 ...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "userAgent", void 0);
//# sourceMappingURL=create-session.dto.js.map