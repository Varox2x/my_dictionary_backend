import { Length } from 'class-validator';

export class CreateWordDto {
  @Length(5)
  name: string;
  @Length(5)
  definition: string;
}
