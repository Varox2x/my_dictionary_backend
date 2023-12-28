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
  Query,
} from '@nestjs/common';
import { AccessesService } from '../services/accesses.service';
import { CreateAccessDto } from '../dto/create-access.dto';
import { GetCurrentUser } from 'src/common/decorators';
import { User } from 'src/modules/auth/entities/user.entity';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from '../entities/access.entity';
import { DeleteAccessDto } from '../dto/delete-access.dto';

@Controller('accesses')
export class AccessesController {
  constructor(private readonly accessesService: AccessesService) {}
  //TDO dodać guarda
  @Post(':setId')
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(Role.Owner)
  @HttpCode(HttpStatus.CREATED)
  async createAccess(
    @Param('setId') setId,
    @Body() input: CreateAccessDto,
    @GetCurrentUser() user: User,
  ) {
    return this.accessesService.addAccess(input, user, setId);
  }

  @Delete(':setId/:userId')
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(Role.Owner)
  @HttpCode(204)
  async deleteAccess(@Param('setId') setId, @Param('userId') userId) {
    return this.accessesService.deleteAccess(userId, setId);
  }

  @Get(':setId')
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(Role.Owner)
  @HttpCode(HttpStatus.OK)
  async getAcccessesForSet(
    @GetCurrentUser() user: User,
    @Param('setId') setId,
    @Query('role')
    role: Role,
    @Query('page') page = 1,
  ) {
    return this.accessesService.getAccessToSet(
      setId,
      {
        currentPage: page,
        limit: 10,
      },
      role,
    );
  }
}
