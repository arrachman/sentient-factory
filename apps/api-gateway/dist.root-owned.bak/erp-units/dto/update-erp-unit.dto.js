"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateErpUnitDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_erp_unit_dto_1 = require("./create-erp-unit.dto");
class UpdateErpUnitDto extends (0, swagger_1.PartialType)(create_erp_unit_dto_1.CreateErpUnitDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateErpUnitDto = UpdateErpUnitDto;
//# sourceMappingURL=update-erp-unit.dto.js.map