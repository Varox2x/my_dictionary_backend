import { Access } from 'src/modules/accesses/entities/access.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column({ nullable: true })
  token: string;
  @OneToMany(() => Access, (access) => access.user)
  access: Access;
}
