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
var WaQueueProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaQueueProcessor = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const prisma_service_1 = require("../../prisma/prisma.service");
const wa_tokens_1 = require("../wa.tokens");
const wa_queue_constants_1 = require("./wa-queue.constants");
let WaQueueProcessor = WaQueueProcessor_1 = class WaQueueProcessor extends bullmq_1.WorkerHost {
    prisma;
    wa;
    logger = new common_1.Logger(WaQueueProcessor_1.name);
    constructor(prisma, wa) {
        super();
        this.prisma = prisma;
        this.wa = wa;
    }
    async process(job) {
        if (job.name !== wa_queue_constants_1.WA_JOB_SEND) {
            throw new Error(`Unknown job name: ${job.name}`);
        }
        const { logId, recipientPhone, body, metadata } = job.data;
        const attempt = job.attemptsMade + 1;
        this.logger.log(`Processing WA job ${job.id} (logId=${logId}) attempt ${attempt}/${job.opts.attempts ?? 1}`);
        const result = await this.wa.send({
            toPhone: recipientPhone,
            body,
            callbackUrl: process.env.FONNTE_WEBHOOK_URL,
            metadata: { logId, attempt, ...metadata },
        });
        if (result.status === 'failed') {
            await this.prisma.clinicWaLog.update({
                where: { id: logId },
                data: {
                    retryCount: attempt,
                    status: attempt >= (job.opts.attempts ?? 1) ? 'gagal' : 'queued',
                    errorReason: result.errorReason ?? null,
                    failedAt: attempt >= (job.opts.attempts ?? 1) ? new Date() : null,
                },
            });
            throw new Error(result.errorReason ?? 'WA provider failed');
        }
        const status = result.status === 'sent' ? 'terkirim' : 'queued';
        await this.prisma.clinicWaLog.update({
            where: { id: logId },
            data: {
                messageId: result.messageId,
                status,
                retryCount: attempt,
                sentAt: result.status === 'sent' ? new Date() : null,
                errorReason: null,
            },
        });
        return { messageId: result.messageId, status };
    }
};
exports.WaQueueProcessor = WaQueueProcessor;
exports.WaQueueProcessor = WaQueueProcessor = WaQueueProcessor_1 = __decorate([
    (0, bullmq_1.Processor)(wa_queue_constants_1.WA_QUEUE_NAME),
    __param(1, (0, common_1.Inject)(wa_tokens_1.WA_PROVIDER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], WaQueueProcessor);
//# sourceMappingURL=wa-queue.processor.js.map