import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccessesService } from '../services/accesses.service';
import { CreateAccessDto } from '../dto/create-access.dto';
import { UpdateAccessDto } from '../dto/update-access.dto';

@Controller('accesses')
export class AccessesController {
  constructor(private readonly accessesService: AccessesService) {}
}
