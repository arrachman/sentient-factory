"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateErpFiscalPeriodDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_erp_fiscal_period_dto_1 = require("./create-erp-fiscal-period.dto");
class UpdateErpFiscalPeriodDto extends (0, swagger_1.PartialType)(create_erp_fiscal_period_dto_1.CreateErpFiscalPeriodDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateErpFiscalPeriodDto = UpdateErpFiscalPeriodDto;
//# sourceMappingURL=update-erp-fiscal-period.dto.js.map