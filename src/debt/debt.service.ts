import { FindOneDebtService } from './services/find-one-debt.service';
import { Injectable } from '@nestjs/common';
import { CreateDebtService } from './services/create-debt.service';
import { CreateDebtDto } from './dtos/create-debt.dto';
import { DebtResponseDto } from './dtos/debt-response.dto';

@Injectable()
export class DebtService {
  constructor(
    private readonly createDebtService: CreateDebtService,
    private readonly findOneDebtService: FindOneDebtService,
  ) {}

  async createDebt(id: string, data: CreateDebtDto): Promise<DebtResponseDto> {
    return this.createDebtService.createDebt(id, data);
  }

  async findOneDebt(id: string): Promise<DebtResponseDto> {
    return this.findOneDebtService.findOneDebt(id);
  }
}
