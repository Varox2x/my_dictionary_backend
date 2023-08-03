import { Module } from '@nestjs/common';
import { SetsService } from './services/sets.service';
import { SetsController } from './controllers/sets.controller';

@Module({
  controllers: [SetsController],
  providers: [SetsService],
})
export class SetsModule {}
