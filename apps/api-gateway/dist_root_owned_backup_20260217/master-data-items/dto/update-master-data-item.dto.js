"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMasterDataItemDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_master_data_item_dto_1 = require("./create-master-data-item.dto");
class UpdateMasterDataItemDto extends (0, swagger_1.PartialType)(create_master_data_item_dto_1.CreateMasterDataItemDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateMasterDataItemDto = UpdateMasterDataItemDto;
//# sourceMappingURL=update-master-data-item.dto.js.map