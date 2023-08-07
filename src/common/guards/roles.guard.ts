import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Access, Role } from 'src/modules/accesses/entities/access.entity';
import { Repository } from 'typeorm';
import { ROLES_KEY } from '../decorators/roles.decorators';

//IMPORTANT !!!! This decorates protects only endpoint's where setId and wordId is provided by params. Its has to be ,,setId" for set's id and ,,wordId" for word's id

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Access)
    private readonly accessRepository: Repository<Access>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { setId, wordId } = request.params; //ids  databse
    const user = request.user;
    let access;
    if (wordId) {
      access = await this.accessRepository
        .createQueryBuilder('access')
        .innerJoin('access.user', 'user')
        .innerJoin('access.set', 'set')
        .innerJoin('set.word', 'word')
        .where('user.id = :userId', { userId: user.id })
        .andWhere('word.id = :wordId', { wordId })
        .getOne();
    }
    if (setId) {
      access = await this.accessRepository.findOne({
        where: { set: { id: setId }, user: user },
      });
    }

    if (!access) {
      return false;
    }
    return requiredRoles.includes(access.role);
  }
}
