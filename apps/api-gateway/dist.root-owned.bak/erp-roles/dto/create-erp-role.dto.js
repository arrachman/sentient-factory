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
exports.CreateErpRoleDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateErpRoleDto {
    code;
    name;
    description;
    static _OPENAPI_METADATA_FACTORY() {
        return { code: { required: true, type: () => String, maxLength: 50 }, name: { required: true, type: () => String, maxLength: 150 }, description: { required: false, type: () => String, maxLength: 500 } };
    }
}
exports.CreateErpRoleDto = CreateErpRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ADMIN', description: 'Unique role code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateErpRoleDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Administrator' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreateErpRoleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Full access administrator role' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateErpRoleDto.prototype, "description", void 0);
//# sourceMappingURL=create-erp-role.dto.js.map