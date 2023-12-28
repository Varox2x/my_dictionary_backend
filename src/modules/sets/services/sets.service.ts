import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateSetDto } from '../dto/create-set.dto';
import { UpdateSetDto } from '../dto/update-set.dto';
import { User } from 'src/modules/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { PaginedSets, Set } from '../entities/set.entity';
import { Access, Role } from 'src/modules/accesses/entities/access.entity';
import { AccessesService } from 'src/modules/accesses/services/accesses.service';
import { UserWordLvl } from '../entities/userWordLvl.entity';
import { PaginateOptions, paginate } from 'src/common/helpers/paginator';

@Injectable()
export class SetsService {
  constructor(
    @InjectRepository(Set)
    private readonly setsRepository: Repository<Set>,
    @Inject(AccessesService)
    private readonly accessesService: AccessesService,
  ) {}
  public async create(user: User, input: CreateSetDto) {
    const set = new Set();
    set.name = input.name;
    const createdSet = await this.setsRepository.save(set);
    await this.accessesService.saveAccess(user, set, Role.Owner);
    console.log('createdSet');
    console.log(createdSet.id);

    // return await this.setsRepository.findOne({
    //   where: { id: createdSet.id },
    //   relations: ['access', 'access.set'],
    // });

    return await this.setsRepository
      .createQueryBuilder('set')
      .leftJoinAndMapOne(
        'set.access',
        Access,
        'access',
        'access.setId = set.id',
      )
      .where('set.id = :setId', { setId: createdSet.id })
      .andWhere('access.role = :role', { role: 1 })
      .getOne();
  }

  public async remove(setId: number): Promise<DeleteResult> {
    return await this.setsRepository
      .createQueryBuilder('set')
      .delete()
      .where('id = :id', { id: setId })
      .execute();
  }

  //return sets according to passed role
  public async getSets(
    user: User,
    role: Role,
    paginateOptions: PaginateOptions,
  ) {
    if (!role) throw new BadRequestException(['Provide role']);
    if (!(role in Role)) {
      throw new BadRequestException('Invalid role parameter.');
    }

    const sourceQuery = await this.setsRepository
      .createQueryBuilder('set')
      .leftJoinAndMapOne(
        'set.access',
        Access,
        'access',
        'access.setId = set.id',
      )
      .where('access.userId = :userId', { userId: user.id })
      .andWhere('access.role = :role', { role: role });

    return await paginate<Set>(sourceQuery, paginateOptions);
  }
}
