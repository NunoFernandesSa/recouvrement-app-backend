import { Injectable } from '@nestjs/common';
import { CreateDebtService } from './services/create-debt.service';
import { CreateDebtDto } from './dtos/create-debt.dto';
import { DebtResponseDto } from './dtos/debt-response.dto';

@Injectable()
export class DebtService {
  constructor(private readonly createDebtService: CreateDebtService) {}

  async createDebt(id: string, data: CreateDebtDto): Promise<DebtResponseDto> {
    return this.createDebtService.createDebt(id, data);
  }
}
