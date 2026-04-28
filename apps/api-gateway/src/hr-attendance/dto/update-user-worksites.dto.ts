import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, ArrayUnique } from 'class-validator';

export class UpdateUserWorksitesDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((entry) => Number(entry)).filter((entry) => Number.isFinite(entry));
    }

    if (typeof value === 'string' && value.trim()) {
      return value
        .split(',')
        .map((entry) => Number(entry.trim()))
        .filter((entry) => Number.isFinite(entry));
    }

    return [];
  })
  @IsInt({ each: true })
  worksiteIds!: number[];
}
