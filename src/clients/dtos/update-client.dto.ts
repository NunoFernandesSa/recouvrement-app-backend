import { OmitType, PartialType } from '@nestjs/mapped-types';
import { BaseClientDto } from './base-client.dto';

export class UpdateClientDto extends PartialType(
  OmitType(BaseClientDto, [
    'id',
    'internalRef',
    'createdAt',
    'updatedAt',
    'user',
  ] as const),
) {}
