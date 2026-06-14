"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateErpTaxDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_erp_tax_dto_1 = require("./create-erp-tax.dto");
class UpdateErpTaxDto extends (0, swagger_1.PartialType)(create_erp_tax_dto_1.CreateErpTaxDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateErpTaxDto = UpdateErpTaxDto;
//# sourceMappingURL=update-erp-tax.dto.js.map