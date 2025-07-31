import { CreateDebtorService } from './services/create-debtor.service';
import { Injectable } from '@nestjs/common';
import { FindManyDebtorsService } from './services/find-many-debtors.service';
import { FindOneDebtorService } from './services/find-one-debtor.service';
import { DeleteDebtorService } from './services/delete-debtor.service';
import { CreateDebtorDto } from './dtos/create-debtor.dto';

@Injectable()
export class DebtorService {
  constructor(
    private readonly createDebtorService: CreateDebtorService,
    private readonly findManyDebtorsService: FindManyDebtorsService,
    private readonly findOneDebtorService: FindOneDebtorService,
    private readonly deleteDebtorService: DeleteDebtorService,
  ) {}

  async create(data: CreateDebtorDto): Promise<CreateDebtorDto> {
    return this.createDebtorService.createDebtor(data);
  }

  async findAll(): Promise<any> {
    return this.findManyDebtorsService.findManyDebtors();
  }

  async delete(id: string): Promise<any> {
    return this.deleteDebtorService.deleteDebtor(id);
  }
}
