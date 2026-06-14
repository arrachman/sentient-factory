"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateErpAccountDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_erp_account_dto_1 = require("./create-erp-account.dto");
class UpdateErpAccountDto extends (0, swagger_1.PartialType)(create_erp_account_dto_1.CreateErpAccountDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateErpAccountDto = UpdateErpAccountDto;
//# sourceMappingURL=update-erp-account.dto.js.map