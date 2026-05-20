"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMasterDataContactDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_master_data_contact_dto_1 = require("./create-master-data-contact.dto");
class UpdateMasterDataContactDto extends (0, swagger_1.PartialType)(create_master_data_contact_dto_1.CreateMasterDataContactDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateMasterDataContactDto = UpdateMasterDataContactDto;
//# sourceMappingURL=update-master-data-contact.dto.js.map