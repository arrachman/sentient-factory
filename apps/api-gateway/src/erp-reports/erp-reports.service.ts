import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateErpReportDto } from './dto/create-report.dto';
import { ExecuteSqlDto } from './dto/execute-sql.dto';
import { QueryErpReportDto } from './dto/query-report.dto';
import { UpdateErpReportDto } from './dto/update-report.dto';

const FORBIDDEN_KEYWORDS = /\b(insert|update|delete|drop|truncate|alter|create|grant|revoke|execute|exec|pg_read_file|pg_ls_dir|copy)\b/i;

@Injectable()
export class ErpReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryErpReportDto) {
    const { page = 1, limit = 20, search, module, isActive, sortBy = 'createdAt', sortDir = 'desc' } = query;
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };
    if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { code: { equals: search, mode: 'insensitive' } }];
    if (module) where.module = module;
    if (isActive !== undefined) where.isActive = isActive;

    const [rows, total] = await Promise.all([
      this.prisma.erpRptTemplate.findMany({ where, skip, take: limit, orderBy: { [sortBy]: sortDir } }),
      this.prisma.erpRptTemplate.count({ where }),
    ]);
    return { rows, meta: { total, page, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: bigint) {
    const rec = await this.prisma.erpRptTemplate.findFirst({ where: { id, deletedAt: null } });
    if (!rec) throw new NotFoundException(`Report template ${id} not found`);
    return rec;
  }

  async create(dto: CreateErpReportDto, userId?: bigint) {
    return this.prisma.erpRptTemplate.create({
      data: {
        code: dto.code,
        name: dto.name,
        module: dto.module,
        description: dto.description,
        templateJson: (dto.templateJson ?? {}) as Prisma.InputJsonValue,
        isActive: dto.isActive ?? true,
        createdById: userId,
        updatedById: userId,
      },
    });
  }

  async update(id: bigint, dto: UpdateErpReportDto, userId?: bigint) {
    await this.findOne(id);
    return this.prisma.erpRptTemplate.update({
      where: { id },
      data: {
        ...(dto.code !== undefined && { code: dto.code }),
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.module !== undefined && { module: dto.module }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.templateJson !== undefined && { templateJson: dto.templateJson as Prisma.InputJsonValue }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        updatedById: userId,
      },
    });
  }

  async remove(id: bigint, userId?: bigint) {
    await this.findOne(id);
    return this.prisma.erpRptTemplate.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: userId },
    });
  }

  async executeSql(dto: ExecuteSqlDto) {
    const { sql, params = {}, limit = 200 } = dto;
    const normalized = sql.trim().toLowerCase().replace(/\s+/g, ' ');

    if (!normalized.startsWith('select') && !normalized.startsWith('with')) {
      throw new BadRequestException('Only SELECT queries are allowed');
    }
    if (FORBIDDEN_KEYWORDS.test(sql)) {
      throw new BadRequestException('Query contains forbidden SQL keywords');
    }

    // Replace named params :name → positional $1, $2, ...
    const paramNames: string[] = [];
    const paramValues: unknown[] = [];
    const paramPattern = /:([a-zA-Z_][a-zA-Z0-9_]*)/g;
    let sqlWithPositional = sql.replace(paramPattern, (_match, name: string) => {
      if (!paramNames.includes(name)) {
        paramNames.push(name);
        paramValues.push(params[name] ?? null);
      }
      return `$${paramNames.indexOf(name) + 1}`;
    });

    // Add LIMIT guard so a heavy query can't DOS the server
    if (!/\blimit\b/i.test(sqlWithPositional)) {
      sqlWithPositional += ` LIMIT ${limit}`;
    }

    try {
      const rows = await this.prisma.$queryRawUnsafe(sqlWithPositional, ...paramValues);
      const data = rows as Record<string, unknown>[];
      // Convert bigint → string for JSON serialization
      const serialized = data.map(row =>
        Object.fromEntries(
          Object.entries(row).map(([k, v]) => [k, typeof v === 'bigint' ? v.toString() : v]),
        ),
      );
      return { rows: serialized, count: serialized.length, columns: serialized[0] ? Object.keys(serialized[0]) : [] };
    } catch (err: any) {
      throw new BadRequestException(`SQL error: ${err?.message ?? 'Unknown error'}`);
    }
  }
}
