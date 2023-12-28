import { IsEmail, IsInt, IsString } from 'class-validator';
import { Role } from '../entities/access.entity';

export class CreateAccessDto {
  @IsEmail()
  email: string;
  @IsInt()
  role: number;
}
