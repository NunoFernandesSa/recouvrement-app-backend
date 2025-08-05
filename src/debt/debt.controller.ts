import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { DebtService } from './debt.service';
import { CreateDebtDto } from './dtos/create-debt.dto';
import { DebtResponseDto } from './dtos/debt-response.dto';
import { UpdateDebtDto } from './dtos/update-debt.dto';

@Controller('debts')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @Post('new')
  async create(@Body() data: CreateDebtDto): Promise<DebtResponseDto> {
    return this.debtService.createDebt(data);
  }

  @Get()
  async findMany(): Promise<DebtResponseDto[]> {
    return this.debtService.findManyDebts();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DebtResponseDto> {
    return this.debtService.findOneDebt(id);
  }

  @Patch(':id/update')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateDebtDto,
  ): Promise<{ message: string; data: UpdateDebtDto }> {
    return this.debtService.updateDebt(id, data);
  }
}
