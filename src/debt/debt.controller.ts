import { Body, Controller, Post } from '@nestjs/common';
import { DebtService } from './debt.service';

@Controller('debt')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @Post('new')
  async create(@Body() data: any) {
    return this.debtService.createDebt(data);
  }
}
