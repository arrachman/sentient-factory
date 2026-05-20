"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMasterDataWarehouseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_master_data_warehouse_dto_1 = require("./create-master-data-warehouse.dto");
class UpdateMasterDataWarehouseDto extends (0, swagger_1.PartialType)(create_master_data_warehouse_dto_1.CreateMasterDataWarehouseDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateMasterDataWarehouseDto = UpdateMasterDataWarehouseDto;
//# sourceMappingURL=update-master-data-warehouse.dto.js.map