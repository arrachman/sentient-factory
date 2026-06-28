import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateQmsResultDto } from './create-result.dto';

// inspectionId is fixed once the result line exists.
export class UpdateQmsResultDto extends PartialType(
  OmitType(CreateQmsResultDto, ['inspectionId'] as const),
) {}
