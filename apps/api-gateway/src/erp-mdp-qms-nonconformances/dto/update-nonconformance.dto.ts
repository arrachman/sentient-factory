import { PartialType } from '@nestjs/swagger';
import { CreateQmsNonconformanceDto } from './create-nonconformance.dto';

export class UpdateQmsNonconformanceDto extends PartialType(CreateQmsNonconformanceDto) {}
