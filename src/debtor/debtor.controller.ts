import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DebtorService } from './debtor.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateDebtorDto } from './dtos/create-debtor.dto';
import { ApiExtraModels } from '@nestjs/swagger';
import { BaseDebtorDto } from './dtos/base-debtor.dto';

@UseGuards(JwtAuthGuard)
@Controller('debtors')
export class DebtorController {
  constructor(private readonly debtorService: DebtorService) {}

  @ApiExtraModels(BaseDebtorDto)
  @Post('new')
  async create(@Body() data: CreateDebtorDto): Promise<CreateDebtorDto> {
    return this.debtorService.create(data);
  }

  @Delete(':id/delete')
  async delete(@Param() id: string): Promise<any> {
    return this.debtorService.delete(id);
  }
}
