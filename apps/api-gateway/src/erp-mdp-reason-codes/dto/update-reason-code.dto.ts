import { PartialType } from '@nestjs/swagger';
import { CreateReasonCodeDto } from './create-reason-code.dto';

export class UpdateReasonCodeDto extends PartialType(CreateReasonCodeDto) {}
