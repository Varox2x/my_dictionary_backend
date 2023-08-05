import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Access } from 'src/modules/accesses/entities/access.entity';

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
}
