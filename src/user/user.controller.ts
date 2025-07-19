import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUsersDto } from './dto/get-users.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(@Body() data: CreateUserDto): Promise<CreateUserDto> {
    return this.userService.createUser(data);
  }

  @Get('all')
  async getUsers(): Promise<GetUsersDto[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<GetUsersDto | null> {
    return this.userService.getUserById(id);
  }
}
