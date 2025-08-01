import { CreateDebtService } from './services/create-debt.service';
import { Module } from '@nestjs/common';
import { DebtController } from './debt.controller';
import { DebtService } from './debt.service';

@Module({
  controllers: [DebtController],
  providers: [DebtService, CreateDebtService],
})
export class DebtModule {}
