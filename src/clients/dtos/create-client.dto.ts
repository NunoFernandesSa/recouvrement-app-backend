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
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Nom du client', type: String, example: 'Doe' })
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { each: true })
  @ApiProperty({
    description: 'Client emails adresses',
    type: [String],
    example: ['example@email.com'],
  })
  readonly email: string[];

  @IsOptional()
  @IsPhoneNumber(undefined, { each: true })
  @ApiPropertyOptional({
    description: 'Client phones numbers',
    type: [String],
    example: ['0606060606'],
  })
  readonly phone?: string[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Client address',
    type: String,
    example: '123 rue de la Paix',
  })
  readonly address?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Client city',
    type: String,
    example: 'Paris',
  })
  readonly city?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Client country',
    type: String,
    example: 'France',
  })
  readonly country?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Client zip code',
    type: String,
    example: '75000',
  })
  readonly zipCode?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Client siret number',
    type: String,
    example: '12345678901234',
  })
  readonly siret: string;

  @IsOptional()
  @IsEnum(['PROFESSIONAL', 'PERSONAL'])
  @ApiPropertyOptional({
    description: 'Client type',
    type: String,
    example: ClientType.PROFESSIONAL,
  })
  readonly type: ClientType;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Client notes',
    type: [String],
    example: ['Note 1', 'Note 2'],
  })
  readonly notes?: string[];

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Debort of the client',
    type: 'array',
    example: [
      {
        id: 'azfezfgsgknsront',
        name: 'Debort 1',
      },
    ],
  })
  readonly debtor?: any;
}
