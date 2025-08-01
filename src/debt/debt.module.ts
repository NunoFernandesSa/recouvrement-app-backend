import { CreateDebtService } from './services/create-debt.service';
import { Module } from '@nestjs/common';
import { DebtController } from './debt.controller';
import { DebtService } from './debt.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [DebtController],
  providers: [DebtService, CreateDebtService, PrismaService],
  exports: [DebtService],
})
export class DebtModule {}
