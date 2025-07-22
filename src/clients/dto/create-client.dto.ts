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
  @IsNotEmpty()
  @IsString()
  readonly internalRef: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { each: true })
  readonly email: string[];

  @IsOptional()
  @IsPhoneNumber(undefined, { each: true })
  readonly phone: string[];

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @IsString()
  readonly city?: string;

  @IsOptional()
  @IsString()
  readonly country?: string;

  @IsOptional()
  @IsString()
  readonly zipCode?: string;

  @IsOptional()
  @IsString()
  readonly siret: string;

  @IsOptional()
  @IsEnum(['PROFESSIONAL', 'PERSONAL'], { each: true })
  readonly type: string[];

  @IsOptional()
  readonly notes?: string[];

  @IsNotEmpty()
  @Type(() => GetUsersDto)
  readonly user: any;

  @IsOptional()
  readonly debtor?: any;
}
