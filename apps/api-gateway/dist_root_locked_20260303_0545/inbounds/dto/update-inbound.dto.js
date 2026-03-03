"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInboundDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_inbound_dto_1 = require("./create-inbound.dto");
class UpdateInboundDto extends (0, swagger_1.PartialType)(create_inbound_dto_1.CreateInboundDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateInboundDto = UpdateInboundDto;
//# sourceMappingURL=update-inbound.dto.js.map