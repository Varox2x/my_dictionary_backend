import { Module } from '@nestjs/common';
import { AccessesService } from './services/accesses.service';
import { AccessesController } from './controllers/accesses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Access } from './entities/access.entity';
import { User } from '../auth/entities/user.entity';
import { Set } from '../sets/entities/set.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Access, User, Set])],
  controllers: [AccessesController],
  providers: [AccessesService],
  exports: [AccessesService],
})
export class AccessesModule {}
