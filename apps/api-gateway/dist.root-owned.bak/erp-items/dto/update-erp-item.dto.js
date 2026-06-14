"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateErpItemDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_erp_item_dto_1 = require("./create-erp-item.dto");
class UpdateErpItemDto extends (0, swagger_1.PartialType)(create_erp_item_dto_1.CreateErpItemDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateErpItemDto = UpdateErpItemDto;
//# sourceMappingURL=update-erp-item.dto.js.map