import { PartialType } from '@nestjs/mapped-types';
import { BaseClientDto } from './base-client.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsOptional,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsEnum,
} from 'class-validator';

export class UpdateClientDto extends PartialType(BaseClientDto) {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly name?: string;

  @IsOptional()
  @IsEmail({}, { each: true })
  @ApiPropertyOptional({ type: [String] })
  readonly email?: string[];

  @IsOptional()
  @IsPhoneNumber(undefined, { each: true })
  @ApiPropertyOptional({ type: [String] })
  readonly phone?: string[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly address?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly city?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly country?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly zipCode?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly siret?: string;

  @IsOptional()
  @IsEnum(['PROFESSIONAL', 'PERSONAL'], { each: true })
  @ApiPropertyOptional({ enum: ['PROFESSIONAL', 'PERSONAL'], isArray: true })
  readonly type?: string[];

  @IsOptional()
  @ApiPropertyOptional({ type: [String] })
  readonly notes?: string[];
}
