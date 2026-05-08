import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { Observable, from, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

const TTL_MS = 24 * 60 * 60 * 1000; // 24 jam
const HEADER = 'idempotency-key';
const KEY_REGEX = /^[a-zA-Z0-9_-]{8,128}$/;

/**
 * Idempotency interceptor — dedup POST/PUT mutations dengan cached response.
 *
 * Client kirim `Idempotency-Key: <uuid-or-token>` header. Kalau key + scope
 * (METHOD:path) udah pernah masuk, langsung return cached response (status sama).
 *
 * Scope: per (method + route path + actor) supaya beda user / beda endpoint
 * tidak collide. TTL 24 jam (cleanup via cron / query).
 *
 * Gunakan via `@UseInterceptors(IdempotencyInterceptor)` di endpoint mutation
 * critical (booking create, package, payment, refund).
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  private readonly logger = new Logger(IdempotencyInterceptor.name);

  constructor(private readonly prisma: PrismaService) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = ctx.switchToHttp().getRequest<Request & { user?: { sub?: number } }>();
    const res = ctx.switchToHttp().getResponse<Response>();

    const headerVal = req.headers[HEADER];
    const key = Array.isArray(headerVal) ? headerVal[0] : headerVal;
    if (!key) return next.handle();
    if (!KEY_REGEX.test(key)) {
      throw new ConflictException(`Invalid Idempotency-Key format (expected ${KEY_REGEX})`);
    }

    const actorId = req.user?.sub ?? 0;
    const route = (req as unknown as { route?: { path?: string } }).route?.path ?? req.path;
    const composite = `${req.method}:${route}|${actorId}|${key}`;

    return from(
      this.prisma.clinicIdempotencyKey.findUnique({ where: { key: composite } }),
    ).pipe(
      switchMap((cached) => {
        if (cached) {
          const age = Date.now() - cached.createdAt.getTime();
          if (age < TTL_MS) {
            this.logger.log(`Idempotency hit for ${composite} (age ${Math.round(age / 1000)}s)`);
            res.status(cached.statusCode);
            res.setHeader('X-Idempotent-Replay', 'true');
            return of(cached.response);
          }
          // expired — silently overwrite below via upsert
        }
        return next.handle().pipe(
          tap((response) => {
            const status = res.statusCode || 200;
            if (status >= 200 && status < 300) {
              this.prisma.clinicIdempotencyKey
                .upsert({
                  where: { key: composite },
                  create: {
                    key: composite,
                    response: (response ?? null) as Prisma.InputJsonValue,
                    statusCode: status,
                    actorId: actorId || null,
                  },
                  update: {
                    response: (response ?? null) as Prisma.InputJsonValue,
                    statusCode: status,
                    createdAt: new Date(),
                  },
                })
                .catch((e: Error) =>
                  this.logger.warn(`Failed to cache idempotency key ${composite}: ${e.message}`),
                );
            }
          }),
        );
      }),
    );
  }
}
