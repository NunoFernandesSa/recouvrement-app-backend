import { OmitType } from '@nestjs/mapped-types';
import { BaseUserDto } from './base-user.dto';

export class CreateUserResponseDto extends OmitType(BaseUserDto, [
  'password',
] as const) {}
