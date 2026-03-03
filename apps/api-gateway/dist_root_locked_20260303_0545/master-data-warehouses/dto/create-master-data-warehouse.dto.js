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
exports.CreateMasterDataWarehouseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateMasterDataWarehouseDto {
    name;
    cityId;
    locationName;
    addressDetail;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, maxLength: 120 }, cityId: { required: true, type: () => String, maxLength: 100 }, locationName: { required: false, type: () => String, maxLength: 120 }, addressDetail: { required: false, type: () => String, maxLength: 255 } };
    }
}
exports.CreateMasterDataWarehouseDto = CreateMasterDataWarehouseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Warehouse Surabaya' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateMasterDataWarehouseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'city-id-su-medan' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateMasterDataWarehouseDto.prototype, "cityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Rungkut Industrial Area' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateMasterDataWarehouseDto.prototype, "locationName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Jl. Rungkut Industri IV No. 18, Surabaya' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateMasterDataWarehouseDto.prototype, "addressDetail", void 0);
//# sourceMappingURL=create-master-data-warehouse.dto.js.map