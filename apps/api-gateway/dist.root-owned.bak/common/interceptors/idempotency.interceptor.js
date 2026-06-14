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
var IdempotencyInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdempotencyInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const prisma_service_1 = require("../../prisma/prisma.service");
const TTL_MS = 24 * 60 * 60 * 1000;
const HEADER = 'idempotency-key';
const KEY_REGEX = /^[a-zA-Z0-9_-]{8,128}$/;
let IdempotencyInterceptor = IdempotencyInterceptor_1 = class IdempotencyInterceptor {
    prisma;
    logger = new common_1.Logger(IdempotencyInterceptor_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    intercept(ctx, next) {
        const req = ctx.switchToHttp().getRequest();
        const res = ctx.switchToHttp().getResponse();
        const headerVal = req.headers[HEADER];
        const key = Array.isArray(headerVal) ? headerVal[0] : headerVal;
        if (!key)
            return next.handle();
        if (!KEY_REGEX.test(key)) {
            throw new common_1.ConflictException(`Invalid Idempotency-Key format (expected ${KEY_REGEX})`);
        }
        const actorId = req.user?.sub ?? 0;
        const route = req.route?.path ?? req.path;
        const composite = `${req.method}:${route}|${actorId}|${key}`;
        return (0, rxjs_1.from)(this.prisma.clinicIdempotencyKey.findUnique({ where: { key: composite } })).pipe((0, operators_1.switchMap)((cached) => {
            if (cached) {
                const age = Date.now() - cached.createdAt.getTime();
                if (age < TTL_MS) {
                    this.logger.log(`Idempotency hit for ${composite} (age ${Math.round(age / 1000)}s)`);
                    res.status(cached.statusCode);
                    res.setHeader('X-Idempotent-Replay', 'true');
                    return (0, rxjs_1.of)(cached.response);
                }
            }
            return next.handle().pipe((0, operators_1.tap)((response) => {
                const status = res.statusCode || 200;
                if (status >= 200 && status < 300) {
                    this.prisma.clinicIdempotencyKey
                        .upsert({
                        where: { key: composite },
                        create: {
                            key: composite,
                            response: (response ?? null),
                            statusCode: status,
                            actorId: actorId || null,
                        },
                        update: {
                            response: (response ?? null),
                            statusCode: status,
                            createdAt: new Date(),
                        },
                    })
                        .catch((e) => this.logger.warn(`Failed to cache idempotency key ${composite}: ${e.message}`));
                }
            }));
        }));
    }
};
exports.IdempotencyInterceptor = IdempotencyInterceptor;
exports.IdempotencyInterceptor = IdempotencyInterceptor = IdempotencyInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IdempotencyInterceptor);
//# sourceMappingURL=idempotency.interceptor.js.map