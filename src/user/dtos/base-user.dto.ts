import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { UserRole } from 'generated/prisma';

export class BaseUserDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  id: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @Expose()
  @IsOptional()
  @IsString()
  name?: string | null;

  @Expose()
  @IsEnum(UserRole)
  role: UserRole;

  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @Expose()
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @Expose()
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;

  @Expose()
  @IsOptional()
  @IsArray()
  clients?: any[];

  @Expose()
  @IsOptional()
  @IsArray()
  actions: any[];
}
