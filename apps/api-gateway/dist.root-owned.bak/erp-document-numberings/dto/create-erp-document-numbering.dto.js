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
exports.CreateErpDocumentNumberingDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class CreateErpDocumentNumberingDto {
    documentCode;
    name;
    prefix;
    digitCount;
    resetPolicy;
    nextNumber;
    menuId;
    affectsLedger;
    affectsInventory;
    affectsCost;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { documentCode: { required: true, type: () => String, maxLength: 50 }, name: { required: true, type: () => String, maxLength: 200 }, prefix: { required: true, type: () => String, maxLength: 20 }, digitCount: { required: true, type: () => Number, minimum: 1 }, resetPolicy: { required: true, type: () => Object }, nextNumber: { required: false, type: () => Number, minimum: 1 }, menuId: { required: false, type: () => String }, affectsLedger: { required: false, type: () => Boolean }, affectsInventory: { required: false, type: () => Boolean }, affectsCost: { required: false, type: () => Boolean }, notes: { required: false, type: () => String, maxLength: 500 } };
    }
}
exports.CreateErpDocumentNumberingDto = CreateErpDocumentNumberingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'INV-OUT', description: 'Unique document code identifier' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateErpDocumentNumberingDto.prototype, "documentCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sales Invoice', description: 'Document type name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateErpDocumentNumberingDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'INV', description: 'Document number prefix' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateErpDocumentNumberingDto.prototype, "prefix", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, description: 'Number of digits in sequence (e.g. 5 → 00001)' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateErpDocumentNumberingDto.prototype, "digitCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ErpNumberingReset, example: client_1.ErpNumberingReset.YEARLY }),
    (0, class_validator_1.IsEnum)(client_1.ErpNumberingReset),
    __metadata("design:type", String)
], CreateErpDocumentNumberingDto.prototype, "resetPolicy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, description: 'Starting sequence number', default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateErpDocumentNumberingDto.prototype, "nextNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1', description: 'Menu ID to associate with' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateErpDocumentNumberingDto.prototype, "menuId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateErpDocumentNumberingDto.prototype, "affectsLedger", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateErpDocumentNumberingDto.prototype, "affectsInventory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateErpDocumentNumberingDto.prototype, "affectsCost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Used for outgoing invoices' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateErpDocumentNumberingDto.prototype, "notes", void 0);
//# sourceMappingURL=create-erp-document-numbering.dto.js.map