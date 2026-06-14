"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateErpDocumentNumberingDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_erp_document_numbering_dto_1 = require("./create-erp-document-numbering.dto");
class UpdateErpDocumentNumberingDto extends (0, swagger_1.PartialType)(create_erp_document_numbering_dto_1.CreateErpDocumentNumberingDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateErpDocumentNumberingDto = UpdateErpDocumentNumberingDto;
//# sourceMappingURL=update-erp-document-numbering.dto.js.map