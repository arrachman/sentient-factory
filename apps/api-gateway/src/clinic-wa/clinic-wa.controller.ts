import {
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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthRequest } from '../auth/types/auth-request';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SkipAudit } from '../clinic-audit/decorators/skip-audit.decorator';
import { ClinicWaService } from './clinic-wa.service';
import {
  CreateTemplateDto,
  FonnteWebhookDto,
  QueryTemplateDto,
  QueryWaLogDto,
  SendTestDto,
  UpdateTemplateDto,
} from './dto/wa.dto';

@ApiTags('Clinic — WhatsApp')
@ApiBearerAuth()
@Controller('clinic/wa')
export class ClinicWaController {
  constructor(private readonly service: ClinicWaService) {}

  // ===== Templates =====

  @Post('template')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('clinic-admin')
  @ApiOperation({ summary: 'Create WA template' })
  createTemplate(@Body() dto: CreateTemplateDto, @Request() req: AuthRequest) {
    return this.service.createTemplate(dto, req.user?.sub ?? req.user?.id);
  }

  @Get('template')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('clinic-admin')
  findAllTemplates(@Query() query: QueryTemplateDto) {
    return this.service.findAllTemplates(query);
  }

  @Get('template/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('clinic-admin')
  findOneTemplate(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneTemplate(id);
  }

  @Patch('template/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('clinic-admin')
  updateTemplate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTemplateDto,
    @Request() req: AuthRequest,
  ) {
    return this.service.updateTemplate(id, dto, req.user?.sub ?? req.user?.id);
  }

  @Delete('template/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('clinic-admin')
  removeTemplate(@Param('id', ParseIntPipe) id: number, @Request() req: AuthRequest) {
    return this.service.removeTemplate(id, req.user?.sub ?? req.user?.id);
  }

  // ===== Logs =====

  @Get('log')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('clinic-admin')
  findAllLogs(@Query() query: QueryWaLogDto) {
    return this.service.findAllLogs(query);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('clinic-admin')
  @ApiOperation({ summary: 'WA daily stats (sentToday, readToday, failedToday, readRate)' })
  getStats(@Query('date') date?: string) {
    return this.service.getStats(date);
  }

  // ===== Send-test =====

  @Post('send-test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('clinic-admin')
  @ApiOperation({ summary: 'Test send WA via Fonnte (admin only, untuk debug)' })
  sendTest(@Body() dto: SendTestDto, @Request() req: AuthRequest) {
    return this.service.sendTest(dto, req.user?.sub ?? req.user?.id);
  }

  // ===== Webhook =====

  @Post('webhook')
  @SkipAudit()
  @ApiOperation({ summary: 'Fonnte webhook receiver — public endpoint, no JWT' })
  webhook(@Body() body: Record<string, unknown>) {
    // Fonnte sends extra fields (state, stateid, etc.) that vary by plan/version.
    // We extract only the fields we use to avoid global ValidationPipe forbidNonWhitelisted rejection.
    // Fonnte uses 'status' for delivery events but some webhook types use 'state' — pass both.
    const dto: FonnteWebhookDto = {
      id: body['id'] !== undefined && body['id'] !== null ? String(body['id']) : undefined,
      sender: typeof body['sender'] === 'string' ? body['sender'] : undefined,
      status: typeof body['status'] === 'string' ? body['status'] : undefined,
      state: typeof body['state'] === 'string' ? body['state'] : undefined,
      device: typeof body['device'] === 'string' ? body['device'] : undefined,
      reason: typeof body['reason'] === 'string' ? body['reason'] : undefined,
    };
    return this.service.handleWebhook(dto);
  }
}
