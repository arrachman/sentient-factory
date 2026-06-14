"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateErpWarehouseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_erp_warehouse_dto_1 = require("./create-erp-warehouse.dto");
class UpdateErpWarehouseDto extends (0, swagger_1.PartialType)(create_erp_warehouse_dto_1.CreateErpWarehouseDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateErpWarehouseDto = UpdateErpWarehouseDto;
//# sourceMappingURL=update-erp-warehouse.dto.js.map