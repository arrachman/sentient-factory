import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateDmsRevisionDto } from './create-revision.dto';

// documentId is fixed once the revision line exists.
export class UpdateDmsRevisionDto extends PartialType(
  OmitType(CreateDmsRevisionDto, ['documentId'] as const),
) {}
