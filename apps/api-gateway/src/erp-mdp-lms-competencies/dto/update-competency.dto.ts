import { PartialType } from '@nestjs/swagger';
import { CreateLmsCompetencyDto } from './create-competency.dto';

export class UpdateLmsCompetencyDto extends PartialType(CreateLmsCompetencyDto) {}
