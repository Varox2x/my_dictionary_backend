import {
  Controller,
  Get,
  Post,
  Body,
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
import { Role } from '../entities/access.entity';

@Controller('accesses')
export class AccessesController {
  constructor(private readonly accessesService: AccessesService) {}

  //create access for user
  @Post(':setId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.CREATED)
  async createAccess(
    @Param('setId') setId,
    @Body() input: CreateAccessDto,
    @GetCurrentUser() user: User,
  ) {
    await this.accessesService.hasAccess({
      setId,
      user,
      requiredRoles: [Role.Owner],
    });
    return this.accessesService.addAccess(input, user, setId);
  }

  //delete access for user
  @Delete(':setId/:userId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(204)
  async deleteAccess(
    @Param('setId') setId,
    @Param('userId') userId,
    @GetCurrentUser() user: User,
  ) {
    await this.accessesService.hasAccess({
      setId,
      user,
      requiredRoles: [Role.Owner],
    });
    return this.accessesService.deleteAccess(userId, setId);
  }

  //get list of users who has access to certain set with provided role
  @Get(':setId')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async getAcccessesForSet(
    @GetCurrentUser() user: User,
    @Param('setId') setId,
    @Query('role')
    role: Role,
    @Query('page') page = 1,
  ) {
    await this.accessesService.hasAccess({
      setId,
      user,
      requiredRoles: [Role.Owner],
    });
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
