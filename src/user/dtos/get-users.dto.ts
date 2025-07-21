import { OmitType } from '@nestjs/mapped-types';
import { BaseUserDto } from './base-user.dto';

export class GetUsersDto extends OmitType(BaseUserDto, [
  'password',
  'clients',
  'actions',
] as const) {}
