import { Injectable } from '@nestjs/common';
import { CreateDebtService } from './services/create-debt.service';

@Injectable()
export class DebtService {
  constructor(private readonly createDebtService: CreateDebtService) {}

  async createDebt(data: any) {
    return this.createDebtService.createDebt(data);
  }
}
