import { PartialType } from '@nestjs/mapped-types';
import { CreateWordDto } from './create.word.dto';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  Validate,
  ValidateNested,
  isNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateWordDto extends PartialType(CreateWordDto) {
  @IsNotEmpty()
  @IsInt({ each: true })
  id: number;
}

export class BulkUpdateUserWordsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateWordDto)
  data: UpdateWordDto[];
}
