import { CreateDebtService } from './services/create-debt.service';
import { Module } from '@nestjs/common';
import { DebtController } from './debt.controller';
import { DebtService } from './debt.service';
import { PrismaService } from 'src/prisma.service';
import { FindOneDebtService } from './services/find-one-debt.service';

@Module({
  controllers: [DebtController],
  providers: [
    DebtService,
    CreateDebtService,
    FindOneDebtService,
    PrismaService,
  ],
  exports: [DebtService],
})
export class DebtModule {}
