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
import { WordsService } from '../services/word.service';
import { CreateWordDto } from '../dto/create.word.dto';

@Controller('sets')
export class SetsController {
  constructor(
    private readonly setsService: SetsService,
    private readonly wordService: WordsService,
  ) {}

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

  //4. add word to set
  @Post(':setId')
  @HttpCode(HttpStatus.CREATED)
  async createWord(@Param('setId') setId, @Body() input: CreateWordDto) {
    return this.wordService.createOne(setId, input);
  }
  //

  //get set by id
  @Get(':setId')
  @HttpCode(HttpStatus.OK)
  async getSet(@Param(':setId') setId) {
    return this.setsService.getSet(setId);
  }
}
