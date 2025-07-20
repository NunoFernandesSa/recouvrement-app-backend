import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetUsersDto } from './dto/get-users.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(
    @Body() data: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    return this.userService.createUser(data);
  }

  @Get('')
  async getUsers(): Promise<GetUsersDto[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<GetUsersDto | null> {
    return this.userService.getUserById(id);
  }

  @Patch('update/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete('delete/:id')
  async deleteUser(@Param('id') id: string): Promise<object> {
    return this.userService.deleteUser(id);
  }
}
