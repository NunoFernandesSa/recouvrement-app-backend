import { Module } from '@nestjs/common';
import { DebtorController } from './debtor.controller';
import { DebtorService } from './debtor.service';
import { CreateDebtorService } from './services/create-debtor.service';
import { FindManyDebtorsService } from './services/find-many-debtors.service';
import { FindOneDebtorService } from './services/find-one-debtor.service';
import { DeleteDebtorService } from './services/delete-debtor.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [DebtorController],
  providers: [
    DebtorService,
    CreateDebtorService,
    FindManyDebtorsService,
    FindOneDebtorService,
    DeleteDebtorService,
    PrismaService,
  ],
})
export class DebtorModule {}
