import { UpdateClientDto } from '../dto/update-client.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateClientService {
  async updateClient(id: string, dto: UpdateClientDto) {}
}
