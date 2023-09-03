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
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AccessesService } from '../services/accesses.service';
import { CreateAccessDto } from '../dto/create-access.dto';
import { GetCurrentUser } from 'src/common/decorators';
import { User } from 'src/modules/auth/entities/user.entity';

@Controller('accesses')
export class AccessesController {
  constructor(private readonly accessesService: AccessesService) {}

  @Post(':setId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.CREATED)
  async createAccess(
    @Param('setId') setId,
    @Body() input: CreateAccessDto,
    @GetCurrentUser() user: User,
  ) {
    return this.accessesService.create(input, user, setId);
  }
}
