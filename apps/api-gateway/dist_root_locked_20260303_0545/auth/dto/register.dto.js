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
exports.RegisterDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class RegisterDto {
    email;
    username;
    password;
    fullName;
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String }, username: { required: true, type: () => String, minLength: 3 }, password: { required: true, type: () => String, minLength: 6, pattern: "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d\\w\\W]{6,}$/" }, fullName: { required: false, type: () => String } };
    }
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user@example.com', description: 'User email address' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'johndoe', description: 'Unique username', minLength: 3 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], RegisterDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Password123!',
        description: 'Strong password with at least 6 chars, 1 uppercase, 1 lowercase, 1 number',
        minLength: 6,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{6,}$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'John Doe', description: 'Full name of the user' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "fullName", void 0);
//# sourceMappingURL=register.dto.js.map