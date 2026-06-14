import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
export declare class ClinicAuditInterceptor implements NestInterceptor {
    private readonly reflector;
    private readonly prisma;
    private readonly logger;
    private readonly mutatingMethods;
    private readonly clinicPathRegex;
    constructor(reflector: Reflector, prisma: PrismaService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;
    private writeAuditLog;
    private deriveResourceFromPath;
    private extractEntityId;
    private extractIp;
    private sanitizeBody;
}
