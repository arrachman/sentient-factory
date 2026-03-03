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
exports.CreateUserDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateUserDto {
    email;
    username;
    password;
    fullName;
    isActive;
    warehouseId;
    roleId;
    roleIds;
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String, maxLength: 255 }, username: { required: true, type: () => String, minLength: 3, maxLength: 100 }, password: { required: true, type: () => String, minLength: 6 }, fullName: { required: false, type: () => String, maxLength: 255 }, isActive: { required: false, type: () => Boolean }, warehouseId: { required: false, type: () => String, maxLength: 255 }, roleId: { required: false, type: () => String, maxLength: 50 }, roleIds: { required: false, type: () => [String], maxLength: 50 } };
    }
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin.ops@example.com' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin_ops' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateUserDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Password123!' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Admin Operations' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateUserDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateUserDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'wh_f4616bc245e7476b84511d3fee141176' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateUserDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateUserDto.prototype, "roleId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['1', '2'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(50, { each: true }),
    __metadata("design:type", Array)
], CreateUserDto.prototype, "roleIds", void 0);
//# sourceMappingURL=create-user.dto.js.map