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
import { Type } from 'class-transformer';
import { GetUsersDto } from 'src/user/dtos/get-users.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientDto extends PickType(BaseClientDto, [
  'internalRef',
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
  'user',
  'debtor',
] as const) {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly internalRef: string;

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
  readonly siret: string;

  @ApiPropertyOptional({ enum: ['PROFESSIONAL', 'PERSONAL'], isArray: true })
  @IsOptional()
  @IsEnum(['PROFESSIONAL', 'PERSONAL'], { each: true })
  readonly type: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  readonly notes?: string[];

  @ApiProperty({ type: () => GetUsersDto })
  @IsNotEmpty()
  @Type(() => GetUsersDto)
  readonly user: any;

  @ApiPropertyOptional({ type: 'array', items: { type: 'object' } })
  @IsOptional()
  readonly debtor?: any;
}
