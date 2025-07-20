import { PickType } from '@nestjs/mapped-types';
import { BaseUserDto } from './base-user.dto';

export class CreateUserDto extends PickType(BaseUserDto, [
  'name',
  'email',
  'password',
]) {}
