"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMasterDataUomDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_master_data_uom_dto_1 = require("./create-master-data-uom.dto");
class UpdateMasterDataUomDto extends (0, swagger_1.PartialType)(create_master_data_uom_dto_1.CreateMasterDataUomDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateMasterDataUomDto = UpdateMasterDataUomDto;
//# sourceMappingURL=update-master-data-uom.dto.js.map