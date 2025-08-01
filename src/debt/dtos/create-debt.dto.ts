import { OmitType } from '@nestjs/mapped-types';
import { BaseDebtDto } from './base-debt.dto';

export class CreateDebtDto extends OmitType(BaseDebtDto, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
