import { PartialType, OmitType } from '@nestjs/mapped-types';
import { BaseUserDto } from './base-user.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { UserRole } from 'generated/prisma';
import { Exclude } from 'class-transformer';

export class UpdateUserDto extends PartialType(
  OmitType(BaseUserDto, ['id', 'password', 'createdAt', 'updatedAt'] as const),
) {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @Exclude()
  password?: string;
}
