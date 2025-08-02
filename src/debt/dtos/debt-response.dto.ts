import { Exclude } from 'class-transformer';
import { BaseDebtDto } from './base-debt.dto';

export class DebtResponseDto extends BaseDebtDto {
  @Exclude()
  declare debtorId: string;
}
