import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DebtService } from './debt.service';
import { CreateDebtDto } from './dtos/create-debt.dto';
import { DebtResponseDto } from './dtos/debt-response.dto';

@Controller('debts')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @Post('new')
  async create(
    @Param('id') id: string,
    @Body() data: CreateDebtDto,
  ): Promise<DebtResponseDto> {
    return this.debtService.createDebt(id, data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DebtResponseDto> {
    return this.debtService.findOneDebt(id);
  }
}
