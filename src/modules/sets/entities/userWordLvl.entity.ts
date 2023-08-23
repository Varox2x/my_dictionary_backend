import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Max, Min } from 'class-validator';
import { Word } from './word.entity';
import { User } from 'src/modules/auth/entities/user.entity';
import { Exclude } from '@nestjs/class-transformer';

@Entity()
@Index(['user', 'word'], { unique: true })
export class UserWordLvl {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @Min(0)
  @Max(100)
  lvl: number;

  @ManyToOne(() => Word, (word) => word.userWordLvl, { nullable: true })
  @JoinColumn()
  word: Word;

  @Exclude()
  @ManyToOne(() => User, (user) => user.userWordLvl, {
    nullable: true,
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
