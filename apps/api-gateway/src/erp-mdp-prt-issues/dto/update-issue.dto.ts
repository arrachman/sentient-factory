import { PartialType } from '@nestjs/swagger';
import { CreatePrtIssueDto } from './create-issue.dto';

export class UpdatePrtIssueDto extends PartialType(CreatePrtIssueDto) {}
