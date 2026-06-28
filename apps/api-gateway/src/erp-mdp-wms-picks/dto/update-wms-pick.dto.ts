import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateWmsPickDto } from './create-wms-pick.dto';

// taskId is fixed once the pick line exists.
export class UpdateWmsPickDto extends PartialType(
  OmitType(CreateWmsPickDto, ['taskId'] as const),
) {}
