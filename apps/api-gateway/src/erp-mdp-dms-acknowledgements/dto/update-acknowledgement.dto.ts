import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateDmsAcknowledgementDto } from './create-acknowledgement.dto';

// documentId is fixed once the acknowledgement line exists.
export class UpdateDmsAcknowledgementDto extends PartialType(
  OmitType(CreateDmsAcknowledgementDto, ['documentId'] as const),
) {}
