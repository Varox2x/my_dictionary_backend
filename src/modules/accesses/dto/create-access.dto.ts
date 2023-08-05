import { User } from 'src/modules/auth/entities/user.entity';
import { Set } from 'src/modules/sets/entities/set.entity';
import { Role } from '../entities/access.entity';

export class CreateAccessDto {
  user: User;
  set: Set;
  role?: Role;
}
