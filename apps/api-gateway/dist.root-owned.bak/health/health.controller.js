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
exports.HealthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("../prisma/prisma.service");
const skip_audit_decorator_1 = require("../clinic-audit/decorators/skip-audit.decorator");
let HealthController = class HealthController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    liveness() {
        return {
            status: 'ok',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
        };
    }
    async readiness() {
        let dbStatus = 'ok';
        let dbError = null;
        try {
            await this.prisma.$queryRaw `SELECT 1`;
        }
        catch (err) {
            dbStatus = 'fail';
            dbError = err instanceof Error ? err.message : String(err);
        }
        const ready = dbStatus === 'ok';
        return {
            status: ready ? 'ready' : 'not_ready',
            checks: { database: { status: dbStatus, error: dbError } },
            timestamp: new Date().toISOString(),
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, skip_audit_decorator_1.SkipAudit)(),
    (0, swagger_1.ApiOperation)({ summary: 'Service liveness check' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "liveness", null);
__decorate([
    (0, common_1.Get)('readiness'),
    (0, skip_audit_decorator_1.SkipAudit)(),
    (0, swagger_1.ApiOperation)({ summary: 'Service readiness check (verify DB)' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "readiness", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Health'),
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HealthController);
//# sourceMappingURL=health.controller.js.map