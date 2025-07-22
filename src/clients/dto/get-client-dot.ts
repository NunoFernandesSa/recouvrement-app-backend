import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { GetUsersDto } from '../../user/dtos/get-users.dto';
import { Debtor } from './../../../generated/prisma/index.d';
import { PickType } from '@nestjs/mapped-types';
import { BaseClientDto } from './base-client.dto';

export class GetClientDto extends PickType(BaseClientDto, [
  'id',
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
  'createdAt',
]) {
  @ApiProperty()
  id: string;

  @ApiProperty()
  internalRef: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: [String] })
  email: string[];

  @ApiPropertyOptional({ type: [String] })
  phone?: string[];

  @ApiPropertyOptional()
  address?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  country?: string;

  @ApiPropertyOptional()
  zipCode?: string;

  @ApiPropertyOptional()
  siret: string;

  @ApiPropertyOptional({ enum: ['PROFESSIONAL', 'PERSONAL'], isArray: true })
  type: string[];

  @ApiPropertyOptional({ type: [String] })
  notes?: string[];

  @ApiProperty()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty()
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({ type: () => GetUsersDto })
  @Type(() => GetUsersDto)
  user: GetUsersDto;

  @ApiPropertyOptional({ type: () => [Object] }) // Tu peux remplacer Object par un DebtorDto plus précis
  debtor?: Debtor[];
}
