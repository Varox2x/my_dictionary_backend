import { User } from 'src/modules/auth/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Set } from 'src/modules/sets/entities/set.entity';

export enum Role {
  Owner = 1,
  Reader = 2,
}

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('enum', {
    enum: Role,
    default: Role.Owner,
  })
  role: Role;
  @ManyToOne(() => User, (user) => user.permission, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  user: User;
  @ManyToOne(() => Set, (set) => set.permission, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  set: Set;
}
