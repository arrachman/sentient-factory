import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { CreateMenuDto } from './create-menu.dto';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @Transform(({ value }) => {
    if (value === null) {
      return null;
    }
    if (value === undefined || value === '') {
      return undefined;
    }
    const parsed = Number(value);
    return Number.isInteger(parsed) ? parsed : value;
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  override parentId?: number | null;
}
