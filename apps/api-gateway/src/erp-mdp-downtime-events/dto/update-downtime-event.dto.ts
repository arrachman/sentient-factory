import { PartialType } from '@nestjs/swagger';
import { CreateDowntimeEventDto } from './create-downtime-event.dto';

export class UpdateDowntimeEventDto extends PartialType(CreateDowntimeEventDto) {}
