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
exports.ClinicUsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const password_hasher_1 = require("../auth/password-hasher");
const DEFAULT_PASSWORD = 'Test1234!';
let ClinicUsersService = class ClinicUsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email },
            select: { id: true },
        });
        if (existing)
            throw new common_1.ConflictException(`Email ${dto.email} sudah terdaftar.`);
        const validRoles = await this.prisma.role.findMany({
            where: { name: { in: dto.roles }, deletedAt: null },
            select: { id: true, name: true },
        });
        if (validRoles.length !== dto.roles.length) {
            const found = validRoles.map((r) => r.name);
            const missing = dto.roles.filter((r) => !found.includes(r));
            throw new common_1.NotFoundException(`Role tidak ditemukan: ${missing.join(', ')}`);
        }
        const username = (dto.username || dto.email.split('@')[0]).slice(0, 120);
        const passwordHash = await (0, password_hasher_1.hashPassword)(dto.password || DEFAULT_PASSWORD);
        const created = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: dto.email,
                    username,
                    passwordHash,
                    fullName: dto.fullName,
                    isActive: dto.isActive ?? true,
                    createdBy: actorId,
                    updatedBy: actorId,
                },
            });
            for (const role of validRoles) {
                await tx.userRole.create({
                    data: {
                        userId: user.id,
                        roleId: role.id,
                        createdBy: actorId,
                        updatedBy: actorId,
                    },
                });
            }
            return user;
        });
        return { success: true, data: await this.fetchOne(created.id), message: 'User created' };
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 50;
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
            roles: {
                some: {
                    deletedAt: null,
                    role: {
                        name: { startsWith: 'clinic-' },
                        deletedAt: null,
                    },
                },
            },
        };
        if (typeof query.isActive === 'boolean')
            where.isActive = query.isActive;
        if (query.search?.trim()) {
            const q = query.search.trim();
            where.OR = [
                { email: { contains: q, mode: 'insensitive' } },
                { fullName: { contains: q, mode: 'insensitive' } },
                { username: { contains: q, mode: 'insensitive' } },
            ];
        }
        if (query.role) {
            where.roles = {
                some: {
                    deletedAt: null,
                    role: { name: query.role, deletedAt: null },
                },
            };
        }
        const [users, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                where,
                include: {
                    roles: {
                        where: { deletedAt: null },
                        include: { role: { select: { id: true, name: true, description: true } } },
                    },
                },
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            success: true,
            data: users.map((u) => this.toResponse(u)),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        return { success: true, data: await this.fetchOne(id) };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.user.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing)
            throw new common_1.NotFoundException(`User ${id} not found`);
        await this.prisma.$transaction(async (tx) => {
            const userUpdates = { updatedBy: actorId };
            if (dto.fullName !== undefined)
                userUpdates.fullName = dto.fullName;
            if (dto.isActive !== undefined)
                userUpdates.isActive = dto.isActive;
            if (dto.password)
                userUpdates.passwordHash = await (0, password_hasher_1.hashPassword)(dto.password);
            await tx.user.update({ where: { id }, data: userUpdates });
            if (dto.roles && dto.roles.length > 0) {
                const currentRoles = await tx.userRole.findMany({
                    where: {
                        userId: id,
                        deletedAt: null,
                        role: { name: { startsWith: 'clinic-' } },
                    },
                    select: { id: true, roleId: true, role: { select: { name: true } } },
                });
                const currentRoleNames = currentRoles.map((r) => r.role.name);
                const targetRoles = await tx.role.findMany({
                    where: { name: { in: dto.roles } },
                    select: { id: true, name: true },
                });
                const toRemove = currentRoles.filter((r) => !dto.roles.includes(r.role.name));
                for (const r of toRemove) {
                    await tx.userRole.update({
                        where: { id: r.id },
                        data: { deletedAt: new Date(), deletedBy: actorId },
                    });
                }
                const toAdd = targetRoles.filter((r) => !currentRoleNames.includes(r.name));
                for (const r of toAdd) {
                    await tx.userRole.upsert({
                        where: { userId_roleId: { userId: id, roleId: r.id } },
                        update: { deletedAt: null, deletedBy: null, updatedBy: actorId },
                        create: { userId: id, roleId: r.id, createdBy: actorId, updatedBy: actorId },
                    });
                }
            }
        });
        return { success: true, data: await this.fetchOne(id), message: 'User updated' };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.user.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing)
            throw new common_1.NotFoundException(`User ${id} not found`);
        await this.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date(), deletedBy: actorId, isActive: false, updatedBy: actorId },
        });
        return { success: true, message: 'User deleted' };
    }
    async fetchOne(id) {
        const user = await this.prisma.user.findFirst({
            where: { id, deletedAt: null },
            include: {
                roles: {
                    where: { deletedAt: null },
                    include: { role: { select: { id: true, name: true, description: true } } },
                },
            },
        });
        if (!user)
            throw new common_1.NotFoundException(`User ${id} not found`);
        return this.toResponse(user);
    }
    toResponse(user) {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            fullName: user.fullName,
            avatarUrl: user.avatarUrl,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            roles: user.roles.map((r) => r.role).filter((r) => r.name.startsWith('clinic-')),
        };
    }
};
exports.ClinicUsersService = ClinicUsersService;
exports.ClinicUsersService = ClinicUsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClinicUsersService);
//# sourceMappingURL=clinic-users.service.js.map