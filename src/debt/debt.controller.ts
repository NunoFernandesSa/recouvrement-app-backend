import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DebtService } from './debt.service';
import { CreateDebtDto } from './dtos/create-debt.dto';
import { DebtResponseDto } from './dtos/debt-response.dto';
import { UpdateDebtDto } from './dtos/update-debt.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('debts')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @ApiOperation({
    summary: 'Create a new debt',
    description: 'Create a new debt record',
  })
  @Post('new')
  async create(@Body() data: CreateDebtDto): Promise<DebtResponseDto> {
    return this.debtService.createDebt(data);
  }

  @ApiOperation({
    summary: 'Get all debts',
    description: 'Retrieve all debt records',
  })
  @Get()
  async findMany(): Promise<DebtResponseDto[]> {
    return this.debtService.findManyDebts();
  }

  @ApiOperation({
    summary: 'Get a debt by ID',
    description: 'Retrieve a specific debt record by its unique ID',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DebtResponseDto> {
    return this.debtService.findOneDebt(id);
  }

  @ApiOperation({
    summary: 'Get a debt detail by ID',
    description: 'Retrieve a specific debt record detail by its unique ID',
  })
  @Get(':id/detail')
  async findOneDetail(@Param('id') id: string): Promise<DebtResponseDto> {
    return this.debtService.findOneDebtDetail(id);
  }

  @ApiOperation({
    summary: 'Update a debt by ID',
    description: 'Update a specific debt record by its unique ID',
  })
  @Patch(':id/update')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateDebtDto,
  ): Promise<{ message: string; data: UpdateDebtDto }> {
    return this.debtService.updateDebt(id, data);
  }

  @ApiOperation({
    summary: 'Delete a debt by ID',
    description: 'Delete a specific debt record by its unique ID',
  })
  @Delete(':id/delete')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    return this.debtService.deleteDebt(id);
  }
}
