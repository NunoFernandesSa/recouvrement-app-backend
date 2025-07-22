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
import { GetUsersDto } from './dtos/get-users.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { CreateUserResponseDto } from './dtos/create-user-response.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('new')
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user with the provided details',
  })
  async createUser(@Body() dto: CreateUserDto): Promise<CreateUserResponseDto> {
    return await this.userService.create(dto);
  }

  @Get('')
  async getUsers(): Promise<GetUsersDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<GetUsersDto | null> {
    return this.userService.findOne(id);
  }

  @Patch('update/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete('delete/:id')
  async deleteUser(@Param('id') id: string): Promise<object> {
    return this.userService.delete(id);
  }
}
