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
exports.CreateErpUserDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateErpUserDto {
    username;
    email;
    password;
    fullName;
    erpLevel;
    isActive = true;
    branchId;
    static _OPENAPI_METADATA_FACTORY() {
        return { username: { required: true, type: () => String, maxLength: 50 }, email: { required: false, type: () => String, maxLength: 150 }, password: { required: true, type: () => String, minLength: 8, maxLength: 100 }, fullName: { required: true, type: () => String, maxLength: 150 }, erpLevel: { required: true, type: () => Object }, isActive: { required: false, type: () => Boolean, default: true }, branchId: { required: false, type: () => String } };
    }
}
exports.CreateErpUserDto = CreateErpUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'johndoe', description: 'Unique username (code)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateErpUserDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'john@example.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreateErpUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Secret@123', description: 'Plain password — will be hashed by service' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateErpUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreateErpUserDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ErpUserLevel, example: client_1.ErpUserLevel.CENTRAL }),
    (0, class_validator_1.IsEnum)(client_1.ErpUserLevel),
    __metadata("design:type", String)
], CreateErpUserDto.prototype, "erpLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateErpUserDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '1',
        description: 'Branch ID as numeric string (BigInt)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateErpUserDto.prototype, "branchId", void 0);
//# sourceMappingURL=create-erp-user.dto.js.map