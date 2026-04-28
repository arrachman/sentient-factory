import { PartialType } from '@nestjs/swagger';
import { CreateHrWorksiteDto } from './create-hr-worksite.dto';

export class UpdateHrWorksiteDto extends PartialType(CreateHrWorksiteDto) {}
