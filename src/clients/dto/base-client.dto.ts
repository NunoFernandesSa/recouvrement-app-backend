import { Debtor } from './../../../generated/prisma/index.d';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsEnum,
  IsDate,
} from 'class-validator';
import { GetUsersDto } from 'src/user/dtos/get-users.dto';

export class BaseClientDto {
  @IsNotEmpty()
  @IsString()
  readonly id: string;

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
  readonly phone?: string[];

  @IsOptional()
  @IsString()
  readonly address?: string | null;

  @IsOptional()
  @IsString()
  readonly city?: string | null;

  @IsOptional()
  @IsString()
  readonly country?: string | null;

  @IsOptional()
  @IsString()
  readonly zipCode?: string | null;

  @IsOptional()
  @IsString()
  readonly siret?: string;

  @IsOptional()
  @IsEnum(['PROFESSIONAL', 'PERSONAL'])
  readonly type: string;

  @IsOptional()
  readonly notes?: string[];

  @IsDate()
  @Type(() => Date)
  readonly createdAt: Date;

  @IsDate()
  @Type(() => Date)
  readonly updatedAt: Date;

  @IsOptional()
  readonly user: GetUsersDto;

  @IsOptional()
  readonly debtor?: Debtor[];
}
