import { Module } from '@nestjs/common';
import { SetsService } from './services/sets.service';
import { SetsController } from './controllers/sets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Set } from './entities/set.entity';
import { Access } from '../accesses/entities/access.entity';
import { AccessesService } from '../accesses/services/accesses.service';
import { AccessesModule } from '../accesses/accesses.module';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Set, Access, User]), AccessesModule],
  controllers: [SetsController],
  providers: [SetsService],
})
export class SetsModule {}
