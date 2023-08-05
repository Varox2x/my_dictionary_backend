import { Module } from '@nestjs/common';
import { AccessesService } from './services/accesses.service';
import { AccessesController } from './controllers/accesses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Access } from './entities/access.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Access])],
  controllers: [AccessesController],
  providers: [AccessesService],
  exports: [AccessesService],
})
export class AccessesModule {}
