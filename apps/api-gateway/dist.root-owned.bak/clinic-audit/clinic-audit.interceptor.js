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
var ClinicAuditInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicAuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rxjs_1 = require("rxjs");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_action_decorator_1 = require("./decorators/audit-action.decorator");
const audit_resource_decorator_1 = require("./decorators/audit-resource.decorator");
const skip_audit_decorator_1 = require("./decorators/skip-audit.decorator");
let ClinicAuditInterceptor = ClinicAuditInterceptor_1 = class ClinicAuditInterceptor {
    reflector;
    prisma;
    logger = new common_1.Logger(ClinicAuditInterceptor_1.name);
    mutatingMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
    clinicPathRegex = /\/clinic\//;
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    intercept(context, next) {
        const skip = this.reflector.getAllAndOverride(skip_audit_decorator_1.SKIP_AUDIT_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (skip) {
            return next.handle();
        }
        const req = context.switchToHttp().getRequest();
        const method = String(req?.method || '').toUpperCase();
        const path = req?.path || req?.url || '';
        if (!this.mutatingMethods.has(method) || !this.clinicPathRegex.test(path)) {
            return next.handle();
        }
        const explicitAction = this.reflector.getAllAndOverride(audit_action_decorator_1.AUDIT_ACTION_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const explicitResource = this.reflector.getAllAndOverride(audit_resource_decorator_1.AUDIT_RESOURCE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const action = explicitAction || method.toLowerCase();
        const entityType = explicitResource || this.deriveResourceFromPath(path);
        const userId = req?.user?.sub || req?.user?.id;
        const ipAddress = this.extractIp(req);
        const userAgent = req?.headers?.['user-agent'] || null;
        return next.handle().pipe((0, rxjs_1.tap)({
            next: (response) => {
                this.writeAuditLog({
                    userId,
                    action,
                    entityType,
                    entityId: this.extractEntityId(req, response),
                    newData: this.sanitizeBody(req?.body),
                    ipAddress,
                    userAgent,
                }).catch((error) => this.logger.warn(`Audit write failed: ${error instanceof Error ? error.message : String(error)}`));
            },
        }));
    }
    async writeAuditLog(args) {
        await this.prisma.auditLog.create({
            data: {
                userId: args.userId ?? null,
                action: args.action,
                entityType: args.entityType,
                entityId: args.entityId ?? null,
                newData: args.newData ? args.newData : undefined,
                ipAddress: args.ipAddress ?? null,
                userAgent: args.userAgent ?? null,
                createdBy: args.userId ?? null,
                updatedBy: args.userId ?? null,
            },
        });
    }
    deriveResourceFromPath(path) {
        const segments = path.replace(/^\/+|\/+$/g, '').split('/');
        const idx = segments.indexOf('clinic');
        if (idx >= 0 && segments.length > idx + 1) {
            return `clinic.${segments[idx + 1]}`;
        }
        return 'clinic.unknown';
    }
    extractEntityId(req, response) {
        if (req?.params?.id) {
            return String(req.params.id);
        }
        if (response && typeof response === 'object') {
            const body = response.data ?? response;
            if (body && typeof body === 'object' && 'id' in body) {
                return String(body.id);
            }
        }
        return undefined;
    }
    extractIp(req) {
        const forwarded = req?.headers?.['x-forwarded-for'];
        if (typeof forwarded === 'string') {
            return forwarded.split(',')[0].trim();
        }
        return req?.ip || null;
    }
    sanitizeBody(body) {
        if (!body || typeof body !== 'object') {
            return body;
        }
        const SECRETS = ['password', 'passwordHash', 'token', 'refreshToken', 'secret'];
        return Object.fromEntries(Object.entries(body).map(([k, v]) => SECRETS.includes(k) ? [k, '[redacted]'] : [k, v]));
    }
};
exports.ClinicAuditInterceptor = ClinicAuditInterceptor;
exports.ClinicAuditInterceptor = ClinicAuditInterceptor = ClinicAuditInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService])
], ClinicAuditInterceptor);
//# sourceMappingURL=clinic-audit.interceptor.js.map