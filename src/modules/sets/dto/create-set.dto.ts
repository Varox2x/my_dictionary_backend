import { Length, IsDateString, IsString, IsNotEmpty } from 'class-validator';

export class CreateSetDto {
  @IsString()
  @Length(5, 255, { message: 'The name length is too short' })
  name: string;
}
