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
var ClinicWaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicWaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const prisma_service_1 = require("../prisma/prisma.service");
const phone_util_1 = require("../common/utils/phone.util");
const template_renderer_1 = require("./template-renderer");
const wa_tokens_1 = require("./wa.tokens");
const wa_queue_constants_1 = require("./queue/wa-queue.constants");
let ClinicWaService = ClinicWaService_1 = class ClinicWaService {
    prisma;
    wa;
    config;
    waQueue;
    logger = new common_1.Logger(ClinicWaService_1.name);
    queueEnabled;
    constructor(prisma, wa, config, waQueue) {
        this.prisma = prisma;
        this.wa = wa;
        this.config = config;
        this.waQueue = waQueue;
        this.queueEnabled = this.config.get('WA_QUEUE_ENABLED') === 'true';
        if (this.queueEnabled) {
            this.logger.log('WA queue mode ENABLED (BullMQ async + retry 3×)');
        }
    }
    async createTemplate(dto, actorId) {
        const created = await this.prisma.clinicWaTemplate.create({
            data: {
                ...dto,
                isActive: dto.isActive ?? true,
                createdBy: actorId,
                updatedBy: actorId,
            },
        });
        return { success: true, data: created, message: 'Template created' };
    }
    async findAllTemplates(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 50;
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
        if (query.category)
            where.category = query.category;
        if (typeof query.isActive === 'boolean')
            where.isActive = query.isActive;
        if (query.search?.trim()) {
            where.OR = [
                { name: { contains: query.search.trim(), mode: 'insensitive' } },
                { triggerEvent: { contains: query.search.trim(), mode: 'insensitive' } },
                { body: { contains: query.search.trim(), mode: 'insensitive' } },
            ];
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.clinicWaTemplate.findMany({
                where,
                orderBy: [{ category: 'asc' }, { name: 'asc' }],
                skip,
                take: limit,
            }),
            this.prisma.clinicWaTemplate.count({ where }),
        ]);
        return {
            success: true,
            data: items,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOneTemplate(id) {
        const template = await this.prisma.clinicWaTemplate.findFirst({
            where: { id, deletedAt: null },
        });
        if (!template)
            throw new common_1.NotFoundException(`Template ${id} not found`);
        return { success: true, data: template };
    }
    async updateTemplate(id, dto, actorId) {
        await this.findOneTemplate(id);
        const updated = await this.prisma.clinicWaTemplate.update({
            where: { id },
            data: { ...dto, updatedBy: actorId },
        });
        return { success: true, data: updated, message: 'Template updated' };
    }
    async removeTemplate(id, actorId) {
        await this.findOneTemplate(id);
        await this.prisma.clinicWaTemplate.update({
            where: { id },
            data: { deletedAt: new Date(), deletedBy: actorId, isActive: false, updatedBy: actorId },
        });
        return { success: true, message: 'Template deleted' };
    }
    async findAllLogs(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 50;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.status)
            where.status = query.status;
        if (query.recipientPhone)
            where.recipientPhone = { contains: query.recipientPhone };
        if (query.templateId)
            where.templateId = query.templateId;
        const [items, total] = await this.prisma.$transaction([
            this.prisma.clinicWaLog.findMany({
                where,
                include: { template: { select: { id: true, name: true, category: true } } },
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.clinicWaLog.count({ where }),
        ]);
        return {
            success: true,
            data: items,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async getStats(date) {
        const targetDate = date ? new Date(date) : new Date();
        const start = new Date(targetDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(targetDate);
        end.setHours(23, 59, 59, 999);
        const where = { createdAt: { gte: start, lte: end } };
        const [total, readCount, failedCount] = await this.prisma.$transaction([
            this.prisma.clinicWaLog.count({ where }),
            this.prisma.clinicWaLog.count({ where: { ...where, status: 'dibaca' } }),
            this.prisma.clinicWaLog.count({ where: { ...where, status: 'gagal' } }),
        ]);
        return {
            success: true,
            data: {
                sentToday: total,
                readToday: readCount,
                failedToday: failedCount,
                readRate: total > 0 ? Math.round((readCount / total) * 100) : 0,
            },
        };
    }
    async sendTest(dto, actorId) {
        let body = dto.body || '';
        let templateId = null;
        if (dto.templateId) {
            const tpl = await this.findOneTemplate(dto.templateId);
            body = (0, template_renderer_1.renderTemplate)(tpl.data.body, dto.variables ?? {});
            templateId = tpl.data.id;
        }
        else if (dto.body && dto.variables) {
            body = (0, template_renderer_1.renderTemplate)(dto.body, dto.variables);
        }
        return this.dispatchRaw({
            templateId,
            recipientType: 'klien',
            recipientPhone: dto.phone,
            body,
            bookingId: null,
            metadata: { test: true, actor: actorId },
        });
    }
    async dispatch(params) {
        const tpl = await this.prisma.clinicWaTemplate.findFirst({
            where: { name: params.templateName, isActive: true, deletedAt: null },
        });
        if (!tpl) {
            this.logger.warn(`Template '${params.templateName}' not found / inactive — skip dispatch`);
            return { success: false, error: 'template_not_found' };
        }
        const body = (0, template_renderer_1.renderTemplate)(tpl.body, params.variables);
        return this.dispatchRaw({
            templateId: tpl.id,
            recipientType: params.recipientType,
            recipientPhone: params.recipientPhone,
            body,
            bookingId: params.bookingId ?? null,
            metadata: { event: tpl.triggerEvent, variables: params.variables },
        });
    }
    async dispatchRaw(args) {
        const normalizedPhone = (0, phone_util_1.normalizePhoneId)(args.recipientPhone) ?? args.recipientPhone;
        const log = await this.prisma.clinicWaLog.create({
            data: {
                templateId: args.templateId,
                recipientType: args.recipientType,
                recipientPhone: normalizedPhone,
                body: args.body,
                bookingId: args.bookingId,
                metadata: args.metadata,
                status: 'queued',
            },
        });
        if (this.queueEnabled) {
            try {
                await this.waQueue.add(wa_queue_constants_1.WA_JOB_SEND, {
                    logId: log.id,
                    recipientPhone: normalizedPhone,
                    body: args.body,
                    metadata: args.metadata,
                }, { ...wa_queue_constants_1.WA_JOB_DEFAULTS, jobId: `wa-log-${log.id}` });
                return {
                    success: true,
                    data: { logId: log.id, status: 'queued' },
                    message: 'Enqueued for async send',
                };
            }
            catch (e) {
                this.logger.error(`Failed to enqueue WA job (logId=${log.id}): ${e.message}`);
                return { success: false, data: { logId: log.id, status: 'queued' }, message: 'Queue error — will retry via BullMQ' };
            }
        }
        const result = await this.wa.send({
            toPhone: normalizedPhone,
            body: args.body,
            callbackUrl: process.env.FONNTE_WEBHOOK_URL,
            metadata: { logId: log.id, ...args.metadata },
        });
        const status = result.status === 'sent' ? 'terkirim' : result.status === 'queued' ? 'queued' : 'gagal';
        await this.prisma.clinicWaLog.update({
            where: { id: log.id },
            data: {
                messageId: result.messageId,
                status,
                sentAt: result.status === 'sent' ? new Date() : null,
                failedAt: result.status === 'failed' ? new Date() : null,
                errorReason: result.errorReason ?? null,
            },
        });
        return {
            success: result.status !== 'failed',
            data: { logId: log.id, status, messageId: result.messageId },
            message: result.errorReason,
        };
    }
    async handleWebhook(dto) {
        if (!dto.id && !dto.sender) {
            this.logger.warn('Webhook tanpa id maupun sender — skip');
            return { success: false, error: 'missing_identifier' };
        }
        let log = dto.id
            ? await this.prisma.clinicWaLog.findFirst({
                where: { messageId: dto.id },
            })
            : null;
        if (!log && dto.sender) {
            const normalizedSender = (0, phone_util_1.normalizePhoneId)(dto.sender) ?? dto.sender;
            log = await this.prisma.clinicWaLog.findFirst({
                where: {
                    recipientPhone: normalizedSender,
                    status: { in: ['terkirim', 'queued'] },
                },
                orderBy: { id: 'desc' },
            });
        }
        if (!log) {
            this.logger.warn(`Webhook tidak match log — id=${dto.id} sender=${dto.sender} status=${dto.status}`);
            return { success: false, error: 'log_not_found' };
        }
        const statusMap = {
            sent: 'terkirim',
            delivered: 'sampai',
            read: 'dibaca',
            failed: 'gagal',
        };
        const FINAL_STATES = new Set(['delivered', 'read', 'failed']);
        const rawStatus = FINAL_STATES.has(dto.status ?? '') ? dto.status : (dto.state ?? dto.status);
        const newStatus = (rawStatus && statusMap[rawStatus]) || rawStatus || log.status;
        const data = { status: newStatus };
        if (newStatus === 'sampai')
            data.deliveredAt = new Date();
        if (newStatus === 'dibaca')
            data.readAt = new Date();
        if (newStatus === 'gagal') {
            data.failedAt = new Date();
            data.errorReason = dto.reason;
        }
        await this.prisma.clinicWaLog.update({ where: { id: log.id }, data });
        this.logger.log(`Webhook OK: logId=${log.id} ${log.status} → ${newStatus}`);
        return { success: true, data: { logId: log.id, status: newStatus } };
    }
};
exports.ClinicWaService = ClinicWaService;
exports.ClinicWaService = ClinicWaService = ClinicWaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(wa_tokens_1.WA_PROVIDER)),
    __param(3, (0, bullmq_1.InjectQueue)(wa_queue_constants_1.WA_QUEUE_NAME)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object, config_1.ConfigService,
        bullmq_2.Queue])
], ClinicWaService);
//# sourceMappingURL=clinic-wa.service.js.map