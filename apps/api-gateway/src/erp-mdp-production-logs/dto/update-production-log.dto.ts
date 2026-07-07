import { PartialType } from '@nestjs/swagger';
import { CreateProductionLogDto } from './create-production-log.dto';

export class UpdateProductionLogDto extends PartialType(CreateProductionLogDto) {}
