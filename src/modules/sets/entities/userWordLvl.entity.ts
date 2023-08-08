import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Max, Min } from 'class-validator';
import { Word } from './word.entity';

@Entity()
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
}
