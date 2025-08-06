import { FindManyDebtsService } from './services/find-many-debts.service';
import { CreateDebtService } from './services/create-debt.service';
import { Module } from '@nestjs/common';
import { DebtController } from './debt.controller';
import { DebtService } from './debt.service';
import { PrismaService } from 'src/prisma.service';
import { FindOneDebtService } from './services/find-one-debt.service';
import { UpdateDebtService } from './services/update-debt.service';
import { DeleteDebtService } from './services/delete-debt.service';
import { FindOneDebtDetailService } from './services/find-one-debt-detail.service';

@Module({
  controllers: [DebtController],
  providers: [
    DebtService,
    CreateDebtService,
    FindOneDebtService,
    FindManyDebtsService,
    FindOneDebtDetailService,
    UpdateDebtService,
    DeleteDebtService,
    PrismaService,
  ],
  exports: [DebtService],
})
export class DebtModule {}
