import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
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

  @Exclude()
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
  folders?: any[];

  @Expose()
  @IsOptional()
  @IsArray()
  debts?: any[];

  @Expose()
  @IsOptional()
  @IsArray()
  actions: any[];

  @Expose()
  @IsOptional()
  @IsArray()
  actionDetails: any[];
}
