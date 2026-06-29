import { PartialType } from '@nestjs/swagger';
import { CreateEhsIncidentDto } from './create-incident.dto';

export class UpdateEhsIncidentDto extends PartialType(CreateEhsIncidentDto) {}
