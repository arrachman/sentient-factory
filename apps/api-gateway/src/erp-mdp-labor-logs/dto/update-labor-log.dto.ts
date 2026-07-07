import { PartialType } from '@nestjs/swagger';
import { CreateLaborLogDto } from './create-labor-log.dto';

export class UpdateLaborLogDto extends PartialType(CreateLaborLogDto) {}
