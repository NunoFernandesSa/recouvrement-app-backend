import { UpdateDebtorService } from './services/update-debtor.service';
import { CreateDebtorService } from './services/create-debtor.service';
import { Injectable } from '@nestjs/common';
import { FindManyDebtorsService } from './services/find-many-debtors.service';
import { FindOneDebtorService } from './services/find-one-debtor.service';
import { DeleteDebtorService } from './services/delete-debtor.service';
import { CreateDebtorDto } from './dtos/create-debtor.dto';
import { UpdateDebtorDto } from './dtos/update-debtor.dto';
import { DebtorResponseDto } from './dtos/debtor-response.dto';
import { FindOneDebtorDetailService } from './services/find-one-debtor-detail.service';

@Injectable()
export class DebtorService {
  constructor(
    private readonly createDebtorService: CreateDebtorService,
    private readonly findManyDebtorsService: FindManyDebtorsService,
    private readonly findOneDebtorService: FindOneDebtorService,
    private readonly findOneDebtorDetailService: FindOneDebtorDetailService,
    private readonly deleteDebtorService: DeleteDebtorService,
    private readonly updateDebtorService: UpdateDebtorService,
  ) {}

  async create(data: CreateDebtorDto): Promise<CreateDebtorDto> {
    return this.createDebtorService.createDebtor(data);
  }

  async findAll(): Promise<any> {
    return this.findManyDebtorsService.findManyDebtors();
  }

  async findOne(id: string): Promise<any> {
    return this.findOneDebtorService.findOneDebtor(id);
  }

  async findOneDetail(id: string): Promise<DebtorResponseDto> {
    return this.findOneDebtorDetailService.findOneDebtorDetail(id);
  }

  async update(
    id: string,
    data: UpdateDebtorDto,
  ): Promise<{ data: UpdateDebtorDto; message: string }> {
    return this.updateDebtorService.updateDebtor(id, data);
  }

  async delete(id: string): Promise<any> {
    return this.deleteDebtorService.deleteDebtor(id);
  }
}
