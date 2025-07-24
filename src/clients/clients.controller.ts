import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post('new')
  async create(): Promise<any> {
    return this.clientsService.create();
  }

  @Get()
  async findAll(): Promise<any> {
    return this.clientsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
  ): Promise<any> {
    return this.clientsService.update(id, dto);
  }

  @Post(':id/delete')
  async delete(@Param('id') id: string): Promise<any> {
    return this.clientsService.remove(id);
  }
}
