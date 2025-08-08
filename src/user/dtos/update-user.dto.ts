import { PartialType, OmitType } from '@nestjs/mapped-types';
import { BaseUserDto } from './base-user.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { UserRole } from 'generated/prisma';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(
  OmitType(BaseUserDto, ['password', 'createdAt'] as const),
) {
  @IsOptional()
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
    required: false,
  })
  name: string;

  @IsOptional()
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
    required: false,
  })
  email: string;

  @Exclude()
  @ApiProperty({
    description: 'User password (min 8 characters)',
    example: 'secret123',
    required: false,
  })
  password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  @ApiProperty({
    enum: UserRole,
    description: 'User role',
    required: false,
  })
  role?: UserRole;

  @IsOptional()
  @ApiProperty({
    description: 'User refresh token',
    example: 'refresh-token',
    required: false,
  })
  refreshToken?: string;
}
