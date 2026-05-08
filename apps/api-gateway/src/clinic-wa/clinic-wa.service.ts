import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { renderTemplate } from './template-renderer';
import {
  CreateTemplateDto,
  FonnteWebhookDto,
  QueryTemplateDto,
  QueryWaLogDto,
  SendTestDto,
  UpdateTemplateDto,
} from './dto/wa.dto';
import type { WAProvider } from './wa.interface';
import { WA_PROVIDER } from './wa.tokens';

/**
 * Service yang handle:
 * - Template CRUD (admin manage 18 templates)
 * - WA log read (admin lihat history pengiriman)
 * - Send-test endpoint (admin debug)
 * - Webhook receiver (update delivery status dari Fonnte)
 * - Internal: dispatch(templateName, recipientPhone, variables) — dipakai Slice 9
 *
 * NOTE: belum pakai Bull queue. Send langsung sync ke Fonnte. Untuk volume kecil OK.
 * Future: pindah ke Bull queue async dengan retry.
 */
@Injectable()
export class ClinicWaService {
  private readonly logger = new Logger(ClinicWaService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(WA_PROVIDER) private readonly wa: WAProvider,
  ) {}

  // ----- Template CRUD -----

  async createTemplate(dto: CreateTemplateDto, actorId?: number) {
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

  async findAllTemplates(query: QueryTemplateDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;
    const where: Prisma.ClinicWaTemplateWhereInput = { deletedAt: null };
    if (query.category) where.category = query.category;
    if (typeof query.isActive === 'boolean') where.isActive = query.isActive;
    if (query.search?.trim()) {
      where.OR = [
        { name: { contains: query.search.trim(), mode: 'insensitive' } },
        { triggerEvent: { contains: query.search.trim(), mode: 'insensitive' } },
        { body: { contains: query.search.trim(), mode: 'insensitive' } },
      ];
    }
    const [items, total] = await this.prisma.$transaction([
      this.prisma.clinicWaTemplate.findMany({ where, orderBy: [{ category: 'asc' }, { name: 'asc' }], skip, take: limit }),
      this.prisma.clinicWaTemplate.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOneTemplate(id: number) {
    const template = await this.prisma.clinicWaTemplate.findFirst({ where: { id, deletedAt: null } });
    if (!template) throw new NotFoundException(`Template ${id} not found`);
    return { success: true, data: template };
  }

  async updateTemplate(id: number, dto: UpdateTemplateDto, actorId?: number) {
    await this.findOneTemplate(id);
    const updated = await this.prisma.clinicWaTemplate.update({
      where: { id },
      data: { ...dto, updatedBy: actorId },
    });
    return { success: true, data: updated, message: 'Template updated' };
  }

  async removeTemplate(id: number, actorId?: number) {
    await this.findOneTemplate(id);
    await this.prisma.clinicWaTemplate.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: actorId, isActive: false, updatedBy: actorId },
    });
    return { success: true, message: 'Template deleted' };
  }

  // ----- Logs -----

  async findAllLogs(query: QueryWaLogDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;
    const where: Prisma.ClinicWaLogWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.recipientPhone) where.recipientPhone = { contains: query.recipientPhone };
    if (query.templateId) where.templateId = query.templateId;
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

  // ----- Send -----

  async sendTest(dto: SendTestDto, actorId?: number) {
    let body = dto.body || '';
    let templateId: number | null = null;
    if (dto.templateId) {
      const tpl = await this.findOneTemplate(dto.templateId);
      body = renderTemplate(tpl.data.body, dto.variables ?? {});
      templateId = tpl.data.id;
    } else if (dto.body && dto.variables) {
      body = renderTemplate(dto.body, dto.variables);
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

  /**
   * Internal dispatch: kirim WA ke recipient + log ke clinic_wa_log.
   * Dipakai Slice 9 (event triggers).
   */
  async dispatch(params: {
    templateName: string;
    recipientType: 'klien' | 'psikolog';
    recipientPhone: string;
    variables: Record<string, string | number>;
    bookingId?: number;
  }) {
    const tpl = await this.prisma.clinicWaTemplate.findFirst({
      where: { name: params.templateName, isActive: true, deletedAt: null },
    });
    if (!tpl) {
      this.logger.warn(`Template '${params.templateName}' not found / inactive — skip dispatch`);
      return { success: false, error: 'template_not_found' };
    }
    const body = renderTemplate(tpl.body, params.variables);
    return this.dispatchRaw({
      templateId: tpl.id,
      recipientType: params.recipientType,
      recipientPhone: params.recipientPhone,
      body,
      bookingId: params.bookingId ?? null,
      metadata: { event: tpl.triggerEvent, variables: params.variables },
    });
  }

  private async dispatchRaw(args: {
    templateId: number | null;
    recipientType: string;
    recipientPhone: string;
    body: string;
    bookingId: number | null;
    metadata: Record<string, unknown>;
  }) {
    // Create log first dengan status 'queued'
    const log = await this.prisma.clinicWaLog.create({
      data: {
        templateId: args.templateId,
        recipientType: args.recipientType,
        recipientPhone: args.recipientPhone,
        body: args.body,
        bookingId: args.bookingId,
        metadata: args.metadata as Prisma.InputJsonValue,
        status: 'queued',
      },
    });

    // Kirim via provider (sync)
    const result = await this.wa.send({
      toPhone: args.recipientPhone,
      body: args.body,
      callbackUrl: process.env.FONNTE_WEBHOOK_URL,
      metadata: { logId: log.id, ...args.metadata },
    });

    // Update log dengan hasil
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

  // ----- Webhook -----

  async handleWebhook(dto: FonnteWebhookDto) {
    if (!dto.id) {
      this.logger.warn('Webhook tanpa message id — skip');
      return { success: false, error: 'missing_message_id' };
    }
    const log = await this.prisma.clinicWaLog.findFirst({
      where: { messageId: dto.id },
    });
    if (!log) {
      this.logger.warn(`Webhook untuk message_id ${dto.id} tidak match log — ignore`);
      return { success: false, error: 'log_not_found' };
    }
    const statusMap: Record<string, string> = {
      sent: 'terkirim',
      delivered: 'sampai',
      read: 'dibaca',
      failed: 'gagal',
    };
    const newStatus = (dto.status && statusMap[dto.status]) || dto.status || log.status;
    const data: Prisma.ClinicWaLogUpdateInput = { status: newStatus };
    if (newStatus === 'sampai') data.deliveredAt = new Date();
    if (newStatus === 'dibaca') data.readAt = new Date();
    if (newStatus === 'gagal') {
      data.failedAt = new Date();
      data.errorReason = dto.reason;
    }
    await this.prisma.clinicWaLog.update({ where: { id: log.id }, data });
    return { success: true, data: { logId: log.id, status: newStatus } };
  }
}
