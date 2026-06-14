"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateErpRoleDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_erp_role_dto_1 = require("./create-erp-role.dto");
class UpdateErpRoleDto extends (0, swagger_1.PartialType)(create_erp_role_dto_1.CreateErpRoleDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateErpRoleDto = UpdateErpRoleDto;
//# sourceMappingURL=update-erp-role.dto.js.map