import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { AUDIT_ACTION_KEY } from './decorators/audit-action.decorator';
import { AUDIT_RESOURCE_KEY } from './decorators/audit-resource.decorator';
import { SKIP_AUDIT_KEY } from './decorators/skip-audit.decorator';

/**
 * Auto-track mutating HTTP requests to clinic_* domain into existing AuditLog table.
 *
 * Behavior:
 * - Only audits requests with method POST/PUT/PATCH/DELETE
 * - Only audits routes whose path starts with /clinic/ (configurable below)
 * - Skips routes/controllers marked with @SkipAudit()
 * - Resolves entityType from @AuditResource(...) metadata, else derives from path segment
 * - Resolves action from @AuditAction(...) metadata, else uses HTTP method
 * - Fire-and-forget DB write (does not block response)
 *
 * Reads user from req.user (populated by JwtAuthGuard).
 *
 * See ADR 005 (audit interceptor) and ADR 003 (RBAC strategy).
 */
@Injectable()
export class ClinicAuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ClinicAuditInterceptor.name);
  private readonly mutatingMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
  // Match both `/clinic/*` and `/api/clinic/*` (with NestJS global prefix)
  private readonly clinicPathRegex = /\/clinic\//;

  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_AUDIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skip) {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest();
    const method = String(req?.method || '').toUpperCase();
    const path: string = req?.path || req?.url || '';

    // Only audit clinic_* mutations (handle global prefix /api)
    if (!this.mutatingMethods.has(method) || !this.clinicPathRegex.test(path)) {
      return next.handle();
    }

    const explicitAction = this.reflector.getAllAndOverride<string>(AUDIT_ACTION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const explicitResource = this.reflector.getAllAndOverride<string>(AUDIT_RESOURCE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const action = explicitAction || method.toLowerCase();
    const entityType = explicitResource || this.deriveResourceFromPath(path);
    const userId: number | undefined = req?.user?.sub || req?.user?.id;
    const ipAddress = this.extractIp(req);
    const userAgent = req?.headers?.['user-agent'] || null;

    return next.handle().pipe(
      tap({
        next: (response) => {
          // Fire-and-forget; do not block the response
          this.writeAuditLog({
            userId,
            action,
            entityType,
            entityId: this.extractEntityId(req, response),
            newData: this.sanitizeBody(req?.body),
            ipAddress,
            userAgent,
          }).catch((error) =>
            this.logger.warn(
              `Audit write failed: ${error instanceof Error ? error.message : String(error)}`,
            ),
          );
        },
      }),
    );
  }

  private async writeAuditLog(args: {
    userId?: number;
    action: string;
    entityType: string;
    entityId?: string;
    newData?: unknown;
    ipAddress?: string | null;
    userAgent?: string | null;
  }) {
    await this.prisma.auditLog.create({
      data: {
        userId: args.userId ?? null,
        action: args.action,
        entityType: args.entityType,
        entityId: args.entityId ?? null,
        newData: args.newData ? (args.newData as object) : undefined,
        ipAddress: args.ipAddress ?? null,
        userAgent: args.userAgent ?? null,
        createdBy: args.userId ?? null,
        updatedBy: args.userId ?? null,
      },
    });
  }

  /**
   * Derive entity type from URL path. Examples:
   *   /clinic/psikolog        → clinic.psikolog
   *   /clinic/psikolog/12     → clinic.psikolog
   *   /clinic/booking/3/cancel → clinic.booking
   */
  private deriveResourceFromPath(path: string): string {
    const segments = path.replace(/^\/+|\/+$/g, '').split('/');
    // Find 'clinic' segment (could be at index 0 or 1 with /api/clinic/...)
    const idx = segments.indexOf('clinic');
    if (idx >= 0 && segments.length > idx + 1) {
      return `clinic.${segments[idx + 1]}`;
    }
    return 'clinic.unknown';
  }

  /**
   * Try to extract entity id from URL params or response body.
   */
  private extractEntityId(req: any, response: any): string | undefined {
    if (req?.params?.id) {
      return String(req.params.id);
    }
    if (response && typeof response === 'object') {
      const body = (response as { data?: unknown }).data ?? response;
      if (body && typeof body === 'object' && 'id' in (body as object)) {
        return String((body as { id: unknown }).id);
      }
    }
    return undefined;
  }

  private extractIp(req: any): string | null {
    const forwarded = req?.headers?.['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return req?.ip || null;
  }

  /**
   * Strip secrets from logged body (password, token, etc.).
   */
  private sanitizeBody(body: unknown): unknown {
    if (!body || typeof body !== 'object') {
      return body;
    }
    const SECRETS = ['password', 'passwordHash', 'token', 'refreshToken', 'secret'];
    return Object.fromEntries(
      Object.entries(body as Record<string, unknown>).map(([k, v]) =>
        SECRETS.includes(k) ? [k, '[redacted]'] : [k, v],
      ),
    );
  }
}
