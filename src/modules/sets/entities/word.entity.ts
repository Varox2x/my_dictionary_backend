import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Set } from './set.entity';

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
  })
  @JoinColumn({ name: 'setId' })
  set: Set;
}
