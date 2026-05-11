import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthRequest } from '../auth/types/auth-request';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ClinicPsikologService } from './clinic-psikolog.service';
import { CreatePsikologDto } from './dto/create-psikolog.dto';
import { QueryPsikologDto } from './dto/query-psikolog.dto';
import { UpdatePsikologDto } from './dto/update-psikolog.dto';

@ApiTags('Clinic — Psikolog')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clinic/psikolog')
export class ClinicPsikologController {
  constructor(private readonly service: ClinicPsikologService) {}

  @Post()
  @Roles('clinic-admin')
  @ApiOperation({ summary: 'Create psikolog (User + ClinicPsikologProfile)' })
  @ApiResponse({ status: 201, description: 'Psikolog created' })
  create(@Body() dto: CreatePsikologDto, @Request() req: AuthRequest) {
    return this.service.create(dto, req.user?.sub ?? req.user?.id);
  }

  @Get()
  @Roles(
    'clinic-admin',
    'clinic-psikolog',
    'clinic-owner',
    'clinic-resepsionis',
    'clinic-marketing',
  )
  @ApiOperation({ summary: 'List psikolog (paginated)' })
  @ApiResponse({ status: 200, description: 'List of psikolog' })
  findAll(@Query() query: QueryPsikologDto) {
    return this.service.findAll(query);
  }

  @Get('me')
  @Roles('clinic-psikolog')
  @ApiOperation({
    summary: 'Get own psikolog profile (lookup by JWT userId)',
    description:
      'Dipakai oleh /psikolog/profile page supaya psikolog tidak perlu tahu psikolog.id sendiri.',
  })
  findMe(@Request() req: AuthRequest) {
    const userId = req.user?.sub ?? req.user?.id;
    if (!userId) {
      throw new BadRequestException('Unauthorized — userId tidak ada di JWT');
    }
    return this.service.findByUserId(userId);
  }

  @Get('me/stats')
  @Roles('clinic-psikolog')
  @ApiOperation({
    summary: 'Statistik 30 hari terakhir untuk psikolog yang login',
    description:
      'Return { sesi30Hari, klienAktif, kehadiran, ratingKlien? }. Source: clinic_booking aggregations.',
  })
  myStats(@Request() req: AuthRequest) {
    const userId = req.user?.sub ?? req.user?.id;
    if (!userId) {
      throw new BadRequestException('Unauthorized — userId tidak ada di JWT');
    }
    return this.service.getMyStats(userId);
  }

  @Patch('me')
  @Roles('clinic-psikolog')
  @ApiOperation({
    summary: 'Edit own profile (subset: fullName, title, bio, color)',
    description:
      'Psikolog hanya boleh edit field non-sensitive sendiri. Email/license/' +
      'defaultSlots/specialty/isActive admin-only (via PATCH /:id).',
  })
  updateMe(
    @Body() body: { fullName?: string; title?: string; bio?: string; color?: string },
    @Request() req: AuthRequest,
  ) {
    const userId = req.user?.sub ?? req.user?.id;
    if (!userId) {
      throw new BadRequestException('Unauthorized — userId tidak ada di JWT');
    }
    return this.service.updateMe(userId, body);
  }

  @Get(':id')
  @Roles(
    'clinic-admin',
    'clinic-psikolog',
    'clinic-owner',
    'clinic-resepsionis',
    'clinic-marketing',
  )
  @ApiOperation({ summary: 'Get one psikolog detail' })
  @ApiResponse({ status: 200, description: 'Psikolog detail' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch('me/availability')
  @Roles('clinic-psikolog')
  @ApiOperation({
    summary: 'Psikolog set jadwal availability sendiri (self-service)',
    description: 'Body: { weeklyAvailability: { monday: { isOpen, slotIndices? }, ... } }',
  })
  updateMyAvailability(
    @Body()
    body: { weeklyAvailability: Record<string, { isOpen: boolean; slotIndices?: number[] }> },
    @Request() req: AuthRequest,
  ) {
    const userId = req.user?.sub ?? req.user?.id;
    if (!userId) {
      throw new BadRequestException('Unauthorized — userId tidak ada di JWT');
    }
    return this.service.updateOwnAvailability(userId, body.weeklyAvailability ?? {});
  }

  @Get('me/date-overrides')
  @Roles('clinic-psikolog')
  @ApiOperation({
    summary: 'List override per-tanggal psikolog (self-service)',
    description:
      'Query: ?from=YYYY-MM-DD&to=YYYY-MM-DD untuk batasi range. Kalau kosong, return semua.',
  })
  listMyDateOverrides(
    @Query('from') from: string | undefined,
    @Query('to') to: string | undefined,
    @Request() req: AuthRequest,
  ) {
    const userId = req.user?.sub ?? req.user?.id;
    if (!userId) throw new BadRequestException('Unauthorized');
    return this.service.listOwnDateOverrides(userId, from, to);
  }

  @Post('me/date-overrides')
  @Roles('clinic-psikolog')
  @ApiOperation({
    summary: 'Upsert override per-tanggal (psikolog set cuti / makeup / jadwal khusus)',
    description:
      'Body: { date: "YYYY-MM-DD", isOpen: bool, slotIndices?: number[]|null, reason?: string }',
  })
  upsertMyDateOverride(
    @Body()
    body: {
      date: string;
      isOpen: boolean;
      slotIndices?: number[] | null;
      reason?: string | null;
    },
    @Request() req: AuthRequest,
  ) {
    const userId = req.user?.sub ?? req.user?.id;
    if (!userId) throw new BadRequestException('Unauthorized');
    if (!body?.date) throw new BadRequestException('Field "date" wajib (format YYYY-MM-DD)');
    return this.service.upsertOwnDateOverride(userId, body);
  }

  @Delete('me/date-overrides/:date')
  @Roles('clinic-psikolog')
  @ApiOperation({
    summary: 'Hapus override per-tanggal (revert ke weeklyAvailability)',
  })
  deleteMyDateOverride(@Param('date') date: string, @Request() req: AuthRequest) {
    const userId = req.user?.sub ?? req.user?.id;
    if (!userId) throw new BadRequestException('Unauthorized');
    return this.service.deleteOwnDateOverride(userId, date);
  }

  @Get('by-user/:userId/availability-for-date')
  @Roles('clinic-admin', 'clinic-resepsionis', 'clinic-psikolog', 'clinic-owner')
  @ApiOperation({
    summary: 'Resolve effective availability untuk psikolog di tanggal tertentu',
    description:
      'Merge date override (priority) + weeklyAvailability (fallback). Dipakai booking wizard untuk preview slot mana yang available. Query: ?date=YYYY-MM-DD',
  })
  getAvailabilityForDate(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('date') date: string,
  ) {
    if (!date) throw new BadRequestException('Query param "date" wajib (format YYYY-MM-DD)');
    return this.service.resolveAvailabilityForDate(userId, date);
  }

  @Patch(':id')
  @Roles('clinic-admin')
  @ApiOperation({ summary: 'Update psikolog' })
  @ApiResponse({ status: 200, description: 'Psikolog updated' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePsikologDto,
    @Request() req: AuthRequest,
  ) {
    return this.service.update(id, dto, req.user?.sub ?? req.user?.id);
  }

  @Delete(':id')
  @Roles('clinic-admin')
  @ApiOperation({ summary: 'Soft delete psikolog' })
  @ApiResponse({ status: 200, description: 'Psikolog deleted' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: AuthRequest) {
    return this.service.remove(id, req.user?.sub ?? req.user?.id);
  }
}
