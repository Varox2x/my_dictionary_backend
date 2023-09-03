import { Exclude } from 'class-transformer';
import { Access } from 'src/modules/accesses/entities/access.entity';
import { UserWordLvl } from 'src/modules/sets/entities/userWordLvl.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  email: string;
  @Exclude()
  @Column()
  password: string;
  @Exclude()
  @Column({ nullable: true })
  token: string;
  @OneToMany(() => Access, (access) => access.user)
  access: Access;
  @OneToMany(() => UserWordLvl, (userWordLvl) => userWordLvl.user)
  userWordLvl: UserWordLvl;
}
