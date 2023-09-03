import { IsInt } from 'class-validator';
import { Role } from '../entities/access.entity';

export class CreateAccessDto {
  @IsInt()
  accessUserId: number;
  @IsInt()
  role: number;
}
