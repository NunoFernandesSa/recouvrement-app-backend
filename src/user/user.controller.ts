import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetUsersDto } from './dtos/get-users.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { CreateUserResponseDto } from './dtos/create-user-response.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all users',
  })
  async getUsers(): Promise<GetUsersDto[]> {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a user by their unique ID',
  })
  async getUserById(@Param('id') id: string): Promise<GetUsersDto | null> {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  @ApiOperation({
    summary: 'Update user by ID',
    description: 'Update a user by their unique ID',
  })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/delete')
  @ApiOperation({
    summary: 'Delete user by ID',
    description: 'Delete a user by their unique ID',
  })
  async deleteUser(@Param('id') id: string): Promise<object> {
    return this.userService.delete(id);
  }

  // Custom routes
  @UseGuards(JwtAuthGuard)
  @Get(':id/actions')
  @ApiOperation({
    summary: 'Get user actions',
    description: 'Retrieve a list of actions performed by a user',
  })
  async getUserActions(@Param('id') id: string): Promise<any> {
    return this.userService.findUserActions(id);
  }
}
