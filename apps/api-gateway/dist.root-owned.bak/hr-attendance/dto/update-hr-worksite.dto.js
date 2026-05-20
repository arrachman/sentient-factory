"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHrWorksiteDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_hr_worksite_dto_1 = require("./create-hr-worksite.dto");
class UpdateHrWorksiteDto extends (0, swagger_1.PartialType)(create_hr_worksite_dto_1.CreateHrWorksiteDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateHrWorksiteDto = UpdateHrWorksiteDto;
//# sourceMappingURL=update-hr-worksite.dto.js.map