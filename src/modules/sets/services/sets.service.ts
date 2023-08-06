import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateSetDto } from '../dto/create-set.dto';
import { UpdateSetDto } from '../dto/update-set.dto';
import { User } from 'src/modules/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Set } from '../entities/set.entity';
import { Role } from 'src/modules/accesses/entities/access.entity';
import { AccessesService } from 'src/modules/accesses/services/accesses.service';

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
    await this.accessesService.create({
      user,
      set: createdSet,
      role: Role.Owner,
    });
    // 2. if acces not created then delete created set
    // 3. add pagination
    return createdSet;
  }

  public async remove(setId: number): Promise<DeleteResult> {
    return await this.setsRepository
      .createQueryBuilder('set')
      .delete()
      .where('id = :id', { id: setId })
      .execute();
  }

  //return sets according to passed role
  public async get(user: User, role: Role) {
    if (!role) throw new BadRequestException(['Provide role']);
    if (!(role in Role)) {
      throw new BadRequestException('Invalid role parameter.');
    }
    // return await this.setsRepository.find({
    //   where: { access: { user, role } },
    //   relations: { access: true },
    // });

    //transform
    // const sourceQuery = await this.setsRepository
    //   .createQueryBuilder('set')
    //   .leftJoinAndSelect('set.access', 'access')
    //   .where('access.user = :userId', { userId: user.id })
    //   .andWhere('access.role = :role', { role })
    //   .getMany();

    // console.log('sourceQuery');
    // console.log(sourceQuery);

    // return sourceQuery.map((set) => ({ ...set, access: set.access[0].role }));

    const sourceQuery = await this.setsRepository
      .createQueryBuilder('set')
      .leftJoin('set.access', 'access')
      .select([
        'set.id as setId',
        'set.name as setName',
        'access.id as accessId',
        'access.role as role',
      ])
      .where('access.user = :userId', { userId: user.id })
      .andWhere('access.role = :role', { role })
      .getRawMany();

    return sourceQuery.map(({ accessid, ...keeptAttrs }) => keeptAttrs);
  }

  public async getSet(setId) {
    return await this.setsRepository.findOne({
      where: { id: setId },
      relations: { word: true },
    });
  }
}
