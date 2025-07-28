// create-client.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';
import { BaseClientDto } from './base-client.dto';
import { ClientType } from 'generated/prisma';

// Omettre le champ "user" hérité de BaseClientDto
export class CreateClientDto extends OmitType(BaseClientDto, [
  'id',
  'internalRef',
  'createdAt',
  'updatedAt',
  'user',
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
  readonly phone?: string[];

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
  readonly siret: string;

  @ApiPropertyOptional({ enum: ['PROFESSIONAL', 'PERSONAL'] })
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
