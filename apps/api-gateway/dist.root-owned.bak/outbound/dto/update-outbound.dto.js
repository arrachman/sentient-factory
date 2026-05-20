"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOutboundDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_outbound_dto_1 = require("./create-outbound.dto");
class UpdateOutboundDto extends (0, swagger_1.PartialType)(create_outbound_dto_1.CreateOutboundDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateOutboundDto = UpdateOutboundDto;
//# sourceMappingURL=update-outbound.dto.js.map