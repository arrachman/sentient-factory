import { PartialType } from '@nestjs/swagger';
import { CreateWorkCalendarDto } from './create-work-calendar.dto';

export class UpdateWorkCalendarDto extends PartialType(CreateWorkCalendarDto) {}
