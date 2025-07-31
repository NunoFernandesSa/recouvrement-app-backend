import { OmitType } from '@nestjs/mapped-types';
import { BaseDebtorDto } from './base-debtor.dto';

export class CreateDebtorDto extends OmitType(BaseDebtorDto, [
  'id',
  'createdAt',
  'updatedAt',
  'clientId',
]) {}
