import { PartialType } from '@nestjs/swagger';
import { CreateWmsMovementDto } from './create-wms-movement.dto';

export class UpdateWmsMovementDto extends PartialType(CreateWmsMovementDto) {}
