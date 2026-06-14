"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpAuthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const erp_jwt_auth_guard_1 = require("./guards/erp-jwt-auth.guard");
const erp_auth_service_1 = require("./erp-auth.service");
const erp_login_dto_1 = require("./dto/erp-login.dto");
const erp_auth_response_dto_1 = require("./dto/erp-auth-response.dto");
let ErpAuthController = class ErpAuthController {
    erpAuthService;
    constructor(erpAuthService) {
        this.erpAuthService = erpAuthService;
    }
    async login(dto, req, res) {
        const erpUser = await this.erpAuthService.validateErpUser(dto.login, dto.password);
        if (!erpUser) {
            throw new common_1.UnauthorizedException('Username/email atau password tidak valid');
        }
        const result = await this.erpAuthService.login(erpUser, res, {
            ipAddress: req.headers['x-forwarded-for'] ?? req.ip ?? null,
            userAgent: req.headers['user-agent'] ?? null,
        });
        return {
            success: true,
            data: result,
        };
    }
    logout(res) {
        this.erpAuthService.logout(res);
        return {
            success: true,
            message: 'Logout berhasil',
        };
    }
    async getMe(req) {
        const data = await this.erpAuthService.getMe(req.user.id);
        return {
            success: true,
            data,
        };
    }
};
exports.ErpAuthController = ErpAuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Login pengguna ERP — kembalikan JWT + set cookie erp_token' }),
    (0, swagger_1.ApiBody)({ type: erp_login_dto_1.ErpLoginDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login berhasil', type: erp_auth_response_dto_1.ErpAuthResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Username/email atau password salah' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [erp_login_dto_1.ErpLoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ErpAuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Logout pengguna ERP — hapus cookie erp_token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logout berhasil' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ErpAuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(erp_jwt_auth_guard_1.ErpJwtAuthGuard),
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Ambil profil pengguna ERP saat ini' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profil pengguna ERP' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ErpAuthController.prototype, "getMe", null);
exports.ErpAuthController = ErpAuthController = __decorate([
    (0, swagger_1.ApiTags)('ERP Auth'),
    (0, common_1.Controller)('erp/auth'),
    __metadata("design:paramtypes", [erp_auth_service_1.ErpAuthService])
], ErpAuthController);
//# sourceMappingURL=erp-auth.controller.js.map