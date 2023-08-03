import { Permission } from 'src/modules/permissions/entities/permission.entity';
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
  @OneToMany(() => Permission, (permission) => permission.user)
  permission: Permission;
}
