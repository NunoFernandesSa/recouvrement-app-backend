import { OmitType } from '@nestjs/mapped-types';
import { BaseDebtorDto } from './base-debtor.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDebtorDto extends OmitType(BaseDebtorDto, [
  'id',
  'createdAt',
  'updatedAt',
]) {
  @ApiProperty({
    description: 'Client ID linked to the debtor',
    type: String,
    example: 'efzfvqve06510vefccza',
  })
  clientId: string;
}
