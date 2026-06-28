import { PartialType } from '@nestjs/swagger';
import { CreateQmsInspectionDto } from './create-inspection.dto';

export class UpdateQmsInspectionDto extends PartialType(CreateQmsInspectionDto) {}
