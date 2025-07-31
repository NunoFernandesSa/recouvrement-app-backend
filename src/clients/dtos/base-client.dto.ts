import { ApiProperty } from '@nestjs/swagger';
import { ClientType, Debtor } from '../../../generated/prisma';
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
  @ApiProperty({
    description: 'The id of the client',
    type: String,
    example: 'fezbrntrshethqr',
  })
  readonly id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The internal reference of the client',
    type: String,
    example: 'CLT-FR-DoeJohn',
  })
  readonly internalRef: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The name of the client',
    type: String,
    example: 'Doe John',
  })
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { each: true })
  @ApiProperty({
    description: 'The email of the client',
    type: String,
    example: ['doe@gmail.com'],
  })
  readonly email: string[];

  @IsOptional()
  @IsPhoneNumber(undefined, { each: true })
  @ApiProperty({
    description: 'The phone number of the client',
    type: String,
    example: ['+33612345678'],
  })
  readonly phone?: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The address of the client',
    type: String,
    example: '123 rue de la Paix',
  })
  readonly address?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The city of the client',
    type: String,
    example: 'Paris',
  })
  readonly city?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The country of the client',
    type: String,
    example: 'France',
  })
  readonly country?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The zip code of the client',
    type: String,
    example: '75000',
  })
  readonly zipCode?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The siret of the client',
    type: String,
    example: '12345678901234',
  })
  readonly siret?: string;

  @IsOptional()
  @IsEnum(['PROFESSIONAL', 'PERSONAL'])
  @ApiProperty({
    description: 'The type of the client',
    type: String,
    example: ClientType.PROFESSIONAL,
  })
  readonly type: ClientType;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The notes of the client',
    type: String,
    example: ['Note 1', 'Note 2'],
  })
  readonly notes?: string[];

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'The date of creation of the client',
    type: Date,
    example: new Date(),
  })
  readonly createdAt: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'The date of last update of the client',
    type: Date,
    example: new Date(),
  })
  readonly updatedAt: Date;

  @IsOptional()
  @ApiProperty({
    description: 'The user of the client',
    type: GetUsersDto,
  })
  readonly user: GetUsersDto;

  @IsOptional()
  @ApiProperty({
    description: 'The debtors of the client',
    type: [Object],
  })
  readonly debtor?: Debtor[];
}
