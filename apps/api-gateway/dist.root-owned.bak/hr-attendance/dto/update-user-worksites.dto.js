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
exports.UpdateUserWorksitesDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class UpdateUserWorksitesDto {
    worksiteIds;
    static _OPENAPI_METADATA_FACTORY() {
        return { worksiteIds: { required: true, type: () => [Number] } };
    }
}
exports.UpdateUserWorksitesDto = UpdateUserWorksitesDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (Array.isArray(value)) {
            return value.map((entry) => Number(entry)).filter((entry) => Number.isFinite(entry));
        }
        if (typeof value === 'string' && value.trim()) {
            return value
                .split(',')
                .map((entry) => Number(entry.trim()))
                .filter((entry) => Number.isFinite(entry));
        }
        return [];
    }),
    (0, class_validator_1.IsInt)({ each: true }),
    __metadata("design:type", Array)
], UpdateUserWorksitesDto.prototype, "worksiteIds", void 0);
//# sourceMappingURL=update-user-worksites.dto.js.map