import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateMntSparePartDto } from './create-spare-part.dto';

// workOrderId is fixed once the spare part line exists.
export class UpdateMntSparePartDto extends PartialType(
  OmitType(CreateMntSparePartDto, ['workOrderId'] as const),
) {}
