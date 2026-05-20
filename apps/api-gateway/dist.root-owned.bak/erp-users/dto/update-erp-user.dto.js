"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateErpUserDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_erp_user_dto_1 = require("./create-erp-user.dto");
class UpdateErpUserDto extends (0, swagger_1.PartialType)(create_erp_user_dto_1.CreateErpUserDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateErpUserDto = UpdateErpUserDto;
//# sourceMappingURL=update-erp-user.dto.js.map