import { Injectable } from '@nestjs/common';
import { CreateAccessDto } from '../dto/create-access.dto';
import { UpdateAccessDto } from '../dto/update-access.dto';
import { Access } from '../entities/access.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AccessesService {
  constructor(
    @InjectRepository(Access)
    private readonly accessRepository: Repository<Access>,
  ) {}

  //it creates role for user (if no role passed the default handle in database is OWNER)
  create({ user, set, role }: CreateAccessDto) {
    const access = new Access();
    access.user = user;
    access.set = set;
    if (role) access.role = role;
    return this.accessRepository.save(access);
  }
}
