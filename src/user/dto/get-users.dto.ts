import { OmitType } from '@nestjs/mapped-types';
import { BaseUserDto } from './base-user.dto';

export class GetUsersDto extends OmitType(BaseUserDto, [
  'password',
  'createdAt',
  'updatedAt',
  'clients',
  'folders',
  'debts',
  'actions',
  'actionDetails',
] as const) {}
