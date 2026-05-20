"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMasterDataProvinceDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_master_data_province_dto_1 = require("./create-master-data-province.dto");
class UpdateMasterDataProvinceDto extends (0, swagger_1.PartialType)(create_master_data_province_dto_1.CreateMasterDataProvinceDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateMasterDataProvinceDto = UpdateMasterDataProvinceDto;
//# sourceMappingURL=update-master-data-province.dto.js.map