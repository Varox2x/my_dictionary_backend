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
  SerializeOptions,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { SetsService } from '../services/sets.service';
import { CreateSetDto } from '../dto/create-set.dto';
import { UpdateSetDto } from '../dto/update-set.dto';
import { User } from 'src/modules/auth/entities/user.entity';
import { GetCurrentUser, GetCurrentUserId } from 'src/common/decorators';
import { Role } from 'src/modules/accesses/entities/access.entity';
import { WordsService } from '../services/word.service';
import { CreateWordDto } from '../dto/create.word.dto';
import { Roles } from 'src/common/decorators/roles.decorators';

@Controller('sets')
@SerializeOptions({ strategy: 'exposeAll' })
export class SetsController {
  constructor(
    private readonly setsService: SetsService,
    private readonly wordService: WordsService,
  ) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async getCurrentUserSets(
    @GetCurrentUser() user: User,
    @Query('role') role: Role,
    @Query('page') page = 1,
  ) {
    return await this.setsService.getSets(user, role, {
      currentPage: page,
      limit: 3,
    });
  }

  //2. create set for current user
  @Post()
  @HttpCode(HttpStatus.OK)
  async createSet(@Body() input: CreateSetDto, @GetCurrentUser() user: User) {
    return this.setsService.create(user, input);
  }
  //3. delete set
  @Delete(':setId')
  @Roles(Role.Owner)
  @HttpCode(204)
  async removeSet(@Param('setId') setId) {
    return this.setsService.remove(setId);
  }

  //4. add word to set
  @Post(':setId')
  @Roles(Role.Owner, Role.EDITABLE)
  @HttpCode(HttpStatus.CREATED)
  async createWord(@Param('setId') setId, @Body() input: CreateWordDto) {
    return this.wordService.createOne(setId, input);
  }
  //

  //get set by id
  @Get(':setId')
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(Role.Owner, Role.EDITABLE, Role.Reader)
  @HttpCode(HttpStatus.OK)
  async getSet(
    @Param('setId') setId,
    @GetCurrentUser() user: User,
    @Query('page') page = 1,
  ) {
    return this.wordService.getSetWords(setId, user, {
      currentPage: page,
      limit: 3,
    });
  }

  //delete word from set
  @Delete('words/:wordId')
  @Roles(Role.Owner, Role.EDITABLE)
  @HttpCode(204)
  async removeWord(@Param('wordId') wordId) {
    return await this.wordService.remove(wordId);
  }

  //edit set name guard owner

  // edit word (change name, definition, change lvl)
}
