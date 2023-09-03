import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateAccessDto } from '../dto/create-access.dto';
import { UpdateAccessDto } from '../dto/update-access.dto';
import { Access, Role } from '../entities/access.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/auth/entities/user.entity';
import { Set } from 'src/modules/sets/entities/set.entity';

@Injectable()
export class AccessesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Access)
    private readonly accessRepository: Repository<Access>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Set)
    private readonly setsRepository: Repository<Set>,
  ) {}

  //it creates role for user (if no role passed the default handle in database is OWNER)
  async create(
    { accessUserId, role }: CreateAccessDto,
    user: User,
    setId: number,
  ) {
    //TODO przy tworzeniu zestawu dodać tą funkcję najlpeij oplecioną tranzakcją
    const userToAccess = await this.usersRepository.findOne({
      where: { id: accessUserId },
    });
    if (!userToAccess) {
      throw new BadRequestException('User does not exist');
    }
    const setToAccess = await this.setsRepository.findOne({
      where: { id: setId },
    });
    console.log(setToAccess);

    if (!setToAccess) {
      throw new BadRequestException('Set does not exist');
    }
    //TODO jesli dodano access owner, to usun inne acces nalaze do tego usera i setu
    const access = new Access();
    access.user = userToAccess;
    access.set = setToAccess;
    if (role) access.role = role;
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      if (role == Role.Owner) {
        await this.accessRepository
          .createQueryBuilder('access', queryRunner)
          .delete()
          .from(Access)
          .where('setId = :setId ', {
            setId: setId,
          })
          .andWhere('role != :roleEnum', { roleEnum: Role.Owner })
          .andWhere('userId = :userId', { userId: userToAccess.id })
          .execute();
      }

      await this.accessRepository
        .createQueryBuilder('access', queryRunner)
        .insert()
        .into(Access)
        .values([
          {
            ...access,
          },
        ])
        .execute();

      await queryRunner.commitTransaction();
    } catch (error) {
      if (error.code == 23505) {
        throw new BadRequestException('Access already exist');
      }
      throw new BadRequestException('Fail while adding access');
    } finally {
      await queryRunner.release();
    }
  }
}
