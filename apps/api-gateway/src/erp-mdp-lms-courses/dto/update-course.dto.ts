import { PartialType } from '@nestjs/swagger';
import { CreateLmsCourseDto } from './create-course.dto';

export class UpdateLmsCourseDto extends PartialType(CreateLmsCourseDto) {}
