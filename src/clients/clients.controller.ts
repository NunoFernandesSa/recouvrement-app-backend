import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestWithUserId } from 'src/common/request-with-user-id';
import { CreateClientResponseDto } from './dto/create-client-response.dto';

@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post('new')
  async create(
    @Body() data: CreateClientDto,
    @Req() req: RequestWithUserId,
  ): Promise<CreateClientResponseDto> {
    return this.clientsService.create(data, req);
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
