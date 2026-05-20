"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateErpCurrencyDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_erp_currency_dto_1 = require("./create-erp-currency.dto");
class UpdateErpCurrencyDto extends (0, swagger_1.PartialType)(create_erp_currency_dto_1.CreateErpCurrencyDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateErpCurrencyDto = UpdateErpCurrencyDto;
//# sourceMappingURL=update-erp-currency.dto.js.map