import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { UserCreateService } from './services/user-create.service';
import { UserReadManyService } from './services/user-read-many.service';
import { UserReadOneService } from './services/user-read-one.service';
import { UserUpdateService } from './services/user-update.service';
import { UserDeleteService } from './services/user-delete.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    UserCreateService,
    UserReadManyService,
    UserReadOneService,
    UserUpdateService,
    UserDeleteService,
  ],
  exports: [UserService],
})
export class UserModule {}
