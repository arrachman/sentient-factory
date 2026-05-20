"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateErpSysMenuDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_erp_sys_menu_dto_1 = require("./create-erp-sys-menu.dto");
class UpdateErpSysMenuDto extends (0, swagger_1.PartialType)(create_erp_sys_menu_dto_1.CreateErpSysMenuDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateErpSysMenuDto = UpdateErpSysMenuDto;
//# sourceMappingURL=update-erp-sys-menu.dto.js.map