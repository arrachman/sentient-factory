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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const duplicate_util_1 = require("../common/errors/duplicate.util");
const password_hasher_1 = require("./password-hasher");
let AuthService = AuthService_1 = class AuthService {
    prisma;
    usersService;
    jwtService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(prisma, usersService, jwtService) {
        this.prisma = prisma;
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findOneByEmail(email);
        if (user && (await (0, password_hasher_1.verifyPassword)(pass, user.passwordHash))) {
            if (!user.isActive) {
                return null;
            }
            const roles = await this.usersService.getActiveRoleNamesByUserId(user.id);
            const isClinicUser = roles.some((r) => r.startsWith('clinic-'));
            if (!isClinicUser) {
                const hasWarehouse = await this.usersService.hasWarehouse(user.id);
                if (!hasWarehouse) {
                    return null;
                }
            }
            const { passwordHash: _passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user, meta) {
        const sessionKey = (0, crypto_1.randomUUID)();
        const roles = await this.usersService.getActiveRoleNamesByUserId(user.id);
        const warehouse = await this.usersService.getWarehouseMetaByUserUuid(user.id);
        const payload = {
            username: user.username,
            fullName: user.fullName ?? null,
            sub: user.id,
            email: user.email,
            roles: roles,
            sid: sessionKey,
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        const ipAddress = this.normalizeHeaderValue(meta?.ipAddress);
        const userAgent = this.normalizeHeaderValue(meta?.userAgent);
        const loginAt = new Date();
        try {
            await this.prisma.session.create({
                data: {
                    userId: user.id,
                    token: accessToken,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    ipAddress,
                    userAgent,
                    createdBy: user.id,
                    updatedBy: user.id,
                },
            });
            await this.prisma.user.update({
                where: { id: user.id },
                data: { lastLogin: loginAt },
            });
        }
        catch (error) {
            this.logger.warn(`Session tracking failed for user ${user.id}: ${error instanceof Error ? error.message : String(error)}`);
        }
        return {
            success: true,
            data: {
                token: accessToken,
                refreshToken: refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    fullName: user.fullName,
                    name: user.fullName,
                    warehouseId: warehouse.warehouseId,
                    warehouseName: warehouse.warehouseName,
                    role: roles[0] || 'user',
                    roles: roles,
                    createdAt: user.createdAt,
                },
            },
            message: 'Login successful',
        };
    }
    async logout(authUser, token) {
        if (authUser?.id && token) {
            try {
                await this.prisma.session.updateMany({
                    where: {
                        userId: authUser.id,
                        token,
                        deletedAt: null,
                    },
                    data: {
                        deletedAt: new Date(),
                        deletedBy: authUser.id,
                        updatedBy: authUser.id,
                    },
                });
            }
            catch (error) {
                this.logger.warn(`Session logout tracking failed for user ${authUser.id}: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        return {
            success: true,
            message: 'Logged out successfully',
        };
    }
    async register(registerDto) {
        const existingUser = await this.usersService.findOneByEmail(registerDto.email);
        if (existingUser) {
            (0, duplicate_util_1.throwDuplicate)({
                fieldLabel: 'Email',
                value: registerDto.email,
                isSoftDeleted: Boolean(existingUser.deletedAt),
                type: 'conflict',
            });
        }
        const existingUsername = await this.usersService.findOneByUsername(registerDto.username);
        if (existingUsername) {
            (0, duplicate_util_1.throwDuplicate)({
                fieldLabel: 'Username',
                value: registerDto.username,
                isSoftDeleted: Boolean(existingUsername.deletedAt),
                type: 'conflict',
            });
        }
        const hashedPassword = await (0, password_hasher_1.hashPassword)(registerDto.password);
        const user = await this.usersService.create({
            email: registerDto.email,
            username: registerDto.username,
            passwordHash: hashedPassword,
            fullName: registerDto.fullName,
        });
        return {
            success: true,
            data: {
                id: user.id,
                email: user.email,
                name: user.fullName,
                username: user.username,
                role: 'user',
                createdAt: user.createdAt,
            },
            message: 'User successfully created',
        };
    }
    async getProfile(authUser) {
        const dbUser = authUser?.id ? await this.usersService.findOneById(authUser.id) : null;
        const warehouse = authUser?.id
            ? await this.usersService.getWarehouseMetaByUserUuid(authUser.id)
            : { warehouseId: null, warehouseName: null };
        const roles = authUser?.id
            ? await this.usersService.getActiveRoleNamesByUserId(authUser.id)
            : [];
        const id = authUser?.id ?? dbUser?.id ?? null;
        const email = dbUser?.email ?? authUser?.email ?? null;
        const username = dbUser?.username ?? authUser?.username ?? null;
        const fullName = typeof dbUser?.fullName === 'string' && dbUser.fullName.trim().length > 0
            ? dbUser.fullName
            : typeof authUser?.fullName === 'string' && authUser.fullName.trim().length > 0
                ? authUser.fullName
                : null;
        return {
            success: true,
            data: {
                id,
                email,
                username,
                fullName,
                name: fullName || username || 'User',
                warehouseId: warehouse.warehouseId,
                warehouseName: warehouse.warehouseName,
                roles,
            },
        };
    }
    normalizeHeaderValue(value) {
        if (typeof value !== 'string') {
            return null;
        }
        const normalized = value.trim();
        return normalized.length > 0 ? normalized : null;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map