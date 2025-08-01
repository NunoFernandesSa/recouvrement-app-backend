import { Body, Controller, Param, Post } from '@nestjs/common';
import { DebtService } from './debt.service';
import { CreateDebtDto } from './dtos/create-debt.dto';
import { DebtResponseDto } from './dtos/debt-response.dto';

@Controller('debt')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @Post('new')
  async create(
    @Param('id') id: string,
    @Body() data: CreateDebtDto,
  ): Promise<DebtResponseDto> {
    return this.debtService.createDebt(id, data);
  }
}
