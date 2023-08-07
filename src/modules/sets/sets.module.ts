import { Module } from '@nestjs/common';
import { SetsService } from './services/sets.service';
import { SetsController } from './controllers/sets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Set } from './entities/set.entity';
import { Access } from '../accesses/entities/access.entity';
import { AccessesService } from '../accesses/services/accesses.service';
import { AccessesModule } from '../accesses/accesses.module';
import { User } from '../auth/entities/user.entity';
import { Word } from './entities/word.entity';
import { WordsService } from './services/word.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Set, Access, User, Word]),
    AccessesModule,
  ],
  controllers: [SetsController],
  providers: [
    SetsService,
    WordsService,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class SetsModule {}
