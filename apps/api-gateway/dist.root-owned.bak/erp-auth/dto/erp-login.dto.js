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
exports.ErpLoginDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ErpLoginDto {
    login;
    password;
    static _OPENAPI_METADATA_FACTORY() {
        return { login: { required: true, type: () => String }, password: { required: true, type: () => String, minLength: 1 } };
    }
}
exports.ErpLoginDto = ErpLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'admin',
        description: 'Username atau email pengguna ERP',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ErpLoginDto.prototype, "login", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'P@ssw0rd',
        description: 'Password pengguna ERP',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], ErpLoginDto.prototype, "password", void 0);
//# sourceMappingURL=erp-login.dto.js.map