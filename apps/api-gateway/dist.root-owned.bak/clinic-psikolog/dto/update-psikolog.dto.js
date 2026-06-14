"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePsikologDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_psikolog_dto_1 = require("./create-psikolog.dto");
class UpdatePsikologDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_psikolog_dto_1.CreatePsikologDto, ['email', 'username', 'password'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdatePsikologDto = UpdatePsikologDto;
//# sourceMappingURL=update-psikolog.dto.js.map