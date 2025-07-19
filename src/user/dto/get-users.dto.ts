import { OmitType } from '@nestjs/mapped-types';
import { BaseUserDto } from './base-user.dto';
import { Expose } from 'class-transformer';

export class GetUsersDto extends OmitType(BaseUserDto, ['password'] as const) {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  role: string[];
}
