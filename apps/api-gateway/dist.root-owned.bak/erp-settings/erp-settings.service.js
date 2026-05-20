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
exports.ErpSettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_user_util_1 = require("../common/utils/audit-user.util");
let ErpSettingsService = class ErpSettingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const where = { deletedAt: null };
        if (query.group?.trim()) {
            where.group = query.group.trim();
        }
        if (query.key?.trim()) {
            where.key = query.key.trim();
        }
        const items = await this.prisma.erpSetting.findMany({
            where,
            orderBy: [{ group: 'asc' }, { sortOrder: 'asc' }, { key: 'asc' }],
        });
        return { success: true, data: items };
    }
    async findOne(key) {
        const item = await this.prisma.erpSetting.findFirst({
            where: { key, deletedAt: null },
        });
        if (!item) {
            throw new common_1.NotFoundException(`ERP setting with key "${key}" not found`);
        }
        return { success: true, data: item };
    }
    async upsert(key, dto, actorId) {
        const existing = await this.prisma.erpSetting.findFirst({
            where: { key, deletedAt: null },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`ERP setting with key "${key}" not found`);
        }
        const updated = await this.prisma.erpSetting.update({
            where: { id: existing.id },
            data: {
                value: dto.value ?? existing.value,
                updatedById: (0, audit_user_util_1.toAuditUserId)(actorId)
                    ? BigInt((0, audit_user_util_1.toAuditUserId)(actorId))
                    : undefined,
            },
        });
        return { success: true, data: updated };
    }
};
exports.ErpSettingsService = ErpSettingsService;
exports.ErpSettingsService = ErpSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ErpSettingsService);
//# sourceMappingURL=erp-settings.service.js.map