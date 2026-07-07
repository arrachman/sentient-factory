import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateQmsCharacteristicDto } from './create-characteristic.dto';

// planId is fixed once the characteristic line exists.
export class UpdateQmsCharacteristicDto extends PartialType(
  OmitType(CreateQmsCharacteristicDto, ['planId'] as const),
) {}
