import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DebtorService } from './debtor.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateDebtorDto } from './dtos/create-debtor.dto';

@UseGuards(JwtAuthGuard)
@Controller('debtors')
export class DebtorController {
  constructor(private readonly debtorService: DebtorService) {}

  @Post('new')
  async create(@Body() data: CreateDebtorDto): Promise<CreateDebtorDto> {
    return this.debtorService.create(data);
  }

  @Get()
  async findAll(): Promise<any> {
    return this.debtorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.debtorService.findOne(id);
  }

  @Delete(':id/delete')
  async delete(@Param('id') id: string): Promise<any> {
    return this.debtorService.delete(id);
  }
}
