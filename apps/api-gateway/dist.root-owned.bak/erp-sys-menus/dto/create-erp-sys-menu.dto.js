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
exports.CreateErpSysMenuDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class CreateErpSysMenuDto {
    code;
    title;
    path;
    icon;
    type;
    parentId;
    sortOrder;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { code: { required: true, type: () => String, maxLength: 100 }, title: { required: true, type: () => String, maxLength: 200 }, path: { required: false, type: () => String, maxLength: 300 }, icon: { required: false, type: () => String, maxLength: 100 }, type: { required: true, type: () => Object }, parentId: { required: false, type: () => String, nullable: true }, sortOrder: { required: true, type: () => Number, minimum: 0 }, isActive: { required: true, type: () => Boolean } };
    }
}
exports.CreateErpSysMenuDto = CreateErpSysMenuDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'INVENTORY_ITEMS', description: 'Unique menu code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateErpSysMenuDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Inventory Items', description: 'Menu display label' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateErpSysMenuDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '/erp/inventory/items', description: 'Navigation path' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateErpSysMenuDto.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'PackageIcon', description: 'Icon identifier' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateErpSysMenuDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ErpMenuType, example: client_1.ErpMenuType.ITEM }),
    (0, class_validator_1.IsEnum)(client_1.ErpMenuType),
    __metadata("design:type", String)
], CreateErpSysMenuDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1', description: 'Parent menu ID (string, nullable)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateErpSysMenuDto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Sort order position' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateErpSysMenuDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateErpSysMenuDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-erp-sys-menu.dto.js.map