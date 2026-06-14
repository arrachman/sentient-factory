"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateErpPaymentTermDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_erp_payment_term_dto_1 = require("./create-erp-payment-term.dto");
class UpdateErpPaymentTermDto extends (0, swagger_1.PartialType)(create_erp_payment_term_dto_1.CreateErpPaymentTermDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateErpPaymentTermDto = UpdateErpPaymentTermDto;
//# sourceMappingURL=update-erp-payment-term.dto.js.map