"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMasterDataPermissionDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_master_data_permission_dto_1 = require("./create-master-data-permission.dto");
class UpdateMasterDataPermissionDto extends (0, swagger_1.PartialType)(create_master_data_permission_dto_1.CreateMasterDataPermissionDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateMasterDataPermissionDto = UpdateMasterDataPermissionDto;
//# sourceMappingURL=update-master-data-permission.dto.js.map