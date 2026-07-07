import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePrtEscalationDto } from './create-escalation.dto';

// issueId is fixed once the escalation line exists.
export class UpdatePrtEscalationDto extends PartialType(
  OmitType(CreatePrtEscalationDto, ['issueId'] as const),
) {}
