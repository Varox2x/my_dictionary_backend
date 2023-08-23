import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Set } from './set.entity';
import { UserWordLvl } from './userWordLvl.entity';

@Entity()
export class Word {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  name: string;
  @Column({ nullable: true })
  definition: string;
  @ManyToOne(() => Set, (set) => set.word, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'setId' })
  set: Set;

  @OneToMany(() => UserWordLvl, (userWordLvl) => userWordLvl.word, {
    onUpdate: 'CASCADE',
  })
  userWordLvl: UserWordLvl[];
}
