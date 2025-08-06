import { FindManyDebtsService } from './services/find-many-debts.service';
import { FindOneDebtService } from './services/find-one-debt.service';
import { Injectable } from '@nestjs/common';
import { CreateDebtService } from './services/create-debt.service';
import { CreateDebtDto } from './dtos/create-debt.dto';
import { DebtResponseDto } from './dtos/debt-response.dto';
import { UpdateDebtService } from './services/update-debt.service';
import { UpdateDebtDto } from './dtos/update-debt.dto';
import { DeleteDebtService } from './services/delete-debt.service';

@Injectable()
export class DebtService {
  constructor(
    private readonly createDebtService: CreateDebtService,
    private readonly findOneDebtService: FindOneDebtService,
    private readonly findManyDebtsService: FindManyDebtsService,
    private readonly updateDebtService: UpdateDebtService,
    private readonly deleteDebtService: DeleteDebtService,
  ) {}

  async createDebt(data: CreateDebtDto): Promise<DebtResponseDto> {
    return this.createDebtService.createDebt(data);
  }

  async findOneDebt(id: string): Promise<DebtResponseDto> {
    return this.findOneDebtService.findOneDebt(id);
  }

  async findManyDebts(): Promise<DebtResponseDto[]> {
    return this.findManyDebtsService.findManyDebts();
  }

  async updateDebt(
    id: string,
    data: UpdateDebtDto,
  ): Promise<{ message: string; data: UpdateDebtDto }> {
    return this.updateDebtService.updateDebt(id, data);
  }

  async deleteDebt(id: string): Promise<{ message: string }> {
    return this.deleteDebtService.deleteDebt(id);
  }
}
