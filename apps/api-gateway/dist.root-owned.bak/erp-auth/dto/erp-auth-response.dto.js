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
exports.ErpAuthResponseDto = exports.ErpAuthUserDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class ErpAuthUserDto {
    id;
    username;
    name;
    email;
    erpLevel;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, username: { required: true, type: () => String }, name: { required: true, type: () => String }, email: { required: true, type: () => String, nullable: true }, erpLevel: { required: true, type: () => String } };
    }
}
exports.ErpAuthUserDto = ErpAuthUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1' }),
    __metadata("design:type", String)
], ErpAuthUserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin' }),
    __metadata("design:type", String)
], ErpAuthUserDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Administrator' }),
    __metadata("design:type", String)
], ErpAuthUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin@example.com' }),
    __metadata("design:type", Object)
], ErpAuthUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'CENTRAL' }),
    __metadata("design:type", String)
], ErpAuthUserDto.prototype, "erpLevel", void 0);
class ErpAuthResponseDto {
    accessToken;
    user;
    static _OPENAPI_METADATA_FACTORY() {
        return { accessToken: { required: true, type: () => String }, user: { required: true, type: () => require("./erp-auth-response.dto").ErpAuthUserDto } };
    }
}
exports.ErpAuthResponseDto = ErpAuthResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
    __metadata("design:type", String)
], ErpAuthResponseDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ErpAuthUserDto }),
    __metadata("design:type", ErpAuthUserDto)
], ErpAuthResponseDto.prototype, "user", void 0);
//# sourceMappingURL=erp-auth-response.dto.js.map