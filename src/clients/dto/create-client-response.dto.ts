import { PickType } from '@nestjs/mapped-types';
import { BaseClientDto } from './base-client.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientResponseDto extends PickType(BaseClientDto, [
  'id',
  'internalRef',
  'name',
  'email',
  'phone',
  'address',
  'city',
  'country',
  'zipCode',
  'type',
  'notes',
  'createdAt',
  'updatedAt',
] as const) {
  @ApiProperty()
  id: string;

  @ApiProperty()
  internalRef: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: [String] })
  email: string[];

  @ApiProperty({ type: [String], required: false })
  phone?: string[];

  @ApiProperty({ required: false })
  address?: string | null;

  @ApiProperty({ required: false })
  city?: string | null;

  @ApiProperty({ required: false })
  country?: string | null;

  @ApiProperty({ required: false })
  zipCode?: string | null;

  @ApiProperty({
    required: false,
    enum: ['PROFESSIONAL', 'PERSONAL'],
    isArray: false,
  })
  type: ClientTypes;

  @ApiProperty({ required: false, type: [String] })
  notes?: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
