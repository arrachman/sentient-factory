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
exports.ErpPermissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ErpPermissionsService = class ErpPermissionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
        if (query.resource?.trim()) {
            where.group = { contains: query.resource.trim(), mode: 'insensitive' };
        }
        if (query.action?.trim()) {
            where.code = { contains: query.action.trim(), mode: 'insensitive' };
        }
        if (query.search?.trim()) {
            const q = query.search.trim();
            where.OR = [
                { code: { contains: q, mode: 'insensitive' } },
                { name: { contains: q, mode: 'insensitive' } },
                { group: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
            ];
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.erpPermission.findMany({
                where,
                orderBy: [{ group: 'asc' }, { code: 'asc' }],
                skip,
                take: limit,
            }),
            this.prisma.erpPermission.count({ where }),
        ]);
        return {
            success: true,
            data: items,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    }
    async findOne(id) {
        const item = await this.prisma.erpPermission.findFirst({
            where: { id: id, deletedAt: null },
        });
        if (!item) {
            throw new common_1.NotFoundException('ERP Permission not found');
        }
        return { success: true, data: item };
    }
};
exports.ErpPermissionsService = ErpPermissionsService;
exports.ErpPermissionsService = ErpPermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ErpPermissionsService);
//# sourceMappingURL=erp-permissions.service.js.map