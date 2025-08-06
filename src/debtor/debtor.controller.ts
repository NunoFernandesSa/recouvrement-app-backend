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
import { ApiOperation } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('debtors')
export class DebtorController {
  constructor(private readonly debtorService: DebtorService) {}

  @ApiOperation({
    summary: 'Create a new debtor',
    description: 'Create a new debtor with the provided data',
  })
  @Post('new')
  async create(@Body() data: CreateDebtorDto): Promise<CreateDebtorDto> {
    return this.debtorService.create(data);
  }

  @ApiOperation({
    summary: 'Get all debtors',
    description: 'Retrieve a list of all debtors',
  })
  @Get()
  async findAll(): Promise<any> {
    return this.debtorService.findAll();
  }

  @ApiOperation({
    summary: 'Get a debtor by ID',
    description: 'Retrieve a debtor by their unique ID',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.debtorService.findOne(id);
  }

  @ApiOperation({
    summary: 'Get a debtor detail by ID',
    description: 'Retrieve a debtor detail by their unique ID',
  })
  @Get(':id/detail')
  async findOneDetail(@Param('id') id: string): Promise<DebtorResponseDto> {
    return this.debtorService.findOneDetail(id);
  }

  @ApiOperation({
    summary: 'Update a debtor by ID',
    description: 'Update a debtor by their unique ID',
  })
  @Patch(':id/update')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateDebtorDto,
  ): Promise<{ data: UpdateDebtorDto; message: string }> {
    return this.debtorService.update(id, data);
  }

  @ApiOperation({
    summary: 'Delete a debtor by ID',
    description: 'Delete a debtor by their unique ID',
  })
  @Delete(':id/delete')
  async delete(@Param('id') id: string): Promise<any> {
    return this.debtorService.delete(id);
  }
}
