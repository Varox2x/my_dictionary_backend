import { User } from 'src/modules/auth/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Set } from 'src/modules/sets/entities/set.entity';
import { Exclude } from 'class-transformer';

export enum Role {
  Owner = 1,
  Reader = 2,
  EDITABLE = 3,
}

@Entity()
export class Access {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column('enum', {
    enum: Role,
    default: Role.Owner,
  })
  role: Role;
  @ManyToOne(() => User, (user) => user.access, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  user: User;
  @ManyToOne(() => Set, (set) => set.access, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  set: Set;
}
