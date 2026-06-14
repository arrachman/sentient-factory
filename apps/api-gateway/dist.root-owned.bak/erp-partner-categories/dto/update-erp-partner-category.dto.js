"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateErpPartnerCategoryDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_erp_partner_category_dto_1 = require("./create-erp-partner-category.dto");
class UpdateErpPartnerCategoryDto extends (0, swagger_1.PartialType)(create_erp_partner_category_dto_1.CreateErpPartnerCategoryDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateErpPartnerCategoryDto = UpdateErpPartnerCategoryDto;
//# sourceMappingURL=update-erp-partner-category.dto.js.map