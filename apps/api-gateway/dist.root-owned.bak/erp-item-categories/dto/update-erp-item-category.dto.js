"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateErpItemCategoryDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_erp_item_category_dto_1 = require("./create-erp-item-category.dto");
class UpdateErpItemCategoryDto extends (0, swagger_1.PartialType)(create_erp_item_category_dto_1.CreateErpItemCategoryDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateErpItemCategoryDto = UpdateErpItemCategoryDto;
//# sourceMappingURL=update-erp-item-category.dto.js.map