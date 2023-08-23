import { Max, Min } from 'class-validator';

export class UpdateuserWordLvlDto {
  @Min(0)
  @Max(100)
  lvl: number;
  id: number;
}
