import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto} from './dto/users.dto';

@Controller({ path: "users", version: "1" })
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Post()
  async create(@Body() dto: CreateUsersDto) {
    return this.usersService.create(dto);
  }
}