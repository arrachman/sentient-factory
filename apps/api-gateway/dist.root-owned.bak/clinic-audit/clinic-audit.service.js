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
exports.ClinicAuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ClinicAuditService = class ClinicAuditService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const page = Number(query.page) || 1;
        const limit = Math.min(Number(query.limit) || 50, 200);
        const skip = (page - 1) * limit;
        const where = {
            entityType: { startsWith: 'clinic.' },
        };
        if (query.entityType)
            where.entityType = query.entityType;
        if (query.action)
            where.action = query.action;
        if (query.userId)
            where.userId = Number(query.userId);
        const [items, total] = await this.prisma.$transaction([
            this.prisma.auditLog.findMany({
                where,
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
                include: {
                    user: { select: { fullName: true, username: true } },
                },
            }),
            this.prisma.auditLog.count({ where }),
        ]);
        return {
            success: true,
            data: items.map((item) => ({
                ...item,
                userName: item.user?.fullName ?? item.user?.username ?? null,
                user: undefined,
            })),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
};
exports.ClinicAuditService = ClinicAuditService;
exports.ClinicAuditService = ClinicAuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClinicAuditService);
//# sourceMappingURL=clinic-audit.service.js.map