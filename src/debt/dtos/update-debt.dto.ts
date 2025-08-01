import { OmitType, PartialType } from '@nestjs/mapped-types';
import { BaseDebtDto } from './base-debt.dto';

export class UpdateDebtDto extends PartialType(
  OmitType(BaseDebtDto, ['id', 'createdAt', 'updatedAt', 'debtorId']),
) {}
