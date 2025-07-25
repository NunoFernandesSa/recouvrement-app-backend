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
import { RequestWithUserId } from 'src/common/requestWithUserId.interface';
import { CreateClientResponseDto } from './dto/create-client-response.dto';
import { ApiOperation } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @ApiOperation({
    summary: 'Create a new client',
    description: 'Create a new client for the current user',
  })
  @Post('new')
  async create(
    @Body() data: CreateClientDto,
    @Req() req: RequestWithUserId,
  ): Promise<CreateClientResponseDto> {
    return this.clientsService.create(data, req);
  }

  @ApiOperation({
    summary: 'Get all clients',
    description: 'Get all clients for the current user',
  })
  @Get()
  async findAll(): Promise<any> {
    return this.clientsService.findAll();
  }

  @ApiOperation({
    summary: 'Get a client by ID',
    description: 'Get a client by ID for the current user',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.clientsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update a client by ID',
    description: 'Update a client by ID for the current user',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
  ): Promise<any> {
    return this.clientsService.update(id, dto);
  }

  @ApiOperation({
    summary: 'Delete a client by ID',
    description: 'Delete a client by ID for the current user',
  })
  @Post(':id/delete')
  async delete(@Param('id') id: string): Promise<any> {
    return this.clientsService.remove(id);
  }
}
