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
  BadRequestException,
} from '@nestjs/common';
import { SetsService } from '../services/sets.service';
import { CreateSetDto } from '../dto/create-set.dto';
import { User } from 'src/modules/auth/entities/user.entity';
import { GetCurrentUser, Public } from 'src/common/decorators';
import { Role } from 'src/modules/accesses/entities/access.entity';
import { WordsService } from '../services/word.service';
import { CreateWordDto } from '../dto/create.word.dto';
import { BulkUpdateuserWordLvlDto } from '../dto/update.userWordLvl.entity.dto';
import { BulkUpdateUserWordsDto } from '../dto/update-bulk-word.dto';
import { AccessesService } from 'src/modules/accesses/services/accesses.service';
import { UpdateWordDto } from '../dto/update-single-word.dto';

@Controller('sets')
@SerializeOptions({ strategy: 'exposeAll' })
export class SetsController {
  constructor(
    private readonly setsService: SetsService,
    private readonly wordService: WordsService,
    private readonly accessesService: AccessesService,
  ) {}

  //get sets name for current user according to role
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
      limit: 10,
    });
  }

  //create set for current user
  @Post()
  @HttpCode(HttpStatus.OK)
  async createSet(@Body() input: CreateSetDto, @GetCurrentUser() user: User) {
    return this.setsService.create(user, input);
  }
  // delete set
  @Delete(':setId')
  @HttpCode(204)
  async removeSet(@Param('setId') setId, @GetCurrentUser() user: User) {
    await this.accessesService.hasAccess({
      setId,
      user,
      requiredRoles: [Role.Owner],
    });
    return this.setsService.remove(setId);
  }

  //add word to set
  @Post(':setId/words')
  @HttpCode(HttpStatus.CREATED)
  async createWord(
    @Param('setId') setId,
    @Body() input: CreateWordDto,
    @GetCurrentUser() user: User,
  ) {
    await this.accessesService.hasAccess({
      setId,
      user,
      requiredRoles: [Role.Owner, Role.EDITABLE],
    });
    return this.wordService.createOne(setId, input);
  }

  //get all words belonging to set
  @Get(':setId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async getSet(
    @Param('setId') setId,
    @GetCurrentUser() user: User,
    @Query('page') page = 1,
  ) {
    await this.accessesService.hasAccess({
      setId,
      user,
      requiredRoles: [Role.EDITABLE, Role.Owner, Role.Reader],
    });
    return this.wordService.getSetWords(setId, user, {
      currentPage: page,
      limit: 50,
    });
  }

  //delete word from set
  @Delete('words/:wordId')
  @HttpCode(204)
  async removeWord(@Param('wordId') wordId, @GetCurrentUser() user: User) {
    await this.accessesService.hasAccess({
      wordId,
      user,
      requiredRoles: [Role.Owner, Role.EDITABLE],
    });
    return await this.wordService.remove(wordId);
  }

  // bulk words update
  @Patch(':setId/words')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async updateWords(
    @Param('setId') setId,
    @Body()
    input: BulkUpdateUserWordsDto,
    @GetCurrentUser() user: User,
  ) {
    await this.accessesService.hasAccess({
      setId,
      user,
      requiredRoles: [Role.Owner, Role.EDITABLE],
    });
    return await this.wordService.bulkWordUpdate(input, setId, user);
  }

  //single word update
  @Patch('words/:wordId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async updateWord(
    @Param('wordId') wordId,
    @Body()
    input: UpdateWordDto,
    @GetCurrentUser() user: User,
  ) {
    console.log('hi');
    await this.accessesService.hasAccess({
      wordId,
      user,
      requiredRoles: [Role.Owner, Role.EDITABLE],
    });
    return await this.wordService.wordUpdate(wordId, input);
  }

  // bulk update words lever for set
  @Patch(':setId/userWordsLvl')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async updateWordLvl(
    @Param('setId') setId,
    @Body()
    input: BulkUpdateuserWordLvlDto,
    @GetCurrentUser() user: User,
  ) {
    await this.accessesService.hasAccess({
      setId,
      user,
      requiredRoles: [Role.Owner, Role.EDITABLE, Role.Reader],
    });
    try {
      return await this.wordService.updateUserWordsLvl(input.data, setId, user);
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
