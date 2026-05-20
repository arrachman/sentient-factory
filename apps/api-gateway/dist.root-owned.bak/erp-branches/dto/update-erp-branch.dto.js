"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateErpBranchDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_erp_branch_dto_1 = require("./create-erp-branch.dto");
class UpdateErpBranchDto extends (0, swagger_1.PartialType)(create_erp_branch_dto_1.CreateErpBranchDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateErpBranchDto = UpdateErpBranchDto;
//# sourceMappingURL=update-erp-branch.dto.js.map