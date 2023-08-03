import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Permission } from 'src/modules/permissions/entities/permission.entity';

@Entity()
export class Set {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  name: string;
  @OneToMany(() => Permission, (permission) => permission.set, {
    cascade: true,
  })
  permission: Permission;
}
