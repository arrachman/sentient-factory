import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { getAdapter, listEntities } from './erp-import.adapters';
import { buildTemplate, parseFile } from './erp-import.parse';

export interface UploadedFileLike {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

interface RowError {
  row: number;
  message: string;
}

export interface ImportSummary {
  jobId: string;
  total: number;
  ok: number;
  failed: number;
  errors: RowError[];
}

const MAX_REPORTED_ERRORS = 200;

@Injectable()
export class ErpImportService {
  constructor(private prisma: PrismaService) {}

  getEntities() {
    return { success: true, data: listEntities() };
  }

  async buildTemplate(entity: string): Promise<{ buffer: Buffer; fileName: string }> {
    const adapter = getAdapter(entity);
    if (!adapter) throw new NotFoundException(`Entitas "${entity}" tidak didukung`);
    const buffer = await buildTemplate(
      adapter.label,
      adapter.requiredHeaders,
      adapter.optionalHeaders,
    );
    return { buffer, fileName: `template-${entity}.xlsx` };
  }

  async listJobs() {
    const jobs = await this.prisma.erpImportJob.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return {
      success: true,
      data: jobs.map((j) => ({
        id: j.id.toString(),
        entity: j.entity,
        fileName: j.fileName,
        status: j.status,
        rowsTotal: j.rowsTotal,
        rowsOk: j.rowsOk,
        rowsFailed: j.rowsFailed,
        createdAt: j.createdAt,
      })),
    };
  }

  async import(
    entity: string,
    file: UploadedFileLike | undefined,
    actorId?: string,
  ): Promise<{ success: true; data: ImportSummary }> {
    const adapter = getAdapter(entity);
    if (!adapter) throw new NotFoundException(`Entitas "${entity}" tidak didukung`);
    if (!file || !file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('File tidak ditemukan atau kosong');
    }

    const { headers, rows } = await parseFile(file.buffer, file.originalname);

    const missing = adapter.requiredHeaders.filter((h) => !headers.includes(h));
    if (missing.length > 0) {
      throw new BadRequestException(
        `Kolom wajib hilang: ${missing.join(', ')}. Unduh template untuk format yang benar.`,
      );
    }

    const errors: RowError[] = [];
    let ok = 0;

    for (let i = 0; i < rows.length; i += 1) {
      const rowNumber = i + 2; // 1-based + header row
      const row = rows[i];
      try {
        // required-cell validation
        const emptyRequired = adapter.requiredHeaders.filter(
          (h) => (row[h] ?? '').trim() === '',
        );
        if (emptyRequired.length > 0) {
          throw new Error(`Kolom wajib kosong: ${emptyRequired.join(', ')}`);
        }
        const data = adapter.rowToData(row);
        await adapter.insert(this.prisma, data, actorId);
        ok += 1;
      } catch (err) {
        errors.push({ row: rowNumber, message: this.toRowMessage(err) });
      }
    }

    const failed = errors.length;
    const total = rows.length;
    const status = failed === 0 ? 'COMPLETED' : ok === 0 ? 'FAILED' : 'PARTIAL';

    const job = await this.prisma.erpImportJob.create({
      data: {
        entity,
        fileName: file.originalname,
        status,
        rowsTotal: total,
        rowsOk: ok,
        rowsFailed: failed,
        errors: errors.slice(0, MAX_REPORTED_ERRORS) as unknown as Prisma.InputJsonValue,
        createdById: toAuditUserId(actorId),
        updatedById: toAuditUserId(actorId),
      },
    });

    return {
      success: true,
      data: {
        jobId: job.id.toString(),
        total,
        ok,
        failed,
        errors: errors.slice(0, MAX_REPORTED_ERRORS),
      },
    };
  }

  private toRowMessage(err: unknown): string {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        const target = (err.meta?.target as string[] | undefined)?.join(', ') ?? 'kode';
        return `Duplikat: ${target} sudah ada`;
      }
      if (err.code === 'P2003') return 'Referensi (foreign key) tidak valid';
      return `Galat database (${err.code})`;
    }
    if (err instanceof Error) return err.message;
    return 'Galat tidak diketahui';
  }
}
