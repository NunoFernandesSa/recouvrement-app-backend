import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DebtorService } from './debtor.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateDebtorDto } from './dtos/create-debtor.dto';
import { UpdateDebtorDto } from './dtos/update-debtor.dto';
import { DebtorResponseDto } from './dtos/debtor-response.dto';

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

  @Get(':id/detail')
  async findOneDetail(@Param('id') id: string): Promise<DebtorResponseDto> {
    return this.debtorService.findOneDetail(id);
  }

  @Patch(':id/update')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateDebtorDto,
  ): Promise<{ data: UpdateDebtorDto; message: string }> {
    return this.debtorService.update(id, data);
  }

  @Delete(':id/delete')
  async delete(@Param('id') id: string): Promise<any> {
    return this.debtorService.delete(id);
  }
}
