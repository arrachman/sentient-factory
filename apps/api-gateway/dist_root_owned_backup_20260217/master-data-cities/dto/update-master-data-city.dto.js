"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMasterDataCityDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_master_data_city_dto_1 = require("./create-master-data-city.dto");
class UpdateMasterDataCityDto extends (0, swagger_1.PartialType)(create_master_data_city_dto_1.CreateMasterDataCityDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateMasterDataCityDto = UpdateMasterDataCityDto;
//# sourceMappingURL=update-master-data-city.dto.js.map