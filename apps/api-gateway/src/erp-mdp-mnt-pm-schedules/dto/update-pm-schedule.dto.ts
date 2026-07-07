import { PartialType } from '@nestjs/swagger';
import { CreateMntPmScheduleDto } from './create-pm-schedule.dto';

export class UpdateMntPmScheduleDto extends PartialType(CreateMntPmScheduleDto) {}
