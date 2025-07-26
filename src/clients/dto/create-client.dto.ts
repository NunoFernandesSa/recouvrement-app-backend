// create-client.dto.ts
import { PickType } from '@nestjs/mapped-types';
import { BaseClientDto } from './base-client.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClientType } from 'generated/prisma';

export class CreateClientDto extends PickType(BaseClientDto, [
  'name',
  'email',
  'phone',
  'address',
  'city',
  'country',
  'zipCode',
  'siret',
  'type',
  'notes',
  'debtor',
] as const) {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  @IsEmail({}, { each: true })
  readonly email: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsPhoneNumber(undefined, { each: true })
  readonly phone: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly zipCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly siret?: string;

  @ApiPropertyOptional({ enum: ['PROFESSIONAL', 'PERSONAL'], isArray: true })
  @IsOptional()
  @IsEnum(['PROFESSIONAL', 'PERSONAL'])
  readonly type: ClientType;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  readonly notes?: string[];

  @ApiPropertyOptional({ type: 'array', items: { type: 'object' } })
  @IsOptional()
  readonly debtor?: any;
}
