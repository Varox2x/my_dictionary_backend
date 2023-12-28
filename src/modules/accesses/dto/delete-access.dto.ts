import { IsEmail } from 'class-validator';

export class DeleteAccessDto {
  @IsEmail()
  email: string;
}
