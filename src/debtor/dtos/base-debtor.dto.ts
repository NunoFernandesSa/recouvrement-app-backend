import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { DebtorStatus, DebtorType } from 'generated/prisma';

export class BaseDebtorDto {
  @IsUUID()
  id: string;

  @IsString()
  reference: string;

  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  email: string[];

  @IsOptional()
  @IsArray()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  zipcode?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  siret?: string;

  @IsEnum(DebtorType)
  type: DebtorType;

  @IsEnum(DebtorStatus)
  status: DebtorStatus;

  @IsUUID()
  clientId: string;

  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @Type(() => Date)
  @IsDate()
  updatedAt: Date;
}
