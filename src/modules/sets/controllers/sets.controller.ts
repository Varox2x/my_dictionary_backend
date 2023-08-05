import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { SetsService } from '../services/sets.service';
import { CreateSetDto } from '../dto/create-set.dto';
import { UpdateSetDto } from '../dto/update-set.dto';
import { User } from 'src/modules/auth/entities/user.entity';
import { GetCurrentUser } from 'src/common/decorators';
import { Role } from 'src/modules/accesses/entities/access.entity';

@Controller('sets')
export class SetsController {
  constructor(private readonly setsService: SetsService) {}

  //1. return setsName assign to current user according to ROLE
  // get validate role here instead of service
  @Get()
  @HttpCode(HttpStatus.OK)
  async getCurrentUserSets(
    @GetCurrentUser() user: User,
    @Query('role') role: Role,
  ) {
    return await this.setsService.get(user, role);
  }

  //2. create set for current user
  @Post()
  @HttpCode(HttpStatus.OK)
  async createSet(@Body() input: CreateSetDto, @GetCurrentUser() user: User) {
    return this.setsService.create(user, input);
  }
  //3. delete set
  @Delete(':setId')
  @HttpCode(204)
  async removeSet(@Param('setId') setId) {
    return this.setsService.remove(setId);
  }

  //3. add word to set

  //
}
