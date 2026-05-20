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
exports.QueryErpSysMenuDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class QueryErpSysMenuDto {
    type;
    parentId;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: false, type: () => Object }, parentId: { required: false, type: () => String, maxLength: 50 }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.QueryErpSysMenuDto = QueryErpSysMenuDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ErpMenuType, description: 'Filter by menu type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ErpMenuType),
    __metadata("design:type", String)
], QueryErpSysMenuDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1', description: 'Filter by parent ID (use "null" for root items)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], QueryErpSysMenuDto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Filter by active status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], QueryErpSysMenuDto.prototype, "isActive", void 0);
//# sourceMappingURL=query-erp-sys-menu.dto.js.map