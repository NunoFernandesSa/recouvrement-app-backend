import { OmitType, PartialType } from '@nestjs/mapped-types';
import { BaseDebtorDto } from './base-debtor.dto';

export class UpdateDebtorDto extends PartialType(
  OmitType(BaseDebtorDto, ['id']),
) {}
