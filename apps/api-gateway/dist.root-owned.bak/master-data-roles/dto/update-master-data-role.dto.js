"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMasterDataRoleDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_master_data_role_dto_1 = require("./create-master-data-role.dto");
class UpdateMasterDataRoleDto extends (0, swagger_1.PartialType)(create_master_data_role_dto_1.CreateMasterDataRoleDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateMasterDataRoleDto = UpdateMasterDataRoleDto;
//# sourceMappingURL=update-master-data-role.dto.js.map