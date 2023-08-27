import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class UpdateuserWordLvlDto {
  @Min(0)
  @Max(100)
  @IsInt({ each: true })
  lvl: number;
  @IsNotEmpty()
  @IsInt({ each: true })
  id: number;
}

export class BulkUpdateuserWordLvlDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateuserWordLvlDto)
  data: UpdateuserWordLvlDto[];
}
