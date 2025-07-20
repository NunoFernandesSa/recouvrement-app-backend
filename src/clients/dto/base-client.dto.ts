import { GetUsersDto } from '../../user/dto/get-users.dto';
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

export class BaseClientDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsEmail()
  email2: string | null;

  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  siret: string;

  @IsOptional()
  @IsEnum(['PROFESSIONAL', 'PERSONAL'])
  type: string[];

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  user: GetUsersDto;
}
