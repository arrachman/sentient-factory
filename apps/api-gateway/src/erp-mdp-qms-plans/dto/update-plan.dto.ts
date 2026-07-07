import { PartialType } from '@nestjs/swagger';
import { CreateQmsPlanDto } from './create-plan.dto';

export class UpdateQmsPlanDto extends PartialType(CreateQmsPlanDto) {}
