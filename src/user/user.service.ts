import { Injectable } from '@nestjs/common';
import { UserCreateService } from './services/user-create.service';
import { UserReadManyService } from './services/user-read-many.service';
import { UserReadOneService } from './services/user-read-one.service';
import { UserUpdateService } from './services/user-update.service';
import { UserDeleteService } from './services/user-delete.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { CreateUserResponseDto } from './dtos/create-user-response.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { GetUsersDto } from './dtos/get-users.dto';
import { UserFindManyActionsService } from './services/user-find-many-actions.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly createUser: UserCreateService,
    private readonly getUsers: UserReadManyService,
    private readonly getUserById: UserReadOneService,
    private readonly updateUser: UserUpdateService,
    private readonly deleteUser: UserDeleteService,
    private readonly findManyActions: UserFindManyActionsService,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateUserDto): Promise<CreateUserResponseDto> {
    return await this.createUser.createUser(dto);
  }

  async getUser(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findAll(): Promise<GetUsersDto[]> {
    return await this.getUsers.getUsers();
  }

  async findOne(id: string): Promise<GetUsersDto> {
    return await this.getUserById.getUserById(id);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UpdateUserDto> {
    return await this.updateUser.updateUser(id, dto);
  }

  async delete(id: string): Promise<object> {
    return await this.deleteUser.deleteUser(id);
  }

  async findUserActions(id: string): Promise<any> {
    return await this.findManyActions.findManyActions(id);
  }
}
