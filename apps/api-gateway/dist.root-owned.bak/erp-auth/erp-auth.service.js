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
var ErpAuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpAuthService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const password_hasher_1 = require("../auth/password-hasher");
const ERP_COOKIE_NAME = 'erp_token';
const ERP_COOKIE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
let ErpAuthService = ErpAuthService_1 = class ErpAuthService {
    prisma;
    jwtService;
    logger = new common_1.Logger(ErpAuthService_1.name);
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validateErpUser(login, password) {
        const loginLower = login.toLowerCase().trim();
        const erpUser = await this.prisma.erpUser.findFirst({
            where: {
                deletedAt: null,
                OR: [
                    { code: { equals: loginLower, mode: 'insensitive' } },
                    { email: { equals: loginLower, mode: 'insensitive' } },
                ],
            },
        });
        if (!erpUser) {
            return null;
        }
        const passwordValid = await (0, password_hasher_1.verifyPassword)(password, erpUser.passwordHash);
        if (!passwordValid) {
            return null;
        }
        if (!erpUser.isActive) {
            return null;
        }
        const { passwordHash: _ph, ...safeUser } = erpUser;
        return safeUser;
    }
    async login(erpUser, res, meta) {
        const sid = (0, crypto_1.randomUUID)();
        const payload = {
            sub: erpUser.id.toString(),
            email: erpUser.email,
            username: erpUser.code,
            erpLevel: erpUser.level,
            sid,
        };
        const accessToken = this.jwtService.sign(payload);
        res.cookie(ERP_COOKIE_NAME, accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: ERP_COOKIE_MAX_AGE_MS,
            path: '/',
        });
        const ipAddress = this.normalizeHeaderValue(meta?.ipAddress);
        const userAgent = this.normalizeHeaderValue(meta?.userAgent);
        this.logger.log(`ERP login: user=${erpUser.code} ip=${ipAddress ?? 'unknown'} ua=${userAgent ?? 'unknown'}`);
        return {
            accessToken,
            user: {
                id: erpUser.id.toString(),
                username: erpUser.code,
                name: erpUser.name,
                email: erpUser.email ?? null,
                erpLevel: erpUser.level,
            },
        };
    }
    logout(res) {
        res.clearCookie(ERP_COOKIE_NAME, { path: '/' });
    }
    async getMe(userId) {
        const id = BigInt(userId);
        const erpUser = await this.prisma.erpUser.findFirst({
            where: { id, deletedAt: null },
        });
        if (!erpUser) {
            throw new common_1.NotFoundException(`ERP user not found`);
        }
        const { passwordHash: _ph, ...safeUser } = erpUser;
        return {
            ...safeUser,
            id: safeUser.id.toString(),
        };
    }
    normalizeHeaderValue(value) {
        if (typeof value !== 'string') {
            return null;
        }
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : null;
    }
};
exports.ErpAuthService = ErpAuthService;
exports.ErpAuthService = ErpAuthService = ErpAuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], ErpAuthService);
//# sourceMappingURL=erp-auth.service.js.map