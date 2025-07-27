import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  'updatedAt',
]) {
  @ApiProperty({ type: () => GetUsersDto })
  user: GetUsersDto;

  @ApiPropertyOptional({ type: () => [Object] })
  debtor?: Debtor[];
}
