"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResponseDto = void 0;
const openapi = require("@nestjs/swagger");
class AuthResponseDto {
    accessToken;
    user;
    static _OPENAPI_METADATA_FACTORY() {
        return { accessToken: { required: true, type: () => String }, user: { required: true, type: () => ({ id: { required: true, type: () => String }, email: { required: true, type: () => String }, username: { required: true, type: () => String }, fullName: { required: false, type: () => String } }) } };
    }
}
exports.AuthResponseDto = AuthResponseDto;
//# sourceMappingURL=auth-response.dto.js.map