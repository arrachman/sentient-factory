import { PartialType } from '@nestjs/swagger';
import { CreateWmsTaskDto } from './create-wms-task.dto';

export class UpdateWmsTaskDto extends PartialType(CreateWmsTaskDto) {}
