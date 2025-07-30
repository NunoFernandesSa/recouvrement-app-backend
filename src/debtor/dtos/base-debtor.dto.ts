import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class BaseDebtorDto {
  @ApiProperty({
    description: 'Unique identifier of the debtor',
    type: String,
    example: 'efzfvqve06510vefccza',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Internal Reference of the debtor',
    type: String,
    example: 'REF-123456',
  })
  @IsNotEmpty()
  @IsString()
  reference: string;

  @ApiProperty({
    description: 'Name of the debtor',
    type: String,
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'List of debtor emails addresses',
    type: [String],
    isArray: true,
    example: ['example@gmail.com'],
  })
  @IsArray()
  @IsString({ each: true })
  email: string[];

  @ApiPropertyOptional({
    description: 'List of debtor phones numbers',
    type: String,
    isArray: true,
    example: ['0102030405'],
  })
  @IsOptional()
  @IsArray()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Debtor address',
    type: String,
    example: '1 rue de la paix',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Debtor city',
    type: String,
    example: 'Paris',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Debtor zipcode',
    type: String,
    example: '75000',
  })
  @IsOptional()
  @IsString()
  zipcode?: string;

  @ApiPropertyOptional({
    description: 'Debtor country',
    type: String,
    example: 'France',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Debtor siret',
    type: String,
    example: '12345678901234',
  })
  @IsOptional()
  @IsString()
  siret?: string;

  @ApiProperty({
    description: 'Debtor type',
    enum: DebtorType,
    example: DebtorType.PROFESSIONAL,
  })
  @IsEnum(DebtorType)
  type: DebtorType;

  @ApiProperty({
    description: 'Debtor status',
    enum: DebtorStatus,
    example: DebtorStatus.ACTIVE,
  })
  @IsEnum(DebtorStatus)
  status: DebtorStatus;

  @ApiProperty({
    description: 'Client id',
    type: String,
    example: 'efzfvqve06510vefccza',
  })
  @IsString()
  clientId: string;

  @ApiProperty({ description: 'Created at', type: Date, example: new Date() })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Created at',
    type: Date,
    example: new Date(),
  })
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;
}
