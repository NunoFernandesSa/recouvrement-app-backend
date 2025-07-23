import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { CreateClientService } from './services/client-create.service';
import { FindManyClientsService } from './services/client-find-many.service';
import { FindOneClientService } from './services/client-find-one.service';
import { UpdateClientService } from './services/client-update.service';
import { DeleteClientService } from './services/client-delete.service';

@Module({
  imports: [],
  controllers: [ClientsController],
  providers: [
    ClientsService,
    CreateClientService,
    FindManyClientsService,
    FindOneClientService,
    UpdateClientService,
    DeleteClientService,
  ],
  exports: [ClientsService],
})
export class ClientsModule {}
