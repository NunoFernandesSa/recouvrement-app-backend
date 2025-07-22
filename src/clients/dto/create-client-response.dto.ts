import { OmitType, PartialType } from '@nestjs/mapped-types';
import { BaseClientDto } from './base-client.dto';

export class CreateClientResponseDto extends PartialType(
  OmitType(BaseClientDto, [
    'createdAt',
    'updatedAt',
    'user',
    'debtor',
  ] as const),
) {}
