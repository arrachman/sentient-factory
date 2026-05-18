import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateErpItemCategoryDto } from './dto/create-erp-item-category.dto';
import { QueryErpItemCategoryDto } from './dto/query-erp-item-category.dto';
import { UpdateErpItemCategoryDto } from './dto/update-erp-item-category.dto';
import { ErpItemCategoriesService } from './erp-item-categories.service';

@ApiTags('ERP Item Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('erp/item-categories')
export class ErpItemCategoriesController {
  constructor(private readonly service: ErpItemCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create ERP item category' })
  @ApiResponse({ status: 201, description: 'ERP item category created' })
  create(@Body() dto: CreateErpItemCategoryDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get ERP item category list' })
  @ApiResponse({ status: 200, description: 'List of ERP item categories' })
  findAll(@Query() query: QueryErpItemCategoryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one ERP item category' })
  @ApiResponse({ status: 200, description: 'ERP item category detail' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update ERP item category' })
  @ApiResponse({ status: 200, description: 'ERP item category updated' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateErpItemCategoryDto,
    @Request() req: any,
  ) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete ERP item category (soft delete)' })
  @ApiResponse({ status: 200, description: 'ERP item category deleted' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
