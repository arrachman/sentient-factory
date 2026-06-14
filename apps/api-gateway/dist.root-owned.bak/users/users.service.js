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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOneByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                roles: {
                    where: {
                        deletedAt: null,
                        role: {
                            deletedAt: null,
                        },
                    },
                    include: {
                        role: true,
                    },
                },
            },
        });
    }
    async findOneByUsername(username) {
        return this.prisma.user.findUnique({
            where: { username },
        });
    }
    async findOneById(id) {
        const userId = typeof id === 'number' ? id : Number(id);
        if (!Number.isInteger(userId)) {
            return null;
        }
        return this.prisma.user.findUnique({
            where: { id: userId },
        });
    }
    async findOneByUuid(id) {
        return this.findOneById(id);
    }
    async hasWarehouse(id) {
        const warehouseId = await this.getCurrentWarehouseId(id);
        return Boolean(warehouseId);
    }
    async getWarehouseMetaByUserUuid(id) {
        const userId = typeof id === 'number' ? id : Number(id);
        if (!Number.isInteger(userId)) {
            return { warehouseId: null, warehouseName: null };
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                warehouse: { select: { id: true, name: true } },
            },
        });
        return {
            warehouseId: user?.warehouse?.id ?? null,
            warehouseName: user?.warehouse?.name ?? null,
        };
    }
    async getActiveRoleNamesByUserId(id) {
        const userId = typeof id === 'number' ? id : Number(id);
        if (!Number.isInteger(userId)) {
            return [];
        }
        const rows = await this.prisma.userRole.findMany({
            where: {
                userId,
                deletedAt: null,
                role: {
                    deletedAt: null,
                },
            },
            include: {
                role: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: [{ assignedAt: 'asc' }, { id: 'asc' }],
        });
        return rows
            .map((row) => row.role?.name?.trim())
            .filter((value) => Boolean(value));
    }
    async create(data) {
        return this.prisma.user.create({
            data,
        });
    }
    async updateRefreshToken(_userId, _refreshToken) {
        return;
    }
    async getCurrentWarehouseId(userId) {
        const id = typeof userId === 'number' ? userId : Number(userId);
        if (!Number.isInteger(id))
            return null;
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: { warehouseId: true },
        });
        return user?.warehouseId ?? null;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map