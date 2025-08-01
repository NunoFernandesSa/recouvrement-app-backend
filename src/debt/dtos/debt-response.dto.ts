import { OmitType } from '@nestjs/mapped-types';
import { BaseDebtDto } from './base-debt.dto';

export class DebtResponseDto extends OmitType(BaseDebtDto, ['id']) {}
