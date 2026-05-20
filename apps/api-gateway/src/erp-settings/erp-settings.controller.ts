import { Body, Controller, Get, Param, Patch, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErpJwtAuthGuard } from '../erp-auth/guards/erp-jwt-auth.guard';
import { QueryErpSettingDto } from './dto/query-erp-setting.dto';
import { UpdateErpSettingDto } from './dto/update-erp-setting.dto';
import { ErpSettingsService } from './erp-settings.service';

@ApiTags('ERP Settings')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('erp/settings')
export class ErpSettingsController {
  constructor(private readonly service: ErpSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'List all ERP settings' })
  @ApiResponse({ status: 200, description: 'List of ERP settings' })
  findAll(@Query() query: QueryErpSettingDto) {
    return this.service.findAll(query);
  }

  @Get(':key')
  @ApiOperation({ summary: 'Get ERP setting by key' })
  @ApiResponse({ status: 200, description: 'ERP setting detail' })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  findOne(@Param('key') key: string) {
    return this.service.findOne(key);
  }

  @Patch(':key')
  @ApiOperation({ summary: 'Update ERP setting by key' })
  @ApiResponse({ status: 200, description: 'ERP setting updated' })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  upsert(@Param('key') key: string, @Body() dto: UpdateErpSettingDto, @Request() req: any) {
    return this.service.upsert(key, dto, req.user?.id);
  }
}
