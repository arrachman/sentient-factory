import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateLmsEnrollmentDto } from './create-enrollment.dto';

// courseId is fixed once the enrollment line exists.
export class UpdateLmsEnrollmentDto extends PartialType(
  OmitType(CreateLmsEnrollmentDto, ['courseId'] as const),
) {}
