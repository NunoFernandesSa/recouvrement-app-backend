import { OmitType } from '@nestjs/mapped-types';
import { BaseDebtorDto } from './base-debtor.dto';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels(BaseDebtorDto)
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
