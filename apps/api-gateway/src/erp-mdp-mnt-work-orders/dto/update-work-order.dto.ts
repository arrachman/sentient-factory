import { PartialType } from '@nestjs/swagger';
import { CreateMntWorkOrderDto } from './create-work-order.dto';

export class UpdateMntWorkOrderDto extends PartialType(CreateMntWorkOrderDto) {}
