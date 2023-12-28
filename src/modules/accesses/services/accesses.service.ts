import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateAccessDto } from '../dto/create-access.dto';
import { UpdateAccessDto } from '../dto/update-access.dto';
import { Access, Role } from '../entities/access.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/auth/entities/user.entity';
import { Set } from 'src/modules/sets/entities/set.entity';
import { DeleteAccessDto } from '../dto/delete-access.dto';
import { paginate } from 'src/common/helpers/paginator';

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
  async addAccess({ email, role }: CreateAccessDto, user: User, setId: number) {
    //TODO przy tworzeniu zestawu dodać tą funkcję najlpeij oplecioną tranzakcją
    const userToAccess = await this.usersRepository.findOne({
      where: { email: email },
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

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.accessRepository
        .createQueryBuilder('access', queryRunner)
        .delete()
        .from(Access)
        .where('setId = :setId ', {
          setId: setId,
        })
        .andWhere('role != :roleEnum', { roleEnum: role })
        .andWhere('userId = :userId', { userId: userToAccess.id })
        .execute();
      const access = new Access();
      access.user = userToAccess;
      access.set = setToAccess;
      if (role) access.role = role;
      const savedAccess = await this.saveAccess(
        userToAccess,
        setToAccess,
        role,
        queryRunner,
      );
      console.log('savedAccess');
      console.log(savedAccess);
      await queryRunner.commitTransaction();
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      if (error.code == 23505) {
        throw new BadRequestException('Access already exist');
      }
      throw new BadRequestException('Fail while adding access');
    } finally {
      await queryRunner.release();
    }

    return { role: role, user: { email: email, id: userToAccess.id } };
  }

  async deleteAccess(userId, setId: number) {
    const userToDeleteAccess = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!userToDeleteAccess) {
      throw new BadRequestException('User does not exist');
    }

    return await this.accessRepository
      .createQueryBuilder('access')
      .delete()
      .where('setId = :setId ', {
        setId,
      })
      .andWhere('userId = :userId', { userId: userToDeleteAccess.id })
      .execute();
  }

  async getAccessToSet(setId: number, paginateOptions, role) {
    let sourceQuery;
    if (!role) {
      sourceQuery = await this.accessRepository
        .createQueryBuilder('access')
        .where('access.setId = :setId', { setId })
        .leftJoinAndSelect('access.user', 'email');
    } else {
      sourceQuery = await this.accessRepository
        .createQueryBuilder('access')
        .where('access.setId = :setId', { setId })
        .andWhere('access.role = :role', { role })
        .leftJoinAndSelect('access.user', 'email');
    }

    return await paginate<Access>(sourceQuery, paginateOptions);
  }

  async saveAccess(
    userToAccess: User,
    setToAccess: Set,
    role: Role,
    queryRunner?: QueryRunner,
  ) {
    const access = new Access();
    access.user = userToAccess;
    access.set = setToAccess;
    if (role) access.role = role;

    return await this.accessRepository
      .createQueryBuilder('access', queryRunner)
      .insert()
      .into(Access)
      .values([
        {
          ...access,
        },
      ])
      .execute();
  }
}
