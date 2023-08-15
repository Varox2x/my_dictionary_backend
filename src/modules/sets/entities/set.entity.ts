import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Access } from 'src/modules/accesses/entities/access.entity';
import { Word } from './word.entity';
import { PaginationResult } from 'src/common/helpers/paginator';
import { Exclude } from 'class-transformer';

@Entity()
export class Set {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  name: string;
  @OneToMany(() => Access, (access) => access.set, {
    cascade: true,
  })
  access: Access;

  @OneToMany(() => Word, (word) => word.set)
  word: Word;
}

export type PaginedSets = PaginationResult<Set>;
