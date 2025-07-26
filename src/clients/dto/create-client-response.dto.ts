import { PickType } from '@nestjs/mapped-types';
import { BaseClientDto } from './base-client.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClientType } from 'generated/prisma';

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
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'CLT-2025-001' })
  internalRef: string;

  @ApiProperty({ example: 'Acme Corp' })
  name: string;

  @ApiProperty({ example: ['contact@acme.com'] })
  email: string[];

  @ApiPropertyOptional({ example: ['+33600000000'], type: [String] })
  phone?: string[];

  @ApiPropertyOptional({ example: '123 Main St' })
  address?: string | null;

  @ApiPropertyOptional({ example: 'Anytown' })
  city?: string | null;

  @ApiPropertyOptional({ example: 'USA' })
  country?: string | null;

  @ApiPropertyOptional({ example: '12345' })
  zipCode?: string | null;

  @ApiProperty({ enum: ClientType, example: ClientType.PROFESSIONAL })
  type: ClientTypes;

  @ApiPropertyOptional({ example: ['Note 1', 'Note 2'] })
  notes?: string[];

  @ApiProperty({
    example: new Date().toISOString(),
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    example: new Date().toISOString(),
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;
}
