import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { DebtorStatus, DebtorType } from 'generated/prisma';

@ApiSchema({ name: 'BaseDebtorDto', description: 'Base debtor DTO' })
export class BaseDebtorDto {
  @ApiProperty({ description: 'Debtor id', type: String })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  reference: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  email: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  zipcode?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  siret?: string;

  @ApiProperty()
  @IsEnum(DebtorType)
  type: DebtorType;

  @ApiProperty()
  @IsEnum(DebtorStatus)
  status: DebtorStatus;

  @ApiProperty()
  @IsOptional()
  @IsString()
  clientId: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;
}
