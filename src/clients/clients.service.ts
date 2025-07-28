import { DeleteClientService } from './services/client-delete.service';
import { UpdateClientService } from './services/client-update.service';
import { FindOneClientService } from './services/client-find-one.service';
import { FindManyClientsService } from './services/client-find-many.service';
import { CreateClientService } from './services/client-create.service';
import { Injectable } from '@nestjs/common';
import { UpdateClientDto } from './dtos/update-client.dto';
import { CreateClientDto } from './dtos/create-client.dto';
import { RequestWithUserId } from 'src/common/requestWithUserId.interface';
import { CreateClientResponseDto } from './dtos/create-client-response.dto';

@Injectable()
export class ClientsService {
  constructor(
    private readonly createClientService: CreateClientService,
    private readonly findManyClientsService: FindManyClientsService,
    private readonly findOneClientService: FindOneClientService,
    private readonly updateClientService: UpdateClientService,
    private readonly deleteClientService: DeleteClientService,
  ) {}

  async create(
    data: CreateClientDto,
    req: RequestWithUserId,
  ): Promise<CreateClientResponseDto> {
    return this.createClientService.createClient(data, req);
  }

  async findAll(): Promise<any> {
    return this.findManyClientsService.findAllClients();
  }

  async findOne(id: string): Promise<any> {
    return this.findOneClientService.findOneClient(id);
  }

  async update(
    id: string,
    dto: UpdateClientDto,
  ): Promise<{ data: UpdateClientDto; message: string }> {
    return this.updateClientService.updateClient(id, dto);
  }
  async remove(id: string): Promise<object> {
    return this.deleteClientService.deleteClient(id);
  }
}
