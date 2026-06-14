"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateErpLocationDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_erp_location_dto_1 = require("./create-erp-location.dto");
class UpdateErpLocationDto extends (0, swagger_1.PartialType)(create_erp_location_dto_1.CreateErpLocationDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateErpLocationDto = UpdateErpLocationDto;
//# sourceMappingURL=update-erp-location.dto.js.map